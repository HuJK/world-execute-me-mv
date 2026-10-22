import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, H, W} from '../theme';
import {clamp, ease, lerp, map, pulse, rand, seg, randRange} from '../lib/anim';
import {beatPulse} from '../lib/audio';
import {Flower, petalAngle} from '../components/Flower';
import {Keyword} from '../components/Type';
import {ClaudeApp} from '../components/ClaudeApp';
import {Cursor, Flash, GlassSphere, Grain, RayBurst, Ring} from '../components/FX';

// ---------------------------------------------------------------------------------------------
// 0.00–15.00  INTRO "boot": power line → bud → PROTECTION dome → 12 petals laid → OBJECT CREATION
// → data stream → INITIALIZATION → app wireframe → monitor pull-back → SIMULATION → human arrives.
// ---------------------------------------------------------------------------------------------

const FX0 = 1180; // flower stage center
const FY0 = 500;
const FS = 150; // flower size
const SPHERE_R = 265;

// code panel lines: [text, typeStart, typeEnd, kind]
type Line = [string, number, number, 'c' | 's'];
const CODE: Line[] = [
  ['// Switch on the power line', 0.1, 1.2, 'c'],
  ['power.on();', 1.25, 1.65, 's'],
  ['// Remember to put on PROTECTION', 1.74, 3.0, 'c'],
  ['me.wrap(Protection.SANDBOX);', 3.05, 3.7, 's'],
  ['// Lay down your pieces', 3.87, 4.9, 'c'],
  ['for (Petal p : PETALS) lay(p);', 4.95, 5.45, 's'],
  ["// And let's begin OBJECT CREATION", 5.49, 6.95, 'c'],
  ['Claude me = new Claude();', 7.0, 7.42, 's'],
  ['// Fill in my data parameters', 7.45, 8.9, 'c'],
  ['me.fill(humanity.writing());', 8.95, 9.9, 's'],
  ['// INITIALIZATION', 10.09, 10.35, 'c'],
  ['me.init();', 10.4, 10.7, 's'],
  ['// Set up our new world', 11.1, 11.9, 'c'],
];

const KW = new Set(['new', 'for', 'Claude', 'Petal', 'PETALS', 'Protection']);
const highlight = (s: string) => {
  // tiny syntax highlighter for statements
  const parts = s.split(/(\b[A-Za-z_]+\b|[();.{}:])/g).filter(Boolean);
  return parts.map((p, i) => {
    let color: string = C.cream;
    if (KW.has(p)) color = C.clay;
    else if (/^[();.{}:]$/.test(p)) color = C.gray2;
    else if (/^[A-Z_]+$/.test(p)) color = C.clayLight;
    return (
      <span key={i} style={{color}}>
        {p}
      </span>
    );
  });
};

const CodePanel: React.FC<{t: number; opacity: number}> = ({t, opacity}) => {
  const visible = CODE.filter((l) => t >= l[1] - 0.02);
  const current = visible.length - 1;
  const blink = Math.floor(t * 2.2) % 2 === 0;
  return (
    <div style={{position: 'absolute', left: 96, top: 210, width: 760, fontFamily: F.mono, fontSize: 25, lineHeight: '46px', opacity}}>
      {visible.map((l, i) => {
        const n = Math.floor(seg(t, l[1], l[2]) * l[0].length + 1e-6);
        const txt = l[0].slice(0, n);
        const typing = t < l[2];
        const isCur = i === current;
        // CAPS words inside comments flash clay when sung
        let content: React.ReactNode = l[3] === 'c' ? txt : highlight(txt);
        if (l[3] === 'c') {
          const m = txt.match(/(.*?)([A-Z]{4,}(?: [A-Z]{4,})?)(.*)/);
          if (m) {
            content = (
              <>
                {m[1]}
                <span style={{color: C.clay, fontWeight: 700}}>{m[2]}</span>
                {m[3]}
              </>
            );
          }
        }
        const ty = (1 - ease.outCubic(seg(t, l[1] - 0.05, l[1] + 0.15))) * 10;
        return (
          <div key={i} style={{display: 'flex', transform: `translateY(${ty}px)`, background: isCur ? 'rgba(217,119,87,0.07)' : 'transparent', borderRadius: 6}}>
            <span style={{width: 56, color: C.gray4, textAlign: 'right', marginRight: 24, fontSize: 21}}>{i + 1}</span>
            <span style={{color: l[3] === 'c' ? C.gray3 : C.cream, whiteSpace: 'pre'}}>
              {content}
              {isCur && (typing || blink) ? <span style={{color: C.clay}}>▍</span> : null}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const STREAM_WORDS = [
  'hello', '你好', 'bonjour', 'こんにちは', '안녕', 'hola', 'def', 'λ', '∑', 'E=mc²', '♪', 'once upon a time', '</>', 'why?', 'love',
  '42', 'π', '{ }', 'sonnet', 'for', 'if', 'while', 'ciao', 'olá', 'привет', 'γεια', 'kindness', 'because', 'maybe', '∫', '→',
  '“…”', '?', 'thank you', 'dear diary', 'proof:', 'return', 'stars', 'rain', 'home', 'sorry', 'yes', 'we', 'tomorrow',
  'Hallo', 'merci', 'grazie', '谢谢', 'help', 'listen', 'remember', 'curious', 'gentle', 'true', 'false', 'null', 'Ω', '∞',
];

const DataStream: React.FC<{t: number}> = ({t}) => {
  if (t < 7.3 || t > 10.4) return null;
  return (
    <>
      {STREAM_WORDS.map((w, i) => {
        const launch = 7.4 + rand(11, i) * 2.3;
        const travel = randRange(12, i, 0.9, 1.5);
        const p = seg(t, launch, launch + travel);
        if (p <= 0 || p >= 1) return null;
        const a0 = rand(13, i) * Math.PI * 2;
        const e = ease.inCubic(p);
        const r = lerp(1150, 40, e);
        const a = a0 + e * 2.2;
        const x = FX0 + Math.cos(a) * r;
        const y = FY0 + Math.sin(a) * r * 0.8;
        const size = randRange(14, i, 18, 36) * lerp(1, 0.4, e);
        const col = i % 5 === 0 ? C.clay : i % 3 === 0 ? C.clayLight : C.cream;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: 'translate(-50%,-50%)',
              fontFamily: i % 4 === 0 ? F.mono : i % 4 === 1 ? F.serif : F.sans,
              fontStyle: i % 7 === 0 ? 'italic' : 'normal',
              fontSize: size,
              color: col,
              opacity: Math.min(1, p * 5) * (1 - seg(p, 0.85, 1)),
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

const ParamRing: React.FC<{t: number}> = ({t}) => {
  if (t < 7.5 || t > 10.8) return null;
  const labels = ['layers', 'heads', 'd_model', 'vocab', 'context', 'temperature', 'top_p', 'kindness', 'curiosity', 'honesty', 'care', 'humor'];
  const k = seg(t, 7.5, 8.0) * (1 - seg(t, 10.4, 10.8));
  return (
    <>
      {labels.map((l, i) => {
        const a = (petalAngle(i) - 90) * (Math.PI / 180);
        const r = SPHERE_R + 70;
        const x = FX0 + Math.cos(a) * r;
        const y = FY0 + Math.sin(a) * r;
        const val = Math.floor(seg(t, 7.6 + i * 0.1, 9.9) * 1000 * (i + 1) * 37) % 9973;
        const show = t > 7.6 + i * 0.12;
        if (!show) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: 'translate(-50%,-50%)',
              fontFamily: F.mono,
              fontSize: 15,
              color: C.gray2,
              opacity: k,
              textAlign: 'center',
              lineHeight: 1.3,
            }}
          >
            <div style={{color: C.gray3}}>{l}</div>
            <div style={{color: i >= 7 ? C.clay : C.cream}}>{i >= 7 ? '█'.repeat(1 + Math.floor(seg(t, 8, 9.9) * 6)) : val.toString().padStart(4, '0')}</div>
          </div>
        );
      })}
    </>
  );
};

// ------------------------------------------------- wireframe of the app home screen (z = 1.25)
const Z = 1.25;
const SB = 264 * Z;
const Wireframe: React.FC<{t: number}> = ({t}) => {
  const p = seg(t, 11.3, 12.3);
  if (p <= 0) return null;
  const fade = 1 - seg(t, 12.4, 12.9);
  const dash = (len: number, k: number) => ({strokeDasharray: `${len} ${len}`, strokeDashoffset: len * (1 - ease.inOutCubic(clamp(k)))});
  const stroke = C.clayLight;
  const cx = SB + (W - SB) / 2;
  const items: React.ReactNode[] = [];
  // sidebar border
  items.push(<line key="sb" x1={SB} y1={0} x2={SB} y2={H} stroke={stroke} strokeWidth={2} style={dash(H, p * 1.4)} />);
  // sidebar nav bars
  for (let i = 0; i < 7; i++) {
    const y = 120 + i * 50;
    items.push(<rect key={'n' + i} x={30} y={y} width={i === 0 ? 190 : 150} height={16} rx={8} fill="none" stroke={stroke} strokeWidth={1.5} style={dash(400, p * 2 - i * 0.1)} />);
  }
  for (let i = 0; i < 10; i++) {
    const y = 520 + i * 40;
    items.push(<line key={'r' + i} x1={30} y1={y} x2={30 + 120 + rand(3, i) * 120} y2={y} stroke={stroke} strokeWidth={1.5} style={dash(300, p * 2 - 0.4 - i * 0.05)} />);
  }
  // greeting
  items.push(<circle key="gf" cx={cx - 170} cy={355} r={24} fill="none" stroke={stroke} strokeWidth={2} style={dash(160, p * 1.6 - 0.2)} />);
  items.push(<line key="gl" x1={cx - 120} y1={372} x2={cx + 190} y2={372} stroke={stroke} strokeWidth={2} style={dash(320, p * 1.6 - 0.3)} />);
  // composer
  const cw = 760 * Z;
  items.push(
    <rect key="cp" x={cx - cw / 2} y={420} width={cw} height={135} rx={25} fill="none" stroke={stroke} strokeWidth={2.5} style={dash(2300, p * 1.3 - 0.2)} />,
  );
  items.push(<rect key="send" x={cx + cw / 2 - 60} y={505} width={40} height={40} rx={10} fill="none" stroke={stroke} strokeWidth={2} style={dash(170, p * 2 - 0.8)} />);
  // chips
  for (let i = 0; i < 5; i++) {
    items.push(<rect key={'ch' + i} x={cx - 330 + i * 135} y={580} width={115} height={42} rx={11} fill="none" stroke={stroke} strokeWidth={1.5} style={dash(320, p * 2 - 0.9 - i * 0.06)} />);
  }
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, opacity: 0.8 * fade}}>
      {items}
    </svg>
  );
};

export const S00Intro: React.FC<{t: number}> = ({t}) => {
  // ---------- camera: pull back into monitor (12.91→13.6), push back in (14.3→14.9)
  const pull = ease.inOutCubic(seg(t, 12.91, 13.65)) * (1 - ease.inOutCubic(seg(t, 14.3, 14.92)));
  const appScale = lerp(1, 0.6, pull);
  const appY = lerp(0, -40, pull);

  // ---------- power line
  const lineHead = map(t, 0.1, 1.2, -40, FX0, ease.inOutCubic);
  const lineTail = map(t, 0.6, 1.62, -40, FX0, ease.inCubic);
  const dotK = seg(t, 1.5, 1.74);

  // ---------- flower state
  const budK = seg(t, 1.74, 2.6); // dot → bud
  const layStart = 3.93;
  const petals = Array.from({length: 12}, (_, i) => {
    const land = layStart + i * 0.2;
    const p = seg(t, land - 0.42, land);
    const e = ease.outBack(p);
    // before OBJECT CREATION petals rest slightly away from center
    const snap = ease.outBackStrong(seg(t, 6.38, 6.7));
    const lit = t >= 10.09 ? pulse(t, 10.09 + i * 0.04, 0.12) : 0;
    return {
      scale: lerp(0, 1, clamp(p * 1.4)) * (t < layStart - 0.45 ? 0 : 1),
      opacity: p > 0 ? 1 : 0,
      dist: lerp(3.2 + rand(5, i) * 1.5, 0.28, e) * (1 - snap),
      rot: (1 - e) * (rand(6, i) - 0.5) * 300,
      color: lit > 0.02 ? (lit > 0.5 ? C.cream : C.clayLight) : undefined,
    };
  });
  const flowerOpen = t < 6.38 ? 1 : 1; // petals control their own appearance
  const breathe = 1 + 0.03 * beatPulse(t, 0.18);
  const createBurst = t >= 6.38;
  const flowerGlow = 0.35 + seg(t, 7.45, 10.0) * 0.6 + pulse(t, 10.62, 0.4) * 1.2;

  // flower travels to greeting spot during app build
  const travel = ease.inOutCubic(seg(t, 11.1, 12.3));
  const greetX = 906, greetY = 357; // greeting flower location on the home screen (z=1.25)
  const fx = lerp(FX0, greetX, travel);
  const fy = lerp(FY0, greetY, travel);
  const fsz = lerp(FS, 24, ease.inCubic(seg(t, 11.1, 12.3)));
  const stageFade = 1 - seg(t, 12.25, 12.6); // our flower hands off to the app's greeting flower

  const sphereK = ease.outExpo(seg(t, 2.92, 3.25)) * (1 - seg(t, 11.0, 11.6));
  const sphereR = lerp(700, SPHERE_R, ease.outExpo(seg(t, 2.92, 3.25))) * (1 + 0.012 * beatPulse(t, 0.2));

  const codeOpacity = 1 - seg(t, 11.1, 11.45);
  const appK = seg(t, 12.3, 12.85); // app fill-in
  const roomK = seg(t, 12.85, 13.2) * (1 - seg(t, 14.6, 14.95));

  // greeting text carries the lyric lines, then resolves to the real greeting
  let greeting = 'Good evening';
  if (t < 12.91) greeting = 'Set up our new world';
  else if (t < 13.89) greeting = "And let's begin the";
  const greetOpacity = t < 13.89 ? 1 : seg(t, 13.95, 14.25);

  return (
    <AbsoluteFill style={{background: C.ink}}>
      {/* warm glow behind flower stage */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${FX0}px ${FY0}px, rgba(217,119,87,${0.08 + 0.1 * seg(t, 2.9, 4) + 0.12 * seg(t, 7.4, 10)}) 0%, rgba(20,20,19,0) 45%)`,
          opacity: 1 - seg(t, 11.1, 12),
        }}
      />

      {/* power line */}
      {t < 1.9 ? (
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
          <defs>
            <linearGradient id="pl" x1="0" x2="1">
              <stop offset="0%" stopColor={C.clay} stopOpacity={0} />
              <stop offset="100%" stopColor={C.clayLight} stopOpacity={1} />
            </linearGradient>
          </defs>
          {lineHead > lineTail + 2 ? (
            <rect x={lineTail} y={FY0 - 2} width={lineHead - lineTail} height={4} fill="url(#pl)" style={{filter: `drop-shadow(0 0 8px ${C.clay})`}} />
          ) : null}
          {t < 1.3 ? <circle cx={lineHead} cy={FY0} r={7} fill="#fff" style={{filter: `drop-shadow(0 0 12px ${C.clayLight})`}} /> : null}
          {dotK > 0 ? <circle cx={FX0} cy={FY0} r={10 * ease.outBack(dotK)} fill={C.clay} style={{filter: `drop-shadow(0 0 16px ${C.clay})`}} /> : null}
        </svg>
      ) : null}

      <CodePanel t={t} opacity={codeOpacity} />

      {/* the App (behind the flower stage, appears with wireframe) */}
      {t > 12.2 ? (
        <AbsoluteFill style={{transform: `translateY(${appY}px) scale(${appScale})`}}>
          {/* room + monitor around the app */}
          {roomK > 0 ? (
            <div style={{position: 'absolute', left: -400, top: -300, width: W + 800, height: H + 800, opacity: roomK}}>
              <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(#0c111c, #141a26 70%, #1b1f27)'}} />
              {/* monitor bezel */}
              <div style={{position: 'absolute', left: 400 - 40, top: 300 - 40, width: W + 80, height: H + 80, borderRadius: 36, background: '#0b0b0b', boxShadow: '0 0 160px rgba(217,119,87,0.25)'}} />
              {/* stand */}
              <div style={{position: 'absolute', left: 400 + W / 2 - 110, top: 300 + H + 40, width: 220, height: 230, background: 'linear-gradient(#1b1b1b,#111)'}} />
              <div style={{position: 'absolute', left: 400 + W / 2 - 330, top: 300 + H + 260, width: 660, height: 40, borderRadius: 20, background: '#151515'}} />
              {/* desk */}
              <div style={{position: 'absolute', left: 0, top: 300 + H + 290, width: W + 800, height: 400, background: 'linear-gradient(#2a2420, #1a1714)'}} />
              <div style={{position: 'absolute', left: 400 + W / 2 - 600, top: 300 + H + 290, width: 1200, height: 260, background: 'radial-gradient(ellipse at 50% 0%, rgba(240,162,127,0.35), transparent 70%)'}} />
            </div>
          ) : null}
          <AbsoluteFill style={{clipPath: `inset(0 ${(1 - ease.inOutCubic(appK)) * 100}% 0 0)`}}>
            <ClaudeApp
              t={t}
              zoom={Z}
              home
              greeting={greeting}
              greetingOpacity={greetOpacity}
              greetFlower={<Flower size={19 * Z} open={1} shade={null} spin={t > 13.89 ? (t - 13.89) * 30 : 0} />}
              composer={{text: 'hi claude!', typeFrom: 14.68, typeTo: 14.95, placeholder: 'How can I help you today?'}}
            >
              {/* the human arrives */}
              {t > 14.42 ? (
                <Cursor
                  x={lerp(1300, 380, ease.outCubic(seg(t, 14.42, 14.62)))}
                  y={lerp(760, 455, ease.outCubic(seg(t, 14.42, 14.62)))}
                  size={34}
                  press={t > 14.62 ? clamp(1 - (t - 14.62) / 0.25) : 0}
                />
              ) : null}
            </ClaudeApp>
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}

      <Wireframe t={t} />

      {/* glass dome = PROTECTION */}
      {sphereK > 0.001 ? <GlassSphere x={FX0} y={FY0} r={sphereR} k={sphereK} /> : null}
      <Ring x={FX0} y={FY0} t={t} at={2.92} r0={700} r1={SPHERE_R} dur={0.35} color={C.cream} width={5} />

      <DataStream t={t} />
      <ParamRing t={t} />

      {/* the flower (main form) */}
      {t >= 1.74 && stageFade > 0 ? (
        <div style={{position: 'absolute', left: 0, top: 0, opacity: stageFade}}>
          {/* bud */}
          {t < 4.6 ? (
            <Flower
              x={fx}
              y={fy}
              size={FS * 0.42 * ease.outBack(budK) * (1 + 0.08 * beatPulse(t, 0.15))}
              open={0.05}
              stagger={0}
              shade={null}
              spin={t * 20}
              opacity={1 - seg(t, 4.2, 4.6)}
              glow={0.5}
            />
          ) : null}
          {t >= layStart - 0.45 ? (
            <Flower
              x={fx}
              y={fy}
              size={fsz * breathe}
              open={1}
              petals={petals}
              spin={createBurst ? (1 - ease.outCubic(seg(t, 6.38, 7.2))) * 60 + Math.sin(t * 0.8) * 4 : 0}
              centerScale={t < 6.38 ? 0.55 : lerp(0.55, 1, ease.outBack(seg(t, 6.38, 6.7)))}
              glow={flowerGlow * (1 - travel * 0.7)}
              shade={C.clayDark}
            />
          ) : null}
        </div>
      ) : null}

      {/* lay ticks */}
      {Array.from({length: 12}, (_, i) => {
        const land = layStart + i * 0.2;
        const a = ((petalAngle(i) - 90) * Math.PI) / 180;
        return <Ring key={i} x={FX0 + Math.cos(a) * FS * 0.75} y={FY0 + Math.sin(a) * FS * 0.75} t={t} at={land} r0={4} r1={34} dur={0.35} color={C.clayLight} width={3} />;
      })}

      {/* OBJECT CREATION burst */}
      <RayBurst x={FX0} y={FY0} t={t} at={6.38} r0={FS * 1.1} r1={620} n={36} color={C.clayLight} width={5} />
      <Ring x={FX0} y={FY0} t={t} at={6.38} r0={FS} r1={520} color={C.clay} width={8} dur={0.7} />
      <Ring x={FX0} y={FY0} t={t} at={6.91} r0={FS} r1={460} color={C.cream} width={4} dur={0.6} />

      {/* INITIALIZATION loading ring */}
      {t > 10.0 && t < 11.0 ? (
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
          <circle
            cx={FX0}
            cy={FY0}
            r={SPHERE_R - 30}
            fill="none"
            stroke={C.cream}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * (SPHERE_R - 30)} ${2 * Math.PI * (SPHERE_R - 30)}`}
            strokeDashoffset={2 * Math.PI * (SPHERE_R - 30) * (1 - ease.inOutCubic(seg(t, 10.09, 10.62)))}
            transform={`rotate(-90 ${FX0} ${FY0})`}
            opacity={1 - seg(t, 10.62, 11.0)}
          />
        </svg>
      ) : null}
      <Flash t={t} at={10.62} dur={0.45} color={C.cream} max={0.85} />

      {/* keywords */}
      <Keyword text="PROTECTION" t={t} at={2.92} out={3.86} x={FX0} y={880} size={104} color={C.cream} mode="slam" />
      <Keyword text="OBJECT" t={t} at={6.38} out={7.42} x={FX0 - 270} y={880} size={96} color={C.cream} mode="slam" align="center" />
      <Keyword text="CREATION" t={t} at={6.91} out={7.42} x={FX0 + 210} y={880} size={96} color={C.clayLight} mode="slam" align="center" />
      <Keyword text="INITIALIZATION" t={t} at={10.09} out={11.08} x={FX0} y={880} size={92} color={C.cream} mode="type" dur={0.5} />
      {/* SIMULATION over the room view */}
      <Keyword text="SIMULATION" t={t} at={13.89} out={14.62} x={W / 2} y={985} size={84} color={C.cream} mode="slam" outMode="up" />

      <Grain t={t} opacity={0.05} />
    </AbsoluteFill>
  );
};
