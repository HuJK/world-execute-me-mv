// usage: node stills.mjs <outdir> <t1> <t2> ...   (song seconds) — bundles once, renders PNG stills of the MV composition
// options: --scale=0.5  --contact (also writes a contact sheet)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const args = process.argv.slice(2);
const opts = Object.fromEntries(args.filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const rest = args.filter((a) => !a.startsWith('--'));
const out = rest[0];
const times = rest.slice(1).map(Number);
fs.mkdirSync(out, {recursive: true});
const scale = opts.scale ? Number(opts.scale) : 0.5;

const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts'), webpackOverride: (c) => c});
const composition = await selectComposition({serveUrl, id: 'MV', inputProps: {}});
const conc = Number(opts.conc ?? 4);
const queue = [...times];
const work = async () => {
  while (queue.length) {
    const t = queue.shift();
    const frame = Math.round(t * composition.fps);
    const file = path.join(out, `t${t.toFixed(2).padStart(7, '0')}.png`);
    await renderStill({composition, serveUrl, output: file, frame, scale, inputProps: {}, chromiumOptions: {gl: 'angle'}});
    console.log('ok', t);
  }
};
await Promise.all(Array.from({length: conc}, work));
