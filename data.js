// ── Stocks ──────────────────────────────────────────────────────────────────
// Each entry renders one tile in the gallery. Clicking a tile opens its
// interactive story — a self-contained HTML slideshow living in /stories.
//
// Fields:
//   symbol     ticker shown on the tile
//   exchange   listing venue (NASDAQ, NYSE, …)
//   price      last-price label, freeform string (e.g. '$175.18')
//   change     short change label (e.g. '+2% today') or null
//   signal     one tight KEY THESIS shown on the tile — keep it to a sentence or
//              two (setup + trigger + targets). The full analysis lives in the
//              deck, not the card; long paragraphs here just shrink to unreadable.
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
    signal: 'Re-short in the $116–126 fade zone is working — below the whole stack, OBV at new lows. Bias down: $101 → $90 → $82. Reclaim $132 negates.',
    lead: { rank: 1, status: 'live', entry: '$116–126', stop: '$132', targets: '$101 → $90 → $82', downside: '−32%', rr: '~3.5:1', edge: 'Deep daily downtrend + heaviest OBV — now rolling over in the fade zone, short working' },
    side: 'short', accent: 'violet',
    date: '2026-07-15',
    story: 'stories/aaoi.html',
  },
  {
    symbol: 'WDC', exchange: 'NASDAQ',
    price: '$521.32', change: '−7.46% · Jul 15',
    signal: 'Clean breakdown through the whole stack — hardest drop in the group, now oversold. Fade a bounce to $558–571; targets $513 → $491. Reclaim $580 negates.',
    side: 'short',
    date: '2026-07-15',
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$101.14', change: '−6.14% · Jul 15',
    signal: 'Worst OBV in the group, out the bottom of its range — deeply oversold. Fade a bounce into $110–118; targets $98 → $92 → $85. Reclaim $124 negates.',
    lead: { rank: 9, status: 'wait', entry: '$110–118', stop: '$124', targets: '$98 → $92 → $85', downside: '−25%', rr: '~2.9:1', edge: 'Worst OBV in the group — cratering into T1, but deeply oversold; fade a bounce to re-engage' },
    side: 'short', accent: 'blue',
    date: '2026-07-15',
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$911.30', change: '−7.30% · Jul 15',
    signal: 'Memory bellwether — flush to the 50-EMA $902 is being bought. Fade the bounce $955–975; targets $866 → $800 → 21-week $665. Reclaim $1,005 negates.',
    lead: { rank: 2, status: 'live', entry: '$955–975 bounce', stop: '$1,005', targets: '$866 → $800 → $665', downside: '−30%', rr: '~4:1', edge: 'Memory bellwether — weekly rolled over; flush being bought now, 21-week MA ~$665 the correction magnet if $580 breaks' },
    side: 'short', accent: 'cyan',
    date: '2026-07-15',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$343.30', change: '−2.81% · Jul 15',
    signal: 'Broke below the demand shelf $358–380 — fade a bounce back into the zone; targets $324 → $300 → $292 (best R:R on the board). Reclaim $390 negates.',
    lead: { rank: 7, status: 'wait', entry: '$358–380', stop: '$390', targets: '$324 → $300 → $292', downside: '−21%', rr: '~6:1', edge: 'Broke the demand shelf and now under it — fade a bounce back into the zone; best R:R on the board' },
    side: 'short', accent: 'blue',
    date: '2026-07-14',
    story: 'stories/ter.html',
  },
  {
    symbol: 'GLW', exchange: 'NYSE',
    price: '$187.64', change: '+2.47% · Jul 15',
    signal: 'Lost the 50-day, bouncing into resistance $190–198 — mild pullback short; targets $180 → $167 → $152. Reclaim $198 weakens the thesis.',
    lead: { rank: 8, status: 'wait', entry: '$190–198', stop: '$207', targets: '$180 → $167 → $152', downside: '−19%', rr: '~3:1', edge: 'Lost the 50-day — bouncing into resistance, daily rolling over' },
    side: 'short', accent: 'blue',
    date: '2026-07-15',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,675.60', change: '−4.68% · Jul 15',
    signal: 'Parabola fade is paying — blew through the $1,705–1,790 zone toward T1; targets $1,572 → $1,536 → $1,480. Reclaim $1,733 stalls it. Size small.',
    lead: { rank: 4, status: 'live', entry: '$1,705–1,790 (filled)', stop: '$1,835', targets: '$1,572 → $1,536 → $1,480', downside: '−15%', rr: '3:1', edge: 'Parabola fade now paying — blew through the fade zone toward T1; highest-risk, size small' },
    side: 'short', accent: 'red',
    date: '2026-07-15',
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$583.35', change: '−2.83% · Jul 15',
    signal: 'Semis barometer on the $580 line: a close below = full risk-off (green-light shorts, cut longs) → $573 → $557 → 21-week $513. Reclaim $620 = strength back.',
    side: 'long', accent: 'cyan',
    date: '2026-07-15',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$801.39', change: '−8.76% · Jul 15',
    signal: 'Long stopped out — flipped short after losing $838. Fade a bounce into $842–860; targets $782 → $760 → $720. Reclaim $876 repairs the trend.',
    lead: { rank: 10, status: 'wait', entry: '$842–860', stop: '$876', targets: '$782 → $760 → $720', downside: '−12%', rr: '~3:1', edge: 'Long stopped out — broke the $838 trend-stop and flipped short; fade a bounce into the broken shelf' },
    side: 'short', accent: 'amber',
    date: '2026-07-15',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$66.85', change: '−2.87% · Jul 15',
    signal: 'Grinding lower under the $73–78 zone — short working to $63 → $60 → $57; fade a bounce into the zone. Reclaim $80 puts it back in range. Size small.',
    side: 'short', accent: 'violet',
    date: '2026-07-15',
    story: 'stories/asts.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$194.09', change: '−7.80% · Jul 15',
    signal: 'The only name still breaking down — through T1, momentum accelerating. Fade a bounce to $220–228; targets $200 → $192 → $183. Reclaim $228 neutralizes.',
    lead: { rank: 3, status: 'wait', entry: '$220–228 bounce', stop: '$235', targets: '$200 → $192 → $183', downside: '−12%', rr: '~3:1', edge: 'The only name still breaking down — blew through T1, momentum accelerating' },
    side: 'short', accent: 'indigo',
    date: '2026-07-15',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$568.60', change: '−4.55% · Jul 15',
    signal: 'Technical fade, not a fundamental short — out of the $590–605 zone in risk-off; targets $559 → $544 → $526. Daily trend still up: countertrend, kept off the board.',
    side: 'short', accent: 'red',
    date: '2026-07-15',
    story: 'stories/amat.html',
  },
  {
    symbol: 'BE', exchange: 'NYSE',
    price: '$239.13', change: '−1.75% · Jul 15',
    signal: 'Downtrend under the fast MAs — re-short a bounce into $256–280; targets $226 → $210 → $183 (−32%). Reclaim $296 negates.',
    lead: { rank: 6, status: 'wait', entry: '$256–280', stop: '$296', targets: '$226 → $210 → $183', downside: '−32%', rr: '3:1', edge: 'Downtrend under the fast MAs — fade a bounce back into the re-short stack, −32% downside' },
    side: 'short', accent: 'amber',
    date: '2026-07-15',
    story: 'stories/be.html',
  },
  {
    symbol: 'ALAB', exchange: 'NASDAQ',
    price: '$350.62', change: '−3.08% · Jul 15',
    signal: 'Strongest uptrend in the group flushed onto the 50-day $339 — dip-buy $338–352; targets $380 → $400 → $430. Stop on a close < $330; contingent on SMH holding $580.',
    side: 'long', accent: 'emerald',
    date: '2026-07-15',
    story: 'stories/alab.html',
  },
  {
    symbol: 'CRDO', exchange: 'NASDAQ',
    price: '$226.74', change: '−4.00% · Jul 15',
    signal: 'Flushed right onto the 50-day $227 and held the $219 low — dip-buy $219–228; targets $245 → $258 → $290. Stop on a close < $215; contingent on SMH holding $580.',
    side: 'long', accent: 'cyan',
    date: '2026-07-15',
    story: 'stories/crdo.html',
  },
  {
    symbol: 'DELL', exchange: 'NYSE',
    price: '$412.68', change: '−9.80% · Jul 15',
    signal: '−9.80% distribution day off the $470 ATH — fade the parabola, don’t chase the hole. Short a bounce into $435–455; targets $407 → $386 → 50-day $324. Reclaim $470 negates.',
    lead: { rank: 5, status: 'wait', entry: '$435–455 bounce', stop: '$470', targets: '$407 → $386 → $324', downside: '−21%', rr: '~3:1', edge: 'Parabola blow-off — −9.8% distribution day off the ATH on record OBV outflow, ~27% above the rising 50-day; fade the bounce, don’t chase' },
    side: 'short', accent: 'red',
    date: '2026-07-15',
    story: 'stories/dell.html',
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
    symbol: 'warsh-liquidity',
    kicker: 'Стаття',
    tag: 'Макро · Ліквідність',
    title: 'Промивка ліквідністю',
    excerpt: 'Уся дошка червона — але це не «AI закінчився». Warsh переоцінив ставку дисконтування для найдовшого за дюрацією активу ринку. Чому це промивка ліквідністю, а не злам циклу — механізм, три драйвери й чек-лист, який покаже різницю.',
    readTime: '7 хв',
    accent: 'indigo',
    date: '2026-07-15',
    story: 'stories/articles/warsh-liquidity.html',
  },
  {
    type: 'article',
    symbol: 'tsmc-chokepoint',
    kicker: 'Стаття',
    tag: 'Напівпровідники · AI',
    title: 'Одна фабрика',
    excerpt: 'HSBC зрізав ARM через вузьке горло на фабриці — але це історія не про ARM. Це про одну залежність, крізь яку проходить увесь AI-трейд: TSMC. Чому це системний ризик — і чому пам’ять та обладнання, навпаки, стійкіші.',
    readTime: '8 хв',
    accent: 'cyan',
    date: '2026-07-15',
    story: 'stories/articles/tsmc-chokepoint.html',
  },
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
