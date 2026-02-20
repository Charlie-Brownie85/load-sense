## Context

LoadSense is a greenfield MVP for a training load management dashboard. The project already has scaffolding in place: Next.js 16 (App Router) with TypeScript, Tailwind CSS v4, Prisma 7 with SQLite, and a placeholder `page.tsx`. UX designs exist as static HTML mockups (`designs/loadsense_dashboard/code.html` and `designs/add_session_modal/code.html`) using Inter font, Material Symbols icons, and a `#1152d4` primary color palette. There is no authentication — this is a single-user local application for the MVP.

## Goals / Non-Goals

**Goals:**

- Deliver a fully functional training session tracker with ACWR workload monitoring
- Keep domain logic pure and testable, decoupled from framework concerns
- Match the UX designs closely for a polished, professional feel
- Ship with zero additional runtime dependencies beyond the existing stack

**Non-Goals:**

- User authentication or multi-tenancy
- Social features, gamification, or leaderboards
- Mobile-native app or PWA capabilities
- Data export/import functionality
- Historical trend analysis beyond the 28-day ACWR window
- Real-time sync or collaborative features

## Decisions

### 1. Data Model — Single `Session` table

Store all training sessions in one Prisma model with fields: `id` (autoincrement), `date` (DateTime), `type` (String enum: Strength | HIIT | Cardio), `duration` (Int, minutes), `rpe` (Int, 1-10), `notes` (String, optional), and `createdAt`/`updatedAt` timestamps.

**Why over a normalized multi-table approach:** The domain is simple — one entity, no relations. A single table keeps migrations trivial, queries fast, and the Prisma schema easy to reason about. If types need to expand later, the string enum approach is flexible without schema migrations.

### 2. API Layer — Next.js App Router Route Handlers

Use `app/api/sessions/route.ts` for collection operations (GET list, POST create) and `app/api/sessions/[id]/route.ts` for item operations (GET one, PUT update, DELETE). Add `app/api/workload/route.ts` for computed metrics (returns AL, CL, ACWR, status).

**Why over Server Actions:** Route handlers give a clean REST-like interface that is easy to test with curl/Postman, keeps the API contract explicit, and cleanly separates data fetching from UI components. Server Actions would couple data mutations to the component tree.

### 3. Domain Logic — Pure TypeScript Module at `src/lib/workload.ts`

All ACWR math lives in a standalone module with no framework imports. Functions: `computeSessionLoad(duration, rpe)`, `computeAcuteLoad(sessions, referenceDate)`, `computeChronicLoad(sessions, referenceDate)`, `computeACWR(acuteLoad, chronicLoad)`, and `classifyStatus(acwr)`. The module also exports the status thresholds as constants.

**Why pure functions over an ORM-level computed column or API-only calculation:** Pure functions are testable without a database, importable on both server (API routes) and client (optimistic UI), and trivially unit-testable. The calculations are the core domain — they deserve to be the most portable code in the system.

### 4. Frontend Architecture — Server Component Shell + Client Islands

A proper Frontend Architecture will be require here to follow best practices and facilitate future scale up of the project. We need clear domain/logic vs UX/presentational separation in the project scaffolding. Although currently the app will consist in one single main page for the dashboard view (the addition/edition of workout sessions will happen on a modal over this one), we need to prepare for the future expansion of the project (things like profile or setting pages might be added). Both project scaffolding and routes need to reflect this. The root path must redirect to `/dashboard` route with the Dashboard view/ page.

Reusable UX components must be defined under `ux/components` folder.

**Why over a fully client-side SPA with fetch:** Server Components give instant first-paint with real data, avoid loading spinners on page load, and leverage Next.js streaming. Client Components are only needed where interactivity is required. This hybrid approach keeps the bundle lean.

### 5. State Management — React `useState` + URL-driven Revalidation

No global state library. The modal open/close state is local `useState`. After a mutation (create/edit/delete session), call `router.refresh()` to revalidate the Server Component data. This keeps the data flow simple: database → server render → client interaction → API mutation → revalidate.

**Why over Zustand/Redux/React Query:** The data flow is linear (one page, one list, one set of metrics). Adding a state management library for a single-page MVP adds dependency weight and complexity without benefit. `router.refresh()` gives free server-side cache invalidation.

### 6. Styling — Tailwind CSS v4 with Design Tokens from Mockups

Adopt the design system from the HTML mockups: Inter font family, `#1152d4` primary blue, `bg-background-light: #f6f6f8` surface, Material Symbols Outlined for icons. Use Tailwind utility classes matching the mockup's class names directly. The existing `globals.css` already loads Tailwind.

**Why over a component library like shadcn/ui:** The mockups use a bespoke design language. Mapping that onto a component library would require extensive overrides. Direct Tailwind classes from the mockups are faster to implement and produce pixel-accurate results.

### 7. Chart — Static CSS Bar Chart

Render the weekly training load chart as styled `div` elements with dynamic height percentages, matching the mockup's bar chart pattern. No charting library.

**Why over Chart.js/Recharts:** The chart is a simple 5-bar sparkline. A charting library would add 50-200KB of bundle for one bar chart. CSS bars with Tailwind achieve the same visual with zero added weight.

## Risks / Trade-offs

**[SQLite file-based storage]** → SQLite is single-writer and file-local. Acceptable for a single-user MVP, but won't scale to multi-user without migrating to Postgres. Mitigation: Prisma abstracts the database — switching providers is a one-line schema change.

**[No authentication]** → Anyone with network access to the dev server can read/write sessions. Mitigation: MVP is designed for local development. Auth is a natural follow-up capability if the app is deployed publicly.

**[String enum for session type]** → No database-level constraint enforcement. Mitigation: Validate at the API layer before persisting. TypeScript union types provide compile-time safety.

**[No optimistic updates]** → After mutations, the UI waits for `router.refresh()` before reflecting changes. This can feel sluggish on slow connections. Mitigation: SQLite is local and fast — refresh round-trips are sub-50ms. Optimistic updates can be layered in later without architectural changes.

**[28-day window hardcoded]** → The ACWR model uses fixed 7/28-day windows. Sports science literature has variations (e.g., exponentially weighted moving averages). Mitigation: Constants are defined in `workload.ts` and can be made configurable later. The pure function architecture makes this a localized change.
