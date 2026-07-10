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
    lead: { rank: 3, entry: '$128–140', stop: '$141', targets: '$110 → $101 → $90', downside: '−33%', rr: '3:1', edge: 'Heaviest OBV distribution in the group' },
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
    lead: { rank: 4, entry: '$118–128', stop: '$130', targets: '$104 → $98 → $90', downside: '−27%', rr: '2.8:1', edge: 'Under all MAs with the heaviest OBV distribution' },
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
    price: '$611.03', change: '+0.54% · Jul 10',
    signal: 'Barometer holding, not breaking — flushed to $586 then closed $611 back above the 4h 200-EMA/VWAP ($591–600) and defended $595 on the daily; sits above the 50-day $580 and 9-EMA $608 but capped under the $619–628 flip, RSI 51 neutral. Range $591–628: constructive while > $580, breakout only > $628. The sector tell is relative strength — long the leaders (STX), short the laggards (TER, BE, AAOI)',
    side: 'long', accent: 'cyan',
    date: '2026-07-10',
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
    price: '$244.61', change: '−4.83% · Jul 10',
    signal: 'Broke down, no defense — closed −4.83% at $244.61 near the low, under the whole MA stack ($256 / $275) with OBV making fresh lower lows (active distribution); the weakest name in the group, closing red while the sector bounced. Re-short bounces into $256–276, stop $283; targets $226 → $210 → $183; reclaim $283 negates',
    lead: { rank: 2, entry: '$256–276', stop: '$283', targets: '$226 → $210 → $183', downside: '−31%', rr: '3.2:1', edge: 'Closed red near the low — worst RS, active distribution' },
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
