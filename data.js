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
//              render in the "Sharpest trades" table (long or short, no cap),
//              ordered by rank; omit `lead` to keep a name off the board
//   accent     (optional) tile glow colour — the gallery now auto-varies tile
//              colours across the grid, so this field is no longer required
//   date       ISO date the plan was posted (YYYY-MM-DD) — gallery sorts newest first
//   story      path to the interactive presentation HTML
//
// To add a stock: drop its story at stories/<symbol>.html and add an entry here.
const STOCKS = [
  {
    symbol: 'AAOI', exchange: 'NASDAQ',
    price: '$125.45', change: '+12.13% · Jul 14',
    signal: 'Bounced into the re-short zone — +12.13% to $125.45 (AH $125.87), an oversold dead-cat that popped straight into the $116–126 fade zone the plan flagged (T1 $110 already banked). Daily is a deep downtrend — under the 9-EMA $173 / 50-EMA $149 with the heaviest OBV collapse in the group — above only the 200-EMA $84. Cleanest re-short-into-resistance on the board: fade $116–126, stop $132; targets $101 → $90 → $82. Reclaim $132 negates',
    lead: { rank: 3, entry: '$116–126', stop: '$132', targets: '$101 → $90 → $82', downside: '−32%', rr: '~3.5:1', edge: 'Deep daily downtrend + heaviest OBV — bounced right into the re-short zone' },
    side: 'short', accent: 'violet',
    date: '2026-07-14',
    story: 'stories/aaoi.html',
  },
  {
    symbol: 'WDC', exchange: 'NASDAQ',
    price: '$563.32', change: '+1.40% · Jul 14',
    signal: 'Bounced with the group — lowest-conviction short — +1.40% to $563.32 (AH $561.20), a muted bounce mid-range. Daily is a huge uptrend ($250 → $750) in a pullback: under the 9/50-EMA (~$600–620) but well above the 200-EMA (~$350), MACD rolling, OBV still near highs. A countertrend range short, not a breakdown — fade rallies into $580–607, stop $620; targets $540 → $513 → $491. At $563 it’s mid-range with no edge; reclaim $607 neutralizes',
    side: 'short',
    date: '2026-07-14',
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$107.76', change: '+4.50% · Jul 14',
    signal: 'Bouncing toward the re-short zone — +4.50% to $107.76 (AH $107.52) off T1 $104, heading into the $110–118 fade zone. Worst OBV in the group (relentless distribution); daily under the 9/50-EMA (~$110–123), above the 200-EMA $72, MACD negative, RSI 43. Fade $110–118, stop $124; targets $98 → $92 → $85. Short-term weak but countertrend to the bigger daily uptrend — reclaim $124 negates',
    lead: { rank: 4, entry: '$110–118', stop: '$124', targets: '$98 → $92 → $85', downside: '−25%', rr: '~2.9:1', edge: 'Worst OBV in the group — bouncing into the re-short zone' },
    side: 'short', accent: 'blue',
    date: '2026-07-14',
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$983.12', change: '+4.92% · Jul 14',
    signal: 'Short stopped, closed above the line — stand aside — squeezed +4.92% to a $983.12 close, running the $985 stop intraday and settling back above the stack (VWAP $977 / 9-EMA $970 / BB mid $973), still capped by the 4h 50-EMA $994; 4h MACD histogram flipped positive and curling up, RSI 52. The re-short trigger (a close back under $973) never fired all day — standing aside was right. Next session: a push through $993 → $1,022 extends the relief; only a close back under $973 re-arms the short toward $963 → $955 → $921. The memory group led higher (same tape confirming the STX long)',
    side: 'short', accent: 'cyan',
    date: '2026-07-14',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$341.11', change: '−5.14% · Jul 13',
    signal: 'Short working but countertrend on the daily — −5.14% to $341.11 (AH $340.21) broke the demand zone toward T1 $324, under the 4h 50-EMA $378. But the daily is still above ALL its MAs (9/50/200-EMA $300/$285/$206) — this is a pullback-from-highs short, not a daily breakdown, so keep it on a tight leash. Re-short bounces into $358–380, stop $390; targets $324 → $300 → $292. Reclaim $390 negates',
    lead: { rank: 7, entry: '$358–380', stop: '$390', targets: '$324 → $300 → $292', downside: '−21%', rr: '~6:1', edge: 'Broke the demand zone — working, but countertrend to a daily still above all MAs' },
    side: 'short', accent: 'blue',
    date: '2026-07-13',
    story: 'stories/ter.html',
  },
  {
    symbol: 'GLW', exchange: 'NYSE',
    price: '$187.64', change: '+2.47% · Jul 14',
    signal: 'Bouncing back toward the broken 50-day — +2.47% to $187.64 (AH $187.76), recovering toward the $189 daily 50-day it lost and the $190–198 re-short zone. Daily uptrend ($100 → $210) in a pullback: at the fast MAs, above the 200-day, MACD rolling negative, OBV declining. A clean, mild pullback short — fade $190–198, stop $207; targets $180 → $167 → $152. Reclaim $198 weakens the thesis',
    lead: { rank: 5, entry: '$190–198', stop: '$207', targets: '$180 → $167 → $152', downside: '−19%', rr: '~3:1', edge: 'Lost the 50-day — bouncing into resistance, daily rolling over' },
    side: 'short', accent: 'blue',
    date: '2026-07-14',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,757.82', change: '+5.01% · Jul 14',
    signal: 'Parabola bounce into the fade zone — highest-risk short — +5.01% to $1,757.82 (AH $1,749) rebounding off the −12% engulfing, straight into the $1,705–1,790 fade zone. But the daily is a parabola still miles above every MA (9/50/200-EMA $1,459/$1,099/$588) with OBV near highs — this is a top-fade, the most countertrend setup on the board. Size small, hard stop: fade $1,705–1,790, stop $1,835; targets $1,572 → $1,536 → $1,480. Reclaim $1,835 negates; loss of $1,536 opens $1,222',
    lead: { rank: 8, entry: '$1,705–1,790', stop: '$1,835', targets: '$1,572 → $1,536 → $1,480', downside: '−15%', rr: '3:1', edge: 'Biggest breakdown −12% but a parabola fade — highest-risk short, size small' },
    side: 'short', accent: 'red',
    date: '2026-07-14',
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$585.62', change: '−4.16% · Jul 13',
    signal: 'Barometer held the 50-day — flushed −4.16% to $585.62 (AH $586.06) on the broad selloff but closed above the daily 50-EMA $580, so the sector uptrend is intact-but-tested (still well above the 200-EMA $457). Now under the 4h 200-EMA $591 and 9-EMA $604 — short-term weak, daily line held. $580 is make-or-break: constructive above it (STX-type dip-buys valid), below it opens $573 → $557 and the group’s longs are in trouble. The tell is relative strength — long what held its 50-EMA (STX), short the laggards (TER, BE, SNDK)',
    side: 'long', accent: 'cyan',
    date: '2026-07-13',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$885.05', change: '+2.83% · Jul 14',
    signal: 'Dip bought, long working — +2.83% to $885.05 (tagged ~$908 intraday) off the $842 50-EMA dip; back above VWAP $856.83 with RSI 66, MACD positive and the daily trend intact. It held its 50-EMA while the group broke and is now leading the memory rebound — the same tape that stopped the MU short. The add-on-reclaim of $889 is at hand; targets $889 → $910 → $948, trail the stop up from $838. A close back under $840 breaks the trend → stand aside',
    lead: { rank: 1, entry: '$842 dip · add $889', stop: '$838', targets: '$889 → $910 → $948', downside: '+7%', rr: '~4:1', rrStar: true, edge: 'Held the 50-EMA while the group broke — the standout long, riding the bid trend' },
    side: 'long', accent: 'emerald',
    date: '2026-07-14',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$67.58', change: '−7.83% · Jul 13',
    signal: 'Range broke — flip to short — the $70–80 chop finally resolved down: −7.83% to $67.58 (AH $67.50), knifing below the 4h lower BB ($71) and every EMA on both timeframes (4h 9/50 $73/$78, daily 9/200 $78) — now under its daily 200-EMA. 4h RSI 29 is deeply oversold, so don’t chase: fade the bounce into $73–78, stop $80; targets $63 → $60 → $57. Reclaim $80 puts it back in the range. High-beta — size small',
    side: 'short', accent: 'violet',
    date: '2026-07-13',
    story: 'stories/asts.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$194.09', change: '−7.80% · Jul 14',
    signal: 'The one still breaking down — −7.80% to $194.09 (AH $194.60), the only name that fell while the group bounced; blew clean through T1 $207 → $200 toward $192. Daily under the 9/50-EMA ($226/$217), MACD negative and accelerating, sitting on the lower BB $188 — a genuine downtrend, not a bounce. The cleanest, only-confirming short in the book. Now extended/oversold, so don’t chase $194 — fade a bounce into $220–228, stop $235; targets $200 → $192 → $183. Reclaim $228 neutralizes',
    lead: { rank: 2, entry: '$220–228 bounce', stop: '$235', targets: '$200 → $192 → $183', downside: '−12%', rr: '~3:1', edge: 'The only name still breaking down — blew through T1, momentum accelerating' },
    side: 'short', accent: 'indigo',
    date: '2026-07-14',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$595.70', change: '+3.53% · Jul 14',
    signal: 'Bounced back into the fade zone — low-conviction short — +3.53% to $595.70 (AH $595) on the group relief, recovering into the $590–605 zone. Daily is a strong uptrend ($300 → $640) in a shallow pullback: still above every MA, MACD barely negative, OBV near highs. A countertrend fade of a healthy trend — fade $590–605, stop $615; targets $544 → $526 → $510. Lose $544 accelerates; reclaim $605 neutralizes — respect the range',
    side: 'short', accent: 'red',
    date: '2026-07-14',
    story: 'stories/amat.html',
  },
  {
    symbol: 'BE', exchange: 'NYSE',
    price: '$243.35', change: '+4.22% · Jul 14',
    signal: 'Bouncing toward the broken stack — +4.22% to $243.35 (AH $243.59) off T1 $226, heading up toward the $256–280 re-short zone. Daily under the 9-EMA $258 / 50-EMA $265 (downtrend) but above the rising 200-EMA $185, MACD negative and rolling, OBV declining. Re-short the bounce into $256–280, stop $296; targets $226 → $210 → $183. Reclaim $296 negates',
    lead: { rank: 6, entry: '$256–280', stop: '$296', targets: '$226 → $210 → $183', downside: '−32%', rr: '3:1', edge: 'Downtrend under the fast MAs — bouncing toward the re-short stack' },
    side: 'short', accent: 'amber',
    date: '2026-07-14',
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
