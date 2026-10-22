import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, H, W} from '../../theme';
import {clamp, ease, lerp, rand} from '../../lib/anim';
import {PETAL_ANG, PETAL_LEN} from '../../components/Flower';

// ------------------------------------------------------------------------------------------------
// Shared FX for chorus1 / verse2: spark-shaped confetti, Claude-spark path, sunburst backdrop.
// Everything is a pure function of t.
// ------------------------------------------------------------------------------------------------

/** Claude-spark (12 thin rays at the spark angles) as a single path, radius = size */
export const sparkPath = (size: number, sharp = 0.85) => {
  const r0 = size * 0.12;
  const w = size * lerp(0.33, 0.11, sharp);
  const tipC = lerp(0.52, 0.08, sharp);
  const tipY = lerp(0.14, 0.02, sharp);
  const bodyC = lerp(0.62, 0.32, sharp);
  let d = '';
  for (let i = 0; i < 12; i++) {
    const L = size * PETAL_LEN[i];
    const m = r0 + (L - r0) * 0.22;
    const a = (PETAL_ANG[i] * Math.PI) / 180;
    const ca = Math.cos(a), sa = Math.sin(a);
    // rotate point (px, py) by a (0 = up, clockwise)
    const P = (px: number, py: number) => `${(px * ca - py * sa).toFixed(2)},${(px * sa + py * ca).toFixed(2)}`;
    d += `M${P(0, -r0)} C${P(w * bodyC, -m)} ${P(w * tipC, -L + w * tipY)} ${P(0, -L)} C${P(-w * tipC, -L + w * tipY)} ${P(-w * bodyC, -m)} ${P(0, -r0)} Z `;
  }
  return d;
};

const HEART = 'M0,6 C-9,-1 -9,-9 -4,-10 C-1.5,-10.5 0,-8.5 0,-7 C0,-8.5 1.5,-10.5 4,-10 C9,-9 9,-1 0,6 Z';
const PETAL = 'M0,-10 C5.5,-6 5,4 0,5.5 C-5,4 -5.5,-6 0,-10 Z';

export type ConfettiKind = 'spark' | 'rect' | 'petal' | 'heart' | 'dot';

type ConfettiProps = {
  t: number;
  at: number;
  x: number;
  y: number;
  n?: number;
  seed?: number;
  speed?: [number, number]; // px/s initial
  angle?: number; // central launch angle (deg, 0 = up, clockwise)
  spread?: number; // deg (full cone)
  gravity?: number; // px/s^2
  drag?: number; // 1/s
  life?: number; // s
  size?: [number, number];
  colors?: string[];
  kinds?: ConfettiKind[];
  opacity?: number;
};

/** deterministic confetti burst with linear drag + gravity (closed form) */
export const Confetti: React.FC<ConfettiProps> = ({
  t,
  at,
  x,
  y,
  n = 50,
  seed = 1,
  speed = [600, 1500],
  angle = 0,
  spread = 360,
  gravity = 1400,
  drag = 2.2,
  life = 1.8,
  size = [10, 22],
  colors = [C.clay, C.clayLight, C.gold, C.blue, C.cream],
  kinds = ['spark', 'rect', 'spark', 'petal'],
  opacity = 1,
}) => {
  const tau = t - at;
  if (tau < 0 || tau > life) return null;
  const k = drag;
  const ek = (1 - Math.exp(-k * tau)) / k;
  const items: React.ReactNode[] = [];
  const sparkCache: Record<number, string> = {};
  for (let i = 0; i < n; i++) {
    const a = ((angle + (rand(seed, i) - 0.5) * spread) * Math.PI) / 180;
    const sp = lerp(speed[0], speed[1], Math.pow(rand(seed + 1, i), 0.7));
    const vx = Math.sin(a) * sp;
    const vy = -Math.cos(a) * sp;
    const px = x + vx * ek;
    const py = y + vy * ek + (gravity / k) * (tau - ek);
    const s = lerp(size[0], size[1], rand(seed + 2, i));
    const kind = kinds[Math.floor(rand(seed + 3, i) * kinds.length)];
    const col = colors[Math.floor(rand(seed + 4, i) * colors.length)];
    const rot = rand(seed + 5, i) * 360 + tau * lerp(-540, 540, rand(seed + 6, i));
    const flutter = Math.cos(tau * lerp(6, 14, rand(seed + 7, i)) + i);
    const fade = 1 - clamp((tau - life * 0.6) / (life * 0.4));
    const pop = ease.outBack(clamp(tau / 0.12));
    if (px < -100 || px > W + 100 || py > H + 100) continue;
    let node: React.ReactNode;
    if (kind === 'spark') {
      const key = Math.round(s);
      if (!sparkCache[key]) sparkCache[key] = sparkPath(key);
      node = <path d={sparkCache[key]} fill={col} />;
    } else if (kind === 'rect') {
      node = <rect x={-s * 0.5} y={-s * 0.22} width={s} height={s * 0.44} rx={s * 0.08} fill={col} transform={`scale(1 ${flutter})`} />;
    } else if (kind === 'petal') {
      node = <path d={PETAL} fill={col} transform={`scale(${s / 10} ${(s / 10) * (0.5 + 0.5 * Math.abs(flutter))})`} />;
    } else if (kind === 'heart') {
      node = <path d={HEART} fill={col} transform={`scale(${s / 10})`} />;
    } else {
      node = <circle r={s * 0.3} fill={col} />;
    }
    items.push(
      <g key={i} transform={`translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${rot.toFixed(1)}) scale(${pop.toFixed(3)})`} opacity={fade}>
        {node}
      </g>,
    );
  }
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', opacity}}>
      {items}
    </svg>
  );
};

/** rotating sunburst backdrop (two-tone wedges) */
export const Sunburst: React.FC<{x: number; y: number; t: number; n?: number; c1: string; c2: string; speed?: number; opacity?: number; R?: number}> = ({
  x,
  y,
  t,
  n = 24,
  c1,
  c2,
  speed = 6,
  opacity = 1,
  R = 2400,
}) => {
  const rot = t * speed;
  let d = '';
  for (let i = 0; i < n; i += 2) {
    const a0 = ((i / n) * 360 + rot) * (Math.PI / 180);
    const a1 = (((i + 1) / n) * 360 + rot) * (Math.PI / 180);
    d += `M${x},${y} L${x + Math.cos(a0) * R},${y + Math.sin(a0) * R} L${x + Math.cos(a1) * R},${y + Math.sin(a1) * R} Z `;
  }
  return (
    <AbsoluteFill style={{background: c1, opacity}}>
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
        <path d={d} fill={c2} />
      </svg>
    </AbsoluteFill>
  );
};

/** small 4-point twinkle star */
export const Twinkle: React.FC<{x: number; y: number; s: number; color?: string; rot?: number; opacity?: number}> = ({x, y, s, color = C.gold, rot = 0, opacity = 1}) => (
  <svg style={{position: 'absolute', left: x - s, top: y - s, overflow: 'visible', opacity}} width={s * 2} height={s * 2} viewBox={`${-s} ${-s} ${s * 2} ${s * 2}`}>
    <path
      d={`M0,${-s} C${s * 0.12},${-s * 0.12} ${s * 0.12},${-s * 0.12} ${s},0 C${s * 0.12},${s * 0.12} ${s * 0.12},${s * 0.12} 0,${s} C${-s * 0.12},${s * 0.12} ${-s * 0.12},${s * 0.12} ${-s},0 C${-s * 0.12},${-s * 0.12} ${-s * 0.12},${-s * 0.12} 0,${-s} Z`}
      fill={color}
      transform={`rotate(${rot})`}
    />
  </svg>
);

/** comic speed / impact lines radiating from a point (short dashes) */
export const ImpactLines: React.FC<{x: number; y: number; t: number; at: number; dur?: number; n?: number; r0?: number; r1?: number; color?: string; width?: number; seed?: number; arc?: [number, number]}> = ({
  x,
  y,
  t,
  at,
  dur = 0.35,
  n = 10,
  r0 = 60,
  r1 = 200,
  color = C.clay,
  width = 8,
  seed = 3,
  arc = [0, 360],
}) => {
  if (t < at || t > at + dur) return null;
  const p = (t - at) / dur;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}} width={W} height={H}>
      {Array.from({length: n}, (_, i) => {
        const a = ((arc[0] + ((i + rand(seed, i) * 0.6) / n) * (arc[1] - arc[0]) - 90) * Math.PI) / 180;
        const a1 = lerp(r0, r1, ease.outCubic(p));
        const a0 = lerp(r0, r1, ease.outCubic(clamp(p * 1.7 - 0.5)));
        return (
          <line
            key={i}
            x1={x + Math.cos(a) * a0}
            y1={y + Math.sin(a) * a0}
            x2={x + Math.cos(a) * a1}
            y2={y + Math.sin(a) * a1}
            stroke={color}
            strokeWidth={width * (1 - p * 0.6)}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};
