# Is It a BUY interactive

Single-page static web app: a gallery of stock tiles, each opening an
interactive tap-through "story" that explains the trade thesis for that stock.

## Architecture

- `data.js` — hand-edited `STOCKS` array (one entry per tile)
- `script.js` — renders tiles from `STOCKS` and opens each stock's story in a
  full-screen iframe overlay
- `styles.css` — dark purple/pink theme; 3-per-row responsive tile grid
- `stories/` — one HTML slideshow per stock, driven by the shared
  `stories/story.css` + `stories/engine.js` (see "Deck anatomy" below)
- `index.html` — shell: navbar, intro, `#trendMeter` panel, `#leaderboard`
  table, `#gallery` grid, `#storyOverlay` modal
- `manifest.json` / `sw.js` — PWA + offline caching (bump `CACHE_NAME` in
  `sw.js` on releases; the deploy workflow rewrites it to the commit hash)

## Deck anatomy (stories/*.html)

Decks share almost everything through `story.css`/`engine.js`; keep them lean:

- **Shared CSS** lives in `stories/story.css` (foundation + the full hoisted
  component system: eyebrow/h1/sub/indi/chart/candle/legup/legdn/ladder/tpl/
  verdict/note/nav…). Fonts and `--ink` have shared `:root` defaults there, and
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
- Slide flow per deck: cover/4H → daily candle → relative strength vs SMH →
  levels ladder → plan (entry/stop/targets + a "🎯 Тригер від сьогодні" note
  giving the actionable instruction from the current price).

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
- Bump `updated` (ISO date) on every refresh — it renders as the "as of" label,
  same discipline as a tile's `date`. The section hides itself if `MARKET` is
  missing or no market has usable checks.

## Stock tile data model

Each `STOCKS` entry: `symbol`, `exchange`, `price` (freeform label), `change`,
`signal` (one-line thesis), `side` (`long` | `short`, the setup direction — colors
the chip green/red), and `story` (path to the slideshow HTML). Tile glow colours
are auto-varied across the grid, so `accent` is optional.

`date` (ISO `YYYY-MM-DD`) is the tile's "Опубліковано" label **and** the
gallery sort key (newest first). ALWAYS bump `date` to the current date
whenever you refresh a card — new close, pre-market move, thesis change, any
edit to `price`/`change`/`signal`/`lead`. Refreshing the numbers without
bumping `date` leaves the tile mis-dated and mis-sorted; treat the date bump
as part of every refresh, not an afterthought.

An entry may also carry a `lead` object (`{ rank, entry, stop, targets, downside,
tail?, rr, rrStar?, edge, tagged?, closed? }`). `tagged` records the deepest
target actually realised (set it the day the target trades — it survives the
price squeezing back above the level); `closed` records the exit of a
stopped/closed trade. The "Booked at targets" strip is a LEDGER of realised
results computed from these: wins score at `tagged` (or the deepest target the
current price has reached), closed trades score at `closed` — including
losses, which render as red ⛔ chips and stay on the strip by design. Entries with a `lead` render as rows in the
"Sharpest trades" ranking table above the gallery — long or short, ordered by
`rank`, no cap; names without a clean directional edge simply omit `lead`. The
whole table hides itself when nothing is ranked. This keeps the leaderboard in
sync with the cards — it's built from `data.js`, not hand-written HTML.

`lead.edge` (the one-line why-this-trade) renders on the stock **tile**, not in
the table — the table carries only the numeric plan.

**⚠️ CYCLE RESET — 2026-07-31 (in progress, don't forget):** the July short
cycle is closed and the board started from a clean slate: every `lead` was
removed and the realised-shorts ledger cleared — the closed cycle's results
are archived in the comment block above `STOCKS` in `data.js` (history only,
nothing renders; the ranking table and booked strip hide themselves until new
leads exist). ALL trades are being re-entered now for the new cycle. Stance
for the new plans: **go long only once the uptrend is confirmed** (the gate is
an SMH daily CLOSE over $547–550 — a close back under $535 re-arms shorts),
and **keep shorts where an individual setup still warrants one** — the board
is mixed by design, `side` set per card, not longs-only. Card signals still
describing the old short cycle are stale until their refresh lands.

Ranked entries also render a computed **progress line** (tile) and a
**Progress** column (table): earned-% since entry (only when `lead.entry`
contains "filled" — unfilled plans count 0), full-plan % from the entry-zone
midpoint to the deepest target, and % left from the current `price`. All three
are parsed live from `lead.entry` / `lead.targets` / `price` by
`planProgress()` in `script.js` — never hand-written, so keep those fields
numeric-parseable.

## Refreshing a card from charts

`docs/ta-analysis-prompt.md` is the reusable prompt for turning chart screenshots
into a ready-to-paste `STOCKS` entry. It encodes the extraction checklist (incl.
the crosshair-vs-right-axis-pill gotcha), the demand/structure/frame/confluence
classification, the entry-type rules (held retest for proven demand,
confirmation-only for unproven, rejection-only for shorts), the `lead` field
contract — notably that `entry` must be numeric-clean because `planProgress()`
parses every digit in it — and a self-check covering stop placement, target
ordering, recomputed Move/R:R, and `status`/`rrStar` accuracy.

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
