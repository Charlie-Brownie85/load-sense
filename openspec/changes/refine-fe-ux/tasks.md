## 1. FSD Architecture Migration

- [x] 1.1 Create FSD layer directories: `src/shared/ui/`, `src/shared/lib/`, `src/shared/types/`, `src/entities/session/ui/`, `src/entities/session/`, `src/features/session-management/ui/`, `src/widgets/dashboard/ui/`
- [x] 1.2 Move shared types: `src/lib/types.ts` → `src/shared/types/index.ts`
- [x] 1.3 Move shared libs: `src/lib/workload.ts` → `src/shared/lib/workload.ts`, `src/lib/prisma.ts` → `src/shared/lib/prisma.ts`, `src/lib/validation.ts` → `src/shared/lib/validation.ts`
- [x] 1.4 Move shared UI primitives: `src/ux/components/{AcwrGauge,FloatingActionButton,MetricCard,Navbar,StatusBadge}.tsx` → `src/shared/ui/`
- [x] 1.5 Move SessionCard to entity layer: `src/ux/components/SessionCard.tsx` → `src/entities/session/ui/SessionCard.tsx`. Extract `TYPE_CONFIG`, `formatRelativeDate`, and session-related types into `src/entities/session/model.ts`
- [x] 1.6 Move SessionModal to feature layer: `src/ux/components/SessionModal.tsx` → `src/features/session-management/ui/SessionModal.tsx`
- [x] 1.7 Move WeeklyLoadChart to widget layer: `src/ux/components/WeeklyLoadChart.tsx` → `src/widgets/dashboard/ui/WeeklyLoadChart.tsx`
- [x] 1.8 Create barrel `index.ts` files for each slice: `src/entities/session/index.ts`, `src/features/session-management/index.ts`, `src/widgets/dashboard/index.ts`
- [x] 1.9 Update all import paths in `src/app/` (layout.tsx, page.tsx, dashboard/page.tsx, dashboard/DashboardClient.tsx, API routes) to use new FSD paths
- [x] 1.10 Remove empty `src/ux/` and `src/lib/` directories
- [x] 1.11 Run `tsc --noEmit` and `next build` to verify zero TypeScript/lint errors after migration

## 2. Vitest Setup

- [x] 2.1 Install dev dependencies: `vitest`, `@vitejs/plugin-react`, `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`
- [x] 2.2 Create `vitest.config.ts` at project root with jsdom environment, React plugin, and `@/*` path alias resolution
- [x] 2.3 Create vitest setup file that imports `@testing-library/jest-dom/vitest` for global custom matchers
- [x] 2.4 Add `"test": "vitest"` and `"test:ci": "vitest run"` scripts to `package.json`
- [x] 2.5 Verify setup by running `npm run test:ci` (should exit cleanly with 0 tests)

## 3. Tooltip Component

- [x] 3.1 Create `src/shared/ui/Tooltip.tsx` — wrapper component with `content`, `children`, and `position` props; uses `onMouseEnter`/`onMouseLeave` hover state, absolute positioning, dark background, CSS arrow, fade transition
- [x] 3.2 Export Tooltip from shared UI (add to any shared barrel if applicable)

## 4. Confirmation Modal Component

- [x] 4.1 Create `src/shared/ui/ConfirmModal.tsx` — fixed overlay, centered card, `isOpen`/`onClose`/`onConfirm`/`title`/`message`/`confirmLabel`/`confirmVariant` props; danger (red) and primary (blue) button variants; backdrop click calls onClose

## 5. Domain Logic — Weekly Load Ranges

- [x] 5.1 Add `computeWeeklyLoadRanges(sessions, referenceDate, weekCount)` to `src/shared/lib/workload.ts` — returns `{ load: number; startDate: string; endDate: string }[]` with Monday–Sunday aligned weeks
- [x] 5.2 Update `src/app/dashboard/page.tsx` server component to call `computeWeeklyLoadRanges` and pass the result (instead of plain `weeklyLoads` array) to `DashboardClient`

## 6. Dashboard UI Changes

- [x] 6.1 Update `SessionCard` — remove the edit (pencil) button, make entire card clickable via `onClick` calling `onEdit(id)`, add `cursor-pointer` to card root, add `cursor-pointer` to delete button, add `e.stopPropagation()` on delete button click
- [x] 6.2 Update `DashboardClient` — replace `window.confirm` in `handleDelete` with `ConfirmModal` state management: add `deleteTargetId` state, open ConfirmModal on delete click, call API on confirm, clear state on cancel
- [x] 6.3 Update `WeeklyLoadChart` — accept new `weeklyLoadRanges` prop with date range data; replace "W-N"/"Current" labels with formatted date ranges (e.g., "Feb 10–16"); add `hoveredIndex` state; dim non-hovered bars (`opacity-30` transition); show `Tooltip` with load value above hovered bar
- [x] 6.4 Update `DashboardClient` props and type interface — change `weeklyLoads: number[]` to `weeklyLoadRanges: { load: number; startDate: string; endDate: string }[]`; pass down to WeeklyLoadChart
- [x] 6.5 Add Tooltip wrappers to metric labels in `DashboardClient` — wrap "Acute Load" label in MetricCard, "Chronic Load" label in MetricCard, and "Current ACWR Ratio" label; provide explanatory tooltip content for each
- [x] 6.6 Make status overview panel sticky — add `sticky top-[navbar-height] z-10` and bottom shadow classes to the status overview `<section>` in DashboardClient
- [x] 6.7 Make weekly load chart sidebar sticky on desktop — add `lg:sticky lg:top-[offset] lg:self-start` to the left column wrapper in DashboardClient's grid layout

## 7. Unit Tests

- [x] 7.1 Create `src/shared/lib/__tests__/workload.test.ts` — tests for `computeSessionLoad`, `computeAcuteLoad`, `computeChronicLoad`, `computeACWR`, `classifyStatus`, `computeWeeklyLoads`, `computeWeeklyLoadRanges` (including edge cases: zero sessions, null ACWR, threshold boundaries, Monday–Sunday alignment)
- [x] 7.2 Create `src/shared/ui/__tests__/Tooltip.test.tsx` — tests for hidden by default, appears on hover, disappears on mouse leave
- [x] 7.3 Create `src/shared/ui/__tests__/ConfirmModal.test.tsx` — tests for renders title/message, calls onConfirm on confirm click, calls onClose on cancel click, calls onClose on backdrop click
- [x] 7.4 Create `src/entities/session/ui/__tests__/SessionCard.test.tsx` — tests for card click triggers onEdit, delete click triggers onDelete without triggering onEdit, card root has cursor-pointer class

## 8. Verification

- [x] 8.1 Run `tsc --noEmit` — zero TypeScript errors
- [x] 8.2 Run `npm run lint` — zero ESLint errors
- [x] 8.3 Run `npm run test:ci` — all unit tests pass
- [x] 8.4 Run `npm run build` — production build succeeds
