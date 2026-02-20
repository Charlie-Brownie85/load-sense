## ADDED Requirements

### Requirement: Application routing and layout
The application SHALL redirect the root path (`/`) to `/dashboard`. The layout SHALL include a sticky top navigation bar with the LoadSense logo (Material Symbols `analytics` icon in primary blue), app title "LoadSense", and a user avatar placeholder. Reusable UX components SHALL reside in a `ux/components` directory with clear separation from domain logic.

#### Scenario: Root path redirects to dashboard
- **WHEN** a user navigates to `/`
- **THEN** the browser SHALL redirect to `/dashboard`

#### Scenario: Navigation bar is always visible
- **WHEN** the user is on the `/dashboard` route
- **THEN** the sticky top navigation bar SHALL be visible with the LoadSense branding

### Requirement: ACWR status overview panel
The dashboard SHALL display a prominent status overview panel at the top containing: the current ACWR ratio as a large number, a color-coded status badge (Undertraining, Optimal Zone, Fatigue Risk, High Injury Risk, or Insufficient Data), Acute Load value with "Last 7 days" label, Chronic Load value with "Last 28 days avg" label, and a horizontal gauge bar showing the ACWR position across the training zones.

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

### Requirement: Weekly training load chart
The dashboard SHALL display a bar chart showing weekly training load totals for the last 4-5 weeks. The current week's bar SHALL be visually distinguished (solid primary color with shadow). Previous weeks SHALL use progressively lighter shades. Below the chart, the average weekly load SHALL be displayed.

#### Scenario: Chart with full data
- **WHEN** session data spans 5 or more weeks
- **THEN** the chart SHALL render 5 bars with the rightmost labeled "Current" in primary blue and previous weeks in lighter shades

#### Scenario: Chart with partial data
- **WHEN** session data spans only 2 weeks
- **THEN** the chart SHALL render bars only for weeks with data, with remaining positions empty or showing zero-height bars

#### Scenario: Chart with no data
- **WHEN** no sessions exist
- **THEN** the chart area SHALL display gracefully with zero-height bars or an empty state message

### Requirement: Session list display
The dashboard SHALL display recent training sessions as a vertical list of cards. Each card SHALL show: a colored icon indicating session type (orange bolt for HIIT, blue dumbbell for Strength, green runner for Cardio), the session name/type as title, relative date label, duration, RPE rating, and computed session load. Edit and delete action buttons SHALL appear on card hover.

#### Scenario: Session card with all fields
- **WHEN** a session exists with type "HIIT", duration 45, rpe 8, and notes
- **THEN** the card SHALL show an orange bolt icon, "High Intensity Intervals" title, "45m" duration, "RPE 8/10", and "360 Load" badge

#### Scenario: Strength session card
- **WHEN** a session exists with type "Strength"
- **THEN** the card SHALL show a blue dumbbell icon and "Strength Training" title

#### Scenario: Cardio session card
- **WHEN** a session exists with type "Cardio"
- **THEN** the card SHALL show a green runner icon and the appropriate cardio title

#### Scenario: Edit and delete actions on hover
- **WHEN** the user hovers over a session card
- **THEN** edit (pencil) and delete (trash) icon buttons SHALL become visible

#### Scenario: Empty session list
- **WHEN** no sessions exist
- **THEN** the session list area SHALL display an empty state prompting the user to add their first session

### Requirement: Add session modal
The dashboard SHALL include a floating action button labeled "Add Session" that opens a modal dialog for creating a new session. The modal SHALL contain: a date picker (defaulting to today), a duration input (number in minutes), a session type dropdown (Strength, HIIT, Cardio), an RPE slider (range 1-10 with current value displayed), an optional notes textarea, and Cancel/Save buttons.

#### Scenario: Open add session modal
- **WHEN** the user clicks the "Add Session" floating action button
- **THEN** a modal overlay SHALL appear with the session form, date defaulting to today

#### Scenario: Submit valid session
- **WHEN** the user fills in all required fields and clicks "Save Session"
- **THEN** the system SHALL POST to `/api/sessions`, close the modal, and refresh the dashboard to show the new session

#### Scenario: Cancel add session
- **WHEN** the user clicks "Cancel" or the close (X) button
- **THEN** the modal SHALL close without persisting any data

#### Scenario: RPE slider interaction
- **WHEN** the user drags the RPE slider to value 7
- **THEN** the displayed value SHALL update to "7 / 10" in real time

### Requirement: Edit session modal
The dashboard SHALL support editing existing sessions by reusing the add session modal pre-populated with the session's current values. On save, it SHALL send a PUT request to update the session.

#### Scenario: Open edit modal
- **WHEN** the user clicks the edit button on a session card
- **THEN** the modal SHALL open with all fields pre-populated with the session's current values

#### Scenario: Save edited session
- **WHEN** the user modifies fields and clicks "Save Session"
- **THEN** the system SHALL PUT to `/api/sessions/[id]`, close the modal, and refresh the dashboard

### Requirement: Delete session confirmation
The system SHALL confirm before deleting a session. Upon confirmation, it SHALL send a DELETE request and refresh the dashboard.

#### Scenario: Delete with confirmation
- **WHEN** the user clicks the delete button on a session card and confirms
- **THEN** the system SHALL DELETE `/api/sessions/[id]` and refresh the session list

#### Scenario: Cancel delete
- **WHEN** the user clicks delete but cancels the confirmation
- **THEN** no request SHALL be sent and the session SHALL remain

### Requirement: Responsive layout
The dashboard SHALL be desktop-first with a max-width container (6xl / ~1152px) centered on screen. On tablet and mobile viewports, the layout SHALL stack vertically: the status panel becomes full-width, the chart and session list stack in a single column. All interactive elements SHALL remain accessible on touch devices.

#### Scenario: Desktop layout
- **WHEN** the viewport width is 1280px or greater
- **THEN** the chart and session list SHALL display in a 1/3 + 2/3 column grid

#### Scenario: Mobile layout
- **WHEN** the viewport width is below 768px
- **THEN** all sections SHALL stack vertically in a single column

### Requirement: Status badge color coding
The status badge SHALL use distinct colors per training status: "Undertraining" in slate/gray, "Optimal Zone" in emerald/green, "Fatigue Risk" in amber/orange, "High Injury Risk" in red, and "Insufficient Data" in neutral gray.

#### Scenario: Optimal zone badge
- **WHEN** the status is "Optimal Zone"
- **THEN** the badge SHALL display with an emerald/green background and a check circle icon

#### Scenario: Fatigue risk badge
- **WHEN** the status is "Fatigue Risk"
- **THEN** the badge SHALL display with an amber/orange background and a warning icon
