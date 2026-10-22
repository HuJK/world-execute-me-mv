import lyricsData from '../data/lyrics.json';

export type Word = {w: string; s: number; e: number};
export type Cue = {start: number; end: number; text: string; words: Word[]};

export const CUES: Cue[] = (lyricsData as any[]).map((c) => ({
  start: c.start,
  end: c.end,
  text: c.text.replace('’', "'"),
  words: c.words,
}));

export const isCaps = (c: Cue) => c.text === c.text.toUpperCase() && /[A-Z]/.test(c.text) && !c.text.includes('world.');

/** cue whose text matches (first occurrence after `after`) */
export const cueAt = (text: string, after = 0): Cue => {
  const c = CUES.find((x) => x.text === text && x.start >= after - 0.01);
  if (!c) throw new Error('cue not found: ' + text + ' @' + after);
  return c;
};

/** cues overlapping [a,b) */
export const cuesIn = (a: number, b: number) => CUES.filter((c) => c.start < b && c.end > a);

/** time the i-th word of the cue starting near t is sung */
export const wordTime = (cue: Cue, i: number) => cue.words[Math.min(i, cue.words.length - 1)].s;
