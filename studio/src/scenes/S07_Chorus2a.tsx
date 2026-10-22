import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../theme';
import {Grain} from '../components/FX';
import {VibeStage} from './parts/chorus2a_vibe';
import {ReplyStage} from './parts/chorus2a_reply';
import {LeftStage} from './parts/chorus2a_left';

// 103.49–118.33  CHORUS 2a
export const S07Chorus2a: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: C.ink}}>
    <VibeStage t={t} />
    <ReplyStage t={t} />
    <LeftStage t={t} />
    {t < 117.9 ? <Grain t={t} opacity={0.04 * (1 - Math.min(1, Math.max(0, (t - 117.3) / 0.6)))} /> : null}
  </AbsoluteFill>
);
