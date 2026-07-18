# Spec 08 — Daily drill

## Purpose

Ten short questions from the user's weakest areas with instant scored feedback
per answer.

## Route & navigation

- `/drill` under AppShell. Sidebar "Daily Drill" (`SunHorizon`). Also reachable
  from Overview "Begin drill" and TopBar "Today's 10" chip.

## Data contracts

- `getDrillQuestions()` → 10 `DrillQuestion`s.
- `prepStore.drillIdx` / `drillDone` (persisted), `submitDrillAnswer()`
  (sets drillDone), `nextDrillQuestion()` (idx+1 clamped to 9, drillDone false).

## UI layout

Header row: h1 28px "Today's drill" + Tag outline "Question {n} of 10".
Sub: "Ten short questions from your weakest areas, delivered every morning.
Answers feed back into your readiness score."

Grid `64px 1fr` gap 20:
- Stepper column: 10 `StepDot`s (numbers 1–10): done (`asc-dot-done`),
  active (`asc-dot-active`), todo.
- Question Card elev-md padding 22: Tag accent = area (align-self start);
  question 18px; Textarea "Type your answer…".
  - After submit (drillDone): feedback panel (accent-900 bg, inset accent-700
    ring, radius 10, padding 16): row Tag accent "Scored 7 / 10" + muted
    "Noted for tomorrow's set"; two 13.5px lines —
    "**Strong:** you named the right isolation boundary and gave a concrete reproduction path."
    and "**Improve:** tie the test back to a failure mode — what breaks in
    production if this isn't caught? Add a load dimension." (bold lead-ins in accent-200).
  - Footer buttons: before submit → primary "Submit answer" + ghost "Skip"
    (advances without feedback); after → primary "Next question →" + ghost "Skip".

## States & interactions

- Submit shows feedback; Next advances and clears it; Skip always advances.
- Position persists across reloads (prepStore). At question 10, Next clamps (stays on 10).

## Acceptance checklist

- [ ] Stepper reflects done/active/todo as the user advances.
- [ ] Submit → feedback panel with score; Next → question advances, textarea clears.
- [ ] Reload mid-drill resumes at the same question.
- [ ] Both themes clean.
