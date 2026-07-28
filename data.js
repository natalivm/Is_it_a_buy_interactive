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
    symbol: 'NVDA', exchange: 'NASDAQ',
    price: '$196.51', change: 'pre-market −0.50% $195.54 · basing above $194 · fade a bounce or break <$194',
    signal: 'The leader flipped short — now coiling above the $194 trigger. After the −4.99% flush to close $196.51, NVDA is basing pre-market on the 7/28 open: −0.50% to $195.54, holding just above the $194 break-trigger and below the $199–202 EMA-cluster fade zone. The dip-buy is done — it rejected the $202–206 cluster and closed below the 4H lower Bollinger under the whole MA stack; the relative-strength tell that justified the long has failed. Near-term it is oversold and curling up (1H RSI 32.17, Stoch 41.70 lifting off the low), so a reflex bounce into $199–202 is the cleaner short entry, stop above $206 — or short the decisive break under $194. Either way the target is the 200-day $189 → $182 → $174. Stance: short-biased under $206, coiling $194–199 — fade the bounce into $199–202 or short the break of $194; only a reclaim back over $206 / the EMA cluster repairs the long.',
    lead: { rank: 8, status: 'wait', entry: 'fade $199–202 / break <$194', stop: '$206', targets: '$189 → $182 → $174', downside: '−6%', tail: '−13%', rr: '~3:1', edge: 'The leader flipped short, now coiling above $194 — after the −4.99% flush to $196.51, NVDA is basing −0.50% pre-market to $195.54, holding above the $194 trigger and below the $199–202 EMA-cluster fade zone; the dip-buy failed (rejected $202–206, closed below the 4H lower BB), oversold and curling up (1H Stoch 41.70) so a bounce into $199–202 is the cleaner fade (stop $206) or short the break under $194, targeting the 200-day $189 → $182 → $174 — a reclaim of $206 repairs the long' },
    side: 'short', accent: 'red',
    date: '2026-07-28',
    story: 'stories/nvda.html',
  },
  {
    symbol: 'COHR', exchange: 'NYSE',
    price: '$271.31', change: 'pre-market −5.64% $256.02 · through T1 $265 · driving to T2 $247',
    signal: 'Weekly-structure break — the re-short keeps paying, T1 banked. After closing $271.31 (−3.92%, tagged T1 $265 intraday to ≈ $255), COHR is gapping again on the 7/28 open: −5.64% pre-market to $256.02 — clean through T1 $265 and driving toward T2 $247 (the 50-week). That is ≈ +17% for the short from the $310 re-arm at the pre-market print. Structure is broken — price under the whole daily MA stack. It is now deeply oversold (1H RSI 28.54, Stoch 17.57, MACD −8.03), so a reflex bounce is due — don’t chase the low; a push back into $269–282 is the cleaner re-short add, and the weekly (still repairing) leaves room for the next leg. Next: T1 $265 banked → T2 $247 (50-week) → 🕳️ $215. Stop $321 untouched and far. Stance: re-short deep in the money — trail toward $247/$215, add on a bounce; a pre-market read, only a reclaim of $321 repairs it.',
    lead: { rank: 1, status: 'live', entry: '$310 filled', stop: '$321', targets: '$265 → $247 → $215', downside: '−14%', tail: '−30%', rr: '~5:1', edge: 'Weekly-structure break, re-short paying — after the $271.31 close (tagged T1 $265 intraday) COHR is gapping −5.64% pre-market to $256.02, clean through T1 $265 toward T2 $247 (50-week), ≈ +17% for the short from $310; deeply oversold (1H RSI 28.54, Stoch 17.57) so a push into $269–282 is the cleaner add, T2 $247 → 🕳️ $215, only a reclaim of $321 repairs it' },
    side: 'short', accent: 'violet',
    date: '2026-07-28',
    story: 'stories/cohr.html',
  },
  {
    symbol: 'IREN', exchange: 'NASDAQ',
    price: '$33.93', change: 'close −6.50% $33.93 · AH $34.11 · ✓ T1 $34 tagged · ≈ +13% short',
    signal: 'Flipped short — T1 $34 tagged on the close. IREN closed $33.93 (−6.50%), right at T1 $34 (intraday low $33.86) — the first target essentially banked. That is ≈ +13% for the short from the $38.90 entry. It reflex-bounced in after-hours to $34.11 (+0.53%). Price is under the whole 1H MA stack (9-EMA $35.04, 50-EMA $36.57, 200-EMA $39.13) — structure broken. Near-term it lifted off the low (1H RSI 39.11, Stoch 41.51 from the ~13 low, MACD −0.96), so a reflex bounce is underway — the cleaner short add is a push into $36–38 (9-EMA / 50-EMA), not a chase of the low. The ≈$2.8B AI-cloud catalyst is the risk: a reclaim of $41.70 repairs the long. Next 🎯 $30 (weekly support) → deeper $27; stop $42 far.',
    lead: { rank: 11, status: 'live', entry: '$38.90 filled', stop: '$42', targets: '$34 → $30 → $27', downside: '−13%', tail: '−31%', rr: '~3:1', edge: 'Flipped short, T1 $34 tagged — IREN closed $33.93 (−6.50%), right at T1 (low $33.86, ≈ +13% for the short from $38.90), AH bounce to $34.11; under the whole 1H MA stack, lifting off the low (RSI 39, Stoch 41 from 13) so a push into $36–38 is the cleaner add, stop $42 — 🎯 $30 then $27, a reclaim of $41.70 repairs the long (≈$2.8B AI-cloud catalyst the risk)' },
    side: 'short', accent: 'red',
    date: '2026-07-28',
    story: 'stories/iren.html',
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
    price: '$52.43', change: 'pre-market −8.90% $47.75 · through T1 $50 · into the $47.5–48.5 cluster',
    signal: 'Roundhill Memory ETF — the memory basket is gapping through T1. ~75% is three memory names (Micron 25.8%, Samsung ~25%, SK Hynix ~24%, via total-return swaps), so it tracks memory, not the broad KOSPI. After closing $52.43 (−1.45%), DRAM is gapping −8.90% pre-market to $47.75 — clean through T1 $50 and straight into the key $47.5–48.5 cluster (61.8% fib + rising 50-day + lower BB), the magnet the card flagged. It is deeply oversold near-term (1H RSI 23.78, Stoch 6.35), so a reflex bounce toward $52–54 is the cleaner re-short, not a chase of the low. Next below the cluster: $42–44 → 🕳️ washout $38.5–40. This is a pre-market read — confirm on the cash close; a close &gt;$61 + retest flips it neutral.',
    edge: 'Korean-memory basket (≈75% Micron/Samsung/SK Hynix via swaps) gapping through T1 — after the $52.43 close, DRAM is −8.90% pre-market to $47.75, through T1 $50 into the $47.5–48.5 cluster (61.8% fib + 50-day + lower BB); 1H RSI 23.78 deeply oversold so a bounce toward $52–54 is the cleaner re-short, next $42–44 → washout $38.5–40, $61 the regime-change line',
    side: 'short', accent: 'indigo',
    date: '2026-07-28',
    story: 'stories/dram.html',
  },
  {
    symbol: 'AAOI', exchange: 'NASDAQ',
    price: '$97.82', change: 'pre-market −6.57% $91.39 · at T1 $90',
    signal: 'Heaviest OBV collapse in the group — the fade is at T1. After losing the $100 must-hold Monday (close $97.82, −2.33%), AAOI is gapping lower pre-market: −6.57% to $91.39, right at T1 $90. That is ≈ +19% for the short from the $113 re-arm at the pre-market print. Still pinned under every MA (daily 50-EMA $104, 200-EMA $112), the short is working — T1 $90 essentially tagged → next $82 → 🕳️ weekly 21-MA / $58. It is stretched into the gap, so a bounce into $100–104 is the cleaner add, not a chase of the low; weekly RSI leaves room, the parabola is only part-way unwound. This is a pre-market read — confirm on the cash close under $95; only a reclaim back over $120 ends it.',
    lead: { rank: 6, status: 'live', entry: '$113 filled', stop: '$120', targets: '$90 → $82 → $58', downside: '−16%', tail: '−41%', rr: '~4:1', edge: 'Heaviest OBV collapse in the group — after losing $100, AAOI is gapping −6.57% pre-market to $91.39, right at T1 $90 (≈ +19% for the short from $113); under every MA, next $82 → 🕳️ $58, but stretched into the gap so a bounce into $100–104 is the cleaner add — a pre-market read (confirm on the cash close), only a reclaim over $120 ends it' },
    side: 'short', accent: 'violet',
    date: '2026-07-28',
    story: 'stories/aaoi.html',
  },
  {
    symbol: 'WDC', exchange: 'NASDAQ',
    price: '$497.92', change: 'pre-market −7.44% $460.85 · through T1/T2 · at the $455–461 magnet',
    signal: 'The fence broke and the whole plan is paying. After confirming the break below $513 (close $497.92, −4.21%), WDC is gapping −7.44% pre-market to $460.85 — clean through T1 $486 and T2 $475, now right at T3 $455 / the $457–461 confluence (daily lower BB $457 + weekly mid-BB $461). That is ≈ +10% for the short from the $513 entry at the pre-market print, all three plan targets essentially banked. It is now deeply oversold (1H RSI 26.78, Stoch 8.26), so a reflex bounce is due — the cleaner re-short is a bounce into $486–513, not a chase of the low. Still a deep pullback in an intact weekly uptrend (far above the weekly 50-EMA $339), so $455–461 is the target, not a trend break — take profit into the magnet, don’t press. This is a pre-market read; a reclaim of $525→$535 re-negates.',
    lead: { rank: 10, status: 'live', entry: '$513 filled', stop: '$535', targets: '$486 → $475 → $455', downside: '−5%', tail: '−11%', rr: '~2.5:1', edge: 'The fence broke and it keeps paying — after the $497.92 close below $513, WDC is gapping −7.44% pre-market to $460.85, through T1 $486 and T2 $475 to the T3 $455 / $457–461 magnet (daily lower BB + weekly mid-BB), ≈ +10% for the short from $513 with all three targets essentially banked; deeply oversold (1H RSI 26.78, Stoch 8.26) so a bounce is due — take profit into the magnet, re-short a bounce into $486–513, a reclaim of $525→$535 re-negates' },
    side: 'short',
    date: '2026-07-28',
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$91.67', change: 'pre-market −5.22% $86.89 · BROKE the $89 gate · air pocket opens',
    signal: 'Worst OBV in the group — the $89 gate finally broke. After a quiet Monday close at $91.67 (−0.70%), INTC is gapping hard on the 7/28 open: −5.22% pre-market to $86.89, a decisive break UNDER the $89 gate (weekly 21-MA) the card had flagged. That is the break that opens the air pocket toward the 200-EMA ≈ $69 / the unfilled $66 gap. Structure is broken — price under the whole daily MA stack, worst OBV on the board. Near-term it is deeply oversold (1H RSI 31.69, Stoch 12.41, MACD −2.06), so a reflex bounce is due — a bounce back into $89–92 (the broken gate = new lid) is the cleaner short entry, not a chase of the low. This is a pre-market read — confirm on the cash close under $89. Stance: gate broken, air pocket open toward $69 / $66; a reclaim back over $92 stalls it, and $98–102 negates.',
    edge: 'Worst OBV in the group — the $89 gate broke: after a quiet Monday close ($91.67), INTC is gapping −5.22% pre-market to $86.89, a decisive break under the $89 gate (weekly 21-MA) that opens the air pocket toward the 200-EMA ≈ $69 / the $66 gap; under the whole daily stack, deeply oversold (1H RSI 31.69, Stoch 12.41) so a bounce into $89–92 (broken gate = new lid) is the cleaner short, a pre-market read — a reclaim over $92 stalls it, $98–102 negates',
    side: 'short', accent: 'blue',
    date: '2026-07-28',
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$900.20', change: 'pre-market −6.87% $838.36 · deeper break · driving to T1 $800',
    signal: 'Memory bellwether — the break is extending toward T1. After closing $900.20 (−2.25%) back under the $905 trigger, MU is gapping harder on the 7/28 open: −6.87% to $838.36, now well below both the $886 shelf and the daily 21-mid-BB ($868) — the two levels that had held the chop since June — and pressing straight toward T1 $800. That is ≈ +7% for the short from the $905 entry at the pre-market print, with clean air below. Structure: below the whole 30-min MA stack (≈ $940) and stretched far under the lower Bollinger ($895.91) — a parabola unwinding, with the daily 50-EMA ($714) and 200-EMA far below. The real test is the 50-day $714. One caveat: this is a pre-market gap, not a cash close — confirmation is a daily close that holds under $868; a reclaim back over $886 would be a fakeout. Stance: leg down live and extending → T1 $800 → daily 50-day $714 → weekly 21-MA $665 → 🕳️ $505; only a close back over $955 / $1,005 ends it. The bellwether that dragged the group up is now leading it down.',
    lead: { rank: 7, status: 'live', entry: '$905 filled', stop: '$1,005', targets: '$800 → $714 → $665 → $505', downside: '−11%', tail: '−44%', rr: '~4:1', edge: 'Memory bellwether — the break is extending: after closing $900.20 under the $905 trigger, MU is gapping −6.87% pre-market to $838.36, now well below both the $886 shelf and the daily mid-BB ($868) that held the chop since June, pressing toward T1 $800 (≈ +7% for the short from $905 with clean air below); below the whole MA stack and the lower BB, a parabola unwinding toward the daily 50-day $714 → weekly 21-MA $665 → 🕳️ $505 — a pre-market gap so confirmation is a daily close under $868, a reclaim over $886 is a fakeout' },
    side: 'short', accent: 'cyan',
    date: '2026-07-28',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$320.65', change: 'close −4.22% $320.65 · grinding to T1 $308 · ⚠️ AH +13.19% $362.95 on earnings — short intact, watch tomorrow',
    signal: 'Shelf-break paying into the close — then an after-hours earnings pop to watch. TER closed $320.65 (−4.22%), grinding toward T1 $308 (intraday low $319.61), ≈ +8% for the short from the $346 entry at the close — the fade still working on the cash session. Then it reported after the close and popped +13.19% to $362.95 after-hours, back above the $346 entry and the $358 stop. ⚠️ But that is an after-hours print, not a cash close — the short stays INTACT for now; earnings gaps routinely fade or fill, so the verdict waits for tomorrow’s regular session. The plan: if the cash session tomorrow holds decisively back above $358, the short is negated (stand aside); if the AH pop fades back under the broken $326 / $346, the fade re-arms toward T1 $308 → $292 → 🕳️ 200-EMA $280. Don’t chase either way pre-confirmation — let tomorrow’s open tell you whether the beat sticks. Structure into the close stayed broken (under the whole daily MA stack); the earnings reaction is now the swing factor.',
    lead: { rank: 2, status: 'live', entry: '$346 filled', stop: '$358', targets: '$308 → $292 → $280', downside: '−11%', tail: '−19%', rr: '~4:1', edge: 'Shelf-break paying into the close, then an AH earnings pop to watch — TER closed $320.65 (−4.22%) toward T1 $308 (≈ +8% for the short from $346), then popped +13.19% AH to $362.95 above the $358 stop; ⚠️ that’s after-hours, not a cash close, so the short stays intact — the verdict waits for tomorrow: a cash session that holds over $358 negates it, a fade back under $326/$346 re-arms the fade toward $292 → 🕳️ 200-EMA $280, don’t chase pre-confirmation' },
    side: 'short', accent: 'blue',
    date: '2026-07-28',
    story: 'stories/ter.html',
  },
  {
    symbol: 'GLW', exchange: 'NYSE',
    price: '$126.01', change: 'close −12.10% $126.01 (earnings) · AH $126.33 · through ALL targets · ~+21%',
    signal: 'Earnings detonation — the fade paid in full. GLW reported and gapped to ≈ $119.80, then recovered to close $126.01 (−12.10%, intraday low $124.32) — still clean through T3 $130 (the 200-EMA) and every target on the plan. That is ~+21% for the short from the ~$160 rejection — a complete win, all three targets ($151 → $144 → $130) banked. AH $126.33. At $126 this is a news gap, not a technical level — the trend objective is DONE; there is no fresh short here. The $119.80 → $126 recovery IS the violent dead-cat bounce the card flagged getting going (prior support $128–137 = new resistance overhead), 1H RSI 40.10, Stoch 38.32 lifting. Stance: trade complete, all targets banked — take profit / trail tight; no fresh entry at $126.',
    lead: { rank: 3, status: 'live', entry: '$160 filled', stop: '$184', targets: '$151 → $144 → $130', downside: '−9%', tail: '−14%', rr: '~3:1', edge: 'Earnings detonation — GLW gapped to ≈ $119.80 then recovered to close $126.01 (−12.10%, low $124.32), still through T3 $130 and every target: ~+21% for the short from ~$160, all three banked (a complete win); AH $126.33, the $119.80 → $126 fill is the dead-cat bounce starting (prior support $128–137 = new resistance, 1H RSI 40) so don’t chase — the trend objective is done' },
    side: 'short', accent: 'blue',
    date: '2026-07-28',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,278.23', change: 'pre-market −7.88% $1,177.54 · extending toward 50-week $880',
    signal: '✓ T1 $1,363 AND T2 $1,287 both banked — and the slide keeps extending. After the −11.02% close at $1,278.23, SNDK is gapping again pre-market: −7.88% to $1,177.54, pushing deeper toward the only target left, the 50-week $880. That is ≈ +23% for the short from the $1,536 re-arm at the pre-market print — the biggest winner on the board. It is now extremely oversold (1H RSI 23.35, Stoch 7.30, MACD −69 and expanding), stretched far below every band, so a violent reflex bounce is overdue — do not chase $1,177. Weekly MACD is still hugely positive → a parabola unwinding, not yet a trend break, so this stays staged: bank into strength and re-load a bounce into $1,287–1,363, not the low. Stance: short deeply in the money, trailing toward $880; a pre-market read, only a reclaim of $1,590 ends it.',
    lead: { rank: 9, status: 'live', entry: '$1,536 filled', stop: '$1,590', targets: '$1,287 → $880', downside: '−16%', tail: '−43%', rr: '~4:1', edge: '✓ T1 $1,363 + T2 $1,287 banked — after the −11.02% close SNDK is gapping −7.88% pre-market to $1,177.54, extending toward the only target left, the 50-week $880 (≈ +23% for the short from $1,536, biggest winner on the board); extremely oversold (1H RSI 23.35, Stoch 7.30) so a violent bounce is overdue — bank into strength, re-load a bounce into $1,287–1,363 not the low, only a reclaim of $1,590 ends it' },
    side: 'short', accent: 'red',
    date: '2026-07-28',
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$529.60', change: 'close −3.45% $529.60 · AH $528.62 · through $535, low $524.39 · magnet $510–518 not yet tagged',
    signal: 'The board’s barometer — the fade played out as mapped. After the $547–550 shelf, SMH closed $529.60 (−3.45%), driving clean through the $535 swing-low to an intraday low $524.39 — pressing toward, but not yet reaching, the fat $510–518 confluence (0.5 fib $515 + 21-week MA $513 + open gap $510 + daily lower BB). AH $528.62. It reflex-bounced off the $524 low into the close (1H RSI 38.20, Stoch 40.43 lifting from the ~9 low, MACD −8.10 curling), so a bounce is underway — and the $510–518 magnet is still the target, not yet a bottom (the weekly is nowhere near oversold). Confirmation is now in: a cash close that held under $535. Stance: the barometer’s slide keeps the board’s short fades ARMED and active (COHR / NVDA / MU / TER / WDC / GLW / AAOI …); a long is not the trade. Next: the $510–518 magnet, then only a deeper break under $510 opens the 0.618 ≈ $478. Only a reclaim back over $580 with breadth negates the fade.',
    edge: 'The board’s barometer played out as mapped — SMH closed $529.60 (−3.45%), clean through the $535 swing-low to a $524.39 low, pressing toward the $510–518 confluence (0.5 fib + 21-week MA + gap + daily lower BB) but not yet tagging it; AH $528.62, reflex-bouncing off the low (1H RSI 38, Stoch 40 lifting from 9) so the magnet is the target not a bottom — the cash close held under $535, the slide keeps the board’s fades armed, only a reclaim over $580 negates',
    side: 'short', accent: 'red',
    date: '2026-07-28',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$747.30', change: 'close −8.53% $747.30 · ⚠️ EARNINGS BEAT · AH +7.29% $801.77 (high $830) · low $721 near the weekly $700',
    signal: 'The fence broke and the fade paid — then earnings reversed it. STX closed $747.30 (−8.53%), a clean break THROUGH the $788 prior low and the $770–835 structure, with an intraday low $721.00 pressing right into the weekly 21-MA ≈ $700 magnet the card wanted — the short paid in full down toward the target. THEN it reported after the close and squeezed +7.29% to $801.77 after-hours (spiking to $830), a violent post-beat reversal that lifted price back above the broken $770–788 structure. This is the binary risk playing out the same way BE’s did: the technical fade banked the move into the print, but the earnings beat flips the near-term read — there is no fresh short into a post-beat squeeze at $801, and the AH pop back over the broken shelf ($770–788) is a bullish tell. Still a pullback in an intact weekly uptrend (far above the 50-EMA), so let the earnings reaction settle; a hold back above $788 repairs the structure, while a fade back under $770 would re-arm the slide toward $700.',
    edge: 'The fence broke and the fade paid — then earnings reversed it: STX closed $747.30 (−8.53%), clean through the $788 low and the $770–835 structure to a $721 low, pressing the weekly 21-MA ≈ $700 magnet, ⚠️ then the earnings BEAT squeezed it +7.29% AH to $801.77 (high $830) back above the broken $770–788 shelf; the technical fade banked into the print but the beat flips the near-term read — no short into a post-beat squeeze, a hold over $788 repairs the structure while a fade back under $770 re-arms the slide toward $700',
    side: 'short', accent: 'amber',
    date: '2026-07-28',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$58.29', change: 'pre-market −2.63% $56.76 · squeeze faded · rolling back toward the $56 line',
    signal: 'Flipped short — the squeeze faded, the short gets relief. After squeezing +3.72% Monday to close $58.29 (reclaiming the 50-EMA and pushing over the $57 entry), ASTS is rolling back over on the 7/28 open: −2.63% pre-market to $56.76, back under the $57.50 50-EMA it had reclaimed and pressing toward the $56 must-hold-below line. Momentum has turned back down (1H RSI 42.65 from 55, Stoch 20.71 rolling over, MACD −0.22 crossing negative) — the failing fade the card flagged is re-firing, not extending up. The short holds ONLY below $61, and a decisive roll under $56 re-confirms it toward the lows; per the plan the B. Riley Buy $85 / Midland catalyst is the up-side risk. Stance: short back in play as the bounce fades — valid below $61, confirmed on a break under $56; a push back over $61 stops it out and flips the read long again toward the 200-EMA ≈ $63. A pre-market read.',
    edge: 'Flipped short, the squeeze faded — after squeezing +3.72% to $58.29 (reclaiming the 50-EMA / $57 entry), ASTS is rolling back −2.63% pre-market to $56.76, under the $57.50 50-EMA and pressing the $56 must-hold-below line with momentum turning back down (1H RSI 42.65 from 55, Stoch 20.71 rolling); the short is back in play — valid below $61, confirmed on a break under $56, a push over $61 stops it out and flips it long toward the 200-EMA ≈ $63 (B. Riley Buy $85 the risk), a pre-market read',
    side: 'short', accent: 'violet',
    date: '2026-07-28',
    story: 'stories/asts.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$187.88', change: 'pre-market −2.71% $182.79 · pressing the $181 coil low',
    signal: 'Breakdown leader — the re-arm held, pressing the coil low. After Friday’s −15.02% collapse under $200 and Monday’s flat consolidation (close $187.88, +0.06%), NBIS is easing lower on the 7/28 open: −2.71% pre-market to $182.79, pressing the $181 coil low again — the level whose break opens T1 $160. Price stays capped under every MA (9-EMA $183.91, 50-EMA $196.59, 200-EMA $204.36) and near the lower Bollinger ($176.45), MACD −5.25 — structure broken, short armed. That is ≈ +9% for the short from the $200 entry at the pre-market print. Near-term oversold (Stoch 18.29, RSI 37.80), so a bounce into $196–204 is the cleaner re-short add, not a chase. A decisive break of the $181 low is what opens $160 → 200-day ≈ $150 → 🕳️ $130. Stance: short live under $200, at the coil low — add on a bounce into $196–204 or on a break under $181; a pre-market read, only a 2nd close back over $213 ends it.',
    lead: { rank: 4, status: 'live', entry: '$200 filled', stop: '$213', targets: '$160 → $147 → $130', downside: '−15%', tail: '−31%', rr: '~3:1', edge: 'Breakdown leader, pressing the coil low — after Friday’s −15.02% re-arm under $200 and a flat Monday (close $187.88), NBIS is −2.71% pre-market to $182.79, pressing the $181 coil low whose break opens T1 $160 (≈ +9% for the short from $200); capped under every MA and near the lower BB ($176.45), oversold (Stoch 18.29) so a bounce into $196–204 is the cleaner add — a break under $181 opens $160 → 200-day ≈ $150 → $130, a pre-market read, a 2nd close over $213 ends it' },
    side: 'short', accent: 'indigo',
    date: '2026-07-28',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$516.89', change: 'pre-market −4.67% $492.76 · testing the $492 low · break opens lower',
    signal: 'Technical fade — back at the $492 low. After closing $516.89 (−3.61%), AMAT is gapping lower on the 7/28 open: −4.67% pre-market to $492.76, right back at the $492 prior low — the level whose break opens the next leg. Price is under the whole MA stack, daily MACD −11.55 firmly negative. It stays a technical fade, not a fundamental short — equipment rides the TSMC buildout and the higher timeframes are only cooling, not broken — so it stays off the ranked board. Near-term it is deeply oversold (1H RSI 32.15, Stoch 9.75), so a reflex bounce is due — a bounce into $511–530 is the cleaner re-short, not a chase. A decisive break of the $492 low opens ≈ $473 (lower BB) → lower; a reclaim of $530→$556 negates. A pre-market read — confirm on the cash close.',
    edge: 'Technical fade, back at the $492 low — after the $516.89 close AMAT is gapping −4.67% pre-market to $492.76, testing the $492 prior low whose break opens ≈ $473 (lower BB) → lower; under the whole MA stack (MACD −11.55) but still a pullback not a fundamental short (equipment rides the TSMC buildout), off the board — deeply oversold (1H Stoch 9.75) so a bounce into $511–530 is the cleaner re-short, a reclaim of $530→$556 negates, a pre-market read',
    side: 'short', accent: 'red',
    date: '2026-07-28',
    story: 'stories/amat.html',
  },
  {
    symbol: 'BE', exchange: 'NYSE',
    price: '$166.84', change: 'close −11.34% $166.84 · ⚠️ EARNINGS BEAT · AH +10.88% $185 (high $191) · all targets banked ~+26%',
    signal: 'Downtrend leader — the fade banked ALL targets into the print, then earnings squeezed it. BE closed $166.84 (−11.34%), blowing clean through 🕳️ T3 $170 (intraday low $164.35) — all three targets ($200 → $185 → $170) banked, ≈ +26% for the short from the $219–234 entry, a complete win. THEN it reported after the close and squeezed +10.88% to $185.00 after-hours (spiking to $191). This is exactly the binary the card flagged: banking most/all into the print was the right call — a beat squeezed it right back toward the $196–200 the plan warned about, and any runner got caught. The trend short objective is DONE — there is no short here into a post-beat squeeze; let the earnings reaction settle. A reclaim of $200 / the 50-EMA is what repairs the bulls. Position was for the print — the print delivered both the banked win and the squeeze.',
    lead: { rank: 5, status: 'live', entry: '$219–234 filled', stop: '$250', targets: '$200 → $185 → $170', downside: '−10%', tail: '−17%', rr: '~3:1', edge: 'Downtrend leader — the fade banked ALL targets into the print: BE closed $166.84 (−11.34%), clean through 🕳️ T3 $170 (low $164.35), all three ($200 → $185 → $170) banked, ≈ +26% for the short from $219–234 (a complete win); ⚠️ then earnings BEAT and it squeezed +10.88% AH to $185 (high $191) — exactly the binary the card flagged, banking into the print was right, a runner got squeezed, the trend objective is done and there’s no short into a post-beat squeeze' },
    side: 'short', accent: 'amber',
    date: '2026-07-28',
    story: 'stories/be.html',
  },
  {
    symbol: 'ALAB', exchange: 'NASDAQ',
    price: '$282.52', change: 'pre-market −5.14% $267.99 · through T2 $280 · driving to the $250 base',
    signal: 'Dip-buy dead — the fade broke T2 pre-market. After closing $282.52 (−3.11%) while pressing T2 $280, ALAB is gapping lower on the 7/28 open: −5.14% to $267.99, a clean break THROUGH T2 $280, now driving toward 🕳️ the $250 May base (T3). That is ≈ +14% for the short from the $310 entry at the pre-market print. Price is under the whole 1H MA stack (9-EMA $304.97, 50-EMA $319.89, 200-EMA $342.77) and stretched below the lower Bollinger ($292.96) — structure broken. Near-term it is deeply oversold (1H RSI 29.76, Stoch 16.36, MACD −8.17), so a reflex bounce is due — a push back into $280–295 is the cleaner add, not a chase of the low. The weekly still has room (not oversold). Next: 🕳️ the $250 base (T3), with the 200-EMA far below; a pre-market read — confirm on the cash close, stop $362 untouched and well clear. Stance: short working, T1 + T2 banked; trail toward $250, add on a bounce, and only a reclaim of $362 repairs the long case.',
    lead: { rank: 14, status: 'live', entry: '$310 filled', stop: '$362', targets: '$300 → $280 → $250', downside: '−10%', tail: '−19%', rr: '~3:1', edge: 'Dip-buy dead, fade broke T2 pre-market — after the $282.52 close ALAB is gapping −5.14% to $267.99, clean through T2 $280 toward 🕳️ the $250 May base (≈ +14% for the short from $310); under the whole 1H MA stack and below the lower BB ($292.96), deeply oversold (RSI 29.76, Stoch 16.36) so a bounce into $280–295 is the cleaner add, stop $362 far — only a reclaim of $362 repairs the long, a pre-market read' },
    side: 'short', accent: 'emerald',
    date: '2026-07-28',
    story: 'stories/alab.html',
  },
  {
    symbol: 'CRDO', exchange: 'NASDAQ',
    price: '$208.14', change: 'pre-market −4.87% $198.00 · broke T1 $200 · driving to $190',
    signal: 'Dip-buy dead — the fade broke T1 pre-market. After tagging the T1 $200 zone intraday and closing $208.14 (−2.35%), CRDO is gapping lower on the 7/28 open: −4.87% to $198.00, a clean break THROUGH T1 $200, now driving toward T2 $190 (the 1H lower Bollinger $191.63 sits right there). That is ≈ +11% for the short from the $219–230 entry at the pre-market print. Price is under the whole 1H MA stack (9-EMA $202.92, 50-EMA $214.67, 200-EMA $225.65) — structure broken. Near-term it is deeply oversold (1H RSI 30.15, Stoch 17.67, MACD −4.72), so a reflex bounce is due — the cleaner re-short add is a push back into the broken $203–208 zone (9-EMA / VWAP $204.82), not a chase of the low. The weekly is still an uptrend (a pullback in the leader with room). Short live toward T2 $190 → 🕳️ $175 breakout shelf; a pre-market read — confirm on the cash close, stop $242 untouched; a reclaim of $242 repairs the long case.',
    lead: { rank: 13, status: 'live', entry: '$219–230 filled', stop: '$242', targets: '$200 → $190 → $175', downside: '−11%', tail: '−22%', rr: '~2.5:1', edge: 'Dip-buy dead, fade broke T1 pre-market — after tagging $200 intraday and closing $208.14, CRDO is gapping −4.87% to $198.00, clean through T1 $200 toward T2 $190 (1H lower BB $191.63 there), ≈ +11% for the short from $219–230; under the whole 1H MA stack, deeply oversold (RSI 30.15, Stoch 17.67) so a bounce into the broken $203–208 zone is the cleaner add — short live toward $190 → 🕳️ $175, a pre-market read, stop $242, reclaim $242 repairs the long' },
    side: 'short', accent: 'cyan',
    date: '2026-07-28',
    story: 'stories/crdo.html',
  },
  {
    symbol: 'DELL', exchange: 'NYSE',
    price: '$426.91', change: 'pre-market −3.67% $410.89 · at the bottom of the $409–420 buy zone · testing $402',
    signal: 'Bull-flag pullback — the dip is testing the line now. DELL kept giving back froth: after closing $426.91 (−2.42%), it is gapping lower on the 7/28 open: −3.67% to $410.89, at the BOTTOM of the $409–420 dip-buy zone the card flagged and pressing toward the $402 short-revival line. This is still a pullback in a strong uptrend (it ran $100 → $450+), but the gap has driven it to the make-or-break level: it holds long only above $402. Near-term it is now deeply oversold (1H RSI 33.08, Stoch 11.28, MACD −4.97) and stretched below the lower Bollinger ($431.96), so a reflex bounce off the zone is due — the cleaner long is a base that holds $409–417, not a falling knife. Stance: still a long-side name, dip-buy zone reached and being tested; a reclaim of $432 re-confirms the breakout, and a decisive loss of $402 flips it short toward $377 → $330. This is a pre-market read — confirm on the cash open. Off the ranked board.',
    edge: 'Bull-flag pullback testing the line — after the $426.91 close DELL is gapping −3.67% pre-market to $410.89, at the bottom of the $409–420 dip-buy zone and pressing the $402 short-revival line; deeply oversold (1H RSI 33.08, Stoch 11.28) below the lower BB so a bounce is due, but it holds long only above $402 — let it base on $409–417 for the cleaner long, a reclaim of $432 re-confirms the breakout, a loss of $402 flips it short toward $377 → $330, a pre-market read (off the ranked board)',
    side: 'long', accent: 'amber',
    date: '2026-07-28',
    story: 'stories/dell.html',
  },
  {
    symbol: 'MRVL', exchange: 'NASDAQ',
    price: '$189.17', change: 'pre-market −4.72% ≈$180 · lost the 21-week MA · long-watch for the bottom',
    signal: 'Bottom-watch — where to pick up the long. MRVL fell with the semi group: after closing $189.17 (−2.61%), it is gapping −4.72% pre-market to ≈ $180 on the 7/28 open, just losing the 21-week MA ($185.15). This is not a short (too late) — it is a hunt for the BOTTOM to go long: deeply oversold (1H RSI 30.29, Stoch 24.30; daily RSI 35.58, Stoch 23.31), under the whole 1H MA stack and below the daily lower Bollinger ($201). Two accumulation zones: the first is the $172–178 shelf (a nibble on an oversold reflex bounce), and the main one is $150–160, where the daily 200-EMA ($151.42) and the weekly 50-EMA ($146.02) line up — the “back up the truck” flush. Don’t catch the knife: accumulate in the zones, not on the fly. A confirmed bottom is a reclaim of $185 → $198–200 (turns the daily up); targets on the recovery $200 → $220 → $245. Invalidation: a weekly close under $146 breaks the multi-year uptrend — no long there. A pre-market read; off the ranked board (a watch).',
    edge: 'Bottom-watch for a long — MRVL fell with the group to close $189.17, gapping −4.72% pre-market to ≈ $180 (just lost the 21-week MA $185); deeply oversold (1H RSI 30.29, daily RSI 35.58 / Stoch 23) under the whole 1H stack and below the daily lower BB ($201) — nibble the $172–178 shelf on an oversold bounce, load the $150–160 flush where the daily 200-EMA $151 + weekly 50-EMA $146 line up, stop under $142; a reclaim of $185 → $198–200 confirms the bottom toward $200 → $220 → $245, a weekly close under $146 breaks the trend (off the ranked board, a watch)',
    side: 'long', accent: 'blue',
    date: '2026-07-28',
    story: 'stories/mrvl.html',
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
