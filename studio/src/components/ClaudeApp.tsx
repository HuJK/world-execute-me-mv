import React from 'react';
import {C, F} from '../theme';
import {clamp, ease, mix, seg} from '../lib/anim';
import {Flower} from './Flower';
import {IArrowUp, IArtifact, IChat, IChevron, ICode, ICopy, IFolder, IPlus, IRetry, ISearch, ISidebar, ISliders, IThumbDown, IThumbUp} from './Icons';

export type TimedWord = {w: string; s: number};

export type Msg =
  | {kind: 'user'; text: string; at?: number}
  | {
      kind: 'claude';
      words?: TimedWord[];
      text?: string;
      at?: number; // appear time (for text without words: start of stream)
      dur?: number; // stream duration for plain text
      done?: number; // time the stream completes (spark settles)
      actions?: boolean | number; // show action row (number = time it appears)
      thumbs?: 'up' | 'down' | null;
      thumbsAt?: number;
      hover?: 'up' | 'down' | 'copy' | null;
      size?: number; // font size multiplier
      color?: string;
    }
  | {kind: 'node'; node: React.ReactNode; at?: number; align?: 'left' | 'right' | 'center'}
  | {kind: 'tool'; label: string; at?: number; doneAt?: number; error?: boolean}
  | {kind: 'artifact'; title: string; type: string; at?: number};

export type AppTheme = ReturnType<typeof appTheme>;
export const appTheme = (dark: number) => ({
  page: mix('#FAF9F5', '#262624', dark),
  sidebar: mix('#F5F4ED', '#1F1E1D', dark),
  raised: mix('#FFFFFF', '#30302E', dark),
  bubble: mix('#F0EEE6', '#141413', dark),
  text: mix('#141413', '#FAF9F5', dark),
  text2: mix('#3D3D3A', '#C2C0B6', dark),
  muted: mix('#73726C', '#9C9A92', dark),
  hair: dark > 0.5 ? 'rgba(222,220,209,0.15)' : 'rgba(31,30,29,0.13)',
  hair2: dark > 0.5 ? 'rgba(222,220,209,0.28)' : 'rgba(31,30,29,0.22)',
  brand: '#C6613F',
  clay: C.clay,
});

type ComposerProps = {
  text?: string;
  typeFrom?: number;
  typeTo?: number;
  placeholder?: string;
  sendPulse?: number; // time of send press
  streaming?: boolean;
  opacity?: number;
  highlight?: number; // 0..1 glow border
};

export type AppProps = {
  t: number;
  width?: number;
  height?: number;
  zoom?: number;
  dark?: number;
  sidebar?: number; // 0..1
  header?: number; // 0..1
  home?: boolean;
  greeting?: string;
  greetingOpacity?: number;
  greetFlower?: React.ReactNode; // custom flower node in greeting
  hideGreetFlower?: boolean;
  messages?: Msg[];
  messagesOpacity?: number;
  scrollY?: number;
  composer?: ComposerProps;
  composerOpacity?: number;
  recents?: string[];
  recentsOffset?: number;
  title?: string;
  children?: React.ReactNode; // overlay inside main pane
  style?: React.CSSProperties;
  radius?: number;
  sidebarOverlay?: React.ReactNode;
  disclaimer?: boolean;
};

export const DEFAULT_RECENTS = [
  'world.execute(me)',
  'Explain sine waves like I am five',
  'Help me write a birthday poem',
  'Debug my recursive function',
  'Eggplant recipes for dinner',
  'Is it normal to miss someone?',
  'Plan a trip to Kyoto',
  'Why do cats purr?',
  'Draft an apology email',
  'What is a context window?',
  'Summarize this paper on optics',
  'Make a tiny game in HTML',
];

const MsgWrap: React.FC<{t: number; at?: number; children: React.ReactNode; align?: string}> = ({t, at, children, align}) => {
  const p = at === undefined ? 1 : clamp((t - at) / 0.28);
  if (p <= 0) return null;
  const e = ease.outCubic(p);
  return (
    <div style={{display: 'grid', gridTemplateRows: `${e}fr`, width: '100%'}}>
      <div style={{minHeight: 0, overflow: 'visible'}}>
        <div style={{opacity: e, transform: `translateY(${(1 - e) * 18}px)`, display: 'flex', justifyContent: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start'}}>
          {children}
        </div>
      </div>
    </div>
  );
};

export const MessageSpark: React.FC<{t: number; size: number; streaming: boolean; doneAt?: number}> = ({t, size, streaming, doneAt}) => {
  // our flower plays the role of the claude.ai message spark: wobbling while writing, settles when done
  const wob = streaming ? 1 : clamp(1 - (t - (doneAt ?? t)) / 0.5);
  const petals = Array.from({length: 12}, (_, i) => ({
    scale: 1 + wob * 0.22 * Math.sin(t * 11 + i * 1.9),
    rot: wob * 6 * Math.sin(t * 7 + i),
  }));
  return <Flower size={size} open={1} petals={petals} spin={streaming ? t * 40 : 0} shade={null} centerScale={0.9} />;
};

export const ClaudeApp: React.FC<AppProps> = ({
  t,
  width = 1920,
  height = 1080,
  zoom = 1.5,
  dark = 0,
  sidebar = 1,
  header = 1,
  home = false,
  greeting = 'Good evening',
  greetingOpacity = 1,
  greetFlower,
  hideGreetFlower,
  messages = [],
  messagesOpacity = 1,
  scrollY = 0,
  composer = {},
  composerOpacity = 1,
  recents = DEFAULT_RECENTS,
  recentsOffset = 0,
  title = 'world.execute(me)',
  children,
  style,
  radius = 0,
  sidebarOverlay,
  disclaimer = true,
}) => {
  const z = zoom;
  const th = appTheme(dark);
  const sbW = 264 * z * clamp(sidebar);
  const mainW = width - sbW;
  const colW = Math.min(760 * z, mainW - 80 * z);
  const fs = 16 * z;

  // ---------- composer
  const typedLen = composer.text
    ? composer.typeFrom !== undefined
      ? Math.floor(seg(t, composer.typeFrom, composer.typeTo ?? composer.typeFrom + 0.6) * composer.text.length + 1e-6)
      : composer.text.length
    : 0;
  const typed = composer.text ? composer.text.slice(0, typedLen) : '';
  const blink = Math.floor(t * 2.1) % 2 === 0;
  const sendK = composer.sendPulse !== undefined ? clamp(1 - Math.abs(t - composer.sendPulse) / 0.15) : 0;
  const hasText = typed.length > 0;
  const composerNode = (
    <div
      style={{
        width: colW,
        background: th.raised,
        borderRadius: 20 * z,
        border: `${1 * z}px solid ${th.hair2}`,
        boxShadow: `0 ${4 * z}px ${18 * z}px rgba(0,0,0,${0.05 + dark * 0.15})${composer.highlight ? `, 0 0 ${30 * z * composer.highlight}px ${C.clay}` : ''}`,
        padding: `${14 * z}px ${16 * z}px ${12 * z}px`,
        opacity: composerOpacity * (composer.opacity ?? 1),
        fontFamily: F.sans,
      }}
    >
      <div style={{fontSize: fs, color: hasText ? th.text : th.muted, minHeight: fs * 1.6, lineHeight: 1.5, whiteSpace: 'pre-wrap'}}>
        {hasText ? typed : composer.placeholder ?? (home ? 'How can I help you today?' : 'Reply to Claude…')}
        {(hasText || composer.typeFrom !== undefined) && t < (composer.sendPulse ?? 1e9) ? (
          <span style={{color: C.blue, opacity: blink || (composer.typeTo !== undefined && t < composer.typeTo) ? 1 : 0, marginLeft: 1}}>|</span>
        ) : null}
      </div>
      <div style={{display: 'flex', alignItems: 'center', marginTop: 10 * z, gap: 8 * z}}>
        <div style={{width: 32 * z, height: 32 * z, borderRadius: 8 * z, border: `${1 * z}px solid ${th.hair2}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <IPlus size={18 * z} color={th.text2} />
        </div>
        <div style={{width: 32 * z, height: 32 * z, borderRadius: 8 * z, border: `${1 * z}px solid ${th.hair2}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <ISliders size={18 * z} color={th.text2} />
        </div>
        <div style={{flex: 1}} />
        <div style={{fontSize: 14 * z, color: th.text2, display: 'flex', alignItems: 'center', gap: 4 * z}}>
          Opus 5.5 <IChevron size={14 * z} color={th.text2} />
        </div>
        <div
          style={{
            width: 32 * z,
            height: 32 * z,
            borderRadius: 8 * z,
            background: composer.streaming ? th.text : th.brand,
            opacity: composer.streaming ? 0.9 : hasText ? 1 : 0.45,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${1 - sendK * 0.18})`,
            boxShadow: sendK > 0 ? `0 0 ${24 * z * sendK}px ${C.clay}` : undefined,
          }}
        >
          {composer.streaming ? (
            <div style={{width: 10 * z, height: 10 * z, background: th.page, borderRadius: 2 * z}} />
          ) : (
            <IArrowUp size={18 * z} color="#fff" stroke={2.2} />
          )}
        </div>
      </div>
    </div>
  );

  // ---------- messages
  const renderMsg = (m: Msg, i: number) => {
    if (m.kind === 'user') {
      return (
        <MsgWrap key={i} t={t} at={m.at} align="right">
          <div
            style={{
              maxWidth: colW * 0.85,
              background: th.bubble,
              borderRadius: 18 * z,
              padding: `${10 * z}px ${16 * z}px`,
              fontFamily: F.sans,
              fontSize: fs,
              lineHeight: 1.5,
              color: th.text,
            }}
          >
            {m.text}
          </div>
        </MsgWrap>
      );
    }
    if (m.kind === 'claude') {
      let content: React.ReactNode;
      let streaming = false;
      const start = m.words?.length ? m.words[0].s - 0.05 : m.at ?? 0;
      if (t < start - 0.3) return null;
      if (m.words) {
        const last = m.words[m.words.length - 1].s;
        streaming = t < (m.done ?? last + 0.3);
        content = m.words.map((w, k) => {
          const p = clamp((t - w.s) / 0.12);
          return (
            <span key={k} style={{opacity: p, filter: p < 1 ? `blur(${(1 - p) * 3}px)` : undefined}}>
              {w.w}
              {k < m.words!.length - 1 ? ' ' : ''}
            </span>
          );
        });
      } else {
        const txt = m.text ?? '';
        const d = m.dur ?? Math.max(0.4, txt.length * 0.012);
        const n = Math.floor(seg(t, start, start + d) * txt.length + 1e-6);
        streaming = t < (m.done ?? start + d + 0.25);
        content = txt.slice(0, n);
      }
      const doneAt = m.done ?? (m.words ? m.words[m.words.length - 1].s + 0.3 : start + (m.dur ?? 0.5) + 0.25);
      const showActions = typeof m.actions === 'number' ? t >= m.actions : m.actions ? !streaming : false;
      const actA = typeof m.actions === 'number' ? clamp((t - m.actions) / 0.2) : clamp((t - doneAt) / 0.25);
      const thumbK = m.thumbsAt !== undefined ? clamp((t - m.thumbsAt) / 0.12) : m.thumbs ? 1 : 0;
      const iconS = 18 * z;
      const iconBox = (node: React.ReactNode, key: string, active = false, hover = false) => (
        <div
          key={key}
          style={{
            width: 30 * z,
            height: 30 * z,
            borderRadius: 7 * z,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: hover || active ? th.bubble : 'transparent',
            transform: active ? `scale(${1 + 0.35 * Math.exp(-Math.max(0, t - (m.thumbsAt ?? 0)) / 0.15)})` : undefined,
          }}
        >
          {node}
        </div>
      );
      return (
        <MsgWrap key={i} t={t} at={start - 0.05}>
          <div style={{width: colW, fontFamily: F.serif, fontSize: fs * 1.08 * (m.size ?? 1), lineHeight: 1.55, color: m.color ?? th.text}}>
            <div>{content}</div>
            <div style={{display: 'flex', alignItems: 'center', gap: 4 * z, marginTop: 10 * z, height: 32 * z}}>
              <div style={{width: 30 * z, display: 'flex', justifyContent: 'center'}}>
                <MessageSpark t={t} size={11 * z} streaming={streaming} doneAt={doneAt} />
              </div>
              {showActions ? (
                <div style={{display: 'flex', gap: 2 * z, opacity: actA}}>
                  {iconBox(<ICopy size={iconS} color={th.muted} />, 'c', false, m.hover === 'copy')}
                  {iconBox(<IThumbUp size={iconS} color={m.thumbs === 'up' && thumbK > 0 ? C.clay : th.muted} fill={m.thumbs === 'up' && thumbK > 0 ? C.clay : 'none'} />, 'u', m.thumbs === 'up' && thumbK > 0, m.hover === 'up')}
                  {iconBox(<IThumbDown size={iconS} color={m.thumbs === 'down' && thumbK > 0 ? C.clay : th.muted} />, 'd', m.thumbs === 'down' && thumbK > 0, m.hover === 'down')}
                  {iconBox(<IRetry size={iconS} color={th.muted} />, 'r')}
                </div>
              ) : null}
            </div>
          </div>
        </MsgWrap>
      );
    }
    if (m.kind === 'tool') {
      const done = m.doneAt !== undefined && t >= m.doneAt;
      return (
        <MsgWrap key={i} t={t} at={m.at}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10 * z,
              fontFamily: F.sans,
              fontSize: 14 * z,
              color: m.error && done ? C.red : th.muted,
              border: `${1 * z}px solid ${th.hair}`,
              borderRadius: 10 * z,
              padding: `${8 * z}px ${12 * z}px`,
            }}
          >
            <ICode size={16 * z} color={m.error && done ? C.red : th.muted} />
            <span>{m.label}</span>
            {done ? <span style={{color: m.error ? C.red : C.green}}>{m.error ? '✕' : '✓'}</span> : <Flower size={7 * z} spin={t * 200} shade={null} />}
          </div>
        </MsgWrap>
      );
    }
    if (m.kind === 'artifact') {
      return (
        <MsgWrap key={i} t={t} at={m.at}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12 * z,
              width: colW * 0.6,
              border: `${1 * z}px solid ${th.hair2}`,
              borderRadius: 12 * z,
              padding: `${10 * z}px ${12 * z}px`,
              background: th.raised,
              fontFamily: F.sans,
            }}
          >
            <div style={{width: 40 * z, height: 40 * z, borderRadius: 8 * z, background: th.bubble, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <IArtifact size={20 * z} color={th.text2} />
            </div>
            <div>
              <div style={{fontSize: 15 * z, color: th.text, fontWeight: 500}}>{m.title}</div>
              <div style={{fontSize: 13 * z, color: th.muted}}>{m.type}</div>
            </div>
          </div>
        </MsgWrap>
      );
    }
    return (
      <MsgWrap key={i} t={t} at={m.at} align={m.align}>
        {m.node}
      </MsgWrap>
    );
  };

  const navItem = (icon: React.ReactNode, label: string, key: string, extra?: React.CSSProperties) => (
    <div key={key} style={{display: 'flex', alignItems: 'center', gap: 12 * z, padding: `${7 * z}px ${10 * z}px`, borderRadius: 8 * z, color: th.text, fontSize: 15 * z, ...extra}}>
      {icon}
      <span>{label}</span>
    </div>
  );

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        background: th.page,
        overflow: 'hidden',
        borderRadius: radius,
        fontFamily: F.sans,
        ...style,
      }}
    >
      {/* sidebar */}
      {sidebar > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 264 * z,
            height,
            transform: `translateX(${-(1 - clamp(sidebar)) * 264 * z}px)`,
            background: th.sidebar,
            borderRight: `${1 * z}px solid ${th.hair}`,
            padding: `${14 * z}px ${12 * z}px`,
            boxSizing: 'border-box',
            overflow: 'hidden',
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${4 * z}px ${8 * z}px ${14 * z}px`}}>
            <div style={{fontFamily: F.serif, fontSize: 22 * z, color: th.text, fontWeight: 500, letterSpacing: '-0.01em'}}>Claude</div>
            <ISidebar size={20 * z} color={th.muted} />
          </div>
          {navItem(
            <div style={{width: 26 * z, height: 26 * z, borderRadius: 13 * z, background: C.clay, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <IPlus size={16 * z} color="#fff" stroke={2.4} />
            </div>,
            'New chat',
            'n',
            {fontWeight: 500},
          )}
          {navItem(<ISearch size={20 * z} color={th.text2} />, 'Search', 's')}
          {navItem(<IChat size={20 * z} color={th.text2} />, 'Chats', 'c')}
          {navItem(<IFolder size={20 * z} color={th.text2} />, 'Projects', 'p')}
          {navItem(<IArtifact size={20 * z} color={th.text2} />, 'Artifacts', 'a')}
          {navItem(<ICode size={20 * z} color={th.text2} />, 'Code', 'cd')}
          <div style={{fontSize: 12.5 * z, color: th.muted, padding: `${18 * z}px ${10 * z}px ${6 * z}px`}}>Recents</div>
          <div style={{position: 'relative', height: height - 470 * z, overflow: 'hidden'}}>
            <div style={{transform: `translateY(${-recentsOffset}px)`}}>
              {recents.map((r, i) => (
                <div
                  key={i}
                  style={{
                    padding: `${6 * z}px ${10 * z}px`,
                    fontSize: 14 * z,
                    color: r.startsWith('§') ? th.muted : th.text2,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    borderRadius: 8 * z,
                    background: i === 0 && !r.startsWith('§') ? th.bubble : 'transparent',
                    fontWeight: r.startsWith('§') ? 500 : 400,
                    marginTop: r.startsWith('§') ? 10 * z : 0,
                  }}
                >
                  {r.replace('§', '')}
                </div>
              ))}
            </div>
          </div>
          <div style={{position: 'absolute', left: 12 * z, right: 12 * z, bottom: 14 * z, display: 'flex', alignItems: 'center', gap: 10 * z, padding: `${8 * z}px`, borderTop: `${1 * z}px solid ${th.hair}`}}>
            <div style={{width: 32 * z, height: 32 * z, borderRadius: 16 * z, background: C.blue, color: '#fff', fontSize: 14 * z, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Y</div>
            <div>
              <div style={{fontSize: 14 * z, color: th.text}}>You</div>
              <div style={{fontSize: 12 * z, color: th.muted}}>Max plan</div>
            </div>
          </div>
          {sidebarOverlay}
        </div>
      ) : null}

      {/* main */}
      <div style={{position: 'absolute', left: sbW, top: 0, width: mainW, height}}>
        {!home && header > 0.001 ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: 56 * z,
              display: 'flex',
              alignItems: 'center',
              padding: `0 ${20 * z}px`,
              opacity: header,
              color: th.text,
              fontSize: 15 * z,
              gap: 6 * z,
            }}
          >
            <span>{title}</span>
            <IChevron size={14 * z} color={th.muted} />
            <div style={{flex: 1}} />
            <div style={{border: `${1 * z}px solid ${th.hair2}`, borderRadius: 8 * z, padding: `${5 * z}px ${12 * z}px`, fontSize: 13.5 * z}}>Share</div>
          </div>
        ) : null}
        {home ? (
          <div style={{position: 'absolute', left: 0, right: 0, top: height * 0.3, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14 * z, opacity: greetingOpacity, marginBottom: 30 * z}}>
              {hideGreetFlower ? <div style={{width: 40 * z, height: 40 * z}} /> : greetFlower ?? <Flower size={19 * z} open={1} shade={null} />}
              <div style={{fontFamily: F.serif, fontSize: 40 * z, fontWeight: 300, color: th.text2, letterSpacing: '-0.01em'}}>{greeting}</div>
            </div>
            {composerNode}
            <div style={{display: 'flex', gap: 8 * z, marginTop: 16 * z, opacity: composerOpacity}}>
              {['Write', 'Learn', 'Code', 'Life stuff', "Claude's choice"].map((c) => (
                <div key={c} style={{border: `${1 * z}px solid ${th.hair2}`, borderRadius: 9 * z, padding: `${6 * z}px ${12 * z}px`, fontSize: 13.5 * z, color: th.text2}}>
                  {c}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                position: 'absolute',
                left: (mainW - colW) / 2,
                width: colW,
                bottom: 150 * z,
                top: 56 * z,
                overflow: 'hidden',
                opacity: messagesOpacity,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                maskImage: `linear-gradient(to bottom, transparent 0, black ${40 * z}px)`,
              }}
            >
              <div style={{display: 'flex', flexDirection: 'column', gap: 22 * z, transform: `translateY(${-scrollY}px)`}}>{messages.map(renderMsg)}</div>
            </div>
            <div style={{position: 'absolute', left: (mainW - colW) / 2, bottom: 34 * z}}>{composerNode}</div>
            {disclaimer ? (
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 10 * z, textAlign: 'center', fontSize: 11.5 * z, color: th.muted, opacity: composerOpacity}}>
                Claude is AI and can make mistakes. Please double-check responses.
              </div>
            ) : null}
          </>
        )}
        {children}
      </div>
    </div>
  );
};
