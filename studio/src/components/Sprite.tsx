import React from 'react';
import {Img, staticFile} from 'remotion';
import {clamp, ease, lerp, noise1, springy} from '../lib/anim';
import {ar as arOf} from '../data/images';

export type EnterKind = 'pop' | 'fade' | 'rise' | 'drop' | 'wipeUp' | 'wipeLeft' | 'wipeRight' | 'zoom' | 'spin' | 'iris' | 'none';
export type Motion = {at: number; dur?: number; kind?: EnterKind};

type SpriteProps = {
  src: string; // path under public/
  t: number;
  x: number; // anchor position (px)
  y: number;
  h: number; // rendered height px
  ar?: number; // aspect ratio w/h (defaults from known table)
  anchor?: [number, number]; // 0..1 of image box, default bottom-center
  enter?: Motion;
  exit?: Motion;
  float?: number; // px amplitude of idle float
  breathe?: number; // scale amplitude
  sway?: number; // deg amplitude
  flip?: boolean;
  rotate?: number;
  scale?: number;
  opacity?: number;
  filter?: string;
  seed?: number;
  shadow?: boolean | string;
  style?: React.CSSProperties;
  silhouette?: string; // render as flat color silhouette
  outline?: string; // white sticker outline color
  outlineWidth?: number;
};

const ARS: Record<string, number> = {};
export const registerAspect = (src: string, ar: number) => (ARS[src] = ar);

export const Sprite: React.FC<SpriteProps> = ({
  src,
  t,
  x,
  y,
  h,
  ar,
  anchor = [0.5, 1],
  enter,
  exit,
  float = 0,
  breathe = 0,
  sway = 0,
  flip = false,
  rotate = 0,
  scale = 1,
  opacity = 1,
  filter,
  seed = 1,
  shadow,
  style,
  silhouette,
  outline,
  outlineWidth = 6,
}) => {
  const aspect = ar ?? ARS[src] ?? arOf(src);
  const w = h * aspect;
  let s = scale, o = opacity, tx = 0, ty = 0, rot = rotate, clip: string | undefined, blur = 0;
  if (enter && enter.kind !== 'none') {
    const d = enter.dur ?? 0.45;
    const dt = t - enter.at;
    if (dt < 0) return null;
    const p = clamp(dt / d);
    switch (enter.kind ?? 'pop') {
      case 'pop':
        s *= springy(dt, 2.6, 6.5);
        o *= clamp(dt / 0.08);
        break;
      case 'fade':
        o *= p;
        break;
      case 'rise':
        ty += (1 - ease.outCubic(p)) * h * 0.25;
        o *= clamp(p * 2);
        break;
      case 'drop':
        ty -= (1 - ease.outBounce(p)) * h * 0.6;
        o *= clamp(p * 4);
        break;
      case 'zoom':
        s *= lerp(1.6, 1, ease.outQuart(p));
        o *= p;
        blur = (1 - p) * 12;
        break;
      case 'spin':
        s *= ease.outBack(p);
        rot += (1 - ease.outCubic(p)) * -200;
        break;
      case 'wipeUp':
        clip = `inset(${(1 - ease.outCubic(p)) * 100}% 0 0 0)`;
        break;
      case 'wipeLeft':
        clip = `inset(0 0 0 ${(1 - ease.outCubic(p)) * 100}%)`;
        break;
      case 'wipeRight':
        clip = `inset(0 ${(1 - ease.outCubic(p)) * 100}% 0 0)`;
        break;
      case 'iris':
        clip = `circle(${ease.outCubic(p) * 75}% at 50% 45%)`;
        break;
    }
  }
  if (exit && exit.kind !== 'none') {
    const d = exit.dur ?? 0.35;
    const dt = t - exit.at;
    if (dt > d) return null;
    if (dt > 0) {
      const p = clamp(dt / d);
      switch (exit.kind ?? 'fade') {
        case 'pop':
          s *= 1 - ease.inBack(p);
          break;
        case 'fade':
          o *= 1 - p;
          break;
        case 'rise':
          ty -= ease.inCubic(p) * h * 0.3;
          o *= 1 - p;
          break;
        case 'drop':
          ty += ease.inCubic(p) * h * 0.8;
          break;
        case 'zoom':
          s *= lerp(1, 1.5, ease.inCubic(p));
          o *= 1 - p;
          break;
        case 'spin':
          s *= 1 - ease.inBack(p);
          rot += ease.inCubic(p) * 200;
          break;
        case 'wipeUp':
          clip = `inset(0 0 ${ease.inCubic(p) * 100}% 0)`;
          break;
        default:
          o *= 1 - p;
      }
    }
  }
  if (float) ty += noise1(t * 0.6, seed) * float + Math.sin(t * 1.3 + seed) * float * 0.5;
  if (sway) rot += Math.sin(t * 1.1 + seed * 2) * sway;
  if (breathe) s *= 1 + Math.sin(t * 2.2 + seed) * breathe;
  const filters = [] as string[];
  if (outline) {
    const ow = outlineWidth;
    filters.push(
      `drop-shadow(${ow}px 0 0 ${outline}) drop-shadow(-${ow}px 0 0 ${outline}) drop-shadow(0 ${ow}px 0 ${outline}) drop-shadow(0 -${ow}px 0 ${outline})`,
    );
  }
  if (shadow) filters.push(typeof shadow === 'string' ? shadow : 'drop-shadow(0 18px 24px rgba(20,20,19,0.25))');
  if (blur > 0.3) filters.push(`blur(${blur}px)`);
  if (filter) filters.push(filter);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - w * anchor[0],
        top: y - h * anchor[1],
        width: w,
        height: h,
        transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${s * (flip ? -1 : 1)}, ${s})`,
        transformOrigin: `${anchor[0] * 100}% ${anchor[1] * 100}%`,
        opacity: o,
        clipPath: clip,
        filter: filters.length ? filters.join(' ') : undefined,
        ...style,
      }}
    >
      {silhouette ? (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: silhouette,
            WebkitMaskImage: `url(${staticFile(src)})`,
            WebkitMaskSize: '100% 100%',
          }}
        />
      ) : (
        <Img src={staticFile(src)} style={{width: '100%', height: '100%', display: 'block'}} />
      )}
    </div>
  );
};
