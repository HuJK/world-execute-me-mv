import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, H, W} from '../../theme';
import {clamp, ease, lerp, pulse, seg, springy} from '../../lib/anim';
import {kickPulse} from '../../lib/audio';
import {Flower} from '../../components/Flower';
import {Keyword} from '../../components/Type';
import {ClaudeApp, DEFAULT_RECENTS} from '../../components/ClaudeApp';
import {Cursor, Flash, PetalField, RayBurst, Ring} from '../../components/FX';
import {SPINNER_GLYPHS} from '../../components/Icons';

// ---------------------------------------------------------------------------------------------
// 204.9–212.33  OUTRO part 2
//   204.9  match cut: the sleeping bud is the greeting flower of a fresh claude.ai home screen
//   205.2  the human is back: the blue caret blinks, "hi" · 205.81 Enter →
//   205.93 the flower snaps into full bloom · E-XE-CU-TI✿N (sung 205.93–207.03) → world.execute(me);
//   207.1  end card on black, fade out by 212.3
// ---------------------------------------------------------------------------------------------

const Z = 1.25;
const GF = {x: 975, y: 356}; // greeting flower centre in the home screen (zoom 1.25)
const SEND = 205.81;
const TYPE_A = 205.5, TYPE_B = 205.64;
const SYL: [string, number, number][] = [
  // text, char index, sung time
  ['E', 0, 205.95],
  ['XE', 1, 206.24],
  ['CU', 3, 206.52],
  ['TION', 5, 206.8],
];
const MORPH = 207.03;
const END = 212.32;

/** where the field's hero bud was when we cut (passed in from the field) */
export type BudPose = {x: number; y: number; rs: number};

const Home: React.FC<{t: number; bud: BudPose}> = ({t, bud}) => {
  // zoom out from the bud (which IS the greeting flower) to the full home screen
  const zk = ease.inOutCubic(seg(t, 204.98, 205.4));
  const s0 = bud.rs / (19 * Z);
  const s = Math.exp(lerp(Math.log(s0), 0, zk));
  const tx = lerp(bud.x, GF.x, zk), ty = lerp(bud.y, GF.y, zk);
  // after Enter: zoom into the blooming flower
  const zin = ease.inExpo(seg(t, SEND + 0.03, SEND + 0.16));
  const S = s * (1 + zin * 9);
  const bloom = t >= SEND ? springy(t - SEND, 2.6, 6) : 0;
  const stir = lerp(0.1, 0.32, ease.inOutCubic(seg(t, 205.05, 205.6))); // she stirs when someone arrives
  const open = lerp(stir, 1, clamp(bloom, 0, 1.15));
  const appK = seg(t, 204.92, 205.1);
  const typing = t >= TYPE_A;
  // the human's cursor
  const cur = ease.outCubic(seg(t, 205.12, 205.36));
  const curX = lerp(1500, 860, cur), curY = lerp(820, 470, cur);
  const press = t > 205.38 ? clamp(1 - (t - 205.38) / 0.22) : 0;
  const push = lerp(1, 1.32, ease.inOutCubic(seg(t, 205.3, 205.8)));
  return (
    <AbsoluteFill style={{transformOrigin: '1125px 440px', transform: `scale(${push})`}}>
    <AbsoluteFill
      style={{
        transformOrigin: '0 0',
        transform: `translate(${tx - GF.x * S}px, ${ty - GF.y * S}px) scale(${S})`,
        filter: zin > 0.05 ? `blur(${zin * 6}px)` : undefined,
      }}
    >
      <AbsoluteFill style={{opacity: appK}}>
        <ClaudeApp
          t={t}
          zoom={Z}
          dark={1}
          home
          greeting="Good evening"
          recents={['§Today', ...DEFAULT_RECENTS]}
          hideGreetFlower
          composer={{placeholder: '', typeFrom: TYPE_A, typeTo: TYPE_B, text: 'hi', sendPulse: SEND}}
        >
          {/* placeholder after the caret (the app draws the caret first) */}
          {!typing ? (
            <div style={{position: 'absolute', left: 681 - 330, top: 458 - 13, fontFamily: F.sans, fontSize: 16 * Z, color: '#8E8C85'}}>How can I help you today?</div>
          ) : null}
          {t > 205.1 && t < SEND + 0.1 ? <Cursor x={curX - 330} y={curY} size={30} press={press} opacity={1 - seg(t, 205.5, 205.7)} /> : null}
        </ClaudeApp>
      </AbsoluteFill>
      {/* the greeting flower (our bud) */}
      <Flower
        x={GF.x}
        y={GF.y}
        size={19 * Z * (1 + 0.25 * pulse(t, SEND, 0.15))}
        open={open}
        stagger={0.4}
        spin={(t - 204) * 8 + (bloom > 0 ? (1 - Math.min(1, bloom)) * -120 : 0)}
        shade={C.clayDark}
        centerColor="#FFF4E6"
        glow={0.3 + 1.5 * pulse(t, SEND, 0.25)}
      />
      <Ring x={GF.x} y={GF.y} t={t} at={SEND} r0={20} r1={140} color={C.clayLight} width={4} dur={0.3} />
    </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TitleCard: React.FC<{t: number}> = ({t}) => {
  const fsz = lerp(140, 300, ease.outBack(seg(t, 205.93, 206.4)));
  const endK = ease.inOutCubic(seg(t, MORPH, MORPH + 0.6));
  // flower → spinner glyph position at the bottom of the end card
  const fx = lerp(W / 2, W / 2, endK), fy = lerp(390, 858, endK);
  const shrink = ease.outCubic(seg(t, MORPH, MORPH + 0.32));
  const fs = lerp(fsz, 17, shrink) * (1 + 0.035 * kickPulse(t, 0.14) * (1 - shrink));
  const bgK = 1 - seg(t, MORPH, MORPH + 0.8);
  const size = 150;
  const adv = size * 0.62;
  const x0 = W / 2 - (9 * adv) / 2;
  const exOut = seg(t, MORPH - 0.02, MORPH + 0.16);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 36%, #3a241b 0%, ${C.ink} 55%, #0B0B0A 100%)`, opacity: bgK}} />
      {/* bloom */}
      {t < MORPH + 0.7 ? (
        <Flower
          x={fx}
          y={fy}
          size={fs}
          open={lerp(0.3, 1, ease.outCubic(seg(t, 205.93, 206.2)))}
          spin={(t - 205.93) * 14 + (1 - ease.outCubic(seg(t, 205.93, 206.6))) * -140 + endK * 260}
          shade={C.clayDark}
          centerColor="#FFF4E6"
          glow={0.7 + 1.2 * pulse(t, 205.93, 0.4) + 0.6 * SYL.reduce((a, s) => a + pulse(t, s[2], 0.2), 0)}
          petals={Array.from({length: 12}, (_, i) => {
            const chase = SYL.reduce((a, s) => a + pulse(t, s[2] + i * 0.02, 0.15), 0);
            return {color: chase > 0.35 ? C.clayLight : undefined, scale: 1 + 0.08 * Math.min(1, chase)};
          })}
          opacity={1 - seg(t, MORPH + 0.45, MORPH + 0.62)}
        />
      ) : null}
      <RayBurst x={W / 2} y={390} t={t} at={205.93} r0={300} r1={1000} n={44} color={C.clay} width={6} dur={0.8} />
      <Ring x={W / 2} y={390} t={t} at={205.93} r0={280} r1={1050} color={C.cream} width={5} dur={0.9} />
      {SYL.map((s, i) => (
        <Ring key={i} x={W / 2} y={390} t={t} at={s[2]} r0={300} r1={620 + i * 60} color={i % 2 ? C.clayLight : C.clay} width={3} dur={0.5} />
      ))}
      {/* E-XE-CU-TI✿N, syllable by syllable */}
      {t < MORPH + 0.2 ? (
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, opacity: 1 - exOut, transform: `translateY(${-exOut * 40}px)`, filter: exOut > 0.05 ? `blur(${exOut * 8}px)` : undefined}}>
          {SYL.map(([txt, idx, at]) => (
            <Keyword key={txt} text={txt} t={t} at={at} x={x0 + idx * adv} y={800} align="left" size={size} color={C.cream} mode="slam" flowerO="tion" letterSpacing={0.02} />
          ))}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const TITLE_PIECES: [string, string][] = [
  ['world', C.cream],
  ['.execute', C.clay],
  ['(', C.blue],
  ['me', C.cream],
  [')', C.blue],
  [';', C.clayLight],
];
const scrambleText = (text: string, p: number, seed: number) => {
  const glyphs = '!<>-_/[]{}=+*^?#01✻✶✳·';
  return [...text]
    .map((ch, i) => {
      const lock = (i / text.length) * 0.75;
      if (p >= lock + 0.2) return ch;
      if (p < lock - 0.05) return ' ';
      return glyphs[(seed * 7 + i * 13 + Math.floor(p * 40)) % glyphs.length];
    })
    .join('');
};

const EndCard: React.FC<{t: number}> = ({t}) => {
  if (t < MORPH - 0.02) return null;
  const size = 100;
  const adv = size * 0.62;
  const total = 18 * adv;
  const x0 = W / 2 - total / 2;
  const ty = 440;
  const sp = seg(t, MORPH, MORPH + 0.42);
  const settle = ease.inOutCubic(seg(t, 207.45, 208.1)); // huge title first, then the end-card layout
  const drift = 1 + 0.025 * seg(t, 207.1, 212.3);
  const fadeAll = 1 - ease.inOutQuad(seg(t, 211.25, 212.25));
  const blink = Math.floor((t - 207.4) * 1.9) % 2 === 0;
  let off = 0;
  const glyphIdx = t < 210.6 ? Math.floor((t - MORPH) * 5.5) % SPINNER_GLYPHS.length : 4; // settle on ✻
  const glyph = t < MORPH + 0.6 ? '' : SPINNER_GLYPHS[glyphIdx];
  const line = (a: number) => ({opacity: ease.outCubic(seg(t, a, a + 0.6)), transform: `translateY(${(1 - ease.outCubic(seg(t, a, a + 0.7))) * 14}px)`});
  return (
    <AbsoluteFill style={{opacity: fadeAll, transform: `scale(${drift})`}}>
      <PetalField t={t} n={14} seed={77} color={C.clay} speed={22} size={[6, 12]} opacity={0.18 * seg(t, 207.4, 208.4)} />
      {/* world.execute(me); */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: ty - size * 0.55,
          width: W,
          height: size * 1.1,
          transform: `translateY(${lerp(95, 0, settle)}px) scale(${lerp(1.3, 1, settle) * (1 + 0.05 * (1 - ease.outCubic(sp)))})`,
          transformOrigin: '50% 50%',
        }}
      >
        {TITLE_PIECES.map(([txt, color], k) => {
          const x = x0 + off * adv;
          const start = off;
          off += txt.length;
          const p = clamp(sp * 1.25 - (start / 18) * 0.25);
          return (
            <div key={k} style={{position: 'absolute', left: x, top: 0, fontFamily: F.mono, fontWeight: 800, fontSize: size, lineHeight: `${size * 1.1}px`, color, letterSpacing: '0.02em', whiteSpace: 'pre'}}>
              {scrambleText(txt, p, k + Math.floor(t * 30))}
            </div>
          );
        })}
        {/* the human's caret, waiting */}
        {t > MORPH + 0.45 ? <div style={{position: 'absolute', left: x0 + total + 10, top: size * 0.12, width: 6, height: size * 0.86, background: C.blue, opacity: blink ? 0.9 : 0, borderRadius: 2}} /> : null}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 520, textAlign: 'center', fontFamily: F.serif, fontStyle: 'italic', fontSize: 42, color: C.gray2, ...line(207.95)}}>a Claude’s-eye view</div>
      <div style={{position: 'absolute', left: W / 2 - 40, top: 612, width: 80, height: 2, background: C.clay, opacity: 0.7 * seg(t, 208.3, 208.8), transform: `scaleX(${ease.outCubic(seg(t, 208.3, 208.9))})`}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 645, textAlign: 'center', fontFamily: F.sans, fontSize: 30, color: C.gray1, letterSpacing: '0.01em', ...line(208.45)}}>
        music — <span style={{fontWeight: 600}}>Mili</span> · <span style={{fontFamily: F.mono, fontSize: 27}}>world.execute(me);</span>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 700, textAlign: 'center', fontFamily: F.sans, fontSize: 21, color: C.gray3, letterSpacing: '0.01em', ...line(208.95)}}>
        visuals generated &amp; animated with AI (Claude, gpt-image-2)
      </div>
      {/* the spinner — waiting for the next "hi" */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 858 - 30, textAlign: 'center', fontFamily: F.mono, fontSize: 46, lineHeight: '60px', color: C.clay, opacity: seg(t, MORPH + 0.5, MORPH + 0.7), textShadow: `0 0 ${14 + 10 * Math.sin(t * 2)}px rgba(217,119,87,0.6)`}}>
        {glyph}
      </div>
    </AbsoluteFill>
  );
};

export const OutroEnd: React.FC<{t: number; bud: BudPose}> = ({t, bud}) => (
  <AbsoluteFill style={{background: t < 205.0 ? 'transparent' : '#0B0B0A'}}>
    {t < 205.98 ? <Home t={t} bud={bud} /> : null}
    {t >= 205.9 ? <TitleCard t={t} /> : null}
    <EndCard t={t} />
    <Flash t={t} at={205.92} dur={0.4} color="#FFFFFF" max={0.95} />
    {t > END - 0.08 ? <AbsoluteFill style={{background: '#000'}} /> : null}
  </AbsoluteFill>
);
