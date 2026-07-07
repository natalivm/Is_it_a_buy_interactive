# Is It a BUY interactive

A static, single-page web app: a gallery of stock tiles where each tile opens
an interactive "story" — a tap-through slideshow that walks you through the
trade thesis for that stock (the setup, the risk, the reward, and the smart
move right now).

## Files

- `index.html` — page shell: gallery grid + full-screen story overlay
- `styles.css` — dark purple/pink theme and tile styling
- `script.js` — renders tiles from `STOCKS` and opens each story in an iframe overlay
- `data.js` — the `STOCKS` array (the only file you edit by hand to add tiles)
- `stories/` — one self-contained HTML slideshow per stock (e.g. `stories/sezl.html`)
- `manifest.json`, `sw.js`, `icon-*` — PWA/offline support
- `fetch_setups.py`, `prices.js`, `requirements.txt` — legacy price fetcher, no
  longer used by the gallery (kept for reference)

## Add a stock

1. Create the story slideshow at `stories/<symbol>.html`. Use an existing story
   (e.g. `stories/sezl.html`) as a template — each is a fully self-contained
   HTML file with its own styles and tap/swipe navigation.
2. Add an entry to `STOCKS` in `data.js`:

   ```js
   {
     symbol: 'SEZL', exchange: 'NASDAQ',
     price: '$175.18', change: '+2% today',
     signal: 'Buy the pullback — don’t chase',
     side: 'long',              // 'long' | 'short'  → setup direction, tile chip color
     accent: 'purple',          // 'purple' | 'pink'            → tile accent
     story: 'stories/sezl.html',
   }
   ```
3. Open `index.html`. The tile appears in the gallery; clicking it opens the
   story in a full-screen overlay (Esc or the ✕ closes it).

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml`, which minifies the
assets, copies `stories/` verbatim, and publishes to GitHub Pages. Paths are
relative, so the site works from any project subpath
(`https://<user>.github.io/<repo>/`).
