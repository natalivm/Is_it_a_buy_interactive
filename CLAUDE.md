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
- `index.html` — shell: navbar, intro, `#leaderboard` table, `#gallery` grid,
  `#storyOverlay` modal
- `manifest.json` / `sw.js` — PWA + offline caching (bump `CACHE_NAME` in
  `sw.js` on releases; the deploy workflow rewrites it to the commit hash)

## Deck anatomy (stories/*.html)

Decks share almost everything through `story.css`/`engine.js`; keep them lean:

- **Shared CSS** lives in `stories/story.css` (foundation + the full hoisted
  component system: eyebrow/h1/sub/indi/chart/candle/ladder/tpl/verdict/note/
  nav…). A deck's inline `<style>` holds ONLY its `:root` palette (incl.
  `--sub`, the body-text tint) plus genuinely unique overrides (e.g. the green
  up-riser on long decks, `.rung.key` on AAOI). Never re-add shared rules to a
  deck's inline style.
- **Footer nav is auto-built** by `engine.js`; decks end with just
  `<script src="engine.js"></script><script>createStory();</script>`
  (`createStory()`'s defaults match every deck — pass a cfg object only where
  a deck genuinely diverges).
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

## Stock tile data model

Each `STOCKS` entry: `symbol`, `exchange`, `price` (freeform label), `change`,
`signal` (one-line thesis), `side` (`long` | `short`, the setup direction — colors
the chip green/red), and `story` (path to the slideshow HTML). Tile glow colours
are auto-varied across the grid, so `accent` is optional.

An entry may also carry a `lead` object (`{ rank, entry, stop, targets, downside,
tail?, rr, rrStar?, edge }`). Entries with a `lead` render as rows in the
"Sharpest trades" ranking table above the gallery — long or short, ordered by
`rank`, no cap; names without a clean directional edge simply omit `lead`. The
whole table hides itself when nothing is ranked. This keeps the leaderboard in
sync with the cards — it's built from `data.js`, not hand-written HTML.

Ranked entries also render a computed **progress line** (tile) and a
**Progress** column (table): earned-% since entry (only when `lead.entry`
contains "filled" — unfilled plans count 0), full-plan % from the entry-zone
midpoint to the deepest target, and % left from the current `price`. All three
are parsed live from `lead.entry` / `lead.targets` / `price` by
`planProgress()` in `script.js` — never hand-written, so keep those fields
numeric-parseable.

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
