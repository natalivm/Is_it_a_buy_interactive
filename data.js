// ── Market trend meter ──────────────────────────────────────────────────────
// The regime read at the top of the board: is each index in an uptrend or a
// downtrend, and what would have to happen to flip it. Rendered by
// renderTrendMeter() in script.js.
//
// The needle is NOT hand-set: each gauge's score is computed from its own
// `checks`, so a meter can never disagree with the checklist under it. Each
// check is 'bull' (+1) | 'bear' (−1) | 'neutral' (0), optionally weighted
// (default 1), and the score is the weighted mean → −100 (full downtrend) …
// +100 (full uptrend). That score picks the band, positions the needle and
// colours the whole card RED (down) / AMBER (rolling over) / YELLOW (neutral)
// / CYAN (repairing) / GREEN (up). Edit the checks and every visual follows.
//
// Top level:
//   updated   ISO date of the read (shown as "as of")
//   markets   the gauges, rendered as stacked rows in order — add/remove freely
//   vol       [{ symbol, value, range, change, verdict, read }] — the shared
//             VIX/VXN mini-gauges beside the trend bars (market-wide fear, so
//             they live outside the per-index rows). `value` is numeric-ish
//             (parsed for the needle) and `range` is [calmLo, fearHi] — the
//             needle sits at value's position inside that range.
//   note      one-line stance for the whole board
//
// Per market:
//   symbol/label  what the gauge measures; `role` is the one-line why-it-matters
//   price/change  freeform labels, same style as the stock tiles
//   checks        [{ label, verdict, read, weight? }] — the MAIN (daily/weekly
//                 structure) evidence rows → the big bar
//   fast          { checks: [...] } — the 4H fast frame, same check shape,
//                 scored separately → the small "4H" chip on the row. The fast
//                 frame flips FIRST; the main bar confirms. Keep 4H evidence
//                 here, not in `checks`, so the two frames stay independent.
//   confirm       [{ label, done }] — the flip checklist, in order of
//                 increasing conviction; `done: true` ticks a step off
//   levels        { reclaim, invalidate } — the two lines that decide it
//   note          one-line stance for that index
const MARKET = {
  updated: '2026-08-05',
  markets: [
    {
      symbol: 'QQQ',
      label: 'Nasdaq-100 · QQQ',
      role: 'The index — what the whole tape is doing',
      price: '$717.30',
      change: '📅 CLOSE $717.30 (−0.90%) — pullback after +1.76%/+3.40%, printed a fresh swing high $728.54 before reversing · close sits almost exactly ON the 50% line of the Mon→Tue rally ($714.30) · AH flat ($716.79, −0.07%)',
      checks: [
        {
          label: 'Weekly structure',
          verdict: 'bull', weight: 1.5,
          read: '⬆️ UPGRADED neutral → bull, three sessions into the week rather than one. Weekly RSI 59.79, price $717.30 far above the weekly 9-EMA $703.11, the 50-week $641.22 and the 200-week $505.58. The weekly cross is HOLDING — hist −3.49, 3 bars deep, 14.9% of MACD, needing 3.49 points to un-cross — the same shallow cross as Monday, just carried by two more confirming sessions instead of one. ⚠️ Thursday and Friday still have to print before this bar is final, so treat this as building conviction, not a closed book.',
        },
        {
          label: 'Daily trend',
          verdict: 'bull', weight: 1.5,
          read: '✅ THE $695–703 SLAB IS THOROUGHLY BEHIND PRICE. Today’s low $716.92 sits 2.0% above $703, and even a −0.90% pullback never came close to re-testing it. Three consecutive closes above $700 (700.07 → 723.85 → 717.30) is the CLOSE-based confirmation this check always required — the slab is beaten, not merely poked, and the sequence of higher lows/higher highs that earned the earlier upgrade is intact.',
        },
        {
          label: 'The $678–680 shelf',
          verdict: 'bull', weight: 1.5,
          read: '✅ Untested for a fourth session, now $37–40 beneath price. Fails only on a daily close back under $678.'
        },
        {
          label: 'Descending trendline (≈$695)',
          verdict: 'bull', weight: 1.5,
          read: '✅ HOLDS for a third session. Today’s low $716.92 is still 3.1% clear of the line even on the pullback — the break stands, and the BB mid $701.40 that used to sit just overhead is now $16 below price.',
        },
        {
          label: 'Daily momentum',
          verdict: 'bull',
          read: '⬆️ UPGRADED neutral → bull — this is the HOLD the check always asked for, not a one-day print. RSI has now closed over 50 for three consecutive sessions (50.02 → higher → 55.39 today). MACD histogram +3.23, positive and STILL EXPANDING even on a red day — the pullback cost price, not underlying momentum. Stoch %K 80.70/%D 64.76 is elevated but not yet rolling.',
        },
        {
          label: 'Higher low above $661.58',
          verdict: 'bull',
          read: '✅ Unchanged and unthreatened — today’s low $716.92 is 8.3% clear of $661.58. Nothing has re-tested this level since the sequence resolved.',
        },
        {
          label: 'Implied vol (VXN)',
          verdict: 'bull',
          read: '✅ VXN closed 24.15 (−5.22%), a fourth session under the ≈26 floor and its lowest print of the move. ⚠️ Worth flagging rather than reading as pure confirmation: vol fell on a day price ALSO fell, which reads more like a post-squeeze vol crush unwinding than fresh risk appetite. Breadth remains unmeasured in this feed — see the board note.',
        },
      ],
      fast: {
        checks: [
          {
            label: '4H structure',
            verdict: 'neutral', weight: 1.5,
            read: '⚠️ STILL DERIVED, NOT MEASURED — this feed carries daily/weekly/monthly OHLCV only, no 4H series. What the daily bar forces: today printed a FRESH swing high $728.54 (above Tuesday’s 723.85 close) before reversing to close 717.30 — a rejection candle shape, not a breakdown. Neutral until a 4H read exists to confirm whether that high caps the move or just pauses it.',
          },
          {
            label: '4H momentum',
            verdict: 'neutral',
            read: '⬇️ DOWNGRADED bull → neutral on the same gap, plus a shape worth respecting: the give-back was 39% of the Mon→Tue swing (700.07→728.54), landing almost exactly ON the 50% line ($714.30) — an ordinary pullback by this board’s own measuring stick elsewhere, not a failure, but also not fresh thrust. Reverts to bull on a close back over $723.',
          },
          {
            label: 'The first lower high ≈$681',
            verdict: 'bull',
            read: '✅ Still resolved and far behind — $681 is 6.4% below price and has not been re-tested since. The live level is today’s fresh high $728.54: hold above the 50% retracement of it and the higher-high sequence stays intact.',
          },
        ],
      },
      confirm: [
        { label: 'Undercut-and-reclaim of $661.58 on volume — a flush low bought back the same session', done: true },
        { label: 'Daily close back above the broken $678–680 shelf', done: true },
        { label: 'A higher low: pullback holds over $661.58, then the bounce high gets taken out', done: true },
        { label: 'Daily RSI reclaims 50 and holds it (and VXN back under ≈26) — both done: three closes over 50, VXN four sessions under 26', done: true },
        { label: 'Daily close above the descending trendline ≈$695 — the trend has actually changed', done: true },
      ],
      levels: {
        reclaim: '$703 slab cleared → $728.54 (today’s fresh high) → $731.92 (July high), then open air',
        invalidate: 'a close back under $703 re-opens the slab question; under $695 the trendline break is undone; under $678–680 the shelf; a close under $661.58 → $644–646',
      },
      note: '📅 CLOSE $717.30 (−0.90%) — pullback after +1.76%/+3.40%, made a fresh high $728.54 then gave back 39% of the swing, closing almost exactly on the 50% line. Score stays firmly green: three sessions over $700, RSI held over 50, VXN at a fresh low. ⚠️ VXN falling on a red day reads more like vol crush than fresh calm — breadth still unmeasured.',
    },
    {
      symbol: 'SMH',
      label: 'Semis · SMH',
      role: 'The board’s barometer — the group that leads this tape',
      price: '$569.70',
      change: '📅 CLOSE $569.70 (−1.04%) — ✅ THE $547–550 GATE IS CLEARED, second session running (575.71 on 08-04, 569.70 today) · today’s high $585.00 pushed into $580 intraday, not held on the close · AH flat ($569.50, −0.04%)',
      checks: [
        {
          label: 'Weekly structure',
          verdict: 'neutral', weight: 1.5,
          read: '⚠️ STILL THE LAGGARD FRAME. Weekly RSI 58.37, but the weekly cross has NOT flipped — hist −9.19, negative and EXPANDING for a third bar, deeper than it was Monday. Price $569.70 sits fractionally UNDER the weekly 9-EMA $570.22 (by 52 cents), while holding far above the 50-week $455.50 and 200-week $291.06. The daily has cleared its gate; the weekly has not confirmed it yet — that gap is the honest read, not a contradiction.',
        },
        {
          label: 'Daily trend',
          verdict: 'bull', weight: 1.5,
          read: '⬆️ FLIPPED bear → BULL, and this is the single biggest change in this refresh. The $547–550 gate this check was built around — rejected on 08-03, reached-and-rejected again intraday since — CLOSED above on 08-04 at $575.71, and held a second session today at $569.70 despite a −1.04% pullback. That is confirmation, not a poke: two consecutive closes clear of the level that gated nearly every semi long on this board. The 50-EMA $569.84 sits almost exactly at today’s close — the next line to watch.',
        },
        {
          label: 'The 0.618 at ≈$478',
          verdict: 'bull', weight: 1.5,
          read: 'Untouched and now 16% below price. Still the strongest single piece of evidence on this board; it does no work at these levels and only matters again if the whole reclaim fails.',
        },
        {
          label: 'Overhead stack',
          verdict: 'bull', weight: 1.5,
          read: '⭐ THE $547–550 GATE THIS CHECK NAMED AS THE NEXT TEST IS NOW CLEARED TOO — closed above it twice running. What remains overhead: $572–576 (50-day + mid-band) and $580, both of which today’s high $585.00 pushed THROUGH intraday without a close confirming it. So the stack is mostly behind price now; $580 on a close is the one lid still doing work.',
        },
        {
          label: 'Group leadership',
          verdict: 'neutral',
          read: '⚠️ NOT RE-MEASURED TODAY — the per-name cohort split that drove this check (heavyweights flat while the most-shorted names squeezed) needs a fresh breakdown of individual closes, which is a separate pass from this regime dump. What SMH’s own tape says on its own: today was an orderly, well-defined pullback off a fresh high, not a distribution day — that argues neutral-to-constructive rather than repeating the prior bear verdict without evidence.',
        },
        {
          label: 'Bounce confirmation',
          verdict: 'bull',
          read: '✅ SUPERSEDED BY A BIGGER CONFIRMATION. The $535 bounce this check tracked is now three levels behind price — the gate itself has closed above twice. Nothing here is still in question; the open question moved up to the daily-trend check.',
        },
      ],
      fast: {
        checks: [
          {
            label: '4H structure',
            verdict: 'neutral', weight: 1.5,
            read: '⚠️ Still no 4H series in this feed. What the daily bar forces: today printed a fresh high $585.00 (through the old $580 lid) before reversing to close 569.70 — the same rejection shape QQQ printed. Neutral until a 4H read exists.',
          },
          {
            label: '4H momentum',
            verdict: 'neutral',
            read: '⬇️ DOWNGRADED bull → neutral on the same gap. The give-back was 39% of the Tue→Wed swing (545.46→585.00), landing almost exactly ON the 50% line ($565.23) — an ordinary pullback, not fresh thrust or a failure. Reverts to bull on a close back over $578.',
          },
          {
            label: '$505.66–510 reclaim',
            verdict: 'bull',
            read: 'Untouched and now 11% below price — this level has not been relevant for two sessions and is carried forward as resolved.',
          },
          {
            label: 'The $547–550 lid · volume test',
            verdict: 'bull',
            read: '⬆️ UPGRADED bear → bull — the lid that failed this test on 08-03 has since closed above it twice (575.71, then 569.70 today). ⚠️ The volume half of this check still cannot be refreshed — no 1H OBV series in this feed — so the flow question stays unanswered rather than assumed, same caveat as always.',
          },
        ],
      },
      confirm: [
        { label: 'Hold $500 in the regular session — the AH snap-back is not enough on its own', done: true },
        { label: 'Reclaim $505.66–510 — the sweep low that broke, back over the line', done: true },
        { label: 'Daily close above the 4H 9-EMA $513.80, then a push at $535', done: true },
        { label: 'Undercut $535 and reclaim it in the same session — the pivot proven from beneath', done: true },
        { label: 'Daily CLOSE over $547–550 — the gate; CLEARED 08-04 ($575.71) and held again 08-05 ($569.70)', done: true },
        { label: 'Close above $580 with breadth — today’s high $585.00 pushed through it, not held on the close', done: false },
      ],
      levels: {
        reclaim: '$547–550 CLEARED (two closes running) → $572–576 (50-day + mid-band) → $580 (touched $585 intraday, not closed) → $594–600',
        invalidate: 'a daily close back under $547–550 re-opens the gate question; under $535 the whole reclaim voids → $483/$478 retest',
      },
      note: '📅 CLOSE $569.70 (−1.04%) — ✅ gate cleared two sessions running (575.71 → 569.70), both well above $547–550. Today’s high $585.00 pushed into $580, not held on the close. Pullback stayed orderly: gave back 39%, landing almost on the 50% line $565.23. ⚠️ Weekly cross still hasn’t flipped (RSI 58.37, hist −9.19 expanding) — the daily led, the weekly hasn’t confirmed.',
    },
  ],
  vol: [
    {
      symbol: 'VIX', value: '15.81', range: [15, 22], change: '📅 close 15.81 (−4.18%) — fourth session under 16, fully unwound the spike to $18.43',
      verdict: 'bull',
      read: 'Fourth consecutive close under 16, and today unwound the ENTIRE brief spike to $18.43 in a single session — a full round-trip of fear, not a lingering worry. Daily MACD histogram −0.22, negative and expanding. Weekly cross ESTABLISHED at 32.5% of MACD, 17 bars deep — the deepest, most confirmed calm-vol reading this board has tracked, well past fragile. ⚠️ Breadth/McClellan/Market Tide remain outside this feed, so participation is still genuinely unmeasured — cheap protection alongside unmeasured participation is worth respecting as a caveat, not read as a green light on its own.',
    },
    {
      symbol: 'VXN', value: '24.15', range: [22, 33], change: '📅 close 24.15 (−5.22%) — fourth session under ≈26, fully unwound the spike to $26.60',
      verdict: 'bull',
      read: 'Same round-trip as VIX, in NASDAQ-specific vol: closed 24.15, erasing the brief spike to $26.60 in one session — a fresh low for the whole move. ⚠️ Unlike VIX, this cross is FRAGILE — only 2 bars deep at 32.7% of MACD, the shallowest reading tracked here, so it could still reverse on a single bad session where VIX’s could not. Daily MACD histogram −0.44, negative and expanding a third bar.'
    },
  ],
  note: '📅 Закриття 05.08. QQQ/SMH відкотились після двох потужних сесій (+1.76/+3.40% і +0.91/+5.55%), обидва зробили нові локальні хаї внутрішньоденно і закрились майже точно на 50%-лінії відкату. ⭐ Гейт SMH $547–550 ЗАКРИТО вище другу сесію поспіль (575.71 → 569.70) — більшість гейтованих лонгів по факту більше не заблоковані самим гейтом. ⚠️ VIX/VXN впали ще нижче попри червоний день — більше схоже на розвантаження волатильності після сквізу, ніж на нову впевненість; ширина ринку (breadth) досі не виміряна цим фідом.',
};

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
//   alert      (optional) true = surface this card in the "What's new" popup.
//              Hand-set on purpose, like `lead.status` — a refresh touches most
//              tiles' `date` in one pass, so `date` alone can't tell genuine
//              news (a status flip, a stop threatened, an earnings reaction, a
//              thesis needing re-justification) from a routine price bump. Set
//              it deliberately on the cards that changed the read on a name;
//              leave it off (or remove it next refresh) once the news is old.
//   story      path to the interactive presentation HTML
//
// To add a stock: drop its story at stories/<symbol>.html and add an entry here.
// ── ARCHIVE · JULY SHORT CYCLE (closed 2026-07-31) ──────────────────────────
// The board reset to a clean slate on 7/31 after the AI-infra squeeze (MSFT AI
// capex beat + SK Hynix +28% / Samsung +25% Korea reversal) ended the short
// cycle: every lead was removed and the realised-shorts ledger cleared, per the
// owner's call, ahead of the new cycle's plans (longs once the uptrend
// confirms, shorts where a setup still warrants one). Realised results as last
// recorded — short entries, scored at lead.tagged / lead.closed:
//   MU    $905 → T1 $800 tagged        ≈ +12%
//   SNDK  $1,536 → T1 $1,287 tagged    ≈ +16%
//   AAOI  $113 → T2 $82 tagged         ≈ +27%
//   NBIS  $200 → T2 $147 tagged        ≈ +27%
//   IREN  $38.90 → T2 $30 tagged       ≈ +23%
//   BE    $219–234 → T3 $170 tagged    ≈ +25%
//   ALAB  $310 → T3 $250 tagged        ≈ +19%
//   GLW   $160 → T3 $130 tagged        ≈ +19%
//   CRDO  $219–230 → T2 $190 tagged    ≈ +15%
//   WDC   $513 → T3 $455 tagged        ≈ +11%
//   LITE  break <$610 → ⛔ stopped $665 ≈ −9% (the cycle's one loss)
//   (NVDA <$194, COHR $310 — open, unrealised at reset; CRWV never filled)
// 14 ranked · 10 tagged wins · 1 stop. History only — nothing here renders;
// the live ledger rebuilds from the new cycle's leads.
const STOCKS = [
  // ── 2026-07-31 (CLOSE · daily + weekly + month-end) ─────────────────────────
  // 14 cards revisited to the Friday CLOSE from daily/weekly/monthly charts:
  // STX, WDC, AMAT, ALAB, MRVL, MU, LITE, DRAM, SNDK, INTC, AAOI, COHR, TSLA
  // (+ SMH/QQQ already at the close in MARKET). NVDA was already at the close.
  //
  // ⭐ THE FINDING THAT DROVE THE RE-RANK — Friday was NOT sector risk-off, it
  // was a DRAM/NAND re-rating, and three independent measures partition the
  // cohort identically with NO overlap:
  //   BROKE (closed at/near their lows)   MU −5.90% · SNDK −5.09% · DRAM −3.76%
  //   HELD (closed green)  WDC +2.21% · STX +0.52% · AMAT +1.18% · LITE +2.99%
  //                        · ALAB +3.85%
  //   daily RSI   HDD 51.02 / 50.07 (the only two ≥ midline) → semicap+optical
  //               46.33 / 45.54 / 45.29 → DRAM/NAND 43.58 / 42.63 / 40.71
  //   daily Stoch HDD 40.31 / 40.79 (mid-range) vs DRAM/NAND 22.14 / 19.12 / 13.24
  // The clincher: post-spinoff WDC is pure HDD and SNDK IS the NAND business —
  // two halves of ONE company priced in opposite directions the same session.
  // DRAM (the ETF) holds both pairs and still closed on its low, so DRAM/NAND
  // weight overwhelmed storage inside the basket. Hence HDD longs rank above
  // DRAM/NAND longs on evidence, not preference.
  //
  // ⭐ THE GATE PAID FOR ITSELF IN CASH. SMH closed $540.53, under $547–550, so
  // NOT ONE long filled. MU and DRAM both closed through their stops ($853 /
  // $51.55) and SNDK closed through BOTH of its ($1,287 and $1,235) — a SNDK
  // fill near $1,293 stops the same session at ≈−4.5%. Realised loss on a
  // −5.90% reversal day: ZERO. Both rules fired correctly at once: no long
  // without the SMH close, no short without a rejection.
  //
  // 🔻 SNDK FLIPPED long → SHORT (was rank 3 long). Its long died by its own two
  // written conditions AND its structural premise (the $1,287 weekly-21-MA
  // reclaim) failed — that is what separates it from MU, which broke only its
  // plan and kept its structure (weekly RSI 56.26, 50-day ≈$778.74 intact), so
  // MU keeps a re-drawn LONG and SNDK changes sides. The short zone is set HIGH
  // on purpose — $1,287–1,346, not the nearer $1,235 — because $1,346 (weekly
  // 9-EMA) is where the rejection ALREADY printed: Friday ran $1,404.99 through
  // it and closed back under at $1,214.83. A proven seller level beats a
  // projected one, and selling $1,235 would take a third of the reward for the
  // same risk.
  //
  // ⚠️ INTC and AAOI: the REJECTIONS printed (INTC $97.90 inside $96–102 then
  // closed $90.20 six cents off its low, RED, on a day the sector gapped UP —
  // the cleanest trigger on the board; AAOI $103.20 at the double-200 then
  // closed $94.32 near its low, with 1H OBV collapsing to −11.7M, a NEW low,
  // THROUGH a +4.67% up day). But NEITHER confirmation line printed — INTC
  // closed $90.20 vs its $89 trigger, AAOI $94.32 vs its $92 (1H verified).
  // Both are recorded at-trigger, NOT filled, and must not be scored as wins.
  //
  // ⚠️ BOARD-WIDE MONTHLY ROLLOVER (belongs in every long's risk line): monthly
  // Stoch AMAT 89.59 · STX 89.22 · MU 89.08 · WDC 87.71 · SNDK 82.15 · LITE
  // 80.61 · ALAB 77.72, with monthly MACD histograms flipping RED for the first
  // time in this advance and July closing red nearly everywhere (MU −24% from
  // its open, SNDK −41.7%). Monthly MACD is still POSITIVE, so this is momentum
  // DECELERATING, not reversing — write "stretched and slowing", never "topped".
  // The HDD paradox follows from it: WDC/STX own the BEST daily readings and the
  // WORST monthly ones → favour on RANK, penalise on SIZE.
  //
  // ⚠️⚠️ 2026-08-01 — CORRECTION, and it applies BEYOND the card it was found on.
  // tools/refresh.py recomputed MU from Yahoo OHLCV and matched the screenshot
  // readings EXACTLY where they were read correctly (close 823.03, O/H/L, daily
  // RSI 43.58, weekly RSI 56.26, BB upper 1,050.72) — but exposed three
  // SYSTEMATIC misreadings of the chart pills, not arithmetic errors:
  //   1. Yahoo's MACD pill shows the SIGNAL line, not the MACD line. Every
  //      "MACD x" transcribed from a pill on this refresh is the signal.
  //      MU daily: pill −23.06 = signal; the MACD line is −37.41, hist −14.35.
  //   2. Adjacent pills were attributed to the wrong series. MU: $892.61 is the
  //      50-EMA (not the 9-EMA — that is $864.96), and $778.74 is the LOWER
  //      BOLLINGER BAND (not the 50-day). MU's card claimed it "held its
  //      50-day"; it did not — it held the lower band, a weaker claim. FIXED.
  //   3. THE MONTHLY-HISTOGRAM CLAIM STANDS — but say it precisely. The chart
  //      tints the MACD histogram by DIRECTION, not by sign: a histogram that
  //      is POSITIVE but CONTRACTING draws a RED bar. MU monthly is +84.02
  //      (MACD 194.16 over its 110.15 signal) and contracting for the first
  //      time in the advance — so "the histogram turned red" is CORRECT, while
  //      "momentum went negative" would not be. An intermediate edit of this
  //      file wrongly retracted the claim on the strength of the positive sign
  //      alone; that retraction was the error, and it is undone.
  //      Wording rule for every card: red = the gap is CLOSING (thrust fading,
  //      advance intact); negative = MACD has crossed BELOW its signal. Never
  //      let one imply the other. tools/ now prints sign and direction
  //      separately with a bar count for each, so this cannot recur.
  // OBV levels will NOT match the chart and that is expected: OBV is cumulative
  // from an arbitrary start bar, so only its DIRECTION is meaningful (MU chart
  // pill 1.07b vs computed 1.21b — same series, different origin).
  //
  // RANKS RE-CUT on setup integrity first, then cohort evidence, then remaining
  // potential: longs 1–14, shorts 15–23. ALAB ⚠️ carries the board's worst AH
  // giveback (−2.64%); MRVL was demoted because the daily-OBV premise that
  // justified its rank did not survive the session, even though its zone held.
  //
  // ⏳ NOT REFRESHED — still on Thursday's close + overnight, read as STALE:
  // DELL, TER, CRDO, BE, NBIS, CRWV, IREN, GLW, ASTS, META. Their `downside`
  // fields are the only ones that no longer tie to their computed % -left,
  // which is the tell. Each needs its own chart pass.
  // (Chart-reading note for next pass: the values 419.45 / 49.39 / 1,579.85 are
  // cross-chart render artifacts — ignore them; and reject any legend whose
  // close does not tie to the header, or whose weekly high sits BELOW the daily
  // high, which caught stale crosshair bars on DRAM, WDC and LITE.)
  // ───────────────────────────────────────────────────────────────────────────
  // ── 2026-07-30 (10:00 ET · session) ── THE BOUNCE FIRED. The reflex the SMH
  // card armed at the 0.618 arrived on the open and it is violent: the memory /
  // AI-infra leaders are up double digits off their majors —
  //   MU   +13.19% → $836.50  (the AH tag of T2 $714 / $718.38 WAS the low;
  //                            straight into the named $778–835 add zone, 1H
  //                            50-EMA ≈ $853 the first lid, RSI 62.57 / Stoch
  //                            84.61 already overbought, MACD line still −20.33)
  //   SNDK +21.51% → $1,234.38 (the $958 200-EMA target NEVER tagged; the whole
  //                            $1,045–1,183 re-load zone cleared in one gap,
  //                            price above the 1H upper band $1,224)
  //   IREN +27.28% → $37.31   (⚠️ the ≈$2.8B AI-cloud squeeze risk the card
  //                            named — back AT the $38.90 short entry, stop $42
  //                            ~12% away, the 🕳️ $27 runner dead)
  // Refreshed here: MU, SNDK, IREN, SMH.
  //
  // ── 2026-07-30 (12:39 ET · MID-SESSION) ── the bounce is HOLDING, not
  // extending. SMH $536.64 (+6.43%) after running to $538.75: three hours above
  // the reclaimed $535, above the 1H 50-EMA $529.65, sideways at the highs —
  // the first pop this week that did NOT fade from the open (TER, BE, STX all
  // did). Two things improved: the extension worked OFF (back under the 1H
  // upper band ≈$541, consolidating instead of rejecting) and 1H OBV is RISING
  // (57.2M → 61.3M) with MACD closing on zero (−7.60 → −2.35). Two things did
  // not: the $540 lid capped it and $547–550 — the DAILY swing high, the level
  // that decides the group — is untested, with Stoch pinned 90.35.
  // Vol: VIX 18.26 (−2.98%, pressing the ≈18 line = the cleanest confirmation
  // on the board) but VXN 28.50 has ticked UP from 28.08 and never reached its
  // ≈26 floor — fear is cheaper, not gone. 15:30 macro + AMZN tonight ahead.
  // Bands deliberately UNCHANGED (SMH daily Repairing +31 / fast Uptrend +78 ·
  // QQQ daily Rolling over −33 / fast Uptrend +71): a sideways 2.5 hours is not
  // new structure, and 'Bounce confirmation' stays neutral because the bar it
  // set is the daily CLOSE, not a mid-session hold.
  //
  // MU and SNDK are now at their own 12:40/12:41 prints, and they did not just
  // hold — they EXTENDED:
  //   MU   $854.84 (+15.68%, was +13.19%) — ❗ TOOK the $853–854 lid this card
  //        called the day's decider (1H 50-EMA + upper band); now into the
  //        $868–886 last-defence shelf where the 1H 200-EMA has fallen to ≈$890,
  //        making $886–890 ONE line and a close above it the end of the short.
  //        MACD −20.33 → −7.38, OBV 226M rising; only Stoch 94.03 says stop.
  //        Position ≈ +5.5% from $905 (was +7.6% at 10:00, +18% yesterday).
  //   SNDK $1,249.55 (+23.01%, was +21.51%) — grinding INSIDE the re-drawn
  //        $1,234–1,287 zone, ~3% under the banked T2 $1,287, and it slipped
  //        back UNDER the 1H upper band $1,251.12 while going higher: the
  //        extension is being worked off, not rejected — bull-flag behaviour.
  //        MACD −26.94 → −8.85, OBV 154M rising. Position ≈ +18.6%.
  // The rejection both cards require has NOT come. That absence is the news:
  // the rule ("add only on a rejection") is what keeps this from becoming a
  // loss, and it is now the only thing holding either add back.
  //
  // ⏱️ 15-MIN OVEREXTENSION (analyst read, no 15m print in this pass): MU and
  // SNDK are both badly stretched on the 15-minute frame. Recorded as the EARLY
  // TELL, not a trigger — the 15m is where the rejection each plan requires
  // would print first. Ladder written into both cards: 15-min lower high + loss
  // of the 15-min 9-EMA (early) → 1H close under $853 (MU) / $1,162 (SNDK)
  // (confirmation) → daily close (verdict). Explicitly framed as a reason to
  // watch the zone rather than front-run it: short-frame stretch inside a trend
  // day / bull flag resolves sideways at least as often as it reverses.
  //
  // ⚠️ COMPOSITION MATTERS: SMH is FLAT since 10:00 (+6.85% → +6.43%) while the
  // memory names extended, so arithmetically the non-memory semis drifted
  // lower. This afternoon leg is MEMORY-SPECIFIC, not a broad group reversal —
  // which means the memory shorts are the ones bleeding, and the non-memory
  // shorts (COHR, LITE, NVDA, ALAB, CRDO) are not being told much yet.
  //
  // QQQ refreshed to its own mid-session print: $680.94, +2.90% (+$19.21 derived
  // from the $661.73 close — the chart's −0.38/−0.06% is the current 1H bar,
  // not the session). It has HELD the reclaimed $678–680 shelf all session
  // ($681.19 at 10:05 → $680.94) with 1H RSI only 52.90 — no extension to
  // unwind, the exact opposite of the memory leaders at Stoch 90+. So the index
  // has room and the leaders do not. Against it: price is parked precisely at
  // the first lower high ≈$681, unable to push through, with the ≈$695
  // trendline and a $700–708 supply box above and $675.27 → $665.35–667.74 the
  // supports under it. Verdicts unchanged (daily Rolling over −33 / fast Uptrend
  // +71) — the shelf and momentum checks stay neutral because their stated bar
  // is the DAILY CLOSE, same discipline applied to SMH.
  //
  // THE RULE THIS SESSION ESTABLISHES: every add / re-short zone drawn at
  // yesterday's stack now sits BELOW price and is VOID. A zone has to be
  // re-drawn where price actually is, and its condition is a REJECTION — never
  // a chase of a vertical candle.
  //
  // RANKS HELD ON PURPOSE (no re-rate today). The 7/29 rule ranks by remaining
  // potential = % left from the current price to the deepest target. On a
  // squeeze day that rule INFLATES the losers: MU bouncing +13% mechanically
  // grows its "−40% left to $505" and would promote it to rank 1 precisely
  // because the trade went against us. So ranks stay put until the close, and
  // the computed Progress column carries the truth instead — earned collapsed
  // MU +18% → ≈ +7.6%, SNDK +34% → ≈ +20%, IREN +25% → ≈ +4%.
  //
  // ⚠️ NOT REFRESHED (no fresh print this session): AAOI, ASTS, AMAT, CRDO —
  // the last four cards still on 7/29 close data. All four are shorts in the
  // same AI-infra cohort that squeezed 10–27% today: read their prices, zones
  // and progress as STALE until each gets a fresh print. AAOI is the deepest
  // short (was ≈ +32%) and CRDO sat at its 200-EMA target — assume both gave
  // back like their peers did. Everything else (21/25) carries 2026-07-30,
  // refreshed across two parallel sessions (this branch + PRs #222/#224:
  // ALAB, WDC, COHR, GLW, TER, TSLA), so wording style may differ per card
  // but every price is same-day. Each is revisited. (The trend meter and the VIX/VXN minis ARE current — see
  // the 10:05 snapshot above.)
  // NOTE (mechanical, resolved): the strip is now a realised-results LEDGER —
  // `lead.tagged` records the deepest target actually hit (survives squeezes
  // back above it) and `lead.closed` records a stop/exit, scored win or LOSS.
  // LITE carries closed:'$665' (−9%): losses stay on the board by design.
  //
  // ── 2026-07-30 (pre-market) ── META ADDED off the ranked board (long
  // watch, bottom-hunt): the capex binary the CRWV card waited for resolved
  // RED at the payer itself — META gapped −8.33% pre-market to $536.85
  // (close $585.61), landing ON the daily lower band $538.49 inside the
  // two-year $525–540 demand shelf (Apr-25 + Apr-26 lows, both V-bought)
  // with the 200-week EMA ≈ $530 beneath. Buy the FLIP, not the gap:
  // probes $530–538 post-open, core on an undercut-and-reclaim of
  // $525–530, stop <$515; flip confirms 1H close >$555 → reclaim $585.61;
  // a daily close <$525 = shelf gone, air to ≈ $420 — long off.
  // NOTE: CRWV's post-META instruction (fade $65–74 / break <$59.6) is now
  // LIVE — refresh CRWV when its tape prints. TSLA + META are the two
  // bottom-hunt watches of the session (both on their 200-week rails).
  // ── 2026-08-04 (PRE-MARKET) ── PLTR ADDED, ranked 4 and DELIBERATELY not
  // higher. Ranks 4→22 each shift down one to make room; nothing else about
  // their relative order changes.
  //
  // Why it ranks above every waiting long below it: it is EXEMPT from the SMH
  // gate as a non-semi (the META/TSLA precedent), and that is not a small
  // edge today — the gate is unmet (SMH closed $545.46, having run $548.49
  // INTO $547–550 and closed under it), so NVDA/ALAB/AMD/CRDO/AMAT/ASML/MRVL/
  // WDC/STX/TER/NBIS/LRCX cannot fill at all while PLTR can. Its $141–143 zone
  // also satisfies Rule A properly — 200-day + top of the former range, two
  // independent references, not the place the last print happened.
  //
  // Why it does NOT rank above the three FILLED positions, or at 1: the gap has
  // not closed a single session. Every daily reading behind it is a pre-market
  // print, and this board's own rule is that one session is not a structure —
  // so an unclosed gap does not outrank a held position that is already paying.
  // The falsifier is named on the card, as that rule requires: a daily close
  // back under $141 voids the breakout premise and drops PLTR below the gated
  // waits.
  //
  // ⚠️ The structure board (board.js) sorts PLTR FIRST on conviction 2.5 and
  // this card ranks it 4th. That is the two products disagreeing by design, not
  // an inconsistency: the board scores structure, the card ranks a tradeable
  // plan, and PLTR's plan has no entry yet.
  //
  // ⚠️ AUDIT NOTE — one finding on this card is deliberate. `price` leads with
  // the PRE-MARKET print $147.19 rather than the $125.65 pre-earnings close,
  // which is a departure from the house convention (CRWV's pre-market card
  // keeps its close). The reason is that planProgress() and the audit both read
  // the FIRST number in `price` as "where price is": with $125.65 there, the
  // tile would compute % -left from a price nobody can trade and the audit
  // would flag the $141–143 zone as sitting 12.2% ABOVE price, i.e. as chasing,
  // when it is 3.0% BELOW where PLTR actually trades. `change` says outright
  // that this is not a close and nothing is filled, and the deck's ТУТ rung is
  // clocked as pre-market to match, so the frame is stated rather than implied.
  {
    symbol: 'PLTR', exchange: 'NASDAQ',
    price: '$158.43', change: '📅 CLOSE $158.43 (−2.60%) — first pullback since the gap: O $162.00 · H $166.06 · L $158.25, giving back part of the expansion · still no fill — $141–143 sits 10.7% below price, unreachable today',
    signal: '📅 CLOSE 08/05 — FIRST RED SESSION SINCE THE GAP, AND IT CHANGES NOTHING MECHANICALLY. PLTR closed $158.43 (−2.60%), O $162.00 · H $166.06 · L $158.25 — a normal pullback after two expansion sessions, closing well off the low. The $141–143 zone (200-day area + top of the former range) is still 10.7% below today’s low, untouched and unreachable in a single session; the plan stays unfilled at rank 4. Daily RSI 68.74, Stoch %K 73.68/%D 52.92, MACD histogram +3.27 and still expanding — stretched but not yet rolling. Nothing here moves the entry, the stop ($134 close) or the kill-line ($141 close).',
    lead: { rank: 4, status: 'wait', entry: 'pullback holds $141–143', stop: '$134 (close)', targets: '$150 → $157 → $168', rr: '~3.3:1', edge: '⏳ LONG-FIRST, BUT A 3.4-ATR GAP IS NOT AN ENTRY — the earnings gap of +$21.54 is ≈3.4× the $6.32 pre-gap ATR (5.03% of the $125.65 close), so a single bar is wider than the stop a normal entry carries. Buy the retest that holds, not the move that made it. 📐 Zone anchored to TWO independent references, as Rule A demands and as the four zones blown through in the week of 08-03 were not: $141–143 is the daily 200-day area AND the top of the former range. 📐 Stop in ATR units: midpoint $142, close under $134 = $8.00 = 1.27 ATR ✓. The $141 line itself would be 0.16 ATR, taken out by an ordinary day. ⚠️ If today’s close lifts 1 ATR past $8, the ATR-proof stop is a close under $129 ($13.00, 2.06 ATR) and R:R falls ~3.3:1 → ~2.0:1. 🚦 EXEMPT from the SMH gate as a non-semi (the META/TSLA precedent) — and the gate is unmet, SMH having run $548.49 into $547–550 and closed $545.46, so the gated semis cannot fill at all while this can. That is why it outranks them. 📐 The structure board sorts PLTR FIRST of 22 rows on conviction 2.5 while this card ranks it 4th — the two products answering different questions, structure vs a tradeable plan. ⚠️ The gap has not CLOSED a single session, so the bullish daily is provisional. ⛔ A daily close back under $141 targets $134–130 then $125–120, and it falsifies this rank rather than being something to defend.' },
    side: 'long',
    date: '2026-08-05',
    story: 'stories/pltr.html',
  },
  {
    symbol: 'META', exchange: 'NASDAQ',
    price: '$590.24', change: '📅 CLOSE $590.24 (+6.02%) — ✅ the $562 acceptance line HELD on the close, 5.0% through it · high $597.52 reached INTO the $594–609 gap-fill · ⭐ UNGATED as a non-semi',
    signal: '📅 CLOSE — ✅ ACCEPTANCE OVER $562 CONFIRMED ON THE CLOSE: $590.24, 5.0% above the line; the high $597.52 touched the $594–609 gap-fill without taking it. 🔓 UNGATED — the non-semis (META, TSLA, NBIS) are exempt from the SMH gate by board policy; META’s driver is its own capex print. Status stays WAIT: the $572–585 entry is a pullback and price closed above it — do not chase into the gap-fill. Overhead is still damaged: the 50-EMA $606.34 and 200-EMA $628.87 sit above. Plan: pullback holds $572–585, stop a close under $556, targets $609 → $629 → $645. Dead on a close under $524.49.',
    edge: '⭐⭐ META is the exact INVERSE of every semi here: they are stretched-and-rolling on the long frame (monthly Stoch 89.59 / 89.22 / 89.08 / 87.71) with healthy weeklies, while META has monthly Stoch 33.47 and RSI 47.38 — BY FAR the least stretched long frame on the board — on a genuinely broken weekly: ⚠️ weekly MACD −13.36 is the MOST negative on the board — not the only one (CRWV −4.62, ASTS −4.40, IREN −1.15 are too, and all are shorts). META has already taken the correction the semis have not started, which makes it the board’s one real diversifier rather than just a weak chart. ⚠️ Near-term damage is still the worst here: daily RSI 37.83 is the LOWEST of any name (under INTC’s 39.94), Stoch 10.35 the most oversold, OBV −88.6m, below EVERY daily MA (9d $587.25 / 50d $606.99 / 200-EMA $629.35, 13% overhead); above the 200-week ≈$516.42 and BB lower $544.31, so the floor is real. Two lines, now tight: under $524.49 the shelf breaks (short candidate), over $562 the $594–609 gap-fill becomes an evaluable long — price is $5.29 away. Original read: the anti-cohort chart — gapped −7.95% on the capex print MSFT got celebrated for, wrecked structure (below the 9d $594.88 / 50d $609.04 / 200d $629.63, daily RSI 32.1) — against one good bull fact: the two-year shelf HELD, $524.49 bought back to a close at the day’s high $539.03 with overnight +1.62% and the 1H basing; a prove-it chart between two lines — under $524.49 the shelf breaks (short candidate), acceptance over $562 opens the $586/$594–609 gap-fill evaluation; between them, no trade',
    lead: { rank: 1, status: 'live', entry: 'filled $535', stop: '$515 (close)', targets: '$609 → $629 → $645', rr: '~5.5:1', edge: '⭐ FILLED at $535 near the low of the two-year shelf, +10.3% unrealised — the best-placed position on this board, and the card’s own trigger fired on top of it: “acceptance OVER $562” held on the close at $590.24, 5.0% through the line, with the high $597.52 reaching INTO the $594–609 gap-fill objective and closing below it. T1 $609 is NOT tagged — the high missed it by $11.48. ⚠️ STOP CORRECTED: this card carried $556 as a close-stop, which sat $21 ABOVE the actual $535 fill — a stop above the entry is not a stop. It moves to a close under $515, beneath both the $524.49 two-year-shelf line (the first warning) and the 200-week EMA ≈$516.42 (where the break is confirmed). ⭐ Why it ranks first: META is the board’s one genuine diversifier and today proved it rather than argued it — +6.02% while the semi heavyweights averaged +1.00% and SMH did +0.91%. Monthly Stoch 18.05 and RSI 50.60 mean it has already taken the correction the semis have not started. Formally exempt from the SMH gate as a non-semi. ⚠️ Structure above is still damaged: the 50-EMA $606.34 and 200-EMA $628.87 are 2.7% and 6.5% overhead, and the frames that flatter it most — weekly hist +0.21, monthly −24.95 contracting — sit on ONE-DAY bars, since Monday opens both. Stop a close under $515, targets $609 → $629 → $645.' },
    side: 'long', accent: 'blue',
    date: '2026-08-03',
    story: 'stories/meta.html',
  },
  // ── 2026-07-30 (pre-market) ── TSLA ADDED off the ranked board (long
  // watch, per the MRVL precedent — a knife-catch stays a watch until the
  // reclaim confirms): a ≈ −24% six-session waterfall through the daily
  // 200-EMA landed exactly ON the 200-week EMA ≈ $299 (close $298.32,
  // PM $298.72) under BOTH lower Bollinger bands — no fresh short into the
  // hole at a multi-year rail; accumulation zone $290–300 scaled, stop
  // <$283, bottom confirms on a reclaim $310 → $332; a weekly close <$285
  // breaks the rail → the 2025 base ≈ $215.
  {
    symbol: 'TSLA', exchange: 'NASDAQ',
    price: '$321.55', change: '📅 CLOSE $321.55 (−1.77%) — +4.7% unrealised from the $307 fill · pulled back from Tuesday’s T1 miss, still inside the $324–330 supply zone from below now · stop $297 has 8.2% of cushion',
    signal: '📅 CLOSE 08/05 — GAVE BACK THE MISS, THE SUPPLY ZONE HELD FROM ABOVE: closed $321.55 (−1.77%), back under the $324–330 supply after Tuesday’s 43-cent miss of T1 $330 — the zone doing what supply is supposed to do. Position +4.7% unrealised from the $307 fill; stop $297 (close) keeps 8.2% of cushion, comfortably outside ATR noise. Weekly hist −9.99 still deepening — the board’s weakest weekly among live longs. Plan unchanged: stop $297, targets $330 → $350 → $365.',
    lead: { rank: 3, status: 'live', entry: 'filled $307', stop: '$297 (close)', targets: '$330 → $350 → $365', rr: '~6:1', edge: '🔄 FLIPPED SHORT → LONG and FILLED at $307, +4.9% unrealised. Not a change of opinion: this card’s ORIGINAL plan was a long watch whose stated bottom-confirm was a reclaim of $310, and that printed — while the short that replaced it never traded, since its $330–338 zone was never reached (high $324.65). Unfilled, zero realised. 📐 Levels taken from the house structure board rather than re-invented: supply $324–330 (tested, immediate) → $350–365 (secondary) → $380–405 (major); demand $297–312 (immediate, and the $307 fill sits inside it) → $282–286. ⚠️ Two things that cut against optimism: the $324.65 high is the BOTTOM EDGE of the first supply zone, so the obstacle is here rather than overhead — and there is NO zone at $370, which falls in the gap between the secondary top $365 and the major base $380, the board’s own reversal threshold ($365–387). $365 is the ceiling for this leg. 📐 The structure board classifies it as “a bounce trade only — countertrend until TSLA recovers $365–387” and still files TSLA under trend-following shorts. That is a fact about the trade’s TYPE rather than an objection — countertrend is an accepted mode here — and it is what sets the ladder: a bounce is measured to the next supply zone, $350–365. ⚠️ Daily RSI 36.83 is the weakest of any long here and price closed just under the 9-EMA $324.12 with the 50/200-EMAs 16–21% overhead. ⭐ For it: the least-stretched monthly on the board (Stoch 32.79 vs the semis’ 70–87), the 200-week rail held, and a genuinely non-cohort +3.49% — formally exempt from the SMH gate. Stop a close under $297, targets $330 → $350 → $365.' },
    side: 'long', accent: 'red',
    date: '2026-08-05',
    story: 'stories/tsla.html',
  },
  {
    symbol: 'CRWV', exchange: 'NASDAQ',
    price: '$89.89', change: '📅 CLOSE $89.89 (−2.19%) — ⚡ THE REJECTION PRINTED: tagged $94.15, deepest push into the $88–97 zone yet, then reversed to close near the session low, down on the day → status LIVE',
    signal: '📅 CLOSE 08/05 — ⚡ LIVE: THE REJECTION PRINTED. Closed $89.89 (−2.19%) after the deepest push into $88–97 yet (high $94.15) reversed to a close 11 cents off the session low — the reversal candle this card withheld status for, unlike Tuesday’s up-day acceptance. Fade confirmed: stop a close over $100, dead on a daily close over $97 (the high stays 3% under that line). ⚠️ Drop-override half met: SMH is through its gate, but CRWV is nowhere near reclaiming $97 — watch it, don’t assume it. Targets $70 → $65 → $60.55.',
    lead: { rank: 21, status: 'live', entry: 'fade the rejection in $88–97', stop: '$100 (dead >$97 close)', targets: '$70 → $65 → $60.55', rr: '~4:1', edge: '⚡ LIVE: the rejection printed. High $94.15 (deepest push into $88–97 yet) reversed to a close of $89.89 (−2.19%), 11 cents off the session low — a same-session reversal after Tuesday’s up-close inside the zone was correctly read as acceptance, not a fade. Still unfilled until a confirmed entry fill is logged; the $97 dead-line stays 3% away.' },
    side: 'short', accent: 'cyan',
    date: '2026-08-05', alert: true,
    story: 'stories/crwv.html',
  },
  {
    symbol: 'LITE', exchange: 'NASDAQ',
    price: '$882.17', change: '🕐 PRE-MARKET 04/08 07:35 ET +13.11% → $882.17 — ⚠️ ALL THREE TARGETS OF THE UNRANKED LONG ARE NOW EXCEEDED ($748 · $796 · $869) AND NOTHING WAS FILLED: zero realised, which is what the weekly-filter demotion cost · STILL unranked, now for a different reason — there is no entry here · 08-03 close was $779.89 (+9.24%)',
    signal: '📅 CLOSE — UNRANKED, AND NOW BECAUSE THERE IS NO ENTRY. The weekly-filter demotion cost the whole $748 → $796 → $869 ladder — pre-market $882.17 ran through all three with no lead, so realised is ZERO by the house rule, recorded in prose. Buying 22% above the old $714–721 zone is chasing; a long returns on a controlled retest with a 4H higher low, at a zone drawn from a completed frame. Weekly RSI closed 53.83 over the return line, but on a Monday-only bar — the verdict waits for Friday’s weekly close. Closed $779.89; the 50-EMA $792.51 is overhead and monthly RSI 76.06 caps size if it returns. The dormant parabola short sits ~40% below its trigger.',
    edge: '⚠️⚠️ THE DEMOTION COST THE WHOLE MOVE — this card’s ladder was $748 → $796 → $869 and pre-market $882.17 is through ALL THREE, with nothing filled because LITE was unranked. ZERO realised. A target traded on an unfilled plan is not realised and must not be tagged; there is no plan here at all, so it goes in prose, as the four gated T1s of 08-03 did. ⚖️ Two separate questions, kept separate: the PROCESS was right by its own terms and still is — a weekly RSI on a Monday-only bar is that session relabelled, and the cross had not narrowed (−36.50 at 67.7% vs −40.57 at 68.8%). The OUTCOME cost the entire ladder. The filter is not loosened because one instance went against it, and the cost is not hidden either; a PATTERN of unranked names clearing their ladders would justify revisiting it, and one case is not a pattern. 🔻 Still unranked, now for a DIFFERENT reason: not “no weekly confirmation” but NO ENTRY. $882.17 is 13.1% above the 08-03 close, above the 1H 9-EMA $817.05, the 200-EMA ≈$753 and the lower band $666.83, and 22% above the top of its own $714–721 zone. The trade was available and was not taken — it is not available now. A long returns on a controlled retest with a 4H higher low at a zone drawn from a completed frame. 1H RSI 88.76, Stoch 93.41, MACD 25.52. ⭐ The dormant parabola-unwind short is further from arming than ever: it needs a daily close under ≈$630–632, ~40% below price. ⚠️ Pills only — the legend was parked on an older bar (C 706.17, V 0) and read RSI 52.97 against an actual 88.76; the 1,579.85 / 419.45 pills are the documented render artifacts and are ignored. 1H OBV ≈−2.66m is an 08-03 reading: pre-market bars are V:0.',
    side: 'long',
    date: '2026-08-04',
    story: 'stories/lite.html',
  },
  {
    symbol: 'NVDA', exchange: 'NASDAQ',
    price: '$219.22', change: '📅 CLOSE $219.22 (+3.43%) — high $222.22 came within 78 cents of T3 $223, still untagged, still unfilled: the $197–200 zone was never reached (L $216.40), now 8.2% below price',
    signal: '📅 CLOSE 08/05 — WITHIN A DOLLAR OF T3, NOTHING TO SHOW: closed $219.22 (+3.43%), the high missed T3 $223 by 78 cents — a third session running through this plan’s targets with the entry never filled. The $197–200 zone is 8.2% below the low. Cleanest structure on the board — above every daily MA — but the weekly cross is FRAGILE at 4.2% of MACD, one bar from un-crossing: watch, don’t act. ⚠️ The gate has cleared (SMH over $547–550 two sessions), so only the zone blocks a fill. Plan unchanged: pullback holds $197–200, stop a close under $191.86, targets $207 → $211 → $223.',
    lead: { rank: 5, status: 'wait', entry: 'pullback holds $197–200', stop: '$191.86 (close)', targets: '$207 → $211 → $223', rr: '~4:1', edge: '⚠️ THE CLEANEST EXECUTION ON THE BOARD, AND IT PAID NOTHING. NVDA opened $197.73 INSIDE the $197–200 zone, undercut it by fifteen cents to $196.85, and ran +5.6% to $207.86 straight through T1 $207 and the converged 9/50-day at $206.7–206.9 that was called the decision — with the $191.86 stop never within $5. Unfilled: SMH is $545.11 and the $547–550 close is $1.89 away. ⭐ Structure is the best here and improved — daily RSI 53.95 back over the midline, Stoch %K 45.97 over %D 26.99 with room, histogram contracting, and price above the 9-EMA $201.43, 50-EMA $203.61 AND 200-EMA $191.69, which no other long on this board can claim. ⚠️ Its weekly flag sits on a one-day bar (Monday opens the week), so read the hist −0.98 as carried forward from Friday. Plan unchanged: pullback holds $197–200, stop a close under $191.86, targets $207 → $211 → $223.' },
    side: 'long', accent: 'red',
    date: '2026-08-05',
    story: 'stories/nvda.html',
  },
  {
    symbol: 'COHR', exchange: 'NYSE',
    price: '$341.00', change: '🕐 PRE-MARKET 04/08 07:35 ET +18.27% → $341.00 — ⛔ THE $294–313 ZONE WAS RUN THROUGH AND THE $321 KILL LINE SITS 6.2% BELOW PRICE: unfilled, zero realised · 🔻 UNRANKED — nothing overhead on the 1H to anchor a new zone to · 08-03 close was $288.14 (+9.60%)',
    signal: '📅 CLOSE — ⛔ UNRANKED: the $294–313 fade was RUN THROUGH ($341 pre-market, 8.9% above the zone top) and the $321 kill line sits BELOW price — void in substance, unfilled, zero realised. ⭐ The raise from $252–266 was still right: the old kill would have fired 10% below where the fade set up, and selling the old zone would be ≈35% underwater. Rule A forbids a third zone drawn at this print, and the 1H offers nothing overhead to anchor to — it returns on a rejection at a level read off a completed daily or weekly frame. The short case survives: under the 50-EMA $319.52, weekly hist −17.02.',
    edge: '⛔ UNRANKED — THE $294–313 ZONE WAS RUN THROUGH AND THE $321 KILL LINE IS 6.2% BELOW PRICE: pre-market $341.00 sits 8.9% above the zone top, so the entry is void in substance (formally the kill still wants a daily close over $321, and at 07:35 ET there is none). Unfilled, ZERO realised, on a +29.7% two-session move off the $262.90 close of 07-31. ⭐ Both halves of the record: the zone-raise from $252–266 to $294–313 was RIGHT and saved the trade — the old zone would have filled on 08-03 and be ≈35% underwater now. It cost the fill and saved the loss. 🔻 Why not raise it again: that would be drawing a level at a memory of one bar, which Rule A forbids, and the 1H has nothing to anchor to — price is above the upper band $327.39, with the 9-EMA $306.29, the 200-EMA ≈$282 and the lower band $242.66 all beneath it. Returns on a rejection at a level from a completed daily or weekly frame. ⚠️ Individual failure, as required: the 1H 200-EMA was reclaimed on the 08-03 CLOSE and price is ~21% above it. 1H RSI 89.91, Stoch 89.21, MACD 10.34 — the most extended of the three optical names. ⚠️ This chart had the worst legend miss of the three: parked on an older bar (C 261.00, V 0) it read Stoch 15.06 against an actual 89.21 — a 69-point miss — and RSI 55.96 against 89.91. Pills only. 1H OBV ≈30.0m is an 08-03 reading, not confirmation: pre-market bars are V:0.',
    side: 'short', accent: 'violet',
    date: '2026-08-04',
    story: 'stories/cohr.html',
  },
  {
    symbol: 'IREN', exchange: 'NASDAQ',
    price: '$38.89', change: '📅 CLOSE $38.89 (−4.80%) — ⚡ THE REJECTION PRINTED: ran $41.16 into $40.8–44, reversed to close AT THE SESSION LOW, 4.7% under the zone floor → the daily close is already under the $40 confirmation line → status LIVE',
    signal: '📅 CLOSE 08/05 — ⚡ LIVE: TAGGED THE ZONE, REVERSED, CLOSED UNDER THE LINE. Closed $38.89 (−4.80%) at the session low after the high $41.16 ran into the $40.80–44 fade zone a second time — a genuine rejection, 4.7% under the zone floor and through the $40 confirmation line. Stop $45.50 (dead on a close over $44) keeps 17% of cushion above the high. ⚠️ Drop-override half met: SMH cleared its gate, but IREN closed nowhere near $44, so the override stands untriggered. Targets $35 → $32 → $28.93.',
    lead: { rank: 20, status: 'live', entry: 'fade the rejection in $40.8–44', stop: '$45.50 (dead >$44 close)', targets: '$35 → $32 → $28.93', rr: '~4:1', edge: '⚡ LIVE: the rejection printed. High $41.16 tagged the zone, reversed to a close of $38.89 (−4.80%) AT the session low, 4.7% under the zone floor — already through the $40 confirmation line on a daily basis, the strongest version of this rejection the card has seen versus Tuesday’s up-close give-back. Stop $45.50 has 17% of cushion above today’s high.' },
    side: 'short', accent: 'red',
    date: '2026-08-05', alert: true,
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
  //
  // ── 2026-07-29 (close) ── the barometer BROKE the bounce: SMH closed
  // $504.22, UNDER the $505.66 sweep low (AH $500.30) — the intraday
  // undercut-and-reclaim failed, bounce thesis off, map extends to the
  // 0.618 $478 → 50-week $431. MU −9.94% pressed T2 $714 after hours
  // ($718.38); SNDK broke $1,000 AH ($991.69) toward the daily 200-EMA
  // ≈ $958. NBIS −12.65% cleared T1 $160 + the 200-day in one session,
  // AH $147.06 right on T2 $147; COHR −8.75% pressing the LAST target
  // T3 $215 (AH $218.01). TER earnings verdict RESOLVED — the +13% AH pop
  // sold off from the open, close $319.41 back under $326/$346: short
  // re-armed toward T1 $308 (stop $358 never hit on a daily close).
  // GLW (booked) dead-cat stalling under $128–137, close $124.05.
  // AAOI −13.18% smashed T2 $82 (close $76.52, AH $74.66, ≈ +32%) —
  // last target 🕳️ $58. BE (booked) post-beat squeeze faded too:
  // close $163.75, back under T3 $170 (AH $159.24). LITE trigger FIRED —
  // first daily close under the 200-day of the run ($602.35 < $610),
  // short filled at the break. ALAB tagged T3 $250 to the dollar
  // ($249.74) — ALL targets banked ≈ +19%, trailing to the 200-EMA $231.
  // MRVL (long watch) knifed through the $172–178 starter zone to the
  // door of the main $150–160 load (AH $160.60). IREN −13.62% smashed
  // T2 $30 (close $29.31, ≈ +25%), last target $27. WDC's AH bounce died
  // at the 1H 50-EMA — close $462.04, AH $454.16 probing UNDER the
  // $455–461 magnet; $450 the extension line. DRAM broke the $47.5–48.5
  // cluster (close $44.85 < the $47 major-failure line) → $42–44 →
  // washout $38.5–40. Ranks unchanged.
  //
  // ── 2026-07-29 (AH) ── SMH flushed to $483.32 after hours — effectively
  // tagging the 0.618 $478 — and snapped back to $500.07: the barometer's
  // FULL map has paid ($547–550 → $535 → $510–518 → ≈$478–483). Bounce-watch
  // re-armed, session confirmation pending: hold $500 + reclaim $505.66–510
  // = bounce mode; a daily close <$483.32 breaks the fib → 50-week $431.
  // Board stance: bank/trail at the majors, no fresh shorts into the hole.
  // STX — the third beat of the week to fade: sold from $823.73 to a
  // $764.43 close, back UNDER the $770 re-arm line (AH $754.91) → fade
  // re-arming toward $700, chop risk (green day, real beat). AMAT −8.40%
  // cut THROUGH the weekly 50-EMA zone $455–466 in one session (close
  // $436.45, AH $441.01) — first weekly-frame damage; fast reclaim =
  // washout low, failed reclaim = weekly downtrend.
  //
  // ── 2026-07-29 ── CRWV ADDED at rank 13 (last active row, per the TER
  // precedent: earnings contingency = bottom of the board): the AI-cloud
  // pure play broke the 2026 range floor (−9.63% to $60.82, under the
  // weekly lower band) with META's capex print TONIGHT as the binary —
  // status 'wait' (fade $65–74 / break <$59.6, only post-META). Booked
  // ranks shifted: GLW 13→14, BE 14→15. Ranked table now 1–13.
  // ASTS (off-board) CONFIRMED: decisive close under $56 ($53.03, −6.22%,
  // AH $52.05) — map $50 → $45 → 🕳️ $41, add zone $54–56.5.
  // NVDA trigger FILLED: broke $194, flushed $183.66 through T1 $189
  // (the 200-day) and was bought back to $190.01 — the leader's own
  // undercut-and-reclaim, mirroring SMH's 0.618 tag; $189/$194 tomorrow
  // is the group's bounce tell. DELL (off-board): the defended $368 low
  // broke in AH ($364.00) after a $369.64 close through T1 $377 — chop
  // resolved down, next 🕳️ $330 on a confirmed close under $368.
  //
  // ── Re-rated 2026-07-29 (close) ── ranks now order by REMAINING
  // POTENTIAL: % left from the current price to the deepest mapped
  // target (freshness breaks near-ties). Names at/through their final
  // targets sink to the bottom regardless of how much they've paid.
  //   1 CRWV −34% to $40  (−19% to T1 $49.4 · wait, META binary tonight)
  //   2 MU   −32% to $505 (T2 $714 at hand — the 50-day decides the rest)
  //   3 LITE −30% to $419 (break confirmed today, filled)
  //   4 AAOI −24% to $58
  //   5 SNDK −13% to $880 ($958 en route)
  //   6 TER  −12% to $280 (re-armed today, full plan remaining)
  //   7 NBIS −12% to $130
  //   8 NVDA −8% to $174 (200-day undercut-reclaim = verdict pending)
  //   9 IREN −8% to $27
  //  10 COHR −3% to $215 · 11 WDC −2% (all banked) · 12 CRDO −1% (AH at
  //     T3) · 13 ALAB ~0% (T3 tagged to the dollar — runner to $231)
  //  14 GLW · 15 BE (booked, in the strip).
  //
  // ── Re-rated 2026-07-30 (~2:30 ET) ── the morning note held ranks because
  // the squeeze inflates losers' "remaining potential"; with 21/25 cards now
  // same-day the ranks are re-cut by the standing rule PLUS one extension the
  // rule already implies: DEAD setups sink regardless of arithmetic potential
  // (same spirit as "names at/through their final targets sink"). A stopped
  // short (LITE, ⛔ −9% realized) and a called-over trade (IREN, runner dead)
  // cannot be the board's #3 and #9 "sharpest trades" on the strength of
  // distance to targets their own cards call dormant.
  //   1 CRWV −46% to $40 (wait · trigger live at the fade zone)
  //   2 MU   −42% to $505 (card says bank; rank ranks the map, text governs action)
  //   3 AAOI −35% to $58 · 4 NBIS −31% to $130 · 5 SNDK −30% to $880
  //   6 COHR −13% to $215 · 7 CRDO −11% to $175 · 8 NVDA −10% to $174 (control group)
  //   9 IREN (over — win taken) · 10 LITE (⛔ stopped — the loss stays visible)
  //  11–14 booked in the strip: WDC, ALAB, GLW, BE.
  // ───────────────────────────────────────────────────────────────────────────
  {
    symbol: 'DRAM', exchange: 'CBOE',
    price: '$51.11', change: '📅 CLOSE $51.11 (+1.47%) — the $52.60 confirmation this card requires was missed by $1.49 (H $51.57) · ⭐ the cohort tell inverted on the close, and the inversion held',
    signal: '📅 CLOSE — NOTHING TRIGGERED, AND FRIDAY’S COHORT SPLIT INVERTED IN ONE SESSION: the HELD names (WDC −3.23%, STX −2.93%) were the board’s only decliners while every BREAKER closed green — a partition that reverses on the next bar was a one-day fact, and the ranks resting on it come down. Entry stays confirmation-only: no long until a daily CLOSE over $52.60, missed by $1.49, the 9-EMA $51.84 also overhead. Unranked on the standing limits: DRAM cannot be trend-confirmed (weekly MACD cannot compute, monthly frame empty), and its OBV sign is a start-point artifact rather than a signal.',
    edge: '🕐 13:55 ET — ⭐ THE TELL INVERTED, WHICH IS THE POINT OF WATCHING IT: Friday DRAM closed on its low while both HDD names closed green, and that was read as proof of a DRAM/NAND re-rating. Today DRAM is +1.59% at its session high with SNDK +7.13% and MU +0.85% green, while WDC −2.74% and STX −3.13% are the board’s only decliners — the exact reverse. Watch it to read the group; the conclusion drawn from one session was the fragile part. Still unranked and still unconfirmable: the entry needs a daily CLOSE over $52.60 and price is 2.8% under it. 📅 UNRANKED — DRAM cannot be trend-confirmed AT ALL, which on this board is disqualifying rather than merely inconvenient. The weekly is the confirmation layer, and DRAM’s weekly MACD literally cannot compute — “not enough data”, because the ETF launched recently — while its weekly RSI(14) is barely seeded. There is no frame available to confirm or deny a trend, so a ranked row would imply a conviction the data cannot support. Only the DAILY frame is usable here, and no multi-frame language belongs on this card. ⛔ The plan was also invalidated on the session: the stop was “a daily close back under $51.55” and DRAM closed $50.37, gapping to $54.70, running $55.45 and collapsing to close ELEVEN CENTS off the low on a 10.3% range. The gate meant nothing filled (SMH $540.53 under $547–550), so the loss was zero. Entry is confirmation-only and sits +4.4% ABOVE price: no long until a daily CLOSE back over $52.60, stop a close under $48, targets $56 → $61 → $68. ⭐ WHY IT STAYS ON THE BOARD WITH NO POSITION — the same reason BE does. DRAM is the cohort’s TELL: it holds MU and SNDK alongside WDC and STX, and it still closed on its LOW while both HDD names closed GREEN. That single fact is the cleanest proof the session was a DRAM/NAND re-rating rather than sector risk-off, and no individual card can show it. Watch it to read the group; trade the names. ⚠️ One recurring caveat: OBV’s negative sign here is a start-point artifact, NOT a signal — only its direction carries meaning, and that direction is rolling over off the June peak.',
    side: 'long', accent: 'indigo',
    date: '2026-08-03',
    story: 'stories/dram.html',
  },
  {
    symbol: 'AAOI', exchange: 'NASDAQ',
    price: '$131.30', change: '🕐 PRE-MARKET 04/08 07:33 ET +19.14% → $131.30 — ⛔ THE $119–127 ZONE WAS RUN THROUGH, NOT REJECTED FROM: price is 3.4% above its top · unfilled, zero realised · 🔻 UNRANKED — Rule A cannot draw a third zone, nothing is overhead on the 1H · 08-03 close was $110.21 (+16.85%)',
    signal: '📅 CLOSE — ⛔ DEAD AND UNRANKED. The short closed 8.0% above its $102 kill line ($110.21, +16.85%), unfilled — Friday’s $92 confirmation never printed, so realised is ZERO on a +39.2% two-session move. The zone was re-drawn twice ($101–102, then $119–127) and blown through twice; Rule A forbids a third drawn at the print and the 1H has no reference overhead — so no zone and no ranked row, at the stated cost that a working fade will not be scored. The individual failure: the 1H 200-EMA reclaimed on the 08-03 CLOSE, price roughly 30% above it. Weekly hist −11.05 is still the deepest cross here. Returns only on a rejection off a completed daily or weekly level.',
    edge: '⛔ UNRANKED — THE $119–127 ZONE WAS RUN THROUGH, NOT REJECTED FROM: pre-market $131.30 is 3.4% above its top, so there is no resistance beneath price to fade and the entry as written is VOID. Unfilled, so the realised result is ZERO rather than a loss, on a +39.2% two-session move off the $94.32 close of 07-31. Neither exit line has formally printed — the kill needs a daily close over $127, the $134 stop is 2.1% overhead — but that is bookkeeping, not a reason to hold the plan. 🔻 Why no third zone: Rule A wants at least two independent structural references, and on the 1H there are NONE overhead — the 9-EMA $118.27, the 200-EMA ≈$101 and the lower band $84.54 are all BELOW price. Re-drawing at the print is the exact error the rule exists to prevent, so the plan leaves the table instead of being re-priced. It returns on a rejection at a level read off a completed daily or weekly frame. ⚠️ The individual failure that kills it, as required: AAOI reclaimed its 1H 200-EMA on the 08-03 CLOSE and trades ~30% above it — a level reclaimed on a close, not a cohort excuse. 1H RSI 88.09, Stoch 93.88, MACD 5.60 rising. ⚠️ Read off the right-axis pills only: the chart legend was parked on an older bar (C 116.94, V 0, high $118.20 BELOW the live print) so the whole row was discarded — its RSI said 82.66 against an actual 88.09. And 1H OBV ≈269k is NOT evidence of absent demand: pre-market bars are V:0, so OBV cannot move on them. ⚠️ The news catalyst is reported, not verified.',
    side: 'short', accent: 'violet',
    date: '2026-08-04',
    story: 'stories/aaoi.html',
  },
  {
    symbol: 'WDC', exchange: 'NASDAQ',
    price: '$519.17', change: '📅 CLOSE $519.17 (−5.36%) — then 🌙 EARNINGS AH $466.99 (−10.05%, 5:05pm ET) — NOT a close, but it sits 6.8% BELOW the $501.27 stop and 9.4% under the $515–530 fill zone · ⚠️ STOP THREATENED, not yet breached on a close',
    signal: '📅 CLOSE 08/05 + 🌙 AH EARNINGS — ⚠️ THE STOP IS THREATENED, AND THE REASON IS GUIDANCE-PROOF SELLING: closed $519.17 (−5.36%), then beat on EPS and revenue with above-consensus guidance — and sold anyway to $466.99 after hours (−10.05%), 6.8% BELOW the $501.27 close-basis stop and 9.4% under the $515–530 zone this long was filled from at $527. An after-hours quote is not a close: whether the stop is actually violated is UNKNOWN until the next real print. A threat to flag loudly, not a breach to record — nothing on the ledger changes until that close.',
    lead: { rank: 12, status: 'live', entry: 'filled $527', stop: '$501.27 (close)', targets: '$560 → $585 → $613', rr: '~4:1', edge: '⚠️ STOP THREATENED BY EARNINGS AH, NOT YET BREACHED: closed $519.17 (−5.36%), then beat on EPS/revenue and guided ABOVE consensus, and sold off anyway to $466.99 after hours (−10.05%, 5:05pm ET) — 6.8% below the $501.27 stop and 9.4% under the $527 fill. An AH quote is not a close, so the stop is unconfirmed until the next real print, but a position that was +4.05% at today’s close is one bad close away from a loss under the fill.' },
    side: 'long',
    date: '2026-08-05', alert: true,
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$101.06', change: '📅 CLOSE $101.06 (+0.20%) — ⚠️ THE $102 DEAD-LINE TRADED THROUGH INTRADAY (H $102.83) and closed back under it by 94 cents · status stays WAIT — the $89 confirmation never printed, so this was never filled, geometry inside the zone notwithstanding',
    signal: '📅 CLOSE 08/05 — ONE SESSION FROM DEAD, STATUS STAYS WAIT: closed $101.06 (+0.20%) after the high $102.83 traded through the $102 kill line intraday, closing 94 cents back under it. This is a rejection-only short whose written confirmation is a close under $89 — never printed — so geometry inside $96–102 is not a fill: unfilled, zero realised. Momentum now works against it: the daily histogram +0.92 just turned positive. ⚠️ Override half met: SMH cleared its gate two sessions running, and this is the closest any gated short sits to its own half — one more session near $102 ends it outright, unfilled.',
    lead: { rank: 17, status: 'wait', entry: 'rejection printed in $96–102', stop: '$104 (dead >$102 close)', targets: '$85 → $80 → $75 → $66', rr: '~6:1', edge: '⚠️ STATUS STAYS WAIT, DESPITE THE GEOMETRY: closed $101.06 (+0.20%) after the high $102.83 traded straight through the $102 kill-line intraday, closing back under it by 94 cents. The audit’s "price inside the zone → live" heuristic doesn’t apply here — this is a rejection-only short needing a confirmed close under $89, which has never printed — so it stays unfilled, zero realised, one ordinary session from being killed outright.' },
    side: 'short', accent: 'blue',
    date: '2026-08-05', alert: true,
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$893.19', change: '📅 CLOSE $893.19 (+0.06%) — second consecutive close over both deciders: the $834.93 return line AND the $892 9-EMA confirmation (892.67 → 893.19) · SMH gate cleared twice too (575.71 → 569.70) · promoted back to the ranked board, $800–823 retest zone still 8.5% below price, unfilled',
    signal: '📅 CLOSE 08/05 — BACK ON THE BOARD, ON TWO-SESSION CONFIRMATION: MU has now closed over its $834.93 return line on back-to-back sessions, and over the $892 9-EMA confirmation level both times too (892.67 → 893.19) — this is not a single-bar fluke. The SMH gate cleared twice in the same stretch (575.71 → 569.70), removing the earlier objection that nothing here would have filled. The re-drawn retest zone $800–823 has not traded since the plan was written; it sits 8.5% below the current print, still unfilled, zero realised. Promoted back to the ranked board on that two-session evidence — the plan waits for the pullback, not the breakout.',
    lead: { rank: 19, status: 'wait', entry: 'pullback holds $800–823', stop: '$778 (close)', targets: '$892 → $930 → $996–1,000', rr: '~5.6:1', edge: '⭐ PROMOTED ON TWO-SESSION CONFIRMATION, NOT ONE CLOSE: MU closed over both deciders back-to-back — the $834.93 return line and the $892 9-EMA confirmation (892.67 → 893.19) — with the SMH gate clearing twice alongside it (575.71 → 569.70). The re-drawn retest zone $800–823 has not traded since the plan was written; it sits 8.5% below the current print, unfilled, zero realised. Re-entry plan: pullback holds $800–823, stop a daily close under $778, targets $892 → $930 → $996–1,000, R:R ≈ 5.6:1.' },
    side: 'long', accent: 'cyan',
    date: '2026-08-05',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$389.39', change: '📅 CLOSE $389.39 (−3.51%) — gave back part of Tuesday’s T1/T2 run, still +6.4% off the $366 fill, T2 $403 stays tagged as the deepest realised target · stop $349 has 11.6% of cushion',
    signal: '📅 CLOSE 08/05 — NORMAL GIVE-BACK, THE TAG STANDS. TER closed $389.39 (−3.51%), O $402.47 · H $409.40 · L $386.08 — a pullback off Tuesday’s T1/T2 session, still +6.4% unrealised from the $366 fill. T2 $403 remains the deepest tagged target; T3 $419 was not threatened (high $409.40). Stop $349 (close) has 11.6% of cushion, comfortably outside today’s range. Daily RSI 54.78, Stoch %K 83.00/%D 80.09 — still elevated after the run, MACD histogram +6.94 and expanding for a fourth bar, so the daily uptrend is intact through the pullback. Plan unchanged: stop $349, T3 $419 next.',
    lead: { rank: 14, status: 'live', entry: 'filled $366', stop: '$349 (close)', targets: '$390 → $403 → $419', rr: '~3:1', tagged: '$403', edge: '📅 CLOSED $403.56 (+10.32%), up 10.4% off the $366 fill — T1 $390 and T2 $403 both TRADED today (H $409.72), so T2 is tagged as the deepest realised target. `entry` corrected from a zone description to a filled price for progress/ledger accuracy. Stop $349 has 13.5% of cushion, T3 $419 is next.' },
    side: 'long', accent: 'blue',
    date: '2026-08-05',
    story: 'stories/ter.html',
  },
  {
    symbol: 'GLW', exchange: 'NYSE',
    price: '$146.66', change: '📅 CLOSE $146.66 (+6.08%) — ✅ THE $144 CLOSE THAT FLIPS THIS CARD LONG PRINTED, $2.66 over it · the short is OVER by its own written rule, unfilled, zero realised · now a long WATCH, unranked',
    signal: '📅 CLOSE — ✅ THE RULE FIRED AND THE CARD CHANGES SIDES: a daily close over $144 printed ($146.66), so the short is OVER — unfilled, zero realised — and `side` moves long. The card’s own two-sided evidence (1H OBV climbing while the daily bled) is exactly what resolved it. NOT a ranked long: it fails the same weekly filter that keeps LITE and BE off the table — weekly RSI 47.05 under the midline, the deepest cross of the three. DRAFT PLAN, unranked: the dip that HOLDS $142–147, stop a close under $135, targets $161 → $171 → $185. It earns a row when weekly RSI reclaims 50 on a full week, or price closes over the 50-EMA $170.73.',
    edge: '✅ FLIPPED SHORT → LONG BY ITS OWN RULE, AND UNRANKED BY THIS BOARD’S. The rule was “this card flips long only on a DAILY CLOSE OVER $144”; GLW closed $146.66. The short is over — unfilled, zero realised, since the entry needed a rejection in $141–147 confirmed lower and price went the other way. ⭐ The card beat itself with evidence it had published: it called GLW the board’s most two-sided chart because 1H OBV kept CLIMBING (149M → 157M → 162M) while the daily bled. That is what resolved it. ⚠️ It does NOT become a ranked long, for consistency rather than caution: GLW fails the same weekly filter that keeps LITE and BE out, and fails it hardest — weekly RSI 47.05 under the midline, ESTABLISHED cross at 96.5% of MACD, five bars and EXPANDING. Ranking it while they sit out on better readings would be the board contradicting itself again. ⭐ For the long: closed above the 200-EMA $142.03 and 9-EMA $143.51, daily histogram contracting a third bar. ⚠️ Against: the 50-EMA $170.73 is 16% overhead, daily RSI 42.48 under the midline, and ATR(14) $14.69 is 10.62% of price. Draft plan: dip holds $142–147, stop a close under $135, targets $161 → $171 → $185. It earns a row on a weekly RSI reclaim over a FULL week, or a close over $170.73.',
    side: 'long', accent: 'blue',
    date: '2026-08-03',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,263.86', change: '🌙 AH $1,263.86 (−6.42% from the close, per live quote) on EARNINGS — NOT a close: BELOW the entire $1,287–1,346 zone · would have FILLED on the way down (high $1,441.76 → reversal → AH through the band) · stop $1,360 is a CLOSE-basis stop and today’s actual close $1,350.50 never touched it, so NOT stopped out even though the intraday high cleared it by 6%',
    signal: '🌙 AH ON EARNINGS — A ROUND TRIP THROUGH THE WHOLE ZONE: the session ran a new high $1,441.76, reversed, closed $1,350.50 (−5.40%); the AH print $1,263.86 then cut clean through $1,287–1,346 and out the bottom. Would it have filled — yes, a resting short in the zone fills, most likely on the AH leg. Stopped out — no: the $1,360 stop is written on a CLOSE and the close was $1,350.50, under it; an intraday spike does not trigger a close-basis stop. ⚠️ Flagged, not decided: this zone was declared dead on 08-04, and a rejection from a materially higher level arguably revives it — reusing the band versus drawing a fresh anchored one is the next refresh’s call. Earnings beat, guidance mixed.',
    lead: { rank: 18, status: 'wait', entry: 'fade the rejection in $1,287–1,346', stop: '$1,360 (dead >$1,346 close)', targets: '$1,187 → $1,050 → $1,000', rr: '~7:1', edge: '⛔ STILL DEAD, MARGIN THIN AGAIN: closed $1,350.50 (−5.40%), low $1,345.00 ticked a dollar under the $1,346 dead-line before the close recovered $4.50 back above it — the 08-04 dead call stands, unfilled, zero realised. 🌙 Then earnings AH ~−3% on a beat with mixed guidance; if that holds into the next close, price falls back under $1,346 and whether that revives this thesis or needs a fresh setup is a judgement call for the next refresh, not decided here.' },
    side: 'short', accent: 'red',
    date: '2026-08-05', alert: true,
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$545.46', change: '📅 CLOSE $545.46 (+0.91%) — ⚠️ the gate was REACHED and REJECTED: ran $548.49 INSIDE $547–550 and closed $1.54 under it · undercut $535 to $524.85 and reclaimed it · LAGGING QQQ +1.76% by half',
    signal: '📅 CLOSE — 🚦 THE GATE WAS TESTED AND REJECTED, ONE NOTCH HIGHER: the high $548.49 ran INSIDE the $547–550 band and SMH closed $545.46, $1.54 under — a second consecutive poke-and-fail, but at a higher low, higher high and higher close, converging on the level. $535 was undercut to $524.85 and bought all the way back, so the pivot is proven from both sides. Every ranked entry zone TRADED today; four T1s traded and only DELL’s is TAGGED (filled $406, +4.4%) — the other three were never filled, and a target cannot be realised on a position never entered. Zero longs stopped on a close. 🔓 Non-semis (META, TSLA, NBIS) are gate-exempt by policy; every semi stays gated.',
    edge: '📅 The gate held it off: $540.53 (+0.30%) — the $550.15 overnight faded, $547–550 NOT closed above, so the group downtrend stands and every long on this board stays unfilled; $535 held, so no short re-armed either — undecided, the exact branch the plan named. Higher frames disagree: the MONTH closed red-with-a-wick ABOVE the 9-month EMA ≈$486 (intact uptrend, first corrective month, RSI 69 / Stoch 92.7 still unwinding) while the WEEK closed UNDER the weekly 9-EMA ≈$570 — SMH weaker than QQQ, which held all of its. Vol confirmed hard (VIX 15.82, VXN 25.57 through ≈26); breadth did not (%>200DMA 70.5% → 68.6%). Chop $535–550 until a close resolves it; watch breadth, not vol. 📉 Weekly hist -8.41 (47.63 vs 56.04 signal), 3 bars, 17.7% deep — holding.',
    side: 'long', accent: 'red',
    date: '2026-08-03',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$845.35', change: '📅 CLOSE $845.35 (+1.72%) — 🔄 TRIGGERED: opened $877.55, sold off through the $835–841 zone to $833.97, then closed BACK ABOVE it at $845.35 — a genuine pullback-holds-and-reclaims, not a chase · status corrected wait → live, entry filled $841',
    signal: '📅 CLOSE 08/04 — 🔄 THE ENTRY PRINTED, AND THE MECHANICAL AUDIT CANNOT SEE IT: opened above the $835–841 zone, sold straight through it to $833.97 — a genuine pullback INTO the zone from above — and closed back over its top at $845.35 (+1.72%). That is the written entry, “pullback holds $835–841”, caught by reading the bar rather than the audit, which has no check for a WAIT plan newly triggering. `status` moves wait → live, `entry` becomes filled $841 — the level defended and reclaimed. Stop stays $770 (close), 9.7% below the print.',
    lead: { rank: 13, status: 'live', entry: 'filled $841', stop: '$770 (close)', targets: '$949 → $1,000 → $1,070', rr: '~3:1', edge: '🔄 TRIGGERED TODAY: opened $877.55, sold off through $835–841 to $833.97, closed back above it at $845.35 — a genuine pullback-holds-and-reclaim, not a chase. `status` corrected wait → live, `entry` corrected to a filled price. The mechanical audit cannot see a new WAIT→LIVE trigger, only a LIVE position drifting from its zone, so this needed a manual read of the bar. Stop $770 has 9.7% of cushion.' },
    side: 'long', accent: 'amber',
    date: '2026-08-04',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$68.38', change: '📅 CLOSE $68.38 (−2.74%) — second test of $69–76: ran $70.38 into the zone, closed back below it at $68.38, but mid-range (not at the low) — a give-back, not the clean rejection CRWV/IREN printed today · still unfilled, zero realised',
    signal: '📅 CLOSE 08/05 + 🌙 AH — SECOND TOUCH OF THE ZONE, STILL NO CLEAN REJECTION: the high $70.38 tagged $69–76 for a second session, but the close $68.38 (−2.74%) sits mid-range — a give-back, not the reversal-to-the-low CRWV and IREN printed today. Status stays WAIT, unfilled, zero realised. AH $68.85 sits essentially ON the $69 zone floor — neither a rejection nor a close, so nothing moves. The $80 dead-line stays 17% away, no proximity risk. The bar this entry needs is a genuine rejection; watch the next close against $69.',
    lead: { rank: 23, status: 'wait', entry: 'fade the rejection in $69–76', stop: '$80 (dead >$76 close)', targets: '$56 → $52 → $48.42', rr: '~3:1', edge: '⚠️ SECOND TEST, STILL NO CLEAN REJECTION: high $70.38 tagged the zone again, but the close $68.38 (−2.74%) is mid-range, not near the low — a give-back like CRWV/IREN printed BEFORE their rejections confirmed, not the rejection itself. Unfilled, zero realised, $80 dead-line 17% away.' },
    side: 'short', accent: 'violet',
    date: '2026-08-05',
    story: 'stories/asts.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$218.99', change: '📅 CLOSE $218.99 (−2.99%) — gave back part of Tuesday’s gain, high $228.02 stayed short of the $236 fade-zone floor, still +3.3% off the $212 fill · sitting back near the middle of the card’s own $213–236 no-trade gap',
    signal: '📅 CLOSE 08/05 — BACK TOWARD THE MIDDLE OF ITS OWN NO-TRADE GAP. NBIS closed $218.99 (−2.99%), O $219.95 · H $228.02 · L $214.74 — a pullback from Tuesday’s close, still +3.3% unrealised from the $212 fill and comfortably inside the $213–236 range this card pre-drew as having no edge for either side. High $228.02 approached but stayed under the $236–246 fade zone. Stop $196 (close) has 11.7% of cushion. Daily RSI 53.41, Stoch %K 86.75/%D 74.33, MACD histogram +4.51 and expanding — daily momentum intact through the give-back. Plan unchanged: stop $196, targets $237 → $246 → $262.',
    edge: '📅 UNRANKED, and by this board’s own rule: “names without a clean directional edge simply omit lead”. NBIS sits in no-man’s land between its OWN two triggers — the long needs ACCEPTANCE over $205–208, which is +7.7% away and was never touched (Friday’s high $204.57), while the short needs a close under $180, −5.5% below. Neither is active, so neither is a trade. ⛔ Its stop also broke on the close ($190.41 under $191) — nothing filled, since entry required acceptance that never came, but the plan was invalidated. ⚠️ And the weekly is WORSENING rather than healing: histogram −5.85, three bars negative and EXPANDING, the only bottom-half long where that is true. ⭐ The honest counterpoint, which is why this is a watch and not a short: NBIS never lost the daily 200-EMA $152.73, a full 20% below price, and its weekly RSI 53.67 with a 23.7% cross is actually STRONGER than LITE (49.30 / 68.8%) and BE (49.22 / 61.9%), both of which still rank. Best weekly structure of the bottom longs, worst actionability — and that tension is itself the signal that it is not yet a trade. It returns to the table the moment acceptance over $205–208 prints, or a close under $180 revives the short.',
    lead: { rank: 15, status: 'live', entry: 'filled $212', stop: '$196 (close)', targets: '$237 → $246 → $262', rr: '~4:1', edge: '📅 CLOSED $225.74 (+6.19%), holding inside the card’s own $213–236 no-trade gap, under the $236–246 fade zone — working, not broken. `entry` corrected from a zone description to a filled price. SMH cleared its own $547–550 gate today, so this is no longer the board’s only unblocked setup. Stop $196 has 13.2% of cushion.' },
    side: 'long', accent: 'indigo',
    date: '2026-08-05',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$534.24', change: '📅 CLOSE $534.24 (−2.26%) — pullback, still unfilled: L $530.57 stayed 4.0% above the $500–510 zone, which has not been retested since it was drawn',
    signal: '📅 CLOSE 08/05 — STILL UNFILLED, THE FIRST REAL PULLBACK SINCE THE ZONE WAS DRAWN: closed $534.24 (−2.26%), the low 4.0% above the $500–510 zone — the closest approach yet, still short of a retest. Weekly cross FRAGILE at just 7.9% of MACD, one bar from un-crossing — the shallowest of any ranked long, worth watching for a genuine rollover. ⚠️ The gate confirmed again: SMH above $547–550 a second session, so only the zone still blocks a fill. Plan unchanged: pullback holds $500–510, stop a close under $488, targets $529 → $550 → $590.',
    lead: { rank: 9, status: 'wait', entry: 'pullback holds $500–510', stop: '$488 (close)', targets: '$529 → $550 → $590', rr: '~5:1', edge: '⭐ THE TIDIEST LONG ON THE BOARD TODAY: the $500–510 zone traded, was undercut by $8.32 to $491.68, and recovered +4.6% to $514.43 without the $488 stop ever being touched — the only ranked long that can say both. Unfilled: SMH $545.11, the $547–550 close $1.89 away. ⭐ AMAT is also one of the few names whose Friday cohort placement SURVIVED the session — HELD camp then (+1.18%), green again now (+1.33%) — while the two names ranked above it on that same evidence are today’s worst two, which is why it moves up rather than down. ⚠️ Daily: above the 9-EMA $512.08, under the 50-EMA $527.53, RSI 46.32, histogram contracting a third bar. The weekly cross is FRAGILE at 10.2% of MACD and 2 bars, the second-shallowest here after AMD — but it sits on a one-day weekly bar today. ⚠️ The monthly is stretched (RSI 64.82, Stoch 73.02), so size stays capped. Pullback holds $500–510, stop a close under $488, targets $529 → $550 → $590.' },
    side: 'long', accent: 'red',
    date: '2026-08-05',
    story: 'stories/amat.html',
  },
  {
    symbol: 'BE', exchange: 'NYSE',
    price: '$218.25', change: '📅 CLOSE $218.25 (+6.04%) — ⚠️ weekly RSI 51.06 clears the 50 named, on a ONE-DAY weekly bar; the $232 reclaim was missed by 3.2% (H $224.64) · still unranked, both tests failed on evidence',
    signal: '📅 CLOSE — STILL UNRANKED, AND BOTH RETURN TESTS FAIL ON EVIDENCE: weekly RSI closed 51.06 over the line, but on a Monday-only bar that is today’s +6.04% relabelled; the $232 reclaim was missed by 3.2% (high $224.64). Off the table until Friday’s weekly close or a genuine reclaim. The breadth-tell role stands: BE is power, not semis, and it closed +6.04% while the semi heavyweights averaged +1.00%. Measured: the re-drawn $198–206 entry sits 6% BELOW price, the daily histogram is positive, the 9-EMA $202.81 and 200-EMA $187.07 held. Against: under the 50-EMA $237.98, weekly hist −12.52. Nothing to do here.',
    edge: '🕐 13:55 ET — ⚠️ STILL UNRANKED, ON BOTH TESTS. Weekly RSI reads 51.17, over the 50 named — but Monday opens the week, so that bar holds ONE session and the reading is today’s +6.43% relabelled; and the other condition, a $232 reclaim, was missed by 3.2% (high $224.64). ⭐ The breadth-tell role earned its keep instead: BE is power, not semis, and it is +6.43% while the semi heavyweights sit flat (AVGO +0.09%, LRCX +0.02%, MU +0.85%) — the clearest single statement that today’s move is the beaten-down AI-infra complex, not the group this board trades. 📅 UNRANKED — BE fails the weekly trend filter on both counts AND broke its zone in the same session. Weekly RSI 49.22 is UNDER the midline with an ESTABLISHED cross at 61.9% of MACD, four bars and EXPANDING: no trend confirmation. On the day itself it opened $230.77, ran $235.49 and collapsed to close $205.81 AT ITS LOW — straight through the $213–217 dip zone and finishing just $1.81 above the $204 stop. A card that is failing its trend filter and nearly stopping on the same bar is not one of the board’s sharpest trades. ⭐ What keeps it a long WATCH rather than a short: price still holds above the daily 200-EMA $186.75 — the line whose reclaim was this card’s founding event — it sits +3.1% above its 50% squeeze line at $199.62, and monthly RSI 62.51 says the long frame has bent, not broken. The re-drawn plan stands if it returns: entry holds $198–206 (Friday’s close down to the 9-EMA $198.95), stop a close under $186, targets $232 → $241 → $250. ⭐ The BREADTH-TELL role is unchanged and is why this card stays on the board at all: BE is power, not semis, so it reads whether the AI-infra move is broad or narrowing — worth watching with no position at all. It returns to the table on weekly RSI back over 50, or a reclaim of $232.',
    side: 'long', accent: 'amber',
    date: '2026-08-03',
    story: 'stories/be.html',
  },
  {
    symbol: 'ALAB', exchange: 'NASDAQ',
    price: '$318.43', change: '📅 CLOSE $318.43 (−11.96%) — the board’s worst decliner today, on profit-taking/analyst caution after the earnings rally, NOT a fundamentals miss · low $315.11 stayed 1.6% above the $300–310 zone, still not reached, still unfilled · ⚠️ rank 6 needs re-justification against today’s numbers, not carried forward',
    signal: '📅 CLOSE 08/05 — THE BOARD’S WORST DAY, AND THE ZONE HELD JUST CLEAR OF IT: closed $318.43 (−11.96%), giving back Tuesday’s earnings rally; the low $315.11 stays 1.6% ABOVE the $300–310 band — the closest approach yet, not reached. Status WAIT, unfilled, zero realised. Reads as post-spike profit-taking with the story intact (earnings beat; Scorpio X in volume production ahead of schedule, PCIe 6.0 over 50% of revenue); AH is quiet. ⚠️ The rank was written off rally data, and today is the same one-session signal this board has been burned by twice — it moves nothing by itself, but the old “cohort held” case no longer holds either: re-justify the rank on the next full refresh.',
    lead: { rank: 6, status: 'wait', entry: 'pullback holds $300–310', stop: '$290 (1H close)', targets: '$324 → $340 → $362', rr: '~4:1', edge: '⚠️ WORST DECLINER ON THE BOARD TODAY (−11.96%), RANK CARRIED FORWARD BUT FLAGGED FOR RE-JUSTIFICATION: closed $318.43, giving back Tuesday’s earnings rally on profit-taking/analyst caution, not a fundamentals miss (Scorpio X in volume production ahead of schedule, PCIe 6.0 >50% of revenue). Zone $300–310 still not reached — low $315.11 is 1.6% above it, closest yet — so status stays wait, unfilled, zero realised. The rank-6 case below rests on "cohort held" arguments from 08-03/08-04 that this session did not repeat; re-justify against today’s numbers rather than carrying the old case forward.' },
    side: 'long', accent: 'emerald',
    date: '2026-08-05', alert: true,
    story: 'stories/alab.html',
  },
  {
    symbol: 'CRDO', exchange: 'NASDAQ',
    price: '$224.63', change: '📅 CLOSE $224.63 (−5.59%) — gave back part of Tuesday’s run, high $246.78 still cleared T3 $242 territory, still unfilled: low $223.56 stayed 8.0% above the $200–207 zone',
    signal: '📅 CLOSE 08/05 — PULLBACK, STILL NOTHING TO TAG. CRDO closed $224.63 (−5.59%), O $233.79 · H $246.78 · L $223.56 — a give-back after Tuesday’s T1/T2 clear, with today’s high running even further past T3 $242 territory, but the $200–207 zone remains 8.0% below today’s low and unfilled. Daily RSI 50.34, Stoch %K 75.24/%D 62.10, MACD histogram +1.65 and JUST TURNED positive after a two-bar cross. ⚠️ SMH has cleared its own $547–550 gate for two sessions now (575.71, then 569.70) — this plan is waiting on its own $200–207 zone, not on the gate. Plan unchanged: pullback holds $200–207, stop a close under $192, targets $220 → $228 → $242.',
    lead: { rank: 8, status: 'wait', entry: 'pullback holds $200–207', stop: '$192 (close)', targets: '$220 → $228 → $242', rr: '~3:1', edge: '⭐ THE SECOND-BIGGEST RECOVERY OFF A TRADED ZONE HERE: CRDO opened $201.44 inside $200–207, was undercut to $195.39 — $4.61 under the floor but still $3.39 ABOVE the $192 stop, which was never reached — and ran +10.8% off that low to $216.47, stopping $3.10 short of T1 $220 at its $216.90 high. Unfilled: SMH $545.11, the $547–550 close $1.89 away. ⭐ Structure improved — above the 9-EMA $208.87, holding the 200-EMA $172.75 by 25%, histogram contracting a third bar, with only the 50-EMA $219.87 overhead and 1.6% away. ⚠️ Weekly cross FRAGILE at 12.0% of MACD and 2 bars, but on a one-day weekly bar today; the monthly is stretched (RSI 63.66, Stoch 68.04), so size stays capped. Pullback holds $200–207, stop a close under $192, targets $220 → $228 → $242.' },
    side: 'long', accent: 'cyan',
    date: '2026-08-05',
    story: 'stories/crdo.html',
  },
  {
    symbol: 'DELL', exchange: 'NYSE',
    price: '$462.70', change: '📅 CLOSE $462.70 (−0.98%) — pullback after the full plan traded, still +13.4% off the $406 fill · T3 $462 stays tagged as the deepest realised target, nothing named above it · stop $393 has 17.8% of cushion',
    signal: '📅 CLOSE 08/05 — MODEST PULLBACK, THE PLAN STAYS FULLY REALISED. DELL closed $462.70 (−0.98%), O $466.60 · H $485.70 · L $459.19 — a small give-back after Tuesday’s run through every named target, still +13.4% unrealised from the $406 fill. T3 $462 remains the deepest tagged target; nothing is named above it, so a trail-stop or a fresh structural read is still the open question, not a mechanical one. Stop $393 (close) has 17.8% of cushion. Daily RSI 59.79, Stoch %K 80.75/%D 67.11, MACD histogram +3.04 and JUST TURNED positive — the daily is still constructive through the pullback.',
    lead: { rank: 2, status: 'live', entry: 'filled $406', stop: '$393 (close)', targets: '$424 → $448 → $462', tagged: '$462', rr: '~4:1', edge: '📅 CLOSED $462.70 (−0.98%), a small give-back after the full plan traded through — still +13.4% off the $406 fill, T3 $462 stays tagged as deepest realised, stop $393 has 17.8% of cushion.' },
    side: 'long', accent: 'amber',
    date: '2026-08-05',
    story: 'stories/dell.html',
  },
  {
    symbol: 'MRVL', exchange: 'NASDAQ',
    price: '$211.02', change: '📅 CLOSE $211.02 (−3.46%) — gave back part of Tuesday’s run, high $222.38 stayed short of T3 $230, T2 $216 stays tagged as deepest realised · still +8.8% off the $194 fill, stop $181.50 has 16.3% of cushion',
    signal: '📅 CLOSE 08/05 — PULLBACK, T2 STAYS THE TAG. MRVL closed $211.02 (−3.46%), O $215.98 · H $222.38 · L $210.29 — a give-back after Tuesday’s T1/T2 clear, still +8.8% unrealised from the $194 fill. High $222.38 approached but did not reach T3 $230. Stop $181.50 (close) has 16.3% of cushion. Daily RSI 49.78, Stoch %K 74.94/%D 57.90, MACD histogram +3.14 and expanding a second bar — the daily held its footing through the pullback. Plan unchanged: stop $181.50, T3 $230 next.',
    lead: { rank: 11, status: 'live', entry: 'filled $194', stop: '$181.50 (close)', targets: '$205 → $216 → $230', rr: '~2.9:1', tagged: '$216', edge: '📅 CLOSED $211.02 (−3.46%), a pullback after T2 traded through — still +8.8% off the $194 fill, T2 $216 stays tagged as deepest realised, high $222.38 stayed short of T3 $230. Stop $181.50 has 16.3% of cushion.' },
    side: 'long', accent: 'blue',
    date: '2026-08-05',
    story: 'stories/mrvl.html',
  },
  {
    symbol: 'AVGO', exchange: 'NASDAQ',
    price: '$392.23', change: '📅 CLOSE $392.23 (+0.76%) — ⭐ CORRECTING the 13:55 read: it did NOT stay flat, it closed at its high $392.61 and RECLAIMED both the 9-EMA $385.73 and the 50-EMA $388.24 · 🔍 scouting, not on the board',
    signal: '📅 CLOSE — ⭐ A CORRECTION AGAINST THE 13:55 READ: AVGO closed $392.23 (+0.76%) essentially AT its session high, reclaiming the 9-EMA and 50-EMA it sat between intraday — so the flat-heavyweight point weakened on this name, though the group lag held on the aggregate (heavyweights +1.00% against the shorts’ +8.19%). The chart improved outright: the daily histogram is positive and expanding a third bar, one of only two among the semis. Still: the weekly cross is 7 bars deep at 37.1% of MACD and the month’s range is the narrowest here. A coiled chart that just reclaimed its stack — closer to a setup than it was, still not one.',
    side: 'long', accent: 'cyan',
    date: '2026-08-03',
    story: 'stories/avgo.html',
  },
  {
    symbol: 'AXON', exchange: 'NASDAQ',
    price: '$609.49', change: '📅 CLOSE $609.49 (+0.38%) — quiet regular session, then 🌙 EARNINGS AH $568.00 (−6.81%, per Yahoo 4:46pm ET) — NOT a close, more than double this name’s average historical post-earnings move (−2.71%) · 🔍 scouting, not on the board',
    signal: '📅 CLOSE 08/05 + 🌙 EARNINGS AH — A REAL REACTION, NOT YET A CLOSE: closed $609.49 (+0.38%), then Q2 earnings took shares to $568.00 after hours (−6.81%) — more than double AXON’s average post-earnings move, a genuine reaction rather than noise. Still scouting-only, but the next real close needs checking against the daily stack (9-EMA $562.05, 50-EMA $511.82) before the “strongest non-semi print” framing is treated as current — a close anywhere near the AH level erases a meaningful chunk of the structure this card has been citing.',
    side: 'long', accent: 'emerald',
    date: '2026-08-05', alert: true,
    story: 'stories/axon.html',
  },
  {
    symbol: 'CIEN', exchange: 'NYSE',
    price: '$390.77', change: '📅 CLOSE $390.77 (+3.64%) — closed at the session high $391.87, reversing Friday’s bottom-10% close entirely · ⚠️ the optical cohort it would fade closed +6% to +17% · 🔍 scouting short',
    signal: '📅 CLOSE — ⚠️ THE SCOUTING SHORT CLOSED ON ITS HIGH AND ITS WHOLE SUB-SECTOR WAS COVERED: $390.77 (+3.64%), the mildest of five optical names that all closed hard up — a short candidate whose sub-sector is being covered is one to leave alone. Structure still favours the short — 10% under the 50-EMA $434.56, weekly hist −25.13, one of the deepest crosses here — but the daily is bouncing: the 9-EMA $379.57 and 200-EMA $364.21 reclaimed, histogram positive. A fade needs a rejection at real resistance — the BB mid $403.43 up to the 50-EMA $434.56 — and nothing there has been tested. Scouting only.',
    side: 'short', accent: 'red',
    date: '2026-08-03',
    story: 'stories/cien.html',
  },
  // ── 2026-07-31 · SCOUTED IN ── AMD, ASML and LRCX added after a computed
  // scout. All three pass the weekly trend filter that MU, LITE, BE, DRAM and
  // NBIS just failed — weekly RSI over the midline on a FRAGILE cross — which is
  // the whole basis for ranking them above names that were removed.
  {
    symbol: 'AMD', exchange: 'NASDAQ',
    price: '$482.05', change: '📅 CLOSE $482.05 (−7.04%) — the board’s second-worst decliner today, closest this plan has EVER come to filling: low $478.20 is just 0.46% above the $449–476 zone top · still unfilled, zero realised',
    signal: '📅 CLOSE 08/05 + 🌙 AH — CLOSEST TO THE ZONE YET, STILL NOT THERE: closed $482.05 (−7.04%) on earnings day, the low just 0.46% above the $449–476 zone top, and the AH print $481.50 keeps it within reach — the first time in one move since the zone was drawn. Unfilled, zero realised; a genuine fill is plausible next session — check the actual open, earnings reactions gap further or reverse hard. Weekly cross FRAGILE at 6.3% of MACD, the most reversible on the board. ⚠️ The gate is cleared (SMH two sessions over $547–550), so a fill would not be blocked. Plan unchanged: pullback holds $449–476, stop a close under $424, targets $486 → $515 → $574.',
    lead: { rank: 7, status: 'wait', entry: 'pullback holds $449–476', stop: '$424 (close)', targets: '$486 → $515 → $574', rr: '~3:1', edge: '⚠️ CLOSEST TO THE ZONE YET: closed $482.05 (−7.04%), the board’s second-worst decliner today, low $478.20 just 0.46% above the $449–476 zone top. Still unfilled, zero realised — a genuine fill is now plausible next session. Weekly cross still the shallowest/most reversible on the board at 6.3% of MACD.' },
    side: 'long', accent: 'amber',
    date: '2026-08-05',
    story: 'stories/amd.html',
  },
  {
    symbol: 'ASML', exchange: 'NASDAQ',
    price: '$1,678.22', change: '📅 CLOSE $1,678.22 (−1.97%) — pullback, still unfilled: L $1,671.75, 2.6% above the $1,585–1,630 zone, closer than it has been since 08-03',
    signal: '📅 CLOSE 08/05 — STILL UNFILLED, GETTING CLOSER: closed $1,678.22 (−1.97%), the low 2.6% above the $1,585–1,630 zone — the nearest approach since it last traded on 08-03. Histogram contracting a fifth bar; weekly cross holding at 16.5% of MACD, deeper than AMAT’s or LRCX’s. ⚠️ The gate is no longer the blocker: SMH has closed above $547–550 two sessions running — this card’s own zone is the only thing between the plan and a fill. Plan unchanged: pullback holds $1,585–1,630, stop a close under $1,530, targets $1,707 → $1,740 → $1,894.',
    lead: { rank: 10, status: 'wait', entry: 'pullback holds $1,585–1,630', stop: '$1,530 (close)', targets: '$1,707 → $1,740 → $1,894', rr: '~4:1', edge: '🕐 THE ZONE WAS UNDERCUT BY THREE DOLLARS AND HELD — precision rather than luck: ASML opened $1,607.76 inside $1,585–1,630, traded $1,582.00, and recovered +4.0% to $1,644.97 with the $1,530 stop never within $52. Unfilled: SMH $545.11, the $547–550 close $1.89 away. ⚠️ But ASML is on the wrong side of today’s one structural finding, which caps what the tidy fill is worth: at +0.98% it is one of the flat semi heavyweights — with AVGO +0.09%, LRCX +0.02%, MU +0.85%, AMAT +1.33% — whose non-participation is exactly why SMH did +0.85% against QQQ +1.73% while this board’s shorts averaged ≈+8%. A long in the group that did not move is waiting on a bid that has not arrived. ⚠️ Daily: under BOTH the 9-EMA $1,665.00 and 50-EMA $1,704.45, RSI 43.93, histogram negative 28 bars and contracting a third. Weekly hist −22.09 at 18.7% depth on a one-day weekly bar. ⚠️ Monthly stretched (RSI 65.32, Stoch 81.36), so size stays capped. Pullback holds $1,585–1,630, stop a close under $1,530, targets $1,707 → $1,740 → $1,894.' },
    side: 'long', accent: 'blue',
    date: '2026-08-05',
    story: 'stories/asml.html',
  },
  {
    symbol: 'LRCX', exchange: 'NASDAQ',
    price: '$307.42', change: '📅 CLOSE $307.42 (−3.25%) — pullback, still unfilled: L $305.36, 9.1% above the $266–280 zone, which has not been retested since it traded',
    signal: '📅 CLOSE 08/05 — STILL UNFILLED, STILL THE FARTHEST FROM ITS OWN ZONE: closed $307.42 (−3.25%), the low 9.1% above the $266–280 band — the widest gap of any ranked long here. Daily histogram JUST TURNED positive; weekly cross ESTABLISHED at 27.0% of MACD, the least reversible of the semicap group. ⚠️ The gate is cleared, same as AMAT and ASML — the zone is the only condition left. Plan unchanged: pullback holds $266–280, stop a close under $252, targets $318 → $371 → $415.',
    lead: { rank: 16, status: 'wait', entry: 'pullback holds $266–280', stop: '$252 (close)', targets: '$318 → $371 → $415', rr: '~7:1', edge: '⚠️ DEMOTED TO THE BOTTOM OF THE LONGS FOR THE SIMPLEST REASON THERE IS: +0.02% — six cents — on a day the index did +1.73% and this board’s shorts averaged ≈+8%. That is the flattest print of any name here, and a long that cannot participate in the strongest tape in six weeks is not one of the sharpest trades on the board, whatever its target arithmetic says. ⭐ The plan itself worked: the $266–280 zone TRADED at the $276.84 low with the $252 stop never within $25, and price recovered +5.9% off that low before handing most of it back — the recovery happened, the follow-through did not. ⚠️ Daily: sitting AT the 9-EMA $294.92, under the 50-EMA $319.35, RSI 43.57, histogram negative 22 bars and contracting a third; the 200-EMA $252.56 sits right at the stop, the one genuinely good piece of geometry here. Weekly hist −8.62 at 31.5% depth, 3 bars and expanding, on a one-day weekly bar. Pullback holds $266–280, stop a close under $252, targets $318 → $371 → $415 — the deepest target on the board, and the reason it keeps a row at all.' },
    side: 'long', accent: 'emerald',
    date: '2026-08-05',
    story: 'stories/lrcx.html',
  },
  // ── 2026-08-01 · SCOUTED IN ── PANW, CRWD and FTNT added as a cybersecurity
  // cohort to test whether Friday's give-back was semis-specific: all three
  // gave back far less of their Wed→Fri swing than the board's own 25–56%
  // squeeze band (median ~41%) — PANW 11%, CRWD 6% — with FTNT the exception,
  // giving back 46%, inside that band rather than outside it. None carry a
  // `lead`; all three are watch-only until a pullback fills.
  {
    symbol: 'PANW', exchange: 'NASDAQ',
    price: '$347.13', change: '📅 CLOSE $347.13 (+4.61%) — closed AT the session high $347.66, a THIRD consecutive higher close · ⭐ the only cascade on the board reading daily crossed → weekly curling → monthly RISING · 🔍 scouting',
    signal: '📅 CLOSE — ⭐ CLOSED AT ITS HIGH, THE QUIETEST GOOD NEWS ON THIS BOARD: $347.13 (+4.61%), a third consecutive higher close that never needed a flush. The best structure of any name here, semis included — above the 9/50/200-EMAs with the cascade reading daily crossed → weekly curling → monthly RISING, which no semi can claim. ⚠️ Two limits keep it scouting: weekly RSI 69.63 and monthly RSI 74.17 mean the risk is being LATE, and the 12-month high $368.80 is only 6% up, so the room is limited. A plan would want a pullback into $330–336, not a chase at the high.',
    side: 'long', accent: 'amber',
    date: '2026-08-03',
    story: 'stories/panw.html',
  },
  {
    symbol: 'CRWD', exchange: 'NASDAQ',
    price: '$202.54', change: '📅 CLOSE $202.54 (+6.12%) — ⭐ closed OVER $200 at $202.54 near the high $203.17, a third consecutive higher close · monthly MACD rising · 🔍 scouting',
    signal: '📅 CLOSE — ⭐ TOOK $200 AND HELD IT, the strongest of the security trio: closed $202.54 (+6.12%) near its high. The same cascade as PANW — daily crossed → weekly curling → monthly rising, unavailable anywhere in semis — and 6.9% under its 12-month high $217.50, so more room than PANW or FTNT. ⚠️ The same limit: weekly RSI 68.23 and monthly RSI 74.42 put it near highs, and the risk is being LATE. The trio closing up together while the semi heavyweights averaged +1.00% reads as money rotating OUT of the group rather than into it. A plan would want the pullback into $190–194, not a chase at $202.',
    side: 'long', accent: 'red',
    date: '2026-08-03',
    story: 'stories/crwd.html',
  },
  {
    symbol: 'FTNT', exchange: 'NASDAQ',
    price: '$163.21', change: '📅 CLOSE $163.21 (+0.78%) — the laggard of the trio and the most stretched of the three: it held Friday’s gain and added almost nothing (H $164.50) · 🔍 scouting',
    signal: '📅 CLOSE — THE LAGGARD, AND THE ORDERING IS THE USEFUL PART: closed $163.21 (+0.78%) while PANW did +4.61% and CRWD +6.12% — the trio orders CRWD > PANW > FTNT, and FTNT is the most stretched of the three: weekly RSI 77.65 and monthly RSI 78.74, the highest readings on this entire board, only 4.2% under the 12-month high $170.35. The worst combination of room and stretch here — almost nothing left to run and the most to unwind. Last of the three to want. A plan would want a genuine reset — the BB mid $158.37 or the 9-EMA — not this price.',
    side: 'long', accent: 'blue',
    date: '2026-08-03',
    story: 'stories/ftnt.html',
  },
  // Fresh single-write scouting card, 2026-08-04 — the last verified session
  // fetched via tools/refresh.py is 31.07 ($147.61, −2.63%), so the OHLCV
  // below is dated to that bar rather than backfilled to today; `date` still
  // bumps to today per the tile-date rule. Structure is two-way and not yet
  // resolved either direction, so this carries no `lead` — it is a watch,
  // same footing as CIEN/TTD before a side confirms.
  {
    symbol: 'QCOM', exchange: 'NASDAQ',
    price: '$162.67',
    change: '📅 CLOSE $162.67 (+7.32%) — closed ABOVE the $160–162 short trigger, near the session high (H $163.48) · the $160–162 rejection did not print — the level was taken, not faded · weekly still NOT confirmed (RSI 46.51, hist −6.03, still expanding) · 🔍 scouting',
    signal: '📅 CLOSE 08/04 — THE FIRST SHORT TRIGGER GOT TAKEN, NOT FADED: closed $162.67 (+7.32%) essentially on its high, running clean through the $160–162 trigger on a board-wide melt-up day. The next real short test is $168–172, not $160–162 again. NOT a confirmed long either: the tactical-long trigger is a 4H close above $160–162 plus a retest entry, and the weekly has not turned — RSI 46.51, hist −6.03 and still expanding. Read it as “the level broke, the trend hasn’t” — a daily flip riding an unconfirmed weekly is exactly the one-session trap this board has been burned by twice. No fill either side, unranked.',
    side: 'short',
    date: '2026-08-04',
    story: 'stories/qcom.html',
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
