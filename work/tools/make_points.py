"""Sample character silhouettes into colored point clouds (verse 1 "set of points").
usage: python make_points.py <seed> <png> <out.json> <N> [<png> <out.json> <N> ...]
Inputs are the trimmed 1x art (as produced by the trim step of prepare.sh, before upscaling). One RNG is shared across
inputs in order. The committed data was made with:
  make_points.py 7 cc_hello.png points_cc_hello.json 1400 cc_snap.png points_cc_snap.json 1800"""
import json, sys
import numpy as np
from PIL import Image
rng = np.random.default_rng(int(sys.argv[1]))
args = sys.argv[2:]
for k in range(0, len(args), 3):
    src, out, N = args[k], args[k + 1], int(args[k + 2])
    a = np.asarray(Image.open(src).convert('RGBA')).astype(np.float32)
    h, w = a.shape[:2]
    ys, xs = np.nonzero(a[:, :, 3] > 200)
    idx = rng.choice(len(xs), N, replace=False)
    pts = [[round(xs[i] / w, 4), round(ys[i] / h, 4), '#%02x%02x%02x' % (int(a[ys[i], xs[i], 0]), int(a[ys[i], xs[i], 1]), int(a[ys[i], xs[i], 2]))] for i in idx]
    json.dump({'w': w, 'h': h, 'pts': pts}, open(out, 'w'))
    print(out, len(pts))
