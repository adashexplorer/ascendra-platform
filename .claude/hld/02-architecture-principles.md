# HLD 02 — Architecture principles & ADR log

Status: **Active** · Owner: hld-architect · References resolve to `01-requirements.md` and `00-hld-overview.md`.

## Principles

1. **Docs-first, catalog-first.** Every backend capability starts as a
   catalogued requirement (`01-requirements.md`), then a design doc, then code.
   No service doc invents an uncatalogued requirement; every FR/NFR reference
   is an ID that resolves. Evolution runs through the `update-hld` workflow.
2. **DB-per-service.** Each service owns exactly one PostgreSQL schema; no
   cross-schema queries, ever. Other services get data via REST or `EVT-*`
   events; controlled duplication (e.g. SVC-PROG's projections) is preferred
   over shared tables. (ADR-001)
3. **All LLM interaction lives in SVC-AI.** No other service holds a model
   key, a prompt, or an embedding. Domain services own *what* to ask and *what
   to persist*; SVC-AI owns *how* to ask. (ADR-002)
4. **Event-driven, append-only evolution.** State that represents the user's
   journey (gaps, roadmap phases, readiness history) grows by appending facts
   carried on Kafka events — never by mutating or deleting prior facts
   (BR-3, FR-10). Consumers are idempotent by `eventId`/`sourceId` (NFR-12).
5. **Provider-agnostic AI.** LLM and embedding providers are configuration,
   not code (NFR-08). Structured outputs are JSON-schema validated at the
   SVC-AI boundary so a provider swap cannot change contracts. (ADR-004)
6. **Per-user isolation by construction.** A user's resume, answers, and
   embeddings are reachable only under that user's identity; RAG retrieval is
   hard-filtered on `user_id` and CI proves it (NFR-06). (ADR-006)
7. **Quantified NFRs or it didn't happen.** Every latency, cost, and
   resilience claim maps to a measurable NFR target with a named verification
   (perf test, CI isolation test, prompt-eval suite, chaos drill).
8. **Degrade AI, never the core.** LLM-provider failure degrades AI features
   explicitly (notice, queueing, fallback pools — NFR-11) while auth, profile,
   roadmap, and progress reads stay within NFR-04 availability.

---

## ADR log

### ADR-001 — Microservices over modular monolith

- **Status**: Accepted
- **Date**: 2026-07-18
- **Drivers**: BR-6, BR-8, NFR-04, NFR-05, NFR-11; heterogeneous scaling (AI vs CRUD); team-size trade-off

#### Decision

Build eight Spring Boot microservices (SVC-GW…SVC-NOTIF) with DB-per-service,
accepting the operational overhead consciously.

#### Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| Microservices (chosen) | Independent scaling of AI hot path (NFR-05 10× burst); failure isolation for NFR-11; clean event-driven seams for FR-10/FR-15 | Honest cost: for a small team this is more repos, deploys, and distributed-systems debugging than a monolith — mitigated by uniform Spring templates, Compose dev topology, and docs-first contracts |
| Modular monolith | One deploy, simple transactions, faster for 1–3 devs | AI workload scaling drags the whole app; module boundaries erode without hard DB separation; MCP/AI burst couples to core availability |
| Monolith + separate AI service | Cheap middle ground | Roadmap/progress event evolution still tangled; ends up re-splitting later at higher cost |

#### Consequences

Every service needs the template rigor of `_TEMPLATE-service.md`; Kafka and
tracing become mandatory day-one infrastructure (`23-observability.md`,
`24-deployment.md`). If the team stays ≤ 2 engineers past MVP, revisit by
superseding this ADR before adding a ninth service.

### ADR-002 — Concentrate all LLM interaction in SVC-AI

- **Status**: Accepted
- **Date**: 2026-07-18
- **Drivers**: NFR-07 (single token-budget enforcement point), NFR-08, NFR-09, NFR-10; BR-5

#### Decision

Concentrate every LLM call — extraction, generation, scoring, chat, embeddings,
MCP tool execution — in SVC-AI; domain services call it via REST (interactive)
or the `EVT-AITaskRequested/Completed` pair (durable jobs).

#### Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| Single AI service (chosen) | One place for keys, budgets (NFR-07), provider swap (NFR-08), audit (NFR-10), cost telemetry (NFR-09); prompt registry stays coherent | SVC-AI is a critical dependency and potential bottleneck — mitigated by ADR-005 async split + NFR-11 queueing |
| LangChain4j embedded per service | No extra hop; teams autonomous | Keys/prompts/budgets scattered across 5 services; NFR-07/08/10 become unenforceable in practice |
| Shared LLM library, per-service calls | Some reuse | Same governance scatter; library version drift across services |

#### Consequences

`16-ai-orchestrator-service.md` outlines the surface; deep internals live in
`20-ai-layer.md`. Domain services must design for asynchronous AI results
(pending states in SVC-ASSESS, SVC-PROF).

### ADR-003 — pgvector on PostgreSQL over a dedicated vector DB

- **Status**: Accepted
- **Date**: 2026-07-18
- **Drivers**: NFR-01 (retrieval ≤ 300 ms), NFR-06 (isolation), operational footprint at 10k DAU (NFR-05)

#### Decision

Use the pgvector extension inside the existing PostgreSQL 16 cluster (SVC-AI
schema) via LangChain4j `PgVectorEmbeddingStore`; no separate vector database.

#### Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| pgvector (chosen) | One datastore to operate/back up (RPO ≤ 15 min applies uniformly); SQL `WHERE user_id = ?` metadata filter is native and testable (NFR-06); ample at 10k DAU scale | Lower QPS ceiling than specialist engines; index tuning (HNSW) is on us |
| Dedicated vector DB (Qdrant/Weaviate) | Higher raw ANN throughput, richer filtering | New stateful system to run, secure, and back up; isolation guarantees re-proved in a second technology |
| Managed vector SaaS (Pinecone) | Zero ops | Resume-derived PII leaves our boundary (BR-7 risk); per-query cost; NFR-06 CI isolation test harder |

#### Consequences

Per-user corpus stays small (one user's plan/sessions), so HNSW-with-filter
comfortably meets the 300 ms retrieval budget. If retrieval p95 breaches
NFR-01 at scale, supersede with a dedicated store. Layout in
`21-data-architecture.md`.

### ADR-004 — Provider-agnostic LangChain4j with Claude default

- **Status**: Accepted
- **Date**: 2026-07-18
- **Drivers**: NFR-08 (config-only swap), NFR-11 (failover ≤ 60 s), NFR-07 (cost levers)

#### Decision

Code exclusively against LangChain4j `ChatModel`/`StreamingChatModel`/
`EmbeddingModel` abstractions; wire `langchain4j-anthropic` as default and
`-open-ai`/`-ollama` as config-selectable alternates and failover targets.

#### Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| LangChain4j abstraction, Claude default (chosen) | NFR-08 met by construction; prompt-eval suite runs per provider in CI; Ollama gives an offline dev/test path | Least-common-denominator API; provider-specific features (caching modes) need adapter care to hit NFR-07 caching ≥ 30% |
| Direct Anthropic SDK | Full native features | NFR-08 fails: swap = code change; failover bespoke |
| Own abstraction layer | Tailored | Reinvents LangChain4j with fewer eyes on it |

#### Consequences

Prompts must stay provider-neutral (no vendor-specific control tokens);
structured outputs validated against JSON schema regardless of provider.
Failover policy and eval harness detailed in `20-ai-layer.md`.

### ADR-005 — Sync vs async AI scoring split

- **Status**: Accepted
- **Date**: 2026-07-18
- **Drivers**: NFR-03 (drill ≤ 5 s sync; diagnostic/mock ≤ 15 s p95 async), NFR-11 (queue on outage), FR-07, FR-12, FR-14

#### Decision

Score drill answers synchronously (REST SVC-ASSESS → SVC-AI, ≤ 5 s p95, user
waits for feedback); score diagnostics and mock sessions asynchronously via
`EVT-AITaskRequested`/`EVT-AITaskCompleted` with a user-visible "scoring"
session state.

#### Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| Split sync/async (chosen) | Matches UX: drill feedback is the interaction, session scores are results pages; Kafka job queue absorbs 10× bursts (NFR-05) and LLM outages (NFR-11) without loss | Two integration patterns to maintain; SVC-ASSESS needs a `scoring` state machine |
| All synchronous | Simplest flow | 50-answer diagnostic scoring can't meet an interactive latency; outage = user-facing failure, violating NFR-11 |
| All asynchronous | One pattern | Drill feedback loses immediacy — the core daily-practice loop (FR-12) degrades to polling |

#### Consequences

Drill sync path gets a fallback: on SVC-AI timeout/outage the answer is
accepted and re-queued as `taskType=drill-scoring-fallback` (NFR-11 "no data
loss"). SSE/polling for score readiness defined in `13-assessment-service.md`
and `25-api-contracts.md`.

### ADR-006 — Per-user RAG isolation via mandatory metadata filter + defense in depth

- **Status**: Accepted
- **Date**: 2026-07-18
- **Drivers**: NFR-06 (cross-user retrieval impossible by construction), BR-7, FR-16

#### Decision

Every embedding row carries a `user_id` metadata column; the retrieval API in
SVC-AI takes the user identity from the *verified JWT only* (never from
request body) and appends a non-optional `user_id` filter at the lowest data
access layer. Defense in depth: JWT-derived identity → mandatory filter →
per-user logical partitioning in the pgvector table → CI isolation test that
plants cross-user decoys and asserts zero leakage.

#### Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| Mandatory metadata filter + layered checks (chosen) | Testable by construction; single store keeps ops simple (ADR-003) | Filter bug is catastrophic — hence the layered checks and CI gate |
| Physical store/schema per user | Strongest isolation | Thousands of schemas/collections is operationally absurd at 10k DAU |
| App-level post-filtering of results | Easy to add | Retrieval already saw other users' vectors; fails "impossible by construction" |

#### Consequences

The isolation test is a CI merge gate (NFR-06). MCP-served retrieval (FR-18)
flows through the same code path, so external clients inherit the guarantee.
Details in `20-ai-layer.md` and `22-security.md`.

### ADR-007 — MCP server placement inside SVC-AI

- **Status**: Accepted
- **Date**: 2026-07-18
- **Drivers**: FR-18, BR-8, NFR-06, NFR-07

#### Decision

Host the platform's MCP server inside SVC-AI (routed via SVC-GW), exposing
tools (readiness, gaps, roadmap, start-drill, schedule-mock) that call the
same internal service APIs the chat agent uses.

#### Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| Inside SVC-AI (chosen) | Reuses the chat agent's tool layer, authZ context, token budgeting (NFR-07) and isolation path (ADR-006); MCP client (`langchain4j-mcp`) already lives here | Couples MCP availability to SVC-AI; tool traffic competes with chat — mitigated by separate rate buckets at SVC-GW |
| Dedicated MCP gateway service | Independent scaling | Ninth service duplicating SVC-AI's tool/authZ layer; two budget-enforcement points |
| MCP endpoints per domain service | No middleman | Fragmented auth surface; external clients see internal topology; NFR-06/07 enforcement scattered |

#### Consequences

MCP tool schemas versioned with the prompt registry (`20-ai-layer.md`).
SVC-GW adds an MCP route + dedicated rate limits (`10-api-gateway.md`).

### ADR-008 — GDPR erasure via saga with tombstone events

- **Status**: Accepted
- **Date**: 2026-07-18
- **Drivers**: FR-20, BR-7, NFR-06 (erasure ≤ 30 days), DB-per-service (no cross-service transaction)

#### Decision

Implement account erasure as a choreographed saga: SVC-PROF (coordinator)
persists an erasure request, publishes the `EVT-UserErased` tombstone, each
service purges its schema (and SVC-AI its embeddings + audit artifacts) and
replies `EVT-UserErasureAcked`; SVC-PROF tracks acks, retries laggards, and
closes the saga — alerting at 80% of the 30-day window.

#### Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| Kafka saga + tombstones (chosen) | Works with DB-per-service; auditable per-service acks; retryable; new services join by consuming one topic | Eventually consistent — user sees "deletion in progress"; needs saga-state tracking in SVC-PROF |
| Synchronous fan-out delete API | Immediate | Partial-failure hell; coordinator must know every service's internals; blocks on any downed service |
| Central shared-DB purge job | One script | Violates DB-per-service; object storage + Kafka retention still need per-owner handling anyway |

#### Consequences

Kafka topics use compaction/short retention so event history honors erasure
(retention policy in `21-data-architecture.md`). Every future service MUST
implement the erasure consumer before going live — added to the service
template's definition of done.

### ADR-009 — Kafka over RabbitMQ

- **Status**: Accepted
- **Date**: 2026-07-18
- **Drivers**: FR-10 (append-only evolution), FR-15 (projections), NFR-05 (10× AI burst via queueing), NFR-12

#### Decision

Use Apache Kafka for all domain events and durable AI job queues.

#### Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| Kafka (chosen) | Replayable log fits event-sourced projections (SVC-PROG) and append-only roadmap evolution; per-key ordering by `userId`; consumer groups absorb bursts; Testcontainers support | Heavier to operate than a broker; retention vs GDPR needs explicit policy (ADR-008) |
| RabbitMQ | Simpler ops, fine for work queues | No replay — rebuilding SVC-PROG projections or late-joining consumers requires bespoke storage; ordering guarantees weaker |
| PostgreSQL outbox-only (no broker) | Minimal infra | Polling latency and fan-out complexity grow with consumers; no shared replayable history |

#### Consequences

Producers use the transactional outbox pattern for exactly-once-effect
publishing (NFR-12); topic conventions in `00-hld-overview.md` §6, retention
in `21-data-architecture.md`.

### ADR-010 — Token budgeting enforced in SVC-AI, tied to entitlements

- **Status**: Accepted
- **Date**: 2026-07-18
- **Drivers**: NFR-07 (≤ 40k tokens/user/day, per-tier soft limits), BR-6, NFR-09 (80% alerts)

#### Decision

Enforce per-user, per-feature token budgets inside SVC-AI: every LLM call
passes through a budget interceptor that meters tokens against Redis counters
(daily windows), reads tier limits from SVC-ID entitlements (cached), applies
soft-limit degradation (smaller models / truncated context / queued instead of
sync) and hard caps for abuse.

#### Options considered

| Option | Pros | Cons |
| --- | --- | --- |
| SVC-AI interceptor + entitlement-driven limits (chosen) | Single choke point (ADR-002) sees actual token usage incl. retries/failover; tier logic reuses SVC-ID data (BR-6); emits NFR-09 metrics natively | Redis becomes availability-relevant for AI paths — fail-open with async reconciliation on Redis outage |
| Gateway rate limiting only | Simple | Requests ≠ tokens; a single long chat can blow the budget while under request limits |
| Post-hoc billing-style metering | No latency impact | Cannot *enforce* NFR-07; overrun discovered after spend |

#### Consequences

Budget dimensions (feature, tier, model) are first-class metric labels
(`23-observability.md`). Entitlement schema addition in
`11-identity-service.md`; degradation ladder detailed in `20-ai-layer.md`.
