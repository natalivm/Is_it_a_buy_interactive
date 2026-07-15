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
    price: '$101.14', change: '−6.14% · Jul 15',
    signal: 'Cratered out the bottom — −6.14% to $101.14 intraday Jul 15, capitulating with the group as the Warsh AI-trade unwind accelerates. Blew clean out of its range, now pressing the lower BB ~$98.61 with the re-short zone $110–118 far overhead; RSI 29, Stochastics 7, OBV crashing to −109m (the relentless distribution the thesis flagged). The short is paying right into its first target $98 — but it is deeply oversold here, so don’t chase $101; fade a bounce back into $110–118, stop $124; targets $98 → $92 → $85. Stage 2, if $85 and SMH’s $580 both give way, opens the deeper leg: the daily 200-EMA $73 → the unfilled $68 breakout gap (~−33% from here — a full trend reversion, not the base case). Reclaim $124 negates',
    lead: { rank: 8, status: 'wait', entry: '$110–118', stop: '$124', targets: '$98 → $92 → $85', downside: '−25%', rr: '~2.9:1', edge: 'Worst OBV in the group — cratering into T1, but deeply oversold; fade a bounce to re-engage' },
    side: 'short', accent: 'blue',
    date: '2026-07-15',
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$911.30', change: '−7.30% · Jul 15',
    signal: 'At the daily 50-EMA — flush being bought — −7.30% to $911.30 intraday Jul 15, but the daily tells the real story: price knifed to $873.63 (tagging the lower daily BB $866) and was bought back to $911 — a bounce off the daily 50-EMA $902, dip-buying at structural support, the signature of a liquidity flush rather than a cycle break. The $973-break re-short already paid; this is now a decision point, and the downside is staged across timeframes: hold here → flush; lose the $866 shelf → the May base $750–800; and only if SMH loses $580 and stays lost does the weekly open its real correction magnet, the 21-week MA ~$665 (−27%), with the 50-week EMA ~$505 the deep-bear level. Don’t chase $911 — re-short a bounce into $955–975; reclaim $1,005 negates',
    lead: { rank: 2, status: 'live', entry: '$955–975 bounce', stop: '$1,005', targets: '$866 → $800 → $665', downside: '−30%', rr: '~4:1', edge: 'Memory bellwether — weekly rolled over; flush being bought now, 21-week MA ~$665 the correction magnet if $580 breaks' },
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
    price: '$583.35', change: '−2.83% · Jul 15',
    signal: 'Barometer at the line — testing $580 — −2.83% to $583.35 intraday Jul 15 as the Warsh AI-trade selloff hits the whole tape. Now sitting right on the daily 50-EMA / $580 regime line and the lower 1h BB: below the entire 1h stack (9/50/200-EMA $594/$598/$607, VWAP $590), RSI 35, OBV crashing to fresh lows. On the weekly it just printed a bearish rejection candle off the $610 highs with MACD rolling over — the first real momentum top after a huge run, and a mean-reversion toward the 21-week MA ~$513 (−12%) is on the table while the multi-year uptrend (50-wk EMA $443) stays intact. Near-term the decision is $580: a close under = full risk-off (green-light shorts, cut longs — STX has already broken its stop), targets $573 → $557 → then the weekly $513. Reclaim $592–600 keeps the group dip-buy alive',
    side: 'long', accent: 'cyan',
    date: '2026-07-15',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$801.39', change: '−8.76% · Jul 15',
    signal: 'Long stopped — flipped short — −8.76% to $801.39 intraday Jul 15, the memory long cratering clean through the $842 daily 50-EMA and the $838 trend-stop the plan set. That break flips the thesis: the dip-buy is dead and the bias is now down. Under the whole stack and below the lower BB $842, MACD −13.8, OBV new lows, Stochastics 8 — deeply oversold, so don’t chase $801; a bounce back into the broken $842–860 shelf is the short entry, targets $782 → $760 → $720. Reclaim $876 repairs the trend and negates',
    lead: { rank: 9, status: 'wait', entry: '$842–860', stop: '$876', targets: '$782 → $760 → $720', downside: '−12%', rr: '~3:1', edge: 'Long stopped out — broke the $838 trend-stop and flipped short; fade a bounce into the broken shelf' },
    side: 'short', accent: 'amber',
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
    price: '$568.60', change: '−4.55% · Jul 15',
    signal: 'Technical fade — not a fundamental short — −4.55% to $568.60 intraday Jul 15, the Warsh AI-trade selloff dragging it out of the $590–605 fade zone and under every 1h MA (9/50/200-EMA $576/$585/$599, VWAP $578) toward the lower BB $559; RSI 35, MACD −4.7, Stochastics 22. The fade is paying in the risk-off tape — but treat it as exactly that: a countertrend momentum trade. AMAT is WFE equipment — a structural beneficiary of the TSMC capacity buildout that has to break the foundry bottleneck — and the daily is still a strong uptrend, so the structural story argues the other way. Take profits into targets and respect the range: $559 → $544 → $526. A bounce into $590–605 is the cleaner re-entry; reclaim $605 neutralizes. Kept off the leaderboard by design — lower conviction than the clean broken-trend shorts',
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
