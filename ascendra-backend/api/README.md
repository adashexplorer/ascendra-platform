# Ascendra API Contract

Executable, **contract-first** OpenAPI 3.0.3 description of the Ascendra backend
gateway surface. It is the single consolidated realization of
[`.claude/hld/25-api-contracts.md`](../../.claude/hld/25-api-contracts.md):
every row of that endpoint outline maps to exactly one OpenAPI operation, across
all services (SVC-ID, SVC-PROF, SVC-ASSESS, SVC-ROAD, SVC-PROG, SVC-AI, and the
future SVC-NOTIF preferences endpoints). No backend code exists yet — this
document is the surface, and a Prism mock derived from it lets the frontend and
other services integrate before the Java/Spring Boot services are written.

Response `example`s are drawn from the real UI fixtures
(`ascendra-frontend/src/services/fixtures.ts`), so a mock booted from this file
returns payloads that look like what the app renders (readiness 68, the five
competencies, the four roadmap phases, drill/mock/diagnostic/coding banks, the
trend series, and the session history).

## Why OpenAPI 3.0.3

3.0.3 is chosen for the broadest tooling compatibility (Prism, Redocly,
Swagger UI, generators). The **eventual source of truth is springdoc-openapi
generated per service from the running Java code** (see HLD doc 25); this
consolidated file fixes the surface and naming so the per-service specs cannot
drift apart before that code exists.

## Conventions modeled here

- Gateway prefixes are kept exactly: `/api/**` is the external gateway surface,
  `/internal/**` is service-to-service only, and `/mcp` is the MCP JSON-RPC
  endpoint.
- Errors are RFC 9457 `application/problem+json` (the `Problem` schema).
- Async work returns `202` with a status resource using the `parsing` /
  `scoring` vocabulary (ADR-005); clients poll the matching status endpoint.
- `429` responses carry a `Retry-After` header.
- `bearerAuth` (JWT) is the global default; `serviceAuth` (mTLS + propagated
  JWT, modeled as an API-key header) guards every `/internal/**` operation.

## Prerequisites

- Node.js 18+ (`npm install` pulls Prism, Redocly, and swagger-ui-dist).

## Commands

```bash
npm install          # install the tooling
npm run lint         # redocly lint openapi.yaml  (must be 0 errors)
npm run bundle       # redocly bundle -> dist/openapi.bundled.yaml
npm run mock         # prism mock on http://127.0.0.1:4010
npm run docs         # Swagger UI (Try-it-out) on http://127.0.0.1:8088
npm run docs:redoc   # Redoc read-only reference on http://127.0.0.1:8089 (alt)
```

`npm run docs` serves `swagger.html` (from the bundled `swagger-ui-dist`) via a
zero-dependency static server (`serve.mjs`). Open http://127.0.0.1:8088 with the
mock running: the **Servers** dropdown is preset to the Prism mock, **Authorize**
takes any bearer token, and **Try it out → Execute** calls the mock live (CORS is
open on Prism). Run `npm run mock` and `npm run docs` in two terminals.

> `node_modules/` and `dist/` are ignored by the repo-root `.gitignore`; no
> nested ignore file is needed here.

## Try the mock

Start it in one terminal:

```bash
npm run mock
```

Then, in another:

```bash
# Login (public endpoint) -> access/refresh tokens
curl -s -X POST http://127.0.0.1:4010/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"demo@ascendra.example","password":"demopass"}'

# Readiness snapshot (protected -> send any bearer token to the mock)
curl -s http://127.0.0.1:4010/api/progress/readiness \
  -H 'Authorization: Bearer mock-token'

# Full roadmap with phases, modules, and resource links
curl -s http://127.0.0.1:4010/api/roadmap \
  -H 'Authorization: Bearer mock-token'
```

Prism validates requests against the contract and returns the example payloads,
so these calls exercise the same shapes the UI consumes.
