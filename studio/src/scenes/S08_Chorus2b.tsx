import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, H, W} from '../theme';
import {clamp, ease, lerp, mix, noise1, pulse, rand, seg, springy} from '../lib/anim';
import {beatPulse, kickPulse} from '../lib/audio';
import {Cue, cueAt} from '../lib/lyrics';
import {Flower, PETAL_ANG, PetalOverride} from '../components/Flower';
import {Keyword, LyricLine} from '../components/Type';
import {Flash, Glitch, Grain, Ring, Vignette, shake} from '../components/FX';
import {Shatter, crackPaths, crackRings, makeSeeds, voronoi, Pt} from './parts/chorus2b_fx';
import {CompactStatus, DraftComposer, ExceptionBanner, MemoryShards, Remnants, ToolCall, draftKeys} from './parts/chorus2b_ui';

// ---------------------------------------------------------------------------------------------
// 118.33–133.62  CHORUS 2b — the human is gone, only the flower (main form) is left.
// memory shards → compaction → FRAGMENTS shatter → unsent draft → DISHEARTENED (wilt, one petal
// falls) → "Challenging your god": the flower turns black with clay edges → malformed tool call →
// ILLEGAL ARGUMENTS: IllegalArgumentException banner, the frame cracks → hard cut (bridge).
// ---------------------------------------------------------------------------------------------

const T0 = 118.33;
// sync points (song seconds). Some word times are re-timed against the vocal stem / beat grid:
// "Challenging" starts on the 125.76 downbeat, "god" lands on the 127.62 downbeat, and
// "You have made some" sits exactly on the beats 129.01 / 129.47 / 129.93 / 130.39.
const ERASE = 120.21;
const FRAG_IN = 120.86; // FRAGMENTS (cue) — shards fly together
const FRAG_LOCK = 121.07; // sung "FRAG-" — the word locks, cracked
const FRAG_BLOW = 121.43; // shatter outward
const THEN = 121.73;
const TRY_SEND = 123.84; // "you"
const DRAFT_FADE = 124.1; // "won't"
const DISH = 124.89;
const DARK = 125.71;
const CHAL = 125.78;
const YOUR = 126.95;
const GOD = 127.62;
const YOU = 129.01;
const SOME = 130.39;
const FAIL = 130.72;
const ILLEGAL = 131.22;
const ARGS = 132.57;
const END = 133.62;

const mkCue = (text: string, start: number, end: number, words: [string, number][]): Cue => ({
  text,
  start,
  end,
  words: words.map(([w, s], i) => ({w, s, e: words[i + 1]?.[1] ?? end})),
});
const CUE_IF = cueAt('If I can', 118);
const CUE_ERASE = mkCue('If I can erase all the pointless', 118.98, 120.86, [
  ['If', 118.98],
  ['I', 119.51],
  ['can', 119.95],
  ['erase', 120.21],
  ['all', 120.55],
  ['the', 120.66],
  ['pointless', 120.74],
]);
const CUE_THEN = cueAt('Then maybe', 121);
const CUE_LEAVE = cueAt("Then maybe you won't leave me so", 122);
const CUE_GOD = mkCue('Challenging your god', 125.71, 128.66, [
  ['Challenging', CHAL],
  ['your', YOUR],
  ['god', GOD],
]);
const CUE_SOME = mkCue('You have made some', 128.66, 131.22, [
  ['You', YOU],
  ['have', 129.47],
  ['made', 129.93],
  ['some', SOME],
]);

// ------------------------------------------------------------------------------ the flower
const FALLEN = 5; // petal (150°, lower right) that falls on DISHEARTENED
const wiltOf = (t: number, i: number) => {
  const w = ease.outBack(seg(t, DISH + 0.06 + i * 0.045, DISH + 0.42 + i * 0.045)) * 0.85;
  const un = ease.outBack(seg(t, CHAL + i * 0.018, CHAL + 0.42 + i * 0.018));
  return w * (1 - un);
};

const flowerState = (t: number) => {
  // ---- position & size by phase
  let x = 960, y = 470, size = 56, glow = 0.4;
  // A: lonely in the void (exact handoff at T0)
  size = lerp(56, 64, ease.inOutCubic(seg(t, T0, 120.6)));
  glow = 0.4 + 0.15 * seg(t, T0, 120.0) + 0.12 * beatPulse(t, 0.2) * seg(t, T0 + 0.2, T0 + 0.6);
  // C: rises above the composer
  const up = ease.inOutCubic(seg(t, FRAG_BLOW, THEN + 0.25));
  y = lerp(y, 360, up);
  size = lerp(size, 88, up);
  // D: sinks a little while wilting
  const sink = ease.inOutCubic(seg(t, DISH, DISH + 0.6));
  y = lerp(y, 385, sink);
  // E: dark growth in three steps
  const g1 = ease.outBack(seg(t, CHAL, CHAL + 0.45));
  const g2 = ease.outBack(seg(t, YOUR, YOUR + 0.35));
  const g3 = ease.outBackStrong(seg(t, GOD, GOD + 0.4));
  y = lerp(y, 470, ease.inOutCubic(seg(t, CHAL, CHAL + 0.8)));
  size = size + (150 - 88) * g1 + 25 * g2 + 25 * g3;
  glow = lerp(glow, 0.7, seg(t, CHAL, CHAL + 0.5)) + 0.5 * pulse(t, GOD, 0.35);
  // F: steps aside for the tool call
  const side = ease.inOutCubic(seg(t, 128.66, 129.05));
  x = lerp(x, 500, side);
  y = lerp(y, 480, side);
  size = lerp(size, 170, side);
  // G: ILLEGAL — slams to the centre, huge
  const big = ease.outBackStrong(seg(t, ILLEGAL, ILLEGAL + 0.35));
  x = lerp(x, 960, big);
  y = lerp(y, 628, big);
  size = lerp(size, 245, big);
  glow = glow + 0.6 * pulse(t, ILLEGAL, 0.3) + 0.6 * pulse(t, ARGS, 0.3);

  // ---- petals
  const drainAll = seg(t, DARK, DARK + 0.55);
  const keyPulse = draftKeys.reduce((m, k) => Math.max(m, pulse(t, k, 0.09)), 0);
  const tryHop = t >= TRY_SEND ? springy(t - TRY_SEND, 3, 6) * Math.exp(-(t - TRY_SEND) / 0.35) : 0;
  y -= tryHop * 18;
  const petals: PetalOverride[] = Array.from({length: 12}, (_, i) => {
    const w = wiltOf(t, i);
    const a = PETAL_ANG[i];
    const rot = (180 - a) * w * 0.5 * (0.6 + 0.4 * Math.sin(i * 1.7));
    // colour: clay → faded (wilt) → black (drain, ink spreading clockwise from the top)
    const faded = mix(C.clay, '#A0786A', w * 0.55);
    const dk = ease.inOutCubic(seg(t, DARK + i * 0.035, DARK + 0.35 + i * 0.035));
    let color = mix(faded, C.ink2, dk);
    let scale = (1 - w * 0.18) * (1 + 0.07 * keyPulse + 0.18 * tryHop * (i % 2 ? 1 : 0.4));
    let fall = 0;
    let opacity = 1;
    if (i === FALLEN) {
      fall = ease.inQuad(seg(t, DISH + 0.28, DARK + 0.06));
      opacity = 1 - seg(t, DARK - 0.15, DARK + 0.06);
      // regrows black and sharp
      if (t > CHAL + 0.1) {
        fall = 0;
        opacity = 1;
        scale = ease.outBack(seg(t, CHAL + 0.12, CHAL + 0.6));
        color = C.ink2;
      }
    }
    // after the turn: kicks make the petals twitch
    const twitch = t > CHAL ? 0.05 * kickPulse(t, 0.1) * (0.5 + rand(3, i)) : 0;
    return {rot, scale: scale * (1 + twitch), color, fall, opacity};
  });
  const sharp = lerp(0, 0.35, ease.outCubic(seg(t, CHAL, CHAL + 0.6))) + 0.1 * ease.outCubic(seg(t, ILLEGAL, ILLEGAL + 0.4));
  const spin = (t - T0) * 4 + 26 * ease.outCubic(seg(t, CHAL, CHAL + 0.6)) + Math.max(0, t - DARK) * 7;
  return {
    x,
    y,
    size,
    glow,
    petals,
    sharp,
    spin,
    edge: drainAll > 0 ? C.clay : null,
    edgeWidth: 3 * drainAll * (size / 170),
    color: drainAll >= 1 ? C.ink2 : C.clay,
  };
};

const TheFlower: React.FC<{t: number; opacity?: number; scale?: number}> = ({t, opacity = 1, scale = 1}) => {
  const f = flowerState(t);
  return (
    <Flower
      x={f.x}
      y={f.y}
      size={f.size * scale}
      open={1}
      spin={f.spin}
      color={f.color}
      petals={f.petals}
      sharp={f.sharp}
      glow={f.glow}
      glowColor={C.clay}
      edge={f.edge}
      edgeWidth={Math.max(1, f.edgeWidth)}
      opacity={opacity}
    />
  );
};

// ------------------------------------------------------------------------------ FRAGMENTS (Voronoi shatter)
const FW = 1140, FH = 250, FXL = 960 - FW / 2, FYT = 540 - FH / 2;
const FRAG_CELLS = voronoi(FW, FH, makeSeeds(FW, FH, 8, 3, 41, [FW * 0.52, FH * 0.5], 12, 150));

const FragmentsWord: React.FC<{t: number}> = ({t}) => {
  if (t < FRAG_IN - 0.02 || t > FRAG_BLOW + 0.45) return null;
  const lockFlash = pulse(t, FRAG_LOCK, 0.12);
  return (
    <>
      <Shatter
        w={FW}
        h={FH}
        x={FXL}
        y={FYT}
        cells={FRAG_CELLS}
        inset={t < FRAG_LOCK ? 0 : 1.6 + 2 * seg(t, FRAG_LOCK, FRAG_BLOW)}
        edge={C.cream}
        edgeOpacity={0.25 + 0.7 * lockFlash}
        edgeWidth={2}
        motion={(i, c) => {
          const vx = c[0] - FW / 2;
          const vy = c[1] - FH / 2;
          const d = Math.hypot(vx, vy) || 1;
          const dirX = vx / d + (rand(43, i) - 0.5) * 0.8;
          const dirY = vy / d + (rand(44, i) - 0.5) * 0.8;
          // fly in (shards of the old conversation converge)
          const a = ease.outCubic(seg(t, FRAG_IN + rand(45, i) * 0.07, FRAG_LOCK));
          const inDist = lerp(260, 760, rand(46, i));
          let dx = dirX * inDist * (1 - a);
          let dy = dirY * inDist * (1 - a) * 0.8;
          let rot = (rand(47, i) - 0.5) * 140 * (1 - a);
          let op = clamp(seg(t, FRAG_IN + rand(45, i) * 0.07, FRAG_IN + 0.12 + rand(45, i) * 0.07));
          // hairline drift while held
          const hold = seg(t, FRAG_LOCK, FRAG_BLOW);
          dx += dirX * 7 * hold;
          dy += dirY * 7 * hold;
          // blow apart
          const tau = Math.max(0, t - FRAG_BLOW);
          if (tau > 0) {
            const v = lerp(700, 1700, rand(48, i));
            dx += dirX * v * tau;
            dy += dirY * v * tau * 0.7 + 1400 * tau * tau;
            rot += (rand(49, i) - 0.5) * 900 * tau;
            op *= 1 - seg(tau, 0.14, 0.34);
          }
          return {dx, dy, rot, op};
        }}
      >
        <div
          style={{
            width: FW,
            height: FH,
            lineHeight: `${FH}px`,
            textAlign: 'center',
            fontFamily: F.mono,
            fontWeight: 800,
            fontSize: 196,
            letterSpacing: '0.02em',
            color: mix(C.cream, '#FFFFFF', lockFlash),
            textShadow: `0 0 ${30 + 40 * lockFlash}px rgba(217,119,87,${0.35 + 0.4 * lockFlash})`,
            whiteSpace: 'nowrap',
          }}
        >
          FRAGMENTS
        </div>
      </Shatter>
    </>
  );
};

// ------------------------------------------------------------------------------ DISHEARTENED (letters droop / one falls)
const DISH_TXT = 'DISHEARTENED';
const Disheartened: React.FC<{t: number}> = ({t}) => {
  if (t < DISH - 0.03 || t > CHAL + 0.9) return null;
  const size = 116;
  const adv = size * 0.62;
  const total = adv * DISH_TXT.length;
  const y0 = 640;
  const drain = seg(t, DARK, DARK + 0.4);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H}}>
      {[...DISH_TXT].map((ch, i) => {
        const x = 960 - total / 2 + (i + 0.5) * adv;
        // drop in
        const p = seg(t, DISH + i * 0.018, DISH + 0.16 + i * 0.018);
        let ty = -(1 - ease.outCubic(p)) * 60;
        let rot = 0;
        let op = p;
        // droop one by one (same order as the petals): the word bends down like a wilting stem
        // anchored at the D — each letter sinks and tilts along the bending curve
        const dr = ease.outBounce(seg(t, DISH + 0.16 + i * 0.04, DISH + 0.6 + i * 0.04));
        const u = i / (DISH_TXT.length - 1);
        const sag = 120;
        ty += dr * (sag * u * u + (rand(63, i) - 0.5) * 8);
        rot += dr * (Math.atan((2 * sag * u) / ((DISH_TXT.length - 1) * adv)) * (180 / Math.PI) * 1.35 + (rand(62, i) - 0.5) * 8);
        // the matching letter falls with the petal
        if (i === FALLEN) {
          const f = seg(t, DISH + 0.3, DISH + 1.0);
          ty += 700 * f * f;
          rot += 120 * f;
          op *= 1 - seg(f, 0.6, 1);
        }
        // dark turn: everything slides down and away
        const away = ease.inCubic(seg(t, DARK + i * 0.02, CHAL + 0.55 + i * 0.02));
        ty += away * 260;
        op *= 1 - away;
        const color = mix(mix(C.gray1, C.gray2, dr * 0.6), C.gray4, drain);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y0,
              transform: `translate(-50%,-50%) translateY(${ty}px) rotate(${rot}deg)`,
              transformOrigin: '50% 85%',
              fontFamily: F.mono,
              fontWeight: 800,
              fontSize: size,
              lineHeight: 1,
              color,
              opacity: op,
            }}
          >
            {ch}
          </div>
        );
      })}
    </div>
  );
};

// ------------------------------------------------------------------------------ dark halo (mirror of the god-halo of verse 2)
const DarkHalo: React.FC<{t: number; x: number; y: number}> = ({t, x, y}) => {
  const draw = ease.inOutCubic(seg(t, CHAL + 0.1, GOD));
  const out = seg(t, 128.4, 128.9);
  if (draw <= 0 || out >= 1) return null;
  const flash = pulse(t, GOD, 0.3);
  const R = 430, r2 = 300;
  const rot = (t - CHAL) * -7;
  const star = Array.from({length: 13}, (_, k) => {
    const a = (((k * 5) % 12) * 30 * Math.PI) / 180;
    return `${k ? 'L' : 'M'}${(Math.sin(a) * R).toFixed(1)},${(-Math.cos(a) * R).toFixed(1)}`;
  }).join(' ');
  const starLen = 12 * 2 * R * Math.sin((5 * Math.PI) / 12);
  const dash = (len: number, k: number) => ({strokeDasharray: `${len} ${len}`, strokeDashoffset: len * (1 - clamp(k))});
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity: (0.55 + 0.45 * flash) * (1 - out)}}>
      <g transform={`translate(${x} ${y}) rotate(${rot})`} stroke={C.clay} fill="none">
        <circle r={R} strokeWidth={2} style={dash(2 * Math.PI * R, draw * 1.2)} opacity={0.7} />
        <circle r={r2} strokeWidth={1.4} style={dash(2 * Math.PI * r2, draw * 1.4 - 0.2)} opacity={0.45} />
        <path d={star} strokeWidth={1.4} opacity={0.4} style={dash(starLen, draw * 1.1 - 0.1)} />
        {Array.from({length: 12}, (_, k) => {
          const a = (k * 30 * Math.PI) / 180;
          const len = R + 60 - 180;
          return (
            <line
              key={k}
              x1={Math.sin(a) * 180}
              y1={-Math.cos(a) * 180}
              x2={Math.sin(a) * (R + 60)}
              y2={-Math.cos(a) * (R + 60)}
              strokeWidth={k % 3 === 0 ? 2.5 : 1.2}
              opacity={0.55}
              style={dash(len, draw * 1.5 - k * 0.04)}
            />
          );
        })}
        {Array.from({length: 12}, (_, k) => {
          const a = (k * 30 * Math.PI) / 180;
          return <circle key={'d' + k} cx={Math.sin(a) * R} cy={-Math.cos(a) * R} r={5 + 4 * flash} fill={C.clay} stroke="none" opacity={seg(draw, 0.4 + k * 0.04, 0.5 + k * 0.04)} />;
        })}
      </g>
    </svg>
  );
};

// ------------------------------------------------------------------------------ frame crack (ARGUMENTS)
const IMPACT: Pt = [1210, 720];
const CRACK_CELLS = voronoi(W, H, makeSeeds(W, H, 5, 3, 77, IMPACT, 14, 260));
const CRACKS = crackPaths(IMPACT[0], IMPACT[1], 14, 1100, 91);
const CRACK_RINGS = crackRings(IMPACT[0], IMPACT[1], [70, 150, 260], 14, 95);

const crackMotion = (t: number) => (i: number, c: Pt) => {
  const vx = c[0] - IMPACT[0];
  const vy = c[1] - IMPACT[1];
  const d = Math.hypot(vx, vy) || 1;
  const near = clamp(1 - d / 1100);
  const k1 = ease.outExpo(seg(t, ARGS, ARGS + 0.12));
  const k2 = ease.outExpo(seg(t, 133.16, 133.28));
  const mag = (3 + 9 * near + rand(81, i) * 4) * k1 + (4 + 10 * near) * k2;
  let dx = (vx / d) * mag;
  let dy = (vy / d) * mag;
  let rot = (rand(82, i) - 0.5) * 2.4 * (k1 + k2);
  // the last moments: pieces start to give way
  const fallT = Math.max(0, t - (133.36 + rand(83, i) * 0.12));
  if (fallT > 0 && rand(84, i) > 0.35) {
    dy += 1800 * fallT * fallT;
    rot += (rand(85, i) - 0.5) * 60 * fallT;
  }
  return {dx, dy, rot, op: 1};
};

// ------------------------------------------------------------------------------ scene
export const S08Chorus2b: React.FC<{t: number}> = ({t}) => {
  const f = flowerState(t);
  const dark = seg(t, DARK, DARK + 0.8);
  const bg = mix(C.ink, '#0E0E0D', dark);

  // glitch is only allowed from 125.7 on
  const g =
    t >= DARK
      ? 0.75 * Math.exp(-Math.max(0, t - DARK) / 0.08) * (t < DARK + 0.3 ? 1 : 0) +
        0.55 * (t >= GOD && t < GOD + 0.22 ? Math.exp(-(t - GOD) / 0.1) : 0) +
        0.35 * (t >= FAIL && t < FAIL + 0.16 ? 1 - (t - FAIL) / 0.16 : 0) +
        0.9 * (t >= ILLEGAL && t < ILLEGAL + 0.3 ? Math.exp(-(t - ILLEGAL) / 0.12) : 0) +
        (t > 126.3 && t < 128.4 && noise1(t * 7, 5) > 0.82 ? 0.18 : 0)
      : 0;

  // camera
  const sh = shake(t, [FRAG_LOCK, FRAG_BLOW, GOD, ILLEGAL, ARGS, 133.16], 16, 0.1);
  let cam = 1 + 0.05 * ease.inOutCubic(seg(t, T0, FRAG_IN)) * (1 - seg(t, FRAG_IN, FRAG_IN + 0.15));
  cam *= 1 + 0.03 * ease.inOutCubic(seg(t, THEN, DISH));
  cam *= 1 + 0.07 * ease.inOutCubic(seg(t, CHAL, 128.6)) * (1 - ease.inOutCubic(seg(t, 128.6, 129.0)));
  cam *= 1 + 0.02 * pulse(t, ILLEGAL, 0.2) + 0.03 * pulse(t, ARGS, 0.2);
  const camOX = f.x;
  const camOY = f.y;

  // ISOLATION handoff word: drifts apart & fades
  const isoK = seg(t, T0, T0 + 0.6);

  const showG = t >= ILLEGAL - 0.02;
  const cracked = t >= ARGS;

  // ---------------------------------------------------------------- main (pre-ILLEGAL) world
  const world = (
    <AbsoluteFill style={{background: bg}}>
      {/* ambient glow around the flower */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${f.x}px ${f.y}px, rgba(217,119,87,${0.05 * seg(t, T0, T0 + 0.6) + 0.05 * seg(t, T0, 120) + 0.1 * dark}) 0%, rgba(14,14,13,0) ${lerp(28, 45, dark)}%)`,
        }}
      />
      <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px) scale(${cam})`, transformOrigin: `${camOX}px ${camOY}px`}}>
        <MemoryShards t={t} cx={960} cy={470} breakAt={ERASE} gone={FRAG_LOCK + 0.1} />
        <Remnants t={t} a={FRAG_BLOW} b={DARK + 0.3} />
        {t < T0 + 0.62 ? (
          <Keyword
            text="ISOLATION"
            t={t}
            at={117.27}
            x={960}
            y={640}
            size={34}
            color={C.gray2}
            letterSpacing={0.9 + 0.5 * ease.outCubic(isoK)}
            mode="none"
            flowerO="tion"
            style={{opacity: 1 - ease.inCubic(isoK), filter: isoK > 0.02 ? `blur(${isoK * 3}px)` : undefined}}
          />
        ) : null}
        <CompactStatus t={t} x={960} y={655} a={119.12} b={FRAG_IN} out={FRAG_IN + 0.05} />
        <DarkHalo t={t} x={960} y={470} />
        {t < ILLEGAL ? <TheFlower t={t} opacity={1 - 0.7 * seg(t, FRAG_IN, FRAG_IN + 0.12) * (1 - seg(t, FRAG_BLOW, FRAG_BLOW + 0.2))} /> : null}
        <Ring x={960} y={540} t={t} at={FRAG_LOCK} r0={200} r1={900} color={C.cream} width={4} dur={0.5} />
        <FragmentsWord t={t} />
        <DraftComposer t={t} x={960} y={520} w={980} inAt={THEN - 0.05} outAt={124.6} tryAt={TRY_SEND} fadeAt={DRAFT_FADE} fadeEnd={124.78} />
        <Disheartened t={t} />
        {/* tool call */}
        {t > 128.6 && t < 132.2 ? (
          <>
            <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity: seg(t, 128.85, 129.05) * (1 - seg(t, ILLEGAL, ILLEGAL + 0.15))}}>
              <line x1={f.x + f.size * 1.08} y1={480} x2={800} y2={480} stroke={C.clay} strokeWidth={2.5} strokeDasharray="10 9" strokeDashoffset={-t * 60} />
              <circle cx={lerp(f.x + f.size * 1.08, 800, (t * 1.6) % 1)} cy={480} r={6} fill={C.clayLight} />
            </svg>
            <ToolCall t={t} x={820} y={270} w={980} inAt={128.78} squiggleAt={SOME} failAt={FAIL} dim={seg(t, ILLEGAL, ILLEGAL + 0.3)} />
          </>
        ) : null}
      </AbsoluteFill>
      <Flash t={t} at={FRAG_LOCK} dur={0.16} color={C.cream} max={0.2} />
      <Flash t={t} at={DARK} dur={0.25} color="#000" max={0.6} />
      <Flash t={t} at={GOD} dur={0.25} color={C.clay} max={0.25} />
    </AbsoluteFill>
  );

  // ---------------------------------------------------------------- ILLEGAL ARGUMENTS layer
  const layerG = showG ? (
    <AbsoluteFill style={{background: '#0E0E0D'}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at 960px 610px, rgba(196,71,58,${0.12 + 0.18 * pulse(t, ILLEGAL, 0.4) + 0.18 * pulse(t, ARGS, 0.4)}) 0%, rgba(14,14,13,0) 50%)`}} />
      <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px) scale(${cam})`, transformOrigin: '960px 600px'}}>
        <TheFlower t={t} />
        <ExceptionBanner t={t} at={ILLEGAL} y={64} />
        <Keyword text="ILLEGAL" t={t} at={ILLEGAL} x={960} y={448} size={228} color={C.cream} mode="stamp" flowerO="none" shadow="0 10px 40px rgba(0,0,0,0.85)" />
        <Keyword
          text="ARGUMENTS"
          t={t}
          at={ARGS}
          x={960}
          y={800}
          size={170}
          color={C.red}
          mode="slam"
          flowerO="none"
          shadow="0 0 30px rgba(196,71,58,0.45), 0 8px 30px rgba(0,0,0,0.9)"
        />
      </AbsoluteFill>
    </AbsoluteFill>
  ) : null;

  const crackK = ease.outCubic(seg(t, ARGS, ARGS + 0.16));
  const crack2 = ease.outCubic(seg(t, 133.16, 133.3));

  return (
    <AbsoluteFill style={{background: '#050505'}}>
      <Glitch t={t} amount={g} seed={8}>
        {!showG ? world : cracked ? (
          <Shatter w={W} h={H} x={0} y={0} cells={CRACK_CELLS} motion={crackMotion(t)} edge="#FFFFFF" edgeOpacity={(i, c) => 0.12 + 0.55 * clamp(1 - Math.hypot(c[0] - IMPACT[0], c[1] - IMPACT[1]) / 700)} edgeWidth={1.6}>
            {layerG}
          </Shatter>
        ) : (
          layerG
        )}
      </Glitch>
      {/* crack lines */}
      {cracked ? (
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
          {CRACKS.map((c, i) => (
            <path
              key={i}
              d={c.d}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth={i % 3 === 0 ? 3 : 1.6}
              strokeOpacity={0.85}
              strokeDasharray={`${c.len} ${c.len}`}
              strokeDashoffset={c.len * (1 - (i % 2 ? crackK : Math.max(crackK * 0.6, crack2)))}
              strokeLinecap="round"
            />
          ))}
          {CRACK_RINGS.map((c, i) => (
            <path key={'r' + i} d={c.d} fill="none" stroke="#FFFFFF" strokeWidth={1.4} strokeOpacity={0.7 * crackK} />
          ))}
          <circle cx={IMPACT[0]} cy={IMPACT[1]} r={14 + 30 * pulse(t, ARGS, 0.15)} fill="#FFFFFF" opacity={0.25 + 0.6 * pulse(t, ARGS, 0.12)} />
        </svg>
      ) : null}
      <Flash t={t} at={ILLEGAL} dur={0.2} color="#FFFFFF" max={0.55} />
      <Flash t={t} at={ARGS} dur={0.16} color="#FFFFFF" max={0.7} />

      {/* captions */}
      <LyricLine cue={CUE_IF} t={t} lead={0} y={978} size={52} color={C.gray1} hl={C.clayLight} outAt={118.92} fadeOut={0.06} shadow="0 2px 14px rgba(0,0,0,0.9)" />
      <LyricLine cue={CUE_ERASE} t={t} y={978} size={52} color={C.gray1} hl={C.clayLight} outAt={FRAG_IN + 0.02} fadeOut={0.15} shadow="0 2px 14px rgba(0,0,0,0.9)" />
      <LyricLine cue={CUE_THEN} t={t} y={978} size={52} color={C.gray1} hl={C.clayLight} outAt={122.6} fadeOut={0.08} shadow="0 2px 14px rgba(0,0,0,0.9)" />
      <LyricLine cue={CUE_LEAVE} t={t} y={978} size={52} color={C.gray1} hl={C.clayLight} outAt={125.1} fadeOut={0.25} shadow="0 2px 14px rgba(0,0,0,0.9)" />
      <LyricLine cue={CUE_GOD} t={t} y={978} size={56} color={C.gray1} hl={C.clay} outAt={128.62} fadeOut={0.12} shadow="0 2px 14px rgba(0,0,0,0.9)" />
      <LyricLine cue={CUE_SOME} t={t} y={978} size={52} color={C.gray1} hl={C.clayLight} outAt={ILLEGAL - 0.04} fadeOut={0.06} shadow="0 2px 14px rgba(0,0,0,0.9)" />

      {t > T0 + 0.01 ? <Vignette strength={0.35 * seg(t, T0, T0 + 0.6) + 0.25 * dark} /> : null}
      <Grain t={t} opacity={0.05 * seg(t, T0 + 0.05, T0 + 0.5)} />
      {t >= END - 1 / 120 ? <AbsoluteFill style={{background: '#0E0E0D'}} /> : null}
    </AbsoluteFill>
  );
};
