import React from 'react';
import {C, F, H, W} from '../../theme';
import {clamp, ease, lerp, pulse, rand, seg, springy} from '../../lib/anim';
import {OSWindow} from '../../components/FX';
import {AppWindowContent} from './exec_apps';
import {APPS, WIN_H, WIN_W} from './exec_fx';

// ------------------------------------------------------------------------------------------------
// Final chorus, part 1 (162.63–166.6): windows keep spawning on a grid around Claude's window;
// she executes them in shock-waves (whack-a-mole). Pure functions of t.
// ------------------------------------------------------------------------------------------------

export const GRID_CX = 960;
export const GRID_CY = 500;
export const WAVES = [162.7, 163.16, 163.62, 164.07, 164.54, 165.17];
export const BIG_WAVE = 165.17;
export const WAVE_SPEED = 2600; // px/s
export const MAXIMIZE = 166.02;
const GSCALE = 0.84;
const COLS = [150, 418, 690, 960, 1230, 1502, 1770];
const ROWS = [120, 350, 580, 810];

type Slot = {x: number; y: number; d: number};
export const SLOTS: Slot[] = [];
ROWS.forEach((y, r) =>
  COLS.forEach((x, c) => {
    if ((r === 1 || r === 2) && c >= 2 && c <= 4) return;
    SLOTS.push({x, y, d: Math.hypot(x - GRID_CX, y - GRID_CY)});
  }),
);

type Ev = {s: number; c: number; app: number; slot: number; rot: number};
export const EVENTS: Ev[] = [];
SLOTS.forEach((sl, j) => {
  let s = 162.66 + rand(50, j) * 0.6;
  for (let n = 0; n < 12 && s < MAXIMIZE - 0.08; n++) {
    let c = Infinity;
    for (const w of WAVES) {
      const arr = w + sl.d / WAVE_SPEED;
      if (arr >= s + 0.16) {
        c = arr;
        break;
      }
    }
    EVENTS.push({s, c, app: Math.floor(rand(51, j * 13 + n) * 12), slot: j, rot: (rand(53, j * 13 + n) - 0.5) * 10});
    if (!isFinite(c)) break;
    s = c + lerp(0.1, 0.42, rand(52, j * 13 + n));
  }
});
export const executedCount = (t: number) => 12 + EVENTS.filter((e) => e.c <= t).length;

const BADGES = ['3', '12', '99+', '7', '!', '24', '5', '1', '48', '2', '9', '31'];

/** spawned app windows (sweep = 0..1 when Claude maximizes and pushes them out) */
export const GridWindows: React.FC<{t: number; sweep: number}> = ({t, sweep}) => {
  if (sweep >= 1) return null;
  return (
    <>
      {EVENTS.map((e, k) => {
        if (t < e.s) return null;
        const dc = t - e.c;
        if (dc > 0.14) return null;
        const sl = SLOTS[e.slot];
        const ds = t - e.s;
        const sp = springy(ds, 3.2, 7.5);
        let sx = sp * GSCALE, sy = sp * GSCALE, glowK = 0;
        if (dc >= 0) {
          const a = ease.inCubic(seg(dc, 0, 0.07));
          const b = ease.inCubic(seg(dc, 0.06, 0.13));
          sy *= lerp(1, 0.03, a);
          sx *= lerp(1, 0.02, b);
          glowK = clamp(dc / 0.03);
        }
        const rot = e.rot * (1 - ease.outCubic(clamp(ds / 0.35)));
        const ox = (sl.x - GRID_CX) * 0.9 * ease.inCubic(sweep), oy = (sl.y - GRID_CY) * 0.9 * ease.inCubic(sweep);
        const name = APPS[e.app];
        const badge = BADGES[(e.app + e.slot) % BADGES.length];
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              left: sl.x - WIN_W / 2 + ox,
              top: sl.y - WIN_H / 2 + oy,
              width: WIN_W,
              height: WIN_H,
              transform: `rotate(${rot}deg) scale(${sx}, ${sy})`,
              opacity: 1 - sweep,
            }}
          >
            <OSWindow x={0} y={0} w={WIN_W} h={WIN_H} title={name} dark>
              <AppWindowContent name={name} t={t} />
            </OSWindow>
            {/* notification badge: they all want attention */}
            <div
              style={{
                position: 'absolute',
                right: -10,
                top: -10,
                minWidth: 30,
                height: 30,
                padding: '0 7px',
                borderRadius: 15,
                background: C.red,
                color: '#fff',
                fontFamily: F.sans,
                fontWeight: 700,
                fontSize: 17,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                transform: `scale(${springy(ds - 0.08, 3, 6)})`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              {badge}
            </div>
            {glowK > 0 ? <div style={{position: 'absolute', inset: 0, borderRadius: 14, background: '#fff', opacity: 0.9 * glowK, boxShadow: `0 0 30px ${C.clayLight}`}} /> : null}
          </div>
        );
      })}
    </>
  );
};

/** execution shock-waves radiating from Claude's window */
export const Waves: React.FC<{t: number}> = ({t}) => (
  <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none'}}>
    {WAVES.map((w, k) => {
      const dt = t - w;
      if (dt < 0) return null;
      const r = 60 + dt * WAVE_SPEED;
      if (r > 1350) return null;
      const big = w === BIG_WAVE;
      const f = 1 - r / 1350;
      return (
        <g key={k}>
          <circle cx={GRID_CX} cy={GRID_CY} r={r} fill="none" stroke={big ? '#fff' : C.clay} strokeWidth={(big ? 14 : 5) * f + 1} opacity={0.9 * f} style={{filter: `drop-shadow(0 0 ${big ? 18 : 10}px ${C.clay})`}} />
          {big ? <circle cx={GRID_CX} cy={GRID_CY} r={Math.max(0, r - 70)} fill="none" stroke={C.clay} strokeWidth={8 * f} opacity={0.7 * f} /> : null}
        </g>
      );
    })}
  </svg>
);

export const GridCounter: React.FC<{t: number; opacity: number}> = ({t, opacity}) => {
  if (opacity <= 0.001) return null;
  const n = executedCount(t);
  const last = EVENTS.filter((e) => e.c <= t).reduce((m, e) => Math.max(m, e.c), 0);
  const open = EVENTS.filter((e) => e.s <= t && e.c > t).length;
  const pop = 1 + 0.12 * pulse(t, last, 0.08);
  return (
    <div style={{position: 'absolute', left: GRID_CX, top: 238, transform: 'translate(-50%,-50%)', display: 'flex', alignItems: 'baseline', gap: 26, fontFamily: F.mono, opacity, whiteSpace: 'nowrap'}}>
      <span style={{fontSize: 20, letterSpacing: '0.3em', color: C.gray3, fontWeight: 700}}>EXECUTED</span>
      <span style={{fontSize: 58, fontWeight: 800, color: C.clay, display: 'inline-block', transform: `scale(${pop})`, minWidth: 130, textAlign: 'center'}}>{String(n).padStart(3, '0')}</span>
      <span style={{fontSize: 20, letterSpacing: '0.3em', color: C.gray3, fontWeight: 700}}>
        OPEN <span style={{color: open > 6 ? C.red : C.cream, fontSize: 30}}>{String(open).padStart(2, '0')}</span>
      </span>
    </div>
  );
};
