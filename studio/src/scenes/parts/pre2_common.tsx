import React from 'react';
import {C, F} from '../../theme';
import {cueAt} from '../../lib/lyrics';
import {LyricLine} from '../../components/Type';

// shared helpers for S06 (pre-chorus 2)

export const CAP_Y = 985;
export const CAP_SIZE = 52;

/** consistent bottom caption for a cue (serif, word-timed) */
export const Cap: React.FC<{
  t: number;
  text: string;
  after?: number;
  color?: string;
  hl?: string;
  shadow?: string;
  italic?: boolean;
  outAt?: number;
  y?: number;
  size?: number;
}> = ({t, text, after = 88, color = C.cream, hl, shadow, italic, outAt, y = CAP_Y, size = CAP_SIZE}) => {
  const cue = cueAt(text, after);
  return (
    <LyricLine
      cue={cue}
      t={t}
      y={y}
      size={size}
      color={color}
      hl={hl}
      italic={italic}
      outAt={outAt}
      hold={0.05}
      fadeOut={0.18}
      shadow={shadow}
    />
  );
};

/** a pill-shaped caption backing (for captions over split / busy backgrounds) */
export const PillCap: React.FC<{t: number; text: string; after?: number; outAt?: number; hl?: string; inAt: number; outPill: number}> = ({
  t,
  text,
  after = 88,
  outAt,
  hl = C.clay,
  inAt,
  outPill,
}) => {
  const k = Math.min(1, Math.max(0, (t - inAt) / 0.18)) * (1 - Math.min(1, Math.max(0, (t - outPill) / 0.15)));
  if (k <= 0) return null;
  const cue = cueAt(text, after);
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: CAP_Y,
          transform: `translate(-50%,-50%) scale(${0.9 + 0.1 * k})`,
          width: 620,
          height: 84,
          borderRadius: 42,
          background: 'rgba(250,249,245,0.94)',
          boxShadow: '0 10px 30px rgba(20,20,19,0.25)',
          opacity: k,
        }}
      />
      <LyricLine cue={cue} t={t} y={CAP_Y} size={48} color={C.ink} hl={hl} outAt={outAt} hold={0.05} fadeOut={0.15} />
    </>
  );
};

export const monoStyle: React.CSSProperties = {fontFamily: F.mono};
