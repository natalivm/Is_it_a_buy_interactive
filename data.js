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
    price: '$202.81', change: '−2.21% · Jul 17 close · AH $202.49',
    signal: 'Inverse H&S rejected at the neckline — a “prove-it” long, not a breakout. NVDA carved a left shoulder $200–203 / head $194–196 / right shoulder $199–202 toward the $211–214 neckline, then Friday gapped down (−2.21% $202.81, AH $202.49) — but the day low $197.97 tagged the $198–200 right-shoulder support and got bought back (long lower wick). The leader still holds above every key MA (daily 200-EMA $189, 50-EMA $204) while memory breaks. Damaged, not invalidated: dip-buy the $198–200 hold, stop under $194 (loss of $194–196 breaks the pattern → $182 next), or wait for a daily close over $214–215 on volume to confirm the breakout toward the $230–234 measured target. No chase — a counter-tape long while SMH stays under $580, so size accordingly.',
    lead: { rank: 12, status: 'wait', entry: '$198–200 hold', stop: '$194', targets: '$214 → $230 → $234', downside: '+8%', tail: '+18%', rr: '~3.5:1', edge: 'The AI leader holding up while the group breaks — an inverse H&S rejected at the $211–214 neckline, but Friday’s low $197.97 bought the $198–200 right shoulder back; dip-buy the $198–200 hold (stop <$194, invalidation $194–196) or wait for a $214–215 breakout on volume, measured target $230–234 only after confirmation' },
    side: 'long', accent: 'emerald',
    date: '2026-07-18',
    story: 'stories/nvda.html',
  },
  {
    symbol: 'COHR', exchange: 'NYSE',
    price: '$285.40', change: '+2.81% · Jul 20 close · pre-mkt $306',
    signal: 'Weekly-structure break — and the pump delivered the fade right at the stop. Closed +2.81% $285.40 just under the zone, and now pre-market it is ripping +7.17% to $305.89 — into the top of the $288–302 zone and right under the $310 stop. This is the cleanest fade on the board: short the $300–310 test against a tight $310 stop, huge room below (1h overbought RSI 72 / Stoch 90; weekly still broken under the 21-week MA $321). Targets 200-day $265 → 50-week $247 → 🕳️ weekly lower BB $215. A push through $310 stops it; a reclaim of $321 fully repairs.',
    lead: { rank: 1, status: 'wait', entry: '$300–310 fade', stop: '$310', targets: '$265 → $247 → $215', downside: '−13%', tail: '−30%', rr: '~5:1', edge: 'Freshest weekly-structure break below the 21-week MA on OBV off record highs — the pump delivered the fade right at the top of the $288–302 zone under a tight $310 stop; short here with huge room to the 200-day $265 → 50-week $247, a push through $310 stops it' },
    side: 'short', accent: 'violet',
    date: '2026-07-21',
    story: 'stories/cohr.html',
  },
  {
    symbol: 'IREN', exchange: 'NASDAQ',
    price: '$41.03', change: '+1.5% · Jul 21 intraday · hi $42.66',
    signal: 'First long on the board — an oversold bounce with a real catalyst. IREN added ≈$2.8B of multiyear AI-cloud contracts and raised its year-end annualized AI-cloud revenue target above $4B (customer prepayments to fund the GPU buildout) — a quality catalyst, not just Bitcoin or short-covering. It ran ~$33.50→$42.66 in two sessions and is now digesting at ~$41: daily Stoch crossed up from oversold, OBV bouncing, but it is a rebound inside a larger correction (daily RSI <50, MACD <0; weekly still under the $47 average and the $49.40 pivot) and the 4h/1h are stretched. Don’t chase ~$41 — it is a breakout-retest, not a fresh entry: buy a hold of $40.10 that reclaims $41.70, or a confirmed hourly close above $42.80. Targets $44–45 (daily MA/supply) → $47 → 🎯 $49.40. An hourly close below $40.10 resets it to $39/$38.90; below $36 the spike failed.',
    lead: { rank: 10, status: 'wait', entry: '$40 hold / >$42.80', stop: '$38.90', targets: '$44 → $47 → $49.40', downside: '+9%', tail: '+22%', rr: '~3:1', edge: 'First long on the board — $2.8B of new AI-cloud contracts (year-end AI revenue target raised >$4B) turned the oversold bounce off the 200-day into a catalyst-backed recovery; don’t chase the stretched retest — buy a $40.10 hold reclaiming $41.70 or a breakout >$42.80, the $49.40 pivot the prize, below $36 it failed' },
    side: 'long', accent: 'emerald',
    date: '2026-07-21',
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
    price: '$52.16', change: '−9.13% · Jul 16',
    signal: 'Roundhill Memory ETF — ~75% is three memory names (Micron 25.8%, Samsung ~25%, SK Hynix ~24%, partly via total-return swaps), so it’s driven by Korean *memory* stocks (Samsung/SK Hynix), not the broad KOSPI. A feedback loop: US memory weakens → Samsung/Hynix fall overnight → DRAM gaps down at the US open → weakness feeds back into MU/SNDK/WDC/STX. Full momentum breakdown: −35.5% from $80.90, below every MA on falling OBV. Deeply oversold (4h Stoch 7) so a violent 8–12% bounce is likely — but it’s a lower high, not a bottom. Fade $55.5–58 (50–61% fib + broken stack), stop $61.5; targets $50 → key cluster $47.5–48.5 (61.8% fib + rising 50-day + lower BB $46.5) → $42–44. 🕳️ Washout $38.5–40. A close &gt;$61 + retest flips it neutral.',
    edge: 'Korean-memory basket (≈75% in Micron/Samsung/SK Hynix via swaps) in a full momentum breakdown, −35.5% off the high; oversold bounce likely but no bottom yet — fade the lower high into $55.5–58, the $47.5–48.5 fib/50-day cluster is the magnet, $61 is the regime-change line',
    side: 'short', accent: 'indigo',
    date: '2026-07-16',
    story: 'stories/dram.html',
  },
  {
    symbol: 'AAOI', exchange: 'NASDAQ',
    price: '$103.02', change: '+0.60% · Jul 20 close · pre-mkt $109',
    signal: 'Held the 200-day and coiled — closed +0.60% $103.02 on the daily 200-day EMA $102, and now the reflex bounce is here: pre-market it is popping +5.90% to $109.10, straight INTO the $104–113 fade zone. This is the fade trigger — the bounce we wanted to sell. Deeply oversold (daily Stoch 7) fuels the pop, but the engine points down and the $104–113 stack is exactly where price is now. Fade the bounce into $104–113 (1h mid-BB $104 / 50-EMA $110), stop $120; targets $90 → $82 → 🕳️ weekly 21-MA $58. A loss of $100 opens $90. Reclaim $120 negates.',
    lead: { rank: 6, status: 'wait', entry: '$104–113 bounce', stop: '$120', targets: '$90 → $82 → $58', downside: '−12%', tail: '−43%', rr: '~3.5:1', edge: 'Heaviest OBV collapse in the group — held the 200-day $102, and the reflex bounce is now popping pre-market +5.90% to $109 straight into the $104–113 fade zone (the trigger); fade it, a loss of $100 opens $90, weekly 21-MA $58 the deep bottom' },
    side: 'short', accent: 'violet',
    date: '2026-07-21',
    story: 'stories/aaoi.html',
  },
  {
    symbol: 'WDC', exchange: 'NASDAQ',
    price: '$546.49', change: '+12.12% · Jul 21 intraday',
    signal: 'Short negated — the sector pump reclaimed the stop. WDC ripped +12.12% intraday to $546.49, clean through the $486–513 fade zone AND the $535 stop, so the pullback-short is off (a reclaim of $535 neutralizes, exactly as flagged). It was always the healthiest name — a pullback inside a big uptrend, still far above the 200-day $345 — and this move puts it back near the highs, above the daily upper BB. 1h overbought (Stoch 93) so a pause/backfill is likely, but the bearish thesis is done above $535. No short here: a fresh setup needs a failure back below $513, otherwise it is simply back in trend.',
    edge: 'Short negated — the +12.12% sector pump reclaimed the $535 stop and blew back through the $486–513 fade zone; the healthiest name (pullback in a big uptrend above the 200-day $345) is back near its highs — no short here, needs a fresh failure below $513 to re-arm',
    side: 'short',
    date: '2026-07-21',
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$97.06', change: '+2.13% · Jul 20 close · pre-mkt $103',
    signal: 'Worst OBV in the group — closed +2.13% $97.06, and now the sector risk-on pump has it ripping pre-market +6.09% to $102.97, into the bottom of the $98–111 fade zone. It is extended, not breaking out: overbought on the 1h (RSI 71) and gapping straight into overhead supply — the declining daily 9/50-EMA $108–110 sits right above — while the daily stays deeply oversold (Stoch 9, RSI 37), so the pop can poke higher but has no real breakout energy (worst OBV in the group, daily MACD still negative). Fade the pump into $98–111 (1h 50-EMA / broken daily lower BB), stop $118; targets $92 → weekly 21-MA $89 → 🕳️ 200-EMA $73. A close under $89 opens the air pocket to the unfilled $66 gap. Reclaim $118 negates — and would be the first real sign of energy.',
    edge: 'Worst OBV in the group — the sector pump has it +6.09% pre-market to $103 into the $98–111 fade zone, extended on the 1h into overhead supply with no breakout energy (negative daily MACD); fade the pump, a close under the $89 gate opens the air pocket to the $66 gap',
    side: 'short', accent: 'blue',
    date: '2026-07-21',
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$865.46', change: '+1.94% · Jul 20 close · pre-mkt $918',
    signal: 'Memory bellwether — and the sector pump has overrun the re-short zone. After Friday spiked to $903.93 and got sold ($849 close), MU followed through +1.94% $865.46, and now pre-market it is ripping +6.09% to $918.14 — up THROUGH the $880–905 re-short zone and past the $903.93 rejection high. Short-term overbought (1h Stoch 95) but the daily still has room (Stoch 19); the short is alive below the $955 stop / $1,005 negate, but the clean entry is gone. Don’t chase: re-short only on a failure back below $905, or fade a tag of $918–955 into the stop. Targets $800 → weekly 21-MA $665 → 🕳️ 50-week $505, live while SMH stays under $580. Reclaim $1,005 negates.',
    lead: { rank: 7, status: 'wait', entry: '$905 fail-back', stop: '$955', targets: '$800 → $665 → $505', downside: '−12%', tail: '−44%', rr: '~4:1', edge: 'Memory bellwether — the sector pump ran it +6.09% pre-market to $918, up through the $880–905 re-short zone (clean entry overrun) toward the $955 stop; still alive below $955/$1,005 but don’t chase — re-short a failure back below $905, weekly 21-MA $665 the magnet' },
    side: 'short', accent: 'cyan',
    date: '2026-07-21',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$333.76', change: '+3.54% · Jul 20 close · pre-mkt $355',
    signal: 'Shelf-break — and the pump delivered the fade at the stop. Closed +3.54% $333.76 up into the zone, and now pre-market it is ripping +6.36% to $355.00 — into the top of the $332–356 fade zone, right under the $358 stop / 1h 200-EMA $357. Tight fade here against $358, huge room below: 1h overbought (RSI 72, Stoch 95). Targets $308 → $292 → 🕳️ daily 200-EMA $280. A push through $358 stops it; a reclaim of $390 fully repairs.',
    lead: { rank: 2, status: 'wait', entry: '$346–358 fade', stop: '$358', targets: '$308 → $292 → $280', downside: '−13%', tail: '−21%', rr: '~4:1', edge: 'Clean shelf-break below the daily lower BB — the pump delivered the fade right to the top of the $332–356 zone under a tight $358 stop; short here with room to the 200-EMA $280, a push through $358 stops it' },
    side: 'short', accent: 'blue',
    date: '2026-07-21',
    story: 'stories/ter.html',
  },
  {
    symbol: 'GLW', exchange: 'NYSE',
    price: '$154.61', change: '−2.39% · Jul 17 close · AH $154.00',
    signal: 'Break-and-retest still working — closed −2.39% $154.61 (AH $154.00), grinding toward T1 $151 after blowing through $180 and $167; OBV at a new low. Deeply oversold (daily Stoch 7, 1h RSI 40). The $165–175 zone is overhead — fade a bounce there (broken 1h stack / prior $167 support), stop $184; targets $151 → daily lower BB $144 → 🕳️ $130. Reclaim $184 negates.',
    lead: { rank: 3, status: 'wait', entry: '$165–175 bounce', stop: '$184', targets: '$151 → $144 → $130', downside: '−7%', tail: '−16%', rr: '~3:1', edge: 'Break-and-retest working — blew through $180/$167 on an OBV collapse, now grinding to T1 $151, deeply oversold; fade the bounce into the broken $165–175 stack, the daily lower BB $144 the magnet' },
    side: 'short', accent: 'blue',
    date: '2026-07-16',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,390.95', change: '+2.67% · Jul 20 close · pre-mkt $1,509',
    signal: '✓ Booked ≈ +15% earlier and T1 $1,363 done — now the sector pump is delivering the next fade: after Friday tagged $1,501 and got sold ($1,355 close), SNDK closed +2.67% $1,390.95 and is gapping pre-market +8.49% to $1,509 — straight INTO the $1,470–1,536 re-short zone. This is the trigger. The 15m/1h are already overbought (Stoch 92 / RSI 80) so it is extended into the zone, not breaking out. Re-short into $1,470–1,536, stop $1,590; next targets weekly 21-MA $1,287 → 🕳️ 50-week $880. With SMH under $580, the deep unwind is live. Reclaim $1,590 ends the bias.',
    lead: { rank: 9, status: 'wait', entry: '$1,470–1,536 bounce', stop: '$1,590', targets: '$1,287 → $880', downside: '−5%', tail: '−35%', rr: '~4:1', edge: '✓ Booked ≈ +15%, T1 $1,363 done; the sector pump has it gapping +8.49% pre-market to $1,509, straight into the $1,470–1,536 re-short zone (the fade trigger) — extended, not breaking out; re-short it, weekly 21-MA $1,287 the magnet, 50-week $880 the deep unwind while SMH under $580' },
    side: 'short', accent: 'red',
    date: '2026-07-21',
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$584.32', change: '+4.56% · Jul 21 close · ABOVE $580',
    signal: 'The board’s barometer — closed back above the line, but neither side is clean. SMH closed +4.56% $584.32, reclaiming the $580 line / 50-EMA for the first time since the break. But it was a NARROW move — AI/semis short-covering (Micron ≈ +12.7%) riding alongside an inflation-geopolitical hedge bid — not a market-wide risk-on all-clear. So this is no-man’s-land: no longer a clean short (it closed above $580), but not a long either (the rally is narrow, unconfirmed, and $594–600 daily-200-EMA is right overhead). Stance: HOLD the existing shorts, but don’t add and don’t chase long — stand aside for follow-through. A second close holding >$580 with breadth takes the shorts off; a fade back under $580 puts every fade back on.',
    edge: 'The board’s barometer closed back above $580 ($584.32, +4.56%) — but on a narrow AI/semis short-covering pump (Micron ≈ +12.7%), not a clean risk-on all-clear; no-man’s-land — hold the shorts, don’t add, don’t chase long, wait for follow-through',
    side: 'short', accent: 'red',
    date: '2026-07-21',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$802.45', change: '+1.88% · Jul 20 close · overnight $839',
    signal: 'Strongest name — and now testing the thesis. Closed green +1.88% $802.45, pushing up THROUGH the $770–790 fade zone and past the $789–798 entry (the short never triggered — price ran up, not down). Overnight it is ripping to $839, poking above the $822 stop and into the $822–835 “reclaim takes the short off” line. The short is on the ropes: don’t chase into this strength. Re-short ONLY on a failure back below $790 (loss of the zone); a daily hold above $835 negates it outright. If it rolls back over: targets $720 (61.8% fib) → weekly 21-MA $681 → 🕳️ 50-week $516, live while SMH stays under $580.',
    edge: 'Strongest name — broke UP through the $770–790 fade zone (close +1.88% $802.45, overnight $839), poking the $822–835 “short-off” line; off the ranked board while it leads higher — re-short only on a failure back below $790, a daily hold above $835 negates',
    side: 'short', accent: 'amber',
    date: '2026-07-21',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$62.74', change: '+9.27% · Jul 21 intraday',
    signal: 'Strong oversold rebound, not yet a confirmed uptrend — and more near-term energy than IREN. Popped +9.27% intraday to $62.74, breaking out of the $57–60 base on real OBV buying, with fundamental support (B. Riley upgraded to Buy, $85 target; Midland manufacturing-expansion approved) — though it is still digesting a $1B convertible-note financing (dilution / convert-arb overhang) and deployment concerns. Structurally still damaged: below all daily MAs, daily MACD negative, the $77–78 wall overhead. Likely another leg toward $66–70, so don’t chase $62–64 — fade the resistance tests at $64.50–67 (upper BB / pivot / 1h 200-EMA) then $70–71 (breakdown supply); a close above $77–78 repairs the trend and takes the short off. Bear targets if resistance holds: $57 base → $51 → 🕳️ 200-week $41. Bullish tell: hold $61.50 and break/close $65–67. Size small (dilution risk).',
    edge: 'Strong oversold rebound with real support (B. Riley Buy $85, Midland expansion) but a $1B convert-dilution overhang — likely another leg to $66–70, so don’t chase $62–64; fade the $65–67 / $70–71 resistance, a close over the $77–78 wall repairs the trend, the $57 base then 200-week $41 the downside',
    side: 'short', accent: 'violet',
    date: '2026-07-21',
    story: 'stories/asts.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$182.62', change: '+2.76% · Jul 20 close · pre-mkt $196',
    signal: 'Breakdown leader — and the sector pump has carried it into the fade zone. After the −13.90% flush paid T1 $190 / T2 $177, NBIS closed +2.76% $182.62 and now pre-market it is ripping +7.49% to $196.30 — INTO the $185–200 fade zone. This is the trigger. Extended short-term (15m Stoch 96) but the daily still has room (Stoch 13), and the $213 stop is untouched. Fade the pump into $185–200 (broken daily lower BB / round $200), stop $213; targets $160 → 200-day $147 → 🕳️ $130. Reclaim $213 neutralizes.',
    lead: { rank: 4, status: 'wait', entry: '$185–200 bounce', stop: '$213', targets: '$160 → $147 → $130', downside: '−10%', tail: '−27%', rr: '~3:1', edge: 'Breakdown leader — the −13.9% flush paid T1/T2, and the sector pump has run it +7.49% pre-market to $196 into the $185–200 fade zone (the trigger); stop $213 untouched, fade the pump, the 200-day $147 the magnet' },
    side: 'short', accent: 'indigo',
    date: '2026-07-21',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$529.66', change: '−5.57% · Jul 17 close · AH $522.24',
    signal: 'Technical fade paid in full — closed −5.57% $529.66 (AH $522.24), slicing through T1 $559, T2 $544 and T3 $526 in one move. Now oversold (daily Stoch 22, RSI 44; 1h RSI 33). The $575–590 fade zone is far overhead, nearer resistance $554. The next leg ($510 and below) comes only on a bounce — re-short into $554 → $575–590, stop $605. Equipment benefits from the TSMC buildout, so this is a technical fade, kept off the board. Reclaim $605 negates.',
    edge: 'Technical fade, not a fundamental short (equipment rides the TSMC buildout) — sliced through T1–T3 to $530 in one -5.57% move; book the targets, re-short a bounce into $554–590 for the next leg to $510',
    side: 'short', accent: 'red',
    date: '2026-07-15',
    story: 'stories/amat.html',
  },
  {
    symbol: 'BE', exchange: 'NYSE',
    price: '$197.06', change: '−8.33% · Jul 20 close · pre-mkt $207',
    signal: 'Downtrend leader — flushed through $200, now bouncing back with the sector. After the earlier −13.93% leg (T1 $226 / T2 $211 done), BE dropped another −8.33% Jul 20 to close $197.06, slicing through $200 toward the daily 200-EMA $185. Now pre-market it is bouncing +5.08% to $207.30 on the sector risk-on — climbing from below back toward the $219–234 re-short zone but not in it yet. Deeply oversold (daily Stoch 9) fuels the bounce, the engine still down. Fade the approach into $219–234 (1h mid-BB $228 / 50-EMA $234), stop $250; targets $200 → daily 200-EMA $185 → 🕳️ 50-week $170. Reclaim $250 negates.',
    lead: { rank: 5, status: 'wait', entry: '$219–234 bounce', stop: '$250', targets: '$200 → $185 → $170', downside: '−7%', tail: '−21%', rr: '~3:1', edge: 'Downtrend leader — the −8.33% flush drove it through $200 toward the 200-EMA $185, now bouncing +5.08% pre-market to $207 back up toward the $219–234 fade zone; fade the approach, the 200-EMA $185 then 50-week $170 the targets' },
    side: 'short', accent: 'amber',
    date: '2026-07-21',
    story: 'stories/be.html',
  },
  {
    symbol: 'ALAB', exchange: 'NASDAQ',
    price: '$303.62', change: '−5.04% · Jul 17 close · AH $304',
    signal: 'Dip-buy dead (SMH under $580) and the leader keeps sliding — Friday the low $289.60 undercut T1 $300 before closing back at $303.62 (−5.04%, AH flat $303.61) on a long lower wick, under the daily lower BB $314. Daily Stoch 6 — deeply oversold, so a reflex bounce is likely; fade it into $325–350 (broken 50-day $337 / 1h 50-EMA $358), stop $362; targets $280 → 🕳️ $250 base. Reclaim $362 repairs the long case.',
    lead: { rank: 14, status: 'wait', entry: '$325–350 bounce', stop: '$362', targets: '$300 → $280 → $250', downside: '−8%', tail: '−18%', rr: '~3:1', edge: 'Dip-buy dead and the SMH gate void — the leader’s low $289.60 undercut T1 $300, deeply oversold (daily Stoch 6); fade the reflex bounce into $325–350, the $250 May base the deep magnet' },
    side: 'short', accent: 'emerald',
    date: '2026-07-16',
    story: 'stories/alab.html',
  },
  {
    symbol: 'CRDO', exchange: 'NASDAQ',
    price: '$202.68', change: '−2.54% · Jul 17 close · AH $201',
    signal: 'Dip-buy long dead (SMH under $580) and no bounce came — CRDO just bled down the lower band: closed −2.54% $202.68 (AH $201.29), under the daily lower BB $204, right on top of T1 $200. Still a downtrend, RSI daily 39 / 1h 44 — not sharply oversold, engine down. Fade any bounce into $212 (1h 50-EMA) → $219–230 (broken $219 low / 50-day $227), stop $242; targets $190 → 🕳️ $175 breakout shelf. Reclaim $245 (200-EMA) repairs the long case.',
    lead: { rank: 13, status: 'wait', entry: '$212–230 bounce', stop: '$242', targets: '$200 → $190 → $175', downside: '−6%', tail: '−14%', rr: '~2.5:1', edge: 'Dip-buy dead and the SMH gate void — no bounce, bled down the band to T1 $200; fade a bounce into $212–230, targets down to the $175 breakout shelf' },
    side: 'short', accent: 'cyan',
    date: '2026-07-16',
    story: 'stories/crdo.html',
  },
  {
    symbol: 'DELL', exchange: 'NYSE',
    price: '$396.34', change: '+1.27% · Jul 17 close · AH $396',
    signal: 'Bull-flag long still off (SMH under $580) but DELL is basing and grinding back: closed +1.27% $396.34 (AH flat $396.49), creeping up from below toward the $402–421 fade zone but not in it yet. The daily isn’t oversold (RSI 48) and momentum is limp — this is an approach to the re-short, not a dip-buy. Fade into $402–421 (1h stack $411 / daily mid-BB $421), stop $432; targets $377 (weekly 9-EMA) → $365 (daily lower BB) → 🕳️ $330 gap-fill. A close < $377 opens the air pocket. Reclaim $432 repairs the bull case.',
    lead: { rank: 15, status: 'wait', entry: '$402–421 zone', stop: '$432', targets: '$377 → $365 → $330', downside: '−7%', tail: '−16%', rr: '~2.5:1', edge: 'Bull-flag long off while SMH stays under $580 — basing +1.27% and grinding up toward the $402–421 fade zone from below; fade the approach, a close < $377 opens the air pocket to the $330 gap-fill' },
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
