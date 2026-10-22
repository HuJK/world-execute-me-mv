import React from 'react';
import pts from '../../data/points_cc_snap.json';
import {rand} from '../../lib/anim';

// Point cloud of Claude-chan (cc_snap) for verse 1.
// Colors are quantized into a few buckets (deterministic k-means) so the whole cloud renders as ONE svg with ~10 <path>s.

type Raw = [number, number, string];
const RAW = (pts as any).pts as Raw[];
export const SNAP_AR = (pts as any).w / (pts as any).h; // w/h of cc_snap

const hex2rgb = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const rgb2hex = (c: number[]) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const lum = (c: number[]) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];

// fingertip spark of cc_snap (normalized in image) and hair ornament
export const SNAP_FINGER = {u: 0.127, v: 0.381};
export const SNAP_ORN = {u: 0.721, v: 0.169, r: 0.066}; // r in units of image height

const K = 10;
const rgbs = RAW.map((p) => hex2rgb(p[2]));
const sorted = [...rgbs].sort((a, b) => lum(a) - lum(b));
let centers = Array.from({length: K}, (_, k) => sorted[Math.floor(((k + 0.5) / K) * sorted.length)].slice());
const assign = new Array(rgbs.length).fill(0);
for (let it = 0; it < 14; it++) {
  for (let i = 0; i < rgbs.length; i++) {
    let best = 0, bd = 1e18;
    for (let k = 0; k < K; k++) {
      const c = centers[k];
      const d = (c[0] - rgbs[i][0]) ** 2 + (c[1] - rgbs[i][1]) ** 2 + (c[2] - rgbs[i][2]) ** 2;
      if (d < bd) {
        bd = d;
        best = k;
      }
    }
    assign[i] = best;
  }
  const sum = Array.from({length: K}, () => [0, 0, 0, 0]);
  for (let i = 0; i < rgbs.length; i++) {
    const s = sum[assign[i]];
    s[0] += rgbs[i][0];
    s[1] += rgbs[i][1];
    s[2] += rgbs[i][2];
    s[3]++;
  }
  centers = centers.map((c, k) => (sum[k][3] ? [sum[k][0] / sum[k][3], sum[k][1] / sum[k][3], sum[k][2] / sum[k][3]] : c));
}
export const BUCKET_COLORS = centers.map(rgb2hex);
export const BUCKET_LIGHT = centers.map((c) => lum(c) > 205);

export type CloudPt = {
  u: number;
  v: number;
  b: number; // bucket
  z: number; // -1..1 depth
  ex: number; // explosion direction (3d, unit-ish)
  ey: number;
  ez: number;
  dx: number; // drift dir
  dy: number;
  tr: number; // release time (dissolve wave)
  ang: number; // target angle on the circle (rad)
  ph: number; // phase for twinkle
};

const fu = SNAP_FINGER.u, fv = SNAP_FINGER.v;
const tmp: CloudPt[] = [];
RAW.forEach((p, i) => {
  const [u, v] = p;
  const dOrn = Math.hypot((u - SNAP_ORN.u) * SNAP_AR, v - SNAP_ORN.v);
  if (dOrn < SNAP_ORN.r) return; // ornament is drawn as a real Flower
  const d = Math.hypot((u - fu) * SNAP_AR, v - fv);
  // random 3d direction
  const th = rand(41, i) * Math.PI * 2;
  const cz = rand(42, i) * 2 - 1;
  const sz = Math.sqrt(1 - cz * cz);
  const mag = 0.55 + 0.45 * Math.cbrt(rand(43, i));
  const da = rand(44, i) * Math.PI * 2;
  tmp.push({
    u,
    v,
    b: assign[i],
    z: rand(45, i) * 2 - 1,
    ex: Math.cos(th) * sz * mag,
    ey: Math.sin(th) * sz * mag,
    ez: cz * mag,
    dx: Math.cos(da) * (0.4 + 0.6 * rand(46, i)),
    dy: Math.sin(da) * (0.4 + 0.6 * rand(46, i)),
    tr: 30.72 + d * 0.62,
    ang: Math.atan2(v - 0.5, (u - 0.5) * SNAP_AR),
    ph: rand(47, i) * Math.PI * 2,
  });
});
// circle targets: evenly spaced by angular rank (keeps the motion coherent)
const order = tmp.map((p, i) => [p.ang, i] as [number, number]).sort((a, b) => a[0] - b[0]);
order.forEach(([, i], r) => {
  tmp[i].ang = (r / order.length) * Math.PI * 2 - Math.PI;
});
export const CLOUD: CloudPt[] = tmp;

const f1 = (n: number) => Math.round(n * 10) / 10;
export const dot = (x: number, y: number, r: number) =>
  r <= 0.05 ? '' : `M${f1(x - r)} ${f1(y)}a${f1(r)} ${f1(r)} 0 1 0 ${f1(2 * r)} 0a${f1(r)} ${f1(r)} 0 1 0 ${f1(-2 * r)} 0`;

/** Render bucketed dots: items = [x, y, r, bucket] */
export const DotCloud: React.FC<{
  paths: string[];
  colors: string[];
  stroke?: (b: number) => string | null;
  strokeWidth?: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({paths, colors, stroke, strokeWidth = 1.3, opacity = 1, style}) => (
  <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity, ...style}}>
    {paths.map((d, b) => {
      if (!d) return null;
      const s = stroke ? stroke(b) : null;
      return <path key={b} d={d} fill={colors[b]} stroke={s ?? 'none'} strokeWidth={s ? strokeWidth : 0} />;
    })}
  </svg>
);
