"""trace a transparent PNG into compact path JSON for the LineArt component
usage: python trace.py <png> <out.json>"""
import sys, re, json
import numpy as np
from PIL import Image
import vtracer
src, out = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert('RGBA')).copy()
a = im[:, :, 3]
im[a < 140] = [0, 0, 0, 0]
im[a >= 140, 3] = 255
tmp = out + '.png'
Image.fromarray(im).save(tmp)
svg = vtracer.convert_image_to_svg_py if False else None
vtracer.convert_image_to_svg_py(tmp, out + '.svg', colormode='color', hierarchical='cutout', mode='spline', filter_speckle=8,
                                color_precision=6, layer_difference=16, corner_threshold=60, length_threshold=4.0,
                                max_iterations=10, splice_threshold=45, path_precision=1)
s = open(out + '.svg').read()
w = int(re.search(r'width="(\d+)"', s).group(1)); h = int(re.search(r'height="(\d+)"', s).group(1))
paths = []
for m in re.finditer(r'<path d="([^"]+)" fill="(#[0-9A-Fa-f]{6})" transform="translate\(([-\d.]+),([-\d.]+)\)"', s):
    d, fill, tx, ty = m.group(1), m.group(2), float(m.group(3)), float(m.group(4))
    paths.append({'d': d, 'f': fill, 'x': tx, 'y': ty})
paths.sort(key=lambda p: p['y'])
json.dump({'w': w, 'h': h, 'paths': paths}, open(out, 'w'))
import os; os.remove(tmp); os.remove(out + '.svg')
print(src, len(paths), os.path.getsize(out))
