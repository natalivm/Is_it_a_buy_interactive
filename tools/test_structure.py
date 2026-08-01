#!/usr/bin/env python3
"""Offline tests for the structure extractor — no network, no market data.

    python3 tools/test_structure.py

Every case has an answer known in advance, either from the written methodology
(ATR's Wilder recursion, the quote/tick signing rules) or from a synthetic
series built to contain one specific shape. Runs in under a second, so it is
cheap to run after any change to structure.py / flow.py / indicators.py.

A note on the range fixtures, because it cost a debugging round: a zero-drift
RANDOM WALK is not a flat market. It wanders, and over 200 bars it routinely
travels several ATR in one direction — which is a trend, and the classifier is
right to say so. "No trend" means MEAN-REVERTING, so the range fixtures pull
price back toward a centre. Testing a random walk and demanding 'neutral' tests
nothing except the fixture.
"""

from __future__ import annotations

import datetime as dt
import random
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import flow                      # noqa: E402
import indicators as ind         # noqa: E402
import structure as st           # noqa: E402

FAILURES: list[str] = []


def check(name: str, got, want) -> None:
    ok = got == want
    print(f"  {'PASS' if ok else 'FAIL'}  {name:44} {got!r}"
          + ("" if ok else f"  (want {want!r})"))
    if not ok:
        FAILURES.append(name)


def bars_from(closes: list[float], noise: float = 0.4) -> list[dict]:
    out, d = [], dt.date(2020, 1, 1)
    for i, c in enumerate(closes):
        o = closes[i - 1] if i else c
        out.append({"date": d, "o": o, "h": max(o, c) + noise,
                    "l": min(o, c) - noise, "c": c, "v": 1e6})
        d += dt.timedelta(days=1)
    return out


def trend(n: int, step: float, noise: float, seed: int, start=100.0) -> list[float]:
    random.seed(seed)
    px, out = start, []
    for _ in range(n):
        px += step + random.uniform(-noise, noise)
        out.append(px)
    return out


def ranging(n: int, centre: float, noise: float, seed: int, pull=0.15) -> list[float]:
    """Mean-reverting — an actual range, not a random walk (see module docstring)."""
    random.seed(seed)
    px, out = centre, []
    for _ in range(n):
        px += -pull * (px - centre) + random.uniform(-noise, noise)
        out.append(px)
    return out


def read_structure(closes: list[float]) -> str:
    b = bars_from(closes)
    h, l, c = ([x["h"] for x in b], [x["l"] for x in b], [x["c"] for x in b])
    return st.classify_structure(
        st.significant_swings(st.swings(h, l), ind.atr(h, l, c)),
        b, st.STRUCT_LOOKBACK['d'])


# ── ATR, against the written formula ────────────────────────────────────────
print("ATR(14) — Wilder")
h = [10 + i * 0.1 for i in range(40)]
l = [9 + i * 0.1 for i in range(40)]
c = [9.5 + i * 0.1 for i in range(40)]
a = ind.atr(h, l, c)
check("flat true range: seed == later == TR", (a[14], round(a[-1], 6)), (1.0, 1.0))

h2, l2, c2 = h[:], l[:], c[:]
h2[20] += 5
a2 = ind.atr(h2, l2, c2)
tr = max(h2[20] - l2[20], abs(h2[20] - c2[19]), abs(l2[20] - c2[19]))
check("recursion == (13*prev + TR)/14",
      round(a2[20], 9), round((13 * a2[19] + tr) / 14, 9))
check("ATR% example from the methodology", round(8.62 / 90.20 * 100, 2), 9.56)

# ── swings ──────────────────────────────────────────────────────────────────
print("\nSwings — 2 candles each side")
seq = [1, 2, 3, 9, 3, 2, 1, 2, 3, 4]
check("one peak, one trough", [(s.i, s.kind) for s in st.swings(seq, seq)],
      [(3, 'high'), (6, 'low')])

# ── structure ───────────────────────────────────────────────────────────────
print("\nStructure — explicit swing lists (pivot-only form)")
S = st.Swing
check("higher high + higher low = bullish",
      st.classify_structure([S(0, 10, 'high'), S(1, 5, 'low'),
                             S(2, 12, 'high'), S(3, 7, 'low')]), 'bullish')
check("lower high + lower low = bearish",
      st.classify_structure([S(0, 12, 'high'), S(1, 7, 'low'),
                             S(2, 10, 'high'), S(3, 5, 'low')]), 'bearish')
check("conflicting = neutral",
      st.classify_structure([S(0, 10, 'high'), S(1, 5, 'low'),
                             S(2, 12, 'high'), S(3, 4, 'low')]), 'neutral')

print("\nStructure — synthetic series, every seed must agree")
SEEDS = range(1, 11)
cases = [
    ("sustained decline, no pivots",
     lambda s: trend(200, -1.2, 0.4, s), 'bearish'),
    ("sustained advance, no pivots",
     lambda s: trend(200, +1.2, 0.4, s), 'bullish'),
    ("hard drop (LITE-like, ~4/bar)",
     lambda s: trend(200, -4.0, 0.4, s), 'bearish'),
    ("mean-reverting range",
     lambda s: ranging(200, 100.0, 1.2, s), 'neutral'),
    ("tight mean-reverting range",
     lambda s: ranging(200, 50.0, 0.6, s), 'neutral'),
]
for name, gen, want in cases:
    got = {read_structure(gen(s)) for s in SEEDS}
    check(name, got.pop() if len(got) == 1 else sorted(got), want)

# ── zones ───────────────────────────────────────────────────────────────────
print("\nZones")
random.seed(11)
bars, px, d = [], 700.0, dt.date(2023, 1, 1)
for n, step, vol in ((80, 0, 25), (10, -28, 25), (40, 0, 25), (10, 26, 25), (40, 0, 25)):
    for _ in range(n):
        o = px
        cl = px + step + random.uniform(-vol, vol)
        bars.append({"date": d, "o": o, "h": max(o, cl) + vol, "l": min(o, cl) - vol,
                     "c": cl, "v": 1e6})
        px, d = cl, d + dt.timedelta(days=1)
atr = ind.atr([b["h"] for b in bars], [b["l"] for b in bars], [b["c"] for b in bars])
zones = st.find_zones(bars, atr)
check("high-ATR name still forms zones", len(zones) > 0, True)
check("no zone wider than the ATR cap",
      all(z.hi - z.lo <= st.MAX_ZONE_ATR * z.atr_at + 1e-9 for z in zones), True)

Z = st.Zone
held = [Z('demand', 680.0, 785.0, 10, dt.date(2025, 1, 1), atr_at=70),
        Z('demand', 539.0, 593.0, 20, dt.date(2025, 2, 1), atr_at=70),
        Z('supply', 700.0, 760.0, 30, dt.date(2025, 3, 1), atr_at=70)]
p = 713.94
dem = st.nearest(held, p, 'demand')
check("the zone price is INSIDE is nearest demand",
      (dem[0].lo, dem[0].hi), (680.0, 785.0))
check("position agrees with the zone lists",
      st._position(p, dem, st.nearest(held, p, 'supply'), held).startswith("inside"), True)

# ── flow signing ────────────────────────────────────────────────────────────
print("\nOrder flow — signing")
check("quote rule: at ask / at bid / inside",
      flow.sign_trades([{"price": 10.05, "size": 100, "bid": 10.00, "ask": 10.05},
                        {"price": 10.00, "size": 200, "bid": 10.00, "ask": 10.05},
                        {"price": 10.02, "size": 300, "bid": 10.00, "ask": 10.05}]),
      (400.0, 200.0, 0.0))
check("tick rule: unchanged price inherits direction",
      flow.sign_trades([{"price": 10.00, "size": 100}, {"price": 10.10, "size": 100},
                        {"price": 10.10, "size": 100}, {"price": 9.90, "size": 100}]),
      (200.0, 100.0, 100.0))
s = flow.summarise([{"price": 100.0, "size": 50, "off_exchange": True},
                    {"price": 100.0, "size": 10_000, "off_exchange": False},
                    {"price": 100.0, "size": 2_500, "off_exchange": False},
                    {"price": 100.0, "size": 100, "off_exchange": False}])
check("block share (>=10k shares or >=$200k)", s["blockShare"], 98.81)
check("odd-lot share is per TRADE", s["oddLotShare"], 25.0)
check("no venue codes -> None, not 0",
      flow.summarise([{"price": 1.0, "size": 100}])["offExchShare"], None)

# ── ticker parsing ──────────────────────────────────────────────────────────
print("\nTicker input")
import re                                                          # noqa: E402
for raw in ("AKAM, LITE, TE", " akam,lite ,, te "):
    check(f"{raw!r} splits on commas too",
          [t for t in re.split(r"[,\s]+", raw.upper()) if t], ['AKAM', 'LITE', 'TE'])

print()
if FAILURES:
    print(f"{len(FAILURES)} FAILURE(S): " + ", ".join(FAILURES))
    raise SystemExit(1)
print("all checks pass")
