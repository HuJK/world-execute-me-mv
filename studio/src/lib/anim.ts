// Time-based animation helpers. All times are absolute song seconds.

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const inv = (a: number, b: number, x: number) => (b === a ? (x >= b ? 1 : 0) : (x - a) / (b - a));
/** normalized 0..1 progress of t through [a,b] (clamped) */
export const seg = (t: number, a: number, b: number) => clamp(inv(a, b, t));
/** map t from [a,b] to [c,d] with optional easing */
export const map = (t: number, a: number, b: number, c: number, d: number, ease: (x: number) => number = (x) => x) =>
  lerp(c, d, ease(seg(t, a, b)));
/** 1 inside [a,b] with fade in/out durations */
export const window = (t: number, a: number, b: number, fin = 0.2, fout = 0.2) =>
  Math.min(fin <= 0 ? (t >= a ? 1 : 0) : seg(t, a, a + fin), fout <= 0 ? (t <= b ? 1 : 0) : 1 - seg(t, b - fout, b));
export const between = (t: number, a: number, b: number) => t >= a && t < b;

export const ease = {
  linear: (x: number) => x,
  inQuad: (x: number) => x * x,
  outQuad: (x: number) => 1 - (1 - x) * (1 - x),
  inOutQuad: (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2),
  inCubic: (x: number) => x * x * x,
  outCubic: (x: number) => 1 - Math.pow(1 - x, 3),
  inOutCubic: (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
  outQuart: (x: number) => 1 - Math.pow(1 - x, 4),
  inQuart: (x: number) => x * x * x * x,
  outExpo: (x: number) => (x === 1 ? 1 : 1 - Math.pow(2, -10 * x)),
  inExpo: (x: number) => (x === 0 ? 0 : Math.pow(2, 10 * x - 10)),
  inOutExpo: (x: number) =>
    x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2,
  outBack: (x: number) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  },
  outBackStrong: (x: number) => {
    const c1 = 3.2, c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
  },
  inBack: (x: number) => {
    const c1 = 1.70158, c3 = c1 + 1;
    return c3 * x * x * x - c1 * x * x;
  },
  outElastic: (x: number) => {
    const c4 = (2 * Math.PI) / 3;
    return x === 0 ? 0 : x === 1 ? 1 : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
  },
  outBounce: (x: number) => {
    const n1 = 7.5625, d1 = 2.75;
    if (x < 1 / d1) return n1 * x * x;
    if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
    if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
    return n1 * (x -= 2.625 / d1) * x + 0.984375;
  },
};

/** damped spring response 0→1 (overshoots), dt seconds after start */
export const springy = (dt: number, freq = 4.5, damp = 5) => {
  if (dt <= 0) return 0;
  return 1 - Math.exp(-damp * dt) * Math.cos(2 * Math.PI * freq * dt);
};

/** decaying pulse after an event time: 1 at t0, decays with tau */
export const pulse = (t: number, t0: number, tau = 0.15) => (t < t0 ? 0 : Math.exp(-(t - t0) / tau));

// ---- deterministic randomness
export const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
};
export const rand = (seed: number, i: number) => hash(seed * 1000.13 + i * 7.77);
export const randRange = (seed: number, i: number, a: number, b: number) => lerp(a, b, rand(seed, i));

// smooth 1D value noise
export const noise1 = (x: number, seed = 0) => {
  const i = Math.floor(x), f = x - i;
  const a = hash(i + seed * 97.1), b = hash(i + 1 + seed * 97.1);
  const u = f * f * (3 - 2 * f);
  return lerp(a, b, u) * 2 - 1;
};

export const deg = (r: number) => (r * 180) / Math.PI;
export const rad = (d: number) => (d * Math.PI) / 180;

/** pick active item from sorted list of times: returns index of last time <= t */
export const lastIndex = (times: number[], t: number) => {
  let lo = 0, hi = times.length - 1, ans = -1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (times[mid] <= t) {
      ans = mid;
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return ans;
};

/** typewriter: number of chars visible of text over [a,b] */
export const typeCount = (t: number, a: number, b: number, len: number) => Math.floor(seg(t, a, b) * len + 1e-6);

export const mix = (c1: string, c2: string, k: number) => {
  const p = (c: string) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const a = p(c1), b = p(c2);
  const r = a.map((v, i) => Math.round(lerp(v, b[i], clamp(k))));
  return '#' + r.map((v) => v.toString(16).padStart(2, '0')).join('');
};
export const alpha = (c: string, a: number) => {
  const v = Math.round(clamp(a) * 255).toString(16).padStart(2, '0');
  return c + v;
};
