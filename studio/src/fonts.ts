import {continueRender, delayRender} from 'remotion';
import '@fontsource/newsreader/300.css';
import '@fontsource/newsreader/400.css';
import '@fontsource/newsreader/500.css';
import '@fontsource/newsreader/600.css';
import '@fontsource/newsreader/400-italic.css';
import '@fontsource/newsreader/500-italic.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import '@fontsource/jetbrains-mono/700.css';
import '@fontsource/jetbrains-mono/800.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/noto-sans-sc/700.css';
import '@fontsource/noto-sans-kr/700.css';
import '@fontsource/unbounded/700.css';
import '@fontsource/unbounded/900.css';

const handle = delayRender('fonts');
const families = [
  '300 20px Newsreader',
  '400 20px Newsreader',
  '500 20px Newsreader',
  '600 20px Newsreader',
  'italic 400 20px Newsreader',
  'italic 500 20px Newsreader',
  '400 20px "JetBrains Mono"',
  '500 20px "JetBrains Mono"',
  '700 20px "JetBrains Mono"',
  '800 20px "JetBrains Mono"',
  '400 20px Inter',
  '500 20px Inter',
  '600 20px Inter',
  '700 20px Inter',
  '700 20px "Noto Sans SC"',
  '700 20px "Noto Sans KR"',
  '700 20px Unbounded',
  '900 20px Unbounded',
];
Promise.all([
  ...families.map((f) => document.fonts.load(f, 'AaBb✻·✢✳✶✽')),
  document.fonts.load('700 20px "Noto Sans SC"', '六'),
  document.fonts.load('700 20px "Noto Sans KR"', '넷'),
])
  .then(() => document.fonts.ready)
  .then(() => continueRender(handle))
  .catch(() => continueRender(handle));
