# Is It a BUY interactive

Single-page static web app: a gallery of stock tiles, each opening an
interactive tap-through "story" that explains the trade thesis for that stock.

## Architecture

- `data.js` — hand-edited `STOCKS` array (one entry per tile)
- `script.js` — renders tiles from `STOCKS` and opens each stock's story in a
  full-screen iframe overlay
- `styles.css` — dark purple/pink theme; 3-per-row responsive tile grid.
  **Type sizes are a fixed scale** — 12/14/16/18/22/28, nothing smaller than
  12: five `--fs-*` tokens in `:root` (the decks have three of their own in
  `stories/story.css`, plus the `--title-*` clamps). Hierarchy below body size
  is weight and colour, not a smaller number.
  Every `font-size` is a token or a clamp — CI fails a raw px, because the
  scale replaced a 22-value ladder (9, 9.5, 10, 10.5…) that grew one
  "just this once" at a time. Need a new size? Reuse a step or change a
  step — a new token is a design decision, not a workaround. Articles are
  exempt (self-contained pages, own design).
- `stories/` — one HTML slideshow per stock, driven by the shared
  `stories/story.css` + `stories/engine.js` (see "Deck anatomy" below)
- `index.html` — shell: navbar, `#trendMeter` panel, `#bookedStrip`,
  `#leaderboard` table, `#gallery` grid, `#storyOverlay` modal
- `manifest.json` / `sw.js` — PWA + offline caching (bump `CACHE_NAME` in
  `sw.js` on releases; the deploy workflow rewrites it to the commit hash)
- `tools/refresh.py` — fetches OHLCV, recomputes every indicator the cards
  quote, and audits the board (`--audit-only` needs no network). Run it after
  every data.js edit; see `tools/README.md`.

**Fonts are one shared request.** `index.html`, all 31 decks and both articles
link the SAME Google-Fonts URL — Oswald 600;700 + Inter 400…700 + IBM Plex Mono
400…700 — so opening a deck re-uses the gallery's cached font files instead of
pulling a second mono family. Adding a weight means adding it in every one of
those files, or not at all; never introduce a second family or a per-surface
URL.

## Deck anatomy (stories/*.html)

Decks share almost everything through `story.css`/`engine.js`; keep them lean:

- **Shared CSS** lives in `stories/story.css` (foundation + the full hoisted
  component system: eyebrow/h1/sub/indi/chart/candle/legup/legdn/ladder/verdict/
  note/nav…). Fonts and `--ink` have shared `:root` defaults there, and
  the verdict box has colour variants (`verdict` = pink default, `verdict p` /
  `verdict y` / `verdict k`). A deck's inline `<style>` holds ONLY its `:root`
  colour palette (incl. `--sub`, the body-text tint) plus genuinely unique
  overrides (e.g. `.wt` weight strip on DRAM, `.rung.key` on AAOI). Never
  re-add shared rules to a deck's inline style.
- **Shared chrome is auto-built** by `engine.js`: the "Is it a BUY?" brand
  watermark, the footer nav, and the telegram sign-off + not-financial-advice
  disclaimer on the last slide are all injected — decks contain none of that
  markup and end with just
  `<script src="engine.js"></script><script>createStory();</script>`
  (`createStory()`'s defaults match every deck — pass a cfg object only where
  a deck genuinely diverges; `tg: false` suppresses the telegram block).
- **Levels ladders are data-driven**: rungs are declared as
  `<div class="ladder rv" data-rungs='[["res","$390","label"], …]'></div>`
  with entries `[kind res|sup|now|key, price, label]`, hydrated by
  `engine.js`. To change a level, edit the JSON — never hand-write rung divs.
  ⚠️ **The `now` rung must be on the SAME FRAME as its card.** A card refreshed
  from intraday charts (you saw an entry mid-session) is legitimately intraday
  and its rung should say so. But a card whose `change` reads `📅 CLOSE …` — the
  daily/weekly close review, which is most of them — must have a rung quoting
  that close: the first number in `price`, never the `🌙` after-hours print. A
  close card carrying a clocked rung (`+13.81% (2:36 ET)`) is stale in every
  number, not just the price: the %, the OBV, the Stoch and the distance to the
  next level were all measured at a moment that has passed. Re-cut the whole
  rung, not just its price:

  ```bash
  python3 tools/refresh.py --audit-only --fix-rungs --dry-run   # show
  python3 tools/refresh.py --audit-only --fix-rungs             # write
  ```

  That does the arithmetic already in `data.js` — close, day %, date, and
  whether the close is inside the entry zone — giving the house format
  `ТУТ · закриття 31.07 (+1.18%) · усередині зони входу`. It DROPS the intraday
  indicator tail rather than guessing it (printing every dropped label), and it
  skips decks whose rung is already close-cut, so a genuine close-based read
  like AVGO's `· нижче відкриття $394.83` survives untouched. The scheduled
  `board-refresh` workflow runs the same re-cut against freshly fetched closes
  and puts the diff in its PR.
- **Navigation**: tap left/right zones, swipe, arrow keys, and mouse wheel all
  advance slides. The tap zones are TOUCH-ONLY (built when the primary pointer
  is coarse) — on desktop they'd steal clicks from text selection while
  wheel/keys/nav buttons already cover navigation. On the LAST slide a swipe
  (any direction) or a forward wheel-scroll closes the deck — the engine posts
  `{type:'ib-close'}` to the parent gallery. A slide with the `data-noclick`
  attribute (used on the text-only daily-candle slide) disables the tap zones
  while active so its text can be selected without navigating. A slide with
  `data-text` (chartless prose slides, e.g. the SMH weekly read) keeps tap
  navigation but gets the text-focus treatment from `story.css`: top-aligned
  column, full-width copy (no 40ch cap) and larger type — the engine's fit()
  rescales anything that still overflows.
- **Level charts are data-driven**: horizontal price levels are declared as
  `<svg data-lv='[["k",70,"$402","стоп · MA-стек",.05], …]'>` with entries
  `[color k|p|y|w|m, y, axisLabel, caption|null, delay?]`, hydrated by
  `engine.js` at load. Only custom paths/dots/one-off captions stay as inline
  SVG. To change a price level, edit the JSON — not SVG elements.
- **Candles**: green candles use `class="candle-wick up …"` /
  `class="candle-body up …"` from the shared CSS — no inline fill/stroke.
- Slide flow per deck: cover/1D → daily candle → levels ladder → plan
  (entry/stop/targets + a "🎯 Тригер від сьогодні" note giving the actionable
  instruction from the current price). Four slides is the norm; a deck that has
  something extra to say (e.g. a `data-text` weekly read) adds one, it does not
  pad to a fixed count.

## Copy style

- Ukrainian copy NEVER uses the anglicism «тейп» ("the tape") — it means
  nothing to readers. Write «ринок», «хід торгів» or «динаміка» instead.
  (English copy may still say "the tape".)
- Nor «клоуз» — write «закриття». Note the gender changes with it: «клоуз» is
  masculine but «закриття» is neuter, so the adjective has to follow —
  «денний клоуз» becomes «денне закриття», «на денному клоузі» becomes «на
  денному закритті». (English copy may still say "close".)
- Nor «додатна» for a positive value — write «плюсова» (and «плюсовий»,
  «плюсову»… to match).
- Nor «лой»/«лоу» for a swing low — write «дно». Neuter again, so everything
  agreeing with it moves: «зламаний лой» → «зламане дно», «вчорашній AH-лоу» →
  «вчорашнє AH-дно», «лой $515.68 втримав» → «дно $515.68 втримало», «це був
  лой» → «це було дно». «був лоєм» keeps its verb («був дном») because the verb
  agrees with the subject, not the instrumental predicate. Genitive is «дна»
  («+16% від дна», «брейк AH-дна»).
- «дошка» is fine for the board itself («записка дошки») but NOT in the
  comparison sense — there write «решта імен» or «напівпровідники»
  («шорти решти імен», «смуга по решті імен»).
- Nor «фліп»/«флip» (a setup reversing side, e.g. short → long on a reclaim)
  — write «перевертає»/«перевертається» («reclaim $61 перевертає сетап у
  лонг», «був лонг → сетап перевернувся в шорт»). Also banned: «гейт»/«ворота»
  for a decisive group-wide level — write «рівень» («SMH-рівень», «рівень не
  взято»); «шортокрий» for short covering — keep the English term, same as
  OBV/MACD/RSI/Stoch/VWAP; «ре-арм»/«re-arm» for a setup becoming tradeable
  again — write «оживає»/«оживання» («1H close нижче = шорт оживає»); «хрест
  смерті» / «(не) зшито» for two EMAs that haven't crossed back — just say so
  plainly («EMA50 усе ще нижче за EMA200 — вони ще не перетнулись»); nor
  «полиця» for a support/resistance shelf — write «рівень» even where it
  spans a range («до-обвальний рівень», «пост-IPO рівень»). Mind the gender
  switch that comes with it: «полиця» is feminine but «рівень» is masculine,
  so agreement moves too — «зламана полиця» → «зламаний рівень», «полиця
  здалась» → «рівень здався».
- **One thought per line.** A `.sub` written as a single dense block reads as a
  wall on a phone. Give the paragraph the `lines` class and break it with
  `<br>`, one fact per line, each line short enough not to wrap — the column is
  46ch, so keep lines at or under ~52 characters of visible text. Condense
  rather than merely splitting: the goal is less prose, not the same prose in
  a taller shape.

## Trend meter (`MARKET` in data.js)

The cockpit at the very top of the board answers one question per index — is it
in an uptrend or a downtrend — and is rendered by `renderTrendMeter()` from the
`MARKET` object in `data.js`: one stacked trend bar per entry in
`MARKET.markets` (QQQ, SMH, …) with the VIX/VXN fear mini-gauges in a narrow
column beside them. That's the WHOLE cockpit — bars, chips, minis, board note;
there is deliberately no expanded evidence UI (it was tried and removed as
clutter), so don't reintroduce per-gauge accordions. The whole point is that
**every verdict is computed, never hand-set**:

- Each market's `checks` is its evidence list: `{ label,
  verdict: 'bull'|'bear'|'neutral', read, weight? }`. `trendScore()` turns it
  into a weighted mean on a −100…+100 scale (bull +1, bear −1, neutral 0;
  `weight` defaults to 1 — give structural facts 1.5 and oscillators 1). That
  score positions the row's needle, picks the band from `TREND_BANDS` in
  `script.js` (Downtrend / Rolling over / Neutral / Repairing / Uptrend) and
  colours the row red→amber→yellow→cyan→green via `--tm-a`. So a bar can never
  disagree with its checklist — to change a reading, change a check's
  `verdict`, not a number somewhere else.
- Each market also carries `fast.checks` — the **4H fast frame**, scored the
  same way but rendered as a small chip on the row. The fast frame flips
  first, the daily bar confirms; keep 4H evidence there, not in `checks`, so
  the frames stay independent. Refresh the fast checks intraday when the 4H
  tape changes even if the daily read hasn't.
- `vol` holds the VIX/VXN mini-gauges: `value` is parsed for the needle and
  `range: [calmLo, fearHi]` is the scale it sits on; `read` surfaces only as
  the mini's hover tooltip.
- Per market, `confirm` (the ordered flip checklist), `levels.reclaim` /
  `levels.invalidate` and `note` are the analyst's working log — kept current
  in data.js on every refresh but NOT rendered. The `read` on each check is
  the same: the reasoning lives in the data, the page shows only the bars.
  Top-level `note` is the one-line board stance under the bars (rendered).
  **It has a HARD budget: under ~550 characters.** It renders under the bars,
  where a wall of prose is precisely what the cockpit exists to avoid — and it
  has now blown past 1,900 characters twice in one day (2026-08-03, intraday
  and again at the close), because each refresh APPENDS its finding instead of
  replacing the last one. It is a STANCE, not a digest: the gate's state, the
  single structural fact of the session, and the one thing that would change
  the read. Nothing else. Evidence belongs in each check's `read`; per-market
  narrative belongs in that market's own `note`, which is an unrendered working
  log and may run long. A new finding that matters more than what is there
  REPLACES it — the note never grows by accretion. Same discipline for the
  per-market `note`s if they ever start rendering.
- Bump `updated` (ISO date) on every refresh — it renders as the "as of" label,
  same discipline as a tile's `date`. The section hides itself if `MARKET` is
  missing or no market has usable checks.

## Structure board (`BOARD` in board.js)

A SEPARATE element from the `STOCKS` cards: a card carries a traded plan, this
board carries structure (where demand and supply sit, what triggers which way).
The same ticker may appear in both and **they are allowed to disagree** —
nothing here is derived from `data.js`. Regenerated by `tools/structure.py`;
the schema is frozen, and `board.js`'s own header is the full field list.

**The board has its own URL: `index.html#board`.** It shares the hash space with
the deck slugs, so `board` is RESERVED — `findStock()` refuses it, and a ticker
of that name could never open a deck. Toggling into the board writes the hash,
so the address bar IS the share link and no copy button has to exist; toggling
out clears it with `history.replaceState`, so cards → board → cards leaves the
page where it started instead of needing three Backs. Read PRE-PAINT by the
inline script in `index.html`, next to the theme, or a shared link paints the
card view first and swaps a frame later. A link opens the board without writing
`ib-view`: it says "show me this now", not "make this your default".

**The ticker cell is FOUR LINES, and that is the whole cell:**

```
LLY                    $1,147.63     ← ticker + price, price BOLD
ATR(14) $36.38 / 3.17%               ← the ATR pair, nothing appended
Long preferred                       ← preferred direction, tinted by side
Neutral-to-bullish. Prefer …         ← bias
```

Every row shows all four, always. The template in `boardRowHtml()` has **no
optional branches** and must not grow one: a column you read down should have
the same shape in every cell, and a line that appears on some rows only makes
it ragged. So `price`, `atr`, `atrPct`, `preferred` and `bias` are REQUIRED on
every row — the CI board guard fails a row missing any of them rather than
letting the cell render short.

Same shape is not the same as same size, so the two prose fields have budgets —
**CI-enforced now**, at the documented number rather than at some tolerance
above it, because "~45 with a fudge factor" is a budget nobody can be wrong
about. `preferred` **under ~45 characters** (1–2 lines) and `bias` **under ~115**
(2–4 lines). They had drifted to 238 and 448 — a cell twelve times the height of
LLY's — because later rows restated levels the Bullish/Bearish trigger columns
already carry. State the verdict here; the levels belong in the setup fields,
and anything else in a row comment. Price and the ATR pair render at **exactly
two decimals** (`fmtFixed`), not `fmtNum`'s stripped form: it is a mono column
read straight down, and `$356.6` over `$1,147.63` is what raggedness looks like.

Two things used to render here and are deliberately gone: a `· score ±N` suffix
on the ATR line and a `W+1 D+0 …` parts line, both of which appear on generated
rows only — meaning the cell would have silently grown two extra lines the
first time the bot ran. **If the computed score needs to be visible again it
gets its own column, not a fifth line in this cell.** Note the trade-off that
buys: with `score`/`parts` unrendered, a generated row's bias cannot be checked
against its own inputs on screen — only in `board.js` or the TSV export, which
still carry both.

**The 4H cell is ONE paragraph, then the four frames** — the same discipline,
in the next column:

```
Rebound off $529.10 rejected at $577.34 — an        ← h4, ~2 lines
attempt, not a turn, so the frame reads neutral.
─────────────────────────────────────────────       ← divider
M = range / transition                              ← trendProse.m
W ▲ strong uptrend                                  ← .w
D = range / transition                              ← .d
4H = uptrend                                        ← .h4
```

The arrow is the frame's STRUCTURE enum; the words beside it are `trendProse`,
and those are **computed** — `read_ticker()` emits each frame's own trend band
(`downtrend`, `range / transition`, `strong uptrend`), so the two halves of a
line are two reads from the same run and neither can fall behind the other. It
is deliberately NOT in the extractor's CARRY list. Carrying it looked harmless
and was not: `structCell()` prefers the prose over the enum, so the first
generated board rendered its new arrows beside the old words — `W ▲ downtrend`
on INTC, on ten rows at once. The band also settles the budget that phrase kept
breaking (hand-written frames had drifted to 158 characters, four wrapped lines
in a cell whose neighbour had four short ones): every band is under 19
characters, so each frame stays on ONE line by construction.

That leaves `h4` as the only hand-written field in the column, with its own
budget: **under ~100 characters**, about two lines. The reasoning goes there,
and anything longer goes in a comment.

`h4Effect` is NOT rendered. It used to print as a second paragraph, which made
the seven rows carrying one visibly taller than the rest — same problem as the
ticker cell's score line. It is exported in the TSV instead, so the reasoning
still leaves the file.

**Zones are drawn twice: daily for structure, 4H for the edge.** The daily pass
is the board and always leads the cell. Under it, behind a `4H` label, sit
`demand4h` / `supply4h` — the same displacement rules run on 4H bars, nearest
two a side. They exist because a name moving several ATRs in a week outruns its
daily zones: TTD fell through its whole daily supply band ($17.96–19.37, 1.4
ATR wide) in three sessions while the 4H pass put the live edge at $18.14–18.28,
and AXON's daily demand was a 4.4%-wide shelf on a ticker that had just
travelled 14%. A band that wide is a region, not a trigger.

They are a REFINEMENT and are **never scored**. `Z`, the score, `position` and
the bull/bear triggers all stay daily — a score has to keep the meaning it had
on every earlier board, and a trigger has to quote a level that survives a
session. Two caps keep them honest, both in the extractor: age is the frame's
own structure window (`MAX_ZONE_AGE_4H = STRUCT_LOOKBACK['h4']`, so the zones
and the 4H verdict beside them read the same stretch of tape), and distance is
`MAX_ZONE_DIST_4H_ATR` **daily ATRs** from price — the unit the rest of the
board reasons in, so one constant works on a $5 ticker and a $1,250 one. A row
with no intraday read, or nothing inside those caps, carries the fields ABSENT
rather than empty: "nobody looked" and "the 4H frame found nothing" are
different statements, and PLTR is currently the second.

A row with no 4H read — a ticker's first generated row, before anyone has
written one — shows an italic muted `h4Note` placeholder rather than prose. That is deliberate: styling absent evidence like
evidence is the same error as rendering an unscored row as 0.

Row ORDER is best longs at the top, best shorts at the bottom — one continuous
axis, keyed by `order_key()` in `tools/structure.py` (direction from the row's
own verdict, then `2W + D + 0.5H + Z` descending, then ticker). **File order IS
the order**: `script.js` and `tsv.js` both render `rows` as written, so nothing
re-sorts downstream. Never hand-reorder — change the key and re-emit, or the
next bot run undoes it. `tools/check_board_order.py` fails a board that is out
of key order, and also fails if `lean()` in the extractor drifts from
`boardLean()` in `script.js` (they decide the same thing: which block a row
sorts into, and which colour it is tinted).

`BOARD.updated` must equal the newest row `date` — also CI-checked, after five
single-ticker additions in a row each left it behind.

## Stock tile data model

Each `STOCKS` entry: `symbol`, `exchange`, `price` (freeform label), `change`,
`signal` (one-line thesis), `side` (`long` | `short`, the setup direction — colors
the chip green/red), and `story` (path to the slideshow HTML).

**⚠️ `signal` is the CURRENT read, and a refresh REPLACES it** — the same
accretion rule the trend-meter note has, because `signal` caught the same
disease at twenty times the size: by 2026-08-06 the 36 signals had grown to
349k characters (76% of `data.js`, SNDK alone 17k) from each refresh
PREPENDING its session narrative on top of the last one. Git history is the
archive — every prior state of every signal is a commit — so nothing needs
carrying forward in the field. One dated `📅 CLOSE dd/mm` block (plus a 🌙
AH/intraday lead-in from the same session) is a current read; a second dated
block is a journal, and the audit flags it. Same rule for `lead.edge`:
no `||`-separated history. The current read itself has a budget — **under
~700 characters**, audit-checked — because the tile renders `signal` raw as
one `<p>`, and even single-session blocks had grown to 4.7k characters of
OHLC detail and indicator lists. The stance, the decisive levels, the plan
and the falsifier fit in 700; the evidence belongs in the deck. Tile glow colours
are auto-varied across the grid, so `accent` is optional.

`date` (ISO `YYYY-MM-DD`) is the tile's "Опубліковано" label **and** the
gallery sort key (newest first). ALWAYS bump `date` to the current date
whenever you refresh a card — new close, pre-market move, thesis change, any
edit to `price`/`change`/`signal`/`lead`. Refreshing the numbers without
bumping `date` leaves the tile mis-dated and mis-sorted; treat the date bump
as part of every refresh, not an afterthought.

`exchange` is the listing VENUE only (`NASDAQ` / `NYSE` / `CBOE`) — it renders
as the small label beside the ticker. It sits right before `change` in every
entry, which makes it easy to paste a close narrative into by accident; that
both wrecks the tile and leaves the real `change` a session stale. The audit
checks it.

An entry may also carry a `lead` object (`{ rank, status?, entry, stop, targets,
tail?, rr, edge, tagged?, closed? }`). `tagged` records the deepest
target actually realised (set it the day the target TRADES — an intraday touch
counts and a close over the level is NOT required; it survives the price
squeezing back above it). ⚠️ But it presupposes a FILL: a target traded on an
UNFILLED plan — one the SMH gate blocked, say — is not realised and must not
be tagged. Record what the forgone exit was worth in prose instead. On
2026-08-03 four T1s traded on gated plans and none was tagged, correctly;
the first write-up withheld them on the wrong ground (that the close came
back under the level), which is not the test. `closed` records the exit of a
stopped/closed trade. The "Booked at targets" strip is a LEDGER of realised
results computed from these: wins score at `tagged` (or the deepest target the
current price has reached), closed trades score at `closed` — including
losses, which render as red ⛔ chips and stay on the strip by design. Entries with a `lead` render as rows in the
"Sharpest trades" ranking table above the gallery — long or short, ordered by
`rank`, no cap; names without a clean directional edge simply omit `lead`. The
whole table hides itself when nothing is ranked. This keeps the leaderboard in
sync with the cards — it's built from `data.js`, not hand-written HTML.

**`rank` is hand-set, so it needs a stated key or it drifts into nonsense.** It
had: on 2026-08-07 the best open position on the board (NBIS, +15.2%) sat at 15
below eight waiting plans, and ranks 4–10 held seven waiting longs whose
distance-to-fill ran 1.99, 1.54, 0.24, 0.68, 0.43, 0.57, 0.14 ATR — very nearly
backwards. Nothing was wrong with any individual number; there was simply no key,
so each refresh appended and none re-sorted. The key is four blocks, and a
refresh places a card in its block rather than at the end:

1. **Held positions**, by realised progress — the setup is proven, so the
   ordering is what it has actually produced.
2. **Live but unfilled** — the rejection printed and price is beyond the zone,
   ordered by the reward still on the table.
3. **Waiting plans**, by distance to fill in ATR, R:R breaking ties. Reachability
   leads because a plan price cannot reach produces nothing, whatever its R:R.
4. **Booked**, parked last. `script.js` filters `status: 'booked'` out of the
   table, so the number is inert — but do NOT delete the field to express that.
   The sort reads `(a.lead.rank || 0)`, so a missing rank sorts FIRST, and a
   booked trade that ever went live again would jump to the top of the board.

`lead.edge` (the one-line why-this-trade) renders on the stock **tile**, not in
the table — the table carries only the numeric plan.

**⚠️ STANCE — the SMH gate is CLEARED, so longs are live (2026-08-07):** the
July short cycle closed on 07-31 and the board was re-entered from a clean
slate; that cycle's results are archived in the comment block above `STOCKS`
in `data.js` (history only, nothing renders). The re-entry is DONE — leads
exist, and the ranking table and booked strip both render again.

The gate this block used to wait on has been taken. SMH has closed over
**$547–550 for a fourth session** and cleared the **$580 lid on 08-07** at
$582.70, printing a new month high $586.09. The "go long only once the uptrend
is confirmed" condition is therefore SATISFIED, and the stance is **take every
long fill**: a plan that reaches its entry zone is taken, not re-argued against
the regime one name at a time.

⚠️ Which makes the OFF-SWITCH the thing to keep current, because "buy
everything that fills" without one is a mood, not a rule. It is SMH's own
ladder, in order: a daily close back under **$580** undoes the breakout; under
**$572.82** loses the weekly 9-EMA; under **$570.40** loses the 50-day; under
**$547–550** re-opens the whole question; under **$535** voids the reclaim and
re-arms shorts. Those numbers live in `MARKET.markets[SMH].levels.invalidate`
— keep this paragraph in step with that field, never the other way round.

⚠️ "Every fill" is a STANCE, not a sizing instruction, and only the stance
changed. The board's own `direction.groups` calls ALOY/MP/USAR/UUUU **"one
position, not three"**; on a −1 ATR session **13 of the 16 waiting longs fill on
the same bar**, and 11 of the 21 resulting longs are semis. Position COUNT is
not diversification here — take every fill, and size them as the handful of
independent bets they actually are.

And still **keep shorts where an individual setup warrants one** — the board is
mixed by design, `side` set per card, not longs-only.

Ranked entries also render a computed **progress line** (tile) and a
**Progress** column (table): earned-% since entry (only when `lead.entry`
contains "filled" — unfilled plans count 0), full-plan % from the entry-zone
midpoint to the deepest target, and % left from the current `price`. All three
are parsed live from `lead.entry` / `lead.targets` / `price` by
`planProgress()` in `script.js` — never hand-written, so keep those fields
numeric-parseable.

**Everything derivable IS derived — do not add these fields back.** Two numbers
used to be typed into each `lead` and drifted constantly, so they are computed
in `script.js` now, from the same `entry`/`targets`/`price` the rest of the
board parses:

- the **Move** column = entry-zone midpoint → deepest target, signed by the
  price direction (longs +, shorts −) — the old `downside` field. It is the
  same definition the `rr` quotes, so the two columns describe one plan;
  Progress separately answers "where are we now".
- the **R:R asterisk** = price is outside the entry zone (`priceInZone()`) —
  the old `rrStar` flag.

`lead.downside` survives only as a fallback for a plan whose numbers cannot be
parsed. `status` stays hand-set on purpose: a short that has already been
rejected and is working below its zone is legitimately `'live'`, which geometry
alone cannot tell you.

## Refreshing a card from charts

`docs/ta-analysis-prompt.md` is the reusable prompt for turning chart screenshots
into a ready-to-paste `STOCKS` entry. It encodes the extraction checklist (incl.
the crosshair-vs-right-axis-pill gotcha), the demand/structure/frame/confluence
classification, the entry-type rules (held retest for proven demand,
confirmation-only for unproven, rejection-only for shorts), the `lead` field
contract — notably that `entry` must be numeric-clean because `planProgress()`
parses every digit in it — and a self-check covering stop placement, target
ordering, recomputed R:R, `status`, the venue in `exchange`, and the deck's own
`now` rung.

**Verify the crosshair BEFORE reading any value off a chart.** On 2026-08-04,
NINE of nine charts in one session carried legends showing crosshair values parked
on older bars — detectable two ways: the legend `C` did not tie the header close,
and two legend highs exceeded their ticker's actual session high (impossible for
the current bar). Current values are the RIGHT-AXIS pills. The error is not
marginal: INTC's legend read RSI 53.09 / Stoch 26.82 against an actual
69.74 / 94.61, and SMH's legend RSI 29.93 against 70.28 — a 40-point miss in the
decision-relevant direction. So: tie the legend `C` to the header close first, and
if it does not tie, discard the whole legend row rather than any single value.

**Then run the audit** — it is the mechanical half of that self-check and needs
no network:

```bash
python3 tools/refresh.py --audit-only   # or ./update_prices.sh --audit-only
```

It flags a stop at/inside the entry zone, an R:R that does not recompute, a
`status` that contradicts the price, a non-venue `exchange`, a deck ladder whose
`now` rung has fallen behind its card, a missing story file, and a bad or
future `date`. A full run (no flag) fetches OHLCV and adds price/indicator
drift. Finish a refresh with a clean audit, or with a note saying why a finding
is deliberate.

**"Was the zone reached?" is arithmetic, not a paraphrase** — compare the
session's actual high/low against the zone's numeric bounds (`high >= zoneLow`
for a short's rejection zone, `low <= zoneHigh` for a long's dip zone), not a
remembered impression of "close to it." CRWV's $78.50 print against an
"$78–81" zone and IREN's $40.81 against a redrawn "$40.8–44" floor were both
*inside* by every arithmetic reading, yet both got written up as "never
reached" — a wrong tag comparison, not a data problem. Re-verify with the
actual numbers before writing "not reached" anywhere, on a card or a deck.

**When a zone truly isn't reached, redraw it to where the print actually
happened — don't loosen the tagged/not-tagged test.** IREN is the pattern:
the original $41.70–44 zone (a real confluence: old flip line + 1H upper band
+ 200-day + mid-band) never printed, so the entry was redrawn to $40.80,
where supply actually showed up — "a zone price cannot reach is not a plan."
That keeps the entry priced at genuine resistance/support instead of
manufacturing a fill with a tolerance band, which would just mean selling
short closer to the average price instead of the top of a real rejection.

## One session is not a structure

Two ranked decisions in three sessions rested on a single session's
relative-performance split, and BOTH were falsified by the next bar. This is the
board's most expensive recurring error, so it gets a rule instead of a third
retraction.

- **2026-07-31** partitioned the board into HELD (WDC +2.21% · STX +0.52% ·
  AMAT +1.18% · LITE +2.99% · ALAB +3.85%) and BROKE (MU −5.90% · SNDK −5.09% ·
  DRAM −3.76%), then ranked HDD above DRAM/NAND on that evidence. On 08-03 the
  two hardest holds were the board's ONLY decliners and every breaker closed
  green.
- **2026-08-03** read "the heavyweights are flat, so this is narrow
  short-covering" and promoted INTC to top short for not participating (+0.89%
  against a shorts-average of +8.19%). In 08-04 pre-market INTC was +3.45%, STX
  +2.64% and MRVL +5.84% — the non-participants led.

**THE RULE.** A single session's relative-performance split — who held vs who
broke, who participated vs who sat out, which cohort led — is an OBSERVATION. It
may never by itself set a rank, a promotion, or a `side`. To carry rank weight it
needs one of:

1. the SAME split across two or more consecutive sessions, or
2. an independent NON-PRICE corroborator — money-flow direction, a level
   reclaimed or lost on a close, a frame that actually changed.

Write it as what it is: "on 08-03 the heavyweights lagged", never "the
heavyweights are the weak cohort". And when a rank does rest on such a split, the
card must name what would falsify it — that is the only reason both errors above
were caught within a session instead of compounding into the ranks for weeks.

⚠️ The corollary, which applies to the most quotable sentences on this board: a
claim of the form "X is the ONLY name that Y" ages in ONE bar. Write it anyway —
it is checkable, which is its value — but write it with its own expiry attached.

## Zones: anchor, then width

Eight short zones were drawn in the week of 2026-08-03 and the split is total —
four blown clean through, four working. Two plausible explanations were tested
against the data and BOTH failed, so the surviving one is written down here.

**Rejected: "low zones fail."** Distance above price when drawn does not sort
them — the outcomes interleave (+1.7% ASTS blown, +2.6% CRWV working, +8.7% CRWV
blown, +8.0% AAOI working, +11.8% COHR working).

**Rejected: "it is a high-beta effect."** AAOI and CRWV each appear on BOTH sides
of the split — same stock, same week, same beta, one zone blown and one working.
The variable cannot be the stock.

**What does sort them, 4/4 against 4/4 — the ANCHOR:**

| anchored to | zones | outcome |
|---|---|---|
| where the last rejection PRINTED | AAOI $101–102 · ASTS $60–62 · CRWV $78–81 · GLW $141–147 | **all four blown through** |
| two or more independent structural references | COHR $294–313 (teal + wk 9-EMA + 50d) · SNDK $1,287–1,346 (wk 21-MA + wk 9-EMA) · AAOI $119–127 (wk 9-EMA + 50-EMA) · CRWV $88–97 (50-EMA + 200-EMA) | **all four working** |

**RULE A — LOCATION.** A zone must be anchored to at least TWO independent
structural references: moving averages on a completed frame, prior-period
extremes, band edges. A zone drawn at *where the print happened* is not a level,
it is a memory of one bar, and in a trending tape price walks through it. Name
the references in the card so the anchor is checkable. ⚠️ Note this REVERSES the
IREN precedent's wording ("redraw it to where the print actually happened") — that
instruction was right to move a zone off an unreachable level and wrong about
where to move it TO. Move it to the nearest confluence, not to the print.

**RULE B — WIDTH AND STOP, in ATR units, which is where volatility belongs.** The
stop must sit at least **1 ATR** from the entry midpoint, using `atrPct` from the
structure board. Below that it is taken out by an ordinary day rather than by
being wrong. As of 2026-08-04 four of six measurable ranked plans failed this:
MRVL 0.45 ATR, TSLA 0.57, INTC 0.57, META 0.75. A tighter stop is allowed only if
the card states the trade-off outright and quotes the ATR-proof alternative —
GLW's card is the model ("still only 0.54 ATR, and that is a deliberate choice…
if you want a stop the ATR cannot reach, it is $156 and the R:R is ~1.8:1").

⚠️ **Rule B is an ENTRY filter and must not be pointed at a held position.** Read
literally ("the stop must sit 1 ATR from the entry midpoint") it would tell you to
WIDEN the stop on a position that is already winning, which is backwards. For a
FILLED trade the test is cushion from CURRENT price and the action is trailing UP:

| | fill | stop | ATR from FILL | ATR from PRICE NOW |
|---|---|---|---|---|
| TSLA | $307 | $297 | 0.59 ✗ | **1.49 ✓** |
| META | $535 | $515 | 0.79 ✗ | **2.99 ✓** |
| DELL | $406 | $393 | 0.47 ✗ | **1.32 ✓** |

All three failed the entry test and all three now carry more than 1 ATR of live
cushion, so there was nothing to fix — the failing numbers were history. Widening
them would have cost real edge for nothing: TSLA 5.8:1 → 2.2:1 at the structural
level, DELL 4.3:1 → 2.0:1. The corollary is the useful half: a stop can be too FAR
as well as too near. META sat 2.99 ATR below price, i.e. risking 3.7% back to the
fill when 1.00 ATR ($565) would still be outside noise and lock +5.6%.

⚠️ This is also the honest answer to "should high-beta names have their own rule":
no. Express every stop in ATR units and the difference handles itself — a 3% stop
is 0.55 ATR on MRVL and 0.66 ATR on META, and those are different trades. A
per-name category would need maintaining; a ratio does not.

## Earnings: three sessions before a move

**No new position on a name until the THIRD session after its earnings
reaction.** The reaction bar is day 0; for AXON's −14.28% session on
2026-08-06 that makes 08-07 and 08-10 pass and **08-11** the first actionable
one. The levels stay live and keep being refreshed throughout — the gate
governs WHEN a plan may be taken, not what the plan is.

The reason is that an earnings bar breaks the three things every rule on this
board is measured in, all at once:

- **Structure.** The reaction bar's own extremes get read as pivots. AXON's 4H
  frame printed a "higher high" at $628.22 — the wick of the very bar that then
  closed −14.28% — and the frame read bullish on it.
- **Zones.** A gap leaves no traded bars behind it, so the displacement rules
  find nothing where the move actually happened. PLTR gapped $125.91 → $145.15
  and has no 4H level between ~$137 and $145 to this day.
- **ATR.** Every stop on this board is priced in ATR units (Rule B), and ATR(14)
  is still quoting the pre-earnings regime for a fortnight after the gap.

Three sessions is what it takes for a swing to CONFIRM — two bars either side —
so the gate is really "wait until there is structure to trade", expressed as a
date because a date is checkable.

**Identifying the reaction bar needs no calendar feed** — it is an outsized move
on a volume spike at the quarterly cadence, and that is checkable in the bars
this repo already fetches. AXON's 08-06 is −14.28% on 2.7× median volume, 70
days after 05-28 (+12.27%, 2.1×) and a year on from 2025-08-05 (+16.41%, 3.1×).
Do the cadence check rather than hedging about whether a −14% day was earnings:
one is evidence, the other is a caveat nobody can act on.

On the structure board the gate goes in `preferred` **with its expiry date**
(`**Stand aside to 08-11** — post-earnings`), which also moves the row into the
flat block where a stand-aside row belongs, and the reasoning goes in the row's
`note`. A dated gate expires by itself, and that is the point: on the morning it
lapses `preferred` needs rewriting to the row's real stance, not leaving to read
stale.

## Adding a stock

1. Author `stories/<symbol>.html` (copy an existing story as a template).
2. Add an entry to `STOCKS` in `data.js` pointing `story` at that file.

No build step is needed locally — open `index.html`. Stories are plain static
HTML and are copied verbatim by the deploy workflow.

## Articles (long-form)

Besides tap-through decks, the gallery also renders written articles: entries in
the `ARTICLES` array in `data.js` with `type: 'article'`. They share the same
tile grid, deep-link hash, and overlay iframe, but a) render a distinct article
tile (`kicker`, `tag`, `title`, `excerpt`, `readTime`) and b) open a single
scrolling, responsive one-page read instead of a slideshow. Article pages live
in `stories/articles/` (self-contained HTML + any embedded images) and use
`symbol` as their URL slug (`index.html#<symbol>`). To add one: author
`stories/articles/<slug>.html` and add an `ARTICLES` entry pointing `story` at
it. Precache new article files in `sw.js` (and bump `CACHE_NAME`).

## Deploy

`.github/workflows/deploy.yml` runs on push to `main`: minifies HTML/CSS/JS,
copies `stories/` and icons into `dist/`, and publishes to GitHub Pages. All
asset paths are relative so the site works from `/<repo>/`.
