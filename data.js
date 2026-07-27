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
    price: '$197.20', change: '−4.66% close · lost $205→$200 · long on the ropes at the $194 stop',
    signal: 'The leader that held Friday finally broke Monday. NVDA cracked −4.66% to close $197.20 (AH $196.57), losing BOTH $205 and $200 and closing below the daily 200-EMA ($205.69) — landing right on the $194 stop. Per the plan, a loss of $205→$200 with the group still bleeding "delays it back to the shoulder," and only a close under $194 breaks the pattern — so the dip-buy is on the ropes but not dead: $194 is intact by a whisker. It is now deeply oversold (daily RSI 29, Stoch 10), so a reflex bounce toward $205 is live and that is what would keep the long alive. But the relative-strength tell — the whole reason to hold — just failed its first real test: the leader is no longer holding while the group breaks. Stance: long at its stop line — hold ONLY above $194; a reclaim of $205→$214 revives the dip-buy toward $230→$234, and a daily close under $194 stops it out and flips the read short toward the $189 200-day → $180s (like the group names).',
    lead: { rank: 12, status: 'live', entry: '$198–200 filled', stop: '$194', targets: '$205 → $214 → $234', downside: '+9%', tail: '+19%', rr: '~3:1', edge: 'The leader that held finally broke — NVDA cracked −4.66% to $197.20 (AH $196.57), losing $205 and $200 and closing below the 200-EMA ($205.69), right on the $194 stop; the dip-buy is on the ropes (relative-strength tell just failed) but $194 holds by a whisker and it is deeply oversold (RSI 29, Stoch 10) so a bounce toward $205 is live — reclaim $205→$214 revives it, a close under $194 stops it out and flips the read short toward the $189 200-day' },
    side: 'long', accent: 'emerald',
    date: '2026-07-27',
    story: 'stories/nvda.html',
  },
  {
    symbol: 'COHR', exchange: 'NYSE',
    price: '$282.39', change: '−9.84% close · re-short paying · nearing T1 $265 (200-day)',
    signal: 'Weekly-structure break — the re-short from $310 is paying, T1 in sight. The +11.15% pump overshot the $310 stop to $317.22 but never repaired (no close over the $321 21-week MA), and Friday it broke hard: −9.84% to close $282.39, closing below the daily lower Bollinger (≈ $305) and driving toward T1 $265 (the daily 200-EMA at $264). That is about +9% for the short from the $310 re-arm. Deeply oversold near-term — 1H RSI 25.7 / Stoch 8, daily RSI 38 — so a reflex bounce into $300–310 is the cleaner add, not a chase; the weekly (RSI 47, MACD still +42 and repairing) has more room for the next leg. Next: T1 $265 (200-day) → T2 $247 (50-week) → 🕳️ $215. Stop $321 untouched and far. Stance: re-short working; trail toward $265/$247, add on a bounce, only a reclaim of $321 repairs it.',
    lead: { rank: 1, status: 'live', entry: '$310 filled', stop: '$321', targets: '$265 → $247 → $215', downside: '−14%', tail: '−30%', rr: '~5:1', edge: 'Weekly-structure break, re-short paying — COHR broke −9.84% to $282.39, below the daily lower BB ($305) and nearing T1 $265 (daily 200-EMA); ~+9% for the short from the $310 re-arm, but 1H RSI 26 / Stoch 8 deeply oversold so a bounce into $300–310 is the cleaner add, weekly RSI 47 leaves room, T2 $247 (50-week) → 🕳️ $215, only a reclaim of $321 repairs it' },
    side: 'short', accent: 'violet',
    date: '2026-07-24',
    story: 'stories/cohr.html',
  },
  {
    symbol: 'IREN', exchange: 'NASDAQ',
    price: '$37.22', change: '−8.27% close · long stopped, FLIPPED short · eyeing $30',
    signal: 'Flipped short — the long broke and the market is taking it lower. Instead of reclaiming $41.70, IREN cracked −8.27% Friday to close $37.22 (AH $37.15), clean through the old $38.90 long stop and under the daily 200-EMA (≈ $44). That flips the read: with the whole group breaking on the weekly close, the fade now targets the $33–34 gap → 🎯 $30 (weekly support), and deeper $27 if the crash extends. The ≈$2.8B AI-cloud catalyst is the reason to keep size honest — a reclaim of $41.70 repairs the long — but the structure is broken. 1H is deeply oversold (RSI 28, Stoch 7.0) so don’t chase the low: a bounce into $40–41 is the cleaner short entry, stop $42. Daily MACD −3.91 / RSI 39 and weekly RSI 44 (MACD rolling) leave room down.',
    lead: { rank: 11, status: 'live', entry: '$38.90 filled', stop: '$42', targets: '$34 → $30 → $27', downside: '−13%', tail: '−31%', rr: '~3:1', edge: 'Long stopped, flipped short — IREN broke −8.27% to $37.22 through the old $38.90 stop and the daily 200-EMA (≈ $44); the fade targets the $33–34 gap → 🎯 $30 (weekly support), deeper $27 if the market keeps crashing. 1H deeply oversold (Stoch 7.0) so a bounce into $40–41 is the cleaner entry, stop $42; the ≈$2.8B AI-cloud catalyst is the risk — a reclaim of $41.70 repairs the long' },
    side: 'short', accent: 'red',
    date: '2026-07-24',
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
    price: '$53.20', change: '−8.75% close · through the fade zone · driving to $50',
    signal: 'Roundhill Memory ETF — the fade worked, the lower high resolved down. ~75% is three memory names (Micron 25.8%, Samsung ~25%, SK Hynix ~24%, via total-return swaps), so it tracks memory, not the broad KOSPI: US memory weakens → Samsung/Hynix gap down overnight → DRAM gaps at the US open, a feedback loop with MU/SNDK/WDC/STX. The bounce to $58.85 was a lower high, not a bottom (exactly as flagged), and Friday it broke −8.75% to close $53.20 — clean through the $55.5–58 fade zone, now driving toward T1 $50 and the key $47.5–48.5 cluster (61.8% fib + rising 50-day + lower BB). Still below every MA, and now deeply oversold near-term: 1H RSI 31 / Stoch 12, daily RSI 42. So a reflex bounce toward $55.5–58 is the cleaner re-short, not a chase. Targets $50 → 🎯 $47.5–48.5 → $42–44; 🕳️ washout $38.5–40. A close &gt;$61 + retest flips it neutral.',
    edge: 'Korean-memory basket (≈75% Micron/Samsung/SK Hynix via swaps) breaking down — the bounce to $58.85 was a lower high, and Friday DRAM cracked −8.75% to $53.20 through the $55.5–58 fade zone toward T1 $50; 1H oversold (RSI 31 / Stoch 12) so a bounce toward $55.5–58 is the cleaner re-short, the $47.5–48.5 fib/50-day cluster the magnet, $61 the regime-change line',
    side: 'short', accent: 'indigo',
    date: '2026-07-24',
    story: 'stories/dram.html',
  },
  {
    symbol: 'AAOI', exchange: 'NASDAQ',
    price: '$97.82', change: '−2.33% close · lost the $100 line · low $93, grinding to T1 $90',
    signal: 'Heaviest OBV collapse in the group — and the re-arm keeps grinding. After Friday’s −10.60% break back under $113, Monday lost the $100 must-hold: AAOI closed $97.82 (−2.33%, AH $97.98), poking a $93.44 low toward T1 $90 before recovering. Still pinned under every MA (daily 50-EMA $104.18, 200-EMA $111.76) and hugging the lower BB ($93.44), the short is working — T1 $90 → $82 → 🕳️ weekly 21-MA. Momentum has reset off the low (Stoch back to 37 from 7.8, RSI 41, MACD −2.84), so this is neither a chase of the low nor a fresh add — the cleaner re-short is a bounce into $104–113. Weekly RSI 45, MACD histogram still rolling over: the parabola is only part-way unwound, room left. Only a reclaim back over $120 ends it.',
    lead: { rank: 6, status: 'live', entry: '$113 filled', stop: '$120', targets: '$90 → $82 → $58', downside: '−16%', tail: '−41%', rr: '~4:1', edge: 'Heaviest OBV collapse in the group — after Friday’s −10.60% break, AAOI lost the $100 line Monday (−2.33% to $97.82, AH $97.98), poking a $93.44 low toward T1 $90; still under every MA and on the lower BB, working $90 → $82 → 🕳️ weekly 21-MA, Stoch reset to 37 so a bounce into $104–113 is the cleaner add, weekly RSI 45 leaves room, only a reclaim over $120 ends it' },
    side: 'short', accent: 'violet',
    date: '2026-07-27',
    story: 'stories/aaoi.html',
  },
  {
    symbol: 'WDC', exchange: 'NASDAQ',
    price: '$519.80', change: '−6.90% close · sitting on the $513 line / 50-EMA · watch the break',
    signal: 'The healthiest name — now pressed right onto the trigger line. WDC gave back another chunk Friday: −6.90% to close $519.80, and it is now sitting right on the $513 re-arm floor / daily 50-EMA ($514) — the exact decision point the card was watching. It held up far better than the crashing names (SNDK/BE/NBIS all −10 to −15%), and structurally it is still the strongest: weekly MACD hugely positive (≈ +89) and price far above the 200-day ($318), a pullback inside a big uptrend, not a breakdown. But the froth keeps coming off — daily MACD just crossed negative (≈ −10.5), 4H Stoch 26 (oversold, so a bounce off the line is live). Stance: still no confirmed short — it is AT the line, not through it. A decisive daily close BELOW $513 finally re-arms the fade toward the $486–513 zone → the daily lower BB ≈ $455; holding $513 / the 50-EMA keeps it in trend and a reclaim of $535 re-negates. This is the one group name still on the fence.',
    edge: 'The healthiest name, now on the trigger line — WDC faded −6.90% to close $519.80, sitting right on the $513 re-arm floor / daily 50-EMA ($514) while SNDK/BE/NBIS crashed −10 to −15%; still a pullback inside a big uptrend (weekly MACD ≈ +89, far above the 200-day $318) but daily MACD just turned negative — no short until a decisive close below $513 re-arms toward $486 → the lower BB ≈ $455, a hold of $513 keeps it in trend',
    side: 'short',
    date: '2026-07-24',
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
    price: '$920.95', change: '−6.99% close · back under $955 · knocking on the $905 re-arm',
    signal: 'Memory bellwether — the overshoot fully unwound, now knocking on the $905 re-arm door. MU had overshot the $955 stop to $970.82 on the pump, but it never confirmed — Friday it faded −6.99% to close $920.95, well back under the $955 stop and now just above the $905 re-short zone. It is sitting at the 1H lower Bollinger (≈ $921) with the daily 50-EMA ($894) right beneath. Not a full re-arm yet — that needs a decisive push under $905 — but the direction is right and it is close. Big-picture still a parabola (weekly MACD ≈ +163, RSI 62, far above the 200-day $541), so short-term it is oversold (1H Stoch 13 / RSI 34) and a bounce toward $955 is live first. Stance: on watch at the doorstep — a decisive push under $905 fully re-arms the short toward $800 → weekly 21-MA $665 → 🕳️ $505; a 2nd day over $955 or a close over $1,005 ends it. The bellwether that dragged the group up is leading it back to the trigger.',
    lead: { rank: 7, status: 'wait', entry: '$905 re-arm', stop: '$1,005', targets: '$800 → $665 → $505', downside: '−12%', tail: '−44%', rr: '~4:1', edge: 'Memory bellwether — the +12.17% pump overshot the $955 stop to $970.82 but never held, and Friday faded −6.99% to $920.95, back under $955 and knocking on the $905 re-arm door (at the 1H lower BB, daily 50-EMA $894 beneath); a push under $905 fully re-arms toward $800 → weekly 21-MA $665, but 1H Stoch 13 oversold so a bounce to $955 is live first, a 2nd day over $955 ends it' },
    side: 'short', accent: 'cyan',
    date: '2026-07-24',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$349.92', change: '−6.38% close · back under $358 · knocking on the $346 re-arm',
    signal: 'Shelf-break — the overshoot unwound, now knocking on the $346 re-arm door. TER had overshot the $358 stop to $374.04 on the pump, but it never confirmed — Friday it faded −6.38% to close $349.92, well back under the $358 stop and now just above the $346 re-arm floor. It closed below the daily 50-EMA (≈ $362) and the 1H lower Bollinger (≈ $358). Not a full re-arm yet — that needs a decisive push under $346 — but the direction is right and it is close. Big-picture still an uptrend (weekly MACD ≈ +41, RSI 53, far above the 200-EMA $272), so short-term it is oversold (1H RSI 34 / Stoch 14.5) and a bounce toward $358 is live first. Stance: on watch at the doorstep — a decisive push under $346 fully re-arms toward $308 → $292 → 🕳️ 200-EMA $280; a 2nd day over $358 or a reclaim of $390 ends it.',
    lead: { rank: 2, status: 'wait', entry: '$346 re-arm', stop: '$358 (overshot)', targets: '$308 → $292 → $280', downside: '−13%', tail: '−21%', rr: '~4:1', edge: 'Clean shelf-break — the +12.07% pump overshot the $358 stop to $374.04 but never held, and Friday faded −6.38% to $349.92, back under $358 and knocking on the $346 re-arm floor (below the daily 50-EMA $362); a push under $346 fully re-arms toward $308 → 200-EMA $280, but 1H Stoch 14.5 oversold so a bounce toward $358 is live first, a 2nd day over $358 ends it' },
    side: 'short', accent: 'blue',
    date: '2026-07-24',
    story: 'stories/ter.html',
  },
  {
    symbol: 'GLW', exchange: 'NYSE',
    price: '$143.30', change: '−2.28% close · through T2 $144 · low $137, pressing T3 $130',
    signal: 'Break-and-retest — the fade keeps paying, T2 $144 done. GLW followed Friday’s −6.03% with another red day Monday: −2.28% to close $143.30 (AH $143.00), poking a $137 low straight through T2 $144 before recovering. That is roughly +10% for the short from the ~$160 rejection, and it is now pressing the last leg toward 🕳️ T3 $130 (the rising daily 200-EMA ≈ $131 sits right there). Still a clean downtrend — below every MA, on the lower BB ($137.22) — but the near-term oversold has reset (daily Stoch back to 34 from 11, RSI 41, MACD −2.89), so a bounce into $149–153 is the cleaner add, not a chase of the low. Weekly RSI 45 leaves room for the final leg. Stop $184 untouched and far. Only a reclaim of $160 → $184 negates.',
    lead: { rank: 3, status: 'live', entry: '$160 filled', stop: '$184', targets: '$151 → $144 → $130', downside: '−9%', tail: '−14%', rr: '~3:1', edge: 'Break-and-retest paying — GLW added another −2.28% to $143.30 (AH $143), poking a $137 low through T2 $144 (≈ +10% for the short from ~$160), now pressing T3 $130 (= daily 200-EMA ≈ $131); still under every MA on the lower BB ($137.22) but Stoch reset to 34 so a bounce into $149–153 is the cleaner add, weekly RSI 45 leaves room, only a reclaim of $160→$184 negates' },
    side: 'short', accent: 'blue',
    date: '2026-07-27',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,436.56', change: '−10.79% close · RE-ARMED, back under $1,536',
    signal: '✓ T1 $1,363 banked — and the fade just resolved with a −10.79% crash. The +14.27% pump had overshot the $1,590 stop for two sessions (a bull trap — Thursday closed ≈ $1,610), which on the strict plan stands the short aside. But Friday it violently reversed: −10.79% to close $1,436.56, crashing back under $1,536 and clean through the whole $1,470–1,536 zone — the exact “fade back under $1,536 re-arms” trigger. The short is re-armed and working toward the weekly 21-MA $1,287, which now lines up with the daily lower BB ($1,285.92) → 🕳️ 50-week $880. Momentum: 1H is deeply oversold (RSI 29.7, Stoch 10.2 → a reflex bounce is likely), but the daily (RSI 42) and weekly (RSI 54.5) have plenty of room, and weekly MACD is still hugely positive — so this is a parabola unwinding, not yet a trend break. Stance: short live; a bounce into $1,470–1,536 is the cleaner re-entry, and only a reclaim of $1,590 ends it.',
    lead: { rank: 9, status: 'live', entry: '$1,536 filled', stop: '$1,590', targets: '$1,287 → $880', downside: '−16%', tail: '−43%', rr: '~4:1', edge: '✓ T1 $1,363 banked; the +14.27% pump overshot the $1,590 stop (bull trap, Thu ≈ $1,610) then Friday crashed −10.79% to $1,436.56 back under $1,536 through the whole zone — the re-arm fired and is working toward the weekly 21-MA $1,287 (≈ daily lower BB) → 50-week $880; 1H oversold so a bounce into $1,470–1,536 is the cleaner re-entry, only a reclaim of $1,590 ends it' },
    side: 'short', accent: 'red',
    date: '2026-07-24',
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$561.19', change: '−3.27% close · new daily + weekly close below $580 line · FADE CONFIRMED',
    signal: 'The board’s barometer — the break is confirmed on the close, daily AND weekly. The mid-day roll never bounced: SMH closed Friday at $561.19 (−3.27%, −$18.98) near the lows — no recovery bid into the bell. That’s a decisive DAILY close below the $580 / 50-EMA line and under the 21-day mid-BB ($576.05), plus a bearish WEEKLY close back below the weekly 9-EMA ($582.65) — the strongest form of the breakdown the deck flagged, not an intraday wick. Big-picture the uptrend is still intact (weekly MACD positive, price far above the weekly 50-EMA $431 / daily 200-EMA $467), but near-term structure is broken and there’s room to fall: weekly RSI is only ~58 (nowhere near oversold), so this can keep bleeding even while the 1H is short-term oversold (RSI 35.98). Stance: the confirmed loss of $580 keeps the board’s short fades ARMED and active (NBIS / AAOI / SNDK / MU / COHR / TER); a long is not the trade. Support/target ladder: $547–550 → $535 swing-low → the fat $510–518 confluence (daily lower BB $517.82 now converging with the $510–515 weekly magnet: 0.5 fib + 21-week MA + open gap). Only a reclaim back over $580 with breadth negates the fade.',
    edge: 'The board’s barometer — the break is confirmed on the close, daily AND weekly: SMH closed $561.19 (−3.27%) near the lows, below the $580 / 50-EMA line, the 21-day mid-BB ($576) and the weekly 9-EMA ($582.65); weekly RSI only ~58 (not oversold → room to fall) even as the 1H is oversold — the confirmed loss keeps the board’s fades armed toward $547–550 → $535 → the $510–518 confluence (daily lower BB + weekly magnet), only a reclaim over $580 negates',
    side: 'short', accent: 'red',
    date: '2026-07-24',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$851.69', change: '−6.75% close · pressed onto the $835/$842 trigger line · watch the break',
    signal: 'Strongest name — now pressed right onto its trigger. STX gave back more froth Friday: −6.75% to close $851.69 (AH ≈ $849), and it is now sitting right on the weekly 9-EMA (≈ $842) just above the $835 “short-off” line — the decision point. Structurally it is still the healthiest name in the group: the weekly is a huge intact uptrend (weekly RSI 60, MACD ≈ +141, price far above the 21-week MA ≈ $700), a pullback not a breakdown, and the short never even triggered because STX led the sector higher. But the froth keeps coming off — daily MACD negative (≈ −10.8), and the 1H is deeply oversold (RSI 30.9, Stoch 13.8) so a bounce off the line is live. Stance: still no short — it is AT the line, not through it. A decisive daily close BELOW $835 finally re-arms the fade toward the $770–835 structure → lower; holding $835 / the weekly 9-EMA keeps it in trend. On the fence, off the ranked board until it breaks.',
    edge: 'Strongest name, now on the trigger line — STX faded −6.75% to close $851.69, sitting on the weekly 9-EMA (≈ $842) just above the $835 short-off line; still a huge intact uptrend (weekly RSI 60, MACD ≈ +141, far above the 21-week MA ≈ $700) and 1H deeply oversold (Stoch 13.8) so a bounce is live — no short until a decisive close below $835 re-arms the fade toward $770, a hold of $835 keeps it in trend, off the ranked board',
    side: 'short', accent: 'amber',
    date: '2026-07-24',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$56.20', change: '−5.04% close · long stopped under $57, FLIPPED short · AH $56.46',
    signal: 'Flipped short — the long broke and it kept bleeding. ASTS never held the $57–60 base: it broke −5.04% Friday to close $56.20 (AH $56.46), through the $57 long stop and far below the daily 200-EMA (≈ $77). That flips the read: the ≈$1B convertible-note dilution overhang is now the driving fundamental, and with the whole group broken, the fade targets the daily lower BB ≈ $50 → $45 → weekly support ≈ $41. It is deeply oversold near-term (1H RSI 30, Stoch 10.9; daily RSI 36) so don’t chase the low — a bounce into $59–61 is the cleaner short entry, stop $61. The B. Riley Buy $85 / Midland catalyst is the risk: a reclaim of $61 negates and repairs the long. Weekly RSI 40 (MACD rolling) leaves room down.',
    lead: { rank: 10, status: 'live', entry: '$57 filled', stop: '$61', targets: '$50 → $45 → $41', downside: '−12%', tail: '−28%', rr: '~3:1', edge: 'Long stopped, flipped short — ASTS broke −5.04% to close $56.20 through the $57 stop and far under the daily 200-EMA (≈ $77); the ≈$1B convertible dilution overhang is the bearish fundamental. Fade toward the daily lower BB ≈ $50 → $45 → weekly $41; 1H deeply oversold (Stoch 10.9) so a bounce into $59–61 is the cleaner entry, stop $61 — a reclaim negates (B. Riley Buy $85 the risk)' },
    side: 'short', accent: 'violet',
    date: '2026-07-24',
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
    price: '$536.25', change: '−4.72% close · rolled from $564 · fade working to $510',
    signal: 'Technical fade — working even without the ideal entry. AMAT never pushed into the $575–590 re-short zone; it rolled from ~$564 and Friday broke −4.72% to close $536.25, back under the $554 nearer-resistance and below the 1H lower Bollinger (≈ $543). The fade-the-approach is playing toward $510, which lines up with the daily 21-day mid-BB (≈ $508). But this stays a technical fade, not a fundamental short — equipment rides the TSMC buildout, and the higher timeframes are still strong (weekly RSI 64, MACD ≈ +67; daily MACD still positive ≈ +6.9), so it is a pullback in an uptrend, kept off the ranked board. Short-term it is oversold (1H RSI 37 / Stoch 13, daily Stoch 28), so a reflex bounce into $554–575 is the cleaner re-short entry. Target $510 → below on continuation; a reclaim of $605 negates.',
    edge: 'Technical fade, not a fundamental short (equipment rides the TSMC buildout) — AMAT never reached the $575–590 zone, rolled from $564 and broke −4.72% to $536.25 under $554 and the 1H lower BB; the fade is working toward $510 (≈ daily mid-BB $508) but higher TFs still strong (weekly RSI 64, MACD +67), so a bounce into $554–575 is the cleaner re-short, reclaim $605 negates',
    side: 'short', accent: 'red',
    date: '2026-07-24',
    story: 'stories/amat.html',
  },
  {
    symbol: 'BE', exchange: 'NYSE',
    price: '$188.32', change: '+1.86% close · reflex bounce off the $178 low · into the add zone',
    signal: 'Downtrend leader — the fade paid, now the reflex bounce is here. BE crashed through T1 $200 and T2 $185 into a $178 low, and Monday it did exactly what the card flagged: bounced +1.86% to close $188.32 (AH $189.00) off the deeply-oversold floor. That is the reflex, not a trend change — price is still under every MA (daily 50-EMA $200.63, 200-EMA $222.64), MACD −6.26, and the bounce is walking straight back into the $200–219 re-short zone the plan called the cleaner place to add. T3 ≈ $170 (daily 209-EMA / 50-week) never printed (low $178), so the last leg is still open. Momentum has reset off the floor (Stoch 49 from 18, RSI 44), which is exactly why chasing the low was wrong and re-shorting into $200–219 is right. Stance: short working, T1+T2 banked; fade the bounce back into $200–219 toward $170, only a reclaim of $234→$250 repairs it.',
    lead: { rank: 5, status: 'live', entry: '$219–234 filled', stop: '$250', targets: '$200 → $185 → $170', downside: '−10%', tail: '−17%', rr: '~3:1', edge: 'Downtrend leader, fade paid then bouncing — BE crashed to a $178 low then Monday reflexed +1.86% to $188.32 (AH $189) straight back toward the $200–219 re-short zone; still under every MA (50-EMA $200.63) with T3 ≈ $170 (daily 209-EMA) still open (low $178 never tagged it), Stoch reset to 49 so fade the bounce into $200–219 toward $170, only a reclaim of $234→$250 repairs it' },
    side: 'short', accent: 'amber',
    date: '2026-07-27',
    story: 'stories/be.html',
  },
  {
    symbol: 'ALAB', exchange: 'NASDAQ',
    price: '$291.58', change: '−10.82% close · T1 $300 hit · fade working to $280 → $250',
    signal: 'Dip-buy dead — and it just cracked. ALAB never even bounced into the $325–350 re-short zone; it rejected from ~$310–320 and Friday broke hard: −10.82% to close $291.58, straight through T1 $300. That is the fade-the-approach working — the weakest bounce of the group gave way first. It closed below the daily lower Bollinger (≈ $301) and the daily 50-EMA (≈ $296), so structure is broken, but it is now deeply oversold: daily Stoch 17.7 / RSI 38, 4H Stoch ~6 / RSI 31 — a reflex bounce into $300–310 is the cleaner re-entry. The weekly (RSI 53.5) still has room. Next: T2 $280 → 🕳️ the $250 May base (T3), with the 200-EMA far below at ≈ $199. Stop $362 untouched and well clear. Stance: short working, T1 banked; trail toward $280/$250, add on a bounce, and only a reclaim of $362 repairs the long case.',
    lead: { rank: 14, status: 'live', entry: '$310 filled', stop: '$362', targets: '$300 → $280 → $250', downside: '−10%', tail: '−19%', rr: '~3:1', edge: 'Dip-buy dead — ALAB never bounced to the $325–350 zone, rejected ~$310 and Friday cracked −10.82% to $291.58 through T1 $300 (below the daily lower BB $301 / 50-EMA $296); fade working toward $280 → 🕳️ the $250 base, but daily Stoch 18 / 4H Stoch 6 deeply oversold so a bounce into $300–310 is the cleaner add, stop $362 far, only a reclaim of $362 repairs the long' },
    side: 'short', accent: 'emerald',
    date: '2026-07-24',
    story: 'stories/alab.html',
  },
  {
    symbol: 'CRDO', exchange: 'NASDAQ',
    price: '$213.15', change: '−9.87% close · fade working toward T1 $200 · AH bounce $216',
    signal: 'Dip-buy dead — and the fade just delivered. The +5.56% bounce (Jul 21) tagged the $219–230 re-short zone (4h Stoch 94/overbought), then Friday CRDO broke hard: −9.87% to close $213.15, clean through the $219 floor and driving toward T1 $200 — which lines up exactly with the daily lower Bollinger (≈ $200). That is the fade working. Daily MACD has crossed negative (≈ −1.86), RSI 44.5, price back under the 21-day mid-BB. After hours it bounces +1.3% to $216 and the 1H is oversold (RSI 37, Stoch 16.5) — so a push back into the broken $219–225 zone is the cleaner re-short add, not a chase of the low. The weekly is still an uptrend (RSI 55, MACD +25.6 positive but the histogram rolling over), so this is a pullback in the leader with room, not yet a trend break. Short live toward $200 → $190 → 🕳️ $175 breakout shelf, stop $242 untouched; a reclaim of $242 repairs the long case.',
    lead: { rank: 13, status: 'live', entry: '$219–230 filled', stop: '$242', targets: '$200 → $190 → $175', downside: '−11%', tail: '−22%', rr: '~2.5:1', edge: 'Dip-buy dead — the +5.56% bounce tagged the $219–230 zone then Friday CRDO crashed −9.87% to $213.15 through the $219 floor toward T1 $200 (= daily lower BB); the fade is working, AH bounces to $216 and 1H oversold (Stoch 16.5) so a push into $219–225 is the cleaner add, weekly still an uptrend (RSI 55) so a pullback with room, stop $242 clear — reclaim $242 repairs the long' },
    side: 'short', accent: 'cyan',
    date: '2026-07-24',
    story: 'stories/crdo.html',
  },
  {
    symbol: 'DELL', exchange: 'NYSE',
    price: '$437.50', change: '−0.42% close · closed OVER the $432 stop · short off',
    signal: 'Bull-flag resolved up — the short is off. DELL was the board’s odd one out and it proved it: while the whole group crashed Friday, DELL held flat at its highs — −0.42% to close $437.50 (AH $436.04), ABOVE the $432 stop, after tagging $451 intraweek. That closes the short exactly as the plan said — “a close over $432 repairs the bull-flag and takes the short off.” It ran $100 → $450+ and this is a breakout from the flag, not a distribution top: the daily uptrend is intact (above the 21-day mid-BB ≈ $409 and the 9-EMA ≈ $417). But it is weekly-overbought (RSI 74, Stoch 81) and extended — don’t chase $437: a pullback to $409–417 is the cleaner long, and only a failure back under $402 would revive a short toward $377 → $330. Off the ranked board — a strong uptrend at the highs, not a setup.',
    edge: 'Bull-flag resolved up — the short is off: DELL was the odd one out and held flat at its highs (−0.42% to $437.50, AH $436.04) while the group crashed Friday, closing above the $432 stop after tagging $451; a breakout not a top (daily uptrend intact), but weekly-overbought (RSI 74) and extended — don’t chase, a pullback to $409–417 is the cleaner long, only a failure under $402 revives a short, off the ranked board',
    side: 'long', accent: 'amber',
    date: '2026-07-24',
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
