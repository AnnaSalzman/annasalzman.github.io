# Shrink split drawings for inlining (developer tool, not part of the build).
# Usage: python3 scripts/scene/optimize-svg.py <in-dir> <out-dir> <tolerance>
# Tolerance 4 (tenths of a sketch unit) keeps the pen character at display size and
# makes the files ~6x smaller. Each pen stroke stays its own <path>: merging them
# would cut holes where strokes cross.
# Shrink split drawings: drop redundant points (Ramer-Douglas-Peucker), move to the
# origin, scale x10 to integers, and write relative coordinates with implicit lines.
import re, sys, os, math
src_dir, out_dir, tol = sys.argv[1], sys.argv[2], float(sys.argv[3])
os.makedirs(out_dir, exist_ok=True)
def rdp(pts, eps):
    if len(pts) < 3: return pts
    (x1, y1), (x2, y2) = pts[0], pts[-1]
    dx, dy = x2 - x1, y2 - y1; norm = math.hypot(dx, dy)
    best, idx = -1, 0
    for i in range(1, len(pts) - 1):
        px, py = pts[i]
        d = abs(dy * px - dx * py + x2 * y1 - y2 * x1) / norm if norm else math.hypot(px - x1, py - y1)
        if d > best: best, idx = d, i
    if best > eps:
        return rdp(pts[:idx + 1], eps)[:-1] + rdp(pts[idx:], eps)
    return [pts[0], pts[-1]]
total_in = total_out = 0
for f in sorted(os.listdir(src_dir)):
    if not f.endswith('.svg'): continue
    s = open(os.path.join(src_dir, f)).read(); total_in += len(s)
    vx, vy, vw, vh = [float(v) for v in re.search(r'viewBox="([^"]*)"', s).group(1).split()]
    out_paths = []
    for d in re.findall(r'<path d="([^"]*)"/>', s):
        subpaths = []
        for chunk in re.split(r'M', d)[1:]:
            nums = [float(n) for n in re.findall(r'-?\d*\.?\d+', chunk)]
            pts = [((x - vx) * 10, (y - vy) * 10) for x, y in zip(nums[0::2], nums[1::2])]
            closed = len(pts) > 2 and pts[0] == pts[-1]
            pts = rdp(pts, tol)
            if len(pts) < 2: continue
            ipts = [(round(x), round(y)) for x, y in pts]
            dedup = [ipts[0]] + [p for i, p in enumerate(ipts[1:], 1) if p != ipts[i - 1]]
            if len(dedup) < 3: continue
            cmd = 'M%d %d' % dedup[0]
            rel = []
            for (ax, ay), (bx, by) in zip(dedup, dedup[1:]):
                rel.append('%d %d' % (bx - ax, by - ay))
            cmd += 'l' + ' '.join(rel).replace(' -', '-') + 'z'
            subpaths.append(cmd)
        if subpaths: out_paths.append(''.join(subpaths))
    # one <path> per pen stroke: merged evenodd paths would cut holes where strokes cross
    body = ''.join('<path d="%s"/>' % d for d in out_paths)
    svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 %d %d" fill="currentColor">%s</svg>\n' % (round(vw * 10), round(vh * 10), body)
    open(os.path.join(out_dir, f), 'w').write(svg); total_out += len(svg)
print('in %d KB -> out %d KB' % (total_in // 1024, total_out // 1024))
