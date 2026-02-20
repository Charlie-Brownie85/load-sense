## ADDED Requirements

### Requirement: Session load computation
The system SHALL compute individual session load as `Load = duration × rpe`. This function SHALL be a pure TypeScript function in `src/lib/workload.ts` with no framework dependencies.

#### Scenario: Standard session load
- **WHEN** `computeSessionLoad` is called with duration 45 and rpe 8
- **THEN** the result SHALL be 360

#### Scenario: Minimum values
- **WHEN** `computeSessionLoad` is called with duration 1 and rpe 1
- **THEN** the result SHALL be 1

#### Scenario: Maximum values
- **WHEN** `computeSessionLoad` is called with duration 300 and rpe 10
- **THEN** the result SHALL be 3000

### Requirement: Acute load computation
The system SHALL compute Acute Load (AL) as the sum of all session loads from the last 7 days relative to a reference date. The 7-day window SHALL include the reference date and the 6 preceding days.

#### Scenario: Acute load with sessions in window
- **WHEN** `computeAcuteLoad` is called with sessions spanning the last 7 days totaling loads of 360, 240, and 90
- **THEN** the result SHALL be 690

#### Scenario: Acute load with sessions outside window
- **WHEN** sessions exist but all are older than 7 days from the reference date
- **THEN** the Acute Load SHALL be 0

#### Scenario: Acute load with no sessions
- **WHEN** `computeAcuteLoad` is called with an empty sessions array
- **THEN** the result SHALL be 0

### Requirement: Chronic load computation
The system SHALL compute Chronic Load (CL) as the average weekly load over the last 28 days. CL SHALL be calculated by summing all session loads in the 28-day window and dividing by 4 (the number of complete weeks). The 28-day window SHALL include the reference date and the 27 preceding days.

#### Scenario: Chronic load with even weekly distribution
- **WHEN** sessions over 28 days have total loads of 500 per week for 4 weeks (total 2000)
- **THEN** the CL SHALL be 500

#### Scenario: Chronic load with uneven distribution
- **WHEN** sessions over 28 days have total load of 1400
- **THEN** the CL SHALL be 350 (1400 / 4)

#### Scenario: Chronic load with no sessions
- **WHEN** `computeChronicLoad` is called with an empty sessions array
- **THEN** the result SHALL be 0

### Requirement: ACWR computation
The system SHALL compute the Acute:Chronic Workload Ratio as `ACWR = acuteLoad / chronicLoad`. When chronicLoad is 0, ACWR SHALL be null.

#### Scenario: Standard ACWR calculation
- **WHEN** `computeACWR` is called with acuteLoad 480 and chronicLoad 420
- **THEN** the result SHALL be approximately 1.14

#### Scenario: ACWR with zero chronic load
- **WHEN** `computeACWR` is called with acuteLoad 300 and chronicLoad 0
- **THEN** the result SHALL be null

#### Scenario: ACWR with zero acute load
- **WHEN** `computeACWR` is called with acuteLoad 0 and chronicLoad 400
- **THEN** the result SHALL be 0

### Requirement: Training status classification
The system SHALL classify the training status based on ACWR using these thresholds: ACWR < 0.8 maps to "Undertraining"; 0.8 <= ACWR <= 1.3 maps to "Optimal Zone"; 1.3 < ACWR <= 1.5 maps to "Fatigue Risk"; ACWR > 1.5 maps to "High Injury Risk"; null ACWR maps to "Insufficient Data".

#### Scenario: Undertraining status
- **WHEN** `classifyStatus` is called with ACWR 0.5
- **THEN** the result SHALL be "Undertraining"

#### Scenario: Optimal zone status
- **WHEN** `classifyStatus` is called with ACWR 1.15
- **THEN** the result SHALL be "Optimal Zone"

#### Scenario: Boundary at 0.8 is optimal
- **WHEN** `classifyStatus` is called with ACWR 0.8
- **THEN** the result SHALL be "Optimal Zone"

#### Scenario: Boundary at 1.3 is optimal
- **WHEN** `classifyStatus` is called with ACWR 1.3
- **THEN** the result SHALL be "Optimal Zone"

#### Scenario: Fatigue risk status
- **WHEN** `classifyStatus` is called with ACWR 1.4
- **THEN** the result SHALL be "Fatigue Risk"

#### Scenario: High injury risk status
- **WHEN** `classifyStatus` is called with ACWR 1.8
- **THEN** the result SHALL be "High Injury Risk"

#### Scenario: Insufficient data status
- **WHEN** `classifyStatus` is called with null ACWR
- **THEN** the result SHALL be "Insufficient Data"

### Requirement: Workload metrics API endpoint
The system SHALL expose a GET endpoint at `/api/workload` that returns computed metrics: `acuteLoad`, `chronicLoad`, `acwr` (number or null), `status` (string), `isChronicUnstable` (boolean), and `weeklyLoads` (array of last 4-5 weekly totals). The reference date for all calculations SHALL be the current date.

#### Scenario: Workload metrics with sufficient data
- **WHEN** a GET request is sent to `/api/workload` and sessions exist spanning 28+ days
- **THEN** the response SHALL include numeric `acuteLoad`, numeric `chronicLoad`, numeric `acwr`, a status string, `isChronicUnstable` as false, and a `weeklyLoads` array

#### Scenario: Workload metrics with insufficient chronic data
- **WHEN** a GET request is sent and sessions exist for fewer than 28 days
- **THEN** the response SHALL include computed values but `isChronicUnstable` SHALL be true

#### Scenario: Workload metrics with no data
- **WHEN** a GET request is sent and no sessions exist
- **THEN** `acuteLoad` SHALL be 0, `chronicLoad` SHALL be 0, `acwr` SHALL be null, and `status` SHALL be "Insufficient Data"

### Requirement: Edge case handling for insufficient data
The system SHALL handle data insufficiency gracefully: when fewer than 7 days of sessions exist, Acute Load SHALL still be computed but the UI MUST display a warning; when fewer than 28 days exist, Chronic Load SHALL be computed but marked as "unstable"; when CL equals 0, ACWR SHALL be null and status SHALL be "Insufficient Data".

#### Scenario: Less than 7 days of data
- **WHEN** sessions exist only for the last 3 days
- **THEN** Acute Load SHALL be the sum of those sessions' loads and the system SHALL flag the acute data as incomplete

#### Scenario: Less than 28 days of data
- **WHEN** sessions exist only for the last 14 days
- **THEN** Chronic Load SHALL be computed (total load / 4) and `isChronicUnstable` SHALL be true

#### Scenario: Chronic load is zero
- **WHEN** all sessions in the 28-day window have zero total load (no sessions)
- **THEN** ACWR SHALL be null and status SHALL be "Insufficient Data"
