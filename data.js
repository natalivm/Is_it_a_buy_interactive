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
    price: '$196.51', change: '−4.99% close · dip-buy failed · FLIPPED short · rejected $206',
    signal: 'The leader flipped short. NVDA’s dip-buy is done: −4.99% to close $196.51 (AH $196.93), rejected hard from the $202–206 EMA cluster (tagged $206 intraday, sold straight back) and closing below the 4H lower Bollinger ($197.33) under the whole MA stack. The relative-strength tell that justified the long has failed — the leader is now breaking with the group. 4H momentum is accelerating down (MACD histogram −1.54 and expanding, OBV rolling over), so the path of least resistance is lower. The trade flips short here: fade a bounce into $199–202 (VWAP $199 / 9-EMA $202) with a stop above $206, or short the break under $194 — either way targeting the 200-day $189 → $182 → $174. It is short-term stretched (4H Stoch 12, price below the lower band), so expect a bounce to sell into first, not a vertical drop. Only a reclaim back over $206 / the EMA cluster repairs the long.',
    lead: { rank: 8, status: 'wait', entry: 'fade $199–202 / break <$194', stop: '$206', targets: '$189 → $182 → $174', downside: '−6%', tail: '−13%', rr: '~3:1', edge: 'The leader flipped short — NVDA’s dip-buy failed: −4.99% to $196.51 (AH $196.93), rejected from the $202–206 EMA cluster (tagged $206, sold back) and closed below the 4H lower BB with momentum accelerating down (MACD hist −1.54, OBV rolling); fade a bounce into $199–202 (stop $206) or short the break under $194, targeting the 200-day $189 → $182 → $174 — 4H Stoch 12 so sell a bounce not the low, a reclaim of $206 repairs the long' },
    side: 'short', accent: 'red',
    date: '2026-07-27',
    story: 'stories/nvda.html',
  },
  {
    symbol: 'COHR', exchange: 'NYSE',
    price: '$271.31', change: '−3.92% close · tagged T1 $265 intraday · AH $272.93',
    signal: 'Weekly-structure break — the re-short is paying, T1 tagged. COHR kept sliding: the new day fell −3.92% to close $271.31 (AH bounce +0.6% $272.93), and intraday it pierced T1 $265 (the daily 200-EMA) down to ≈ $255 before basing and bouncing into the close. That is ≈ +12.5% for the short from the $310 re-arm by the close, ~+18% at the low. Near-term it is oversold and lifting (1H Stoch 27.19 curling up, RSI 41.81, MACD −8.94) with an AH bounce, so don’t chase the low — a push back into $280–290 is the cleaner re-short add, and the weekly (still repairing) leaves room for the next leg. Next: T1 $265 banked → T2 $247 (50-week) → 🕳️ $215. Stop $321 untouched and far. Stance: re-short working; trail toward $247/$215, add on a bounce, only a reclaim of $321 repairs it.',
    lead: { rank: 1, status: 'live', entry: '$310 filled', stop: '$321', targets: '$265 → $247 → $215', downside: '−14%', tail: '−30%', rr: '~5:1', edge: 'Weekly-structure break, re-short paying — COHR fell −3.92% to close $271.31 and pierced T1 $265 (daily 200-EMA) intraday to ≈ $255 before an AH bounce to $272.93 (≈ +12.5% for the short from $310 by the close); 1H Stoch 27 curling up so a push into $280–290 is the cleaner add, T2 $247 (50-week) → 🕳️ $215, only a reclaim of $321 repairs it' },
    side: 'short', accent: 'violet',
    date: '2026-07-27',
    story: 'stories/cohr.html',
  },
  {
    symbol: 'IREN', exchange: 'NASDAQ',
    price: '$36.29', change: '−2.10% close · fade grinding to T1 $34 · AH $36.48',
    signal: 'Flipped short — the fade is grinding toward T1 $34. After the long broke and flipped short, IREN kept bleeding: the new day fell −2.10% to close $36.29 (AH bounce +0.5% $36.48), driving toward T1 $34 (the daily lower Bollinger ≈ $35.31 sits just beneath). It is under the whole 1H MA stack (9/50/200-EMA = $36.68 / $38.89 / $40.10) — structure broken. Near-term it is deeply oversold (1H RSI 39.61, Stoch 29.20, MACD −0.93) with an AH bounce underway, so don’t chase the low — a push into $38–40 is the cleaner short add, stop $42. The ≈$2.8B AI-cloud catalyst is the risk: a reclaim of $41.70 repairs the long. Fade toward T1 $34 → 🎯 $30 (weekly support) → deeper $27.',
    lead: { rank: 11, status: 'live', entry: '$38.90 filled', stop: '$42', targets: '$34 → $30 → $27', downside: '−13%', tail: '−31%', rr: '~3:1', edge: 'Flipped short, fade grinding to T1 — IREN fell −2.10% to close $36.29 (AH bounce $36.48), driving toward T1 $34 (daily lower BB $35.31 beneath), under the whole 1H MA stack; 1H Stoch 29 with an AH bounce so don’t chase — a push into $38–40 is the cleaner add, stop $42, 🎯 $30 then $27, a reclaim of $41.70 repairs the long (≈$2.8B AI-cloud catalyst the risk)' },
    side: 'short', accent: 'red',
    date: '2026-07-27',
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
    price: '$497.92', change: '−4.21% close · BROKE $513 · fade confirmed · low $475',
    signal: 'The fence broke — the last group name on the ropes finally rolled. WDC lost the $513 line the card was watching: −4.21% to close $497.92 (AH $496.95), a decisive close BELOW the $513 re-arm floor / daily 50-EMA ($525), tagging a ~$475 low (the daily lower BB $475.60) before bouncing. That is the exact "close below $513 re-arms the fade" trigger — no longer on the fence, now a confirmed short. Daily MACD −11.12 is firmly negative, RSI 38, price under the whole stack, and the $486–513 zone gave way straight to $475. It is still a big weekly uptrend (far above the 200-day $318), so this is a deep pullback, not a trend break. Momentum reset off the low (Stoch back to 32), so a bounce into $513–525 is the cleaner re-short. Next: the $475 low → the lower BB ≈ $455 on continuation; a reclaim of $525→$535 re-negates.',
    lead: { rank: 10, status: 'live', entry: '$513 filled', stop: '$535', targets: '$486 → $475 → $455', downside: '−5%', tail: '−11%', rr: '~2.5:1', edge: 'The fence broke — WDC lost the $513 line it was sitting on, −4.21% to close $497.92 (AH $496.95), a decisive close below the $513 / 50-EMA floor with a $475 low; the "close below $513 re-arms" trigger fired, so it is a confirmed short now (MACD −11.12, under the whole stack) — a bounce into $513–525 is the cleaner re-short toward the lower BB ≈ $455, still a deep pullback in a weekly uptrend so a reclaim of $525→$535 re-negates' },
    side: 'short',
    date: '2026-07-27',
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$91.67', change: '−0.70% close · day 2 grind · pinned in the $89–92 zone',
    signal: 'Worst OBV in the group — the fade is grinding, not sprinting. Monday added a quiet second day: INTC closed $91.67 (−0.70%, AH $91.39), poking down to the $88.5 / $89 gate intraday before recovering — so T1 $92 is now the lid and the $89 gate is being tested, not yet broken. Structure is still broken (price under the whole daily MA stack, worst OBV on the board), but the near-term oversold has worked off: daily Stoch back to 53 (from 27), RSI 42, MACD −2.32 and less negative — the reflex bounce the card wanted played out into $91–92, so this is the cleaner spot to hold or add the short, not chase. Next: a decisive daily close under $89 (weekly 21-MA) opens the air pocket to the 200-EMA ≈ $69 / the unfilled $66 gap; a reclaim back over $98–102 stalls it, and $118 negates. Stance: short working, T1 banked, gated at $89 — patience while it coils $89–92.',
    edge: 'Worst OBV in the group, fade grinding — INTC added a quiet −0.70% day to $91.67, poking the $88.5 / $89 T2 gate then recovering, so T1 $92 is the lid and $89 the gate; still under every MA but the oversold worked off (Stoch back to 53, MACD −2.32 improving), so hold or add here not chase — a close under $89 opens the 200-EMA ≈ $69 / $66 gap, a reclaim of $98–102 stalls it, $118 negates',
    side: 'short', accent: 'blue',
    date: '2026-07-27',
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$900.20', change: 'pre-market −5.11% $854 · broke the range · T1 $800 in play',
    signal: 'Memory bellwether — the range finally broke. After closing $900.20 (−2.25%) back under the $905 trigger, MU is gapping hard pre-market: −5.11% to ≈ $854, LOSING both the $886 shelf and the daily 21-mid-BB ($868) — the two levels that had held the chop since June. That is the decisive break the plan wanted; the leg down is live and T1 $800 is now in play, with clean air below $854. Structure: back under the daily 9-EMA ($932), though the daily 50-EMA ($714) and 200-EMA ($433) sit far below — a parabola unwinding, not a trend break yet. The real test is the 50-day $714. One caveat: this is a pre-market gap, not a cash close — confirmation is a daily close that holds under $868; a reclaim back over $886 would be a fakeout. Stance: leg down live under $868 → T1 $800 → daily 50-day $714 → weekly 21-MA $665 → 🕳️ $505; only a close back over $955 / $1,005 ends it. The bellwether that dragged the group up is now leading it down.',
    lead: { rank: 7, status: 'live', entry: '$905 filled', stop: '$1,005', targets: '$800 → $714 → $665 → $505', downside: '−11%', tail: '−44%', rr: '~4:1', edge: 'Memory bellwether — the range broke: after closing $900.20 under the $905 trigger, MU is gapping −5.11% pre-market to ≈ $854, losing the $886 shelf and the daily mid-BB ($868) that held the chop since June; the leg down is live with T1 $800 in play then the daily 50-day $714 → weekly 21-MA $665 → 🕳️ $505 — but it is a pre-market gap so confirmation is a daily close under $868, a reclaim over $886 is a fakeout' },
    side: 'short', accent: 'cyan',
    date: '2026-07-28',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$334.77', change: '−4.33% close · broke under $346 · re-arm fired',
    signal: 'Shelf-break — the $346 re-arm fired. TER had been knocking on the door; the new day broke it decisively: −4.33% to close $334.77 (AH $333.69), a clean close UNDER the $346 re-arm floor and well back under the $358 stop. Structure is broken — price is under the whole 1H MA stack, pinned to the lower Bollinger, the shelf gone. Momentum is bearish but near-term stretched (1H RSI 38.45, Stoch 29.11, MACD −7.2), and the weekly is still an uptrend (far above the 200-EMA $272), so a reflex bounce toward $346–358 is live before the next leg. Stance: re-arm fired, short live toward T1 $308 → $292 → 🕳️ 200-EMA $280; a bounce into $346–358 is the cleaner add, and a 2nd day back over $358 (or a reclaim of $390) ends it.',
    lead: { rank: 2, status: 'live', entry: '$346 filled', stop: '$358 (overshot)', targets: '$308 → $292 → $280', downside: '−11%', tail: '−19%', rr: '~4:1', edge: 'Clean shelf-break — the $346 re-arm fired: TER broke −4.33% to close $334.77, a decisive close under the $346 floor and back under the $358 stop, price under the whole 1H MA stack on the lower BB; short live toward T1 $308 → 🕳️ 200-EMA $280, but 1H Stoch 29 oversold so a bounce into $346–358 is the cleaner add, a 2nd day over $358 ends it' },
    side: 'short', accent: 'blue',
    date: '2026-07-27',
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
    price: '$1,278.23', change: '−11.02% close · T2 $1,287 hit · driving to 50-week $880',
    signal: '✓ T1 $1,363 AND T2 $1,287 both banked — the crash just kept going. After Friday’s −10.79% re-arm, SNDK didn’t bounce: the new day dumped another −11.02% to close $1,278.23 (AH +0.47% $1,284.19), slicing clean through the weekly 21-MA / daily-lower-BB magnet $1,287 (T2 done) with no bid. That is ≈ +17% for the short from the $1,536 re-arm. Price is now stretched far below even the 4H lower Bollinger ($1,524) — the most oversold name on the board (4H Stoch 8.17, RSI 38.59, MACD −27 and expanding) — so a reflex bounce is overdue and the only target left is the deep 50-week $880. Weekly RSI is still only ~52 and weekly MACD hugely positive → a parabola unwinding, not yet a trend break, so this stays staged: a bounce into $1,363–1,470 is the cleaner place to add, not a chase of the low. Stance: short deeply in the money, trailing toward $880; only a reclaim of $1,590 ends it.',
    lead: { rank: 9, status: 'live', entry: '$1,536 filled', stop: '$1,590', targets: '$1,287 → $880', downside: '−16%', tail: '−43%', rr: '~4:1', edge: '✓ T1 $1,363 + T2 $1,287 both banked — after Friday’s −10.79% re-arm SNDK dumped another −11.02% to $1,278.23, slicing clean through the weekly 21-MA / daily-lower-BB $1,287 with no bid (≈ +17% for the short from $1,536), only the 50-week $880 left; most oversold name on the board (4H Stoch 8.17, far below the 4H lower BB $1,524) so a bounce into $1,363–1,470 is the cleaner add, weekly RSI ~52 leaves room, only a reclaim of $1,590 ends it' },
    side: 'short', accent: 'red',
    date: '2026-07-27',
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
    price: '$816.99', change: '−4.07% close · BROKE $835 · fade confirmed · low $788',
    signal: 'The fence broke — the strongest name finally lost its trigger. STX gave way Monday: −4.07% to close $816.99 (AH $817.80), a decisive close BELOW the $835 “short-off” line / weekly 9-EMA, tagging a ~$788 low before bouncing. That is the exact break the card was waiting for — no longer on the fence, now a confirmed short. Daily MACD −17.60 is firmly negative, RSI 39, price under the whole daily stack, and the froth that led the sector up is now unwinding. But the weekly is still a huge intact uptrend (far above the 21-week MA ≈ $700), so this is a deep pullback, not a trend break. Momentum reset off the low (Stoch 30.61), so a bounce into $843–864 is the cleaner re-short. Next: the $770–835 structure → the $788 low → lower on continuation; a reclaim of $864→$898 re-negates.',
    edge: 'The fence broke — STX lost the $835 line it was pressed against, −4.07% to close $816.99 (AH $817.80), a decisive close below $835 / the weekly 9-EMA with a $788 low; the break the card waited for fired, so it is a confirmed short now (MACD −17.60, under the whole daily stack) — a bounce into $843–864 is the cleaner re-short toward the $770 structure, still a deep pullback in a huge weekly uptrend so a reclaim of $864→$898 re-negates',
    side: 'short', accent: 'amber',
    date: '2026-07-27',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$58.29', change: '+3.72% close · short on the ropes · bounce reclaimed the 50-EMA',
    signal: 'Flipped short — but the bounce has it on the ropes. ASTS squeezed +3.72% Monday to close $58.29 (AH $58.39), reclaiming the daily 50-EMA ($57.50) and pushing back above the $57 short entry. RSI is back to 55 and MACD (−0.40) is crossing up — the fade is failing, not extending. Per the plan, a reclaim of $61 negates the short and repairs the long, with the B. Riley Buy $85 / Midland catalyst as the fuel — so the short is underwater and pinned ~4% under its $61 stop: it holds ONLY below $61. Up +3.72% while the tape was flat is a relative-strength tell that the fade may be done. Stance: short at risk — it needs to roll back under $56 to stay valid; a push over $61 stops it out and flips the read long again toward the 200-EMA ≈ $63.',
    edge: 'Flipped short, now on the ropes — ASTS squeezed +3.72% to $58.29 (AH $58.39), reclaiming the 50-EMA ($57.50) and pushing back over the $57 entry with RSI back to 55; the fade is failing and pinned ~4% under the $61 stop — it holds only below $61 (needs to roll back under $56 to stay valid), a push over $61 stops it out and flips it long again toward the 200-EMA ≈ $63 (B. Riley Buy $85 the fuel)',
    side: 'short', accent: 'violet',
    date: '2026-07-27',
    story: 'stories/asts.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$187.88', change: '+0.06% close · flat under $200 · short armed, grinding to $160',
    signal: 'Breakdown leader — the re-arm held, now grinding under $200. After Friday’s −15.02% collapse back under the $200 zone, Monday just consolidated the break: NBIS closed $187.88 (+0.06%, AH $189.10), chopping the $181–189 range with a $181 low and no bounce back to the zone. The short stays armed under $200 — price is capped under every MA (daily 50-EMA $200.98, 200-EMA $205.91) and pinned to the lower BB ($181.09), MACD −5.77 — but it hasn’t started the next leg toward T1 $160 yet. Momentum is mid-range now (Stoch 37, RSI 41), so it is neither a chase nor a clean add here; the cleaner re-short is still a bounce into $200–213, and a break of the $181 low is what opens $160 → 200-day ≈ $150 → 🕳️ $130. Stance: short live under $200, coiling — add on a bounce into $200–213 or on a break under $181; only a 2nd close back over $213 ends it.',
    lead: { rank: 4, status: 'live', entry: '$200 filled', stop: '$213', targets: '$160 → $147 → $130', downside: '−15%', tail: '−31%', rr: '~3:1', edge: 'Breakdown leader — after Friday’s −15.02% re-arm under $200, NBIS just consolidated (+0.06% to $187.88, AH $189.10), chopping $181–189 with no bounce back to the zone; capped under every MA and pinned to the lower BB ($181.09), the next leg to T1 $160 → 200-day ≈ $150 → $130 needs a break of the $181 low — a bounce into $200–213 is the cleaner add, only a 2nd close over $213 ends it' },
    side: 'short', accent: 'indigo',
    date: '2026-07-27',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$516.89', change: '−3.61% close · fade hit $510 (low $492) · bounced, under the stack',
    signal: 'Technical fade — delivered. AMAT followed through Monday: −3.61% to close $516.89 (AH $515.49), tagging a ~$492 low straight through the $510 fade target before bouncing. That is the fade-the-approach paying — price is under the whole MA stack (daily 50-EMA $541.22, 200-EMA $570.17), daily MACD −9.50 now firmly negative. It stays a technical fade, not a fundamental short — equipment rides the TSMC buildout and the higher timeframes are only cooling, not broken — so it stays off the ranked board. Momentum reset off the low (Stoch back to 31, RSI 40), so a bounce into $531–541 is the cleaner re-short, not a chase. Target $510 done; the next leg needs a break of the $492 low toward the lower BB. A reclaim of $560→$575 negates.',
    edge: 'Technical fade delivered — AMAT broke another −3.61% to $516.89 (AH $515.49), tagging a ~$492 low through the $510 target before bouncing; under the whole MA stack (50-EMA $541.22) with MACD −9.50, but still a pullback not a fundamental short (equipment rides the TSMC buildout), so kept off the board — a bounce into $531–541 is the cleaner re-short, next leg needs a break of $492, reclaim $560→$575 negates',
    side: 'short', accent: 'red',
    date: '2026-07-27',
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
    price: '$282.52', change: '−3.11% close · nearing T2 $280 · driving to $250',
    signal: 'Dip-buy dead — the fade is grinding to T2. After Friday’s −10.82% break through T1 $300, ALAB kept sliding: the new day dropped another −3.11% to close $282.52 (AH flat), tagging the mid-$270s intraday before a small bounce — now pressing T2 $280. That is the fade working, ≈ +9% for the short from $310. It is under the whole 1H MA stack with price below the lower Bollinger; near-term the 1H Stoch has curled up off oversold (the bounce is underway), so a push back into $295–305 is the cleaner add, not a chase of the low. The weekly still has room (not oversold). Next: T2 $280 → 🕳️ the $250 May base (T3), with the 200-EMA far below. Stop $362 untouched and well clear. Stance: short working, T1 banked; trail toward $280/$250, add on a bounce, and only a reclaim of $362 repairs the long case.',
    lead: { rank: 14, status: 'live', entry: '$310 filled', stop: '$362', targets: '$300 → $280 → $250', downside: '−10%', tail: '−19%', rr: '~3:1', edge: 'Dip-buy dead — after Friday’s −10.82% break through T1 $300, ALAB slid another −3.11% to $282.52, tagging the mid-$270s intraday and now pressing T2 $280 (≈ +9% for the short from $310); fade working toward 🕳️ the $250 base, but the 1H Stoch has curled up off oversold so a push into $295–305 is the cleaner add, stop $362 far, only a reclaim of $362 repairs the long' },
    side: 'short', accent: 'emerald',
    date: '2026-07-27',
    story: 'stories/alab.html',
  },
  {
    symbol: 'CRDO', exchange: 'NASDAQ',
    price: '$208.14', change: '−2.35% close · tagged T1 $200 intraday · AH $207',
    signal: 'Dip-buy dead — the fade tagged T1 intraday. After Friday’s −9.87% break through the $219 floor, CRDO kept fading: the new day dropped another −2.35% to close $208.14 (AH $207.00), and intraday it tagged the T1 $200 zone (low ≈ $197.72 = the lower Bollinger) before bouncing into the close. That is the fade delivering. Near-term the 1H Stoch has curled up off oversold (the bounce is underway), so a push back into the broken $219–225 zone is the cleaner re-short add, not a chase of the low. The weekly is still an uptrend (a pullback in the leader with room, not yet a trend break). Short live toward $200 → $190 → 🕳️ $175 breakout shelf, stop $242 untouched; a reclaim of $242 repairs the long case.',
    lead: { rank: 13, status: 'live', entry: '$219–230 filled', stop: '$242', targets: '$200 → $190 → $175', downside: '−11%', tail: '−22%', rr: '~2.5:1', edge: 'Dip-buy dead — after Friday’s −9.87% break through $219, CRDO faded another −2.35% to close $208.14 and tagged the T1 $200 zone intraday (low ≈ $197.72 = lower BB) before an AH bounce to $207; the 1H Stoch has curled off oversold so a push into $219–225 is the cleaner re-short add, weekly still an uptrend (pullback with room), stop $242 clear — reclaim $242 repairs the long' },
    side: 'short', accent: 'cyan',
    date: '2026-07-27',
    story: 'stories/crdo.html',
  },
  {
    symbol: 'DELL', exchange: 'NYSE',
    price: '$426.91', change: '−2.42% close · pulled back to the $409–420 buy zone · still > $402',
    signal: 'Bull-flag pullback — the dip the plan wanted. DELL finally gave back some froth: the new day fell −2.42% to close $426.91 (AH flat $426.91), back under the $432 breakout line and into the $409–420 dip-buy zone the card flagged (tested the mid-$410s intraday, bounced). This is a normal pullback in a strong uptrend, not a top — it ran $100 → $450+ and remains well above the $402 short-revival line, with the daily 21-day mid-BB (≈ $417) and 9-EMA right beneath as the buy shelf. Momentum has cooled (30-min MACD ≈ −4.5, RSI ~45), so don’t reach — let it stabilize on the $417–420 shelf for the cleaner long. Stance: still a long-side name, dip-buy zone reached; a reclaim of $432 re-confirms the breakout, and only a decisive loss of $402 would revive a short toward $377 → $330. Off the ranked board.',
    edge: 'Bull-flag pullback, the dip the plan wanted — DELL gave back −2.42% to $426.91, back under the $432 line and into the $409–420 dip-buy zone, but still well above the $402 short-revival line (daily uptrend intact after a $100 → $450+ run); momentum cooled so don’t reach — let it stabilize on the $417–420 shelf for the cleaner long, a reclaim of $432 re-confirms the breakout, only a loss of $402 revives a short, off the ranked board',
    side: 'long', accent: 'amber',
    date: '2026-07-27',
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
