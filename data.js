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
    symbol: 'LITE', exchange: 'NASDAQ',
    price: '$608.02', change: 'now −6.74% $608.02 · testing the daily 200-EMA ≈ $610 · FIRST tag of the whole run',
    signal: 'Photonics joins the group break — the first 200-day test of the entire run. LITE trades $608.02 (−6.74%), pressing right INTO the daily 200-EMA (≈ $610) — the FIRST tag of the 200-day in the whole $50 → ~$1,050 parabola. The two-day bounce died at the 1H EMA cluster ($640–660) and price is back at the $596 low. The weekly is only starting to roll (Stoch 20.88, RSI 43.07, MACD histogram shrinking from record highs) — plenty of room below — and the photonics peer COHR already lost its 200-day and paid. A decisive daily close under $610 confirms the break and opens the air pocket to the 50-week ≈ $500 → the $419 base (prior consolidation shelf + the $419.45 level). Near-term both frames are oversold (1H RSI 33.39, Stoch 24.24; daily RSI 34.71), so don’t chase the $596 low — short the close under $610 (price is at the trigger now) or the cleaner fade of a failed bounce into $640–660, stop $665. Stance: short at trigger — break <$610 / fade $640–660 → $500 → $419; a reclaim of $665 → $694 (1H 50-EMA) repairs it, $754 (1H 200-EMA) fully negates.',
    lead: { rank: 4, status: 'live', entry: 'break <$610 / fade $640–660', stop: '$665', targets: '$500 → $419', downside: '−18%', tail: '−31%', rr: '~2.5:1', edge: 'Photonics joins the group break — LITE trades $608.02 (−6.74%), pressing into the daily 200-EMA ≈ $610, the FIRST 200-day tag of the entire $50 → ~$1,050 run; the two-day bounce died at the 1H EMA cluster ($640–660), the weekly only starting to roll (Stoch 20.88, MACD histogram shrinking from record) and peer COHR already lost its 200-day and paid — short the decisive close <$610 (at trigger now) or the cleaner fade into $640–660, stop $665, targets 50-week ≈ $500 → the $419 base; a reclaim of $665 → $694 repairs it' },
    side: 'short',
    date: '2026-07-29',
    story: 'stories/lite.html',
  },
  {
    symbol: 'NVDA', exchange: 'NASDAQ',
    price: '$197.01', change: 'close +0.25% $197.01 · AH $197.22 · tightening in $194–199 · fade $199–202 / break <$194',
    signal: 'The leader flipped short — still tightening above the $194 trigger. After the −4.99% sell-off, NVDA closed $197.01 (+0.25%), a small green day still basing in the $194–199 range — holding above the $194 break-trigger and below the $199–202 EMA-cluster fade zone. AH flat $197.22. The dip-buy is done — it rejected the $202–206 cluster and closed below the whole MA stack; the relative-strength tell that justified the long has failed. Near-term Stoch has lifted to ~78 (1H RSI 44.56) — near the top of the range, so a push into $199–202 is the cleaner short entry, stop above $206 — or short the decisive break under $194. Either way the target is the 200-day $189 → $182 → $174. Stance: short-biased under $206, tightening in $194–199 — fade the bounce into $199–202 or short the break of $194; only a reclaim back over $206 / the EMA cluster repairs the long.',
    lead: { rank: 10, status: 'wait', entry: 'fade $199–202 / break <$194', stop: '$206', targets: '$189 → $182 → $174', downside: '−6%', tail: '−13%', rr: '~3:1', edge: 'The leader flipped short, still tightening above $194 — after the −4.99% sell-off NVDA closed $197.01 (+0.25%), a small green day basing in the $194–199 range, holding above the $194 trigger and below the $199–202 EMA-cluster fade zone; the dip-buy failed (rejected $202–206, closed below the MA stack), Stoch lifted to ~78 near the top of the range so a push into $199–202 is the cleaner fade (stop $206) or short the break under $194, targeting the 200-day $189 → $182 → $174 — a reclaim of $206 repairs the long' },
    side: 'short', accent: 'red',
    date: '2026-07-28',
    story: 'stories/nvda.html',
  },
  {
    symbol: 'COHR', exchange: 'NYSE',
    price: '$243.33', change: 'close −10.31% $243.33 · AH $244.27 · ✓ T1 $265 + T2 $247 banked · driving to T3 $215 · ≈ +21% short',
    signal: 'Weekly-structure break — the re-short paid through T2 and lost the 200-day. COHR closed $243.33 (−10.31%), a decisive break that cleared BOTH T1 $265 (= the daily 200-EMA, now lost) and T2 $247 (the 50-week) — both banked. That is ≈ +21% for the short from the $310 re-arm, now driving toward 🕳️ T3 $215. Structure is broken: it closed below the daily 200-EMA ($266) and stretched far under the lower Bollinger ($316). AH $244.27 (+0.39%) — a tiny bounce, no reclaim. Deeply oversold (daily RSI 31.61, Stoch 24.75, MACD −21.55), so a reflex bounce is due — don’t chase the low; a push back into $260–282 (the broken 200-EMA / prior shelf) is the cleaner re-short add. Next: 🕳️ T3 $215, with room left on the weekly. Stop $321 untouched and far. Stance: re-short deep in the money, T1 + T2 banked — trail toward $215, add on a bounce; only a reclaim of $321 repairs it.',
    lead: { rank: 3, status: 'live', entry: '$310 filled', stop: '$321', targets: '$265 → $247 → $215', downside: '−14%', tail: '−30%', rr: '~5:1', edge: 'Weekly-structure break, paid through T2 and lost the 200-day — COHR closed $243.33 (−10.31%), clearing both T1 $265 (= daily 200-EMA, now lost) and T2 $247 (50-week), both banked, ≈ +21% for the short from $310, driving to 🕳️ T3 $215; below the 200-EMA and stretched under the lower BB, deeply oversold (RSI 31.61, Stoch 24.75) so a push into $260–282 is the cleaner add, stop $321 far, only a reclaim of $321 repairs it' },
    side: 'short', accent: 'violet',
    date: '2026-07-28',
    story: 'stories/cohr.html',
  },
  {
    symbol: 'IREN', exchange: 'NASDAQ',
    price: '$33.93', change: 'close −6.50% $33.93 · AH $34.11 · ✓ T1 $34 tagged · ≈ +13% short',
    signal: 'Flipped short — T1 $34 tagged on the close. IREN closed $33.93 (−6.50%), right at T1 $34 (intraday low $33.86) — the first target essentially banked. That is ≈ +13% for the short from the $38.90 entry. It reflex-bounced in after-hours to $34.11 (+0.53%). Price is under the whole 1H MA stack (9-EMA $35.04, 50-EMA $36.57, 200-EMA $39.13) — structure broken. Near-term it lifted off the low (1H RSI 39.11, Stoch 41.51 from the ~13 low, MACD −0.96), so a reflex bounce is underway — the cleaner short add is a push into $36–38 (9-EMA / 50-EMA), not a chase of the low. The ≈$2.8B AI-cloud catalyst is the risk: a reclaim of $41.70 repairs the long. Next 🎯 $30 (weekly support) → deeper $27; stop $42 far.',
    lead: { rank: 9, status: 'live', entry: '$38.90 filled', stop: '$42', targets: '$34 → $30 → $27', downside: '−13%', tail: '−31%', rr: '~3:1', edge: 'Flipped short, T1 $34 tagged — IREN closed $33.93 (−6.50%), right at T1 (low $33.86, ≈ +13% for the short from $38.90), AH bounce to $34.11; under the whole 1H MA stack, lifting off the low (RSI 39, Stoch 41 from 13) so a push into $36–38 is the cleaner add, stop $42 — 🎯 $30 then $27, a reclaim of $41.70 repairs the long (≈$2.8B AI-cloud catalyst the risk)' },
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
  //
  // ── Re-rated 2026-07-28 (close) ── the fades PAID and earnings hit. Fresh,
  // full-room breaks TODAY top the board (MU broke the shelf into the close;
  // NBIS broke the range low; COHR through T1+T2 to the 50-week). Completed wins are
  // pulled OUT of the ranked table (status:'booked' is filtered in renderLeaderboard)
  // but KEPT in the "Booked at targets" strip — GLW ~+21% and BE ~+26%, all targets
  // banked; their ✅ "all targets reached" record also stays on their decks. TER
  // (last active row) is the tail: its short is still live but under an earnings
  // contingency (a beat popped it +13% AH over the stop — verdict waits for tomorrow's
  // daily close). Ranked table now shows 1–11; booked names carry rank 12–13 but render only
  // in the strip.
  //
  // ── 2026-07-29 (intraday) ── LITE added at rank 4: the FIRST daily-200-EMA
  // test of its entire run, breaking today (short at trigger, not yet filled) —
  // fresh full-room break slots under the three paying leaders (MU/NBIS/COHR).
  // Ranks 4+ shifted down one; ranked table now 1–12, booked ranks 13–14.
  // ───────────────────────────────────────────────────────────────────────────
  {
    symbol: 'DRAM', exchange: 'CBOE',
    price: '$47.77', change: 'close −8.89% $47.77 · AH $48.58 · through T1 $50 · into the $47.5–48.5 cluster',
    signal: 'Roundhill Memory ETF — the memory basket closed through T1 into the cluster. ~75% is three memory names (Micron 25.8%, Samsung ~25%, SK Hynix ~24%, via total-return swaps), so it tracks memory, not the broad KOSPI. DRAM closed $47.77 (−8.89%) — clean through T1 $50 and right INTO the key $47.5–48.5 cluster (61.8% fib + rising 50-day + lower BB), the magnet the card flagged. AH bounce to $48.58 (+1.70%). It lifted off the low near-term (1H RSI 39.01, Stoch ~43 lifting, MACD −1.48), so a reflex bounce toward $52–54 is the cleaner re-short, not a chase of the low. Next below the cluster: $42–44 → 🕳️ washout $38.5–40. Confirmation now in (the daily close settled in the cluster); a close &gt;$61 + retest flips it neutral.',
    edge: 'Korean-memory basket (≈75% Micron/Samsung/SK Hynix via swaps) closed through T1 into the cluster — DRAM closed $47.77 (−8.89%), through T1 $50 into the $47.5–48.5 cluster (61.8% fib + 50-day + lower BB), AH bounce to $48.58; lifting near-term (1H RSI 39.01) so a bounce toward $52–54 is the cleaner re-short, next $42–44 → washout $38.5–40, $61 the regime-change line',
    side: 'short', accent: 'indigo',
    date: '2026-07-28',
    story: 'stories/dram.html',
  },
  {
    symbol: 'AAOI', exchange: 'NASDAQ',
    price: '$88.14', change: 'close −9.90% $88.14 · AH $88.59 · ✓ T1 $90 banked · driving to T2 $82 · ≈ +22% short',
    signal: 'Heaviest OBV collapse in the group — through T1 on the close. AAOI closed $88.14 (−9.90%), clean through T1 $90 (banked) and driving toward T2 $82. That is ≈ +22% for the short from the $113 re-arm. Still pinned under every MA (below the daily 200-EMA ≈ $102), the short is working — next T2 $82 → 🕳️ weekly 21-MA / $58. AH $88.59 (+0.51%) — a tiny bounce, no reclaim. Deeply oversold near-term (1H RSI 38.80, Stoch 44.69; daily Stoch 21.69), so a reflex bounce is due — a bounce into $97–104 (broken shelf / 50-EMA) is the cleaner add, not a chase of the low; weekly RSI leaves room, the parabola is only part-way unwound. Confirmation is now in: the daily close held under $90. Stance: short working, T1 banked — trail toward $82 / $58, add on a bounce; only a reclaim back over $120 ends it.',
    lead: { rank: 6, status: 'live', entry: '$113 filled', stop: '$120', targets: '$90 → $82 → $58', downside: '−16%', tail: '−41%', rr: '~4:1', edge: 'Heaviest OBV collapse in the group — AAOI closed $88.14 (−9.90%), clean through T1 $90 (banked) toward T2 $82 (≈ +22% for the short from $113); under every MA (below the daily 200-EMA ≈ $102), next $82 → 🕳️ $58, deeply oversold (1H RSI 38.80, Stoch 44.69; daily Stoch 21.69) so a bounce into $97–104 is the cleaner add — the daily close held under $90, only a reclaim over $120 ends it' },
    side: 'short', accent: 'violet',
    date: '2026-07-28',
    story: 'stories/aaoi.html',
  },
  {
    symbol: 'WDC', exchange: 'NASDAQ',
    price: '$463.51', change: 'close −6.91% $463.51 · at the $455–461 magnet · all targets banked ~+10% · AH bounce +3.98% $481.97',
    signal: 'The fence broke and the whole plan paid. WDC closed $463.51 (−6.91%), settling right at the T3 $455 / $457–461 confluence (daily lower BB $457 + weekly mid-BB $461) — clean through T1 $486 and T2 $475, all three plan targets essentially banked, ≈ +10% for the short from the $513 entry. Then it bounced sharply after-hours: +3.98% to $481.97, back toward the $486–513 zone the card named the cleaner re-short. This is still a deep pullback in an intact weekly uptrend (far above the weekly 50-EMA $339), so $455–461 was the target, not a trend break — take profit into the magnet, don’t press the low. The bounce is a reflex (30-min Stoch spiked to 88, RSI ~58 off the low) — re-short into $486–513, don’t chase. Stance: targets banked at the magnet; re-short the AH bounce into $486–513, a reclaim of $513→$525→$535 re-negates.',
    lead: { rank: 11, status: 'live', entry: '$513 filled', stop: '$535', targets: '$486 → $475 → $455', downside: '−5%', tail: '−11%', rr: '~2.5:1', edge: 'The fence broke and it paid — WDC closed $463.51 (−6.91%) right at the T3 $455 / $457–461 magnet (daily lower BB + weekly mid-BB), through T1 $486 and T2 $475, all three targets banked (≈ +10% for the short from $513); then a sharp AH bounce +3.98% to $481.97 into the $486–513 re-short zone (30-min Stoch spiked to 88) — take profit into the magnet, re-short the bounce into $486–513, a reclaim of $513→$535 re-negates' },
    side: 'short',
    date: '2026-07-28',
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$81.88', change: 'close −5.12% $81.88 · AH $79.79 (−2.55%) · air pocket PAYING · ≈$5 to the 200-EMA T1 ≈ $75 · $66 gap below',
    signal: 'The air pocket is paying — second close under the broken $89 gate and no bounce ever came. INTC closed $81.88 (−5.12%) and kept sliding after hours to $79.79 (−2.55%): the $89–92 re-short bounce the card waited for never showed (1H VWAP $89.91 sits right in that lid) — price just fell straight through the pocket. Structure unchanged and broken: under the whole daily MA stack, still the worst OBV in the group (−587m), momentum bleeding without divergence (1H RSI 32.22, Stoch 19.09, MACD −1.53). AH $79.79 leaves ≈$5 of air to the rising daily 200-EMA ≈ $75 (T1), then the unfilled $66 gap. Oversold but trending — cover/take profit into $75 rather than chase the low; a bounce back into $86–89 (the break zone + prior close) is the re-short now. A reclaim over $92 stalls it, $98–102 negates.',
    edge: 'Air pocket paying — the $89–92 bounce never came: close $81.88 (−5.12%), AH $79.79, ≈$5 above T1 = the rising daily 200-EMA ≈ $75, the $66 gap below; still the worst OBV on the board (−587m), 1H RSI 32.22 / Stoch 19.09 bleeding without divergence — take profit into $75, re-short a bounce into $86–89; a reclaim over $92 stalls it, $98–102 negates',
    side: 'short', accent: 'blue',
    date: '2026-07-29',
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$769.44', change: 'now −6.23% $769.44 · ✓ T1 $800 BANKED · driving to T2 $714 · ≈ +15% short',
    signal: 'Memory leader — T1 banked, the slide keeps extending. MU trades $769.44 (−6.23%), clean THROUGH T1 $800 (the May base — banked) with no bounce: yesterday’s shallow AH lift to $825.60 sold straight down. That is ≈ +15% for the short from the $905 entry, now driving toward T2 — the daily 50-day $714, the real test of the parabola. The 30-min tape is pure distribution: OBV −28.4M and falling hard, Stoch back to 15.32 from ~94 (every intraday bounce gets sold), MACD −11.19, with the 30-min MA stack ($830 / $884) capping every lift. Structure unchanged: below the $886 shelf, the $868 mid-BB, the whole stack — a parabola unwinding. Don’t chase $769 — a bounce into $800–832 (the broken T1 / 30-min 50-EMA) is the cleaner add, $868–886 the bigger one. Stance: short deep in the money, T1 banked — trail toward $714 → weekly 21-MA $665 → 🕳️ $505; only a close back over $886 is a fakeout, $955 / $1,005 ends it. The leader that dragged the group up is still leading it down.',
    lead: { rank: 1, status: 'live', entry: '$905 filled', stop: '$1,005', targets: '$800 → $714 → $665 → $505', downside: '−11%', tail: '−44%', rr: '~4:1', edge: 'Memory leader — ✓ T1 $800 BANKED and extending: MU trades $769.44 (−6.23%), clean through the May-base T1 with no bounce (yesterday’s AH lift to $825.60 sold), ≈ +15% for the short from $905, driving to T2 — the 50-day $714, the real test of the parabola; 30-min tape pure distribution (OBV −28.4M falling, Stoch 15 from 94, every lift sold under the $830/$884 stack) — a bounce into $800–832 (broken T1) is the cleaner add, $868–886 the bigger one, only a reclaim over $886 is a fakeout' },
    side: 'short', accent: 'cyan',
    date: '2026-07-29',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$320.65', change: 'close −4.22% $320.65 · grinding to T1 $308 · ⚠️ AH +13.19% $362.95 on earnings — short intact, watch tomorrow',
    signal: 'Shelf-break paying into the close — then an after-hours earnings pop to watch. TER closed $320.65 (−4.22%), grinding toward T1 $308 (intraday low $319.61), ≈ +8% for the short from the $346 entry at the close — the fade still working on the regular session. Then it reported after the close and popped +13.19% to $362.95 after-hours, back above the $346 entry and the $358 stop. ⚠️ But that is an after-hours print, not a daily close — the short stays INTACT for now; earnings gaps routinely fade or fill, so the verdict waits for tomorrow’s regular session. The plan: if the regular session tomorrow holds decisively back above $358, the short is negated (stand aside); if the AH pop fades back under the broken $326 / $346, the fade re-arms toward T1 $308 → $292 → 🕳️ 200-EMA $280. Don’t chase either way pre-confirmation — let tomorrow’s open tell you whether the beat sticks. Structure into the close stayed broken (under the whole daily MA stack); the earnings reaction is now the swing factor.',
    lead: { rank: 12, status: 'live', entry: '$346 filled', stop: '$358', targets: '$308 → $292 → $280', downside: '−11%', tail: '−19%', rr: '~4:1', edge: 'Shelf-break paying into the close, then an AH earnings pop to watch — TER closed $320.65 (−4.22%) toward T1 $308 (≈ +8% for the short from $346), then popped +13.19% AH to $362.95 above the $358 stop; ⚠️ that’s after-hours, not a daily close, so the short stays intact — the verdict waits for tomorrow: a regular session that holds over $358 negates it, a fade back under $326/$346 re-arms the fade toward $292 → 🕳️ 200-EMA $280, don’t chase pre-confirmation' },
    side: 'short', accent: 'blue',
    date: '2026-07-28',
    story: 'stories/ter.html',
  },
  {
    symbol: 'GLW', exchange: 'NYSE',
    price: '$126.01', change: 'close −12.10% $126.01 (earnings) · all targets hit ~+21% · dead-cat bounce · AH $126.39',
    signal: 'Earnings detonation — the fade paid in full. GLW reported and gapped down hard (pre-market ≈ $119.80, session low ≈ $114.57), then recovered to close $126.01 (−12.10%) — still clean through T3 $130 (the April–May base) and every target on the plan. That is ~+21% for the short from the ~$160 rejection — a complete win, all three targets ($151 → $144 → $130) banked. The ≈ $114.57 low tagged the rising daily 200-EMA ($115.01) almost to the dollar and bounced — the washout hit major support. AH $126.39. At $126 this is a news gap, not a technical level — the trend objective is DONE; there is no fresh short here. The ≈ $115 → $126 recovery IS the violent dead-cat bounce the card flagged, now running hard (30-min Stoch spiked to ~97, RSI back to ~49) straight into the $128–137 prior-support-now-resistance zone. Stance: trade complete, all targets banked — take profit / trail tight; no fresh entry, and the bounce into $128–137 is where a re-short would set up, not the low.',
    lead: { rank: 13, status: 'booked', entry: '$160 filled', stop: '$184', targets: '$151 → $144 → $130', downside: '−9%', tail: '−14%', rr: '~3:1', edge: 'Earnings detonation — GLW gapped down hard (session low ≈ $114.57) then recovered to close $126.01 (−12.10%), still through T3 $130 and every target: ~+21% for the short from ~$160, all three banked (a complete win); AH $126.39, the ≈ $115 → $126 recovery is the dead-cat bounce now running hard (30-min Stoch spiked ~97) into the $128–137 prior-support-now-resistance zone — the trend objective is done, off the ranked table (banked in the strip), a re-short would set up on the bounce not the low' },
    side: 'short', accent: 'blue',
    date: '2026-07-28',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,043.14', change: 'now −4.83% $1,043.14 · NO bounce — extending · next $958 (daily 200-EMA) → 50-week $880 · ≈ +32% short',
    signal: '✓ T1 $1,363 + T2 $1,287 banked — and the violent bounce never came. The AH lift to $1,116 was the whole reflex: SNDK trades $1,043.14 (−4.83%), a new leg lower toward the only target left, the 50-week $880 — with the rising daily 200-EMA ≈ $958 the next support en route. That is ≈ +32% for the short from the $1,536 re-arm — still the biggest winner on the board. The 4H is pinned oversold and staying there (RSI 26.30, Stoch flat at 15–18, MACD −104.80), riding the lower 4H band ($909) down — trend-mode, not bounce-mode; the $1,181–1,287 re-load zone was never tagged and the overhead has come down to the 4H 9-EMA $1,127. Weekly MACD is still hugely positive → a parabola unwinding, not yet a trend break. Stance: short deeply in the money, trailing toward $958 → $880 — bank into strength, re-load a bounce into $1,127–1,287, don’t chase the low; only a reclaim of $1,590 ends it.',
    lead: { rank: 5, status: 'live', entry: '$1,536 filled', stop: '$1,590', targets: '$1,287 → $880', downside: '−16%', tail: '−43%', rr: '~4:1', edge: '✓ T1 $1,363 + T2 $1,287 banked and the bounce never came — SNDK trades $1,043.14 (−4.83%), a new leg toward the only target left, the 50-week $880 (daily 200-EMA ≈ $958 next en route; ≈ +32% for the short from $1,536, biggest winner on the board); 4H pinned oversold (RSI 26.30, Stoch flat 15–18, MACD −104.80) riding the lower band down — trend-mode, the $1,181–1,287 re-load never tagged, overhead now the 4H 9-EMA $1,127 — bank into strength, re-load $1,127–1,287, only a reclaim of $1,590 ends it' },
    side: 'short', accent: 'red',
    date: '2026-07-29',
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$512.68', change: 'now −3.19% $512.68 · low $505.66 · ✓ $510–518 magnet TAGGED & swept · bounced back over $510',
    signal: 'The board’s barometer — the magnet got TAGGED and swept. SMH trades $512.68 (−3.19%) after dropping to $505.66 intraday — clean THROUGH the whole $510–518 confluence (0.5 fib $515 + 21-week MA $513 + the open $510 gap, now filled) — then bounced right back over $510. The full map paid: $547–550 → $535 → $510–518, every level tagged. An undercut-and-reclaim of a 4× confluence with the 4H deeply oversold (RSI 26.12, Stoch 13.19, MACD −12.14 stretched, price on the lower 4H band ≈ $503) is where a reflex bounce of the whole group starts — the magnet was the TARGET, not a level to press. Stance for the board: bank / trail the shorts into strength at their targets, no fresh short into $505–518; re-shorts set up on the bounce (each card’s fade zone — the 4H 9-EMA $527 → swing-low $535 is the first overhead). Only a decisive close back under $505.66 negates the bounce and opens the 0.618 ≈ $478 → 50-week $431; a reclaim of $535 is the first repair, and only $580 (4H 200-EMA $580.35) with breadth negates the fade regime.',
    edge: 'The board’s barometer — the magnet got TAGGED: SMH trades $512.68 (−3.19%) after a $505.66 low swept the whole $510–518 confluence (0.5 fib $515 + 21-week MA $513 + the $510 gap, filled) and reclaimed $510; the full map paid ($547–550 → $535 → $510–518), 4H deeply oversold (RSI 26.12, Stoch 13.19, lower band ≈ $503) so the undercut-and-reclaim is where the group’s reflex bounce starts — bank/trail the board’s shorts into strength, re-short the bounces (first overhead $527 → $535), no fresh short into $505–518; a decisive close under $505.66 opens the 0.618 ≈ $478, reclaim of $535 first repair, only $580 with breadth negates',
    side: 'short', accent: 'red',
    date: '2026-07-29',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$747.30', change: 'close −8.53% $747.30 · ⚠️ EARNINGS BEAT · AH +7.29% $801.77 (high $830) · low $721 near the weekly $700',
    signal: 'The fence broke and the fade paid — then earnings reversed it. STX closed $747.30 (−8.53%), a clean break THROUGH the $788 prior low and the $770–835 structure, with an intraday low $721.00 pressing right into the weekly 21-MA ≈ $700 magnet the card wanted — the short paid in full down toward the target. THEN it reported after the close and squeezed +7.29% to $801.77 after-hours (spiking to $830), a violent post-beat reversal that lifted price back above the broken $770–788 structure. This is the binary risk playing out the same way BE’s did: the technical fade banked the move into the print, but the earnings beat flips the near-term read — there is no fresh short into a post-beat squeeze at $801, and the AH pop back over the broken shelf ($770–788) is a bullish tell. Still a pullback in an intact weekly uptrend (the daily 200-EMA ≈ $578 is the deeper support below the $700 magnet), so let the earnings reaction settle; a hold back above $788 repairs the structure, while a fade back under $770 would re-arm the slide toward $700.',
    edge: 'The fence broke and the fade paid — then earnings reversed it: STX closed $747.30 (−8.53%), clean through the $788 low and the $770–835 structure to a $721 low, pressing the weekly 21-MA ≈ $700 magnet, ⚠️ then the earnings BEAT squeezed it +7.29% AH to $801.77 (high $830) back above the broken $770–788 shelf; the technical fade banked into the print but the beat flips the near-term read — no short into a post-beat squeeze, a hold over $788 repairs the structure while a fade back under $770 re-arms the slide toward $700',
    side: 'short', accent: 'amber',
    date: '2026-07-28',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$56.55', change: 'close −2.99% $56.55 · AH $56.85 · pressing the $56 line · short valid <$61, confirm <$56',
    signal: 'Flipped short — sitting on the $56 line. ASTS closed $56.55 (−2.99%), right on the $56 must-hold-below line the card flagged, under the whole MA stack and below the daily 200-EMA (≈ $76). AH $56.85 (+0.53%) — a tiny bounce, no reclaim. The short is valid below $61 and CONFIRMS on a decisive close under $56 → then the lower band / the lows open. It has not broken yet (closed right at the line), and 1H momentum has popped (Stoch 64.35 off the low), so don’t chase — a failed bounce under $61, or the break of $56, is the trigger. The daily is oversold (RSI 37.44, Stoch 16.06), so the bigger move needs the $56 break. Per the plan the B. Riley Buy $85 / Midland catalyst is the up-side risk. Stance: short valid below $61, confirmed under $56; a push back over $61 stops it out and flips the read long toward the 200-EMA ≈ $76.',
    edge: 'Flipped short, sitting on the $56 line — ASTS closed $56.55 (−2.99%), right on the $56 must-hold-below line, under the whole stack and the daily 200-EMA (≈$76); AH $56.85, 1H momentum popped (Stoch 64.35) so don’t chase — the short is valid below $61 and confirms on a decisive close under $56 (daily oversold, Stoch 16.06), a push over $61 stops it out and flips it long toward the 200-EMA ≈$76 (B. Riley Buy $85 the risk)',
    side: 'short', accent: 'violet',
    date: '2026-07-28',
    story: 'stories/asts.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$169.69', change: 'close −9.68% $169.69 · AH $168.47 · BROKE the $181 range low · driving to T1 $160',
    signal: 'Breakdown leader — the $181 range low broke. After Friday’s −15.02% collapse under $200, NBIS closed $169.69 (−9.68%), a decisive break THROUGH the $181 range low (intraday low $164.31) — the level whose break opens T1 $160 — now driving toward it. AH $168.47 (−0.72%). That is ≈ +15% for the short from the $200 entry. Price stays capped under every MA and near the lower Bollinger, MACD −6.82 — structure broken, short working. Near-term deeply oversold (1H RSI 35.51, Stoch 27.03), so a reflex bounce is due — a bounce into $181–196 is the cleaner re-short add, not a chase of the low. Confirmation is now in: the $181 range low broke on the close. Next: T1 $160 → daily 200-EMA ≈ $152 → 🕳️ $130. Stance: short live under $200, range low broken — add on a bounce into $181–196 or trail toward $160; only a 2nd close back over $213 ends it.',
    lead: { rank: 2, status: 'live', entry: '$200 filled', stop: '$213', targets: '$160 → $147 → $130', downside: '−15%', tail: '−31%', rr: '~3:1', edge: 'Breakdown leader, the $181 range low broke — after Friday’s −15.02% under $200 NBIS closed $169.69 (−9.68%, low $164.31), a decisive break through the $181 range low toward T1 $160 (≈ +15% for the short from $200); capped under every MA near the lower BB, deeply oversold (RSI 35.51, Stoch 27.03) so a bounce into $181–196 is the cleaner add — next T1 $160 → daily 200-EMA ≈ $152 → $130, a 2nd close over $213 ends it' },
    side: 'short', accent: 'indigo',
    date: '2026-07-28',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$476.46', change: 'close −7.82% $476.46 · AH $468.22 · BROKE the $492 low · next ≈ $473 lower BB',
    signal: 'Technical fade — the $492 low broke. AMAT closed $476.46 (−7.82%), a decisive break UNDER the $492 prior low the card flagged — the level whose break opens the next leg — and AH extended to $468.22 (−1.73%), already through the ≈ $473 lower-BB target. Price is under the whole MA stack, MACD firmly negative. It stays a technical fade, not a fundamental short — equipment rides the TSMC buildout and the higher timeframes are only cooling, not broken — so it stays off the ranked board. Near-term it is deeply oversold (1H RSI ~30, Stoch 20.66), so a reflex bounce is due — a bounce into $493–513 (broken shelf / VWAP) is the cleaner re-short, not a chase of the low. Confirmation is now in: the daily close held under $492. The next leg under ≈ $473 opens lower; a reclaim of $513→$530 negates.',
    edge: 'Technical fade, the $492 low broke — AMAT closed $476.46 (−7.82%), a decisive break under the $492 prior low, AH $468.22 already through the ≈ $473 lower-BB target; under the whole MA stack but still a pullback not a fundamental short (equipment rides the TSMC buildout), off the board — deeply oversold (1H Stoch 20.66) so a bounce into $493–513 is the cleaner re-short, the daily close held under $492, a reclaim of $513→$530 negates',
    side: 'short', accent: 'red',
    date: '2026-07-28',
    story: 'stories/amat.html',
  },
  {
    symbol: 'BE', exchange: 'NYSE',
    price: '$166.84', change: 'close −11.34% $166.84 · all targets hit ~+26% · ⚠️ EARNINGS BEAT · AH +10.88% $185 (high $191)',
    signal: 'Downtrend leader — the fade banked ALL targets into the print, then earnings squeezed it. BE closed $166.84 (−11.34%), blowing clean through 🕳️ T3 $170 (intraday low $164.35) — all three targets ($200 → $185 → $170) banked, ≈ +26% for the short from the $219–234 entry, a complete win. THEN it reported after the close and squeezed +10.88% to $185.00 after-hours (spiking to $191). This is exactly the binary the card flagged: banking most/all into the print was the right call — a beat squeezed it right back toward the $196–200 the plan warned about, and any runner got caught. The trend short objective is DONE — there is no short here into a post-beat squeeze; let the earnings reaction settle. A reclaim of $200 / the 50-EMA is what repairs the bulls. Position was for the print — the print delivered both the banked win and the squeeze.',
    lead: { rank: 14, status: 'booked', entry: '$219–234 filled', stop: '$250', targets: '$200 → $185 → $170', downside: '−10%', tail: '−17%', rr: '~3:1', edge: 'Downtrend leader — the fade banked ALL targets into the print: BE closed $166.84 (−11.34%), clean through 🕳️ T3 $170 (low $164.35), all three ($200 → $185 → $170) banked, ≈ +26% for the short from $219–234 (a complete win); ⚠️ then earnings BEAT and it squeezed +10.88% AH to $185 (high $191) — the trend objective is done, off the ranked table (banked in the strip), no short into a post-beat squeeze' },
    side: 'short', accent: 'amber',
    date: '2026-07-28',
    story: 'stories/be.html',
  },
  {
    symbol: 'ALAB', exchange: 'NASDAQ',
    price: '$260.23', change: 'close −7.89% $260.23 · AH $258.88 · ✓ T1 $300 + T2 $280 banked · driving to the $250 base · ≈ +16% short',
    signal: 'Dip-buy dead — the fade closed through T2, driving to the base. ALAB closed $260.23 (−7.89%), clean through T1 $300 and T2 $280 (both banked), now driving toward 🕳️ the $250 May base (T3). That is ≈ +16% for the short from the $310 entry. AH $258.88 (−0.52%). Price is under the whole MA stack and stretched below the lower Bollinger — structure broken; the rising daily 200-EMA (≈ $231) sits just under the $250 base as the deeper support. Near-term deeply oversold (1H RSI 36.58, Stoch 31.57, MACD −8.37; daily Stoch 7.22), so a reflex bounce is due — a push back into $280–297 is the cleaner add, not a chase of the low. The weekly still has room (not oversold). Confirmation is now in: the daily close held under $280. Stance: short working, T1 + T2 banked — trail toward the $250 base → 200-EMA $231, add on a bounce, stop $362 untouched; only a reclaim of $362 repairs the long case.',
    lead: { rank: 7, status: 'live', entry: '$310 filled', stop: '$362', targets: '$300 → $280 → $250', downside: '−10%', tail: '−19%', rr: '~3:1', edge: 'Dip-buy dead, closed through T2 — ALAB closed $260.23 (−7.89%), clean through T1 $300 and T2 $280 (both banked) toward 🕳️ the $250 May base (≈ +16% for the short from $310); under the whole MA stack, the rising daily 200-EMA ≈ $231 just under the base, deeply oversold (1H RSI 36.58, Stoch 31.57; daily Stoch 7.22) so a push into $280–297 is the cleaner add, stop $362 far — only a reclaim of $362 repairs the long' },
    side: 'short', accent: 'emerald',
    date: '2026-07-28',
    story: 'stories/alab.html',
  },
  {
    symbol: 'CRDO', exchange: 'NASDAQ',
    price: '$192.28', change: 'close −7.62% $192.28 · AH $195.62 · ✓ T1 $200 banked · pressing T2 $190 · ≈ +14% short',
    signal: 'Dip-buy dead — the fade closed through T1, pressing T2. CRDO closed $192.28 (−7.62%), clean through T1 $200 (banked) and pressing toward T2 $190. That is ≈ +14% for the short from the $219–230 entry. AH $195.62 (+1.74%) — a reflex bounce. Price is under the whole MA stack, though still above the rising daily 200-EMA (≈ $172), which lines up with the 🕳️ $175 breakout-shelf target below T2. Near-term oversold and bouncing (1H RSI 42.70, Stoch 41.19; daily Stoch 23.63), so a push back into the broken $203–210 zone is the cleaner add, not a chase of the low. The weekly is still an uptrend (a pullback in the leader with room). Confirmation is now in: the daily close held under $200. Stance: short live toward T2 $190 → 🕳️ $175 / the 200-EMA $172; add on a bounce, stop $242 untouched — a reclaim of $242 repairs the long case.',
    lead: { rank: 8, status: 'live', entry: '$219–230 filled', stop: '$242', targets: '$200 → $190 → $175', downside: '−11%', tail: '−22%', rr: '~2.5:1', edge: 'Dip-buy dead, closed through T1 — CRDO closed $192.28 (−7.62%), clean through T1 $200 (banked) pressing T2 $190 (≈ +14% for the short from $219–230); under the whole MA stack, the rising daily 200-EMA ≈ $172 lining up with the 🕳️ $175 target, oversold and bouncing (1H RSI 42.70, Stoch 41.19; daily Stoch 23.63; AH $195.62) so a push into $203–210 is the cleaner add — short live toward $190 → $175, stop $242, a reclaim of $242 repairs the long' },
    side: 'short', accent: 'cyan',
    date: '2026-07-28',
    story: 'stories/crdo.html',
  },
  {
    symbol: 'DELL', exchange: 'NYSE',
    price: '$392.10', change: 'close −8.15% $392.10 · AH $393.44 · LOST $402 → short-revival · plunged to ≈$368, bounced',
    signal: 'Bull-flag broke — the $402 line gave way. DELL closed $392.10 (−8.15%), a decisive loss of the $402 short-revival line the card flagged — it plunged intraday to ≈ $368 (into the $377 target zone) and bounced to close, AH $393.44. Per the plan, losing $402 flips the near-term read SHORT toward $377 → 🕳️ $330. But this is the first real break in a powerful uptrend (it ran $100 → $450+ and sits far above the daily 200-EMA ≈ $250), and the sharp bounce off $368 shows buyers still defending — so expect chop, not a clean one-way slide. Near-term the plunge already snapped back (1H RSI 40.39, Stoch 48.85 rebounding), so don’t chase the low; a failed retest of $402 is the cleaner short trigger. Stance: short-biased below $402 toward $377 → $330; a reclaim of $402 → $420 negates the short and restores the long (the uptrend is intact above $250). Off the ranked board (a fresh flip in chop).',
    edge: 'Bull-flag broke — DELL closed $392.10 (−8.15%), a decisive loss of the $402 line, plunging to ≈$368 (into the $377 zone) then bouncing (AH $393.44); per the plan that flips the near-term read short toward $377 → 🕳️ $330, but it’s the first break in a strong uptrend (far above the 200-EMA ≈$250) and buyers defended $368, so expect chop — a failed retest of $402 is the cleaner trigger, a reclaim of $402 → $420 restores the long, off the ranked board',
    side: 'short', accent: 'amber',
    date: '2026-07-28',
    story: 'stories/dell.html',
  },
  {
    symbol: 'MRVL', exchange: 'NASDAQ',
    price: '$174.47', change: 'close −7.77% $174.47 · AH $175.86 · into the $172–178 starter-buy zone · main load $150–160',
    signal: 'Bottom-watch — the dip reached the first starter-buy zone. MRVL closed $174.47 (−7.77%), right INTO the $172–178 first accumulation zone the card flagged; AH $175.86 (+0.80%). This is not a short (too late) — it is a hunt for the BOTTOM to go long: deeply oversold (daily RSI 35.03, Stoch 17.41; 1H RSI 38.91, Stoch 36.81), under the whole MA stack. Two zones: the first is here — the $172–178 shelf (a starter buy on the oversold reflex) — and the main one is $150–160, where the daily 200-EMA (≈ $155) and the weekly 50-EMA (≈ $146) line up: the “back up the truck” dip. Don’t catch the knife: accumulate in the zones, not on the fly. A confirmed bottom is a reclaim of $185 → $198–200 (turns the daily up); targets on the recovery $200 → $220 → $245. Invalidation: a weekly close under $146 breaks the multi-year uptrend — no long there. Off the ranked board (a watch).',
    edge: 'Bottom-watch for a long — MRVL closed $174.47 (−7.77%, AH $175.86), into the $172–178 first starter-buy zone; deeply oversold (daily RSI 35.03 / Stoch 17.41; 1H Stoch 36.81) under the whole stack — start a small buy at the $172–178 shelf here, load the main $150–160 dip where the daily 200-EMA ≈$155 + weekly 50-EMA ≈$146 line up, stop under $142; a reclaim of $185 → $198–200 confirms the bottom toward $200 → $220 → $245, a weekly close under $146 breaks the trend (off the ranked board, a watch)',
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
