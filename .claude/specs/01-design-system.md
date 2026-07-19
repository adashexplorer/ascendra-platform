# Spec 01 — Design system port (Nocturne → React)

## Purpose

Port the Nocturne design system (`.claude/design/nocturne/styles.css` + the prototype's
light-theme override) into the app, and wrap its classes in typed React
primitives so features never touch raw markup patterns inconsistently.

## Part A — `ascendra-frontend/src/styles/nocturne.css`

1. Copy `.claude/design/nocturne/styles.css` verbatim (tokens, ramps, base type, component classes).
2. Append the app-level additions from the prototype (`.claude/design/nocturne/prototype/Ascendra.dc.html` `<style>` block):
   - `:root{--asc-max:1180px}`, `button{font-family:inherit}`
   - `.asc-chip` (+ `:hover`, `.asc-chip-on`), `.asc-dot` (+ `-done`, `-active`),
     `.asc-card-hover`, `.asc-chat` (+ `.asc-chat-exp`), `.asc-link`,
     `.asc-input-err`, `.asc-field-err`
   - v2 additions: `.asc-res` (resource-link row wrapper — inherits color, no
     underline; hovering underlines its `.asc-res-lnk`), `.asc-res-lnk`,
     `.asc-todo-done` (line-through, neutral-500), and global anchor colors
     `a{color:var(--color-accent)}` / `a:hover{color:var(--color-accent-200)}`
   - the full `:root[data-theme="light"]` token override block (colors, ramps, shadows)
     and its two light-theme shadow tweaks for `.asc-card-hover:hover` / `.asc-chat`.
3. Import once in `ascendra-frontend/src/main.tsx`.

## Part B — primitives in `ascendra-frontend/src/components/ui/` (barrel `index.ts`)

All components: typed props, `className`/`style` passthrough, named exports.
They render Nocturne classes — no new visual invention.

- `Button` — props `variant: 'primary' | 'secondary' | 'ghost'` (default primary), `icon?: boolean`, `block?: boolean` → `.btn .btn-*`. Accepts all native button props.
- `Chip` — `.asc-chip`, prop `on?: boolean` → `.asc-chip-on`. Children usually `<Icon/> label`.
- `Card` — `.card` + prop `elev?: 'sm' | 'md' | 'lg'` → `.elev-*`, `hover?: boolean` → `.asc-card-hover`. Subcomponents or classes: `.card-kicker`, `.card-title`, `.card-body`, `.card-meta` (export `CardKicker`, `CardTitle` helpers or document class usage).
- `Tag` — `variant: 'accent' | 'neutral' | 'outline'` → `.tag .tag-*`.
- `Field` — wraps `.field`: props `label`, `error?: string`, children (input). Renders `.asc-field-err` div when `error` set.
- `Input` / `Textarea` — `.input` (+ `.asc-input-err` when `invalid` prop).
- `Table` — thin wrapper rendering `.table` (children thead/tbody supplied by caller).
- `Dialog` — `.dialog-backdrop` + `.dialog` with `.dialog-title/-body/-actions`; props `open`, `onClose`.
- `ProgressRing` — SVG ring, props `value` (0–100), `size?=132`, `stroke?=11`, `label?` (sub-caption, e.g. "Readiness"). Track `var(--color-neutral-900)`, arc `var(--color-accent)`, round linecap, rotate −90°; centered number in heading font 38/600.
- `MeterBar` — competency bar: props `value`, `target` (both 0–100). 10px track `--color-neutral-900` radius 5; fill rect `--color-accent`; 0.6-wide tick at `target` in `--color-neutral-400` (SVG, viewBox `0 0 100 10`, preserveAspectRatio none).
- `ThemeToggle` — icon Button (secondary) reading `themeStore`; Sun icon + title "Switch to light theme" when dark, Moon + "Switch to dark theme" when light.
- `StepDot` — `.asc-dot` with `state: 'done' | 'active' | 'todo'`, children = number.

Icons: `@phosphor-icons/react` components, sized via `size` prop or font-size.

## Acceptance checklist

- [ ] `npm run build` passes.
- [ ] A scratch render of every primitive matches Nocturne: outlined primary buttons, accent `:focus-visible` ring on tab, hover tints from ramps.
- [ ] Flipping `data-theme` to `light` re-skins every primitive with no visual breakage.
- [ ] No hard-coded colors outside `nocturne.css` (the two error-red values live in the CSS as `.asc-input-err`/`.asc-field-err`).
