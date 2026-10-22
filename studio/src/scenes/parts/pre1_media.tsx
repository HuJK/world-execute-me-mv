import React from 'react';
import {C, F} from '../../theme';
import {rand} from '../../lib/anim';

// ------------------------------------------------------------------------------------------
// Writing media through history (flat vector, palette-consistent), each drawn around (0,0).
// paperback → movable type → illuminated manuscript → scroll → clay tablet (cuneiform) → cave hand stencil
// ------------------------------------------------------------------------------------------

// ---------------------------------------------------------------- open hand silhouette (palm facing the glass)
// local units ≈ source px of cc_reach; origin = palm centre; thumb on the viewer's right
type Cap = [number, number, number, number, number];
export const HAND_FINGERS: Cap[] = [
  [-88, -30, -186, -104, 50], // pinky
  [-48, -70, -108, -212, 56], // ring
  [2, -96, -12, -262, 60], // middle
  [88, -60, 118, -214, 56], // index
  [78, 34, 214, -6, 60], // thumb
];
export const HandShape: React.FC<{fill: string; grow?: number; opacity?: number; filter?: string; wristFill?: string}> = ({fill, grow = 0, opacity = 1, filter, wristFill}) => (
  <g opacity={opacity} style={filter ? {filter} : undefined}>
    <ellipse cx={0} cy={8} rx={118 + grow} ry={112 + grow} fill={fill} />
    <rect x={-78 - grow} y={60} width={156 + 2 * grow} height={170 + grow} rx={60 + grow} fill={wristFill ?? fill} />
    {HAND_FINGERS.map(([x0, y0, x1, y1, w], i) => (
      <line key={i} x1={x0} y1={y0} x2={x1} y2={y1} stroke={fill} strokeWidth={w + 2 * grow} strokeLinecap="round" />
    ))}
  </g>
);

// ---------------------------------------------------------------- 1. paperbacks
const BOOKS: [string, string, string, string, number, number][] = [
  // title, band colour, middle colour, text colour, width, x-offset
  ['A Field Guide to Stars', C.blue, C.cream, C.ink, 600, -10],
  ['Collected Poems', C.clay, C.cream, C.ink, 560, 18],
  ['Letters to a Friend', C.green, C.cream, C.ink, 620, -24],
  ['How to Be Kind', C.ink, C.ink, C.cream, 540, 8],
  ['Notes from Home', C.clay, C.clay, '#fff', 590, -6],
  ['Dear Diary', C.gold, C.cream, C.ink, 520, 26],
  ['On Love', C.clayDark, C.cream, C.ink, 570, -14],
];
export const Paperbacks: React.FC<{t: number}> = ({t}) => {
  const h = 70;
  return (
    <g>
      <ellipse cx={0} cy={300} rx={380} ry={26} fill="rgba(80,50,30,0.16)" />
      {BOOKS.map(([title, band, mid, tc, w, xo], i) => {
        const y = 250 - i * (h + 2);
        const rot = (rand(71, i) - 0.5) * 2.4;
        return (
          <g key={i} transform={`translate(${xo} ${y}) rotate(${rot})`}>
            <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill={band} />
            <rect x={-w / 2 + 70} y={-h / 2} width={w - 140} height={h} fill={mid} />
            <rect x={-w / 2} y={-h / 2} width={w} height={6} rx={3} fill="rgba(255,255,255,0.18)" />
            <rect x={-w / 2} y={h / 2 - 7} width={w} height={7} rx={3} fill="rgba(0,0,0,0.12)" />
            <text x={0} y={9} textAnchor="middle" fontFamily={F.serif} fontWeight={600} fontSize={27} fill={tc}>
              {title}
            </text>
            <circle cx={w / 2 - 35} cy={0} r={14} fill={band === C.ink || mid === band ? C.cream : '#fff'} opacity={0.92} />
            {Array.from({length: 6}, (_, k) => (
              <ellipse key={k} cx={w / 2 - 35} cy={-5.5} rx={2.6} ry={5.5} fill={band === C.ink ? C.clay : band} transform={`rotate(${k * 60} ${w / 2 - 35} 0)`} />
            ))}
          </g>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------- 2. movable type (mirrored sorts in a tray)
const TYPE_ROWS = ['WORLD', '.EXECUTE', '(ME);'];
export const MovableType: React.FC<{t: number}> = ({t}) => {
  const sw = 60, sh = 86, gap = 6;
  const trayW = 8 * (sw + gap) + 80, trayH = 3 * (sh + 18) + 70;
  return (
    <g>
      {/* tray */}
      <rect x={-trayW / 2 - 18} y={-trayH / 2 - 18 - 40} width={trayW + 36} height={trayH + 36} rx={14} fill="#6B4A33" />
      <rect x={-trayW / 2} y={-trayH / 2 - 40} width={trayW} height={trayH} rx={8} fill="#2A2420" />
      {TYPE_ROWS.map((row, r) => {
        const chars = [...row].reverse(); // composed mirrored, right-to-left
        const n = 8;
        return Array.from({length: n}, (_, i) => {
          const ch = i < chars.length ? chars[i] : null;
          const x = -trayW / 2 + 40 + i * (sw + gap);
          const y = -trayH / 2 - 40 + 30 + r * (sh + 18);
          const lift = ch ? 0 : 6;
          return (
            <g key={r + '-' + i} transform={`translate(${x} ${y + lift})`}>
              <rect x={0} y={0} width={sw} height={sh} rx={6} fill={ch ? '#9A968E' : '#5E5A54'} />
              <rect x={0} y={0} width={sw} height={10} rx={5} fill="rgba(255,255,255,0.28)" />
              <rect x={sw - 8} y={4} width={6} height={sh - 8} rx={3} fill="rgba(0,0,0,0.18)" />
              {ch ? (
                <text
                  x={sw / 2}
                  y={sh / 2 + 19}
                  textAnchor="middle"
                  fontFamily={F.serif}
                  fontWeight={600}
                  fontSize={56}
                  fill="#1E1B19"
                  transform={`translate(${sw} 0) scale(-1 1)`}
                >
                  {ch}
                </text>
              ) : null}
            </g>
          );
        });
      })}
      {/* the proof: what the sorts print */}
      <g transform={`translate(0 ${trayH / 2 + 50}) rotate(-1.5)`}>
        <rect x={-300} y={-36} width={600} height={72} rx={4} fill="#F4EAD8" />
        <text x={0} y={14} textAnchor="middle" fontFamily={F.serif} fontWeight={600} fontSize={40} letterSpacing="0.06em" fill="#1E1B19">
          WORLD.EXECUTE(ME);
        </text>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- 3. illuminated manuscript page
const scribble = (x0: number, y: number, w: number, seed: number) => {
  // gothic minim texture: groups of short vertical strokes
  let d = '';
  let x = x0;
  let i = 0;
  while (x < x0 + w) {
    const word = 2 + Math.floor(rand(seed, i) * 6);
    for (let k = 0; k < word && x < x0 + w; k++) {
      const tall = rand(seed + 1, i * 7 + k) > 0.82 ? 9 : 0;
      d += `M${x.toFixed(1)} ${y - 16 - tall} l1.5 18 `;
      x += 7;
    }
    x += 12;
    i++;
  }
  return d;
};
export const Manuscript: React.FC<{t: number}> = ({t}) => {
  const w = 600, h = 720;
  const lines: React.ReactNode[] = [];
  for (let i = 0; i < 15; i++) {
    const y = -h / 2 + 110 + i * 38;
    const x0 = i < 5 ? -w / 2 + 250 : -w / 2 + 70;
    const ww = (i < 5 ? w - 320 : w - 140) - (i === 14 ? 200 : 0);
    lines.push(<path key={i} d={scribble(x0, y, ww, 80 + i)} stroke={i === 0 ? C.clayDark : '#2B211B'} strokeWidth={4.2} strokeLinecap="round" fill="none" />);
  }
  // vine border
  const vine: React.ReactNode[] = [];
  for (let i = 0; i < 18; i++) {
    const y = -h / 2 + 40 + i * 37;
    vine.push(<path key={'v' + i} d={`M${-w / 2 + 34} ${y} q14 18 0 37`} stroke={C.gold} strokeWidth={3} fill="none" />);
    vine.push(<ellipse key={'l' + i} cx={-w / 2 + 34 + (i % 2 ? 12 : -12)} cy={y + 18} rx={8} ry={4} fill={i % 3 ? C.green : C.clay} transform={`rotate(${i % 2 ? 30 : -30} ${-w / 2 + 34 + (i % 2 ? 12 : -12)} ${y + 18})`} />);
  }
  return (
    <g>
      <rect x={-w / 2 + 14} y={-h / 2 + 18} width={w} height={h} rx={10} fill="rgba(40,15,8,0.35)" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill="#F2E4C6" />
      <rect x={-w / 2 + 10} y={-h / 2 + 10} width={w - 20} height={h - 20} rx={6} fill="none" stroke="#E2CFA4" strokeWidth={3} />
      {vine}
      {/* illuminated initial: a gold square holding the flower */}
      <g transform={`translate(${-w / 2 + 150} ${-h / 2 + 168})`}>
        <rect x={-82} y={-82} width={164} height={164} rx={10} fill={C.gold} />
        <rect x={-70} y={-70} width={140} height={140} rx={6} fill={C.blue} />
        {Array.from({length: 12}, (_, i) => (
          <ellipse key={i} cx={0} cy={-36} rx={13} ry={34} fill={C.clay} transform={`rotate(${i * 30 + t * 20})`} />
        ))}
        <circle r={20} fill={C.cream} />
        <text x={0} y={30} textAnchor="middle" fontFamily={F.serif} fontWeight={600} fontSize={110} fill={C.ink} opacity={0.0}>
          I
        </text>
      </g>
      {lines}
      <circle cx={w / 2 - 70} cy={h / 2 - 60} r={14} fill={C.clayDark} />
    </g>
  );
};

// ---------------------------------------------------------------- 4. papyrus scroll
export const Scroll: React.FC<{t: number; open?: number}> = ({t, open = 1}) => {
  const W0 = 860, h = 430;
  const w = 220 + (W0 - 220) * open;
  const cols: React.ReactNode[] = [];
  for (let c = 0; c < 3; c++) {
    for (let r = 0; r < 9; r++) {
      const x0 = -W0 / 2 + 90 + c * 250;
      const y = -h / 2 + 70 + r * 34;
      let d = '';
      let x = x0;
      let k = 0;
      while (x < x0 + 200) {
        const len = 8 + rand(90 + c, r * 13 + k) * 26;
        if (x + len > x0 + 200) break;
        d += `M${x.toFixed(1)} ${y} h${len.toFixed(1)} `;
        x += len + 9;
        k++;
      }
      cols.push(<path key={c + '-' + r} d={d} stroke="#5B3A22" strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.85} />);
    }
  }
  const fibers: React.ReactNode[] = [];
  for (let i = 0; i < 26; i++) {
    const y = -h / 2 + 10 + i * 16;
    fibers.push(<line key={i} x1={-W0 / 2} y1={y} x2={W0 / 2} y2={y + (rand(95, i) - 0.5) * 4} stroke="#C9AE7C" strokeWidth={1.4} opacity={0.6} />);
  }
  const roll = (x: number) => (
    <g transform={`translate(${x} 0)`}>
      <rect x={-12} y={-h / 2 - 50} width={24} height={h + 100} rx={12} fill="#6B4A33" />
      <rect x={-34} y={-h / 2 - 8} width={68} height={h + 16} rx={34} fill="#D9BE8A" />
      <rect x={-34} y={-h / 2 - 8} width={22} height={h + 16} rx={11} fill="#E9D3A6" />
      <rect x={14} y={-h / 2 - 8} width={20} height={h + 16} rx={10} fill="#B9995F" />
      <circle cx={0} cy={-h / 2 - 54} r={16} fill="#8A5E3C" />
      <circle cx={0} cy={h / 2 + 54} r={16} fill="#8A5E3C" />
    </g>
  );
  return (
    <g>
      <rect x={-w / 2 + 12} y={-h / 2 + 22} width={w} height={h} fill="rgba(40,20,10,0.25)" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#EAD5A8" />
      <defs>
        <clipPath id="p1scrollclip">
          <rect x={-w / 2} y={-h / 2} width={w} height={h} />
        </clipPath>
      </defs>
      <g clipPath="url(#p1scrollclip)">
        {fibers}
        {cols}
      </g>
      {roll(-w / 2 - 20)}
      {roll(w / 2 + 20)}
    </g>
  );
};

// ---------------------------------------------------------------- 5. clay tablet with cuneiform
const wedge = (x: number, y: number, dir: number, s: number, key: string) => {
  // triangular head + tail, rotated by dir (deg)
  return (
    <g key={key} transform={`translate(${x} ${y}) rotate(${dir}) scale(${s})`}>
      <path d="M0 -9 L13 0 L0 9 Z" fill="#6E351C" />
      <path d="M0 -9 L13 0" stroke="#D99566" strokeWidth={2} />
      <line x1={10} y1={0} x2={34} y2={0} stroke="#6E351C" strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};
export const Tablet: React.FC<{t: number}> = ({t}) => {
  const w = 540, h = 660;
  const signs: React.ReactNode[] = [];
  for (let r = 0; r < 9; r++) {
    const y = -h / 2 + 80 + r * 64;
    let x = -w / 2 + 50;
    let k = 0;
    while (x < w / 2 - 70) {
      const n = 1 + Math.floor(rand(110 + r, k) * 4);
      for (let j = 0; j < n; j++) {
        const kind = rand(120 + r, k * 9 + j);
        const dir = kind < 0.55 ? 0 : kind < 0.8 ? 90 : 45;
        signs.push(wedge(x + j * 15, y + (dir === 90 ? -14 : (j % 2) * 10 - 5), dir, 0.9 + rand(130, k + j) * 0.25, `${r}-${k}-${j}`));
      }
      x += n * 15 + 36;
      k++;
    }
  }
  const rules: React.ReactNode[] = [];
  for (let r = 1; r < 9; r++) {
    const y = -h / 2 + 80 + r * 64 - 30;
    rules.push(<line key={r} x1={-w / 2 + 30} y1={y} x2={w / 2 - 30} y2={y} stroke="#7E3F22" strokeWidth={2.2} opacity={0.7} />);
  }
  return (
    <g>
      <rect x={-w / 2 + 16} y={-h / 2 + 24} width={w} height={h} rx={70} fill="rgba(60,30,15,0.3)" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={70} fill="#B56A40" />
      <rect x={-w / 2 + 14} y={-h / 2 + 12} width={w - 28} height={h - 24} rx={60} fill="#C47B4E" />
      <path d={`M${-w / 2 + 60} ${-h / 2 + 22} Q0 ${-h / 2 + 6} ${w / 2 - 60} ${-h / 2 + 22}`} stroke="#DE9F72" strokeWidth={6} fill="none" strokeLinecap="round" />
      {rules}
      {signs}
    </g>
  );
};

// ---------------------------------------------------------------- 6. cave wall with a hand stencil
export const SPRAY = Array.from({length: 420}, (_, i) => {
  const a = rand(140, i) * Math.PI * 2;
  const r = 150 + Math.pow(rand(141, i), 0.7) * 230;
  return [Math.cos(a) * r * 1.05, Math.sin(a) * r * 1.15 - 30, 2 + rand(142, i) * 5, 0.25 + rand(143, i) * 0.6] as [number, number, number, number];
});
const SPRAY_PATHS = [0, 1, 2].map((b) =>
  SPRAY.filter((_, i) => i % 3 === b)
    .map(([x, y, r]) => `M${(x - r).toFixed(1)} ${y.toFixed(1)}a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(2 * r).toFixed(1)} 0a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(-2 * r).toFixed(1)} 0`)
    .join(''),
);
export const CaveWall: React.FC<{t: number; w: number; h: number; handX: number; handY: number; handScale: number; stencil?: number}> = ({t, w, h, handX, handY, handScale, stencil = 1}) => {
  const blot: React.ReactNode[] = [];
  for (let i = 0; i < 16; i++) {
    blot.push(
      <ellipse
        key={i}
        cx={rand(150, i) * w}
        cy={rand(151, i) * h}
        rx={120 + rand(152, i) * 260}
        ry={80 + rand(153, i) * 160}
        fill={i % 3 === 0 ? '#6A4D3B' : i % 3 === 1 ? '#3B2A21' : '#57402F'}
        opacity={0.35}
        transform={`rotate(${rand(154, i) * 60 - 30} ${rand(150, i) * w} ${rand(151, i) * h})`}
      />,
    );
  }
  const marks: React.ReactNode[] = [];
  for (let i = 0; i < 14; i++) {
    const x = 1150 + rand(160, i) * 600, y = 160 + rand(161, i) * 700;
    marks.push(<circle key={i} cx={x} cy={y} r={7 + rand(162, i) * 6} fill="#B5583A" opacity={0.55} />);
  }
  return (
    <g>
      <defs>
        <radialGradient id="p1rock" cx="40%" cy="45%" r="75%">
          <stop offset="0%" stopColor="#6E5040" />
          <stop offset="60%" stopColor="#4A3427" />
          <stop offset="100%" stopColor="#2A1D16" />
        </radialGradient>
        <filter id="p1spray" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
        <filter id="p1spray2" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <rect x={0} y={0} width={w} height={h} fill="url(#p1rock)" />
      {blot}
      {marks}
      {/* a little ochre deer, painted long ago */}
      <g transform="translate(1450 760) scale(1.1)" stroke="#B5583A" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={0.75}>
        <path d="M-70 0 Q-10 -26 60 -4 Q78 -2 84 -24 L96 -46 M84 -24 L106 -20 M60 -4 L66 44 M-50 0 L-58 46 M-20 -8 L-14 44 M40 -6 L34 44 M-70 0 L-86 -14" />
        <path d="M96 -46 l-10 -22 M96 -46 l14 -18" />
      </g>
      {stencil > 0 ? (
        <g transform={`translate(${handX} ${handY}) scale(${handScale})`} opacity={stencil}>
          <HandShape fill="#C0603A" grow={70} opacity={0.75} filter="url(#p1spray)" />
          <HandShape fill="#C9673F" grow={26} opacity={0.85} filter="url(#p1spray2)" />
          {SPRAY_PATHS.map((d, i) => (
            <path key={i} d={d} fill="#C0603A" opacity={0.3 + i * 0.25} />
          ))}
          <HandShape fill="#7A5A46" />
        </g>
      ) : null}
    </g>
  );
};
