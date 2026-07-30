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
  updated: '2026-07-30',
  markets: [
    {
      symbol: 'QQQ',
      label: 'Nasdaq-100 · QQQ',
      role: 'The index — what the whole tape is doing',
      price: '$680.94',
      change: 'mid-session +2.90% (+$19.21 vs the $661.73 close) · HOLDING above the reclaimed $678–680 shelf all session · stalled exactly at the first lower high ≈$681',
      checks: [
        {
          label: 'Weekly structure',
          verdict: 'neutral', weight: 1.5,
          read: 'Rolling over from the high, but NOT broken — weekly RSI 53.24 still over 50 and the multi-year rising structure is intact. This is a correction inside an uptrend until a weekly close says otherwise.',
        },
        {
          label: 'Daily trend',
          verdict: 'bear', weight: 1.5,
          read: 'Still lower highs and lower lows from the ≈$745 June peak — today is the first real counter-attack, but no DAILY swing high is taken out yet. That needs $695–700; until then this is a rally inside a downtrend.',
        },
        {
          label: 'The $678–680 shelf',
          verdict: 'neutral', weight: 1.5,
          read: 'RECLAIMED and now HELD for the whole session — $681.19 at 10:05, $680.94 mid-session. That is no longer an intraday poke: it is hours of acceptance above a shelf that was the lid all week, with $679.41 the immediate line under it. Still neutral on the same terms as the group: it flips bull on a daily CLOSE up here, and a fade back under $678 leaves the lid intact.',
        },
        {
          label: 'Descending trendline (≈$695)',
          verdict: 'bear', weight: 1.5,
          read: 'The line off the June highs has capped every attempt for six weeks and is still unbroken. Nothing above it has been tested.',
        },
        {
          label: 'Daily momentum',
          verdict: 'neutral',
          read: 'Turning up off 32.40 — a +2.9% session mechanically lifts the daily RSI off its floor, so momentum is no longer one-way down. The 1H RSI is 52.90: just over the midline, and worth contrasting with the memory leaders at Stoch 90+. The index has ROOM; they do not. Still not bullish until the DAILY 50 line is reclaimed and held.',
        },
        {
          label: 'Higher low above $661.58',
          verdict: 'neutral',
          read: 'Leg one is in: $661.58 held and price is +2.9% off it. The higher low itself needs the FIRST pullback to hold above $661.58 — and that pullback has not even started, because the session has simply parked at $679–681. Nothing to confirm yet; the supports to watch on the way down are $675.27, then the $665.35–667.74 cluster over the $661.58 low.',
        },
        {
          label: 'Implied vol (VXN)',
          verdict: 'neutral',
          read: 'The tell has INVERTED: VXN 28.08 (−8.95%) is collapsing off the 31 spike far faster than VIX (−1.28%) — NASDAQ-specific stress is unwinding, the exact mirror of yesterday. Still not bull until it breaks the ≈26 range floor.',
        },
      ],
      fast: {
        checks: [
          {
            label: '4H structure',
            verdict: 'bull', weight: 1.5,
            read: 'FLIPPED: the +3% session reclaimed the entire 4H EMA stack that had capped every lift for six weeks. The fast frame stopped going down and turned.',
          },
          {
            label: '4H momentum',
            verdict: 'bull',
            read: 'Turned up hard off the 25.38 extreme — the oversold spring the fast frame was loaded for actually fired instead of dying under the 9-EMA.',
          },
          {
            label: 'The first lower high ≈$681',
            verdict: 'neutral',
            read: 'Still AT it — and now for hours: $681.19 at 10:05, $680.94 mid-session, the current 1H bar fractionally red. Cuts both ways and that is the honest read: stalling at the first lower high of the whole decline is exactly where a dead-cat top forms, but refusing to give any of it back over several hours is not what a failing bounce does. A 4H close above $681 takes the lower high out; the ≈$695 trendline and the $700–708 supply box are the tests beyond it.',
          },
        ],
      },
      confirm: [
        { label: 'Undercut-and-reclaim of $661.58 on volume — a flush low bought back the same session', done: true },
        { label: 'Daily close back above the broken $678–680 shelf', done: false },
        { label: 'A higher low: pullback holds over $661.58, then the bounce high gets taken out', done: false },
        { label: 'Daily RSI reclaims 50 and holds it (and VXN back under ≈26)', done: false },
        { label: 'Daily close above the descending trendline ≈$695 — the trend has actually changed', done: false },
      ],
      levels: {
        reclaim: '$678–680 first, then ≈$695 (the trendline)',
        invalidate: 'a daily close under $661.58 → the $644–646 band is the next real shelf',
      },
      note: 'The index is doing the orderly version of this bounce: $680.94, holding the reclaimed $678–680 shelf all session with 1H RSI only 52.90 — no extension to unwind, unlike the memory leaders at Stoch 90+. The flip side is that it has stalled precisely at the first lower high ≈$681 and has not tested the ≈$695 trendline or the $700–708 supply box. Daily close ticks the box; AMZN tonight is unresolved.',
    },
    {
      symbol: 'SMH',
      label: 'Semis · SMH',
      role: 'The board’s barometer — the group that leads this tape',
      price: '$536.64',
      change: 'mid-session 12:39 ET +6.43% (+$32.42) · HOLDING over $535 three hours in · stalled at the $540 lid · $547–550 untested',
      checks: [
        {
          label: 'Weekly structure',
          verdict: 'neutral', weight: 1.5,
          read: 'A deep correction, not a broken weekly trend — the 50-week $431 sits far below and untested. The parabola is unwinding, which is not the same thing as a trend break.',
        },
        {
          label: 'Daily trend',
          verdict: 'bear', weight: 1.5,
          read: 'The lower-high/lower-low sequence is under real attack but not yet broken: $505.66, the $510–518 lid and $535 are all reclaimed, yet no DAILY swing high is taken out. That needs $547–550 — the same test QQQ has at $695.',
        },
        {
          label: 'The 0.618 at ≈$478',
          verdict: 'bull', weight: 1.5,
          read: 'HELD, violently. The fib tag at $483.32 produced a +11.5% reversal in one session — that is what a real bottom off deep fib support looks like, and it is the strongest single piece of evidence on this board.',
        },
        {
          label: 'Overhead stack',
          verdict: 'bull', weight: 1.5,
          read: 'The rejection zone FAILED to reject: the $513.80 4H 9-EMA and $535 — the lids that killed every lift for six weeks — are both reclaimed, and the $515.68 low held the band on the retest. Price now sits above the 1H 50-EMA $529.65 too. But the next lid is holding: the $540 zone capped the move mid-session and $547–550 has not been tested, with the 1H 200-EMA $560.16 above that.',
        },
        {
          label: 'Group leadership',
          verdict: 'bull',
          read: 'INVERTED but NARROWING. The group still leads the index (SMH +6.43% vs QQQ +2.97%, the QQQ print being the 10:05 snapshot) and the leaders defended their majors instead of losing them. The caveat is in the afternoon arithmetic: from 10:00 to 12:40 the memory names EXTENDED (MU +13.19% → +15.68%, SNDK +21.51% → +23.01%) while the index gave back 0.42pp — so the non-memory components must have drifted lower. This leg is memory-specific, not a broad group reversal, which matters for every non-memory short on the board.',
        },
        {
          label: 'Bounce confirmation',
          verdict: 'neutral',
          read: 'Three hours in and the reclaim HOLDS — $536.64, +6.43%, above $535 the whole way. That matters, because this is the first pop of the week that did not fade from the open (TER, BE, STX all did). Held neutral on purpose: the bar this check set is the daily CLOSE over $535, and 15:30 macro plus AMZN tonight are still ahead of it.',
        },
      ],
      fast: {
        checks: [
          {
            label: 'Undercut-and-reclaim of the 0.618',
            verdict: 'bull', weight: 1.5,
            read: 'CONFIRMED: flush to $483.32, snap back, and +11.5% off it in a session. The fast frame called this before the daily had any evidence at all.',
          },
          {
            label: '4H momentum',
            verdict: 'bull',
            read: 'Exploded off the 22.57 extreme and has not given it back: on the 1H frame RSI 60.17 with the MACD histogram expanding green and the line closing on zero (−7.60 → −2.35, a cross pending). The spring fired instead of dying under the 9-EMA.',
          },
          {
            label: '$505.66–510 reclaim',
            verdict: 'bull',
            read: 'Taken decisively in the regular session, and the $515.68 low retested the band and held. The trigger this gauge was waiting on has printed.',
          },
          {
            label: 'The $540 lid · volume test',
            verdict: 'neutral',
            read: 'Improving, unresolved. The extension has been WORKED OFF rather than rejected — price slipped back under the 1H upper band (≈$541) and went sideways instead of failing — and the volume question is starting to answer: 1H OBV is RISING (57.2M → 61.3M), where the 30m series was still negative at the open. Against that: the $540 lid is unbroken, $547–550 untested, and Stoch is still pinned at 90.35. Digesting, not confirmed.',
          },
        ],
      },
      confirm: [
        { label: 'Hold $500 in the regular session — the AH snap-back is not enough on its own', done: true },
        { label: 'Reclaim $505.66–510 — the sweep low that broke, back over the line', done: true },
        { label: 'Daily close above the 4H 9-EMA $513.80, then a push at $535', done: false },
        { label: '4H divergence at the lows: a marginal new low with RSI higher', done: false },
        { label: 'Close above $580 with breadth — the fade regime is over', done: false },
      ],
      levels: {
        reclaim: '$540 (the lid capping it mid-session) → $547–550 (the daily swing-high test) → the 1H 200-EMA $560.16',
        invalidate: 'a daily close back under $535 fails the reclaim; under $505.66 the whole bounce voids → $483/$478 retest',
      },
      note: 'Three hours in, the reclaim holds: $536.64 (+6.43%), above $535 the whole session, extension worked off under the band with 1H OBV rising — the first pop this week that did not fade from the open. But read the composition: the index is FLAT since 10:00 while the memory leaders extended (MU +15.68%, SNDK +23.01%), so the afternoon leg is memory-specific and the rest of the group is drifting. Still stalled at $540 with $547–550 untested, Stoch pinned at 90, 15:30 macro plus AMZN ahead. Same instruction: bank shorts into it, chase nothing.',
    },
  ],
  vol: [
    {
      symbol: 'VIX', value: '18.26', range: [15, 22], change: '−2.98% · pressing the ≈18 line · rejected 20.01',
      verdict: 'neutral',
      read: 'Selling off harder as the session goes on (−2.98%, down from 18.58 at the open) after rejecting the 20.01 line — now pressing the ≈18 level that this gauge named as the sign the bid in fear is done. A break under 18 would be the cleanest confirmation the bounce has of anything.',
    },
    {
      symbol: 'VXN', value: '28.50', range: [24, 33], change: '−7.59% · off the 31 spike · ≈26 floor intact',
      verdict: 'neutral',
      read: 'Still down hard on the day (−7.59%) and still leading VIX lower in percentage terms — NASDAQ stress unwinding fastest. But note the level, not just the move: 28.50 has ticked UP from the 28.08 morning print and the ≈26 range floor is untouched. Fear is cheaper, not gone.',
    },
  ],
  note: 'Mid-session: the index is orderly, the memory leaders are stretched. QQQ $680.94 (+2.90%) has held its reclaimed $678–680 shelf all session with 1H RSI just 52.90 — no extension to unwind — but it is parked exactly at the first lower high ≈$681 with the ≈$695 trendline and the $700–708 box untested. SMH $536.64 (+6.43%) likewise held $535 for three hours yet is flat since 10:00 and stalled at $540, $547–550 untested. The move is in memory: MU +15.68% (took its $853 lid) and SNDK +23.01% (inside its re-short zone), both at Stoch 90+ and overextended on 15-min. That is the whole read — the index has room and the leaders do not, so the afternoon leg is memory-specific rather than a broad group reversal. Practical split: memory shorts are the ones bleeding and their zones need a rejection that has NOT come; non-memory shorts (COHR, LITE, NVDA, ALAB, CRDO) are not being told much yet. VIX pressing ≈18 is the one clean confirmation, VXN 28.50 never reached its ≈26 floor, 15:30 macro and AMZN tonight unresolved. Bands unchanged — SMH Repairing, QQQ Rolling over. Bank shorts into strength, chase nothing.',
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
//   story      path to the interactive presentation HTML
//
// To add a stock: drop its story at stories/<symbol>.html and add an entry here.
const STOCKS = [
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
  // ⚠️ NOT REFRESHED (no fresh print available this session): CRWV, LITE, NVDA,
  // COHR, DRAM, AAOI, WDC, INTC, TER, GLW, STX, ASTS, NBIS, AMAT, BE, ALAB,
  // CRDO, DELL, MRVL, META, TSLA — all still carry 7/29 close data. Assume the
  // same squeeze hit the shorts among them and read their zones as stale until
  // each is revisited. (The trend meter and the VIX/VXN minis ARE current — see
  // the 10:05 snapshot above.)
  // NOTE (mechanical): the "Booked at targets" strip is computed from the CURRENT
  // price, so names whose price squeezed back above T1 (MU, IREN) drop out of it
  // even though those targets were realised on the way down. Worth deciding
  // whether the strip should remember tagged targets rather than re-derive them.
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
  {
    symbol: 'META', exchange: 'NASDAQ',
    price: '$585.61', change: 'close −1.31% $585.61 · PM $536.85 −8.33% — earnings gap ONTO the two-year shelf $525–540 / 200-week ≈ $530',
    signal: 'Bottom-hunt at the two-year shelf — the earnings gap delivered the price. META closed $585.61 (−1.31%) and the print did the rest overnight: pre-market $536.85 (−8.33%), a gap through the June lows landing exactly where this stock has bottomed twice before — the $525–540 demand shelf (April-2025 and April-2026 lows, both V-bought) with the 200-week EMA ≈ $530 beneath, the PM print sitting ON the daily lower band $538.49. The 1H is still detonation-shaped (RSI 23.61, MACD −14.64, OBV −150M — no divergence yet) and the daily frame is broken (RSI 31.76, under the daily 200-EMA $630.68), so this is a buy-the-flip, not buy-the-gap: probes $530–538 once the open stabilizes, core on an undercut-and-reclaim of $525–530, stop under $515. Flip checklist: undercut-and-reclaim of the lows → 1H RSI/OBV divergence → first 1H close over $555 (9-EMA) → reclaim of $585.61 (the gap top) = bottom likely in. Recovery targets $555 → $585.61 → $609–612 (daily 50 + 1H 200-EMA) → $626–631 (50-week + daily 200 — full repair). A daily close under $525 breaks the shelf — untested air to ≈ $420, long off.',
    edge: 'Bottom-hunt long at the two-year shelf: the earnings gap (−8.33% PM to $536.85) landed exactly on the $525–540 demand shelf that V-bottomed in Apr-25 and Apr-26, with the 200-week EMA ≈ $530 beneath and the print ON the daily lower band $538.49 — first reaction lies, so buy the FLIP, not the gap: probes $530–538 post-open, core on an undercut-and-reclaim of $525–530, stop <$515 — flip confirms on a 1H close >$555 then a reclaim of the $585.61 gap top, targets $555 → $585.61 → $609–612 → $626–631; a daily close <$525 = air to ≈ $420, long off (off the ranked board, a watch)',
    side: 'long', accent: 'blue',
    date: '2026-07-30',
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
    price: '$298.32', change: 'close −2.97% $298.32 · PM $298.72 · sitting ON the 200-week EMA ≈ $299 · under BOTH lower bands',
    signal: 'The EV bellwether’s waterfall lands on THE multi-year level. Six straight red sessions took TSLA ≈ −24% from ~$390, cutting the daily 200-EMA $392.56 without a pause — and the close $298.32 (−2.97%) sits exactly ON the 200-week EMA ≈ $299.04 (pre-market $298.72), far below both lower Bollinger bands (weekly $347.70, daily ≈ $332). The daily is pinned (RSI 25.42, Stoch 4.64, MACD −14.94 still accelerating — no divergence yet), but the 1H has based at $295–300 for two sessions (RSI 40, Stoch curling from 18) — the tape’s first flattening, though 1H OBV is still negative (−375M). This is NOT a short — no fresh shorts into the hole at a multi-year rail; it’s a bottom-watch long: accumulate IN $290–300, scaled ($297–300 first adds, $290–295 the core on an undercut flush), stop under $283. A bottom confirms on a reclaim of $310 → $332 (daily 9-EMA + lower band); recovery targets $332 → $343 (1H 200-EMA) → $382–392 (the broken daily 50/200 shelf). A weekly close under $285 is the first break of the 200-week rail this cycle — long off, and below there is only the 2025 base ≈ $215.',
    edge: 'Bottom-watch for a long at THE multi-year rail: a ≈ −24% six-session waterfall landed exactly ON the 200-week EMA ≈ $299 (close $298.32, PM $298.72), under BOTH lower Bollinger bands with the daily pinned (RSI 25.42, Stoch 4.64) — too late to short the hole, too early to call the bottom (no divergence, 1H OBV −375M): accumulate IN $290–300 scaled ($297–300 first, $290–295 core), stop under $283 — a reclaim of $310 → $332 confirms the bottom toward $332 → $343 → $382–392, a weekly close under $285 breaks the rail → the 2025 base ≈ $215 (off the ranked board, a watch)',
    side: 'long', accent: 'red',
    date: '2026-07-30',
    story: 'stories/tsla.html',
  },
  {
    symbol: 'CRWV', exchange: 'NASDAQ',
    price: '$60.82', change: 'close −9.63% $60.82 · AH $59.6 · below the weekly lower band · ⚠️ META prints tonight — the capex binary',
    signal: 'AI-cloud pure play — the group’s newest breakdown, falling into META’s print. CRWV collapsed −9.63% to $60.82 (AH ≈ $59.6) after losing the $68.5–74 floor of the 2026 range — and it is now under EVERY frame: below the weekly lower Bollinger ($67.67, weekly Stoch 9.16), daily RSI 28.04 / Stoch 6.46, 4H RSI 19.94 with OBV deeply negative (−350M). As the pure-play AI-capacity provider it trades as a lever on hyperscaler capex — and ⚠️ META reports TONIGHT: the capex commentary is the binary, and this week’s lesson (TER, BE, STX — every pop faded) cuts both ways — don’t carry a fresh position through the print, and don’t trust the first reaction. The map: overhead the 4H 9-EMA ≈ $65 → daily 9-EMA $69.71 → 4H 50-EMA $74.16 — a $65–74 fade zone sitting right on the broken range floor; stop $81 (the 4H upper band / late-July lower-high). Targets: 🎯 T1 ≈ $49.4 — the post-IPO shelf — then 🕳️ T2 $40, the IPO base. Don’t chase $60 below the weekly band: the entry is a FAILED post-print bounce into $65–74, or a decisive continuation under the $59.6 AH low after META. A reclaim of $81 repairs; over $88 (4H 200-EMA / daily 50-EMA) the short is wrong.',
    lead: { rank: 1, status: 'wait', entry: 'fade $65–74 / break <$59.6 post-META', stop: '$81', targets: '$49.4 → $40', downside: '−29%', tail: '−43%', rr: '~2.5:1', edge: 'AI-cloud pure play — the group’s newest breakdown, falling into META’s print: CRWV collapsed −9.63% to $60.82 (AH $59.6) after losing the $68.5–74 floor of the 2026 range, now under every frame (below the weekly lower band, daily RSI 28, 4H OBV −350M); ⚠️ META reports tonight and the capex read is the binary — don’t chase $60 and don’t carry a position through the print: fade a FAILED post-print bounce into $65–74 (4H 9-EMA → daily 9-EMA → 4H 50-EMA on the broken floor) or short a decisive break of the $59.6 AH low after META, stop $81 — targets the ≈$49.4 post-IPO shelf → 🕳️ the $40 IPO base; a reclaim of $81 repairs, $88 negates' },
    side: 'short', accent: 'cyan',
    date: '2026-07-29',
    story: 'stories/crwv.html',
  },
  {
    symbol: 'LITE', exchange: 'NASDAQ',
    price: '$602.35', change: 'close −7.61% $602.35 · AH $598.09 · ✅ CLOSED under $610 — the first 200-day break of the run CONFIRMED',
    signal: 'Photonics joins the group break — the trigger FIRED: the first daily close under the 200-day in the entire run. LITE closed $602.35 (−7.61%), a decisive close UNDER the daily 200-EMA ≈ $610 — the confirmation the card demanded — and slid to $598.09 after hours, sitting on the $596 prior low. The short is filled at the break. The 30-min tape backs it: OBV has gone NEGATIVE (−3.23M), MACD −11.94, Stoch 21.52 — every lift dying under the 30-min 9-EMA $616, and the $640–660 fade zone is now reinforced by the 30-min 50-EMA $644. The weekly is only starting to roll from a record parabola (plenty of room below), and peer COHR is already pressing its LAST target after the same 200-day break. The air pocket is open: 50-week ≈ $500 → the $419 base. Near-term both frames stay oversold — don’t chase into $596; the add is a failed bounce into $640–660, stop $665. A reclaim of $665 repairs it; full structural repair only above the 30-min 200-EMA $721.',
    lead: { rank: 3, status: 'live', entry: 'break <$610 filled', stop: '$665', targets: '$500 → $419', downside: '−18%', tail: '−31%', rr: '~2.5:1', edge: 'Photonics joins the group break — the trigger FIRED: LITE closed $602.35 (−7.61%), the first decisive daily close UNDER the 200-day ≈ $610 in the whole $50 → ~$1,050 run (AH $598.09, on the $596 low) — short filled at the break; 30-min OBV NEGATIVE (−3.23M), lifts dying under the 9-EMA $616, the $640–660 fade zone reinforced by the 30-min 50-EMA $644, peer COHR already pressing its last target after the same break — air pocket open to the 50-week ≈ $500 → the $419 base, add the failed bounce into $640–660, stop $665, a reclaim of $665 repairs it' },
    side: 'short',
    date: '2026-07-29',
    story: 'stories/lite.html',
  },
  {
    symbol: 'NVDA', exchange: 'NASDAQ',
    price: '$190.01', change: 'close −3.55% $190.01 · ✅ broke $194 — trigger FILLED · flushed $183.66 through T1 $189, bought back · AH flat',
    signal: 'The leader flipped short — the trigger fired, and T1 got tagged the same day. NVDA broke $194 and closed $190.01 (−3.55%) after an intraday flush to $183.66 — straight through T1, the 200-day $189 — that was bought right back into the close (AH flat). The break entry is filled (≈ +2% at the close) and the first target already banked on the flush. But the shape of the day is the same tell as the barometer’s: an undercut-and-reclaim of THE major level — NVDA’s 200-day and SMH’s 0.618 in the same afternoon. It cuts both ways: hold $189 and reclaim $194 tomorrow → the group’s reflex bounce is on (the fade zone above moves to $197–202: 1H 50-EMA $197.13 → the old cluster); fail $189 / $183.66 on a daily close → trail to T2 $182 → T3 $174. The 1H is oversold (RSI 33.73, Stoch 30.96) — don’t press the 200-day tag: bank/trail like the rest of the board. Only a reclaim of $206 returns the long.',
    lead: { rank: 8, status: 'live', entry: 'break <$194 filled', stop: '$206', targets: '$189 → $182 → $174', downside: '−6%', tail: '−13%', rr: '~3:1', edge: 'The leader flipped short — the trigger fired and T1 got tagged the same day: NVDA broke $194, flushed to $183.66 straight through the 200-day $189 and was bought back to a $190.01 close (−3.55%, AH flat) — entry filled ≈ +2%, first target banked on the flush; the day is an undercut-and-reclaim of the 200-day, mirroring SMH’s 0.618 tag the same afternoon — hold $189 + reclaim $194 = the group’s bounce tell (fade zone moves to $197–202), a daily close under $189/$183.66 = trail to $182 → $174; don’t press the 200-day tag, only a reclaim of $206 returns the long' },
    side: 'short', accent: 'red',
    date: '2026-07-29',
    story: 'stories/nvda.html',
  },
  {
    symbol: 'COHR', exchange: 'NYSE',
    price: '$222.05', change: 'close −8.75% $222.05 · AH $218.01 · pressing 🕳️ T3 $215 — the LAST target · ≈ +28% short',
    signal: 'Weekly-structure break — the re-short is pressing the LAST target. COHR closed $222.05 (−8.75%) and slid after hours to $218.01 (−1.82%) — within ~1.4% of 🕳️ T3 $215, the weekly lower band and the final target on the plan (T1 $265 and T2 $247 long banked). That is ≈ +28% for the short from the $310 re-arm (≈ +30% at the AH print). The 1H is pinned oversold and staying there — RSI 28.76, Stoch 14.61, MACD −8.38, OBV bleeding to 25.8M — trend-mode: every lift dies under the 1H 9-EMA $227. The overhead has come down: the add zone pulls down to $252–266 (1H 50-EMA → the broken daily 200-EMA; was $260–282). Stance: the plan is nearly complete — bank into the $215 tag, don’t press a fresh short into the last target; re-short a bounce into $252–266, stop $321 untouched and far — only a reclaim of $321 repairs it.',
    lead: { rank: 10, status: 'live', entry: '$310 filled', stop: '$321', targets: '$265 → $247 → $215', downside: '−14%', tail: '−30%', rr: '~5:1', edge: 'Weekly-structure break — pressing the LAST target: COHR closed $222.05 (−8.75%), AH $218.01, within ~1.4% of 🕳️ T3 $215 (T1 $265 + T2 $247 long banked, ≈ +28% for the short from $310, ≈ +30% AH); 1H pinned oversold (RSI 28.76, Stoch 14.61, OBV bleeding) — trend-mode, every lift dies under the 1H 9-EMA $227 — bank into the $215 tag, don’t press the last target, re-short a bounce into $252–266 (zone pulled down from $260–282), only a reclaim of $321 repairs it' },
    side: 'short', accent: 'violet',
    date: '2026-07-29',
    story: 'stories/cohr.html',
  },
  {
    symbol: 'IREN', exchange: 'NASDAQ',
    price: '$37.31', change: 'session +27.28% (+$8.00) at 10:00 ET · ⚠️ the squeeze risk the card named — price is back AT the $38.90 short entry · stop $42 now ~12% away',
    signal: '⚠️ The squeeze the card flagged is what happened — this trade is over. IREN is $37.31 (+27.28%, +$8.00 at 10:00 ET), a vertical off the $29.20 low that took the $31–34 add zone, the banked T2 $30, the banked T1 $34 and the whole 30-min stack (9-EMA ≈ $33.6 → 50-EMA/VWAP ≈ $35.6) in one move, punching into the 30-min 200-EMA ≈ $37–39 and straight back to the $38.90 short entry. Honest scorekeeping: T1 $34 and T2 $30 were realised on the way down, but the runner toward 🕳️ $27 is dead — the position is now ≈ +4% from $38.90, down from ≈ +25% yesterday. The ≈$2.8B AI-cloud catalyst was named as the squeeze risk from day one and it is what is driving this. Do: cover the runner into the strength — don’t defend a short at your own entry after a +27% day. Don’t: short it here. Stop $42 is unchanged and now only ~12% away, and a reclaim of $41.70 flips the setup long. What would re-arm the short is a failure right here — rejection at the 200-EMA and a close back under ≈$35.6 — with the caveat that 30-min OBV is still deeply negative (−91.5M) and Stoch is pinned at 96.83: covering fuel spending itself, not proven accumulation. Two of three targets banked; take the win and let the level pick the next trade. 🚦 GROUP GATE reinforces it: the barometer is $536.64 (+6.43% at 12:39 ET) and has held above its reclaimed $535 for three hours, daily bar Repairing — a re-short here needs BOTH the local failure under ≈$35.6 AND an SMH daily close back under $535. Its close over $547–550 takes the group premise away entirely.',
    lead: { rank: 9, status: 'live', entry: '$38.90 filled', stop: '$42', targets: '$34 → $30 → $27', downside: '−13%', tail: '−31%', rr: '~3:1', edge: '⚠️ The squeeze the card flagged is what happened — the trade is over: IREN is $37.31 (+27.28% at 10:00 ET), a vertical off $29.20 that took the $31–34 add zone, the banked T2 $30 and T1 $34 and the whole 30-min stack in one move, back AT the $38.90 short entry (position ≈ +4%, was ≈ +25% — T1/T2 realised, the 🕳️ $27 runner dead); the ≈$2.8B AI-cloud catalyst named as the squeeze risk is driving it — cover the runner into strength, don’t defend a short at your own entry, don’t short it here: stop $42 is ~12% away and $41.70 flips it long; a re-arm needs rejection at the 30-min 200-EMA and a close back under ≈$35.6, and OBV still −91.5M with Stoch pinned 96.83 reads as covering fuel, not accumulation; 🚦 a re-short needs BOTH that local failure AND an SMH daily close back under $535 (barometer $536.64, three hours above it, daily bar Repairing) — its close over $547–550 takes the group premise away entirely' },
    side: 'short', accent: 'red',
    date: '2026-07-30',
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
  // ───────────────────────────────────────────────────────────────────────────
  {
    symbol: 'DRAM', exchange: 'CBOE',
    price: '$44.85', change: 'close −6.11% $44.85 · AH $43.69 · ❌ the $47.5–48.5 cluster BROKE (close <$47 = major failure) · next $42–44 → washout $38.5–40',
    signal: 'Roundhill Memory ETF — the cluster BROKE: the major-failure line triggered. The $47.5–48.5 magnet (61.8% fib + rising 50-day + lower BB) held for exactly one day: DRAM closed $44.85 (−6.11%) — through the card’s "close <$47 = major failure" line — and slid to $43.69 after hours, already at the doorstep of the next zone, $42–44 (the prior consolidation). ~75% of the fund is three memory names (Micron 25.8%, Samsung ~25%, SK Hynix ~24%), and the basket’s leader just printed its worst day (MU −9.94%, AH on T2) — the feedback loop keeps pointing down; OBV dropped to 105M. The bounce lid pulls down to $46.3–48.5 (1H 9-EMA $46.31 + the broken cluster) — a reflex bounce there is the re-short, not a bottom. Below $42–44: 🕳️ the washout $38.5–40. The regime line stays $61 — nothing turns neutral until it is reclaimed. Overnight Korea-gap risk stands: Samsung/SK Hynix set the open.',
    edge: 'Korean-memory basket (≈75% Micron/Samsung/SK Hynix) — the cluster BROKE: DRAM closed $44.85 (−6.11%), through the "close <$47 = major failure" line, AH $43.69 at the doorstep of the $42–44 prior consolidation; the magnet held one day, the basket leader MU printed −9.94%, OBV down to 105M — the bounce lid pulls down to $46.3–48.5 (1H 9-EMA + broken cluster) where a reflex is the re-short, next 🕳️ washout $38.5–40, $61 still the regime line, Korea-gap risk overnight',
    side: 'short', accent: 'indigo',
    date: '2026-07-29',
    story: 'stories/dram.html',
  },
  {
    symbol: 'AAOI', exchange: 'NASDAQ',
    price: '$76.52', change: 'close −13.18% $76.52 · AH $74.66 · ✓ T2 $82 SMASHED · driving to 🕳️ T3 $58 · ≈ +32% short',
    signal: 'Heaviest OBV collapse in the group — T2 smashed on the worst day yet. AAOI closed $76.52 (−13.18%) — clean THROUGH T2 $82 (banked, one day after T1 $90) — and slid after hours to $74.66. That is ≈ +32% for the short from the $113 re-arm (≈ +34% at the AH print), now driving toward the only target left: 🕳️ T3, the weekly 21-MA $58. The tape keeps confirming this is own weakness, not just sector beta: 1H OBV has gone NEGATIVE (−7.12M), RSI 25.11, Stoch 8.30 — the heaviest bleed on the board — with everything capping far overhead (1H 9-EMA $80 → 50-EMA $90 → 200-EMA $105). The add zone pulls down to $80–90 (broken T2 / 1H 9→50-EMA; was $97–104). Extremely oversold on every frame, so a reflex bounce is due — add the bounce, don’t chase $75. Below $58 the deep map is the 50-week ≈ $47. Only a reclaim back over $120 ends it.',
    lead: { rank: 4, status: 'live', entry: '$113 filled', stop: '$120', targets: '$90 → $82 → $58', downside: '−16%', tail: '−41%', rr: '~4:1', edge: 'Heaviest OBV collapse in the group — T2 smashed on the worst day yet: AAOI closed $76.52 (−13.18%), clean through T2 $82 (banked, one day after T1 $90), AH $74.66 — ≈ +32% for the short from $113 (≈ +34% AH), driving to the last target 🕳️ T3 $58 (weekly 21-MA); 1H OBV NEGATIVE (−7.12M), RSI 25.11, Stoch 8.30 — own weakness, not sector beta — add zone pulled down to $80–90 (broken T2 / 1H 9→50-EMA), don’t chase $75, only a reclaim over $120 ends it' },
    side: 'short', accent: 'violet',
    date: '2026-07-29',
    story: 'stories/aaoi.html',
  },
  {
    symbol: 'WDC', exchange: 'NASDAQ',
    price: '$462.04', change: 'close −0.32% $462.04 · AH $454.16 — probing UNDER the T3 magnet · the bounce died at the 1H 50-EMA · ≈ +10% short',
    signal: 'The fence broke, the whole plan paid — and the bounce already died. Yesterday’s sharp AH bounce to $481.97 never reached the $486–513 re-short zone: it stalled under the 1H 50-EMA ($483) and rolled straight back — WDC closed $462.04 (−0.32%) and slid to $454.16 after hours, probing UNDER the $455–461 magnet (T3 $455 / daily lower BB / weekly mid-BB) that banked the plan. All three targets stay banked, ≈ +10% for the short from $513 (≈ +11% at the AH print). A bounce too weak to reach its own re-short zone is a bearish tell — the re-short zone pulls down to $469–484 (1H 9-EMA $469 → 50-EMA $483), and the 1H is rolling over again (RSI 41.70, Stoch down from 64, MACD −3.29). But this is still a deep pullback in an intact weekly uptrend (far above the weekly 50-EMA $339): the magnet was the target — don’t press the low; the new information would be a decisive daily close under $450 (the 1H lower band), which extends the slide. A reclaim of $513 → $525 → $535 re-negates.',
    lead: { rank: 11, status: 'live', entry: '$513 filled', stop: '$535', targets: '$486 → $475 → $455', downside: '−5%', tail: '−11%', rr: '~2.5:1', edge: 'The fence broke, the plan paid — and the bounce already died: yesterday’s AH bounce to $481.97 stalled under the 1H 50-EMA ($483), never reaching $486–513, and WDC closed $462.04 (−0.32%), AH $454.16 probing UNDER the $455–461 magnet (all three targets banked, ≈ +10% from $513, ≈ +11% AH); a bounce too weak to reach its own zone is a bearish tell — re-short zone pulled down to $469–484 (1H 9→50-EMA), a decisive daily close under $450 extends the slide, don’t press the magnet low, a reclaim of $513→$535 re-negates' },
    side: 'short',
    date: '2026-07-29',
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
    price: '$854.84', change: 'mid-session 12:41 ET +15.68% (+$115.84) · ❗ the $853 first lid is TAKEN — 1H 50-EMA reclaimed · now into the $868–886 last-defence zone, $886–890 the fakeout line',
    signal: '❗ The 50-day defence became a trend day — the first lid is gone and the short is down to its last one. The after-hours tag of T2 (the daily 50-day $714, print $718.38) was the low of the move, and MU has not stopped: $836.50 at 10:00 ET, now $854.84 (+15.68%, +$115.84 at 12:41 ET). That means the $853–854 lid this card named as "where the day is decided" — the 1H 50-EMA plus the upper band — is TAKEN, and price is inside the approach to the $868–886 shelf (daily mid-BB), the LAST defence before the plan’s own fakeout line. Note the confluence there: the 1H 200-EMA has fallen to ≈ $890, so $886–890 is now one line, not two — a close above it takes the short off by the card’s own rule, with the $905 entry only ~6% away. Momentum keeps confirming, not fading: 1H RSI 63.27, MACD line up from −20.33 to −7.38 with the histogram expanding (+9.60) — a zero cross pending — OBV 226M and rising, price above session VWAP $816.06. The only bear tell left is exhaustion, not structure: Stoch 94.03 is deep into extreme. Position: ≈ +5.5% from $905, down from +7.6% at 10:00 and +18% yesterday; stop $1,005 untouched, ~18% away. Stance, unchanged in rule but tighter in fact: the add is a REJECTION at $868–886, never a chase — and the rejection has NOT come, which is itself the information. ⏱️ 15-MIN FRAME: badly overextended here — and that is the useful part, because the 15-min is where the rejection this plan requires would show FIRST. Confirmation ladder, fastest to slowest: a 15-min lower high plus loss of the 15-min 9-EMA is the early tell → a 1H close back under $853 confirms the reclaim failed → the daily close decides the trend. Take the tell as a reason to WATCH the zone, not as the entry: 15-min stretch on a +15.68% trend day resolves as a pause at least as often as a reversal. A close over $886–890 ends the short. Targets below ($714 → $665 → 🕳️ $505) now need a whole new leg and a group that turns back down with it. 🚦 GROUP GATE: the barometer is $536.64 (+6.43% at 12:39 ET) and has now held above its reclaimed $535 for three hours — daily bar Repairing, and the first pop this week that did not fade from the open. So no fresh short in this name while SMH holds $535, however clean the rejection looks. The board-wide pair: an SMH daily close over $547–550 takes out the group’s daily swing high and removes the premise under this short; an SMH daily close back under $535 re-arms it.',
    lead: { rank: 2, status: 'live', entry: '$905 filled', stop: '$1,005', targets: '$800 → $714 → $665 → $505', downside: '−11%', tail: '−44%', rr: '~4:1', edge: '❗ The 50-day defence became a trend day — the first lid is gone: the AH tag of T2 $714 ($718.38) was the LOW and MU has not stopped, $836.50 at 10:00 → $854.84 (+15.68%) at 12:41 ET, TAKING the $853–854 lid this card called the day’s decider (1H 50-EMA + upper band) and pushing into the $868–886 last-defence shelf, where the 1H 200-EMA has fallen to ≈ $890 — so $886–890 is now ONE line, and a close above it ends the short with the $905 entry only ~6% up; momentum still confirming (RSI 63.27, MACD −20.33 → −7.38 with the histogram expanding, OBV 226M rising, price over VWAP $816.06), only Stoch 94.03 says exhaustion; position ≈ +5.5% from $905 (was +7.6% at 10:00, +18% yesterday), stop $1,005 far — add only on a REJECTION at $868–886, and the rejection has NOT come, which is the information: a 1H close back under $853 is the first sign it failed; ⏱️ the 15-min frame is badly overextended, which is where that rejection shows FIRST (15-min lower high + loss of the 15-min 9-EMA the early tell, the 1H close under $853 the confirmation) — a reason to watch the zone, not to front-run it, since a stretched 15-min on a +15.68% trend day resolves as a pause as often as a reversal — and 🚦 no fresh short at all while the barometer holds $535 (SMH $536.64, +6.43%, three hours above it — daily bar Repairing): its close over $547–550 removes the premise, its close under $535 re-arms it' },
    side: 'short', accent: 'cyan',
    date: '2026-07-30',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$319.41', change: 'close −0.39% $319.41 · AH $315.69 · ✅ the earnings pop FADED — short re-armed → T1 $308 · ≈ +8%',
    signal: 'The earnings verdict is in — the pop faded, the short re-armed. Yesterday’s +13.19% after-hours squeeze to $362.95 did not survive the regular session: TER sold off from the open all day and closed $319.41 (−0.39%) — the entire pop given back, price back UNDER the broken $326 shelf and the $346 entry. That is exactly the fade-back scenario the plan named as re-arm; AH slid further to $315.69. The $358 stop was never touched on a daily close — the short is intact and working again, ≈ +8% from $346 (≈ +9% at the AH print). The 1H rolled over as fast as it spiked: Stoch 15.92 from ~90, RSI 38.79, MACD fading to 0.73, OBV 39.9M — with the 1H stack capping above (9-EMA $332 → 50-EMA $337 → 200-EMA $351). Resume the plan: T1 $308 → $292 → 🕳️ 200-EMA $280; a bounce into $326–337 (broken shelf / 1H 50-EMA) is the cleaner add. Only a daily close back over $358 negates.',
    lead: { rank: 6, status: 'live', entry: '$346 filled', stop: '$358', targets: '$308 → $292 → $280', downside: '−11%', tail: '−19%', rr: '~4:1', edge: 'The earnings verdict is in — the pop FADED: yesterday’s +13.19% AH squeeze to $362.95 sold off from the open, TER closed $319.41 (−0.39%), back under the broken $326 shelf and the $346 entry (the exact re-arm scenario; AH $315.69, ≈ +8% for the short, ≈ +9% AH); the $358 stop never touched on a daily close, 1H rolled over (Stoch 15.92 from ~90, the $332/$337/$351 stack capping) — back on the plan to T1 $308 → $292 → 🕳️ $280, add a bounce into $326–337, only a daily close over $358 negates' },
    side: 'short', accent: 'blue',
    date: '2026-07-29',
    story: 'stories/ter.html',
  },
  {
    symbol: 'GLW', exchange: 'NYSE',
    price: '$124.05', change: 'close −1.56% $124.05 · AH $121.86 · all targets banked ~+21% · dead-cat STALLING under $128–137',
    signal: 'Earnings detonation — the fade paid in full; now the bounce is stalling. Day two after the print: the dead-cat bounce never even reached the $128–137 resistance zone — GLW closed $124.05 (−1.56%) and slid to $121.86 after hours, drifting back toward the ≈ $115 washout low (the daily 200-EMA that caught it). The 1H shows the bounce dying: RSI 38.97, Stoch rolling down from ~82, MACD −2.38, OBV dropping to 118M — the former-support $128–137 band (plus the 1H 50-EMA ≈ $132) is holding as the lid without even being tagged. The trade stays complete — all three targets ($151 → $144 → $130) banked, ~+21% for the short from the ~$160 rejection. No fresh entry either way: a bounce too weak to reach its own resistance zone says sellers still control, but a booked win needs no re-entry — a push into $128–137 remains where a re-short would set up, not the drift.',
    lead: { rank: 14, status: 'booked', entry: '$160 filled', stop: '$184', targets: '$151 → $144 → $130', downside: '−9%', tail: '−14%', rr: '~3:1', edge: 'Earnings detonation — the fade paid in full and the dead-cat is STALLING: day two, the bounce never reached $128–137 — GLW closed $124.05 (−1.56%), AH $121.86, drifting back toward the ≈ $115 washout low (daily 200-EMA); 1H bounce dying (RSI 38.97, Stoch rolling from ~82, OBV down to 118M), the $128–137 band + 1H 50-EMA ≈ $132 the untouched lid — all three targets banked ~+21%, trade complete, off the ranked table (banked in the strip); no fresh entry, a re-short still only sets up on a push into $128–137' },
    side: 'short', accent: 'blue',
    date: '2026-07-29',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,249.55', change: 'mid-session 12:40 ET +23.01% (+$233.66) · grinding INTO the $1,234–1,287 re-short zone · extension worked off under the upper band $1,251.12',
    signal: '❗ The board’s biggest winner keeps giving it back — and it is now grinding INSIDE the re-short zone. SNDK was $1,234.38 at 10:00 ET and is $1,249.55 (+23.01%, +$233.66 at 12:40 ET): the $991.69 after-hours print was the low, the daily 200-EMA ≈ $958 target never got tagged, and the entire $1,045–1,183 re-load zone the card drew yesterday was cleared in one gap and stayed cleared. The short is ≈ +18.6% from the $1,536 re-arm, down from ≈ +20% at the open and ≈ +34% yesterday; stop $1,590 untouched, ~27% away. Where the trade actually sits: price is INSIDE the re-drawn $1,234–1,287 zone, ~3% under the banked T2 $1,287 (weekly 21-MA) that is now the decider — and, importantly, it slipped back UNDER the 1H upper Bollinger $1,251.12 while grinding higher, i.e. the extension is being worked off instead of rejected. That is bull-flag behaviour, not blow-off behaviour. Momentum agrees: RSI 67.88, MACD line up from −26.94 to −8.85 with the histogram expanding (+26.30) toward a zero cross, OBV 154M rising, price well above VWAP $1,217.82 and far above the 1H 9/50-EMA cluster $1,162–1,165. Only Stoch 92.24 argues exhaustion. So the plan holds but the odds have shifted: the re-short needs a REJECTION at $1,287, confirmed by a 1H close back under the $1,162 EMA cluster — that re-arms it toward the mid-band $1,073 → $958. ⏱️ 15-MIN FRAME: badly overextended — the same tell as MU, and the same use: the 15-min is where the rejection at $1,287 would print FIRST. Ladder: 15-min lower high plus loss of the 15-min 9-EMA (early tell) → 1H close back under the $1,162 EMA cluster (confirmation) → daily close (verdict). It is a reason to watch the zone, not to short into it — the 1H picture here is a bull flag working off its extension, and stretched short-frame readings inside a bull flag usually resolve sideways. A close over $1,287 puts the trade on hold up to the 1H 200-EMA $1,412.60. Bank what is banked; the 🕳️ 50-week $880 needs a whole new leg. 🚦 GROUP GATE: the barometer is $536.64 (+6.43% at 12:39 ET), three hours above its reclaimed $535 with its daily bar Repairing and 1H OBV rising — so no fresh short here while SMH holds $535. An SMH daily close over $547–550 removes the premise under this short; a close back under $535 re-arms it.',
    lead: { rank: 5, status: 'live', entry: '$1,536 filled', stop: '$1,590', targets: '$1,287 → $880', downside: '−16%', tail: '−43%', rr: '~4:1', edge: '❗ The board’s biggest winner keeps giving it back and is now grinding INSIDE the re-short zone: $1,234.38 at 10:00 → $1,249.55 (+23.01%) at 12:40 ET, the $991.69 AH print the low, the $958 target never tagged and the whole $1,045–1,183 re-load zone cleared and staying cleared — short ≈ +18.6% from $1,536 (was ≈ +20% at the open, ≈ +34% yesterday), stop $1,590 ~27% away; price sits ~3% under the banked T2 $1,287 (weekly 21-MA, the decider) and slipped back UNDER the 1H upper band $1,251.12 while grinding higher — extension worked off, not rejected: bull-flag, not blow-off, with RSI 67.88, MACD −26.94 → −8.85 and the histogram expanding, OBV 154M rising, price over VWAP $1,217.82 and far above the $1,162–1,165 EMA cluster (only Stoch 92.24 says exhaustion); the re-short needs a REJECTION at $1,287 plus a 1H close back under $1,162 to re-arm toward $1,073 → $958, a close over $1,287 puts it on hold to the 1H 200-EMA $1,412.60 — ⏱️ the 15-min frame is badly overextended, which is exactly where the $1,287 rejection would show FIRST (15-min lower high + loss of the 15-min 9-EMA the early tell, 1H close under $1,162 the confirmation): a reason to watch the zone, not to short into a bull flag working off its extension' },
    side: 'short', accent: 'red',
    date: '2026-07-30',
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$536.64', change: 'mid-session 12:39 ET +6.43% (+$32.42) · ✅ HOLDING over the reclaimed $535 three hours in · stalled at the $540 lid · $547–550 still untested',
    signal: '✅ The bounce-watch this card armed at the fib FIRED — and three hours in, it is holding rather than fading. The setup was written yesterday: the flush to $483.32 effectively tagged the 0.618 ≈ $478, and the confirmation demanded was a regular session holding $500 and reclaiming $505.66–510. The session did all of it and more: SMH ran to $538.75 (+6.85%) THROUGH the $535 swing low, the $515.68 low retested the $510–518 band and held, and at 12:39 ET price is $536.64 (+6.43%) — still above $535, above the 1H 50-EMA $529.65, having gone SIDEWAYS at the highs instead of giving it back. That is the tell worth naming: every pop this week (TER, BE, STX) failed from the open. This one has not. Two things improved since the open: the extension got WORKED OFF (price slipped back under the 1H upper band ≈$541 and consolidated rather than rejecting) and 1H OBV is RISING (57.2M → 61.3M) with the MACD histogram expanding green and the line closing on zero (−7.60 → −2.35) — the volume confirmation the morning print lacked is starting to arrive. What is still NOT done, and it is the whole trade: the $540 lid capped the move and $547–550 — the DAILY swing high — has not been tested. Stoch is pinned at 90.35, VXN 28.50 has ticked up from 28.08 and never reached its ≈26 floor, and 15:30 macro plus AMZN tonight sit between here and the close. Overhead: $540 → $547–550 → the 1H 200-EMA $560.16 → $580 with breadth, the only thing that ends the fade regime. Below: a daily close back under $535 fails the reclaim; under $505.66 the whole bounce voids → $483/$478. The one clean confirmation on the board is VIX at 18.26 (−2.98%) pressing the ≈18 line this gauge named. Stance unchanged: BANK shorts into this, do not chase longs — every zone drawn at yesterday’s stack sits below price and is void, so re-shorts only on a REJECTION from each card’s re-drawn zone.',
    edge: '✅ The bounce-watch this card armed at the fib FIRED and three hours in it is HOLDING, not fading: SMH ran to $538.75 (+6.85%) through the $535 swing low and sits $536.64 (+6.43%) at 12:39 ET — still over $535 and the 1H 50-EMA $529.65, sideways at the highs where every other pop this week (TER, BE, STX) failed from the open; two things improved — the extension worked off under the 1H upper band ≈$541 instead of rejecting, and 1H OBV is RISING (57.2M → 61.3M) with MACD closing on zero (−7.60 → −2.35) — but the whole trade is still undone: the $540 lid capped it, the DAILY swing high $547–550 is untested, Stoch pinned 90.35, VXN 28.50 ticked UP from 28.08 and never hit its ≈26 floor, 15:30 macro + AMZN ahead; ladder $540 → $547–550 → 1H 200-EMA $560.16 → $580 with breadth, a daily close under $535 fails the reclaim and under $505.66 the bounce voids → $483/$478 — VIX 18.26 pressing ≈18 is the one clean confirmation; bank shorts into it, chase nothing, re-short only on a rejection from a re-drawn zone',
    side: 'short', accent: 'red',
    date: '2026-07-30',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$764.43', change: 'close +2.29% $764.43 — but the beat squeeze SOLD from $823.73 · AH $754.91 · daily close back UNDER $770 — fade re-arming',
    signal: 'The fence broke, earnings reversed it — and now the squeeze is fading like the others. Day two: the post-beat squeeze opened high and sold all session — from an $823.73 high (right under the 4H 50-EMA $831, the same lid that killed yesterday’s $830 AH spike) down to a $764.43 close (+2.29% on the day, but ~−7% off the high) — and AH slid to $754.91. That puts the daily close back UNDER the $770 line the card set: the re-arm condition is in — the fade toward the weekly 21-MA ≈ $700 re-arms, the third beat this week (after TER and BE) that could not hold its pop. Caveats are real: the beat is real and the day still finished green, so expect chop, not a clean slide — the short case needs the $786–830 lid to keep holding (4H 9-EMA $786 → broken $788 shelf → squeeze zone $801–830 / 4H 50-EMA $831); the cleaner entry is a failed bounce there, not a chase. A hold back above $788 repairs the structure; a reclaim of $835 ends the short case for good. Below: the $721 low (with the 4H lower band $717) → 🕳️ the $700 magnet.',
    edge: 'The fence broke, earnings reversed it — and the squeeze is fading like the others: day two sold from an $823.73 high (right under the 4H 50-EMA $831, the lid that killed yesterday’s $830 AH spike) to a $764.43 close, AH $754.91 — the daily close back UNDER the $770 line, so the re-arm toward the weekly 21-MA ≈ $700 is in (the third beat this week after TER and BE that couldn’t hold its pop); but the beat is real and the day finished green — chop risk: enter only on a failed bounce into $786–830, a hold over $788 repairs, a reclaim of $835 ends the short case; below — $721 → 🕳️ $700',
    side: 'short', accent: 'amber',
    date: '2026-07-29',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$53.03', change: 'close −6.22% $53.03 · AH $52.05 · ✅ decisive close UNDER $56 — short CONFIRMED · → T1 $50',
    signal: 'Flipped short — the $56 line broke: confirmation is in. ASTS closed $53.03 (−6.22%), a decisive close UNDER the $56 must-hold line the card was waiting for — the short confirms — and slid to $52.05 after hours, already most of the way to T1 $50 (the daily lower band). The 1H is one-way again: RSI 27.99, Stoch 7.87, MACD −0.58, OBV rolling down to 116M — with the whole stack overhead (9-EMA $54.13 → 50-EMA $56.45 → 200-EMA $61.05, the stop itself). Don’t chase $52 into the T1 tag — the cleaner add is a bounce into $54–56.5 (1H 9→50-EMA over the broken $56 line, now the lid). Map: T1 $50 → T2 $45 → 🕳️ T3 $41 (the weekly support). Risks unchanged: the $1B convert (dilution) is the bear side, the B. Riley Buy $85 / Midland catalyst the squeeze side — smaller size. A reclaim of $61 stops-and-flips long toward the daily 200-EMA ≈ $76. Off the ranked board.',
    edge: 'Flipped short — the $56 line broke, confirmation in: ASTS closed $53.03 (−6.22%), a decisive close under the $56 must-hold line, AH $52.05 already most of the way to T1 $50; 1H one-way (RSI 27.99, Stoch 7.87, OBV rolling) with the $54.13/$56.45/$61.05 stack overhead — don’t chase into the T1 tag, add a bounce into $54–56.5 (broken $56 = the lid), map $50 → $45 → 🕳️ $41; $1B convert the bear side, B. Riley $85 the squeeze risk (smaller size), a reclaim of $61 stops-and-flips long toward the 200-EMA ≈ $76',
    side: 'short', accent: 'violet',
    date: '2026-07-29',
    story: 'stories/asts.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$148.22', change: 'close −12.65% $148.22 · AH $147.06 — ON T2 $147 · ✓ T1 $160 + the 200-day cleared in a day · ≈ +26% short',
    signal: 'Breakdown leader — T1 banked and T2 tagging at the AH print. The third savage day in a row (−15.02% → −9.68% → −12.65%): NBIS closed $148.22, clearing T1 $160 AND the daily 200-EMA ≈ $152 in one session, and the after-hours print $147.06 sits right ON T2 $147. That is ≈ +26% for the short from the $200 entry. The tape is one-way: OBV plunging to −74.6M — distribution accelerating — with the whole 1H stack far overhead (9-EMA $155 → 50-EMA $174 → 200-EMA $195). Near-term deeply oversold again (1H RSI 30.68, Stoch 21.77, MACD −6.63), so a reflex bounce is due — DON’T press into the T2 tag: bank/trail here; the add zone pulls down to $155–174 (1H 9→50-EMA; was $181–196). Below T2 the map runs to 🕳️ T3 $130. Only a 2nd close back over $213 ends it — miles overhead now.',
    lead: { rank: 7, status: 'live', entry: '$200 filled', stop: '$213', targets: '$160 → $147 → $130', downside: '−15%', tail: '−31%', rr: '~3:1', edge: 'Breakdown leader — T1 banked, T2 tagging at the AH print: third savage day in a row (−15.02% → −9.68% → −12.65%), NBIS closed $148.22, through T1 $160 AND the daily 200-EMA ≈ $152 in one session, AH $147.06 right on T2 $147 (≈ +26% for the short from $200); OBV plunging to −74.6M, oversold again (1H RSI 30.68, Stoch 21.77) — don’t press into the tag, bank/trail, add a bounce into $155–174 (zone pulled down from $181–196), next 🕳️ T3 $130, a 2nd close over $213 ends it' },
    side: 'short', accent: 'indigo',
    date: '2026-07-29',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$436.45', change: 'close −8.40% $436.45 · AH $441.01 · ❗ cut THROUGH the weekly 50-EMA zone $455–466 in one session · stretched — no chase',
    signal: 'Technical fade — now testing the weekly frame itself. AMAT collapsed another −8.40% to $436.45, slicing straight through the $455–466 weekly 50-EMA zone — yesterday’s "deep correction" anchor — in a single session; AH bounced +1.04% to $441.01, back toward the broken zone. That changes the caveat: the card kept AMAT off the board because "the higher timeframes are only cooling, not broken" — a close under the weekly 50-EMA is the first real weekly-frame damage. The next sessions decide which it was: a washout undercut of the weekly rail — a fast reclaim of $455–466 (especially if SMH’s AH fib-tag bounce plays out) would mark a washout low — or the pullback graduating into a weekly downtrend. Extremely stretched (4H RSI 26.43, Stoch 6.45, MACD −21.84), so no chasing either direction: the re-short zone pulls down to $464–476 (4H 9-EMA $464 / the broken ≈$473 shelf; was $493–513), and below $436 there is no mapped structure — air until the weekly frame gives the next anchor. Repair ladder: $455–466 first, $492 second, $513→$530 negates. Stays off the ranked board.',
    edge: 'Technical fade now testing the weekly frame — AMAT collapsed −8.40% to $436.45, cutting through the $455–466 weekly 50-EMA zone (yesterday’s deep-correction anchor) in one session, AH $441.01 bouncing back toward it; first real weekly-frame damage, so the next sessions decide: a fast reclaim of $455–466 = washout low (especially if SMH’s fib-tag bounce plays), a failed reclaim = weekly downtrend; extremely stretched (4H RSI 26.43, Stoch 6.45) — no chase, re-short only from $464–476 (4H 9-EMA / broken ≈$473, was $493–513), below $436 unmapped air, $513→$530 negates (off the board)',
    side: 'short', accent: 'red',
    date: '2026-07-29',
    story: 'stories/amat.html',
  },
  {
    symbol: 'BE', exchange: 'NYSE',
    price: '$163.75', change: 'close −1.85% $163.75 · AH $159.24 — testing the $157–160 week-low shelf · booked ~+26% · continuation map added',
    signal: 'Downtrend leader — all targets banked, the squeeze faded, and the drop is now BELOW the banked map. Day two delivered the verdict: yesterday’s +10.88% AH squeeze to $185 (high $191) sold off through the regular session — BE closed $163.75 (−1.85%), back UNDER the broken T3 $170, and slid to $159.24 after hours. The complete win stands (all three targets $200 → $185 → $170 banked, ≈ +26% from $219–234) — but price has left the old map, so here is the CONTINUATION: first support is the $157–160 week-low shelf (the deepest prints of the 7/28–29 sessions) — the AH print $159.24 is testing it NOW. A decisive daily close under $157 opens the round $150 shelf; below $150 the slide is in untested air (nothing between it and the prior base — deeper rungs need the weekly frame). Overhead unchanged: the 1H stack caps ($168 → $180 → $209), a reclaim of $200 / the 50-EMA repairs the bulls. The continuation setup: a failed bounce under $168–180 is the re-short, targeting $157–160 → $150 — post-print squeeze risk is real, so small size; it is a NEW trade, not the booked one.',
    lead: { rank: 15, status: 'booked', entry: '$219–234 filled', stop: '$250', targets: '$200 → $185 → $170', downside: '−10%', tail: '−17%', rr: '~3:1', edge: 'Downtrend leader — all targets banked (≈ +26% from $219–234, off the ranked table, banked in the strip), the post-beat squeeze faded, and price has left the banked map: BE closed $163.75, AH $159.24 testing the $157–160 week-low shelf — the CONTINUATION map: $157–160 first support (testing now), a decisive close under $157 opens the round $150 shelf, below that untested air to the prior base; the re-short (a NEW trade, small size — squeeze risk) is a failed bounce under $168–180 targeting $157–160 → $150, a reclaim of $200 / 50-EMA repairs the bulls' },
    side: 'short', accent: 'amber',
    date: '2026-07-29',
    story: 'stories/be.html',
  },
  {
    symbol: 'ALAB', exchange: 'NASDAQ',
    price: '$249.74', change: 'close −4.03% $249.74 · AH $244.85 · ✓ T3 $250 TAGGED on the close — ALL targets banked · ≈ +19% short',
    signal: 'Dip-buy dead — the fade closed ON the $250 base: all three targets banked. ALAB closed $249.74 (−4.03%), tagging 🕳️ T3 — the May base $250 — to the dollar, then slid to $244.85 after hours. The full plan ($300 → $280 → $250) is banked: ≈ +19% for the short from the $310 entry (≈ +21% at the AH print). The plan’s objective is done — this is where you bank/trail, not press: the base + weekly 21-MA is major support, with the rising daily 200-EMA ≈ $231 the deeper magnet below for a trailing runner. The 1H is oversold and basing (RSI 39.09, Stoch 36.94, MACD −5.80) with the whole stack overhead (9-EMA $255 → 50-EMA $270 → 200-EMA $312) — the add zone pulls down to $255–280 (1H 9→50-EMA / broken T2; was $280–297), and a re-short only sets up from there, not at the base. A reclaim of $362 is still the only full repair of the long case.',
    lead: { rank: 13, status: 'live', entry: '$310 filled', stop: '$362', targets: '$300 → $280 → $250', downside: '−10%', tail: '−19%', rr: '~3:1', edge: 'Dip-buy dead — the fade closed ON the base, all targets banked: ALAB closed $249.74 (−4.03%), tagging 🕳️ T3 $250 (May base) to the dollar, AH $244.85 — the full plan ($300 → $280 → $250) banked, ≈ +19% for the short from $310 (≈ +21% AH); the base + weekly 21-MA is major support with the daily 200-EMA ≈ $231 the deeper magnet — bank/trail, don’t press the base tag; add zone pulled down to $255–280 (1H 9→50-EMA / broken T2), only a reclaim of $362 repairs the long' },
    side: 'short', accent: 'emerald',
    date: '2026-07-29',
    story: 'stories/alab.html',
  },
  {
    symbol: 'CRDO', exchange: 'NASDAQ',
    price: '$177.45', change: 'close −7.71% $177.45 · AH $171.58 · ✓ T1 $200 + T2 $190 banked · AH tags T3 $175 / the 200-EMA · ≈ +21% short',
    signal: 'The fade delivered the whole ladder — T2 banked, and the AH print tags T3. CRDO closed $177.45 (−7.71%), clean through T2 $190 (banked, after T1 $200) — ≈ +21% for the short from the $219–230 entry — and after hours it kept sliding to $171.58 (−3.31%), tagging the 🕳️ $175 breakout shelf and the rising daily 200-EMA ≈ $172 it lines up with. That is the plan’s last support: bank into $175/$172, don’t press the low into a rising 200-EMA with the daily this oversold (RSI 34.17, Stoch 11.34, MACD −7.27). The weekly uptrend is intact — this is still a leader’s correction arriving at the level where dip-buyers defend. A bounce back into the broken $203–210 zone is the re-short; a daily CLOSE under $172 would open a fresh leg down (a new setup, not this plan); a reclaim of $242 repairs the long case.',
    lead: { rank: 12, status: 'live', entry: '$219–230 filled', stop: '$242', targets: '$200 → $190 → $175', downside: '−1%', tail: '−15%', rr: '~2.5:1', edge: 'Ladder delivered — CRDO closed $177.45 (−7.71%) through T2 $190 (banked, after T1 $200), ≈ +21% for the short from $219–230, and AH $171.58 tags T3: the 🕳️ $175 shelf + the rising daily 200-EMA ≈ $172, the plan’s last support — bank into $175/$172, don’t press a rising 200-EMA with the daily deeply oversold (RSI 34.17, Stoch 11.34); re-short a bounce into $203–210, a daily close under $172 is a new leg, reclaim $242 repairs the long' },
    side: 'short', accent: 'cyan',
    date: '2026-07-29',
    story: 'stories/crdo.html',
  },
  {
    symbol: 'DELL', exchange: 'NYSE',
    price: '$369.64', change: 'close −5.73% $369.64 · AH $364.00 — the defended $368 low BROKE · ✓ T1 $377 done · next 🕳️ $330',
    signal: 'Bull-flag break — the chop resolved down: the buyers’ defense gave way. The failed-retest of $402 never came — DELL just slid: closed $369.64 (−5.73%), through the $377 T1 (done), and after hours broke the ≈$368 low the buyers defended on the plunge day — $364.00. That resolves the "expect chop" read: the defense line is gone, and below it the map runs to 🕳️ T2 $330, the earnings-gap fill. The tape agrees — OBV collapsed to 22M, the 1H is one-way (RSI 32.69, Stoch 23.10, MACD −8.90) with the whole stack overhead (9-EMA $373 → 50-EMA $397 → 200-EMA $413). Don’t chase the AH break: the session has to confirm with a daily close under $368, and the cleaner entry is a bounce into $373–392 (1H 9-EMA / the broken structure). Still far above the daily 200-EMA ≈ $250 — a deep leg in a powerful uptrend, not a crash; a reclaim of $402 → $420 negates and restores the long. Off the ranked board.',
    edge: 'Bull-flag break — the chop resolved down: no $402 retest ever came, DELL slid to a $369.64 close (−5.73%) through the $377 T1, and AH broke the defended ≈$368 plunge low ($364.00) — the buyers’ line is gone, map runs to 🕳️ T2 $330 (earnings-gap fill); OBV collapsed to 22M, 1H one-way with the $373/$397/$413 stack overhead — a daily close under $368 confirms, don’t chase the AH break, enter on a bounce into $373–392 (1H 9-EMA / broken structure); deep leg in an intact uptrend (200-EMA ≈$250 far below), a reclaim of $402 → $420 restores the long, off the ranked board',
    side: 'short', accent: 'amber',
    date: '2026-07-29',
    story: 'stories/dell.html',
  },
  {
    symbol: 'MRVL', exchange: 'NASDAQ',
    price: '$163.40', change: 'close −6.34% $163.40 · AH $160.60 · knife through $172–178 — at the door of the MAIN $150–160 load zone',
    signal: 'Bottom-watch — the knife cut through the starter zone; the main load is at the door. MRVL closed $163.40 (−6.34%), slicing straight through the $172–178 first accumulation shelf, and slid to $160.60 after hours — right at the top of the MAIN $150–160 zone, where the daily 200-EMA (≈ $155) and the weekly 50-EMA (≈ $146) line up: the “back up the truck” dip the card was waiting for. The starter probe is under water — that is why it was sized as a probe; the real load was always $150–160, not the shelf. Conditions are still falling-knife (1H RSI 33.23, Stoch 28.53, MACD −4.18, the whole 1H stack overhead: $169 → $179 → $200), so accumulate IN the zone, scaled — $158–160 first adds, $150–155 the core at the 200-EMA — stop under $142. Invalidation unchanged: a weekly close under $146 breaks the multi-year uptrend — no long there. A confirmed bottom is still a reclaim of $185 → $198–200; recovery targets $200 → $220 → $245. Off the ranked board (a watch).',
    edge: 'Bottom-watch for a long — the knife cut through the starter zone: MRVL closed $163.40 (−6.34%), through the $172–178 shelf, AH $160.60 — right at the top of the MAIN $150–160 load zone (daily 200-EMA ≈$155 + weekly 50-EMA ≈$146); still falling-knife (1H RSI 33.23, the $169/$179/$200 stack overhead) so accumulate IN the zone, scaled — $158–160 first adds, $150–155 the core, stop under $142; a reclaim of $185 → $198–200 confirms the bottom toward $200 → $220 → $245, a weekly close under $146 breaks the trend (off the ranked board, a watch)',
    side: 'long', accent: 'blue',
    date: '2026-07-29',
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
