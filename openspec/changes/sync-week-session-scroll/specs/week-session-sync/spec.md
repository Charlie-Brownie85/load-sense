## ADDED Requirements

### Requirement: Bidirectional scroll synchronization between weekly widget and session list

The system SHALL synchronize the weekly load chart and the session list so that navigating one updates the other. A `useWeekSessionSync` hook in `features/week-navigation/` SHALL manage the active week state and coordinate both directions.

**FSD layer:** `features/week-navigation/model/useWeekSessionSync.ts`
**Imports:** `shared/lib/week` (getISOWeekKey, getWeekBounds), `shared/lib/smooth-scroll` (smoothScrollTo)

#### Scenario: Clicking a week bar scrolls the session list to that week

- **WHEN** the user clicks a bar in the weekly load chart
- **THEN** the session list SHALL smooth-scroll to the `WeekDivider` element whose `data-week` attribute matches the clicked week's ISO week key
- **AND** the scroll animation SHALL use ease-in-out timing (accelerate then decelerate)

#### Scenario: Scrolling sessions updates the active week in the widget

- **WHEN** the user scrolls the session list such that a different `WeekDivider` becomes the topmost visible element
- **THEN** the `activeWeekKey` state SHALL update to that divider's ISO week key
- **AND** the weekly load chart SHALL visually highlight the corresponding bar

#### Scenario: Feedback loop suppression during programmatic scroll

- **WHEN** a programmatic scroll-to-week animation is in progress
- **THEN** the IntersectionObserver-driven active-week updates SHALL be suppressed until the animation completes
- **AND** the `activeWeekKey` SHALL only reflect the target week of the programmatic scroll

#### Scenario: Initial active week on page load

- **WHEN** the dashboard loads for the first time
- **THEN** the `activeWeekKey` SHALL be set to the ISO week key of the topmost (most recent) session's date

### Requirement: Eased smooth scroll animation utility

The system SHALL provide a `smoothScrollTo(container, targetElement, duration?)` function that performs programmatic scrolling with a cubic ease-in-out timing function. Default duration SHALL be 400ms.

**FSD layer:** `shared/lib/smooth-scroll.ts`
**Imports:** none (pure utility)

#### Scenario: Smooth scroll with default duration

- **WHEN** `smoothScrollTo` is called with a container and target element
- **THEN** the container SHALL scroll to bring the target element into view over 400ms
- **AND** the scroll speed SHALL accelerate during the first half and decelerate during the second half

#### Scenario: Smooth scroll with custom duration

- **WHEN** `smoothScrollTo` is called with a duration of 600ms
- **THEN** the animation SHALL complete in approximately 600ms

#### Scenario: Interruption by user scroll

- **WHEN** the user manually scrolls during a programmatic animation
- **THEN** the animation SHALL stop and yield to the user's scroll input

### Requirement: ISO week key utilities

The system SHALL provide `getISOWeekKey(date)` and `getWeekBounds(weekKey)` pure functions for converting between dates and ISO week identifiers in `"YYYY-Www"` format, using Monday as the start of the week.

**FSD layer:** `shared/lib/week.ts`
**Imports:** none (pure utility)

#### Scenario: Converting a date to an ISO week key

- **WHEN** `getISOWeekKey` is called with a `Date` or ISO date string
- **THEN** it SHALL return a string in `"YYYY-Www"` format (e.g., `"2026-W08"`)

#### Scenario: Converting a Wednesday to a week key

- **WHEN** `getISOWeekKey` is called with `2026-02-18` (a Wednesday)
- **THEN** it SHALL return `"2026-W08"` (the ISO week containing that Wednesday)

#### Scenario: Getting week bounds from a week key

- **WHEN** `getWeekBounds` is called with `"2026-W08"`
- **THEN** it SHALL return `{ start: Date(2026-02-16), end: Date(2026-02-22) }` representing Monday through Sunday

#### Scenario: Week key for a Sunday at end of week

- **WHEN** `getISOWeekKey` is called with `2026-02-22` (a Sunday)
- **THEN** it SHALL return `"2026-W08"` (same week as its Monday `2026-02-16`)
