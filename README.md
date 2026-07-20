# Ascendra

**AI interview-prep platform.** Upload a resume → get an AI skill-gap analysis
→ follow a phased roadmap that evolves as you practice → close gaps with daily
drills, adaptive mock interviews, and mock coding tests → track readiness over
time — with a dockable "Ask Ascendra" AI chat guide throughout.

The frontend is a complete, working React SPA today (mock service layer +
localStorage). The backend is fully designed — an AI-first Java/Spring Boot
microservices architecture — and its REST contract is authored and executable
as an OpenAPI/Swagger spec, ahead of implementation.

> Repo status: **frontend built & verified** · **backend designed (HLD) + API
> contract executable** · **backend implementation not started**.

---

## What Ascendra does

| Capability | Description |
| --- | --- |
| **Onboarding** | Upload a resume → AI extracts a skill inventory → take a 50-question diagnostic (or skip it) to baseline readiness |
| **Skill-gap analysis** | Matched skills vs. target-role requirements, with gaps ranked by priority — each gap links to a curated learning resource |
| **Personalized roadmap** | A phased plan (modules + resources) that **evolves append-only**: new phases are added as weaknesses surface, nothing is ever removed |
| **Daily drills** | 10 short questions a day from your weakest areas, with instant AI-scored feedback |
| **Adaptive mock interviews** | AI-driven interview session, level-filterable, that adapts follow-ups to your answers and scores the session |
| **Mock coding tests** | Configurable coding assessment (difficulty / count / area) scored by AI, feeding new gaps + roadmap phases |
| **Coding playground** | Embedded code runner to practice without leaving the app |
| **Progress tracking** | Readiness score, trend chart, and session history |
| **Notes & TODOs** | A dockable panel for free-form prep notes and a task list, autosaved |
| **Ask Ascendra** | A context-aware AI chat guide (RAG-grounded on your own plan) with quick actions, dockable on every screen |

Both light and dark themes are fully supported throughout.

---

## Repository layout

This repo is organized into three top-level categories:

```
ascendra-platform/
├── ascendra-frontend/     # React SPA — the only category with runnable app code today
├── ascendra-backend/      # Backend source (empty — implementation not started)
│   └── api/               # BUT: the executable OpenAPI/Swagger contract lives here
├── .claude/                # ALL project documentation + Claude Code agent infrastructure
│   ├── specs/              # Frontend feature specs (source of truth for the UI)
│   ├── hld/                 # Backend High-Level Design (architecture, services, ADRs)
│   ├── design/nocturne/     # The Nocturne design system (tokens, components, prototype)
│   ├── agents/               # Project-specific Claude Code agents
│   └── skills/                # Project-specific Claude Code skills/workflows
├── CLAUDE.md                # Claude Code project instructions (repo root, by convention)
├── README.md                 # This file
└── package.json                # Root proxy — npm scripts forward into ascendra-frontend/
```

---

## Quick start

**Prerequisites:** Node.js 18+.

```bash
# 1. Install and run the frontend (from the repo root)
npm install --prefix ascendra-frontend
npm run dev              # → http://localhost:5173
```

Sign in with **any valid email + a password of 8+ characters** (there is no
real backend yet — auth is a client-side mock). Registering instead of signing
in walks you through onboarding from scratch.

```bash
# 2. Explore the backend API contract (separate, optional)
cd ascendra-backend/api
npm install
npm run mock              # Prism mock server → http://127.0.0.1:4010
npm run docs               # Swagger UI (Try-it-out) → http://127.0.0.1:8088, in another terminal
```

With both running, open Swagger UI, hit **Authorize** with any bearer token,
and **Try it out** any endpoint — it calls the live mock and returns realistic
example data (the same shapes the frontend renders).

---

## Frontend — `ascendra-frontend/`

**Stack:** Vite · React 19 · TypeScript (strict) · React Router v8 (library
mode) · Zustand (with `persist` → localStorage) · `@phosphor-icons/react`.

**Commands** (run from the repo root — proxied — or inside `ascendra-frontend/`):

| Command | Effect |
| --- | --- |
| `npm run dev` | Start the dev server on port 5173 |
| `npm run build` | Type-check (`tsc -b`) + production build — must stay clean |
| `npm run lint` | `oxlint` |
| `npm run preview` | Serve the production build locally |

**Architecture:**

- `src/styles/nocturne.css` + `src/components/ui/` — the **Nocturne** design
  system: a dark-first, compact UI kit (tokens for color/type/space/radius/
  shadow, outlined primary buttons, Phosphor icons) ported from
  `.claude/design/nocturne/`, with typed React primitives (`Button`, `Card`,
  `Tag`, `Field`, `ProgressRing`, `MeterBar`, `Dialog`, …). Both themes
  (`data-theme="dark"|"light"`) are supported by every primitive.
- `src/features/<name>/` — one folder per screen (auth, onboarding, overview,
  skill-gaps, roadmap, mock-interview, daily-drill, playground, progress, chat).
- `src/services/` — a **mock API layer**: typed async functions returning
  fixture data (`fixtures.ts`) with simulated latency, standing in for the real
  backend until it exists.
- `src/stores/` — Zustand stores: `authStore`, `themeStore`, `prepStore`
  (readiness/gaps/roadmap/drill/coding-test state), `uiStore` (chat/notes
  panel), `notesStore` (notes & TODOs, own localStorage keys).
- `src/types/index.ts` — all domain types (`Profile`, `Phase`, `GapTag`,
  `DrillQuestion`, `CodingQuestion`, …).
- `src/routes.tsx` — the route table with `RequireAuth` / `RedirectIfAuthed`
  guards (unauthenticated → `/login`; authenticated-but-not-onboarded →
  `/onboarding`).

There is currently **no network I/O** — the app is fully self-contained and
runs entirely against fixtures + localStorage, matching the OpenAPI contract's
shapes so a real backend can be dropped in behind `src/services/` later without
UI changes.

---

## Backend — `ascendra-backend/`

No Java/Spring Boot code exists yet. What *does* exist is the complete design
and an executable REST contract, so frontend integration and even independent
service implementation can start immediately against a stable interface.

### API contract — `ascendra-backend/api/`

A consolidated, **executable OpenAPI 3.0.3** spec (`openapi.yaml`, 65
operations) realizing every endpoint in the HLD's API contract doc — one
operation per row, covering all services. It ships with:

| Command | Effect |
| --- | --- |
| `npm run lint` | Validate the spec (`redocly lint`) |
| `npm run mock` | Prism mock server on `:4010` — validates requests, returns realistic example responses |
| `npm run docs` | Swagger UI with **Try-it-out**, pre-wired to the mock, on `:8088` |
| `npm run bundle` | Bundle to a single self-contained file (for CI / codegen) |

Conventions baked into the contract: `/api/**` is the external gateway surface,
`/internal/**` is service-to-service only, RFC 9457 `problem+json` errors,
`202` + a `scoring`/`parsing` status vocabulary for long-running AI work,
`429` with `Retry-After`, and JWT bearer auth. Response examples are drawn
directly from the frontend's own fixtures, so the mock returns data the UI
would recognize (e.g. readiness `68`, the same roadmap phases).

`springdoc-openapi`, generated per service once the Java code exists, is the
intended eventual source of truth — this contract fixes the surface today and
will stay in sync with it.

### High-Level Design — `.claude/hld/`

A full architect-level design for an **AI-first Java 21 / Spring Boot
microservices** backend:

- **Services:** API gateway, identity, profile, assessment, roadmap, progress,
  AI orchestrator, notification (future) — one design doc each, with
  responsibilities, API surface, data model, events, and failure modes.
- **AI layer:** LangChain4j-based orchestrator — provider-agnostic chat models
  (Claude default, OpenAI/Ollama swappable), RAG over PostgreSQL + `pgvector`,
  an MCP server exposing platform capabilities to external AI clients, a
  prompt registry, and guardrails.
- **Cross-cutting docs:** data architecture, security, observability,
  deployment (Docker Compose dev → Kubernetes prod), and the API contract.
- **Traceable requirements:** every capability traces to a catalogued
  `BR-`/`FR-`/`NFR-` id in `01-requirements.md`, with architecture decisions
  logged as ADRs in `02-architecture-principles.md`.

Start at [`.claude/hld/00-hld-overview.md`](.claude/hld/00-hld-overview.md) —
it's the registry and C4-level map of every other document.

---

## Working on this project with Claude Code

This repo is built around spec-first, agent-driven workflows (see
[`CLAUDE.md`](CLAUDE.md) for the full detail Claude Code reads automatically):

- **`/add-feature <description>`** — add a new UI feature or functionality.
  Runs spec → design-system delta → build → browser verification → record.
- **`/update-hld <change>`** — evolve the backend architecture. Catalogs the
  requirement first, then updates the affected design docs and ADRs, keeping
  everything traceable.

Project agents (`.claude/agents/`): `ds-engineer` (design system), 
`feature-builder` (one feature spec at a time), `ui-verifier` (browser-driven
QA), `hld-architect` (backend design docs).

---

## Status summary

| Area | Status |
| --- | --- |
| Frontend UI (all features above) | ✅ Built, browser-verified, both themes |
| Design system (Nocturne) | ✅ Complete token set + primitives |
| Backend HLD | ✅ Complete — services, AI layer, data, security, deployment, ADRs |
| Backend REST contract (OpenAPI/Swagger) | ✅ Complete, linted, executable via mock + Swagger UI |
| Backend implementation (Spring Boot services) | ⬜ Not started |
