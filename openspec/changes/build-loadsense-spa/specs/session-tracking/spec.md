## ADDED Requirements

### Requirement: Session data model
The system SHALL persist training sessions with the following fields: `id` (auto-increment integer primary key), `date` (DateTime), `type` (String, one of "Strength", "HIIT", "Cardio"), `duration` (Integer, minutes), `rpe` (Integer, 1-10), `notes` (String, optional/nullable), `createdAt` (DateTime, auto-set), and `updatedAt` (DateTime, auto-updated). The database SHALL be SQLite via Prisma ORM.

#### Scenario: Session record created with all fields
- **WHEN** a session is persisted with date "2026-02-20", type "HIIT", duration 45, rpe 8, and notes "felt strong"
- **THEN** the database record SHALL contain all provided values plus auto-generated `id`, `createdAt`, and `updatedAt` timestamps

#### Scenario: Session created without optional notes
- **WHEN** a session is persisted with date, type, duration, and rpe but no notes
- **THEN** the `notes` field SHALL be null and all other fields SHALL be stored correctly

### Requirement: Create session via API
The system SHALL expose a POST endpoint at `/api/sessions` that accepts a JSON body with `date`, `type`, `duration`, `rpe`, and optional `notes`. On success it SHALL return the created session as JSON with HTTP 201.

#### Scenario: Valid session creation
- **WHEN** a POST request is sent to `/api/sessions` with body `{ "date": "2026-02-20", "type": "Strength", "duration": 60, "rpe": 6 }`
- **THEN** the system SHALL return HTTP 201 with the created session including its generated `id`

#### Scenario: Invalid session type rejected
- **WHEN** a POST request is sent with `type` set to "Yoga" (not in allowed types)
- **THEN** the system SHALL return HTTP 400 with a validation error message

#### Scenario: Invalid RPE value rejected
- **WHEN** a POST request is sent with `rpe` set to 0 or 11 (outside 1-10 range)
- **THEN** the system SHALL return HTTP 400 with a validation error message

#### Scenario: Missing required fields rejected
- **WHEN** a POST request is sent missing `date`, `type`, `duration`, or `rpe`
- **THEN** the system SHALL return HTTP 400 with a validation error indicating which fields are missing

### Requirement: List sessions via API
The system SHALL expose a GET endpoint at `/api/sessions` that returns all sessions ordered by date descending as a JSON array.

#### Scenario: List sessions with data
- **WHEN** a GET request is sent to `/api/sessions` and 3 sessions exist
- **THEN** the system SHALL return HTTP 200 with a JSON array of 3 sessions ordered by most recent date first

#### Scenario: List sessions with no data
- **WHEN** a GET request is sent to `/api/sessions` and no sessions exist
- **THEN** the system SHALL return HTTP 200 with an empty JSON array

### Requirement: Update session via API
The system SHALL expose a PUT endpoint at `/api/sessions/[id]` that accepts a JSON body with any subset of session fields and updates the matching record. On success it SHALL return the updated session as JSON with HTTP 200.

#### Scenario: Update session duration
- **WHEN** a PUT request is sent to `/api/sessions/1` with body `{ "duration": 90 }`
- **THEN** the system SHALL update only the `duration` field to 90 and return the full updated session

#### Scenario: Update non-existent session
- **WHEN** a PUT request is sent to `/api/sessions/999` and no session with id 999 exists
- **THEN** the system SHALL return HTTP 404 with an error message

### Requirement: Delete session via API
The system SHALL expose a DELETE endpoint at `/api/sessions/[id]` that removes the matching session. On success it SHALL return HTTP 200.

#### Scenario: Delete existing session
- **WHEN** a DELETE request is sent to `/api/sessions/1` and a session with id 1 exists
- **THEN** the system SHALL remove the session and return HTTP 200

#### Scenario: Delete non-existent session
- **WHEN** a DELETE request is sent to `/api/sessions/999` and no session with id 999 exists
- **THEN** the system SHALL return HTTP 404 with an error message

### Requirement: Session field validation
The system SHALL validate all session fields before persistence: `type` MUST be one of "Strength", "HIIT", or "Cardio"; `rpe` MUST be an integer between 1 and 10 inclusive; `duration` MUST be a positive integer; `date` MUST be a valid date string.

#### Scenario: Duration must be positive
- **WHEN** a session is submitted with `duration` of 0 or a negative number
- **THEN** the system SHALL reject it with HTTP 400

#### Scenario: RPE must be within range
- **WHEN** a session is submitted with `rpe` of 5
- **THEN** the system SHALL accept the value

#### Scenario: Date must be valid
- **WHEN** a session is submitted with `date` of "not-a-date"
- **THEN** the system SHALL reject it with HTTP 400
