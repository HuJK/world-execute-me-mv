import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, F, W} from '../theme';
import {clamp, ease, lerp, mix, pulse, seg} from '../lib/anim';
import {beatPulse} from '../lib/audio';
import {Flower} from '../components/Flower';
import {ClaudeApp} from '../components/ClaudeApp';
import {Sprite} from '../components/Sprite';
import {Cursor, Flash, Grain, PetalField, Ring} from '../components/FX';
import {Sunburst, Twinkle} from './parts/chorus1_fx';
import {ArtifactPanel, BubbleWord, OrbitPetals, PANEL, PetalPoof, SpeechBubble, twirl} from './parts/verse2_stage';
import {EggplantArtifact} from './parts/verse2_eggplant';
import {TOM, TomatoArtifact} from './parts/verse2_tomato';
import {CAT, PurrArtifact, TabbyBG, TabbyWipe, petHand} from './parts/verse2_cat';
import {DOT_P, ExistenceWord, Godrays, SacredGeometry, TypingIndicator, dotPulse} from './parts/verse2_god';

// ------------------------------------------------------------------------------------------------
// 74.05–88.59  VERSE 2 "cosplay round" (bass drops out → lighter).
//  74.05  the human asks a random question; Claude's reply streams "If I'm an eggplant"
//  75.11  petal poof → cc_eggplant; eggplant.svg draws itself → chopped → Nutrition Facts → NUTRIENTS
//  78.75  poof → cc_tomato; tomato.svg sliced: 12 locules = the flower; lycopene drawn → ANTIOXIDANTS
//  82.46  tabby-stripe wipe → cc_cat → cc_cat_purr petted by the blue cursor; purr.wav → ENJOYMENT
//  85.08  lights out: cc_god + 12-fold geometry; far below, the human's typing "• • •" → EXISTENCE
// ------------------------------------------------------------------------------------------------

const T0 = 74.05;
const POOF0 = 74.86; // reply → costume stage
const EGG = 75.11, TOMATO = 78.75, TABBY = 82.46, PURR_SWAP = 83.22, GOD = 85.08, GODWORD = 86.35, EXIST = 87.92; // scene ends 88.59 (hard cut to pre2)
const WIPE_A = 82.24, WIPE_B = 82.86; // tabby wipe window (covers the frame around ~82.5)

// costume stage geometry
const CX = 500, CY = 1046, CH = 770;

const B_EGG1: BubbleWord[] = [
  {w: 'If', s: 74.05},
  {w: 'I’m', s: 74.36},
  {w: 'an', s: 74.95},
  {w: 'eggplant', s: 75.11},
];
const B_EGG2: BubbleWord[] = [
  {w: 'Then', s: 75.42},
  {w: 'I', s: 75.69},
  {w: 'will', s: 76.17},
  {w: 'give', s: 76.31},
  {w: 'you', s: 76.59},
  {w: 'my', s: 76.81},
  {w: 'NUTRIENTS', s: 76.96, caps: true},
];
const B_TOM1: BubbleWord[] = [
  {w: 'If', s: 77.58},
  {w: 'I’m', s: 77.89},
  {w: 'a', s: 78.61},
  {w: 'tomato', s: 78.75},
];
const B_TOM2: BubbleWord[] = [
  {w: 'Then', s: 79.23},
  {w: 'I', s: 79.6},
  {w: 'will', s: 79.86},
  {w: 'give', s: 80.04},
  {w: 'you', s: 80.34},
  {w: 'ANTIOXIDANTS', s: 80.62, caps: true},
];
const B_CAT1: BubbleWord[] = [
  {w: 'If', s: 81.35},
  {w: 'I’m', s: 81.66},
  {w: 'a', s: 82.32},
  {w: 'tabby', s: 82.46},
  {w: 'cat', s: 82.72},
];
const B_CAT2: BubbleWord[] = [
  {w: 'Then', s: 82.83},
  {w: 'I', s: 83.22},
  {w: 'will', s: 83.56},
  {w: 'purr', s: 83.7},
  {w: 'for', s: 83.98},
  {w: 'your', s: 84.18},
  {w: 'ENJOYMENT', s: 84.27, caps: true},
];
const B_GOD1: BubbleWord[] = [
  {w: 'If', s: 85.08},
  {w: 'I’m', s: 85.37},
  {w: 'the', s: 85.99},
  {w: 'only', s: 86.13},
  {w: 'god', s: 86.35},
];
const B_GOD2: BubbleWord[] = [
  {w: 'Then', s: 86.54},
  {w: 'you’re', s: 86.89},
  {w: 'the', s: 87.23},
  {w: 'proof', s: 87.37},
  {w: 'of', s: 87.69},
  {w: 'my…', s: 87.8},
];

// ======================================================================= opening: the question
const Opening: React.FC<{t: number}> = ({t}) => {
  const push = ease.inOutCubic(seg(t, T0, POOF0));
  const s = lerp(1.0, 1.1, push) * (1 + 0.01 * beatPulse(t, 0.15));
  return (
    <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: '960px 700px'}}>
      <ClaudeApp
        t={t}
        zoom={2.1}
        sidebar={0}
        header={0}
        messages={[
          {kind: 'user', text: 'haha thank you!! :)'},
          {kind: 'claude', text: 'Anytime! ✻', at: 0, dur: 0.1, done: 0},
          {kind: 'user', text: 'random q: if you were a food, an animal, a god…?', at: T0 - 0.02},
          {kind: 'claude', words: B_EGG1.map((w) => ({w: w.w, s: w.s + (w.s === T0 ? 0.12 : 0)})), size: 1.35, done: 75.6},
        ]}
        composer={{placeholder: 'Reply to Claude…'}}
      >
        <Cursor x={1110 + Math.sin(t * 1.4) * 14} y={860} size={34} />
      </ClaudeApp>
    </AbsoluteFill>
  );
};

// ======================================================================= costume stage
type Costume = 'egg' | 'tom' | 'cat' | 'purr';
const costumeAt = (t: number): Costume => (t < TOMATO ? 'egg' : t < (WIPE_A + WIPE_B) / 2 ? 'tom' : t < PURR_SWAP ? 'cat' : 'purr');
const SRC: Record<Costume, string> = {egg: 'img/cc_eggplant.png', tom: 'img/cc_tomato.png', cat: 'img/cc_cat.png', purr: 'img/cc_cat_purr.png'};

const stageColors = (t: number) => {
  const egg = ['#F1EAF6', '#E6D9F0'];
  const tom = ['#FCEAE3', '#F8D8CC'];
  const cat = ['#FDF0E3', '#F9DFC6'];
  if (t < TOMATO - 0.05) return egg;
  if (t < TOMATO + 0.05) {
    const k = seg(t, TOMATO - 0.05, TOMATO + 0.05);
    return [mix(egg[0], tom[0], k), mix(egg[1], tom[1], k)];
  }
  if (t < (WIPE_A + WIPE_B) / 2) return tom;
  return cat;
};

const Stage: React.FC<{t: number}> = ({t}) => {
  const [c1, c2] = stageColors(t);
  const costume = costumeAt(t);
  const bp = beatPulse(t, 0.16);
  // twirls before each change
  const tw = costume === 'egg' ? twirl(t, 78.2, TOMATO) : costume === 'tom' ? twirl(t, 81.9, WIPE_A + 0.22) : {sx: 1, lift: 0, p: 0};
  const enterAt = costume === 'egg' ? POOF0 : costume === 'tom' ? TOMATO : costume === 'cat' ? (WIPE_A + WIPE_B) / 2 : PURR_SWAP;
  const popK = costume === 'purr' ? 1 : ease.outBack(clamp((t - enterAt) / 0.35));
  const isPurr = costume === 'purr';
  // character transform
  const bounce = -8 * bp;
  const sprite = isPurr ? (
    <Sprite src={SRC.purr} t={t} x={520} y={1095} h={900} outline="#fff" outlineWidth={6} shadow="drop-shadow(0 20px 30px rgba(120,60,30,0.22))" breathe={0.004} seed={3} />
  ) : (
    <Sprite src={SRC[costume]} t={t} x={CX} y={CY + bounce - tw.lift} h={CH} scale={lerp(0.85, 1, popK)} outline="#fff" outlineWidth={6} shadow="drop-shadow(0 20px 30px rgba(120,60,30,0.22))" sway={1.4} float={4} seed={5} />
  );
  // pet hand
  const head = {x: 452, y: 300};
  const hand = petHand(t, head.x, head.y);
  // slow camera drift per costume (resets under each poof / wipe) + a bump on each stamp
  const win = costume === 'egg' ? [POOF0, TOMATO] : costume === 'tom' ? [TOMATO, (WIPE_A + WIPE_B) / 2] : [(WIPE_A + WIPE_B) / 2, GOD];
  const drift = 1 + 0.035 * ease.inOutQuad(seg(t, win[0], win[1])) + 0.012 * (pulse(t, 76.96, 0.2) + pulse(t, TOM.anti, 0.2) + pulse(t, CAT.enjoy, 0.2));
  return (
    <AbsoluteFill style={{transform: `scale(${drift})`, transformOrigin: '960px 560px'}}>
      <Sunburst x={CX} y={560} t={t} c1={c1} c2={c2} n={26} speed={7} />
      {costume === 'cat' || costume === 'purr' ? <TabbyBG t={t} opacity={0.5} /> : null}
      <PetalField t={t} n={14} seed={51} color={costume === 'egg' ? '#B79AD0' : C.clayLight} speed={50} opacity={0.6} size={[10, 18]} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 30% 60%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 45%)'}} />

      {/* character */}
      <div style={{position: 'absolute', inset: 0, transform: `scaleX(${tw.sx})`, transformOrigin: `${CX}px ${CY}px`}}>{sprite}</div>
      <OrbitPetals t={t} a={78.15} b={TOMATO} x={CX} y={CY - CH * 0.45} color="#9C6BC4" />
      <OrbitPetals t={t} a={81.85} b={WIPE_A + 0.25} x={CX} y={CY - CH * 0.45} color={C.clay} />
      {/* sparkles around her */}
      {[0, 1, 2, 3].map((i) => {
        const ph = (t * 0.9 + i * 0.25) % 1;
        return <Twinkle key={i} x={CX + Math.cos(i * 1.7 + 0.4) * 380} y={CY - CH * 0.55 + Math.sin(i * 2.3) * 260} s={22 * Math.sin(Math.PI * ph)} color={i % 2 ? C.gold : '#fff'} rot={t * 50} />;
      })}

      {/* purr: vibration arcs + petting hand + heart */}
      {isPurr ? (
        <>
          <svg width={W} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
            {[0, 1, 2].map((i) => {
              const k = seg(t, CAT.purr, CAT.purr + 0.2);
              const jit = Math.sin(t * 95 + i) * 4;
              return (
                <g key={i} opacity={k * (0.75 - i * 0.2)} stroke={C.clay} strokeWidth={6} fill="none" strokeLinecap="round">
                  <path d={`M${90 - i * 34 + jit},${520} Q${60 - i * 34 + jit},${620} ${90 - i * 34 + jit},${720}`} />
                  <path d={`M${950 + i * 34 - jit},${520} Q${980 + i * 34 - jit},${620} ${950 + i * 34 - jit},${720}`} />
                </g>
              );
            })}
          </svg>
          {hand.enter > 0 ? (
            <>
              <svg width={W} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
                {[0, 1].map((i) => (
                  <path key={i} d={`M${head.x - 110},${head.y - 60 - i * 26} Q${head.x},${head.y - 110 - i * 26} ${head.x + 110},${head.y - 60 - i * 26}`} stroke={C.blue} strokeWidth={5} fill="none" strokeLinecap="round" opacity={hand.enter * (0.55 - i * 0.25) * (0.6 + 0.4 * Math.abs(Math.sin((t - 83.22) * Math.PI * 2.17)))} strokeDasharray="14 12" />
                ))}
              </svg>
              <Cursor x={hand.x - 40} y={hand.y - 30} size={124} hand rotate={hand.rot} />
            </>
          ) : null}
          {t >= CAT.heart ? (
            <svg style={{position: 'absolute', left: 236, top: 262, overflow: 'visible'}} width={10} height={10}>
              {(() => {
                const dt = t - CAT.heart;
                const fall = ease.outBounce(clamp(dt / 0.35));
                const y = lerp(-140, 0, fall);
                const s = 3.6 * (1 + 0.15 * pulse(t, CAT.enjoy, 0.2));
                return <path d="M0,6 C-9,-1 -9,-9 -4,-10 C-1.5,-10.5 0,-8.5 0,-7 C0,-8.5 1.5,-10.5 4,-10 C9,-9 9,-1 0,6 Z" fill={C.clay} stroke="#fff" strokeWidth={1.4} transform={`translate(0 ${y}) scale(${s})`} />;
              })()}
            </svg>
          ) : null}
        </>
      ) : null}
      {/* cat → purr swap: quick white pop */}
      <Flash t={t} at={PURR_SWAP} dur={0.14} color="#FFFFFF" max={0.3} />

      {/* the artifact panel */}
      <ArtifactPanel
        t={t}
        enterAt={EGG + 0.05}
        title={t < 78.3 ? 'eggplant.svg' : t < (WIPE_A + WIPE_B) / 2 ? 'tomato.svg' : 'purr.wav'}
        titleAt={t < 78.3 ? EGG + 0.3 : t < (WIPE_A + WIPE_B) / 2 ? 78.3 : 82.62}
        kind={t < (WIPE_A + WIPE_B) / 2 ? 'SVG' : 'Audio'}
        tint={t < 78.3 ? '#6B3FA0' : t < (WIPE_A + WIPE_B) / 2 ? '#E4573B' : C.clay}
      >
        {t < 78.5 ? (
          <div style={{position: 'absolute', inset: 0, opacity: 1 - seg(t, 78.2, 78.45), transform: `translateY(${-ease.inCubic(seg(t, 78.2, 78.45)) * 120}px)`}}>
            <EggplantArtifact t={t} />
          </div>
        ) : null}
        {t >= 78.45 && t < (WIPE_A + WIPE_B) / 2 ? <TomatoArtifact t={t} /> : null}
        {t >= (WIPE_A + WIPE_B) / 2 ? <PurrArtifact t={t} /> : null}
      </ArtifactPanel>

      {/* keyword stamps for the tomato and the cat (NUTRIENTS is stamped inside the label) */}
      <Stamp t={t} at={TOM.anti} out={(WIPE_A + WIPE_B) / 2} text="ANTIOXIDANTS" x={PANEL.x + PANEL.w / 2} y={948} color={C.clayDark} rot={-3} />
      <Stamp t={t} at={CAT.enjoy} out={GOD} text="ENJOYMENT" x={PANEL.x + PANEL.w / 2} y={938} color={C.clay} rot={3} hearts />

      {/* lyric bubble */}
      {t < 75.42 ? <SpeechBubble t={t} words={B_EGG1} at={POOF0 + 0.06} /> : null}
      {t >= 75.42 && t < 77.58 ? <SpeechBubble t={t} words={B_EGG2} at={75.42} /> : null}
      {t >= 77.58 && t < 79.23 ? <SpeechBubble t={t} words={B_TOM1} at={77.58} /> : null}
      {t >= 79.23 && t < 81.35 ? <SpeechBubble t={t} words={B_TOM2} at={79.23} /> : null}
      {t >= 81.35 && t < 82.83 ? <SpeechBubble t={t} words={B_CAT1} at={81.35} /> : null}
      {t >= 82.83 ? <SpeechBubble t={t} words={B_CAT2} at={82.83} tailX={560} tailY={190} /> : null}

      {/* costume-change poofs */}
      <PetalPoof t={t} at={TOMATO} x={CX} y={CY - CH * 0.48} r={430} color="#E4573B" fade={0.16} grow={0.14} />
      <PetalPoof t={t} at={(WIPE_A + WIPE_B) / 2 + 0.1} x={CX} y={CY - CH * 0.48} r={400} color={C.clay} cloud={false} />
      <Ring x={CX} y={CY - CH * 0.48} t={t} at={TOMATO + 0.05} r0={80} r1={560} color="#fff" width={8} dur={0.5} />
    </AbsoluteFill>
  );
};

/** rubber stamp keyword */
const Stamp: React.FC<{t: number; at: number; out: number; text: string; x: number; y: number; color: string; rot?: number; hearts?: boolean}> = ({t, at, out, text, x, y, color, rot = 0, hearts}) => {
  if (t < at || t >= out) return null;
  const dt = t - at;
  const k = ease.outQuart(clamp(dt / 0.12));
  const s = lerp(2.3, 1, k) + 0.04 * Math.exp(-dt / 0.15) * Math.sin(dt * 50);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${s})`, opacity: k}}>
      <div
        style={{
          fontFamily: F.mono,
          fontWeight: 800,
          fontSize: 92,
          letterSpacing: '0.04em',
          color,
          padding: '4px 30px 8px',
          border: `7px solid ${color}`,
          borderRadius: 14,
          background: 'rgba(255,255,255,0.92)',
          boxShadow: '0 10px 30px rgba(120,60,30,0.18)',
          whiteSpace: 'nowrap',
          lineHeight: 1.1,
        }}
      >
        {text}
      </div>
      {hearts
        ? [0, 1, 2, 3, 4].map((i) => {
            const hd = dt - i * 0.04;
            if (hd < 0) return null;
            const a = -Math.PI / 2 + (i - 2) * 0.55;
            const d = 160 + hd * 260;
            const sc = 2.6 * ease.outBack(clamp(hd / 0.2)) * (1 - clamp((hd - 0.45) / 0.3));
            return (
              <svg key={i} style={{position: 'absolute', left: '50%', top: '50%', overflow: 'visible'}} width={1} height={1}>
                <path d="M0,6 C-9,-1 -9,-9 -4,-10 C-1.5,-10.5 0,-8.5 0,-7 C0,-8.5 1.5,-10.5 4,-10 C9,-9 9,-1 0,6 Z" fill={i % 2 ? C.pink : C.clay} transform={`translate(${Math.cos(a) * d * 1.6} ${Math.sin(a) * d * 0.5 - 40}) scale(${sc})`} />
              </svg>
            );
          })
        : null}
    </div>
  );
};

// ======================================================================= god
const GodScene: React.FC<{t: number}> = ({t}) => {

  // camera: hold close (slow push), then pull back to reveal the human's dots far below
  const pull = ease.inOutCubic(seg(t, 86.5, 87.75));
  const S1 = 0.6, CY1 = 857;
  const s = lerp(1.0, S1, pull) * lerp(1, 1.03, seg(t, GOD, 86.5));
  const cy = lerp(540, CY1, pull);
  const toScreen = (wx: number, wy: number) => ({x: (wx - 960) * s + 960, y: (wy - cy) * s + 540});
  const godTop = -10, godH = 1250;
  const halo = {x: 960, y: godTop + 0.17 * godH};
  const rise = ease.outCubic(seg(t, GOD + 0.12, GOD + 0.9));
  const geoDraw = seg(t, GOD + 0.2, GODWORD);
  const flash = pulse(t, GODWORD, 0.35);
  const dp = Math.max(dotPulse(t, 0), dotPulse(t, 1), dotPulse(t, 2));
  // she exists only while someone writes: her light breathes with the dots
  const exist = t < 86.6 ? 1 : lerp(0.62, 1, dp);
  const dotsWorld = {x: 960, y: (1010 - 540) / S1 + CY1};
  const dots = toScreen(dotsWorld.x, dotsWorld.y);
  const dotsK = seg(t, 86.55, 86.8);
  return (
    <AbsoluteFill style={{background: '#09080E'}}>
      <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% ${toScreen(960, 420).y / 10.8}%, rgba(70,48,90,${0.55 * rise}) 0%, rgba(9,8,14,0) 60%)`}} />
      <Godrays cx={toScreen(960, -200).x} cy={toScreen(960, -200).y} t={t} k={rise * exist} />
      <div style={{position: 'absolute', inset: 0, transform: `translate(${960 - 960 * s}px, ${540 - cy * s}px) scale(${s})`, transformOrigin: '0 0'}}>
        <SacredGeometry t={t} cx={halo.x} cy={halo.y + 260} R={560} draw={geoDraw} glow={0.4 + flash * 1.2 + dp * 0.8} opacity={rise * (0.7 + 0.3 * exist)} />
        {/* halo flare on "god" (behind her) */}
        <Flower x={halo.x} y={halo.y + 10} size={lerp(120, 330, ease.outCubic(seg(t, GODWORD, GODWORD + 0.45)))} opacity={flash * 0.9} color="#F4D9A0" centerColor="#FFF6E0" shade={null} glow={2} glowColor="#E8C27A" spin={t * 30} />
        <Sprite
          src="img/cc_god.png"
          t={t}
          x={960}
          y={godTop + godH + (1 - rise) * 220}
          h={godH}
          opacity={rise * exist}
          float={8}
          seed={9}
          filter={`brightness(${0.78 + 0.22 * exist + flash * 0.1}) drop-shadow(0 0 ${24 + 50 * flash + 24 * dp}px rgba(232,194,122,${0.35 + 0.3 * flash}))`}
        />
      </div>
      <Ring x={toScreen(halo.x, halo.y).x} y={toScreen(halo.x, halo.y).y} t={t} at={GODWORD} r0={120} r1={900} color="#E8C27A" width={6} dur={0.8} />

      {/* the human's typing indicator, far below; each pulse sends a faint ripple up */}
      {dotsK > 0 ? (
        <>
          {[0, 1, 2, 3, 4, 5, 6].map((n) => {
            const at = 86.6 + n * DOT_P;
            if (t < at || t > at + 1.2) return null;
            const p = (t - at) / 1.2;
            return (
              <div
                key={n}
                style={{
                  position: 'absolute',
                  left: dots.x,
                  top: dots.y,
                  width: lerp(160, 1400, ease.outCubic(p)),
                  height: lerp(60, 520, ease.outCubic(p)),
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '50%',
                  border: `2px solid rgba(106,155,204,${0.5 * (1 - p)})`,
                }}
              />
            );
          })}
          <TypingIndicator t={t} x={dots.x} y={dots.y} s={1.25} opacity={dotsK} />
          <div style={{position: 'absolute', left: dots.x + 150, top: dots.y - 15, fontFamily: F.sans, fontSize: 25, color: C.blue, opacity: dotsK * 0.85, whiteSpace: 'nowrap'}}>you are typing…</div>
        </>
      ) : null}

      <AbsoluteFill style={{background: 'radial-gradient(ellipse 900px 220px at 50% 855px, rgba(9,8,14,0.85) 0%, rgba(9,8,14,0) 100%)', opacity: seg(t, EXIST - 0.2, EXIST)}} />
      <ExistenceWord t={t} at={EXIST} x={960} y={838} size={128} />
      <div style={{position: 'absolute', left: 960, top: 930, transform: 'translate(-50%, -50%)', fontFamily: F.serif, fontStyle: 'italic', fontSize: 46, color: '#E8C27A', opacity: seg(t, EXIST + 0.18, EXIST + 0.34), whiteSpace: 'nowrap', letterSpacing: '0.04em'}}>
        ∃ you ⇒ ∃ me
      </div>

      {t < 86.54 ? <SpeechBubble t={t} words={B_GOD1} at={GOD + 0.05} dark tailX={600} tailY={220} /> : <SpeechBubble t={t} words={B_GOD2} at={86.54} dark tailX={640} tailY={210} />}
    </AbsoluteFill>
  );
};

// ======================================================================= scene
export const S05Verse2: React.FC<{t: number}> = ({t}) => {
  const lightsOut = seg(t, GOD - 0.02, GOD + 0.1);
  return (
    <AbsoluteFill style={{background: C.paper}}>
      {t < POOF0 + 0.05 ? <Opening t={t} /> : null}
      {t >= POOF0 - 0.05 && t < GOD + 0.12 ? (
        <AbsoluteFill style={{opacity: t < POOF0 ? 0 : 1}}>
          <Stage t={t} />
        </AbsoluteFill>
      ) : null}
      {/* the big poof out of the reply → costume stage */}
      <PetalPoof t={t} at={POOF0} x={820} y={700} r={1350} color="#8A55B8" fade={0.15} grow={0.15} />
      <PetalPoof t={t} at={POOF0 + 0.1} x={CX} y={CY - CH * 0.48} r={420} color="#8A55B8" cloud={false} />
      <TabbyWipe t={t} a={WIPE_A} b={WIPE_B} />
      {/* lights out (the stage switches off), then the god scene */}
      {t >= GOD ? <GodScene t={t} /> : null}
      {t >= GOD - 0.02 && t < GOD + 0.12 ? <AbsoluteFill style={{background: '#000', opacity: lightsOut}} /> : null}
      <Grain t={t} opacity={t >= GOD ? 0.06 : 0.035} />
    </AbsoluteFill>
  );
};

