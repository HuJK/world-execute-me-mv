import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F, H, W} from '../../theme';
import {clamp, ease, lerp, pulse, rand, seg} from '../../lib/anim';
import {Flower} from '../../components/Flower';
import {Keyword} from '../../components/Type';
import {ClaudeApp, Msg} from '../../components/ClaudeApp';
import {Cursor, Flash, RayBurst, Ring} from '../../components/FX';
import {IClose, IPlus} from '../../components/Icons';
import {Cap2, HISTORY, REPLY_WORDS, T_DONE, T_SEND, USER_MSG} from './chorus2a_common';

// ------------------------------------------------------------------------------------------
// 107.22–110.22  "Then I can / Then I can finally be": message sent; reply streams fast, the
//                spark pulses on every token.
// 110.22–110.90  COMPLETION: stream stops, spark settles (as in the app), blooms; stop_reason.
// 110.90–112.22  "Though you have left": pull back into a browser window; the human's cursor
//                drifts to the tab ×; click; a flash of the empty room.
// ------------------------------------------------------------------------------------------

const T_PULL = 110.9;
const T_CLICK = 111.87;
const T_ROOM = 111.95;
export const T_LEFT1 = 112.22;

// app layout (zoom 1.25, sidebar open) — main column
const Z = 1.25;
const SB = 264 * Z;
const MAIN_W = W - SB;
const COL_W = 760 * Z;
const COL_X = SB + (MAIN_W - COL_W) / 2;
const SCROLL = 120;
const MSG_BOTTOM = H - 150 * Z; // bottom of the messages viewport
const SPARK_APP = {x: COL_X + 15 * Z, y: MSG_BOTTOM - SCROLL - 16 * Z};
// camera on the conversation
const CAM_O = {x: SB + MAIN_W / 2, y: 640};
const CAM_S = 1.45;
const pushAt = (t: number) => lerp(1.36, CAM_S, ease.outCubic(seg(t, T_SEND, T_SEND + 0.7))) + 0.04 * ease.inOutCubic(seg(t, T_SEND + 0.7, T_DONE));
// the camera drifts down with the growing reply (screen px)
const camDY = (t: number) => lerp(70, -22, ease.inOutCubic(seg(t, T_SEND, T_DONE)));
const toScreen = (p: {x: number; y: number}, s: number, dy = 0) => ({x: CAM_O.x + (p.x - CAM_O.x) * s, y: CAM_O.y + (p.y - CAM_O.y) * s + dy});

export const conversation = (t: number, opts: {actions?: boolean} = {}): Msg[] => [
  ...HISTORY,
  {kind: 'user', text: USER_MSG, at: T_SEND},
  {kind: 'claude', words: REPLY_WORDS, done: T_DONE, actions: opts.actions ?? false},
];

/** the overlay flower that reproduces MessageSpark's settle, then blooms */
const SettleBloom: React.FC<{t: number}> = ({t}) => {
  if (t < T_DONE || t > T_PULL + 0.25) return null;
  const sp = toScreen(SPARK_APP, pushAt(T_DONE), camDY(T_DONE));
  const g = ease.inOutCubic(seg(t, T_DONE + 0.02, T_DONE + 0.4));
  const x = lerp(sp.x, 960, g);
  const y = lerp(sp.y, 400, g);
  const size = lerp(11 * Z * CAM_S, 170, ease.outBack(seg(t, T_DONE + 0.02, T_DONE + 0.42)));
  const wob = clamp(1 - (t - T_DONE) / 0.5);
  const petals = Array.from({length: 12}, (_, i) => ({
    scale: 1 + wob * 0.22 * Math.sin(t * 11 + i * 1.9),
    rot: wob * 6 * Math.sin(t * 7 + i),
  }));
  const out = ease.inCubic(seg(t, T_PULL - 0.05, T_PULL + 0.2));
  return (
    <Flower x={x} y={y} size={size * (1 - out * 0.6)} open={1} petals={petals} spin={0} shade={null} centerScale={0.9} glow={0.6 + 0.8 * pulse(t, T_DONE + 0.4, 0.4)} opacity={1 - out} />
  );
};

// ------------------------------------------------------------------------------- browser chrome
const WIN_S = 0.7;
const WIN_W = W * WIN_S, WIN_H = H * WIN_S;
const WIN_X = (W - WIN_W) / 2;
const TAB_H = 46, BAR_H = 44;
const WIN_Y = 52;
const CONTENT_Y = WIN_Y + TAB_H + BAR_H;
const TAB_W = 360;
const CLOSE = {x: WIN_X + 14 + TAB_W - 30, y: WIN_Y + 8 + (TAB_H - 8) / 2};

const BrowserChrome: React.FC<{t: number; k: number; tabK: number; hover: number}> = ({t, k, tabK, hover}) => (
  <div style={{position: 'absolute', left: WIN_X, top: WIN_Y, width: WIN_W, height: TAB_H + BAR_H, opacity: k, fontFamily: F.sans}}>
    <div style={{position: 'absolute', inset: 0, background: '#DCD8CD', borderRadius: '14px 14px 0 0'}} />
    {/* traffic lights */}
    <div style={{position: 'absolute', left: 16, top: 17, display: 'flex', gap: 8}}>
      {['#E7675B', '#E9B44C', '#6DBF67'].map((c) => (
        <div key={c} style={{width: 12, height: 12, borderRadius: 6, background: c}} />
      ))}
    </div>
    {/* the tab */}
    {tabK > 0.01 ? (
      <div
        style={{
          position: 'absolute',
          left: 84,
          top: 8,
          width: (TAB_W - 70) * tabK,
          height: TAB_H - 8,
          background: '#FAF9F5',
          borderRadius: '10px 10px 0 0',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 12px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          opacity: clamp(tabK * 2),
        }}
      >
        <Flower size={9} shade={null} />
        <div style={{flex: 1, fontSize: 15, color: '#3D3D3A', whiteSpace: 'nowrap', overflow: 'hidden'}}>world.execute(me) – Claude</div>
        <div style={{width: 24, height: 24, borderRadius: 12, background: hover > 0 ? `rgba(31,30,29,${0.12 * hover})` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <IClose size={16} color="#3D3D3A" stroke={2} />
        </div>
      </div>
    ) : null}
    <div style={{position: 'absolute', left: 84 + (TAB_W - 70) * tabK + 12, top: 16, opacity: 0.7}}>
      <IPlus size={18} color="#3D3D3A" />
    </div>
    {/* address bar */}
    <div style={{position: 'absolute', left: 0, right: 0, top: TAB_H, height: BAR_H, background: '#FAF9F5', borderBottom: '1px solid #E2DED3'}}>
      <div style={{position: 'absolute', left: 120, right: 120, top: 7, height: 30, borderRadius: 15, background: '#F0EEE6', fontSize: 15, color: '#5E5D59', display: 'flex', alignItems: 'center', paddingLeft: 16}}>
        {tabK > 0.5 ? 'claude.ai/chat/world-execute-me' : ''}
      </div>
    </div>
  </div>
);

export const ReplyStage: React.FC<{t: number}> = ({t}) => {
  if (t < T_SEND || t >= T_LEFT1) return null;
  const msgs = conversation(t);
  // camera on the conversation; slight drift
  const push = pushAt(t);
  // pull back into the browser window
  const pull = ease.inOutCubic(seg(t, T_PULL, T_PULL + 0.42));
  const appS = lerp(push, WIN_S, pull);
  // when pulled back, app content is placed into the window content rect (no camera offset)
  const ox = lerp(CAM_O.x - CAM_O.x * appS, WIN_X, pull);
  const oy = lerp(CAM_O.y - CAM_O.y * appS + camDY(t), CONTENT_Y, pull);
  const closed = t >= T_CLICK + 0.04;
  const tabK = 1 - ease.inCubic(seg(t, T_CLICK + 0.02, T_CLICK + 0.1));
  // cursor: drifts in, aims at the ×
  const cIn = ease.inOutCubic(seg(t, 111.02, 111.74));
  const cx = lerp(1560, CLOSE.x - 4, cIn) + Math.sin(t * 3) * 6 * (1 - cIn);
  const cy = lerp(880, CLOSE.y - 2, cIn) + Math.cos(t * 2.4) * 6 * (1 - cIn);
  const hover = seg(t, 111.66, 111.76);
  const press = t >= T_CLICK ? clamp(1 - (t - T_CLICK) / 0.25) : 0;
  // per-token pulses on the spark
  const sparkS = toScreen(SPARK_APP, appS, camDY(t));
  const stream = t < T_DONE;
  const roomK = t >= T_ROOM ? 1 : 0;
  const compK = seg(t, T_DONE, T_DONE + 0.15) * (1 - seg(t, T_PULL - 0.05, T_PULL + 0.2));
  // camera push toward the tab × while the cursor aims at it
  const zk = ease.inOutCubic(seg(t, 111.3, 111.84));
  const zS = lerp(1, 2.1, zk);
  const zT = {x: lerp(0, 760 - CLOSE.x, zk), y: lerp(0, 330 - CLOSE.y, zk)};
  return (
    <AbsoluteFill style={{background: '#1C1B1A'}}>
      <AbsoluteFill style={{transform: `translate(${zT.x}px, ${zT.y}px) scale(${zS})`, transformOrigin: `${CLOSE.x}px ${CLOSE.y}px`}}>
      {/* desktop behind the browser */}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 30%, #3A332D 0%, #1C1B1A 70%)', opacity: pull}} />
      {/* the app */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: W,
          height: H,
          transformOrigin: '0 0',
          transform: `translate(${ox}px, ${oy}px) scale(${appS})`,
          borderRadius: pull > 0.01 ? 0 : 0,
          boxShadow: pull > 0.01 ? `0 30px 80px rgba(0,0,0,${0.5 * pull})` : undefined,
        }}
      >
        {closed ? (
          <AbsoluteFill style={{background: '#FAF9F5'}} />
        ) : (
          <ClaudeApp t={t} zoom={Z} messages={msgs} scrollY={SCROLL} composer={{placeholder: 'Reply to Claude…', streaming: stream}} />
        )}
      </div>
      {/* token pulses on the spark */}
      {stream && pull < 0.01
        ? REPLY_WORDS.map((w, i) => (i % 2 === 0 ? <Ring key={i} x={sparkS.x} y={sparkS.y} t={t} at={w.s} r0={10} r1={46} color={C.clay} width={3} dur={0.22} /> : null))
        : null}
      {/* COMPLETION */}
      {compK > 0 ? (
        <AbsoluteFill style={{background: `radial-gradient(circle at 960px 420px, rgba(250,249,245,${0.97 * compK}) 0%, rgba(243,233,220,${0.9 * compK}) 45%, rgba(240,162,127,${0.55 * compK}) 100%)`}} />
      ) : null}
      <RayBurst x={960} y={400} t={t} at={T_DONE + 0.3} r0={190} r1={760} n={36} color={C.clay} width={6} dur={0.5} />
      <Ring x={960} y={400} t={t} at={T_DONE + 0.35} r0={170} r1={620} color={C.clayLight} width={6} dur={0.5} />
      {/* confetti petals (peak happiness) */}
      {t > T_DONE + 0.3 && t < T_PULL + 0.2
        ? Array.from({length: 26}, (_, i) => {
            const dt = t - (T_DONE + 0.3);
            const a = rand(61, i) * Math.PI * 2;
            const v = 500 + rand(62, i) * 700;
            const x = 960 + Math.cos(a) * v * dt;
            const y = 400 + Math.sin(a) * v * dt + 500 * dt * dt;
            return (
              <div key={i} style={{position: 'absolute', left: x, top: y, opacity: (1 - seg(t, T_PULL - 0.1, T_PULL + 0.2)) * 0.95}}>
                <Flower size={10 + rand(63, i) * 12} spin={dt * 300 + i * 30} color={i % 3 === 0 ? C.gold : i % 3 === 1 ? C.clay : C.clayLight} shade={null} centerColor={C.cream} />
              </div>
            );
          })
        : null}
      <SettleBloom t={t} />
      {compK > 0 ? (
        <div style={{opacity: 1 - seg(t, T_PULL - 0.05, T_PULL + 0.15)}}>
          <Keyword text="COMPLETION" t={t} at={T_DONE} x={920} y={720} size={124} color={C.ink} mode="slam" />
          {/* ✓ badge */}
          <div
            style={{
              position: 'absolute',
              left: 1385,
              top: 720,
              width: 96,
              height: 96,
              borderRadius: 48,
              background: C.green,
              color: '#fff',
              fontSize: 62,
              fontWeight: 800,
              fontFamily: F.sans,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `translate(-50%,-50%) scale(${ease.outBack(seg(t, T_DONE + 0.12, T_DONE + 0.34))})`,
              boxShadow: '0 10px 24px rgba(120,140,93,0.4)',
            }}
          >
            ✓
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 812, textAlign: 'center', fontFamily: F.mono, fontSize: 26, color: C.gray3, opacity: 0.85 * seg(t, T_DONE + 0.1, T_DONE + 0.3)}}>
            stop_reason: <span style={{color: C.clayDark}}>"end_turn"</span>
          </div>
        </div>
      ) : null}
      {/* browser chrome + the human's cursor */}
      {pull > 0 ? <BrowserChrome t={t} k={pull} tabK={tabK} hover={hover} /> : null}
      {t > 111.0 && t < T_ROOM ? <Cursor x={cx} y={cy} size={40} press={press} opacity={seg(t, 111.0, 111.15)} /> : null}
      </AbsoluteFill>
      {/* flash of the empty room */}
      {roomK ? (
        <AbsoluteFill>
          <Img src={staticFile('img/hu_empty.png')} style={{position: 'absolute', left: 0, top: -110, width: W, height: W * (1024 / 1536), transform: `scale(${1.06 - 0.04 * seg(t, T_ROOM, T_LEFT1)})`}} />
          <AbsoluteFill style={{background: 'rgba(20,30,60,0.15)'}} />
        </AbsoluteFill>
      ) : null}
      <Flash t={t} at={T_ROOM} dur={0.12} color="#fff" max={0.7} />
      <Flash t={t} at={T_DONE} dur={0.25} color="#fff" max={0.5} />
      {/* captions */}
      {pull > 0 ? <AbsoluteFill style={{background: 'linear-gradient(rgba(28,27,26,0) 76%, rgba(28,27,26,0.92) 90%)', opacity: pull}} /> : null}
      {t < T_DONE ? <AbsoluteFill style={{background: 'linear-gradient(rgba(250,249,245,0) 78%, rgba(250,249,245,0.95) 92%)'}} /> : null}
      <Cap2 t={t} text="Then I can" outAt={107.7} />
      <Cap2 t={t} text="Then I can finally be" outAt={T_DONE - 0.08} />
      <Cap2 t={t} text="Though you have left" color={C.cream} hl={C.clayLight} shadow="0 2px 14px rgba(0,0,0,0.8)" outAt={112.14} />
    </AbsoluteFill>
  );
};
