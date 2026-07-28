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
    price: '$197.01', change: 'close +0.25% $197.01 · AH $197.22 · coiling $194–199 · fade $199–202 / break <$194',
    signal: 'The leader flipped short — still coiling above the $194 trigger. After the −4.99% flush, NVDA closed $197.01 (+0.25%), a small green day still basing in the $194–199 coil — holding above the $194 break-trigger and below the $199–202 EMA-cluster fade zone. AH flat $197.22. The dip-buy is done — it rejected the $202–206 cluster and closed below the whole MA stack; the relative-strength tell that justified the long has failed. Near-term Stoch has lifted to ~78 (1H RSI 44.56) — near the top of the coil, so a push into $199–202 is the cleaner short entry, stop above $206 — or short the decisive break under $194. Either way the target is the 200-day $189 → $182 → $174. Stance: short-biased under $206, coiling $194–199 — fade the bounce into $199–202 or short the break of $194; only a reclaim back over $206 / the EMA cluster repairs the long.',
    lead: { rank: 8, status: 'wait', entry: 'fade $199–202 / break <$194', stop: '$206', targets: '$189 → $182 → $174', downside: '−6%', tail: '−13%', rr: '~3:1', edge: 'The leader flipped short, still coiling above $194 — after the −4.99% flush NVDA closed $197.01 (+0.25%), a small green day basing in the $194–199 coil, holding above the $194 trigger and below the $199–202 EMA-cluster fade zone; the dip-buy failed (rejected $202–206, closed below the MA stack), Stoch lifted to ~78 near the top of the coil so a push into $199–202 is the cleaner fade (stop $206) or short the break under $194, targeting the 200-day $189 → $182 → $174 — a reclaim of $206 repairs the long' },
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
    price: '$47.77', change: 'close −8.89% $47.77 · AH $48.58 · through T1 $50 · into the $47.5–48.5 cluster',
    signal: 'Roundhill Memory ETF — the memory basket closed through T1 into the cluster. ~75% is three memory names (Micron 25.8%, Samsung ~25%, SK Hynix ~24%, via total-return swaps), so it tracks memory, not the broad KOSPI. DRAM closed $47.77 (−8.89%) — clean through T1 $50 and right INTO the key $47.5–48.5 cluster (61.8% fib + rising 50-day + lower BB), the magnet the card flagged. AH bounce to $48.58 (+1.70%). It lifted off the low near-term (1H RSI 39.01, Stoch ~43 lifting, MACD −1.48), so a reflex bounce toward $52–54 is the cleaner re-short, not a chase of the low. Next below the cluster: $42–44 → 🕳️ washout $38.5–40. Confirmation now in (the cash close settled in the cluster); a close &gt;$61 + retest flips it neutral.',
    edge: 'Korean-memory basket (≈75% Micron/Samsung/SK Hynix via swaps) closed through T1 into the cluster — DRAM closed $47.77 (−8.89%), through T1 $50 into the $47.5–48.5 cluster (61.8% fib + 50-day + lower BB), AH bounce to $48.58; lifting near-term (1H RSI 39.01) so a bounce toward $52–54 is the cleaner re-short, next $42–44 → washout $38.5–40, $61 the regime-change line',
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
    price: '$820.53', change: 'close −8.85% $820.53 · AH $825.60 · deeper break · driving to T1 $800 · ≈ +9% short',
    signal: 'Memory bellwether — the break extended into the close. After the $905 trigger, MU closed $820.53 (−8.85%), now well below both the $886 shelf and the daily 21-mid-BB ($868) — the two levels that had held the chop since June — and driving straight toward T1 $800 (a hair above). That is ≈ +9% for the short from the $905 entry, with clean air below. AH $825.60 (+0.62%) — a shallow bounce, no reclaim. Structure: below the whole MA stack and stretched under the lower Bollinger — a parabola unwinding, with the daily 50-EMA ($714) and 200-EMA far below. The real test is the 50-day $714. Confirmation is now in: a daily close that held under $868; only a reclaim back over $886 would be a fakeout. Stance: leg down live and extending → T1 $800 → daily 50-day $714 → weekly 21-MA $665 → 🕳️ $505; only a close back over $955 / $1,005 ends it. The bellwether that dragged the group up is now leading it down.',
    lead: { rank: 7, status: 'live', entry: '$905 filled', stop: '$1,005', targets: '$800 → $714 → $665 → $505', downside: '−11%', tail: '−44%', rr: '~4:1', edge: 'Memory bellwether — the break extended into the close: MU closed $820.53 (−8.85%), well below the $886 shelf and the daily mid-BB ($868) that held the chop since June, driving toward T1 $800 (≈ +9% for the short from $905, clean air below); AH $825.60 a shallow bounce with no reclaim, below the whole MA stack — a parabola unwinding toward the 50-day $714 → weekly 21-MA $665 → 🕳️ $505, the cash close held under $868, only a reclaim over $886 is a fakeout' },
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
    price: '$1,096.10', change: 'close −14.25% $1,096.10 · AH $1,116 · extending toward 50-week $880 · ≈ +29% short',
    signal: '✓ T1 $1,363 AND T2 $1,287 both banked — and the slide detonated into the close. SNDK closed $1,096.10 (−14.25%), a huge red day (intraday low $1,069.99) pushing deeper toward the only target left, the 50-week $880. That is ≈ +29% for the short from the $1,536 re-arm — the biggest winner on the board. It is extremely oversold (1H RSI 33.13, Stoch 26.63 lifting off the low, MACD −78.02), stretched far below every band, and it AH-bounced to $1,116 (+1.82%) — so a violent reflex bounce is underway; do not chase $1,096. Weekly MACD is still hugely positive → a parabola unwinding, not yet a trend break, so this stays staged: bank into strength and re-load a bounce into $1,181–1,287, not the low. Stance: short deeply in the money, trailing toward $880; only a reclaim of $1,590 ends it.',
    lead: { rank: 9, status: 'live', entry: '$1,536 filled', stop: '$1,590', targets: '$1,287 → $880', downside: '−16%', tail: '−43%', rr: '~4:1', edge: '✓ T1 $1,363 + T2 $1,287 banked — SNDK closed $1,096.10 (−14.25%, low $1,069.99), a huge red day extending toward the only target left, the 50-week $880 (≈ +29% for the short from $1,536, biggest winner on the board); extremely oversold (1H RSI 33.13, Stoch 26.63) with an AH bounce to $1,116 so a violent bounce is underway — bank into strength, re-load a bounce into $1,181–1,287 not the low, only a reclaim of $1,590 ends it' },
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
    price: '$56.55', change: 'close −2.99% · AH +0.55% $56.86 · $56 line HELD · short unconfirmed, coiling $56–61',
    signal: 'The short never got its confirmation — $56 held again. ASTS did press the line the card named: it traded down to ≈ $55 intraday, then closed $56.55 (−2.99%) back ABOVE the $56 must-break level, with after-hours +0.55% to $56.86. That is the second failed attempt at $56, and momentum has turned back up with it: 1H Stoch 64.37 rising, RSI 48.82 (mid-range), MACD −0.34 flattening toward zero, OBV 119M flat — no distribution, just a coil. So the plan is unchanged but still unarmed: the short is technically valid below $61 (upper BB $59.08, 50-EMA ≈ $60.60, 200-EMA $62.09 all overhead) yet it does not fire until a DECISIVE close under $56 — which has now been rejected twice. Stance: no edge in the middle of the $56–61 coil — wait. A close under $56 arms the short toward the lows; a push over $61 stops the idea out and flips the read long toward the 200-EMA $62 and above (B. Riley Buy $85 / Midland the upside catalyst).',
    edge: 'The short never got its confirmation — ASTS pressed the $56 line to ≈$55 intraday but closed $56.55 (−2.99%) back above it, AH +0.55% $56.86: a second failed break, with momentum turning back up (1H Stoch 64.37 rising, RSI 48.82, MACD −0.34 flattening, OBV flat — no distribution); the fade is still valid below $61 (BB $59.08, 50-EMA $60.60, 200-EMA $62.09 overhead) but unarmed until a decisive close under $56 — no edge inside the $56–61 coil, and a push over $61 flips the read long toward $62+',
    side: 'short', accent: 'violet',
    date: '2026-07-28',
    story: 'stories/asts.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$169.69', change: 'close −9.68% $169.69 · AH $168.47 · BROKE the $181 coil low · driving to T1 $160',
    signal: 'Breakdown leader — the $181 coil low broke. After Friday’s −15.02% collapse under $200, NBIS closed $169.69 (−9.68%), a decisive break THROUGH the $181 coil low (intraday low $164.31) — the level whose break opens T1 $160 — now driving toward it. AH $168.47 (−0.72%). That is ≈ +15% for the short from the $200 entry. Price stays capped under every MA and near the lower Bollinger, MACD −6.82 — structure broken, short working. Near-term deeply oversold (1H RSI 35.51, Stoch 27.03), so a reflex bounce is due — a bounce into $181–196 is the cleaner re-short add, not a chase of the low. Confirmation is now in: the $181 coil low broke on the close. Next: T1 $160 → 200-day ≈ $150 → 🕳️ $130. Stance: short live under $200, coil low broken — add on a bounce into $181–196 or trail toward $160; only a 2nd close back over $213 ends it.',
    lead: { rank: 4, status: 'live', entry: '$200 filled', stop: '$213', targets: '$160 → $147 → $130', downside: '−15%', tail: '−31%', rr: '~3:1', edge: 'Breakdown leader, the $181 coil low broke — after Friday’s −15.02% under $200 NBIS closed $169.69 (−9.68%, low $164.31), a decisive break through the $181 coil low toward T1 $160 (≈ +15% for the short from $200); capped under every MA near the lower BB, deeply oversold (RSI 35.51, Stoch 27.03) so a bounce into $181–196 is the cleaner add — next T1 $160 → 200-day ≈ $150 → $130, a 2nd close over $213 ends it' },
    side: 'short', accent: 'indigo',
    date: '2026-07-28',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$476.46', change: 'close −7.82% $476.46 · AH $468.22 · BROKE the $492 low · next ≈ $473 lower BB',
    signal: 'Technical fade — the $492 low broke. AMAT closed $476.46 (−7.82%), a decisive break UNDER the $492 prior low the card flagged — the level whose break opens the next leg — and AH extended to $468.22 (−1.73%), already through the ≈ $473 lower-BB target. Price is under the whole MA stack, MACD firmly negative. It stays a technical fade, not a fundamental short — equipment rides the TSMC buildout and the higher timeframes are only cooling, not broken — so it stays off the ranked board. Near-term it is deeply oversold (1H RSI ~30, Stoch 20.66), so a reflex bounce is due — a bounce into $493–513 (broken shelf / VWAP) is the cleaner re-short, not a chase of the low. Confirmation is now in: the cash close held under $492. The next leg under ≈ $473 opens lower; a reclaim of $513→$530 negates.',
    edge: 'Technical fade, the $492 low broke — AMAT closed $476.46 (−7.82%), a decisive break under the $492 prior low, AH $468.22 already through the ≈ $473 lower-BB target; under the whole MA stack but still a pullback not a fundamental short (equipment rides the TSMC buildout), off the board — deeply oversold (1H Stoch 20.66) so a bounce into $493–513 is the cleaner re-short, the cash close held under $492, a reclaim of $513→$530 negates',
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
