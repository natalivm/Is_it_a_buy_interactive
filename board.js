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
  "updated": "2026-08-05",
  "generatedBy": "tools/structure.py",
  "method": "Score = 2W + D + 0.5H + 0.5R + 0.5M + 0.5O + Z (W weekly, D daily, H 4H structure; R RSI vs 50; M MACD histogram slope; O OBV slope; Z inside confirmed demand +1 / supply −1)",
  "rows": [
    {
      "ticker": "STX",
      "date": "2026-08-05",
      "price": 837.66,
      "atr": 77.35,
      "atrPct": 9.23,
      "structure": {
        "m": "neutral",
        "w": "bullish",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1699 4H bars",
        "why": {
          "w": "pivots: highs 439.73->1145.00, lows 342.00->351.42",
          "d": "pivots: highs 936.49->921.78, lows 698.99->782.08"
        }
      },
      "parts": {
        "W": 1,
        "D": 0,
        "H": 0,
        "R": -1,
        "M": 1,
        "O": 1,
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
          "missing": []
        },
        "d": {
          "score": 1,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
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
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": 1,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
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
          "lo": 752.8,
          "hi": 786.42,
          "strength": "weak"
        },
        {
          "lo": 741.0,
          "hi": 757.16,
          "strength": "weak"
        },
        {
          "lo": 632.0,
          "hi": 667.98,
          "strength": "tested"
        }
      ],
      "supply": [
        {
          "lo": 860.66,
          "hi": 877.73,
          "strength": "weak"
        },
        {
          "lo": 915.99,
          "hi": 987.57,
          "strength": "weak"
        }
      ],
      "position": "between demand $752.80–786.42 (6.1% below) and supply $860.66–877.73 (2.7% above)",
      "bull": "close above $860.66–877.73 → $915.99–987.57",
      "bear": "close below $752.80–786.42 → $632.00–667.98",
      "retest": "a break above $860.66–877.73 likely retests it as support",
      "longCandidate": "Long after confirmed defense of **$786–800**.",
      "longSetup": "Defend **$786–800**, reclaim $815–838 → $885",
      "shortSetup": "Reject **$885–922**, or lose $832 then $818 → $800–786",
      "preferred": "**Neutral — wait for resolution**",
      "h4": "Rally to $900 made a lower high and is rolling over — now testing the **$842–860** cluster.",
      "h4Effect": "Short thesis improves after a 4H close below **$842**, with stronger confirmation below **$818**. Targets remain **$800–786**. Reclaiming $875–900 would delay the short."
    },
    {
      "ticker": "AXON",
      "date": "2026-08-05",
      "price": 609.49,
      "atr": 29.96,
      "atrPct": 4.92,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "bullish",
        "h4Note": "1707 4H bars",
        "why": {
          "w": "pivots: highs 515.80->665.07, lows 402.00->485.75",
          "d": "pivots: highs 665.07->564.24, lows 485.75->502.72"
        }
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
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": 7,
          "band": "strong uptrend",
          "S": 1,
          "E": 1,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
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
          "strength": "weak"
        },
        {
          "lo": 540.93,
          "hi": 555.06,
          "strength": "weak"
        },
        {
          "lo": 526.16,
          "hi": 544.51,
          "strength": "tested"
        }
      ],
      "supply": [
        {
          "lo": 587.0,
          "hi": 611.21,
          "strength": "weak"
        },
        {
          "lo": 608.8,
          "hi": 622.39,
          "strength": "weak"
        },
        {
          "lo": 703.03,
          "hi": 740.0,
          "strength": "weak"
        }
      ],
      "position": "inside weak supply $587.00–611.21",
      "bull": "close above $587.00–611.21 → $703.03–740.00",
      "bear": "close below $560.62–593.96 → $540.93–555.06",
      "retest": "a break above $587.00–611.21 likely retests it as support",
      "longCandidate": "The confirmed breakout long, not just a possible one — monthly, weekly and daily are all bullish now. Still not a chase: the best entry is the $575–585 hold with a 4H higher low, not the push into $620–630.",
      "longSetup": "Hold $575–585, or the current $605–610 higher low, then break $620–630 → $650–670, then $695–710. A clean hold above $630 confirms continuation.",
      "shortSetup": "Countertrend only: reject $620–630 and lose $585 → $555–545. Daily acceptance below $545 opens $525–515, then $480–468.",
      "preferred": "**Long preferred** — all four frames agree",
      "h4": "Confirmed higher-high/higher-low to ≈$609. RSI 42.94 — not stretched, OBV turning up.",
      "h4Effect": "This is the confirmation the row was waiting on: a 4H higher low above $605–610, now printed. All four frames align bullish for the first time. The next test is the same one the daily/weekly/monthly already face — $620–630 supply — not a fresh 4H question. The sequence runs off the mid-July ≈$490 low, cleanly through the July 20–27 ≈$555–565 pullback highs."
    },
    {
      "ticker": "AVGO",
      "date": "2026-08-05",
      "price": 418.28,
      "atr": 17.07,
      "atrPct": 4.08,
      "structure": {
        "m": "bullish",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1707 4H bars",
        "why": {
          "w": "pivots: highs 353.14->495.00, lows 289.96->356.43",
          "d": "pivots: highs 399.00->398.59, lows 357.80->369.51"
        }
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
          "lo": 417.0,
          "hi": 422.01,
          "strength": "weak"
        },
        {
          "lo": 371.75,
          "hi": 387.84,
          "strength": "weak"
        },
        {
          "lo": 360.82,
          "hi": 373.9,
          "strength": "weak"
        }
      ],
      "supply": [
        {
          "lo": 479.23,
          "hi": 495.0,
          "strength": "fresh"
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
      "date": "2026-08-05",
      "price": 362.43,
      "atr": 13.93,
      "atrPct": 3.84,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1707 4H bars",
        "why": {
          "w": "pivots: highs 408.61->375.27, lows 330.20->314.90",
          "d": "pivots: highs 373.16->375.27, lows 351.08->314.90"
        }
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
          "strength": "weak"
        },
        {
          "lo": 335.17,
          "hi": 339.32,
          "strength": "weak"
        },
        {
          "lo": 321.5,
          "hi": 334.2,
          "strength": "weak"
        }
      ],
      "supply": [
        {
          "lo": 351.2,
          "hi": 373.65,
          "strength": "weak"
        },
        {
          "lo": 384.51,
          "hi": 393.88,
          "strength": "weak"
        }
      ],
      "position": "inside weak supply $351.20–373.65",
      "bull": "close above $351.20–373.65 → $384.51–393.88",
      "bear": "close below $342.73–350.34 → $335.17–339.32",
      "retest": "a break above $351.20–373.65 likely retests it as support",
      "longCandidate": "Long-first, but a pullback that holds **$333–340** is cleaner than chasing near **$356**.",
      "longSetup": "**Pullback long:** hold $333–340, form a 4H higher low and reclaim **$350–359** → $376. **Breakout long:** daily close above **$376**, then a successful retest → $390–405",
      "shortSetup": "Repeated failure below **$358–376**, followed by loss of **$333**, opens $326–321; below $321 → **$318–312**",
      "preferred": "**Long preferred**, but do not chase",
      "h4": "Breakout rejected at **$376** on a heavy wick. 4H RSI **72** — short-term extended."
    },
    {
      "ticker": "LLY",
      "date": "2026-08-05",
      "price": 1169.86,
      "atr": 41.38,
      "atrPct": 3.54,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1707 4H bars",
        "why": {
          "w": "pivots: highs 1133.95->1249.45, lows 977.12->850.51",
          "d": "pivots: highs 1189.07->1232.00, lows 1139.00->1109.15"
        }
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
      "score": 1.0,
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
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": 1,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": 1,
          "M": 0,
          "reach": 7,
          "full": true,
          "missing": []
        }
      },
      "trendProse": {
        "w": "uptrend",
        "d": "uptrend",
        "m": "range / transition",
        "h4": "range / transition"
      },
      "combo": "aligned uptrend — weekly and daily agree",
      "demand": [
        {
          "lo": 1153.5,
          "hi": 1173.91,
          "strength": "weak"
        },
        {
          "lo": 1079.22,
          "hi": 1120.49,
          "strength": "tested"
        },
        {
          "lo": 1052.08,
          "hi": 1080.36,
          "strength": "weak"
        }
      ],
      "supply": [
        {
          "lo": 1210.02,
          "hi": 1230.0,
          "strength": "tested"
        }
      ],
      "position": "inside weak demand $1,153.50–1,173.91",
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
      "date": "2026-08-05",
      "price": 487.46,
      "atr": 16.72,
      "atrPct": 3.43,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1707 4H bars",
        "why": {
          "w": "pivots: highs 413.05->466.32, lows 356.28->349.20",
          "d": "pivots: highs 395.57->405.99, lows 373.35->377.39"
        }
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
          "lo": 432.44,
          "hi": 451.1,
          "strength": "fresh"
        },
        {
          "lo": 413.02,
          "hi": 424.82,
          "strength": "weak"
        },
        {
          "lo": 377.39,
          "hi": 399.58,
          "strength": "weak"
        }
      ],
      "supply": [
        {
          "lo": 487.12,
          "hi": 495.19,
          "strength": "weak"
        },
        {
          "lo": 498.23,
          "hi": 511.6,
          "strength": "weak"
        },
        {
          "lo": 517.81,
          "hi": 529.32,
          "strength": "weak"
        }
      ],
      "position": "inside weak supply $487.12–495.19",
      "bull": "close above $487.12–495.19 → $498.23–511.60",
      "bear": "close below $432.44–451.10 → $413.02–424.82",
      "retest": "a break above $487.12–495.19 likely retests it as support",
      "longCandidate": "Long-first, but wait: either a pullback into **$449–451** or **$432–438** with a 4H higher low, or a **$482** break with a successful retest.",
      "longSetup": "**Breakout:** close above **$482**, then hold/retest $466–482 → **$500–505**, then **$537–550**. **Pullback:** defend $432–438 or $419–423, form a 4H higher low and reclaim the zone → **$466–482**",
      "shortSetup": "Loss of **$432** → $419–423. A short only becomes structurally clean after a close below **$419** and a failed reclaim → **$400–389**",
      "preferred": "**Long preferred** — do not chase the gap",
      "h4": "At **$465**, roughly **three ATRs** above the pre-earnings area — the long is not buying here."
    },
    {
      "ticker": "NOW",
      "date": "2026-08-05",
      "price": 117.22,
      "atr": 6.68,
      "atrPct": 5.69,
      "structure": {
        "m": "bearish",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1707 4H bars",
        "why": {
          "w": "pivots: highs 139.20->113.79, lows 89.39->91.53",
          "d": "pivots: highs 113.03->118.36, lows 91.53->106.05"
        }
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
          "strength": "weak"
        },
        {
          "lo": 103.84,
          "hi": 106.32,
          "strength": "weak"
        },
        {
          "lo": 98.11,
          "hi": 102.18,
          "strength": "weak"
        }
      ],
      "supply": [
        {
          "lo": 116.73,
          "hi": 118.96,
          "strength": "weak"
        },
        {
          "lo": 134.61,
          "hi": 138.19,
          "strength": "weak"
        },
        {
          "lo": 141.8,
          "hi": 147.35,
          "strength": "tested"
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
      "date": "2026-08-05",
      "price": 158.43,
      "atr": 8.59,
      "atrPct": 5.42,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1707 4H bars",
        "why": {
          "w": "pivots: highs 163.70->138.90, lows 122.68->106.37",
          "d": "pivots: highs 136.88->132.41, lows 120.73->117.89"
        }
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
          "strength": "weak"
        },
        {
          "lo": 120.27,
          "hi": 122.26,
          "strength": "fresh"
        }
      ],
      "supply": [
        {
          "lo": 153.24,
          "hi": 161.08,
          "strength": "weak"
        },
        {
          "lo": 157.35,
          "hi": 165.04,
          "strength": "weak"
        },
        {
          "lo": 166.98,
          "hi": 177.29,
          "strength": "weak"
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
      "h4": "RSI ≈73, above the daily upper band near $147 — powerful but extended.",
      "h4Effect": "Testing the $164.50–170 breakout-decision zone, the first resistance above the reclaimed gap. A close above $170 confirmed by a $164–170 retest opens $175–182, then $190–205. A rejection back under $158–160 raises the odds of a retest to $150, then $145. ATR(14) itself is still pre-gap and needs a genuine refresh — every zone here is measured off a stale dollar figure. Not an automatic reversal signal, but chasing the initial spike is poor risk/reward."
    },
    {
      "ticker": "INTC",
      "date": "2026-08-05",
      "price": 101.06,
      "atr": 8.32,
      "atrPct": 8.23,
      "structure": {
        "m": "neutral",
        "w": "bullish",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1707 4H bars",
        "why": {
          "w": "pivots: highs 132.75->142.35, lows 40.63->98.33",
          "d": "pivots: highs 116.77->106.85, lows 89.59->81.79"
        }
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
          "strength": "weak"
        },
        {
          "lo": 91.5,
          "hi": 95.6,
          "strength": "weak"
        },
        {
          "lo": 79.62,
          "hi": 82.54,
          "strength": "tested"
        }
      ],
      "supply": [
        {
          "lo": 100.23,
          "hi": 104.18,
          "strength": "weak"
        },
        {
          "lo": 103.12,
          "hi": 106.17,
          "strength": "weak"
        },
        {
          "lo": 107.45,
          "hi": 109.0,
          "strength": "weak"
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
      "date": "2026-08-05",
      "price": 826.26,
      "atr": 77.88,
      "atrPct": 9.43,
      "structure": {
        "m": "neutral",
        "w": "bullish",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1707 4H bars",
        "why": {
          "w": "pivots: highs 960.00->1085.68, lows 317.44->780.48",
          "d": "pivots: highs 839.88->897.00, lows 650.82->594.84"
        }
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
          "strength": "weak"
        },
        {
          "lo": 680.66,
          "hi": 785.49,
          "strength": "weak"
        },
        {
          "lo": 578.3,
          "hi": 656.0,
          "strength": "weak"
        }
      ],
      "supply": [
        {
          "lo": 762.99,
          "hi": 852.78,
          "strength": "weak"
        },
        {
          "lo": 897.0,
          "hi": 897.0,
          "strength": "structural",
          "touches": null,
          "note": "swing high, no zone formed"
        }
      ],
      "position": "inside weak demand $811.45–859.68",
      "bull": "close above $762.99–852.78 → $897.00",
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
      "date": "2026-08-05",
      "price": 893.19,
      "atr": 84.79,
      "atrPct": 9.49,
      "structure": {
        "m": "neutral",
        "w": "bullish",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1707 4H bars",
        "why": {
          "w": "pivots: highs 471.34->1255.00, lows 192.59->311.49",
          "d": "pivots: highs 1011.77->930.88, lows 737.88->770.10"
        }
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
          "lo": 888.15,
          "hi": 955.66,
          "strength": "weak"
        },
        {
          "lo": 700.66,
          "hi": 734.96,
          "strength": "tested"
        },
        {
          "lo": 635.42,
          "hi": 649.83,
          "strength": "fresh"
        }
      ],
      "supply": [
        {
          "lo": 920.95,
          "hi": 998.0,
          "strength": "weak"
        },
        {
          "lo": 1128.7,
          "hi": 1148.79,
          "strength": "fresh"
        }
      ],
      "position": "inside weak demand $888.15–955.66",
      "bull": "close above $920.95–998.00 → $1,128.70–1,148.79",
      "bear": "close below $888.15–955.66 → $700.66–734.96",
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
      "date": "2026-08-05",
      "price": 1350.5,
      "atr": 188.34,
      "atrPct": 13.95,
      "structure": {
        "m": null,
        "w": "bullish",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "819 4H bars",
        "why": {
          "w": "pivots: highs 777.60->2354.39, lows 517.00->558.58",
          "d": "pivots: highs 1952.59->1696.37, lows 1325.03->998.19"
        }
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
          "lo": 1286.13,
          "hi": 1406.32,
          "strength": "weak"
        },
        {
          "lo": 980.28,
          "hi": 1112.43,
          "strength": "weak"
        },
        {
          "lo": 899.2,
          "hi": 930.97,
          "strength": "tested"
        }
      ],
      "supply": [
        {
          "lo": 1511.67,
          "hi": 1628.4,
          "strength": "tested"
        },
        {
          "lo": 1673.97,
          "hi": 1800.0,
          "strength": "tested"
        },
        {
          "lo": 1745.0,
          "hi": 2052.54,
          "strength": "weak"
        }
      ],
      "position": "inside weak demand $1,286.13–1,406.32",
      "bull": "close above $1,511.67–1,628.40 → $1,673.97–1,800.00",
      "bear": "close below $1,286.13–1,406.32 → $980.28–1,112.43",
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
      "date": "2026-08-05",
      "price": 482.05,
      "atr": 40.39,
      "atrPct": 8.38,
      "structure": {
        "m": "bullish",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1707 4H bars",
        "why": {
          "w": "pivots: highs 266.96->584.73, lows 194.28->188.22",
          "d": "pivots: highs 574.20->561.47, lows 460.21->424.03"
        }
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
          "strength": "weak"
        },
        {
          "lo": 426.05,
          "hi": 447.58,
          "strength": "tested"
        },
        {
          "lo": 402.04,
          "hi": 421.39,
          "strength": "weak"
        }
      ],
      "supply": [
        {
          "lo": 485.0,
          "hi": 494.97,
          "strength": "weak"
        },
        {
          "lo": 539.69,
          "hi": 556.49,
          "strength": "fresh"
        },
        {
          "lo": 548.13,
          "hi": 574.2,
          "strength": "tested"
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
      "h4": "Bearish after the earnings displacement — inside the $475–503 trap zone, no reversal yet.",
      "h4Effect": "This is what keeps the row at WAIT rather than a clean side: the higher-timeframe trend is still up, but the 4H has not confirmed a reversal from the earnings-day drop. A reclaim of $503 that holds resolves it long; a failed reclaim with a break of $475 resolves it short. Until one of those prints, $475–503 is a trap, not a level to trade from."
    },
    {
      "ticker": "CIEN",
      "date": "2026-08-05",
      "price": 408.83,
      "atr": 31.66,
      "atrPct": 7.74,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1707 4H bars",
        "why": {
          "w": "pivots: highs 637.51->494.53, lows 278.39->417.34",
          "d": "pivots: highs 485.69->415.80, lows 359.01->323.29"
        }
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
          "strength": "weak"
        },
        {
          "lo": 350.36,
          "hi": 370.05,
          "strength": "weak"
        },
        {
          "lo": 329.41,
          "hi": 344.26,
          "strength": "tested"
        }
      ],
      "supply": [
        {
          "lo": 375.01,
          "hi": 415.8,
          "strength": "weak"
        },
        {
          "lo": 445.44,
          "hi": 494.53,
          "strength": "weak"
        },
        {
          "lo": 488.21,
          "hi": 525.15,
          "strength": "weak"
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
      "date": "2026-08-05",
      "price": 89.89,
      "atr": 7.95,
      "atrPct": 8.84,
      "structure": {
        "m": null,
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "760 4H bars",
        "why": {
          "w": "pivots: highs 138.25->132.15, lows 94.82->91.02",
          "d": "pivots: highs 95.14->85.37, lows 68.51->60.55"
        }
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
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "d": {
          "score": 0,
          "band": "range / transition",
          "S": 0,
          "E": 0,
          "A": -1,
          "M": 1,
          "reach": 7,
          "full": true,
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
          "missing": []
        }
      },
      "trendProse": {
        "w": "range / transition",
        "d": "range / transition",
        "h4": "uptrend"
      },
      "combo": "no directional edge",
      "demand": [
        {
          "lo": 71.85,
          "hi": 72.99,
          "strength": "weak"
        }
      ],
      "supply": [
        {
          "lo": 87.36,
          "hi": 99.5,
          "strength": "weak"
        },
        {
          "lo": 106.93,
          "hi": 120.82,
          "strength": "weak"
        },
        {
          "lo": 126.32,
          "hi": 133.84,
          "strength": "weak"
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
      "h4": "Relief bounce is failing — price is back under the 4H resistance and moving averages."
    },
    {
      "ticker": "GLW",
      "date": "2026-08-05",
      "price": 156.7,
      "atr": 14.24,
      "atrPct": 9.09,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1707 4H bars",
        "why": {
          "w": "pivots: highs 211.79->271.78, lows 120.01->166.00",
          "d": "pivots: highs 204.48->164.50, lows 146.94->114.50"
        }
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
          "strength": "weak"
        },
        {
          "lo": 129.79,
          "hi": 139.51,
          "strength": "weak"
        },
        {
          "lo": 123.9,
          "hi": 133.08,
          "strength": "weak"
        }
      ],
      "supply": [
        {
          "lo": 152.26,
          "hi": 160.98,
          "strength": "weak"
        },
        {
          "lo": 168.0,
          "hi": 172.95,
          "strength": "weak"
        },
        {
          "lo": 177.58,
          "hi": 190.11,
          "strength": "weak"
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
      "date": "2026-08-05",
      "price": 588.77,
      "atr": 25.13,
      "atrPct": 4.27,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1707 4H bars",
        "why": {
          "w": "pivots: highs 643.00->686.08, lows 592.60->540.18",
          "d": "pivots: highs 686.08->655.88, lows 626.00->524.49"
        }
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
          "strength": "weak"
        },
        {
          "lo": 540.4,
          "hi": 550.25,
          "strength": "tested"
        }
      ],
      "supply": [
        {
          "lo": 585.39,
          "hi": 592.0,
          "strength": "weak"
        },
        {
          "lo": 593.87,
          "hi": 611.26,
          "strength": "tested"
        },
        {
          "lo": 603.0,
          "hi": 624.17,
          "strength": "weak"
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
      "date": "2026-08-05",
      "price": 211.02,
      "atr": 19.46,
      "atrPct": 9.22,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1707 4H bars",
        "why": {
          "w": "pivots: highs 94.20->329.88, lows 81.18->70.69",
          "d": "pivots: highs 251.70->214.92, lows 177.95->162.90"
        }
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
          "strength": "fresh"
        },
        {
          "lo": 162.85,
          "hi": 176.27,
          "strength": "weak"
        },
        {
          "lo": 151.09,
          "hi": 157.32,
          "strength": "weak"
        }
      ],
      "supply": [
        {
          "lo": 193.01,
          "hi": 214.92,
          "strength": "weak"
        },
        {
          "lo": 217.53,
          "hi": 228.8,
          "strength": "tested"
        },
        {
          "lo": 225.16,
          "hi": 236.79,
          "strength": "tested"
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
      "date": "2026-08-05",
      "price": 569.7,
      "atr": 27.2,
      "atrPct": 4.77,
      "structure": {
        "m": "bullish",
        "w": "neutral",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1707 4H bars",
        "why": {
          "w": "pivots: highs 427.94->671.83, lows 374.24->359.86",
          "d": "pivots: highs 618.17->592.01, lows 536.81->503.63"
        }
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
          "missing": []
        }
      },
      "trendProse": {
        "w": "uptrend",
        "d": "range / transition",
        "m": "uptrend",
        "h4": "uptrend"
      },
      "combo": "weekly up, daily range",
      "demand": [
        {
          "lo": 554.66,
          "hi": 609.48,
          "strength": "weak"
        },
        {
          "lo": 551.65,
          "hi": 564.66,
          "strength": "weak"
        },
        {
          "lo": 514.12,
          "hi": 522.69,
          "strength": "tested"
        }
      ],
      "supply": [
        {
          "lo": 571.35,
          "hi": 592.01,
          "strength": "tested"
        },
        {
          "lo": 600.31,
          "hi": 608.9,
          "strength": "fresh"
        },
        {
          "lo": 615.03,
          "hi": 659.74,
          "strength": "weak"
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
      "date": "2026-08-05",
      "price": 122.27,
      "atr": 5.62,
      "atrPct": 4.6,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "bearish",
        "h4Note": "1707 4H bars",
        "why": {
          "w": "pivots: highs 165.45->131.08, lows 88.50->108.84",
          "d": "pivots: highs 131.08->127.50, lows 115.94->107.11"
        }
      },
      "parts": {
        "W": 0,
        "D": 0,
        "H": -1,
        "R": 1,
        "M": 1,
        "O": -1,
        "Z": 0
      },
      "score": 0.0,
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
          "missing": [
            "50 EMA",
            "200 EMA"
          ]
        },
        "h4": {
          "score": 1,
          "band": "range / transition",
          "S": -1,
          "E": 1,
          "A": 1,
          "M": 1,
          "reach": 7,
          "full": true,
          "missing": []
        }
      },
      "trendProse": {
        "w": "uptrend",
        "d": "uptrend",
        "m": "range / transition",
        "h4": "range / transition"
      },
      "combo": "aligned uptrend — weekly and daily agree",
      "demand": [
        {
          "lo": 107.27,
          "hi": 117.94,
          "strength": "weak"
        },
        {
          "lo": 103.6,
          "hi": 107.91,
          "strength": "weak"
        },
        {
          "lo": 96.98,
          "hi": 102.98,
          "strength": "weak"
        }
      ],
      "supply": [
        {
          "lo": 116.75,
          "hi": 127.5,
          "strength": "weak"
        },
        {
          "lo": 134.2,
          "hi": 136.85,
          "strength": "fresh"
        },
        {
          "lo": 149.67,
          "hi": 164.8,
          "strength": "tested"
        }
      ],
      "position": "inside weak supply $116.75–127.50",
      "bull": "close above $116.75–127.50 → $134.20–136.85",
      "bear": "close below $107.27–117.94 → $96.98–102.98",
      "retest": "a break above $116.75–127.50 likely retests it as support",
      "longCandidate": "Long only after acceptance above **$119.22**.",
      "longSetup": "Trend changes only above **$119.22** → $124–126",
      "shortSetup": "Reject **$115–119** or lose **$107.27** → $102–104",
      "preferred": "**Short preferred**",
      "h4": "Stalling beneath **$116.8–118**. MACD fading, stochastic rolling over from overbought.",
      "h4Effect": "Keeps the **neutral-to-bearish** bias. Failure below $118 favors **$112**, then **$108**. A 4H close above $118 would open $121–124."
    },
    {
      "ticker": "QCOM",
      "date": "2026-08-05",
      "price": 157.53,
      "atr": 9.43,
      "atrPct": 5.98,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "bearish",
        "h4Note": "1707 4H bars",
        "why": {
          "w": "pivots: highs 146.94->259.92, lows 132.73->121.99",
          "d": "pivots: highs 196.09->178.65, lows 164.77->142.89"
        }
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
      "score": -1.0,
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
          "missing": []
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
          "lo": 147.05,
          "hi": 156.31,
          "strength": "weak"
        },
        {
          "lo": 135.05,
          "hi": 138.12,
          "strength": "tested"
        },
        {
          "lo": 132.28,
          "hi": 133.44,
          "strength": "tested"
        }
      ],
      "supply": [
        {
          "lo": 161.39,
          "hi": 167.51,
          "strength": "weak"
        },
        {
          "lo": 165.46,
          "hi": 171.98,
          "strength": "weak"
        },
        {
          "lo": 180.19,
          "hi": 184.07,
          "strength": "weak"
        }
      ],
      "position": "between demand $147.05–156.31 (0.8% below) and supply $161.39–167.51 (2.5% above)",
      "bull": "close above $161.39–167.51 → $180.19–184.07",
      "bear": "close below $147.05–156.31 → $135.05–138.12",
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
      "date": "2026-08-05",
      "price": 5.47,
      "atr": 0.78,
      "atrPct": 14.18,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "bearish",
        "h4Note": "804 4H bars",
        "why": {
          "w": "pivots: highs 12.49->10.90, lows 3.74->7.36",
          "d": "pivots: highs 10.08->6.30, lows 5.55->3.49"
        }
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
          "strength": "weak"
        },
        {
          "lo": 3.23,
          "hi": 4.11,
          "strength": "weak"
        }
      ],
      "supply": [
        {
          "lo": 5.0,
          "hi": 5.7,
          "strength": "weak"
        },
        {
          "lo": 5.76,
          "hi": 6.25,
          "strength": "weak"
        },
        {
          "lo": 6.61,
          "hi": 6.98,
          "strength": "weak"
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
      "date": "2026-08-05",
      "price": 321.55,
      "atr": 15.44,
      "atrPct": 4.8,
      "structure": {
        "m": "neutral",
        "w": "neutral",
        "d": "neutral",
        "h4": "bearish",
        "h4Note": "1707 4H bars",
        "why": {
          "w": "pivots: highs 453.40->432.86, lows 337.24->368.60",
          "d": "pivots: highs 432.86->413.16, lows 389.30->297.38"
        }
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
      "score": -1.0,
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
          "lo": 314.6,
          "hi": 335.79,
          "strength": "weak"
        },
        {
          "lo": 306.93,
          "hi": 319.91,
          "strength": "weak"
        }
      ],
      "supply": [
        {
          "lo": 329.62,
          "hi": 336.27,
          "strength": "weak"
        },
        {
          "lo": 361.51,
          "hi": 387.48,
          "strength": "weak"
        },
        {
          "lo": 395.56,
          "hi": 412.94,
          "strength": "weak"
        }
      ],
      "position": "inside weak demand $314.60–335.79",
      "bull": "close above $329.62–336.27 → $361.51–387.48",
      "bear": "close below $314.60–335.79",
      "retest": "a break above $329.62–336.27 likely retests it as support",
      "longCandidate": "A **bounce trade only** — countertrend until TSLA recovers $365–387.",
      "longSetup": "Hold **$297–305**, form a 4H higher low, reclaim **$315** then **$324–330** → targets **$350–365**. A stronger reversal only above **$365–387**; below that region the dominant trend stays bearish.",
      "shortSetup": "Wait for a bounce toward **$324–330**, then short only after rejection AND a break of the 4H rejection candle's low → $305–297. A daily close below **$297** with a failed reclaim targets **$286–282**, then **$260–250**.",
      "preferred": "**Short preferred with trend**",
      "h4": "Stabilising **$300–311**, still below the declining **$329**, **$342** and **$372**."
    },
    {
      "ticker": "ADBE",
      "date": "2026-08-05",
      "price": 259.32,
      "atr": 11.67,
      "atrPct": 4.5,
      "structure": {
        "m": "bearish",
        "w": "bearish",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1707 4H bars",
        "why": {
          "w": "pivots: highs 285.36->275.44, lows 224.13->190.12",
          "d": "pivots: highs 266.28->262.15, lows 210.88->241.23"
        }
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
          "strength": "weak"
        },
        {
          "lo": 241.69,
          "hi": 249.18,
          "strength": "tested"
        },
        {
          "lo": 237.28,
          "hi": 238.24,
          "strength": "weak"
        }
      ],
      "supply": [
        {
          "lo": 251.44,
          "hi": 263.5,
          "strength": "weak"
        },
        {
          "lo": 267.23,
          "hi": 282.9,
          "strength": "weak"
        },
        {
          "lo": 291.65,
          "hi": 293.64,
          "strength": "tested"
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
      "date": "2026-08-05",
      "price": 18.96,
      "atr": 0.98,
      "atrPct": 5.19,
      "structure": {
        "m": "bearish",
        "w": "bearish",
        "d": "neutral",
        "h4": "neutral",
        "h4Note": "1707 4H bars",
        "why": {
          "w": "pivots: highs 23.57->20.53, lows 16.98->16.70",
          "d": "pivots: highs 19.99->19.51, lows 16.70->17.71"
        }
      },
      "parts": {
        "W": -1,
        "D": 0,
        "H": 0,
        "R": 1,
        "M": 1,
        "O": 1,
        "Z": 0
      },
      "score": -0.5,
      "bias": "neutral",
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
          "missing": []
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
          "missing": []
        }
      },
      "trendProse": {
        "w": "strong downtrend",
        "d": "downtrend",
        "m": "downtrend",
        "h4": "uptrend"
      },
      "combo": "aligned downtrend — weekly and daily agree",
      "demand": [
        {
          "lo": 18.91,
          "hi": 18.91,
          "strength": "structural",
          "touches": null,
          "note": "swing low, no zone formed"
        },
        {
          "lo": 18.5,
          "hi": 18.5,
          "strength": "structural",
          "touches": null,
          "note": "swing low, no zone formed"
        }
      ],
      "supply": [
        {
          "lo": 18.57,
          "hi": 19.99,
          "strength": "weak"
        },
        {
          "lo": 20.56,
          "hi": 21.03,
          "strength": "weak"
        },
        {
          "lo": 21.2,
          "hi": 22.52,
          "strength": "weak"
        }
      ],
      "position": "inside weak supply $18.57–19.99",
      "bull": "close above $18.57–19.99 → $20.56–21.03",
      "bear": "close below $18.91 → $18.50",
      "retest": "a break above $18.57–19.99 likely retests it as support",
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
