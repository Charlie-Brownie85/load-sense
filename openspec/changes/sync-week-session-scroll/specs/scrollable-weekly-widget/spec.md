## ADDED Requirements

### Requirement: Weekly widget receives all historical week ranges

The `WeeklyLoadChart` component SHALL accept all weekly load ranges from the earliest session to the current week, not just the most recent 5. The server component SHALL compute ranges for all weeks that span the session history.

**FSD layer:** `widgets/dashboard/ui/WeeklyLoadChart.tsx`
**Imports:** `shared/lib/workload` (WeeklyLoadRange), `shared/lib/week` (getISOWeekKey)

#### Scenario: User has 12 weeks of session history

- **WHEN** the earliest session is 12 weeks ago
- **THEN** `WeeklyLoadChart` SHALL receive 12 `WeeklyLoadRange` entries
- **AND** they SHALL be ordered from oldest (left) to newest (right)

#### Scenario: User has only 3 weeks of history

- **WHEN** the earliest session is 3 weeks ago
- **THEN** `WeeklyLoadChart` SHALL receive 3 `WeeklyLoadRange` entries

### Requirement: Horizontally scrollable bar container

The weekly widget bar area SHALL be horizontally scrollable. The visible viewport SHALL show approximately 5 bars at a time, consistent with the current design. Older weeks SHALL be accessible by scrolling left.

**FSD layer:** `widgets/dashboard/ui/WeeklyLoadChart.tsx`
**Imports:** none beyond React

#### Scenario: More than 5 weeks of data

- **WHEN** the widget receives 10 weekly ranges
- **THEN** the bar container SHALL be horizontally scrollable
- **AND** approximately 5 bars SHALL be visible at a time

#### Scenario: 5 or fewer weeks of data

- **WHEN** the widget receives 5 or fewer weekly ranges
- **THEN** the bar container SHALL display all bars without horizontal scrolling

#### Scenario: Initial scroll position

- **WHEN** the widget mounts
- **THEN** it SHALL scroll to the rightmost position so the most recent week is visible

### Requirement: Left-edge scrollability hint

When older weeks exist beyond the left edge of the visible area, the widget SHALL display a visual cue (gradient fade or similar) on the left edge to indicate more content is available by scrolling left.

**FSD layer:** `widgets/dashboard/ui/WeeklyLoadChart.tsx`
**Imports:** none

#### Scenario: Hidden weeks to the left

- **WHEN** the widget has not been scrolled fully left and older weeks are off-screen
- **THEN** a gradient fade or visual indicator SHALL appear on the left edge

#### Scenario: Fully scrolled to the left

- **WHEN** the user scrolls the widget all the way to the left
- **THEN** the left-edge indicator SHALL disappear

#### Scenario: No hidden weeks

- **WHEN** all week bars fit within the visible area
- **THEN** no scrollability indicator SHALL be shown

### Requirement: Active week highlighting via prop

The `WeeklyLoadChart` SHALL accept an `activeWeekKey` prop (ISO week key string). The bar corresponding to the active week SHALL be visually distinguished from other bars with a stronger color and/or emphasis treatment.

**FSD layer:** `widgets/dashboard/ui/WeeklyLoadChart.tsx`
**Imports:** none beyond props

#### Scenario: Active week bar is highlighted

- **WHEN** `activeWeekKey` is `"2026-W08"` and the widget contains a bar for that week
- **THEN** that bar SHALL have a visually prominent style (e.g., full primary color, shadow)
- **AND** other bars SHALL have a subdued style

#### Scenario: Active week changes

- **WHEN** `activeWeekKey` changes from `"2026-W08"` to `"2026-W07"`
- **THEN** the highlight SHALL move from the W08 bar to the W07 bar

#### Scenario: Active week is off-screen

- **WHEN** `activeWeekKey` refers to a week that is not currently visible in the scroll viewport
- **THEN** the widget SHALL auto-scroll to bring the active week's bar into view using eased animation

### Requirement: Click-to-navigate on week bars

Each bar in the weekly widget SHALL be clickable. Clicking a bar SHALL invoke an `onWeekClick(weekKey)` callback prop with the bar's ISO week key.

**FSD layer:** `widgets/dashboard/ui/WeeklyLoadChart.tsx`
**Imports:** none beyond props

#### Scenario: User clicks a week bar

- **WHEN** the user clicks the bar for ISO week `"2026-W06"`
- **THEN** `onWeekClick` SHALL be called with `"2026-W06"`

#### Scenario: Click target includes the full bar area

- **WHEN** the user clicks anywhere within a bar's column (bar itself or the label below)
- **THEN** it SHALL trigger the `onWeekClick` callback for that week

### Requirement: Weekly load ranges computed for full session history

The `computeWeeklyLoadRanges` function SHALL accept a dynamic `weekCount` parameter. The server component SHALL compute this count based on the span from the earliest session date to the current week.

**FSD layer:** `shared/lib/workload.ts`
**Imports:** none (pure utility)

#### Scenario: Dynamic week count from session history

- **WHEN** the earliest session is 15 weeks ago
- **THEN** `computeWeeklyLoadRanges` SHALL be called with `weekCount >= 15`
- **AND** it SHALL return ranges covering all 15+ weeks

#### Scenario: No sessions

- **WHEN** there are no sessions
- **THEN** the server component SHALL pass an empty array or a single current-week range
