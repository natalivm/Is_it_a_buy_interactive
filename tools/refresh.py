#!/usr/bin/env python3
"""Refresh the board from market data instead of from screenshots.

    python3 tools/refresh.py                 # every ticker in data.js
    python3 tools/refresh.py MU SNDK WDC     # just these
    python3 tools/refresh.py --audit-only    # skip the fetch, check the cards
    python3 tools/refresh.py --days 5        # show 5 sessions, not 3

What it does
  1. reads the board (node tools/dump_board.js)
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
from indicators import Frame, read_frame, resample  # noqa: E402

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
        ["node", str(ROOT / "tools" / "dump_board.js")],
        capture_output=True, text=True, check=True,
    )
    return json.loads(out.stdout)


# ── fetch ───────────────────────────────────────────────────────────────────

def fetch_yahoo(ticker: str) -> list[dict]:
    """Yahoo's chart endpoint — the same data the site's own charts render, so
    the numbers here line up with what you see there. Uses raw `close`, not
    `adjclose`: the chart quotes unadjusted prices and so do the cards."""
    sym = urllib.parse.quote(MARKET_SYMBOLS.get(ticker, ticker))
    # 10y, NOT max. Yahoo silently DOWNGRADES the interval when range=max is
    # paired with interval=1d — it returns coarse (monthly-ish) bars with a 200
    # response rather than an error, which produced identical daily/weekly/
    # monthly frames and nonsense indicators. 10y keeps daily granularity while
    # still giving ~500 weekly bars, enough to seed a 200-week EMA properly.
    url = (f"https://query1.finance.yahoo.com/v8/finance/chart/{sym}"
           f"?range=10y&interval=1d")
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


def audit_card(stock: dict, close: float | None) -> list[str]:
    """Only mechanical, decidable checks. No opinions."""
    lead, out = stock.get("lead"), []
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

    # 2. a short's zone has to sit ABOVE price or there is nothing to reject
    #    from. The test is strict — zone floor at or BELOW price. An earlier
    #    2% buffer flagged zones sitting legitimately just overhead (GLW at
    #    141 vs 138.25), which is exactly where a post-rejection fade belongs.
    if entry and side == "short" and min(entry) <= px:
        out.append(f"{sym}: ⚠️ SHORT zone {min(entry):g}-{max(entry):g} is not above "
                   f"price {px:g} — a fade with no resistance under it")

    # 3. a long's dip-buy zone should not sit above price (that is chasing)
    if entry and side == "long" and not confirm_style and min(entry) > px * 1.03:
        out.append(f"{sym}: ⚠️ LONG zone {min(entry):g}-{max(entry):g} sits "
                   f"{((min(entry) - px) / px * 100):.1f}% ABOVE price {px:g}")

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
    if entry:
        lo, hi = min(entry), max(entry)
        have = lead.get("status")
        if have in ("live", "wait"):
            if lo <= px <= hi and have != "live":
                out.append(f"{sym}: status 'wait' but price {px:g} is INSIDE "
                           f"zone {lo:g}-{hi:g} → expected 'live'")
            elif px > hi and have != "wait":
                need = "a pullback" if side == "long" else "this is above the zone"
                out.append(f"{sym}: status '{have}' but price {px:g} is ABOVE "
                           f"zone {lo:g}-{hi:g} ({need}) → expected 'wait'")

    # 6. stated `downside` vs computed % left from price to the deepest target.
    #    Board convention: longs quote it +, shorts quote it −.
    if targets and lead.get("downside"):
        t = targets[-1]
        left = ((t - px) / px if side == "long" else (px - t) / px) * 100
        shown = f"{'+' if side == 'long' else '−'}{abs(left):.1f}%"
        stated = nums(lead["downside"])
        if stated and abs(abs(stated[0]) - abs(left)) > 2:
            out.append(f"{sym}: downside '{lead['downside']}' vs computed "
                       f"{shown} to {t:g} — off by {abs(abs(stated[0]) - abs(left)):.1f}pp")

    # 7. card price vs the real close, against the tolerance for its type
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
    report: list[str] = []

    def emit(line: str = "") -> None:
        print(line)
        report.append(line)

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
    for t in want:
        s = stocks.get(t)
        if not s:
            continue
        for line in audit_card(s, closes.get(t)):
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
