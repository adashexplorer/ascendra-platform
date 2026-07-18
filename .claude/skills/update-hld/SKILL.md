---
name: update-hld
description: Dynamic workflow for evolving the Ascendra backend HLD when new functionality, requirement changes, or technology decisions arrive. Use whenever the user asks to add/change backend capability or architecture. Invocable as /update-hld <change description>.
---

# Update the Ascendra HLD

The pipeline for ANY change to the backend architecture: new functionality, a
changed requirement, a new service, or a technology swap. It keeps the HLD
internally consistent — catalog first, impact second, documents third, index
last. The hld-architect agent (`.claude/agents/hld-architect.md`) executes the
document work; load the `hld` skill for conventions.

## Step 1 — Classify the change

Determine which it is (drives the rest):
- **New functional capability** (e.g. "peer mock-interview matchmaking") → new FR(s).
- **NFR change** (e.g. "chat first-token < 500ms") → NFR update + affected services.
- **New/split/merged service** → new `1x` doc + ADR + overview rewiring.
- **Tech-stack change** (e.g. swap Kafka for RabbitMQ) → ADR superseding the canon + `hld` skill table update.
- **Frontend-driven**: if the change came from `/add-feature` (a UI feature with
  backend impact), read that feature's `.claude/specs/NN-*.md` first — it is the
  functional source.

## Step 2 — Catalog first (`.claude/hld/01-requirements.md`)

Allocate new `BR-/FR-/NFR-` IDs (append-only; never renumber) or mark changed
ones with a change note. Add traceability rows: FR → frontend spec (or "backend-
originated") → owning `SVC-*`. No document may reference an ID that isn't
catalogued — this step always happens before touching design docs.

## Step 3 — Impact analysis

Grep the `.claude/hld/` docs for affected services, events, and ADRs. Produce a short
impact list: which `1x` service docs change, whether `20-ai-layer.md` is
involved (any LLM/RAG/MCP touchpoint usually is), which `EVT-*` events are
added/changed, whether `21-data`/`22-security`/`24-deployment`/`25-api-contracts`
need deltas, and whether the change crosses an ADR threshold (see `hld` skill).
Present this to the user for approval if the blast radius is more than one
service doc.

## Step 4 — Apply via the hld-architect agent

Hand the approved delta to the **hld-architect** agent: it edits the affected
docs template-conformantly, adds the ADR if warranted, keeps diagrams in step
(update the mermaid, don't let prose and diagram diverge). For a brand-new
service: create its `1x` doc from `.claude/hld/_TEMPLATE-service.md`, wire it into the
overview container diagram and interaction matrix.

## Step 5 — Re-index and verify

1. Update the HLD registry table in `.claude/hld/00-hld-overview.md` (doc list + status).
2. Verify: every new ID resolves both directions (catalog ↔ docs); the
   traceability matrix covers the new FRs; the interaction matrix lists any new
   `EVT-*`.
3. Report to the user: IDs allocated, docs changed, ADRs cut, open questions.

## Worked example (dry-run — NOT committed scope)

`/update-hld add peer mock-interview matchmaking` would produce:
1. Classify: new functional capability, cross-service.
2. Catalog: `FR-13 "Match two candidates for a live peer mock interview"`
   (backend-originated; future UI spec), owning services SVC-ASSESS + SVC-NOTIF;
   possible `NFR` addition for matchmaking latency.
3. Impact: `13-assessment-service.md` (session type "peer"), `17-notification-service.md`
   (invites), new `EVT-PeerMatchProposed`/`EVT-PeerSessionScheduled`, `25-api-contracts.md`
   endpoints, `22-security.md` (user-to-user data exposure), overview matrix. No
   stack change → no ADR unless a realtime channel (WebRTC/WS) is introduced —
   that WOULD be an ADR.
4. Apply via hld-architect; 5. Re-index, verify IDs, report.
