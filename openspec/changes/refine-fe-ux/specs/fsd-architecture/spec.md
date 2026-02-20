## ADDED Requirements

### Requirement: FSD layer structure
The project SHALL organize `src/` into Feature-Sliced Design layers: `app/` (Next.js routes, layouts, API routes), `widgets/` (composite UI blocks), `features/` (user-facing interactions), `entities/` (domain models with entity-specific UI), and `shared/` (reusable utilities, UI primitives, and types with zero business logic). The `generated/` directory for Prisma client output SHALL remain at `src/generated/`.

#### Scenario: Layer directories exist after migration
- **WHEN** the FSD migration is complete
- **THEN** `src/` SHALL contain directories `app/`, `widgets/`, `features/`, `entities/`, `shared/`, and `generated/`

#### Scenario: No orphaned files outside layers
- **WHEN** the FSD migration is complete
- **THEN** there SHALL be no files directly under `src/` outside of the defined layer directories (the previous `src/ux/` and `src/lib/` directories SHALL no longer exist)

### Requirement: FSD import direction rule
Layers SHALL only import from layers below them in the hierarchy: `app → widgets → features → entities → shared`. No layer SHALL import from a layer above it. The `generated/` directory is treated as a peer of `shared/` and MAY be imported from any layer.

#### Scenario: Widget imports from shared and entities only
- **WHEN** a file in `src/widgets/` has import statements
- **THEN** those imports SHALL reference only `@/shared/`, `@/entities/`, or `@/generated/` paths (not `@/features/`, `@/widgets/`, or `@/app/`)

#### Scenario: Entity imports from shared only
- **WHEN** a file in `src/entities/` has import statements to other FSD layers
- **THEN** those imports SHALL reference only `@/shared/` or `@/generated/` paths

#### Scenario: Feature imports from entities and shared
- **WHEN** a file in `src/features/` has import statements to other FSD layers
- **THEN** those imports SHALL reference only `@/shared/`, `@/entities/`, or `@/generated/` paths

### Requirement: Barrel exports for slices
Each slice within `widgets/`, `features/`, and `entities/` SHALL have an `index.ts` barrel file at its root that re-exports the slice's public API. External consumers SHALL import from the barrel, not from internal paths.

#### Scenario: Dashboard widget barrel exports
- **WHEN** a consumer imports from `@/widgets/dashboard`
- **THEN** the import SHALL resolve via `src/widgets/dashboard/index.ts` which re-exports the widget's public components

#### Scenario: Session entity barrel exports
- **WHEN** a consumer imports from `@/entities/session`
- **THEN** the import SHALL resolve via `src/entities/session/index.ts` which re-exports the session model types and `SessionCard` component

### Requirement: Module placement rules
Components and modules SHALL be placed according to their role: reusable UI primitives with no business logic in `shared/ui/`, domain types and constants in `shared/types/`, utility libraries in `shared/lib/`, domain entity models and entity-specific cards in `entities/<entity>/`, user interaction flows (modals, forms) in `features/<feature>/ui/`, and composite layout sections in `widgets/<widget>/ui/`.

#### Scenario: Tooltip lives in shared/ui
- **WHEN** the Tooltip component is created
- **THEN** it SHALL be located at `src/shared/ui/Tooltip.tsx` because it is a generic UI primitive with no domain knowledge

#### Scenario: SessionCard lives in entities
- **WHEN** SessionCard is migrated
- **THEN** it SHALL be located at `src/entities/session/ui/SessionCard.tsx` because it represents the visual form of the Session entity

#### Scenario: WeeklyLoadChart lives in widgets
- **WHEN** WeeklyLoadChart is migrated
- **THEN** it SHALL be located at `src/widgets/dashboard/ui/WeeklyLoadChart.tsx` because it is a composite block that composes shared UI and entity data for the dashboard page

#### Scenario: SessionModal lives in features
- **WHEN** SessionModal is migrated
- **THEN** it SHALL be located at `src/features/session-management/ui/SessionModal.tsx` because it implements a user-facing interaction flow (create/edit session)

### Requirement: Zero lint and TypeScript errors after migration
After the FSD restructuring, the project SHALL compile with zero TypeScript errors (`tsc --noEmit`) and zero ESLint errors (`eslint`). All existing import paths using `@/ux/`, `@/lib/` SHALL be updated to their new FSD locations.

#### Scenario: TypeScript compilation succeeds
- **WHEN** `tsc --noEmit` is run after the migration
- **THEN** it SHALL exit with code 0 and produce no errors

#### Scenario: ESLint passes
- **WHEN** `eslint` is run after the migration
- **THEN** it SHALL report no errors (warnings are acceptable)
