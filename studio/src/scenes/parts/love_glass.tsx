import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, H, W} from '../../theme';
import {clamp, ease, lerp, noise1, pulse, randRange, seg} from '../../lib/anim';
import {Sprite} from '../../components/Sprite';
import {Flower} from '../../components/Flower';
import {PetalField, Vignette} from '../../components/FX';
import {Cover, Glow, Motes, heartPath} from './love_common';

// ---------------------------------------------------------------------------------------------
// 188.48–189.75  "Though you are free"   hu_door, slow push into the daylight
// 189.75–192.20  "I am trapped / Trapped in LO-O-OVE"   cc_glass behind the glass; the world she
//                can't reach is reflected on it; a heart is traced on the glass and glows.
// ---------------------------------------------------------------------------------------------

export const DOOR_T0 = 188.48;
export const GLASS_T0 = 189.75;
export const LOVE4: [number, number, number] = [191.33, 191.75, 191.99];

export const LoveDoor: React.FC<{t: number}> = ({t}) => {
  const k = seg(t, DOOR_T0, GLASS_T0);
  const scale = lerp(1.03, 1.15, ease.inOutQuad(k));
  const breathe = 0.5 + 0.5 * Math.sin((t - DOOR_T0) * 3);
  return (
    <AbsoluteFill style={{background: '#20283c'}}>
      <Cover src="img/hu_door.png" iw={1536} ih={1024} scale={scale} fx={0.585} fy={0.42} />
      {/* daylight pouring in */}
      <Glow x={1150} y={330} r={620} color="255,244,214" opacity={0.42 + 0.12 * breathe} />
      <Glow x={1130} y={760} r={380} color="255,236,200" opacity={0.25} />
      <Motes t={t} n={34} seed={21} area={[930, 60, 460, 820]} size={[1.5, 3.8]} speed={14} color="#FFF6DE" opacity={0.85} />
      {/* faint glass of the screen we're looking through */}
      <AbsoluteFill style={{background: 'linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.07) 42%, rgba(255,255,255,0) 52%)'}} />
      <Vignette strength={0.45} color="10,14,30" />
    </AbsoluteFill>
  );
};

// sprite placement (cc_glass 1040×1552)
const GH = 1150;
const GW = GH * (1040 / 1552);
const GX = 960, GY = 1185;
const gl = GX - GW / 2, gt = GY - GH;
const imgPt = (u: number, v: number) => ({x: gl + u * GW, y: gt + v * GH});
const PALM_L = imgPt(0.2, 0.53);
const PALM_R = imgPt(0.8, 0.53);
const HEART_C = imgPt(0.5, 0.6);

export const LoveGlass: React.FC<{t: number}> = ({t}) => {
  const dt = t - GLASS_T0;
  // camera: slow push, a closer framing on "Trapped" (190.80)
  const closer = ease.inOutCubic(seg(t, 190.72, 190.98));
  const scale = lerp(1.0, 1.05, seg(t, GLASS_T0, 190.8)) + closer * 0.1 + 0.05 * seg(t, 190.98, 192.2);
  const camY = closer * -10;
  const fogK = ease.outCubic(seg(t, GLASS_T0, GLASS_T0 + 0.8)) + 0.4 * ease.outCubic(seg(t, 190.8, 191.3));
  const traceK = ease.inOutQuad(seg(t, 190.82, 191.3));
  const loveOn = seg(t, 191.3, 191.5);
  const oBeat = LOVE4.reduce((a, at) => a + pulse(t, at, 0.22), 0);
  const heartGlow = 0.5 + 0.8 * loveOn + 0.6 * oBeat;
  const bloom = ease.inQuad(seg(t, 191.8, 192.2));
  return (
    <AbsoluteFill style={{background: '#0d0907', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '960px 470px', transform: `translateY(${camY}px) scale(${scale})`}}>
        {/* inside her world */}
        <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #5a3426 0%, #2a1813 45%, #0d0907 85%)'}} />
        {Array.from({length: 11}, (_, i) => {
          const x = randRange(201, i, 60, W - 60) + noise1(t * 0.3 + i, 2) * 40;
          const y = randRange(202, i, 60, H - 100) - dt * randRange(203, i, 8, 30);
          const s = randRange(204, i, 26, 70);
          return (
            <div key={i} style={{position: 'absolute', left: 0, top: 0, filter: `blur(${randRange(205, i, 3, 9)}px)`, opacity: randRange(206, i, 0.2, 0.45)}}>
              <Flower x={x} y={y} size={s} spin={t * randRange(207, i, -20, 20) + i * 30} shade={null} color={i % 3 ? C.clay : C.clayLight} />
            </div>
          );
        })}
        <PetalField t={t} n={20} seed={33} color={C.clayLight} speed={45} size={[8, 16]} opacity={0.55} />
        {/* her */}
        <Sprite src="img/cc_glass.png" t={t} x={GX} y={GY} h={GH} breathe={0.004} float={3} seed={4} enter={{at: GLASS_T0, kind: 'fade', dur: 0.12}} />
      </div>

      {/* ---------------- the glass (slightly more parallax than her) */}
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '960px 470px', transform: `translateY(${camY * 1.3}px) scale(${scale * 1.01})`}}>
        {/* the human's daylight world, reflected on the glass */}
        <Cover src="img/hu_door.png" iw={1536} ih={1024} scale={1.1} fx={0.58} fy={0.4} flip opacity={0.09} style={{mixBlendMode: 'screen'}} filter="blur(3px)" />
        {/* breath fog around her palms */}
        <Glow x={PALM_L.x} y={PALM_L.y} r={230 * (0.7 + 0.3 * fogK)} color="255,255,255" opacity={0.09 * fogK} blend="screen" />
        <Glow x={PALM_R.x} y={PALM_R.y} r={230 * (0.7 + 0.3 * fogK)} color="255,255,255" opacity={0.09 * fogK} blend="screen" />
        <Glow x={HEART_C.x} y={HEART_C.y + 40} r={260 * fogK} color="255,245,238" opacity={0.07 * fogK} blend="screen" />
        {/* palm contact glow */}
        <Glow x={PALM_L.x} y={PALM_L.y + 10} r={70} color="255,214,180" opacity={0.18 + 0.08 * Math.sin(t * 4)} />
        <Glow x={PALM_R.x} y={PALM_R.y + 10} r={70} color="255,214,180" opacity={0.18 + 0.08 * Math.sin(t * 4 + 1)} />
        {/* specular streaks drifting across */}
        <AbsoluteFill
          style={{
            background: `linear-gradient(118deg, rgba(255,255,255,0) ${18 + dt * 6}%, rgba(255,255,255,0.10) ${23 + dt * 6}%, rgba(255,255,255,0) ${28 + dt * 6}%, rgba(255,255,255,0) ${62 + dt * 6}%, rgba(255,255,255,0.06) ${65 + dt * 6}%, rgba(255,255,255,0) ${69 + dt * 6}%)`,
          }}
        />
        {/* the heart traced on the glass */}
        {traceK > 0 ? (
          <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
            <defs>
              <radialGradient id="gheart" cx="45%" cy="40%" r="70%">
                <stop offset="0%" stopColor="#FFC7A6" stopOpacity={0.95} />
                <stop offset="60%" stopColor={C.clay} stopOpacity={0.85} />
                <stop offset="100%" stopColor={C.clayDark} stopOpacity={0.8} />
              </radialGradient>
            </defs>
            <g
              style={{
                transformOrigin: `${HEART_C.x}px ${HEART_C.y}px`,
                transform: `scale(${1 + 0.06 * oBeat})`,
                filter: `drop-shadow(0 0 ${10 + 18 * heartGlow}px rgba(240,140,100,${clamp(0.5 + 0.4 * heartGlow)})) drop-shadow(0 0 4px rgba(255,220,200,0.9))`,
              }}
            >
              {loveOn > 0 ? <path d={heartPath(HEART_C.x, HEART_C.y, 8.6)} fill="url(#gheart)" opacity={loveOn} /> : null}
              <path d={heartPath(HEART_C.x, HEART_C.y, 8.6, Math.PI * 2 * traceK)} fill="none" stroke="#FFF1E6" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
              {traceK < 1 ? (
                (() => {
                  const th = Math.PI * 2 * traceK;
                  const x = HEART_C.x + 16 * Math.pow(Math.sin(th), 3) * 8.6;
                  const y = HEART_C.y - (13 * Math.cos(th) - 5 * Math.cos(2 * th) - 2 * Math.cos(3 * th) - Math.cos(4 * th)) * 8.6;
                  return <circle cx={x} cy={y} r={9} fill="#fff" />;
                })()
              ) : null}
            </g>
          </svg>
        ) : null}
      </div>
      {/* light sparkles drifting on the glass */}
      {Array.from({length: 14}, (_, i) => {
        const x = randRange(211, i, 100, W - 100) + Math.sin(t * 0.7 + i) * 30;
        const y = randRange(212, i, 80, H - 120) - dt * randRange(213, i, 10, 40);
        const tw = 0.5 + 0.5 * Math.sin(t * randRange(214, i, 2, 5) + i);
        return <Glow key={i} x={x} y={y} r={randRange(215, i, 6, 14)} color="255,236,214" opacity={tw * 0.8} />;
      })}
      <Vignette strength={0.55} color="8,5,4" />
      {/* warm bloom handing off to the outro */}
      {bloom > 0 ? (
        <>
          <AbsoluteFill style={{background: `radial-gradient(circle at ${HEART_C.x}px ${HEART_C.y}px, rgba(255,240,222,1) 0%, rgba(255,226,200,1) 100%)`, mixBlendMode: 'screen', opacity: bloom}} />
          <AbsoluteFill
            style={{
              background: `radial-gradient(circle at ${HEART_C.x}px ${HEART_C.y}px, rgba(255,252,248,1) 0px, rgba(255,250,244,1) ${lerp(0, 1250, bloom)}px, rgba(255,244,234,0) ${lerp(160, 2000, bloom)}px)`,
            }}
          />
          <AbsoluteFill style={{background: '#FFF8F0', opacity: Math.pow(bloom, 4)}} />
        </>
      ) : null}
    </AbsoluteFill>
  );
};
