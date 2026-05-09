# SwingTrader 2026 — Trade Setups

A static, single-page web app for tracking planned trade setups: when did the
entry trigger, how is the trade tracking day-by-day, and where would I be if I
were still holding it today?

## Files

- `index.html` — page shell (alert ticker, year heatmap, active setups, history)
- `styles.css` — dark theme
- `script.js` — trigger detection, daily P&L, heatmap rendering
- `data.js` — `SETUPS` array (the only file you edit by hand)
- `prices.js` — auto-generated OHLC history (regenerate with `fetch_setups.py`)
- `fetch_setups.py` — pulls daily OHLC from Yahoo Finance for every symbol in
  `data.js`, from each setup's `addedDate` through today

## Workflow

1. Add a setup to `SETUPS` in `data.js` with at minimum `symbol`, `direction`,
   `entryTrigger`, `addedDate`, `notes`.
2. Run `python3 fetch_setups.py` to refresh `prices.js`.
3. Open `index.html`. The app auto-detects whether each setup's entry was
   triggered (Long: high ≥ entry; Short: low ≤ entry), renders daily P&L from
   trigger day forward, and shows "if held to today" P&L.
4. When you exit a trade manually, edit the setup in `data.js`: set `status:
   'closed'`, `closedDate`, optional `closePrice`, and `closeReason`.
5. Run `fetch_setups.py` again to pick up the latest prices.

## Heatmap

GitHub-style 7×52 grid for the configured `heatmapYear`. Click any active
setup card to filter the heatmap to just that stock; click the "All" button to
clear. Trigger days are blue; close days purple; in-between days are colored
by daily P&L magnitude.

## Setup → close

Closes are manual — edit the setup in `data.js`. Until then, an open setup
shows the running daily P&L in the heatmap and modal, and the current "if held
to today" return on the card.

## Python setup

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python3 fetch_setups.py
```

## Deploy

Drop the repo on GitHub Pages — everything is static.
