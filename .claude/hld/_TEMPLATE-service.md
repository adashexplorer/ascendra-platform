# SVC-<ID> — <service-name>

> Copy to `.claude/hld/1x-<service-name>.md`. Every section is required; write "None"
> explicitly rather than omitting. All BR/FR/NFR/ADR/EVT references use catalog
> IDs from `01-requirements.md` / `02-architecture-principles.md`.

## Responsibility

One paragraph: the single business capability this service owns, and the one or
two things it deliberately does NOT do (pushed to which service instead).

## Requirements served

| ID | Requirement (short) | Role of this service |
| --- | --- | --- |
| FR-nn | … | owner / contributor |

## API surface

Synchronous endpoints (outline level — full schemas live in `25-api-contracts.md`):

| Method & path | Purpose | AuthZ |
| --- | --- | --- |

## Events

| Direction | Event | Trigger / consumer behavior |
| --- | --- | --- |
| publishes | EVT-… | … |
| consumes | EVT-… | … |

## Data model

Owned PostgreSQL schema: `<schema_name>`. Key aggregates/tables (names + the
3–6 columns that matter, not full DDL). Note anything replicated from other
services (and why duplication is acceptable) and any pgvector usage.

## Key flows

At least one mermaid diagram: the service's most important sequence
(`sequenceDiagram`) or a component view. Prose walks the same flow — diagram
and prose must not diverge.

## Scaling & failure modes

- Statefulness, horizontal scaling unit, expected load shape.
- What happens when a dependency (DB, Kafka, SVC-AI, LLM provider) is down —
  degrade, queue, or fail, per flow.
- Idempotency/retry posture for consumed events.

## NFR compliance

| NFR | Target | How this service meets it |
| --- | --- | --- |

## Open questions

Numbered list; move resolved ones to an ADR or delete them.
