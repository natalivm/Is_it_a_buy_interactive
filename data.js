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
      symbol: 'VIX', value: '14.90', range: [13, 22], change: '📅 close 14.90 (−1.65%) — sixth session under 16 and a fresh low for the move; the week closed −6.94% and sits 7.1% over the weekly deviation-band floor 13.83',
      verdict: 'bull',
      read: 'Sixth consecutive close under 16 and a new low for the move at 14.90. Daily MACD histogram −0.33, negative and expanding a fifth bar; the weekly cross is ESTABLISHED at 36.5% of MACD and 17 bars deep — the most confirmed calm-vol reading this board tracks. ⚠️ And the caveat sharpened again: daily Stoch %K is 2.98, down from 8.41 and effectively pinned on the floor. ⭐ The weekly chart puts a nearer and more current floor under it than the 12-month low does — the weekly deviation band sits at 13.83, just 7.1% below, and the week itself closed −6.94%. So the compression is real and it is running out of room on its own frame, not merely against a year-old print. ⚠️ And it runs out FIRST: VXN sits 19.9% above its own weekly floor 18.28 against VIX’s 7.1%, so if the compression continues it has to come out of Nasdaq vol, narrowing VXN/VIX from the top rather than the bottom. The asymmetry from here favours vol expansion, not further compression. ⚠️ The gauge floor moved 15 → 13 this refresh for a mechanical reason, not a judgement one: the close printed under the old bound, which would have parked the needle at the end of the scale.',
    },
    {
      symbol: 'VXN', value: '22.82', range: [18, 34], change: '📅 close 22.82 (−4.72% on the day, −12.23% on the week) — sixth session under ≈26, sitting ON the weekly band 22.78 with the next one 18.28, still 19.9% below',
      verdict: 'neutral',
      read: '⚠️ HELD AT NEUTRAL, on the same ratio argument — eased, not resolved. VXN closed 22.82, a sixth session under ≈26, and the WEEK closed −12.23% against VIX’s −6.94%: Nasdaq vol fell nearly twice as fast, which is what took VXN/VIX from 1.58 to 1.53. ⚠️ It still sits above BOTH of this board’s 12-month endpoints (17.09/13.38 = 1.28 at the calm extreme, 34.37/35.30 = 0.97 at the fearful one), and this board trades the Nasdaq complex exclusively, so a wide ratio is not neutral information for it. ⭐ The weekly frame says where the rest of the narrowing has to come from: price is sitting ON the 22.78 band with the next one 18.28, 19.9% below, while VIX has only 7.1% to its floor 13.83. The room is on this side. ⚠️ Stated with its limit, unchanged: two non-simultaneous extremes are a crude reference, not a percentile — the level is measured, the "still wide" reading is inference. ⚠️ The gauge bounds move 22–33 → 18–34 to bracket the weekly bands, the same mechanical reason VIX’s floor moved 15 → 13.',
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
// ── RANK RE-SORT — 2026-08-09 ───────────────────────────────────────────────
// `rank` had drifted badly: it was append-order, not the documented key, and by
// the end it was actively misleading — CRWD sat at 20 with the nearest fill on
// the board, NVDA at 22 with the best structure, ALOY at 26 while sitting ON
// its entry. Every rank below is now computed from the four-block key:
//
//   1  HELD      status live + `filled` entry, by realised % since the fill
//   2  LIVE      rejection printed, unfilled, by the reward still on the table
//   3  WAITING   by distance-to-fill in ATR ascending, R:R breaking ties
//   4  BOOKED    parked last (script.js filters these out of the table, but the
//                field stays — a missing rank sorts FIRST, which would put a
//                booked trade at the top if it ever went live again)
//
// ⚠️ Ranks 23–28 are the SAME block 3, but they could not be measured in ATR:
// AMAT and CRDO have no computed ATR(14) on the
// structure board. They are ordered among themselves by percent-distance and
// parked after the ATR-measured plans — NOT a judgement that they are worse.
// ASTS, ASML and ALAB have since been measured and moved into the block proper —
// ALAB from 25 to near the top, which is what the parking was distorting. Mixing
// percent and ATR in one ordering was the alternative, and a ranking whose key
// changes meaning halfway down is not a ranking.
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
    lead: { rank: 21, status: 'wait', entry: 'fade the rejection in $177–188.50', stop: '$192 (dead >$188.50 close)', targets: '$168.45 → $134.19', rr: '~5.2:1', edge: '⚠️ SIDE FLIPPED LONG → SHORT, AND THE STRUCTURE BOARD DISAGREES — stated rather than hidden, because the two are allowed to disagree and this card is taking the other side of `Long preferred — do not chase`. ⚠️ The long is retired on arithmetic, not sentiment: $150, $157 and $168 all traded on 08-07 while the order sat at $141–143, 3.24 ATR below the close — the most stranded zone on this board and unreachable by any ordinary sequence of sessions. ⭐ The short is anchored where supply actually is. The board stacks two daily bands — $166.98–177.29, which price closed inside, and $177.02–188.50 above it — and they abut at $177; two independently derived zones sharing an edge is a confluence, not a remembered print, and the upper band carries twenty-six closes-in since January. ⚠️ Rule B: the $192 stop is 1.03 ATR above the $182.75 midpoint. ⚠️ Volume is not carried in this feed, so the earnings-cadence check could not be run — if 08-07 was a reaction bar the three-session gate runs to 08-12. Falsifier: a daily close over $188.50.' },
    side: 'short',
    date: '2026-08-09',
    story: 'stories/pltr.html',
  },
  {
    symbol: 'META', exchange: 'NASDAQ',
    price: '$592.10', change: '📅 CLOSE $592.10 (+0.37%) — a $598.74 high given back 73% into the close; +10.7% from the $535 fill with T1 $609 still 2.9% overhead',
    signal: '📅 CLOSE 08/07 — GRINDING, NOT ADVANCING. Closed $592.10 (+0.37%) after a $598.74 high, handing back 73% of the swing to finish under its $594.89 midpoint. +10.7% from the $535 fill; T1 $609 is 2.9% away and untouched. ⭐ The weekly turned for the first time in this trade: hist +0.33, JUST TURNED green, and the daily hist −2.48 is contracting a fifth bar. ⚠️ Price is still under the 50-EMA $603.88 and 200-EMA $627.33, so the advance is happening beneath the averages that matter. The $559 stop sits 5.6% below — outside noise, but it risks giving back half the gain.',
    edge: '⭐ +10.7% FROM $535 AND THE WEEKLY FINALLY TURNED — hist +0.33, green for the first time in the trade, with the daily hist −2.48 contracting a fifth bar. Two frames repairing together is the best evidence this position has had. ⚠️ But the session shape says grind, not thrust: a $598.74 high given back 73% to close under the $594.89 midpoint, and price still beneath the 50-EMA $603.88 and 200-EMA $627.33. T1 $609 has not been touched. ⚠️ The stop is the live question, and it is the one this board has already written down: $559 sits 5.6% under price, so a stop-out hands back more than half the open gain, while 1.00 ATR ($565) would still be outside ordinary noise and lock materially more. That is a trailing decision, not a thesis change. Falsifier: a daily close under $559.',
    lead: { rank: 3, status: 'live', entry: 'filled $535', stop: '$559 (close)', targets: '$609 → $629 → $645', rr: '~4.6:1', edge: '⚠️ A WINNING TRADE WHOSE STOP WAS STILL SET TO BOOK A LOSS. +10.3% from the $535 fill and the stop sat at $515 — $20 BELOW the entry — so any flush would have turned a ten-percent winner into a −3.7% loser. It trails to $559, this month’s low, which locks +4.5% and sits 2.5 ATR under price; there is no structure at 1.0 ATR to anchor to and inventing one is worse than being a little wide. ⭐ The fill itself remains the board’s best-timed entry. ⚠️ But nothing in the chart says add: price is beneath the 50-EMA $604.36 and 200-EMA $627.69, the daily histogram has been negative eleven bars and the monthly ten, and this month’s $601.00 high failed under last month’s $686.08. Manage it down, do not re-buy it. Falsifier: a close under $559 ends the trade with the gain banked.' },
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
    lead: { rank: 4, status: 'live', entry: 'filled $307', stop: '$310 (close)', targets: '$330 → $350 → $365', rr: '~19:1', tagged: '$330', edge: '⭐ T1 IS IN THE BOOK. $333.73 intraday trades T1 $330 on a filled plan, so it is tagged — an intraday touch counts and the $328.58 close back under the level does not undo it. +7.0% from $307, with the stop at $310 keeping the worst case +1.0%. ⭐ The daily frame turned for the first time in this trade: hist +1.02 after eighteen negative bars, and price closed back over the 9-EMA $324.28. ⚠️ One bar is not a structure, and the weekly says so — hist −9.55, seven bars negative and EXPANDING, with the 50-EMA $367.11 and 200-EMA $387.24 both far above. So this stays the weakest chart of the held longs even after a tagged target. ⚠️ Note the R:R still reads ~19:1 only because a trailed stop is measured off the original fill; risk collapsed to $3, the trade did not get nineteen times better. Falsifier: a close under $310, which now ends the trade green.' },
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
    price: '$223.96', change: '📅 $223.96 at the close — every frame bullish and the plan re-anchored to $217–220; the real gate is $229–232, and chasing $224–225 is the one bad entry',
    signal: '📅 08/07 — THE STRONGEST MULTI-FRAME STRUCTURE ON THE BOARD, AT A CHASE PRICE. Monthly, weekly, daily and 4H are all bullish — $190–195 was bought, $207–212 reclaimed, and price is accelerating toward prior highs with 4H RSI ~73. ⚠️ Location is the problem: $224.50–227.50 supply is immediately above and the real gate is $229–232. ⭐ The plan moves off the stranded $205–209 zone to $217–220, 0.51 ATR below price, with the stop at $207 — the level the analysis itself names as invalidation — 1.47 ATR from the midpoint. Targets $227.50 → $232 → $240. ⚠️ Computed ATR(14) $7.83 (3.50%): the least volatile new name here.',
    lead: { rank: 19, status: 'wait', entry: 'pullback holds $217.00–220.00', stop: '$207.00 (close)', targets: '$227.50 → $232.00 → $240.00', rr: '~1.9:1', edge: '⭐ EVERY FRAME POINTS THE SAME WAY — monthly, weekly, daily and 4H — which no other name on this board can say, and it is why the structure row ties for top of the long block. The late-July $190–195 washout was bought, $207–212 is reclaimed, OBV is rising and price is accelerating into prior highs. ⚠️ And that is exactly why the entry is not here: $224.50–227.50 supply sits immediately overhead, the real all-time-high gate is $229–232, and the 4H RSI is ~73. Chasing $224–225 buys the extension directly into the seller. ⭐ The plan is re-anchored from the old $205–209 zone — which the computed ATR now puts 1.91 ATR below price, genuinely stranded — to $217–220, the immediate 4H breakout demand at 0.51 ATR below. The $207 stop is not a round number either: it is the level this read names as the invalidation, sitting at the base of 4H/daily demand $207–211, and it is 1.47 ATR from the $218.50 midpoint. ⚠️ R:R ~1.9:1 is modest, and that is the honest cost of a stop placed below a real demand band rather than inside it. ⭐ Above $232 with a retest the ladder opens $235–240, then $250 as a psychological reference. ⚠️ Computed ATR(14) is $7.83 (3.50%) — the least volatile of everything added this session. Falsifier: daily acceptance under $207 opens $203–199; losing $199 exposes $195–190.' },
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
    price: '$434.30', change: '📅 CLOSE $434.30 (−3.81%) — a second heavy session after the 08-06 earnings reaction (−13.03%); ⛔ stand aside to 08-11 under the three-session rule',
    signal: '📅 CLOSE 08/07 — POST-EARNINGS, SO THE GATE DECIDES, NOT THE LEVELS. ⛔ WDC reported after the close on 08-05 ($519.17, −5.36%) and gapped to $428.89 the next morning, closing −13.03%. That makes 08-06 the reaction bar, so 08-07 and 08-10 pass and 08-11 is the first actionable session. ⚠️ The levels stay live and keep being refreshed — the gate governs WHEN a plan may be taken, not what it is. Closed $434.30 (−3.81%), 12% under the 9-EMA $494.25 and 17% under the 50-EMA $522.86. Both frames deteriorating: daily hist −5.23 expanding, weekly −16.98 four bars. Month low $407.48 is the line.',
    side: 'long',
    date: '2026-08-09', alert: true,
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$101.65', change: '📅 CLOSE $101.65 (+1.84%) — the rejection printed: $103.65 high, straight into the 50-EMA $103.01, then a close back inside the zone, 35 cents under the $102 kill level',
    signal: '📅 CLOSE 08/07 — THE REJECTION PRINTED AND THE TRADE IS LIVE. High $103.65 cleared the zone top and the 50-EMA $103.01, then price closed $101.65 (+1.84%) back INSIDE $96–102. That is the rejection this plan was waiting on, so status moves `wait` → `live`. ⚠️ It is also the narrowest survival on the board: the kill is a CLOSE over $102 and this closed $0.35 under it, 0.34%. One ordinary session ends it. ⭐ The evidence is still the weekly: hist −4.04, four bars negative and EXPANDING, against a daily that has bounced four. Targets $85 → $80 → $75 → $66, stop $108.',
    lead: { rank: 7, status: 'live', entry: 'rejection printed in $96–102', stop: '$108 (dead >$102 close)', targets: '$85 → $80 → $75 → $66', rr: '~3.7:1', edge: '⭐ THE TRIGGER FIRED, AT THE RIGHT PLACE. $103.65 pushed through the $102 zone top and into the 50-EMA $103.01, then sold back to close $101.65 inside the zone — a rejection off a live reference, which is exactly what the rejection-only rule was waiting for. Status goes `live`. ⚠️ And it is the most fragile plan on the board by a distance: invalidation is a CLOSE over $102, and this closed 35 cents — 0.34% — beneath it, having already traded $1.65 above it intraday. There is no cushion here at all, so size is the whole risk decision. ⭐ The weekly carries the thesis: hist −4.04, four bars negative and EXPANDING, while the daily has bounced four. ⚠️ Against: the 200-EMA $76.46 is 25% below and the monthly frame has not broken. Falsifier: a daily close over $102, and it is one green session away.' },
    side: 'short', accent: 'blue',
    date: '2026-08-09', alert: true,
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$877.57', change: '📅 CLOSE $877.57 (−0.44%) — opened at the session high $904.65, through T1 $892, and closed at the bottom of the range on an unfilled plan',
    signal: '📅 CLOSE 08/07 — T1 TRADED ON THE OPENING PRINT AND NOTHING ELSE. The open $904.65 was also the high and cleared T1 $892; price then sold to $847.02 and closed $877.57 (−0.44%), giving back 100% of the range. The $800–823 entry is 6.6% below and was never approached, so nothing is taggable. ⚠️ Opening at the high and closing at the low is the weakest bar shape on the board this session. ⭐ Daily hist +1.99 JUST TURNED green and the 9-EMA $873.67 held the close. ⚠️ Weekly hist −16.76, negative and EXPANDING, with the 50-EMA $889.51 now overhead.',
    lead: { rank: 23, status: 'wait', entry: 'pullback holds $800–823', stop: '$726 (close)', targets: '$892 → $930 → $996–1,000', rr: '~2.2:1', edge: '⚠️ A TARGET TAKEN OUT BY THE OPENING PRINT, ON AN ORDER 6.6% AWAY. $904.65 was both the open and the high, through T1 $892; the session then sold to $847.02 and closed $877.57, a 100% give-back. The $800–823 entry was never approached — unfilled, nothing tagged. ⚠️ The bar shape is the finding: open at the high, close near the low, is distribution, and it happened on the same session the rest of the board closed green. ⭐ Underneath, the daily is repairing — hist +1.99 JUST TURNED green and the 9-EMA $873.67 held the close. ⚠️ The weekly disagrees and is the senior frame: hist −16.76, negative and EXPANDING, with price now under the 50-EMA $889.51. ⭐ The zone sits on the month low $770.10 region, a real reference. Falsifier: a weekly close under $770.10.' },
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
    lead: { rank: 11, status: 'live', entry: 'fade the rejection in $168–172.95', stop: '$185 (dead >$172.95 close)', targets: '$162 → $148 → $139.51', rr: '~2.1:1', edge: '⭐ THE CLEANEST SHORT ON THE BOARD, AND IT IS ANCHORED RATHER THAN REMEMBERED. The 08-07 high $170.43 ran into three references stacked in one range — the structure board’s daily supply $168–172.95, its 4H supply $168.79–187.07, and the daily 50-EMA $169.14 — and price closed $165.68 back beneath all of them. ⭐ The board reaches the same verdict independently of this card: `Short preferred; long on confirmation`. ⚠️ Rule B is met without straining — the $185 stop sits 1.03 ATR above the $170.48 midpoint and above the second supply band $177.58–190.11, so an ordinary session cannot reach it. ⚠️ Against the trade: the daily histogram +3.33 is four bars positive and expanding and the weekly −7.33 JUST TURNED to contracting, so momentum is improving into the zone — this is a fade, and it is priced as one. ⚠️ Rank 25 is an append, not a placement: the four-block key has not been re-sorted this session. Falsifier: a daily close over $172.95.' },
    side: 'short', accent: 'blue',
    date: '2026-08-09',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,212.21', change: '📅 CLOSE $1,212.21 (−3.68%) — the $1,184.37 low trades T1 $1,187, eleven days after the position was closed at $1,350.50',
    signal: '📅 CLOSE 08/07 — THE THESIS WAS RIGHT AND THE EXIT WAS EARLY. Closed $1,212.21 (−3.68%) on a $1,184.37 low, which trades T1 $1,187. The short was booked at $1,350.50 from the $1,400 fill — +3.5% realised, against the +15.2% T1 would have paid. That difference is the cost of the exit, and it is worth recording rather than smoothing over. ⚠️ Nothing changes on the ledger: the position is closed, so the target is not tagged. ⭐ The frame kept going: weekly hist −89.00, four bars negative and EXPANDING, price 19% under the 50-EMA $1,500.57.',
    lead: { rank: 29, status: 'booked', entry: 'filled $1,400', closed: '$1,350.50', stop: '$1,360 (dead >$1,346 close)', targets: '$1,187 → $1,050 → $1,000', rr: '~7:1', edge: '📒 FIRST LEG BOOKED: short $1,400 → closed $1,350.50 same session, +3.5% realised; the written plan stayed unfilled. Next entry only on a rejection at the broken $1,251–1,287 band off completed frames — T1 $1,187 is 3.4% from the PM print, no chase. A close back over $1,287 kills the continuation.' },
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
    lead: { rank: 6, status: 'live', entry: 'filled $841', stop: '$767 (close)', targets: '$949 → $1,000 → $1,070', rr: '~3.1:1', edge: '⚠️ THE STOP WAS TOUCHED. The $761.80 low traded $5.20 through the $767 line before price closed $812.76, $45.76 back above it — and because the stop is written close-basis, the trade legitimately survives. Worth stating plainly rather than reporting the close alone: this plan spent a session inside its own invalidation. ⚠️ The position is −3.4% from the $841 fill, the only held long in the red, and the support it was leaning on has inverted — the 9-EMA $833.51 and 50-EMA $837.43 both sit ABOVE price now, so the cluster that was a floor is overhead supply. ⚠️ Weekly hist −17.34, four bars negative and EXPANDING; daily hist JUST TURNED red. ⭐ The one point in its favour is that $767 held on a closing basis on the exact session that tested it, which is what a structural stop is for. Falsifier: a daily close under $767 and this is done.' },
    side: 'long', accent: 'amber',
    date: '2026-08-09',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$71.94', change: '📅 CLOSE $71.94 — SIDE FLIPPED SHORT → LONG. Price ran $55.74 → $71.94 in three sessions, so the old $69–76 short zone now straddles price instead of sitting above it',
    signal: '📅 08/07 — THE SHORT IS RETIRED; THE STRUCTURE MOVED UNDER IT. Price ran $55.74 → $71.94 in three sessions (+29%), reclaimed $62–65, and the old $69–76 rejection zone now STRADDLES the close rather than capping it. Supply is $74–76 and $78–81; $68–70 is demand. ⭐ Daily and 4H are bullish, the monthly holds above its ~$58 mid-band. ⚠️ The weekly is NOT repaired until $81 is accepted, and the 4H is riding the upper band with RSI ~67. Entry $68–70, 0.35 ATR below; stop $63, 1.08 ATR; targets $74 → $78 → $85. ⚠️ Computed ATR(14) $5.58 (7.76%).',
    lead: { rank: 16, status: 'wait', entry: 'pullback holds $68.00–70.00', stop: '$63.00 (close)', targets: '$74.00 → $78.00 → $85.00', rr: '~2.7:1', edge: '⚠️ SIDE FLIPPED SHORT → LONG, AND THE REASON IS STRUCTURAL RATHER THAN A CHANGE OF MIND. The short at $69–76 was drawn when price sat far below it; price then travelled $55.74 → $71.94 in three sessions, reclaimed $62–65, and that zone now straddles the close instead of capping it. A zone price is trading INSIDE is not a rejection zone — supply has moved up to $74–76 and $78–81, and $68–70 has become the demand under price. ⭐ The frames back it: daily reversal confirmed, 4H making higher highs with improving OBV, monthly holding above its ~$58 mid-band after the bounce off $55–58. ⚠️ What is NOT repaired is the weekly — it needs acceptance over ~$81, which is also where the weekly mid-band sits, so this remains a recovery inside a correction. ⭐ Entry $68–70 sits just 0.35 ATR below price, the second-nearest fill on the board. ⚠️ The stop is a deliberate choice: $63.00 is 1.08 ATR and sits at the TOP of daily demand $61–63, so it exits as that band is first touched rather than after it fails. The deeper alternative is $60.90 at 1.45 ATR, which re-rates R:R ~2.7:1 → ~2.0:1. ⚠️ ATR(14) $5.58 is 7.76% — high-volatility group, so size accordingly. Falsifier: daily acceptance under $61 opens $58–55.' },
    side: 'long', accent: 'violet',
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
    price: '$539.14', change: '📅 CLOSE $539.14 (+2.21%) — in the upper half of the $525–555 decision range but the gate is not cleared; ATR(14) $36.54 (6.78%)',
    signal: '📅 CLOSE 08/07 — UPPER HALF OF THE RANGE, GATE NOT CLEARED. Closed $539.14 inside a $525–555 decision range, under the supply cluster it has been consolidating beneath. ⭐ The recovery is real: the rebound off $440–460 reclaimed $500–525 and holds the rising weekly mid-band. ⚠️ But every frame except the monthly reads range, and the weekly is unrepaired below $575–600 — so this is conditional, not directional. Entry $525–532 is only 0.20 ATR below price, the nearest fill on the board after ALOY; stop $491, 1.03 ATR, in the GAP between demand $475–490 and $505–515. Targets $555 → $590 → $615.',
    lead: { rank: 13, status: 'wait', entry: 'pullback holds $525–532', stop: '$491 (close)', targets: '$555 → $590 → $615', rr: '~2.3:1', edge: '⚠️ NEAREST FILL ON THE BOARD AFTER ALOY, AND THE LEAST CONVICTION BEHIND IT — both true, and they answer different questions. The $525–532 zone sits just 0.20 ATR below price, so a fill is one ordinary session away. But every frame except the monthly reads range, conviction on the structure board is 0.0, and the weekly stays unrepaired below $575–600. Reachability is not the same as quality, and the board deliberately ranks them on different keys. ⭐ What is genuinely good: the rebound from $440–460 reclaimed $500–525 and holds above the rising weekly mid-band, and the monthly uptrend behind the parabolic run to $700–740 is intact. ⚠️ What is not: price is in the upper half of a $525–555 range rather than at an edge, and $545–555 has capped it. ⭐ The $491 stop is placed in the GAP between demand $475–490 and $505–515 — inside neither band, at 1.03 ATR from the midpoint, so an ordinary test of either does not reach it. ⚠️ It was $492 until a coherence pass caught that 36.5/36.54 is 0.9989 ATR — under Rule B by eleven thousandths. The eye reads that as “exactly 1.00”; the arithmetic does not. ⭐ The confirmation that matters is not the $555 break but acceptance above $615, which repairs the daily AND the weekly at once. Falsifier: daily acceptance under $505 opens $490–475.' },
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
    price: '$334.17', change: '📅 CLOSE $334.17 — mid-range between demand $320–325 and the $340–350 gate; ATR(14) $35.44 is 10.60%, the widest on the board',
    signal: '📅 08/07 — MID-RANGE, WHICH IS THE ONE PLACE WITH NO EDGE. Closed $334.17 inside a $320–350 decision range, almost exactly in the middle. ⭐ The monthly uptrend from the 2026 expansion is intact and the $285–300 pullback found real buyers, with OBV improving. ⚠️ But weekly, daily AND 4H all read range: momentum above $360–375 has not been re-established and the 4H is still compressing after $250 → $400+ → $310. ⭐ Entry $320–325 is only 0.26 ATR below price — the second-nearest fill on the board. Stop $284 unchanged, 1.09 ATR, under major weekly demand. Targets $350 → $375 → $405. ⚠️ ATR 10.60% — the widest here.',
    lead: { rank: 14, status: 'wait', entry: 'pullback holds $320–325', stop: '$284 (close)', targets: '$350 → $375 → $405', rr: '~2.1:1', edge: '⚠️ THE MIDDLE OF A RANGE IS NOT AN ENTRY, AND $334.17 IS THE MIDDLE OF $320–350. That is the whole caution: there is no extreme to lean on here, and with a 10.60% ATR — the widest on this board — an ordinary session covers a third of the range in either direction. ⭐ What is genuinely good: the monthly uptrend from the 2026 expansion is intact, the sharp pullback found buyers at $285–300, and OBV is improving. ⚠️ What is not: weekly, daily and 4H all read range, momentum above $360–375 has not been re-established, and the 4H is still compressing after the violent $250 → $400+ → $310 sequence. Conviction on the structure board is therefore 0.0 and the row sits low in the long block. ⭐ The card ranks it far higher, and the two are not in conflict — the board orders by structure, the card by distance-to-fill, and ALAB’s zone is just 0.26 ATR away, the second-nearest on the board. That is exactly the row the ATR-pending parking was misplacing at rank 25. ⭐ The $284 stop needed no change: against the computed $35.44 it is 1.09 ATR and sits just under major weekly demand $285–300. Falsifier: daily acceptance under $285 with a failed reclaim opens $270–250.' },
    side: 'long', accent: 'emerald',
    date: '2026-08-09', alert: true,
    story: 'stories/alab.html',
  },
  {
    symbol: 'CRDO', exchange: 'NASDAQ',
    price: '$249.89', change: '📅 CLOSE $249.89 (+8.45%) — the 08-07 high $250.00 tagged the lower edge of the $250–255 gate exactly; ATR(14) $21.44 (8.58%)',
    signal: '📅 CLOSE 08/07 — CLOSED ELEVEN CENTS UNDER THE GATE. $249.89, with the session high $250.00 tagging the lower edge of $250–255 exactly — the gate is being tested, not approached. ⭐ Every frame is bullish: the reversal off the $177–185 washout made higher lows and reclaimed $215–225, the weekly mid-band ~$196 is back, and the monthly holds well above its rising mid-band. ⚠️ 4H is riding the upper band with RSI ~67 and $285–300 is the prior high structure overhead. Entry $232–236 at 0.65 ATR below; stop $212, 1.03 ATR; targets $255 → $272 → $300. ATR 8.58% — high-volatility group.',
    lead: { rank: 22, status: 'wait', entry: 'pullback holds $232–236', stop: '$212 (close)', targets: '$255 → $272 → $300', rr: '~3.0:1', edge: '⭐ EVERY FRAME BULLISH AND THE CLOSE IS ELEVEN CENTS UNDER THE GATE — $249.89 against a $250–255 band whose lower edge the session high tagged exactly. That is a level being tested, not approached, which makes the next session unusually informative either way. ⭐ The recovery underneath is genuine: a reversal off the $177–185 late-July washout with higher lows, $215–225 reclaimed, the weekly mid-band ~$196 back, and the monthly holding well above its rising mid-band after the surge past $300. ⚠️ The counterweight is location and volatility together: the 4H rides the upper band at RSI ~67, $285–300 is the prior high structure overhead, and an 8.58% ATR means an ordinary session covers $21. ⭐ Entry $232–236 sits 0.65 ATR below with the $212 stop at 1.03 ATR, just under the $215 line the read names as the daily-acceptance falsifier. ⚠️ Worth recording how this card was written: CRDO and AMAT arrived in one message whose TABLE was AMAT’s and whose closing verdict was CRDO’s. They were kept strictly apart and this was only written once CRDO’s own frame table arrived — merging them would have repeated the MP/$49.39 failure exactly. Falsifier: daily acceptance under $215 opens $205–195.' },
    side: 'long', accent: 'cyan',
    date: '2026-08-09',
    story: 'stories/crdo.html',
  },
  {
    symbol: 'DELL', exchange: 'NYSE',
    price: '$453.77', change: '📅 CLOSE $453.77 (+3.68%) — the $416.30 low traded THROUGH the $421 stop before closing $32.77 above it; the full plan is already tagged at $462',
    signal: '📅 CLOSE 08/07 — STOP PIERCED, PLAN ALREADY COMPLETE. Low $416.30 went $4.70 under the $421 stop, then price closed $453.77 (+3.68%), $32.77 back above — a close-basis stop, so the trade survives by its own rule, but it spent a session inside its invalidation. ⚠️ Worth saying plainly: the deepest target $462 is already tagged, so this is a finished plan being carried at full risk. +11.8% from the $406 fill. ⭐ Daily hist +2.99 JUST TURNED green. ⚠️ Weekly hist +6.14 is positive twenty-four bars but contracting eight — the long trend is ageing, not breaking.',
    lead: { rank: 30, status: 'booked', entry: 'filled $406', stop: '$421 (close)', targets: '$424 → $448 → $462', tagged: '$462', closed: '$462', rr: '~3.7:1', edge: '✅ BOOKED AT $462, THE DEEPEST TARGET — the plan delivered in full and is closed. ⚠️ It also spent 08-07 inside its own stop: The $416.30 low traded $4.70 through the $421 line before closing $453.77, $32.77 above it — close-basis, so it survives, and that is the second time on this board in one session (STX the other). ⚠️ The awkward part is that there is nothing left to play for: $462 is the DEEPEST target and it is already tagged, so the plan has delivered in full and is still being carried with a stop 7.2% away. That is risk without a remaining objective. ⭐ +11.8% from the $406 fill and the session itself was strong — daily hist +2.99 JUST TURNED green, price well over the 9-EMA $436.37 and 50-EMA $392.97. ⚠️ The weekly is ageing: hist +6.14, positive twenty-four bars but contracting for eight. Falsifier: a daily close under $421 — but the live question is whether a fully-tagged plan should still be open.' },
    side: 'long', accent: 'amber',
    date: '2026-08-09',
    story: 'stories/dell.html',
  },
  {
    symbol: 'MRVL', exchange: 'NASDAQ',
    price: '$218.72', change: '📅 CLOSE $218.72 (+3.89%) — +12.7% from the $194 fill with T2 tagged, but the close is INSIDE board supply $217.53–228.80; the long we want next is under $200, at demand $187.12–199.38',
    signal: '📅 CLOSE 08/07 — NOT ADDING HERE; THE LONG WE WANT IS UNDER $200. Closed $218.72 (+3.89%), +12.7% from the $194 fill with T2 $216 tagged — but the close is INSIDE the structure board’s daily supply $217.53–228.80, which is why the board reads `Short preferred` on a name this card is long. ⭐ We are not fading it, we are waiting lower: the re-entry is board demand $187.12–199.38, with the 4H 200-EMA $194 inside it — the level the original fill was taken at. Stop $174, 1.01 ATR under the $193.25 midpoint, R:R ~1.9:1. ⚠️ The halves interlock: the held stop is a close under $200, the top of that zone.',
    lead: { rank: 2, status: 'live', entry: 'filled $194', stop: '$200 (close)', targets: '$205 → $216 → $230', rr: '~6:1', tagged: '$216', edge: '⭐ HELD AND WORKING, BUT THIS IS NOT WHERE WE ADD. +12.7% from $194 with T2 $216 tagged, and 08-07 closed $218.72 inside the structure board’s daily supply $217.53–228.80 — which is exactly why the board reads `Short preferred, not near demand` on a position this card is long. Both are true at once: the trade is in profit AND the price is at supply. ⭐ The forward plan is a long UNDER $200, anchored rather than picked — the board’s nearest daily demand is $187.12–199.38 and the 4H 200-EMA $194 sits inside it, two independent references, and $194 is where the original fill was taken. The zone is 0.64 ATR wide, the $174 stop is 1.01 ATR below the $193.25 midpoint, and the R:R is ~1.9:1 to $230. ⚠️ The two halves interlock rather than conflict: the held stop is a daily close under $200, which is the TOP of the re-entry zone — the same close that ends this trade opens the next one, and that is a sequence to plan, not a contradiction to fix. ⚠️ T3 $230 sits inside the supply band overhead, so treat it as the exit rather than a breakout. Falsifier for the re-entry: a daily close under $174.' },
    side: 'long', accent: 'blue',
    date: '2026-08-09',
    story: 'stories/mrvl.html',
  },
  {
    symbol: 'AVGO', exchange: 'NASDAQ',
    price: '$427.76', change: '📅 CLOSE $427.76 (+1.71%) — closed above T1 $427.58 on a plan that never filled; the $402–408 zone is 4.8% below and the low held $421.61',
    signal: '📅 CLOSE 08/07 — CLOSED THROUGH T1, STILL UNFILLED. Closed $427.76 (+1.71%), a shade over T1 $427.58, on an order waiting at $402–408 — 4.8% below, and the session low only reached $421.61. Not taggable. ⭐ This is the strongest momentum on the waiting list: daily hist +5.38, seven bars positive and EXPANDING, Stoch 89.89, price above the 9-EMA $407.20, 50-EMA $393.14 and 200-EMA $363.08. ⚠️ The weekly hist −1.38 is still negative, contracting three bars — improving, not yet turned. Targets $473 → $495 are untouched and still worth the plan.',
    lead: { rank: 27, status: 'wait', entry: 'pullback holds $402–408', stop: '$387 (close)', targets: '$427.58 → $473 → $495', rr: '~5:1', edge: '⭐ THE BEST-LOOKING NAME ON THE WAITING LIST, AND STILL NOT BOUGHT. Daily hist +5.38, seven bars positive and EXPANDING — the longest clean momentum run on the board — with price over the 9-EMA $407.20, 50-EMA $393.14 and 200-EMA $363.08. ⚠️ T1 $427.58 was not just traded but CLOSED through, on an order that waits at $402–408, 4.8% below a session whose low was $421.61. Unfilled, nothing tagged. ⭐ Unlike PLTR and CRDO, the miss here is small and the zone is still plausible — 4.8% is one ordinary pullback in a name with this ATR, and $402–408 sits above the 50-EMA rather than at some abandoned print. ⚠️ The weekly hist −1.38 is contracting but still negative, so the senior frame has not confirmed. ⭐ Targets $473 and $495 are far above price, so the plan has not been consumed. Falsifier: a daily close under $393.' },
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
    lead: { rank: 10, status: 'live', entry: 'fade the rejection in $485–494.97', stop: '$532 (dead >$503 close)', targets: '$448 → $427 → $402', rr: '~2.1:1', edge: '⚠️ SIDE FLIPPED LONG → SHORT, ON STRUCTURE RATHER THAN ON ONE SESSION. The 08-07 high $498.82 pushed through the structure board’s daily supply $485–494.97 and closed back under it, with the 9-EMA $489.57 and 50-EMA $487.19 inside the same band — two independent references on top of the zone itself. ⭐ The board reads it the same way without reference to this card: `Two-way — short now, long above $503`, so the invalidation is given rather than invented. ⚠️ The long being replaced was not wrong about its level — a $476.06 low against a $476 zone top is a six-cent miss — but it never filled, and the frame has turned since: daily hist −2.26 negative forty-four bars, weekly −4.31 JUST TURNED red. ⚠️ Rule B: the $532 stop is 1.10 ATR above the $490 midpoint on a 7.92% ATR name, so the stop is outside noise rather than inside it. Falsifier: a daily close over $503 — and that makes this a long again, not merely a scratch.' },
    side: 'short', accent: 'amber',
    date: '2026-08-09',
    story: 'stories/amd.html',
  },
  {
    symbol: 'ASML', exchange: 'NASDAQ',
    price: '$1,740.99', change: '📅 CLOSE $1,740.99 — H $1,761.31 traded into supply $1,755–1,775 and closed back under; the 4H has turned bullish, the DAILY has not',
    signal: '📅 08/07 — THE 4H HAS TURNED, THE DAILY HAS NOT, AND THAT IS THE WHOLE READ. Closed $1,740.99 (range $1,720.11–$1,761.31), so the $1,761.31 high traded into supply $1,755–1,775 and closed back under it. ⭐ The 4H recovered with higher lows and reclaimed $1,700; the weekly structure is still bullish and the bounce off $1,575–1,600 is constructive. ⚠️ But the daily is corrective until the $1,800–1,825 pivot is back — so acceptance over $1,830 is the confirmation, NOT the $1,755–1,775 break. Entry $1,695–1,710 at 0.40 ATR below; stop $1,620, 1.05 ATR; targets $1,755 → $1,830 → $1,930. ⚠️ ATR(14) $78.37 (4.50%).',
    lead: { rank: 18, status: 'wait', entry: 'pullback holds $1,695–1,710', stop: '$1,620 (close)', targets: '$1,755 → $1,830 → $1,930', rr: '~2.8:1', edge: '⭐ THE CLEANEST FRAME SPLIT ON THE BOARD, AND IT SETS THE WHOLE PLAN. The 4H has turned bullish — higher lows, $1,700 reclaimed — while the DAILY is still corrective, because price sits under the $1,800–1,825 pivot and the July breakdown is therefore unrepaired. That single distinction is why the confirmation that counts is acceptance over $1,830, not the $1,755–1,775 break that looks like the obvious trigger. ⚠️ The 08-07 high $1,761.31 already traded into $1,755–1,775 and closed back under it, so the seller there is confirmed rather than assumed — chasing $1,740–1,760 is buying directly into a zone that has just worked. ⭐ Entry $1,695–1,710 is the immediate 4H breakout demand at 0.40 ATR below price, and the $1,620 stop is placed in the GAP between major demand $1,575–1,600 and stronger demand $1,650–1,675 — 1.05 ATR from the midpoint and inside neither band, so it is not taken out by an ordinary test of either. ⭐ Targets $1,755 → $1,830 → $1,930 give ~2.8:1, and the monthly uptrend from the 2025–26 advance is intact behind all of it. ⚠️ Computed ATR(14) $78.37 (4.50%) replaces the estimate this row previously lacked. Falsifier: losing $1,695 opens $1,675–1,650; daily acceptance under $1,575 damages the recovery.' },
    side: 'long', accent: 'blue',
    date: '2026-08-09',
    story: 'stories/asml.html',
  },
  {
    symbol: 'LRCX', exchange: 'NASDAQ',
    price: '$311.35', change: '📅 CLOSE $311.35 (+1.82%) — neutral inside the $299.5–324 compression and $311 is the middle of it; the structure board now carries LRCX with both triggers',
    signal: '📅 CLOSE 08/07 — NEUTRAL, AND MID-RANGE IS NOT AN ENTRY. Closed $311.35 (+1.82%) inside a $299.5–324 compression, almost exactly in the middle of it — the one location in this structure with no edge either way. ⭐ The frames disagree by design: the monthly and weekly uptrends are intact and the correction was bought at $276.80–289.50, but the daily is basing under its mid-band and the 4H has no confirmed break. ⚠️ So the plan is a trigger, not a price. Over $324 on 4H acceptance opens $349–360, then $390.99. Losing $299.50 opens $289–277; daily acceptance under $276.80 opens $266–250. ⚠️ The waiting long is retired — its $264–277 zone sat BELOW the demand that actually worked.',
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
    price: '$363.86', change: '📅 CLOSE $363.86 — H $370.50 into the $372–377 gate; above that gate there is NO established supply, which is what makes this row different',
    signal: '📅 08/07 — EVERY FRAME BULLISH, AND ALMOST NOTHING OVERHEAD. Closed $363.86 after a $370.50 high into the $372–377 gate, whose top is the 08-05 high $376.98. ⭐ The structural fact worth the card: $372–377 is the ONLY established supply band. Above it the read finds little nearby historical overhead, so $390–400 is an extension objective and NOT a zone — every other long here is trading into stacked supply, this one is not. ⚠️ The counterweight is HTF extension: monthly RSI ~75.5, weekly ~72. Entry $355–359 at 0.33 ATR below; stop $337, 1.37 ATR; targets $377 → $390 → $400. ATR(14) $14.55 (4.00%).',
    lead: { rank: 15, status: 'wait', entry: 'pullback holds $355–359', stop: '$337 (close)', targets: '$377 → $390 → $400', rr: '~2.2:1', edge: '⭐ THE ONLY LONG ON THIS BOARD WITH CLEAR AIR ABOVE IT. PANW carries exactly one established supply band — $372–377, topped by the 08-05 high $376.98 — and above it the read finds little nearby historical overhead. That is recorded honestly: $390–400 goes on the card as an EXTENSION OBJECTIVE, not as a supply zone, because calling a projection a zone would be inventing structure. Every other long here is pressing into stacked overhead; this one has a gate and then space. ⭐ The frames are unanimous — monthly, weekly, daily and 4H all bullish, the pullback held above the rising daily mid-band ~$341, and the 4H is consolidating over its own rising mid-band ~$356. ⚠️ The counterweight is real: monthly RSI ~75.5 and weekly ~72 make this the most HTF-extended name here alongside CRWD, so the clear air is bought at the price of a stretched starting point. ⭐ Entry $355–359 sits 0.33 ATR below price with the 4H mid-band inside it. ⚠️ The $337 stop is 1.37 ATR rather than the 1.03 ATR that $342 would give — deliberately, because $337 sits BELOW daily demand $338–342 and matches the read’s own $338 acceptance falsifier, so it fails only when the thesis does. The tighter alternative re-rates R:R ~2.2:1 → ~2.9:1 but exits as that band is first touched. Falsifier: daily acceptance under $338 opens $326–320.' },
    side: 'long', accent: 'amber',
    date: '2026-08-09',
    story: 'stories/panw.html',
  },
  {
    symbol: 'CRWD', exchange: 'NASDAQ',
    price: '$214.42', change: '📅 $214.42 at the close — compressing under the $217–220 breakout gate; the plan re-anchors to $208–211, and monthly RSI ~76 says wait rather than chase',
    signal: '📅 08/07 — ALL FOUR FRAMES BULLISH, AND THE MOST STRETCHED OF THEM. Closed $214.42, compressing directly under the $217–220 breakout gate. The late-July pullback held $172–180 and $195–200 was reclaimed straight back to the highs. ⚠️ The extension is on the SLOW frames, which is what makes it matter: monthly RSI ~76 and weekly ~71, against a 4H of only 66. ⭐ The plan moves off the stranded $195–200 zone to $208–211, 0.38 ATR below price, stop $200 just under the $201–204 band at 1.06 ATR. Targets $217 → $225 → $235. ⚠️ Computed ATR(14) $8.95 (4.17%).',
    lead: { rank: 17, status: 'wait', entry: 'pullback holds $208.00–211.00', stop: '$200.00 (close)', targets: '$217.00 → $225.00 → $235.00', rr: '~2.7:1', edge: '⭐ ONE OF THE STRONGEST TREND STRUCTURES ON THE BOARD — monthly, weekly, daily and 4H all bullish, the late-July pullback bought at $172–180, and $195–200 reclaimed straight back into new-high territory with rising OBV. ⚠️ And the most HTF-extended thing added this session: monthly RSI ~76, weekly ~71. That is the part worth pausing on, because the 4H RSI of 66 looks unremarkable on its own and would tempt a chase — the stretch is on the frames that take months to unwind, not the one that takes days. ⭐ The entry re-anchors from $195–200, which the computed ATR puts 1.61 ATR below price, to $208–211 — the immediate 4H demand at 0.38 ATR below, the nearest fill of any plan here. The $200 stop sits just under the $201–204 breakout band rather than inside it, at 1.06 ATR from the $209.50 midpoint. ⭐ Targets $217 → $225 → $235 give ~2.7:1, and above $220 with a held retest the $215–220 gate becomes demand rather than resistance. ⚠️ CRWD, NVDA and TEM tie at conviction 3.5 and all say the same thing — bullish everywhere, extended, wait. Seven names on this board now share that shape, so the retest arrives for all of them at once. Falsifier: daily acceptance under $194 exposes $185–178.' },
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
  {
    symbol: 'ALOY', exchange: 'NASDAQ',
    price: '$12.27', change: '📅 $12.27 at the close — 5.3% under the $12.96 after-hours print that framed this card; that puts price 0.6% ABOVE the $11.80–12.20 entry, not at supply',
    signal: '📅 08/07 — THE CLOSE CHANGES THE SETUP. $12.27 is the regular-session close; the $12.96 this card was written from was an after-hours print. At $12.27 price sits 0.6% above the $11.80–12.20 entry — 0.06 ATR — so this is arrival AT the zone, not a chase, and supply $13.00–13.50 is 6.0% overhead rather than touching. ⭐ The reversal is intact: off the $7–8 lows with rising RSI and OBV, the weekly mid-band ~$11.10 reclaimed. ⚠️ Computed ATR(14) is $1.17 (9.54%) — still the widest on the board, so size is the risk decision. Stop $10.50 is 1.28 ATR out; targets $13.50 → $14.50 → $16.00.',
    lead: { rank: 12, status: 'wait', entry: 'pullback holds $11.80–12.20', stop: '$10.50 (close)', targets: '$13.50 → $14.50 → $16.00', rr: '~2.7:1', edge: '⭐ THE CLOSE MOVED THIS FROM “DO NOT CHASE” TO “AT THE ENTRY”, AND THAT IS THE WHOLE UPDATE. $12.27 is the regular-session close against the $12.96 after-hours print the card was originally written from — a 5.3% difference, and it lands price 0.6% above the $11.80–12.20 zone, or 0.06 ATR. Supply $13.00–13.50 is 6.0% overhead instead of 0.3%. ⚠️ That is exactly why an after-hours print is not a close, and why the card said so at the time rather than quietly using it. ⭐ The structure is unchanged and good: reversal off the $7–8 lows with rising RSI and OBV, the weekly mid-band ~$11.10 reclaimed, the monthly expansion intact. ⭐ Computed ATR(14) $1.17 (9.54%) replaces the $1.30–1.60 estimate — the row had been OVERstating volatility, and the $10.50 stop is 1.28 ATR from the midpoint rather than the 1.03 it was set for, so it is further outside noise than intended, not nearer. ⚠️ Still the widest ATR on the board: position size is the risk decision here, not the stop. ⚠️ ALOY, MP, USAR and UUUU are one news-driven cluster — a fill here spends the cluster budget. Falsifier: a daily close under $10.60 opens $10–9.50, then $8.80–8.00.' },
    side: 'long',
    date: '2026-08-09',
    story: 'stories/aloy.html',
  },
  {
    symbol: 'USAR', exchange: 'NASDAQ',
    price: '$19.33', change: '📅 $19.33 at the close — 0.9% under the $19.50–20.20 decision zone with the 4H RSI ~76; the daily reversal is real, the location is not',
    signal: '📅 08/07 — THE CLEANEST MOMENTUM HERE, AT THE WORST LOCATION. $19.33 sits 0.9% under $19.50–20.20, the decision zone, with the 4H RSI ~76. The daily reversal off the July low is gaining credibility — higher lows, rising RSI, improving OBV — and the weekly mid-band ~$19.40 is reclaimed, but the weekly reversal is NOT confirmed. ⭐ Entry is a held retest of $17.50–18.20, 0.86 ATR below, or 4H acceptance over $20.20 with a retest of $19.30–20.00. Stop $16.00, 1.40 ATR from the midpoint; targets $21.50 → $24 → $27. ⚠️ One cluster with ALOY, MP and UUUU.',
    lead: { rank: 25, status: 'wait', entry: 'pullback holds $17.50–18.20', stop: '$16.00 (close)', targets: '$21.50 → $24 → $27', rr: '~4.9:1', edge: '⭐ THE BEST SHORT-TERM MOMENTUM STRUCTURE OF THE THREE — 4H price and OBV both advancing, the daily reversal off the July washout gaining credibility with higher lows and a rising RSI, and the weekly mid-band ~$19.40 reclaimed. ⚠️ The problem is location, not direction: $19.50–20.20 is the breakout decision zone and price is 0.5% under it with a 4H RSI near 76, so $19.30–19.50 is the one entry to refuse. ⭐ Two clean executions instead: a held retest of $17.50–18.20, which sits exactly 1.00 ATR below price, or 4H acceptance above $20.20 followed by a successful retest of $19.30–20.00. The $16.00 stop is 1.54 ATR from the $17.85 midpoint — comfortably outside noise — and above $20.20 the ladder opens $21.50–22.50 → $24–25 → $27–29. ⚠️ The weekly reversal is NOT confirmed, so this is a recovery inside a correction rather than a new trend. ⚠️ ALOY, USAR and UUUU are one news-driven cluster. Falsifier: losing $17.50 materially weakens the setup; daily acceptance under $16.00 opens $15.20–14.30.' },
    side: 'long',
    date: '2026-08-09',
    story: 'stories/usar.html',
  },
  {
    symbol: 'UUUU', exchange: 'AMEX',
    price: '$14.14', change: '📅 $14.14 at the close — the recovery is real and the location is not: $14.50–15.00 supply starts 2.5% above with the 4H RSI ~73',
    signal: '📅 08/07 — THE RECOVERY IS REAL AND THE LOCATION IS NOT. $14.14 at the close, with the nearest supply $14.50–15.00 starting 2.5% above and the 4H RSI already ~73. The daily has turned up, the weekly candle is a reversal off $10–11 demand, and the monthly expansion is intact — but price is still under the $20–25 highs. ⭐ Two honest entries: a retest of $12.90–13.20, 1.06 ATR below, or 4H acceptance over $15.00. Stop $12.10, 1.07 ATR from the zone midpoint; targets $14.50 → $16.30 → $19.50. ⚠️ ALOY, MP, USAR and UUUU are one news-driven cluster — one position, not four.',
    lead: { rank: 26, status: 'wait', entry: 'pullback holds $12.90–13.20', stop: '$12.10 (close)', targets: '$14.50 → $16.30 → $19.50', rr: '~6.8:1', edge: '⭐ THE LEAST EXTENDED OF THE THREE, WHICH IS THE ONLY REASON IT IS THE EASIEST TO WAIT ON. 4H RSI ~73 against 76 and 78 for USAR and ALOY, and the nearest supply $14.50–15.00 begins just 2% above — close enough that buying here is buying into the seller. ⭐ The structure underneath is sound: the daily has turned up and reclaimed its mid-band, the weekly candle is a reversal off $10–11 demand where the July low was bought, and the monthly expansion from 2025–26 is intact, with price still well under the $20–25 highs. ⭐ Entry $12.90–13.20 sits 1.09 ATR below price and the $12.10 stop is 1.03 ATR from the midpoint, so both the fill and the invalidation are outside ordinary noise. ⚠️ ATR is the chart’s visual estimate ($0.85–1.00), not a computed ATR(14), so the stop is provisional until a real fetch lands. ⚠️ One position with ALOY and USAR — the retest all three want will arrive on the same bar. Falsifier: daily acceptance under $12.10 opens $11.30–10.50.' },
    side: 'long',
    date: '2026-08-09',
    story: 'stories/uuuu.html',
  },
  {
    symbol: 'MP', exchange: 'NYSE',
    price: '$51.11', change: '📅 CLOSE $51.11 (+7.62%) — O $50.68 H $53.47 L $48.17; closed 4c over the 50-EMA $51.07, and the $49.39 pivot this card was built on DOES NOT EXIST on MP',
    signal: '📅 CLOSE 08/07 — RETRACTION: THE $49.39 PIVOT IS NOT MP’S. Verified against the daily chart, that level does not appear anywhere on MP — it was TEM’s, carried onto this read. The claims it supported, that MP is the cluster’s bellwether with a level proven from above, are both withdrawn. ⚠️ Worse, the old $49–50 zone had NO reference inside it: the 50-EMA $51.07 is above it, the 9-EMA $46.37 and BB mid $45.70 below, with a 9.2% air pocket between. ⭐ Re-anchored to $44.00–46.40 — board demand $44–46 with the 9-EMA and BB mid inside. Stop $42, 1.05 ATR; targets $52.50 → $55.17 → $60. R:R improves to ~4.6:1, but the fill is now 1.54 ATR away.',
    lead: { rank: 28, status: 'wait', entry: 'pullback holds $44.00–46.40', stop: '$42.00 (close)', targets: '$52.50 → $55.17 → $60.00', rr: '~4.6:1', edge: '🚨 THIS CARD WAS WRONG ABOUT THE ONE THING THAT MADE IT INTERESTING. Every version of it said $49.39 had flipped from resistance to support and that this made MP the cluster’s bellwether — the only name with a level proven from above. Verified against the daily chart, $49.39 does not exist on MP. It is TEM’s level, and it was carried across into MP’s analysis. The flagged coincidence is resolved in TEM’s favour: TEM’s is real and drawn, MP’s was never there. Both claims are withdrawn, on the card, on the board row and in the cluster’s group note. ⚠️ The failure is instructive rather than embarrassing: the old $49.00–50.00 zone had NOTHING in it. The 50-EMA $51.07 sits ABOVE, the 9-EMA $46.37 and BB mid $45.70 sit BELOW, and between them is a 9.2% air pocket. An unanchored zone in an air pocket reads as perfectly reasonable, which is exactly why Rule A asks for the references to be NAMED so they can be checked. ⭐ Re-anchored: $44.00–46.40 stacks board daily demand $44–46, the 9-EMA $46.37 and the BB mid $45.70. The $42.00 stop is 1.05 ATR out and sits on major weekly demand $40.50–42.00. R:R improves ~3.0:1 → ~4.6:1 precisely because the entry is now honest — but the fill moves from 0.36 to 1.54 ATR away, so MP drops down the waiting block. ⚠️ Near-term the tell is simple: price closed 4c over the 50-EMA $51.07, and losing it opens the air pocket. Falsifier: daily acceptance under $44.' },
    side: 'long',
    date: '2026-08-09',
    story: 'stories/mp.html',
  },
  {
    symbol: 'TEM', exchange: 'NASDAQ',
    price: '$52.05', change: '📅 CLOSE $52.05 (+12.86%) — O $47.56 H $52.40 L $47.23; the $49.39 pivot is a confirmed drawn level and the 50-EMA $50.08 sits at the top of the entry zone',
    signal: '📅 CLOSE 08/07 — VERIFIED, AND THE ENTRY IS BETTER ANCHORED THAN IT LOOKED. Closed $52.05 (+12.86%) off a $47.23 low. ⭐ The $49–50 zone rests on THREE references, not two: the $49.39 pivot (a real drawn level), the 50-EMA $50.08 at its top and the BB mid $48.70 just under it. ⚠️ Two corrections: daily RSI is 56.29, NOT extended — the ~73.6 is 4H-only, so waiting is about location, not exhaustion. And price is ABOVE the daily mid-band $48.70; the overhead line is the 200-EMA $55.54, which sits inside $55.50–57.00 and is what makes that the decisive zone, not $52.50–54.',
    lead: { rank: 24, status: 'wait', entry: 'pullback holds $49.00–50.00', stop: '$45.00 (close)', targets: '$52.50 → $55.50 → $58.50', rr: '~2.0:1', edge: '⭐ THE CHART CONFIRMS THE ANCHOR AND IMPROVES IT. $49.39 is a genuine drawn level on TEM, so the coincidence flagged against MP is resolved: TEM’s level is real, MP’s was spurious and has been retracted. Better still, the $49–50 zone turns out to rest on three independent references: the $49.39 pivot, the 50-EMA $50.08 at the top of the zone, and the BB mid-band $48.70 immediately beneath it. That is a stronger anchor than Rule A asks for. ⚠️ Two things in the original read were wrong and both matter. Daily RSI is 56.29 — mid-range, not stretched — so the ~73.6 belongs to the 4H alone; the case for waiting is location, not exhaustion, and a fill at $49–50 is a normal pullback rather than a capitulation. And price is ABOVE the daily BB mid-band $48.70, not below it: the "$55.8 declining mid-band" was the 200-EMA $55.54, which sits inside the $55.50–57.00 zone and is precisely why acceptance THERE, not over $52.50–54, is the confirmation that counts. ⭐ Daily MACD hist is +0.49 and has just turned positive, with OBV 345.7m. ⚠️ ATR(14) $3.04 means the $45.00 stop is 1.48 ATR out — too far by design rather than too near; $46.46 at 1.00 ATR re-rates R:R ~2.0:1 → ~2.9:1. Falsifier: daily acceptance under $46.50.' },
    side: 'long',
    date: '2026-08-09',
    story: 'stories/tem.html',
  },
  {
    symbol: 'FN', exchange: 'NYSE',
    price: '$562.38', change: '📅 $562.38 at the close — the $579.47 high tagged the $575–585 breakout zone and closed back under it, so the first test of the gate has already been given back',
    signal: '📅 08/07 — THE FIRST TEST OF THE GATE HAPPENED, AND IT WAS GIVEN BACK. Closed $562.38 after a $579.47 high — inside the $575–585 breakout zone — so the seller there is confirmed present rather than assumed. ⭐ The reversal itself is powerful: off the $411 low, $500–520 reclaimed, daily RSI and OBV rising, the monthly uptrend intact. ⚠️ The weekly is NOT repaired until roughly $585–600 is accepted. ⚠️ ATR(14) $40.47 (7.20%) — an ordinary session covers forty dollars, so a tight stop is meaningless here. Entry $530–540 at 0.55 ATR below; stop $494, 1.01 ATR out; targets $575 → $600 → $640.',
    lead: { rank: 20, status: 'wait', entry: 'pullback holds $530.00–540.00', stop: '$494.00 (close)', targets: '$575.00 → $600.00 → $640.00', rr: '~2.6:1', edge: '⭐ THE REJECTION IS ALREADY ON THE CHART, WHICH IS BETTER EVIDENCE THAN A ZONE NOBODY HAS TESTED. The 08-07 high $579.47 traded INSIDE $575–585 and the close came back to $562.38 — so this card is not guessing where supply sits, it watched it work. ⭐ Underneath, the recovery is genuine: off the $411 low, $500–520 reclaimed, daily RSI and OBV rising, and the monthly uptrend from before the $700–750 correction still intact. ⚠️ The weekly is the unfinished part — it is not repaired until roughly $585–600 is accepted, so this is a recovery inside a correction. ⭐ Entry $530–540 sits 0.55 ATR below price. ⚠️ The stop is a deliberate choice worth stating: $494 is 1.01 ATR from the $535 midpoint but sits ABOVE the $475–490 daily demand, so it exits BEFORE that band is tested. That is intended — by $494 both $530 and $510 have failed and the retest thesis is already broken. The structurally deeper alternative is $474 at 1.51 ATR, which re-rates the R:R from ~2.6:1 to ~1.7:1. ⚠️ Sector note: FN is optics, and this board already carries LITE and CIEN there, plus COHR and AAOI as cards without plans. One plan is coverage; a second taken position in optics makes it one bet. Falsifier: daily acceptance under $510 opens $490–475.' },
    side: 'long',
    date: '2026-08-09',
    story: 'stories/fn.html',
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
