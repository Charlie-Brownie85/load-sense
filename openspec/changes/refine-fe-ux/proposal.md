## Why

The LoadSense MVP is functional but has rough edges that hurt usability and maintainability. The project uses a flat `ux/components` structure that will become unwieldy as the app grows — adopting Feature-Sliced Design (FSD) provides a scalable, convention-driven architecture. Several UI interactions rely on browser-native behavior (e.g., `window.confirm` for delete) or lack affordance cues (no pointer cursors, no tooltips explaining domain-specific metrics). There are also zero tests. Addressing these now — before the next wave of features — prevents compounding tech debt.

## What Changes

- Restructure `src/` to follow [Feature-Sliced Design](https://feature-sliced.design/) conventions: layers (`app`, `pages`, `features`, `entities`, `shared`), with slices for domain concepts (sessions, workload)
- Add **vitest** to the project with proper Next.js/React/TypeScript configuration and write unit tests for existing business logic and new UI components
- Add **tooltips** to the top panel metrics (Acute Load, Chronic Load, Current ACWR Ratio) explaining what each metric means on hover
- Make **session cards fully clickable** to open edit mode — remove the standalone edit button; clicking the whole card opens the session modal with pre-populated values. Pointer cursor on card and delete button
- Replace `window.confirm` with a styled **confirmation modal** component for the delete action, consistent with the app's design language
- Add **hover interactions** to the weekly load chart: dim non-hovered bars, highlight hovered bar, show tooltip with the workload value
- Replace "W-4", "W-3" etc. labels on weekly bars with **summarized date ranges** (Mon–Sun of each week, e.g., "Feb 10–16")
- Make the **top status panel** and **weekly load sidebar** sticky so only the session list scrolls vertically

## Capabilities

### New Capabilities

- `fsd-architecture`: Restructure the project to follow Feature-Sliced Design — define layer boundaries (app, pages, features, entities, shared), move existing modules into their proper slices, update all import paths, and ensure zero lint/TS errors after migration
- `test-infrastructure`: Add vitest with React Testing Library to the project — configure for Next.js/TypeScript, add test scripts to package.json, write unit tests for workload calculation logic and key UI components (Tooltip, ConfirmModal, SessionCard click behavior)
- `tooltip-component`: A reusable tooltip UI primitive that appears on hover with configurable content and position — used by metric cards and the weekly chart bars
- `confirm-modal`: A styled confirmation dialog component replacing `window.confirm` — modal overlay with title, message, Cancel/Confirm buttons, consistent with existing modal styling

### Modified Capabilities

- `dashboard-ui`: Multiple interaction and layout changes — session cards become fully clickable (removing the edit button), sticky positioning for the status panel and weekly sidebar, weekly chart bars show date ranges instead of relative week labels, weekly chart bars gain hover effects (dimming + tooltip)

## Impact

- **Project structure**: All files under `src/` will be reorganized into FSD layers; every existing import path with `@/ux/`, `@/lib/`, `@/app/` will need updating
- **Dependencies**: New dev dependencies — `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
- **Components affected**: `DashboardClient.tsx`, `SessionCard.tsx`, `WeeklyLoadChart.tsx`, `MetricCard.tsx`, `SessionModal.tsx` (delete flow), plus new `Tooltip` and `ConfirmModal` components
- **API routes**: The workload API must return week boundary dates (start/end) alongside weekly load values so the chart can display date ranges
- **No database changes**: Schema and migrations remain untouched
