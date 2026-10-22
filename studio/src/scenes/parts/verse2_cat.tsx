import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, H, W} from '../../theme';
import {clamp, ease, hash, lerp, noise1, pulse, seg} from '../../lib/anim';
import {PANEL} from './verse2_stage';

// ------------------------------------------------------------------------------------------------
// Tabby cat: orange tabby-stripe wipe + purr.wav artifact (a waveform that reads as a vibration —
// it rhymes with "VIBRATIONS" in chorus 2a).
// ------------------------------------------------------------------------------------------------

const BW = PANEL.w;
const BH = PANEL.h - PANEL.head;

/** organic tabby stripes block sweeping left→right. Fully covers the frame around `mid`. */
export const TabbyWipe: React.FC<{t: number; a: number; b: number}> = ({t, a, b}) => {
  if (t < a || t > b) return null;
  const BLOCK = 2700;
  const L = lerp(-BLOCK, W + 40, ease.inOutQuad(seg(t, a, b)));
  const stripes: React.ReactNode[] = [];
  let x = 0;
  let i = 0;
  while (x < BLOCK) {
    const w = lerp(90, 170, hash(i * 3.1 + 1));
    const dark = i % 2 === 1;
    // wavy-edged band
    const pts: string[] = [];
    const steps = 12;
    for (let k = 0; k <= steps; k++) {
      const yy = (k / steps) * (H + 200) - 100;
      pts.push(`${x + Math.sin(k * 1.3 + i) * 26 + (yy * 0.18)},${yy}`);
    }
    for (let k = steps; k >= 0; k--) {
      const yy = (k / steps) * (H + 200) - 100;
      pts.push(`${x + w + Math.sin(k * 1.1 + i * 2) * 22 + (yy * 0.18)},${yy}`);
    }
    stripes.push(<polygon key={i} points={pts.join(' ')} fill={dark ? '#C9652F' : '#EE8D4E'} />);
    x += w;
    i++;
  }
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <g transform={`translate(${L - 200} 0)`}>
        <rect x={-300} y={-100} width={BLOCK + 600} height={H + 200} fill="#EE8D4E" />
        {stripes}
      </g>
    </svg>
  );
};

/** faint tabby pattern for the cat stage background */
export const TabbyBG: React.FC<{t: number; opacity?: number}> = ({t, opacity = 1}) => (
  <AbsoluteFill style={{opacity}}>
    <svg width={W} height={H}>
      {Array.from({length: 16}, (_, i) => {
        const x = i * 140 - 100 + ((t * 20) % 140);
        const d = `M${x},-40 C${x + 40},200 ${x - 30},420 ${x + 20},620 C${x + 60},800 ${x + 10},960 ${x + 40},1120`;
        return <path key={i} d={d} stroke="#F2C9A6" strokeWidth={34 + 12 * Math.sin(i * 1.7)} strokeLinecap="round" fill="none" opacity={0.55} />;
      })}
    </svg>
  </AbsoluteFill>
);

export const CAT = {purr: 83.7, heart: 84.02, enjoy: 84.27, rec: 82.95};

/** purr amplitude over (absolute) time — strokes of the petting hand push it up */
const purrAmp = (tau: number) => {
  const on = ease.outCubic(seg(tau, CAT.purr - 0.05, CAT.purr + 0.25));
  const strokes = 0.25 * (Math.abs(Math.sin((tau - 83.22) * Math.PI * 2.17)) - 0.5);
  const breath = 0.78 + 0.22 * Math.sin(tau * Math.PI * 2 * 1.6);
  const joy = 1 + 0.35 * pulse(tau, CAT.enjoy, 0.35);
  return on * breath * (1 + strokes) * joy;
};

export const PurrArtifact: React.FC<{t: number}> = ({t}) => {
  const x0 = 40, x1 = BW - 40, cy = 290, Amax = 165;
  const speed = 520; // px per second (waveform scrolls)
  const N = 640;
  const mk = (phase: number, jitter: number) => {
    let d = '';
    for (let i = 0; i <= N; i++) {
      const x = lerp(x0, x1, i / N);
      const tau = t - (x1 - x) / speed;
      const env = purrAmp(tau) * (0.85 + 0.15 * noise1(tau * 30, 4));
      const y = cy + Math.sin((tau * 25 * Math.PI * 2) / 1 + phase) * Amax * env * (0.6 + 0.4 * Math.sin(tau * 160 + jitter));
      d += `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)} `;
    }
    return d;
  };
  const rec = t >= CAT.rec;
  const blink = Math.floor(t * 3) % 2 === 0;
  const live = purrAmp(t);
  const heartK = ease.outBackStrong(seg(t, CAT.heart, CAT.heart + 0.3));
  const secs = Math.max(0, t - CAT.rec);
  return (
    <svg width={BW} height={BH} style={{position: 'absolute', left: 0, top: 0}}>
      {/* scope background */}
      <rect x={20} y={40} width={BW - 40} height={500} rx={20} fill="#FBF6F1" />
      {Array.from({length: 9}, (_, i) => (
        <line key={i} x1={20} y1={40 + i * 62.5} x2={BW - 20} y2={40 + i * 62.5} stroke={C.clay} strokeOpacity={i === 4 ? 0.3 : 0.08} strokeWidth={i === 4 ? 2 : 1.5} />
      ))}
      {Array.from({length: 13}, (_, i) => (
        <line key={'v' + i} x1={20 + i * 68.3} y1={40} x2={20 + i * 68.3} y2={540} stroke={C.clay} strokeOpacity={0.08} strokeWidth={1.5} />
      ))}
      {/* the purr: three ghosted passes so it reads as a vibration */}
      <path d={mk(0.9, 2)} fill="none" stroke={C.clayLight} strokeWidth={2} opacity={0.45} transform={`translate(0 ${Math.sin(t * 90) * 3})`} />
      <path d={mk(-0.7, 5)} fill="none" stroke={C.blue} strokeWidth={2} opacity={0.35} transform={`translate(0 ${Math.sin(t * 77) * -3})`} />
      <path d={mk(0, 0)} fill="none" stroke={C.clay} strokeWidth={3} strokeLinejoin="round" />
      {/* live meter */}
      <circle cx={x1} cy={cy} r={10 + live * 14} fill={C.clay} opacity={0.9} />
      <circle cx={x1} cy={cy} r={22 + live * 40} fill="none" stroke={C.clay} strokeWidth={3} opacity={0.4 * live} />
      {/* readouts */}
      <g fontFamily={F.mono} fontSize={30}>
        <circle cx={46} cy={608} r={11} fill={rec && blink ? C.clay : C.gray2} />
        <text x={70} y={618} fill={C.ink} fontWeight={700}>
          REC
        </text>
        <text x={160} y={618} fill={C.gray4}>
          00:0{Math.min(9, Math.floor(secs))}.{String(Math.floor((secs % 1) * 100)).padStart(2, '0')}
        </text>
        <text x={BW - 40} y={618} fill={C.gray4} textAnchor="end">
          f₀ = {live > 0.05 ? Math.round(25 + live * 2) : '—'} Hz
        </text>
      </g>
      {/* reaction chip */}
      <g transform={`translate(70 ${690}) scale(${heartK})`} opacity={clamp(heartK * 2)}>
        <rect x={0} y={-34} width={140} height={68} rx={34} fill="#FDECEA" stroke={C.pink} strokeWidth={2.5} />
        <path d="M0,6 C-9,-1 -9,-9 -4,-10 C-1.5,-10.5 0,-8.5 0,-7 C0,-8.5 1.5,-10.5 4,-10 C9,-9 9,-1 0,6 Z" fill={C.clay} transform="translate(46 2) scale(2.3)" />
        <text x={84} y={11} fontFamily={F.sans} fontSize={30} fontWeight={600} fill={C.ink}>
          1
        </text>
      </g>
      <text x={240} y={702} fontFamily={F.serif} fontStyle="italic" fontSize={28} fill={C.gray4} opacity={seg(t, CAT.heart + 0.1, CAT.heart + 0.3)}>
        you reacted ♥ to purr.wav
      </text>
    </svg>
  );
};

/** petting hand path on the head: back-and-forth strokes synced to the beat */
export const petHand = (t: number, hx: number, hy: number) => {
  const enter = ease.outCubic(seg(t, 82.95, 83.22));
  const stroke = t > 83.22 ? Math.sin((t - 83.22) * Math.PI * 2.17) : -1; // ~one stroke per beat pair
  const x = lerp(hx + 520, hx + stroke * 95, enter);
  const y = lerp(hy - 260, hy - Math.abs(stroke) * 10, enter);
  return {x, y, rot: stroke * 8 - 10, enter};
};
