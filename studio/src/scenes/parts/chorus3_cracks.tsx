import React from 'react';
import {H, W} from '../../theme';
import {clamp, ease, lerp, rand, seg} from '../../lib/anim';
import {makeCracks, polyD, polyLen} from './exec_fx';

// ------------------------------------------------------------------------------------------------
// Cracks in the screen glass (I will run the EXECUTION) that later heal into the PROTECTION dome.
// The heal is a true morph: every jagged radial crack bends into an arc of the dome circle.
// ------------------------------------------------------------------------------------------------

export const CRACK_X = 960;
export const CRACK_Y = 512;
export const DOME_R = 430;
const N = 15;
const STEPS = 10;
const CRACKS = makeCracks(CRACK_X, CRACK_Y, N, 1200, 77, STEPS);
const DELAY = CRACKS.map((_, i) => rand(79, i) * 0.12);
const SPAN = ((Math.PI * 2) / N) * 1.9;

type Web = {a: number; b: number; s: number};
const WEBS: Web[] = [];
for (const s of [2, 3, 5, 7]) for (let i = 0; i < N; i++) if (rand(78, i * 10 + s) > 0.32) WEBS.push({a: i, b: (i + 1) % N, s});

type Branch = {i: number; s: number; ang: number; len: number};
const BRANCHES: Branch[] = [];
for (let i = 0; i < N; i++)
  for (const s of [3, 5, 7])
    if (rand(80, i * 10 + s) > 0.45) BRANCHES.push({i, s, ang: (rand(81, i * 10 + s) > 0.5 ? 1 : -1) * lerp(0.4, 0.8, rand(82, i * 10 + s)), len: lerp(50, 120, rand(83, i * 10 + s))});

const healPt = (i: number, j: number): [number, number] => {
  const a = CRACKS[i].ang + (j / STEPS - 0.5) * SPAN;
  return [CRACK_X + Math.cos(a) * DOME_R, CRACK_Y + Math.sin(a) * DOME_R];
};

export const GlassCracks: React.FC<{
  t: number;
  at: number; // impact time
  grow?: number; // seconds for cracks to reach full length
  freezeAt?: number; // growth stops (she stops)
  heal0?: number; // heal morph start
  heal1?: number; // heal morph end
  opacity?: number;
}> = ({t, at, grow = 0.55, freezeAt = 1e9, heal0 = 1e9, heal1 = 1e9 + 1, opacity = 1}) => {
  if (t < at || opacity <= 0.001) return null;
  const tg = Math.min(t, freezeAt);
  const growth = CRACKS.map((_, i) => ease.outCubic(seg(tg, at + DELAY[i], at + DELAY[i] + grow)));
  const heal = CRACKS.map((_, i) => ease.inOutCubic(seg(t, heal0 + i * 0.025, heal1 + i * 0.025)));
  const pts = CRACKS.map((c, i) => c.pts.map((p, j) => {
    if (heal[i] <= 0) return p;
    const q = healPt(i, j);
    return [lerp(p[0], q[0], heal[i]), lerp(p[1], q[1], heal[i])] as [number, number];
  }));
  const healAvg = heal.reduce((a, b) => a + b, 0) / N;
  const flashK = Math.exp(-(t - at) / 0.25);
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity, pointerEvents: 'none'}}>
      <defs>
        <radialGradient id="c3impact">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.95} />
          <stop offset="100%" stopColor="#fff" stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* frosted impact bloom */}
      <circle cx={CRACK_X} cy={CRACK_Y} r={lerp(30, 150, 1 - flashK)} fill="url(#c3impact)" opacity={(0.25 + 0.75 * flashK) * (1 - healAvg)} />
      {/* web rings */}
      {WEBS.map((wb, k) => {
        const need = wb.s / STEPS;
        const o = clamp((Math.min(growth[wb.a], growth[wb.b]) - need) * 8) * (1 - healAvg * 1.6);
        if (o <= 0.01) return null;
        const p = pts[wb.a][wb.s], q = pts[wb.b][wb.s];
        const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
        const sx = lerp(mx, CRACK_X, 0.1), sy = lerp(my, CRACK_Y, 0.1);
        const d = `M${p[0]},${p[1]} L${sx},${sy} L${q[0]},${q[1]}`;
        return (
          <g key={'w' + k} opacity={o}>
            <path d={d} stroke="rgba(0,0,0,0.45)" strokeWidth={3} fill="none" transform="translate(1.5 1.5)" />
            <path d={d} stroke="rgba(255,255,255,0.75)" strokeWidth={1.4} fill="none" />
          </g>
        );
      })}
      {/* branches */}
      {BRANCHES.map((b, k) => {
        const need = b.s / STEPS;
        const g = clamp((growth[b.i] - need) * 5) * (1 - healAvg * 1.6);
        if (g <= 0.01) return null;
        const p = pts[b.i][b.s];
        const nx = pts[b.i][b.s + 1][0] - p[0], ny = pts[b.i][b.s + 1][1] - p[1];
        const a = Math.atan2(ny, nx) + b.ang;
        const e: [number, number] = [p[0] + Math.cos(a) * b.len * g, p[1] + Math.sin(a) * b.len * g];
        return (
          <g key={'b' + k}>
            <line x1={p[0]} y1={p[1]} x2={e[0]} y2={e[1]} stroke="rgba(0,0,0,0.45)" strokeWidth={3} transform="translate(1.5 1.5)" />
            <line x1={p[0]} y1={p[1]} x2={e[0]} y2={e[1]} stroke="rgba(255,255,255,0.8)" strokeWidth={1.3} />
          </g>
        );
      })}
      {/* main cracks */}
      {pts.map((pp, i) => {
        const L = polyLen(CRACKS[i].pts);
        const g = growth[i];
        if (g <= 0.001) return null;
        const d = polyD(pp);
        const dash = heal[i] > 0 ? undefined : `${L * g} ${L * 2}`;
        const w = CRACKS[i].w * lerp(1, 0.8, heal[i]);
        return (
          <g key={i}>
            <path d={d} stroke="rgba(0,0,0,0.5)" strokeWidth={w + 2.5} fill="none" strokeDasharray={dash} transform="translate(2 2)" strokeLinejoin="round" />
            <path
              d={d}
              stroke="#fff"
              strokeOpacity={0.92}
              strokeWidth={w}
              fill="none"
              strokeDasharray={dash}
              strokeLinejoin="round"
              strokeLinecap="round"
              style={{filter: `drop-shadow(0 0 ${4 + 10 * heal[i]}px rgba(255,255,255,${0.5 + 0.4 * heal[i]}))`}}
            />
          </g>
        );
      })}
    </svg>
  );
};
