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
//   lead       (optional) leaderboard row: { rank, status?, entry, stop,
//              targets, downside, tail?, rr, rrStar?, edge } — entries with a `lead`
//              render in the "Sharpest trades" table (long or short, no cap),
//              ordered by rank; omit `lead` to keep a name off the board.
//              status 'live' = price is at/in the entry zone now (🎯 at trigger);
//              'wait' = needs price to reach the level (⏳ wait for level)
//   accent     (optional) tile glow colour — the gallery now auto-varies tile
//              colours across the grid, so this field is no longer required
//   date       ISO date the plan was posted (YYYY-MM-DD) — gallery sorts newest first
//   story      path to the interactive presentation HTML
//
// To add a stock: drop its story at stories/<symbol>.html and add an entry here.
const STOCKS = [
  {
    symbol: 'AAOI', exchange: 'NASDAQ',
    price: '$119.31', change: '−4.89% · Jul 15',
    signal: 'Re-short working — rolling over in the fade zone — −4.89% to $119.31 on the Jul 15 open, breaking down from the top of the $116–126 fade zone and losing the whole intraday stack (9/50/200-EMA $126.74/$126.10/$122.44, VWAP $123.03) plus the lower BB $125.31. OBV rolling to new lows, MACD negative, RSI 28 / Stochastics 20 (oversold but trending down). The re-short into resistance is paying: still inside the $116–126 zone, working toward $101 → $90 → $82. Reclaim $132 negates',
    lead: { rank: 1, status: 'live', entry: '$116–126', stop: '$132', targets: '$101 → $90 → $82', downside: '−32%', rr: '~3.5:1', edge: 'Deep daily downtrend + heaviest OBV — now rolling over in the fade zone, short working' },
    side: 'short', accent: 'violet',
    date: '2026-07-15',
    story: 'stories/aaoi.html',
  },
  {
    symbol: 'WDC', exchange: 'NASDAQ',
    price: '$521.32', change: '−7.46% · Jul 15',
    signal: 'Clean breakdown — −7.46% to $521.32 on the Jul 15 session, the hardest drop in the group: knifed through the whole stack (VWAP $571 / 9/50/200-EMA ~$563) and blew clean past the $540 fade target, now between T1 $540 and T2 $513. MACD negative, OBV crashing to new lows, RSI 16 / Stochastics 10 — deeply oversold. The range short paid in full — but it is extended here, so don’t chase $521; next levels $513 → $491. A bounce back toward $558–571 is the spot to re-engage; reclaim $580 neutralizes',
    side: 'short',
    date: '2026-07-15',
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$107.13', change: '−0.59% · Jul 15',
    signal: 'Grinding lower under the re-short zone — −0.59% to $107.13 on the Jul 15 open, sitting on the lower BB $107.12 and back under the whole intraday stack (9/50/200-EMA ~$111/$109/$107, VWAP $106.72). OBV punched a new low (−33.7m — the relentless distribution the thesis flagged), RSI 22 and Stochastics 18 (oversold). Price is now below the $110–118 fade zone, so the clean re-short needs a bounce back up: fade $110–118, stop $124; targets $98 → $92 → $85. Reclaim $124 negates',
    lead: { rank: 8, status: 'wait', entry: '$110–118', stop: '$124', targets: '$98 → $92 → $85', downside: '−25%', rr: '~2.9:1', edge: 'Worst OBV in the group — fresh OBV lows, but oversold under the re-short zone' },
    side: 'short', accent: 'blue',
    date: '2026-07-15',
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$959.03', change: '−2.45% · Jul 15',
    signal: 'Re-short triggered — back under the stack — −2.45% to $959.03 on the Jul 15 open, rejecting the squeeze and slicing back under the whole cluster (VWAP $977 / 9-EMA $976 / 50-EMA $976 / BB-mid $975), the $973 re-short line and the 200-EMA $968. OBV printing new lows (fresh distribution), MACD rolled back under signal (−1.0), RSI ~33, Stochastics rolling down from 80. The "close back under $973" trigger the plan waited for is firing intraday: $963 already gone, short works toward $955 → $921. Reclaim $973 negates',
    lead: { rank: 2, status: 'live', entry: '$973 break', stop: '$985', targets: '$955 → $921 → $900', downside: '−8%', rr: '~4:1', edge: 'Memory bellwether — reclaim failed, re-short triggered back under the stack' },
    side: 'short', accent: 'cyan',
    date: '2026-07-15',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$343.30', change: '−2.81% · Jul 15',
    signal: 'Breaking below the re-short zone — −2.81% to $343.30 on the Jul 15 session, sliding under the $358–380 zone (broken demand shelf / 4h 50-EMA) and under every 4h EMA (9/50/200 = $358/$386/$390, VWAP $357); MACD −7, RSI 40, OBV grinding lower. The pullback-from-highs short is confirming — but a clean fresh entry needs a bounce back into $358–380, stop $390; targets $324 → $300 → $292. Reclaim $390 negates',
    lead: { rank: 6, status: 'wait', entry: '$358–380', stop: '$390', targets: '$324 → $300 → $292', downside: '−21%', rr: '~6:1', edge: 'Broke the demand shelf and now under it — fade a bounce back into the zone; best R:R on the board' },
    side: 'short', accent: 'blue',
    date: '2026-07-14',
    story: 'stories/ter.html',
  },
  {
    symbol: 'GLW', exchange: 'NYSE',
    price: '$187.64', change: '+2.47% · Jul 15',
    signal: 'Bouncing back toward the broken 50-day — +2.47% to $187.64 (AH $187.76), recovering toward the $189 daily 50-day it lost and the $190–198 re-short zone. Daily uptrend ($100 → $210) in a pullback: at the fast MAs, above the 200-day, MACD rolling negative, OBV declining. A clean, mild pullback short — fade $190–198, stop $207; targets $180 → $167 → $152. Reclaim $198 weakens the thesis',
    lead: { rank: 7, status: 'wait', entry: '$190–198', stop: '$207', targets: '$180 → $167 → $152', downside: '−19%', rr: '~3:1', edge: 'Lost the 50-day — bouncing into resistance, daily rolling over' },
    side: 'short', accent: 'blue',
    date: '2026-07-15',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,675.60', change: '−4.68% · Jul 15',
    signal: 'Parabola fade working — broke down −4.68% to $1,675.60 on the Jul 15 open, blowing clean through the $1,705–1,790 fade zone and losing the entire stack (VWAP $1,766 / 9-EMA $1,754 / 50-EMA $1,753 / 200-EMA $1,767) and the lower BB $1,733. OBV printing new lows, MACD −8.7 and falling, RSI ~32, Stochastics crashed from 80 to ~23. The top-fade the plan flagged is paying — next stop T1 $1,572 → $1,536 → $1,480. Only a reclaim of $1,733 stalls it; back above $1,790 fully negates',
    lead: { rank: 4, status: 'live', entry: '$1,705–1,790 (filled)', stop: '$1,835', targets: '$1,572 → $1,536 → $1,480', downside: '−15%', rr: '3:1', edge: 'Parabola fade now paying — blew through the fade zone toward T1; highest-risk, size small' },
    side: 'short', accent: 'red',
    date: '2026-07-15',
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$596.64', change: '−0.61% · Jul 15',
    signal: 'Barometer rolling over — risk-off intraday — −0.61% to $596.64 on the Jul 15 open, sliding under its whole intraday stack (VWAP $600 / 9-EMA $605 / 50-EMA $602 / 200-EMA $600) and cracking the lower BB $597; OBV crashing to new lows (−2.25m), RSI ~26, Stochastics 24. This is the tape dragging the whole memory/semis group down — the shorts (AAOI/MU/SNDK) are working with it. BUT the key daily 50-EMA $580 still holds: this is a sharp dip in the range, not yet a trend break. Lose $580 → full risk-off (green-light shorts, exit longs); hold it → the group dip-buy still lives',
    side: 'long', accent: 'cyan',
    date: '2026-07-15',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$855.84', change: '−2.56% · Jul 15',
    signal: 'Long under pressure — pulling back with the group — −2.56% to $855.84 on the Jul 15 open, sliding under VWAP $869 and the whole EMA stack (9/50/200 ≈ $870/$877/$878) and closing below the lower BB $859. RSI 36, MACD negative (−3.6), OBV new lows, Stochastics 12 (oversold). The memory group is selling off (MU/SNDK breaking down) and STX is going with it — but the daily 50-EMA dip-buy $842 and the $838 trend-stop are still intact. Buy-the-dip is only valid while > $838; a daily close under $840 breaks the trend → stand aside. The $889 add is off the table',
    lead: { rank: 9, status: 'wait', entry: '$842 dip-buy', stop: '$838', targets: '$889 → $910 → $948', downside: '+7%', rr: '~4:1', rrStar: true, edge: 'Held the 50-EMA yesterday but now pulling back with a red group — dip-buy valid only above $838' },
    side: 'long', accent: 'emerald',
    date: '2026-07-15',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$66.85', change: '−2.87% · Jul 15',
    signal: 'Grinding lower, short working — −2.87% to $66.85 on the Jul 15 session, extending the breakdown under the $73–78 re-short zone and below every EMA (9/50/200 = $73/$75/$79, VWAP $73) plus the lower BB $73. OBV crashing to new lows, MACD negative; RSI ~33 — getting oversold but not stretched, so there is still room toward the targets. One of the genuinely broken names — bias stays down to $63 → $60 → $57. A bounce into $73–78 is the re-short spot; reclaim $80 puts it back in the range. High-beta, size small',
    side: 'short', accent: 'violet',
    date: '2026-07-15',
    story: 'stories/asts.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$194.09', change: '−7.80% · Jul 15',
    signal: 'The one still breaking down — −7.80% to $194.09 (AH $194.60), the only name that fell while the group bounced; blew clean through T1 $207 → $200 toward $192. Daily under the 9/50-EMA ($226/$217), MACD negative and accelerating, sitting on the lower BB $188 — a genuine downtrend, not a bounce. The cleanest, only-confirming short in the book. Now extended/oversold, so don’t chase $194 — fade a bounce into $220–228, stop $235; targets $200 → $192 → $183. Reclaim $228 neutralizes',
    lead: { rank: 3, status: 'wait', entry: '$220–228 bounce', stop: '$235', targets: '$200 → $192 → $183', downside: '−12%', rr: '~3:1', edge: 'The only name still breaking down — blew through T1, momentum accelerating' },
    side: 'short', accent: 'indigo',
    date: '2026-07-15',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$578.96', change: '−2.81% · Jul 15',
    signal: 'Rolled out of the fade zone — −2.81% to $578.96 on the Jul 15 session, dropping out of the $590–605 fade zone and back under the 1h stack (VWAP $597 / 9-EMA $596 / 50-EMA $589), now below the BB mid $585 toward the lower BB $560; RSI 36, OBV declining, Stochastics rolling from the highs. The countertrend fade is working — but the daily is still a strong uptrend, so treat it as a pullback: next $544 → $526 → $510. A bounce back into $590–605 is the cleaner re-entry; reclaim $605 neutralizes',
    side: 'short', accent: 'red',
    date: '2026-07-15',
    story: 'stories/amat.html',
  },
  {
    symbol: 'BE', exchange: 'NYSE',
    price: '$239.13', change: '−1.75% · Jul 15',
    signal: 'Sliding under the re-short zone — −1.75% to $239.13 on the Jul 15 session, back under the $256–280 re-short stack and under every 4h EMA (9/50/200 = $254/$275/$275, VWAP $242), near the lower BB $235; MACD −8, RSI 38, OBV grinding to new lows. Clean downtrend continuing — re-short a bounce into $256–280, stop $296; targets $226 → $210 → $183. Reclaim $296 negates',
    lead: { rank: 5, status: 'wait', entry: '$256–280', stop: '$296', targets: '$226 → $210 → $183', downside: '−32%', rr: '3:1', edge: 'Downtrend under the fast MAs — fade a bounce back into the re-short stack, −32% downside' },
    side: 'short', accent: 'amber',
    date: '2026-07-15',
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
