# Spec 07 — Adaptive mock interview & mock coding test

## Purpose

Two assessment modes on one screen. **Adaptive interview**: a simulated session
drawn from the user's skill-gap areas, filterable by level; completing it
surfaces two new gaps and appends Phase 5 to the roadmap. **Mock coding test**:
configurable coding questions under interview conditions; the assessment adds a
coding gap (with a learning resource) and appends a coding-reinforcement phase.

## Route & navigation

- `/interview` under AppShell. Sidebar "Mock Interview" (`MicrophoneStage`).
- Mode chips at the top of the screen (below the intro): "Adaptive interview"
  (`MicrophoneStage`) / "Mock coding test" (`Code`), `on` for the active mode.
  Local state, default interview. The h1/sub and everything below swap by mode.

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

## Mock coding test mode

Data: `getCodingPool()` service → 12 `CodingQuestion { area, level, q }`
(4 areas: Arrays & Strings, Data Structures, Concurrency, Algorithms × 3
levels), plus a `CT_RES` resource map area → `{ res, url }` (LeetCode tag pages
/ NeetCode roadmap — values verbatim from the prototype fixtures).

Three stages (local state `setup | active | done`):

**Setup** — Card elev-md padding 24: title row `SlidersHorizontal` accent icon +
"Set up your test" (15px); muted sub "All fields are optional — anything left on
**Random** is picked for you from a mixed pool." Three chip groups under
kickers: Difficulty (Random/Beginner/Intermediate/Advanced), Number of
questions (Random/3/5/10), Area (Random + the 4 areas). Primary Button `Play`
"Start coding test" — filters the pool by chosen level/area (fallback: whole
pool), shuffles, takes `count || 5`.

**Active** — header row: Tag outline "Question {n} of {total}" + ghost Button
`X` "Abandon test" (back to setup). Question Card elev-md padding 22: area/level
tags; question 17px; Field "Your solution" Textarea in monospace
(`ui-monospace, SFMono-Regular, Menlo, monospace`), min-height 190, 13px,
placeholder "// Write your code here — or draft it in the Playground and paste
it back". Footer: secondary Button `Code` "Open playground" → `/playground`;
right-aligned primary "Submit & next" (`ArrowRight`), last question →
"Finish & assess".

**Done** — Card elev-md padding 24: Tag accent "Assessed · {solved} / {total}
solved" (solved = max(1, round(total × 0.6))) + muted "Readiness +3"; h3
"Test assessed — plan updated"; body: "Solid problem decomposition, but
**{weakArea}** cost you the most time and correctness. It's been added to your
skill gaps and a reinforcement phase was appended to your roadmap."
(weakArea = chosen area, else last question's area). Two neutral-900 panels:
"Skill gap added" — outline Tag "{weakArea} (coding)" plus a resource link
(`.asc-res` row: resource name + `ArrowSquareOut`, opens `CT_RES[weakArea].url`);
"Roadmap updated" — `PlusCircle` accent + "Coding-reinforcement phase appended —
existing phases kept". Buttons: primary "View updated roadmap" → `/roadmap`,
secondary "See skill gaps" → `/gaps`, ghost "New coding test" (back to setup).

Store effect on finish: `prepStore.completeCodingTest(weakArea)` — idempotent
per area: adds gap `{ short: '{area} (coding)', long: 'Coding practice: {area}',
res, url }` and appends phase `{ name: 'Phase {next} · Coding reinforcement —
{area}', weeks: 'Next 2 weeks', status: 'New', state: 'active', modules:
[{ name: '{area} problem set (15 problems)', res, url }, { name: 'Timed re-test
on {area}', res: 'Mock coding test', url: 'https://leetcode.com/assessment/' }] }`,
readiness +3 (once per area).

## States & interactions

- Submit & continue advances; previously answered stack above (interview mode).
- Level chips filter the pool (3 questions each) and reset the session.
- Finish triggers `completeMockInterview()` exactly once (idempotent on repeat sessions).
- Mode chips swap interview/coding content; each mode keeps its own local state.
- Coding test: abandon returns to setup losing progress; finishing calls
  `completeCodingTest()`; repeating the same area does not duplicate gap/phase.

## Acceptance checklist

- [ ] 9 questions at "All"; picking a level shows Round 1 of 3.
- [ ] Advancing stacks answered cards; last question shows "Finish & score".
- [ ] Completion screen appears; /roadmap then shows Phase 5; /gaps shows 7 gaps; Overview readiness reads 72.
- [ ] "New session" restarts cleanly; completing again does not duplicate Phase 5.
- [ ] Mode chips swap to the coding test; setup chips select and show on-state.
- [ ] Start honors difficulty/count/area (3/5/10 or default 5 questions; single-area pools repeat-filter correctly).
- [ ] Finish & assess shows "{solved} / {total} solved", adds "{area} (coding)" gap with working resource link, appends the coding-reinforcement phase, readiness +3 — all idempotent per area and persisted on reload.
- [ ] "Open playground" navigates to /playground.
- [ ] Both themes clean in all three stages.
