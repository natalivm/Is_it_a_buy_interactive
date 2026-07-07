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
    symbol: 'WDC', exchange: 'NASDAQ',
    price: '$533.66', change: '−7.60% · Jul 7',
    signal: 'Momentum unwind — broke the 21-day $589, testing $530–535 support after −7.6%; oversold so a bounce can come, but short the failed bounce into $560–590, targets $500 → $465 → $440; break $530 → $500 fast; reclaim $589–605 to trust it',
    lead: { rank: 5, entry: '$560–590', stop: '$606', targets: '$500 → $465 → $440', downside: '−23%', rr: '2.4:1', edge: 'Fresh unwind, but at support' },
    side: 'short',
    date: '2026-07-07',
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$111.20', change: '−9.00% · Jul 7',
    signal: 'Failed breakout — lost the 50-day $115 and the 4h trend support after −9%; oversold so no chase, short the bounce into $115–120, targets $101 → $94 → $86 (gap-fill $82, reset $70); lose $109 → $101 fast; reclaim $123–126 repairs it',
    lead: { rank: 1, entry: '$115–120', stop: '$124', targets: '$101 → $94 → $86', downside: '−27%', tail: '−41%', rr: '2.8:1', edge: 'Cleanest break; tightest risk' },
    side: 'short', accent: 'blue',
    date: '2026-07-07',
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$937.30', change: '−4.82% · Jul 7',
    signal: 'Momentum unwind across 4h/daily/weekly from a huge run — bounced off $920 support into the close but oversold, no chase; short the failed bounce into $970–1,015, targets $860 → $810 → $675; reclaim $1,050 flips it',
    lead: { rank: 2, entry: '$970–1,015', stop: '$1,050', targets: '$860 → $810 → $675', downside: '−32%', rr: '2.1:1', edge: 'Most extended → furthest to fall' },
    side: 'short', accent: 'cyan',
    date: '2026-07-07',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$339.61', change: '−10.57% · Jul 7',
    signal: 'Blow-off from $494 — knife onto the daily 50-day $337, 4h deeply oversold (RSI 23, Stoch 6); bounce likely but fade into $383–390, bias down; targets $318 → $300 → $260',
    lead: { rank: 4, entry: '$383–390', stop: '$391', targets: '$318 → $300 → $260', downside: '−32%', rr: '~10:1', rrStar: true, edge: 'Blow-off, but on the 50-day' },
    side: 'short', accent: 'blue',
    date: '2026-07-07',
    story: 'stories/ter.html',
  },
  {
    symbol: 'GLW', exchange: 'NYSE',
    price: '$196.79', change: '−10.81% · Jul 2',
    signal: 'Weekly blow-off rejection — huge upper wick, close near the low; relief bounce likely but sold, bias down unless it reclaims $217–220; targets $180 → $167 → $150',
    side: 'short', accent: 'blue',
    date: '2026-07-04',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,715', change: '$1,731 lost · Jul 3',
    signal: 'Sector memory rout, not SNDK — $1,731 lost, descent underway; fade bounces into $1,850–1,945, buy only the fib flush at $1,394–1,420',
    side: 'short', accent: 'red',
    date: '2026-07-03',
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$592.29', change: '−4.54% · Jul 2',
    signal: 'Sector barometer rolling over — weekly rejection + daily bear cross; bias down under $599, targets $533 → $500; drags all semis',
    side: 'short', accent: 'cyan',
    date: '2026-07-03',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$820.16', change: '−10.38% · Jul 2',
    signal: 'Blow-off top from ~$1,000 — weekly rejection, daily broke the 50-day; bias down under $875, targets $795 → $778 → $648',
    side: 'short', accent: 'amber',
    date: '2026-07-03',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$77.17', change: '−4.30% · Jul 7',
    signal: 'Broke the $80 base to $77 — decision point; a bounce to $81–86 is possible but continuation needs a reclaim of $86–87; LOSE $76 and the long is stopped → $66–69, then $57–60',
    side: 'long', accent: 'violet',
    date: '2026-07-07',
    story: 'stories/asts.html',
  },
  {
    symbol: 'SEZL', exchange: 'NASDAQ',
    price: '$183.24', change: '+4.60% · Jul 2',
    signal: 'Parabolic but overbought (RSI 84) — don’t chase $183; buy the $178–180 pullback, targets $200+',
    side: 'long', accent: 'emerald',
    date: '2026-07-03',
    story: 'stories/sezl.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$203.56', change: '−4.44% · Jul 7',
    signal: 'Lost the 50-day $213 — daily MACD accelerating down; 4h oversold (Stoch 8) so no chase here, short the failed bounce into $212–217; below $200 opens $192 → $174 → $157; reclaim $217→$232 negates',
    lead: { rank: 3, entry: '$212–217', stop: '$233', targets: '$192 → $174 → $157', downside: '−27%', rr: '1.3:1', edge: 'Broken, but already at support' },
    side: 'short', accent: 'indigo',
    date: '2026-07-07',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$603.04', change: '−7.35% · Jul 2',
    signal: 'Blow-off top (spike $739, closed −18%) — fade bounces into $640–672; targets $555 → $510 → $470',
    side: 'short', accent: 'red',
    date: '2026-07-03',
    story: 'stories/amat.html',
  },
  {
    symbol: 'BE', exchange: 'NYSE',
    price: '$268.86', change: '−8.88% · Jul 7',
    signal: 'Short working — shooting star from $320, now $269 after −8.9%; bank partial at T1 $252 (= daily 50-day), break opens $236 → $225; re-short bounces into $283–288, invalid above $305',
    lead: { rank: 6, entry: '$283–288', stop: '$305', targets: '$252 → $236 → $225', downside: '−20%', rr: '1.4:1', edge: 'Working, but mostly played out' },
    side: 'short', accent: 'amber',
    date: '2026-07-07',
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
