#!/usr/bin/env python3
"""Refresh the board from market data instead of from screenshots.

    python3 tools/refresh.py                 # every ticker in data.js
    python3 tools/refresh.py MU SNDK WDC     # just these
    python3 tools/refresh.py --audit-only    # skip the fetch, check the cards
    python3 tools/refresh.py --days 5        # show 5 sessions, not 3

What it does
  1. reads the board (node tools/dump.js data.js MARKET STOCKS ARTICLES)
  2. pulls daily OHLCV per ticker and resamples to weekly / monthly
  3. prints the same extraction block that used to be read off screenshots
  4. audits every card's `lead` against the fresh close — mechanically

What it does NOT do, on purpose
  It never edits data.js and it never decides anything. Whether SNDK flips
  sides, whether a zone is mis-placed, what a cohort split means — that is
  judgement, and it stays with a human. This tool removes the transcription
  and the arithmetic, which is where the errors actually come from.

Data source
  Default is Yahoo's chart endpoint — the same data the site's own charts
  render, so values line up with them. `--source stooq` and `--source yfinance`
  are fallbacks. All are unofficial free feeds: fine for a personal board, swap
  in a keyed provider (Tiingo / Polygon / Alpaca) to run unattended.
"""

from __future__ import annotations

import argparse
import csv
import datetime as dt
import io
import json
import re
import subprocess
import sys
import urllib.parse
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from indicators import Frame, atr, read_frame, resample  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
UA = {"User-Agent": "Mozilla/5.0 (board-refresh)"}

# Tickers whose Stooq symbol is not <ticker>.us
STOOQ_OVERRIDES = {"DRAM": "dram.us"}

# The regime layer: indices and vol gauges that drive MARKET in data.js but are
# not tradeable cards, so they never appear in STOCKS. Fetched on a full run and
# reported ahead of the names. Keys are what you type; values are Yahoo symbols
# (^-prefixed ones are indices and are Yahoo-only — Stooq does not carry them).
MARKET_SYMBOLS = {
    "QQQ": "QQQ",     # Nasdaq-100 ETF — the index the board actually references
    "SMH": "SMH",     # semis ETF — the board's barometer and its long gate
    "NDX": "^NDX",    # Nasdaq-100 index itself
    "VIX": "^VIX",    # broad-market fear
    "VXN": "^VXN",    # Nasdaq-specific fear
}
INDEX_ONLY = {k for k, v in MARKET_SYMBOLS.items() if v.startswith("^")}

# How far a card's price may drift from the real close before it is worth
# reporting. Below these, differences are vendor noise (EMA seeding, after-hours
# in the current bar) and flagging them just buries the findings that matter.
TOL_INDEX = 0.5   # % — indices move less, so a smaller gap is meaningful
TOL_STOCK = 1.0   # %


# ── board ───────────────────────────────────────────────────────────────────

def parse_tickers(raw: list[str]) -> list[str]:
    """Accept whatever separators a human actually types.

    "MU SNDK", "MU, SNDK", "MU,SNDK" and "mu; sndk" all mean the same thing.
    The shell has usually already split on spaces, so each element may still
    carry a trailing comma — strip punctuation rather than trusting the split.
    """
    out: list[str] = []
    for chunk in re.split(r"[,;|\s]+", " ".join(raw)):
        sym = chunk.strip().strip(".,;:|").upper()
        if sym and sym not in out:
            out.append(sym)
    return out


def load_board() -> dict:
    out = subprocess.run(
        ["node", str(ROOT / "tools" / "dump.js"),
         "data.js", "MARKET", "STOCKS", "ARTICLES"],
        capture_output=True, text=True, check=True,
    )
    return json.loads(out.stdout)


# ── fetch ───────────────────────────────────────────────────────────────────

def fetch_yahoo(ticker: str, rng: str = "10y") -> list[dict]:
    """Yahoo's chart endpoint — the same data the site's own charts render, so
    the numbers here line up with what you see there. Uses raw `close`, not
    `adjclose`: the chart quotes unadjusted prices and so do the cards.

    `rng` defaults to 10y because THIS bot needs it: the cards quote a 200-week
    EMA, which needs ~500 weekly bars to seed honestly. A caller whose deepest
    frame is shallower should ask for less — tools/structure.py pulls 4y, sized
    to its own monthly lookback. Never pass range=max: Yahoo silently DOWNGRADES
    the interval when max is paired with interval=1d, returning coarse bars with
    a 200 response rather than an error, which collapses the daily/weekly/monthly
    frames into each other and yields nonsense indicators.
    """
    sym = urllib.parse.quote(MARKET_SYMBOLS.get(ticker, ticker))
    url = (f"https://query1.finance.yahoo.com/v8/finance/chart/{sym}"
           f"?range={rng}&interval=1d")
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        payload = json.loads(r.read().decode())

    chart = payload.get("chart") or {}
    if chart.get("error"):
        raise RuntimeError(f"{ticker}: Yahoo said {chart['error']}")
    results = chart.get("result") or []
    if not results:
        raise RuntimeError(f"{ticker}: Yahoo returned no result block")

    res = results[0]
    ts = res.get("timestamp") or []
    q = ((res.get("indicators") or {}).get("quote") or [{}])[0]
    o, h, lo, c, v = (q.get(k) or [] for k in ("open", "high", "low", "close", "volume"))

    bars = []
    for i, t in enumerate(ts):
        row = (o[i] if i < len(o) else None, h[i] if i < len(h) else None,
               lo[i] if i < len(lo) else None, c[i] if i < len(c) else None)
        if any(x is None for x in row):
            continue                      # holiday / halted bar
        bars.append({
            "date": dt.datetime.fromtimestamp(t, dt.timezone.utc).date(),
            "o": float(row[0]), "h": float(row[1]),
            "l": float(row[2]), "c": float(row[3]),
            "v": float(v[i] or 0) if i < len(v) else 0.0,
        })
    if not bars:
        raise RuntimeError(f"{ticker}: Yahoo returned no usable bars")
    return bars


def fetch_stooq(ticker: str) -> list[dict]:
    sym = STOOQ_OVERRIDES.get(ticker, f"{ticker.lower()}.us")
    url = f"https://stooq.com/q/d/l/?s={sym}&i=d"
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        text = r.read().decode()
    if not text.lstrip().lower().startswith("date"):
        raise RuntimeError(f"{ticker}: unexpected response from Stooq — {text[:80]!r}")
    bars = []
    for row in csv.DictReader(io.StringIO(text)):
        try:
            bars.append({
                "date": dt.date.fromisoformat(row["Date"]),
                "o": float(row["Open"]), "h": float(row["High"]),
                "l": float(row["Low"]), "c": float(row["Close"]),
                "v": float(row["Volume"] or 0),
            })
        except (ValueError, KeyError):
            continue
    if not bars:
        raise RuntimeError(f"{ticker}: no rows parsed")
    return bars


def fetch_yfinance(ticker: str) -> list[dict]:
    import yfinance as yf  # noqa: PLC0415
    df = yf.Ticker(ticker).history(period="5y", interval="1d", auto_adjust=False)
    if df.empty:
        raise RuntimeError(f"{ticker}: yfinance returned nothing")
    return [{
        "date": idx.date(),
        "o": float(r.Open), "h": float(r.High), "l": float(r.Low),
        "c": float(r.Close), "v": float(r.Volume or 0),
    } for idx, r in zip(df.index, df.itertuples())]


FETCHERS = {"yahoo": fetch_yahoo, "stooq": fetch_stooq, "yfinance": fetch_yfinance}


def assert_daily(ticker: str, bars: list[dict]) -> None:
    """Refuse a series that is not actually daily.

    Yahoo answers 200 with COARSER bars when a range/interval pair is out of
    bounds, instead of erroring. That silently produced identical daily, weekly
    and monthly frames — output that looked plausible and was entirely wrong.
    Garbage must fail loudly, so the spacing is checked rather than trusted.
    """
    if len(bars) < 60:
        raise RuntimeError(
            f"{ticker}: only {len(bars)} bars — too few to compute on. "
            f"Either a very recent listing or the feed returned coarse data.")
    gaps = sorted((bars[i]["date"] - bars[i - 1]["date"]).days
                  for i in range(1, len(bars)))
    median = gaps[len(gaps) // 2]
    if median > 5:                       # daily bars: 1 midweek, 3 over a weekend
        raise RuntimeError(
            f"{ticker}: bars are {median} days apart — this is NOT daily data. "
            f"The feed downgraded the interval; refusing to compute on it.")


def frames(bars: list[dict]) -> list[Frame]:
    return [
        read_frame("DAILY", bars),
        read_frame("WEEKLY", resample(bars, "W")),
        read_frame("MONTHLY", resample(bars, "M")),
    ]


def recent(bars: list[dict], n: int) -> str:
    """The last n daily sessions, plus the swing they describe.

    One close is a snapshot; three tell you whether Friday broke a rally or
    ended one. This also makes the 50% retracement COMPUTED rather than derived
    — the Monday decider on every card had to be reconstructed from prior
    percentage gains before this existed.
    """
    win = bars[-max(n, 2):]
    out = [f"{'RECENT':<8} last {len(win)} sessions"]
    for i, b in enumerate(win):
        prev = bars[bars.index(b) - 1]["c"] if bars.index(b) > 0 else b["c"]
        chg = (b["c"] - prev) / prev * 100 if prev else 0.0
        out.append(f"{'':<8} {b['date']}  O {b['o']:>10,.2f} H {b['h']:>10,.2f} "
                   f"L {b['l']:>10,.2f} C {b['c']:>10,.2f}  {chg:>+7.2f}%")

    # Swing: lowest CLOSE in the window, then the highest HIGH at or after it.
    lo_i = min(range(len(win)), key=lambda i: win[i]["c"])
    hi_i = max(range(lo_i, len(win)), key=lambda i: win[i]["h"])
    lo, hi, last = win[lo_i]["c"], win[hi_i]["h"], win[-1]["c"]
    if hi > lo:
        half = lo + (hi - lo) / 2
        run = (hi - lo) / lo * 100
        gave = (hi - last) / (hi - lo) * 100
        d = (last - half) / half * 100
        where = ("BELOW it" if d < -0.3 else "ON it" if abs(d) <= 1.5
                 else f"{d:+.1f}% above it")
        out.append(f"{'':<8} swing {lo:,.2f} → {hi:,.2f} (+{run:.1f}%) · gave back "
                   f"{gave:.0f}% · 50% line {half:,.2f} — close is {where}")
    return "\n".join(out)


def levels(monthly: list[dict]) -> str:
    """What the monthly frame is actually FOR: structural highs and lows.

    The board trades the daily and confirms trend on the weekly. The monthly
    contributes support and resistance — the levels price has to deal with —
    not signals. Its oscillators are background, so they are not surfaced here.
    """
    cur = monthly[-1]
    prev = monthly[-2] if len(monthly) > 1 else None
    win = monthly[-12:]
    parts = [f"this month H {cur['h']:,.2f} / L {cur['l']:,.2f}"]
    if prev:
        parts.append(f"prior month H {prev['h']:,.2f} / L {prev['l']:,.2f}")
    parts.append(f"12-mo H {max(b['h'] for b in win):,.2f} "
                 f"/ L {min(b['l'] for b in win):,.2f}")
    return f"{'LEVELS':<8} " + " · ".join(parts)


def cascade(fs: list[Frame]) -> str:
    """How far a momentum rollover has climbed the timeframes.

    Fast frames turn first and slow frames confirm later, so the useful
    question is not 'is momentum negative' but 'which frames have gone yet'.
    Three stages per frame, in order of severity:
        curling   histogram still positive but contracting — losing thrust
        crossed   histogram negative: MACD under its signal, both may be > 0
        rolled    histogram negative AND widening — under way, not starting
    """
    def stage(f: Frame) -> str:
        if f.macd_hist is None:
            return "n/a"
        if f.hist_sign == "positive":
            return "curling" if f.hist_dir == "contracting" else "rising"
        return "rolled" if f.hist_dir == "expanding" else "crossed"

    stages = [stage(f) for f in fs]
    parts = " → ".join(f"{f.label.lower()} {s}" for f, s in zip(fs, stages))

    out = [f"{'CASCADE':<8} {parts}"]

    # How solid is the WEEKLY cross? That is the trend-confirmation layer, and a
    # fresh shallow cross is the kind that gets negated by one good bounce.
    # Depth = |histogram| as a share of |MACD|: a few percent is a graze.
    w = fs[1]
    if w.macd_hist is not None and w.macd and w.hist_sign == "negative":
        depth = abs(w.macd_hist) / abs(w.macd) * 100
        grade = ("FRAGILE" if depth < 10 or w.hist_run <= 2
                 else "holding" if depth < 25 else "ESTABLISHED")
        need = abs(w.macd_sig - w.macd) if w.macd_sig is not None else 0
        out.append(f"{'':<8} weekly cross {grade}: {w.hist_run} bar(s) deep, "
                   f"hist {abs(w.macd_hist):,.2f} = {depth:.1f}% of MACD · "
                   f"MACD must regain {need:,.2f} pts to un-cross")

    m = fs[2]
    if m.macd is not None and m.macd_sig is not None and m.hist_sign == "positive":
        out.append(f"{'':<8} monthly is {abs(m.macd - m.macd_sig):,.0f} pts from "
                   f"crossing — months away, not weeks")
    return "\n".join(out)


# ── audit ───────────────────────────────────────────────────────────────────

def nums(s) -> list[float]:
    """Mirror of planNums() in script.js — every number in the string."""
    return [float(x) for x in re.findall(r"\d+(?:\.\d+)?", str(s or "").replace(",", ""))]


VENUES = {"NASDAQ", "NYSE", "NYSE ARCA", "CBOE", "AMEX", "BATS"}


def audit_fields(stock: dict) -> list[str]:
    """Card-shape checks that do not need a `lead` — every card gets these."""
    out, sym = [], stock["symbol"]

    # `exchange` renders as the small label beside the ticker. Pasting a close
    # narrative into it (easy to do: it is the field right before `change`)
    # blows the tile apart AND leaves the real `change` a session stale.
    ex = str(stock.get("exchange") or "")
    if ex.upper() not in VENUES:
        out.append(f"{sym}: exchange '{ex[:60]}' is not a venue — the close line "
                   f"belongs in `change`")

    # `date` is the tile's label AND the gallery's sort key.
    d = str(stock.get("date") or "")
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", d):
        out.append(f"{sym}: date '{d}' is not ISO YYYY-MM-DD")
    elif d > dt.date.today().isoformat():
        out.append(f"{sym}: date {d} is in the future")

    # ACCRETION. `signal` is the tile's CURRENT read — the data model calls it a
    # one-line thesis — and a refresh REPLACES it; git history is the archive.
    # Nothing said so, and by 2026-08-06 the 36 signals had grown to 349k
    # characters (76% of data.js, SNDK alone 17k) because each refresh PREPENDED
    # its session narrative instead of replacing the last one — the exact
    # failure CLAUDE.md documents for MARKET's note, twenty times the size. A
    # second session header in the field is the fingerprint of that mistake:
    # one dated close (plus an AH/intraday lead-in from the same session) is a
    # current read, two dated closes is a journal.
    sig = str(stock.get("signal") or "")
    dated = re.findall(r"📅 CLOSE \d{2}/\d{2}", sig)
    if len(dated) >= 2:
        out.append(f"{sym}: signal carries {len(dated)} dated session blocks "
                   f"({len(sig):,} chars) — it is the CURRENT read; a refresh "
                   f"REPLACES it, and the old text lives in git")
    edge = str((stock.get("lead") or {}).get("edge") or "")
    if " || " in edge:
        out.append(f"{sym}: edge carries '||'-separated history "
                   f"({len(edge):,} chars) — same rule: current read only, "
                   f"git keeps the rest")

    story = ROOT / str(stock.get("story") or "")
    if not story.is_file():
        out.append(f"{sym}: story '{stock.get('story')}' does not exist")
        return out

    # The deck's own "you are here" rung is hand-written, so it goes stale the
    # moment the card is refreshed without re-cutting the deck.
    #
    # THE RULE IS FRAME AGREEMENT, not "never intraday". A card written live off
    # fresh charts is legitimately intraday, and its rung should be too. But a
    # card whose `change` reads '📅 CLOSE …' is a close card — its rung has to
    # quote that close (the first number in `price`, never the 🌙 after-hours
    # print), because a mid-session rung carries a % and a set of indicator
    # readings from a moment that has passed.
    card_px = (nums(stock.get("price")) or [None])[0]
    m = re.search(r'\["now",\s*"([^"]+)",\s*"([^"]*)"', story.read_text(encoding="utf-8"))
    if m and card_px:
        deck_px = (nums(m.group(1)) or [None])[0]
        label, close_card = m.group(2), rung_close(stock) is not None
        frame = "close" if close_card else "card price"
        if deck_px and abs(deck_px - card_px) / card_px * 100 > 1.0:
            out.append(f"{sym}: deck ladder still says ТУТ {deck_px:g} while the card's "
                       f"{frame} is {card_px:g} "
                       f"({(deck_px - card_px) / card_px * 100:+.1f}%) "
                       f"— {stock.get('story')} needs the same refresh")
        # Frame mismatch: an intraday clock or a pre-market read on a close card.
        when = re.search(r"\d{1,2}:\d{2}\s*ET|\bPM\b", label) if close_card else None
        if when:
            out.append(f"{sym}: the card is a CLOSE card but its ТУТ rung reads "
                       f"'{when.group(0)}' — re-cut the rung, its % and its indicator "
                       f"readings to the close (`--fix-rungs` does the arithmetic)")
        # Measuring off the after-hours print is a mismatch on any card: `price`
        # leads with the close/last, and the 🌙 number is the aside.
        ah = nums(stock.get("price"))[1:2]
        if deck_px and ah and abs(deck_px - ah[0]) < 0.005 and abs(deck_px - card_px) > 0.005:
            out.append(f"{sym}: deck ladder's ТУТ {deck_px:g} is the after-hours print, "
                       f"not the {frame} {card_px:g}")
    out += audit_ladder(stock, story)
    out += audit_level_chart(stock, story, card_px)
    return out


def audit_level_chart(stock: dict, story: Path, card_px: float | None) -> list[str]:
    """The cover slide's level chart carries its OWN ТУТ marker, and nothing
    compared it to anything.

    The chart is a dated snapshot — its prose narrates one session — so it is
    allowed to sit behind the card. What is not fine is the gap going unmeasured:
    a deck whose ladder says $89.89 and whose chart says $71.77 opens on a thesis
    its own card has overtaken by 20%, and both markers say "ТУТ".

    Reported at the same 1% the ladder rung uses, and never fixed: re-cutting a
    level chart means re-drawing its geometry and re-reading its session, which
    is chart work, not arithmetic.
    """
    sym, out = stock["symbol"], []
    if card_px is None:
        return out
    m = re.search(r'\["y",\s*[\d.]+,\s*"([^"]+)",\s*"(ТУТ[^"]*)"', story.read_text('utf-8'))
    if not m:
        return out
    chart_px = (nums(m.group(1)) or [None])[0]
    if not chart_px:
        return out
    drift = (chart_px - card_px) / card_px * 100
    if abs(drift) > 1.0:
        out.append(f"{sym}: the level chart's ТУТ {chart_px:g} ('{m.group(2)[:34]}') "
                   f"is {drift:+.1f}% off the card's {card_px:g} — the cover slide "
                   f"narrates an older session than the ladder")
    return out


# Rung kinds. `key` is deliberately side-agnostic — it marks a level that
# matters whichever side of price it is on — so only res/sup carry a role claim
# the price can contradict.
ROLE_SIDE = {"res": "above", "sup": "below"}


def rung_bounds(px: str) -> tuple[float, float] | None:
    """A rung's price band. '$86–89' is a band, '$1,251.12' is one price."""
    ns = nums(px)
    return (min(ns), max(ns)) if ns else None


def audit_ladder(stock: dict, story: Path) -> list[str]:
    """The ladder around the ТУТ rung, which nothing else checks.

    `--fix-rungs` re-cuts the ТУТ rung and ONLY that rung, by design — it will
    not guess at an indicator reading it cannot recompute. So every refresh
    moves the "you are here" line and leaves its neighbours where the last
    session put them, and the drift is invisible: a rung whose caption reads
    '+3.6% above' while price is 11% above it looks like ordinary copy.

    Two things are decidable from the deck's own numbers, and neither is a read:

    1. ORDER. The ladder is a top-down price map, so a rung may not sit above
       the one printed before it. Overlapping bands pass — with '$98–102' over
       '$96.38' there is no wrong answer — only a band whose top clears the top
       above it is out of place.
    2. ROLE. A `res` rung entirely BELOW the ТУТ price is not resistance, and a
       `sup` entirely above it is not support. AXON carried 'res $546.51 ·
       ПЕРШИЙ тест, +3.6%' against a $609.49 price it was 11% under; CRWV still
       lists 'res $88 · повна негація шорту' and 'res $81 · 🚨 Стоп' beneath an
       $89.89 price, from the plan before its zone was re-drawn.

    Both are reported, never fixed: flipping a rung's role or re-pricing its
    caption is a read of what the level now means, which is the analyst's.
    """
    sym, out = stock["symbol"], []
    text = story.read_text(encoding="utf-8")
    for block in re.finditer(r"data-rungs='(\[[\s\S]*?\])'", text):
        try:
            rungs = json.loads(block.group(1))
        except (json.JSONDecodeError, TypeError) as e:
            out.append(f"{sym}: ladder JSON in {stock.get('story')} does not parse "
                       f"({e}) — engine.js hydrates this at load, so the slide "
                       f"renders empty")
            continue
        parsed = [(r[0], r[1], rung_bounds(r[1])) for r in rungs
                  if isinstance(r, list) and len(r) >= 2]
        here = next((b for kind, _, b in parsed if kind == "now" and b), None)

        prev_hi, wrong_order = None, []
        for _, px, b in parsed:
            if not b:
                continue
            if prev_hi is not None and b[1] > prev_hi:
                wrong_order.append(px)
            prev_hi = b[1]
        if wrong_order:
            out.append(f"{sym}: ladder is not in top-down price order — "
                       f"{', '.join(wrong_order)} sits above the rung printed "
                       f"before it")

        if not here:
            continue
        for kind, px, b in parsed:
            want = ROLE_SIDE.get(kind)
            if not want or not b:
                continue
            if want == "above" and b[1] < here[0]:
                out.append(f"{sym}: rung {px} is tagged `res` but sits BELOW the "
                           f"ТУТ price {here[0]:g} — it is support now, and its "
                           f"caption was measured from the other side")
            if want == "below" and b[0] > here[1]:
                out.append(f"{sym}: rung {px} is tagged `sup` but sits ABOVE the "
                           f"ТУТ price {here[1]:g} — it is resistance now")
    return out


# ── rung re-cut ─────────────────────────────────────────────────────────────
# The ТУТ rung is the one number a deck duplicates from its card, so it is the
# one that goes stale. Everything a close-frame rung needs is already in the
# card — the close, the day's %, the date, the entry zone — so the arithmetic
# half of the re-cut needs no network and no judgement.
#
# What it deliberately DROPS is the intraday tail: '+13.81% (2:36 ET)',
# 'OBV 83.9M', 'Stoch 93.51', 'шорт ≈ +18.6%'. Those were measured at a moment
# that has passed, and this tool cannot honestly restate them — a full network
# run recomputes the indicators, the analyst restates the read. Every dropped
# label is printed so nothing disappears silently.

CANON_RUNG = "ТУТ · закриття {date} ({pct})"


def rung_close(stock: dict) -> tuple[float, str] | None:
    """The close and the day's % off a '📅 CLOSE $X (+Y%)' card, else None."""
    m = re.search(r"CLOSE \$([\d,]+(?:\.\d+)?)\s*\(([^)]*\d[^)]*)\)",
                  str(stock.get("change") or ""))
    if not m:
        return None
    return float(m.group(1).replace(",", "")), m.group(2).strip()


def recut_rung(stock: dict) -> tuple[str, str] | None:
    """The (price, label) a close-frame card's ТУТ rung should carry."""
    got = rung_close(stock)
    if not got:
        return None
    close, pct = got
    d = str(stock.get("date") or "")
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", d):
        return None
    label = CANON_RUNG.format(date=f"{d[8:10]}.{d[5:7]}", pct=pct)
    zone = nums((stock.get("lead") or {}).get("entry"))
    if zone and min(zone) <= close <= max(zone):
        label += " · усередині зони входу"
    return f"${close:,.2f}", label


def fix_rungs(stocks: dict, apply: bool) -> list[str]:
    """Re-cut every close-frame deck's ТУТ rung. Returns report lines."""
    out = []
    for sym in sorted(stocks):
        stock = stocks[sym]
        story = ROOT / str(stock.get("story") or "")
        if not story.is_file():
            continue
        want = recut_rung(stock)
        if not want:
            out.append(f"  {sym}: not a CLOSE card — left alone (an intraday card's "
                       f"rung is intraday by design)")
            continue
        text = story.read_text(encoding="utf-8")
        m = re.search(r'(\["now",\s*")([^"]*)(",\s*")([^"]*)(")', text)
        if not m:
            continue
        px, label = m.group(2), m.group(4)
        px_ok = abs((nums(px) or [0])[0] - (nums(want[0]) or [0])[0]) < 0.005
        clean = not re.search(r"\d{1,2}:\d{2}\s*ET|\bPM\b", label)
        # A rung whose price is already the close and whose label carries no
        # intraday clock is left exactly as written — decks like AVGO's
        # ('ТУТ · +0.37% · нижче відкриття $394.83') hold a real close-based
        # read, and the point is to fix wrong numbers, not to flatten good copy.
        if px_ok and clean:
            continue
        # Once the price moves, the label goes with it: every number in it —
        # the %, the position P&L, the distance to a level — was measured at
        # the price being replaced.
        out.append(f"  {sym}: {px} → {want[0]}")
        out.append(f"        was: {label}")
        out.append(f"        now: {want[1]}")
        if apply:
            text = (text[:m.start()] + m.group(1) + want[0] + m.group(3)
                    + want[1] + m.group(5) + text[m.end():])
            story.write_text(text, encoding="utf-8")
    return out


def audit_market(market: dict, newest_card: str | None) -> list[str]:
    """The trend meter's own invariants, which nothing checked.

    `MARKET` is the most computed thing on the site — every bar is a weighted
    mean of its checklist, so a verdict cannot disagree with its evidence. What
    is NOT derived is the three fields around it, and those are exactly what
    drifted before: the board note blew past 1,900 characters twice in one day
    against a ~550 budget, because each refresh appended its finding instead of
    replacing the last one, and `updated` is a hand-bumped date with the same
    failure mode `board.js` needed a CI check for.
    """
    out: list[str] = []
    if not market:
        return ["MARKET is missing from data.js — the trend meter hides itself"]

    note = str(market.get("note") or "")
    if len(note) > 550:
        out.append(f"MARKET: note is {len(note)} chars, over its ~550 budget — it "
                   f"is a STANCE, not a digest; a new finding REPLACES the old one")

    d = str(market.get("updated") or "")
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", d):
        out.append(f"MARKET: updated '{d}' is not ISO YYYY-MM-DD")
    elif d > dt.date.today().isoformat():
        out.append(f"MARKET: updated {d} is in the future")
    elif newest_card and d < newest_card:
        out.append(f"MARKET: updated {d} is behind the newest card {newest_card} "
                   f"— the cockpit renders an 'as of' older than the board it tops")

    for m in market.get("markets") or []:
        sym = m.get("symbol", "?")
        checks = m.get("checks") or []
        if not checks:
            out.append(f"MARKET/{sym}: no checks — trendScore() has nothing to weigh")
        for c in checks + ((m.get("fast") or {}).get("checks") or []):
            if c.get("verdict") not in ("bull", "bear", "neutral"):
                out.append(f"MARKET/{sym}: check '{str(c.get('label'))[:30]}' has "
                           f"verdict {c.get('verdict')!r} — trendScore() scores "
                           f"anything unrecognised as 0, silently")
            w = c.get("weight")
            if w is not None and not isinstance(w, (int, float)):
                out.append(f"MARKET/{sym}: check '{str(c.get('label'))[:30]}' has "
                           f"a non-numeric weight {w!r}")
        vol = m.get("vol") or {}
        rng = vol.get("range")
        if vol and (not isinstance(rng, list) or len(rng) != 2):
            out.append(f"MARKET/{sym}: vol.range {rng!r} is not [calmLo, fearHi] — "
                       f"the mini-gauge needle has no scale to sit on")
    return out


def audit_card(stock: dict, close: float | None,
               atr: float | None = None) -> list[str]:
    """Only mechanical, decidable checks. No opinions.

    `atr` is present only on a full run — the ATR-units check (3b) is skipped
    rather than guessed when --audit-only means there are no bars."""
    lead, out = stock.get("lead"), audit_fields(stock)
    sym, side = stock["symbol"], stock.get("side", "long")
    if not lead:
        return out
    card_px = (nums(stock.get("price")) or [None])[0]
    px = close if close is not None else card_px
    if px is None:
        return [f"{sym}: no usable price"]

    entry = nums(lead.get("entry"))
    targets = nums(lead.get("targets"))
    stop = nums(lead.get("stop"))

    # 1. entry must be numeric-clean — planProgress() averages EVERY number in it
    if entry and (max(entry) / max(min(entry), 1e-9) > 3):
        out.append(f"{sym}: ⚠️ entry `{lead['entry']}` mixes scales "
                   f"{entry} — planProgress() will average them into nonsense")

    # A "confirmation-style" entry deliberately sits above price — it is asking
    # for acceptance THROUGH a level, not a dip into a zone. Exempt from 2 & 3.
    confirm_style = bool(re.search(r"\b(over|above|acceptance|reclaim)\b",
                                   str(lead.get("entry", "")), re.I))

    # …and its mirror on the short side. A REJECTION-only entry is meant to be
    # taken INSIDE its zone: the trigger is the reversal printing there, not
    # price arriving. That is the documented short entry type (see
    # docs/ta-analysis-prompt.md — held retest for proven demand,
    # confirmation-only for unproven, rejection-only for shorts), so the audit
    # has to know it exists. Two cards had grown paragraphs arguing with these
    # checks — INTC's names the heuristic outright ("the audit's 'price inside
    # the zone → live' heuristic doesn't apply here") — and prose arguing with a
    # tool twice means the tool's rule is wrong, not the cards.
    reject_style = bool(re.search(r"\b(reject\w*|fade)\b",
                                  str(lead.get("entry", "")), re.I))

    # A FILLED entry is a HELD POSITION, not a plan, and checks 2/3/5 all ask
    # the same question of a plan: is this level in a sensible place relative to
    # price? Once filled, that question is settled and unaskable — the fill
    # happened at the price it happened at, and where price sits now is P&L
    # rather than a design flaw. `planProgress()`/`bookedGains()` already switch
    # on this exact word, so the audit honours it too. Without this a working
    # long (META filled $535, price $590) is flagged as "chasing" and told its
    # status should be 'wait', i.e. told to wait for an entry it already has.
    held = bool(re.search(r"\bfilled\b", str(lead.get("entry", "")), re.I))

    # 2. a short's zone has to sit ABOVE price or there is nothing to reject
    #    from. The test is strict — zone floor at or BELOW price. An earlier
    #    2% buffer flagged zones sitting legitimately just overhead (GLW at
    #    141 vs 138.25), which is exactly where a post-rejection fade belongs.
    #
    #    For a REJECTION-only entry the floor is the wrong edge to test: price
    #    reaching the zone is the setup arriving, and the fade is taken inside
    #    it. What voids that plan is price accepting through the WHOLE zone,
    #    leaving nothing overhead — which is the COHR flaw this check was
    #    written for, and it is still caught, at the top edge instead of the
    #    bottom. CRWV ($88–97, price 89.89) and INTC ($96–102, price 101.06)
    #    both keep real resistance above price; neither is the COHR shape.
    if entry and side == "short" and not held:
        floor, ceil = min(entry), max(entry)
        if reject_style and ceil < px:
            out.append(f"{sym}: ⚠️ SHORT zone {floor:g}-{ceil:g} sits BELOW price "
                       f"{px:g} — price accepted through the whole zone, so the "
                       f"fade has nothing left overhead")
        elif not reject_style and floor <= px:
            out.append(f"{sym}: ⚠️ SHORT zone {floor:g}-{ceil:g} is not above "
                       f"price {px:g} — a fade with no resistance under it")

    # 3. a long's dip-buy zone should not sit above price (that is chasing)
    if entry and side == "long" and not confirm_style and not held \
            and min(entry) > px * 1.03:
        out.append(f"{sym}: ⚠️ LONG zone {min(entry):g}-{max(entry):g} sits "
                   f"{((min(entry) - px) / px * 100):.1f}% ABOVE price {px:g}")

    # 3b. RULE B — the stop must sit at least 1 ATR from the entry midpoint.
    #     Below that it is taken out by an ordinary day rather than by being
    #     wrong. CLAUDE.md states the rule and records four of six measurable
    #     ranked plans failing it; nothing tested it, because the audit had no
    #     ATR. A full run does.
    #
    #     ⚠️ It is an ENTRY filter and must not be pointed at a held position:
    #     read literally it would tell you to WIDEN the stop on a trade that is
    #     already winning, which is backwards. `held` covers that — the same
    #     exemption checks 2/3/5 use — and CLAUDE.md's own table is the proof
    #     (TSLA/META/DELL all failed the entry test with 1.5-3.0 ATR of live
    #     cushion, so there was nothing to fix).
    #
    #     A tighter stop is ALLOWED if the card states the trade-off outright,
    #     the way GLW's does, so a card that quotes its own ATR arithmetic is
    #     taken at its word rather than nagged every run.
    if entry and stop and atr and not held:
        mid = (min(entry) + max(entry)) / 2
        units = abs(stop[0] - mid) / atr
        argued = re.search(r"\bATR\b", str(lead.get("edge") or ""), re.I)
        if units < 1.0 and not argued:
            out.append(f"{sym}: ⚠️ stop {stop[0]:g} is {units:.2f} ATR from the entry "
                       f"midpoint {mid:g} (ATR {atr:.2f}) — under 1 ATR an ordinary "
                       f"day takes it out; widen it, or state the trade-off and the "
                       f"ATR-proof alternative on the card the way GLW's does")

    # 4. stop breached on the close?
    if stop and close is not None:
        s = stop[0]
        if side == "long" and close < s:
            out.append(f"{sym}: ⛔ STOP BROKEN — close {close:g} under {s:g}")
        if side == "short" and close > s:
            out.append(f"{sym}: ⛔ STOP BROKEN — close {close:g} over {s:g}")

    # 5. status vs where price actually is.
    #    Only the "not yet reached" side is a real mismatch. A SHORT trading
    #    BELOW its zone has already been rejected and is working — that is
    #    legitimately 'live', not a card waiting for a level.
    #    A FILLED position is skipped outright: 'live'/'wait' describe whether a
    #    plan has reached its trigger, and a held position is past that question.
    if entry and not held:
        lo, hi = min(entry), max(entry)
        have = lead.get("status")
        if have in ("live", "wait"):
            # Price inside the zone means the trigger is reached — EXCEPT on a
            # rejection-only entry, where arriving in the zone is the setup
            # presenting itself and the trigger is the reversal printing there.
            # Both readings are legitimate on the same geometry, so the analyst
            # keeps this one: INTC sits inside $96–102 with the $89 confirmation
            # never printed, which is 'wait' by its own rule, while CRWV flipped
            # to 'live' the day the reversal candle closed near its low.
            if lo <= px <= hi and have != "live" and not reject_style:
                out.append(f"{sym}: status 'wait' but price {px:g} is INSIDE "
                           f"zone {lo:g}-{hi:g} → expected 'live'")
            elif px > hi and have != "wait":
                need = "a pullback" if side == "long" else "this is above the zone"
                out.append(f"{sym}: status '{have}' but price {px:g} is ABOVE "
                           f"zone {lo:g}-{hi:g} ({need}) → expected 'wait'")

    # 6. the stop must sit OUTSIDE the entry zone (the rule the authoring prompt
    #    states outright): at the zone edge, risk ≈ 0 and the R:R is fiction.
    #    A zone edge quoted as the invalidation line ('dead >$102 close' on a
    #    $96–102 zone) is the normal shape and passes; a level STRICTLY inside
    #    the zone does not — it invalidates part of its own entry.
    if entry and stop:
        lo, hi = min(entry), max(entry)
        if side == "short" and stop[0] <= hi:
            out.append(f"{sym}: ⚠️ stop {stop[0]:g} is not above the entry zone "
                       f"{lo:g}-{hi:g} — risk ≈ 0, so `rr: '{lead.get('rr')}'` is fiction")
        if side == "long" and stop[0] >= lo:
            out.append(f"{sym}: ⚠️ stop {stop[0]:g} is not below the entry zone "
                       f"{lo:g}-{hi:g} — risk ≈ 0, so `rr: '{lead.get('rr')}'` is fiction")
        for s in stop[1:]:
            if lo < s < hi:
                out.append(f"{sym}: ⚠️ stop `{lead['stop']}` quotes {s:g}, strictly "
                           f"INSIDE the entry zone {lo:g}-{hi:g} — it invalidates "
                           f"part of its own entry")

    # 7. `rr` vs |deepest target − midpoint| ÷ |stop − midpoint|, the definition
    #    the board quotes it by. Only the first number in `stop` is the stop.
    if entry and targets and stop and lead.get("rr"):
        mid = (min(entry) + max(entry)) / 2
        risk = abs(stop[0] - mid)
        stated = nums(lead["rr"])
        if risk > 0 and stated:
            calc = abs(targets[-1] - mid) / risk
            if abs(calc - stated[0]) > 1:
                out.append(f"{sym}: rr '{lead['rr']}' vs recomputed {calc:.1f}:1 "
                           f"(midpoint {mid:g} → {targets[-1]:g} over stop {stop[0]:g})")

    # 8. Move (`downside`) and the R:R star (`rrStar`) are COMPUTED by script.js
    #    now — a value typed here is dead weight that drifts out of agreement
    #    with the table. Only keep `downside` if the plan is unparseable.
    for gone in ("downside", "rrStar"):
        if lead.get(gone) is not None and entry and targets:
            out.append(f"{sym}: `{gone}` is computed by script.js now — delete it "
                       f"from the lead so it cannot drift")

    # 9. card price vs the real close, against the tolerance for its type
    if close is not None and card_px is not None:
        drift = abs(card_px - close) / close * 100
        tol = TOL_INDEX if sym in MARKET_SYMBOLS else TOL_STOCK
        if drift > tol:
            out.append(f"{sym}: card price {card_px:g} vs close {close:g} "
                       f"({drift:.1f}% stale, tolerance {tol:g}%) — needs a refresh")
    return out


# ── main ────────────────────────────────────────────────────────────────────

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("tickers", nargs="*", help="default: everything in data.js")
    ap.add_argument("--source", choices=sorted(FETCHERS), default="yahoo")
    ap.add_argument("--out", metavar="FILE", help="also write the report here")
    ap.add_argument("--days", type=int, default=3, metavar="N",
                    help="daily sessions to print with the swing (default 3)")
    ap.add_argument("--audit-only", action="store_true", help="no network")
    ap.add_argument("--fix-rungs", action="store_true",
                    help="re-cut each close-frame deck's ТУТ rung to its card's "
                         "close (price, %% and date); no network needed")
    ap.add_argument("--dry-run", action="store_true",
                    help="with --fix-rungs: print the re-cut without writing")
    args = ap.parse_args()

    board = load_board()
    stocks = {s["symbol"]: s for s in board["STOCKS"]}
    # A full run covers the regime layer (indices + vol gauges) AND the cards.
    # The indices are not in STOCKS — they drive MARKET — so they are added
    # explicitly rather than derived from the board.
    asked = parse_tickers(args.tickers)
    if asked:
        want = asked
    else:
        want = list(MARKET_SYMBOLS) + [s for s in stocks if s not in MARKET_SYMBOLS]

    # Anything not on the board and not an index is still fetched — scouting a
    # name before it earns a card is the point. Yahoo decides whether the symbol
    # is real; a bad one fails with a clear message and does not stop the run.
    known = set(stocks) | set(MARKET_SYMBOLS)
    offboard = [t for t in want if t not in known]
    if offboard:
        where = "cannot be audited (no card)" if args.audit_only else "fetched as scouting"
        print(f"— off the board, {where}: {', '.join(offboard)}", file=sys.stderr)
        if args.audit_only:
            want = [t for t in want if t in known]
    if not want:
        print("Nothing to do.", file=sys.stderr)
        return 1

    if args.source != "yahoo":
        blocked = [t for t in want if t in INDEX_ONLY]
        if blocked:
            print(f"— {args.source} does not carry indices, skipping: "
                  f"{', '.join(blocked)} (use --source yahoo)", file=sys.stderr)
            want = [t for t in want if t not in INDEX_ONLY]

    closes: dict[str, float] = {}
    atrs: dict[str, float] = {}
    report: list[str] = []

    def emit(line: str = "") -> None:
        print(line)
        report.append(line)

    if args.fix_rungs:
        emit("=" * 78)
        emit("ТУТ RUNG RE-CUT" + (" — DRY RUN, nothing written" if args.dry_run else ""))
        emit("=" * 78)
        lines = fix_rungs({t: stocks[t] for t in want if t in stocks}, not args.dry_run)
        for line in lines:
            emit(line)
        emit()
        emit("Indicator readings (OBV, Stoch, distance to the next level) are NOT "
             "restated — they were measured intraday and this step only does the "
             "arithmetic the card already carries. Re-add a close-based read where "
             "a deck needs one.")
        emit()

    if not args.audit_only:
        fetch = FETCHERS[args.source]
        for t in want:
            try:
                bars = fetch(t)
                assert_daily(t, bars)
            except Exception as e:  # noqa: BLE001 — one bad ticker must not stop the run
                print(f"— {t}: SKIPPED ({e})", file=sys.stderr)
                continue
            fs = frames(bars)
            closes[t] = fs[0].c
            a = atr([b["h"] for b in bars], [b["l"] for b in bars],
                    [b["c"] for b in bars])[-1]
            if a:
                atrs[t] = a
            prev = bars[-2]["c"] if len(bars) > 1 else fs[0].c
            chg = (fs[0].c - prev) / prev * 100 if prev else 0.0
            tag = ("  [regime — not a card]" if t in MARKET_SYMBOLS
                   else "" if t in stocks
                   else "  [scouting — not on the board]")
            unit = "" if t in INDEX_ONLY else "$"   # VIX/VXN/NDX are levels
            emit()
            emit("=" * 78)
            emit(f"{t}  {unit}{fs[0].c:,.2f}  ({chg:+.2f}%)   "
                 f"bar {bars[-1]['date']}{tag}")
            emit("=" * 78)
            for f in fs:
                emit(f.line())
            emit(cascade(fs))
            emit(levels(resample(bars, "M")))
            emit(recent(bars, args.days))

    emit()
    emit("=" * 78)
    emit("CARD AUDIT — mechanical checks only")
    emit("=" * 78)
    findings = 0
    # The regime layer first — it sits above every card on the page, so a stale
    # cockpit mis-frames all of them rather than one.
    newest = max((s.get("date") or "" for s in stocks.values()), default=None)
    for line in audit_market(board.get("MARKET") or {}, newest):
        emit(f"  {line}")
        findings += 1
    for t in want:
        s = stocks.get(t)
        if not s:
            continue
        for line in audit_card(s, closes.get(t), atrs.get(t)):
            emit(f"  {line}")
            findings += 1
    emit()
    emit(f"{findings} finding(s). Judgement calls are not automated — "
         f"read these, then edit data.js yourself.")

    if args.out:
        Path(args.out).parent.mkdir(parents=True, exist_ok=True)
        Path(args.out).write_text("\n".join(report) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
