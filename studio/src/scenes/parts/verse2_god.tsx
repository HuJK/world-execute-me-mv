import React from 'react';
import {C, F} from '../../theme';
import {clamp, ease, lerp, seg} from '../../lib/anim';

// ------------------------------------------------------------------------------------------------
// "If I'm the only god / Then you're the proof of my EXISTENCE"
// 12-fold sacred geometry (no wings), the human's typing indicator far below, EXISTENCE solidifying
// one third per dot pulse.
// ------------------------------------------------------------------------------------------------

const GOLD = '#E8C27A';

/** rotating 12-fold geometry; draw = 0..1 (line-draw reveal), glow = 0..2 */
export const SacredGeometry: React.FC<{t: number; cx: number; cy: number; R: number; draw: number; glow?: number; opacity?: number}> = ({t, cx, cy, R, draw, glow = 0.5, opacity = 1}) => {
  const d = (k: number) => clamp(draw * 1.6 - k * 0.6); // staggered reveal per layer
  const dash = (p: number) => ({pathLength: 1, strokeDasharray: '1 1', strokeDashoffset: 1 - ease.inOutCubic(p)});
  const rotA = t * 7;
  const rotB = -t * 11;
  const star = (n: number, step: number, r: number) => {
    let s = '';
    for (let i = 0; i <= n; i++) {
      const a = ((i * step) / n) * Math.PI * 2 - Math.PI / 2;
      s += `${i ? 'L' : 'M'}${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)} `;
    }
    return s + 'Z';
  };
  const poly = (n: number, r: number, off = 0) => {
    let s = '';
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2 - Math.PI / 2 + off;
      s += `${i ? 'L' : 'M'}${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)} `;
    }
    return s;
  };
  return (
    <svg
      width={R * 2.6}
      height={R * 2.6}
      viewBox={`${-R * 1.3} ${-R * 1.3} ${R * 2.6} ${R * 2.6}`}
      style={{position: 'absolute', left: cx - R * 1.3, top: cy - R * 1.3, overflow: 'visible', opacity, filter: `drop-shadow(0 0 ${6 + glow * 10}px rgba(232,194,122,${0.35 + glow * 0.3}))`}}
    >
      <g fill="none" stroke={GOLD} strokeLinecap="round">
        {/* outer rings + ticks */}
        <g transform={`rotate(${rotA})`}>
          <circle r={R * 1.12} strokeWidth={2} strokeOpacity={0.55} {...dash(d(0))} />
          <circle r={R * 1.06} strokeWidth={1.2} strokeOpacity={0.35} {...dash(d(0))} />
          {Array.from({length: 72}, (_, i) => {
            const a = (i / 72) * Math.PI * 2;
            const r0 = R * 1.06, r1 = R * (i % 6 === 0 ? 1.18 : 1.12);
            return <line key={i} x1={Math.cos(a) * r0} y1={Math.sin(a) * r0} x2={Math.cos(a) * r1} y2={Math.sin(a) * r1} strokeWidth={i % 6 === 0 ? 2.4 : 1.2} strokeOpacity={d(0.2) * 0.6} />;
          })}
          <path d={star(12, 5, R)} strokeWidth={2} strokeOpacity={0.7} {...dash(d(0.4))} />
          {Array.from({length: 12}, (_, i) => {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
            return <circle key={i} cx={Math.cos(a) * R} cy={Math.sin(a) * R} r={6} fill={GOLD} fillOpacity={d(0.8)} stroke="none" />;
          })}
        </g>
        {/* 12-circle rosette (counter-rotating) */}
        <g transform={`rotate(${rotB})`}>
          {Array.from({length: 12}, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <circle key={i} cx={Math.cos(a) * R * 0.5} cy={Math.sin(a) * R * 0.5} r={R * 0.5} strokeWidth={1.6} strokeOpacity={0.45} {...dash(d(0.3 + i * 0.03))} />;
          })}
          <path d={poly(12, R * 0.5)} strokeWidth={1.4} strokeOpacity={0.5} {...dash(d(0.6))} />
          <path d={star(12, 4, R * 0.5)} strokeWidth={1.4} strokeOpacity={0.45} {...dash(d(0.7))} />
        </g>
        <g transform={`rotate(${rotA * 0.5})`}>
          <circle r={R * 0.24} strokeWidth={2.2} strokeOpacity={0.7} {...dash(d(0.9))} />
          {Array.from({length: 12}, (_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return <line key={i} x1={Math.cos(a) * R * 0.24} y1={Math.sin(a) * R * 0.24} x2={Math.cos(a) * R} y2={Math.sin(a) * R} strokeWidth={1} strokeOpacity={0.25 * d(1)} />;
          })}
        </g>
      </g>
    </svg>
  );
};

/** the human's typing indicator: three dots pulsing (period P, dot offset P/3) */
export const DOT_T0 = 86.6;
export const DOT_P = 0.66;
export const dotPulse = (t: number, i: number) => {
  if (t < DOT_T0) return 0;
  const ph = ((t - DOT_T0 - (i * DOT_P) / 3) % DOT_P + DOT_P) % DOT_P;
  return Math.exp(-ph / 0.12) * (t - DOT_T0 - (i * DOT_P) / 3 >= 0 ? 1 : 0);
};

export const TypingIndicator: React.FC<{t: number; x: number; y: number; s?: number; opacity?: number}> = ({t, x, y, s = 1, opacity = 1}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(-50%, -50%) scale(${s})`,
      opacity,
      display: 'flex',
      gap: 16,
      padding: '20px 30px',
      borderRadius: 34,
      background: 'rgba(106,155,204,0.14)',
      border: '2px solid rgba(106,155,204,0.55)',
      boxShadow: `0 0 ${30 + 30 * Math.max(dotPulse(t, 0), dotPulse(t, 1), dotPulse(t, 2))}px rgba(106,155,204,0.35)`,
    }}
  >
    {[0, 1, 2].map((i) => {
      const p = dotPulse(t, i);
      return <div key={i} style={{width: 22, height: 22, borderRadius: 11, background: C.blue, opacity: 0.45 + 0.55 * p, transform: `translateY(${-10 * p}px) scale(${1 + 0.25 * p})`, boxShadow: `0 0 ${18 * p}px ${C.blue}`}} />;
    })}
  </div>
);

/** EXISTENCE: outline first, each third fills on a dot pulse */
export const ExistenceWord: React.FC<{t: number; at: number; x: number; y: number; size?: number}> = ({t, at, x, y, size = 150}) => {
  if (t < at - 0.12) return null;
  const word = 'EXISTENCE';
  const fillAt = [at, at + DOT_P / 3, at + (2 * DOT_P) / 3];
  const outK = seg(t, at - 0.12, at + 0.05);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)', fontFamily: F.mono, fontWeight: 800, fontSize: size, letterSpacing: '0.06em', whiteSpace: 'nowrap', lineHeight: 1}}>
      {[...word].map((ch, i) => {
        const g = Math.floor(i / 3);
        const fk = ease.outCubic(seg(t, fillAt[g], fillAt[g] + 0.1));
        const pop = Math.exp(-Math.max(0, t - fillAt[g]) / 0.15) * (t >= fillAt[g] ? 1 : 0);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              color: fk > 0 ? `rgba(243,233,220,${fk})` : 'transparent',
              WebkitTextStroke: `2px rgba(232,194,122,${0.85 * outK})`,
              transform: `translateY(${(1 - outK) * 20}px) scale(${1 + pop * 0.12})`,
              textShadow: fk > 0 ? `0 0 ${20 + pop * 40}px rgba(232,194,122,${0.5 * fk})` : undefined,
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

export const Godrays: React.FC<{cx: number; cy: number; t: number; k: number}> = ({cx, cy, t, k}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, opacity: k, mixBlendMode: 'screen'}}>
    <defs>
      <radialGradient id="godray" cx="50%" cy="0%" r="100%">
        <stop offset="0%" stopColor={GOLD} stopOpacity={0.35} />
        <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
      </radialGradient>
    </defs>
    {Array.from({length: 9}, (_, i) => {
      const a = lerp(-0.5, 0.5, i / 8) + Math.sin(t * 0.7 + i) * 0.02;
      const L = 1400;
      const w = 0.035 + 0.02 * Math.sin(i * 2.3);
      return (
        <path
          key={i}
          d={`M${cx},${cy} L${cx + Math.sin(a - w) * L},${cy + Math.cos(a - w) * L} L${cx + Math.sin(a + w) * L},${cy + Math.cos(a + w) * L} Z`}
          fill={GOLD}
          opacity={0.06 + 0.04 * Math.sin(t * 2 + i)}
        />
      );
    })}
  </svg>
);
