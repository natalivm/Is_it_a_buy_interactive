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
      price: '$683.55 → 🌙 $692.10',
      change: '🌙 overnight +1.25% → $692.10 — ON the 1H 200-EMA $691.06, under the ≈$695 gate · Thu CLOSED $683.55 (+3.30%), acceptance above the $678–680 shelf confirmed',
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
          verdict: 'bull', weight: 1.5,
          read: '✅ FLIPPED — the condition this check named printed: a daily CLOSE above the shelf, $683.55 (+3.30%), not an intraday poke. The lid that capped the whole week is support now, and it did it while AAPL fell 6%. The shelf only fails on a daily close back under $678.'
        },
        {
          label: 'Descending trendline (≈$695)',
          verdict: 'bear', weight: 1.5,
          read: 'The line off the June highs has capped every attempt for six weeks and is still unbroken. Nothing above it has been tested.',
        },
        {
          label: 'Daily momentum',
          verdict: 'neutral',
          read: 'Fuel, not exhaustion: the completed Thursday bar leaves daily RSI 43.17 and daily Stoch 11.64 curling off the FLOOR, with the MACD histogram closing toward a cross — the index has room the memory leaders do not (their 1H frames are pinned at Stoch 90+). Not bullish until the daily 50 line is reclaimed and held, but nothing here is stretched.',
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
      note: '🌙 Pre-open 7/31: the projection landed — futures +1.6% delivered $692.10 overnight, sitting ON the 1H 200-EMA $691.06 directly under the ≈$695 six-week trendline and the $695–700 daily swing-high gate, the “nothing above it has been tested” line. Thursday already did the first job: a CLOSE at $683.55 (+3.30%) above the $678–680 shelf, earned while AAPL fell 6% — real acceptance, so that check flips bull. Now the harder one: $695–703 is a single slab (trendline + swing high + 50-day $700.34 + mid-band $703.34) and it must be taken by a CLOSE, not a gap. Daily Stoch 11.64 off the floor says there is fuel for it; daily OBV 925M still falling says the volume has not confirmed. Below, the ladder is unchanged: $678 → $675.27 → $665–668 → $661.58. Breadth arrived overnight — McClellan positive, 70.5% >200DMA, Market Tide ~$1B — with put/call 1.14 the lone holdout.'
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
      symbol: 'VXN', value: '27.55', range: [24, 33], change: '🌙 −10.67% (−3.29) — the biggest single-day drop of the move · ≈26 floor STILL untouched',
      verdict: 'neutral',
      read: 'Down 10.67% (−3.29) to 27.55 — the largest one-day decline of this whole sequence, and still leading VIX lower in percentage terms: NASDAQ stress is unwinding fastest, which is what a genuine regime turn looks like. But the gauge stays NEUTRAL on its own stated terms, not on the direction: the ≈26 range floor this card named is STILL untouched, and 27.55 sits inside a 26–31 band that has capped every attempt since June. VXN own-RSI 49.27 is dead neutral — no momentum edge in vol either way. Read it as fear getting cheaper fast, not fear gone: the flip is a CLOSE under ≈26, which would confirm what VIX already did at 18.'
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
    price: '$539.03 → 🌙 $547.77', change: '🌙 overnight +1.62% → $547.77 · Thu close $539.03 (−7.95%) — gapped to $524.49, bought back ALL day, closed at the session high ON the two-year shelf',
    signal: '🔄 NEW CYCLE — refreshed but NOT RANKED, and that is the honest call: META is the anti-cohort chart, gapped down −7.95% on the same species of capex print that ignited everything else (MSFT’s landed as proof of AI profits; META’s landed as proof of AI spending). The structure is wrecked — below the 9-day $594.88, the 50-day $609.04 and the 200-day $629.63 (a full 17% above price), daily RSI 32.1, the weakest on the board, daily OBV falling. The bull owns exactly one fact, but it is a good one: the TWO-YEAR SHELF held — Thursday gapped to $524.49, was bought back all session, and closed AT the day’s high $539.03 (a hammer on major support), with the overnight adding +1.62% to $547.77 and the 1H basing constructively (OBV recovering, MACD histogram green). A “prove it” chart, not an edge: a real base needs days, and any bounce fights stacked supply — $562 (1H 50-EMA) → the $586 gap origin → $594–609 (9/50-day, the gap-fill zone). The two lines that put it back on the ranked board: a close UNDER $524.49 breaks the shelf and opens the next structural leg down (short candidate); acceptance OVER $562 makes the gap-fill toward $594–609 an evaluable long. Between them: no trade, watch the shelf.',
    edge: '🔄 Not ranked, on purpose: the anti-cohort chart — gapped −7.95% on the capex print MSFT got celebrated for, wrecked structure (below the 9d $594.88 / 50d $609.04 / 200d $629.63, daily RSI 32.1) — against one good bull fact: the two-year shelf HELD, $524.49 bought back to a close at the day’s high $539.03 with overnight +1.62% and the 1H basing; a prove-it chart between two lines — under $524.49 the shelf breaks (short candidate), acceptance over $562 opens the $586/$594–609 gap-fill evaluation; between them, no trade',
    side: 'long', accent: 'blue',
    date: '2026-07-31',
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
    price: '$308.85 → 🌙 $317.24', change: '🌙 pre-market +2.72% → $317.24 · Thu close $308.85 (+3.53%) — still ~22% BELOW its own MA cluster $385–400 · daily Stoch 6.46, the deepest reset on the board',
    signal: '🔄 NEW CYCLE — rejection-only SHORT, and the first thing to say is that TSLA is NOT part of this cohort: no AI-infra squeeze, no MSFT-capex read-through, no Korea gap. It is an idiosyncratic downtrend that happens to be bouncing on the same day, so the SMH $547–550 gate does NOT govern it — its own structure does. And that structure is the most broken on the board: Thursday closed $308.85 with the 9-day $384.79, the 50-day $398.42 and the daily 200-EMA $398.62 stacked ≈22–25% ABOVE price, in one cluster. Nothing on this chart is near a reclaim. The volume tell puts it with CRWV/INTC/AAOI, not with the longs: 1H OBV is ≈ −392M and has NOT improved through the bounce — covering, no demand underneath — while daily OBV keeps sliding. The counter-argument, and it is real: daily Stoch 6.46 is the DEEPEST reset anywhere on this board with RSI 34.41 (weakest but META), price is at the lower band ≈$284–300 having held the 200-week rail, and the pre-market $317.24 is over the 1H 50-EMA $312.30 — so the bounce has room to run further before it meets anything. That is exactly why this is REJECTION-ONLY and not a short here: the nearest real resistance is the 1H 200-EMA ≈$337.67 (falling), roughly 6% up. Plan: fade the rejection in $330–338, confirmed by a 1H close back under $312 (the 50-EMA the bounce is riding). Stop $348. Targets $300 → $285 (lower band) → $270. Dead on a daily close over $348 — above that the bounce becomes a real repair leg and the next stop is the $385–400 wall, which is a different trade entirely.',
    lead: { rank: 22, status: 'wait', entry: 'fade the rejection in $330–338', stop: '$348 (dead >$348 close)', targets: '$300 → $285 → $270', downside: '−19%', rr: '~5:1', rrStar: true, edge: '🔄 The board’s one NON-cohort short — no AI-infra squeeze, no capex read-through, so the SMH gate does not govern it: TSLA is an idiosyncratic downtrend bouncing on the same day, with the 9-day $384.79 / 50-day $398.42 / 200-EMA $398.62 stacked ≈22–25% ABOVE Thursday’s $308.85 close (nothing near a reclaim) and a 1H OBV of ≈ −392M that has NOT improved through the bounce — the CRWV/INTC camp; the real counter is the deepest daily reset on the board (Stoch 6.46, RSI 34.41) off the 200-week rail, so the bounce has room — hence REJECTION-ONLY at the 1H 200-EMA ≈$330–338 (~6% up), confirmed by a 1H close back under $312, stop $348, targets $300 → $285 → $270; dead on a daily close over $348, which turns it into a repair leg toward the $385–400 wall — a different trade' },
    side: 'short', accent: 'red',
    date: '2026-07-31',
    story: 'stories/tsla.html',
  },
  {
    symbol: 'CRWV', exchange: 'NASDAQ',
    price: '$73.90 → 🌙 $78.25', change: '🌙 overnight +5.89% → $78.25 — the TOP of the old $74–78 fade zone · Thu close $73.90 (+21.51%) · 1H OBV STILL −133M',
    signal: '🔄 NEW CYCLE — the board’s designated SHORT-side candidate under the “keep shorts where a setup warrants one” clause, and the weakest chart of everything reviewed pre-open. The daily: price closed $73.90 BELOW every daily MA (9-day $79.34, 50-day $94.75, 200-day $98.89), daily MACD negative under its signal — and daily OBV fell to NEW LOWS through July: the anti-STX. Where Seagate’s OBV held its highs through the whole correction (accumulation), CoreWeave’s kept bleeding (distribution). The 1H is the INTC profile: RSI 72.9, Stoch 95 pinned, price above the 1H upper band $75.04 — and 1H OBV −133M, WORSE than Wednesday’s −130M. A +21.5% day plus +5.9% overnight and the money-flow line never lifted: covering with zero demand underneath. Location: overnight $78.25 is the top of the old $74–78 fade zone with the daily 9-EMA $79.34 and the $81 line stacked just above — the archived rank-1 trigger, now trading. The honest complication: Wednesday’s thesis leaned on “META red and it rallied anyway”; the backdrop has FLIPPED — MSFT’s capex beat is a direct AI-cloud tailwind — so entry discipline is mandatory, not optional. REJECTION ONLY: a fade from $78–81 confirmed by a 1H close back under $74 (zone bottom + 1H 200-EMA $74.82) — never short the vertical. Stop $84 — a reclaim of $81 already stalls the thesis — and over $88 (daily mid-band $88.26 + the old 4H 200-EMA line) the short is simply wrong. Targets: $70.40 → $65 (mid-band) → $59.6 → $49.4. 🚦 Override: if SMH closes over $547–550 AND CRWV reclaims $81, DROP it — an individual short needs an individual failure, and above $81 there is not one.',
    lead: { rank: 16, status: 'wait', entry: 'fade the rejection in $78–81', stop: '$84 (wrong >$88)', targets: '$70.4 → $65 → $59.6 → $49.4', downside: '−38%', rr: '~7:1', rrStar: true, edge: '🔄 The one short kept on the new board, because the chart earns it: the weakest name reviewed — Thu close $73.90 below EVERY daily MA (9d $79.34 / 50d $94.75 / 200d $98.89) with daily OBV at NEW July lows (distribution, the anti-STX) — yet overnight $78.25 sits at the top of the old $74–78 fade zone with 1H OBV at −133M, WORSE than Wednesday: +21.5% + 5.9% overnight and the money-flow never lifted, covering with zero demand; but MSFT’s capex beat flipped the catalyst wind, so REJECTION ONLY — fade $78–81 confirmed by a 1H close back under $74, stop $84 (thesis stalls over $81), wrong over $88, targets $70.4 → $65 → $59.6 → $49.4; if SMH confirms the gate AND $81 reclaims, drop it' },
    side: 'short', accent: 'cyan',
    date: '2026-07-31',
    story: 'stories/crwv.html',
  },
  {
    symbol: 'LITE', exchange: 'NASDAQ',
    price: '$693.24 → 🌙 $733.79', change: '🌙 overnight +5.85% → $733.79 — pushing THROUGH the old $721–732 full-repair zone, ON the 1H 200-EMA $730.36 · Thu close $693.24 (+15.09%)',
    signal: '🔄 NEW CYCLE — the card that took the old cycle’s one loss is now a mid-rank LONG watch, and no bias either way: the discipline that said don’t revenge-short the stop-out also says don’t refuse the long because this name burned us. The chart since the stop: Thursday +15.09% closed $693.24, decisively back above the daily 200-EMA $632.32 — the very line whose break filled the short — and overnight $733.79 is pushing through the old ≈$721–732 “repairs the daily structure outright” zone while sitting exactly on the 1H 200-EMA $730.36, with the daily mid-band $748.45 just above and the 50-day $796.25 beyond. The weekly parabola-unwind thesis is dormant by its own rule (it needs a fresh daily close back under ≈$632; nothing above that re-arms it). Frames: the cohort split again — 1H pinned (RSI 70.7, Stoch 95.7, MACD histogram reddening) against a daily with fuel (RSI 43.6, Stoch ~20 curling up, MACD not yet crossed). The caveat that sets the rank: daily OBV 245M is still scraping its lows — better than CRWV’s new-low bleed, nowhere near STX’s held-highs accumulation. Middle of the pack on demand proof, so middle of the board. The plan: NO chase into a triple test (repair zone + 1H 200-EMA + mid-band $748 overhead) with the 1H pinned. Entry: the pullback that HOLDS $714–721 (9-day EMA $714.43 + repair-zone bottom). Stop: a close back under $693 — Thursday’s close; below it the repair push failed. Hard invalidation: under $665 (the old stop, now the bull/bear memory line) and finally the 200-day $632. Confirmation: a daily CLOSE over $732, then the mid-band $748. Targets: $748 → the 50-day $796 → $869 (upper band / the old July shelf). 🚦 Counts only with SMH closing over $547–550.',
    lead: { rank: 17, status: 'wait', entry: 'pullback holds $714–721', stop: '$693 (hard $665)', targets: '$748 → $796 → $869', downside: '+21%', rr: '~6:1', rrStar: true, edge: '🔄 The old cycle’s one loss returns as a long watch — no revenge bias either way: Thu +15.09% closed $693.24 back above the daily 200-EMA $632.32 (the line whose break filled our short) and overnight $733.79 pushes through the old $721–732 “full repair” zone right on the 1H 200-EMA $730.36, mid-band $748.45 and 50-day $796.25 overhead; 1H pinned (RSI 70.7 / Stoch 95.7) vs daily fuel (RSI 43.6, Stoch ~20) — but daily OBV 245M still scrapes its lows, so mid-rank until demand proves; entry only the pullback that HOLDS $714–721, stop a close under $693 (hard $665), confirmation a daily close over $732 → $748, targets $748 → $796 → $869; 🚦 counts only with SMH over $547–550' },
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
    price: '$249.06 → 🌙 $260.00', change: '🌙 overnight +4.39% → $260.00 — INSIDE the old $252–266 re-load zone, capped by the daily 200-EMA $266.37 · Thu close $249.06 (+12.16%)',
    signal: '🔄 NEW CYCLE — the fourth rejection-only SHORT, at the exact zone its old card drew: overnight $260.00 is INSIDE $252–266 — the “add ONLY on a rejection” re-load band — capped by the daily 200-EMA $266.37, the very line the card called “the slide’s first structural repair,” with the 1H 200-EMA $278.34 above that. The laggard case: the weakest daily RSI reviewed tonight (36.6), daily OBV drifting down, and the 1H OBV pill at ≈27.1M — the SAME reading as Wednesday afternoon: +12% Thursday plus +4.4% overnight added no net money flow on this window. The optics pair sharpens it exactly like AAOI: LITE reclaimed its daily 200-EMA and pushed into its repair zone; COHR is still BELOW its own. Frames: 1H pinned (RSI 70.1, Stoch 95.7) over a floored daily (Stoch 15.4) — fuel exists, demand does not, yet. Plan: entry ONLY on a rejection inside $252–266 confirmed by a 1H close back under $240 (the old confirmation line, unchanged) — that re-opens $240 → $230 → $218 (the AH low shelf). Stop $272 intraday; DEAD on a daily close over $266.37 — both 200-day and repair line reclaim at once, and the laggard graduates to the repair camp like LITE did. 🚦 Override, same as the other shorts: SMH confirms the gate AND $266 prints = dropped.',
    lead: { rank: 20, status: 'wait', entry: 'fade the rejection in $252–266', stop: '$272 (dead >$266 close)', targets: '$240 → $230 → $218', downside: '−16%', rr: '~3:1', rrStar: true, edge: '🔄 The fourth rejection-only short, parked in its own card’s zone: overnight $260 sits INSIDE the old $252–266 re-load band under the daily 200-EMA $266.37 (“the slide’s first structural repair” line) with the 1H 200-EMA $278.34 beyond; the laggard tape — weakest daily RSI of the night (36.6), daily OBV drifting down, 1H OBV ≈27.1M unchanged since Wednesday afternoon through +12% and an up overnight: no money flow arrived — and the optics pair says it plainly: LITE reclaimed its 200-day, COHR has not; entry only a rejection in $252–266 + a 1H close back under $240 → $240 → $230 → $218, stop $272, DEAD on a daily close over $266.37; SMH gate + $266 = dropped' },
    side: 'short', accent: 'violet',
    date: '2026-07-31',
    story: 'stories/cohr.html',
  },
  {
    symbol: 'IREN', exchange: 'NASDAQ',
    price: '$38.26 → 🌙 $40.16', change: '🌙 overnight +4.97% → $40.16 — a dollar and a half under the $41.70–44 decision slab · Thu close $38.26 (+30.54%), the cohort’s biggest day',
    signal: '🔄 NEW CYCLE — repositioned SHORT-side by the desk’s call, and the chart supports it: don’t rush longs on a +35% two-session squeeze trading UNDERNEATH a broken daily. Thursday’s +30.54% was the cohort’s biggest day and overnight $40.16 grinds higher — but price sits below BOTH the 200-day $43.52 and the 50-day $47.67, daily OBV has the weakest recovery of anything reviewed, and the 1H is the hottest non-memory print on the board (RSI 77.5, Stoch rolling off 86). That is the fake-breakout profile: the base case is a grind into the $41.70–44 slab TODAY — the old flip-long line $41.70 + 1H upper band $42.21 + daily 200-EMA $43.52 + mid-band $44.03, all stacked — a failure to CLOSE through it, and a correction toward $39 → $37 next week. The plan: fade the REJECTION in $41.70–44 — confirmed by a 1H close back under $40 — targets $39 → $37 → $35 (the old re-arm line). Stop $45.50 intraday; DEAD on a daily close over $44 — that close clears the entire slab, makes the repair real (IREN does carry the one fundamental driver in the cohort, the ≈$2.8B AI-cloud contract plus MSFT capex), and the correct response is to stand aside and re-assess, not fight it. Within the AI-cloud trio the structure order stays NBIS > IREN > CRWV — IREN is the fade candidate precisely because it ran the furthest of the three above the weakest base. 🚦 Override, same as the other shorts: SMH confirms the gate AND $44 prints = dropped.',
    lead: { rank: 15, status: 'wait', entry: 'fade the rejection in $41.7–44', stop: '$45.50 (dead >$44 close)', targets: '$39 → $37 → $35', downside: '−18%', rr: '~3:1', rrStar: true, edge: '🔄 The fake-breakout fade, by the desk’s call: a +35% two-session squeeze (Thu +30.54%, the cohort’s biggest day; overnight $40.16) grinding UNDER a broken daily — below both the 200-day $43.52 and 50-day $47.67 with the weakest OBV recovery of the reviewed names and the hottest non-memory 1H (RSI 77.5) — into the $41.70–44 slab (old flip line + 1H upper band + 200-day + mid-band); base case: grind today, fail the close, correct $39 → $37 next week — entry only the rejection in $41.70–44 + a 1H close back under $40, stop $45.50, targets $39 → $37 → $35; DEAD on a daily close over $44 (slab cleared = repair real — it does carry the cohort’s one fundamental driver — stand aside, don’t fight); SMH gate + $44 = dropped' },
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
    lead: { rank: 19, status: 'wait', entry: 'fade the rejection in $101–102', stop: '$106 (dead >$102 close)', targets: '$92 → $86.5 → $82', downside: '−19%', tail: '−43%', rr: '~4:1', rrStar: true, edge: '🔄 The third rejection-only short, with the cleanest level: overnight $96.97 runs into a DOUBLE-200 confluence $101–102 (1H 200-EMA $101.20 + daily 200-EMA $101.97) — a test the old card scripted when $92.12 fired; the tell is unchanged — 1H OBV STILL negative (−5.62M vs −6.85M Wednesday, unmoved by +27% in two sessions) with daily OBV falling all July: covering, no demand — and the optics pair sharpens it: LITE already reclaimed its 200-day, AAOI is the laggard below BOTH of its own; entry only a rejection at $101–102 + 1H close back under $92, stop $106 (dead on a daily close over $102 — both 200s reclaimed = repair camp, case gone), targets $92 → $86.5 → $82, tail $58; SMH gate + $102 = dropped' },
    side: 'short', accent: 'violet',
    date: '2026-07-31',
    story: 'stories/aaoi.html',
  },
  {
    symbol: 'WDC', exchange: 'NASDAQ',
    price: '$533.04 → 🌙 $551.70', change: '🌙 overnight +3.50% → $551.70 — THROUGH the $535 decider it closed $1.96 under · Thu close $533.04 (+15.37%) · the SNDK twin script',
    signal: '🔄 NEW CYCLE — long watch, and the SNDK twin script beat for beat: Thursday closed $533.04, exactly $1.96 UNDER its own decider — the card’s line was “a daily close over $535 completes re-negation and restores the long” — and the overnight $551.70 gapped straight through it, plus through the old first objective $544.50, knocking on the $560–585 pre-slide shelf the card already named as the destination. What sets WDC apart in the cohort: the STRONGEST daily frame in memory/storage — daily RSI 49.5 is already back at the midline, highest of the group, because WDC fell least and reclaimed earliest (two of its three re-negation lines taken on WEDNESDAY, a day before everyone else; “deep pullback in an intact weekly uptrend, same family as DELL/STX” is exactly how it traded). And it is accumulation camp: daily OBV ≈650M held near its highs through the entire correction — the STX/MRVL profile, not covering — with 1H OBV rising at 147M confirming. The 1H is pinned like everything else (RSI 73.8, Stoch 92.2): same no-chase rule. The map, from the card’s own lines: $535 flips to support, bracketed by the 1H 50-EMA $531.95 and 9-EMA $540.55 — that is the retest zone; the 1H 200-EMA has risen to $515.71 (the old “$513–514 must hold”), and a 1H close back under it is the fail. Entry: the pullback that HOLDS $532–540. Stop: a 1H close under $515.70. Targets: $560 → $585 (the pre-slide shelf, both ends) → ≈$613 (the daily band top). 🚦 Counts only with SMH closing over $547–550.',
    lead: { rank: 7, status: 'wait', entry: 'pullback holds $532–540', stop: '$515.70 (1H close)', targets: '$560 → $585 → $613', downside: '+14%', rr: '~4:1', rrStar: true, edge: '🔄 The SNDK twin script: Thu closed $533.04 — $1.96 UNDER the card’s own “$535 restores the long” decider — and overnight $551.70 vaulted it plus the old $544.50 objective, knocking on the $560–585 pre-slide shelf; the strongest daily in memory/storage (RSI 49.5 at the midline — fell least, reclaimed earliest, weekly uptrend intact) and accumulation camp (daily OBV ≈650M held near highs all correction, 1H OBV rising); 1H pinned = no chase — entry only the pullback that HOLDS $532–540 ($535 flipped to support, 1H 50/9-EMA bracket), stop a 1H close under $515.70 (the risen old must-hold line), targets $560 → $585 → $613; 🚦 counts only with SMH over $547–550' },
    side: 'long',
    date: '2026-07-31',
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$91.13 → 🌙 $96.21', change: '🌙 overnight +5.57% → $96.21 — EXACTLY on the 1H 200-EMA $96.19, the lip of the old $96–102 negation band · Thu close $91.13 (+11.30%) · 1H OBV −631M, a NEW low',
    signal: '🔄 NEW CYCLE — the board’s second rejection-only SHORT, and the discriminator that defined this card has gotten WORSE, not better. The thesis was “the purest short-covering print in the cohort: OBV −590M, unmoved.” Tonight: 1H OBV −631M — the money-flow line made a NEW LOW while price added +11.30% Thursday and +5.57% overnight, and daily OBV confirms at 2.02B, falling to new July lows off 3.0B. Three sessions of double-digit squeeze, zero net accumulation: still the worst volume signature on the board, worse than CRWV’s. Location: overnight $96.21 sits EXACTLY on the 1H 200-EMA $96.19 — the bottom lip of the old card’s $96–102 negation band, with the daily 50-day $104.45 just beyond it. Every name on the board is at its named decision level tonight; INTC included. Frames: 1H pinned (RSI 71.5, Stoch 92.5, MACD histogram reddening) over a floored daily (RSI 40.5, Stoch 11.6) — but with no demand underneath, “fuel” is the wrong word here; the old rule stands: do NOT flip it long — there is no accumulation in the data, only absent supply — and do not press a short without the trigger either. The trigger, carried over verbatim: a REJECTION inside $96–102 confirmed by a 1H close back under $89 (the retaken gate) — that re-opens $85 → the daily 200-EMA $75 → the 🕳️ $66 gap. A daily close over $102 ends the short case outright. 🚦 Override, same as CRWV: if SMH closes over $547–550 AND $102 prints, drop it — no individual failure, no short.',
    lead: { rank: 18, status: 'wait', entry: 'fade the rejection in $96–102', stop: '$104 (dead >$102 close)', targets: '$85 → $75 → $66', downside: '−33%', rr: '~6:1', rrStar: true, edge: '🔄 The board’s second rejection-only short, kept because its tell got WORSE: 1H OBV −631M made a NEW low through a +11.3% day and +5.6% overnight (was −590M Wednesday — three squeeze sessions, zero accumulation, the worst volume on the board), daily OBV 2.02B falling with it; overnight $96.21 sits exactly on the 1H 200-EMA $96.19 at the lip of the old $96–102 negation band with the 50-day $104.45 beyond; no long ever on this profile, no short without the trigger: rejection inside $96–102 + a 1H close back under $89 re-opens $85 → the 200-day $75 → 🕳️ $66; a daily close over $102 ends it — and if SMH confirms the gate AND $102 prints, drop it' },
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
    price: '$365.49 → 🌙 $379.98', change: '🌙 overnight +3.96% → $379.98 — through the 50-day $370.55 · Thu CLOSED $365.49 (+14.43%) OVER the $362.95 trigger the card named',
    signal: '🔄 NEW CYCLE — long watch whose trigger already FIRED at the close, like NVDA’s: the stopped-out short became a long-watch with one line — “a daily close over $362.95 opens $366.51 → ≈$375” — and Thursday closed $365.49 (+14.43%), through it, with the overnight $379.98 clearing the 50-day EMA $370.55 as well. Structure is among the healthiest on the board: price sits FAR above the daily 200-EMA $297.87 (never threatened), so this was always a pullback inside an intact trend rather than a broken-MA laggard — the STX/DELL family. The daily has room: RSI ≈50 back at the midline, Stoch 40.6 mid-range and rising, MACD −12.85 still closing toward a cross. Two caveats set the rank: daily OBV ≈155M is soft — it drifted through July and has only just ticked up, so demand is adequate rather than proven (nothing like STX’s held highs) — and the 1H is pinned (RSI 71.4, Stoch 96.5, MACD histogram reddening), so a morning shakeout is the base case. Plan: NO chase after +14% and a gap. Entry: the pullback that HOLDS $362–371 — the reclaimed $362.95 spike high through the 50-day $370.55, one zone, now support. Stop: a close under $349 (the 1H 200-EMA $349.25 + the old $352–358 zone floor); below it the reclaim failed and the old fade map ($337 → $326 → $308) re-opens as a FRESH setup, not this plan. Targets: $390 → $403 (the July shelf) → $419. 🚦 Counts only with SMH closing over $547–550.',
    lead: { rank: 11, status: 'wait', entry: 'pullback holds $362–371', stop: '$349 (close)', targets: '$390 → $403 → $419', downside: '+14%', rr: '~3:1', rrStar: true, edge: '🔄 Trigger already fired at the CLOSE, NVDA-style: the card’s “daily close over $362.95” printed Thursday ($365.49, +14.43%) and overnight $379.98 cleared the 50-day $370.55; healthiest family on the board — price far above the daily 200-EMA $297.87, a pullback inside an intact trend, not a broken-MA laggard — with daily RSI back at the midline and Stoch 40.6 rising; the rank is capped by soft daily OBV (≈155M, adequate not proven) and a pinned 1H (RSI 71.4 / Stoch 96.5): entry only the pullback that HOLDS $362–371 (reclaimed spike high through the 50-day, now support), stop a close under $349 — below it the old fade map $337 → $326 → $308 re-opens as a FRESH setup — targets $390 → $403 → $419; 🚦 counts only with SMH over $547–550' },
    side: 'long', accent: 'blue',
    date: '2026-07-30',
    story: 'stories/ter.html',
  },
  {
    symbol: 'GLW', exchange: 'NYSE',
    price: '$135.22 → 🌙 $140.40', change: '🌙 overnight +3.83% → $140.40 — poking over the $137 zone top, into the $142–144 daily MA slab · Thu close $135.22 (+9.00%), INSIDE the old zone',
    signal: '🔄 NEW CYCLE — ranked LAST on purpose: the most two-sided chart on the board, where the two volume frames flatly contradict each other, and the honest thing is to say so rather than pretend conviction. FOR the short: the daily structure is wrecked — Thursday closed $135.22 BELOW every daily MA (9-day $143.84, 50-day $173.08, 200-day $141.88) with daily RSI 36.45, second weakest on the board after META, and daily OBV 297M falling to NEW July lows. That is the AAOI/COHR laggard profile, and the overnight $140.40 runs straight into the same kind of confluence: $141.88 (daily 200-EMA) + $143.84 (9-day) stacked, with the 1H 200-EMA ≈$149.50 beyond. AGAINST the short, and it is not a small argument: 1H OBV is 162M and STILL CLIMBING (149M → 157M → 162M across three sessions) — the strongest money-flow build in the entire cohort, the exact opposite of INTC’s −631M or CRWV’s new lows. Real demand is arriving on the short frame even as the daily bleeds. Where price actually is: Thursday closed INSIDE the old $128–137 re-short zone; no daily close over $137 has printed, and the old card’s own line was “a daily close over $137 says the $115 washout was THE low → repair toward $144 → $150.29.” Plan: fade the REJECTION in $141–144 confirmed by a 1H close back under $137 (the zone top retaken = the failure), targets $130 → $126 → $119 (the late-July low / lower-band shelf). Stop $147; DEAD on a daily close over $144 — with this 1H OBV behind it, that close is more likely than on any other short here, and the correct response is to drop it and re-rate GLW as a repair candidate, not to fight it. 🚦 Override: SMH confirms the gate AND $144 prints = dropped.',
    lead: { rank: 21, status: 'wait', entry: 'fade the rejection in $141–144', stop: '$147 (dead >$144 close)', targets: '$130 → $126 → $119', downside: '−17%', rr: '~5:1', rrStar: true, edge: '🔄 Ranked last because it is the board’s most two-sided chart: the daily is wrecked (Thu closed $135.22 below EVERY daily MA — 9d $143.84 / 50d $173.08 / 200d $141.88 — RSI 36.45, daily OBV 297M at new July lows, the AAOI/COHR profile) while the 1H OBV is 162M and STILL climbing (149M → 157M → 162M, the strongest build in the cohort — the opposite of INTC/CRWV); Thu closed INSIDE the old $128–137 zone, overnight $140.40 pokes the top and runs at the $141.88 + $143.84 daily-MA slab; fade only a rejection in $141–144 + a 1H close back under $137, stop $147, targets $130 → $126 → $119 — and DEAD on a daily close over $144, which this 1H volume makes likelier here than on any other short: drop it and re-rate as repair, do not fight it' },
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
    price: '$58.44 → 🌙 $60.65', change: '🌙 pre-market +3.78% → $60.65 — ON the 1H 200-EMA $60.28 / 9-day $61.01 confluence · Thu close $58.44 (+10.20%) RECLAIMED $56, negating the old short',
    signal: '🔄 NEW CYCLE — the old short is DEAD by its own rule, and the replacement is a rejection watch at the line price is testing right now. The card was built on “a decisive close UNDER $56”; Thursday closed $58.44 (+10.20%), back above it — premise gone, trade closed, nothing to defend. What replaced it: pre-market $60.65 sits ON a tight confluence — the 1H 200-EMA $60.28 plus the daily 9-day $61.01 — the FIRST resistance since the breakdown, and the first thing this bounce has had to prove. Like TSLA, ASTS is not an AI-infra name (satellite/space, no capex read-through), so the SMH $547–550 gate does NOT govern it; its own structure does, and that structure is still laggard: price is below every major MA with the 50-day $76.34 and 200-EMA $76.52 stacked as one wall ≈26% above, and daily OBV has bled from ≈500M to 292M. The other side, stated fairly: daily Stoch 16.67 is curling off the floor with RSI 43.6, and 1H OBV is rising (115M) — this bounce is not empty, it just has not met resistance until now. Plan: fade the rejection in $60–62, confirmed by a 1H close back under $56.90 (session VWAP / the 1H 50-EMA zone — losing it says the bounce failed at its first test). Stop $64. Targets $56 → $52 → $48.42 (the lower band). Dead on a daily close over $62: above it there is air to the mid-band $69.87, and the trade to think about becomes the $76 wall, not this.',
    lead: { rank: 23, status: 'wait', entry: 'fade the rejection in $60–62', stop: '$64 (dead >$62 close)', targets: '$56 → $52 → $48.42', downside: '−21%', rr: '~4:1', rrStar: true, edge: '🔄 Old short DEAD by its own rule — it required “a decisive close under $56” and Thursday closed $58.44 (+10.20%) above it — replaced by a rejection watch at the line price is testing NOW: pre-market $60.65 on the 1H 200-EMA $60.28 / 9-day $61.01 confluence, the first resistance since the breakdown; not an AI-infra name (the SMH gate does not govern it) and still laggard — below every major MA with the 50-day $76.34 + 200-EMA $76.52 stacked ≈26% up and daily OBV bled 500M → 292M — though daily Stoch 16.67 curling and 1H OBV rising 115M say the bounce is not empty; fade $60–62 confirmed by a 1H close back under $56.90, stop $64, targets $56 → $52 → $48.42; dead on a daily close over $62 (air to the mid-band $69.87)' },
    side: 'short', accent: 'violet',
    date: '2026-07-31',
    story: 'stories/asts.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$188.43 → 🌙 $202.53', change: '🌙 overnight +7.48% → $202.53 — through the old ≈$196–200 rejection line, parked under the 50-day $205.37 · Thu close $188.43 (+27.13%)',
    signal: '🔄 NEW CYCLE — a DECISION card, not a dip-buy: NBIS sits at its 50-day EMA $205.37 and the honest position is that the decision has not been made yet. What is settled: the old short-cycle setup is dead — it required “a REJECTION at ≈$196/$200 confirmed by a 30-min close back under $180.01,” and the overnight $202.53 went THROUGH $196 and $200 rather than rejecting from them. A fade setup that gets cleared is a dead setup. What is NOT settled, and this is the part the old card was right about: the deceleration EVIDENCE did not disappear with the setup. The 1H OBV on this window is still NEGATIVE (≈ −65M) — the same covering-not-accumulation signature that put CRWV, INTC, AAOI and COHR on the short side — with the 1H pinned (RSI 73, Stoch 93.9). So the money-flow read here is MIXED, not clean: daily OBV ≈507M held its base while the 1H says the buying is still short-covering. What separates NBIS from its AI-cloud peers, and why it is not simply a short: it NEVER lost the daily 200-EMA $152.35, while CRWV trades below every daily MA and IREN below both its 200- and 50-day. Shorting an intact daily trend into a market that just broke out is a worse trade than shorting a broken one. Hence: no dip-buy. Entry requires ACCEPTANCE over the 50-day — $205–208 held, ideally on a daily CLOSE — which is the event that would finally make the 1H OBV argument moot. Stop: a close back under $191 (the reclaimed 1H 200-EMA); below it the reclaim failed. Targets: $213 (band lip) → $240 (upper band / the old July shelf). ⚠️ The SHORT case stays live and explicit: a REJECTION at $205.37 confirmed by a close back under $180 revives exactly the fade the old card described — negative 1H OBV, rolling Stoch, price back under the line that started the leg. 🚦 Long counts only with SMH closing over $547–550.',
    lead: { rank: 14, status: 'wait', entry: 'acceptance over $205–208', stop: '$191 (close)', targets: '$213 → $240', downside: '+16%', rr: '~2:1', rrStar: true, edge: '🔄 A DECISION card, deliberately demoted: the old fade setup is dead (it needed a REJECTION at $196/$200 and the overnight went THROUGH to $202.53) — but the deceleration EVIDENCE survived it: 1H OBV still NEGATIVE ≈ −65M, the same covering signature as CRWV/INTC/AAOI/COHR, against a daily OBV ≈507M that held its base: MIXED, not clean; what keeps it off the short side is that NBIS never lost the daily 200-EMA $152.35 (CRWV is under every daily MA, IREN under its 200- and 50-day) — shorting an intact trend into a breakout is the worse trade; so NO dip-buy: entry requires ACCEPTANCE over the 50-day $205–208, ideally a daily close, stop a close back under $191, targets $213 → $240 — and the SHORT case stays live: a rejection at $205.37 confirmed by a close under $180 revives the old fade exactly' },
    side: 'long', accent: 'indigo',
    date: '2026-07-31',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$501.77 → 🌙 $525.54', change: '🌙 pre-market +4.74% → $525.54 (4:25 ET — the tape is waking up) — 0.6% under the 50-day $528.77 · Thu close $501.77 (+14.97%)',
    signal: '🔄 NEW CYCLE — long watch in the equipment group the whole relief-buying thesis points at (ASML/LRCX/AMAT/KLAC after a heavy week), and the setup is the tightest test on the board: pre-market $525.54 sits 0.6% under the 50-day EMA $528.77. Not a slab, a single line — it either takes it today or it does not. Structure is the intact-trend family (STX/TER/DELL/WDC), not a laggard: price is far above the daily 200-EMA $400.62, and the daily has a deep reset with fuel — Stoch 16.96 curling off the floor, RSI 47.76 mid-range, MACD −8.92 with the histogram closing toward a cross. The 1H OBV is rising (84.4M) and Thursday’s +14.97% fired the card’s own “fast reclaim of $455–466” — the washout-low call was right and the trade it set up is running. The warning is the usual one: the 1H is pinned (RSI 74.4, Stoch 96.0) into a +4.7% pre-market gap, so a morning shakeout is the base case and the entry. Ladder above the 50-day: the 1H 200-EMA $541.33 → the daily mid-band $550.16 → the $590s, with the band top $634 far beyond. Plan: entry on the pullback that HOLDS $500–510 (Thursday’s close through the 1H 50-EMA ≈$498). Stop: a close under $488. Targets: $529 → $550 → $590. 🚦 Counts only with SMH closing over $547–550.',
    lead: { rank: 9, status: 'wait', entry: 'pullback holds $500–510', stop: '$488 (close)', targets: '$529 → $550 → $590', downside: '+17%', rr: '~5:1', rrStar: true, edge: '🔄 The tightest test on the board: pre-market $525.54 sits 0.6% under the 50-day EMA $528.77 — one line, taken today or not — in the equipment group the relief-buying thesis targets; intact-trend family far above the daily 200-EMA $400.62 with a deep daily reset for fuel (Stoch 16.96 curling, RSI 47.76, MACD histogram closing) and 1H OBV rising 84.4M, after Thursday’s +14.97% fired the card’s own “fast reclaim of $455–466” washout call; the 1H is pinned (RSI 74.4 / Stoch 96.0) into a +4.7% gap, so the shakeout is base case AND entry: holds $500–510 (Thu close through the 1H 50-EMA ≈$498), stop a close under $488, ladder $529 → 1H 200-EMA $541 → mid-band $550 → $590; 🚦 counts only with SMH over $547–550' },
    side: 'long', accent: 'red',
    date: '2026-07-31',
    story: 'stories/amat.html',
  },
  {
    symbol: 'BE', exchange: 'NYSE',
    price: '$207.12 → 🌙 $224.90', change: '🌙 overnight +8.58% → $224.90 — INSIDE the $219–241 decision slab · Thu close $207.12 (+26.49%) RECLAIMED the daily 200-EMA $183.78',
    signal: '🔄 NEW CYCLE — long watch with the cohort’s biggest structural repair AND its most compressed risk/reward, at the same time. The repair: Thursday’s +26.49% bar closed at $207.12, back ABOVE the daily 200-EMA $183.78 — unlike MU/SNDK (whose 200-days sit far below, never lost), BE actually broke its 200-day in the July slide and reclaimed it in ONE day. The compression: BE has already spent its runway — +43% off Tuesday’s $157 low, and the overnight $224.90 is INSIDE the $219–241 decision slab where the old $219–234 distribution shelf (our archived card’s “last re-short standing”), the daily mid-band $232.58 and the 50-day EMA $241.48 all stack — reached with the 1H pinned (RSI 70, Stoch 91) while the daily Stoch sits at 12.7 barely off the floor and daily OBV is still near its lows. MU is knocking on its test with room behind it; BE is already inside its test. Base case: ranged digestion inside $184–241 while the daily catches up. Bull path: a dip that HOLDS $213–217 (the old $213 line + the reclaimed 1H 200-EMA $216.99) keeps the reclaim honest; acceptance — a daily CLOSE — over $241 completes the daily repair and opens the mean-reversion territory above. Invalidation: a daily close back under the 200-day $183.78 voids the entire repair in one stroke. ⚠️ Cohort role: BE is power, not semis — the BREADTH TELL for the whole AI-infra move. BE holding its 200-day reclaim while memory holds its levels = the move is broad; BE failing back under $184 while memory holds = the squeeze is narrowing back to memory only. Worth watching even without a position. 🚦 Counts only with SMH closing over $547–550.',
    lead: { rank: 13, status: 'wait', entry: 'dip holds $213–217', stop: '$204', targets: '$232 → $241 → $250', downside: '+16%', rr: '~3:1', rrStar: true, edge: '🔄 Biggest repair, tightest room: Thu +26.49% reclaimed the daily 200-EMA $183.78 in one bar — the only 200-day reclaim in the cohort — but overnight $224.90 is already INSIDE the $219–241 slab (old distribution shelf + mid-band $232.58 + 50-day $241.48) after +43% off Tuesday’s $157 low, with the 1H pinned (RSI 70 / Stoch 91) and the daily barely off the floor (Stoch 12.7, OBV near lows); base case is $184–241 digestion — the long is only a dip that HOLDS $213–217 (old $213 line + 1H 200-EMA $216.99), stop $204, and a daily CLOSE over $241 completes the repair → $250+; a daily close back under $183.78 voids it all; the cohort’s BREADTH TELL — power confirming or narrowing the AI-infra move; 🚦 counts only with SMH over $547–550' },
    side: 'long', accent: 'amber',
    date: '2026-07-31',
    story: 'stories/be.html',
  },
  {
    symbol: 'ALAB', exchange: 'NASDAQ',
    price: '$299.69 → 🌙 $318.00', change: '🌙 overnight +6.11% → $318.00 — THROUGH the $300–310 decision band, above the 1H 200-EMA $307.05 · Thu close $299.69 (+20.00%), at the band’s lip',
    signal: '🔄 NEW CYCLE — long watch, and the cleanest “card script completed” of the pre-open batch: the old card’s decision band was $300–310 (T1 → the 1H 200-EMA → the old entry), with “a daily close over $310 puts $362 in play” — Thursday closed $299.69 AT the band’s lip and the overnight $318.00 is through it, above the 1H 200-EMA $307.05. This was already the old board’s “one cohort bounce with volume agreeing,” and it still is: 1H OBV keeps rising (62.3M) — accumulation, not covering — while the daily Stochastic at 8.2 is the DEEPEST reset on the entire board: maximum fuel under a structure that just cleared its gate. The warning label is equally extreme: 1H RSI 81.8 is the hottest print of the night, so the no-chase rule applies hardest here — a morning shakeout back into the band is the base case, and it is also the entry. Plan: the pullback that HOLDS $300–310 (the cleared decision band flipping to support). Stop: a 1H close back under $290 — below it $280 re-opens and the breakout failed. Targets: the ≈$324 50-day zone → $340 → $362, the old card’s “full long repair” line. Overhead context: the daily 9/50-day cluster sits ≈$324–340, the real daily fight, with the 200-day far below at $231.82 (never lost). 🚦 Counts only with SMH closing over $547–550.',
    lead: { rank: 10, status: 'wait', entry: 'pullback holds $300–310', stop: '$290 (1H close)', targets: '$324 → $340 → $362', downside: '+19%', rr: '~4:1', rrStar: true, edge: '🔄 The card script completed: the old decision band $300–310 (“a daily close over $310 puts $362 in play”) got closed-at Thursday ($299.69, +20%) and cleared overnight ($318, above the 1H 200-EMA $307.05) — with the volume that made this the old board’s one agreeing bounce still rising (1H OBV 62.3M) and the DEEPEST daily reset on the board (Stoch 8.2) underneath; but 1H RSI 81.8 is the hottest print of the night, so the shakeout back into the band is the base case AND the entry: holds $300–310, stop a 1H close under $290, targets $324 → $340 → $362 (full long repair); 🚦 counts only with SMH over $547–550' },
    side: 'long', accent: 'emerald',
    date: '2026-07-31',
    story: 'stories/alab.html',
  },
  {
    symbol: 'CRDO', exchange: 'NASDAQ',
    price: '$201.08 → 🌙 $212.49', change: '🌙 overnight +5.67% → $212.49 — AT the old $210–213 lid, a whisker under the 1H 200-EMA $214.51 · Thu close $201.08 (+13.32%), just over T1 $200',
    signal: '🔄 NEW CYCLE — long watch, and the structural line that decides its camp is the one CRDO NEVER lost: price closed $201.08, still well above the daily 200-EMA $171.48. That puts it with NBIS (intact long-term structure) rather than with AAOI/COHR/GLW (below everything) — even though it sits under the 9-day $206.97 and the 50-day $220.54. Where it is: the old card mapped one tight lid — T1 $200 → upper band $202.85 → the $203–210 re-short zone → the 1H 200-EMA, “$210–213 one line” — with the rule “a daily close over $213 is the first structural repair → the $220s; only $242 repairs the long.” Thursday closed just over T1 and the overnight $212.49 has walked straight into that line, a whisker under the 1H 200-EMA $214.51. So the old re-short is at its kill-point and the repair test is the live question. Frames: the daily has real fuel — Stoch 14.87 on the floor and curling, RSI 43.5, MACD histogram green and closing on a cross — with 1H OBV rising to 24.8M. The caveat that caps the rank: daily OBV 169M fell hard through July and has only FLATTENED — improving, not proven — and the 1H is pinned again (RSI 70.7, Stoch 96.7), so a shakeout is the base case. Plan: no chase into the lid. Entry: the pullback that HOLDS $200–207 (reclaimed T1 through the 9-day). Stop: a close under $192 (the old $193 confirmation line + the 1H 50-EMA); below it the lid held and the old fade map re-opens as a fresh setup. Confirmation: a daily CLOSE over $213. Targets: the 50-day $220 → the mid-band $228 → $242. 🚦 Counts only with SMH closing over $547–550.',
    lead: { rank: 12, status: 'wait', entry: 'pullback holds $200–207', stop: '$192 (close)', targets: '$220 → $228 → $242', downside: '+19%', rr: '~3:1', rrStar: true, edge: '🔄 The line it never lost decides the camp: Thu closed $201.08 still above the daily 200-EMA $171.48 — NBIS company, not the AAOI/COHR/GLW below-everything camp — while the overnight $212.49 walked into the old “$210–213 one line” lid a whisker under the 1H 200-EMA $214.51, exactly where its card said “a daily close over $213 is the first structural repair”; daily fuel is real (Stoch 14.87 curling off the floor, RSI 43.5, MACD histogram closing) and 1H OBV rising 24.8M, but daily OBV 169M only FLATTENED after a hard July — improving, not proven — with the 1H pinned (RSI 70.7 / Stoch 96.7); entry only the pullback that HOLDS $200–207, stop a close under $192 (old confirmation line — below it the fade map re-opens as a fresh setup), confirmation a daily close over $213, targets $220 → $228 → $242; 🚦 counts only with SMH over $547–550' },
    side: 'long', accent: 'cyan',
    date: '2026-07-31',
    story: 'stories/crdo.html',
  },
  {
    symbol: 'DELL', exchange: 'NYSE',
    price: '$404.81 → 🌙 $409.62', change: '🌙 overnight +1.19% → $409.62 — under the mid-band $411.76 · Thu close $404.81 (+9.51%), holding the reclaimed $402 · 1H RSI 54.9, the LEAST stretched on the board',
    signal: '🔄 NEW CYCLE — long watch with the best RISK profile of the mid-board, because of what it does NOT have: a stretched short frame. 1H RSI is 54.93 and the 1H MACD only 4.08 while every other name on this board sits at 70–82 — like NVDA, DELL never got crowded, so it never had to squeeze, and it has no extension to unwind at the open. The structure is the STX/TER/WDC family, not a laggard: price is far above the 50-day $351.45 and the daily 200-EMA $223.82, and the daily MACD is still POSITIVE (+8.23) — genuinely rare here, where almost everything is climbing out of deep negatives — with daily RSI 49.65 and Stoch 39.53 mid-range. This is a consolidation inside an intact uptrend. The card’s own line fired: $402 RECLAIMED, Thursday closed $404.81 above it, overnight $409.62. The map: the mid-band $411.76 sits immediately overhead, then a clean confluence at $419–424 (1H 200-EMA $423.49 + the daily 9-day $423.79) — that is the real test, and price is under the 9-day until it clears — then the $448.84 band top and the ≈$462.70 July high. Below: $402 is the line to hold, then $396.34, then the lower band $374.68. Plan: entry on the pullback that HOLDS $400–406 (the reclaimed $402 zone). Stop: a close under $393 — below it the reclaim failed. Targets: $424 → $448 → $462. 🚦 Counts only with SMH closing over $547–550.',
    lead: { rank: 8, status: 'wait', entry: 'pullback holds $400–406', stop: '$393 (close)', targets: '$424 → $448 → $462', downside: '+15%', rr: '~6:1', rrStar: true, edge: '🔄 The best risk profile on the mid-board, defined by what it lacks: 1H RSI 54.93 — the LEAST stretched chart here while everything else sits at 70–82 (like NVDA it never got crowded, so nothing to unwind at the open); structure is the STX/TER/WDC family, far above the 50-day $351.45 and 200-EMA $223.82 with the daily MACD still POSITIVE (+8.23), rare in this batch — a consolidation in an intact uptrend, and the card’s $402 line reclaimed (Thu close $404.81, overnight $409.62); the real test is $419–424 (1H 200-EMA $423.49 + daily 9-day $423.79) with the mid-band $411.76 first; entry the pullback that HOLDS $400–406, stop a close under $393, targets $424 → $448 → $462; 🚦 counts only with SMH over $547–550' },
    side: 'long', accent: 'amber',
    date: '2026-07-31',
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
