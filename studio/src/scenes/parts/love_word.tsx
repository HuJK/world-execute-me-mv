import React from 'react';
import {C, F} from '../../theme';
import {clamp, ease, lerp, seg, springy} from '../../lib/anim';
import {kickPulse} from '../../lib/audio';
import {Flower} from '../../components/Flower';

// ---------------------------------------------------------------------------------------------
// LO-O-OVE — bespoke keyword: the three O's are flowers that bloom one by one on the sung
// syllables and keep swelling while the note is held; on exit the petals drift away.
// ---------------------------------------------------------------------------------------------

type Glyph = {ch: string; w: number; kind: 'l' | 'o' | 'h'; idx: number; part: 0 | 1 | 2};
// widths in em
const GLYPHS: Glyph[] = [
  {ch: 'L', w: 0.64, kind: 'l', idx: 0, part: 0},
  {ch: 'O', w: 0.98, kind: 'o', idx: 0, part: 0},
  {ch: '-', w: 0.46, kind: 'h', idx: 0, part: 1},
  {ch: 'O', w: 0.98, kind: 'o', idx: 1, part: 1},
  {ch: '-', w: 0.46, kind: 'h', idx: 1, part: 2},
  {ch: 'O', w: 0.98, kind: 'o', idx: 2, part: 2},
  {ch: 'V', w: 0.64, kind: 'l', idx: 1, part: 2},
  {ch: 'E', w: 0.64, kind: 'l', idx: 2, part: 2},
];
export const LOVE_WIDTH_EM = GLYPHS.reduce((a, g) => a + g.w, 0);

/** centre x offset (em, relative to word centre) of the i-th flower O */
export const loveOX = (i: number) => {
  let x = -LOVE_WIDTH_EM / 2;
  for (const g of GLYPHS) {
    if (g.kind === 'o' && g.idx === i) return x + g.w / 2;
    x += g.w;
  }
  return 0;
};

export type LoveWordProps = {
  t: number;
  times: [number, number, number]; // syllable (bloom) times of the three O's
  end: number; // end of the held note
  out: number; // time the word starts leaving
  x: number;
  y: number;
  size: number;
  color?: string;
  flowerColor?: string;
  flowerShade?: string | null;
  centerColor?: string;
  glow?: number; // 0..1 halo behind the word
  glowColor?: string;
  textShadow?: string;
  outMode?: 'drift' | 'fade' | 'none';
  flowerScale?: number;
  kick?: boolean; // beat on kicks while held
  hideFlowers?: boolean[]; // allow the scene to take over a flower
  opacity?: number;
};

export const LoveWord: React.FC<LoveWordProps> = ({
  t,
  times,
  end,
  out,
  x,
  y,
  size,
  color = C.ink,
  flowerColor = C.clay,
  flowerShade = C.clayDark,
  centerColor = C.cream,
  glow = 0,
  glowColor = '255,240,225',
  textShadow,
  outMode = 'drift',
  flowerScale = 1,
  kick = true,
  hideFlowers,
  opacity = 1,
}) => {
  if (t < times[0] - 0.08) return null;
  if (outMode === 'none' && t >= out) return null;
  const outK = outMode === 'none' ? 0 : seg(t, out, out + 0.36);
  const outL = outMode === 'none' ? 0 : seg(t, out, out + 0.22); // letters leave faster than petals
  if (outK >= 1) return null;
  // held-note swell for the whole word
  const hold = seg(t, times[0], end);
  const swell = 1 + 0.07 * ease.outCubic(hold) + (kick ? 0.018 * kickPulse(t, 0.14) : 0);
  const totalW = LOVE_WIDTH_EM * size;
  let cx = -totalW / 2;
  const nodes: React.ReactNode[] = [];
  GLYPHS.forEach((g, gi) => {
    const gw = g.w * size;
    const gx = cx + gw / 2;
    cx += gw;
    const at = times[g.part] - (g.kind === 'o' ? 0.02 : 0.05);
    const dt = t - at;
    if (dt < 0) return;
    if (g.kind === 'o') {
      if (hideFlowers?.[g.idx]) return;
      const bloom = clamp(dt / 0.42);
      const held = seg(t, times[g.idx], end + 0.15);
      // later O's are a touch bigger: the note swells
      const base = size * 0.47 * flowerScale * (1 + g.idx * 0.05);
      const s = base * (0.25 + 0.75 * ease.outBack(bloom)) * (1 + 0.1 * ease.outCubic(held));
      const drift = outMode === 'drift' ? ease.inCubic(outK) : 0;
      nodes.push(
        <Flower
          key={gi}
          x={gx}
          y={size * 0.02}
          size={s}
          open={lerp(0.1, 1, ease.outCubic(clamp(dt / 0.5)))}
          stagger={0.5}
          spin={(1 - ease.outCubic(bloom)) * -140 + dt * 14 * (g.idx % 2 ? -1 : 1)}
          color={flowerColor}
          shade={flowerShade}
          centerColor={centerColor}
          glow={0.25 + 0.55 * Math.exp(-dt / 0.35) + 0.35 * held}
          glowColor={flowerColor}
          petals={
            drift > 0
              ? Array.from({length: 12}, (_, i) => ({dist: drift * (1.0 + ((i * 7) % 5) * 0.35), rot: drift * (((i * 37) % 90) - 45), opacity: 1 - drift}))
              : undefined
          }
          opacity={outMode === 'fade' ? 1 - outK : 1}
        />,
      );
    } else if (g.kind === 'h') {
      const p = ease.outCubic(clamp(dt / 0.22));
      nodes.push(
        <div
          key={gi}
          style={{
            position: 'absolute',
            left: gx - gw * 0.3,
            top: -size * 0.055,
            width: gw * 0.6,
            height: size * 0.11,
            borderRadius: size * 0.06,
            background: color,
            transform: `scaleX(${p})`,
            transformOrigin: '0% 50%',
            opacity: 1 - outL,
            boxShadow: textShadow ? undefined : undefined,
          }}
        />,
      );
    } else {
      const p = springy(dt, 3.4, 7.5);
      nodes.push(
        <div
          key={gi}
          style={{
            position: 'absolute',
            left: gx - gw / 2,
            top: -size * 0.56,
            width: gw,
            textAlign: 'center',
            fontFamily: F.mono,
            fontWeight: 800,
            fontSize: size,
            lineHeight: `${size * 1.1}px`,
            color,
            textShadow,
            opacity: clamp(dt / 0.08) * (1 - outL),
            transform: `translateY(${(1 - Math.min(1, p)) * size * 0.25 - outL * size * 0.2}px) scale(${lerp(0.6, 1, Math.min(1.08, p))})`,
            filter: outL > 0.05 ? `blur(${outL * 6}px)` : undefined,
          }}
        >
          {g.ch}
        </div>,
      );
    }
  });
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, transform: `scale(${swell})`, opacity}}>
      {glow > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: -totalW * 0.7,
            top: -size * 1.05,
            width: totalW * 1.4,
            height: size * 2.1,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at 50% 50%, rgba(${glowColor},${0.85 * glow}) 0%, rgba(${glowColor},${0.45 * glow}) 40%, rgba(${glowColor},0) 70%)`,
            opacity: seg(t, times[0] - 0.08, times[0] + 0.2) * (1 - outK),
          }}
        />
      ) : null}
      {nodes}
    </div>
  );
};
