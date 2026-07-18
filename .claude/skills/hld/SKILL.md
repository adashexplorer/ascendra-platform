---
name: hld
description: Architecture conventions for the Ascendra backend HLD — document set, ID scheme, mermaid/C4 diagram rules, and the canonical tech stack. Load before reading, writing, or reviewing anything under .claude/hld/.
---

# Ascendra HLD conventions

The backend is designed documentation-first in `.claude/hld/`. The frontend specs in
`.claude/specs/` are the functional truth; the HLD translates them into a Java Spring
Boot microservices architecture with an AI-first core.

## Document set

| File | Holds |
| --- | --- |
| `.claude/hld/00-hld-overview.md` | C4 context + container diagrams, service map, interaction matrix, **HLD registry** (index of all docs + status) |
| `.claude/hld/01-requirements.md` | BR/FR/NFR catalog with IDs + traceability matrix (FR → frontend spec → owning services) |
| `.claude/hld/02-architecture-principles.md` | Principles + ADR log (inline ADRs, template-conformant) |
| `.claude/hld/10-…17-*.md` | One design doc per service (template: `_TEMPLATE-service.md`) |
| `.claude/hld/20-ai-layer.md` | LangChain4j architecture, RAG, MCP (server + client), prompt registry, guardrails, evals |
| `.claude/hld/21-data-architecture.md` | Schema-per-service map, pgvector layout, retention/PII |
| `.claude/hld/22-security.md` | AuthN/Z flows, service-to-service auth, secrets, AI threat model |
| `.claude/hld/23-observability.md` | Metrics/traces/logs incl. LLM-call tracing and cost telemetry |
| `.claude/hld/24-deployment.md` | Docker Compose dev topology → Kubernetes prod |
| `.claude/hld/25-api-contracts.md` | Endpoint outline per service (OpenAPI-level, not full schemas) |

Numbering: `0x` = foundations, `1x` = services, `2x` = cross-cutting. New
services take the next free `1x`; new cross-cutting docs the next free `2x`.

## ID scheme (stable — append-only, never renumber)

- `BR-n` business requirement · `FR-nn` functional · `NFR-nn` non-functional —
  all live ONLY in `01-requirements.md`; other docs reference the IDs.
- `SVC-<short>` service identifiers: SVC-GW, SVC-ID, SVC-PROF, SVC-ASSESS,
  SVC-ROAD, SVC-PROG, SVC-AI, SVC-NOTIF.
- `ADR-nnn` decisions, logged in `02-architecture-principles.md`; superseding
  ADRs mark the old one "Superseded by ADR-nnn".
- `EVT-<Name>` Kafka domain events, catalogued in the overview's interaction
  matrix (e.g. `EVT-ResumeParsed`, `EVT-SessionScored`).

## Diagrams

Mermaid only, in fenced ```mermaid blocks. C4 usage:
- Context + container views live in `00-hld-overview.md` (use `graph TB`/`flowchart`
  with subgraphs — portable mermaid, not the C4 plugin syntax).
- Each service doc: ≥1 diagram — a component view or the service's key sequence
  (`sequenceDiagram`) — plus its event in/out edges.
- Keep diagrams under ~25 nodes; split rather than crowd.

## Canonical tech stack (deviations need an ADR)

| Concern | Choice |
| --- | --- |
| Language / runtime | Java 21 LTS |
| Framework | Spring Boot 3.5.x, Spring Cloud Gateway (edge) |
| AuthN/Z | Spring Security OAuth2 Resource Server + Keycloak (OIDC) |
| Persistence | PostgreSQL 16, schema-per-service, Flyway migrations |
| Vector store | pgvector extension (same PostgreSQL), accessed via LangChain4j `PgVectorEmbeddingStore` |
| Messaging | Apache Kafka (domain events, `EVT-*`) |
| Cache | Redis |
| AI framework | LangChain4j 1.x — `langchain4j-anthropic` (default provider), `-open-ai`, `-ollama` (swap via config), `-pgvector`, `-mcp` |
| LLM strategy | Provider-agnostic ChatModel/StreamingChatModel; Claude default; structured outputs JSON-schema validated |
| API docs | springdoc-openapi per service |
| Observability | Micrometer + OpenTelemetry → Prometheus/Grafana/Tempo/Loki; LLM token + cost metrics first-class |
| Testing | JUnit 5, Testcontainers (Postgres/Kafka), prompt-eval harness for AI flows |
| Dev deploy | Docker Compose |
| Prod deploy | Kubernetes + Helm, HPA, NGINX ingress (SSE-aware) |
| CI/CD | GitHub Actions |

## When to cut an ADR

Cut one when a decision (a) crosses service boundaries, (b) changes the
canonical stack, (c) trades off an NFR, or (d) reverses an earlier ADR. Routine
template-following design does not need an ADR.

## Style

- Decisive: one recommended design; alternatives only in ADR "Options considered".
- Quantified NFRs (p95 ms, uptime %, tokens/session, RPO/RTO).
- Every backend capability traces to an FR; every FR traces to a frontend spec
  or a catalogued new business need. Update the traceability matrix with any change.
- To evolve the HLD (new functionality, tech swap, new service), use the
  `update-hld` skill — do not ad-hoc edit documents without running its workflow.
