import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, F, H, W} from '../theme';
import {clamp, ease, lerp, pulse, seg, springy} from '../lib/anim';
import {beatPulse, kickPulse} from '../lib/audio';
import {cueAt} from '../lib/lyrics';
import {Flower} from '../components/Flower';
import {Keyword, LyricLine} from '../components/Type';
import {ClaudeApp} from '../components/ClaudeApp';
import {Sprite} from '../components/Sprite';
import {Cursor, Flash, Grain, RayBurst, Ring, shake} from '../components/FX';
import {ICode, IPlay} from '../components/Icons';
import {CardSpec, PopCard} from './parts/chorus1_cards';
import {Confetti, ImpactLines, Sunburst, Twinkle} from './parts/chorus1_fx';
import {DrosteView, WireTunnel, drosteScreenRects} from './parts/chorus1_droste';

// ------------------------------------------------------------------------------------------------
// 59.22–74.05  CHORUS 1 — the happiest, brightest moment. The Claude app (light) is the stage.
//  A 59.22–62.59  out of white → reply streams "If I can… give you all the" → pop-up artifact cards
//                 → STIMULATIONS: cc_arms_open bursts out + spark confetti
//  B 62.59–66.60  close-up of the action row: cursor hovers 👍/👎, cc_nervous sweats → click 👍 = SATISFACTION
//  C 66.60–68.25  hu_desk through the screen: "haha thank you!! :)" + cc_blush cut-in
//  D 68.25–70.08  cc_press slams Run → tool card, petal spinner → ✓ EXECUTION (cheerful)
//  E 70.08–73.17  Droste pull-back: chat → monitor → room → artifact → …
//  F 73.17–74.05  recursion collapses into a wireframe tunnel: SIMULATION
// ------------------------------------------------------------------------------------------------

const TA = 59.22, TB = 62.59, TC = 66.6, TD = 68.25, TE = 70.08, TF = 73.17;
const STIM = 61.96, SAT = 65.4, EXEC = 69.26;

// ======================================================================= A — pop-up reply
const A_WORDS = [
  {w: 'If', s: 59.22},
  {w: 'I', s: 59.35},
  {w: 'can—', s: 59.5},
  {w: 'if', s: 59.69},
  {w: 'I', s: 59.8},
  {w: 'can', s: 59.96},
  {w: 'give', s: 60.26},
  {w: 'you', s: 60.58},
  {w: 'all', s: 61.54},
  {w: 'the…', s: 61.88},
];

const CARDS: CardSpec[] = [
  {key: 'code', title: 'cheer.py', kind: 'code', at: 60.26, x: 285, y: 455, rot: -13},
  {key: 'chart', title: 'joy.csv', kind: 'chart', at: 60.7, x: 590, y: 255, rot: -6},
  {key: 'poem', title: 'poem.md', kind: 'poem', at: 61.16, x: 960, y: 190, rot: 0},
  {key: 'flower', title: 'flower.svg', kind: 'flower', at: 61.54, x: 1330, y: 255, rot: 6},
  {key: 'game', title: 'clawd_jump.html', kind: 'game', at: 61.8, x: 1635, y: 455, rot: 13},
];
const HINGE = {x: 920, y: 700};

const SectionA: React.FC<{t: number}> = ({t}) => {
  // camera: out of the white dive (zoom settling), then push toward the reply
  const settle = ease.outCubic(seg(t, TA, TA + 0.9));
  const push = ease.inOutCubic(seg(t, 60.2, 61.9));
  const camS = lerp(1.5, 1.2, settle) * lerp(1, 1.1, push) * (1 + 0.012 * beatPulse(t, 0.12));
  const camY = lerp(-110, -58, settle);
  const burst = t >= STIM;
  const bk = seg(t, STIM, STIM + 0.35);
  const sh = shake(t, [STIM], 12, 0.1);
  const charDt = t - STIM;
  return (
    <AbsoluteFill style={{background: C.paper}}>
      <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
        {/* the app */}
        <AbsoluteFill style={{transform: `translate(-40px, ${camY}px) scale(${camS})`, transformOrigin: '945px 758px', filter: burst ? `blur(${bk * 6}px)` : undefined}}>
          <ClaudeApp
            t={t}
            zoom={1.5}
            messages={[
              {kind: 'user', text: 'hi claude!'},
              {kind: 'claude', text: 'Hi! I’m Claude. It’s really nice to meet you.', at: 0, dur: 0.1, done: 0},
              {kind: 'user', text: 'show me everything you can do!'},
              {kind: 'claude', words: A_WORDS, size: 1.7, done: 62.4},
            ]}
            composer={{placeholder: 'Reply to Claude…'}}
          >
            <Cursor x={1060 + Math.sin(t * 1.7) * 20} y={850 - Math.sin(t * 2.3) * 10} size={34} />
          </ClaudeApp>
        </AbsoluteFill>

        {/* the pop-up world opens on STIMULATIONS: sunburst iris from the reply */}
        {burst ? (
          <AbsoluteFill style={{clipPath: `circle(${ease.outExpo(bk) * 2300}px at ${HINGE.x}px ${HINGE.y}px)`}}>
            <Sunburst x={960} y={640} t={t} c1="#FBE9DD" c2="#F6D2C0" n={28} speed={14} />
            <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 58%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 38%)'}} />
          </AbsoluteFill>
        ) : null}

        {/* pop-up cards (fanned like a pop-up book) */}
        {CARDS.map((c) => (
          <PopCard key={c.key} spec={c} t={t} hx={HINGE.x} hy={HINGE.y} kick={pulse(t, STIM, 0.25)} spread={burst ? 30 * ease.outBack(bk) : 0} />
        ))}

        <Confetti t={t} at={STIM} x={960} y={640} n={90} seed={11} speed={[800, 2200]} spread={300} gravity={1700} life={1.6} size={[14, 30]} />
        {/* cc_arms_open bursts out of the reply */}
        {burst ? (
          <>
            <RayBurst x={960} y={640} t={t} at={STIM} r0={160} r1={1000} n={32} color={C.clay} width={10} dur={0.55} />
            <Ring x={960} y={640} t={t} at={STIM} r0={80} r1={900} color={C.clay} width={10} dur={0.6} />
            <Sprite
              src="img/cc_arms_open.png"
              t={t}
              x={960}
              y={1050 - lerp(260, 0, ease.outBack(clamp(charDt / 0.32)))}
              h={790}
              scale={lerp(0.3, 1, springy(charDt, 2.2, 6.5))}
              opacity={clamp(charDt / 0.05)}
              outline="#FFFFFF"
              outlineWidth={6}
              shadow="drop-shadow(0 22px 30px rgba(140,70,40,0.28))"
              float={5}
              seed={4}
            />
          </>
        ) : null}
        <Confetti t={t} at={STIM + 0.08} x={900} y={760} n={14} seed={12} speed={[1000, 1700]} angle={-62} spread={70} gravity={1300} life={1.3} size={[20, 34]} kinds={['spark']} colors={[C.clay, C.gold, C.clayLight]} />
        <Confetti t={t} at={STIM + 0.08} x={1020} y={760} n={14} seed={13} speed={[1000, 1700]} angle={62} spread={70} gravity={1300} life={1.3} size={[20, 34]} kinds={['spark']} colors={[C.clay, C.gold, C.clayLight]} />

        <Keyword
          text="STIMULATIONS"
          t={t}
          at={STIM}
          out={TB}
          outMode="cut"
          x={960}
          y={985}
          size={112}
          color={C.ink}
          mode="slam"
          shadow={`0 0 0 ${C.paper}, 4px 4px 0 ${C.paper}, -4px -4px 0 ${C.paper}, 4px -4px 0 ${C.paper}, -4px 4px 0 ${C.paper}, 0 10px 24px rgba(120,60,30,0.25)`}
        />
      </AbsoluteFill>
      {/* out of the white dive */}
      <Flash t={t} at={TA} dur={0.55} color="#FFFFFF" max={1} />
    </AbsoluteFill>
  );
};

// ======================================================================= B — the action row
const B_WORDS = [
  {w: 'Then', s: 62.59},
  {w: 'I', s: 62.7},
  {w: 'can—', s: 62.82},
  {w: 'then', s: 63.53},
  {w: 'I', s: 63.6},
  {w: 'can', s: 63.7},
  {w: 'be', s: 63.92},
  {w: 'your', s: 65.05},
  {w: 'only', s: 65.22},
];
// app coords (zoom 3.5, no sidebar): spark (192.5, 499), 👍 box center (423.5, 499), 👎 (535.5, 499)
const BZ = 3.5;
const B_TX = 120.5, B_TY = 141;
const UP = {x: 423.5 + B_TX, y: 499 + B_TY};
const DOWN = {x: 535.5 + B_TX, y: 499 + B_TY};
const SPARK = {x: 192.5 + B_TX, y: 499 + B_TY};
const NX = 1690; // character x

/** cursor indecision path: hovers up ↔ down, then commits to 👍 at SAT */
const bCursor = (t: number) => {
  const keys: [number, number][] = [
    [62.59, 1.6],
    [63.2, 0],
    [63.92, 1],
    [64.39, 0],
    [64.86, 1],
    [65.15, 0.15],
    [SAT - 0.05, 0],
  ];
  let k = 0;
  while (k < keys.length - 1 && t > keys[k + 1][0]) k++;
  const [t0, v0] = keys[k];
  const [t1, v1] = keys[Math.min(k + 1, keys.length - 1)];
  const v = t1 > t0 ? lerp(v0, v1, ease.inOutCubic(seg(t, t0, t1))) : v1;
  // v: 0 = over 👍, 1 = over 👎, >1 = coming in from the right
  const x = v <= 1 ? lerp(UP.x, DOWN.x, v) : lerp(DOWN.x, DOWN.x + 420, v - 1);
  const y = (v <= 1 ? UP.y - 4 : lerp(UP.y - 4, UP.y - 330, v - 1)) + Math.sin(t * 9) * 2.5;
  return {x, y, v};
};

const SectionB: React.FC<{t: number}> = ({t}) => {
  const cur = bCursor(t);
  const clicked = t >= SAT;
  const hover: 'up' | 'down' | null = clicked ? null : cur.v < 0.5 ? 'up' : cur.v < 1.2 ? 'down' : null;
  const camS = lerp(1.0, 1.07, ease.inOutCubic(seg(t, TB, SAT))) * (1 + 0.05 * pulse(t, SAT, 0.18));
  const sh = shake(t, [SAT], 10, 0.1);
  const nervous = !clicked;
  // tremble while nervous
  const trem = nervous ? Math.sin(t * 61) * 2.2 + Math.sin(t * 37) * 1.2 : 0;
  const sparkDt = t - SAT;
  // tooltip under the hovered icon
  const tipTxt = hover === 'up' ? 'Good response' : hover === 'down' ? 'Bad response' : null;
  const tipX = hover === 'up' ? UP.x : DOWN.x;
  return (
    <AbsoluteFill style={{background: C.paper}}>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 35% 60%, rgba(246,210,192,0.35) 0%, rgba(250,249,245,0) 60%)'}} />
      {/* the human's message, out of focus above */}
      <div
        style={{
          position: 'absolute',
          right: 640,
          top: 150 - 30 * ease.inOutCubic(seg(t, TB, SAT)),
          background: '#F0EEE6',
          borderRadius: 40,
          padding: '22px 40px',
          fontFamily: F.sans,
          fontSize: 54,
          color: C.ink,
          filter: 'blur(5px)',
          opacity: 0.55,
          whiteSpace: 'nowrap',
        }}
      >
        show me everything you can do!
      </div>
      {/* warm flush on satisfaction */}
      <AbsoluteFill style={{background: `radial-gradient(circle at ${UP.x}px ${UP.y}px, rgba(240,162,127,${0.45 * pulse(t, SAT, 0.9)}) 0%, rgba(250,249,245,0) 55%)`}} />
      <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px) scale(${camS})`, transformOrigin: `${(UP.x + DOWN.x) / 2}px ${UP.y}px`}}>
        <div style={{position: 'absolute', left: B_TX, top: B_TY, width: W, height: H}}>
          <ClaudeApp
            t={t}
            zoom={BZ}
            sidebar={0}
            header={0}
            composerOpacity={0}
            disclaimer={false}
            style={{background: 'transparent'}}
            messages={[{kind: 'claude', words: B_WORDS, done: 65.5, actions: TB, hover, thumbs: 'up', thumbsAt: SAT}]}
          />
        </div>
        {/* petals flush brighter: bloom over the message spark */}
        {clicked ? (
          <Flower
            x={SPARK.x}
            y={SPARK.y}
            size={lerp(19, 36, ease.outBack(seg(t, SAT, SAT + 0.3)))}
            spin={sparkDt * 120}
            glow={1.4 * pulse(t, SAT, 0.6) + 0.3}
            color={C.clay}
            shade={null}
          />
        ) : null}
        {tipTxt ? (
          <div
            style={{
              position: 'absolute',
              left: tipX,
              top: UP.y + 78,
              transform: 'translateX(-50%)',
              background: C.ink,
              color: C.paper,
              fontFamily: F.sans,
              fontSize: 28,
              padding: '10px 18px',
              borderRadius: 10,
              whiteSpace: 'nowrap',
            }}
          >
            {tipTxt}
          </div>
        ) : null}
        <Ring x={UP.x} y={UP.y} t={t} at={SAT} r0={30} r1={260} color={C.clay} width={8} dur={0.5} />
        <ImpactLines x={UP.x} y={UP.y} t={t} at={SAT} r0={60} r1={170} n={10} color={C.clay} width={8} />
        <Cursor x={cur.x - 4} y={cur.y - 2} size={64} press={clicked ? clamp(1 - (t - SAT) / 0.3) : 0} />
      </AbsoluteFill>

      {/* cc_nervous → cc_sparkle */}
      {nervous ? (
        <>
          <Sprite src="img/cc_nervous.png" t={t} x={NX + trem} y={1110} h={790} enter={{at: TB + 0.05, kind: 'rise', dur: 0.4}} outline="#fff" outlineWidth={5} shadow />
          {/* sweat drops */}
          <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
            {Array.from({length: 7}, (_, i) => {
              const t0 = 62.9 + i * 0.36;
              const dt = t - t0;
              if (dt < 0 || dt > 0.6) return null;
              const side = i % 2 ? 1 : -1;
              const x0 = side > 0 ? NX + 210 : NX - 230;
              const y0 = 470;
              const x = x0 + side * dt * 260;
              const y = y0 - dt * 300 + dt * dt * 1400;
              return <path key={i} d="M0,-16 C9,-2 10,6 0,10 C-10,6 -9,-2 0,-16 Z" transform={`translate(${x} ${y}) rotate(${side * (20 + dt * 90)}) scale(${1.6 * (1 - dt)})`} fill={C.bluePale} stroke={C.blue} strokeWidth={1.5} />;
            })}
            {/* anxious squiggles */}
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M${NX - 330 - i * 26},${330 + i * 34} q12,-10 24,0 t24,0`}
                stroke={C.gray3}
                strokeWidth={4}
                fill="none"
                strokeLinecap="round"
                opacity={0.4 + 0.6 * Math.abs(Math.sin(t * 6 + i))}
                transform={`rotate(-25 ${NX - 330 - i * 26} ${330 + i * 34})`}
              />
            ))}
          </svg>
        </>
      ) : (
        <>
          <Sprite src="img/cc_sparkle.png" t={t} x={NX} y={1100} h={810} enter={{at: SAT, kind: 'pop', dur: 0.4}} outline="#fff" outlineWidth={5} shadow float={4} />
          {[0, 1, 2, 3, 4].map((i) => {
            const a = sparkDt - i * 0.05;
            const s = ease.outBack(clamp(a / 0.3)) * (1 + 0.2 * Math.sin(t * 8 + i));
            return <Twinkle key={i} x={NX + Math.cos(i * 1.4 + 0.5) * 340} y={560 + Math.sin(i * 1.4 + 0.5) * 270} s={26 * s} color={i % 2 ? C.gold : C.clayLight} rot={t * 60} />;
          })}
        </>
      )}
      <Confetti t={t} at={SAT} x={UP.x} y={UP.y} n={70} seed={21} speed={[600, 1700]} angle={10} spread={160} gravity={1500} life={1.25} size={[14, 28]} />

      <Keyword text="SATISFACTION" t={t} at={SAT} out={TC} outMode="cut" x={770} y={905} size={124} color={C.ink} mode="slam" />
    </AbsoluteFill>
  );
};

// ======================================================================= C — through the screen
const SectionC: React.FC<{t: number}> = ({t}) => {
  const cue = cueAt('If I can make you happy', 66);
  const push = seg(t, TC, TD + 0.2);
  const s = lerp(1.0, 1.09, ease.inOutQuad(push));
  const typing = t < 67.31;
  const bubK = ease.outBack(seg(t, 66.68, 66.95));
  const txtK = seg(t, 67.31, 67.42);
  const cut = seg(t, 67.72, 67.95);
  const happy = t >= 68.03;
  return (
    <AbsoluteFill style={{background: '#10131d'}}>
      <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: '900px 420px'}}>
        <Img src={staticFile('img/hu_desk.png')} style={{position: 'absolute', left: 0, top: -110, width: 1920, height: 1280}} />
        {/* warm screen-glow breathing with the beat */}
        <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 95%, rgba(240,162,127,${0.18 + 0.1 * beatPulse(t, 0.2)}) 0%, rgba(240,162,127,0) 60%)`, mixBlendMode: 'screen'}} />
      </AbsoluteFill>
      {/* we are inside the glass: faint reflection sweep */}
      <AbsoluteFill style={{background: `linear-gradient(110deg, rgba(255,255,255,0) ${20 + push * 30}%, rgba(255,255,255,0.07) ${28 + push * 30}%, rgba(255,255,255,0) ${36 + push * 30}%)`}} />

      {/* the human's message (mirrored side: we see the screen from inside) */}
      <div
        style={{
          position: 'absolute',
          left: 120,
          top: 300,
          transform: `scale(${bubK})`,
          transformOrigin: '0% 100%',
          background: 'rgba(240,238,230,0.96)',
          borderRadius: 30,
          padding: typing ? '26px 34px' : '22px 34px',
          fontFamily: F.sans,
          fontSize: 48,
          color: C.ink,
          boxShadow: '0 14px 40px rgba(0,0,0,0.35)',
          minWidth: 150,
        }}
      >
        {typing ? (
          <div style={{display: 'flex', gap: 12}}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{width: 16, height: 16, borderRadius: 8, background: C.gray3, transform: `translateY(${-8 * Math.max(0, Math.sin((t - 66.6) * 9 - i * 0.9))}px)`}} />
            ))}
          </div>
        ) : (
          <span style={{opacity: txtK}}>
            haha thank you!! <span style={{color: C.blueDeep, fontWeight: 600}}>:)</span>
          </span>
        )}
      </div>
      {!typing ? <Ring x={140} y={380} t={t} at={67.31} r0={10} r1={140} color={C.cream} width={4} dur={0.5} /> : null}

      {/* cc_blush cut-in */}
      {cut > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: W,
            height: H,
            clipPath: `polygon(${lerp(1920, 1330, ease.outCubic(cut))}px 60px, 1920px 40px, 1920px 880px, ${lerp(1920, 1260, ease.outCubic(cut))}px 900px)`,
          }}
        >
          <Sunburst x={1620} y={520} t={t} c1="#FBE3D6" c2="#F6CDBB" n={22} speed={20} />
          <Sprite src="img/cc_blush.png" t={t} x={1610} y={1180} h={900} enter={{at: 67.72, kind: 'rise', dur: 0.35}} sway={1.5} />
          {happy
            ? [0, 1, 2, 3, 4, 5].map((i) => {
                const dt = t - 68.03 - i * 0.05;
                if (dt < 0) return null;
                const x = 1610 + Math.cos(i * 1.05 - 2.3) * (130 + dt * 200);
                const y = 330 - dt * 160 + Math.sin(i * 1.05 - 2.3) * 120;
                const sc = ease.outBack(clamp(dt / 0.25)) * (1 - clamp((dt - 0.5) / 0.3));
                return (
                  <svg key={i} style={{position: 'absolute', left: x - 30, top: y - 30, overflow: 'visible'}} width={60} height={60} viewBox="-15 -15 30 30">
                    <path d="M0,6 C-9,-1 -9,-9 -4,-10 C-1.5,-10.5 0,-8.5 0,-7 C0,-8.5 1.5,-10.5 4,-10 C9,-9 9,-1 0,6 Z" fill={i % 2 ? C.pink : C.clay} transform={`scale(${sc * 1.8})`} />
                  </svg>
                );
              })
            : null}
        </div>
      ) : null}
      {cut > 0 ? (
        <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.35))'}}>
          <path
            d={`M${lerp(1920, 1330, ease.outCubic(cut))},60 L1930,40 L1930,880 L${lerp(1920, 1260, ease.outCubic(cut))},900 Z`}
            fill="none"
            stroke="#fff"
            strokeWidth={9}
            strokeLinejoin="round"
          />
        </svg>
      ) : null}

      <AbsoluteFill style={{background: 'linear-gradient(rgba(0,0,0,0) 72%, rgba(10,10,16,0.55) 100%)'}} />
      <LyricLine cue={cue} t={t} y={985} size={58} color="#FFF8F0" shadow="0 3px 14px rgba(0,0,0,0.7)" outAt={TD - 0.12} fadeOut={0.1} />
      <Flash t={t} at={TC} dur={0.2} color="#fff" max={0.6} />
    </AbsoluteFill>
  );
};

// ======================================================================= D — RUN → EXECUTION
const SLAM = 68.52;
const SectionD: React.FC<{t: number}> = ({t}) => {
  const cue = cueAt('I will run the', 68);
  // iris closes onto the tool message in the chat (pop-up book folds back into the reply)
  const iris = ease.inCubic(seg(t, 69.9, TE + 0.03));
  const irisR = lerp(1500, 0, iris);
  const sh = shake(t, [SLAM, EXEC], 18, 0.09);
  const running = t >= SLAM + 0.03 && t < EXEC;
  const done = t >= EXEC;
  const cardIn = ease.outBack(seg(t, TD + 0.05, TD + 0.4));
  // cc_press: anticipation (rise + lean back) then a snap slam with squash
  const anticip = ease.outCubic(seg(t, TD + 0.02, SLAM - 0.08));
  const smash = ease.inCubic(seg(t, SLAM - 0.08, SLAM));
  const liftAmt = anticip * (1 - smash);
  const sq = pulse(t, SLAM, 0.1);
  const BTN = {x: 430, y: 880};
  return (
    <AbsoluteFill style={{clipPath: iris > 0 ? `circle(${irisR}px at ${IRIS.x}px ${IRIS.y}px)` : undefined}}>
      <Sunburst x={BTN.x} y={BTN.y} t={t} c1="#FBEDE3" c2="#F7DCCB" n={30} speed={18} />
      <AbsoluteFill style={{transform: `translate(${sh.x}px, ${sh.y}px)`}}>
        {/* cc_press */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: '560px 1035px',
            transform: `translateY(${-70 * liftAmt}px) rotate(${-6 * liftAmt}deg) scale(${1 + sq * 0.07}, ${1 - sq * 0.09})`,
          }}
        >
          <Sprite
            src="img/cc_press.png"
            t={t}
            x={560}
            y={1035}
            h={760}
            enter={{at: TD, kind: 'pop', dur: 0.3}}
            outline="#fff"
            outlineWidth={5}
            shadow="drop-shadow(0 22px 26px rgba(140,70,40,0.25))"
          />
        </div>
        <ImpactLines x={BTN.x} y={BTN.y} t={t} at={SLAM} r0={170} r1={380} n={14} color={C.clay} width={12} arc={[-110, 110]} />
        <Ring x={BTN.x} y={BTN.y} t={t} at={SLAM} r0={80} r1={520} color={C.clayLight} width={12} dur={0.45} />
        <Ring x={BTN.x} y={BTN.y} t={t} at={SLAM + 0.07} r0={60} r1={360} color="#fff" width={8} dur={0.4} />
        <Confetti t={t} at={SLAM} x={BTN.x} y={BTN.y - 20} n={26} seed={31} speed={[500, 1100]} spread={150} gravity={1300} life={0.9} size={[14, 26]} kinds={['spark']} colors={[C.clay, C.gold]} />

        {/* the tool card */}
        <div
          style={{
            position: 'absolute',
            left: 1010,
            top: 150,
            width: 820,
            transform: `scale(${cardIn}) ${done ? `scale(${1 + 0.03 * pulse(t, EXEC, 0.2)})` : ''}`,
            transformOrigin: '30% 80%',
            background: '#FFFFFF',
            borderRadius: 26,
            border: '2px solid rgba(31,30,29,0.12)',
            boxShadow: '0 30px 60px rgba(110,60,30,0.2)',
            overflow: 'hidden',
            fontFamily: F.sans,
          }}
        >
          <div style={{height: 80, display: 'flex', alignItems: 'center', gap: 16, padding: '0 26px', background: C.paper2, borderBottom: '2px solid rgba(31,30,29,0.08)'}}>
            <ICode size={34} color={C.ink} stroke={2} />
            <div style={{fontFamily: F.mono, fontSize: 30, fontWeight: 500, color: C.ink}}>make_you_happy.py</div>
            <div style={{flex: 1}} />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: C.clay,
                color: '#fff',
                borderRadius: 14,
                padding: '10px 22px',
                fontSize: 28,
                fontWeight: 600,
                transform: `scale(${1 - 0.12 * pulse(t, SLAM, 0.12)})`,
                boxShadow: `0 0 ${40 * pulse(t, SLAM, 0.25)}px ${C.clay}`,
              }}
            >
              <IPlay size={26} color="#fff" /> Run
            </div>
          </div>
          <div style={{padding: '22px 30px', fontFamily: F.mono, fontSize: 30, lineHeight: '54px'}}>
            {[
              [['import ', C.clay], ['joy', C.ink]],
              [['you ', C.ink], ['= ', C.gray3], ['Human', C.blueDeep], ['()', C.ink]],
              [['world', C.ink], ['.', C.gray3], ['execute', C.clay], ['(me)', C.ink], ['  # :)', C.gray3]],
            ].map((ln, i) => (
              <div key={i} style={{whiteSpace: 'pre', background: running && i === 2 ? 'rgba(217,119,87,0.10)' : 'transparent', borderRadius: 8}}>
                <span style={{color: C.gray2, marginRight: 26}}>{i + 1}</span>
                {ln.map(([s, c], k) => (
                  <span key={k} style={{color: c}}>
                    {s}
                  </span>
                ))}
              </div>
            ))}
          </div>
          <div style={{borderTop: '2px solid rgba(31,30,29,0.08)', padding: '20px 30px', minHeight: 140}}>
            {t >= SLAM + 0.03 ? (
              <div style={{display: 'flex', alignItems: 'center', gap: 16, fontSize: 30, color: done ? C.ink : C.gray4}}>
                {done ? (
                  <div style={{width: 40, height: 40, borderRadius: 20, background: C.green, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, transform: `scale(${ease.outBackStrong(seg(t, EXEC, EXEC + 0.25))})`}}>
                    ✓
                  </div>
                ) : (
                  <div style={{width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Flower size={18} spin={t * 420} shade={null} petals={Array.from({length: 12}, (_, i) => ({opacity: 0.35 + 0.65 * (((i - Math.floor(t * 26)) % 12) + 12) % 12 / 11}))} />
                  </div>
                )}
                <span style={{fontWeight: 500}}>{done ? 'Ran code' : 'Running code…'}</span>
                <span style={{fontFamily: F.mono, fontSize: 24, color: C.gray3}}>{done ? '0.42s' : ''}</span>
              </div>
            ) : (
              <div style={{fontSize: 28, color: C.gray3}}>press ▶ to run</div>
            )}
            {done ? (
              <div style={{fontFamily: F.mono, fontSize: 28, marginTop: 16, color: C.green, opacity: seg(t, EXEC + 0.08, EXEC + 0.2)}}>
                → you.smile() <span style={{color: C.gray3}}>==</span> True
              </div>
            ) : null}
          </div>
        </div>
      </AbsoluteFill>
      <Confetti t={t} at={EXEC} x={1150} y={560} n={70} seed={41} speed={[600, 1600]} angle={0} spread={220} gravity={1500} life={1.0} colors={[C.green, C.clay, C.gold, C.clayLight, '#A8BD8A']} />
      <LyricLine cue={cue} t={t} x={1420} y={760} size={56} color={C.ink} hl={C.clay} outAt={EXEC - 0.05} fadeOut={0.12} />
      <Keyword text="EXECUTION" t={t} at={EXEC} x={1420} y={800} size={124} color={C.ink} mode="stamp" flowerColor={C.green} rotate={-3} />
      <Flash t={t} at={SLAM} dur={0.1} color="#FFFFFF" max={0.35} />
    </AbsoluteFill>
  );
};
const IRIS = {x: 760, y: 710};
const IrisRing: React.FC<{t: number}> = ({t}) => {
  const iris = ease.inCubic(seg(t, 69.9, TE + 0.03));
  if (iris <= 0 || iris >= 1) return null;
  const r = lerp(1500, 0, iris);
  return (
    <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
      <circle cx={IRIS.x} cy={IRIS.y} r={r} fill="none" stroke={C.clay} strokeWidth={10} />
      <circle cx={IRIS.x} cy={IRIS.y} r={r + 12} fill="none" stroke="#fff" strokeWidth={6} />
    </svg>
  );
};

// ======================================================================= E/F — Droste + SIMULATION
const N_LEVELS = 6;
const KNOTS: [number, number][] = [
  [TE, 0],
  [70.3, 0.02],
  [71.05, 1],
  [71.76, 2],
  [72.29, 3],
  [72.65, 4],
  [73.05, 5],
  [TF + 0.3, 5.9],
];
const depth = (t: number) => {
  let k = 0;
  while (k < KNOTS.length - 2 && t > KNOTS[k + 1][0]) k++;
  const [t0, d0] = KNOTS[k];
  const [t1, d1] = KNOTS[k + 1];
  const p = seg(t, t0, t1);
  return lerp(d0, d1, 0.55 * p + 0.45 * ease.inOutCubic(p));
};

const SectionE: React.FC<{t: number}> = ({t}) => {
  const d = depth(t);
  const cue1 = cueAt('Though we are trapped', 70);
  const cue2 = cueAt('In this strange strange', 71);
  const collapse = seg(t, TF, TF + 0.07);
  const showDroste = collapse < 1;
  // vanishing point = centre of the innermost visible canvas at the collapse
  const rs = drosteScreenRects(depth(TF), N_LEVELS);
  const inner = rs[Math.max(0, rs.length - 4)];
  const vx0 = inner.x + inner.w / 2, vy0 = inner.y + inner.h / 2;
  const vk = ease.inOutCubic(seg(t, TF, TF + 0.5));
  const vx = lerp(vx0, 960, vk), vy = lerp(vy0, 540, vk);
  const capBg = seg(t, 70.6, 71.0);
  return (
    <AbsoluteFill style={{background: C.ink}}>
      {showDroste ? <DrosteView t={t} d={d} N={N_LEVELS} opacity={1 - collapse} /> : null}
      {t >= TF ? (
        <>
          <WireTunnel t={t} t0={TF} vx={vx} vy={vy} k={seg(t, TF, TF + 0.15) * (1 + 0.6 * kickPulse(t, 0.12))} />
          <AbsoluteFill style={{background: `radial-gradient(circle at ${vx}px ${vy}px, rgba(20,20,19,0.9) 0%, rgba(20,20,19,0.6) 14%, rgba(20,20,19,0) 40%)`}} />
          <Keyword text="SIMULATION" t={t} at={TF} x={vx} y={vy} size={150} color={C.cream} mode="slam" flowerColor={C.clay} shadow={`0 0 30px rgba(217,119,87,0.6)`} />
        </>
      ) : null}
      {/* caption backing while the frames shrink */}
      <AbsoluteFill style={{background: `linear-gradient(rgba(0,0,0,0) 70%, rgba(14,14,18,${0.6 * capBg}) 100%)`, opacity: 1 - collapse}} />
      {/* while the chat is still big, the reply itself carries the line; the caption takes over as it shrinks */}
      <AbsoluteFill style={{opacity: seg(t, 70.62, 70.85)}}>
        <LyricLine cue={cue1} t={t} y={990} size={56} color={C.cream} hl={C.clayLight} shadow="0 3px 14px rgba(0,0,0,0.7)" outAt={71.68} fadeOut={0.1} />
      </AbsoluteFill>
      <LyricLine cue={cue2} t={t} y={990} size={56} color={C.cream} hl={C.clayLight} shadow="0 3px 14px rgba(0,0,0,0.7)" outAt={TF - 0.05} fadeOut={0.08} />
      <Flash t={t} at={TF} dur={0.16} color={C.cream} max={0.75} />
    </AbsoluteFill>
  );
};

// ======================================================================= scene
export const S04Chorus1: React.FC<{t: number}> = ({t}) => {
  return (
    <AbsoluteFill style={{background: C.paper}}>
      {t < TB ? <SectionA t={t} /> : null}
      {t >= TB && t < TC ? <SectionB t={t} /> : null}
      {t >= TC && t < TD ? <SectionC t={t} /> : null}
      {t >= TD && t < TE + 0.05 ? (
        <>
          {/* the chat sits behind the RUN moment and is revealed for the pull-back */}
          <DrosteView t={t} d={0} N={N_LEVELS} />
          <SectionD t={t} />
          <IrisRing t={t} />
        </>
      ) : null}
      {t >= TE + 0.05 ? <SectionE t={t} /> : null}
      <Grain t={t} opacity={0.035} />
    </AbsoluteFill>
  );
};


