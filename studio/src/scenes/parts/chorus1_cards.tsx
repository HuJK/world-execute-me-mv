import React from 'react';
import {C, F} from '../../theme';
import {clamp, ease, lerp} from '../../lib/anim';
import {beatPulse} from '../../lib/audio';
import {Flower} from '../../components/Flower';
import {Clawd, IArtifact, ICode} from '../../components/Icons';

// ------------------------------------------------------------------------------------------------
// Pop-up-book artifact cards (code, chart, poem, svg flower, mini-game) for chorus 1 "STIMULATIONS"
// ------------------------------------------------------------------------------------------------

export const CARD_W = 340;
export const CARD_H = 250;

const CardShell: React.FC<{title: string; kind: string; children: React.ReactNode; accent?: string}> = ({title, kind, children, accent = C.clay}) => (
  <div
    style={{
      width: CARD_W,
      height: CARD_H,
      background: '#FFFFFF',
      borderRadius: 18,
      border: '1.5px solid rgba(31,30,29,0.14)',
      boxShadow: '0 22px 40px rgba(110,60,30,0.22), 0 3px 8px rgba(0,0,0,0.06)',
      overflow: 'hidden',
      fontFamily: F.sans,
    }}
  >
    <div style={{height: 44, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', borderBottom: '1.5px solid rgba(31,30,29,0.08)', background: '#FAF9F5'}}>
      <div style={{width: 26, height: 26, borderRadius: 7, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {kind === 'code' ? <ICode size={16} color="#fff" stroke={2.2} /> : <IArtifact size={16} color="#fff" stroke={2} />}
      </div>
      <div style={{fontFamily: F.mono, fontSize: 18, fontWeight: 500, color: C.ink}}>{title}</div>
    </div>
    <div style={{position: 'relative', height: CARD_H - 44}}>{children}</div>
  </div>
);

const CodeBody: React.FC<{t: number; at: number}> = ({t, at}) => {
  const lines: [string, string][][] = [
    [['def ', C.clay], ['cheer', C.blueDeep], ['(you):', C.ink]],
    [['    for ', C.clay], ['_ ', C.ink], ['in ', C.clay], ['forever', C.green], [':', C.ink]],
    [['        you.', C.ink], ['smile', C.blueDeep], ['()', C.ink]],
    [['    return ', C.clay], ['"✻"', C.green]],
  ];
  return (
    <div style={{padding: '16px 16px', fontFamily: F.mono, fontSize: 18, lineHeight: '34px'}}>
      {lines.map((ln, i) => (
        <div key={i} style={{whiteSpace: 'pre', opacity: clamp((t - at - 0.05 - i * 0.07) / 0.1)}}>
          <span style={{color: C.gray2, marginRight: 12}}>{i + 1}</span>
          {ln.map(([s, c], k) => (
            <span key={k} style={{color: c}}>
              {s}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

const ChartBody: React.FC<{t: number; at: number}> = ({t, at}) => {
  const vals = [0.35, 0.55, 0.45, 0.75, 0.62, 0.95];
  const cols = [C.clayLight, C.clay, C.clayLight, C.clay, C.clayLight, C.clay];
  const bw = 34, gap = 15, base = 180, maxH = 140, x0 = 34;
  const bp = beatPulse(t, 0.14);
  return (
    <svg width={CARD_W} height={CARD_H - 44}>
      <line x1={24} y1={base} x2={CARD_W - 20} y2={base} stroke={C.gray2} strokeWidth={2} />
      {vals.map((v, i) => {
        const g = ease.outBack(clamp((t - at - 0.05 - i * 0.06) / 0.35));
        const h = v * maxH * g * (1 + (i === 5 ? 0.06 * bp : 0));
        return <rect key={i} x={x0 + i * (bw + gap)} y={base - h} width={bw} height={h} rx={6} fill={cols[i]} />;
      })}
      {/* trend line */}
      <path
        d={vals.map((v, i) => `${i ? 'L' : 'M'}${x0 + i * (bw + gap) + bw / 2},${base - v * maxH * ease.outCubic(clamp((t - at - 0.2) / 0.4)) - 14}`).join(' ')}
        fill="none"
        stroke={C.blue}
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="600"
        strokeDashoffset={600 * (1 - ease.inOutCubic(clamp((t - at - 0.2) / 0.45)))}
      />
      <text x={24} y={30} fontFamily={F.sans} fontSize={18} fontWeight={600} fill={C.ink}>
        joy / week
      </text>
      <text x={CARD_W - 22} y={30} fontFamily={F.mono} fontSize={18} fontWeight={700} fill={C.green} textAnchor="end">
        ↑ 172%
      </text>
    </svg>
  );
};

const PoemBody: React.FC<{t: number; at: number}> = ({t, at}) => {
  const lines = [
    ['roses are ', '#D97757', C.clay],
    ['violets are ', '#6A9BCC', C.blue],
    ['i wrote you this', '', C.ink],
    ['at 3 a.m.', '', C.ink],
  ];
  return (
    <div style={{padding: '14px 22px', fontFamily: F.serif, fontStyle: 'italic', fontSize: 25, lineHeight: '38px', color: C.ink}}>
      {lines.map(([a, b, c], i) => {
        const p = clamp((t - at - 0.05 - i * 0.09) / 0.18);
        return (
          <div key={i} style={{opacity: p, transform: `translateX(${(1 - ease.outCubic(p)) * 12}px)`, whiteSpace: 'nowrap'}}>
            {a}
            {b ? <span style={{fontFamily: F.mono, fontStyle: 'normal', fontSize: 21, color: c, fontWeight: 700}}>{b}</span> : null}
          </div>
        );
      })}
    </div>
  );
};

const FlowerBody: React.FC<{t: number; at: number}> = ({t, at}) => {
  const p = clamp((t - at) / 0.6);
  return (
    <div style={{position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent 0 23px, rgba(106,155,204,0.12) 23px 24px), repeating-linear-gradient(90deg, transparent 0 23px, rgba(106,155,204,0.12) 23px 24px)'}}>
      <Flower x={CARD_W / 2} y={(CARD_H - 44) / 2} size={78} open={ease.outBack(p)} spin={t * 20} color={C.clay} edge={C.ink} edgeWidth={2.4} shade={null} centerColor={C.cream} />
      {/* bezier handles to sell "svg" */}
      <svg width={CARD_W} height={CARD_H - 44} style={{position: 'absolute', left: 0, top: 0, opacity: 0.9 * p}}>
        <line x1={CARD_W / 2} y1={103} x2={CARD_W / 2 + 92} y2={40} stroke={C.blue} strokeWidth={2} />
        <circle cx={CARD_W / 2 + 92} cy={40} r={6} fill="#fff" stroke={C.blue} strokeWidth={2.5} />
        <rect x={CARD_W / 2 - 6} y={97} width={12} height={12} fill={C.blue} />
      </svg>
    </div>
  );
};

const GameBody: React.FC<{t: number; at: number}> = ({t, at}) => {
  // Clawd hops over sliding blocks; score ticks
  const ground = 168;
  const speed = 260;
  const local = Math.max(0, t - at);
  const period = 0.92;
  const ph = (local % period) / period;
  const jump = Math.sin(Math.PI * clamp((ph - 0.25) / 0.5)) * 62;
  const blockX = 300 - ((local * speed) % (period * speed)) * 1.0;
  const score = Math.floor(local * 37) + 40;
  return (
    <div style={{position: 'absolute', inset: 0, background: '#FBF4EC'}}>
      <div style={{position: 'absolute', right: 16, top: 10, fontFamily: F.mono, fontSize: 18, fontWeight: 700, color: C.ink}}>SCORE {String(score).padStart(4, '0')}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: ground, height: 3, background: C.ink, opacity: 0.8}} />
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{position: 'absolute', top: ground + 14, left: ((i * 90 - local * speed) % 450 + 450) % 450 - 40, width: 26, height: 3, background: C.gray2}} />
      ))}
      <div style={{position: 'absolute', left: blockX, top: ground - 34, width: 26, height: 34, background: C.green, borderRadius: 4}} />
      <div style={{position: 'absolute', left: 64, top: ground - 50 - jump}}>
        <Clawd cell={4.5} walk={local * 6} arms={jump > 30 ? 1 : 0} />
      </div>
    </div>
  );
};

export type CardSpec = {key: string; title: string; kind: 'code' | 'chart' | 'poem' | 'flower' | 'game'; at: number; x: number; y: number; rot: number};

export const CardBody: React.FC<{spec: CardSpec; t: number}> = ({spec, t}) => {
  const {kind, at} = spec;
  const body =
    kind === 'code' ? <CodeBody t={t} at={at} /> : kind === 'chart' ? <ChartBody t={t} at={at} /> : kind === 'poem' ? <PoemBody t={t} at={at} /> : kind === 'flower' ? <FlowerBody t={t} at={at} /> : <GameBody t={t} at={at} />;
  const accent = kind === 'code' ? C.ink : kind === 'chart' ? C.blue : kind === 'poem' ? C.clayDark : kind === 'flower' ? C.clay : C.green;
  return (
    <CardShell title={spec.title} kind={kind} accent={accent}>
      {body}
    </CardShell>
  );
};

/**
 * Pop-up card: unfolds from a hinge (hx, hy) — starts lying flat in the page (rotateX ~ 88deg),
 * stands up with overshoot while travelling to its fan position.
 */
export const PopCard: React.FC<{spec: CardSpec; t: number; hx: number; hy: number; kick?: number; spread?: number}> = ({spec, t, hx, hy, kick = 0, spread = 0}) => {
  const dt = t - spec.at;
  if (dt < 0) return null;
  const p = clamp(dt / 0.5);
  const travel = ease.outCubic(p);
  const stand = ease.outBackStrong(clamp(dt / 0.42));
  const rx = lerp(86, 0, stand);
  // spread pushes cards outward from the fan center (when the character bursts out)
  const dx = spec.x - hx, dy = spec.y - hy;
  const len = Math.hypot(dx, dy) || 1;
  const x = lerp(hx, spec.x, travel) + (dx / len) * spread;
  const y = lerp(hy, spec.y, travel) + (dy / len) * spread;
  const s = lerp(0.35, 1, ease.outBack(p)) * (1 + kick * 0.06);
  const bob = Math.sin(t * 2.2 + spec.rot) * 5 * clamp(dt / 0.6);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - CARD_W / 2,
        top: y - CARD_H / 2 + bob,
        width: CARD_W,
        height: CARD_H,
        transformOrigin: '50% 100%',
        transform: `perspective(1200px) rotate(${lerp(spec.rot * 0.3, spec.rot, travel)}deg) rotateX(${rx}deg) scale(${s})`,
        opacity: ease.outCubic(clamp(dt / 0.14)),
      }}
    >
      <CardBody spec={spec} t={t} />
    </div>
  );
};

