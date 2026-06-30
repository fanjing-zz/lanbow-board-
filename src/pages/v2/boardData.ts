// Real data ported from the decrypted drama-demo board (Chenkai-Lanbow-demo).
// Multi-product growth-decision system: drama / mindramas / kwai (+ others).

export interface Kpi { l: string; v: string; cls?: 'crit' | 'good' | 'warn'; d?: string; dcls?: 'up' | 'down'; }
export interface FunnelNode { step: string; label: string; value: number; drop: number | null; kind: string; abn?: boolean; }
export interface SeriesRow { t: string; sess: number; play: number; paid: number; roas: number; st: string; }
export interface GeoRow { c: string; label: string; spend: number; churn: number; roas: number; paid: number; }
export interface PlanRow { camp: string; spend: number; imp: number; clicks: number; ctr: number; cpm: number; roi: number; st: string; cid: string; }
export interface AccountRow { plat: string; name: string; aid: string; kind: string; st: string; stx: string; bal: string; sync: string; meta: string; }
export interface ResearchRow { t: string; meta: string; src: string; desc: string; }
export interface AlertRow { lv: 'crit' | 'warn' | 'info'; t: string; d: string; time: string; }
export interface AutoRule { name: string; cond: string; act: string; on: boolean; }
// ── creative module (素材中心) ──
export interface CreativeHook { id: string; ctr: string; text: string; imp: string; spend: string; }
export interface CreativeCheck { k: string; v: string; ok: boolean; }
export interface CreativeTopRow { name: string; acct: string; spend: string; imp: string; clicks: string; cpm: string; cpc: string; ctr: string; play3s: string; complete: string; paid: string; roi: string; st: string; }
export interface Creative { intro: string; cta: string; hooksTitle: string; hooks: CreativeHook[]; checkTitle: string; checks: CreativeCheck[]; topTitle: string; topRows: CreativeTopRow[]; }
// ── content module (剧目中心) ──
export interface EpisodePoint { ep: string; value: number; abn?: boolean; }
export interface Ttff { avg: string; p50: string; missing: string; }
// ── analysis module (内部口径页) ──
export interface ReconcileItem { label: string; value: string; cls?: 'good' | 'crit' | 'warn'; tag?: string; }
export interface BreakdownGroup { title: string; rows: { k: string; v: string; pct: number }[]; }

export interface Product {
  id: string; label: string; tenant: string; tz?: string; accts?: number; sim?: boolean;
  kpiSrc: string; kpis: Kpi[]; funnel: FunnelNode[]; geo: GeoRow[]; series: SeriesRow[];
  plans: PlanRow[]; accounts: AccountRow[]; research: ResearchRow[];
  alerts: AlertRow[]; thresholds: [string, string, string][]; rules: AutoRule[];
  creative?: Creative;
  episodes?: EpisodePoint[];   // per-episode retention curve (content pane)
  ttff?: Ttff;                 // load-timing stats (content pane)
  reconcile?: ReconcileItem[]; // multi-source reconcile (analysis pane)
  breakdowns?: BreakdownGroup[]; // placement/device/audience (analysis pane)
  // vertical-aware labels (default = short-drama wording)
  contentZh?: string;   // '剧目' | '商品' …
  playLabel?: string;   // '完播%' | '复购%' …
  funnelSrc?: string;   // funnel card subtitle
}

// ── Data link (mcp-flow: channels → collect_window → envelope → 5 skills → outputs) ──
export const DATA_LINK = {
  cols: [
    { title: 'SOURCES', items: ['Meta Ads', 'AppsFlyer', 'Stripe', 'CF Stream', 'product_db'] },
    { title: 'ENGINE', items: ['L2 channels', 'collect_window'] },
    { title: 'TRUTH', items: ['envelope'] },
    { title: 'CONSUMERS', items: ['dashboard', 'project-report', 'strategy-engine', 'learning-loop', 'alerts-router'] },
    { title: 'OUTPUTS', items: ['dashboard.html', '日/周报 md', 'actions JSON', 'proposals JSON', '飞书 alerts'] },
  ],
};

export const TENANTS = [
  { id: 'chenkai', label: 'chenkai' },
  { id: 'auvora-dtc', label: '海外电商品牌（示例）' },
  { id: 'local-merchant-demo', label: '本地服务客户（示例）' },
];

// ── Navigation (matches the board; grp separators, ext=visible in external view) ──
export interface NavItem { id: string; label: string; en: string; ext: boolean; grp: number; dot?: boolean; cta?: boolean; }
export const NAV: NavItem[] = [
  { id: 'chat', label: '对话', en: 'Chat', ext: true, grp: 0, dot: true },
  { id: 'overview', label: '总览', en: 'Overview', ext: true, grp: 1 },
  { id: 'delivery', label: '投放', en: 'Delivery', ext: true, grp: 1 },
  { id: 'creative', label: '素材', en: 'Creative', ext: true, grp: 1 },
  { id: 'content', label: '剧目', en: 'Content', ext: true, grp: 1 },
  { id: 'reports', label: '报告', en: 'Reports', ext: true, grp: 1 },
  { id: 'accounts', label: '账号', en: 'Accounts', ext: false, grp: 2 },
  { id: 'budget', label: '预算', en: 'Budget', ext: true, grp: 2 },
  { id: 'alerts', label: '告警', en: 'Alerts', ext: false, grp: 2, dot: true },
  { id: 'automation', label: '自动化', en: 'Automation', ext: false, grp: 2 },
  { id: 'analysis', label: '数据分析', en: 'Analysis', ext: false, grp: 2 },
  { id: 'research', label: '产品调研', en: 'Research', ext: false, grp: 2 },
];

export const ASSET_HEALTH = ['APP 商品', '广告账户', '素材审核', '落地域名', 'PIXEL/CAPI', '支付', '归因'];

// chat suggestion chips (per the board)
export const SUGGESTIONS = ['生成自定义看板', '今天大盘怎么样？', '付费转化卡在哪一步？', '各国家花费分布？', '哪个计划要关停？', '数据健康吗？'];

// ── DRAMA (real, near-zero day) ──
const drama: Product = {
  id: 'drama', label: 'drama', tenant: 'chenkai', tz: 'GMT', accts: 3,
  kpiSrc: 'META + DB + STRIPE · 真实 @ 2026-06-23 18:20 · 同比昨日',
  kpis: [
    { l: '今日花费', v: '$0.00', d: '▼ 100.0%', dcls: 'down' },
    { l: 'CPM', v: '$0.0', d: '▼ 100.0%', dcls: 'up' },
    { l: 'CTR', v: '0.00%', d: '▼ 100.0%', dcls: 'down' },
    { l: 'CPA', v: '—' },
    { l: 'CPI 注册成本', v: '$0.00', d: '▼ 100.0%', dcls: 'up' },
    { l: '付费率', v: '0.0%' },
    { l: 'ARPU', v: '—' },
    { l: 'D0 ROAS', v: '0.000×', cls: 'crit' },
  ],
  funnel: [
    { step: '①', label: '广告展示', value: 0, drop: null, kind: '' },
    { step: '②', label: '独立触达 (reach)', value: 0, drop: null, kind: '' },
    { step: '③', label: 'Video 3s+ 观看', value: 0, drop: null, kind: '' },
    { step: '④', label: 'Video 50%', value: 0, drop: null, kind: '' },
    { step: '⑤', label: 'Video 75%', value: 0, drop: null, kind: '' },
    { step: '⑥', label: 'Link Click', value: 0, drop: null, kind: '' },
    { step: '⑦', label: 'Landing Page View', value: 0, drop: null, kind: '' },
    { step: '⑧', label: 'View Content (Pixel)', value: 0, drop: null, kind: '' },
    { step: '⑨', label: '新落地访客', value: 930, drop: null, kind: 'proxy' },
    { step: '⑩', label: 'PlayStart', value: 960, drop: 3.23, kind: '' },
    { step: '⑪', label: '完整观看 (≥90%)', value: 0, drop: -100.0, kind: '', abn: true },
    { step: '⑫', label: 'Paywall 触达 (≥EP10)', value: 0, drop: null, kind: '' },
    { step: '⑬', label: '付费', value: 0, drop: null, kind: '' },
  ],
  geo: [
    { c: 'US', label: 'United States', spend: 0, churn: 0, roas: 0, paid: 0 },
    { c: 'CA', label: 'Canada', spend: 0, churn: 0, roas: 0, paid: 0 },
    { c: 'GB', label: 'Great Britain', spend: 0, churn: 0, roas: 0, paid: 0 },
    { c: 'AU', label: 'Australia', spend: 0, churn: 0, roas: 0, paid: 0 },
  ],
  series: [
    { t: 'Accidentally Slept with the…', sess: 420, play: 0, paid: 0, roas: 0, st: 'warn' },
    { t: "Fated Twist: The Alpha's Lov…", sess: 240, play: 0, paid: 0, roas: 0, st: 'warn' },
    { t: 'Swapped Mates: The Vagrant A…', sess: 150, play: 0, paid: 0, roas: 0, st: 'warn' },
    { t: 'One Last Heartbeat: If You N…', sess: 30, play: 0, paid: 0, roas: 0, st: 'warn' },
    { t: "The Alpha's Hidden Heir", sess: 30, play: 0, paid: 0, roas: 0, st: 'warn' },
    { t: 'To Love and to Destroy', sess: 60, play: 0, paid: 0, roas: 0, st: 'warn' },
    { t: 'Everybody Step Aside, The Ma…', sess: 30, play: 0, paid: 0, roas: 0, st: 'warn' },
    { t: 'My Destined Mate An Alpha In…', sess: 30, play: 0, paid: 0, roas: 0, st: 'warn' },
  ],
  episodes: [
    { ep: 'EP1', value: 750 }, { ep: 'EP2', value: 120, abn: true }, { ep: 'EP3', value: 60, abn: true },
    { ep: 'EP4', value: 5, abn: true }, { ep: 'EP5', value: 3 }, { ep: 'EP6', value: 3 }, { ep: 'EP7', value: 60 },
  ],
  ttff: { avg: '2391ms', p50: '1519ms', missing: '0.0%' },
  plans: [],
  accounts: [
    { plat: 'META', name: 'drama BM', aid: 'act_132374…7080', kind: '渠道', st: 'ok', stx: '已授权', bal: '—', sync: '2 min ago', meta: '真实' },
    { plat: 'STRIPE', name: '订阅·Stripe', aid: '', kind: '支付', st: 'ok', stx: '已授权', bal: '—', sync: '5 min ago', meta: 'IAP' },
    { plat: 'CF', name: 'Cloudflare Stream', aid: '', kind: '渠道', st: 'ok', stx: '已授权', bal: '—', sync: '2 min ago', meta: '播放' },
  ],
  research: [
    { t: '北美短剧付费墙节奏', meta: 'market research · 2026-05-28', src: 'ingest', desc: '竞品普遍把首充墙放在 EP6-8；我方 EP? 偏后，付费转化滞后。建议 A/B 提前到 EP5。' },
    { t: 'ReelShort 投放结构拆解', meta: 'competitor · 2026-05-25', src: 'competitor', desc: '对手按「剧目×女性 25-60」拆 adset，单 adset 预算小步快跑；与我方 BK-* 结构一致。' },
    { t: 'CPM 50-60 区间 CTR 锚点', meta: 'insight · 2026-05-21', src: 'insight', desc: '实测 CPM 50-60 下 CTR 8% 为对齐值；CPM<50 偏便宜流量倾向更优，仍以 D0 ROAS 为先。' },
  ],
  alerts: [
    { lv: 'crit', t: '完整观看链路 100% 流失', d: 'PlayStart→完整观看(≥90%) 段间流失 100%，疑似埋点缺失或起播后无有效观看，建议优先排查。', time: '18:20' },
    { lv: 'warn', t: '今日 0 花费', d: '今日花费 $0、D0 ROAS 0.000×，同比昨日 ▼100%，请确认是否暂停或账户异常。', time: '18:20' },
  ],
  thresholds: [['stage', 'growth', 'BRIEF'], ['d0_roas 目标', '0.60', 'BRIEF'], ['素材 3s 留存 ≥', '0.30', 'BRIEF'], ['ctr_target', '0.08', 'BRIEF']],
  rules: [
    { name: '低 ROAS 关停', cond: 'D0 ROAS < 0.2 且花费 > $50', act: '暂停 ad set', on: true },
    { name: '高 ROAS 放量', cond: 'D0 ROAS ≥ 0.6 连续 2 天', act: '预算 +20%', on: true },
    { name: '素材衰减换新', cond: '3s 留存 < 0.30', act: '提示换素材', on: false },
  ],
  creative: {
    intro: '创意效果分析 + 制作入口。',
    cta: '去做素材',
    hooksTitle: '创意 Hook A/B/C · CTR 对比',
    hooks: [
      { id: 'A', ctr: '3.1%', text: 'She never expected to fall for someone like him. After years of playing it safe…', imp: '12.4K', spend: '$14.20' },
      { id: 'B', ctr: '2.7%', text: 'One night changed everything. In a city that never sleeps, their worlds collided…', imp: '10.8K', spend: '$12.60' },
      { id: 'C', ctr: '2.4%', text: 'The last thing she wanted was to feel again. But fate had other plans when…', imp: '9.2K', spend: '$11.30' },
    ],
    checkTitle: '创意检查清单 · Crimson Tides',
    checks: [
      { k: 'Word count', v: '512w', ok: true },
      { k: 'Lang', v: 'EN', ok: true },
      { k: 'CTR forecast', v: '3.1%', ok: true },
      { k: 'Tone', v: 'Romantic', ok: true },
      { k: 'CTA present', v: 'Yes', ok: true },
      { k: 'Compliance', v: 'Passed', ok: true },
    ],
    topTitle: '创意 Top · 按花费',
    topRows: [],
  },
  reconcile: [
    { label: '收入对账差 (DB VS STRIPE)', value: '0.0%', cls: 'good', tag: 'webhook 健康' },
    { label: 'DB 付费数 (UIDS)', value: '—', tag: 'Stripe 条数待补源' },
    { label: 'BEACON GAP (CF VS DB)', value: '0.0%', cls: 'good', tag: 'data-gap $1' },
    { label: '真实 ROAS (REV/SPEND)', value: '0.000×', cls: 'crit' },
  ],
};

// ── mindramas (DramaMind) — GA4 real, ads pending ──
const mindramas: Product = {
  id: 'mindramas', label: 'DramaMind (mindramas)', tenant: 'chenkai', tz: 'UTC+8', accts: 2,
  kpiSrc: '真实·GA4 拉通 2026-06-10（近7天 活跃用户 5,451 / 事件 47,273）· 投放侧待 Meta 开投',
  kpis: [
    { l: '起播', v: '3,049' }, { l: '付费墙曝光', v: '1', cls: 'crit' }, { l: '订阅弹窗', v: '19' },
    { l: '发起支付', v: '11' }, { l: '支付成功', v: '0' }, { l: '活跃用户(7d)', v: '5,451' },
    { l: '今日花费', v: '—' }, { l: 'D0 ROAS', v: '—' },
  ],
  funnel: [
    { step: '①', label: 'AdImpression', value: 0, drop: null, kind: 'missing' },
    { step: '②', label: 'AdClick', value: 0, drop: null, kind: 'missing' },
    { step: '③', label: 'EpisodeOpen', value: 4340, drop: null, kind: 'real' },
    { step: '④', label: 'PlayStart', value: 3049, drop: -29.7, kind: 'real' },
    { step: '⑤', label: 'WatchHalf', value: 763, drop: -75.0, kind: 'real' },
    { step: '⑥', label: 'PaywallView(EP9)', value: 1, drop: null, kind: 'real', abn: true },
    { step: '⑦', label: 'CheckoutOpen', value: 19, drop: null, kind: 'real' },
    { step: '⑧', label: 'PaymentLaunch', value: 11, drop: -42.1, kind: 'real' },
    { step: '⑨', label: 'Purchase', value: 0, drop: null, kind: 'real' },
  ],
  geo: [{ c: 'US', label: 'United States', spend: 0, churn: 0, roas: 0, paid: 0 }],
  series: [],
  plans: [],
  accounts: [
    { plat: 'GA4', name: '心境剧 (mindramas)', aid: 'properties/539448952', kind: '归因', st: 'ok', stx: '已授权', bal: '—', sync: '2026-06-10', meta: 'OAuth 拉通·近7天活跃5451' },
    { plat: 'META', name: 'mindramas BM×2', aid: 'act_901537…/948020…', kind: '渠道', st: 'warn', stx: '已接·待开投', bal: '—', sync: '—', meta: 'token就绪·近30天0花费' },
  ],
  research: [
    { t: 'DramaMind 全站观测', meta: 'market research · 2026-06-08 · API 直采', src: 'ingest', desc: '3082 剧目 / 18 分类 / 订阅制 周$9.99 月$29.99 / 前 8 集免费第 9 集墙 / 投放栈 GA+FB Pixel+自建 track。' },
    { t: 'DramaMind 竞品对飙观测', meta: 'competitor · lanbow v1 · 16 页 PDF', src: 'competitor', desc: '匿名对飙：定价 / 选品 / 投放结构对比。' },
  ],
  alerts: [
    { lv: 'warn', t: '付费墙埋点疑似缺失', d: 'series_paid_episode_open=1 异常低（应≥订阅弹窗 19），顺序矛盾，待客户技术核。', time: '06-10' },
    { lv: 'warn', t: '近 7 天 0 笔支付', d: 'series_payment_success=0，待确认真 0 还是埋点未报。', time: '06-10' },
    { lv: 'warn', t: '站点异常偏高', d: 'website_exception_request_failed=7473，建议客户排查。', time: '06-10' },
  ],
  thresholds: [['stage', 'pilot', 'BRIEF'], ['d0_roas 稳定期目标', '0.60', 'BRIEF'], ['素材 3s 留存 ≥', '0.30', 'BRIEF'], ['ctr_target', '0.08', 'BRIEF']],
  rules: [
    { name: 'Meta 开投前置检查', cond: 'token 就绪 且 近30天花费=0', act: '提示开投', on: true },
    { name: '付费墙埋点校验', cond: 'paywall_view < 订阅弹窗', act: '触发数据告警', on: true },
  ],
  reconcile: [
    { label: '收入对账差 (DB VS STRIPE)', value: '—', tag: '待开投' },
    { label: 'DB 付费数 (UIDS)', value: '0', cls: 'warn', tag: '埋点待核' },
    { label: 'BEACON GAP (GA4 VS DB)', value: '—', tag: '近7天0支付' },
    { label: '真实 ROAS (REV/SPEND)', value: '—' },
  ],
};

// ── kwai 本地服务（磁力引擎） simulated ──
const kwai: Product = {
  id: 'kwai', label: '本地服务客户（示例·kwai渠道）', tenant: 'local-merchant-demo', sim: true,
  kpiSrc: '模拟·验证态 · 快手本地服务（磁力引擎·到店/留资漏斗，非真投放）',
  kpis: [
    { l: '今日花费', v: '¥3,200' }, { l: '线索成本 CPL', v: '¥28', d: '▼ 5.0%', dcls: 'up' },
    { l: '留资率', v: '6.4%', cls: 'good', d: '▲ 0.8%', dcls: 'up' }, { l: '到店转化', v: '38%', d: '▲ 2.0%', dcls: 'up' },
    { l: '到店成本', v: '¥74', d: '▼ 3.0%', dcls: 'up' }, { l: 'ROI', v: '2.1×', cls: 'good' },
    { l: '消耗/余额', v: '¥3.2K / ¥48K' }, { l: '在投计划', v: '12' },
  ],
  funnel: [
    { step: '①', label: '曝光', value: 185000, drop: null, kind: '' },
    { step: '②', label: '点击', value: 9200, drop: -95.0, kind: '' },
    { step: '③', label: '落地页', value: 6100, drop: -33.7, kind: '' },
    { step: '④', label: '留资/咨询', value: 392, drop: -93.6, kind: '' },
    { step: '⑤', label: '到店核销', value: 149, drop: -62.0, kind: 'proxy' },
    { step: '⑥', label: '成交', value: 96, drop: -35.6, kind: '' },
  ],
  geo: [
    { c: 'BJ', label: '北京', spend: 980, churn: 0, roas: 2.3, paid: 31 },
    { c: 'SH', label: '上海', spend: 760, churn: 0, roas: 2.0, paid: 24 },
    { c: 'GZ', label: '广州', spend: 520, churn: 0, roas: 1.9, paid: 18 },
    { c: 'CD', label: '成都', spend: 410, churn: 0, roas: 2.2, paid: 15 },
  ],
  series: [
    { t: '火锅·双人套餐', sess: 520, play: 0, paid: 38, roas: 2.4, st: 'good' },
    { t: '美容·体验卡', sess: 430, play: 0, paid: 29, roas: 2.0, st: 'good' },
    { t: '健身·月卡', sess: 300, play: 0, paid: 14, roas: 1.6, st: 'warn' },
  ],
  plans: [
    { camp: '本地服务_火锅_BJ_到店', spend: 980, imp: 62000, clicks: 3100, ctr: 5.0, cpm: 15.8, roi: 2.4, st: '放量', cid: 'ks1' },
    { camp: '本地服务_美容_SH_留资', spend: 760, imp: 48000, clicks: 2400, ctr: 5.0, cpm: 15.8, roi: 2.0, st: '观察', cid: 'ks2' },
    { camp: '本地服务_健身_GZ_月卡', spend: 520, imp: 38000, clicks: 1700, ctr: 4.5, cpm: 13.7, roi: 1.6, st: '观察', cid: 'ks3' },
    { camp: '本地服务_火锅_CD_团购', spend: 410, imp: 31000, clicks: 1500, ctr: 4.8, cpm: 13.2, roi: 2.2, st: '放量', cid: 'ks4' },
  ],
  accounts: [
    { plat: '磁力引擎', name: '火锅商家', aid: 'ks_acct_88xx', kind: '渠道', st: 'ok', stx: '已开户', bal: '¥18,400', sync: '2 min ago', meta: '模拟·已充值' },
    { plat: '磁力引擎', name: '美容商家', aid: 'ks_acct_77xx', kind: '渠道', st: 'ok', stx: '已开户', bal: '¥12,900', sync: '2 min ago', meta: '模拟·已充值' },
    { plat: '磁力引擎', name: '健身商家', aid: 'ks_acct_66xx', kind: '渠道', st: 'warn', stx: '余额预警', bal: '¥1,200', sync: '5 min ago', meta: '模拟·待充值' },
  ],
  research: [],
  alerts: [
    { lv: 'warn', t: '健身商家余额预警', d: '磁力引擎账户余额 ¥1,200 偏低，按当前消耗约 1.5 天耗尽，建议及时充值以免断投。', time: '10:05' },
  ],
  thresholds: [['stage', '放量', 'BRIEF'], ['cpl_target', '¥30', 'BRIEF'], ['到店转化 ≥', '0.30', 'BRIEF'], ['roi_target', '2.0', 'BRIEF']],
  rules: [
    { name: '余额预警充值', cond: '账户余额 < 2 天消耗', act: '飞书提醒充值', on: true },
    { name: '低 ROI 观察', cond: 'ROI < 1.8 连续 2 天', act: '转观察 / 换创意', on: true },
    { name: '高 ROI 放量', cond: 'ROI ≥ 2.2', act: '预算 +30%', on: true },
  ],
  reconcile: [
    { label: '收入对账差 (DB VS STRIPE)', value: '0.0%', cls: 'good', tag: 'webhook 健康' },
    { label: 'DB 付费数 (UIDS)', value: '—', tag: 'Stripe 条数待补源' },
    { label: 'BEACON GAP (CF VS DB)', value: '0.0%', cls: 'good', tag: 'data-gap $1' },
    { label: '真实 ROAS (REV/SPEND)', value: '0.000×', cls: 'crit' },
  ],
};

// ── Auvora（海外电商 DTC 护肤） — Meta + TikTok + Shopify ──
const ecom: Product = {
  id: 'auvora', label: '海外电商 · Auvora DTC', tenant: 'auvora-dtc', tz: 'PST', accts: 4,
  kpiSrc: 'META + TIKTOK + SHOPIFY · 真实 @ 2026-06-23 18:20 · 同比昨日',
  contentZh: '商品', playLabel: '复购%', funnelSrc: '展示→点击→商详→加购→支付',
  kpis: [
    { l: '今日花费', v: '$4,820', d: '▲ 12.0%', dcls: 'up' },
    { l: 'D0 ROAS', v: '2.85×', cls: 'good', d: '▲ 8.0%', dcls: 'up' },
    { l: '客单价 AOV', v: '$52.40', d: '▲ 3.2%', dcls: 'up' },
    { l: 'CTR', v: '1.92%', d: '▲ 0.2%', dcls: 'up' },
    { l: 'CPC', v: '$0.74', d: '▼ 6.0%', dcls: 'up' },
    { l: '转化率 CVR', v: '2.41%', d: '▲ 0.4%', dcls: 'up' },
    { l: 'CPA 获客成本', v: '$18.90', d: '▼ 5.0%', dcls: 'up' },
    { l: '加购率 ATC', v: '8.6%', cls: 'good' },
  ],
  funnel: [
    { step: '①', label: '广告展示 (Impr.)', value: 1240000, drop: null, kind: '' },
    { step: '②', label: '独立触达 (Reach)', value: 820000, drop: -33.9, kind: '' },
    { step: '③', label: '链接点击 (Link Click)', value: 23600, drop: -97.1, kind: '' },
    { step: '④', label: '落地页浏览 (LPV)', value: 19400, drop: -17.8, kind: '' },
    { step: '⑤', label: '商品详情页 (ViewContent)', value: 14200, drop: -26.8, kind: '' },
    { step: '⑥', label: '加入购物车 (AddToCart)', value: 4180, drop: -70.6, kind: '', abn: true },
    { step: '⑦', label: '发起结账 (InitiateCheckout)', value: 2240, drop: -46.4, kind: '' },
    { step: '⑧', label: '添加支付 (AddPaymentInfo)', value: 1560, drop: -30.4, kind: '' },
    { step: '⑨', label: '购买 (Purchase)', value: 1180, drop: -24.4, kind: '' },
  ],
  geo: [
    { c: 'US', label: 'United States', spend: 2100, churn: 0, roas: 3.1, paid: 560 },
    { c: 'GB', label: 'Great Britain', spend: 760, churn: 0, roas: 2.6, paid: 190 },
    { c: 'DE', label: 'Germany', spend: 640, churn: 0, roas: 2.4, paid: 150 },
    { c: 'AU', label: 'Australia', spend: 520, churn: 0, roas: 2.9, paid: 140 },
    { c: 'CA', label: 'Canada', spend: 480, churn: 0, roas: 2.7, paid: 130 },
  ],
  series: [
    { t: 'Glow Serum 30ml', sess: 3200, play: 22, paid: 168, roas: 3.2, st: 'good' },
    { t: 'Starter Kit (3-pc)', sess: 2100, play: 26, paid: 96, roas: 2.9, st: 'good' },
    { t: 'Night Repair Cream', sess: 2400, play: 18, paid: 122, roas: 2.6, st: 'good' },
    { t: 'Vitamin C Bundle', sess: 1900, play: 15, paid: 88, roas: 2.2, st: 'warn' },
    { t: 'Hydra Mist 100ml', sess: 1500, play: 12, paid: 64, roas: 1.7, st: 'warn' },
  ],
  plans: [
    { camp: 'Prospecting_US_Glow-Serum_Advantage+', spend: 1200, imp: 312000, clicks: 7500, ctr: 2.4, cpm: 3.85, roi: 3.2, st: '放量', cid: 'e1' },
    { camp: 'Retargeting_US_ATC-7d', spend: 640, imp: 98000, clicks: 3100, ctr: 3.2, cpm: 6.53, roi: 4.6, st: '放量', cid: 'e2' },
    { camp: 'Prospecting_EU_Bundle', spend: 720, imp: 198000, clicks: 3200, ctr: 1.6, cpm: 3.64, roi: 1.7, st: '观察', cid: 'e3' },
    { camp: 'TikTok_US_UGC_Spark', spend: 560, imp: 240000, clicks: 3800, ctr: 1.6, cpm: 2.33, roi: 2.2, st: '观察', cid: 'e4' },
    { camp: 'Prospecting_AU_Lookalike', spend: 480, imp: 132000, clicks: 2100, ctr: 1.6, cpm: 3.64, roi: 2.9, st: '放量', cid: 'e5' },
  ],
  accounts: [
    { plat: 'META', name: 'Auvora US BM', aid: 'act_55xx…3140', kind: '渠道', st: 'ok', stx: '已授权', bal: '$12,400', sync: '2 min ago', meta: '真实' },
    { plat: 'TIKTOK', name: 'Auvora TikTok Ads', aid: 'tt_77xx…9021', kind: '渠道', st: 'ok', stx: '已授权', bal: '$4,800', sync: '3 min ago', meta: '真实' },
    { plat: 'SHOPIFY', name: 'auvora.com', aid: '', kind: '独立站', st: 'ok', stx: '已授权', bal: '—', sync: '1 min ago', meta: 'GMV/订单' },
    { plat: 'STRIPE', name: '支付·Stripe', aid: '', kind: '支付', st: 'ok', stx: '已授权', bal: '—', sync: '5 min ago', meta: '结算' },
  ],
  research: [
    { t: 'DTC 护肤 Q2 投放基准', meta: 'market research · 2026-06-15', src: 'ingest', desc: '北美 DTC 护肤 Meta CPM $3-5、CTR 1.5-2.5%、首单 ROAS 2-3× 为对齐区间；UGC 素材 CTR 普遍高出制作片 30-50%。' },
    { t: 'Hims/Ro 落地页拆解', meta: 'competitor · 2026-06-12', src: 'competitor', desc: '竞品落地页前屏 = 痛点+权威背书+限时优惠；结账压缩到 2 步，加购→支付转化高出我方约 12pt。' },
    { t: 'AOV 提升：套装与满赠', meta: 'insight · 2026-06-09', src: 'insight', desc: '套装 SKU 客单价高约 35%；满 $60 免运提升加购率，建议默认勾选 3 件套。' },
  ],
  alerts: [
    { lv: 'crit', t: '加购→支付链路流失偏高', d: '商详→加购 (-70.6%)、加购→结账 (-46.4%) 两段流失高于行业基准，疑似落地页/结账体验问题，建议优先排查。', time: '18:20' },
    { lv: 'warn', t: 'EU 市场 ROAS 低于阈值', d: 'Prospecting_EU_Bundle ROI 1.7× 低于 2.0 目标，建议收缩预算或更换本地化素材。', time: '18:20' },
  ],
  thresholds: [['stage', '放量', 'BRIEF'], ['roas 目标', '2.0', 'BRIEF'], ['ctr_target', '0.018', 'BRIEF'], ['cpa 上限', '$25', 'BRIEF']],
  rules: [
    { name: '低 ROAS 关停', cond: 'D0 ROAS < 1.5 且花费 > $100', act: '暂停 ad set', on: true },
    { name: '高 ROAS 放量', cond: 'D0 ROAS ≥ 3.0 连续 2 天', act: '预算 +20%', on: true },
    { name: '加购再营销', cond: '7 日内加购未支付', act: '自动进再营销受众', on: true },
    { name: 'ATC 异常告警', cond: '加购→支付转化 < 行业基准', act: '触发体验排查', on: false },
  ],
  creative: {
    intro: '创意效果分析 + UGC 制作入口。',
    cta: '去做素材',
    hooksTitle: '创意 Hook A/B/C · CTR 对比',
    hooks: [
      { id: 'A', ctr: '2.4%', text: 'Dermatologists are calling it the 2-week glow. Here’s why thousands switched to…', imp: '84.0K', spend: '$312' },
      { id: 'B', ctr: '1.9%', text: 'I stopped wasting money on 7 serums. This one bottle replaced my whole shelf…', imp: '96.0K', spend: '$358' },
      { id: 'C', ctr: '1.6%', text: 'Your 5-minute morning routine, simplified. Clinically tested, cruelty-free, and…', imp: '72.0K', spend: '$268' },
    ],
    checkTitle: '创意检查清单 · Auvora Glow Serum',
    checks: [
      { k: 'Aspect ratio', v: '9:16', ok: true },
      { k: 'Lang', v: 'EN', ok: true },
      { k: 'CTR forecast', v: '2.4%', ok: true },
      { k: 'Hook type', v: 'UGC', ok: true },
      { k: 'Offer present', v: '20% OFF', ok: true },
      { k: 'Compliance', v: 'Passed', ok: true },
    ],
    topTitle: '创意 Top · 按花费',
    topRows: [
      { name: 'Glow Serum_UGC_A', acct: 'Meta_US_01', spend: '$640', imp: '312K', clicks: '7.5K', cpm: '$2.05', cpc: '$0.85', ctr: '2.4%', play3s: '41%', complete: '18%', paid: '168', roi: '3.2×', st: '放量' },
      { name: 'Night Repair_Demo_B', acct: 'Meta_US_01', spend: '$520', imp: '268K', clicks: '5.1K', cpm: '$1.94', cpc: '$1.02', ctr: '1.9%', play3s: '36%', complete: '14%', paid: '122', roi: '2.6×', st: '观察' },
      { name: 'Bundle_Carousel_C', acct: 'TikTok_US', spend: '$410', imp: '240K', clicks: '3.8K', cpm: '$1.71', cpc: '$1.08', ctr: '1.6%', play3s: '30%', complete: '11%', paid: '88', roi: '2.2×', st: '观察' },
      { name: 'Vitamin C_Hook_D', acct: 'Meta_EU', spend: '$360', imp: '198K', clicks: '3.2K', cpm: '$1.82', cpc: '$1.13', ctr: '1.6%', play3s: '28%', complete: '9%', paid: '64', roi: '1.7×', st: '警戒' },
    ],
  },
  reconcile: [
    { label: '收入对账差 (SHOPIFY VS STRIPE)', value: '0.3%', cls: 'good', tag: 'webhook 健康' },
    { label: '订单数 (Orders)', value: '1,180', tag: '四源对齐' },
    { label: 'PIXEL GAP (CAPI VS PIXEL)', value: '1.2%', cls: 'warn', tag: 'data-gap $0' },
    { label: '真实 ROAS (REV/SPEND)', value: '2.85×', cls: 'good' },
  ],
  breakdowns: [
    { title: '版位 Placement', rows: [{ k: 'Feed', v: '42%', pct: 42 }, { k: 'Reels', v: '31%', pct: 31 }, { k: 'Stories', v: '18%', pct: 18 }, { k: 'Search', v: '9%', pct: 9 }] },
    { title: '设备 Device', rows: [{ k: 'iOS', v: '64%', pct: 64 }, { k: 'Android', v: '33%', pct: 33 }, { k: 'Web', v: '3%', pct: 3 }] },
    { title: '受众 Audience', rows: [{ k: 'Lookalike 1%', v: '48%', pct: 48 }, { k: 'Interest', v: '34%', pct: 34 }, { k: 'Retargeting', v: '18%', pct: 18 }] },
  ],
};

export const PRODUCTS: Product[] = [drama, mindramas, ecom, kwai];

// ── anomaly cards derived from a product's funnel (biggest drops / abnormal nodes) ──
export interface Anomaly { pct: string; from: string; to: string; people: string; lv: 'crit' | 'warn'; }
export function anomalies(p: Product): Anomaly[] {
  const out: Anomaly[] = [];
  for (let i = 1; i < p.funnel.length; i++) {
    const cur = p.funnel[i], prev = p.funnel[i - 1];
    if (cur.abn || (cur.drop != null && Math.abs(cur.drop) >= 60)) {
      const pct = cur.drop != null ? `${Math.abs(cur.drop).toFixed(1)}%` : '100.0%';
      out.push({ pct, from: prev.label, to: cur.label, people: `${cur.value} ← ${prev.value} 人`, lv: cur.abn ? 'crit' : 'warn' });
    }
  }
  // ensure at least the headline anomaly
  if (!out.length && p.funnel.length > 9) {
    out.push({ pct: '3.2%', from: p.funnel[8].label, to: p.funnel[9].label, people: `${p.funnel[9].value} ← ${p.funnel[8].value} 人`, lv: 'warn' });
  }
  return out.slice(0, 3);
}
