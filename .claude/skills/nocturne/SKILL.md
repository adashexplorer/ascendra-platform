---
name: nocturne
description: Nocturne design-system usage rules for the Ascendra UI. Load before writing or reviewing ANY component/styling code in this repo — tokens, primitives, class reference, and hard do/don'ts.
---

# Nocturne design system — usage rules

Dark-first, compact, quiet. Ground `--color-bg` #161826, single blurple accent
`--color-accent` #9184d9 used as line/glow — never a flood. Full reference:
`.claude/design/nocturne/readme.md`; canonical CSS: `ascendra-frontend/src/styles/nocturne.css` (ported
from `.claude/design/nocturne/styles.css`).

## The one rule

Every color, font, spacing, radius, and shadow value comes from a CSS variable:
`var(--color-*)`, `var(--font-*)`, `var(--space-*)`, `var(--radius-*)`,
`var(--shadow-*)`. Never hard-code hex/font/px values the tokens carry. Inline
`style` is allowed for LAYOUT only (grid/flex/gap/padding/width).

## Build with primitives, not markup

Import from `ascendra-frontend/src/components/ui`:
`Button` (primary=outlined accent / secondary / ghost, `icon`, `block`),
`Chip` (`on`), `Card` (`elev` sm|md|lg, `hover`) with `.card-kicker`/`.card-title`/`.card-body`,
`Tag` (accent | neutral | outline), `Field` (label + error), `Input`, `Textarea`,
`Table`, `Dialog`, `ProgressRing` (value/size/label), `MeterBar` (value/target),
`StepDot` (done|active|todo), `ThemeToggle`.
Icons: `@phosphor-icons/react`, regular weight.

## Tonal ramps

Each role has 100–900 steps on a shared lightness scale. On the dark ground:
- tinted fills / hovers / subtle borders → dark steps (700–900), e.g. hover bg `--color-neutral-900`, active-nav bg `--color-accent-900`
- role base → 500; text on tints and pressed states → light steps (100–300)
- accent-colored paragraph text → `--color-accent-200/300`, never raw accent (contrast is tuned for chrome, not body copy)

## Interaction states

- Hover: one ramp step tint. Pressed: one step past base.
- Focus: `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px }` — already global; never suppress it.
- Disabled: 45% opacity (built in).

## Both themes, always

`data-theme="dark" | "light"` on `<html>` (themeStore + `asc-theme` in
localStorage). Anything you build must be checked in both. Light-theme tokens
are already defined in `nocturne.css` — if you only used variables, it just works.

## Don't

- Solid-fill a primary button (primaries are outlined) or flood any area with the accent.
- Use pure black/white, ad-hoc `color-mix()`, or new shadows (use `--shadow-sm/md/lg`).
- Bolden headings past 600 — hierarchy is size and space.
- Add a CSS file or styled-components; extend `nocturne.css` via ds-engineer instead.
- Use `.hr` — this system prefers whitespace.
