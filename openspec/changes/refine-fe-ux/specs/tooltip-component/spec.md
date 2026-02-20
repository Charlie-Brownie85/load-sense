## ADDED Requirements

### Requirement: Tooltip wrapper component
The system SHALL provide a reusable `Tooltip` component that wraps a trigger element and displays contextual content on hover. The component SHALL accept `content: ReactNode` (the tooltip body), `children: ReactNode` (the trigger element), and an optional `position` prop with values `"top"` (default), `"bottom"`, `"left"`, or `"right"`.

#### Scenario: Tooltip renders trigger children
- **WHEN** `<Tooltip content="Help text"><button>Hover me</button></Tooltip>` renders
- **THEN** the button "Hover me" SHALL be visible and the tooltip content "Help text" SHALL NOT be visible

#### Scenario: Tooltip appears on mouse enter
- **WHEN** the user hovers over the trigger element
- **THEN** the tooltip content SHALL appear positioned relative to the trigger according to the `position` prop

#### Scenario: Tooltip disappears on mouse leave
- **WHEN** the user moves the mouse away from the trigger element
- **THEN** the tooltip content SHALL fade out and become hidden

### Requirement: Tooltip positioning
The tooltip body SHALL be positioned using CSS `position: absolute` relative to a `position: relative` wrapper. A small CSS arrow/caret SHALL point from the tooltip toward the trigger element. The tooltip SHALL have a dark background (`bg-slate-800`), white text, rounded corners, and a subtle shadow consistent with the app's design language.

#### Scenario: Top position (default)
- **WHEN** `position` is `"top"` or omitted
- **THEN** the tooltip SHALL appear centered above the trigger with an arrow pointing downward

#### Scenario: Bottom position
- **WHEN** `position` is `"bottom"`
- **THEN** the tooltip SHALL appear centered below the trigger with an arrow pointing upward

### Requirement: Tooltip on Acute Load metric
The Acute Load metric card in the status overview panel SHALL display a Tooltip on hover explaining: "Total training load (duration x RPE) from the last 7 days."

#### Scenario: Hovering Acute Load shows explanation
- **WHEN** the user hovers over the Acute Load metric label
- **THEN** a tooltip SHALL appear with text explaining the acute load calculation

### Requirement: Tooltip on Chronic Load metric
The Chronic Load metric card in the status overview panel SHALL display a Tooltip on hover explaining: "Average weekly training load over the last 28 days (4 weeks)."

#### Scenario: Hovering Chronic Load shows explanation
- **WHEN** the user hovers over the Chronic Load metric label
- **THEN** a tooltip SHALL appear with text explaining the chronic load calculation

### Requirement: Tooltip on Current ACWR Ratio
The "Current ACWR Ratio" label in the status overview panel SHALL display a Tooltip on hover explaining: "Acute:Chronic Workload Ratio — compares your recent load to your longer-term average. Optimal range is 0.8–1.3."

#### Scenario: Hovering ACWR ratio label shows explanation
- **WHEN** the user hovers over the "Current ACWR Ratio" text
- **THEN** a tooltip SHALL appear with text explaining what the ACWR ratio means and its optimal range
