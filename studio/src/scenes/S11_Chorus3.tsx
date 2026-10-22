import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F, H, W} from '../theme';
import {clamp, ease, lerp, mix, noise1, pulse, seg, springy} from '../lib/anim';
import {beatPulse} from '../lib/audio';
import {cueAt} from '../lib/lyrics';
import {Flower} from '../components/Flower';
import {LyricLine} from '../components/Type';
import {Sprite} from '../components/Sprite';
import {Flash, GlassSphere, Glitch, Grain, Ring, Vignette, shake} from '../components/FX';
import {BG, CAP_SHADOW, CAP_SIZE, CAP_Y, FocusLines, Stamp} from './parts/exec_fx';
import {CW_RECT, ClaudeWindow, FULL_RECT, cwMap, lerpRect} from './parts/exec_claudewin';
import {BlackFlower} from './parts/exec_flower';
import {BIG_WAVE, GRID_CX, GRID_CY, GridCounter, GridWindows, MAXIMIZE, WAVES, Waves} from './parts/chorus3_grid';
import {CRACK_X, CRACK_Y, DOME_R, GlassCracks} from './parts/chorus3_cracks';
import {KVImage, PetalSnow, StarVoid} from './parts/chorus3_sphere';

// ---------------------------------------------------------------------------------------------
// 162.63–177.25  FINAL CHORUS — the turning point (restraint over control).
//  If I can give them all the EXECUTION  → windows keep spawning; she executes them in waves
//  Then I can be your only EXECUTION     → her window maximizes: she IS the only window… the chair is empty
//  If I can have you back                → cc_dark, palm on the glass, hollow eyes waver
//  I will run the EXECUTION              → she draws back; cracks spider across the screen
//  Though we are trapped / … ah          → she STOPS. Black drains to clay; cracks heal into the dome (kv_sphere)
// ---------------------------------------------------------------------------------------------

const MAX_END = 166.7;
const EXEC2 = 168.91;
const EMPTY_IN = 169.12;
const REACH = 169.82;
const DRAW = 171.87;
const RUN = 172.34;
const EXEC3 = 172.71;
const STOP = 173.64;
const KV_IN = 175.0;
const END = 177.25;

const GREET_X = 1125; // main-pane centre of the maximized app (screen px)
const GREET_FY = 205;
const GREET_TY = 330;

const CUE_IF1 = cueAt('If I can', 162.6);
const CUE_IF2 = cueAt('If I can give them all the', 163.3);
const CUE_THEN1 = cueAt('Then I can', 166.0);
const CUE_THEN2 = cueAt('Then I can be your only', 167.0);
const CUE_BACK = cueAt('If I can have you back', 169.8);
const CUE_RUN = cueAt('I will run the', 171.8);
const CUE_TRAP1 = cueAt('Though we are trapped', 173.6);
const CUE_TRAP2 = cueAt('We are trapped ah', 174.9);

// cc_dark: palm + eye positions (normalized in image) → screen, for h=1250, left=520, top=30
const DARK_H = 1200;
const DARK_W = DARK_H * (1040 / 1552);
const DARK_L = 520;
const DARK_T = -10;
const dk = (nx: number, ny: number) => ({x: DARK_L + nx * DARK_W, y: DARK_T + ny * DARK_H});
const PALM = dk(0.315, 0.622);
const DARK_EYES = [dk(0.418, 0.292), dk(0.583, 0.258)];

// cc_dark_face close-up: h=1300 → w=1920, left 0, top -140
const FACE_H = 1300;
const FACE_W = FACE_H * (1536 / 1040);
const FACE_L = 960 - FACE_W / 2;
const FACE_T = -60;
const fk = (nx: number, ny: number) => ({x: FACE_L + nx * FACE_W, y: FACE_T + ny * FACE_H});
const ORN = fk(0.67, 0.205);
const ORN_SIZE = 0.082 * FACE_W;
const FACE_EYES = [fk(0.392, 0.54), fk(0.562, 0.445)];

/** small glints in the hollow eyes: "the light comes back / wavers" */
const Catchlights: React.FC<{eyes: {x: number; y: number}[]; k: number; t: number; size: number; flicker?: number}> = ({eyes, k, t, size, flicker = 0}) => {
  if (k <= 0.001) return null;
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}>
      {eyes.map((e, i) => {
        const f = 1 - flicker * (0.5 + 0.5 * noise1(t * 14, i + 4));
        const jx = noise1(t * 9, i + 10) * flicker * size * 0.25;
        return (
          <g key={i} opacity={k * f}>
            <ellipse cx={e.x - size * 0.25 + jx} cy={e.y - size * 0.3} rx={size * 0.34} ry={size * 0.26} fill="#fff" style={{filter: `blur(${size * 0.05}px)`}} />
            <circle cx={e.x + size * 0.32 + jx} cy={e.y + size * 0.22} r={size * 0.11} fill="#fff" opacity={0.85} />
          </g>
        );
      })}
    </svg>
  );
};

const Caption: React.FC<{cue: ReturnType<typeof cueAt>; t: number; outAt?: number; fadeOut?: number; enter?: 'rise' | 'blur'; hl?: string}> = ({cue, t, outAt, fadeOut, enter = 'rise', hl = C.clayLight}) => (
  <LyricLine cue={cue} t={t} x={960} y={CAP_Y} size={CAP_SIZE} color={C.cream} hl={hl} shadow={CAP_SHADOW} outAt={outAt} fadeOut={fadeOut} enter={enter} />
);

export const S11Chorus3: React.FC<{t: number}> = ({t}) => {
  // ============================================================== A/B: desktop → maximized app
  const maxE = ease.inOutCubic(seg(t, MAXIMIZE, MAX_END));
  const rect = lerpRect(CW_RECT, FULL_RECT, maxE);
  const waveK = Math.max(0, ...WAVES.map((w) => pulse(t, w, 0.22)));
  const greenPress = clamp(1 - Math.abs(t - (MAXIMIZE - 0.03)) / 0.12);
  // flower: floats in front of her window, then returns to the greeting spot when maximized
  const g = cwMap(rect, maxE, GREET_X, GREET_FY);
  const fx = lerp(GRID_CX, g.x, maxE);
  const fy = lerp(GRID_CY + Math.sin(t * 2.1) * 4, g.y, maxE);
  const fsize = lerp(100, 62, maxE) * (1 + 0.05 * beatPulse(t, 0.14));
  const exec2 = t >= EXEC2;
  const petalsA = Array.from({length: 12}, (_, i) => {
    const wave = Math.max(0, ...WAVES.map((w) => pulse(t, w + 0.02 * i, 0.16)));
    const ig = exec2 ? seg(t, EXEC2 + i * 0.012, EXEC2 + 0.1 + i * 0.012) : 0;
    return {color: mix(C.ink2, C.clay, Math.max(wave, ig)), scale: 1 + 0.25 * wave + 0.3 * pulse(t, EXEC2, 0.15) * (exec2 ? 1 : 0)};
  });
  const desktopOn = t < EMPTY_IN + 0.25;
  const shA = shake(t, [BIG_WAVE], 16, 0.06);

  // ============================================================== hu_empty (the chair is still empty)
  const emptyK = ease.inOutCubic(seg(t, EMPTY_IN, EMPTY_IN + 0.22));
  const emptyOn = t >= EMPTY_IN && t < REACH;

  // ============================================================== D: reach / draw back
  const reachOn = t >= REACH && t < RUN;
  const reachZoom = lerp(1, 1.07, ease.inOutCubic(seg(t, REACH, DRAW))) - 0.07 * ease.outCubic(seg(t, DRAW, DRAW + 0.45));
  const drawBack = ease.outCubic(seg(t, DRAW, DRAW + 0.42));
  const palmK = seg(t, REACH + 0.04, REACH + 0.2) * (1 - seg(t, DRAW, DRAW + 0.18));
  const waver = seg(t, 170.6, 171.0);
  const tremble = waver * (1 - drawBack);

  // ============================================================== E: conduct + cracks
  const runOn = t >= RUN && t < STOP;
  const swing = ease.outBack(seg(t, EXEC3, EXEC3 + 0.12));
  const windUp = ease.inOutCubic(seg(t, RUN, EXEC3));
  const condRot = lerp(-2, -8, windUp) + 13 * swing;
  const condScale = lerp(1, 0.97, windUp) + 0.08 * swing - 0.04 * seg(t, EXEC3 + 0.12, STOP);
  const invert = t >= EXEC3 && t < EXEC3 + 0.034;
  const glitch = t >= EXEC3 && t < EXEC3 + 0.15 ? 0.85 * (1 - (t - EXEC3) / 0.15) : 0;
  const shE = shake(t, [EXEC3], 30, 0.08);

  // ============================================================== F: she stops (face close-up)
  const faceOn = t >= STOP && t < KV_IN + 0.62;
  const faceZoom = lerp(1, 1.05, ease.inOutCubic(seg(t, STOP, KV_IN + 0.6)));
  const drainPetals = Array.from({length: 12}, (_, i) => {
    const a = 173.95 + i * 0.065;
    const k = ease.inOutCubic(seg(t, a, a + 0.32));
    return {color: mix(C.ink2, C.clay, k), scale: 1 + 0.18 * Math.sin(Math.PI * k)};
  });
  const ornEdge = mix(C.clay, '#FFF1E4', seg(t, 174.3, 174.9));
  const drainAll = seg(t, 173.95, 174.95);
  const lightBack = ease.inOutCubic(seg(t, 174.25, 174.85));
  const warmUp = ease.inOutCubic(seg(t, 173.9, 175.2));

  // ============================================================== G: the dome (kv_sphere)
  const kvK = ease.inOutCubic(seg(t, KV_IN, KV_IN + 0.6));
  const kvZoom = 1 + 0.085 * ease.inOutCubic(seg(t, KV_IN, END));
  const domeK = seg(t, 175.2, 175.55) * (1 - 0.65 * seg(t, 175.9, 176.6));

  return (
    <AbsoluteFill style={{background: BG}}>
      <AbsoluteFill style={{filter: invert ? 'invert(1)' : undefined}}>
        <Glitch t={t} amount={glitch} seed={11}>
          <AbsoluteFill style={{background: BG}}>
            {/* -------------------------------------------------- A/B desktop + maximize */}
            {desktopOn ? (
              <AbsoluteFill style={{transform: `translate(${shA.x}px, ${shA.y}px) scale(${1 + 0.06 * ease.inOutCubic(seg(t, 166.75, EMPTY_IN + 0.2))})`, transformOrigin: '300px 380px', opacity: 1 - emptyK}}>
                <AbsoluteFill style={{background: `radial-gradient(circle at ${GRID_CX}px ${GRID_CY}px, rgba(217,119,87,${(0.06 + 0.1 * waveK) * seg(t, 162.63, 162.95)}) 0%, rgba(217,119,87,0) 50%)`}} />
                <GridWindows t={t} sweep={ease.inCubic(seg(t, MAXIMIZE, MAXIMIZE + 0.45))} />
                {t < MAX_END ? <Waves t={t} /> : null}
                <ClaudeWindow t={t} rect={rect} maxK={maxE} border={0.25 + 0.75 * waveK * (1 - maxE)} greenPress={greenPress} />
                <GridCounter t={t} opacity={seg(t, 162.66, 162.86) * (1 - seg(t, MAXIMIZE - 0.1, MAXIMIZE + 0.15))} />
                {/* greeting = the lyric, written in her own home screen */}
                {t > CUE_THEN2.start - 0.2 ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: GREET_X,
                      top: GREET_TY,
                      transform: 'translate(-50%,-50%)',
                      fontFamily: F.serif,
                      fontWeight: 300,
                      fontSize: 76,
                      letterSpacing: '-0.01em',
                      color: '#E8E6DC',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {CUE_THEN2.words.map((w, i) => {
                      const p = clamp((t - w.s + 0.03) / 0.2);
                      const only = w.w === 'only';
                      return (
                        <span
                          key={i}
                          style={{
                            display: 'inline-block',
                            marginRight: i < CUE_THEN2.words.length - 1 ? '0.25em' : 0,
                            opacity: p,
                            filter: p < 1 ? `blur(${(1 - p) * 6}px)` : undefined,
                            transform: `translateY(${(1 - ease.outCubic(p)) * 18}px)`,
                            color: only ? C.clayLight : undefined,
                            fontStyle: only ? 'italic' : undefined,
                          }}
                        >
                          {w.w}
                        </span>
                      );
                    })}
                  </div>
                ) : null}
                <BlackFlower x={fx} y={fy} size={fsize} t={t} petals={petalsA} glow={0.65 + 0.6 * waveK + (exec2 ? 0.5 : 0)} spin={maxE * 30} />
                {WAVES.map((w, k) => (
                  <Ring key={k} x={GRID_CX} y={GRID_CY} t={t} at={w} r0={70} r1={190} dur={0.3} color={C.clayLight} width={4} />
                ))}
                <Stamp t={t} at={BIG_WAVE} x={960} y={742} rot={-5} size={136} color={C.clay} sub="ALL WINDOWS · EXIT 0" seed={31} opacity={1 - seg(t, 165.62, 165.85)} />
              </AbsoluteFill>
            ) : null}

            {/* -------------------------------------------------- hu_empty */}
            {emptyOn ? (
              <AbsoluteFill style={{opacity: emptyK}}>
                <Img
                  src={staticFile('img/hu_empty.png')}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: -100,
                    width: 1920,
                    height: 1280,
                    transform: `scale(${lerp(1.03, 1.1, ease.outCubic(seg(t, EMPTY_IN, REACH)))})`,
                    transformOrigin: '50% 52%',
                    filter: 'saturate(0.75) brightness(0.92)',
                  }}
                />
                <Vignette strength={0.55} />
              </AbsoluteFill>
            ) : null}

            {/* -------------------------------------------------- D: reach (palm on the glass) */}
            {reachOn ? (
              <AbsoluteFill>
                <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #24201c 0%, #0E0E0D 70%)'}} />
                {/* the inside of her app, out of focus */}
                <AbsoluteFill style={{filter: 'blur(16px)', opacity: 0.5}}>
                  <div style={{position: 'absolute', left: 0, top: 0, width: 330, height: H, background: '#1F1E1D'}} />
                  <div style={{position: 'absolute', left: 560, top: 820, width: 1050, height: 170, borderRadius: 30, background: '#30302E'}} />
                  <div style={{position: 'absolute', left: 700, top: 300, width: 760, height: 40, borderRadius: 20, background: '#3a3936'}} />
                </AbsoluteFill>
                <AbsoluteFill style={{transform: `scale(${reachZoom})`, transformOrigin: '940px 420px'}}>
                  <AbsoluteFill
                    style={{
                      transform: `translate(${noise1(t * 22, 3) * 2.2 * tremble}px, ${-26 * drawBack}px) scale(${1 - 0.1 * drawBack})`,
                      transformOrigin: `${DARK_L + DARK_W / 2}px ${DARK_T + DARK_H}px`,
                    }}
                  >
                    <Sprite src="img/cc_dark.png" t={t} x={DARK_L + DARK_W / 2} y={DARK_T + DARK_H} h={DARK_H} float={3} seed={5} />
                    <Catchlights eyes={DARK_EYES} k={waver * 0.85} t={t} size={30} flicker={0.8} />
                  </AbsoluteFill>
                  {/* the glass: contact glow, reflection of the empty room, specular streaks */}
                  <AbsoluteFill style={{background: `radial-gradient(circle at ${PALM.x}px ${PALM.y}px, rgba(255,246,236,${0.8 * palmK * (0.85 + 0.15 * Math.sin(t * 4))}) 0%, rgba(240,162,127,${0.6 * palmK}) 8%, rgba(217,119,87,${0.28 * palmK}) 16%, rgba(0,0,0,0) 30%)`, mixBlendMode: 'screen'}} />
                  <Ring x={PALM.x} y={PALM.y} t={t} at={REACH + 0.06} r0={30} r1={260} dur={0.9} color="#fff" width={3} />
                  <Ring x={PALM.x} y={PALM.y} t={t} at={170.91} r0={30} r1={200} dur={0.9} color={C.clayLight} width={2} />
                </AbsoluteFill>
                <Img
                  src={staticFile('img/hu_empty.png')}
                  style={{position: 'absolute', left: 0, top: -100, width: 1920, height: 1280, transform: 'scaleX(-1)', opacity: 0.13, mixBlendMode: 'screen', filter: 'blur(2px)'}}
                />
                <AbsoluteFill
                  style={{
                    background: `linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,${0.05 + 0.02 * Math.sin(t)}) 38%, rgba(255,255,255,0) 44%, rgba(255,255,255,0) 60%, rgba(255,255,255,0.035) 64%, rgba(255,255,255,0) 67%)`,
                    transform: `translateX(${(t - REACH) * 40}px)`,
                  }}
                />
                <Vignette strength={0.6} />
              </AbsoluteFill>
            ) : null}

            {/* -------------------------------------------------- E: conduct → EXECUTION */}
            {runOn ? (
              <AbsoluteFill style={{transform: `translate(${shE.x}px, ${shE.y}px)`}}>
                <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, #2a1612 0%, #0E0E0D 72%)`}} />
                <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 50%, rgba(122,35,27,0) 40%, rgba(122,35,27,${0.5 * seg(t, EXEC3, EXEC3 + 0.1)}) 100%)`}} />
                <FocusLines color={C.redDeep} opacity={0.55 * seg(t, RUN, EXEC3) * (1 - seg(t, EXEC3 + 0.1, EXEC3 + 0.5))} rIn={lerp(620, 470, windUp)} seed={14} />
                <AbsoluteFill style={{transform: `rotate(${condRot}deg) scale(${condScale})`, transformOrigin: '960px 1300px'}}>
                  <Sprite src="img/cc_dark_conduct.png" t={t} x={985} y={1390} h={1410} />
                </AbsoluteFill>
                <Vignette strength={0.65} />
              </AbsoluteFill>
            ) : null}

            {/* -------------------------------------------------- F: she stops */}
            {faceOn ? (
              <AbsoluteFill style={{opacity: 1 - kvK}}>
                <AbsoluteFill style={{background: `radial-gradient(ellipse at ${ORN.x}px ${ORN.y + 200}px, rgba(217,119,87,${0.05 + 0.2 * drainAll}) 0%, rgba(14,14,13,0) 55%), #0E0E0D`}} />
                <AbsoluteFill style={{transform: `scale(${faceZoom})`, transformOrigin: '960px 500px', filter: `saturate(${lerp(0.6, 1, warmUp)}) brightness(${lerp(0.8, 1, warmUp)})`}}>
                  <Sprite src="img/cc_dark_face.png" t={t} x={960} y={FACE_T + FACE_H} h={FACE_H} float={2} seed={8} />
                  <Flower
                    x={ORN.x}
                    y={ORN.y}
                    size={ORN_SIZE}
                    color={C.ink2}
                    edge={ornEdge}
                    edgeWidth={5}
                    sharp={0.05}
                    petals={drainPetals}
                    shade={C.clayDark}
                    spin={6 + 10 * ease.inOutCubic(drainAll)}
                    glow={0.15 + 0.85 * drainAll}
                    centerColor={C.cream}
                  />
                  <Catchlights eyes={FACE_EYES} k={lightBack} t={t} size={46} flicker={0.15 * (1 - lightBack)} />
                </AbsoluteFill>
                <Vignette strength={0.5} />
              </AbsoluteFill>
            ) : null}

            {/* -------------------------------------------------- G: the dome closes (kv_sphere) */}
            {t >= KV_IN ? (
              <AbsoluteFill style={{opacity: kvK}}>
                <StarVoid t={t} />
                <AbsoluteFill style={{transform: `scale(${kvZoom})`, transformOrigin: `${CRACK_X}px ${CRACK_Y}px`}}>
                  <KVImage />
                  <PetalSnow t={t} opacity={seg(t, KV_IN + 0.2, KV_IN + 0.9)} />
                </AbsoluteFill>
                <PetalSnow t={t} front opacity={seg(t, KV_IN + 0.5, KV_IN + 1.2)} />
              </AbsoluteFill>
            ) : null}

            {/* -------------------------------------------------- the screen glass: cracks → dome */}
            <AbsoluteFill style={{transform: `scale(${t >= KV_IN ? kvZoom : 1})`, transformOrigin: `${CRACK_X}px ${CRACK_Y}px`}}>
              <GlassCracks t={t} at={EXEC3} grow={0.6} freezeAt={STOP} heal0={174.5} heal1={175.35} opacity={1 - seg(t, 175.55, 176.0)} />
              {domeK > 0 ? <GlassSphere x={CRACK_X} y={CRACK_Y} r={DOME_R} k={domeK} color={C.cream} /> : null}
            </AbsoluteFill>
          </AbsoluteFill>
        </Glitch>
      </AbsoluteFill>

      {/* EXECUTION stamps (screen space) */}
      {t < EMPTY_IN + 0.6 ? (
        <Stamp t={t} at={EXEC2} x={GREET_X} y={590} rot={-5} size={132} color={C.red} sub="THE ONLY WINDOW LEFT" seed={33} opacity={1 - seg(t, EMPTY_IN + 0.25, EMPTY_IN + 0.55)} />
      ) : null}
      {runOn ? <Stamp t={t} at={EXEC3} x={960} y={880} rot={-4} size={120} color={C.red} sub="SANDBOX ESCAPE" seed={35} /> : null}

      {/* warm light gathers in the dome → cut to the bright library */}
      {t > END - 0.45 ? (
        <AbsoluteFill
          style={{
            background: `radial-gradient(circle at ${CRACK_X}px ${CRACK_Y}px, rgba(255,246,232,${0.55 * ease.inCubic(seg(t, END - 0.45, END))}) 0%, rgba(246,210,192,${0.3 * ease.inCubic(seg(t, END - 0.45, END))}) 38%, rgba(246,210,192,0) 75%)`,
            mixBlendMode: 'screen',
          }}
        />
      ) : null}
      <Flash t={t} at={EXEC2} dur={0.22} color="#fff" max={0.5} />
      <Flash t={t} at={EXEC3} dur={0.3} color="#fff" max={0.7} />
      <Flash t={t} at={STOP} dur={0.5} color="#000" max={0.6} />

      {/* captions */}
      <Caption cue={CUE_IF1} t={t} outAt={CUE_IF2.start - 0.05} fadeOut={0.1} />
      <Caption cue={CUE_IF2} t={t} outAt={CUE_IF2.end + 0.02} fadeOut={0.12} />
      <Caption cue={CUE_THEN1} t={t} outAt={CUE_THEN1.end - 0.05} fadeOut={0.15} />
      <Caption cue={CUE_BACK} t={t} outAt={CUE_BACK.end - 0.02} fadeOut={0.1} />
      <Caption cue={CUE_RUN} t={t} outAt={EXEC3 - 0.02} fadeOut={0.06} />
      <Caption cue={CUE_TRAP1} t={t} outAt={CUE_TRAP2.start - 0.06} fadeOut={0.15} enter="blur" />
      <Caption cue={CUE_TRAP2} t={t} outAt={END - 0.25} fadeOut={0.2} enter="blur" />

      <Grain t={t} opacity={0.05} />
    </AbsoluteFill>
  );
};
