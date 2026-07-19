# Spec 06 — Personalized roadmap

## Purpose

The phased prep plan as a vertical timeline. Mock interviews append phases;
nothing is removed.

## Route & navigation

- `/roadmap` under AppShell. Sidebar "Roadmap" (`Path`).

## Data contracts

- `getBasePhases()` (4 phases) + `prepStore.extraPhases` appended.
- Phase → tag mapping: state done → Tag neutral, active → Tag accent, next → Tag outline. Status text comes from the phase ("Complete", "In progress", "Upcoming", "New").

## UI layout

h1 28px "Personalized roadmap"; muted sub "Built from your skill gaps. New
phases are appended as mock interviews surface weaknesses — nothing is removed."

Timeline (padding-left 6): each phase = grid `auto 1fr` gap 16:
- Left rail: 12px dot (done → `--color-neutral-500` fill; active → `--color-accent`
  fill; next → transparent with inset 1.5px `--color-neutral-600` ring) + 2px
  vertical `--color-divider` line filling remaining height.
- Right: Card elev-sm hover padding 18 margin-bottom 16: header row (card-title
  16px phase name + muted 12px weeks / status Tag right); module list: each
  module is an external resource link row (`.asc-res`, `target="_blank"
  rel="noopener"`, title "Open resource in a new tab", divider bottom):
  `BookOpenText` neutral-500 icon + module name 13px (flex 1) + right
  `.asc-res-lnk` (11.5px accent): resource name + `ArrowSquareOut` icon.

Modules are `PhaseModule { name, res, url }`. Base phases (fixtures): Phase 1 ·
Foundations (Weeks 1–3, done), Phase 2 · Test Engineering Depth (Weeks 4–7,
active), Phase 3 · Distributed Systems & Design (Weeks 8–11, next), Phase 4 ·
Interview Simulation (Weeks 12–14, next) — module names + resource labels/urls
verbatim per `ascendra-frontend/src/services/fixtures.ts` (LeetCode Explore,
Exercism, Grind 75, Martin Fowler Test Pyramid, Playwright best practices,
Jenkov, k6 docs, Google SWE Book, Principles of Chaos, Tech Interview Handbook,
Pramp, interviewing.io).

## Acceptance checklist

- [ ] 4 phases render with correct dot states and status tags.
- [ ] Module rows are external links: resource label + ArrowSquareOut on the right, hover underlines the link text, opens in a new tab.
- [ ] After completing a mock interview, "Phase 5 · Post-mock reinforcement" (Weeks 15–16, tag accent "New") appears at the end with its 3 modules, and persists on reload.
- [ ] After a coding test, the "Coding reinforcement — {area}" phase appears with its 2 resource-linked modules.
- [ ] Both themes clean.
