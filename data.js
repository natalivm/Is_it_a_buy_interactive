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
  updated: '2026-07-31',
  markets: [
    {
      symbol: 'QQQ',
      label: 'Nasdaq-100 · QQQ',
      role: 'The index — what the whole tape is doing',
      price: '$680.94 → 🌙 fut +1.6%',
      change: '🌙 futures +1.6% — an open ≈$692, into the ≈$695 trendline · last RTH print $680.94 (+2.90%), holding the reclaimed $678–680 shelf',
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
      note: '🌙 Pre-open 7/31: futures +1.6% put the open ≈$692 — straight into the ≈$695 six-week trendline and the $695–700 daily swing-high gate, the “nothing above it has been tested” line. And it gets there absorbing AAPL −6% (a top weight, ~0.5pp of drag) on MSFT’s AI-capex beat — the strong version of the test. Hold $678–680 on a red-AAPL tape = real acceptance and the daily-close flip condition can fire; lose $678 and the lid is back on, with $675.27 → $665–668 → $661.58 the ladder that must hold. Breadth finally showed up overnight: McClellan crossed positive, 70.5% >200DMA, Market Tide ~$1B bullish — put/call 1.14 the one holdout.',
    },
    {
      symbol: 'SMH',
      label: 'Semis · SMH',
      role: 'The board’s barometer — the group that leads this tape',
      price: '$538.90 → 🌙 $550.15',
      change: '🌙 overnight +2.09% → $550.15 — ON the $547–550 gate · Thu close $538.90 (+6.88%), first pop of the week that did not fade',
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
      note: '🌙 Pre-open 7/31: the gate is trading — overnight $550.15 sits ON $547–550 after Korea reversed hard (SK Hynix +27.8%, Samsung +24.8%) on MSFT’s capex beat. Gaps propose, closes ratify: a daily CLOSE above breaks the group’s daily downtrend (shorts off board-wide, long cycle confirmed); a fade back under $547 traps the chasers; under $535 re-arms shorts. Thursday’s completed bar left fuel — daily Stoch 14.5 off the floor, RSI 42, mid-range — while every 1H in the cohort is pinned: buy held retests, never the open. Gates above by fib+MA confluence: $552 (0.382) → $557–560 → $572–576 (50-day + mid-band, the real fight) → $580 (end of fade-mode) → $594–600 (0.618 + the wall). NVDA already closed over $194 Thursday ($195.04) — the general voted; its $201–204 slab is today’s breadth tell. Tonight is also the weekly close.',
    },
  ],
  vol: [
    {
      symbol: 'VIX', value: '17.47', range: [15, 22], change: '🌙 17.47 (−3.19) · holding under the ≈18 confirm overnight',
      verdict: 'bull',
      read: 'The ≈18 break is HOLDING: 17.47 overnight with MOVE at 74.18 — no panic in equities or rates — and the breadth half of the confirmation finally arrived with it: McClellan crossed positive (+0.10), 70.5% of stocks over their 200DMA, Market Tide ~$995M bullish. The one holdout is put/call at 1.14 — traders hedging hard into the rally, which is a wall of worry (fuel if sellers keep being wrong), not a roof. Watch whether VIX holds under 18 while absorbing AAPL −6% at the open.',
    },
    {
      symbol: 'VXN', value: '28.50', range: [24, 33], change: '−7.59% · off the 31 spike · ≈26 floor intact',
      verdict: 'neutral',
      read: 'Still down hard on the day (−7.59%) and still leading VIX lower in percentage terms — NASDAQ stress unwinding fastest. But note the level, not just the move: 28.50 has ticked UP from the 28.08 morning print and the ≈26 range floor is untouched. Fear is cheaper, not gone.',
    },
  ],
  note: '🌙 Pre-open 7/31: the broadening the board demanded ARRIVED overnight — MSFT AI-capex beat, Korea reversed violently (SK Hynix +27.8%, Samsung +24.8% after a −17% rout), NDX futures +1.6% absorbing AAPL −6%; McClellan crossed positive, VIX 17.47, put/call 1.14 the lone holdout. SMH overnight $550.15 sits ON the $547–550 gate; QQQ opens into the ≈$695 trendline. Gaps propose, closes ratify — and tonight is also the weekly close: no chasing the open, longs only on held retests (each card names its zone), the flips count at 4 PM. Shorts stay available where an individual setup warrants; the old cycle is banked and archived.',
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
    price: '$73.90 → 🌙 $78.25', change: '🌙 overnight +5.89% → $78.25 — the TOP of the old $74–78 fade zone · Thu close $73.90 (+21.51%) · 1H OBV STILL −133M',
    signal: '🔄 NEW CYCLE — the board’s designated SHORT-side candidate under the “keep shorts where a setup warrants one” clause, and the weakest chart of everything reviewed pre-open. The daily: price closed $73.90 BELOW every daily MA (9-day $79.34, 50-day $94.75, 200-day $98.89), daily MACD negative under its signal — and daily OBV fell to NEW LOWS through July: the anti-STX. Where Seagate’s OBV held its highs through the whole correction (accumulation), CoreWeave’s kept bleeding (distribution). The 1H is the INTC profile: RSI 72.9, Stoch 95 pinned, price above the 1H upper band $75.04 — and 1H OBV −133M, WORSE than Wednesday’s −130M. A +21.5% day plus +5.9% overnight and the money-flow line never lifted: covering with zero demand underneath. Location: overnight $78.25 is the top of the old $74–78 fade zone with the daily 9-EMA $79.34 and the $81 line stacked just above — the archived rank-1 trigger, now trading. The honest complication: Wednesday’s thesis leaned on “META red and it rallied anyway”; the backdrop has FLIPPED — MSFT’s capex beat is a direct AI-cloud tailwind — so entry discipline is mandatory, not optional. REJECTION ONLY: a fade from $78–81 confirmed by a 1H close back under $74 (zone bottom + 1H 200-EMA $74.82) — never short the vertical. Stop $84 — a reclaim of $81 already stalls the thesis — and over $88 (daily mid-band $88.26 + the old 4H 200-EMA line) the short is simply wrong. Targets: $70.40 → $65 (mid-band) → $59.6 → $49.4. 🚦 Override: if SMH closes over $547–550 AND CRWV reclaims $81, DROP it — an individual short needs an individual failure, and above $81 there is not one.',
    lead: { rank: 8, status: 'wait', entry: 'fade the rejection in $78–81', stop: '$84 (wrong >$88)', targets: '$70.4 → $65 → $59.6 → $49.4', downside: '−38%', rr: '~7:1', rrStar: true, edge: '🔄 The one short kept on the new board, because the chart earns it: the weakest name reviewed — Thu close $73.90 below EVERY daily MA (9d $79.34 / 50d $94.75 / 200d $98.89) with daily OBV at NEW July lows (distribution, the anti-STX) — yet overnight $78.25 sits at the top of the old $74–78 fade zone with 1H OBV at −133M, WORSE than Wednesday: +21.5% + 5.9% overnight and the money-flow never lifted, covering with zero demand; but MSFT’s capex beat flipped the catalyst wind, so REJECTION ONLY — fade $78–81 confirmed by a 1H close back under $74, stop $84 (thesis stalls over $81), wrong over $88, targets $70.4 → $65 → $59.6 → $49.4; if SMH confirms the gate AND $81 reclaims, drop it' },
    side: 'short', accent: 'cyan',
    date: '2026-07-31',
    story: 'stories/crwv.html',
  },
  {
    symbol: 'LITE', exchange: 'NASDAQ',
    price: '$693.24 → 🌙 $733.79', change: '🌙 overnight +5.85% → $733.79 — pushing THROUGH the old $721–732 full-repair zone, ON the 1H 200-EMA $730.36 · Thu close $693.24 (+15.09%)',
    signal: '🔄 NEW CYCLE — the card that took the old cycle’s one loss is now a mid-rank LONG watch, and no bias either way: the discipline that said don’t revenge-short the stop-out also says don’t refuse the long because this name burned us. The chart since the stop: Thursday +15.09% closed $693.24, decisively back above the daily 200-EMA $632.32 — the very line whose break filled the short — and overnight $733.79 is pushing through the old ≈$721–732 “repairs the daily structure outright” zone while sitting exactly on the 1H 200-EMA $730.36, with the daily mid-band $748.45 just above and the 50-day $796.25 beyond. The weekly parabola-unwind thesis is dormant by its own rule (it needs a fresh daily close back under ≈$632; nothing above that re-arms it). Frames: the cohort split again — 1H pinned (RSI 70.7, Stoch 95.7, MACD histogram reddening) against a daily with fuel (RSI 43.6, Stoch ~20 curling up, MACD not yet crossed). The caveat that sets the rank: daily OBV 245M is still scraping its lows — better than CRWV’s new-low bleed, nowhere near STX’s held-highs accumulation. Middle of the pack on demand proof, so middle of the board. The plan: NO chase into a triple test (repair zone + 1H 200-EMA + mid-band $748 overhead) with the 1H pinned. Entry: the pullback that HOLDS $714–721 (9-day EMA $714.43 + repair-zone bottom). Stop: a close back under $693 — Thursday’s close; below it the repair push failed. Hard invalidation: under $665 (the old stop, now the bull/bear memory line) and finally the 200-day $632. Confirmation: a daily CLOSE over $732, then the mid-band $748. Targets: $748 → the 50-day $796 → $869 (upper band / the old July shelf). 🚦 Counts only with SMH closing over $547–550.',
    lead: { rank: 9, status: 'wait', entry: 'pullback holds $714–721', stop: '$693 (hard $665)', targets: '$748 → $796 → $869', downside: '+21%', rr: '~6:1', rrStar: true, edge: '🔄 The old cycle’s one loss returns as a long watch — no revenge bias either way: Thu +15.09% closed $693.24 back above the daily 200-EMA $632.32 (the line whose break filled our short) and overnight $733.79 pushes through the old $721–732 “full repair” zone right on the 1H 200-EMA $730.36, mid-band $748.45 and 50-day $796.25 overhead; 1H pinned (RSI 70.7 / Stoch 95.7) vs daily fuel (RSI 43.6, Stoch ~20) — but daily OBV 245M still scrapes its lows, so mid-rank until demand proves; entry only the pullback that HOLDS $714–721, stop a close under $693 (hard $665), confirmation a daily close over $732 → $748, targets $748 → $796 → $869; 🚦 counts only with SMH over $547–550' },
    side: 'long',
    date: '2026-07-31',
    story: 'stories/lite.html',
  },
  {
    symbol: 'NVDA', exchange: 'NASDAQ',
    price: '$195.04 → 🌙 $198.41', change: '🌙 overnight +1.73% → $198.41 · Thu CLOSED $195.04 — the $194 reclaim COMPLETED at the 4 PM print, before the overnight even started',
    signal: '🔄 NEW CYCLE — the control group moved, and it moved at the CLOSE: Thursday printed $195.04, a completed daily close over the $194 flip line — the exact condition this card and the SMH note both named for “the general joins.” The undercut-and-reclaim is done ($183.66 undercut → bought → close back over $194), and the leftover piece of the old short (filled <$194, T1 $189 banked at the tag) is formally closed by its own rule at ≈ flat. What makes NVDA unique on this board tonight: it is the ONLY chart with room on BOTH frames — 1H RSI 61 / Stoch 70 / MACD at zero (not pinned, because it never squeezed) and daily RSI 43 / Stoch turning up from 18 — with OBV 2.73B that never broke through the entire correction. The general has fuel precisely because it sat out the covering rally. That is also why it stays the board’s BREADTH GAUGE: NVDA working through its overhead slab = the move broadens past memory; NVDA stalling there while memory runs = the rally is still narrow and the SMH gate gets shaky at acceptance. The slab: $201–204 in one piece — 1H 200-EMA $201.03 + daily mid-band $202.07 + 50-day $203.55 — then $206, the old card’s “restores the long” line, then the $215.82 upper band. Below: $194 flips to support; the $189–190 cluster (the old hold line + the rising daily 200-EMA) is the invalidation — a daily close under it re-opens the old downside map $182 → $174. Plan: entry is the pullback that HOLDS $194–195; a daily close over $206 upgrades it to trend-repair; a daily close under $189 kills it. Smallest measured move on the board, highest probability, biggest information value. 🚦 Counts only with SMH closing over $547–550 — and NVDA itself is half the evidence for that gate.',
    lead: { rank: 5, status: 'wait', entry: 'pullback holds $194–195', stop: '$189 (daily close)', targets: '$201 → $206 → $216', downside: '+11%', rr: '~4:1', rrStar: true, edge: '🔄 The general joined at the CLOSE — Thu $195.04 completed the daily close over $194 this card demanded, finishing the undercut-and-reclaim ($183.66 → bought → reclaimed) and closing the leftover short by its own rule; the only chart on the board with room on BOTH frames (1H RSI 61 / Stoch 70 not pinned — it never squeezed; daily RSI 43, Stoch off 18) and an OBV (2.73B) that never broke — the breadth gauge for the whole gate: through $201–204 (1H 200 + mid-band + 50-day) = the move broadens, stalled there = still narrow; entry the pullback that HOLDS $194–195, stop a daily close under $189 (old hold line + 200-day cluster), targets $201 → $206 (trend-repair line) → $216; smallest move, highest probability, biggest information value' },
    side: 'long', accent: 'red',
    date: '2026-07-31',
    story: 'stories/nvda.html',
  },
  {
    symbol: 'COHR', exchange: 'NYSE',
    price: '$246.88', change: '⚠️ 2:07 ET +11.19% (+$24.83) · bounced off the T3 door — back AT the broken T2 $247 · the $252–266 re-load zone is NOW in play, 2–8% up',
    signal: '⚠️ The one card of the four where the squeeze delivers price INTO the plan’s own zone instead of voiding it. T3 $215 was never tagged: the $218.01 AH print came within ~1.4% and the card said bank into the tag, don’t press the last target — right call, that WAS the low, and COHR has bounced +13% off it to $246.88 (+11.19%, +$24.83 at 2:07 ET). T1 $265 and T2 $247 stay banked, and the short from $310 still holds ≈ +20% at this price. Where it sits: price has retaken the broken T2 $247 to the cent and is pressing the lower lip of the $252–266 re-load zone (1H 50-EMA → the broken daily 200-EMA $266) — 2–8% up, with the 1H 200-EMA $279.90 (+13%) and the $321 stop (+30%) far overhead. But today’s cohort lesson applies here hardest, because this is the card most tempted to sell: momentum has flipped — RSI 60.11, the MACD line’s FIRST positive cross of the entire slide (signal −1.94), OBV rising 25.7M → 27.1M, Stoch 90.73 pinned. The zone is where a re-short SETS UP, not an order to sell into a squeeze: the add needs a REJECTION inside $252–266 confirmed by a 1H close back under $240 (the 1H 9-EMA), which re-opens the mid-band $230.20 → $218 → 🕳️ T3 $215, still on the map. A daily close over $266 — the broken daily 200-EMA — would be the first structural repair of the whole slide and puts $279.90 → $321 in play; only a reclaim of $321 repairs it fully. Optics context: GLW is +8% inside its own re-short zone at the same hour — the optics complex is squeezing together; read AAOI and LITE as stale, not unaffected.',
    side: 'short', accent: 'violet',
    date: '2026-07-31',
    story: 'stories/cohr.html',
  },
  {
    symbol: 'IREN', exchange: 'NASDAQ',
    price: '$37.31', change: 'session +27.28% (+$8.00) at 10:00 ET · ⚠️ the squeeze risk the card named — price is back AT the $38.90 short entry · stop $42 now ~12% away',
    signal: '⚠️ The squeeze the card flagged is what happened — this trade is over. IREN is $37.31 (+27.28%, +$8.00 at 10:00 ET), a vertical off the $29.20 low that took the $31–34 add zone, the banked T2 $30, the banked T1 $34 and the whole 30-min stack (9-EMA ≈ $33.6 → 50-EMA/VWAP ≈ $35.6) in one move, punching into the 30-min 200-EMA ≈ $37–39 and straight back to the $38.90 short entry. Honest scorekeeping: T1 $34 and T2 $30 were realised on the way down, but the runner toward 🕳️ $27 is dead — the position is now ≈ +4% from $38.90, down from ≈ +25% yesterday. The ≈$2.8B AI-cloud catalyst was named as the squeeze risk from day one and it is what is driving this. Do: cover the runner into the strength — don’t defend a short at your own entry after a +27% day. Don’t: short it here. Stop $42 is unchanged and now only ~12% away, and a reclaim of $41.70 flips the setup long. What would re-arm the short is a failure right here — rejection at the 200-EMA and a close back under ≈$35.6 — with the caveat that 30-min OBV is still deeply negative (−91.5M) and Stoch is pinned at 96.83: covering fuel spending itself, not proven accumulation. Two of three targets banked; take the win and let the level pick the next trade. 🚦 GROUP GATE reinforces it: the barometer is $536.64 (+6.43% at 12:39 ET) and has held above its reclaimed $535 for three hours, daily bar Repairing — a re-short here needs BOTH the local failure under ≈$35.6 AND an SMH daily close back under $535. Its close over $547–550 takes the group premise away entirely.',
    side: 'short', accent: 'red',
    date: '2026-07-31',
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
    price: '$52.34 → 🌙 $55.55', change: '🌙 overnight +6.13% → $55.55 — THROUGH the $52.60–53.95 band, pressing the 50-day $56.27 · Thu close $52.34 (+16.70%) · Korea: Samsung +24.8%, SK Hynix +27.8%',
    signal: '🔄 NEW CYCLE — long watch with the cohort’s best volume signature, and the Korea night the card always warned about arrived in the BULL direction: Samsung +24.8%, SK Hynix +27.8% — together with MU that is ~75% of this basket, so overnight +6.13% → $55.55 is arithmetic, not sentiment. The print is THROUGH the old $52.60–53.95 decision band (where any short needed a rejection — that setup is dead) and pressing the 50-day EMA $56.27, the same test MU is making at its own 50-day tonight. The discriminator is unchanged and still firing: 1H OBV surged again through Thursday (103M → 171M) — the cleanest accumulation in the cohort — and daily OBV has finally ticked up off its base. MU and SNDK are still waiting for demand proof; DRAM already has some. Frames: the standard split — 1H pinned (RSI 74.5, Stoch 96.4) against a daily with fuel (RSI 44.5, Stoch 16 curling up, MACD histogram closing on zero). The confirmation line is the old card’s regime line, unchanged: $61 (38.2% fib) — nothing is officially neutral/bullish below it; DRAM’s own $547–550, ~10% above the overnight print. Plan: no chasing a gap into the 50-day with the hourly pinned. Entry: the pullback that HOLDS $52.60–54 (old decision band + 1H 200-EMA flipping to support). Stop: a daily close back under $51.55 — below it the band reclaim failed. Targets: the 50-day $56.27 → the $61 regime line → ≈$68 (the upper half of the daily band). Korea-gap risk cuts both ways EVERY night on this product — that is a position-sizing decision, not a thesis change. 🚦 Counts only with SMH closing over $547–550.',
    lead: { rank: 4, status: 'wait', entry: 'pullback holds $52.6–54', stop: '$51.55 (daily close)', targets: '$56.3 → $61 → $68', downside: '+28%', rr: '~8:1', rrStar: true, edge: '🔄 The best volume proof in the cohort meets the Korea night it always warned about — in the bull direction: Samsung +24.8% / SK Hynix +27.8% (with MU, ~75% of the basket) put overnight $55.55 THROUGH the old $52.60–53.95 decision band and onto the 50-day $56.27; 1H OBV surged again (103M → 171M, the cleanest accumulation on the board) with daily OBV ticking up while MU/SNDK still wait for demand proof; 1H pinned (RSI 74.5 / Stoch 96.4) vs daily fuel (RSI 44.5, Stoch 16) — entry only the pullback that HOLDS $52.60–54, stop a daily close under $51.55, targets $56.3 → the $61 regime line (DRAM’s own gate, nothing neutral below it) → ≈$68; nightly Korea-gap risk = size smaller, not skip; 🚦 counts only with SMH over $547–550' },
    side: 'long', accent: 'indigo',
    date: '2026-07-31',
    story: 'stories/dram.html',
  },
  {
    symbol: 'AAOI', exchange: 'NASDAQ',
    price: '$90.11 → 🌙 $96.97', change: '🌙 overnight +7.61% → $96.97 — running INTO the $101–102 double-200 confluence (1H + daily 200-EMA) · Thu close $90.11 (+17.76%) · 1H OBV STILL negative',
    signal: '🔄 NEW CYCLE — the board’s third rejection-only SHORT, and the cleanest level of the three: overnight $96.97 is running straight into a DOUBLE-200 confluence at $101–102 — the 1H 200-EMA $101.20 and the daily 200-EMA $101.97 stacked within a dollar. The old card scripted this test (“a 1H close over $92.12 extends to the 1H 200-EMA”) — $92.12 fired and here we are. The volume signature keeps it in the CRWV/INTC camp: 1H OBV is STILL NEGATIVE at −5.62M (was −6.85M Wednesday — barely moved through +17.8% Thursday and +7.6% overnight) and daily OBV 113M has fallen all July. Covering, not accumulation — the same tell the old card traded on, still printing. The optics-pair logic sharpens it: LITE, the sub-sector peer, has already reclaimed its daily 200-EMA and pushed into its repair zone; AAOI is the LAGGARD, still below BOTH its 200-days after +27% in two sessions. Laggard + no demand + double-200 overhead = the textbook rejection watch. The honest counterpoint, written down in advance: the daily MACD histogram is −0.17, one tick from a bullish cross, with the daily Stoch on the floor — if $101–102 BREAKS on a daily close, both 200-EMAs reclaim at once, the laggard graduates to the repair camp, and this short case is gone entirely. Plan: entry ONLY on a rejection at $101–102 confirmed by a 1H close back under $92 (the retaken trigger = the failure); stop $106, dead on a daily close over $102. Targets: $92 → $86.50 (1H 9-EMA zone) → $82 (the old T2 shelf), 🕳️ $58 the tail. 🚦 Override, same as CRWV and INTC: SMH confirms the gate AND $102 prints = dropped.',
    lead: { rank: 11, status: 'wait', entry: 'fade the rejection in $101–102', stop: '$106 (dead >$102 close)', targets: '$92 → $86.5 → $82', downside: '−19%', tail: '−43%', rr: '~4:1', rrStar: true, edge: '🔄 The third rejection-only short, with the cleanest level: overnight $96.97 runs into a DOUBLE-200 confluence $101–102 (1H 200-EMA $101.20 + daily 200-EMA $101.97) — a test the old card scripted when $92.12 fired; the tell is unchanged — 1H OBV STILL negative (−5.62M vs −6.85M Wednesday, unmoved by +27% in two sessions) with daily OBV falling all July: covering, no demand — and the optics pair sharpens it: LITE already reclaimed its 200-day, AAOI is the laggard below BOTH of its own; entry only a rejection at $101–102 + 1H close back under $92, stop $106 (dead on a daily close over $102 — both 200s reclaimed = repair camp, case gone), targets $92 → $86.5 → $82, tail $58; SMH gate + $102 = dropped' },
    side: 'short', accent: 'violet',
    date: '2026-07-31',
    story: 'stories/aaoi.html',
  },
  {
    symbol: 'WDC', exchange: 'NASDAQ',
    price: '$526.51', change: '✅ 2:06 ET +13.95% (+$64.47) · reclaimed $513 AND $525 — two of the three re-negate lines · 1H 200-EMA $513.86 underfoot · $535 the last line, ~1.6% up',
    signal: '✅ The storage squeeze reached the stale card — and fired two of its three re-negate lines. The card’s own ladder was "a reclaim of $513 → $525 → $535 re-negates": WDC is $526.51 (+13.95%, +$64.47 at 2:06 ET), through $513 AND $525 in one impulse that also reclaimed the 1H 200-EMA $513.86 — the STX card told you to read WDC as stale, not unaffected, and this is the catch-up (SNDK +23%, MU +18%, STX +11%, now WDC +14%). The banked ladder stands as history, ≈ +11% from $513 — and the magnet call was exact: "bank into $455–461, don’t press the low" — the $454.16 AH print WAS the low. Anything still held from $513 is now −2.6% underwater; the banked ladder was the trade. Momentum is the same cohort regime change, real but stretched: RSI 64.50, MACD firmly positive above its 8.39 signal, OBV positive and ticking up to 148M, Stoch 83.26 easing off ~90. The decision is the last line: $535 — the old stop, 1.6% up. A daily close over it completes the re-negation and restores the long (this was always a deep pullback in an intact weekly uptrend, weekly 50-EMA $339 far below — the same family as DELL and STX) toward the 1H upper band $544.50 → the pre-slide $560–585 July shelf. A 1H close back under $513.86 fails the reclaim and re-opens $489.72 (1H 50-EMA) → $475 → the $455 magnet. No fresh trade either way at +14% with Stoch 83: the long, if it comes, is a pullback that HOLDS $513–514, stop under $489.72, confirmed by the $535 close.',
    side: 'short',
    date: '2026-07-31',
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$91.13 → 🌙 $96.21', change: '🌙 overnight +5.57% → $96.21 — EXACTLY on the 1H 200-EMA $96.19, the lip of the old $96–102 negation band · Thu close $91.13 (+11.30%) · 1H OBV −631M, a NEW low',
    signal: '🔄 NEW CYCLE — the board’s second rejection-only SHORT, and the discriminator that defined this card has gotten WORSE, not better. The thesis was “the purest short-covering print in the cohort: OBV −590M, unmoved.” Tonight: 1H OBV −631M — the money-flow line made a NEW LOW while price added +11.30% Thursday and +5.57% overnight, and daily OBV confirms at 2.02B, falling to new July lows off 3.0B. Three sessions of double-digit squeeze, zero net accumulation: still the worst volume signature on the board, worse than CRWV’s. Location: overnight $96.21 sits EXACTLY on the 1H 200-EMA $96.19 — the bottom lip of the old card’s $96–102 negation band, with the daily 50-day $104.45 just beyond it. Every name on the board is at its named decision level tonight; INTC included. Frames: 1H pinned (RSI 71.5, Stoch 92.5, MACD histogram reddening) over a floored daily (RSI 40.5, Stoch 11.6) — but with no demand underneath, “fuel” is the wrong word here; the old rule stands: do NOT flip it long — there is no accumulation in the data, only absent supply — and do not press a short without the trigger either. The trigger, carried over verbatim: a REJECTION inside $96–102 confirmed by a 1H close back under $89 (the retaken gate) — that re-opens $85 → the daily 200-EMA $75 → the 🕳️ $66 gap. A daily close over $102 ends the short case outright. 🚦 Override, same as CRWV: if SMH closes over $547–550 AND $102 prints, drop it — no individual failure, no short.',
    lead: { rank: 10, status: 'wait', entry: 'fade the rejection in $96–102', stop: '$104 (dead >$102 close)', targets: '$85 → $75 → $66', downside: '−33%', rr: '~6:1', rrStar: true, edge: '🔄 The board’s second rejection-only short, kept because its tell got WORSE: 1H OBV −631M made a NEW low through a +11.3% day and +5.6% overnight (was −590M Wednesday — three squeeze sessions, zero accumulation, the worst volume on the board), daily OBV 2.02B falling with it; overnight $96.21 sits exactly on the 1H 200-EMA $96.19 at the lip of the old $96–102 negation band with the 50-day $104.45 beyond; no long ever on this profile, no short without the trigger: rejection inside $96–102 + a 1H close back under $89 re-opens $85 → the 200-day $75 → 🕳️ $66; a daily close over $102 ends it — and if SMH confirms the gate AND $102 prints, drop it' },
    side: 'short', accent: 'blue',
    date: '2026-07-31',
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$874.66 → 🌙 $906', change: '🌙 overnight +3.63% → $906.45 — ON the 50-day EMA $902.26, first tag since the slide began · Thu close $874.66 (+18.36%)',
    signal: '🔄 NEW CYCLE — long watch, and the overnight print is parked exactly on the confirmation line. Thursday’s completed bar did the structural work: +18.36% to $874.66, back ABOVE the old $853 lid whose reclaim ended our short. Overnight adds +3.63% to $906.45 — sitting ON the 50-day EMA $902.26, MU’s first tag of it since the decline started. The frames split the classic trend-turn way: the 1H is pinned (RSI 71, Stoch 96, MACD +18 stretched) while the DAILY is only mid-range — RSI 46.6, Stoch 24.7 just off the floor, MACD not yet crossed — so the overbought reading argues against CHASING the open, not against the move; even marking the gap in, daily RSI lands only mid-50s. The missing piece is volume: daily OBV 1.10B is well off its 1.22B highs — two covering days don’t rebuild it, so demand is unproven until a held pullback + expansion up prints. The plan: NO buying the gap (1H Stoch 96 into the 50-day after +18% is the textbook shakeout spot). The entry is the first pullback that HOLDS $874–890 — Thursday’s close + the 1H 200-EMA $889.79, with the old $868–886 “last defence” zone flipping to support beneath. Stop: a 1H close back under $853 — the line that killed the short now defends the long; below it the overnight strength was distribution. Confirmation: a daily CLOSE over the 50-day $902. Targets: the 9-day $933 → the 21-day mean $996–1,000 (also where the daily oscillator would finally read hot) → the $1,063 shelf. 🚦 Group gate: longs count only with SMH closing over $547–550; an SMH close back under $535 voids the regime turn.',
    lead: { rank: 2, status: 'wait', entry: 'pullback holds $874–890', stop: '$853 (1H close)', targets: '$933 → $996 → $1,063', downside: '+21%', rr: '~6:1', rrStar: true, edge: '🔄 Long watch parked ON the confirmation line: overnight $906.45 tags the 50-day EMA $902.26 — first touch since the slide — after Thursday’s +18.36% bar reclaimed the old $853 lid; frames split the trend-turn way (1H RSI 71 / Stoch 96 pinned vs daily RSI 46.6 / Stoch 24.7 barely off the floor — fuel above, no chase below), daily OBV 1.10B vs 1.22B highs still unproven; entry ONLY the first pullback that HOLDS $874–890 (Thu close + 1H 200-EMA $889.79, the $868–886 old defence zone flipping to support), stop a 1H close under $853, confirmation a daily CLOSE over $902 → $933 → $996–1,000 → $1,063; 🚦 counts only with SMH closing over $547–550' },
    side: 'long', accent: 'cyan',
    date: '2026-07-31',
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
    side: 'short', accent: 'blue',
    date: '2026-07-31',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,279.96 → 🌙 $1,374', change: '🌙 overnight +7.37% → $1,374.25 — THROUGH the $1,287 weekly 21-MA decider · Thu close $1,279.96 (+25.99%), one dollar under the line',
    signal: '🔄 NEW CYCLE — long watch, one stage EARLIER in the repair than MU, which cuts both ways. Thursday closed $1,279.96 (+25.99%) — a single dollar under $1,287, the weekly 21-MA our old card called “the decider” — and the overnight print $1,374.25 is through it. But unlike MU (knocking on its 50-day), SNDK is still ~15% BELOW its own 9/50-day cluster $1,593–1,632 and below the daily mean $1,776: it fell harder, so despite the bigger bounce it has confirmed LESS — this stays a rally inside a broken daily structure until those levels are dealt with. The frame split is the widest in the cohort: hottest 1H (RSI 76.7, Stoch 95.7 — more extended than MU, biggest morning-shakeout risk) against a daily that is barely alive: RSI 42, Stoch 9.6 just lifting off the absolute floor, MACD −106 deep negative. Most fuel, least proof. Daily OBV 529M vs ~600M highs — same missing volume confirmation as the rest, though the 1H OBV surge (162M, straight up) is genuinely constructive. The plan: NO chasing a +33%-in-two-days name at the open, period. The entry is the retest that HOLDS $1,287–1,300 — the reclaimed weekly 21-MA flipping to support — the single cleanest structure on this chart. Stop: a daily close back under $1,287 says the overnight was a stop-run through a known level; hard invalidation under $1,235 (the old lid). Targets: the 1H 200-EMA $1,431 (≈ the old “on hold to $1,412” line) → the real fight at $1,593–1,632 (9/50-day) → the mean $1,776. 🚦 Group gate: longs count only with SMH closing over $547–550.',
    lead: { rank: 3, status: 'wait', entry: 'retest holds $1,287–1,300', stop: '$1,235', targets: '$1,431 → $1,593 → $1,776', downside: '+37%', rr: '~8:1', rrStar: true, edge: '🔄 The widest fuel-vs-proof gap in the cohort: Thu closed $1,279.96 (+25.99%) a dollar under the $1,287 weekly 21-MA decider and overnight $1,374.25 is THROUGH it — yet price is still ~15% below the 9/50-day cluster $1,593–1,632, the hottest 1H in the group (RSI 76.7 / Stoch 95.7) sits on a daily barely off the floor (RSI 42, Stoch 9.6, MACD −106), and daily OBV 529M vs 600M is unproven; no chase at the open — the entry is the retest that HOLDS $1,287–1,300 (reclaimed weekly 21-MA → support), stop a daily close back under $1,287 / hard $1,235, targets $1,431 → $1,593–1,632 → $1,776; 🚦 counts only with SMH closing over $547–550' },
    side: 'long', accent: 'red',
    date: '2026-07-31',
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$538.90 → 🌙 $550.15', change: '🌙 overnight +2.09% → $550.15 — ON the $547–550 gate the whole board keys off · Thu close $538.90 (+6.88%)',
    signal: '🚦 THE DECISION LINE IS TRADING. Overnight $550.15 sits ON $547–550 — the daily swing-high gate every card on this board keys off. Gaps propose, closes ratify: a daily CLOSE above $547–550 formally breaks the group’s daily downtrend (shorts off board-wide, barometer past Repairing, the long cycle confirmed); a gap that fades back under $547 traps the open-chasers; a close back under $535 re-arms shorts. What delivered the gap: MSFT’s AI-capex beat plus the Korea reversal — SK Hynix +27.8%, Samsung +24.8% after a −17% three-day rout — with NDX futures +1.6% absorbing AAPL −6%. The daily frame has fuel for acceptance: Thursday’s bar closed with daily Stoch 14.5 just off the floor and RSI 42 — mid-range, not overbought — while the 1H frames across the cohort are pinned: the trend-turn signature, which argues against chasing and for buying held retests. The fib/MA confluence maps the gates above cleanly: 0.382 of the whole slide ≈ $552 (here, now), then $557.88–560.16 (4H 50 / 1H 200-EMA), then 0.5 ≈ $574 right on the 50-day $571.81 + mid-band $576.42 — the REAL trend fight — then $580 (4H 200-EMA, end of fade-mode), then 0.618 ≈ $595 into the $594–600 wall. Composition check: NVDA already CLOSED over $194 on Thursday ($195.04) — the general voted at the 4 PM print; today’s breadth tell is whether it works through its $201–204 slab, and a memory-only push still gets shaky at acceptance. Today’s close is also the WEEKLY close — the highest-conviction bar of the week prints tonight.',
    edge: '🚦 The gate is trading: overnight $550.15 ON the $547–550 daily swing-high line after Thu +6.88% — a daily CLOSE above breaks the group downtrend (shorts off, long cycle confirmed), a fade back under $547 traps the chasers, under $535 re-arms shorts; MSFT capex + Korea (SK Hynix +27.8%, Samsung +24.8%) built the gap, daily Stoch 14.5 / RSI 42 leave fuel while every 1H is pinned — buy held retests, never the open; gates above by fib+MA confluence: $552 → $557–560 → $572–576 (50-day + mid-band, the real fight) → $580 → $594–600; NVDA closed $195.04 over $194 Thu — the general already voted, watch its $201–204 slab next; tonight is also the weekly close',
    side: 'long', accent: 'red',
    date: '2026-07-31',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$851.68 → 🌙 $875', change: '🌙 overnight +2.74% → $875 — INSIDE the W-bottom, neckline $900–910 overhead · Thu close $851.68 (+11.41%), earnings selloff reclaimed',
    signal: '🔄 NEW CYCLE — rank-1 long watch: an undercut-and-reclaim W-BOTTOM, the strongest base structure in the cohort, unconfirmed until the neckline breaks. The pattern: first bottom ~$730–750 (mid-July tag of the lower band), second bottom the earnings-panic undercut to ~$701 bought straight back — a spring that flushed the supply under the first low, which is STRONGER than textbook equal lows. The neckline is $900–910, the interim peak between the lows — and it has already rejected once (Thursday’s $901.18 high), which is normal first-touch behavior and proof that’s where the sellers actually live. Overnight $875 is INSIDE the pattern, not a breakout — constructive positioning, nothing more. Why this ranks first: OBV sat near its highs through the ENTIRE correction — accumulation never broke, the single best argument this is a base and not distribution — with RSI ~50 recovered without overheating, MACD histogram compressed toward a bullish cross, and Stoch reset at 38 turning up: fuel, unlike the Stoch-90 cohort. Two entries, honest labels: EARLY = the pullback that HOLDS $835–841 (50-day $837.06 + mid-band $844.76 + the reclaimed line, one zone), stop under the 1H 50-EMA $801 — cheaper, carries pattern-failure risk. CONFIRMED = a daily CLOSE through $900–910 on strong volume — the pattern’s own trigger. What you never do: buy $875–900 mid-range under a once-rejected neckline. Targets on confirmation: $949–960 (upper band $949.24 + prior shelf, the working target) → ≈$1,000 → measured move ≈$1,070–1,100 (trend territory, not immediate). Invalidation ladder: close back under $835–840 = just an earnings rebound; under $740 = structure damaged; under $701 = pattern void. 🚦 Counts only with SMH closing over $547–550.',
    lead: { rank: 1, status: 'wait', entry: 'pullback holds $835–841', stop: '$801', targets: '$949 → $1,000 → $1,070', downside: '+28%', rr: '~6:1', rrStar: true, edge: '🔄 Rank-1 structure of the new cycle: an undercut-and-reclaim W-bottom — first low ~$730–750, second the ~$701 earnings undercut bought straight back (a spring, stronger than equal lows) — with the neckline $900–910 tagged once ($901.18) and rejected, overnight $875 INSIDE the pattern; OBV held near its highs through the whole correction (accumulation never broke), RSI ~50 and Stoch 38 leave fuel; two entries with honest labels — early: pullback HOLDS $835–841 (50-day + mid-band + reclaimed line), stop under $801; confirmed: daily CLOSE over $900–910 on volume — and never buy $875–900 mid-range under a once-rejected neckline; targets $949–960 → $1,000 → measured ≈$1,070–1,100; invalidation $835 / $740 / $701; 🚦 counts only with SMH over $547–550' },
    side: 'long', accent: 'amber',
    date: '2026-07-31',
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
    side: 'short', accent: 'indigo',
    date: '2026-07-31',
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
    price: '$207.12 → 🌙 $224.90', change: '🌙 overnight +8.58% → $224.90 — INSIDE the $219–241 decision slab · Thu close $207.12 (+26.49%) RECLAIMED the daily 200-EMA $183.78',
    signal: '🔄 NEW CYCLE — long watch with the cohort’s biggest structural repair AND its most compressed risk/reward, at the same time. The repair: Thursday’s +26.49% bar closed at $207.12, back ABOVE the daily 200-EMA $183.78 — unlike MU/SNDK (whose 200-days sit far below, never lost), BE actually broke its 200-day in the July slide and reclaimed it in ONE day. The compression: BE has already spent its runway — +43% off Tuesday’s $157 low, and the overnight $224.90 is INSIDE the $219–241 decision slab where the old $219–234 distribution shelf (our archived card’s “last re-short standing”), the daily mid-band $232.58 and the 50-day EMA $241.48 all stack — reached with the 1H pinned (RSI 70, Stoch 91) while the daily Stoch sits at 12.7 barely off the floor and daily OBV is still near its lows. MU is knocking on its test with room behind it; BE is already inside its test. Base case: ranged digestion inside $184–241 while the daily catches up. Bull path: a dip that HOLDS $213–217 (the old $213 line + the reclaimed 1H 200-EMA $216.99) keeps the reclaim honest; acceptance — a daily CLOSE — over $241 completes the daily repair and opens the mean-reversion territory above. Invalidation: a daily close back under the 200-day $183.78 voids the entire repair in one stroke. ⚠️ Cohort role: BE is power, not semis — the BREADTH TELL for the whole AI-infra move. BE holding its 200-day reclaim while memory holds its levels = the move is broad; BE failing back under $184 while memory holds = the squeeze is narrowing back to memory only. Worth watching even without a position. 🚦 Counts only with SMH closing over $547–550.',
    lead: { rank: 7, status: 'wait', entry: 'dip holds $213–217', stop: '$204', targets: '$232 → $241 → $250', downside: '+16%', rr: '~3:1', rrStar: true, edge: '🔄 Biggest repair, tightest room: Thu +26.49% reclaimed the daily 200-EMA $183.78 in one bar — the only 200-day reclaim in the cohort — but overnight $224.90 is already INSIDE the $219–241 slab (old distribution shelf + mid-band $232.58 + 50-day $241.48) after +43% off Tuesday’s $157 low, with the 1H pinned (RSI 70 / Stoch 91) and the daily barely off the floor (Stoch 12.7, OBV near lows); base case is $184–241 digestion — the long is only a dip that HOLDS $213–217 (old $213 line + 1H 200-EMA $216.99), stop $204, and a daily CLOSE over $241 completes the repair → $250+; a daily close back under $183.78 voids it all; the cohort’s BREADTH TELL — power confirming or narrowing the AI-infra move; 🚦 counts only with SMH over $547–550' },
    side: 'long', accent: 'amber',
    date: '2026-07-31',
    story: 'stories/be.html',
  },
  {
    symbol: 'ALAB', exchange: 'NASDAQ',
    price: '$290.83', change: '✅ 1:59 ET +16.45% (+$41.09) · the $250 base DEFENDED — back ABOVE T2 $280 · OBV positive AND rising · $300–310 the decision band',
    signal: '✅ The base defended — exactly where this card said bulls would, and it is the one bounce in the cohort with volume agreeing. Yesterday the fade tagged 🕳️ T3 — the May base $250 — to the dollar, the full ladder ($300 → $280 → $250) was banked at ≈ +19% from $310, and the card’s read was explicit: the base + weekly 21-MA is major support, bank/trail, don’t press the tag. Today proves it: ALAB is $290.83 (+16.45%, +$41.09 at 1:59 ET) — +16% off the tag in one session. The $255–280 add zone is 4–12% below and VOID, price is back ABOVE the retaken T2 $280, the 1H 50-EMA $270.76 and mid-band $263.22, and the $231 deeper magnet for a trailing runner is dead. The tell that separates ALAB from INTC: OBV is POSITIVE and RISING (57.5M → 60.4M) with the 1H MACD line decisively positive above its signal (3.26) — demand at a major base, not just absent supply like INTC’s unmoved −590M. Overhead the decision is one tight band: banked T1 $300 (broken support turned lid) → the 1H 200-EMA $306.79 (~5.5% up, first tag from below since the slide began) → the $310 entry itself. RSI 70.46 and Stoch 93.51 are pinned, so chase nothing at $291 in either direction. The only re-short is a REJECTION in $300–310 confirmed by a 1H close back under $280 (the retaken T2), which re-opens $270.76 → $263 → the base. A daily close over $310 ends the short case’s echo and puts $362 — the full long-repair line, ~24% up — in play as the squeeze’s target. Off the ranked table (banked in the strip).',
    side: 'short', accent: 'emerald',
    date: '2026-07-31',
    story: 'stories/alab.html',
  },
  {
    symbol: 'CRDO', exchange: 'NASDAQ',
    price: '$196.29', change: '⚠️ 2:40 ET +10.62% (+$18.85) · bounced +14% off the T3 tag — back ABOVE T2 $190 · the $203–210 re-short zone 3–7% up, 1H 200-EMA $212.67 right above it',
    signal: '⚠️ The ladder paid in full — and now the squeeze is delivering the re-load. Yesterday’s AH print $171.58 tagged 🕳️ T3 $175 / the rising daily 200-EMA ≈ $172, the card said bank into the tag and don’t press a rising 200-EMA — and that WAS the low: CRDO has bounced +14% off it to $196.29 (+10.62%, +$18.85 at 2:40 ET), back ABOVE the broken T2 $190 and pressing T1 $200 from below. The full ladder ($200 → $190 → $175) stands banked ≈ +22% from $219–230; the short still holds ≈ +13% at this price. Overhead is one tight structure: T1 $200 → the 1H upper band $202.85 sitting at the lower lip of the $203–210 re-short zone the card kept → the 1H 200-EMA $212.67 right above the zone top, making $210–213 effectively one lid. Momentum flipped like everywhere in the cohort — RSI 59.75, the MACD line’s first positive cross of the slide (signal −0.18), OBV rising to 23.9M, Stoch 89.91 pinned — so the zone is where the re-short SETS UP, not an order to sell into a squeeze: a REJECTION in $203–210 confirmed by a 1H close back under $193 (the 1H 9/50-EMA cluster) starts it, and a 1H close under $190 is the full re-arm → the mid-band $184.25 → $175/$172. A daily close over $213 (zone top + 1H 200-EMA) is the first structural repair toward the $220s; only a reclaim of $242 repairs the long. Comms-silicon comp: ALAB — the closest peer — is squeezing the same way, and with OBV rising there too.',
    side: 'short', accent: 'cyan',
    date: '2026-07-31',
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
    price: '$183.30 → 🌙 $198.03', change: '🌙 overnight +8.04% → $198.03 — through the $185 trigger AND the 1H 200-EMA $195.31, its first reclaim of the slide · Thu close $183.30 (+12.18%)',
    signal: '🔄 NEW CYCLE — the old board’s ONE working long got its confirmation, then some: the card asked for $185 and Thursday closed $183.30 a hair under it — the overnight $198.03 vaulted the trigger AND the 1H 200-EMA $195.31, Marvell’s first reclaim of that line since the decline began. Why this name led the cohort’s bottom by a day: daily OBV 1.05B barely dipped from its highs through the whole correction — the best-preserved money flow on the board after NVDA/STX — and the 1H OBV is rising WITH price now: demand-confirmed, not covering-flavored. The daily still has the cohort fuel profile (RSI 40, Stoch 12 off the floor, MACD deep negative, price under the 50-day $215.68 but well over the 200-day $155.73). The trap tonight is the +8% overnight print itself: the probe-then-confirm discipline that made this the old cycle’s one winner is exactly what not to abandon by paying $198 at the open. Plan: entry is the pullback that HOLDS $186–195 — the old $185–188 trigger zone (now support) through the 1H 9-EMA $187.79 up to the reclaimed 1H 200-EMA — stop a close back under $181.50 (1H 50-EMA + Thursday’s close; below it the trigger break failed), targets the round $200/$205 shelf → the 50-day $215.68 (the real daily test) → $230. Invalidation deeper: a daily close back under $178 returns it to the old base and the plan resets. 🚦 Counts only with SMH closing over $547–550.',
    lead: { rank: 6, status: 'wait', entry: 'pullback holds $186–195', stop: '$181.50 (close)', targets: '$205 → $216 → $230', downside: '+21%', rr: '~4:1', rrStar: true, edge: '🔄 The old cycle’s one working long, confirmed and then some: the $185 trigger it was 2% from got vaulted overnight to $198.03 along with the 1H 200-EMA $195.31 — the first reclaim of the slide — behind the best-preserved daily OBV on the board after NVDA/STX (1.05B, barely off its highs) and a 1H OBV rising WITH price: accumulation, not covering; daily fuel intact (RSI 40, Stoch 12, 50-day $215.68 overhead); don’t abandon the probe-then-confirm discipline by paying $198 — entry only the pullback that HOLDS $186–195 (old trigger zone → reclaimed 1H 200), stop a close under $181.50, targets $205 → $216 (50-day) → $230; 🚦 counts only with SMH over $547–550' },
    side: 'long', accent: 'blue',
    date: '2026-07-31',
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
