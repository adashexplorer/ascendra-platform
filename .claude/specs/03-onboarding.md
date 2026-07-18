# Spec 03 — Onboarding & diagnostic test

## Purpose

Three-step first-run flow: upload resume → review the 50-question diagnostic →
plan curated (or locked if skipped). The diagnostic has its own full test-taker
screen. Completing it flips `prepStore.diagTaken` and unlocks the dashboard.

## Route & navigation

- `/onboarding` — steps 1–3 (local `step` state, or URL param; keep it simple: local state).
  Bare layout, max-width 640 centered, inside the authed area but WITHOUT the AppShell sidebar.
- `/onboarding/diagnostic` — the test taker, max-width 720.
- Sidebar's "Re-run diagnostic" chip navigates here (step 1).
- "Go to my dashboard" → `authStore.completeOnboarding()` → `/`.

## Data contracts

- `getDiagnosticBank()` → 50 `DiagnosticQuestion`s.
- `prepStore`: `diagIdx` (resume position, persisted), `diagTaken`,
  `finishDiagnostic()` (sets diagTaken true, resets diagIdx), `resetDiagnostic()`.

## UI layout

Progress rail at top: 3 flex bars 4px high, radius 2 — filled `--color-accent`
for reached steps, `--color-neutral-800` otherwise.

**Step 1 — Upload your resume**: kicker "Step 1 of 3"; h1 "Upload your resume" (28px);
sub "We'll parse it, extract your skills, and build a diagnostic test to baseline your readiness."
Dropzone label: dashed 1.5px `--color-neutral-700` border, radius 14, bg
`--color-neutral-900`, padding 44, centered: `FileArrowUp` 34px accent icon,
"Drop your resume here *or click to browse*", muted "PDF or DOCX · up to 10 MB".
Below: uploaded-file row (surface bg, shadow-sm): `FilePdf` accent icon,
"Priya_Menon_Resume.pdf" + muted "Uploaded · 214 KB", `CheckCircle` accent icon.
(The dropzone is presentational — clicking may toggle the row visible; the demo file row shows by default.)
Primary block Button "Continue" → step 2.

**Step 2 — Take your diagnostic mock test**: kicker "Step 2 of 3"; h1; sub
"From the skills in your resume we assembled these **50 questions**. You don't
have to take it now — but your roadmap and skill-gap report can't be curated
until you do." Card listing all 50 questions: header row "All 50 questions" +
Tag accent "~40 min"; scrollable body (max-height 320) — each row: number,
question text 13.5px, Tag neutral (area) + Tag outline (level). Info banner
(accent-900 bg, inset accent-700 ring): Info icon + "Complete this diagnostic
to curate your roadmap and skill-gap report."
Buttons: secondary "Back", secondary "I'll take it later" (→ step 3, not taken),
primary flex-1 "Take diagnostic now" (Play icon) → `/onboarding/diagnostic`.

**Step 3 — curated** (diagTaken): centered; 64px circle accent-900 bg with
`CheckCircle` accent 30px; kicker "Step 3 of 3 · Plan curated"; h1 "Your plan is ready";
sub "From your 50-question diagnostic we scored 14 matching skills and {gapCount}
gaps, and built your roadmap. Starting readiness **68**." Two cards side by side:
"Skill gaps identified" (outline Tags from profile gapTags) and "Roadmap created"
(phase names with `DotOutline` accent icons). Primary Button "Go to my dashboard".

**Step 3 — locked** (!diagTaken): centered; 64px circle neutral-900 with
`LockSimple`; kicker "Step 3 of 3"; h1 "Your plan isn't curated yet"; sub "We
can't build your roadmap or skill-gap report until you complete the 50-question
diagnostic." Buttons: secondary "Back to the test" (→ step 2), primary
"Take diagnostic now" (Play).

**Diagnostic test taker** (`/onboarding/diagnostic`): header row h1 "Diagnostic
test" (26px) + ghost Button "Save & exit" (X icon) → back to onboarding step 2.
Sub: "Answer in your own words — there's no timer. Your responses baseline your
readiness and curate your plan." Progress: 8px bar (accent fill, width = (idx+1)/50,
transition) + "{n} / 50". Question Card (`elev md`, padding 24): Tag neutral area +
Tag outline level; question 18px; Textarea "Type your answer…". Footer buttons:
secondary "Previous" (only when idx>0, ArrowLeft), ghost "Skip" (advances),
right-aligned primary "Save & next" (ArrowRight) or, on Q50,
"Finish & curate plan" (Check) → `finishDiagnostic()` → onboarding step 3.

## States & interactions

- Step navigation: Continue/Back clamp 0–2. Taking the test from step 2 or 3.
- Test position persists (`diagIdx` in prepStore) — Save & exit then re-enter resumes.
- Finishing sets `diagTaken`, navigates to step 3 curated variant.
- "Re-run diagnostic" from sidebar re-enters at step 1 with `resetDiagnostic()`.

## Acceptance checklist

- [ ] Register → lands on step 1; full happy path reaches dashboard.
- [ ] "I'll take it later" → locked step 3 with lock icon and both CTAs working.
- [ ] Test taker: progress bar and counter advance; Previous appears from Q2; finishing from Q50 curates the plan.
- [ ] Save & exit mid-test, reload, re-enter → resumes at same question.
- [ ] Both themes render correctly.
