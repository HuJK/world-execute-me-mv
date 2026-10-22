import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, H, W} from '../theme';
import {clamp, ease, lerp, mix, noise1, pulse, rand, seg} from '../lib/anim';
import {beatPulse, downbeatPulse} from '../lib/audio';
import {cueAt} from '../lib/lyrics';
import {Flower} from '../components/Flower';
import {Keyword, LyricLine} from '../components/Type';
import {ClaudeApp} from '../components/ClaudeApp';
import {Cursor, Flash, Grain, RayBurst, Ring} from '../components/FX';
import {Sprite} from '../components/Sprite';
import {IArtifact, IClose, ICopy} from '../components/Icons';
import {BUCKET_COLORS, BUCKET_LIGHT, CLOUD, DotCloud, SNAP_AR, SNAP_FINGER, SNAP_ORN, dot} from './parts/verse1_points';
import {ArcText, Extruded, SitCursor, TangentBubble, polar, prettyCue} from './parts/verse1_bits';

// -------------------------------------------------------------------------------------------------
// 29.71–44.45  VERSE 1 — "math role-play".
// Claude app → artifact panel (graph paper) → Claude-chan snaps & dissolves into a point set →
// DIMENSION (3-D, ℝ^12288) → circle (flower to the centre, compass) → CIRCUMFERENCE (text on the path)
// → unit circle unrolls into a sine wave → the human sits on a tangent bench → TANGENTS fan →
// the wave folds into ∞ → context meter + marquee → LIMITA… (truncated by its own frame).
// -------------------------------------------------------------------------------------------------

const CX = 960, CY = 470; // stage centre (world)
const R1 = 300; // circle radius
const SCX = 380; // unit circle centre x in the sine section
const R2 = 150;
const X0 = SCX + R2 + 46; // where the wave is written
const KW = 1 / R2; // λ = 2πr: the wave IS the unrolled circumference
const XS = 1263; // where the human sits (world x) — exactly a crest when the wave freezes
const LA = 520; // lemniscate half-width

type Pal = {bg: string; grid: string; ink: string; curve: string; soft: string; text: string; hl: string; dark: boolean};
const PAPER: Pal = {bg: C.paper, grid: C.clay, ink: C.ink, curve: C.clay, soft: C.gray3, text: C.ink, hl: C.clayDark, dark: false};
const CLAYP: Pal = {bg: C.clay, grid: C.cream, ink: C.cream, curve: '#FFF6EC', soft: C.clayPale, text: C.cream, hl: '#FFFFFF', dark: true};

// ------------------------------------------------------------------ time-varying helpers
const panelXAt = (t: number) =>
  t < 31.12 ? lerp(1920, 900, ease.outCubic(seg(t, 29.72, 30.14))) : lerp(900, 0, ease.inOutCubic(seg(t, 31.12, 31.66)));

const frameAt = (t: number) => {
  const px = panelXAt(t);
  const e = ease.inOutCubic(seg(t, 31.12, 31.7));
  // gentle idle float + a little bounce on the snap (sprite and points share this frame, so they stay locked)
  const h = lerp(800, 740, e) * (1 + 0.018 * pulse(t, 30.7, 0.16));
  const cx = t < 31.12 ? px + 510 : lerp(1410, CX, e);
  const cy = lerp(1100 - 400 + 5 * Math.sin(t * 2.4), CY, e);
  return {cx, cy, h, w: h * SNAP_AR};
};

const camAt = (t: number) => {
  const panX = 110 * ease.inOutCubic(seg(t, 37.45, 39.4)) * (1 - ease.inOutCubic(seg(t, 40.71, 41.3)));
  let z = 1;
  z += 0.035 * ease.outCubic(seg(t, 32.68, 33.0)) * (1 - ease.inOutCubic(seg(t, 33.3, 34.2)));
  z += 0.025 * ease.inOutCubic(seg(t, 37.07, 39.4)) * (1 - ease.inOutCubic(seg(t, 40.71, 41.3)));
  z = lerp(z, 0.84, ease.inOutCubic(seg(t, 42.3, 42.95)));
  if (t > 31.7) z *= 1 + 0.007 * downbeatPulse(t, 0.25);
  return {panX, z};
};
const toScreen = (t: number, wx: number, wy: number) => {
  const {panX, z} = camAt(t);
  return [960 + (wx - 960 - panX) * z, 540 + (wy - 540) * z] as [number, number];
};

// 3-D view of the point set (DIMENSION)
const yawAt = (t: number) => {
  if (t < 32.68) return 0;
  if (t < 33.0) return 62 * ease.outBack(seg(t, 32.68, 33.0));
  if (t < 33.41) return lerp(62, 170, seg(t, 33.0, 33.41));
  return lerp(170, 360, ease.outCubic(seg(t, 33.41, 34.35)));
};
const pitchAt = (t: number) => -20 * ease.outCubic(seg(t, 32.68, 33.0)) * (1 - ease.inOutCubic(seg(t, 33.55, 34.35)));
const depthAt = (t: number) => ease.outCubic(seg(t, 32.68, 32.95)) * (1 - ease.inOutCubic(seg(t, 33.55, 34.3)));
const hiAt = (t: number) => ease.inCubic(seg(t, 32.98, 33.41));

// compass sweep (screen degrees, counter-clockwise from east = math convention)
const sweepAt = (t: number) => {
  const x = seg(t, 34.65, 36.2);
  return 360 * (0.5 - 0.5 * Math.cos(Math.PI * x));
};

// phase of the rotating point (rad). fast, then a slow ride, then frozen for TANGENTS
const W1 = (2 * Math.PI) / 0.92;
const W2 = (2 * Math.PI) / 3.6;
const phiAt = (t: number) => {
  const a = 37.4, b = 38.6, c = 39.3, d = 39.97, e = 40.05;
  if (t <= a) return 0;
  let p = W1 * (Math.min(t, b) - a);
  if (t <= b) return p;
  const t2 = Math.min(t, c) - b;
  p += W1 * t2 - ((W1 - W2) * t2 * t2) / (2 * (c - b));
  if (t <= c) return p;
  const t3 = Math.min(t, d) - c;
  p += W2 * t3;
  if (t <= d) return p;
  const t4 = Math.min(t, e) - d;
  p += W2 * t4 - (W2 * t4 * t4) / (2 * (e - d));
  return p;
};
const waveY = (phi: number, x: number) => CY - R2 * Math.sin(phi - KW * (x - X0));
const waveSlope = (phi: number, x: number) => Math.cos(phi - KW * (x - X0)); // dy/dx (R·k = 1)
const waveEnd = (phi: number) => X0 + phi * R2;

const lemni = (s: number, cx = CX, cy = CY, a = LA) => {
  const d = 1 + Math.sin(s) ** 2;
  return [cx + (a * Math.cos(s)) / d, cy + (a * Math.sin(s) * Math.cos(s)) / d] as [number, number];
};
const raceS = (t: number) => {
  const tt = Math.min(t, 43.51);
  const d = Math.max(0, tt - 41.26);
  return -Math.PI / 2 + 2 * Math.PI * (0.5 * d + 1.5 * d * d);
};
const raceSpeed = (t: number) => (t < 41.26 || t > 43.51 ? 0 : 2 * Math.PI * (0.5 + 3 * (t - 41.26)));

const f1 = (n: number) => Math.round(n * 10) / 10;
const polyline = (pts: [number, number][]) => pts.map((p, i) => `${i ? 'L' : 'M'}${f1(p[0])} ${f1(p[1])}`).join('');

// ------------------------------------------------------------------ graph paper aligned with the world axes
const Paper: React.FC<{pal: Pal}> = ({pal}) => {
  const step = 40;
  const g = pal.grid;
  const minor = pal.dark ? '26' : '16';
  const major = pal.dark ? '40' : '2a';
  // world origin of the grid: (CX, CY)
  const L = -900, T = -700;
  const mx = (((CX - L) % 200) + 200) % 200, my = (((CY - T) % 200) + 200) % 200;
  const nx = (((CX - L) % step) + step) % step, ny = (((CY - T) % step) + step) % step;
  return (
    <div
      style={{
        position: 'absolute',
        left: L,
        top: T,
        width: W + 1800,
        height: H + 1400,
        background: pal.bg,
        backgroundImage: `linear-gradient(${g}${major} 1.5px, transparent 1.5px), linear-gradient(90deg, ${g}${major} 1.5px, transparent 1.5px), linear-gradient(${g}${minor} 1px, transparent 1px), linear-gradient(90deg, ${g}${minor} 1px, transparent 1px)`,
        backgroundSize: `200px 200px, 200px 200px, ${step}px ${step}px, ${step}px ${step}px`,
        backgroundPosition: `0 ${my}px, ${mx}px 0, 0 ${ny}px, ${nx}px 0`,
      }}
    />
  );
};

// ------------------------------------------------------------------ the point set
const cloudPaths = (t: number) => {
  const fr = frameAt(t);
  const yaw = (yawAt(t) * Math.PI) / 180, pit = (pitchAt(t) * Math.PI) / 180;
  const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(pit), sp = Math.sin(pit);
  const dK = depthAt(t), hK = hiAt(t);
  const spread = ease.outCubic(seg(t, 31.25, 32.3));
  const sweep = sweepAt(t);
  const beat = 1 + 0.25 * beatPulse(t, 0.1);
  const paths = BUCKET_COLORS.map(() => '');
  if (t > 34.75 + 1.6) return {paths, fr};
  for (let i = 0; i < CLOUD.length; i++) {
    const p = CLOUD[i];
    const rel = t - p.tr;
    if (rel < 0) continue;
    // 2-D position inside the frame + drift
    let X = (p.u - 0.5) * fr.w, Y = (p.v - 0.5) * fr.h;
    const dr = 7 * ease.outCubic(seg(rel, 0, 0.6)) + 34 * spread;
    X += p.dx * dr + noise1(t * 0.9 + p.ph, i) * 5 * spread;
    Y += p.dy * dr + noise1(t * 0.9 + p.ph, i + 99) * 5 * spread;
    let Z = p.z * 240 * dK;
    X += p.ex * 340 * hK;
    Y += p.ey * 340 * hK;
    Z += p.ez * 340 * hK;
    const x1 = X * cyw + Z * syw;
    const z1 = -X * syw + Z * cyw;
    const y2 = Y * cp - z1 * sp;
    const z2 = Y * sp + z1 * cp;
    const k = 1400 / (1400 + z2);
    let sx = fr.cx + x1 * k, sy = fr.cy + y2 * k;
    let r = 3.0 * k * (1 + 0.9 * pulse(t, p.tr, 0.1)) * beat;
    // converge to the circle
    const c0 = 33.41 + rand(51, i) * 0.32;
    const c = ease.inOutCubic(seg(t, c0, c0 + 0.6));
    if (c > 0) {
      const settle = 1;
      const jr = R1 + (rand(52, i) - 0.5) * 18 * (1 - ease.outCubic(seg(t, 34.2, 34.9))) * settle;
      const tx = CX + Math.cos(p.ang) * jr, ty = CY + Math.sin(p.ang) * jr;
      sx = lerp(sx, tx, c);
      sy = lerp(sy, ty, c);
      r = lerp(r, 2.7 * (1 + 0.5 * beatPulse(t, 0.1)), c);
      // compass passes → dot becomes the pencil line
      const da = (((-(p.ang * 180) / Math.PI) % 360) + 360) % 360;
      r *= 1 - clamp((sweep - da) / 28);
    }
    paths[p.b] += dot(sx, sy, r);
  }
  return {paths, fr};
};

// ------------------------------------------------------------------ definition label ("what am I")
const DefLabel: React.FC<{t: number; pal: Pal}> = ({t, pal}) => {
  if (t < 31.0) return null;
  const fr = ease.inOutCubic(seg(t, 31.12, 31.66));
  const px = panelXAt(t);
  const x = lerp(px + 46, 84, fr);
  const y = lerp(118, 78, fr);
  // ℝⁿ counter: 2 → 3 → … → 12288
  let n = 2;
  if (t >= 32.68) n = 3;
  if (t >= 32.86) n = Math.round(3 * Math.pow(12288 / 3, ease.inCubic(seg(t, 32.86, 33.33))));
  const sup = (s: string | number) => <span style={{fontSize: '0.62em', verticalAlign: '0.62em', marginLeft: 1}}>{s}</span>;
  const sub = (s: string | number) => <span style={{fontSize: '0.6em', verticalAlign: '-0.28em'}}>{s}</span>;
  const nPop = pulse(t, 32.68, 0.25) + (t > 33.2 && t < 33.5 ? pulse(t, 33.33, 0.25) : 0);
  const items: [number, number, React.ReactNode][] = [
    [
      31.04,
      33.41,
      <>
        <i>me</i> = {'{'} <i>p</i>
        {sub(1)}, <i>p</i>
        {sub(2)}, …, <i>p</i>
        {sub('1800')} {'}'} ⊂ <span style={{display: 'inline-block', transform: `scale(${1 + 0.35 * nPop})`, transformOrigin: '0% 70%', color: t >= 32.68 ? pal.hl : undefined}}>ℝ{sup(n.toLocaleString('en-US'))}</span>
      </>,
    ],
    [
      33.41,
      37.07,
      <>
        <i>me</i> = {'{'} (<i>x</i>, <i>y</i>) : <i>x</i>
        {sup(2)} + <i>y</i>
        {sup(2)} = <i>r</i>
        {sup(2)} {'}'}
      </>,
    ],
    [
      37.07,
      40.71,
      <>
        <i>me</i>(<i>θ</i>) = <i>r</i> sin <i>θ</i>
      </>,
    ],
    [
      40.71,
      44.6,
      <>
        <i>me</i> : (<i>x</i>
        {sup(2)} + <i>y</i>
        {sup(2)}){sup(2)} = <i>a</i>
        {sup(2)}(<i>x</i>
        {sup(2)} − <i>y</i>
        {sup(2)})
      </>,
    ],
  ];
  return (
    <>
      {items.map(([a, b, node], i) => {
        const k = seg(t, a + 0.03, a + 0.28) * (1 - seg(t, b - 0.16, b));
        if (k <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              fontFamily: F.serif,
              fontSize: i === 0 && fr < 1 ? lerp(34, 44, fr) : 44,
              color: pal.text,
              opacity: k,
              transform: `translateY(${(1 - ease.outCubic(seg(t, a, a + 0.3))) * 18}px)`,
              whiteSpace: 'nowrap',
              letterSpacing: '0.01em',
            }}
          >
            {node}
          </div>
        );
      })}
    </>
  );
};

// ------------------------------------------------------------------ everything drawn in world coordinates
const Stage: React.FC<{t: number; pal: Pal}> = ({t, pal}) => {
  const {panX, z} = camAt(t);
  const fr = frameAt(t);
  const nodes: React.ReactNode[] = [];

  // ---------------- axes (3-D aware during DIMENSION; follow the circle centre in the sine section)
  const sineK = ease.inOutCubic(seg(t, 37.07, 37.42));
  const ocx = lerp(CX, SCX, sineK);
  const axesIn = ease.outCubic(seg(t, 31.63, 32.1));
  const axesOut = 1 - seg(t, 40.71, 40.95);
  const axesA = axesIn * axesOut * (t < 33.41 ? 1 : lerp(1, 0.55, seg(t, 33.41, 33.9)));
  if (axesA > 0.01) {
    const yaw = (yawAt(t) * Math.PI) / 180, pit = (pitchAt(t) * Math.PI) / 180;
    const pr = (X: number, Y: number, Z: number) => {
      const x1 = X * Math.cos(yaw) + Z * Math.sin(yaw);
      const z1 = -X * Math.sin(yaw) + Z * Math.cos(yaw);
      const y2 = Y * Math.cos(pit) - z1 * Math.sin(pit);
      const z2 = Y * Math.sin(pit) + z1 * Math.cos(pit);
      const k = 1400 / (1400 + z2);
      return [ocx + x1 * k, CY + y2 * k] as [number, number];
    };
    const xl = t < 37.07 ? 460 : lerp(460, 1900, sineK);
    const xn = t < 37.07 ? 460 : lerp(460, 230, sineK);
    const dl = depthAt(t) * 330;
    const ax: [string, [number, number], [number, number], number][] = [
      ['x', pr(-xn * axesIn, 0, 0), pr(xl * axesIn, 0, 0), 1],
      ['y', pr(0, 400 * axesIn, 0), pr(0, -400 * axesIn, 0), 1],
      ['z', pr(0, 0, -dl), pr(0, 0, dl), depthAt(t)],
    ];
    ax.forEach(([lab, a, b, op]) => {
      if (op < 0.02) return;
      const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
      const ah = 14;
      nodes.push(
        <g key={'ax' + lab} opacity={axesA * op}>
          <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={lab === 'z' ? pal.hl : pal.ink} strokeWidth={2.4} strokeLinecap="round" />
          <path
            d={`M${b[0]} ${b[1]} L${b[0] - ah * Math.cos(ang - 0.4)} ${b[1] - ah * Math.sin(ang - 0.4)} M${b[0]} ${b[1]} L${b[0] - ah * Math.cos(ang + 0.4)} ${b[1] - ah * Math.sin(ang + 0.4)}`}
            stroke={lab === 'z' ? pal.hl : pal.ink}
            strokeWidth={2.4}
            strokeLinecap="round"
          />
          <text x={b[0] + Math.cos(ang) * 26 + (lab === 'y' ? 18 : 0)} y={b[1] + Math.sin(ang) * 26 + 12} fontFamily={F.serif} fontStyle="italic" fontSize={36} fill={lab === 'z' ? pal.hl : pal.ink} textAnchor="middle">
            {lab}
          </text>
        </g>,
      );
    });
    // ticks on x/y during the scatter
    if (t < 33.6) {
      const tk = axesIn * (1 - seg(t, 32.68, 32.9));
      for (let i = -5; i <= 5; i++) {
        if (!i) continue;
        const a = pr(i * 80, -7, 0), b = pr(i * 80, 7, 0);
        const c = pr(-7, i * 72, 0), d = pr(7, i * 72, 0);
        nodes.push(<line key={'tx' + i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={pal.ink} strokeWidth={2} opacity={tk * 0.7} />);
        nodes.push(<line key={'ty' + i} x1={c[0]} y1={c[1]} x2={d[0]} y2={d[1]} stroke={pal.ink} strokeWidth={2} opacity={tk * 0.7} />);
      }
    }
  }

  // ---------------- circle section
  const cc = {x: lerp(CX, SCX, sineK), r: lerp(R1, R2, sineK)};
  const sweep = sweepAt(t);
  const morph = ease.inOutCubic(seg(t, 40.71, 41.25));
  // construction rings (protractor-like), circle section only
  if (t >= 33.9 && t < 37.3) {
    const ck = seg(t, 33.9, 34.5) * (1 - seg(t, 37.07, 37.3));
    const rings: [number, number, string][] = [
      [R1 + 118, 1, '3 14'],
      [R1 - 128, -1, '2 10'],
    ];
    rings.forEach(([rr, dir, dash], i) => {
      nodes.push(
        <circle key={'cr' + i} cx={CX} cy={CY} r={rr} fill="none" stroke={pal.hl} strokeWidth={1.6} strokeDasharray={dash} opacity={0.32 * ck} transform={`rotate(${dir * t * 6} ${CX} ${CY})`} />,
      );
    });
    for (let i = 0; i < 72; i++) {
      const a = i * 5 + t * 3;
      const [x1, y1] = polar(CX, CY, R1 + 118, a);
      const [x2, y2] = polar(CX, CY, R1 + 118 + (i % 6 === 0 ? 14 : 7), a);
      nodes.push(<line key={'pt' + i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={pal.hl} strokeWidth={1.4} opacity={0.3 * ck} />);
    }
  }
  if (t >= 34.6 && t < 41.3) {
    const fade = 1 - morph;
    // pencil circle drawn by the compass
    const sw = Math.min(sweep, 359.99);
    if (t < 37.07 && sweep > 0.5) {
      const [ax, ay] = polar(CX, CY, R1, 0);
      const [bx, by] = polar(CX, CY, R1, -sw);
      nodes.push(<path key="pencil" d={`M${ax} ${ay} A${R1} ${R1} 0 ${sw > 180 ? 1 : 0} 0 ${bx} ${by}`} fill="none" stroke={pal.ink} strokeWidth={2.6} strokeLinecap="round" />);
    }
    // 12 ticks (= the 12 petals) and angle labels
    if (t < 37.2) {
      const tf = 1 - seg(t, 37.07, 37.2);
      for (let i = 0; i < 12; i++) {
        const a = -i * 30;
        const lit = clamp((sweep - i * 30) / 12);
        if (lit <= 0) continue;
        const [x1, y1] = polar(CX, CY, R1 - 12, a);
        const [x2, y2] = polar(CX, CY, R1 + 12 + (i % 3 === 0 ? 8 : 0), a);
        nodes.push(<line key={'tk' + i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={pal.ink} strokeWidth={i % 3 === 0 ? 3 : 2} opacity={tf * lit} />);
      }
      const labs: [number, string][] = [
        [0, '0'],
        [90, 'π/2'],
        [180, 'π'],
        [270, '3π/2'],
      ];
      labs.forEach(([a, s]) => {
        const lit = clamp((sweep - a) / 10);
        if (lit <= 0 || (a === 0 && t < 34.7)) return;
        const [x, y] = polar(CX, CY, R1 + (a === 0 || a === 180 ? 58 : 46), -a);
        nodes.push(
          <text key={'lab' + a} x={x} y={y + 12} fontFamily={F.serif} fontStyle="italic" fontSize={34} fill={pal.hl} textAnchor="middle" opacity={tf * lit * (1 - seg(t, 36.25, 36.4))}>
            {s}
          </text>,
        );
      });
    }
    // compass arm
    if (t >= 34.62 && t < 36.45) {
      const ak = seg(t, 34.62, 34.8) * (1 - seg(t, 36.25, 36.45));
      const [ex, ey] = polar(CX, CY, R1, -sweep);
      const [mx, my] = polar(CX, CY, R1 * 0.55, -sweep);
      const [lx, ly] = polar(mx, my, 30, -sweep - 90);
      nodes.push(
        <g key="arm" opacity={ak}>
          <line x1={CX} y1={CY} x2={ex} y2={ey} stroke={pal.ink} strokeWidth={3.5} strokeLinecap="round" />
          <circle cx={ex} cy={ey} r={8} fill={pal.hl} />
          <circle cx={ex} cy={ey} r={16 + 10 * beatPulse(t, 0.12)} fill="none" stroke={pal.hl} strokeWidth={2} opacity={0.6} />
          <text x={lx} y={ly + 12} fontFamily={F.serif} fontStyle="italic" fontSize={40} fill={pal.ink} textAnchor="middle">
            r
          </text>
        </g>,
      );
    }
    // CIRCUMFERENCE: the clay stroke races 0→2π
    if (t >= 36.29) {
      const p = ease.outCubic(seg(t, 36.29, 36.66));
      const L = 2 * Math.PI * cc.r;
      const sw2 = lerp(11, 7, sineK) * (1 + 0.25 * beatPulse(t, 0.12));
      nodes.push(
        <path
          key="circ"
          d={`M${cc.x - cc.r} ${CY} A${cc.r} ${cc.r} 0 1 1 ${cc.x + cc.r} ${CY} A${cc.r} ${cc.r} 0 1 1 ${cc.x - cc.r} ${CY}`}
          fill="none"
          stroke={pal.curve}
          strokeWidth={sw2}
          strokeLinecap="round"
          strokeDasharray={`${L} ${L}`}
          strokeDashoffset={L * (1 - p)}
          opacity={fade}
          transform={morph > 0 ? `translate(${cc.x} ${CY}) scale(${1 - morph}) translate(${-cc.x} ${-CY})` : undefined}
          style={{filter: `drop-shadow(0 0 ${6 + 10 * pulse(t, 36.29, 0.4)}px ${C.clayLight})`}}
        />,
      );
      // head spark while racing
      if (p < 1) {
        const [hx, hy] = polar(CX, CY, R1, 180 + 360 * p);
        nodes.push(<circle key="chead" cx={hx} cy={hy} r={13} fill="#fff" style={{filter: `drop-shadow(0 0 10px ${C.clayLight})`}} />);
      }
      // CIRCUMFERENCE set on the path, C = 2πr along the bottom
      const textK = 1 - seg(t, 37.07, 37.3);
      if (textK > 0) {
        const head = 180 + 360 * p;
        nodes.push(
          <g key="ctext" opacity={textK} transform={`translate(${cc.x} ${CY}) scale(${cc.r / R1}) rotate(${(t - 36.29) * 4}) translate(${-CX} ${-CY})`}>
            <ArcText
              text="CIRCUMFERENCE"
              cx={CX}
              cy={CY}
              r={R1 + 40}
              center={270}
              spacing={0.5}
              size={62}
              color={pal.ink}
              reveal={(i, a) => clamp((head - a) / 16)}
              pop={(i) => 0.35 * pulse(t, 36.29 + 0.37 * ((195 + i * 12.5 - 180) / 360), 0.12)}
            />
            <ArcText
              text="C = 2πr"
              cx={CX}
              cy={CY}
              r={R1 + 76}
              center={90}
              bottom
              widths={[0.66, 0.28, 0.58, 0.28, 0.5, 0.56, 0.42]}
              spacing={0.12}
              size={50}
              font={F.serif}
              weight={500}
              italic
              color={pal.hl}
              reveal={(i) => clamp((t - 36.62 - i * 0.04) / 0.15)}
            />
          </g>,
        );
      }
    }
  }

  // ---------------- sine section
  const phi = phiAt(t);
  if (t >= 37.3 && t < 41.3) {
    const fade = 1 - morph;
    const px = cc.x + R2 * Math.cos(phi), py = CY - R2 * Math.sin(phi);
    const xEnd = Math.min(waveEnd(phi), 2250);
    // wave
    if (t < 40.71 && xEnd > X0 + 1) {
      const pts: [number, number][] = [];
      for (let x = X0; x <= xEnd; x += 6) pts.push([x, waveY(phi, x)]);
      pts.push([xEnd, waveY(phi, xEnd)]);
      nodes.push(<path key="wave" d={polyline(pts)} fill="none" stroke={pal.curve} strokeWidth={7 * (1 + 0.2 * beatPulse(t, 0.1))} strokeLinecap="round" strokeLinejoin="round" />);
    }
    // construction: radius arm, sin drop, projection
    const ck = seg(t, 37.3, 37.5) * fade;
    nodes.push(
      <g key="constr" opacity={ck}>
        <line x1={cc.x} y1={CY} x2={px} y2={py} stroke={pal.ink} strokeWidth={3} strokeLinecap="round" />
        <line x1={px} y1={py} x2={px} y2={CY} stroke={pal.hl} strokeWidth={3} strokeDasharray="7 7" />
        <text x={px + (Math.cos(phi) >= 0 ? 16 : -16)} y={(py + CY) / 2 + 10} textAnchor={Math.cos(phi) >= 0 ? 'start' : 'end'} fontFamily={F.serif} fontStyle="italic" fontSize={28} fill={pal.hl} opacity={clamp(Math.abs(Math.sin(phi)) * 3)}>
          sin θ
        </text>
        <line x1={px} y1={py} x2={X0} y2={py} stroke={pal.soft} strokeWidth={2.2} strokeDasharray="6 8" />
        <circle cx={px} cy={py} r={10} fill={pal.hl} />
        <circle cx={X0} cy={py} r={8} fill={pal.curve} stroke="#fff" strokeWidth={3} />
      </g>,
    );
    // conversational tangents (39.47 / 39.71 / 39.94) — the human's side quests, each hanging off a tangent
    const bub: [number, string, 'trough' | 'bench', 1 | -1][] = [
      [39.47, 'btw, unrelated…', 'trough', 1],
      [39.71, 'wait, side quest:', 'trough', -1],
      [39.94, 'anyway, where was I?', 'bench', 1],
    ];
    bub.forEach(([at, txt, kind, dir], i) => {
      const k = seg(t, at, at + 0.22) * (1 - seg(t, 40.05, 40.25));
      if (k <= 0) return;
      let bx: number, by: number, m: number;
      if (kind === 'trough') {
        const pa = phiAt(at);
        const target = i === 0 ? 650 : 1650;
        const n = Math.round((pa + Math.PI / 2 - (target - X0) * KW) / (2 * Math.PI));
        bx = X0 + (pa + Math.PI / 2 - 2 * Math.PI * n) / KW;
        by = waveY(phi, bx);
        m = waveSlope(phi, bx);
      } else {
        // the far end of the human's own bench tangent
        const yl = waveY(phi, XS), ml = waveSlope(phi, XS), nl = Math.hypot(1, ml);
        bx = XS - 400 / nl;
        by = yl - (400 * ml) / nl;
        m = ml;
      }
      const nn = Math.hypot(1, m);
      const len = 150 * ease.outCubic(k);
      const ex = bx + (len / nn) * dir, ey = by + ((len * m) / nn) * dir;
      if (kind === 'trough') {
        nodes.push(
          <g key={'bt' + i} opacity={clamp(k * 2)}>
            <line x1={bx - (70 / nn) * dir} y1={by - ((70 * m) / nn) * dir} x2={ex} y2={ey} stroke={C.blue} strokeWidth={2.6} strokeDasharray="8 7" strokeLinecap="round" />
            <circle cx={bx} cy={by} r={7} fill={C.blue} stroke="#fff" strokeWidth={2.5} />
          </g>,
        );
      }
      const bxx = kind === 'trough' ? ex : bx, byy = kind === 'trough' ? ey + 6 : by;
      nodes.push(
        <foreignObject key={'bb' + i} x={bxx - (dir < 0 ? 420 : 0)} y={byy - 40} width={420} height={80} style={{overflow: 'visible'}}>
          <div style={{position: 'relative', width: 420, height: 80}}>
            <TangentBubble x={dir < 0 ? 412 : 8} y={40} text={txt} k={k} tail={dir < 0 ? 'right' : 'left'} />
          </div>
        </foreignObject>,
      );
    });
    // one wavelength = the unrolled circumference
    {
      const bk = seg(t, 38.3, 38.6) * (1 - seg(t, 40.0, 40.3));
      if (bk > 0) {
        const L = 2 * Math.PI * R2 * ease.outCubic(seg(t, 38.3, 38.75));
        const yb = CY + R2 + 70;
        nodes.push(
          <g key="lam" opacity={bk}>
            <path d={`M${X0} ${yb - 12} L${X0} ${yb + 12} M${X0} ${yb} L${X0 + L} ${yb} M${X0 + L} ${yb - 12} L${X0 + L} ${yb + 12}`} stroke={pal.hl} strokeWidth={2.4} fill="none" />
            <text x={X0 + L / 2} y={yb + 46} textAnchor="middle" fontFamily={F.serif} fontStyle="italic" fontSize={36} fill={pal.hl}>
              λ = 2πr
            </text>
          </g>,
        );
      }
    }
    // TANGENTS: a fan of tangent lines flashes along the frozen wave
    if (t >= 40.05 && t < 40.95) {
      const lines: React.ReactNode[] = [];
      for (let n = 0; ; n++) {
        const x = X0 + 30 + n * 92;
        if (x > Math.min(xEnd, 1920 + panX + 60)) break;
        const d = Math.abs(x - XS) * 0.00028;
        const p = ease.outCubic(seg(t, 40.05 + d, 40.05 + d + 0.16));
        if (p <= 0) continue;
        const y = waveY(phi, x), m = waveSlope(phi, x), nn = Math.hypot(1, m);
        const hl = 170 * p;
        const op = (0.35 + 0.65 * (1 - seg(t, 40.05 + d + 0.18, 40.05 + d + 0.5))) * fade;
        lines.push(<line key={n} x1={x - hl / nn} y1={y - (hl * m) / nn} x2={x + hl / nn} y2={y + (hl * m) / nn} stroke={pal.hl} strokeWidth={3} strokeLinecap="round" opacity={op} />);
        lines.push(<circle key={'d' + n} cx={x} cy={y} r={5} fill={pal.hl} opacity={op} />);
      }
      nodes.push(<g key="fan">{lines}</g>);
    }
  }

  // ---------------- TANGENTS word laid along one tangent (an inflection point → slope ±1)
  let tanWord: React.ReactNode = null;
  if (t >= 40.0 && t < 40.95) {
    const phiF = phiAt(40.05);
    const target = 1500;
    const nIdx = Math.round((phiF - (target - X0) * KW) / Math.PI);
    const xw = X0 + (phiF - nIdx * Math.PI) / KW;
    const yw = waveY(phiF, xw);
    const m = waveSlope(phiF, xw);
    const ang = (Math.atan(m) * 180) / Math.PI;
    const a = (ang * Math.PI) / 180;
    const nx = Math.sin(a), ny = -Math.cos(a);
    const p = ease.outCubic(seg(t, 40.05, 40.25));
    const L = 330 * p;
    const sh = 60; // word sits a little down the line, away from the bench
    nodes.push(
      <line key="tanline" x1={xw - Math.cos(a) * L * 0.42} y1={yw - Math.sin(a) * L * 0.42} x2={xw + Math.cos(a) * (L + sh * 2)} y2={yw + Math.sin(a) * (L + sh * 2)} stroke={pal.ink} strokeWidth={5} strokeLinecap="round" opacity={1 - morph} />,
    );
    tanWord = (
      <div key="tanword" style={{position: 'absolute', left: 0, top: 0, opacity: 1 - seg(t, 40.71, 40.9)}}>
        <Keyword text="TANGENTS" t={t} at={40.05} x={xw + nx * 56 + Math.cos(a) * 60} y={yw + ny * 56 + Math.sin(a) * 60} size={84} color={pal.ink} mode="drop" dur={0.28} rotate={ang} flowerO="none" />
      </div>
    );
  }

  // ---------------- ∞ (the wave folds into a lemniscate)
  if (t >= 40.71) {
    const phiF = phiAt(40.05);
    const xEnd = Math.min(waveEnd(phiF), 2250);
    const N = 220;
    const pts: [number, number][] = [];
    // the wave is folded in half (second half runs back over the first, mirrored), then relaxes into ∞:
    // left tip → upper-left → centre → lower-right → right tip → upper-right → centre → lower-left → left tip
    const e2 = ease.inOutCubic(seg(t, 40.98, 41.28));
    for (let i = 0; i < N; i++) {
      const u = i / (N - 1);
      const x = lerp(X0, xEnd, u);
      const v = u < 0.5 ? 2 * u : 2 * u - 1;
      const fx = u < 0.5 ? CX - LA + 2 * LA * v : CX + LA - 2 * LA * v;
      const fy = CY - 0.33 * LA * Math.sin(2 * Math.PI * v);
      const [lx, ly] = lemni(Math.PI - 2 * Math.PI * u);
      const e1 = ease.inOutCubic(seg(t, 40.71 + 0.06 * u, 41.0 + 0.06 * u));
      const ax = lerp(x, fx, e1), ay = lerp(waveY(phiF, x), fy, e1);
      pts.push([lerp(ax, lx, e2), lerp(ay, ly, e2)]);
    }
    const glowK = 0.5 + 1.2 * pulse(t, 41.52, 0.5) + 0.8 * seg(t, 41.3, 43.5);
    nodes.push(
      <path
        key="inf"
        d={polyline(pts) + (t > 41.3 ? 'Z' : '')}
        fill="none"
        stroke={pal.curve}
        strokeWidth={7 * (1 + 0.3 * beatPulse(t, 0.1))}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{filter: `drop-shadow(0 0 ${4 + 8 * glowK}px ${pal.dark ? 'rgba(255,240,225,0.6)' : C.clayLight})`}}
      />,
    );
    // comet trail of the racing point
    if (t >= 41.26) {
      const s = raceS(t);
      const sp = raceSpeed(t);
      const trail = t > 43.51 ? Math.max(0, 5.8 - (t - 43.51) * 14) * clamp(1) : clamp(sp * 0.11, 0.5, 5.8);
      const segs = 16;
      for (let j = 0; j < segs; j++) {
        const a0 = s - (trail * (j + 1)) / segs, a1 = s - (trail * j) / segs;
        const ps: [number, number][] = [];
        for (let q = 0; q <= 8; q++) ps.push(lemni(lerp(a0, a1, q / 8)));
        nodes.push(
          <path key={'tr' + j} d={polyline(ps)} fill="none" stroke="#FFFFFF" strokeWidth={lerp(14, 3, j / segs)} strokeLinecap="round" opacity={(1 - j / segs) * 0.9} />,
        );
      }
    }
  }

  // ---------------- the flower (main form): hair ornament → circle centre → unit circle → racing point
  let flower: React.ReactNode = null;
  {
    // ornament position follows the point set (z = 0)
    const yaw = (yawAt(t) * Math.PI) / 180, pit = (pitchAt(t) * Math.PI) / 180;
    const X = (SNAP_ORN.u - 0.5) * fr.w, Y = (SNAP_ORN.v - 0.5) * fr.h;
    const x1 = X * Math.cos(yaw), z1 = -X * Math.sin(yaw);
    const y2 = Y * Math.cos(pit) - z1 * Math.sin(pit), z2 = Y * Math.sin(pit) + z1 * Math.cos(pit);
    const k = 1400 / (1400 + z2);
    const ox = fr.cx + x1 * k, oy = fr.cy + y2 * k;
    const oSize = 0.1 * fr.h * 0.95 * k;
    const fly = ease.inOutCubic(seg(t, 33.41, 34.3));
    let fx = lerp(ox, CX, fly), fy = lerp(oy, CY, fly) - Math.sin(fly * Math.PI) * 60;
    let fs = lerp(oSize, 64, ease.outBack(fly));
    let op = t < 31.0 ? 0 : 1 - Math.sin(fly * Math.PI) * 0.45;
    // sine section: follows the circle centre
    if (t >= 37.07) {
      fx = cc.x;
      fs = lerp(64, 34, sineK);
    }
    // ∞: flies to the crossing, then races
    if (t >= 40.71) {
      const mv = ease.inOutCubic(seg(t, 40.71, 41.26));
      const [lx, ly] = lemni(raceS(t));
      fx = lerp(cc.x, lx, mv);
      fy = lerp(CY, ly, mv);
      fs = lerp(34, 30, mv);
    }
    const spin = t * 40 + (t > 33.41 ? (t - 33.41) * 60 : 0) + (t > 41.26 ? raceS(t) * 57 : 0) + pulse(t, 36.29, 0.3) * 120;
    const glow = (t < 33.41 ? 0 : 0.5 * fly) + 1.5 * pulse(t, 34.3, 0.35) + (t > 41.26 ? 0.8 + 1.2 * pulse(t, 41.52, 0.4) : 0);
    if (op > 0) {
      flower = <Flower key="flw" x={fx} y={fy} size={fs * (1 + 0.06 * beatPulse(t, 0.12))} spin={spin} opacity={op} glow={glow} glowColor={pal.dark ? '#FFE9DA' : C.clay} color={C.clay} shade={null} />;
    }
  }

  // ---------------- the human sits on the wave
  let human: React.ReactNode = null;
  if (t >= 38.6 && t < 41.2) {
    const phiNow = phiAt(t);
    const yl = waveY(phiNow, XS);
    const m = waveSlope(phiNow, XS);
    const ang = (Math.atan(m) * 180) / Math.PI;
    const land = 39.39;
    const s = seg(t, 38.6, land);
    let hx = lerp(1760, XS, ease.outQuad(s));
    let hy = lerp(-140, yl, ease.inQuad(s));
    let a = lerp(-30, ang, ease.inQuad(s));
    let squash = t >= land ? Math.exp(-(t - land) / 0.12) * Math.cos((t - land) * 30) : 0;
    // hop off at "If" (40.71)
    if (t >= 40.71) {
      const h = seg(t, 40.71, 41.15);
      hx += h * 700;
      hy -= Math.sin(h * Math.PI * 0.75) * 300 + h * h * 200;
      a += h * 200;
      squash = 0;
    }
    const benchK = ease.outBack(seg(t, land - 0.04, land + 0.16)) * (1 - seg(t, 40.71, 40.85));
    const ar = (ang * Math.PI) / 180;
    if (benchK > 0) {
      const bl = 120 * benchK;
      nodes.push(
        <g key="bench">
          <line x1={XS - Math.cos(ar) * 520 * benchK} y1={yl - Math.sin(ar) * 520 * benchK} x2={XS + Math.cos(ar) * 520 * benchK} y2={yl + Math.sin(ar) * 520 * benchK} stroke={pal.ink} strokeWidth={2} strokeDasharray="10 9" opacity={0.55} />
          <line x1={XS - Math.cos(ar) * bl} y1={yl - Math.sin(ar) * bl} x2={XS + Math.cos(ar) * bl} y2={yl + Math.sin(ar) * bl} stroke={pal.ink} strokeWidth={11} strokeLinecap="round" />
          <line x1={XS - Math.cos(ar) * bl * 0.9} y1={yl - Math.sin(ar) * bl * 0.9 - 2} x2={XS + Math.cos(ar) * bl * 0.9} y2={yl + Math.sin(ar) * bl * 0.9 - 2} stroke={C.clayLight} strokeWidth={3} strokeLinecap="round" opacity={0.9} />
          <circle cx={XS} cy={yl} r={7} fill={pal.hl} />
        </g>,
      );
    }
    const off = 6; // sit on top of the plank
    human = <SitCursor key="sit" x={hx + Math.sin(ar) * off} y={hy - Math.cos(ar) * off} angle={a} t={t} squash={squash} scale={3.6} flail={t < land ? 1 : t > 40.71 ? 1 : 0} />;
  }

  // ---------------- snap FX
  const fxNodes: React.ReactNode[] = [];
  {
    const fxp = fr.cx - fr.w / 2 + SNAP_FINGER.u * fr.w;
    const fyp = fr.cy - fr.h / 2 + SNAP_FINGER.v * fr.h;
    if (t >= 30.66 && t < 31.2) {
      const p = seg(t, 30.68, 31.0);
      const s = Math.sin(Math.min(1, p * 1.25) * Math.PI) * 70;
      fxNodes.push(
        <svg key="spark" style={{position: 'absolute', left: fxp, top: fyp, overflow: 'visible'}} width={1} height={1}>
          <path d={`M0 ${-s} Q${s * 0.14} ${-s * 0.14} ${s} 0 Q${s * 0.14} ${s * 0.14} 0 ${s} Q${-s * 0.14} ${s * 0.14} ${-s} 0 Q${-s * 0.14} ${-s * 0.14} 0 ${-s} Z`} fill={C.gold} style={{filter: 'drop-shadow(0 0 12px #fff)'}} transform={`rotate(${p * 40})`} />
        </svg>,
      );
    }
    fxNodes.push(<Ring key="sr" x={fxp} y={fyp} t={t} at={30.7} r0={8} r1={70} color={C.gold} width={4} dur={0.3} />);
    fxNodes.push(<RayBurst key="sb" x={fxp} y={fyp} t={t} at={30.7} r0={30} r1={160} n={12} color={C.gold} width={4} dur={0.35} />);
  }

  // ---------------- dots
  const {paths} = cloudPaths(t);
  const toClay = ease.inOutCubic(seg(t, 33.5, 34.3));
  const colors = BUCKET_COLORS.map((c) => mix(c, pal.curve, toClay));

  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0', transform: `translate(${960 - (960 + panX) * z}px, ${540 - 540 * z}px) scale(${z})`}}>
      <Paper pal={pal} />
      <div style={{position: 'absolute', left: CX - 700, top: CY - 700, width: 1400, height: 1400, borderRadius: 700, background: `radial-gradient(circle, ${pal.dark ? 'rgba(255,236,220,0.22)' : 'rgba(240,162,127,0.16)'} 0%, rgba(240,162,127,0) 60%)`, opacity: 0.6 + 0.4 * beatPulse(t, 0.2)}} />
      {/* Claude-chan in the artifact, dissolving from the snapping fingertip */}
      {t < 31.4 ? (
        <Sprite
          src="img/cc_snap.png"
          t={t}
          x={fr.cx}
          y={fr.cy + fr.h / 2}
          h={fr.h}
          outline="#ffffff"
          outlineWidth={5}
          shadow="drop-shadow(0 14px 22px rgba(140,70,40,0.18))"
          style={{
            WebkitMaskImage:
              t > 30.72
                ? `radial-gradient(circle at ${SNAP_FINGER.u * fr.w}px ${SNAP_FINGER.v * fr.h}px, transparent ${((t - 30.72) / 0.62) * fr.h - 10}px, black ${((t - 30.72) / 0.62) * fr.h + 40}px)`
                : undefined,
          }}
        />
      ) : null}
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {nodes}
      </svg>
      <DotCloud paths={paths} colors={colors} stroke={(b) => (BUCKET_LIGHT[b] && toClay < 0.5 ? '#E2B39B' : null)} strokeWidth={1.2} />
      {fxNodes}
      {/* accents on the hits */}
      <Ring x={CX} y={CY} t={t} at={34.3} r0={40} r1={R1 - 20} color={pal.curve} width={5} dur={0.45} />
      <Ring x={CX} y={CY} t={t} at={36.29} r0={R1} r1={R1 + 260} color={pal.curve} width={8} dur={0.55} />
      <Ring x={CX} y={CY} t={t} at={36.62} r0={R1} r1={R1 + 160} color={C.clayLight} width={4} dur={0.4} />
      <Ring x={XS} y={CY - R2} t={t} at={40.05} r0={20} r1={420} color={pal.hl} width={5} dur={0.5} />
      {flower}
      {human}
      {tanWord}
    </div>
  );
};

// ------------------------------------------------------------------ artifact panel chrome
const PanelHeader: React.FC<{t: number}> = ({t}) => {
  const px = panelXAt(t);
  const k = 1 - ease.inCubic(seg(t, 31.12, 31.45));
  if (k <= 0 || px >= 1919) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: px,
        top: 0,
        width: W - px,
        height: 76,
        background: 'rgba(250,249,245,0.96)',
        borderBottom: '1.5px solid rgba(31,30,29,0.12)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 30px',
        gap: 14,
        fontFamily: F.sans,
        opacity: k,
        transform: `translateY(${(1 - k) * -40}px)`,
        boxSizing: 'border-box',
      }}
    >
      <IArtifact size={26} color={C.gray4} />
      <div style={{fontSize: 24, fontWeight: 500, color: C.ink}}>what_am_i.svg</div>
      <div style={{fontSize: 18, color: C.gray3, border: '1.5px solid rgba(31,30,29,0.15)', borderRadius: 8, padding: '2px 10px'}}>Image</div>
      <div style={{flex: 1}} />
      <div style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 20, color: C.gray4, border: '1.5px solid rgba(31,30,29,0.15)', borderRadius: 10, padding: '6px 14px'}}>
        <ICopy size={20} color={C.gray4} /> Copy
      </div>
      <IClose size={26} color={C.gray4} />
    </div>
  );
};

// ------------------------------------------------------------------ DIMENSION readout
const DimCounter: React.FC<{t: number}> = ({t}) => {
  if (t < 32.6 || t > 33.75) return null;
  let n = 3;
  if (t >= 32.86) n = Math.round(3 * Math.pow(12288 / 3, ease.inCubic(seg(t, 32.86, 33.33))));
  const k = ease.outBack(seg(t, 32.68, 32.9)) * (1 - ease.inCubic(seg(t, 33.41, 33.7)));
  const done = t >= 33.33;
  return (
    <div style={{position: 'absolute', left: 1430, top: 330, transform: `scale(${k})`, transformOrigin: '0% 50%', fontFamily: F.mono, color: C.ink}}>
      <div style={{fontSize: 26, color: C.gray3, marginBottom: 4}}>dim(me)</div>
      <div style={{fontSize: 92, fontWeight: 800, color: done ? C.clay : C.ink, transform: `scale(${1 + 0.18 * (done ? pulse(t, 33.33, 0.2) : 0)})`, transformOrigin: '0% 50%'}}>
        {n.toLocaleString('en-US')}
      </div>
      <div style={{width: 300, height: 6, background: 'rgba(31,30,29,0.1)', borderRadius: 3, marginTop: 8}}>
        <div style={{width: `${(Math.log(n) / Math.log(12288)) * 100}%`, height: '100%', background: C.clay, borderRadius: 3}} />
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ LIMITATIONS: a label box too small for its word
const LimitBox: React.FC<{t: number}> = ({t}) => {
  if (t < 42.4) return null;
  // ∞ bbox → screen
  const [ax, ay] = toScreen(t, CX - LA - 40, CY - 0.354 * LA - 40);
  const [bx, by] = toScreen(t, CX + LA + 40, CY + 0.354 * LA + 40);
  // cursor: arrives, then drags the marquee
  const arrive = ease.outCubic(seg(t, 42.42, 42.68));
  const drag = ease.inOutCubic(seg(t, 42.68, 43.36));
  let cx = lerp(240, ax, arrive), cy = lerp(130, ay, arrive);
  cx = lerp(cx, bx, drag);
  cy = lerp(cy, by, drag);
  // label box (screen)
  const box = {x: 820, y: 770, w: 600, h: 150};
  const snap = ease.outBackStrong(seg(t, 43.51, 43.7));
  const isBox = t >= 43.51;
  const rx = isBox ? lerp(ax, box.x, snap) : ax;
  const ry = isBox ? lerp(ay, box.y, snap) : ay;
  const rw = isBox ? lerp(bx - ax, box.w, snap) : cx - ax;
  const rh = isBox ? lerp(by - ay, box.h, snap) : cy - ay;
  const hit = isBox ? Math.exp(-(t - 43.51) / 0.18) : 0;
  const strain = isBox ? 1 + 0.035 * Math.exp(-(t - 43.58) / 0.2) * Math.sin(Math.max(0, t - 43.58) * 38) : 1;
  if (isBox) {
    cx = lerp(bx, box.x + box.w - 70, ease.inOutCubic(seg(t, 43.6, 43.95)));
    cy = lerp(by, box.y + box.h - 30, ease.inOutCubic(seg(t, 43.6, 43.95)));
  }
  const marchOff = -t * 60;
  return (
    <>
      {drag > 0 && !isBox ? (
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
          <rect x={ax} y={ay} width={Math.max(1, rw)} height={Math.max(1, rh)} fill="rgba(255,246,236,0.08)" stroke={C.cream} strokeWidth={3} strokeDasharray="14 10" strokeDashoffset={marchOff} />
          {t > 43.36
            ? [
                [ax, ay],
                [ax + rw, ay],
                [ax, ay + rh],
                [ax + rw, ay + rh],
              ].map(([x, y], i) => <rect key={i} x={x - 7} y={y - 7} width={14} height={14} fill={C.cream} stroke={C.clayDark} strokeWidth={2} />)
            : null}
          <g transform={`translate(${ax + rw + 18} ${ay + rh + 46})`} opacity={drag < 1 ? 1 : 0}>
            <rect x={0} y={-24} width={150} height={34} rx={8} fill={C.ink} opacity={0.75} />
            <text x={75} y={0} textAnchor="middle" fontFamily={F.mono} fontSize={19} fill={C.cream}>
              {Math.round(rw / 0.84)} × {Math.round(rh / 0.84)}
            </text>
          </g>
        </svg>
      ) : null}
      {isBox ? (
        <>
          {/* lim x→∞ me = */}
          <div style={{position: 'absolute', left: box.x - 360, top: box.y + box.h / 2, transform: 'translateY(-50%)', fontFamily: F.serif, color: C.cream, fontSize: 80, display: 'flex', alignItems: 'center', gap: 20, opacity: seg(t, 43.55, 43.75)}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 0.9}}>
              <span>lim</span>
              <span style={{fontSize: 32, fontStyle: 'italic', marginTop: 6}}>x→∞</span>
            </div>
            <span style={{fontStyle: 'italic'}}>me</span>
            <span>=</span>
          </div>
          <div
            style={{
              position: 'absolute',
              left: rx,
              top: ry,
              width: rw,
              height: rh,
              background: C.paper,
              border: `5px solid ${C.ink}`,
              borderRadius: 18,
              boxSizing: 'border-box',
              overflow: 'hidden',
              transform: `scaleX(${strain})`,
              transformOrigin: '0% 50%',
              boxShadow: `0 18px 40px rgba(80,30,15,0.35), 0 0 0 ${hit * 30}px rgba(255,246,236,${0.3 * hit})`,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 28,
                right: 28,
                top: '50%',
                transform: `translateY(-50%) scale(${lerp(1.5, 1, ease.outCubic(seg(t, 43.51, 43.64)))})`,
                transformOrigin: '0% 50%',
                fontFamily: F.mono,
                fontWeight: 800,
                fontSize: 120,
                lineHeight: 1,
                color: C.ink,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              LIMITATIONS
            </div>
          </div>
          {/* hover tooltip reveals the full word */}
          {t > 43.85 ? (
            <div
              style={{
                position: 'absolute',
                left: box.x + box.w - 70,
                top: box.y + box.h + 34,
                transform: `translateX(-50%) scale(${ease.outBack(seg(t, 43.85, 44.05))})`,
                transformOrigin: '50% 0%',
                background: C.ink,
                color: C.cream,
                borderRadius: 10,
                padding: '10px 18px 12px',
                boxShadow: '0 8px 18px rgba(0,0,0,0.25)',
              }}
            >
              <Keyword text="LIMITATIONS" t={t} at={43.85} size={34} color={C.cream} mode="type" dur={0.25} flowerColor={C.clayLight} />
            </div>
          ) : null}
        </>
      ) : null}
      <Cursor x={cx} y={cy} size={40} press={drag > 0 && drag < 1 ? 0.4 : isBox ? pulse(t, 43.51, 0.2) : 0} />
    </>
  );
};

// ------------------------------------------------------------------ context window meter
const ContextMeter: React.FC<{t: number}> = ({t}) => {
  if (t < 42.3) return null;
  const k = ease.outCubic(seg(t, 42.35, 42.65));
  const f = lerp(0.61, 1, ease.inCubic(seg(t, 42.4, 43.51)));
  const tokens = Math.round(f * 200000);
  const full = t >= 43.51;
  const flash = full ? pulse(t, 43.51, 0.25) : 0;
  return (
    <div style={{position: 'absolute', right: 70, top: 56, width: 560, opacity: k, transform: `translateY(${(1 - k) * -30}px)`, fontFamily: F.sans, color: C.cream}}>
      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 22, marginBottom: 10, fontWeight: 500}}>
        <span>context window</span>
        <span style={{fontFamily: F.mono, fontSize: 21}}>
          {tokens.toLocaleString('en-US')} / 200,000
        </span>
      </div>
      <div style={{height: 16, borderRadius: 8, background: 'rgba(255,246,236,0.25)', overflow: 'hidden'}}>
        <div style={{width: `${f * 100}%`, height: '100%', borderRadius: 8, background: full ? mix(C.cream, '#ffffff', flash) : C.cream, boxShadow: full ? `0 0 ${20 * flash}px #fff` : undefined}} />
      </div>
      {full ? <div style={{fontFamily: F.mono, fontSize: 19, marginTop: 10, opacity: seg(t, 43.55, 43.7), color: C.ink}}>context limit reached</div> : null}
    </div>
  );
};

// =================================================================================================
export const S02Verse1: React.FC<{t: number}> = ({t}) => {
  const px = panelXAt(t);
  const appOn = t < 31.7;
  const wipe = ease.outCubic(seg(t, 40.86, 41.18)); // paper → clay (iris on the downbeat)
  const pal = wipe >= 1 ? CLAYP : PAPER;
  const capColor = mix(C.ink, C.cream, seg(t, 41.0, 41.15));

  const cap = (text: string, after: number, outAt: number, x = 960) => (
    <LyricLine
      key={text + after}
      cue={prettyCue(cueAt(text, after))}
      t={t}
      x={x}
      y={986}
      size={52}
      color={capColor}
      hl={t < 41 ? C.clayDark : '#FFFFFF'}
      outAt={outAt}
      fadeOut={0.14}
      shadow={t < 41 ? '0 0 14px rgba(250,249,245,1), 0 0 4px rgba(250,249,245,1)' : '0 2px 12px rgba(142,63,39,0.45)'}
    />
  );

  return (
    <AbsoluteFill style={{background: C.paper, overflow: 'hidden'}}>
      {/* ---------------- the stage (artifact canvas) */}
      <AbsoluteFill style={{clipPath: px > 0.5 ? `inset(0 0 0 ${px}px)` : undefined}}>
        <Stage t={t} pal={wipe >= 1 ? CLAYP : PAPER} />
        {wipe > 0 && wipe < 1 ? (
          <>
            <AbsoluteFill style={{clipPath: `circle(${wipe * 1250}px at ${toScreen(t, CX, CY)[0]}px ${toScreen(t, CX, CY)[1]}px)`}}>
              <Stage t={t} pal={CLAYP} />
            </AbsoluteFill>
            <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
              <circle cx={toScreen(t, CX, CY)[0]} cy={toScreen(t, CX, CY)[1]} r={wipe * 1250} fill="none" stroke={C.cream} strokeWidth={10 * (1 - wipe) + 2} />
              <circle cx={toScreen(t, CX, CY)[0]} cy={toScreen(t, CX, CY)[1]} r={wipe * 1250 + 26} fill="none" stroke={C.clay} strokeWidth={4 * (1 - wipe)} opacity={0.7} />
            </svg>
          </>
        ) : null}
      </AbsoluteFill>

      {/* ---------------- the Claude app (left), artifact panel chrome */}
      {appOn ? (
        <>
          <div style={{position: 'absolute', left: 0, top: 0, width: Math.max(900, px), height: H, transform: `translateX(${Math.min(0, px - 900)}px)`, boxShadow: '8px 0 30px rgba(20,20,19,0.08)'}}>
            <ClaudeApp
              t={t}
              zoom={1.5}
              width={Math.max(900, px)}
              sidebar={0}
              messages={[
                {kind: 'user', text: 'hi claude!'},
                {kind: 'claude', text: 'Hi! I’m Claude. It’s really nice to meet you.', at: 0, dur: 0.5, done: 1},
                {kind: 'user', text: 'ok but what are you, mathematically?'},
                {
                  kind: 'claude',
                  words: [
                    {w: 'If', s: 29.71},
                    {w: 'I’m', s: 30.16},
                    {w: 'a', s: 30.64},
                    {w: 'set', s: 30.7},
                    {w: 'of', s: 30.86},
                    {w: 'points…', s: 31.04},
                  ],
                  done: 31.6,
                  size: 1.15,
                },
              ]}
              composer={{placeholder: 'Reply to Claude…'}}
            />
          </div>
          {px < 1919 ? <div style={{position: 'absolute', left: px - 1, top: 0, width: 2, height: H, background: 'rgba(31,30,29,0.12)'}} /> : null}
          <PanelHeader t={t} />
        </>
      ) : null}

      <DefLabel t={t} pal={pal} />

      {/* ---------------- keywords & captions */}
      <Extruded text="DIMENSION" t={t} at={32.68} out={33.3} x={960} y={930} size={124} ang={45 + yawAt(t) * 0.55} depth={34} face={C.ink} side0={C.clay} side1={C.clayDeep} />
      {cap('Then I will give you my', 31.0, 32.6, px + (W - px) / 2)}
      {cap("If I'm a circle", 33.3, 34.58)}
      {cap('Then I will give you my', 34.6, 36.22)}
      {cap("If I'm a sine wave", 37.0, 38.54)}
      {cap('Then you can sit on all my', 38.5, 40.0)}
      {cap('If I approach infinity', 40.6, 42.28)}
      {cap('Then you can be my', 42.3, 43.46)}

      <DimCounter t={t} />
      <ContextMeter t={t} />
      <LimitBox t={t} />

      {/* hits */}
      <Flash t={t} at={32.68} dur={0.25} color="#ffffff" max={0.35} />
      <Flash t={t} at={36.29} dur={0.3} color="#ffffff" max={0.3} />
      <Flash t={t} at={43.51} dur={0.3} color="#ffffff" max={0.45} />
      <Grain t={t} opacity={0.04} />
    </AbsoluteFill>
  );
};
