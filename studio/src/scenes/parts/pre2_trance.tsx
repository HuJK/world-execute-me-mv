import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F, H, W} from '../../theme';
import {clamp, ease, lerp, mix, pulse, rand, seg} from '../../lib/anim';
import {beatPulse} from '../../lib/audio';
import {Flower} from '../../components/Flower';
import {Ring} from '../../components/FX';
import {Cap} from './pre2_common';

// ------------------------------------------------------------------------------------------
// 99.35–103.49  "So we can enter / The trance the trance": a 12-fold kaleidoscope of cc_trance.
// Back layer = true wedge mirror (rotate k·30°, odd wedges mirrored); front = a ring of 12
// dancers forming the flower's petals; lyric tokens orbit; slow, dreamy, colour-cycling.
// ------------------------------------------------------------------------------------------

const T0 = 99.35;
const T_THE = 101.52;
const T_TR1 = 101.7;
const T_TR2 = 102.6;
const T_END = 103.49;
const CX = 960, CY = 520;
const TRANCE_AR = 1040 / 1528;

const CYCLE = [C.clay, C.pink, C.gold, '#9C8FD0', C.blue, C.clayLight];
const cycleColor = (x: number) => {
  const n = CYCLE.length;
  const i = Math.floor(((x % n) + n) % n);
  return mix(CYCLE[i], CYCLE[(i + 1) % n], ((x % 1) + 1) % 1);
};

/** what one wedge "sees": slowly drifting dancer + petals, drawn around the centre */
const WedgeSource: React.FC<{t: number}> = ({t}) => {
  const h = 980;
  const w = h * TRANCE_AR;
  const drift = (t - T0) * 9;
  const off = 260 + 80 * Math.sin((t - T0) * 0.9);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: CX - w / 2,
          top: CY - off - h * 0.62,
          width: w,
          height: h,
          transform: `rotate(${drift}deg)`,
          transformOrigin: `50% ${(h * 0.62 + off) / h * 100}%`,
        }}
      >
        <Img src={staticFile('img/cc_trance.png')} style={{width: '100%', height: '100%'}} />
      </div>
      {Array.from({length: 7}, (_, i) => {
        const r = 120 + ((i * 97 + (t - T0) * 60) % 520);
        const a = (rand(91, i) - 0.5) * 0.5;
        return (
          <div key={i} style={{position: 'absolute', left: CX + Math.sin(a) * r, top: CY - Math.cos(a) * r}}>
            <Flower size={18 + rand(92, i) * 26} spin={t * 30 + i * 40} color={i % 2 ? C.clayLight : C.cream} centerColor={C.clay} shade={null} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Kaleido: React.FC<{t: number; opacity: number; hue: number}> = ({t, opacity, hue}) => {
  const R = 1400;
  const half = (15 * Math.PI) / 180;
  const p1 = `${CX + Math.sin(-half) * R}px ${CY - Math.cos(-half) * R}px`;
  const p2 = `${CX + Math.sin(half) * R}px ${CY - Math.cos(half) * R}px`;
  const clip = `polygon(${CX}px ${CY}px, ${p1}, ${p2})`;
  return (
    <AbsoluteFill style={{opacity, filter: `hue-rotate(${hue}deg) saturate(0.85) brightness(0.8) blur(1.2px)`}}>
      {Array.from({length: 12}, (_, k) => (
        <AbsoluteFill key={k} style={{transform: `rotate(${k * 30}deg)`, transformOrigin: `${CX}px ${CY}px`}}>
          <AbsoluteFill style={{clipPath: clip}}>
            <AbsoluteFill style={{transform: k % 2 ? 'scaleX(-1)' : undefined, transformOrigin: `${CX}px ${CY}px`}}>
              <WedgeSource t={t} />
            </AbsoluteFill>
          </AbsoluteFill>
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};

/** ring of dancers = the petals of the flower (feet to the centre) */
const DancerRing: React.FC<{t: number; r0: number; h: number; rot: number; appear: number; stagger: number; opacity?: number; seed?: number; flipAll?: boolean}> = ({
  t,
  r0,
  h,
  rot,
  appear,
  stagger,
  opacity = 1,
  seed = 0,
  flipAll = false,
}) => {
  const w = h * TRANCE_AR;
  return (
    <>
      {Array.from({length: 12}, (_, k) => {
        const at = appear + k * stagger;
        const p = ease.outBack(seg(t, at, at + 0.35));
        if (p <= 0.001) return null;
        const a = k * 30 + rot;
        const mirror = (k % 2 === 1) !== flipAll;
        const sway = Math.sin(t * 2.2 + k * 0.9 + seed) * 4;
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              left: CX - w / 2,
              top: CY - r0 - h,
              width: w,
              height: h,
              transformOrigin: `50% ${((r0 + h) / h) * 100}%`,
              transform: `rotate(${a + sway}deg) scale(${p})`,
              opacity: opacity * clamp(p * 2),
            }}
          >
            <Img src={staticFile('img/cc_trance.png')} style={{width: '100%', height: '100%', transform: mirror ? 'scaleX(-1)' : undefined}} />
          </div>
        );
      })}
    </>
  );
};

const TOKENS: [string, number][] = [
  ['▁So', 99.35],
  ['▁we', 99.76],
  ['▁can', 100.24],
  ['▁enter', 100.88],
  ['▁The', 101.52],
  ['▁trance', 101.7],
  ['▁the', 102.26],
  ['▁trance', 102.6],
];

export const TranceShot: React.FC<{t: number}> = ({t}) => {
  if (t < T0 - 0.05 || t >= T_END) return null;
  const k = t - T0;
  const iris = ease.inOutCubic(seg(t, T0 - 0.05, T0 + 0.45));
  const hue = -14 + 16 * Math.sin(k * 0.9);
  const glowCol = cycleColor(k * 0.45);
  const glowCol2 = cycleColor(k * 0.45 + 2.5);
  // build-up into the centre at the end
  const dive = ease.inCubic(seg(t, 102.95, T_END));
  const breathe = 1 + 0.05 * pulse(t, T_TR1, 0.5) + 0.05 * pulse(t, T_TR2, 0.5) + 0.012 * beatPulse(t, 0.2);
  const camS = lerp(1.0, 1.12, ease.inOutCubic(seg(t, T0, 102.9))) * breathe * (1 + dive * 2.4);
  const spin = k * 7 + dive * 140;
  const outerK = ease.outCubic(seg(t, T_TR1 - 0.1, T_TR1 + 0.6));
  return (
    <AbsoluteFill style={{clipPath: `circle(${iris * 120}% at 50% 50%)`, background: C.ink}}>
      {/* colour-cycling dream light */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, ${glowCol} 0%, ${mix(glowCol2, C.ink, 0.45)} 38%, ${C.ink} 78%)`,
          opacity: 0.85,
        }}
      />
      <AbsoluteFill style={{transform: `scale(${camS}) rotate(${spin}deg)`, transformOrigin: `${CX}px ${CY}px`}}>
        <Kaleido t={t} opacity={0.3 + 0.1 * Math.sin(k * 1.3)} hue={hue} />
        {/* mandala lines */}
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity: 0.5}}>
          {Array.from({length: 12}, (_, i) => {
            const a = ((i * 30 + 15) * Math.PI) / 180;
            return <line key={i} x1={CX} y1={CY} x2={CX + Math.sin(a) * 1200} y2={CY - Math.cos(a) * 1200} stroke={C.cream} strokeWidth={1.2} opacity={0.4} />;
          })}
          {[150, 330, 520].map((r, i) => (
            <circle key={i} cx={CX} cy={CY} r={r * (1 + 0.02 * Math.sin(t * 2 + i))} fill="none" stroke={C.cream} strokeWidth={1.4} strokeDasharray="3 9" opacity={0.6} />
          ))}
        </svg>
        {/* outer counter-rotating ring (second "trance") */}
        {outerK > 0 ? (
          <AbsoluteFill style={{transform: `rotate(${-k * 16 + 15}deg)`, transformOrigin: `${CX}px ${CY}px`, opacity: 0.55 * outerK}}>
            <DancerRing t={t} r0={470} h={340} rot={0} appear={T_TR1 - 0.1} stagger={0.03} seed={3} flipAll />
          </AbsoluteFill>
        ) : null}
        {/* the dancers are the petals: a regular 12-petal bloom behind them */}
        <Flower
          x={CX}
          y={CY}
          size={lerp(200, 540, ease.outCubic(seg(t, T0, T0 + 1.2)))}
          regular
          open={1}
          showCenter={false}
          shade={null}
          color={mix(C.clay, glowCol, 0.4)}
          opacity={0.38}
          petals={Array.from({length: 12}, (_, i) => ({scale: ease.outBack(seg(t, T0 + 0.05 + i * 0.1, T0 + 0.4 + i * 0.1)), width: 1.25}))}
        />
        <DancerRing t={t} r0={170} h={285} rot={0} appear={T0 + 0.05} stagger={0.1} />
        {/* centre flower */}
        <Flower
          x={CX}
          y={CY}
          size={lerp(30, 104, ease.outBack(seg(t, T0, T0 + 0.6)))}
          open={1}
          spin={-k * 30}
          glow={0.8 + 0.6 * pulse(t, T_TR1, 0.4) + 0.6 * pulse(t, T_TR2, 0.4)}
          glowColor={glowCol}
          petals={Array.from({length: 12}, (_, i) => ({color: mix(C.clay, glowCol, 0.35 + 0.35 * Math.sin(t * 3 + i * 0.52))}))}
        />
      </AbsoluteFill>
      {/* lyric tokens orbiting (they stream on the sung words) */}
      <AbsoluteFill style={{transform: `scale(${1 + dive * 1.5})`, transformOrigin: `${CX}px ${CY}px`, opacity: 1 - dive}}>
        {TOKENS.map(([tok, at], i) => {
          if (t < at) return null;
          const a = (i / TOKENS.length) * Math.PI * 2 - (t - at) * 0.35 - Math.PI / 2 + 0.3;
          const rr = lerp(140, 470 + (i % 2) * 40, ease.outCubic(seg(t, at, at + 0.6)));
          const p = clamp((t - at) / 0.2);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: CX + Math.cos(a) * rr * 1.45,
                top: CY + Math.sin(a) * rr * 0.92,
                transform: `translate(-50%,-50%) scale(${0.6 + 0.4 * p})`,
                fontFamily: F.mono,
                fontSize: 26,
                fontWeight: 700,
                color: C.ink,
                background: 'rgba(250,249,245,0.88)',
                padding: '4px 12px',
                borderRadius: 8,
                opacity: p * 0.9,
                whiteSpace: 'pre',
                boxShadow: `0 0 18px ${glowCol}`,
              }}
            >
              {tok}
            </div>
          );
        })}
      </AbsoluteFill>
      <Ring x={CX} y={CY} t={t} at={T_TR1} r0={110} r1={900} color={C.cream} width={5} dur={0.9} />
      <Ring x={CX} y={CY} t={t} at={T_TR2} r0={110} r1={900} color={glowCol} width={5} dur={0.9} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(20,20,19,0.65) 100%)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(transparent 78%, rgba(20,20,19,0.8))'}} />
      <Cap t={t} text="So we can enter" italic color={C.cream} hl={C.clayLight} shadow="0 0 18px rgba(20,20,19,0.9)" />
      <Cap t={t} text="The trance the trance" italic color={C.cream} hl={C.clayLight} shadow="0 0 18px rgba(20,20,19,0.9)" outAt={103.3} />
      {/* white-out into the chorus */}
      <AbsoluteFill style={{background: C.paper, opacity: ease.inCubic(seg(t, 103.22, T_END))}} />
    </AbsoluteFill>
  );
};
