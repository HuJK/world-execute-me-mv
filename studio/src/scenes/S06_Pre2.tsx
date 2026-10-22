import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../theme';
import {Grain} from '../components/FX';
import {CoinShot} from './parts/pre2_coin';
import {TasksShot} from './parts/pre2_tasks';
import {RolesShot} from './parts/pre2_roles';
import {TranceShot} from './parts/pre2_trance';

// ---------------------------------------------------------------------------------------------
// 88.59–103.49  PRE-CHORUS 2
//  88.59 coin toss (F 90.63 / M 91.67) → 92.02 task montage + Clawd → 93.95 flower clock AM→PM
//  → 95.47 diagonal split, roles swap, S 98.11 / M 99.03 → 99.35 kaleidoscope trance → white-out
// ---------------------------------------------------------------------------------------------
export const S06Pre2: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: C.ink}}>
    {t < 95.9 ? <TasksShot t={t} /> : null}
    {t >= 95.47 && t < 99.9 ? <RolesShot t={t} /> : null}
    {t >= 99.3 ? <TranceShot t={t} /> : null}
    {t < 92.02 ? <CoinShot t={t} /> : null}
    <Grain t={t} opacity={0.04} />
  </AbsoluteFill>
);
