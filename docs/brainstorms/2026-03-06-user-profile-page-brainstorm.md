# User Profile Page — Brainstorm

**Date:** 2026-03-06
**Status:** Ready for planning
**Design ref:** `designs/v2/generated_screen_1/code.html`

---

## What We're Building

A dedicated `/profile` page where users manage personal biometric data. The page is a single form with biometric fields, unit toggles for height/weight, a computed BMI with status indicator, and a base64-encoded profile picture (avatar displayed in the navbar). The biometric data will later feed into training load thresholds, metabolic rate estimates, and recovery predictions.

### Fields

| Field             | Type        | Notes                                            |
|-------------------|-------------|--------------------------------------------------|
| Age               | Integer     | Years                                            |
| Height            | Float       | Stored as entered; unit stored alongside (cm or ft/in) |
| Weight            | Float       | Stored as entered; unit stored alongside (kg or lb)    |
| Gender            | Enum        | Male / Female                                    |
| Body Fat %        | Float       | Optional                                         |
| Resting HR        | Integer     | Beats per minute, optional                       |
| BMI               | Computed    | Derived from height + weight on save, not stored |
| Avatar            | Base64 text | Stored in DB, displayed in Navbar                |

---

## Why This Approach

**Flat single-table `UserProfile` model** — all biometric fields as columns, with `heightUnit` and `weightUnit` enum columns to track the user's preferred unit system. Rejected alternatives:

- **Profile + Preferences split** — over-engineered for 2 enum columns.
- **JSON blob biometrics** — loses type safety and Prisma validation.

A flat table is the right complexity for a single-user local SQLite app with a known set of fields.

---

## Key Decisions

1. **Single-user, extensible** — One profile row, no auth. Model has an `id` so a `User` FK can be added later without migration pain.
2. **Avatar as base64 in DB** — Simplest for a local SQLite app. No filesystem upload paths to manage.
3. **Store values as entered + preferred unit** — Height stored as the literal number the user typed, plus a `heightUnit` column (`cm` or `ft-in`). Same for weight (`kg` or `lb`). Conversion to metric happens at read time when needed for calculations.
4. **Gender: Male / Female** — Maps directly to the Body Stress Map silhouette planned in Roadmap item 2.
5. **BMI computed on save** — Not live-calculated as the user types. Computed from height/weight when the form is submitted, displayed with a color-coded status badge (Underweight / Normal / Overweight / Obese).
6. **Cancel resets form** — Cancel button resets to last saved values (stays on `/profile` page).
7. **Navigation: avatar link only** — Make the existing Navbar avatar clickable to navigate to `/profile`. No tab-style navigation changes for now.
8. **FSD structure** — New `entities/profile`, `features/profile-form`, `views/profile` slices. Thin route stub at `app/(routes)/profile/page.tsx`. API at `app/api/profile/route.ts`.

---

## FSD Architecture

```
src/
├── entities/
│   └── profile/
│       ├── model.ts          # BMI calc, status logic, unit conversion helpers, type config
│       ├── ui/
│       │   └── BmiIndicator.tsx   # BMI value + color-coded status badge
│       ├── __tests__/
│       └── index.ts
├── features/
│   └── profile-form/
│       ├── ui/
│       │   └── ProfileForm.tsx    # Client form with all fields, unit toggles, avatar upload
│       ├── __tests__/
│       └── index.ts
├── views/
│   └── profile/
│       ├── ui/
│       │   ├── ProfilePage.tsx    # Server component: fetch profile, pass to client
│       │   └── ProfileClient.tsx  # Client wrapper: form state, submit handler
│       └── index.ts
├── app/
│   ├── (routes)/
│   │   └── profile/
│   │       └── page.tsx           # Thin stub → views/profile
│   └── api/
│       └── profile/
│           └── route.ts           # GET single profile, PUT to upsert
```

---

## Data Model

```prisma
model UserProfile {
  id             Int      @id @default(autoincrement())
  age            Int?
  gender         String?  // "Male" | "Female"
  height         Float?
  heightUnit     String   @default("cm")   // "cm" | "ft-in"
  heightInches   Int?     // secondary value when unit is ft-in (feet in height, inches here)
  weight         Float?
  weightUnit     String   @default("kg")   // "kg" | "lb"
  bodyFatPercent Float?
  restingHr      Int?
  avatarBase64   String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

**Note on ft/in:** When `heightUnit` is `"ft-in"`, `height` stores feet and `heightInches` stores the remaining inches (e.g., 5'11" → height=5, heightInches=11). Conversion to cm for BMI: `(feet * 12 + inches) * 2.54`.

---

## API Design

### `GET /api/profile`

Returns the single profile row (or `null`/defaults if none exists yet).

### `PUT /api/profile`

Upserts the profile. Validates fields, computes nothing server-side (BMI is derived on read). Returns the updated profile.

---

## BMI Logic

```
BMI = weight_kg / (height_m ^ 2)

Status thresholds:
  < 18.5  → Underweight (yellow)
  18.5–24.9 → Normal (green)
  25–29.9 → Overweight (orange)
  ≥ 30    → Obese (red)
```

Unit conversion before calculation:
- If weight in lb: `weight_kg = weight * 0.453592`
- If height in ft/in: `height_cm = (feet * 12 + inches) * 2.54`
- `height_m = height_cm / 100`

---

## Resolved Questions

- Single-user vs multi-user → Single-user, extensible model
- Avatar storage → Base64 in DB
- Unit handling → Store as entered + unit preference
- Gender options → Male / Female
- BMI timing → Computed on save
- Cancel behavior → Reset form to last saved values
- Navigation → Avatar link to /profile, no nav tabs

---

## Open Questions

None — all design decisions resolved.
