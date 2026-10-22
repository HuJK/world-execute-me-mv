"""Word-level lyric timing: per-cue forced alignment with stable-ts on the demucs vocal stem.
usage: python align_words.py vocals.wav lyrics.vtt out.json
"""
import json, re, sys
import numpy as np
import stable_whisper
import whisper

vocals, vtt, out = sys.argv[1:4]
SR = 16000
audio = whisper.load_audio(vocals)


def parse_vtt(path):
    cues = []
    txt = open(path, encoding='utf-8').read()
    for m in re.finditer(r'(\d+):(\d+):(\d+\.\d+) --> (\d+):(\d+):(\d+\.\d+)\n(.+)', txt):
        s = int(m[1]) * 3600 + int(m[2]) * 60 + float(m[3])
        e = int(m[4]) * 3600 + int(m[5]) * 60 + float(m[6])
        cues.append({'start': s, 'end': e, 'text': m[7].strip()})
    return cues


cues = parse_vtt(vtt)
model = stable_whisper.load_model('medium.en', device='cpu')
res = []
for i, c in enumerate(cues):
    pad0, pad1 = 0.25, 0.25
    s0 = max(0, c['start'] - pad0)
    s1 = c['end'] + pad1
    seg = audio[int(s0 * SR):int(s1 * SR)]
    text = c['text'].replace('’', "'")
    words = []
    try:
        r = model.align(seg, text, language='en', fast_mode=False, verbose=None)
        for w in r.all_words():
            ws = max(c['start'], min(c['end'], s0 + w.start))
            we = max(c['start'], min(c['end'], s0 + w.end))
            words.append({'w': w.word.strip(), 's': round(ws, 3), 'e': round(we, 3)})
    except Exception as ex:  # fall back to even distribution
        print('align fail', i, text, ex, flush=True)
    toks = text.split()
    if len(words) != len(toks):
        # even split by character length
        L = sum(len(t) for t in toks)
        t = c['start']
        words = []
        for tk in toks:
            d = (c['end'] - c['start']) * len(tk) / L
            words.append({'w': tk, 's': round(t, 3), 'e': round(t + d, 3)})
            t += d
    c['words'] = words
    res.append(c)
    print(f"{c['start']:7.2f} {text:40s} " + ' '.join(f"{w['w']}@{w['s']:.2f}" for w in words), flush=True)
json.dump(res, open(out, 'w'), indent=1)
