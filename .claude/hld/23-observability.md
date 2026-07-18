# HLD 23 — Observability

Status: **Active** · Owner: hld-architect
Requirements served: NFR-01…NFR-05, NFR-07, NFR-09, NFR-11

Stack (canonical, hld skill): **Micrometer + OpenTelemetry SDK** in every
service → OTel Collector → **Prometheus** (metrics), **Tempo** (traces),
**Loki** (logs), **Grafana** (dashboards + alerting). LLM token/cost telemetry
is first-class, not an afterthought.

---

## 1. Three pillars mapping

| Pillar | Instrumentation | Backend | Notes |
| --- | --- | --- | --- |
| Metrics | Micrometer → OTel/Prometheus registry; RED per endpoint, JVM, Kafka lag, plus custom `ascendra_llm_*` and `ascendra_budget_*` | Prometheus (30 d), long-term via remote-write | exemplars link metrics → traces |
| Traces | OTel auto-instrumentation (Spring WebFlux/MVC, JDBC, Redis, Kafka clients) + manual spans for LLM calls and RAG stages | Tempo (14 d) | 100% of requests traced (NFR-09); tail-sampling only if volume forces it — errors and LLM spans always kept |
| Logs | structured JSON (logback + OTel appender), trace-correlated | Loki (30 d, `21-data-architecture.md` §5) | content rules §5 |

## 2. Trace propagation — REQUIRED end-to-end (NFR-09)

W3C `traceparent` everywhere; a user action must be one trace across sync,
async, and LLM hops:

| Hop | Mechanism |
| --- | --- |
| SPA → SVC-GW → services | HTTP header propagation (auto) |
| **Through Kafka** | trace context injected into record **headers** by producers; consumers continue the trace as span links (e.g. EVT-SessionScored → SVC-ROAD append span links to the mock-session trace). Consumer span kind `CONSUMER`, `messaging.*` semconv attributes |
| **Into LLM calls** | SVC-AI wraps every provider call in a `CLIENT` span (LangChain4j listener/decorator) with the attributes below |
| SSE streaming | root span stays open per turn; child events for first-token and completion (drives NFR-01 measurement) |

**Mandatory LLM span attributes** (gen-ai semconv + Ascendra extensions):

| Attribute | Example |
| --- | --- |
| `gen_ai.system` / `gen_ai.request.model` | `anthropic` / `claude-sonnet-4-5` |
| `ascendra.prompt.id` / `ascendra.prompt.version` | `answer-scorer` / `2.3.0` (matches audit record, NFR-10) |
| `gen_ai.usage.input_tokens` / `output_tokens` | 1840 / 312 |
| `ascendra.llm.cost_usd` | 0.0121 (computed from provider price table config) |
| `ascendra.llm.cache_hit` / `cached_input_tokens` | true / 1500 (prompt-cache reads, NFR-07 ≥ 30%) |
| `ascendra.llm.use_case` / `ascendra.user.tier` | `chat` / `pro` |
| `ascendra.llm.first_token_ms` / retries / schema_repairs | 640 / 0 / 1 |

Metrics mirror these as counters/histograms: `ascendra_llm_tokens_total{use_case,model,direction}`,
`ascendra_llm_cost_usd_total{use_case,model,tier}`, `ascendra_llm_cache_hit_ratio`,
`ascendra_llm_first_token_seconds`, `ascendra_budget_consumed_ratio{tier}`.

## 3. Dashboards

| Dashboard | Panels |
| --- | --- |
| LLM cost | $/day by use_case, model, provider, tier; $/active user; cache-hit ratio; cost per prompt **version** (regression spotting after prompt bumps) |
| Token budgets (NFR-07) | budget-consumed distribution; users > 80%; feature share of the 40k/day budget; queued-due-to-budget depth |
| AI quality/ops | schema-repair rate, guardrail trips, failover state, eval pass-rate (CI-pushed), scoring queue depth + age |
| Core SLOs | per-SLO burn rate, latency heatmaps, availability |
| Kafka | consumer lag per group (scoring, ingestion, erasure saga), duplicate-drop counts (NFR-12) |

## 4. SLOs & alerting (derived from the NFR catalog)

Multi-window **burn-rate alerting** (fast: 5 m/1 h page · slow: 6 h/3 d ticket).

| SLO | SLI | Target | Source NFR |
| --- | --- | --- | --- |
| Core API availability | non-5xx rate at SVC-GW, core routes (auth/profile/roadmap/progress) | 99.5% monthly | NFR-04 |
| Core API latency | gateway p95 ≤ 300 ms / p99 ≤ 800 ms | 99% of 5-min windows compliant | NFR-02 |
| Chat first token | `ascendra_llm_first_token_seconds` p95 ≤ 1.5 s; RAG stage span ≤ 300 ms | 95% of windows | NFR-01 |
| Chat stream rate | median ≥ 20 tokens/s per turn | 95% of turns | NFR-01 |
| Drill feedback | submit→feedback p95 ≤ 5 s | 95% of windows | NFR-03 |
| Async scoring | mock/diagnostic p95 ≤ 15 s, p99 ≤ 45 s (queue age included) | 95% of windows | NFR-03 |
| Degraded-notice speed | LLM-down chat responses ≤ 2 s | 100% while degraded | NFR-11 |
| Failover time | circuit-open → fallback serving ≤ 60 s | per incident | NFR-11 |
| Erasure saga | completion ≤ 30 d; **page at 25 d** unacked | 100% | NFR-06 |

Threshold alerts (non-burn-rate): user/feature at **80% of token budget**
(NFR-09 — explicit requirement); daily platform LLM spend > forecast × 1.5
(also T-7 compromise signal, `22-security.md`); cache-hit < 30% for 24 h
(NFR-07); Kafka consumer lag age > 60 s on scoring topics; schema-repair rate
> 5%; eval pass-rate drop on deploy.

## 5. Structured log fields standard

Every log line is JSON with, minimum:

| Field | Notes |
| --- | --- |
| `timestamp`, `level`, `service`, `env`, `version` | `service` = SVC-* id; `version` = image tag |
| `trace_id`, `span_id` | Loki ↔ Tempo correlation |
| `user_id` | id only — **never** email/name |
| `event_id`, `event_type` | when handling EVT-*; enables saga forensics |
| `use_case`, `prompt_id`, `prompt_version`, `model` | LLM-adjacent logs |
| `error.kind`, `error.msg` | no stack traces at INFO |

Content rules (NFR-06, `22-security.md` T-6): **never log** prompt text, answer
text, resume content, retrieved chunks, LLM completions, or tokens/credentials.
Log input **digests** and ids; full payloads live only in the NFR-10 audit
store with its own access control.

---

## Open questions

1. OTel Collector tail-sampling policy once traffic exceeds Tempo's comfortable
   100%-retention volume — proposal: always-keep errors + LLM spans, sample
   healthy core reads at 25%.
2. Cost price-table maintenance: config-managed per model/provider — who owns
   updates when providers reprice? Suggest LLM-ops rotation + CI check that
   every configured model id has a price entry.
3. Push CI eval-harness results (`20-ai-layer.md` §6.6) to Prometheus via
   pushgateway vs. Grafana annotations only.
