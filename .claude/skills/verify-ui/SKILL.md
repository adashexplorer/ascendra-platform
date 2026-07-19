---
name: verify-ui
description: How to launch and smoke-test the Ascendra UI in the browser — launch config, routes, demo credentials, state reset, and the per-screen checklist. Load before any browser verification of this app.
---

# Verifying the Ascendra UI

## Launch

- Dev server: `preview_start` with name `ascendra` (from `.claude/launch.json`,
  runs `npm run dev` on port 5173). Check `preview_logs` for compile errors.
- Always run `npm run build` first — tsc failures are findings on their own.

## Demo access

Client-side demo auth — no backend:
- Login: any valid email + any password ≥ 8 chars (e.g. `priya@example.com` / `password1`). Lands on `/` as Priya Menon.
- Register: any name/email/password ≥ 8 → lands on `/onboarding` (dashboard locked until diagnostic finished or skipped via "I'll take it later").

## State reset

App state persists in localStorage keys `asc-auth`, `asc-theme`, `asc-prep`,
`asc-notes`, `asc-todos`.
To reset between scenarios run in the browser:
`localStorage.clear(); location.reload()` (javascript_tool), or verify
persistence by NOT clearing and reloading.

## Routes

`/login`, `/register`, `/onboarding`, `/onboarding/diagnostic`, and under the
authed shell: `/` (Overview), `/gaps`, `/roadmap`, `/interview` (interview +
coding-test modes), `/playground`, `/drill`, `/progress`. Unknown → `/`.

## Smoke checklist (full pass)

1. Fresh state → `/` redirects to `/login`. Empty submit shows field errors.
2. Register → onboarding step 1 → Continue → step 2 → "Take diagnostic now"
   → answer/skip through → "Finish & curate plan" → step 3 "Your plan is ready"
   → "Go to my dashboard" → Overview.
3. Overview: readiness ring 68, 5 competency meters with ticks, greeting.
4. Each sidebar item navigates; active nav item highlighted (accent-900 bg).
5. Drill: submit → scored feedback → next advances stepper; reload resumes.
6. Interview: level chips filter (3 per level); finish a session → completion
   card; Roadmap shows Phase 5; Gaps shows 7; Overview readiness 72.
7. Progress: trend chart + 4-row history table.
8. Chat: launcher on authed screens only; open/expand/close; quick chips navigate.
9. Coding test (on /interview): mode chip swaps; setup → active → assessed;
   gap "{area} (coding)" + reinforcement phase appear; readiness +3.
10. Playground: language chips swap the OneCompiler embed; theme-aware.
11. Notes & TODOs: TopBar chip toggles panel; notes + todos survive reload;
    add/toggle/delete todos.
12. Gap rows (/gaps) and roadmap modules are external resource links (new tab).
13. Theme toggle: flip to light — every screen re-skins, no unreadable text;
    flip back. Theme persists on reload.
14. Console: zero errors on every screen (`read_console_messages` onlyErrors).
