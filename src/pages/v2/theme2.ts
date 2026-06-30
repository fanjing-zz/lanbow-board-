// ── Per-theme raw values ──────────────────────────────────────────────────────
const darkVars = {
  bgBase:      '#071015',
  bgPanel:     'rgba(11,23,32,0.82)',
  bgCard:      '#0E1D28',
  bgInput:     '#091318',
  bgBubble:    '#101C26',
  bgElevated:  'rgba(10,20,30,0.90)',
  accent:      '#00B1A2',
  accentMid:   '#008E82',
  accentDim:   'rgba(0,177,162,0.12)',
  accentGlow:  'rgba(0,177,162,0.30)',
  green:       '#00CC77',
  greenDim:    'rgba(0,204,119,0.15)',
  blue:        '#3B82F6',
  textPri:     '#BDD8E8',
  textSec:     '#6B9EAF',
  textMute:    '#3D6575',
  textLabel:   '#4A7585',
  border:      'rgba(0,177,162,0.10)',
  borderStrong:'rgba(0,177,162,0.26)',
  overlayBg:   'rgba(4,10,14,0.55)',
  bgFloat:     'rgba(7,16,21,0.96)',
  bgFrost:     'rgba(7,16,21,0.78)',
  shadowColor: 'rgba(0,0,0,0.60)',
  accentGlowLg:'rgba(0,177,162,0.14)',
  cardShadow:  'inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(0,177,162,0.13), 0 8px 28px rgba(0,0,0,0.50)',
  panelShadowR:'inset -1px 0 0 rgba(255,255,255,0.03), 4px 0 28px rgba(0,0,0,0.40)',
  panelShadowD:'inset 0 -1px 0 rgba(255,255,255,0.02), 0 8px 32px rgba(0,0,0,0.35)',
  panelShadowL:'inset 1px 0 0 rgba(255,255,255,0.03), -8px 0 32px rgba(0,0,0,0.35)',
};

const lightVars = {
  bgBase:      '#E7ECF1',
  bgPanel:     'rgba(255,255,255,0.88)',
  bgCard:      '#FFFFFF',
  bgInput:     '#EEF2F6',
  bgBubble:    '#F4F7FA',
  bgElevated:  'rgba(255,255,255,0.96)',
  accent:      '#00897B',
  accentMid:   '#00695C',
  accentDim:   'rgba(0,137,123,0.08)',
  accentGlow:  'rgba(0,137,123,0.18)',
  green:       '#059669',
  greenDim:    'rgba(5,150,105,0.10)',
  blue:        '#2563EB',
  textPri:     '#16242E',
  textSec:     '#4A7080',
  textMute:    '#8AACBC',
  textLabel:   '#5A8090',
  border:      'rgba(28,46,56,0.10)',
  borderStrong:'rgba(28,46,56,0.16)',
  overlayBg:   'rgba(15,30,40,0.28)',
  bgFloat:     'rgba(255,255,255,0.94)',
  bgFrost:     'rgba(255,255,255,0.80)',
  shadowColor: 'rgba(20,40,55,0.10)',
  accentGlowLg:'rgba(0,137,123,0.05)',
  cardShadow:  'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 3px rgba(20,40,55,0.06), 0 6px 18px rgba(20,40,55,0.05)',
  panelShadowR:'inset -1px 0 0 rgba(255,255,255,0.7), 4px 0 24px rgba(20,40,55,0.05)',
  panelShadowD:'inset 0 -1px 0 rgba(255,255,255,0.6), 0 6px 22px rgba(20,40,55,0.05)',
  panelShadowL:'inset 1px 0 0 rgba(255,255,255,0.7), -6px 0 22px rgba(20,40,55,0.05)',
};

type Vars = typeof darkVars;

const CSS_VARS: Record<keyof Vars, string> = {
  bgBase:      '--c-bg-base',
  bgPanel:     '--c-bg-panel',
  bgCard:      '--c-bg-card',
  bgInput:     '--c-bg-input',
  bgBubble:    '--c-bg-bubble',
  bgElevated:  '--c-bg-elevated',
  accent:      '--c-accent',
  accentMid:   '--c-accent-mid',
  accentDim:   '--c-accent-dim',
  accentGlow:  '--c-accent-glow',
  green:       '--c-green',
  greenDim:    '--c-green-dim',
  blue:        '--c-blue',
  textPri:     '--c-text-pri',
  textSec:     '--c-text-sec',
  textMute:    '--c-text-mute',
  textLabel:   '--c-text-label',
  border:      '--c-border',
  borderStrong:'--c-border-strong',
  overlayBg:   '--c-overlay-bg',
  bgFloat:     '--c-bg-float',
  bgFrost:     '--c-bg-frost',
  shadowColor: '--c-shadow-color',
  accentGlowLg:'--c-accent-glow-lg',
  cardShadow:  '--c-card-shadow',
  panelShadowR:'--c-panel-shadow-r',
  panelShadowD:'--c-panel-shadow-d',
  panelShadowL:'--c-panel-shadow-l',
};

export function applyTheme(isDark: boolean): void {
  const vals: Vars = isDark ? darkVars : lightVars;
  const root = document.documentElement;
  (Object.keys(CSS_VARS) as Array<keyof Vars>).forEach(k => {
    root.style.setProperty(CSS_VARS[k], vals[k]);
  });
  root.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

// Apply dark theme immediately so components have values on first paint
applyTheme(true);

// c: CSS variable references — works in any inline style prop
export const c = {
  bgBase:      'var(--c-bg-base)',
  bgPanel:     'var(--c-bg-panel)',
  bgCard:      'var(--c-bg-card)',
  bgInput:     'var(--c-bg-input)',
  bgBubble:    'var(--c-bg-bubble)',
  bgElevated:  'var(--c-bg-elevated)',
  accent:      'var(--c-accent)',
  accentMid:   'var(--c-accent-mid)',
  accentDim:   'var(--c-accent-dim)',
  accentGlow:  'var(--c-accent-glow)',
  green:       'var(--c-green)',
  greenDim:    'var(--c-green-dim)',
  blue:        'var(--c-blue)',
  textPri:     'var(--c-text-pri)',
  textSec:     'var(--c-text-sec)',
  textMute:    'var(--c-text-mute)',
  textLabel:   'var(--c-text-label)',
  border:      'var(--c-border)',
  borderStrong:'var(--c-border-strong)',
  overlayBg:   'var(--c-overlay-bg)',
  bgFloat:     'var(--c-bg-float)',
  bgFrost:     'var(--c-bg-frost)',
  shadowColor: 'var(--c-shadow-color)',
  accentGlowLg:'var(--c-accent-glow-lg)',
  cardShadow:  'var(--c-card-shadow)',
  panelShadowR:'var(--c-panel-shadow-r)',
  panelShadowD:'var(--c-panel-shadow-d)',
  panelShadowL:'var(--c-panel-shadow-l)',
  mono: "'Inter',system-ui,sans-serif",
  sans: "'Inter',system-ui,sans-serif",
};

// ── radius scale (single source) — strict to Figma 3097-11961 (sharp/technical) ──
export const R = { card: 2, nav: 4, ctrl: 6, chip: 4, badge: 4, bar: 3, pill: 6 };
