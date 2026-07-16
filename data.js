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
    lead: { rank: 1, status: 'wait', entry: '$305–320', stop: '$332', targets: '$265 → $247 → $215', downside: '−31%', rr: '~3.5:1', edge: 'Freshest weekly-structure break — knifed through the 21-week MA on OBV rolling off record highs; daily 200-EMA $265 the first magnet, then 50-week $247' },
    side: 'short', accent: 'violet',
    date: '2026-07-16',
    story: 'stories/cohr.html',
  },
  // ── Session status · 2026-07-15 ────────────────────────────────────────────
  // Revisited to the Jul 15 CLOSE: MU, SMH, STX, INTC, AMAT, TER, AAOI, WDC, SNDK.
  // ⏳ NOT YET REVISITED — ALAB, CRDO, DELL (added on main, at Jul 15 intraday).
  // Jul 16 pre-market: COHR added (weekly-structure break); BE, ASTS, NBIS, GLW
  // refreshed — old targets paid through, plans pulled down to the fresh
  // broken stacks (ASTS carries a tactical bounce-scalp trigger too).
  // GLW promoted 6→4: its break-and-retest completed and paid (−7.05% day).
  // DELL FLIPPED short→long: it's a bull flag at the highs (ran $100→$493,
  // consolidating under the ATH), not a distribution top — the −9.8% is a dip
  // to range support. Removed from the board (dip-buy long like ALAB/CRDO);
  // ranks below it shifted up one (board is now 1–10).
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
    lead: { rank: 6, status: 'wait', entry: '$116–126', stop: '$132', targets: '$101 → $90 → $82', downside: '−32%', rr: '~3.5:1', edge: 'Heaviest OBV collapse in the group, but the fade already paid and the dip got bought at the 200-EMA (oversold) — needs the bounce to $116–126 first; deep bottom ~$58–47 (weekly MAs)' },
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
    price: '$101.20', change: '−1.74% · Jul 16 pre-market',
    signal: 'Worst OBV in the group — tagged $99.20 (lower BB) and bought back, pre-market $101.20 under the 50-EMA $106, still oversold (Stoch 8). Fade a bounce $110–118; targets $98 → $92 → weekly 21-MA $89. 🕳️ The $89 weekly 21-MA is the gate: lose it (and SMH $580) and there’s an air pocket to the rising 200-EMA ~$73 → the unfilled $66 gap (~−35%, full round-trip of the $50→$145 rally). Reclaim $124 negates.',
    lead: { rank: 8, status: 'wait', entry: '$110–118', stop: '$124', targets: '$98 → $92 → $89', downside: '−25%', rr: '~2.9:1', edge: 'Worst OBV in the group — oversold, so the fade needs the bounce first; weekly 21-MA $89 is the gate to the air pocket down to the $66 gap / 200-EMA' },
    side: 'short', accent: 'blue',
    date: '2026-07-16',
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$904.28', change: '−8.02% · Jul 15 close',
    signal: 'Memory bellwether — closed on the daily 50-EMA $902, the flush held the line (weakly, Stoch 8). Fade the bounce $955–975; targets $866 → $800 → 21-week $665. 🕳️ Deep-correction bottom: weekly 21-MA ~$665 → 50-week ~$505 (if SMH loses $580). Reclaim $1,005 negates.',
    lead: { rank: 7, status: 'wait', entry: '$955–975 bounce', stop: '$1,005', targets: '$866 → $800 → $665', downside: '−30%', rr: '~4:1', edge: 'Memory bellwether — but the flush HELD the 50-EMA and the deep targets need SMH to lose $580 (it held); wait for the $955–975 bounce' },
    side: 'short', accent: 'cyan',
    date: '2026-07-15',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$328.96', change: '−3.85% · Jul 16 pre-market',
    signal: 'Broke the $358–380 shelf and fell straight to T1 — pre-market $328.96, basically at $324 and deeply oversold (RSI 27, Stoch 18). The clean retest never came, so the plan pulls down: fade a bounce into $342–356 (broken VWAP $345 / 9-EMA $353), stop $366; targets $324 → $300 → $292 (200-EMA). Reclaim $390 negates.',
    lead: { rank: 2, status: 'wait', entry: '$342–356 bounce', stop: '$366', targets: '$324 → $300 → $292', downside: '−16%', rr: '~3.5:1', edge: 'Clean shelf-break confirmed and following through — fell straight to T1 without the retest; refreshed re-short zone at the broken VWAP/9-EMA, R:R now compressed since most of the first leg is done' },
    side: 'short', accent: 'blue',
    date: '2026-07-16',
    story: 'stories/ter.html',
  },
  {
    symbol: 'GLW', exchange: 'NYSE',
    price: '$169.53', change: '−2.81% · Jul 16 pre-market',
    signal: 'Break-and-retest paid — the $190 bounce got sold for a −7.05% distribution day (low $167.09), T1 $180 done; pre-market $169.53, 1h RSI 29. Re-short a bounce into $174–182 (1h stack); targets $167 → $155 (daily lower BB) → 200-day $141. Reclaim $186 (weekly 9-EMA) negates.',
    lead: { rank: 3, status: 'wait', entry: '$174–182', stop: '$186', targets: '$167 → $155 → $141', downside: '−21%', rr: '~3.5:1', edge: 'Break-and-retest completed and paid — the retest got sold for a −7.05% distribution day on an OBV low; T1 done, refreshed zone right overhead' },
    side: 'short', accent: 'blue',
    date: '2026-07-16',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,514.00', change: '−6.25% · Jul 16 pre-market',
    signal: '✓ Closed for full profit — the short from $1,705–1,790 hit its take-profit at T3 $1,488 (≈ +15%). Now flat and oversold (1h RSI 31), so a bounce is likely. Next trade: fade the bounce into $1,580–1,626 (stop $1,680) for a fresh leg down — $1,488 retest, then the deep parabola-unwind at the weekly 21-MA $1,287 → 50-week $880. Reclaim $1,680 ends the bias.',
    lead: { rank: 9, status: 'wait', entry: '$1,580–1,626 bounce', stop: '$1,680', targets: '$1,488 → $1,287 → $880', downside: '−20%', tail: '−45%', rr: '~4:1', edge: '✓ Booked ≈ +15% (short $1,705–1,790 → TP $1,488). Re-load on the bounce: fade $1,580–1,626 for the deep parabola unwind toward the weekly 21-MA $1,287' },
    side: 'short', accent: 'red',
    date: '2026-07-16',
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
    price: '$786.26', change: '−5.08% · Jul 16 pre-market',
    signal: 'Flip-short working — closed −5.69% $828, pre-market $786.26 under the whole 1h stack and near T1 $770. But oversold (1h RSI 29, Stoch 7.8) at the lower BB, so don’t chase: fade a bounce into $805–825 (broken VWAP $817 / 1h 9-EMA $825), stop $848. Targets $770 → $720 → weekly 21-MA $681. 🕳️ Deep: 50-week ~$516. Reclaim $876 repairs the trend.',
    lead: { rank: 10, status: 'wait', entry: '$805–825 bounce', stop: '$848', targets: '$770 → $720 → $681', downside: '−16%', rr: '~3.5:1', edge: 'Flip-short following through — broke the trend-stop and pressing new lows near T1; refreshed re-short zone sits at the freshly broken VWAP/9-EMA, weekly 21-MA $681 the magnet' },
    side: 'short', accent: 'amber',
    date: '2026-07-16',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$59.73', change: '−9.92% · Jul 16 pre-market',
    signal: 'Flushed −9.9% pre-market straight through the plan — T1 $63 and T2 $60 paid, low $57.95, stretched under every band. Bounce scalp only on a reclaim of $61 (stop < $56.5, targets $63 → $66 → $69; skip if the catalyst is dilution). Re-short refreshed lower: $66–70, stop $72; targets $63 → $60 → $57. 🕳️ Deeper: $49 shelf → 200-week $41. Size small.',
    side: 'short', accent: 'violet',
    date: '2026-07-16',
    story: 'stories/asts.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$193.30', change: '−3.11% · Jul 16 pre-market',
    signal: 'Breakdown leader — T1 $200 and T2 $192 paid (low $190); the +2.79% bounce stalled right under the 1h 50-EMA and pre-market takes it back. Re-short the bounce into $202–215 (1h 50-EMA → daily 50-EMA); targets $190 → $177 → 200-day $147. Reclaim $219 (1h 200-EMA) neutralizes.',
    lead: { rank: 4, status: 'wait', entry: '$202–215', stop: '$219', targets: '$190 → $177 → $147', downside: '−29%', rr: '~3:1', edge: 'Breakdown leader — first bounce already failing at the 1h 50-EMA; T1/T2 paid, refreshed re-short zone sits just overhead' },
    side: 'short', accent: 'indigo',
    date: '2026-07-16',
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
    lead: { rank: 5, status: 'wait', entry: '$235–249', stop: '$263', targets: '$211 → $185 → $170', downside: '−30%', rr: '~3:1', edge: 'Established downtrend under the full MA stack — old T1 tagged pre-market, plan refreshed to the near broken stack; re-short the bounce, not the drop' },
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
    price: '$401.00', change: '−2.71% · Jul 16 pre-market',
    signal: 'Not a short — a bull flag at the highs. Ran $100 → $493, now consolidating just under the ATH (weekly RSI 71, MACD +, OBV record). The −9.8% day is a pullback into range support ($389 lower BB / $391 week low / $377 weekly 9-EMA), not a breakdown. Dip-buy $389–402; targets $420 → $460 → ATH $490. ⚠️ Exit on a close < $377 — no support until the $330 gap-fill (−18% air). Contingent on SMH holding $580.',
    side: 'long', accent: 'emerald',
    date: '2026-07-16',
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
