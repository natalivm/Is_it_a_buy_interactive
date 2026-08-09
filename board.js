// ── Structure board — GENERATED, do not hand-edit ───────────────────────────
// Written by tools/structure.py (see .github/workflows/structure-board.yml).
// Hand edits are overwritten on the next run; change the extractor instead.
//
// A SEPARATE element from the STOCKS cards in data.js. The same ticker may
// appear in both, and they are allowed to disagree: a card carries a traded
// plan (entry, stop, rank), this board carries structure (where demand and
// supply sit, what triggers which way). Neither overwrites the other.
//
// Every field is computed from one OHLC source per the written methodology:
// ATR(14) Wilder, confirmed swings (2 candles each side), displacement-formed
// zones with wick/body boundaries, revisit-and-acceptance strength grading, and
// the bias score  Score = 2W + D + 0.5H + 0.5R + 0.5M + 0.5O + Z.
// `parts` carries each term, so a bias can be checked against its own inputs
// here and in the TSV export — the ticker cell does not render either (see
// below), so this file is where that check happens.
//
// Zones are drawn TWICE. `demand`/`supply` are the daily pass and are the
// board's structure; `demand4h`/`supply4h` are the same rules run on 4H bars,
// nearest two a side, for names that outrun a daily band between refreshes.
// The refinement is never scored — Z, `score`, `position` and the bull/bear
// triggers are all daily, so a score keeps the meaning it had on every earlier
// board. Absent, not empty, where there is no intraday read.
//
// ⚠ THE TICKER CELL IS FOUR LINES, on every row, always: ticker + bold price /
// ATR(14) pair / preferred direction / bias. `price`, `atr`, `atrPct`,
// `preferred` and `bias` are therefore REQUIRED on every row — the renderer
// has no optional branch and the CI board guard fails a row missing one.
// `preferred` is not computed: it is carried from the previous board (see
// CARRY), so a NEW ticker needs one written before its first run.
// Full rationale in CLAUDE.md, "Structure board".
//
// Rows are ordered best-longs-first / best-shorts-last by order_key(), and
// FILE ORDER IS THE ORDER — nothing re-sorts downstream.
const BOARD = {
  "updated": "2026-08-07",
  "generatedBy": "tools/structure.py",
  "method": "Score = 2W + D + 0.5H + 0.5R + 0.5M + 0.5O + Z (W weekly, D daily, H 4H structure; R RSI vs 50; M MACD histogram slope; O OBV slope; Z inside confirmed demand +1 / supply −1)",
  "rows": [
    {
      "ticker": "TEM",
      "date": "2026-08-07",
      "price": 52.05,
      "atr": 3.04,
      "atrPct": 5.83,
      "seeded": true,
      "structure": {
        "m": "neutral",
        "w": "bullish",
        "d": "bullish",
        "h4": "bullish",
        "h4Note": "hand-seeded from a chart read — no 4H series in this feed",
        "why": {
          "d": "strong displacement reclaimed the $49.39 pivot, still under the declining mid-band ~$55.8",
          "w": "weekly mid-band ~$49.60 RECLAIMED after another defence of $41–42"
        }
      },
      "parts": {
        "W": 1,
        "D": 1,
        "H": 1,
        "Z": 0
      },
      "score": null,
      "bias": "Bullish reversal but extended — buy the $49–50 retest; acceptance over $57 is the confirmation.",
      "trendProse": {
        "m": "range / transition",
        "w": "uptrend",
        "d": "uptrend",
        "h4": "strong uptrend"
      },
      "combo": "weekly and daily up together",
      "demand": [
        {
          "lo": 43.5,
          "hi": 45.0,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-08-07",
          "note": "secondary demand"
        },
        {
          "lo": 40.5,
          "hi": 42.0,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-08-07",
          "note": "major daily/weekly demand — defended repeatedly; $41.28 is the line in the sand"
        },
        {
          "lo": 31.0,
          "hi": 33.0,
          "strength": "weak",
          "origin": "thin",
          "since": "2026-08-07",
          "note": "deeper HTF demand"
        }
      ],
      "supply": [
        {
          "lo": 52.5,
          "hi": 54.0,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-08-07",
          "note": "immediate supply and the next decision zone — price is at it"
        },
        {
          "lo": 55.5,
          "hi": 57.0,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-08-07",
          "note": "major daily confirmation zone; the declining daily mid-band ~$55.8 sits inside it"
        },
        {
          "lo": 58.5,
          "hi": 60.5,
          "strength": "weak",
          "origin": "thin",
          "since": "2026-08-07",
          "note": "weekly supply; the monthly mid-band ~$58.3 sits here"
        },
        {
          "lo": 63.0,
          "hi": 65.0,
          "strength": "weak",
          "origin": "thin",
          "since": "2026-08-07",
          "note": "secondary supply; $75–85 is the major HTF band above it"
        }
      ],
      "demand4h": [
        {
          "lo": 49.0,
          "hi": 50.0,
          "strength": "fresh",
          "origin": "strong",
          "since": "2026-08-07",
          "frame": "4h",
          "note": "immediate breakout demand — the $49.39 flip zone"
        },
        {
          "lo": 46.5,
          "hi": 47.5,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-08-07",
          "frame": "4h",
          "note": "stronger 4H/daily demand"
        }
      ],
      "position": "at supply $52.50–54.00 (0.9% above) with 4H demand $49.00–50.00 (3.9% below); daily demand $43.50–45.00, confirmation zone $55.50–57.00",
      "bull": "break $52.50–54.00 → $55.50–57.00; acceptance above $55.50–57.00 opens $58.50–60.50, then $63.00–65.00",
      "bear": "reject $52.50–54.00 and lose $49.00 → $47.50–46.50; daily acceptance below $46.50 opens $45.00–43.50, then $42.00–40.50",
      "retest": "$49.00–50.00 is the first likely retest and the key breakout-flip zone; a deeper normalisation tests $46.50–47.50",
      "longCandidate": "Yes — the only long here with weekly, daily and 4H all bullish together. Take the **$49–50** retest rather than $52+.",
      "longSetup": "Hold or retest **$49–50**, form a 4H higher low and break **$52.50–54** → **$55.50–57**. Clean acceptance above **$55.50–57** opens **$58.50–60.50**, then **$63–65**. A deeper pullback into **$46.50–47.50** with a strong reclaim is also a higher-quality continuation entry.",
      "shortSetup": "Countertrend only while $49 holds. Reject **$52.50–54** and lose **$49** → **$47.50–46.50**. Daily acceptance below **$46.50** opens **$45–43.50**, then **$42–40.50**. Losing **$41.28** with a failed reclaim materially damages the recovery and exposes **$31–33**.",
      "preferred": "**Long preferred** while $49–50 holds",
      "h4": "Broke the $45–47 base through $49.39 with rising OBV, but RSI ~73.6 — extended.",
      "note": "⚠️ ATR(14) CORRECTED 2026-08-09: this row previously carried a visual estimate from the chart read; it now carries the COMPUTED ATR(14) Wilder supplied with the close table, and the Rule B distances below are measured against that. The estimate and the computed value differed enough to matter — $4.00–5.00 estimated vs $3.04 computed, a large overstatement: the $45.00 stop is 1.48 ATR from the zone midpoint, not the 1.00 it was set for. Hand-seeded from a chart read, not a generated run. Price $52.00 is approximate — the read quoted no close, only 'not chasing $52+', so the card's `change` avoids the '📅 CLOSE $X (±Y%)' form. supply4h ABSENT: the read gave two 4H demand edges but no 4H supply band; $75–85 macro supply is recorded here rather than as a fifth band. Score is null because R/M/O cannot be computed without an OHLCV fetch. ⚠️ DIFFERENT SECTOR from the ALOY/MP/USAR/UUUU critical-minerals cluster and deliberately NOT in that direction group — it is the diversifier among the new longs. ⚠️ FLAG FOR VERIFICATION: this read and MP's share a pivot at exactly $49.39 and near-identical $49–50 / $52.50–54 / $40.50–42 / $31–33 bands. Two different names in different sectors landing on the same levels to the cent is possible but improbable; the entries on both rows anchor to it, so it is worth re-checking against the charts before either is taken."
    },
    {
      "ticker": "STX",
      "date": "2026-08-07",
      "price": 812.76,
      "atr": 81.01,
      "atrPct": 9.97,
      "structure": {
        "m": "neutral",
        "w": "bullish",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1702 4H bars",
        "why": {
          "d": "pivots: highs 936.49->921.78, lows 698.99->782.08",
          "w": "pivots: highs 439.73->1145.00, lows 342.00->351.42"
        },
        "bars": {
          "d": 1506,
          "w": 313,
          "m": 73
        }
      },
      "ind": {
        "rsi": 46.02,
        "macdHist": 1.83,
        "obvSlope": 1
      },
      "parts": {
        "W": 1,
        "D": 0,
        "H": 0,
        "R": -1,
        "M": -1,
        "O": 1,
        "Z": 0
      },
      "score": 1.5,
      "bias": "bullish",
      "trend": {
        "w": {
          "score": 6,
          "band": "strong uptrend",
          "S": 1,
          "E": 1,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 57.57,
          "ema50": 550.79,
          "ema200": 258.76,
          "missing": []
        },
        "d": {
          "score": -1,
          "band": "range / transition",
          "S": 0,
          "E": -1,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 46.02,
          "ema50": 837.43,
          "ema200": 595.5,
          "missing": []
        },
        "m": {
          "score": 1,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": 0,
          "M": 1,
          "reach": 4,
          "full": false,
          "rsi": 78.42,
          "ema50": 274.18,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": -2,
          "band": "downtrend",
          "S": 0,
          "E": -1,
          "A": 1,
          "M": -1,
          "reach": 7,
          "full": true,
          "rsi": 46.09,
          "ema50": 849.95,
          "ema200": 753.41,
          "missing": []
        }
      },
      "trendProse": {
        "w": "strong uptrend",
        "d": "range / transition",
        "m": "range / transition",
        "h4": "downtrend"
      },
      "combo": "weekly up, daily range",
      "demand": [
        {
          "lo": 752.8,
          "hi": 786.42,
          "strength": "weak",
          "touches": 8,
          "closesIn": 2,
          "formVol": 1.47,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-05-06"
        },
        {
          "lo": 741.0,
          "hi": 757.16,
          "strength": "weak",
          "touches": 2,
          "closesIn": 2,
          "formVol": 0.87,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2026-05-20"
        },
        {
          "lo": 632.0,
          "hi": 667.98,
          "strength": "tested",
          "touches": 1,
          "closesIn": 0,
          "formVol": 1.91,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-04-29"
        }
      ],
      "supply": [
        {
          "lo": 817.35,
          "hi": 831.99,
          "strength": "weak",
          "touches": 10,
          "closesIn": 4,
          "formVol": 0.94,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2026-05-13"
        },
        {
          "lo": 860.66,
          "hi": 877.73,
          "strength": "weak",
          "touches": 5,
          "closesIn": 0,
          "formVol": 1.18,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-07-13"
        },
        {
          "lo": 915.99,
          "hi": 987.57,
          "strength": "weak",
          "touches": 5,
          "closesIn": 0,
          "formVol": 1.25,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-06-29"
        }
      ],
      "demand4h": [
        {
          "lo": 797.01,
          "hi": 815.98,
          "strength": "weak",
          "touches": 11,
          "closesIn": 6,
          "formVol": 1.37,
          "heavyTouches": 4,
          "origin": "strong",
          "since": "2026-07-20",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 847.06,
          "hi": 875.33,
          "strength": "weak",
          "touches": 12,
          "closesIn": 13,
          "formVol": 1.06,
          "heavyTouches": 3,
          "origin": "thin",
          "since": "2026-07-13",
          "frame": "4h"
        },
        {
          "lo": 949.19,
          "hi": 967.74,
          "strength": "fresh",
          "touches": 0,
          "closesIn": 0,
          "formVol": 1.19,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-06-30",
          "frame": "4h"
        }
      ],
      "position": "between demand $752.80–786.42 (3.2% below) and supply $817.35–831.99 (0.6% above)",
      "bull": "close above $817.35–831.99 → $860.66–877.73",
      "bear": "close below $752.80–786.42 → $632.00–667.98",
      "retest": "a break above $817.35–831.99 likely retests it as support",
      "longCandidate": "Long after confirmed defense of **$786–800**.",
      "longSetup": "Defend **$786–800**, reclaim $815–838 → $885",
      "shortSetup": "Reject **$885–922**, or lose $832 then $818 → $800–786",
      "preferred": "**Neutral — wait for resolution**",
      "h4": "Lost **$842–860**; back inside 4H demand **$797–816**, 4H 50-EMA **$850** overhead.",
      "h4Effect": "Short thesis improves after a 4H close below **$842**, with stronger confirmation below **$818**. Targets remain **$800–786**. Reclaiming $875–900 would delay the short."
    },
    {
      "ticker": "ALOY",
      "date": "2026-08-07",
      "price": 12.27,
      "atr": 1.17,
      "atrPct": 9.54,
      "seeded": true,
      "structure": {
        "m": "bullish",
        "w": "neutral",
        "d": "bullish",
        "h4": "bullish",
        "h4Note": "hand-seeded from a chart read — no 4H series in this feed",
        "why": {
          "d": "strong reversal off the $7–8 lows, approaching the declining mid-band ~$13.4",
          "w": "sharp recovery from the July washout, weekly mid-band ~$11.1 reclaimed"
        }
      },
      "parts": {
        "W": 0,
        "D": 1,
        "H": 1,
        "Z": 0
      },
      "score": null,
      "bias": "Bullish reversal, very extended — take a pullback to $11.8–12.2 or acceptance above $13.5.",
      "trendProse": {
        "m": "uptrend",
        "w": "range / transition",
        "d": "uptrend",
        "h4": "strong uptrend"
      },
      "combo": "daily up, weekly repairing",
      "demand": [
        {
          "lo": 10.6,
          "hi": 11.1,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-08-07",
          "note": "stronger demand; the weekly mid-band sits here"
        },
        {
          "lo": 9.5,
          "hi": 10.0,
          "strength": "weak",
          "origin": "thin",
          "since": "2026-08-07",
          "note": "secondary demand"
        },
        {
          "lo": 8.0,
          "hi": 8.8,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-08-07",
          "note": "major daily/weekly demand — the August rebound base"
        }
      ],
      "supply": [
        {
          "lo": 13.0,
          "hi": 13.5,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-08-07",
          "note": "immediate supply and the daily confirmation zone — price is at it"
        },
        {
          "lo": 14.5,
          "hi": 15.2,
          "strength": "weak",
          "origin": "thin",
          "since": "2026-08-07",
          "note": "secondary supply"
        },
        {
          "lo": 16.0,
          "hi": 16.5,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-08-07",
          "note": "major weekly supply"
        },
        {
          "lo": 18.0,
          "hi": 20.0,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-08-07",
          "note": "major HTF supply"
        }
      ],
      "demand4h": [
        {
          "lo": 11.8,
          "hi": 12.2,
          "strength": "fresh",
          "origin": "strong",
          "since": "2026-08-07",
          "frame": "4h",
          "note": "immediate breakout demand — the first likely retest"
        }
      ],
      "position": "just 0.6% above 4H demand $11.80–12.20 — effectively AT the entry — with supply $13.00–13.50 6.0% above; daily demand $10.60–11.10",
      "bull": "4H acceptance above $13.50 with a held retest of $12.80–13.30 → $14.50–15.20, then $16.00–16.50 and $18.00–20.00",
      "bear": "reject $13.00–13.50 and lose $11.80 → $11.10–10.60; daily acceptance below $10.60 opens $10.00–9.50, then $8.80–8.00",
      "retest": "$11.80–12.20 is the first likely retest after the vertical 4H move; a deeper normalisation reaches $10.60–11.10",
      "longCandidate": "Structurally yes, but not at $12.96. Either a pullback holding **$11.80–12.20**, or 4H acceptance above **$13.50** with a held retest.",
      "longSetup": "Hold **$11.80–12.20**, establish a 4H higher low and accept above **$13.00–13.50** → **$14.50–15.20**, then **$16–16.50** and **$18–20**. A clean break over **$13.50** with a successful retest of **$12.80–13.30** also confirms.",
      "shortSetup": "Countertrend only while momentum holds: reject **$13.00–13.50** and lose **$11.80** → **$11.10–10.60**. Daily acceptance below **$10.60** opens **$10–9.50**, then **$8.80–8**. A spike through $13.50 that immediately loses $12.50–12.80 is a bull-trap warning.",
      "preferred": "**Long preferred** — but do not chase",
      "h4": "Powerful impulsive 4H uptrend with improving OBV, but RSI ~78 — significantly extended.",
      "note": "⚠️ ATR(14) CORRECTED 2026-08-09: this row previously carried a visual estimate from the chart read; it now carries the COMPUTED ATR(14) Wilder supplied with the close table, and the Rule B distances below are measured against that. The estimate and the computed value differed enough to matter — $1.30–1.60 estimated vs $1.17 computed, so the row had been OVERstating volatility. Hand-seeded from a chart read, not a generated run. Price $12.96 is an AFTER-HOURS print supplied with the read, not a regular-session close, which is why the card's `change` and the deck's ТУТ rung both say so instead of using the '📅 CLOSE' form. supply4h ABSENT: the read gave a 4H demand edge but no 4H supply band. Score is null because R/M/O cannot be computed without an OHLCV fetch. ⚠️ ALOY, USAR and UUUU are ONE news-driven cluster — see the direction group."
    },
    {
      "ticker": "MP",
      "date": "2026-08-07",
      "price": 51.11,
      "atr": 3.05,
      "atrPct": 5.96,
      "seeded": true,
      "structure": {
        "m": "bullish",
        "w": "neutral",
        "d": "bullish",
        "h4": "bullish",
        "h4Note": "hand-seeded from a chart read — no 4H series in this feed",
        "why": {
          "d": "bullish reversal, $49.39 reclaimed, pressing the upper daily band ~$53",
          "w": "recovering off $41.28 demand but still under the weekly mid-band $55–56"
        }
      },
      "parts": {
        "W": 0,
        "D": 1,
        "H": 1,
        "Z": 0
      },
      "score": null,
      "bias": "Bullish reversal — buy the $49–50 retest, not $52+; acceptance over $55–57 confirms the weekly.",
      "trendProse": {
        "m": "uptrend",
        "w": "range / transition",
        "d": "uptrend",
        "h4": "strong uptrend"
      },
      "combo": "daily up, weekly repairing",
      "demand": [
        {
          "lo": 44.0,
          "hi": 46.0,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-08-07",
          "note": "daily demand — the more important support if momentum cools"
        },
        {
          "lo": 40.5,
          "hi": 42.0,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-08-07",
          "note": "major weekly/monthly demand — the $41.28 low the recovery started from"
        },
        {
          "lo": 31.0,
          "hi": 33.0,
          "strength": "weak",
          "origin": "thin",
          "since": "2026-08-07",
          "note": "deeper HTF demand"
        }
      ],
      "supply": [
        {
          "lo": 52.5,
          "hi": 54.0,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-08-07",
          "note": "immediate supply — price is pressing it"
        },
        {
          "lo": 55.0,
          "hi": 57.0,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-08-07",
          "note": "major weekly confirmation zone; the weekly mid-band sits here"
        },
        {
          "lo": 60.0,
          "hi": 64.0,
          "strength": "weak",
          "origin": "thin",
          "since": "2026-08-07",
          "note": "secondary supply"
        },
        {
          "lo": 68.0,
          "hi": 72.0,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-08-07",
          "note": "major weekly supply; $75–83 is the macro band above it"
        }
      ],
      "demand4h": [
        {
          "lo": 49.0,
          "hi": 50.0,
          "strength": "fresh",
          "origin": "strong",
          "since": "2026-08-07",
          "frame": "4h",
          "note": "immediate breakout demand — $49.39 flipped from resistance to support"
        },
        {
          "lo": 47.0,
          "hi": 48.5,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-08-07",
          "frame": "4h",
          "note": "stronger 4H demand"
        }
      ],
      "position": "under supply $52.50–54.00 (2.7% above) with 4H demand $49.00–50.00 (2.2% below); daily demand $44.00–46.00, weekly confirmation $55.00–57.00",
      "bull": "break $52.50–54.00 → $55.00–57.00; acceptance above $55–57 opens $60.00–64.00, then $68.00–72.00",
      "bear": "reject $52.50–54.00 and lose $49.00 → $48.50–47.00, then $46.00–44.00; daily acceptance below $44.00 opens $42.00–40.50",
      "retest": "$49.00–50.00 is the first likely retest and the key breakout-flip zone; a deeper normalisation tests $47.00–48.50",
      "longCandidate": "Yes — the cluster's bellwether and the only one with a flipped level beneath it. Take the **$49–50** retest rather than $51.80+.",
      "longSetup": "Hold or retest **$49–50**, form a 4H higher low and break **$52.50–54** → **$55–57**. Clean weekly/4H acceptance above **$55–57** opens **$60–64**, then **$68–72**. A deeper pullback into **$47–48.50** that is strongly reclaimed is also a favourable continuation entry.",
      "shortSetup": "Countertrend only while $49 holds. Reject **$52.50–54** and lose **$49** → **$48.50–47**, then **$46–44**. Daily acceptance below **$44** materially weakens the recovery and opens **$42–40.50**; losing **$40.50–41.30** reopens **$31–33**.",
      "preferred": "**Long preferred** while $49–50 holds",
      "h4": "Impulsive 4H uptrend, $49.39 flipped to support, but RSI ~68–70 — becoming extended.",
      "note": "⚠️ ATR(14) CORRECTED 2026-08-09: this row previously carried a visual estimate from the chart read; it now carries the COMPUTED ATR(14) Wilder supplied with the close table, and the Rule B distances below are measured against that. The estimate and the computed value differed enough to matter — $3.00–3.50 estimated vs $3.05 computed — close. Hand-seeded from a chart read, not a generated run. Price $51.80 is the lower end of the $51.80–52.00 read supplied with the chart; no session close or % was given, so the card's `change` avoids the '📅 CLOSE $X (±Y%)' form. supply4h ABSENT: the read gave two 4H demand edges but no 4H supply band; $75–83 macro supply is recorded here rather than as a fifth band. Score is null because R/M/O cannot be computed without an OHLCV fetch. ⚠️ MP is the LIQUID BELLWETHER of the ALOY/USAR/UUUU cluster — see the direction group; it is also the least extended of the four (4H RSI ~68–70 vs 73/76/78) and the only one with a level that has actually flipped beneath it ($49.39)."
    },
    {
      "ticker": "USAR",
      "date": "2026-08-07",
      "price": 19.33,
      "atr": 1.32,
      "atrPct": 6.82,
      "seeded": true,
      "structure": {
        "m": "bullish",
        "w": "neutral",
        "d": "bullish",
        "h4": "bullish",
        "h4Note": "hand-seeded from a chart read — no 4H series in this feed",
        "why": {
          "d": "bullish reversal off the July low, higher lows, testing the $19–20 breakdown area",
          "w": "recovering from the $13–15 July washout; weekly mid-band ~$19.4 reclaimed, reversal unconfirmed"
        }
      },
      "parts": {
        "W": 0,
        "D": 1,
        "H": 1,
        "Z": 0
      },
      "score": null,
      "bias": "Bullish recovery but extended at supply — take the $17.5–18.2 retest or acceptance over $20.2.",
      "trendProse": {
        "m": "uptrend",
        "w": "range / transition",
        "d": "uptrend",
        "h4": "strong uptrend"
      },
      "combo": "daily up, weekly repairing",
      "demand": [
        {
          "lo": 16.0,
          "hi": 16.7,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-08-07",
          "note": "stronger 4H/daily demand"
        },
        {
          "lo": 14.3,
          "hi": 15.2,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-08-07",
          "note": "major daily/weekly demand — the July washout low"
        },
        {
          "lo": 12.8,
          "hi": 13.5,
          "strength": "weak",
          "origin": "thin",
          "since": "2026-08-07",
          "note": "deeper structural demand"
        }
      ],
      "supply": [
        {
          "lo": 19.5,
          "hi": 20.2,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-08-07",
          "note": "immediate supply and the breakout decision zone — price is at it"
        },
        {
          "lo": 21.5,
          "hi": 22.5,
          "strength": "weak",
          "origin": "thin",
          "since": "2026-08-07",
          "note": "secondary daily supply"
        },
        {
          "lo": 24.0,
          "hi": 25.0,
          "strength": "tested",
          "origin": "thin",
          "since": "2026-08-07",
          "note": "stronger supply"
        },
        {
          "lo": 27.0,
          "hi": 29.0,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-08-07",
          "note": "major weekly supply; $31.28 is the HTF reference above it"
        }
      ],
      "demand4h": [
        {
          "lo": 17.5,
          "hi": 18.2,
          "strength": "fresh",
          "origin": "strong",
          "since": "2026-08-07",
          "frame": "4h",
          "note": "immediate 4H breakout demand — the first likely retest"
        }
      ],
      "position": "at supply $19.50–20.20 (0.9% above) with 4H demand $17.50–18.20 (5.8% below); daily demand $16.00–16.70, major weekly supply $27.00–29.00",
      "bull": "4H acceptance above $20.20 with a held retest of $19.30–20.00 → $21.50–22.50, then $24.00–25.00 and $27.00–29.00",
      "bear": "reject $19.50–20.20 and lose $17.50 → $16.70–16.00; daily acceptance below $16.00 opens $15.20–14.30, and losing $14.30 exposes $13.50–12.80",
      "retest": "$17.50–18.20 is the first likely retest after the stretched 4H run; a shallower one holds $19.00–19.30 if price accepts above $20",
      "longCandidate": "Yes, but not at $19.30–19.50. Either a held retest of **$17.50–18.20**, or 4H acceptance above **$20.20** with a successful retest.",
      "longSetup": "Hold **$17.50–18.20**, form a 4H higher low and break **$19.50–20.20** → **$21.50–22.50**, then **$24–25** and **$27–29**. Alternatively 4H acceptance above **$20.20** with a held retest of **$19.30–20.00** confirms continuation.",
      "shortSetup": "Countertrend only while momentum holds: reject **$19.50–20.20** and lose **$17.50** → **$16.70–16.00**. Daily acceptance below **$16.00** opens **$15.20–14.30**; losing **$14.30** with a failed reclaim exposes **$13.50–12.80**.",
      "preferred": "**Long preferred** on a retest · extended",
      "h4": "Strong impulsive 4H uptrend with expanding OBV, but RSI ~76 — extended into supply.",
      "note": "⚠️ ATR(14) CORRECTED 2026-08-09: this row previously carried a visual estimate from the chart read; it now carries the COMPUTED ATR(14) Wilder supplied with the close table, and the Rule B distances below are measured against that. The estimate and the computed value differed enough to matter — $1.10–1.30 estimated vs $1.32 computed — close. Hand-seeded from a chart read, not a generated run — the next tools/structure.py run replaces it. Price $19.40 is the weekly mid-band level quoted with the chart; the session close and % were not supplied, so the card's `change` deliberately avoids the '📅 CLOSE $X (±Y%)' form rather than inventing one. supply4h is ABSENT rather than empty: the read gave a 4H demand edge but no 4H supply band. Score is null because R/M/O cannot be computed without an OHLCV fetch."
    },
    {
      "ticker": "UUUU",
      "date": "2026-08-07",
      "price": 14.14,
      "atr": 0.89,
      "atrPct": 6.29,
      "seeded": true,
      "structure": {
        "m": "bullish",
        "w": "neutral",
        "d": "bullish",
        "h4": "bullish",
        "h4Note": "hand-seeded from a chart read — no 4H series in this feed",
        "why": {
          "d": "reclaimed the daily mid-band, pressing through $14",
          "w": "corrective from the January peak, but this candle reverses off $10–11"
        }
      },
      "parts": {
        "W": 0,
        "D": 1,
        "H": 1,
        "Z": 0
      },
      "score": null,
      "bias": "Bullish but extended — the better long is a retest of $12.9–13.2 or 4H acceptance over $15.0.",
      "trendProse": {
        "m": "uptrend",
        "w": "range / transition",
        "d": "uptrend",
        "h4": "strong uptrend"
      },
      "combo": "daily up, weekly repairing",
      "demand": [
        {
          "lo": 12.1,
          "hi": 12.5,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-08-07",
          "note": "stronger 4H/daily demand"
        },
        {
          "lo": 10.5,
          "hi": 11.3,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-08-07",
          "note": "major daily/weekly demand — where the weekly reversal started"
        }
      ],
      "supply": [
        {
          "lo": 14.5,
          "hi": 15.0,
          "strength": "weak",
          "origin": "thin",
          "since": "2026-08-07",
          "note": "immediate supply — price is running into it"
        },
        {
          "lo": 16.3,
          "hi": 17.1,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-08-07",
          "note": "major weekly resistance"
        },
        {
          "lo": 19.5,
          "hi": 21.0,
          "strength": "tested",
          "origin": "thin",
          "since": "2026-08-07",
          "note": "higher supply"
        }
      ],
      "demand4h": [
        {
          "lo": 12.9,
          "hi": 13.2,
          "strength": "fresh",
          "origin": "strong",
          "since": "2026-08-07",
          "frame": "4h",
          "note": "immediate 4H breakout demand — the first likely retest"
        }
      ],
      "position": "under supply $14.50–15.00 (2.5% above) with 4H demand $12.90–13.20 (6.6% below); daily demand $12.10–12.50, macro supply $22.50–25.00",
      "bull": "4H acceptance above $15.00 → $16.30–17.10, then $19.50–21.00",
      "bear": "reject $14.50–15.00 and lose $12.90 → $12.50–12.10; daily acceptance below $12.10 opens $11.30–10.50",
      "retest": "$12.90–13.20 is the first likely retest after the 4H run; a deeper pullback tests $12.10–12.50",
      "longCandidate": "Yes, but not here. Take the retest of **$12.90–13.20**, or 4H acceptance above **$15.00** — chasing into $14.50–15.00 with 4H RSI ~73 is the one bad entry.",
      "longSetup": "Hold **$12.90–13.20**, form a 4H higher low and break **$14.50–15.00** → **$16.30–17.10**, then **$19.50–21.00**. A controlled pullback into **$12.10–12.50** with a strong reclaim is the cleaner entry.",
      "shortSetup": "Countertrend only while momentum holds: reject **$14.50–15.00** and lose **$12.90** → **$12.50–12.10**. Daily acceptance below **$12.10** with a failed reclaim opens **$11.30–10.50**. A break over $15 that immediately loses $14.50 is a bull trap.",
      "preferred": "**Long preferred** above $12.9 · extended",
      "h4": "Strong impulsive 4H uptrend with rising OBV, but RSI ~73 — extended, due a retest.",
      "note": "⚠️ ATR(14) CORRECTED 2026-08-09: this row previously carried a visual estimate from the chart read; it now carries the COMPUTED ATR(14) Wilder supplied with the close table, and the Rule B distances below are measured against that. The estimate and the computed value differed enough to matter — $0.85–1.00 estimated vs $0.89 computed — close. Hand-seeded from a chart read, not a generated run — the next tools/structure.py run replaces it. Price $14.21 is the upper end of the $14.14–14.21 read supplied with the chart; the session % was not available, so the card's `change` deliberately does not use the '📅 CLOSE $X (±Y%)' form rather than inventing one. supply4h is ABSENT rather than empty: the chart read gave a 4H demand edge but no 4H supply band, and $14.50–15.00 is filed daily because it carried no frame label. Score is null because R/M/O cannot be computed without an OHLCV fetch."
    },
    {
      "ticker": "AXON",
      "date": "2026-08-07",
      "price": 571.01,
      "atr": 36.86,
      "atrPct": 6.45,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "bullish",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 665.07->564.24, lows 485.75->502.72",
          "w": "pivots: highs 515.80->665.07, lows 402.00->485.75"
        },
        "bars": {
          "d": 1506,
          "w": 313,
          "m": 73
        }
      },
      "ind": {
        "rsi": 55.45,
        "macdHist": 1.848,
        "obvSlope": 1
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": 1,
        "R": 1,
        "M": 1,
        "O": 1,
        "Z": 0
      },
      "score": 2.0,
      "bias": "bullish",
      "trend": {
        "w": {
          "score": 4,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 57.05,
          "ema50": 522.89,
          "ema200": 432.06,
          "missing": []
        },
        "d": {
          "score": 2,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": -1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 55.45,
          "ema50": 514.54,
          "ema200": 519.3,
          "missing": []
        },
        "m": {
          "score": 0,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": 0,
          "M": 0,
          "reach": 4,
          "full": false,
          "rsi": 54.0,
          "ema50": 423.53,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": 6,
          "band": "strong uptrend",
          "S": 1,
          "E": 1,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 54.99,
          "ema50": 537.81,
          "ema200": 496.54,
          "missing": []
        }
      },
      "trendProse": {
        "w": "uptrend",
        "d": "uptrend",
        "m": "range / transition",
        "h4": "strong uptrend"
      },
      "combo": "aligned uptrend — weekly and daily agree",
      "demand": [
        {
          "lo": 560.62,
          "hi": 593.96,
          "strength": "weak",
          "touches": 7,
          "closesIn": 6,
          "formVol": 1.18,
          "heavyTouches": 4,
          "origin": "thin",
          "since": "2026-07-01"
        },
        {
          "lo": 540.93,
          "hi": 555.06,
          "strength": "weak",
          "touches": 11,
          "closesIn": 8,
          "formVol": 2.06,
          "heavyTouches": 6,
          "origin": "strong",
          "since": "2025-12-16"
        },
        {
          "lo": 526.16,
          "hi": 544.51,
          "strength": "tested",
          "touches": 2,
          "closesIn": 1,
          "formVol": 0.76,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-07-29"
        }
      ],
      "supply": [
        {
          "lo": 587.0,
          "hi": 611.21,
          "strength": "weak",
          "touches": 9,
          "closesIn": 14,
          "formVol": 2.29,
          "heavyTouches": 4,
          "origin": "strong",
          "since": "2025-11-07"
        },
        {
          "lo": 608.8,
          "hi": 622.39,
          "strength": "weak",
          "touches": 4,
          "closesIn": 3,
          "formVol": 0.94,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-01-23"
        },
        {
          "lo": 703.03,
          "hi": 740.0,
          "strength": "weak",
          "touches": 2,
          "closesIn": 8,
          "formVol": 5.37,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2025-11-03"
        }
      ],
      "demand4h": [
        {
          "lo": 561.68,
          "hi": 575.88,
          "strength": "weak",
          "touches": 2,
          "closesIn": 1,
          "formVol": 0.98,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2026-08-03",
          "frame": "4h"
        },
        {
          "lo": 521.04,
          "hi": 551.61,
          "strength": "weak",
          "touches": 4,
          "closesIn": 20,
          "formVol": 1.54,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-06-30",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 628.22,
          "hi": 628.22,
          "strength": "structural",
          "touches": null,
          "note": "swing high, no zone formed",
          "frame": "4h"
        }
      ],
      "position": "inside weak demand $560.62–593.96",
      "bull": "close above $587.00–611.21 → $703.03–740.00",
      "bear": "close below $560.62–593.96 → $540.93–555.06",
      "retest": "a break above $587.00–611.21 likely retests it as support",
      "longCandidate": "Nothing before **08-11** — the post-earnings gate. The pre-earnings breakout thesis ($575–585 hold with a 4H higher low) is SUSPENDED, not cancelled and not confirmed: it was written when monthly, weekly and daily all read bullish, and all three are neutral now. Re-read the frames when the gate lapses; $502.72 has to still be intact.",
      "longSetup": "Hold $575–585, or the current $605–610 higher low, then break $620–630 → $650–670, then $695–710. A clean hold above $630 confirms continuation.",
      "shortSetup": "Countertrend only: reject $620–630 and lose $585 → $555–545. Daily acceptance below $545 opens $525–515, then $480–468.",
      "preferred": "**Stand aside to 08-11** — post-earnings",
      "h4": "+9.3% off the 08-06 close — inside 4H demand **$562–576**, 4H 50-EMA **$538** beneath.",
      "h4Effect": "The 4H frame still reads bullish, but on 532.92→564.24 highs and 485.74→502.72 lows — NOT on the $628.22 print, which was the crash bar's own wick and is no longer a confirmed pivot. Price is sitting on a real confluence: 4H demand $514.76–521.97 tested, the 4H 200-EMA $521.18, the lower band $513.50 and the top of daily demand $498.30–520.18. That is the level the row turns on. A 4H close under $502.72 ends the 4H uptrend and hands the frame to the daily neutral, with $498.30–520.18 the only thing under it. Stochastics at 4.09/16.50 means the first bounce is likely mechanical and proves nothing — it is the second test that reads.",
      "note": "TIMING GATE, set 2026-08-07: no entry on this row until the THIRD session after the earnings reaction — 08-06 is day 0, so 08-07 / 08-10 pass and 08-11 is the first actionable session. The levels below stay live and keep being refreshed; the gate governs when a plan may be taken, not what the plan is. It is a date, so it expires by itself: on 08-11 the row goes back to its computed stance, and `preferred` needs rewriting that morning rather than being left to read stale. The reaction bar is identified from the bars themselves — -14.28% on 2.7x median volume, 70 days after the 05-28 report bar and a year on from 2025-08-05, both the same shape."
    },
    {
      "ticker": "AVGO",
      "date": "2026-08-07",
      "price": 427.76,
      "atr": 16.6,
      "atrPct": 3.88,
      "structure": {
        "m": "bullish",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 399.00->398.59, lows 357.80->369.51",
          "w": "pivots: highs 353.14->495.00, lows 289.96->356.43"
        },
        "bars": {
          "d": 1506,
          "w": 313,
          "m": 73
        }
      },
      "ind": {
        "rsi": 64.82,
        "macdHist": 5.381,
        "obvSlope": 1
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": 0,
        "R": 1,
        "M": 1,
        "O": 1,
        "Z": 0
      },
      "score": 1.5,
      "bias": "bullish",
      "trend": {
        "w": {
          "score": 3,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 58.96,
          "ema50": 353.03,
          "ema200": 224.95,
          "missing": []
        },
        "d": {
          "score": 4,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 64.82,
          "ema50": 393.14,
          "ema200": 363.08,
          "missing": []
        },
        "m": {
          "score": 4,
          "band": "uptrend",
          "S": 1,
          "E": 0,
          "A": 0,
          "M": 1,
          "reach": 4,
          "full": false,
          "rsi": 67.21,
          "ema50": 222.88,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": 4,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 73.25,
          "ema50": 395.78,
          "ema200": 385.17,
          "missing": []
        }
      },
      "trendProse": {
        "w": "uptrend",
        "d": "uptrend",
        "m": "uptrend",
        "h4": "uptrend"
      },
      "combo": "aligned uptrend — weekly and daily agree",
      "demand": [
        {
          "lo": 425.05,
          "hi": 428.43,
          "strength": "weak",
          "touches": 4,
          "closesIn": 3,
          "formVol": 0.82,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-05-11"
        },
        {
          "lo": 417.0,
          "hi": 422.01,
          "strength": "weak",
          "touches": 3,
          "closesIn": 4,
          "formVol": 1.25,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-05-26"
        },
        {
          "lo": 371.75,
          "hi": 387.84,
          "strength": "weak",
          "touches": 10,
          "closesIn": 20,
          "formVol": 1.26,
          "heavyTouches": 3,
          "origin": "thin",
          "since": "2026-07-30"
        }
      ],
      "supply": [
        {
          "lo": 479.23,
          "hi": 495.0,
          "strength": "fresh",
          "touches": 0,
          "closesIn": 0,
          "formVol": 2.74,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-06-03"
        }
      ],
      "demand4h": [
        {
          "lo": 418.46,
          "hi": 421.94,
          "strength": "weak",
          "touches": 2,
          "closesIn": 4,
          "formVol": 1.19,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-05-27",
          "frame": "4h"
        },
        {
          "lo": 378.33,
          "hi": 390.21,
          "strength": "weak",
          "touches": 8,
          "closesIn": 26,
          "formVol": 1.28,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2026-07-31",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 435.31,
          "hi": 435.31,
          "strength": "structural",
          "touches": null,
          "note": "swing high, no zone formed",
          "frame": "4h"
        }
      ],
      "position": "inside weak demand $425.05–428.43",
      "bull": "close above $479.23–495.00",
      "bear": "close below $425.05–428.43 → $417.00–422.01",
      "retest": "a break above $479.23–495.00 likely retests it as support",
      "longCandidate": "Trend-following long if **$378–383** holds and price reclaims **$396–405**.",
      "longSetup": "Hold $378–383 and reclaim **$396–405** → $419–425, then $450–466",
      "shortSetup": "Short only after loss and failed reclaim of **$378** → $369–357",
      "preferred": "**Long preferred**",
      "h4": "Trending — **$32** over the 4H 50-EMA **$396**, RSI **73**. Extended, not a fresh entry."
    },
    {
      "ticker": "GOOGL",
      "date": "2026-08-07",
      "price": 354.3,
      "atr": 12.86,
      "atrPct": 3.63,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 375.27->384.48, lows 351.08->314.90",
          "w": "pivots: highs 408.61->375.27, lows 330.20->314.90"
        },
        "bars": {
          "d": 1506,
          "w": 313,
          "m": 73
        }
      },
      "ind": {
        "rsi": 50.75,
        "macdHist": 2.986,
        "obvSlope": 1
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": 0,
        "R": 1,
        "M": -1,
        "O": 1,
        "Z": 0
      },
      "score": 0.5,
      "bias": "neutral",
      "trend": {
        "w": {
          "score": 3,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 53.92,
          "ema50": 312.15,
          "ema200": 214.22,
          "missing": []
        },
        "d": {
          "score": 4,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 50.75,
          "ema50": 353.9,
          "ema200": 322.38,
          "missing": []
        },
        "m": {
          "score": 1,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": 0,
          "M": 1,
          "reach": 4,
          "full": false,
          "rsi": 68.26,
          "ema50": 215.01,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": 4,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 50.6,
          "ema50": 353.06,
          "ema200": 348.5,
          "missing": []
        }
      },
      "trendProse": {
        "w": "uptrend",
        "d": "uptrend",
        "m": "range / transition",
        "h4": "uptrend"
      },
      "combo": "aligned uptrend — weekly and daily agree",
      "demand": [
        {
          "lo": 342.73,
          "hi": 350.34,
          "strength": "weak",
          "touches": 8,
          "closesIn": 7,
          "formVol": 1.63,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-04-27"
        },
        {
          "lo": 335.17,
          "hi": 339.32,
          "strength": "weak",
          "touches": 3,
          "closesIn": 2,
          "formVol": 0.86,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-04-22"
        },
        {
          "lo": 321.5,
          "hi": 334.2,
          "strength": "weak",
          "touches": 7,
          "closesIn": 6,
          "formVol": 1.37,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-07-30"
        }
      ],
      "supply": [
        {
          "lo": 346.0,
          "hi": 359.68,
          "strength": "weak",
          "touches": 3,
          "closesIn": 3,
          "formVol": 1.57,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-07-20"
        },
        {
          "lo": 351.2,
          "hi": 373.65,
          "strength": "weak",
          "touches": 7,
          "closesIn": 6,
          "formVol": 1.62,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-07-15"
        },
        {
          "lo": 384.51,
          "hi": 393.88,
          "strength": "weak",
          "touches": 2,
          "closesIn": 0,
          "formVol": 1.23,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2026-05-27"
        }
      ],
      "demand4h": [
        {
          "lo": 340.0,
          "hi": 354.31,
          "strength": "tested",
          "touches": 1,
          "closesIn": 1,
          "formVol": 1.62,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-07-31",
          "frame": "4h"
        },
        {
          "lo": 354.21,
          "hi": 359.48,
          "strength": "weak",
          "touches": 7,
          "closesIn": 13,
          "formVol": 0.77,
          "heavyTouches": 3,
          "origin": "thin",
          "since": "2026-07-02",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 360.78,
          "hi": 366.74,
          "strength": "weak",
          "touches": 8,
          "closesIn": 11,
          "formVol": 1.34,
          "heavyTouches": 4,
          "origin": "strong",
          "since": "2026-06-09",
          "frame": "4h"
        },
        {
          "lo": 366.65,
          "hi": 378.55,
          "strength": "weak",
          "touches": 7,
          "closesIn": 18,
          "formVol": 1.85,
          "heavyTouches": 3,
          "origin": "strong",
          "since": "2026-07-15",
          "frame": "4h"
        }
      ],
      "position": "inside weak supply $346.00–359.68",
      "bull": "close above $346.00–359.68 → $384.51–393.88",
      "bear": "close below $342.73–350.34 → $335.17–339.32",
      "retest": "a break above $346.00–359.68 likely retests it as support",
      "longCandidate": "Long-first, but a pullback that holds **$333–340** is cleaner than chasing near **$356**.",
      "longSetup": "**Pullback long:** hold $333–340, form a 4H higher low and reclaim **$350–359** → $376. **Breakout long:** daily close above **$376**, then a successful retest → $390–405",
      "shortSetup": "Repeated failure below **$358–376**, followed by loss of **$333**, opens $326–321; below $321 → **$318–312**",
      "preferred": "**Long preferred**, but do not chase",
      "h4": "Coiled on the 4H 50-EMA **$353**, RSI back to **51**, under 4H supply **$361–367**."
    },
    {
      "ticker": "LLY",
      "date": "2026-08-07",
      "price": 1185.71,
      "atr": 42.27,
      "atrPct": 3.57,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 1189.07->1232.00, lows 1139.00->1109.15",
          "w": "pivots: highs 1133.95->1249.45, lows 977.12->850.51"
        },
        "bars": {
          "d": 1506,
          "w": 313,
          "m": 73
        }
      },
      "ind": {
        "rsi": 53.71,
        "macdHist": -2.652,
        "obvSlope": -1
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": 0,
        "R": 1,
        "M": 1,
        "O": -1,
        "Z": 0
      },
      "score": 0.5,
      "bias": "neutral",
      "trend": {
        "w": {
          "score": 4,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 62.02,
          "ema50": 1012.66,
          "ema200": 745.05,
          "missing": []
        },
        "d": {
          "score": 3,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 53.71,
          "ema50": 1141.83,
          "ema200": 1027.18,
          "missing": []
        },
        "m": {
          "score": 1,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": 0,
          "M": 1,
          "reach": 4,
          "full": false,
          "rsi": 65.71,
          "ema50": 734.36,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": 4,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 54.59,
          "ema50": 1167.32,
          "ema200": 1095.6,
          "missing": []
        }
      },
      "trendProse": {
        "w": "uptrend",
        "d": "uptrend",
        "m": "range / transition",
        "h4": "uptrend"
      },
      "combo": "aligned uptrend — weekly and daily agree",
      "demand": [
        {
          "lo": 1153.5,
          "hi": 1173.91,
          "strength": "weak",
          "touches": 2,
          "closesIn": 2,
          "formVol": 0.66,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-07-22"
        },
        {
          "lo": 1079.22,
          "hi": 1120.49,
          "strength": "tested",
          "touches": 2,
          "closesIn": 1,
          "formVol": 1.47,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-06-23"
        },
        {
          "lo": 1052.08,
          "hi": 1080.36,
          "strength": "weak",
          "touches": 9,
          "closesIn": 13,
          "formVol": 1.44,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-06-03"
        }
      ],
      "supply": [
        {
          "lo": 1210.02,
          "hi": 1230.0,
          "strength": "tested",
          "touches": 2,
          "closesIn": 1,
          "formVol": 1.07,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-07-29"
        }
      ],
      "demand4h": [
        {
          "lo": 1183.45,
          "hi": 1202.34,
          "strength": "weak",
          "touches": 4,
          "closesIn": 2,
          "formVol": 0.78,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2026-07-27",
          "frame": "4h"
        },
        {
          "lo": 1100.98,
          "hi": 1117.95,
          "strength": "weak",
          "touches": 3,
          "closesIn": 2,
          "formVol": 1.57,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-06-24",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 1184.47,
          "hi": 1193.0,
          "strength": "weak",
          "touches": 8,
          "closesIn": 4,
          "formVol": 0.82,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2026-07-10",
          "frame": "4h"
        },
        {
          "lo": 1217.6,
          "hi": 1232.0,
          "strength": "weak",
          "touches": 3,
          "closesIn": 0,
          "formVol": 1.02,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2026-07-28",
          "frame": "4h"
        }
      ],
      "position": "between demand $1,153.50–1,173.91 (1.0% below) and supply $1,210.02–1,230.00 (2.1% above)",
      "bull": "close above $1,210.02–1,230.00",
      "bear": "close below $1,153.50–1,173.91 → $1,079.22–1,120.49",
      "retest": "a break above $1,210.02–1,230.00 likely retests it as support",
      "longCandidate": "Long from **$1,119–1,130** demand after a higher low and reclaim of **$1,175**.",
      "longSetup": "Hold $1,119–1,130 and reclaim **$1,175** → $1,200–1,250",
      "shortSetup": "Short only after loss and failed reclaim of **$1,119** → $1,050",
      "preferred": "**Long preferred**",
      "h4": "Back over the 4H 50-EMA **$1,167**, RSI **55** — under supply **$1,210–1,230**."
    },
    {
      "ticker": "MSFT",
      "date": "2026-08-07",
      "price": 499.99,
      "atr": 15.82,
      "atrPct": 3.16,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 395.57->405.99, lows 373.35->377.39",
          "w": "pivots: highs 413.05->466.32, lows 356.28->349.20"
        },
        "bars": {
          "d": 1506,
          "w": 313,
          "m": 73
        }
      },
      "ind": {
        "rsi": 78.13,
        "macdHist": 11.299,
        "obvSlope": 1
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": 0,
        "R": 1,
        "M": -1,
        "O": 1,
        "Z": 0
      },
      "score": 0.5,
      "bias": "neutral",
      "trend": {
        "w": {
          "score": 2,
          "band": "uptrend",
          "S": 0,
          "E": 0,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 65.44,
          "ema50": 429.54,
          "ema200": 392.49,
          "missing": []
        },
        "d": {
          "score": 2,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": -1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 78.13,
          "ema50": 416.39,
          "ema200": 425.81,
          "missing": []
        },
        "m": {
          "score": 0,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": 0,
          "M": 0,
          "reach": 4,
          "full": false,
          "rsi": 57.92,
          "ema50": 389.72,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": 4,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 77.37,
          "ema50": 431.65,
          "ema200": 413.36,
          "missing": []
        }
      },
      "trendProse": {
        "w": "uptrend",
        "d": "uptrend",
        "m": "range / transition",
        "h4": "uptrend"
      },
      "combo": "aligned uptrend — weekly and daily agree",
      "demand": [
        {
          "lo": 496.72,
          "hi": 502.98,
          "strength": "weak",
          "touches": 4,
          "closesIn": 4,
          "formVol": 1.07,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2025-09-10"
        },
        {
          "lo": 432.44,
          "hi": 451.1,
          "strength": "fresh",
          "touches": 0,
          "closesIn": 0,
          "formVol": 1.71,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-07-30"
        },
        {
          "lo": 413.02,
          "hi": 424.82,
          "strength": "weak",
          "touches": 7,
          "closesIn": 8,
          "formVol": 1.65,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-05-26"
        }
      ],
      "supply": [
        {
          "lo": 498.23,
          "hi": 511.6,
          "strength": "weak",
          "touches": 7,
          "closesIn": 3,
          "formVol": 1.29,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2025-11-14"
        },
        {
          "lo": 517.81,
          "hi": 529.32,
          "strength": "weak",
          "touches": 4,
          "closesIn": 4,
          "formVol": 1.34,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2025-10-31"
        }
      ],
      "demand4h": [
        {
          "lo": 485.68,
          "hi": 496.36,
          "strength": "tested",
          "touches": 1,
          "closesIn": 0,
          "formVol": 1.01,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-08-05",
          "frame": "4h"
        },
        {
          "lo": 450.37,
          "hi": 455.3,
          "strength": "fresh",
          "touches": 0,
          "closesIn": 0,
          "formVol": 2.09,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-07-30",
          "frame": "4h"
        }
      ],
      "position": "inside weak demand $496.72–502.98",
      "bull": "close above $498.23–511.60 → $517.81–529.32",
      "bear": "close below $496.72–502.98 → $432.44–451.10",
      "retest": "a break above $498.23–511.60 likely retests it as support",
      "longCandidate": "Long-first, but wait: either a pullback into **$449–451** or **$432–438** with a 4H higher low, or a **$482** break with a successful retest.",
      "longSetup": "**Breakout:** close above **$482**, then hold/retest $466–482 → **$500–505**, then **$537–550**. **Pullback:** defend $432–438 or $419–423, form a 4H higher low and reclaim the zone → **$466–482**",
      "shortSetup": "Loss of **$432** → $419–423. A short only becomes structurally clean after a close below **$419** and a failed reclaim → **$400–389**",
      "preferred": "**Long preferred** — do not chase the gap",
      "h4": "**$500** against a 4H 50-EMA of **$432** and RSI **77** — extended; do not chase."
    },
    {
      "ticker": "NOW",
      "date": "2026-08-07",
      "price": 124.88,
      "atr": 6.76,
      "atrPct": 5.41,
      "structure": {
        "m": "bearish",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 113.03->118.36, lows 91.53->106.05",
          "w": "pivots: highs 139.20->113.79, lows 89.39->91.53"
        },
        "bars": {
          "d": 1506,
          "w": 313,
          "m": 73
        }
      },
      "ind": {
        "rsi": 67.02,
        "macdHist": 1.839,
        "obvSlope": 1
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": 0,
        "R": 1,
        "M": 1,
        "O": 1,
        "Z": 0
      },
      "score": 1.5,
      "bias": "bullish",
      "trend": {
        "w": {
          "score": -2,
          "band": "downtrend",
          "S": 0,
          "E": -1,
          "A": -1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 55.83,
          "ema50": 126.76,
          "ema200": 138.98,
          "missing": []
        },
        "d": {
          "score": 2,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": -1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 67.02,
          "ema50": 106.92,
          "ema200": 122.36,
          "missing": []
        },
        "m": {
          "score": -4,
          "band": "downtrend",
          "S": -1,
          "E": 0,
          "A": 0,
          "M": -1,
          "reach": 4,
          "full": false,
          "rsi": 45.51,
          "ema50": 136.76,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": 4,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 69.8,
          "ema50": 109.51,
          "ema200": 107.94,
          "missing": []
        }
      },
      "trendProse": {
        "w": "downtrend",
        "d": "uptrend",
        "m": "downtrend",
        "h4": "uptrend"
      },
      "combo": "countertrend bounce — usually better used to find a short",
      "demand": [
        {
          "lo": 115.71,
          "hi": 119.9,
          "strength": "fresh",
          "touches": 0,
          "closesIn": 0,
          "formVol": 0.86,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-08-05"
        },
        {
          "lo": 106.57,
          "hi": 113.19,
          "strength": "weak",
          "touches": 10,
          "closesIn": 14,
          "formVol": 1.35,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-03-03"
        },
        {
          "lo": 103.84,
          "hi": 106.32,
          "strength": "weak",
          "touches": 4,
          "closesIn": 5,
          "formVol": 0.69,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-02"
        }
      ],
      "supply": [
        {
          "lo": 134.61,
          "hi": 138.19,
          "strength": "weak",
          "touches": 2,
          "closesIn": 2,
          "formVol": 2.37,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-01-14"
        },
        {
          "lo": 141.8,
          "hi": 147.35,
          "strength": "tested",
          "touches": 1,
          "closesIn": 0,
          "formVol": 1.68,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-01-09"
        },
        {
          "lo": 146.51,
          "hi": 149.81,
          "strength": "tested",
          "touches": 1,
          "closesIn": 0,
          "formVol": 1.12,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-01-06"
        }
      ],
      "demand4h": [
        {
          "lo": 116.18,
          "hi": 117.19,
          "strength": "tested",
          "touches": 1,
          "closesIn": 0,
          "formVol": 1.11,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-08-05",
          "frame": "4h"
        },
        {
          "lo": 109.21,
          "hi": 110.62,
          "strength": "tested",
          "touches": 1,
          "closesIn": 1,
          "formVol": 2.15,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-07-28",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 139.2,
          "hi": 139.2,
          "strength": "structural",
          "touches": null,
          "note": "swing high, no zone formed",
          "frame": "4h"
        }
      ],
      "position": "between demand $115.71–119.90 (4.0% below) and supply $134.61–138.19 (7.8% above)",
      "bull": "close above $134.61–138.19 → $141.80–147.35",
      "bear": "close below $115.71–119.90 → $106.57–113.19",
      "retest": "a break above $134.61–138.19 likely retests it as support",
      "longCandidate": "The preferred side while **$103–106** holds, but countertrend to the monthly and weekly — sell into supply rather than holding for the reversal.",
      "longSetup": "Hold or reclaim **$106–108**, form a 4H higher low and break **$112–114** → **$116–118**, then **$123–126**. Daily acceptance above **$118** strengthens the long; sustained acceptance above **$123–126** would mark a larger trend reversal and open **$136–138**.",
      "shortSetup": "Rejection from **$116–118** with a 4H lower high → $108–106, then $105–103. The higher-quality swing short is a rejection of the falling 200-day at **$123–126**. A breakdown short needs a daily close below **$103–104** and a failed reclaim → **$99–101**, then **$94–96**.",
      "preferred": "**Tactical long preferred** above $103–106",
      "h4": "Uptrend intact — **$15** over the 4H 50-EMA **$110**, RSI **70**; supply **$135–138** next.",
      "h4Effect": "This is the frame carrying the long. Holding $103–105 keeps the tactical long live; a 4H break of **$112–114** opens $116–118, while losing the cluster hands the read back to the weekly downtrend."
    },
    {
      "ticker": "PLTR",
      "date": "2026-08-07",
      "price": 172.01,
      "atr": 8.96,
      "atrPct": 5.21,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 136.88->132.41, lows 120.73->117.89",
          "w": "pivots: highs 163.70->138.90, lows 122.68->106.37"
        },
        "bars": {
          "d": 1470,
          "w": 306,
          "m": 72
        }
      },
      "ind": {
        "rsi": 72.83,
        "macdHist": 4.79,
        "obvSlope": 1
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": 0,
        "R": 1,
        "M": 1,
        "O": 1,
        "Z": 0
      },
      "score": 1.5,
      "bias": "bullish",
      "trend": {
        "w": {
          "score": 2,
          "band": "uptrend",
          "S": 0,
          "E": 0,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 60.73,
          "ema50": 140.29,
          "ema200": 90.82,
          "missing": []
        },
        "d": {
          "score": 2,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": -1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 72.83,
          "ema50": 134.89,
          "ema200": 141.65,
          "missing": []
        },
        "m": {
          "score": 0,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": 0,
          "M": 0,
          "reach": 4,
          "full": false,
          "rsi": 62.79,
          "ema50": 89.2,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": 2,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": -1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 77.91,
          "ema50": 136.88,
          "ema200": 137.76,
          "missing": []
        }
      },
      "trendProse": {
        "w": "uptrend",
        "d": "uptrend",
        "m": "range / transition",
        "h4": "uptrend"
      },
      "combo": "aligned uptrend — weekly and daily agree",
      "demand": [
        {
          "lo": 165.88,
          "hi": 168.45,
          "strength": "weak",
          "touches": 5,
          "closesIn": 3,
          "formVol": 0.63,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2025-11-28"
        },
        {
          "lo": 129.18,
          "hi": 134.19,
          "strength": "weak",
          "touches": 9,
          "closesIn": 21,
          "formVol": 1.28,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2026-02-25"
        },
        {
          "lo": 120.27,
          "hi": 122.26,
          "strength": "fresh",
          "touches": 0,
          "closesIn": 0,
          "formVol": 2.46,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-07-30"
        }
      ],
      "supply": [
        {
          "lo": 166.98,
          "hi": 177.29,
          "strength": "weak",
          "touches": 7,
          "closesIn": 14,
          "formVol": 1.19,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2026-01-23"
        },
        {
          "lo": 177.02,
          "hi": 188.5,
          "strength": "weak",
          "touches": 5,
          "closesIn": 26,
          "formVol": 1.24,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-01-14"
        }
      ],
      "demand4h": [
        {
          "lo": 158.25,
          "hi": 162.05,
          "strength": "tested",
          "touches": 1,
          "closesIn": 0,
          "formVol": 1.7,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-08-05",
          "frame": "4h"
        }
      ],
      "position": "inside weak supply $166.98–177.29",
      "bull": "close above $166.98–177.29",
      "bear": "close below $165.88–168.45 → $129.18–134.19",
      "retest": "a break above $166.98–177.29 likely retests it as support",
      "longCandidate": "The board’s strongest long structure — weekly now confirms (reclaimed the mean, OBV turning up), not just the daily gap. Still not a chase: the best entry is a controlled $155–160 hold, a deeper $145–150 retest, or a confirmed breakout-retest above $170.",
      "longSetup": "**Momentum:** hold $155–160, form a higher low, reclaim $162–165 → $170, then $175–182. **Deeper pullback:** retest $145–150 (the gap open), hold it, reclaim $152–155 → $165–170, then $175–182. **Breakout:** daily acceptance above $170 with a successful $164–170 retest → $175–182, then $190–205.",
      "shortSetup": "**Bull-trap:** trade above $165–170, fail to hold, close back below $158–160 → $150, then $145. **Gap-failure:** daily close below $145 with a failed reclaim → $136–140, then $123–130.",
      "preferred": "**Long preferred** — do not chase",
      "h4": "Through **$170** into supply **$167–177**, 4H RSI **78**; **$158–162** is the first support.",
      "h4Effect": "The 08-04 gap is why this row has no 4H zone near price: the frame has no traded bar between ~$137 and $145, so every zone the displacement left sits below the gap and outside the cap. The nearest CONFIRMED 4H swing low is $132.42 — the 08-06 low $152.70 is one bar young and not structure yet, which is the honest state of a name three sessions off a 15% gap. Overhead is the $163.69 swing and the $166.06 high; price is inside daily supply $153.24–161.08 with the 4H histogram already negative. Rejection under $160 puts $152.70 in play, and under it there is air to $137."
    },
    {
      "ticker": "LRCX",
      "date": "2026-08-07",
      "price": 311.35,
      "atr": 24.12,
      "atrPct": 7.75,
      "seeded": true,
      "structure": {
        "m": "bullish",
        "w": "bullish",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "hand-seeded from a chart read — no 4H series in this feed",
        "why": {
          "d": "basing $290–320 under the daily mid-band, no directional break",
          "w": "primary uptrend intact; the correction was bought at $277–290"
        }
      },
      "parts": {
        "W": 1,
        "D": 0,
        "H": 0,
        "Z": 0
      },
      "score": null,
      "bias": "Neutral. Wait for 4H acceptance outside $299.5–324; mid-range is not an entry.",
      "trendProse": {
        "m": "uptrend",
        "w": "uptrend",
        "d": "range / transition",
        "h4": "range / transition"
      },
      "combo": "weekly up, daily range",
      "demand": [
        {
          "lo": 276.8,
          "hi": 289.5,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-07-31",
          "note": "major weekly demand — where the correction was bought"
        },
        {
          "lo": 250.0,
          "hi": 266.0,
          "strength": "weak",
          "origin": "thin",
          "since": "2026-07-31",
          "note": "secondary HTF demand"
        }
      ],
      "supply": [
        {
          "lo": 349.0,
          "hi": 360.0,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-07-31",
          "note": "major daily supply"
        },
        {
          "lo": 390.99,
          "hi": 441.7,
          "strength": "tested",
          "origin": "strong",
          "since": "2026-07-31",
          "note": "major weekly/monthly supply — the macro rejection"
        }
      ],
      "demand4h": [
        {
          "lo": 299.5,
          "hi": 305.5,
          "strength": "weak",
          "origin": "thin",
          "since": "2026-08-07",
          "frame": "4h",
          "note": "immediate 4H demand — the lower edge of the compression"
        }
      ],
      "supply4h": [
        {
          "lo": 318.0,
          "hi": 324.0,
          "strength": "weak",
          "origin": "thin",
          "since": "2026-08-07",
          "frame": "4h",
          "note": "immediate 4H supply — the upper edge of the compression"
        }
      ],
      "position": "between 4H demand $299.50–305.50 (3.8% below) and 4H supply $318.00–324.00 (2.1% above); daily demand $276.80–289.50, daily supply $349.00–360.00",
      "bull": "close above $318.00–324.00 → $349.00–360.00, then $390.99",
      "bear": "close below $299.50 → $289.00–277.00; daily acceptance below $276.80 opens $266.00–250.00",
      "retest": "if the compression resolves lower, $299.50–305.50 is the first retest; on an upside break, $318.00–324.00 should become the first support",
      "longCandidate": "Only after 4H acceptance above **$324**. A deeper sweep into **$276.80–289.50** with a strong reclaim is the higher-quality HTF entry.",
      "longSetup": "Hold **$299.50–305.50**, form a 4H higher low and accept above **$318–324** → **$349–360**, then **$390.99**. A sweep into **$276.80–289.50** followed by a strong reclaim is the better HTF long.",
      "shortSetup": "Reject **$318–324** and lose **$299.50** → **$289–277**. Daily acceptance below **$276.80** with a failed reclaim opens **$266–250**. A break above $324 that immediately loses $318 is a bull trap.",
      "preferred": "**Neutral — wait for $299.5/$324 trigger**",
      "h4": "Compression $300–324; slight recovery structure, no confirmed breakout either way.",
      "note": "⚠️ ATR(14) CORRECTED 2026-08-09: this row previously carried a visual estimate from the chart read; it now carries the COMPUTED ATR(14) Wilder supplied with the close table, and the Rule B distances below are measured against that. The estimate and the computed value differed enough to matter — $20–22 estimated vs $24.12 computed, so the row had been understating volatility. Hand-seeded from a chart read on the 08-07 close, not a generated run — the next tools/structure.py run replaces it. Zone frames: $299.50–305.50 and $318.00–324.00 are the 4H pass; $276.80–289.50 / $250–266 and $349–360 / $390.99–441.70 are the daily and HTF passes. Score is null because the oscillator terms (R/M/O) cannot be computed without an OHLCV fetch."
    },
    {
      "ticker": "INTC",
      "date": "2026-08-07",
      "price": 101.65,
      "atr": 8.09,
      "atrPct": 7.96,
      "structure": {
        "m": "neutral",
        "w": "bullish",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 116.77->106.85, lows 89.59->81.79",
          "w": "pivots: highs 132.75->142.35, lows 40.63->98.33"
        },
        "bars": {
          "d": 1506,
          "w": 313,
          "m": 73
        }
      },
      "ind": {
        "rsi": 50.14,
        "macdHist": 1.614,
        "obvSlope": -1
      },
      "parts": {
        "W": 1,
        "D": 0,
        "H": 0,
        "R": 1,
        "M": 1,
        "O": -1,
        "Z": 0
      },
      "score": 2.5,
      "bias": "bullish",
      "trend": {
        "w": {
          "score": 6,
          "band": "strong uptrend",
          "S": 1,
          "E": 1,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 55.82,
          "ema50": 71.74,
          "ema200": 46.65,
          "missing": []
        },
        "d": {
          "score": 0,
          "band": "range / transition",
          "S": 0,
          "E": -1,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 50.14,
          "ema50": 103.01,
          "ema200": 76.46,
          "missing": []
        },
        "m": {
          "score": 1,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": 0,
          "M": 1,
          "reach": 4,
          "full": false,
          "rsi": 64.69,
          "ema50": 49.15,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": 2,
          "band": "uptrend",
          "S": 0,
          "E": 0,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 56.71,
          "ema50": 101.18,
          "ema200": 94.52,
          "missing": []
        }
      },
      "trendProse": {
        "w": "strong uptrend",
        "d": "range / transition",
        "m": "range / transition",
        "h4": "uptrend"
      },
      "combo": "weekly up, daily range",
      "demand": [
        {
          "lo": 98.33,
          "hi": 112.99,
          "strength": "weak",
          "touches": 8,
          "closesIn": 14,
          "formVol": 1.75,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-06-09"
        },
        {
          "lo": 91.5,
          "hi": 95.6,
          "strength": "weak",
          "touches": 5,
          "closesIn": 3,
          "formVol": 1.7,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-04-30"
        },
        {
          "lo": 79.62,
          "hi": 82.54,
          "strength": "tested",
          "touches": 2,
          "closesIn": 1,
          "formVol": 2.1,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-04-24"
        }
      ],
      "supply": [
        {
          "lo": 100.23,
          "hi": 104.18,
          "strength": "weak",
          "touches": 1,
          "closesIn": 3,
          "formVol": 1.31,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-07-23"
        },
        {
          "lo": 103.12,
          "hi": 106.17,
          "strength": "weak",
          "touches": 3,
          "closesIn": 1,
          "formVol": 0.86,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-13"
        },
        {
          "lo": 107.45,
          "hi": 109.0,
          "strength": "weak",
          "touches": 5,
          "closesIn": 2,
          "formVol": 0.96,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-06-02"
        }
      ],
      "demand4h": [
        {
          "lo": 90.14,
          "hi": 96.72,
          "strength": "tested",
          "touches": 2,
          "closesIn": 1,
          "formVol": 1.04,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-31",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 103.08,
          "hi": 103.89,
          "strength": "weak",
          "touches": 4,
          "closesIn": 0,
          "formVol": 0.95,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-13",
          "frame": "4h"
        },
        {
          "lo": 109.49,
          "hi": 110.0,
          "strength": "fresh",
          "touches": 0,
          "closesIn": 0,
          "formVol": 0.7,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-10",
          "frame": "4h"
        }
      ],
      "position": "inside weak demand $98.33–112.99",
      "bull": "close above $100.23–104.18 → $107.45–109.00",
      "bear": "close below $98.33–112.99 → $91.50–95.60",
      "retest": "a break above $100.23–104.18 likely retests it as support",
      "longCandidate": "Long after **$80–84** holds and price reclaims **$95**.",
      "longSetup": "Hold $80–84 and reclaim **$95** → $100–104",
      "shortSetup": "Reject $90–95 or lose **$80** → $75–70",
      "preferred": "**Short preferred**",
      "h4": "Now above the 4H 50/200-EMAs (**$101 / $95**) — the bounce holds; **$103–104** caps it.",
      "h4Effect": "Keeps the short read intact. The rebound stalled under the 9-EMA $91.12 with Stoch crossing down from overbought; losing the $88.60 midline re-opens the $79.99 lower band."
    },
    {
      "ticker": "LITE",
      "date": "2026-08-07",
      "price": 890.17,
      "atr": 79.5,
      "atrPct": 8.93,
      "structure": {
        "m": "neutral",
        "w": "bullish",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 839.88->897.00, lows 650.82->594.84",
          "w": "pivots: highs 960.00->1085.68, lows 317.44->780.48"
        },
        "bars": {
          "d": 1506,
          "w": 313,
          "m": 73
        }
      },
      "ind": {
        "rsi": 59.06,
        "macdHist": 20.819,
        "obvSlope": 1
      },
      "parts": {
        "W": 1,
        "D": 0,
        "H": 0,
        "R": 1,
        "M": 1,
        "O": 1,
        "Z": 0
      },
      "score": 3.5,
      "bias": "strongly bullish",
      "trend": {
        "w": {
          "score": 6,
          "band": "strong uptrend",
          "S": 1,
          "E": 1,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 59.82,
          "ema50": 598.22,
          "ema200": 273.41,
          "missing": []
        },
        "d": {
          "score": 4,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 59.06,
          "ema50": 801.26,
          "ema200": 643.44,
          "missing": []
        },
        "m": {
          "score": 1,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": 0,
          "M": 1,
          "reach": 4,
          "full": false,
          "rsi": 79.04,
          "ema50": 284.24,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": 4,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 64.36,
          "ema50": 787.51,
          "ema200": 777.85,
          "missing": []
        }
      },
      "trendProse": {
        "w": "strong uptrend",
        "d": "uptrend",
        "m": "range / transition",
        "h4": "uptrend"
      },
      "combo": "aligned uptrend — weekly and daily agree",
      "demand": [
        {
          "lo": 854.52,
          "hi": 936.7,
          "strength": "weak",
          "touches": 8,
          "closesIn": 15,
          "formVol": 1.22,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-05-28"
        },
        {
          "lo": 811.45,
          "hi": 859.68,
          "strength": "weak",
          "touches": 9,
          "closesIn": 17,
          "formVol": 0.99,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-04-27"
        },
        {
          "lo": 680.66,
          "hi": 785.49,
          "strength": "weak",
          "touches": 9,
          "closesIn": 20,
          "formVol": 1.59,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-03-23"
        }
      ],
      "supply": [
        {
          "lo": 896.11,
          "hi": 896.11,
          "strength": "structural",
          "touches": null,
          "note": "swing high, no zone formed"
        },
        {
          "lo": 897.0,
          "hi": 897.0,
          "strength": "structural",
          "touches": null,
          "note": "swing high, no zone formed"
        }
      ],
      "demand4h": [
        {
          "lo": 825.49,
          "hi": 855.12,
          "strength": "weak",
          "touches": 6,
          "closesIn": 21,
          "formVol": 1.65,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-08-05",
          "frame": "4h"
        },
        {
          "lo": 691.1,
          "hi": 755.0,
          "strength": "tested",
          "touches": 1,
          "closesIn": 0,
          "formVol": 0.94,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-31",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 863.0,
          "hi": 901.01,
          "strength": "weak",
          "touches": 11,
          "closesIn": 10,
          "formVol": 1.17,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-06-05",
          "frame": "4h"
        },
        {
          "lo": 893.02,
          "hi": 919.86,
          "strength": "weak",
          "touches": 10,
          "closesIn": 5,
          "formVol": 1.19,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2026-06-04",
          "frame": "4h"
        }
      ],
      "position": "inside weak demand $854.52–936.70",
      "bull": "close above $896.11 → $897.00",
      "bear": "close below $854.52–936.70 → $680.66–785.49",
      "retest": "a break above $896.11 likely retests it as support",
      "longCandidate": "The stronger candidate now: two clean sessions of bullish displacement reclaimed the old supply as support. Needs one of two confirmations — a held retest or a breakout-retest — the push into $865–900 alone is not yet either.",
      "longSetup": "**Retest:** hold $820–835, reclaim → $865–900, then $930–970. **Breakout:** daily acceptance above $900, confirmed by a $875–900 retest → $930–970, then $1,000–1,070.",
      "shortSetup": "Only a confirmed rejection from **$865–900** (daily resistance $879–891 + 4H upper band ≈$899). A tag-and-fade back under ≈$850–860 raises the odds of a retest to $820–835 — do not press below there without a fresh breakdown.",
      "preferred": "**Two-way — short only on a rejection**",
      "h4": "Pressing into the $865–900 cluster — a recovery testing supply, not accepted above it.",
      "h4Effect": "Overnight price near $870 is inside the zone but not enough alone to call it broken. A regular-session close above $900 with a successful $875–900 retest opens $930–970, then $1,000–1,070. A close back under ≈$850–860 after tagging $870–900 is the bull-trap signature and raises the odds of a retest down to $820–835. The cluster is daily resistance $879–891 plus the 4H upper band ≈$899."
    },
    {
      "ticker": "MU",
      "date": "2026-08-07",
      "price": 877.57,
      "atr": 83.01,
      "atrPct": 9.46,
      "structure": {
        "m": "neutral",
        "w": "bullish",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 930.88->928.98, lows 737.88->770.10",
          "w": "pivots: highs 471.34->1255.00, lows 192.59->311.49"
        },
        "bars": {
          "d": 1506,
          "w": 313,
          "m": 73
        }
      },
      "ind": {
        "rsi": 47.63,
        "macdHist": 1.987,
        "obvSlope": -1
      },
      "parts": {
        "W": 1,
        "D": 0,
        "H": 0,
        "R": -1,
        "M": 1,
        "O": -1,
        "Z": 0
      },
      "score": 1.5,
      "bias": "bullish",
      "trend": {
        "w": {
          "score": 6,
          "band": "strong uptrend",
          "S": 1,
          "E": 1,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 58.71,
          "ema50": 558.28,
          "ema200": 255.32,
          "missing": []
        },
        "d": {
          "score": -1,
          "band": "range / transition",
          "S": 0,
          "E": -1,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 47.63,
          "ema50": 889.51,
          "ema200": 607.37,
          "missing": []
        },
        "m": {
          "score": 1,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": 0,
          "M": 1,
          "reach": 4,
          "full": false,
          "rsi": 70.15,
          "ema50": 271.08,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": -1,
          "band": "range / transition",
          "S": 0,
          "E": -1,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 49.13,
          "ema50": 905.17,
          "ema200": 786.74,
          "missing": []
        }
      },
      "trendProse": {
        "w": "strong uptrend",
        "d": "range / transition",
        "m": "range / transition",
        "h4": "range / transition"
      },
      "combo": "weekly up, daily range",
      "demand": [
        {
          "lo": 700.66,
          "hi": 734.96,
          "strength": "tested",
          "touches": 1,
          "closesIn": 0,
          "formVol": 1.12,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-05-20"
        },
        {
          "lo": 635.42,
          "hi": 649.83,
          "strength": "fresh",
          "touches": 0,
          "closesIn": 0,
          "formVol": 1.67,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-05-07"
        },
        {
          "lo": 557.76,
          "hi": 576.45,
          "strength": "fresh",
          "touches": 0,
          "closesIn": 0,
          "formVol": 1.39,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-05-04"
        }
      ],
      "supply": [
        {
          "lo": 920.95,
          "hi": 998.0,
          "strength": "weak",
          "touches": 4,
          "closesIn": 3,
          "formVol": 1.2,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-24"
        },
        {
          "lo": 1128.7,
          "hi": 1148.79,
          "strength": "fresh",
          "touches": 0,
          "closesIn": 0,
          "formVol": 1.03,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-06-29"
        }
      ],
      "demand4h": [
        {
          "lo": 820.29,
          "hi": 883.85,
          "strength": "weak",
          "touches": 7,
          "closesIn": 18,
          "formVol": 1.48,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-05-26",
          "frame": "4h"
        },
        {
          "lo": 744.5,
          "hi": 761.92,
          "strength": "tested",
          "touches": 2,
          "closesIn": 1,
          "formVol": 1.19,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-05-21",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 881.41,
          "hi": 901.18,
          "strength": "weak",
          "touches": 2,
          "closesIn": 4,
          "formVol": 1.3,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-07-27",
          "frame": "4h"
        },
        {
          "lo": 928.48,
          "hi": 943.5,
          "strength": "weak",
          "touches": 6,
          "closesIn": 1,
          "formVol": 0.78,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-07-13",
          "frame": "4h"
        }
      ],
      "position": "between demand $700.66–734.96 (16.3% below) and supply $920.95–998.00 (4.9% above)",
      "bull": "close above $920.95–998.00 → $1,128.70–1,148.79",
      "bear": "close below $700.66–734.96 → $635.42–649.83",
      "retest": "a break above $920.95–998.00 likely retests it as support",
      "longCandidate": "The stronger read now: bullish displacement reclaimed $830–875 as support. Still needs the $920 reclaim to hold — the push into it alone is not that confirmation.",
      "longSetup": "Hold $850–875, then reclaim $920 → $950–960, followed by $1,000–1,040. Regular-session acceptance above $950–960 promotes $1,000–1,040 to nearest supply.",
      "shortSetup": "The cleaner short is a rejection from $920–960, confirmed by a close back below $875–885 → $830–850, then $805–830. A daily close below $780 with a failed reclaim opens deeper toward $760–780 and below.",
      "preferred": "**Two-way — short preferred under $920**",
      "h4": "Pressing up toward $920–960 supply — prior daily lower highs and July congestion.",
      "h4Effect": "Overnight ≈$910 does not invalidate the zone; it needs a regular-session test to resolve."
    },
    {
      "ticker": "SNDK",
      "date": "2026-08-07",
      "price": 1212.21,
      "atr": 183.76,
      "atrPct": 15.16,
      "structure": {
        "m": null,
        "w": "bullish",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "822 4H bars",
        "why": {
          "d": "pivots: highs 1696.37->1446.62, lows 1325.03->998.19",
          "w": "pivots: highs 777.60->2354.39, lows 517.00->558.58"
        },
        "bars": {
          "d": 372,
          "w": 78,
          "m": 19
        }
      },
      "ind": {
        "rsi": 41.82,
        "macdHist": -0.216,
        "obvSlope": -1
      },
      "parts": {
        "W": 1,
        "D": 0,
        "H": 0,
        "R": -1,
        "M": -1,
        "O": -1,
        "Z": 0
      },
      "score": 0.5,
      "bias": "neutral",
      "trend": {
        "w": {
          "score": 2,
          "band": "uptrend",
          "S": 1,
          "E": 0,
          "A": 0,
          "M": -1,
          "reach": 4,
          "full": false,
          "rsi": 49.38,
          "ema50": 916.22,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "d": {
          "score": -2,
          "band": "downtrend",
          "S": 0,
          "E": -1,
          "A": 1,
          "M": -1,
          "reach": 7,
          "full": true,
          "rsi": 41.82,
          "ema50": 1500.57,
          "ema200": 1015.33,
          "missing": []
        },
        "h4": {
          "score": -1,
          "band": "range / transition",
          "S": 0,
          "E": -1,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 40.98,
          "ema50": 1450.92,
          "ema200": 1356.59,
          "missing": []
        }
      },
      "trendProse": {
        "w": "uptrend",
        "d": "downtrend",
        "h4": "range / transition"
      },
      "combo": "daily pullback inside a weekly uptrend",
      "demand": [
        {
          "lo": 980.28,
          "hi": 1112.43,
          "strength": "weak",
          "touches": 2,
          "closesIn": 2,
          "formVol": 1.18,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-04-30"
        },
        {
          "lo": 899.2,
          "hi": 930.97,
          "strength": "tested",
          "touches": 1,
          "closesIn": 0,
          "formVol": 0.71,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-04-21"
        },
        {
          "lo": 687.68,
          "hi": 784.0,
          "strength": "fresh",
          "touches": 0,
          "closesIn": 0,
          "formVol": 0.87,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-04-08"
        }
      ],
      "supply": [
        {
          "lo": 1511.67,
          "hi": 1628.4,
          "strength": "tested",
          "touches": 1,
          "closesIn": 0,
          "formVol": 1.34,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-07-22"
        },
        {
          "lo": 1673.97,
          "hi": 1800.0,
          "strength": "tested",
          "touches": 2,
          "closesIn": 0,
          "formVol": 1.27,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-07-13"
        }
      ],
      "demand4h": [
        {
          "lo": 1187.26,
          "hi": 1382.4,
          "strength": "weak",
          "touches": 2,
          "closesIn": 6,
          "formVol": 1.17,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-31",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 1292.07,
          "hi": 1456.01,
          "strength": "weak",
          "touches": 6,
          "closesIn": 10,
          "formVol": 1.69,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-07-27",
          "frame": "4h"
        },
        {
          "lo": 1611.64,
          "hi": 1709.51,
          "strength": "tested",
          "touches": 2,
          "closesIn": 1,
          "formVol": 1.47,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-07-23",
          "frame": "4h"
        }
      ],
      "position": "between demand $980.28–1,112.43 (8.2% below) and supply $1,511.67–1,628.40 (24.7% above)",
      "bull": "close above $1,511.67–1,628.40 → $1,673.97–1,800.00",
      "bear": "close below $980.28–1,112.43 → $899.20–930.97",
      "retest": "a break above $1,511.67–1,628.40 likely retests it as support",
      "longCandidate": "Needs the $1,580 acceptance and a held retest to be more than a bounce — holding $1,350–1,400 alone is not that confirmation.",
      "longSetup": "Hold $1,350–1,400, then break and accept above $1,580 → $1,680–1,760.",
      "shortSetup": "The cleaner short is a rejection from $1,530–1,580 confirmed by a loss of $1,400 → $1,280–1,220. A daily close below $1,060 with a failed reclaim opens the major zone below.",
      "preferred": "**Two-way — short preferred under $1,530**",
      "h4": "Faded back under 4H supply **$1,292–1,456**; the 4H 50-EMA **$1,451** is far overhead.",
      "h4Effect": "SNDK must close above $1,580 and hold the retest before the nearest supply promotes to $1,680–1,760. Failure around $1,530–1,580 combined with a loss of $1,400 opens $1,280–1,220. The $1,530–1,580 reclaim line has not been touched yet, let alone accepted."
    },
    {
      "ticker": "AMD",
      "date": "2026-08-07",
      "price": 483.36,
      "atr": 38.27,
      "atrPct": 7.92,
      "structure": {
        "m": "bullish",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 561.47->530.13, lows 460.21->424.03",
          "w": "pivots: highs 266.96->584.73, lows 194.28->188.22"
        },
        "bars": {
          "d": 1506,
          "w": 313,
          "m": 73
        }
      },
      "ind": {
        "rsi": 46.89,
        "macdHist": -2.259,
        "obvSlope": -1
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": 0,
        "R": -1,
        "M": 1,
        "O": -1,
        "Z": 0
      },
      "score": -0.5,
      "bias": "neutral",
      "trend": {
        "w": {
          "score": 3,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 60.36,
          "ema50": 331.98,
          "ema200": 194.86,
          "missing": []
        },
        "d": {
          "score": 0,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": 1,
          "M": -1,
          "reach": 7,
          "full": true,
          "rsi": 46.89,
          "ema50": 487.19,
          "ema200": 351.64,
          "missing": []
        },
        "m": {
          "score": 4,
          "band": "uptrend",
          "S": 1,
          "E": 0,
          "A": 0,
          "M": 1,
          "reach": 4,
          "full": false,
          "rsi": 69.95,
          "ema50": 202.51,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": -1,
          "band": "range / transition",
          "S": 0,
          "E": -1,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 46.51,
          "ema50": 501.77,
          "ema200": 431.96,
          "missing": []
        }
      },
      "trendProse": {
        "w": "uptrend",
        "d": "range / transition",
        "m": "uptrend",
        "h4": "range / transition"
      },
      "combo": "weekly up, daily range",
      "demand": [
        {
          "lo": 458.02,
          "hi": 488.45,
          "strength": "weak",
          "touches": 3,
          "closesIn": 5,
          "formVol": 0.88,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-06-11"
        },
        {
          "lo": 426.05,
          "hi": 447.58,
          "strength": "tested",
          "touches": 2,
          "closesIn": 1,
          "formVol": 0.92,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-05-20"
        },
        {
          "lo": 402.04,
          "hi": 421.39,
          "strength": "weak",
          "touches": 3,
          "closesIn": 2,
          "formVol": 1.38,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-05-06"
        }
      ],
      "supply": [
        {
          "lo": 485.0,
          "hi": 494.97,
          "strength": "weak",
          "touches": 6,
          "closesIn": 4,
          "formVol": 0.88,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-06-08"
        },
        {
          "lo": 539.69,
          "hi": 556.49,
          "strength": "fresh",
          "touches": 0,
          "closesIn": 0,
          "formVol": 1.11,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-23"
        },
        {
          "lo": 548.13,
          "hi": 574.2,
          "strength": "tested",
          "touches": 1,
          "closesIn": 1,
          "formVol": 0.97,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-14"
        }
      ],
      "demand4h": [
        {
          "lo": 475.83,
          "hi": 512.82,
          "strength": "weak",
          "touches": 17,
          "closesIn": 15,
          "formVol": 1.12,
          "heavyTouches": 4,
          "origin": "thin",
          "since": "2026-07-31",
          "frame": "4h"
        },
        {
          "lo": 448.33,
          "hi": 469.84,
          "strength": "weak",
          "touches": 8,
          "closesIn": 2,
          "formVol": 0.94,
          "heavyTouches": 3,
          "origin": "thin",
          "since": "2026-06-10",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 531.97,
          "hi": 546.44,
          "strength": "weak",
          "touches": 12,
          "closesIn": 13,
          "formVol": 0.99,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-13",
          "frame": "4h"
        }
      ],
      "position": "inside weak demand $458.02–488.45",
      "bull": "close above $485.00–494.97 → $539.69–556.49",
      "bear": "close below $458.02–488.45 → $426.05–447.58",
      "retest": "a break above $485.00–494.97 likely retests it as support",
      "longCandidate": "WAIT until the reclaim actually holds — the higher-timeframe trend is the reason to want this long, not a reason to enter early.",
      "longSetup": "Hold **$465–475**, form a 4H higher low, then reclaim and hold **$503** → $518–522, then $533–550. Stronger continuation needs acceptance above **$550**.",
      "shortSetup": "Reject from **$500–503**, or break **$475** and fail the reclaim → $465, then $446. Daily acceptance below **$446** opens $419–420.",
      "preferred": "**Two-way — short now, long above $503**",
      "h4": "Still inside the **$475–503** trap zone, under the 4H 50-EMA **$502** — no reversal yet.",
      "h4Effect": "This is what keeps the row at WAIT rather than a clean side: the higher-timeframe trend is still up, but the 4H has not confirmed a reversal from the earnings-day drop. A reclaim of $503 that holds resolves it long; a failed reclaim with a break of $475 resolves it short. Until one of those prints, $475–503 is a trap, not a level to trade from."
    },
    {
      "ticker": "CIEN",
      "date": "2026-08-07",
      "price": 412.39,
      "atr": 30.87,
      "atrPct": 7.49,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 415.80->427.00, lows 359.01->323.29",
          "w": "pivots: highs 637.51->494.53, lows 278.39->417.34"
        },
        "bars": {
          "d": 1506,
          "w": 313,
          "m": 73
        }
      },
      "ind": {
        "rsi": 50.47,
        "macdHist": 7.166,
        "obvSlope": -1
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": 0,
        "R": 1,
        "M": 1,
        "O": -1,
        "Z": 0
      },
      "score": 0.5,
      "bias": "neutral",
      "trend": {
        "w": {
          "score": 3,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 50.54,
          "ema50": 342.43,
          "ema200": 170.34,
          "missing": []
        },
        "d": {
          "score": 0,
          "band": "range / transition",
          "S": 0,
          "E": -1,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 50.47,
          "ema50": 430.78,
          "ema200": 365.97,
          "missing": []
        },
        "m": {
          "score": 1,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": 0,
          "M": 1,
          "reach": 4,
          "full": false,
          "rsi": 65.7,
          "ema50": 175.51,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": 2,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": -1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 56.53,
          "ema50": 408.16,
          "ema200": 428.32,
          "missing": []
        }
      },
      "trendProse": {
        "w": "uptrend",
        "d": "range / transition",
        "m": "range / transition",
        "h4": "uptrend"
      },
      "combo": "weekly up, daily range",
      "demand": [
        {
          "lo": 400.0,
          "hi": 460.33,
          "strength": "weak",
          "touches": 9,
          "closesIn": 20,
          "formVol": 1.36,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-06-22"
        },
        {
          "lo": 350.36,
          "hi": 370.05,
          "strength": "weak",
          "touches": 5,
          "closesIn": 2,
          "formVol": 1.71,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-03-17"
        },
        {
          "lo": 329.41,
          "hi": 344.26,
          "strength": "tested",
          "touches": 2,
          "closesIn": 1,
          "formVol": 1.2,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-03-12"
        }
      ],
      "supply": [
        {
          "lo": 375.01,
          "hi": 415.8,
          "strength": "weak",
          "touches": 2,
          "closesIn": 7,
          "formVol": 0.98,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-23"
        },
        {
          "lo": 445.44,
          "hi": 494.53,
          "strength": "weak",
          "touches": 2,
          "closesIn": 3,
          "formVol": 0.83,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-13"
        },
        {
          "lo": 488.21,
          "hi": 525.15,
          "strength": "weak",
          "touches": 3,
          "closesIn": 1,
          "formVol": 2.43,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-06-05"
        }
      ],
      "demand4h": [
        {
          "lo": 374.38,
          "hi": 393.98,
          "strength": "weak",
          "touches": 3,
          "closesIn": 1,
          "formVol": 0.85,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-31",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 406.55,
          "hi": 426.45,
          "strength": "weak",
          "touches": 2,
          "closesIn": 12,
          "formVol": 1.29,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-15",
          "frame": "4h"
        },
        {
          "lo": 445.49,
          "hi": 448.5,
          "strength": "tested",
          "touches": 1,
          "closesIn": 1,
          "formVol": 0.53,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-13",
          "frame": "4h"
        }
      ],
      "position": "inside weak demand $400.00–460.33",
      "bull": "close above $375.01–415.80 → $445.44–494.53",
      "bear": "close below $400.00–460.33 → $350.36–370.05",
      "retest": "a break above $375.01–415.80 likely retests it as support",
      "longCandidate": "Long after **$355–365** holds and **$405–420** is reclaimed.",
      "longSetup": "Hold $355–365 and reclaim **$405–420** → $445–475",
      "shortSetup": "Reject $400–420 or lose **$355** → $340–320",
      "preferred": "**Short preferred, but near demand**",
      "h4": "Back over the 4H 50-EMA **$408**, under the 200 **$428** — recovery, not a trend yet."
    },
    {
      "ticker": "CRWV",
      "date": "2026-08-07",
      "price": 90.67,
      "atr": 7.58,
      "atrPct": 8.36,
      "structure": {
        "m": null,
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "763 4H bars",
        "why": {
          "d": "pivots: highs 85.37->94.30, lows 68.51->60.55",
          "w": "pivots: highs 138.25->132.15, lows 94.82->91.02"
        },
        "bars": {
          "d": 342,
          "w": 72,
          "m": 18
        }
      },
      "ind": {
        "rsi": 55.37,
        "macdHist": 2.968,
        "obvSlope": -1
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": 0,
        "R": 1,
        "M": 1,
        "O": -1,
        "Z": 0
      },
      "score": 0.5,
      "bias": "neutral",
      "trend": {
        "w": {
          "score": -1,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": 0,
          "M": -1,
          "reach": 4,
          "full": false,
          "rsi": 49.39,
          "ema50": 96.19,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "d": {
          "score": 2,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": -1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 55.37,
          "ema50": 88.6,
          "ema200": 96.46,
          "missing": []
        },
        "h4": {
          "score": 2,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": -1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 60.78,
          "ema50": 83.47,
          "ema200": 92.7,
          "missing": []
        }
      },
      "trendProse": {
        "w": "range / transition",
        "d": "uptrend",
        "h4": "uptrend"
      },
      "combo": "weekly range, daily up",
      "demand": [
        {
          "lo": 71.85,
          "hi": 72.99,
          "strength": "weak",
          "touches": 4,
          "closesIn": 2,
          "formVol": 0.95,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-03-06"
        }
      ],
      "supply": [
        {
          "lo": 87.36,
          "hi": 99.5,
          "strength": "weak",
          "touches": 13,
          "closesIn": 35,
          "formVol": 1.79,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-07-10"
        },
        {
          "lo": 106.93,
          "hi": 120.82,
          "strength": "weak",
          "touches": 8,
          "closesIn": 19,
          "formVol": 1.93,
          "heavyTouches": 4,
          "origin": "strong",
          "since": "2026-05-14"
        },
        {
          "lo": 126.32,
          "hi": 133.84,
          "strength": "weak",
          "touches": 2,
          "closesIn": 2,
          "formVol": 0.82,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2025-11-03"
        }
      ],
      "demand4h": [
        {
          "lo": 79.46,
          "hi": 87.02,
          "strength": "weak",
          "touches": 8,
          "closesIn": 14,
          "formVol": 0.86,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-07-07",
          "frame": "4h"
        },
        {
          "lo": 69.97,
          "hi": 77.04,
          "strength": "tested",
          "touches": 1,
          "closesIn": 0,
          "formVol": 1.44,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-07-31",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 94.0,
          "hi": 96.17,
          "strength": "tested",
          "touches": 2,
          "closesIn": 0,
          "formVol": 1.51,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-06-29",
          "frame": "4h"
        },
        {
          "lo": 99.26,
          "hi": 100.78,
          "strength": "weak",
          "touches": 5,
          "closesIn": 2,
          "formVol": 0.92,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-06-05",
          "frame": "4h"
        }
      ],
      "position": "inside weak supply $87.36–99.50",
      "bull": "close above $87.36–99.50 → $106.93–120.82",
      "bear": "close below $71.85–72.99",
      "retest": "a break above $87.36–99.50 likely retests it as support",
      "longCandidate": "Long only after **$60–65** holds and **$74–80** is reclaimed.",
      "longSetup": "Countertrend only after $60–65 holds and **$80** is reclaimed",
      "shortSetup": "Reject $74–80 or lose **$60** → $49–52",
      "preferred": "**Short preferred**",
      "h4": "Bounce has legs — over the 4H 50-EMA **$83**, still under the 200 **$93** and **$87–100**."
    },
    {
      "ticker": "GLW",
      "date": "2026-08-07",
      "price": 165.68,
      "atr": 14.14,
      "atrPct": 8.53,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 204.48->164.50, lows 146.94->114.50",
          "w": "pivots: highs 211.79->271.78, lows 120.01->166.00"
        },
        "bars": {
          "d": 1506,
          "w": 313,
          "m": 73
        }
      },
      "ind": {
        "rsi": 51.61,
        "macdHist": 3.325,
        "obvSlope": -1
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": 0,
        "R": 1,
        "M": 1,
        "O": -1,
        "Z": 0
      },
      "score": 0.5,
      "bias": "neutral",
      "trend": {
        "w": {
          "score": 3,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 52.43,
          "ema50": 134.58,
          "ema200": 77.3,
          "missing": []
        },
        "d": {
          "score": 0,
          "band": "range / transition",
          "S": 0,
          "E": -1,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 51.61,
          "ema50": 169.14,
          "ema200": 142.73,
          "missing": []
        },
        "m": {
          "score": 1,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": 0,
          "M": 1,
          "reach": 4,
          "full": false,
          "rsi": 60.41,
          "ema50": 79.76,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": 0,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": -1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 60.21,
          "ema50": 161.48,
          "ema200": 165.31,
          "missing": []
        }
      },
      "trendProse": {
        "w": "uptrend",
        "d": "range / transition",
        "m": "range / transition",
        "h4": "range / transition"
      },
      "combo": "weekly up, daily range",
      "demand": [
        {
          "lo": 157.7,
          "hi": 162.02,
          "strength": "weak",
          "touches": 3,
          "closesIn": 2,
          "formVol": 1.5,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-05-01"
        },
        {
          "lo": 136.35,
          "hi": 147.92,
          "strength": "weak",
          "touches": 5,
          "closesIn": 4,
          "formVol": 0.95,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-04-02"
        },
        {
          "lo": 129.79,
          "hi": 139.51,
          "strength": "weak",
          "touches": 4,
          "closesIn": 13,
          "formVol": 2.41,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-02-20"
        }
      ],
      "supply": [
        {
          "lo": 168.0,
          "hi": 172.95,
          "strength": "weak",
          "touches": 8,
          "closesIn": 2,
          "formVol": 1.19,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-04-23"
        },
        {
          "lo": 177.58,
          "hi": 190.11,
          "strength": "weak",
          "touches": 4,
          "closesIn": 6,
          "formVol": 1.1,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-07-13"
        }
      ],
      "demand4h": [
        {
          "lo": 156.42,
          "hi": 159.85,
          "strength": "tested",
          "touches": 1,
          "closesIn": 1,
          "formVol": 1.08,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-08-05",
          "frame": "4h"
        },
        {
          "lo": 138.23,
          "hi": 143.79,
          "strength": "fresh",
          "touches": 0,
          "closesIn": 0,
          "formVol": 1.25,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-31",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 168.79,
          "hi": 187.07,
          "strength": "weak",
          "touches": 7,
          "closesIn": 3,
          "formVol": 1.16,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-07-15",
          "frame": "4h"
        },
        {
          "lo": 199.1,
          "hi": 206.99,
          "strength": "tested",
          "touches": 1,
          "closesIn": 0,
          "formVol": 0.8,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-06",
          "frame": "4h"
        }
      ],
      "position": "between demand $157.70–162.02 (2.2% below) and supply $168.00–172.95 (1.4% above)",
      "bull": "close above $168.00–172.95 → $177.58–190.11",
      "bear": "close below $157.70–162.02 → $136.35–147.92",
      "retest": "a break above $168.00–172.95 likely retests it as support",
      "longCandidate": "Countertrend only, and it needs all three: demand holding, a 4H higher low, and acceptance back above **$145–150**. The weekly stays damaged below **$178–192**.",
      "longSetup": "Hold **$122–126** or **$114–120**, form a 4H higher low and reclaim **$145–150** → **$156–165**, then **$178**. A stronger daily reversal needs acceptance above **$160–165**.",
      "shortSetup": "The cleaner short is a rejection from **$143–150**, or a stronger bounce into **$156–165** → $126–122, then $120–114. A daily close below **$114** with a failed reclaim opens **$105–100**. Do not chase a breakdown directly into $122–126.",
      "preferred": "**Short preferred**; long on confirmation",
      "h4": "At the 4H 200-EMA **$165**, under supply **$168–173**; 4H demand **$156–160** beneath."
    },
    {
      "ticker": "META",
      "date": "2026-08-07",
      "price": 592.1,
      "atr": 23.22,
      "atrPct": 3.92,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 655.88->601.00, lows 626.00->524.49",
          "w": "pivots: highs 643.00->686.08, lows 592.60->540.18"
        },
        "bars": {
          "d": 1506,
          "w": 313,
          "m": 73
        }
      },
      "ind": {
        "rsi": 47.67,
        "macdHist": -2.475,
        "obvSlope": -1
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": 0,
        "R": -1,
        "M": 1,
        "O": -1,
        "Z": 0
      },
      "score": -0.5,
      "bias": "neutral",
      "trend": {
        "w": {
          "score": -1,
          "band": "range / transition",
          "S": 0,
          "E": -1,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 47.38,
          "ema50": 625.11,
          "ema200": 516.99,
          "missing": []
        },
        "d": {
          "score": -4,
          "band": "downtrend",
          "S": 0,
          "E": -1,
          "A": -1,
          "M": -1,
          "reach": 7,
          "full": true,
          "rsi": 47.67,
          "ema50": 603.88,
          "ema200": 627.33,
          "missing": []
        },
        "m": {
          "score": 0,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": 0,
          "M": 0,
          "reach": 4,
          "full": false,
          "rsi": 50.74,
          "ema50": 501.31,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": -3,
          "band": "downtrend",
          "S": 0,
          "E": -1,
          "A": -1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 49.58,
          "ema50": 599.1,
          "ema200": 612.59,
          "missing": []
        }
      },
      "trendProse": {
        "w": "range / transition",
        "d": "downtrend",
        "m": "range / transition",
        "h4": "downtrend"
      },
      "combo": "weekly range, daily down",
      "demand": [
        {
          "lo": 581.76,
          "hi": 600.29,
          "strength": "weak",
          "touches": 3,
          "closesIn": 9,
          "formVol": 1.15,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-06"
        },
        {
          "lo": 540.4,
          "hi": 550.25,
          "strength": "tested",
          "touches": 2,
          "closesIn": 0,
          "formVol": 1.64,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-06-26"
        }
      ],
      "supply": [
        {
          "lo": 593.87,
          "hi": 611.26,
          "strength": "tested",
          "touches": 2,
          "closesIn": 0,
          "formVol": 1.5,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-07-27"
        },
        {
          "lo": 603.0,
          "hi": 624.17,
          "strength": "weak",
          "touches": 15,
          "closesIn": 5,
          "formVol": 1.67,
          "heavyTouches": 7,
          "origin": "strong",
          "since": "2026-06-03"
        },
        {
          "lo": 627.45,
          "hi": 634.75,
          "strength": "weak",
          "touches": 7,
          "closesIn": 6,
          "formVol": 0.86,
          "heavyTouches": 5,
          "origin": "thin",
          "since": "2026-03-16"
        }
      ],
      "demand4h": [
        {
          "lo": 557.8,
          "hi": 568.39,
          "strength": "weak",
          "touches": 5,
          "closesIn": 11,
          "formVol": 2.25,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-06-29",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 593.66,
          "hi": 597.0,
          "strength": "weak",
          "touches": 5,
          "closesIn": 1,
          "formVol": 2.15,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-07-28",
          "frame": "4h"
        },
        {
          "lo": 625.8,
          "hi": 634.46,
          "strength": "weak",
          "touches": 7,
          "closesIn": 5,
          "formVol": 1.81,
          "heavyTouches": 5,
          "origin": "strong",
          "since": "2026-05-29",
          "frame": "4h"
        }
      ],
      "position": "inside weak demand $581.76–600.29",
      "bull": "close above $593.87–611.26 → $627.45–634.75",
      "bear": "close below $581.76–600.29 → $540.40–550.25",
      "retest": "a break above $593.87–611.26 likely retests it as support",
      "longCandidate": "Countertrend long from **$520–545** after 4H confirmation.",
      "longSetup": "Hold $520–545, form higher low and reclaim **$575–590** → $599–635",
      "shortSetup": "Reject $575–610, or lose **$520** → $500–490, then $470–450",
      "preferred": "**Short trend; long only countertrend**",
      "h4": "Cleared **$577** but still under the 4H 50-EMA **$599** — recovery inside a downtrend."
    },
    {
      "ticker": "MRVL",
      "date": "2026-08-07",
      "price": 218.72,
      "atr": 19.12,
      "atrPct": 8.74,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 214.92->222.67, lows 177.95->162.90",
          "w": "pivots: highs 94.20->329.88, lows 81.18->70.69"
        },
        "bars": {
          "d": 1506,
          "w": 313,
          "m": 73
        }
      },
      "ind": {
        "rsi": 52.37,
        "macdHist": 4.761,
        "obvSlope": 1
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": 0,
        "R": 1,
        "M": 1,
        "O": 1,
        "Z": 0
      },
      "score": 1.5,
      "bias": "bullish",
      "trend": {
        "w": {
          "score": 3,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 58.55,
          "ema50": 149.16,
          "ema200": 93.91,
          "missing": []
        },
        "d": {
          "score": 2,
          "band": "uptrend",
          "S": 0,
          "E": 0,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 52.37,
          "ema50": 213.91,
          "ema200": 158.08,
          "missing": []
        },
        "m": {
          "score": 1,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": 0,
          "M": 1,
          "reach": 4,
          "full": false,
          "rsi": 63.83,
          "ema50": 96.55,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": 4,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 59.41,
          "ema50": 211.71,
          "ema200": 193.55,
          "missing": []
        }
      },
      "trendProse": {
        "w": "uptrend",
        "d": "uptrend",
        "m": "range / transition",
        "h4": "uptrend"
      },
      "combo": "aligned uptrend — weekly and daily agree",
      "demand": [
        {
          "lo": 187.12,
          "hi": 199.38,
          "strength": "fresh",
          "touches": 0,
          "closesIn": 0,
          "formVol": 0.69,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-31"
        },
        {
          "lo": 162.85,
          "hi": 176.27,
          "strength": "weak",
          "touches": 3,
          "closesIn": 3,
          "formVol": 1.09,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-05-19"
        },
        {
          "lo": 151.09,
          "hi": 157.32,
          "strength": "weak",
          "touches": 2,
          "closesIn": 2,
          "formVol": 1.75,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-04-22"
        }
      ],
      "supply": [
        {
          "lo": 217.53,
          "hi": 228.8,
          "strength": "weak",
          "touches": 2,
          "closesIn": 2,
          "formVol": 0.81,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-13"
        },
        {
          "lo": 225.16,
          "hi": 236.79,
          "strength": "tested",
          "touches": 1,
          "closesIn": 1,
          "formVol": 0.61,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-08"
        },
        {
          "lo": 272.41,
          "hi": 278.28,
          "strength": "tested",
          "touches": 1,
          "closesIn": 0,
          "formVol": 1.06,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-06-29"
        }
      ],
      "demand4h": [
        {
          "lo": 216.69,
          "hi": 219.31,
          "strength": "weak",
          "touches": 4,
          "closesIn": 5,
          "formVol": 5.44,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-06-01",
          "frame": "4h"
        },
        {
          "lo": 199.2,
          "hi": 204.43,
          "strength": "weak",
          "touches": 8,
          "closesIn": 2,
          "formVol": 1.28,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-05-29",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 202.21,
          "hi": 219.88,
          "strength": "weak",
          "touches": 5,
          "closesIn": 13,
          "formVol": 0.8,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-07-15",
          "frame": "4h"
        },
        {
          "lo": 243.33,
          "hi": 248.6,
          "strength": "tested",
          "touches": 1,
          "closesIn": 1,
          "formVol": 0.63,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-09",
          "frame": "4h"
        }
      ],
      "position": "inside weak supply $217.53–228.80",
      "bull": "close above $217.53–228.80 → $272.41–278.28",
      "bear": "close below $187.12–199.38 → $162.85–176.27",
      "retest": "a break above $217.53–228.80 likely retests it as support",
      "longCandidate": "Countertrend only — **$160–170** must produce a genuine structure change, not merely one green candle.",
      "longSetup": "Hold **$160–170**, form a 4H higher low, reclaim **$193–201** → **$213–225**. A stronger trend reversal requires acceptance above **$213–225**.",
      "shortSetup": "Wait for a rebound toward **$193–201** and assess whether sellers return; reject → $170–160, then $155–143. A daily close below **$160** with a failed reclaim → $155–143, then **$140–125**.",
      "preferred": "**Short preferred**, not near demand",
      "h4": "Over the 4H 50/200-EMAs (**$212 / $194**) and into supply **$218–229** — the level to clear."
    },
    {
      "ticker": "QCOM",
      "date": "2026-08-07",
      "price": 167.86,
      "atr": 9.16,
      "atrPct": 5.46,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 178.65->163.48, lows 164.77->142.89",
          "w": "pivots: highs 146.94->259.92, lows 132.73->121.99"
        },
        "bars": {
          "d": 1506,
          "w": 313,
          "m": 73
        }
      },
      "ind": {
        "rsi": 47.56,
        "macdHist": 1.244,
        "obvSlope": -1
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": 0,
        "R": -1,
        "M": 1,
        "O": -1,
        "Z": 0
      },
      "score": -0.5,
      "bias": "neutral",
      "trend": {
        "w": {
          "score": -2,
          "band": "downtrend",
          "S": 0,
          "E": -1,
          "A": 1,
          "M": -1,
          "reach": 7,
          "full": true,
          "rsi": 47.85,
          "ema50": 170.87,
          "ema200": 157.08,
          "missing": []
        },
        "d": {
          "score": -1,
          "band": "range / transition",
          "S": 0,
          "E": -1,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 47.56,
          "ema50": 178.24,
          "ema200": 171.78,
          "missing": []
        },
        "m": {
          "score": 1,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": 0,
          "M": 1,
          "reach": 4,
          "full": false,
          "rsi": 50.71,
          "ema50": 156.12,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": -2,
          "band": "downtrend",
          "S": 0,
          "E": -1,
          "A": -1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 56.34,
          "ema50": 170.35,
          "ema200": 177.25,
          "missing": []
        }
      },
      "trendProse": {
        "w": "downtrend",
        "d": "range / transition",
        "m": "range / transition",
        "h4": "downtrend"
      },
      "combo": "weekly down, daily range",
      "demand": [
        {
          "lo": 166.02,
          "hi": 169.27,
          "strength": "weak",
          "touches": 13,
          "closesIn": 14,
          "formVol": 4.41,
          "heavyTouches": 3,
          "origin": "strong",
          "since": "2025-10-22"
        },
        {
          "lo": 157.1,
          "hi": 161.83,
          "strength": "weak",
          "touches": 11,
          "closesIn": 5,
          "formVol": 0.92,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2026-08-05"
        },
        {
          "lo": 147.05,
          "hi": 156.31,
          "strength": "weak",
          "touches": 2,
          "closesIn": 5,
          "formVol": 4.18,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-04-27"
        }
      ],
      "supply": [
        {
          "lo": 165.46,
          "hi": 171.98,
          "strength": "weak",
          "touches": 15,
          "closesIn": 23,
          "formVol": 1.38,
          "heavyTouches": 4,
          "origin": "strong",
          "since": "2026-07-24"
        },
        {
          "lo": 180.19,
          "hi": 184.07,
          "strength": "weak",
          "touches": 3,
          "closesIn": 3,
          "formVol": 1.24,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-01-07"
        },
        {
          "lo": 183.98,
          "hi": 188.16,
          "strength": "fresh",
          "touches": 0,
          "closesIn": 0,
          "formVol": 0.59,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-13"
        }
      ],
      "demand4h": [
        {
          "lo": 157.12,
          "hi": 161.3,
          "strength": "tested",
          "touches": 1,
          "closesIn": 1,
          "formVol": 0.64,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-08-05",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 168.24,
          "hi": 171.19,
          "strength": "tested",
          "touches": 2,
          "closesIn": 0,
          "formVol": 1.11,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-27",
          "frame": "4h"
        },
        {
          "lo": 178.1,
          "hi": 180.84,
          "strength": "tested",
          "touches": 2,
          "closesIn": 0,
          "formVol": 0.57,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-14",
          "frame": "4h"
        }
      ],
      "position": "inside weak demand $166.02–169.27",
      "bull": "close above $165.46–171.98 → $180.19–184.07",
      "bear": "close below $166.02–169.27 → $157.10–161.83",
      "retest": "a break above $165.46–171.98 likely retests it as support",
      "longCandidate": "Tactical long only if $148–152 holds and price closes above $160–162; a genuine trend reversal needs acceptance above $172–180.",
      "longSetup": "**Tactical long:** hold $148–152, enter on a retest after a 4H close above $160–162, stop below $148 or $142 depending on entry → $168–172, then $178–180 and $188–196. Higher-confidence trend long only after a daily close and hold above $172.",
      "shortSetup": "**Rejection short:** fade $160–162, or preferably $168–172, stop above $163 or $174 depending on entry → $150, $142–145, then $134–138. **Breakdown short:** daily close below $142 and a failed retest → $134–138, then $121–125.",
      "preferred": "**Short preferred**, do not chase into demand",
      "h4": "The bounce is still under the 4H 50-EMA **$170** and 200 **$177** — no reversal yet.",
      "h4Effect": "Keeps the short read. A 4H close above $160–162 with a successful retest is what would flip this to a tactical long; below $148 the bounce fails outright."
    },
    {
      "ticker": "SMH",
      "date": "2026-08-07",
      "price": 582.7,
      "atr": 25.88,
      "atrPct": 4.44,
      "structure": {
        "m": "bullish",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 618.17->592.01, lows 536.81->503.63",
          "w": "pivots: highs 427.94->671.83, lows 374.24->359.86"
        },
        "bars": {
          "d": 1506,
          "w": 313,
          "m": 73
        }
      },
      "ind": {
        "rsi": 52.86,
        "macdHist": 4.134,
        "obvSlope": -1
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": 0,
        "R": 1,
        "M": 1,
        "O": -1,
        "Z": 0
      },
      "score": 0.5,
      "bias": "neutral",
      "trend": {
        "w": {
          "score": 3,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 59.91,
          "ema50": 456.01,
          "ema200": 290.47,
          "missing": []
        },
        "d": {
          "score": 2,
          "band": "uptrend",
          "S": 0,
          "E": 0,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 52.86,
          "ema50": 570.4,
          "ema200": 475.14,
          "missing": []
        },
        "m": {
          "score": 4,
          "band": "uptrend",
          "S": 1,
          "E": 0,
          "A": 0,
          "M": 1,
          "reach": 4,
          "full": false,
          "rsi": 71.67,
          "ema50": 291.71,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": 4,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 59.18,
          "ema50": 571.26,
          "ema200": 539.59,
          "missing": []
        }
      },
      "trendProse": {
        "w": "uptrend",
        "d": "uptrend",
        "m": "uptrend",
        "h4": "uptrend"
      },
      "combo": "aligned uptrend — weekly and daily agree",
      "demand": [
        {
          "lo": 554.66,
          "hi": 609.48,
          "strength": "weak",
          "touches": 8,
          "closesIn": 19,
          "formVol": 1.14,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2026-06-10"
        },
        {
          "lo": 551.65,
          "hi": 564.66,
          "strength": "weak",
          "touches": 6,
          "closesIn": 3,
          "formVol": 0.96,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2026-05-20"
        },
        {
          "lo": 514.12,
          "hi": 522.69,
          "strength": "tested",
          "touches": 1,
          "closesIn": 0,
          "formVol": 1.28,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-05-05"
        }
      ],
      "supply": [
        {
          "lo": 571.35,
          "hi": 592.01,
          "strength": "weak",
          "touches": 1,
          "closesIn": 3,
          "formVol": 2.43,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-07-23"
        },
        {
          "lo": 600.31,
          "hi": 608.9,
          "strength": "fresh",
          "touches": 0,
          "closesIn": 0,
          "formVol": 1.43,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-07-14"
        },
        {
          "lo": 615.03,
          "hi": 659.74,
          "strength": "weak",
          "touches": 3,
          "closesIn": 0,
          "formVol": 1.41,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-06-30"
        }
      ],
      "demand4h": [
        {
          "lo": 568.29,
          "hi": 580.52,
          "strength": "weak",
          "touches": 6,
          "closesIn": 12,
          "formVol": 1.19,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-06-10",
          "frame": "4h"
        },
        {
          "lo": 535.26,
          "hi": 558.23,
          "strength": "tested",
          "touches": 2,
          "closesIn": 1,
          "formVol": 0.76,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-31",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 585.63,
          "hi": 607.0,
          "strength": "weak",
          "touches": 9,
          "closesIn": 15,
          "formVol": 2.04,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-07-13",
          "frame": "4h"
        },
        {
          "lo": 634.71,
          "hi": 641.39,
          "strength": "weak",
          "touches": 8,
          "closesIn": 3,
          "formVol": 1.49,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-06-03",
          "frame": "4h"
        }
      ],
      "position": "inside weak demand $554.66–609.48",
      "bull": "close above $571.35–592.01 → $600.31–608.90",
      "bear": "close below $554.66–609.48 → $514.12–522.69",
      "retest": "a break above $571.35–592.01 likely retests it as support",
      "longCandidate": "Long if **$503–520** holds and price reclaims **$557–570**.",
      "longSetup": "Hold $503–520 and reclaim **$570** → $590–605",
      "shortSetup": "Reject $557–571 or lose **$503** → $486–469",
      "preferred": "**Short during correction**",
      "h4": "Over the 4H 50-EMA **$571**, working through supply **$571–592**, **$600–609** above."
    },
    {
      "ticker": "TE",
      "date": "2026-08-07",
      "price": 5.85,
      "atr": 0.8,
      "atrPct": 13.68,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "807 4H bars",
        "why": {
          "d": "pivots: highs 10.08->6.30, lows 5.55->3.49",
          "w": "pivots: highs 12.49->10.90, lows 3.74->7.36"
        },
        "bars": {
          "d": 1506,
          "w": 313,
          "m": 73
        }
      },
      "ind": {
        "rsi": 48.64,
        "macdHist": 0.19,
        "obvSlope": 1
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": 0,
        "R": -1,
        "M": 1,
        "O": 1,
        "Z": 0
      },
      "score": 0.5,
      "bias": "neutral",
      "trend": {
        "w": {
          "score": 0,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": 1,
          "M": -1,
          "reach": 7,
          "full": true,
          "rsi": 47.64,
          "ema50": 5.7,
          "ema200": 5.44,
          "missing": []
        },
        "d": {
          "score": -1,
          "band": "range / transition",
          "S": 0,
          "E": -1,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 48.64,
          "ema50": 6.57,
          "ema200": 6.08,
          "missing": []
        },
        "m": {
          "score": 1,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": 0,
          "M": 1,
          "reach": 4,
          "full": false,
          "rsi": 52.6,
          "ema50": 5.74,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": -2,
          "band": "downtrend",
          "S": 0,
          "E": -1,
          "A": -1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 56.47,
          "ema50": 5.9,
          "ema200": 6.78,
          "missing": []
        }
      },
      "trendProse": {
        "w": "range / transition",
        "d": "range / transition",
        "m": "range / transition",
        "h4": "downtrend"
      },
      "combo": "no directional edge",
      "demand": [
        {
          "lo": 4.45,
          "hi": 4.74,
          "strength": "weak",
          "touches": 9,
          "closesIn": 2,
          "formVol": 1.38,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2025-12-02"
        },
        {
          "lo": 3.23,
          "hi": 4.11,
          "strength": "weak",
          "touches": 5,
          "closesIn": 5,
          "formVol": 2.76,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2025-11-26"
        }
      ],
      "supply": [
        {
          "lo": 5.76,
          "hi": 6.25,
          "strength": "weak",
          "touches": 5,
          "closesIn": 9,
          "formVol": 1.22,
          "heavyTouches": 4,
          "origin": "thin",
          "since": "2026-07-21"
        },
        {
          "lo": 6.61,
          "hi": 6.98,
          "strength": "weak",
          "touches": 5,
          "closesIn": 5,
          "formVol": 0.55,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-03-24"
        },
        {
          "lo": 7.63,
          "hi": 8.28,
          "strength": "weak",
          "touches": 9,
          "closesIn": 9,
          "formVol": 1.01,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2026-02-06"
        }
      ],
      "demand4h": [
        {
          "lo": 5.43,
          "hi": 5.72,
          "strength": "weak",
          "touches": 6,
          "closesIn": 4,
          "formVol": 3.37,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-05-14",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 6.02,
          "hi": 6.22,
          "strength": "tested",
          "touches": 1,
          "closesIn": 0,
          "formVol": 1.02,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-07-22",
          "frame": "4h"
        },
        {
          "lo": 6.47,
          "hi": 6.95,
          "strength": "tested",
          "touches": 1,
          "closesIn": 1,
          "formVol": 1.68,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-07-14",
          "frame": "4h"
        }
      ],
      "position": "inside weak supply $5.76–6.25",
      "bull": "close above $5.76–6.25 → $6.61–6.98",
      "bear": "close below $4.45–4.74 → $3.23–4.11",
      "retest": "a break above $5.76–6.25 likely retests it as support",
      "longCandidate": "Countertrend long if **$3.65–3.70** holds and **$4.30–4.53** is reclaimed.",
      "longSetup": "Hold $3.65–3.70 and reclaim **$4.30–4.53** → $4.72–5.34",
      "shortSetup": "Reject $4.53–4.72 or lose **$3.50** → $3.00–2.50",
      "preferred": "**Short trend; long only countertrend**",
      "h4": "Bounce stalled at the 4H 50-EMA **$5.90**, 200 **$6.78** above — inside supply **$5.76–6.25**.",
      "h4Effect": "The countertrend long is **not confirmed yet**. Better long trigger: hold $3.65–3.70 and reclaim **$4.30–4.53**. Below $3.55 invalidates the immediate bounce thesis."
    },
    {
      "ticker": "TSLA",
      "date": "2026-08-07",
      "price": 328.58,
      "atr": 14.82,
      "atrPct": 4.51,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 413.16->329.57, lows 389.30->297.38",
          "w": "pivots: highs 453.40->432.86, lows 337.24->368.60"
        },
        "bars": {
          "d": 1506,
          "w": 313,
          "m": 73
        }
      },
      "ind": {
        "rsi": 41.41,
        "macdHist": 1.025,
        "obvSlope": 0
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": 0,
        "R": -1,
        "M": 1,
        "O": 0,
        "Z": 0
      },
      "score": 0.0,
      "bias": "neutral",
      "trend": {
        "w": {
          "score": -2,
          "band": "downtrend",
          "S": 0,
          "E": -1,
          "A": 1,
          "M": -1,
          "reach": 7,
          "full": true,
          "rsi": 39.1,
          "ema50": 382.55,
          "ema200": 318.46,
          "missing": []
        },
        "d": {
          "score": -3,
          "band": "downtrend",
          "S": 0,
          "E": -1,
          "A": -1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 41.41,
          "ema50": 367.11,
          "ema200": 387.24,
          "missing": []
        },
        "m": {
          "score": -1,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": 0,
          "M": -1,
          "reach": 4,
          "full": false,
          "rsi": 48.09,
          "ema50": 316.86,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": -3,
          "band": "downtrend",
          "S": 0,
          "E": -1,
          "A": -1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 48.47,
          "ema50": 346.62,
          "ema200": 383.02,
          "missing": []
        }
      },
      "trendProse": {
        "w": "downtrend",
        "d": "downtrend",
        "m": "range / transition",
        "h4": "downtrend"
      },
      "combo": "aligned downtrend — weekly and daily agree",
      "demand": [
        {
          "lo": 314.6,
          "hi": 335.79,
          "strength": "weak",
          "touches": 6,
          "closesIn": 9,
          "formVol": 0.98,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2025-08-21"
        },
        {
          "lo": 297.38,
          "hi": 297.38,
          "strength": "structural",
          "touches": null,
          "note": "swing low, no zone formed"
        }
      ],
      "supply": [
        {
          "lo": 329.62,
          "hi": 336.27,
          "strength": "weak",
          "touches": 8,
          "closesIn": 2,
          "formVol": 0.78,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2025-08-18"
        },
        {
          "lo": 361.51,
          "hi": 387.48,
          "strength": "weak",
          "touches": 10,
          "closesIn": 16,
          "formVol": 1.32,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-07-20"
        },
        {
          "lo": 395.56,
          "hi": 412.94,
          "strength": "weak",
          "touches": 10,
          "closesIn": 11,
          "formVol": 0.93,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-07-14"
        }
      ],
      "demand4h": [
        {
          "lo": 315.52,
          "hi": 315.52,
          "strength": "structural",
          "touches": null,
          "note": "swing low, no zone formed",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 325.17,
          "hi": 341.86,
          "strength": "weak",
          "touches": 3,
          "closesIn": 3,
          "formVol": 1.82,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-07-23",
          "frame": "4h"
        }
      ],
      "position": "inside weak demand $314.60–335.79",
      "bull": "close above $329.62–336.27 → $361.51–387.48",
      "bear": "close below $314.60–335.79 → $297.38",
      "retest": "a break above $329.62–336.27 likely retests it as support",
      "longCandidate": "A **bounce trade only** — countertrend until TSLA recovers $365–387.",
      "longSetup": "Hold **$297–305**, form a 4H higher low, reclaim **$315** then **$324–330** → targets **$350–365**. A stronger reversal only above **$365–387**; below that region the dominant trend stays bearish.",
      "shortSetup": "Wait for a bounce toward **$324–330**, then short only after rejection AND a break of the 4H rejection candle's low → $305–297. A daily close below **$297** with a failed reclaim targets **$286–282**, then **$260–250**.",
      "preferred": "**Short preferred with trend**",
      "h4": "Off the lows but under the 4H 50-EMA **$347** and 200 **$383** — downtrend intact."
    },
    {
      "ticker": "AKAM",
      "date": "2026-08-07",
      "price": 110.54,
      "atr": 6.35,
      "atrPct": 5.75,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "bearish",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 131.08->127.50, lows 115.94->107.11",
          "w": "pivots: highs 165.45->131.08, lows 88.50->108.84"
        },
        "bars": {
          "d": 1506,
          "w": 313,
          "m": 73
        }
      },
      "ind": {
        "rsi": 40.36,
        "macdHist": 0.291,
        "obvSlope": -1
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": -1,
        "R": -1,
        "M": -1,
        "O": -1,
        "Z": 0
      },
      "score": -2.0,
      "bias": "bearish",
      "trend": {
        "w": {
          "score": 2,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": -1,
          "reach": 7,
          "full": true,
          "rsi": 47.31,
          "ema50": 107.31,
          "ema200": 98.65,
          "missing": []
        },
        "d": {
          "score": -1,
          "band": "range / transition",
          "S": 0,
          "E": -1,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 40.36,
          "ema50": 121.26,
          "ema200": 110.1,
          "missing": []
        },
        "m": {
          "score": 1,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": 0,
          "M": 1,
          "reach": 4,
          "full": false,
          "rsi": 53.92,
          "ema50": 99.39,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": -5,
          "band": "strong downtrend",
          "S": -1,
          "E": -1,
          "A": 1,
          "M": -1,
          "reach": 7,
          "full": true,
          "rsi": 38.76,
          "ema50": 119.05,
          "ema200": 119.02,
          "missing": []
        }
      },
      "trendProse": {
        "w": "uptrend",
        "d": "range / transition",
        "m": "range / transition",
        "h4": "strong downtrend"
      },
      "combo": "weekly up, daily range",
      "demand": [
        {
          "lo": 107.27,
          "hi": 117.94,
          "strength": "weak",
          "touches": 7,
          "closesIn": 17,
          "formVol": 3.08,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-07-02"
        },
        {
          "lo": 103.6,
          "hi": 107.91,
          "strength": "weak",
          "touches": 4,
          "closesIn": 3,
          "formVol": 2.09,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-03-17"
        },
        {
          "lo": 96.98,
          "hi": 102.98,
          "strength": "weak",
          "touches": 3,
          "closesIn": 4,
          "formVol": 1.17,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-04-30"
        }
      ],
      "supply": [
        {
          "lo": 113.89,
          "hi": 116.26,
          "strength": "weak",
          "touches": 7,
          "closesIn": 3,
          "formVol": 2.05,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-04-07"
        },
        {
          "lo": 115.37,
          "hi": 119.08,
          "strength": "weak",
          "touches": 2,
          "closesIn": 2,
          "formVol": 0.74,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-07-24"
        },
        {
          "lo": 116.75,
          "hi": 127.5,
          "strength": "weak",
          "touches": 5,
          "closesIn": 5,
          "formVol": 0.94,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-21"
        }
      ],
      "demand4h": [
        {
          "lo": 109.55,
          "hi": 109.55,
          "strength": "structural",
          "touches": null,
          "note": "swing low, no zone formed",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 111.81,
          "hi": 112.42,
          "strength": "weak",
          "touches": 3,
          "closesIn": 1,
          "formVol": 0.82,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-07-28",
          "frame": "4h"
        },
        {
          "lo": 115.32,
          "hi": 117.68,
          "strength": "tested",
          "touches": 2,
          "closesIn": 1,
          "formVol": 0.77,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-24",
          "frame": "4h"
        }
      ],
      "position": "inside weak demand $107.27–117.94",
      "bull": "close above $113.89–116.26 → $116.75–127.50",
      "bear": "close below $107.27–117.94 → $96.98–102.98",
      "retest": "a break above $113.89–116.26 likely retests it as support",
      "longCandidate": "Long only after acceptance above **$119.22**.",
      "longSetup": "Trend changes only above **$119.22** → $124–126",
      "shortSetup": "Reject **$115–119** or lose **$107.27** → $102–104",
      "preferred": "**Short preferred**",
      "h4": "Lost **$112** — 4H 50/200-EMAs both **$119** overhead, RSI **39**. Strongest 4H downtrend.",
      "h4Effect": "Keeps the **neutral-to-bearish** bias. Failure below $118 favors **$112**, then **$108**. A 4H close above $118 would open $121–124."
    },
    {
      "ticker": "ADBE",
      "date": "2026-08-07",
      "price": 265.21,
      "atr": 11.42,
      "atrPct": 4.31,
      "structure": {
        "m": "bearish",
        "w": "bearish",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 266.28->262.15, lows 210.88->241.23",
          "w": "pivots: highs 285.36->275.44, lows 224.13->190.12"
        },
        "bars": {
          "d": 1506,
          "w": 313,
          "m": 73
        }
      },
      "ind": {
        "rsi": 65.97,
        "macdHist": 2.786,
        "obvSlope": 1
      },
      "parts": {
        "W": -1,
        "D": 0,
        "H": 0,
        "R": 1,
        "M": -1,
        "O": 1,
        "Z": 0
      },
      "score": -1.5,
      "bias": "bearish",
      "trend": {
        "w": {
          "score": -5,
          "band": "strong downtrend",
          "S": -1,
          "E": -1,
          "A": -1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 53.83,
          "ema50": 283.26,
          "ema200": 390.51,
          "missing": []
        },
        "d": {
          "score": 2,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": -1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 65.97,
          "ema50": 236.53,
          "ema200": 272.57,
          "missing": []
        },
        "m": {
          "score": -4,
          "band": "downtrend",
          "S": -1,
          "E": 0,
          "A": 0,
          "M": -1,
          "reach": 4,
          "full": false,
          "rsi": 39.5,
          "ema50": 390.61,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": 2,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": -1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 66.55,
          "ema50": 240.61,
          "ema200": 243.13,
          "missing": []
        }
      },
      "trendProse": {
        "w": "strong downtrend",
        "d": "uptrend",
        "m": "downtrend",
        "h4": "uptrend"
      },
      "combo": "countertrend bounce — usually better used to find a short",
      "demand": [
        {
          "lo": 260.05,
          "hi": 270.99,
          "strength": "weak",
          "touches": 8,
          "closesIn": 5,
          "formVol": 0.98,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2026-03-03"
        },
        {
          "lo": 255.56,
          "hi": 261.59,
          "strength": "weak",
          "touches": 9,
          "closesIn": 6,
          "formVol": 0.97,
          "heavyTouches": 3,
          "origin": "thin",
          "since": "2026-08-05"
        },
        {
          "lo": 241.69,
          "hi": 249.18,
          "strength": "tested",
          "touches": 2,
          "closesIn": 1,
          "formVol": 1.28,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-28"
        }
      ],
      "supply": [
        {
          "lo": 267.23,
          "hi": 282.9,
          "strength": "weak",
          "touches": 9,
          "closesIn": 9,
          "formVol": 1.42,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-02-04"
        },
        {
          "lo": 291.65,
          "hi": 293.64,
          "strength": "tested",
          "touches": 1,
          "closesIn": 1,
          "formVol": 1.48,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-01-29"
        },
        {
          "lo": 301.4,
          "hi": 306.3,
          "strength": "tested",
          "touches": 1,
          "closesIn": 0,
          "formVol": 1.31,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-01-26"
        }
      ],
      "demand4h": [
        {
          "lo": 256.41,
          "hi": 259.33,
          "strength": "tested",
          "touches": 1,
          "closesIn": 0,
          "formVol": 1.04,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-08-05",
          "frame": "4h"
        },
        {
          "lo": 244.66,
          "hi": 255.46,
          "strength": "weak",
          "touches": 4,
          "closesIn": 13,
          "formVol": 2.06,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-05-29",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 265.94,
          "hi": 265.94,
          "strength": "structural",
          "touches": null,
          "note": "swing high, no zone formed",
          "frame": "4h"
        }
      ],
      "position": "inside weak demand $260.05–270.99",
      "bull": "close above $267.23–282.90 → $291.65–293.64",
      "bear": "close below $260.05–270.99 → $241.69–249.18",
      "retest": "a break above $267.23–282.90 likely retests it as support",
      "longCandidate": "Countertrend only, and only while **$239–243** holds. Acceptance above **$284** would weaken the short case outright.",
      "longSetup": "Hold **$239–243** and form a 4H higher low → **$263–266**. A daily close above **$266** with a successful retest opens **$273–284**, then **$300–316**.",
      "shortSetup": "Rejection at **$263–274**, into the falling 200-day and recent supply → $243–239, then $231–225. A daily close below **$225** with a failed reclaim opens **$205–200**.",
      "preferred": "**Short preferred**; tactical longs allowed",
      "h4": "Over the 4H 50-EMA **$241**, RSI **67**, pressing the **$267–283** supply band.",
      "h4Effect": "The tactical long lives here: while $239–243 holds, a 4H higher low targets $263–266. It is the frame that would break first — losing $239 hands the read back to the weekly downtrend."
    },
    {
      "ticker": "TTD",
      "date": "2026-08-07",
      "price": 13.8,
      "atr": 1.3,
      "atrPct": 9.43,
      "structure": {
        "m": "bearish",
        "w": "bearish",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 19.51->19.55, lows 16.70->17.71",
          "w": "pivots: highs 23.57->20.53, lows 19.83->16.98"
        },
        "bars": {
          "d": 1506,
          "w": 313,
          "m": 73
        }
      },
      "ind": {
        "rsi": 28.42,
        "macdHist": -0.23,
        "obvSlope": -1
      },
      "parts": {
        "W": -1,
        "D": 0,
        "H": 0,
        "R": -1,
        "M": -1,
        "O": -1,
        "Z": 0
      },
      "score": -3.5,
      "bias": "strongly bearish",
      "trend": {
        "w": {
          "score": -6,
          "band": "strong downtrend",
          "S": -1,
          "E": -1,
          "A": -1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 26.74,
          "ema50": 33.03,
          "ema200": 59.3,
          "missing": []
        },
        "d": {
          "score": -4,
          "band": "downtrend",
          "S": 0,
          "E": -1,
          "A": -1,
          "M": -1,
          "reach": 7,
          "full": true,
          "rsi": 28.42,
          "ema50": 19.15,
          "ema200": 30.11,
          "missing": []
        },
        "m": {
          "score": -4,
          "band": "downtrend",
          "S": -1,
          "E": 0,
          "A": 0,
          "M": -1,
          "reach": 4,
          "full": false,
          "rsi": 31.1,
          "ema50": 57.82,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": -4,
          "band": "downtrend",
          "S": 0,
          "E": -1,
          "A": -1,
          "M": -1,
          "reach": 7,
          "full": true,
          "rsi": 24.77,
          "ema50": 18.25,
          "ema200": 21.47,
          "missing": []
        }
      },
      "trendProse": {
        "w": "strong downtrend",
        "d": "downtrend",
        "m": "downtrend",
        "h4": "downtrend"
      },
      "combo": "aligned downtrend — weekly and daily agree",
      "demand": [],
      "supply": [
        {
          "lo": 17.96,
          "hi": 19.37,
          "strength": "weak",
          "touches": 3,
          "closesIn": 3,
          "formVol": 4.49,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-08-04"
        },
        {
          "lo": 18.77,
          "hi": 19.99,
          "strength": "weak",
          "touches": 6,
          "closesIn": 16,
          "formVol": 1.05,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-15"
        }
      ],
      "position": "below supply $17.96–19.37, no demand within range",
      "bull": "close above $17.96–19.37",
      "bear": "no demand within range — nothing left to lose",
      "retest": "a break above $17.96–19.37 likely retests it as support",
      "longCandidate": "Countertrend, and only after **$17.4–17.7** holds and **$18.2–18.3** is reclaimed. Not a credible swing long until TTD accepts above **$19.5–20.7**.",
      "longSetup": "Hold **$17.4–17.7**, form a 4H higher low and reclaim **$18.2–18.3** → **$18.7**, then **$19.1–19.5**. Daily acceptance above **$19.5** opens **$20.2–20.7**; a credible trend reversal needs a breakout above **$20.7** and a successful retest, which opens **$23.5–24.5**.",
      "shortSetup": "Rejection from **$18.7–19.5** with a 4H lower high → $17.7–17.4, then $17.0–16.5. The stronger short is **$20.2–20.7** if it is reached and rejected. A daily close below **$17.3** with a failed reclaim → **$16.5–16.0**, with **$15.5** as the extended target.",
      "preferred": "**Two-way watch** — swing short preferred",
      "h4": "Broke to **$13.80** with no demand under it — 4H RSI **25**, 50-EMA **$18.25** far above.",
      "h4Effect": "This frame is what makes it a two-way watch rather than a short: oversold at demand argues a bounce toward **$18.3–18.7** first, and the cleaner short is that bounce failing at **$18.7–19.5**."
    }
  ],
  "note": "Structure only — where demand and supply sit and what triggers which way. Independent of the traded plans on the cards; the two are allowed to disagree.",
  "ranking": [
    "**LITE two-way** — short only a confirmed rejection from $865–900; long only a $820–835 retest or acceptance above $900.",
    "**STX short** — fired: $842 and $818 both failed on the 08-07 close ($812.76); $797–816 is the 4H shelf under it.",
    "**AKAM rejection short** — live: below $118 and $112 both gave way, closing $110.54 into a 4H strong downtrend.",
    "**AXON long** — nothing before **08-11**, the post-earnings gate. $560–576 is the hold, $587–611 the cap; do not pre-empt the date.",
    "**PLTR long** — through $170 and inside supply $167–177 on a 4H RSI of 78. Wait for the $158–162 retest, not this push.",
    "**TE long** — still the weakest: the bounce stalled at the 4H 50-EMA $5.90, inside supply $5.76–6.25."
  ],
  "rankingNote": "08-07 close. The two shorts this list was waiting on both triggered: STX lost $842 and $818 in one session to close $812.76, and AKAM lost $118 and $112 to close $110.54 — the only strong 4H downtrend on the board. The long side kept melting up: PLTR pushed through $170 into supply $167–177 at a 4H RSI of 78, and AXON rebounded +9.29% off its 08-06 close back inside daily demand $560–594 — but its post-earnings gate does not lapse until 08-11, so it is not actionable whatever the frames now read. LITE and MU each sit under the band they have to clear ($863–901 and $921–998) with no acceptance above it, so both stay two-way. TTD is the session's outlier: −21.90% to $13.80, with no demand left within range.",
  "direction": {
    "groups": [
      {
        "label": "Critical-minerals cluster — one position, not three",
        "side": "long",
        "tickers": [
          "ALOY",
          "MP",
          "USAR",
          "UUUU"
        ],
        "note": "Same news, same session, same shape: all four reversed off a July washout, all four are now pressing into their first real supply, and all four carry a 4H RSI in the 68–78 band. Sized as four names this is one correlated bet at quadruple weight, and the retest each is waiting for will almost certainly arrive on the same bar — treat a fill in one as having consumed the cluster's risk budget, not a quarter of it. MP is the liquid bellwether and the least extended, and it is the only one with a level that has actually flipped beneath it ($49.39); watch it for the group's confirmation. ALOY is the most volatile at ~11% ATR and the nearest to its trigger."
      },
      {
        "label": "Best trend-following longs",
        "side": "long",
        "tickers": [
          "LLY",
          "AVGO",
          "GOOGL",
          "AXON",
          "PLTR"
        ]
      },
      {
        "label": "Possible longs after breakout confirmation",
        "side": "long",
        "tickers": [
          "STX",
          "MSFT"
        ],
        "note": "STX now carries a bullish WEEKLY structure with a 4H downtrend under it — and $842 and $818 both failed on 08-07, so the confirmation this group was waiting on went the other way; it has to reclaim $817–832 before it graduates. MSFT is long-first but extended: 4H RSI 77 and $68 above its 4H 50-EMA, so it joins on a pullback with a 4H higher low, not here."
      },
      {
        "label": "Best trend-following shorts",
        "side": "short",
        "tickers": [
          "CRWV",
          "INTC",
          "AKAM",
          "TSLA",
          "MRVL",
          "TTD",
          "GLW"
        ]
      },
      {
        "label": "Bearish corrections inside larger monthly uptrends",
        "side": "short",
        "tickers": [
          "SMH",
          "META",
          "CIEN",
          "MU"
        ]
      },
      {
        "label": "Countertrend bounce candidates only",
        "side": "long",
        "tickers": [
          "TE",
          "META",
          "SMH",
          "CIEN",
          "TSLA",
          "MRVL",
          "MU",
          "NOW",
          "TTD",
          "GLW",
          "ADBE",
          "QCOM",
          "LITE"
        ]
      }
    ],
    "note": "**TE** stays the clearest countertrend case: the weekly and daily frames have flattened to range, but the 4H is still a downtrend and price is back at the 4H 50-EMA **$5.90** inside supply **$5.76–6.25**. The long therefore needs stronger confirmation than a trend-following one."
  }
};
