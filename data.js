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
  updated: '2026-08-09',
  markets: [
    {
      symbol: 'QQQ',
      label: 'Nasdaq-100 · QQQ',
      role: 'The index — what the whole tape is doing',
      price: '$723.03',
      change: '📅 CLOSE $723.03 (+1.17%) — the three-session fade ended: closed $723.03 against a $723.63 high, the $703 slab never tested on the run (low $716.52), and this month’s high $728.54 is now 0.8% overhead',
      checks: [
        {
          label: 'Weekly structure',
          verdict: 'bull', weight: 1.5,
          read: '✅ HOLDS, and the divergence it carried has CLOSED. Weekly RSI 60.75, price $723.03 above the weekly 9-EMA $704.25, the 50-week $641.45 and the 200-week $505.64. The weekly cross is still negative — hist −3.12, three bars, 13.1% of MACD — but contracting a second session. ⭐ The read that mattered here has changed: SMH’s weekly histogram is now contracting too (−8.36), so the two frames are repairing in the same direction rather than pulling apart. That removes the reason to prefer the index over the group.',
        },
        {
          label: 'Daily trend',
          verdict: 'bull', weight: 1.5,
          read: '✅ THE GIVE-BACK ENDED WITHOUT REACHING THE SLAB. Three lower closes stopped at $714.65 and price closed +1.17% at $723.03; the low $716.52 is 2.0% above $703, so the slab was never tested on a closing or an intraday basis. Price sits above the 9-EMA $707.13 and the 50-EMA $702.80, which remain converged at the top of the slab and defend it together.',
        },
        {
          label: 'The $678–680 shelf',
          verdict: 'bull', weight: 1.5,
          read: '✅ Untested for a sixth session, now $43–45 beneath price. Fails only on a daily close back under $678.',
        },
        {
          label: 'Descending trendline (≈$695)',
          verdict: 'bull', weight: 1.5,
          read: '✅ HOLDS for a fifth session, and the margin widened back out — the $716.52 low is 3.1% clear of the line against 1.9% last session. The mid-band $701.54 still sits between price and the line as a second layer.',
        },
        {
          label: 'Daily momentum',
          verdict: 'bull',
          read: '✅ THE STRONGEST READING ON THIS ROW. RSI 57.15, a sixth close over 50, and the MACD histogram +4.44 is positive and EXPANDING a fourth bar — momentum led price through the fade and price has now caught up to it. ⚠️ Stoch %K 84.85/%D 84.06 stays extended and is still the one reading arguing for a pause rather than a chase.',
        },
        {
          label: 'Higher low above $661.58',
          verdict: 'bull',
          read: '✅ Unchanged — the $716.52 low is 8.3% clear of $661.58, untested since the sequence resolved. This month’s low $685.82 is the live version of the same idea.',
        },
        {
          label: 'Implied vol (VXN)',
          verdict: 'bull',
          read: '✅ VXN closed 22.82 (−4.72%), a sixth session under the ≈26 floor and a fresh low for the move. ⭐ The ratio caveat eased rather than cleared: VXN/VIX is 1.53, in from 1.58, so the Nasdaq-specific protection bid narrowed on a session the index rose — but it is still above the 1.28 calm-extreme reference. Breadth remains unmeasured in this feed.',
        },
      ],
      fast: {
        checks: [
          {
            label: '4H structure',
            verdict: 'neutral', weight: 1.5,
            read: '⚠️ STILL DERIVED, NOT MEASURED — this feed carries daily/weekly/monthly OHLCV only, no 4H series. What the daily bar forces: the lower-high sequence broke, $723.63 against the prior $719.32, on a close in the top 7% of the range. Neutral until a real 4H read exists.',
          },
          {
            label: '4H momentum',
            verdict: 'bull',
            read: '⬆️ NEUTRAL → BULL on the condition this check wrote down last session: “reverts to bull on a close back over $723.” The close is $723.03. ⚠️ Honoured because it was pre-committed, and stated with its margin — three cents is a trigger met, not a trigger met convincingly. A close back under $714.65 undoes it.',
          },
          {
            label: 'The first lower high ≈$681',
            verdict: 'bull',
            read: '✅ Still resolved and further behind — $681 is 5.8% below price. The live level is this month’s high $728.54, now 0.8% away; the higher-high sequence stays intact while price holds the $703 slab.',
          },
        ],
      },
      confirm: [
        { label: 'Undercut-and-reclaim of $661.58 on volume — a flush low bought back the same session', done: true },
        { label: 'Daily close back above the broken $678–680 shelf', done: true },
        { label: 'A higher low: pullback holds over $661.58, then the bounce high gets taken out', done: true },
        { label: 'Daily RSI reclaims 50 and holds it (and VXN back under ≈26) — six closes over 50, VXN six sessions under 26', done: true },
        { label: 'Daily close above the descending trendline ≈$695 — the trend has actually changed', done: true },
        { label: 'Weekly MACD histogram crosses back positive — contracting a second session at −3.12, not yet crossed', done: false },
      ],
      levels: {
        reclaim: '$703 slab held → $723.63 (08-07 high) → $728.54 (month high) → $731.92 (July high) → $748.65 (12-month high)',
        invalidate: 'a close back under $714.65 undoes the 4H flip; under $703 re-opens the slab question; under $695 the trendline break is undone; under $685.82 the month low; under $678–680 the shelf',
      },
      note: '📅 CLOSE $723.03 (+1.17%) — the three-session fade ended without the $703 slab ever being tested (low $716.52), and the month high $728.54 is 0.8% away. Momentum led the whole way down and is still expanding: hist +4.44, a fourth bar, RSI 57.15. ⭐ The divergence this row carried is gone — SMH’s weekly histogram is contracting too, so both frames repair together and there is no longer a reason to prefer the index over the group. ⚠️ Stoch %K 84.85 extended; VXN/VIX narrowed to 1.53 but is still wide against the 1.28 calm reference.',
    },
    {
      symbol: 'SMH',
      label: 'Semis · SMH',
      role: 'The board’s barometer — the group that leads this tape',
      price: '$582.70',
      change: '📅 CLOSE $582.70 (+1.96%) — ✅ a FOURTH close over $547–550 and the first close over $580, the lid that rejected twice; new month high $586.09, with the 50-day $570.40 and the weekly 9-EMA $572.82 both held on the close',
      checks: [
        {
          label: 'Weekly structure',
          verdict: 'bull', weight: 1.5,
          read: '⬆️ NEUTRAL → BULL. This check said “neutral until the histogram turns,” and it turned: hist −8.36, negative a fourth bar but CONTRACTING for the first time after four sessions of widening. Weekly RSI 59.91, price $582.70 above the weekly 9-EMA $572.82, the 50-week $456.01 and the 200-week $291.19. ⚠️ Flipped on the board’s own standard rather than a new one — QQQ’s row went bull on exactly this configuration (contracting histogram, price over the weekly 9-EMA) on 08-06. ⚠️ It is ONE bar of contraction and the cross has not happened; a re-widening print puts this straight back to neutral.',
        },
        {
          label: 'Daily trend',
          verdict: 'bull', weight: 1.5,
          read: '✅ CONFIRMED, FOURTH SESSION, AND THE LID IS GONE. The $547–550 level has now closed above four times running (575.71, 569.70, 571.48, 582.70), and this session also took out $580 — the level that rejected on 08-05 and 08-06 — closing $582.70 with a new month high $586.09. Daily hist +4.13, three bars positive and expanding, the 9-EMA $563.93 rising beneath and the 50-EMA $570.40 reclaimed and held.',
        },
        {
          label: 'The 0.618 at ≈$478',
          verdict: 'bull', weight: 1.5,
          read: 'Untouched and now 18.0% below price. Still the strongest single piece of evidence on this board; it does no work at these levels and only matters again if the whole reclaim fails.',
        },
        {
          label: 'Overhead stack',
          verdict: 'bull', weight: 1.5,
          read: '⭐ THE STACK IS BEHIND PRICE. The $547–550 level, the 50-day $570.40, the mid-band $566.25 and now the $580 lid have all been closed above — $580 having rejected twice makes this the meaningful one. ⚠️ What is above is NOT clear air, and the daily levels alone do not show it — the structure board has price sitting INSIDE daily supply $571.35–592.01, with 4H supply $585.63–607.00 immediately overhead (9 touches, 15 closes in, since 13.07) and fresh daily supply $600.31–608.90 above that. The $586.09 high tagged the 4H edge and closed back under it.',
        },
        {
          label: 'Group leadership',
          verdict: 'neutral',
          read: '⚠️ SEMIS LED, AND THAT IS AN OBSERVATION, NOT A VERDICT. SMH +1.96% against QQQ +1.17% on 08-07 — the reverse of 08-06, when this check recorded semis lagging. ⚠️ By this board’s own rule a single session’s relative performance may not set a verdict, and the fact that the split INVERTED in one session is the argument for the rule rather than against it. Underneath, the session was broad rather than dispersed — CRDO +8.45%, IREN +8.70%, ASTS +6.80%, CRWV +6.26% against AMD −1.21% and STX −4.71%. Neutral until the same split prints twice or a non-price corroborator appears.',
        },
        {
          label: 'Bounce confirmation',
          verdict: 'bull',
          read: '✅ SUPERSEDED AND STAYS SUPERSEDED. The $535 bounce this check tracked is 8.9% behind price and is now the invalidation line rather than the question. Nothing here is open.',
        },
      ],
      fast: {
        checks: [
          {
            label: '4H structure',
            verdict: 'neutral', weight: 1.5,
            read: '⚠️ Still no 4H series in this feed. What the daily bar forces: a $13.76 range ($572.33–$586.09) closing in the top quarter and ABOVE the $580 lid for the first time — a breakout close, not a contained rejection. Neutral until a 4H read exists.',
          },
          {
            label: '4H momentum',
            verdict: 'bull',
            read: '⬆️ NEUTRAL → BULL on the condition written here last session: “reverts to bull on a close over $580.” The close is $582.70, $2.70 clear, on a session that closed in the top quarter of its range rather than fading off the high. Reverts to neutral on a close back under $580.',
          },
          {
            label: '$505.66–510 reclaim',
            verdict: 'bull',
            read: 'Untouched and now 14% below price — carried forward as resolved.',
          },
          {
            label: 'The $547–550 lid · volume test',
            verdict: 'bull',
            read: '✅ HOLDS — four closes above the old lid (575.71, 569.70, 571.48, 582.70). ⚠️ The volume half still cannot be refreshed: no 1H OBV series in this feed, so the flow question stays unanswered rather than assumed.',
          },
        ],
      },
      confirm: [
        { label: 'Hold $500 in the regular session — the AH snap-back is not enough on its own', done: true },
        { label: 'Reclaim $505.66–510 — the sweep low that broke, back over the line', done: true },
        { label: 'Daily close above the 4H 9-EMA $513.80, then a push at $535', done: true },
        { label: 'Undercut $535 and reclaim it in the same session — the pivot proven from beneath', done: true },
        { label: 'Daily CLOSE over $547–550 — cleared 08-04 and held four sessions running', done: true },
        { label: 'Reclaim the 50-day and the weekly 9-EMA — both closed above on 08-06 and held on 08-07 ($570.40 / $572.82)', done: true },
        { label: 'Close above $580 — cleared 08-07 at $582.70 after two rejections; the breadth half stays unmeasured in this feed', done: true },
        { label: 'Weekly MACD histogram stops widening — CONTRACTING at −8.36 on 08-07, the first such bar', done: true },
        { label: 'Weekly MACD histogram crosses back positive — still −8.36, four bars negative', done: false },
      ],
      levels: {
        reclaim: '$547–550 cleared (four closes) → 50-day $570.40 and weekly 9-EMA $572.82 held → $580 lid CLEARED 08-07 → $586.09 month high → $594–600 → $639.89 prior-month high',
        invalidate: 'a daily close back under $580 undoes the breakout; under $572.82 loses the weekly 9-EMA; under $570.40 loses the 50-day; under $547–550 re-opens the whole question; under $535 the reclaim voids → $483/$478 retest',
      },
      note: '📅 CLOSE $582.70 (+1.96%) — the $580 lid that rejected on 08-05 and 08-06 was CLEARED on the close, taking out this month’s high at $586.09, with the 50-day $570.40 and weekly 9-EMA $572.82 both held. Fourth close over $547–550. ⭐ The weekly histogram finally stopped widening — −8.36, contracting after four sessions of deterioration — which is why Weekly structure moves to bull. ⚠️ One bar, no cross, and the breakout closed straight into supply: 4H $585.63–607.00 overhead, price still inside daily $571.35–592.01. Group leadership left neutral: semis led (+1.96% vs QQQ +1.17%), the exact reverse of 08-06, which is why one session cannot set it.',
    },
  ],
  vol: [
    {
      symbol: 'VIX', value: '14.90', range: [13, 22], change: '📅 close 14.90 (−1.65%) — sixth session under 16 and a fresh low for the move, now only 11.4% above the 12-month low 13.38',
      verdict: 'bull',
      read: 'Sixth consecutive close under 16 and a new low for the move at 14.90. Daily MACD histogram −0.33, negative and expanding a fifth bar; the weekly cross is ESTABLISHED at 36.5% of MACD and 17 bars deep — the most confirmed calm-vol reading this board tracks. ⚠️ And the caveat sharpened again: daily Stoch %K is 2.98, down from 8.41 and effectively pinned on the floor, with the 12-month low only 11.4% below. The asymmetry from here favours vol expansion, not further compression. ⚠️ The gauge floor moved 15 → 13 this refresh for a mechanical reason, not a judgement one: the close printed under the old bound, which would have parked the needle at the end of the scale.',
    },
    {
      symbol: 'VXN', value: '22.82', range: [22, 33], change: '📅 close 22.82 (−4.72%) — sixth session under ≈26 and the largest one-day drop of the run; VXN/VIX narrowed 1.58 → 1.53 but is still wide',
      verdict: 'neutral',
      read: '⚠️ HELD AT NEUTRAL, on the same ratio argument, eased but not resolved. VXN closed 22.82 (−4.72%), a sixth session under ≈26 — that half stays constructive. ⚠️ VXN/VIX is 1.53, in from 1.58, so Nasdaq-specific protection cheapened relative to broad protection on a session the index rose; but against this board’s own 12-month endpoints (17.09/13.38 = 1.28 at the calm extreme, 34.37/35.30 = 0.97 at the fearful one) it still sits above BOTH. This board trades the Nasdaq complex exclusively, so a wide ratio is not neutral information for it. ⚠️ Stated with its limit, unchanged: two non-simultaneous extremes are a crude reference, not a percentile — the level is measured, the "still wide" reading is inference.',
    },
  ],
  note: '📅 Закриття 07.08. 🚦 SMH $582.70 (+1.96%) — рівень $547–550 узято ЧЕТВЕРТУ сесію, і вперше закрито вище $580, який до того відбивав двічі; новий місячний максимум $586.09. ⭐ Структурний факт сесії: розходження рамок закрилося — тижнева гістограма SMH тепер ЗВУЖУЄТЬСЯ (−8.36) разом із QQQ (−3.12), уперше в один бік. ⚠️ VIX 14.90 зі Stoch %K 2.98 — страх на самій підлозі, лише 11% над річним дном 13.38. Що змінить читання: денне закриття SMH під $580.',
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
    price: '$172.01', change: '📅 CLOSE $172.01 (+10.32%) — the long is retired at 3.24 ATR from its own zone; price closed INSIDE structure-board supply $166.98–177.29 with the short band $177–188.50 stacked directly above',
    signal: '📅 CLOSE 08/07 — THE LONG IS RETIRED AND THE PLAN TURNS. Closed $172.01 (+10.32%) with $150, $157 and $168 all traded on an order at $141–143 that price never came near — 3.24 ATR away, so it was never going to fill. ⚠️ Rather than chase, the plan moves to the supply above: price closed INSIDE the structure board’s $166.98–177.29 band and the short zone is the one stacked on it, $177–188.50, five touches and twenty-six closes-in since January. Stop $192, 1.03 ATR over the midpoint. Targets are the board’s demand: $168.45 → $134.19. ⚠️ The board still reads `Long preferred` — this card disagrees.',
    lead: { rank: 23, status: 'wait', entry: 'fade the rejection in $177–188.50', stop: '$192 (dead >$188.50 close)', targets: '$168.45 → $134.19', rr: '~5.2:1', edge: '⚠️ SIDE FLIPPED LONG → SHORT, AND THE STRUCTURE BOARD DISAGREES — stated rather than hidden, because the two are allowed to disagree and this card is taking the other side of `Long preferred — do not chase`. ⚠️ The long is retired on arithmetic, not sentiment: $150, $157 and $168 all traded on 08-07 while the order sat at $141–143, 3.24 ATR below the close — the most stranded zone on this board and unreachable by any ordinary sequence of sessions. ⭐ The short is anchored where supply actually is. The board stacks two daily bands — $166.98–177.29, which price closed inside, and $177.02–188.50 above it — and they abut at $177; two independently derived zones sharing an edge is a confluence, not a remembered print, and the upper band carries twenty-six closes-in since January. ⚠️ Rule B: the $192 stop is 1.03 ATR above the $182.75 midpoint. ⚠️ Volume is not carried in this feed, so the earnings-cadence check could not be run — if 08-07 was a reaction bar the three-session gate runs to 08-12. Falsifier: a daily close over $188.50.' },
    side: 'short',
    date: '2026-08-09',
    story: 'stories/pltr.html',
  },
  {
    symbol: 'META', exchange: 'NASDAQ',
    price: '$592.10', change: '📅 CLOSE $592.10 (+0.37%) — a $598.74 high given back 73% into the close; +10.7% from the $535 fill with T1 $609 still 2.9% overhead',
    signal: '📅 CLOSE 08/07 — GRINDING, NOT ADVANCING. Closed $592.10 (+0.37%) after a $598.74 high, handing back 73% of the swing to finish under its $594.89 midpoint. +10.7% from the $535 fill; T1 $609 is 2.9% away and untouched. ⭐ The weekly turned for the first time in this trade: hist +0.33, JUST TURNED green, and the daily hist −2.48 is contracting a fifth bar. ⚠️ Price is still under the 50-EMA $603.88 and 200-EMA $627.33, so the advance is happening beneath the averages that matter. The $559 stop sits 5.6% below — outside noise, but it risks giving back half the gain.',
    edge: '⭐ +10.7% FROM $535 AND THE WEEKLY FINALLY TURNED — hist +0.33, green for the first time in the trade, with the daily hist −2.48 contracting a fifth bar. Two frames repairing together is the best evidence this position has had. ⚠️ But the session shape says grind, not thrust: a $598.74 high given back 73% to close under the $594.89 midpoint, and price still beneath the 50-EMA $603.88 and 200-EMA $627.33. T1 $609 has not been touched. ⚠️ The stop is the live question, and it is the one this board has already written down: $559 sits 5.6% under price, so a stop-out hands back more than half the open gain, while 1.00 ATR ($565) would still be outside ordinary noise and lock materially more. That is a trailing decision, not a thesis change. Falsifier: a daily close under $559.',
    lead: { rank: 2, status: 'live', entry: 'filled $535', stop: '$559 (close)', targets: '$609 → $629 → $645', rr: '~4.6:1', edge: '⚠️ A WINNING TRADE WHOSE STOP WAS STILL SET TO BOOK A LOSS. +10.3% from the $535 fill and the stop sat at $515 — $20 BELOW the entry — so any flush would have turned a ten-percent winner into a −3.7% loser. It trails to $559, this month’s low, which locks +4.5% and sits 2.5 ATR under price; there is no structure at 1.0 ATR to anchor to and inventing one is worse than being a little wide. ⭐ The fill itself remains the board’s best-timed entry. ⚠️ But nothing in the chart says add: price is beneath the 50-EMA $604.36 and 200-EMA $627.69, the daily histogram has been negative eleven bars and the monthly ten, and this month’s $601.00 high failed under last month’s $686.08. Manage it down, do not re-buy it. Falsifier: a close under $559 ends the trade with the gain banked.' },
    side: 'long', accent: 'blue',
    date: '2026-08-09',
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
    price: '$328.58', change: '📅 CLOSE $328.58 (+2.83%) — T1 $330 TRADED at the $333.73 high, so the first target is realised; +7.0% from the $307 fill with the $310 stop locking +1.0%',
    signal: '📅 CLOSE 08/07 — T1 TAGGED. Closed $328.58 (+2.83%) after printing $333.73, which trades T1 $330 — tagged, and it stays tagged even though the close came back under the level. +7.0% from the $307 fill; the $310 stop still locks +1.0%. ⭐ First improvement in the frame: daily hist +1.02, JUST TURNED green after eighteen negative bars, and price reclaimed the 9-EMA $324.28. ⚠️ It is one bar. The weekly hist −9.55 is seven bars negative and still EXPANDING, and the 50-EMA $367.11 / 200-EMA $387.24 are both far overhead. Targets $350 → $365 remain.',
    lead: { rank: 6, status: 'live', entry: 'filled $307', stop: '$310 (close)', targets: '$330 → $350 → $365', rr: '~19:1', tagged: '$330', edge: '⭐ T1 IS IN THE BOOK. $333.73 intraday trades T1 $330 on a filled plan, so it is tagged — an intraday touch counts and the $328.58 close back under the level does not undo it. +7.0% from $307, with the stop at $310 keeping the worst case +1.0%. ⭐ The daily frame turned for the first time in this trade: hist +1.02 after eighteen negative bars, and price closed back over the 9-EMA $324.28. ⚠️ One bar is not a structure, and the weekly says so — hist −9.55, seven bars negative and EXPANDING, with the 50-EMA $367.11 and 200-EMA $387.24 both far above. So this stays the weakest chart of the held longs even after a tagged target. ⚠️ Note the R:R still reads ~19:1 only because a trailed stop is measured off the original fill; risk collapsed to $3, the trade did not get nineteen times better. Falsifier: a close under $310, which now ends the trade green.' },
    side: 'long', accent: 'red',
    date: '2026-08-09',
    story: 'stories/tsla.html',
  },
  {
    symbol: 'CRWV', exchange: 'NASDAQ',
    price: '$90.67', change: '📅 CLOSE $90.67 (+6.26%) — the short is back INSIDE its own $88–97 entry zone after a $91.03 high; alive, but only 7.0% under the $97 kill level',
    signal: '📅 CLOSE 08/07 — PRICE CAME BACK INTO THE ZONE. Closed $90.67 (+6.26%), high $91.03 — the short that was working below $88–97 is now trading inside it again. Not invalidated: the kill is a CLOSE over $97 and that is 7.0% away. ⚠️ But the evidence moved the wrong way. Daily hist +2.97 JUST TURNED green, weekly hist −2.82 is contracting, and price closed back over the 50-EMA $88.60. The 200-EMA $96.46 sits just under the kill level and is now the line that matters. Targets $70 → $65 → $60.55 are unchanged and untouched.',
    lead: { rank: 8, status: 'live', entry: 'fade the rejection in $88–97', stop: '$101 (dead >$97 close)', targets: '$70 → $65 → $60.55', rr: '~3.8:1', edge: '⚠️ A LIVE SHORT WITH PRICE BACK IN ITS ENTRY ZONE. $90.67 (+6.26%) after a $91.03 high puts price inside $88–97 again, so the edge that came from selling into a rejection and watching it work has been handed back. ⭐ The plan is not broken: invalidation is a CLOSE over $97, 7.0% above here, and the zone itself is properly anchored — 50-EMA $88.60 at the lower edge, 200-EMA $96.46 just under the upper, two independent references rather than one remembered print. ⚠️ What did change is the momentum evidence, all of it against the short: daily hist +2.97 JUST TURNED green, weekly hist −2.82 contracting for the first time in six bars, and a close back above the 50-EMA. ⚠️ This is one session, so it is an observation and not yet a reason to cut. Falsifier: a daily close over $97 ends it; a close back under $88.60 says the rejection is resuming.' },
    side: 'short', accent: 'cyan',
    date: '2026-08-09', alert: true,
    story: 'stories/crwv.html',
  },
  {
    symbol: 'LITE', exchange: 'NASDAQ',
    price: '$890.17', change: '📅 CLOSE $890.17 (+6.22%) — a $928.48 month high, then 37% of the move handed back into the close; daily hist +20.82 is the widest on the board',
    signal: '📅 CLOSE 08/07 — BIG MOVE, SOFT FINISH. Closed $890.17 (+6.22%) after printing a new month high $928.48 and giving back 37% of the $826.26–928.48 swing. ⭐ Momentum is the strongest reading here: daily hist +20.82, five bars positive and expanding four, with the 9-EMA $802.83 and 50-EMA $801.26 converged $89 beneath price. Weekly hist −29.46 JUST TURNED to contracting after ten negative bars. ⚠️ The give-back is the caution — a close $38 off the high is where a vertical session usually pauses, and price is 11% above a 50-EMA it has not tested in the run. Level to hold: $861.90.',
    edge: '⚠️⚠️ THE DEMOTION COST THE WHOLE MOVE — this card’s ladder was $748 → $796 → $869 and pre-market $882.17 is through ALL THREE, with nothing filled because LITE was unranked. ZERO realised. A target traded on an unfilled plan is not realised and must not be tagged; there is no plan here at all, so it goes in prose, as the four gated T1s of 08-03 did. ⚖️ Two separate questions, kept separate: the PROCESS was right by its own terms and still is — a weekly RSI on a Monday-only bar is that session relabelled, and the cross had not narrowed (−36.50 at 67.7% vs −40.57 at 68.8%). The OUTCOME cost the entire ladder. The filter is not loosened because one instance went against it, and the cost is not hidden either; a PATTERN of unranked names clearing their ladders would justify revisiting it, and one case is not a pattern. 🔻 Still unranked, now for a DIFFERENT reason: not “no weekly confirmation” but NO ENTRY. $882.17 is 13.1% above the 08-03 close, above the 1H 9-EMA $817.05, the 200-EMA ≈$753 and the lower band $666.83, and 22% above the top of its own $714–721 zone. The trade was available and was not taken — it is not available now. A long returns on a controlled retest with a 4H higher low at a zone drawn from a completed frame. 1H RSI 88.76, Stoch 93.41, MACD 25.52. ⭐ The dormant parabola-unwind short is further from arming than ever: it needs a daily close under ≈$630–632, ~40% below price. ⚠️ Pills only — the legend was parked on an older bar (C 706.17, V 0) and read RSI 52.97 against an actual 88.76; the 1,579.85 / 419.45 pills are the documented render artifacts and are ignored. 1H OBV ≈−2.66m is an 08-03 reading: pre-market bars are V:0.',
    side: 'long',
    date: '2026-08-09',
    story: 'stories/lite.html',
  },
  {
    symbol: 'NVDA', exchange: 'NASDAQ',
    price: '$223.96', change: '📅 CLOSE $223.96 (+2.27%) — T1 $214.39 and T2 $223.63 both traded, on a plan whose $205–209 zone is 7.2% below and was never reached',
    signal: '📅 CLOSE 08/07 — TWO TARGETS TRADED, NO FILL. Closed $223.96 (+2.27%), high $224.76, which takes out T1 $214.39 and T2 $223.63 — neither is taggable, because the $205–209 entry never filled and the session low was $220.66. The zone now sits 7.2% under price. ⭐ The frame is strong: RSI 64.41, Stoch 91.53, daily hist +2.50 four bars and expanding, price over the 9-EMA $212.00 and 50-EMA $205.80. ⚠️ The weekly is the caution — hist +0.05, contracting and JUST TURNED red at the top of the move. Stop $196.50 is untouched and irrelevant while unfilled.',
    lead: { rank: 22, status: 'wait', entry: 'pullback holds $205–209', stop: '$196.50 (close)', targets: '$214.39 → $223.63 → $236.54', rr: '~2.8:1', edge: '⚠️ RIGHT DIRECTION, ZONE TOO LOW, AGAIN. T1 $214.39 and T2 $223.63 both traded on 08-07 while the order waited at $205–209 — 7.2% under the close and never approached, session low $220.66. Unfilled, so nothing is tagged, and that is the correct reading rather than a technicality. ⚠️ The zone was anchored to the 50-EMA $205.80, which was a fair reference when drawn and has since been left behind: price has held above the 9-EMA $212.00 for the whole advance. ⭐ Momentum is genuinely good — RSI 64.41, Stoch 91.53/87.81, daily hist +2.50 four bars and expanding. ⚠️ Against it: the weekly hist is +0.05 and JUST TURNED red, contracting at the highs, which is where a stalled leg usually shows up first. Falsifier: this needs a zone price can reach — the nearest honest confluence is the 9-EMA, not the 50.' },
    side: 'long', accent: 'red',
    date: '2026-08-09',
    story: 'stories/nvda.html',
  },
  {
    symbol: 'COHR', exchange: 'NYSE',
    price: '$379.13', change: '📅 CLOSE $379.13 (+13.44%) — the board’s biggest single session; a new month high $391.36 that also cleared the prior month’s $386.74',
    signal: '📅 CLOSE 08/07 — THE BIGGEST SESSION ON THE BOARD. Closed $379.13 (+13.44%), high $391.36 — a new month high which also took out the prior month’s $386.74 — and the close held +5.4% above the swing midpoint, so the move was kept rather than faded. ⭐ Daily hist +13.31, four bars and expanding; weekly hist −11.23 JUST TURNED to contracting; price is 17% over the 50-EMA $322.87 and 41% over the 200-EMA $269.13. ⚠️ Worth recording against this board’s own file: the $294–313 short zone documented as “working” in the 08-03 week is now 21% underwater. Next reference is the 12-month high $440.',
    edge: '⛔ UNRANKED — THE $294–313 ZONE WAS RUN THROUGH AND THE $321 KILL LINE IS 6.2% BELOW PRICE: pre-market $341.00 sits 8.9% above the zone top, so the entry is void in substance (formally the kill still wants a daily close over $321, and at 07:35 ET there is none). Unfilled, ZERO realised, on a +29.7% two-session move off the $262.90 close of 07-31. ⭐ Both halves of the record: the zone-raise from $252–266 to $294–313 was RIGHT and saved the trade — the old zone would have filled on 08-03 and be ≈35% underwater now. It cost the fill and saved the loss. 🔻 Why not raise it again: that would be drawing a level at a memory of one bar, which Rule A forbids, and the 1H has nothing to anchor to — price is above the upper band $327.39, with the 9-EMA $306.29, the 200-EMA ≈$282 and the lower band $242.66 all beneath it. Returns on a rejection at a level from a completed daily or weekly frame. ⚠️ Individual failure, as required: the 1H 200-EMA was reclaimed on the 08-03 CLOSE and price is ~21% above it. 1H RSI 89.91, Stoch 89.21, MACD 10.34 — the most extended of the three optical names. ⚠️ This chart had the worst legend miss of the three: parked on an older bar (C 261.00, V 0) it read Stoch 15.06 against an actual 89.21 — a 69-point miss — and RSI 55.96 against 89.91. Pills only. 1H OBV ≈30.0m is an 08-03 reading, not confirmation: pre-market bars are V:0.',
    side: 'short', accent: 'violet',
    date: '2026-08-09',
    story: 'stories/cohr.html',
  },
  {
    symbol: 'IREN', exchange: 'NASDAQ',
    price: '$41.23', change: '📅 CLOSE $41.23 (+8.70%) — back inside the redrawn $40.8–44 zone after a $41.30 high; the short is alive with the $44 kill level 6.7% away',
    signal: '📅 CLOSE 08/07 — THE REDRAWN ZONE IS DOING ITS JOB. Closed $41.23 (+8.70%), high $41.30, so price is inside $40.8–44 — the zone moved here precisely because $41.70–44 was never printing. Alive: the kill is a CLOSE over $44, 6.7% above. ⭐ The upper half of the zone is where the structure is — 200-EMA $43.41 and 50-EMA $43.58 sit within a dollar of each other inside it, two independent references. ⚠️ Momentum is against the short this session: daily hist +0.99 JUST TURNED green, weekly hist −2.10 contracting. Targets $35 → $32 → $28.93.',
    lead: { rank: 9, status: 'live', entry: 'fade the rejection in $40.8–44', stop: '$47 (dead >$44 close)', targets: '$35 → $32 → $28.93', rr: '~2.9:1', edge: '⭐ THE ZONE REDRAW IS VINDICATED: $41.70–44 never printed, $40.8–44 did — twice now, with an $41.30 high on 08-07. That is the whole point of moving a zone to where supply actually sits instead of waiting at a level price cannot reach. ⭐ And it is anchored properly: the 200-EMA $43.41 and 50-EMA $43.58 converge inside the upper half, so the invalidation at a CLOSE over $44 sits above two independent references rather than one print. 6.7% of room. ⚠️ The session went against the short hard — +8.70%, the daily hist +0.99 JUST TURNED green after seven negative bars, and the weekly −2.10 is contracting. Both are first-bar signals, so they are observations, not a structure. ⚠️ Price is at the LOW edge of the zone, which means the rejection has not printed from the good part of it yet. Falsifier: a daily close over $44.' },
    side: 'short', accent: 'red',
    date: '2026-08-09', alert: true,
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
    price: '$50.60', change: '📅 CLOSE $50.60 (−1.63%) — a third straight decline, gave back the whole $48.77–52.06 range and closed under both the 9-EMA $52.09 and the 50-EMA $55.36',
    signal: '📅 CLOSE 08/07 — STILL THE WEAKEST OF THE MEMORY NAMES. Closed $50.60 (−1.63%), a third consecutive decline (53.74 → 51.44 → 50.60), giving back 100% of the day’s $48.77–52.06 range. Price is under the 9-EMA $52.09 and 12% under the 50-EMA $55.36, with RSI 43.52. ⚠️ The daily histogram +0.14 is contracting and JUST TURNED red — the three-bar bounce attempt has stalled without reaching a single average. ⭐ The one support that matters is this month’s low $47.68, 3.8% below; the $48.77 session low is the near version of it. Nothing here argues for a position until one of those holds on a close.',
    edge: '🕐 13:55 ET — ⭐ THE TELL INVERTED, WHICH IS THE POINT OF WATCHING IT: Friday DRAM closed on its low while both HDD names closed green, and that was read as proof of a DRAM/NAND re-rating. Today DRAM is +1.59% at its session high with SNDK +7.13% and MU +0.85% green, while WDC −2.74% and STX −3.13% are the board’s only decliners — the exact reverse. Watch it to read the group; the conclusion drawn from one session was the fragile part. Still unranked and still unconfirmable: the entry needs a daily CLOSE over $52.60 and price is 2.8% under it. 📅 UNRANKED — DRAM cannot be trend-confirmed AT ALL, which on this board is disqualifying rather than merely inconvenient. The weekly is the confirmation layer, and DRAM’s weekly MACD literally cannot compute — “not enough data”, because the ETF launched recently — while its weekly RSI(14) is barely seeded. There is no frame available to confirm or deny a trend, so a ranked row would imply a conviction the data cannot support. Only the DAILY frame is usable here, and no multi-frame language belongs on this card. ⛔ The plan was also invalidated on the session: the stop was “a daily close back under $51.55” and DRAM closed $50.37, gapping to $54.70, running $55.45 and collapsing to close ELEVEN CENTS off the low on a 10.3% range. The gate meant nothing filled (SMH $540.53 under $547–550), so the loss was zero. Entry is confirmation-only and sits +4.4% ABOVE price: no long until a daily CLOSE back over $52.60, stop a close under $48, targets $56 → $61 → $68. ⭐ WHY IT STAYS ON THE BOARD WITH NO POSITION — the same reason BE does. DRAM is the cohort’s TELL: it holds MU and SNDK alongside WDC and STX, and it still closed on its LOW while both HDD names closed GREEN. That single fact is the cleanest proof the session was a DRAM/NAND re-rating rather than sector risk-off, and no individual card can show it. Watch it to read the group; trade the names. ⚠️ One recurring caveat: OBV’s negative sign here is a start-point artifact, NOT a signal — only its direction carries meaning, and that direction is rolling over off the June peak.',
    side: 'long', accent: 'indigo',
    date: '2026-08-09',
    story: 'stories/dram.html',
  },
  {
    symbol: 'AAOI', exchange: 'NASDAQ',
    price: '$135.63', change: '📅 CLOSE $135.63 (+9.19%) — a $149.35 month high, then 55% given back to close BELOW the swing midpoint $136.79',
    signal: '📅 CLOSE 08/07 — A BIG GREEN BAR THAT LOST ITS OWN SESSION. Closed $135.63 (+9.19%) after a new month high $149.35 — above the prior month’s $147.54 — then handed back 55% of the $124.22–149.35 swing to finish UNDER its midpoint $136.79. A green close that ends below the middle of its range is distribution inside an advance, not a breakout. ⭐ Daily hist +6.14, five bars and expanding; weekly hist −9.43 JUST TURNED to contracting; price 6.4% over the 50-EMA $127.47. ⚠️ Against the file: the $119–127 short zone logged as “working” on 08-03 has now been closed through.',
    edge: '⛔ UNRANKED — THE $119–127 ZONE WAS RUN THROUGH, NOT REJECTED FROM: pre-market $131.30 is 3.4% above its top, so there is no resistance beneath price to fade and the entry as written is VOID. Unfilled, so the realised result is ZERO rather than a loss, on a +39.2% two-session move off the $94.32 close of 07-31. Neither exit line has formally printed — the kill needs a daily close over $127, the $134 stop is 2.1% overhead — but that is bookkeeping, not a reason to hold the plan. 🔻 Why no third zone: Rule A wants at least two independent structural references, and on the 1H there are NONE overhead — the 9-EMA $118.27, the 200-EMA ≈$101 and the lower band $84.54 are all BELOW price. Re-drawing at the print is the exact error the rule exists to prevent, so the plan leaves the table instead of being re-priced. It returns on a rejection at a level read off a completed daily or weekly frame. ⚠️ The individual failure that kills it, as required: AAOI reclaimed its 1H 200-EMA on the 08-03 CLOSE and trades ~30% above it — a level reclaimed on a close, not a cohort excuse. 1H RSI 88.09, Stoch 93.88, MACD 5.60 rising. ⚠️ Read off the right-axis pills only: the chart legend was parked on an older bar (C 116.94, V 0, high $118.20 BELOW the live print) so the whole row was discarded — its RSI said 82.66 against an actual 88.09. And 1H OBV ≈269k is NOT evidence of absent demand: pre-market bars are V:0, so OBV cannot move on them. ⚠️ The news catalyst is reported, not verified.',
    side: 'short', accent: 'violet',
    date: '2026-08-09',
    story: 'stories/aaoi.html',
  },
  {
    symbol: 'WDC', exchange: 'NASDAQ',
    price: '$434.30', change: '📅 CLOSE $434.30 (−3.81%) — a second heavy session after 08-06’s −13.03%, gave back the whole $422.50–457.56 range and closed 17% under the 50-EMA $522.86',
    signal: '📅 CLOSE 08/07 — THE FALL CONTINUED, WITHOUT A BOUNCE BAR. Closed $434.30 (−3.81%) after 08-06’s −13.03%, giving back 100% of the $422.50–457.56 range. Price is 12% under the 9-EMA $494.25 and 17% under the 50-EMA $522.86; RSI 38.44. ⚠️ Both frames are deteriorating together — daily hist −5.23, negative and expanding, and weekly hist −16.98, four bars negative and expanding — which is the configuration that does not usually bottom on the second session. ⭐ The references beneath are this month’s low $407.48, 6.2% below, and the 200-EMA $375.90. No position until one holds on a close.',
    side: 'long',
    date: '2026-08-09', alert: true,
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$101.65', change: '📅 CLOSE $101.65 (+1.84%) — the rejection printed: $103.65 high, straight into the 50-EMA $103.01, then a close back inside the zone, 35 cents under the $102 kill level',
    signal: '📅 CLOSE 08/07 — THE REJECTION PRINTED AND THE TRADE IS LIVE. High $103.65 cleared the zone top and the 50-EMA $103.01, then price closed $101.65 (+1.84%) back INSIDE $96–102. That is the rejection this plan was waiting on, so status moves `wait` → `live`. ⚠️ It is also the narrowest survival on the board: the kill is a CLOSE over $102 and this closed $0.35 under it, 0.34%. One ordinary session ends it. ⭐ The evidence is still the weekly: hist −4.04, four bars negative and EXPANDING, against a daily that has bounced four. Targets $85 → $80 → $75 → $66, stop $108.',
    lead: { rank: 10, status: 'live', entry: 'rejection printed in $96–102', stop: '$108 (dead >$102 close)', targets: '$85 → $80 → $75 → $66', rr: '~3.7:1', edge: '⭐ THE TRIGGER FIRED, AT THE RIGHT PLACE. $103.65 pushed through the $102 zone top and into the 50-EMA $103.01, then sold back to close $101.65 inside the zone — a rejection off a live reference, which is exactly what the rejection-only rule was waiting for. Status goes `live`. ⚠️ And it is the most fragile plan on the board by a distance: invalidation is a CLOSE over $102, and this closed 35 cents — 0.34% — beneath it, having already traded $1.65 above it intraday. There is no cushion here at all, so size is the whole risk decision. ⭐ The weekly carries the thesis: hist −4.04, four bars negative and EXPANDING, while the daily has bounced four. ⚠️ Against: the 200-EMA $76.46 is 25% below and the monthly frame has not broken. Falsifier: a daily close over $102, and it is one green session away.' },
    side: 'short', accent: 'blue',
    date: '2026-08-09', alert: true,
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$877.57', change: '📅 CLOSE $877.57 (−0.44%) — opened at the session high $904.65, through T1 $892, and closed at the bottom of the range on an unfilled plan',
    signal: '📅 CLOSE 08/07 — T1 TRADED ON THE OPENING PRINT AND NOTHING ELSE. The open $904.65 was also the high and cleared T1 $892; price then sold to $847.02 and closed $877.57 (−0.44%), giving back 100% of the range. The $800–823 entry is 6.6% below and was never approached, so nothing is taggable. ⚠️ Opening at the high and closing at the low is the weakest bar shape on the board this session. ⭐ Daily hist +1.99 JUST TURNED green and the 9-EMA $873.67 held the close. ⚠️ Weekly hist −16.76, negative and EXPANDING, with the 50-EMA $889.51 now overhead.',
    lead: { rank: 16, status: 'wait', entry: 'pullback holds $800–823', stop: '$726 (close)', targets: '$892 → $930 → $996–1,000', rr: '~2.2:1', edge: '⚠️ A TARGET TAKEN OUT BY THE OPENING PRINT, ON AN ORDER 6.6% AWAY. $904.65 was both the open and the high, through T1 $892; the session then sold to $847.02 and closed $877.57, a 100% give-back. The $800–823 entry was never approached — unfilled, nothing tagged. ⚠️ The bar shape is the finding: open at the high, close near the low, is distribution, and it happened on the same session the rest of the board closed green. ⭐ Underneath, the daily is repairing — hist +1.99 JUST TURNED green and the 9-EMA $873.67 held the close. ⚠️ The weekly disagrees and is the senior frame: hist −16.76, negative and EXPANDING, with price now under the 50-EMA $889.51. ⭐ The zone sits on the month low $770.10 region, a real reference. Falsifier: a weekly close under $770.10.' },
    side: 'long', accent: 'cyan',
    date: '2026-08-09',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$379.31', change: '📅 CLOSE $379.31 (−1.45%) — gave back the entire $372.80–397.58 swing; still +3.6% from the $366 fill but only 2.7% above the $369 stop',
    signal: '📅 CLOSE 08/07 — THE SOFTEST HELD LONG. Closed $379.31 (−1.45%) after touching $397.58 and giving back 100% of the swing. T1 $390 traded again but T2 $403 is already tagged, so nothing is added. +3.6% from the $366 fill, and the cushion is now thin: the $369 stop is 2.7% below price. ⭐ The stop is on structure, not on a round number — the 50-EMA $369.92 sits directly on it and the 9-EMA $373.32 just above, so a close under $369 means the whole daily cluster has gone. ⚠️ Weekly hist −8.65, six bars negative. Target $419 stands.',
    lead: { rank: 5, status: 'live', entry: 'filled $366', stop: '$369 (close)', targets: '$390 → $403 → $419', rr: '~18:1', tagged: '$403', edge: '⚠️ THE HELD LONG CLOSEST TO ITS STOP. $379.31 (−1.45%) handed back the full $372.80–397.58 range, leaving +3.6% on the $366 fill and just 2.7% of room to the $369 stop. T2 $403 is already tagged so 08-07’s touch of T1 $390 adds nothing. ⭐ The stop placement is the good news: the 50-EMA $369.92 sits on it and the 9-EMA $373.32 a shade above, so it is not a number picked for comfort — a close through it means price has lost the entire daily average cluster in one move, which is a real reason to be out. ⚠️ Momentum has rolled: daily hist +6.16 but contracting two bars, weekly hist −8.65 and six bars negative. ⚠️ The trade is still green and the plan intact — this is a cushion problem, not a thesis problem. Falsifier: a daily close under $369, which books roughly +0.8%.' },
    side: 'long', accent: 'blue',
    date: '2026-08-09',
    story: 'stories/ter.html',
  },
  {
    symbol: 'GLW', exchange: 'NYSE',
    price: '$165.68', change: '📅 CLOSE $165.68 (+5.41%) — the $170.43 high pushed into structure-board supply $168–172.95, with the 50-EMA $169.14 inside it, then closed back under both',
    signal: '📅 CLOSE 08/07 — REJECTION PRINTED AT SUPPLY; THE SHORT IS LIVE. High $170.43 pushed into the structure board’s daily supply $168–172.95 — the 50-EMA $169.14 and the 4H band $168.79–187.07 sit inside the same range, three independent references — and price closed $165.68 back under all of them. ⭐ That is a rejection off structure rather than a memory of one bar, which is what Rule A asks for. Entry $168–172.95, stop $185 on a close over $172.95, 1.03 ATR from the midpoint. Targets are the board’s own demand: $162 → $148 → $139.51. ⚠️ Against it: daily hist +3.33, four bars and expanding.',
    edge: '✅ FLIPPED SHORT → LONG BY ITS OWN RULE, AND UNRANKED BY THIS BOARD’S. The rule was “this card flips long only on a DAILY CLOSE OVER $144”; GLW closed $146.66. The short is over — unfilled, zero realised, since the entry needed a rejection in $141–147 confirmed lower and price went the other way. ⭐ The card beat itself with evidence it had published: it called GLW the board’s most two-sided chart because 1H OBV kept CLIMBING (149M → 157M → 162M) while the daily bled. That is what resolved it. ⚠️ It does NOT become a ranked long, for consistency rather than caution: GLW fails the same weekly filter that keeps LITE and BE out, and fails it hardest — weekly RSI 47.05 under the midline, ESTABLISHED cross at 96.5% of MACD, five bars and EXPANDING. Ranking it while they sit out on better readings would be the board contradicting itself again. ⭐ For the long: closed above the 200-EMA $142.03 and 9-EMA $143.51, daily histogram contracting a third bar. ⚠️ Against: the 50-EMA $170.73 is 16% overhead, daily RSI 42.48 under the midline, and ATR(14) $14.69 is 10.62% of price. Draft plan: dip holds $142–147, stop a close under $135, targets $161 → $171 → $185. It earns a row on a weekly RSI reclaim over a FULL week, or a close over $170.73.',
    lead: { rank: 25, status: 'live', entry: 'fade the rejection in $168–172.95', stop: '$185 (dead >$172.95 close)', targets: '$162 → $148 → $139.51', rr: '~2.1:1', edge: '⭐ THE CLEANEST SHORT ON THE BOARD, AND IT IS ANCHORED RATHER THAN REMEMBERED. The 08-07 high $170.43 ran into three references stacked in one range — the structure board’s daily supply $168–172.95, its 4H supply $168.79–187.07, and the daily 50-EMA $169.14 — and price closed $165.68 back beneath all of them. ⭐ The board reaches the same verdict independently of this card: `Short preferred; long on confirmation`. ⚠️ Rule B is met without straining — the $185 stop sits 1.03 ATR above the $170.48 midpoint and above the second supply band $177.58–190.11, so an ordinary session cannot reach it. ⚠️ Against the trade: the daily histogram +3.33 is four bars positive and expanding and the weekly −7.33 JUST TURNED to contracting, so momentum is improving into the zone — this is a fade, and it is priced as one. ⚠️ Rank 25 is an append, not a placement: the four-block key has not been re-sorted this session. Falsifier: a daily close over $172.95.' },
    side: 'short', accent: 'blue',
    date: '2026-08-09',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,212.21', change: '📅 CLOSE $1,212.21 (−3.68%) — the $1,184.37 low trades T1 $1,187, eleven days after the position was closed at $1,350.50',
    signal: '📅 CLOSE 08/07 — THE THESIS WAS RIGHT AND THE EXIT WAS EARLY. Closed $1,212.21 (−3.68%) on a $1,184.37 low, which trades T1 $1,187. The short was booked at $1,350.50 from the $1,400 fill — +3.5% realised, against the +15.2% T1 would have paid. That difference is the cost of the exit, and it is worth recording rather than smoothing over. ⚠️ Nothing changes on the ledger: the position is closed, so the target is not tagged. ⭐ The frame kept going: weekly hist −89.00, four bars negative and EXPANDING, price 19% under the 50-EMA $1,500.57.',
    lead: { rank: 24, status: 'booked', entry: 'filled $1,400', closed: '$1,350.50', stop: '$1,360 (dead >$1,346 close)', targets: '$1,187 → $1,050 → $1,000', rr: '~7:1', edge: '📒 FIRST LEG BOOKED: short $1,400 → closed $1,350.50 same session, +3.5% realised; the written plan stayed unfilled. Next entry only on a rejection at the broken $1,251–1,287 band off completed frames — T1 $1,187 is 3.4% from the PM print, no chase. A close back over $1,287 kills the continuation.' },
    side: 'short', accent: 'red',
    date: '2026-08-09', alert: true,
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$582.70', change: '📅 CLOSE $582.70 (+1.96%) — the $580 lid is CLEARED on a close for the first time after rejecting twice, with a new month high $586.09 and a fourth close over $547–550',
    signal: '📅 CLOSE 08/07 — THE LID CAME OFF, INTO SUPPLY. Closed $582.70 (+1.96%) above $580 for the first time after that level rejected on 08-05 and 08-06; a fourth close over the $547–550 gate, with the 50-day $570.40 and weekly 9-EMA $572.82 held. ⭐ The weekly histogram −8.36 is CONTRACTING after four sessions of widening, so semis no longer lag the index. ⚠️ But the overhead is not thin: the structure board has price INSIDE daily supply $571.35–592.01, with 4H supply $585.63–607.00 above it — and the $586.09 high tagged that edge before closing back under. Invalidation: a close under $580.',
    edge: '📅 The gate held it off: $540.53 (+0.30%) — the $550.15 overnight faded, $547–550 NOT closed above, so the group downtrend stands and every long on this board stays unfilled; $535 held, so no short re-armed either — undecided, the exact branch the plan named. Higher frames disagree: the MONTH closed red-with-a-wick ABOVE the 9-month EMA ≈$486 (intact uptrend, first corrective month, RSI 69 / Stoch 92.7 still unwinding) while the WEEK closed UNDER the weekly 9-EMA ≈$570 — SMH weaker than QQQ, which held all of its. Vol confirmed hard (VIX 15.82, VXN 25.57 through ≈26); breadth did not (%>200DMA 70.5% → 68.6%). Chop $535–550 until a close resolves it; watch breadth, not vol. 📉 Weekly hist -8.41 (47.63 vs 56.04 signal), 3 bars, 17.7% deep — holding.',
    side: 'long', accent: 'red',
    date: '2026-08-09',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$812.76', change: '📅 CLOSE $812.76 (−4.71%) — the $761.80 low traded THROUGH the $767 stop and closed $45.76 back above it; the position is −3.4% from the $841 fill',
    signal: '📅 CLOSE 08/07 — THE STOP WAS PIERCED INTRADAY AND SURVIVED ON THE CLOSE. Low $761.80 went $5.20 under the $767 stop before closing $812.76 (−4.71%), $45.76 back above it. The stop is close-basis, so the trade is alive by its own written rule — but it was inside the noise for a session, which is what a 0.9 ATR range does. ⚠️ The position is now −3.4% from the $841 fill, the only held long underwater. ⚠️ Price also lost the cluster it was leaning on: the 9-EMA $833.51 and 50-EMA $837.43 are now ABOVE price. Weekly hist −17.34, four bars negative and EXPANDING.',
    lead: { rank: 7, status: 'live', entry: 'filled $841', stop: '$767 (close)', targets: '$949 → $1,000 → $1,070', rr: '~3.1:1', edge: '⚠️ THE STOP WAS TOUCHED. The $761.80 low traded $5.20 through the $767 line before price closed $812.76, $45.76 back above it — and because the stop is written close-basis, the trade legitimately survives. Worth stating plainly rather than reporting the close alone: this plan spent a session inside its own invalidation. ⚠️ The position is −3.4% from the $841 fill, the only held long in the red, and the support it was leaning on has inverted — the 9-EMA $833.51 and 50-EMA $837.43 both sit ABOVE price now, so the cluster that was a floor is overhead supply. ⚠️ Weekly hist −17.34, four bars negative and EXPANDING; daily hist JUST TURNED red. ⭐ The one point in its favour is that $767 held on a closing basis on the exact session that tested it, which is what a structural stop is for. Falsifier: a daily close under $767 and this is done.' },
    side: 'long', accent: 'amber',
    date: '2026-08-09',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$71.94', change: '📅 CLOSE $71.94 (+6.80%) — price entered the $69–76 zone and closed at the session high $71.99, so the zone is reached but no rejection has printed',
    signal: '📅 CLOSE 08/07 — IN THE ZONE, NO REJECTION, STILL WAITING. Closed $71.94 (+6.80%) with the session high $71.99 — inside $69–76 for the first time, which is the setup presenting itself, not the trigger. This is rejection-only and price closed ON its high, which is the opposite of a rejection, so status stays `wait`. ⭐ The zone is anchored where it should be: the 50-EMA $72.54 and 200-EMA $75.65 sit inside it, two independent references bracketing the upper half. Kill is a CLOSE over $76, 5.6% up. ⚠️ Daily hist +2.37, six bars and expanding. Targets $56 → $52 → $48.42.',
    lead: { rank: 19, status: 'wait', entry: 'fade the rejection in $69–76', stop: '$80 (dead >$76 close)', targets: '$56 → $52 → $48.42', rr: '~3.2:1', edge: '⭐ THE ZONE IS FINALLY IN PLAY. $71.94 (+6.80%) puts price inside $69–76 for the first time, and the zone is properly built — 50-EMA $72.54 and 200-EMA $75.65 both sit within it, so the entry is priced at a confluence rather than at a remembered print. ⚠️ But arriving is not triggering. This is a rejection-only short and price closed at $71.94 against a $71.99 high — on the high, with nothing sold into it. Status stays `wait`, and calling it live because the zone was touched would be exactly the wrong lesson. ⚠️ Momentum is running against the eventual short: daily hist +2.37, six bars positive and expanding, weekly −3.33 contracting. ⭐ The upper zone is where the trade actually is — $74–76, into the 200-EMA, with the kill a close over $76 just beyond. Falsifier: a daily close over $76.' },
    side: 'short', accent: 'violet',
    date: '2026-08-09',
    story: 'stories/asts.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$187.97', change: '📅 CLOSE $187.97 (−1.01%) — the best position on the board at +16.1% from the $224 fill, with the $180.63 low now 2.4% from T1 $176.25',
    signal: '📅 CLOSE 08/07 — STILL THE BEST TRADE ON THE BOARD. Closed $187.97 (−1.01%) on a $180.63 low, which is 2.4% from T1 $176.25 — near, not there, so nothing is tagged. +16.1% from the $224 fill, and it held green on a session where the indices ran +1.2% to +2.0%, which is the useful part: this short is not simply riding the market down. ⭐ Frame intact: price under the 9-EMA $197.68 and 50-EMA $205.06, weekly hist −6.96, four bars negative and EXPANDING. Stop $207 untouched, 10.1% overhead. Targets $176.25 → $157 → $145.80.',
    lead: { rank: 1, status: 'live', entry: 'filled $224', stop: '$207 (close)', targets: '$176.25 → $157 → $145.80', rr: '~4.6:1', edge: '⭐ RANK 1 EARNS IT: +16.1% from the $224 fill, and on 08-07 it closed −1.01% while QQQ ran +1.17% and SMH +1.96%. Holding red against a broad green session is the single most useful fact here — the short is working on its own evidence rather than on market direction. ⭐ T1 $176.25 is close: the session low $180.63 came within 2.4%, and the weekly low sits exactly at the target. Not tagged, because near is not traded. ⭐ Structure is unbroken — price beneath the 9-EMA $197.68 and 50-EMA $205.06, weekly hist −6.96 four bars negative and EXPANDING, and the $207 stop is 10.1% overhead with no session having threatened it. ⚠️ Against: the daily hist +2.04 has been positive five bars and is contracting, so the descent is losing pace into the target. Falsifier: a daily close over $207.' },
    side: 'short', accent: 'indigo',
    date: '2026-08-09', alert: true,
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$539.14', change: '📅 CLOSE $539.14 (+2.21%) — T1 $529 traded on an unfilled plan; the $500–510 zone is 5.7% below and the session low only reached $528.01',
    signal: '📅 CLOSE 08/07 — T1 TRADED, ORDER UNFILLED. Closed $539.14 (+2.21%), high $545.94, which takes out T1 $529 — not taggable, because the $500–510 entry never filled and the low was $528.01. The zone sits 5.7% under price. ⭐ The daily turned: hist +1.58, JUST TURNED green, with price back over the 9-EMA $526.64 and the 50-EMA $529.02. ⚠️ The weekly went the other way — hist −4.48, JUST TURNED red — so the two frames disagree and the daily is the junior one. Stop $465, targets $550 → $590 beyond the traded first.',
    lead: { rank: 14, status: 'wait', entry: 'pullback holds $500–510', stop: '$465 (close)', targets: '$529 → $550 → $590', rr: '~2.1:1', edge: '⚠️ THE ZONE IS DRIFTING OUT OF REACH. T1 $529 traded on 08-07 while the order waited at $500–510, 5.7% below the close, with the session low stopping at $528.01. Unfilled means nothing is tagged. ⭐ The zone is still defensible, though: it was anchored under the 50-EMA and this session closed right on that average ($529.02) — so unlike the deeper misses on this board, price is only one ordinary pullback from the upper edge rather than a leg away. ⚠️ The frames disagree and that is the real caution: daily hist +1.58 JUST TURNED green, weekly hist −4.48 JUST TURNED red, in the same session. When the senior frame is the one turning down, a long entry wants the pullback rather than the chase. Falsifier: a weekly close under $491.68 kills the setup; a daily close under $500 fills it.' },
    side: 'long', accent: 'red',
    date: '2026-08-09',
    story: 'stories/amat.html',
  },
  {
    symbol: 'BE', exchange: 'NYSE',
    price: '$219.34', change: '📅 CLOSE $219.34 (−4.20%) — opened at the session high $240.18 and closed at the bottom third, giving back the entire $212.20–240.18 range',
    signal: '📅 CLOSE 08/07 — OPENED AT THE HIGH AND SOLD ALL DAY. Closed $219.34 (−4.20%) with the open $240.18 also the session high and the low $212.20 — a full give-back of the range and the worst intraday shape on the board this session. ⚠️ The daily histogram +5.65 is contracting and JUST TURNED red after five positive bars, and price closed 7% under the 50-EMA $236.44. ⭐ The 9-EMA $216.93 is $2.41 beneath the close and is the immediate line: hold it and this is a pullback inside the bounce; lose it and the $212.20 low and this month’s $191.00 are the next references. Weekly hist −12.45 contracting.',
    edge: '🕐 13:55 ET — ⚠️ STILL UNRANKED, ON BOTH TESTS. Weekly RSI reads 51.17, over the 50 named — but Monday opens the week, so that bar holds ONE session and the reading is today’s +6.43% relabelled; and the other condition, a $232 reclaim, was missed by 3.2% (high $224.64). ⭐ The breadth-tell role earned its keep instead: BE is power, not semis, and it is +6.43% while the semi heavyweights sit flat (AVGO +0.09%, LRCX +0.02%, MU +0.85%) — the clearest single statement that today’s move is the beaten-down AI-infra complex, not the group this board trades. 📅 UNRANKED — BE fails the weekly trend filter on both counts AND broke its zone in the same session. Weekly RSI 49.22 is UNDER the midline with an ESTABLISHED cross at 61.9% of MACD, four bars and EXPANDING: no trend confirmation. On the day itself it opened $230.77, ran $235.49 and collapsed to close $205.81 AT ITS LOW — straight through the $213–217 dip zone and finishing just $1.81 above the $204 stop. A card that is failing its trend filter and nearly stopping on the same bar is not one of the board’s sharpest trades. ⭐ What keeps it a long WATCH rather than a short: price still holds above the daily 200-EMA $186.75 — the line whose reclaim was this card’s founding event — it sits +3.1% above its 50% squeeze line at $199.62, and monthly RSI 62.51 says the long frame has bent, not broken. The re-drawn plan stands if it returns: entry holds $198–206 (Friday’s close down to the 9-EMA $198.95), stop a close under $186, targets $232 → $241 → $250. ⭐ The BREADTH-TELL role is unchanged and is why this card stays on the board at all: BE is power, not semis, so it reads whether the AI-infra move is broad or narrowing — worth watching with no position at all. It returns to the table on weekly RSI back over 50, or a reclaim of $232.',
    side: 'long', accent: 'amber',
    date: '2026-08-09',
    story: 'stories/be.html',
  },
  {
    symbol: 'ALAB', exchange: 'NASDAQ',
    price: '$334.17', change: '📅 CLOSE $334.17 (+0.81%) — the $329.00 low stopped $3 above the $319–326 entry, and 58% of the day’s move was given back into the close',
    signal: '📅 CLOSE 08/07 — THE NEAREST UNFILLED ZONE ON THE BOARD. Closed $334.17 (+0.81%) with the session low $329.00 — three dollars above the $319–326 entry, which is the closest any waiting long came to a fill this session without getting one. No target traded, so nothing was forgone. ⚠️ The close gave back 58% of the swing and finished under the $337.21 midpoint. ⭐ The zone is properly anchored: the 9-EMA $322.14 and 50-EMA $325.53 sit inside it, two independent references, and price is above both. ⚠️ Weekly hist −2.77 JUST TURNED red. Stop $284, targets $367.85 → $408.08 → $468.07.',
    lead: { rank: 12, status: 'wait', entry: 'pullback holds $319–326', stop: '$284 (close)', targets: '$367.85 → $408.08 → $468.07', rr: '~3.8:1', edge: '⭐ THE BEST-PLACED WAITING LONG ON THE BOARD, AND THE ONLY ONE THAT NEARLY FILLED. The $329.00 low came within three dollars of the $319–326 entry — against zone misses of 5–20% elsewhere — and no target traded, so nothing was forgone either way. ⭐ The zone is anchored the way Rule A asks: the 9-EMA $322.14 and 50-EMA $325.53 both sit inside it, so a fill happens where two independent references converge rather than at a remembered print, and the stop $284 is a genuine 1.5 ATR below the midpoint. ⚠️ The session was weaker than its green close: a $350.88 high given back 58% to finish under the $337.21 midpoint, and the weekly hist −2.77 JUST TURNED red. ⭐ Daily hist +4.77, four bars and expanding, is the counterweight. Falsifier: a daily close under $319 fills it; under $285.68 ends it.' },
    side: 'long', accent: 'emerald',
    date: '2026-08-09', alert: true,
    story: 'stories/alab.html',
  },
  {
    symbol: 'CRDO', exchange: 'NASDAQ',
    price: '$249.89', change: '📅 CLOSE $249.89 (+8.45%) — T1 $246.78 traded and the close is above it, while the $219–222 entry sits 12.6% below and was never approached',
    signal: '📅 CLOSE 08/07 — THE MOVE HAPPENED WITHOUT THE TRADE. Closed $249.89 (+8.45%) at the session high $250.00, taking out T1 $246.78 outright. The $219–222 entry is 12.6% below and the low was $231.25, so nothing filled and nothing is taggable. ⚠️ This is the second-worst zone miss on the board after PLTR, and the cause is the same: the zone was pinned near the 50-EMA $222.31 and price has not returned to that average during the advance. ⭐ Frame: RSI 57.01, daily hist +4.20 four bars and expanding, weekly hist −0.49 JUST TURNED green. Targets $280.50 → $308.67 remain.',
    lead: { rank: 13, status: 'wait', entry: 'pullback holds $219–222', stop: '$197 (close)', targets: '$246.78 → $280.50 → $308.67', rr: '~3.8:1', edge: '⚠️ A 12.6% GAP BETWEEN THE PLAN AND THE PRICE. Closed $249.89 (+8.45%) on the session high, T1 $246.78 taken out, while the order waited at $219–222 — never approached, session low $231.25. Unfilled, so nothing is tagged. ⚠️ The anchor is the failure: $219–222 was drawn on the 50-EMA $222.31, and price has spent the whole advance above the 9-EMA $225.67 without once tagging the 50. A zone pinned to an average price is leaving behind is not a level, it is a hope. ⭐ The trend itself is intact and strong — daily hist +4.20, four bars and expanding, weekly hist −0.49 JUST TURNED green, RSI 57.01 with room. ⭐ Targets $280.50 and $308.67 are still ahead of price, so the thesis has not been consumed the way PLTR’s was. Falsifier: this needs re-anchoring to the 9-EMA region or it will keep watching the move.' },
    side: 'long', accent: 'cyan',
    date: '2026-08-09',
    story: 'stories/crdo.html',
  },
  {
    symbol: 'DELL', exchange: 'NYSE',
    price: '$453.77', change: '📅 CLOSE $453.77 (+3.68%) — the $416.30 low traded THROUGH the $421 stop before closing $32.77 above it; the full plan is already tagged at $462',
    signal: '📅 CLOSE 08/07 — STOP PIERCED, PLAN ALREADY COMPLETE. Low $416.30 went $4.70 under the $421 stop, then price closed $453.77 (+3.68%), $32.77 back above — a close-basis stop, so the trade survives by its own rule, but it spent a session inside its invalidation. ⚠️ Worth saying plainly: the deepest target $462 is already tagged, so this is a finished plan being carried at full risk. +11.8% from the $406 fill. ⭐ Daily hist +2.99 JUST TURNED green. ⚠️ Weekly hist +6.14 is positive twenty-four bars but contracting eight — the long trend is ageing, not breaking.',
    lead: { rank: 4, status: 'booked', entry: 'filled $406', stop: '$421 (close)', targets: '$424 → $448 → $462', tagged: '$462', closed: '$462', rr: '~3.7:1', edge: '✅ BOOKED AT $462, THE DEEPEST TARGET — the plan delivered in full and is closed. ⚠️ It also spent 08-07 inside its own stop: The $416.30 low traded $4.70 through the $421 line before closing $453.77, $32.77 above it — close-basis, so it survives, and that is the second time on this board in one session (STX the other). ⚠️ The awkward part is that there is nothing left to play for: $462 is the DEEPEST target and it is already tagged, so the plan has delivered in full and is still being carried with a stop 7.2% away. That is risk without a remaining objective. ⭐ +11.8% from the $406 fill and the session itself was strong — daily hist +2.99 JUST TURNED green, price well over the 9-EMA $436.37 and 50-EMA $392.97. ⚠️ The weekly is ageing: hist +6.14, positive twenty-four bars but contracting for eight. Falsifier: a daily close under $421 — but the live question is whether a fully-tagged plan should still be open.' },
    side: 'long', accent: 'amber',
    date: '2026-08-09',
    story: 'stories/dell.html',
  },
  {
    symbol: 'MRVL', exchange: 'NASDAQ',
    price: '$218.72', change: '📅 CLOSE $218.72 (+3.89%) — +12.7% from the $194 fill with T2 tagged, but the close is INSIDE board supply $217.53–228.80; the long we want next is under $200, at demand $187.12–199.38',
    signal: '📅 CLOSE 08/07 — NOT ADDING HERE; THE LONG WE WANT IS UNDER $200. Closed $218.72 (+3.89%), +12.7% from the $194 fill with T2 $216 tagged — but the close is INSIDE the structure board’s daily supply $217.53–228.80, which is why the board reads `Short preferred` on a name this card is long. ⭐ We are not fading it, we are waiting lower: the re-entry is board demand $187.12–199.38, with the 4H 200-EMA $194 inside it — the level the original fill was taken at. Stop $174, 1.01 ATR under the $193.25 midpoint, R:R ~1.9:1. ⚠️ The halves interlock: the held stop is a close under $200, the top of that zone.',
    lead: { rank: 3, status: 'live', entry: 'filled $194', stop: '$200 (close)', targets: '$205 → $216 → $230', rr: '~6:1', tagged: '$216', edge: '⭐ HELD AND WORKING, BUT THIS IS NOT WHERE WE ADD. +12.7% from $194 with T2 $216 tagged, and 08-07 closed $218.72 inside the structure board’s daily supply $217.53–228.80 — which is exactly why the board reads `Short preferred, not near demand` on a position this card is long. Both are true at once: the trade is in profit AND the price is at supply. ⭐ The forward plan is a long UNDER $200, anchored rather than picked — the board’s nearest daily demand is $187.12–199.38 and the 4H 200-EMA $194 sits inside it, two independent references, and $194 is where the original fill was taken. The zone is 0.64 ATR wide, the $174 stop is 1.01 ATR below the $193.25 midpoint, and the R:R is ~1.9:1 to $230. ⚠️ The two halves interlock rather than conflict: the held stop is a daily close under $200, which is the TOP of the re-entry zone — the same close that ends this trade opens the next one, and that is a sequence to plan, not a contradiction to fix. ⚠️ T3 $230 sits inside the supply band overhead, so treat it as the exit rather than a breakout. Falsifier for the re-entry: a daily close under $174.' },
    side: 'long', accent: 'blue',
    date: '2026-08-09',
    story: 'stories/mrvl.html',
  },
  {
    symbol: 'AVGO', exchange: 'NASDAQ',
    price: '$427.76', change: '📅 CLOSE $427.76 (+1.71%) — closed above T1 $427.58 on a plan that never filled; the $402–408 zone is 4.8% below and the low held $421.61',
    signal: '📅 CLOSE 08/07 — CLOSED THROUGH T1, STILL UNFILLED. Closed $427.76 (+1.71%), a shade over T1 $427.58, on an order waiting at $402–408 — 4.8% below, and the session low only reached $421.61. Not taggable. ⭐ This is the strongest momentum on the waiting list: daily hist +5.38, seven bars positive and EXPANDING, Stoch 89.89, price above the 9-EMA $407.20, 50-EMA $393.14 and 200-EMA $363.08. ⚠️ The weekly hist −1.38 is still negative, contracting three bars — improving, not yet turned. Targets $473 → $495 are untouched and still worth the plan.',
    lead: { rank: 17, status: 'wait', entry: 'pullback holds $402–408', stop: '$387 (close)', targets: '$427.58 → $473 → $495', rr: '~5:1', edge: '⭐ THE BEST-LOOKING NAME ON THE WAITING LIST, AND STILL NOT BOUGHT. Daily hist +5.38, seven bars positive and EXPANDING — the longest clean momentum run on the board — with price over the 9-EMA $407.20, 50-EMA $393.14 and 200-EMA $363.08. ⚠️ T1 $427.58 was not just traded but CLOSED through, on an order that waits at $402–408, 4.8% below a session whose low was $421.61. Unfilled, nothing tagged. ⭐ Unlike PLTR and CRDO, the miss here is small and the zone is still plausible — 4.8% is one ordinary pullback in a name with this ATR, and $402–408 sits above the 50-EMA rather than at some abandoned print. ⚠️ The weekly hist −1.38 is contracting but still negative, so the senior frame has not confirmed. ⭐ Targets $473 and $495 are far above price, so the plan has not been consumed. Falsifier: a daily close under $393.' },
    side: 'long', accent: 'cyan',
    date: '2026-08-09',
    story: 'stories/avgo.html',
  },
  {
    symbol: 'AXON', exchange: 'NASDAQ',
    price: '$571.01', change: '📅 CLOSE $571.01 (+9.29%) — the first session after the −14.28% earnings reaction; the post-earnings stand-aside runs to 08-11 and this is day one of three',
    signal: '📅 CLOSE 08/07 — DAY ONE AFTER EARNINGS; STILL STAND ASIDE. Closed $571.01 (+9.29%), recovering roughly half of 08-06’s −14.28% reaction bar, but the gate is a date and not a price: day 0 was 08-06, so 08-07 and 08-10 pass and 08-11 is the first actionable session. ⚠️ The reason is on this chart. This month’s high $628.22 is the WICK of the reaction bar itself, and the weekly frame is already reading it as structure — hist +19.68, JUST TURNED green — which is exactly the false pivot the rule exists to sit out. ⭐ The 50-EMA $514.54 and 200-EMA $519.30 sit together 9% below as the real reference.',
    side: 'long', accent: 'emerald',
    date: '2026-08-09', alert: true,
    story: 'stories/axon.html',
  },
  {
    symbol: 'CIEN', exchange: 'NYSE',
    price: '$412.39', change: '📅 CLOSE $412.39 (+2.14%) — a fifth positive histogram bar, but price is still under the 50-EMA $430.78 and the weekly 9-EMA $423.78',
    signal: '📅 CLOSE 08/07 — RECOVERING INTO OVERHEAD, NOT THROUGH IT. Closed $412.39 (+2.14%), high $420.00, still beneath both the 50-EMA $430.78 and the weekly 9-EMA $423.78 — the two averages that cap this name — with this month’s high $427.00 between them. ⭐ Momentum is genuinely improving: daily hist +7.17, five bars positive and expanding four, and weekly hist −23.75 JUST TURNED to contracting after nine negative bars. ⚠️ But price closed on the swing midpoint $411.88, which is a pause rather than a thrust. The reclaim that matters is a daily close over $427.00; the support is the 9-EMA $396.98.',
    side: 'short', accent: 'red',
    date: '2026-08-09',
    story: 'stories/cien.html',
  },
  // ── 2026-07-31 · SCOUTED IN ── AMD, ASML and LRCX added after a computed
  // scout. All three pass the weekly trend filter that MU, LITE, BE, DRAM and
  // NBIS just failed — weekly RSI over the midline on a FRAGILE cross — which is
  // the whole basis for ranking them above names that were removed.
  {
    symbol: 'AMD', exchange: 'NASDAQ',
    price: '$483.36', change: '📅 CLOSE $483.36 (−1.21%) — the $498.82 high ran through structure-board supply $485–494.97 and closed back under it; the board’s own flip is a close over $503',
    signal: '📅 CLOSE 08/07 — THE SIDE FLIPS TO SHORT ON A PRINTED REJECTION. High $498.82 ran through the structure board’s daily supply $485–494.97 — the 9-EMA $489.57 and 50-EMA $487.19 sit inside that same band — and closed $483.36 back beneath it. ⚠️ The long is retired: its $449–476 zone missed a fill by six cents and the frame has since deteriorated — daily hist −2.26, negative forty-four bars, weekly −4.31 JUST TURNED red, price under both averages. Entry $485–494.97, stop $532, dead on a close over $503, which is the board’s own long-above level. Targets $448 → $427 → $402.',
    lead: { rank: 15, status: 'live', entry: 'fade the rejection in $485–494.97', stop: '$532 (dead >$503 close)', targets: '$448 → $427 → $402', rr: '~2.1:1', edge: '⚠️ SIDE FLIPPED LONG → SHORT, ON STRUCTURE RATHER THAN ON ONE SESSION. The 08-07 high $498.82 pushed through the structure board’s daily supply $485–494.97 and closed back under it, with the 9-EMA $489.57 and 50-EMA $487.19 inside the same band — two independent references on top of the zone itself. ⭐ The board reads it the same way without reference to this card: `Two-way — short now, long above $503`, so the invalidation is given rather than invented. ⚠️ The long being replaced was not wrong about its level — a $476.06 low against a $476 zone top is a six-cent miss — but it never filled, and the frame has turned since: daily hist −2.26 negative forty-four bars, weekly −4.31 JUST TURNED red. ⚠️ Rule B: the $532 stop is 1.10 ATR above the $490 midpoint on a 7.92% ATR name, so the stop is outside noise rather than inside it. Falsifier: a daily close over $503 — and that makes this a long again, not merely a scratch.' },
    side: 'short', accent: 'amber',
    date: '2026-08-09',
    story: 'stories/amd.html',
  },
  {
    symbol: 'ASML', exchange: 'NASDAQ',
    price: '$1,740.99', change: '📅 CLOSE $1,740.99 (+2.15%) — closed above T1 $1,735 unfilled; the $1,681–1,704 zone is 2.2% below and the low held $1,720.11',
    signal: '📅 CLOSE 08/07 — THE NEAREST MISS ON THE BOARD. Closed $1,740.99 (+2.15%), through T1 $1,735, with the order at $1,681–1,704 — 2.2% below, low $1,720.11. Not taggable, but of the eight waiting longs that watched a target trade this is the one whose zone is still genuinely in reach. ⭐ The zone is well anchored: the 50-EMA $1,705.10 sits on its upper edge and the weekly 9-EMA $1,719.99 just above, two independent references. ⭐ Daily hist +3.17 JUST TURNED green. ⚠️ Weekly hist −15.96, three bars negative and EXPANDING. Targets $1,876 → $1,943 stand.',
    lead: { rank: 11, status: 'wait', entry: 'pullback holds $1,681–1,704', stop: '$1,608 (close)', targets: '$1,735 → $1,876 → $1,943', rr: '~3:1', edge: '⭐ THE ONE WAITING LONG WHOSE ZONE STILL WORKS. T1 $1,735 traded and closed through on 08-07, unfilled — but the entry at $1,681–1,704 is only 2.2% under the close against a $1,720.11 low, which is a normal pullback away rather than a leg away. ⭐ It is anchored the way Rule A asks: the 50-EMA $1,705.10 sits on the upper edge and the weekly 9-EMA $1,719.99 immediately above it, two independent references, so a fill happens at a confluence and not at a remembered print. ⭐ Daily hist +3.17 JUST TURNED green after a long negative run, with price over the 9-EMA $1,692.79. ⚠️ The weekly is the problem: hist −15.96, three bars negative and EXPANDING, so the senior frame is deteriorating while the daily improves — that argues for taking the fill at the zone rather than chasing $1,740. ⚠️ Stop $1,608 is 7.6% from the zone midpoint. Falsifier: a weekly close under $1,582.' },
    side: 'long', accent: 'blue',
    date: '2026-08-09',
    story: 'stories/asml.html',
  },
  {
    symbol: 'LRCX', exchange: 'NASDAQ',
    price: '$311.35', change: '📅 CLOSE $311.35 (+1.82%) — the $264–277 entry is now 12.4% below price and no session since it was drawn has come near it',
    signal: '📅 CLOSE 08/07 — THE ZONE IS 12.4% AWAY. Closed $311.35 (+1.82%), low $303.83, against an order at $264–277 that price has not approached. No target traded, so unlike PLTR or CRDO nothing was forgone — but a plan whose fill is 12.4% below the market is not a plan, it is a watchlist entry with numbers attached. ⚠️ The daily and weekly disagree: daily hist +2.48, three bars and expanding, with price over the 9-EMA $304.00; weekly hist −7.46, three bars negative and EXPANDING, price under the weekly 9-EMA $318.65. Stop $244, targets $323.64 → $415.49 → $438.50.',
    lead: { rank: 21, status: 'wait', entry: 'pullback holds $264–277', stop: '$244 (close)', targets: '$323.64 → $415.49 → $438.50', rr: '~6.3:1', edge: '⚠️ A PLAN WAITING 12.4% BELOW THE MARKET. $264–277 has not been approached since it was drawn — the 08-07 low was $303.83 — and at that distance the R:R of ~6.3:1 is arithmetic on a fill that is not going to happen, which flatters the rank rather than informing it. ⭐ The saving grace is that nothing was lost: no target traded, so this is a dormant plan rather than a missed one, unlike PLTR where the whole move ran through an empty order. ⚠️ The frames split: daily hist +2.48, three bars and expanding, price above the 9-EMA $304.00 — but weekly hist −7.46, three bars negative and EXPANDING, with price beneath the weekly 9-EMA $318.65. A daily bounce inside a deteriorating weekly is the configuration this board keeps mistaking for a turn. ⭐ T1 $323.64 is only 3.9% overhead, which says the targets are priced for today and the entry is not. Falsifier: re-anchor the zone or drop the rank.' },
    side: 'long', accent: 'emerald',
    date: '2026-08-09',
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
    price: '$363.86', change: '📅 CLOSE $363.86 (+1.22%) — gave back 60% of the day’s range into the close; the $340–347 entry sits 4.9% below and held all session',
    signal: '📅 CLOSE 08/07 — STRONG NAME, NO FILL, AND A SOFT CLOSE. Closed $363.86 (+1.22%) after a $370.50 high, giving back 60% of the swing and finishing below the $364.99 midpoint. The $340–347 order is 4.9% under price; the low was $359.15, so nothing filled and no target traded. ⭐ The trend is genuine: daily hist +1.61 three bars and expanding, RSI 64.25, price above the 9-EMA $350.00, 50-EMA $312.02 and 200-EMA $238.93. ⚠️ The weekly hist +9.31 is positive sixteen bars but CONTRACTING three — strength that is decelerating. Targets $371.47 → $376.98 → $424.',
    lead: { rank: 18, status: 'wait', entry: 'pullback holds $340–347', stop: '$328 (close)', targets: '$371.47 → $376.98 → $424', rr: '~5.2:1', edge: '⭐ ONE OF THE FEW WAITING LONGS THAT MISSED NOTHING: no target traded on 08-07, so the unfilled order cost nothing, and the $340–347 zone is 4.9% below a $359.15 low — reachable on an ordinary pullback rather than stranded. ⭐ The trend is real and broad: price above the 9-EMA $350.00, 50-EMA $312.02 and 200-EMA $238.93, RSI 64.25, daily hist +1.61 three bars and expanding. ⚠️ The close is the tell — a $370.50 high given back to $363.86, 60% of the range, finishing under the $364.99 midpoint. That is distribution into strength, and it is the kind of bar that precedes the pullback this order is waiting for. ⚠️ The weekly hist +9.31 has been positive sixteen bars and is CONTRACTING for three, so the senior frame is decelerating from a high base. Falsifier: a daily close under $347 fills it; under $328 ends it.' },
    side: 'long', accent: 'amber',
    date: '2026-08-09',
    story: 'stories/panw.html',
  },
  {
    symbol: 'CRWD', exchange: 'NASDAQ',
    price: '$214.42', change: '📅 CLOSE $214.42 (+3.39%) — T1 $216.36 traded at the $216.57 high on an unfilled plan; the $195–200 entry is 7.2% below and the low held $208.20',
    signal: '📅 CLOSE 08/07 — T1 TRADED BY TWENTY-ONE CENTS, UNFILLED. High $216.57 against T1 $216.36 — the target traded, on an order waiting at $195–200, 7.2% below a $208.20 low. Nothing taggable. Closed $214.42 (+3.39%). ⭐ The frame is one of the strongest here: RSI 66.56, daily hist +1.93 four bars and expanding, weekly hist +4.50 sixteen bars positive and JUST TURNED to expanding, price above the 9-EMA $202.35, 50-EMA $182.34 and 200-EMA $143.61. ⚠️ That strength is the problem for the entry — nothing in this structure suggests a return to $195–200. Targets $219.35 → $246.',
    lead: { rank: 20, status: 'wait', entry: 'pullback holds $195–200', stop: '$189 (close)', targets: '$216.36 → $219.35 → $246', rr: '~5.7:1', edge: '⚠️ THE TARGET TRADED BY TWENTY-ONE CENTS AND THE ORDER WAS 7.2% AWAY. T1 $216.36 against a $216.57 high, on an entry at $195–200 that the $208.20 low never approached. Unfilled, nothing tagged. ⭐ The frame is among the best on the board and that is precisely what makes the zone wrong: RSI 66.56, daily hist +1.93 four bars and expanding, weekly hist +4.50 positive sixteen bars and now EXPANDING, price above the 9-EMA $202.35, 50-EMA $182.34 and 200-EMA $143.61. A name in that configuration does not hand back 7.2% to fill a patient bid. ⚠️ The zone was anchored to the 50-EMA $182.34 region and the trend has left it — the honest reference now is the 9-EMA, which price has held the whole advance. ⭐ Targets $219.35 and $246 are still above price. Falsifier: re-anchor the entry or accept this is a watch, not a plan.' },
    side: 'long', accent: 'red',
    date: '2026-08-09',
    story: 'stories/crwd.html',
  },
  {
    symbol: 'FTNT', exchange: 'NASDAQ',
    price: '$159.64', change: '📅 CLOSE $159.64 (−0.29%) — a third straight decline that gave back the whole $158.55–165.50 range and lost the 9-EMA $160.22',
    signal: '📅 CLOSE 08/07 — THE QUIETEST BREAK ON THE BOARD. Closed $159.64 (−0.29%) — a small number hiding a third consecutive decline (164.13 → 160.11 → 159.64), a 100% give-back of the $158.55–165.50 range, and the loss of the 9-EMA $160.22. ⚠️ The daily histogram −0.11 JUST TURNED negative, and the weekly hist +2.39 has been CONTRACTING for eight bars from a weekly RSI of 74.81 — a high base losing pace, which is the more informative of the two frames here. ⭐ Price is still 7% over the 50-EMA $148.61. The line is this month’s low $158.27, 0.9% below: hold it or the weekly deceleration has its confirmation.',
    side: 'long', accent: 'blue',
    date: '2026-08-09',
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
    price: '$167.86',
    change: '📅 CLOSE $167.86 (+4.66%) — closed on the session high $167.95, a new month high, but still under the 200-EMA $171.78 and the 50-EMA $178.24',
    signal: '📅 CLOSE 08/07 — CLOSED ON ITS HIGH, STILL UNDER THE AVERAGES. Closed $167.86 (+4.66%) at the session high $167.95 — a new month high, and only 1% of the day’s range given back, which is the cleanest close shape on the board. ⚠️ It changes nothing structural yet: the 200-EMA $171.78 is 2.3% overhead and the 50-EMA $178.24 6.2%, and the weekly cross is ESTABLISHED — four bars deep with the histogram −5.70 at 253.9% of MACD, so the MACD must regain 5.70 points to un-cross. ⭐ Daily hist +1.24, two bars and expanding; weekly hist JUST TURNED to contracting. The reclaim to watch is a daily close over $171.78.',
    side: 'short',
    date: '2026-08-09',
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
