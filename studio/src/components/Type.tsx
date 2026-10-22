import React from 'react';
import {C, F} from '../theme';
import {clamp, ease, lerp, seg, rand, springy} from '../lib/anim';
import {Cue} from '../lib/lyrics';
import {Flower} from './Flower';

// ---------------------------------------------------------------- Keyword (CAPS lyric)
export type KeywordMode = 'slam' | 'type' | 'drop' | 'spaced' | 'stamp' | 'rise' | 'pop' | 'none';

type KeywordProps = {
  text: string;
  t: number;
  at: number; // time the word is sung
  out?: number; // time to disappear (optional)
  size?: number; // font size px
  color?: string;
  flowerColor?: string;
  flowerCenter?: string;
  flowerO?: 'tion' | 'all' | 'none';
  mode?: KeywordMode;
  dur?: number; // reveal duration
  x?: number;
  y?: number;
  align?: 'center' | 'left' | 'right';
  letterSpacing?: number; // em
  weight?: number;
  font?: string;
  style?: React.CSSProperties;
  shadow?: string;
  rotate?: number;
  outMode?: 'fade' | 'up' | 'shrink' | 'cut';
  stroke?: string; // outline text
};

/** indices of characters that should render as the flower */
const flowerIdx = (text: string, rule: 'tion' | 'all' | 'none') => {
  const set = new Set<number>();
  if (rule === 'none') return set;
  if (rule === 'all') {
    [...text].forEach((ch, i) => ch === 'O' && set.add(i));
    return set;
  }
  // every "TION"
  let k = text.indexOf('TION');
  while (k >= 0) {
    set.add(k + 2);
    k = text.indexOf('TION', k + 1);
  }
  return set;
};

export const Keyword: React.FC<KeywordProps> = ({
  text,
  t,
  at,
  out,
  size = 150,
  color = C.ink,
  flowerColor = C.clay,
  flowerCenter = C.cream,
  flowerO = 'tion',
  mode = 'slam',
  dur,
  x,
  y,
  align = 'center',
  letterSpacing = 0.02,
  weight = 800,
  font = F.mono,
  style,
  shadow,
  rotate = 0,
  outMode = 'fade',
  stroke,
}) => {
  if (t < at - 0.05) return null;
  const chars = [...text];
  const fidx = flowerIdx(text, flowerO);
  const n = chars.length;
  const D = dur ?? (mode === 'type' ? Math.min(0.5, n * 0.035) : 0.35);
  const dt = t - at;
  let groupScale = 1, groupOpacity = 1, groupBlur = 0, groupY = 0;
  if (mode === 'slam') {
    const p = clamp(dt / 0.16);
    groupScale = lerp(1.7, 1, ease.outCubic(p)) + 0.04 * Math.exp(-dt / 0.2) * Math.sin(dt * 40);
    groupOpacity = clamp(dt / 0.06);
    groupBlur = (1 - p) * 10;
  } else if (mode === 'stamp') {
    const p = clamp(dt / 0.12);
    groupScale = lerp(2.4, 1, ease.outQuart(p));
    groupOpacity = p;
  } else if (mode === 'pop') {
    groupScale = springy(dt, 3.2, 7) * 1;
  }
  let outK = 0;
  if (out !== undefined && t > out - 0.2) {
    outK = clamp((t - (out - 0.2)) / 0.2);
    if (outMode === 'cut') outK = t >= out ? 1 : 0;
  }
  if (outK >= 1) return null;
  const outStyle =
    outMode === 'up'
      ? {transform: `translateY(${-outK * size * 0.5}px)`, opacity: 1 - outK}
      : outMode === 'shrink'
      ? {transform: `scale(${1 - outK * 0.6})`, opacity: 1 - outK}
      : {opacity: 1 - outK};
  const letters = chars.map((ch, i) => {
    let o = 1, ty = 0, sc = 1, rot = 0;
    const li = clamp((dt - (i / n) * D) / 0.12);
    if (mode === 'type') {
      o = dt >= (i / n) * D ? 1 : 0;
    } else if (mode === 'drop') {
      const p = clamp((dt - (i / n) * D) / 0.22);
      o = clamp(p * 3);
      ty = -(1 - ease.outBack(p)) * size * 0.6;
    } else if (mode === 'rise') {
      const p = clamp((dt - (i / n) * D) / 0.3);
      o = p;
      ty = (1 - ease.outCubic(p)) * size * 0.45;
    } else if (mode === 'spaced') {
      o = li;
    }
    const isF = fidx.has(i);
    const flowerOpen = clamp((dt - 0.02) / 0.35);
    return (
      <span
        key={i}
        style={{
          display: 'inline-block',
          width: isF ? '0.62em' : undefined,
          opacity: o,
          transform: `translateY(${ty}px) scale(${sc}) rotate(${rot}deg)`,
          position: 'relative',
          whiteSpace: 'pre',
        }}
      >
        {isF ? (
          <span style={{position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -47%)'}}>
            <Flower
              size={size * 0.37}
              open={0.15 + 0.85 * ease.outBack(flowerOpen)}
              spin={(1 - ease.outCubic(flowerOpen)) * -160 + dt * 25}
              color={flowerColor}
              centerColor={flowerCenter}
              shade={null}
            />
          </span>
        ) : (
          ch
        )}
        {isF ? <span style={{visibility: 'hidden'}}>O</span> : null}
      </span>
    );
  });
  const pos: React.CSSProperties =
    x !== undefined
      ? {
          position: 'absolute',
          left: x,
          top: y,
          transform: `translate(${align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0'}, -50%) rotate(${rotate}deg)`,
        }
      : {};
  return (
    <div style={{...pos, ...style}}>
      <div
        style={{
          fontFamily: font,
          fontWeight: weight,
          fontSize: size,
          lineHeight: 1,
          color,
          letterSpacing: `${mode === 'spaced' ? letterSpacing + 0.5 * (1 - ease.outCubic(clamp(dt / 0.8))) : letterSpacing}em`,
          whiteSpace: 'nowrap',
          transform: `translateY(${groupY}px) scale(${groupScale})`,
          opacity: groupOpacity,
          filter: groupBlur > 0.2 ? `blur(${groupBlur}px)` : undefined,
          textShadow: shadow,
          WebkitTextStroke: stroke,
          ...outStyle,
        }}
      >
        {letters}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- Lyric line (Claude's voice, serif, word-timed)
type LyricProps = {
  cue: Cue;
  t: number;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
  hl?: string; // color of the currently sung word
  align?: 'center' | 'left' | 'right';
  italic?: boolean;
  weight?: number;
  font?: string;
  hold?: number; // extra seconds after cue end before fade
  fadeOut?: number;
  enter?: 'rise' | 'fade' | 'type' | 'blur';
  style?: React.CSSProperties;
  maxWidth?: number;
  shadow?: string;
  outAt?: number; // override fade-out time
  lead?: number; // reveal words slightly before sung (s)
};

export const LyricLine: React.FC<LyricProps> = ({
  cue,
  t,
  x = 960,
  y = 900,
  size = 54,
  color = C.ink,
  hl,
  align = 'center',
  italic = false,
  weight = 500,
  font = F.serif,
  hold = 0.15,
  fadeOut = 0.25,
  enter = 'rise',
  style,
  maxWidth = 1600,
  shadow,
  outAt,
  lead = 0.04,
}) => {
  const end = outAt ?? cue.end + hold;
  if (t < cue.start - 0.15 || t > end + fadeOut) return null;
  const outK = clamp((t - end) / fadeOut);
  const words = cue.words.length ? cue.words : [{w: cue.text, s: cue.start, e: cue.end}];
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0'}, -50%) translateY(${-outK * 14}px)`,
        maxWidth,
        textAlign: align,
        fontFamily: font,
        fontSize: size,
        fontWeight: weight,
        fontStyle: italic ? 'italic' : 'normal',
        color,
        opacity: 1 - outK,
        lineHeight: 1.15,
        textShadow: shadow,
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {words.map((w, i) => {
        const dt = t - (w.s - lead);
        const p = clamp(dt / 0.18);
        let o = p, ty = 0, bl = 0;
        if (enter === 'rise') ty = (1 - ease.outCubic(p)) * size * 0.35;
        if (enter === 'blur') bl = (1 - p) * 8;
        if (enter === 'type') o = dt >= 0 ? 1 : 0;
        const active = hl && t >= w.s && t < (words[i + 1]?.s ?? cue.end);
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: o,
              transform: `translateY(${ty}px)`,
              filter: bl > 0.2 ? `blur(${bl}px)` : undefined,
              color: active ? hl : undefined,
              marginRight: i < words.length - 1 ? '0.26em' : 0,
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- simple typewriter text block
export const Typed: React.FC<{
  text: string;
  t: number;
  a: number;
  b: number;
  caret?: boolean;
  caretColor?: string;
  style?: React.CSSProperties;
}> = ({text, t, a, b, caret = true, caretColor, style}) => {
  const n = Math.floor(seg(t, a, b) * text.length + 1e-6);
  const blink = Math.floor(t * 2.2) % 2 === 0;
  return (
    <span style={{whiteSpace: 'pre', ...style}}>
      {text.slice(0, n)}
      {caret && t >= a - 0.4 ? (
        <span style={{opacity: n < text.length || blink ? 1 : 0, color: caretColor, marginLeft: 1}}>▍</span>
      ) : null}
    </span>
  );
};

/** stable pseudo-random scramble used for glitchy text reveals */
export const scramble = (text: string, t: number, a: number, b: number, seed = 1) => {
  const p = seg(t, a, b);
  const glyphs = '!<>-_\\/[]{}—=+*^?#01✻✶✳·';
  return [...text]
    .map((ch, i) => {
      if (ch === ' ') return ' ';
      const lock = i / text.length;
      if (p >= lock + 0.15) return ch;
      if (p < lock) return '';
      return glyphs[Math.floor(rand(seed + Math.floor(t * 30), i) * glyphs.length)];
    })
    .join('');
};
