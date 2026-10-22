import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import './fonts';
import {C} from './theme';
import {SCENES} from './scenes';

export const MV: React.FC<{only?: string; audio?: boolean; offset?: number}> = ({only, audio = true, offset = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps + offset;
  const active = SCENES.filter((s) => (!only || s.id === only) && t >= s.start - (s.preroll ?? 0) && t < s.end + (s.tail ?? 0));
  return (
    <AbsoluteFill style={{background: C.ink, overflow: 'hidden'}}>
      {active.map((s) => {
        const Comp = s.component;
        return (
          <AbsoluteFill key={s.id} style={{zIndex: s.z ?? 0}}>
            <Comp t={t} />
          </AbsoluteFill>
        );
      })}
      {audio && !offset ? <Audio src={staticFile('audio/song.m4a')} /> : null}
    </AbsoluteFill>
  );
};
