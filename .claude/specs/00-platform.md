# Spec 00 — Platform architecture

Ascendra is an AI interview-prep platform: a user uploads a resume, takes a
50-question diagnostic, gets a readiness score, a skill-gap report and a phased
roadmap, then improves through daily drills and adaptive mock interviews, with
a dockable "Ask Ascendra" chat guide. This spec is the single source of truth
for architecture; feature specs (02–10) build on it.

## Stack

- Vite + React 19 + TypeScript (strict). Build must pass `npm run build` (tsc -b + vite).
- `react-router` (v8, library mode — `import { ... } from 'react-router'`).
- `zustand` for state (with `persist` middleware → localStorage).
- `@phosphor-icons/react` for icons (regular weight by default).
- Styling: `ascendra-frontend/src/styles/nocturne.css` ONLY — design tokens + component classes.
  No Tailwind, no CSS-in-JS libs. Inline `style={{}}` is allowed for layout
  (grid/flex/gap) but every color/font/radius/shadow value must be a
  `var(--…)` token. See `.claude/skills/nocturne/SKILL.md`.

## Directory layout

```
ascendra-frontend/src/
├── styles/nocturne.css     # tokens + component classes + light theme (spec 01)
├── components/ui/          # Nocturne primitives (spec 01) — barrel export index.ts
├── components/layout/      # AppShell, Sidebar, TopBar (this spec)
├── features/<name>/        # one folder per feature screen, PascalCase components
├── services/               # mock API layer (async, typed)
├── stores/                 # zustand stores
├── types/index.ts          # all domain types
├── routes.tsx              # route table
├── App.tsx                 # RouterProvider + theme bootstrapping
└── main.tsx
```

## Routes

| Path | Screen | Layout | Guard |
| --- | --- | --- | --- |
| `/login` | Auth — sign in | AuthLayout (centered card) | redirect to `/` if authed |
| `/register` | Auth — create account | AuthLayout | redirect to `/` if authed |
| `/onboarding` | Onboarding steps 1–3 | Bare (max-width 640 centered) | requires auth |
| `/onboarding/diagnostic` | Diagnostic test taker | Bare (max-width 720 centered) | requires auth |
| `/` | Overview | AppShell | requires auth; if `!onboarded` redirect `/onboarding` |
| `/gaps` | Skill Gaps | AppShell | same |
| `/roadmap` | Roadmap | AppShell | same |
| `/interview` | Mock Interview | AppShell | same |
| `/drill` | Daily Drill | AppShell | same |
| `/progress` | Progress | AppShell | same |

Guard = a `RequireAuth` wrapper component in `routes.tsx` reading `authStore`.
Unknown paths redirect to `/`.

## Stores (`ascendra-frontend/src/stores/`)

- **authStore** (`persist` key `asc-auth`): `user: { name, email, initials, plan: 'Pro plan' } | null`,
  `onboarded: boolean`; actions `login(email)`, `register(name, email)` (sets
  `onboarded: false`), `completeOnboarding()`, `logout()`.
  Demo identity when logging in: name "Priya Menon" if none given.
- **themeStore** (`persist` key `asc-theme`): `theme: 'dark' | 'light'`,
  `toggle()`. An effect in `App.tsx` sets `document.documentElement.dataset.theme`.
- **prepStore** (`persist` key `asc-prep`): the prep state:
  - `readiness: number` (start 68), `target: 85`, `delta: '+6 pts this week'`
  - `extraGaps: GapItem[]`, `extraPhases: Phase[]` (appended by completed mock interviews)
  - `diagTaken: boolean`, `diagIdx: number` (resume position in diagnostic)
  - `drillIdx: number`, `drillDone: boolean`
  - actions: `completeMockInterview()` (adds EXTRA_GAPS + EXTRA_PHASE fixtures once, bumps readiness +4),
    `submitDrillAnswer()`, `nextDrillQuestion()`, `setDiagIdx()`, `finishDiagnostic()`, `resetDiagnostic()`
- **uiStore** (not persisted): `chatOpen`, `chatExpanded`; actions `openChat`, `closeChat`, `toggleExpand`.

## Services (`ascendra-frontend/src/services/`)

Async, API-shaped functions returning typed fixtures (all fixture data lives in
`ascendra-frontend/src/services/fixtures.ts`, lifted verbatim from the prototype —
`.claude/design/nocturne/prototype/Ascendra.dc.html`). Simulate latency with a small
`delay(150)`. Functions:

- `profile.ts`: `getProfile(): Promise<Profile>` — readiness, target, delta, competencies, weak areas, gap tags.
- `questions.ts`: `getDrillQuestions(): Promise<DrillQuestion[]>` (10),
  `getInterviewPool(): Promise<InterviewQuestion[]>` (9, tagged by level),
  `getDiagnosticBank(): Promise<DiagnosticQuestion[]>` (50).
- `roadmap.ts`: `getBasePhases(): Promise<Phase[]>` (4 phases), plus the `EXTRA_PHASE` / `EXTRA_GAPS` constants consumed by prepStore.
- `sessions.ts`: `getTrend(): Promise<TrendPoint[]>` ([22,31,44,58,68] × Mar–Jul), `getHistory(): Promise<SessionRecord[]>` (4 rows).

## Domain types (`ascendra-frontend/src/types/index.ts`)

```ts
Competency { name: string; level: number; target: number }
Profile { readiness: number; target: number; delta: string; comps: Competency[]; weak: string[]; gapTags: string[] }
Phase { name: string; weeks: string; status: string; state: 'done' | 'active' | 'next'; modules: string[] }
QuestionLevel = 'Beginner' | 'Intermediate' | 'Advanced'
DrillQuestion { area: string; q: string }
InterviewQuestion { area: string; level: QuestionLevel; q: string }
DiagnosticQuestion { area: string; level: QuestionLevel; q: string }
GapItem { short: string; long: string }
TrendPoint { month: string; value: number }
SessionRecord { date: string; kind: string; score: string; focus: string }
User { name: string; email: string; initials: string; plan: string }
```

## AppShell (`ascendra-frontend/src/components/layout/`)

Sidebar (236px, sticky, surface bg, 1px divider edge right):
- Brand: 26px rounded square accent bg + `Compass` icon + "Ascendra" (heading font, 600, 18px).
- Nav (Phosphor icons): Overview `SquaresFour` → `/`, Skill Gaps `ChartBar` → `/gaps`,
  Roadmap `Path` → `/roadmap`, Mock Interview `MicrophoneStage` → `/interview`,
  Daily Drill `SunHorizon` → `/drill`, Progress `TrendUp` → `/progress`.
  Active item: `--color-accent-900` bg, `--color-accent-200` text. Hover: `--color-neutral-900` bg.
- Bottom: "Re-run diagnostic" Chip (ArrowClockwise icon, navigates `/onboarding`),
  user card (initials avatar `--color-accent-800`/`--color-accent-100`, name,
  "Pro plan", sign-out icon button → `logout()` → `/login`).

Main column: max-width 1180px; top bar right-aligned with: theme toggle icon
button (Sun in dark / Moon in light), Chip "Today's 10" (SunHorizon) → `/drill`,
Chip "Ask Ascendra" (Sparkle, accent icon) → opens chat.

The chat launcher/panel (spec 10) is rendered inside AppShell so it floats on
all authed screens.

## Conventions

- Named exports; one component per file; feature screens live in `ascendra-frontend/src/features/<name>/`.
- Data flows: screen → service (fetch on mount via a small `useAsync` hook or `useEffect`) + stores for mutable state.
- All copy comes from feature specs — do not invent copy.
- Keyboard focus must remain the Nocturne `:focus-visible` ring; never `outline: none` without replacement.

## Registry (update when adding features)

| Spec | Feature | Route | Store fields | Status |
| --- | --- | --- | --- | --- |
| 02 | Auth | /login /register | authStore | built |
| 03 | Onboarding + diagnostic | /onboarding[/diagnostic] | prepStore.diag* | built |
| 04 | Overview | / | — | built |
| 05 | Skill Gaps | /gaps | — | built |
| 06 | Roadmap | /roadmap | prepStore.extraPhases | built |
| 07 | Mock Interview | /interview | prepStore.extraGaps/extraPhases | built |
| 08 | Daily Drill | /drill | prepStore.drill* | built |
| 09 | Progress | /progress | — | built |
| 10 | Chat agent | (floating) | uiStore | built |
