## ADDED Requirements

### Requirement: Confirmation modal component
The system SHALL provide a reusable `ConfirmModal` component that displays a styled modal overlay for destructive or important actions requiring user confirmation. The component SHALL accept props: `isOpen: boolean`, `onClose: () => void`, `onConfirm: () => void`, `title: string`, `message: string`, optional `confirmLabel: string` (default `"Delete"`), and optional `confirmVariant: "danger" | "primary"` (default `"danger"`).

#### Scenario: Modal renders when open
- **WHEN** `isOpen` is `true`
- **THEN** a modal overlay SHALL appear with the provided `title` and `message`, a Cancel button, and a Confirm button with the `confirmLabel` text

#### Scenario: Modal hidden when closed
- **WHEN** `isOpen` is `false`
- **THEN** the modal SHALL NOT be rendered in the DOM

#### Scenario: Confirm button uses danger styling
- **WHEN** `confirmVariant` is `"danger"` or omitted
- **THEN** the confirm button SHALL use a red background color to signal a destructive action

#### Scenario: Confirm button uses primary styling
- **WHEN** `confirmVariant` is `"primary"`
- **THEN** the confirm button SHALL use the primary blue background color

### Requirement: Confirmation modal interactions
The Cancel button SHALL invoke `onClose`. The Confirm button SHALL invoke `onConfirm`. Clicking the backdrop overlay SHALL invoke `onClose`. The modal SHALL prevent interaction with elements behind the overlay.

#### Scenario: Clicking confirm triggers callback
- **WHEN** the user clicks the confirm button
- **THEN** `onConfirm` SHALL be invoked

#### Scenario: Clicking cancel closes modal
- **WHEN** the user clicks the Cancel button
- **THEN** `onClose` SHALL be invoked and the modal SHALL close

#### Scenario: Clicking backdrop closes modal
- **WHEN** the user clicks the semi-transparent overlay area outside the modal card
- **THEN** `onClose` SHALL be invoked

### Requirement: Confirmation modal visual consistency
The modal SHALL follow the same visual pattern as the existing `SessionModal`: fixed full-screen overlay with `bg-black/50` backdrop, centered white card with rounded corners (`rounded-xl`), padding, and shadow. The title SHALL use bold text and the message SHALL use muted text color.

#### Scenario: Modal matches app design language
- **WHEN** the ConfirmModal renders
- **THEN** it SHALL use the same overlay opacity, card border radius, and font styling as the SessionModal

### Requirement: Delete session uses ConfirmModal
The dashboard SHALL use `ConfirmModal` instead of `window.confirm()` for the session delete action. When the user clicks the delete button on a session card, the ConfirmModal SHALL open with title "Delete Session" and a message identifying the session. On confirm, the system SHALL send the DELETE request and refresh the dashboard.

#### Scenario: Delete button opens ConfirmModal
- **WHEN** the user clicks the delete button on a session card
- **THEN** a `ConfirmModal` SHALL appear with title "Delete Session" instead of a native browser confirm dialog

#### Scenario: Confirming delete sends API request
- **WHEN** the user clicks "Delete" in the ConfirmModal
- **THEN** the system SHALL send a DELETE request to `/api/sessions/[id]` and refresh the dashboard

#### Scenario: Cancelling delete preserves session
- **WHEN** the user clicks "Cancel" in the ConfirmModal or clicks the backdrop
- **THEN** no DELETE request SHALL be sent and the session SHALL remain in the list
