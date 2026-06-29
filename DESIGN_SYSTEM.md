# Lanbow Design System · v1.2

> Growth Decision System — a dark‑first, technical/analytical control‑room UI.
> Source of truth in code: `src/pages/v2/theme2.ts` (tokens) and `src/pages/v2/LanbowBoard.tsx` (board) + `lanbowShared.tsx`.

---

## 1. Principles

1. **One canvas.** The shell is a single continuous surface — no panel fills or divider lines on the sidebar/topbar. Only **cards** are distinct surfaces. Layers are separated by **gradients & frosted glass**, never hard borders.
2. **Technical & sharp.** Small radii, mono‑like density, tabular numbers, uppercase labels. Reads like an instrument panel, not a marketing site.
3. **Dark‑first, theme‑parity.** Dark is default; light is a soft‑grey scheme (never pure white). Every token has both values via CSS variables.
4. **Data‑driven.** Every view renders from the active `tenant → product` dataset. Switching is reactive; empty/placeholder states are explicit (`AI 待生成`, `起点`, `暂无数据`).
5. **Conversation is ambient.** The AI assistant is a global companion that overlays content, can be fed any module as context, and is reachable from every page.
6. **Restraint in weight & motion.** Semibold (600) max — no heavy 700. Motion is short (.12–.3s), functional, easing `cubic-bezier(.2,.7,.2,1)`.

---

## 2. Foundations

### 2.1 Color tokens

Applied as CSS variables `--c-*` on `:root`, referenced in code as `c.xxx` (e.g. `c.accent` → `var(--c-accent)`). Toggle with `applyTheme(isDark)`.

| Token | Role | Dark | Light |
|---|---|---|---|
| `bgBase` | page canvas | `#071015` | `#E7ECF1` |
| `bgPanel` | sidebar/topbar/panel fill | `rgba(11,23,32,.82)` | `rgba(255,255,255,.88)` |
| `bgCard` | card top of gradient | `#0E1D28` | `#FFFFFF` |
| `bgInput` | inputs, track, chip bg | `#091318` | `#EEF2F6` |
| `bgElevated` | tooltips, popovers | `rgba(10,20,30,.90)` | `rgba(255,255,255,.96)` |
| `accent` | brand teal (primary) | `#00B1A2` | `#00897B` |
| `accentMid` | teal mid | `#008E82` | `#00695C` |
| `accentDim` | teal tint fill / glow | `rgba(0,177,162,.12)` | `rgba(0,137,123,.08)` |
| `green` | success | `#00CC77` | `#059669` |
| `blue` | info | `#3B82F6` | `#2563EB` |
| `textPri` | primary text | `#BDD8E8` | `#16242E` |
| `textSec` | secondary text | `#6B9EAF` | `#4A7080` |
| `textMute` | muted / captions | `#3D6575` | `#8AACBC` |
| `textLabel` | KPI/section labels | `#4A7585` | `#5A8090` |
| `border` | hairline | `rgba(0,177,162,.10)` | `rgba(28,46,56,.10)` |
| `borderStrong` | emphasized hairline | `rgba(0,177,162,.26)` | `rgba(28,46,56,.16)` |
| `shadowColor` | shadow base | `rgba(0,0,0,.60)` | `rgba(20,40,55,.10)` |

### 2.2 Status & fixed brand colors

Status colors are **theme‑agnostic literals** (used directly, not via `c`):

| Name | Value | Use |
|---|---|---|
| `WARN` | `#FFB800` | warning, internal markers, amber metrics |
| `CRIT` | `#FF4466` | critical, abnormal funnel drop, danger KPI |
| `GREEN` | `c.green` | positive delta, healthy status |
| Bright teal | `#2ccdc2` | input accents, live/data viz strokes |
| Teal washes | `rgba(44,205,194,.1 / .4)` | chip fills, send button, bars |
| Recovery red wash | `rgba(166,47,93,.1)` / text `#a62f5d` | RECOVERY status |

Status badge palette (table cells): `ACTIVE` teal, `RECOVERY` red, `PAUSED` muted, `DRAFT` blue.

### 2.3 Typography

- **Single family: Inter** for all Latin + numbers. No monospace, no serif. (`c.mono` and `c.sans` both resolve to `'Inter', system-ui, sans-serif`; CJK falls back to system.)
- **Tabular numbers** globally: `font-variant-numeric: tabular-nums` on the root so figures align in tables/funnels.
- **Weights:** `400` body, `600` for titles / KPI values / emphasis. **Never use 700** (too heavy with Inter).

| Role | Size | Weight | Notes |
|---|---|---|---|
| Page title (`h2`) | 18 | 600 | letter-spacing −.01em |
| EN sublabel | 10.5 | 400 | uppercase, `textMute`, tracking .1em |
| Card title | 12.5 | 600 | with accent tab marker |
| Card source label | 9.5 | 400 | uppercase, `textMute`, tracking .06em |
| KPI value | 24 | 600 | tabular |
| KPI label | 9.5 | 400 | uppercase, `textLabel`, tracking .07em |
| Body / table | 11.5–12.5 | 400 | |
| Small / chips / nums | 10–11 | 400/600 | |

### 2.4 Radius scale

Single source `R` (in `LanbowBoard.tsx`). Strict to Figma — **sharp**.

| Token | px | Use |
|---|---|---|
| `R.card` | **2** | cards, panels, large surfaces |
| `R.bar` | **3** | progress/funnel/geo bars, tracks |
| `R.nav` | **4** | nav buttons, icon buttons, segmented control |
| `R.badge` | **4** | badges, status pills, context chips |
| `R.chip` | **4** | asset-health chips |
| `R.ctrl` | **6** | selects, input bar, account/window chips |
| `R.pill` | **6** | suggestion/follow-up chips |
| circle | `50%` | avatar, dots |

### 2.5 Spacing

| Use | Value |
|---|---|
| Grid gap (cards) | 14 |
| Card header padding | `12px 16px 9px` |
| Card body padding | `14px 16px` |
| Page padding (main) | `22px 26px 150px` (extra bottom for input dock) |
| KPI cell padding | `4px 16px 4px 13px` |
| Chip padding | `3px 6–9px` |
| Sidebar | 60px col, icons 42px, gap 6, pad `14px 0` |
| Topbar height | 56px, padding `0 22px`, gap 14 |

### 2.6 Elevation & glass

- Cards: `background: linear-gradient(180deg, bgCard, bgPanel)` + `1px solid border`. Hover → `borderStrong` + `translateY(-1px)` + `0 8px 24px shadowColor`.
- Floating surfaces use **frosted glass**: `backdrop-filter: blur(12–24px)` over translucent fills, not opaque panels.
- No hard separators between shell regions — separation is by gradient/glass.

### 2.7 Motion

| Name | Spec | Use |
|---|---|---|
| hover (card) | `border-color/transform/box-shadow .16s` | card lift |
| hover (nav/chip/icon) | `.14–.15s` color/bg/border | interactive feedback |
| button press | `transform: translateY(1px)` | `.lb-btn:active` |
| `lbFade` | `.3s cubic-bezier(.2,.7,.2,1)`, translateY 8→0 | pane switch enter |
| `lbSlide` | `.3s`, translateX 24→0 | companion panel enter |
| bar grow | `width .55s cubic-bezier(.2,.7,.2,1)` | funnel/geo bars |

---

## 3. Layout

### 3.1 Canvas grid (seamless)

```
grid-template-columns: 60px 1fr;
grid-template-rows:    56px 1fr;
```
- **Topbar** spans the full width → `gridColumn: 1 / 3, gridRow: 1`.
- **Sidebar** sits *below* the topbar → `gridColumn: 1, gridRow: 2`.
- **Main** → `gridColumn: 2, gridRow: 2`, scrolls.
- Sidebar & topbar are **`background: transparent`, no borders** — they float on the canvas.
- Page background: `radial-gradient(1100px 420px at 78% -12%, accentDim, transparent 62%), bgBase` (a soft top-right accent glow).

### 3.2 Gradients & masks (layer separation)

- **Bottom content fade** (when centered input shown): fixed strip, `linear-gradient(to top, bgBase 0%, bgBase 40%, transparent)` so content dissolves before the input.
- **AI Companion blend** (overlay): the panel does **not** push content; it overlays and blends via a **right‑to‑left gradient + mask**:
  - `background: linear-gradient(to right, transparent 0px, bgPanel 150px)` + radial accent glow
  - `mask-image: linear-gradient(to right, transparent 0px, #000 130px)` (fades the frosted blur too)
  - content offset `padding-left: 150` so it sits past the fade zone.

---

## 4. Components

### 4.1 Sidebar nav
- 42px icon buttons, `R.nav`. Active → `accentDim` bg + `accent` icon. Hover → `accentDim`.
- **Group separators**: 1px `border` divider between nav groups (chat / external / internal).
- **Dots are meaningful only.** No blanket "internal" dots. A `WARN` dot appears **only on Alerts when there are active alerts**.
- Hover tooltip: `label · EN ( · 内部)` in `bgElevated`.

### 4.2 Topbar (filters)
Left: **brand logo image** (theme-aware: white `lanbow-logo-light.png` on dark, black `lanbow-logo-dark.png` on light) + `Growth Decision System · v1.2`. Right cluster: `租户`/`产品` selects, `窗口` date chip, `账号` chip, **内部/对外 segmented**, theme toggle, avatar. Controls use `bgInput` + `border` + `R.ctrl`.

### 4.3 Card
Gradient fill, `R.card`, header = accent tab + title + (source label) + **module ⊕ button**. The ⊕ toggles the card into the global AI context (becomes ✓, border → `borderStrong`). Body padded. Add `className="lb-card"` for hover.

### 4.4 KPI cell
Left 2px accent border (`borderStrong`, or `CRIT`/`GREEN`/`WARN` by state). Label (uppercase, `textLabel`) → value (24/600, tabular, colored by state) → delta badge (`▲/▼ %`, up=green wash, down=crit wash).

### 4.5 Funnel
Rows: **left‑aligned** label (`step + label`, `·proxy`/`·missing` muted) → log‑scale bar (`width = 8 + 92·(log10(v)-min)/range`, `R.bar`, `.lb-bar` animated) → drop % (`起点` for first, `±x%`, red when `abn` or ≤ −60%). Abnormal node label + bar in `CRIT`.

### 4.6 Badges / status
`padding 2px 8px`, `R.badge`, mono‑ish small. ACTIVE = teal wash; RECOVERY = red wash; PAUSED = muted; DRAFT = blue wash.

### 4.7 Tables
Header cells: 9.5px uppercase `textMute`, 1px `border` underline. Rows: 11.5px, hover `bgInput` (`.lb-row`). Numeric columns right-aligned (tabular).

### 4.8 Input bar (Figma 3510‑9327)
Single row, 45px, `R.ctrl`, frosted (`blur(12px)`) over `rgba(0,177,162,.05)` (dark) / `rgba(255,255,255,.55)` (light). **Border weakens in light** (`rgba(28,46,56,.08)` vs dark `rgba(60,73,72,.5)`). Contents: `@ lanbow` chip (teal) · text input · mic icon · **↵ send button** (teal wash + `rgba(44,205,194,.4)` border). Two placements share one definition: centered dock (entry) and inside the companion panel.

### 4.9 AI Companion panel
Right overlay, `min(560px, 50vw)`, gradient blend (§3.2). Top→bottom: header (`AI 对话 · Lanbow · {product}` + collapse ×) → scrollable messages → **Suggested follow-ups** (numbered rows, `R.card`, click to send) → context chips + input bar. Slide-in via `.lb-companion`.

### 4.10 Conversation messages
- **User**: right‑aligned bubble, `bgCard` + `border`, radius `12px 12px 4px 12px`; attached context tags shown above.
- **Agent**: left, `3px accent` left border, `textSec`, `pre-wrap`.
- Replies prefix combined modules: `（已结合模块：…）`.

### 4.11 Context chips (module-select)
Above the active input: `AI 上下文 · N`, each chip = label + `×`, in `accentDim` + `borderStrong` + `R.badge`, plus a `清除` clear-all.

---

## 5. Interaction & logic patterns

- **Theme toggle.** `isDark` state → `applyTheme(isDark)`; default dark. Logo, borders, shadows, gradients all swap.
- **internal / external view.** `外部` hides internal-only nav items and falls back to Overview; `内部` shows all.
- **tenant → product.** Two-level filter. Changing tenant resets to its first product. All panes read the active `Product` dataset (KPIs / funnel / geo / series / plans / accounts / research / alerts / thresholds / rules).
- **Global module-select (AI context).** Click any card's ⊕ → adds it to `mods` (global). Chips appear above the input; selections are recombinable and removable. **Sending attaches the modules** (tagged on the user message; the reply acknowledges them) then clears them. Works from any page.
- **Chat surfacing.** Centered input is the entry when idle. Sending (or the chat nav) opens the **right companion panel**; it overlays content via gradient. The dashboard stays put underneath.
- **Data states.** Real‑but‑zero shows actual zeros + `起点`/`▼100%`. Unbuilt panes render an explicit `AI 待生成` placeholder card. Missing funnel nodes tagged `·missing`, proxies `·proxy`.
- **Reduced signal.** Decorative noise is avoided; dots/badges only where they carry meaning.

---

## 6. Code conventions

- **Inline styles only** (no CSS classes except a small `<style>` block for hovers/keyframes `.lb-*`). Keeps one render path.
- **Colors via `c.xxx`** (theme variables). Only status literals (`WARN`, `CRIT`, brand teals) are hardcoded.
- **Radii via `R`**, never magic numbers.
- **Inter everywhere**, `tabular-nums`, weight ≤ 600.
- **Data in `boardData.ts`**; presentation in `LanbowBoard.tsx`; shared atoms in `lanbowShared.tsx`.

---

## 7. File map

| File | Role |
|---|---|
| `src/pages/v2/theme2.ts` | color tokens (dark/light) + `applyTheme`; `c` accessor |
| `src/pages/v2/LanbowBoard.tsx` | the board: shell, grid, panes, companion, `R` scale, components |
| `src/pages/v2/boardData.ts` | products & datasets, NAV, suggestions, asset health, data-link |
| `src/pages/v2/lanbowShared.tsx` | shared palette/icons/atoms (used by earlier views) |
| `public/lanbow-logo-{dark,light}.png` | brand wordmark (black / white) |

*Lanbow · sandwichlab · Growth Decision System v1.2 — “Advertising is investing.”*
