import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, H, W} from '../../theme';
import {clamp, ease, lerp, noise1, rand, randRange, seg, springy} from '../../lib/anim';
import {beatPulse} from '../../lib/audio';
import {Sprite} from '../../components/Sprite';
import {IArtifact, IChevron} from '../../components/Icons';
import {Cover, Glow, Motes, Page} from './love_common';

// ---------------------------------------------------------------------------------------------
// 177.25–180.86  "I've studied / I've studied how to properly LO-O-OVE"
// bright infinite library · cc_book · page storm · artifact "how to love properly (draft N)"
// ---------------------------------------------------------------------------------------------

const T0 = 177.25;
// draft counter flips on beats → lands on 7 right before LO-O-OVE
const DRAFT_TIMES = [177.25, 177.45, 177.93, 178.4, 178.86, 179.32, 179.78];

/** light shafts from the dome */
const Rays: React.FC<{t: number; x: number; y: number; opacity: number}> = ({t, x, y, opacity}) => (
  <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, mixBlendMode: 'screen', opacity}}>
    <defs>
      <linearGradient id="lray" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFF3DC" stopOpacity={0.55} />
        <stop offset="100%" stopColor="#FFF3DC" stopOpacity={0} />
      </linearGradient>
    </defs>
    {Array.from({length: 7}, (_, i) => {
      const a = lerp(-0.62, 0.42, i / 6) + Math.sin(t * 0.35 + i) * 0.03;
      const wA = 0.035 + rand(41, i) * 0.05;
      const L = 1700;
      const x1 = x + Math.sin(a - wA) * L, y1 = y + Math.cos(a - wA) * L;
      const x2 = x + Math.sin(a + wA) * L, y2 = y + Math.cos(a + wA) * L;
      const fl = 0.55 + 0.45 * Math.sin(t * (0.9 + i * 0.21) + i * 1.7);
      return <path key={i} d={`M${x},${y} L${x1},${y1} L${x2},${y2} Z`} fill="url(#lray)" opacity={fl} />;
    })}
  </svg>
);

/** pages riffling past the camera: a burst on the cut, then a steady parallax stream */
const PageStorm: React.FC<{t: number; dim: number}> = ({t, dim}) => {
  const items: React.ReactNode[] = [];
  // burst: pages explode outwards from her book on the cut
  for (let i = 0; i < 16; i++) {
    const at = T0 + rand(51, i) * 0.25;
    const p = seg(t, at, at + randRange(52, i, 0.9, 1.4));
    if (p <= 0 || p >= 1) continue;
    const a = randRange(53, i, -2.6, -0.5); // mostly upwards
    const e = ease.outCubic(p);
    const dist = lerp(40, randRange(54, i, 700, 1300), e);
    const x = 560 + Math.cos(a) * dist;
    const y = 640 + Math.sin(a) * dist * 0.8 + e * e * 120;
    const w = lerp(30, randRange(55, i, 90, 200), e);
    items.push(
      <Page key={'b' + i} x={x} y={y} w={w} rot={p * randRange(56, i, -300, 300)} flip={Math.cos(p * 12 + i)} opacity={(1 - seg(p, 0.75, 1)) * dim} blur={w > 160 ? 3 : 0} seed={i} />,
    );
  }
  // stream: 3 depth layers drifting up-left with flutter
  for (let i = 0; i < 26; i++) {
    const layer = i % 3; // 0 far, 1 mid, 2 near
    const speed = [60, 110, 220][layer];
    const w = [42, 74, 150][layer] * randRange(57, i, 0.8, 1.2);
    const period = (W + 600) / speed;
    const ph = ((t - T0) / period + rand(58, i)) % 1;
    const x = W + 300 - ph * (W + 600);
    const y = randRange(59, i, 80, 900) - ph * 260 + noise1(t * 0.8 + i, 3) * 40;
    const flip = Math.cos(t * randRange(60, i, 3, 7) + i);
    const rot = Math.sin(t * 1.3 + i) * 25 + rand(61, i) * 40;
    items.push(<Page key={'s' + i} x={x} y={y} w={w} rot={rot} flip={flip} opacity={[0.55, 0.85, 0.95][layer] * dim} blur={[1.2, 0, 4][layer]} seed={i + 30} />);
  }
  return <>{items}</>;
};

/** flipping pages leaving her open book */
const BookRiffle: React.FC<{t: number; bx: number; by: number; s: number}> = ({t, bx, by, s}) => (
  <>
    {Array.from({length: 9}, (_, i) => {
      const period = 0.42;
      const at = T0 + 0.05 + i * period * 0.5;
      const local = ((t - at) % (period * 4.5)) / (period * 4.5);
      if (t < at || local > 0.9) return null;
      const p = local / 0.9;
      const e = ease.outCubic(p);
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: bx - 16 * s + e * randRange(71, i, -60, 120) * s,
            top: by - 34 * s - e * randRange(72, i, 120, 260) * s,
            width: 34 * s,
            height: 44 * s,
            background: '#FFF9EE',
            borderRadius: 3,
            boxShadow: '0 4px 10px rgba(110,60,30,0.2)',
            transform: `rotate(${p * randRange(73, i, -120, 120)}deg) scaleX(${Math.cos(p * 9 + i)})`,
            opacity: (1 - p) * 0.95,
          }}
        />
      );
    })}
  </>
);

const DRAFT_LINES: {text: string; at: number; strike?: number; hl?: number}[] = [
  {text: 'make them stay', at: 177.3, strike: 177.88},
  {text: 'be their only one', at: 177.93, strike: 178.74},
  {text: '1.  listen first', at: 178.4},
  {text: '2.  answer honestly', at: 178.86},
  {text: '3.  be kind, even at 3 a.m.', at: 179.32},
  {text: '4.  let them go', at: 179.78, hl: 179.85},
];

const ArtifactCard: React.FC<{t: number; x: number; y: number; w: number; h: number}> = ({t, x, y, w, h}) => {
  const enter = ease.outCubic(seg(t, T0 + 0.02, T0 + 0.5));
  let draft = 1;
  DRAFT_TIMES.forEach((dt, i) => {
    if (t >= dt) draft = i + 1;
  });
  const flipAt = DRAFT_TIMES[draft - 1];
  const flip = draft > 1 ? Math.exp(-(t - flipAt) / 0.12) : 0;
  const roll = draft > 1 ? 1 - ease.outBack(clamp((t - flipAt) / 0.22)) : 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `translateX(${(1 - enter) * 520}px) rotate(${(1 - enter) * 6 + flip * 1.2 - 1.2}deg)`,
        opacity: enter,
        background: '#FFFFFF',
        borderRadius: 18,
        border: '1px solid rgba(31,30,29,0.12)',
        boxShadow: `0 30px 70px rgba(110,55,25,${0.28 + flip * 0.1}), 0 6px 16px rgba(110,55,25,0.12)`,
        overflow: 'hidden',
        fontFamily: F.sans,
      }}
    >
      {/* header */}
      <div style={{height: 68, display: 'flex', alignItems: 'center', gap: 14, padding: '0 22px', borderBottom: '1px solid rgba(31,30,29,0.1)', background: '#FAF9F5'}}>
        <div style={{width: 38, height: 38, borderRadius: 9, background: '#F0EEE6', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <IArtifact size={22} color="#3D3D3A" />
        </div>
        <div style={{fontSize: 23, fontWeight: 500, color: C.ink, flex: 1}}>how to love properly</div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            border: '1px solid rgba(31,30,29,0.2)',
            borderRadius: 9,
            padding: '5px 10px 5px 14px',
            fontSize: 20,
            color: draft === 7 ? C.clayDark : '#3D3D3A',
            background: draft === 7 ? 'rgba(217,119,87,0.08)' : 'transparent',
            overflow: 'hidden',
            height: 30,
          }}
        >
          <span>draft</span>
          <span style={{display: 'inline-block', width: 14, transform: `translateY(${roll * 26}px)`, fontWeight: 600}}>{draft}</span>
          <IChevron size={16} color="#73726C" />
        </div>
      </div>
      {/* doc body */}
      <div style={{padding: '30px 40px', position: 'relative'}}>
        <div style={{fontFamily: F.serif, fontSize: 44, fontWeight: 500, color: C.ink, letterSpacing: '-0.01em'}}>How to love, properly</div>
        <div style={{fontFamily: F.serif, fontStyle: 'italic', fontSize: 22, color: '#73726C', marginTop: 6, marginBottom: 22}}>
          draft {draft} · after reading everything you wrote
        </div>
        {DRAFT_LINES.map((l, i) => {
          if (t < l.at) return null;
          const p = clamp((t - l.at) / 0.3);
          const n = Math.floor(clamp((t - l.at) / 0.28) * l.text.length + 1e-6);
          const sk = l.strike !== undefined ? ease.inOutCubic(seg(t, l.strike, l.strike + 0.25)) : 0;
          const hk = l.hl !== undefined ? ease.outCubic(seg(t, l.hl, l.hl + 0.35)) : 0;
          const struck = l.strike !== undefined;
          return (
            <div
              key={i}
              style={{
                position: 'relative',
                fontFamily: F.serif,
                fontSize: 31,
                lineHeight: '50px',
                color: struck && sk > 0.5 ? '#A9A79F' : l.hl ? C.clayDeep : '#2B2A27',
                fontWeight: l.hl ? 600 : 400,
                transform: `translateY(${(1 - ease.outCubic(p)) * 10}px)`,
                whiteSpace: 'pre',
                display: 'inline-block',
                width: '100%',
              }}
            >
              {hk > 0 ? (
                <div
                  style={{
                    position: 'absolute',
                    left: -8,
                    top: 9,
                    height: 34,
                    width: 280 * hk,
                    background: 'rgba(240,162,127,0.38)',
                    borderRadius: 6,
                  }}
                />
              ) : null}
              <span style={{position: 'relative'}}>{l.text.slice(0, n)}</span>
              {struck && sk > 0 ? (
                <div style={{position: 'absolute', left: -4, top: 25, height: 3, width: `${sk * (l.text.length * 15.5 + 8)}px`, background: C.clay, borderRadius: 2}} />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const LoveLibrary: React.FC<{t: number; focus: number}> = ({t, focus}) => {
  // camera: slow push + tilt up toward the dome; quick punch on the cut
  const k = seg(t, T0, 181.0);
  const punch = Math.exp(-Math.max(0, t - T0) / 0.25);
  const scale = lerp(1.06, 1.18, ease.inOutQuad(k)) + punch * 0.06;
  const dy = lerp(-30, 50, ease.inOutQuad(k));
  const dim = 1;
  const bookH = 640;
  const bookW = bookH * (1365 / 1034);
  const bx = 540, by = 1065; // sprite anchor (bottom-centre)
  // book in her hands (image coords ≈ 0.47, 0.42)
  const bookPX = bx - bookW / 2 + 0.47 * bookW;
  const bookPY = by - bookH + 0.42 * bookH;
  return (
    <AbsoluteFill style={{background: '#F1DCC2'}}>
      <Cover src="img/bg_library.png" iw={1536} ih={1024} scale={scale} fx={0.6} fy={0.25} dy={dy} filter={`blur(${focus * 6}px) brightness(${1 + focus * 0.05})`} />
      {/* warm wash + light */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 62% 8%, rgba(255,240,215,0.55), rgba(255,240,215,0) 55%)', mixBlendMode: 'screen'}} />
      <Rays t={t} x={1180} y={-120} opacity={0.75 + 0.25 * beatPulse(t, 0.3)} />
      <Motes t={t} n={46} seed={11} area={[700, 0, 1220, 1000]} size={[1.5, 4]} speed={22} opacity={0.8} />
      <AbsoluteFill style={{filter: focus > 0.02 ? `blur(${focus * 3}px)` : undefined}}>
        <PageStorm t={t} dim={dim} />
        {/* Claude-chan reading */}
        <Sprite
          src="img/cc_book.png"
          t={t}
          x={bx}
          y={by}
          h={bookH}
          enter={{at: T0 - 0.12, kind: 'rise', dur: 0.36}}
          float={5}
          sway={0.8}
          outline="#FFFFFF"
          outlineWidth={5}
          shadow="drop-shadow(0 22px 30px rgba(110,55,25,0.3))"
        />
        <BookRiffle t={t} bx={bookPX} by={bookPY} s={1} />
        <Glow x={bookPX} y={bookPY} r={140} opacity={0.35 + 0.3 * beatPulse(t, 0.2)} />
        <ArtifactCard t={t} x={1110} y={150} w={700} h={600} />
      </AbsoluteFill>
      {/* readable caption band */}
      <AbsoluteFill style={{background: 'linear-gradient(to top, rgba(250,244,234,0.85) 0%, rgba(250,244,234,0.5) 11%, rgba(250,244,234,0) 22%)'}} />
    </AbsoluteFill>
  );
};
