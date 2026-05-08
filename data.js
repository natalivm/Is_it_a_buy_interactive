// ── App config ──────────────────────────────────────────────────────────────
const APP_CONFIG = {
  // Year shown in the heatmap calendar
  heatmapYear: 2026,
  // Color thresholds for daily P&L heatmap squares (% from entry)
  pnlBuckets: [
    { min:  8, cls: 'hm-gain-3' },
    { min:  3, cls: 'hm-gain-2' },
    { min:  0, cls: 'hm-gain-1' },
    { min: -3, cls: 'hm-loss-1' },
    { min: -8, cls: 'hm-loss-2' },
    { min: -Infinity, cls: 'hm-loss-3' },
  ],
};

// ── Ticker alerts ───────────────────────────────────────────────────────────
const TICKER_DATA = [
  { tier: 'warning',        icon: '⚠', symbol: 'TSEM',  body: 'Long · enter at <strong>$200.75</strong> · stop <strong>$179.00</strong> · target <strong>$250.00</strong> · wide stop — go small!' },
  { tier: 'high-potential', icon: '↗', symbol: 'STX',   body: 'Short · current <strong>$645.82</strong> · target <strong>$361.00</strong> · <strong>44.1%</strong> potential' },
  { tier: 'high-potential', icon: '↗', symbol: 'BE',    body: 'Short · current <strong>$279.48</strong> · target <strong>$185.00</strong> · <strong>33.8%</strong> potential' },
  { tier: 'high-potential', icon: '↗', symbol: 'AMD',   body: 'Short · current <strong>$351.50</strong> · target <strong>$285.00</strong> · <strong>18.9%</strong> potential' },
  { tier: 'setup',          icon: '↗', symbol: 'NBIS',  body: 'Earnings today · watch for push up to re-enter Short' },
  { tier: 'setup',          icon: '↗', symbol: 'GOOGL', body: 'Short · current <strong>$383.60</strong> · large position · <strong>-9.3%</strong> · watching' },
];

// ── Trade setups ────────────────────────────────────────────────────────────
// Each setup describes a planned trade. Trigger detection, daily P&L, and
// "if held to today" P&L are all computed from prices.js historical OHLC.
//
// Fields:
//   id              unique slug
//   symbol          ticker
//   direction       'Long' | 'Short'
//   entryTrigger    price that, once hit, triggers entry (null = not set)
//   stop            protective stop price (null = none yet)
//   target          profit target price (null = none yet)
//   setupType       'Breakout' | 'Pullback' | 'Reversal' | 'Earnings' | …
//   tier            null | 'warning' | 'high-potential' | 'setup'
//   addedDate       ISO date when the setup was added (YYYY-MM-DD)
//   notes           freeform text
//   status          'watching' | 'cancelled' | 'closed'
//                   (a 'watching' setup whose entry was hit becomes 'open'
//                    automatically — set 'closed' only after the manual exit)
//   triggeredDate   manual override (YYYY-MM-DD) or null = auto-detect
//   closedDate      ISO date the trade was manually closed (null = still open)
//   closePrice      closing price (null = use that day's close)
//   closeReason     'target' | 'stop' | 'manual' | 'time' | null
const SETUPS = [
  {
    id: 'tsem-2026-04-30', symbol: 'TSEM', direction: 'Long',
    entryTrigger: 200.75, stop: 179.00, target: 250.00,
    setupType: 'Breakout', tier: 'warning',
    addedDate: '2026-04-30',
    notes: 'Top-rated semicon play out of Israel · should get a boost from QCOM earnings and is set to break the recent pullback · wide stop — go small!',
    status: 'watching', triggeredDate: null, closedDate: null, closePrice: null, closeReason: null,
  },
  {
    id: 'stx-2026-04-16', symbol: 'STX', direction: 'Short',
    entryTrigger: 553.79, stop: null, target: 361.00,
    setupType: 'Reversal', tier: 'high-potential',
    addedDate: '2026-04-16',
    notes: 'Extended after blow-off · 44% target · sized for slow grind down',
    status: 'watching', triggeredDate: null, closedDate: null, closePrice: null, closeReason: null,
  },
  {
    id: 'be-2026-04-21', symbol: 'BE', direction: 'Short',
    entryTrigger: 253.03, stop: null, target: 185.00,
    setupType: 'Reversal', tier: 'high-potential',
    addedDate: '2026-04-21',
    notes: 'Parabolic · 33.8% potential to mean',
    status: 'watching', triggeredDate: null, closedDate: null, closePrice: null, closeReason: null,
  },
  {
    id: 'amd-2026-04-23', symbol: 'AMD', direction: 'Short',
    entryTrigger: 309.14, stop: null, target: 285.00,
    setupType: 'Pullback', tier: 'high-potential',
    addedDate: '2026-04-23',
    notes: 'Short the rip back into resistance',
    status: 'watching', triggeredDate: null, closedDate: null, closePrice: null, closeReason: null,
  },
  {
    id: 'nbis-2026-04-30', symbol: 'NBIS', direction: 'Short',
    entryTrigger: null, stop: null, target: null,
    setupType: 'Earnings', tier: 'setup',
    addedDate: '2026-04-30',
    notes: 'Earnings today · watch for a push up to re-enter Short',
    status: 'watching', triggeredDate: null, closedDate: null, closePrice: null, closeReason: null,
  },
  {
    id: 'googl-2026-04-14', symbol: 'GOOGL', direction: 'Short',
    entryTrigger: 351.00, stop: null, target: null,
    setupType: 'Reversal', tier: 'setup',
    addedDate: '2026-04-14',
    notes: 'Large position planned · watching for confirmation',
    status: 'watching', triggeredDate: null, closedDate: null, closePrice: null, closeReason: null,
  },
  {
    id: 'mu-2026-04-24', symbol: 'MU', direction: 'Short',
    entryTrigger: 518.25, stop: null, target: null,
    setupType: 'Reversal', tier: null,
    addedDate: '2026-04-24',
    notes: 'Mean-reversion short',
    status: 'watching', triggeredDate: null, closedDate: null, closePrice: null, closeReason: null,
  },
  {
    id: 'figs-2026-04-22', symbol: 'FIGS', direction: 'Long',
    entryTrigger: 15.71, stop: 14.50, target: 20.00,
    setupType: 'Breakout', tier: null,
    addedDate: '2026-04-22',
    notes: 'Tight base · 27% to target · small risk',
    status: 'watching', triggeredDate: null, closedDate: null, closePrice: null, closeReason: null,
  },
  {
    id: 'nxt-2026-04-24', symbol: 'NXT', direction: 'Long',
    entryTrigger: 124.70, stop: 113.50, target: 160.00,
    setupType: 'Pullback', tier: null,
    addedDate: '2026-04-24',
    notes: 'Solar leader · bid back to 50dma',
    status: 'watching', triggeredDate: null, closedDate: null, closePrice: null, closeReason: null,
  },
  // Example of an already-triggered setup that was manually closed —
  // delete or replace once you have your own real history.
  {
    id: 'nbis-closed-2026-04-30', symbol: 'NBIS', direction: 'Long',
    entryTrigger: 86.50, stop: 80.00, target: 105.00,
    setupType: 'Pullback', tier: null,
    addedDate: '2026-04-25',
    notes: 'Closed for +15.7% the day before earnings',
    status: 'closed',
    triggeredDate: '2026-04-25',
    closedDate: '2026-04-30',
    closePrice: 100.10,
    closeReason: 'target',
  },
];
