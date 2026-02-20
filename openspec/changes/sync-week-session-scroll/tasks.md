## Batch 1 — Shared utilities (parallel, no dependencies)

- [x] 1.1 Create `shared/lib/week.ts` with `getISOWeekKey(date: Date | string): string` and `getWeekBounds(weekKey: string): { start: Date; end: Date }` pure functions using ISO week numbering (Monday–Sunday)
- [x] 1.2 Create `shared/lib/smooth-scroll.ts` with `smoothScrollTo(container: HTMLElement, target: HTMLElement, duration?: number): Promise<void>` using `requestAnimationFrame` and cubic ease-in-out (`t < 0.5 ? 4t³ : 1 - (-2t+2)³/2`). Default duration 400ms. Returns a promise that resolves on completion. Cancels if user scrolls manually
- [x] 1.3 Add `PaginatedSessionsResponse` type (`{ sessions: Session[]; nextCursor: number | null; hasMore: boolean }`) to `shared/types/index.ts`

## Batch 2 — Shared tests + entity + API (parallel, depends on Batch 1)

- [x] 2.1 Unit tests for `shared/lib/week.ts` in `shared/lib/__tests__/week.test.ts` — cover: date→weekKey conversion, mid-week dates, Sunday edge case (same week as Monday), weekKey→bounds round-trip, cross-year week boundaries
- [x] 2.2 Unit tests for `shared/lib/smooth-scroll.ts` in `shared/lib/__tests__/smooth-scroll.test.ts` — cover: scrolls to target position, respects custom duration, resolves promise on completion (use fake timers + rAF mocking)
- [x] 2.3 Create `entities/session/ui/WeekDivider.tsx` — renders horizontal divider with week date range label (e.g. "Feb 16 – 22"), `data-week` attribute set to ISO week key. Props: `weekKey: string`, `startDate: string`, `endDate: string`. Export from `entities/session/index.ts` barrel
- [x] 2.4 Add cursor-based pagination to `GET /api/sessions` in `app/api/sessions/route.ts` — accept `cursor` (session ID) and `limit` (default 20) query params. Use Prisma `take: limit + 1` pattern to detect `hasMore`. Return `{ sessions, nextCursor, hasMore }`. Maintain backward compat (no params = first page)

## Batch 3 — Feature hooks + widget refactor (parallel, depends on Batch 2)

- [x] 3.1 Create `features/week-navigation/` slice with `model/useWeekSessionSync.ts` hook and `index.ts` barrel. Hook accepts `containerRef: RefObject<HTMLElement>`, returns `{ activeWeekKey, scrollToWeek }`. Sets up IntersectionObserver on `[data-week]` elements inside the container. Uses `programmaticScroll` ref flag to suppress observer during animated scroll. Calls `smoothScrollTo` for the widget→session direction
- [x] 3.2 Create `features/session-pagination/` slice with `model/useSessionPagination.ts` hook and `index.ts` barrel. Hook accepts `initialSessions`, `initialNextCursor`, `initialHasMore`. Returns `{ sessions, isLoading, sentinelRef }`. Uses IntersectionObserver on sentinel to trigger fetch of next page from `/api/sessions?cursor=...&limit=20`. Appends results. Exposes `reset()` for post-CRUD refresh
- [x] 3.3 Refactor `widgets/dashboard/ui/WeeklyLoadChart.tsx` — accept `activeWeekKey?: string` and `onWeekClick?: (weekKey: string) => void` props. Wrap bar area in `overflow-x-auto` container with fixed bar width (~60px each). Add `data-week` to each bar column. Scroll to rightmost on mount. Add left-edge gradient fade when scrolled. Highlight active bar, dim others. Make bars clickable. Auto-scroll widget to bring active bar into view when `activeWeekKey` changes to an off-screen week
- [x] 3.4 Unit tests for `WeekDivider` in `entities/session/__tests__/WeekDivider.test.tsx` — cover: renders date range label, renders `data-week` attribute, same-month vs cross-month formatting

## Batch 4 — Feature + widget tests (parallel, depends on Batch 3)

- [x] 4.1 Tests for `useWeekSessionSync` in `features/week-navigation/__tests__/useWeekSessionSync.test.ts` — cover: sets activeWeekKey from topmost visible divider, scrollToWeek triggers smooth scroll to target, suppresses observer during programmatic scroll
- [x] 4.2 Tests for `useSessionPagination` in `features/session-pagination/__tests__/useSessionPagination.test.ts` — cover: returns initial sessions, fetches next page on sentinel intersection, stops fetching when hasMore is false, loading state during fetch
- [x] 4.3 Tests for refactored `WeeklyLoadChart` in `widgets/dashboard/__tests__/WeeklyLoadChart.test.tsx` — cover: renders all week bars with data-week attributes, highlights active week bar, calls onWeekClick on bar click, scrolls to rightmost on mount

## Batch 5 — App-layer integration (parallel, depends on Batch 4)

- [x] 5.1 Modify `app/dashboard/page.tsx` — compute dynamic `weekCount` from earliest session to current week. Pass full `weeklyLoadRanges` (all weeks). Serialize only first 20 sessions for list display. Pass `hasMore` and `nextCursor` props to `DashboardClient`
- [x] 5.2 Modify `app/dashboard/DashboardClient.tsx` — wrap session list in a scroll container (`overflow-y-auto` with viewport-relative height). Group sessions by ISO week key, render `WeekDivider` at each boundary. Wire `useWeekSessionSync` with the scroll container ref. Wire `useSessionPagination` with initial data, append sentinel. Pass `activeWeekKey` and `onWeekClick` → `scrollToWeek` to `WeeklyLoadChart`. Update `DashboardClientProps` with new pagination fields

## Batch 6 — Verification (sequential, depends on all above)

- [x] 6.1 Run `npx tsc --noEmit` — zero TypeScript errors
- [x] 6.2 Run `npm run lint` — zero ESLint errors
- [x] 6.3 Run `npm run test:ci` — all tests pass
- [x] 6.4 Run `npm run build` — production build succeeds
