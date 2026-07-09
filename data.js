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
    price: '$122.21', change: '+6.79% · Jul 9',
    signal: 'Bounced into the fade zone — +6.8% to $122, up into the $121–130 re-short (9-EMA $122, 50-EMA $131 / 200-EMA $152 above) but OBV is still making lower lows (no accumulation behind the pop); fade the failed push, targets $101 → $90–96 → $74; reclaim $134 repairs it',
    side: 'short', accent: 'violet',
    date: '2026-07-09',
    story: 'stories/aaoi.html',
  },
  {
    symbol: 'WDC', exchange: 'NASDAQ',
    price: '$578.05', change: '+5.04% · Jul 9',
    signal: 'Bounced into the re-short zone — +5.0% to $578, up into the $560–592 fade with the 9-EMA $608 / BB mid $611 and the $606 negate line just above; still under the MA stack and daily MACD histogram red, so short the failed push here, stop $606; lose $527 → $500 → $465 → $440; reclaim $606 negates',
    lead: { rank: 6, entry: '$560–592', stop: '$606', targets: '$500 → $465 → $440', downside: '−22%', rr: '2.4:1', edge: 'In the re-short zone; capped under $606' },
    side: 'short',
    date: '2026-07-09',
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$112.54', change: '+2.09% · Jul 9',
    signal: 'Bounced into the fade zone — +2.1% to $113 (AH $113), right into the $112–116 re-short and still under the 9/21-EMA $119–123; RSI back to 45 from oversold, so fade it here, stop $124; lose $108 → $103 → $101 → $94 → $86; reclaim $123–126 repairs it',
    lead: { rank: 4, entry: '$112–116', stop: '$124', targets: '$101 → $94 → $86', downside: '−25%', tail: '−39%', rr: '2.6:1', edge: 'Bounced into the fade zone' },
    side: 'short', accent: 'blue',
    date: '2026-07-09',
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$990.58', change: '+4.40% · Jul 9',
    signal: 'Bounced into the re-short zone — +4.4% to $990 (AH $990), pushing into the $967–1,015 supply and testing the 4h 50-EMA $1,021 overhead; MACD histogram green and OBV curling up, so respect a poke to $1,015–1,037, but this is the failed-push fade — short it, stop $1,050, below → $860 → $810 → $675; reclaim $1,050 flips it',
    lead: { rank: 7, entry: '$967–1,015', stop: '$1,050', targets: '$860 → $810 → $675', downside: '−31%', rr: '2.1:1', edge: 'Biggest drop, but the thinnest R:R (2.1:1)' },
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
    lead: { rank: 5, entry: '$193–205', stop: '$217', targets: '$180 → $167 → $150', downside: '−25%', rr: '2.4:1', edge: 'Weak bounce into the fade zone' },
    side: 'short', accent: 'blue',
    date: '2026-07-09',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,858', change: '+7.59% · Jul 9',
    signal: 'Squeeze then rejection — ran +13% to $1,952 intraday (blew through the $1,733–1,850 fade and the old $1,900 stop), then reversed to close +7.6% at $1,858 (AH $1,850): a fat upper-wick candle right at the daily BB mid $1,953. Re-fade the failed push into $1,900–1,950 with a tight stop over $1,952, targets $1,738 (4h 200-EMA) → $1,650 → $1,544; but OBV and 4h momentum are curling up, so a daily close back above $1,950 resumes the squeeze toward ~$2,100 — two-sided',
    lead: { rank: 3, entry: '$1,900–1,950', stop: '$1,960', targets: '$1,738 → $1,650 → $1,544', downside: '−20%', rr: '~5:1', edge: 'Fade the $1,950 rejection; tight stop but strong bid' },
    side: 'short', accent: 'red',
    date: '2026-07-09',
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$607.73', change: '+2.48% · Jul 9',
    signal: 'Reclaimed the zone, at the flip line — closed $607.73 (+2.5%, AH $608) back above the $599–608 supply, but stalled right under the 4h 50-EMA / VWAP $609–612 and OBV still isn’t thrusting; a daily hold above $612 breaks the $660 lower-high structure and confirms STX, a rejection back under $595 revives the $540 → $500 downside. Tilting up — but not confirmed until $612 clears on volume',
    side: 'short', accent: 'cyan',
    date: '2026-07-09',
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
    price: '$73.88', change: '−1.43% · Jul 9',
    signal: 'Going nowhere — chopping the $70–80 range (−1.4% to $74), back above the 9-EMA $67 but still stuck under the $80 base and the 50-EMA $79 / 200-EMA $88; no trade until it picks a side — reclaim $80 → $86 revives the long, lose $68–70 opens $66–69 then $57–60',
    side: 'long', accent: 'violet',
    date: '2026-07-09',
    story: 'stories/asts.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$216.20', change: '−0.13% · Jul 9',
    signal: 'Stalled in the re-short zone — chopping $215–216 (flat) inside the $212–217 supply, still capped by the 4h 200-EMA $225 / 50-EMA $229 / VWAP $219; the failed-bounce short stays live here, stop $233; below $200 → $192 → $174 → $157; reclaim $233 negates',
    lead: { rank: 2, entry: '$215–225', stop: '$233', targets: '$192 → $174 → $157', downside: '−29%', rr: '4:1', edge: 'Stalled at the fade line, under the 200-EMA' },
    side: 'short', accent: 'indigo',
    date: '2026-07-09',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$588.66', change: '+3.18% · Jul 9',
    signal: 'Bounced into the re-short zone — +3.2% to $589 (AH $592), pushing into the $580–595 fade with the 9-EMA $595 / BB mid $608 above; MACD histogram green and OBV rising, so respect a poke to $608, but this is the failed-push fade — re-short here; targets $525 → $510 → $470; reclaim $620 negates',
    side: 'short', accent: 'red',
    date: '2026-07-09',
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
