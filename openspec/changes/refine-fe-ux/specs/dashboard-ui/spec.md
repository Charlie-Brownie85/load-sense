## MODIFIED Requirements

### Requirement: ACWR status overview panel
The dashboard SHALL display a prominent status overview panel at the top containing: the current ACWR ratio as a large number, a color-coded status badge (Undertraining, Optimal Zone, Fatigue Risk, High Injury Risk, or Insufficient Data), Acute Load value with "Last 7 days" label, Chronic Load value with "Last 28 days avg" label, and a horizontal gauge bar showing the ACWR position across the training zones. The "Current ACWR Ratio" label, the "Acute Load" label, and the "Chronic Load" label SHALL each be wrapped in a Tooltip component displaying an explanation of the metric on hover. The status overview panel SHALL use `position: sticky` so it remains visible below the navbar when the user scrolls vertically, with a `z-index` ensuring it stays above scrollable content and a bottom shadow for visual separation.

#### Scenario: Optimal zone display
- **WHEN** the ACWR is 1.15
- **THEN** the panel SHALL show "1.15" as the main metric, an emerald/green "Optimal Zone" badge, and the gauge indicator positioned in the center green zone

#### Scenario: High injury risk display
- **WHEN** the ACWR is 1.8
- **THEN** the panel SHALL show "1.80" as the main metric, a red "High Injury Risk" badge, and the gauge indicator positioned in the rightmost zone

#### Scenario: Insufficient data display
- **WHEN** ACWR is null (chronic load is 0)
- **THEN** the panel SHALL show "—" for the ACWR value, a gray "Insufficient Data" badge, and the gauge SHALL be empty or neutral

#### Scenario: Unstable chronic load warning
- **WHEN** `isChronicUnstable` is true
- **THEN** the Chronic Load metric SHALL display a visual indicator that the value is based on incomplete data

#### Scenario: Status panel stays visible on scroll
- **WHEN** the user scrolls the dashboard vertically
- **THEN** the status overview panel SHALL stick below the navbar and remain visible while the session list scrolls underneath

#### Scenario: Metric labels show tooltips on hover
- **WHEN** the user hovers over the "Acute Load", "Chronic Load", or "Current ACWR Ratio" label
- **THEN** a tooltip SHALL appear explaining what that metric means

### Requirement: Weekly training load chart
The dashboard SHALL display a bar chart showing weekly training load totals for the last 5 weeks. Each bar SHALL be labeled with the week's date range in "Mon D–D" or "Mon D – Mon D" format (Monday through Sunday). The current week's bar SHALL be visually distinguished (solid primary color with shadow). Previous weeks SHALL use progressively lighter shades. Below the chart, the average weekly load SHALL be displayed. On desktop viewports (`lg:` and above), the weekly chart panel SHALL use `position: sticky` so it remains visible in the left column while the session list scrolls. When the user hovers over a bar, the hovered bar SHALL retain its full color while all other bars dim to reduced opacity, and a Tooltip SHALL appear above the hovered bar showing the workload value formatted with units (e.g., "1,240 AU").

#### Scenario: Chart with full data shows date range labels
- **WHEN** session data spans 5 or more weeks and the current date is within a week starting Feb 17 (Monday)
- **THEN** the chart SHALL render 5 bars with the rightmost labeled with the current week's date range (e.g., "Feb 17–23") and previous weeks showing their respective Monday–Sunday ranges

#### Scenario: Chart with partial data
- **WHEN** session data spans only 2 weeks
- **THEN** the chart SHALL render bars only for weeks with data, with remaining positions empty or showing zero-height bars, each labeled with their date range

#### Scenario: Chart with no data
- **WHEN** no sessions exist
- **THEN** the chart area SHALL display gracefully with zero-height bars or an empty state message

#### Scenario: Hovering a bar highlights it and dims others
- **WHEN** the user hovers over the third bar in the chart
- **THEN** the third bar SHALL retain its full color, all other bars SHALL transition to reduced opacity (approximately 30%), and a tooltip SHALL appear above the third bar showing its load value

#### Scenario: Mouse leaves chart restores all bars
- **WHEN** the user moves the mouse away from all bars
- **THEN** all bars SHALL return to their normal opacity levels

#### Scenario: Weekly chart is sticky on desktop
- **WHEN** the viewport is `lg:` width or larger and the user scrolls vertically
- **THEN** the weekly load chart panel SHALL stick in the left column below the status panel and navbar

### Requirement: Session list display
The dashboard SHALL display recent training sessions as a vertical list of cards. Each card SHALL show: a colored icon indicating session type (orange bolt for HIIT, blue dumbbell for Strength, green runner for Cardio), the session name/type as title, relative date label, duration, RPE rating, and computed session load. The entire card SHALL be clickable to open the edit modal, and the cursor SHALL change to `pointer` when hovering over the card. The delete button SHALL appear on card hover with `cursor: pointer` styling. There SHALL be no separate edit button — clicking the card itself opens the edit modal.

#### Scenario: Session card with all fields
- **WHEN** a session exists with type "HIIT", duration 45, rpe 8, and notes
- **THEN** the card SHALL show an orange bolt icon, "High Intensity Intervals" title, "45m" duration, "RPE 8/10", and "360 Load" badge

#### Scenario: Strength session card
- **WHEN** a session exists with type "Strength"
- **THEN** the card SHALL show a blue dumbbell icon and "Strength Training" title

#### Scenario: Cardio session card
- **WHEN** a session exists with type "Cardio"
- **THEN** the card SHALL show a green runner icon and the appropriate cardio title

#### Scenario: Click on card opens edit modal
- **WHEN** the user clicks anywhere on a session card (excluding the delete button)
- **THEN** the session edit modal SHALL open pre-populated with that session's values

#### Scenario: Card shows pointer cursor
- **WHEN** the user hovers over a session card
- **THEN** the cursor SHALL change to `pointer` to indicate the card is clickable

#### Scenario: Delete button visible on hover with pointer cursor
- **WHEN** the user hovers over a session card
- **THEN** a delete (trash) icon button SHALL become visible with `cursor: pointer`, and no edit button SHALL be present

#### Scenario: Delete button click does not trigger edit
- **WHEN** the user clicks the delete button on a session card
- **THEN** the delete confirmation flow SHALL start AND the edit modal SHALL NOT open

#### Scenario: Empty session list
- **WHEN** no sessions exist
- **THEN** the session list area SHALL display an empty state prompting the user to add their first session

### Requirement: Edit session modal
The dashboard SHALL support editing existing sessions by reusing the add session modal pre-populated with the session's current values. On save, it SHALL send a PUT request to update the session. The edit modal SHALL open when the user clicks on a session card.

#### Scenario: Open edit modal via card click
- **WHEN** the user clicks on a session card
- **THEN** the modal SHALL open with all fields pre-populated with the session's current values

#### Scenario: Save edited session
- **WHEN** the user modifies fields and clicks "Save Session"
- **THEN** the system SHALL PUT to `/api/sessions/[id]`, close the modal, and refresh the dashboard

### Requirement: Delete session confirmation
The system SHALL use a styled `ConfirmModal` component (not `window.confirm()`) to confirm before deleting a session. Upon confirmation, it SHALL send a DELETE request and refresh the dashboard.

#### Scenario: Delete with confirmation via ConfirmModal
- **WHEN** the user clicks the delete button on a session card
- **THEN** a styled ConfirmModal SHALL appear with title "Delete Session" and a confirmation message

#### Scenario: Confirm delete sends request
- **WHEN** the user clicks "Delete" in the ConfirmModal
- **THEN** the system SHALL DELETE `/api/sessions/[id]` and refresh the session list

#### Scenario: Cancel delete
- **WHEN** the user clicks "Cancel" in the ConfirmModal or clicks the backdrop
- **THEN** no request SHALL be sent and the session SHALL remain

### Requirement: Responsive layout
The dashboard SHALL be desktop-first with a max-width container (6xl / ~1152px) centered on screen. On tablet and mobile viewports, the layout SHALL stack vertically: the status panel becomes full-width, the chart and session list stack in a single column. All interactive elements SHALL remain accessible on touch devices. Sticky positioning for the status panel SHALL apply at all breakpoints. Sticky positioning for the weekly chart sidebar SHALL apply only at `lg:` breakpoint and above.

#### Scenario: Desktop layout with sticky sidebar
- **WHEN** the viewport width is 1280px or greater
- **THEN** the chart and session list SHALL display in a 1/3 + 2/3 column grid, with the chart column sticky

#### Scenario: Mobile layout without sticky sidebar
- **WHEN** the viewport width is below 768px
- **THEN** all sections SHALL stack vertically in a single column with only the status panel and navbar sticky
