# LoadSense — Agent Guidelines

## Project Overview

LoadSense is a Next.js 16 single-page dashboard for ACWR-based training load monitoring.
Tech stack: TypeScript (strict), React 19, Next.js 16 App Router, Tailwind CSS v4 (theme in globals.css, no tailwind.config), Prisma 7 with libSQL, Vitest + React Testing Library. Zero external UI libraries — all components are hand-built with Tailwind + React primitives. Material Symbols for icons.

## Architecture — Feature-Sliced Design (FSD)

```
src/
├── app/           # App layer — Next.js routes, layouts, API handlers
├── widgets/       # Widgets — composite UI blocks (compose features/entities)
├── features/      # Features — user-facing interactions
├── entities/      # Entities — domain models + entity-scoped UI
├── shared/        # Shared — pure utilities, UI primitives, types (zero business logic)
└── generated/     # Prisma client (auto-generated, never edit)
```

### Import Rule (strict)

Layers can ONLY import from layers below them:

    app → widgets → features → entities → shared

Violations of this rule are bugs. Specifically:
- `shared/` MUST NOT import from `entities/`, `features/`, `widgets/`, or `app/`
- `entities/` MUST NOT import from `features/`, `widgets/`, or `app/`
- `features/` MUST NOT import from `widgets/` or `app/`
- `widgets/` MUST NOT import from `app/`
- Cross-slice imports within the same layer are allowed but discouraged

### Barrel Exports

Each slice exposes its public API via an `index.ts` barrel file. Consumers import from the barrel, never from internal paths.

```typescript
// Correct
import { SessionCard } from "@/entities/session";

// Wrong — bypasses barrel
import { SessionCard } from "@/entities/session/ui/SessionCard";
```

### Path Alias

All imports use the `@/*` alias pointing to `./src/*`. Never use relative paths that cross layer boundaries.

## Conventions

- **No external UI libraries.** Tooltips, modals, badges — all built with Tailwind + React.
- **Server components are thin.** Data fetching + transform + pass props. Domain logic lives in `shared/lib/`.
- **Client components use `"use client"` directive.** Only at component file top, never in barrel files.
- **Tailwind v4** — no config file. Theme tokens defined in `src/app/globals.css`.
- **Material Symbols Outlined** for icons, via Google Fonts link.
- **Tests** live co-located as `__tests__/` directories within each slice.

## Task Planning — Parallel Batching

When generating implementation tasks (OpenSpec `tasks.md` or any plan):

1. Group tasks into numbered **batches** where each batch is a parallelization boundary
2. Within a batch, all tasks MUST be independent — no shared file edits, no ordering dependencies
3. Between batches, all tasks from the prior batch must be complete before the next batch starts
4. Use the format: `## Batch N — <theme>` with a note on dependencies
5. Target 2-4 parallel tasks per batch when possible

### Batch example

```markdown
## Batch 1 — Foundation (sequential, order matters)
- [ ] 1.1 Create directory structure
- [ ] 1.2 Move shared types

## Batch 2 — Independent components (parallel)
- [ ] 2.1 Build Tooltip component
- [ ] 2.2 Build ConfirmModal component
- [ ] 2.3 Add domain utility function

## Batch 3 — Integration (depends on Batch 2)
- [ ] 3.1 Wire Tooltip into DashboardClient
- [ ] 3.2 Wire ConfirmModal into delete flow
```

## Test Requirements

Every new feature, component, or utility function MUST include unit tests unless technically infeasible (e.g., thin server components that only fetch and pass props). Specifically:

- **New `shared/lib/` function** → test file in `shared/lib/__tests__/` covering inputs, outputs, and edge cases
- **New UI component** (`shared/ui/`, `entities/*/ui/`, `features/*/ui/`, `widgets/*/ui/`) → test file in the slice's `__tests__/` directory covering rendering, user interactions, and prop variants
- **New entity model** (`entities/*/model.ts`) → test the exported helpers and type guards
- **Bug fix** → add a regression test that would have caught the bug

Tests are not optional. If a task creates or modifies a function/component, a corresponding test task must exist in the same batch or the next batch. Plans that omit tests for testable code are incomplete.

## Post-Implementation Verification

After completing implementation tasks, always run:
1. `npx tsc --noEmit` — zero TypeScript errors
2. `npm run lint` — zero ESLint errors
3. `npm run test:ci` — all tests pass
4. `npm run build` — production build succeeds

Fix any errors before marking tasks complete.
