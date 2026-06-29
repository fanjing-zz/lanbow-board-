// Downloadable report (self-contained HTML) — built on the Lanbow design spec.
// Inter-only, tabular numbers, legible sizes (no sub-10px body, no low-contrast mutes),
// clean module division. Theme-aware (dark / light).

interface Palette {
  bg: string; card: string; sub: string; accent: string; accentSub: string;
  green: string; amber: string; danger: string; info: string;
  textPri: string; textSec: string; textMute: string; border: string; borderStrong: string;
}

const DARK: Palette = {
  bg: '#0D1117', card: '#131B24', sub: 'rgba(255,255,255,0.03)',
  accent: '#2CCDC2', accentSub: '#00B1A2', green: '#33D69A', amber: '#FFC54D', danger: '#FF6B85', info: '#6AA6FF',
  textPri: '#E8EDF2', textSec: '#A8BECB', textMute: '#7A93A1', border: 'rgba(255,255,255,0.09)', borderStrong: 'rgba(44,205,194,0.30)',
};
const LIGHT: Palette = {
  bg: '#EBEDF0', card: '#FFFFFF', sub: 'rgba(0,0,0,0.025)',
  accent: '#137E75', accentSub: '#00897B', green: '#08824F', amber: '#9A5B00', danger: '#C81E3C', info: '#2257C5',
  textPri: '#16242E', textSec: '#46555F', textMute: '#69767F', border: 'rgba(0,0,0,0.10)', borderStrong: 'rgba(0,0,0,0.16)',
};

export function downloadDramaReport(): void {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const blob = new Blob([buildDramaReport(isDark)], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'drama-投放复盘-W20-2026-05-13_19.html';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function buildDramaReport(isDark: boolean): string {
  const p = isDark ? DARK : LIGHT;
  const dangerWash = isDark ? 'rgba(255,107,133,0.10)' : 'rgba(200,30,60,0.06)';
  const amberWash = isDark ? 'rgba(255,197,77,0.08)' : 'rgba(154,91,0,0.06)';
  const greenWash = isDark ? 'rgba(51,214,154,0.10)' : 'rgba(8,130,79,0.08)';

  const frow = (step: string, proxy: boolean, w: number, cnt: string, drop: string, crit?: boolean) => `
    <div class="frow">
      <div class="step">${step}${proxy ? ' <span class="proxy">proxy</span>' : ''}</div>
      <div class="bar-wrap"><div class="bar${crit ? ' crit' : ''}" style="width:${w}%"></div></div>
      <div class="cnt"${crit ? ' style="color:' + p.danger + '"' : ''}>${cnt}</div>
      <div class="drop${crit ? ' crit' : ''}">${drop}</div>
    </div>`;

  const adRow = (k: string, v: string, cls = '') => `<div class="ad-row"><span class="k">${k}</span><span class="v ${cls}">${v}</span></div>`;
  const crow = (name: string, w: number, min: string, pct: string) => `<div class="crow"><span class="cname">${name}</span><div class="bar-wrap"><div class="bar" style="width:${w}%"></div></div><span class="cmin">${min}</span><span class="cpct">${pct}</span></div>`;
  const gap = (cls: string, id: string, ttl: string, desc: string, span?: boolean) => `<div class="gap ${cls}"${span ? ' style="grid-column:1/-1"' : ''}><span class="gid">${id}</span><div class="gttl">${ttl}</div><div class="gdesc">${desc}</div></div>`;
  const act = (sev: string, tag: string, text: string) => `<div class="act"><span class="sev ${sev}">${sev}</span><span class="atag">${tag}</span><span class="atext">${text}</span></div>`;

  return `<!doctype html>
<html lang="zh"><head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>drama 投放复盘 — W20 · 2026-05-13 → 2026-05-19</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{
  --bg:${p.bg}; --card:${p.card}; --sub:${p.sub}; --accent:${p.accent}; --accent-sub:${p.accentSub};
  --green:${p.green}; --amber:${p.amber}; --danger:${p.danger}; --info:${p.info};
  --pri:${p.textPri}; --sec:${p.textSec}; --mute:${p.textMute}; --bd:${p.border}; --bds:${p.borderStrong};
  --sans:'Inter',system-ui,sans-serif;
}
*,*::before,*::after{box-sizing:border-box}
html,body{margin:0;padding:0;background:var(--bg);color:var(--pri);font-family:var(--sans);font-size:14px;line-height:1.6;font-variant-numeric:tabular-nums;-webkit-font-smoothing:antialiased}
.wrap{max-width:880px;margin:0 auto;padding:56px 48px 80px}

/* header */
.hdr{margin-bottom:44px}
.eyebrow{display:flex;justify-content:space-between;align-items:center;gap:16px;padding-bottom:18px;margin-bottom:28px;border-bottom:1px solid var(--bd);flex-wrap:wrap}
.brand{font-size:11px;font-weight:600;color:var(--mute);letter-spacing:.18em;text-transform:uppercase}
.badges{display:flex;gap:6px;flex-wrap:wrap}
.badge{font-size:10px;font-weight:500;padding:4px 9px;color:var(--mute);border:1px solid var(--bds);border-radius:4px;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap}
.badge.live{color:var(--green);border-color:var(--green);background:${greenWash};display:inline-flex;align-items:center;gap:5px}
.badge.live::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--green)}
.title{font-size:34px;font-weight:700;line-height:1.1;letter-spacing:-0.02em;margin-bottom:14px}
.meta{font-size:12.5px;color:var(--sec);margin-bottom:6px}
.strap{font-size:12px;color:var(--mute)}

/* section label */
.seclbl{font-size:11px;font-weight:600;color:var(--mute);letter-spacing:.16em;text-transform:uppercase;margin:0 0 14px}

/* KPI hero */
.hero{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:44px}
.kpi{background:var(--card);border:1px solid var(--bd);border-top:3px solid var(--bds);border-radius:8px;padding:22px 20px}
.kpi.danger{border-top-color:var(--danger)} .kpi.warn{border-top-color:var(--amber)}
.kpi .l{font-size:11px;font-weight:600;color:var(--mute);text-transform:uppercase;letter-spacing:.08em;margin-bottom:16px}
.kpi .v{font-size:46px;font-weight:600;line-height:1;letter-spacing:-0.03em}
.kpi .v small{font-size:24px;font-weight:500;opacity:.7;margin-left:2px}
.kpi.danger .v{color:var(--danger)} .kpi.warn .v{color:var(--amber)}
.kpi .n{font-size:12.5px;color:var(--sec);margin-top:16px;line-height:1.7}
.kpi .n b{font-weight:600}

/* card */
.card{background:var(--card);border:1px solid var(--bd);border-radius:8px;margin-bottom:24px;overflow:hidden}
.chead{display:flex;justify-content:space-between;align-items:baseline;gap:20px;padding:18px 24px;border-bottom:1px solid var(--bd);box-shadow:inset 3px 0 0 var(--accent)}
.cnum{font-size:10px;font-weight:600;color:var(--accent);text-transform:uppercase;letter-spacing:.16em;display:block;margin-bottom:5px}
.ctitle{font-size:16px;font-weight:600;letter-spacing:-0.01em}
.cmeta{font-size:10.5px;color:var(--mute);text-align:right;flex-shrink:0;line-height:1.7}
.cbody{padding:24px}

/* funnel */
.funnel{display:flex;flex-direction:column;gap:8px}
.frow{display:grid;grid-template-columns:188px 1fr 80px 76px;align-items:center;gap:14px}
.frow .step{font-size:12.5px;color:var(--pri)}
.frow .proxy{font-size:10px;color:var(--mute)}
.frow .bar-wrap{height:16px;background:var(--bd);border-radius:4px;overflow:hidden}
.frow .bar{height:100%;background:var(--accent);opacity:.85;border-radius:4px}
.frow .bar.crit{background:var(--danger);opacity:1}
.frow .cnt{font-size:14px;font-weight:600;text-align:right}
.frow .drop{font-size:11.5px;text-align:right;color:var(--sec)}
.frow .drop.crit{color:var(--danger);font-weight:700}
.callout{margin-top:22px;padding:14px 18px;border-left:3px solid var(--danger);background:${dangerWash};font-size:12.5px;color:var(--sec);line-height:1.75;border-radius:0 6px 6px 0}
.callout b{color:var(--danger);font-weight:600}
.conv{display:flex;justify-content:space-between;align-items:center;margin-top:20px;padding-top:18px;border-top:1px solid var(--bd)}
.conv .t{font-size:11px;color:var(--mute);text-transform:uppercase;letter-spacing:.1em}
.conv .n{font-size:22px;font-weight:700;color:var(--accent)}

/* ad grid */
.adg{display:grid;grid-template-columns:1fr 1fr;gap:0 44px}
.ad-row{display:flex;justify-content:space-between;align-items:baseline;padding:10px 0;border-bottom:1px solid var(--bd)}
.ad-row .k{font-size:11px;color:var(--mute);text-transform:uppercase;letter-spacing:.06em}
.ad-row .v{font-size:13px;font-weight:500;color:var(--pri)}
.ad-row .v.warn{color:var(--amber);font-weight:600}
.ad-row .v.big{font-size:17px;font-weight:600;color:var(--accent)}
.ad-row .v.mute{color:var(--mute)}
.alert{margin-top:22px;padding:14px 18px;border-left:3px solid var(--amber);background:${amberWash};border-radius:0 6px 6px 0}
.alert .t{font-size:10.5px;font-weight:600;color:var(--amber);text-transform:uppercase;letter-spacing:.1em;margin-bottom:7px}
.alert .b{font-size:12.5px;color:var(--sec);line-height:1.75}
.alert .b b{color:var(--amber);font-weight:600}
.alert .s{font-size:11px;color:var(--mute);margin-top:9px}

/* geo */
.geo{display:grid;grid-template-columns:1.4fr 1fr;gap:26px}
.crow{display:grid;grid-template-columns:54px 1fr 64px 52px;gap:12px;align-items:center;padding:9px 0;border-bottom:1px solid var(--bd)}
.crow:last-child{border-bottom:none}
.cname{font-size:12px;color:var(--pri)}
.crow .bar-wrap{height:7px;background:var(--bd);border-radius:4px;overflow:hidden}
.crow .bar{height:100%;background:var(--accent);opacity:.8;border-radius:4px}
.cmin{font-size:11.5px;color:var(--sec);text-align:right}
.cpct{font-size:13px;font-weight:700;color:var(--accent);text-align:right}
.cmp{background:var(--sub);border:1px solid var(--bds);border-radius:8px;padding:18px 20px}
.cmp .row{display:flex;justify-content:space-between;gap:14px;margin-bottom:10px}
.cmp .k{font-size:10.5px;color:var(--mute);text-transform:uppercase;letter-spacing:.06em}
.cmp .v{font-size:12px;color:var(--pri);text-align:right}
.cmp .note{margin-top:14px;padding-top:13px;border-top:1px solid var(--bd);font-size:12px;color:var(--sec);line-height:1.7}
.cmp .note b{color:var(--amber);font-weight:600}

/* gaps */
.gaps{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.gap{background:var(--sub);border:1px solid var(--bd);border-radius:8px;padding:16px 18px;position:relative}
.gap.crit{border-left:3px solid var(--danger)} .gap.warn{border-left:3px solid var(--amber)} .gap.info{border-left:3px solid var(--info)}
.gid{position:absolute;top:13px;right:15px;font-size:10px;color:var(--mute)}
.gttl{font-size:13.5px;font-weight:600;margin-bottom:7px;padding-right:32px;line-height:1.3}
.gdesc{font-size:12px;color:var(--sec);line-height:1.7}

/* actions */
.acts{display:flex;flex-direction:column;gap:10px}
.act{display:grid;grid-template-columns:58px 84px 1fr;gap:16px;align-items:start;padding:14px 18px;background:var(--sub);border:1px solid var(--bd);border-radius:8px}
.sev{font-size:10px;font-weight:700;padding:4px 7px;border-radius:4px;text-align:center;letter-spacing:.08em}
.sev.HIGH{background:${dangerWash};color:var(--danger);border:1px solid var(--danger)}
.sev.MED{background:${amberWash};color:var(--amber);border:1px solid var(--amber)}
.sev.LOW{background:${isDark ? 'rgba(106,166,255,0.10)' : 'rgba(34,87,197,0.07)'};color:var(--info);border:1px solid var(--info)}
.atag{font-size:11px;font-weight:500;color:var(--accent)}
.atext{font-size:12.5px;color:var(--sec);line-height:1.7}

/* sources + footer */
.sources{display:flex;justify-content:space-between;align-items:center;gap:12px 20px;flex-wrap:wrap;padding:16px 22px;background:var(--card);border:1px solid var(--bd);border-radius:8px}
.srcs{display:flex;flex-wrap:wrap;gap:8px 18px}
.src{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:var(--sec)}
.src::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--green)}
.sign{font-size:10.5px;color:var(--mute);letter-spacing:.06em}
.foot{margin-top:40px;padding-top:24px;border-top:1px solid var(--bd);text-align:center}
.ftop{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px}
.fmark{font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--mute)}
.fslogan{font-size:13px;font-style:italic;color:var(--accent)}
.fmeta{font-size:11px;color:var(--mute);line-height:1.8}
code{font-size:11.5px;background:var(--sub);padding:1px 5px;border-radius:4px;border:1px solid var(--bd)}
@media print{ body{background:#fff} .wrap{padding:24px} }
</style></head>
<body><div class="wrap">

<header class="hdr">
  <div class="eyebrow">
    <span class="brand">LANBOW · Reporting Engine</span>
    <div class="badges"><span class="badge">W20</span><span class="badge">7-DAY</span><span class="badge">USD</span><span class="badge live">DATA LIVE</span></div>
  </div>
  <div class="title">drama 投放复盘</div>
  <div class="meta">2026-05-13 → 2026-05-19 · PopularReels &amp; Bestshort · act_800509389474426</div>
  <div class="strap">数据导向的 7 天产品 + 投放诊断：核心异常 / 漏斗瓶颈 / 流量真相 / 缺口 / 行动</div>
</header>

<div class="seclbl">01 — 核心异常</div>
<section class="hero">
  <div class="kpi danger"><div class="l">ROAS</div><div class="v">0.051<small>×</small></div><div class="n">投 $1 收 $0.05；目标 0.5，差 <b style="color:var(--danger)">10×</b></div></div>
  <div class="kpi warn"><div class="l">Beacon 覆盖缺口</div><div class="v">60.8<small>%</small></div><div class="n">CF Stream 6,847 min vs DB 2,682 min；≈4,165 min 真实播放<b style="color:var(--amber)">未记录</b></div></div>
  <div class="kpi danger"><div class="l">Paywall → Checkout 流失</div><div class="v">98<small>%</small></div><div class="n">296 PaywallView → 6 InitiateCheckout；看墙的人几乎<b style="color:var(--danger)">没进 Stripe</b></div></div>
</section>

<div class="card">
  <div class="chead"><div><span class="cnum">02</span><span class="ctitle">全链路漏斗 · 7 节点</span></div><div class="cmeta">play_sessions + Stripe + recharge_records</div></div>
  <div class="cbody">
    <div class="funnel">
      ${frow('① PageView', true, 100, '1,516', '—')}
      ${frow('② ViewContent', true, 100, '1,516', '0.0%')}
      ${frow('③ PlayStart', false, 61, '930', '−38.7%')}
      ${frow('④ WatchProgress', false, 21, '317', '−65.9%')}
      ${frow('⑤ PaywallView', true, 19.5, '296', '−6.6%')}
      ${frow('⑥ InitiateCheckout', false, 3, '6', '−98.0%', true)}
      ${frow('⑦ Purchase', false, 1.5, '2', '−66.7%')}
    </div>
    <div class="callout"><b>主要漏洞：</b>⑤→⑥ 流失 <b>98%</b>。看到付费墙 296 人，真正点 Stripe 跳转只有 <b>6</b>。高度怀疑：(1) iOS Safari / 微信内置浏览器拦截跳转；(2) LockedOverlay 的 CTA 在 desktop 未渲染或被遮挡。</div>
    <div class="conv"><span class="t">整体转化率（Click → Purchase）</span><span class="n">0.13%</span></div>
  </div>
</div>

<div class="card">
  <div class="chead"><div><span class="cnum">03</span><span class="ctitle">Meta 投放数据（primary 账号）</span></div><div class="cmeta">act_800509389474426 · USD · 7d</div></div>
  <div class="cbody">
    <div class="adg">
      ${adRow('Spend', '$274.21', 'big')}${adRow('外部收入', '$13.99')}
      ${adRow('Impressions', '50,079')}${adRow('外部付费', '2 笔')}
      ${adRow('Clicks', '8,245', 'big')}${adRow('Reach', '42,741')}
      ${adRow('CTR', '16.46% ⚠', 'warn')}${adRow('Frequency', '1.17')}
      ${adRow('CPC', '$0.033 ⚠', 'warn')}${adRow('ACTIVE 校园', '0（已暂停）', 'mute')}
    </div>
    <div class="alert"><div class="t">流量质量警示</div><div class="b">CTR 16% 异常高 + CPC $0.033 异常低 = <b>点击农场签名</b>。内部规则：低于 $0.01 + 4K+ 点击几乎必假。建议跑 cf_firewall_threats 看 PH/NG 的 bot 比例交叉验证。</div></div>
  </div>
</div>

<div class="card">
  <div class="chead"><div><span class="cnum">04</span><span class="ctitle">真实流量地理分布</span></div><div class="cmeta">Cloudflare Stream · minutesViewed by country</div></div>
  <div class="cbody">
    <div class="geo">
      <div>${crow('🇵🇭 PH', 100, '785 min', '11.5%')}${crow('🇳🇬 NG', 89, '700 min', '10.2%')}${crow('🇺🇸 US', 55, '429 min', '6.3%')}${crow('🇨🇩 CD', 53, '419 min', '6.1%')}${crow('🇮🇩 ID', 50, '390 min', '5.7%')}</div>
      <div class="cmp">
        <div class="row"><span class="k">DB top 5</span><span class="v">SG · US · GB · ZA · FR</span></div>
        <div class="row"><span class="k">CF top 5</span><span class="v" style="color:var(--accent)">PH · NG · US · CD · ID</span></div>
        <div class="note">两边<b>完全不重合</b>。按 DB geo 做优化建立在<b>错样本</b>上——新兴市场真实流量被起播失败静默吃掉。</div>
      </div>
    </div>
  </div>
</div>

<div class="card">
  <div class="chead"><div><span class="cnum">05</span><span class="ctitle">BI 已知陷阱清单</span></div><div class="cmeta">observability / data-gaps</div></div>
  <div class="cbody"><div class="gaps">
    ${gap('crit', '#1', 'Beacon 覆盖缺口 ~60%', '前端 hydration 慢，用户在 runtime mount 前关页 → session 行不存在。所有 session 类指标 undercount。')}
    ${gap('crit', '#2', 'DB geo ≠ CF Stream geo', 'Edge IP 国家只在起播成功才记。新兴市场弱网失败用户在 BI 看不见。')}
    ${gap('warn', '#3', 'Stripe 内部测试单占 31%', '需 filter <code>@sandwichlab.ai</code> + <code>test_%</code> + 纯数字 uid。不剔除转化率被严重压低。')}
    ${gap('warn', '#4', 'Stripe customer_details 全空', 'expired session 里 name/address/phone 全 null = 用户根本没到填卡页；跳转被内置浏览器拦截。')}
    ${gap('info', '#5', 'Subscribe → Purchase 事件命名漂移', 'Meta 算法只认 <code>Purchase</code>；早期 webhook 发 <code>Subscribe</code> 被忽略 → 优化目标失效。', true)}
  </div></div>
</div>

<div class="card">
  <div class="chead"><div><span class="cnum">06</span><span class="ctitle">下周必须做的事</span></div><div class="cmeta">reflection · 2026-05-19</div></div>
  <div class="cbody"><div class="acts">
    ${act('HIGH', 'product', '把 play_sessions beacon 触发挪到 player <code>load()</code>，不等 TTFF。修复 60.8% beacon 缺口，所有 session 类指标可信化。')}
    ${act('HIGH', 'product', '排查 PaywallView → Stripe 跳转链路（iOS Safari / 内置浏览器拦截 / LockedOverlay desktop 缺失），修复 98% paywall 流失。')}
    ${act('HIGH', 'analytics', '信号量 < 30 时返回 insufficient_signal；避免基于 2 单 paid 做"按国家/按 tag"结论（本期外部 paid uid = 2）。')}
    ${act('MED', 'content', 'Top 单剧占 95.7% sessions = 素材过度集中。加单剧 dominance 警报：>80% 单剧 → 标红。')}
    ${act('MED', 'channels', 'DB / CF geo 不重合是 CDN 性能问题而非用户质量。按国家跑 stall ratio + TTFF 定位 PH/NG/CD 边缘节点。')}
    ${act('LOW', 'reports', 'funnel 中 proxy 节点用脚注标注，与 real 节点视觉区分，避免读者混读代理与真实计数。')}
  </div></div>
</div>

<div class="sources">
  <div class="srcs"><span class="src">Supabase PG</span><span class="src">Stripe REST</span><span class="src">Cloudflare Stream</span><span class="src">Cloudflare Firewall</span><span class="src">Meta Marketing API ×2</span></div>
  <span class="sign">drama-pipeline · v1.2</span>
</div>

<div class="foot">
  <div class="ftop"><span class="fmark">Lanbow</span><span class="fslogan">Advertising is investing.</span></div>
  <div class="fmeta">生成时间 2026-05-20 · 数据 100% 实测拉取 · 周期 2026-05-13 → 2026-05-19 (W20) · Growth Decision System</div>
</div>

</div></body></html>`;
}
