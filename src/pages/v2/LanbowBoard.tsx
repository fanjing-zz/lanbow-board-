import React from 'react';
import { c, applyTheme } from './theme2';
import {
  PRODUCTS, TENANTS, NAV, ASSET_HEALTH, SUGGESTIONS, anomalies, DATA_LINK,
  Product, Kpi, FunnelNode,
} from './boardData';
import { downloadDramaReport } from './reportTemplate';
import { compactModule, TrendCard, ChannelMix, CompletionRing } from './boardModules';

const WARN = '#FFB800', CRIT = '#FF4466';

// ── radius scale — strict to Figma 3097-11961 (sharp/technical: cards 2, controls 6) ──
const R = { card: 2, nav: 4, ctrl: 6, chip: 4, badge: 4, bar: 3, pill: 6 };

// ── icons ──
type IP = { size?: number };
const I = (p: IP, ch: React.ReactNode) => (
  <svg width={p.size ?? 19} height={p.size ?? 19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">{ch}</svg>
);
const ICON: Record<string, (p: IP) => React.JSX.Element> = {
  chat: p => I(p, <path d="M21 11.5a8.4 8.4 0 0 1-9 8.3 8.5 8.5 0 0 1-3.8-.9L3 20l1.1-3.2A8.3 8.3 0 0 1 3 11.5 8.5 8.5 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z" />),
  overview: p => I(p, <><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></>),
  delivery: p => I(p, <><path d="m4 12 16 0" /><path d="m13 5 7 7-7 7" /></>),
  creative: p => I(p, <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.6" /><path d="m21 15-5-5L5 21" /></>),
  content: p => I(p, <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M8 4v16" /></>),
  reports: p => I(p, <><path d="M14 3v5h5M7 3h8l5 5v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" /><path d="M9 13h6M9 17h6" /></>),
  accounts: p => I(p, <><circle cx="9" cy="8" r="3.2" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 6a3 3 0 0 1 0 6M21 20a6 6 0 0 0-4-5.7" /></>),
  budget: p => I(p, <><circle cx="12" cy="12" r="9" /><path d="M12 7v10M9.5 9.5a2.5 2 0 0 1 5 0c0 2-5 1-5 3a2.5 2 0 0 0 5 0" /></>),
  alerts: p => I(p, <><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>),
  automation: p => I(p, <path d="M13 2 4.5 13.5H11l-1 8.5L19.5 10H13z" />),
  analysis: p => I(p, <><path d="M3 3v18h18" /><path d="M7 15l3-4 3 3 4-6" /></>),
  research: p => I(p, <><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>),
};

// ── global module-select context (click a card ⊕ → add to AI context) ──
const ModContext = React.createContext<{ has: (id: string) => boolean; toggle: (id: string, label: string) => void }>({ has: () => false, toggle: () => {} });

// ── small UI bits ──
const Card = ({ title, src, span, children, style, modId }: { title: string; src?: string; span?: number; children: React.ReactNode; style?: React.CSSProperties; modId?: string }) => {
  const ctx = React.useContext(ModContext);
  const id = modId || `mod-${title}`;
  const on = ctx.has(id);
  return (
    <div className="lb-card" style={{ gridColumn: span ? `span ${span}` : undefined, background: `linear-gradient(180deg, ${c.bgCard}, ${c.bgPanel})`, border: `1px solid ${on ? c.borderStrong : c.border}`, borderRadius: R.card, overflow: 'hidden', display: 'flex', flexDirection: 'column', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px 9px', borderBottom: `1px solid ${c.border}` }}>
        <span style={{ fontWeight: 600, fontSize: 12.5, position: 'relative', paddingLeft: 11 }}>
          <span style={{ position: 'absolute', left: 0, top: 2, bottom: 1, width: 3, borderRadius: 2, background: c.accent, opacity: 0.65 }} />{title}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {src && <span style={{ fontFamily: c.sans, fontSize: 9.5, color: c.textMute, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{src}</span>}
          <button className="lb-modbtn" onClick={() => ctx.toggle(id, title)} title={on ? '从 AI 上下文移除' : '加入 AI 上下文'}
            style={{ width: 18, height: 18, borderRadius: R.badge, border: `1px solid ${on ? c.borderStrong : c.border}`, background: on ? c.accentDim : 'transparent', color: on ? c.accent : c.textMute, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, lineHeight: 1, padding: 0 }}>
            {on ? '✓' : '⊕'}
          </button>
        </div>
      </div>
      <div style={{ padding: '14px 16px', flex: 1, minHeight: 0 }}>{children}</div>
    </div>
  );
};

const KpiCell = ({ k }: { k: Kpi }) => {
  const col = k.cls === 'crit' ? CRIT : k.cls === 'good' ? c.green : k.cls === 'warn' ? WARN : c.borderStrong;
  const vcol = k.cls === 'crit' ? CRIT : k.cls === 'good' ? c.green : c.textPri;
  return (
    <div style={{ flex: 1, minWidth: 108, padding: '4px 16px 4px 13px', borderLeft: `2px solid ${col}` }}>
      <div style={{ fontSize: 9.5, color: c.textLabel, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>{k.l}</div>
      <div style={{ fontFamily: c.mono, fontSize: 24, fontWeight: 600, lineHeight: 1, color: vcol }}>{k.v}</div>
      {k.d && (() => {
        const num = k.d.replace(/^[▲▼]\s*/, '');                 // strip any arrow from data
        const arrow = k.dcls === 'up' ? '▲' : k.dcls === 'down' ? '▼' : '';  // arrow follows color
        return <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontFamily: c.mono, fontSize: 10, fontWeight: 600, marginTop: 8, padding: '2px 7px', borderRadius: R.chip, color: k.dcls === 'up' ? c.green : k.dcls === 'down' ? CRIT : c.textSec, background: k.dcls === 'up' ? 'rgba(0,204,119,.12)' : k.dcls === 'down' ? 'rgba(255,68,102,.12)' : c.bgInput }}>{arrow && <span>{arrow}</span>}{num}</div>;
      })()}
    </div>
  );
};

function Funnel({ nodes }: { nodes: FunnelNode[] }) {
  const vals = nodes.map(f => Math.max(1, f.value || 0));
  const lmin = Math.log10(Math.min(...vals)), lmax = Math.log10(Math.max(...vals)), rng = (lmax - lmin) || 1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {nodes.map((f, i) => {
        const w = 8 + 92 * ((Math.log10(Math.max(1, f.value || 0)) - lmin) / rng);
        const dropBad = f.abn || (f.drop != null && f.drop <= -60);
        return (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '210px 1fr 64px', alignItems: 'center', gap: 10 }}>
            <div style={{ fontFamily: c.mono, fontSize: 11, color: f.abn ? CRIT : c.textSec, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>
              {f.step} {f.label}{f.kind === 'proxy' && <span style={{ color: c.textMute }}> ·proxy</span>}{f.kind === 'missing' && <span style={{ color: c.textMute }}> ·missing</span>}
            </div>
            <div style={{ position: 'relative', height: 16, background: c.bgInput, borderRadius: R.bar, overflow: 'hidden' }}>
              <div className="lb-bar" style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${w}%`, background: f.abn ? 'rgba(255,68,102,.3)' : c.accentDim, borderRight: `2px solid ${f.abn ? CRIT : c.accent}` }} />
              <span style={{ position: 'absolute', left: 7, top: 0, lineHeight: '16px', fontFamily: c.mono, fontSize: 11, color: c.textPri }}>{f.value.toLocaleString()}</span>
            </div>
            <div style={{ textAlign: 'right', fontFamily: c.mono, fontSize: 11, color: dropBad ? CRIT : c.textMute }}>
              {f.drop != null ? `${f.drop > 0 ? '+' : ''}${f.drop.toFixed(1)}%` : '起点'}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const segBtn = (on: boolean): React.CSSProperties => ({
  border: 'none', background: on ? c.accentDim : 'transparent', color: on ? c.accent : c.textSec,
  fontFamily: c.mono, fontSize: 10.5, letterSpacing: '0.06em', padding: '5px 12px', borderRadius: R.ctrl, cursor: 'pointer', textTransform: 'uppercase', whiteSpace: 'nowrap',
});
const selStyle: React.CSSProperties = { background: c.bgInput, border: `1px solid ${c.border}`, borderRadius: R.ctrl, color: c.textPri, fontSize: 11, padding: '3px 8px', fontFamily: c.mono, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, maxWidth: 200 };
const fltL: React.CSSProperties = { fontFamily: c.mono, fontSize: 9.5, color: c.textLabel, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap', flexShrink: 0 };
const fltGroup: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 };

// ── chat reply (data-aware, Chinese) ──
function boardReply(q: string, p: Product, mods: string[] = []): string {
  const pre = mods.length ? `（已结合模块：${mods.join('、')}）\n` : '';
  if (mods.length && !q) return `${pre}已合并 ${mods.length} 个模块作为上下文。可继续追问，例如「对比这几项」「哪个最该优化」。`;
  const t = q.toLowerCase();
  const wrap = (s: string) => pre + s;
  if (/创建产品|新产品|create/.test(q)) return wrap('已打开产品创建向导（示例）：填写题材 / 种子语种 / 目标市场 / 渠道 / 变现模式 / 付费墙集数后即可生成投放骨架。');
  if (/大盘|今天|overview|花费/.test(q)) { const spend = p.kpis[0], roas = p.kpis.find(k => /roas|roi/i.test(k.l)); return wrap(`${p.label} 今日：${spend.l} ${spend.v}${roas ? ` · ${roas.l} ${roas.v}` : ''}。来源 ${p.kpiSrc}。`); }
  if (/关停|计划|delivery|放量/.test(q)) { if (!p.plans.length) return wrap(`${p.label} 当前无在投计划（${p.kpiSrc}）。`); const worst = [...p.plans].sort((a, b) => a.roi - b.roi)[0]; return wrap(`建议关注「${worst.camp}」(ROI ${worst.roi}×、花费 ${worst.spend})，低于阈值可考虑关停或换素材。`); }
  if (/付费|转化|卡在|漏斗|funnel/.test(q)) { const ab = p.funnel.find(f => f.abn) || p.funnel.slice().reverse().find(f => f.drop != null && f.drop <= -60); return wrap(ab ? `核心链路异常在「${ab.label}」，段间流失 ${ab.drop != null ? ab.drop.toFixed(1) + '%' : '100%'}，待 AI 归因建议。` : '核心链路各段流失在阈值内。'); }
  if (/国家|地区|geo|花费分布/.test(q)) { const g = p.geo.filter(x => x.spend > 0).slice(0, 4); return wrap(g.length ? '花费分布：' + g.map(x => `${x.label} ${x.spend}`).join(' · ') : `${p.label} 各国家花费暂为 0（${p.kpiSrc}）。`); }
  if (/健康|资产|health/.test(q)) return wrap(`资产健康度：${ASSET_HEALTH.join(' / ')} 均为正常（on）。`);
  return wrap(`已记录「${q.trim()}」。我会基于 ${p.label} 的 envelope 数据给出分析（示例）。`);
}

type Widget = { kind: 'compose'; labels: string[] } | { kind: 'data'; topic: string };
type Msg = { id: number; role: 'user' | 'agent'; text: string; mods?: string[]; widget?: Widget };
interface Mod { id: string; label: string }

const isComposeIntent = (q: string) => /(生成|合成|组合|做一?个|搭).*(看板|总览|面板|dashboard|board)|自定义看板|自定义总览|custom\s*(board|dashboard)/i.test(q);
const dataTopic = (q: string): string | null =>
  /大盘|kpi|花费|roas|今天|今日/i.test(q) ? '今日大盘 KPI'
  : /国家|地区|花费分布/.test(q) ? '国家 / 地区分布'
  : /漏斗|链路|卡在|转化|付费/.test(q) ? '核心链路流失'
  : /剧目|内容/.test(q) ? '剧目 / 内容'
  : null;

export function LanbowBoard() {
  const [isDark, setIsDark] = React.useState(true);
  const [view, setView] = React.useState<'internal' | 'external'>('internal');
  const [cur, setCur] = React.useState('overview');
  const [tenant, setTenant] = React.useState('chenkai');
  const [prodId, setProdId] = React.useState('drama');
  const [hovNav, setHovNav] = React.useState<string | null>(null);
  const [msgs, setMsgs] = React.useState<Msg[]>([]);
  const [input, setInput] = React.useState('');
  const [mods, setMods] = React.useState<Mod[]>([]);
  const [chatOpen, setChatOpen] = React.useState(false);
  const [narrow, setNarrow] = React.useState(false);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [customBoard, setCustomBoard] = React.useState<string[]>([]); // labels pinned into a custom overview
  const idRef = React.useRef(0);

  React.useEffect(() => { applyTheme(isDark); }, [isDark]);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 1080px)');
    const on = () => setNarrow(mq.matches);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const products = PRODUCTS.filter(p => p.tenant === tenant);
  const product = PRODUCTS.find(p => p.id === prodId) || PRODUCTS[0];
  const navItems = NAV.filter(n => view === 'internal' || n.ext);
  // if current pane is internal-only and we switched to external, fall back
  React.useEffect(() => { if (view === 'external' && !NAV.find(n => n.id === cur)?.ext) setCur('overview'); }, [view, cur]);

  // global module-select: click a card ⊕ to add it as AI context
  const modCtx = React.useMemo(() => ({
    has: (id: string) => mods.some(x => x.id === id),
    toggle: (id: string, label: string) => setMods(m => m.some(x => x.id === id) ? m.filter(x => x.id !== id) : [...m, { id, label }]),
  }), [mods]);

  const send = (txt: string) => {
    const q = txt.trim();
    const attached = mods.map(m => m.label);
    if (!q && !attached.length) return;
    setInput('');
    const uid = ++idRef.current;
    setMsgs(m => [...m, { id: uid, role: 'user', text: q, mods: attached.length ? attached : undefined }]);
    setMods([]);
    setChatOpen(true);
    window.setTimeout(() => {
      let reply: Msg;
      const aid = ++idRef.current;
      if (isComposeIntent(q) || (attached.length >= 2 && /合成|看板|总览|组合/.test(q))) {
        reply = attached.length
          ? { id: aid, role: 'agent', text: `已为你合成自定义总览，含 ${attached.length} 个模块。可「应用为总览」固定到看板，或对任一模块继续追问。`, widget: { kind: 'compose', labels: attached } }
          : { id: aid, role: 'agent', text: '请先点任意模块右上角的 ⊕ 选择要纳入的模块，再说「生成自定义看板」。' };
      } else {
        const topic = dataTopic(q);
        reply = { id: aid, role: 'agent', text: boardReply(q, product, attached), widget: topic ? { kind: 'data', topic } : undefined };
      }
      setMsgs(m => [...m, reply]);
    }, 650);
  };

  const applyCustom = (labels: string[]) => { setCustomBoard(labels); setCur('overview'); setChatOpen(false); };

  const onTenant = (id: string) => { setTenant(id); const first = PRODUCTS.find(p => p.tenant === id); if (first) setProdId(first.id); };

  // filter controls (reused inline on wide screens, stacked in a dropdown on narrow)
  const tenantSel = (full?: boolean) => <select value={tenant} onChange={e => onTenant(e.target.value)} style={{ ...selStyle, ...(full ? { width: '100%', maxWidth: 'none' } : {}) }}>{TENANTS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}</select>;
  const prodSel = (full?: boolean) => <select value={prodId} onChange={e => setProdId(e.target.value)} style={{ ...selStyle, ...(full ? { width: '100%', maxWidth: 'none' } : {}) }}>{products.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}</select>;
  const windowChip = <span style={{ ...selStyle, fontWeight: 600 }}>单日 · 2026-06-23</span>;
  const acctChip = <span style={{ fontFamily: c.mono, fontSize: 11, fontWeight: 600, color: c.textPri, background: c.bgInput, border: `1px solid ${c.border}`, borderRadius: R.ctrl, padding: '3px 9px', whiteSpace: 'nowrap' }}>{product.accts || 0} / {product.tz || 'GMT'}</span>;
  const FILTERS: Array<[string, React.ReactNode, React.ReactNode]> = [
    ['租户', tenantSel(), tenantSel(true)],
    ['产品', prodSel(), prodSel(true)],
    ['窗口', windowChip, windowChip],
    ['账号', acctChip, acctChip],
  ];

  const modChips = mods.length > 0 ? (
    <div className="lb-pane" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginBottom: 8 }}>
      <span style={{ fontFamily: c.sans, fontSize: 10, color: c.textMute, textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: 2 }}>AI 上下文 · {mods.length}</span>
      {mods.map(m => (
        <span key={m.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: c.sans, fontSize: 11, color: c.accent, background: c.accentDim, border: `1px solid ${c.borderStrong}`, borderRadius: R.badge, padding: '3px 6px 3px 9px' }}>
          {m.label}
          <span onClick={() => modCtx.toggle(m.id, m.label)} title="移除" style={{ cursor: 'pointer', color: c.textMute, fontSize: 13, lineHeight: 1 }}>×</span>
        </span>
      ))}
      <button className="lb-btn" onClick={() => setMods([])} style={{ fontFamily: c.sans, fontSize: 10, color: c.textMute, background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px 4px' }}>清除</button>
    </div>
  ) : null;

  const inputBar = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 45, padding: 9, borderRadius: 6, boxSizing: 'border-box',
      background: isDark ? 'rgba(0,177,162,0.05)' : 'rgba(255,255,255,0.55)', border: `1px solid ${isDark ? 'rgba(60,73,72,0.5)' : 'rgba(28,46,56,0.08)'}`,
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', boxShadow: isDark ? '0px 25px 50px -12px rgba(0,0,0,0.25)' : '0px 16px 40px -12px rgba(20,40,55,0.12)' }}>
      <div style={{ flexShrink: 0, background: 'rgba(0,177,162,0.2)', border: `1px solid ${isDark ? 'rgba(60,73,72,0.3)' : 'rgba(28,46,56,0.06)'}`, borderRadius: 4, padding: '5px 7px' }}>
        <span style={{ fontFamily: c.sans, fontSize: 12, color: '#2ccdc2', letterSpacing: '-0.6px', lineHeight: '16px' }}>@ <span style={{ textTransform: 'capitalize' }}>lanbow</span></span>
      </div>
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(input); }}
        placeholder={mods.length ? '追问已选模块，或直接提问…' : 'launch all 74 ads now'} style={{ flex: 1, minWidth: 0, padding: '0 10px', background: 'transparent', border: 'none', outline: 'none', color: c.textPri, fontFamily: c.sans, fontSize: 14 }} />
      <span className="lb-ico" title="语音" style={{ flexShrink: 0, width: 16, height: 16, color: c.textMute, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        {I({ size: 16 }, <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M12 18v3" /></>)}
      </span>
      <button className="lb-btn" onClick={() => send(input)} title="发送" style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '9px 16px', borderRadius: 4, border: '1px solid rgba(44,205,194,0.4)', background: 'rgba(44,205,194,0.1)', color: '#2ccdc2', cursor: 'pointer' }}>
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round"><path d="M11 1v2.5A1.5 1.5 0 0 1 9.5 5H2" /><path d="M4.5 2.5 2 5l2.5 2.5" /></svg>
      </button>
    </div>
  );

  // a small data sub-card (used inside agent replies — interactive: ⊕ context + 追问)
  const dataChip = (label: string, body: React.ReactNode, follow: string[]) => (
    <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: R.card, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderBottom: `1px solid ${c.border}` }}>
        <span style={{ fontFamily: c.sans, fontSize: 11.5, fontWeight: 600, color: c.textPri }}>{label}</span>
        <button className="lb-modbtn" onClick={() => modCtx.toggle(`mod-${label}`, label)} title="加入 AI 上下文" style={{ width: 18, height: 18, borderRadius: R.badge, border: `1px solid ${c.border}`, background: 'transparent', color: c.textMute, cursor: 'pointer', fontSize: 12, lineHeight: 1 }}>⊕</button>
      </div>
      <div style={{ padding: 12 }}>{body}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '0 12px 12px' }}>
        {follow.map(f => <button key={f} className="lb-chip" onClick={() => send(`${f}「${label}」`)} style={{ fontFamily: c.sans, fontSize: 10.5, padding: '3px 9px', borderRadius: R.pill, border: `1px solid ${c.border}`, background: 'transparent', color: c.textSec, cursor: 'pointer' }}>{f}</button>)}
      </div>
    </div>
  );

  const widgetView = (w: Widget) => {
    if (w.kind === 'data') return <div style={{ marginTop: 8, maxWidth: 360 }}>{dataChip(w.topic, compactModule(w.topic, product), ['对比', '为什么', '怎么优化'])}</div>;
    // compose → custom board preview
    return (
      <div style={{ marginTop: 10, maxWidth: 380 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {w.labels.map(l => dataChip(l, compactModule(l, product), ['追问', '钉到看板']))}
        </div>
        <button className="lb-btn" onClick={() => applyCustom(w.labels)} style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: R.ctrl, border: 'none', background: c.accent, color: c.bgBase, cursor: 'pointer', fontFamily: c.sans, fontSize: 12, fontWeight: 600 }}>
          {I({ size: 14 }, <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></>)}
          应用为自定义总览
        </button>
      </div>
    );
  };

  const bubble = (m: Msg) => m.role === 'user' ? (
    <div key={m.id} style={{ alignSelf: 'flex-end', maxWidth: '90%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
      {m.mods && m.mods.length > 0 && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'flex-end' }}>{m.mods.map(t => <span key={t} style={{ fontFamily: c.sans, fontSize: 10, color: c.accent, background: c.accentDim, border: `1px solid ${c.borderStrong}`, borderRadius: R.badge, padding: '2px 7px' }}>{t}</span>)}</div>}
      {m.text && <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: '12px 12px 4px 12px', padding: '9px 13px', fontFamily: c.sans, fontSize: 12.5, color: c.textPri }}>{m.text}</div>}
    </div>
  ) : (
    <div key={m.id} style={{ alignSelf: 'flex-start', maxWidth: '100%' }}>
      <div style={{ borderLeft: `3px solid ${c.accent}`, paddingLeft: 11, color: c.textSec, fontSize: 12.5, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{m.text}</div>
      {m.widget && widgetView(m.widget)}
    </div>
  );

  return (
    <ModContext.Provider value={modCtx}>
    <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gridTemplateRows: '56px 1fr', height: '100vh', overflow: 'hidden',
      background: `radial-gradient(1100px 420px at 78% -12%, ${c.accentDim}, transparent 62%), ${c.bgBase}`, color: c.textPri, fontFamily: c.sans, fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>
      <style>{`
        .lb-main::-webkit-scrollbar{width:8px}.lb-main::-webkit-scrollbar-thumb{background:var(--c-border-strong);border-radius:4px}.lb-main::-webkit-scrollbar-track{background:transparent}
        .lbn input::placeholder{color:var(--c-text-mute)}
        .lb-card{transition:border-color .16s,transform .16s,box-shadow .16s}
        .lb-card:hover{border-color:var(--c-border-strong);transform:translateY(-1px);box-shadow:0 8px 24px var(--c-shadow-color)}
        .lb-nav{transition:background .15s,color .15s}
        .lb-nav:hover{background:var(--c-accent-dim);color:var(--c-text-pri)}
        .lb-chip{transition:border-color .14s,color .14s,background .14s}
        .lb-chip:hover{border-color:var(--c-border-strong);color:var(--c-accent);background:var(--c-accent-dim)}
        .lb-btn{transition:filter .14s,transform .12s}.lb-btn:hover{filter:brightness(1.08)}.lb-btn:active{transform:translateY(1px)}
        .lb-row{transition:background .12s}.lb-row:hover{background:var(--c-bg-input)}
        .lb-ico{transition:border-color .15s,color .15s,background .15s}.lb-ico:hover{border-color:var(--c-border-strong);color:var(--c-text-pri)}
        .lb-modbtn{transition:border-color .14s,color .14s,background .14s}.lb-modbtn:hover{border-color:var(--c-border-strong);color:var(--c-accent)}
        .lb-pane{animation:lbFade .3s cubic-bezier(.2,.7,.2,1)}
        @keyframes lbFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        .lb-companion{animation:lbSlide .3s cubic-bezier(.2,.7,.2,1)}
        @keyframes lbSlide{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:none}}
        .lb-bar{transition:width .55s cubic-bezier(.2,.7,.2,1)}
        select:focus,input:focus{outline:none}
      `}</style>

      {/* ── Sidebar ── */}
      <nav style={{ gridColumn: 1, gridRow: 2, background: 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 0', gap: 6, zIndex: 20 }}>
        {navItems.map((n, i) => {
          const on = n.id === 'chat' ? chatOpen : n.id === cur, prevGrp = i > 0 ? navItems[i - 1].grp : n.grp;
          const Ico = ICON[n.id] || ICON.overview;
          return (
            <React.Fragment key={n.id}>
              {n.grp !== prevGrp && <div style={{ width: 26, height: 1, background: c.border, margin: '6px 0' }} />}
              <button className={on ? undefined : 'lb-nav'} onClick={() => n.id === 'chat' ? setChatOpen(o => !o) : setCur(n.id)} onMouseEnter={() => setHovNav(n.id)} onMouseLeave={() => setHovNav(null)}
                style={{ width: 42, height: 42, borderRadius: R.nav, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: on ? c.accentDim : 'transparent', color: on ? c.accent : c.textSec }}>
                <Ico size={20} />
                {n.id === 'alerts' && product.alerts.length > 0 && <span style={{ position: 'absolute', top: 6, right: 6, width: 5, height: 5, borderRadius: '50%', background: WARN }} />}
                {hovNav === n.id && <span style={{ position: 'absolute', left: 50, whiteSpace: 'nowrap', background: c.bgElevated, border: `1px solid ${c.borderStrong}`, color: c.textPri, padding: '4px 10px', borderRadius: R.ctrl, fontSize: 11, zIndex: 50, boxShadow: `0 6px 20px ${c.shadowColor}` }}>{n.label} · {n.en}{!n.ext ? ' · 内部' : ''}</span>}
              </button>
            </React.Fragment>
          );
        })}
      </nav>

      {/* ── Topbar ── */}
      <header style={{ gridColumn: '1 / 3', gridRow: 1, background: 'transparent', display: 'flex', alignItems: 'center', padding: '0 22px', gap: 14, zIndex: 20 }}>
        <img src={isDark ? '/lanbow-logo-light.png' : '/lanbow-logo-dark.png'} alt="LANBOW" style={{ height: 16, width: 'auto', display: 'block', flexShrink: 0 }} />
        {!narrow && <span style={{ fontFamily: c.sans, fontSize: 10.5, color: c.textSec, letterSpacing: '0.05em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0, flexShrink: 1 }}>Growth Decision System · v1.2</span>}
        <div style={{ flex: 1, minWidth: 8 }} />

        {narrow ? (
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <button className="lb-ico" onClick={() => setFiltersOpen(o => !o)} title="筛选" style={{ display: 'flex', alignItems: 'center', gap: 7, height: 30, padding: '0 10px', borderRadius: R.ctrl, border: `1px solid ${c.border}`, background: c.bgInput, color: c.textSec, cursor: 'pointer' }}>
              {I({ size: 15 }, <><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /><circle cx="9" cy="6" r="2" fill="currentColor" stroke="none" /><circle cx="15" cy="12" r="2" fill="currentColor" stroke="none" /><circle cx="8" cy="18" r="2" fill="currentColor" stroke="none" /></>)}
              <span style={{ fontFamily: c.mono, fontSize: 11, fontWeight: 600, color: c.textPri, maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.label}</span>
            </button>
            {filtersOpen && <>
              <div onClick={() => setFiltersOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 49 }} />
              <div className="lb-pane" style={{ position: 'absolute', top: 38, right: 0, zIndex: 50, width: 256, padding: 14, borderRadius: R.ctrl, background: c.bgElevated, border: `1px solid ${c.borderStrong}`, boxShadow: `0 12px 40px ${c.shadowColor}`, backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {FILTERS.map(([label, , full]) => (
                  <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <span style={fltL}>{label}</span>
                    {full}
                  </div>
                ))}
              </div>
            </>}
          </div>
        ) : FILTERS.map(([label, inline]) => (
          <div key={label} style={fltGroup}><span style={fltL}>{label}</span>{inline}</div>
        ))}

        <div style={{ display: 'flex', flexShrink: 0, background: c.bgInput, border: `1px solid ${c.border}`, borderRadius: R.nav, padding: 2 }}>
          <button style={segBtn(view === 'internal')} onClick={() => setView('internal')}>内部</button>
          <button style={segBtn(view === 'external')} onClick={() => setView('external')}>对外</button>
        </div>
        <button className="lb-ico" onClick={() => setIsDark(d => !d)} title="切换主题" style={{ width: 32, height: 32, borderRadius: R.nav, border: `1px solid ${c.border}`, background: 'transparent', color: c.textSec, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isDark ? I({ size: 15 }, <><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></>) : I({ size: 15 }, <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />)}
        </button>
        <div style={{ width: 34, height: 34, borderRadius: '50%', border: `1px solid ${c.borderStrong}`, background: 'linear-gradient(135deg,#1a4a35,#0d2418)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: c.mono, color: c.accent, fontSize: 13 }}>K</div>
      </header>

      {/* ── Main ── */}
      <main className="lb-main" style={{ gridColumn: 2, gridRow: 2, overflowY: 'auto', padding: '22px 26px 150px' }}>
        <div className="lb-pane" key={`${cur}-${prodId}`}><Pane cur={cur} product={product} view={view} msgs={msgs} customBoard={customBoard} onClearCustom={() => setCustomBoard([])} /></div>
      </main>

      {/* ── Centered input bar (entry point, when companion panel is closed) ── */}
      {!chatOpen && <>
        <div style={{ position: 'fixed', left: 60, right: 0, bottom: 0, height: 170, zIndex: 30, pointerEvents: 'none',
          background: `linear-gradient(to top, ${c.bgBase} 0%, ${c.bgBase} 40%, transparent 100%)` }} />
        <div className="lbn" style={{ position: 'fixed', left: 'calc(60px + (100vw - 60px)/2)', transform: 'translateX(-50%)', bottom: 40, width: 'min(984px, calc(100vw - 120px))', zIndex: 40 }}>
          {modChips}
          {inputBar}
        </div>
      </>}

      {/* ── AI Companion panel (right, gradient) — shown when conversation is open ── */}
      {chatOpen && (
        <aside className="lb-companion" style={{ position: 'fixed', top: 56, right: 0, bottom: 0, width: 'min(560px, 50vw)', zIndex: 45,
          display: 'flex', flexDirection: 'column', paddingLeft: 150,
          background: `radial-gradient(620px 380px at 92% -6%, ${c.accentDim}, transparent 58%), linear-gradient(to right, transparent 0px, ${c.bgPanel} 150px)`,
          backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0px, #000 130px)', maskImage: 'linear-gradient(to right, transparent 0px, #000 130px)' }}>
          {/* header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: c.accent, display: 'flex' }}>{ICON.chat({ size: 17 })}</span>
              <span style={{ fontFamily: c.sans, fontSize: 13, fontWeight: 600, color: c.textPri }}>AI 对话</span>
              <span style={{ fontFamily: c.sans, fontSize: 10, color: c.textMute }}>Lanbow · {product.label}</span>
            </div>
            <button className="lb-ico" onClick={() => setChatOpen(false)} title="收起" style={{ width: 28, height: 28, borderRadius: R.nav, border: `1px solid ${c.border}`, background: 'transparent', color: c.textMute, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {I({ size: 15 }, <path d="M18 6 6 18M6 6l12 12" />)}
            </button>
          </div>
          {/* messages */}
          <div className="lb-main" style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '8px 18px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {msgs.length === 0 && <div style={{ color: c.textMute, fontSize: 12, lineHeight: 1.7, paddingTop: 6 }}>点击任意模块右上角的 ⊕ 加入 AI 上下文，再在下方提问；或直接输入问题。</div>}
            {msgs.map(bubble)}
          </div>
          {/* suggested follow-ups */}
          <div style={{ padding: '6px 18px 0' }}>
            <div style={{ fontFamily: c.sans, fontSize: 10, color: c.textMute, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Suggested follow-ups</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SUGGESTIONS.slice(0, 3).map((s, i) => (
                <button key={s} className="lb-card" onClick={() => send(s)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, textAlign: 'left', padding: '9px 12px', borderRadius: R.card, border: `1px solid ${c.border}`, background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.5)', color: c.textPri, cursor: 'pointer', fontFamily: c.sans, fontSize: 12 }}>
                  <span>{s}</span>
                  <span style={{ fontFamily: c.sans, fontSize: 10, color: c.textMute, width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: R.badge, background: c.bgInput, flexShrink: 0 }}>{i + 1}</span>
                </button>
              ))}
            </div>
          </div>
          {/* input */}
          <div style={{ padding: '12px 18px 16px' }}>
            {modChips}
            {inputBar}
          </div>
        </aside>
      )}
    </div>
    </ModContext.Provider>
  );
}

// ── Panes ──
function PaneHeader({ zh, en, sub, badge }: { zh: string; en: string; sub?: string; badge?: boolean }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>{zh}</h2>
        <span style={{ fontFamily: c.mono, fontSize: 10.5, color: c.textMute, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{en}</span>
        {badge && <span style={{ fontFamily: c.mono, fontSize: 8.5, color: WARN, border: `1px solid ${WARN}`, borderRadius: R.badge, padding: '1px 6px', letterSpacing: '0.08em' }}>DEMO 数据模拟放大 30×</span>}
      </div>
      {sub && <div style={{ color: c.textSec, fontSize: 11.5, fontFamily: c.mono }}>{sub}</div>}
    </div>
  );
}

const Placeholder = ({ zh, en, note }: { zh: string; en: string; note: string }) => (
  <><PaneHeader zh={zh} en={en} /><Card title={`${zh}（AI 待生成）`}><div style={{ color: c.textMute, fontSize: 12, padding: '24px 4px', lineHeight: 1.8 }}>{note}</div></Card></>
);

function Pane({ cur, product, view, msgs, customBoard, onClearCustom }: { cur: string; product: Product; view: 'internal' | 'external'; msgs: Msg[]; customBoard: string[]; onClearCustom: () => void }) {
  if (cur === 'overview') {
    const ano = anomalies(product);
    return (
      <>
        <PaneHeader zh="总览" en="Overview" badge sub={`${product.label} · 2026-06-23 · ${product.tz || 'GMT'} · ${product.kpiSrc}`} />
        {/* asset health */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <span style={{ fontFamily: c.mono, fontSize: 10, color: c.textLabel, alignSelf: 'center', textTransform: 'uppercase' }}>资产健康度</span>
          {ASSET_HEALTH.map(a => <span key={a} style={{ fontFamily: c.mono, fontSize: 10, padding: '3px 9px', borderRadius: R.chip, background: c.accentDim, color: c.accent, border: `1px solid ${c.borderStrong}` }}>● {a}</span>)}
        </div>

        {/* custom board (composed via chat) */}
        {customBoard.length > 0 && (
          <div style={{ marginBottom: 16, border: `1px solid ${c.borderStrong}`, borderRadius: R.card, overflow: 'hidden', background: `radial-gradient(600px 240px at 92% -20%, ${c.accentDim}, transparent 60%), ${c.bgCard}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `1px solid ${c.border}` }}>
              <span style={{ fontWeight: 600, fontSize: 13, color: c.textPri }}>自定义总览 <span style={{ fontFamily: c.mono, fontSize: 10, color: c.textMute }}>· {customBoard.length} 模块 · 由对话生成</span></span>
              <button className="lb-btn" onClick={onClearCustom} style={{ fontFamily: c.sans, fontSize: 11, color: c.textMute, background: 'transparent', border: `1px solid ${c.border}`, borderRadius: R.badge, padding: '3px 10px', cursor: 'pointer' }}>清除</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: customBoard.length === 1 ? '1fr' : '1fr 1fr', gap: 14, padding: 16 }}>
              {customBoard.map((l, i) => (
                <div key={i} style={{ background: c.bgPanel, border: `1px solid ${c.border}`, borderRadius: R.card, padding: 14 }}>
                  <div style={{ fontFamily: c.sans, fontSize: 12, fontWeight: 600, color: c.textPri, marginBottom: 10 }}>{l}</div>
                  {compactModule(l, product)}
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <Card title="今日大盘 KPI" src={product.kpiSrc} span={2}><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{product.kpis.map((k, i) => <KpiCell key={i} k={k} />)}</div></Card>
          <Card title={`核心链路流失 · ${product.funnel.length} 节点`} src="广告→落地→注册→首集→付费"><Funnel nodes={product.funnel} /></Card>
          <Card title="异常流失分析 · 诊断 + 建议" src="strategy-engine">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {ano.length === 0 && <div style={{ color: c.textMute, fontSize: 12 }}>各段流失在阈值内。</div>}
              {ano.map((a, i) => (
                <div key={i} style={{ borderLeft: `3px solid ${a.lv === 'crit' ? CRIT : WARN}`, paddingLeft: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontFamily: c.mono, fontSize: 26, fontWeight: 600, color: a.lv === 'crit' ? CRIT : WARN }}>{a.pct}</span>
                    <span style={{ fontWeight: 600, fontSize: 12.5 }}>{a.from} → {a.to}</span>
                  </div>
                  <div style={{ fontFamily: c.mono, fontSize: 11, color: c.textMute, marginTop: 2 }}>{a.people}</div>
                  <div style={{ fontSize: 11, color: c.textSec, marginTop: 4 }}>分析 该段流失显著，具体待归因于 strategy-engine。建议 待 AI 生成建议。</div>
                </div>
              ))}
            </div>
          </Card>
          <Card title="国家 / 地区分布" src="cf_stream ⋈ roi"><GeoCard product={product} /></Card>
          <Card title="剧目 / 内容 Top" src="content"><SeriesTable product={product} /></Card>
        </div>
        {/* extended module styles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginTop: 14 }}>
          <Card title="趋势 · Trend" src="series"><TrendCard p={product} /></Card>
          <Card title="构成 · Mix" src="channels"><ChannelMix /></Card>
          <Card title="完成度 · Goal" src="roas target"><CompletionRing p={product} /></Card>
        </div>
      </>
    );
  }
  if (cur === 'content') return <><PaneHeader zh="剧目" en="Content" sub={`${product.label} · 内容表现`} /><Card title="剧目表现"><SeriesTable product={product} /></Card></>;
  if (cur === 'delivery') return <><PaneHeader zh="投放" en="Delivery" sub={`${product.label} · 计划/活动`} /><Card title="在投计划">{product.plans.length ? <PlansTable product={product} /> : <div style={{ color: c.textMute, fontSize: 12, padding: '20px 4px' }}>{product.label} 当前无在投计划（{product.kpiSrc}）。</div>}</Card></>;
  if (cur === 'accounts') return <><PaneHeader zh="账号" en="Accounts" sub={`${product.label} · 渠道/支付/归因授权`} /><Card title="账号 & 授权"><AccountsTable product={product} /></Card></>;
  if (cur === 'research') return <><PaneHeader zh="产品调研" en="Research" sub={`${product.label} · 市场/竞品/洞察`} /><div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{product.research.length ? product.research.map((r, i) => (
    <Card key={i} title={r.t} src={r.src}><div style={{ fontFamily: c.mono, fontSize: 10, color: c.textMute, marginBottom: 6 }}>{r.meta}</div><div style={{ fontSize: 12, color: c.textSec, lineHeight: 1.7 }}>{r.desc}</div></Card>
  )) : <Card title="产品调研（AI 待生成）"><div style={{ color: c.textMute, fontSize: 12, padding: '20px 4px' }}>暂无调研记录。</div></Card>}</div></>;
  if (cur === 'chat') return (
    <div style={{ width: 'min(984px, calc(100vw - 120px))', margin: '0 auto' }}>
      <PaneHeader zh="对话" en="Chat" sub={`@Lanbow · 基于 ${product.label} envelope 数据`} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {msgs.length === 0 && <div style={{ color: c.textMute, fontSize: 12 }}>点击任意模块右上角的 ⊕ 加入 AI 上下文，再在下方提问；或直接输入问题。</div>}
        {msgs.map(m => m.role === 'user'
          ? <div key={m.id} style={{ alignSelf: 'flex-end', maxWidth: 520, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
              {m.mods && m.mods.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'flex-end' }}>
                  {m.mods.map(t => <span key={t} style={{ fontFamily: c.sans, fontSize: 10, color: c.accent, background: c.accentDim, border: `1px solid ${c.borderStrong}`, borderRadius: R.badge, padding: '2px 7px' }}>{t}</span>)}
                </div>
              )}
              {m.text && <div style={{ background: c.bgCard, border: `1px solid ${c.border}`, borderRadius: '10px 10px 3px 10px', padding: '10px 14px', fontFamily: c.sans, fontSize: 12.5 }}>{m.text}</div>}
            </div>
          : <div key={m.id} style={{ alignSelf: 'flex-start', maxWidth: 620, borderLeft: `3px solid ${c.accent}`, paddingLeft: 12, color: c.textSec, fontSize: 12.5, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{m.text}</div>)}
      </div>
    </div>
  );
  if (cur === 'alerts') return (
    <><PaneHeader zh="告警" en="Alerts" sub={`${product.label} · 阈值告警 / alerts-router`} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Card title="活跃告警" src="alerts-router">
          {product.alerts.length ? <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {product.alerts.map((a, i) => (
              <div key={i} style={{ borderLeft: `3px solid ${a.lv === 'crit' ? CRIT : a.lv === 'warn' ? WARN : c.blue}`, paddingLeft: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}><span style={{ fontWeight: 600, fontSize: 12.5, color: c.textPri }}>{a.t}</span><span style={{ fontFamily: c.mono, fontSize: 10, color: c.textMute }}>{a.time}</span></div>
                <div style={{ fontSize: 11.5, color: c.textSec, marginTop: 3, lineHeight: 1.6 }}>{a.d}</div>
              </div>))}
          </div> : <div style={{ color: c.textMute, fontSize: 12, padding: '16px 4px' }}>当前无活跃告警。</div>}
        </Card>
        <Card title="阈值 / Thresholds" src="brief"><ThreshTable rows={product.thresholds} /></Card>
      </div></>
  );
  if (cur === 'reports') {
    const ano = anomalies(product);
    return (<><PaneHeader zh="报告" en="Reports" sub={`${product.label} · 日报 / 周报（envelope → project-report）`} />
      <div style={{ marginBottom: 14 }}>
        <button className="lb-btn" onClick={() => downloadDramaReport()} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '9px 16px', borderRadius: R.ctrl, border: `1px solid ${c.borderStrong}`, background: c.accentDim, color: c.accent, cursor: 'pointer', fontFamily: c.sans, fontSize: 12.5, fontWeight: 600 }}>
          {I({ size: 15 }, <><path d="M12 3v12" /><path d="m7 11 5 4 5-4" /><path d="M5 21h14" /></>)}
          下载投放复盘报告 · W20
          <span style={{ fontFamily: c.sans, fontSize: 10, color: c.textMute, fontWeight: 400 }}>.html · 跟随当前主题</span>
        </button>
      </div>
      <Card title={`${product.label} 日报 · 2026-06-23`} src="project-report">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 12.5, color: c.textSec, lineHeight: 1.7 }}>
          <div><b style={{ color: c.textPri }}>大盘</b><div style={{ marginTop: 4 }}>{product.kpis.slice(0, 4).map(k => `${k.l} ${k.v}`).join(' · ')}</div></div>
          <div><b style={{ color: c.textPri }}>核心链路</b><div style={{ marginTop: 4 }}>{product.funnel.length} 节点；{ano.length ? `异常段 ${ano.map(a => `${a.from}→${a.to} ${a.pct}`).join('、')}` : '各段在阈值内'}。</div></div>
          <div><b style={{ color: c.textPri }}>来源</b><div style={{ marginTop: 4, fontFamily: c.mono, fontSize: 11 }}>{product.kpiSrc}</div></div>
          <div><b style={{ color: c.textPri }}>建议</b><div style={{ marginTop: 4 }}>待 strategy-engine 生成 actions / proposals（示例）。</div></div>
        </div>
      </Card></>);
  }
  if (cur === 'automation') return (
    <><PaneHeader zh="自动化" en="Automation" sub={`${product.label} · 规则 / 采纳闭环`} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Card title="自动化规则" src="strategy-engine">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {product.rules.map((r, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 0', borderBottom: i < product.rules.length - 1 ? `1px solid ${c.border}` : 'none' }}>
                <div><div style={{ fontWeight: 600, fontSize: 12.5, color: c.textPri }}>{r.name}</div><div style={{ fontFamily: c.mono, fontSize: 10.5, color: c.textMute, marginTop: 2 }}>{r.cond} → {r.act}</div></div>
                <span style={{ fontFamily: c.mono, fontSize: 10, padding: '2px 8px', borderRadius: R.badge, background: r.on ? c.accentDim : c.bgInput, color: r.on ? c.accent : c.textMute, border: `1px solid ${r.on ? c.borderStrong : c.border}` }}>{r.on ? 'ON' : 'OFF'}</span>
              </div>))}
          </div>
        </Card>
        <Card title="阈值 / Thresholds" src="brief"><ThreshTable rows={product.thresholds} /></Card>
      </div></>
  );
  if (cur === 'analysis') return (
    <><PaneHeader zh="数据分析" en="Analysis" sub={`${product.label} · 数据链路 / 多维下钻`} />
      <Card title="数据链路 · mcp-flow" src="channels → envelope → outputs"><DataLink /></Card>
      <div style={{ height: 14 }} />
      <Card title="国家 / 地区分布" src="cf_stream ⋈ roi"><GeoCard product={product} /></Card></>
  );
  if (cur === 'budget') return (
    <><PaneHeader zh="预算" en="Budget" sub={`${product.label} · 计划预算分配`} />
      <Card title="预算分配">{product.plans.length ? <PlansTable product={product} /> : <div style={{ color: c.textMute, fontSize: 12, padding: '16px 4px' }}>当前无在投计划预算（{product.kpiSrc}）。</div>}</Card></>
  );
  return <Placeholder zh="素材" en="Creative" note="素材库与三阶段（原片→混剪→二创）表现分析将由 AI 生成。" />;
}

function GeoCard({ product }: { product: Product }) {
  const rows = product.geo, max = Math.max(1, ...rows.map(g => g.spend));
  if (!rows.some(g => g.spend > 0)) return <div style={{ color: c.textMute, fontSize: 12, padding: '8px 4px' }}>各国家 / 地区消耗暂为 0（{product.kpiSrc}）。</div>;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {rows.map((g, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '130px 1fr 96px', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: c.mono, fontSize: 11, color: c.textSec, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.c} · {g.label}</span>
          <div style={{ height: 8, background: c.bgInput, borderRadius: R.bar, overflow: 'hidden' }}><div className="lb-bar" style={{ width: `${(g.spend / max) * 100}%`, height: '100%', background: c.accent, borderRadius: R.bar }} /></div>
          <span style={{ fontFamily: c.mono, fontSize: 11, color: c.textPri, textAlign: 'right' }}>{g.spend}{g.roas > 0 ? ` · ${g.roas}×` : ''}</span>
        </div>
      ))}
    </div>
  );
}

function ThreshTable({ rows }: { rows: [string, string, string][] }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <tbody>{rows.map((r, i) => (
        <tr key={i} className="lb-row"><td style={{ ...td, color: c.textSec }}>{r[0]}</td><td style={{ ...td, color: c.textPri, fontWeight: 600 }}>{r[1]}</td><td style={{ ...td, textAlign: 'right', color: c.textMute, fontSize: 9.5 }}>{r[2]}</td></tr>
      ))}</tbody>
    </table>
  );
}

function DataLink() {
  const colColor: Record<string, string> = { SOURCES: c.blue, ENGINE: c.accent, TRUTH: c.green, CONSUMERS: c.accentMid, OUTPUTS: c.textSec };
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 10, overflowX: 'auto' }}>
      {DATA_LINK.cols.map((col, ci) => (
        <React.Fragment key={col.title}>
          <div style={{ flex: 1, minWidth: 124 }}>
            <div style={{ fontFamily: c.mono, fontSize: 9.5, color: c.textMute, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{col.title}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {col.items.map(it => (
                <div key={it} style={{ fontFamily: c.mono, fontSize: 11, color: c.textSec, padding: '7px 9px', background: c.bgInput, border: `1px solid ${c.border}`, borderRadius: R.ctrl, borderLeft: `2px solid ${colColor[col.title] || c.accent}` }}>{it}</div>
              ))}
            </div>
          </div>
          {ci < DATA_LINK.cols.length - 1 && <div style={{ display: 'flex', alignItems: 'center', color: c.textMute, paddingTop: 22 }}>→</div>}
        </React.Fragment>
      ))}
    </div>
  );
}

const th: React.CSSProperties = { fontFamily: c.mono, fontSize: 9.5, color: c.textMute, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left', padding: '8px 10px', borderBottom: `1px solid ${c.border}` };
const td: React.CSSProperties = { fontFamily: c.mono, fontSize: 11.5, color: c.textSec, padding: '9px 10px', borderBottom: `1px solid ${c.border}` };
const stColor = (s: string) => s === 'good' || s === '放量' ? c.green : s === 'warn' || s === '观察' ? WARN : s === '建议关停' || s === '警戒' ? CRIT : c.textSec;

function SeriesTable({ product }: { product: Product }) {
  if (!product.series.length) return <div style={{ color: c.textMute, fontSize: 12, padding: '12px 4px' }}>暂无内容数据。</div>;
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead><tr><th style={th}>剧目 / 内容</th><th style={{ ...th, textAlign: 'right' }}>会话</th><th style={{ ...th, textAlign: 'right' }}>完播%</th><th style={{ ...th, textAlign: 'right' }}>付费</th><th style={{ ...th, textAlign: 'right' }}>ROAS</th><th style={{ ...th, textAlign: 'right' }}>状态</th></tr></thead>
      <tbody>{product.series.map((s, i) => (
        <tr key={i} className="lb-row"><td style={{ ...td, color: c.textPri, maxWidth: 280, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.t}</td>
          <td style={{ ...td, textAlign: 'right' }}>{s.sess}</td><td style={{ ...td, textAlign: 'right' }}>{s.play}%</td><td style={{ ...td, textAlign: 'right' }}>{s.paid}</td>
          <td style={{ ...td, textAlign: 'right', color: s.roas >= 1 ? c.green : c.textSec }}>{s.roas.toFixed(2)}×</td>
          <td style={{ ...td, textAlign: 'right', color: stColor(s.st) }}>{s.st === 'good' ? '健康' : s.st === 'warn' ? '观察' : s.st}</td></tr>
      ))}</tbody>
    </table>
  );
}
function PlansTable({ product }: { product: Product }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead><tr><th style={th}>计划 / 活动</th><th style={{ ...th, textAlign: 'right' }}>花费</th><th style={{ ...th, textAlign: 'right' }}>曝光</th><th style={{ ...th, textAlign: 'right' }}>CTR</th><th style={{ ...th, textAlign: 'right' }}>CPM</th><th style={{ ...th, textAlign: 'right' }}>ROI</th><th style={{ ...th, textAlign: 'right' }}>状态</th></tr></thead>
      <tbody>{product.plans.map((p, i) => (
        <tr key={i} className="lb-row"><td style={{ ...td, color: c.textPri }}>{p.camp}</td><td style={{ ...td, textAlign: 'right' }}>{p.spend}</td><td style={{ ...td, textAlign: 'right' }}>{p.imp.toLocaleString()}</td>
          <td style={{ ...td, textAlign: 'right' }}>{p.ctr}%</td><td style={{ ...td, textAlign: 'right' }}>{p.cpm}</td><td style={{ ...td, textAlign: 'right', color: p.roi >= 1 ? c.green : CRIT }}>{p.roi}×</td>
          <td style={{ ...td, textAlign: 'right', color: stColor(p.st) }}>{p.st}</td></tr>
      ))}</tbody>
    </table>
  );
}
function AccountsTable({ product }: { product: Product }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead><tr><th style={th}>平台</th><th style={th}>名称 / ID</th><th style={th}>类型</th><th style={th}>状态</th><th style={{ ...th, textAlign: 'right' }}>余额</th><th style={{ ...th, textAlign: 'right' }}>同步</th></tr></thead>
      <tbody>{product.accounts.map((a, i) => (
        <tr key={i} className="lb-row"><td style={{ ...td, color: c.accent }}>{a.plat}</td>
          <td style={{ ...td, color: c.textPri }}>{a.name}{a.aid && <span style={{ color: c.textMute }}> · {a.aid}</span>}</td>
          <td style={td}>{a.kind}</td><td style={{ ...td, color: a.st === 'ok' ? c.green : WARN }}>● {a.stx}</td>
          <td style={{ ...td, textAlign: 'right' }}>{a.bal}</td><td style={{ ...td, textAlign: 'right', color: c.textMute }}>{a.sync}</td></tr>
      ))}</tbody>
    </table>
  );
}

export default LanbowBoard;
