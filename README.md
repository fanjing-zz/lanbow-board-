# Lanbow · Growth Decision System

A dark‑first, technical analytics board for short‑drama ad investing — React + Vite + TypeScript.

Multi‑product overview (KPIs, 13‑node core funnel, anomaly diagnosis, geo/series), delivery / content / accounts / research / alerts / reports / automation / analysis panes, and a global AI Companion chat (right‑side gradient panel, module‑select context). Light/dark themes.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
```

## Structure

```
src/
  main.tsx                  # entry → renders LanbowBoard
  pages/v2/
    LanbowBoard.tsx         # the board: shell, grid, panes, AI Companion
    boardData.ts            # products & datasets, nav, suggestions
    theme2.ts               # color tokens (dark/light) + applyTheme
public/lanbow-logo-*.png    # brand wordmark (black / white)
DESIGN_SYSTEM.md            # tokens, components, interaction logic
```

See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for the full design system.

*Lanbow · sandwichlab · v1.2 — “Advertising is investing.”*
