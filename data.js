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
//   date       ISO date the plan was posted (YYYY-MM-DD) — gallery sorts newest first
//   story      path to the interactive presentation HTML
//
// To add a stock: drop its story at stories/<symbol>.html and add an entry here.
const STOCKS = [
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '~$86', change: '+30% off the $66 low',
    signal: 'Bounce done — now a breakout bet; $107 is the wall',
    verdict: 'caution', accent: 'purple',
    date: '2026-07-03',
    story: 'stories/asts.html',
  },
  {
    symbol: 'SEZL', exchange: 'NASDAQ',
    price: '$175.18', change: '+2% today',
    signal: 'Wait for the pullback — don’t chase',
    verdict: 'caution', accent: 'purple',
    date: '2026-06-27',
    story: 'stories/sezl.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '~$229', change: '−17% · Jul 1',
    signal: 'Wait for oversold + a reversal — don’t catch the knife',
    verdict: 'caution', accent: 'pink',
    date: '2026-07-01',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$650.91', change: '−9.97% · Jul 1',
    signal: 'Overextended · HOLD — fair value ~$430; wait for the pullback',
    verdict: 'caution', accent: 'purple',
    date: '2026-07-02',
    story: 'stories/amat.html',
  },
];
