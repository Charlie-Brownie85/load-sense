## Why

Athletes lack a lightweight, analytical tool to track training sessions and monitor overtraining risk using the Acute:Chronic Workload Ratio (ACWR) model. Existing fitness apps are social or gamified — LoadSense fills the gap for performance-focused, data-driven training decisions. The project scaffolding (Next.js + Prisma + Tailwind) is already in place and UX designs are finalized, making this the right time to build the full MVP.

## What Changes

- Add a SQLite-backed data model for training sessions (date, type, duration, RPE, notes)
- Implement full CRUD for sessions via Next.js API routes
- Build pure domain logic for workload calculations: Session Load, Acute Load (7-day), Chronic Load (28-day), and ACWR with status classification
- Create a dashboard UI with ACWR status panel, metric cards, weekly load chart, and session list
- Add an "Add Session" modal for logging workouts with RPE slider, type selector, and notes
- Handle edge cases: insufficient data warnings, unstable CL markers, null ACWR when CL = 0

## Capabilities

### New Capabilities

- `session-tracking`: CRUD operations for training sessions — data model, API routes, validation, and persistence via Prisma/SQLite
- `workload-calculation`: Pure domain logic for computing Session Load (Duration x RPE), Acute Load (7-day sum), Chronic Load (28-day weekly average), ACWR ratio, and status classification (Undertraining / Optimal / Fatigue Risk / High Injury Risk) with edge case handling
- `dashboard-ui`: Presentation layer — top metrics panel with color-coded ACWR badge, weekly training load bar chart, scrollable session card list with edit/delete actions, and the floating "Add Session" modal

### Modified Capabilities

_None — this is a greenfield build with no existing specs._

## Impact

- **Database**: New Prisma schema with `Session` model; SQLite migrations required
- **API**: New Next.js API routes under `/api/sessions` (GET, POST, PUT, DELETE) and `/api/workload` (GET computed metrics)
- **Frontend**: Replace placeholder `page.tsx` with full dashboard; add reusable components for session cards, metric panels, modal, and chart
- **Shared logic**: New `src/lib/workload.ts` module for pure ACWR calculations, importable from both server and client
- **Dependencies**: No new external dependencies expected — leveraging existing Next.js, Prisma, React, and Tailwind stack
