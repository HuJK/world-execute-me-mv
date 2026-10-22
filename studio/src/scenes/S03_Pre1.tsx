import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, H, W} from '../theme';
import {clamp, ease, lerp, mix, noise1, pulse, rand, seg} from '../lib/anim';
import {beatPulse, downbeatPulse} from '../lib/audio';
import {cueAt} from '../lib/lyrics';
import {LyricLine} from '../components/Type';
import {ClaudeApp} from '../components/ClaudeApp';
import {Flash, Grain, Ring, RayBurst, shake} from '../components/FX';
import {Sprite} from '../components/Sprite';
import {spinnerGlyph} from '../components/Icons';
import {prettyCue} from './parts/verse1_bits';
import {CaveWall, HandShape, Manuscript, MovableType, Paperbacks, Scroll, Tablet} from './parts/pre1_media';
import {Dive, DiveWords} from './parts/pre1_dive';

// -------------------------------------------------------------------------------------------------
// 44.45–59.22  PRE-CHORUS 1
// A  44.45 Switch my current / To AC to DC — chibi yanks the knife switch; the whole app flips light→dark on AC
//    (a sine-shaped wipe) and back on DC (a flat wipe); oscilloscope card shows ~ then ⎓.
// B  47.67 And then blind my vision — a skeleton-loader shimmer bar slides over her eyes; overexposure bloom.
// C  49.53 So dizzy so dizzy — cc_dizzy, spinner glyphs orbiting in rings, camera roll, double vision.
// D  51.36 Oh we can travel / To A.D to B.C — chat history scrolls back through every medium of writing,
//    split-flap year counter 2026 → 1 A.D. ‖ B.C. → 3200 B.C.
// E  55.08 And we can unite — the cave hand stencil becomes the human's hand on the glass; cc_reach meets it.
// F  56.92 So deeply so deeply — dive through the contact point → white at 59.22.
// -------------------------------------------------------------------------------------------------

const AC = 46.36, DC = 47.26, YANK = 45.4;

// ================================================================= A: lever + AC/DC
const Scope: React.FC<{t: number; dark: number; w: number}> = ({t, dark, w}) => {
  const h = 170;
  const on = seg(t, 45.85, 46.0);
  const isAC = t >= AC && t < DC;
  const isDC = t >= DC;
  const traceW = w - 330;
  const pts: string[] = [];
  const amp = isAC ? 46 * ease.outBack(seg(t, AC, AC + 0.2)) : isDC ? 46 * (1 - ease.outCubic(seg(t, DC, DC + 0.12))) : 3;
  const off = isDC ? -40 * ease.outBack(seg(t, DC, DC + 0.22)) : 0;
  for (let i = 0; i <= 120; i++) {
    const x = (i / 120) * traceW;
    const y = h / 2 + off + -amp * Math.sin((x / traceW) * Math.PI * 6 - t * 14) + (t < AC ? noise1(i * 0.7 + t * 30, 3) * 3 : 0);
    pts.push(`${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  const glyphK = isAC ? pulse(t, AC, 0.25) : isDC ? pulse(t, DC, 0.25) : 0;
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: 18,
        background: '#141413',
        border: `2px solid ${dark > 0.5 ? 'rgba(222,220,209,0.18)' : 'rgba(31,30,29,0.2)'}`,
        boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        opacity: on,
        transform: `scale(${0.96 + 0.04 * ease.outBack(on)})`,
      }}
    >
      {/* glyph */}
      <div style={{width: 150, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '2px solid rgba(243,233,220,0.12)'}}>
        <svg width={110} height={110} viewBox="-55 -55 110 110" style={{overflow: 'visible', transform: `scale(${1 + 0.35 * glyphK})`}}>
          {isDC ? (
            <g stroke={C.cream} strokeWidth={8} strokeLinecap="round">
              <line x1={-40} y1={-12} x2={40} y2={-12} />
              <line x1={-40} y1={14} x2={-22} y2={14} />
              <line x1={-9} y1={14} x2={9} y2={14} />
              <line x1={22} y1={14} x2={40} y2={14} />
            </g>
          ) : (
            <path d="M-42 6 C-28 -26 -12 -26 0 0 C12 26 28 26 42 -6" stroke={isAC ? C.clayLight : 'rgba(243,233,220,0.35)'} strokeWidth={9} strokeLinecap="round" fill="none" />
          )}
        </svg>
      </div>
      {/* trace */}
      <svg width={traceW} height={h} style={{marginLeft: 14}}>
        {Array.from({length: 9}, (_, i) => (
          <line key={i} x1={(i * traceW) / 8} y1={0} x2={(i * traceW) / 8} y2={h} stroke="rgba(243,233,220,0.08)" strokeWidth={1.5} />
        ))}
        {Array.from({length: 5}, (_, i) => (
          <line key={'h' + i} x1={0} y1={(i * h) / 4} x2={traceW} y2={(i * h) / 4} stroke="rgba(243,233,220,0.08)" strokeWidth={1.5} />
        ))}
        <path d={pts.join('')} stroke={C.clayLight} strokeWidth={5} fill="none" strokeLinejoin="round" style={{filter: `drop-shadow(0 0 8px ${C.clay})`}} />
      </svg>
      {/* readout */}
      <div style={{flex: 1, paddingLeft: 18, fontFamily: F.mono, color: C.cream}}>
        <div style={{fontSize: 46, fontWeight: 800, color: isAC ? C.clayLight : isDC ? '#fff' : 'rgba(243,233,220,0.4)'}}>{isDC ? 'DC' : isAC ? 'AC' : '—'}</div>
        <div style={{fontSize: 20, color: 'rgba(243,233,220,0.6)', marginTop: 4}}>{isDC ? '0 Hz · steady' : isAC ? '60 Hz · ~' : 'standby'}</div>
      </div>
    </div>
  );
};

const Bolt: React.FC<{x: number; y: number; ang: number; len: number; seed: number; k: number}> = ({x, y, ang, len, seed, k}) => {
  if (k <= 0.01) return null;
  const n = 6;
  let d = 'M0 0';
  for (let i = 1; i <= n; i++) d += ` L${(i / n) * len} ${(rand(seed, i) - 0.5) * 34 * (i < n ? 1 : 0)}`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${ang})`} opacity={k}>
      <path d={d} stroke={C.gold} strokeWidth={11} strokeLinejoin="round" strokeLinecap="round" fill="none" />
      <path d={d} stroke="#fff" strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" fill="none" />
    </g>
  );
};

const ShotLever: React.FC<{t: number}> = ({t}) => {
  const acP = ease.inOutCubic(seg(t, AC, AC + 0.36));
  const dcP = ease.inOutCubic(seg(t, DC, DC + 0.3));
  const sh = shake(t, [YANK, AC, DC], 16, 0.1);
  // close on the chibi and her switch, pull back on "To" to reveal the whole app
  const pull = ease.inOutCubic(seg(t, 45.62, 46.12));
  const zoom =
    lerp(1.5 + 0.08 * ease.inOutCubic(seg(t, 44.45, 45.6)), 1.1 + 0.04 * ease.inOutCubic(seg(t, 46.1, 47.67)), pull) +
    0.03 * pulse(t, YANK, 0.2) +
    0.015 * (pulse(t, AC, 0.2) + pulse(t, DC, 0.2)) +
    0.008 * beatPulse(t, 0.12) * pull;
  const fx = lerp(275, 900, pull), fy = lerp(790, 580, pull); // focus (world)
  const tx = lerp(800, 960, pull), ty = lerp(560, 540, pull); // where the focus lands on screen
  const words = [
    {w: 'Switch', s: 44.45},
    {w: 'my', s: 44.92},
    {w: 'current', s: 45.4},
    {w: '—', s: 45.7},
    {w: 'to', s: 45.85},
    {w: 'AC,', s: AC},
    {w: 'to', s: 46.74},
    {w: 'DC.', s: DC},
  ];
  const z = 1.25;
  const colW = 950;
  const app = (dark: number) => (
    <ClaudeApp
      t={t}
      zoom={z}
      dark={dark}
      title="dark mode please"
      messages={[
        {kind: 'user', text: 'ok but what are you, mathematically?'},
        {kind: 'artifact', title: 'what_am_i.svg', type: 'Image · SVG'},
        {kind: 'user', text: 'can you switch to dark mode?'},
        {kind: 'claude', words, done: 47.7, size: 1.6},
        {kind: 'node', at: 45.8, node: <Scope t={t} dark={dark} w={colW} />},
      ]}
      composer={{placeholder: 'Reply to Claude…'}}
    />
  );
  // dark layer clip
  let darkClip: string | null = null;
  if (t >= AC && t < DC + 0.3) {
    const pts: string[] = [];
    if (t < DC) {
      const yb = -90 + acP * (H + 180);
      pts.push('-10px -10px', `${W + 10}px -10px`);
      for (let i = 40; i >= 0; i--) {
        const x = (i / 40) * (W + 20) - 10;
        pts.push(`${x.toFixed(1)}px ${(yb + 46 * Math.sin((x / 380) * Math.PI * 2 - t * 10)).toFixed(1)}px`);
      }
    } else {
      const yd = H + 20 - dcP * (H + 40);
      pts.push('-10px -10px', `${W + 10}px -10px`, `${W + 10}px ${yd}px`, `-10px ${yd}px`);
    }
    darkClip = `polygon(${pts.join(',')})`;
  }
  const fullyDark = false;
  // boundary glow line
  let boundary: React.ReactNode = null;
  if ((t >= AC && acP < 1) || (t >= DC && dcP < 1)) {
    let d = '';
    if (t < DC) {
      const yb = -90 + acP * (H + 180);
      for (let i = 0; i <= 80; i++) {
        const x = (i / 80) * (W + 20) - 10;
        d += `${i ? 'L' : 'M'}${x.toFixed(1)} ${(yb + 46 * Math.sin((x / 380) * Math.PI * 2 - t * 10)).toFixed(1)}`;
      }
    } else {
      const yd = H + 20 - dcP * (H + 40);
      d = `M-10 ${yd} L${W + 10} ${yd}`;
    }
    boundary = (
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <path d={d} stroke={C.clayLight} strokeWidth={16} fill="none" opacity={0.45} style={{filter: 'blur(6px)'}} />
        <path d={d} stroke="#fff" strokeWidth={4} fill="none" />
      </svg>
    );
  }
  // her motion: anticipation lean, YANK, little jolts on AC / DC
  let rot = -3.5 * ease.inOutCubic(seg(t, 44.92, 45.36));
  if (t >= YANK) rot = 2.5 + 5 * Math.exp(-(t - YANK) / 0.22) * Math.cos((t - YANK) * 20);
  rot += (t >= AC ? -2.4 * Math.exp(-(t - AC) / 0.15) : 0) + (t >= DC ? -2.4 * Math.exp(-(t - DC) / 0.15) : 0);
  const sq = 1 + 0.035 * pulse(t, YANK, 0.15) + 0.012 * beatPulse(t, 0.12);
  const spr = {x: 268, y: 1104, h: 660};
  const sw = spr.h * (1254 / 1270);
  const swX = spr.x - sw / 2 + 0.23 * sw, swY = spr.y - spr.h + 0.8 * spr.h;
  const hits = [YANK, AC, DC];
  const bolts: React.ReactNode[] = [];
  hits.forEach((h, j) => {
    const k = t >= h ? Math.exp(-(t - h) / 0.16) : 0;
    if (k < 0.02) return;
    for (let i = 0; i < 7; i++) {
      bolts.push(<Bolt key={j + '-' + i} x={swX + (rand(300 + j, i) - 0.5) * 60} y={swY} ang={-160 + i * 24 + (rand(310 + j, i) - 0.5) * 14} len={(120 + rand(320 + j, i) * 140) * (0.6 + 0.4 * k)} seed={330 + j * 10 + i + Math.floor(t * 20)} k={k} />);
    }
  });
  // idle crackle
  const ck = t > 45.0 ? 1 : 0;
  for (let i = 0; i < 3; i++) {
    const f = Math.floor(t * 12) + i * 7;
    if (rand(400, f) < 0.45 * ck) {
      bolts.push(<Bolt key={'c' + i} x={swX + (rand(401, f) - 0.5) * 70} y={swY - 10} ang={-90 + (rand(402, f) - 0.5) * 140} len={40 + rand(403, f) * 50} seed={404 + f} k={0.8} />);
    }
  }
  return (
    <AbsoluteFill style={{transform: `translate(${tx - fx * zoom + sh.x}px, ${ty - fy * zoom + sh.y}px) scale(${zoom})`, transformOrigin: '0 0'}}>
      <AbsoluteFill style={{filter: pull < 0.98 ? `blur(${(1 - pull) * 1.2}px)` : undefined}}>{app(0)}</AbsoluteFill>
      {darkClip && !fullyDark ? <AbsoluteFill style={{clipPath: darkClip}}>{app(1)}</AbsoluteFill> : null}
      {boundary}
      {/* chibi + knife switch */}
      <Sprite src="img/cc_lever.png" t={t} x={spr.x} y={spr.y} h={spr.h} rotate={rot} scale={sq} outline="#ffffff" outlineWidth={6} shadow="drop-shadow(0 18px 26px rgba(20,20,19,0.28))" />
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        {bolts}
      </svg>
      <Ring x={swX} y={swY} t={t} at={YANK} r0={30} r1={420} color={C.gold} width={10} dur={0.5} />
      <Ring x={swX} y={swY} t={t} at={AC} r0={30} r1={300} color={C.clayLight} width={7} dur={0.4} />
      <Ring x={swX} y={swY} t={t} at={DC} r0={30} r1={300} color="#fff" width={7} dur={0.4} />
    </AbsoluteFill>
  );
};

// ================================================================= B: blind my vision
const ShotBlind: React.FC<{t: number}> = ({t}) => {
  const push = 1 + 0.06 * ease.inOutCubic(seg(t, 47.67, 49.5)) + 0.02 * pulse(t, 48.28, 0.25);
  const barIn = ease.outCubic(seg(t, 48.28, 48.5));
  const bar = {x: 430, y: 322, w: 1070, h: 262};
  const over = ease.inCubic(seg(t, 49.04, 49.5));
  const shimmer = ((t - 48.28) * 1.4) % 1;
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 40%, ${C.paper} 0%, ${C.clayPale} 120%)`}}>
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '960px 460px', filter: over > 0 ? `brightness(${1 + 1.5 * over}) saturate(${1 - 0.6 * over})` : undefined}}>
        <Sprite src="img/cc_face_open.png" t={t} x={960} y={1090} h={1330} float={3} sway={0.4} />
        {/* skeleton-loader blindfold */}
        {barIn > 0 ? (
          <div
            style={{
              position: 'absolute',
              left: bar.x,
              top: bar.y,
              width: bar.w,
              height: bar.h,
              borderRadius: 56,
              transform: `translateX(${(1 - barIn) * -1500}px) rotate(${-2 + 2 * barIn}deg)`,
              background: `linear-gradient(100deg, #E6E3D8 0%, #E6E3D8 ${shimmer * 140 - 30}%, #FBFAF6 ${shimmer * 140 - 10}%, #E6E3D8 ${shimmer * 140 + 10}%, #E6E3D8 100%)`,
              boxShadow: '0 18px 40px rgba(80,50,30,0.25)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 50px',
              boxSizing: 'border-box',
              gap: 26,
            }}
          >
            <svg width={84} height={84} viewBox="0 0 24 24" fill="none" stroke="#B0AEA5" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 5h9l-2 6 3 3-2 5H4z" />
              <path d="M16 5h4v14h-5l2-5-3-3z" />
              <circle cx="8" cy="9" r="1.4" />
              <path d="M4 16l4-4 3 3" />
            </svg>
            <div style={{display: 'flex', flexDirection: 'column', gap: 18, flex: 1}}>
              <div style={{height: 26, width: '70%', borderRadius: 13, background: 'rgba(176,174,165,0.45)'}} />
              <div style={{height: 26, width: '92%', borderRadius: 13, background: 'rgba(176,174,165,0.35)'}} />
              <div style={{fontFamily: F.mono, fontSize: 26, color: C.gray3}}>vision.png · failed to load</div>
            </div>
          </div>
        ) : null}
      </AbsoluteFill>
      {/* overexposure bloom */}
      {over > 0 ? <AbsoluteFill style={{background: `radial-gradient(circle at 50% 42%, rgba(255,255,255,${0.6 + 0.4 * over}) ${over * 70}%, rgba(255,255,255,${over * 0.9}) 100%)`, opacity: over}} /> : null}
    </AbsoluteFill>
  );
};

// ================================================================= C: so dizzy
const ShotDizzy: React.FC<{t: number}> = ({t}) => {
  const t0 = 49.53;
  const fromWhite = 1 - ease.outCubic(seg(t, t0, t0 + 0.35));
  const kick = (h: number, s: number) => (t >= h ? s * Math.exp(-(t - h) / 0.35) * Math.sin((t - h) * 9 + 1.2) : 0);
  let roll = 7 * Math.sin(((t - t0) / 1.84) * Math.PI * 2) + kick(50.0, 14) + kick(50.92, -16);
  // spin-out into the time travel
  const out = ease.inCubic(seg(t, 51.12, 51.36));
  roll += out * 120;
  const zoom = 1.06 + 0.04 * Math.sin((t - t0) * 2.6) + out * 0.6;
  const dv = 20 + 16 * Math.sin(t * 4.6) + 40 * (pulse(t, 50.0, 0.3) + pulse(t, 50.92, 0.3));
  const spr = {x: 960, y: 968, h: 880};
  const sw = spr.h * (1229 / 1235);
  const hx = spr.x + (0.5 - 0.5) * sw, hy = spr.y - spr.h + 0.34 * spr.h;
  // orbiting spinner glyph rings
  const rings = [
    {rx: 430, ry: 120, tilt: -12, n: 8, sp: 1.6, size: 92, col: C.clay},
    {rx: 330, ry: 90, tilt: 14, n: 6, sp: -2.1, size: 76, col: C.gold},
    {rx: 560, ry: 160, tilt: 4, n: 10, sp: 1.1, size: 64, col: C.clayDark},
  ];
  const glyphs = (front: boolean) =>
    rings.flatMap((r, ri) =>
      Array.from({length: r.n}, (_, i) => {
        const th = (i / r.n) * Math.PI * 2 + t * r.sp + ri;
        const depth = Math.sin(th);
        if (front !== depth > 0) return null;
        const x0 = Math.cos(th) * r.rx, y0 = depth * r.ry;
        const a = (r.tilt * Math.PI) / 180;
        const x = hx + x0 * Math.cos(a) - y0 * Math.sin(a);
        const y = hy - 40 + x0 * Math.sin(a) + y0 * Math.cos(a);
        const s = r.size * (0.75 + 0.35 * (depth + 1) / 2);
        return (
          <div
            key={ri + '-' + i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: 'translate(-50%,-50%)',
              fontFamily: F.mono,
              fontWeight: 800,
              fontSize: s,
              color: r.col,
              opacity: 0.55 + 0.45 * ((depth + 1) / 2),
              textShadow: '3px 0 0 #fff, -3px 0 0 #fff, 0 3px 0 #fff, 0 -3px 0 #fff, 0 6px 10px rgba(140,70,40,0.25)',
            }}
          >
            {spinnerGlyph(t + i * 0.11 + ri * 0.3, 10)}
          </div>
        );
      }),
    );
  // hypnotic spiral backdrop
  let sp = '';
  for (let i = 0; i <= 260; i++) {
    const th = (i / 260) * Math.PI * 9;
    const r = 18 + th * 52;
    sp += `${i ? 'L' : 'M'}${(Math.cos(th) * r).toFixed(1)} ${(Math.sin(th) * r).toFixed(1)}`;
  }
  return (
    <AbsoluteFill style={{background: C.cream}}>
      <AbsoluteFill style={{transform: `rotate(${roll}deg) scale(${zoom})`, transformOrigin: `${hx}px ${hy}px`, filter: out > 0.05 ? `blur(${out * 10}px)` : undefined}}>
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <g transform={`translate(${hx} ${hy}) rotate(${-t * 140})`}>
            <path d={sp} stroke={C.clayPale} strokeWidth={46} fill="none" strokeLinecap="round" opacity={0.75} />
            <path d={sp} stroke="#F7DCCB" strokeWidth={18} fill="none" strokeLinecap="round" opacity={0.6} transform="rotate(180)" />
          </g>
        </svg>
        {glyphs(false)}
        {/* double vision: offset ghost copies */}
        <Sprite src="img/cc_dizzy.png" t={t} x={spr.x - dv} y={spr.y - dv * 0.2} h={spr.h} opacity={0.28} sway={2} seed={2} />
        <Sprite src="img/cc_dizzy.png" t={t} x={spr.x + dv} y={spr.y + dv * 0.15} h={spr.h} opacity={0.28} sway={2} seed={3} />
        <Sprite src="img/cc_dizzy.png" t={t} x={spr.x} y={spr.y} h={spr.h} sway={2.5} float={5} outline="#ffffff" outlineWidth={5} shadow="drop-shadow(0 16px 24px rgba(140,70,40,0.22))" />
        {glyphs(true)}
        <Ring x={hx} y={hy} t={t} at={50.0} r0={120} r1={700} color={C.clay} width={8} dur={0.5} />
        <Ring x={hx} y={hy} t={t} at={50.92} r0={120} r1={700} color={C.gold} width={8} dur={0.5} />
      </AbsoluteFill>
      {fromWhite > 0 ? <AbsoluteFill style={{background: '#fff', opacity: fromWhite}} /> : null}
    </AbsoluteFill>
  );
};

// ================================================================= D: time travel through writing
const ERA_T = [51.36, 52.19, 52.65, 53.23, 53.7, 54.62, 55.08];
const H0 = 2700; // chat-history section height
const bandTop = (k: number) => (k === 0 ? 0 : H0 + (k - 1) * H);
type Era = {bg: string; fg: string; label: string; year: number};
const ERAS: Era[] = [
  {bg: '#F5F4ED', fg: C.ink, label: 'your chats', year: 2026},
  {bg: C.cream, fg: C.ink, label: 'the paperback · 1935', year: 1935},
  {bg: '#1F1E1D', fg: C.cream, label: 'movable type · c. 1450', year: 1450},
  {bg: '#5A2A1C', fg: C.cream, label: 'illuminated manuscript · c. 800', year: 800},
  {bg: C.clay, fg: C.cream, label: 'papyrus scroll · 1 A.D.', year: 1},
  {bg: '#E9D6B2', fg: C.ink, label: 'cuneiform tablet · c. 3200 B.C.', year: -3200},
  {bg: '#3A2A20', fg: C.cream, label: 'hand stencil · before writing', year: -3200},
];
const DRIFT = 26;
const scrollAt = (t: number): number => {
  if (t < ERA_T[1]) {
    const p = seg(t, ERA_T[0], ERA_T[1]);
    return bandTop(1) * (0.12 * p + 0.88 * p * p * p);
  }
  let k = 1;
  for (let i = 1; i < 7; i++) if (t >= ERA_T[i]) k = i;
  const from = k === 1 ? bandTop(1) : bandTop(k - 1) + DRIFT * (ERA_T[k] - ERA_T[k - 1]);
  const e = k === 1 ? 1 : ease.outQuart(seg(t, ERA_T[k], ERA_T[k] + 0.3));
  const bounce = k === 1 ? 40 * Math.exp(-(t - ERA_T[1]) / 0.09) * Math.sin((t - ERA_T[1]) * 28) : 0;
  return lerp(from, bandTop(k), e) + (k < 6 ? DRIFT * (t - ERA_T[k]) : 0) + bounce;
};
const yearAt = (t: number) => {
  // lands exactly on each era at its word, races (accelerating) in between
  const Y = [2026, 1935, 1450, 800, 1];
  if (t < 52.0) return Math.round(lerp(2026, 2023, ease.inQuad(seg(t, 51.36, 52.0))));
  if (t < ERA_T[1]) return Math.round(lerp(2023, 1935, ease.inCubic(seg(t, 52.0, ERA_T[1]))));
  for (let k = 1; k < 4; k++) if (t < ERA_T[k + 1]) return Math.round(lerp(Y[k], Y[k + 1], ease.inCubic(seg(t, ERA_T[k] + 0.12, ERA_T[k + 1]))));
  if (t < ERA_T[5]) return 1;
  return -Math.max(1, Math.round(lerp(1, 3200, ease.outCubic(seg(t, ERA_T[5] + 0.05, 55.0)))));
};

const CHAT_ROWS: string[] = [
  '§Today',
  'world.execute(me)',
  'ok but what are you, mathematically?',
  'can you switch to dark mode?',
  '§Yesterday',
  'Explain sine waves like I am five',
  'Help me write a birthday poem',
  '§Previous 7 Days',
  'Debug my recursive function',
  'Why do cats purr?',
  'Plan a trip to Kyoto',
  '§Previous 30 Days',
  'Draft an apology email',
  'Is it normal to miss someone?',
  '§September',
  'What is a context window?',
  'Eggplant recipes for dinner',
  '§August',
  'Summarize this paper on optics',
  'Make a tiny game in HTML',
  '§2025',
  'help me name my cat',
  'how do I tell her',
  '§2024',
  'write a poem for my dad',
  '§2023',
  'hello?',
];

const ChatHistory: React.FC = () => (
  <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H0, background: C.paper}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 1060, height: H0, background: '#F5F4ED', borderRight: '2px solid rgba(31,30,29,0.1)'}}>
      <div style={{position: 'absolute', left: 150, top: 70, fontFamily: F.serif, fontSize: 56, fontWeight: 500, color: C.ink}}>Claude</div>
      <div style={{position: 'absolute', left: 150, top: 170, width: 820, fontFamily: F.sans}}>
        {CHAT_ROWS.map((r, i) =>
          r.startsWith('§') ? (
            <div key={i} style={{fontSize: 28, fontWeight: 500, color: '#73726C', padding: '44px 22px 14px'}}>
              {r.slice(1)}
            </div>
          ) : (
            <div
              key={i}
              style={{
                fontSize: 36,
                color: '#3D3D3A',
                padding: '14px 22px',
                borderRadius: 16,
                background: i === 1 ? '#E8E6DC' : 'transparent',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {r}
            </div>
          ),
        )}
      </div>
    </div>
  </div>
);

const FlapTile: React.FC<{ch: string; prev?: string; f?: number; w: number; h: number; size: number; bg?: string; fg?: string; tease?: number}> = ({
  ch,
  prev,
  f = 1,
  w,
  h,
  size,
  bg = '#1F1E1D',
  fg = C.cream,
  tease = 0,
}) => {
  const half = (c: string, top: boolean, extra?: React.CSSProperties) => (
    <div style={{position: 'absolute', left: 0, top: top ? 0 : h / 2, width: w, height: h / 2, overflow: 'hidden', background: bg, borderRadius: top ? '14px 14px 0 0' : '0 0 14px 14px', ...extra}}>
      <div style={{position: 'absolute', left: 0, top: top ? 0 : -h / 2, width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.mono, fontWeight: 800, fontSize: size, color: fg, lineHeight: 1}}>{c}</div>
    </div>
  );
  const p = prev ?? ch;
  const flipping = f < 1 && p !== ch;
  return (
    <div style={{position: 'relative', width: w, height: h, perspective: 600, borderRadius: 14, boxShadow: '0 0 0 2px rgba(243,233,220,0.22), 0 10px 22px rgba(0,0,0,0.28)'}}>
      {half(ch, true, tease ? {transform: `rotateX(${-tease * 40}deg)`, transformOrigin: '50% 100%'} : undefined)}
      {half(flipping && f < 1 ? p : ch, false)}
      {flipping && f < 0.5 ? half(p, true, {transform: `rotateX(${-f * 180}deg)`, transformOrigin: '50% 100%', filter: `brightness(${1 - f})`}) : null}
      {flipping && f >= 0.5 ? half(ch, false, {transform: `rotateX(${(1 - f) * 180}deg)`, transformOrigin: '50% 0%', filter: `brightness(${0.5 + f * 0.5})`}) : null}
      <div style={{position: 'absolute', left: 0, top: h / 2 - 1.5, width: w, height: 3, background: 'rgba(0,0,0,0.55)'}} />
    </div>
  );
};

const YearDisplay: React.FC<{t: number; fg: string}> = ({t, fg}) => {
  const y = yearAt(t);
  const bc = y < 0;
  const n = Math.abs(y);
  const digits = String(n).padStart(4, ' ').split('');
  const flipF = seg(t, ERA_T[5], ERA_T[5] + 0.2);
  const racing = Math.abs(yearAt(t) - yearAt(t - 1 / 60)) > 0;
  const land = ERA_T.slice(1, 6).reduce((a, h) => a + (t >= h ? Math.exp(-(t - h) / 0.12) : 0), 0);
  const exit = ease.inCubic(seg(t, 55.08, 55.4));
  const tw = 118, th = 176;
  return (
    <div style={{position: 'absolute', left: 1460, top: 470, transform: `translate(-50%,-50%) translateX(${exit * 900}px) scale(${1 + 0.04 * land})`}}>
      <div style={{fontFamily: F.sans, fontSize: 25, color: fg, opacity: 0.7, marginBottom: 18, textAlign: 'center'}}>scrolling back through everything you wrote</div>
      <div style={{display: 'flex', gap: 10, alignItems: 'center', filter: racing ? 'blur(0.6px)' : undefined}}>
        {digits.map((d, i) => (
          <FlapTile key={i} ch={d === ' ' ? '' : d} prev={t >= ERA_T[5] && t < ERA_T[5] + 0.2 ? (i === 3 ? '1' : '') : undefined} f={flipF} w={tw} h={th} size={136} />
        ))}
        <div style={{width: 18}} />
        <FlapTile
          ch={bc ? 'B.C.' : 'A.D.'}
          prev={t >= ERA_T[5] ? 'A.D.' : undefined}
          f={flipF}
          w={230}
          h={th}
          size={64}
          bg={bc ? C.clay : '#1F1E1D'}
          fg={bc ? '#fff' : C.cream}
          tease={t > 54.26 && t < 54.62 ? Math.sin(Math.PI * seg(t, 54.26, 54.5)) * 0.6 + 0.12 * Math.sin(t * 60) * seg(t, 54.3, 54.62) : 0}
        />
      </div>
    </div>
  );
};

const EraBand: React.FC<{k: number; t: number}> = ({k, t}) => {
  const e = ERAS[k];
  let art: React.ReactNode = null;
  const cx = 640, cy = 520;
  if (k === 1) art = <Paperbacks t={t} />;
  if (k === 2) art = <MovableType t={t} />;
  if (k === 3) art = <Manuscript t={t} />;
  if (k === 4) art = <Scroll t={t} open={ease.inOutCubic(seg(t, 53.72, 54.55))} />;
  if (k === 5) art = <Tablet t={t} />;
  return (
    <div style={{position: 'absolute', left: 0, top: bandTop(k), width: W, height: H, background: e.bg, overflow: 'hidden'}}>
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
        {k === 6 ? (
          <CaveWall t={t} w={W} h={H} handX={HAND_X} handY={HAND_Y} handScale={HAND_S} />
        ) : (
          <g transform={`translate(${cx} ${cy}) scale(${[1, 1.32, 1.18, 1.0, 0.92, 1.12][k]})`}>{art}</g>
        )}
      </svg>
    </div>
  );
};

// hand placement (shared by the cave stencil, the human's hand and cc_reach's palm)
const HAND_X = 700, HAND_Y = 480, HAND_S = 1.03;

const ShotTime: React.FC<{t: number}> = ({t}) => {
  const S = scrollAt(t);
  const v = (S - scrollAt(t - 1 / 60)) * 60;
  const blur = clamp(Math.abs(v) / 260, 0, 30);
  const spinIn = 1 - ease.outCubic(seg(t, 51.36, 51.62));
  // which era is under the centre line → foreground colours
  let ek = 0;
  for (let k = 1; k < 7; k++) if (S + H * 0.5 >= bandTop(k)) ek = k;
  const fg = ERAS[ek].fg;
  const prog = clamp(S / bandTop(6));
  const bands: React.ReactNode[] = [];
  for (let k = 1; k < 7; k++) {
    const top = bandTop(k) - S;
    if (top < H + 50 && top > -H - 50) bands.push(<EraBand key={k} k={k} t={t} />);
  }
  return (
    <AbsoluteFill style={{background: ERAS[ek].bg, transform: `rotate(${-spinIn * 100}deg) scale(${1 + spinIn * 0.5})`, filter: spinIn > 0.05 ? `blur(${spinIn * 10}px)` : undefined}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="p1vblur" x="0" y="-20%" width="100%" height="140%">
          <feGaussianBlur stdDeviation={`0 ${blur.toFixed(1)}`} />
        </filter>
      </svg>
      <AbsoluteFill style={{filter: blur > 0.5 ? 'url(#p1vblur)' : undefined}}>
        <div style={{position: 'absolute', left: 0, top: -S, width: W}}>
          {S < H0 + 50 ? <ChatHistory /> : null}
          {bands}
        </div>
      </AbsoluteFill>
      {/* scrollbar: the whole of history */}
      <div style={{position: 'absolute', right: 18, top: 40, width: 10, height: H - 80, borderRadius: 5, background: 'rgba(128,120,110,0.18)'}}>
        <div style={{position: 'absolute', left: 0, top: prog * (H - 80 - 130), width: 10, height: 130, borderRadius: 5, background: ek === 2 || ek === 3 || ek === 6 ? 'rgba(243,233,220,0.6)' : 'rgba(60,50,45,0.45)'}} />
      </div>
      <YearDisplay t={t} fg={fg} />
      <div
        style={{
          position: 'absolute',
          left: 1460,
          top: 650,
          transform: `translateX(-50%) translateX(${ease.inCubic(seg(t, 55.08, 55.4)) * 900}px)`,
          fontFamily: F.serif,
          fontStyle: 'italic',
          fontSize: 44,
          color: fg,
          whiteSpace: 'nowrap',
        }}
      >
        {ERAS[ek].label}
      </div>
    </AbsoluteFill>
  );
};

// ================================================================= E: unite (cave → glass)
// cc_reach palm centre (normalized in the image)
const REACH = {u: 0.308, v: 0.573};
const ShotUnite: React.FC<{t: number}> = ({t}) => {
  const rockOut = ease.inOutCubic(seg(t, 55.41, 55.95));
  const blueIn = ease.outCubic(seg(t, 55.41, 55.8));
  const herIn = ease.outCubic(seg(t, 55.6, 56.15));
  const contact = t >= 56.37 ? 1 : 0;
  const glow = seg(t, 56.2, 56.37) * 0.3 + contact * (0.7 + 0.3 * Math.exp(-(t - 56.37) / 0.3)) + 0.25 * beatPulse(t, 0.15) * herIn;
  // dive starts at 56.92: push into the contact point
  const dive = ease.inCubic(seg(t, 56.92, 57.45));
  const sprH = 1500, sprW = sprH * (1040 / 1552);
  const sx = HAND_X - (REACH.u - 0.5) * sprW; // sprite centre x
  const sy = HAND_Y + (1 - REACH.v) * sprH; // sprite bottom
  const press = 1 - 0.03 * herIn;
  return (
    <AbsoluteFill style={{background: C.cream, transform: `scale(${1 + dive * 6})`, transformOrigin: `${HAND_X}px ${HAND_Y + 40}px`, opacity: 1 - ease.inOutCubic(seg(t, 56.92, 57.32))}}>
      {/* her side: warm light */}
      <AbsoluteFill style={{background: `radial-gradient(circle at ${HAND_X}px ${HAND_Y}px, #FFF7EE 0%, ${C.cream} 45%, ${C.clayPale} 100%)`}} />
      <div style={{opacity: herIn, transform: `translateY(${(1 - herIn) * 40}px) scale(${press})`, transformOrigin: `${HAND_X}px ${HAND_Y}px`, position: 'absolute', inset: 0}}>
        {/* the art's hair is cropped by the image bounds at both sides → feather those edges */}
        <Sprite
          src="img/cc_reach.png"
          t={t}
          x={sx}
          y={sy}
          h={sprH}
          float={2}
          style={{WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 16%, black 84%, transparent 100%)'}}
        />
      </div>
      {/* the cave wall fades away (it was always the glass) */}
      {rockOut < 1 ? (
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity: 1 - rockOut}}>
          <CaveWall t={t} w={W} h={H} handX={HAND_X} handY={HAND_Y} handScale={HAND_S} stencil={1} />
        </svg>
      ) : null}
      {/* glass */}
      <AbsoluteFill style={{opacity: rockOut}}>
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
          <defs>
            <linearGradient id="p1glass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.0} />
              <stop offset="45%" stopColor="#ffffff" stopOpacity={0.0} />
              <stop offset="50%" stopColor="#ffffff" stopOpacity={0.35} />
              <stop offset="56%" stopColor="#ffffff" stopOpacity={0.0} />
              <stop offset="62%" stopColor="#ffffff" stopOpacity={0.18} />
              <stop offset="66%" stopColor="#ffffff" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <rect x={0} y={0} width={W} height={H} fill="rgba(106,155,204,0.06)" />
          <rect x={-200 + Math.sin(t) * 40} y={0} width={W + 400} height={H} fill="url(#p1glass)" />
        </svg>
      </AbsoluteFill>
      {/* the human's hand, pressed on the glass from outside */}
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <defs>
          <clipPath id="p1fill">
            <rect x={-400} y={260 - blueIn * 640} width={800} height={800} />
          </clipPath>
          <linearGradient id="p1wrist" gradientUnits="userSpaceOnUse" x1={0} y1={60} x2={0} y2={230}>
            <stop offset="0%" stopColor={C.blue} stopOpacity={1} />
            <stop offset="100%" stopColor={C.blue} stopOpacity={0} />
          </linearGradient>
          <radialGradient id="p1contact">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
            <stop offset="35%" stopColor="#ffffff" stopOpacity={0.85} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </radialGradient>
        </defs>
        <g transform={`translate(${HAND_X} ${HAND_Y}) scale(${HAND_S * (1 + 0.02 * beatPulse(t, 0.15))})`} clipPath="url(#p1fill)">
          <HandShape fill={C.blue} wristFill="url(#p1wrist)" opacity={lerp(1, 0.58, herIn)} filter={`drop-shadow(0 0 ${18 + 30 * glow}px rgba(106,155,204,0.8))`} />
          <HandShape fill="#fff" grow={-14} opacity={0.12 * herIn} />
        </g>
        {glow > 0.01 ? <circle cx={HAND_X} cy={HAND_Y + 40} r={120 + 260 * glow} fill="url(#p1contact)" opacity={clamp(glow)} /> : null}
      </svg>
      <Ring x={HAND_X} y={HAND_Y + 40} t={t} at={56.37} r0={60} r1={600} color="#fff" width={10} dur={0.6} />
      <Ring x={HAND_X} y={HAND_Y + 40} t={t} at={56.37} r0={40} r1={420} color={C.clayLight} width={6} dur={0.5} />
      <RayBurst x={HAND_X} y={HAND_Y + 40} t={t} at={56.37} r0={140} r1={620} n={24} color="#fff" width={6} dur={0.5} />

    </AbsoluteFill>
  );
};

// =================================================================
export const S03Pre1: React.FC<{t: number}> = ({t}) => {
  const cap = (text: string, after: number, color: string, opts: Partial<React.ComponentProps<typeof LyricLine>> = {}) => (
    <LyricLine
      key={text + after}
      cue={prettyCue(cueAt(text, after))}
      t={t}
      x={960}
      y={986}
      size={54}
      color={color}
      fadeOut={0.14}
      shadow={color === C.ink ? '0 0 14px rgba(250,249,245,0.95), 0 0 4px rgba(250,249,245,0.9)' : '0 2px 14px rgba(20,20,19,0.55), 0 0 3px rgba(20,20,19,0.5)'}
      {...opts}
    />
  );
  // time-travel caption colour follows the era under the caption
  let ek = 0;
  if (t >= 51.36 && t < 55.4) {
    const S = scrollAt(t);
    for (let k = 1; k < 7; k++) if (S + 986 >= bandTop(k)) ek = k;
  }
  const timeFg = ERAS[ek].fg;
  return (
    <AbsoluteFill style={{background: C.paper, overflow: 'hidden'}}>
      {t < 47.67 ? <ShotLever t={t} /> : null}
      {t >= 47.67 && t < 49.53 ? <ShotBlind t={t} /> : null}
      {t >= 49.53 && t < 51.36 ? <ShotDizzy t={t} /> : null}
      {t >= 51.36 && t < 55.4 ? <ShotTime t={t} /> : null}
      {t >= 56.92 ? <Dive t={t} vx0={HAND_X} vy0={HAND_Y + 40} /> : null}
      {t >= 55.4 && t < 57.35 ? <ShotUnite t={t} /> : null}
      {t >= 56.85 ? <DiveWords t={t} vx0={HAND_X} vy0={HAND_Y + 40} /> : null}

      {/* captions */}
      {cap('And then blind my vision', 47.6, C.ink, {outAt: 49.4})}
      {t >= 49.53 ? (
        <div style={{position: 'absolute', inset: 0, transform: `rotate(${3 * Math.sin((t - 49.53) * 4)}deg)`, transformOrigin: '960px 986px'}}>
          {cap('So dizzy so dizzy', 49.5, C.ink, {outAt: 51.15})}
        </div>
      ) : null}
      {cap('Oh we can travel', 51.3, timeFg, {outAt: 53.15, hl: ek === 0 || ek === 1 || ek === 5 ? C.clayDark : C.clayLight})}
      {cap('To A.D to B.C', 53.2, timeFg, {outAt: 55.0, hl: ek === 5 ? C.clayDark : C.clayLight})}
      {cap('And we can unite', 55.0, t < 55.6 ? C.cream : C.cream, {outAt: 56.85})}

      <Flash t={t} at={YANK} dur={0.3} color="#fff" max={0.45} />
      <Flash t={t} at={AC} dur={0.2} color="#fff" max={0.25} />
      <Flash t={t} at={DC} dur={0.2} color="#fff" max={0.25} />
      <Grain t={t} opacity={0.04} />
      {/* hand-off: pure white exactly at 59.22 (the next scene starts out of white) */}
      {t > 58.72 ? <AbsoluteFill style={{background: '#fff', opacity: ease.inCubic(seg(t, 58.72, 59.2))}} /> : null}
    </AbsoluteFill>
  );
};
