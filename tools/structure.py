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


def classify_structure(sw: list[Swing]) -> str:
    """bullish = higher high AND higher low; bearish = lower high AND lower low;
    anything mixed is neutral. Two bars of micro-sequence are not a trend, which
    is handled by only ever looking at CONFIRMED swings."""
    highs = [s.price for s in sw if s.kind == 'high'][-2:]
    lows = [s.price for s in sw if s.kind == 'low'][-2:]
    if len(highs) < 2 or len(lows) < 2:
        return 'neutral'
    hh, hl = highs[-1] > highs[-2], lows[-1] > lows[-2]
    lh, ll = highs[-1] < highs[-2], lows[-1] < lows[-2]
    if hh and hl:
        return 'bullish'
    if lh and ll:
        return 'bearish'
    return 'neutral'


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
    strength: str = 'fresh'
    extra: dict = field(default_factory=dict)

    @property
    def mid(self) -> float:
        return (self.lo + self.hi) / 2


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


def find_zones(bars: list[dict], atr_series: list[float | None]) -> list[Zone]:
    """Zones are formed by DISPLACEMENT that breaks structure, per the rule set:
    an up-move breaking a prior swing high leaves demand behind it; a down-move
    breaking a prior swing low leaves supply above it."""
    sw = swings([b["h"] for b in bars], [b["l"] for b in bars])
    highs = [s for s in sw if s.kind == 'high']
    lows = [s for s in sw if s.kind == 'low']
    out: list[Zone] = []

    for i in range(1, len(bars)):
        a = atr_series[i] if i < len(atr_series) else None
        if not a:
            continue
        b = bars[i]
        leg = b["c"] - b["o"]
        if abs(leg) < DISPLACE_ATR * a:
            continue                                   # not a displacement
        if leg > 0:
            prior = [s for s in highs if s.i < i]
            if not prior or b["c"] <= prior[-1].price:
                continue                               # broke no swing high
            lo_i, hi_i = _base_span(bars, i - 1, 'demand')
            base = bars[lo_i:hi_i + 1] or [bars[i - 1]]
            out.append(Zone('demand',
                            lo=min(x["l"] for x in base),               # wick
                            hi=max(max(x["o"], x["c"]) for x in base),  # body
                            i=hi_i, date=bars[hi_i]["date"], atr_at=a))
        else:
            prior = [s for s in lows if s.i < i]
            if not prior or b["c"] >= prior[-1].price:
                continue                               # broke no swing low
            lo_i, hi_i = _base_span(bars, i - 1, 'supply')
            base = bars[lo_i:hi_i + 1] or [bars[i - 1]]
            out.append(Zone('supply',
                            lo=min(min(x["o"], x["c"]) for x in base),  # body
                            hi=max(x["h"] for x in base),               # wick
                            i=hi_i, date=bars[hi_i]["date"], atr_at=a))

    # A base wider than the cap is a range, not a zone — drop it rather than
    # quoting a level nobody can trade against.
    out = [z for z in out if z.hi - z.lo <= MAX_ZONE_ATR * z.atr_at]
    for z in out:
        _score_zone(z, bars)
    # Merge zones that describe the same level — the same shelf rediscovered is
    # one zone with more history, not two.
    return _merge(out)


def _score_zone(z: Zone, bars: list[dict]) -> None:
    """fresh / tested / weak, by revisits and — the rule that matters — whether
    price CLOSED inside (acceptance) or only wicked in (rejection)."""
    pad = (z.hi - z.lo) * REVISIT_PAD
    inside = False
    for b in bars[z.i + 2:]:
        touching = b["l"] <= z.hi + pad and b["h"] >= z.lo - pad
        if touching and not inside:
            z.touches += 1
            inside = True
        elif not touching:
            inside = False
        if touching and z.lo <= b["c"] <= z.hi:
            z.closes_in += 1
    if z.touches >= 3 or z.closes_in >= 2:
        z.strength = 'weak'
    elif z.touches >= 1:
        z.strength = 'tested'
    else:
        z.strength = 'fresh'


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
            if z.i > p.i:
                p.i, p.date = z.i, z.date
            _restrength(p)
        else:
            out.append(z)
    return out


def _restrength(z: Zone) -> None:
    z.strength = 'weak' if (z.touches >= 3 or z.closes_in >= 2) else \
                 'tested' if z.touches >= 1 else 'fresh'


def nearest(zones: list[Zone], price: float, kind: str, n: int = 3) -> list[Zone]:
    """The n nearest zones of a kind on the correct side of price: demand below,
    supply above. A 'demand' zone above price is resistance, not demand."""
    if kind == 'demand':
        cand = [z for z in zones if z.kind == 'demand' and z.hi <= price * 1.01]
        cand.sort(key=lambda z: price - z.hi)
    else:
        cand = [z for z in zones if z.kind == 'supply' and z.lo >= price * 0.99]
        cand.sort(key=lambda z: z.lo - price)
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

def read_ticker(ticker: str, want_intraday: bool = True,
                flow: dict | None = None) -> dict:
    daily = fetch_yahoo(ticker)
    weekly = ind.resample(daily, 'W')

    close = [b["c"] for b in daily]
    high = [b["h"] for b in daily]
    low = [b["l"] for b in daily]
    vol = [b["v"] for b in daily]
    price = close[-1]

    atr_series = ind.atr(high, low, close)
    a = atr_series[-1]
    rsi_d = ind.rsi(close)[-1]
    _, _, hist_d = ind.macd(close)

    d_struct = classify_structure(swings(high, low))
    w_struct = classify_structure(swings([b["h"] for b in weekly],
                                         [b["l"] for b in weekly]))

    h4_struct, h4_note = 'neutral', 'no intraday data'
    if want_intraday:
        try:
            h4 = resample_4h(fetch_yahoo_intraday(ticker))
            h4_struct = classify_structure(swings([b["h"] for b in h4],
                                                  [b["l"] for b in h4]))
            h4_note = f"{len(h4)} 4H bars"
        except Exception as e:                       # noqa: BLE001 — reported
            h4_note = f"unavailable ({e})"

    zones = find_zones(daily, atr_series)
    dem = nearest(zones, price, 'demand')
    sup = nearest(zones, price, 'supply')

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
        'structure': {'w': w_struct, 'd': d_struct, 'h4': h4_struct,
                      'h4Note': h4_note},
        'ind': {
            'rsi': round(rsi_d, 2) if rsi_d is not None else None,
            'macdHist': round(hist_d[-1], 3) if hist_d[-1] is not None else None,
            'obvSlope': parts['O'],
        },
        'parts': parts,
        'score': round(score, 2),
        'bias': bias_label(score),
        'demand': [_zone_json(z) for z in dem],
        'supply': [_zone_json(z) for z in sup],
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
            'since': z.date.isoformat()}


def _fmt(z: Zone | dict) -> str:
    lo, hi = (z['lo'], z['hi']) if isinstance(z, dict) else (z.lo, z.hi)
    return f"${lo:,.2f}–{hi:,.2f}"


def _position(price, dem, sup, zones) -> str:
    for z in zones:
        if z.lo <= price <= z.hi:
            return f"inside {z.strength} {z.kind} {_fmt(z)}"
    if dem and sup:
        return (f"between demand {_fmt(dem[0])} "
                f"({(price - dem[0].hi) / price * 100:.1f}% below) and supply "
                f"{_fmt(sup[0])} ({(sup[0].lo - price) / price * 100:.1f}% above)")
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


def emit_board(rows: list[dict], updated: str) -> str:
    board = {
        'updated': updated,
        'generatedBy': 'tools/structure.py',
        'method': 'Score = 2W + D + 0.5H + 0.5R + 0.5M + 0.5O + Z '
                  '(W weekly, D daily, H 4H structure; R RSI vs 50; '
                  'M MACD histogram slope; O OBV slope; '
                  'Z inside confirmed demand +1 / supply −1)',
        'rows': sorted(rows, key=lambda r: r['score']),
    }
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


def load_existing() -> dict:
    """The board.js on disk, before it is overwritten."""
    try:
        out = subprocess.run(["node", str(Path(__file__).parent / "dump_structure.js")],
                             capture_output=True, text=True, check=True)
        return {r["ticker"]: r for r in (json.loads(out.stdout) or {}).get("rows", [])}
    except Exception as e:                           # noqa: BLE001 — reported
        print(f"compare: could not read the current board ({e})", file=sys.stderr)
        return {}


def _drift(new, old) -> float | None:
    if new is None or old is None or not old:
        return None
    return (new - old) / abs(old) * 100


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

    want = [t.upper() for t in args.tickers] or board_tickers()
    previous = load_existing() if args.compare else {}

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
            f"       demand {', '.join(_fmt(z) + ' ' + z['strength'] for z in r['demand']) or '—'}\n"
            f"       supply {', '.join(_fmt(z) + ' ' + z['strength'] for z in r['supply']) or '—'}\n"
            f"       {r['position']}")
        print(f"  {t}: {r['bias']} ({r['score']:+.2f})", file=sys.stderr)

    if not rows:
        print("no ticker produced a row — refusing to write an empty board",
              file=sys.stderr)
        return 1

    updated = max(r['date'] for r in rows)
    Path(args.out).write_text(emit_board(rows, updated), encoding="utf-8")
    print(f"wrote {args.out} — {len(rows)} row(s), as of {updated}", file=sys.stderr)

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
