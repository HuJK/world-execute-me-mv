import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, H, W} from '../../theme';
import {clamp, ease, lerp, mix, rand, seg} from '../../lib/anim';
import {beatPulse} from '../../lib/audio';

// "So deeply so deeply" — a dive through the contact point: layered petal rings (orange & blue) rush toward
// the camera; the light at the centre grows until everything is white at 59.22.

const T0 = 56.92;
const COLORS = [C.clay, C.blue, C.clayLight, '#8FB5DC'];

const petal = (r0: number, r1: number, w: number) => {
  const m = r0 + (r1 - r0) * 0.3;
  return `M0 ${-r0} C${w * 0.62} ${-m} ${w * 0.5} ${-r1 + w * 0.16} 0 ${-r1} C${-w * 0.5} ${-r1 + w * 0.16} ${-w * 0.62} ${-m} 0 ${-r0} Z`;
};

const kick = (t: number, at: number, amt: number, tau = 0.16) => (t < at ? 0 : amt * (1 - Math.exp(-(t - at) / tau)));

export const Dive: React.FC<{t: number; vx0: number; vy0: number}> = ({t, vx0, vy0}) => {
  const dt = Math.max(0, t - T0);
  const travel = 1.3 * dt + 0.9 * dt * dt + kick(t, 57.39, 0.9) + kick(t, 58.33, 1.1) + kick(t, 57.77, 0.35) + kick(t, 56.92, 0.3);
  const gap = 0.42;
  const vk = ease.inOutCubic(seg(t, 56.95, 57.9));
  const vx = lerp(vx0, W / 2, vk), vy = lerp(vy0, H / 2 - 20, vk);
  const fadeIn = 1;
  const white = ease.inCubic(seg(t, 58.72, 59.2));
  const layers: React.ReactNode[] = [];
  const j0 = Math.floor(travel / gap);
  for (let j = j0 + 22; j >= j0; j--) {
    const d = j * gap - travel + 0.35;
    if (d <= 0.04) continue;
    const s = 320 / d;
    if (s > 4200) continue;
    const fog = clamp((d - 0.8) / 7);
    const near = clamp((d - 0.04) / 0.3);
    const col = mix(COLORS[((j % 4) + 4) % 4], '#FFFFFF', 0.15 + 0.8 * fog);
    const rot = j * 15 + t * 22 * (j % 2 ? -1 : 1);
    const pulseK = 1 + 0.05 * beatPulse(t, 0.12);
    const pth = petal(s * 0.5, s * 1.18 * pulseK, s * 0.42);
    layers.push(
      <g key={j} transform={`translate(${vx} ${vy}) rotate(${rot})`} opacity={near * fadeIn}>
        {Array.from({length: 12}, (_, i) => (
          <path key={i} d={pth} fill={col} transform={`rotate(${i * 30})`} />
        ))}
        <circle r={s * 0.5} fill="none" stroke={mix(col, '#ffffff', 0.4)} strokeWidth={Math.max(1, s * 0.02)} opacity={0.6} />
      </g>,
    );
  }
  const core = 140 + 220 * dt + 300 * ease.inCubic(seg(t, 58.4, 59.1));
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: `radial-gradient(circle at ${vx}px ${vy}px, #FFFFFF 0%, ${mix(C.clayPale, C.bluePale, 0.5)} 60%, ${mix(C.clayLight, C.blue, 0.5)} 130%)`}} />
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <defs>
          <radialGradient id="p1core">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
            <stop offset="45%" stopColor="#ffffff" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </radialGradient>
        </defs>
        {layers}
        {/* speed streaks */}
        {Array.from({length: 46}, (_, i) => {
          const a = rand(500, i) * Math.PI * 2;
          const sp = 0.9 + rand(501, i) * 0.8;
          const ph = (rand(502, i) + (t - T0) * sp * (1 + dt)) % 1;
          const r0 = 60 + ph * ph * 1300;
          const len = 40 + ph * 260;
          const op = Math.sin(ph * Math.PI) * 0.75 * fadeIn;
          return (
            <line
              key={'s' + i}
              x1={vx + Math.cos(a) * r0}
              y1={vy + Math.sin(a) * r0}
              x2={vx + Math.cos(a) * (r0 + len)}
              y2={vy + Math.sin(a) * (r0 + len)}
              stroke="#ffffff"
              strokeWidth={2 + ph * 4}
              strokeLinecap="round"
              opacity={op}
            />
          );
        })}
        <circle cx={vx} cy={vy} r={core} fill="url(#p1core)" />
      </svg>
      {white > 0 ? <AbsoluteFill style={{background: '#fff', opacity: white}} /> : null}
    </AbsoluteFill>
  );
};

// the sung words fly out of the light (drawn above everything so they read through the transition)
export const DiveWords: React.FC<{t: number; vx0: number; vy0: number}> = ({t, vx0, vy0}) => {
  const vk = ease.inOutCubic(seg(t, 56.95, 57.9));
  const vx = lerp(vx0, W / 2, vk), vy = lerp(vy0, H / 2 - 20, vk);
  const words: [string, number, number][] = [
    ['So', 56.92, 57.39],
    ['deeply', 57.39, 57.77],
    ['so', 57.77, 58.33],
    ['deeply', 58.33, 59.1],
  ];
  return (
    <>
      {words.map(([w, a, b], i) => {
        // the outgoing word flies past the camera just before the next one lands
        const x0 = i === 3 ? b : b - 0.1, x1 = i === 3 ? b + 0.3 : b + 0.03;
        if (t < a - 0.03 || t > x1) return null;
        const life = seg(t, a, b);
        const sc = lerp(0.7, 1.25, ease.outCubic(life)) * (1 + 2.4 * ease.inCubic(seg(t, x0, x1)));
        const op = clamp((t - a + 0.03) / 0.08) * (1 - seg(t, x0, x1));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: vx,
              top: vy,
              transform: `translate(-50%,-50%) scale(${sc})`,
              fontFamily: F.serif,
              fontStyle: 'italic',
              fontWeight: 500,
              fontSize: 130,
              color: C.ink,
              opacity: op,
              letterSpacing: '0.01em',
              textShadow: '0 0 30px rgba(255,255,255,0.95), 0 0 8px rgba(255,255,255,0.9)',
              whiteSpace: 'nowrap',
            }}
          >
            {w}
          </div>
        );
      })}
    </>
  );
};
