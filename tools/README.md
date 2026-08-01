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
```

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
     it — the flaw that was found by hand on COHR)
   - a dip-buy long whose zone sits above price (chasing); entries phrased as
     acceptance *over* a level are exempt, since those are meant to sit above
   - `downside` drifting from the computed % left to the deepest target
   - card price drifting from the real close — an automatic staleness detector
   - an `entry` string mixing scales, which would make `planProgress()` average
     unrelated numbers (this bit once: `"1H close"` parsed `1` as a price)

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

## Accuracy

Readings land within a few tenths of a chart's, not to the last decimal:
vendors differ on EMA seeding and on adjusted-vs-raw closes. That is immaterial
to the decisions the board makes (*is RSI above the midline, is Stochastics
washed out*) — and it is why the report prints **values, not verdicts**.
