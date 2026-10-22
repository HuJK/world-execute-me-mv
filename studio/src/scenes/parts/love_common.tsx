import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F, H, W} from '../../theme';
import {clamp, ease, lerp, noise1, rand, seg} from '../../lib/anim';
import {LyricLine} from '../../components/Type';
import {Cue as CueT} from '../../lib/lyrics';

// ---------------------------------------------------------------------------------------------
// Shared helpers for S12 (love) / S13 (outro)
// ---------------------------------------------------------------------------------------------

/** Full-bleed background image ("cover"), with a camera: scale around a focal point + offset. */
export const Cover: React.FC<{
  src: string;
  iw: number;
  ih: number;
  scale?: number;
  fx?: number; // focal point (0..1 of image) that stays fixed while scaling
  fy?: number;
  dx?: number;
  dy?: number;
  filter?: string;
  opacity?: number;
  flip?: boolean;
  style?: React.CSSProperties;
}> = ({src, iw, ih, scale = 1, fx = 0.5, fy = 0.5, dx = 0, dy = 0, filter, opacity = 1, flip, style}) => {
  const base = Math.max(W / iw, H / ih);
  const w = iw * base;
  const h = ih * base;
  const left = (W - w) / 2;
  const top = (H - h) / 2;
  const ox = left + fx * w;
  const oy = top + fy * h;
  return (
    <AbsoluteFill style={{overflow: 'hidden', opacity, ...style}}>
      <Img
        src={staticFile(src)}
        style={{
          position: 'absolute',
          left,
          top,
          width: w,
          height: h,
          transformOrigin: `${ox - left}px ${oy - top}px`,
          transform: `translate(${dx}px, ${dy}px) scale(${scale * (flip ? -1 : 1)}, ${scale})`,
          filter,
        }}
      />
    </AbsoluteFill>
  );
};

/** Captions: consecutive cues never overlap (each fades just before the next starts). */
export const Captions: React.FC<{
  t: number;
  cues: CueT[];
  y?: number;
  size?: number;
  color?: string;
  hl?: string;
  shadow?: string;
  italic?: boolean;
  lastOut?: number;
  lastFade?: number;
}> = ({t, cues, y = 985, size = 52, color = C.ink, hl, shadow, italic, lastOut, lastFade = 0.25}) => (
  <>
    {cues.map((c, i) => {
      const next = cues[i + 1];
      const outAt = next ? Math.min(c.end + 0.15, next.start - 0.12) : lastOut ?? c.end + 0.15;
      return (
        <LyricLine
          key={i}
          cue={c}
          t={t}
          y={y}
          size={size}
          color={color}
          hl={hl}
          shadow={shadow}
          italic={italic}
          outAt={outAt}
          fadeOut={next ? 0.12 : lastFade}
        />
      );
    })}
  </>
);

export const LIGHT_SHADOW = '0 0 14px rgba(250,246,238,0.95), 0 0 4px rgba(250,246,238,0.95), 0 0 28px rgba(250,246,238,0.7)';
export const DARK_SHADOW = '0 2px 12px rgba(10,8,6,0.85), 0 0 3px rgba(10,8,6,0.9), 0 0 30px rgba(10,8,6,0.5)';

/** A fluttering page (paper sheet with text lines). Pure function of its params. */
export const Page: React.FC<{x: number; y: number; w: number; rot: number; flip: number; opacity?: number; blur?: number; seed?: number; tint?: string}> = ({
  x,
  y,
  w,
  rot,
  flip,
  opacity = 1,
  blur = 0,
  seed = 0,
  tint = '#FBF6EC',
}) => {
  const h = w * 1.3;
  const lines = 7;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y - h / 2,
        width: w,
        height: h,
        background: tint,
        borderRadius: w * 0.04,
        transform: `rotate(${rot}deg) scaleX(${flip})`,
        opacity,
        filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
        boxShadow: `0 ${w * 0.06}px ${w * 0.14}px rgba(110,60,30,0.22)`,
        padding: `${w * 0.13}px ${w * 0.12}px`,
        boxSizing: 'border-box',
      }}
    >
      {Array.from({length: lines}, (_, i) => (
        <div
          key={i}
          style={{
            height: Math.max(1, w * 0.035),
            width: `${i === 0 ? 55 : lerp(60, 100, rand(seed + 3, i))}%`,
            background: i === 0 ? 'rgba(181,88,58,0.55)' : 'rgba(94,93,89,0.32)',
            borderRadius: 2,
            marginBottom: w * 0.075,
          }}
        />
      ))}
    </div>
  );
};

/** drifting dust / light motes */
export const Motes: React.FC<{t: number; n?: number; seed?: number; color?: string; area?: [number, number, number, number]; size?: [number, number]; speed?: number; opacity?: number}> = ({
  t,
  n = 40,
  seed = 3,
  color = '#FFF4E0',
  area = [0, 0, W, H],
  size = [2, 5],
  speed = 18,
  opacity = 1,
}) => {
  const [ax, ay, aw, ah] = area;
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity, pointerEvents: 'none'}}>
      {Array.from({length: n}, (_, i) => {
        const r = lerp(size[0], size[1], rand(seed, i));
        const v = speed * lerp(0.5, 1.5, rand(seed + 1, i));
        const x = ax + rand(seed + 2, i) * aw + noise1(t * 0.4 + i, seed) * 30;
        const y = ay + (((rand(seed + 3, i) * ah - t * v) % ah) + ah) % ah;
        const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * lerp(1.5, 4, rand(seed + 4, i)) + i * 2.1));
        return <circle key={i} cx={x} cy={y} r={r} fill={color} opacity={tw} />;
      })}
    </svg>
  );
};

/** soft radial light (additive-looking) */
export const Glow: React.FC<{x: number; y: number; r: number; color?: string; opacity?: number; blend?: React.CSSProperties['mixBlendMode']}> = ({
  x,
  y,
  r,
  color = '255,236,214',
  opacity = 1,
  blend = 'screen',
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - r,
      top: y - r,
      width: r * 2,
      height: r * 2,
      borderRadius: '50%',
      background: `radial-gradient(circle, rgba(${color},1) 0%, rgba(${color},0.45) 30%, rgba(${color},0.12) 60%, rgba(${color},0) 72%)`,
      opacity,
      mixBlendMode: blend,
      pointerEvents: 'none',
    }}
  />
);

// ---------------------------------------------------------------- heart curve (epicycles)
// z(t) = x + i y with x = 16 sin^3 t, y = 13 cos t − 5 cos 2t − 2 cos 3t − cos 4t  ==  Σ c_k e^{ikt}
// (exact: sin^3 t = (3 sin t − sin 3t)/4). Sorted by radius for a pretty chain.
export const HEART_COEF: [number, number, number][] = [
  // [k, re, im]
  [-1, 0, 12.5],
  [-3, 0, -3],
  [2, 0, -2.5],
  [-2, 0, -2.5],
  [3, 0, 1],
  [1, 0, 0.5],
  [4, 0, -0.5],
  [-4, 0, -0.5],
];
export const heartXY = (tt: number) => ({
  x: 16 * Math.pow(Math.sin(tt), 3),
  y: 13 * Math.cos(tt) - 5 * Math.cos(2 * tt) - 2 * Math.cos(3 * tt) - Math.cos(4 * tt),
});
/** SVG path of the heart (screen coords, y down) for parameter range [0, tEnd] */
export const heartPath = (cx: number, cy: number, s: number, tEnd = Math.PI * 2, n = 220) => {
  let d = '';
  const steps = Math.max(2, Math.ceil((n * tEnd) / (Math.PI * 2)));
  for (let i = 0; i <= steps; i++) {
    const tt = (i / steps) * tEnd;
    const p = heartXY(tt);
    d += `${i ? 'L' : 'M'}${(cx + p.x * s).toFixed(2)},${(cy - p.y * s).toFixed(2)} `;
  }
  return d;
};
