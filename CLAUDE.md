# Ascendra Platform

AI interview-prep platform: resume → skill-gap analysis → phased roadmap →
daily drills + adaptive mock interviews → readiness tracking, with a dockable
"Ask Ascendra" chat guide. The UI currently runs frontend-only against a mock
service layer (fixtures + localStorage); the backend exists as an HLD.

## Repo layout — three categories

- `ascendra-frontend/` — the frontend source code (Vite + React 19 + TS).
- `ascendra-backend/` — the backend source code (Java 21 / Spring Boot
  microservices per the HLD; empty until implementation starts). Its
  `api/openapi.yaml` is the consolidated, executable OpenAPI 3.0.3 contract for
  the whole gateway surface (realizes `.claude/hld/25-api-contracts.md`) — from
  `ascendra-backend/api/`: `npm install && npm run mock` (Prism mock on :4010),
  `npm run docs` (Swagger UI Try-it-out on :8088), `npm run lint` (redocly).
- `.claude/` — ALL documentation + agent infrastructure: `specs/` (UI feature
  specs), `hld/` (backend HLD), `design/` (Nocturne design system), `agents/`,
  `skills/`. Only this CLAUDE.md lives at the repo root.

## Stack & commands

- Vite + React 19 + TypeScript (strict), react-router v8 (library mode,
  `import from 'react-router'`), zustand (persist → localStorage),
  @phosphor-icons/react.
- Run from the repo root (proxied to `ascendra-frontend/` via the root
  package.json): `npm run dev` (port 5173) · `npm run build` (tsc -b + vite —
  must stay clean) · `npm run lint`.
- Browser preview: launch config `ascendra` in `.claude/launch.json`.

## Where things live

- `.claude/specs/` — the source of truth for every feature. `00-platform.md` is the
  architecture + feature registry; `_TEMPLATE.md` is the spec contract.
- `.claude/hld/` — the backend High-Level Design (Java 21 / Spring Boot microservices
  with an AI-first core: LangChain4j, pgvector RAG, MCP). `00-hld-overview.md`
  is the registry; `01-requirements.md` the BR/FR/NFR catalog. Load the `hld`
  skill before reading/writing anything here.
- `.claude/design/nocturne/` — the Nocturne design system (canonical CSS, written
  rules, component docs, original prototype). Reference only; the app consumes
  the port in `ascendra-frontend/src/styles/nocturne.css`.
- `ascendra-frontend/src/components/ui/` — Nocturne primitives (owned by the ds-engineer agent).
- `ascendra-frontend/src/features/<name>/` — one folder per screen.
- `ascendra-frontend/src/services/` (mock API + `fixtures.ts`), `ascendra-frontend/src/stores/` (auth/theme/prep/ui),
  `ascendra-frontend/src/types/index.ts`, `ascendra-frontend/src/routes.tsx`.

## Rules

- Styling: Nocturne tokens and primitives ONLY — load the `nocturne` skill
  before writing any component/styling code. No Tailwind, no CSS-in-JS, no new
  CSS files, no hard-coded colors. Inline `style` for layout only.
- Both themes (`data-theme` dark/light) must work for everything.
- Features are built spec-first. **To add a new feature or functionality, use
  the `add-feature` skill (`/add-feature <description>`)** — it runs the
  spec → design-delta → build (feature-builder agent) → verify (ui-verifier
  agent) → record pipeline.
- Verification is browser-driven: the `verify-ui` skill has launch info, demo
  credentials (any valid email + 8-char password), reset recipe, and the smoke
  checklist.
- Backend architecture changes go through the `update-hld` skill
  (`/update-hld <change>`) — catalog-first pipeline that keeps requirements,
  service docs, ADRs, and traceability in step. UI features with backend impact
  (from `/add-feature`) also trigger it.

## Project agents (`.claude/agents/`)

- `ds-engineer` — design-system CSS + `ascendra-frontend/src/components/ui/` primitives.
- `feature-builder` — builds one spec at a time; never touches ui/ or nocturne.css.
- `ui-verifier` — drives the app in the browser against acceptance checklists; code-read-only.
- `hld-architect` — software architect for `.claude/hld/`; designs docs-first, never writes application code.
