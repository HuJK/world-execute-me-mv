import React from 'react';
import {C, F} from '../../theme';
import {noise1, rand} from '../../lib/anim';
import {OSWindow} from '../../components/FX';

// ---------------------------------------------------------------------------------------------
// The 12 apps the human left Claude for. Flat, brand-free, icon-like window bodies.
// Reused by the EXECUTION scene: the bridge ends (147.66) with these 12 windows in a clock ring.
//
// HANDOFF @147.66: background #0E0E0D; ring centre (960,540); 12 dark OSWindows w=250 h=160,
// centred on radius 400 at angle i*30° clockwise from 12 o'clock, titles = APP_NAMES[i];
// body = <AppWindowContent name t/>. Use <RingWindow name i t/> to reproduce one exactly.
// ---------------------------------------------------------------------------------------------

export const APP_NAMES = ['Video', 'Feed', 'Shop', 'Mail', 'Games', 'News', 'Music', 'Maps', 'Photos', 'Docs', 'Chat', 'Calendar'] as const;
export type AppName = (typeof APP_NAMES)[number];

export const APP_ACCENT: Record<AppName, string> = {
  Video: '#E07A5F',
  Feed: '#9B8AC4',
  Shop: '#E2B65B',
  Mail: '#4FA3A5',
  Games: '#86C06C',
  News: '#CFCBBF',
  Music: '#E58FB0',
  Maps: '#6FB3D2',
  Photos: '#F2C57C',
  Docs: '#8AA4C8',
  Chat: '#6A9BCC',
  Calendar: '#D98E73',
};

export const RING = {cx: 960, cy: 540, r: 400, w: 250, h: 160};
/** centre of ring slot i (0 = 12 o'clock, clockwise every 30°) */
export const ringSlot = (i: number) => {
  const a = (i * 30 * Math.PI) / 180;
  return {x: RING.cx + RING.r * Math.sin(a), y: RING.cy - RING.r * Math.cos(a)};
};

const BW = 250; // body viewBox (OSWindow body = 250 x 126)
const BH = 126;

const bar = (x: number, y: number, w: number, h: number, fill: string, key?: string | number, op = 1) => (
  <rect key={key} x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} opacity={op} />
);

const Video: React.FC<{t: number; a: string}> = ({t, a}) => {
  const prog = (t * 0.035) % 1;
  return (
    <>
      <defs>
        <linearGradient id="vid-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3B3550" />
          <stop offset="1" stopColor="#6B4A45" />
        </linearGradient>
      </defs>
      <rect x={8} y={7} width={234} height={92} rx={6} fill="url(#vid-sky)" />
      <circle cx={190 - prog * 30} cy={38} r={12} fill="#F2C57C" opacity={0.85} />
      <path d="M8,82 Q50,52 92,74 T170,68 T242,72 V99 H8 Z" fill="#2E3A33" />
      <path d="M8,92 Q70,74 130,88 T242,84 V99 H8 Z" fill="#232B27" />
      <circle cx={125} cy={53} r={19} fill={a} opacity={0.95} />
      <path d="M119,43 L134,53 L119,63 Z" fill="#FFFFFF" />
      {bar(10, 109, 230, 4, '#3A3A38')}
      {bar(10, 109, 230 * prog, 4, a)}
      <circle cx={10 + 230 * prog} cy={111} r={4.5} fill="#FFFFFF" />
    </>
  );
};

const Feed: React.FC<{t: number; a: string}> = ({t, a}) => {
  const off = (t * 22) % 66;
  return (
    <g>
      {[0, 1, 2].map((k) => {
        const y = 6 + k * 66 - off;
        return (
          <g key={k} transform={`translate(0 ${y})`}>
            <circle cx={20} cy={11} r={7} fill={[a, '#E2B65B', '#4FA3A5'][k % 3]} />
            {bar(32, 6, 60, 5, '#C2C0B6')}
            {bar(32, 14, 34, 4, '#5E5D59')}
            <rect x={12} y={24} width={196} height={30} rx={5} fill={['#3B3550', '#33403A', '#4A3A36'][k % 3]} />
            <circle cx={40 + k * 40} cy={39} r={8} fill={a} opacity={0.5} />
            <path d={`M225,${33} c-3,-5 -10,-2 -7,3 l7,7 l7,-7 c3,-5 -4,-8 -7,-3 z`} fill={a} />
            {bar(216, 46, 18, 4, '#5E5D59')}
          </g>
        );
      })}
    </g>
  );
};

const Shop: React.FC<{t: number; a: string}> = ({t, a}) => {
  const bob = Math.sin(t * 3) * 1.5;
  return (
    <>
      {[0, 1, 2].map((k) => {
        const x = 10 + k * 78;
        return (
          <g key={k}>
            <rect x={x} y={8} width={70} height={66} rx={6} fill="#262624" />
            {k === 0 ? <path d={`M${x + 20},${26} l8,-6 h14 l8,6 l-5,7 l-4,-2 v24 h-22 v-24 l-4,2 z`} fill={a} /> : null}
            {k === 1 ? (
              <path d={`M${x + 14},${52} q0,-14 10,-16 l10,-6 q8,10 22,12 q4,2 4,10 z`} fill="#4FA3A5" />
            ) : null}
            {k === 2 ? (
              <>
                <rect x={x + 18} y={30} width={34} height={28} rx={4} fill="#9B8AC4" />
                <path d={`M${x + 26},30 v-6 a9,9 0 0 1 18,0 v6`} stroke="#9B8AC4" strokeWidth={3} fill="none" />
              </>
            ) : null}
            {bar(x + 6, 80, 36, 5, '#C2C0B6')}
            <text x={x + 6} y={100} fontFamily={F.mono} fontSize={12} fontWeight={700} fill={a}>
              ${[24, 89, 45][k]}
            </text>
          </g>
        );
      })}
      <g transform={`translate(214 ${96 + bob})`}>
        <path d="M-12,-8 h4 l4,14 h14 l3,-10 h-19" stroke="#E8E6DC" strokeWidth={2.2} fill="none" strokeLinejoin="round" />
        <circle cx={-2} cy={10} r={2.4} fill="#E8E6DC" />
        <circle cx={9} cy={10} r={2.4} fill="#E8E6DC" />
        <circle cx={12} cy={-12} r={7} fill={a} />
        <text x={12} y={-8.5} textAnchor="middle" fontFamily={F.sans} fontSize={10} fontWeight={700} fill="#141413">
          3
        </text>
      </g>
    </>
  );
};

const Mail: React.FC<{t: number; a: string}> = ({t, a}) => {
  const n = 99;
  return (
    <>
      <rect x={10} y={10} width={52} height={38} rx={5} fill={a} />
      <path d="M10,14 L36,34 L62,14" stroke="#141413" strokeWidth={3} fill="none" strokeLinejoin="round" />
      <rect x={42} y={4} width={28} height={16} rx={8} fill="#C4473A" />
      <text x={56} y={16} textAnchor="middle" fontFamily={F.sans} fontSize={11} fontWeight={700} fill="#fff">
        {n}+
      </text>
      {[0, 1, 2, 3].map((k) => {
        const y = 12 + k * 28;
        const unread = (Math.floor(t * 1.3) + k) % 3 !== 0;
        return (
          <g key={k}>
            <circle cx={84} cy={y + 8} r={4} fill={unread ? a : '#3A3A38'} />
            {bar(96, y + 2, 60 + rand(5, k) * 50, 6, unread ? '#E8E6DC' : '#87867F')}
            {bar(96, y + 12, 90 + rand(6, k) * 40, 4, '#5E5D59')}
          </g>
        );
      })}
      <rect x={10} y={58} width={52} height={10} rx={3} fill="#30302E" />
      <rect x={10} y={74} width={52} height={10} rx={3} fill="#30302E" />
      <rect x={10} y={90} width={52} height={10} rx={3} fill="#30302E" />
    </>
  );
};

const PIECES = ['#E07A5F', '#86C06C', '#6FB3D2', '#E2B65B', '#9B8AC4'];
const Games: React.FC<{t: number; a: string}> = ({t, a}) => {
  const cell = 11;
  const ox = 14, oy = 6;
  const stack: [number, number, number][] = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) if (rand(31, r * 8 + c) > 0.22 + r * 0.12) stack.push([c, 10 - r, (r * 3 + c) % 5]);
  const step = Math.floor(t / 0.23) % 9;
  const score = 12000 + Math.floor(t * 37) % 1000;
  return (
    <>
      <rect x={ox - 2} y={oy - 2} width={8 * cell + 4} height={11 * cell + 4} rx={4} fill="#141413" stroke="#30302E" />
      {stack.map(([c, r, k], i) => (
        <rect key={i} x={ox + c * cell} y={oy + r * cell} width={cell - 1} height={cell - 1} rx={2} fill={PIECES[k]} />
      ))}
      {[[3, 0], [4, 0], [5, 0], [4, 1]].map(([c, r], i) => (
        <rect key={'f' + i} x={ox + c * cell} y={oy + (r + step) * cell} width={cell - 1} height={cell - 1} rx={2} fill={a} />
      ))}
      <text x={120} y={30} fontFamily={F.mono} fontSize={11} fill="#87867F">
        SCORE
      </text>
      <text x={120} y={50} fontFamily={F.mono} fontSize={18} fontWeight={800} fill="#E8E6DC">
        {score}
      </text>
      {[0, 1, 2].map((k) => (
        <path key={k} transform={`translate(${126 + k * 20} 70)`} d="M0,4 c-3,-5 -10,-2 -7,3 l7,7 l7,-7 c3,-5 -4,-8 -7,-3 z" fill={k < 2 ? '#E07A5F' : '#3A3A38'} />
      ))}
      <g transform="translate(150 104)">
        <rect x={-30} y={-10} width={60} height={20} rx={10} fill="#30302E" />
        <path d="M-20,0 h8 M-16,-4 v8" stroke="#E8E6DC" strokeWidth={2.4} />
        <circle cx={14} cy={-2} r={2.6} fill={a} />
        <circle cx={20} cy={3} r={2.6} fill="#E2B65B" />
      </g>
    </>
  );
};

const News: React.FC<{t: number; a: string}> = ({t, a}) => {
  const tick = (t * 40) % 300;
  return (
    <>
      <text x={10} y={20} fontFamily={F.serif} fontSize={17} fontWeight={600} fill={a}>
        The Daily
      </text>
      {bar(100, 13, 140, 3, '#3A3A38')}
      {bar(10, 30, 130, 8, '#E8E6DC')}
      {bar(10, 43, 110, 8, '#E8E6DC')}
      {bar(10, 58, 120, 4, '#87867F')}
      {bar(10, 66, 126, 4, '#87867F')}
      {bar(10, 74, 96, 4, '#87867F')}
      <rect x={150} y={28} width={90} height={56} rx={5} fill="#33403A" />
      <circle cx={176} cy={50} r={9} fill="#F2C57C" opacity={0.8} />
      <path d="M150,84 L180,62 L200,74 L222,56 L240,70 V84 Z" fill="#26302B" />
      <rect x={0} y={96} width={BW} height={22} fill="#C4473A" opacity={0.85} />
      <rect x={0} y={96} width={52} height={22} fill="#7A231B" />
      <text x={7} y={111} fontFamily={F.sans} fontSize={10} fontWeight={800} fill="#fff">
        LIVE
      </text>
      <g transform={`translate(${60 - tick} 0)`}>
        {[0, 1].map((k) => (
          <g key={k} transform={`translate(${k * 300} 0)`}>
            {bar(0, 104, 80, 5, '#FBE3D8')}
            {bar(96, 104, 120, 5, '#FBE3D8')}
            {bar(232, 104, 50, 5, '#FBE3D8')}
          </g>
        ))}
      </g>
      <rect x={0} y={96} width={52} height={22} fill="#7A231B" />
      <text x={7} y={111} fontFamily={F.sans} fontSize={10} fontWeight={800} fill="#fff">
        LIVE
      </text>
    </>
  );
};

const Music: React.FC<{t: number; a: string}> = ({t, a}) => {
  return (
    <>
      <defs>
        <linearGradient id="mus-art" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor="#6A4FA0" />
        </linearGradient>
      </defs>
      <rect x={10} y={8} width={68} height={68} rx={6} fill="url(#mus-art)" />
      <circle cx={44} cy={42} r={20} fill="none" stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={2} />
      <circle cx={44} cy={42} r={5} fill="#FFFFFF" opacity={0.7} />
      {bar(90, 18, 100, 8, '#E8E6DC')}
      {bar(90, 32, 64, 5, '#87867F')}
      <g transform="translate(90 52)">
        <path d="M0,0 l-8,6 l8,6 z M-8,0 v12" fill="#C2C0B6" stroke="#C2C0B6" strokeWidth={1.5} transform="translate(8 0)" />
        <circle cx={32} cy={6} r={10} fill={a} />
        <rect x={28.5} y={1.5} width={2.6} height={9} fill="#141413" />
        <rect x={33} y={1.5} width={2.6} height={9} fill="#141413" />
        <path d="M54,0 l8,6 l-8,6 z M62,0 v12" fill="#C2C0B6" stroke="#C2C0B6" strokeWidth={1.5} />
      </g>
      {Array.from({length: 38}, (_, k) => {
        const h = 4 + Math.abs(noise1(t * 5 + k * 0.6, 3)) * 24 + Math.abs(Math.sin(k * 0.5)) * 6;
        return <rect key={k} x={10 + k * 6.1} y={112 - h} width={3.6} height={h} rx={1.5} fill={k < 15 ? a : '#5E5D59'} />;
      })}
    </>
  );
};

const Maps: React.FC<{t: number; a: string}> = ({t, a}) => {
  const bob = Math.abs(Math.sin(t * 3.2)) * 5;
  return (
    <>
      <rect x={0} y={0} width={BW} height={BH} fill="#1E2622" />
      <path d="M-5,90 C40,70 70,104 120,86 S200,60 260,74" stroke="#2F5A72" strokeWidth={10} fill="none" />
      <path d="M150,8 h70 v34 h-50 z" fill="#2C4434" />
      {[
        'M0,30 L250,48',
        'M40,0 L70,126',
        'M130,0 L118,126',
        'M0,108 L250,100',
        'M190,0 L210,126',
      ].map((d, k) => (
        <path key={k} d={d} stroke="#3A3A38" strokeWidth={k === 1 ? 8 : 5} fill="none" />
      ))}
      <path d="M58,104 L64,74 L122,62 L126,40 L176,30" stroke={a} strokeWidth={4} fill="none" strokeDasharray="7 5" strokeDashoffset={-t * 20} strokeLinecap="round" />
      <circle cx={58} cy={104} r={5} fill="#FFFFFF" stroke={a} strokeWidth={3} />
      <g transform={`translate(176 ${30 - bob})`}>
        <path d="M0,0 c-9,-10 -9,-22 0,-24 c9,2 9,14 0,24 z" fill="#E07A5F" />
        <circle cx={0} cy={-15} r={3.5} fill="#141413" />
      </g>
      <rect x={10} y={8} width={52} height={18} rx={9} fill="#141413" opacity={0.85} />
      <text x={36} y={21} textAnchor="middle" fontFamily={F.sans} fontSize={11} fontWeight={600} fill="#E8E6DC">
        12 min
      </text>
    </>
  );
};

const SKIES: [string, string][] = [
  ['#3B3550', '#E07A5F'],
  ['#2F5A72', '#6FB3D2'],
  ['#4A3A36', '#F2C57C'],
  ['#2C4434', '#86C06C'],
  ['#3B3550', '#9B8AC4'],
  ['#5A3A44', '#E58FB0'],
  ['#2F5A72', '#CFCBBF'],
  ['#4A3A36', '#E2B65B'],
];
const Photos: React.FC<{t: number; a: string}> = ({t, a}) => {
  const hl = Math.floor(t * 1.2) % 8;
  return (
    <>
      <defs>
        {SKIES.map(([c0, c1], k) => (
          <linearGradient key={k} id={`ph-${k}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={c0} />
            <stop offset="1" stopColor={c1} />
          </linearGradient>
        ))}
      </defs>
      {SKIES.map((_, k) => {
        const x = 8 + (k % 4) * 59;
        const y = 8 + Math.floor(k / 4) * 56;
        return (
          <g key={k}>
            <rect x={x} y={y} width={54} height={52} rx={4} fill={`url(#ph-${k})`} />
            <circle cx={x + 38} cy={y + 14} r={5} fill="#FFF5DA" opacity={0.8} />
            <path d={`M${x},${y + 52} L${x + 18},${y + 28} L${x + 30},${y + 40} L${x + 40},${y + 30} L${x + 54},${y + 46} V${y + 52} Z`} fill="#141413" opacity={0.55} />
            {k === hl ? <rect x={x - 1.5} y={y - 1.5} width={57} height={55} rx={5} fill="none" stroke={a} strokeWidth={2.5} /> : null}
          </g>
        );
      })}
    </>
  );
};

const Docs: React.FC<{t: number; a: string}> = ({t, a}) => {
  const typed = 40 + ((t * 30) % 120);
  const blink = Math.floor(t * 2.2) % 2 === 0;
  return (
    <>
      <rect x={30} y={6} width={190} height={130} rx={4} fill="#262624" />
      {bar(46, 18, 110, 9, a)}
      {[0, 1, 2, 3, 4, 5].map((k) => bar(46, 38 + k * 12, k === 5 ? Math.min(typed, 150) : 120 + rand(9, k) * 38, 5, '#87867F', k))}
      {blink ? <rect x={46 + Math.min(typed, 150) + 3} y={95} width={2} height={11} fill={a} /> : null}
      <rect x={176} y={18} width={30} height={9} rx={2} fill="#30302E" />
    </>
  );
};

const Chat: React.FC<{t: number; a: string}> = ({t, a}) => {
  const dots = [0, 1, 2].map((k) => 0.35 + 0.65 * Math.max(0, Math.sin(t * 7 - k * 0.9)));
  return (
    <>
      <circle cx={18} cy={14} r={8} fill="#E2B65B" />
      {bar(32, 10, 54, 6, '#E8E6DC')}
      <circle cx={92} cy={13} r={3} fill="#86C06C" />
      <rect x={0} y={26} width={BW} height={1} fill="#30302E" />
      <rect x={10} y={34} width={110} height={20} rx={10} fill="#30302E" />
      {bar(20, 41, 80, 6, '#C2C0B6')}
      <rect x={110} y={60} width={130} height={20} rx={10} fill={a} />
      {bar(122, 67, 100, 6, '#E8F1FA')}
      <rect x={10} y={86} width={84} height={20} rx={10} fill="#30302E" />
      {bar(20, 93, 50, 6, '#C2C0B6')}
      <rect x={196} y={98} width={44} height={20} rx={10} fill={a} opacity={0.85} />
      {dots.map((o, k) => (
        <circle key={k} cx={208 + k * 10} cy={108} r={3} fill="#FFFFFF" opacity={o} />
      ))}
    </>
  );
};

const Calendar: React.FC<{t: number; a: string}> = ({t, a}) => {
  const today = 17;
  return (
    <>
      <rect x={0} y={0} width={BW} height={22} fill={a} />
      <text x={10} y={16} fontFamily={F.sans} fontSize={12} fontWeight={700} fill="#141413">
        October
      </text>
      {Array.from({length: 35}, (_, k) => {
        const c = k % 7;
        const r = Math.floor(k / 7);
        const x = 8 + c * 34.5;
        const y = 27 + r * 19.5;
        const day = k - 2;
        const ev = rand(51, k);
        return (
          <g key={k}>
            <rect x={x} y={y} width={32} height={17.5} rx={3} fill="#262624" />
            {day > 0 && day <= 31 ? (
              <text x={x + 4} y={y + 10} fontFamily={F.sans} fontSize={7.5} fill="#87867F">
                {day}
              </text>
            ) : null}
            {day > 0 && day <= 31 && ev > 0.62 ? <rect x={x + 3} y={y + 12} width={20 + ev * 6} height={3.5} rx={1.7} fill={['#6FB3D2', '#86C06C', '#E58FB0', '#E2B65B'][k % 4]} /> : null}
            {day === today ? <rect x={x - 1} y={y - 1} width={34} height={19.5} rx={4} fill="none" stroke={a} strokeWidth={2} opacity={0.6 + 0.4 * Math.sin(t * 4)} /> : null}
          </g>
        );
      })}
    </>
  );
};

const RENDER: Record<AppName, React.FC<{t: number; a: string}>> = {
  Video,
  Feed,
  Shop,
  Mail,
  Games,
  News,
  Music,
  Maps,
  Photos,
  Docs,
  Chat,
  Calendar,
};

/** flat app illustration filling its parent (designed for the 250x126 OSWindow body; scales to any box) */
export const AppWindowContent: React.FC<{name: string; t: number}> = ({name, t}) => {
  const Comp = RENDER[name as AppName];
  if (!Comp) return null;
  return (
    <svg viewBox={`0 0 ${BW} ${BH}`} preserveAspectRatio="xMidYMid slice" style={{position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', overflow: 'hidden', background: '#1c1c1b'}}>
      <Comp t={t} a={APP_ACCENT[name as AppName]} />
    </svg>
  );
};

/** one ring window exactly as in the bridge → EXECUTION handoff (centre = ringSlot(i)) */
export const RingWindow: React.FC<{name: string; i: number; t: number; style?: React.CSSProperties}> = ({name, i, t, style}) => {
  const p = ringSlot(i);
  return (
    <OSWindow x={p.x - RING.w / 2} y={p.y - RING.h / 2} w={RING.w} h={RING.h} title={name} dark style={style}>
      <AppWindowContent name={name} t={t} />
    </OSWindow>
  );
};

export const appAccent = (name: string) => APP_ACCENT[name as AppName] ?? C.gray2;
