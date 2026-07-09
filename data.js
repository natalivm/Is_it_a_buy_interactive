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
    price: '$112.54', change: '+2.09% · Jul 9',
    signal: 'Bounced into the fade zone — +2.1% to $113 (AH $113), right into the $112–116 re-short and still under the 9/21-EMA $119–123; RSI back to 45 from oversold, so fade it here, stop $124; lose $108 → $103 → $101 → $94 → $86; reclaim $123–126 repairs it',
    lead: { rank: 5, entry: '$112–116', stop: '$124', targets: '$101 → $94 → $86', downside: '−25%', tail: '−39%', rr: '2.6:1', edge: 'Bounced into the fade zone' },
    side: 'short', accent: 'blue',
    date: '2026-07-09',
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$990.58', change: '+4.40% · Jul 9',
    signal: 'Bounced into the re-short zone — +4.4% to $990 (AH $990), pushing into the $967–1,015 supply and testing the 4h 50-EMA $1,021 overhead; MACD histogram green and OBV curling up, so respect a poke to $1,015–1,037, but this is the failed-push fade — short it, stop $1,050, below → $860 → $810 → $675; reclaim $1,050 flips it',
    lead: { rank: 2, entry: '$967–1,015', stop: '$1,050', targets: '$860 → $810 → $675', downside: '−31%', rr: '2.1:1', edge: 'In the re-short zone; furthest to fall' },
    side: 'short', accent: 'cyan',
    date: '2026-07-09',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$362.75', change: '+3.18% · Jul 9',
    signal: 'Grinding toward the fade zone — bounced +3.2% to $363 (AH $364) but still below the $383–393 re-short (4h 200-EMA $392 / 50-EMA $410), and OBV keeps making lower lows (no volume behind the bounce); fade into $383–393, stop $402, bias down; targets $318 → $300 → $260',
    lead: { rank: 1, entry: '$383–393', stop: '$402', targets: '$318 → $300 → $260', downside: '−32%', rr: '~9:1', rrStar: true, edge: 'Weak bounce; fade into the MA stack' },
    side: 'short', accent: 'blue',
    date: '2026-07-09',
    story: 'stories/ter.html',
  },
  {
    symbol: 'GLW', exchange: 'NYSE',
    price: '$192.43', change: '+4.56% · Jul 9',
    signal: 'Bounced into the fade zone — +4.6% to $192, back into the bottom of the $193–205 re-short (9-EMA $192), but OBV is rolling over hard (490m→408m) and the MACD histogram flipped red — no volume behind the pop; fade here, stop $217; lose $180 → $167 → $150; reclaim $217 negates',
    lead: { rank: 4, entry: '$193–205', stop: '$217', targets: '$180 → $167 → $150', downside: '−25%', rr: '2.4:1', edge: 'Weak bounce into the fade zone' },
    side: 'short', accent: 'blue',
    date: '2026-07-09',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,858', change: '+7.59% · Jul 9',
    signal: 'Squeeze then rejection — ran +13% to $1,952 intraday (blew through the $1,733–1,850 fade and the old $1,900 stop), then reversed to close +7.6% at $1,858 (AH $1,850): a fat upper-wick candle right at the daily BB mid $1,953. Re-fade the failed push into $1,900–1,950 with a tight stop over $1,952, targets $1,738 (4h 200-EMA) → $1,650 → $1,544; but OBV and 4h momentum are curling up, so a daily close back above $1,950 resumes the squeeze toward ~$2,100 — two-sided',
    lead: { rank: 7, entry: '$1,900–1,950', stop: '$1,960', targets: '$1,738 → $1,650 → $1,544', downside: '−20%', rr: '~5:1', edge: 'Fade the $1,950 rejection; tight stop but strong bid' },
    side: 'short', accent: 'red',
    date: '2026-07-09',
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$593.00', change: '+1.99% · Jul 8',
    signal: 'At the decision line, but show-me — closed $593 (+2.0%) and pre-market is pushing $604 into the $599–608 supply (4h 200-MA $600 / VWAP $608) with 4h Stochastics curling up. Catch: the bounce isn’t drawing volume (daily OBV rolling over from lower highs), so a reclaim of $608 only counts if it comes with a volume expansion — that breaks the $660 lower high and confirms STX; a stall on this light tape resumes down toward $540 → $500. Watch the open',
    side: 'short', accent: 'cyan',
    date: '2026-07-08',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$890.09', change: '+3.50% · Jul 9',
    signal: 'Long working — follow-through +3.5% to $890 (AH $888), holding above the breakout and the rising 4h 200-EMA $865 with OBV pushing higher highs (real accumulation — the confirmation that was missing); above the $850–870 add zone, next the $911 shelf then T1 $934–950 (200-day); trim on a daily close below $850, out below $795',
    side: 'long', accent: 'emerald',
    date: '2026-07-09',
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
    price: '$256.85', change: '+1.01% · Jul 9',
    signal: 'Bounce stalling under resistance — nudged +1.0% to $257 but still capped below the 4h 9-EMA $264 / 200-EMA $276 with OBV grinding to fresh lower lows (distribution); re-short bounces into $264–277, below $246 opens $236 → $225; reclaim $281 weakens it, $305 negates',
    side: 'short', accent: 'amber',
    date: '2026-07-09',
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
