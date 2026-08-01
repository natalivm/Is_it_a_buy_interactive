#!/usr/bin/env node
// Dump data.js as JSON on stdout so the Python refresher can read the board
// without regex-parsing a file full of em-dashes and curly quotes.
//
//   node tools/dump_board.js > /tmp/board.json
//
// data.js is a plain script (no exports) — it is evaluated in a throwaway VM
// context and the three globals are pulled back out.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const file = path.join(__dirname, '..', 'data.js');
const ctx = {};
vm.createContext(ctx);
vm.runInContext(
    fs.readFileSync(file, 'utf8') + ';this.__board = { MARKET, STOCKS, ARTICLES };',
    ctx,
    { filename: 'data.js' }
);
process.stdout.write(JSON.stringify(ctx.__board, null, 2));
