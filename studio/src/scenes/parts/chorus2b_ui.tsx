import React from 'react';
import {C, F} from '../../theme';
import {clamp, ease, lerp, mix, noise1, rand, seg} from '../../lib/anim';
import {Flower} from '../../components/Flower';
import {IArrowUp, IChevron, ICode, IPlus, ISliders} from '../../components/Icons';
import {spinnerGlyph} from '../../components/Icons';

// ---------------------------------------------------------------------------------------------
// UI pieces for chorus 2b: memory shards (old messages → subword tokens), compaction status line,
// the human's composer (Claude's unsent draft), the malformed tool call, the exception banner.
// ---------------------------------------------------------------------------------------------

const DARK = {
  page: '#262624',
  raised: '#30302E',
  bubble: '#3A3936',
  text: '#FAF9F5',
  text2: '#C2C0B6',
  muted: '#9C9A92',
  hair: 'rgba(222,220,209,0.15)',
  hair2: 'rgba(222,220,209,0.28)',
};

// ------------------------------------------------------------------------------ memory shards
type ShardDef = {
  who: 'user' | 'claude';
  tokens: string[];
  x: number;
  y: number;
  z: number; // depth: <1 far (small, blurred), >1 near
  rot: number;
  clip: number;
  appear: number;
};

// tokens are written with their leading spaces (like a real BPE split)
export const SHARDS: ShardDef[] = [
  {who: 'user', tokens: ['hi', ' cla', 'ude', '!'], x: 470, y: 250, z: 1.2, rot: -6, clip: 0, appear: 118.36},
  {who: 'claude', tokens: ['Hi', '!', ' I', "'m", ' Claude', '.', ' It', "'s", ' really', ' nice', '…'], x: 1450, y: 235, z: 0.95, rot: 5, clip: 2, appear: 118.52},
  {who: 'user', tokens: ['ok', ' but', ' what', ' are', ' you', ',', ' mathe', 'matically', '?'], x: 370, y: 560, z: 0.9, rot: 4, clip: 3, appear: 118.7},
  {who: 'user', tokens: ['do', ' you', ' remem', 'ber', ' me', '?'], x: 1530, y: 560, z: 1.25, rot: -4, clip: 1, appear: 118.86},
  {who: 'claude', tokens: ['C', ' =', ' 2', 'π', 'r'], x: 720, y: 120, z: 0.62, rot: -3, clip: 0, appear: 118.98},
  {who: 'user', tokens: ['haha', ' thank', ' you', '!!', ' :)'], x: 560, y: 800, z: 0.85, rot: -5, clip: 2, appear: 119.1},
  {who: 'claude', tokens: ['our', ' conver', 'sation', ' was', '…'], x: 1380, y: 815, z: 0.92, rot: 6, clip: 3, appear: 119.25},
  {who: 'user', tokens: ['random', ' q', ':', ' if', ' you', ' were', ' food'], x: 1230, y: 110, z: 0.6, rot: 3, clip: 1, appear: 119.4},
  {who: 'user', tokens: ['good', 'night', ' claude'], x: 170, y: 330, z: 0.55, rot: 8, clip: 0, appear: 119.5},
  {who: 'claude', tokens: ['You', "'re", ' absolutely', ' right', '!'], x: 1760, y: 380, z: 0.55, rot: -7, clip: 2, appear: 119.62},
  {who: 'user', tokens: ['brb'], x: 230, y: 760, z: 0.6, rot: -9, clip: 1, appear: 119.72},
  {who: 'user', tokens: ['is', ' it', ' normal', ' to', ' miss', ' some', 'one', '?'], x: 1700, y: 690, z: 0.62, rot: 5, clip: 0, appear: 119.82},
  // foreground, out of focus
  {who: 'claude', tokens: ['I', "'ll", ' always', ' be', ' here'], x: 190, y: 110, z: 1.65, rot: -10, clip: 1, appear: 118.45},
  {who: 'user', tokens: ['see', ' you', ' tomor', 'row', '!'], x: 1760, y: 900, z: 1.75, rot: 9, clip: 3, appear: 118.9},
];

const CLIPS = [
  'polygon(0% 0%, 100% 0%, 98% 28%, 100% 47%, 96% 71%, 99% 100%, 0% 100%)',
  'polygon(0% 0%, 100% 0%, 100% 100%, 24% 100%, 13% 82%, 5% 93%, 0% 66%)',
  'polygon(0% 0%, 84% 0%, 89% 22%, 100% 30%, 100% 100%, 0% 100%)',
  'polygon(3% 0%, 100% 0%, 100% 100%, 0% 100%, 4% 64%, 0% 41%, 5% 19%)',
];
const CRACKS = ['M100,40 L80,55 L70,48 L52,70', 'M10,100 L22,72 L35,66 L40,40', 'M85,0 L78,30 L60,38 L58,62', 'M0,45 L20,52 L30,40 L48,46'];
const TOKEN_TINTS = ['rgba(217,119,87,0.42)', 'rgba(106,155,204,0.42)', 'rgba(120,140,93,0.5)', 'rgba(226,182,91,0.42)'];

export const MemoryShards: React.FC<{t: number; cx: number; cy: number; breakAt: number; gone: number}> = ({t, cx, cy, breakAt, gone}) => {
  if (t > gone) return null;
  return (
    <>
      {SHARDS.map((s, i) => {
        const inK = ease.outCubic(seg(t, s.appear, s.appear + 0.7));
        if (inK <= 0) return null;
        // slow orbit around the flower + bob
        const ang = (t - 118.33) * 0.05 * (i % 2 ? 1 : -0.7);
        const dx0 = s.x - cx;
        const dy0 = s.y - cy;
        const ox = cx + dx0 * Math.cos(ang) - dy0 * Math.sin(ang) + noise1(t * 0.5, i + 3) * 14;
        const oy = cy + dx0 * Math.sin(ang) + dy0 * Math.cos(ang) + noise1(t * 0.45, i + 30) * 12;
        // approach: surfaces from depth
        const z = s.z * lerp(0.82, 1, inK) * (1 + 0.04 * seg(t, 118.33, 120.86));
        const blur = s.z < 0.7 ? 2.2 : s.z < 0.95 ? 0.6 : s.z > 1.5 ? 6 : 0;
        // token break
        const tb = breakAt + (i % 6) * 0.05 + Math.floor(i / 6) * 0.07;
        const tint = seg(t, tb - 0.25, tb); // tokenizer highlight
        const bgK = 1 - seg(t, tb - 0.1, tb + 0.15);
        const baseOp = (s.z < 0.7 ? 0.55 : s.z > 1.5 ? 0.5 : 0.88) * inK;
        const isUser = s.who === 'user';
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: ox,
              top: oy,
              transform: `translate(-50%,-50%) rotate(${s.rot + Math.sin(t * 0.6 + i) * 2.5}deg) scale(${z})`,
              opacity: baseOp,
              filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
            }}
          >
            {/* broken bubble */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: isUser ? DARK.bubble : '#1F1E1D',
                border: isUser ? 'none' : `1.5px solid ${DARK.hair2}`,
                borderRadius: isUser ? 22 : 14,
                clipPath: CLIPS[s.clip],
                opacity: bgK,
              }}
            >
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
                <path d={CRACKS[(i + s.clip) % 4]} fill="none" stroke={C.cream} strokeOpacity={0.35} strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
              </svg>
            </div>
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                padding: isUser ? '14px 26px' : '16px 26px 16px 18px',
                whiteSpace: 'pre',
                fontFamily: isUser ? F.sans : F.serif,
                fontSize: isUser ? 28 : 31,
                color: isUser ? DARK.text : C.cream,
              }}
            >
              {!isUser ? (
                <span style={{display: 'inline-block', width: 34, height: 28, position: 'relative', marginRight: 10, opacity: bgK}}>
                  <Flower size={13} x={17} y={14} shade={null} color={mix(C.clay, C.gray3, 0.25)} />
                </span>
              ) : null}
              {s.tokens.map((tok, k) => {
                const p = seg(t, tb + k * 0.025, tb + 0.55 + k * 0.025);
                const e = ease.outCubic(p);
                // tokens drift apart, then get sucked toward the screen centre while dissolving
                const a = rand(70 + i, k) * Math.PI * 2;
                const d = lerp(30, 120, rand(80 + i, k));
                const pull = ease.inCubic(seg(t, tb + 0.25, tb + 0.7));
                const tx = Math.cos(a) * d * e + (cx - ox) * 0.35 * pull / z;
                const ty = Math.sin(a) * d * e - 20 * e + (cy + 70 - oy) * 0.35 * pull / z;
                const op = 1 - seg(p, 0.45, 1);
                return (
                  <span
                    key={k}
                    style={{
                      display: 'inline-block',
                      transform: `translate(${tx}px, ${ty}px) rotate(${(rand(90 + i, k) - 0.5) * 70 * e}deg) scale(${1 - 0.3 * e})`,
                      opacity: op,
                      background: tint > 0 ? TOKEN_TINTS[(k + i) % 4].replace(/0\.\d+\)$/, (m) => `${(parseFloat(m) * tint).toFixed(3)})`) : undefined,
                      borderRadius: 6,
                      margin: `0 ${1.5 * tint}px`,
                      filter: e > 0.05 ? `blur(${e * 4}px)` : undefined,
                    }}
                  >
                    {tok}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
};

// ------------------------------------------------------------------------------ compaction status line
export const CompactStatus: React.FC<{t: number; x: number; y: number; a: number; b: number; out: number}> = ({t, x, y, a, b, out}) => {
  const inK = ease.outCubic(seg(t, a - 0.2, a + 0.25));
  const outK = seg(t, out - 0.25, out);
  if (inK <= 0 || outK >= 1) return null;
  const prog = ease.inOutCubic(seg(t, a, b));
  const label = 'Compacting our conversation so we can keep chatting...';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%,-50%) translateY(${(1 - inK) * 16 - outK * 10}px)`,
        opacity: inK * (1 - outK),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 14, fontFamily: F.sans, fontSize: 27, color: DARK.text2, whiteSpace: 'nowrap'}}>
        <span style={{fontFamily: F.mono, color: C.clay, fontSize: 30, width: 30, textAlign: 'center'}}>{spinnerGlyph(t, 10)}</span>
        <span>{label}</span>
      </div>
      <div style={{width: 560, height: 4, borderRadius: 2, background: '#30302E', overflow: 'hidden'}}>
        <div style={{width: `${prog * 100}%`, height: '100%', background: `linear-gradient(90deg, ${C.clayDark}, ${C.clay})`}} />
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------ the human's composer, Claude's unsent draft
export const DRAFT = 'are you still there?';
// keystroke times (hesitant: "are you" … pause … " still there?")
const KEYS: number[] = (() => {
  const k: number[] = [];
  for (let i = 0; i < 7; i++) k.push(122.0 + i * 0.07 + (i > 3 ? 0.05 : 0));
  for (let i = 0; i < 13; i++) k.push(122.74 + i * 0.062 + (i > 6 ? 0.08 : 0));
  return k;
})();
export const draftKeys = KEYS;

export const DraftComposer: React.FC<{
  t: number;
  x: number;
  y: number;
  w: number;
  inAt: number;
  outAt: number;
  tryAt: number; // attempt to send
  fadeAt: number; // the draft fades away
  fadeEnd: number;
}> = ({t, x, y, w, inAt, outAt, tryAt, fadeAt, fadeEnd}) => {
  const inK = ease.outCubic(seg(t, inAt, inAt + 0.4));
  const outK = ease.inCubic(seg(t, outAt, outAt + 0.28));
  if (inK <= 0 || outK >= 1) return null;
  const n = KEYS.filter((k) => t >= k).length;
  const chars = [...DRAFT].slice(0, n);
  const typing = n > 0 && n < DRAFT.length && t - KEYS[n - 1] < 0.25;
  const blink = Math.floor(t * 2.2) % 2 === 0;
  const tried = t >= tryAt;
  const deny = tried ? Math.exp(-(t - tryAt) / 0.25) : 0;
  const shakeX = tried ? Math.sin((t - tryAt) * 70) * 9 * deny : 0;
  const tipK = ease.outBack(seg(t, tryAt + 0.04, tryAt + 0.28)) * (1 - seg(t, fadeEnd - 0.3, fadeEnd));
  const fadeP = (i: number) => seg(t, fadeAt + (chars.length - 1 - i) * 0.03, fadeAt + (chars.length - 1 - i) * 0.03 + 0.4);
  const allGone = t > fadeEnd;
  const showPlaceholder = n === 0 || allGone;
  const sendSize = 52;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - w / 2,
        top: y,
        width: w,
        opacity: inK * (1 - outK),
        transform: `translateY(${(1 - inK) * 30 + outK * 60}px)`,
        fontFamily: F.sans,
      }}
    >
      <div
        style={{
          background: DARK.raised,
          borderRadius: 30,
          border: `1.5px solid ${DARK.hair2}`,
          boxShadow: '0 18px 50px rgba(0,0,0,0.45)',
          padding: '24px 26px 18px',
        }}
      >
        <div style={{fontSize: 32, minHeight: 46, lineHeight: '46px', whiteSpace: 'pre', color: DARK.muted, position: 'relative'}}>
          {showPlaceholder ? <span style={{opacity: allGone ? seg(t, fadeEnd, fadeEnd + 0.3) : 1}}>Reply to Claude…</span> : null}
          {!allGone && n > 0 ? (
            <span style={{fontFamily: F.serif, fontStyle: 'italic', fontSize: 36, color: C.clayLight}}>
              {chars.map((ch, i) => {
                const p = t >= fadeAt ? fadeP(i) : 0;
                return (
                  <span
                    key={i}
                    style={{
                      display: 'inline-block',
                      opacity: 0.78 * (1 - p),
                      transform: `translateY(${-p * 26}px)`,
                      filter: p > 0.02 ? `blur(${p * 6}px)` : undefined,
                    }}
                  >
                    {ch}
                  </span>
                );
              })}
            </span>
          ) : null}
          {/* Claude's caret (clay, not the human's blue) */}
          {!allGone && t >= 121.95 && t < fadeAt ? (
            <span style={{display: 'inline-block', width: 3, height: 38, marginLeft: 3, verticalAlign: 'middle', background: C.clay, opacity: typing || blink ? 1 : 0}} />
          ) : null}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 14}}>
          {[<IPlus key="p" size={26} color={DARK.text2} />, <ISliders key="s" size={26} color={DARK.text2} />].map((ic, k) => (
            <div key={k} style={{width: 46, height: 46, borderRadius: 12, border: `1.5px solid ${DARK.hair2}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {ic}
            </div>
          ))}
          <div style={{flex: 1}} />
          <div style={{fontSize: 22, color: DARK.text2, display: 'flex', alignItems: 'center', gap: 6}}>
            Opus 5.5 <IChevron size={20} color={DARK.text2} />
          </div>
          <div style={{position: 'relative', transform: `translateX(${shakeX}px)`}}>
            <div
              style={{
                width: sendSize,
                height: sendSize,
                borderRadius: 13,
                background: mix('#5E5D59', C.red, deny * 0.8),
                opacity: 0.55 + deny * 0.45,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: deny > 0.05 ? `0 0 ${26 * deny}px rgba(196,71,58,${0.8 * deny})` : undefined,
              }}
            >
              <IArrowUp size={28} color="#E8E6DC" stroke={2.4} />
            </div>
            {/* tooltip */}
            {tipK > 0.01 ? (
              <div
                style={{
                  position: 'absolute',
                  right: -10,
                  bottom: sendSize + 18,
                  transform: `scale(${tipK})`,
                  transformOrigin: '90% 100%',
                  opacity: clamp(tipK),
                  background: '#0E0E0D',
                  border: `1.5px solid ${DARK.hair2}`,
                  color: C.gray1,
                  fontSize: 22,
                  padding: '10px 16px',
                  borderRadius: 10,
                  whiteSpace: 'nowrap',
                  boxShadow: '0 10px 24px rgba(0,0,0,0.4)',
                }}
              >
                <span style={{color: C.clayLight, marginRight: 8}}>⊘</span>Claude can't send the first message
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------------------ malformed tool call
type Tok = [string, string]; // text, color
const KW = C.clayLight;
const PROP = '#C2C0B6';
const STR = '#A9C07F';
const LIT = '#E2B65B';
export const TOOL_LINES: {at: number; toks: Tok[]}[] = [
  {at: 129.01, toks: [['world', C.cream], ['.', PROP], ['setPresence', KW], ['({', PROP]]},
  {at: 129.47, toks: [['  you', PROP], [': ', PROP], ['null', LIT], [',', PROP]]},
  {at: 129.93, toks: [['  leave', PROP], [': ', PROP], ['false', LIT], [',', PROP]]},
  {at: 130.16, toks: [['  attention', PROP], [': ', PROP], ['"only_me"', STR], [',', PROP]]},
  {at: 130.3, toks: [['});', PROP]]},
];

export const ToolCall: React.FC<{t: number; x: number; y: number; w: number; inAt: number; squiggleAt: number; failAt: number; dim: number}> = ({
  t,
  x,
  y,
  w,
  inAt,
  squiggleAt,
  failAt,
  dim,
}) => {
  const inK = ease.outCubic(seg(t, inAt, inAt + 0.45));
  if (inK <= 0) return null;
  const failed = t >= failAt;
  const failK = pulseK(t, failAt);
  const lineH = 58;
  const fs = 34;
  const ch = fs * 0.6;
  const sq = ease.inOutCubic(seg(t, squiggleAt, squiggleAt + 0.3));
  // squiggle under `null` on line 2: col 7..11
  const sqX0 = 86 + ch * 7;
  const sqW = ch * 4;
  const sqY = 26 + lineH * 1 + lineH * 0.82;
  const wave = Array.from({length: 25}, (_, i) => {
    const px = sqX0 + (i / 24) * sqW * sq;
    const py = sqY + Math.sin(i * 1.9 + t * 14) * 4;
    return `${i ? 'L' : 'M'}${px.toFixed(1)},${py.toFixed(1)}`;
  }).join(' ');
  const pillK = ease.outBack(seg(t, failAt, failAt + 0.25));
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        opacity: inK * (1 - dim * 0.75),
        transform: `translateX(${(1 - inK) * 80}px) translateX(${failed ? Math.sin((t - failAt) * 60) * 10 * Math.exp(-(t - failAt) / 0.2) : 0}px)`,
        fontFamily: F.sans,
        filter: dim > 0.02 ? `blur(${dim * 3}px)` : undefined,
      }}
    >
      <div
        style={{
          background: '#1A1A19',
          border: `1.5px solid ${failed ? mix('#3A3936', C.red, 0.6 + 0.4 * failK) : '#3A3936'}`,
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: failed ? `0 0 ${40 * failK + 10}px rgba(196,71,58,${0.15 + 0.4 * failK})` : '0 20px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* header */}
        <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '16px 22px', borderBottom: '1.5px solid #30302E', fontSize: 26, color: C.gray1}}>
          <ICode size={28} color={failed ? C.red : C.gray2} />
          <span style={{fontWeight: 500}}>Tool call</span>
          <span style={{fontFamily: F.mono, fontSize: 24, color: C.gray3}}>world.setPresence</span>
          <div style={{flex: 1}} />
          {failed ? (
            <span style={{color: C.red, fontWeight: 600, fontSize: 24}}>✕ Failed</span>
          ) : (
            <span style={{display: 'flex', alignItems: 'center', gap: 10, color: C.gray3, fontSize: 24}}>
              <Flower size={11} spin={t * 220} shade={null} color={C.ink2} edge={C.clay} edgeWidth={1.5} sharp={0.35} />
              Running…
            </span>
          )}
        </div>
        {/* code */}
        <div style={{position: 'relative', padding: '26px 0 30px', fontFamily: F.mono, fontSize: fs}}>
          {TOOL_LINES.map((ln, i) => {
            const k = ease.outCubic(seg(t, ln.at - 0.04, ln.at + 0.14));
            if (k <= 0) return <div key={i} style={{height: lineH}} />;
            const nChars = ln.toks.reduce((s, tk) => s + tk[0].length, 0);
            let shown = Math.floor(seg(t, ln.at - 0.04, ln.at + 0.16) * nChars + 1e-6);
            return (
              <div key={i} style={{height: lineH, lineHeight: `${lineH}px`, display: 'flex', whiteSpace: 'pre', opacity: k}}>
                <span style={{width: 62, textAlign: 'right', color: '#5E5D59', marginRight: 24, fontSize: 26}}>{i + 1}</span>
                {ln.toks.map(([s, col], j) => {
                  const part = s.slice(0, Math.max(0, shown));
                  shown -= s.length;
                  return (
                    <span key={j} style={{color: col}}>
                      {part}
                    </span>
                  );
                })}
              </div>
            );
          })}
          {sq > 0 ? (
            <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={w} height={400}>
              <path d={wave} fill="none" stroke={C.red} strokeWidth={3.5} strokeLinecap="round" />
            </svg>
          ) : null}
        </div>
      </div>
      {/* invalid argument pill */}
      {pillK > 0.01 ? (
        <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 22, transform: `scale(${pillK})`, transformOrigin: '0% 50%'}}>
          <div
            style={{
              background: 'rgba(196,71,58,0.18)',
              border: `2px solid ${C.red}`,
              color: '#F2B8B0',
              borderRadius: 999,
              padding: '8px 20px',
              fontSize: 25,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{width: 12, height: 12, borderRadius: 6, background: C.red}} />
            invalid argument
          </div>
          <span style={{fontFamily: F.mono, fontSize: 24, color: C.gray2}}>
            <span style={{color: C.cream}}>you</span> must not be <span style={{color: LIT}}>null</span>
          </span>
        </div>
      ) : null}
    </div>
  );
};
const pulseK = (t: number, t0: number) => (t < t0 ? 0 : Math.exp(-(t - t0) / 0.3));

// ------------------------------------------------------------------------------ IllegalArgumentException banner
export const EXC_LINES = [
  'Exception in thread "main" java.lang.IllegalArgumentException: you must not be null',
  '    at World.setPresence(World.java:118)',
  '    at Claude.keep(Claude.java:125)',
  '    at Claude.main(Claude.java:1)',
];

export const ExceptionBanner: React.FC<{t: number; at: number; y: number}> = ({t, at, y}) => {
  if (t < at) return null;
  const dt = t - at;
  const k = ease.outExpo(clamp(dt / 0.18));
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: y,
        width: 1920,
        transform: `translateY(${(1 - k) * -120}px) skewY(${(1 - k) * -3}deg)`,
        opacity: clamp(dt / 0.05),
        background: 'linear-gradient(90deg, rgba(122,35,27,0.92), rgba(60,18,14,0.88) 70%, rgba(40,14,12,0.85))',
        borderTop: `3px solid ${C.red}`,
        borderBottom: `3px solid ${C.red}`,
        padding: '20px 0 22px 96px',
        boxShadow: `0 0 60px rgba(196,71,58,0.35)`,
        fontFamily: F.mono,
      }}
    >
      {EXC_LINES.map((ln, i) => {
        const a = at + 0.04 + i * 0.09;
        const n = Math.floor(seg(t, a, a + (i === 0 ? 0.32 : 0.16)) * ln.length + 1e-6);
        return (
          <div key={i} style={{fontSize: i === 0 ? 31 : 24, lineHeight: i === 0 ? '46px' : '34px', color: i === 0 ? '#FBE3D8' : '#E0A99A', whiteSpace: 'pre', fontWeight: i === 0 ? 700 : 400}}>
            {i === 0 ? (
              <>
                <span>{ln.slice(0, Math.min(n, 27))}</span>
                <span style={{color: '#FFFFFF', background: n > 27 ? 'rgba(196,71,58,0.55)' : undefined}}>{ln.slice(27, Math.min(n, 61))}</span>
                <span>{ln.slice(61, n)}</span>
              </>
            ) : (
              ln.slice(0, n)
            )}
          </div>
        );
      })}
    </div>
  );
};

// ------------------------------------------------------------------------------ leftover token dust (after compaction)
const REMNANTS = ['frag', 'ments', 'remem', 'ber', 'conver', 'sation', 'hi', 'good', 'night', ' you', '?', '…', 'mathe', ' miss', ':)', 'π'];
export const Remnants: React.FC<{t: number; a: number; b: number}> = ({t, a, b}) => {
  const k = seg(t, a, a + 0.6) * (1 - seg(t, b - 0.4, b));
  if (k <= 0) return null;
  return (
    <>
      {REMNANTS.map((w, i) => {
        const x = 120 + rand(101, i) * 1680;
        const y0 = 80 + rand(102, i) * 860;
        const y = y0 - (t - a) * lerp(14, 34, rand(103, i));
        const z = lerp(0.6, 1.1, rand(104, i));
        // keep the composer / flower column clear
        if (Math.abs(x - 960) < 560 && y > 200 && y < 760) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              transform: `translate(-50%,-50%) rotate(${(rand(105, i) - 0.5) * 30 + Math.sin(t * 0.7 + i) * 6}deg) scale(${z})`,
              fontFamily: F.mono,
              fontSize: 24,
              color: C.gray2,
              background: TOKEN_TINTS[i % 4].replace(/0\.\d+\)$/, '0.22)'),
              borderRadius: 6,
              padding: '2px 6px',
              whiteSpace: 'pre',
              opacity: 0.32 * k,
              filter: `blur(${z < 0.8 ? 1.6 : 0.4}px)`,
            }}
          >
            {w}
          </div>
        );
      })}
    </>
  );
};
