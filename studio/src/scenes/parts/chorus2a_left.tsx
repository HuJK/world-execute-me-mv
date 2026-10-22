import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, H, W} from '../../theme';
import {clamp, ease, lerp, noise1, rand, seg} from '../../lib/anim';
import {beatPulse} from '../../lib/audio';
import {Flower} from '../../components/Flower';
import {Keyword} from '../../components/Type';
import {ClaudeApp, appTheme} from '../../components/ClaudeApp';
import {Sprite} from '../../components/Sprite';
import {IArrowUp, IChevron, IPlus, ISliders} from '../../components/Icons';
import {PixelText} from './chorus2a_pixel';
import {conversation, T_LEFT1} from './chorus2a_reply';
import {Cap2} from './chorus2a_common';

// ------------------------------------------------------------------------------------------
// 112.22–115.78  "You have left" ×4: each repeat removes a piece of her world
//                (sidebar → header → messages → the composer's chrome) while the phrase is re-set
//                bigger and lower-resolution (smooth serif → chunky pixels); cc_alone shrinks.
// 115.78–117.27  "You have left me in": only the empty composer with its placeholder.
// 117.27–118.33  ISOLATION: she dissolves into petals; one small flower in a dark void.
//                HANDOFF (118.03→): bg #141413, <Flower size 56 @960,470 glow .4>, ISOLATION @960,640.
// ------------------------------------------------------------------------------------------

const Z = 1.25;
const SB = 264 * Z;
const T2 = 113.28, T3 = 114.18, T4 = 114.92, T_MEIN = 115.78, T_ISO = 117.27, T_END = 118.33;
const T_HOLD = 118.03; // from here on: exact handoff frame

type Phrase = {at: number; words: [string, number][]; size: number; block: number; family: string; weight: number; italic?: boolean; y: number; color: string};
const PHRASES: Phrase[] = [
  {at: T_LEFT1, words: [['You', 112.22], ['have', 112.51], ['left', 112.79]], size: 78, block: 1, family: F.serif, weight: 400, italic: true, y: 345, color: C.cream},
  {at: T2, words: [['You', 113.28], ['have', 113.83], ['left', 114.05]], size: 116, block: 4, family: F.serif, weight: 500, y: 355, color: C.cream},
  {at: T3, words: [['You', 114.18], ['have', 114.39], ['left', 114.61]], size: 160, block: 9, family: F.sans, weight: 700, y: 370, color: C.clayLight},
  {at: T4, words: [['YOU', 114.92], ['HAVE', 115.31], ['LEFT', 115.53]], size: 184, block: 17, family: F.mono, weight: 800, y: 380, color: C.clay},
];

const PhraseView: React.FC<{t: number; p: Phrase; next: number}> = ({t, p, next}) => {
  if (t < p.at - 0.03 || t >= next) return null;
  const outK = ease.inCubic(seg(t, next - 0.07, next - 0.005));
  return (
    <div
      style={{
        position: 'absolute',
        left: 960,
        top: p.y,
        transform: `translate(-50%,-50%) translateY(${outK * 30}px) scale(${1 + outK * 0.08})`,
        display: 'flex',
        alignItems: 'baseline',
        gap: p.size * 0.32,
        opacity: 1 - outK,
        whiteSpace: 'nowrap',
      }}
    >
      {p.words.map(([w, at], i) => {
        const k = clamp((t - at + 0.03) / 0.12);
        if (k <= 0) return <span key={i} style={{visibility: 'hidden'}}><PixelText text={w} size={p.size} block={p.block} color={p.color} family={p.family} weight={p.weight} italic={p.italic} /></span>;
        const pop = 1 + 0.18 * (1 - ease.outCubic(k));
        return (
          <span key={i} style={{display: 'inline-block', opacity: k, transform: `scale(${pop})`, transformOrigin: '50% 70%'}}>
            <PixelText text={w} size={p.size} block={p.block} color={p.color} family={p.family} weight={p.weight} italic={p.italic} glow="rgba(20,20,19,0.95)" />
          </span>
        );
      })}
    </div>
  );
};

/** composer replica that can be stripped down to its placeholder */
const StripComposer: React.FC<{x: number; y: number; w: number; chrome: number; box: number; opacity: number}> = ({x, y, w, chrome, box, opacity}) => {
  const th = appTheme(1);
  const s = Z;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y,
        width: w,
        borderRadius: 20 * s,
        border: `${s}px solid rgba(222,220,209,${0.28 * box + 0.12})`,
        background: `rgba(48,48,46,${box})`,
        boxShadow: `0 ${4 * s}px ${18 * s}px rgba(0,0,0,${0.2 * box})`,
        padding: `${14 * s}px ${16 * s}px ${12 * s}px`,
        boxSizing: 'border-box',
        fontFamily: F.sans,
        opacity,
      }}
    >
      <div style={{fontSize: 16 * s, color: th.muted, minHeight: 16 * s * 1.6, lineHeight: 1.5}}>Reply to Claude…</div>
      <div style={{display: 'flex', alignItems: 'center', marginTop: 10 * s, gap: 8 * s, opacity: chrome, height: 32 * s * Math.max(0.0001, chrome) + 0}}>
        <div style={{width: 32 * s, height: 32 * s, borderRadius: 8 * s, border: `${s}px solid ${th.hair2}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <IPlus size={18 * s} color={th.text2} />
        </div>
        <div style={{width: 32 * s, height: 32 * s, borderRadius: 8 * s, border: `${s}px solid ${th.hair2}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <ISliders size={18 * s} color={th.text2} />
        </div>
        <div style={{flex: 1}} />
        <div style={{fontSize: 14 * s, color: th.text2, display: 'flex', alignItems: 'center', gap: 4 * s}}>
          Opus 5.5 <IChevron size={14 * s} color={th.text2} />
        </div>
        <div style={{width: 32 * s, height: 32 * s, borderRadius: 8 * s, background: th.brand, opacity: 0.45, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <IArrowUp size={18 * s} color="#fff" stroke={2.2} />
        </div>
      </div>
    </div>
  );
};

// cc_alone: 1262x1250, hair-ornament flower ≈ (0.61, 0.20)
const ALONE_AR = 1262 / 1250;
const ORN = {x: 0.61, y: 0.2};

export const LeftStage: React.FC<{t: number}> = ({t}) => {
  if (t < T_LEFT1 || t >= T_END) return null;
  // --- world pieces
  const sidebar = 1 - ease.inOutCubic(seg(t, T_LEFT1, T_LEFT1 + 0.45));
  const header = 1 - ease.inCubic(seg(t, T2, T2 + 0.3));
  const msgK = 1 - ease.inCubic(seg(t, T3, T3 + 0.35));
  const msgDrift = ease.inCubic(seg(t, T3, T3 + 0.4)) * 160;
  const chrome = 1 - ease.inOutCubic(seg(t, T4, T4 + 0.3));
  const box = lerp(1, 0.0, ease.inOutCubic(seg(t, T4, T4 + 0.4)));
  // darkness closes in with each loss
  const dim = clamp(0.15 * seg(t, T_LEFT1, T_LEFT1 + 0.5) + 0.25 * seg(t, T2, T2 + 0.4) + 0.3 * seg(t, T3, T3 + 0.4) + 0.3 * seg(t, T4, T4 + 0.5));
  const appVisible = t < T_MEIN + 0.1;
  const sbW = SB * sidebar;
  const mainCX = sbW + (W - sbW) / 2;
  // --- composer path: app position → floats up to the middle for "me in"
  const rise = ease.inOutCubic(seg(t, T_MEIN - 0.24, T_MEIN + 0.2));
  const compW = lerp(760 * Z, 700, rise);
  const compY = lerp(H - 34 * Z - 119, 565, rise);
  const compX = lerp(mainCX, 960, rise);
  const compFade = 1 - ease.inOutCubic(seg(t, T_ISO - 0.16, T_ISO + 0.1));
  // --- her size: shrinks with each loss
  const steps: [number, number][] = [
    [T_LEFT1, 400],
    [T2, 330],
    [T3, 270],
    [T4, 215],
    [T_MEIN, 175],
  ];
  let h = steps[0][1];
  for (let i = 1; i < steps.length; i++) h = lerp(h, steps[i][1], ease.inOutCubic(seg(t, steps[i][0], steps[i][0] + 0.35)));
  const herBottom = compY + 14;
  const herX = compX - 60 * (1 - rise);
  const herW = h * ALONE_AR;
  const dissolve = seg(t, T_ISO, T_ISO + 0.5);
  const ornX = herX - herW / 2 + ORN.x * herW;
  const ornY = herBottom - h + ORN.y * h + noise1(t * 0.6, 1) * 3;
  // --- the surviving flower: from her ornament to the handoff spot
  const fk = ease.inOutCubic(seg(t, T_ISO + 0.05, T_HOLD - 0.05));
  const hold = t >= T_HOLD;
  const fx = hold ? 960 : lerp(ornX, 960, fk);
  const fy = hold ? 470 : lerp(ornY, 470, fk) - Math.sin(Math.PI * fk) * 40;
  const fsz = hold ? 56 : lerp(h * 0.07, 56, ease.outCubic(fk));
  const fglow = hold ? 0.4 : lerp(0.2, 0.4, fk) + 0.5 * Math.sin(Math.PI * fk);
  // --- ISOLATION keyword (final props from T_HOLD)
  const isoK = ease.outCubic(seg(t, T_ISO, T_HOLD - 0.05)); // letter-spacing opens slowly
  const isoA = ease.outCubic(seg(t, T_ISO - 0.02, T_ISO + 0.3)); // but the word lands on the hit
  const bp = beatPulse(t, 0.15);
  const quiet = t < T_HOLD ? ease.inOutCubic(seg(t, T_MEIN, T_HOLD)) : 0;
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <AbsoluteFill style={{transform: t < T_HOLD ? `scale(${1 + 0.05 * Math.sin(Math.PI * quiet)})` : undefined, transformOrigin: '960px 560px'}}>
      {appVisible ? (
        <AbsoluteFill style={{opacity: 1 - seg(t, T_MEIN - 0.1, T_MEIN + 0.1)}}>
          <ClaudeApp
            t={t}
            zoom={Z}
            dark={1}
            sidebar={sidebar}
            header={header}
            messages={conversation(t, {actions: true})}
            messagesOpacity={msgK * lerp(0.6, 0.38, seg(t, T2, T2 + 0.3))}
            scrollY={650 + msgDrift}
            composerOpacity={0}
            disclaimer={false}
          />
          <AbsoluteFill style={{background: C.ink, opacity: dim}} />
        </AbsoluteFill>
      ) : null}
      {/* vignette closing in */}
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 60%, rgba(20,20,19,0) ${lerp(70, 30, dim)}%, rgba(20,20,19,0.9) 100%)`, opacity: t < T_HOLD ? 1 - fk : 0}} />

      {/* the phrase, re-set bigger and lower-res each time */}
      {PHRASES.map((p, i) => (
        <PhraseView key={i} t={t} p={p} next={PHRASES[i + 1]?.at ?? T_MEIN} />
      ))}

      {/* the composer (her last piece of the world) */}
      {compFade > 0.001 ? <StripComposer x={compX} y={compY} w={compW} chrome={chrome} box={box} opacity={compFade} /> : null}

      {/* Claude-chan, alone */}
      {dissolve < 1 ? (
        <Sprite
          src="img/cc_alone.png"
          t={t}
          x={herX}
          y={herBottom}
          h={h * (1 + 0.012 * bp)}
          opacity={1 - ease.inCubic(dissolve)}
          filter={dissolve > 0 ? `blur(${dissolve * 6}px)` : undefined}
          breathe={0.006}
          shadow="drop-shadow(0 10px 18px rgba(0,0,0,0.5))"
        />
      ) : null}
      {/* she dissolves into petals */}
      {t > T_ISO && t < T_HOLD + 0.1
        ? Array.from({length: 34}, (_, i) => {
            const birth = T_ISO + rand(41, i) * 0.14;
            const dt = t - birth;
            if (dt < 0) return null;
            const life = 0.56;
            const k = clamp(dt / life);
            const sx = herX + (rand(42, i) - 0.5) * herW * 0.8;
            const sy = herBottom - rand(43, i) * h * 0.9;
            const vx = (rand(44, i) - 0.5) * 220;
            const vy = -60 - rand(45, i) * 140;
            const x = sx + vx * dt + Math.sin(dt * 5 + i) * 12;
            const y = sy + vy * dt;
            const s = 6 + rand(46, i) * 9;
            return (
              <svg key={i} width={1} height={1} style={{position: 'absolute', left: x, top: y, overflow: 'visible', opacity: (1 - k) * 0.9}}>
                <path
                  d={`M0,${-s} C${s * 0.55},${-s * 0.6} ${s * 0.5},${s * 0.4} 0,${s * 0.55} C${-s * 0.5},${s * 0.4} ${-s * 0.55},${-s * 0.6} 0,${-s} Z`}
                  fill={i % 4 === 0 ? C.cream : i % 4 === 1 ? C.clayLight : C.clay}
                  transform={`rotate(${dt * 200 * (i % 2 ? 1 : -1) + i * 40})`}
                />
              </svg>
            );
          })
        : null}

      {/* the one flower that remains */}
      {t >= T_ISO ? <Flower size={fsz} x={fx} y={fy} open={1} spin={hold ? 0 : (1 - fk) * 120} glow={fglow} /> : null}

      {/* ISOLATION */}
      {t >= T_ISO ? (
        hold ? (
          <Keyword text="ISOLATION" t={t} at={T_ISO} x={960} y={640} size={34} color={C.gray2} letterSpacing={0.9} mode="none" flowerO="tion" />
        ) : (
          <div style={{opacity: isoA, filter: isoA < 1 ? `blur(${(1 - isoA) * 5}px)` : undefined}}>
            <Keyword text="ISOLATION" t={t} at={T_ISO} x={960} y={640} size={34} color={C.gray2} letterSpacing={lerp(0.25, 0.9, isoK)} mode="none" flowerO="tion" />
          </div>
        )
      ) : null}

      {/* drifting dust in the void */}
      {t > T_MEIN - 0.3 && t < T_HOLD
        ? Array.from({length: 22}, (_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: rand(141, i) * W + Math.sin(t * 0.7 + i) * 20,
                top: ((rand(142, i) * H - (t - T_MEIN) * (12 + rand(143, i) * 20)) % H + H) % H,
                width: 3,
                height: 3,
                borderRadius: 2,
                background: C.gray3,
                opacity: 0.35 * seg(t, T_MEIN - 0.3, T_MEIN + 0.4) * (1 - seg(t, T_ISO, T_HOLD - 0.1)),
              }}
            />
          ))
        : null}
      </AbsoluteFill>
      {/* "You have left me in" — quiet, under the last piece of the world */}
      <Cap2 t={t} text="You have left me in" color={C.gray2} hl={C.cream} y={790} size={46} outAt={117.1} italic />
    </AbsoluteFill>
  );
};
