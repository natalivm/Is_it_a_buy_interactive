"""Indicator math — everything the cards quote, derived from OHLCV alone.

Deliberately dependency-free (no pandas/numpy) so this keeps working when a
transitive dependency breaks. Series are plain lists, oldest-first.

Conventions chosen to match what the Yahoo/TradingView chart panes display:
  RSI(14)              Wilder smoothing (NOT a simple moving average)
  MACD(12,26,9)        EMA(12) - EMA(26), signal = EMA(9) of that
  Stochastics(14,3,3)  %K = SMA3 of raw stochastic over 14, %D = SMA3 of %K
  Bollinger(21,2)      SMA(21) +/- 2 * population stddev
  MACross(9,50,200)    exponential
  OBV                  cumulative signed volume

Values will land within a few tenths of the chart's, not to the last decimal:
EMA seeding and adjusted-vs-raw closes differ between vendors. That is fine for
the decisions the board makes (is RSI above the midline, is Stoch washed out),
and it is the reason the report prints values rather than verdicts.
"""

from __future__ import annotations

from dataclasses import dataclass


# ── primitives ──────────────────────────────────────────────────────────────

def sma(xs: list[float], n: int) -> list[float | None]:
    out: list[float | None] = [None] * len(xs)
    if n <= 0 or len(xs) < n:
        return out
    run = sum(xs[:n])
    out[n - 1] = run / n
    for i in range(n, len(xs)):
        run += xs[i] - xs[i - n]
        out[i] = run / n
    return out


def ema(xs: list[float], n: int) -> list[float | None]:
    """Seeded with the SMA of the first n values, which is what charting
    packages do; a raw-first-value seed drifts for hundreds of bars."""
    out: list[float | None] = [None] * len(xs)
    if n <= 0 or len(xs) < n:
        return out
    k = 2.0 / (n + 1.0)
    prev = sum(xs[:n]) / n
    out[n - 1] = prev
    for i in range(n, len(xs)):
        prev = xs[i] * k + prev * (1 - k)
        out[i] = prev
    return out


def stddev_pop(xs: list[float], n: int) -> list[float | None]:
    out: list[float | None] = [None] * len(xs)
    for i in range(n - 1, len(xs)):
        w = xs[i - n + 1:i + 1]
        m = sum(w) / n
        out[i] = (sum((v - m) ** 2 for v in w) / n) ** 0.5
    return out


# ── indicators ──────────────────────────────────────────────────────────────

def rsi(close: list[float], n: int = 14) -> list[float | None]:
    out: list[float | None] = [None] * len(close)
    if len(close) <= n:
        return out
    gains = [0.0] * len(close)
    losses = [0.0] * len(close)
    for i in range(1, len(close)):
        d = close[i] - close[i - 1]
        gains[i] = max(d, 0.0)
        losses[i] = max(-d, 0.0)
    ag = sum(gains[1:n + 1]) / n
    al = sum(losses[1:n + 1]) / n
    out[n] = 100.0 if al == 0 else 100 - 100 / (1 + ag / al)
    for i in range(n + 1, len(close)):
        ag = (ag * (n - 1) + gains[i]) / n      # Wilder
        al = (al * (n - 1) + losses[i]) / n
        out[i] = 100.0 if al == 0 else 100 - 100 / (1 + ag / al)
    return out


def macd(close: list[float], fast=12, slow=26, sig=9):
    ef, es = ema(close, fast), ema(close, slow)
    line = [(a - b) if (a is not None and b is not None) else None
            for a, b in zip(ef, es)]
    seed = [v for v in line if v is not None]
    sl = ema(seed, sig)
    signal: list[float | None] = [None] * len(line)
    off = len(line) - len(seed)
    for i, v in enumerate(sl):
        signal[off + i] = v
    hist = [(l - s) if (l is not None and s is not None) else None
            for l, s in zip(line, signal)]
    return line, signal, hist


def stochastic(high, low, close, n=14, k=3, d=3):
    raw: list[float | None] = [None] * len(close)
    for i in range(n - 1, len(close)):
        hh = max(high[i - n + 1:i + 1])
        ll = min(low[i - n + 1:i + 1])
        raw[i] = 50.0 if hh == ll else (close[i] - ll) / (hh - ll) * 100
    seed = [v for v in raw if v is not None]
    ks = sma(seed, k)
    kline: list[float | None] = [None] * len(raw)
    off = len(raw) - len(seed)
    for i, v in enumerate(ks):
        kline[off + i] = v
    kseed = [v for v in kline if v is not None]
    ds = sma(kseed, d)
    dline: list[float | None] = [None] * len(kline)
    off2 = len(kline) - len(kseed)
    for i, v in enumerate(ds):
        dline[off2 + i] = v
    return kline, dline


def obv(close: list[float], volume: list[float]) -> list[float]:
    out = [0.0] * len(close)
    for i in range(1, len(close)):
        if close[i] > close[i - 1]:
            out[i] = out[i - 1] + volume[i]
        elif close[i] < close[i - 1]:
            out[i] = out[i - 1] - volume[i]
        else:
            out[i] = out[i - 1]
    return out


def bollinger(close: list[float], n=21, mult=2.0):
    mid = sma(close, n)
    sd = stddev_pop(close, n)
    up = [(m + mult * s) if (m is not None and s is not None) else None
          for m, s in zip(mid, sd)]
    lo = [(m - mult * s) if (m is not None and s is not None) else None
          for m, s in zip(mid, sd)]
    return lo, mid, up


# ── one timeframe's worth of readings ───────────────────────────────────────

@dataclass
class Frame:
    label: str
    o: float
    h: float
    l: float
    c: float
    v: float
    rsi: float | None
    macd: float | None
    macd_sig: float | None
    macd_hist: float | None
    hist_sign: str          # 'green' (MACD above signal) | 'red' | 'n/a'
    hist_run: int           # how many consecutive bars it has been that colour
    stoch_k: float | None
    stoch_d: float | None
    obv: float | None
    bb_lo: float | None
    bb_mid: float | None
    bb_up: float | None
    ema9: float | None
    ema50: float | None
    ema200: float | None

    def line(self) -> str:
        def f(x, nd=2):
            return "n/a" if x is None else f"{x:,.{nd}f}"
        # Spell the histogram out. Reading its colour off the right edge of a
        # chart is exactly the judgement call that produced a wrong claim once.
        if self.hist_sign == "n/a":
            hist = "hist n/a"
        else:
            flip = " ⚠️ JUST FLIPPED" if self.hist_run == 1 else ""
            hist = (f"hist {f(self.macd_hist)} {self.hist_sign.upper()} "
                    f"({self.hist_run} bar{'s' if self.hist_run != 1 else ''}){flip}")
        return (
            f"{self.label:<8} O {f(self.o)} · H {f(self.h)} · L {f(self.l)} · C {f(self.c)}\n"
            f"{'':<8} RSI {f(self.rsi)} · MACD {f(self.macd)} (sig {f(self.macd_sig)}) · "
            f"{hist}\n"
            f"{'':<8} Stoch %K {f(self.stoch_k)} / %D {f(self.stoch_d)}\n"
            f"{'':<8} OBV {f(self.obv, 0)} · BB {f(self.bb_lo)} / {f(self.bb_mid)} / {f(self.bb_up)}\n"
            f"{'':<8} EMA9 {f(self.ema9)} · EMA50 {f(self.ema50)} · EMA200 {f(self.ema200)}"
        )


def read_frame(label: str, bars: list[dict]) -> Frame:
    """bars: oldest-first dicts with o/h/l/c/v. Returns the LAST bar's readings."""
    o = [b["o"] for b in bars]
    h = [b["h"] for b in bars]
    lo = [b["l"] for b in bars]
    c = [b["c"] for b in bars]
    v = [b["v"] for b in bars]
    i = len(bars) - 1

    r = rsi(c)
    ml, ms, mh = macd(c)
    sk, sd = stochastic(h, lo, c)
    ob = obv(c, v)
    bl, bm, bu = bollinger(c)
    e9, e50, e200 = ema(c, 9), ema(c, 50), ema(c, 200)

    # Histogram colour and how long it has held it — so "did it just flip red?"
    # is a printed fact rather than a squint at the last few bars.
    sign, run = "n/a", 0
    if mh[i] is not None:
        sign = "green" if mh[i] >= 0 else "red"
        run = 1
        for j in range(i - 1, -1, -1):
            if mh[j] is None or (mh[j] >= 0) != (mh[i] >= 0):
                break
            run += 1

    return Frame(
        label=label, o=o[i], h=h[i], l=lo[i], c=c[i], v=v[i],
        rsi=r[i], macd=ml[i], macd_sig=ms[i], macd_hist=mh[i],
        hist_sign=sign, hist_run=run,
        stoch_k=sk[i], stoch_d=sd[i], obv=ob[i],
        bb_lo=bl[i], bb_mid=bm[i], bb_up=bu[i],
        ema9=e9[i], ema50=e50[i], ema200=e200[i],
    )


# ── daily -> weekly / monthly ───────────────────────────────────────────────

def resample(bars: list[dict], period: str) -> list[dict]:
    """period: 'W' (ISO week) or 'M' (calendar month). Bars need a 'date'
    (datetime.date). The final bucket is the in-progress bar, same as a chart."""
    out: list[dict] = []
    key = None
    for b in bars:
        d = b["date"]
        k = d.isocalendar()[:2] if period == "W" else (d.year, d.month)
        if k != key:
            out.append({"date": d, "o": b["o"], "h": b["h"], "l": b["l"],
                        "c": b["c"], "v": b["v"]})
            key = k
        else:
            cur = out[-1]
            cur["h"] = max(cur["h"], b["h"])
            cur["l"] = min(cur["l"], b["l"])
            cur["c"] = b["c"]
            cur["v"] += b["v"]
    return out
