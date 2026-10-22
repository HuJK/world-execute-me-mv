import React from 'react';

export type SceneDef = {
  id: string;
  start: number; // absolute seconds (inclusive)
  end: number; // absolute seconds (exclusive)
  preroll?: number; // render this many seconds before start (for overlaps)
  tail?: number; // render this many seconds after end
  z?: number;
  component: React.FC<{t: number}>;
};

// Scenes receive absolute song time t (seconds). Boundaries are hard cuts unless preroll/tail is set.
import {S00Intro} from './S00_Intro';
import {S01Title} from './S01_Title';
import {S02Verse1} from './S02_Verse1';
import {S03Pre1} from './S03_Pre1';
import {S04Chorus1} from './S04_Chorus1';
import {S05Verse2} from './S05_Verse2';
import {S06Pre2} from './S06_Pre2';
import {S07Chorus2a} from './S07_Chorus2a';
import {S08Chorus2b} from './S08_Chorus2b';
import {S09Bridge} from './S09_Bridge';
import {S10Exec} from './S10_Exec';
import {S11Chorus3} from './S11_Chorus3';
import {S12Love} from './S12_Love';
import {S13Outro} from './S13_Outro';

export const SCENES: SceneDef[] = [
  {id: 'intro', start: 0, end: 15.0, component: S00Intro},
  {id: 'title', start: 15.0, end: 29.71, component: S01Title},
  {id: 'verse1', start: 29.71, end: 44.45, component: S02Verse1},
  {id: 'pre1', start: 44.45, end: 59.22, component: S03Pre1},
  {id: 'chorus1', start: 59.22, end: 74.05, component: S04Chorus1},
  {id: 'verse2', start: 74.05, end: 88.59, component: S05Verse2},
  {id: 'pre2', start: 88.59, end: 103.49, component: S06Pre2},
  {id: 'chorus2a', start: 103.49, end: 118.33, component: S07Chorus2a},
  {id: 'chorus2b', start: 118.33, end: 133.62, component: S08Chorus2b},
  {id: 'bridge', start: 133.62, end: 147.66, component: S09Bridge},
  {id: 'exec', start: 147.66, end: 162.63, component: S10Exec},
  {id: 'chorus3', start: 162.63, end: 177.25, component: S11Chorus3},
  {id: 'love', start: 177.25, end: 192.2, component: S12Love},
  {id: 'outro', start: 192.2, end: 212.33, component: S13Outro},
];
