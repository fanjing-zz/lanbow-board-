import React from 'react';
import { c, Z } from './theme2';

// Rose-curve particle "thinking" loader.
// Ported from github.com/Paidax01/math-curve-loaders (original.js) — themed via currentColor.
export function MathLoader({ size = 44, color }: { size?: number; color?: string }) {
  const gRef = React.useRef<SVGGElement>(null);
  const bgRef = React.useRef<SVGPathElement>(null);

  React.useEffect(() => {
    const g = gRef.current, bg = bgRef.current;
    if (!g || !bg) return;
    const NS = 'http://www.w3.org/2000/svg';
    const COUNT = 48, BASE = 7, PETALS = 7, DETAIL = 3, SCALE = 3.9, TRAIL = 0.38, ROT = 28000, PULSE = 4200, DUR = 4600;
    const norm = (p: number) => ((p % 1) + 1) % 1;
    const point = (p: number, ds: number) => {
      const t = norm(p) * Math.PI * 2;
      return { x: 50 + (BASE * Math.cos(t) - DETAIL * ds * Math.cos(PETALS * t)) * SCALE, y: 50 + (BASE * Math.sin(t) - DETAIL * ds * Math.sin(PETALS * t)) * SCALE };
    };
    const buildPath = (ds: number, steps = 220) => Array.from({ length: steps + 1 }, (_, i) => { const pt = point(i / steps, ds); return `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`; }).join(' ');
    const detail = (t: number) => 0.5 + ((Math.sin((t % PULSE) / PULSE * Math.PI * 2 + 0.55) + 1) / 2) * 0.45;
    const rotate = (t: number) => -((t % ROT) / ROT) * 360;

    const circles = Array.from({ length: COUNT }, () => { const el = document.createElementNS(NS, 'circle'); el.setAttribute('fill', 'currentColor'); g.appendChild(el); return el; });
    const started = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const time = now - started, progress = (time % DUR) / DUR, ds = detail(time);
      g.setAttribute('transform', `rotate(${rotate(time)} 50 50)`);
      bg.setAttribute('d', buildPath(ds));
      circles.forEach((node, i) => {
        const off = i / (COUNT - 1), pt = point(progress - off * TRAIL, ds), fade = Math.pow(1 - off, 0.58);
        node.setAttribute('cx', pt.x.toFixed(2)); node.setAttribute('cy', pt.y.toFixed(2));
        node.setAttribute('r', (1.05 + fade * 2.75).toFixed(2)); node.setAttribute('opacity', (0.08 + fade * 0.92).toFixed(3));
      });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); circles.forEach(el => el.remove()); };
  }, []);

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} fill="none" aria-hidden style={{ color: color || c.accent, overflow: 'visible', flexShrink: 0 }}>
      <g ref={gRef}><path ref={bgRef} stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.1" /></g>
    </svg>
  );
}

// Full-area loading overlay (frosted) — used while data is "fetching".
export function LoaderOverlay({ label = '加载中…' }: { label?: string }) {
  return (
    <div style={{ position: 'fixed', left: 60, top: 56, right: 0, bottom: 0, zIndex: Z.loader, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
      background: c.bgBase + '66', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)' }}>
      <MathLoader size={64} />
      <span style={{ fontFamily: c.mono, fontSize: 11, color: c.textMute, textTransform: 'uppercase', letterSpacing: '0.14em' }}>{label}</span>
    </div>
  );
}
