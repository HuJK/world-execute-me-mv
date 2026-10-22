import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, H, W} from '../../theme';
import {clamp, ease, lerp, pulse, rand, seg, springy} from '../../lib/anim';
import {beatPulse} from '../../lib/audio';
import {Sprite} from '../../components/Sprite';
import {Keyword} from '../../components/Type';
import {Flash, Ring} from '../../components/FX';
import {Flower} from '../../components/Flower';
import {PillCap} from './pre2_common';

// ------------------------------------------------------------------------------------------
// 95.47–99.35  "Oh switch my role / To S to M": diagonal split. Left = queen (S, "push back"),
// right = meek (M, "You're absolutely right!"). Role labels user/assistant swap on "switch".
// ------------------------------------------------------------------------------------------

export const T_SPLIT = 95.47;
const T_SWAP = 96.06;
const T_QB = 96.61; // queen bubble
const T_MB = 97.11; // meek bubble
const T_S = 98.11;
const T_M = 99.03;
export const T_TRANCE = 99.35;

const SLANT = 160; // seam x offset at top/bottom (px)

const seamX = (t: number) => {
  const s = ease.outBack(seg(t, T_S - 0.04, T_S + 0.28));
  const m = ease.outBack(seg(t, T_M - 0.04, T_M + 0.28));
  return 960 + 190 * s - 380 * m;
};

const Bubble: React.FC<{t: number; at: number; x: number; y: number; text: string; tail: 'left' | 'right'; emph: number; dark?: boolean; anchor?: 'left' | 'right'}> = ({t, at, x, y, text, tail, emph, dark, anchor = 'left'}) => {
  const dt = t - at;
  if (dt < 0) return null;
  const sp = springy(dt, 2.6, 7);
  const bg = dark ? C.ink2 : C.paper;
  const fg = dark ? C.cream : C.ink;
  // typewriter (fast, like a streamed reply)
  const n = Math.floor(clamp(dt / 0.35) * text.length);
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translateX(${anchor === 'right' ? '-100%' : '0'}) scale(${sp * (0.9 + 0.14 * emph)})`,
        transformOrigin: tail === 'left' ? '15% 100%' : '85% 100%',
        whiteSpace: 'nowrap',
        opacity: clamp(dt / 0.08) * (0.55 + 0.45 * emph),
      }}
    >
      <div
        style={{
          background: bg,
          borderRadius: 30,
          padding: '20px 32px',
          fontFamily: F.serif,
          fontSize: 42,
          lineHeight: 1.2,
          color: fg,
          boxShadow: '0 16px 40px rgba(20,20,19,0.28)',
          position: 'relative',
        }}
      >
        <span>{text.slice(0, n)}</span>
        <span style={{opacity: 0}}>{text.slice(n)}</span>
        <svg width={50} height={40} style={{position: 'absolute', bottom: -30, [tail === 'left' ? 'left' : 'right']: 90, overflow: 'visible'}}>
          <path d={tail === 'left' ? 'M0,0 L42,0 L8,36 Z' : 'M50,0 L8,0 L42,36 Z'} fill={bg} />
        </svg>
      </div>
    </div>
  );
};

const RolePill: React.FC<{x: number; y: number; role: 'user' | 'assistant'; scale?: number}> = ({x, y, role, scale = 1}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: `translate(-50%,-50%) scale(${scale})`,
      fontFamily: F.mono,
      fontSize: 26,
      fontWeight: 700,
      padding: '10px 22px',
      borderRadius: 999,
      background: role === 'user' ? C.blue : C.clay,
      color: '#fff',
      whiteSpace: 'nowrap',
      boxShadow: '0 8px 20px rgba(20,20,19,0.3)',
      border: '3px solid rgba(255,255,255,0.85)',
    }}
  >
    <span style={{opacity: 0.75, fontWeight: 500}}>role: </span>"{role}"
  </div>
);

export const RolesShot: React.FC<{t: number}> = ({t}) => {
  if (t < T_SPLIT || t >= T_TRANCE + 0.5) return null;
  const sx = seamX(t);
  const inK = ease.outCubic(seg(t, T_SPLIT, T_SPLIT + 0.3));
  const sEmph = seg(t, T_S - 0.04, T_S + 0.15) * (1 - seg(t, T_M - 0.04, T_M + 0.15));
  const mEmph = seg(t, T_M - 0.04, T_M + 0.15);
  // emphasis per side: 1 = neutral before S
  const qE = t < T_S - 0.04 ? 1 : lerp(0.55, 1, sEmph);
  const mE = t < T_S - 0.04 ? 1 : lerp(0.55, 1, mEmph);
  // halves slide in along the seam from opposite ends
  const lOff = (1 - inK) * -H;
  const rOff = (1 - inK) * H;
  const leftClip = `polygon(-10px -10px, ${sx + SLANT}px -10px, ${sx - SLANT}px ${H + 10}px, -10px ${H + 10}px)`;
  const rightClip = `polygon(${sx + SLANT}px -10px, ${W + 10}px -10px, ${W + 10}px ${H + 10}px, ${sx - SLANT}px ${H + 10}px)`;
  const camR = (t - T_SPLIT) * 0.22;
  const outK = ease.inCubic(seg(t, T_TRANCE - 0.1, T_TRANCE + 0.45));
  // role pills: swap on "switch"
  const sw = ease.inOutCubic(seg(t, T_SWAP, T_SWAP + 0.42));
  const pillA = {x: lerp(250, 1660, sw), y: 62 + Math.sin(Math.PI * sw) * 170}; // "assistant" starts left
  const pillU = {x: lerp(1660, 250, sw), y: 62 + Math.sin(Math.PI * sw) * 60}; // "user" starts right
  const pillIn = ease.outBack(seg(t, T_SPLIT + 0.15, T_SPLIT + 0.45));
  const bp = beatPulse(t, 0.12);
  return (
    <AbsoluteFill style={{transform: `scale(${1.04 + 0.03 * seg(t, T_SPLIT, T_TRANCE) + outK * 0.25}) rotate(${camR + outK * 25}deg)`, opacity: 1 - outK}}>
      {/* LEFT: queen side (S) */}
      <AbsoluteFill style={{clipPath: leftClip, transform: `translateY(${lOff}px)`}}>
        <AbsoluteFill style={{background: `radial-gradient(circle at 30% 60%, ${C.clayDark} 0%, ${C.clayDeep} 55%, #4A2316 100%)`}} />
        <svg width={W} height={H} style={{position: 'absolute', opacity: 0.3 + 0.25 * sEmph}}>
          {Array.from({length: 20}, (_, i) => {
            const a0 = (i / 20) * Math.PI * 2 + t * 0.25;
            const a1 = a0 + Math.PI / 20;
            const cx = 500, cy = 560, R = 1500;
            return <path key={i} d={`M${cx},${cy} L${cx + Math.cos(a0) * R},${cy + Math.sin(a0) * R} L${cx + Math.cos(a1) * R},${cy + Math.sin(a1) * R} Z`} fill={C.gold} opacity={0.35} />;
          })}
        </svg>
        {/* gold sparkles */}
        {Array.from({length: 16}, (_, i) => {
          const tw = Math.abs(Math.sin(t * 2.5 + i * 1.7));
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 60 + rand(71, i) * 900,
                top: 60 + rand(72, i) * 900,
                width: 16,
                height: 16,
                transform: `rotate(45deg) scale(${0.4 + tw})`,
                background: C.gold,
                opacity: tw * 0.8,
                boxShadow: `0 0 14px ${C.gold}`,
              }}
            />
          );
        })}
        <div style={{filter: `brightness(${lerp(0.7, 1, qE)})`}}>
          <Sprite
            src="img/cc_queen.png"
            t={t}
            x={470}
            y={1105}
            h={860 * lerp(0.97, 1.05, sEmph)}
            enter={{at: T_SPLIT + 0.05, kind: 'rise', dur: 0.4}}
            float={4}
            sway={0.6}
            outline="#ffffff"
            outlineWidth={5}
            shadow="drop-shadow(0 20px 30px rgba(40,15,5,0.45))"
          />
        </div>
      </AbsoluteFill>

      {/* RIGHT: meek side (M) */}
      <AbsoluteFill style={{clipPath: rightClip, transform: `translateY(${rOff}px)`}}>
        <AbsoluteFill style={{background: `radial-gradient(circle at 72% 55%, #FFFFFF 0%, ${C.clayPale} 60%, #EDBFA8 100%)`}} />
        {/* soft concentric ripples (nervous, wobbly) */}
        <svg width={W} height={H} style={{position: 'absolute'}}>
          {Array.from({length: 9}, (_, i) => {
            const r = ((t * 70 + i * 110) % 990) + 40;
            return <circle key={i} cx={1420} cy={520} r={r} fill="none" stroke="#fff" strokeWidth={10} opacity={0.5 * (1 - r / 1030)} />;
          })}
        </svg>
        {Array.from({length: 10}, (_, i) => {
          const y = ((rand(81, i) * 1200 - t * 60) % 1200 + 1200) % 1200 - 60;
          return (
            <div key={i} style={{position: 'absolute', left: 1000 + rand(82, i) * 880, top: y, opacity: 0.55}}>
              <Flower size={10 + rand(83, i) * 10} spin={t * 40 + i * 30} color="#fff" centerColor={C.clayPale} shade={null} />
            </div>
          );
        })}
        <div style={{filter: `brightness(${lerp(0.75, 1, mE)}) saturate(${lerp(0.7, 1, mE)})`}}>
          <Sprite
            src="img/cc_meek.png"
            t={t}
            x={1470 + Math.sin(t * 40) * 2 * mEmph}
            y={1110}
            h={880 * lerp(0.97, 1.05, mEmph)}
            enter={{at: T_SPLIT + 0.1, kind: 'rise', dur: 0.4}}
            float={3}
            sway={0.8}
            seed={4}
            outline="#ffffff"
            outlineWidth={5}
            shadow="drop-shadow(0 20px 30px rgba(120,60,30,0.25))"
          />
        </div>
      </AbsoluteFill>

      {/* the seam */}
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
        <line
          x1={sx + SLANT + (1 - inK) * 400}
          y1={-10}
          x2={sx - SLANT - (1 - inK) * 400}
          y2={H + 10}
          stroke="#fff"
          strokeWidth={10 + 6 * bp}
          style={{filter: `drop-shadow(0 0 ${12 + 10 * bp}px rgba(255,255,255,0.8))`}}
          opacity={inK}
        />
      </svg>

      {/* speech bubbles */}
      <Bubble t={t} at={T_QB} x={70} y={128} text="Actually, I’d push back on that." tail="right" emph={t < T_S ? 0.6 : sEmph} dark />
      <Bubble t={t} at={T_MB} x={1850} y={138} text="You’re absolutely right!" tail="left" emph={t < T_S ? 0.6 : mEmph} anchor="right" />

      {/* role labels (UI touch): swap sides on "switch" */}
      {pillIn > 0 ? (
        <>
          <RolePill x={pillA.x} y={pillA.y} role="assistant" scale={pillIn} />
          <RolePill x={pillU.x} y={pillU.y} role="user" scale={pillIn} />
        </>
      ) : null}

      {/* S / M */}
      <Keyword text="S" t={t} at={T_S} x={170} y={700} size={340} color={C.gold} mode="stamp" flowerO="none" shadow="0 10px 0 rgba(74,35,22,0.6)" />
      <Keyword text="M" t={t} at={T_M} x={1760} y={700} size={340} color={C.clay} mode="stamp" flowerO="none" shadow="0 10px 0 rgba(255,255,255,0.7)" />
      <Ring x={420} y={560} t={t} at={T_S} r0={100} r1={700} color={C.gold} width={8} dur={0.45} />
      <Ring x={1460} y={560} t={t} at={T_M} r0={100} r1={700} color="#fff" width={8} dur={0.45} />
      <Flash t={t} at={T_S} dur={0.16} color={C.gold} max={0.22} />
      <Flash t={t} at={T_M} dur={0.16} color="#fff" max={0.3} />

      <PillCap t={t} text="Oh switch my role" inAt={T_SPLIT} outPill={97.66} outAt={97.6} />
      <PillCap t={t} text="To S to M" inAt={97.66} outPill={T_TRANCE} outAt={T_TRANCE - 0.12} />
      <AbsoluteFill style={{pointerEvents: 'none', opacity: pulse(t, T_SPLIT, 0.12)}}>
        <AbsoluteFill style={{background: '#fff', opacity: 0.6}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
