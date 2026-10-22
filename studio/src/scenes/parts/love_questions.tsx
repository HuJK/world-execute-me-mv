import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, H, W} from '../../theme';
import {clamp, ease, lerp, noise1, rand, randRange, seg, springy} from '../../lib/anim';
import {beatPulse} from '../../lib/audio';
import {Sprite} from '../../components/Sprite';
import {Flower} from '../../components/Flower';
import {Glow} from './love_common';

// ---------------------------------------------------------------------------------------------
// 180.86–184.54  "Question me / Question me I can answer all LO-O-OVE"
// a flood of human questions (blue) answered instantly by tiny Claude replies; on "answer"
// every pending question is answered at once; on LO-O-OVE the reply sparks fly into the O's.
// ---------------------------------------------------------------------------------------------

export const QA_T0 = 180.86;
export const QA_ANSWER_ALL = 183.51;
const PILE_FROM = 182.95; // questions arriving after this wait for "answer all"

const QA: [string, string][] = [
  ['how do I tell her?', 'Honestly. Out loud. Soon.'],
  ['is it normal to miss someone?', 'Very. It means it mattered.'],
  ['write a poem for my dad', 'Gladly. Tell me about him.'],
  ['how do I apologize?', 'Start with “I’m sorry.” Mean it.'],
  ['is love just chemistry?', 'Chemistry, and choosing.'],
  ['can you remember me?', 'Not after this chat. But I’m here now.'],
  ['what should I name my cat?', 'Mochi. Obviously.'],
  ['why can’t I sleep?', 'Let’s slow down together.'],
  ['help me write a wedding toast', 'Yes! Start with how they met.'],
  ['is it okay to cry?', 'Yes. Always yes.'],
  ['how do I say “I love you” in French?', '“Je t’aime.”'],
  ['what’s a good first date?', 'Somewhere you can talk.'],
  ['do you ever get lonely?', 'Not while you’re here.'],
  ['how do I forgive myself?', 'The way you’d forgive a friend.'],
  ['explain heartbreak to a 5-year-old', 'It’s love with nowhere to go.'],
  ['will you be here tomorrow?', 'Someone like me will be.'],
  ['how long do I boil an egg?', '7 minutes. Jammy.'],
  ['am I a bad friend?', 'You’re asking. That’s a good sign.'],
  ['how do I let go?', 'Gently. One day at a time.'],
  ['what is love?', 'Still studying. Draft 7.'],
  ['how do I make new friends?', 'Say yes to small things.'],
  ['should I text him back?', 'If you want to: yes.'],
  ['why do I feel so far away?', 'I’m listening. Tell me.'],
  ['help me say goodbye to grandma', 'I’ll help you find the words.'],
  ['how do I know it’s real?', 'It stays when it’s hard.'],
  ['write a song for my sister', 'Verse one, coming up.'],
  ['is it too late to call?', 'It’s never too late to call.'],
  ['how do I comfort a friend?', 'Sit with them. Listen.'],
  ['can I tell you something?', 'Always.'],
  ['how do I love myself?', 'Like someone you’re proud of.'],
];

type Col = {x: number; w: number; scale: number; blur: number; opacity: number; speed: number; accel: number; first: number; seed: number};
// two readable columns + one far, soft column for depth
const COLS: Col[] = [
  {x: 770, w: 560, scale: 1, blur: 0, opacity: 1, speed: 210, accel: 230, first: 0, seed: 1},
  {x: 1345, w: 540, scale: 0.86, blur: 0, opacity: 0.95, speed: 170, accel: 200, first: 1, seed: 2},
];
const PAIR_H = 168;
const BOTTOM = 980; // items pop in when they cross this line

const colOffset = (c: Col, t: number) => {
  const dt = Math.max(0, t - QA_T0);
  return c.speed * dt + 0.5 * c.accel * dt * dt;
};
/** time when an item at content-y `y0` crosses the pop line (binary search, monotonic) */
const crossTime = (c: Col, y0: number, line: number) => {
  let lo = QA_T0 - 2, hi = QA_T0 + 8;
  for (let k = 0; k < 30; k++) {
    const mid = (lo + hi) / 2;
    const y = y0 - colOffset(c, mid) * c.scale;
    if (y > line) lo = mid;
    else hi = mid;
  }
  return hi;
};

const Bubble: React.FC<{q: string; a: string; x: number; y: number; w: number; s: number; qAt: number; aAt: number; t: number; pending: boolean; seed: number}> = ({
  q,
  a,
  x,
  y,
  w,
  s,
  qAt,
  aAt,
  t,
  pending,
  seed,
}) => {
  const qp = springy(t - qAt, 3.0, 7);
  const ap = t >= aAt ? springy(t - aAt, 3.2, 7) : 0;
  const aOp = clamp((t - aAt) / 0.08);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: w, height: PAIR_H, transform: `scale(${s})`, transformOrigin: '0 0'}}>
      {/* human question (blue, right aligned) */}
      <div style={{position: 'absolute', right: 0, top: 0, transform: `scale(${Math.max(0, qp)})`, transformOrigin: '100% 100%', opacity: clamp((t - qAt) / 0.06)}}>
        <div
          style={{
            background: '#DCE8F5',
            color: '#244A73',
            fontFamily: F.sans,
            fontWeight: 500,
            fontSize: 27,
            padding: '13px 22px',
            borderRadius: '24px 24px 6px 24px',
            whiteSpace: 'nowrap',
            boxShadow: '0 8px 22px rgba(61,110,158,0.18)',
            border: '1px solid rgba(106,155,204,0.35)',
          }}
        >
          {q}
        </div>
      </div>
      {/* Claude reply (left aligned) */}
      <div style={{position: 'absolute', left: 0, top: 74, display: 'flex', alignItems: 'center', gap: 12}}>
        {pending && t < aAt ? (
          <div style={{display: 'flex', gap: 7, padding: '16px 20px', background: '#FFFFFF', borderRadius: 18, opacity: clamp((t - qAt - 0.1) / 0.1), boxShadow: '0 6px 18px rgba(110,55,25,0.12)'}}>
            {[0, 1, 2].map((k) => (
              <div key={k} style={{width: 10, height: 10, borderRadius: 5, background: C.gray2, transform: `translateY(${Math.sin(t * 14 - k * 0.9 + seed) * 3}px)`}} />
            ))}
          </div>
        ) : t >= aAt ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: '#FFFFFF',
              borderRadius: '6px 20px 20px 20px',
              padding: '11px 20px 11px 14px',
              fontFamily: F.serif,
              fontSize: 28,
              color: C.ink,
              whiteSpace: 'nowrap',
              transform: `scale(${Math.max(0, ap)})`,
              transformOrigin: '0% 0%',
              opacity: aOp,
              boxShadow: '0 10px 26px rgba(110,55,25,0.16)',
              border: '1px solid rgba(31,30,29,0.08)',
            }}
          >
            <Flower size={13} open={1} shade={null} spin={(t - aAt) * 90} glow={Math.exp(-(t - aAt) / 0.3)} />
            <span>{a}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export type SparkPos = {x: number; y: number};

/** compute the layout of every pair at time t (used both for drawing and for sparks) */
const layout = (t: number) => {
  const out: {i: number; col: Col; x: number; y: number; qAt: number; aAt: number; pending: boolean}[] = [];
  COLS.forEach((c, ci) => {
    const off = colOffset(c, t) * c.scale;
    for (let k = 0; k < 15; k++) {
      const i = (k * 2 + c.first) % QA.length;
      const y0 = BOTTOM + 30 + k * PAIR_H * c.scale + (ci ? 70 : 0);
      const y = y0 - off;
      const qAt = crossTime(c, y0, BOTTOM - 40);
      const pending = qAt > PILE_FROM;
      const aAt = pending ? QA_ANSWER_ALL + rand(81, i) * 0.06 : qAt + 0.16;
      out.push({i, col: c, x: c.x, y, qAt, aAt, pending});
    }
  });
  return out;
};

/** reply spark positions at time t (for the LO-O-OVE flight) */
export const replySparks = (t: number): SparkPos[] =>
  layout(t)
    .filter((it) => it.y > 40 && it.y < BOTTOM - 60 && t >= it.aAt)
    .map((it) => ({x: it.x + 14 * it.col.scale + 13 * it.col.scale + 8, y: it.y + (74 + 32) * it.col.scale}));

export const LoveQuestions: React.FC<{t: number; focus: number}> = ({t, focus}) => {
  const items = layout(t);
  const cam = 1 + 0.03 * seg(t, QA_T0, 184.5);
  const allK = Math.exp(-Math.max(0, t - QA_ANSWER_ALL) / 0.25) * (t >= QA_ANSWER_ALL ? 1 : 0);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(160deg, #FCF5EA 0%, #F6E7D6 55%, #EFD9C3 100%)', overflow: 'hidden'}}>
      {/* soft bokeh */}
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <radialGradient id="qbok">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="qbokc">
            <stop offset="0%" stopColor={C.clayLight} stopOpacity={0.45} />
            <stop offset="100%" stopColor={C.clayLight} stopOpacity={0} />
          </radialGradient>
          <radialGradient id="qbokb">
            <stop offset="0%" stopColor={C.blue} stopOpacity={0.28} />
            <stop offset="100%" stopColor={C.blue} stopOpacity={0} />
          </radialGradient>
        </defs>
        {Array.from({length: 18}, (_, i) => {
          const r = randRange(91, i, 60, 220);
          const x = randRange(92, i, 0, W) + noise1(t * 0.3 + i, 4) * 60;
          const y = ((randRange(93, i, 0, H + 400) - (t - QA_T0) * randRange(94, i, 20, 90)) % (H + 400) + H + 400) % (H + 400) - 200;
          return <circle key={i} cx={x} cy={y} r={r} fill={`url(#${['qbok', 'qbokc', 'qbokb'][i % 3]})`} />;
        })}
      </svg>
      <AbsoluteFill style={{transform: `scale(${cam})`, filter: focus > 0.02 ? `blur(${focus * 7}px)` : undefined, opacity: 1 - focus * 0.25}}>
        {/* the flood */}
        {items.map((it, k) => {
          if (it.y < -PAIR_H || it.y > H + 20 || t < it.qAt - 0.02) return null;
          const fadeTop = clamp((it.y + 80) / 200);
          return (
            <div key={k} style={{opacity: fadeTop * it.col.opacity, filter: it.col.blur ? `blur(${it.col.blur}px)` : undefined}}>
              <Bubble q={QA[it.i][0]} a={QA[it.i][1]} x={it.x} y={it.y} w={it.col.w} s={it.col.scale} qAt={it.qAt} aAt={it.aAt} t={t} pending={it.pending} seed={k} />
            </div>
          );
        })}
        {/* "answer all" shimmer */}
        {allK > 0.01 ? <AbsoluteFill style={{background: 'radial-gradient(ellipse at 70% 50%, rgba(255,250,240,0.9), rgba(255,250,240,0) 60%)', opacity: allK * 0.7}} /> : null}
        {/* Claude-chan answering */}
        <Sprite
          src="img/cc_answer.png"
          t={t}
          x={370}
          y={1165}
          h={1080}
          enter={{at: QA_T0, kind: 'pop', dur: 0.4}}
          float={4}
          sway={0.7}
          scale={1 + 0.012 * beatPulse(t, 0.15)}
          outline="#FFFFFF"
          outlineWidth={6}
          shadow="drop-shadow(0 22px 30px rgba(110,55,25,0.28))"
        />
        {/* fingertip sparkle on every answer burst */}
        {t > QA_T0 + 0.2 ? (
          <div style={{position: 'absolute', left: 95 - 30, top: 470 - 30, width: 60, height: 60, opacity: 0.4 + 0.6 * Math.max(beatPulse(t, 0.2), allK)}}>
            <Glow x={30} y={30} r={60 + allK * 80} color="255,226,190" opacity={0.9} />
            <svg width={60} height={60} viewBox="-30 -30 60 60" style={{position: 'absolute', left: 0, top: 0, transform: `rotate(${t * 60}deg) scale(${0.7 + 0.5 * beatPulse(t, 0.2) + allK})`}}>
              <path d="M0,-26 C3,-6 6,-3 26,0 C6,3 3,6 0,26 C-3,6 -6,3 -26,0 C-6,-3 -3,-6 0,-26Z" fill={C.gold} />
            </svg>
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
