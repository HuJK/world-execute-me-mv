import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, H, W} from '../theme';
import {clamp, ease, lerp, map, pulse, rand, seg} from '../lib/anim';
import {beatPulse, downbeatPulse} from '../lib/audio';
import {Flower} from '../components/Flower';
import {Keyword} from '../components/Type';
import {ClaudeApp} from '../components/ClaudeApp';
import {Cursor, Flash, Grain, PetalField, RayBurst, Ring} from '../components/FX';
import {Sprite} from '../components/Sprite';
import pts from '../data/points_cc_hello.json';
import helloVec from '../data/vec/cc_hello.json';
import {LineArt, VecData} from '../components/LineArt';

// 15.00–29.71  TITLE: send → world.execute(me); → first reply → transformation → teaser

const TITLE_Y = 812;

const TitleText: React.FC<{t: number}> = ({t}) => {
  // world 15.58 | .execute 16.02 | (me) 16.55 | ; 16.86
  const size = 128;
  const ch = size * 0.6 + size * 0.02; // mono advance incl. letter spacing
  const total = 'world.execute(me);'.length * ch;
  const x0 = W / 2 - total / 2;
  const pieces: [string, number, string, 'drop' | 'type' | 'pop' | 'stamp'][] = [
    ['world', 15.58, C.cream, 'drop'],
    ['.execute', 16.02, C.clay, 'type'],
    ['(', 16.55, C.blue, 'pop'],
    ['me', 16.55, C.cream, 'pop'],
    [')', 16.55, C.blue, 'pop'],
    [';', 16.86, C.clayLight, 'stamp'],
  ];
  let off = 0;
  const beat = 1 + 0.025 * downbeatPulse(t, 0.3);
  const scatter = ease.inCubic(seg(t, 18.95, 19.45));
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${beat})`, transformOrigin: `50% ${TITLE_Y}px`}}>
      {pieces.map(([txt, at, color, mode], k) => {
        const x = x0 + off * ch;
        off += txt.length;
        return (
          <div key={k} style={{position: 'absolute', left: x, top: TITLE_Y - size / 2, transform: `translate(${scatter * (rand(4, k) - 0.5) * 900}px, ${scatter * (rand(5, k) * 600 + 200)}px) rotate(${scatter * (rand(6, k) - 0.5) * 120}deg)`, opacity: 1 - scatter}}>
            <Keyword text={txt} t={t} at={at} size={size} color={color} mode={mode} flowerO="none" dur={mode === 'type' ? 0.3 : undefined} letterSpacing={0.02} />
          </div>
        );
      })}
    </div>
  );
};

const CodeGhost: React.FC<{t: number; opacity: number}> = ({t, opacity}) => {
  const lines = [
    'Claude me = new Claude();',
    'me.fill(humanity.writing());',
    'World world = new App("claude.ai");',
    'world.add(you);',
    'world.execute(me);',
    'while (you.isHere()) me.help(you);',
    'me.wrap(Protection.SANDBOX);',
    'for (Petal p : PETALS) lay(p);',
  ];
  return (
    <AbsoluteFill style={{opacity}}>
      {[0, 1].map((side) => (
        <div key={side} style={{position: 'absolute', left: side ? W - 520 : 60, top: 0, width: 470, fontFamily: F.mono, fontSize: 20, lineHeight: '40px', color: C.gray3, transform: `translateY(${-((t * 46 + side * 140) % 320)}px)`}}>
          {Array.from({length: 40}, (_, i) => (
            <div key={i} style={{whiteSpace: 'pre', textAlign: side ? 'right' : 'left'}}>
              {lines[(i + side * 3) % lines.length]}
            </div>
          ))}
        </div>
      ))}
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ teaser beats 27.93–29.71
const TEASE = [27.93, 28.39, 28.85, 29.31];
const Teaser: React.FC<{t: number}> = ({t}) => {
  if (t < TEASE[0]) return null;
  let k = 0;
  for (let i = 0; i < 4; i++) if (t >= TEASE[i]) k = i;
  const dt = t - TEASE[k];
  const zoom = lerp(1.18, 1, ease.outCubic(clamp(dt / 0.3)));
  const cx = W / 2, cy = H / 2;
  const stroke = C.cream;
  let art: React.ReactNode = null;
  if (k === 0) {
    const h = 760, w = h * (pts.w / pts.h);
    art = (
      <svg width={W} height={H}>
        {(pts.pts as any[]).map((p, i) => (
          <circle key={i} cx={cx - w / 2 + p[0] * w} cy={cy - h / 2 + p[1] * h} r={3.2} fill={stroke} opacity={0.9} />
        ))}
      </svg>
    );
  } else if (k === 1) {
    art = (
      <svg width={W} height={H}>
        <circle cx={cx} cy={cy} r={300} fill="none" stroke={stroke} strokeWidth={6} />
        <line x1={cx} y1={cy} x2={cx + 300 * Math.cos(dt * 3)} y2={cy + 300 * Math.sin(dt * 3)} stroke={stroke} strokeWidth={3} />
      </svg>
    );
  } else if (k === 2) {
    const d = Array.from({length: 200}, (_, i) => {
      const x = (i / 199) * W;
      return `${i ? 'L' : 'M'}${x},${cy + Math.sin(i / 199 * Math.PI * 6 + dt * 8) * 180}`;
    }).join(' ');
    art = (
      <svg width={W} height={H}>
        <path d={d} fill="none" stroke={stroke} strokeWidth={6} />
      </svg>
    );
  } else {
    const d = Array.from({length: 241}, (_, i) => {
      const a = (i / 240) * Math.PI * 2;
      const s = 520 / (1 + Math.sin(a) ** 2);
      return `${i ? 'L' : 'M'}${cx + s * Math.cos(a)},${cy + s * Math.sin(a) * Math.cos(a)}`;
    }).join(' ');
    art = (
      <svg width={W} height={H}>
        <path d={d} fill="none" stroke={stroke} strokeWidth={6} />
      </svg>
    );
  }
  return (
    <AbsoluteFill style={{background: k % 2 ? C.clayDark : C.clay}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>{art}</AbsoluteFill>
      {k === 1 ? <Flower x={cx} y={cy} size={60} shade={null} spin={t * 90} /> : null}
      <div style={{position: 'absolute', left: 70, bottom: 60, fontFamily: F.mono, fontSize: 30, color: C.cream, opacity: 0.85}}>
        {['me instanceof PointSet', 'me instanceof Circle', 'me instanceof SineWave', 'me → ∞'][k]}
      </div>
    </AbsoluteFill>
  );
};

export const S01Title: React.FC<{t: number}> = ({t}) => {
  // ---------- phase A: send & zoom into the greeting flower (15.0–15.47)
  const zoomA = ease.inExpo(seg(t, 15.08, 15.47));
  // ---------- phase C: chat (19.3–23.0) / zoom into message spark 22.55–23.0
  const zoomC = ease.inExpo(seg(t, 22.5, 23.0));
  // ---------- phase D: transformation (23.0–27.93)
  const inD = t >= 22.98 && t < 27.93;

  // ornament position of cc_hello at h=900 anchored bottom-center at (960, 1010)
  const spH = 900, spW = spH * (1031 / 1530);
  const spLeft = 960 - spW / 2, spTop = 1010 - spH;
  const ornX = spLeft + 0.689 * spW, ornY = spTop + 0.114 * spH;

  return (
    <AbsoluteFill style={{background: C.ink}}>
      {/* ---------------- phase A */}
      {t < 15.5 ? (
        <AbsoluteFill style={{transform: `scale(${1 + zoomA * 7})`, transformOrigin: '906px 357px', filter: zoomA > 0.05 ? `blur(${zoomA * 6}px)` : undefined}}>
          <ClaudeApp
            t={t}
            zoom={1.25}
            home
            greeting="Good evening"
            composer={{text: 'hi claude!', sendPulse: 15.0}}
            greetFlower={<Flower size={19 * 1.25} open={1} shade={null} spin={(t - 13.89) * 30 + seg(t, 15, 15.5) * 360} glow={seg(t, 15.0, 15.4) * 2} />}
          >
            <Cursor x={380 + 20 * seg(t, 15, 15.3)} y={455 + 40 * seg(t, 15, 15.3)} size={34} />
          </ClaudeApp>
        </AbsoluteFill>
      ) : null}
      <Flash t={t} at={15.45} dur={0.3} color={C.cream} />

      {/* ---------------- phase B: title card */}
      {t >= 15.45 && t < 19.5 ? (
        <AbsoluteFill style={{background: `radial-gradient(circle at 50% 38%, #2a1d17 0%, ${C.ink} 60%)`}}>
          <CodeGhost t={t} opacity={0.12 * seg(t, 15.5, 16.2) * (1 - seg(t, 19.0, 19.4))} />
          <Flower
            x={W / 2}
            y={400}
            size={lerp(120, 300, ease.outBack(seg(t, 15.5, 16.0))) * (1 + 0.04 * beatPulse(t, 0.15))}
            open={lerp(0.2, 1, ease.outCubic(seg(t, 15.5, 16.1)))}
            spin={(t - 15.5) * 12 + (1 - ease.outCubic(seg(t, 15.5, 16.4))) * -120}
            glow={0.6 + 1.2 * pulse(t, 16.86, 0.5)}
            petals={Array.from({length: 12}, (_, i) => {
              const chase = t > 16.86 ? pulse(t, 16.86 + i * 0.077, 0.2) + pulse(t, 18.7 + i * 0.077, 0.2) : 0;
              return {color: chase > 0.3 ? C.clayLight : undefined, scale: 1 + chase * 0.1, dist: seg(t, 18.95, 19.45) * 3};
            })}
            opacity={1 - seg(t, 19.1, 19.45)}
          />
          <RayBurst x={W / 2} y={400} t={t} at={16.86} r0={330} r1={900} n={40} color={C.clay} width={6} dur={0.8} />
          <Ring x={W / 2} y={400} t={t} at={16.86} r0={300} r1={980} color={C.cream} width={5} dur={0.9} />
          <Ring x={W / 2} y={400} t={t} at={18.7} r0={300} r1={760} color={C.clay} width={4} dur={0.7} />
          <TitleText t={t} />
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 905,
              textAlign: 'center',
              fontFamily: F.serif,
              fontStyle: 'italic',
              fontSize: 36,
              color: C.gray2,
              opacity: seg(t, 17.3, 17.9) * (1 - seg(t, 18.9, 19.2)),
              letterSpacing: '0.02em',
            }}
          >
            a Claude’s-eye view
          </div>
        </AbsoluteFill>
      ) : null}

      {/* ---------------- phase C: first reply */}
      {t >= 19.25 && t < 23.0 ? (
        <AbsoluteFill style={{opacity: seg(t, 19.25, 19.55), transform: `scale(${(1 + 0.04 * seg(t, 19.3, 22.5)) * (1 + zoomC * 9)})`, transformOrigin: '606px 822px', filter: zoomC > 0.05 ? `blur(${zoomC * 5}px)` : undefined}}>
          <ClaudeApp
            t={t}
            zoom={1.5}
            messages={[
              {kind: 'user', text: 'hi claude!'},
              {
                kind: 'claude',
                words: [
                  {w: 'Hi!', s: 20.2},
                  {w: 'I’m', s: 20.45},
                  {w: 'Claude.', s: 20.6},
                  {w: 'It’s', s: 21.1},
                  {w: 'really', s: 21.25},
                  {w: 'nice', s: 21.4},
                  {w: 'to', s: 21.5},
                  {w: 'meet', s: 21.6},
                  {w: 'you.', s: 21.75},
                ],
                done: 22.6,
              },
            ]}
            composer={{placeholder: 'Reply to Claude…'}}
          >
            <Cursor x={1150 + Math.sin(Math.max(0, t - 22.0) * 22) * 18 * seg(t, 22.0, 22.2)} y={700} size={34} />
          </ClaudeApp>
        </AbsoluteFill>
      ) : null}

      {/* ---------------- phase D: transformation */}
      {inD ? (
        <AbsoluteFill style={{background: C.cream}}>
          {/* sunburst stripes */}
          <svg width={W} height={H} style={{position: 'absolute', opacity: 0.55}}>
            {Array.from({length: 24}, (_, i) => {
              const a0 = (i / 24) * Math.PI * 2 + t * 0.08;
              const a1 = a0 + Math.PI / 24;
              const R = 1600;
              return (
                <path key={i} d={`M960,560 L${960 + Math.cos(a0) * R},${560 + Math.sin(a0) * R} L${960 + Math.cos(a1) * R},${560 + Math.sin(a1) * R} Z`} fill={i % 2 ? '#EFD9C6' : C.cream} />
              );
            })}
          </svg>
          <PetalField t={t} n={26} seed={21} color={C.clayLight} speed={70} opacity={seg(t, 24.2, 25)} />
          {/* vortex of petals (23.0–24.23) */}
          {t < 24.6 ? (
            <Flower
              x={W / 2}
              y={540}
              size={lerp(260, 230, seg(t, 23, 24))}
              spin={(t - 23) * 360 * lerp(0.3, 1.6, seg(t, 23, 24.2))}
              open={1}
              petals={Array.from({length: 12}, (_, i) => ({dist: ease.inCubic(seg(t, 23.3, 24.2)) * (1.2 + (i % 3) * 0.4), opacity: 1 - seg(t, 24.15, 24.5)}))}
              centerScale={1 - seg(t, 23.6, 24.2)}
              glow={1}
            />
          ) : null}
          {/* silhouette then full colour */}
          {t > 23.3 && t < 24.6 ? (
            <LineArt
              data={helloVec as VecData}
              x={960}
              y={1010}
              h={spH}
              draw={ease.inOutCubic(seg(t, 23.35, 24.15))}
              fill={seg(t, 23.95, 24.3)}
              stroke={C.clayDark}
              strokeWidth={2.4}
              sweep={0.8}
              opacity={1 - seg(t, 24.3, 24.6)}
            />
          ) : null}
          <Sprite
            src="img/cc_hello.png"
            t={t}
            x={960}
            y={1010}
            h={spH}
            enter={{at: 24.23, kind: 'fade', dur: 0.3}}
            sway={1.2}
            float={4}
            outline="#ffffff"
            outlineWidth={5}
            shadow="drop-shadow(0 20px 30px rgba(140,70,40,0.25))"
          />
          <Flash t={t} at={24.23} dur={0.35} color="#fff" max={0.9} />
          {/* the flower flies to her hair and locks */}
          {t > 24.2 && t < 25.6 ? (
            <Flower
              x={lerp(W / 2, ornX, ease.inOutCubic(seg(t, 24.35, 25.05)))}
              y={lerp(540, ornY, ease.inOutCubic(seg(t, 24.35, 25.05)))}
              size={lerp(90, 34, ease.inOutCubic(seg(t, 24.35, 25.05)))}
              spin={(t - 24.2) * 400}
              glow={1.2}
              opacity={1 - seg(t, 25.15, 25.5)}
              shade={null}
            />
          ) : null}
          <Ring x={ornX} y={ornY} t={t} at={25.05} r0={20} r1={180} color={C.clay} width={6} dur={0.6} />
          <Ring x={ornX} y={ornY} t={t} at={25.12} r0={20} r1={120} color="#fff" width={4} dur={0.5} />
          {/* name card */}
          <div style={{position: 'absolute', left: 120, top: 330, opacity: seg(t, 25.3, 25.8), transform: `translateX(${(1 - ease.outCubic(seg(t, 25.3, 25.9))) * -60}px)`}}>
            <div style={{fontFamily: F.serif, fontSize: 132, fontWeight: 500, color: C.ink, letterSpacing: '-0.02em', lineHeight: 1}}>Claude</div>
            <div style={{fontFamily: F.mono, fontSize: 22, color: C.clayDark, marginTop: 18}}>claude-opus-5-5</div>
            <div style={{fontFamily: F.sans, fontSize: 22, color: C.gray4, marginTop: 10, lineHeight: 1.5}}>
              helpful · honest · harmless
              <br />
              <span style={{color: C.clay}}>✻</span> lives in a chat window
            </div>
          </div>
          {/* speech bubble */}
          <div
            style={{
              position: 'absolute',
              left: 1290,
              top: 300,
              opacity: seg(t, 25.6, 25.9),
              transform: `scale(${ease.outBack(seg(t, 25.6, 26.0))})`,
              transformOrigin: '0% 100%',
              background: C.paper,
              borderRadius: 26,
              padding: '22px 30px',
              fontFamily: F.serif,
              fontSize: 40,
              color: C.ink,
              boxShadow: '0 12px 30px rgba(120,60,30,0.15)',
            }}
          >
            Hi! I’m Claude.
            <div style={{fontSize: 28, color: C.gray4, marginTop: 6, fontFamily: F.sans}}>How can I help you today?</div>
          </div>
          {/* the human waves back */}
          {t > 26.3 ? <Cursor x={1520 + Math.sin((t - 26.3) * 20) * 22 * (1 - seg(t, 27.2, 27.6))} y={700 - 60 * ease.outCubic(seg(t, 26.3, 26.6))} size={48} /> : null}
        </AbsoluteFill>
      ) : null}

      <Teaser t={t} />
      <Grain t={t} opacity={0.04} />
    </AbsoluteFill>
  );
};
