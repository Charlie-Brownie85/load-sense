---
description: Rules for Next.js API route handlers
globs: src/app/api/**/*.ts
---

# API Route Conventions

- Use Next.js App Router route handlers (export async functions named GET, POST, PUT, DELETE)
- Import Prisma client from `@/shared/lib/prisma`
- Import validation from `@/shared/lib/validation`
- Return `NextResponse.json()` with appropriate status codes
- Validate request body before any database operation
- Keep handlers thin — domain logic belongs in `@/shared/lib/`
- Never import from entities, features, or widgets layers
