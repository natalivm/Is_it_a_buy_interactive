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
import json
import pathlib
import random
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import flow                      # noqa: E402
import refresh                   # noqa: E402
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
    """Bars with an INDEPENDENT wick per bar.

    A fixture that sets high = max(open, close) + a CONSTANT, with open equal to
    the previous close, cannot produce a strictly-confirmed pivot at all: every
    high either ties or monotonically tracks a neighbour, so `H_t > H_t±1` never
    holds. The old non-strict pivot rule masked that; the five-candle rule does
    not. Random wicks are both more realistic and what makes these fixtures
    exercise the pivot logic rather than defeat it."""
    random.seed(len(closes))
    out, d = [], dt.date(2020, 1, 1)
    for i, c in enumerate(closes):
        o = closes[i - 1] if i else c
        out.append({"date": d, "o": o,
                    "h": max(o, c) + random.uniform(0.05, noise * 2),
                    "l": min(o, c) - random.uniform(0.05, noise * 2),
                    "c": c, "v": 1e6})
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

# ── frames: monthly / weekly / daily off one 4y daily pull ──────────────────
print("\nFrames — 4y of daily must feed every frame")
random.seed(5)
_bars, _px, _d = [], 100.0, dt.date(2022, 8, 1)
for _n, _step in ((504, +0.30), (504, -0.28)):
    for _ in range(_n):
        while _d.weekday() > 4:
            _d += dt.timedelta(days=1)
        _o = _px
        _c = _px + _step + random.uniform(-1.2, 1.2)
        _bars.append({"date": _d, "o": _o,
                      "h": max(_o, _c) + random.uniform(0.1, 1.2),
                      "l": min(_o, _c) - random.uniform(0.1, 1.2),
                      "c": _c, "v": 1e6})
        _px, _d = _c, _d + dt.timedelta(days=1)
_wk, _mo = ind.resample(_bars, 'W'), ind.resample(_bars, 'M')
for _f, _seq in (('d', _bars), ('w', _wk), ('m', _mo)):
    _need = st.STRUCT_LOOKBACK[_f] + st.ATR_WARMUP
    check(f"{_f} frame has its lookback + warmup ({_need} bars)",
          len(_seq) >= _need, True)


def _read(seq, frame):
    h, l, c = ([b['h'] for b in seq], [b['l'] for b in seq], [b['c'] for b in seq])
    return st.classify_structure(
        st.significant_swings(st.swings(h, l), ind.atr(h, l, c)),
        seq, st.STRUCT_LOOKBACK[frame])


# 2y advance then 2y decline: every lookback ends inside the decline.
check("monthly reads the current regime", _read(_mo, 'm'), 'bearish')
check("weekly reads the current regime", _read(_wk, 'w'), 'bearish')
check("daily reads the current regime", _read(_bars, 'd'), 'bearish')
check("an under-fed frame refuses to score",
      st._frame_ok(ind.resample(_bars[-252:], 'M'), 'm', 'TEST'), False)

# ── zones ───────────────────────────────────────────────────────────────────
print("\nZones")
random.seed(11)
bars, px, d = [], 700.0, dt.date(2023, 1, 1)
for n, step, vol in ((80, 0, 25), (10, -28, 25), (40, 0, 25), (10, 26, 25), (40, 0, 25)):
    for _ in range(n):
        o = px
        cl = px + step + random.uniform(-vol, vol)
        bars.append({"date": d, "o": o,
                     "h": max(o, cl) + random.uniform(1, vol),
                     "l": min(o, cl) - random.uniform(1, vol),
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

# ── break of structure ──────────────────────────────────────────────────────
print("\nBreak of structure — a lost level invalidates the read")


def _bos_shape(final, bounce_to=820.0, seed=5):
    """LITE's actual weekly shape: H 960 -> L 317 -> H 1085 -> L 780.5 -> a
    SMALL bounce -> decline to `final`.

    The bounce is deliberately under the 0.75-ATR significance floor, so
    significant_swings drops it and the stale HH/HL survives — which is exactly
    why LITE kept printing 'weekly bullish' while trading below the very low
    that read depends on. The fixture has to reproduce that or it tests
    nothing: an ordinary monotonic tail never confirms the low as a pivot at
    all, and the break can never be detected."""
    random.seed(seed)
    legs = [(6, 900.0, 960.0), (10, 960.0, 317.0), (10, 317.0, 700.0),
            (8, 700.0, 1085.0), (6, 1085.0, 780.5), (4, 780.5, bounce_to),
            (8, bounce_to, final)]
    bars, d = [], dt.date(2025, 1, 6)
    for n, a_, b_ in legs:
        for i in range(n):
            o = a_ + (b_ - a_) * i / n
            c_ = a_ + (b_ - a_) * (i + 1) / n
            bars.append({"date": d, "o": o,
                         "h": max(o, c_) + random.uniform(1, 6),
                         "l": min(o, c_) - random.uniform(1, 6),
                         "c": c_, "v": 1e6})
            d += dt.timedelta(days=7)
    return bars


def _bos_read(bars):
    h, l, c = ([b['h'] for b in bars], [b['l'] for b in bars], [b['c'] for b in bars])
    return st.classify_structure(
        st.significant_swings(st.swings(h, l), ind.atr(h, l, c)), bars, 52)


check("HH/HL holding above the last low stays bullish", _bos_read(_bos_shape(830.0)),
      'bullish')
check("…the SAME shape closing below that low is neutral",
      _bos_read(_bos_shape(713.94)), 'neutral')
check("a lost level never flips the read to the opposite trend",
      _bos_read(_bos_shape(713.94)) != 'bearish', True)

# ── standardized per-timeframe trend score ──────────────────────────────────
print("\nTrendScore = 3S + 2E + A + M")
check("band: +7 / +5", (st.trend_band(7), st.trend_band(5)),
      ('strong uptrend', 'strong uptrend'))
check("band: +4 / +2", (st.trend_band(4), st.trend_band(2)), ('uptrend', 'uptrend'))
check("band: +1 / -1", (st.trend_band(1), st.trend_band(-1)),
      ('range / transition', 'range / transition'))
check("band: -2 / -4", (st.trend_band(-2), st.trend_band(-4)),
      ('downtrend', 'downtrend'))
check("band: -5 / -7", (st.trend_band(-5), st.trend_band(-7)),
      ('strong downtrend', 'strong downtrend'))


def _tbars(n, step, seed, start=100.0):
    random.seed(seed)
    px, out, d = start, [], dt.date(2020, 1, 1)
    for _ in range(n):
        o = px
        c = px + step + random.uniform(-0.5, 0.5)
        out.append({"date": d, "o": o,
                    "h": max(o, c) + random.uniform(0.05, 0.5),
                    "l": min(o, c) - random.uniform(0.05, 0.5),
                    "c": c, "v": 1e6})
        px, d = c, d + dt.timedelta(days=1)
    return out


_up = st.trend_score(_tbars(500, +0.6, 7), 'bullish')
_dn = st.trend_score(_tbars(500, -0.6, 7), 'bearish')
check("a sustained advance scores an uptrend band",
      _dir_ok := _up['band'] in ('uptrend', 'strong uptrend'), True)
check("a sustained decline scores a downtrend band",
      _dn['band'] in ('downtrend', 'strong downtrend'), True)
check("score equals 3S + 2E + A + M",
      _up['score'], 3 * _up['S'] + 2 * _up['E'] + _up['A'] + _up['M'])
check("structure carries the largest weight", abs(3 * _up['S']) >= abs(2 * _up['E']), True)

_short = st.trend_score(_tbars(60, +0.5, 3), 'bullish')
check("a short history NAMES its missing components",
      sorted(_short['missing']), ['200 EMA', '50 EMA'])
check("…and scores those components 0, not neutral evidence",
      (_short['E'], _short['A']), (0, 0))

# The mixed-structure table, verbatim from the rules.
check("monthly up + weekly down", st.combo_read('uptrend', 'downtrend', 'downtrend'),
      'correction inside a larger uptrend')
check("weekly up + daily down", st.combo_read('uptrend', 'uptrend', 'downtrend'),
      'daily pullback inside a weekly uptrend')
check("weekly down + daily bounce", st.combo_read('downtrend', 'downtrend', 'uptrend'),
      'countertrend bounce — usually better used to find a short')
check("weekly and daily both range",
      st.combo_read('range / transition', 'range / transition', 'range / transition'),
      'no directional edge')

# Five-candle pivots are STRICT on both sides.
check("a tie is not a pivot", st.swings([1, 2, 9, 9, 3, 2, 1], [1, 2, 9, 9, 3, 2, 1]), [])

# ── structural levels when a side has no zone ───────────────────────────────
print("\nStructural fallback — a decline leaves no demand zone behind it")
random.seed(4)
_db, _p, _dd = [], 180.0, dt.date(2025, 8, 1)
for _ in range(300):
    _o = _p
    _c = _p - 0.35 + random.uniform(-2.2, 2.2)
    _db.append({"date": _dd, "o": _o,
                "h": max(_o, _c) + random.uniform(0.2, 2.2),
                "l": min(_o, _c) - random.uniform(0.2, 2.2),
                "c": _c, "v": 1e6})
    _p, _dd = _c, _dd + dt.timedelta(days=1)
_dh = [b["h"] for b in _db]
_dl = [b["l"] for b in _db]
_dc = [b["c"] for b in _db]
_da = ind.atr(_dh, _dl, _dc)
_price = _dc[-1]
_zs = st.find_zones(_db, _da)
check("a sustained decline forms no demand zone",
      len(st.nearest(_zs, _price, 'demand')), 0)
check("…but it does form supply", len(st.nearest(_zs, _price, 'supply')) > 0, True)

_sig = st.significant_swings(st.swings(_dh, _dl), _da)
_win = [x for x in _sig if x.i >= len(_db) - st.MAX_ZONE_AGE]
_fb = st.structural_levels(_win, _price, 'demand')
check("fallback names swing lows instead", len(_fb) > 0, True)
check("all below price", all(z['lo'] < _price for z in _fb), True)
check("nearest first", _fb == sorted(_fb, key=lambda z: _price - z['lo']), True)
check("flagged structural, never as a zone",
      all(z['strength'] == 'structural' and z['touches'] is None for z in _fb), True)

check("frame evidence names the pivots it compared",
      st.explain_structure(_sig, _db, st.STRUCT_LOOKBACK['d']).startswith('pivots: highs'),
      True)

# ── a side whose every zone straddles price ─────────────────────────────────
# The LITE shape: one supply zone with price INSIDE it, so the list has nothing
# left to break and `_bull` reads "close above" a level price already occupies.
print("\nFar-side reference — every zone on the side straddles price")
_sw = [st.Swing(i=200, price=897.0, kind='high'),
       st.Swing(i=210, price=839.88, kind='high'),
       st.Swing(i=220, price=594.84, kind='low')]
_straddle = [{'lo': 762.99, 'hi': 852.78, 'strength': 'weak'}]
_topped = st.with_reference(_straddle, _sw, 826.26, 'supply')
check("keeps the computed zone", _topped[0], _straddle[0])
check("adds the next swing high above the band",
      [z['lo'] for z in _topped[1:]], [897.0])
check("…flagged structural, not as a zone",
      _topped[1]['strength'] == 'structural' and _topped[1]['touches'] is None,
      True)
# 839.88 is above price but INSIDE the zone already printed — the same level
# named twice, not a further reference.
check("skips a swing high inside the reported zone",
      839.88 in [z['lo'] for z in _topped], False)
# A side that already has something to break is left exactly as it was.
_clear = [{'lo': 900.0, 'hi': 910.0, 'strength': 'fresh'}]
check("a side with a zone above price is untouched",
      st.with_reference(_clear, _sw, 826.26, 'supply'), _clear)
# ONE zone clear of price is enough, however consumed the rest of the band is.
# This is the INTC shape — $100.23–104.18 straddles $101.06, but $107.45–109.00
# does not, so the row has a level to break and nothing is topped up. Whether a
# band of three weak zones inside 8% should collapse to one is a DIFFERENT
# question about zone grading, and this rule deliberately does not answer it.
_intc = [{'lo': 100.23, 'hi': 104.18, 'strength': 'weak'},
         {'lo': 103.12, 'hi': 106.17, 'strength': 'weak'},
         {'lo': 107.45, 'hi': 109.0, 'strength': 'weak'}]
check("one zone clear of price is enough to leave the side alone",
      st.with_reference(_intc, [st.Swing(i=200, price=116.77, kind='high')],
                        101.06, 'supply'), _intc)
# The cap holds, so the cell does not grow a line: the farthest straddling zone
# gives way to the reference beyond it.
_all_straddle = [{'lo': 95.0, 'hi': 105.0, 'strength': 'weak'},
                 {'lo': 98.0, 'hi': 110.0, 'strength': 'weak'},
                 {'lo': 99.0, 'hi': 115.0, 'strength': 'weak'}]
check("caps at three, dropping the farthest straddling zone",
      [z['hi'] for z in st.with_reference(
          _all_straddle, [st.Swing(i=200, price=130.0, kind='high')],
          101.06, 'supply')], [105.0, 110.0, 130.0])
# Nothing within MAX_ZONE_DIST beyond the band → a short list, never a guess.
check("no reachable swing leaves the list alone",
      st.with_reference(_straddle, [], 826.26, 'supply'), _straddle)
# ── a trigger may not target a level inside itself ──────────────────────────
# The INTC shape: zones are ordered by distance from price and they overlap, so
# zones[1] can sit INSIDE zones[0] — "close above $100.23-104.18 → $103.12-
# 106.17" targets a price reached before the break it depends on.
print("\nTriggers — the target has to clear the level being broken")
check("bull skips a supply zone overlapping the one it breaks",
      st._bull(101.06, _intc), 'close above $100.23–104.18 → $107.45–109.00')
check("bear skips a demand zone overlapping the one it breaks",
      st._bear(321.55, [{'lo': 314.60, 'hi': 335.79, 'strength': 'weak'},
                        {'lo': 306.93, 'hi': 319.91, 'strength': 'weak'}]),
      'close below $314.60–335.79')
check("a clear second zone is still quoted as the target",
      st._bull(101.06, [{'lo': 105.0, 'hi': 110.0, 'strength': 'weak'},
                        {'lo': 120.0, 'hi': 125.0, 'strength': 'fresh'}]),
      'close above $105.00–110.00 → $120.00–125.00')
check("the farther of two overlapping zones can still be the target",
      st._bull(101.06, [{'lo': 102.0, 'hi': 108.0, 'strength': 'weak'},
                        {'lo': 105.0, 'hi': 112.0, 'strength': 'weak'},
                        {'lo': 115.0, 'hi': 120.0, 'strength': 'weak'}]),
      'close above $102.00–108.00 → $115.00–120.00')
check("an empty side says so rather than naming a level",
      st._bull(101.06, []), 'no supply within range — nothing to reclaim')

check("the same rule reads downward for demand",
      [z['lo'] for z in st.with_reference(
          [{'lo': 600.0, 'hi': 900.0, 'strength': 'weak'}], _sw, 826.26, 'demand')],
      [600.0, 594.84])

# ── volume in zone strength ─────────────────────────────────────────────────
print("\nVolume — 'high-volume selling enters demand' (the written rule)")


def _graded(touches, closes_in, heavy):
    z = Z('demand', 99.0, 100.0, 70, dt.date(2025, 6, 1), atr_at=2.0)
    z.touches, z.closes_in, z.heavy_touches = touches, closes_in, heavy
    st._restrength(z)
    return z.strength


# Two revisits, identical price action — volume is the only variable.
check("2 quiet revisits stay 'tested'", _graded(2, 0, 0), 'tested')
check("2 HEAVY revisits consume the zone", _graded(2, 0, 2), 'weak')
# The price-only paths must not have shifted.
check("3 revisits still weak", _graded(3, 0, 0), 'weak')
check("2 closes inside still weak", _graded(1, 2, 0), 'weak')
check("1 quiet touch still tested", _graded(1, 0, 0), 'tested')
check("untouched still fresh", _graded(0, 0, 0), 'fresh')

_vb = [{"date": dt.date(2025, 1, 1), "o": 1, "h": 1, "l": 1, "c": 1, "v": 1_000_000}
       for _ in range(60)]
_vb.append({"date": dt.date(2025, 4, 1), "o": 1, "h": 1, "l": 1, "c": 1, "v": 3_000_000})
check("rel_volume is a multiple of the trailing median",
      round(st.rel_volume(_vb, 60), 2), 3.0)
check("a zero-volume bar reads 0, not a crash",
      st.rel_volume([{"date": dt.date(2025, 1, 1), "o": 1, "h": 1, "l": 1,
                      "c": 1, "v": 0}] * 5, 4), 0.0)

# ── card audit: rejection-only shorts ───────────────────────────────────────
# A rejection-only entry is TAKEN inside its zone — the trigger is the reversal
# printing there, not price arriving — so neither "the zone must be above price"
# nor "price inside the zone → live" holds for one. What still has to fire is
# the COHR shape: a fade whose whole zone is behind price, with nothing overhead.
print("\nCard audit — a rejection-only short is entered INSIDE its zone")


def _zone_status_findings(entry, price, status, side='short'):
    card = {'symbol': 'TEST', 'side': side, 'exchange': 'NASDAQ',
            'date': '2026-08-05', 'price': f'${price}', 'story': 'stories/crwv.html',
            'lead': {'entry': entry, 'stop': '$200', 'targets': '$50',
                     'rr': '~1:1', 'status': status}}
    return [f for f in refresh.audit_card(card, price)
            if 'SHORT zone' in f or 'status' in f]


check("price INSIDE a fade zone is the setup, not a finding",
      _zone_status_findings('fade the rejection in $88–97', 89.89, 'live'), [])
check("…and 'wait' inside it is the analyst's call to keep",
      _zone_status_findings('rejection printed in $96–102', 101.06, 'wait'), [])
check("price at the zone's top edge is still inside it",
      _zone_status_findings('fade the rejection in $88–97', 97.0, 'live'), [])
check("a fade whose whole zone is behind price still fires",
      len(_zone_status_findings('fade the rejection in $70–75', 90.0, 'live')), 2)
check("a plain short is still tested at the zone floor",
      len(_zone_status_findings('short the $88–97 band', 89.89, 'live')), 1)

# ── card audit: signal/edge accretion ───────────────────────────────────────
# `signal` is the tile's CURRENT read and a refresh REPLACES it; git is the
# archive. Two dated close blocks in one field is the fingerprint of the
# prepend-forever mistake that grew the 36 signals to 349k characters.
print("\nCard audit — a signal is a current read, not a journal")


def _accrete(signal, edge=''):
    card = {'symbol': 'TEST', 'side': 'long', 'exchange': 'NASDAQ',
            'date': '2026-08-05', 'price': '$100', 'signal': signal,
            'story': 'stories/crwv.html',
            'lead': {'entry': '$90–95 dip', 'stop': '$85', 'targets': '$120',
                     'rr': '~4:1', 'status': 'wait', 'edge': edge}}
    return [f for f in refresh.audit_fields(card)
            if 'session blocks' in f or "'||'-separated" in f]


check("one dated close block is a current read",
      _accrete('📅 CLOSE 08/05 — held the level, plan unchanged.'), [])
check("an AH lead-in over the same session's close still passes",
      _accrete('🌙 AH −3% on earnings. 📅 CLOSE 08/05 — held the level.'), [])
check("a second dated block is flagged as accretion",
      len(_accrete('📅 CLOSE 08/05 — held. 📅 CLOSE 08/04 — also held.')), 1)
check("'||' history in edge is flagged",
      len(_accrete('📅 CLOSE 08/05 — held.', 'current read || ⛔ old cycle')), 1)
check("an edge without history passes",
      _accrete('📅 CLOSE 08/05 — held.', 'clean current read'), [])

# ── card audit: the ladder around the ТУТ rung ──────────────────────────────
# --fix-rungs re-cuts the ТУТ rung and only that rung, so its neighbours drift
# every time a card refreshes. Two things are decidable from the deck's own
# numbers: the ladder is a top-down price map, and a res/sup tag is a claim
# about which side of price the level is on.
print("\nCard audit — the ladder around the ТУТ rung")


def _write_bad(tmp=pathlib.Path('/tmp/ib-ladder-bad.html')):
    tmp.write_text("<div class='ladder' data-rungs='[[\"res\", oops]]'></div>", 'utf-8')
    return tmp


def _ladder(rungs, tmp=pathlib.Path('/tmp/ib-ladder-test.html')):
    tmp.write_text("<div class='ladder' data-rungs='"
                   + json.dumps(rungs, ensure_ascii=False) + "'></div>", 'utf-8')
    return refresh.audit_ladder({'symbol': 'TEST', 'story': str(tmp)}, tmp)


check("a ladder in price order with honest tags is silent",
      _ladder([["res", "$120", "cap"], ["now", "$100", "ТУТ"],
               ["sup", "$90", "floor"]]), [])
check("a res rung under the ТУТ price is caught",
      len([f for f in _ladder([["res", "$90", "stale cap"], ["now", "$100", "ТУТ"]])
           if 'tagged `res`' in f]), 1)
check("a sup rung over the ТУТ price is caught",
      len([f for f in _ladder([["now", "$100", "ТУТ"], ["sup", "$110", "stale floor"]])
           if 'tagged `sup`' in f]), 1)
check("a rung printed above a higher one is out of order",
      len([f for f in _ladder([["res", "$90", "a"], ["res", "$120", "b"],
                               ["now", "$100", "ТУТ"]])
           if 'price order' in f]), 1)
# A level INSIDE the band above it ('$99' under '$98–102') is ordered either
# way, and flagging it would make the check noise rather than a finding.
check("a level inside the band above it is not out of order",
      [f for f in _ladder([["res", "$98–102", "band"], ["res", "$99", "inside it"],
                           ["now", "$95", "ТУТ"]]) if 'price order' in f], [])
check("`key` carries no side claim, so it is never role-checked",
      [f for f in _ladder([["key", "$90", "either side"], ["now", "$100", "ТУТ"]])
       if 'tagged' in f], [])
check("a ladder with no ТУТ rung is still order-checked",
      len([f for f in _ladder([["res", "$90", "a"], ["res", "$120", "b"]])
           if 'price order' in f]), 1)
check("unparseable ladder JSON is a finding, not a crash",
      len([f for f in refresh.audit_ladder(
          {'symbol': 'TEST', 'story': '/tmp/ib-ladder-bad.html'},
          _write_bad()) if 'does not parse' in f]), 1)

# ── card audit: Rule B, the stop in ATR units ───────────────────────────────
# CLAUDE.md states the rule and records four of six measurable ranked plans
# failing it. It went untested because the audit had no ATR; a full run does.
print("\nCard audit — Rule B, the stop at least 1 ATR from the entry midpoint")


def _ruleB(entry, stop, atr, edge='', price=100.0):
    card = {'symbol': 'TEST', 'side': 'long', 'exchange': 'NASDAQ',
            'date': '2026-08-05', 'price': f'${price}', 'story': 'stories/crwv.html',
            'lead': {'entry': entry, 'stop': stop, 'targets': '$200', 'rr': '~5:1',
                     'status': 'wait', 'edge': edge}}
    return [f for f in refresh.audit_card(card, price, atr) if 'ATR from the entry' in f]


check("a stop inside 1 ATR is flagged",
      len(_ruleB('$95–105 dip', '$97', 5.0)), 1)
check("a stop beyond 1 ATR passes", _ruleB('$95–105 dip', '$92', 5.0), [])
check("a card that argues its own ATR trade-off is taken at its word",
      _ruleB('$95–105 dip', '$97', 5.0,
             edge='still only 0.54 ATR, and that is deliberate — the ATR-proof '
                  'alternative is $156'), [])
check("a FILLED plan is exempt — Rule B is an entry filter, not a trail",
      _ruleB('filled $100', '$97', 5.0), [])
check("no ATR (an --audit-only run) skips the check rather than guessing",
      _ruleB('$95–105 dip', '$97', None), [])

# ── card audit: the level chart's own ТУТ marker ────────────────────────────
print("\nCard audit — the cover slide's level chart against the card")


def _chart(chart_px, card_px, tmp=pathlib.Path('/tmp/ib-lv-test.html')):
    tmp.write_text('<svg data-lv=\'[["y", 120, "$' + chart_px
                   + '", "ТУТ · закриття 31.07 (−2.88%)"]]\'></svg>', 'utf-8')
    return refresh.audit_level_chart({'symbol': 'TEST'}, tmp, card_px)


check("a chart marker 20% off the card is reported", len(_chart('71.77', 89.89)), 1)
check("…and one inside 1% is not", _chart('89.50', 89.89), [])
check("a deck with no level chart is silent",
      refresh.audit_level_chart({'symbol': 'TEST'},
                                pathlib.Path('/tmp/ib-ladder-test.html'), 100.0), [])

# ── trend meter invariants ──────────────────────────────────────────────────
print("\nMARKET — the three fields around the computed bars")


def _mkt(**over):
    m = {'updated': '2026-08-05', 'note': 'short stance',
         'markets': [{'symbol': 'QQQ',
                      'checks': [{'label': 'Weekly', 'verdict': 'bull', 'weight': 1.5}],
                      'vol': {'value': '24.15', 'range': [18, 30]}}]}
    m.update(over)
    return refresh.audit_market(m, '2026-08-05')


check("a well-formed MARKET is silent", _mkt(), [])
check("a note over ~550 is flagged", len(_mkt(note='x' * 600)), 1)
check("`updated` behind the newest card is flagged",
      len([f for f in refresh.audit_market(
          {'updated': '2026-08-01', 'note': 'ok', 'markets': []},
          '2026-08-05') if 'behind the newest card' in f]), 1)
check("an unrecognised verdict is flagged — trendScore scores it 0 silently",
      len(_mkt(markets=[{'symbol': 'QQQ',
                         'checks': [{'label': 'W', 'verdict': 'bullish'}]}])), 1)
check("a non-numeric weight is flagged",
      len(_mkt(markets=[{'symbol': 'QQQ',
                         'checks': [{'label': 'W', 'verdict': 'bull',
                                     'weight': 'high'}]}])), 1)
check("a vol gauge with no two-ended range is flagged",
      len(_mkt(markets=[{'symbol': 'QQQ',
                         'checks': [{'label': 'W', 'verdict': 'bull'}],
                         'vol': {'value': '24', 'range': [18]}}])), 1)
check("a market with no checks is flagged",
      len(_mkt(markets=[{'symbol': 'QQQ', 'checks': []}])), 1)
check("a missing MARKET is one finding, not a crash",
      len(refresh.audit_market({}, None)), 1)

# ── nums() against planNums() in script.js ──────────────────────────────────
# The same deliberate cross-language pair as lean()/boardLean(), and the one
# without a guard — every plan number on the board is parsed by BOTH (the audit
# in Python, planProgress() in the browser), so a drift would put a different
# entry midpoint on the screen than in the report.
print("\nnums() must agree with planNums() in script.js, string for string")
CASES = ['fade the rejection in $88–97', '$1,287–1,346', 'filled $535',
         '$100 (dead >$97 close)', '$70 → $65 → $60.55', '1H close under $61',
         '', 'no numbers here', '$1,153.50–1,173.91', '+13.81% (2:36 ET)']
_js = json.loads(subprocess.run(
    ['node', '-e', """
      const fs = require('fs'), vm = require('vm');
      const noop = new Proxy(function () {}, {
          get: () => noop, apply: () => noop, construct: () => noop });
      const ctx = { document: noop, window: noop, navigator: noop, localStorage: noop,
          location: { hash: '' }, addEventListener() {}, setTimeout() {},
          matchMedia: () => ({ matches: false, addEventListener() {} }) };
      ctx.globalThis = ctx; vm.createContext(ctx);
      vm.runInContext(fs.readFileSync('board.js', 'utf8'), ctx);
      vm.runInContext(fs.readFileSync('script.js', 'utf8'), ctx);
      ctx.__in = """ + json.dumps(CASES) + """;
      vm.runInContext('this.__out = JSON.stringify(this.__in.map(planNums));', ctx);
      process.stdout.write(ctx.__out);
    """], capture_output=True, text=True, check=True,
    cwd=Path(__file__).resolve().parent.parent).stdout)
for _s, _want in zip(CASES, _js):
    check(f"nums({_s[:26]!r})", refresh.nums(_s), _want)

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

# ── board order: best longs first, best shorts last ─────────────────────────
print("\nBoard order — best longs at the top, best shorts at the bottom")

_LONG = {"preferred": "**Long preferred**"}
_SHORT = {"preferred": "**Short preferred**"}

check("a preferred long leans long", st.lean(_LONG), 'long')
check("a preferred short leans short", st.lean(_SHORT), 'short')
# The one case the substring test exists for: a row that prefers a long while
# naming the conditions for a short must not be read as a short. This is NOW.
check("'long preferred' survives the word 'short' later in the row",
      st.lean({"preferred": "**Tactical long preferred** while $103 holds. "
                                   "Short only after rejection from $116–126."}),
      'long')
check("no preferred: a positive score leans long", st.lean({"score": 2.5}), 'long')
check("no preferred: a negative score leans short", st.lean({"score": -2.5}), 'short')
check("no preferred and no score: bias prose decides",
      st.lean({"bias": "**Neutral-to-bearish.** Wait."}), 'short')
check("nothing to go on is flat, not a direction", st.lean({}), 'flat')

# Conviction is the STRUCTURE terms only — 2W + D + 0.5H + Z — so a seeded row
# and a generated one are ranked on the same evidence.
_frames = lambda w, d, h: {"structure": {"w": w, "d": d, "h4": h}}
check("2W + D + 0.5H with no zone term",
      st.conviction(_frames('bullish', 'bullish', 'bullish')), 3.5)
check("weekly carries double weight",
      st.conviction(_frames('bullish', 'bearish', 'neutral')), 1.0)
check("all bearish is the floor",
      st.conviction(_frames('bearish', 'bearish', 'bearish')), -3.5)
check("inside demand adds +1",
      st.conviction({**_frames('bearish', 'bearish', 'neutral'), "price": 50,
                            "demand": [{"lo": 48, "hi": 52}]}), -2.0)
check("inside supply subtracts 1",
      st.conviction({**_frames('bearish', 'bearish', 'neutral'), "price": 50,
                            "supply": [{"lo": 48, "hi": 52}]}), -4.0)
check("outside every zone is 0, not a guess",
      st.conviction({**_frames('bearish', 'bearish', 'neutral'), "price": 60,
                            "demand": [{"lo": 48, "hi": 52}]}), -3.0)
check("`parts` is used where the extractor computed the terms",
      st.conviction({"parts": {"W": 1, "D": 1, "H": 1, "Z": 1},
                            "structure": {"w": 'bearish', "d": 'bearish', "h4": 'bearish'}}),
      4.5)
# The oscillator terms are deliberately absent: R/M/O exist only on generated
# rows, and a key that reads more evidence for some rows than others is not one
# ranking. Same parts, opposite oscillators, same position on the board.
check("R/M/O never move a row",
      st.conviction({"parts": {"W": 1, "D": 0, "H": 0, "Z": 0, "R": 1, "M": 1, "O": 1}}),
      st.conviction({"parts": {"W": 1, "D": 0, "H": 0, "Z": 0, "R": -1, "M": -1, "O": -1}}))

_row = lambda t, pref, w, d, h: {"ticker": t, "preferred": pref,
                                 "structure": {"w": w, "d": d, "h4": h}}
_board = [
    _row('SHORTEST', '**Short preferred**', 'bearish', 'bearish', 'bearish'),
    _row('WEAKLONG', '**Long preferred**', 'neutral', 'neutral', 'neutral'),
    _row('MILDSHORT', '**Short preferred**', 'neutral', 'bearish', 'neutral'),
    _row('BESTLONG', '**Long preferred**', 'bullish', 'bullish', 'bullish'),
]
check("longs on top, shorts at the bottom, strongest at each end",
      [r['ticker'] for r in sorted(_board, key=st.order_key)],
      ['BESTLONG', 'WEAKLONG', 'MILDSHORT', 'SHORTEST'])
# A row whose verdict is a long belongs in the long block even when its frames
# are net bearish — the board shows the analyst's side, not the arithmetic's.
# NOW is exactly this: weekly down, daily and 4H up, tactical long preferred.
_ctr = _row('COUNTER', '**Tactical long preferred** while support holds.',
            'bearish', 'bullish', 'bullish')
check("a countertrend long sorts into the LONG block",
      [r['ticker'] for r in sorted([_ctr, _board[2]], key=st.order_key)],
      ['COUNTER', 'MILDSHORT'])
check("…and it is negative on structure, so it sits last among longs",
      st.conviction(_ctr) < 0, True)
# The generated fallback for `preferred` on a first-seen ticker has to survive
# lean() as the side its score already says, or a new row sorts into the wrong
# block on its first appearance.
check("generated 'Long preferred' fallback leans long",
      st.lean({"preferred": "**Long preferred** — computed from the score, not yet reviewed.",
               "score": 2.5}), 'long')
check("generated 'Short preferred' fallback leans short",
      st.lean({"preferred": "**Short preferred** — computed from the score, not yet reviewed.",
               "score": -2.5}), 'short')
# The neutral wording contains neither 'long' nor 'short', so lean() falls
# through the prose branch to the score — which is what should decide it.
check("neutral fallback defers to the score, not the prose",
      st.lean({"preferred": "**Neutral — no computed edge** — computed from the score, not yet reviewed.",
               "score": -1.5}), 'short')

check("ties break on ticker, so a row never wanders",
      [r['ticker'] for r in sorted(
          [_row('ZZ', '**Long preferred**', 'bullish', 'neutral', 'neutral'),
           _row('AA', '**Long preferred**', 'bullish', 'neutral', 'neutral')],
          key=st.order_key)],
      ['AA', 'ZZ'])

print()
if FAILURES:
    print(f"{len(FAILURES)} FAILURE(S): " + ", ".join(FAILURES))
    raise SystemExit(1)
print("all checks pass")
