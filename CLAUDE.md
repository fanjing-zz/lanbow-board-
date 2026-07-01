# Lanbow · sandwichlab-ui — 适配规则 & AI 编码上下文

> **用途**：本文件是 Claude Code 的项目上下文与编码规范。
> 视觉/组件规范以 [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) 为准（canonical），本文件偏工程约束。
> 每次改动后，先确认这两份文档是否需要同步更新。

---

## 1. 项目结构（单看板架构）

> 架构已收敛为**单一看板** `LanbowBoard`。旧的 `LanbowApp` 多文件应用（`*Content.tsx` / `*View.tsx` / `sharedData.ts` / `agentLogic.ts` / `lanbowShared.tsx` 等）已删除，不再使用。

```
Fanjing v.1/
├── src/
│   ├── main.tsx               ← 入口：渲染 <LanbowBoard />
│   └── pages/v2/              ← 唯一生产代码目录（6 个文件）
│       ├── LanbowBoard.tsx    ← 整个看板：shell / 网格 / topbar / sidebar / 各 Pane / AI 对话面板 / 全部组件
│       ├── theme2.ts          ← 唯一 token 源：颜色 CSS 变量 + 字体 + 圆角 R + applyTheme()
│       ├── boardData.ts       ← 数据 + 接口：products（drama / mindramas / auvora / kwai）、TENANTS、NAV、各 Pane 数据
│       ├── boardModules.tsx   ← 可复用可视化模块（Spark / Ring / StackBar / StatTile / RankRows / compactModule …）
│       ├── reportTemplate.ts  ← 可下载复盘报告（自包含、主题化的 HTML 字符串）
│       └── MathLoader.tsx     ← 全局 loading 动画（玫瑰曲线粒子）+ LoaderOverlay
```

数据按 `tenant → product` 组织，切换即响应式重渲染；每个 Pane 从当前 `product` 取数。

---

## 2. 设计 Token 映射规则

### 2.1 严禁直接写 hardcode 颜色

所有颜色必须通过 `c.xxx` 引用，从不 hardcode `#` 值。

```typescript
import { c } from './theme2';
// ✅ 正确
color: c.accent
background: c.bgCard
// ❌ 错误
color: '#00B1A2'
background: '#0E1D28'
```

唯一例外：状态颜色（danger/amber/info）允许 hardcode（`theme2.ts` 未专门暴露），统一用以下常量；
看板里实际命名为 `CRIT` / `WARN`（+ `c.green` / `c.blue`）：

```typescript
const CRIT  = '#FF4466';   // danger
const WARN  = '#FFB800';   // amber
const INFO  = '#3B82F6';   // = c.blue
const GREEN = c.green;     // '#00CC77'
```

另有两处既有的品牌/装饰色（非 token，刻意保留）：输入栏亮青 `#2ccdc2` 及其 `rgba(44,205,194,…)` 磨砂值（Figma 输入栏规范，DESIGN_SYSTEM §4.8）、头像 `K` 渐变。图表分类色（如 `#a78bfa`）按需直接写。

### 2.2 HTML CSS 变量 → React `c.xxx` 对照表

| HTML `var(--xxx)` | React `c.xxx` | 说明 |
|---|---|---|
| `--bg-base` | `c.bgBase` | 页面底色 |
| `--bg-panel` | `c.bgPanel` | 侧边栏/顶栏 |
| `--bg-card` | `c.bgCard` | 卡片背景 |
| `--bg-elevated` | `c.bgElevated` | 弹出层/tooltip |
| `--bg-input` | `c.bgInput` | 输入框背景 |
| `--accent` | `c.accent` | 主色（青绿）|
| `--accent-mid` | `c.accentMid` | 主色中间调 |
| `--accent-dim` | `c.accentDim` | 主色低饱和背景 |
| `--text-pri` | `c.textPri` | 主文字 |
| `--text-sec` | `c.textSec` | 次文字 |
| `--text-mute` | `c.textMute` | 弱化文字 |
| `--border` | `c.border` | 分割线 |
| `--border-strong` | `c.borderStrong` | 强调分割线 |
| `--mono` | `c.mono` | 字体（= Inter，见 §2.3；保留 token 名兼容旧引用） |
| `--sans` | `c.sans` | 字体（= Inter，见 §2.3） |
| `--crit` | `'#FF4466'` | 危险红（无 c.xxx） |
| `--warn` | `'#FFB800'` | 警告琥珀（无 c.xxx） |
| `--blue` | `'#3B82F6'` | 信息蓝（无 c.xxx） |
| `--green` | `c.green` | 成功绿 |

### 2.3 字体规则

**单一字族 Inter** —— 全部拉丁字符 + 数字统一用 Inter，不再分等宽/衬线。
`c.mono` 与 `c.sans` 两个 token **都 resolve 到 Inter**（token 名保留仅为兼容旧引用），CJK 走系统回退。

```typescript
// c.mono === c.sans === "'Inter', system-ui, sans-serif"
fontFamily: c.sans   // 正文、标题、按钮
fontFamily: c.mono   // 数据、标签、badge —— 同样是 Inter（历史命名）

// 数字对齐：root 上全局开启
fontVariantNumeric: 'tabular-nums'
```

- ❌ 不再使用 Space Mono / 任何等宽字体；❌ 不再使用 Abhaya Libre / 任何衬线字体（报告 HTML 也已统一为 Inter）。
- 新代码优先写 `c.sans`；`c.mono` 仅在沿用既有组件时保留。

---

## 3. 样式编写规则

### 3.1 只写内联样式，禁止 CSS 类

```typescript
// ✅ 正确（颜色用 c.*，圆角用 R.*）
<div style={{ padding: '14px 16px', background: c.bgCard, borderRadius: R.card }}>

// ❌ 错误（CSS 类）
<div className="card-body">
```

例外：① `LanbowBoard.tsx` 顶部的 `<style>` 块（仅 hover / keyframes / 滚动条等，类名一律 `lb-*` / `lbn`）；② `reportTemplate.ts` 内的报告 HTML 字符串模板，使用 CSS 类是合法的。

### 3.2 常用尺寸规范

- **圆角一律用 `R.*`（见 §2.4 / DESIGN_SYSTEM §2.4），禁止写死数字**：卡片 `R.card`、控件/输入 `R.ctrl`、badge/chip `R.badge`/`R.chip`、bar `R.bar`。复合值用模板串：`` `0 ${R.bar}px ${R.bar}px 0` ``。
- **层级一律用 `Z.*`（theme2.ts / DESIGN_SYSTEM §2.8），禁止写裸 zIndex**。App 根已设 `isolation:isolate` 形成独立 stacking context —— 内部浮层不会与被嵌入的宿主页面 z-index 打架（修「直接调用层级混乱」）。顺序：`chrome < fade < dock < companion < loader < scrim < popover < tooltip`。
- **承载文字的浮层必须有不透明背景垫底（DESIGN_SYSTEM §3.3）**：组合 `…tint…, bgBase/bgCard`，别只用「半透明色 + backdrop-blur」当文字面板背景，否则背后内容会透出来和文字打架。透明只留给非文字层（边缘渐隐 mask、点击背板、无缝顶栏/侧栏）。

| 用途 | 值 |
|---|---|
| 卡片 padding | `'14px 16px'`（标题区 `'12px 16px 9px'`） |
| 主区容器 padding | `'22px 26px 150px'`（底部留对话输入空间） |
| 卡片网格 gap | `14` |
| section / 控件 gap | `8–16` |

### 3.3 字号规范

字重只用 **400 / 600 两档，禁止 700（及 300 等极端字重）**——Inter 下 700 过粗。

| 用途 | 字号 | 字重 |
|---|---|---|
| 页面标题 | 18px | 600 |
| 卡片标题 | 12.5px | 600 |
| 正文 / 表格 | 11.5–12.5px | 400 |
| 数据大字（KPI 值） | 24px（最大 30） | 600 |
| 小标签 / badge / 数字 | 9.5–11px | 400 / 600 |

---

## 4. 组件模式规范（均在 `LanbowBoard.tsx` 内）

### 4.1 卡片 `Card` + 模块选择（`ModContext`）

- 所有卡片用统一的 `Card`（`title` / `src` 来源标签 / `span` / `modId`）。右上角 `⊕` 按钮把该模块加入 **AI 上下文**；选中变 `✓`、边框转 `borderStrong`。
- 选择状态是**全局**的：`ModContext`（`has(id)` / `toggle(id,label)`）+ 顶层 `mods` state。`Card` 默认 `modId = "mod-{title}"`。不要再为每个页面复制本地 `Sel` 组件。
- 选中的模块在对话里作为上下文 chips 展示；说「生成自定义看板」可把它们合成到总览（`customBoard`）。

### 4.2 AI 对话面板（companion）

- 不是独立页面：点 chat nav 切换 `chatOpen`（`setChatOpen`），面板**覆盖**在内容上（不挤压），右→左渐变融入画布。尺寸/渐变规范见 DESIGN_SYSTEM §3.2 / §4.9（自适应：floor 440 / 46vw / cap 680 / 94vw；`%` 渐变蒙版）。
- 居中输入栏（idle 入口）与面板内输入栏**共用同一个 `inputBar` 定义**。
- 发送：`setChatOpen(true)` → 显示思考态（`MathLoader`）→ 生成回复。回复可带可交互的数据 widget（`compose` / `data`）。

### 4.3 侧边栏 / 导航

- 导航项来自 `boardData.ts` 的 `NAV`（`{ id, label, en, ext, grp, dot, cta }`）。`ext=false` 为内部页，「对外」视图下隐藏。
- 相邻不同 `grp` 之间渲染 1px 分隔线；仅在需要提示的项（如 `alerts` 有告警时）右上角显示琥珀圆点。

### 4.4 可下载报告（`reportTemplate.ts`）

- `buildDramaReport(isDark)` 返回**自包含、主题化**的 HTML 字符串；`downloadDramaReport()` 直接 blob 下载。
- 字体统一 Inter（≤600、tabular-nums）；禁止辅助图形 / grid 背景纹理；模块卡片左侧分区线用 `box-shadow: inset 3px 0 0 <accent>`。
- HTML 字符串内可用 CSS 类（§3.1 例外②）。

---

## 5. 数据规范

- **唯一数据源 `boardData.ts`**：`PRODUCTS`（`drama` / `mindramas` / `auvora` / `kwai`）+ `TENANTS` + `NAV` + 各 Pane 数据，全部带 TS 接口。
- 每个 Pane 从当前 `product` 取数；新增字段先在 `Product` 接口里声明（可选字段用于按行业/产品差异化，如 `creative` / `episodes` / `ttff` / `reconcile` / `breakdowns` / `contentZh` / `playLabel`）。
- 空态显式表达：`AI 待生成` / `起点` / `暂无数据` / `0.000`。
- 不引入 `useState` 之外的全局状态（无 Redux/Zustand）；不直接操作 DOM。

---

## 6. 设计来源与同步

- 现版本不再来自 `design-preview HTML`；看板按解密的 drama-demo 真实板重建。**视觉/组件 canonical 文档 = [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md)**，本文件偏工程约束。
- 改动直接落到 §1 的 6 个文件；改完先 `npx tsc --noEmit`，零错误再提交。
- 禁止：把外部 CSS 类搬进 React（§3.1 例外除外）；用 `<script>` 直引图表（用 SVG / ref + useEffect，如 `EpisodeChart` / `MathLoader`）；改 `theme2.ts` 的 token 名（级联破坏）。

---

## 7. TypeScript 规范

- 类型集中在 `boardData.ts`（`Product` / `Kpi` / `FunnelNode` / `Creative` / `ReconcileItem` …）。
- 看板内部状态（`cur` / `tenant` / `prodId` / `mods` / `msgs` …）就近用 `useState`。
- 每次修改后运行 `npx tsc --noEmit`，保证零错误再提交。

---

## 8. Git 提交规范

```
feat(scope):  新功能
fix(scope):   修复
refactor:     重构（无功能变化）
docs:         文档
chore:        配置/依赖
```

**所有提交末尾加（与当前使用的模型一致）：**
```
Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
```

---

## 9. 快速参考：新增一个 Pane（页面）的完整步骤

```
1. 在 boardData.ts 的 NAV 加一项 { id, label, en, ext, grp }
2. （需要新数据时）在 Product 接口加可选字段 + 各 product 填值
3. 在 LanbowBoard.tsx 的 ICON 映射加该 id 的 SVG 图标
4. 在 Pane() 里加 `if (cur === '<id>') return <XxxPane product={product} />`
5. 写 XxxPane 组件：PaneHeader + Card(s)，颜色 c.* / 圆角 R.* / 字体 Inter≤600
6. npx tsc --noEmit → 验证预览 → git commit
```

---

*Lanbow · sandwichlab-ui v1 · Growth Decision System*
*Advertising is investing.*
