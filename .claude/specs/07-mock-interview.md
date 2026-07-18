# Spec 07 — Adaptive mock interview

## Purpose

Simulated interview session drawn from the user's skill-gap areas, filterable by
level. Completing a session scores it, surfaces two new gaps, and appends
Phase 5 to the roadmap.

## Route & navigation

- `/interview` under AppShell. Sidebar "Mock Interview" (`MicrophoneStage`).

## Data contracts

- `getInterviewPool()` → 9 questions (3 per level).
- Local state: `level: 'all' | QuestionLevel`, `idx`, `complete`.
- On finish: `prepStore.completeMockInterview()` — adds EXTRA_GAPS
  (Rate-limiter partitions / Impact metrics) and EXTRA_PHASE (Phase 5) once,
  readiness +4.

## UI layout

Header row: h1 28px "Adaptive mock interview" + Tag outline "Round {n} of {total}".
Sub: "Questions adapt to how you answer. Speak or type — you'll get scored
feedback at the end."

Level filter row: muted "Level" + Chips: All / Beginner / Intermediate /
Advanced (`on` for the selected one). Changing level resets idx and complete.

Source line (12.5px neutral-400): `Target` accent icon + "Drawn from your
current skill gaps:" + Tag neutral per unique pool area (first segment before " · ").

**Active session** (`!complete`):
- Answered questions above the active card: Card padding 16, 70% opacity:
  tag row (area neutral, level outline, right-aligned accent Tag "Answered") + 14px question.
- Active Card elev-md padding 22: tag row; question row: 34px accent-800 circle
  with `MicrophoneStage` accent-100 icon + 17px question text; Field "Your answer"
  Textarea placeholder "Structure your answer… (the interviewer follows up based
  on what you say)"; footer: secondary Button `Microphone` "Record" (presentational),
  right-aligned primary "Submit & continue" (ArrowRight) — on last question label
  becomes "Finish & score".

**Completed** (`complete`): Card elev-md padding 24: row Tag accent
"Session scored · 3.4 / 5" + muted "Readiness +4"; h3 21px "Nice work — here's
what changed"; body 14px max-640 "Strong on flaky-test triage and coverage
trade-offs. Two new weaknesses surfaced under the advanced system-design
questions — they've been folded into your plan." Two panels (grid 1fr 1fr,
neutral-900 bg radius 10 padding 15): "New skill gaps added" (outline Tags
"Rate-limiter partitions", "Impact metrics") and "Roadmap updated"
(`PlusCircle` accent + "Phase 5 appended — existing phases kept").
Buttons: primary "View updated roadmap" → `/roadmap`, secondary "See skill gaps"
→ `/gaps`, ghost "New session" (resets idx/complete).

## States & interactions

- Submit & continue advances; previously answered stack above.
- Level chips filter the pool (3 questions each) and reset the session.
- Finish triggers `completeMockInterview()` exactly once (idempotent on repeat sessions).

## Acceptance checklist

- [ ] 9 questions at "All"; picking a level shows Round 1 of 3.
- [ ] Advancing stacks answered cards; last question shows "Finish & score".
- [ ] Completion screen appears; /roadmap then shows Phase 5; /gaps shows 7 gaps; Overview readiness reads 72.
- [ ] "New session" restarts cleanly; completing again does not duplicate Phase 5.
- [ ] Both themes clean.
