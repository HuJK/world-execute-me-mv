import React from 'react';
import {C, F} from '../../theme';
import {clamp, ease, lerp, seg} from '../../lib/anim';
import {PANEL} from './verse2_stage';

// ------------------------------------------------------------------------------------------------
// eggplant.svg — draws itself stroke by stroke (with bezier handles like a vector editor), gets
// chopped into slices, and the slices reflow into a Nutrition Facts label → NUTRIENTS.
// ------------------------------------------------------------------------------------------------

const BW = PANEL.w;
const BH = PANEL.h - PANEL.head;

// eggplant in its own coords (0..400 x 0..540), drawn at scale S, offset O
const S = 1.3;
const OX = BW / 2 - 215 * S;
const OY = 34;
const BODY =
  'M196,118 C236,116 256,146 262,190 C270,250 304,282 334,332 C370,394 372,478 326,524 C284,566 190,572 132,540 C78,510 64,440 88,380 C106,334 134,300 140,246 C146,188 156,120 196,118 Z';
const CALYX =
  'M196,104 C166,104 140,118 122,150 C142,142 156,146 164,160 C158,182 146,202 128,216 C156,212 178,196 190,176 C194,196 194,218 188,240 C206,220 212,196 210,176 C222,196 244,210 270,214 C256,198 246,180 242,160 C252,148 268,146 282,152 C262,120 232,104 196,104 Z';
const STEM = 'M198,108 C194,78 202,54 226,36';
const SHINE = 'M118,420 C112,462 132,500 170,520';
const ANCHORS: [number, number, number, number][] = [
  // anchor x,y and one handle x,y (for the editor overlay)
  [196, 118, 236, 116],
  [262, 190, 270, 250],
  [334, 332, 370, 394],
  [326, 524, 284, 566],
  [132, 540, 78, 510],
  [88, 380, 106, 334],
  [140, 246, 146, 188],
];

const DRAW0 = 75.42, DRAW1 = 76.12;
const FILL0 = 75.98, FILL1 = 76.28;
const CHOP = 76.31;
const FLOW0 = 76.4;
const STAMP = 76.96;

// Nutrition label rows (eggplant, raw, 1 cup cubes ~82 g)
type Row = {l: string; v?: string; dv?: string; h: number; bold?: boolean; big?: boolean; indent?: boolean; rule?: number};
const K = 1.32; // label scale
const ROWS: Row[] = [
  {l: 'Nutrition Facts', h: 78 * K, big: true, rule: 3},
  {l: 'Serving size', v: '1 cup (82 g)', h: 50 * K, bold: true, rule: 14},
  {l: 'Calories', v: '20', h: 64 * K, bold: true, rule: 8},
  {l: 'Total Fat', v: '0.1 g', dv: '0%', h: 48 * K, bold: true, rule: 2},
  {l: 'Sodium', v: '2 mg', dv: '0%', h: 48 * K, bold: true, rule: 2},
  {l: 'Total Carbohydrate', v: '4.8 g', dv: '2%', h: 48 * K, bold: true, rule: 2},
  {l: 'Dietary Fiber', v: '2.5 g', dv: '9%', h: 48 * K, indent: true, rule: 2},
  {l: 'Potassium', v: '188 mg', dv: '4%', h: 48 * K, rule: 2},
  {l: 'Manganese', v: '0.2 mg', dv: '8%', h: 48 * K, rule: 12},
];
const TX = 64, TW = BW - 128, TY = 40;

const rowY = (i: number) => TY + ROWS.slice(0, i).reduce((a, r) => a + r.h + (r.rule ?? 0), 0);

/** affine transform mapping rect A to rect B (as an SVG transform string) */
const mapRect = (a: [number, number, number, number], b: [number, number, number, number]) => {
  const sx = b[2] / a[2], sy = b[3] / a[3];
  return `translate(${b[0]} ${b[1]}) scale(${sx} ${sy}) translate(${-a[0]} ${-a[1]})`;
};

const EggplantShapes: React.FC<{fillK: number; shineK: number}> = ({fillK, shineK}) => (
  <>
    <path d={BODY} fill="url(#egg)" opacity={fillK} />
    <path d={CALYX} fill="#6E9A4E" opacity={fillK} />
    <path d={STEM} stroke="#6E9A4E" strokeWidth={14} strokeLinecap="round" fill="none" opacity={fillK} />
    <path d={SHINE} stroke="#fff" strokeWidth={12} strokeLinecap="round" fill="none" opacity={0.45 * shineK} />
  </>
);

export const EggplantArtifact: React.FC<{t: number}> = ({t}) => {
  const draw = (a: number, b: number) => ease.inOutCubic(seg(t, a, b));
  const pBody = draw(DRAW0, DRAW0 + 0.55);
  const pCalyx = draw(DRAW0 + 0.38, DRAW1);
  const pStem = draw(DRAW0 + 0.5, DRAW1);
  const fillK = ease.outCubic(seg(t, FILL0, FILL1));
  const shineK = seg(t, FILL1 - 0.05, FILL1 + 0.1);
  const handlesK = seg(t, DRAW0, DRAW0 + 0.1) * (1 - seg(t, FILL0, FILL1));
  const chopK = t >= CHOP ? 1 : 0;
  // slices: body region y 46..532 (eggplant coords) into ROWS.length bands
  const n = ROWS.length;
  const y0 = 34, y1 = 572;
  const bands = Array.from({length: n}, (_, i) => {
    const a = y0 + ((y1 - y0) * i) / n;
    const b = y0 + ((y1 - y0) * (i + 1)) / n;
    return [a, b];
  });
  const flowing = t >= FLOW0;
  const stampK = ease.outBack(seg(t, STAMP, STAMP + 0.2));
  return (
    <svg width={BW} height={BH} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <defs>
        <linearGradient id="egg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8A55B8" />
          <stop offset="55%" stopColor="#5E3290" />
          <stop offset="100%" stopColor="#3B1C5E" />
        </linearGradient>
        {bands.map(([a, b], i) => (
          <clipPath key={i} id={`band${i}`}>
            <rect x={-40} y={a} width={480} height={b - a + 0.6} />
          </clipPath>
        ))}
      </defs>
      {/* faint artboard grid */}
      <g opacity={0.5 * (1 - seg(t, FLOW0, FLOW0 + 0.3))}>
        {Array.from({length: 18}, (_, i) => (
          <line key={'v' + i} x1={i * 50} y1={0} x2={i * 50} y2={BH} stroke={C.blue} strokeOpacity={0.1} />
        ))}
        {Array.from({length: 18}, (_, i) => (
          <line key={'h' + i} x1={0} y1={i * 50} x2={BW} y2={i * 50} stroke={C.blue} strokeOpacity={0.1} />
        ))}
      </g>

      {!flowing ? (
        <g transform={`translate(${OX} ${OY}) scale(${S})`}>
          <EggplantShapes fillK={fillK} shineK={shineK} />
          {/* outlines being drawn */}
          <path d={BODY} fill="none" stroke={C.ink} strokeWidth={3.2 / S} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - pBody} strokeLinejoin="round" opacity={1 - fillK * 0.7} />
          <path d={CALYX} fill="none" stroke={C.ink} strokeWidth={3 / S} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - pCalyx} opacity={1 - fillK * 0.7} />
          <path d={STEM} fill="none" stroke={C.ink} strokeWidth={3 / S} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - pStem} strokeLinecap="round" opacity={1 - fillK * 0.7} />
          {/* vector-editor handles */}
          {ANCHORS.map(([ax, ay, hx, hy], i) => {
            const on = pBody > i / ANCHORS.length ? 1 : 0;
            return (
              <g key={i} opacity={on * handlesK}>
                <line x1={ax} y1={ay} x2={hx} y2={hy} stroke={C.blue} strokeWidth={1.6 / S} />
                <circle cx={hx} cy={hy} r={5 / S} fill="#fff" stroke={C.blue} strokeWidth={2 / S} />
                <rect x={ax - 6 / S} y={ay - 6 / S} width={12 / S} height={12 / S} fill={C.blue} />
              </g>
            );
          })}
          {/* chop marks */}
          {chopK && t < FLOW0 + 0.02
            ? bands.slice(1).map(([a], i) => <line key={i} x1={50} y1={a} x2={390} y2={a} stroke="#fff" strokeWidth={4 / S} opacity={1 - seg(t, CHOP, FLOW0)} />)
            : null}
        </g>
      ) : null}

      {/* slices reflow into label rows */}
      {flowing
        ? bands.map(([a, b], i) => {
            const p = ease.inOutCubic(seg(t, FLOW0 + i * 0.035, FLOW0 + 0.32 + i * 0.035));
            const src: [number, number, number, number] = [OX + 60 * S, OY + a * S, 320 * S, (b - a) * S];
            const ry = rowY(i);
            const dst: [number, number, number, number] = [TX, ry, TW, ROWS[i].h];
            const cur: [number, number, number, number] = [lerp(src[0], dst[0], p), lerp(src[1], dst[1], p) + Math.sin(p * Math.PI) * (i - n / 2) * 6, lerp(src[2], dst[2], p), lerp(src[3], dst[3], p)];
            const sliceO = 1 - seg(p, 0.55, 0.95);
            return (
              <g key={i}>
                <g opacity={sliceO} transform={mapRect(src, cur)}>
                  <g transform={`translate(${OX} ${OY}) scale(${S})`} clipPath={`url(#band${i})`}>
                    <EggplantShapes fillK={1} shineK={1} />
                  </g>
                </g>
              </g>
            );
          })
        : null}

      {/* the label */}
      {flowing ? (
        <g fontFamily={F.sans} fill={C.ink}>
          <rect x={TX - 18} y={TY - 14} width={TW + 36} height={rowY(n) - TY + 28 + 66} fill="none" stroke={C.ink} strokeWidth={3.5} opacity={seg(t, FLOW0 + 0.3, FLOW0 + 0.45)} />
          {ROWS.map((r, i) => {
            const p = seg(t, FLOW0 + 0.2 + i * 0.035, FLOW0 + 0.36 + i * 0.035);
            const y = rowY(i);
            const base = y + r.h * 0.68;
            return (
              <g key={i} opacity={p}>
                <text x={TX + (r.indent ? 40 : 0)} y={base} fontSize={r.big ? 78 : r.l === 'Calories' ? 56 : 37} fontWeight={r.big ? 900 : r.bold ? 700 : 400} letterSpacing={r.big ? -1.5 : 0}>
                  {r.l}
                  {r.v && !r.big ? (
                    <tspan fontWeight={r.l === 'Calories' ? 800 : 400} dx={12}>
                      {r.l === 'Calories' ? '' : r.v}
                    </tspan>
                  ) : null}
                </text>
                {r.l === 'Calories' ? (
                  <text x={TX + TW} y={base} fontSize={64} fontWeight={800} textAnchor="end">
                    {Math.round(20 * seg(t, FLOW0 + 0.3, FLOW0 + 0.55))}
                  </text>
                ) : null}
                {r.dv ? (
                  <text x={TX + TW} y={base} fontSize={37} fontWeight={700} textAnchor="end">
                    {Math.round(parseInt(r.dv, 10) * seg(t, FLOW0 + 0.3 + i * 0.02, FLOW0 + 0.55 + i * 0.02))}%
                  </text>
                ) : null}
                {r.rule ? <rect x={TX} y={y + r.h} width={TW} height={r.rule} fill={C.ink} /> : null}
              </g>
            );
          })}
          <text x={TX} y={rowY(n) + 46} fontSize={28} fontStyle="italic" fontFamily={F.serif} fill={C.gray4} opacity={seg(t, FLOW0 + 0.5, FLOW0 + 0.7)}>
            * botanically, an eggplant is a berry.
          </text>
          {/* NUTRIENTS stamped into the header */}
          {t >= STAMP ? (
            <g transform={`translate(${TX + TW / 2} ${rowY(5)}) rotate(-11) scale(${lerp(2.2, 1, stampK)})`} opacity={clamp((t - STAMP) / 0.06)}>
              <rect x={-345} y={-62} width={690} height={120} rx={14} fill="rgba(255,255,255,0.88)" stroke={C.clay} strokeWidth={8} />
              <rect x={-333} y={-50} width={666} height={96} rx={9} fill="none" stroke={C.clay} strokeWidth={2.5} />
              <text x={0} y={32} textAnchor="middle" fontFamily={F.mono} fontWeight={800} fontSize={90} fill={C.clay} letterSpacing={4}>
                NUTRIENTS
              </text>
            </g>
          ) : null}
        </g>
      ) : null}
    </svg>
  );
};
