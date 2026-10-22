import React from 'react';
import {C, F, H, W} from '../../theme';
import {clamp, ease, hash, lerp, seg} from '../../lib/anim';
import {Flower} from '../../components/Flower';
import {ICopy} from '../../components/Icons';
import {Twinkle} from './chorus1_fx';

// ------------------------------------------------------------------------------------------------
// Verse 2 "cosplay round" stage pieces: speech bubble (lyrics as Claude's reply), artifact panel,
// magical-girl petal poof (covers the costume swap), twirl anticipation.
// ------------------------------------------------------------------------------------------------

export const PANEL = {x: 990, y: 66, w: 860, h: 948, head: 72};

export type BubbleWord = {w: string; s: number; caps?: boolean};

/** Claude's reply as a speech bubble (word-timed); CAPS words render in mono with a flower O */
export const SpeechBubble: React.FC<{t: number; words: BubbleWord[]; at: number; x?: number; y?: number; tailX?: number; tailY?: number; dark?: boolean}> = ({
  t,
  words,
  at,
  x = 70,
  y = 58,
  tailX = 470,
  tailY = 250,
  dark = false,
}) => {
  const k = ease.outBack(seg(t, at - 0.02, at + 0.22));
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `scale(${k})`, transformOrigin: '30% 100%', opacity: clamp(k * 3)}}>
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={10} height={10}>
        <path d={`M${tailX - x - 60},86 Q${tailX - x - 10},${tailY - y - 30} ${tailX - x},${tailY - y} Q${tailX - x - 20},${tailY - y - 70} ${tailX - x + 30},86 Z`} fill={dark ? '#2B2A28' : '#FFFFFF'} />
      </svg>
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          background: dark ? '#2B2A28' : '#FFFFFF',
          borderRadius: 30,
          padding: '20px 34px 22px 24px',
          boxShadow: '0 14px 34px rgba(90,40,30,0.16)',
          fontFamily: F.serif,
          fontSize: 47,
          lineHeight: 1.15,
          color: dark ? C.cream : C.ink,
          whiteSpace: 'nowrap',
        }}
      >
        <Flower size={20} spin={t * 40} shade={null} />
        <div>
          {words.map((w, i) => {
            const p = clamp((t - w.s + 0.04) / 0.14);
            if (w.caps) {
              const cp = clamp((t - w.s) / 0.18);
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    fontFamily: F.mono,
                    fontWeight: 800,
                    fontSize: 40,
                    color: C.clay,
                    marginLeft: 4,
                    opacity: cp,
                    transform: `scale(${lerp(1.8, 1, ease.outCubic(cp))})`,
                    transformOrigin: '0% 70%',
                  }}
                >
                  {w.w}
                </span>
              );
            }
            return (
              <span key={i} style={{display: 'inline-block', opacity: p, transform: `translateY(${(1 - ease.outCubic(p)) * 14}px)`, marginRight: '0.24em', filter: p < 1 ? `blur(${(1 - p) * 3}px)` : undefined}}>
                {w.w}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/** artifact side panel with title bar */
export const ArtifactPanel: React.FC<{t: number; title: string; titleAt: number; children: React.ReactNode; enterAt: number; kind?: string; tint?: string}> = ({
  t,
  title,
  titleAt,
  children,
  enterAt,
  kind = 'SVG',
  tint = C.clay,
}) => {
  const k = ease.outCubic(seg(t, enterAt, enterAt + 0.4));
  const n = Math.floor(seg(t, titleAt, titleAt + 0.25) * title.length + 1e-6);
  return (
    <div
      style={{
        position: 'absolute',
        left: PANEL.x,
        top: PANEL.y,
        width: PANEL.w,
        height: PANEL.h,
        transform: `translateX(${(1 - k) * 980}px) rotate(${(1 - k) * 6}deg)`,
        background: '#FFFFFF',
        borderRadius: 26,
        border: '2px solid rgba(31,30,29,0.10)',
        boxShadow: '0 30px 70px rgba(80,40,30,0.18), 0 4px 10px rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}
    >
      <div style={{height: PANEL.head, display: 'flex', alignItems: 'center', gap: 14, padding: '0 24px', borderBottom: '2px solid rgba(31,30,29,0.07)', background: C.paper}}>
        <div style={{width: 30, height: 30, borderRadius: 8, background: tint, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Flower size={10} shade={null} color="#fff" centerColor={tint} />
        </div>
        <div style={{fontFamily: F.mono, fontSize: 27, fontWeight: 500, color: C.ink}}>
          {title.slice(0, n)}
          {n < title.length ? <span style={{color: C.clay}}>▍</span> : null}
        </div>
        <div style={{fontFamily: F.sans, fontSize: 20, color: C.gray3, border: '1.5px solid rgba(31,30,29,0.14)', borderRadius: 7, padding: '2px 9px'}}>{kind}</div>
        <div style={{flex: 1}} />
        <div style={{display: 'flex', borderRadius: 10, background: C.paper2, border: '1.5px solid rgba(31,30,29,0.1)', overflow: 'hidden', fontFamily: F.sans, fontSize: 20}}>
          <div style={{padding: '6px 14px', background: '#fff', color: C.ink, borderRadius: 9}}>Preview</div>
          <div style={{padding: '6px 14px', color: C.gray3}}>Code</div>
        </div>
        <ICopy size={26} color={C.gray3} />
      </div>
      <div style={{position: 'relative', width: PANEL.w, height: PANEL.h - PANEL.head}}>{children}</div>
    </div>
  );
};

/**
 * Magical-girl petal poof: a cream cloud of petals swells over the character (peak at `at`), the costume is
 * swapped under it, then it bursts outward into petals. Cloud covers ~[at-0.1, at+0.08].
 */
export const PetalPoof: React.FC<{t: number; at: number; x: number; y: number; r?: number; color?: string; fade?: number; grow?: number; cloud?: boolean}> = ({
  t,
  at,
  x,
  y,
  r = 520,
  color = C.clay,
  fade = 0.26,
  grow: growDur = 0.16,
  cloud = true,
}) => {
  const dt = t - at;
  if (dt < -growDur || dt > 0.8) return null;
  const grow = ease.outCubic(clamp((dt + growDur) / growDur));
  const burst = clamp(dt / 0.6);
  const cloudR = r * (dt < 0 ? lerp(0.15, 1, grow) : lerp(1, 1.25, ease.outCubic(clamp(dt / 0.3))));
  const cloudO = !cloud ? 0 : dt < 0.04 ? 1 : 1 - ease.inCubic(clamp((dt - 0.04) / fade));
  const puffs = Array.from({length: 14}, (_, i) => {
    const a = (i / 14) * Math.PI * 2 + 0.2;
    const rr = cloudR * lerp(0.62, 0.82, hash(i + 2));
    return {cx: x + Math.cos(a) * rr, cy: y + Math.sin(a) * rr * 0.92, pr: cloudR * lerp(0.32, 0.46, hash(i + 9))};
  });
  return (
    <>
      {cloudO > 0 ? (
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none', opacity: cloudO}}>
        <g filter="drop-shadow(0 10px 30px rgba(180,90,60,0.25))">
          <circle cx={x} cy={y} r={cloudR * 0.8} fill="#FFF8F1" />
          {puffs.map((p, i) => (
            <circle key={i} cx={p.cx} cy={p.cy} r={p.pr} fill={i % 3 ? '#FFF8F1' : '#FDEDE3'} />
          ))}
        </g>
      </svg>
      ) : null}
      {/* petals bursting out */}
      {dt > -0.05
        ? Array.from({length: 18}, (_, i) => {
            const a = (i / 18) * Math.PI * 2 + hash(i) * 0.3;
            const d = r * lerp(0.5, 1.5, ease.outCubic(burst)) * lerp(0.75, 1.15, hash(i + 5));
            return (
              <Flower
                key={i}
                size={r * 0.085 * (1 - burst * 0.5)}
                x={x + Math.cos(a) * d}
                y={y + Math.sin(a) * d + burst * burst * 120}
                spin={dt * 300 + i * 40}
                opacity={1 - ease.inCubic(burst)}
                color={i % 4 === 0 ? C.gold : i % 3 === 0 ? C.clayLight : color}
                centerColor={C.cream}
                shade={null}
              />
            );
          })
        : null}
      {dt > 0
        ? [0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i / 6) * Math.PI * 2 + 0.5;
            const d = r * lerp(0.7, 1.05, ease.outCubic(burst));
            const s = 30 * Math.sin(Math.PI * clamp(burst * 1.6));
            return <Twinkle key={i} x={x + Math.cos(a) * d} y={y + Math.sin(a) * d} s={s} color={i % 2 ? C.gold : '#fff'} rot={dt * 200} />;
          })
        : null}
    </>
  );
};

/** twirl anticipation before a costume change: card-flip spin that accelerates into the poof */
export const twirl = (t: number, a: number, b: number) => {
  // a..b: spin window; returns scaleX and a lift
  const p = seg(t, a, b);
  const ang = ease.inCubic(p) * Math.PI * 2 * 3.0;
  return {sx: p > 0 ? Math.cos(ang) : 1, lift: Math.sin(Math.PI * p) * 40 * p, p};
};

/** orbiting petal ring that tightens during the twirl */
export const OrbitPetals: React.FC<{t: number; a: number; b: number; x: number; y: number; r?: number; color?: string}> = ({t, a, b, x, y, r = 380, color = C.clay}) => {
  const p = seg(t, a, b);
  if (p <= 0 || p >= 1) return null;
  const rr = r * lerp(1.2, 0.25, ease.inCubic(p));
  return (
    <>
      {Array.from({length: 12}, (_, i) => {
        const ang = (i / 12) * Math.PI * 2 + ease.inCubic(p) * 14 + t * 2;
        return (
          <Flower
            key={i}
            size={18 + 10 * Math.sin(i)}
            x={x + Math.cos(ang) * rr}
            y={y + Math.sin(ang) * rr * 0.55}
            spin={t * 400}
            opacity={clamp(p * 4)}
            color={i % 3 === 0 ? C.gold : color}
            shade={null}
          />
        );
      })}
    </>
  );
};
