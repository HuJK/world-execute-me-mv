import beatsData from '../data/beats.json';
import envData from '../data/env.json';
import {lastIndex, clamp} from './anim';

export const BEATS: number[] = beatsData.beats;
export const DOWNBEATS: number[] = beatsData.downbeats;
export const KICKS: number[] = beatsData.kicks;
export const BPM: number = beatsData.bpm;
export const BEAT = 60 / BPM;
export const BAR = BEAT * 4;

const ENV_FPS = 60;
const sample = (arr: number[], t: number) => {
  const x = t * ENV_FPS;
  const i = Math.floor(x);
  if (i < 0) return arr[0];
  if (i >= arr.length - 1) return arr[arr.length - 1];
  const f = x - i;
  return arr[i] * (1 - f) + arr[i + 1] * f;
};
/** smoothed envelope value (0..1) */
export const env = (name: 'rms' | 'low' | 'mid' | 'high' | 'onsetEnv', t: number, smooth = 0) => {
  const a = (envData as any)[name] as number[];
  if (!smooth) return sample(a, t);
  let s = 0, n = 0;
  for (let k = -3; k <= 3; k++) {
    s += sample(a, t + (k * smooth) / 3);
    n++;
  }
  return s / n;
};

/** pulse that peaks at each beat and decays */
export const beatPulse = (t: number, tau = 0.12, list: number[] = BEATS) => {
  const i = lastIndex(list, t);
  if (i < 0) return 0;
  return Math.exp(-(t - list[i]) / tau);
};
export const downbeatPulse = (t: number, tau = 0.25) => beatPulse(t, tau, DOWNBEATS);
export const kickPulse = (t: number, tau = 0.12) => beatPulse(t, tau, KICKS);

/** index of the current beat and phase inside it */
export const beatInfo = (t: number) => {
  const i = lastIndex(BEATS, t);
  if (i < 0) return {i: -1, phase: 0};
  const next = BEATS[i + 1] ?? BEATS[i] + BEAT;
  return {i, phase: clamp((t - BEATS[i]) / (next - BEATS[i]))};
};
/** nearest beat time at or after t */
export const nextBeat = (t: number) => BEATS.find((b) => b >= t) ?? t;
export const prevBeat = (t: number) => {
  const i = lastIndex(BEATS, t);
  return i < 0 ? 0 : BEATS[i];
};
