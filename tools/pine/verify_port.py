#!/usr/bin/env python3
"""Verify the Pine port against tools/structure.py on real bars.

The Pine cannot be compiled here, but its LOGIC can be: this is a
transliteration of supply-demand.pine — same batch pass, same loop bounds, same
offset arithmetic, same guards — run over the OHLCV structure.py fetches. If the
two agree on zone boundaries, grades and the nearest-N selection on every ticker
on the board, the port is faithful and only Pine SYNTAX remains unverified.

    python3 tools/pine/verify_port.py            # every ticker in board.js
    python3 tools/pine/verify_port.py AXON TTD  # a few

Needs network — it fetches the same bars structure.py does, so it is a manual
check and not a CI step. Run it after changing either side of the port.
"""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import indicators as ind
import structure as S

DISPLACE_BARS = 3
SWING_N = 2
SWING_MIN_ATR = 0.75
DISPLACE_ATR = 1.0
MAX_ZONE_ATR = 2.0
REVISIT_PAD = 0.15
VOL_BASE = 50
VOL_HEAVY = 1.5
MERGE_OVERLAP = 0.5
CROSS_OVERLAP = 0.5
MAX_ZONE_DIST = 0.45
MAX_AGE = 252
PER_SIDE = 3
SCAN_BARS = 1600


class Z:
    def __init__(self, is_dem, lo, hi, idx, atr_at, form_vol):
        self.is_dem, self.lo, self.hi, self.idx = is_dem, lo, hi, idx
        self.atr_at, self.form_vol = atr_at, form_vol
        self.touches = self.closes_in = self.heavy = 0
        self.inside = False
        self.strength = "fresh"

    def restrength(self):
        self.strength = ("weak" if (self.touches >= 3 or self.closes_in >= 2
                                    or self.heavy >= 2)
                         else "tested" if self.touches >= 1 else "fresh")


def run_pine(bars, atr, max_age=MAX_AGE, per_side=PER_SIDE,
             max_dist=MAX_ZONE_DIST, scan_bars=SCAN_BARS):
    """supply-demand.pine's `if barstate.islast` block, line for line."""
    H = [b["h"] for b in bars]
    L = [b["l"] for b in bars]
    C = [b["c"] for b in bars]
    O = [b["o"] for b in bars]
    V = [b["v"] for b in bars]
    last_idx = len(bars) - 1
    first_idx = max(0, last_idx - scan_bars + 1)

    # medVol = ta.median(volume, volBase)[1] — the median of the volBase bars
    # BEFORE this one, which is what excludes a bar from its own baseline.
    def rel_vol(i):
        lo = max(0, i - VOL_BASE)
        prior = sorted(v for v in V[lo:i] if v > 0)
        m = prior[len(prior) // 2] if prior else 0.0
        return V[i] / m if m and V[i] else 0.0

    # ── swings() + significant_swings(), over the scanned history
    sw = []   # [idx, price, is_high]

    def add_swing(idx, px, is_hi, a):
        if not sw:
            sw.append([idx, px, is_hi])
            return
        _, lp, lh = sw[-1]
        if lh == is_hi:
            if (is_hi and px > lp) or (not is_hi and px < lp):
                sw[-1] = [idx, px, is_hi]
            return
        if a is None or a <= 0 or abs(px - lp) >= SWING_MIN_ATR * a:
            sw.append([idx, px, is_hi])

    for b in range(first_idx + SWING_N, last_idx - SWING_N + 1):
        is_hi = all(H[b + j] < H[b] for j in range(-SWING_N, SWING_N + 1) if j)
        is_lo = all(L[b + j] > L[b] for j in range(-SWING_N, SWING_N + 1) if j)
        a = atr[b] if b < len(atr) else None
        if is_hi:
            add_swing(b, H[b], True, a)
        if is_lo:
            add_swing(b, L[b], False, a)

    # ── find_zones(): the displacement scan, in index order, with the skip
    raw = []
    sw_ptr = 0
    last_hi = last_lo = None
    i = first_idx + 1
    while i <= last_idx:
        while sw_ptr < len(sw) and sw[sw_ptr][0] < i:
            if sw[sw_ptr][2]:
                last_hi = sw[sw_ptr][1]
            else:
                last_lo = sw[sw_ptr][1]
            sw_ptr += 1
        a = atr[i] if i < len(atr) else None
        step = 1
        if a:
            win = [C[k] for k in range(i, min(i + DISPLACE_BARS, last_idx + 1))]
            up_to, dn_to = max(win), min(win)
            up_leg, dn_leg = up_to - O[i], O[i] - dn_to
            leg = up_leg if up_leg >= dn_leg else -dn_leg
            if abs(leg) >= DISPLACE_ATR * a:
                is_dem = leg > 0
                prior = last_hi if is_dem else last_lo
                if prior is not None and (up_to > prior if is_dem else dn_to < prior):
                    j = i - 1
                    start = j
                    for k in range(0, 4):
                        b2 = j - k
                        if b2 < 0:
                            break
                        up = C[b2] > O[b2]
                        if is_dem == up:
                            break
                        start = b2
                    base = range(start, j + 1)
                    if is_dem:
                        zlo = min(L[k] for k in base)
                        zhi = max(max(O[k], C[k]) for k in base)
                    else:
                        zlo = min(min(O[k], C[k]) for k in base)
                        zhi = max(H[k] for k in base)
                    vals = [rel_vol(k) for k in
                            range(i, min(i + DISPLACE_BARS, last_idx + 1))]
                    vals = [v for v in vals if v > 0]
                    raw.append(Z(is_dem, zlo, zhi, j, a,
                                 sum(vals) / len(vals) if vals else 0.0))
                    step = DISPLACE_BARS
        i += step

    # ── width cap, age cap, then scoring — the extractor's order
    def score(z):
        pad = (z.hi - z.lo) * REVISIT_PAD
        z.touches = z.closes_in = z.heavy = 0
        z.inside = False
        for b in range(z.idx + 2, last_idx + 1):
            touching = L[b] <= z.hi + pad and H[b] >= z.lo - pad
            if touching and not z.inside:
                z.touches += 1
                z.inside = True
                if rel_vol(b) >= VOL_HEAVY:
                    z.heavy += 1
            elif not touching:
                z.inside = False
            if touching and z.lo <= C[b] <= z.hi:
                z.closes_in += 1
        z.restrength()

    dem, sup = [], []
    for z in raw:
        if z.hi - z.lo <= MAX_ZONE_ATR * z.atr_at and z.idx >= last_idx + 1 - max_age:
            score(z)
            (dem if z.is_dem else sup).append(z)

    def merge(src):
        out = []
        for z in sorted(src, key=lambda x: x.lo):
            p = out[-1] if out else None
            ok = False
            if p is not None:
                overlap = min(p.hi, z.hi) - max(p.lo, z.lo)
                smaller = min(p.hi - p.lo, z.hi - z.lo) or 1e-9
                width = max(p.hi, z.hi) - min(p.lo, z.lo)
                cap = MAX_ZONE_ATR * max(p.atr_at, z.atr_at)
                ok = overlap >= MERGE_OVERLAP * smaller and width <= cap
            if ok:
                p.hi, p.lo = max(p.hi, z.hi), min(p.lo, z.lo)
                p.atr_at = max(p.atr_at, z.atr_at)
                p.touches = max(p.touches, z.touches)
                p.closes_in = max(p.closes_in, z.closes_in)
                p.heavy = max(p.heavy, z.heavy)
                p.form_vol = max(p.form_vol, z.form_vol)
                if z.idx > p.idx:
                    p.idx = z.idx
                p.restrength()
            else:
                out.append(z)
        return out

    dem, sup = merge(dem), merge(sup)

    def over(a_, b):
        return ((min(a_.hi, b.hi) - max(a_.lo, b.lo))
                >= CROSS_OVERLAP * (max(a_.hi - a_.lo, b.hi - b.lo) or 1e-9))

    keep_d = [a_ for a_ in dem if not any(over(a_, b) and b.idx >= a_.idx for b in sup)]
    keep_s = [b for b in sup if not any(over(a_, b) and a_.idx > b.idx for a_ in dem)]

    px = C[-1]

    def nearest(src, want_dem):
        cand = [z for z in src
                if (z.lo <= px if want_dem else z.hi >= px)
                and abs((z.lo + z.hi) / 2 - px) / px <= max_dist]
        cand.sort(key=lambda z: max(0.0, px - z.hi) if want_dem
                  else max(0.0, z.lo - px))
        return cand[:per_side]

    return nearest(keep_d, True), nearest(keep_s, False)


def main():
    tickers = sys.argv[1:]
    if not tickers:
        board = (Path(__file__).resolve().parents[2] / "board.js").read_text(encoding="utf-8")
        tickers = re.findall(r'"ticker": "([^"]+)"', board)
    bad = 0
    rows = 0
    for t in tickers:
        try:
            bars = S.cached_daily(t)
        except Exception as e:                      # noqa: BLE001
            print(f"{t}: fetch failed — {e}")
            continue
        atr = ind.atr([b["h"] for b in bars], [b["l"] for b in bars],
                      [b["c"] for b in bars], 14)
        zs = S.find_zones(bars, atr)
        px = bars[-1]["c"]
        pairs = [("demand", S.nearest(zs, px, 'demand'), None),
                 ("supply", S.nearest(zs, px, 'supply'), None)]
        pnD, pnS = run_pine(bars, atr)
        pairs[0] = ("demand", pairs[0][1], pnD)
        pairs[1] = ("supply", pairs[1][1], pnS)
        line = [f"{t:6}"]
        for kind, py, pn in pairs:
            rows += 1
            a = [(round(z.lo, 4), round(z.hi, 4), z.strength) for z in py]
            b = [(round(z.lo, 4), round(z.hi, 4), z.strength) for z in pn]
            if a == b:
                line.append(f"{kind} ok({len(a)})")
            else:
                bad += 1
                line.append(f"{kind} MISMATCH")
                line.append(f"\n    py  : {a}\n    pine: {b}")
        print(" ".join(line))
    print(f"\n{rows - bad}/{rows} zone lists identical · MISMATCHES: {bad}")
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
