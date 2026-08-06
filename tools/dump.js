#!/usr/bin/env node
// Dump a hand-edited board file as JSON on stdout, so the Python tools can read
// it without regex-parsing a file full of em-dashes, curly quotes and comments.
//
//   node tools/dump.js data.js MARKET STOCKS ARTICLES   # the cards
//   node tools/dump.js board.js BOARD                   # the structure board
//
// With one global named, that global IS the output (board.js → the BOARD
// object). With several, the output is an object keyed by name (data.js → all
// three arrays). A missing file prints `{}` and exits 0 — board.js does not
// exist before the first run, and asking what it holds then is a fair question
// with an empty answer, not an error.
//
// Both files are plain scripts with no exports, so they are evaluated in a
// throwaway VM context and the named globals pulled back out. That also means a
// generated board (pure JSON) and a hand-written one (single quotes,
// concatenated strings, trailing comments) read identically.
//
// This replaced dump_board.js and dump_structure.js, which were the same
// fifteen lines twice over — differing only in the filename and the globals,
// which is exactly what arguments are for.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const [file, ...globals] = process.argv.slice(2);
if (!file || !globals.length) {
    process.stderr.write('usage: dump.js <file.js> <GLOBAL> [GLOBAL...]\n');
    process.exit(2);
}

const target = path.isAbsolute(file) ? file : path.join(__dirname, '..', file);
if (!fs.existsSync(target)) {
    process.stdout.write('{}');
    process.exit(0);
}

const ctx = {};
vm.createContext(ctx);
vm.runInContext(
    fs.readFileSync(target, 'utf8')
        + `;this.__out = ${globals.length === 1 ? globals[0]
            : `{ ${globals.map(g => `${g}: ${g}`).join(', ')} }`};`,
    ctx,
    { filename: path.basename(target) }
);
process.stdout.write(JSON.stringify(ctx.__out, null, 2));
