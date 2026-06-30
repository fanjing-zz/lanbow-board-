import React from 'react';
import { c, R } from './theme2';
import { Product } from './boardData';

const WARN = '#FFB800', CRIT = '#FF4466', TEAL = '#2ccdc2';
const seed = (n: number) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
const lbl = (children: React.ReactNode) => <div style={{ fontFamily: c.mono, fontSize: 9.5, color: c.textMute, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{children}</div>;

// ── Sparkline (trend line + soft area) ──────────────────────────────────────────
export function Spark({ data, color = TEAL, h = 40 }: { data: number[]; color?: string; h?: number }) {
  const W = 120, min = Math.min(...data), max = Math.max(...data), rng = (max - min) || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * W, h - 4 - ((v - min) / rng) * (h - 8)]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${W},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${h}`} preserveAspectRatio="none" style={{ width: '100%', height: h, display: 'block' }}>
      <defs><linearGradient id={`sg${color}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} stopOpacity="0.22" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      <path d={area} fill={`url(#sg${color})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

// ── Mini bars ───────────────────────────────────────────────────────────────────
export function MiniBars({ data, color = TEAL, h = 44 }: { data: number[]; color?: string; h?: number }) {
  const max = Math.max(...data, 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: h }}>
      {data.map((v, i) => <div key={i} style={{ flex: 1, height: `${(v / max) * 100}%`, borderRadius: `${R.card}px ${R.card}px 0 0`, background: `linear-gradient(180deg, ${color}, ${color}33)` }} />)}
    </div>
  );
}

// ── Ring / donut ────────────────────────────────────────────────────────────────
export function Ring({ pct, label, sub, color = TEAL, size = 96 }: { pct: number; label: string; sub?: string; color?: string; size?: number }) {
  const r = size / 2 - 7, circ = 2 * Math.PI * r, off = circ * (1 - Math.max(0, Math.min(100, pct)) / 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <svg width={size} height={size} style={{ flexShrink: 0, transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={c.bgInput} strokeWidth="7" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off} style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.2,.7,.2,1)' }} />
      </svg>
      <div>
        <div style={{ fontFamily: c.mono, fontSize: 26, fontWeight: 600, color: c.textPri, lineHeight: 1 }}>{pct.toFixed(pct % 1 ? 1 : 0)}<span style={{ fontSize: 14, color: c.textMute }}>%</span></div>
        <div style={{ fontFamily: c.mono, fontSize: 10, color: c.textMute, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 6 }}>{label}</div>
        {sub && <div style={{ fontFamily: c.sans, fontSize: 11, color: c.textSec, marginTop: 3 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ── Stacked composition bar + legend ─────────────────────────────────────────────
export function StackBar({ parts }: { parts: Array<{ label: string; val: number; color: string }> }) {
  const total = parts.reduce((s, p) => s + p.val, 0) || 1;
  return (
    <div>
      <div style={{ display: 'flex', height: 12, borderRadius: R.bar, overflow: 'hidden', background: c.bgInput }}>
        {parts.map((p, i) => <div key={i} title={p.label} style={{ width: `${(p.val / total) * 100}%`, background: p.color }} />)}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 16px', marginTop: 12 }}>
        {parts.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 8, height: 8, borderRadius: R.card, background: p.color }} />
            <span style={{ fontFamily: c.sans, fontSize: 11, color: c.textSec }}>{p.label}</span>
            <span style={{ fontFamily: c.mono, fontSize: 11, color: c.textPri }}>{Math.round((p.val / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Stat tile (compact KPI) ──────────────────────────────────────────────────────
export function StatTile({ label, value, delta, dcls }: { label: string; value: string; delta?: string; dcls?: 'up' | 'down' }) {
  const col = dcls === 'up' ? c.green : dcls === 'down' ? CRIT : c.textMute;
  const arrow = dcls === 'up' ? '▲' : dcls === 'down' ? '▼' : '';
  return (
    <div style={{ padding: '10px 12px', background: c.bgInput, border: `1px solid ${c.border}`, borderRadius: R.ctrl }}>
      <div style={{ fontFamily: c.mono, fontSize: 9, color: c.textMute, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontFamily: c.mono, fontSize: 18, fontWeight: 600, color: c.textPri, marginTop: 5 }}>{value}</div>
      {delta && <div style={{ fontFamily: c.mono, fontSize: 9.5, color: col, marginTop: 3 }}>{arrow} {delta.replace(/^[▲▼]\s*/, '')}</div>}
    </div>
  );
}

// ── Ranked rows (bars) ───────────────────────────────────────────────────────────
export function RankRows({ rows }: { rows: Array<{ name: string; val: string; pct: number; color?: string }> }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {rows.map((r, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 60px', alignItems: 'center', gap: 10 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontFamily: c.mono, fontSize: 11, color: c.textSec, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</span>
            </div>
            <div style={{ height: 6, background: c.bgInput, borderRadius: R.bar, overflow: 'hidden' }}>
              <div className="lb-bar" style={{ width: `${Math.max(2, r.pct)}%`, height: '100%', background: r.color || c.accent, borderRadius: R.bar }} />
            </div>
          </div>
          <span style={{ fontFamily: c.mono, fontSize: 11, color: c.textPri, textAlign: 'right' }}>{r.val}</span>
        </div>
      ))}
    </div>
  );
}

// ── Compact module renderer (used by chat replies & custom board) ────────────────
// Maps a selected module's label → a compact data visualization from the product data.
export function compactModule(label: string, p: Product): React.ReactNode {
  if (/KPI|大盘/.test(label)) {
    return <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>{p.kpis.slice(0, 4).map((k, i) => <StatTile key={i} label={k.l} value={k.v} delta={k.d} dcls={k.dcls} />)}</div>;
  }
  if (/漏斗|链路|funnel/.test(label)) {
    const max = Math.max(...p.funnel.map(f => f.value), 1);
    return <RankRows rows={p.funnel.filter(f => f.value > 0 || f.abn).slice(0, 6).map(f => ({ name: `${f.step} ${f.label}`, val: f.value.toLocaleString(), pct: (f.value / max) * 100, color: f.abn ? CRIT : c.accent }))} />;
  }
  if (/国家|地区|geo/.test(label)) {
    const g = p.geo.filter(x => x.spend > 0); const max = Math.max(...g.map(x => x.spend), 1);
    return g.length ? <RankRows rows={g.map(x => ({ name: `${x.c} · ${x.label}`, val: String(x.spend), pct: (x.spend / max) * 100 }))} /> : <Empty p={p} />;
  }
  if (/剧目|内容|content|series/.test(label)) {
    const s = p.series; const max = Math.max(...s.map(x => x.sess), 1);
    return s.length ? <RankRows rows={s.slice(0, 5).map(x => ({ name: x.t, val: String(x.sess), pct: (x.sess / max) * 100 }))} /> : <Empty p={p} />;
  }
  if (/异常|诊断/.test(label)) {
    const ab = p.funnel.find(f => f.abn);
    return <div style={{ borderLeft: `3px solid ${CRIT}`, paddingLeft: 12 }}><div style={{ fontFamily: c.mono, fontSize: 20, fontWeight: 600, color: CRIT }}>{ab && ab.drop != null ? `${Math.abs(ab.drop).toFixed(1)}%` : '100%'}</div><div style={{ fontFamily: c.sans, fontSize: 12, color: c.textSec, marginTop: 4 }}>{ab ? ab.label : '核心链路'} 段流失，待 AI 归因。</div></div>;
  }
  // generic
  return <div style={{ fontFamily: c.sans, fontSize: 12, color: c.textSec }}>已纳入「{label}」模块（{p.label}）。</div>;
}
const Empty = ({ p }: { p: Product }) => <div style={{ fontFamily: c.sans, fontSize: 12, color: c.textMute }}>暂无数据（{p.kpiSrc}）。</div>;

// ── Showcase widgets for the overview (representative, deterministic) ─────────────
export function TrendCard({ p }: { p: Product }) {
  const base = p.funnel.find(f => f.value > 0)?.value || 600;
  const data = Array.from({ length: 12 }, (_, i) => base * (0.6 + seed(i + 1) * 0.7));
  const last = data[data.length - 1], prev = data[data.length - 2], up = last >= prev;
  return (
    <div>
      {lbl('近 12 期趋势 · PlayStart')}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
        <span style={{ fontFamily: c.mono, fontSize: 22, fontWeight: 600, color: c.textPri }}>{Math.round(last).toLocaleString()}</span>
        <span style={{ fontFamily: c.mono, fontSize: 11, color: up ? c.green : CRIT }}>{up ? '▲' : '▼'} {Math.abs(((last - prev) / prev) * 100).toFixed(1)}%</span>
      </div>
      <Spark data={data} h={46} />
    </div>
  );
}
export function ChannelMix() {
  return (
    <div>
      {lbl('渠道构成 · 花费占比')}
      <div style={{ marginTop: 10 }}>
        <StackBar parts={[{ label: 'Meta', val: 58, color: '#3B82F6' }, { label: 'TikTok', val: 24, color: TEAL }, { label: 'Google', val: 12, color: WARN }, { label: 'Kwai', val: 6, color: '#a78bfa' }]} />
      </div>
    </div>
  );
}
export function CompletionRing({ p }: { p: Product }) {
  const roas = parseFloat((p.kpis.find(k => /roas/i.test(k.l))?.v || '0').replace(/[^\d.]/g, '')) || 0;
  const pct = Math.min(100, (roas / 0.6) * 100);
  return (<div>{lbl('D0 ROAS 目标完成度')}<div style={{ marginTop: 6 }}><Ring pct={pct} label={`目标 0.60×`} sub={`当前 ${roas.toFixed(3)}×`} color={pct >= 80 ? c.green : pct >= 40 ? WARN : CRIT} /></div></div>);
}
