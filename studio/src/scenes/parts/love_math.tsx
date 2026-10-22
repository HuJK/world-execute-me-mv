import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, H, W} from '../../theme';
import {clamp, ease, lerp, seg} from '../../lib/anim';
import {kickPulse} from '../../lib/audio';
import {Flower, PETAL_ANG, PETAL_LEN} from '../../components/Flower';
import {Ring} from '../../components/FX';
import {Glow, HEART_COEF, heartPath, heartXY} from './love_common';

// ---------------------------------------------------------------------------------------------
// 184.54–188.48  "I know the algebraic expression of LO-O-OVE"
// graph paper · r = |cos 6θ| traced over our flower (the flower was an equation all along) ·
// Fourier epicycles (8 exact circles) drawing the heart · typeset implicit + parametric forms ·
// LO-O-OVE: the heart fills clay and beats with the kick.
// ---------------------------------------------------------------------------------------------

export const M_T0 = 184.54;
const ROSE = {x: 330, y: 430, R: 205};
const HEART = {x: 985, y: 420, s: 14};
const EQ_X = 1330;
const TRACE_A = 185.95, TRACE_B = 187.58;
const ROSE_A = 184.78, ROSE_B = 185.72;
export const LOVE3: [number, number, number] = [187.65, 187.83, 188.07];

const ink = '#2B2A27';

/** camera over the math page */
const camAt = (t: number) => {
  // start: zoomed on the rose, rose centre on screen (960, 480) — exactly where the O of LO-O-OVE was
  const s0 = 1.45;
  const a = {s: s0, x: 960 - ROSE.x * s0, y: 480 - ROSE.y * s0};
  const b = {s: 1, x: 0, y: 0};
  const hs = 1.1;
  const c = {s: hs, x: 960 - 960 * hs, y: 470 - 470 * hs};
  const k1 = ease.inOutCubic(seg(t, 185.5, 186.2));
  const k2 = ease.outExpo(seg(t, 187.64, 188.0));
  let s = lerp(a.s, b.s, k1), x = lerp(a.x, b.x, k1), y = lerp(a.y, b.y, k1);
  s = lerp(s, c.s, k2);
  x = lerp(x, c.x, k2);
  y = lerp(y, c.y, k2);
  // slow drift so nothing is ever static
  x += Math.sin(t * 0.7) * 6;
  y += Math.cos(t * 0.6) * 4;
  return {s, x, y};
};
export const mathCam = camAt;

const roseD = (cx: number, cy: number, R: number, th: number) => {
  const n = Math.max(2, Math.ceil((th / (Math.PI * 2)) * 720));
  let d = '';
  for (let i = 0; i <= n; i++) {
    const p = (i / n) * th;
    const r = R * Math.abs(Math.cos(6 * p));
    d += `${i ? 'L' : 'M'}${(cx + r * Math.cos(p)).toFixed(2)},${(cy - r * Math.sin(p)).toFixed(2)} `;
  }
  return d;
};

const Typed: React.FC<{text: string; t: number; a: number; dur: number; style: React.CSSProperties}> = ({text, t, a, dur, style}) => {
  if (t < a) return null;
  const n = Math.floor(clamp((t - a) / dur) * text.length + 1e-6);
  const caret = t < a + dur + 0.25;
  return (
    <div style={{whiteSpace: 'pre', ...style}}>
      {text.slice(0, n)}
      {caret ? <span style={{color: C.clay, fontStyle: 'normal'}}>|</span> : null}
    </div>
  );
};

export const LoveMath: React.FC<{t: number}> = ({t}) => {
  const cam = camAt(t);
  // ---------------- rose
  const grow = ease.outBack(seg(t, M_T0, M_T0 + 0.38));
  const regularK = ease.inOutCubic(seg(t, M_T0, M_T0 + 0.45));
  const flowerSize = ROSE.R * lerp(0.34, 0.98, grow);
  const th = Math.PI * 2 * ease.inOutQuad(seg(t, ROSE_A, ROSE_B));
  const armOn = t > ROSE_A - 0.05 && t < ROSE_B + 0.25;
  const fillK = ease.outCubic(seg(t, ROSE_B, ROSE_B + 0.45));
  const flowerOp = 1 - 0.75 * fillK;
  const gridK = seg(t, M_T0 + 0.05, M_T0 + 0.5);
  // ---------------- heart epicycles
  const tau = Math.PI * 2 * ease.inOutQuad(seg(t, TRACE_A, TRACE_B));
  const circlesK = (j: number) => ease.outBack(seg(t, 185.83 + j * 0.05, 185.83 + j * 0.05 + 0.3)) * (1 - seg(t, 187.66, 187.95));
  const chain: {x: number; y: number; r: number}[] = [];
  let px = HEART.x, py = HEART.y;
  for (const [k, re, im] of HEART_COEF) {
    const r = Math.hypot(re, im) * HEART.s;
    const ang = k * tau + Math.atan2(im, re);
    chain.push({x: px, y: py, r});
    px += r * Math.cos(ang);
    py -= r * Math.sin(ang);
  }
  const tip = {x: px, y: py};
  const loveK = seg(t, 187.66, 187.84);
  const beat = 1 + 0.085 * kickPulse(t, 0.13) * (t > 187.6 ? 1 : 0);
  const hcx = HEART.x, hcy = HEART.y + 2.5 * HEART.s;
  return (
    <AbsoluteFill style={{background: '#FAF6EE', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0', transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.s})`}}>
        {/* graph paper (oversized so camera moves never show an edge) */}
        <div
          style={{
            position: 'absolute',
            left: -1200,
            top: -1200,
            width: W + 2400,
            height: H + 2400,
            backgroundImage: `linear-gradient(rgba(20,20,19,0.13) 1px, transparent 1px), linear-gradient(90deg, rgba(20,20,19,0.13) 1px, transparent 1px), linear-gradient(rgba(20,20,19,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(20,20,19,0.06) 1px, transparent 1px)`,
            backgroundSize: '200px 200px, 200px 200px, 40px 40px, 40px 40px',
            backgroundPosition: '0 0',
          }}
        />
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          {/* ---------- polar grid */}
          <g opacity={0.9}>
            {[0.25, 0.5, 0.75, 1].map((f, i) => {
              const r = ROSE.R * f;
              const L = 2 * Math.PI * r;
              return (
                <circle
                  key={i}
                  cx={ROSE.x}
                  cy={ROSE.y}
                  r={r}
                  fill="none"
                  stroke={ink}
                  strokeOpacity={i === 3 ? 0.35 : 0.16}
                  strokeWidth={i === 3 ? 1.6 : 1.2}
                  strokeDasharray={`${L} ${L}`}
                  strokeDashoffset={L * (1 - ease.inOutCubic(clamp(gridK * 1.3 - i * 0.1)))}
                />
              );
            })}
            {Array.from({length: 12}, (_, i) => {
              const a = (i * Math.PI) / 6;
              const k = ease.outCubic(clamp(gridK * 1.4 - i * 0.03));
              return (
                <line
                  key={i}
                  x1={ROSE.x}
                  y1={ROSE.y}
                  x2={ROSE.x + Math.cos(a) * ROSE.R * 1.08 * k}
                  y2={ROSE.y - Math.sin(a) * ROSE.R * 1.08 * k}
                  stroke={ink}
                  strokeOpacity={i % 3 === 0 ? 0.3 : 0.12}
                  strokeWidth={1.2}
                />
              );
            })}
            {['0', 'π/2', 'π', '3π/2'].map((s, i) => {
              const a = (i * Math.PI) / 2;
              return (
                <text
                  key={s}
                  x={ROSE.x + Math.cos(a) * ROSE.R * 1.2}
                  y={ROSE.y - Math.sin(a) * ROSE.R * 1.2 + 8}
                  textAnchor="middle"
                  fontFamily={F.serif}
                  fontStyle="italic"
                  fontSize={22}
                  fill={ink}
                  opacity={0.55 * gridK}
                >
                  {s}
                </text>
              );
            })}
          </g>
        </svg>
        {/* our flower (morphs to perfectly regular petals: it is the rose) */}
        <Flower
          x={ROSE.x}
          y={ROSE.y}
          size={flowerSize}
          open={1}
          spin={0}
          shade={C.clayDark}
          opacity={flowerOp}
          petals={Array.from({length: 12}, (_, i) => ({
            rot: (i * 30 - PETAL_ANG[i]) * regularK,
            scale: lerp(1, 0.95 / PETAL_LEN[i], regularK),
            width: lerp(1, 0.78, regularK),
          }))}
          centerScale={lerp(1, 0.7, regularK)}
          glow={0.2 * (1 - fillK)}
        />
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          {/* rose fill once traced */}
          {fillK > 0 ? (
            <path d={roseD(ROSE.x, ROSE.y, ROSE.R * 0.95, Math.PI * 2)} fill={C.clay} fillOpacity={0.88 * fillK} stroke="none" />
          ) : null}
          {th > 0.001 ? (
            <path d={roseD(ROSE.x, ROSE.y, ROSE.R * 0.95, th)} fill="none" stroke={ink} strokeWidth={3.2} strokeLinejoin="round" opacity={1 - 0.6 * fillK} />
          ) : null}
          {fillK > 0 ? <circle cx={ROSE.x} cy={ROSE.y} r={ROSE.R * 0.13 * fillK} fill={C.cream} /> : null}
          {armOn ? (
            (() => {
              const r = ROSE.R * 0.95 * Math.abs(Math.cos(6 * th));
              const ex = ROSE.x + Math.cos(th) * ROSE.R, ey = ROSE.y - Math.sin(th) * ROSE.R;
              const qx = ROSE.x + Math.cos(th) * r, qy = ROSE.y - Math.sin(th) * r;
              const op = 1 - seg(t, ROSE_B, ROSE_B + 0.25);
              return (
                <g opacity={op}>
                  <line x1={ROSE.x} y1={ROSE.y} x2={ex} y2={ey} stroke={C.blue} strokeWidth={2} strokeDasharray="6 6" />
                  <circle cx={qx} cy={qy} r={7} fill={C.clay} stroke="#fff" strokeWidth={2.5} />
                </g>
              );
            })()
          ) : null}

          {/* ---------- heart axes */}
          {(() => {
            const k = ease.outCubic(seg(t, 185.6, 186.0));
            const ax = 300 * k;
            return (
              <g stroke={ink} strokeOpacity={0.35} strokeWidth={1.6} fill="none">
                <line x1={HEART.x - ax} y1={HEART.y} x2={HEART.x + ax} y2={HEART.y} />
                <line x1={HEART.x} y1={HEART.y + ax * 0.9} x2={HEART.x} y2={HEART.y - ax * 0.9} />
              </g>
            );
          })()}
          {/* ---------- epicycles */}
          {chain.map((c, j) => {
            const k = circlesK(j);
            if (k <= 0.001) return null;
            const next = chain[j + 1] ?? tip;
            return (
              <g key={j} opacity={Math.min(1, k)}>
                <circle cx={c.x} cy={c.y} r={Math.max(0.1, c.r * k)} fill="none" stroke={j === 0 ? C.blue : ink} strokeOpacity={j === 0 ? 0.55 : 0.4} strokeWidth={j === 0 ? 2.2 : 1.6} />
                <line x1={c.x} y1={c.y} x2={lerp(c.x, next.x, Math.min(1, k))} y2={lerp(c.y, next.y, Math.min(1, k))} stroke={C.clayDark} strokeWidth={2.4} strokeLinecap="round" />
                <circle cx={c.x} cy={c.y} r={3.2} fill={C.clayDark} />
              </g>
            );
          })}
        </svg>
        {/* heart trace & fill */}
        <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: `${hcx}px ${hcy}px`, transform: `scale(${beat})`}}>
          <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
            <defs>
              <linearGradient id="heartfill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={C.clayLight} />
                <stop offset="55%" stopColor={C.clay} />
                <stop offset="100%" stopColor={C.clayDark} />
              </linearGradient>
            </defs>
            {loveK > 0 ? (
              <path
                d={heartPath(HEART.x, HEART.y, HEART.s)}
                fill="url(#heartfill)"
                fillOpacity={loveK}
                style={{filter: `drop-shadow(0 0 ${30 * loveK}px rgba(217,119,87,0.6))`}}
              />
            ) : null}
            {tau > 0.001 ? (
              <path d={heartPath(HEART.x, HEART.y, HEART.s, tau)} fill="none" stroke={C.clay} strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" />
            ) : null}
            {loveK > 0 ? (
              <path
                d={`M${HEART.x - 9 * HEART.s},${HEART.y - 6 * HEART.s} q${-2 * HEART.s},${4 * HEART.s} ${0.5 * HEART.s},${8 * HEART.s}`}
                stroke="#fff"
                strokeOpacity={0.55 * loveK}
                strokeWidth={9}
                strokeLinecap="round"
                fill="none"
              />
            ) : null}
            {tau > 0.001 && t < TRACE_B + 0.3 ? <circle cx={tip.x} cy={tip.y} r={8} fill={C.clay} stroke="#fff" strokeWidth={3} /> : null}
          </svg>
        </div>
        {tau > 0.001 && t < TRACE_B + 0.3 ? <Glow x={tip.x} y={tip.y} r={50} color="240,162,127" opacity={0.8} blend="normal" /> : null}

        {/* ---------- labels */}
        <div style={{position: 'absolute', left: ROSE.x - 260, width: 520, top: ROSE.y + ROSE.R + 52, textAlign: 'center'}}>
          <Typed text="r = |cos 6θ|" t={t} a={185.13} dur={0.42} style={{fontFamily: F.serif, fontStyle: 'italic', fontSize: 54, color: ink}} />
          {t > 185.75 ? (
            <div style={{fontFamily: F.serif, fontStyle: 'italic', fontSize: 30, color: C.clayDark, marginTop: 6, opacity: seg(t, 185.75, 186.05), transform: `translateY(${(1 - ease.outCubic(seg(t, 185.75, 186.1))) * 10}px)`}}>
              ✿ the flower was an equation all along
            </div>
          ) : null}
        </div>
        <div style={{position: 'absolute', left: EQ_X, top: 260, width: 560}}>
          <Typed text="// implicit" t={t} a={185.83} dur={0.15} style={{fontFamily: F.mono, fontSize: 21, color: C.gray3, marginBottom: 10}} />
          <Typed text="(x² + y² − 1)³ − x²y³ = 0" t={t} a={185.9} dur={0.55} style={{fontFamily: F.serif, fontStyle: 'italic', fontSize: 48, color: ink}} />
          <div style={{height: 46}} />
          <Typed text="// parametric · 8 epicycles" t={t} a={186.81} dur={0.18} style={{fontFamily: F.mono, fontSize: 21, color: C.gray3, marginBottom: 10}} />
          <Typed text="x = 16 sin³t" t={t} a={186.86} dur={0.2} style={{fontFamily: F.serif, fontStyle: 'italic', fontSize: 38, color: ink, lineHeight: '52px'}} />
          <Typed text="y = 13 cos t − 5 cos 2t" t={t} a={187.05} dur={0.22} style={{fontFamily: F.serif, fontStyle: 'italic', fontSize: 38, color: ink, lineHeight: '52px'}} />
          <Typed text="      − 2 cos 3t − cos 4t" t={t} a={187.25} dur={0.2} style={{fontFamily: F.serif, fontStyle: 'italic', fontSize: 38, color: ink, lineHeight: '52px'}} />
        </div>
      </div>
      {/* LO-O-OVE rings from the heart */}
      {LOVE3.map((at, i) => {
        const sx = cam.x + hcx * cam.s, sy = cam.y + hcy * cam.s;
        return <Ring key={i} x={sx} y={sy} t={t} at={at} r0={160} r1={760} color={i === 1 ? C.clayLight : C.clay} width={6} dur={0.6} />;
      })}
    </AbsoluteFill>
  );
};

