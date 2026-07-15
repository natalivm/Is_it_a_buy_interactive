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
    lead: { rank: 3, status: 'live', entry: '$116–126', stop: '$132', targets: '$101 → $90 → $82', downside: '−32%', rr: '~3.5:1', edge: 'Deep daily downtrend + heaviest OBV — now rolling over in the fade zone, short working' },
    side: 'short', accent: 'violet',
    date: '2026-07-15',
    story: 'stories/aaoi.html',
  },
  {
    symbol: 'WDC', exchange: 'NASDAQ',
    price: '$563.32', change: '+1.40% · Jul 15',
    signal: 'Bounced with the group — lowest-conviction short — +1.40% to $563.32 (AH $561.20), a muted bounce mid-range. Daily is a huge uptrend ($250 → $750) in a pullback: under the 9/50-EMA (~$600–620) but well above the 200-EMA (~$350), MACD rolling, OBV still near highs. A countertrend range short, not a breakdown — fade rallies into $580–607, stop $620; targets $540 → $513 → $491. At $563 it’s mid-range with no edge; reclaim $607 neutralizes',
    side: 'short',
    date: '2026-07-15',
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$107.13', change: '−0.59% · Jul 15',
    signal: 'Grinding lower under the re-short zone — −0.59% to $107.13 on the Jul 15 open, sitting on the lower BB $107.12 and back under the whole intraday stack (9/50/200-EMA ~$111/$109/$107, VWAP $106.72). OBV punched a new low (−33.7m — the relentless distribution the thesis flagged), RSI 22 and Stochastics 18 (oversold). Price is now below the $110–118 fade zone, so the clean re-short needs a bounce back up: fade $110–118, stop $124; targets $98 → $92 → $85. Reclaim $124 negates',
    lead: { rank: 4, status: 'wait', entry: '$110–118', stop: '$124', targets: '$98 → $92 → $85', downside: '−25%', rr: '~2.9:1', edge: 'Worst OBV in the group — fresh OBV lows, but oversold under the re-short zone' },
    side: 'short', accent: 'blue',
    date: '2026-07-15',
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$959.03', change: '−2.45% · Jul 15',
    signal: 'Re-short triggered — back under the stack — −2.45% to $959.03 on the Jul 15 open, rejecting the squeeze and slicing back under the whole cluster (VWAP $977 / 9-EMA $976 / 50-EMA $976 / BB-mid $975), the $973 re-short line and the 200-EMA $968. OBV printing new lows (fresh distribution), MACD rolled back under signal (−1.0), RSI ~33, Stochastics rolling down from 80. The "close back under $973" trigger the plan waited for is firing intraday: $963 already gone, short works toward $955 → $921. Reclaim $973 negates',
    side: 'short', accent: 'cyan',
    date: '2026-07-15',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$353.23', change: '+3.55% · Jul 15',
    signal: 'Bouncing toward the re-short zone — +3.55% to $353.23 (AH $353.48), recovering with the group toward the $358–380 zone (broken demand shelf / 4h 50-EMA). The daily has rolled under the 9/50-EMA (~$380/$406) but still holds well above the 200-EMA (~$293) — a pullback-from-highs short, not a full breakdown. Fade rallies into $358–380, stop $390; targets $324 → $300 → $292. Reclaim $390 negates',
    lead: { rank: 7, status: 'wait', entry: '$358–380', stop: '$390', targets: '$324 → $300 → $292', downside: '−21%', rr: '~6:1', edge: 'Broke the demand shelf — bouncing into the re-short zone; under the fast MAs, above the 200-day' },
    side: 'short', accent: 'blue',
    date: '2026-07-14',
    story: 'stories/ter.html',
  },
  {
    symbol: 'GLW', exchange: 'NYSE',
    price: '$187.64', change: '+2.47% · Jul 15',
    signal: 'Bouncing back toward the broken 50-day — +2.47% to $187.64 (AH $187.76), recovering toward the $189 daily 50-day it lost and the $190–198 re-short zone. Daily uptrend ($100 → $210) in a pullback: at the fast MAs, above the 200-day, MACD rolling negative, OBV declining. A clean, mild pullback short — fade $190–198, stop $207; targets $180 → $167 → $152. Reclaim $198 weakens the thesis',
    lead: { rank: 5, status: 'wait', entry: '$190–198', stop: '$207', targets: '$180 → $167 → $152', downside: '−19%', rr: '~3:1', edge: 'Lost the 50-day — bouncing into resistance, daily rolling over' },
    side: 'short', accent: 'blue',
    date: '2026-07-15',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,675.60', change: '−4.68% · Jul 15',
    signal: 'Parabola fade working — broke down −4.68% to $1,675.60 on the Jul 15 open, blowing clean through the $1,705–1,790 fade zone and losing the entire stack (VWAP $1,766 / 9-EMA $1,754 / 50-EMA $1,753 / 200-EMA $1,767) and the lower BB $1,733. OBV printing new lows, MACD −8.7 and falling, RSI ~32, Stochastics crashed from 80 to ~23. The top-fade the plan flagged is paying — next stop T1 $1,572 → $1,536 → $1,480. Only a reclaim of $1,733 stalls it; back above $1,790 fully negates',
    lead: { rank: 8, status: 'live', entry: '$1,705–1,790 (filled)', stop: '$1,835', targets: '$1,572 → $1,536 → $1,480', downside: '−15%', rr: '3:1', edge: 'Parabola fade now paying — blew through the fade zone toward T1; highest-risk, size small' },
    side: 'short', accent: 'red',
    date: '2026-07-15',
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$600.31', change: '+2.51% · Jul 15',
    signal: 'Barometer bounced — sector bid — +2.51% to $600.31 (AH $599.94), recovering back into its $590–620 range and holding well above the daily 50-EMA (~$564) and 200-EMA (~$405); daily RSI ~49, OBV near its highs. The sector uptrend is intact and just chopping at highs — no breakdown. This is the tape that stopped the MU short and confirmed the STX long: constructive above $580, the group’s dip-buys valid and the whole short book is countertrend to a bid barometer. Only a close back under $580 flips it — not there',
    side: 'long', accent: 'cyan',
    date: '2026-07-14',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$855.84', change: '−2.56% · Jul 15',
    signal: 'Long under pressure — pulling back with the group — −2.56% to $855.84 on the Jul 15 open, sliding under VWAP $869 and the whole EMA stack (9/50/200 ≈ $870/$877/$878) and closing below the lower BB $859. RSI 36, MACD negative (−3.6), OBV new lows, Stochastics 12 (oversold). The memory group is selling off (MU/SNDK breaking down) and STX is going with it — but the daily 50-EMA dip-buy $842 and the $838 trend-stop are still intact. Buy-the-dip is only valid while > $838; a daily close under $840 breaks the trend → stand aside. The $889 add is off the table',
    lead: { rank: 1, status: 'wait', entry: '$842 dip-buy', stop: '$838', targets: '$889 → $910 → $948', downside: '+7%', rr: '~4:1', rrStar: true, edge: 'Held the 50-EMA yesterday but now pulling back with a red group — dip-buy valid only above $838' },
    side: 'long', accent: 'emerald',
    date: '2026-07-15',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$68.82', change: '+1.83% · Jul 15',
    signal: 'Broke the range, weak bounce — short working — +1.83% to $68.82 (AH $69.05), a shallow bounce that stayed UNDER the $73–78 re-short zone after the $70–80 range resolved down. One of the genuinely broken names: below its daily 200-EMA (~$78) and every fast EMA, MACD negative (~−4), OBV collapsing (June ~1,000m → 706m), RSI ~40, down from ~$140 June highs. Fade the bounce into $73–78, stop $80; targets $63 → $60 → $57. Reclaim $80 puts it back in the range. High-beta — size small',
    side: 'short', accent: 'violet',
    date: '2026-07-14',
    story: 'stories/asts.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$194.09', change: '−7.80% · Jul 15',
    signal: 'The one still breaking down — −7.80% to $194.09 (AH $194.60), the only name that fell while the group bounced; blew clean through T1 $207 → $200 toward $192. Daily under the 9/50-EMA ($226/$217), MACD negative and accelerating, sitting on the lower BB $188 — a genuine downtrend, not a bounce. The cleanest, only-confirming short in the book. Now extended/oversold, so don’t chase $194 — fade a bounce into $220–228, stop $235; targets $200 → $192 → $183. Reclaim $228 neutralizes',
    lead: { rank: 2, status: 'wait', entry: '$220–228 bounce', stop: '$235', targets: '$200 → $192 → $183', downside: '−12%', rr: '~3:1', edge: 'The only name still breaking down — blew through T1, momentum accelerating' },
    side: 'short', accent: 'indigo',
    date: '2026-07-15',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$595.70', change: '+3.53% · Jul 15',
    signal: 'Bounced back into the fade zone — low-conviction short — +3.53% to $595.70 (AH $595) on the group relief, recovering into the $590–605 zone. Daily is a strong uptrend ($300 → $640) in a shallow pullback: still above every MA, MACD barely negative, OBV near highs. A countertrend fade of a healthy trend — fade $590–605, stop $615; targets $544 → $526 → $510. Lose $544 accelerates; reclaim $605 neutralizes — respect the range',
    side: 'short', accent: 'red',
    date: '2026-07-15',
    story: 'stories/amat.html',
  },
  {
    symbol: 'BE', exchange: 'NYSE',
    price: '$243.35', change: '+4.22% · Jul 15',
    signal: 'Bouncing toward the broken stack — +4.22% to $243.35 (AH $243.59) off T1 $226, heading up toward the $256–280 re-short zone. Daily under the 9-EMA $258 / 50-EMA $265 (downtrend) but above the rising 200-EMA $185, MACD negative and rolling, OBV declining. Re-short the bounce into $256–280, stop $296; targets $226 → $210 → $183. Reclaim $296 negates',
    lead: { rank: 6, status: 'wait', entry: '$256–280', stop: '$296', targets: '$226 → $210 → $183', downside: '−32%', rr: '3:1', edge: 'Downtrend under the fast MAs — bouncing toward the re-short stack' },
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
