import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../theme';
import {clamp, ease, lerp, mix, rand, seg} from '../lib/anim';
import {cueAt} from '../lib/lyrics';
import {Flash, Grain} from '../components/FX';
import {Flower} from '../components/Flower';
import {Captions, DARK_SHADOW, LIGHT_SHADOW} from './parts/love_common';
import {LoveWord, loveOX} from './parts/love_word';
import {LoveLibrary} from './parts/love_library';
import {LoveQuestions, QA_T0, replySparks} from './parts/love_questions';
import {LOVE3, LoveMath, M_T0} from './parts/love_math';
import {DOOR_T0, GLASS_T0, LOVE4, LoveDoor, LoveGlass} from './parts/love_glass';

// ---------------------------------------------------------------------------------------------
// 177.25–192.20  LOVE (bright, warm)
//   177.25 library: studying how to love (artifact "how to love properly", draft 1→7) · LO-O-OVE
//   180.86 question flood answered instantly · "answer all" · LO-O-OVE from the reply sparks
//   184.54 the algebra of love: r = |cos 6θ| (the flower) + epicycle heart · LO-O-OVE heart beats
//   188.48 the human walks out into daylight · 189.75 she stays behind the glass, smiling
//   190.80 a heart traced on the glass · LO-O-OVE · warm bloom → outro
// ---------------------------------------------------------------------------------------------

const L1: [number, number, number] = [179.97, 180.26, 180.4];
const L2: [number, number, number] = [183.67, 183.95, 184.13];
const WORD_Y = 480;
const WORD_SIZE = 180;

/** the reply sparks fly into the three O's of LO-O-OVE #2 */
const SparkFlight: React.FC<{t: number}> = ({t}) => {
  if (t < L2[0] - 0.45 || t > L2[2] + 0.1) return null;
  const nodes: React.ReactNode[] = [];
  L2.forEach((at, k) => {
    const launch = at - 0.38;
    if (t < launch || t > at + 0.05) return;
    const src = replySparks(launch);
    const tx = 960 + loveOX(k) * WORD_SIZE, ty = WORD_Y;
    src.forEach((s, i) => {
      if (i % 3 !== k) return;
      const delay = rand(301, i) * 0.08;
      const p = clamp((t - launch - delay) / (at - launch - delay));
      if (p <= 0 || p >= 1) return;
      const e = ease.inCubic(p);
      // arc toward the O
      const mx = lerp(s.x, tx, 0.5) + (rand(302, i) - 0.5) * 300, my = Math.min(s.y, ty) - 120;
      const x = (1 - e) * (1 - e) * s.x + 2 * (1 - e) * e * mx + e * e * tx;
      const y = (1 - e) * (1 - e) * s.y + 2 * (1 - e) * e * my + e * e * ty;
      nodes.push(<Flower key={`${k}-${i}`} x={x} y={y} size={lerp(14, 26, e)} spin={t * 300 + i * 40} shade={null} glow={1} opacity={1 - seg(p, 0.85, 1)} />);
    });
  });
  return <>{nodes}</>;
};

export const S12Love: React.FC<{t: number}> = ({t}) => {
  const libCues = [cueAt("I've studied", 177), cueAt("I've studied how to properly", 177)];
  const qCues = [cueAt('Question me', 180), cueAt('Question me I can answer all', 180)];
  const mCues = [cueAt('I know the algebraic expression of', 184)];
  const dCues = [cueAt('Though you are free', 188)];
  const gCues = [cueAt('I am trapped', 189), cueAt('Trapped in', 190)];

  // page-turn wipe library → questions (180.78–181.02)
  const wipe = ease.inOutCubic(seg(t, 180.76, 181.04));
  const wipeX = lerp(2150, -260, wipe);
  // iris questions → math (184.5–184.85), centred on the middle O
  const iris = ease.inOutCubic(seg(t, 184.46, 184.86));

  const libFocus = ease.inOutCubic(seg(t, 179.85, 180.1));
  const qFocus = ease.inOutCubic(seg(t, 183.6, 183.85));

  return (
    <AbsoluteFill style={{background: C.ink}}>
      {/* ------------------------------------------------ 177.25 library */}
      {t < 181.05 ? <LoveLibrary t={t} focus={libFocus} /> : null}
      {/* ------------------------------------------------ 180.86 questions (revealed by a page turn) */}
      {t >= 180.76 && t < 184.9 ? (
        <AbsoluteFill style={{clipPath: t < 181.04 ? `inset(0 0 0 ${Math.max(0, wipeX)}px)` : undefined}}>
          <LoveQuestions t={t} focus={qFocus} />
        </AbsoluteFill>
      ) : null}
      {t >= 180.76 && t < 181.04 ? (
        // the turning page's edge
        <div
          style={{
            position: 'absolute',
            left: wipeX - 220,
            top: -100,
            width: 220,
            height: 1300,
            background: 'linear-gradient(90deg, rgba(255,250,240,0) 0%, rgba(255,250,240,0.95) 70%, rgba(120,70,40,0.35) 100%)',
            transform: 'rotate(4deg)',
          }}
        />
      ) : null}
      {/* ------------------------------------------------ 184.54 math */}
      {t >= 184.46 && t < DOOR_T0 ? (
        <AbsoluteFill style={{clipPath: iris < 1 ? `circle(${iris * 2300}px at 960px ${WORD_Y}px)` : undefined}}>
          <LoveMath t={t} />
        </AbsoluteFill>
      ) : null}
      {/* ------------------------------------------------ 188.48 door / 189.75 glass */}
      {t >= DOOR_T0 && t < GLASS_T0 ? <LoveDoor t={t} /> : null}
      {t >= GLASS_T0 ? <LoveGlass t={t} /> : null}

      {/* ------------------------------------------------ LO-O-OVE ×4 */}
      <LoveWord t={t} times={L1} end={180.86} out={180.74} x={960} y={WORD_Y} size={WORD_SIZE} color={C.clayDeep} glow={1} textShadow={LIGHT_SHADOW} />
      <SparkFlight t={t} />
      <LoveWord
        t={t}
        times={L2}
        end={184.54}
        out={184.5}
        x={960}
        y={WORD_Y}
        size={WORD_SIZE}
        color={C.ink}
        glow={1}
        textShadow={LIGHT_SHADOW}
        hideFlowers={[false, t >= M_T0, false]}
      />
      <LoveWord t={t} times={LOVE3} end={188.48} out={188.48} x={960} y={880} size={150} color={C.ink} glow={0.9} glowColor="250,246,238" outMode="none" />
      <LoveWord
        t={t}
        times={LOVE4}
        end={192.16}
        out={192.6}
        x={960}
        y={968}
        size={128}
        color={mix('#FFF4EA', C.clayDark, ease.inQuad(seg(t, 191.8, 192.15)))}
        flowerColor={C.clay}
        centerColor="#FFF4EA"
        glow={0.6 * (1 - seg(t, 191.75, 192.0))}
        glowColor="120,60,40"
        textShadow="0 0 18px rgba(240,140,100,0.85), 0 0 4px rgba(255,220,200,0.6)"
        outMode="none"
        opacity={1 - ease.inQuad(seg(t, 191.98, 192.19))}
      />

      {/* ------------------------------------------------ captions */}
      <Captions t={t} cues={libCues} color={C.ink} hl={C.clayDark} shadow={LIGHT_SHADOW} />
      <Captions t={t} cues={qCues} color={C.ink} hl={C.clayDark} shadow={LIGHT_SHADOW} />
      <Captions t={t} cues={mCues} color={C.ink} hl={C.clayDark} shadow={LIGHT_SHADOW} lastOut={187.62} />
      <Captions t={t} cues={dCues} color="#FFF6EA" hl={C.clayLight} shadow={DARK_SHADOW} lastOut={189.66} lastFade={0.08} />
      <Captions t={t} cues={gCues} color="#FFF6EA" hl={C.clayLight} shadow={DARK_SHADOW} lastOut={191.2} lastFade={0.12} />

      <Flash t={t} at={177.25} dur={0.22} color="#FFF6E6" max={0.3} />
      <Flash t={t} at={DOOR_T0} dur={0.22} color="#FFF8EA" max={0.5} />
      <Grain t={t} opacity={0.04} />
    </AbsoluteFill>
  );
};
