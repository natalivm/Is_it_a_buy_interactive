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
  updated: '2026-08-07',
  markets: [
    {
      symbol: 'QQQ',
      label: 'Nasdaq-100 · QQQ',
      role: 'The index — what the whole tape is doing',
      price: '$714.65',
      change: '📅 CLOSE $714.65 (−0.37%) — a third straight fade (723.85 → 717.30 → 714.65), each one smaller than the last; the close gave back the whole of the day’s $708.50–719.32 range but stayed clear of the $703 slab',
      checks: [
        {
          label: 'Weekly structure',
          verdict: 'bull', weight: 1.5,
          read: '✅ HOLDS, and the derivative turned. Weekly RSI 59.33, price $714.65 above the weekly 9-EMA $702.58, the 50-week $641.12 and the 200-week $505.55. The weekly cross is still negative — hist −3.66, three bars, 15.8% of MACD — but it is now CONTRACTING rather than deepening, the first bar of repair. ⭐ That is the divergence worth carrying: QQQ’s weekly is healing while SMH’s is still worsening, which is a multi-week momentum read, not a one-session split.',
        },
        {
          label: 'Daily trend',
          verdict: 'bull', weight: 1.5,
          read: '✅ THE $695–703 SLAB IS FIVE SESSIONS BEHIND PRICE. Today’s low $708.50 is 0.8% above $703 — the closest approach of the run, and it still held on a closing basis. Price sits above the 9-EMA $703.16 and the 50-EMA $701.97, which have converged at the top of the slab and now defend it together. ⚠️ Three consecutive lower closes is the first sustained give-back since the reclaim; the slab, not the streak, is the test.',
        },
        {
          label: 'The $678–680 shelf',
          verdict: 'bull', weight: 1.5,
          read: '✅ Untested for a fifth session, now $35–37 beneath price. Fails only on a daily close back under $678.',
        },
        {
          label: 'Descending trendline (≈$695)',
          verdict: 'bull', weight: 1.5,
          read: '✅ HOLDS for a fourth session. Today’s low $708.50 is 1.9% clear of the line — the narrowest margin since the break, but still a margin, and the mid-band $701.55 now sits between price and the line as a second layer.',
        },
        {
          label: 'Daily momentum',
          verdict: 'bull',
          read: '✅ HOLDS on the measure that matters. RSI 54.32, a fifth close over 50. MACD histogram +3.73, positive and EXPANDING a third bar even through three red closes — price has faded while momentum has not, which is the opposite of a rollover. ⚠️ Stoch %K 86.64/%D 78.14 is genuinely extended and is the one reading arguing for a pause.',
        },
        {
          label: 'Higher low above $661.58',
          verdict: 'bull',
          read: '✅ Unchanged — today’s low $708.50 is 7.1% clear of $661.58, which has not been re-tested since the sequence resolved. This month’s low $685.82 is the live version of the same idea.',
        },
        {
          label: 'Implied vol (VXN)',
          verdict: 'bull',
          read: '✅ VXN closed 23.95 (−0.83%), a fifth session under the ≈26 floor and a fresh low for the move. ⚠️ The caveat sharpens rather than clears: VXN/VIX sits at 1.58, wide — Nasdaq-specific protection is priced well above broad protection, so this is cheap vol in the index and comparatively dear vol in exactly the complex this board trades. Breadth remains unmeasured in this feed.',
        },
      ],
      fast: {
        checks: [
          {
            label: '4H structure',
            verdict: 'neutral', weight: 1.5,
            read: '⚠️ STILL DERIVED, NOT MEASURED — this feed carries daily/weekly/monthly OHLCV only, no 4H series. What the daily bar forces: a third consecutive inside-ish fade with a lower high ($719.32 against $728.54) and a higher low than the slab. Neutral until a real 4H read exists.',
          },
          {
            label: '4H momentum',
            verdict: 'neutral',
            read: '⚠️ Unchanged at neutral. The three-session give-back has been orderly — each red close smaller than the one before (−0.90%, −0.37%) — which is decay, not distribution, but it is also not thrust. Reverts to bull on a close back over $723.',
          },
          {
            label: 'The first lower high ≈$681',
            verdict: 'bull',
            read: '✅ Still resolved and far behind — $681 is 4.7% below price. The live level is this month’s high $728.54; the higher-high sequence stays intact while price holds the $703 slab.',
          },
        ],
      },
      confirm: [
        { label: 'Undercut-and-reclaim of $661.58 on volume — a flush low bought back the same session', done: true },
        { label: 'Daily close back above the broken $678–680 shelf', done: true },
        { label: 'A higher low: pullback holds over $661.58, then the bounce high gets taken out', done: true },
        { label: 'Daily RSI reclaims 50 and holds it (and VXN back under ≈26) — five closes over 50, VXN five sessions under 26', done: true },
        { label: 'Daily close above the descending trendline ≈$695 — the trend has actually changed', done: true },
        { label: 'Weekly MACD histogram crosses back positive — contracting since 08-06, not yet crossed', done: false },
      ],
      levels: {
        reclaim: '$703 slab held → $728.54 (month high) → $731.92 (July high) → $748.65 (12-month high)',
        invalidate: 'a close back under $703 re-opens the slab question; under $695 the trendline break is undone; under $685.82 the month low; under $678–680 the shelf',
      },
      note: '📅 CLOSE $714.65 (−0.37%) — third straight fade, each smaller than the last, and the $703 slab still untested on a close (low $708.50). Momentum has not followed price down: hist +3.73 expanding a third bar, RSI 54.32 a fifth close over 50. The weekly cross began CONTRACTING for the first time — the repair QQQ has that SMH does not. ⚠️ Stoch %K 86.64 extended; VXN/VIX 1.58 says the protection bid is concentrated in the Nasdaq complex.',
    },
    {
      symbol: 'SMH',
      label: 'Semis · SMH',
      role: 'The board’s barometer — the group that leads this tape',
      price: '$571.48',
      change: '📅 CLOSE $571.48 (+0.31%) — ✅ the $547–550 level is cleared a THIRD session (575.71 → 569.70 → 571.48) and price reclaimed both the 50-EMA $569.90 and the weekly 9-EMA $570.58; high $580.43 pushed the $580 lid again without closing over it',
      checks: [
        {
          label: 'Weekly structure',
          verdict: 'neutral', weight: 1.5,
          read: '⚠️ STILL THE LAGGARD, AND STILL DETERIORATING. Weekly RSI 58.59, and the weekly cross has NOT flipped — hist −9.07, negative and EXPANDING a fourth bar. ⭐ One genuine improvement: price $571.48 has reclaimed the weekly 9-EMA $570.58, which it sat 52 cents under last session. But the direction of the histogram is the check: QQQ’s is contracting, SMH’s is widening, and semis are only 2–4 bars into a rollover the optical names took 5–10 bars to finish. Neutral, not bull, until the histogram turns.',
        },
        {
          label: 'Daily trend',
          verdict: 'bull', weight: 1.5,
          read: '✅ CONFIRMED, THIRD SESSION. The $547–550 level that gated nearly every semi long here has now closed above three times running (575.71, 569.70, 571.48), and today price also reclaimed the 50-EMA $569.90 it closed under yesterday. Daily hist +2.62, two bars positive and expanding, with the 9-EMA $559.23 rising beneath. The daily frame is doing exactly what a confirmed reclaim looks like.',
        },
        {
          label: 'The 0.618 at ≈$478',
          verdict: 'bull', weight: 1.5,
          read: 'Untouched and now 16.4% below price. Still the strongest single piece of evidence on this board; it does no work at these levels and only matters again if the whole reclaim fails.',
        },
        {
          label: 'Overhead stack',
          verdict: 'bull', weight: 1.5,
          read: '⭐ MOSTLY BEHIND PRICE NOW: the $547–550 level, the 50-day $569.90 and the mid-band $567.44 have all been closed above. ⚠️ One lid is still doing work and has now rejected twice — $580: today’s high $585.00-equivalent print of $580.43 pushed into it intraday and closed $9 lower, the same shape as 08-05. Above it the next reference is this month’s high $585.00, then $594–600.',
        },
        {
          label: 'Group leadership',
          verdict: 'neutral',
          read: '⚠️ MEASURED THIS TIME, AND IT REFUSES TO RESOLVE. The 08-06 session was two-sided and violent — WDC −13.03%, AXON −14.28%, NBIS −13.29%, SNDK −6.81% against ALAB +4.10%, CRDO +2.58%, STX +1.83%, COHR +1.83%, ASML +1.56%. ⚠️ Deliberately NOT read as a cohort: WDC and STX are the same sub-group and finished 14.9 points apart, which is the third time in a week a storage/memory split has failed to hold. This is dispersion, i.e. single-name events, and by this board’s own rule one session of relative performance may not set a verdict. Neutral until the same split prints twice or a non-price corroborator appears.',
        },
        {
          label: 'Bounce confirmation',
          verdict: 'bull',
          read: '✅ SUPERSEDED AND STAYS SUPERSEDED. The $535 bounce this check tracked is 6.4% behind price and is now the invalidation line rather than the question. Nothing here is open.',
        },
      ],
      fast: {
        checks: [
          {
            label: '4H structure',
            verdict: 'neutral', weight: 1.5,
            read: '⚠️ Still no 4H series in this feed. What the daily bar forces: a $20.87 range ($559.56–$580.43) closing in the upper half but under the $580 lid for a second session — a contained rejection, not a breakdown. Neutral until a 4H read exists.',
          },
          {
            label: '4H momentum',
            verdict: 'neutral',
            read: '⚠️ Unchanged at neutral. Today closed green (+0.31%) but 88% off its own high, so the intraday give-back is real even though the session was not. Reverts to bull on a close over $580.',
          },
          {
            label: '$505.66–510 reclaim',
            verdict: 'bull',
            read: 'Untouched and now 12% below price — carried forward as resolved.',
          },
          {
            label: 'The $547–550 lid · volume test',
            verdict: 'bull',
            read: '✅ HOLDS — three closes above the old lid (575.71, 569.70, 571.48). ⚠️ The volume half still cannot be refreshed: no 1H OBV series in this feed, so the flow question stays unanswered rather than assumed.',
          },
        ],
      },
      confirm: [
        { label: 'Hold $500 in the regular session — the AH snap-back is not enough on its own', done: true },
        { label: 'Reclaim $505.66–510 — the sweep low that broke, back over the line', done: true },
        { label: 'Daily close above the 4H 9-EMA $513.80, then a push at $535', done: true },
        { label: 'Undercut $535 and reclaim it in the same session — the pivot proven from beneath', done: true },
        { label: 'Daily CLOSE over $547–550 — cleared 08-04 and held three sessions running', done: true },
        { label: 'Reclaim the 50-day and the weekly 9-EMA — both closed above on 08-06 ($569.90 / $570.58)', done: true },
        { label: 'Close above $580 with breadth — rejected twice now, highs $585.00 and $580.43', done: false },
        { label: 'Weekly MACD histogram stops widening — still EXPANDING at −9.07, a fourth bar', done: false },
      ],
      levels: {
        reclaim: '$547–550 cleared (three closes) → 50-day $569.90 and weekly 9-EMA $570.58 both reclaimed 08-06 → $580 (rejected twice) → $585 month high → $594–600',
        invalidate: 'a daily close back under $569.90 loses the 50-day again; under $547–550 re-opens the whole question; under $535 the reclaim voids → $483/$478 retest',
      },
      note: '📅 CLOSE $571.48 (+0.31%) — the $547–550 level is cleared a third session and the 50-day $569.90 plus weekly 9-EMA $570.58 were both reclaimed on the close. ⚠️ The weekly histogram is the hold-out: −9.07, four bars negative and still EXPANDING while QQQ’s contracts. $580 rejected a second time (high $580.43). ⚠️ Group leadership measured and left neutral: 08-06 was dispersion (WDC −13.03% vs STX +1.83%, same sub-group), not a cohort split.',
    },
  ],
  vol: [
    {
      symbol: 'VIX', value: '15.15', range: [15, 22], change: '📅 close 15.15 (−4.17%) — fifth session under 16 and the lowest print of the move, 13.2% off the 12-month low 13.38',
      verdict: 'bull',
      read: 'Fifth consecutive close under 16 and a fresh low for the move at 15.15. Daily MACD histogram −0.28, negative and expanding a fourth bar; the weekly cross is ESTABLISHED at 35.5% of MACD and 17 bars deep — the most confirmed calm-vol reading this board tracks. ⚠️ And that is now the caveat rather than the comfort: daily Stoch %K is 8.41, pinned on the floor with the 12-month low only 13.2% below, so the asymmetry from here favours vol expansion rather than further compression. Cheap protection alongside unmeasured breadth is a reason for care, not confidence.',
    },
    {
      symbol: 'VXN', value: '23.95', range: [22, 33], change: '📅 close 23.95 (−0.83%) — fifth session under ≈26, but VXN/VIX at 1.58 says the protection bid is concentrated in the Nasdaq',
      verdict: 'neutral',
      read: '⬇️ DOWNGRADED bull → neutral, on a ratio rather than a level. VXN closed 23.95, a fifth session under ≈26 — that half is unchanged and constructive. ⚠️ But VXN/VIX is 1.58, and taken against this board’s own 12-month endpoints (17.09/13.38 = 1.28 at the calm extreme, 34.37/35.30 = 0.97 at the fearful one) that ratio sits above BOTH, so Nasdaq-specific protection is being paid up for while broad protection is not. This board trades the Nasdaq complex exclusively, so a wide ratio is not neutral information for it. ⚠️ Stated with its limit: two non-simultaneous extremes are a crude reference, not a percentile — the level is measured, the "unusually wide" reading is inference.',
    },
  ],
  note: '📅 Закриття 06.08. 🚦 Рівень SMH $547–550 закрито вище ТРЕТЮ сесію ($571.48), 50-денна й тижнева 9-EMA теж повернуті — лонги більше не заблоковані. ⚠️ Структурний факт сесії один: рамки розійшлися — тижнева гістограма QQQ ЗВУЖУЄТЬСЯ (−3.66), SMH РОЗШИРЮЄТЬСЯ (−9.07, четвертий бар). Напівпровідники відстають і лише 2–4 бари в розвороті, тоді як оптика проходила 5–10. ⚠️ VIX 15.15 зі Stoch %K 8.41 — страх на підлозі. Що змінить читання: денне закриття SMH під $535.',
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
    price: '$155.92', change: '📅 CLOSE $155.92 (−1.58%) — closed on the upper band $155.87 after Tuesday’s +29.45%; the $141–143 zone is 1.99 ATR below because that gap left no structure behind it',
    signal: '📅 CLOSE 08/06 — THE ZONE STAYS WHERE IT IS, AND HERE IS WHY IT LOOKS FAR. Closed $155.92 (−1.58%), right on the upper band $155.87. The $141–143 zone now sits 1.99 ATR under price — but Tuesday’s +29.45% gap left NO structure behind it, and the zone is exactly where the 9-EMA $141.52 and 200-EMA $141.35 have converged, two references seventeen cents apart. Moving it nearer would mean drawing a level in empty air, which Rule A forbids. Stop $134 (1.14 ATR), targets $150 → $157 → $168. ⚠️ The 50-EMA $133.38 is still under the 200-EMA $141.35 — they have not crossed back, so this is a repair, not a trend.',
    lead: { rank: 4, status: 'wait', entry: 'pullback holds $141–143', stop: '$134 (close)', targets: '$150 → $157 → $168', rr: '~3.3:1', edge: '⭐ THE BIGGEST SINGLE-DAY MOVE ON THE BOARD, AND THE PLAN IS UNCHANGED BECAUSE THE GAP LEFT NOTHING TO RE-ANCHOR TO. Price $155.92 closed on the upper band $155.87 after +29.45% on 08-04. The $141–143 zone is 1.99 ATR below, which normally means re-draw — but between price and $141.50 there is no moving average, no prior-period extreme and no band edge, and the zone itself is where the 9-EMA $141.52 meets the 200-EMA $141.35. A closer zone would be a level invented to feel reachable. ⚠️ Structure is genuinely unfinished: the daily 50-EMA $133.38 sits UNDER the 200-EMA $141.35 and they have not crossed back, so the daily stack is not repaired however strong the candle looked. Weekly hist +1.60 turned positive on one bar. Stop $134 is 1.14 ATR from the midpoint. Falsifier: a close under $141.35 puts price back beneath both long averages.' },
    side: 'long',
    date: '2026-08-07',
    story: 'stories/pltr.html',
  },
  {
    symbol: 'META', exchange: 'NASDAQ',
    price: '$589.90', change: '📅 CLOSE $589.90 (+0.19%) — ⚠️ +10.3% from the $535 fill while the stop still sat at $515, UNDER the fill: a stop-out would have booked −3.7% on a winner, so it trails to $559',
    signal: '📅 CLOSE 08/06 — STOP TRAILED OUT OF LOSS TERRITORY AT LAST. Closed $589.90 (+0.19%), +10.3% from the $535 fill — and the stop was still $515, which is BELOW the fill: being stopped would have booked −3.7% on a winning trade. It trails to a close under $559, this month’s low, banking +4.5%. ⚠️ The chart is not confirming the gain: price is under the 50-EMA $604.36 and the 200-EMA $627.69, daily hist −3.72 has been negative eleven bars and monthly hist −24.97 ten. This is a held position being managed, not a fresh long. Targets $609 → $629 → $645.',
    edge: '⭐⭐ META is the exact INVERSE of every semi here: they are stretched-and-rolling on the long frame (monthly Stoch 89.59 / 89.22 / 89.08 / 87.71) with healthy weeklies, while META has monthly Stoch 33.47 and RSI 47.38 — BY FAR the least stretched long frame on the board — on a genuinely broken weekly: ⚠️ weekly MACD −13.36 is the MOST negative on the board — not the only one (CRWV −4.62, ASTS −4.40, IREN −1.15 are too, and all are shorts). META has already taken the correction the semis have not started, which makes it the board’s one real diversifier rather than just a weak chart. ⚠️ Near-term damage is still the worst here: daily RSI 37.83 is the LOWEST of any name (under INTC’s 39.94), Stoch 10.35 the most oversold, OBV −88.6m, below EVERY daily MA (9d $587.25 / 50d $606.99 / 200-EMA $629.35, 13% overhead); above the 200-week ≈$516.42 and BB lower $544.31, so the floor is real. Two lines, now tight: under $524.49 the shelf breaks (short candidate), over $562 the $594–609 gap-fill becomes an evaluable long — price is $5.29 away. Original read: the anti-cohort chart — gapped −7.95% on the capex print MSFT got celebrated for, wrecked structure (below the 9d $594.88 / 50d $609.04 / 200d $629.63, daily RSI 32.1) — against one good bull fact: the two-year shelf HELD, $524.49 bought back to a close at the day’s high $539.03 with overnight +1.62% and the 1H basing; a prove-it chart between two lines — under $524.49 the shelf breaks (short candidate), acceptance over $562 opens the $586/$594–609 gap-fill evaluation; between them, no trade',
    lead: { rank: 1, status: 'live', entry: 'filled $535', stop: '$559 (close)', targets: '$609 → $629 → $645', rr: '~4.6:1', edge: '⚠️ A WINNING TRADE WHOSE STOP WAS STILL SET TO BOOK A LOSS. +10.3% from the $535 fill and the stop sat at $515 — $20 BELOW the entry — so any flush would have turned a ten-percent winner into a −3.7% loser. It trails to $559, this month’s low, which locks +4.5% and sits 2.5 ATR under price; there is no structure at 1.0 ATR to anchor to and inventing one is worse than being a little wide. ⭐ The fill itself remains the board’s best-timed entry. ⚠️ But nothing in the chart says add: price is beneath the 50-EMA $604.36 and 200-EMA $627.69, the daily histogram has been negative eleven bars and the monthly ten, and this month’s $601.00 high failed under last month’s $686.08. Manage it down, do not re-buy it. Falsifier: a close under $559 ends the trade with the gain banked.' },
    side: 'long', accent: 'blue',
    date: '2026-08-07',
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
    price: '$319.53', change: '📅 CLOSE $319.53 (−0.63%) — +4.1% from the $307 fill with the stop still $297, under the fill; trails to $310, this month’s low, turning the worst case from −3.3% into +1.0%',
    signal: '📅 CLOSE 08/06 — STOP TRAILS ABOVE THE FILL; THE FRAME IS STILL THE WEAKEST HERE. Closed $319.53 (−0.63%), +4.1% from $307, and the $297 stop sat under the fill — a stop-out banked −3.3% on a winner. It trails to a close under $310, this month’s low, 1.00 ATR from price, making the worst case +1.0%. ⚠️ Everything else argues caution: price under the 9-EMA $323.20, 50-EMA $368.68 and 200-EMA $387.83, daily hist negative eighteen bars, weekly −10.12 negative seven and EXPANDING. Targets $330 → $350 → $365.',
    lead: { rank: 3, status: 'live', entry: 'filled $307', stop: '$310 (close)', targets: '$330 → $350 → $365', rr: '~19:1', edge: '⚠️ THE WEAKEST CHART OF THE THREE HELD LONGS, NOW MANAGED LIKE IT. +4.1% from $307 and the stop was $297 — under the fill, so the worst case was −3.3% on a winning trade. It trails to $310, this month’s low, exactly 1.00 ATR beneath price, and the worst case becomes +1.0%. ⚠️ Note the R:R reads ~19:1 only because a trailed stop is measured from the original fill: risk has collapsed to $3, not because the trade got better. ⚠️ The frame has not improved at all — price sits under every daily average (9-EMA $323.20, 50-EMA $368.68, 200-EMA $387.83), the daily histogram has been negative eighteen bars, and the weekly −10.12 is seven bars negative and EXPANDING, which is deterioration, not a base. Falsifier: a close under $310, and the trade ends green rather than red.' },
    side: 'long', accent: 'red',
    date: '2026-08-07',
    story: 'stories/tsla.html',
  },
  {
    symbol: 'CRWV', exchange: 'NASDAQ',
    price: '$85.33', change: '📅 CLOSE $85.33 (−5.07%) — the fade worked: price accepted BELOW the $88–97 zone floor and closed at the session low, 7.8% under the zone midpoint · stop widened to $101 for Rule B',
    signal: '📅 CLOSE 08/06 — THE FADE WORKED AND PRICE IS NOW UNDER THE ZONE. Closed $85.33 (−5.07%) at the session low, 7.8% below the $88–97 midpoint — the rejection this card was drawn for printed, and price has accepted beneath the whole zone. The 50-EMA $88.51 and 200-EMA $96.52 that anchored it are both overhead now. ⚠️ Stop moves $100 → $101: at $100 it was 0.97 ATR from the midpoint, marginally inside the one-ATR floor Rule B sets, and $101 clears the band high $94.88 and last month’s $95.14 at 1.10 ATR. Targets $70 → $65 → $60.55. ⚠️ Weekly hist −3.16 has contracted a bar — the only thing arguing the other way.',
    lead: { rank: 21, status: 'live', entry: 'fade the rejection in $88–97', stop: '$101 (dead >$97 close)', targets: '$70 → $65 → $60.55', rr: '~3.8:1', edge: '⭐ ONE OF THE TWO ANCHORED SHORT ZONES STILL WORKING, AND IT IS NOW IN CONTROL. $88–97 was drawn on the 50-EMA and 200-EMA — two independent references — and price has closed BELOW the whole of it at $85.33, the session low, 7.8% under the midpoint. Both anchors sit overhead: 50-EMA $88.51, 200-EMA $96.52. ⚠️ The stop was the one flaw: $100 measured 0.97 ATR from the $92.50 midpoint, fractionally inside Rule B’s one-ATR floor, so it goes to $101 — clear of the band high $94.88 and last month’s $95.14 — at 1.10 ATR. ⚠️ Honest against: the weekly histogram −3.16 contracted for the first bar in six, and the daily is positive five bars, so momentum is not confirming the price break yet. Falsifier: a daily close back over $97 and both anchors are reclaimed.' },
    side: 'short', accent: 'cyan',
    date: '2026-08-07', alert: true,
    story: 'stories/crwv.html',
  },
  {
    symbol: 'LITE', exchange: 'NASDAQ',
    price: '$838.06', change: '📅 CLOSE $838.06 (+1.43%) — an $88 range ($881.79 high, $793.00 low) closing green but 79% off the high; weekly hist −32.79 contracted a first bar after ten negative',
    signal: '📅 CLOSE 08/06 — GREEN CLOSE, HUGE RANGE, WEEKLY JUST OFF ITS LOW. Closed $838.06 (+1.43%) inside an $88 range — high $881.79, low $793.00 — finishing 79% back off the high. ⭐ Daily hist +16.46 is four bars positive and expanding, price above the 9-EMA $781.00. ⚠️ The weekly turn is thinner than it looks: hist −32.79 contracted ONE bar after ten negative, and that turn is mostly 08-04’s +8.92% single session. Unranked until a second contracting bar prints. The 50-EMA $797.63 is the line — price above it, barely.',
    edge: '⚠️⚠️ THE DEMOTION COST THE WHOLE MOVE — this card’s ladder was $748 → $796 → $869 and pre-market $882.17 is through ALL THREE, with nothing filled because LITE was unranked. ZERO realised. A target traded on an unfilled plan is not realised and must not be tagged; there is no plan here at all, so it goes in prose, as the four gated T1s of 08-03 did. ⚖️ Two separate questions, kept separate: the PROCESS was right by its own terms and still is — a weekly RSI on a Monday-only bar is that session relabelled, and the cross had not narrowed (−36.50 at 67.7% vs −40.57 at 68.8%). The OUTCOME cost the entire ladder. The filter is not loosened because one instance went against it, and the cost is not hidden either; a PATTERN of unranked names clearing their ladders would justify revisiting it, and one case is not a pattern. 🔻 Still unranked, now for a DIFFERENT reason: not “no weekly confirmation” but NO ENTRY. $882.17 is 13.1% above the 08-03 close, above the 1H 9-EMA $817.05, the 200-EMA ≈$753 and the lower band $666.83, and 22% above the top of its own $714–721 zone. The trade was available and was not taken — it is not available now. A long returns on a controlled retest with a 4H higher low at a zone drawn from a completed frame. 1H RSI 88.76, Stoch 93.41, MACD 25.52. ⭐ The dormant parabola-unwind short is further from arming than ever: it needs a daily close under ≈$630–632, ~40% below price. ⚠️ Pills only — the legend was parked on an older bar (C 706.17, V 0) and read RSI 52.97 against an actual 88.76; the 1,579.85 / 419.45 pills are the documented render artifacts and are ignored. 1H OBV ≈−2.66m is an 08-03 reading: pre-market bars are V:0.',
    side: 'long',
    date: '2026-08-07',
    story: 'stories/lite.html',
  },
  {
    symbol: 'NVDA', exchange: 'NASDAQ',
    price: '$218.99', change: '📅 CLOSE $218.99 (−0.10%) — held while the board sold into strength (gave back 40% of its swing against a board averaging 100%); the old $197–200 zone is now 2.64 ATR below price and has been re-drawn to $205–209',
    signal: '📅 CLOSE 08/06 — ZONE RE-DRAWN; THE OLD ONE IS OUT OF REACH. Closed $218.99 (−0.10%), the steadiest close here — gave back 40% of its 3-day swing where most of the board gave back 100%. The $197–200 zone sits 2.64 ATR below price, and a zone price cannot reach is not a plan, so it moves to $205–209, where the 9-EMA $209.01, mid-band $206.01 and 50-EMA $205.06 converge. Stop a close under $196.50 — 1.35 ATR from the midpoint, beneath the old demand and above the 200-EMA $192.42. Targets $214.39 → $223.63 → $236.54. ⭐ The only card holding a full daily stack, weekly AND monthly histograms both a hair from crossing plus (−0.26, −0.06). ⚠️ Falsifier: a close under $205.06 and the stack is gone.',
    lead: { rank: 5, status: 'wait', entry: 'pullback holds $205–209', stop: '$196.50 (close)', targets: '$214.39 → $223.63 → $236.54', rr: '~2.8:1', edge: '⭐ THE CLEANEST STRUCTURE ON THE BOARD, RE-PRICED TO WHERE IT CAN ACTUALLY FILL. Price 218.99 sits above every daily MA — 9-EMA $209.01, 50-EMA $205.06, 200-EMA $192.42 — which no other long here can claim, and both the weekly and monthly histograms are within a rounding error of crossing positive (−0.26, 4.4% of MACD; −0.06). ⚠️ The old $197–200 zone was carried three sessions while price walked away from it: at 2.64 ATR below the close it was the most stranded plan on the board, so it is re-anchored to the 9-EMA / mid-band / 50-EMA cluster at $205–209 — three references, 1.54 ATR below price, reachable in a normal week. Stop $196.50 clears the old demand and the 200-EMA and sits 1.35 ATR from the midpoint, so an ordinary day cannot take it out. ⚠️ Honest against: Stoch %K 88.95 is extended and this is a pullback entry, not a chase — nothing to do until $209 trades.' },
    side: 'long', accent: 'red',
    date: '2026-08-07',
    story: 'stories/nvda.html',
  },
  {
    symbol: 'COHR', exchange: 'NYSE',
    price: '$334.22', change: '📅 CLOSE $334.22 (+1.83%) — still unranked: the $294–313 zone was run through and price sits 6.8% above its top, with no completed-frame level overhead to re-anchor a fade to',
    signal: '📅 CLOSE 08/06 — STILL UNRANKED, AND STILL FOR THE SAME REASON. Closed $334.22 (+1.83%) after a $354.47 high — 6.8% above the top of the old $294–313 zone, which was run through and is void in substance. ⚠️ Rule A forbids re-drawing at this print, and there is genuinely nothing overhead on a completed frame to anchor to: the high $354.47 printed above the upper band $354.10 and the nearest real level is last month’s $386.74 high, 15.7% away. ⚠️ The short case has weakened outright: the 50-EMA $320.57 is now BENEATH price, not above it, and weekly hist −14.09 contracted a first bar. Returns on a rejection at $386.74.',
    edge: '⛔ UNRANKED — THE $294–313 ZONE WAS RUN THROUGH AND THE $321 KILL LINE IS 6.2% BELOW PRICE: pre-market $341.00 sits 8.9% above the zone top, so the entry is void in substance (formally the kill still wants a daily close over $321, and at 07:35 ET there is none). Unfilled, ZERO realised, on a +29.7% two-session move off the $262.90 close of 07-31. ⭐ Both halves of the record: the zone-raise from $252–266 to $294–313 was RIGHT and saved the trade — the old zone would have filled on 08-03 and be ≈35% underwater now. It cost the fill and saved the loss. 🔻 Why not raise it again: that would be drawing a level at a memory of one bar, which Rule A forbids, and the 1H has nothing to anchor to — price is above the upper band $327.39, with the 9-EMA $306.29, the 200-EMA ≈$282 and the lower band $242.66 all beneath it. Returns on a rejection at a level from a completed daily or weekly frame. ⚠️ Individual failure, as required: the 1H 200-EMA was reclaimed on the 08-03 CLOSE and price is ~21% above it. 1H RSI 89.91, Stoch 89.21, MACD 10.34 — the most extended of the three optical names. ⚠️ This chart had the worst legend miss of the three: parked on an older bar (C 261.00, V 0) it read Stoch 15.06 against an actual 89.21 — a 69-point miss — and RSI 55.96 against 89.91. Pills only. 1H OBV ≈30.0m is an 08-03 reading, not confirmation: pre-market bars are V:0.',
    side: 'short', accent: 'violet',
    date: '2026-08-07',
    story: 'stories/cohr.html',
  },
  {
    symbol: 'IREN', exchange: 'NASDAQ',
    price: '$37.93', change: '📅 CLOSE $37.93 (−2.47%) — working 10.5% below the $40.8–44 midpoint after the rejection printed; stop widened $45.50 → $47 so it clears last month’s $45.54 at 1.08 ATR',
    signal: '📅 CLOSE 08/06 — WORKING, AND THE STOP FINALLY CLEARS STRUCTURE. Closed $37.93 (−2.47%), 10.5% under the $40.8–44 midpoint — the rejection printed and price has held below. ⚠️ Stop moves $45.50 → $47: at $45.50 it was 0.73 ATR from the midpoint AND sat under last month’s high $45.54, so an ordinary day could take it out at a level that means nothing. $47 clears that high at 1.08 ATR, and the R:R re-rates honestly from ~4:1 to ~2.9:1. Targets $35 → $32 → $28.93. 🧷 The $32 put sidecar stands unchanged. ⚠️ Weekly hist −2.31 contracted a bar; the 50-EMA $43.68 and 200-EMA $43.43 remain the line that matters.',
    lead: { rank: 20, status: 'live', entry: 'fade the rejection in $40.8–44', stop: '$47 (dead >$44 close)', targets: '$35 → $32 → $28.93', rr: '~2.9:1', edge: '⚡ WORKING: price $37.93 sits 10.5% below the $40.8–44 midpoint with the rejection long since printed. ⚠️ The stop was quietly broken, in two ways at once: $45.50 was only 0.73 ATR from the midpoint, and it sat UNDER last month’s high $45.54 — so the level meant to invalidate the trade was inside ordinary noise AND beneath a real reference. $47 fixes both at 1.08 ATR, and the R:R falls from ~4:1 to ~2.9:1, which is the true number rather than the flattering one. ⭐ Structure still favours the short: the 50-EMA $43.68 and 200-EMA $43.43 are converged 15% overhead and price is under the mid-band $38.08. 🧷 The $32 put sidecar is unchanged — half now, half on a $35 tag, bought back on a close under $28.93. Falsifier: a daily close over $44.' },
    side: 'short', accent: 'red',
    date: '2026-08-07', alert: true,
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
    price: '$51.44', change: '📅 CLOSE $51.44 (−4.28%) — closed under the 9-EMA $52.46 and 50-EMA $55.56 with the weekly and monthly frames still too short to compute; unranked, as it has been',
    signal: '📅 CLOSE 08/06 — UNRANKED, AND THE DATA ITSELF IS THE REASON. Closed $51.44 (−4.28%), under the 9-EMA $52.46 and the 50-EMA $55.56. ⚠️ This is the one name on the board with no computable weekly or monthly MACD and no 200-EMA — the listing is too young to seed them — so the frame agreement every other card is judged on cannot be checked here at all. Daily hist +0.16 is two bars positive against a mid-band $54.69 overhead. Until a weekly frame exists there is no evidence standard this can pass; it stays a watch, not a plan.',
    edge: '🕐 13:55 ET — ⭐ THE TELL INVERTED, WHICH IS THE POINT OF WATCHING IT: Friday DRAM closed on its low while both HDD names closed green, and that was read as proof of a DRAM/NAND re-rating. Today DRAM is +1.59% at its session high with SNDK +7.13% and MU +0.85% green, while WDC −2.74% and STX −3.13% are the board’s only decliners — the exact reverse. Watch it to read the group; the conclusion drawn from one session was the fragile part. Still unranked and still unconfirmable: the entry needs a daily CLOSE over $52.60 and price is 2.8% under it. 📅 UNRANKED — DRAM cannot be trend-confirmed AT ALL, which on this board is disqualifying rather than merely inconvenient. The weekly is the confirmation layer, and DRAM’s weekly MACD literally cannot compute — “not enough data”, because the ETF launched recently — while its weekly RSI(14) is barely seeded. There is no frame available to confirm or deny a trend, so a ranked row would imply a conviction the data cannot support. Only the DAILY frame is usable here, and no multi-frame language belongs on this card. ⛔ The plan was also invalidated on the session: the stop was “a daily close back under $51.55” and DRAM closed $50.37, gapping to $54.70, running $55.45 and collapsing to close ELEVEN CENTS off the low on a 10.3% range. The gate meant nothing filled (SMH $540.53 under $547–550), so the loss was zero. Entry is confirmation-only and sits +4.4% ABOVE price: no long until a daily CLOSE back over $52.60, stop a close under $48, targets $56 → $61 → $68. ⭐ WHY IT STAYS ON THE BOARD WITH NO POSITION — the same reason BE does. DRAM is the cohort’s TELL: it holds MU and SNDK alongside WDC and STX, and it still closed on its LOW while both HDD names closed GREEN. That single fact is the cleanest proof the session was a DRAM/NAND re-rating rather than sector risk-off, and no individual card can show it. Watch it to read the group; trade the names. ⚠️ One recurring caveat: OBV’s negative sign here is a start-point artifact, NOT a signal — only its direction carries meaning, and that direction is rolling over off the June peak.',
    side: 'long', accent: 'indigo',
    date: '2026-08-07',
    story: 'stories/dram.html',
  },
  {
    symbol: 'AAOI', exchange: 'NASDAQ',
    price: '$124.22', change: '📅 CLOSE $124.22 (−3.38%) — still unranked; price closed back under the 50-EMA $127.13 after a $134.29 high, and the $119–127 zone that was working now contains price',
    signal: '📅 CLOSE 08/06 — PRICE IS INSIDE THE OLD ZONE, WHICH IS WHY IT STAYS UNRANKED. Closed $124.22 (−3.38%) after touching $134.29, back under the 50-EMA $127.13. The $119–127 zone — 9-EMA plus 50-EMA when drawn — now has price sitting in the middle of it, so there is no directional edge to take: a fade needs price at the top, a long needs it reclaimed. ⭐ Daily hist +5.37 is four bars positive and expanding. ⚠️ Weekly hist −10.16 contracted one bar of seven negative, and that turn is 08-04’s +19.44% alone. Watch the 50-EMA: reclaimed on a close, the long returns.',
    edge: '⛔ UNRANKED — THE $119–127 ZONE WAS RUN THROUGH, NOT REJECTED FROM: pre-market $131.30 is 3.4% above its top, so there is no resistance beneath price to fade and the entry as written is VOID. Unfilled, so the realised result is ZERO rather than a loss, on a +39.2% two-session move off the $94.32 close of 07-31. Neither exit line has formally printed — the kill needs a daily close over $127, the $134 stop is 2.1% overhead — but that is bookkeeping, not a reason to hold the plan. 🔻 Why no third zone: Rule A wants at least two independent structural references, and on the 1H there are NONE overhead — the 9-EMA $118.27, the 200-EMA ≈$101 and the lower band $84.54 are all BELOW price. Re-drawing at the print is the exact error the rule exists to prevent, so the plan leaves the table instead of being re-priced. It returns on a rejection at a level read off a completed daily or weekly frame. ⚠️ The individual failure that kills it, as required: AAOI reclaimed its 1H 200-EMA on the 08-03 CLOSE and trades ~30% above it — a level reclaimed on a close, not a cohort excuse. 1H RSI 88.09, Stoch 93.88, MACD 5.60 rising. ⚠️ Read off the right-axis pills only: the chart legend was parked on an older bar (C 116.94, V 0, high $118.20 BELOW the live print) so the whole row was discarded — its RSI said 82.66 against an actual 88.09. And 1H OBV ≈269k is NOT evidence of absent demand: pre-market bars are V:0, so OBV cannot move on them. ⚠️ The news catalyst is reported, not verified.',
    side: 'short', accent: 'violet',
    date: '2026-08-07',
    story: 'stories/aaoi.html',
  },
  {
    symbol: 'WDC', exchange: 'NASDAQ',
    price: '$451.52', change: '📅 CLOSE $451.52 (−13.03%) — a $70 range ($477.63 high, $407.48 low, this month’s low) closing 10.8% off the bottom; unranked, the plan was never filled and is now far behind price',
    signal: '📅 CLOSE 08/06 — THE BOARD’S SECOND-WORST DAY, AND A VIOLENT RECOVERY OFF THE LOW. Closed $451.52 (−13.03%) after printing $407.48 — this month’s low — and closing 10.8% above it. ⚠️ Nothing was filled here and nothing is ranked: price is 11.3% under the 9-EMA $509.23 and 14.2% under the 50-EMA $526.47, with weekly hist −15.88 four bars negative and EXPANDING. ⭐ The 200-EMA $375.32 held comfortably below and the close reclaimed the lower band $442.27. That reclaim is the only bullish fact here and it is one bar old. Unranked until a close back over $509.23.',
    side: 'long',
    date: '2026-08-07', alert: true,
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$99.81', change: '📅 CLOSE $99.81 (−1.24%) — still inside the $96–102 rejection zone with the $89 confirmation unprinted; stop widened $104 → $108 so it clears the month high $103.38 at 1.09 ATR',
    signal: '📅 CLOSE 08/06 — STILL IN THE ZONE, STILL WAITING FOR THE TRIGGER. Closed $99.81 (−1.24%), inside $96–102 with the $89 confirmation never printed, so this stays `wait` by its own rejection-only rule. ⚠️ Stop moves $104 → $108: $104 was 0.60 ATR from the $99 midpoint and sat BELOW this month’s high $103.38 and the 50-EMA $103.07 — an invalidation line under two live references is not an invalidation line. $108 clears both at 1.09 ATR; R:R re-rates ~6:1 → ~3.7:1. Targets $85 → $80 → $75 → $66. ⚠️ Weekly hist −4.16 is four bars negative and EXPANDING, which is the short’s best evidence.',
    lead: { rank: 17, status: 'wait', entry: 'rejection printed in $96–102', stop: '$108 (dead >$102 close)', targets: '$85 → $80 → $75 → $66', rr: '~3.7:1', edge: '⚠️ THE ZONE IS RIGHT AND THE STOP WAS WRONG. Price $99.81 sits inside $96–102 and the trade is rejection-only, so arriving in the zone is the setup presenting itself, not the trigger — the $89 confirmation has still not printed and the status stays `wait`. ⚠️ But $104 was failing twice over: 0.60 ATR from the $99 midpoint, and BELOW both this month’s high $103.38 and the 50-EMA $103.07, so the line meant to kill the trade sat under two references price crosses in a normal session. $108 clears them at 1.09 ATR and the R:R re-rates from a flattering ~6:1 to ~3.7:1. ⭐ The weekly is the evidence: hist −4.16, four bars negative and EXPANDING, against a daily that has bounced three. ⚠️ Against: the 200-EMA $76.20 is 24% below and monthly hist +8.33 is still positive — the long frame has not broken. Falsifier: a daily close over $102.' },
    side: 'short', accent: 'blue',
    date: '2026-08-07', alert: true,
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$881.47', change: '📅 CLOSE $881.47 (−1.31%) — zone $800–823 is 0.82 ATR below price and still reachable, but the $778 stop was only 0.39 ATR from the midpoint, the worst on the board; widened to $726',
    signal: '📅 CLOSE 08/06 — THE ZONE IS FINE; THE STOP WAS THE WORST ON THE BOARD. Closed $881.47 (−1.31%) after a $913.33 high and an $827.00 low — an $86 range. The $800–823 zone is 0.82 ATR under price, so it is still genuinely reachable. ⚠️ But $778 sat 0.39 ATR from the $811.50 midpoint, the worst Rule B failure here, on a name whose ATR is $84.95 — 9.6% of price. It widens to $726, 1.01 ATR, below this month’s $770.10 low. R:R re-rates ~5.6:1 → ~2.2:1, which is the honest number for a stock that moves this much. Targets $892 → $930 → $996–1,000.',
    lead: { rank: 19, status: 'wait', entry: 'pullback holds $800–823', stop: '$726 (close)', targets: '$892 → $930 → $996–1,000', rr: '~2.2:1', edge: '⚠️ THE MOST MIS-STOPPED PLAN ON THE BOARD, FIXED. MU’s ATR is $84.95 — 9.6% of price — and the stop sat $33.50 from the entry midpoint: 0.39 ATR, meaning an ordinary session took the trade out before it was ever wrong. It widens to $726, 1.01 ATR, under this month’s low $770.10. ⚠️ The R:R falls from ~5.6:1 to ~2.2:1 and that is the point: the old ratio was manufactured by a stop too close to be real. ⭐ The zone itself needs no change — $800–823 is 0.82 ATR below price, inside an ordinary day’s reach, so this remains a live plan rather than a stranded one. ⚠️ Frame: weekly hist −16.51 is two bars negative and EXPANDING and price is under the 50-EMA $890.00 and mid-band $898.03, so the pullback being waited for is already underway. Falsifier: a close under $770.10 takes out the month low before the zone fills.' },
    side: 'long', accent: 'cyan',
    date: '2026-08-07',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$384.89', change: '📅 CLOSE $384.89 (−1.16%) — T2 $403 stays tagged, price has fallen back under T1 $390; stop trails $349 → $369 (under the 50-EMA) so the trade can no longer end red',
    signal: '📅 CLOSE 08/06 — T2 BANKED, PRICE BACK UNDER T1, STOP TRAILED GREEN. Closed $384.89 (−1.16%), below T1 $390 with T2 $403 already tagged and kept. ⚠️ The stop at $349 was 4.6% BELOW the $366 fill, so a winning trade could still have closed red; it trails to $369, just under the 50-EMA $369.53, which locks +0.8%. ⭐ The daily is the strong half — hist +6.86 five bars positive, price above the 9-EMA $371.82 and 50-EMA $369.53. ⚠️ The weekly is not: hist −8.29, six bars negative. Targets $390 → $403 → $419.',
    lead: { rank: 14, status: 'live', entry: 'filled $366', stop: '$369 (close)', targets: '$390 → $403 → $419', rr: '~18:1', tagged: '$403', edge: '⭐ T2 $403 IS TAGGED AND STAYS TAGGED — the deepest level this trade actually realised, banked on the way up and unaffected by price slipping back to $384.89. ⚠️ What needed fixing is the downside: the $349 stop sat 4.6% under the $366 fill, so a trade that has already paid could still have been closed at a loss. It trails to $369, immediately under the 50-EMA $369.53, which turns the worst case into +0.8%. The R:R prints ~18:1 purely because risk is measured from the original fill and has collapsed to $3 — it is arithmetic, not an improvement in the trade. ⚠️ The frames split: daily hist +6.86 is five bars positive with price over both the 9-EMA and 50-EMA, while the weekly −8.29 is six bars negative. A held position with a green floor under it is the right shape for that disagreement. Falsifier: a close under $369.' },
    side: 'long', accent: 'blue',
    date: '2026-08-07',
    story: 'stories/ter.html',
  },
  {
    symbol: 'GLW', exchange: 'NYSE',
    price: '$157.18', change: '📅 CLOSE $157.18 (+0.31%) — a $13.57 range closing green and exactly on the mid-band $157.19; weekly hist −7.87 contracted a first bar, the 50-EMA $169.28 still 7.7% overhead',
    signal: '📅 CLOSE 08/06 — GREEN, AND PARKED EXACTLY ON ITS OWN MID-BAND. Closed $157.18 (+0.31%) after a $164.34 high, finishing one cent from the mid-band $157.19 — the most precisely undecided close on the board. ⭐ Daily hist +2.29 is three bars positive and expanding, price above the 9-EMA $150.45 and the 200-EMA $142.50. ⚠️ Against: the 50-EMA $169.28 caps it 7.7% above, weekly hist −7.87 has contracted just one bar of five negative, and last month’s $240.87 high is a reminder of how far this has already fallen. Unranked until the 50-EMA is reclaimed on a close.',
    edge: '✅ FLIPPED SHORT → LONG BY ITS OWN RULE, AND UNRANKED BY THIS BOARD’S. The rule was “this card flips long only on a DAILY CLOSE OVER $144”; GLW closed $146.66. The short is over — unfilled, zero realised, since the entry needed a rejection in $141–147 confirmed lower and price went the other way. ⭐ The card beat itself with evidence it had published: it called GLW the board’s most two-sided chart because 1H OBV kept CLIMBING (149M → 157M → 162M) while the daily bled. That is what resolved it. ⚠️ It does NOT become a ranked long, for consistency rather than caution: GLW fails the same weekly filter that keeps LITE and BE out, and fails it hardest — weekly RSI 47.05 under the midline, ESTABLISHED cross at 96.5% of MACD, five bars and EXPANDING. Ranking it while they sit out on better readings would be the board contradicting itself again. ⭐ For the long: closed above the 200-EMA $142.03 and 9-EMA $143.51, daily histogram contracting a third bar. ⚠️ Against: the 50-EMA $170.73 is 16% overhead, daily RSI 42.48 under the midline, and ATR(14) $14.69 is 10.62% of price. Draft plan: dip holds $142–147, stop a close under $135, targets $161 → $171 → $185. It earns a row on a weekly RSI reclaim over a FULL week, or a close over $170.73.',
    side: 'long', accent: 'blue',
    date: '2026-08-07',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,258.58', change: '📅 CLOSE $1,258.58 (−6.81%) — ✅ booked at $1,350.50 (+3.54%) and the thesis kept paying without us: another −6.81% since, now 10.2% below the exit',
    signal: '📅 CLOSE 08/06 — ✅ BOOKED, AND THE TRADE KEPT WORKING AFTER THE EXIT. Closed $1,258.58 (−6.81%), 10.2% below the $1,350.50 exit that banked +3.54% from the $1,400 short. The ledger scores it there and does not re-derive — but the read is worth keeping honest: leaving early cost roughly two-thirds of the move that followed. ⚠️ Structure is still falling, not basing: price under the 9-EMA $1,317.57 and 50-EMA $1,512.34, weekly hist −86.04 four bars negative and EXPANDING. The 200-EMA $1,013.35 is the next real level, 19% below.',
    lead: { rank: 18, status: 'booked', entry: 'filled $1,400', closed: '$1,350.50', stop: '$1,360 (dead >$1,346 close)', targets: '$1,187 → $1,050 → $1,000', rr: '~7:1', edge: '📒 FIRST LEG BOOKED: short $1,400 → closed $1,350.50 same session, +3.5% realised; the written plan stayed unfilled. Next entry only on a rejection at the broken $1,251–1,287 band off completed frames — T1 $1,187 is 3.4% from the PM print, no chase. A close back over $1,287 kills the continuation.' },
    side: 'short', accent: 'red',
    date: '2026-08-07', alert: true,
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$571.48', change: '📅 CLOSE $571.48 (+0.31%) — 🚦 a third close clear of the $547–550 long gate, with the $535 short re-arm 6.4% below; but the weekly histogram −9.07 is four bars negative and still EXPANDING',
    signal: '📅 CLOSE 08/06 — 🚦 GATE OPEN, WEEKLY STILL ROLLING OVER. Closed $571.48 (+0.31%), a third close clear of $547–550; the $535 re-arm is 6.4% away. ⚠️ The frames disagree and that is the whole read: the daily repairs (hist +2.62, two bars expanding, price back over the 9-EMA $559.23) while the WEEKLY hist −9.07 is four bars negative and still EXPANDING — QQQ’s equivalent is contracting. Semis are the laggard, and only 2–4 bars into a rollover the optical names took 5–10 to finish. Longs are permitted; size for a barometer whose weekly has not turned. Falsifier: a daily close under $535.',
    edge: '📅 The gate held it off: $540.53 (+0.30%) — the $550.15 overnight faded, $547–550 NOT closed above, so the group downtrend stands and every long on this board stays unfilled; $535 held, so no short re-armed either — undecided, the exact branch the plan named. Higher frames disagree: the MONTH closed red-with-a-wick ABOVE the 9-month EMA ≈$486 (intact uptrend, first corrective month, RSI 69 / Stoch 92.7 still unwinding) while the WEEK closed UNDER the weekly 9-EMA ≈$570 — SMH weaker than QQQ, which held all of its. Vol confirmed hard (VIX 15.82, VXN 25.57 through ≈26); breadth did not (%>200DMA 70.5% → 68.6%). Chop $535–550 until a close resolves it; watch breadth, not vol. 📉 Weekly hist -8.41 (47.63 vs 56.04 signal), 3 bars, 17.7% deep — holding.',
    side: 'long', accent: 'red',
    date: '2026-08-07',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$852.95', change: '📅 CLOSE $852.95 (+1.83%) — only +1.4% from the $841 fill after an $874.97 high and a $767.69 low; stop moves to $767, under this month’s low, because there is no gain yet to protect',
    signal: '📅 CLOSE 08/06 — GREEN DAY, THIN CUSHION, STOP ON STRUCTURE. Closed $852.95 (+1.83%) off a $767.69 low — a $107 range — leaving the position only +1.4% from the $841 fill. ⚠️ With that little cushion no stop can lock a gain, so the honest placement is structural rather than flattering: $767, just under this month’s low $767.69, 1.9 ATR from price. Anything nearer sits inside the 9-EMA $838.70 / 50-EMA $838.44 / mid-band $841.52 cluster that price is using as support. Targets $949 → $1,000 → $1,070. ⚠️ Weekly hist −14.78 is four bars negative and EXPANDING.',
    lead: { rank: 13, status: 'live', entry: 'filled $841', stop: '$767 (close)', targets: '$949 → $1,000 → $1,070', rr: '~3.1:1', edge: '⚠️ THE HELD LONG WITH THE LEAST TO SHOW: +1.4% from the $841 fill after a session that ranged $767.69 to $874.97. ⭐ The day itself was strong — closed +1.83% near the top of that range, with the 9-EMA $838.70, 50-EMA $838.44 and mid-band $841.52 converged in three dollars directly beneath price, which is real support to lean on. ⚠️ But there is no gain to protect yet, and a stop tucked under a cluster price is actively using would be taken out by the same volatility that produced today’s $107 range. So it goes to $767, a hair under this month’s low $767.69 — 1.9 ATR away and on a level that means something. That accepts the trade can still finish red; pretending otherwise with a tighter stop would just book the loss sooner. ⚠️ Weekly hist −14.78, four bars negative and EXPANDING. Falsifier: a close under $767.69.' },
    side: 'long', accent: 'amber',
    date: '2026-08-07',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$67.36', change: '📅 CLOSE $67.36 (−1.49%) — the $69–76 fade zone was reached (H $74.08) and rejected; price closed 7.1% under the midpoint, still unfilled and still `wait`',
    signal: '📅 CLOSE 08/06 — THE ZONE WAS REACHED AND REJECTED, ARITHMETICALLY. Closed $67.36 (−1.49%) after a $74.08 high — that is INSIDE $69–76 by every reading, so the setup presented and the fade held; price finished 7.1% below the midpoint. Rejection-only, so arriving in the zone is not the trigger and the status stays `wait`. Stop $80 is 1.63 ATR from the midpoint, comfortably Rule B. Targets $56 → $52 → $48.42. ⚠️ Split frames: daily hist +2.07 five bars positive and price over the 9-EMA $63.97, against weekly hist −3.62 nine bars negative and the 200-EMA $75.69 overhead.',
    lead: { rank: 23, status: 'wait', entry: 'fade the rejection in $69–76', stop: '$80 (dead >$76 close)', targets: '$56 → $52 → $48.42', rr: '~3.2:1', edge: '⚡ THE ZONE WAS REACHED — and that is arithmetic, not an impression: the $74.08 high is inside $69–76, so this is a tag, not a near-miss. Price rejected and closed $67.36, 7.1% under the $72.50 midpoint. ⚠️ Still `wait`, and deliberately: the entry is rejection-only, so price arriving in the zone is the setup presenting itself while the trigger is the reversal printing there — and no reversal candle has closed in the zone yet. ⭐ The stop is the healthiest on the board at 1.63 ATR from the midpoint, so nothing here is being held together by a tight invalidation. ⚠️ Frames disagree sharply: the daily has bounced five bars with price over the 9-EMA $63.97, while the weekly hist −3.62 is nine bars negative and the 200-EMA $75.69 caps the whole zone. That overhead average is why the fade is drawn where it is. Falsifier: a daily close over $76.' },
    side: 'short', accent: 'violet',
    date: '2026-08-07',
    story: 'stories/asts.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$189.88', change: '📅 CLOSE $189.88 (−13.29%) — ⛔ the long’s $196 stop broke and the setup flipped short: closed at the session low, out the bottom of its own $213–236 no-trade gap · short filled $224, +15.2% unrealised',
    signal: '📅 CLOSE 08/06 — ⛔ THE LONG STOPPED OUT; THE CARD IS NOW SHORT, FILLED $224. Closed $189.88 (−13.29%) at the session low, O $205.84 · H $215.51 · L $189.17 — straight through the $196 stop and out the bottom of the $213–236 no-trade gap this card pre-drew. Short filled $224: +15.2% unrealised, the best open position on the board. Stop trails to a close over $207 — above the 50-EMA $205.76, 9-EMA $200.11 and mid-band $197.51 — roughly 1.1 ATR of cushion, locking +7.6%. Targets $176.25 (month low) → $157 (200-EMA $155.04 + lower band $156.75) → $145.80 (prior-month low). ⚠️ Weekly hist −6.84, four bars minus and EXPANDING: the frame agrees.',
    lead: { rank: 15, status: 'live', entry: 'filled $224', stop: '$207 (close)', targets: '$176.25 → $157 → $145.80', rr: '~4.6:1', edge: '⛔ THE LONG DIED AND THE SETUP FLIPPED SHORT — FILLED $224, +15.2%, THE BEST OPEN POSITION HERE. The $196 stop broke by $6.12 on a −13.29% close AT the session low ($189.88 against a $189.17 low), and price left the bottom of the $213–236 gap this card had already marked as having no edge for either side. ⭐ Every daily reference the long rested on is now overhead: the 50-EMA $205.76, the 9-EMA $200.11 and the mid-band $197.51 all sit above price, and the weekly agrees — hist −6.84, four bars negative and EXPANDING, not repairing. ⚠️ The stop is trailed, not widened: $207 clears that whole cluster at ~1.1 ATR from price and locks +7.6%, where leaving it at the old $196 would have it inside the structure the short is selling. Note the ATR is approximate — NBIS is not on the structure board, so it is read off recent true ranges, not `atrPct`. ⚠️ Against: the 200-EMA $155.04 is still 18% below and monthly RSI 66.01 has not broken, so T3 is a level, not a forecast.' },
    side: 'short', accent: 'indigo',
    date: '2026-08-07', alert: true,
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$527.48', change: '📅 CLOSE $527.48 (−1.27%) — zone $500–510 is only 0.57 ATR below price, the most reachable plan on the board; stop widened $488 → $465 to clear Rule B at 1.01 ATR',
    signal: '📅 CLOSE 08/06 — THE MOST REACHABLE PLAN HERE, WITH THE STOP FIXED. Closed $527.48 (−1.27%), and the $500–510 zone sits just 0.57 ATR below price — an ordinary day reaches it, which makes this the nearest live long on the board. ⚠️ The stop was the flaw: $488 measured 0.43 ATR from the $505 midpoint, so noise took it out before the thesis could be wrong. It widens to $465, 1.01 ATR, just above the lower band $461.05. R:R re-rates ~5:1 → ~2.1:1. Targets $529 → $550 → $590. ⚠️ Daily hist +0.03 has contracted six bars — momentum is stalling into the zone.',
    lead: { rank: 9, status: 'wait', entry: 'pullback holds $500–510', stop: '$465 (close)', targets: '$529 → $550 → $590', rr: '~2.1:1', edge: '⭐ THE NEAREST LIVE LONG ON THE BOARD: $500–510 sits 0.57 ATR under price, so unlike the plans that have been stranded for a week this one fills on an ordinary session. ⚠️ Its stop, though, was the second-worst here — $488 is 0.43 ATR from the $505 midpoint, close enough that a normal day’s range ends the trade before the idea is tested. It widens to $465 at 1.01 ATR, sitting just above the lower band $461.05, and the R:R falls from ~5:1 to ~2.1:1: the old number was a product of the bad stop, not of a better trade. ⚠️ Momentum is fading into the zone rather than driving it — daily hist +0.03 has contracted six straight bars and the weekly −5.22 is two bars negative and EXPANDING, with price under the 50-EMA $528.61. That is what a pullback looks like on the way in, but it is also how a rollover starts. Falsifier: a close under $491.68, this month’s low.' },
    side: 'long', accent: 'red',
    date: '2026-08-07',
    story: 'stories/amat.html',
  },
  {
    symbol: 'BE', exchange: 'NYSE',
    price: '$228.96', change: '📅 CLOSE $228.96 (−2.29%) — a $28 range ($249.45 high) closing 96% off it; the re-drawn $198–206 entry now sits 13.4% below price and the 50-EMA $237.14 still caps it',
    signal: '📅 CLOSE 08/06 — STILL UNRANKED, AND NOW FURTHER FROM ITS OWN ENTRY. Closed $228.96 (−2.29%) after a $249.45 high, giving back 96% of the day’s range. ⚠️ The re-drawn $198–206 entry is 13.4% below price, so it is neither filled nor near; the 50-EMA $237.14 caps price 3.6% above; weekly hist −11.84 has contracted one bar of five negative. ⭐ The breadth-tell role is what this card is for: BE is power, not semis, and it closed red on a day the optical complex closed green — the AI-infra bid was not uniform. Nothing to do. Returns on a close over $237.14.',
    edge: '🕐 13:55 ET — ⚠️ STILL UNRANKED, ON BOTH TESTS. Weekly RSI reads 51.17, over the 50 named — but Monday opens the week, so that bar holds ONE session and the reading is today’s +6.43% relabelled; and the other condition, a $232 reclaim, was missed by 3.2% (high $224.64). ⭐ The breadth-tell role earned its keep instead: BE is power, not semis, and it is +6.43% while the semi heavyweights sit flat (AVGO +0.09%, LRCX +0.02%, MU +0.85%) — the clearest single statement that today’s move is the beaten-down AI-infra complex, not the group this board trades. 📅 UNRANKED — BE fails the weekly trend filter on both counts AND broke its zone in the same session. Weekly RSI 49.22 is UNDER the midline with an ESTABLISHED cross at 61.9% of MACD, four bars and EXPANDING: no trend confirmation. On the day itself it opened $230.77, ran $235.49 and collapsed to close $205.81 AT ITS LOW — straight through the $213–217 dip zone and finishing just $1.81 above the $204 stop. A card that is failing its trend filter and nearly stopping on the same bar is not one of the board’s sharpest trades. ⭐ What keeps it a long WATCH rather than a short: price still holds above the daily 200-EMA $186.75 — the line whose reclaim was this card’s founding event — it sits +3.1% above its 50% squeeze line at $199.62, and monthly RSI 62.51 says the long frame has bent, not broken. The re-drawn plan stands if it returns: entry holds $198–206 (Friday’s close down to the 9-EMA $198.95), stop a close under $186, targets $232 → $241 → $250. ⭐ The BREADTH-TELL role is unchanged and is why this card stays on the board at all: BE is power, not semis, so it reads whether the AI-infra move is broad or narrowing — worth watching with no position at all. It returns to the table on weekly RSI back over 50, or a reclaim of $232.',
    side: 'long', accent: 'amber',
    date: '2026-08-07',
    story: 'stories/be.html',
  },
  {
    symbol: 'ALAB', exchange: 'NASDAQ',
    price: '$331.50', change: '📅 CLOSE $331.50 (+4.10%) — best gainer on the board; zone re-drawn up to $319–326 where the 9-EMA, 50-EMA and mid-band converge, stop $290 → $284 for Rule B',
    signal: '📅 CLOSE 08/06 — BEST GAINER HERE, AND THE PLAN MOVES UP WITH IT. Closed $331.50 (+4.10%), the strongest close on the board. The old $300–310 zone and its $290 stop both failed on arithmetic — the stop was 0.39 ATR from the midpoint, tied for worst here, on a name whose ATR is $38.24, 11.5% of price. Zone re-drawn to $319–326, where the 9-EMA $319.13, 50-EMA $325.18 and mid-band $325.84 converge — three references, 0.24 ATR below price. Stop a close under $284, beneath this month’s $285.68 low, 1.01 ATR. Targets $367.85 → $408.08 → $468.07.',
    lead: { rank: 6, status: 'wait', entry: 'pullback holds $319–326', stop: '$284 (close)', targets: '$367.85 → $408.08 → $468.07', rr: '~3.8:1', edge: '⭐ THE BOARD’S BEST CLOSE (+4.10%) AND ITS WORST-CALIBRATED STOP, BOTH FIXED IN ONE PASS. ALAB’s ATR is $38.24 — 11.5% of price, the highest-beta name ranked here — and the $290 stop sat 0.39 ATR from the old $305 midpoint, which is not a stop, it is a coin toss on the day’s range. ⚠️ The zone had also been left behind: price closed $331.50, above the whole of $300–310. It moves up to $319–326, where three independent references converge inside seven dollars — 9-EMA $319.13, 50-EMA $325.18, mid-band $325.84 — and which sits only 0.24 ATR under price, so it fills on any ordinary pullback. The stop goes under this month’s low $285.68 to $284, a clean 1.01 ATR. ⚠️ Against: weekly hist −2.94 is two bars negative and EXPANDING, and Tuesday’s −11.96% shows what this name does in a bad session. Falsifier: a close under $285.68.' },
    side: 'long', accent: 'emerald',
    date: '2026-08-07', alert: true,
    story: 'stories/alab.html',
  },
  {
    symbol: 'CRDO', exchange: 'NASDAQ',
    price: '$230.43', change: '📅 CLOSE $230.43 (+2.58%) — price left the $200–207 zone by 1.16 ATR, so it is re-drawn to $219–222 (9-EMA + 50-EMA + mid-band); stop $192 → $197',
    signal: '📅 CLOSE 08/06 — ZONE RE-DRAWN TO WHERE PRICE ACTUALLY IS. Closed $230.43 (+2.58%). The $200–207 zone had drifted 1.16 ATR below price — past the point where an ordinary day reaches it — and its $192 stop was 0.49 ATR from the midpoint, failing Rule B. Re-anchored to $219–222, where the 9-EMA $219.61, 50-EMA $221.18 and mid-band $221.19 converge inside $1.60, only 0.43 ATR under price. Stop a close under $197, below this month’s $195.39 low, 1.01 ATR. Targets $246.78 → $280.50 → $308.67. ⚠️ Weekly hist −1.73, two bars negative and EXPANDING.',
    lead: { rank: 8, status: 'wait', entry: 'pullback holds $219–222', stop: '$197 (close)', targets: '$246.78 → $280.50 → $308.67', rr: '~3.8:1', edge: '⚠️ A STRANDED PLAN AND A TOO-TIGHT STOP, BOTH RE-CUT. $200–207 sat 1.16 ATR below price — over the line where a zone stops being reachable and becomes a wish — and the $192 stop measured 0.49 ATR from its midpoint, so noise would have ended the trade first. ⭐ The replacement is unusually well anchored: the 9-EMA $219.61, 50-EMA $221.18 and mid-band $221.19 sit inside $1.60 of each other, three references stacked in a dollar and a half, and the zone is 0.43 ATR under price. Stop $197 clears this month’s low $195.39 at 1.01 ATR, and the targets are now real levels rather than round numbers — month high $246.78, prior-month high $280.50, 12-month high $308.67. ⚠️ Against: the weekly histogram −1.73 is negative and EXPANDING, and price closed under the 50-EMA on 08-05 before recovering. Falsifier: a close under $195.39.' },
    side: 'long', accent: 'cyan',
    date: '2026-08-07',
    story: 'stories/crdo.html',
  },
  {
    symbol: 'DELL', exchange: 'NYSE',
    price: '$437.65', change: '📅 CLOSE $437.65 (−5.41%) — ⭐ T3 $462 stays tagged (the deepest target realised on this board), price back under T2; stop trails $393 → $421 to bank +3.7%',
    signal: '📅 CLOSE 08/06 — DEEPEST TARGET STILL BANKED, STOP TRAILED UNDER THE MID-BAND. Closed $437.65 (−5.41%) — the largest give-back among the held longs, but T3 $462 was tagged on the way up and stays tagged; the ledger scores what traded, not where price ended. ⚠️ The stop was $393, BELOW the $406 fill, so the board’s most complete trade could still have closed −3.2%. It trails to $421, just under the mid-band $422.40, locking +3.7%. ⭐ Monthly hist +33.14 is six bars positive and EXPANDING, the only monthly on the board doing that. ⚠️ Monthly RSI 82.52 is the most extended here.',
    lead: { rank: 2, status: 'live', entry: 'filled $406', stop: '$421 (close)', targets: '$424 → $448 → $462', tagged: '$462', rr: '~3.7:1', edge: '⭐ THE ONLY PLAN ON THIS BOARD TO HAVE TAGGED ITS DEEPEST TARGET: T3 $462 traded and is recorded, and −5.41% today does not undo it — the strip scores realised levels, not the current print. ⚠️ What did need fixing is that the stop sat at $393, $13 BELOW the $406 fill, so the most complete trade here could still have been closed at −3.2%. It trails to $421 under the mid-band $422.40, banking +3.7%. That is 0.59 ATR from price, tighter than the one-ATR guide, and deliberately so: with the plan’s work already done the job is protecting the result, not giving it room. ⭐ The monthly is the strongest reading on the board — hist +33.14, six bars positive and EXPANDING, price over a 50-EMA $390.49 that is itself far above the 200-EMA $259.99. ⚠️ Monthly RSI 82.52 is the most stretched here, which is exactly why the stop came up. Falsifier: a close under $421.' },
    side: 'long', accent: 'amber',
    date: '2026-08-07',
    story: 'stories/dell.html',
  },
  {
    symbol: 'MRVL', exchange: 'NASDAQ',
    price: '$210.54', change: '📅 CLOSE $210.54 (−0.23%) — T2 $216 stays tagged, +8.5% from the $194 fill; stop trails $181.50 → $200, under the 9-EMA and mid-band, banking +3.1%',
    signal: '📅 CLOSE 08/06 — T2 BANKED, STOP TRAILED INTO PROFIT. Closed $210.54 (−0.23%), +8.5% from the $194 fill with T2 $216 tagged and kept. ⚠️ The $181.50 stop sat 6.4% under the fill — an +8.5% winner that could still book a loss — so it trails to a close under $200, beneath the 9-EMA $201.17 and mid-band $202.46, 0.92 ATR from price, locking +3.1%. ⭐ Daily hist +3.86 is three bars positive and expanding, price above the 9-EMA and the 200-EMA $157.47. ⚠️ Weekly hist −6.71 is three bars negative and EXPANDING, and the 50-EMA $213.71 caps price. Targets $205 → $216 → $230.',
    lead: { rank: 11, status: 'live', entry: 'filled $194', stop: '$200 (close)', targets: '$205 → $216 → $230', rr: '~6:1', tagged: '$216', edge: '⭐ +8.5% FROM THE $194 FILL WITH T2 $216 TAGGED — the second-best realised progress among the held longs. ⚠️ And, like every other filled position on this board before today, its stop was still set where it was drawn: $181.50, some 6.4% BELOW the fill, so the trade could have handed back every point and more. It trails to $200 — under both the 9-EMA $201.17 and the mid-band $202.46, so the market has to reclaim two references to end it — 0.92 ATR from price, banking +3.1%. ⭐ The daily supports holding: hist +3.86, three bars positive and expanding, price clear of the 200-EMA $157.47 by a third. ⚠️ The weekly does not: hist −6.71, three bars negative and EXPANDING, with the 50-EMA $213.71 sitting directly on price as resistance — which is why this is trailed rather than added to. Falsifier: a close under $200.' },
    side: 'long', accent: 'blue',
    date: '2026-08-07',
    story: 'stories/mrvl.html',
  },
  {
    symbol: 'AVGO', exchange: 'NASDAQ',
    price: '$420.57', change: '📅 CLOSE $420.57 (+0.55%) — printed $427.58, the only new monthly high on the board (prior month $407.52); six bars of expanding daily momentum and the full daily + weekly EMA stacks intact → RANKED',
    signal: '📅 CLOSE 08/06 — RANKED: THE ONLY NEW MONTHLY HIGH HERE. Closed $420.57 (+0.55%) after printing $427.58, clear of last month’s $407.52 — no other card made a new monthly high. Daily histogram +4.82, six bars plus and EXPANDING, the longest run on the board; price rides above the upper band $419.22 with the daily and weekly EMA stacks both intact, and the weekly has now contracted three bars, not one. Entry $402–408 — last month’s high $407.52 plus the 9-EMA $402.06, 0.91 ATR below price, so it is reachable. Stop a close under $387, beneath the 50-EMA $391.73 / mid-band $390.97 / weekly 9-EMA $392.90 cluster: 1.05 ATR. Targets $427.58 → $473 → $495.',
    lead: { rank: 12, status: 'wait', entry: 'pullback holds $402–408', stop: '$387 (close)', targets: '$427.58 → $473 → $495', rr: '~5:1', edge: '⭐ THE STRONGEST TAPE ON THE BOARD, AND THE ONLY NEW MONTHLY HIGH. $427.58 clears last month’s $407.52 outright while 26 of 38 names closed at the bottom of their 3-day swing. Daily histogram +4.82 is six bars positive and EXPANDING — the longest such run here — with price above the upper band $419.22 and the full stack beneath it (9-EMA $402.06, 50-EMA $391.73, 200-EMA $362.43). ⭐ Its weekly repair is older than the crowd’s: three bars of contraction against the one bar the optical names just printed, and the monthly sits 2.89 from crossing after 42 bars positive. ⚠️ Entry is a pullback, not a chase: $402–408 pairs the prior-month high with the 9-EMA — two independent references — and sits only 0.91 ATR below price, so an ordinary day reaches it. The $387 stop clears the 50-EMA / mid-band / weekly 9-EMA cluster at 1.05 ATR. ⚠️ Falsifier: a close back under $407.52 puts the new monthly high back inside last month’s range and the ranking with it.' },
    side: 'long', accent: 'cyan',
    date: '2026-08-07',
    story: 'stories/avgo.html',
  },
  {
    symbol: 'AXON', exchange: 'NASDAQ',
    price: '$522.46', change: '📅 CLOSE $522.46 (−14.28%) — ⛔ the board’s worst day: a $112 range from $628.22 to $516.15, closing near the low and landing exactly on the 200-EMA $518.78',
    signal: '📅 CLOSE 08/06 — ⛔ WORST DAY ON THE BOARD, AND IT STOPPED ON THE 200-EMA. Closed $522.46 (−14.28%) after ranging $628.22 to $516.15 — a $112 day — finishing near the low and $3.68 above the 200-EMA $518.78, with the 50-EMA $512.24 just beneath. That pair is the whole decision now. ⚠️ Price lost the 9-EMA $554.13 and the mid-band $539.62 in one session, and monthly hist −25.81 is ten bars negative. ⭐ The 50/200-EMA cluster at $512–519 held on the close, which is the only thing keeping this a watch rather than a short. A close under $512.24 and it is neither.',
    side: 'long', accent: 'emerald',
    date: '2026-08-07', alert: true,
    story: 'stories/axon.html',
  },
  {
    symbol: 'CIEN', exchange: 'NYSE',
    price: '$403.76', change: '📅 CLOSE $403.76 (−1.24%) — held just above the mid-band $400.10 but 6.4% under the 50-EMA $431.54; unranked, weekly hist −24.30 contracted a first bar of nine',
    signal: '📅 CLOSE 08/06 — UNRANKED, WITH THE 50-EMA STILL THE WHOLE ARGUMENT. Closed $403.76 (−1.24%) after a $419.49 high, holding just above the mid-band $400.10 but 6.4% under the 50-EMA $431.54 — the level that has capped every attempt this month. ⭐ Daily hist +6.31 is four bars positive and expanding and price is over the 9-EMA $393.13 and 200-EMA $365.50. ⚠️ Weekly hist −24.30 contracted only its first bar after nine negative, and that turn rests on 08-04’s +5.21%. One bar is not a frame. Returns on a daily close over $431.54.',
    side: 'short', accent: 'red',
    date: '2026-08-07',
    story: 'stories/cien.html',
  },
  // ── 2026-07-31 · SCOUTED IN ── AMD, ASML and LRCX added after a computed
  // scout. All three pass the weekly trend filter that MU, LITE, BE, DRAM and
  // NBIS just failed — weekly RSI over the midline on a FRAGILE cross — which is
  // the whole basis for ranking them above names that were removed.
  {
    symbol: 'AMD', exchange: 'NASDAQ',
    price: '$489.28', change: '📅 CLOSE $489.28 (+1.50%) — zone $449–476 is 0.68 ATR below price and still reachable; stop nudged $424 → $421 so it clears last month’s $424.03 low and Rule B at 1.05 ATR',
    signal: '📅 CLOSE 08/06 — ZONE REACHABLE, STOP JUST UNDER THE LINE AND NOW OVER IT. Closed $489.28 (+1.50%). The $449–476 zone sits 0.68 ATR below price, comfortably reachable. ⚠️ The stop needed three dollars: $424 was 0.98 ATR from the $462.50 midpoint AND sat fractionally ABOVE last month’s $424.03 low, so it could be swept by a level that has already held once. $421 clears both at 1.05 ATR. R:R re-rates ~3:1 → ~2.7:1. Targets $486 → $515 → $574. ⚠️ Daily hist −2.57 has been negative 43 bars — the longest negative run on the board — even as price grinds higher.',
    lead: { rank: 7, status: 'wait', entry: 'pullback holds $449–476', stop: '$421 (close)', targets: '$486 → $515 → $574', rr: '~2.7:1', edge: '⚠️ A THREE-DOLLAR FIX THAT MATTERS MORE THAN IT LOOKS. The $424 stop was 0.98 ATR from the midpoint — a rounding error inside Rule B — but the real problem was that it sat $0.03 ABOVE last month’s low $424.03, so the invalidation line was placed exactly where a known level has already turned price once. $421 puts it under that low at 1.05 ATR. ⭐ The zone itself is healthy: $449–476 is 0.68 ATR below price, so it fills on an ordinary pullback rather than needing a collapse. ⚠️ The oddity to keep in view: daily hist −2.57 has now been negative FORTY-THREE bars, the longest run on this board, while price has climbed anyway — momentum and price have been disagreeing for two months, and the weekly −3.93 turning negative and expanding is the first sign price may be the one to give. Falsifier: a close under $455.30, this month’s low.' },
    side: 'long', accent: 'amber',
    date: '2026-08-07',
    story: 'stories/amd.html',
  },
  {
    symbol: 'ASML', exchange: 'NASDAQ',
    price: '$1,704.37', change: '📅 CLOSE $1,704.37 (+1.56%) — the $1,585–1,630 zone fell 1.18 ATR behind price; re-drawn to $1,681–1,704 on the 9-EMA and 50-EMA, stop $1,530 → $1,608',
    signal: '📅 CLOSE 08/06 — ZONE PULLED UP TO THE AVERAGES PRICE IS ACTUALLY USING. Closed $1,704.37 (+1.56%). The $1,585–1,630 zone had drifted 1.18 ATR below price and its $1,530 stop was 0.95 ATR from the midpoint — both marginal, both fixed together. Re-anchored to $1,681–1,704: the 9-EMA $1,680.74 and 50-EMA $1,703.64, two references bracketing price at 0.14 ATR. Stop a close under $1,608, above this month’s $1,582 low, 1.03 ATR. Targets $1,735 → $1,876 → $1,943. ⚠️ Daily hist −2.35 has been negative 31 bars and the weekly −18.30 is three bars negative and EXPANDING.',
    lead: { rank: 10, status: 'wait', entry: 'pullback holds $1,681–1,704', stop: '$1,608 (close)', targets: '$1,735 → $1,876 → $1,943', rr: '~3:1', edge: '⚠️ BOTH HALVES OF THIS PLAN WERE MARGINAL, SO BOTH MOVED. The zone sat 1.18 ATR below price — past reachable — and the stop was 0.95 ATR from its midpoint, just inside the Rule B floor. ⭐ The replacement is tight in the useful sense: the 9-EMA $1,680.74 and the 50-EMA $1,703.64 now bracket price, so the zone is where the stock is actually trading rather than where it traded a week ago, and at 0.14 ATR it fills on almost any red day. Stop $1,608 sits above this month’s low $1,582.00 at 1.03 ATR, and the targets are the month high $1,735, the upper band $1,876 and last month’s high $1,943 — levels, not round numbers. ⚠️ Momentum does not support size: the daily histogram has been negative THIRTY-ONE bars and the weekly −18.30 is three bars negative and EXPANDING. This is a name being bought back toward its averages, not one breaking out. Falsifier: a close under $1,582.' },
    side: 'long', accent: 'blue',
    date: '2026-08-07',
    story: 'stories/asml.html',
  },
  {
    symbol: 'LRCX', exchange: 'NASDAQ',
    price: '$305.77', change: '📅 CLOSE $305.77 (−0.54%) — re-anchored to $264–277 (lower band + month low) with the stop at $244; the honest note is that the zone is 1.36 ATR away and there is no closer confluence',
    signal: '📅 CLOSE 08/06 — RE-ANCHORED, AND STILL FURTHER THAN IDEAL. Closed $305.77 (−0.54%). The old $266–280 zone rested on nothing current and its $252 stop was 0.81 ATR from the midpoint. Re-drawn to $264–277 — the lower band $263.61 and this month’s $276.84 low, two independent references — with a stop under $244, below last month’s $250.50 low, at 1.02 ATR. ⚠️ Stated plainly: that zone is 1.36 ATR below price. Nothing closer qualifies — price sits inside its own MA cluster (9-EMA $302.17, mid-band $312.00, 50-EMA $318.36) with no confluence between. Targets $323.64 → $415.49 → $438.50.',
    lead: { rank: 16, status: 'wait', entry: 'pullback holds $264–277', stop: '$244 (close)', targets: '$323.64 → $415.49 → $438.50', rr: '~6.3:1', edge: '⚠️ THE ONE RE-DRAW THAT DOES NOT SOLVE ITS OWN PROBLEM, AND SAYS SO. The old $266–280 zone was 1.27 ATR away with a 0.81 ATR stop; the new $264–277 is anchored properly — lower band $263.61 plus this month’s low $276.84, two independent references — and the $244 stop clears last month’s low $250.50 at 1.02 ATR. But it is still 1.36 ATR below price, which by this board’s own test is not comfortably reachable. ⚠️ The reason is worth stating rather than hiding: price is sitting INSIDE its own moving-average cluster — 9-EMA $302.17 beneath, mid-band $312.00 and 50-EMA $318.36 above — and there is no confluence at all between $277 and $302. Drawing a zone in that gap would be inventing a level to make the plan look active, which is exactly the error Rule A exists to prevent. ⚠️ Weekly hist −7.81, three bars negative and EXPANDING. Falsifier: a close under $276.84.' },
    side: 'long', accent: 'emerald',
    date: '2026-08-07',
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
    price: '$359.49', change: '📅 CLOSE $359.49 (−0.87%) — RANKED: full daily stack intact, a 12-month high $376.98 made this month, monthly hist +16.75 four bars positive and EXPANDING · entry $340–347, stop $328',
    signal: '📅 CLOSE 08/06 — RANKED: ONE OF THE TWO CLEANEST UPTRENDS HERE, AND NEITHER IS A SEMI. Closed $359.49 (−0.87%) holding a full daily stack — over the 9-EMA $346.54, 50-EMA $309.90 and 200-EMA $237.68 — with this month’s $376.98 high also the 12-month high. Monthly hist +16.75 is four bars positive and EXPANDING, weekly +9.03 positive sixteen. Entry $340–347 (mid-band $339.68 + 9-EMA $346.54), 1.05 ATR below price. Stop a close under $328, beneath this month’s $330.00 low, 1.02 ATR. Targets $371.47 → $376.98 → $424. ⚠️ Monthly RSI 75.18 is extended: pullback entry, not a chase.',
    lead: { rank: 24, status: 'wait', entry: 'pullback holds $340–347', stop: '$328 (close)', targets: '$371.47 → $376.98 → $424', rr: '~5.2:1', edge: '⭐ RANKED, AND DELIBERATELY NOT A SEMICONDUCTOR. PANW holds a full daily stack (9-EMA $346.54, 50-EMA $309.90, 200-EMA $237.68), made this month’s $376.98 high which is also the 12-month high, and carries a monthly histogram of +16.75 that is four bars positive and EXPANDING — while the barometer this board trades under has a weekly histogram four bars negative and widening. That is the point of the position: it is exposure to the trend without exposure to the semi rollover. ⚠️ Entry is a pullback and the card will not chase it — $340–347 pairs the mid-band $339.68 with the 9-EMA $346.54, two independent references, 1.05 ATR below price, and the $328 stop clears this month’s low $330.00 at 1.02 ATR. ⚠️ Honest against: monthly RSI 75.18 and Stoch %K 83.15 are both extended, and T3 $424 is a measured move (the $330.00–376.98 month range projected off the high), not a level anything has traded at — T1 and T2 are real, T3 is arithmetic. Falsifier: a close under $330.00.' },
    side: 'long', accent: 'amber',
    date: '2026-08-07',
    story: 'stories/panw.html',
  },
  {
    symbol: 'CRWD', exchange: 'NASDAQ',
    price: '$207.39', change: '📅 CLOSE $207.39 (−1.18%) — RANKED: ⭐ the only card with daily, weekly AND monthly all rising, 12-month high $219.35 made this month · entry $195–200, stop $189',
    signal: '📅 CLOSE 08/06 — RANKED: ⭐ THE ONLY THREE-FRAME UPTREND ON THE BOARD. Closed $207.39 (−1.18%) with daily, weekly and monthly ALL rising — no other card can say that today. Weekly hist +4.05 is sixteen bars positive and EXPANDING, monthly +8.20 four and expanding, full daily stack beneath price (9-EMA $199.33, 50-EMA $181.03, 200-EMA $142.90), and this month’s $219.35 is the 12-month high. Entry $195–200 (mid-band $194.81 + 9-EMA $199.33), stop a close under $189 below the $192.60 month low, 1.02 ATR. Targets $216.36 → $219.35 → $246. ⚠️ Expiry attached: the only-three-frame claim ages in one bar, and its falsifier is the weekly histogram ceasing to expand.',
    lead: { rank: 22, status: 'wait', entry: 'pullback holds $195–200', stop: '$189 (close)', targets: '$216.36 → $219.35 → $246', rr: '~5.7:1', edge: '⭐ THE ONLY CARD HERE WITH DAILY, WEEKLY AND MONTHLY ALL RISING — and, as this board requires of any "only name that" claim, it ages in one bar: the falsifier is the weekly histogram ceasing to expand. Weekly +4.05 is sixteen bars positive and EXPANDING, monthly +8.20 four and expanding, and the full daily stack sits beneath price with the 200-EMA $142.90 a third of the way down. This month’s $219.35 is the 12-month high. ⚠️ Entry $195–200 pairs the mid-band $194.81 with the 9-EMA $199.33 and sits 1.19 ATR below price — over the one-ATR mark, which is stated rather than hidden: there is no reference between $199.33 and the close, so a nearer zone would be invented. Stop $189 clears the month low $192.60 at 1.02 ATR. ⚠️ T3 $246 is a measured move (the $192.60–219.35 month range projected off the high), not a traded level; T1 $216.36 is the upper band and T2 $219.35 the 12-month high. Monthly RSI 75.10 is extended. Falsifier: a close under $192.60.' },
    side: 'long', accent: 'red',
    date: '2026-08-07',
    story: 'stories/crwd.html',
  },
  {
    symbol: 'FTNT', exchange: 'NASDAQ',
    price: '$160.11', change: '📅 CLOSE $160.11 (−2.45%) — lost the 9-EMA $160.37 by 26 cents and closed under it; monthly still rising with a 12-month high $172.09 this month, but the daily has just turned',
    signal: '📅 CLOSE 08/06 — MONTHLY STILL RISING, DAILY JUST ROLLED. Closed $160.11 (−2.45%), twenty-six cents under the 9-EMA $160.37 — the first daily close below it in this leg — with daily hist +0.09 contracting toward zero. ⭐ The long frames are intact: monthly hist +7.64 four bars positive and expanding, weekly +2.42 positive twenty-nine, this month’s $172.09 the 12-month high, and the 50-EMA $148.15 a long way below. ⚠️ Weakest of the three security names today and the only one to lose its 9-EMA. Watch $158.27, this month’s low; under it the daily repair is over. Unranked.',
    side: 'long', accent: 'blue',
    date: '2026-08-07',
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
    price: '$160.39',
    change: '📅 CLOSE $160.39 (+1.82%) — green day inside a downtrend: still 10.2% under the 50-EMA $178.67 and 6.7% under the 200-EMA $171.81, with weekly hist −6.18 four bars negative and EXPANDING',
    signal: '📅 CLOSE 08/06 — A GREEN DAY THAT CHANGES NOTHING STRUCTURAL. Closed $160.39 (+1.82%), still 10.2% beneath the 50-EMA $178.67 and 6.7% beneath the 200-EMA $171.81 — the weakest average stack of any card here, and the 50-EMA is below the 200-EMA. ⚠️ Weekly hist −6.18 is four bars negative and EXPANDING; at 374% of MACD that cross is the deepest on the board. ⭐ Daily hist +0.35 turned positive for one bar and price reclaimed the 9-EMA $159.69. That is the entire bull case and it is one session old. The short thesis is intact; unranked because the nearest anchor, the 200-EMA, is 7% away.',
    side: 'short',
    date: '2026-08-07',
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
