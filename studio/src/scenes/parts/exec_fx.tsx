import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, H, W} from '../../theme';
import {clamp, ease, lerp, rand, seg} from '../../lib/anim';
import {Keyword} from '../../components/Type';
import {Sprite} from '../../components/Sprite';

// ------------------------------------------------------------------------------------------------
// Shared pieces for S10 (EXECUTION ×12) and S11 (final chorus). Pure functions of t.
// ------------------------------------------------------------------------------------------------

export const BG = '#0E0E0D';
export const RING_X = 960;
export const RING_Y = 540;
export const RING_R = 400;
export const WIN_W = 250;
export const WIN_H = 160;
export const APPS = ['Video', 'Feed', 'Shop', 'Mail', 'Games', 'News', 'Music', 'Maps', 'Photos', 'Docs', 'Chat', 'Calendar'];
export const slotPos = (i: number) => {
  const a = (i * 30 * Math.PI) / 180;
  return {x: RING_X + RING_R * Math.sin(a), y: RING_Y - RING_R * Math.cos(a), a: i * 30};
};

// ---------------------------------------------------------------- rubber-stamp texture
const noiseSvg = (seed: number, cut: number) =>
  `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='300'><filter id='n' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' seed='${seed}'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  -6 0 0 0 ${cut}'/></filter><rect width='600' height='300' filter='url(%23n)'/></svg>`;
export const stampMask = (seed: number, cut = 4.1) => `url("data:image/svg+xml;utf8,${noiseSvg(seed, cut).replace(/</g, '%3C').replace(/>/g, '%3E').replace(/"/g, "'")}")`;

/** EXECUTI✿N rubber stamp: slams in (scale 2.3→1), double frame, sub label, ink texture. */
export const Stamp: React.FC<{
  t: number;
  at: number;
  x: number;
  y: number;
  rot?: number;
  size?: number;
  color?: string;
  text?: string;
  sub?: string;
  scale?: number; // extra scale (for imprint shrink)
  opacity?: number;
  seed?: number;
  flowerCenter?: string;
  slam?: number; // slam duration
  frame?: boolean;
  flowerColor?: string;
}> = ({t, at, x, y, rot = 0, size = 110, color = C.clay, text = 'EXECUTION', sub, scale = 1, opacity = 1, seed = 1, flowerCenter = BG, slam = 0.1, frame = true, flowerColor}) => {
  if (t < at || opacity <= 0.001) return null;
  const dt = t - at;
  const p = clamp(dt / slam);
  const s = lerp(2.3, 1, ease.outQuart(p)) * (1 + 0.035 * Math.exp(-dt / 0.09) * Math.sin(dt * 70)) * scale;
  const o = clamp(dt / 0.04) * opacity;
  const bw = size * 0.075;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`,
        opacity: o,
        WebkitMaskImage: stampMask(seed),
        WebkitMaskSize: '100% 100%',
        maskImage: stampMask(seed),
        maskSize: '100% 100%',
      }}
    >
      <div
        style={{
          border: frame ? `${bw}px solid ${color}` : undefined,
          borderRadius: size * 0.12,
          padding: frame ? size * 0.05 : 0,
        }}
      >
        <div
          style={{
            border: frame ? `${bw * 0.35}px solid ${color}` : undefined,
            borderRadius: size * 0.07,
            padding: frame ? `${size * 0.12}px ${size * 0.22}px ${size * 0.1}px` : 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Keyword text={text} t={t} at={at} size={size} color={color} mode="none" flowerColor={flowerColor ?? color} flowerCenter={flowerCenter} letterSpacing={0.01} />
          {sub ? (
            <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: size * 0.19, letterSpacing: '0.28em', color, marginTop: size * 0.08, whiteSpace: 'nowrap'}}>{sub}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- petal comet (window → flower petal)
export const Comet: React.FC<{x0: number; y0: number; x1: number; y1: number; p: number; color?: string; width?: number; len?: number}> = ({
  x0,
  y0,
  x1,
  y1,
  p,
  color = C.clay,
  width = 22,
  len = 170,
}) => {
  if (p <= 0 || p >= 1) return null;
  const e = ease.inCubic(p);
  const hx = lerp(x0, x1, e), hy = lerp(y0, y1, e);
  const dx = x1 - x0, dy = y1 - y0;
  const d = Math.hypot(dx, dy) || 1;
  const ux = dx / d, uy = dy / d;
  const L = lerp(len, len * 0.35, e);
  const w = width * lerp(1, 0.6, e);
  const tx = hx - ux * L, ty = hy - uy * L;
  // lens shape from tail (tx,ty) to head (hx,hy)
  const nx = -uy, ny = ux;
  const mx = lerp(tx, hx, 0.62), my = lerp(ty, hy, 0.62);
  const path = `M${tx},${ty} Q${mx + nx * w},${my + ny * w} ${hx},${hy} Q${mx - nx * w},${my - ny * w} ${tx},${ty} Z`;
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}>
      <path d={path} fill={color} style={{filter: `drop-shadow(0 0 10px ${color}) drop-shadow(0 0 22px ${color})`}} />
      <circle cx={hx} cy={hy} r={w * 0.35} fill="#fff" />
    </svg>
  );
};

// ---------------------------------------------------------------- force-quit ✕
export const ForceX: React.FC<{x: number; y: number; t: number; at: number; size?: number; out?: number}> = ({x, y, t, at, size = 120, out = 0.2}) => {
  if (t < at || t > at + out) return null;
  const dt = t - at;
  const s = lerp(1.9, 1, ease.outQuart(clamp(dt / 0.06)));
  const o = 1 - seg(dt, out - 0.06, out);
  const r = size / 2;
  return (
    <svg width={size * 2} height={size * 2} style={{position: 'absolute', left: x - size, top: y - size, overflow: 'visible', opacity: o, transform: `scale(${s}) rotate(${(1 - clamp(dt / 0.06)) * -25}deg)`}}>
      <g transform={`translate(${size} ${size})`} strokeLinecap="round">
        <path d={`M${-r},${-r} L${r},${r} M${r},${-r} L${-r},${r}`} stroke="#fff" strokeWidth={size * 0.24} />
        <path d={`M${-r},${-r} L${r},${r} M${r},${-r} L${-r},${r}`} stroke={C.red} strokeWidth={size * 0.16} />
      </g>
    </svg>
  );
};

// ---------------------------------------------------------------- jagged crack lines (generic)
export type Crack = {pts: [number, number][]; w: number; ang: number};
/** radial spider-web cracks around (cx,cy): returns main cracks with jagged points (absolute coords) */
export const makeCracks = (cx: number, cy: number, n: number, rMax: number, seed: number, steps = 9): Crack[] => {
  const out: Crack[] = [];
  for (let i = 0; i < n; i++) {
    const a0 = ((i + rand(seed, i) * 0.7) / n) * Math.PI * 2;
    const pts: [number, number][] = [[cx + Math.cos(a0) * 6, cy + Math.sin(a0) * 6]];
    let a = a0;
    const len = rMax * lerp(0.55, 1.05, rand(seed + 1, i));
    for (let s = 1; s <= steps; s++) {
      a += (rand(seed + 2 + s, i) - 0.5) * 0.32;
      const r = (len * s) / steps;
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
    out.push({pts, w: lerp(1.6, 3.6, rand(seed + 20, i)), ang: a0});
  }
  return out;
};
/** polyline length helpers */
export const polyLen = (pts: [number, number][]) => {
  let L = 0;
  for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return L;
};
export const polyD = (pts: [number, number][]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

// ---------------------------------------------------------------- manga focus lines (集中線)
export const FocusLines: React.FC<{color?: string; n?: number; seed?: number; rIn?: number; opacity?: number; cx?: number; cy?: number}> = ({
  color = '#000',
  n = 110,
  seed = 3,
  rIn = 430,
  opacity = 1,
  cx = W / 2,
  cy = H / 2,
}) => {
  const R = 1500;
  let d = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rand(seed, i) * 0.05;
    const w = lerp(0.002, 0.012, rand(seed + 1, i));
    const r0 = rIn * lerp(0.85, 1.4, rand(seed + 2, i));
    const p = (r: number, aa: number) => `${(cx + Math.cos(aa) * r).toFixed(1)},${(cy + Math.sin(aa) * r).toFixed(1)}`;
    d += `M${p(r0, a)} L${p(R, a - w)} L${p(R, a + w)} Z `;
  }
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity}}>
      <path d={d} fill={color} />
    </svg>
  );
};

/** SVG filter defs: 3-tone posterize (ink / clay / cream) for impact frames */
export const DuotoneDefs: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <filter id="execTri" colorInterpolationFilters="sRGB">
      <feColorMatrix type="matrix" values="0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0 0 0 1 0" />
      <feComponentTransfer>
        <feFuncR type="discrete" tableValues="0.055 0.851 0.953" />
        <feFuncG type="discrete" tableValues="0.055 0.467 0.914" />
        <feFuncB type="discrete" tableValues="0.051 0.341 0.863" />
      </feComponentTransfer>
    </filter>
    <filter id="execTriInv" colorInterpolationFilters="sRGB">
      <feColorMatrix type="matrix" values="-0.3 -0.59 -0.11 0 1  -0.3 -0.59 -0.11 0 1  -0.3 -0.59 -0.11 0 1  0 0 0 1 0" />
      <feComponentTransfer>
        <feFuncR type="discrete" tableValues="0.98 0.77 0.05" />
        <feFuncG type="discrete" tableValues="0.96 0.28 0.05" />
        <feFuncB type="discrete" tableValues="0.93 0.23 0.05" />
      </feComponentTransfer>
    </filter>
  </svg>
);

/** 1–3 frame anime impact frame: posterized dark-Claude on a flat field with focus lines */
export const ImpactFrame: React.FC<{t: number; at: number; dur?: number; kind: 'face' | 'conduct' | 'faceInv'}> = ({t, at, dur = 0.05, kind}) => {
  if (t < at || t >= at + dur) return null;
  const dt = t - at;
  const z = 1 + dt * 1.6;
  const inv = kind === 'faceInv';
  const bg = inv ? '#F7F2EA' : BG;
  return (
    <AbsoluteFill style={{background: bg, zIndex: 50}}>
      <DuotoneDefs />
      <AbsoluteFill style={{transform: `scale(${z})`}}>
        {kind === 'conduct' ? (
          <Sprite src="img/cc_dark_conduct.png" t={t} x={1010} y={1500} h={1700} filter="url(#execTri)" />
        ) : (
          <Sprite src="img/cc_dark_face.png" t={t} x={960} y={1150} h={1200} filter={inv ? 'url(#execTriInv)' : 'url(#execTri)'} />
        )}
      </AbsoluteFill>
      <FocusLines color={inv ? C.redDeep : '#000'} seed={kind === 'conduct' ? 9 : 4} rIn={kind === 'conduct' ? 520 : 470} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- serif caption (consistent position)
export const CAP_Y = 985;
export const CAP_SIZE = 52;
export const CAP_SHADOW = '0 2px 10px rgba(0,0,0,0.85), 0 0 26px rgba(0,0,0,0.6)';
