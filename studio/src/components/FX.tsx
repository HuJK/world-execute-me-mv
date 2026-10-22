import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, H, W} from '../theme';
import {clamp, ease, hash, lerp, noise1, rand, seg} from '../lib/anim';
import {Flower} from './Flower';

/** The human: a blue cursor arrow (macOS-like pointer) */
export const Cursor: React.FC<{x: number; y: number; size?: number; color?: string; opacity?: number; press?: number; rotate?: number; hand?: boolean}> = ({
  x,
  y,
  size = 40,
  color = C.blue,
  opacity = 1,
  press = 0,
  rotate = 0,
  hand = false,
}) => (
  <svg
    width={size}
    height={size * 1.3}
    viewBox="0 0 20 26"
    style={{
      position: 'absolute',
      left: x,
      top: y,
      opacity,
      overflow: 'visible',
      transform: `rotate(${rotate}deg) scale(${1 - press * 0.15})`,
      transformOrigin: '0 0',
      filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.25))',
    }}
  >
    {press > 0 ? <circle cx="1" cy="1" r={6 + press * 10} fill="none" stroke={color} strokeWidth={1.4} opacity={1 - press} /> : null}
    {hand ? (
      <path d="M7 11V3.5a1.6 1.6 0 0 1 3.2 0V10m0-1.2a1.6 1.6 0 0 1 3.2 0V11m0-1a1.6 1.6 0 0 1 3.2 0v2a1.6 1.6 0 0 1 3.2 0V17c0 4-2.6 7-6.6 7H11c-2.6 0-4-1-5.4-3L2.4 16a1.7 1.7 0 0 1 2.6-2.2L7 15.6z" fill={color} stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" />
    ) : (
      <path d="M1 1 L1 20 L6 15.5 L9.6 23.5 L13 22 L9.4 14.2 L16 14.2 Z" fill={color} stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
    )}
  </svg>
);

export const Flash: React.FC<{t: number; at: number; dur?: number; color?: string; max?: number}> = ({t, at, dur = 0.35, color = '#fff', max = 1}) => {
  if (t < at || t > at + dur) return null;
  const k = 1 - (t - at) / dur;
  return <AbsoluteFill style={{background: color, opacity: max * k * k, pointerEvents: 'none'}} />;
};

export const Vignette: React.FC<{strength?: number; color?: string}> = ({strength = 0.5, color = '0,0,0'}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, rgba(${color},0) 55%, rgba(${color},${strength}) 100%)`, pointerEvents: 'none'}} />
);

/** subtle animated film grain (SVG turbulence, seed changes per frame-ish) */
export const Grain: React.FC<{t: number; opacity?: number}> = ({t, opacity = 0.06}) => {
  const seed = Math.floor(t * 24) % 50;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity, mixBlendMode: 'overlay'}}>
      <svg width={W} height={H}>
        <filter id={`grain${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={W} height={H} filter={`url(#grain${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const GraphPaper: React.FC<{step?: number; color?: string; major?: number; opacity?: number; ox?: number; oy?: number; bg?: string}> = ({
  step = 40,
  color = C.ink,
  major = 5,
  opacity = 1,
  ox = 0,
  oy = 0,
  bg,
}) => (
  <AbsoluteFill
    style={{
      background: bg,
      opacity,
      backgroundImage: `linear-gradient(${color}22 1px, transparent 1px), linear-gradient(90deg, ${color}22 1px, transparent 1px), linear-gradient(${color}10 1px, transparent 1px), linear-gradient(90deg, ${color}10 1px, transparent 1px)`,
      backgroundSize: `${step * major}px ${step * major}px, ${step * major}px ${step * major}px, ${step}px ${step}px, ${step}px ${step}px`,
      backgroundPosition: `${ox}px ${oy}px`,
    }}
  />
);

/** glass dome / sphere outline with specular highlight (PROTECTION) */
export const GlassSphere: React.FC<{x: number; y: number; r: number; k?: number; color?: string; cracks?: number; t?: number; seed?: number}> = ({
  x,
  y,
  r,
  k = 1,
  color = C.cream,
  cracks = 0,
  t = 0,
  seed = 3,
}) => {
  const lines = [] as React.ReactNode[];
  if (cracks > 0) {
    for (let i = 0; i < 9; i++) {
      const a0 = rand(seed, i) * Math.PI * 2;
      let px = Math.cos(a0) * r * 0.15, py = Math.sin(a0) * r * 0.15;
      let d = `M${px},${py}`;
      const steps = 6;
      for (let s = 1; s <= steps; s++) {
        const rr = (r * s) / steps;
        const a = a0 + (rand(seed + s, i) - 0.5) * 0.5;
        px = Math.cos(a) * rr * cracks;
        py = Math.sin(a) * rr * cracks;
        d += ` L${px},${py}`;
      }
      lines.push(<path key={i} d={d} stroke={color} strokeWidth={2} fill="none" opacity={0.8} />);
    }
  }
  return (
    <svg style={{position: 'absolute', left: x - r * 1.2, top: y - r * 1.2, overflow: 'visible'}} width={r * 2.4} height={r * 2.4} viewBox={`${-r * 1.2} ${-r * 1.2} ${r * 2.4} ${r * 2.4}`}>
      <defs>
        <radialGradient id="glassfill" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={0.16 * k} />
          <stop offset="70%" stopColor="#ffffff" stopOpacity={0.03 * k} />
          <stop offset="100%" stopColor={color} stopOpacity={0.18 * k} />
        </radialGradient>
      </defs>
      <circle r={r} fill="url(#glassfill)" stroke={color} strokeOpacity={0.55 * k} strokeWidth={2.5} strokeDasharray={`${2 * Math.PI * r * k} ${2 * Math.PI * r}`} transform="rotate(-90)" />
      <circle r={r * 0.94} fill="none" stroke={color} strokeOpacity={0.18 * k} strokeWidth={1.2} />
      <path d={`M${-r * 0.62},${-r * 0.42} A${r * 0.78},${r * 0.78} 0 0 1 ${-r * 0.12},${-r * 0.74}`} stroke="#fff" strokeOpacity={0.65 * k} strokeWidth={r * 0.045} strokeLinecap="round" fill="none" />
      <path d={`M${r * 0.55},${r * 0.5} A${r * 0.78},${r * 0.78} 0 0 1 ${r * 0.3},${r * 0.68}`} stroke="#fff" strokeOpacity={0.3 * k} strokeWidth={r * 0.025} strokeLinecap="round" fill="none" />
      {lines}
    </svg>
  );
};

/** drifting petals (deterministic) */
export const PetalField: React.FC<{t: number; n?: number; seed?: number; color?: string; size?: [number, number]; speed?: number; area?: [number, number, number, number]; opacity?: number; dir?: number}> = ({
  t,
  n = 30,
  seed = 7,
  color = C.clay,
  size = [10, 22],
  speed = 60,
  area = [0, 0, W, H],
  opacity = 1,
  dir = 1,
}) => {
  const [ax, ay, aw, ah] = area;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
        {Array.from({length: n}, (_, i) => {
          const s = lerp(size[0], size[1], rand(seed, i));
          const v = speed * lerp(0.6, 1.4, rand(seed + 1, i));
          const x0 = ax + rand(seed + 2, i) * aw;
          const y = ay + ((rand(seed + 3, i) * (ah + 200) + t * v * dir) % (ah + 200)) - 100;
          const x = x0 + Math.sin(t * lerp(0.6, 1.4, rand(seed + 4, i)) + i) * 40;
          const r = t * lerp(-90, 90, rand(seed + 5, i)) + i * 37;
          return (
            <path
              key={i}
              d={`M0,${-s} C${s * 0.55},${-s * 0.6} ${s * 0.5},${s * 0.4} 0,${s * 0.55} C${-s * 0.5},${s * 0.4} ${-s * 0.55},${-s * 0.6} 0,${-s} Z`}
              fill={color}
              transform={`translate(${x} ${y}) rotate(${r}) scale(1 ${0.6 + 0.4 * Math.cos(t * 2 + i)})`}
              opacity={0.85}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** generic screen shake from a list of hit times */
export const shake = (t: number, hits: number[], amp = 14, tau = 0.12) => {
  let x = 0, y = 0;
  for (const h of hits) {
    if (t < h || t > h + tau * 6) continue;
    const k = Math.exp(-(t - h) / tau);
    x += noise1((t - h) * 40, h) * amp * k;
    y += noise1((t - h) * 40, h + 9) * amp * k;
  }
  return {x, y};
};

/** RGB-split + slice glitch wrapper (use sparingly) */
export const Glitch: React.FC<{t: number; amount: number; children: React.ReactNode; seed?: number}> = ({t, amount, children, seed = 1}) => {
  if (amount <= 0.001) return <>{children}</>;
  const f = Math.floor(t * 30);
  const slices = Array.from({length: 7}, (_, i) => {
    const y0 = rand(seed + f, i) * H;
    const h = 8 + rand(seed + f, i + 20) * 70;
    const dx = (rand(seed + f, i + 40) - 0.5) * 120 * amount;
    return {y0, h, dx};
  });
  const sep = 12 * amount;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="glitchR" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
        </filter>
        <filter id="glitchGB" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" />
        </filter>
      </svg>
      <AbsoluteFill style={{filter: 'url(#glitchGB)'}}>{children}</AbsoluteFill>
      <AbsoluteFill style={{filter: 'url(#glitchR)', transform: `translateX(${sep}px)`, mixBlendMode: 'screen'}}>{children}</AbsoluteFill>
      {slices.map((s, i) => (
        <AbsoluteFill key={i} style={{clipPath: `inset(${s.y0}px 0 ${Math.max(0, H - s.y0 - s.h)}px 0)`, transform: `translateX(${s.dx}px)`}}>
          {children}
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};

/** Burst of rays from a point */
export const RayBurst: React.FC<{x: number; y: number; t: number; at: number; dur?: number; n?: number; r0?: number; r1?: number; color?: string; width?: number; seed?: number}> = ({
  x,
  y,
  t,
  at,
  dur = 0.6,
  n = 24,
  r0 = 60,
  r1 = 600,
  color = C.clay,
  width = 4,
  seed = 5,
}) => {
  if (t < at || t > at + dur) return null;
  const p = (t - at) / dur;
  const e = ease.outCubic(p);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}} width={W} height={H}>
      {Array.from({length: n}, (_, i) => {
        const a = (i / n) * Math.PI * 2 + rand(seed, i) * 0.2;
        const len = lerp(0.4, 1, rand(seed + 1, i));
        const ra = lerp(r0, r1 * len, e);
        const rb = lerp(r0, r1 * len, ease.outCubic(clamp(p * 1.6 - 0.3)));
        return (
          <line
            key={i}
            x1={x + Math.cos(a) * rb}
            y1={y + Math.sin(a) * rb}
            x2={x + Math.cos(a) * ra}
            y2={y + Math.sin(a) * ra}
            stroke={color}
            strokeWidth={width * (1 - p)}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};

/** Expanding ring */
export const Ring: React.FC<{x: number; y: number; t: number; at: number; dur?: number; r0?: number; r1?: number; color?: string; width?: number}> = ({
  x,
  y,
  t,
  at,
  dur = 0.6,
  r0 = 20,
  r1 = 400,
  color = C.clay,
  width = 6,
}) => {
  if (t < at || t > at + dur) return null;
  const p = (t - at) / dur;
  const r = lerp(r0, r1, ease.outCubic(p));
  return (
    <svg style={{position: 'absolute', left: x - r - width, top: y - r - width, overflow: 'visible', pointerEvents: 'none'}} width={2 * r + 2 * width} height={2 * r + 2 * width}>
      <circle cx={r + width} cy={r + width} r={r} fill="none" stroke={color} strokeWidth={width * (1 - p) + 0.5} opacity={1 - p * 0.8} />
    </svg>
  );
};

/** Little flower 'poof' for costume changes */
export const Poof: React.FC<{x: number; y: number; t: number; at: number; size?: number; color?: string}> = ({x, y, t, at, size = 220, color = C.clay}) => {
  if (t < at - 0.02 || t > at + 0.7) return null;
  const p = clamp((t - at) / 0.7);
  return (
    <>
      {Array.from({length: 12}, (_, i) => {
        const a = (i / 12) * Math.PI * 2 + 0.3;
        const d = size * ease.outCubic(p) * lerp(0.7, 1.1, hash(i + 3));
        return (
          <Flower
            key={i}
            size={size * 0.13 * (1 - p * 0.7)}
            x={x + Math.cos(a) * d}
            y={y + Math.sin(a) * d}
            spin={p * 200 + i * 30}
            opacity={1 - p}
            color={i % 3 === 0 ? C.cream : color}
            centerColor={i % 3 === 0 ? color : C.cream}
            shade={null}
          />
        );
      })}
      <svg style={{position: 'absolute', left: x - size, top: y - size, overflow: 'visible'}} width={size * 2} height={size * 2}>
        <circle cx={size} cy={size} r={size * 0.25 + size * 0.6 * ease.outCubic(p)} fill={C.cream} opacity={0.9 * (1 - p)} />
      </svg>
    </>
  );
};

/** Window chrome for desktop windows */
export const OSWindow: React.FC<{x: number; y: number; w: number; h: number; title?: string; dark?: boolean; children?: React.ReactNode; style?: React.CSSProperties; accent?: string}> = ({
  x,
  y,
  w,
  h,
  title = '',
  dark = false,
  children,
  style,
  accent,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 14,
      overflow: 'hidden',
      background: dark ? '#1c1c1b' : '#fdfcf9',
      boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
      border: `1px solid ${dark ? '#3a3a38' : '#ddd9cf'}`,
      ...style,
    }}
  >
    <div style={{height: 34, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', background: dark ? '#262624' : '#f0eee6', borderBottom: `1px solid ${dark ? '#3a3a38' : '#e2ded3'}`}}>
      <div style={{width: 12, height: 12, borderRadius: 6, background: '#E7675B'}} />
      <div style={{width: 12, height: 12, borderRadius: 6, background: '#E9B44C'}} />
      <div style={{width: 12, height: 12, borderRadius: 6, background: '#6DBF67'}} />
      <div style={{flex: 1, textAlign: 'center', fontSize: 14, color: dark ? '#C2C0B6' : '#5E5D59', fontFamily: 'Inter', marginRight: 50}}>{title}</div>
      {accent ? <div style={{width: 10, height: 10, borderRadius: 5, background: accent}} /> : null}
    </div>
    <div style={{position: 'relative', width: '100%', height: h - 34}}>{children}</div>
  </div>
);
