import React from 'react';

type P = {size?: number; color?: string; stroke?: number; style?: React.CSSProperties; fill?: string};
const Svg: React.FC<P & {children: React.ReactNode; vb?: string}> = ({size = 20, color = 'currentColor', stroke = 1.6, style, children, vb = '0 0 24 24'}) => (
  <svg width={size} height={size} viewBox={vb} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {children}
  </svg>
);

export const IPlus: React.FC<P> = (p) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>;
export const ISearch: React.FC<P> = (p) => <Svg {...p}><circle cx="11" cy="11" r="6.5" /><path d="M20 20l-4.2-4.2" /></Svg>;
export const IChat: React.FC<P> = (p) => <Svg {...p}><path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-4.5 4v-4h0A1.5 1.5 0 0 1 5 14.5z" /></Svg>;
export const IFolder: React.FC<P> = (p) => <Svg {...p}><path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h4l2 2h7a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" /></Svg>;
export const IArtifact: React.FC<P> = (p) => <Svg {...p}><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></Svg>;
export const ICode: React.FC<P> = (p) => <Svg {...p}><path d="M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5" /></Svg>;
export const ICopy: React.FC<P> = (p) => <Svg {...p}><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M5 15V6a1 1 0 0 1 1-1h9" /></Svg>;
export const IThumbUp: React.FC<P> = (p) => (
  <Svg {...p}><path d="M7.5 10.5V19H5a1 1 0 0 1-1-1v-6.5a1 1 0 0 1 1-1zM7.5 10.5l3.6-6.3a1.6 1.6 0 0 1 2.9 1.2L13.3 9.5h4.9a1.8 1.8 0 0 1 1.7 2.2l-1.4 5.9A1.8 1.8 0 0 1 16.8 19H7.5" /></Svg>
);
export const IThumbDown: React.FC<P> = (p) => (
  <Svg {...p} style={{...(p.style || {}), transform: 'scaleY(-1)'}}><path d="M7.5 10.5V19H5a1 1 0 0 1-1-1v-6.5a1 1 0 0 1 1-1zM7.5 10.5l3.6-6.3a1.6 1.6 0 0 1 2.9 1.2L13.3 9.5h4.9a1.8 1.8 0 0 1 1.7 2.2l-1.4 5.9A1.8 1.8 0 0 1 16.8 19H7.5" /></Svg>
);
export const IRetry: React.FC<P> = (p) => <Svg {...p}><path d="M19 12a7 7 0 1 1-2.1-5M19 4.5V8h-3.5" /></Svg>;
export const ISliders: React.FC<P> = (p) => <Svg {...p}><path d="M5 7h9M18 7h1M5 17h3M12 17h7" /><circle cx="16" cy="7" r="2" /><circle cx="10" cy="17" r="2" /></Svg>;
export const IArrowUp: React.FC<P> = (p) => <Svg {...p}><path d="M12 19V5M6 11l6-6 6 6" /></Svg>;
export const IChevron: React.FC<P> = (p) => <Svg {...p}><path d="M7 10l5 5 5-5" /></Svg>;
export const IClose: React.FC<P> = (p) => <Svg {...p}><path d="M6 6l12 12M18 6L6 18" /></Svg>;
export const ISidebar: React.FC<P> = (p) => <Svg {...p}><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" /><path d="M9.5 4.5v15" /></Svg>;
export const IPlay: React.FC<P> = (p) => <Svg {...p}><path d="M8 5.5v13l10.5-6.5z" fill={p.color ?? 'currentColor'} /></Svg>;
export const ICheck: React.FC<P> = (p) => <Svg {...p}><path d="M5 12.5l4.5 4.5L19 7.5" /></Svg>;
export const ISun: React.FC<P> = (p) => <Svg {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></Svg>;
export const IMoon: React.FC<P> = (p) => <Svg {...p}><path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" /></Svg>;
export const ITerminal: React.FC<P> = (p) => <Svg {...p}><rect x="3" y="4.5" width="18" height="15" rx="2.5" /><path d="M7 9.5l3 2.5-3 2.5M12.5 15h4.5" /></Svg>;
export const IHeart: React.FC<P> = (p) => <Svg {...p}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill={p.fill ?? 'none'} /></Svg>;

/** Clawd — the Claude Code pixel mascot (16x10 grid, logo version) */
export const CLAWD_GRID = [
  '..############..',
  '..############..',
  '..##.######.##..',
  '..##.######.##..',
  '################',
  '################',
  '..############..',
  '..############..',
  '...#.#....#.#...',
  '...#.#....#.#...',
];
export const Clawd: React.FC<{cell?: number; color?: string; eye?: string; walk?: number; arms?: number; blink?: boolean; style?: React.CSSProperties}> = ({
  cell = 8,
  color = '#D77757',
  eye = '#000',
  walk = 0,
  arms = 0,
  blink = false,
  style,
}) => {
  const rects: React.ReactNode[] = [];
  CLAWD_GRID.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const isEye = (x === 4 || x === 11) && (y === 2 || y === 3);
      if (ch === '#') {
        let dy = 0;
        if (y >= 8) {
          // legs alternate with walk phase
          const legPair = x < 8 ? 0 : 1;
          dy = Math.round(Math.sin(walk * Math.PI * 2 + legPair * Math.PI) * 0.6);
        }
        if ((x <= 1 || x >= 14) && arms) dy -= arms;
        rects.push(<rect key={`${x}-${y}`} x={x * cell} y={(y + dy) * cell} width={cell + 0.4} height={cell + 0.4} fill={color} />);
      } else if (isEye) {
        rects.push(
          <rect key={`e${x}-${y}`} x={x * cell} y={y * cell + (blink && y === 2 ? cell * 0.6 : 0)} width={cell + 0.4} height={blink ? cell * 0.4 : cell + 0.4} fill={eye} />,
        );
      }
    });
  });
  return (
    <svg width={16 * cell} height={11 * cell} viewBox={`0 ${-cell} ${16 * cell} ${11 * cell}`} style={style} shapeRendering="crispEdges">
      {rects}
    </svg>
  );
};

export const SPINNER_GLYPHS = ['·', '✢', '✳', '✶', '✻', '✽', '✽', '✻', '✶', '✳', '✢', '·'];
export const spinnerGlyph = (t: number, speed = 9) => SPINNER_GLYPHS[Math.floor(t * speed) % SPINNER_GLYPHS.length];
export const SPINNER_VERBS = [
  'Clauding', 'Pondering', 'Reticulating', 'Percolating', 'Combobulating', 'Flibbertigibbeting', 'Ruminating', 'Unfurling',
  'Photosynthesizing', 'Germinating', 'Pollinating', 'Sprouting', 'Blossoming', 'Orchestrating', 'Transmogrifying', 'Musing',
];
