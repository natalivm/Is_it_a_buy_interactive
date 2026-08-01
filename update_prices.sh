#!/usr/bin/env bash
# Refresh the board's numbers from OHLCV — a thin wrapper around
# tools/refresh.py (see tools/README.md for the full usage).
#
#   ./update_prices.sh                 every ticker on the board
#   ./update_prices.sh MU SNDK WDC     a few
#   ./update_prices.sh --audit-only    no network, just audit the cards
#
# refresh.py is dependency-free by default, so no venv is needed. Pass
# --source yfinance to use the optional feed in requirements.txt (install it
# yourself: python3 -m pip install -r requirements.txt).
set -e

cd "$(dirname "$0")"

python3 tools/refresh.py "$@"
