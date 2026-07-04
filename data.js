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
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,715', change: '$1,731 lost · Jul 3',
    signal: 'Thesis broken, bias down — wait for the fib flush at $1,394–1,420 to buy; fade bounces into $1,850–1,945',
    verdict: 'caution', accent: 'red',
    date: '2026-07-03',
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$592.29', change: '−4.54% · Jul 2',
    signal: 'Semis sector ETF — rolling over; a deeper leg drags AMAT/STX (direct), then NBIS & momentum names',
    verdict: 'caution', accent: 'indigo',
    date: '2026-07-03',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$820.16', change: '−10.38% · Jul 2',
    signal: '2-sided setup — wait for the $880 reaction: short the rejection or long the reclaim',
    verdict: 'caution', accent: 'cyan',
    date: '2026-07-03',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$85.13', change: '−1.13% · Jul 2',
    signal: 'Base firming, daily turning up — still a breakout bet; $107 is the wall',
    verdict: 'caution', accent: 'emerald',
    date: '2026-07-03',
    story: 'stories/asts.html',
  },
  {
    symbol: 'SEZL', exchange: 'NASDAQ',
    price: '$183.24', change: 'T1 $180 hit · Jul 2',
    signal: 'T1 $180 hit — don’t chase $183; buy the $178–180 pullback, manage if long',
    verdict: 'caution', accent: 'violet',
    date: '2026-07-03',
    story: 'stories/sezl.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$215.62', change: '−5.92% · Jul 2',
    signal: 'At the $215 base, 4h oversold — long the hold to $240; lose $215 → $200–205',
    verdict: 'caution', accent: 'blue',
    date: '2026-07-03',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$603.04', change: '−7.35% · Jul 2',
    signal: 'Momentum flipped — SHORT the failed bounce into $620–650 (not the hole); targets $555/$510/$470',
    verdict: 'avoid', accent: 'amber',
    date: '2026-07-03',
    story: 'stories/amat.html',
  },
  {
    symbol: 'BE', exchange: 'NYSE',
    price: '$270.89', change: '−6.43% · Jul 2',
    signal: 'T1 booked at $260 — now re-short the bounce ($279–286); dies above $312',
    verdict: 'avoid', accent: 'red',
    date: '2026-07-03',
    story: 'stories/be.html',
  },
];
