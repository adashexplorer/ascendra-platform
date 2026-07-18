# Spec 04 — Overview (dashboard)

## Purpose

Landing screen after auth: readiness at a glance, today's drill entry point,
competency breakdown, focus areas, and the next scheduled session.

## Route & navigation

- `/` under AppShell. Sidebar "Overview" (`SquaresFour`).

## Data contracts

- `getProfile()` for competencies/weak/gapTags; `prepStore` for readiness/delta/target and extraGaps (weak list = profile.weak + extraGaps.map(g => g.long)).

## UI layout

Header: h1 32px "Good morning, Priya" (derive "Good morning/afternoon/evening,
{firstName}" from time of day and authStore user); muted sub
"Tuesday, 15 July — Day 47 of your plan" (render current date + static "Day 47 of your plan").

Row 1 (grid `1.35fr 1fr`, gap 16):
- **Readiness card** (Card elev-sm hover, padding 22, grid auto/1fr gap 24 centered):
  `ProgressRing value={readiness}` size 132 label "READINESS". Right column:
  kicker "Interview readiness"; body 15px "On track toward your target readiness
  of **85**. Keep the daily loop going to close your gaps."; accent-200 line
  `ArrowUpRight` + "+6 pts this week"; buttons: primary "Start a mock loop"
  → `/interview`, secondary "View roadmap" → `/roadmap`.
- **Today's drill card** (Card elev-sm hover, padding 20, content spread
  vertically): title row `SunHorizon` accent 18px + card-title "Today's 10 questions";
  body (75% opacity) "Ten questions picked from your weakest areas — concurrency,
  test design and system design. ~15 min."; tag row: Tag accent "Concurrency ×3",
  Tag neutral "Test Strategy ×3", "System Design ×2", "Behavioral ×2".
  Primary block Button `Play` "Begin drill" → `/drill`.

Row 2 (same grid, margin-top 16):
- **Competency breakdown** (Card elev-sm padding 20): header row card-title
  "Competency breakdown" + ghost Button "Full report →" → `/gaps`. For each of
  the 5 competencies: label row (name / muted "level / target") + `MeterBar`.
  Footnote muted 11px "Marker shows the target level for this role."
- **Right rail** (column, gap 16):
  - Focus areas card (padding 18): title row `Brain` accent icon + "Focus areas"
    (15px). Weak-area rows: `DotOutline` accent icon + text, 13px, divider
    bottom. Footnote "Carried forward from your last sessions."
  - Next up card (hover): kicker "Next up"; card-title 16px "Mock loop · Friday 9:00";
    body 72% "4 rounds: coding, test design, system design, behavioral.";
    secondary Button "Preview session" → `/interview`.

## States & interactions

- All buttons navigate as listed. Card hover lift via `.asc-card-hover`.
- After a completed mock interview (spec 07), readiness and the weak list update here.

## Acceptance checklist

- [ ] Ring shows 68 with correct arc proportion; greeting matches time of day.
- [ ] 5 MeterBars render with target ticks; "Full report →" goes to /gaps.
- [ ] Begin drill goes to /drill; both theme variants clean.
- [ ] After finishing a mock interview, readiness bumps (+4) and two new focus areas appear.
