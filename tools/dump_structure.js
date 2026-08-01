#!/usr/bin/env node
// Dump board.js as JSON on stdout so structure.py can read the CURRENT board
// before overwriting it — that is what --compare diffs the fresh numbers
// against.
//
//   node tools/dump_structure.js > /tmp/structure.json
//
// Same throwaway-VM trick as dump_board.js: board.js is a plain script whose
// generated form is JSON but whose hand-seeded form is ordinary JS (single
// quotes, concatenated strings, comments), so evaluating it beats parsing it.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const file = path.join(__dirname, '..', 'board.js');
if (!fs.existsSync(file)) {
    process.stdout.write('{}');
    process.exit(0);
}
const ctx = {};
vm.createContext(ctx);
vm.runInContext(
    fs.readFileSync(file, 'utf8') + ';this.__structure = BOARD;',
    ctx,
    { filename: 'board.js' }
);
process.stdout.write(JSON.stringify(ctx.__structure, null, 2));
