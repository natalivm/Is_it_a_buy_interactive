# Is It a BUY interactive

Single-page static web app: a gallery of stock tiles, each opening an
interactive tap-through "story" that explains the trade thesis for that stock.

## Architecture

- `data.js` — hand-edited `STOCKS` array (one entry per tile)
- `script.js` — renders tiles from `STOCKS` and opens each stock's story in a
  full-screen iframe overlay
- `styles.css` — dark purple/pink theme; 3-per-row responsive tile grid
- `stories/` — one self-contained HTML slideshow per stock (own styles + tap/
  swipe navigation, no shared dependencies)
- `index.html` — shell: navbar, intro, `#gallery` grid, `#storyOverlay` modal
- `manifest.json` / `sw.js` — PWA + offline caching (bump `CACHE_NAME` in
  `sw.js` on releases; the deploy workflow rewrites it to the commit hash)
- `fetch_setups.py` / `prices.js` — legacy OHLC fetcher, no longer used by the
  gallery; `prices.js` is an empty stub

## Stock tile data model

Each `STOCKS` entry: `symbol`, `exchange`, `price` (freeform label), `change`,
`signal` (one-line thesis), `side` (`long` | `short`, the setup direction — colors
the chip green/red), and `story` (path to the slideshow HTML). Tile glow colours
are auto-varied across the grid, so `accent` is optional.

An entry may also carry a `lead` object (`{ rank, entry, stop, targets, downside,
tail?, rr, rrStar?, edge }`). Entries with a `lead` render as rows in the
"Sharpest shorts" ranking table above the gallery (ordered by `rank`); the whole
table hides itself when nothing is ranked. This keeps the leaderboard in sync
with the cards — it's built from `data.js`, not hand-written HTML.

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
