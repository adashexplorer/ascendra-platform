# Spec NN — <Feature name>

> Copy this file to `.claude/specs/NN-<feature-slug>.md` when adding a feature.
> Every section is required. Keep it concrete: an agent must be able to build
> the feature from this file alone plus `.claude/specs/00-platform.md`.

## Purpose

One paragraph: what the feature does for the user and why it exists.

## Route & navigation

- Route path(s), which layout they render under (auth gate / onboarding / app shell).
- Nav entry (sidebar label + Phosphor icon name) if any.
- Guards/redirects.

## Data contracts

- Domain types used or added (`ascendra-frontend/src/types/`).
- Service functions used or added (`ascendra-frontend/src/services/`) — name, signature, behavior, what is persisted to localStorage.
- Store slices used or added (`ascendra-frontend/src/stores/`) — state fields and actions.

## UI layout

Describe the screen top-to-bottom. Reference Nocturne primitives from
`ascendra-frontend/src/components/ui/` (Button, Card, Tag, Chip, Field/Input/Textarea, Table,
Dialog, ProgressRing, MeterBar) and design tokens (`var(--color-*)`,
`var(--space-*)`, `var(--radius-*)`, `var(--shadow-*)`). Include exact copy
for headings, labels, empty states, and buttons where it matters.

## States & interactions

Every interactive element: what it does, state transitions, edge cases
(empty, loading, error, first-run), keyboard focus behavior.

## Acceptance checklist

- [ ] Bullet list of observable behaviors a verifier can check in the browser.
- [ ] Include both dark and light theme rendering.
- [ ] Include persistence expectations (survives reload) where relevant.
