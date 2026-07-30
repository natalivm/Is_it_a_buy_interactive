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
          read: 'INVERTED but NARROWING. The group still leads the index (SMH +6.43% vs QQQ +2.97%, the QQQ print being the 10:05 snapshot) and the leaders defended their majors instead of losing them. The caveat is in the afternoon arithmetic: from 10:00 to 12:40 the memory names EXTENDED (MU +13.19% → +15.68%, SNDK +21.51% → +23.01%) while the index gave back 0.42pp — so the non-memory components must have drifted lower. ⚠️ CORRECTED as the session went on: this is NOT memory-specific. BE (power) +25.57%, DELL (AI servers) +10.10% and STX (storage) +10.73% are all ripping alongside memory and IREN (AI-cloud), so the move is a squeeze across the whole beaten-down AI-INFRASTRUCTURE cohort. SMH sits flat because the driver is short-covering in the most-shorted names, not a sector bid.',
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
  // COHR, DRAM, AAOI, WDC, TER, GLW, ASTS, AMAT,
  // CRDO, MRVL, META, TSLA — all still carry 7/29 close data. Assume the
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
    price: '$306.85', change: '⚠️ 2:12 ET +2.86% (+$8.52) · the 200-week rail HELD — price left the $290–300 zone upward · the $310 confirm line ~1% up · but OBV −392M, heavier than the PM read',
    signal: '⚠️ The rail held and the bottom-watch is doing its job — but volume hasn’t signed the bounce yet. TSLA is $306.85 (+2.86%, +$8.52 at 2:12 ET): the 200-week EMA ≈ $299 caught the six-session waterfall exactly as drawn, the $290–300 accumulation zone filled its first adds ($297–300), and price has now left the zone upward — pressing the 1H 50-EMA ≈ $308 with the 1H upper band ≈ $311 just above. The first bottom-confirm line the card set — a reclaim of $310 — is ~1% away, and it is the trigger, not this drift: a daily close over $310 confirms the turn toward $332 (daily 9-EMA + lower band) → the 1H 200-EMA $339.64 (rolled down from $343) → the $382–392 broken shelf. Momentum is repairing on schedule — RSI 56.19 from 40, the MACD line closing on zero from −2.75, Stoch 72.38 rising — but the caveat is the same one that kept the INTC card honest: 1H OBV is −392M, actually HEAVIER than the −375M at the pre-market read. This bounce is running on light volume, not visible accumulation, and TSLA is not part of the AI-infra squeeze printing +11–27% around it — a +2.86% drift on falling OBV earns no chase. Plan unchanged in structure: adds only on a dip back into $297–303 (the old zone top / 1H mid-band ≈ $304), stop under $283; above $310 on a daily close the confirmation buys itself. A weekly close under $285 still breaks the rail — long off, and below is only the 2025 base ≈ $215.',
    edge: '⚠️ The rail held, the bottom-watch is working — but volume hasn’t signed it: TSLA $306.85 (+2.86% at 2:12 ET) bounced out of the $290–300 accumulation zone the card drew on the 200-week EMA ≈ $299 (first adds $297–300 filled), now pressing the 1H 50-EMA ≈ $308 with the $310 confirm line ~1% up — a daily close over $310 confirms toward $332 → the 1H 200-EMA $339.64 → $382–392; momentum repairs on schedule (RSI 56.19, MACD closing on zero, Stoch 72.38) but 1H OBV is −392M, HEAVIER than the −375M pre-market read — light-volume drift, not visible accumulation, and TSLA is outside the AI-infra squeeze: no chase under $310, adds only on a dip into $297–303, stop under $283; a weekly close under $285 breaks the rail → the 2025 base ≈ $215 (off the ranked board, a watch)',
    side: 'long', accent: 'red',
    date: '2026-07-30',
    story: 'stories/tsla.html',
  },
  {
    symbol: 'CRWV', exchange: 'NASDAQ',
    price: '$74.47', change: '❗ 2:06 ET +22.43% (+$13.65) · AT the top of the $65–74 fade zone — the trigger is LIVE · META’s capex print resolved RED and it rallied anyway',
    signal: '❗ The setup has arrived at its trigger — and the reason it arrived is the strongest argument FOR it. CRWV is $74.47 (+22.43%, +$13.65 at 2:06 ET), which is the top of the $65–74 fade zone this card named as the entry. Read what happened around it: the binary this card was waiting on — META’s capex print — resolved RED (META gapped −8.33% pre-market to $536.85, and its own card is on the board), and CRWV rallied 22% anyway. That is not a fundamental re-rate, it is short covering, and the tape says so: OBV is still −129M, barely off its worst, while RSI 70.66 and Stoch 95.40 sit at extremes and the MACD line has only just crossed positive (0.68) with its histogram already reddening. Bad news plus a 22% rally plus no accumulation is exactly the shape of a failed bounce — which is the entry this plan asked for. The zone moves up to where price actually is: $74.47 sits under a tight overhead confluence of the 1H upper band $76.48 and the 1H 200-EMA $77.78, with the $81 stop only ~9% above — so $74–78 is the decision band and the risk is defined and small. Entry discipline unchanged and it matters: this needs a REJECTION in $74–78 (a 1H close back under the 9-EMA $71.31 is the confirmation), not a short into a vertical candle. Status stays wait until that rejection prints. Targets unchanged: 🎯 $49.4 (the post-IPO shelf) → 🕳️ $40 (the IPO base), with the mid-band $65.57 and the broken $59.6 low on the way. A reclaim of $81 repairs it; over $88 (4H 200-EMA / daily 50-EMA) the short is simply wrong. 🚦 Cohort: this is the AI-infrastructure short-covering squeeze — same as BE, DELL, NBIS, INTC — not a change in the capex story.',
    lead: { rank: 1, status: 'wait', entry: 'fade $74–78 on a rejection', stop: '$81', targets: '$49.4 → $40', downside: '−35%', tail: '−47%', rr: '~5:1', edge: '❗ The trigger has arrived, and how it arrived is the argument for it: CRWV $74.47 (+22.43% at 2:06 ET) is at the top of the named $65–74 fade zone — and it got there AFTER its binary resolved RED (META gapped −8.33% to $536.85) and rallied 22% regardless; OBV still −129M barely off its worst, RSI 70.66, Stoch 95.40, MACD only just positive (0.68) with the histogram reddening — bad news + 22% + no accumulation is the shape of a failed bounce; the zone moves up to price: $74–78, under the tight 1H upper band $76.48 / 1H 200-EMA $77.78 confluence with the $81 stop just ~9% up, so risk is defined and small — but it needs a REJECTION (1H close back under the 9-EMA $71.31 confirms), not a short into a vertical candle, so status stays WAIT; targets unchanged 🎯 $49.4 → 🕳️ $40 via the mid-band $65.57 and the broken $59.6 low, a reclaim of $81 repairs and $88 makes it wrong' },
    side: 'short', accent: 'cyan',
    date: '2026-07-30',
    story: 'stories/crwv.html',
  },
  {
    symbol: 'LITE', exchange: 'NASDAQ',
    price: '$683.17', change: '⛔ 2:26 ET +13.42% (+$80.82) · STOP $665 BLOWN — the squeeze’s first outright loss · back ABOVE the broken 200-day ≈$610',
    signal: '⛔ Stopped out — the squeeze’s first outright loss, and the lesson is position age. LITE is $683.17 (+13.42%, +$80.82 at 2:26 ET): the move went through the $640–660 add zone AND the $665 stop in one leg, and price is back ABOVE the broken daily 200-EMA ≈ $610 — the very trigger that filled this short yesterday is negated. Realized: ≈ −9% at the $665 stop. Why this one lost while MU/SNDK/IREN kept partial gains: those shorts were weeks old with 18–34% of cushion; this one was filled YESTERDAY at the freshest break on the board, so the cohort squeeze hit it with zero buffer. Newest entry, first casualty — worth writing on the wall. Where it stands now: above the 1H upper band $681.77 and pressing the 1H 50-EMA $687.01, with the old full-repair zone ≈ $721–732 above that and the 1H 200-EMA $751.01 beyond. Momentum is with the squeeze (RSI 62.62, MACD line crossing positive, Stoch 92.63, OBV rising) — and none of it matters for THIS trade, because there is no trade: do not revenge-short the stop-out. The weekly parabola-unwind thesis is unchanged, but the setup has to be rebuilt from scratch — the only re-arm is a fresh daily CLOSE back under $610, and until that prints the $500 → $419 map is dormant. A close over ≈ $732 would repair the daily structure outright. Peer note: COHR made the same 200-day break and still carries 7/29 data — treat it as stale and exposed to exactly this squeeze, not as unaffected.',
    lead: { rank: 3, status: 'live', entry: 'break <$610 filled', stop: '⛔ $665 HIT', targets: '$500 → $419', downside: '−18%', tail: '−31%', rr: '~2.5:1', edge: '⛔ STOPPED OUT — the squeeze’s first outright loss (realized ≈ −9% at $665), and the lesson is position age: this short was filled YESTERDAY at the freshest break on the board, so the cohort squeeze hit it with zero cushion while the weeks-old shorts kept partial gains; LITE $683.17 (+13.42% at 2:26 ET) went through the $640–660 add zone and the $665 stop in one leg and is back ABOVE the broken 200-day ≈$610 — the trigger negated — now above the 1H upper band $681.77 pressing the 1H 50-EMA $687.01, with ≈$721–732 (old full-repair zone) and the 1H 200-EMA $751.01 above; NO trade: do not revenge-short — the only re-arm is a fresh daily CLOSE back under $610 (until then the $500 → $419 map is dormant), and a close over ≈$732 repairs the daily outright; peer COHR made the same break and is still on 7/29 data — stale, not unaffected' },
    side: 'short',
    date: '2026-07-30',
    story: 'stories/lite.html',
  },
  {
    symbol: 'NVDA', exchange: 'NASDAQ',
    price: '$193.44', change: '2:26 ET +1.81% (+$3.43) · pinned ON the $194 flip line · ❗ the CONTROL GROUP — the leader is NOT squeezing',
    signal: '❗ The most informative chart of the day — because it is NOT moving. NVDA is $193.44 (+1.81%, +$3.43 at 2:26 ET) while the cohort around it does +10% to +27% (MU +17.9%, SNDK +23%, IREN/NBIS +27%, BE +25.6%, CRWV +22%). That spread is the proof of the move’s character: this is short covering in the crowded names, and NVDA — which never got crowded and never crashed — has no fuel. It is the control group. Where it stands: the $189 hold half of yesterday’s tell is IN (T1/the 200-day held, tagged at $183.66 and bought back), but the $194 reclaim half is NOT — price has been pinned ON the $194 flip line all session without closing above it, sitting a hair over VWAP $192.53 and under the mid-band $194.91, with RSI 48.85 dead-neutral, MACD −0.70, OBV 1.24B flat. The leader is undecided while its group squeezes — a caution for the bounce’s durability: covering rallies without the general either broaden (NVDA catches up through $194) or fade. Position: the break <$194 entry is filled and now ≈ flat (+0.3%), with part banked into the T1 $189 tag per the plan. Both of yesterday’s lines stay live and unresolved: a daily CLOSE over $194 completes the undercut-and-reclaim and moves the re-short zone to $197.38–202.64 (1H 50-EMA → upper band $200.22 → 1H 200-EMA) — rejection there is the next short; a daily close back under $189/$183.66 trails to T2 $182 → 🕳️ T3 $174. Only a reclaim of $206 restores the long. 🚦 Group gate: no fresh short while SMH holds $535 — and none is on offer here anyway until one of the two lines resolves.',
    lead: { rank: 8, status: 'live', entry: 'break <$194 filled', stop: '$206', targets: '$189 → $182 → $174', downside: '−6%', tail: '−13%', rr: '~3:1', edge: '❗ The control group — the most informative chart of the day BECAUSE it is not moving: NVDA $193.44 (+1.81% at 2:26 ET) while the cohort does +10–27%, proving the move is short covering in crowded names (NVDA never got crowded — no fuel); the $189 hold half of yesterday’s tell is IN (200-day tagged at $183.66 and bought back) but the $194 reclaim half is NOT — price pinned ON the line all session, RSI 48.85 dead-neutral, MACD −0.70, OBV 1.24B flat, entry ≈ flat (+0.3%) with part banked at the T1 tag; a daily close over $194 completes the reclaim and moves the re-short zone to $197.38–202.64 (rejection there = the next short), a daily close under $189/$183.66 trails to $182 → 🕳️ $174, $206 restores the long — the leader’s indecision while its group squeezes is itself the warning: these rallies either broaden or fade' },
    side: 'short', accent: 'red',
    date: '2026-07-30',
    story: 'stories/nvda.html',
  },
  {
    symbol: 'COHR', exchange: 'NYSE',
    price: '$246.88', change: '⚠️ 2:07 ET +11.19% (+$24.83) · bounced off the T3 door — back AT the broken T2 $247 · the $252–266 re-load zone is NOW in play, 2–8% up',
    signal: '⚠️ The one card of the four where the squeeze delivers price INTO the plan’s own zone instead of voiding it. T3 $215 was never tagged: the $218.01 AH print came within ~1.4% and the card said bank into the tag, don’t press the last target — right call, that WAS the low, and COHR has bounced +13% off it to $246.88 (+11.19%, +$24.83 at 2:07 ET). T1 $265 and T2 $247 stay banked, and the short from $310 still holds ≈ +20% at this price. Where it sits: price has retaken the broken T2 $247 to the cent and is pressing the lower lip of the $252–266 re-load zone (1H 50-EMA → the broken daily 200-EMA $266) — 2–8% up, with the 1H 200-EMA $279.90 (+13%) and the $321 stop (+30%) far overhead. But today’s cohort lesson applies here hardest, because this is the card most tempted to sell: momentum has flipped — RSI 60.11, the MACD line’s FIRST positive cross of the entire slide (signal −1.94), OBV rising 25.7M → 27.1M, Stoch 90.73 pinned. The zone is where a re-short SETS UP, not an order to sell into a squeeze: the add needs a REJECTION inside $252–266 confirmed by a 1H close back under $240 (the 1H 9-EMA), which re-opens the mid-band $230.20 → $218 → 🕳️ T3 $215, still on the map. A daily close over $266 — the broken daily 200-EMA — would be the first structural repair of the whole slide and puts $279.90 → $321 in play; only a reclaim of $321 repairs it fully. Optics context: GLW is +8% inside its own re-short zone at the same hour — the optics complex is squeezing together; read AAOI and LITE as stale, not unaffected.',
    lead: { rank: 10, status: 'live', entry: '$310 filled', stop: '$321', targets: '$265 → $247 → $215', downside: '−14%', tail: '−30%', rr: '~5:1', edge: '⚠️ The one card where the squeeze delivers price INTO the plan’s zone instead of voiding it: T3 $215 was never tagged — the $218.01 AH print (within ~1.4%) WAS the low, the "bank into the tag" call exact — and COHR bounced +13% off it to $246.88 (+11.19% at 2:07 ET), retaking broken T2 $247 to the cent at the lower lip of the $252–266 re-load zone (1H 50-EMA → broken daily 200-EMA $266), 2–8% up, short from $310 still ≈ +20% in hand; momentum flipped (first positive MACD cross of the slide over −1.94, OBV 25.7M → 27.1M, RSI 60.11, Stoch 90.73) so the zone is where a re-short SETS UP, not an order to sell: add ONLY on a rejection inside $252–266 + a 1H close back under $240 (1H 9-EMA) → re-opens $230.20 → $218 → 🕳️ $215; a daily close over $266 is the slide’s first structural repair → $279.90 → $321, and only reclaiming $321 repairs it fully' },
    side: 'short', accent: 'violet',
    date: '2026-07-30',
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
    price: '$51.55', change: '❗ 2:10 ET +14.93% (+$6.69) · the $46.3–48.5 bounce lid is VOID · broken cluster RECLAIMED · OBV jumped to 84.3M',
    signal: '❗ Yesterday’s "major failure" has been taken back — and the basket’s OBV is the cleanest accumulation signal on the board. DRAM is $51.55 (+14.93%, +$6.69 at 2:10 ET). This is a basket, so it moves mechanically: ~75% is Micron, Samsung and SK Hynix, and with MU +17.88% the ETF has no choice. But look at what it undid. The card called a close under $47 a major failure and mapped $42–44 → the washout $38.5–40; price is now back ABOVE the broken $47.5–48.5 cluster, so the failure is reversed and the $46.3–48.5 bounce lid — the named re-short — is BELOW price and void. Where it stands: right at the 30-min 200-EMA ≈ $52.60, under the upper band $53.95, with the mid-band $47.86 beneath and the $61 regime line still ~18% above. So $52.60–53.95 is the decision band. The tell that separates this from INTC: OBV jumped to 84.3M and is rising hard — real accumulation into the basket, not just absent supply. That makes DRAM one of the better-supported moves in the cohort, even though the MACD histogram has started to redden and Stoch 95.20 is pinned. Stance: no fresh short until a REJECTION in $52.60–53.95, confirmed by a 30-min close back under the mid-band $47.86 — that would re-arm toward $45 → $42–44. Structurally the bear case is intact but only above the tactical noise: nothing turns neutral until $61 is reclaimed, and overnight Korea-gap risk stands both ways since Samsung and SK Hynix set the open.',
    edge: '❗ Yesterday’s "major failure" taken back, with the board’s cleanest accumulation signal: DRAM $51.55 (+14.93% at 2:10 ET) — a basket that is ~75% Micron/Samsung/SK Hynix, so MU +17.88% drags it mechanically; price is back ABOVE the broken $47.5–48.5 cluster (failure reversed) and the named $46.3–48.5 bounce lid is BELOW price and VOID; it sits at the 30-min 200-EMA ≈$52.60 under the upper band $53.95, mid-band $47.86 beneath, the $61 regime line ~18% up; the discriminator: OBV jumped to 84.3M and is rising hard — real accumulation, unlike INTC’s stuck −590M — though the MACD histogram is reddening and Stoch 95.20 pinned; no fresh short until a REJECTION in $52.60–53.95 confirmed by a 30-min close under $47.86, which re-arms $45 → $42–44; nothing turns neutral until $61, and Korea-gap risk cuts both ways overnight',
    side: 'short', accent: 'indigo',
    date: '2026-07-30',
    story: 'stories/dram.html',
  },
  {
    symbol: 'AAOI', exchange: 'NASDAQ',
    price: '$88.92', change: '⚠️ 2:36 ET +16.20% (+$12.40) · the reflex bounce ARRIVED — at the top of the $80–90 add zone · OBV still NEGATIVE −6.85M · short from $113 still ≈ +21%',
    signal: '⚠️ The reflex bounce the card ordered up ARRIVED — right into the add zone, and the volume still votes short. Yesterday’s line was "extremely oversold on every frame, a reflex bounce is due — add the bounce, don’t chase $75." Today: AAOI is $88.92 (+16.20%, +$12.40 at 2:36 ET), inside the $80–90 add zone at its very top — pressing the banked T1 $90 with the 1H upper band $92.12 just above. The short from the $113 re-arm still holds ≈ +21% here (was ≈ +32% at yesterday’s close); T1 $90 + T2 $82 stand banked. The tell that separates AAOI from the cohort’s dangerous bounces: 1H OBV is STILL NEGATIVE at −6.85M, barely moved from −7.12M — the heaviest-bleed name on the board is bouncing on short covering, not accumulation (the INTC tell), while GLW next door surges 149M → 157M. Near-term momentum did flip (RSI 61.16 from 25, the MACD line’s first positive cross of the slide over its −0.52 signal, Stoch 92.91 pinned), so take the add with discipline, not market orders: a REJECTION in $90–92 (zone top / banked T1 / upper band) confirmed by a 1H close back under the 9-EMA ≈ $86.6 starts it, and a 1H close under $82/$81.42 (broken T2 + mid-band) is the full re-arm → the $74.66 AH low → 🕳️ T3 $58 (weekly 21-MA). A 1H close over $92.12 extends the squeeze toward the 1H 200-EMA $101.58 (+14%) — the first structural repair line; only a reclaim of $120 ends the plan. Optics squeezes together: COHR +11% and GLW +8% hit their own zones the same hour.',
    lead: { rank: 4, status: 'live', entry: '$113 filled', stop: '$120', targets: '$90 → $82 → $58', downside: '−16%', tail: '−41%', rr: '~4:1', edge: '⚠️ The reflex bounce the card ordered up ARRIVED — into the add zone, with volume still voting short: AAOI $88.92 (+16.20% at 2:36 ET) sits at the very top of the $80–90 add zone, pressing banked T1 $90 with the upper band $92.12 above, short from $113 still ≈ +21%; the tell — 1H OBV STILL NEGATIVE −6.85M, barely moved from −7.12M: covering, not accumulation (the INTC tell), unlike GLW’s 149M → 157M surge — though near-term momentum flipped (first positive MACD cross over −0.52, RSI 61.16, Stoch 92.91), so add on a REJECTION in $90–92 + a 1H close under the 9-EMA ≈ $86.6, full re-arm on a 1H close under $82/$81.42 → $74.66 → 🕳️ T3 $58; a 1H close over $92.12 extends to the 1H 200-EMA $101.58, only a reclaim of $120 ends the plan' },
    side: 'short', accent: 'violet',
    date: '2026-07-30',
    story: 'stories/aaoi.html',
  },
  {
    symbol: 'WDC', exchange: 'NASDAQ',
    price: '$526.51', change: '✅ 2:06 ET +13.95% (+$64.47) · reclaimed $513 AND $525 — two of the three re-negate lines · 1H 200-EMA $513.86 underfoot · $535 the last line, ~1.6% up',
    signal: '✅ The storage squeeze reached the stale card — and fired two of its three re-negate lines. The card’s own ladder was "a reclaim of $513 → $525 → $535 re-negates": WDC is $526.51 (+13.95%, +$64.47 at 2:06 ET), through $513 AND $525 in one impulse that also reclaimed the 1H 200-EMA $513.86 — the STX card told you to read WDC as stale, not unaffected, and this is the catch-up (SNDK +23%, MU +18%, STX +11%, now WDC +14%). The banked ladder stands as history, ≈ +11% from $513 — and the magnet call was exact: "bank into $455–461, don’t press the low" — the $454.16 AH print WAS the low. Anything still held from $513 is now −2.6% underwater; the banked ladder was the trade. Momentum is the same cohort regime change, real but stretched: RSI 64.50, MACD firmly positive above its 8.39 signal, OBV positive and ticking up to 148M, Stoch 83.26 easing off ~90. The decision is the last line: $535 — the old stop, 1.6% up. A daily close over it completes the re-negation and restores the long (this was always a deep pullback in an intact weekly uptrend, weekly 50-EMA $339 far below — the same family as DELL and STX) toward the 1H upper band $544.50 → the pre-slide $560–585 July shelf. A 1H close back under $513.86 fails the reclaim and re-opens $489.72 (1H 50-EMA) → $475 → the $455 magnet. No fresh trade either way at +14% with Stoch 83: the long, if it comes, is a pullback that HOLDS $513–514, stop under $489.72, confirmed by the $535 close.',
    lead: { rank: 11, status: 'booked', entry: '$513 filled', stop: '$535', targets: '$486 → $475 → $455', downside: '−5%', tail: '−11%', rr: '~2.5:1', edge: '✅ The storage squeeze reached the stale card and fired two of its three re-negate lines: the card said "a reclaim of $513 → $525 → $535 re-negates" and WDC is $526.51 (+13.95% at 2:06 ET) — through $513 AND $525 with the 1H 200-EMA $513.86 reclaimed in the same impulse; the banked ladder ≈ +11% from $513 stands as history and the magnet call was exact (AH $454.16 WAS the low), while RSI 64.50, MACD over its 8.39 signal, OBV 148M ticking up and Stoch 83.26 make it the cohort’s regime change, stretched; the decision is the last line $535 (~1.6% up): a daily close over it completes re-negation and restores the long — deep pullback in an intact weekly uptrend (50-week $339), same family as DELL/STX — toward $544.50 → the $560–585 pre-slide shelf; a 1H close back under $513.86 fails the reclaim → $489.72 → $475 → $455; no chase at +14% — the long is a pullback holding $513–514' },
    side: 'short',
    date: '2026-07-30',
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$92.21', change: '⚠️ 1:56 ET +12.62% (+$10.33) · RECLAIMED $92 — the card’s own “stalls it” line · but OBV is STILL −590M, the worst on the board',
    signal: '⚠️ Stalled by its own rule — but this is the purest short-covering print of the whole cohort. The card set two lines: "a reclaim over $92 stalls it, $98–102 negates." INTC is $92.21 (+12.62%, +$10.33 at 1:56 ET), so $92 is reclaimed: the fade is STALLED, not negated. The $86–89 re-short zone the card named is now BELOW price and void, and the whole $89–92 gate has been taken back. Where it stands: above the 1H 50-EMA $87.72 and mid-band $85.11, with the 1H 200-EMA $96.38 overhead — and since the negation band is $98–102, that makes $96.38–102 effectively one decision band ~4–11% up. Now the part that matters and separates INTC from the rest: OBV is STILL −590M. Every other name in this squeeze showed OBV improving with price (MU 235M rising, SMH 57.2M → 61.3M, NBIS −32.7M → −21.3M). INTC’s has not moved off the worst reading on the board. Combined with the MACD line only just positive (0.33) with its histogram already turning red, and Stoch 92.46 at an extreme, this is short covering with no accumulation underneath it at all. So: do NOT flip this long — there is no demand in the data, only absent supply. And do not press the short here either; the honest state is stand aside. A re-short needs a REJECTION in the $96.38–102 band, and the trade only comes back to life on a 1H close back under $89 (the retaken gate), which would re-open $85 → the T1 daily 200-EMA ≈ $75 → the 🕳️ $66 gap — all of which now need a fresh leg. A daily close above $102 ends the short case outright. Off the ranked board.',
    edge: '⚠️ Stalled by its own rule and the purest short-covering print of the cohort: the card said "a reclaim over $92 stalls it, $98–102 negates" and INTC is $92.21 (+12.62% at 1:56 ET) — $92 reclaimed, the $86–89 re-short zone void below price, the whole $89–92 gate taken back, price above the 1H 50-EMA $87.72 with $96.38 (1H 200-EMA) → $98–102 now one decision band 4–11% up; but OBV is STILL −590M, unmoved and the worst on the board, while every peer improved with price (MU 235M rising, SMH 57.2M → 61.3M, NBIS −32.7M → −21.3M) — with MACD only just positive (0.33), its histogram already reddening and Stoch 92.46 extreme, this is covering with NO accumulation under it: do not flip it long, do not press the short — stand aside; a re-short needs a rejection in $96.38–102 confirmed by a 1H close back under $89, re-opening $85 → T1 ≈$75 → 🕳️ $66, and a daily close over $102 ends it',
    side: 'short', accent: 'blue',
    date: '2026-07-30',
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$871.14', change: '❗ 1:28 ET +17.88% (+$132.14) · INSIDE the $868–886 last-defence zone · 1H MACD crossed POSITIVE · the $886–890 short-off line is ~2% away',
    signal: '❗ Bank it — the short’s remaining edge is now smaller than the risk to its own invalidation. MU is $871.14 (+17.88%, +$132.14 at 1:28 ET), which puts price INSIDE the $868–886 last-defence zone this card named, above the 1H upper Bollinger $868.91, with the 1H 200-EMA $890.28 directly overhead — so $886–890, the line the plan itself calls the end of the short, sits ~2% away while the position is only ≈ +3.7% from the $905 entry (it was +18% yesterday, +7.6% at 10:00, +5.5% at 12:41). That is the whole decision: ~2% of invalidation risk against a shrinking edge, with the $1,005 stop 15% away — take the win rather than let the $886–890 close take it for you. The momentum has changed regime, not just direction: the 1H MACD line crossed POSITIVE (10.90, signal −7.12, histogram +18.02) for the first time in the entire slide, OBV is 235M and rising, and price holds above session VWAP $846.17 and above BOTH the 1H 9-EMA $820.33 and 50-EMA $816.71 — the zone is being consumed, not defended. The rejection this plan required has now failed to arrive three checks running, and Stoch 93.56/94.48 is the only bear argument left, which is exhaustion rather than structure. What would still re-arm a short: a 1H close back under $853, the reclaimed lid — that is the first evidence the reclaim failed. What ends it outright: a close over $886–890. Targets below ($714 → $665 → 🕳️ $505) need both a new leg and a group that turns down with it, and 🚦 the barometer is still Repairing with SMH holding $535 — so there is no fresh short here in any case.',
    lead: { rank: 2, status: 'live', entry: '$905 filled', stop: '$1,005', targets: '$800 → $714 → $665 → $505', downside: '−11%', tail: '−44%', rr: '~4:1', edge: '❗ Bank it — the remaining edge is now smaller than the risk to the plan’s own invalidation: MU $871.14 (+17.88% at 1:28 ET) is INSIDE the $868–886 last-defence zone, above the 1H upper band $868.91 with the 1H 200-EMA $890.28 overhead, so the $886–890 short-off line is ~2% away while the position is only ≈ +3.7% from $905 (was +18% yesterday, +5.5% at 12:41); the 1H MACD line crossed POSITIVE (10.90, histogram +18.02) for the first time in the slide, OBV 235M rising, price over VWAP $846.17 and both the $820/$817 EMAs — the zone is being consumed, not defended, and the rejection the plan needs has failed to arrive three checks running (only Stoch 94 argues, which is exhaustion not structure); a 1H close back under $853 is the sole re-arm, a close over $886–890 ends it, and 🚦 with the barometer Repairing above $535 there is no fresh short here anyway' },
    side: 'short', accent: 'cyan',
    date: '2026-07-30',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$361.91', change: '🚨 2:08 ET +13.31% (+$42.50) · THROUGH the $358 stop — short STOPPED ≈ −3.5% · back AT the $362.95 earnings-pop high · 1H 200-EMA $349.60 reclaimed',
    signal: '🚨 STOPPED — the pop got rebuilt, and a pop that gets rebuilt the next day is accumulation, not distribution. The re-arm thesis was "the earnings pop faded"; today the market took the other side: TER is $361.91 (+13.31%, +$42.50 at 2:08 ET), THROUGH the $358 stop and back at the $362.95 earnings-pop high the fade was built around. No target on the re-armed leg was ever reached (T1 $308 was never tagged — the close only got to $319.41), so the stop did its job: ≈ −3.5% from $346 and out. The formal negation — a daily close over $358 — is 1% below price with two hours left; anyone running the plan’s stop is already out intraday. Structure flipped with the print: the 1H 200-EMA $349.60 and 50-EMA $341.00 are underfoot, price rides the upper band $366.51, RSI 65.14, the MACD line positive above its 2.75 signal, OBV rising to 40.4M, Stoch 93.28 pinned. Forward map — a long-watch now, same family as STX: the decision line is the $362.95 spike high, a daily close through it opens $366.51 → the ≈ $375 July shelf; the disciplined entry is a pullback that HOLDS $352–358 (the reclaimed stop line, with the 1H 200-EMA $349.60 just beneath), stop under $341. A 1H close back under $349.60 voids the reclaim and re-opens the old fade map ($337 → $326 → $308) — as a fresh setup, not this plan. Weekly was always an uptrend; the deep leg resolved up. Off the ranked board.',
    edge: '🚨 STOPPED — the pop got rebuilt, and a rebuilt pop is accumulation, not distribution: TER $361.91 (+13.31% at 2:08 ET) is THROUGH the $358 stop and back at the $362.95 earnings-pop high, no target on the re-armed leg ever reached (T1 $308 untouched, the close only saw $319.41) — the stop did its job, ≈ −3.5% from $346, formal negation (a daily close over $358) printing 1% below price; structure flipped underfoot (1H 200-EMA $349.60 + 50-EMA $341.00 reclaimed, upper band $366.51, RSI 65.14, MACD over its 2.75 signal, OBV 40.4M rising, Stoch 93.28) — now a long-watch, same family as STX: a daily close over $362.95 opens $366.51 → ≈$375, entry only on a pullback HOLDING $352–358 with a stop under $341; a 1H close back under $349.60 re-opens the fade map ($337 → $326 → $308) as a fresh setup, not this plan',
    side: 'long', accent: 'blue',
    date: '2026-07-30',
    story: 'stories/ter.html',
  },
  {
    symbol: 'GLW', exchange: 'NYSE',
    price: '$133.96', change: '⚠️ 2:09 ET +7.99% (+$9.91) · the dead-cat REACHED the zone — price is INSIDE $128–137 · OBV surged 149M → 157M, the strongest build in the cohort',
    signal: '⚠️ The re-short location arrived — but the volume says do not touch it without the rejection. Yesterday’s tell was "a bounce too weak to reach its own resistance zone"; today killed that tell: GLW is $133.96 (+7.99%, +$9.91 at 2:09 ET), INSIDE the $128–137 re-short band the card kept as its only working line, +16% off the ≈ $115 washout low (the daily 200-EMA that caught the collapse). The trade itself stays complete — all three targets ($151 → $144 → $130) banked ~+21% from the ~$160 rejection — so everything here is about the NEXT trade. And the tape argues both ways at once. Location: textbook — former support turned lid, the 1H 50-EMA ≈ $130 sitting inside the zone, the $137 zone top and then $144 / the 1H 200-EMA $150.29 overhead. Volume: the OTHER way — OBV JUMPED 149M → 157M, the strongest one-day build in the whole squeeze cohort, with the MACD line positive over its 0.62 signal, RSI 63.70 and Stoch 94.89 pinned. Day three after an earnings detonation, squeezing on rising volume, is not a print to guess a top on. The re-short needs a REJECTION inside $128–137 confirmed by a 1H close back under the mid-band ≈ $127 — that re-opens $121.86 (yesterday’s AH low) → ≈ $115. A daily close over $137 says the $115 washout was THE low and starts the repair toward $144 → $150.29. Optics cohort: COHR is +11% pressing its own zone at the same hour — the complex squeezes together.',
    lead: { rank: 14, status: 'booked', entry: '$160 filled', stop: '$184', targets: '$151 → $144 → $130', downside: '−9%', tail: '−14%', rr: '~3:1', edge: '⚠️ The re-short location arrived — but volume says wait for the rejection: GLW $133.96 (+7.99% at 2:09 ET) is INSIDE the $128–137 band the card kept as its only working line, +16% off the ≈$115 washout (daily 200-EMA), all three targets banked ~+21% from ~$160 so this is only about the next trade; location is textbook (former support, 1H 50-EMA ≈$130 in-zone, $137 → $144 → 1H 200-EMA $150.29 overhead) but OBV surged 149M → 157M — the strongest one-day build in the cohort — with MACD positive over 0.62, RSI 63.70, Stoch 94.89: day-3 post-earnings squeeze on rising volume is no place to guess a top; re-short ONLY on a rejection inside $128–137 + a 1H close under the ≈$127 mid-band → $121.86 → ≈$115, while a daily close over $137 says $115 was THE low → repair to $144 → $150.29' },
    side: 'short', accent: 'blue',
    date: '2026-07-30',
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
    price: '$846.45', change: '✅ 1:17 ET +10.73% (+$82.02) · RECLAIMED $835 — the card’s own “short off” line · spike to ≈$895 rejected back under the daily 200-EMA $864',
    signal: '✅ SHORT OFF — the card’s own invalidation fired. The plan said it in one line: "a reclaim of $835 ends the short case for good." STX is $846.45 (+10.73%, +$82.02 at 1:17 ET) — $835 is reclaimed, the $786–830 squeeze zone that rejected every lift is gone, and the 1H 200-EMA $841.57 is back underfoot. So this is the one card on the board where the third beat of the week did NOT fade: TER gave it all back, BE gave it all back, STX did not. The short is closed, not "re-arming". What actually happened intraday matters as much: the spike ran to ≈$895 — clean THROUGH the daily 200-EMA $864 — and was rejected straight back under it, leaving price ~5% off the high. That makes $864 the level that now decides whether this is a trend or a one-day squeeze: a close above it and the daily frame repairs; failure there keeps this a spike in a downtrend that simply overshot. Momentum reads the same way — RSI 60.99 and the MACD line POSITIVE for the first time in the slide (7.67), but the histogram is already fading and Stoch 73.52 is rolling over from higher: real reclaim, decelerating at the highs. So the actionable setup is a LONG, and it is not here: wait for a pullback that HOLDS $835–841 (the reclaimed line plus the 1H 200-EMA, one zone), stop under the 1H 50-EMA $801.08, and treat a close over $864 as the continuation trigger toward the ≈$895 spike high — above that the map is unwritten and needs the weekly frame. Invalidation is symmetrical and clean: a 1H close back under $835 puts price under the line it just reclaimed, and the old short map re-opens ($801 → $788 → $770 → 🕳️ the $700 weekly 21-MA). Group context: this is the memory AND storage complex squeezing together — MU +15.68%, SNDK +23.01%, STX +10.73% — so read the storage peer WDC as stale, not unaffected; it still carries 7/29 close data.',
    edge: '✅ SHORT OFF — the card’s own line fired: it said "a reclaim of $835 ends the short case for good" and STX is $846.45 (+10.73% at 1:17 ET), $835 reclaimed, the $786–830 rejection zone gone, the 1H 200-EMA $841.57 back underfoot — the one beat of the week that did NOT fade (TER and BE both gave it all back); but the spike to ≈$895 went clean through the daily 200-EMA $864 and was rejected back under it (~5% off the high), so $864 now decides trend vs one-day squeeze — RSI 60.99 with the MACD line positive for the first time (7.67) yet the histogram fading and Stoch 73.52 rolling: real reclaim, decelerating; the setup is a LONG and NOT here — wait for a pullback holding $835–841, stop under the 1H 50-EMA $801.08, a close over $864 the continuation trigger toward ≈$895 (unmapped above); a 1H close back under $835 re-opens the whole old short map ($801 → $788 → $770 → 🕳️ $700). Storage + memory are squeezing together, so peer WDC is stale, not unaffected',
    side: 'long', accent: 'amber',
    date: '2026-07-30',
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
    price: '$189.12', change: '❗ 1:52 ET +27.59% (+$40.90) · reclaimed the 30-min 200-EMA $180.01 · back ABOVE T1 $160 and T2 $147 · ⚠️ but momentum is DECELERATING',
    signal: '❗ +26% has become +5.4% — and this is the first name in the cohort showing deceleration. NBIS is $189.12 (+27.59%, +$40.90 at 1:52 ET) after the $147.06 print was the low. T1 $160 and T2 $147 were realised on the way down and that history stands, but price is back ABOVE both, the $155–174 add zone is 13–18% below and void, and the position is ≈ +5.4% from the $200 entry — down from ≈ +26%. Structurally the squeeze is real: it reclaimed the 30-min 200-EMA $180.01, with overhead now the ≈$196 spike high, then the $200 entry itself (~6% up) and the $213 stop (~13% up). But NBIS is the ONE name today where the tape is losing steam rather than pressing: the MACD line is positive (7.50) yet its histogram has turned RED, Stoch 83.06 is rolling over from ~90, and OBV is still NEGATIVE at −21.3M — improved from −32.7M, but improved-and-negative is short covering paying for itself, not accumulation. That combination is the first credible fade candidate on this board. Stance: bank/trail what is left rather than defend it — a +5.4% edge does not justify sitting under a $200 entry that is 6% away. A re-short needs an actual REJECTION, and the levels to watch for it are the ≈$196 spike high and the $200 entry, confirmed by a 30-min close back under the 200-EMA $180.01, which would re-open $169.62 (50-EMA) → the old T1 $160. Hold above $180.01 and the squeeze keeps running at the entry instead. Only a 2nd close over $213 formally ends the plan. 🚦 Cohort: this is the AI-infrastructure squeeze (memory, storage, AI-cloud, power, servers), not a semis move — but NBIS is where it is cracking first.',
    lead: { rank: 7, status: 'live', entry: '$200 filled', stop: '$213', targets: '$160 → $147 → $130', downside: '−15%', tail: '−31%', rr: '~3:1', edge: '❗ +26% has become +5.4%, and NBIS is the first name in the cohort DECELERATING: $189.12 (+27.59% at 1:52 ET) after $147.06 was the low — T1 $160 and T2 $147 realised on the way down but price is back above both, the $155–174 add zone void 13–18% below, and it has reclaimed the 30-min 200-EMA $180.01 with the ≈$196 spike high, the $200 entry (~6% up) and the $213 stop (~13% up) overhead; the tell is that the MACD histogram has turned RED with the line still positive (7.50), Stoch 83.06 rolling from ~90, and OBV still NEGATIVE at −21.3M (improved from −32.7M — covering paying for itself, not accumulation): the first credible fade candidate on the board — bank/trail rather than defend a +5.4% edge under a 6%-away entry; a re-short needs a REJECTION at ≈$196/$200 confirmed by a 30-min close back under $180.01, which re-opens $169.62 → $160' },
    side: 'short', accent: 'indigo',
    date: '2026-07-30',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$496.71', change: '✅ 2:36 ET +13.81% (+$60.26) · the FAST RECLAIM of $455–466 fired — the washout-low test the card set · $492 also retaken · the $513–530 negation band 3–7% up',
    signal: '✅ The card’s own test fired — fast reclaim = washout low. Yesterday’s verdict was explicit: cutting the weekly 50-EMA zone $455–466 was the first real weekly-frame damage, and "a fast reclaim of $455–466 — especially if SMH’s fib-tag bounce plays out — would mark a washout low." Both halves happened inside one session: SMH’s bounce held, and AMAT is $496.71 (+13.81%, +$60.26 at 2:36 ET) — back through $455–466, through the $464–476 re-short zone (void, 4–7% below), and through $492, the SECOND rung of the repair ladder, holding ~1% above it. The washout-low read is confirmed by the card’s own criterion — and note what it means for the group: this is semicap proper joining the squeeze, not AI-infra periphery (TER, the other equipment-complex name, took out its short stop the same hour). What is left of the bear case is one band: $513–530, the card’s own negation line — starting at the 1H upper Bollinger $513.03 (+3.3%) with the 1H 200-EMA $526.54 inside it (+6%). Momentum is strong but decelerating at the extreme: RSI 62.67, the MACD line positive over its 2.77 signal with the histogram already fading, OBV jumped to 83.9M on the squeeze, Stoch 85.71 off ~93. Nothing fresh at +14%: a fade needs a REJECTION in $513–530 confirmed by a 1H close back under $492, which re-opens $481.63 (1H 9-EMA) → $464–476 → $455–466. A daily close over $530 negates the correction outright — the weekly-damage thesis dies and the map opens to the $550–575 pre-collapse shelf. Stays off the ranked board.',
    edge: '✅ The card’s own test fired — fast reclaim = washout low: it wrote "a fast reclaim of $455–466 (especially if SMH’s fib-tag bounce plays out) marks a washout low," and AMAT is $496.71 (+13.81% at 2:36 ET) — back through $455–466, through the void $464–476 re-short zone and through $492, the second repair rung, semicap proper joining the squeeze (TER stopped its short the same hour); the bear case is down to one band, $513–530 — the card’s own negation line, 1H upper BB $513.03 (+3.3%) → 1H 200-EMA $526.54 (+6%) — with momentum strong but decelerating (RSI 62.67, MACD over its 2.77 signal with the histogram fading, OBV 83.9M, Stoch 85.71 off ~93): no chase at +14% — a fade needs a REJECTION in $513–530 + a 1H close back under $492 (→ $481.63 → $464–476 → $455–466), while a daily close over $530 negates the correction outright → the $550–575 pre-collapse shelf (off the board)',
    side: 'short', accent: 'red',
    date: '2026-07-30',
    story: 'stories/amat.html',
  },
  {
    symbol: 'BE', exchange: 'NYSE',
    price: '$205.62', change: '❗ 1:49 ET +25.57% (+$41.87) · AT the 1H 200-EMA $205.49 / VWAP $205.64 confluence · the $168–180 continuation re-short is VOID',
    signal: '❗ The continuation setup is VOID — and the squeeze is not memory or storage, which is the real news. BE is $205.62 (+25.57%, +$41.87 at 1:49 ET): price is back ABOVE all three banked targets ($200 → $185 → $170) and 13–18% above the $168–180 failed-bounce zone this card named as the re-short. That trade never triggered and is now off the map. The realized win stands as history — ≈ +26% from $219–234 down to T3 $170 was taken on the way down — but nothing about it is actionable now. Where price actually is matters: $205.62 sits exactly on a tight confluence of the 1H 200-EMA $205.49 and session VWAP $205.64, the first tag of that 200-EMA since the slide began, after a spike to ≈$212–213 (the 1H upper band is $212.38) was rejected back into it. So this level is the decision: reject here and the fade can resume toward the 1H 9-EMA $195.36 → 50-EMA $182.71; close above it and then above ≈$213 and the ONLY zone where a re-short makes sense again is the original distribution shelf $219–234 (7–14% up), with the untouched $250 stop 21% above. Momentum has flipped with the price: RSI 66.40, the MACD line positive at 3.49, OBV 257M rising, Stoch 83.98 — the same regime change the memory names printed. ⚠️ Cohort correction: BE is fuel cells and power, not memory or storage. Together with STX (+10.7%) and IREN (+27.3%) that makes this a squeeze across the whole beaten-down AI-infrastructure cohort — memory, storage, AI-cloud and power — rather than a semis move, which is exactly why SMH can sit flat while these run. Read CRWV, NBIS, AAOI, LITE, COHR and ASTS as stale, not unaffected.',
    lead: { rank: 15, status: 'booked', entry: '$219–234 filled', stop: '$250', targets: '$200 → $185 → $170', downside: '−10%', tail: '−17%', rr: '~3:1', edge: '❗ Continuation VOID — BE $205.62 (+25.57% at 1:49 ET) is back ABOVE all three banked targets and 13–18% above the $168–180 failed-bounce re-short, which never triggered; the ≈ +26% from $219–234 to T3 $170 stands as realised history, nothing more. Price sits on a tight 1H 200-EMA $205.49 / VWAP $205.64 confluence — its first 200-EMA tag of the slide — after a ≈$212–213 spike was rejected back into it: reject here and the fade resumes toward $195.36 → $182.71, close above it and then ≈$213 and the only re-short left is the original $219–234 shelf (stop $250, 21% up); RSI 66.40, MACD line +3.49, OBV 257M rising. ⚠️ BE is power, not memory — with STX and IREN this is a squeeze across the whole beaten-down AI-infra cohort, not a semis move' },
    side: 'short', accent: 'amber',
    date: '2026-07-30',
    story: 'stories/be.html',
  },
  {
    symbol: 'ALAB', exchange: 'NASDAQ',
    price: '$290.83', change: '✅ 1:59 ET +16.45% (+$41.09) · the $250 base DEFENDED — back ABOVE T2 $280 · OBV positive AND rising · $300–310 the decision band',
    signal: '✅ The base defended — exactly where this card said bulls would, and it is the one bounce in the cohort with volume agreeing. Yesterday the fade tagged 🕳️ T3 — the May base $250 — to the dollar, the full ladder ($300 → $280 → $250) was banked at ≈ +19% from $310, and the card’s read was explicit: the base + weekly 21-MA is major support, bank/trail, don’t press the tag. Today proves it: ALAB is $290.83 (+16.45%, +$41.09 at 1:59 ET) — +16% off the tag in one session. The $255–280 add zone is 4–12% below and VOID, price is back ABOVE the retaken T2 $280, the 1H 50-EMA $270.76 and mid-band $263.22, and the $231 deeper magnet for a trailing runner is dead. The tell that separates ALAB from INTC: OBV is POSITIVE and RISING (57.5M → 60.4M) with the 1H MACD line decisively positive above its signal (3.26) — demand at a major base, not just absent supply like INTC’s unmoved −590M. Overhead the decision is one tight band: banked T1 $300 (broken support turned lid) → the 1H 200-EMA $306.79 (~5.5% up, first tag from below since the slide began) → the $310 entry itself. RSI 70.46 and Stoch 93.51 are pinned, so chase nothing at $291 in either direction. The only re-short is a REJECTION in $300–310 confirmed by a 1H close back under $280 (the retaken T2), which re-opens $270.76 → $263 → the base. A daily close over $310 ends the short case’s echo and puts $362 — the full long-repair line, ~24% up — in play as the squeeze’s target. Off the ranked table (banked in the strip).',
    lead: { rank: 13, status: 'booked', entry: '$310 filled', stop: '$362', targets: '$300 → $280 → $250', downside: '−10%', tail: '−19%', rr: '~3:1', edge: '✅ The base defended — exactly where the card said bulls would, and the one cohort bounce with volume agreeing: yesterday’s tag of 🕳️ T3 $250 (May base) banked the full ladder ≈ +19% from $310, and today ALAB is $290.83 (+16.45% at 1:59 ET), +16% off the tag — the $255–280 add zone void 4–12% below, price back over T2 $280, the 1H 50-EMA $270.76 and mid-band $263.22; OBV POSITIVE and RISING (57.5M → 60.4M) with the MACD line over its signal (3.26) — demand, not INTC-style absent supply — while RSI 70.46 / Stoch 93.51 say chase nothing; decision band $300–310 (✓ T1 → 1H 200-EMA $306.79 → the entry): a rejection there + a 1H close back under $280 is the only re-short, a daily close over $310 puts $362 (full long repair, ~24% up) in play' },
    side: 'short', accent: 'emerald',
    date: '2026-07-30',
    story: 'stories/alab.html',
  },
  {
    symbol: 'CRDO', exchange: 'NASDAQ',
    price: '$196.29', change: '⚠️ 2:40 ET +10.62% (+$18.85) · bounced +14% off the T3 tag — back ABOVE T2 $190 · the $203–210 re-short zone 3–7% up, 1H 200-EMA $212.67 right above it',
    signal: '⚠️ The ladder paid in full — and now the squeeze is delivering the re-load. Yesterday’s AH print $171.58 tagged 🕳️ T3 $175 / the rising daily 200-EMA ≈ $172, the card said bank into the tag and don’t press a rising 200-EMA — and that WAS the low: CRDO has bounced +14% off it to $196.29 (+10.62%, +$18.85 at 2:40 ET), back ABOVE the broken T2 $190 and pressing T1 $200 from below. The full ladder ($200 → $190 → $175) stands banked ≈ +22% from $219–230; the short still holds ≈ +13% at this price. Overhead is one tight structure: T1 $200 → the 1H upper band $202.85 sitting at the lower lip of the $203–210 re-short zone the card kept → the 1H 200-EMA $212.67 right above the zone top, making $210–213 effectively one lid. Momentum flipped like everywhere in the cohort — RSI 59.75, the MACD line’s first positive cross of the slide (signal −0.18), OBV rising to 23.9M, Stoch 89.91 pinned — so the zone is where the re-short SETS UP, not an order to sell into a squeeze: a REJECTION in $203–210 confirmed by a 1H close back under $193 (the 1H 9/50-EMA cluster) starts it, and a 1H close under $190 is the full re-arm → the mid-band $184.25 → $175/$172. A daily close over $213 (zone top + 1H 200-EMA) is the first structural repair toward the $220s; only a reclaim of $242 repairs the long. Comms-silicon comp: ALAB — the closest peer — is squeezing the same way, and with OBV rising there too.',
    lead: { rank: 12, status: 'live', entry: '$219–230 filled', stop: '$242', targets: '$200 → $190 → $175', downside: '−1%', tail: '−15%', rr: '~2.5:1', edge: '⚠️ The ladder paid in full and the squeeze is delivering the re-load: yesterday’s AH $171.58 tagged 🕳️ T3 $175 / daily 200-EMA ≈ $172 and WAS the low (the bank-into-the-tag call exact) — CRDO bounced +14% to $196.29 (+10.62% at 2:40 ET), back over broken T2 $190, pressing T1 $200, full ladder banked ≈ +22% from $219–230 with ≈ +13% still in hand; overhead is one tight lid — T1 $200 → upper band $202.85 at the lip of the $203–210 re-short zone → 1H 200-EMA $212.67 just above it ($210–213 one line); momentum flipped (first positive MACD cross, RSI 59.75, OBV 23.9M rising, Stoch 89.91) so re-short ONLY on a rejection in $203–210 + a 1H close under $193 (9/50-EMA cluster), full re-arm under $190 → $184.25 → $175/$172; a daily close over $213 is the first structural repair → the $220s, only $242 repairs the long' },
    side: 'short', accent: 'cyan',
    date: '2026-07-30',
    story: 'stories/crdo.html',
  },
  {
    symbol: 'DELL', exchange: 'NYSE',
    price: '$406.96', change: '✅ 1:51 ET +10.10% (+$37.32) · RECLAIMED $402 — the card’s own “negates and restores the long” line · testing the 1H 200-EMA ≈$412',
    signal: '✅ SHORT NEGATED, LONG RESTORED — by the card’s own sentence. It read: "a reclaim of $402 → $420 negates and restores the long." DELL is $406.96 (+10.10%, +$37.32 at 1:51 ET), so $402 is reclaimed and the first half of that condition is met: the short is off, T1 $377 stays as realised history and the 🕳️ $330 gap-fill target is off the map. The structure supports it — this was always described here as a deep leg inside a powerful uptrend, with the daily 200-EMA ≈ $250 far below, not a distribution top. Where it stands: price is testing the 1H 200-EMA ≈ $411.84, which capped the spike, with $420 — the full-restore line — just beyond it; below sit the reclaimed $402, the 1H 50-EMA $394.48 and the mid-band $381.93. Momentum confirms: 1H RSI 65.09, the MACD line at −0.17 and about to cross zero, OBV 29.6M rising, Stoch 89.27 the one overbought caveat. So the long is restored but the entry is disciplined, not a chase: buy a pullback that HOLDS $402 (the reclaimed line), stop under the 1H 50-EMA $394.48, and treat a close over $412 → $420 as the confirmation that the bull flag resumed toward the ATH. Invalidation is clean: a close back under $402 puts the whole short map live again ($394 → $377 → $368 → 🕳️ $330). ⚠️ Cohort note: DELL is AI servers — with BE (power), STX (storage) and IREN (AI-cloud) all ripping, this is a squeeze across the entire beaten-down AI-infrastructure cohort, not a memory or semis move, which is why SMH sits flat while these run. Off the ranked board.',
    edge: '✅ SHORT NEGATED, LONG RESTORED by the card’s own line ("a reclaim of $402 → $420 negates and restores the long"): DELL $406.96 (+10.10% at 1:51 ET) has reclaimed $402, so the short is off, T1 $377 is realised history and the 🕳️ $330 gap-fill is off the map — consistent with how this card always read it, a deep leg in a powerful uptrend with the daily 200-EMA ≈$250 far below; price is testing the 1H 200-EMA ≈$411.84 that capped the spike, with $420 (full restore) just beyond and the reclaimed $402 / 1H 50-EMA $394.48 / mid-band $381.93 beneath — RSI 65.09, MACD line −0.17 about to cross, OBV 29.6M rising, only Stoch 89.27 cautions; long on a pullback HOLDING $402, stop under $394.48, a close over $412 → $420 confirms the flag resumed; a close back under $402 re-opens the whole short map ($394 → $377 → $368 → 🕳️ $330). ⚠️ DELL is AI servers — with BE, STX and IREN this is an AI-infrastructure cohort squeeze, not a semis move',
    side: 'long', accent: 'amber',
    date: '2026-07-30',
    story: 'stories/dell.html',
  },
  {
    symbol: 'MRVL', exchange: 'NASDAQ',
    price: '$181.35', change: '✅ 2:11 ET +10.98% (+$17.96) · the starter probe is GREEN · $185 confirmation trigger only ~2% away · the $150–160 core never filled',
    signal: '✅ The one long on this board that is working — and it is 2% from its own confirmation. MRVL is $181.35 (+10.98%, +$17.96 at 2:11 ET) after $160.60 turned out to be the low. Two things follow. The starter probe in $172–178 — the one this card deliberately sized as a probe because conditions were falling-knife — is now GREEN. And the MAIN $150–160 load zone never filled: price bottomed at the very top of it and left, so the "back up the truck" entry never happened and will not unless price returns there. That is the honest scorekeeping: right level, right sizing, smaller position than the plan hoped for. Now the level that matters: this card set the bottom confirmation at "a reclaim of $185 → $198–200", and $185 turns out to sit in a real confluence — the 1H upper Bollinger $185.88 and the 1H 50-EMA $184.65 — about 2% above. So a 1H/daily close over $185–186 confirms the bottom and opens $196.72 (the 1H 200-EMA) → $200, with recovery targets $200 → $220 → $245 beyond. Failure there is equally defined: Stoch 90.67 is extreme and the MACD line is still only at zero (−0.06), so a rejection at $185 sends it back to the 1H 9-EMA $176.85 → mid-band $170.22, where the probe would be tested but the thesis intact. Invalidation unchanged: a weekly close under $146 breaks the multi-year uptrend and takes the long off. Stance: hold the probe, do NOT chase into $185 — add on the reclaim, or on a pullback that holds $176.85. 🚦 Cohort: MRVL is AI interconnect/custom silicon — the same AI-infrastructure squeeze lifting BE, DELL, NBIS, CRWV and ALAB, which is a caution as much as a comfort: a covering-driven bounce can hand the confirmation back. Off the ranked board (a watch).',
    edge: '✅ The one long on the board that is working, 2% from its own confirmation: MRVL $181.35 (+10.98% at 2:11 ET) after $160.60 was the low — the $172–178 starter probe (deliberately probe-sized into a falling knife) is GREEN, while the MAIN $150–160 load NEVER filled (price bottomed at the top of it and left), so this is a right-level, right-sizing, smaller-than-hoped position; the confirmation this card set — "a reclaim of $185 → $198–200" — sits in a real confluence at the 1H upper band $185.88 / 1H 50-EMA $184.65, ~2% up: a close over $185–186 opens the 1H 200-EMA $196.72 → $200, then $220 → $245; but Stoch 90.67 is extreme with the MACD line still at zero (−0.06), so a rejection sends it to the 9-EMA $176.85 → mid-band $170.22 with the thesis intact — hold the probe, do NOT chase, add on the reclaim or a pullback holding $176.85; a weekly close under $146 still takes the long off. 🚦 Same AI-infra covering squeeze as BE/DELL/NBIS/CRWV — a caution as much as a comfort',
    side: 'long', accent: 'blue',
    date: '2026-07-30',
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
