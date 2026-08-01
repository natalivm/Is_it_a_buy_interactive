#!/usr/bin/env python3
"""Structure board extractor — supply/demand, structure and bias, computed.

Generates `board.js` (the standalone structure board rendered by the table-view
button) from OHLCV alone. Nothing here reads or writes `data.js`: the cards and
this board are separate elements and are allowed to disagree.

This implements the written methodology exactly, so every cell on the board is
reproducible from one OHLC source instead of from judgement:

  ATR(14)     Wilder, ATR% = ATR / close * 100          (indicators.atr)
  RSI(14)     Wilder                                     (indicators.rsi)
  EMA 9/50/200, MACD(12,26,9), BB(21,2), Stoch(14,3,3), OBV — as charted

  Swings      a swing high is higher than >= 2 candles on BOTH sides; a swing
              low is lower than >= 2 on both sides. Unconfirmed (fewer than 2
              bars to the right) pivots are not swings yet.
  Structure   bullish = confirmed higher high AND higher low
              bearish = confirmed lower high AND lower low
              neutral = conflicting, or price trapped between supply and demand
  Demand      the last bearish/neutral candle (or small base) before an up
              displacement that BREAKS a swing high:
                  [lowest wick, highest body edge]  — wick outside, body inside
  Supply      the last bullish/neutral candle (or base) before a down
              displacement that BREAKS a swing low:
                  [lowest body edge, highest wick]
  Strength    fresh    — no meaningful revisit since departure
              tested   — one or two revisits, reacts but returns
              weak     — 3+ revisits, or multiple CLOSES inside (consumption).
              A wick in + an immediate close back outside is rejection, not a
              close inside; only closes inside count as acceptance.
  Bias        Score = 2W + D + 0.5H + 0.5R + 0.5M + 0.5O + Z, each term -1/0/+1
                W weekly structure   D daily structure   H 4H structure
                R RSI vs 50          M MACD histogram improving/deteriorating
                O OBV slope          Z inside confirmed demand +1 / supply -1
              >= 3 strongly bullish · 1.5..3 bullish · -1.5..1.5 neutral
              -3..-1.5 bearish · <= -3 strongly bearish

Frames: MONTHLY for the overall view, WEEKLY and DAILY as the working frames,
plus 4H for entry timing. Monthly is context only — it is NOT a scoring term,
because the score above is fixed and adding one would make every past score
incomparable (its M is the MACD histogram, not the month).

Only 4y of daily history is pulled, sized to the deepest frame that uses it:
24 monthly bars + an ATR(14) warmup is 38 months. The card refresher fetches
10y because it quotes a 200-week EMA; nothing here needs that. A frame without
enough bars for its lookback + warmup says so and scores 0 instead of guessing.

The 4H term needs intraday bars, which the daily fetcher cannot supply: Yahoo
serves 60m for ~730d, and 4H is built by resampling those (US equities have no
native 4H bar — see resample_4h). If intraday is unavailable for a ticker, H
scores 0 and the row says the 4H frame is missing rather than guessing it.

Usage:
    python3 tools/structure.py                    # every ticker in board.js
    python3 tools/structure.py AKAM LITE TE       # a few
    python3 tools/structure.py --no-intraday      # daily+weekly only (faster)
    python3 tools/structure.py --out board.js     # default is board.js
    python3 tools/structure.py --report r.txt     # also write the audit trail
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sys
import urllib.parse
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import subprocess                # noqa: E402
import indicators as ind          # noqa: E402
from refresh import UA, fetch_yahoo, load_board  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
BOARD_JS = ROOT / "board.js"

# Swing confirmation: strictly greater/less than this many candles on each side.
SWING_N = 2
# A displacement leg has to move at least this many ATRs to count as one — it is
# what separates "price drifted up" from "price left the zone".
DISPLACE_ATR = 1.0
# …measured over a WINDOW, not one candle. Requiring a single body of >= 1 ATR
# is impossible on a high-ATR name (LITE's ATR is 10.6% of price — no one candle
# does that), so those tickers produced almost no zones. A displacement is a
# leg, and legs run a few bars.
DISPLACE_BARS = 3
# Pivots closer together than this are noise, not structure. Without the filter
# classify_structure compares the last two MICRO-pivots out of ten years of
# bars — days apart, meaningless — and returns neutral for a name in an obvious
# trend (LITE scored W+0 D+0 while in a clear downtrend).
SWING_MIN_ATR = 0.75
# Structure is a read on the CURRENT regime, so only swings inside this window
# count. Without it the classifier compared two pivots from an earlier era and
# called a name in free-fall "neutral". Per frame, in that frame's own bars.
STRUCT_LOOKBACK = {'d': 120, 'w': 52, 'm': 24, 'h4': 120}
# How much daily history to pull. NOT 10y — this board's deepest frame is
# monthly, and 24 monthly bars plus an ATR(14) warmup is 38 months. 4y covers
# that with room (48 monthly, 208 weekly, ~1000 daily) and costs 60% less than
# the card refresher's 10y, which it needs only for its 200-week EMA seed.
FETCH_RANGE = "4y"
# Bars a frame needs before its read is trustworthy: its lookback plus the
# ATR(14) warmup the significance thresholds depend on.
ATR_WARMUP = 14
# When structure falls back to comparing window halves, how far the extremes
# have to shift before it counts as a trend rather than noise.
HALVES_MIN_ATR = 1.0
# How close to a zone counts as a revisit (fraction of the zone's own height).
REVISIT_PAD = 0.15
# Zones are reported only if they sit within this fraction of price; a level 60%
# away is not "nearest demand" in any useful sense.
MAX_ZONE_DIST = 0.45
# A zone wider than this many ATRs is not a zone, it is a range. Without the cap
# a chain of overlapping zones merges into one 20-point blob that "contains"
# every price and therefore says nothing.
MAX_ZONE_ATR = 2.0
# Two zones merge only when they genuinely describe the same level: the overlap
# has to be at least this share of the SMALLER zone, and the result still has to
# respect the width cap.
MERGE_OVERLAP = 0.5
# A level's character is its LATEST character. Over ten years the same area
# acts as demand once and supply later, and reporting both — LITE showed demand
# $680.66-785.49 beside supply $679.95-783.80, the same region twice — says
# nothing. When a demand and a supply zone overlap this much, the more recent
# one wins and the other is dropped.
CROSS_OVERLAP = 0.5
# Zones older than this many bars are history, not current structure. 1 year,
# not 2: at 2 years EVERY zone graded "weak", because revisits accumulate for as
# long as a zone exists, so an 18-month-old level is worn out by construction and
# the grade carried no information. The working frames here are weekly and daily;
# monthly is the overall view, not a source of tradeable levels.
MAX_ZONE_AGE = 252          # ~1 year of daily bars

# Volume thresholds, all RELATIVE to the ticker's own trailing median — a raw
# share count compares neither across tickers nor across time on one ticker.
VOL_BASE = 50            # bars in the trailing median
VOL_HEAVY = 1.5          # a bar at 1.5x its own normal is "high volume"
VOL_STRONG_FORM = 1.3    # displacement on this much volume is a strong origin


# ── swings and structure ────────────────────────────────────────────────────

@dataclass
class Swing:
    i: int
    price: float
    kind: str          # 'high' | 'low'


def swings(high: list[float], low: list[float], n: int = SWING_N) -> list[Swing]:
    """Confirmed swing points. A pivot needs n candles on BOTH sides, so the
    last n bars can never contain a confirmed swing — which is the point: an
    unconfirmed pivot is not structure yet."""
    out: list[Swing] = []
    for i in range(n, len(high) - n):
        window = range(i - n, i + n + 1)
        if all(high[i] >= high[j] for j in window) and \
           any(high[i] > high[j] for j in window if j != i):
            out.append(Swing(i, high[i], 'high'))
        if all(low[i] <= low[j] for j in window) and \
           any(low[i] < low[j] for j in window if j != i):
            out.append(Swing(i, low[i], 'low'))
    return out


def significant_swings(sw: list[Swing], atr_series) -> list[Swing]:
    """Collapse micro-pivots into an alternating high/low zigzag, keeping only
    legs worth at least SWING_MIN_ATR. Consecutive pivots of the same kind
    collapse to the more extreme one, so the result alternates."""
    out: list[Swing] = []
    for s in sorted(sw, key=lambda x: x.i):
        if not out:
            out.append(s)
            continue
        last = out[-1]
        if s.kind == last.kind:
            if (s.kind == 'high' and s.price > last.price) or \
               (s.kind == 'low' and s.price < last.price):
                out[-1] = s
            continue
        a = atr_series[s.i] if s.i < len(atr_series) else None
        if a and abs(s.price - last.price) < SWING_MIN_ATR * a:
            continue                                  # leg too small to count
        out.append(s)
    return out


def _halves(win: list[dict]) -> str:
    """The same higher-high/higher-low test, measured on the two halves of the
    window instead of on pivots.

    A steadily trending market makes NO confirmed pivots: in a clean decline
    every bar's low is under the last, so no bar has two higher lows on both
    sides and the pivot test has nothing to compare. That is the strongest
    possible trend, and pivots alone score it neutral. The definition still
    holds — it just has to be measured against the window's own extremes."""
    if len(win) < 10:
        return 'neutral'
    mid = len(win) // 2
    old, new = win[:mid], win[mid:]
    oh, nh = max(b["h"] for b in old), max(b["h"] for b in new)
    ol, nl = min(b["l"] for b in old), min(b["l"] for b in new)
    # The shift has to be worth something. Comparing two halves of a FLAT range
    # is comparing noise: whichever half happened to print the higher extreme
    # wins, and a directionless market gets scored as a trend. Demand a move of
    # at least HALVES_MIN_ATR before calling either side.
    a = ind.atr([b["h"] for b in win], [b["l"] for b in win],
                [b["c"] for b in win])[-1]
    thr = HALVES_MIN_ATR * a if a else 0.0
    if nh - oh > thr and nl - ol > thr:
        return 'bullish'
    if oh - nh > thr and ol - nl > thr:
        return 'bearish'
    return 'neutral'


def explain_structure(sw: list[Swing], bars: list[dict], lookback: int) -> str:
    """One line saying HOW a frame reached its verdict, so a surprising read is
    checkable rather than mysterious. LITE printing 'weekly bullish' while its
    4H is bearish is a legitimate output — but only if you can see the two
    swing highs and lows it compared, or that it fell back to window halves."""
    inwin = [s for s in sw if s.i >= len(bars) - lookback]
    highs = [s.price for s in inwin if s.kind == 'high'][-2:]
    lows = [s.price for s in inwin if s.kind == 'low'][-2:]
    if len(highs) < 2 or len(lows) < 2:
        win = bars[-lookback:]
        mid = len(win) // 2
        if len(win) < 10:
            return "too few bars"
        old, new = win[:mid], win[mid:]
        return (f"halves (too few pivots): high "
                f"{max(b['h'] for b in old):.2f}->{max(b['h'] for b in new):.2f}, "
                f"low {min(b['l'] for b in old):.2f}->{min(b['l'] for b in new):.2f}")
    return (f"pivots: highs {highs[0]:.2f}->{highs[1]:.2f}, "
            f"lows {lows[0]:.2f}->{lows[1]:.2f}")


def classify_structure(sw: list[Swing], bars: list[dict] | None = None,
                       lookback: int | None = None) -> str:
    """bullish = higher high AND higher low; bearish = lower high AND lower low;
    anything mixed is neutral. Only CONFIRMED, significant swings inside the
    lookback window count — a pivot from a previous regime says nothing about
    this one. With too few pivots in the window, the same test falls back to
    the window's halves (see _halves)."""
    if bars and lookback:
        cutoff = len(bars) - lookback
        sw = [s for s in sw if s.i >= cutoff]
    highs = [s.price for s in sw if s.kind == 'high'][-2:]
    lows = [s.price for s in sw if s.kind == 'low'][-2:]

    if len(highs) < 2 or len(lows) < 2:
        return _halves(bars[-lookback:]) if bars and lookback else 'neutral'

    hh, hl = highs[-1] > highs[-2], lows[-1] > lows[-2]
    lh, ll = highs[-1] < highs[-2], lows[-1] < lows[-2]
    pivot = 'bullish' if (hh and hl) else 'bearish' if (lh and ll) else 'neutral'
    if not (bars and lookback):
        return pivot                     # plain swing-list form: pivots only

    # Two independent reads, and they have to agree.
    #
    # The last two swings alone are a coin flip in a directionless range: noise
    # regularly prints a marginally higher high and higher low, and the pivot
    # test dutifully calls that an uptrend. The window's halves are steady but
    # blind to a fresh turn. Requiring both to say the same thing is exactly the
    # methodology's own rule — conflicting structure is neutral — and it is what
    # stops a flat range from being scored as a trend.
    halves = _halves(bars[-lookback:])
    return pivot if pivot == halves else 'neutral'


STRUCT_SCORE = {'bullish': 1, 'bearish': -1, 'neutral': 0}


# ── supply / demand zones ───────────────────────────────────────────────────

@dataclass
class Zone:
    kind: str          # 'demand' | 'supply'
    lo: float
    hi: float
    i: int             # index of the base's last candle
    date: dt.date
    atr_at: float = 0.0    # ATR when it formed — the width cap is measured in it
    touches: int = 0
    closes_in: int = 0
    # Volume, relative to the ticker's own recent median — an absolute share
    # count says nothing across tickers, and nothing across time on one ticker.
    form_vol: float = 0.0   # of the displacement leg that created the zone
    heavy_touches: int = 0  # revisits that arrived on above-average volume
    strength: str = 'fresh'
    extra: dict = field(default_factory=dict)

    @property
    def mid(self) -> float:
        return (self.lo + self.hi) / 2


def rel_volume(bars: list[dict], i: int, n: int = VOL_BASE) -> float:
    """Bar i's volume against the median of the n bars before it. Median, not
    mean, because one earnings-day spike drags a mean enough to make every
    ordinary bar afterwards look quiet."""
    lo = max(0, i - n)
    prior = sorted(b["v"] for b in bars[lo:i] if b["v"] > 0)
    if not prior or not bars[i]["v"]:
        return 0.0
    mid = prior[len(prior) // 2]
    return bars[i]["v"] / mid if mid else 0.0


def _base_span(bars, j, kind: str) -> tuple[int, int]:
    """Walk back from the displacement candle over the small base that preceded
    it: candles of the OPPOSITE or neutral character, at most 3 of them."""
    start = j
    for k in range(j, max(j - 3, 0) - 1, -1):
        b = bars[k]
        up = b["c"] > b["o"]
        if kind == 'demand' and up:        # demand base is bearish/neutral
            break
        if kind == 'supply' and not up:    # supply base is bullish/neutral
            break
        start = k
    return start, j


def _leg_vol(bars: list[dict], i: int) -> float:
    """Mean relative volume across the displacement leg. A zone left behind by
    a leg that traded well above normal has a stronger origin than one left by
    a drift on thin volume — the methodology's "strong displacement away"."""
    win = range(i, min(i + DISPLACE_BARS, len(bars)))
    vals = [rel_volume(bars, k) for k in win]
    vals = [v for v in vals if v > 0]
    return sum(vals) / len(vals) if vals else 0.0


def find_zones(bars: list[dict], atr_series: list[float | None]) -> list[Zone]:
    """Zones are formed by DISPLACEMENT that breaks structure, per the rule set:
    an up-move breaking a prior swing high leaves demand behind it; a down-move
    breaking a prior swing low leaves supply above it."""
    raw = swings([b["h"] for b in bars], [b["l"] for b in bars])
    sw = significant_swings(raw, atr_series)
    highs = [s for s in sw if s.kind == 'high']
    lows = [s for s in sw if s.kind == 'low']
    out: list[Zone] = []

    i = 1
    while i < len(bars):
        a = atr_series[i] if i < len(atr_series) else None
        if not a:
            i += 1
            continue
        b = bars[i]
        # The leg runs over the next few bars, measured from this bar's open to
        # the furthest CLOSE in the window — a wick alone is not displacement.
        win = bars[i:i + DISPLACE_BARS]
        up_to = max(x["c"] for x in win)
        dn_to = min(x["c"] for x in win)
        up_leg, dn_leg = up_to - b["o"], b["o"] - dn_to
        leg = up_leg if up_leg >= dn_leg else -dn_leg
        if abs(leg) < DISPLACE_ATR * a:
            i += 1
            continue                                   # not a displacement
        if leg > 0:
            prior = [s for s in highs if s.i < i]
            if not prior or up_to <= prior[-1].price:
                i += 1
                continue                               # broke no swing high
            lo_i, hi_i = _base_span(bars, i - 1, 'demand')
            base = bars[lo_i:hi_i + 1] or [bars[i - 1]]
            out.append(Zone('demand',
                            lo=min(x["l"] for x in base),               # wick
                            hi=max(max(x["o"], x["c"]) for x in base),  # body
                            i=hi_i, date=bars[hi_i]["date"], atr_at=a,
                            form_vol=round(_leg_vol(bars, i), 2)))
        else:
            prior = [s for s in lows if s.i < i]
            if not prior or dn_to >= prior[-1].price:
                i += 1
                continue                               # broke no swing low
            lo_i, hi_i = _base_span(bars, i - 1, 'supply')
            base = bars[lo_i:hi_i + 1] or [bars[i - 1]]
            out.append(Zone('supply',
                            lo=min(min(x["o"], x["c"]) for x in base),  # body
                            hi=max(x["h"] for x in base),               # wick
                            i=hi_i, date=bars[hi_i]["date"], atr_at=a,
                            form_vol=round(_leg_vol(bars, i), 2)))
        # Skip past the leg so one displacement leaves one zone, not three.
        i += DISPLACE_BARS

    # A base wider than the cap is a range, not a zone — drop it rather than
    # quoting a level nobody can trade against.
    out = [z for z in out if z.hi - z.lo <= MAX_ZONE_ATR * z.atr_at]
    # …and one older than the age cap is history. Both filters run before
    # scoring so strength is graded only on zones that still count.
    cutoff = len(bars) - MAX_ZONE_AGE
    out = [z for z in out if z.i >= cutoff]
    for z in out:
        _score_zone(z, bars)
    # Merge zones that describe the same level — the same shelf rediscovered is
    # one zone with more history, not two — then let the most recent read of a
    # level win when demand and supply describe the same region.
    return _resolve_cross(_merge(out))


def _score_zone(z: Zone, bars: list[dict]) -> None:
    """fresh / tested / weak, per the written rules: revisit count, whether
    price CLOSED inside (acceptance) rather than only wicking in (rejection),
    and — the clause volume answers — whether the selling arriving into demand
    (or the buying into supply) came on HIGH volume.

    A quiet revisit and a revisit on twice-normal volume are not the same
    event. The first is a test; the second is supply being absorbed or demand
    being eaten, and it consumes the zone faster."""
    pad = (z.hi - z.lo) * REVISIT_PAD
    inside = False
    for k in range(z.i + 2, len(bars)):
        b = bars[k]
        touching = b["l"] <= z.hi + pad and b["h"] >= z.lo - pad
        if touching and not inside:
            z.touches += 1
            inside = True
            if rel_volume(bars, k) >= VOL_HEAVY:
                z.heavy_touches += 1
        elif not touching:
            inside = False
        if touching and z.lo <= b["c"] <= z.hi:
            z.closes_in += 1
    _restrength(z)


def _merge(zones: list[Zone]) -> list[Zone]:
    """Merge only genuine duplicates. Plain "they overlap" chains A→B→C across a
    whole trend into one blob that contains every price and therefore says
    nothing, so a merge needs real overlap AND a result inside the width cap."""
    out: list[Zone] = []
    for z in sorted(zones, key=lambda x: (x.kind, x.lo)):
        p = out[-1] if out and out[-1].kind == z.kind else None
        ok = False
        if p is not None:
            overlap = min(p.hi, z.hi) - max(p.lo, z.lo)
            smaller = min(p.hi - p.lo, z.hi - z.lo) or 1e-9
            width = max(p.hi, z.hi) - min(p.lo, z.lo)
            cap = MAX_ZONE_ATR * max(p.atr_at, z.atr_at)
            ok = overlap >= MERGE_OVERLAP * smaller and width <= cap
        if ok:
            p.hi = max(p.hi, z.hi)
            p.lo = min(p.lo, z.lo)
            p.atr_at = max(p.atr_at, z.atr_at)
            p.touches = max(p.touches, z.touches)
            p.closes_in = max(p.closes_in, z.closes_in)
            p.heavy_touches = max(p.heavy_touches, z.heavy_touches)
            p.form_vol = max(p.form_vol, z.form_vol)
            if z.i > p.i:
                p.i, p.date = z.i, z.date
            _restrength(p)
        else:
            out.append(z)
    return out


def _resolve_cross(zones: list[Zone]) -> list[Zone]:
    """Drop the older of a demand/supply pair that describes the same region.

    A price area is not simultaneously the nearest demand and the nearest
    supply. Over a long history it genuinely acts as both — price based there,
    left, came back, and later broke down through it — but only its most recent
    behaviour is a current level.

    Overlap is measured against the LARGER zone, unlike _merge. Against the
    smaller one, a narrow supply sitting inside a wide demand overlaps it 100%
    and deletes it — which is how AKAM lost its only demand zone and ended up
    with no demand at all. A small zone inside a big one is a sub-region, not
    the same level; only near-coincident zones are."""
    drop: set[int] = set()
    dem = [z for z in zones if z.kind == 'demand']
    sup = [z for z in zones if z.kind == 'supply']
    for a in dem:
        for b in sup:
            overlap = min(a.hi, b.hi) - max(a.lo, b.lo)
            larger = max(a.hi - a.lo, b.hi - b.lo) or 1e-9
            if overlap >= CROSS_OVERLAP * larger:
                drop.add(id(b) if a.i > b.i else id(a))
    return [z for z in zones if id(z) not in drop]


def _restrength(z: Zone) -> None:
    # Two heavy-volume revisits consume a zone as surely as three quiet ones —
    # "high-volume selling enters demand, or high-volume buying enters supply".
    if z.touches >= 3 or z.closes_in >= 2 or z.heavy_touches >= 2:
        z.strength = 'weak'
    elif z.touches >= 1:
        z.strength = 'tested'
    else:
        z.strength = 'fresh'


def structural_levels(sw: list[Swing], price: float, kind: str,
                      n: int = 2) -> list[dict]:
    """Significant swing lows below price (or highs above) as SUPPORT/RESISTANCE
    references, for when no zone exists on that side.

    A name in a sustained decline has no demand zone behind it by construction:
    every displacement is downward, so every zone it leaves is supply. Reporting
    "no demand within range" is structurally true and useless — price still has
    swing lows under it, and those are the levels a chart reader would name.
    Flagged `structural` so they are never confused with a real zone."""
    if kind == 'demand':
        cand = sorted((s for s in sw if s.kind == 'low' and s.price < price),
                      key=lambda s: price - s.price)
    else:
        cand = sorted((s for s in sw if s.kind == 'high' and s.price > price),
                      key=lambda s: s.price - price)
    out = []
    for s in cand[:n]:
        if abs(s.price - price) / price > MAX_ZONE_DIST:
            continue
        out.append({'lo': round(s.price, 2), 'hi': round(s.price, 2),
                    'strength': 'structural', 'touches': None,
                    'note': f"swing {'low' if kind == 'demand' else 'high'}, "
                            f"no zone formed"})
    return out


def nearest(zones: list[Zone], price: float, kind: str, n: int = 3) -> list[Zone]:
    """The n nearest zones of a kind on the correct side of price: demand below,
    supply above. A 'demand' zone above price is resistance, not demand."""
    # A zone price is sitting INSIDE is the nearest one, at distance zero — the
    # old bounds (hi <= price, lo >= price) excluded exactly that zone, so the
    # demand list disagreed with the position line beside it.
    if kind == 'demand':
        cand = [z for z in zones if z.kind == 'demand' and z.lo <= price]
        cand.sort(key=lambda z: max(0.0, price - z.hi))
    else:
        cand = [z for z in zones if z.kind == 'supply' and z.hi >= price]
        cand.sort(key=lambda z: max(0.0, z.lo - price))
    return [z for z in cand if abs(z.mid - price) / price <= MAX_ZONE_DIST][:n]


# ── intraday / 4H ───────────────────────────────────────────────────────────

def fetch_yahoo_intraday(ticker: str, interval: str = "60m",
                         rng: str = "730d") -> list[dict]:
    """Same endpoint as the daily fetch, intraday interval. Yahoo caps the
    range per interval (60m ~730d, 15m ~60d, 1m ~7d) and silently DOWNGRADES
    rather than erroring when the pair is out of bounds, so the caller checks
    the spacing it actually got."""
    sym = urllib.parse.quote(ticker)
    url = (f"https://query1.finance.yahoo.com/v8/finance/chart/{sym}"
           f"?range={rng}&interval={interval}&includePrePost=false")
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        payload = json.loads(r.read().decode())
    chart = payload.get("chart") or {}
    if chart.get("error"):
        raise RuntimeError(f"{ticker}: Yahoo said {chart['error']}")
    res = (chart.get("result") or [None])[0]
    if not res:
        raise RuntimeError(f"{ticker}: Yahoo returned no result block")
    ts = res.get("timestamp") or []
    q = ((res.get("indicators") or {}).get("quote") or [{}])[0]
    o, h, lo, c, v = (q.get(k) or [] for k in ("open", "high", "low", "close", "volume"))
    bars = []
    for i, t in enumerate(ts):
        row = (o[i] if i < len(o) else None, h[i] if i < len(h) else None,
               lo[i] if i < len(lo) else None, c[i] if i < len(c) else None)
        if any(x is None for x in row):
            continue
        bars.append({"dtm": dt.datetime.fromtimestamp(t, dt.timezone.utc),
                     "date": dt.datetime.fromtimestamp(t, dt.timezone.utc).date(),
                     "o": float(row[0]), "h": float(row[1]), "l": float(row[2]),
                     "c": float(row[3]),
                     "v": float(v[i] or 0) if i < len(v) else 0.0})
    if len(bars) < 50:
        raise RuntimeError(f"{ticker}: only {len(bars)} intraday bars")
    return bars


def resample_4h(bars: list[dict]) -> list[dict]:
    """60m -> 4H. A US cash session is 6.5h, which does not divide by 4, so
    every vendor picks a convention and they disagree; ours is stated rather
    than assumed: bars are grouped into 4-hour buckets anchored at 00:00 UTC on
    regular-hours data only. Readings will therefore sit close to, not exactly
    on, a TradingView 4H pane."""
    out: list[dict] = []
    key = None
    for b in bars:
        k = (b["dtm"].date(), b["dtm"].hour // 4)
        if k != key:
            out.append({"date": b["date"], "dtm": b["dtm"], "o": b["o"], "h": b["h"],
                        "l": b["l"], "c": b["c"], "v": b["v"]})
            key = k
        else:
            cur = out[-1]
            cur["h"] = max(cur["h"], b["h"])
            cur["l"] = min(cur["l"], b["l"])
            cur["c"] = b["c"]
            cur["v"] += b["v"]
    return out


# ── the bias score ──────────────────────────────────────────────────────────

BIAS_BANDS = [
    (3.0, 'strongly bullish'),
    (1.5, 'bullish'),
    (-1.5, 'neutral'),
    (-3.0, 'bearish'),
]


def bias_label(score: float) -> str:
    if score >= 3:
        return 'strongly bullish'
    if score >= 1.5:
        return 'bullish'
    if score > -1.5:
        return 'neutral'
    if score > -3:
        return 'bearish'
    return 'strongly bearish'


def sign(x: float | None, mid: float = 0.0, dead: float = 0.0) -> int:
    if x is None:
        return 0
    if x > mid + dead:
        return 1
    if x < mid - dead:
        return -1
    return 0


def obv_slope(close: list[float], volume: list[float], look: int = 10) -> int:
    ob = ind.obv(close, volume)
    if len(ob) <= look or not any(volume):
        return 0
    a, b = ob[-look - 1], ob[-1]
    scale = max(abs(a), abs(b), 1.0)
    return sign((b - a) / scale, dead=0.005)


# ── per-ticker read ─────────────────────────────────────────────────────────

def _frame_ok(bars: list[dict], frame: str, ticker: str) -> bool:
    """Enough bars for this frame's lookback plus the ATR warmup? A frame read
    off half a window is a guess, and it should say so rather than score."""
    need = STRUCT_LOOKBACK[frame] + ATR_WARMUP
    if len(bars) >= need:
        return True
    print(f"  {ticker}: {frame} frame has {len(bars)} bars, needs {need} — "
          f"scoring it 0", file=sys.stderr)
    return False


def read_ticker(ticker: str, want_intraday: bool = True,
                flow: dict | None = None) -> dict:
    daily = fetch_yahoo(ticker, FETCH_RANGE)
    weekly = ind.resample(daily, 'W')
    monthly = ind.resample(daily, 'M')

    close = [b["c"] for b in daily]
    high = [b["h"] for b in daily]
    low = [b["l"] for b in daily]
    vol = [b["v"] for b in daily]
    price = close[-1]

    atr_series = ind.atr(high, low, close)
    a = atr_series[-1]
    rsi_d = ind.rsi(close)[-1]
    _, _, hist_d = ind.macd(close)

    d_sig = significant_swings(swings(high, low), atr_series)
    d_struct = classify_structure(d_sig, daily, STRUCT_LOOKBACK['d']) \
        if _frame_ok(daily, 'd', ticker) else 'neutral'
    d_why = explain_structure(d_sig, daily, STRUCT_LOOKBACK['d'])
    w_atr = ind.atr([b["h"] for b in weekly], [b["l"] for b in weekly],
                    [b["c"] for b in weekly])
    w_sig = significant_swings(
        swings([b["h"] for b in weekly], [b["l"] for b in weekly]), w_atr)
    w_struct = classify_structure(w_sig, weekly, STRUCT_LOOKBACK['w']) \
        if _frame_ok(weekly, 'w', ticker) else 'neutral'
    w_why = explain_structure(w_sig, weekly, STRUCT_LOOKBACK['w'])

    # Monthly is the overall view — context, deliberately NOT a scoring term.
    # The methodology's score is 2W + D + 0.5H + 0.5R + 0.5M + 0.5O + Z (its M
    # is the MACD histogram, not the month); bolting a monthly term on would
    # change the formula and make every past score incomparable.
    m_atr = ind.atr([b["h"] for b in monthly], [b["l"] for b in monthly],
                    [b["c"] for b in monthly])
    m_struct = classify_structure(significant_swings(
        swings([b["h"] for b in monthly], [b["l"] for b in monthly]), m_atr),
        monthly, STRUCT_LOOKBACK['m']) if _frame_ok(monthly, 'm', ticker) else None

    h4_struct, h4_note = 'neutral', 'no intraday data'
    if want_intraday:
        try:
            h4 = resample_4h(fetch_yahoo_intraday(ticker))
            h4_atr = ind.atr([b["h"] for b in h4], [b["l"] for b in h4],
                             [b["c"] for b in h4])
            h4_struct = classify_structure(significant_swings(
                swings([b["h"] for b in h4], [b["l"] for b in h4]), h4_atr),
                h4, STRUCT_LOOKBACK['h4'])
            h4_note = f"{len(h4)} 4H bars"
        except Exception as e:                       # noqa: BLE001 — reported
            h4_note = f"unavailable ({e})"

    zones = find_zones(daily, atr_series)
    dem = [_zone_json(z) for z in nearest(zones, price, 'demand')]
    sup = [_zone_json(z) for z in nearest(zones, price, 'supply')]
    # No zone on a side does NOT mean nothing is there. A name in a sustained
    # decline leaves only supply behind it, but it still has swing lows under
    # price, and those are the levels a chart reader would name.
    win_sw = [x for x in d_sig if x.i >= len(daily) - MAX_ZONE_AGE]
    if not dem:
        dem = structural_levels(win_sw, price, 'demand')
    if not sup:
        sup = structural_levels(win_sw, price, 'supply')

    # Z: inside a CONFIRMED (fresh or tested — not consumed) zone.
    z_term = 0
    for z in zones:
        if z.lo <= price <= z.hi and z.strength != 'weak':
            z_term = 1 if z.kind == 'demand' else -1
            break

    # M: is the histogram improving or deteriorating (their reading — a rising
    # histogram is improving momentum even while still negative).
    m_term = 0
    if len(hist_d) >= 2 and hist_d[-1] is not None and hist_d[-2] is not None:
        m_term = sign(hist_d[-1] - hist_d[-2])

    parts = {
        'W': STRUCT_SCORE[w_struct],
        'D': STRUCT_SCORE[d_struct],
        'H': STRUCT_SCORE[h4_struct] if h4_note.endswith('bars') else 0,
        'R': sign(rsi_d, 50.0) if rsi_d is not None else 0,
        'M': m_term,
        'O': obv_slope(close, vol),
        'Z': z_term,
    }
    score = (2 * parts['W'] + parts['D'] + 0.5 * parts['H'] + 0.5 * parts['R']
             + 0.5 * parts['M'] + 0.5 * parts['O'] + parts['Z'])

    row = {
        'ticker': ticker,
        'date': daily[-1]["date"].isoformat(),
        'price': round(price, 2),
        'atr': round(a, 2) if a else None,
        'atrPct': round(a / price * 100, 2) if a else None,
        # ATR history, kept only so --compare can tell a stale figure from a
        # wrong one. ~6 months: 25 sessions was too short to rule out a vintage
        # from earlier in the season, which made the verdict over-confident.
        # Stripped before board.js is written.
        '_atrHist': [(daily[i]["date"].isoformat(), round(v, 2))
                     for i, v in enumerate(atr_series)
                     if v is not None][-130:],
        'structure': {'m': m_struct, 'w': w_struct, 'd': d_struct,
                      'h4': h4_struct, 'h4Note': h4_note,
                      # How each read was reached, so a surprising verdict is
                      # checkable against the numbers it compared.
                      'why': {'d': d_why, 'w': w_why},
                      'bars': {'d': len(daily), 'w': len(weekly),
                               'm': len(monthly)}},
        'ind': {
            'rsi': round(rsi_d, 2) if rsi_d is not None else None,
            'macdHist': round(hist_d[-1], 3) if hist_d[-1] is not None else None,
            'obvSlope': parts['O'],
        },
        'parts': parts,
        'score': round(score, 2),
        'bias': bias_label(score),
        'demand': dem,
        'supply': sup,
        'position': _position(price, dem, sup, zones),
        'bull': _bull(price, sup),
        'bear': _bear(price, dem),
        'retest': _retest(price, dem, sup),
    }
    # Order-flow metrics from tools/flow.py, if that ran. Deliberately NOT in
    # `parts` or `score`: the methodology is 2W+D+0.5H+0.5R+0.5M+0.5O+Z, and
    # silently adding an eighth term would make every past score incomparable.
    if flow:
        row['flow'] = flow
    return row


def _zone_json(z: Zone) -> dict:
    return {'lo': round(z.lo, 2), 'hi': round(z.hi, 2), 'strength': z.strength,
            'touches': z.touches, 'closesIn': z.closes_in,
            # Volume evidence: how heavily the zone was created, and how many
            # revisits arrived on high volume.
            'formVol': z.form_vol, 'heavyTouches': z.heavy_touches,
            'origin': 'strong' if z.form_vol >= VOL_STRONG_FORM else 'thin',
            'since': z.date.isoformat()}


def _fmt(z: Zone | dict) -> str:
    lo, hi = (z['lo'], z['hi']) if isinstance(z, dict) else (z.lo, z.hi)
    return f"${lo:,.2f}–{hi:,.2f}"


def _hi(z):
    return z['hi'] if isinstance(z, dict) else z.hi


def _lo(z):
    return z['lo'] if isinstance(z, dict) else z.lo


def _position(price, dem, sup, zones) -> str:
    for z in zones:
        if z.lo <= price <= z.hi:
            return f"inside {z.strength} {z.kind} {_fmt(z)}"
    if dem and sup:
        return (f"between demand {_fmt(dem[0])} "
                f"({(price - _hi(dem[0])) / price * 100:.1f}% below) and supply "
                f"{_fmt(sup[0])} ({(_lo(sup[0]) - price) / price * 100:.1f}% above)")
    if sup:
        return f"below supply {_fmt(sup[0])}, no demand within range"
    if dem:
        return f"above demand {_fmt(dem[0])}, no supply within range"
    return "no zone within range"


def _bull(price, sup) -> str:
    if not sup:
        return "no supply within range — nothing to reclaim"
    first = sup[0]
    tgt = f" → {_fmt(sup[1])}" if len(sup) > 1 else ""
    return f"close above {_fmt(first)}{tgt}"


def _bear(price, dem) -> str:
    if not dem:
        return "no demand within range — nothing left to lose"
    first = dem[0]
    tgt = f" → {_fmt(dem[1])}" if len(dem) > 1 else ""
    return f"close below {_fmt(first)}{tgt}"


def _retest(price, dem, sup) -> str:
    if sup:
        return f"a break above {_fmt(sup[0])} likely retests it as support"
    if dem:
        return f"a break below {_fmt(dem[0])} likely retests it from underneath"
    return "—"


# ── emit board.js ───────────────────────────────────────────────────────────

HEADER = """// ── Structure board — GENERATED, do not hand-edit ───────────────────────────
// Written by tools/structure.py (see .github/workflows/structure-board.yml).
// Hand edits are overwritten on the next run; change the extractor instead.
//
// A SEPARATE element from the STOCKS cards in data.js. The same ticker may
// appear in both, and they are allowed to disagree: a card carries a traded
// plan (entry, stop, rank), this board carries structure (where demand and
// supply sit, what triggers which way). Neither overwrites the other.
//
// Every field is computed from one OHLC source per the written methodology:
// ATR(14) Wilder, confirmed swings (2 candles each side), displacement-formed
// zones with wick/body boundaries, revisit-and-acceptance strength grading, and
// the bias score  Score = 2W + D + 0.5H + 0.5R + 0.5M + 0.5O + Z.
// `parts` carries each term so any bias on screen can be checked against its
// own inputs.
"""


def emit_board(rows: list[dict], updated: str, carry: dict | None = None) -> str:
    """`carry` is the board being replaced. Its hand-written prose — the board
    note and the actionable ranking — is NOT derivable from OHLCV, so it is
    preserved across regenerations instead of being silently dropped."""
    board = {
        'updated': updated,
        'generatedBy': 'tools/structure.py',
        'method': 'Score = 2W + D + 0.5H + 0.5R + 0.5M + 0.5O + Z '
                  '(W weekly, D daily, H 4H structure; R RSI vs 50; '
                  'M MACD histogram slope; O OBV slope; '
                  'Z inside confirmed demand +1 / supply −1)',
        'rows': [{k: v for k, v in r.items() if not k.startswith('_')}
                 for r in sorted(rows, key=lambda r: (r.get('score') is None,
                                                      r.get('score') or 0))],
    }
    for k in ('note', 'ranking', 'rankingNote'):
        if carry and carry.get(k):
            board[k] = carry[k]
    body = json.dumps(board, indent=2, ensure_ascii=False)
    return f"{HEADER}const BOARD = {body};\n"


# ── comparison against the board being replaced ─────────────────────────────
# Answers one question, with numbers: where do the computed figures agree with
# the board they replace, and where do they not? Some columns MUST agree and a
# gap is a bug; others are expected to differ, because they were discretionary
# before and are rule-derived now. The report says which is which rather than
# printing one undifferentiated diff.

# Tolerance for the columns that are pure formulas on the same OHLC. ATR(14)
# Wilder off the same closes is deterministic — anything past this is a real
# disagreement (usually a different price basis), not rounding.
ALIGN_TOL = 0.5     # percent


def _dump_existing() -> dict:
    try:
        out = subprocess.run(["node", str(Path(__file__).parent / "dump_structure.js")],
                             capture_output=True, text=True, check=True)
        return json.loads(out.stdout) or {}
    except Exception as e:                           # noqa: BLE001 — reported
        print(f"could not read the current board ({e})", file=sys.stderr)
        return {}


def load_existing() -> dict:
    """Rows of the board.js on disk, keyed by ticker, before it is overwritten."""
    return {r["ticker"]: r for r in _dump_existing().get("rows", [])}


def load_existing_meta() -> dict:
    """The board's non-derivable prose — note and ranking — so a regeneration
    keeps it. Nothing here comes out of OHLCV."""
    return _dump_existing()


def _drift(new, old) -> float | None:
    if new is None or old is None or not old:
        return None
    return (new - old) / abs(old) * 100


def _dates_matching(hist, value, tol: float = 0.02) -> str:
    """Which recent session had this ATR? Tolerance is relative, so it matches
    a figure quoted to two decimals."""
    if not hist or value in (None, 0):
        return ""
    hits = [d for d, v in hist if abs(v - value) / abs(value) <= tol]
    return ", ".join(hits[-3:])


def _zone_overlap(new_zones, old_zones) -> tuple[int, int]:
    """How many of the OLD zones a computed zone actually overlaps. Zone
    boundaries are drawn differently by eye and by rule, so 'did we find the
    same level at all' is the meaningful question, not 'are the edges equal'."""
    hit = 0
    for o in old_zones or []:
        lo, hi = o.get("lo"), o.get("hi")
        if lo is None or hi is None:
            continue
        if any(n["lo"] <= hi and n["hi"] >= lo for n in new_zones or []):
            hit += 1
    return hit, len([o for o in (old_zones or []) if o.get("lo") is not None])


def compare(rows: list[dict], old: dict) -> list[str]:
    """A per-ticker drift report, split into must-agree and may-differ."""
    if not old:
        return ["compare: no previous board to diff against."]
    out = ["", "=" * 78,
           "COMPARISON vs the board being replaced",
           "=" * 78,
           f"MUST AGREE (same formula, same OHLC) — flagged past {ALIGN_TOL}%:",
           "  price, ATR(14), ATR%",
           "MAY DIFFER BY DESIGN (was discretionary, is now rule-derived):",
           "  zone boundaries, zone strength, bias, 4H structure",
           ""]
    flagged = 0
    for r in rows:
        o = old.get(r["ticker"])
        if not o:
            out.append(f"{r['ticker']:6} new row — nothing to compare")
            continue
        bits, bad = [], False
        for field, label in (("price", "price"), ("atr", "ATR"), ("atrPct", "ATR%")):
            d = _drift(r.get(field), o.get(field))
            if d is None:
                bits.append(f"{label} n/a")
                continue
            mark = "  ⚠" if abs(d) > ALIGN_TOL else ""
            bad = bad or abs(d) > ALIGN_TOL
            bits.append(f"{label} {r.get(field)} vs {o.get(field)} ({d:+.2f}%){mark}")
        flagged += bad
        out.append(f"{r['ticker']:6} {' · '.join(bits)}")

        # A drifted ATR is usually a STALE comparison value, not a wrong
        # formula — the old board was written on some earlier session. Say so
        # with evidence: find the date whose ATR actually equals the old figure.
        d_atr = _drift(r.get("atr"), o.get("atr"))
        if d_atr is not None and abs(d_atr) > ALIGN_TOL:
            when = _dates_matching(r.get("_atrHist"), o.get("atr"))
            if when:
                out.append(f"       ATR {o['atr']} was this ticker's ATR on "
                           f"{when} — the old figure is a different session, "
                           f"not a different formula")
            else:
                hist = r.get('_atrHist') or []
                vals = [v for _, v in hist]
                if vals and not (min(vals) <= o['atr'] <= max(vals)):
                    out.append(
                        f"       ATR {o['atr']} is OUTSIDE this ticker's whole "
                        f"{len(hist)}-session range ({min(vals)}–{max(vals)}) — "
                        f"vintage is ruled out, so the old figure is on a "
                        f"different basis (period, smoothing or session hours)")
                else:
                    out.append(
                        f"       ATR {o['atr']} is inside the {len(hist)}-session "
                        f"range ({min(vals)}–{max(vals)}) but matches no single "
                        f"session — likely a different smoothing, not a stale date")

        dh, dn = _zone_overlap(r.get("demand"), o.get("demand"))
        sh, sn = _zone_overlap(r.get("supply"), o.get("supply"))
        out.append(f"       zones matched: demand {dh}/{dn} · supply {sh}/{sn}"
                   f"   (computed {len(r.get('demand') or [])} demand, "
                   f"{len(r.get('supply') or [])} supply)")

        # Bias: direction only. The old board's bias is prose and was
        # discretionary — the honest check is "does it point the same way",
        # not string equality.
        old_bias = str(o.get("bias") or "").lower()
        want = ("bear" if "bear" in old_bias else
                "bull" if "bull" in old_bias else
                "neutral" if "neutral" in old_bias else "?")
        got = ("bear" if "bear" in r["bias"] else
               "bull" if "bull" in r["bias"] else "neutral")
        agree = "same direction" if want == got else \
                "no prior score" if o.get("score") is None and want == "?" else \
                f"DIFFERS — was {want}"
        out.append(f"       bias: {r['bias']} (score {r['score']:+.2f}) · {agree}")
    out.append("")
    out.append(f"{flagged} ticker(s) with a must-agree column past {ALIGN_TOL}%.")
    return out


def board_tickers() -> list[str]:
    """Tickers already on the generated board, so a re-run keeps its roster
    without needing them passed again. Falls back to the card board."""
    if BOARD_JS.exists():
        found = re.findall(r'"ticker":\s*"([A-Z.^-]+)"', BOARD_JS.read_text('utf-8'))
        if found:
            return sorted(dict.fromkeys(found))
        found = re.findall(r"ticker:\s*'([A-Z.^-]+)'", BOARD_JS.read_text('utf-8'))
        if found:
            return sorted(dict.fromkeys(found))
    return sorted(load_board().get('stocks', {}))


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("tickers", nargs="*", help="blank = the board's current roster")
    ap.add_argument("--out", default=str(BOARD_JS))
    ap.add_argument("--report", default=None, help="also write the audit trail here")
    ap.add_argument("--no-intraday", action="store_true",
                    help="skip the 60m fetch; the H term scores 0")
    ap.add_argument("--flow", default=None,
                    help="flow.json from tools/flow.py — embedded per row, never scored")
    ap.add_argument("--compare", action="store_true",
                    help="diff the fresh numbers against the board being replaced")
    args = ap.parse_args()

    # "AKAM, LITE" is a natural thing to type into a workflow input, and the
    # shell splits it on whitespace alone — leaving the ticker "AKAM," to 404.
    want = [t for t in re.split(r"[,\s]+", " ".join(args.tickers).upper()) if t] \
        or board_tickers()
    # Always read the board being replaced: --compare diffs against it, and the
    # merge below needs it regardless.
    previous = load_existing()
    prev_meta = load_existing_meta()

    flows = {}
    if args.flow:
        fp = Path(args.flow)
        if fp.exists():
            flows = (json.loads(fp.read_text('utf-8')) or {}).get('tickers', {})
            print(f"flow: {len(flows)} ticker(s) from {fp}", file=sys.stderr)
        else:
            print(f"flow: {fp} missing — board ships without flow columns",
                  file=sys.stderr)

    rows, log, failed = [], [], []
    for t in want:
        try:
            r = read_ticker(t, want_intraday=not args.no_intraday,
                            flow=flows.get(t))
        except Exception as e:                       # noqa: BLE001 — reported
            failed.append(f"{t}: {e}")
            print(f"  {t}: FAILED — {e}", file=sys.stderr)
            continue
        rows.append(r)
        p = r['parts']
        log.append(
            f"{t:6} {r['bias']:<17} score {r['score']:+5.2f}  "
            f"[W{p['W']:+d} D{p['D']:+d} H{p['H']:+d} R{p['R']:+d} "
            f"M{p['M']:+d} O{p['O']:+d} Z{p['Z']:+d}]  "
            f"ATR {r['atr']} ({r['atrPct']}%)  {r['structure']['h4Note']}\n"
            f"       frames: monthly {r['structure']['m'] or 'n/a'} (context, "
            f"unscored) · weekly {r['structure']['w']} · daily "
            f"{r['structure']['d']} · 4H {r['structure']['h4']}\n"
            f"         weekly via {r['structure']['why']['w']}\n"
            f"         daily  via {r['structure']['why']['d']}\n"
            f"       demand {', '.join(_fmt(z) + ' ' + z['strength'] for z in r['demand']) or '—'}\n"
            f"       supply {', '.join(_fmt(z) + ' ' + z['strength'] for z in r['supply']) or '—'}\n"
            f"       {r['position']}")
        print(f"  {t}: {r['bias']} ({r['score']:+.2f})", file=sys.stderr)

    if not rows:
        print("no ticker produced a row — refusing to write an empty board",
              file=sys.stderr)
        return 1

    # Rows for tickers this run did NOT compute are carried over untouched.
    # Running `structure.py AKAM LITE` used to emit a two-row board and delete
    # the other seven — a partial run is an update, not a new board.
    computed = {r['ticker'] for r in rows}
    carried = [r for t, r in previous.items() if t not in computed]
    if carried:
        print(f"carrying {len(carried)} row(s) not in this run: "
              f"{', '.join(sorted(r['ticker'] for r in carried))}", file=sys.stderr)
    all_rows = rows + carried

    updated = max(r['date'] for r in rows)
    Path(args.out).write_text(emit_board(all_rows, updated, prev_meta),
                              encoding="utf-8")
    print(f"wrote {args.out} — {len(all_rows)} row(s) "
          f"({len(rows)} recomputed), as of {updated}", file=sys.stderr)

    if args.compare:
        log += compare(rows, previous)
        print("\n".join(compare(rows, previous)), file=sys.stderr)

    if args.report:
        text = "\n".join(log)
        if failed:
            text += "\n\nFAILED\n" + "\n".join("  " + f for f in failed)
        Path(args.report).write_text(text + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
