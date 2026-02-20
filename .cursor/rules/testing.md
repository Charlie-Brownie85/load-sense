---
description: Testing conventions for Vitest + React Testing Library
globs: src/**/*.test.{ts,tsx}
---

# Testing Conventions

- Framework: Vitest + React Testing Library + jest-dom matchers
- Test files live co-located as `__tests__/<name>.test.ts(x)` within each slice
- Pure function tests: import directly, test input/output, cover edge cases
- Component tests: render with RTL, query by role/text, simulate user events
- Never mock FSD layer boundaries in unit tests — test the public API of each slice
- Use `@/*` path alias in test imports, same as production code
- Run `npm run test:ci` (vitest run) to verify — must exit 0 with all passing
