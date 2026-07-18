# Spec 10 — "Ask Ascendra" chat agent

## Purpose

A dockable floating chat guide available on every authed AppShell screen:
launcher pill → panel → expanded panel. Scripted demo conversation with
quick-action chips.

## Route & navigation

- No route. Rendered by AppShell. TopBar chip "Ask Ascendra" also opens it.

## Data contracts

- `uiStore`: `chatOpen`, `chatExpanded`, `openChat()`, `closeChat()` (also
  collapses), `toggleExpand()`.
- Messages: static scripted transcript (below); the input is presentational —
  submitting may append the user's text as a bubble and a canned reply
  "I'm a demo guide — try one of the quick actions below." (keep simple).

## UI layout

**Launcher** (`chatOpen === false`): fixed right 22 / bottom 22, z-55 pill:
1px accent border, surface bg, accent text, `Sparkle` 18px + "Ask Ascendra",
radius 999, shadow.

**Panel** (`chatOpen`): `.asc-chat` (+ `.asc-chat-exp` when expanded) — fixed
380×520 (expanded min(560px,92vw) × min(720px,84vh)).
- Header (divider bottom): 28px rounded-8 accent square `Sparkle`; column
  "Ascendra guide" 14px/500 + accent-200 11px "● Online · knows your plan";
  icon Buttons `ArrowsOut` (title "Expand", toggles) and `X` (title "Close").
- Scrollable body, 12px gap. Bubbles 13.5px/1.5 max-width 88%:
  - Agent (left, `--color-neutral-900` bg, radius 14/14/14/4): "Morning, Priya.
    Your readiness is **68** — up 6 this week. Today's 10 questions target
    concurrency and test design, your two weakest areas. Want to start?"
    (bold value in accent-200; use live readiness from prepStore)
  - User (right, accent-800 bg accent-100 text, radius 14/14/4/14): "What
    should I focus on before my next mock loop?"
  - Agent: "System design is your biggest gap (54/80). I'd do the **Distributed
    testing at scale** module next, then a mock loop Friday. I've pinned it to
    the top of your roadmap."
- Footer (divider top): quick-action Chips "Start today's drill" → `/drill`,
  "Explain my weakest area" → `/gaps`, "Schedule a mock" → `/interview`
  (navigating keeps the panel open); input row: Input "Ask anything about your
  prep…" + primary icon Button `PaperPlaneRight`.

## Acceptance checklist

- [ ] Launcher shows on all authed screens; open → panel, expand → larger, close → launcher.
- [ ] Quick chips navigate while panel stays open.
- [ ] Not present on /login, /register, or onboarding screens.
- [ ] Both themes clean (light theme shadow variant applies).
