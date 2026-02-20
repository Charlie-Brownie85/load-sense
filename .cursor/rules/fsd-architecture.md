---
description: FSD layer import rules for the LoadSense project
globs: src/**/*.{ts,tsx}
---

# FSD Architecture Rules

This project uses Feature-Sliced Design with strict layer hierarchy:

    app → widgets → features → entities → shared

## Layer boundaries

- `src/shared/**` — MUST NOT import from entities, features, widgets, or app
- `src/entities/**` — MUST NOT import from features, widgets, or app
- `src/features/**` — MUST NOT import from widgets or app
- `src/widgets/**` — MUST NOT import from app
- `src/app/**` — can import from any layer

## Import style

- Always import from barrel `index.ts` files, never internal paths
- Always use `@/*` path alias (maps to `./src/*`)
- Never use relative paths that cross layer boundaries

## Placing new code

- Pure utilities, UI primitives, types with no business logic → `src/shared/`
- Domain models and entity-scoped UI → `src/entities/<entity-name>/`
- User-facing interactions (forms, flows) → `src/features/<feature-name>/`
- Composite blocks that combine features and entities → `src/widgets/<widget-name>/`
- Routes, layouts, API handlers → `src/app/`
- Every new slice needs a barrel `index.ts` exporting its public API

## New component checklist

1. Determine which FSD layer it belongs to
2. Create the file in the correct `ui/` subdirectory of the slice
3. Export it from the slice's `index.ts` barrel
4. Verify imports only reference layers below
