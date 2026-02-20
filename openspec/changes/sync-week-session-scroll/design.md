## Context

The dashboard has two main content areas below the sticky ACWR status panel:

1. **Weekly Load Chart** (left, `WeeklyLoadChart` widget) — shows 5 bars with aggregated load per ISO week (Mon–Sun). Currently hover-only interaction, no click handling, no horizontal scroll.
2. **Session list** (right, inline in `DashboardClient`) — flat `sessions.map(…)` rendering `SessionCard` components, newest first, no grouping, no scroll container, no pagination.

All sessions are fetched at once in the server component (`prisma.session.findMany`) and serialized to the client. The `computeWeeklyLoadRanges` function aggregates load into 5 fixed ISO weeks from the current date. There is no shared state between the chart and the list.

## Goals / Non-Goals

**Goals:**

- Bidirectional navigation: click a week bar → scroll to that week's sessions; scroll sessions → highlight the matching week bar.
- Group sessions by ISO week with visible dividers that act as scroll anchors.
- Paginate the session list to reduce initial payload and support growing datasets.
- Make the weekly widget horizontally scrollable to reveal older weeks beyond the initial 5.
- Polished eased scroll animations (ease-in-out) for all programmatic scroll movements.

**Non-Goals:**

- No changes to ACWR computation, status panel, or domain logic.
- No changes to session CRUD (create/edit/delete).
- No layout restructuring — sidebar + main grid stays.
- Week start day configurability (deferred to settings feature).
- Virtual list / windowed rendering — premature for expected dataset sizes.

## Decisions

### D1 — Week identification via ISO week key

**Decision:** Represent weeks as `"YYYY-Www"` strings (e.g. `"2026-W08"`) derived from the ISO Monday of each week. A shared `getISOWeekKey(date)` utility produces the key; `getWeekBounds(weekKey)` returns the Monday–Sunday date range.

**Why:** A stable string key lets us use it as React keys, IntersectionObserver data attributes, and lookup keys without date comparison ambiguity. ISO 8601 week numbering is well-defined and matches the Mon–Sun week model.

**Alternative considered:** Use `startDate` ISO string as key. Rejected because it's verbose, harder to read in data attributes, and ties the identity to a full timestamp.

**FSD layer:** `shared/lib/week.ts` — pure utility, zero business logic.

### D2 — Session list grouped by week with divider elements

**Decision:** Before rendering, partition sessions by their ISO week key. Render a `WeekDivider` element at each week boundary, followed by that week's `SessionCard`s. Each `WeekDivider` carries a `data-week="YYYY-Www"` attribute and serves as the scroll anchor for that week.

**Why:** Dividers provide visual structure, act as IntersectionObserver targets for sync, and serve as `scrollIntoView` targets for click-to-navigate. Grouping is a pure transform on the already-sorted-by-date list.

**FSD layer:** `entities/session/ui/WeekDivider.tsx` — entity-level UI for session grouping.

### D3 — Bidirectional sync via `useWeekSessionSync` hook

**Decision:** A `features/week-navigation` slice exposes a `useWeekSessionSync` hook that:
1. Accepts a ref to the session list scroll container.
2. Maintains `activeWeekKey` state.
3. **Session → Widget direction:** Sets up an IntersectionObserver on all `[data-week]` divider elements inside the container. When the topmost visible divider changes, `activeWeekKey` updates.
4. **Widget → Session direction:** Exposes `scrollToWeek(weekKey)` which finds the matching `[data-week]` element and triggers an eased smooth scroll.
5. Uses a `programmaticScroll` ref flag to suppress observer-driven updates during a programmatic scroll-to (avoiding feedback loops).

**Why:** Encapsulating sync logic in a feature hook keeps `DashboardClient` lean. The hook only depends on DOM refs and shared utilities, not on widget/entity internals, so FSD imports are clean. The suppression flag prevents the observer from fighting the programmatic scroll.

**Alternative considered:** Putting sync logic directly in `DashboardClient`. Rejected because it would bloat the orchestrator and make testing harder.

**FSD layer:** `features/week-navigation/model/useWeekSessionSync.ts` — user-facing interaction logic.

### D4 — Eased scroll animation via `requestAnimationFrame`

**Decision:** A `smoothScrollTo(container, targetElement, duration?)` function in `shared/lib/smooth-scroll.ts` uses `requestAnimationFrame` with a cubic ease-in-out timing function (`t < 0.5 ? 4t³ : 1 - (-2t + 2)³ / 2`). Default duration: 400ms.

**Why:** The native `scrollTo({ behavior: 'smooth' })` doesn't allow easing control. A rAF loop with a cubic bezier gives the accelerate-then-decelerate feel requested. Keeping it in `shared/lib/` makes it reusable (the weekly widget horizontal scroll uses it too).

**Alternative considered:** CSS `scroll-behavior: smooth`. Rejected because it only applies to user-triggered scrolls and doesn't support custom easing curves.

### D5 — Session pagination: cursor-based API + client infinite scroll

**Decision:**

- **API change:** The GET `/api/sessions` endpoint gains optional `cursor` (session ID) and `limit` (default 20) query params. Returns `{ sessions, nextCursor, hasMore }`. The server component in `page.tsx` uses the same Prisma query but with `take: limit + 1` pattern to detect `hasMore`.
- **Server component:** Continues to fetch ALL sessions for ACWR/weekly-load computation (these need full history). Only the serialized list passed to `DashboardClient` is paginated (first page).
- **Client:** A `features/session-pagination` slice exposes `useSessionPagination` hook. It manages accumulated sessions, loading state, and a sentinel `<div ref={sentinelRef} />` at the bottom of the list. An IntersectionObserver on the sentinel triggers the next page fetch.
- **Weekly load ranges:** Computed server-side from ALL sessions (not paginated). The number of weeks is expanded to cover all time from the earliest session to now. This data is small (each range is ~40 bytes) even for years of history.

**Why:** The ACWR computation inherently requires full session history (28 days minimum, and weekly loads span all time). Paginating the display list separately avoids duplicating that logic client-side. Cursor-based pagination avoids offset drift when sessions are added/deleted.

**Alternative considered:** Paginate everything and compute ACWR client-side. Rejected because it would require fetching all sessions anyway for correct ACWR, defeating the pagination purpose.

**FSD layer:** `features/session-pagination/model/useSessionPagination.ts`

### D6 — Horizontally scrollable weekly widget

**Decision:** `WeeklyLoadChart` receives all weekly load ranges (not just 5). It renders them in a horizontally scrollable `overflow-x-auto` container, newest week on the right. On mount, it scrolls to the rightmost end (current week visible). The `activeWeekKey` prop highlights the active bar. `onWeekClick(weekKey)` fires when a bar is clicked. Each bar carries `data-week` for targeting.

As the user scrolls left to older weeks, no additional fetching is needed (all ranges are pre-computed). The visible window is ~5 bars wide, consistent with the current design.

**Why:** Pre-computing all weekly ranges server-side keeps the widget simple — pure horizontal scroll through pre-rendered bars, no loading states. The data is tiny even for large histories.

**FSD layer:** `widgets/dashboard/ui/WeeklyLoadChart.tsx` — modified (same layer).

### D7 — New file tree

```
src/
├── shared/
│   ├── lib/
│   │   ├── week.ts              ← NEW: getISOWeekKey, getWeekBounds
│   │   ├── smooth-scroll.ts     ← NEW: smoothScrollTo with ease-in-out
│   │   └── workload.ts          ← MODIFIED: computeWeeklyLoadRanges accepts dynamic weekCount
│   └── types/
│       └── index.ts             ← MODIFIED: add PaginatedSessionsResponse type
├── entities/
│   └── session/
│       ├── ui/
│       │   ├── SessionCard.tsx          (unchanged)
│       │   └── WeekDivider.tsx          ← NEW: week group header/divider
│       └── index.ts                     ← MODIFIED: export WeekDivider
├── features/
│   ├── week-navigation/
│   │   ├── model/
│   │   │   └── useWeekSessionSync.ts    ← NEW: bidirectional sync hook
│   │   └── index.ts                     ← NEW: barrel
│   └── session-pagination/
│       ├── model/
│       │   └── useSessionPagination.ts  ← NEW: infinite scroll + fetch
│       └── index.ts                     ← NEW: barrel
├── widgets/
│   └── dashboard/
│       └── ui/
│           └── WeeklyLoadChart.tsx       ← MODIFIED: horizontal scroll, click, activeWeekKey
└── app/
    ├── api/
    │   └── sessions/
    │       └── route.ts                  ← MODIFIED: cursor/limit params
    └── dashboard/
        ├── page.tsx                      ← MODIFIED: paginated first page, all-weeks ranges
        └── DashboardClient.tsx           ← MODIFIED: wires sync + pagination + grouping
```

Layer justifications:
- **`shared/lib/week.ts`** — pure date→string transforms, no business logic.
- **`shared/lib/smooth-scroll.ts`** — generic DOM scroll utility, reusable.
- **`entities/session/ui/WeekDivider.tsx`** — session-domain UI (displays week boundary within a session list). Doesn't depend on features or widgets.
- **`features/week-navigation/`** — user-facing interaction: "navigate sessions by week." Depends on `shared/lib/week.ts` and `shared/lib/smooth-scroll.ts` only.
- **`features/session-pagination/`** — user-facing interaction: "load more sessions." Depends on `shared/types` only.

No new cross-layer imports are introduced that violate FSD.

## Risks / Trade-offs

**[Risk] Full session fetch for ACWR persists** → Mitigation: This is bounded by real-world training data (even 10 years of daily sessions ≈ 3,650 rows). If growth becomes a concern, ACWR computation can move to a materialized view or background job in a future change.

**[Risk] IntersectionObserver scroll sync may jitter on fast scrolling** → Mitigation: Throttle observer callbacks with `requestAnimationFrame` gating. The `programmaticScroll` suppression flag prevents feedback loops during animated scrolls.

**[Risk] Horizontal widget scroll UX may be non-obvious** → Mitigation: Show a subtle fade/gradient on the left edge when there are off-screen older weeks, hinting at scrollability. Consider adding left/right chevron buttons in a future iteration.

**[Risk] Session list needs a dedicated scroll container (currently uses page scroll)** → Mitigation: Wrap the session list in a `div` with `overflow-y-auto` and a fixed height (viewport-relative). This is necessary for IntersectionObserver to work against a scroll container rather than the page. The sticky status panel and weekly chart already use their own stacking context so this change is compatible.
