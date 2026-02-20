## 1. Project Scaffolding & Configuration

- [x] 1.1 Set up folder structure: create `src/ux/components/` for reusable UI components, ensure `src/lib/` exists for domain logic
- [x] 1.2 Configure Tailwind CSS v4 design tokens — extend theme with primary `#1152d4`, background-light `#f6f6f8`, background-dark `#101622`, Inter font family, and custom border-radius values matching the design mockups
- [x] 1.3 Add Material Symbols Outlined font import to the root layout
- [x] 1.4 Set up routing: create `src/app/dashboard/page.tsx` and configure root `src/app/page.tsx` to redirect `/` to `/dashboard`
- [x] 1.5 Update root layout (`src/app/layout.tsx`) with Inter font, updated metadata title/description, and dark mode support class

## 2. Database & Data Model

- [x] 2.1 Define `Session` model in `prisma/schema.prisma` with fields: `id` (Int autoincrement), `date` (DateTime), `type` (String), `duration` (Int), `rpe` (Int), `notes` (String optional), `createdAt` (DateTime default now), `updatedAt` (DateTime auto-updated)
- [x] 2.2 Run `prisma migrate dev` to create the SQLite migration and generate the Prisma client
- [x] 2.3 Create shared TypeScript types in `src/lib/types.ts`: `SessionType` union ("Strength" | "HIIT" | "Cardio"), `TrainingStatus` union, `WorkloadMetrics` interface, and `Session` interface matching the Prisma model

## 3. Domain Logic — Workload Calculations

- [x] 3.1 Create `src/lib/workload.ts` with exported constants: `ACUTE_WINDOW_DAYS = 7`, `CHRONIC_WINDOW_DAYS = 28`, `CHRONIC_WEEKS = 4`, and ACWR threshold constants
- [x] 3.2 Implement `computeSessionLoad(duration: number, rpe: number): number` — returns `duration * rpe`
- [x] 3.3 Implement `computeAcuteLoad(sessions, referenceDate): number` — sums session loads within the 7-day window (reference date inclusive)
- [x] 3.4 Implement `computeChronicLoad(sessions, referenceDate): number` — sums session loads in 28-day window and divides by 4
- [x] 3.5 Implement `computeACWR(acuteLoad, chronicLoad): number | null` — returns ratio or null when chronicLoad is 0
- [x] 3.6 Implement `classifyStatus(acwr: number | null): TrainingStatus` — maps ACWR to status string using threshold ranges
- [x] 3.7 Implement `computeWeeklyLoads(sessions, referenceDate, weekCount): number[]` — returns array of weekly load totals for the chart
- [x] 3.8 Implement `getDataSufficiencyFlags(sessions, referenceDate)` — returns `{ isAcuteIncomplete: boolean, isChronicUnstable: boolean }` based on session date coverage

## 4. API Layer — Session CRUD

- [x] 4.1 Create session validation helper in `src/lib/validation.ts` — validates type is in allowed set, rpe is 1-10, duration is positive, date is valid; returns structured errors
- [x] 4.2 Implement `src/app/api/sessions/route.ts` GET handler — queries all sessions ordered by date descending, returns JSON array with 200
- [x] 4.3 Implement `src/app/api/sessions/route.ts` POST handler — validates body, creates session via Prisma, returns created session with 201; returns 400 on validation failure
- [x] 4.4 Implement `src/app/api/sessions/[id]/route.ts` PUT handler — validates body, updates session by id, returns updated session with 200; returns 404 if not found
- [x] 4.5 Implement `src/app/api/sessions/[id]/route.ts` DELETE handler — deletes session by id, returns 200; returns 404 if not found

## 5. API Layer — Workload Metrics

- [x] 5.1 Implement `src/app/api/workload/route.ts` GET handler — fetches all sessions, computes AL, CL, ACWR, status, weeklyLoads, and data sufficiency flags using `workload.ts` functions; returns JSON with 200

## 6. Reusable UI Components

- [x] 6.1 Create `src/ux/components/Navbar.tsx` — sticky top nav with LoadSense logo (analytics Material Symbol in primary), title, notification icon, and avatar placeholder matching the dashboard mockup
- [x] 6.2 Create `src/ux/components/StatusBadge.tsx` — color-coded pill badge component that accepts a `TrainingStatus` and renders with the correct background color (emerald for Optimal, red for High Injury Risk, amber for Fatigue Risk, slate for Undertraining, gray for Insufficient Data) and icon
- [x] 6.3 Create `src/ux/components/MetricCard.tsx` — reusable card for displaying a single metric (label, value, subtitle) matching the Acute Load / Chronic Load cards in the mockup
- [x] 6.4 Create `src/ux/components/AcwrGauge.tsx` — horizontal gauge bar showing Recovery / Optimal / Overreach zones with a positioned indicator dot based on ACWR value
- [x] 6.5 Create `src/ux/components/WeeklyLoadChart.tsx` — CSS-based bar chart accepting `weeklyLoads` array, rendering bars with progressive opacity and the current week highlighted in solid primary with shadow
- [x] 6.6 Create `src/ux/components/SessionCard.tsx` — session list card with type-colored icon (orange bolt for HIIT, blue dumbbell for Strength, green runner for Cardio), title, relative date, duration, RPE, load badge, and hover-revealed edit/delete buttons
- [x] 6.7 Create `src/ux/components/SessionModal.tsx` — client component modal with form: date picker (default today), duration number input, session type select dropdown, RPE range slider with live value display, optional notes textarea, Cancel and Save buttons; supports both create (empty form) and edit (pre-populated) modes
- [x] 6.8 Create `src/ux/components/FloatingActionButton.tsx` — fixed-position "Add Session" button with primary background, shadow, and hover scale effect matching the mockup

## 7. Dashboard Page Assembly

- [x] 7.1 Implement `src/app/dashboard/page.tsx` as a Server Component — fetch sessions and workload metrics via direct Prisma queries and workload.ts functions (no API round-trip for initial render)
- [x] 7.2 Build the status overview panel section — compose StatusBadge, large ACWR number display, MetricCard for AL and CL, and AcwrGauge into the top section matching the mockup layout
- [x] 7.3 Build the two-column layout: WeeklyLoadChart in left 1/3 column, session list in right 2/3 column, stacking to single column on mobile
- [x] 7.4 Render the session list using SessionCard components mapped over fetched sessions, with empty state message when no sessions exist
- [x] 7.5 Wire up the SessionModal as a client island — manage open/close state with `useState`, handle create via POST to `/api/sessions`, handle edit via PUT to `/api/sessions/[id]`, call `router.refresh()` after mutations
- [x] 7.6 Wire up delete functionality — on SessionCard delete click, show confirmation (window.confirm or inline), send DELETE to `/api/sessions/[id]`, call `router.refresh()`
- [x] 7.7 Connect the FloatingActionButton to open the SessionModal in create mode

## 8. Edge Cases & Polish

- [x] 8.1 Handle insufficient data states in the status panel — show "—" for null ACWR, gray "Insufficient Data" badge, and visual warning on unstable Chronic Load
- [x] 8.2 Display acute data incomplete warning when fewer than 7 days of session data exist
- [x] 8.3 Ensure responsive layout works correctly: test status panel, chart, and session list stacking on viewports below 768px
- [x] 8.4 Add empty state for session list — friendly message and prompt to add first session when no sessions exist
- [x] 8.5 Verify all session type icons and colors render correctly for each type (Strength → blue/dumbbell, HIIT → orange/bolt, Cardio → green/runner)

## 9. Database Seed (Optional)

- [x] 9.1 Create `prisma/seed.ts` with sample training sessions spanning 28+ days across all three session types to demonstrate the full dashboard with realistic ACWR data
- [x] 9.2 Configure `prisma.seed` in `package.json` and verify `npx prisma db seed` populates the database correctly
