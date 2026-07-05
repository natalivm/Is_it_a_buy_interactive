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
    symbol: 'GLW', exchange: 'NYSE',
    price: '$196.79', change: '−10.81% · Jul 2',
    signal: 'Weekly blow-off rejection — huge upper wick, close near the low; relief bounce likely but sold, bias down unless it reclaims $217–220; targets $180 → $167 → $150',
    verdict: 'avoid', accent: 'blue',
    date: '2026-07-04',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,715', change: '$1,731 lost · Jul 3',
    signal: 'Sector memory rout, not SNDK — $1,731 lost, descent underway; fade bounces into $1,850–1,945, buy only the fib flush at $1,394–1,420',
    verdict: 'caution', accent: 'red',
    date: '2026-07-03',
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$592.29', change: '−4.54% · Jul 2',
    signal: 'Sector barometer rolling over — weekly rejection + daily bear cross; bias down under $599, targets $533 → $500; drags all semis',
    verdict: 'caution', accent: 'cyan',
    date: '2026-07-03',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$820.16', change: '−10.38% · Jul 2',
    signal: 'Blow-off top from ~$1,000 — weekly rejection, daily broke the 50-day; bias down under $875, targets $795 → $778 → $648',
    verdict: 'avoid', accent: 'amber',
    date: '2026-07-03',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$85.13', change: '−1.13% · Jul 2',
    signal: 'Coiling base — uptrend intact above $80; long the base, add on breakout > $92; targets $101 → $125',
    verdict: 'caution', accent: 'violet',
    date: '2026-07-03',
    story: 'stories/asts.html',
  },
  {
    symbol: 'SEZL', exchange: 'NASDAQ',
    price: '$183.24', change: '+4.60% · Jul 2',
    signal: 'Parabolic but overbought (RSI 84) — don’t chase $183; buy the $178–180 pullback, targets $200+',
    verdict: 'caution', accent: 'emerald',
    date: '2026-07-03',
    story: 'stories/sezl.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$215.62', change: '−5.92% · Jul 2',
    signal: 'On the $215 50-day support, 4h deeply oversold — long the hold to $230/$249; lose $215 → $200',
    verdict: 'caution', accent: 'indigo',
    date: '2026-07-03',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$603.04', change: '−7.35% · Jul 2',
    signal: 'Blow-off top (spike $739, closed −18%) — fade bounces into $640–672; targets $555 → $510 → $470',
    verdict: 'avoid', accent: 'red',
    date: '2026-07-03',
    story: 'stories/amat.html',
  },
  {
    symbol: 'BE', exchange: 'NYSE',
    price: '$270.89', change: '−6.43% · Jul 2',
    signal: 'Weekly shooting star from $320 — re-short the bounce into $279–288 (dies above $312); targets $251 → $225',
    verdict: 'avoid', accent: 'amber',
    date: '2026-07-03',
    story: 'stories/be.html',
  },
];
