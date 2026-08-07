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
  "updated": "2026-08-06",
  "generatedBy": "tools/structure.py",
  "method": "Score = 2W + D + 0.5H + 0.5R + 0.5M + 0.5O + Z (W weekly, D daily, H 4H structure; R RSI vs 50; M MACD histogram slope; O OBV slope; Z inside confirmed demand +1 / supply −1)",
  "rows": [
    {
      "ticker": "STX",
      "date": "2026-08-06",
      "price": 852.95,
      "atr": 79.49,
      "atrPct": 9.32,
      "structure": {
        "m": "neutral",
        "w": "bullish",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1700 4H bars",
        "why": {
          "d": "pivots: highs 936.49->921.78, lows 698.99->782.08",
          "w": "pivots: highs 439.73->1145.00, lows 342.00->351.42"
        },
        "bars": {
          "d": 1506,
          "w": 314,
          "m": 73
        }
      },
      "ind": {
        "rsi": 50.1,
        "macdHist": 3.546,
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
          "rsi": 60.52,
          "ema50": 552.36,
          "ema200": 259.14,
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
          "rsi": 50.1,
          "ema50": 838.44,
          "ema200": 593.31,
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
          "rsi": 82.62,
          "ema50": 275.76,
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
          "rsi": 51.29,
          "ema50": 853.74,
          "ema200": 752.38,
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
          "lo": 846.07,
          "hi": 892.83,
          "strength": "weak",
          "touches": 7,
          "closesIn": 13,
          "formVol": 0.8,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2026-05-29"
        },
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
          "lo": 741,
          "hi": 757.16,
          "strength": "weak",
          "touches": 2,
          "closesIn": 2,
          "formVol": 0.87,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2026-05-20"
        }
      ],
      "supply": [
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
          "touches": 10,
          "closesIn": 5,
          "formVol": 1.37,
          "heavyTouches": 3,
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
      "position": "inside weak demand $846.07–892.83",
      "bull": "close above $860.66–877.73 → $915.99–987.57",
      "bear": "close below $846.07–892.83 → $752.80–786.42",
      "retest": "a break above $860.66–877.73 likely retests it as support",
      "longCandidate": "Long after confirmed defense of **$786–800**.",
      "longSetup": "Defend **$786–800**, reclaim $815–838 → $885",
      "shortSetup": "Reject **$885–922**, or lose $832 then $818 → $800–786",
      "preferred": "**Neutral — wait for resolution**",
      "h4": "Rally to $900 made a lower high and is rolling over — now testing the **$842–860** cluster.",
      "h4Effect": "Short thesis improves after a 4H close below **$842**, with stronger confirmation below **$818**. Targets remain **$800–786**. Reclaiming $875–900 would delay the short."
    },
    {
      "ticker": "AVGO",
      "date": "2026-08-06",
      "price": 420.57,
      "atr": 17.09,
      "atrPct": 4.06,
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
          "w": 314,
          "m": 73
        }
      },
      "ind": {
        "rsi": 62.53,
        "macdHist": 4.824,
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
          "rsi": 57.94,
          "ema50": 352.75,
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
          "rsi": 62.53,
          "ema50": 391.73,
          "ema200": 362.43,
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
          "rsi": 66.63,
          "ema50": 222.6,
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
          "rsi": 69.84,
          "ema50": 393.32,
          "ema200": 384.36,
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
          "lo": 417,
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
        },
        {
          "lo": 360.82,
          "hi": 373.9,
          "strength": "weak",
          "touches": 11,
          "closesIn": 10,
          "formVol": 1.16,
          "heavyTouches": 3,
          "origin": "thin",
          "since": "2026-07-06"
        }
      ],
      "supply": [
        {
          "lo": 479.23,
          "hi": 495,
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
          "lo": 424.17,
          "hi": 424.17,
          "strength": "structural",
          "touches": null,
          "note": "swing high, no zone formed",
          "frame": "4h"
        }
      ],
      "position": "inside weak demand $417.00–422.01",
      "bull": "close above $479.23–495.00",
      "bear": "close below $417.00–422.01 → $371.75–387.84",
      "retest": "a break above $479.23–495.00 likely retests it as support",
      "longCandidate": "Trend-following long if **$378–383** holds and price reclaims **$396–405**.",
      "longSetup": "Hold $378–383 and reclaim **$396–405** → $419–425, then $450–466",
      "shortSetup": "Short only after loss and failed reclaim of **$378** → $369–357",
      "preferred": "**Long preferred**",
      "h4": "Compressed — coiling under the $382–390 moving-average cluster rather than trending."
    },
    {
      "ticker": "GOOGL",
      "date": "2026-08-06",
      "price": 357.75,
      "atr": 13.45,
      "atrPct": 3.76,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 373.16->375.27, lows 351.08->314.90",
          "w": "pivots: highs 408.61->375.27, lows 330.20->314.90"
        },
        "bars": {
          "d": 1506,
          "w": 314,
          "m": 73
        }
      },
      "ind": {
        "rsi": 52.38,
        "macdHist": 3.738,
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
          "rsi": 54.78,
          "ema50": 312.29,
          "ema200": 214.27,
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
          "rsi": 52.38,
          "ema50": 353.89,
          "ema200": 322.06,
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
          "rsi": 68.93,
          "ema50": 215.15,
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
          "rsi": 53.34,
          "ema50": 352.94,
          "ema200": 348.38,
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
          "lo": 346,
          "hi": 359.68,
          "strength": "weak",
          "touches": 3,
          "closesIn": 2,
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
          "closesIn": 5,
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
          "lo": 354.21,
          "hi": 359.48,
          "strength": "weak",
          "touches": 7,
          "closesIn": 11,
          "formVol": 0.77,
          "heavyTouches": 3,
          "origin": "thin",
          "since": "2026-07-02",
          "frame": "4h"
        },
        {
          "lo": 340,
          "hi": 354.31,
          "strength": "fresh",
          "touches": 0,
          "closesIn": 0,
          "formVol": 1.62,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-07-31",
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
      "h4": "Breakout rejected at **$376** on a heavy wick. 4H RSI **72** — short-term extended."
    },
    {
      "ticker": "LLY",
      "date": "2026-08-06",
      "price": 1191.94,
      "atr": 42.79,
      "atrPct": 3.59,
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
          "w": 314,
          "m": 73
        }
      },
      "ind": {
        "rsi": 54.93,
        "macdHist": -4.61,
        "obvSlope": 0
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": 0,
        "R": 1,
        "M": 1,
        "O": 0,
        "Z": 0
      },
      "score": 1,
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
          "rsi": 62.5,
          "ema50": 1012.91,
          "ema200": 745.57,
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
          "rsi": 54.93,
          "ema50": 1140.04,
          "ema200": 1025.59,
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
          "rsi": 65.94,
          "ema50": 734.6,
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
          "rsi": 56.82,
          "ema50": 1166.11,
          "ema200": 1093.85,
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
          "hi": 1230,
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
          "closesIn": 1,
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
          "hi": 1193,
          "strength": "weak",
          "touches": 8,
          "closesIn": 3,
          "formVol": 0.82,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2026-07-10",
          "frame": "4h"
        },
        {
          "lo": 1217.6,
          "hi": 1232,
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
      "position": "between demand $1,153.50–1,173.91 (1.5% below) and supply $1,210.02–1,230.00 (1.5% above)",
      "bull": "close above $1,210.02–1,230.00",
      "bear": "close below $1,153.50–1,173.91 → $1,079.22–1,120.49",
      "retest": "a break above $1,210.02–1,230.00 likely retests it as support",
      "longCandidate": "Long from **$1,119–1,130** demand after a higher low and reclaim of **$1,175**.",
      "longSetup": "Hold $1,119–1,130 and reclaim **$1,175** → $1,200–1,250",
      "shortSetup": "Short only after loss and failed reclaim of **$1,119** → $1,050",
      "preferred": "**Long preferred**",
      "h4": "Fell **$1,225 → $1,142** — stabilising, not turning. Under **$1,152–1,181**, RSI **30.52**."
    },
    {
      "ticker": "MSFT",
      "date": "2026-08-06",
      "price": 499.86,
      "atr": 16.54,
      "atrPct": 3.31,
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
          "w": 314,
          "m": 73
        }
      },
      "ind": {
        "rsi": 78.11,
        "macdHist": 12.017,
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
          "rsi": 65.42,
          "ema50": 429.53,
          "ema200": 392.57,
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
          "rsi": 78.11,
          "ema50": 412.98,
          "ema200": 425.06,
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
          "rsi": 57.91,
          "ema50": 389.71,
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
          "rsi": 79.32,
          "ema50": 425.84,
          "ema200": 411.58,
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
          "closesIn": 3,
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
      "h4": "At **$465**, roughly **three ATRs** above the pre-earnings area — the long is not buying here."
    },
    {
      "ticker": "NOW",
      "date": "2026-08-06",
      "price": 117.35,
      "atr": 6.6,
      "atrPct": 5.62,
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
          "w": 314,
          "m": 73
        }
      },
      "ind": {
        "rsi": 61.09,
        "macdHist": 1.498,
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
          "score": -2,
          "band": "downtrend",
          "S": 0,
          "E": -1,
          "A": -1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 52.66,
          "ema50": 126.46,
          "ema200": 138.92,
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
          "rsi": 61.09,
          "ema50": 106.18,
          "ema200": 122.34,
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
          "rsi": 43.36,
          "ema50": 136.47,
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
          "rsi": 61.69,
          "ema50": 108.23,
          "ema200": 107.6,
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
        },
        {
          "lo": 98.11,
          "hi": 102.18,
          "strength": "weak",
          "touches": 7,
          "closesIn": 7,
          "formVol": 2.01,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-06-29"
        }
      ],
      "supply": [
        {
          "lo": 116.73,
          "hi": 118.96,
          "strength": "weak",
          "touches": 9,
          "closesIn": 5,
          "formVol": 2.8,
          "heavyTouches": 4,
          "origin": "strong",
          "since": "2026-01-29"
        },
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
        }
      ],
      "demand4h": [
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
        },
        {
          "lo": 104.6,
          "hi": 108.18,
          "strength": "weak",
          "touches": 8,
          "closesIn": 20,
          "formVol": 2.15,
          "heavyTouches": 3,
          "origin": "strong",
          "since": "2026-07-02",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 118.36,
          "hi": 118.36,
          "strength": "structural",
          "touches": null,
          "note": "swing high, no zone formed",
          "frame": "4h"
        }
      ],
      "position": "inside weak supply $116.73–118.96",
      "bull": "close above $116.73–118.96 → $134.61–138.19",
      "bear": "close below $106.57–113.19 → $103.84–106.32",
      "retest": "a break above $116.73–118.96 likely retests it as support",
      "longCandidate": "The preferred side while **$103–106** holds, but countertrend to the monthly and weekly — sell into supply rather than holding for the reversal.",
      "longSetup": "Hold or reclaim **$106–108**, form a 4H higher low and break **$112–114** → **$116–118**, then **$123–126**. Daily acceptance above **$118** strengthens the long; sustained acceptance above **$123–126** would mark a larger trend reversal and open **$136–138**.",
      "shortSetup": "Rejection from **$116–118** with a 4H lower high → $108–106, then $105–103. The higher-quality swing short is a rejection of the falling 200-day at **$123–126**. A breakdown short needs a daily close below **$103–104** and a failed reclaim → **$99–101**, then **$94–96**.",
      "preferred": "**Tactical long preferred** above $103–106",
      "h4": "Bullish recovery, now consolidating — constructive while above the **$103–105** cluster.",
      "h4Effect": "This is the frame carrying the long. Holding $103–105 keeps the tactical long live; a 4H break of **$112–114** opens $116–118, while losing the cluster hands the read back to the weekly downtrend."
    },
    {
      "ticker": "PLTR",
      "date": "2026-08-06",
      "price": 155.92,
      "atr": 8.38,
      "atrPct": 5.38,
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
          "d": 1469,
          "w": 306,
          "m": 72
        }
      },
      "ind": {
        "rsi": 66.37,
        "macdHist": 3.7,
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
          "rsi": 56.3,
          "ema50": 139.66,
          "ema200": 90.66,
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
          "rsi": 66.37,
          "ema50": 133.38,
          "ema200": 141.35,
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
          "rsi": 59.92,
          "ema50": 88.57,
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
          "rsi": 69.97,
          "ema50": 134.05,
          "ema200": 137.09,
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
          "lo": 153.24,
          "hi": 161.08,
          "strength": "weak",
          "touches": 5,
          "closesIn": 5,
          "formVol": 0.93,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2026-03-23"
        },
        {
          "lo": 157.35,
          "hi": 165.04,
          "strength": "weak",
          "touches": 7,
          "closesIn": 5,
          "formVol": 1.7,
          "heavyTouches": 3,
          "origin": "strong",
          "since": "2026-01-28"
        },
        {
          "lo": 166.98,
          "hi": 177.29,
          "strength": "weak",
          "touches": 6,
          "closesIn": 13,
          "formVol": 1.19,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-01-23"
        }
      ],
      "demand4h": [
        {
          "lo": 132.42,
          "hi": 132.42,
          "strength": "structural",
          "touches": null,
          "note": "swing low, no zone formed",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 163.69,
          "hi": 163.69,
          "strength": "structural",
          "touches": null,
          "note": "swing high, no zone formed",
          "frame": "4h"
        }
      ],
      "position": "inside weak supply $153.24–161.08",
      "bull": "close above $153.24–161.08 → $166.98–177.29",
      "bear": "close below $129.18–134.19 → $120.27–122.26",
      "retest": "a break above $153.24–161.08 likely retests it as support",
      "longCandidate": "The board’s strongest long structure — weekly now confirms (reclaimed the mean, OBV turning up), not just the daily gap. Still not a chase: the best entry is a controlled $155–160 hold, a deeper $145–150 retest, or a confirmed breakout-retest above $170.",
      "longSetup": "**Momentum:** hold $155–160, form a higher low, reclaim $162–165 → $170, then $175–182. **Deeper pullback:** retest $145–150 (the gap open), hold it, reclaim $152–155 → $165–170, then $175–182. **Breakout:** daily acceptance above $170 with a successful $164–170 retest → $175–182, then $190–205.",
      "shortSetup": "**Bull-trap:** trade above $165–170, fail to hold, close back below $158–160 → $150, then $145. **Gap-failure:** daily close below $145 with a failed reclaim → $136–140, then $123–130.",
      "preferred": "**Long preferred** — do not chase",
      "h4": "Gap $126→$145 left nothing under price to $137; the 08-06 low $152.70 holds it up.",
      "h4Effect": "The 08-04 gap is why this row has no 4H zone near price: the frame has no traded bar between ~$137 and $145, so every zone the displacement left sits below the gap and outside the cap. The nearest CONFIRMED 4H swing low is $132.42 — the 08-06 low $152.70 is one bar young and not structure yet, which is the honest state of a name three sessions off a 15% gap. Overhead is the $163.69 swing and the $166.06 high; price is inside daily supply $153.24–161.08 with the 4H histogram already negative. Rejection under $160 puts $152.70 in play, and under it there is air to $137."
    },
    {
      "ticker": "AXON",
      "date": "2026-08-06",
      "price": 522.46,
      "atr": 35.83,
      "atrPct": 6.86,
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
          "w": 314,
          "m": 73
        }
      },
      "ind": {
        "rsi": 47.94,
        "macdHist": 1.743,
        "obvSlope": 1
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": 1,
        "R": -1,
        "M": -1,
        "O": 1,
        "Z": 0
      },
      "score": 0,
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
          "rsi": 52.75,
          "ema50": 520.99,
          "ema200": 431.6,
          "missing": []
        },
        "d": {
          "score": 1,
          "band": "range / transition",
          "S": 0,
          "E": 1,
          "A": -1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 47.94,
          "ema50": 512.24,
          "ema200": 518.78,
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
          "rsi": 51.1,
          "ema50": 421.63,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": 4,
          "band": "uptrend",
          "S": 1,
          "E": 0,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 43.73,
          "ema50": 536.2,
          "ema200": 495.32,
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
          "lo": 498.3,
          "hi": 520.18,
          "strength": "weak",
          "touches": 6,
          "closesIn": 11,
          "formVol": 2.16,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-02-25"
        },
        {
          "lo": 456.61,
          "hi": 490.12,
          "strength": "weak",
          "touches": 4,
          "closesIn": 4,
          "formVol": 1.3,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-06-02"
        },
        {
          "lo": 440,
          "hi": 464.83,
          "strength": "fresh",
          "touches": 0,
          "closesIn": 0,
          "formVol": 1.63,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-06-26"
        }
      ],
      "supply": [
        {
          "lo": 587,
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
          "hi": 740,
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
          "lo": 521.04,
          "hi": 551.61,
          "strength": "weak",
          "touches": 4,
          "closesIn": 19,
          "formVol": 1.54,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-06-30",
          "frame": "4h"
        },
        {
          "lo": 514.76,
          "hi": 521.97,
          "strength": "tested",
          "touches": 1,
          "closesIn": 0,
          "formVol": 1.02,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-07-31",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 510,
          "hi": 532.18,
          "strength": "weak",
          "touches": 4,
          "closesIn": 9,
          "formVol": 0.58,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-07-20",
          "frame": "4h"
        },
        {
          "lo": 541.26,
          "hi": 542.06,
          "strength": "weak",
          "touches": 3,
          "closesIn": 0,
          "formVol": 0.66,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-07-15",
          "frame": "4h"
        }
      ],
      "position": "between demand $498.30–520.18 (0.4% below) and supply $587.00–611.21 (12.4% above)",
      "bull": "close above $587.00–611.21 → $703.03–740.00",
      "bear": "close below $498.30–520.18 → $456.61–490.12",
      "retest": "a break above $587.00–611.21 likely retests it as support",
      "longCandidate": "Nothing before **08-11** — the post-earnings gate. The pre-earnings breakout thesis ($575–585 hold with a 4H higher low) is SUSPENDED, not cancelled and not confirmed: it was written when monthly, weekly and daily all read bullish, and all three are neutral now. Re-read the frames when the gate lapses; $502.72 has to still be intact.",
      "longSetup": "Hold $575–585, or the current $605–610 higher low, then break $620–630 → $650–670, then $695–710. A clean hold above $630 confirms continuation.",
      "shortSetup": "Countertrend only: reject $620–630 and lose $585 → $555–545. Daily acceptance below $545 opens $525–515, then $480–468.",
      "preferred": "**Stand aside to 08-11** — post-earnings",
      "h4": "−14% into the 200-EMA $521. $515–522 is the hold; $502.72 is the last higher low.",
      "h4Effect": "The 4H frame still reads bullish, but on 532.92→564.24 highs and 485.74→502.72 lows — NOT on the $628.22 print, which was the crash bar's own wick and is no longer a confirmed pivot. Price is sitting on a real confluence: 4H demand $514.76–521.97 tested, the 4H 200-EMA $521.18, the lower band $513.50 and the top of daily demand $498.30–520.18. That is the level the row turns on. A 4H close under $502.72 ends the 4H uptrend and hands the frame to the daily neutral, with $498.30–520.18 the only thing under it. Stochastics at 4.09/16.50 means the first bounce is likely mechanical and proves nothing — it is the second test that reads.",
      "note": "TIMING GATE, set 2026-08-07: no entry on this row until the THIRD session after the earnings reaction — 08-06 is day 0, so 08-07 / 08-10 pass and 08-11 is the first actionable session. The levels below stay live and keep being refreshed; the gate governs when a plan may be taken, not what the plan is. It is a date, so it expires by itself: on 08-11 the row goes back to its computed stance, and `preferred` needs rewriting that morning rather than being left to read stale. Anchored to the -14.28% 08-06 session as the reaction bar; if the report was a different day, move both dates."
    },
    {
      "ticker": "INTC",
      "date": "2026-08-06",
      "price": 99.81,
      "atr": 8.28,
      "atrPct": 8.29,
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
          "w": 314,
          "m": 73
        }
      },
      "ind": {
        "rsi": 48.48,
        "macdHist": 1.281,
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
          "rsi": 55.14,
          "ema50": 71.67,
          "ema200": 46.62,
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
          "rsi": 48.48,
          "ema50": 103.07,
          "ema200": 76.2,
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
          "rsi": 64.29,
          "ema50": 49.08,
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
          "E": -1,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 54.03,
          "ema50": 101.18,
          "ema200": 94.38,
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
          "lo": 98.33,
          "hi": 112.99,
          "strength": "weak",
          "touches": 8,
          "closesIn": 13,
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
          "closesIn": 2,
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
          "hi": 109,
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
          "touches": 3,
          "closesIn": 0,
          "formVol": 0.95,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-13",
          "frame": "4h"
        },
        {
          "lo": 109.49,
          "hi": 110,
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
      "h4": "Below all three EMAs (**$91.12 / $94.40 / $105.04**). The bounce is fading and OBV is at new lows.",
      "h4Effect": "Keeps the short read intact. The rebound stalled under the 9-EMA $91.12 with Stoch crossing down from overbought; losing the $88.60 midline re-opens the $79.99 lower band."
    },
    {
      "ticker": "LITE",
      "date": "2026-08-06",
      "price": 838.06,
      "atr": 78.66,
      "atrPct": 9.39,
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
          "w": 314,
          "m": 73
        }
      },
      "ind": {
        "rsi": 55.22,
        "macdHist": 16.464,
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
          "rsi": 57.19,
          "ema50": 596.17,
          "ema200": 272.88,
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
          "rsi": 55.22,
          "ema50": 797.63,
          "ema200": 640.96,
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
          "rsi": 77.73,
          "ema50": 282.19,
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
          "rsi": 58.98,
          "ema50": 779.08,
          "ema200": 775.61,
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
        },
        {
          "lo": 578.3,
          "hi": 656,
          "strength": "weak",
          "touches": 4,
          "closesIn": 4,
          "formVol": 1.74,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-03-16"
        }
      ],
      "supply": [
        {
          "lo": 762.99,
          "hi": 852.78,
          "strength": "weak",
          "touches": 4,
          "closesIn": 7,
          "formVol": 1.04,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-24"
        },
        {
          "lo": 874.86,
          "hi": 874.86,
          "strength": "structural",
          "touches": null,
          "note": "swing high, no zone formed"
        }
      ],
      "demand4h": [
        {
          "lo": 827.31,
          "hi": 855.12,
          "strength": "weak",
          "touches": 6,
          "closesIn": 21,
          "formVol": 1.65,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-05-29",
          "frame": "4h"
        },
        {
          "lo": 691.1,
          "hi": 755,
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
          "lo": 806.01,
          "hi": 874.86,
          "strength": "weak",
          "touches": 6,
          "closesIn": 14,
          "formVol": 0.96,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-06-30",
          "frame": "4h"
        },
        {
          "lo": 863,
          "hi": 901.01,
          "strength": "weak",
          "touches": 11,
          "closesIn": 8,
          "formVol": 1.17,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-06-05",
          "frame": "4h"
        }
      ],
      "position": "inside weak demand $811.45–859.68",
      "bull": "close above $762.99–852.78 → $874.86",
      "bear": "close below $811.45–859.68 → $680.66–785.49",
      "retest": "a break above $762.99–852.78 likely retests it as support",
      "longCandidate": "The stronger candidate now: two clean sessions of bullish displacement reclaimed the old supply as support. Needs one of two confirmations — a held retest or a breakout-retest — the push into $865–900 alone is not yet either.",
      "longSetup": "**Retest:** hold $820–835, reclaim → $865–900, then $930–970. **Breakout:** daily acceptance above $900, confirmed by a $875–900 retest → $930–970, then $1,000–1,070.",
      "shortSetup": "Only a confirmed rejection from **$865–900** (daily resistance $879–891 + 4H upper band ≈$899). A tag-and-fade back under ≈$850–860 raises the odds of a retest to $820–835 — do not press below there without a fresh breakdown.",
      "preferred": "**Two-way — short only on a rejection**",
      "h4": "Pressing into the $865–900 cluster — a recovery testing supply, not accepted above it.",
      "h4Effect": "Overnight price near $870 is inside the zone but not enough alone to call it broken. A regular-session close above $900 with a successful $875–900 retest opens $930–970, then $1,000–1,070. A close back under ≈$850–860 after tagging $870–900 is the bull-trap signature and raises the odds of a retest down to $820–835. The cluster is daily resistance $879–891 plus the 4H upper band ≈$899."
    },
    {
      "ticker": "MU",
      "date": "2026-08-06",
      "price": 881.47,
      "atr": 84.95,
      "atrPct": 9.64,
      "structure": {
        "m": "neutral",
        "w": "bullish",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 1011.77->930.88, lows 737.88->770.10",
          "w": "pivots: highs 471.34->1255.00, lows 192.59->311.49"
        },
        "bars": {
          "d": 1506,
          "w": 314,
          "m": 73
        }
      },
      "ind": {
        "rsi": 47.93,
        "macdHist": 0.504,
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
          "rsi": 58.87,
          "ema50": 558.44,
          "ema200": 255.41,
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
          "rsi": 47.93,
          "ema50": 890,
          "ema200": 604.65,
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
          "rsi": 70.24,
          "ema50": 271.24,
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
          "rsi": 49.44,
          "ema50": 908.01,
          "ema200": 785.04,
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
          "hi": 998,
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
          "closesIn": 16,
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
          "closesIn": 5,
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
      "position": "between demand $700.66–734.96 (16.6% below) and supply $920.95–998.00 (4.5% above)",
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
      "date": "2026-08-06",
      "price": 1258.58,
      "atr": 188.27,
      "atrPct": 14.96,
      "structure": {
        "m": null,
        "w": "bullish",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "820 4H bars",
        "why": {
          "d": "pivots: highs 1696.37->1446.62, lows 1325.03->998.19",
          "w": "pivots: highs 777.60->2354.39, lows 517.00->558.58"
        },
        "bars": {
          "d": 371,
          "w": 78,
          "m": 19
        }
      },
      "ind": {
        "rsi": 43.06,
        "macdHist": 0.943,
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
          "score": 3,
          "band": "uptrend",
          "S": 1,
          "E": 0,
          "A": 0,
          "M": 0,
          "reach": 4,
          "full": false,
          "rsi": 50.4,
          "ema50": 918.04,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
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
          "rsi": 43.06,
          "ema50": 1512.34,
          "ema200": 1013.35,
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
          "rsi": 43.35,
          "ema50": 1470.26,
          "ema200": 1359.38,
          "missing": []
        }
      },
      "trendProse": {
        "w": "uptrend",
        "d": "range / transition",
        "h4": "range / transition"
      },
      "combo": "weekly up, daily range",
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
          "hi": 784,
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
          "hi": 1800,
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
          "closesIn": 4,
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
          "touches": 5,
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
      "position": "between demand $980.28–1,112.43 (11.6% below) and supply $1,511.67–1,628.40 (20.1% above)",
      "bull": "close above $1,511.67–1,628.40 → $1,673.97–1,800.00",
      "bear": "close below $980.28–1,112.43 → $899.20–930.97",
      "retest": "a break above $1,511.67–1,628.40 likely retests it as support",
      "longCandidate": "Needs the $1,580 acceptance and a held retest to be more than a bounce — holding $1,350–1,400 alone is not that confirmation.",
      "longSetup": "Hold $1,350–1,400, then break and accept above $1,580 → $1,680–1,760.",
      "shortSetup": "The cleaner short is a rejection from $1,530–1,580 confirmed by a loss of $1,400 → $1,280–1,220. A daily close below $1,060 with a failed reclaim opens the major zone below.",
      "preferred": "**Two-way — short preferred under $1,530**",
      "h4": "Recovering sharply off the crash low, still testing resistance from below.",
      "h4Effect": "SNDK must close above $1,580 and hold the retest before the nearest supply promotes to $1,680–1,760. Failure around $1,530–1,580 combined with a loss of $1,400 opens $1,280–1,220. The $1,530–1,580 reclaim line has not been touched yet, let alone accepted."
    },
    {
      "ticker": "AMD",
      "date": "2026-08-06",
      "price": 489.28,
      "atr": 39.45,
      "atrPct": 8.06,
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
          "w": 314,
          "m": 73
        }
      },
      "ind": {
        "rsi": 47.83,
        "macdHist": -2.571,
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
          "rsi": 60.93,
          "ema50": 332.21,
          "ema200": 194.99,
          "missing": []
        },
        "d": {
          "score": 2,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": -1,
          "reach": 7,
          "full": true,
          "rsi": 47.83,
          "ema50": 487.34,
          "ema200": 350.31,
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
          "rsi": 70.25,
          "ema50": 202.74,
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
          "rsi": 47.72,
          "ema50": 503.49,
          "ema200": 430.97,
          "missing": []
        }
      },
      "trendProse": {
        "w": "uptrend",
        "d": "uptrend",
        "m": "uptrend",
        "h4": "range / transition"
      },
      "combo": "aligned uptrend — weekly and daily agree",
      "demand": [
        {
          "lo": 458.02,
          "hi": 488.45,
          "strength": "weak",
          "touches": 3,
          "closesIn": 4,
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
          "lo": 485,
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
      "position": "inside weak supply $485.00–494.97",
      "bull": "close above $485.00–494.97 → $539.69–556.49",
      "bear": "close below $458.02–488.45 → $426.05–447.58",
      "retest": "a break above $485.00–494.97 likely retests it as support",
      "longCandidate": "WAIT until the reclaim actually holds — the higher-timeframe trend is the reason to want this long, not a reason to enter early.",
      "longSetup": "Hold **$465–475**, form a 4H higher low, then reclaim and hold **$503** → $518–522, then $533–550. Stronger continuation needs acceptance above **$550**.",
      "shortSetup": "Reject from **$500–503**, or break **$475** and fail the reclaim → $465, then $446. Daily acceptance below **$446** opens $419–420.",
      "preferred": "**Two-way — short now, long above $503**",
      "h4": "Bearish after the earnings displacement — inside the $475–503 trap zone, no reversal yet.",
      "h4Effect": "This is what keeps the row at WAIT rather than a clean side: the higher-timeframe trend is still up, but the 4H has not confirmed a reversal from the earnings-day drop. A reclaim of $503 that holds resolves it long; a failed reclaim with a break of $475 resolves it short. Until one of those prints, $475–503 is a trap, not a level to trade from."
    },
    {
      "ticker": "CIEN",
      "date": "2026-08-06",
      "price": 403.76,
      "atr": 31.47,
      "atrPct": 7.79,
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
          "w": 314,
          "m": 73
        }
      },
      "ind": {
        "rsi": 48.41,
        "macdHist": 6.309,
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
          "score": 2,
          "band": "uptrend",
          "S": 0,
          "E": 1,
          "A": 1,
          "M": -1,
          "reach": 7,
          "full": true,
          "rsi": 49.57,
          "ema50": 342.09,
          "ema200": 170.27,
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
          "rsi": 48.41,
          "ema50": 431.54,
          "ema200": 365.5,
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
          "rsi": 65.17,
          "ema50": 175.18,
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
          "rsi": 53.57,
          "ema50": 407.85,
          "ema200": 428.66,
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
          "lo": 400,
          "hi": 460.33,
          "strength": "weak",
          "touches": 9,
          "closesIn": 19,
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
          "closesIn": 6,
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
          "strength": "tested",
          "touches": 2,
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
          "closesIn": 10,
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
      "h4": "Bounced **$325 → ~$400**, faded back under the **$380.70** average. RSI **51.06** at the midline."
    },
    {
      "ticker": "CRWV",
      "date": "2026-08-06",
      "price": 85.33,
      "atr": 7.73,
      "atrPct": 9.06,
      "structure": {
        "m": null,
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "761 4H bars",
        "why": {
          "d": "pivots: highs 85.37->94.30, lows 68.51->60.55",
          "w": "pivots: highs 138.25->132.15, lows 94.82->91.02"
        },
        "bars": {
          "d": 341,
          "w": 72,
          "m": 18
        }
      },
      "ind": {
        "rsi": 51.66,
        "macdHist": 2.77,
        "obvSlope": -1
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": 0,
        "R": 1,
        "M": -1,
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
          "E": 0,
          "A": 0,
          "M": -1,
          "reach": 4,
          "full": false,
          "rsi": 47.22,
          "ema50": 95.98,
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
          "A": -1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 51.66,
          "ema50": 88.51,
          "ema200": 96.52,
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
          "rsi": 55.38,
          "ema50": 82.93,
          "ema200": 92.76,
          "missing": []
        }
      },
      "trendProse": {
        "w": "range / transition",
        "d": "downtrend",
        "h4": "uptrend"
      },
      "combo": "weekly range, daily down",
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
          "lo": 74.92,
          "hi": 87.7,
          "strength": "weak",
          "touches": 17,
          "closesIn": 36,
          "formVol": 1.44,
          "heavyTouches": 4,
          "origin": "strong",
          "since": "2026-07-23"
        },
        {
          "lo": 87.36,
          "hi": 99.5,
          "strength": "weak",
          "touches": 13,
          "closesIn": 34,
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
          "lo": 94,
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
      "position": "inside weak supply $74.92–87.70",
      "bull": "close above $74.92–87.70 → $106.93–120.82",
      "bear": "close below $71.85–72.99",
      "retest": "a break above $74.92–87.70 likely retests it as support",
      "longCandidate": "Long only after **$60–65** holds and **$74–80** is reclaimed.",
      "longSetup": "Countertrend only after $60–65 holds and **$80** is reclaimed",
      "shortSetup": "Reject $74–80 or lose **$60** → $49–52",
      "preferred": "**Short preferred**",
      "h4": "Relief bounce is failing — price is back under the 4H resistance and moving averages."
    },
    {
      "ticker": "GLW",
      "date": "2026-08-06",
      "price": 157.18,
      "atr": 14.2,
      "atrPct": 9.04,
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
          "w": 314,
          "m": 73
        }
      },
      "ind": {
        "rsi": 47.57,
        "macdHist": 2.29,
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
          "rsi": 50.17,
          "ema50": 134.25,
          "ema200": 77.22,
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
          "rsi": 47.57,
          "ema50": 169.28,
          "ema200": 142.5,
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
          "rsi": 59.32,
          "ema50": 79.43,
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
          "rsi": 54.01,
          "ema50": 161.13,
          "ema200": 165.31,
          "missing": []
        }
      },
      "trendProse": {
        "w": "uptrend",
        "d": "range / transition",
        "m": "range / transition",
        "h4": "downtrend"
      },
      "combo": "weekly up, daily range",
      "demand": [
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
        },
        {
          "lo": 123.9,
          "hi": 133.08,
          "strength": "weak",
          "touches": 4,
          "closesIn": 9,
          "formVol": 1.61,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-03-19"
        }
      ],
      "supply": [
        {
          "lo": 152.26,
          "hi": 160.98,
          "strength": "weak",
          "touches": 1,
          "closesIn": 3,
          "formVol": 1.86,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-07-23"
        },
        {
          "lo": 168,
          "hi": 172.95,
          "strength": "weak",
          "touches": 7,
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
          "lo": 152.26,
          "hi": 160.98,
          "strength": "weak",
          "touches": 2,
          "closesIn": 6,
          "formVol": 0.53,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-07-23",
          "frame": "4h"
        },
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
        }
      ],
      "position": "inside weak supply $152.26–160.98",
      "bull": "close above $152.26–160.98 → $168.00–172.95",
      "bear": "close below $136.35–147.92 → $123.90–133.08",
      "retest": "a break above $152.26–160.98 likely retests it as support",
      "longCandidate": "Countertrend only, and it needs all three: demand holding, a 4H higher low, and acceptance back above **$145–150**. The weekly stays damaged below **$178–192**.",
      "longSetup": "Hold **$122–126** or **$114–120**, form a 4H higher low and reclaim **$145–150** → **$156–165**, then **$178**. A stronger daily reversal needs acceptance above **$160–165**.",
      "shortSetup": "The cleaner short is a rejection from **$143–150**, or a stronger bounce into **$156–165** → $126–122, then $120–114. A daily close below **$114** with a failed reclaim opens **$105–100**. Do not chase a breakdown directly into $122–126.",
      "preferred": "**Short preferred**; long on confirmation",
      "h4": "The rebound from **$114.50** has stalled and is shaping a potential lower high at **$143–150**."
    },
    {
      "ticker": "META",
      "date": "2026-08-06",
      "price": 589.9,
      "atr": 24,
      "atrPct": 4.07,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 686.08->655.88, lows 626.00->524.49",
          "w": "pivots: highs 643.00->686.08, lows 592.60->540.18"
        },
        "bars": {
          "d": 1506,
          "w": 314,
          "m": 73
        }
      },
      "ind": {
        "rsi": 47,
        "macdHist": -3.718,
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
          "rsi": 47.13,
          "ema50": 625.03,
          "ema200": 517.29,
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
          "rsi": 47,
          "ema50": 604.36,
          "ema200": 627.69,
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
          "rsi": 50.55,
          "ema50": 501.22,
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
          "rsi": 48.64,
          "ema50": 599.64,
          "ema200": 612.99,
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
          "closesIn": 8,
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
          "lo": 585.39,
          "hi": 592,
          "strength": "weak",
          "touches": 6,
          "closesIn": 5,
          "formVol": 1.15,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-06-08"
        },
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
          "lo": 603,
          "hi": 624.17,
          "strength": "weak",
          "touches": 15,
          "closesIn": 5,
          "formVol": 1.67,
          "heavyTouches": 7,
          "origin": "strong",
          "since": "2026-06-03"
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
          "lo": 577.1,
          "hi": 591.3,
          "strength": "weak",
          "touches": 8,
          "closesIn": 13,
          "formVol": 1.1,
          "heavyTouches": 3,
          "origin": "thin",
          "since": "2026-06-10",
          "frame": "4h"
        },
        {
          "lo": 593.66,
          "hi": 597,
          "strength": "weak",
          "touches": 4,
          "closesIn": 1,
          "formVol": 2.15,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-07-28",
          "frame": "4h"
        }
      ],
      "position": "inside weak demand $581.76–600.29",
      "bull": "close above $585.39–592.00 → $593.87–611.26",
      "bear": "close below $581.76–600.29 → $540.40–550.25",
      "retest": "a break above $585.39–592.00 likely retests it as support",
      "longCandidate": "Countertrend long from **$520–545** after 4H confirmation.",
      "longSetup": "Hold $520–545, form higher low and reclaim **$575–590** → $599–635",
      "shortSetup": "Reject $575–610, or lose **$520** → $500–490, then $470–450",
      "preferred": "**Short trend; long only countertrend**",
      "h4": "Rebound off **$529.10** rejected at **$577.34** — an attempt, not a turn: **neutral**."
    },
    {
      "ticker": "MRVL",
      "date": "2026-08-06",
      "price": 210.54,
      "atr": 19.33,
      "atrPct": 9.18,
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
          "w": 314,
          "m": 73
        }
      },
      "ind": {
        "rsi": 49.63,
        "macdHist": 3.864,
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
          "rsi": 57.09,
          "ema50": 148.83,
          "ema200": 93.82,
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
          "rsi": 49.63,
          "ema50": 213.71,
          "ema200": 157.47,
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
          "rsi": 63.04,
          "ema50": 96.23,
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
          "rsi": 54.97,
          "ema50": 211.2,
          "ema200": 193.06,
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
          "lo": 193.01,
          "hi": 214.92,
          "strength": "weak",
          "touches": 2,
          "closesIn": 3,
          "formVol": 0.68,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-23"
        },
        {
          "lo": 217.53,
          "hi": 228.8,
          "strength": "tested",
          "touches": 2,
          "closesIn": 1,
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
        }
      ],
      "demand4h": [
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
        },
        {
          "lo": 187.25,
          "hi": 199.38,
          "strength": "weak",
          "touches": 3,
          "closesIn": 8,
          "formVol": 1.37,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-07-31",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 202.21,
          "hi": 219.88,
          "strength": "weak",
          "touches": 5,
          "closesIn": 11,
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
      "position": "inside weak supply $193.01–214.92",
      "bull": "close above $193.01–214.92 → $217.53–228.80",
      "bear": "close below $187.12–199.38 → $162.85–176.27",
      "retest": "a break above $193.01–214.92 likely retests it as support",
      "longCandidate": "Countertrend only — **$160–170** must produce a genuine structure change, not merely one green candle.",
      "longSetup": "Hold **$160–170**, form a 4H higher low, reclaim **$193–201** → **$213–225**. A stronger trend reversal requires acceptance above **$213–225**.",
      "shortSetup": "Wait for a rebound toward **$193–201** and assess whether sellers return; reject → $170–160, then $155–143. A daily close below **$160** with a failed reclaim → $155–143, then **$140–125**.",
      "preferred": "**Short preferred**, not near demand",
      "h4": "Rebound formed a **lower high near $199–201**; price remains below the 9, 50 and 200 EMAs."
    },
    {
      "ticker": "SMH",
      "date": "2026-08-06",
      "price": 571.48,
      "atr": 26.74,
      "atrPct": 4.68,
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
          "w": 314,
          "m": 73
        }
      },
      "ind": {
        "rsi": 50.16,
        "macdHist": 2.622,
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
          "rsi": 58.59,
          "ema50": 455.57,
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
          "rsi": 50.16,
          "ema50": 569.9,
          "ema200": 474.06,
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
          "rsi": 71.04,
          "ema50": 291.27,
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
          "rsi": 54.61,
          "ema50": 570.48,
          "ema200": 538.76,
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
          "touches": 7,
          "closesIn": 18,
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
          "closesIn": 2,
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
          "closesIn": 11,
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
          "lo": 578.3,
          "hi": 581.04,
          "strength": "weak",
          "touches": 9,
          "closesIn": 2,
          "formVol": 1.63,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-05-14",
          "frame": "4h"
        },
        {
          "lo": 585.63,
          "hi": 607,
          "strength": "weak",
          "touches": 9,
          "closesIn": 15,
          "formVol": 2.04,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-07-13",
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
      "h4": "Bounced off **$495** to **$552.87**, then stalled back under it. RSI **47.60**, OBV drifting lower."
    },
    {
      "ticker": "AKAM",
      "date": "2026-08-06",
      "price": 118.55,
      "atr": 5.65,
      "atrPct": 4.76,
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
          "w": 314,
          "m": 73
        }
      },
      "ind": {
        "rsi": 48.31,
        "macdHist": 0.862,
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
      "score": -2,
      "bias": "bearish",
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
          "rsi": 51.58,
          "ema50": 107.62,
          "ema200": 98.72,
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
          "rsi": 48.31,
          "ema50": 121.7,
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
          "rsi": 56.89,
          "ema50": 99.7,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": -1,
          "band": "range / transition",
          "S": -1,
          "E": 0,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 50.48,
          "ema50": 119.69,
          "ema200": 119.17,
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
          "lo": 107.27,
          "hi": 117.94,
          "strength": "weak",
          "touches": 6,
          "closesIn": 16,
          "formVol": 3.08,
          "heavyTouches": 1,
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
          "lo": 115.37,
          "hi": 119.08,
          "strength": "weak",
          "touches": 2,
          "closesIn": 2,
          "formVol": 0.74,
          "heavyTouches": 0,
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
        },
        {
          "lo": 134.2,
          "hi": 136.85,
          "strength": "fresh",
          "touches": 0,
          "closesIn": 0,
          "formVol": 0.97,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-06-15"
        }
      ],
      "demand4h": [
        {
          "lo": 112.3,
          "hi": 118.02,
          "strength": "weak",
          "touches": 5,
          "closesIn": 10,
          "formVol": 1.81,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-07-07",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 119.84,
          "hi": 122.9,
          "strength": "weak",
          "touches": 5,
          "closesIn": 5,
          "formVol": 1.31,
          "heavyTouches": 3,
          "origin": "strong",
          "since": "2026-06-23",
          "frame": "4h"
        },
        {
          "lo": 121.81,
          "hi": 125.77,
          "strength": "weak",
          "touches": 1,
          "closesIn": 4,
          "formVol": 0.93,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-07-23",
          "frame": "4h"
        }
      ],
      "position": "inside weak supply $115.37–119.08",
      "bull": "close above $115.37–119.08 → $134.20–136.85",
      "bear": "close below $107.27–117.94 → $96.98–102.98",
      "retest": "a break above $115.37–119.08 likely retests it as support",
      "longCandidate": "Long only after acceptance above **$119.22**.",
      "longSetup": "Trend changes only above **$119.22** → $124–126",
      "shortSetup": "Reject **$115–119** or lose **$107.27** → $102–104",
      "preferred": "**Short preferred**",
      "h4": "Stalling beneath **$116.8–118**. MACD fading, stochastic rolling over from overbought.",
      "h4Effect": "Keeps the **neutral-to-bearish** bias. Failure below $118 favors **$112**, then **$108**. A 4H close above $118 would open $121–124."
    },
    {
      "ticker": "QCOM",
      "date": "2026-08-06",
      "price": 160.39,
      "atr": 9.28,
      "atrPct": 5.79,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "bearish",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 178.65->163.48, lows 164.77->142.89",
          "w": "pivots: highs 146.94->259.92, lows 132.73->121.99"
        },
        "bars": {
          "d": 1506,
          "w": 314,
          "m": 73
        }
      },
      "ind": {
        "rsi": 41.91,
        "macdHist": 0.35,
        "obvSlope": -1
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": -1,
        "R": -1,
        "M": 1,
        "O": -1,
        "Z": 0
      },
      "score": -1,
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
          "rsi": 45.9,
          "ema50": 170.58,
          "ema200": 157.07,
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
          "rsi": 41.91,
          "ema50": 178.67,
          "ema200": 171.81,
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
          "rsi": 49.5,
          "ema50": 155.83,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": -6,
          "band": "strong downtrend",
          "S": -1,
          "E": -1,
          "A": -1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 46.66,
          "ema50": 170.65,
          "ema200": 177.46,
          "missing": []
        }
      },
      "trendProse": {
        "w": "downtrend",
        "d": "range / transition",
        "m": "range / transition",
        "h4": "strong downtrend"
      },
      "combo": "weekly down, daily range",
      "demand": [
        {
          "lo": 159.58,
          "hi": 161.83,
          "strength": "weak",
          "touches": 11,
          "closesIn": 5,
          "formVol": 0.92,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2025-09-12"
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
        },
        {
          "lo": 135.05,
          "hi": 138.12,
          "strength": "tested",
          "touches": 1,
          "closesIn": 0,
          "formVol": 1.69,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-04-21"
        }
      ],
      "supply": [
        {
          "lo": 161.39,
          "hi": 167.51,
          "strength": "weak",
          "touches": 6,
          "closesIn": 4,
          "formVol": 1.42,
          "heavyTouches": 3,
          "origin": "strong",
          "since": "2026-01-15"
        },
        {
          "lo": 165.46,
          "hi": 171.98,
          "strength": "weak",
          "touches": 14,
          "closesIn": 22,
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
        }
      ],
      "demand4h": [
        {
          "lo": 142.89,
          "hi": 142.89,
          "strength": "structural",
          "touches": null,
          "note": "swing low, no zone formed",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 162.84,
          "hi": 165.9,
          "strength": "weak",
          "touches": 3,
          "closesIn": 0,
          "formVol": 1.61,
          "heavyTouches": 0,
          "origin": "strong",
          "since": "2026-07-28",
          "frame": "4h"
        },
        {
          "lo": 168.24,
          "hi": 171.19,
          "strength": "tested",
          "touches": 1,
          "closesIn": 0,
          "formVol": 1.11,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-27",
          "frame": "4h"
        }
      ],
      "position": "inside weak demand $159.58–161.83",
      "bull": "close above $161.39–167.51 → $180.19–184.07",
      "bear": "close below $159.58–161.83 → $147.05–156.31",
      "retest": "a break above $161.39–167.51 likely retests it as support",
      "longCandidate": "Tactical long only if $148–152 holds and price closes above $160–162; a genuine trend reversal needs acceptance above $172–180.",
      "longSetup": "**Tactical long:** hold $148–152, enter on a retest after a 4H close above $160–162, stop below $148 or $142 depending on entry → $168–172, then $178–180 and $188–196. Higher-confidence trend long only after a daily close and hold above $172.",
      "shortSetup": "**Rejection short:** fade $160–162, or preferably $168–172, stop above $163 or $174 depending on entry → $150, $142–145, then $134–138. **Breakdown short:** daily close below $142 and a failed retest → $134–138, then $121–125.",
      "preferred": "**Short preferred**, do not chase into demand",
      "h4": "Relief bounce off major demand — above the fast EMA, under the 50/200-day, no reversal yet.",
      "h4Effect": "Keeps the short read. A 4H close above $160–162 with a successful retest is what would flip this to a tactical long; below $148 the bounce fails outright."
    },
    {
      "ticker": "TE",
      "date": "2026-08-06",
      "price": 5.55,
      "atr": 0.81,
      "atrPct": 14.51,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "bearish",
        "h4Note": "805 4H bars",
        "why": {
          "d": "pivots: highs 10.08->6.30, lows 5.55->3.49",
          "w": "pivots: highs 12.49->10.90, lows 3.74->7.36"
        },
        "bars": {
          "d": 1506,
          "w": 314,
          "m": 73
        }
      },
      "ind": {
        "rsi": 45.56,
        "macdHist": 0.137,
        "obvSlope": 1
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": -1,
        "R": -1,
        "M": 1,
        "O": 1,
        "Z": 0
      },
      "score": 0,
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
          "rsi": 46.47,
          "ema50": 5.69,
          "ema200": 5.43,
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
          "rsi": 45.56,
          "ema50": 6.6,
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
          "rsi": 51.94,
          "ema50": 5.73,
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
          "A": -1,
          "M": 1,
          "reach": 7,
          "full": true,
          "rsi": 53.51,
          "ema50": 5.9,
          "ema200": 6.8,
          "missing": []
        }
      },
      "trendProse": {
        "w": "downtrend",
        "d": "range / transition",
        "m": "range / transition",
        "h4": "strong downtrend"
      },
      "combo": "weekly down, daily range",
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
          "lo": 5,
          "hi": 5.7,
          "strength": "weak",
          "touches": 1,
          "closesIn": 3,
          "formVol": 1.06,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-24"
        },
        {
          "lo": 5.76,
          "hi": 6.25,
          "strength": "weak",
          "touches": 5,
          "closesIn": 8,
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
      "position": "inside weak supply $5.00–5.70",
      "bull": "close above $5.00–5.70 → $5.76–6.25",
      "bear": "close below $4.45–4.74 → $3.23–4.11",
      "retest": "a break above $5.00–5.70 likely retests it as support",
      "longCandidate": "Countertrend long if **$3.65–3.70** holds and **$4.30–4.53** is reclaimed.",
      "longSetup": "Hold $3.65–3.70 and reclaim **$4.30–4.53** → $4.72–5.34",
      "shortSetup": "Reject $4.53–4.72 or lose **$3.50** → $3.00–2.50",
      "preferred": "**Short trend; long only countertrend**",
      "h4": "The bounce from **$3.55–3.70** is losing momentum — below every 4H average, stochastic down.",
      "h4Effect": "The countertrend long is **not confirmed yet**. Better long trigger: hold $3.65–3.70 and reclaim **$4.30–4.53**. Below $3.55 invalidates the immediate bounce thesis."
    },
    {
      "ticker": "TSLA",
      "date": "2026-08-06",
      "price": 319.53,
      "atr": 14.87,
      "atrPct": 4.65,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "bearish",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 413.16->329.57, lows 389.30->297.38",
          "w": "pivots: highs 453.40->432.86, lows 337.24->368.60"
        },
        "bars": {
          "d": 1506,
          "w": 314,
          "m": 73
        }
      },
      "ind": {
        "rsi": 36.94,
        "macdHist": -0.354,
        "obvSlope": -1
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": -1,
        "R": -1,
        "M": 1,
        "O": -1,
        "Z": 0
      },
      "score": -1,
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
          "rsi": 37,
          "ema50": 382.2,
          "ema200": 318.07,
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
          "rsi": 36.94,
          "ema50": 368.68,
          "ema200": 387.83,
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
          "rsi": 47.16,
          "ema50": 316.51,
          "ema200": null,
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": -6,
          "band": "strong downtrend",
          "S": -1,
          "E": -1,
          "A": -1,
          "M": 0,
          "reach": 7,
          "full": true,
          "rsi": 39.99,
          "ema50": 348.1,
          "ema200": 384.12,
          "missing": []
        }
      },
      "trendProse": {
        "w": "downtrend",
        "d": "downtrend",
        "m": "range / transition",
        "h4": "strong downtrend"
      },
      "combo": "aligned downtrend — weekly and daily agree",
      "demand": [
        {
          "lo": 306.93,
          "hi": 319.91,
          "strength": "weak",
          "touches": 3,
          "closesIn": 7,
          "formVol": 0.93,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2025-08-06"
        },
        {
          "lo": 314.6,
          "hi": 335.79,
          "strength": "weak",
          "touches": 6,
          "closesIn": 8,
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
          "touches": 7,
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
          "lo": 297.38,
          "hi": 297.38,
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
          "strength": "tested",
          "touches": 2,
          "closesIn": 1,
          "formVol": 1.82,
          "heavyTouches": 1,
          "origin": "strong",
          "since": "2026-07-23",
          "frame": "4h"
        }
      ],
      "position": "inside weak demand $306.93–319.91",
      "bull": "close above $329.62–336.27 → $361.51–387.48",
      "bear": "close below $306.93–319.91 → $297.38",
      "retest": "a break above $329.62–336.27 likely retests it as support",
      "longCandidate": "A **bounce trade only** — countertrend until TSLA recovers $365–387.",
      "longSetup": "Hold **$297–305**, form a 4H higher low, reclaim **$315** then **$324–330** → targets **$350–365**. A stronger reversal only above **$365–387**; below that region the dominant trend stays bearish.",
      "shortSetup": "Wait for a bounce toward **$324–330**, then short only after rejection AND a break of the 4H rejection candle's low → $305–297. A daily close below **$297** with a failed reclaim targets **$286–282**, then **$260–250**.",
      "preferred": "**Short preferred with trend**",
      "h4": "Stabilising **$300–311**, still below the declining **$329**, **$342** and **$372**."
    },
    {
      "ticker": "ADBE",
      "date": "2026-08-06",
      "price": 260.24,
      "atr": 11.54,
      "atrPct": 4.43,
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
          "w": 314,
          "m": 73
        }
      },
      "ind": {
        "rsi": 63.86,
        "macdHist": 2.811,
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
          "rsi": 52.54,
          "ema50": 283.07,
          "ema200": 390.38,
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
          "rsi": 63.86,
          "ema50": 235.36,
          "ema200": 272.65,
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
          "rsi": 38.76,
          "ema50": 390.42,
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
          "rsi": 63.61,
          "ema50": 238.55,
          "ema200": 242.68,
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
          "lo": 256.6,
          "hi": 261.59,
          "strength": "weak",
          "touches": 9,
          "closesIn": 6,
          "formVol": 0.97,
          "heavyTouches": 3,
          "origin": "thin",
          "since": "2026-02-26"
        },
        {
          "lo": 260.05,
          "hi": 270.99,
          "strength": "weak",
          "touches": 8,
          "closesIn": 4,
          "formVol": 0.98,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2026-03-03"
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
          "lo": 251.44,
          "hi": 263.5,
          "strength": "weak",
          "touches": 7,
          "closesIn": 4,
          "formVol": 1.18,
          "heavyTouches": 2,
          "origin": "thin",
          "since": "2026-06-05"
        },
        {
          "lo": 267.23,
          "hi": 282.9,
          "strength": "weak",
          "touches": 8,
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
        }
      ],
      "demand4h": [
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
        },
        {
          "lo": 240.26,
          "hi": 252.95,
          "strength": "weak",
          "touches": 8,
          "closesIn": 9,
          "formVol": 1.77,
          "heavyTouches": 2,
          "origin": "strong",
          "since": "2026-07-28",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 261.01,
          "hi": 261.01,
          "strength": "structural",
          "touches": null,
          "note": "swing high, no zone formed",
          "frame": "4h"
        }
      ],
      "position": "inside weak demand $256.60–261.59",
      "bull": "close above $251.44–263.50 → $267.23–282.90",
      "bear": "close below $256.60–261.59 → $241.69–249.18",
      "retest": "a break above $251.44–263.50 likely retests it as support",
      "longCandidate": "Countertrend only, and only while **$239–243** holds. Acceptance above **$284** would weaken the short case outright.",
      "longSetup": "Hold **$239–243** and form a 4H higher low → **$263–266**. A daily close above **$266** with a successful retest opens **$273–284**, then **$300–316**.",
      "shortSetup": "Rejection at **$263–274**, into the falling 200-day and recent supply → $243–239, then $231–225. A daily close below **$225** with a failed reclaim opens **$205–200**.",
      "preferred": "**Short preferred**; tactical longs allowed",
      "h4": "Short-term uptrend consolidating above the moving-average cluster, holding under **$263–266**.",
      "h4Effect": "The tactical long lives here: while $239–243 holds, a 4H higher low targets $263–266. It is the frame that would break first — losing $239 hands the read back to the weekly downtrend."
    },
    {
      "ticker": "TTD",
      "date": "2026-08-06",
      "price": 17.67,
      "atr": 1.03,
      "atrPct": 5.82,
      "structure": {
        "m": "bearish",
        "w": "bearish",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1706 4H bars",
        "why": {
          "d": "pivots: highs 19.99->19.51, lows 16.70->17.71",
          "w": "pivots: highs 23.57->20.53, lows 16.98->16.70"
        },
        "bars": {
          "d": 1506,
          "w": 314,
          "m": 73
        }
      },
      "ind": {
        "rsi": 43.33,
        "macdHist": 0.066,
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
          "rsi": 32.23,
          "ema50": 33.19,
          "ema200": 59.35,
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
          "rsi": 43.33,
          "ema50": 19.36,
          "ema200": 30.28,
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
          "rsi": 32.36,
          "ema50": 57.97,
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
          "rsi": 42.91,
          "ema50": 18.62,
          "ema200": 21.62,
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
      "demand": [
        {
          "lo": 16.98,
          "hi": 16.98,
          "strength": "structural",
          "touches": null,
          "note": "swing low, no zone formed"
        },
        {
          "lo": 16.7,
          "hi": 16.7,
          "strength": "structural",
          "touches": null,
          "note": "swing low, no zone formed"
        }
      ],
      "supply": [
        {
          "lo": 17.96,
          "hi": 19.37,
          "strength": "weak",
          "touches": 3,
          "closesIn": 3,
          "formVol": 2.99,
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
        },
        {
          "lo": 20.56,
          "hi": 21.03,
          "strength": "weak",
          "touches": 3,
          "closesIn": 0,
          "formVol": 1.16,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-06-03"
        }
      ],
      "demand4h": [
        {
          "lo": 16.98,
          "hi": 18.02,
          "strength": "weak",
          "touches": 8,
          "closesIn": 10,
          "formVol": 0.92,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-06-25",
          "frame": "4h"
        }
      ],
      "supply4h": [
        {
          "lo": 18.14,
          "hi": 18.28,
          "strength": "weak",
          "touches": 4,
          "closesIn": 3,
          "formVol": 1.2,
          "heavyTouches": 1,
          "origin": "thin",
          "since": "2026-07-21",
          "frame": "4h"
        },
        {
          "lo": 18.54,
          "hi": 19.12,
          "strength": "weak",
          "touches": 4,
          "closesIn": 7,
          "formVol": 0.81,
          "heavyTouches": 0,
          "origin": "thin",
          "since": "2026-07-20",
          "frame": "4h"
        }
      ],
      "position": "between demand $16.98 (3.9% below) and supply $17.96–19.37 (1.6% above)",
      "bull": "close above $17.96–19.37 → $20.56–21.03",
      "bear": "close below $16.98 → $16.70",
      "retest": "a break above $17.96–19.37 likely retests it as support",
      "longCandidate": "Countertrend, and only after **$17.4–17.7** holds and **$18.2–18.3** is reclaimed. Not a credible swing long until TTD accepts above **$19.5–20.7**.",
      "longSetup": "Hold **$17.4–17.7**, form a 4H higher low and reclaim **$18.2–18.3** → **$18.7**, then **$19.1–19.5**. Daily acceptance above **$19.5** opens **$20.2–20.7**; a credible trend reversal needs a breakout above **$20.7** and a successful retest, which opens **$23.5–24.5**.",
      "shortSetup": "Rejection from **$18.7–19.5** with a 4H lower high → $17.7–17.4, then $17.0–16.5. The stronger short is **$20.2–20.7** if it is reached and rejected. A daily close below **$17.3** with a failed reclaim → **$16.5–16.0**, with **$15.5** as the extended target.",
      "preferred": "**Two-way watch** — swing short preferred",
      "h4": "Downtrend after the **$19.5** rejection. Oversold at lower-band demand — a bounce setup, not a turn.",
      "h4Effect": "This frame is what makes it a two-way watch rather than a short: oversold at demand argues a bounce toward **$18.3–18.7** first, and the cleaner short is that bounce failing at **$18.7–19.5**."
    }
  ],
  "note": "Structure only — where demand and supply sit and what triggers which way. Independent of the traded plans on the cards; the two are allowed to disagree.",
  "ranking": [
    "**LITE two-way** — short only a confirmed rejection from $865–900; long only a $820–835 retest or acceptance above $900.",
    "**STX short** — needs $842 and preferably $818 to fail.",
    "**AKAM rejection short** — if it remains below $118 and loses $112.",
    "**AXON long** — confirmed breakout; hold $575–585 for a retest, or a clean break of $620–630. Do not chase into that supply directly.",
    "**PLTR long** — the $141–143 trigger fired too; now testing fresh resistance at $164.50–170. Hold $155–160 for a retest, a deeper $145–150 retest, or a confirmed breakout-retest above $170 — not the current push.",
    "**TE long** — weakest confirmation; demand reacted, but the 4H rebound is already fading."
  ],
  "rankingNote": "The 08-04 melt-up moved a lot at once. AXON’s breakout is CONFIRMED — the $545–550 trigger this board named for weeks fired clean through both old supply zones, moving it to \"best trend-following longs\" alongside PLTR, whose own $141–143 trigger fired the same way; both now test a fresh zone one tier up ($620–630 and $164.50–170) rather than needing a first confirmation. PLTR’s zones move a tier higher on an explicit weekly confirmation — reclaimed the mean, OBV turning up — not just the daily gap holding. On the short side, LITE drops out of the trend-following shorts entirely: two sessions of bullish displacement reclaimed its old $800–835 supply as support, so it is now two-way, short only a rejection from the new $865–900 cluster; MU softens the same way one tier down. Neither redraw removes an old zone outright — all wait for regular-session acceptance above the new one before promoting it further. TE remains a possible countertrend long, and its 4H chart still says wait, not buy yet.",
  "direction": {
    "groups": [
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
        "note": "Both still carry a genuinely unconfirmed frame: STX is weekly and daily NEUTRAL with 4H bearish — needs $842 and preferably $818 to fail before this graduates. MSFT is long-first but its weekly trend has only just turned, so it joins on either a $482 breakout-retest or a pullback with a 4H higher low."
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
    "note": "The biggest correction to the earlier board is **TE**: being oversold inside demand makes a bounce possible, but its weekly, daily and 4H trends all remain down. The long is therefore **countertrend** and needs stronger confirmation than a normal trend-following long."
  }
};
