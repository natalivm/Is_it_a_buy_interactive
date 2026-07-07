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
//              render in the "Sharpest shorts" table, ordered by rank
//   accent     (optional) tile glow colour — the gallery now auto-varies tile
//              colours across the grid, so this field is no longer required
//   date       ISO date the plan was posted (YYYY-MM-DD) — gallery sorts newest first
//   story      path to the interactive presentation HTML
//
// To add a stock: drop its story at stories/<symbol>.html and add an entry here.
const STOCKS = [
  {
    symbol: 'AAOI', exchange: 'NASDAQ',
    price: '$112.51', change: '−8.80% · Jul 7',
    signal: 'Breaking down hard — momentum unwind from ~$212, down −8.8% to $112 and walking the 4h lower band below the whole MA stack; MACD negative, Stoch deeply weak. Direct test of the $101–105 major support underway; fade bounces into $124–130, lose $101 → $90–96 then $74; reclaim $130 → $140 repairs it',
    side: 'short', accent: 'violet',
    date: '2026-07-07',
    story: 'stories/aaoi.html',
  },
  {
    symbol: 'WDC', exchange: 'NASDAQ',
    price: '$533.66', change: '−7.60% · Jul 7',
    signal: 'Momentum unwind — broke the 21-day $589, testing $530–535 support after −7.6%; oversold so a bounce can come, but short the failed bounce into $560–590, targets $500 → $465 → $440; break $530 → $500 fast; reclaim $589–605 to trust it',
    lead: { rank: 4, entry: '$560–590', stop: '$606', targets: '$500 → $465 → $440', downside: '−23%', rr: '2.4:1', edge: 'Fresh unwind, but at support' },
    side: 'short',
    date: '2026-07-07',
    story: 'stories/wdc.html',
  },
  {
    symbol: 'INTC', exchange: 'NASDAQ',
    price: '$111.20', change: '−9.00% · Jul 7',
    signal: 'Failed breakout — lost the 50-day $115 and the 4h trend support after −9%; oversold so no chase, short the bounce into $115–120, targets $101 → $94 → $86 (gap-fill $82, reset $70); lose $109 → $101 fast; reclaim $123–126 repairs it',
    lead: { rank: 1, entry: '$115–120', stop: '$124', targets: '$101 → $94 → $86', downside: '−27%', tail: '−41%', rr: '2.8:1', edge: 'Cleanest break; tightest risk' },
    side: 'short', accent: 'blue',
    date: '2026-07-07',
    story: 'stories/intc.html',
  },
  {
    symbol: 'MU', exchange: 'NASDAQ',
    price: '$937.30', change: '−4.82% · Jul 7',
    signal: 'Momentum unwind across 4h/daily/weekly from a huge run — bounced off $920 support into the close but oversold, no chase; short the failed bounce into $970–1,015, targets $860 → $810 → $675; reclaim $1,050 flips it',
    lead: { rank: 3, entry: '$970–1,015', stop: '$1,050', targets: '$860 → $810 → $675', downside: '−32%', rr: '2.1:1', edge: 'Most extended → furthest to fall' },
    side: 'short', accent: 'cyan',
    date: '2026-07-07',
    story: 'stories/mu.html',
  },
  {
    symbol: 'TER', exchange: 'NASDAQ',
    price: '$339.61', change: '−10.57% · Jul 7',
    signal: 'Blow-off from $494 — knife onto the daily 50-day $337, 4h deeply oversold (RSI 23, Stoch 6); bounce likely but fade into $383–390, bias down; targets $318 → $300 → $260',
    lead: { rank: 6, entry: '$383–390', stop: '$391', targets: '$318 → $300 → $260', downside: '−32%', rr: '~10:1', rrStar: true, edge: 'Blow-off, but on the 50-day' },
    side: 'short', accent: 'blue',
    date: '2026-07-07',
    story: 'stories/ter.html',
  },
  {
    symbol: 'GLW', exchange: 'NYSE',
    price: '$185.36', change: '−4.85% · Jul 7',
    signal: 'Blow-off follow-through — lost the 4h 200-EMA $194, down to $185 closing on T1 $180; deeply oversold (RSI 28, Stoch Mtm −73) so a bounce can come but sold into $194 → $205; targets $180 → $167 → $150; reclaim $217 negates',
    lead: { rank: 7, entry: '$194–205', stop: '$217', targets: '$180 → $167 → $150', downside: '−25%', rr: '2.4:1', edge: 'Lost 200-EMA; fade the oversold bounce' },
    side: 'short', accent: 'blue',
    date: '2026-07-07',
    story: 'stories/glw.html',
  },
  {
    symbol: 'SNDK', exchange: 'NASDAQ',
    price: '$1,610', change: '−7.69% · Jul 7',
    signal: 'Memory rout continuing — $1,731 lost, now $1,610 (−7.7%) into the air pocket toward the $1,544 shelf; daily bear cross deepening, Stoch 10 oversold; fade bounces into $1,850–1,945, buy only the fib flush at $1,394–1,420',
    lead: { rank: 9, entry: '$1,850–1,945', stop: '$1,970', targets: '$1,544 → $1,420 → $1,394', downside: '−26%', rr: '~6:1', rrStar: true, edge: 'Air pocket to the $1,394 fib' },
    side: 'short', accent: 'red',
    date: '2026-07-07',
    story: 'stories/sndk.html',
  },
  {
    symbol: 'SMH', exchange: 'NASDAQ',
    price: '$582.81', change: '−3.56% · Jul 7',
    signal: 'Sector barometer breaking — down to $582.81, sitting on the weekly-low pivot after −3.6%; daily bear cross confirmed, Stoch rolling toward oversold; hold $582 or fall to $533 → $500; reclaim $599 relieves it; drags all semis',
    side: 'short', accent: 'cyan',
    date: '2026-07-07',
    story: 'stories/smh.html',
  },
  {
    symbol: 'STX', exchange: 'NASDAQ',
    price: '$824.49', change: '−5.04% · Jul 7',
    signal: 'Fade working — bounced into the $868 supply, rejected −5% to $824; daily bear cross deepening, Stoch 20 oversold; bias down under $875, T1 $795 → $778 → $648; reclaim $875 negates',
    lead: { rank: 5, entry: '$850–875', stop: '$900', targets: '$795 → $778 → $648', downside: '−24%', rr: '2.5:1', edge: 'Fade confirmed; room to $648' },
    side: 'short', accent: 'amber',
    date: '2026-07-07',
    story: 'stories/stx.html',
  },
  {
    symbol: 'ASTS', exchange: 'NASDAQ',
    price: '$77.17', change: '−4.30% · Jul 7',
    signal: 'Broke the $80 base to $77 — decision point; a bounce to $81–86 is possible but continuation needs a reclaim of $86–87; LOSE $76 and the long is stopped → $66–69, then $57–60',
    side: 'long', accent: 'violet',
    date: '2026-07-07',
    story: 'stories/asts.html',
  },
  {
    symbol: 'SEZL', exchange: 'NASDAQ',
    price: '$179.60', change: '+0.30% · Jul 7',
    signal: 'Pulled back into the buy zone — $179.60, into the $178–180 dip the plan named; RSI cooled 84→76, still parabolic above the 10-EMA $170; buy dips $170–178, targets $195 → $200+; lose $170 cracks it',
    lead: { rank: 2, entry: '$178–180', stop: '$168', targets: '$200 → $210 → $230', downside: '+28%', rr: '3.4:1', edge: 'Best long — buy zone active now' },
    side: 'long', accent: 'emerald',
    date: '2026-07-07',
    story: 'stories/sezl.html',
  },
  {
    symbol: 'NBIS', exchange: 'NASDAQ',
    price: '$203.56', change: '−4.44% · Jul 7',
    signal: 'Lost the 50-day $213 — daily MACD accelerating down; 4h oversold (Stoch 8) so no chase here, short the failed bounce into $212–217; below $200 opens $192 → $174 → $157; reclaim $217→$232 negates',
    lead: { rank: 8, entry: '$212–217', stop: '$233', targets: '$192 → $174 → $157', downside: '−27%', rr: '1.3:1', edge: 'Broken, but already at support' },
    side: 'short', accent: 'indigo',
    date: '2026-07-07',
    story: 'stories/nbis.html',
  },
  {
    symbol: 'AMAT', exchange: 'NASDAQ',
    price: '$551.07', change: '−7.04% · Jul 7',
    signal: 'Blow-off unwinding — down −7% to $551, tagged T1 $555; daily MACD bear cross, Stoch collapsing from overbought; next $510 → $470; re-short bounces into $580–595, reclaim $620 negates',
    side: 'short', accent: 'red',
    date: '2026-07-07',
    story: 'stories/amat.html',
  },
  {
    symbol: 'BE', exchange: 'NYSE',
    price: '$268.86', change: '−8.88% · Jul 7',
    signal: 'Short working — shooting star from $320, now $269 after −8.9%; bank partial at T1 $252 (= daily 50-day), break opens $236 → $225; re-short bounces into $283–288, invalid above $305',
    side: 'short', accent: 'amber',
    date: '2026-07-07',
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
