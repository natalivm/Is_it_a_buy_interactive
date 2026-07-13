// ── Stocks ──────────────────────────────────────────────────────────────────
// Each entry renders one tile in the gallery. Clicking a tile opens its
// interactive story — a self-contained HTML slideshow living in /stories.
//
// Fields:
//   symbol     ticker shown on the tile
//   exchange   listing venue (NASDAQ, NYSE, …)
//   price      last-price label, freeform string (e.g. '$175.18')
//   change     short change label (e.g. '+2% today') or null
//   signal     one-line thesis shown on the tile
//   side       'long' | 'short'             → setup direction; colors the tile chip
//   lead       (optional) leaderboard row: { rank, entry, stop, targets,
//              downside, tail?, rr, rrStar?, edge } — entries with a `lead`
//              render in the "Sharpest trades" table (long or short, no cap),
//              ordered by rank; omit `lead` to keep a name off the board
//   accent     (optional) tile glow colour — the gallery now auto-varies tile
//              colours across the grid, so this field is no longer required
//   date       ISO date the plan was posted (YYYY-MM-DD) — gallery sorts newest first
//   story      path to the interactive presentation HTML
//
// To add a stock: drop its story at stories/<symbol>.html and add an entry here.
const STOCKS = [
  {
    symbol: 'AAOI', exchange: 'NASDAQ',
    price: '$119.92', change: '−1.87% · Jul 10',
    signal: 'Weak doji bounce, distribution rolling — closed −1.87% at $119.92, bounced off $113 but on no volume; under the MA stack (9-EMA $140 / 50-EMA $155), RSI 39, and the worst OBV in the group (250m → 123m). Fade the bounce into $128–140, stop $141; targets $110 → $101 (200-EMA) → $90; reclaim $141 repairs it',
    lead: { rank: 6, entry: '$128–140', stop: '$141', targets: '$110 → $101 → $90', downside: '−33%', rr: '3:1', edge: 'Heaviest OBV distribution in the group' },
    side: 'short', accent: 'violet',
    date: '2026-07-10',
    story: 'stories/aaoi.html',
  },
  {
    symbol: 'WDC', exchange: 'NASDAQ',
    price: '$555.55', change: '−4.64% · Jul 13',
    signal: 'Lost the middle — back to weak — −4.64% to $555.55 (AH $553), rejoining the group selloff and slipping under the 4h MA stack (9/200-EMA $561 / 50-EMA $580) though still above VWAP $546 and the ~$540 range floor. RSI ~45, two-sided but leaning down. Still the healthiest of the shorts — fade rallies into $580–607, stop $620; targets $540 → $513 → $491. Lose $540 accelerates; reclaim $607 neutralizes. A range short, not a breakdown — lower conviction',
    side: 'short',
    date: '2026-07-13',
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$103.12', change: '−6.12% · Jul 13',
    signal: 'Short working, T1 hit — −6.12% to $103.12 (AH $103.22), broke the 4h lower BB ($105) and tagged T1 $104; deeply oversold (4h RSI 28) with the worst OBV in the group (−546m, relentless distribution). Under the whole stack (9-EMA $112 / 200-EMA $115 / 50-EMA $123). T1 done — trim/cover, don’t chase down here; re-short bounces into $110–118, stop $124; targets $98 → $92 → $85. Reclaim $124 negates',
    lead: { rank: 5, entry: '$110–118', stop: '$124', targets: '$98 → $92 → $85', downside: '−25%', rr: '~2.9:1', edge: 'Worst OBV in the group (−546m) — short working, T1 hit' },
    side: 'short', accent: 'blue',
    date: '2026-07-13',
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$921.31', change: '−5.92% · Jul 13',
    signal: 'Broke $954, short working — dumped −5.92% to $921.31 (AH bounced to $929), losing the $942 line that held it last week; now under the whole 4h stack ($936–963: 200-EMA/VWAP/9-EMA/BB mid) and deeply oversold (daily stoch 8, 4h 21). The fade worked — don’t chase down here. Re-short bounces into $940–963, stop $985; targets $900 → $885 → $860. Reclaim $963 relieves; still two-sided, respect the oversold bounce',
    side: 'short', accent: 'cyan',
    date: '2026-07-13',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$341.11', change: '−5.14% · Jul 13',
    signal: 'Short working — broke the demand zone, −5.14% to $341.11 (AH $340.21), losing the $345 shelf it defended last week and heading for T1 $324; under the 50-EMA $378 and the whole stack, daily RSI 41 (room to run) with the MACD rolled over. The laggard call vs SMH is paying off. Re-short bounces into $358–380 (broken zone / 50-EMA), stop $390; targets $324 → $300 → $292. Reclaim $390 negates',
    lead: { rank: 1, entry: '$358–380', stop: '$390', targets: '$324 → $300 → $292', downside: '−21%', rr: '~6:1', rrStar: true, edge: 'Broke the demand zone — working to $324, the laggard vs SMH' },
    side: 'short', accent: 'blue',
    date: '2026-07-13',
    story: 'stories/ter.html',
  },
  {
    symbol: 'GLW', exchange: 'NYSE',
    price: '$183.11', change: '−4.08% · Jul 13',
    signal: 'Lost the 50-day — short working — −4.08% to $183.11 (AH $181.75), losing the $189 50-day it was perched on and dropping under the whole 4h stack (9/200-EMA $192–193 / 50-EMA $202 / VWAP $198); now at T1 $180 with the daily 50-EMA $174 the next magnet and OBV rolling (607m). Fade rallies into $190–198, stop $207; targets $180 → $167 → $152. Reclaim $198 weakens it',
    side: 'short', accent: 'blue',
    date: '2026-07-13',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,678.95', change: '−12.37% · Jul 13',
    signal: 'Leader knifed — flipped to short — −12.37% to $1,678.95 (AH $1,655), a bearish engulfing that closed on the low and blew through the $1,760 stop; the buy-dip long is out. Now under the 4h stack (9-EMA $1,705 / 200-EMA $1,740) and the daily 9-EMA $1,828, with the lower BB $1,572 and $1,536 shelf below. 4h RSI 25 — don’t chase down here; fade the bounce into $1,705–1,790, stop $1,835; targets $1,572 → $1,536 → $1,480. Loss of $1,536 opens $1,222; reclaim $1,835 negates',
    lead: { rank: 3, entry: '$1,705–1,790', stop: '$1,835', targets: '$1,572 → $1,536 → $1,480', downside: '−15%', rr: '3:1', edge: 'Biggest breakdown in the group −12.4% — fade the dead-cat bounce' },
    side: 'short', accent: 'red',
    date: '2026-07-13',
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$585.62', change: '−4.16% · Jul 13',
    signal: 'Barometer held the 50-day — flushed −4.16% to $585.62 (AH $586.06) on the broad selloff but closed above the daily 50-EMA $580, so the sector uptrend is intact-but-tested (still well above the 200-EMA $457). Now under the 4h 200-EMA $591 and 9-EMA $604 — short-term weak, daily line held. $580 is make-or-break: constructive above it (STX-type dip-buys valid), below it opens $573 → $557 and the group’s longs are in trouble. The tell is relative strength — long what held its 50-EMA (STX), short the laggards (TER, BE, SNDK)',
    side: 'long', accent: 'cyan',
    date: '2026-07-13',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$853.00', change: '−6.30% · Jul 13',
    signal: 'Dip in an intact uptrend — long — −6.30% to $853 (AH $856.50) tagged the rising daily 50-EMA $842 (low $840) and bounced off the low; the daily trend is intact (above the 50/200-EMA, daily stoch 26 oversold) and it held its 50-EMA while the rest of the group lost theirs. Buy the dip $842 (add on a reclaim of $889), stop $838; targets $889 → $910 → $948. A daily close < $840 breaks the trend → stand aside',
    lead: { rank: 2, entry: '$842 dip · add $889', stop: '$838', targets: '$889 → $910 → $948', downside: '+12%', rr: '~4:1', edge: 'Held the 50-EMA while the group broke — buy the dip in the strongest name' },
    side: 'long', accent: 'emerald',
    date: '2026-07-13',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$73.32', change: '−0.76% · Jul 10',
    signal: 'No trade — range $70–80 — closed −0.76% at $73.32, now below all its MAs (9 $77 / 50 $85 / 200 $79) with RSI 40 and OBV rolling; stand aside until it picks a side, but the lean is weak. Reclaim $80 → $86 revives the long; lose $68–70 opens $66–69 then $57–60',
    side: 'long', accent: 'violet',
    date: '2026-07-10',
    story: 'stories/asts.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$219.65', change: '+1.60% · Jul 10',
    signal: 'Defended, capped under the stack — green day +1.60% to $219.65 near the high (AH $219), holding the 50-EMA $217 after defending $207, but still under the daily 9-EMA $225 / 4h 50–200-EMA $225–227. Two-sided: fade rallies into $225–233, stop $235 (reclaim = long); targets $207 → $200 → $192. Not a clean short — respect the bounce',
    side: 'short', accent: 'indigo',
    date: '2026-07-10',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$602.50', change: '+2.35% · Jul 10',
    signal: 'Defended, capped under the stack — green day +2.35% to $602.50 near the high (AH $605), back above the daily 50-EMA after defending $574, but still under the 4h 9-EMA $618 / 50-EMA $631. Two-sided: fade rallies into $618–631, stop $645 (reclaim = long); targets $573 → $538 → $510. Not a clean short — respect the bounce',
    side: 'short', accent: 'red',
    date: '2026-07-10',
    story: 'stories/amat.html',
  },
  {
    symbol: 'BE', exchange: 'NYSE',
    price: '$236.53', change: '−3.30% · Jul 13',
    signal: 'Short working, near T1 — another red day, closed −3.30% at $236.53 (AH $232.37), broke below the 4h lower BB ($240) and is basically at T1 $226; deeply oversold after a super-volatile session (4h stoch 9, daily 15, RSI 40). The thesis played out — trim/cover into $226–229, don’t chase new shorts down here. Re-short bounces into the broken stack $256–280 (9-EMA $279 / 200-EMA $275 / VWAP $275), stop $296; targets $210 → $183. Reclaim $296 negates',
    lead: { rank: 4, entry: '$256–280', stop: '$296', targets: '$226 → $210 → $183', downside: '−32%', rr: '3:1', edge: 'Short working — at T1 $226, oversold; re-short the broken stack' },
    side: 'short', accent: 'amber',
    date: '2026-07-13',
    story: 'stories/be.html',
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
