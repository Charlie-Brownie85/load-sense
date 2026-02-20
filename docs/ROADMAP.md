# LoadSense — Roadmap

Future developments and planned features for upcoming sessions. Visual references for most items can be found under `designs/v2/`.

---

## 1. User Profile Page

Add a dedicated **Profile** page/view where users can input and manage personal biometric data.

**Fields:**

- Age
- Height (cm / ft-in toggle)
- Weight (kg / lb toggle)
- Gender
- Body fat %
- Resting heart rate (bpm)
- Calculated BMI with status indicator (Underweight / Normal / Overweight / Obese)

**Additionally:**

- Allow uploading a profile picture (avatar displayed in the nav bar).
- Biometric data feeds into training load threshold calculations, metabolic rate estimates, and recovery predictions.

> See `designs/v2/generated_screen_1/` for the profile form layout reference.

---

## 2. Body Stress Map Widget

Implement an interactive **Body Stress Map** panel on the dashboard.

- Render a body silhouette that adapts to the user's selected gender (male / female).
- Overlay heat-map regions (shoulders, torso, arms, legs, CNS/head) colored by fatigue level:
  - **Red** — high stress / overloaded
  - **Amber** — recovering
  - **Green** — fresh / ready
- Fatigue levels are derived from recent session data and per-region acute load.
- Include a contextual insight note below the silhouette (e.g., _"Significant fatigue detected in Shoulders. CNS showing signs of load from recent HIIT."_).

> See `designs/v2/loadsense_dashboard_v2.3_-_refined_visuals/` for the stress map layout and heat-map overlay approach.

---

## 3. Workout Categories & Subcategories

Iterate the domain logic and data models so that current workout types become **categories** with nested **subcategories**, enabling more descriptive session definitions.

**Examples:**

- _HIIT — Boxing Session — 45 min_
- _Strength — Legs — 60 min_
- _Cardio — Steady State Run — 40 min_
- _Recovery — Shoulder Mobility — 30 min_

**What this unlocks:**

- Each subcategory maps to specific body regions it stresses, allowing the Body Stress Map to update with real per-region data instead of whole-body estimates.
- Session cards in the history show body-region tags (e.g., `Arms`, `Core`, `Cardio`, `Legs`, `Joint Health`).

---

## 4. Low-Impact / Low-Intensity Activities

Include lightweight activity types that currently fall outside the workout model:

- **Walk** — track by distance or time.
- **Stretching / Yoga** — recovery-oriented, minimal load score.
- **Active Recovery** — light movement sessions.

These activities contribute a minimal load score and are factored into recovery calculations so the system has a more complete picture of daily activity.

---

## 5. Smarter Recovery & Suggestion Engine

Leverage the richer data from profile biometrics, categorized sessions, and per-region stress tracking to:

- Estimate **recovery time** per body region based on load history, user profile (age, BMI, fitness level), and time elapsed since last session targeting that region.
- Surface a **readiness score** on the dashboard (e.g., "88% — +4% from yesterday").
- Suggest the **next optimal workout** considering which regions are recovered and which are still fatigued.

---

## 6. Next Session Recommendation Widget

Refactor the current "Add Session" button into a **Next Session** recommendation widget.

**Behavior:**

- Display a contextual suggestion based on recent sessions, body region stress, and recovery state (e.g., _"Upper body recovering. Try **Strength — Legs** or a Recovery Walk."_).
- Include a prominent **Add Session** CTA alongside the suggestion.
- The widget sits at the top of the session list on the dashboard, acting as both an entry point and a smart prompt.

> See the "Next Session Widget" in `designs/v2/loadsense_dashboard_v2.3_-_refined_visuals/` for the layout reference.

---

## 7. Stats Page

Add a new **Stats** page accessible from the main navigation.

**Features:**

- Filter workouts by date range, category, and subcategory.
- Count of sessions per workout type / category.
- Averages: workout duration, RPE, load score.
- Distribution charts: workout type breakdown, effort distribution, weekly/monthly volume.
- Trends over time: total weekly load, ACWR progression, session frequency.

---

## 8. Toast Notification System

Implement a toast notification system for in-app alerts.

**Variants:**

- **Info** — system updates, background processes.
- **Warning** — approaching fatigue thresholds (e.g., _"Training ratio 1.42 — approaching fatigue risk"_).
- **Success** — session saved, profile updated.
- **Error** — save failures, validation errors.

**Behavior:**

- Toasts stack in the top-right corner with slide-in animation.
- Auto-dismiss after a configurable timeout with a manual close button.

> See `designs/v2/generated_screen_2/` for toast layout and variant references.
