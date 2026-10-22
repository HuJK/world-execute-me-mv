import React from 'react';
import {C} from '../theme';
import {clamp, lerp, rad} from '../lib/anim';

// 12-petal flower = Claude's main form. Petal lengths/angles carry a slight irregularity borrowed from the Claude spark.
// ray directions measured from the Claude spark (deg, 0 = up, clockwise) and relative lengths
export const PETAL_ANG = [8, 40.5, 83, 105.5, 134, 150, 185, 213, 235.5, 269.5, 301.5, 332];
export const PETAL_LEN = [0.97, 1.0, 0.93, 0.99, 0.95, 1.0, 0.96, 0.92, 1.0, 0.94, 0.98, 0.95];

export type PetalOverride = Partial<{
  scale: number; // length multiplier
  width: number; // width multiplier
  opacity: number;
  color: string;
  rot: number; // extra rotation deg
  dist: number; // push outward (fraction of size)
  fall: number; // 0..1 detach & fall
}>;

export type FlowerProps = {
  size: number; // radius (px) of the longest petal
  x?: number;
  y?: number;
  open?: number; // 0 bud .. 1 full bloom
  stagger?: number; // bloom stagger across petals (0..1)
  spin?: number; // deg
  color?: string;
  shade?: string | null; // inner shade tone (null = flat)
  centerColor?: string;
  centerRing?: string | null;
  centerScale?: number;
  edge?: string | null; // petal outline color
  edgeWidth?: number; // px
  petals?: PetalOverride[];
  wilt?: number; // 0..1
  sharp?: number; // 0 round petals .. 1 thin spark rays
  glow?: number; // 0..1
  glowColor?: string;
  opacity?: number;
  scaleX?: number;
  style?: React.CSSProperties;
  showCenter?: boolean;
  regular?: boolean; // perfectly regular petals (for math scenes)
};

const petalPath = (r0: number, L: number, w: number, sharp: number) => {
  const tipC = lerp(0.52, 0.08, sharp); // tip roundness
  const tipY = lerp(0.14, 0.02, sharp);
  const bodyC = lerp(0.62, 0.32, sharp);
  const m = r0 + (L - r0) * 0.22;
  return `M0,${-r0} C${w * bodyC},${-m} ${w * tipC},${-L + w * tipY} 0,${-L} C${-w * tipC},${-L + w * tipY} ${-w * bodyC},${-m} 0,${-r0} Z`;
};

export const Flower: React.FC<FlowerProps> = ({
  size,
  x,
  y,
  open = 1,
  stagger = 0.35,
  spin = 0,
  color = C.clay,
  shade = C.clayDark,
  centerColor = C.cream,
  centerRing = null,
  centerScale = 1,
  edge = null,
  edgeWidth = 2,
  petals,
  wilt = 0,
  sharp = 0,
  glow = 0,
  glowColor = C.clay,
  opacity = 1,
  scaleX = 1,
  style,
  showCenter = true,
  regular = false,
}) => {
  const pad = 1.35;
  const box = size * 2 * pad;
  const r0 = size * 0.1;
  const baseW = size * lerp(regular ? 0.36 : 0.33, 0.11, sharp);
  const centerR = size * 0.25 * centerScale * clamp(0.55 + open * 0.6, 0, 1);
  const items = [];
  for (let i = 0; i < 12; i++) {
    const o = petals?.[i] ?? {};
    const local = clamp((open * (1 + stagger) - (i / 12) * stagger) / 1, 0, 1);
    const eo = 1 - Math.pow(1 - local, 3);
    const lenMul = (regular ? 0.95 : PETAL_LEN[i]) * (o.scale ?? 1);
    let ang = (regular ? i * 30 : PETAL_ANG[i]) + (o.rot ?? 0);
    // wilt: droop toward 180deg (down) and shorten
    if (wilt > 0) {
      const a = ((ang % 360) + 360) % 360;
      const d = 180 - a; // positive → rotate clockwise toward bottom
      ang = a + d * wilt * 0.5 * (0.6 + 0.4 * Math.sin(i * 1.7));
    }
    const fall = o.fall ?? 0;
    const L = size * lenMul * lerp(0.28, 1, eo) * (1 - wilt * 0.18);
    const w = baseW * (o.width ?? 1) * lerp(0.6, 1, eo);
    const dist = (o.dist ?? 0) * size + fall * size * 2.2;
    const op = (o.opacity ?? 1) * (1 - fall * 0.9);
    if (op <= 0.001) continue;
    const pc = o.color ?? color;
    const fallRot = fall * (60 + i * 13);
    items.push(
      <g key={i} transform={`rotate(${ang}) translate(0 ${-dist}) rotate(${fallRot}) translate(0 ${fall * size * 0.3})`} opacity={op}>
        <path d={petalPath(r0, L, w, sharp)} fill={pc} stroke={edge ?? 'none'} strokeWidth={edge ? edgeWidth : 0} strokeLinejoin="round" />
        {shade && sharp < 0.6 ? (
          <path
            d={petalPath(r0, L * 0.82, w * 0.42, sharp)}
            transform={`translate(${w * 0.2} 0)`}
            fill={shade}
            opacity={0.32 * (1 - sharp)}
          />
        ) : null}
      </g>,
    );
  }
  const filter = glow > 0 ? `drop-shadow(0 0 ${size * 0.25 * glow}px ${glowColor}) drop-shadow(0 0 ${size * 0.08 * glow}px ${glowColor})` : undefined;
  return (
    <svg
      width={box}
      height={box}
      viewBox={`${-box / 2} ${-box / 2} ${box} ${box}`}
      style={{
        position: x !== undefined ? 'absolute' : undefined,
        left: x !== undefined ? x - box / 2 : undefined,
        top: y !== undefined ? y - box / 2 : undefined,
        overflow: 'visible',
        opacity,
        filter,
        ...style,
      }}
    >
      <g transform={`scale(${scaleX} 1) rotate(${spin})`}>
        {items}
        {showCenter ? (
          <>
            <circle r={centerR} fill={centerColor} stroke={edge ?? 'none'} strokeWidth={edge ? edgeWidth : 0} />
            {centerRing ? <circle r={centerR * 0.62} fill="none" stroke={centerRing} strokeWidth={Math.max(1, size * 0.025)} opacity={0.7} /> : null}
          </>
        ) : null}
      </g>
    </svg>
  );
};

/** Flower petals positioned in absolute coords helper: angle (deg, 0=up, clockwise) of petal i */
export const petalAngle = (i: number) => PETAL_ANG[i];
export const petalTip = (i: number, size: number) => {
  const a = rad(petalAngle(i));
  return {x: Math.sin(a) * size * PETAL_LEN[i], y: -Math.cos(a) * size * PETAL_LEN[i]};
};
