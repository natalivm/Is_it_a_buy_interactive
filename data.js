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
    price: '$205.48', change: '−0.87% pre-mkt · $207.29 Jul 21 close',
    signal: 'The dip-buy is holding, but the follow-through is stalling with the group. Friday’s low $197.97 tagged the $198–200 right shoulder and got bought; Tuesday followed +1.97% to close $207.29 back over the 50-EMA. Wednesday pre-market it gives a little back — −0.87% to $205.48, sitting right on the 50-EMA ($205.06) and still under the $211–214 neckline, exactly as SMH’s $580 reclaim fails pre-market. The inverse H&S is intact but unconfirmed and momentum never turned impulsive: daily RSI 48.6 (slipped back under 50) and MACD ≈ −0.47 (flat/negative). The dip-buy off $198–200 stays live while $205/50-EMA holds (stop under $194 — a loss of $194–196 breaks the pattern → $182), but the trade only pays after a daily close over $214–215 on volume opens the $230–234 measured target. No chase — let it hold the 50-EMA and prove the breakout; a lose of $205→$200 with the group re-arming puts it back to the shoulder.',
    lead: { rank: 12, status: 'wait', entry: '$198–200 filled', stop: '$194', targets: '$214 → $230 → $234', downside: '+8%', tail: '+18%', rr: '~3.5:1', edge: 'The AI leader that held while the group broke — the $198–200 shoulder was bought and Tuesday closed $207.29 over the 50-EMA, but Wednesday pre-market fades −0.87% to $205.48 back onto the 50-EMA as SMH’s $580 reclaim fails; still under the $211–214 neckline with RSI 48.6 / MACD flat — dip-buy live while $205 holds, measured $230–234 only on a close over $214–215' },
    side: 'long', accent: 'emerald',
    date: '2026-07-22',
    story: 'stories/nvda.html',
  },
  {
    symbol: 'COHR', exchange: 'NYSE',
    price: '$317.22', change: '+11.15% · Jul 21 close · AH $318',
    signal: 'Weekly-structure break — the pump overshot the tight stop, held per plan. COHR closed +11.15% $317.22 (AH $317.95) — through the $288–302 zone and the $310 stop, but still under the $321 21-week MA (the full-repair line). On a normal day the $310 break stops the short out; but this was a narrow AI/semis short-covering pump with SMH’s $580 reclaim unconfirmed on breadth — so per plan we HOLD, don’t cancel into one session, reassess tomorrow. A close above $321 confirms the weekly break repaired (short done); a fade back under $310 re-arms it toward the 200-day $265 → 50-week $247 → 🕳️ $215.',
    lead: { rank: 1, status: 'wait', entry: '$310 re-arm', stop: '$310 (overshot)', targets: '$265 → $247 → $215', downside: '−13%', tail: '−30%', rr: '~5:1', edge: 'Weekly-structure break — the +11.15% pump closed $317.22 through the $310 stop but under the $321 repair line; overshot on a narrow session so held per plan, not canceled — a close over $321 confirms it repaired, a fade back under $310 re-arms toward the 200-day $265' },
    side: 'short', accent: 'violet',
    date: '2026-07-21',
    story: 'stories/cohr.html',
  },
  {
    symbol: 'IREN', exchange: 'NASDAQ',
    price: '$40.07', change: '−2.95% pre-mkt · $41.29 Jul 21 close',
    signal: 'First long on the board — the bounce is digesting, catalyst intact but the fade is testing the retest. IREN closed +2.71% $41.29 Tuesday, poking back above the 50-EMA ($40.93); Wednesday pre-market gives it back — −2.95% to $40.07, right on the 50-EMA and the $40.10 breakout-retest support, exactly as the whole AI/semis group rolls back (SMH failing its $580 reclaim). Still under the $41.70 reclaim / $42.80 breakout gate — the $39–43 pause the setup called for, no trigger yet. Momentum is turning, not turned: Stochastics curling up off the low (~60/42) but daily MACD still negative (≈ −4.17), RSI ~43. The ≈$2.8B AI-cloud contracts (year-end AI revenue target raised >$4B) are unchanged and the stop $38.90 is untouched — thesis intact, just not triggered. Still wait, don’t chase: buy a $40.10 hold that reclaims $41.70, or a confirmed close above $42.80. Targets $44–45 → $47 → 🎯 $49.40. A close below $40.10 resets it to $39/$38.90; below $36 the spike failed.',
    lead: { rank: 10, status: 'wait', entry: '$40 hold / >$42.80', stop: '$38.90', targets: '$44 → $47 → $49.40', downside: '+9%', tail: '+22%', rr: '~3:1', edge: 'First long on the board — $2.8B of new AI-cloud contracts (year-end AI revenue target raised >$4B) turned the oversold bounce off the 200-day into a catalyst-backed recovery; Tuesday closed $41.29 over the 50-EMA but pre-market fades −2.95% to $40.07 back onto it with the group — don’t chase the retest, buy a $40.10 hold reclaiming $41.70 or a breakout >$42.80, the $49.40 pivot the prize, below $36 it failed' },
    side: 'long', accent: 'emerald',
    date: '2026-07-22',
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
    price: '$119.26', change: '+15.76% · Jul 21 close · AH $120.10',
    signal: 'Heaviest OBV collapse in the group — but the pump ran to the stop. AAOI ripped +15.76% Jul 21 to close $119.26 (AH $120.10) — through the $104–113 fade zone up to the $120 stop, closing just under it, after-hours just above. On a normal day $120 ends the short; but this was a narrow AI/semis short-covering pump with SMH’s $580 reclaim unconfirmed on breadth — so per plan we HOLD, don’t cancel into one session, reassess tomorrow. A second day holding above $120 confirms the short is done; a fade back under $113 re-arms it toward $90 → $82 → 🕳️ weekly 21-MA $58.',
    lead: { rank: 6, status: 'wait', entry: '$113 re-arm', stop: '$120 (at it)', targets: '$90 → $82 → $58', downside: '−12%', tail: '−43%', rr: '~3.5:1', edge: 'Heaviest OBV collapse in the group — the +15.76% pump ran to the $120 stop (closed just under, AH above); overshot on a narrow session so held per plan, not canceled — a 2nd day over $120 confirms it done, a fade back under $113 re-arms toward the $58 bottom' },
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
    price: '$970.82', change: '+12.17% · Jul 21 close · AH $974',
    signal: 'Memory bellwether — the pump overshot the stop, held per plan. MU ripped +12.17% Jul 21 to close $970.82 (AH $974.30) — through the $880–905 re-short zone AND the $955 stop, though still under the $1,005 full-negate. On a normal day the $955 break stops the short out; but this was a narrow AI/semis short-covering pump (MU the poster child, ≈ +12%) with SMH’s $580 reclaim unconfirmed on breadth — so per plan we HOLD, don’t cancel into one session, and reassess tomorrow. A second day holding above $955 (or a close over $1,005) confirms the short is done; a fade back under $905 re-arms it toward $800 → weekly 21-MA $665 → 🕳️ $505.',
    lead: { rank: 7, status: 'wait', entry: '$905 re-arm', stop: '$955 (overshot)', targets: '$800 → $665 → $505', downside: '−12%', tail: '−44%', rr: '~4:1', edge: 'Memory bellwether — the +12.17% pump closed $970.82, through the $955 stop but under the $1,005 negate; stop overshot on a narrow short-covering session so held per plan, not canceled — a 2nd day over $955 confirms it done, a fade back under $905 re-arms toward $665' },
    side: 'short', accent: 'cyan',
    date: '2026-07-21',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$374.04', change: '+12.07% · Jul 21 close · AH $375',
    signal: 'Shelf-break — the pump overshot the stop, held per plan. TER ripped +12.07% Jul 21 to close $374.04 (AH $375) — through the $332–356 zone AND the $358 stop, though still under the $390 full-repair line. On a normal day the $358 break stops the short out; but this was a narrow AI/semis short-covering pump with SMH’s $580 reclaim unconfirmed on breadth — so per plan we HOLD, don’t cancel into one session, reassess tomorrow. A second day holding above $358 (or a reclaim of $390) confirms the short is done; a fade back under $346 re-arms it toward $308 → $292 → 🕳️ 200-EMA $280.',
    lead: { rank: 2, status: 'wait', entry: '$346 re-arm', stop: '$358 (overshot)', targets: '$308 → $292 → $280', downside: '−13%', tail: '−21%', rr: '~4:1', edge: 'Clean shelf-break — the +12.07% pump closed $374.04 through the $358 stop but under the $390 repair; overshot on a narrow session so held per plan, not canceled — a 2nd day over $358 confirms it done, a fade back under $346 re-arms toward the 200-EMA $280' },
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
    price: '$1,589.40', change: '+14.27% · Jul 21 close · AH $1,615',
    signal: '✓ Booked ≈ +15% earlier and T1 $1,363 done — but the pump ran to the stop. SNDK ripped +14.27% Jul 21 to close $1,589.40 (AH $1,594), straight through the $1,470–1,536 re-short zone up to the $1,590 stop — closing right at it, after-hours just above. On a normal day $1,590 ends the bias; but this was a narrow AI/semis short-covering session with SMH’s $580 reclaim unconfirmed on breadth — so per plan we HOLD, don’t cancel into one session, reassess tomorrow. A second day holding above $1,590 confirms the short is done; a fade back under $1,536 re-arms it toward weekly 21-MA $1,287 → 🕳️ 50-week $880.',
    lead: { rank: 9, status: 'wait', entry: '$1,536 re-arm', stop: '$1,590 (at it)', targets: '$1,287 → $880', downside: '−5%', tail: '−35%', rr: '~4:1', edge: '✓ Booked ≈ +15%; the +14.27% pump ran through the zone to the $1,590 stop (closed right at it, AH above) — overshot on a narrow session so held per plan, not canceled; a 2nd day over $1,590 confirms it done, a fade back under $1,536 re-arms toward $1,287' },
    side: 'short', accent: 'red',
    date: '2026-07-21',
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$572.00', change: '−2.07% pre-mkt · $584.08 Jul 21 close · BACK UNDER $580',
    signal: 'The board’s barometer — the one-day reclaim is already failing. SMH closed +4.52% $584.08 Tuesday, tagging back above the $580 line / 50-EMA on a narrow AI/semis short-covering pump (Micron ≈ +12.7%) — never a clean risk-on all-clear. Wednesday pre-market it’s rolling right back: −2.07% to $572, giving up $580 without ever getting a second close to confirm it. That’s the tell the fade was watching for — the reclaim needed follow-through and didn’t get it. Daily MACD is still negative (≈ −3.35) and rolling, Stochastics only curling off the low (≈ 24) — momentum never flipped bullish. Stance: the $580 loss RE-ARMS the board — the short fades are back on as SMH loses the line; a long is still not the trade (no confirmed reclaim, $594–600 daily-200-EMA caps overhead). Watch the cash open — hold under $580 confirms the fade, a reclaim of $584 puts it back in no-man’s-land.',
    edge: 'The board’s barometer — Tuesday’s $584.08 reclaim of $580 is failing pre-market (−2.07% to $572, back under the line) with MACD still negative and no confirming second close; the $580 loss re-arms the short fades across the board — not a long here either, just the tape rolling back over',
    side: 'short', accent: 'red',
    date: '2026-07-22',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$891.83', change: '+11.14% · Jul 21 close · AH $894',
    signal: 'Strongest name — thesis over, it led the pump. After clearing the $835 “short-off” line, STX ripped another +11.14% Jul 21 to close $891.83 (AH $894) — far above the whole $770–835 short structure. This was the tell all along: the healthiest name (it never broke down, the short never even triggered) led the sector risk-on higher. The short is off and stays off — no re-short here; it would take a fresh failure from much higher to re-arm. Off the ranked board since it reclaimed $835; back in its uptrend now.',
    edge: 'Strongest name — thesis over: after clearing $835 it ran another +11.14% to close $891.83, leading the sector pump higher; the short never triggered and stays off — back in its uptrend, off the ranked board',
    side: 'short', accent: 'amber',
    date: '2026-07-21',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$62.74', change: '+9.27% · Jul 21 · AH strong',
    signal: 'Flipped to LONG — strong oversold rebound with a real catalyst. ASTS broke the $57–60 base on genuine OBV buying (+9.27% to ~$62.74), backed by B. Riley’s upgrade to Buy ($85 target) and the Midland manufacturing-expansion approval — offset by a $1B convertible-note dilution overhang. It is a rebound, not yet a confirmed uptrend (still under the $77–78 wall), so don’t chase $62–64: buy a hold of $61.50 or a pullback that holds $59–60, and add on a breakout/close above $65–67. Targets $65–67 → $70–71 → 🎯 $77–78 (clearing it reasserts the larger uptrend). Stop below $57 (a failed rebound); a loss of $59 delays it. Size small — the convert is a real dilution risk.',
    edge: 'Flipped to long — strong rebound off the $57–60 base with real support (B. Riley Buy $85, Midland expansion); don’t chase $62–64 — buy a $61.50 hold or a $59–60 pullback, add on a break >$65–67, targets $70–71 → $77–78, below $57 the rebound failed (size small, convert dilution)',
    side: 'long', accent: 'violet',
    date: '2026-07-21',
    story: 'stories/asts.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$216.92', change: '+18.78% · Jul 21 close · AH $218.50',
    signal: 'Breakdown leader — the pump overshot the stop, held per plan. NBIS ripped +18.78% Jul 21 to close $216.92 (AH $218.50) — clean through the $185–200 fade zone AND the $213 stop (a reclaim of $213 neutralizes, exactly as flagged). On a normal day the $213 break stops the short out; but this was a narrow AI/semis short-covering pump with SMH’s $580 reclaim unconfirmed on breadth — so per plan we HOLD, don’t cancel into one session, and reassess tomorrow. A second day holding above $213 confirms the short is done; a fade back under $200 re-arms it toward $160 → 200-day $147 → 🕳️ $130.',
    lead: { rank: 4, status: 'wait', entry: '$200 re-arm', stop: '$213 (overshot)', targets: '$160 → $147 → $130', downside: '−10%', tail: '−27%', rr: '~3:1', edge: 'Breakdown leader — the +18.78% pump closed $216.92 through the $213 stop; overshot on a narrow short-covering session so held per plan, not canceled — a 2nd day over $213 confirms it done, a fade back under $200 re-arms toward the 200-day $147' },
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
    price: '$216.30', change: '−4.53% pre-mkt · $226.26 Jul 21 close',
    signal: 'Downtrend leader — the pump ran into the fade zone and is already reversing. BE ripped +14.82% Jul 21 to close $226.26 (AH $228) straight INTO the $219–234 re-short zone — and Wednesday pre-market it rolls the hardest of the group, −4.53% to $216.30, back UNDER the zone as SMH’s $580 reclaim fails (→$572). That is the fade working: the stretched squeeze (4h Stoch was 93) tagged the trigger and turned. Structurally still a downtrend under the 200-EMA $259, MACD deeply negative (≈ −12.57), RSI ~42; stop $250 untouched. The fade is live — a rejection of $219–234 that loses $216/$213 opens $200 → daily 200-EMA $185 → 🕳️ 50-week $170. A reclaim back over $234→$250 negates it.',
    lead: { rank: 5, status: 'wait', entry: '$219–234 zone', stop: '$250', targets: '$200 → $185 → $170', downside: '−11%', tail: '−25%', rr: '~3:1', edge: 'Downtrend leader — the +14.82% pump ran it into the $219–234 re-short zone then reversed: pre-market rolls the hardest of the group −4.53% to $216.30 back under the zone as SMH’s $580 reclaim fails; the fade is working, stop $250, targets the 200-EMA $185 then 50-week $170' },
    side: 'short', accent: 'amber',
    date: '2026-07-22',
    story: 'stories/be.html',
  },
  {
    symbol: 'ALAB', exchange: 'NASDAQ',
    price: '$319.79', change: '+3.46% · Jul 21 close · AH $320',
    signal: 'Dip-buy dead (SMH reclaim narrow) — the leader is bouncing toward the zone but not in it. ALAB closed +3.46% $319.79 (AH $320), climbing back up but still UNDER the $325–350 re-short zone — the mildest bounce of the group (4h Stoch 80, approaching not overbought). Stop $362 untouched, well clear. With SMH’s $580 reclaim narrow/short-covering, hold/watch: fade the approach into $325–350 (broken 50-day $337 / 1h 50-EMA $358), stop $362; targets $300 → $280 → 🕳️ $250 base. Reclaim $362 repairs the long case.',
    lead: { rank: 14, status: 'wait', entry: '$325–350 bounce', stop: '$362', targets: '$300 → $280 → $250', downside: '−8%', tail: '−18%', rr: '~3:1', edge: 'Dip-buy dead, SMH reclaim narrow — bounced +3.46% to $319.79 but still under the $325–350 fade zone (didn’t overshoot); fade the approach, stop $362 clear, the $250 May base the deep magnet' },
    side: 'short', accent: 'emerald',
    date: '2026-07-16',
    story: 'stories/alab.html',
  },
  {
    symbol: 'CRDO', exchange: 'NASDAQ',
    price: '$223.87', change: '+5.56% · Jul 21 close · AH $225.50',
    signal: 'Dip-buy dead (SMH reclaim narrow) — CRDO bounced +5.56% Jul 21 to close $223.87 (AH $225.50), straight INTO the $219–230 re-short zone (4h Stoch 94, overbought). The fade trigger is here, stop $242 untouched. But with SMH’s $580 reclaim narrow/short-covering, hold/watch don’t chase: fade the zone $219–230 (broken $219 low / 50-day $227), stop $242; targets $200 → $190 → 🕳️ $175 breakout shelf. Reclaim $245 (200-EMA) repairs the long case.',
    lead: { rank: 13, status: 'wait', entry: '$219–230 zone', stop: '$242', targets: '$200 → $190 → $175', downside: '−6%', tail: '−14%', rr: '~2.5:1', edge: 'Dip-buy dead, SMH reclaim narrow — the +5.56% bounce ran into the $219–230 fade zone (the trigger), stop $242 untouched; fade the zone, targets down to the $175 breakout shelf' },
    side: 'short', accent: 'cyan',
    date: '2026-07-16',
    story: 'stories/crdo.html',
  },
  {
    symbol: 'DELL', exchange: 'NYSE',
    price: '$404.15', change: '+6.01% · Jul 21 close · AH $424',
    signal: 'Bull-flag — the pump ran into the zone and the AH is testing the stop. DELL closed +6.01% $404.15 INTO the $402–421 fade zone, then after-hours ripped another +4.96% to $424.21 — pushing above $421 toward the $432 stop (a catalyst-like AH move worth respecting). The fade zone is reached, but that AH strength is testing the thesis. With SMH’s $580 reclaim narrow, hold/watch, don’t add into the pump: fade $402–421 (1h stack $411 / daily mid-BB $421), stop $432; targets $377 (weekly 9-EMA) → $365 → 🕳️ $330 gap-fill. A close over $432 repairs the bull case and takes the short off.',
    lead: { rank: 15, status: 'wait', entry: '$402–421 zone', stop: '$432', targets: '$377 → $365 → $330', downside: '−7%', tail: '−16%', rr: '~2.5:1', edge: 'Bull-flag — closed +6.01% $404.15 into the $402–421 fade zone but AH ripped +4.96% to $424 toward the $432 stop; fade zone reached, but the AH strength tests it — hold/watch, a close over $432 takes the short off, a fade back opens the $330 gap-fill' },
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
