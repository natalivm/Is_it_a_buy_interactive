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
    price: '$276.96', change: '−7.49% · Jul 16 close',
    signal: 'Weekly-structure break following through — closed −7.49% $276.96 (AH $276), knifing further below the 21-week MA $321 toward the daily 200-day. Deeply oversold (daily RSI 33, Stoch 7; 1h RSI 27). The old $305–320 zone is overhead — fade a bounce into $288–302 (broken 1h stack / daily 9-EMA), stop $310; targets $265 (200-day) → 50-week $247 → 🕳️ weekly lower BB $215. Reclaim $321 negates.',
    lead: { rank: 1, status: 'wait', entry: '$288–302 bounce', stop: '$310', targets: '$265 → $247 → $215', downside: '−11%', tail: '−22%', rr: '~3.5:1', edge: 'Freshest weekly-structure break, following through below the 21-week MA on OBV off record highs; deeply oversold, fade the bounce — the daily 200-day $265 the first magnet, then 50-week $247' },
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
    symbol: 'DRAM', exchange: 'CBOE',
    price: '$52.16', change: '−9.13% · Jul 16',
    signal: 'Roundhill Memory ETF — ~75% is three memory names (Micron 25.8%, Samsung ~25%, SK Hynix ~24%, partly via total-return swaps), so it’s driven by Korean *memory* stocks (Samsung/SK Hynix), not the broad KOSPI. A feedback loop: US memory weakens → Samsung/Hynix fall overnight → DRAM gaps down at the US open → weakness feeds back into MU/SNDK/WDC/STX. Full momentum breakdown: −35.5% from $80.90, below every MA on falling OBV. Deeply oversold (4h Stoch 7) so a violent 8–12% bounce is likely — but it’s a lower high, not a bottom. Fade $55.5–58 (50–61% fib + broken stack), stop $61.5; targets $50 → key cluster $47.5–48.5 (61.8% fib + rising 50-day + lower BB $46.5) → $42–44. 🕳️ Washout $38.5–40. A close &gt;$61 + retest flips it neutral.',
    lead: { rank: 11, status: 'wait', entry: '$55.5–58 bounce', stop: '$61.5', targets: '$50 → $48 → $43', downside: '−8%', tail: '−25%', rr: '~2.8:1', edge: 'Korean-memory basket (≈75% in Micron/Samsung/SK Hynix via swaps) in a full momentum breakdown, −35.5% off the high; oversold bounce likely but no bottom yet — fade the lower high into $55.5–58, the $47.5–48.5 fib/50-day cluster is the magnet, $61 is the regime-change line' },
    side: 'short', accent: 'indigo',
    date: '2026-07-16',
    story: 'stories/dram.html',
  },
  {
    symbol: 'AAOI', exchange: 'NASDAQ',
    price: '$100.24', change: '−8.11% · Jul 16 close',
    signal: 'Parabola fade paid to T1 — closed −8.11% $100.24 (AH $100.7), sitting right on the daily 200-day $100 / old T1 $101, deeply oversold (daily Stoch 13, 1h RSI 30). The old $112–126 zone is overhead — fade a bounce into $104–113 (broken 1h mid-BB $104 / 50-EMA $110), stop $120; targets $90 → $82 → 🕳️ weekly 21-MA $58. A loss of the $100 200-day opens $90. Reclaim $120 negates.',
    lead: { rank: 6, status: 'wait', entry: '$104–113 bounce', stop: '$120', targets: '$90 → $82 → $58', downside: '−18%', tail: '−42%', rr: '~3.5:1', edge: 'Heaviest OBV collapse in the group — fade paid to T1, now sitting on the daily 200-day $100 deeply oversold; fade the bounce into the broken $104–113 stack, the weekly 21-MA $58 the deep bottom' },
    side: 'short', accent: 'violet',
    date: '2026-07-16',
    story: 'stories/aaoi.html',
  },
  {
    symbol: 'WDC', exchange: 'NASDAQ',
    price: '$466.81', change: '−9.15% · Jul 16 close',
    signal: 'Range short paid big — closed −9.15% $466.81 (AH $467.79), blew through T1 $513 and $491, now at the daily lower BB $464. Deeply oversold (daily Stoch 18, 1h RSI 32, Stoch 13). Fade a bounce into $486–513 (broken 1h 9-EMA / prior support), stop $535; targets $446 → weekly 21-MA $440 → 🕳️ 200-day $333. Reclaim $535 negates.',
    side: 'short',
    date: '2026-07-15',
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$96.98', change: '−5.84% · Jul 16 close',
    signal: 'Worst OBV in the group — closed −5.84% $96.98 (AH $96.65), below the daily lower BB $103.6 and the old T1 $98. Deeply oversold (daily Stoch 8, 1h RSI 32). The old $110–118 zone is overhead — fade a bounce into $103–111 (broken daily lower BB / 1h 9-EMA), stop $118; targets $92 → weekly 21-MA $89 → 🕳️ 200-EMA $73. The $89 weekly 21-MA is the gate to the air pocket down to the unfilled $66 gap. Reclaim $118 negates.',
    lead: { rank: 8, status: 'wait', entry: '$103–111 bounce', stop: '$118', targets: '$92 → $89 → $73', downside: '−8%', tail: '−25%', rr: '~3:1', edge: 'Worst OBV in the group — closed below the daily lower BB, deeply oversold; fade the bounce into the broken $103–111 stack, the weekly 21-MA $89 the gate to the air pocket down to the $66 gap' },
    side: 'short', accent: 'blue',
    date: '2026-07-16',
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$853.20', change: '−5.65% · Jul 16 close',
    signal: 'Memory bellwether — the fade worked. Friday spiked from a $804 low straight to $903.93 (into the $880–910 fade zone), got rejected and closed $848.95 (−0.50%), AH $838.60, with the low nearly tapping T1 $800. Deeply oversold (daily Stoch 8) so a reflex bounce is likely first, but the engine points down. Re-short the next bounce into $880–905 (Friday’s rejection high), stop over $904 ($955); targets $800 → weekly 21-MA $665 → 🕳️ 50-week $505. With SMH under $580, the deep leg is live. Reclaim $1,005 negates.',
    lead: { rank: 7, status: 'wait', entry: '$880–905 bounce', stop: '$955', targets: '$800 → $665 → $505', downside: '−22%', tail: '−41%', rr: '~4:1', edge: 'Memory bellwether — Friday’s bounce tagged $903.93 into the fade zone and got sold (close $849, low $804 near T1 $800); re-short the next bounce into $880–905, weekly 21-MA $665 the magnet, 50-week $505 live since SMH lost $580' },
    side: 'short', accent: 'cyan',
    date: '2026-07-16',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$322.30', change: '−5.79% · Jul 16 close',
    signal: 'Shelf-break followed all the way through — closed −5.79% $322.30 (AH $322.87), below the old T1 $324 and the daily lower BB $341. Deeply oversold (daily Stoch 12, 1h RSI 34, Stoch 15). The old $342–356 zone is now overhead — fade a bounce into $332–346 (broken 1h mid-BB $332 / 50-EMA $340 / VWAP $345), stop $358; targets $308 → $292 → 🕳️ 200-EMA $280. Reclaim $358 negates.',
    lead: { rank: 2, status: 'wait', entry: '$332–346 bounce', stop: '$358', targets: '$308 → $292 → $280', downside: '−9%', tail: '−13%', rr: '~3:1', edge: 'Clean shelf-break followed all the way through T1 to the daily lower BB, deeply oversold (Stoch 12); fade the bounce into the broken $332–346 stack, the 200-EMA $280 the magnet' },
    side: 'short', accent: 'blue',
    date: '2026-07-16',
    story: 'stories/ter.html',
  },
  {
    symbol: 'GLW', exchange: 'NYSE',
    price: '$158.39', change: '−9.19% · Jul 16 close',
    signal: 'Break-and-retest paid big — closed −9.19% $158.39 (AH $158), blew through T1 $180 and $167 toward the daily lower BB. Deeply oversold (daily Stoch 6, 1h RSI 24). The old $174–182 zone is far overhead — fade a bounce into $165–175 (broken 1h stack / prior $167 support), stop $184; targets $151 → daily lower BB $144 → 🕳️ $130. Reclaim $184 negates.',
    lead: { rank: 3, status: 'wait', entry: '$165–175 bounce', stop: '$184', targets: '$151 → $144 → $130', downside: '−9%', tail: '−18%', rr: '~3:1', edge: 'Break-and-retest paid big — blew through T1 and $167 on an OBV collapse toward the daily lower BB, deeply oversold (1h RSI 24); fade the bounce into the broken $165–175 stack, the daily lower BB $144 the magnet' },
    side: 'short', accent: 'blue',
    date: '2026-07-16',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,354.82', change: '−3.99% · Jul 17 close · AH $1,341',
    signal: '✓ Booked ≈ +15% earlier — and the fade paid again Friday: the bounce tagged $1,501.20 (into the $1,470–1,536 zone), got rejected and closed −3.99% $1,354.82 (AH $1,341), booking T1 $1,363. Now sitting on the daily lower BB $1,351, deeply oversold (daily Stoch 7) so a reflex bounce is likely — re-short the next bounce into $1,470–1,536, stop $1,590; next targets weekly 21-MA $1,287 → 🕳️ 50-week $880. With SMH under $580, the deep unwind is live. Reclaim $1,590 ends the bias.',
    lead: { rank: 9, status: 'wait', entry: '$1,470–1,536 bounce', stop: '$1,590', targets: '$1,287 → $880', downside: '−5%', tail: '−35%', rr: '~4:1', edge: '✓ Booked ≈ +15%; Friday the bounce tagged $1,501 into the fade zone and got sold, booking T1 $1,363. Re-short the next bounce into $1,470–1,536 — weekly 21-MA $1,287 the magnet, 50-week $880 the deep unwind while SMH stays under $580' },
    side: 'short', accent: 'red',
    date: '2026-07-16',
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$556.53', change: '−2.18% · Jul 17 close · AH $554',
    signal: 'Barometer sliced into the shelf — day low $536.81 (testing toward the $510–515 magnet), then bounced to $567.41 and closed $556.53 (−2.18%), only to fade into the bell and slip to $554 AH: the bounce got sold. Still a confirmed break — the close sits below the $580 line, the daily 50-EMA $579 AND the daily lower BB $568, deeply oversold (daily RSI 41, Stoch curling up from 21; 4H MACD ticking green). This is the oversold dead-cat bounce the whole short board is built to fade. Oil +4.5% (Brent +4.6%) on the Iran development adds a geopolitical risk-off tailwind. The $510–515 confluence magnet stays live; only a reclaim of $580 / 9-EMA $594 repairs.',
    side: 'short', accent: 'red',
    date: '2026-07-17',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$787.66', change: '+5.66% · Jul 17 close · AH $787',
    signal: 'Strongest name on the board — bounced +5.66% off a $700.39 low and closed green $787.66 (AH flat $786.80), the only green name while MU/SNDK sold their bounces. That runs it straight into the $770–790 fade zone, right at the 1h 50-EMA $790 with 1h Stoch overbought at 88. The short is still on — fade the test of $789–798, stop $822 — but respect the relative strength: a reclaim of $822–835 takes the short off. Targets $720 (61.8% fib) → weekly 21-MA $681 → 🕳️ 50-week $516, live while SMH stays under $580.',
    lead: { rank: 10, status: 'wait', entry: '$789–798 test', stop: '$822', targets: '$720 → $681 → $516', downside: '−9%', tail: '−31%', rr: '~3:1', edge: 'Strongest name — closed green +5.66% into the $770–790 fade zone at the 1h 50-EMA $790; fade the test of $789–798 but respect the strength — reclaim $822–835 takes the short off, weekly 21-MA $681 the magnet' },
    side: 'short', accent: 'amber',
    date: '2026-07-16',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$55.01', change: '−17.04% · Jul 16 close',
    signal: 'Flushed −17.04% $55.01 (AH bounce $55.80) — knifed through T1 $63, T2 $60 and $57, now below the daily 200-day $63. Deeply oversold (daily Stoch 10, 1h RSI 35). The old $66–70 zone is far overhead — fade a bounce into $60–66 (broken bands), stop $71; targets $51 → $49 shelf → 🕳️ 200-week $41. Size small (dilution risk). Reclaim $71 negates.',
    side: 'short', accent: 'violet',
    date: '2026-07-16',
    story: 'stories/asts.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$171.77', change: '−13.90% · Jul 16 close',
    signal: 'Breakdown leader paid big — closed −13.90% $171.77 (AH $172.30). Blew through T1 $190 and T2 $177; now below the daily lower BB $188, deeply oversold (1h RSI 22, Stoch 13; daily Stoch 10). The old $202–215 zone is far overhead — fade the bounce into $185–200 (broken daily lower BB / round $200), stop $213; targets $160 → 200-day $147 → 🕳️ $130. Reclaim $213 neutralizes.',
    lead: { rank: 4, status: 'wait', entry: '$185–200 bounce', stop: '$213', targets: '$160 → $147 → $130', downside: '−14%', tail: '−24%', rr: '~3:1', edge: 'Breakdown leader paid big — −13.9% blew through T1/T2, now below the daily lower BB deeply oversold (1h RSI 22); fade the bounce into the broken $185–200 stack, the 200-day $147 the magnet' },
    side: 'short', accent: 'indigo',
    date: '2026-07-16',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$560.93', change: '−3.19% · Jul 16 close',
    signal: 'Technical fade, not a fundamental short — closed −3.19% $560.93 (AH $562.50), right at T1 $559 and the lower 1h BB $560. The daily is still holding up (RSI 48, Stoch 27) while the 1h is oversold (Stoch 21). Cleaner re-short a bounce into $575–590 (broken 1h stack), stop $605; targets $544 → $526 → $510. Equipment benefits from the TSMC buildout — kept off the board. Reclaim $605 negates.',
    side: 'short', accent: 'red',
    date: '2026-07-15',
    story: 'stories/amat.html',
  },
  {
    symbol: 'BE', exchange: 'NYSE',
    price: '$206.73', change: '−13.64% · Jul 16 close',
    signal: 'Downtrend paid big — closed −13.93% $206.03 (AH bounce $208.63). Blew through T1 $226 and T2 $211; now at the daily lower BB $207.5, deeply oversold (1h RSI 27, Stoch 7; daily Stoch 10). The old $235–249 zone is far overhead — fade the bounce into $219–234 (broken 1h 9-EMA $219 / mid-BB $228 / 50-EMA $234), stop $250; targets $200 → daily 200-EMA $185 → 🕳️ 50-week $170. Reclaim $250 negates.',
    lead: { rank: 5, status: 'wait', entry: '$219–234 bounce', stop: '$250', targets: '$200 → $185 → $170', downside: '−10%', tail: '−17%', rr: '~3:1', edge: 'Established downtrend paid big — −13.93% blew through T1/T2, now at the daily lower BB deeply oversold (1h RSI 27); fade the bounce into the broken $219–234 stack, the 200-EMA $185 → 50-week $170' },
    side: 'short', accent: 'amber',
    date: '2026-07-16',
    story: 'stories/be.html',
  },
  {
    symbol: 'ALAB', exchange: 'NASDAQ',
    price: '$319.74', change: '−8.81% · Jul 16 close',
    signal: 'Dip-buy long stopped — closed −8.81% $319.74 (AH $318), a clean close below the $330 stop, the 50-day $339 and the daily lower BB $328, with SMH’s $580 contingency now void. The group’s strongest uptrend just broke; deeply oversold (daily Stoch 10, 1h RSI 32). Flip to a fade: short a bounce into $334–350 (broken 50-day $339 / 1h 50-EMA $349), stop $362; targets $300 (June breakout) → $280 → 🕳️ $250 base. Reclaim $362 repairs.',
    lead: { rank: 13, status: 'wait', entry: '$334–350 bounce', stop: '$362', targets: '$300 → $280 → $250', downside: '−12%', tail: '−22%', rr: '~3:1', edge: 'Dip-buy long stopped (close < $330) and the SMH gate void — the group’s strongest uptrend broke the 50-day, deeply oversold (daily Stoch 10); fade the bounce into $334–350, the June breakout $300 the first magnet' },
    side: 'short', accent: 'emerald',
    date: '2026-07-16',
    story: 'stories/alab.html',
  },
  {
    symbol: 'CRDO', exchange: 'NASDAQ',
    price: '$207.97', change: '−8.28% · Jul 16 close',
    signal: 'Dip-buy long stopped — closed −8.28% $207.97 (AH $207.88), a clean close below the $215 stop and the $219 low, with SMH’s $580 contingency now void. It’s a downtrend: below the daily lower BB and every MA, RSI daily 40 / 1h 35, Stoch 17. Flip to a fade: short a bounce into $219–230 (broken $219 low / 50-day $227), stop $242; targets $200 → $190 → 🕳️ $175 breakout shelf. Reclaim $245 (200-EMA) repairs.',
    lead: { rank: 12, status: 'wait', entry: '$219–230 bounce', stop: '$242', targets: '$200 → $190 → $175', downside: '−9%', tail: '−16%', rr: '~2.5:1', edge: 'Dip-buy long stopped (close < $215) and the SMH gate void — now a downtrend under every MA; fade a bounce into $219–230, targets down to the $175 breakout shelf' },
    side: 'short', accent: 'cyan',
    date: '2026-07-16',
    story: 'stories/crdo.html',
  },
  {
    symbol: 'DELL', exchange: 'NYSE',
    price: '$391.38', change: '−5.16% · Jul 16 close',
    signal: 'Bull-flag long invalidated — SMH lost $580 (its contingency is void) and DELL broke the range: closed −5.16% $391.38 (AH $390), under the 1h stack and the daily mid-BB $421. Not a dip-buy anymore. 1h RSI 30, but the daily isn’t oversold yet (RSI 47, Stoch 62) — room below. Fade a bounce into $402–421 (broken 1h stack $411 / daily mid-BB $421), stop $432; targets $377 (weekly 9-EMA) → $365 (daily lower BB) → 🕳️ $330 gap-fill. A close < $377 opens the air pocket. Reclaim $432 repairs.',
    lead: { rank: 14, status: 'wait', entry: '$402–421 bounce', stop: '$432', targets: '$377 → $365 → $330', downside: '−7%', tail: '−16%', rr: '~2.5:1', edge: 'Bull-flag long invalidated by the SMH break — closed under the 1h stack and daily mid-BB with the daily not yet oversold; fade the bounce into $402–421, a close < $377 opens the air pocket to the $330 gap-fill' },
    side: 'short', accent: 'amber',
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
