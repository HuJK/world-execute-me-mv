import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, H, W} from '../../theme';
import {clamp, lerp, rand} from '../../lib/anim';
import {ClaudeApp, Msg} from '../../components/ClaudeApp';
import {Flower} from '../../components/Flower';
import {Cursor} from '../../components/FX';

// ------------------------------------------------------------------------------------------------
// Droste recursion for "Though we are trapped / In this strange strange SIMULATION".
// canvas 0 = the chat (app), odd canvases = a night room whose monitor shows the previous canvas
// in an OS window, even canvases (>=2) = the app whose artifact "simulation.html" shows the room.
// ------------------------------------------------------------------------------------------------

type R = {x: number; y: number; w: number};
// where canvas k-1 sits inside canvas k (canvas coords, 1920x1080 each)
export const APP_IN_ROOM: R = {x: 600, y: 214, w: 720}; // inside the monitor's OS window
export const ROOM_IN_APP: R = {x: 640, y: 318, w: 960}; // inside the artifact card
const SCR = {x: 560, y: 170, w: 800, h: 450}; // monitor screen in the room

export const innerRect = (k: number): R => (k % 2 === 1 ? APP_IN_ROOM : ROOM_IN_APP);

type Placed = {x: number; y: number; s: number};

/** rects of canvases [0..root] in root coordinates */
export const nestRects = (root: number) => {
  const out: Placed[] = [];
  out[root] = {x: 0, y: 0, s: 1};
  for (let k = root; k >= 1; k--) {
    const R = innerRect(k);
    const p = out[k];
    out[k - 1] = {x: p.x + R.x * p.s, y: p.y + R.y * p.s, s: (p.s * R.w) / W};
  }
  return out;
};

/** camera for depth d: returns root index, rects, and camera (cx, cy, sc) in root coords */
export const droste = (d: number, N: number) => {
  const k = Math.min(Math.floor(d), N - 1);
  const f = clamp(d - k);
  const root = Math.min(N, k + 1);
  const rects = nestRects(root);
  const a = rects[k], b = rects[k + 1];
  const sc = Math.pow(a.s, 1 - f) * Math.pow(b.s, f);
  const g = (sc - a.s) / (b.s - a.s);
  const cx = lerp(a.x, b.x, g), cy = lerp(a.y, b.y, g);
  return {k, root, rects, sc, cx, cy};
};

// ------------------------------------------------------------------ the room (vector, night)
const Room: React.FC<{t: number; children?: React.ReactNode; seed: number}> = ({t, children, seed}) => {
  const books = Array.from({length: 26}, (_, i) => i);
  const bookCols = ['#3B4A6B', '#6B4A3B', '#4F5D3F', '#7A5A3A', '#2F3B57', '#5C4B6E', '#8E5A3E', '#3E5560'];
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, overflow: 'hidden', background: 'linear-gradient(#1A2236, #141A2A 70%)'}}>
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <radialGradient id={`glow${seed}`} cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#F6D2C0" stopOpacity={0.32} />
            <stop offset="100%" stopColor="#F6D2C0" stopOpacity={0} />
          </radialGradient>
          <linearGradient id={`sky${seed}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B2547" />
            <stop offset="100%" stopColor="#3A3F6B" />
          </linearGradient>
        </defs>
        {/* window with city */}
        <rect x={1460} y={80} width={380} height={500} rx={6} fill={`url(#sky${seed})`} stroke="#2B3552" strokeWidth={16} />
        {Array.from({length: 14}, (_, i) => (
          <circle key={i} cx={1480 + rand(seed + 3, i) * 340} cy={100 + rand(seed + 4, i) * 220} r={1.6 + rand(seed + 5, i) * 1.6} fill="#F3E9DC" opacity={0.5 + 0.5 * Math.sin(t * 3 + i)} />
        ))}
        {[
          [1470, 380, 70, 200],
          [1545, 300, 60, 280],
          [1610, 420, 90, 160],
          [1705, 330, 55, 250],
          [1765, 400, 70, 180],
        ].map(([x, y, w, h], i) => (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} fill="#141A30" />
            {Array.from({length: 8}, (_, j) => (
              <rect key={j} x={x + 10 + (j % 3) * 18} y={y + 16 + Math.floor(j / 3) * 34} width={9} height={14} fill={rand(seed + i, j) > 0.45 ? '#F0A27F' : '#2A3150'} />
            ))}
          </g>
        ))}
        <line x1={1650} y1={80} x2={1650} y2={580} stroke="#2B3552" strokeWidth={12} />
        {/* bookshelf */}
        <rect x={70} y={110} width={360} height={680} fill="#1F273C" />
        {[0, 1, 2, 3].map((s) => (
          <rect key={s} x={70} y={260 + s * 160} width={360} height={14} fill="#2A3350" />
        ))}
        {books.map((i) => {
          const shelf = Math.floor(i / 7);
          const xi = i % 7;
          const bh = 90 + rand(seed + 7, i) * 45;
          return <rect key={i} x={92 + xi * 46} y={260 + shelf * 160 - bh + (shelf === 0 ? -0 : 0) - 0} width={36} height={bh} rx={3} fill={bookCols[i % bookCols.length]} opacity={0.9} transform={`translate(0 ${shelf === 3 ? 0 : 0})`} />;
        })}
        {/* monitor glow */}
        <ellipse cx={960} cy={420} rx={760} ry={520} fill={`url(#glow${seed})`} />
        {/* desk */}
        <rect x={0} y={790} width={W} height={300} fill="#2A201B" />
        <rect x={0} y={780} width={W} height={20} fill="#3A2C25" />
        <ellipse cx={960} cy={800} rx={620} ry={60} fill="#F6D2C0" opacity={0.14} />
        {/* monitor */}
        <rect x={980 - 60} y={640} width={80} height={130} fill="#0E0E10" />
        <rect x={840} y={765} width={240} height={22} rx={10} fill="#0E0E10" />
        <rect x={SCR.x - 22} y={SCR.y - 22} width={SCR.w + 44} height={SCR.h + 44} rx={18} fill="#0B0B0D" />
        {/* keyboard */}
        <path d="M720,860 L1200,860 L1230,905 L690,905 Z" fill="#1B1B1E" />
        {Array.from({length: 3}, (_, r) => (
          <line key={r} x1={712 - r * 6} y1={872 + r * 11} x2={1208 + r * 6} y2={872 + r * 11} stroke="#2E2E33" strokeWidth={5} strokeDasharray="22 6" />
        ))}
        {/* mug with a flower */}
        <rect x={1440} y={700} width={90} height={100} rx={12} fill="#E8E6DC" />
        <path d="M1530,722 C1565,722 1565,778 1530,778" fill="none" stroke="#E8E6DC" strokeWidth={12} />
        <line x1={1485} y1={700} x2={1478} y2={640} stroke={C.green} strokeWidth={5} />
        {/* plant */}
        <path d="M250,780 L330,780 L320,700 L260,700 Z" fill="#6B4A3B" />
        {[...Array(6)].map((_, i) => (
          <ellipse key={i} cx={290 + Math.cos(i * 1.1) * 40} cy={660 - Math.abs(Math.sin(i * 1.3)) * 50} rx={30} ry={13} fill="#4F6B3F" transform={`rotate(${i * 30 - 70} ${290 + Math.cos(i * 1.1) * 40} ${660 - Math.abs(Math.sin(i * 1.3)) * 50})`} />
        ))}
      </svg>
      <Flower x={1478} y={630} size={26} spin={t * 30} shade={null} />
      {/* screen: desktop + OS window with the inner canvas */}
      <div style={{position: 'absolute', left: SCR.x, top: SCR.y, width: SCR.w, height: SCR.h, overflow: 'hidden', background: 'linear-gradient(135deg, #E9B79C, #D97757 55%, #8E3F27)'}}>
        <div style={{position: 'absolute', left: 0, top: 0, right: 0, height: 18, background: 'rgba(250,249,245,0.55)'}} />
        <div
          style={{
            position: 'absolute',
            left: APP_IN_ROOM.x - SCR.x,
            top: APP_IN_ROOM.y - SCR.y - 26,
            width: APP_IN_ROOM.w,
            height: (APP_IN_ROOM.w * 9) / 16 + 26,
            borderRadius: 9,
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
            background: '#F0EEE6',
          }}
        >
          <div style={{height: 26, display: 'flex', alignItems: 'center', gap: 6, padding: '0 10px'}}>
            {['#E7675B', '#E9B44C', '#6DBF67'].map((c) => (
              <div key={c} style={{width: 10, height: 10, borderRadius: 5, background: c}} />
            ))}
          </div>
        </div>
      </div>
      {/* inner canvas */}
      {children}
      {/* screen glare */}
      <div style={{position: 'absolute', left: SCR.x, top: SCR.y, width: SCR.w, height: SCR.h, background: 'linear-gradient(115deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 35%)', pointerEvents: 'none'}} />
    </div>
  );
};

// ------------------------------------------------------------------ app canvas
export const CHAT_MSGS = (t: number): Msg[] => [
  {kind: 'user', text: 'haha thank you!! :)'},
  {kind: 'tool', label: 'Ran make_you_happy.py', doneAt: 0},
  {
    kind: 'claude',
    words: [
      {w: 'Though', s: 70.1},
      {w: 'we', s: 70.6},
      {w: 'are', s: 71.05},
      {w: 'trapped—', s: 71.23},
      {w: 'in', s: 71.76},
      {w: 'this', s: 71.99},
      {w: 'strange,', s: 72.29},
      {w: 'strange', s: 72.65},
    ],
    size: 1.25,
    done: 73.2,
  },
];

const OuterApp: React.FC<{t: number; children?: React.ReactNode}> = ({t, children}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, overflow: 'hidden'}}>
    <ClaudeApp
      t={t}
      zoom={1.5}
      title="simulation"
      messages={[
        {kind: 'user', text: 'can you simulate my room?'},
        {kind: 'claude', text: 'Sure! Here’s your room, your desk, and… me.', at: 0, dur: 0.1, done: 0},
      ]}
      scrollY={570}
      composer={{placeholder: 'Reply to Claude…'}}
    >
      {/* artifact card around the inner room (main-pane coords: canvas x - 396) */}
      <div
        style={{
          position: 'absolute',
          left: ROOM_IN_APP.x - 396 - 14,
          top: ROOM_IN_APP.y - 62,
          width: ROOM_IN_APP.w + 28,
          height: (ROOM_IN_APP.w * 9) / 16 + 62 + 14,
          background: '#FFFFFF',
          borderRadius: 18,
          border: '1.5px solid rgba(31,30,29,0.16)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        }}
      >
        <div style={{height: 48, display: 'flex', alignItems: 'center', gap: 12, padding: '0 18px', fontFamily: F.mono, fontSize: 20, color: C.ink}}>
          <div style={{width: 22, height: 22, borderRadius: 6, background: C.clay}} />
          simulation.html
          <div style={{flex: 1}} />
          <div style={{fontFamily: F.sans, fontSize: 18, color: C.gray4, border: '1.5px solid rgba(31,30,29,0.16)', borderRadius: 8, padding: '3px 12px'}}>Preview</div>
        </div>
      </div>
    </ClaudeApp>
    {children}
  </div>
);

const ChatApp: React.FC<{t: number}> = ({t}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, overflow: 'hidden'}}>
    <ClaudeApp t={t} zoom={1.5} messages={CHAT_MSGS(t)} composer={{placeholder: 'Reply to Claude…'}}>
      <Cursor x={1080 + Math.sin(t * 1.3) * 30} y={820} size={34} />
    </ClaudeApp>
  </div>
);

// ------------------------------------------------------------------ nested renderer
const Nest: React.FC<{k: number; minK: number; t: number}> = ({k, minK, t}) => {
  let inner: React.ReactNode = null;
  if (k >= 1) {
    const R = innerRect(k);
    inner = (
      <div style={{position: 'absolute', left: R.x, top: R.y, width: W, height: H, transform: `scale(${R.w / W})`, transformOrigin: '0 0', overflow: 'hidden'}}>
        {k - 1 >= minK ? <Nest k={k - 1} minK={minK} t={t} /> : <div style={{width: W, height: H, background: k % 2 === 1 ? '#F5F4EE' : '#1A2236'}} />}
      </div>
    );
  }
  if (k === 0) return <ChatApp t={t} />;
  if (k % 2 === 1) return <Room t={t} seed={k}>{inner}</Room>;
  return <OuterApp t={t}>{inner}</OuterApp>;
};

export const DrosteView: React.FC<{t: number; d: number; N: number; opacity?: number}> = ({t, d, N, opacity = 1}) => {
  const {root, rects, sc, cx, cy} = droste(d, N);
  // skip canvases smaller than ~3px on screen
  let minK = 0;
  for (let j = 0; j <= root; j++) {
    if ((W * rects[j].s) / sc >= 3) {
      minK = j;
      break;
    }
  }
  return (
    <AbsoluteFill style={{opacity, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transformOrigin: '0 0', transform: `scale(${1 / sc}) translate(${-cx}px, ${-cy}px)`}}>
        <Nest k={root} minK={minK} t={t} />
      </div>
    </AbsoluteFill>
  );
};

/** screen-space rects of all canvases for a depth (for the wireframe collapse) */
export const drosteScreenRects = (d: number, N: number) => {
  const {root, rects, sc, cx, cy} = droste(d, N);
  return rects.slice(0, root + 1).map((r) => ({x: (r.x - cx) / sc, y: (r.y - cy) / sc, w: (W * r.s) / sc, h: (H * r.s) / sc}));
};

// ------------------------------------------------------------------ wireframe tunnel (SIMULATION)
export const WireTunnel: React.FC<{t: number; t0: number; vx: number; vy: number; k: number; color?: string}> = ({t, t0, vx, vy, k, color = C.clayLight}) => {
  // nested rect rings receding toward the vanishing point + longitudinal grid lines
  const q = 0.44; // per-ring scale
  const speed = 2.2; // rings per second
  const phase = (t - t0) * speed;
  const rings: React.ReactNode[] = [];
  const nR = 9;
  for (let i = -1; i < nR; i++) {
    const z = i + (phase % 1);
    const s = Math.pow(q, z) * 1.6;
    const w = W * s, h = H * s;
    const x = vx - w / 2, y = vy - h / 2;
    const op = clamp(1 - z / nR) * clamp(s * 6);
    const sw = Math.max(0.6, 3 * Math.min(1, s * 1.4));
    // each ring is a wireframe of the app: sidebar, header, bubbles, composer
    const cx = x + 0.603 * w;
    rings.push(
      <g key={i} opacity={op * k} stroke={color} fill="none" strokeWidth={sw}>
        <rect x={x} y={y} width={w} height={h} />
        <line x1={x + 0.206 * w} y1={y} x2={x + 0.206 * w} y2={y + h} strokeWidth={sw * 0.7} />
        <line x1={x + 0.206 * w} y1={y + 0.078 * h} x2={x + w} y2={y + 0.078 * h} strokeWidth={sw * 0.5} />
        <rect x={cx - 0.297 * w} y={y + 0.82 * h} width={0.594 * w} height={0.13 * h} rx={0.02 * w} strokeWidth={sw * 0.8} />
        <rect x={cx + 0.12 * w} y={y + 0.36 * h} width={0.17 * w} height={0.055 * h} rx={0.014 * w} strokeWidth={sw * 0.6} />
        <line x1={cx - 0.29 * w} y1={y + 0.5 * h} x2={cx + 0.18 * w} y2={y + 0.5 * h} strokeWidth={sw * 0.6} />
        <line x1={cx - 0.29 * w} y1={y + 0.56 * h} x2={cx + 0.05 * w} y2={y + 0.56 * h} strokeWidth={sw * 0.6} />
        {[0, 1, 2, 3, 4, 5].map((j) => (
          <line key={j} x1={x + 0.02 * w} y1={y + (0.12 + j * 0.05) * h} x2={x + (0.1 + ((j * 37) % 7) * 0.012) * w} y2={y + (0.12 + j * 0.05) * h} strokeWidth={sw * 0.5} />
        ))}
      </g>,
    );
  }
  const lines: React.ReactNode[] = [];
  const big = 2.4;
  const n = 8;
  for (let i = 0; i <= n; i++) {
    const fx = i / n;
    const X = vx + (fx - 0.5) * W * big;
    lines.push(<line key={'t' + i} x1={X} y1={vy - (H * big) / 2} x2={vx} y2={vy} stroke={color} strokeWidth={1.6} opacity={0.55 * k} />);
    lines.push(<line key={'b' + i} x1={X} y1={vy + (H * big) / 2} x2={vx} y2={vy} stroke={color} strokeWidth={1.6} opacity={0.55 * k} />);
  }
  for (let i = 1; i < 6; i++) {
    const fy = i / 6;
    const Y = vy + (fy - 0.5) * H * big;
    lines.push(<line key={'l' + i} x1={vx - (W * big) / 2} y1={Y} x2={vx} y2={vy} stroke={color} strokeWidth={1.6} opacity={0.55 * k} />);
    lines.push(<line key={'r' + i} x1={vx + (W * big) / 2} y1={Y} x2={vx} y2={vy} stroke={color} strokeWidth={1.6} opacity={0.55 * k} />);
  }
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, filter: `drop-shadow(0 0 6px ${C.clay})`}}>
      {lines}
      {rings}
    </svg>
  );
};

