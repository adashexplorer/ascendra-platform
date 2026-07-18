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
  16px phase name + muted 12px weeks / status Tag right); module list: rows with
  `BookOpenText` neutral-500 icon + 13px text, divider bottom.

Base phases (fixtures): Phase 1 · Foundations (Weeks 1–3, done), Phase 2 · Test
Engineering Depth (Weeks 4–7, active), Phase 3 · Distributed Systems & Design
(Weeks 8–11, next), Phase 4 · Interview Simulation (Weeks 12–14, next) — module
lists per `ascendra-frontend/src/services/fixtures.ts`.

## Acceptance checklist

- [ ] 4 phases render with correct dot states and status tags.
- [ ] After completing a mock interview, "Phase 5 · Post-mock reinforcement" (Weeks 15–16, tag accent "New") appears at the end with its 3 modules, and persists on reload.
- [ ] Both themes clean.
