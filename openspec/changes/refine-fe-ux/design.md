## Context

LoadSense is a single-page Next.js 16 dashboard for ACWR-based training load monitoring. The MVP was built with a flat `src/ux/components/` structure holding all 8 UI components, a `src/lib/` folder for domain logic and Prisma, and standard App Router routing under `src/app/`. It uses Tailwind CSS v4 (no config file — theme is in `globals.css`), Material Symbols for icons, and zero external UI libraries. There are no tests, no testing framework, and several UX rough edges (browser-native `window.confirm`, missing hover affordances, no metric explanations).

## Goals / Non-Goals

**Goals:**

- Adopt Feature-Sliced Design (FSD) to enforce clear boundaries between layers and prevent cross-cutting imports as the app grows
- Add a test foundation (vitest + React Testing Library) covering domain logic and critical UI interactions
- Improve dashboard usability: metric tooltips, intuitive card interactions, styled delete confirmation, interactive chart, sticky layout panels
- Zero new runtime dependencies — tooltips and modals built with Tailwind + React primitives

**Non-Goals:**

- Migrating to a component library (shadcn/ui, Radix, etc.)
- Adding a charting library for the weekly load chart — CSS bars remain
- Changing the data model, API contract shape, or Prisma schema
- Adding new pages or routes beyond the existing dashboard
- E2E / integration testing — only unit tests in this pass

## Decisions

### 1. FSD Layer Mapping for Next.js App Router

Restructure `src/` into FSD layers while respecting Next.js conventions (the `app/` directory must stay as the routing layer):

```
src/
├── app/                          # App layer — Next.js routes, layouts, API
│   ├── api/sessions/...          # (unchanged)
│   ├── api/workload/...          # (unchanged)
│   ├── dashboard/
│   │   ├── page.tsx              # Server component (data fetching)
│   │   └── DashboardClient.tsx   # Client orchestrator
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── widgets/                      # Widgets layer — composite UI blocks
│   └── dashboard/
│       ├── index.ts
│       └── ui/
│           ├── StatusOverview.tsx
│           └── WeeklyLoadChart.tsx
├── features/                     # Features layer — user-facing interactions
│   └── session-management/
│       ├── index.ts
│       └── ui/
│           └── SessionModal.tsx
├── entities/                     # Entities layer — domain model + entity UI
│   └── session/
│       ├── index.ts
│       ├── model.ts              # Session types, type config, formatRelativeDate
│       └── ui/
│           └── SessionCard.tsx
├── shared/                       # Shared layer — zero business logic
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── workload.ts
│   │   └── validation.ts
│   ├── ui/
│   │   ├── AcwrGauge.tsx
│   │   ├── ConfirmModal.tsx
│   │   ├── FloatingActionButton.tsx
│   │   ├── MetricCard.tsx
│   │   ├── Navbar.tsx
│   │   ├── StatusBadge.tsx
│   │   └── Tooltip.tsx
│   └── types/
│       └── index.ts
└── generated/                    # Prisma client (unchanged)
```

**FSD import rule**: layers can only import from layers below them: `app → widgets → features → entities → shared`. Barrel `index.ts` files at each slice define the public API. The `@/*` path alias remains, pointing to `./src/*`.

**Why this mapping over keeping `ux/components` flat:** The flat folder doesn't encode any relationships between components. With FSD, `SessionCard` is co-located with its entity model, `WeeklyLoadChart` is a dashboard widget that composes shared primitives, and `SessionModal` is a feature. Developers can reason about what depends on what by looking at the folder path.

**Alternative considered — pages layer:** FSD defines a `pages` layer, but in Next.js App Router the `app/` directory already serves this purpose. Adding a separate `pages/` folder would create confusion. The `app/dashboard/page.tsx` server component is effectively the FSD "page" — it composes widgets, features, and entities.

### 2. Vitest Configuration for Next.js + React

Add vitest with these packages (all devDependencies):
- `vitest` — test runner
- `@vitejs/plugin-react` — JSX transform for component tests
- `@testing-library/react` — render + query utilities
- `@testing-library/jest-dom` — custom matchers (`toBeInTheDocument`, etc.)
- `jsdom` — browser environment simulation

Create `vitest.config.ts` at project root with `environment: "jsdom"`, the React plugin, and path aliases matching `tsconfig.json` (`@/*` → `./src/*`). Add `"test": "vitest"` and `"test:ci": "vitest run"` scripts to `package.json`.

**Test targets in this change:**
- `shared/lib/workload.ts` — all pure functions (computeSessionLoad, computeAcuteLoad, computeChronicLoad, computeACWR, classifyStatus, computeWeeklyLoads, the new `computeWeeklyLoadRanges`)
- `shared/ui/Tooltip.tsx` — renders on hover, hides on mouse leave
- `shared/ui/ConfirmModal.tsx` — renders title/message, calls onConfirm/onCancel
- `entities/session/ui/SessionCard.tsx` — click on card triggers onEdit, click on delete triggers onDelete, pointer cursor present

**Why vitest over Jest:** Vitest shares the Vite ecosystem toolchain (the React plugin, native ESM, TypeScript without transpile config). It's faster for Tailwind/Next.js projects and requires less boilerplate configuration than Jest + babel + ts-jest.

### 3. Tooltip Component — Pure CSS + React State

Build a `Tooltip` wrapper component using CSS `position: absolute` + Tailwind classes. The component accepts `content: ReactNode` and `position?: "top" | "bottom" | "left" | "right"` (default `"top"`). It tracks hover state with `onMouseEnter`/`onMouseLeave` and renders the tooltip conditionally with a fade-in transition.

No portal needed — the tooltip is positioned relative to its parent wrapper. The arrow is a CSS triangle using border tricks.

**Usage sites:**
- `MetricCard` — wraps the label text; tooltip explains what the metric means
- `StatusOverview` — wraps the "Current ACWR Ratio" label
- `WeeklyLoadChart` — each bar gets a tooltip showing the load value on hover

**Why over a tooltip library (Tippy.js, Floating UI):** The tooltip positions are predictable (always above metrics, always above chart bars). No edge detection or collision avoidance is needed. A 30-line component avoids adding a dependency.

### 4. Confirmation Modal — Reuse Existing Modal Pattern

Create a `ConfirmModal` component following the same overlay pattern as `SessionModal`: fixed overlay, centered white card, transition animation. Props: `isOpen`, `onClose`, `onConfirm`, `title`, `message`, optional `confirmLabel` (default "Delete"), `confirmVariant` (default "danger" for red styling).

The `DashboardClient` replaces `window.confirm("Are you sure...")` with state-driven `ConfirmModal` open/close. The delete handler stores the target session ID, opens the modal, and only calls the API on confirm.

**Why a separate component vs. extending SessionModal:** The confirmation dialog is a fundamentally different interaction (yes/no decision vs. form input). Sharing a component would mean conditional rendering branches and confusing prop surfaces. A dedicated `ConfirmModal` is ~40 lines and highly reusable for future destructive actions.

### 5. Session Card — Click-to-Edit, Remove Edit Button

Remove the `edit` (pencil) icon button from `SessionCard`. The entire card becomes clickable via an `onClick` handler that calls `onEdit(id)`. Add `cursor-pointer` to the card's root `div`. The delete button remains but gets `cursor-pointer` added, and its click handler calls `e.stopPropagation()` to prevent triggering the card's edit handler.

**Why stopPropagation on delete vs. separate click regions:** The card is a single interactive surface. Using `stopPropagation` on the delete button is the simplest way to prevent the click from bubbling to the card. The alternative (splitting the card into non-overlapping click regions) would add structural complexity for no UX benefit.

### 6. Weekly Chart — Date Ranges + Hover Interactions

**Date ranges:** Add a new function `computeWeeklyLoadRanges(sessions, referenceDate, weekCount)` to `workload.ts` that returns `{ load: number; startDate: string; endDate: string }[]` with ISO date strings. Weeks are aligned Monday–Sunday. The current week may be partial (starts Monday, ends on the reference date's Sunday). The server component (`page.tsx`) passes these ranges to `DashboardClient`, which passes them to `WeeklyLoadChart`. The bar label format is "Mon D – Mon D" (e.g., "Feb 10–16"), or "Mon D – Mon D" if the range spans months (e.g., "Jan 27 – Feb 2").

**Hover interactions:** Track hovered bar index with `useState<number | null>(null)`. On hover:
- The hovered bar keeps its full color
- All other bars get `opacity-30` via a Tailwind transition
- A `Tooltip` appears above the hovered bar showing the load value (e.g., "1,240 AU")

This is pure CSS + React state — no animation library needed.

**Why Monday–Sunday alignment over rolling 7-day windows:** The current `computeWeeklyLoads` uses rolling windows ending on the reference date, which makes week boundaries unpredictable. Monday–Sunday alignment matches how athletes and coaches think about training weeks and makes the date range labels meaningful.

### 7. Sticky Layout Panels

Make two areas sticky so only the session list scrolls:

1. **Status overview panel (top)**: Add `sticky top-[navbar-height]` (the navbar is already sticky) with `z-10` and a bottom shadow for visual separation.
2. **Weekly load sidebar (left column on desktop)**: On `lg:` screens, add `sticky top-[offset]` where offset accounts for navbar + status panel height. Use `self-start` to prevent the sticky element from stretching to fill the grid row.

On mobile (single-column layout), both sections scroll normally — sticky only applies at `lg:` breakpoint for the sidebar.

**Why CSS `sticky` over JavaScript scroll listeners:** `position: sticky` is GPU-accelerated, requires no JS, and handles scroll boundaries natively. All modern browsers support it. JS-based solutions would add complexity and potential jank.

## Risks / Trade-offs

**[FSD migration touches every import path]** → A single typo could break the build. Mitigation: Perform the restructuring as task #1 before any functional changes. Run `tsc --noEmit` and `next build` after the migration to catch all broken imports. The TypeScript compiler is the safety net.

**[Week alignment change alters chart data]** → Switching from rolling windows to Monday–Sunday alignment means the "current" bar may show a partial week. Users might see lower values for the current week than expected. Mitigation: The label explicitly shows the date range, making it clear the week is partial. Could add a visual indicator (dashed border) for the current partial week.

**[Sticky panels consume viewport space]** → On shorter viewports, the sticky status panel + sidebar could leave little room for the scrollable session list. Mitigation: Only the sidebar is sticky on `lg:` screens. On mobile, nothing is sticky except the navbar. The status panel's sticky offset is set so it scrolls normally until it reaches the navbar.

**[No test coverage for server components]** → Vitest + React Testing Library test client components and pure functions. The server component (`page.tsx`) that does data fetching and Prisma calls is not covered. Mitigation: Server component logic is thin (query + transform + pass props). The domain logic it calls is fully tested via `workload.ts` unit tests.
