# Spec 12 — Notes & TODOs panel

## Purpose

A dockable right-hand panel on all authed screens for free-form prep notes
(auto-saved) and a lightweight TODO list. Everything persists locally.

## Route & navigation

- No route. Toggled by a TopBar Chip "Notes & TODOs" (`NotePencil` icon,
  placed between the theme toggle and "Today's 10"; chip shows `on` while the
  panel is open). Rendered by AppShell as a right `<aside>` sibling of the main
  column.

## Data contracts

- New zustand store `notesStore` (persisted):
  - `notes: string` (localStorage key `asc-notes` — keep this exact key),
  - `todos: { text: string; done: boolean }[]` (key `asc-todos`),
  - actions: `setNotes(text)`, `addTodo(text)`, `toggleTodo(index)`, `removeTodo(index)`.
  - Persist notes and todos under their OWN localStorage keys (two small
    persisted stores or custom storage) so the prototype's key names hold.
- `uiStore`: `notesOpen: boolean`, `toggleNotes()` (not persisted).

## UI layout

Aside: width 296, flex none, bg `--color-surface`, left edge
`-1px 0 0 var(--color-divider)` shadow, sticky top 0, height 100vh,
overflow-y auto, padding 20/16, column gap 22.

- Header row: `NotePencil` 18px accent icon + card-title 15px "Notes & TODOs"
  (flex 1) + icon Button `X` (title "Close panel") → `toggleNotes()`.
- **My notes** section: kicker "My notes"; Textarea (min-height 150, 13px/1.5)
  placeholder "Jot down concepts, mistakes to avoid, links…" bound to
  `notes` (save on input). Below, muted 11px line with `CheckCircle` accent
  icon: "Saved automatically — here whenever you return."
- **TODOs** section: kicker "TODOs"; input row: Input placeholder "Add a TODO…"
  (Enter adds) + primary icon Button `Plus` (title "Add TODO").
  Each todo row (divider bottom): toggle button (`Square` / `CheckSquare`
  accent icon 17px), text 13px (`line-through` + neutral-500 when done —
  `.asc-todo-done`), delete button (`X` 13px neutral-500).
  Empty state (no todos): muted 12px "Nothing yet — add prep tasks above."

## States & interactions

- Chip toggles the panel; chip `on` while open. Panel is per-session (open
  state not persisted); notes/todos persist across reloads.
- Adding: Enter in the input or the Plus button; whitespace-only is ignored;
  input clears after add.
- Toggle flips done styling; delete removes the row.

## Acceptance checklist

- [ ] Chip opens/closes the panel on every authed screen; chip shows on-state.
- [ ] Notes text survives reload (`asc-notes`); todos survive reload (`asc-todos`).
- [ ] Add via Enter and via button; empty input ignored; empty-state line shows when list is empty.
- [ ] Toggle strikes through; delete removes.
- [ ] Both themes render cleanly.
