# tools/pine — supply and demand on a TradingView chart

`supply-demand.pine` draws demand and supply zones on three frames at once —
**monthly first, weekly over it, the chart's own frame over both** — from the
same engine `tools/structure.py` uses for `board.js`.

## Installing it

1. TradingView → Pine Editor → **Open** → *New indicator*.
2. Paste the contents of `supply-demand.pine`, **Save**, **Add to chart**.
3. Use it on a daily chart. Monthly and weekly come from `request.security`, so
   one chart shows all three; a higher frame is skipped automatically when the
   chart is already at or above it.

## How a zone is built

```
DEMAND   [ lowest WICK of the base , highest BODY edge ]   upper wick discarded
SUPPLY   [ lowest BODY edge , highest WICK of the base ]   lower wick discarded
```

The base is the **balance before the impulse**: candles whose bodies are small
against ATR, sitting immediately before a displacement leg that breaks
structure. Colour is deliberately not the test — a base is where price went
quiet, and a quiet candle is quiet whichever way it closed.

The impulse is unchanged from the board: open-to-furthest-**close** over
`displaceBars` bars, at least `displaceAtr` ATRs, and it must break the last
swing. An up-leg through the last swing high leaves demand behind it; a down-leg
through the last swing low leaves supply above it. A leg that breaks nothing is
just a big candle.

### The two base rules

| `Base` input | walks back over | use it for |
|---|---|---|
| `balance candles` *(default)* | candles with `\|close − open\| ≤ 0.5 ATR`, any colour | reading a chart |
| `board rules (colour)` | candles of the opposite or neutral colour — the extractor's `_base_span()` | reproducing `board.js` exactly |

**Balance mode is a deliberate divergence** from `structure.py`, and it moves
real levels: on the 08-07 board it changes **38 of 50** zone lists. A zone drawn
that way is this script's opinion, not the board's number. Switch to `board
rules` when you want the two to be the same thing.

## The stack

Every zone is a **thin outline over one light fill, the same weight on every
frame**. Overlapping fills composite, so a band where monthly, weekly and
chart-frame demand all sit comes out visibly denser than any of them alone —
**the density is the confluence**, and it costs nothing to compute.

That uniformity is the point. Giving the daily a heavier fill and the monthly a
fainter one destroys the signal, because a dark patch could then mean one bold
zone rather than three agreeing ones. For the same reason `Fade weak zones` is
off by default — the grade is in the label, where it does not compete with the
overlap for your eye.

Frames stay identifiable without adding weight:

| frame | border | label |
|---|---|---|
| monthly | dotted, thin | `M demand $… weak (3t/1c)` |
| weekly | dashed, thin | `W …` |
| chart | solid, thin | `D …` |

Each has its own **zones per side** and **age cap** (36 monthly bars ≈ 3y, 104
weekly ≈ 2y, 252 chart bars — the board's `MAX_ZONE_AGE`).

Labels are **one letter** — `M`, `W` or `D` — and nothing else. The prices are
on the axis and the grade is in the fill, so a caption per zone carrying its
range and revisit counts buries the chart it is describing.

Tune the stacking with **Zone fill transparency** (default 85, one value for all
frames): three stacked zones read roughly three times denser than one, so lower
it if single zones are too faint and raise it if the overlaps go muddy.

The panel, top right, carries the board's own `position` / bull / bear lines
computed from the **chart frame's** zones — the frame a trade is actually taken
on — including `_next_beyond()`, so a target is never a level inside the trigger
that names it.

## Trend control points

A yellow dashed line marks **where the trend started and where it was over**,
read on the **weekly** by default (monthly and chart frame are options). Dashed
uprights at each end put the dates on the axis, and each end is captioned —
`W uptrend started` and either `W uptrend — running` or `W uptrend over`.

It comes off the same pivots the zones use, so the trend and the levels can
never be two different readings of the chart.

### A trend ends on a break of the opposite side

```
an UPTREND is over when price makes a LOWER LOW
a DOWNTREND is over when price makes a HIGHER HIGH
```

That is the whole rule, and it is the part that is easy to get wrong — an
earlier version of this ended a trend at the first swing pointing the other way,
whichever kind it was, so a lower **high** killed an uptrend. A lower high is a
pullback. An uptrend making higher lows is intact however many lower highs it
prints, and it is finished only when the lows give way.

So each direction watches one side of the zigzag: **uptrends live on the lows,
downtrends live on the highs**, and the break that kills one starts the other.
The control points fall out of that — an uptrend starts at the swing low it was
launched from and is over at the low that broke its predecessor.

**Expect it to be slow, because that is what a trend rule is.** AKAM's weekly
lows run 84.54 → 88.50 → 108.84 while its last high, 131.08, is below the
previous 165.45. The marker reads *uptrend running*: the lower high is a
pullback and no low has broken. The board's own weekly structure says neutral at
the same moment, because `classify_structure()` requires a higher high **and** a
higher low. Both are right about different questions.

The **previous leg** is drawn faded alongside the running one, so the chart
shows where the last trend was over as well as what has run since. 24 of the 25
board tickers have one.

Note what this is not: `classify_structure()` answers *what is the structure
now* and abstains easily; the markers answer *which way is the trend until it
breaks* and hold a direction through pullbacks. They disagree by design — on the
current board the markers name a direction on 18 tickers where the extractor
says neutral. What must never happen is the two pointing OPPOSITE ways, and
`verify_port.py` checks exactly that (currently **0 contradictions / 25**).

## Verifying the port

```bash
python3 tools/pine/verify_port.py            # every ticker in board.js
python3 tools/pine/verify_port.py AXON TTD   # a few
```

`verify_port.py` transliterates the indicator's `zonesFor()` and `trendRun()` —
same loop bounds, same index arithmetic — and checks four things: board-rules
parity against `structure.py` (**currently 50/50 zone lists identical across 25
tickers**, boundaries and grades both), that balance mode runs and by how much
it differs, that the same engine produces sane zones on weekly and monthly
resamples, and that no trend marker contradicts the board's weekly structure.
It exits non-zero on a zone mismatch or a trend contradiction.

It needs network, so it is a manual check rather than a CI step. Run it after
touching either side of the port — a change to `find_zones()` that is not
mirrored here shows up as a mismatch instead of as a chart quietly disagreeing
with the board.

## Why it computes in one batch on the last bar

`significant_swings()` collapses consecutive same-kind pivots across the WHOLE
series, and `find_zones()` then filters that finished zigzag with `s.i < i`.
Collapsing everything and filtering afterwards is not the same as collapsing the
prefix: a pivot at bar 14 can absorb the one at bar 10, so the swing a causal
script has at bar 12 is one the extractor no longer has. Written causally and
checked, AXON came out with **4 supply zones instead of 8**.

So the script does what the extractor does — on the last bar it walks each
frame's history once, in index order, with the same `i += displaceBars` skip. The
cost is real: zones show the CURRENT state only, so scrolling back does not
replay what the script would have drawn last March.

## Known limits

- **Logic is verified; syntax is not.** TradingView's compiler has not seen this
  file — the first paste into the Pine Editor is the first compile.
- **An empty monthly layer is usually the distance cap, not a bug.** Zones are
  dropped past `maxZoneDist` (45% of price) and monthly demand on a name that
  has travelled a long way sits further below than that. Ten of the 25 board
  tickers currently draw no monthly zone for exactly that reason. Raise the
  input if you want to see them.
- **Monthly history is bounded by the chart.** The higher frames are rebuilt
  from bars the chart has loaded, so ~1600 daily bars gives ~76 monthly ones.
- **Displacement zones only.** Where the board falls back to
  `structural_levels()` (LITE's supply is `$896.11 structural`), that side
  legitimately shows no box.
