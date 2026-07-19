# HLD 25 — API contracts (consolidated endpoint outline)

Status: **Active** · Owner: hld-architect · IDs per `01-requirements.md`

Outline level: method, path, purpose, authZ, owning FR. **springdoc-openapi,
generated per service from code, is the eventual source of truth for full
request/response schemas** — this document fixes the surface and naming so the
per-service specs can't drift apart, and is updated whenever a service doc
changes its API table.

Conventions:

- All external paths are behind SVC-GW under `/api/**` (MCP under `/mcp`);
  `/internal/**` paths are service-to-service only, never routed by the
  gateway.
- AuthZ "user (self)": valid JWT; resource scoped to `jwt.sub` — no user id in
  the path for self resources. "service": mTLS/client-credential +
  propagated user JWT (`22-security.md`).
- Async pattern: long-running work returns `202` with a status resource;
  states use `scoring`/`parsing` vocab (ADR-005).
- Errors: RFC 9457 problem+json; `429` carries `Retry-After`.

## SVC-ID — identity (`11-identity-service.md`)

| Method & path | Purpose | AuthZ | FR |
| --- | --- | --- | --- |
| POST `/api/auth/register` | Create account via Keycloak | public | FR-01 |
| POST `/api/auth/login` | Credentials → access/refresh tokens | public | FR-01 |
| POST `/api/auth/refresh` | Refresh access token | refresh token | FR-01 |
| POST `/api/auth/logout` | Revoke session | user (self) | FR-01 |
| GET `/api/auth/me` | userId, email, tier | user (self) | FR-01, FR-02 |
| GET `/internal/entitlements/{userId}` | Tier + limits for gating/budgets | service | FR-02, NFR-07 |
| PUT `/internal/entitlements/{userId}` | Set tier | admin/service | FR-02 |

## SVC-PROF — profile (`12-profile-service.md`)

| Method & path | Purpose | AuthZ | FR |
| --- | --- | --- | --- |
| GET `/api/profile` | Profile incl. plan display | user (self) | FR-02 |
| PUT `/api/profile` | Update name / target role | user (self) | FR-02 |
| POST `/api/resume` | Upload PDF/DOCX ≤ 10 MB → 202 `parsing` | user (self) | FR-03, FR-04 |
| GET `/api/resume/status` | scanning/parsing/parsed/failed | user (self) | FR-03, FR-04 |
| GET `/api/profile/skills` | Extracted skill inventory | user (self) | FR-04 |
| GET `/api/notes` | Notes text + updated_at | user (self) | FR-24 |
| PUT `/api/notes` | Autosave notes (replace, last-write-wins) | user (self) | FR-24 |
| GET `/api/todos` | TODO list | user (self) | FR-24 |
| POST `/api/todos` | Add TODO | user (self) | FR-24 |
| PATCH `/api/todos/{id}` | Toggle done | user (self) | FR-24 |
| DELETE `/api/todos/{id}` | Remove TODO | user (self) | FR-24 |
| POST `/api/privacy/export` | Async data export (incl. notes/todos) | user (self) | FR-20, FR-24 |
| POST `/api/privacy/erase` | Start erasure saga → 202 | user (self) | FR-20 |
| GET `/api/privacy/erase/{erasureId}` | Saga progress | user (self) | FR-20 |
| GET `/internal/profiles/{userId}/skills` | Inventory + target role | service | FR-05, FR-16 |

## SVC-ASSESS — assessment (`13-assessment-service.md`)

| Method & path | Purpose | AuthZ | FR |
| --- | --- | --- | --- |
| POST `/api/assessments/diagnostic` | Create/return diagnostic session (50 q) | user (self) | FR-05 |
| GET `/api/assessments/diagnostic/current` | Session + resume position | user (self) | FR-06 |
| PUT `/api/assessments/diagnostic/answers/{qIdx}` | Save free-text answer | user (self) | FR-06 |
| POST `/api/assessments/diagnostic/submit` | Finish → 202 `scoring` | user (self) | FR-07 |
| POST `/api/assessments/diagnostic/reset` | Re-run diagnostic | user (self) | FR-06 |
| GET `/api/assessments/gaps` | Skill-gap report | user (self) | FR-08 |
| GET `/api/drills/today` | Today's 10 questions + position | user (self) | FR-11 |
| POST `/api/drills/answers` | Submit → sync feedback ≤ 5 s (or 202 fallback) | user (self) | FR-12 |
| POST `/api/mocks` | Start mock session (level filter) | user (self) | FR-13 |
| POST `/api/mocks/{id}/answers` | Answer → adapted follow-up | user (self) | FR-13 |
| POST `/api/mocks/{id}/finish` | End → 202 `scoring` | user (self) | FR-14 |
| GET `/api/mocks/{id}` | Session + score when `scored` | user (self) | FR-14 |
| POST `/api/coding-tests` | Start coding test (config: difficulty/count/area, defaults random/5/mixed) | user (self) | FR-22 |
| POST `/api/coding-tests/{id}/solutions` | Submit solution → next question | user (self) | FR-22 |
| POST `/api/coding-tests/{id}/finish` | End → 202 `scoring` | user (self) | FR-22 |
| POST `/api/coding-tests/{id}/abandon` | Abandon (no scoring) | user (self) | FR-22 |
| GET `/api/coding-tests/{id}` | Status/result (solved/total, weak area, gap + resource) | user (self) | FR-22, FR-21 |
| GET `/internal/sessions/{userId}/recent` | Recent summaries for RAG | service | FR-16 |

## SVC-ROAD — roadmap (`14-roadmap-service.md`)

| Method & path | Purpose | AuthZ | FR |
| --- | --- | --- | --- |
| GET `/api/roadmap` | Phases/weeks/modules + state + provenance | user (self) | FR-09, FR-10 |
| POST `/api/roadmap/generate` | Initial generation (idempotent) | user (self) | FR-09 |
| PUT `/api/roadmap/modules/{id}/state` | Mark module done | user (self) | FR-09 |
| GET `/api/roadmap/gaps` | Gap store with provenance + resource links | user (self) | FR-08, FR-10, FR-21 |
| GET `/api/resources` | Allowlisted resource catalog read | user (self) | FR-21 |
| PUT `/api/admin/resources/{id}` | Catalog upsert/deactivate (allowlist-checked) — *Could* | admin | FR-21 |
| GET `/internal/resources` | Catalog candidates for ResourceCurator | service | FR-21 |
| GET `/internal/roadmap/{userId}/active-phase` | Focus for drill selection | service | FR-11 |
| GET `/internal/roadmap/{userId}/summary` | Summary for RAG/quick actions | service | FR-16, FR-17 |

## SVC-PROG — progress (`15-progress-service.md`)

| Method & path | Purpose | AuthZ | FR |
| --- | --- | --- | --- |
| GET `/api/progress/readiness` | Readiness, target, delta | user (self) | FR-15 |
| GET `/api/progress/trend` | Trend points | user (self) | FR-15 |
| GET `/api/progress/history` | Session history rows | user (self) | FR-15 |
| GET `/internal/progress/{userId}/recent-performance` | Per-area scores for drill weighting | service | FR-11 |
| GET `/internal/progress/{userId}/summary` | Readiness summary for RAG | service | FR-16, FR-17 |

## SVC-AI — ai-orchestrator (`16-ai-orchestrator-service.md`)

| Method & path | Purpose | AuthZ | FR |
| --- | --- | --- | --- |
| POST `/api/chat/messages` | Chat turn → SSE stream + quick actions | user (self) | FR-16, FR-17 |
| GET `/api/chat/history` | Recent transcript | user (self) | FR-16 |
| `/mcp/*` | MCP server: tools readiness, gaps, roadmap, start-drill, schedule-mock | user token (external client) | FR-18 |
| POST `/internal/generate/questions` | Diagnostic question set | service (SVC-ASSESS) | FR-05 |
| POST `/internal/generate/followup` | Adaptive mock follow-up | service (SVC-ASSESS) | FR-13 |
| POST `/internal/score/drill` | Sync drill scoring ≤ 5 s | service (SVC-ASSESS) | FR-12 |
| POST `/internal/generate/phase` | Phase content from gaps (modules cite catalog resource ids) | service (SVC-ROAD) | FR-09, FR-10, FR-21 |
| POST `/internal/curate/resource` | Pick catalog resource for a gap/area (closed-world, ADR-011) | service (SVC-ASSESS, SVC-ROAD) | FR-21 |
| GET `/internal/audit/{auditRef}` | AI audit record (NFR-10) | service/admin | NFR-10 |

Heavy AI jobs (resume extraction, diagnostic/mock/coding scoring) are **not**
REST — they ride `EVT-AITaskRequested`/`EVT-AITaskCompleted`
(`00-hld-overview.md` §6).

## SVC-NOTIF — notification (`17-notification-service.md`) — future

| Method & path | Purpose | AuthZ | FR |
| --- | --- | --- | --- |
| GET `/api/notifications/preferences` *(future)* | Channel + schedule prefs | user (self) | FR-19 |
| PUT `/api/notifications/preferences` *(future)* | Update prefs | user (self) | FR-19 |

## SVC-GW — gateway (`10-api-gateway.md`)

No business endpoints; routing table in `10-api-gateway.md`. SSE routes
(`/api/chat/**`) proxied unbuffered; MCP (`/mcp/**`) rate-limited in its own
bucket (ADR-007). FR-23 (playground) has **no API** — its backend surface is
the edge CSP `frame-src`/`connect-src` allowlist for the embed origins
(`10-api-gateway.md`, ADR-011).

## Coverage check

Every FR-01…FR-18, FR-20…FR-22, FR-24 has ≥ 1 endpoint or event path above;
FR-19 is future-marked; FR-23 is edge-config-only (no endpoint by design).
Full schemas: springdoc-openapi per service, published in CI.
