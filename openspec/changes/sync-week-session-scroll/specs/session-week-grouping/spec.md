## ADDED Requirements

### Requirement: Sessions grouped by ISO week with visual dividers

The session list SHALL partition sessions by their ISO week key and render a `WeekDivider` component at each week boundary. Sessions within the same week SHALL appear consecutively, ordered by date descending. The divider SHALL display a human-readable week date range label.

**FSD layer:** `entities/session/ui/WeekDivider.tsx`
**Imports:** `shared/lib/week` (getISOWeekKey)

#### Scenario: Sessions from different weeks separated by dividers

- **WHEN** the session list contains sessions from 3 different ISO weeks
- **THEN** 3 `WeekDivider` elements SHALL be rendered, each preceding its week's sessions
- **AND** each divider SHALL display the week's date range (e.g., "Feb 10 – Feb 16")

#### Scenario: Sessions within the same week grouped together

- **WHEN** 4 sessions all fall within the same ISO week
- **THEN** they SHALL appear under a single `WeekDivider` without any dividers between them
- **AND** they SHALL be ordered by date descending within the group

#### Scenario: Empty week with no sessions

- **WHEN** there are no sessions in a given ISO week between two weeks that do have sessions
- **THEN** no `WeekDivider` SHALL be rendered for that empty week (only weeks with sessions get dividers)

### Requirement: WeekDivider carries data attribute for scroll targeting

Each `WeekDivider` element SHALL have a `data-week` attribute set to its ISO week key (e.g., `data-week="2026-W08"`). This attribute SHALL be used by the scroll synchronization system to identify week boundaries.

**FSD layer:** `entities/session/ui/WeekDivider.tsx`
**Imports:** none beyond props

#### Scenario: WeekDivider renders with data-week attribute

- **WHEN** a `WeekDivider` is rendered for ISO week `"2026-W08"`
- **THEN** the root DOM element SHALL have `data-week="2026-W08"`

#### Scenario: Scroll system finds divider by data attribute

- **WHEN** the sync hook queries for `[data-week="2026-W08"]` inside the session list container
- **THEN** it SHALL find exactly one matching element

### Requirement: WeekDivider visual design

The `WeekDivider` SHALL render as a horizontal rule with a week label. It SHALL be visually distinct from session cards — lighter and thinner — to act as a section separator without competing for attention.

**FSD layer:** `entities/session/ui/WeekDivider.tsx`
**Imports:** none beyond React + Tailwind

#### Scenario: Divider renders with date range label

- **WHEN** a `WeekDivider` is rendered for the week of Feb 16–22, 2026
- **THEN** it SHALL display text like "Feb 16 – 22" (or "Feb 16 – Mar 1" when months differ)
- **AND** a horizontal line SHALL span the width of the session list

#### Scenario: Divider is visually distinct from session cards

- **WHEN** viewing the session list
- **THEN** `WeekDivider` elements SHALL use a smaller font size and muted color compared to `SessionCard`
- **AND** they SHALL NOT have the card's background, shadow, or border styling
