import React from 'react';
import {C, F} from '../../theme';
import {clamp, ease, lerp, mix} from '../../lib/anim';
import {Cue} from '../../lib/lyrics';

// ------------------------------------------------------------------------------------------
// small building blocks for verse 1 ("math role-play")
// ------------------------------------------------------------------------------------------

/** typographic apostrophes for display */
export const prettyCue = (c: Cue): Cue => ({
  ...c,
  text: c.text.replace(/'/g, '’'),
  words: c.words.map((w) => ({...w, w: w.w.replace(/'/g, '’')})),
});

/** extruded (pseudo-3D) mono word: the word literally gains a dimension */
export const Extruded: React.FC<{
  text: string;
  t: number;
  at: number;
  out: number;
  x: number;
  y: number;
  size: number;
  ang: number; // extrusion direction (deg)
  depth: number; // px
  face?: string;
  side0?: string;
  side1?: string;
}> = ({text, t, at, out, x, y, size, ang, depth, face = C.ink, side0 = C.clay, side1 = C.clayDeep}) => {
  const dt = t - at;
  if (dt < -0.02 || t > out + 0.3) return null;
  const p = clamp(dt / 0.16);
  const sc = lerp(1.75, 1, ease.outCubic(p)) + 0.035 * Math.exp(-dt / 0.2) * Math.sin(dt * 42);
  const outK = clamp((t - out) / 0.3);
  const d = depth * ease.outBack(clamp((dt - 0.04) / 0.32)) * (1 - ease.inCubic(outK));
  const N = 18;
  const a = (ang * Math.PI) / 180;
  const style: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    fontFamily: F.mono,
    fontWeight: 800,
    fontSize: size,
    lineHeight: 1,
    letterSpacing: '0.04em',
    whiteSpace: 'nowrap',
  };
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%,-50%) scale(${sc})`,
        opacity: clamp(dt / 0.05) * (1 - outK),
        filter: p < 1 ? `blur(${(1 - p) * 8}px)` : undefined,
      }}
    >
      <div style={{position: 'relative'}}>
        <div style={{...style, position: 'relative', visibility: 'hidden'}}>{text}</div>
        {Array.from({length: N}, (_, i) => {
          const k = (N - i) / N; // back → front
          return (
            <div key={i} style={{...style, color: mix(side0, side1, k), transform: `translate(${Math.cos(a) * d * k}px, ${Math.sin(a) * d * k}px)`}}>
              {text}
            </div>
          );
        })}
        <div style={{...style, color: face}}>{text}</div>
      </div>
    </div>
  );
};

/** The human, sitting: blue cursor arrow perched on a bench with tiny dangling legs.
 *  Local frame: seat contact at (0,0), bench along +x. */
export const SitCursor: React.FC<{x: number; y: number; angle: number; t: number; scale?: number; squash?: number; flail?: number}> = ({
  x,
  y,
  angle,
  t,
  scale = 3.6,
  squash = 0,
  flail = 0,
}) => {
  // legs hang with gravity (cancel the bench angle), swing happily; body leans only partly with the bench
  const sp = 7 + flail * 10;
  const amp = 18 + flail * 25;
  const leg = (key: string, hipX: number, kneeX: number, ph: number, col: string) => {
    const sw = Math.sin(t * sp + ph) * amp;
    return (
      <g key={key}>
        <path d={`M${hipX} -2.2 L${kneeX} -2.2`} stroke="#fff" strokeWidth={4.2} strokeLinecap="round" />
        <g transform={`translate(${kneeX} -2.2) rotate(${-angle * 0.55 + sw})`}>
          <path d="M0 0 L0 6.4" stroke="#fff" strokeWidth={4.2} strokeLinecap="round" />
          <ellipse cx={1.2} cy={7.1} rx={2.6} ry={1.7} fill="#fff" />
        </g>
        <path d={`M${hipX} -2.2 L${kneeX} -2.2`} stroke={col} strokeWidth={2.6} strokeLinecap="round" />
        <g transform={`translate(${kneeX} -2.2) rotate(${-angle * 0.55 + sw})`}>
          <path d="M0 0 L0 6.4" stroke={col} strokeWidth={2.6} strokeLinecap="round" />
          <ellipse cx={1.2} cy={7.1} rx={1.9} ry={1.15} fill={col} />
        </g>
      </g>
    );
  };
  return (
    <svg style={{position: 'absolute', left: x, top: y, overflow: 'visible', filter: 'drop-shadow(0 4px 5px rgba(20,20,19,0.25))'}} width={1} height={1}>
      <g transform={`rotate(${angle}) scale(${scale * (1 + squash * 0.18)} ${scale * (1 - squash * 0.22)}) rotate(${-angle * 0.45})`}>
        {leg('back', 4, 11.5, 1.4, C.blueDeep)}
        {/* arrow body: base flat on the seat, tip up (head), leaning back a little */}
        <g transform={`rotate(-22) translate(-1 -20)`}>
          <path d="M1 1 L1 20 L6 15.5 L9.6 23.5 L13 22 L9.4 14.2 L16 14.2 Z" fill={C.blue} stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
          {/* a tiny happy face */}
          <circle cx={4.1} cy={11.2} r={0.75} fill="#fff" />
          <circle cx={6.6} cy={12.3} r={0.75} fill="#fff" />
        </g>
        {leg('front', 5.5, 13, 0, C.blue)}
      </g>
    </svg>
  );
};

/** degrees helper for arcs (screen coords: 0 = east, clockwise positive) */
export const polar = (cx: number, cy: number, r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as [number, number];
};

/** text set on a circle, letter by letter (manual layout → each letter can pop).
 *  Glyph centers are laid out by advance widths (em) around `center` (deg). Top text runs clockwise, bottom text counter-clockwise. */
export const ArcText: React.FC<{
  text: string;
  cx: number;
  cy: number;
  r: number;
  center: number; // deg
  widths?: number[]; // em advance per glyph (default mono 0.6)
  spacing?: number; // extra em between glyphs
  bottom?: boolean; // reads left→right along the bottom (letters' tops point to center)
  size: number;
  font?: string;
  weight?: number;
  italic?: boolean;
  color: string;
  reveal: (i: number, angle: number) => number; // 0..1 per letter
  pop?: (i: number) => number;
}> = ({text, cx, cy, r, center, widths, spacing = 0, bottom = false, size, font = F.mono, weight = 800, italic = false, color, reveal, pop}) => {
  const chars = [...text];
  const adv = chars.map((_, i) => (widths?.[i] ?? 0.6) + spacing);
  const total = adv.reduce((a, b) => a + b, 0) - spacing;
  let cum = 0;
  const angs = adv.map((w) => {
    const mid = cum + (w - spacing) / 2;
    cum += w;
    return center + (bottom ? -1 : 1) * (((mid - total / 2) * size) / r) * (180 / Math.PI);
  });
  return (
    <g>
      {chars.map((ch, i) => {
        if (ch === ' ') return null;
        const a = angs[i];
        const k = reveal(i, a);
        if (k <= 0.001) return null;
        const [x, y] = polar(cx, cy, r, a);
        const rot = bottom ? a - 90 : a + 90;
        const s = (0.6 + 0.4 * ease.outBack(k)) * (1 + (pop ? pop(i) : 0));
        return (
          <text
            key={i}
            x={0}
            y={0}
            transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}
            textAnchor="middle"
            fontFamily={font}
            fontWeight={weight}
            fontStyle={italic ? 'italic' : 'normal'}
            fontSize={size}
            fill={color}
            opacity={clamp(k * 2)}
          >
            {ch}
          </text>
        );
      })}
    </g>
  );
};

/** a small chat bubble (the human's conversational tangents) */
export const TangentBubble: React.FC<{x: number; y: number; text: string; k: number; tail?: 'left' | 'right'}> = ({x, y, text, k, tail = 'left'}) => {
  if (k <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${tail === 'left' ? '0' : '-100%'}, -50%) scale(${ease.outBack(clamp(k))})`,
        transformOrigin: tail === 'left' ? '0% 50%' : '100% 50%',
        opacity: clamp(k * 3),
        background: '#fff',
        border: `2px solid ${C.blue}`,
        color: C.blueDeep,
        fontFamily: F.sans,
        fontSize: 24,
        fontWeight: 500,
        padding: '8px 16px',
        borderRadius: 18,
        borderBottomLeftRadius: tail === 'left' ? 4 : 18,
        borderBottomRightRadius: tail === 'right' ? 4 : 18,
        whiteSpace: 'nowrap',
        boxShadow: '0 6px 14px rgba(61,110,158,0.18)',
      }}
    >
      {text}
    </div>
  );
};
