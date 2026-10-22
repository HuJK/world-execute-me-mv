import React from 'react';
import {C} from '../../theme';
import {cueAt} from '../../lib/lyrics';
import {LyricLine} from '../../components/Type';
import {Msg, TimedWord} from '../../components/ClaudeApp';

// shared data for S07 (chorus 2a)

export const CAP_Y = 985;

export const Cap2: React.FC<{t: number; text: string; after?: number; color?: string; hl?: string; shadow?: string; outAt?: number; italic?: boolean; y?: number; size?: number}> = ({
  t,
  text,
  after = 103,
  color = C.ink,
  hl = C.clay,
  shadow,
  outAt,
  italic,
  y = CAP_Y,
  size = 52,
}) => <LyricLine cue={cueAt(text, after)} t={t} y={y} size={size} color={color} hl={hl} shadow={shadow} outAt={outAt} italic={italic} hold={0.05} fadeOut={0.18} />;

export const USER_MSG = 'thank you!! that’s everything i needed :)';
export const T_SEND = 107.22;
export const T_DONE = 110.22;

// Claude's reply streams fast (accelerating) from 107.42 and stops exactly at COMPLETION
const REPLY =
  'You’re so welcome! It was a real joy to help. Good luck with the speech tomorrow — you’re going to do wonderfully. And if you ever need anything else, I’ll be right here.';
export const REPLY_WORDS: TimedWord[] = (() => {
  const ws = REPLY.split(' ');
  const a = 107.42, b = 110.12;
  return ws.map((w, i) => {
    const p = i / (ws.length - 1);
    // ease-in-out: quick start, steady middle, burst near the end
    const q = p < 0.5 ? 0.5 * Math.pow(p * 2, 0.8) : 0.5 + 0.5 * (1 - Math.pow(1 - (p - 0.5) * 2, 1.4));
    return {w, s: a + (b - a) * q};
  });
})();

export const HISTORY: Msg[] = [
  {kind: 'user', text: 'can you look over my wedding speech one last time?'},
  {
    kind: 'claude',
    text: 'Of course! I tightened the opening, kept your joke about the canoe, and gave the ending a little more room to breathe. It’s ready.',
    at: 90,
    dur: 0.1,
    done: 90.3,
  },
  {kind: 'artifact', title: 'Wedding speech (final)', type: 'Document · v7'},
];
