## Why

The weekly load chart and the sessions list are currently disconnected — users can see aggregated load per week on the left but have no way to quickly navigate to sessions within a specific week, or to know which week they're looking at while scrolling through sessions. As the number of sessions grows, the flat unscrolled list becomes unwieldy. Linking these two panels with bidirectional scroll synchronization and introducing infinite scroll turns the dashboard into a cohesive navigational experience.

## What Changes

- **Bidirectional scroll sync**: clicking a week bar in the weekly widget smooth-scrolls the session list to that week's sessions; scrolling the session list updates the active/highlighted bar in the weekly widget to match the topmost visible session's ISO week.
- **Week dividers in session list**: horizontal dividers with week labels separate sessions belonging to different ISO weeks (Monday–Sunday).
- **Horizontally scrollable weekly widget**: the widget remains fixed-width but becomes horizontally scrollable — newer weeks on the right, older weeks revealed by scrolling left. The widget dynamically loads older weeks as the user scrolls backward.
- **Infinite scroll for sessions**: cursor-based server pagination replaces the current all-at-once fetch. The session list loads more sessions on scroll-down via an IntersectionObserver sentinel.
- **Eased scroll animations**: programmatic scrollTo calls use ease-in-out timing (accelerate at start, decelerate at end) for polished feel.

## Non-Goals

- No changes to session CRUD (create, edit, delete flows stay as-is).
- No changes to ACWR calculation or domain logic.
- No changes to overall layout structure (sidebar + main grid).
- Week start day configurability is deferred to a future settings feature.

## Capabilities

### New Capabilities

- `week-session-sync`: Bidirectional scroll synchronization between weekly widget bars and the session list, including eased scroll-to animations and active-week highlighting driven by topmost visible session.
- `session-week-grouping`: Grouping the session list by ISO week with labeled horizontal dividers between week boundaries.
- `session-pagination`: Cursor-based server-side pagination API and client-side infinite scroll for the session list using IntersectionObserver.
- `scrollable-weekly-widget`: Horizontal scrolling in the weekly widget with dynamic loading of older weeks as the user scrolls left.

### Modified Capabilities

_(none — no existing main specs)_

## Impact

- **`src/app/dashboard/page.tsx`**: server component switches from fetching all sessions to a paginated first page.
- **`src/app/api/sessions/route.ts`**: GET endpoint gains cursor/limit query params.
- **`src/app/dashboard/DashboardClient.tsx`**: major rework — manages active week state, scroll observers, infinite scroll state, and passes sync callbacks to child components.
- **`src/widgets/dashboard/ui/WeeklyLoadChart.tsx`**: becomes horizontally scrollable, supports click-to-select and external active-week prop.
- **`src/entities/session/`**: new `WeekDivider` UI or week-grouping logic.
- **`src/shared/lib/workload.ts`**: `computeWeeklyLoadRanges` may need to support dynamic week counts.
- **FSD layers affected**: shared (utilities, types), entities (session grouping), widgets (weekly chart), app (page, API, client orchestration).
