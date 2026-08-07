'use strict';

// ── Structure board → TSV ───────────────────────────────────────────────────
// Tab-separated, one row per ticker, for pasting straight into Google Sheets
// (or Excel/Numbers) — a paste of TSV splits into columns with no import step.
//
// Deliberately ONE definition, used from both sides: index.html loads this for
// the board's "Copy for Sheets" button, and the structure-board workflow evals
// it in node to drop a board.tsv into its artifact. A second column list would
// drift from the first the moment either changed.
//
// Every field is flattened to a single line. Sheets can read quoted multi-line
// cells, but a stray newline in an unquoted one silently shifts every following
// column into the wrong place, and a wrong-but-plausible spreadsheet is worse
// than an ugly one. Tabs are stripped for the same reason.
//
// Columns are SPLIT rather than combined — separate Monthly/Weekly/Daily/4H
// columns, separate ATR and ATR% — because a spreadsheet's whole point is
// sorting and filtering on a single field.

(function (root) {

    // Markdown bold is display syntax; a spreadsheet cell wants the words.
    function plain(v) {
        if (v == null) return '';
        return String(v)
            .replace(/\*\*(.+?)\*\*/g, '$1')
            .replace(/<[^>]*>/g, '')
            .replace(/[\t\r\n]+/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .trim();
    }

    function num(v) {
        return (typeof v === 'number' && isFinite(v)) ? String(v) : '';
    }

    // "$378–383 tested (immediate)" — the range, its grade, and whatever detail
    // the row carries: an analyst note on a seeded row, touch counts on a
    // computed one.
    function zones(list) {
        if (!Array.isArray(list) || !list.length) return '';
        return list.map(function (z) {
            const range = z.lo === z.hi ? '$' + z.lo : '$' + z.lo + '–' + z.hi;
            const bits = [];
            if (z.strength) bits.push(z.strength);
            if (z.note) bits.push(z.note);
            else if (z.touches != null) {
                bits.push(z.touches + (z.touches === 1 ? ' touch' : ' touches'));
                if (z.heavyTouches) bits.push(z.heavyTouches + ' heavy');
            }
            return range + (bits.length ? ' ' + bits.join(', ') : '');
        }).join('; ');
    }

    function frame(row, key) {
        const s = row.structure || {};
        const prose = row.trendProse || {};
        const t = (row.trend || {})[key];
        // A generated row's prose IS its trend band, so preferring it here
        // would print "uptrend (+3 uptrend)". Fall back to the structure enum
        // in that case: the two halves of the cell then say different things —
        // the frame's structure, then the trend score that scored it.
        const sameAsBand = t && prose[key] === t.band;
        const words = (sameAsBand ? s[key] : prose[key] || s[key]) || '';
        // Append the computed trend band where the extractor produced one, so a
        // generated row carries its score into the sheet rather than only prose.
        return t ? plain(words + ' (' + (t.score > 0 ? '+' : '') + t.score
                         + ' ' + t.band + ')')
                 : plain(words);
    }

    const COLUMNS = [
        ['Ticker', function (r) { return r.ticker; }],
        ['Price', function (r) { return num(r.price); }],
        ['ATR(14)', function (r) { return num(r.atr); }],
        ['ATR %', function (r) { return num(r.atrPct); }],
        ['Monthly', function (r) { return frame(r, 'm'); }],
        ['Weekly', function (r) { return frame(r, 'w'); }],
        ['Daily', function (r) { return frame(r, 'd'); }],
        ['4H', function (r) { return frame(r, 'h4'); }],
        ['Combo', function (r) { return plain(r.combo); }],
        ['Score', function (r) { return r.score == null ? '' : String(r.score); }],
        ['Score parts', function (r) {
            if (!r.parts) return '';
            return ['W', 'D', 'H', 'R', 'M', 'O', 'Z']
                .map(function (k) { return k + (r.parts[k] > 0 ? '+' : '') + r.parts[k]; })
                .join(' ');
        }],
        ['Bias', function (r) { return plain(r.bias); }],
        ['Preferred direction', function (r) { return plain(r.preferred); }],
        ['Direction groups', function (r, board) {
            const g = ((board.direction || {}).groups || [])
                .filter(function (x) { return (x.tickers || []).indexOf(r.ticker) >= 0; });
            return g.map(function (x) { return x.label; }).join('; ');
        }],
        ['Nearest demand', function (r) { return zones(r.demand); }],
        ['Nearest supply', function (r) { return zones(r.supply); }],
        // The extractor's 4H refinement, in its own columns for the same
        // reason every other pair is split: a sheet sorts on one field. Kept
        // separate from the daily zones here as on screen — they are drawn on
        // a different frame and nothing scores them.
        ['4H demand', function (r) { return zones(r.demand4h); }],
        ['4H supply', function (r) { return zones(r.supply4h); }],
        ['Current position', function (r) { return plain(r.position); }],
        ['Bullish trigger', function (r) { return plain(r.bull); }],
        ['Long setup', function (r) { return plain(r.longSetup); }],
        ['Long candidate', function (r) { return plain(r.longCandidate); }],
        ['Bearish trigger', function (r) { return plain(r.bear); }],
        ['Short setup', function (r) { return plain(r.shortSetup); }],
        ['Likely retest', function (r) { return plain(r.retest); }],
        ['4H read', function (r) { return plain(r.h4); }],
        // Not rendered in the 4H cell — that column is one paragraph plus
        // the four frames, with no optional second block. It lives here so
        // the reasoning still leaves the file, same as score/parts.
        ['4H effect', function (r) { return plain(r.h4Effect); }],
        ['As of', function (r, board) { return r.date || board.updated || ''; }],
        ['Source', function (r) { return r.seeded ? 'seeded' : 'computed'; }],
    ];

    function boardTsv(board) {
        if (!board || !Array.isArray(board.rows)) return '';
        const lines = [COLUMNS.map(function (c) { return c[0]; }).join('\t')];
        board.rows.forEach(function (r) {
            lines.push(COLUMNS.map(function (c) {
                // Guard the join itself: a value that still contains a tab would
                // shift every column after it.
                return String(c[1](r, board) == null ? '' : c[1](r, board))
                    .replace(/[\t\r\n]+/g, ' ');
            }).join('\t'));
        });
        return lines.join('\n');
    }

    root.boardTsv = boardTsv;
    root.BOARD_TSV_COLUMNS = COLUMNS.map(function (c) { return c[0]; });

}(typeof globalThis !== 'undefined' ? globalThis : this));
