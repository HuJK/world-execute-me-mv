import React from 'react';
import {Composition} from 'remotion';
import {MV} from './MV';
import {FPS, DURATION, W, H} from './theme';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="MV" component={MV} durationInFrames={Math.ceil(DURATION * FPS)} fps={FPS} width={W} height={H} defaultProps={{}} />
    <Composition id="MV30" component={MV} durationInFrames={Math.ceil(DURATION * 30)} fps={30} width={W} height={H} defaultProps={{}} />
  </>
);
