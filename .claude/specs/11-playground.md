# Spec 11 — Coding playground

## Purpose

An embedded code editor/runner so candidates can practice without leaving prep.
Used standalone or as the scratch space for the mock coding test (spec 07).

## Route & navigation

- `/playground` under AppShell. Sidebar item "Playground" (`Code` icon),
  positioned after "Mock Interview" and before "Daily Drill".
- Also reached via "Open playground" from the coding test (spec 07).

## Data contracts

- Local state only: `lang: 'java' | 'python' | 'javascript' | 'cpp'` (default `'java'`).
- Reads `themeStore.theme` — the embed URL is theme-aware and must switch when
  the app theme toggles.

## UI layout

Header row (space-between, wrap): h1 28px "Coding playground" + a Chip-styled
external link (`ArrowSquareOut` icon) "Open full CodeSandbox" →
`https://codesandbox.io/s/new`, `target="_blank" rel="noopener"`,
`text-decoration:none`.

Sub (muted 14px): "Write and run code without leaving your prep. Pick a
language below — for multi-file projects, open CodeSandbox in a new tab."

Language chips row: Java / Python / JavaScript / C++ (`on` for selected).

Card (`elev sm`, padding 0, overflow hidden): iframe
`https://onecompiler.com/embed/{lang}?theme={dark|light}&hideNew=true`,
width 100%, height 620, no border, `title="Coding playground"`.

## States & interactions

- Picking a language chip swaps the iframe src (remount acceptable).
- Theme toggle re-renders the iframe with the matching editor theme.

## Acceptance checklist

- [ ] Sidebar shows Playground with Code icon; route renders the iframe.
- [ ] Language chips switch the embed; selected chip shows the on state.
- [ ] Theme toggle switches the embed theme (dark ↔ light URL param).
- [ ] "Open full CodeSandbox" opens externally in a new tab.
- [ ] Both app themes render cleanly around the embed.
