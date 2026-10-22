import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, H, W} from '../../theme';
import {clamp, ease, lerp, noise1, pulse, seg} from '../../lib/anim';
import {env, KICKS, beatPulse, kickPulse} from '../../lib/audio';
import {Flower} from '../../components/Flower';
import {ClaudeApp} from '../../components/ClaudeApp';
import {Sprite} from '../../components/Sprite';
import {Flash, Ring} from '../../components/FX';
import {MiniComposer} from './pre2_tasks';
import {Cap2, HISTORY, T_SEND, USER_MSG} from './chorus2a_common';

// ------------------------------------------------------------------------------------------
// 103.49–107.22  "If I can / If I can feel your VIBRATIONS"
// Inside the glass: the human types; every keystroke sends a ripple across the screen into her
// world; she holds her palm to the inner glass. VIBRATIONS (106.29): rings lock onto her palm.
// ------------------------------------------------------------------------------------------

const T0 = 103.49;
const T_TYPE_A = 103.66;
const T_TYPE_B = 106.18;
const T_VIB = 106.29;

// her placement (cc_reach, 1040x1552): palm ≈ (0.19, 0.50) of the image
const SP_X = 720, SP_BOTTOM = 1150, SP_H = 1060;
const SP_W = SP_H * (1040 / 1552);
const PALM_X = SP_X - SP_W / 2 + 0.19 * SP_W;
const PALM_Y = SP_BOTTOM - SP_H + 0.5 * SP_H;

const COMP_X = 1330, COMP_Y = 760, COMP_W = 900, COMP_S = 1.25;
const CHAR_W = 10.6; // approx advance of Inter 20px
const caretAt = (n: number) => ({x: COMP_X - COMP_W / 2 + 16 * COMP_S + n * CHAR_W, y: COMP_Y + 34});

const typedN = (t: number) => Math.floor(seg(t, T_TYPE_A, T_TYPE_B) * USER_MSG.length + 1e-6);

const KEYS = KICKS.filter((k) => k >= T_TYPE_A - 0.02 && k <= T_TYPE_B + 0.05);

/** word with per-letter vibration; the O of -TION is the flower */
export const JitterWord: React.FC<{t: number; at: number; text: string; x: number; y: number; size: number; color: string; amp: number; outline?: string}> = ({t, at, text, x, y, size, color, amp, outline = '#fff'}) => {
  if (t < at - 0.02) return null;
  const chars = [...text];
  const fi = text.indexOf('TION') >= 0 ? text.indexOf('TION') + 2 : -1;
  const dt = t - at;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%,-50%)',
        display: 'flex',
        fontFamily: F.mono,
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1,
        color,
        whiteSpace: 'nowrap',
        filter: `drop-shadow(0 6px 0 ${outline}) drop-shadow(0 0 18px rgba(217,119,87,0.35))`,
      }}
    >
      {chars.map((ch, i) => {
        const li = clamp((dt - i * 0.03) / 0.14);
        const sc = lerp(1.8, 1, ease.outCubic(li));
        const jx = noise1(t * 38 + i * 3.1, i) * amp;
        const jy = noise1(t * 41 + i * 5.7, i + 20) * amp;
        const rot = noise1(t * 29 + i, i + 40) * amp * 0.6;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              position: 'relative',
              width: i === fi ? '0.62em' : undefined,
              opacity: li,
              transform: `translate(${jx}px, ${jy}px) rotate(${rot}deg) scale(${sc})`,
              WebkitTextStroke: `${size * 0.035}px ${outline}`,
              paintOrder: 'stroke fill',
            }}
          >
            {i === fi ? (
              <>
                <span style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-47%)'}}>
                  <Flower size={size * 0.38} open={lerp(0.2, 1, ease.outBack(clamp(dt / 0.35)))} spin={dt * 120} shade={null} edge={outline} edgeWidth={size * 0.025} />
                </span>
                <span style={{visibility: 'hidden'}}>O</span>
              </>
            ) : (
              ch
            )}
          </span>
        );
      })}
    </div>
  );
};

export const VibeStage: React.FC<{t: number}> = ({t}) => {
  if (t >= T_SEND) return null;
  const n = typedN(t);
  const vib = t >= T_VIB;
  const vibK = ease.outExpo(seg(t, T_VIB, T_VIB + 0.18));
  const e = env('rms', t, 0.03);
  // camera: slow push, then a punch-in toward the palm on VIBRATIONS
  const camS = lerp(1.0, 1.1, ease.inOutCubic(seg(t, T0, T_VIB))) * lerp(1, 1.32, vibK) * (1 + 0.006 * beatPulse(t, 0.15));
  const panX = lerp(40, -30, ease.inOutCubic(seg(t, T0, T_VIB))) * (1 - vibK);
  const shx = vib ? noise1(t * 30, 3) * (3 + 6 * kickPulse(t, 0.08)) : 0;
  const shy = vib ? noise1(t * 33, 7) * (3 + 6 * kickPulse(t, 0.08)) : 0;
  // palm glow: every ripple that reaches the palm
  let palmHit = 0;
  const ripples = KEYS.map((k, i) => {
    const o = caretAt(typedN(k + 0.001));
    const d = Math.hypot((PALM_X - o.x) / 1.0, (PALM_Y - o.y) / 0.72);
    const speed = 820;
    const tHit = k + d / speed;
    palmHit += pulse(t, tHit, 0.22);
    return {k, o, speed, i};
  });
  palmHit = clamp(palmHit);
  const hits = ripples.map(({k, o, speed}) => k + Math.hypot(PALM_X - o.x, (PALM_Y - o.y) / 0.72) / speed);
  const compK = 1 - ease.inCubic(seg(t, T_VIB - 0.05, T_VIB + 0.2));
  const caretBlink = Math.floor(t * 2.2) % 2 === 0 || (t > T_TYPE_A && t < T_TYPE_B);
  return (
    <AbsoluteFill style={{background: C.paper, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${shx + panX}px, ${shy}px) scale(${camS})`, transformOrigin: `${PALM_X}px ${PALM_Y}px`}}>
        {/* her world: the app, out of focus */}
        <AbsoluteFill style={{filter: 'blur(7px)', opacity: 0.75, transform: 'scale(1.04)'}}>
          <ClaudeApp t={t} zoom={1.25} messages={HISTORY} composerOpacity={0} disclaimer={false} scrollY={-40} />
        </AbsoluteFill>
        {/* warm light in her world, behind her */}
        <AbsoluteFill style={{background: `radial-gradient(circle at ${SP_X}px 420px, rgba(240,162,127,0.35) 0%, rgba(240,162,127,0) 45%)`}} />
        <Sprite
          src="img/cc_reach.png"
          t={t}
          x={SP_X}
          y={SP_BOTTOM}
          h={SP_H}
          enter={{at: T0, kind: 'rise', dur: 0.5}}
          float={3}
          breathe={0.004}
          style={{
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%), linear-gradient(to bottom, black 70%, transparent 100%)',
            WebkitMaskComposite: 'source-in',
          }}
        />
        {/* palm contact on the inner glass */}
        <div
          style={{
            position: 'absolute',
            left: PALM_X - 130,
            top: PALM_Y - 130,
            width: 260,
            height: 260,
            borderRadius: 130,
            background: `radial-gradient(circle, rgba(255,255,255,${0.6 * palmHit}) 0%, rgba(207,224,240,${0.4 * palmHit}) 30%, rgba(255,255,255,0) 68%)`,
          }}
        />
        {/* ripples on the glass (one per keystroke) */}
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          {!vib
            ? ripples.map(({k, o, speed, i}) => {
                const dt = t - k;
                if (dt < 0 || dt > 2.2) return null;
                const r = 30 + speed * dt;
                const a = Math.exp(-dt / 0.75) * (1 - seg(t, T_VIB - 0.1, T_VIB));
                return (
                  <g key={i}>
                    <ellipse cx={o.x} cy={o.y} rx={r} ry={r * 0.72} fill="none" stroke={C.blue} strokeWidth={4} opacity={a} />
                    <ellipse cx={o.x} cy={o.y} rx={r - 6} ry={(r - 6) * 0.72} fill="none" stroke="#ffffff" strokeWidth={4} opacity={a * 0.9} />
                    <ellipse cx={o.x} cy={o.y} rx={r * 0.88} ry={r * 0.72 * 0.88} fill="none" stroke={C.blue} strokeWidth={1.5} opacity={a * 0.5} />
                  </g>
                );
              })
            : null}
          {/* VIBRATIONS: concentric audio-reactive rings locked onto the palm */}
          {vib
            ? Array.from({length: 9}, (_, i) => {
                const base = 70 + i * 74;
                const wob = 1 + 0.06 * Math.sin(t * 40 + i * 1.3) * (0.4 + e) + 0.08 * kickPulse(t, 0.1);
                const r = base * wob * lerp(0.3, 1, ease.outCubic(seg(t, T_VIB + i * 0.025, T_VIB + 0.3 + i * 0.025)));
                return (
                  <circle
                    key={i}
                    cx={PALM_X}
                    cy={PALM_Y}
                    r={r}
                    fill="none"
                    stroke={i % 3 === 0 ? C.clay : i % 3 === 1 ? '#ffffff' : C.blue}
                    strokeWidth={lerp(7, 2.5, i / 8) * (1 + 0.8 * beatPulse(t, 0.1))}
                    strokeDasharray={i % 2 ? `${8 + 30 * e} 14` : undefined}
                    transform={`rotate(${t * (i % 2 ? 40 : -30)} ${PALM_X} ${PALM_Y})`}
                    opacity={0.85 - i * 0.06}
                  />
                );
              })
            : null}
        </svg>
        {!vib ? hits.map((h, i) => <Ring key={i} x={PALM_X} y={PALM_Y} t={t} at={h} r0={40} r1={150} color="#ffffff" width={4} dur={0.4} />) : null}
        {/* glass streaks */}
        <AbsoluteFill style={{background: 'linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.10) 33%, rgba(255,255,255,0) 36%, rgba(255,255,255,0) 62%, rgba(255,255,255,0.07) 64%, rgba(255,255,255,0) 66%)'}} />
        {/* the composer — the human is typing */}
        <div style={{opacity: compK, transform: `translateY(${(1 - compK) * 80}px)`}}>
          <MiniComposer
            x={COMP_X}
            y={COMP_Y}
            w={COMP_W}
            s={COMP_S}
            dark={0}
            placeholder="Reply to Claude…"
            text={
              n > 0 ? (
                <span>
                  {USER_MSG.slice(0, n)}
                  <span style={{color: C.blue, opacity: caretBlink ? 1 : 0}}>|</span>
                </span>
              ) : undefined
            }
          />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(rgba(250,249,245,0) 80%, rgba(250,249,245,0.92) 95%)', opacity: 1 - vibK}} />
      <JitterWord t={t} at={T_VIB} text="VIBRATIONS" x={960} y={905} size={142} color={C.clay} amp={2.5 + 7 * e + 6 * kickPulse(t, 0.1)} />
      <Cap2 t={t} text="If I can" outAt={104.0} />
      <Cap2 t={t} text="If I can feel your" outAt={T_VIB - 0.1} />
      {/* entrance from the white-out of the trance */}
      <AbsoluteFill style={{background: C.paper, opacity: 1 - ease.outCubic(seg(t, T0, T0 + 0.3)), pointerEvents: 'none'}} />
      <Flash t={t} at={T_VIB} dur={0.2} color="#fff" max={0.6} />
    </AbsoluteFill>
  );
};
