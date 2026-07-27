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
    price: '$206.84', change: '≈ flat close · HELD while the group crashed −7 to −15%',
    signal: 'The AI leader that held — and Friday proved it. While the entire semi group broke (SMH −3.3%, and MU/COHR/BE/NBIS/SNDK −7 to −15%), NVDA closed roughly flat around $206.84 — the exact relative-strength tell the dip-buy wanted: the leader holds when the group breaks. The $198–200 dip-buy off the right shoulder is well in the money — price is riding the daily 9/50-EMA (≈ $205–206), far above the rising 200-day ($189) and the $194 stop. Daily RSI 51 is neutral, and the weekly is still a clean uptrend (MACD ≈ +6.6). But the follow-through is still missing: NVDA is chopping $205–215, capped under the $214 neckline, so the measured targets haven’t triggered. Stance: dip-buy live and now confirmed by the relative strength — a daily close over $214 on volume opens $230 → $234; a loss of $205→$200 with the group still bleeding delays it back to the shoulder; only under $194 breaks the pattern.',
    lead: { rank: 12, status: 'wait', entry: '$198–200 filled', stop: '$194', targets: '$214 → $230 → $234', downside: '+8%', tail: '+18%', rr: '~3.5:1', edge: 'The AI leader that held — while the semi group crashed −7 to −15% Friday, NVDA closed roughly flat ~$206.84, the relative-strength tell the dip-buy wanted; the $198–200 long is in the money (riding the daily 9/50-EMA, far above the 200-day $189 / stop $194) but still capped under the $214 neckline with no follow-through — a close over $214 opens $230→$234, a loss of $205→$200 delays it, under $194 breaks it' },
    side: 'long', accent: 'emerald',
    date: '2026-07-24',
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
    price: '$53.20', change: '−8.75% close · through the fade zone · driving to $50',
    signal: 'Roundhill Memory ETF — the fade worked, the lower high resolved down. ~75% is three memory names (Micron 25.8%, Samsung ~25%, SK Hynix ~24%, via total-return swaps), so it tracks memory, not the broad KOSPI: US memory weakens → Samsung/Hynix gap down overnight → DRAM gaps at the US open, a feedback loop with MU/SNDK/WDC/STX. The bounce to $58.85 was a lower high, not a bottom (exactly as flagged), and Friday it broke −8.75% to close $53.20 — clean through the $55.5–58 fade zone, now driving toward T1 $50 and the key $47.5–48.5 cluster (61.8% fib + rising 50-day + lower BB). Still below every MA, and now deeply oversold near-term: 1H RSI 31 / Stoch 12, daily RSI 42. So a reflex bounce toward $55.5–58 is the cleaner re-short, not a chase. Targets $50 → 🎯 $47.5–48.5 → $42–44; 🕳️ washout $38.5–40. A close &gt;$61 + retest flips it neutral.',
    edge: 'Korean-memory basket (≈75% Micron/Samsung/SK Hynix via swaps) breaking down — the bounce to $58.85 was a lower high, and Friday DRAM cracked −8.75% to $53.20 through the $55.5–58 fade zone toward T1 $50; 1H oversold (RSI 31 / Stoch 12) so a bounce toward $55.5–58 is the cleaner re-short, the $47.5–48.5 fib/50-day cluster the magnet, $61 the regime-change line',
    side: 'short', accent: 'indigo',
    date: '2026-07-24',
    story: 'stories/dram.html',
  },
  {
    symbol: 'AAOI', exchange: 'NASDAQ',
    price: '$100.15', change: '−10.60% close · re-armed under $113 · sitting on the 200-EMA',
    signal: 'Heaviest OBV collapse in the group — and the re-arm just fired. The +15.76% pump to $119.26 (Jul 21) was a short-cover overshoot that ran to the $120 stop; it never got its second day, and Friday it crashed −10.60% to close $100.15 (AH flat, $100.15) — a decisive fade back UNDER $113, the exact re-arm trigger. New WEEKLY close $100.15 back under the pump, landing right on the daily 200-EMA (≈ $98–100 / the $100 must-hold). The short is re-armed and working toward T1 $90 → $82 → 🕳️ the weekly 21-MA. Momentum: 1H deeply oversold (RSI 28, Stoch 7.8) so a reflex bounce into $106–113 is the cleaner add; daily RSI 38.6 / MACD −13.69 and weekly RSI 44.8 (MACD still positive but the histogram rolling over) leave plenty of room — the parabola is only starting to unwind. Only a reclaim back over $120 ends it.',
    lead: { rank: 6, status: 'live', entry: '$113 filled', stop: '$120', targets: '$90 → $82 → $58', downside: '−20%', tail: '−49%', rr: '~4:1', edge: 'Heaviest OBV collapse in the group — the +15.76% pump overshot to the $120 stop but got no 2nd day, then Friday crashed −10.60% to $100.15 back under $113: the re-arm fired and the short is working, landing on the daily 200-EMA (≈ $100). Trailing $90 → $82 → 🕳️ the weekly 21-MA; 1H deeply oversold (Stoch 7.8) so a bounce into $106–113 is the cleaner add, weekly RSI 44.8 leaves room, only a reclaim over $120 ends it' },
    side: 'short', accent: 'violet',
    date: '2026-07-24',
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
    price: '$92.09', change: '−8.12% close · T1 $92 hit · fade working to $89 → $69',
    signal: 'Worst OBV in the group — and it delivered. The pump into the $98–111 fade zone had no breakout energy (worst OBV on the board, 4H OBV deeply negative ≈ −536M — pure distribution), and Friday it broke: −8.12% to close $92.09, landing right on T1 $92. That is the fade working, not a wick — INTC closed below the daily lower Bollinger (≈ $97) with the whole daily MA stack overhead. Momentum is bearish but stretched short-term: daily RSI 37 / Stoch 27, 4H RSI 35 / Stoch 27, so a reflex bounce into $98–102 is the cleaner re-entry; the weekly (RSI 52, MACD still positive off the big base) leaves room for the next leg. Next: the weekly 21-MA ≈ $89 → 🕳️ 200-EMA ≈ $69, which sits right at the unfilled $66 gap. Stance: short working, T1 banked; trail toward $89 then $69, add on a bounce, and a reclaim of $118 negates.',
    edge: 'Worst OBV in the group delivered — the pump into $98–111 had no energy and INTC broke −8.12% to $92.09, hitting T1 $92 (closed below the daily lower BB); fade working toward the weekly 21-MA ≈ $89 → 🕳️ 200-EMA ≈ $69 / the $66 gap, but daily RSI 37 / Stoch 27 oversold so a bounce into $98–102 is the re-entry, weekly RSI 52 leaves room, reclaim $118 negates',
    side: 'short', accent: 'blue',
    date: '2026-07-24',
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$900.20', change: '−2.25% close · broke under $905 · re-arm fired',
    signal: 'Memory bellwether — the $905 re-arm finally cracked. MU had been knocking on the door; the new day faded another −2.25% to close $900.20 (AH flat $900.42), a close back UNDER the $905 re-short zone — the decisive break the plan wanted. It is the mildest decliner of the group (held far better than SNDK’s −11%), but structure is now broken: price is under the whole 4H MA stack (9-EMA $947 / 50-EMA $997 / 200-EMA $941) and pinned to the lower Bollinger ($886). Momentum is bearish but near-term stretched (4H RSI 38.78, Stoch 19.98, MACD −17.6), and the weekly is still a parabola (MACD hugely positive, far above the 200-day $541) — so a reflex bounce toward $955 is live before the next leg. Stance: re-arm fired, short live toward $800 → weekly 21-MA $665 → 🕳️ $505; a bounce into $955 is the cleaner add, and a 2nd day back over $955 (or a close over $1,005) ends it. The bellwether that dragged the group up is now leading it down through the trigger.',
    lead: { rank: 7, status: 'live', entry: '$905 filled', stop: '$1,005', targets: '$800 → $665 → $505', downside: '−12%', tail: '−44%', rr: '~4:1', edge: 'Memory bellwether — the $905 re-arm cracked: MU faded −2.25% to close $900.20, back under the $905 zone (the mildest decliner, held far better than SNDK’s −11%) but now under the whole 4H MA stack and pinned to the lower BB $886; short live toward $800 → weekly 21-MA $665 → 🕳️ $505, but 4H Stoch 20 oversold so a bounce toward $955 is live first, a 2nd day over $955 ends it' },
    side: 'short', accent: 'cyan',
    date: '2026-07-27',
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
    price: '$146.65', change: '−6.03% close · T1 $151 hit · driving to $144',
    signal: 'Break-and-retest — the fade is paying, T1 done. The bounce to $162.41 stalled UNDER the $165–175 zone (never gave the ideal re-short push), then rolled: Friday GLW broke −6.03% to close $146.65, straight through T1 $151 and now pressing the $144 magnet (T2). That is about +8% for the short from the ~$160 rejection. It is still a clean downtrend — blew through $180 and $167 on an OBV collapse, price below every MA — but deeply oversold near-term: 1H RSI 29.8 / Stoch 5.9, daily RSI 36 / Stoch 10.8. So a reflex bounce into $151–159 is the cleaner add, not a chase; the weekly (RSI 46, MACD still +21) leaves room. Next: T2 $144 → 🕳️ $130 (the rising daily 200-EMA ≈ $131 sits right there). Stop $184 untouched and far. Only a reclaim of $184 negates.',
    lead: { rank: 3, status: 'live', entry: '$160 filled', stop: '$184', targets: '$151 → $144 → $130', downside: '−10%', tail: '−19%', rr: '~3:1', edge: 'Break-and-retest paying — the bounce stalled under $165–175 then rolled, and Friday GLW broke −6.03% to $146.65 through T1 $151 toward the $144 magnet (≈ +8% for the short); still a downtrend under every MA but 1H RSI 30 / Stoch 6 deeply oversold, so a bounce into $151–159 is the cleaner add, T3 $130 = daily 200-EMA, only a reclaim of $184 negates' },
    side: 'short', accent: 'blue',
    date: '2026-07-24',
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
    price: '$548.55', change: '−2.25% close · hit the $547–550 shelf · next $535 → $510–518',
    signal: 'The board’s barometer — the confirmed break kept bleeding, straight into first support. After Friday’s daily+weekly close under $580, SMH didn’t bounce: the new day faded another −2.25% (−$12.64) to close $548.55 (AH $548.22), right into the $547–550 “must-hold” shelf and sitting on the 4H lower Bollinger ($544.65). It is under every MA (4H 9/50/200-EMA = $558.52 / $576.17 / $585.55) with momentum still bearish but near-term stretched (4H RSI 38.04, Stoch 17.77, MACD −7.3). Big picture the uptrend is intact (weekly MACD positive, far above the weekly 50-EMA $431), and weekly RSI is still nowhere near oversold — so even a bounce off $547–550 doesn’t end it. Stance: the confirmed loss of $580 keeps the board’s short fades ARMED and active (NBIS / AAOI / SNDK / MU / COHR / TER); a loss of $547–550 opens $535 swing-low → the fat $510–518 confluence (0.5 fib $515 + 21-week MA $513 + open gap $510 + daily lower BB). Only a reclaim back over $580 with breadth negates the fade.',
    edge: 'The board’s barometer kept bleeding into first support — after Friday’s daily+weekly close under $580, SMH faded another −2.25% to $548.55, right into the $547–550 must-hold shelf / 4H lower BB ($544.65), under every MA; weekly RSI still not oversold (room to fall) even as the 4H is stretched — the confirmed break keeps the board’s fades armed toward $535 → the $510–518 confluence, only a reclaim over $580 negates',
    side: 'short', accent: 'red',
    date: '2026-07-27',
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
    price: '$187.77', change: '−15.02% close · full re-arm under $200 · heading to $160',
    signal: 'Breakdown leader — the overshoot fully unwound, short re-armed and running. NBIS had squeezed well past the $213 stop (to ≈ $237 intra-week), but it never confirmed with a hold — instead Friday it collapsed −15.02% to close $187.77, blowing back UNDER the $200 zone. That is the full re-arm the plan wanted, and the short is now working toward T1 $160 → 200-day ≈ $150 → 🕳️ $130. Momentum: short-term oversold after a −15% day (4H Stoch ~12, RSI ~40), so a reflex bounce into $200–213 is the cleaner add; the weekly (RSI 53.5, MACD still positive) shows the parabola is only starting to unwind, with room left. Daily MACD rolling back down (≈ −8.1). Stance: short live under $200 — trail toward $160; a bounce into $200–213 is the re-entry, and only a 2nd close back over $213 ends it.',
    lead: { rank: 4, status: 'live', entry: '$200 filled', stop: '$213', targets: '$160 → $147 → $130', downside: '−20%', tail: '−35%', rr: '~3:1', edge: 'Breakdown leader — the +18.78% squeeze overshot the $213 stop (to ≈ $237) but never held, then Friday collapsed −15.02% to $187.77 back under $200: the full re-arm fired and the short is working toward $160 → 200-day ≈ $150 → $130; short-term oversold (4H Stoch ~12) so a bounce into $200–213 is the cleaner add, weekly RSI 53.5 leaves room, only a 2nd close over $213 ends it' },
    side: 'short', accent: 'indigo',
    date: '2026-07-24',
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
    price: '$185.08', change: '−14.83% close · T1 $200 + T2 $185 hit · at the last leg',
    signal: 'Downtrend leader — the fade is paying, T1 and T2 both hit. BE was already rolling under the $219–234 re-short zone and Friday it accelerated: −14.83% to close $185.08, blowing through T1 $200 straight to T2 $185 — about +18% for the short from the entry zone. It’s now on the last leg toward T3 ≈ $170 (daily 209-EMA / 50-week confluence), but deeply oversold and stretched: 4H Stoch 18 / daily Stoch 17.7 / RSI 36, with price below BOTH the 4H ($188.63) and daily ($230.36) lower Bollingers. So a reflex bounce is likely near-term — the $200–219 area is the cleaner place to add — while the weekly (RSI 46) still leaves room for the final leg. Structure is a clean downtrend under every MA (4H 9/50/209 = $209/$238/$261), stop $250 untouched and far above. Stance: short working, T1+T2 banked; trail toward $170 and don’t chase the oversold — add on a bounce into $200–219. Only a reclaim of $234→$250 repairs it.',
    lead: { rank: 5, status: 'live', entry: '$219–234 filled', stop: '$250', targets: '$200 → $185 → $170', downside: '−11%', tail: '−25%', rr: '~3:1', edge: 'Downtrend leader, fade paying — BE crashed −14.83% to $185.08, through T1 $200 to T2 $185 (≈ +18% for the short from the $219–234 zone); last leg is T3 ≈ $170 (daily 209-EMA) but deeply oversold (4H/daily Stoch ~18, below both lower BBs) so a bounce into $200–219 is the cleaner add, weekly RSI 46 still leaves room, stop $250 far off — only a reclaim of $234→$250 repairs it' },
    side: 'short', accent: 'amber',
    date: '2026-07-24',
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
