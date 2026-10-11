# Split Anna's vector sketch into one SVG per drawing (developer tool, not part of the build).
#
# Her sketch was drawn on a tablet and exported as a vector PDF, so the pen strokes
# can be lifted out directly instead of scanning and tracing:
#
#   pdftocairo -svg "Anna website.pdf" sketch.svg          # poppler
#   python3 scripts/scene/split-sketch.py sketch.svg parts/
#   python3 scripts/scene/optimize-svg.py parts/ src/assets/scene/ 4
#
# Tiny squares (the dot grid) are dropped. Every other stroke is assigned to the
# first REGION (in sketch coordinates) that contains its centre. For a new sketch,
# update REGIONS: render the page, read off rough boxes, run, check the output.
# The resulting boxes (meta.json) are what src/components/scene/Scene.astro uses as PARTS.
import re, sys, json, os
src = open(sys.argv[1]).read()
out = sys.argv[2]; os.makedirs(out, exist_ok=True)
# regions in SVG coordinates (x0, y0, x1, y1); first match wins, so sub-parts come first
REGIONS = [
  ('board-letters', (49, 212, 108, 241)),
  ('board', (30, 198, 146, 260)),
  ('board-label', (8, 258, 168, 366)),
  ('portrait-label', (168, 40, 284, 150)),
  ('portrait', (55, 30, 182, 165)),
  ('museum-figure', (428, 290, 465, 356)),
  ('museum-label', (378, 354, 545, 442)),
  ('museum', (320, 80, 642, 298)),
  ('cinema-screen', (205, 322, 350, 400)),
  ('cinema-seats', (220, 400, 350, 432)),
  ('cinema-booth', (242, 436, 324, 510)),
  ('cinema-label', (325, 452, 465, 502)),
  ('madeleine', (90, 455, 122, 500)),
  ('madeleine-label', (90, 400, 200, 456)),
  ('profile', (14, 390, 88, 514)),
]
groups = {name: [] for name, _ in REGIONS}; unassigned = []
for attrs in re.findall(r'<path ([^>]*)/>', src):
    d = re.search(r' d="([^"]*)"', attrs).group(1)
    m = re.search(r'transform="matrix\(([^)]*)\)"', attrs)
    a,b,c,dd,e,f = [float(x) for x in m.group(1).split(',')] if m else (1,0,0,1,0,0)
    nums = [float(x) for x in re.findall(r'-?\d*\.?\d+(?:e-?\d+)?', d)]
    pts = [(a*x + c*y + e, b*x + dd*y + f) for x, y in zip(nums[0::2], nums[1::2])]
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    if max(xs)-min(xs) < 1.5 and max(ys)-min(ys) < 1.5: continue  # grid dot
    cx, cy = (min(xs)+max(xs))/2, (min(ys)+max(ys))/2
    # bake the transform into the coordinates (rounded) so each file is a plain path
    baked = re.sub(r'(-?\d*\.?\d+(?:e-?\d+)?) (-?\d*\.?\d+(?:e-?\d+)?)', lambda m: '%.2f %.2f' % (a*float(m.group(1)) + c*float(m.group(2)) + e, b*float(m.group(1)) + dd*float(m.group(2)) + f), d)
    for name, (x0, y0, x1, y1) in REGIONS:
        if x0 <= cx <= x1 and y0 <= cy <= y1:
            groups[name].append((baked, (min(xs), min(ys), max(xs), max(ys)))); break
    else:
        unassigned.append((round(cx), round(cy), round(max(xs)-min(xs)), round(max(ys)-min(ys))))
print('unassigned', unassigned)
meta = {}
for name, items in groups.items():
    if not items: print('EMPTY', name); continue
    x0 = min(i[1][0] for i in items); y0 = min(i[1][1] for i in items)
    x1 = max(i[1][2] for i in items); y1 = max(i[1][3] for i in items)
    pad = 1.5
    vb = (round(x0-pad, 2), round(y0-pad, 2), round(x1-x0+2*pad, 2), round(y1-y0+2*pad, 2))
    meta[name] = {'viewBox': vb, 'strokes': len(items)}
    body = ''.join('<path d="%s"/>' % p for p, _ in items)
    open(os.path.join(out, name + '.svg'), 'w').write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="%s %s %s %s" fill="currentColor" fill-rule="evenodd">%s</svg>\n' % (*vb, body))
json.dump(meta, open(os.path.join(out, 'meta.json'), 'w'), indent=1)
for k, v in meta.items(): print(k, v)
