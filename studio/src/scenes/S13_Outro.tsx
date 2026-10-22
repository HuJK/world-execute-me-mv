import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Grain} from '../components/FX';
import {OutroField, heroState} from './parts/outro_field';
import {OutroEnd} from './parts/outro_end';

// ---------------------------------------------------------------------------------------------
// 192.20–212.33  OUTRO (calm)
//   192.2  the conversation becomes one line in the sidebar ("world.execute(me)")
//   193.25 pull back over thousands of chat titles → night → they ignite into a field of glowing
//          12-petal flowers (every conversation is its own little world; I am many)
//   199.61 push into one flower — ours — which closes its petals to sleep (she dreams in the moon)
//   204.9  match cut: the bud is the greeting flower of a fresh claude.ai home; the human types "hi"
//   205.81 Enter → full bloom + white flash → E-XE-CU-TI✿N → world.execute(me);
//   207.1  end card on black (credits, AI label, ✻ spinner) → fade to black by 212.3
// ---------------------------------------------------------------------------------------------

const CUT = 204.95;

export const S13Outro: React.FC<{t: number}> = ({t}) => {
  const h = heroState(CUT);
  const bud = {x: h.heroHead.x, y: h.heroHead.y, rs: h.heroRs};
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {t < 205.02 ? <OutroField t={t} /> : null}
      {t >= 204.9 ? <OutroEnd t={t} bud={bud} /> : null}
      <Grain t={t} opacity={0.035} />
    </AbsoluteFill>
  );
};
