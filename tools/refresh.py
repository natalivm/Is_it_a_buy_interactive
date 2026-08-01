#!/usr/bin/env python3
"""Refresh the board from market data instead of from screenshots.

    python3 tools/refresh.py                 # every ticker in data.js
    python3 tools/refresh.py MU SNDK WDC     # just these
    python3 tools/refresh.py --audit-only    # skip the fetch, check the cards

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
  Default is Stooq (no API key, plain CSV). `--source yfinance` uses yfinance
  if installed. Both are unofficial free feeds: fine for a personal board,
  swap in a keyed provider (Tiingo / Polygon / Alpaca) if this ever needs to
  run unattended.
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
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from indicators import Frame, read_frame, resample  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
UA = {"User-Agent": "Mozilla/5.0 (board-refresh)"}

# Tickers whose Stooq symbol is not <ticker>.us
STOOQ_OVERRIDES = {"DRAM": "dram.us"}


# ── board ───────────────────────────────────────────────────────────────────

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
    url = (f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}"
           f"?range=5y&interval=1d")
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
            "date": dt.datetime.utcfromtimestamp(t).date(),
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


def frames(bars: list[dict]) -> list[Frame]:
    return [
        read_frame("DAILY", bars),
        read_frame("WEEKLY", resample(bars, "W")),
        read_frame("MONTHLY", resample(bars, "M")),
    ]


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

    # 2. a short's zone has to sit ABOVE price or there is nothing to reject from
    if entry and side == "short" and min(entry) <= px * 1.02:
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

    # 7. card price vs the real close
    if close is not None and card_px is not None:
        drift = abs(card_px - close) / close * 100
        if drift > 0.5:
            out.append(f"{sym}: card price {card_px:g} vs close {close:g} "
                       f"({drift:.1f}% stale) — needs a refresh")
    return out


# ── main ────────────────────────────────────────────────────────────────────

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("tickers", nargs="*", help="default: everything in data.js")
    ap.add_argument("--source", choices=sorted(FETCHERS), default="yahoo")
    ap.add_argument("--out", metavar="FILE", help="also write the report here")
    ap.add_argument("--audit-only", action="store_true", help="no network")
    args = ap.parse_args()

    board = load_board()
    stocks = {s["symbol"]: s for s in board["STOCKS"]}
    want = [t.upper() for t in args.tickers] or list(stocks)

    closes: dict[str, float] = {}
    report: list[str] = []

    def emit(line: str = "") -> None:
        print(line)
        report.append(line)

    if not args.audit_only:
        fetch = FETCHERS[args.source]
        for t in want:
            if t not in stocks:
                print(f"— {t}: not on the board, skipping", file=sys.stderr)
                continue
            try:
                bars = fetch(t)
            except Exception as e:  # noqa: BLE001 — one bad ticker must not stop the run
                print(f"— {t}: fetch failed ({e})", file=sys.stderr)
                continue
            fs = frames(bars)
            closes[t] = fs[0].c
            prev = bars[-2]["c"] if len(bars) > 1 else fs[0].c
            chg = (fs[0].c - prev) / prev * 100 if prev else 0.0
            emit()
            emit("=" * 78)
            emit(f"{t}  ${fs[0].c:,.2f}  ({chg:+.2f}%)   bar {bars[-1]['date']}")
            emit("=" * 78)
            for f in fs:
                emit(f.line())

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
