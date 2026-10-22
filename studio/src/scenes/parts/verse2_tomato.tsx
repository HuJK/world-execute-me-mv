import React from 'react';
import {C, F} from '../../theme';
import {clamp, ease, lerp, pulse, seg} from '../../lib/anim';
import {PETAL_ANG, PETAL_LEN} from '../../components/Flower';
import {PANEL} from './verse2_stage';

// ------------------------------------------------------------------------------------------------
// tomato.svg — a whole tomato is sliced; its transverse section has 12 locules arranged exactly like
// Claude's flower (artistic license, footnoted). Then lycopene (C40H56) is drawn bond by bond and the
// conjugated chain lights up on ANTIOXIDANTS.
// ------------------------------------------------------------------------------------------------

const BW = PANEL.w;
const BH = PANEL.h - PANEL.head;
const CX = BW / 2, CY = 268, R = 210;

export const TOM = {draw0: 78.62, slice: 79.23, open: 79.32, chain0: 79.62, chain1: 80.5, anti: 80.62};

const TRED = '#E4573B';
const TRED_D = '#B83A24';
const GEL = '#F7A07C';
const LEAF = '#5E8E44';

const locule = (r0: number, L: number, w: number) =>
  `M0,${-r0} C${w * 0.95},${-r0 - (L - r0) * 0.15} ${w * 0.8},${-L + w * 0.35} 0,${-L} C${-w * 0.8},${-L + w * 0.35} ${-w * 0.95},${-r0 - (L - r0) * 0.15} 0,${-r0} Z`;

const Section: React.FC<{t: number; k: number}> = ({t, k}) => {
  // k: 0..1 reveal (locules grow from the centre)
  return (
    <g>
      <circle r={R} fill={TRED_D} />
      <circle r={R - 12} fill={TRED} />
      <circle r={R - 30} fill="#EE6A4C" />
      {PETAL_ANG.map((a, i) => {
        const L = (R - 44) * PETAL_LEN[i] * lerp(0.4, 1, ease.outBack(clamp(k * 1.3 - i * 0.02)));
        return (
          <g key={i} transform={`rotate(${a})`}>
            <path d={locule(58, L, 34)} fill={GEL} />
            {/* seeds */}
            {[0.55, 0.72, 0.86].map((f, j) => (
              <ellipse key={j} cx={(j % 2 ? 1 : -1) * 7} cy={-(58 + (L - 58) * f)} rx={5} ry={8} fill="#FFF3D6" stroke="#E9B98C" strokeWidth={1.2} transform={`rotate(${(j % 2 ? 1 : -1) * 18} ${(j % 2 ? 1 : -1) * 7} ${-(58 + (L - 58) * f)})`} />
            ))}
          </g>
        );
      })}
      <circle r={60} fill="#FBE0C9" />
      <circle r={60} fill="none" stroke="#F3C2A0" strokeWidth={3} />
      {/* gloss */}
      <path d={`M${-R * 0.72},${-R * 0.38} A${R * 0.82},${R * 0.82} 0 0 1 ${-R * 0.25},${-R * 0.8}`} stroke="#fff" strokeOpacity={0.35} strokeWidth={10} strokeLinecap="round" fill="none" />
    </g>
  );
};

const Whole: React.FC<{draw: number; fill: number}> = ({draw, fill}) => (
  <g>
    <path
      d={`M0,${-R * 0.92} C${R * 0.75},${-R * 0.98} ${R * 1.06},${-R * 0.5} ${R * 1.04},${R * 0.05} C${R * 1.02},${R * 0.62} ${R * 0.55},${R * 0.95} 0,${R * 0.95} C${-R * 0.55},${R * 0.95} ${-R * 1.02},${R * 0.62} ${-R * 1.04},${R * 0.05} C${-R * 1.06},${-R * 0.5} ${-R * 0.75},${-R * 0.98} 0,${-R * 0.92} Z`}
      fill="url(#tomFill)"
      fillOpacity={fill}
      stroke={C.ink}
      strokeWidth={3}
      strokeOpacity={1 - fill * 0.8}
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - draw}
    />
    {/* calyx star */}
    <path
      d="M0,-198 C14,-214 40,-226 70,-222 C48,-212 36,-202 30,-190 C52,-186 70,-174 78,-156 C52,-166 30,-170 12,-176 C10,-160 0,-146 -14,-136 C-12,-156 -14,-170 -20,-180 C-40,-172 -62,-166 -82,-170 C-62,-184 -42,-192 -24,-196 C-34,-208 -48,-218 -64,-226 C-36,-228 -16,-218 0,-198 Z"
      fill={LEAF}
      fillOpacity={fill}
      stroke={C.ink}
      strokeWidth={2.5}
      strokeOpacity={1 - fill * 0.8}
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - draw}
    />
    <path d="M0,-200 C-2,-226 6,-244 22,-254" stroke={LEAF} strokeWidth={12} strokeLinecap="round" fill="none" opacity={fill} />
    <path d={`M${-R * 0.7},${-R * 0.35} C${-R * 0.72},${-R * 0.6} ${-R * 0.5},${-R * 0.75} ${-R * 0.3},${-R * 0.8}`} stroke="#fff" strokeOpacity={0.45 * fill} strokeWidth={14} strokeLinecap="round" fill="none" />
  </g>
);

// ---------------------------------------------------------------- lycopene skeletal formula
// IUPAC: 2,6,10,14,19,23,27,31-octamethyldotriaconta-2,6,8,10,12,14,16,18,20,22,24,26,30-tridecaene
const NC = 32;
const METHYL = new Set([2, 6, 10, 14, 19, 23, 27, 31]);
const DOUBLE = new Set([2, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 30]); // bond (i, i+1)
const CH_X0 = 50, CH_DX = (BW - 100) / (NC - 1), CH_Y = 652, CH_A = 9, ME = 30;
const vtx = (i: number) => ({x: CH_X0 + (i - 1) * CH_DX, y: CH_Y + (i % 2 ? CH_A : -CH_A)});

export const Lycopene: React.FC<{t: number; a: number; b: number; glowAt: number}> = ({t, a, b, glowAt}) => {
  const prog = seg(t, a, b) * (NC - 1); // bonds drawn
  const items: React.ReactNode[] = [];
  // glow travelling along the conjugated system (C6..C27) on ANTIOXIDANTS
  const gp = seg(t, glowAt, glowAt + 0.45);
  const glowPos = lerp(5, 28, ease.inOutCubic(gp));
  const glowOn = t >= glowAt ? 1 - seg(t, glowAt + 0.45, glowAt + 0.75) * 0.6 : 0;
  for (let i = 1; i < NC; i++) {
    const p = clamp(prog - (i - 1));
    if (p <= 0) break;
    const A = vtx(i), B = vtx(i + 1);
    const bx = lerp(A.x, B.x, p), by = lerp(A.y, B.y, p);
    const conj = i >= 6 && i <= 26;
    const g = glowOn * (conj ? Math.exp(-Math.pow((i + 0.5 - glowPos) / 2.2, 2)) * 0.9 + 0.35 : 0);
    const col = g > 0.05 ? `rgba(226,182,91,${0.5 + g * 0.5})` : C.ink;
    items.push(<line key={'b' + i} x1={A.x} y1={A.y} x2={bx} y2={by} stroke={g > 0.05 ? C.gold : C.ink} strokeWidth={3 + g * 3} strokeLinecap="round" />);
    if (DOUBLE.has(i) && p >= 1) {
      // inner parallel line (towards the zigzag centre line)
      const dx = B.x - A.x, dy = B.y - A.y;
      const len = Math.hypot(dx, dy);
      let nx = -dy / len, ny = dx / len;
      if (ny < 0) {
        nx = -nx;
        ny = -ny;
      }
      // second line of the double bond, consistently on the lower side
      const off = 6.5;
      const s = 0.16;
      const dp = clamp((prog - (i - 1) - 1) * 3);
      items.push(
        <line
          key={'d' + i}
          x1={A.x + dx * s + nx * off}
          y1={A.y + dy * s + ny * off}
          x2={A.x + dx * lerp(s, 1 - s, dp) + nx * off}
          y2={A.y + dy * lerp(s, 1 - s, dp) + ny * off}
          stroke={col}
          strokeWidth={3 + g * 2}
          strokeLinecap="round"
        />,
      );
    }
    if (METHYL.has(i + 1) && p >= 1) {
      const v = vtx(i + 1);
      const dir = (i + 1) % 2 ? 1 : -1;
      const mp = clamp((prog - i) * 3);
      items.push(<line key={'m' + i} x1={v.x} y1={v.y} x2={v.x} y2={v.y + dir * ME * mp} stroke={C.ink} strokeWidth={3} strokeLinecap="round" />);
    }
  }
  // methyl on C2 is drawn when bond 1 completes; C1 / C32 are chain ends.
  return (
    <g>
      {glowOn > 0 ? <rect x={CH_X0 - 20} y={CH_Y - 50} width={BW - 60} height={100} rx={50} fill={C.gold} opacity={0.1 * glowOn} /> : null}
      {items}
    </g>
  );
};

export const TomatoArtifact: React.FC<{t: number}> = ({t}) => {
  const draw = ease.inOutCubic(seg(t, TOM.draw0, TOM.draw0 + 0.42));
  const fill = ease.outCubic(seg(t, TOM.draw0 + 0.3, TOM.draw0 + 0.55));
  const knife = seg(t, TOM.slice, TOM.slice + 0.12);
  const open = ease.inOutCubic(seg(t, TOM.open, TOM.open + 0.26));
  const secK = seg(t, TOM.open + 0.05, TOM.open + 0.45);
  const spin = t > TOM.open ? (t - TOM.open) * 6 : 0;
  const ap = pulse(t, TOM.anti, 0.3);
  const labelK = seg(t, TOM.open + 0.3, TOM.open + 0.5);
  return (
    <svg width={BW} height={BH} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <defs>
        <radialGradient id="tomFill" cx="38%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#F47A5C" />
          <stop offset="60%" stopColor={TRED} />
          <stop offset="100%" stopColor={TRED_D} />
        </radialGradient>
        <clipPath id="tomTop">
          <rect x={-400} y={-400} width={800} height={410} />
        </clipPath>
        <clipPath id="tomBot">
          <rect x={-400} y={10} width={800} height={400} />
        </clipPath>
      </defs>
      {/* cutting-board tile */}
      <circle cx={CX} cy={CY} r={R + 46} fill="#FBF3EA" />
      <circle cx={CX} cy={CY} r={R + 46} fill="none" stroke="#F1DCCB" strokeWidth={3} strokeDasharray="4 10" />
      <g transform={`translate(${CX} ${CY})`}>
        {t >= TOM.open ? (
          <g transform={`scale(${lerp(0.9, 1, ease.outBack(secK))}) rotate(${spin}) scale(${1 + ap * 0.05})`} opacity={clamp(secK * 3)}>
            <Section t={t} k={secK} />
          </g>
        ) : null}
        {/* the whole tomato splits along the cut: halves slide apart and fade, revealing the section */}
        {t < TOM.open + 0.32 ? (
          <>
            <g transform={`translate(${-open * 30} ${-open * 90}) rotate(${-open * 8})`} opacity={1 - ease.inCubic(open)} clipPath="url(#tomTop)">
              <Whole draw={draw} fill={fill} />
            </g>
            <g transform={`translate(${open * 30} ${open * 90}) rotate(${open * 8})`} opacity={1 - ease.inCubic(open)} clipPath="url(#tomBot)">
              <Whole draw={draw} fill={fill} />
            </g>
          </>
        ) : null}
        {/* knife stroke */}
        {knife > 0 && knife < 1 ? <line x1={-R - 40} y1={10} x2={lerp(-R - 40, R + 40, ease.outCubic(knife))} y2={10} stroke="#fff" strokeWidth={8} strokeLinecap="round" /> : null}
      </g>
      {/* callouts */}
      <g opacity={labelK} fontFamily={F.serif}>
        <line x1={CX + 128} y1={CY - 100} x2={CX + 300} y2={CY - 170} stroke={C.gray3} strokeWidth={2} />
        <circle cx={CX + 128} cy={CY - 100} r={6} fill={C.ink} />
        <text x={CX + 306} y={CY - 180} fontSize={30} fill={C.ink} fontStyle="italic" textAnchor="middle">
          12
        </text>
        <text x={CX + 306} y={CY - 148} fontSize={26} fill={C.ink} fontStyle="italic" textAnchor="middle">
          locules*
        </text>
        <text x={40} y={CY + R + 84} fontSize={26} fill={C.gray4} fontStyle="italic">
          fig. 1 — transverse section
        </text>
        <text x={BW - 40} y={CY + R + 84} fontSize={23} fill={C.gray3} fontStyle="italic" textAnchor="end">
          *artistic license (real tomatoes: 2–8)
        </text>
      </g>
      {/* lycopene */}
      <g opacity={seg(t, TOM.chain0 - 0.1, TOM.chain0)}>
        <text x={40} y={CH_Y - 58} fontSize={32} fontFamily={F.serif} fontStyle="italic" fill={C.ink}>
          lycopene
        </text>
        <text x={182} y={CH_Y - 58} fontSize={28} fontFamily={F.mono} fontWeight={700} fill={C.clayDark}>
          C<tspan fontSize={20} dy={6}>40</tspan>
          <tspan dy={-6}>H</tspan>
          <tspan fontSize={20} dy={6}>56</tspan>
        </text>
        <text x={BW - 40} y={CH_Y - 58} fontSize={24} fontFamily={F.serif} fontStyle="italic" fill={C.gray3} textAnchor="end">
          11 conjugated double bonds
        </text>
      </g>
      <Lycopene t={t} a={TOM.chain0} b={TOM.chain1} glowAt={TOM.anti} />
    </svg>
  );
};
