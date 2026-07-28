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
    price: '$36.29', change: 'pre-market −3.28% $35.10 · pressing T1 $34 (lower BB $34.08)',
    signal: 'Flipped short — the fade is pressing T1 pre-market. After closing $36.29 (−2.10%), IREN is gapping lower on the 7/28 open: −3.28% to $35.10, driving right onto T1 $34 (the 1H lower Bollinger $34.08 sits just beneath). That is ≈ +10% for the short from the $38.90 entry at the pre-market print. Price is under the whole 1H MA stack (9-EMA $35.66, 50-EMA $37.79, 200-EMA $39.65) — structure broken. Near-term it is deeply oversold (1H RSI 30.49, Stoch 13.06, MACD −0.86), so a reflex bounce is due — the cleaner short add is a push into $36–38 (9-EMA / 50-EMA), not a chase of the low. The ≈$2.8B AI-cloud catalyst is the risk: a reclaim of $41.70 repairs the long. Fade toward T1 $34 → 🎯 $30 (weekly support) → deeper $27; this is a pre-market read — confirm on the cash close, stop $42 far.',
    lead: { rank: 11, status: 'live', entry: '$38.90 filled', stop: '$42', targets: '$34 → $30 → $27', downside: '−13%', tail: '−31%', rr: '~3:1', edge: 'Flipped short, pressing T1 pre-market — after the $36.29 close IREN is gapping −3.28% to $35.10, right onto T1 $34 (1H lower BB $34.08 beneath), ≈ +10% for the short from $38.90; under the whole 1H MA stack, deeply oversold (RSI 30.49, Stoch 13.06) so a bounce into $36–38 is the cleaner add, stop $42 — 🎯 $30 then $27, a reclaim of $41.70 repairs the long (≈$2.8B AI-cloud catalyst the risk), a pre-market read' },
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
    price: '$88.14', change: 'close −9.90% · AH +0.74% $88.79 · T1 $90 banked · low ≈$83, pressing T2 $82',
    signal: 'T1 banked on a −9.90% close — the heaviest OBV collapse keeps delivering. AAOI confirmed the pre-market read with the worst close on the board: $88.14 (−9.90%), clean THROUGH T1 $90, with a flush to ≈ $83 (30-min lower Bollinger $83.34) that put T2 $82 within a dollar. That is ≈ +22% for the short from the $113 re-arm. Price stays pinned under everything (30-min VWAP $92.89, 200-EMA $102.71). But the low was bought: it closed off the bottom, after-hours +0.74% to $88.79, and the bounce leg is running hard (30-min Stoch 69.72 up from 20, RSI 45.17, MACD −1.93 flattening). So don’t chase $88 — bank into $82–88 and re-load the push instead: the add zone has come down from $100–104 to $92–95 (broken T1 $90 / VWAP $92.89). Below T2 $82 the plan still points at 🕳️ the weekly 21-MA / $58 — the parabola is only part-way unwound. Only a reclaim over $120 ends it.',
    lead: { rank: 6, status: 'live', entry: '$113 filled', stop: '$120', targets: '$90 → $82 → $58', downside: '−16%', tail: '−41%', rr: '~4:1', edge: 'T1 banked on a −9.90% close — AAOI closed $88.14 clean through T1 $90 with a flush to ≈$83 (30-min lower BB $83.34) that left T2 $82 a dollar away, ≈ +22% for the short from $113; pinned under VWAP $92.89 / 200-EMA $102.71, but the low was bought (AH +0.74% $88.79, Stoch 69.72 up from 20) so bank into $82–88 and re-load the bounce — the add zone drops from $100–104 to $92–95, below $82 it still points at 🕳️ $58, only a reclaim over $120 ends it' },
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
    price: '$86.30', change: 'close −5.86% · AH +0.66% $86.87 · $89 GATE BROKEN & CONFIRMED on the close',
    signal: 'The $89 gate broke — and the cash close confirmed it. The pre-market read held all session: INTC closed $86.30 (−5.86%), a decisive daily close UNDER the $89 gate (weekly 21-MA) the card had flagged for weeks, after a flush to ≈ $84 (1H lower BB $83.80). That is the confirmation the plan was waiting for — the air pocket toward the daily 200-EMA ≈ $69 and the unfilled $66 gap is now open, and the short is live from the $89 break. OBV −597M stays the worst on the board: distribution, not rotation. It did bounce off the low into the close (AH +0.66% $86.87, 1H RSI back to 42.37 from 30.45, Stoch 27.51 up from 3.36), so don’t chase the low — the broken $89 gate is now the lid, and a push back into $89–92 is the cleaner add, stop $95. Next: $80 → 🕳️ 200-EMA ≈ $69 → the $66 gap. A reclaim over $92 stalls it, $98–102 negates. On the ranked board now that the break is confirmed.',
    lead: { rank: 12, status: 'live', entry: '$89 break filled', stop: '$95', targets: '$80 → $69 → $66', downside: '−10%', tail: '−26%', rr: '~3:1', edge: 'Worst OBV on the board and the $89 gate is now broken AND confirmed on the cash close — INTC closed $86.30 (−5.86%) under the weekly 21-MA after a flush to ≈$84 (1H lower BB $83.80), opening the air pocket to the 200-EMA ≈ $69 / the unfilled $66 gap; it bounced off the low into the close (AH +0.66% $86.87, RSI 42.37 from 30.45) so don’t chase — the broken gate is the lid, add on a push into $89–92 with stop $95, a reclaim over $92 stalls it and $98–102 negates' },
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
    price: '$334.77', change: 'pre-market −4.54% $319.56 · grinding to T1 $308',
    signal: 'Shelf-break paying — the fade is grinding to T1. After the $346 re-arm fired (close $334.77, −4.33%), TER is bleeding further on the 7/28 open: −4.54% pre-market to $319.56, driving toward T1 $308. That is ≈ +8% for the short from the $346 entry at the pre-market print. Structure stays broken — price under the whole daily MA stack, pinned to the lower Bollinger. Near-term it is oversold (30-min RSI 35.44, Stoch 25.35, MACD −5.38), and the weekly is still an uptrend (far above the 200-EMA $272), so a reflex bounce toward $330–346 is the cleaner re-short add, not a chase of the low. Stance: short live and working toward T1 $308 → $292 → 🕳️ 200-EMA $280; a pre-market read — confirm on the cash close, a bounce into $330–346 is the add, and a 2nd day back over $358 (or a reclaim of $390) ends it.',
    lead: { rank: 2, status: 'live', entry: '$346 filled', stop: '$358 (overshot)', targets: '$308 → $292 → $280', downside: '−11%', tail: '−19%', rr: '~4:1', edge: 'Shelf-break paying, grinding to T1 — after the $346 re-arm fired (close $334.77), TER is −4.54% pre-market to $319.56, driving toward T1 $308 (≈ +8% for the short from $346); under the whole daily stack on the lower BB, oversold (RSI 35.44, Stoch 25.35) so a bounce into $330–346 is the cleaner add — short live toward $292 → 🕳️ 200-EMA $280, a pre-market read, a 2nd day over $358 ends it' },
    side: 'short', accent: 'blue',
    date: '2026-07-28',
    story: 'stories/ter.html',
  },
  {
    symbol: 'GLW', exchange: 'NYSE',
    price: '$143.36', change: 'pre-market −16.40% $119.80 (earnings) · gapped through ALL targets · ~+25%',
    signal: 'Earnings detonation — the fade paid in full and then some. GLW closed $143.36 (−2.24%) around T2 $144, then reported and gapped −16.40% pre-market to $119.80, blowing clean through T3 $130 (the 200-EMA) and every target on the plan. That is ~+25% for the short from the ~$160 rejection — a complete win, all three targets ($151 → $144 → $130) banked. At $119.80 it is deeply oversold (1H RSI 26, far below the lower BB), and this is a news gap, not a technical level, so don’t chase: take profit / trail tight and expect a violent dead-cat bounce toward $128–137 (prior support = new resistance). Stance: trade complete, all targets banked — the trend objective is done; there is no fresh short here at $119.80. This is a pre-market print — the cash open confirms whether the gap holds.',
    lead: { rank: 3, status: 'live', entry: '$160 filled', stop: '$184', targets: '$151 → $144 → $130', downside: '−9%', tail: '−14%', rr: '~3:1', edge: 'Earnings detonation — GLW closed $143.36 then gapped −16.40% pre-market to $119.80, blowing through T3 $130 and every target: ~+25% for the short from ~$160, all three banked (a complete win); deeply oversold at $119.80 (1H RSI 26) on a news gap so don’t chase — take profit and expect a dead-cat bounce toward $128–137, the trend objective is done' },
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
    price: '$548.55', change: 'pre-market −3.66% $528.50 · through $535 · at the $521 BB / $510–518 magnet',
    signal: 'The board’s barometer — the fade keeps accelerating into the magnet. After closing $548.55 (−2.25%) in the $547–550 shelf, SMH is gapping lower pre-market: −3.66% to $528.50, clean through the $535 swing-low and now pressing the 1H lower Bollinger ($521) and the fat $510–518 confluence (0.5 fib $515 + 21-week MA $513 + open gap $510 + daily lower BB). That is the fade playing out exactly as mapped: $547–550 → $535 → $510–518. It is now deeply oversold near-term (1H RSI 29.11, Stoch 9.30) — so a reflex bounce is due, and the $510–518 magnet is the target, not yet a bottom (the weekly is still nowhere near oversold). One caveat: this is a pre-market read, not a cash close — confirmation is a daily close that holds under $535; a reclaim back over $547 would stall it. Stance: the barometer’s slide keeps the board’s short fades ARMED and active (COHR / NVDA / MU / TER / WDC / GLW / AAOI …); a long is not the trade. Next: the $510–518 magnet, then only a deeper break under $510 opens the 0.618 ≈ $478. Only a reclaim back over $580 with breadth negates the fade.',
    edge: 'The board’s barometer keeps accelerating — after the $548.55 close, SMH is gapping −3.66% pre-market to $528.50, through the $535 swing-low and pressing the $521 lower BB / $510–518 confluence (0.5 fib + 21-week MA + gap + daily lower BB); 1H RSI 29 / Stoch 9 deeply oversold so a bounce is due but the magnet is the target — a pre-market read (confirm on a daily close under $535), the slide keeps the board’s fades armed, only a reclaim over $580 negates',
    side: 'short', accent: 'red',
    date: '2026-07-28',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$816.99', change: 'pre-market −7.22% $758 · through the $788 low + $770 shelf · toward the weekly ≈ $700',
    signal: 'The fence broke and the slide is accelerating. After confirming the break below $835 (close $816.99, −4.07%, a ~$788 low), STX is gapping harder on the 7/28 open: −7.22% pre-market to $758.00 — a clean break THROUGH the $788 prior low and the $770–835 structure, now stretched below the lower Bollinger ($796.48) and the whole daily stack (9-EMA $828.87, 50-EMA $868.82). That is the break the card wanted, extending. It is now deeply oversold (1H RSI 26.65, Stoch 7.43, MACD −21.62), so a reflex bounce is due — the cleaner re-short is a bounce into $796–810 (lower BB / VWAP $809.58), not a chase of the low. Still a deep pullback in an intact weekly uptrend (far above the 21-week MA ≈ $700), so the next magnet is that $700 weekly line, not a trend break yet. This is a pre-market read — confirm on the cash close; a reclaim of $810→$835 stalls it, and $864 re-negates.',
    edge: 'The fence broke and the slide is accelerating — after the $816.99 close (−4.07%, $788 low), STX is gapping −7.22% pre-market to $758, clean through the $788 low and the $770–835 structure, stretched below the lower BB ($796.48) and the whole daily stack; deeply oversold (1H RSI 26.65, Stoch 7.43) so a bounce into $796–810 is the cleaner re-short, the next magnet the weekly 21-MA ≈ $700 (still a deep pullback in a weekly uptrend) — a pre-market read, a reclaim of $810→$835 stalls it, $864 re-negates',
    side: 'short', accent: 'amber',
    date: '2026-07-28',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$56.55', change: 'close −2.99% · AH +0.55% $56.86 · $56 line HELD · short unconfirmed, coiling $56–61',
    signal: 'The short never got its confirmation — $56 held again. ASTS did press the line the card named: it traded down to ≈ $55 intraday, then closed $56.55 (−2.99%) back ABOVE the $56 must-break level, with after-hours +0.55% to $56.86. That is the second failed attempt at $56, and momentum has turned back up with it: 1H Stoch 64.37 rising, RSI 48.82 (mid-range), MACD −0.34 flattening toward zero, OBV 119M flat — no distribution, just a coil. So the plan is unchanged but still unarmed: the short is technically valid below $61 (upper BB $59.08, 50-EMA ≈ $60.60, 200-EMA $62.09 all overhead) yet it does not fire until a DECISIVE close under $56 — which has now been rejected twice. Stance: no edge in the middle of the $56–61 coil — wait. A close under $56 arms the short toward the lows; a push over $61 stops the idea out and flips the read long toward the 200-EMA $62 and above (B. Riley Buy $85 / Midland the upside catalyst).',
    edge: 'The short never got its confirmation — ASTS pressed the $56 line to ≈$55 intraday but closed $56.55 (−2.99%) back above it, AH +0.55% $56.86: a second failed break, with momentum turning back up (1H Stoch 64.37 rising, RSI 48.82, MACD −0.34 flattening, OBV flat — no distribution); the fade is still valid below $61 (BB $59.08, 50-EMA $60.60, 200-EMA $62.09 overhead) but unarmed until a decisive close under $56 — no edge inside the $56–61 coil, and a push over $61 flips the read long toward $62+',
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
    price: '$188.18', change: 'pre-market −5.65% $177.49 · ⚠️ REPORTS TONIGHT · nearing T3 $170',
    signal: 'Downtrend leader — deeply in the money into a binary print. BE bounced +1.78% to close $188.18, but is gapping −5.65% pre-market to $177.49, pressing the last leg toward 🕳️ T3 $170 (daily 209-EMA / 50-week). ⚠️ The catalyst that matters: BE reports earnings TONIGHT (after the close). The short is already deep — T1 $200 and T2 $185 both banked, ≈ +22% from the $219–234 entry — and GLW’s −16% earnings gap today shows how violent these prints are. Prudent play into the report: bank most/all of the gain and carry at most a small runner; a beat could squeeze it back to $196–200. Don’t hold full size through a binary event on a trade already up ~22%. T3 $170 is the target if the slide continues; stop $250 far, a reclaim of $234→$250 repairs it. Position for the print — don’t predict it.',
    lead: { rank: 5, status: 'live', entry: '$219–234 filled', stop: '$250', targets: '$200 → $185 → $170', downside: '−10%', tail: '−17%', rr: '~3:1', edge: 'Downtrend leader, deep in the money into earnings — BE closed +1.78% $188.18 then gapping −5.65% pre-market to $177.49 toward T3 $170 (≈ +22% for the short from $219–234, T1+T2 banked); ⚠️ REPORTS TONIGHT so bank most of the gain / carry only a small runner into the binary print (GLW just gapped −16% on earnings) — T3 $170 the target if it continues, a beat squeezes to $196–200, reclaim $234→$250 repairs it' },
    side: 'short', accent: 'amber',
    date: '2026-07-28',
    story: 'stories/be.html',
  },
  {
    symbol: 'ALAB', exchange: 'NASDAQ',
    price: '$260.23', change: 'close −7.89% · AH flat $260.23 · through T2 $280 · low ≈$252 — T3 $250 all but tagged',
    signal: 'T3 all but tagged — the fade is essentially complete. ALAB confirmed the pre-market break on the cash close: $260.23 (−7.89%), with a flush to ≈ $252 (30-min lower Bollinger $252.45) that put T3 — the $250 May base — within a couple of dollars, then a sideways base into the bell (after-hours flat, $260.23). That is ≈ +16% for the short from the $310 entry, T1 $300 and T2 $280 banked and T3 in reach. Price stays under the whole 30-min stack (VWAP $272.94, 200-EMA $302.57), MACD −4.25. But this is the target zone, not fresh downside: momentum is curling up off the low (RSI 44.12, Stoch 52.18) and $250 is exactly where the plan said to take profit. Stance: bank into $250–260, don’t press — re-short only a bounce back into $272–280 (VWAP / broken T2), stop trailed to $295. Below $250 the next air is the daily 200-EMA ≈ $199; a reclaim of $302 → $362 repairs the long case.',
    lead: { rank: 14, status: 'live', entry: '$310 filled', stop: '$295 (trailed from $362)', targets: '$300 → $280 → $250', downside: '−10%', tail: '−19%', rr: '~3:1', edge: 'T3 all but tagged — ALAB closed −7.89% $260.23 with a flush to ≈$252 (30-min lower BB $252.45), leaving the $250 May base a couple of dollars away: ≈ +16% for the short from $310, T1 $300 + T2 $280 banked; under the whole 30-min stack (VWAP $272.94) but curling up off the low (RSI 44.12, Stoch 52.18, AH flat) — bank into $250–260 rather than press, re-short only a bounce into $272–280 with stop $295, below $250 the next air is the daily 200-EMA ≈ $199' },
    side: 'short', accent: 'emerald',
    date: '2026-07-28',
    story: 'stories/alab.html',
  },
  {
    symbol: 'CRDO', exchange: 'NASDAQ',
    price: '$192.28', change: 'close −7.62% · AH +0.58% $193.40 · T1 $200 banked · T2 $190 tagged (low ≈$186)',
    signal: 'Two targets in — the fade delivered on the close. CRDO confirmed the pre-market break: close $192.28 (−7.62%), with a flush to ≈ $186 (1H lower Bollinger $186.48) that took out T1 $200 and tagged T2 $190 in the same session, then a bounce into the bell (AH +0.58% $193.40). That is ≈ +14% for the short from the $219–230 entry, two of three targets in hand. Structure stays broken — price under the whole 1H stack (9-EMA $199.73, VWAP $207.86, 200-EMA $222.64), MACD −5.56. But the low found buyers and momentum is curling (1H RSI 39.37, Stoch 39.34 up off the bottom), so don’t press the low: bank T2 and re-load a push back into $199–208 (the 9-EMA / VWAP lid), stop trailed to $212. Only 🕳️ $175 (the April breakout shelf) is left on the plan. The weekly is still an uptrend — a leader’s correction with room, not a trend break; a reclaim of $222 → $242 repairs the long case.',
    lead: { rank: 13, status: 'live', entry: '$219–230 filled', stop: '$212 (trailed from $242)', targets: '$200 → $190 → $175', downside: '−11%', tail: '−22%', rr: '~2.5:1', edge: 'Two targets in — CRDO closed −7.62% $192.28 with a flush to ≈$186 (1H lower BB $186.48) that took T1 $200 and tagged T2 $190 in one session, ≈ +14% for the short from $219–230; under the whole 1H stack (9-EMA $199.73, VWAP $207.86) but curling up off the low (RSI 39.37, Stoch 39.34, AH +0.58%) so bank T2 and re-load a push into $199–208 rather than press the bottom — only 🕳️ $175 is left, a reclaim of $222 → $242 repairs the long' },
    side: 'short', accent: 'cyan',
    date: '2026-07-28',
    story: 'stories/crdo.html',
  },
  {
    symbol: 'DELL', exchange: 'NYSE',
    price: '$392.10', change: 'close −8.15% · AH +0.91% $395.66 · LOST $402 → short revived · flushed to ≈$370, reversed',
    signal: 'The $402 line broke — the long is dead, and the short paid the same day. DELL did exactly what the card said it must not: it lost $402 decisively, closing $392.10 (−8.15%) after a flush into the low $370s (1H lower BB $368.94) — which tagged the short’s first target $377 inside that same session. Then it reversed: it closed well off the low, after-hours +0.91% to $395.66, with OBV kicking up hard (25.5M → 34.9M) and momentum curling (1H RSI back to 42.26 from 31.45, Stoch 45.88 up from 25). So the flush found buyers — this is not the place to chase it down. The shelf that used to be the dip-buy zone is now overhead supply: the broken $402 line, the 1H 50-EMA $405.13, the 200-EMA $419.94 above it. Stance: short-biased under $420 — fade a bounce back into $402–405, stop $420; targets $377 (already tagged) → $368 → 🕳️ the $330 earnings gap. A reclaim that HOLDS over $420 repairs the long toward $432. Back on the ranked board — as a short.',
    lead: { rank: 15, status: 'wait', entry: 'fade $402–405', stop: '$420', targets: '$377 → $368 → $330', downside: '−7%', tail: '−18%', rr: '~3:1', edge: 'The $402 fail-line broke and the short paid the same day — DELL closed $392.10 (−8.15%) after a flush to the low $370s (1H lower BB $368.94) that tagged T1 $377 intraday, then reversed off the low (AH +0.91% $395.66, OBV 25.5M → 34.9M, RSI 42.26 from 31.45); don’t chase it down — the old $402–420 dip-buy zone is now the lid (50-EMA $405, 200-EMA $420), so fade the bounce into $402–405 with stop $420 toward $368 → 🕳️ $330, and a hold back over $420 repairs the long' },
    side: 'short', accent: 'amber',
    date: '2026-07-28',
    story: 'stories/dell.html',
  },
  {
    symbol: 'MRVL', exchange: 'NASDAQ',
    price: '$174.47', change: 'close −7.77% · AH +0.30% $175.00 · INSIDE the $172–178 nibble zone (low ≈$169)',
    signal: 'The first buy zone is here. MRVL closed $174.47 (−7.77%) — right INSIDE the $172–178 shelf the card named as the first accumulation zone — after a flush to ≈ $169 (30-min lower Bollinger $170.39), then a base and a green after-hours ($175.00, +0.30%). So the tactical nibble is live, and it triggered exactly where the plan said it would: momentum is curling up off the low (30-min Stoch 56.26 crossing up, RSI 41.35, MACD −2.80 flattening). Keep it a nibble, not the position — nothing about the trend has turned: price is still under the whole 30-min stack (VWAP $182.82, 200-EMA $196.39) and under the 21-week MA $185.15 it lost yesterday. The main load stays $150–160, where the daily 200-EMA ($151) and the 50-week ($146) line up — the “back up the truck” flush, which may never come; that is why the first zone gets a nibble and not the whole size. A confirmed bottom is still a reclaim of $185 → $198–200; recovery targets $200 → $220 → $245. Invalidation unchanged: a weekly close under $146 breaks the multi-year uptrend. Off the ranked board (a watch).',
    edge: 'The first buy zone is here — MRVL closed −7.77% $174.47, INSIDE the $172–178 nibble shelf, after a flush to ≈$169 (30-min lower BB $170.39) and a green AH ($175.00); momentum is curling off the low (Stoch 56.26 crossing up, RSI 41.35) so the tactical nibble triggered exactly where planned — but keep it a nibble: still under the 30-min stack (VWAP $182.82) and the 21-week MA $185, with the main load $150–160 (daily 200-EMA $151 + 50-week $146) and stop under $142; a reclaim of $185 → $198–200 confirms the bottom toward $200 → $220 → $245 (off the ranked board, a watch)',
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
