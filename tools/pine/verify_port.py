#!/usr/bin/env python3
"""Verify supply-demand.pine against tools/structure.py on real bars.

The Pine cannot be compiled here, but its LOGIC can be: `run_pine()` below is a
transliteration of the indicator's `zonesFor()` — same loop bounds, same index
arithmetic, same guards — run over the OHLCV structure.py fetches.

Three things are checked:

  1. BOARD-RULES PARITY. With `base = "board"` on daily bars the indicator must
     reproduce board.js exactly — zone boundaries, grades and the nearest-N
     selection per side. This is the regression that matters: a change to
     find_zones() that is not mirrored in the Pine shows up here rather than as
     a chart quietly disagreeing with the board.
  2. BALANCE MODE RUNS. The default base rule ("balance candles", sized against
     ATR instead of read off candle colour) is a deliberate divergence, so it is
     reported as a diff count, not as a failure.
  3. THE M/W/D STACK. The same engine runs on weekly and monthly resamples, the
     way the indicator runs it on request.security data.

    python3 tools/pine/verify_port.py            # every ticker in board.js
    python3 tools/pine/verify_port.py AXON TTD   # a few

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
MAX_BASE_BARS = 4
BALANCE_BODY = 0.5


class Z:
    def __init__(self, is_dem, lo, hi, idx, atr_at, form_vol, tf):
        self.is_dem, self.lo, self.hi, self.idx = is_dem, lo, hi, idx
        self.atr_at, self.form_vol, self.tf = atr_at, form_vol, tf
        self.touches = self.closes_in = self.heavy = 0
        self.strength = "fresh"

    def restrength(self):
        self.strength = ("weak" if (self.touches >= 3 or self.closes_in >= 2
                                    or self.heavy >= 2)
                         else "tested" if self.touches >= 1 else "fresh")


def med_series(vols, n=VOL_BASE):
    """ta.median(volume, n)[1] — the median of the n bars BEFORE each bar,
    which is what excludes a bar from its own baseline."""
    out = []
    for i in range(len(vols)):
        prior = sorted(v for v in vols[max(0, i - n):i] if v > 0)
        out.append(prior[len(prior) // 2] if prior else 0.0)
    return out


def run_pine(bars, atr, tf="D", max_age=252, per_side=3,
             max_dist=MAX_ZONE_DIST, base="balance"):
    """supply-demand.pine's zonesFor(), line for line."""
    O = [b["o"] for b in bars]
    H = [b["h"] for b in bars]
    L = [b["l"] for b in bars]
    C = [b["c"] for b in bars]
    V = [b["v"] for b in bars]
    MED = med_series(V)
    n = len(bars)

    def rel_vol(i):
        return V[i] / MED[i] if MED[i] and V[i] else 0.0

    # ── swings() + significant_swings()
    sw = []

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

    for b in range(SWING_N, n - SWING_N):
        is_hi = all(H[b + j] < H[b] for j in range(-SWING_N, SWING_N + 1) if j)
        is_lo = all(L[b + j] > L[b] for j in range(-SWING_N, SWING_N + 1) if j)
        a = atr[b] if b < len(atr) else None
        if is_hi:
            add_swing(b, H[b], True, a)
        if is_lo:
            add_swing(b, L[b], False, a)

    # ── find_zones(): the impulse scan, in index order, with the skip
    raw = []
    sw_ptr = 0
    last_hi = last_lo = None
    i = 1
    while i <= n - 1:
        while sw_ptr < len(sw) and sw[sw_ptr][0] < i:
            if sw[sw_ptr][2]:
                last_hi = sw[sw_ptr][1]
            else:
                last_lo = sw[sw_ptr][1]
            sw_ptr += 1
        a = atr[i] if i < len(atr) else None
        step = 1
        if a:
            win = [C[k] for k in range(i, min(i + DISPLACE_BARS, n))]
            up_to, dn_to = max(win), min(win)
            up_leg, dn_leg = up_to - O[i], O[i] - dn_to
            leg = up_leg if up_leg >= dn_leg else -dn_leg
            if abs(leg) >= DISPLACE_ATR * a:
                is_dem = leg > 0
                prior = last_hi if is_dem else last_lo
                if prior is not None and (up_to > prior if is_dem else dn_to < prior):
                    # ── THE BASE: size (balance) or colour (board rules)
                    j = i - 1
                    start = j
                    for k in range(0, MAX_BASE_BARS):
                        b2 = j - k
                        if b2 < 0:
                            break
                        if base == "balance":
                            ab = atr[b2] if b2 < len(atr) else None
                            body = abs(C[b2] - O[b2])
                            stop = not ab or ab <= 0 or body > BALANCE_BODY * ab
                        else:
                            stop = is_dem == (C[b2] > O[b2])
                        if stop:
                            break
                        start = b2
                    # ── THE BOUNDARIES
                    #   demand [lowest WICK, highest BODY edge]
                    #   supply [lowest BODY edge, highest WICK]
                    span = range(start, j + 1)
                    if is_dem:
                        zlo = min(L[k] for k in span)
                        zhi = max(max(O[k], C[k]) for k in span)
                    else:
                        zlo = min(min(O[k], C[k]) for k in span)
                        zhi = max(H[k] for k in span)
                    vals = [rel_vol(k) for k in range(i, min(i + DISPLACE_BARS, n))]
                    vals = [v for v in vals if v > 0]
                    raw.append(Z(is_dem, zlo, zhi, j, a,
                                 sum(vals) / len(vals) if vals else 0.0, tf))
                    step = DISPLACE_BARS
        i += step

    # ── width cap, age cap, then scoring — the extractor's order
    def score(z):
        pad = (z.hi - z.lo) * REVISIT_PAD
        z.touches = z.closes_in = z.heavy = 0
        inside = False
        for b in range(z.idx + 2, n):
            touching = L[b] <= z.hi + pad and H[b] >= z.lo - pad
            if touching and not inside:
                z.touches += 1
                inside = True
                if rel_vol(b) >= VOL_HEAVY:
                    z.heavy += 1
            elif not touching:
                inside = False
            if touching and z.lo <= C[b] <= z.hi:
                z.closes_in += 1
        z.restrength()

    dem, sup = [], []
    for z in raw:
        if z.hi - z.lo <= MAX_ZONE_ATR * z.atr_at and z.idx >= n - max_age:
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


def atr_for(bars):
    return ind.atr([b["h"] for b in bars], [b["l"] for b in bars],
                   [b["c"] for b in bars], 14)


def key(zs):
    return [(round(z.lo, 4), round(z.hi, 4), z.strength) for z in zs]


def zigzag(bars, atr):
    """buildZigzag() — swings() then significant_swings(), one frame."""
    H = [b["h"] for b in bars]
    L = [b["l"] for b in bars]
    sw = []

    def add(idx, px, is_hi, a):
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

    for b in range(SWING_N, len(bars) - SWING_N):
        if all(H[b + j] < H[b] for j in range(-SWING_N, SWING_N + 1) if j):
            add(b, H[b], True, atr[b] if b < len(atr) else None)
        if all(L[b + j] > L[b] for j in range(-SWING_N, SWING_N + 1) if j):
            add(b, L[b], False, atr[b] if b < len(atr) else None)
    return sw


def trend_legs(sw):
    """trendLegs() — a trend ends on a break of the OPPOSITE side, and only there.

        an UPTREND is over when price makes a LOWER LOW
        a DOWNTREND is over when price makes a HIGHER HIGH

    A lower high is a pullback, not the end of an uptrend. So each direction
    watches one side of the zigzag: uptrends live on the lows, downtrends on the
    highs, and the break that kills one starts the other.

    Returns (prev_leg, cur_dir) where prev_leg is the last COMPLETED leg."""
    prev = None
    cur_dir, cur_start = 0, -1
    prev_high = prev_low = None
    last_high_p = last_low_p = -1
    for k, (_, px, is_hi) in enumerate(sw):
        if is_hi:
            if prev_high is not None and px > prev_high:
                if cur_dir == -1:
                    prev = {"start": cur_start, "end": k, "dir": -1}
                if cur_dir != 1:
                    cur_dir = 1
                    cur_start = last_low_p if last_low_p >= 0 else k
            prev_high, last_high_p = px, k
        else:
            if prev_low is not None and px < prev_low:
                if cur_dir == 1:
                    prev = {"start": cur_start, "end": k, "dir": 1}
                if cur_dir != -1:
                    cur_dir = -1
                    cur_start = last_high_p if last_high_p >= 0 else k
            prev_low, last_low_p = px, k
    return prev, cur_dir


def main():
    tickers = sys.argv[1:]
    if not tickers:
        board = (Path(__file__).resolve().parents[2] / "board.js").read_text(encoding="utf-8")
        tickers = re.findall(r'"ticker": "([^"]+)"', board)

    bad = rows = 0
    diff_balance = 0
    trend_stats = [0, 0, 0, 0]
    print("board-rules parity (must be exact) · balance-mode diff · M/W stack\n")
    for t in tickers:
        try:
            bars = S.cached_daily(t)
        except Exception as e:                       # noqa: BLE001
            print(f"{t:6} fetch failed — {e}")
            continue
        atr = atr_for(bars)
        px = bars[-1]["c"]
        zs = S.find_zones(bars, atr)

        line = [f"{t:6}"]
        # 1 — board-rules parity against the extractor
        for kind, want_dem in (("demand", True), ("supply", False)):
            rows += 1
            py = key(S.nearest(zs, px, kind))
            pn = key(run_pine(bars, atr, base="board")[0 if want_dem else 1])
            if py == pn:
                line.append(f"{kind[:3]} ok({len(py)})")
            else:
                bad += 1
                line.append(f"{kind[:3]} MISMATCH\n    py  : {py}\n    pine: {pn}")

        # 2 — the default base rule, reported not enforced
        bD, bS = run_pine(bars, atr, base="balance")
        moved = sum(1 for a, b in ((key(S.nearest(zs, px, 'demand')), key(bD)),
                                   (key(S.nearest(zs, px, 'supply')), key(bS)))
                    if a != b)
        diff_balance += moved
        line.append(f"balance:{moved}/2 differ")

        # 3 — the same engine on the higher frames, as the indicator runs it
        wk = ind.resample(bars, "W")
        mo = ind.resample(bars, "M")
        wD, wS = run_pine(wk, atr_for(wk), tf="W", max_age=104, per_side=2)
        mD, mS = run_pine(mo, atr_for(mo), tf="M", max_age=36, per_side=2)
        line.append(f"W {len(wD)}d/{len(wS)}s · M {len(mD)}d/{len(mS)}s")

        # 4 — the weekly trend run against the board's own weekly structure
        wsw = zigzag(wk, atr_for(wk))
        prev_leg, cur_dir = trend_legs(wsw)
        want = S.classify_structure(
            [S.Swing(i_, p_, 'high' if h_ else 'low') for i_, p_, h_ in wsw],
            wk, S.STRUCT_LOOKBACK['w'])
        got = "neutral" if cur_dir == 0 else "bullish" if cur_dir > 0 else "bearish"
        # The two answer DIFFERENT questions: classify_structure reads the
        # CURRENT state, the run reads the LAST TREND, which may be over. So an
        # exact match is not the bar — the bar is that they never point OPPOSITE
        # ways, which would mean the yellow line contradicts the board.
        contra = ({got, want} == {"bullish", "bearish"})
        trend_stats[0] += 1
        trend_stats[1] += 1 if got == want else 0
        trend_stats[2] += 1 if contra else 0
        trend_stats[3] += 1 if prev_leg else 0
        mark = "=" if got == want else "!!" if contra else "~"
        line.append(f"trend {got[:4]}{mark}{want[:4]}"
                    + ("/prev" if prev_leg else ""))
        print(" ".join(line))

    print(f"\n{rows - bad}/{rows} board-rules zone lists identical · MISMATCHES: {bad}")
    print(f"balance mode differs from board rules on {diff_balance}/{rows} lists "
          f"(expected — it is a different base rule, not a bug)")
    tot, same, contra, alive = trend_stats
    print(f"weekly trend markers: {same}/{tot} name the same direction as "
          f"classify_structure, {alive}/{tot} also have a completed previous leg, "
          f"{tot - same - contra}/{tot} name a trend where the extractor "
          f"abstains (neutral)")
    print(f"CONTRADICTIONS (marker bullish vs extractor bearish, or the "
          f"reverse): {contra}/{tot}" + ("  ← must be 0" if contra else "  ✓"))
    if contra:
        return 1
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
