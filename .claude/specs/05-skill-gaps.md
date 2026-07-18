# Spec 05 — Skill-gap analysis

## Purpose

The resume-vs-target report: stat tiles, competency-vs-target meters, resume
strengths, and priority gaps feeding the roadmap.

## Route & navigation

- `/gaps` under AppShell. Sidebar "Skill Gaps" (`ChartBar`).

## Data contracts

- `getProfile()`; `prepStore.extraGaps` (gapTags = profile.gapTags + extraGaps.map(g => g.short); gapCount = their total).

## UI layout

h1 28px "Skill-gap analysis"; muted sub: "Parsed from **Priya_Menon_Resume.pdf**
and matched against your target-level requirements."

Stat row (grid 3 × 1fr, gap 14): Cards elev-sm padding 16 with kicker / 30px
heading-font number / muted 12px caption:
1. "Matched skills" / 14 / "Evidenced in your resume"
2. "Gaps identified" / {gapCount} / "Below target for this role"
3. "Est. time to target" / 9 wks (wks 15px muted) / "At current pace"

**Competency vs. target** card (padding 20): card-title, then the same 5
`MeterBar` rows as Overview (label / "level / target").

Bottom grid (1fr 1fr, gap 16):
- **Strengths on your resume** (title row `CheckCircle` accent): accent Tags:
  "Selenium / Playwright", "API test automation", "CI/CD (Jenkins)",
  "Java · Python", "Agile QA lead".
- **Priority gaps to close** (title row `WarningCircle` neutral-400): outline
  Tags from gapTags. Footnote muted 11px "Updated automatically as mock
  interviews surface new weaknesses." Primary Button
  "Generate roadmap from gaps" → `/roadmap`.

## Acceptance checklist

- [ ] Stat tiles show 14 / 5 / 9 wks initially; gap count becomes 7 after a completed mock interview and two new outline tags appear.
- [ ] Meters match Overview values; CTA navigates to /roadmap.
- [ ] Both themes clean.
