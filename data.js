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
    symbol: 'COHR', exchange: 'NYSE',
    price: '$285.85', change: '−4.51% · Jul 16 pre-market',
    signal: 'First weekly-structure break of the whole $50 → $450 run — knifed through the 21-week MA $321 and out the daily lower BB; pre-market $285.85 (daily RSI 34). Fade a bounce into $305–320 (broken 1h stack + daily 9-EMA); targets $265 → $247 → $215. 🕳️ Deep-correction bottom: 50-week ~$247 → weekly lower BB ~$215. Reclaim $332 negates.',
    lead: { rank: 3, status: 'wait', entry: '$305–320', stop: '$332', targets: '$265 → $247 → $215', downside: '−31%', rr: '~3.5:1', edge: 'Freshest weekly-structure break — knifed through the 21-week MA on OBV rolling off record highs; daily 200-EMA $265 the first magnet, then 50-week $247' },
    side: 'short', accent: 'violet',
    date: '2026-07-16',
    story: 'stories/cohr.html',
  },
  // ── Session status · 2026-07-15 ────────────────────────────────────────────
  // Revisited to the Jul 15 CLOSE: MU, SMH, STX, INTC, AMAT, TER, AAOI, WDC, SNDK.
  // ⏳ NOT YET REVISITED (still earlier Jul 15 intraday) — pick up next session:
  //    GLW, ASTS, NBIS.  (also ALAB, CRDO, DELL — added on main, at intraday)
  //    Each is tagged inline below with:  ⏳ TODO revisit → Jul 15 close
  // Jul 16 pre-market: COHR added (weekly-structure break); BE refined — old
  // T1 $226 tagged pre-market, plan pulled down to the fresh broken stack.
  //
  // ── Re-rated 2026-07-16 ── ranks now order by setup SOLIDITY (structure
  // quality, freshness, tight invalidation, no outside contingency), NOT by
  // remaining downside %. Break-and-retest / fresh-distribution setups rank
  // above already-paid fades and shorts leaning on a support that held.
  // ───────────────────────────────────────────────────────────────────────────
  {
    symbol: 'AAOI', exchange: 'NASDAQ',
    price: '$109.09', change: '−13.04% · Jul 15 close',
    signal: 'Parabola fade paid in full — closed −13.04% at $109.09, bought its dip at the daily 200-EMA $102 (oversold). Fade a bounce $116–126; targets $101 → $90 → $82. 🕳️ Deep-correction bottom: weekly 21-MA ~$58 → 50-week ~$47. Reclaim $132 negates.',
    lead: { rank: 7, status: 'wait', entry: '$116–126', stop: '$132', targets: '$101 → $90 → $82', downside: '−32%', rr: '~3.5:1', edge: 'Heaviest OBV collapse in the group, but the fade already paid and the dip got bought at the 200-EMA (oversold) — needs the bounce to $116–126 first; deep bottom ~$58–47 (weekly MAs)' },
    side: 'short', accent: 'violet',
    date: '2026-07-15',
    story: 'stories/aaoi.html',
  },
  {
    symbol: 'WDC', exchange: 'NASDAQ',
    price: '$513.84', change: '−8.78% · Jul 15 close',
    signal: 'Range short paid — hit T1 $513 and bought its dip (oversold). Fade a bounce to $558–571; next $491. 🕳️ Deep-correction bottom: daily lower BB / weekly 21-MA ~$440–460 → 200-day / 50-week ~$326–334. Reclaim $580 negates.',
    side: 'short',
    date: '2026-07-15',
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$102.99', change: '−4.43% · Jul 15 close',
    signal: 'Worst OBV in the group — tagged $99.20 (lower BB) and bought back, still oversold. Fade a bounce $110–118; targets $98 → $92 → weekly 21-MA $89. 🕳️ Stage-2 bottom: 200-day $73 → the unfilled $68 gap. Reclaim $124 negates.',
    lead: { rank: 9, status: 'wait', entry: '$110–118', stop: '$124', targets: '$98 → $92 → $89', downside: '−25%', rr: '~2.9:1', edge: 'Worst OBV in the group — but oversold and bought its dip at the lower BB, so the fade needs the bounce first; weekly 21-MA ~$89, then the $68 gap' },
    side: 'short', accent: 'blue',
    date: '2026-07-15',
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$904.28', change: '−8.02% · Jul 15 close',
    signal: 'Memory bellwether — closed on the daily 50-EMA $902, the flush held the line (weakly, Stoch 8). Fade the bounce $955–975; targets $866 → $800 → 21-week $665. 🕳️ Deep-correction bottom: weekly 21-MA ~$665 → 50-week ~$505 (if SMH loses $580). Reclaim $1,005 negates.',
    lead: { rank: 8, status: 'wait', entry: '$955–975 bounce', stop: '$1,005', targets: '$866 → $800 → $665', downside: '−30%', rr: '~4:1', edge: 'Memory bellwether — but the flush HELD the 50-EMA and the deep targets need SMH to lose $580 (it held); wait for the $955–975 bounce' },
    side: 'short', accent: 'cyan',
    date: '2026-07-15',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$342.12', change: '−3.15% · Jul 15 close',
    signal: 'Under the $358–380 demand shelf, oversold (daily Stoch 14) — fade a bounce back into the zone; targets $324 → $300 → $292 (best R:R on the board). Reclaim $390 negates.',
    lead: { rank: 1, status: 'wait', entry: '$358–380', stop: '$390', targets: '$324 → $300 → $292', downside: '−21%', rr: '~6:1', edge: 'Cleanest structure on the board — break-and-retest of the $358–380 demand shelf with the tightest invalidation ($390) and best R:R ~6:1' },
    side: 'short', accent: 'blue',
    date: '2026-07-15',
    story: 'stories/ter.html',
  },
  {
    // ⏳ TODO revisit → Jul 15 close (still earlier intraday)
    symbol: 'GLW', exchange: 'NYSE',
    price: '$187.64', change: '+2.47% · Jul 15',
    signal: 'Lost the 50-day, bouncing into resistance $190–198 — mild pullback short; targets $180 → $167 → $152. Reclaim $198 weakens the thesis.',
    lead: { rank: 6, status: 'wait', entry: '$190–198', stop: '$207', targets: '$180 → $167 → $152', downside: '−19%', rr: '~3:1', edge: 'Lost the 50-day and already bouncing into the $190–198 retest — defined break-and-retest, daily rolling over' },
    side: 'short', accent: 'blue',
    date: '2026-07-15',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,614.99', change: '−8.13% · Jul 15 close',
    signal: 'Parabola fade paying — closed −8.13% at $1,614.99, under the daily 50-EMA $1,647 and extended (oversold). Next $1,572 → $1,536 → $1,488. 🕳️ Deep-correction bottom: weekly 21-MA ~$1,287 → 50-week ~$880. Reclaim $1,733 stalls it. Size small.',
    lead: { rank: 10, status: 'live', entry: '$1,705–1,790 (filled)', stop: '$1,835', targets: '$1,572 → $1,536 → $1,488', downside: '−15%', rr: '3:1', edge: 'Parabola fade paying — under the 50-EMA; deep bottom ~$1,287–880 (weekly MAs); highest-risk name on the board, size small' },
    side: 'short', accent: 'red',
    date: '2026-07-15',
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$590.77', change: '−1.59% · Jul 15 close',
    signal: 'Semis barometer HELD the $580 line — closed $590.77 back above the daily 50-EMA (flush, not break; day 1). A close below → full risk-off → $573 → $557 → weekly 21-MA $513. Reclaim 9-EMA $603 = strength back.',
    side: 'long', accent: 'cyan',
    date: '2026-07-15',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$828.30', change: '−5.69% · Jul 15 close',
    signal: 'Long stopped, flipped short — bounced off $801 but closed below the broken $838 stop. Fade $842–860; targets $770 → $720 → weekly 21-MA $681. 🕳️ Deep-correction bottom: 50-week ~$516. Reclaim $876 repairs the trend.',
    lead: { rank: 11, status: 'wait', entry: '$842–860', stop: '$876', targets: '$770 → $720 → $681', downside: '−20%', rr: '~3:1', edge: 'Long stopped out — flipped short same session (lowest conviction on the board); bounced into the broken shelf, weekly 21-MA ~$681 the magnet' },
    side: 'short', accent: 'amber',
    date: '2026-07-15',
    story: 'stories/stx.html',
  },
  {
    // ⏳ TODO revisit → Jul 15 close (still earlier intraday)
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$66.85', change: '−2.87% · Jul 15',
    signal: 'Grinding lower under the $73–78 zone — short working to $63 → $60 → $57; fade a bounce into the zone. Reclaim $80 puts it back in range. Size small.',
    side: 'short', accent: 'violet',
    date: '2026-07-15',
    story: 'stories/asts.html',
  },
  {
    // ⏳ TODO revisit → Jul 15 close (still earlier intraday)
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$194.09', change: '−7.80% · Jul 15',
    signal: 'The only name still breaking down — through T1, momentum accelerating. Fade a bounce to $220–228; targets $200 → $192 → $183. Reclaim $228 neutralizes.',
    lead: { rank: 4, status: 'wait', entry: '$220–228 bounce', stop: '$235', targets: '$200 → $192 → $183', downside: '−12%', rr: '~3:1', edge: 'Momentum leader of the breakdown — blew through T1, still accelerating' },
    side: 'short', accent: 'indigo',
    date: '2026-07-15',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$579.43', change: '−2.73% · Jul 15 close',
    signal: 'Technical fade, not a fundamental short — closed right on the daily 9-EMA $578 (barely pulled back, weekly RSI 73). Targets $559 → $544 → $526; cleaner re-entry a bounce to $590–605. Equipment benefits from the TSMC buildout — kept off the board. Reclaim $605 negates.',
    side: 'short', accent: 'red',
    date: '2026-07-15',
    story: 'stories/amat.html',
  },
  {
    symbol: 'BE', exchange: 'NYSE',
    price: '$230.60', change: '−3.66% · Jul 16 pre-market',
    signal: 'Downtrend intact — pre-market tags the old T1 $226 at the lower 1h BB, so the plan pulls down to the fresh broken stack. Re-short a bounce into $235–249 (1h 9/50-EMA + daily 9-EMA); targets $211 → $185 → 50-week $170. Reclaim $263 (daily 50-EMA) negates.',
    lead: { rank: 5, status: 'wait', entry: '$235–249', stop: '$263', targets: '$211 → $185 → $170', downside: '−30%', rr: '~3:1', edge: 'Established downtrend under the full MA stack — old T1 tagged pre-market, plan refreshed to the near broken stack; re-short the bounce, not the hole' },
    side: 'short', accent: 'amber',
    date: '2026-07-16',
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
    lead: { rank: 2, status: 'wait', entry: '$435–455 bounce', stop: '$470', targets: '$407 → $386 → $324', downside: '−21%', rr: '~3:1', edge: 'Freshest signal on the board — −9.8% distribution day off the ATH on record OBV outflow, ~27% above the rising 50-day, clean invalidation at the ATH; fade the bounce, don’t chase' },
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
