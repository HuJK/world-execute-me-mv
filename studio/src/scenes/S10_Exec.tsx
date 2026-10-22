import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, H, W} from '../theme';
import {clamp, ease, lerp, mix, noise1, pulse, rand, seg, springy} from '../lib/anim';
import {beatPulse} from '../lib/audio';
import {Flower, PETAL_ANG, petalTip} from '../components/Flower';
import {Flash, Glitch, Grain, OSWindow, RayBurst, Ring, shake} from '../components/FX';
import {AppWindowContent} from './parts/exec_apps';
import {APPS, BG, Comet, ForceX, ImpactFrame, RING_R, RING_X, RING_Y, Stamp, WIN_H, WIN_W, slotPos} from './parts/exec_fx';
import {CW_RECT, ClaudeWindow, FULL_RECT, lerpRect} from './parts/exec_claudewin';
import {BlackFlower} from './parts/exec_flower';

// ---------------------------------------------------------------------------------------------
// 147.66–162.63  EXECUTION ×12 → EIN DOS TROIS NE FEM LIU → EXECUTION (white-out, one window left)
// The 12 app windows the human left her for sit on a clock ring around the black flower. Each sung
// EXECUTION closes one (clockwise from 12 o'clock) and ignites the matching petal. Hits 1–8 politely
// minimize; from hit 9 (where the JP/CN subs turn "execute" into "kill") they are force-quit.
// ---------------------------------------------------------------------------------------------

// first hit is nudged to the scene's first frame so frame 1 == the bridge's hand-off frame
export const HITS = [147.667, 148.6, 149.52, 150.54, 151.52, 152.28, 153.16, 153.98, 155.2, 156.08, 157.04, 158.0];
const COUNT_T = [158.9, 159.32, 159.66, 160.24, 160.69, 161.12];
const FINAL = 161.58;
const FORCE_FROM = 8;
const ignAt = (i: number) => HITS[i] + (i < FORCE_FROM ? 0.27 : 0.24);

// hero stamp placement per hit (x, y, rotation, size)
const HERO: [number, number, number, number][] = [
  [960, 300, -5, 124],
  [1240, 300, 8, 96],
  [1300, 440, -11, 100],
  [1445, 540, 84, 104],
  [1270, 690, -7, 100],
  [1110, 815, 10, 96],
  [960, 775, -3, 124],
  [715, 830, 13, 104],
  [650, 700, -15, 116],
  [470, 540, -84, 114],
  [640, 365, 12, 118],
  [880, 258, -9, 160],
];
const IMPRINT_ROT = [-6, 5, -3, 8, -7, 4, -5, 6, -9, 7, -4, 0];

// ------------------------------------------------------------------ shards for force-quit windows
type Shard = {poly: [number, number][]; cx: number; cy: number};
const SHARDS: Record<number, {ix: number; iy: number; shards: Shard[]}> = {};
const perim = (u: number): [number, number] => {
  if (u <= WIN_W) return [u, 0];
  if (u <= WIN_W + WIN_H) return [WIN_W, u - WIN_W];
  if (u <= 2 * WIN_W + WIN_H) return [WIN_W - (u - WIN_W - WIN_H), WIN_H];
  return [0, WIN_H - (u - 2 * WIN_W - WIN_H)];
};
for (let i = FORCE_FROM; i < 12; i++) {
  const ix = WIN_W / 2 + (rand(31, i) - 0.5) * 90;
  const iy = WIN_H / 2 + 5 + (rand(32, i) - 0.5) * 50;
  const P = 2 * (WIN_W + WIN_H);
  const us = [0, WIN_W, WIN_W + WIN_H, 2 * WIN_W + WIN_H];
  const N = 11;
  for (let k = 0; k < N; k++) us.push(((k + 0.2 + rand(33, i * 20 + k) * 0.6) / N) * P);
  us.sort((a, b) => a - b);
  const pts = us.map(perim);
  const shards: Shard[] = [];
  for (let k = 0; k < pts.length; k++) {
    const a = pts[k], b = pts[(k + 1) % pts.length];
    if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 2) continue;
    const poly: [number, number][] = [[ix, iy], a, b];
    shards.push({poly, cx: (ix + a[0] + b[0]) / 3, cy: (iy + a[1] + b[1]) / 3});
  }
  SHARDS[i] = {ix, iy, shards};
}

// ------------------------------------------------------------------ one window of the ring
const RingWindow: React.FC<{i: number; t: number}> = ({i, t}) => {
  const {x, y, a} = slotPos(i);
  const h0 = HITS[i];
  const dt = t - h0;
  const force = i >= FORCE_FROM;
  const name = APPS[i];
  const frozen = force && t > HITS[FORCE_FROM] - 0.38;
  // fear tremble, growing as the window's turn approaches (0 on the hand-off frame)
  const fear = seg(t, 147.68, 147.95) * (0.35 + 2.6 * ease.inCubic(seg(t, h0 - 0.75, h0)) + (frozen ? 1.6 : 0));
  const jx = noise1(t * 26, i * 3) * fear;
  const jy = noise1(t * 26, i * 3 + 1) * fear;
  const body = (
    <>
      <AppWindowContent name={name} t={frozen ? Math.min(t, HITS[FORCE_FROM] - 0.38) : t} />
      {frozen ? (
        <div style={{position: 'absolute', inset: 0, background: 'rgba(240,238,230,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10}}>
          <Flower size={13} spin={t * 520} color={C.gray2} centerColor={C.ink2} shade={null} />
          <span style={{fontFamily: F.sans, fontSize: 15, fontWeight: 600, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.6)'}}>Not Responding</span>
        </div>
      ) : null}
    </>
  );
  const win = (
    <OSWindow x={0} y={0} w={WIN_W} h={WIN_H} title={name} dark>
      {body}
    </OSWindow>
  );
  const left = x - WIN_W / 2, top = y - WIN_H / 2;
  if (dt < 0) {
    return <div style={{position: 'absolute', left: left + jx, top: top + jy, width: WIN_W, height: WIN_H}}>{win}</div>;
  }
  if (!force) {
    // ---- polite minimize: yellow button blinks → window folds to a hot line → line turns radial
    if (dt > 0.2) return null;
    const c1 = ease.inOutCubic(seg(dt, 0.015, 0.12));
    const sy = lerp(1, 0.035, c1);
    const sx = lerp(1, 0.7, c1);
    const rBar = (a % 180) - 90;
    const r = rBar * ease.inOutCubic(seg(dt, 0.08, 0.17));
    const m = 0.16 * ease.inCubic(seg(dt, 0.03, 0.17));
    const dx = (RING_X - x) * m, dy = (RING_Y - y) * m;
    const hot = clamp(dt / 0.05);
    const o = 1 - seg(dt, 0.15, 0.2);
    return (
      <div
        style={{
          position: 'absolute',
          left,
          top,
          width: WIN_W,
          height: WIN_H,
          transform: `translate(${dx}px, ${dy}px) rotate(${r}deg) scale(${sx}, ${sy})`,
          opacity: o,
        }}
      >
        {win}
        <div style={{position: 'absolute', inset: 0, borderRadius: 14, background: mix(C.clayLight, '#ffffff', c1), opacity: hot * 0.9, boxShadow: `0 0 40px ${C.clay}`}} />
        {/* minimize (yellow) button flash */}
        <div style={{position: 'absolute', left: 32 - 10, top: 17 - 10, width: 20, height: 20, borderRadius: 10, background: '#E9B44C', opacity: 1 - seg(dt, 0.02, 0.08), transform: `scale(${1 + 1.6 * seg(dt, 0, 0.05)})`, boxShadow: '0 0 18px #E9B44C'}} />
      </div>
    );
  }
  // ---- force quit: freeze, red ✕, crack lines, then shatter
  const S = SHARDS[i];
  const crackDraw = seg(dt, 0.0, 0.05);
  if (dt < 0.09) {
    return (
      <div style={{position: 'absolute', left: left + jx * 2, top: top + jy * 2, width: WIN_W, height: WIN_H, filter: 'grayscale(0.9) contrast(1.2)'}}>
        {win}
        <svg width={WIN_W} height={WIN_H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          {S.shards.map((sh, k) => {
            const [ax, ay] = sh.poly[1];
            const ex = lerp(S.ix, ax, crackDraw), ey = lerp(S.iy, ay, crackDraw);
            return <line key={k} x1={S.ix} y1={S.iy} x2={ex} y2={ey} stroke="#fff" strokeWidth={2.2} opacity={0.95} />;
          })}
        </svg>
        <ForceX x={S.ix} y={S.iy} t={t} at={h0} size={96} out={0.09} />
      </div>
    );
  }
  const p = seg(dt, 0.09, 0.78);
  if (p >= 1) return null;
  const ox = (x - RING_X) / RING_R, oy = (y - RING_Y) / RING_R;
  return (
    <>
      {S.shards.map((sh, k) => {
        const vx = sh.cx - S.ix, vy = sh.cy - S.iy;
        const vl = Math.hypot(vx, vy) || 1;
        const dirx = (vx / vl) * 0.75 + ox * 0.7, diry = (vy / vl) * 0.75 + oy * 0.7;
        const D = lerp(140, 420, rand(40 + i, k)) * ease.outCubic(p);
        const g = 520 * p * p;
        const rot = (rand(41 + i, k) - 0.5) * 300 * ease.outCubic(p);
        const poly = sh.poly.map(([px, py]) => `${px}px ${py}px`).join(', ');
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              left,
              top,
              width: WIN_W,
              height: WIN_H,
              clipPath: `polygon(${poly})`,
              transform: `translate(${dirx * D}px, ${diry * D + g}px) rotate(${rot}deg)`,
              transformOrigin: `${sh.cx}px ${sh.cy}px`,
              opacity: 1 - seg(p, 0.45, 1),
              filter: `grayscale(0.85) brightness(${1 + 0.8 * (1 - seg(p, 0, 0.25))})`,
            }}
          >
            {win}
          </div>
        );
      })}
    </>
  );
};

// ------------------------------------------------------------------ EIN DOS TROIS NE FEM LIU bubbles
type CountDef = {tag: string; main: string; ghost?: string; roman?: string; font: string; at: number};
const COUNTS: CountDef[] = [
  {tag: 'de', main: 'EIN', ghost: 'S', font: F.mono, at: COUNT_T[0]},
  {tag: 'es', main: 'DOS', font: F.mono, at: COUNT_T[1]},
  {tag: 'fr', main: 'TROIS', font: F.mono, at: COUNT_T[2]},
  {tag: 'kr', main: '넷', roman: 'NE', font: F.kr, at: COUNT_T[3]},
  {tag: 'se', main: 'FEM', font: F.mono, at: COUNT_T[4]},
  {tag: 'cn', main: '六', roman: 'LIU', font: F.cjk, at: COUNT_T[5]},
];
const CountBubble: React.FC<{k: number; t: number; fsize: number}> = ({k, t, fsize}) => {
  const c = COUNTS[k];
  if (t < c.at - 0.02) return null;
  const dt = t - c.at;
  const mid = (PETAL_ANG[2 * k] + PETAL_ANG[2 * k + 1]) / 2;
  const a = (mid * Math.PI) / 180;
  const R = 372;
  const s = springy(dt, 3.0, 7.5);
  const rr = lerp(R * 0.55, R, ease.outCubic(clamp(dt / 0.22)));
  const bx = RING_X + Math.sin(a) * rr, by = RING_Y - Math.cos(a) * rr;
  const ux = -Math.sin(a), uy = Math.cos(a); // toward flower
  const lineK = ease.outCubic(seg(dt, 0.02, 0.14));
  const tipR = fsize * 0.72;
  const lx0 = bx + ux * 72, ly0 = by + uy * 72;
  const lx1 = RING_X - ux * tipR, ly1 = RING_Y - uy * tipR;
  const cjk = c.font !== F.mono;
  const float = Math.sin((t - c.at) * 3 + k) * 4;
  return (
    <>
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <line x1={lx0} y1={ly0} x2={lerp(lx0, lx1, lineK)} y2={lerp(ly0, ly1, lineK)} stroke={C.cream} strokeWidth={2} strokeDasharray="2 7" strokeLinecap="round" opacity={0.7} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: bx,
          top: by + float,
          transform: `translate(-50%,-50%) scale(${s})`,
          background: C.cream,
          color: C.ink,
          borderRadius: 30,
          padding: '16px 30px 16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          boxShadow: `0 14px 40px rgba(0,0,0,0.5), 0 0 ${30 * pulse(t, c.at, 0.25)}px rgba(255,255,255,0.8)`,
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 24, color: '#fff', background: C.clay, borderRadius: 10, padding: '5px 12px', letterSpacing: '0.04em'}}>{c.tag}</div>
        <div style={{fontFamily: c.font, fontWeight: cjk ? 700 : 800, fontSize: cjk ? 84 : 78, lineHeight: 1, letterSpacing: cjk ? 0 : '0.02em'}}>
          {c.main}
          {c.ghost ? <span style={{color: C.gray2}}>{c.ghost}</span> : null}
        </div>
        {c.roman ? <div style={{fontFamily: F.mono, fontWeight: 700, fontSize: 28, color: C.gray4, marginLeft: -4}}>({c.roman})</div> : null}
        {/* tail toward the flower */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: 30,
            height: 30,
            background: C.cream,
            transform: `translate(-50%,-50%) translate(${ux * 62}px, ${uy * 62}px) rotate(45deg)`,
            zIndex: -1,
          }}
        />
      </div>
    </>
  );
};

/** count-in dial: clock ring with 12 ticks (one per petal) + a giant outlined numeral that punches on each count */
const CountDial: React.FC<{t: number}> = ({t}) => {
  if (t < 158.8 || t > FINAL + 0.2) return null;
  const draw = ease.inOutCubic(seg(t, 158.82, 159.1));
  const r = 252;
  const C2 = 2 * Math.PI * r;
  const n = COUNT_T.filter((c) => t >= c).length;
  const spin = -20 + 20 * ease.outCubic(seg(t, 158.8, 161.5));
  return (
    <>
      {n > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: RING_X,
            top: RING_Y + 12,
            transform: `translate(-50%,-50%) scale(${1 + 0.18 * pulse(t, COUNT_T[n - 1], 0.12)})`,
            fontFamily: F.mono,
            fontWeight: 800,
            fontSize: 760,
            lineHeight: 1,
            color: 'transparent',
            WebkitTextStroke: '3px rgba(243,233,220,0.22)',
          }}
        >
          {n}
        </div>
      ) : null}
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <g transform={`rotate(${spin} ${RING_X} ${RING_Y})`}>
          <circle cx={RING_X} cy={RING_Y} r={r} fill="none" stroke={C.cream} strokeOpacity={0.35} strokeWidth={1.5} strokeDasharray={`${C2 * draw} ${C2}`} transform={`rotate(-90 ${RING_X} ${RING_Y})`} />
          {PETAL_ANG.map((a, i) => {
            const on = t >= COUNT_T[Math.floor(i / 2)];
            const k = on ? pulse(t, COUNT_T[Math.floor(i / 2)], 0.2) : 0;
            const ar = (a * Math.PI) / 180;
            const r0 = r - 12 - 10 * k, r1 = r + 12 + 16 * k;
            return (
              <line
                key={i}
                x1={RING_X + Math.sin(ar) * r0}
                y1={RING_Y - Math.cos(ar) * r0}
                x2={RING_X + Math.sin(ar) * r1}
                y2={RING_Y - Math.cos(ar) * r1}
                stroke={on ? '#fff' : C.gray4}
                strokeWidth={on ? 4 : 2}
                strokeLinecap="round"
                opacity={draw}
              />
            );
          })}
        </g>
      </svg>
    </>
  );
};

// ------------------------------------------------------------------ Claude-Code-style execution log (bottom-left)
const LOG: [string, string, boolean][] = APPS.map((n, i) => (i < FORCE_FROM ? [`⏺ Execute(${n})`, '⎿  minimized · exit 0', false] : [`⏺ Execute(${n}, force)`, '⎿  kill -9 · not responding', true]));
const ExecLog: React.FC<{t: number}> = ({t}) => {
  const n = HITS.filter((h) => t >= h).length;
  if (n === 0) return null;
  const fade = 1 - seg(t, 158.55, 158.85);
  if (fade <= 0) return null;
  const rows: React.ReactNode[] = [];
  for (let k = Math.max(0, n - 3); k < n; k++) {
    const dt = t - HITS[k];
    const [a, b, red] = LOG[k];
    const age = n - 1 - k;
    rows.push(
      <div key={k} style={{opacity: (age === 0 ? 1 : age === 1 ? 0.6 : 0.32) * clamp(dt / 0.06), marginTop: 8}}>
        <div style={{color: red ? C.red : C.cream}}>
          <span style={{color: red ? C.red : C.clay}}>⏺</span>
          {a.slice(1)}
        </div>
        <div style={{color: red ? '#E07A6E' : C.gray3}}>{'  ' + b.slice(0, Math.floor(seg(dt, 0.05, 0.3) * b.length + 1e-6))}</div>
      </div>,
    );
  }
  return (
    <div style={{position: 'absolute', left: 52, bottom: 46, fontFamily: F.mono, fontSize: 20, lineHeight: '28px', whiteSpace: 'pre', opacity: fade}}>{rows}</div>
  );
};

const Counter: React.FC<{t: number}> = ({t}) => {
  const n = HITS.filter((h) => t >= h).length;
  if (n === 0) return null;
  const fade = 1 - seg(t, 158.55, 158.85);
  if (fade <= 0) return null;
  const last = HITS[n - 1];
  const pop = 1 + 0.35 * pulse(t, last, 0.1);
  const red = n > FORCE_FROM;
  return (
    <div style={{position: 'absolute', right: 60, top: 44, textAlign: 'right', fontFamily: F.mono, opacity: fade * clamp((t - HITS[0]) / 0.15)}}>
      <div style={{fontSize: 18, letterSpacing: '0.3em', color: C.gray3, fontWeight: 700}}>EXECUTED</div>
      <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 8}}>
        <span style={{fontSize: 92, fontWeight: 800, color: red ? C.red : C.clay, display: 'inline-block', transform: `scale(${pop})`, transformOrigin: '100% 80%', lineHeight: 1}}>
          {String(n).padStart(2, '0')}
        </span>
        <span style={{fontSize: 34, fontWeight: 700, color: C.gray4}}>/12</span>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ scene
export const S10Exec: React.FC<{t: number}> = ({t}) => {
  // ---- petal states
  const lit = HITS.filter((_, i) => t >= ignAt(i)).length;
  const petals = Array.from({length: 12}, (_, i) => {
    const ig = ignAt(i);
    const pair = Math.floor(i / 2);
    const wt = COUNT_T[pair];
    let color: string = C.ink2;
    if (t >= ig) {
      const flash = pulse(t, ig, 0.14);
      color = mix(C.clay, i >= FORCE_FROM ? '#FF8A6A' : '#FFFFFF', flash * 0.85);
    }
    if (t >= wt) color = mix(C.clay, '#FFFFFF', seg(t, wt, wt + 0.08));
    return {color, scale: 1 + 0.42 * pulse(t, ig, 0.13) + 0.3 * pulse(t, wt, 0.13)};
  });

  // ---- camera: alternating punches per hit, slow creep, shake (heavier on force-quits)
  let zoom = 1 + 0.04 * ease.inOutCubic(seg(t, 147.7, 158.6));
  let rot = 0, tx = 0, ty = 0;
  HITS.forEach((h, k) => {
    const dt = t - h;
    if (dt < 0 || dt > 1.4) return;
    const e = (1 - Math.exp(-dt / 0.018)) * Math.exp(-dt / 0.2);
    const st = k < FORCE_FROM ? 1 : 1.7;
    const sign = k % 2 ? -1 : 1;
    const {x, y} = slotPos(k);
    zoom += 0.05 * st * e;
    rot += sign * 1.5 * st * e;
    tx += ((RING_X - x) / RING_R) * 34 * st * e;
    ty += ((RING_Y - y) / RING_R) * 34 * st * e;
  });
  COUNT_T.forEach((h, k) => {
    const dt = t - h;
    if (dt < 0 || dt > 1) return;
    const e = (1 - Math.exp(-dt / 0.018)) * Math.exp(-dt / 0.18);
    zoom += 0.03 * e;
    rot += (k % 2 ? -1 : 1) * 0.9 * e;
  });
  const sh1 = shake(t, HITS.slice(0, FORCE_FROM).filter((h) => h > 148), 7, 0.05);
  const sh2 = shake(t, HITS.slice(FORCE_FROM), 26, 0.07);
  const camX = tx + sh1.x + sh2.x, camY = ty + sh1.y + sh2.y;

  // ---- force-quit inverted frames & glitch
  let invert = false, glitch = 0;
  HITS.slice(FORCE_FROM, 11).forEach((h) => {
    if (t >= h && t < h + 0.034) invert = true;
  });
  HITS.slice(FORCE_FROM).forEach((h) => {
    const dt = t - h;
    if (dt >= 0 && dt < 0.16) glitch = Math.max(glitch, 0.85 * (1 - dt / 0.16));
  });

  // ---- flower
  const breath = 1 + 0.035 * beatPulse(t, 0.14) * seg(t, 147.68, 147.85);
  const fsize = 110 * (1 + 0.012 * lit) * breath;
  const fglow = 0.6 + 0.07 * lit + 0.6 * pulse(t, HITS.length ? ignAt(Math.max(0, lit - 1)) : 0, 0.2) * (lit > 0 ? 1 : 0);
  // final white-out bloom
  const bloom = ease.inExpo(seg(t, FINAL, FINAL + 0.2));
  const sceneFade = 1 - seg(t, FINAL + 0.14, FINAL + 0.2);

  const redK = seg(t, HITS[FORCE_FROM] - 0.4, HITS[FORCE_FROM]) * (1 - seg(t, 158.6, 159.2));
  const warm = (lit / 12) * (1 - seg(t, FINAL, FINAL + 0.15));

  const world = (
    <AbsoluteFill style={{background: BG}}>
      {/* atmosphere grows with each lit petal; red pressure during force-quits */}
      <AbsoluteFill style={{background: `radial-gradient(circle at ${RING_X}px ${RING_Y}px, rgba(217,119,87,${0.16 * warm}) 0%, rgba(217,119,87,0) 42%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, rgba(122,35,27,0) 45%, rgba(122,35,27,${0.55 * redK}) 100%)`}} />
      {/* count-in: soft white halo */}
      <AbsoluteFill style={{background: `radial-gradient(circle at ${RING_X}px ${RING_Y}px, rgba(255,255,255,${0.1 * seg(t, 158.9, 161.2) * (1 - seg(t, FINAL, FINAL + 0.15))}) 0%, rgba(255,255,255,0) 40%)`}} />

      <AbsoluteFill style={{transform: `translate(${camX}px, ${camY}px) rotate(${rot}deg) scale(${zoom})`, transformOrigin: `${RING_X}px ${RING_Y}px`, opacity: sceneFade}}>
        {APPS.map((_, i) => (
          <RingWindow key={i} i={i} t={t} />
        ))}

        {/* imprint + hero stamps */}
        {HITS.map((h, k) => {
          if (t < h) return null;
          const [hx, hy, hr, hs] = HERO[k];
          const {x: sx, y: sy} = slotPos(k);
          const last = k === 11;
          const m = last ? 0 : ease.inOutCubic(seg(t, h + 0.46, h + 0.7));
          const op = (last ? 1 - seg(t, h + 0.5, h + 0.8) : lerp(1, 0.78, m)) * (1 - seg(t, 158.5, 158.85));
          const force = k >= FORCE_FROM;
          return (
            <Stamp
              key={k}
              t={t}
              at={h}
              x={lerp(hx, sx, m)}
              y={lerp(hy, sy, m)}
              rot={lerp(hr, IMPRINT_ROT[k], m)}
              size={hs}
              scale={lerp(1, 30 / hs, m)}
              opacity={op}
              color={force ? C.red : C.clay}
              sub={force ? 'SIGKILL · FORCE QUIT' : 'SIGTERM · EXIT 0'}
              seed={k + 2}
            />
          );
        })}

        {/* comets: closed window → petal */}
        {HITS.map((h, i) => {
          const {x, y} = slotPos(i);
          const force = i >= FORCE_FROM;
          const t0 = h + (force ? 0.09 : 0.14);
          const p = seg(t, t0, ignAt(i));
          if (p <= 0 || p >= 1) return null;
          const m = force ? 0 : 0.16;
          const tip = petalTip(i, fsize * 0.62);
          return (
            <Comet
              key={i}
              x0={lerp(x, RING_X, m)}
              y0={lerp(y, RING_Y, m)}
              x1={RING_X + tip.x}
              y1={RING_Y + tip.y}
              p={p}
              color={force ? '#E8603F' : C.clay}
              width={force ? 26 : 20}
            />
          );
        })}

        {/* ignition rings at petal tips */}
        {HITS.map((_, i) => {
          const tip = petalTip(i, fsize);
          return <Ring key={i} x={RING_X + tip.x} y={RING_Y + tip.y} t={t} at={ignAt(i)} r0={6} r1={i >= FORCE_FROM ? 90 : 60} dur={0.4} color={i >= FORCE_FROM ? '#FF8A6A' : C.clayLight} width={4} />;
        })}
        {COUNT_T.map((ct, k) => (
          <Ring key={'c' + k} x={RING_X} y={RING_Y} t={t} at={ct} r0={fsize} r1={fsize * 2.6} dur={0.45} color="#ffffff" width={3} />
        ))}
        {HITS.slice(FORCE_FROM).map((h, k) => (
          <RayBurst key={'rb' + k} x={RING_X} y={RING_Y} t={t} at={ignAt(FORCE_FROM + k)} r0={fsize * 1.05} r1={fsize * 3.2} n={28} color="#FF8A6A" width={4} seed={k + 3} />
        ))}

        <CountDial t={t} />

        {/* the black flower */}
        <BlackFlower x={RING_X} y={RING_Y} size={fsize * (1 + 26 * bloom)} petals={petals} glow={fglow} t={t} />

        {COUNTS.map((_, k) => (
          <CountBubble key={k} k={k} t={t} fsize={fsize} />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );

  // ---- white-out → contracts into Claude's window (the only one left)
  const whiteK = seg(t, FINAL + 0.03, FINAL + 0.16);
  const contract = ease.inOutCubic(seg(t, 162.05, 162.42));
  const wrect = lerpRect(FULL_RECT, CW_RECT, contract);
  const winK = seg(t, 162.28, 162.44);

  return (
    <AbsoluteFill style={{background: BG}}>
      <AbsoluteFill style={{filter: invert ? 'invert(1)' : undefined}}>
        <Glitch t={t} amount={glitch} seed={7}>
          {world}
        </Glitch>
      </AbsoluteFill>

      {/* HUD (screen space) */}
      <Counter t={t} />
      <ExecLog t={t} />

      {/* impact frames: hits 4, 8, 12 */}
      <ImpactFrame t={t} at={HITS[3]} kind="face" dur={0.045} />
      <ImpactFrame t={t} at={HITS[7]} kind="conduct" dur={0.045} />
      <ImpactFrame t={t} at={HITS[11]} kind="faceInv" dur={0.05} />

      {/* final EXECUTION */}
      {whiteK > 0 ? (
        <>
          {winK < 1 ? (
            <div
              style={{
                position: 'absolute',
                left: wrect.x,
                top: wrect.y,
                width: wrect.w,
                height: wrect.h,
                borderRadius: 14 * contract,
                background: mix('#FFFFFF', '#1c1c1b', ease.inCubic(seg(t, 162.12, 162.42))),
                opacity: whiteK,
                boxShadow: contract > 0 ? `0 0 ${120 * (1 - contract) + 30}px rgba(255,255,255,${0.5 * (1 - winK)})` : undefined,
              }}
            />
          ) : null}
          {t < 162.1
            ? [0, 1, 2].map((k) => <Ring key={k} x={960} y={530} t={t} at={FINAL + 0.12 + k * 0.1} r0={120} r1={900} dur={0.5} color={k === 1 ? C.clayLight : '#E8E2D6'} width={5} />)
            : null}
          <Stamp
            t={t}
            at={FINAL + 0.04}
            x={960}
            y={525}
            rot={-4}
            size={150}
            color={C.ink}
            flowerColor={C.clay}
            sub="MINIMIZE --ALL"
            seed={21}
            flowerCenter="#FFFFFF"
            opacity={1 - seg(t, 162.02, 162.18)}
            scale={lerp(1, 0.5, contract) * (1 + 0.05 * seg(t, FINAL + 0.15, 162.1))}
          />
          {winK > 0 ? <ClaudeWindow t={t} rect={CW_RECT} opacity={winK} border={0.25 + 0.5 * (1 - seg(t, 162.44, 162.63))} /> : null}
          {t > 162.3 ? (
            <BlackFlower x={960} y={500 + Math.sin(t * 2.1) * 4} size={100 * ease.outBack(seg(t, 162.3, 162.58)) * (1 + 0.05 * beatPulse(t, 0.14))} t={t} glow={0.65} />
          ) : null}
        </>
      ) : null}
      <Flash t={t} at={FINAL} dur={0.2} color="#ffffff" max={0.9} />

      <Grain t={t} opacity={0.05 * seg(t, 147.68, 147.9)} />
    </AbsoluteFill>
  );
};
