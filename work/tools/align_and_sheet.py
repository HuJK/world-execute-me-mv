"""Align reference MVs to our audio, then build per-section contact sheets of frames at lyric timestamps.

usage: python align_and_sheet.py <our_audio> <vtt> <video>... --out <dir>
"""
import argparse, json, os, re, subprocess, sys
import numpy as np
import librosa
from PIL import Image, ImageDraw, ImageFont

FF = os.environ.get('FFMPEG', 'ffmpeg')
SR = 22050
HOP = 256


def load(path, dur=None):
    y, _ = librosa.load(path, sr=SR, mono=True, duration=dur)
    return y


def feat(y):
    o = librosa.onset.onset_strength(y=y, sr=SR, hop_length=HOP)
    o = (o - o.mean()) / (o.std() + 1e-9)
    return o


def find_offset(ref, other):
    """returns seconds such that t_other = t_ref + offset"""
    a, b = feat(ref), feat(other)
    n = len(a) + len(b)
    nfft = 1 << (n - 1).bit_length()
    c = np.fft.irfft(np.fft.rfft(b, nfft) * np.conj(np.fft.rfft(a, nfft)), nfft)
    lag = int(np.argmax(c))
    if lag > nfft // 2:
        lag -= nfft
    peak = c.max() / (np.sqrt((a ** 2).sum() * (b ** 2).sum()) + 1e-9)
    return lag * HOP / SR, float(peak)


def parse_vtt(path):
    cues = []
    txt = open(path, encoding='utf-8').read()
    for m in re.finditer(r'(\d+):(\d+):(\d+\.\d+) --> (\d+):(\d+):(\d+\.\d+)\n(.+)', txt):
        s = int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3])
        e = int(m[4]) * 3600 + int(m[5]) * 60 + float(m[6])
        cues.append((s, e, m[7].strip()))
    return cues


SECTIONS = [
    ('00_intro', 0, 16.0), ('01_title', 16.0, 29.7), ('02_verse1', 29.7, 44.45),
    ('03_pre1', 44.45, 59.22), ('04_chorus1', 59.22, 74.05), ('05_verse2', 74.05, 88.59),
    ('06_pre2', 88.59, 104.2), ('07_chorus2a', 104.2, 118.33), ('08_chorus2b', 118.33, 133.62),
    ('09_bridge', 133.62, 147.66), ('10_exec', 147.66, 162.63), ('11_chorus3', 162.63, 177.25),
    ('12_love', 177.25, 192.2), ('13_outro', 192.2, 212.3),
]


def grab(video, t, w=384):
    p = subprocess.run([FF, '-v', 'error', '-ss', f'{max(t,0):.3f}', '-i', video, '-frames:v', '1',
                        '-vf', f'scale={w}:-2', '-f', 'image2pipe', '-vcodec', 'png', '-'],
                       capture_output=True)
    if not p.stdout:
        return None
    from io import BytesIO
    return Image.open(BytesIO(p.stdout)).convert('RGB')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('audio'); ap.add_argument('vtt'); ap.add_argument('videos', nargs='+')
    ap.add_argument('--out', required=True)
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    ref = load(a.audio)
    cues = parse_vtt(a.vtt)
    # timeline of sample points: each cue start+0.15 and mid, plus every 1.5s inside long gaps
    pts = []
    for s, e, t in cues:
        pts.append((s + min(0.25, (e - s) / 3), t))
        if e - s > 1.2:
            pts.append(((s + e) / 2 + 0.2, '…' + t))
    allc = sorted(c[0] for c in cues)
    gaps = [(0, 0)] + [(cues[i][1], cues[i + 1][0]) for i in range(len(cues) - 1)] + [(cues[-1][1], 212.3)]
    for gs, ge in gaps:
        if ge - gs > 2.5:
            t = gs + 1.0
            while t < ge - 0.5:
                pts.append((t, '(instrumental)'))
                t += 1.8
    pts.sort()
    font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf', 15)
    meta = {}
    for v in a.videos:
        vid = os.path.splitext(os.path.basename(v))[0]
        other = load(v)
        off, peak = find_offset(ref, other)
        meta[vid] = {'offset': off, 'corr': peak}
        print(vid, 'offset', round(off, 3), 'corr', round(peak, 3), flush=True)
        for name, s0, s1 in SECTIONS:
            sel = [(t, l) for t, l in pts if s0 <= t < s1]
            tiles = []
            for t, l in sel:
                im = grab(v, t + off)
                if im is None:
                    continue
                cap = Image.new('RGB', (im.width, im.height + 40), (20, 20, 20))
                cap.paste(im, (0, 0))
                d = ImageDraw.Draw(cap)
                d.text((6, im.height + 4), f'{t:6.2f}s  {l[:44]}', fill=(255, 220, 120), font=font)
                tiles.append(cap)
            if not tiles:
                continue
            cols = 4
            tw, th = tiles[0].size
            rows = (len(tiles) + cols - 1) // cols
            sheet = Image.new('RGB', (cols * tw, rows * th), (0, 0, 0))
            for i, tl in enumerate(tiles):
                sheet.paste(tl.resize((tw, th)), ((i % cols) * tw, (i // cols) * th))
            od = os.path.join(a.out, vid)
            os.makedirs(od, exist_ok=True)
            sheet.save(os.path.join(od, f'{name}.jpg'), quality=82)
    json.dump(meta, open(os.path.join(a.out, 'offsets.json'), 'w'), indent=1)


if __name__ == '__main__':
    main()
