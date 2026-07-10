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
    price: '$119.92', change: '−1.87% · Jul 10',
    signal: 'Weak doji bounce, distribution rolling — closed −1.87% at $119.92, bounced off $113 but on no volume; under the MA stack (9-EMA $140 / 50-EMA $155), RSI 39, and the worst OBV in the group (250m → 123m). Fade the bounce into $128–140, stop $141; targets $110 → $101 (200-EMA) → $90; reclaim $141 repairs it',
    lead: { rank: 5, entry: '$128–140', stop: '$141', targets: '$110 → $101 → $90', downside: '−33%', rr: '3:1', edge: 'Heaviest OBV distribution in the group' },
    side: 'short', accent: 'violet',
    date: '2026-07-10',
    story: 'stories/aaoi.html',
  },
  {
    symbol: 'WDC', exchange: 'NASDAQ',
    price: '$582.59', change: '+0.78% · Jul 10',
    signal: 'Basing, two-sided — green day +0.78% to $582.59 near the high, holding the 50-EMA $514 with the daily MACD greening, but still under the 9-EMA $655 and the $589–606 cap; range $540–615. Fade rallies into $589–606 (stop $620), long only on a reclaim of $615; lose $540 → $506 → $465. The healthiest of the shorts — lower conviction, wait for the edge of the range',
    side: 'short',
    date: '2026-07-10',
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$109.84', change: '−2.40% · Jul 10',
    signal: 'Under the whole stack — closed −2.40% at $109.84, a doji on the lows below every MA (9-EMA $123 / 50-EMA $128 / 200-EMA $116) with RSI 37 and the worst OBV in the group (−527m, heavy distribution). Fade the bounce into $118–128, stop $130; targets $104 → $98 → $90; reclaim $130 repairs it',
    lead: { rank: 6, entry: '$118–128', stop: '$130', targets: '$104 → $98 → $90', downside: '−27%', rr: '2.8:1', edge: 'Under all MAs with the heaviest OBV distribution' },
    side: 'short', accent: 'blue',
    date: '2026-07-10',
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$979.30', change: '−1.24% · Jul 10',
    signal: 'Defended $954, capped under the stack — recovered to close $979 (green candle, AH $980) holding the 4h 200-EMA $942 with 4h MACD greening, but still under the 9-EMA $1,005 / 50-EMA $1,012 / BB mid $1,045. Two-sided and thin: fade the bounce into $1,005–1,045, stop $1,050 (reclaim = long); targets $942 → $900 → $870 — not a top-5 setup, R:R too thin',
    side: 'short', accent: 'cyan',
    date: '2026-07-10',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$359.60', change: '−0.87% · Jul 10',
    signal: 'Defended the demand zone — sold to $345 then closed $359.60 near the high (hammer, AH $361), never closed below the zone; 4h MACD greening and reclaimed VWAP $358, but still capped under the $381–389 MA stack with the daily MACD red (−11.8). The laggard vs SMH (holds its 50-day, TER can’t) — fade the bounce into $383–393, stop $402; targets $324 → $300 → $292; reclaim $390 puts it back with SMH',
    lead: { rank: 1, entry: '$383–393', stop: '$402', targets: '$324 → $300 → $292', downside: '−25%', rr: '~7:1', rrStar: true, edge: 'Defended $345 but a laggard vs SMH — fade the MA stack' },
    side: 'short', accent: 'blue',
    date: '2026-07-10',
    story: 'stories/ter.html',
  },
  {
    symbol: 'GLW', exchange: 'NYSE',
    price: '$190.89', change: '−0.77% · Jul 10',
    signal: 'Weak at the 50-day — small red doji closing −0.77% at $190.89 on the 50-day ($189), under the 9-EMA $198 and the 4h stack ($193–200) with OBV rolling over (600m→507m). The weak side: fade rallies into $198–205, stop $207; targets $180 → $167 → $152; reclaim $205 weakens it. Sitting on support, so lower conviction than BE/INTC',
    side: 'short', accent: 'blue',
    date: '2026-07-10',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,915', change: '+3.10% · Jul 10',
    signal: 'Reclaimed above all EMAs — closed +3.10% at $1,915 (AH $1,924) green near the high, back above the 9-EMA $1,872 and every average after defending $1,773; the strongest name in the group with OBV near highs — a leader, not a short. Buy dips $1,790–1,870, stop $1,760; breakout > $1,950 → $2,000 → ~$2,100. The long side of the spread',
    lead: { rank: 3, entry: '$1,790–1,870', stop: '$1,760', targets: '$1,950 → $2,000 → $2,100', downside: '+13%', rr: '~4:1', edge: 'Reclaimed above all EMAs — leader' },
    side: 'long', accent: 'red',
    date: '2026-07-10',
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$611.03', change: '+0.54% · Jul 10',
    signal: 'Barometer holding, not breaking — flushed to $586 then closed $611 back above the 4h 200-EMA/VWAP ($591–600) and defended $595 on the daily; sits above the 50-day $580 and 9-EMA $608 but capped under the $619–628 flip, RSI 51 neutral. Range $591–628: constructive while > $580, breakout only > $628. The sector tell is relative strength — long the leaders (STX), short the laggards (TER, BE, AAOI)',
    side: 'long', accent: 'cyan',
    date: '2026-07-10',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$910.34', change: '+2.28% · Jul 10',
    signal: 'Leader, long working — closed +2.28% at $910.34 (AH $912), above all its EMAs (9 $895 / 50 $839 / 200 $539) at the $911 shelf with OBV making higher highs (real accumulation). Leads the spread — above its averages while SMH only holds its 50-day. Add on holds of $850–870; targets $934–950 → $1,015 → $1,120; trim below $850, out below $795',
    lead: { rank: 2, entry: '$850–910', stop: '$795', targets: '$934–950 → $1,015 → $1,120', downside: '+26%', rr: '~3:1', edge: 'Leader — above all EMAs, OBV higher highs' },
    side: 'long', accent: 'emerald',
    date: '2026-07-10',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$73.32', change: '−0.76% · Jul 10',
    signal: 'No trade — range $70–80 — closed −0.76% at $73.32, now below all its MAs (9 $77 / 50 $85 / 200 $79) with RSI 40 and OBV rolling; stand aside until it picks a side, but the lean is weak. Reclaim $80 → $86 revives the long; lose $68–70 opens $66–69 then $57–60',
    side: 'long', accent: 'violet',
    date: '2026-07-10',
    story: 'stories/asts.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$219.65', change: '+1.60% · Jul 10',
    signal: 'Defended, capped under the stack — green day +1.60% to $219.65 near the high (AH $219), holding the 50-EMA $217 after defending $207, but still under the daily 9-EMA $225 / 4h 50–200-EMA $225–227. Two-sided: fade rallies into $225–233, stop $235 (reclaim = long); targets $207 → $200 → $192. Not a clean short — respect the bounce',
    side: 'short', accent: 'indigo',
    date: '2026-07-10',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$602.50', change: '+2.35% · Jul 10',
    signal: 'Defended, capped under the stack — green day +2.35% to $602.50 near the high (AH $605), back above the daily 50-EMA after defending $574, but still under the 4h 9-EMA $618 / 50-EMA $631. Two-sided: fade rallies into $618–631, stop $645 (reclaim = long); targets $573 → $538 → $510. Not a clean short — respect the bounce',
    side: 'short', accent: 'red',
    date: '2026-07-10',
    story: 'stories/amat.html',
  },
  {
    symbol: 'BE', exchange: 'NYSE',
    price: '$244.61', change: '−4.83% · Jul 10',
    signal: 'Broke down, no defense — closed −4.83% at $244.61 near the low, under the whole MA stack ($256 / $275) with OBV making fresh lower lows (active distribution); the weakest name in the group, closing red while the sector bounced. Re-short bounces into $256–276, stop $283; targets $226 → $210 → $183; reclaim $283 negates',
    lead: { rank: 4, entry: '$256–276', stop: '$283', targets: '$226 → $210 → $183', downside: '−31%', rr: '3.2:1', edge: 'Closed red near the low — worst RS, active distribution' },
    side: 'short', accent: 'amber',
    date: '2026-07-10',
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
