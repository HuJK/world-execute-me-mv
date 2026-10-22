import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, H, W} from '../../theme';
import {clamp, ease, lerp, mix, pulse, rand, seg, springy} from '../../lib/anim';
import {beatPulse} from '../../lib/audio';
import {Flower, PETAL_ANG} from '../../components/Flower';
import {appTheme} from '../../components/ClaudeApp';
import {Clawd, IArrowUp, IChevron, ICode, IPlus, ISliders} from '../../components/Icons';
import {Ring} from '../../components/FX';
import {Cap} from './pre2_common';

// ------------------------------------------------------------------------------------------
// 92.02–93.95  "And then do whatever": rapid task montage + Clawd scuttling.
// 93.95–95.47  "From AM to PM": the home greeting cycles morning→evening around a flower clock.
// ------------------------------------------------------------------------------------------

const T_IN = 92.02;
const T_CLOCK = 93.95;
const T_SPLIT = 95.47;

type CardKind = 'code' | 'email' | 'poem' | 'recipe' | 'chart' | 'translate' | 'fix';
type CardDef = {kind: CardKind; at: number; x: number; y: number; rot: number; title: string; type: string; from: [number, number]};

const CARDS: CardDef[] = [
  {kind: 'code', at: 92.02, x: 350, y: 280, rot: -5, title: 'whatever.py', type: 'Code', from: [-500, -200]},
  {kind: 'email', at: 92.28, x: 960, y: 250, rot: 3, title: 'Re: Monday sync', type: 'Email draft', from: [0, -520]},
  {kind: 'poem', at: 92.48, x: 1570, y: 290, rot: -3, title: 'Ode to a Tuesday', type: 'Poem', from: [520, -200]},
  {kind: 'recipe', at: 92.81, x: 350, y: 665, rot: 4, title: 'Eggplant curry', type: 'Recipe · 30 min', from: [-520, 200]},
  {kind: 'chart', at: 93.02, x: 1570, y: 670, rot: -4, title: 'Weekly signups', type: 'Chart', from: [520, 220]},
  {kind: 'translate', at: 93.25, x: 960, y: 640, rot: 2, title: 'Translate', type: 'EN → 中文', from: [0, 520]},
  {kind: 'fix', at: 93.47, x: 960, y: 445, rot: -1, title: 'Fix the bug', type: 'Debugging', from: [0, 0]},
];

const CW = 480, CH = 300;

const CardBody: React.FC<{kind: CardKind; t: number; at: number}> = ({kind, t, at}) => {
  const typeK = seg(t, at + 0.05, at + 0.35);
  if (kind === 'code') {
    const lines: [string, string][][] = [
      [['def ', C.clayDark], ['whatever', C.blueDeep], ['(task):', C.ink]],
      [['    plan = ', C.ink], ['think', C.blueDeep], ['(task)', C.ink]],
      [['    return ', C.clayDark], ['do', C.blueDeep], ['(plan)', C.ink]],
    ];
    const n = Math.ceil(typeK * 3);
    return (
      <div style={{fontFamily: F.mono, fontSize: 20, lineHeight: '34px', whiteSpace: 'pre'}}>
        {lines.slice(0, n).map((l, i) => (
          <div key={i}>
            <span style={{color: C.gray2, marginRight: 14}}>{i + 1}</span>
            {l.map(([s, c], k) => (
              <span key={k} style={{color: c}}>
                {s}
              </span>
            ))}
          </div>
        ))}
      </div>
    );
  }
  if (kind === 'email') {
    const txt = ['Hi team,', 'Thanks for the quick turnaround!', 'Notes attached.  — Sam'];
    return (
      <div style={{fontFamily: F.sans, fontSize: 20, lineHeight: '33px', color: '#3D3D3A'}}>
        {txt.map((l, i) => (
          <div key={i} style={{opacity: clamp(typeK * 3 - i)}}>
            {l}
          </div>
        ))}
      </div>
    );
  }
  if (kind === 'poem') {
    const txt = ['Twelve petals of morning,', 'one for every hour', 'you might need me.'];
    return (
      <div style={{fontFamily: F.serif, fontStyle: 'italic', fontSize: 25, lineHeight: '34px', color: C.ink}}>
        {txt.map((l, i) => (
          <div key={i} style={{opacity: clamp(typeK * 3 - i)}}>
            {l}
          </div>
        ))}
      </div>
    );
  }
  if (kind === 'recipe') {
    const items = ['2 eggplants, cubed', '1 can coconut milk', 'curry paste, rice'];
    return (
      <div style={{fontFamily: F.sans, fontSize: 20, lineHeight: '34px', color: '#3D3D3A'}}>
        {items.map((l, i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 10, opacity: clamp(typeK * 3 - i)}}>
            <div style={{width: 18, height: 18, borderRadius: 5, border: `2px solid ${C.clay}`, background: t > at + 0.3 + i * 0.08 ? C.clay : 'transparent'}} />
            {l}
          </div>
        ))}
      </div>
    );
  }
  if (kind === 'chart') {
    const vals = [0.35, 0.5, 0.42, 0.68, 0.6, 0.82, 0.95];
    return (
      <svg width={CW - 48} height={130}>
        <line x1={0} y1={116} x2={CW - 48} y2={116} stroke={C.gray2} strokeWidth={2} />
        {vals.map((v, i) => {
          const g = ease.outBack(seg(t, at + 0.05 + i * 0.03, at + 0.3 + i * 0.03));
          const h = 108 * v * g;
          return <rect key={i} x={8 + i * 54} y={116 - h} width={36} height={h} rx={5} fill={i === vals.length - 1 ? C.clay : C.clayLight} />;
        })}
      </svg>
    );
  }
  if (kind === 'translate') {
    return (
      <div style={{fontFamily: F.sans, fontSize: 24, color: C.ink, lineHeight: '42px'}}>
        <div style={{color: C.gray3}}>good morning</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, opacity: clamp(typeK * 2 - 0.6)}}>
          <span style={{color: C.clay}}>→</span>
          <span style={{fontFamily: F.cjk, fontWeight: 700, fontSize: 30}}>早上好</span>
        </div>
      </div>
    );
  }
  // fix
  return (
    <div style={{fontFamily: F.mono, fontSize: 20, lineHeight: '36px', whiteSpace: 'pre'}}>
      <div style={{background: 'rgba(196,71,58,0.12)', color: C.red, borderRadius: 4, padding: '0 8px'}}>- if (user = null)</div>
      <div style={{background: 'rgba(120,140,93,0.16)', color: C.green, borderRadius: 4, padding: '0 8px', opacity: clamp(typeK * 2 - 0.5)}}>+ if (user === null)</div>
      <div style={{color: C.gray3, fontSize: 17, marginTop: 4, fontFamily: F.sans}}>1 file changed · tests passing</div>
    </div>
  );
};

const Card: React.FC<{d: CardDef; t: number; exitK: number; i: number}> = ({d, t, exitK, i}) => {
  const dt = t - d.at;
  if (dt < 0) return null;
  const sp = springy(dt, 2.4, 7.5);
  const fly = ease.outCubic(clamp(dt / 0.22));
  let x = d.x + d.from[0] * (1 - fly);
  let y = d.y + d.from[1] * (1 - fly);
  let rot = d.rot + (1 - fly) * (d.from[0] > 0 ? 25 : d.from[0] < 0 ? -25 : 10);
  let sc = d.kind === 'fix' ? lerp(1.6, 1.08, ease.outBack(clamp(dt / 0.2))) : lerp(0.85, 1, sp);
  // exit: fly outward from the center
  if (exitK > 0) {
    const dx = d.x - 960, dy = d.y - 470;
    const len = Math.hypot(dx, dy) || 1;
    const e = ease.inCubic(exitK);
    x += (dx / len) * 1400 * e + (d.kind === 'fix' ? 0 : 0);
    y += (dy / len) * 1000 * e + (d.kind === 'fix' ? 900 * e : 0);
    rot += e * (i % 2 ? 40 : -40);
  }
  const done = t > d.at + 0.32;
  const doneK = ease.outBack(seg(t, d.at + 0.32, d.at + 0.5));
  return (
    <div
      style={{
        position: 'absolute',
        left: x - CW / 2,
        top: y - CH / 2,
        width: CW,
        height: CH,
        transform: `rotate(${rot}deg) scale(${sc})`,
        background: '#FFFFFF',
        borderRadius: 22,
        border: '1.5px solid rgba(31,30,29,0.12)',
        boxShadow: `0 ${18 + (1 - fly) * 20}px 40px rgba(60,40,20,0.18)`,
        padding: '22px 24px',
        boxSizing: 'border-box',
        fontFamily: F.sans,
        zIndex: d.kind === 'fix' ? 5 : 1,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16}}>
        <div style={{width: 42, height: 42, borderRadius: 10, background: '#F0EEE6', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <ICode size={24} color={C.clayDark} />
        </div>
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{fontSize: 22, fontWeight: 600, color: C.ink, whiteSpace: 'nowrap'}}>{d.title}</div>
          <div style={{fontSize: 17, color: '#73726C'}}>{d.type}</div>
        </div>
        <div style={{width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {done ? (
            <div style={{width: 36, height: 36, borderRadius: 18, background: C.green, color: '#fff', fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${doneK})`}}>✓</div>
          ) : (
            <Flower size={14} spin={t * 400} shade={null} />
          )}
        </div>
      </div>
      <CardBody kind={d.kind} t={t} at={d.at} />
    </div>
  );
};

const TaskMontage: React.FC<{t: number}> = ({t}) => {
  if (t < T_IN || t >= T_CLOCK) return null;
  const wipe = ease.outCubic(seg(t, T_IN, T_IN + 0.16));
  const exitK = seg(t, 93.68, T_CLOCK);
  const camS = 1.04 - 0.04 * ease.outCubic(seg(t, T_IN, 93.6)) + 0.012 * beatPulse(t, 0.12);
  // Clawd scuttle
  const cp = seg(t, 92.1, 93.85);
  const clawdX = lerp(-180, 2000, ease.inOutQuad(cp));
  const hop = Math.abs(Math.sin(t * Math.PI * 8.7)) * 10;
  return (
    <AbsoluteFill style={{clipPath: `inset(0 ${(1 - wipe) * 50}% 0 ${(1 - wipe) * 50}%)`}}>
      <AbsoluteFill style={{background: C.paper}} />
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(rgba(31,30,29,0.13) 1.6px, transparent 1.8px)`,
          backgroundSize: '36px 36px',
          backgroundPosition: `${-(t - T_IN) * 40}px ${-(t - T_IN) * 20}px`,
        }}
      />
      <AbsoluteFill style={{transform: `scale(${camS})`}}>
        {CARDS.map((d, i) => (
          <Card key={i} d={d} t={t} exitK={exitK} i={i} />
        ))}
        {CARDS.map((d, i) => (
          <Ring key={'r' + i} x={d.x} y={d.y} t={t} at={d.at + 0.06} r0={120} r1={330} color={C.clayLight} width={4} dur={0.35} />
        ))}
      </AbsoluteFill>
      {/* Clawd on the run */}
      <div style={{position: 'absolute', left: clawdX - 88, top: 818 - hop, opacity: 1 - exitK}}>
        <Clawd cell={11} walk={t * 4.3} arms={Math.sin(t * 25) > 0 ? 1 : 0} />
        {/* speed lines */}
        {[0, 1, 2].map((k) => (
          <div key={k} style={{position: 'absolute', left: -60 - k * 18, top: 26 + k * 20, width: 46, height: 5, borderRadius: 3, background: C.clayLight, opacity: 0.7 - k * 0.2}} />
        ))}
      </div>
      <Cap t={t} text="And then do whatever" color={C.ink} hl={C.clay} outAt={93.72} />
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------------------------------ flower clock
// clock time keyed to the words: From 93.95 (6:00 AM) · AM 94.40 (9:00 AM) · to 94.86 (12:00 PM) · PM 95.26 (6:00 PM)
const KEYS: [number, number][] = [
  [93.95, 6.0],
  [94.4, 9.0],
  [94.86, 12.0],
  [95.26, 18.0],
  [95.47, 21.68],
];
const hourAt = (t: number) => {
  if (t <= KEYS[0][0]) return KEYS[0][1];
  for (let i = 0; i < KEYS.length - 1; i++) {
    const [a, ha] = KEYS[i], [b, hb] = KEYS[i + 1];
    if (t <= b) return lerp(ha, hb, ease.inOutQuad(seg(t, a, b)));
  }
  return KEYS[KEYS.length - 1][1];
};
const fmt = (h: number) => {
  const hh = Math.floor(h) % 24;
  const mm = Math.floor((h - Math.floor(h)) * 60);
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return {time: `${h12}:${mm.toString().padStart(2, '0')}`, ap: hh < 12 ? 'AM' : 'PM'};
};

/** a replica of the claude.ai composer (home) — theme aware */
export const MiniComposer: React.FC<{x: number; y: number; w: number; dark: number; placeholder?: string; s?: number; text?: React.ReactNode; opacity?: number}> = ({
  x,
  y,
  w,
  dark,
  placeholder = 'How can I help you today?',
  s = 1.3,
  text,
  opacity = 1,
}) => {
  const th = appTheme(dark);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y,
        width: w,
        background: th.raised,
        borderRadius: 20 * s,
        border: `${s}px solid ${th.hair2}`,
        boxShadow: `0 ${4 * s}px ${18 * s}px rgba(0,0,0,${0.05 + dark * 0.15})`,
        padding: `${14 * s}px ${16 * s}px ${12 * s}px`,
        boxSizing: 'border-box',
        fontFamily: F.sans,
        opacity,
      }}
    >
      <div style={{fontSize: 16 * s, color: text ? th.text : th.muted, minHeight: 16 * s * 1.6, lineHeight: 1.5}}>{text ?? placeholder}</div>
      <div style={{display: 'flex', alignItems: 'center', marginTop: 10 * s, gap: 8 * s}}>
        <div style={{width: 32 * s, height: 32 * s, borderRadius: 8 * s, border: `${s}px solid ${th.hair2}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <IPlus size={18 * s} color={th.text2} />
        </div>
        <div style={{width: 32 * s, height: 32 * s, borderRadius: 8 * s, border: `${s}px solid ${th.hair2}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <ISliders size={18 * s} color={th.text2} />
        </div>
        <div style={{flex: 1}} />
        <div style={{fontSize: 14 * s, color: th.text2, display: 'flex', alignItems: 'center', gap: 4 * s}}>
          Opus 5.5 <IChevron size={14 * s} color={th.text2} />
        </div>
        <div style={{width: 32 * s, height: 32 * s, borderRadius: 8 * s, background: th.brand, opacity: text ? 1 : 0.45, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <IArrowUp size={18 * s} color="#fff" stroke={2.2} />
        </div>
      </div>
    </div>
  );
};

const GREETS: [number, string][] = [
  [T_CLOCK, 'Good morning'],
  [94.86, 'Good afternoon'],
  [95.26, 'Good evening'],
];

const FlowerClock: React.FC<{t: number}> = ({t}) => {
  if (t < T_CLOCK - 0.02 || t >= T_SPLIT + 0.3) return null;
  const h = hourAt(t);
  const dark = ease.inOutCubic(seg(h, 13.5, 20.5));
  const th = appTheme(dark);
  const hand = ((h - 6) / 12) * 360; // deg, 0 = up
  const {time, ap} = fmt(h);
  // sky colour by hour
  const skyStops: [number, string][] = [
    [6, '#F9DDA4'],
    [9, '#FBEBC8'],
    [12, '#FFF8EC'],
    [15, '#FBE2CB'],
    [18, '#F0A27F'],
    [19.5, '#8E3F27'],
    [21.7, '#2B2A35'],
  ];
  let sky = skyStops[0][1];
  for (let i = 0; i < skyStops.length - 1; i++) {
    if (h >= skyStops[i][0]) sky = mix(skyStops[i][1], skyStops[i + 1][1], seg(h, skyStops[i][0], skyStops[i + 1][0]));
  }
  const intro = ease.outBack(seg(t, T_CLOCK, T_CLOCK + 0.3));
  const FX = 960, FY = 330, FSZ = 200;
  const unlit = mix('#E3DFD3', '#3D3C38', dark);
  const petals = PETAL_ANG.map((a, i) => {
    const litAt = a; // deg
    const lit = hand >= litAt;
    // flash when the hand passes
    const passT = lit ? clamp((hand - litAt) / 25) : 0;
    return {
      color: lit ? (passT < 1 ? mix('#FFE3C9', C.clay, passT) : C.clay) : unlit,
      scale: lit ? 1 + 0.12 * (1 - passT) : 0.92,
    };
  });
  const amK = pulse(t, 94.4, 0.18), pmK = pulse(t, 95.26, 0.18);
  const exitK = ease.inCubic(seg(t, T_SPLIT - 0.08, T_SPLIT + 0.3));
  const ri = 228;
  const sunA = ((hand - 90) * Math.PI) / 180;
  return (
    <AbsoluteFill style={{background: th.page, opacity: 1 - exitK * 0}}>
      {/* sky glow */}
      <AbsoluteFill style={{background: `radial-gradient(ellipse 1100px 760px at ${FX}px ${FY}px, ${sky} 0%, ${mix(sky, th.page, 0.6)} 45%, ${th.page} 80%)`}} />
      {/* stars at night */}
      {dark > 0.4
        ? Array.from({length: 40}, (_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: rand(51, i) * W,
                top: rand(52, i) * 560,
                width: 3 + rand(53, i) * 3,
                height: 3 + rand(53, i) * 3,
                borderRadius: 3,
                background: C.cream,
                opacity: (dark - 0.4) * 1.4 * (0.4 + 0.6 * Math.abs(Math.sin(t * 3 + i))),
              }}
            />
          ))
        : null}
      <AbsoluteFill style={{transform: `scale(${lerp(0.9, 1, intro)})`, opacity: clamp(seg(t, T_CLOCK - 0.02, T_CLOCK + 0.1))}}>
        {/* dial ring with hour ticks */}
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
          <circle cx={FX} cy={FY} r={ri} fill="none" stroke={th.hair2} strokeWidth={2} />
          {Array.from({length: 12}, (_, i) => {
            const a = (i * 30 - 90) * (Math.PI / 180);
            return <line key={i} x1={FX + Math.cos(a) * (ri - 8)} y1={FY + Math.sin(a) * (ri - 8)} x2={FX + Math.cos(a) * (ri + 8)} y2={FY + Math.sin(a) * (ri + 8)} stroke={th.muted} strokeWidth={3} strokeLinecap="round" />;
          })}
          <path
            d={`M${FX},${FY - ri} A${ri},${ri} 0 ${hand % 360 > 180 ? 1 : 0} 1 ${FX + Math.cos(sunA) * ri},${FY + Math.sin(sunA) * ri}`}
            fill="none"
            stroke={C.clay}
            strokeWidth={5}
            strokeLinecap="round"
            opacity={hand >= 360 ? 0 : 1}
          />
          {hand >= 360 ? <circle cx={FX} cy={FY} r={ri} fill="none" stroke={C.clay} strokeWidth={5} /> : null}
          <circle cx={FX + Math.cos(sunA) * ri} cy={FY + Math.sin(sunA) * ri} r={13} fill={dark > 0.6 ? C.cream : C.gold} style={{filter: `drop-shadow(0 0 10px ${dark > 0.6 ? C.cream : C.gold})`}} />
        </svg>
        <Flower x={FX} y={FY} size={FSZ} open={1} petals={petals} shade={null} centerScale={2.05} centerColor={th.raised} glow={0.25 + 0.6 * pmK} spin={0} />
        {/* time readout inside the flower centre */}
        <div style={{position: 'absolute', left: FX, top: FY, transform: 'translate(-50%,-50%)', textAlign: 'center', fontFamily: F.sans}}>
          <div style={{fontSize: 46, fontWeight: 600, color: th.text, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', lineHeight: 1}}>{time}</div>
          <div style={{fontSize: 30, fontWeight: 700, color: C.clay, marginTop: 6, transform: `scale(${1 + 0.6 * (ap === 'AM' ? amK : pmK)})`, letterSpacing: '0.08em'}}>{ap}</div>
        </div>
        {/* greeting (rolls like the real home screen re-rendering) */}
        <div style={{position: 'absolute', left: 0, right: 0, top: 590, height: 100, overflow: 'hidden'}}>
          {GREETS.map(([at, g], i) => {
            const next = GREETS[i + 1]?.[0] ?? 1e9;
            const inK = i === 0 ? 1 : ease.outCubic(seg(t, at - 0.02, at + 0.16));
            const outK = ease.inCubic(seg(t, next - 0.1, next + 0.04));
            if (t < at - 0.02 && i > 0) return null;
            if (outK >= 1) return null;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  textAlign: 'center',
                  fontFamily: F.serif,
                  fontWeight: 300,
                  fontSize: 78,
                  color: th.text2,
                  letterSpacing: '-0.01em',
                  lineHeight: '100px',
                  transform: `translateY(${(1 - inK) * 70 - outK * 70}px)`,
                  opacity: inK * (1 - outK),
                }}
              >
                {g}
              </div>
            );
          })}
        </div>
        <MiniComposer x={960} y={712} w={1000} dark={dark} s={1.3} />
      </AbsoluteFill>
      <Ring x={FX} y={FY} t={t} at={94.4} r0={FSZ} r1={420} color={C.gold} width={5} dur={0.4} />
      <Ring x={FX} y={FY} t={t} at={95.26} r0={FSZ} r1={460} color={C.clay} width={6} dur={0.45} />
      <Cap t={t} text="From AM to PM" color={th.text} hl={C.clay} outAt={95.42} />
    </AbsoluteFill>
  );
};

export const TasksShot: React.FC<{t: number}> = ({t}) => (
  <>
    <FlowerClock t={t} />
    <TaskMontage t={t} />
  </>
);
