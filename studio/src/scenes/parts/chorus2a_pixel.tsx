import React, {useLayoutEffect, useRef} from 'react';

// Low-resolution text: the string is rasterised on a tiny canvas (font size / block), hard-thresholded to
// 1-bit, then scaled back up with nearest-neighbour sampling → chunky pixel lettering of the same typeface.
// block <= 1 renders normal (smooth) DOM text. Deterministic: pure function of props.

type Props = {
  text: string;
  size: number; // display font size (px)
  block: number; // pixel block size (px); 1 = smooth
  color: string;
  family: string;
  weight?: number;
  italic?: boolean;
  letterSpacing?: number; // em
  threshold?: number; // 0..255 alpha cut
  style?: React.CSSProperties;
  glow?: string;
};

export const PixelText: React.FC<Props> = ({text, size, block, color, family, weight = 400, italic = false, letterSpacing = 0, threshold = 110, style, glow}) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const b = Math.max(1, block);
  const fs = size / b;
  const font = `${italic ? 'italic ' : ''}${weight} ${fs}px ${family}`;
  // measure synchronously with a shared offscreen canvas
  const measure = () => {
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d')!;
    ctx.font = font;
    (ctx as any).letterSpacing = `${letterSpacing * fs}px`;
    return ctx.measureText(text).width;
  };
  const tw = b > 1 ? measure() : 0;
  const cw = Math.ceil(tw + fs * 0.4) + 2;
  const ch = Math.ceil(fs * 1.35) + 2;
  useLayoutEffect(() => {
    if (b <= 1) return;
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    ctx.clearRect(0, 0, cw, ch);
    ctx.font = font;
    (ctx as any).letterSpacing = `${letterSpacing * fs}px`;
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, fs * 0.2 + 1, fs * 1.02 + 1);
    const img = ctx.getImageData(0, 0, cw, ch);
    const d = img.data;
    const r = parseInt(color.slice(1, 3), 16), g = parseInt(color.slice(3, 5), 16), bl = parseInt(color.slice(5, 7), 16);
    for (let i = 0; i < d.length; i += 4) {
      const on = d[i + 3] > threshold;
      d[i] = r;
      d[i + 1] = g;
      d[i + 2] = bl;
      d[i + 3] = on ? 255 : 0;
    }
    ctx.putImageData(img, 0, 0);
  });
  if (b <= 1) {
    return (
      <span
        style={{
          fontFamily: family,
          fontWeight: weight,
          fontStyle: italic ? 'italic' : 'normal',
          fontSize: size,
          color,
          letterSpacing: `${letterSpacing}em`,
          whiteSpace: 'pre',
          lineHeight: 1,
          display: 'inline-block',
          textShadow: glow ? `0 0 ${size * 0.25}px ${glow}` : undefined,
          ...style,
        }}
      >
        {text}
      </span>
    );
  }
  return (
    <canvas
      ref={ref}
      width={cw}
      height={ch}
      style={{
        width: cw * b,
        height: ch * b,
        imageRendering: 'pixelated',
        display: 'inline-block',
        // align roughly like text: baseline at fs*1.02 blocks
        marginTop: -(fs * 0.2) * b,
        marginBottom: -(ch - fs * 1.1) * b,
        filter: glow ? `drop-shadow(0 0 ${size * 0.2}px ${glow})` : undefined,
        ...style,
      }}
    />
  );
};
