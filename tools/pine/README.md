# tools/pine — the board's zones, on a TradingView chart

`supply-demand.pine` draws the same demand and supply zones `board.js` quotes.
It is a port of the zone pass in `tools/structure.py`, constant for constant —
not a generic supply/demand script that happens to look similar.

That distinction is the whole reason it exists. The structure board says things
like `demand $560.62–593.96 weak`, and until now there was no way to SEE one
without trusting the number. A script drawing its own zones would disagree with
the board in ways nobody could audit, which is worse than having no chart.

## Installing it

1. TradingView → Pine Editor → **Open** → *New indicator*.
2. Paste the contents of `supply-demand.pine`, **Save**, **Add to chart**.
3. Set the chart to the frame you want to read. The daily chart reproduces the
   board's `demand`/`supply`; a 4H chart reproduces `demand4h`/`supply4h` once
   you drop **Zones drawn per side** to 2 (the board's `ZONES_4H`).

The age cap follows the chart timeframe on its own — 252 bars on daily and
slower (`MAX_ZONE_AGE`), 120 on intraday (`MAX_ZONE_AGE_4H`). Every other
default is the value `structure.py` runs on, so an untouched indicator on a
daily chart is the board.

## What it draws

- **Boxes** from the base that formed each zone to the right edge. Demand green,
  supply red, and the fill gets fainter as the zone is consumed:
  `fresh` → `tested` → `weak`.
- **A label** per zone: the range, the grade, and `(Nt/Mc)` — revisits and
  closes INSIDE. A wick in and an immediate close back out is a rejection and
  counts as a touch; a close inside is acceptance and is what actually eats a
  zone.
- **A panel**, top right, carrying the board's own three lines: the `position`
  sentence, the bull trigger and the bear trigger, computed from the drawn
  zones by the same rules (`_position()`, `_bull()`, `_bear()` — including
  `_next_beyond()`, so a target is never a level inside the trigger that names
  it).

## Why it computes in one batch on the last bar

A bar-by-bar indicator is the obvious way to write this, and it does **not**
reproduce the board.

`significant_swings()` collapses consecutive same-kind pivots into the more
extreme one across the WHOLE series, and `find_zones()` then filters that
finished zigzag with `s.i < i`. Collapsing everything and then filtering is not
the same as collapsing the prefix: a pivot at bar 14 can absorb the one at bar
10, so the swing a causal script has at bar 12 is a swing the extractor no
longer has. Written causally and checked against `structure.py`, AXON came out
with **4 supply zones instead of 8** — the batch zigzag broke structure the
causal one never saw break.

So the script does what the extractor does: on the last bar it walks the full
history once, in the same order, with the same `i += DISPLACE_BARS` skip. The
cost is real and worth stating — zones are drawn for the CURRENT state of the
chart only. Scroll back and you will not see what the board would have said last
March. Matching `board.js` exactly is worth more than a historical replay that
disagrees with it.

## Verifying the port

`verify_port.py` transliterates the Pine — same batch pass, same loop bounds,
same offset arithmetic — and diffs it against `structure.py` on real bars:

```bash
python3 tools/pine/verify_port.py            # every ticker in board.js
python3 tools/pine/verify_port.py AXON TTD   # a few
```

It compares zone boundaries, grades and the nearest-N selection per side, and
exits non-zero on any mismatch. On the 2026-08-07 board that is **50/50 zone
lists identical** across 25 tickers.

It needs network (it fetches the same bars `structure.py` does), so it is a
manual check rather than a CI step. Run it after touching either side of the
port — a change to `find_zones()` that is not mirrored here will show up as a
mismatch rather than as a chart quietly disagreeing with the board.

What the check does **not** cover: TradingView's compiler. The Pine is verified
for logic, not for syntax — the first paste into the Pine Editor is still the
first time it is compiled.

## What it deliberately does not draw

- **Structural levels.** When the displacement pass finds nothing on a side, the
  board falls back to `structural_levels()` and prints entries marked
  `structural` — LITE's supply is `$896.11 structural, $897.00 structural`. Those
  are swing references, not displacement zones, and this script draws only
  zones. A side with no boxes is that fallback, not a bug.
- **Anything scored.** `Z`, the bias score, the frames and the triggers on the
  board are the extractor's job. This is the zone pass and nothing else.
