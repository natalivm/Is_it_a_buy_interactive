// ── Stocks ──────────────────────────────────────────────────────────────────
// Each entry renders one tile in the gallery. Clicking a tile opens its
// interactive story — a self-contained HTML slideshow living in /stories.
//
// Fields:
//   symbol     ticker shown on the tile
//   exchange   listing venue (NASDAQ, NYSE, …)
//   price      last-price label, freeform string (e.g. '$175.18')
//   change     short change label (e.g. '+2% today') or null
//   signal     one-line verdict shown on the tile
//   verdict    'buy' | 'caution' | 'avoid'  → colors the tile chip
//   accent     'purple' | 'pink'            → tile accent glow
//   story      path to the interactive presentation HTML
//
// To add a stock: drop its story at stories/<symbol>.html and add an entry here.
const STOCKS = [
  {
    symbol: 'SEZL', exchange: 'NASDAQ',
    price: '$175.18', change: '+2% today',
    signal: 'Wait for the pullback — don’t chase',
    verdict: 'caution', accent: 'purple',
    story: 'stories/sezl.html',
  },
];
