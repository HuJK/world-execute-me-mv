import React from 'react';
import {C, F} from '../../theme';
import {clamp, lerp} from '../../lib/anim';
import {ClaudeApp} from '../../components/ClaudeApp';

// Claude's own desktop window (dark claude.ai home), laid out at ~1920×1080 and scaled into its window rect,
// so "maximize" is a pure scale/rect interpolation. Shared by S10 (end) and S11.

export type Rect = {x: number; y: number; w: number; h: number};
export const CW_RECT: Rect = {x: 620, y: 290, w: 680, h: 420};
export const CW_SCALE = 0.36; // layout→screen scale when windowed
export const FULL_RECT: Rect = {x: 0, y: 0, w: 1920, h: 1080};
export const lerpRect = (a: Rect, b: Rect, k: number): Rect => ({x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k), h: lerp(a.h, b.h, k)});

const Z = 1.25;
const SB = 264 * Z; // sidebar width in layout px

/** layout→screen mapping for a point in the window's main pane (layout coords relative to window content) */
export const cwMap = (rect: Rect, maxK: number, lx: number, ly: number) => {
  const bar = 34 * (1 - clamp(maxK));
  const s = lerp(CW_SCALE, 1, clamp(maxK));
  return {x: rect.x + lx * s, y: rect.y + bar + ly * s, s};
};
/** layout geometry of the main pane centre */
export const cwMainCenter = (rect: Rect, maxK: number) => {
  const s = lerp(CW_SCALE, 1, clamp(maxK));
  const lw = rect.w / s;
  return SB + (lw - SB) / 2;
};

export const ClaudeWindow: React.FC<{
  t: number;
  rect: Rect;
  maxK?: number; // 0 windowed → 1 maximized (chrome gone)
  opacity?: number;
  border?: number; // clay border glow 0..1
  greenPress?: number; // 0..1 maximize button press
  children?: React.ReactNode; // overlay in layout coords of the main pane
  composerText?: string;
}> = ({t, rect, maxK = 0, opacity = 1, border = 0, greenPress = 0, children}) => {
  const k = clamp(maxK);
  const bar = 34 * (1 - k);
  const s = lerp(CW_SCALE, 1, k);
  const lw = rect.w / s;
  const lh = (rect.h - bar) / s;
  const radius = 14 * (1 - k);
  return (
    <div
      style={{
        position: 'absolute',
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        borderRadius: radius,
        overflow: 'hidden',
        background: '#1c1c1b',
        opacity,
        boxShadow: `0 30px 80px rgba(0,0,0,${0.55 * (1 - k)}), 0 0 ${40 * border}px rgba(217,119,87,${0.7 * border})`,
        border: `1px solid ${border > 0.05 ? `rgba(217,119,87,${0.4 + 0.6 * border})` : '#3a3a38'}`,
        boxSizing: 'border-box',
      }}
    >
      {bar > 0.5 ? (
        <div style={{height: bar, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', background: '#262624', borderBottom: '1px solid #3a3a38', overflow: 'hidden'}}>
          <div style={{width: 12, height: 12, borderRadius: 6, background: '#E7675B'}} />
          <div style={{width: 12, height: 12, borderRadius: 6, background: '#E9B44C'}} />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              background: '#6DBF67',
              transform: `scale(${1 + greenPress * 0.6})`,
              boxShadow: greenPress > 0 ? `0 0 ${14 * greenPress}px #6DBF67` : undefined,
            }}
          />
          <div style={{flex: 1, textAlign: 'center', fontSize: 14, color: '#C2C0B6', fontFamily: F.sans, marginRight: 50}}>Claude</div>
          <div style={{width: 10, height: 10, borderRadius: 5, background: C.clay}} />
        </div>
      ) : null}
      <div style={{position: 'absolute', left: 0, top: bar, width: lw, height: lh, transform: `scale(${s})`, transformOrigin: '0 0'}}>
        <ClaudeApp t={t} width={lw} height={lh} zoom={Z} dark={1} home greeting=" " greetingOpacity={0} hideGreetFlower composer={{placeholder: 'How can I help you today?'}}>
          {children}
        </ClaudeApp>
      </div>
    </div>
  );
};
