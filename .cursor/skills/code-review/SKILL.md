---
name: code-review
description: Post-implementation review — checks TypeScript, linting, tests, and FSD architecture compliance. Run after completing implementation tasks or any batch of changes.
---

Run a comprehensive post-implementation review of the codebase.

**Input**: Optionally specify file paths or a change name to scope the review. If omitted, review all recently changed files.

**Steps**

1. **Run TypeScript check**
   ```bash
   npx tsc --noEmit 2>&1
   ```
   Capture output. If errors exist, list each one with file path and line number.

2. **Run ESLint**
   ```bash
   npm run lint 2>&1
   ```
   Capture output. If errors exist, list each one with file path and line number.

3. **Run tests**
   ```bash
   npm run test:ci 2>&1
   ```
   Capture output. If failures exist, list each failing test with the assertion error.

4. **Run production build**
   ```bash
   npm run build 2>&1
   ```
   Capture output. Note any build errors or warnings.

5. **Verify FSD import compliance**

   For every `.ts` and `.tsx` file under `src/` that was modified (or all files if scope is broad), check imports:

   - Files in `src/shared/` MUST NOT import from `@/entities/`, `@/features/`, `@/widgets/`, or `@/app/`
   - Files in `src/entities/` MUST NOT import from `@/features/`, `@/widgets/`, or `@/app/`
   - Files in `src/features/` MUST NOT import from `@/widgets/` or `@/app/`
   - Files in `src/widgets/` MUST NOT import from `@/app/`

   Use grep/search to check for violating import patterns in each layer. Report any violations with the file path, the import line, and which rule it breaks.

6. **Verify barrel export usage**

   Check that imports from other layers use barrel paths, not internal paths:

   - `@/entities/session` is correct
   - `@/entities/session/ui/SessionCard` is a violation

   Search for imports that reference `/ui/`, `/lib/`, `/model` paths across layer boundaries.

7. **Fix all errors found**

   For each issue discovered in steps 1-6:
   - Fix TypeScript errors (type mismatches, missing types, etc.)
   - Fix ESLint errors (follow the existing eslint config)
   - Fix failing tests (update tests or implementation as appropriate)
   - Fix FSD import violations (move the import to use the correct layer/barrel)
   - Fix build errors

   After fixes, re-run the failing check to confirm resolution.

8. **Report results**

**Output**

```
## Code Review Results

| Check              | Status | Issues |
|--------------------|--------|--------|
| TypeScript         | ✓ / ✗  | N      |
| ESLint             | ✓ / ✗  | N      |
| Tests              | ✓ / ✗  | N      |
| Build              | ✓ / ✗  | N      |
| FSD Imports        | ✓ / ✗  | N      |
| Barrel Exports     | ✓ / ✗  | N      |

### Issues Fixed
- <list of issues that were found and fixed>

### Remaining Issues (if any)
- <list of issues that could not be auto-fixed, with explanation>
```

**Guardrails**
- Always run ALL checks, even if early ones pass
- Fix issues in dependency order: TS errors first, then lint, then tests, then build
- If a fix would require a design decision (not just a mechanical correction), report it and ask for guidance instead of guessing
- Never suppress errors with `@ts-ignore`, `eslint-disable`, or similar — fix the root cause
- After fixing, re-run the specific check to confirm resolution before reporting success
