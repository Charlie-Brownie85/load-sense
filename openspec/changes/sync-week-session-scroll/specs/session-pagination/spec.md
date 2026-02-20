## ADDED Requirements

### Requirement: Cursor-based session pagination API

The GET `/api/sessions` endpoint SHALL support optional `cursor` (session ID) and `limit` (integer, default 20) query parameters. It SHALL return a JSON response with `{ sessions, nextCursor, hasMore }`. Sessions SHALL be ordered by date descending, with the cursor pointing to the last session of the current page.

**FSD layer:** `app/api/sessions/route.ts`
**Imports:** `shared/lib/prisma`

#### Scenario: First page with no cursor

- **WHEN** GET `/api/sessions` is called without a `cursor` param
- **THEN** it SHALL return the first `limit` sessions ordered by date descending
- **AND** `hasMore` SHALL be `true` if additional sessions exist beyond the page
- **AND** `nextCursor` SHALL be the ID of the last session in the returned page

#### Scenario: Subsequent page with cursor

- **WHEN** GET `/api/sessions?cursor=42&limit=20` is called
- **THEN** it SHALL return up to 20 sessions that come AFTER session ID 42 in date-descending order
- **AND** session 42 itself SHALL NOT be included in the results

#### Scenario: Last page

- **WHEN** a request returns fewer sessions than `limit`
- **THEN** `hasMore` SHALL be `false`
- **AND** `nextCursor` SHALL be `null`

#### Scenario: Custom limit

- **WHEN** GET `/api/sessions?limit=5` is called
- **THEN** it SHALL return at most 5 sessions

#### Scenario: Backward compatibility

- **WHEN** GET `/api/sessions` is called without any query params
- **THEN** it SHALL behave identically to requesting the first page with default limit

### Requirement: Server component provides paginated initial sessions

The `DashboardPage` server component SHALL continue fetching ALL sessions for ACWR and weekly load computation. However, it SHALL only serialize and pass the first page of sessions (default 20) to `DashboardClient` for the list display. It SHALL also pass `hasMore` and `nextCursor` to enable client-side pagination.

**FSD layer:** `app/dashboard/page.tsx`
**Imports:** `shared/lib/prisma`, `shared/lib/workload`

#### Scenario: Initial page load with many sessions

- **WHEN** the database contains 100 sessions
- **THEN** `DashboardClient` SHALL receive the 20 most recent sessions, `hasMore: true`, and a `nextCursor`
- **AND** ACWR, weekly load ranges, and status SHALL be computed from all 100 sessions

#### Scenario: Initial page load with few sessions

- **WHEN** the database contains 10 sessions
- **THEN** `DashboardClient` SHALL receive all 10 sessions and `hasMore: false`

### Requirement: Client-side infinite scroll for sessions

The session list SHALL use a `useSessionPagination` hook that appends additional pages of sessions as the user scrolls down. A sentinel element at the bottom of the list SHALL trigger fetching the next page when it enters the viewport.

**FSD layer:** `features/session-pagination/model/useSessionPagination.ts`
**Imports:** `shared/types` (PaginatedSessionsResponse, Session)

#### Scenario: Scrolling to bottom triggers next page load

- **WHEN** the sentinel element at the bottom of the session list enters the viewport
- **THEN** the hook SHALL fetch the next page from `/api/sessions?cursor=<nextCursor>&limit=20`
- **AND** the new sessions SHALL be appended to the existing list

#### Scenario: Loading state during fetch

- **WHEN** a page fetch is in progress
- **THEN** a loading indicator SHALL be visible at the bottom of the session list
- **AND** no duplicate fetch SHALL be triggered

#### Scenario: All sessions loaded

- **WHEN** the last page has been fetched (`hasMore: false`)
- **THEN** the sentinel SHALL be removed or disabled
- **AND** no further fetch calls SHALL be made

#### Scenario: New sessions added via CRUD

- **WHEN** a session is created or deleted and `router.refresh()` reloads the server component
- **THEN** the pagination state SHALL reset to the first page from the fresh server data

### Requirement: Paginated response type

The system SHALL define a `PaginatedSessionsResponse` TypeScript type in `shared/types/` with the fields `sessions: Session[]`, `nextCursor: number | null`, and `hasMore: boolean`.

**FSD layer:** `shared/types/index.ts`
**Imports:** none

#### Scenario: Type matches API response shape

- **WHEN** the `/api/sessions` endpoint returns a response
- **THEN** it SHALL conform to the `PaginatedSessionsResponse` type
