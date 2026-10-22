import React from 'react';
import {clamp, ease} from '../lib/anim';

export type VecData = {w: number; h: number; paths: {d: string; f: string; x: number; y: number}[]};

/**
 * Vector-traced character (from src/data/vec/*.json). `draw` 0..1 strokes the outlines on (top → bottom sweep),
 * `fill` 0..1 fades the flat colors in. Positioned like Sprite: anchor bottom-center at (x, y), height h.
 */
export const LineArt: React.FC<{
  data: VecData;
  x: number;
  y: number;
  h: number;
  draw?: number;
  fill?: number;
  stroke?: string;
  strokeWidth?: number; // in screen px
  sweep?: number; // stagger amount (0 = all at once)
  opacity?: number;
  anchor?: [number, number];
  style?: React.CSSProperties;
}> = ({data, x, y, h, draw = 1, fill = 1, stroke = '#B5583A', strokeWidth = 2, sweep = 0.6, opacity = 1, anchor = [0.5, 1], style}) => {
  const s = h / data.h;
  const w = data.w * s;
  const n = data.paths.length;
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${data.w} ${data.h}`}
      style={{position: 'absolute', left: x - w * anchor[0], top: y - h * anchor[1], overflow: 'visible', opacity, ...style}}
    >
      {data.paths.map((p, i) => {
        const k = n > 1 ? i / (n - 1) : 0;
        const local = clamp((draw * (1 + sweep) - k * sweep) / 1);
        const dl = ease.inOutCubic(local);
        const fl = clamp((fill * (1 + sweep * 0.5) - k * sweep * 0.5) / 1);
        if (dl <= 0 && fl <= 0) return null;
        return (
          <path
            key={i}
            d={p.d}
            transform={`translate(${p.x},${p.y})`}
            fill={p.f}
            fillOpacity={fl}
            stroke={dl > 0 && fl < 1 ? stroke : 'none'}
            strokeWidth={strokeWidth / s}
            strokeOpacity={1 - fl * 0.9}
            pathLength={1}
            strokeDasharray="1 1"
            strokeDashoffset={1 - dl}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};
