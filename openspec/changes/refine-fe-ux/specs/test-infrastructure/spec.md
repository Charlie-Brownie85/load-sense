## ADDED Requirements

### Requirement: Vitest project configuration
The project SHALL include vitest as a dev dependency with a `vitest.config.ts` at the project root. The config SHALL use `jsdom` as the test environment, include the `@vitejs/plugin-react` plugin for JSX support, and configure path aliases matching `tsconfig.json` (`@/*` → `./src/*`).

#### Scenario: Vitest config resolves path aliases
- **WHEN** a test file imports from `@/shared/lib/workload`
- **THEN** vitest SHALL resolve the import to `./src/shared/lib/workload`

#### Scenario: Vitest config enables jsdom
- **WHEN** a test renders a React component
- **THEN** DOM APIs (`document`, `window`) SHALL be available via jsdom

### Requirement: Test scripts in package.json
The project SHALL define `"test": "vitest"` for watch mode and `"test:ci": "vitest run"` for single-run execution in `package.json` scripts.

#### Scenario: Run tests in watch mode
- **WHEN** a developer runs `npm test`
- **THEN** vitest SHALL start in watch mode, re-running tests on file changes

#### Scenario: Run tests in CI mode
- **WHEN** `npm run test:ci` is executed
- **THEN** vitest SHALL run all tests once and exit with code 0 if all pass

### Requirement: Testing library setup
The project SHALL include `@testing-library/react` and `@testing-library/jest-dom` as dev dependencies. A vitest setup file SHALL import `@testing-library/jest-dom/vitest` to make custom matchers (e.g., `toBeInTheDocument`, `toHaveClass`) available globally in all test files.

#### Scenario: Custom matchers are available
- **WHEN** a test file uses `expect(element).toBeInTheDocument()`
- **THEN** the assertion SHALL work without explicit per-file imports of jest-dom matchers

### Requirement: Workload calculation unit tests
The project SHALL include unit tests for all exported functions in the workload module: `computeSessionLoad`, `computeAcuteLoad`, `computeChronicLoad`, `computeACWR`, `classifyStatus`, `computeWeeklyLoads`, and the new `computeWeeklyLoadRanges`. Tests SHALL cover normal cases, edge cases (zero sessions, null ACWR, single session), and boundary values (ACWR thresholds at 0.8, 1.3, 1.5).

#### Scenario: computeSessionLoad multiplies duration by RPE
- **WHEN** `computeSessionLoad(45, 8)` is called
- **THEN** it SHALL return 360

#### Scenario: computeACWR returns null when chronic load is zero
- **WHEN** `computeACWR(100, 0)` is called
- **THEN** it SHALL return `null`

#### Scenario: classifyStatus at exact threshold boundary
- **WHEN** `classifyStatus(0.8)` is called
- **THEN** it SHALL return "Optimal Zone" (0.8 is the lower boundary of the optimal range)

#### Scenario: computeWeeklyLoadRanges returns Monday-Sunday aligned weeks
- **WHEN** `computeWeeklyLoadRanges` is called with sessions spanning 3 weeks
- **THEN** each returned range SHALL have a `startDate` falling on a Monday and an `endDate` falling on a Sunday

### Requirement: Tooltip component unit tests
The project SHALL include unit tests for the Tooltip component verifying hover behavior and content rendering.

#### Scenario: Tooltip hidden by default
- **WHEN** the Tooltip component renders
- **THEN** the tooltip content SHALL NOT be visible in the DOM

#### Scenario: Tooltip appears on hover
- **WHEN** the user hovers over the Tooltip's trigger element
- **THEN** the tooltip content SHALL become visible

#### Scenario: Tooltip disappears on mouse leave
- **WHEN** the user moves the mouse away from the Tooltip's trigger element
- **THEN** the tooltip content SHALL no longer be visible

### Requirement: ConfirmModal component unit tests
The project SHALL include unit tests for the ConfirmModal component verifying rendering, callback invocation, and close behavior.

#### Scenario: ConfirmModal renders title and message
- **WHEN** `ConfirmModal` is rendered with `title="Delete Session"` and `message="Are you sure?"`
- **THEN** both "Delete Session" and "Are you sure?" SHALL be visible in the DOM

#### Scenario: ConfirmModal calls onConfirm
- **WHEN** the user clicks the confirm button
- **THEN** the `onConfirm` callback SHALL be invoked exactly once

#### Scenario: ConfirmModal calls onClose on cancel
- **WHEN** the user clicks the cancel button
- **THEN** the `onClose` callback SHALL be invoked exactly once

### Requirement: SessionCard interaction unit tests
The project SHALL include unit tests for the SessionCard component verifying click-to-edit and delete button behavior.

#### Scenario: Clicking card triggers onEdit
- **WHEN** the user clicks on the session card body
- **THEN** the `onEdit` callback SHALL be invoked with the session's ID

#### Scenario: Clicking delete does not trigger onEdit
- **WHEN** the user clicks the delete button on a session card
- **THEN** the `onDelete` callback SHALL be invoked AND the `onEdit` callback SHALL NOT be invoked

#### Scenario: Card has pointer cursor
- **WHEN** the session card renders
- **THEN** the card root element SHALL have `cursor-pointer` styling
