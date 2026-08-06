# tools — refresh the board without screenshots

Every number the cards quote (RSI, Stochastics, MACD, OBV, Bollinger bands, the
9/50/200 EMAs) is **derived from OHLCV** — open, high, low, close, volume. The
chart does not hold extra information; it renders that arithmetic. So the way to
stop transcribing screenshots is not to read charts better, it is to fetch OHLCV
and do the arithmetic here.

## Usage

```bash
node tools/dump_board.js > /tmp/board.json   # data.js as JSON (sanity check)

python3 tools/refresh.py                     # every ticker on the board
python3 tools/refresh.py MU SNDK WDC         # a few
python3 tools/refresh.py --audit-only        # no network — just check the cards
python3 tools/refresh.py --out report.txt    # also write the report to a file
python3 tools/refresh.py --source stooq      # fallback feed
python3 tools/refresh.py --source yfinance   # if `pip install yfinance`

python3 tools/refresh.py ASML LRCX KLAC      # scouting — names with no card yet
python3 tools/refresh.py '^SOX'              # any symbol Yahoo knows
```

Tickers that are neither on the board nor in the index set are still fetched and
reported, tagged `[scouting — not on the board]`. That is how a name gets looked
at before it earns a card. They carry no `lead`, so the audit skips them, and
`--audit-only` says so rather than pretending to check them.

No API key and no third-party packages are required. The default source is
**Yahoo's chart endpoint — the same data the charts on the site render**, so the
values here line up with the ones being read off those charts. It uses raw
`close`, not `adjclose`, because the chart quotes unadjusted prices and so do
the cards. The indicator math is hand-rolled in `indicators.py` precisely so a
dependency bump cannot silently change a reading.

## Running it automatically

`.github/workflows/board-refresh.yml` runs this at **21:30 UTC on weekdays** —
DST-proof, since that is 17:30 ET in summer and 16:30 ET in winter, always after
the 16:00 ET close. It writes the report to the run summary, uploads it as an
artifact, and force-updates a single long-lived PR from `bot/board-refresh` so
the numbers arrive as a notification rather than a chore. If the report is
identical to the base (a market holiday), it opens nothing.

Trigger it by hand from the Actions tab with `workflow_dispatch` — it takes a
ticker list, a source, and a flag for whether to touch the PR.

## What it prints

1. **An extraction block per ticker** — daily / weekly / monthly OHLC plus every
   indicator, i.e. the block that used to be read off three screenshots.
2. **A card audit** — mechanical checks of each `lead` in `data.js`:
   - stop breached on the close
   - `status` disagreeing with where price actually is
   - a **short whose zone is not above price** (a fade with no resistance under
     it — the flaw that was found by hand on COHR). A **rejection-only** entry
     is tested at the zone's TOP instead: it is meant to be taken INSIDE the
     zone, so price arriving is the setup, and what voids it is price accepting
     through the whole band. Same reason such an entry is exempt from the
     `status` check's "inside the zone → live" reading — INTC sits inside
     $96–102 with its $89 confirmation unprinted, which is `wait` by its own
     rule, while CRWV flipped `live` when the reversal candle closed near its low
   - a dip-buy long whose zone sits above price (chasing); entries phrased as
     acceptance *over* a level are exempt, since those are meant to sit above
   - **a `filled` entry is exempt from the zone-vs-price and `status` checks**
     entirely. Those three checks all ask one question — is this level in a
     sensible place relative to price? — and a held position has settled it:
     the fill happened where it happened, and the gap to price now is P&L, not
     a design flaw. `planProgress()` and `bookedGains()` already switch on the
     same word. Without it a working long (META filled $535, price $590) is
     flagged as chasing and told to `wait` for an entry it already has.
   - `downside` drifting from the computed % left to the deepest target
   - card price drifting from the real close — an automatic staleness detector
   - an `entry` string mixing scales, which would make `planProgress()` average
     unrelated numbers (this bit once: `"1H close"` parsed `1` as a price)
   - **the deck ladder around the ТУТ rung**, which nothing else looked at.
     `--fix-rungs` re-cuts that rung and only that rung, so each refresh moves
     the "you are here" line and leaves its neighbours where the last session
     put them. Two things are decidable from the deck's own numbers: the ladder
     is a top-down price map, so a rung may not sit above the one printed before
     it (a level *inside* the band above it is fine — overlaps are ordered
     either way); and a `res` rung entirely below the ТУТ price is not
     resistance, nor a `sup` above it support. `key` carries no side claim and
     is never role-checked. Both are reported, never fixed — flipping a rung's
     role or re-pricing its caption is a read of what the level now means

## What it deliberately does not do

It never edits `data.js` and it never decides anything. Whether a name flips
long to short, whether a zone is drawn at the wrong level, what a cohort split
means — that is judgement and it stays with a human. The tool removes
transcription and arithmetic, which is where the mistakes actually come from.

## On TradingView

A paid TradingView plan does not unlock a data API, and scraping the charts
would breach their terms — so paying more does not solve this. What a paid plan
*does* offer that is genuinely useful is **webhook alerts**: a Pine Script study
can POST a JSON payload containing exact indicator values to an endpoint when a
condition fires. That is the supported route if you ever want TradingView's own
numbers rather than recomputed ones — but it is push-per-condition, not a way to
pull a table of 25 tickers, so it complements this script rather than replacing
it.

## Accuracy — checked against the charts

Verified on MU and QQQ. OHLC, RSI, Bollinger bands, the 9/50-EMAs and
Stochastics reproduce the chart **exactly**. Four differences are known and
expected:

1. **The chart's MACD pill shows the SIGNAL line, not the MACD line.** Confirmed
   on both names (QQQ daily pill −7.48 = signal; MACD is −10.02). Anything
   transcribed from that pill is the signal.
2. **The chart's histogram is tinted by DIRECTION, not sign.** A histogram that
   is positive but contracting draws a RED bar. Red means "the gap is closing",
   never "momentum went negative" — so this report prints sign and direction
   separately, each with a bar count.
3. **The chart's current bar can include after-hours.** QQQ's weekly bar closed
   684.47 on the chart (the AH print) against the 687.99 regular close used
   here, which is enough to move weekly RSI by ~0.7.
4. **OBV levels will not match and should not be expected to.** OBV is
   cumulative from an arbitrary first bar, so only its DIRECTION carries meaning.

Bars are fetched with `range=max` so the 200-period EMAs are properly seeded on
the weekly and monthly frames; a 5-year window left the 200-WEEK average with
~260 bars and drifted ~0.9% against the chart.

### Tolerance

Differences below **0.5% for indices** and **1% for stocks** are treated as
vendor noise and are not reported — flagging them only buries the findings that
matter. Those thresholds are `TOL_INDEX` / `TOL_STOCK` in `refresh.py` and drive
the card-price staleness check. By that standard the daily 200-EMA gap seen on
QQQ (0.2%) is nothing; the weekly one (0.9%) crossed the index threshold, which
is what `range=max` fixed.
