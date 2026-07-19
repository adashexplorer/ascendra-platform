# HLD 01 — Requirements catalog

Status: **Active** · Owner: hld-architect · Sources: `.claude/specs/00-platform.md` … `.claude/specs/12-notes-todos.md`

The frontend specs are the functional truth. Today the UI fakes every capability
with a mock service layer (`ascendra-frontend/src/services/` fixtures + localStorage); this
catalog defines what a **real backend** must provide. All other HLD documents
(`00-hld-overview.md`, `02-architecture-principles.md`, service docs — all
forthcoming) reference requirements strictly by the IDs below. IDs are stable:
append-only, never renumbered.

Priorities use MoSCoW: **M**ust / **S**hould / **C**ould / **W**on't (now).

---

## 1. Business requirements

| ID | Business requirement | Rationale |
| --- | --- | --- |
| BR-1 | Accelerate a candidate's interview readiness from baseline to a target level measurably faster than self-directed prep. | Core value proposition; everything else serves this. |
| BR-2 | Every user gets a personalized prep plan derived from *their own* resume and diagnostic results — never a generic curriculum. | Differentiator vs. static question banks (specs 03, 05, 06). |
| BR-3 | The plan evolves continuously and append-only: new weaknesses surfaced by practice extend the plan, nothing is silently removed. | Trust in the plan; visible cause-and-effect (specs 06, 07). |
| BR-4 | Readiness is a quantified, trendable score the user can watch move — progress must be measurable, not felt. | Retention driver; readiness ring/trend are the product's heartbeat (specs 04, 09). |
| BR-5 | The experience is AI-guided end to end: parsing, scoring, feedback, adaptation, and a conversational guide that knows the user's plan. | "Ask Ascendra" and adaptive flows are the brand promise (specs 07, 08, 10). |
| BR-6 | The platform supports monetizable subscription tiers; entitlements gate capability (the UI already shows "Pro plan"). | Revenue model (spec 00 `User.plan`). |
| BR-7 | User data — resumes, answers, AI assessments — is handled with demonstrable privacy, isolation, and deletability. | Resumes are PII; trust is a market requirement, and B2C career data is sensitive. |
| BR-8 | Platform capabilities are reachable by external AI clients (MCP), extending Ascendra into the user's own AI tooling. | Ecosystem/distribution play; catalogued new business need (no frontend spec yet). |

---

## 2. Functional requirements

Statement form: "The system shall …". Source = frontend spec that demands it
(BR-n where the need is business-catalogued, not yet in a spec).

| ID | The system shall… | Source | Priority |
| --- | --- | --- | --- |
| FR-01 | authenticate users via OIDC — registration, login, token issuance/refresh, logout — and issue sessions consumable by the SPA and all services. | spec 02 | M |
| FR-02 | maintain a user profile (name, email, initials, target role) with plan/tier entitlements (e.g. "Pro plan") that services can query for gating. | specs 00, 02 | M |
| FR-03 | accept resume upload (PDF/DOCX, ≤ 10 MB), virus-scan it, and store it durably with per-user access control. | spec 03 | M |
| FR-04 | parse the stored resume and extract a structured skill inventory (skills, levels, evidence) using an LLM, persisting the result for downstream use. | specs 03, 05 | M |
| FR-05 | assemble a personalized 50-question diagnostic (area + level tagged) from the extracted skill inventory and the user's target role. | spec 03 | M |
| FR-06 | capture free-text diagnostic answers per question with save-and-exit and resume-at-position semantics across devices, and support re-running the diagnostic (reset). | spec 03 | M |
| FR-07 | score the completed diagnostic with an LLM to produce a baseline readiness score, per-competency levels, and matched-skill count. | specs 03, 04, 05 | M |
| FR-08 | compute the skill-gap report — competency level vs. role-target per competency, strengths, priority gaps, estimated time-to-target — from assessment results. | spec 05 | M |
| FR-09 | generate a phased roadmap (phases → weeks → modules, with done/active/next state) from the user's skill gaps. | spec 06 | M |
| FR-10 | evolve the roadmap append-only: when practice sessions surface new weaknesses, append gaps and phases via domain events; never mutate or delete prior phases; appends are idempotent per source session. | specs 06, 07 | M |
| FR-11 | select each day's 10 drill questions from the user's current weakest areas, weighted by gap severity and recent performance. | specs 04, 08 | M |
| FR-12 | score each drill answer with an LLM and return structured feedback (score /10, "Strong" and "Improve" commentary) that feeds back into readiness and future selection. | spec 08 | M |
| FR-13 | run adaptive mock interview sessions: question pool drawn from the user's gap areas, filterable by level, with AI follow-up questions adapted to the user's previous answers in the session. | spec 07 | M |
| FR-14 | score a finished mock session (overall /5), derive newly surfaced skill gaps, trigger roadmap phase append (FR-10) and a readiness delta — exactly once per session. | spec 07 | M |
| FR-15 | record every scored session (drills, mocks, coding tests, diagnostic) and serve readiness trend over time plus session history. | specs 04, 09 | M |
| FR-16 | provide the "Ask Ascendra" chat: LLM responses grounded via RAG in the *requesting user's own* plan, gaps, readiness, and session data, streamed token-by-token. | spec 10 | M |
| FR-17 | return actionable quick actions with chat responses (deep links such as start drill, view gaps, schedule mock) derived from the user's current state. | spec 10 | S |
| FR-18 | expose platform capabilities (readiness, gaps, roadmap, drill/mock initiation) as an authenticated MCP server so external AI clients can act on the user's behalf. | BR-8 | S |
| FR-19 | deliver the daily drill and session reminders via notification channels (e-mail/push) on a per-user morning schedule. | specs 04, 08 *(future-marked: UI copy only — "delivered every morning", "Mock loop · Friday 9:00")* | C |
| FR-20 | support account-level data export and hard deletion (resume, answers, embeddings, AI artifacts) across all services within the compliance window. | BR-7 | M |
| FR-21 | attach a curated learning resource (title + URL) drawn from an allowlisted resource catalog to every skill gap and roadmap module; gaps surfaced at runtime (mock/coding assessments) get a resource attached at creation — resources are selected from the catalog, never free-generated (ADR-011). | specs 05, 06 (v2) | S |
| FR-22 | run configurable mock coding tests — difficulty/count/area, defaulting random/5/mixed — drawn from a coding-question bank; score submitted solutions with an LLM; on completion add an area-scoped coding gap (with resource, FR-21), append a coding-reinforcement roadmap phase (FR-10), and apply a computed readiness delta (~+3 scale) — exactly once per area. | spec 07 (v2) | M |
| FR-23 | provide the coding playground via third-party embeds (OneCompiler iframe, CodeSandbox link-out), language + theme aware. **External embed — no domain service**: backend involvement is limited to allowlisting embed origins in the edge CSP (SVC-GW) and, Could, usage telemetry to SVC-PROG. | spec 11 | C |
| FR-24 | store per-user free-form notes (autosave, last-write-wins) and a TODO list (add/toggle/delete) server-side so they follow the user across devices, included in data export and erasure (FR-20). | spec 12 | S |

---

## 3. Non-functional requirements

Every target is testable; a target you can't measure is not a requirement.

| ID | Category | Requirement (quantified) | Applies to |
| --- | --- | --- | --- |
| NFR-01 | Latency — chat | Chat first token ≤ 1.5 s p95 from request receipt; sustained streaming ≥ 20 tokens/s median; full RAG retrieval ≤ 300 ms of that budget. | FR-16 |
| NFR-02 | Latency — sync APIs | Non-LLM synchronous API calls (profile, roadmap, trend, history, drill fetch, notes/todos writes) ≤ 300 ms p95, ≤ 800 ms p99 at the gateway. | FR-02…FR-11, FR-15, FR-24 |
| NFR-03 | Latency — AI scoring | Drill-answer feedback ≤ 5 s p95 (synchronous). Mock-session, coding-test, and diagnostic scoring ≤ 15 s p95 / ≤ 45 s p99, delivered asynchronously with a visible "scoring" state. | FR-07, FR-12, FR-14, FR-22 |
| NFR-04 | Availability | 99.5% monthly for core APIs (auth, profile, roadmap, progress). AI features may degrade (NFR-11) without counting against core availability. RPO ≤ 15 min, RTO ≤ 1 h. | all |
| NFR-05 | Scalability | All services stateless and horizontally scalable (K8s HPA); design point 10k DAU, burst 10× on AI endpoints via queueing rather than overprovisioning. | all |
| NFR-06 | Security & privacy | Resumes and answers encrypted at rest (AES-256) and in transit (TLS 1.3); RAG retrieval hard-filtered by `user_id` metadata — cross-user retrieval must be impossible by construction, verified by an automated isolation test in CI; GDPR-style erasure completed ≤ 30 days of request (FR-20). | FR-03, FR-16, FR-20 |
| NFR-07 | LLM cost | Budget ≤ 40k LLM tokens per active user per day across all features; prompt/system-prompt caching hit rate ≥ 30%; per-feature token metering enforced with soft limits per tier (BR-6). | FR-04…FR-17, FR-21, FR-22 |
| NFR-08 | LLM portability | LLM provider swappable (Anthropic ⇄ OpenAI ⇄ Ollama) via configuration only — zero application-code change; verified by running the prompt-eval suite against ≥ 2 providers in CI. | FR-04…FR-17, FR-21, FR-22 |
| NFR-09 | Observability | 100% of requests carry distributed traces (OpenTelemetry) with LLM calls as spans including model, token counts, and cost attributes; per-feature cost dashboards; alert when a user or feature exceeds 80% of its NFR-07 budget. | all |
| NFR-10 | AI auditability | Every AI-generated score/assessment persists: prompt-template version, model id, input digest, structured output, and model rationale — retained ≥ 12 months and retrievable per user for dispute/review. | FR-07, FR-12, FR-14, FR-22 |
| NFR-11 | Resilience — LLM outage | On LLM provider failure: chat returns an explicit degraded notice ≤ 2 s; drill/mock answer submission is accepted, queued, and scored on recovery (no data loss); question serving falls back to pre-generated pools; core navigation/read paths unaffected. Automatic failover to secondary provider ≤ 60 s where configured. | FR-05, FR-11…FR-16 |
| NFR-12 | Data integrity | Roadmap evolution and session scoring are exactly-once from the user's perspective: event consumers idempotent (dedupe on session id; coding effects additionally per user+area), verified by duplicate-delivery tests. | FR-10, FR-14, FR-22 |

---

## 4. Traceability matrix

Owning service = accountable for the capability's API/data; contributors
participate (sync call or `EVT-*` event). Service IDs per the hld skill.

| FR | Frontend spec(s) | Owning service | Contributing services |
| --- | --- | --- | --- |
| FR-01 | 02 | SVC-ID | SVC-GW |
| FR-02 | 00, 02 | SVC-PROF | SVC-ID, SVC-GW |
| FR-03 | 03 | SVC-PROF | SVC-GW |
| FR-04 | 03, 05 | SVC-PROF | SVC-AI (extraction), SVC-ASSESS (consumes `EVT-ResumeParsed`) |
| FR-05 | 03 | SVC-ASSESS | SVC-AI (question generation), SVC-PROF (skill inventory) |
| FR-06 | 03 | SVC-ASSESS | — |
| FR-07 | 03, 04, 05 | SVC-ASSESS | SVC-AI (scoring), SVC-PROG (baseline readiness via `EVT-SessionScored`) |
| FR-08 | 05 | SVC-ASSESS | SVC-PROF (role targets), SVC-ROAD (consumes gaps) |
| FR-09 | 06 | SVC-ROAD | SVC-AI (plan generation), SVC-ASSESS (gap input) |
| FR-10 | 06, 07 | SVC-ROAD | SVC-ASSESS (emits `EVT-SessionScored` / gap events) |
| FR-11 | 04, 08 | SVC-ASSESS | SVC-PROG (recent performance), SVC-ROAD (active phase focus) |
| FR-12 | 08 | SVC-ASSESS | SVC-AI (feedback), SVC-PROG (score recording) |
| FR-13 | 07 | SVC-ASSESS | SVC-AI (adaptive follow-ups) |
| FR-14 | 07 | SVC-ASSESS | SVC-AI (scoring), SVC-ROAD (phase append), SVC-PROG (readiness delta) |
| FR-15 | 04, 09 | SVC-PROG | SVC-ASSESS (event source) |
| FR-16 | 10 | SVC-AI | SVC-PROF, SVC-ROAD, SVC-PROG, SVC-ASSESS (RAG source data), SVC-GW (SSE passthrough) |
| FR-17 | 10 | SVC-AI | SVC-PROG, SVC-ROAD (state inputs) |
| FR-18 | — (BR-8) | SVC-AI | SVC-GW (auth), SVC-ASSESS, SVC-ROAD, SVC-PROG (backing capabilities) |
| FR-19 | 04, 08 (future) | SVC-NOTIF | SVC-ASSESS (drill ready events), SVC-PROF (channel prefs) |
| FR-20 | — (BR-7) | SVC-PROF | SVC-ID, SVC-ASSESS, SVC-ROAD, SVC-PROG, SVC-AI (embedding/audit purge), SVC-NOTIF |
| FR-21 | 05, 06 (v2) | SVC-ROAD | SVC-AI (curation — selection from catalog), SVC-ASSESS (attaches resource at gap surfacing) |
| FR-22 | 07 (v2) | SVC-ASSESS | SVC-AI (coding-solution scoring), SVC-ROAD (phase append), SVC-PROG (readiness delta) |
| FR-23 | 11 | SVC-GW (CSP/allowlist — external embed, no domain service) | SVC-PROG (usage telemetry, Could) |
| FR-24 | 12 | SVC-PROF | — |

Coverage check: every FR has exactly one owner; every frontend spec 02–12 is
referenced by ≥ 1 FR (spec 01 is design-system-only — no backend surface).

---

## 5. Notes & resolved ambiguities

- **Fixture numerology is illustrative, not contractual.** The UI's fixed values
  (readiness 68, +4 per mock, 14 matched skills, "7/10" drill scores) are demo
  fixtures; FR-07/FR-12/FR-14 require the backend to *compute* these, with the
  UI rendering whatever is returned.
- **Drill/question ownership**: question selection and answer capture sit with
  SVC-ASSESS (it owns all assessment artifacts); all LLM work is delegated to
  SVC-AI per the architecture stance. Gap/readiness derivations flow out as
  events, keeping SVC-ROAD and SVC-PROG decoupled.
- **Chat "knows your plan"** (spec 10 header copy) is formalized as per-user
  RAG (FR-16 + NFR-06 isolation), not fine-tuning.
- **"Record" button in mocks** (spec 07) is presentational in the UI; voice
  capture is out of scope — not catalogued. Add an FR if it becomes real.
- **Scheduling** ("Mock loop · Friday 9:00", "delivered every morning") is
  static copy today → catalogued once as FR-19, Could, owned by SVC-NOTIF.
- **NFR mapping for v2 FRs (no new NFRs).** FR-22 coding-solution scoring rides
  the existing NFR-03 async tier (session scoring ≤ 15 s p95 with a visible
  "scoring" state); FR-24 notes-autosave writes are plain sync writes under
  NFR-02 (≤ 300 ms p95) — autosave debouncing is a client concern, so no
  dedicated write-latency NFR (NFR-13 considered and not allocated). FR-22's
  exactly-once effects (gap + phase + readiness per area) fall under NFR-12.
- **Playground (FR-23) is frontend-consumed.** The embed runs entirely in the
  SPA against third-party origins; the backend's whole surface is the CSP
  allowlist at SVC-GW (ADR-011, T-10). The coding test's "Open playground"
  hand-off is a UI navigation, not an API.
- **Coding-test "solved" count and +3 readiness** are fixture numerology like
  the rest (see first note): FR-22 requires computed scores and a computed
  readiness delta, with the UI rendering returned values.
