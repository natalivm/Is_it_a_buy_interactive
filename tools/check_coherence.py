#!/usr/bin/env python3
"""Ask whether the artefacts AGREE — the gap every other guard leaves open.

    python3 tools/check_coherence.py

Each existing guard reads ONE artefact. The card audit in refresh.py reads
data.js, the board guard reads board.js, check_decks.py reads deck prose, the
order guard reads the row order. Every one of them can pass while data.js and
board.js state different prices for the same ticker, or while a level that
exists on one ticker's chart is quoted on another's row.

That second failure is not hypothetical and is why this file exists. On
2026-08-09 MP's entire thesis rested on a reclaimed pivot at $49.39 that does
not appear anywhere on MP's chart — it was TEM's level, carried across. The
retraction was then found INCOMPLETE by exactly the check in section 5 below:
MP and TEM still shared three byte-identical bands and the same $41.28 low, and
$41.28 turned out to be TEM's too. Same error, same direction, twice.

What this can and cannot do: it checks INTERNAL agreement between artefacts.
It cannot check correspondence to reality — no guard here would have known
$49.39 was fictional, only that two rows improbably shared it. Closing that
gap needs a data feed, not a script.

Exit code is the number of findings, so `&&`-chaining works.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Digits inside an indicator NAME are not prices. Without this, "the 200-EMA
# $55.17" reads as a level at $200 and every row quoting a moving average is a
# finding — 23 of them on the first run, all noise.
INDICATOR = re.compile(r"\b\d+\s*-?\s*(?:EMA|SMA|DMA|MA)\b|\b(?:EMA|SMA|MA)\s*-?\s*\d+\b", re.I)


def dump(fname: str, name: str):
    raw = subprocess.run(["node", str(ROOT / "tools" / "dump.js"), str(ROOT / fname), name],
                         capture_output=True, text=True, check=True).stdout
    data = json.loads(raw)
    return data[name] if isinstance(data, dict) and name in data else data


def num(s) -> float | None:
    m = re.search(r"\d[\d,]*\.?\d*", str(s or ""))
    return float(m.group(0).replace(",", "")) if m else None


def nums(s) -> list[float]:
    return [float(x.replace(",", "")) for x in re.findall(r"\d[\d,]*\.?\d*", str(s or ""))]


def ratio(s) -> float | None:
    """Parse an R:R string. `num()` alone turns '~5:1' into 51.0."""
    m = re.search(r"(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)", str(s or ""))
    if not m:
        return None
    a, b = float(m.group(1)), float(m.group(2))
    return a / b if b else None


def main(S=None, B=None, quiet: bool = False) -> int:
    S = dump("data.js", "STOCKS") if S is None else S
    B = dump("board.js", "BOARD") if B is None else B
    ROW = {r["ticker"]: r for r in B["rows"]}

    bad: dict[str, list[str]] = defaultdict(list)
    advice: dict[str, list[str]] = defaultdict(list)

    def flag(kind: str, msg: str) -> None:
        bad[kind].append(msg)

    def note(kind: str, msg: str) -> None:
        """Print, but do not fail. A stop's cushion is a judgement call, not a
        contradiction between two artefacts — and a CI step that fails on
        judgement calls is a CI step somebody switches off."""
        advice[kind].append(msg)

    # ── 1 · a row's ATR pair must agree with its own price ──────────────────
    for t, r in ROW.items():
        if r.get("atr") and r.get("atrPct") and r.get("price"):
            want = r["atr"] / r["price"] * 100
            if abs(want - r["atrPct"]) > 0.06:
                flag("ATR self-consistency",
                     f"{t}: atr {r['atr']} on price {r['price']} is {want:.2f}%, "
                     f"row says {r['atrPct']}%")

    # ── 2 · the card and the board must quote the same price ───────────────
    for s in S:
        r = ROW.get(s["symbol"])
        cp = num(s.get("price"))
        if r and cp and r.get("price") and abs(cp - r["price"]) / r["price"] > 0.001:
            flag("card vs board price", f"{s['symbol']}: card {cp} vs board {r['price']}")

    # ── 3 · plan geometry ──────────────────────────────────────────────────
    # A FILLED plan is a different object from a waiting one and most of these
    # tests invert on it. Its stop is trailed, so it legitimately sits ABOVE a
    # long's fill (that is what locking in a gain looks like); its risk is
    # measured from the live price, not from the entry zone; and Rule B is an
    # ENTRY filter, so pointing it at a held position would advise WIDENING the
    # stop on a winner. All seven "stop on the wrong side" hits on the first
    # run were trailed stops on filled longs and shorts.
    for s in S:
        l = s.get("lead")
        if not l:
            continue
        t, short = s["symbol"], s.get("side") == "short"
        filled = "filled" in str(l.get("entry", "")).lower()
        en, st, tg = nums(l.get("entry")), nums(l.get("stop")), nums(l.get("targets"))
        if not en or not st or not tg:
            continue
        lo, hi = min(en), max(en)
        mid = (lo + hi) / 2
        stop, price = st[0], num(s.get("price"))
        atr = (ROW.get(t) or {}).get("atr")

        if tg != (sorted(tg, reverse=True) if short else sorted(tg)):
            flag("targets out of order", f"{t}: {l['targets']} for a {s['side']}")

        if not filled:
            if short and stop <= hi:
                flag("stop on the wrong side",
                     f"{t}: short stop {stop} is not above entry top {hi}")
            if not short and stop >= lo:
                flag("stop on the wrong side",
                     f"{t}: long stop {stop} is not below entry low {lo}")
            risk = (stop - mid) if short else (mid - stop)
            if risk > 0:
                want = abs((min(tg) if short else max(tg)) - mid) / risk
                got = ratio(l.get("rr"))
                if got and abs(want - got) / max(got, 0.01) > 0.12:
                    flag("R:R does not recompute",
                         f"{t}: states {got:.2g}:1, geometry gives {want:.2f}:1")
                if atr and risk / atr < 1.0:
                    flag("Rule B (entry filter)",
                         f"{t}: stop is {risk / atr:.2f} ATR from the entry midpoint")
        elif atr and price and l.get("status") != "booked":
            # Held position: the test is cushion from CURRENT price, and it has
            # a ceiling as well as a floor — a stop 3 ATR away risks the whole
            # gain back to the fill for no extra protection.
            cushion = (stop - price) if short else (price - stop)
            if cushion < 0:
                flag("held position: stop is through the price",
                     f"{t}: {s['side']} filled, price {price}, stop {stop}")
            elif cushion / atr < 1.0:
                note("held position: stop cushion",
                     f"{t}: only {cushion / atr:.2f} ATR between price {price} and stop {stop} "
                     f"— an ordinary day reaches it")
            elif cushion / atr > 2.5:
                note("held position: stop cushion",
                     f"{t}: {cushion / atr:.2f} ATR of give — trailing up would lock more in")

    # ── 4 · a waiting plan whose price is already inside its zone ──────────
    for s in S:
        l = s.get("lead") or {}
        if l.get("status") != "wait" or "filled" in str(l.get("entry", "")).lower():
            continue
        en, p = nums(l.get("entry")), num(s.get("price"))
        if len(en) >= 2 and p and min(en) <= p <= max(en):
            flag("status vs price",
                 f"{s['symbol']}: status 'wait' but price {p} is INSIDE {l['entry']}")

    # ── 5 · the $49.39 detector ────────────────────────────────────────────
    # Cents precision is the copy-paste signature. Two tickers sharing $52.50 or
    # $14.50 is arithmetic — round halves collide constantly and both of those
    # were noise on the first run. Two sharing $49.39 is not.
    seen: dict[float, set[str]] = defaultdict(set)
    for s in S:
        l = s.get("lead") or {}
        for f in ("entry", "stop", "targets"):
            for tok in re.findall(r"\d[\d,]*\.\d{2}\b", str(l.get(f) or "")):
                v = float(tok.replace(",", ""))
                if v >= 10 and round(v * 100) % 10:      # a real cents value
                    seen[v].add(s["symbol"])
    for v, ts in sorted(seen.items()):
        if len(ts) > 1:
            flag("same cents-precise level on two tickers",
                 f"{v} appears on {', '.join(sorted(ts))} — one of them probably carried it")

    # ── 6 · trigger prose citing a level nothing in the row supports ───────
    # Narrowed to numbers that appear in the bull/bear trigger and NOWHERE else
    # in the row. A moving average quoted in a trigger is named in `position`
    # or `note` too, so it clears; a number that exists only in the trigger
    # sentence is the shape $49.39 had.
    for t, r in ROW.items():
        zones = {round(z[k], 2)
                 for key in ("demand", "supply", "demand4h", "supply4h")
                 for z in (r.get(key) or [])
                 for k in ("lo", "hi")}
        elsewhere = json.dumps({k: v for k, v in r.items() if k not in ("bull", "bear")},
                               ensure_ascii=False)
        for fld in ("bull", "bear"):
            for v in nums(INDICATOR.sub(" ", str(r.get(fld) or ""))):
                if v < 10 or any(abs(v - z) < 0.02 for z in zones):
                    continue
                if re.search(rf"\b{re.escape(f'{v:g}')}", elsewhere):
                    continue
                flag("trigger prose cites a level nothing else in the row has",
                     f"{t}.{fld}: {v:g}")

    # ── 7 · ranks and dates ────────────────────────────────────────────────
    rk = sorted(s["lead"]["rank"] for s in S if s.get("lead") and s["lead"].get("rank"))
    if rk != list(range(1, len(rk) + 1)):
        flag("ranks", f"not 1..N contiguous: {rk}")
    newest = max(r["date"] for r in B["rows"] if r.get("date"))
    if B["updated"] != newest:
        flag("dates", f"BOARD.updated {B['updated']} vs newest row {newest}")
    known = set(ROW)
    for g in (B.get("direction") or {}).get("groups", []):
        for t in g.get("tickers", []):
            if t not in known:
                flag("dates", f"direction group '{g['label']}' names unknown ticker {t}")

    if quiet:
        return sum(len(v) for v in bad.values())
    print("=" * 78)
    print("COHERENCE — do the artefacts agree with each other?")
    print("=" * 78)
    for kind in sorted(bad):
        print(f"\n### {kind}  ({len(bad[kind])})")
        for m in bad[kind]:
            print("   ", m)
    for kind in sorted(advice):
        print(f"\n### {kind}  ({len(advice[kind])}) — advisory, does not fail")
        for m in advice[kind]:
            print("   ", m)
    total = sum(len(v) for v in bad.values())
    print(f"\n{total} finding(s) across {len(bad)} categories.")
    print(f"checked {len(S)} cards, {len(B['rows'])} board rows, "
          f"{sum(1 for s in S if s.get('lead'))} leads.")
    return total


def self_test() -> int:
    """Prove each detector fires on the failure it was written for.

    A guard nobody has seen fail is a guard nobody should trust — and these are
    cheap to prove, because every one of them was written against a real
    incident with known numbers.
    """
    row = lambda t, **kw: {**dict(ticker=t, date="2026-01-01", price=100.0, atr=5.0,
                                  atrPct=5.0, demand=[], supply=[]), **kw}
    card = lambda t, **kw: {**dict(symbol=t, price="$100.00", side="long"), **kw}
    plan = dict(rank=1, status="wait", entry="pullback holds $90.00–94.00",
                stop="$82.00 (close)", targets="$110.00 → $142.00", rr="~5:1")
    base_B = dict(updated="2026-01-01", rows=[row("AAA"), row("BBB")])

    cases = [
        ("ATR self-consistency",
         [], dict(updated="2026-01-01", rows=[row("AAA", atrPct=9.0)])),
        ("card vs board price",
         [card("AAA", price="$120.00")], base_B),
        ("stop on the wrong side",
         [card("AAA", lead=dict(plan, stop="$92.00 (close)"))], base_B),
        ("targets out of order",
         [card("AAA", lead=dict(plan, targets="$120.00 → $110.00"))], base_B),
        ("R:R does not recompute",
         [card("AAA", lead=dict(plan, rr="~99:1"))], base_B),
        ("Rule B (entry filter)",
         [card("AAA", lead=plan)],
         dict(updated="2026-01-01", rows=[row("AAA", atr=50.0, atrPct=50.0)])),
        ("status vs price",
         [card("AAA", price="$92.00", lead=plan)], base_B),
        # the incident this file exists for: $49.39 on two tickers at once
        ("same cents-precise level on two tickers",
         [card("AAA", lead=dict(plan, stop="$49.39 (close)")),
          card("BBB", lead=dict(plan, rank=2, stop="$49.39 (close)"))], base_B),
        ("trigger prose cites a level nothing else in the row has",
         [], dict(updated="2026-01-01", rows=[row("AAA", bull="break $137.42 → higher")])),
        ("ranks",
         [card("AAA", lead=dict(plan, rank=7))], base_B),
        ("dates",
         [], dict(updated="2026-01-01", rows=[row("AAA", date="2026-02-02")])),
    ]
    fails = 0
    for want, S, B in cases:
        got = collect(S, B)
        ok = want in got
        fails += not ok
        print(f"  {'PASS' if ok else 'FAIL'}  {want}"
              + ("" if ok else f"   (fired instead: {sorted(got) or 'nothing'})"))
    # and the false positives that made the first cut unusable
    fp = [
        ("a trailed stop on a filled long",
         [card("AAA", price="$130.00", lead=dict(plan, status="live",
               entry="filled $100", stop="$122.00 (close)"))],
         dict(updated="2026-01-01", rows=[row("AAA", price=130.0, atrPct=3.85)])),
        ("'~5:1' parsed as 51:1", [card("AAA", lead=plan)], base_B),
        ("a moving average named in a trigger",
         [], dict(updated="2026-01-01",
                  rows=[row("AAA", bull="reclaim the 200-EMA $137.42",
                            position="200-EMA $137.42 overhead")])),
    ]
    for what, S, B in fp:
        got = collect(S, B)
        ok = not got
        fails += not ok
        print(f"  {'PASS' if ok else 'FAIL'}  no false positive on {what}"
              + ("" if ok else f"   (fired: {sorted(got)})"))
    print(f"\n{fails} self-test failure(s).")
    return fails


def collect(S, B) -> set:
    """Run the checks over synthetic data and return the categories that fired."""
    import io
    import contextlib
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        main(S, B)
    return {ln.strip().lstrip("#").split("  (")[0].strip()
            for ln in buf.getvalue().splitlines()
            if ln.startswith("### ") and "advisory" not in ln}


if __name__ == "__main__":
    if "--self-test" in sys.argv:
        sys.exit(min(self_test(), 250))
    sys.exit(min(main(), 250))
