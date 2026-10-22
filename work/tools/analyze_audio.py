"""Beat / downbeat / onset / energy analysis -> JSON for the renderer."""
import json, sys
import numpy as np
import collections, collections.abc
for _n in ("MutableSequence","Iterable","Mapping","MutableMapping","Sequence"):
    setattr(collections, _n, getattr(collections.abc, _n))
for _n, _t in (("float", float), ("int", int), ("bool", bool), ("complex", complex), ("object", object)):
    if not hasattr(np, _n):
        setattr(np, _n, _t)
import librosa

path, out = sys.argv[1], sys.argv[2]
FPS = 60
y, sr = librosa.load(path, sr=44100, mono=True)
dur = len(y) / sr

# --- madmom beats + downbeats
from madmom.features.downbeats import RNNDownBeatProcessor, DBNDownBeatTrackingProcessor
from madmom.features.beats import RNNBeatProcessor, DBNBeatTrackingProcessor
act = RNNDownBeatProcessor()(path)
db = DBNDownBeatTrackingProcessor(beats_per_bar=[4], fps=100)(act)
beats = [float(t) for t, b in db]
downbeats = [float(t) for t, b in db if int(b) == 1]
ibi = np.diff(beats)
bpm = 60.0 / np.median(ibi)

# --- per-frame features at FPS
hop = int(sr / FPS)
S = np.abs(librosa.stft(y, n_fft=2048, hop_length=hop))
freqs = librosa.fft_frequencies(sr=sr, n_fft=2048)
def band(lo, hi):
    m = (freqs >= lo) & (freqs < hi)
    e = S[m].sum(0)
    return e
def norm(x):
    x = np.asarray(x, float)
    lo, hi = np.percentile(x, 2), np.percentile(x, 99.5)
    return np.clip((x - lo) / (hi - lo + 1e-9), 0, 1)
rms = librosa.feature.rms(y=y, frame_length=2048, hop_length=hop)[0]
low = band(20, 150); mid = band(150, 2000); high = band(4000, 16000)
def flux(e):
    d = np.maximum(0, np.diff(np.log1p(e), prepend=np.log1p(e[0])))
    return d
onset = librosa.onset.onset_strength(y=y, sr=sr, hop_length=hop)
onsets = librosa.onset.onset_detect(onset_envelope=onset, sr=sr, hop_length=hop, units='time', backtrack=False)
kick = flux(low)
kick_peaks = librosa.util.peak_pick(norm(kick), pre_max=6, post_max=6, pre_avg=10, post_avg=10, delta=0.12, wait=8)
n = int(np.ceil(dur * FPS))
def fit(a):
    a = np.asarray(a)[:n]
    if len(a) < n:
        a = np.pad(a, (0, n - len(a)))
    return [round(float(v), 3) for v in a]
res = {
    'duration': dur, 'fps': FPS, 'bpm': float(bpm),
    'beats': [round(b, 4) for b in beats], 'downbeats': [round(b, 4) for b in downbeats],
    'onsets': [round(float(o), 4) for o in onsets],
    'kicks': [round(float(k) / FPS, 4) for k in kick_peaks],
    'rms': fit(norm(rms)), 'low': fit(norm(low)), 'mid': fit(norm(mid)), 'high': fit(norm(high)),
    'onsetEnv': fit(norm(onset)),
}
json.dump(res, open(out, 'w'))
print('duration', dur, 'bpm', bpm, 'beats', len(beats), 'downbeats', len(downbeats), 'first beats', beats[:8], 'first downbeats', downbeats[:6])
