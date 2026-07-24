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
    price: '$306.91', change: '−3.24% pre-mkt · $317.22 Jul 21 close',
    signal: 'Weekly-structure break — the overshoot is reversing, the short re-arms. COHR closed +11.15% $317.22 Tuesday — through the $310 stop but still under the $321 21-week MA (the full-repair line it never reached). Holding per plan into one narrow session paid off: Wednesday pre-market fades −3.24% to $306.91, back UNDER the $310 stop — exactly the "fade back under $310 re-arms" trigger, and SMH’s $580 reclaim is failing (→$572) so the tape confirms it. The repair never happened (no close over $321); MACD deeply negative (≈ −18.64), RSI ~43. The re-short is live again toward the 200-day $265 → 50-week $247 → 🕳️ $215. A reclaim back over $321 would be the only thing to repair it.',
    lead: { rank: 1, status: 'wait', entry: '$310 re-armed', stop: '$321', targets: '$265 → $247 → $215', downside: '−14%', tail: '−30%', rr: '~5:1', edge: 'Weekly-structure break — the +11.15% pump overshot the $310 stop to $317.22 but never repaired (no close over $321), and pre-market fades −3.24% to $306.91 back under $310 as SMH’s reclaim fails; the re-short is re-armed toward the 200-day $265 → 50-week $247, only a reclaim over $321 repairs it' },
    side: 'short', accent: 'violet',
    date: '2026-07-22',
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
    price: '$56.99', change: '−3.12% pre-mkt · $58.85 Jul 21 close',
    signal: 'Roundhill Memory ETF — ~75% is three memory names (Micron 25.8%, Samsung ~25%, SK Hynix ~24%, partly via total-return swaps), so it’s driven by Korean *memory* stocks (Samsung/SK Hynix), not the broad KOSPI. A feedback loop: US memory weakens → Samsung/Hynix fall overnight → DRAM gaps down at the US open → weakness feeds back into MU/SNDK/WDC/STX. The oversold bounce played out exactly as flagged — a violent +10.91% to close $58.85 into the $55.5–58 fade zone — and Wednesday pre-market it rolls back −3.12% to $56.99 as SMH’s $580 reclaim fails (→$572): a lower high, not a bottom. Still below every MA, daily MACD negative (≈ −1.10, RSI ~46). Fade $55.5–58 (50–61% fib + broken stack), stop $61.5; targets $50 → key cluster $47.5–48.5 (61.8% fib + rising 50-day + lower BB $46.5) → $42–44. 🕳️ Washout $38.5–40. A close &gt;$61 + retest flips it neutral.',
    edge: 'Korean-memory basket (≈75% in Micron/Samsung/SK Hynix via swaps) in a momentum breakdown — the +10.91% bounce to $58.85 tagged the $55.5–58 fade zone then pre-market rolls back −3.12% to $56.99, a lower high not a bottom; fade it, the $47.5–48.5 fib/50-day cluster the magnet, $61 the regime-change line',
    side: 'short', accent: 'indigo',
    date: '2026-07-22',
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
    price: '$522.99', change: '−4.63% pre-mkt · $548.39 Jul 21 close',
    signal: 'Short negated, but the froth is coming off — on watch. WDC ripped +12.51% Jul 21 to close $548.39, clean through the $486–513 fade zone and the $535 stop, so the pullback-short was neutralized (reclaim of $535, exactly as flagged). Wednesday pre-market it gives a chunk back — −4.63% to $522.99, losing $535 again as SMH’s $580 reclaim fails (→$572). But $522.99 is still ABOVE the $513 re-arm floor, and WDC was always the healthiest name (a pullback inside a big uptrend, far above the 200-day $345), so this is froth off a squeeze, not a confirmed re-short yet. MACD still positive (≈ +10.94) but rolling, RSI ~47. On watch: a failure back below $513 re-arms the fade toward the $486–513 zone; a hold above $535 keeps it in trend. No short here until $513 breaks.',
    edge: 'Short negated but weakening — the +12.51% pump reclaimed $535 to close $548.39, then pre-market fades −4.63% to $522.99 back under $535 as SMH’s reclaim fails; still above the $513 re-arm floor so froth off a squeeze, not a re-short yet — a failure below $513 re-arms the fade, a hold over $535 keeps it in trend',
    side: 'short',
    date: '2026-07-22',
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$102.51', change: '−2.79% pre-mkt · $105.45 Jul 21 close',
    signal: 'Worst OBV in the group — extended, not breaking out, and already fading. INTC rode the sector pump to close +8.64% $105.45, up into the $98–111 fade zone. That was the question — could it break out? — and the answer is showing: Wednesday pre-market it fades −2.79% to $102.51, no follow-through, as SMH’s $580 reclaim fails (→$572). It is still gapping into overhead supply (declining daily 9/50-EMA $108–110 right above) with the worst OBV in the group and daily MACD still negative (≈ −3.15, RSI ~43) — a pop with no real breakout energy. Fade the pump into $98–111 (1h 50-EMA / broken daily lower BB), stop $118; targets $92 → weekly 21-MA $89 → 🕳️ 200-EMA $73. A close under $89 opens the air pocket to the unfilled $66 gap. Reclaim $118 negates — and would be the first real sign of energy.',
    edge: 'Worst OBV in the group — the pump ran it to $105.45 into the $98–111 fade zone but pre-market fades −2.79% to $102.51 with no breakout energy (negative daily MACD, worst OBV); fade the pump, a close under the $89 gate opens the air pocket to the $66 gap',
    side: 'short', accent: 'blue',
    date: '2026-07-22',
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$944.88', change: '−2.67% pre-mkt · $970.82 Jul 21 close',
    signal: 'Memory bellwether — the overshoot is reversing, hold paid off. MU ripped +12.17% Jul 21 to close $970.82 (the poster child of the short-covering pump, ≈ +12%) — through the $880–905 re-short zone and the $955 stop, but under the $1,005 full-negate. Not canceling into one narrow session paid: Wednesday pre-market fades −2.67% to $944.88, back UNDER the $955 stop as SMH’s $580 reclaim fails (→$572). The overshoot is unwinding — still above the $905 zone, so not a full re-arm yet, but the direction is right. MACD flipping back down (≈ −2.72), RSI ~49. Hold; a push back under $905 fully re-arms toward $800 → weekly 21-MA $665 → 🕳️ $505. Only a 2nd day over $955 (or close over $1,005) would confirm the short is done.',
    lead: { rank: 7, status: 'wait', entry: '$905 re-arm', stop: '$1,005', targets: '$800 → $665 → $505', downside: '−15%', tail: '−47%', rr: '~4:1', edge: 'Memory bellwether — the +12.17% pump overshot to $970.82 but pre-market fades −2.67% to $944.88 back under the $955 stop as SMH’s reclaim fails; overshoot reversing (still above the $905 zone), a push under $905 fully re-arms toward $800 → $665, a 2nd day over $955 would end it' },
    side: 'short', accent: 'cyan',
    date: '2026-07-22',
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
    price: '$159.30', change: '−1.93% pre-mkt · $162.41 Jul 21 close',
    signal: 'Break-and-retest still working — the oversold bounce is stalling under the zone. GLW ripped +6.08% Jul 21 to close $162.41, lifting off the lows toward the $165–175 fade zone but closing just UNDER it. Wednesday pre-market it rolls back −1.93% to $159.30 as SMH’s $580 reclaim fails (→$572) — the bounce couldn’t clear the broken structure. Still a downtrend after blowing through $180 and $167 on an OBV collapse; deeply oversold (daily Stoch 8.8, RSI ~40, MACD ≈ −4.81) so a further push into $165–175 is the cleaner re-short entry (broken 1h stack / prior $167 support), stop $184 well clear; targets $151 → daily lower BB $144 → 🕳️ $130. Reclaim $184 negates.',
    lead: { rank: 3, status: 'wait', entry: '$165–175 bounce', stop: '$184', targets: '$151 → $144 → $130', downside: '−5%', tail: '−18%', rr: '~3:1', edge: 'Break-and-retest working — blew through $180/$167 on an OBV collapse, the +6.08% bounce stalled under the $165–175 zone and pre-market rolls back −1.93% to $159.30 as SMH’s reclaim fails; fade a push into $165–175, the daily lower BB $144 the magnet' },
    side: 'short', accent: 'blue',
    date: '2026-07-22',
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
    price: '$862.00', change: '−3.34% pre-mkt · $891.83 Jul 21 close',
    signal: 'Strongest name — thesis still over, just giving back froth. After clearing the $835 “short-off” line, STX ran +11.14% Jul 21 to close $891.83, then pre-market pulls back −3.34% to $862 with the group as SMH’s $580 reclaim fails (→$572). But this is froth coming off the leader, not a re-arm: $862 is still well ABOVE the whole $770–835 short structure, and STX led the sector higher precisely because it was healthiest (the short never even triggered). The short stays off and off the ranked board — it would take a fresh failure back under $835 to put it back in play. Until then it is a strong name digesting a squeeze in its uptrend, not a setup.',
    edge: 'Strongest name — thesis over: after clearing $835 it ran to $891.83 leading the sector; pre-market gives back −3.34% to $862 with the group but still far above the $770–835 short structure — no re-arm unless it fails back under $835, off the ranked board',
    side: 'short', accent: 'amber',
    date: '2026-07-22',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$63.90', change: '+0.88% pre-mkt · $63.34 Jul 21 close',
    signal: 'Flipped to LONG — the one name holding its gain while the group fades. ASTS broke the $57–60 base on genuine OBV buying, +10.31% to close $63.34, and unlike every faded short it HOLDS pre-market — +0.88% to $63.90 while SMH’s $580 reclaim fails (→$572). That relative strength is the tell: a real catalyst (B. Riley’s upgrade to Buy $85, Midland manufacturing-expansion approval) against a $1B convertible-note dilution overhang. It is a rebound, not yet a confirmed uptrend (still under the $77–78 wall, daily MACD ≈ −6.06 still repairing, Stoch ~16 curling up), so don’t chase $63–64: buy a hold of $61.50 or a pullback that holds $59–60, add on a breakout/close above $65–67. Targets $65–67 → $70–71 → 🎯 $77–78 (clearing it reasserts the larger uptrend). Stop below $57 (a failed rebound); a loss of $59 delays it. Size small — the convert is a real dilution risk.',
    edge: 'Flipped to long — the only name holding its gain while the shorts fade: +10.31% off the $57–60 base to $63.34 and +0.88% pre-market to $63.90 with a real catalyst (B. Riley Buy $85, Midland expansion); don’t chase $63–64 — buy a $61.50 hold or $59–60 pullback, add >$65–67, targets $70–71 → $77–78, below $57 the rebound failed (size small, convert dilution)',
    side: 'long', accent: 'violet',
    date: '2026-07-22',
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
    price: '$550.00', change: '−2.58% pre-mkt · $564.55 Jul 21 close',
    signal: 'Technical fade — the bounce ran to the re-short approach and is rolling. AMAT ripped +7.39% Jul 21 to close $564.55, clearing the $554 nearer-resistance and reaching toward the $575–590 fade zone. Wednesday pre-market it turns back −2.58% to $550, back under $554 as SMH’s $580 reclaim fails (→$572). Daily MACD is still positive (≈ +11.64) and Stoch low (14.4), so the bounce can retest — but a push into $575–590 is the cleaner re-short, stop $605; targets $510 and below on the next leg. Equipment rides the TSMC buildout, so this stays a technical fade, kept off the board. Reclaim $605 negates.',
    edge: 'Technical fade, not a fundamental short (equipment rides the TSMC buildout) — the +7.39% bounce cleared $554 to $564.55 then pre-market rolls back −2.58% to $550 as SMH’s reclaim fails; re-short a push into $575–590, stop $605, the next leg to $510',
    side: 'short', accent: 'red',
    date: '2026-07-22',
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
    price: '$310.40', change: '−2.94% pre-mkt · $319.79 Jul 21 close',
    signal: 'Dip-buy dead — the mild bounce rejected below the zone and is rolling back. ALAB closed +3.46% $319.79 Tuesday, climbing toward but never into the $325–350 re-short zone — the weakest bounce of the group. Wednesday pre-market it turns back down, −2.94% to $310.40, without ever tagging the zone, as SMH’s $580 reclaim fails (→$572). That is the fade-the-approach working: it couldn’t even reach the trigger before rolling. MACD deeply negative (≈ −10.57), RSI ~41 (40.73), stop $362 untouched and well clear. The fade is live toward $300 → $280 → 🕳️ $250 base; a push back into $325–350 just offers a better re-short entry. Only a reclaim of $362 repairs the long case.',
    lead: { rank: 14, status: 'wait', entry: '$325–350 bounce', stop: '$362', targets: '$300 → $280 → $250', downside: '−4%', tail: '−20%', rr: '~3:1', edge: 'Dip-buy dead — the +3.46% bounce never reached the $325–350 fade zone and pre-market rolls back −2.94% to $310.40 as SMH’s reclaim fails; the fade-the-approach is working toward $300 → $280, stop $362 clear, the $250 May base the deep magnet' },
    side: 'short', accent: 'emerald',
    date: '2026-07-22',
    story: 'stories/alab.html',
  },
  {
    symbol: 'CRDO', exchange: 'NASDAQ',
    price: '$218.05', change: '−2.60% pre-mkt · $223.87 Jul 21 close',
    signal: 'Dip-buy dead — the bounce tagged the fade zone and turned. CRDO bounced +5.56% Jul 21 to close $223.87, straight INTO the $219–230 re-short zone (the trigger, 4h Stoch was 94/overbought). Wednesday pre-market it reverses −2.60% to $218.05 — back UNDER the $219 zone floor as SMH’s $580 reclaim fails (→$572). That is the fade working: it tagged the trigger and rolled. MACD turning back down (≈ −0.35), RSI ~45 (44.81), stop $242 untouched. The re-short is live toward $200 → $190 → 🕳️ $175 breakout shelf; a reclaim of $245 (200-EMA) would repair the long case.',
    lead: { rank: 13, status: 'wait', entry: '$219–230 zone', stop: '$242', targets: '$200 → $190 → $175', downside: '−8%', tail: '−20%', rr: '~2.5:1', edge: 'Dip-buy dead — the +5.56% bounce tagged the $219–230 fade zone then reversed: pre-market −2.60% to $218.05 back under the $219 floor as SMH’s reclaim fails; the fade is working toward $200 → $190 → the $175 shelf, stop $242 clear' },
    side: 'short', accent: 'cyan',
    date: '2026-07-22',
    story: 'stories/crdo.html',
  },
  {
    symbol: 'DELL', exchange: 'NYSE',
    price: '$420.97', change: '+4.19% pre-mkt · $404.15 Jul 21 close',
    signal: 'Bull-flag — the odd one out: it is NOT fading, it is pushing toward the stop. DELL closed +6.01% $404.15 into the $402–421 fade zone, and while the rest of the board rolls over pre-market, DELL does the opposite — up another +4.19% to $420.97, back at the top of the zone and driving toward the $432 stop. This is the weakest short on the board: MACD positive (≈ +13.67), RSI 53.9, momentum still up while every peer fades. Respect it — hold/watch, do NOT add into the strength: the short only stays valid while $432 caps it. A close over $432 repairs the bull-flag and takes the short off; it takes a rejection here and a fade back under $402 to re-arm toward $377 (weekly 9-EMA) → $365 → 🕳️ $330 gap-fill.',
    lead: { rank: 15, status: 'wait', entry: '$402 fail to re-arm', stop: '$432', targets: '$377 → $365 → $330', downside: '−10%', tail: '−22%', rr: '~2:1', edge: 'Bull-flag — the board’s odd one out: instead of fading it pushes +4.19% pre-market to $420.97 toward the $432 stop with MACD still positive; the weakest short here — a close over $432 takes it off, only a rejection and fade back under $402 re-arms toward $377 → the $330 gap-fill' },
    side: 'short', accent: 'amber',
    date: '2026-07-22',
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
