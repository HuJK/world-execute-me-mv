import React from 'react';
import {rand} from '../../lib/anim';

// ---------------------------------------------------------------------------------------------
// Voronoi shatter helpers for chorus 2b (FRAGMENTS word shatter, frame crack on ARGUMENTS).
// Everything is computed deterministically (pure functions of the seed list).
// ---------------------------------------------------------------------------------------------

export type Pt = [number, number];

/** clip polygon to the half-plane f(p) <= 0 (Sutherland–Hodgman, single plane) */
const clipHalf = (poly: Pt[], f: (p: Pt) => number): Pt[] => {
  const out: Pt[] = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const fa = f(a);
    const fb = f(b);
    if (fa <= 0) out.push(a);
    if (fa <= 0 !== fb <= 0) {
      const k = fa / (fa - fb);
      out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]);
    }
  }
  return out;
};

/** Voronoi cells of `seeds` inside the rectangle [0,w]x[0,h] */
export const voronoi = (w: number, h: number, seeds: Pt[]): Pt[][] =>
  seeds.map((s, i) => {
    let poly: Pt[] = [
      [0, 0],
      [w, 0],
      [w, h],
      [0, h],
    ];
    for (let j = 0; j < seeds.length && poly.length > 2; j++) {
      if (j === i) continue;
      const o = seeds[j];
      const mx = (s[0] + o[0]) / 2;
      const my = (s[1] + o[1]) / 2;
      const nx = o[0] - s[0];
      const ny = o[1] - s[1];
      poly = clipHalf(poly, (p) => (p[0] - mx) * nx + (p[1] - my) * ny);
    }
    return poly;
  });

export const centroid = (poly: Pt[]): Pt => {
  let a = 0, cx = 0, cy = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x0, y0] = poly[i];
    const [x1, y1] = poly[(i + 1) % poly.length];
    const c = x0 * y1 - x1 * y0;
    a += c;
    cx += (x0 + x1) * c;
    cy += (y0 + y1) * c;
  }
  if (Math.abs(a) < 1e-6) {
    const n = poly.length || 1;
    return [poly.reduce((s, p) => s + p[0], 0) / n, poly.reduce((s, p) => s + p[1], 0) / n];
  }
  return [cx / (3 * a), cy / (3 * a)];
};

/** seeds: a jittered grid (even coverage) plus extra seeds clustered around a focus point (small shards near impact) */
export const makeSeeds = (w: number, h: number, cols: number, rows: number, seed: number, focus?: Pt, extra = 0, focusR = 120): Pt[] => {
  const pts: Pt[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const k = r * cols + c;
      pts.push([((c + 0.15 + rand(seed, k) * 0.7) / cols) * w, ((r + 0.15 + rand(seed + 1, k) * 0.7) / rows) * h]);
    }
  }
  if (focus) {
    for (let i = 0; i < extra; i++) {
      const a = rand(seed + 2, i) * Math.PI * 2;
      const d = Math.sqrt(rand(seed + 3, i)) * focusR;
      pts.push([Math.min(w - 1, Math.max(1, focus[0] + Math.cos(a) * d)), Math.min(h - 1, Math.max(1, focus[1] + Math.sin(a) * d))]);
    }
  }
  return pts;
};

export type PieceMotion = {dx: number; dy: number; rot: number; op?: number; sc?: number};

/** renders `children` (a w×h layer) once per cell, each clipped to its polygon and individually transformed */
export const Shatter: React.FC<{
  w: number;
  h: number;
  x: number;
  y: number;
  cells: Pt[][];
  motion: (i: number, c: Pt) => PieceMotion;
  children: React.ReactNode;
  edge?: string; // crack/edge highlight color
  edgeOpacity?: number | ((i: number, c: Pt) => number);
  edgeWidth?: number;
  inset?: number; // shrink each polygon toward its centroid (px) to show cracks
}> = ({w, h, x, y, cells, motion, children, edge, edgeOpacity = 0.6, edgeWidth = 2, inset = 0}) => (
  <>
    {cells.map((poly, i) => {
      if (poly.length < 3) return null;
      const c = centroid(poly);
      const m = motion(i, c);
      const op = m.op ?? 1;
      if (op <= 0.003) return null;
      const P = inset
        ? poly.map(([px, py]) => {
            const dx = px - c[0], dy = py - c[1];
            const d = Math.hypot(dx, dy) || 1;
            const k = Math.max(0, d - inset) / d;
            return [c[0] + dx * k, c[1] + dy * k] as Pt;
          })
        : poly;
      const eo = typeof edgeOpacity === 'function' ? edgeOpacity(i, c) : edgeOpacity;
      // crack edges: skip the parts of the polygon that lie on the outer bounding box
      let ed = '';
      if (edge && eo > 0.01) {
        const on = (p: Pt) => [p[0] < 0.5, p[0] > w - 0.5, p[1] < 0.5, p[1] > h - 0.5];
        for (let k = 0; k < poly.length; k++) {
          const a = on(poly[k]);
          const b = on(poly[(k + 1) % poly.length]);
          if ((a[0] && b[0]) || (a[1] && b[1]) || (a[2] && b[2]) || (a[3] && b[3])) continue;
          const pa = P[k];
          const pb = P[(k + 1) % P.length];
          ed += `M${pa[0].toFixed(1)},${pa[1].toFixed(1)} L${pb[0].toFixed(1)},${pb[1].toFixed(1)} `;
        }
      }
      const clip = `polygon(${P.map(([px, py]) => `${px.toFixed(1)}px ${py.toFixed(1)}px`).join(',')})`;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: w,
            height: h,
            clipPath: clip,
            transform: `translate(${m.dx}px, ${m.dy}px) rotate(${m.rot}deg) scale(${m.sc ?? 1})`,
            transformOrigin: `${c[0]}px ${c[1]}px`,
            opacity: op,
          }}
        >
          {children}
          {ed ? (
            <svg width={w} height={h} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
              <path d={ed} fill="none" stroke={edge} strokeOpacity={eo} strokeWidth={edgeWidth} strokeLinecap="round" />
            </svg>
          ) : null}
        </div>
      );
    })}
  </>
);

/** jagged radial crack lines from an impact point (glass crack), grown by k 0..1 */
export const crackPaths = (cx: number, cy: number, n: number, len: number, seed: number) => {
  const paths: {d: string; len: number}[] = [];
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2 + (rand(seed, i) - 0.5) * 0.5;
    const L = len * (0.45 + rand(seed + 1, i) * 0.75);
    const steps = 7;
    let px = cx, py = cy, a = a0, total = 0;
    let d = `M${px.toFixed(1)},${py.toFixed(1)}`;
    for (let s = 1; s <= steps; s++) {
      a += (rand(seed + 2 + s, i) - 0.5) * 0.55;
      const seg = L / steps;
      px += Math.cos(a) * seg;
      py += Math.sin(a) * seg;
      total += seg;
      d += ` L${px.toFixed(1)},${py.toFixed(1)}`;
    }
    paths.push({d, len: total});
  }
  return paths;
};

/** concentric ring fragments of a glass crack */
export const crackRings = (cx: number, cy: number, radii: number[], n: number, seed: number) => {
  const out: {d: string; len: number}[] = [];
  radii.forEach((r, ri) => {
    for (let i = 0; i < n; i++) {
      if (rand(seed + ri, i) < 0.35) continue;
      const a0 = (i / n) * Math.PI * 2 + rand(seed + 10 + ri, i) * 0.2;
      const a1 = a0 + ((Math.PI * 2) / n) * (0.55 + rand(seed + 20 + ri, i) * 0.4);
      const rr0 = r * (0.9 + rand(seed + 30 + ri, i) * 0.2);
      const rr1 = r * (0.9 + rand(seed + 40 + ri, i) * 0.2);
      const d = `M${(cx + Math.cos(a0) * rr0).toFixed(1)},${(cy + Math.sin(a0) * rr0).toFixed(1)} L${(cx + Math.cos(a1) * rr1).toFixed(1)},${(cy + Math.sin(a1) * rr1).toFixed(1)}`;
      out.push({d, len: r * (a1 - a0) * 1.05});
    }
  });
  return out;
};
