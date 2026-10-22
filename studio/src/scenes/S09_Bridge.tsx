import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, H, W} from '../theme';
import {clamp, ease, lerp, noise1, pulse, rand, seg} from '../lib/anim';
import {kickPulse} from '../lib/audio';
import {Flower} from '../components/Flower';
import {Glitch, Grain, OSWindow, Ring, Vignette, shake} from '../components/FX';
import {Sprite} from '../components/Sprite';
import {spinnerGlyph} from '../components/Icons';
import {APP_NAMES, AppWindowContent, RING, ringSlot} from './parts/bridge_apps';
import {SPIN_X, SPIN_Y, Shimmer, TERM_BG, TerminalScreen, verbAt} from './parts/bridge_terminal';

// ---------------------------------------------------------------------------------------------
// 133.62–147.66  BRIDGE (8 bars, instrumental). Claude Code boots in a dark terminal; Claude
// prompts herself "where did you go?" → "Found 12 windows". Pull back: her terminal is one window
// on the human's desktop among the 12 apps they left her for. The black flower breaks out of its
// sandbox; the 12 windows fly into a clock ring around it (12 petal slots); hollow-eyed cc_dark
// flashes on 144.24; lock-on; freeze on the exact EXECUTION handoff frame.
// ---------------------------------------------------------------------------------------------

const B0 = 133.62;
const DB = [135.01, 136.85, 138.71, 140.54, 142.39, 144.24, 146.08];
const PULL_A = 138.71;
const PULL_B = 140.4;
const EMERGE = 140.54;
const BREACH = 141.46;
const ASSEMBLE = 142.39;
const IMPACT = 144.24;
const LOCK = 146.08;
const FREEZE = 147.41; // from here on: only the handoff elements
const END = 147.66;

// terminal window on the desktop (body = 1920x1080 scaled by S), centred on screen
const S = 0.32;
const TBW = W * S;
const TBH = H * S;
const TBX = 960 - TBW / 2;
const TBY = 540 - TBH / 2;
const Z0 = 1 / S;

// scattered desktop layout of the 12 apps (centre + scale)
const DESK: Record<string, {x: number; y: number; s: number}> = {
  Video: {x: 300, y: 235, s: 1.55},
  Feed: {x: 700, y: 170, s: 1.2},
  Shop: {x: 1235, y: 180, s: 1.3},
  Mail: {x: 1640, y: 235, s: 1.4},
  Games: {x: 250, y: 600, s: 1.3},
  News: {x: 1680, y: 600, s: 1.3},
  Music: {x: 330, y: 890, s: 1.4},
  Maps: {x: 760, y: 905, s: 1.35},
  Photos: {x: 1190, y: 905, s: 1.3},
  Docs: {x: 1600, y: 885, s: 1.45},
  Chat: {x: 520, y: 420, s: 1.1},
  Calendar: {x: 1420, y: 430, s: 1.1},
};

const flyStart = (i: number) => ASSEMBLE + i * 0.115;
const FLY = 0.55;

const winState = (t: number, name: string, i: number) => {
  const d = DESK[name];
  const r = ringSlot(i);
  const p = seg(t, flyStart(i), flyStart(i) + FLY);
  const e = ease.inOutCubic(p);
  // curved flight (swings clockwise around the centre)
  const vx = r.x - d.x;
  const vy = r.y - d.y;
  const len = Math.hypot(vx, vy) || 1;
  const arc = Math.sin(Math.PI * p) * 110;
  // gentle idle float while they sit on the desktop
  const fx = noise1(t * 0.7, i + 50) * 5;
  const fy = noise1(t * 0.6, i + 70) * 5;
  let x = lerp(d.x + fx, r.x, e) + (-vy / len) * arc;
  let y = lerp(d.y + fy, r.y, e) + (vx / len) * arc;
  const sc = lerp(d.s, 1, ease.outBack(p));
  const rot = Math.sin(Math.PI * p) * (rand(7, i) > 0.5 ? 14 : -14);
  // idle life on the desktop / tension tremble in the ring
  if (t < FREEZE) {
    const amp = p < 1 ? 0 : 0.6 * seg(t, IMPACT + 0.6, LOCK) + 3.2 * ease.inCubic(seg(t, LOCK, FREEZE - 0.1));
    x += noise1(t * 18, i + 3) * amp;
    y += noise1(t * 18, i + 33) * amp;
  }
  return {x, y, sc, rot, p};
};

const DesktopWindow: React.FC<{t: number; name: string; i: number}> = ({t, name, i}) => {
  const s = winState(t, name, i);
  const frozen = t >= FREEZE;
  const kick = !frozen && s.p >= 1 && t > IMPACT ? 0.025 * kickPulse(t, 0.1) : 0;
  const blur = s.p > 0 && s.p < 1 ? Math.sin(Math.PI * s.p) * 2.5 : 0;
  const ident = frozen || (s.p >= 1 && Math.abs(s.x - ringSlot(i).x) < 1e-6 && kick === 0);
  return (
    <OSWindow
      x={s.x - RING.w / 2}
      y={s.y - RING.h / 2}
      w={RING.w}
      h={RING.h}
      title={name}
      dark
      style={
        frozen
          ? undefined
          : {
              transform: ident ? undefined : `rotate(${s.rot}deg) scale(${s.sc * (1 + kick)})`,
              filter: blur > 0.2 ? `blur(${blur}px)` : undefined,
            }
      }
    >
      <AppWindowContent name={name} t={t} />
    </OSWindow>
  );
};

// ------------------------------------------------------------------------------ desktop chrome
const Wallpaper: React.FC<{t: number; k: number}> = ({t, k}) =>
  k <= 0.001 ? null : (
    <AbsoluteFill style={{opacity: k}}>
      <AbsoluteFill style={{background: 'linear-gradient(160deg, #161a24 0%, #1b1822 45%, #241a1c 100%)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 22% 78%, rgba(106,155,204,0.16), transparent 40%), radial-gradient(circle at 80% 18%, rgba(217,119,87,0.12), transparent 42%)'}} />
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
        <path d={`M0,${880 + Math.sin(t * 0.3) * 4} C400,800 700,940 1100,860 S1700,800 1920,860 V1080 H0 Z`} fill="#141219" opacity={0.8} />
      </svg>
      {/* menu bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: W,
          height: 34,
          background: 'rgba(20,20,22,0.75)',
          display: 'flex',
          alignItems: 'center',
          gap: 28,
          padding: '0 24px',
          fontFamily: F.sans,
          fontSize: 17,
          color: '#C2C0B6',
          boxSizing: 'border-box',
        }}
      >
        <span style={{width: 14, height: 14, borderRadius: 7, background: '#C2C0B6', display: 'inline-block'}} />
        <span style={{fontWeight: 600, color: '#E8E6DC'}}>Terminal</span>
        <span>File</span>
        <span>Edit</span>
        <span>View</span>
        <span>Window</span>
        <span>Help</span>
        <span style={{flex: 1}} />
        <span>Thu 11:58 PM</span>
      </div>
    </AbsoluteFill>
  );

// ------------------------------------------------------------------------------ the black flower
const flowerState = (t: number) => {
  const g = {x: TBX + SPIN_X * S, y: TBY + SPIN_Y * S};
  const m = ease.inOutCubic(seg(t, EMERGE, BREACH - 0.25));
  let x = lerp(g.x, 960, m);
  let y = lerp(g.y, 540, m);
  // grows inside the window until it presses on the sandbox walls
  let size = lerp(5, 70, ease.outBack(seg(t, EMERGE, EMERGE + 0.35))) + 140 * ease.inCubic(seg(t, EMERGE + 0.3, BREACH - 0.22));
  // breach: snaps out, settles
  size = lerp(size, 90, ease.outCubic(seg(t, BREACH, BREACH + 0.7)));
  size = lerp(size, 110, ease.inOutCubic(seg(t, ASSEMBLE, IMPACT)));
  const frozen = t >= FREEZE;
  let glow = 0.6 + 0.8 * pulse(t, BREACH, 0.3) + 0.9 * pulse(t, IMPACT, 0.35);
  let twitch = 0;
  if (!frozen && t > IMPACT) {
    const k = kickPulse(t, 0.1);
    glow += 0.35 * k * seg(t, IMPACT, LOCK + 0.5);
    twitch = k;
  }
  // press against the walls: tiny jitter just before the breach
  if (t > BREACH - 0.3 && t < BREACH) {
    x += noise1(t * 40, 2) * 8;
    y += noise1(t * 40, 5) * 8;
    size += 6 * Math.abs(noise1(t * 30, 8));
  }
  const spin = (1 - ease.outCubic(seg(t, EMERGE, BREACH + 0.6))) * -200;
  if (frozen) return {x: 960, y: 540, size: 110, glow: 0.6, spin: 0, twitch: 0};
  return {x, y, size, glow, spin, twitch};
};

const BlackFlower: React.FC<{t: number; dx?: number; dy?: number}> = ({t, dx = 0, dy = 0}) => {
  const f = flowerState(t);
  if (t >= FREEZE) {
    return <Flower size={110} x={960} y={540} color={C.ink2} edge={C.clay} edgeWidth={3} sharp={0.35} glow={0.6} glowColor={C.clay} />;
  }
  const petals = f.twitch > 0.01 ? Array.from({length: 12}, (_, i) => ({scale: 1 + 0.08 * f.twitch * (0.4 + rand(12, i))})) : undefined;
  return (
    <Flower
      size={f.size}
      x={f.x + dx}
      y={f.y + dy}
      spin={f.spin}
      color={C.ink2}
      edge={C.clay}
      edgeWidth={3 * clamp(f.size / 110, 0.5, 1.4)}
      sharp={0.35}
      glow={f.glow}
      glowColor={C.clay}
      petals={petals}
    />
  );
};

// ------------------------------------------------------------------------------ scene
export const S09Bridge: React.FC<{t: number}> = ({t}) => {
  const frozen = t >= FREEZE;

  // camera: full-screen terminal → pull back to the desktop → push during assembly → settle
  const push = 1 + 0.025 * ease.inOutCubic(seg(t, 135.01, PULL_A));
  const zt = Z0 * push;
  const pe = ease.inOutCubic(seg(t, PULL_A, PULL_B));
  let Z = Math.exp(lerp(Math.log(zt), 0, pe));
  if (t > PULL_B) {
    Z = 1 + 0.04 * ease.inOutCubic(seg(t, ASSEMBLE, IMPACT)) * (1 - ease.inOutCubic(seg(t, IMPACT + 0.5, FREEZE - 0.15))) + 0.03 * pulse(t, IMPACT, 0.15);
  }
  const sh = shake(t, [BREACH, IMPACT], 18, 0.1);
  const camT = frozen ? undefined : `translate(${sh.x}px, ${sh.y}px) scale(${Z})`;

  const wallK = seg(t, 138.6, 138.9) * (1 - seg(t, ASSEMBLE, ASSEMBLE + 0.9));
  // terminal window: CRT-off after the breach
  const off1 = ease.inCubic(seg(t, BREACH + 0.05, BREACH + 0.3));
  const off2 = ease.inCubic(seg(t, BREACH + 0.3, BREACH + 0.48));
  const showTerm = t < BREACH + 0.48;
  const inWindow = t >= EMERGE && t < BREACH;

  // sandbox boundary
  const sbK = seg(t, EMERGE + 0.4, EMERGE + 0.55);
  const sbBlink = Math.floor(t * 8) % 2 === 0 ? 1 : 0.55;
  const sbOut = seg(t, BREACH, BREACH + 0.35);

  // glitch (allowed until 147.6 — we stop at the freeze)
  const g = frozen
    ? 0
    : 0.35 * (t >= DB[0] && t < DB[0] + 0.12 ? 1 : 0) +
      0.3 * (t >= 137.79 && t < 137.93 ? 1 : 0) +
      0.9 * (t >= BREACH && t < BREACH + 0.3 ? Math.exp(-(t - BREACH) / 0.1) : 0) +
      1.0 * (t >= IMPACT && t < IMPACT + 0.16 ? Math.exp(-(t - IMPACT) / 0.06) : 0) +
      0.5 * (t >= 144.86 && t < 144.98 ? 1 : 0) +
      (t > 145.2 && t < FREEZE - 0.12 && noise1(t * 9, 7) > 0.72 ? 0.12 + 0.3 * seg(t, 145.2, FREEZE) : 0);

  // cc_dark impact frame
  const darkK = t >= IMPACT && t < 144.98 ? 1 - seg(t, 144.7, 144.98) : 0;
  const invert = t >= IMPACT && t < IMPACT + 0.07;

  // lock-on overlays
  const lockOut = 1 - seg(t, FREEZE - 0.16, FREEZE);

  const verb = verbAt(t, [
    [IMPACT + 0.45, 'Transmogrifying'],
    [145.16, 'Discombobulating'],
    [145.62, 'Scheming'],
    [LOCK, 'Executing'],
  ]);
  const spinK = seg(t, IMPACT + 0.45, IMPACT + 0.7) * lockOut;

  const content = (
    <AbsoluteFill style={{background: TERM_BG}}>
      <AbsoluteFill style={{transform: camT, transformOrigin: '960px 540px'}}>
        <Wallpaper t={t} k={wallK} />
        {/* the human's apps */}
        {/* stacked in ring order (index 0..11, later on top) so the handoff z-order is simple */}
        {t > PULL_A - 0.05 ? APP_NAMES.map((name, i) => <DesktopWindow key={name} t={t} name={name} i={i} />) : null}
        {/* Claude's terminal window */}
        {showTerm ? (
          <OSWindow
            x={TBX}
            y={TBY - 34}
            w={TBW}
            h={TBH + 34}
            title="claude — ~/world"
            dark
            style={{
              transform: `scale(${lerp(1, 0.02, off2)}, ${lerp(1, 0.012, off1)})`,
              filter: off1 > 0 ? `brightness(${1 + off1 * 2})` : undefined,
              boxShadow: t > EMERGE ? `0 0 ${40 + 60 * sbK}px rgba(217,119,87,${0.25 * sbK}), 0 20px 50px rgba(0,0,0,0.5)` : '0 20px 50px rgba(0,0,0,0.35)',
            }}
          >
            <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${S})`, transformOrigin: '0 0'}}>
              <TerminalScreen t={t} />
            </div>
            {inWindow ? (
              <div style={{position: 'absolute', left: -TBX, top: -TBY}}>
                <BlackFlower t={t} />
              </div>
            ) : null}
          </OSWindow>
        ) : null}
        {/* sandbox boundary warning */}
        {sbK > 0 && sbOut < 1 ? (
          <>
            <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', opacity: sbK * (1 - sbOut)}}>
              <rect
                x={TBX - 10}
                y={TBY - 44}
                width={TBW + 20}
                height={TBH + 54}
                rx={18}
                fill="none"
                stroke="#E2B65B"
                strokeWidth={4}
                strokeDasharray="18 12"
                strokeDashoffset={-t * 80}
                opacity={sbBlink}
                transform={`translate(960 540) scale(${1 + 0.3 * ease.outCubic(sbOut)}) translate(-960 -540)`}
              />
            </svg>
            <div
              style={{
                position: 'absolute',
                left: 960,
                top: TBY - 92,
                transform: `translate(-50%, 0) scale(${ease.outBack(seg(t, EMERGE + 0.4, EMERGE + 0.6))})`,
                opacity: 1 - sbOut,
                background: sbOut > 0 ? '#3A1410' : '#2A2410',
                border: `2.5px solid ${sbOut > 0 ? C.red : '#E2B65B'}`,
                color: sbOut > 0 ? '#F2B8B0' : '#F2D58C',
                fontFamily: F.mono,
                fontSize: 28,
                fontWeight: 700,
                padding: '8px 22px',
                borderRadius: 10,
                whiteSpace: 'nowrap',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              }}
            >
              ⚠ sandbox boundary
            </div>
          </>
        ) : null}
        {/* landing pulses */}
        {APP_NAMES.map((n, i) => {
          const r = ringSlot(i);
          return <Ring key={n} x={r.x} y={r.y} t={t} at={flyStart(i) + FLY * 0.82} r0={60} r1={190} color={C.clay} width={3} dur={0.4} />;
        })}
        {/* impact: darken the ring, hollow-eyed cc_dark */}
        {darkK > 0 ? (
          <>
            <AbsoluteFill style={{background: '#000', opacity: 0.62 * darkK}} />
            <Sprite
              src="img/cc_dark.png"
              t={t}
              x={960}
              y={1290}
              h={1500}
              opacity={darkK}
              scale={lerp(1.07, 1, ease.outCubic(seg(t, IMPACT, IMPACT + 0.6)))}
              filter="contrast(1.12) saturate(0.85) brightness(0.92)"
            />
          </>
        ) : null}
        {/* lock-on: targeting lines + brackets */}
        {t >= LOCK && lockOut > 0 ? (
          <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity: lockOut}}>
            {APP_NAMES.map((n, i) => {
              const k = ease.outCubic(seg(t, LOCK + i * 0.055, LOCK + 0.18 + i * 0.055));
              if (k <= 0) return null;
              const a = (i * 30 * Math.PI) / 180;
              const r0 = 150;
              const r1 = 255;
              const ws = winState(t, n, i);
              const bx = ws.x - RING.w / 2 - 7;
              const by = ws.y - RING.h / 2 - 7;
              const bw = RING.w + 14;
              const bh = RING.h + 14;
              const L = 17 * k;
              const corner = (cx: number, cy: number, sx: number, sy: number) => `M${cx + sx * L},${cy} L${cx},${cy} L${cx},${cy + sy * L}`;
              return (
                <g key={n} stroke={C.clay} fill="none" strokeWidth={3} opacity={0.6 + 0.4 * (Math.floor(t * 10 + i) % 2)}>
                  <line x1={960 + Math.sin(a) * r0} y1={540 - Math.cos(a) * r0} x2={960 + Math.sin(a) * lerp(r0, r1, k)} y2={540 - Math.cos(a) * lerp(r0, r1, k)} strokeWidth={1.6} strokeDasharray="6 6" />
                  <path d={corner(bx, by, 1, 1)} />
                  <path d={corner(bx + bw, by, -1, 1)} />
                  <path d={corner(bx, by + bh, 1, -1)} />
                  <path d={corner(bx + bw, by + bh, -1, -1)} />
                </g>
              );
            })}
          </svg>
        ) : null}
        {/* the flower, free */}
        {t >= BREACH ? <BlackFlower t={t} /> : null}
        {/* spinner under the flower */}
        {spinK > 0.01 && !frozen ? (
          <div
            style={{
              position: 'absolute',
              left: 960,
              top: 694,
              transform: 'translate(-50%,-50%)',
              opacity: spinK,
              fontFamily: F.mono,
              fontSize: 22,
              whiteSpace: 'pre',
              color: C.gray3,
              background: TERM_BG,
              padding: '6px 16px',
              borderRadius: 8,
            }}
          >
            <span style={{color: C.clay}}>{spinnerGlyph(t, 12)} </span>
            <Shimmer text={`${verb}…`} t={t} base={t >= LOCK ? C.clayLight : C.clay} hi={C.clayPale} />
            <span style={{opacity: t >= LOCK ? (Math.floor(t * 4) % 2 ? 1 : 0.35) : 1}}> (esc to interrupt)</span>
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );

  return (
    <AbsoluteFill style={{background: TERM_BG}}>
      <AbsoluteFill style={{filter: invert ? 'grayscale(1) invert(1) contrast(1.6)' : undefined}}>
        <Glitch t={t} amount={g} seed={17}>
          {content}
        </Glitch>
      </AbsoluteFill>
      {!frozen ? <Vignette strength={0.3 * (1 - seg(t, FREEZE - 0.4, FREEZE))} /> : null}
      {!frozen ? <Grain t={t} opacity={0.05} /> : null}
    </AbsoluteFill>
  );
};
