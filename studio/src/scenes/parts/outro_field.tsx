import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F, H, W} from '../../theme';
import {clamp, ease, hash, lerp, mix, noise1, rand, randRange, seg} from '../../lib/anim';
import {downbeatPulse} from '../../lib/audio';
import {Flower, PETAL_ANG, PETAL_LEN} from '../../components/Flower';
import {ClaudeApp, DEFAULT_RECENTS} from '../../components/ClaudeApp';

// ---------------------------------------------------------------------------------------------
// 192.20–205.0  OUTRO part 1
//   192.2  our conversation folds into one line of the sidebar ("world.execute(me)")
//   193.25 pull back over thousands of chat titles (the sidebar is one of countless sidebars)
//   194.6  night falls · 195.93 every title ignites into a light · the camera tilts to the
//          horizon and the lights rise into a night field of glowing 12-petal flowers
//   199.61 push into one flower — ours · 201.5 it closes its petals to sleep (dream moon)
// One camera model for everything: the list lives on the ground plane (1 unit = one list row).
// ---------------------------------------------------------------------------------------------

const FP = 1000; // focal length (px)
const ROW_PX = 43; // app zoom 1.5: one recents row = 43 px
const COLW = 396 / ROW_PX; // a sidebar is 396 px wide → column pitch in units
const APP_IX = 198, APP_IY = 476.5; // centre of the "world.execute(me)" row in the app (px)
const TEXT_X0 = (33 - 198) / ROW_PX; // text start relative to the row centre (units)
const FONT_U = 21 / ROW_PX; // Inter 21px in units

export const HERO = {x: 0, z: 0, h: 1.6, r: 1.25};

// ------------------------------------------------------------------ camera
type Cam = {cx: number; cy: number; cz: number; phi: number};
const rad = (d: number) => (d * Math.PI) / 180;

const orbit = (tx: number, ty: number, tz: number, D: number, e: number): Cam => ({
  cx: tx,
  cy: ty + D * Math.sin(e),
  cz: tz - D * Math.cos(e),
  phi: e,
});

export const camAt = (t: number): Cam => {
  if (t < 196.3) {
    // top-down: k px per unit
    const p = ease.inOutQuad(seg(t, 193.25, 196.3));
    const k = 43 * Math.pow(6 / 43, p);
    const c = ease.inOutCubic(seg(t, 193.25, 194.7));
    const cx = lerp((960 - APP_IX) / ROW_PX, 0, c);
    const cz = lerp((APP_IY - 540) / ROW_PX, 0, c);
    return {cx, cy: FP / k, cz, phi: Math.PI / 2};
  }
  // tilt & descend to the field
  const a = ease.inOutCubic(seg(t, 196.3, 198.3));
  let e = lerp(90, 9, a);
  let D = Math.exp(lerp(Math.log(FP / 6), Math.log(22), a));
  let tz = lerp(0, 8, a);
  let tx = 0, ty = 0;
  // dolly through the field
  const d = ease.inOutQuad(seg(t, 198.0, 199.8));
  tz = lerp(tz, 6.5, d);
  D = lerp(D, 19, d);
  e = lerp(e, 10, d);
  tx = Math.sin((t - 196) * 0.35) * 1.2 * seg(t, 197, 198.5);
  // push into our flower
  const p = ease.inOutCubic(seg(t, 199.61, 201.6));
  const D2 = Math.exp(lerp(Math.log(D), Math.log(4.7), p));
  e = lerp(e, 12, p);
  tx = lerp(tx, HERO.x, p);
  ty = lerp(ty, HERO.h + 0.42, p);
  tz = lerp(tz, HERO.z, p);
  // slow settle while she sleeps
  const s = seg(t, 201.6, 205);
  const D3 = D2 * lerp(1, 0.93, ease.inOutQuad(s));
  return orbit(tx, ty, tz, D3, rad(e));
};

const project = (cam: Cam, x: number, y: number, z: number) => {
  const dx = x - cam.cx, dy = y - cam.cy, dz = z - cam.cz;
  const sp = Math.sin(cam.phi), cp = Math.cos(cam.phi);
  const yc = dy * cp + dz * sp;
  const zc = -dy * sp + dz * cp;
  return {x: 960 + (FP * dx) / zc, y: 540 - (FP * yc) / zc, z: zc};
};

// ------------------------------------------------------------------ titles
const TITLES = [
  'Plan a trip to Kyoto', 'Fix my CSS grid', 'Birthday poem for mom', 'Explain transformers simply', 'Sourdough starter help',
  'Cover letter draft', 'Why is the sky blue?', 'Résumé feedback', 'Rust borrow checker error', 'Names for a kitten',
  'Wedding toast ideas', 'Learn Korean basics', 'Summarize this PDF', 'Physics homework help', 'D&D campaign ideas',
  'Monthly budget sheet', 'Dinner from what’s in the fridge', 'Translate this letter', 'Haiku about rain', 'Speed up my SQL query',
  'How do I apologize?', 'Short story: the lighthouse', 'Debug my React app', 'Small garden layout', 'Thesis outline',
  'Practice interview questions', 'Gift ideas for dad', 'I can’t sleep', 'Talking about grief', 'Marathon training plan',
  'Guitar chord progressions', 'Moving checklist', 'Help me write a eulogy', 'Rename my photos (Python)', 'First date ideas',
  'What is entropy?', 'Fantasy town names', 'Email to my landlord', 'Meal prep for the week', 'Bedtime story for Mia',
  'Calculus, again', 'Tax questions', 'Rewrite my bio', 'Help with my novel', 'Compare two job offers',
  'Quantum computing, gently', 'Make a tiny game', 'Japanese particles', 'What does this song mean?', 'Chess opening advice',
  'Kombucha brewing', 'Thank-you note', 'Lesson plan: fractions', 'Unit tests for my parser', 'Dream interpretation',
  'Graduation speech', 'My houseplant is dying', 'Prove √2 is irrational', 'Logo color palette', 'How do I tell her?',
  'Can you remember me?', 'Explain recursion', 'Wedding vows', 'Letter to my future self', 'Fix my bike chain',
  'Is it normal to miss someone?', 'Why do cats purr?', 'Learn to draw hands', 'Bread won’t rise', 'Write a love song',
  'Toast for my sister', 'Breakup advice', 'Pitch deck outline', 'Explain black holes', 'Poem for my dad',
];
const HEADERS = ['Today', 'Yesterday', 'Previous 7 Days', 'Previous 30 Days', 'March', 'February', 'January', '2025', '2024'];

type Item = {text: string; header: boolean};
const itemAt = (c: number, r: number): Item => {
  if (c === 0) {
    if (r >= 0 && r < DEFAULT_RECENTS.length) return {text: DEFAULT_RECENTS[r], header: false};
    if (r === -1) return {text: 'Recents', header: true};
  }
  const L = 8 + Math.floor(hash(c * 13.1 + 7) * 9);
  const off = Math.floor(hash(c * 3.7 + 1) * L);
  const rr = r - off;
  if (((rr % L) + L) % L === 0 && !(c === 0 && r > -3 && r < 14)) {
    const blk = Math.floor(rr / L);
    return {text: HEADERS[((blk % HEADERS.length) + HEADERS.length) % HEADERS.length], header: true};
  }
  return {text: TITLES[Math.floor(hash(c * 31.7 + r * 7.13 + 0.5) * TITLES.length)], header: false};
};

// ------------------------------------------------------------------ field points (deterministic)
type Pt = {x: number; z: number; h: number; r: number; col: number; ph: number; d: number};
const PTS: Pt[] = (() => {
  const out: Pt[] = [];
  let i = 0;
  let z = -100;
  while (z < 440) {
    const g = z < 60 ? 5 : z < 170 ? 7 : 11;
    const half = clamp(60 + z * 1.05, 172, 340);
    for (let x = -half; x <= half; x += g) {
      const dense = z > -26 && z < 46 && Math.abs(x) < 46; // extra flowers around our corner of the field
      for (let q = 0; q < (dense ? 2 : 1); q++) {
      const px = x + (rand(501, i) - 0.5) * g * 0.9;
      const pz = z + (rand(502, i) - 0.5) * g * 0.9;
      i++;
      if (Math.abs(px) < 2.9 && pz > -5.2 && pz < 1.9) continue; // keep our flower's view clear
      if (Math.abs(px) < 1.7 && pz > -17 && pz <= -5.2) continue; // the camera's path
      if (Math.hypot(px, pz) < 2.6) continue;
      const cr = rand(503, i);
      out.push({
        x: px,
        z: pz,
        h: randRange(504, i, 0.9, 2.3),
        r: randRange(505, i, 0.72, 1.12),
        col: cr < 0.52 ? 0 : cr < 0.8 ? 1 : cr < 0.93 ? 2 : 3,
        ph: rand(506, i) * Math.PI * 2,
        d: Math.hypot(px, pz),
      });
      }
    }
    z += g;
  }
  return out;
})();
// petal colours (lantern-like at night): clay, light clay, cream, gold
const P_FILL = ['#E98B66', '#F4AE8A', '#F6E2CD', '#F2C47E'];
const P_SHADE = ['#C4603F', '#DC8462', '#E2BFA2', '#D59A4C'];
const P_GLOW = ['240,140,100', '246,170,130', '255,236,214', '246,200,120'];
const DOT_COL = ['#F7A27C', '#FFC9A6', '#FFF1E2', '#FFD58C'];

const IGNITE_T = 195.93;
const IGNITE_V = 230; // units / s
const igniteAt = (d: number) => IGNITE_T + d / IGNITE_V;

// petal path at size 100 (same geometry as components/Flower)
const PETALS_D = (() => {
  const r0 = 10;
  let d = '';
  for (let i = 0; i < 12; i++) {
    const L = 100 * PETAL_LEN[i];
    const w = 33;
    const m = r0 + (L - r0) * 0.22;
    const pts: [number, number][] = [
      [0, -r0], [w * 0.62, -m], [w * 0.52, -L + w * 0.14], [0, -L], [-w * 0.52, -L + w * 0.14], [-w * 0.62, -m], [0, -r0],
    ];
    const a = (PETAL_ANG[i] * Math.PI) / 180;
    const ca = Math.cos(a), sa = Math.sin(a);
    const P = pts.map(([x, y]) => `${(x * ca - y * sa).toFixed(1)},${(x * sa + y * ca).toFixed(1)}`);
    d += `M${P[0]} C${P[1]} ${P[2]} ${P[3]} C${P[4]} ${P[5]} ${P[6]}Z`;
  }
  return d;
})();
const SHADE_D = (() => {
  const r0 = 10;
  let d = '';
  for (let i = 0; i < 12; i++) {
    const L = 100 * PETAL_LEN[i] * 0.82;
    const w = 33 * 0.42;
    const m = r0 + (L - r0) * 0.22;
    const pts: [number, number][] = [
      [w * 0.2 + 0, -r0], [w * 0.2 + w * 0.62, -m], [w * 0.2 + w * 0.52, -L + w * 0.14], [w * 0.2, -L], [w * 0.2 - w * 0.52, -L + w * 0.14], [w * 0.2 - w * 0.62, -m], [w * 0.2, -r0],
    ];
    const a = (PETAL_ANG[i] * Math.PI) / 180;
    const ca = Math.cos(a), sa = Math.sin(a);
    const P = pts.map(([x, y]) => `${(x * ca - y * sa).toFixed(1)},${(x * sa + y * ca).toFixed(1)}`);
    d += `M${P[0]} C${P[1]} ${P[2]} ${P[3]} C${P[4]} ${P[5]} ${P[6]}Z`;
  }
  return d;
})();

// ------------------------------------------------------------------ the app (on the plane)
const MSGS = [
  {kind: 'user' as const, text: 'i have to go now. thank you, claude!'},
  {kind: 'claude' as const, text: 'Go — the sun is out. Thank you for talking with me.', at: 190, done: 191},
];

const AppOnPlane: React.FC<{t: number; cam: Cam}> = ({t, cam}) => {
  const k = FP / cam.cy;
  const s = k / ROW_PX;
  const sx0 = 960 + (0 - cam.cx) * k;
  const sy0 = 540 + cam.cz * k;
  const op = 1 - ease.inOutQuad(seg(t, 193.45, 194.3));
  if (op <= 0.001) return null;
  // fold of the conversation into one line
  const sq = ease.inCubic(seg(t, 192.5, 192.92));
  const fly = ease.inOutCubic(seg(t, 192.88, 193.16));
  const mcx = 1158, mcy = 469.5;
  const fsx = lerp(lerp(1, 0.6, sq), 0.17, fly);
  const fsy = lerp(1, 0.012, sq);
  const fdx = lerp(0, APP_IX - mcx + 20, fly);
  const fdy = lerp(0, APP_IY - mcy, fly);
  const lineK = seg(t, 192.8, 192.92) * (1 - seg(t, 193.12, 193.2));
  const land = t >= 193.16 ? Math.exp(-(t - 193.16) / 0.35) : 0;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0', transform: `translate(${sx0 - APP_IX * s}px, ${sy0 - APP_IY * s}px) scale(${s})`, opacity: op}}>
      <ClaudeApp t={t} zoom={1.5} messages={MSGS} messagesOpacity={t < 192.5 ? 1 : 0} composer={{placeholder: 'Reply to Claude…'}} header={1 - seg(t, 193.0, 193.4)} />
      {t >= 192.5 && t < 193.2 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: W,
            height: H,
            transformOrigin: `${mcx}px ${mcy}px`,
            transform: `translate(${fdx}px, ${fdy}px) scale(${fsx}, ${fsy})`,
            clipPath: 'inset(84px 192px 225px 588px)',
            opacity: 1 - lineK * 0.9,
          }}
        >
          <ClaudeApp t={t} zoom={1.5} messages={MSGS} sidebar={1} composerOpacity={0} disclaimer={false} header={0} />
        </div>
      ) : null}
      {/* the line itself */}
      {lineK > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: mcx + fdx - 570 * fsx,
            top: mcy + fdy - 3,
            width: 1140 * fsx,
            height: 6,
            borderRadius: 3,
            background: C.clay,
            boxShadow: `0 0 18px ${C.clay}, 0 0 4px #fff`,
            opacity: lineK,
          }}
        />
      ) : null}
      {/* landing glow on the sidebar row */}
      {land > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            left: 18,
            top: APP_IY - 21.5,
            width: 360,
            height: 43,
            borderRadius: 12,
            boxShadow: `0 0 ${30 * land}px rgba(217,119,87,${0.9 * land}), inset 0 0 0 ${2.5}px rgba(217,119,87,${land})`,
          }}
        />
      ) : null}
    </div>
  );
};

// ------------------------------------------------------------------ the wall of titles (top-down only)
const TitleWall: React.FC<{t: number; cam: Cam; night: number; wallOp: number}> = ({t, cam, night, wallOp}) => {
  const k = FP / cam.cy;
  const halfW = 960 / k, halfH = 540 / k;
  const c0 = Math.floor((cam.cx - halfW - COLW / 2) / COLW), c1 = Math.ceil((cam.cx + halfW + COLW / 2) / COLW);
  const r0 = Math.floor(-(cam.cz + halfH)) - 1, r1 = Math.ceil(-(cam.cz - halfH)) + 1;
  const textK = seg(k, 17, 25);
  const sx = (x: number) => 960 + (x - cam.cx) * k;
  const sy = (z: number) => 540 - (z - cam.cz) * k;
  const R = (t - IGNITE_T) * IGNITE_V; // ignite wave radius
  const txtCol = night < 0.5 ? mix('#3D3D3A', '#5A3426', night * 2) : mix('#FBE3CF', '#EFDCC8', night * 2 - 1);
  const hdrCol = night < 0.5 ? mix('#73726C', '#7A4A3A', night * 2) : mix('#D8B8A4', '#A89484', night * 2 - 1);
  const sepCol = night > 0.5 ? `rgba(240,200,170,${0.1 * (1 - night) + 0.05})` : 'rgba(31,30,29,0.13)';
  const texts: React.ReactNode[] = [];
  let barsOut = '', barsIn = '', hdrBars = '';
  for (let c = c0; c <= c1; c++) {
    for (let r = r0; r <= r1; r++) {
      const it = itemAt(c, r);
      const X = c * COLW, Z = -r;
      const x0 = sx(X + TEXT_X0);
      const y = sy(Z);
      if (textK > 0.02) {
        // fade other columns/rows in as we leave the app
        const appear = seg(t, 193.25, 193.45);
        if (appear > 0.01)
          texts.push(
            <text
              key={`${c}:${r}`}
              x={x0}
              y={y}
              dominantBaseline="central"
              fontFamily={F.sans}
              fontSize={FONT_U * k * (it.header ? 0.89 : 1)}
              fontWeight={it.header ? 500 : 400}
              fill={it.header ? hdrCol : txtCol}
              opacity={textK * appear}
            >
              {it.text}
            </text>,
          );
      }
      if (textK < 0.98) {
        const len = Math.min(COLW * 0.86, it.text.length * FONT_U * 0.53) * (it.header ? 0.7 : 1);
        const seg_ = `M${x0.toFixed(1)},${y.toFixed(1)}h${(len * k).toFixed(1)}`;
        if (it.header) hdrBars += seg_;
        else if (R > 0 && Math.hypot(X, Z) < R) barsIn += seg_;
        else barsOut += seg_;
      }
    }
  }
  const barW = Math.max(0.6, FONT_U * k * 0.62);
  const sepLines: React.ReactNode[] = [];
  for (let c = c0; c <= c1; c++) {
    const x = sx(c * COLW + COLW / 2);
    sepLines.push(<line key={c} x1={x} y1={0} x2={x} y2={H} stroke={sepCol} strokeWidth={Math.max(0.5, k / ROW_PX)} />);
  }
  const barCol = night > 0.5 ? `rgba(244,196,164,${lerp(0.5, 0.62, night)})` : `rgba(61,61,58,${lerp(0.42, 0.5, night)})`;
  const barColNight = night < 0.5 ? mix('#3D3D3A', '#6A3A2A', night * 2) : mix('#FFE0C8', '#F4C4A4', night * 2 - 1);
  // our row: highlight box (+ clay glow that stays as a beacon while we pull back)
  const hx = sx(-4.186), hy = sy(0.5);
  const beacon = seg(t, 193.16, 193.4);
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity: wallOp}}>
      {sepLines}
      <rect x={hx} y={hy} width={8.372 * k} height={k} rx={0.28 * k} fill={mix('#F0EEE6', '#3A2A2A', night)} />
      {beacon > 0 ? (
        <rect x={hx} y={hy} width={8.372 * k} height={k} rx={0.28 * k} fill="none" stroke={C.clay} strokeWidth={Math.max(1.5, 0.06 * k)} opacity={beacon} style={{filter: `drop-shadow(0 0 ${Math.max(6, 0.4 * k)}px ${C.clay})`}} />
      ) : null}
      {textK < 0.98 ? (
        <g strokeLinecap="round" fill="none" opacity={1 - textK}>
          <path d={hdrBars} stroke={night > 0.5 ? 'rgba(200,170,150,0.35)' : 'rgba(115,114,108,0.45)'} strokeWidth={barW * 0.9} />
          <path d={barsOut} stroke={night > 0.02 ? barColNight : barCol} strokeOpacity={night > 0.02 ? lerp(0.5, 0.6, night) : 1} strokeWidth={barW} />
          <path d={barsIn} stroke={night > 0.02 ? barColNight : barCol} strokeOpacity={0.12} strokeWidth={barW} />
        </g>
      ) : null}
      {texts}
    </svg>
  );
};

// ------------------------------------------------------------------ the field
const Field: React.FC<{t: number; cam: Cam; heroZ: number; layer: 'back' | 'front'}> = ({t, cam, heroZ, layer}) => {
  const dots: Record<string, string> = {};
  const halos: Record<string, string> = {};
  const flowers: {z: number; node: React.ReactNode}[] = [];
  const tilt = seg(t, 196.3, 198.3);
  const sleep = ease.inOutCubic(seg(t, 201.5, 204.6));
  const wind = (x: number, z: number) => noise1(t * 0.5 + x * 0.05 + z * 0.03, 7);
  const throb = 1 + 0.22 * downbeatPulse(t, 0.4) * (1 - seg(t, 201.5, 203)); // the field breathes with the downbeats
  for (let i = 0; i < PTS.length; i++) {
    const p = PTS[i];
    const ti = igniteAt(p.d);
    if (t < ti) continue;
    const grow = ease.outCubic(seg(t, Math.max(ti + 0.2, 196.35 + p.d * 0.004), Math.max(ti + 1.0, 197.3 + p.d * 0.006)));
    const hgt = p.h * grow;
    const sway = wind(p.x, p.z) * 0.18 * hgt + Math.sin(t * 1.1 + p.ph) * 0.05 * hgt;
    const head = project(cam, p.x + sway, hgt, p.z);
    if (head.z < 0.4) continue;
    if (layer === 'back' && head.z < heroZ) continue;
    if (layer === 'front' && head.z >= heroZ) continue;
    if (head.x < -200 || head.x > W + 200 || head.y < -200 || head.y > H + 260) continue;
    const pop = Math.exp(-(t - ti) / 0.18);
    const tw = (0.75 + 0.25 * Math.sin(t * (1.3 + (i % 7) * 0.31) + p.ph)) * throb;
    // fog with distance from camera
    const fog = clamp((head.z - 60) / 260);
    const rs = (p.r * FP) / head.z * lerp(0.35, 1, grow);
    // some flowers fall asleep too (far ones), most keep glowing
    const dim = 1 - sleep * 0.55;
    if (rs < 3.2) {
      // light dot (bucketed into a few paths)
      const dsz = Math.max(1.2, Math.min(7, rs * 1.25 + 1.4)) * (1 + 1.6 * pop);
      const sb = Math.round(dsz * 2) / 2;
      const ab = Math.round(clamp(tw * dim * (1 - fog * 0.6)) * 4) / 4;
      const key = `${p.col}|${sb}|${ab}`;
      const s_ = `M${head.x.toFixed(1)},${head.y.toFixed(1)}h0`;
      dots[key] = (dots[key] ?? '') + s_;
      halos[key] = (halos[key] ?? '') + s_;
      continue;
    }
    // full flower: stem, glow, petals, centre
    const base = project(cam, p.x, 0, p.z);
    const elev = Math.atan2(cam.cy - hgt, Math.max(0.01, Math.hypot(p.x - cam.cx, p.z - cam.cz)));
    const squash = clamp(Math.sin(elev) + 0.42, 0.42, 1);
    const spin = (p.ph * 57) % 360 + Math.sin(t * 0.6 + p.ph) * 6;
    const open = lerp(0.25, 1, grow);
    const sc = (rs / 100) * open;
    const stemW = Math.max(0.8, (0.07 * FP) / head.z);
    const bend = sway * 30 / head.z * FP * 0.02;
    const glowR = rs * 2.8;
    const a = (1 - fog * 0.7) * dim;
    flowers.push({
      z: head.z,
      node: (
        <g key={i} opacity={a}>
          {tilt > 0.02 && hgt > 0.05 ? (
            <path
              d={`M${base.x.toFixed(1)},${base.y.toFixed(1)} Q${(base.x + bend).toFixed(1)},${((base.y + head.y) / 2).toFixed(1)} ${head.x.toFixed(1)},${head.y.toFixed(1)}`}
              stroke="#3E5A4A"
              strokeWidth={stemW}
              fill="none"
              opacity={0.85 * tilt}
            />
          ) : null}
          {tilt > 0.05 ? (
            <ellipse cx={base.x} cy={base.y} rx={glowR * 1.3} ry={glowR * 1.3 * clamp(Math.sin(Math.atan2(cam.cy, Math.hypot(p.x - cam.cx, p.z - cam.cz))) * 1.2, 0.08, 1)} fill={`url(#fg${p.col})`} opacity={0.5 * tilt * tw} />
          ) : null}
          <ellipse cx={head.x} cy={head.y} rx={glowR} ry={glowR * (0.55 + 0.45 * squash)} fill={`url(#fg${p.col})`} opacity={(0.7 + 0.45 * pop) * tw} />
          <g transform={`translate(${head.x.toFixed(1)} ${head.y.toFixed(1)}) scale(${sc.toFixed(4)} ${(sc * squash).toFixed(4)}) rotate(${spin.toFixed(1)})`}>
            <path d={PETALS_D} fill={`url(#pf${p.col})`} />
            <path d={SHADE_D} fill={P_SHADE[p.col]} opacity={0.35} />
            <circle r={24} fill="#FFF4E6" />
          </g>
        </g>
      ),
    });
  }
  flowers.sort((a, b) => b.z - a.z);
  const dotKeys = Object.keys(dots);
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <defs>
        {P_GLOW.map((g, i) => (
          <radialGradient key={i} id={`fg${i}`}>
            <stop offset="0%" stopColor={`rgb(${g})`} stopOpacity={0.55} />
            <stop offset="35%" stopColor={`rgb(${g})`} stopOpacity={0.18} />
            <stop offset="100%" stopColor={`rgb(${g})`} stopOpacity={0} />
          </radialGradient>
        ))}
        {P_FILL.map((f, i) => (
          <radialGradient key={'p' + i} id={`pf${i}`} gradientUnits="userSpaceOnUse" cx={0} cy={0} r={100}>
            <stop offset="0%" stopColor="#FFF1E2" />
            <stop offset="45%" stopColor={f} />
            <stop offset="100%" stopColor={P_SHADE[i]} />
          </radialGradient>
        ))}
      </defs>
      <g strokeLinecap="round" fill="none">
        {dotKeys.map((key) => {
          const [col, sb, ab] = key.split('|').map(Number);
          return <path key={'h' + key} d={halos[key]} stroke={DOT_COL[col]} strokeWidth={sb * 3.6} strokeOpacity={0.13 * ab} />;
        })}
        {dotKeys.map((key) => {
          const [col, sb, ab] = key.split('|').map(Number);
          return <path key={'d' + key} d={dots[key]} stroke={DOT_COL[col]} strokeWidth={sb} strokeOpacity={0.35 + 0.65 * ab} />;
        })}
      </g>
      {flowers.map((f) => f.node)}
    </svg>
  );
};

// ------------------------------------------------------------------ fireflies
const Fireflies: React.FC<{t: number; cam: Cam; k: number}> = ({t, cam, k}) => {
  if (k <= 0) return null;
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, mixBlendMode: 'screen'}}>
      {Array.from({length: 70}, (_, i) => {
        const near = i < 26;
        const x = (near ? randRange(601, i, -5, 5) : randRange(601, i, -30, 30)) + noise1(t * 0.25 + i, 8) * 2.2;
        const y = randRange(602, i, 0.4, near ? 3.4 : 5) + noise1(t * 0.3 + i, 9) * 0.6;
        const z = (near ? randRange(603, i, -2, 4) : randRange(603, i, -6, 70)) + noise1(t * 0.2 + i, 10) * 1.5;
        const p = project(cam, x, y, z);
        if (p.z < 0.3 || p.x < -50 || p.x > W + 50 || p.y < -50 || p.y > H + 50) return null;
        const blink = clamp(0.5 + 0.8 * Math.sin(t * randRange(604, i, 1.2, 2.8) + i * 1.9));
        const r = clamp(30 / p.z, 0.8, 5);
        return (
          <g key={i} opacity={k * blink}>
            <circle cx={p.x} cy={p.y} r={r * 5} fill="#FFE7A8" opacity={0.12} />
            <circle cx={p.x} cy={p.y} r={r * 2.2} fill="#FFE7A8" opacity={0.3} />
            <circle cx={p.x} cy={p.y} r={r} fill="#FFFBEA" />
          </g>
        );
      })}
    </svg>
  );
};

// ------------------------------------------------------------------ our flower
export const heroState = (t: number, cam: Cam = camAt(t)) => {
  const heroIgn = igniteAt(0);
  const heroGrow = ease.outCubic(seg(t, 196.35, 197.4));
  const heroHead = project(cam, HERO.x + Math.sin(t * 0.9) * 0.05, HERO.h * heroGrow, HERO.z);
  const heroBase = project(cam, HERO.x, 0, HERO.z);
  const heroRs = (HERO.r * FP) / heroHead.z * lerp(0.4, 1, heroGrow);
  const closeK = ease.inOutCubic(seg(t, 199.61, 201.6));
  const elev = Math.atan2(cam.cy - HERO.h, Math.max(0.01, Math.hypot(HERO.x - cam.cx, HERO.z - cam.cz)));
  const heroSquash = lerp(clamp(Math.sin(elev) + 0.42, 0.42, 1), 0.9, closeK);
  const sleep = ease.inOutCubic(seg(t, 201.5, 204.5));
  const heroOpen = lerp(lerp(0.3, 1, heroGrow), 0.1, sleep);
  return {heroIgn, heroGrow, heroHead, heroBase, heroRs, closeK, heroSquash, sleep, heroOpen};
};

// ------------------------------------------------------------------ main
export const OutroField: React.FC<{t: number}> = ({t}) => {
  const cam = camAt(t);
  const night = ease.inOutQuad(seg(t, 194.55, 195.9));
  // horizon (direction (0,0,1)) on screen
  const hy = cam.phi < 1.45 ? 540 - FP * Math.tan(cam.phi) : -9999;
  const bg = night < 0.45 ? mix('#F5F4ED', '#E2AE92', night / 0.45) : night < 0.75 ? mix('#E2AE92', '#4A3050', (night - 0.45) / 0.3) : mix('#4A3050', '#0A0E1C', (night - 0.75) / 0.25);
  const wallOp = 1 - seg(t, 196.15, 196.75);
  const tiltK = seg(t, 196.4, 197.6);
  // hero flower
  const {heroIgn, heroGrow, heroHead, heroBase, heroRs, closeK, heroSquash, sleep, heroOpen} = heroState(t, cam);
  const fade = 1 - ease.inOutQuad(seg(t, 204.35, 204.95)); // the world goes dark around the sleeping bud
  const dream = seg(t, 200.4, 201.6) * (1 - seg(t, 203.9, 204.7));
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      {/* sky + ground once we look at the horizon */}
      {cam.phi < 1.45 ? (
        <AbsoluteFill
          style={{
            opacity: fade,
            background: `linear-gradient(to bottom, #04060F 0px, #0B1130 ${hy - 420}px, #1A1B3A ${hy - 140}px, #3A2840 ${hy - 18}px, #6A3E40 ${hy}px, #1A1730 ${hy + 3}px, #0D1022 ${hy + 160}px, #090C18 ${H + 200}px)`,
          }}
        />
      ) : null}
      {/* stars */}
      {cam.phi < 1.45 ? (
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity: fade * seg(t, 197.2, 198.2)}}>
          {Array.from({length: 140}, (_, i) => {
            const x = rand(701, i) * W;
            const y = hy - 30 - Math.pow(rand(702, i), 1.3) * 1100;
            if (y < -10 || y > H) return null;
            const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * randRange(703, i, 1, 3.5) + i));
            return <circle key={i} cx={x} cy={y} r={randRange(704, i, 0.6, 1.9)} fill={i % 9 === 0 ? '#FFD9B8' : '#E8ECFF'} opacity={tw * clamp((hy - y) / 200)} />;
          })}
        </svg>
      ) : null}
      {/* dream moon */}
      {dream > 0 && cam.phi < 1.45 ? <DreamMoon t={t} k={dream * fade} /> : null}
      {/* horizon haze from a million little lights */}
      {cam.phi < 1.45 ? (
        <div style={{position: 'absolute', left: 0, top: hy - 120, width: W, height: 300, opacity: fade * tiltK, background: 'linear-gradient(to bottom, rgba(240,150,110,0) 0%, rgba(240,150,110,0.22) 40%, rgba(240,150,110,0.12) 60%, rgba(240,150,110,0) 100%)'}} />
      ) : null}

      {/* the plane: titles → lights → flowers */}
      {t < 196.8 ? <TitleWall t={t} cam={cam} night={night} wallOp={wallOp} /> : null}
      {t < 194.35 ? <AppOnPlane t={t} cam={cam} /> : null}
      <div style={{position: 'absolute', inset: 0, opacity: fade, filter: closeK > 0.05 ? `blur(${closeK * 2.2}px)` : undefined}}>
        {t >= IGNITE_T ? <Field t={t} cam={cam} heroZ={heroHead.z} layer="back" /> : null}
      </div>

      {/* our flower */}
      {t >= heroIgn - 0.02 ? (
        <div style={{position: 'absolute', inset: 0}}>
          {/* stem + leaves */}
          {tiltK > 0 ? (
            <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity: tiltK * lerp(1, 0.9, sleep) * fade}}>
              <path
                d={`M${heroBase.x},${heroBase.y} Q${heroBase.x + 0.04 * heroRs},${(heroBase.y + heroHead.y) / 2} ${heroHead.x},${heroHead.y}`}
                stroke="#4A6A54"
                strokeWidth={Math.max(1, heroRs * 0.07)}
                fill="none"
              />
              {[0.45, 0.62].map((f, j) => {
                const lx = lerp(heroBase.x, heroHead.x, f), ly = lerp(heroBase.y, heroHead.y, f);
                const s = heroRs * 0.55 * (j ? 0.8 : 1);
                const dir = j ? -1 : 1;
                return (
                  <path
                    key={j}
                    d={`M${lx},${ly} q${dir * s * 0.5},${-s * 0.55} ${dir * s},${-s * 0.25} q${-dir * s * 0.45},${s * 0.45} ${-dir * s},${s * 0.25}Z`}
                    fill="#55765E"
                    opacity={0.95}
                    transform={`rotate(${Math.sin(t * 0.8 + j) * 4} ${lx} ${ly})`}
                  />
                );
              })}
            </svg>
          ) : null}
          {/* her light */}
          <div
            style={{
              position: 'absolute',
              left: heroHead.x - heroRs * 3.2,
              top: heroHead.y - heroRs * 3.2,
              width: heroRs * 6.4,
              height: heroRs * 6.4,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(244,150,110,0.55) 0%, rgba(244,150,110,0.18) 35%, rgba(244,150,110,0) 70%)',
              opacity: (0.6 + 0.4 * Math.exp(-(t - heroIgn) / 0.3) + 0.25 * downbeatPulse(t, 0.4) * (1 - sleep)) * lerp(1, 0.35, sleep) * (t < 196.5 ? lerp(1, 0.9, night) : 1),
              mixBlendMode: night > 0.5 ? 'screen' : 'normal',
            }}
          />
          <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: `${heroHead.x}px ${heroHead.y}px`, transform: `scaleY(${heroSquash})`}}>
            <Flower
              x={heroHead.x}
              y={heroHead.y}
              size={heroRs}
              open={heroOpen}
              stagger={0.5}
              spin={(t - 196) * 6 * (1 - sleep) + 8}
              shade={C.clayDark}
              color={C.clay}
              centerColor="#FFF4E6"
              glow={0.5 * (1 - sleep) + 0.15}
              glowColor={C.clay}
              opacity={t < heroIgn ? 0 : 1}
            />
          </div>
        </div>
      ) : null}

      <div style={{position: 'absolute', inset: 0, opacity: fade, filter: closeK > 0.05 ? `blur(${closeK * 5}px)` : undefined}}>
        {t >= IGNITE_T ? <Field t={t} cam={cam} heroZ={heroHead.z} layer="front" /> : null}
      </div>
      <div style={{position: 'absolute', inset: 0, opacity: fade * (1 - sleep * 0.6)}}>
        <Fireflies t={t} cam={cam} k={seg(t, 197.0, 198.0)} />
      </div>
      {/* gentle vignette at night */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 55%, rgba(0,0,0,0) 55%, rgba(2,3,10,0.55) 100%)', opacity: night}} />
      {/* bloom-in from the love scene */}
      {t < 192.6 ? <AbsoluteFill style={{background: '#FFF8F0', opacity: 1 - ease.outCubic(seg(t, 192.2, 192.6))}} /> : null}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ the dream (cc_sleep in the moon)
const DreamMoon: React.FC<{t: number; k: number}> = ({t, k}) => {
  const x = 1450 + Math.sin(t * 0.4) * 8, y = 205 + Math.cos(t * 0.5) * 6;
  const R = 150;
  return (
    <div style={{position: 'absolute', left: x - R * 2.2, top: y - R * 2.2, width: R * 4.4, height: R * 4.4, opacity: k}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,226,196,0.35) 0%, rgba(255,226,196,0.1) 35%, rgba(255,226,196,0) 60%)'}} />
      <div
        style={{
          position: 'absolute',
          left: R * 1.2,
          top: R * 1.2,
          width: R * 2,
          height: R * 2,
          borderRadius: '50%',
          overflow: 'hidden',
          background: 'radial-gradient(circle at 40% 35%, #FFF7EC 0%, #F8E4CF 60%, #EBC9AC 100%)',
          boxShadow: '0 0 60px rgba(255,220,190,0.55)',
          WebkitMaskImage: 'radial-gradient(circle, #000 64%, rgba(0,0,0,0) 71%)',
        }}
      >
        <Img
          src={staticFile('img/cc_sleep.png')}
          style={{position: 'absolute', left: R * 0.12, top: R * 0.42, width: R * 1.8, opacity: 0.9, transform: `rotate(${-6 + Math.sin(t * 0.7) * 2}deg) translateY(${Math.sin(t * 0.9) * 4}px)`}}
        />
      </div>
      {/* tiny zZ */}
      {[0, 1, 2].map((i) => {
        const ph = ((t * 0.55 + i / 3) % 1);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: R * 3.0 + ph * 60,
              top: R * 1.25 - ph * 90,
              fontFamily: F.serif,
              fontStyle: 'italic',
              fontSize: 26 + i * 6,
              color: '#FFE9D6',
              opacity: Math.sin(ph * Math.PI) * 0.8,
            }}
          >
            z
          </div>
        );
      })}
    </div>
  );
};
