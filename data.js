// ── Stocks ──────────────────────────────────────────────────────────────────
// Each entry renders one tile in the gallery. Clicking a tile opens its
// interactive story — a self-contained HTML slideshow living in /stories.
//
// Fields:
//   symbol     ticker shown on the tile
//   exchange   listing venue (NASDAQ, NYSE, …)
//   price      last-price label, freeform string (e.g. '$175.18')
//   change     short change label (e.g. '+2% today') or null
//   signal     one-line thesis shown on the tile
//   side       'long' | 'short'             → setup direction; colors the tile chip
//   lead       (optional) leaderboard row: { rank, entry, stop, targets,
//              downside, tail?, rr, rrStar?, edge } — entries with a `lead`
//              render in the "Sharpest shorts" table, ordered by rank
//   accent     (optional) tile glow colour — the gallery now auto-varies tile
//              colours across the grid, so this field is no longer required
//   date       ISO date the plan was posted (YYYY-MM-DD) — gallery sorts newest first
//   story      path to the interactive presentation HTML
//
// To add a stock: drop its story at stories/<symbol>.html and add an entry here.
const STOCKS = [
  {
    symbol: 'AAOI', exchange: 'NASDAQ',
    price: '$113.00', change: '−1.24% · Jul 8',
    signal: 'Stabilizing on support — the plunge from ~$212 is resting just above the $101–105 shelf / 4h lower band ($104), −1.2% to $113 with MACD flattening; still under the whole MA stack, so fade bounces into $121–130 (21-EMA/mid-band → 50-day); lose $101 → $90–96 then $74; reclaim $134 repairs it',
    side: 'short', accent: 'violet',
    date: '2026-07-08',
    story: 'stories/aaoi.html',
  },
  {
    symbol: 'WDC', exchange: 'NASDAQ',
    price: '$536.93', change: '+0.91% · Jul 8',
    signal: 'Oversold bounce off support — held the $527 lower band, +0.9% to $537 but still pinned under the 10/21-EMA and 200-EMA stack; short the failed bounce into $560–592, targets $500 → $465 → $440; lose $527 → $500 fast; reclaim $606 negates',
    lead: { rank: 6, entry: '$560–592', stop: '$606', targets: '$500 → $465 → $440', downside: '−22%', rr: '2.4:1', edge: 'Bounce into the MA stack = re-short' },
    side: 'short',
    date: '2026-07-08',
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$107.61', change: '−2.52% · Jul 8',
    signal: 'Grinding to target — lost the 50-day, now $108 (−2.5%) a hair above the 4h lower band $104 and closing on T1 $101; RSI 26 / Stoch −66 deeply oversold so no chase; fade the bounce into $112–116, lose $103 → $101 → $94 → $86; reclaim $123–126 repairs it',
    lead: { rank: 5, entry: '$112–116', stop: '$124', targets: '$101 → $94 → $86', downside: '−25%', tail: '−39%', rr: '2.6:1', edge: 'Cleanest break; nearly at T1' },
    side: 'short', accent: 'blue',
    date: '2026-07-08',
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$946.54', change: '+0.87% · Jul 8',
    signal: 'Oversold bounce — reclaimed the 4h 200-EMA $936, +0.9% to $947 with MACD ticking up off the $920 support; bounce not trend, short the failed push into $967–1,015 (BB mid / 21-EMA); below $920 → $860 → $810 → $675; reclaim $1,050 flips it',
    lead: { rank: 2, entry: '$967–1,015', stop: '$1,050', targets: '$860 → $810 → $675', downside: '−31%', rr: '2.1:1', edge: 'Most extended → furthest to fall' },
    side: 'short', accent: 'cyan',
    date: '2026-07-08',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$349.08', change: '+1.74% · Jul 8',
    signal: 'Oversold bounce off the 50-day — blow-off from $494 found the daily 50-day $337 / $345 lower band and turned up +1.7% to $349; RSI still ~33, deep under the MA stack; fade the bounce into $383–393 (50-day/200-EMA), bias down; targets $318 → $300 → $260',
    lead: { rank: 1, entry: '$383–393', stop: '$402', targets: '$318 → $300 → $260', downside: '−32%', rr: '~9:1', rrStar: true, edge: 'Blow-off bouncing off the 50-day' },
    side: 'short', accent: 'blue',
    date: '2026-07-08',
    story: 'stories/ter.html',
  },
  {
    symbol: 'GLW', exchange: 'NYSE',
    price: '$183.25', change: '−1.15% · Jul 8',
    signal: 'Churning at T1 — chopping around $183 just above T1 $180, capped by the 4h 200-EMA $193; RSI 33 / Stoch −62 oversold but no reclaim; fade bounces into $193–205 (200-EMA → 50-day); lose $180 → $167 → $150; reclaim $217 negates',
    lead: { rank: 4, entry: '$193–205', stop: '$217', targets: '$180 → $167 → $150', downside: '−25%', rr: '2.4:1', edge: 'Capped by the 200-EMA; fade the bounce' },
    side: 'short', accent: 'blue',
    date: '2026-07-08',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,727', change: '+6.77% · Jul 8',
    signal: 'Powerful close into the 200-day — ripped +6.77% to close $1,727 (AH $1,736), right into the rising daily 200-day and the $1,733–1,850 re-short zone; fade a rejection here for $1,544 → $1,420 → $1,394, but a daily close/hold above $1,750 reclaims the 200-day and opens a squeeze to the 50-day $1,915 — respect it',
    lead: { rank: 7, entry: '$1,733–1,850', stop: '$1,900', targets: '$1,544 → $1,420 → $1,394', downside: '−22%', rr: '~3:1', edge: 'Fade the 200-day rejection — but a strong close' },
    side: 'short', accent: 'red',
    date: '2026-07-08',
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$591.87', change: '+1.79% · Jul 8',
    signal: 'Sector barometer bouncing — +1.8% off the $582 weekly-low pivot to $592, but still capped under $599–608 (BB mid / 50-day) with the daily bear cross intact; reclaim $599 relieves it, lose $565 → $533 → $500; drags all semis',
    side: 'short', accent: 'cyan',
    date: '2026-07-08',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$881.98', change: '+2.55% · Jul 8',
    signal: 'Confirmed bounce — double-bottom breakout, reclaimed and holding $880 (+2.6% into the close, pre-mkt $884); daily Stoch turning up from oversold, 4h MACD bullish cross, OBV never broke down, weekly trend intact; add $850–870 on a hold, targets $934–950 (200-day) → $1,015+ → $1,107–1,120; trim on a daily close below $850, out below $795 — and watch SMH to confirm',
    side: 'long', accent: 'emerald',
    date: '2026-07-08',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$75.12', change: '+1.22% · Jul 8',
    signal: 'Long stopped, clinging to $75 — the $76 trigger broke (dipped toward $70) but bounced +1.2% to $75; still below the $80 base and the whole MA stack (RSI 40, Stoch −63 oversold); reclaim $80 → $86 to repair, lose $70 → $66–69 then $57–60',
    side: 'long', accent: 'violet',
    date: '2026-07-08',
    story: 'stories/asts.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$214.98', change: '+10.14% · Jul 8',
    signal: 'Ripped into the re-short zone — +10% to $215 straight back into the $212–217 supply, capped by the 4h 200-EMA $225; short the failed bounce, stop $233; below $200 → $192 → $174 → $157; reclaim $233 negates',
    lead: { rank: 3, entry: '$215–225', stop: '$233', targets: '$192 → $174 → $157', downside: '−29%', rr: '4:1', edge: 'Bounced back into the re-short zone' },
    side: 'short', accent: 'indigo',
    date: '2026-07-08',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$569.34', change: '+2.68% · Jul 8',
    signal: 'Blow-off unwinding, bouncing — +2.7% to $569 off the rising 200-day $525; still capped under the 21/50-day, re-short the bounce into $580–595; targets $525 → $510 → $470; reclaim $620 negates',
    side: 'short', accent: 'red',
    date: '2026-07-08',
    story: 'stories/amat.html',
  },
  {
    symbol: 'BE', exchange: 'NYSE',
    price: '$250.30', change: '−7.14% · Jul 8',
    signal: 'Short paying — shooting star from $320 now $250 (−7.1%), tagged T1 $252 (daily 50-day) and sitting on the 4h lower band $246; RSI 37 not yet washed out, so bank partial, break $246 opens $236 → $225; re-short bounces into $264–277 (10-EMA/200-EMA/BB mid), invalid above $305',
    side: 'short', accent: 'amber',
    date: '2026-07-08',
    story: 'stories/be.html',
  },
];

// ── Articles ──────────────────────────────────────────────────────────────
// Long-form written pieces (not tap-through decks). Each renders as an article
// tile in the same gallery and opens as a single, responsive one-page read.
//
// Fields:
//   type     'article' (marks the tile + overlay as a scrolling article)
//   symbol   slug used for the shareable URL hash (index.html#<symbol>)
//   kicker   small eyebrow label on the tile
//   tag      chip label (topic)
//   title    headline shown on the tile
//   excerpt  one-paragraph teaser
//   readTime freeform read-length label (e.g. '8 хв')
//   accent   'purple' | 'blue' | 'amber' | 'emerald' | 'red' | 'cyan' | 'indigo' | 'violet'
//   date     ISO date (YYYY-MM-DD) — gallery sorts newest first
//   story    path to the article HTML
const ARTICLES = [
  {
    type: 'article',
    symbol: 'ai-dumping',
    kicker: 'Стаття',
    tag: 'AI · Волл-стріт',
    title: 'Демпінг інтелекту',
    excerpt: 'Китай демпінгує не сталь, а інтелект. Дешеві open-weight моделі підривають логіку оцінки всього AI-трейду — від Nvidia до пам’яті, сховища й дата-центрів. Хто в епіцентрі та яким каналом їх б’є.',
    readTime: '10 хв',
    accent: 'violet',
    date: '2026-07-05',
    story: 'stories/articles/ai-dumping.html',
  },
];
