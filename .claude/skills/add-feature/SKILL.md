---
name: add-feature
description: Workflow for adding a new feature or functionality to the Ascendra UI platform. Use whenever the user asks to add, extend, or change a feature/screen/capability of the app. Invocable as /add-feature <short description>.
---

# Add a feature to Ascendra

The pipeline for any new feature or functionality. Follow the steps in order;
each step's output is the next step's input. The project agents involved are
defined in `.claude/agents/` (ds-engineer, feature-builder, ui-verifier).

## Step 1 — Spec first

1. Read `.claude/specs/00-platform.md` (architecture + registry) and skim existing
   feature specs for conventions.
2. Create `.claude/specs/NN-<feature-slug>.md` from `.claude/specs/_TEMPLATE.md`, where NN is
   the next free number. Fill EVERY section: purpose, route & nav entry, data
   contracts (types/services/stores), UI layout with exact copy referencing
   Nocturne primitives, states & interactions, and a browser-checkable
   Acceptance checklist (including both themes and persistence where relevant).
3. Show the spec to the user and get approval before building. Ambiguity found
   later gets resolved by the spec — so make it decisive now.

## Step 2 — Design-system delta (only if needed)

If the feature needs a primitive or class that `ascendra-frontend/src/components/ui/` and
`nocturne.css` don't have, hand THAT part to the **ds-engineer** agent first
(one task: "add primitive X per spec NN section Y"). Features must never
hand-roll visual patterns.

## Step 3 — Build

Hand the approved spec to a **feature-builder** agent:

> Build the feature in .claude/specs/NN-<slug>.md. Read .claude/specs/00-platform.md first.
> Touch only ascendra-frontend/src/features/<slug>/ plus the shared files the spec names
> (route registration, store/service/type additions). Run npm run build before
> reporting.

If the feature is large and separable, split into multiple feature-builder
tasks with disjoint file ownership — never let two agents edit the same file
concurrently; serialize edits to shared files like `routes.tsx`.

## Step 4 — Verify

Hand the spec to the **ui-verifier** agent to drive the Acceptance checklist
in the browser (both themes, persistence, console clean). Feed every FAIL back
to a feature-builder agent as a fix task, then re-verify. Loop until green.

## Step 5 — Record

1. Update the Registry table in `.claude/specs/00-platform.md` (route, store fields,
   status → built).
2. If a convention changed or a new primitive was added, update `CLAUDE.md`
   and `.claude/skills/nocturne/SKILL.md` so future sessions see it.
3. If the feature has backend impact (new data, new AI capability, anything the
   mock service layer fakes that a real backend must serve), run the
   `update-hld` skill with the feature's spec as input so the backend HLD stays
   in step.
4. Summarize for the user: what was built, where, how it was verified.
