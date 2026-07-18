# Spec 09 — Progress

## Purpose

Readiness trend over five months plus session history.

## Route & navigation

- `/progress` under AppShell. Sidebar "Progress" (`TrendUp`).

## Data contracts

- `getTrend()` → [{Mar,22},{Apr,31},{May,44},{Jun,58},{Jul,68}]; `getHistory()` → 4 `SessionRecord`s.

## UI layout

h1 28px "Progress"; muted sub "Readiness over the last five months."

**Readiness trend** Card (elev-sm padding 22): header row card-title
"Readiness trend" + accent-200 13px `ArrowUpRight` "+46 pts since March".
SVG chart viewBox `0 0 560 200`, width 100%:
- 3 horizontal gridlines (y 45/95/145) in `--color-divider`.
- Area polygon under the line: `--color-accent-900` at 0.5 opacity.
- Polyline of the 5 points: `--color-accent`, width 2.5, round join/cap.
- Point math (from prototype): w=560, h=170, pad=8; x = pad + i·(w−2·pad)/4;
  y = h − (v/100)·(h−20) − 6; area polygon = `8,170 …points… 552,170`.
Month labels row below (space-between, 11px neutral-500): Mar Apr May Jun Jul.

**Session history** Card (padding 20): card-title, then Nocturne `Table`
(Date / Session / Focus / Score):
Jul 12 · Mock loop · 4 rounds · System Design (muted) · 3.2 / 5;
Jul 08 · Daily drill · Concurrency · 7 / 10;
Jul 05 · Behavioral mock · Leadership Principles · 3.6 / 5;
Jul 01 · Daily drill · Edge cases · 6 / 10.

## Acceptance checklist

- [ ] Chart renders line + filled area + gridlines + 5 month labels.
- [ ] History table shows themed header row and 4 rows with muted focus column.
- [ ] Both themes clean.
