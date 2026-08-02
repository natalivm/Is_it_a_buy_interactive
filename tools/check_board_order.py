#!/usr/bin/env python3
"""Verify board.js is in key order, and that both sides agree on direction.

    python3 tools/check_board_order.py

The structure board is emitted best-longs-first / best-shorts-last, and FILE
ORDER IS THE ORDER: script.js renders `rows` as written and tsv.js exports them
as written, so nothing downstream re-sorts. That makes the file itself the
thing to check, and two ways for it to go wrong:

  1. A hand-reordered or hand-inserted row. Cheap to do, invisible on screen,
     and silently undone by the next `structure.py` run — which is worse than
     being wrong immediately, because the board looks right until the bot runs.

  2. `lean()` in tools/structure.py drifting from `boardLean()` in script.js.
     The Python one picks the direction BLOCK a row is sorted into; the JS one
     picks the green/pink tint on the row. They are a deliberate literal port
     of each other, so if they separate, a green row appears inside the short
     block. Nothing else would catch that — each side is self-consistent.

So this re-derives the expected order with the Python key and compares it to
the file, then runs the real JS `boardLean` over the same rows and compares it
to the Python `lean` ticker by ticker.

Offline: reads the checked-out board.js through the same dump script
structure.py uses, and evaluates script.js headlessly in node.
"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import structure  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent

# script.js is a browser script: it evaluates fine headlessly, but only with the
# DOM globals it touches at load stubbed out. The proxy answers any property
# access with itself, so a stub never needs updating when the page grows.
LEAN_IN_NODE = r"""
const fs = require('fs'), vm = require('vm');
const noop = new Proxy(function () {}, {
    get: () => noop, apply: () => noop, construct: () => noop,
});
const ctx = {
    document: noop, window: noop, navigator: noop, localStorage: noop,
    location: { hash: '' }, addEventListener() {}, setTimeout() {},
    matchMedia: () => ({ matches: false, addEventListener() {} }),
};
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('board.js', 'utf8'), ctx);
vm.runInContext(fs.readFileSync('script.js', 'utf8'), ctx);
vm.runInContext(
    'this.__out = JSON.stringify(BOARD.rows.map(r => [r.ticker, boardLean(r)]));',
    ctx);
process.stdout.write(ctx.__out);
"""


def run(cmd: list[str], **kw) -> str:
    return subprocess.run(cmd, capture_output=True, text=True, check=True,
                          cwd=ROOT, **kw).stdout


def main() -> int:
    rows = json.loads(run(['node', 'tools/dump_structure.js'])).get('rows') or []
    if not rows:
        print('board.js has no rows', file=sys.stderr)
        return 1

    fails: list[str] = []

    # 1 — file order against the emitted key.
    actual = [r['ticker'] for r in rows]
    expected = [r['ticker'] for r in sorted(rows, key=structure.order_key)]
    if actual != expected:
        fails.append(
            'board.js rows are not in key order.\n'
            f'  file:     {" ".join(actual)}\n'
            f'  expected: {" ".join(expected)}\n'
            '  Do not hand-reorder — change order_key in tools/structure.py '
            'and re-emit, or the next bot run undoes it.')

    # 2 — the Python sort key's direction against the JS tint's.
    js = dict(json.loads(run(['node', '-e', LEAN_IN_NODE])))
    drift = [(t, structure.lean(r), js.get(t))
             for t, r in ((r['ticker'], r) for r in rows)
             if structure.lean(r) != js.get(t)]
    if drift:
        fails.append(
            'lean() in tools/structure.py disagrees with boardLean() in '
            'script.js — a row would be tinted one way and sorted the other:\n'
            + '\n'.join(f'  {t}: python {p!r} vs js {j!r}' for t, p, j in drift))

    if fails:
        print('\n\n'.join(fails), file=sys.stderr)
        return 1

    blocks: dict[str, int] = {}
    for r in rows:
        blocks[structure.lean(r)] = blocks.get(structure.lean(r), 0) + 1
    order = ', '.join(f'{n} {k}' for k, n in blocks.items())
    print(f'ok  board order — {len(rows)} rows ({order}), '
          f'{actual[0]} → {actual[-1]}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
