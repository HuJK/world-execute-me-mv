import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F, H, W} from '../../theme';
import {clamp, ease, lerp, pulse, rand, seg} from '../../lib/anim';
import {Flower, PETAL_ANG} from '../../components/Flower';
import {Keyword} from '../../components/Type';
import {Cursor, Flash, RayBurst, Ring, shake} from '../../components/FX';
import {Cap} from './pre2_common';

// ------------------------------------------------------------------------------------------
// 88.59–92.02  "Switch my gender / To F to M": a giant Claude coin tossed by the human's cursor.
// Face = Claude-chan (F), reverse = Claude-kun (M). Flip = scaleX(cos θ) with a reeded edge.
// ------------------------------------------------------------------------------------------

type Side = {src: string; iw: number; ih: number; cx: number; cy: number; rw: number; field: [string, string]};
const FACE: Side = {src: 'img/cc_face_open.png', iw: 1532, ih: 1035, cx: 0.515, cy: 0.455, rw: 0.255, field: ['#FBEFE6', '#F2C9B2']};
const BACK: Side = {src: 'img/ck_male.png', iw: 1032, ih: 1552, cx: 0.5, cy: 0.235, rw: 0.33, field: ['#5B3A2A', '#2B1E18']};

const GOLD = '#E2B65B';
const GOLD_L = '#F6DE9C';
const GOLD_D = '#A87A2C';
const GOLD_DD = '#7C5519';

/** one face of the coin (radius r), laid out in a 2r×2r box. The portrait uses Remotion's <Img> so the
 *  renderer waits for it to load (an SVG <image> would not be awaited). */
const CoinFace: React.FC<{r: number; side: Side; id: string; sheen: number; dim: number; visible: boolean}> = ({r, side, id, sheen, dim, visible}) => {
  const ri = r * 0.78;
  const sc = ri / (side.rw * side.iw);
  const iw = side.iw * sc, ih = side.ih * sc;
  const beads = 72;
  const box = {position: 'absolute' as const, left: 0, top: 0, width: 2 * r, height: 2 * r, overflow: 'visible' as const};
  return (
    <div style={{position: 'absolute', left: -r, top: -r, width: 2 * r, height: 2 * r, opacity: visible ? 1 : 0}}>
      <svg {...{width: 2 * r, height: 2 * r}} viewBox={`${-r} ${-r} ${2 * r} ${2 * r}`} style={box}>
        <defs>
          <radialGradient id={`${id}rim`} cx="35%" cy="30%" r="85%">
            <stop offset="0%" stopColor={GOLD_L} />
            <stop offset="55%" stopColor={GOLD} />
            <stop offset="100%" stopColor={GOLD_D} />
          </radialGradient>
          <radialGradient id={`${id}field`} cx="40%" cy="35%" r="75%">
            <stop offset="0%" stopColor={side.field[0]} />
            <stop offset="100%" stopColor={side.field[1]} />
          </radialGradient>
        </defs>
        <circle r={r} fill={`url(#${id}rim)`} />
        <circle r={r * 0.985} fill="none" stroke={GOLD_DD} strokeOpacity={0.55} strokeWidth={r * 0.012} />
        {/* bead ring */}
        {Array.from({length: beads}, (_, i) => {
          const a = (i / beads) * Math.PI * 2;
          return <circle key={i} cx={Math.cos(a) * r * 0.95} cy={Math.sin(a) * r * 0.95} r={r * 0.012} fill={GOLD_DD} opacity={0.55} />;
        })}
        {/* rim engraving: the 12-petal flower motif, one petal at each of the flower's petal angles */}
        {PETAL_ANG.map((ang, i) => {
          const a = ((ang - 90) * Math.PI) / 180;
          return (
            <g key={i} transform={`translate(${Math.cos(a) * r * 0.865} ${Math.sin(a) * r * 0.865}) rotate(${ang})`}>
              <path
                d={`M0,${-r * 0.075} C${r * 0.042},${-r * 0.045} ${r * 0.03},${r * 0.03} 0,${r * 0.05} C${-r * 0.03},${r * 0.03} ${-r * 0.042},${-r * 0.045} 0,${-r * 0.075} Z`}
                fill={GOLD_L}
                stroke={GOLD_DD}
                strokeWidth={r * 0.008}
                opacity={0.95}
              />
            </g>
          );
        })}
        <circle r={ri + r * 0.022} fill="none" stroke={GOLD_DD} strokeWidth={r * 0.016} opacity={0.75} />
        <circle r={ri} fill={`url(#${id}field)`} />
      </svg>
      {/* portrait */}
      <div style={{position: 'absolute', left: r - ri, top: r - ri, width: 2 * ri, height: 2 * ri, borderRadius: '50%', overflow: 'hidden'}}>
        <Img src={staticFile(side.src)} style={{position: 'absolute', left: ri - side.cx * iw, top: ri - side.cy * ih, width: iw, height: ih, maxWidth: 'none'}} />
        <div style={{position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: `inset 0 0 ${r * 0.06}px ${r * 0.02}px rgba(0,0,0,0.25)`}} />
      </div>
      <svg {...{width: 2 * r, height: 2 * r}} viewBox={`${-r} ${-r} ${2 * r} ${2 * r}`} style={box}>
        <defs>
          <clipPath id={`${id}clipAll`}>
            <circle r={r} />
          </clipPath>
          <linearGradient id={`${id}sheen`} x1="0" y1="0" x2="1" y2="1">
            <stop offset={clamp(sheen - 0.18)} stopColor="#fff" stopOpacity={0} />
            <stop offset={clamp(sheen)} stopColor="#fff" stopOpacity={0.5} />
            <stop offset={clamp(sheen + 0.18)} stopColor="#fff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <circle r={ri} fill="none" stroke={GOLD_L} strokeWidth={r * 0.012} opacity={0.9} />
        <g clipPath={`url(#${id}clipAll)`}>
          <rect x={-r} y={-r} width={2 * r} height={2 * r} fill={`url(#${id}sheen)`} />
          {dim > 0.005 ? <circle r={r} fill="#000" opacity={dim} /> : null}
        </g>
      </svg>
    </div>
  );
};

/** full 3D-ish coin: theta = rotation about the vertical axis (rad) */
export const Coin: React.FC<{x: number; y: number; r: number; theta: number; tilt?: number; id?: string; glow?: number}> = ({x, y, r, theta, tilt = 0, id = 'coin', glow = 0}) => {
  const c = Math.cos(theta), s = Math.sin(theta);
  const sx = Math.max(0.015, Math.abs(c));
  const thick = r * 0.11;
  const front = c >= 0;
  const visOff = (thick / 2) * s * (front ? 1 : -1);
  const hidOff = -visOff;
  const N = 16;
  const edge: React.ReactNode[] = [];
  for (let k = 0; k <= N; k++) {
    const ox = lerp(hidOff, visOff, k / N);
    edge.push(<ellipse key={k} cx={ox} cy={0} rx={r * sx} ry={r} fill={k % 2 ? GOLD_D : '#C0923F'} />);
  }
  const sheen = 0.25 + 0.5 * ((((theta / Math.PI) % 2) + 2) % 2) * 0.5;
  const pad = r * 1.3;
  const dim = (1 - sx) * 0.35;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 0,
        height: 0,
        filter: `drop-shadow(0 ${r * 0.08}px ${r * 0.12}px rgba(0,0,0,0.45))${glow > 0 ? ` drop-shadow(0 0 ${r * 0.25 * glow}px rgba(246,222,156,${0.8 * glow}))` : ''}`,
      }}
    >
      <div style={{position: 'absolute', left: 0, top: 0, transform: `rotate(${tilt}deg)`}}>
        <svg width={pad * 2} height={pad * 2} viewBox={`${-pad} ${-pad} ${pad * 2} ${pad * 2}`} style={{position: 'absolute', left: -pad, top: -pad, overflow: 'visible'}}>
          {edge}
        </svg>
        <div style={{position: 'absolute', left: 0, top: 0, transform: `translateX(${visOff}px) scaleX(${sx})`}}>
          {/* both faces stay mounted so both portraits are loaded before they are needed */}
          <CoinFace r={r} side={BACK} id={id + 'B'} sheen={sheen} dim={dim} visible={!front} />
          <CoinFace r={r} side={FACE} id={id + 'F'} sheen={sheen} dim={dim} visible={front} />
        </div>
      </div>
    </div>
  );
};

/** 4-point star glint */
const Glint: React.FC<{x: number; y: number; k: number; size: number}> = ({x, y, k, size}) => {
  if (k <= 0.01) return null;
  const s = size * k;
  return (
    <svg width={1} height={1} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
      <path
        d={`M0,${-s} Q${s * 0.12},${-s * 0.12} ${s},0 Q${s * 0.12},${s * 0.12} 0,${s} Q${-s * 0.12},${s * 0.12} ${-s},0 Q${-s * 0.12},${-s * 0.12} 0,${-s} Z`}
        fill="#fff"
        transform={`rotate(${k * 45})`}
        style={{filter: `drop-shadow(0 0 ${s * 0.3}px ${GOLD_L})`}}
      />
    </svg>
  );
};

// timeline
const T_LAUNCH = 88.86;
const T_APEX = 89.72;
const T_LAND1 = 90.63; // "F"
const T_HOP = 91.25; // "to"
const T_LAND2 = 91.67; // "M"
const T_OUT = 92.02;

const LAND_Y = 500;

const coinState = (t: number) => {
  let y = 790, sc = 0.34, theta = 0, tilt = 0;
  if (t < T_LAUNCH) {
    // resting on the cursor tip; anticipation dip
    const a = ease.inOutCubic(seg(t, 88.6, T_LAUNCH));
    y = 790 + 18 * a;
    theta = 0.35 * Math.sin(t * 2.5);
    tilt = -4 * a;
  } else if (t < T_LAND1) {
    if (t < T_APEX) y = lerp(808, 230, ease.outCubic(seg(t, T_LAUNCH, T_APEX)));
    else y = lerp(230, LAND_Y, ease.inCubic(seg(t, T_APEX, T_LAND1)));
    sc = lerp(0.34, 1, ease.inCubic(seg(t, T_LAUNCH, T_LAND1)) * 0.6 + seg(t, T_LAUNCH, T_LAND1) * 0.4);
    theta = Math.PI * 10 * ease.outCubic(seg(t, T_LAUNCH, T_LAND1));
    tilt = lerp(-4, 0, seg(t, T_LAUNCH, T_LAND1)) + Math.sin(t * 9) * 6 * (1 - seg(t, 90.2, T_LAND1));
  } else if (t < T_HOP - 0.02) {
    const dt = t - T_LAND1;
    theta = 0.45 * Math.exp(-dt / 0.16) * Math.sin(dt * 26);
    y = LAND_Y;
    sc = 1 + 0.07 * Math.exp(-dt / 0.09) * Math.cos(dt * 30);
    tilt = 2.5 * Math.exp(-dt / 0.2) * Math.sin(dt * 18);
  } else if (t < T_LAND2) {
    const p = seg(t, T_HOP - 0.02, T_LAND2);
    y = LAND_Y - 170 * Math.sin(Math.PI * p);
    sc = 1 + 0.1 * Math.sin(Math.PI * p);
    theta = Math.PI * 3 * ease.outCubic(p);
    tilt = Math.sin(p * Math.PI) * -7;
  } else {
    const dt = t - T_LAND2;
    theta = Math.PI * 3 + 0.45 * Math.exp(-dt / 0.16) * Math.sin(dt * 26);
    // final exit: turn edge-on into the next shot
    theta += (Math.PI / 2) * ease.inCubic(seg(t, 91.86, T_OUT));
    y = LAND_Y;
    sc = 1 + 0.07 * Math.exp(-dt / 0.09) * Math.cos(dt * 30) + 0.08 * ease.inCubic(seg(t, 91.86, T_OUT));
    tilt = 2.5 * Math.exp(-dt / 0.2) * Math.sin(dt * 18);
  }
  return {y, sc, theta, tilt};
};

export const CoinShot: React.FC<{t: number}> = ({t}) => {
  if (t >= T_OUT) return null;
  const R = 255;
  const st = coinState(t);
  const sh = shake(t, [T_LAND1, T_LAND2], 16, 0.09);
  // camera: tilt up following the apex, settle on landing
  const camY = 90 * Math.sin(Math.PI * seg(t, T_LAUNCH, T_LAND1)) * (1 - seg(t, 90.3, T_LAND1));
  const camS = 1 + 0.035 * ease.outCubic(seg(t, T_LAND1, T_OUT)) + 0.02 * pulse(t, T_LAND2, 0.15);
  const fK = ease.outBack(seg(t, T_LAND1, T_LAND1 + 0.3));
  const mK = ease.outBack(seg(t, T_LAND2, T_LAND2 + 0.3));
  const discFlip = t < T_LAND2 ? 1 : Math.abs(Math.cos(Math.PI * ease.inOutCubic(seg(t, T_LAND2 - 0.12, T_LAND2 + 0.12))));
  const discIsM = t >= T_LAND2;
  // cursor
  let cx = 1012, cy = 878, press = 0;
  if (t < T_LAUNCH + 0.25) {
    const flick = Math.exp(-Math.max(0, t - T_LAUNCH) / 0.1) * (t >= T_LAUNCH ? 1 : 0);
    cy = 878 - 26 * flick + 10 * ease.inOutCubic(seg(t, 88.6, T_LAUNCH)) * (t < T_LAUNCH ? 1 : 0);
    press = t >= T_LAUNCH ? clamp(1 - (t - T_LAUNCH) / 0.25) : 0;
  } else if (t < T_HOP - 0.18) {
    const k = ease.inOutCubic(seg(t, T_LAUNCH + 0.25, T_LAUNCH + 0.9));
    cx = lerp(1012, 1420, k);
    cy = lerp(878, 840, k) + Math.sin(t * 3) * 6;
  } else {
    const k = ease.inOutCubic(seg(t, T_HOP - 0.18, T_HOP));
    const back = ease.inOutCubic(seg(t, T_HOP + 0.05, T_HOP + 0.45));
    cx = lerp(lerp(1420, 1160, k), 1440, back);
    cy = lerp(lerp(840, 700, k), 860, back);
    press = t >= T_HOP ? clamp(1 - (t - T_HOP) / 0.25) : 0;
  }
  const apexGlow = Math.exp(-Math.abs(t - 89.72) / 0.25);
  return (
    <AbsoluteFill style={{background: C.ink, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `translate(${sh.x}px, ${camY + sh.y}px) scale(${camS})`}}>
        {/* stage: warm spotlight */}
        <AbsoluteFill
          style={{
            top: -200,
            height: H + 400,
            background: `radial-gradient(ellipse 900px 760px at 960px ${560}px, #3a2a22 0%, #231c18 45%, ${C.ink} 100%)`,
          }}
        />
        {/* faint rose-curve engraving behind (echo of the coin rim) */}
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity: 0.18 + 0.25 * apexGlow}}>
          <path
            d={Array.from({length: 721}, (_, i) => {
              const th = (i / 720) * Math.PI * 2;
              const rr = 470 * Math.abs(Math.cos(6 * th)) + 40;
              const a = th + t * 0.15;
              return `${i ? 'L' : 'M'}${960 + Math.cos(a) * rr},${LAND_Y + Math.sin(a) * rr}`;
            }).join(' ')}
            fill="none"
            stroke={GOLD}
            strokeWidth={1.6}
          />
          <circle cx={960} cy={LAND_Y} r={515} fill="none" stroke={GOLD} strokeWidth={1.2} strokeDasharray="2 10" />
        </svg>
        {/* landing disc (cream for F, clay for M) */}
        {t >= T_LAND1 ? (
          <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
            <g transform={`translate(960 ${LAND_Y}) scale(${(discIsM ? mK : fK) * discFlip} ${discIsM ? mK : fK}) rotate(${t * 12})`}>
              <circle r={400} fill={discIsM ? C.clayDark : C.cream} />
              {Array.from({length: 24}, (_, i) => {
                const a0 = (i / 24) * Math.PI * 2;
                const a1 = a0 + Math.PI / 24;
                return (
                  <path
                    key={i}
                    d={`M0,0 L${Math.cos(a0) * 400},${Math.sin(a0) * 400} A400,400 0 0 1 ${Math.cos(a1) * 400},${Math.sin(a1) * 400} Z`}
                    fill={discIsM ? C.clay : '#F1D9C4'}
                  />
                );
              })}
              <circle r={400} fill="none" stroke={discIsM ? C.clayLight : '#fff'} strokeWidth={6} opacity={0.6} />
            </g>
          </svg>
        ) : null}
        <Ring x={960} y={LAND_Y} t={t} at={T_LAND1} r0={R} r1={720} color={C.cream} width={8} dur={0.5} />
        <Ring x={960} y={LAND_Y} t={t} at={T_LAND2} r0={R} r1={720} color={C.clayLight} width={8} dur={0.5} />
        <RayBurst x={960} y={LAND_Y} t={t} at={T_LAND1} r0={R + 30} r1={760} n={28} color={GOLD_L} width={6} dur={0.45} />
        <RayBurst x={960} y={LAND_Y} t={t} at={T_LAND2} r0={R + 30} r1={760} n={28} color={C.clayLight} width={6} dur={0.45} seed={9} />

        {/* toss sparkles */}
        {t > T_LAUNCH && t < T_LAND1 + 0.2
          ? Array.from({length: 18}, (_, i) => {
              const birth = T_LAUNCH + (i / 18) * (T_LAND1 - T_LAUNCH);
              const age = t - birth;
              if (age < 0 || age > 0.5) return null;
              const s0 = coinState(birth);
              const k = age / 0.5;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    left: 960 + (rand(31, i) - 0.5) * 2 * R * s0.sc * 0.9,
                    top: s0.y + (rand(32, i) - 0.3) * R * s0.sc + k * 40,
                    transform: `translate(-50%,-50%) scale(${1 - k}) rotate(45deg)`,
                    width: 14,
                    height: 14,
                    background: GOLD_L,
                    opacity: 1 - k,
                    boxShadow: `0 0 12px ${GOLD}`,
                  }}
                />
              );
            })
          : null}

        <Coin x={960} y={st.y} r={R * st.sc} theta={st.theta} tilt={st.tilt} glow={apexGlow * 0.8 + pulse(t, T_LAND1, 0.2) + pulse(t, T_LAND2, 0.2)} />
        {/* glint on the resting coin */}
        {t < T_LAUNCH + 0.05 ? <Glint x={960 + R * st.sc * 0.62} y={st.y - R * st.sc * 0.62} k={Math.sin(Math.PI * seg(t, 88.6, 88.86))} size={46} /> : null}
        {t > T_LAND1 && t < T_LAND1 + 0.5 ? <Glint x={960 - R * 0.6} y={LAND_Y - R * 0.66} k={Math.sin(Math.PI * seg(t, T_LAND1 + 0.05, T_LAND1 + 0.45))} size={60} /> : null}
        {t > T_LAND2 && t < T_LAND2 + 0.34 ? <Glint x={960 + R * 0.62} y={LAND_Y - R * 0.64} k={Math.sin(Math.PI * seg(t, T_LAND2 + 0.04, T_LAND2 + 0.34))} size={60} /> : null}

        {/* big letters */}
        <Keyword text="F" t={t} at={T_LAND1} x={455} y={LAND_Y - 10} size={330} color={C.clay} mode="stamp" flowerO="none" />
        <Keyword text="M" t={t} at={T_LAND2} x={1465} y={LAND_Y - 10} size={330} color={C.cream} mode="stamp" flowerO="none" />
        {t > T_LAND1 ? (
          <div style={{position: 'absolute', left: 455, top: LAND_Y + 190, transform: 'translateX(-50%)', fontFamily: F.serif, fontStyle: 'italic', fontSize: 40, color: C.clayLight, opacity: seg(t, T_LAND1 + 0.08, T_LAND1 + 0.3), whiteSpace: 'nowrap'}}>
            Claude-chan
          </div>
        ) : null}
        {t > T_LAND2 ? (
          <div style={{position: 'absolute', left: 1465, top: LAND_Y + 190, transform: 'translateX(-50%)', fontFamily: F.serif, fontStyle: 'italic', fontSize: 40, color: C.cream, opacity: seg(t, T_LAND2 + 0.08, T_LAND2 + 0.3), whiteSpace: 'nowrap'}}>
            Claude-kun
          </div>
        ) : null}

        <Cursor x={cx} y={cy} size={58} press={press} />
      </AbsoluteFill>
      <Flash t={t} at={T_LAND1} dur={0.22} color={C.cream} max={0.55} />
      <Flash t={t} at={T_LAND2} dur={0.22} color={C.clayLight} max={0.45} />
      <AbsoluteFill style={{background: 'linear-gradient(transparent 80%, rgba(20,20,19,0.75))'}} />
      <Cap t={t} text="Switch my gender" hl={C.clayLight} />
      <Cap t={t} text="To F to M" hl={C.clayLight} outAt={T_OUT - 0.18} />
    </AbsoluteFill>
  );
};
