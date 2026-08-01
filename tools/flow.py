#!/usr/bin/env python3
"""Order-flow extractor — trade-level participation metrics for the board.

WHAT THIS IS NOT
────────────────
This does NOT measure "institutional" participation, and nothing it emits is
labelled that way. No public feed identifies the participant behind a print —
that information is aggregated away before any vendor sees it. What trade-level
data *does* support is measurable and useful:

  imbalance    aggressor side. Every trade is signed buy or sell — by the quote
               rule when the feed carries a quote (a print at/above the ask is
               buyer-initiated), else by the tick rule (Lee-Ready degenerates to
               this without quotes). Reported as (buy - sell) / total volume.
  blockShare   share of volume printed in blocks (>= 10,000 shares or >= $200k
               notional). Read it as a TREND, not a level: algos slice parent
               orders into small child orders, so a large buyer often leaves no
               blocks at all. A rising blockShare says more is being done in
               size than usual; it does not say who.
  oddLotShare  share of TRADES under 100 shares. A retail proxy — and a rough
               one, since slicing algos also print odd lots.
  offExchShare share of volume printed off-exchange (TRF/ATS). Widely
               mislabelled as "dark pool = institutional"; most of it is retail
               order flow internalised by wholesalers, so a RISING share often
               means more retail, not less. Kept because it is real data, named
               for what it measures.

Each metric ships beside a `baseline` — the same figure averaged over the prior
`--baseline-days` sessions — because every one of these is only meaningful as a
deviation from a ticker's own normal.

None of this feeds the bias score. The written methodology is
2W + D + 0.5H + 0.5R + 0.5M + 0.5O + Z, and silently adding an eighth term
would make every historical score incomparable. Flow renders as its own
columns; if it should ever score, that is a deliberate change to the formula.

SOURCES
───────
Trade-level data is a paid feed. The source is chosen by env var so swapping
vendors is config, not a rewrite:

    FLOW_SOURCE=polygon   FLOW_API_KEY=…    # polygon.io (now massive.com)
    FLOW_SOURCE=databento FLOW_API_KEY=…    # databento, TBBO (quote-signed)

Verify current pricing with the vendor — both changed plans during 2026, and
neither publishes a stable per-symbol rate. Cost scales with tickers × days, so
the daily job pulls one session for the board's roster, not history.

Usage:
    FLOW_SOURCE=polygon FLOW_API_KEY=… python3 tools/flow.py
    python3 tools/flow.py AKAM LITE --date 2026-07-31
    python3 tools/flow.py --out tools/reports/flow.json
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from structure import board_tickers  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_OUT = ROOT / "tools" / "reports" / "flow.json"

BLOCK_SHARES = 10_000        # the classic block definition
BLOCK_NOTIONAL = 200_000     # …or this much traded value, whichever hits first
ODD_LOT = 100                # under a round lot
MAX_PAGES = 400              # a hard stop: a busy megacap prints millions/day


# ── signing ─────────────────────────────────────────────────────────────────

def sign_trades(trades: list[dict]) -> tuple[float, float, float]:
    """Return (buy_volume, sell_volume, unsigned_volume).

    Quote rule where a quote is attached: at/above the ask is buyer-initiated,
    at/below the bid seller-initiated, and a print strictly inside the spread
    falls back to the tick rule. Without quotes this IS the tick rule, which is
    what Lee-Ready reduces to — trades at an unchanged price inherit the last
    non-zero direction rather than being discarded.
    """
    buy = sell = unsigned = 0.0
    last_dir = 0
    last_px = None
    for t in trades:
        px, sz = t["price"], t["size"]
        bid, ask = t.get("bid"), t.get("ask")
        d = 0
        if bid is not None and ask is not None and ask > bid:
            if px >= ask:
                d = 1
            elif px <= bid:
                d = -1
        if d == 0:                                   # tick rule
            if last_px is not None:
                if px > last_px:
                    d = 1
                elif px < last_px:
                    d = -1
                else:
                    d = last_dir                     # unchanged: inherit
            last_px = px
        else:
            last_px = px
        if d > 0:
            buy += sz
        elif d < 0:
            sell += sz
        else:
            unsigned += sz
        if d:
            last_dir = d
    return buy, sell, unsigned


def summarise(trades: list[dict]) -> dict:
    """Trade list → the metrics above. Pure arithmetic, no vendor specifics."""
    if not trades:
        return {}
    vol = sum(t["size"] for t in trades)
    if vol <= 0:
        return {}
    notional = sum(t["price"] * t["size"] for t in trades)
    buy, sell, unsigned = sign_trades(trades)
    block = sum(t["size"] for t in trades
                if t["size"] >= BLOCK_SHARES or t["price"] * t["size"] >= BLOCK_NOTIONAL)
    odd = sum(1 for t in trades if t["size"] < ODD_LOT)
    off = sum(t["size"] for t in trades if t.get("off_exchange"))
    have_venue = any("off_exchange" in t for t in trades)
    return {
        "trades": len(trades),
        "volume": int(vol),
        "vwap": round(notional / vol, 4),
        "avgSize": round(vol / len(trades), 1),
        # (buy - sell) / total, in percent. Positive = buyers lifting offers.
        "imbalance": round((buy - sell) / vol * 100, 2),
        "buyPct": round(buy / vol * 100, 2),
        "sellPct": round(sell / vol * 100, 2),
        "unsignedPct": round(unsigned / vol * 100, 2),
        "blockShare": round(block / vol * 100, 2),
        "oddLotShare": round(odd / len(trades) * 100, 2),
        # None, not 0 — a feed without venue codes has NO off-exchange reading,
        # which is a different statement from "no off-exchange volume".
        "offExchShare": round(off / vol * 100, 2) if have_venue else None,
    }


# ── vendor adapters ─────────────────────────────────────────────────────────

def _get(url: str, headers: dict, tries: int = 4) -> dict:
    """GET with backoff. 429 is normal on metered plans — back off, don't fail
    the run; the daily job has time."""
    for attempt in range(tries):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=60) as r:
                return json.loads(r.read().decode())
        except urllib.error.HTTPError as e:
            if e.code in (429, 502, 503, 504) and attempt < tries - 1:
                time.sleep(2 ** attempt)
                continue
            raise
    raise RuntimeError("unreachable")


def fetch_polygon(ticker: str, day: str, key: str) -> list[dict]:
    """polygon.io / massive.com — /v3/trades, one session, cursor-paginated.

    Trade conditions are left unfiltered on purpose except for the ones that are
    explicitly not part of the day's tape: condition 12 (form-T, pre/post) and
    15 (out-of-sequence prints) would otherwise pollute a session read.
    """
    base = (f"https://api.polygon.io/v3/trades/{urllib.parse.quote(ticker)}"
            f"?timestamp={day}&limit=50000&order=asc")
    url, out, pages = base, [], 0
    while url and pages < MAX_PAGES:
        data = _get(url, {"Authorization": f"Bearer {key}"})
        for r in data.get("results") or []:
            cond = r.get("conditions") or []
            if 12 in cond or 15 in cond:
                continue
            px, sz = r.get("price"), r.get("size")
            if px is None or not sz:
                continue
            out.append({
                "price": float(px), "size": float(sz),
                # exchange 4 is the FINRA TRF — the off-exchange print tape.
                "off_exchange": r.get("exchange") == 4,
            })
        nxt = data.get("next_url")
        url = f"{nxt}&apiKey={key}" if nxt else None
        pages += 1
    if pages >= MAX_PAGES:
        print(f"  {ticker}: stopped at {MAX_PAGES} pages — partial session",
              file=sys.stderr)
    return out


def fetch_databento(ticker: str, day: str, key: str) -> list[dict]:
    """Databento TBBO — every trade paired with the quote in force just before
    it, so signing uses the quote rule rather than falling back to ticks."""
    nxt = (dt.date.fromisoformat(day) + dt.timedelta(days=1)).isoformat()
    body = urllib.parse.urlencode({
        "dataset": os.environ.get("FLOW_DATASET", "EQUS.MINI"),
        "symbols": ticker, "schema": "tbbo", "stype_in": "raw_symbol",
        "start": day, "end": nxt, "encoding": "json",
    }).encode()
    import base64
    auth = base64.b64encode(f"{key}:".encode()).decode()
    req = urllib.request.Request(
        "https://hist.databento.com/v0/timeseries.get_range", data=body,
        headers={"Authorization": f"Basic {auth}",
                 "Content-Type": "application/x-www-form-urlencoded"})
    out = []
    with urllib.request.urlopen(req, timeout=120) as r:
        for raw in r:
            line = raw.decode().strip()
            if not line:
                continue
            rec = json.loads(line)
            px, sz = rec.get("price"), rec.get("size")
            if px is None or not sz:
                continue
            # Databento prices are fixed-point, 1e-9 per unit.
            lvl = (rec.get("levels") or [{}])[0]
            t = {"price": float(px) / 1e9, "size": float(sz)}
            if lvl.get("bid_px") and lvl.get("ask_px"):
                t["bid"] = float(lvl["bid_px"]) / 1e9
                t["ask"] = float(lvl["ask_px"]) / 1e9
            out.append(t)
    return out


SOURCES = {"polygon": fetch_polygon, "databento": fetch_databento}


# ── driver ──────────────────────────────────────────────────────────────────

def sessions_back(end: dt.date, n: int) -> list[str]:
    """The n weekdays before `end`, most recent first. Market holidays simply
    come back empty from the vendor and are dropped — cheaper than shipping a
    holiday calendar that goes stale."""
    out, d = [], end
    while len(out) < n:
        d -= dt.timedelta(days=1)
        if d.weekday() < 5:
            out.append(d.isoformat())
    return out


def read_flow(ticker: str, day: str, fetch, key: str, baseline_days: int) -> dict:
    today = summarise(fetch(ticker, day, key))
    if not today:
        raise RuntimeError("no trades returned")
    base_rows = []
    for d in sessions_back(dt.date.fromisoformat(day), baseline_days):
        try:
            s = summarise(fetch(ticker, d, key))
        except Exception as e:                       # noqa: BLE001 — reported
            print(f"  {ticker} {d}: baseline session skipped ({e})", file=sys.stderr)
            continue
        if s:
            base_rows.append(s)
    if base_rows:
        keys = ("imbalance", "blockShare", "oddLotShare", "offExchShare", "volume")
        today["baseline"] = {
            k: round(sum(r[k] for r in base_rows if r.get(k) is not None)
                     / max(sum(1 for r in base_rows if r.get(k) is not None), 1), 2)
            for k in keys
            if any(r.get(k) is not None for r in base_rows)
        }
        today["baselineDays"] = len(base_rows)
    today["date"] = day
    return today


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("tickers", nargs="*", help="blank = the board's roster")
    ap.add_argument("--date", default=None, help="session to read (default: last weekday)")
    ap.add_argument("--baseline-days", type=int, default=10)
    ap.add_argument("--out", default=str(DEFAULT_OUT))
    args = ap.parse_args()

    src = os.environ.get("FLOW_SOURCE", "").lower()
    key = os.environ.get("FLOW_API_KEY", "")
    if src not in SOURCES or not key:
        print("FLOW_SOURCE must be one of "
              f"{', '.join(SOURCES)} and FLOW_API_KEY must be set — "
              "trade-level data is a paid feed, there is no free fallback that "
              "carries trade size. Skipping flow.", file=sys.stderr)
        return 78                                    # EX_CONFIG — "not set up"

    day = args.date or sessions_back(dt.date.today() + dt.timedelta(days=1), 1)[0]
    want = [t.upper() for t in args.tickers] or board_tickers()
    fetch = SOURCES[src]

    out, failed = {}, []
    for t in want:
        try:
            out[t] = read_flow(t, day, fetch, key, args.baseline_days)
        except Exception as e:                       # noqa: BLE001 — reported
            failed.append(f"{t}: {e}")
            print(f"  {t}: FAILED — {e}", file=sys.stderr)
            continue
        f = out[t]
        print(f"  {t}: imbalance {f['imbalance']:+.2f}%  block {f['blockShare']:.2f}%  "
              f"odd {f['oddLotShare']:.2f}%  {f['trades']:,} trades", file=sys.stderr)

    if not out:
        print("no ticker produced flow — writing nothing", file=sys.stderr)
        return 1
    Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    Path(args.out).write_text(
        json.dumps({"source": src, "date": day, "tickers": out}, indent=2) + "\n",
        encoding="utf-8")
    print(f"wrote {args.out} — {len(out)} ticker(s), session {day}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
