'use strict';

// ──────────────────────────────────────────────────────────────────────────
// Is It a BUY interactive — stock story gallery
//
// Renders one tile per entry in STOCKS (data.js). Clicking a tile opens that
// stock's interactive story (a self-contained slideshow in /stories) inside a
// full-screen overlay.
// ──────────────────────────────────────────────────────────────────────────

const STOCK_LIST = (typeof STOCKS !== 'undefined') ? STOCKS : [];
const ARTICLE_LIST = (typeof ARTICLES !== 'undefined') ? ARTICLES : [];
// Everything the gallery shows: stock decks + written articles, one list.
const ITEMS = [...STOCK_LIST, ...ARTICLE_LIST];

const SIDE_LABEL = { long: 'Long', short: 'Short' };

// Tile accent palette, spread across the gallery so adjacent tiles differ.
// Order is intentionally non-sequential so the grid reads varied, not a rainbow.
const TILE_ACCENTS = ['blue', 'amber', 'violet', 'emerald', 'red', 'cyan', 'indigo'];

// An entry's own `accent`, if it names one of the palette colours; 'violet' otherwise.
function accentOf(item) {
    return TILE_ACCENTS.includes(item.accent) ? item.accent : 'violet';
}

// symbol → accent, filled by renderGallery so the leaderboard can reuse each
// stock's tile colour (keeps a ticker the same colour everywhere it appears).
const accentBySymbol = {};

function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function fmtDate(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-').map(Number);
    if (!y || !m || !d) return '';
    return `${MONTHS[m - 1]} ${d}, ${y}`;
}

// ── Plan progress ───────────────────────────────────────────────────────────
// Computed live from each entry's `lead` (entry zone / targets) + `price`, so
// the numbers refresh whenever the plan or the price label does. "Earned" is
// measured from the entry-zone midpoint and only shown once the entry is
// actually filled (lead.entry contains "filled") — unfilled plans honestly
// report 0 instead of pretending the move was captured.
function planNums(str) {
    const m = String(str == null ? '' : str).replace(/,/g, '').match(/\d+(?:\.\d+)?/g);
    return m ? m.map(Number) : [];
}

// Is the current price inside the plan's entry zone? Pure geometry off the same
// two parsed fields the rest of the board uses, so it can never disagree with
// the numbers on screen. Returns null when either side is unparseable.
function priceInZone(stock) {
    const L = stock && stock.lead;
    if (!L) return null;
    const price = planNums(stock.price)[0];
    const zone = planNums(L.entry);
    if (!price || !zone.length) return null;
    return price >= Math.min(...zone) && price <= Math.max(...zone);
}

function planProgress(stock) {
    const L = stock && stock.lead;
    if (!L) return null;
    const price = planNums(stock.price)[0];
    const entryNums = planNums(L.entry);
    const targets = planNums(L.targets);
    if (!price || !entryNums.length || !targets.length) return null;
    const entry = (Math.min(...entryNums) + Math.max(...entryNums)) / 2;
    const target = targets[targets.length - 1];
    // % gain of the trade going from `from` to `to` (sign-aware per side).
    const gain = (from, to) => (stock.side === 'short' ? (from - to) / from : (to - from) / from) * 100;
    return {
        filled: /filled/i.test(L.entry),
        earned: gain(entry, price),   // entry-zone midpoint → current price
        target: gain(entry, target),  // entry-zone midpoint → deepest target
        left: gain(price, target),    // current price → deepest target
    };
}

function pct(n) {
    return `${n < 0 ? '−' : '+'}${Math.abs(n).toFixed(1)}%`;
}

// ── Booked gains ─────────────────────────────────────────────────────────────
// The strip is a LEDGER of realised results, wins and losses alike — it
// remembers, it does not re-derive from the current price (a squeeze back
// above a tagged target must not erase the win that was taken there).
//   lead.tagged  deepest target actually realised, recorded when it happens —
//                beats the current price as the reference level
//   lead.closed  exit level of a closed/stopped trade — the trade is scored
//                there, INCLUDING losses, and always stays on the strip
// Without either field the old behaviour stands: score the deepest target the
// current price has reached (0.3% tolerance for label rounding).
const TP_TOL = 0.003;
function bookedGains(list) {
    return (list || STOCK_LIST)
        .filter(s => s && s.lead && /filled/i.test(s.lead.entry))
        .map(s => {
            const L = s.lead;
            const price = planNums(s.price)[0];
            const entryNums = planNums(L.entry);
            const targets = planNums(L.targets);
            if (!entryNums.length || !targets.length) return null;
            const entry = (Math.min(...entryNums) + Math.max(...entryNums)) / 2;
            const short = s.side === 'short';
            const gainTo = lvl => (short ? (entry - lvl) / entry : (lvl - entry) / entry) * 100;
            const reachedBy = ref => targets.filter(t => short ? ref <= t * (1 + TP_TOL) : ref >= t * (1 - TP_TOL));
            const closed = planNums(L.closed)[0];
            if (closed != null) {
                return { symbol: s.symbol, side: s.side, gain: gainTo(closed),
                         hits: reachedBy(closed).length, closed: true };
            }
            const tagged = planNums(L.tagged)[0];
            // reference = the deepest level realised: the recorded tag, unless
            // the live price has since gone deeper still
            let ref = tagged != null
                ? (price != null ? (short ? Math.min(price, tagged) : Math.max(price, tagged)) : tagged)
                : price;
            if (ref == null) return null;
            const reached = reachedBy(ref);
            if (!reached.length) return null;                 // hasn't tagged T1 yet
            const best = short ? Math.min(...reached) : Math.max(...reached);
            return { symbol: s.symbol, side: s.side, gain: gainTo(best), hits: reached.length };
        })
        .filter(Boolean)
        .sort((a, b) => b.gain - a.gain);
}

// Renders the "booked at targets" strip at the top of the board. Hidden when
// no filled trade has reached a target yet.
function renderBooked() {
    const strip = document.getElementById('bookedStrip');
    if (!strip) return;
    const booked = bookedGains();
    if (!booked.length) { strip.hidden = true; strip.innerHTML = ''; return; }
    strip.hidden = false;
    const avg = booked.reduce((a, b) => a + b.gain, 0) / booked.length;
    const chips = booked.map(b => {
        const accent = accentBySymbol[b.symbol] || 'emerald';
        const loss = b.gain < 0;
        return `<span class="booked-chip tile-${accent}${loss ? ' booked-loss' : ''}"><span class="booked-sym">${esc(b.symbol)}</span>`
            + `<span class="booked-pct">${pct(b.gain)}</span>`
            + `${loss ? '<span class="booked-t booked-t-stop">⛔ stop</span>' : b.hits > 1 ? `<span class="booked-t">T${b.hits}</span>` : ''}</span>`;
    }).join('');
    const wins = booked.filter(b => b.gain >= 0).length;
    const losses = booked.length - wins;
    strip.innerHTML = `
        <div class="booked-head">
            <span class="booked-badge">🎯 Booked at targets</span>
            <span class="booked-summary">${wins} win${wins !== 1 ? 's' : ''}${losses ? ` · ${losses} stopped` : ''} · avg realised <strong>${pct(avg)}</strong></span>
        </div>
        <div class="booked-chips">${chips}</div>`;
}

// ── Trend meter ─────────────────────────────────────────────────────────────
// The regime cockpit (MARKET in data.js): one stacked trend bar per index in
// MARKET.markets, with the VIX/VXN fear mini-gauges beside them. Every needle
// is computed from that gauge's checks — 'bull' +1, 'bear' −1, 'neutral' 0,
// weighted — so a bar can never contradict the evidence listed under it.
// Scores run −100 (full downtrend) … +100 (full uptrend); the band the score
// lands in colours the whole row red → amber → yellow → cyan → green. Each
// index also carries a 4H fast frame (market.fast.checks), scored the same
// way but rendered as a small chip: the fast frame flips first, the main bar
// confirms.
const TREND_BANDS = [
    { max: -60, key: 'down',    label: 'Downtrend',      blurb: 'Trend is down on the operative timeframe — rallies are countertrend until proven otherwise.' },
    { max: -20, key: 'weak',    label: 'Rolling over',   blurb: 'Structure is deteriorating: sell the rip still beats buy the dip.' },
    { max: 20,  key: 'neutral', label: 'Neutral / chop', blurb: 'No trend edge either way — range rules, levels beat opinions.' },
    { max: 60,  key: 'repair',  label: 'Repairing',      blurb: 'The downtrend is being undone but the job is not finished.' },
    { max: 101, key: 'up',      label: 'Uptrend',        blurb: 'Trend is up — dips into support are the higher-probability side.' },
];

const VERDICT_W = { bull: 1, bear: -1, neutral: 0 };

function trendScore(checks) {
    const rows = (checks || []).filter(c => c && c.verdict in VERDICT_W);
    if (!rows.length) return null;
    const total = rows.reduce((a, c) => a + (c.weight || 1), 0);
    const sum = rows.reduce((a, c) => a + VERDICT_W[c.verdict] * (c.weight || 1), 0);
    return Math.round((sum / total) * 100);
}

function trendBand(score) {
    return TREND_BANDS.find(b => score < b.max) || TREND_BANDS[TREND_BANDS.length - 1];
}

function fmtScore(score) {
    return `${score > 0 ? '+' : score < 0 ? '\u2212' : ''}${Math.abs(score)}`;
}

// One stacked cockpit row: symbol + price · the big computed trend bar · the
// verdict pill and the 4H fast-frame chip.
function trendRowHtml(mkt) {
    const score = trendScore(mkt.checks);
    if (score === null) return '';
    const band = trendBand(score);
    const pos = (score + 100) / 2;
    const fastScore = mkt.fast ? trendScore(mkt.fast.checks) : null;
    const fastBand = fastScore === null ? null : trendBand(fastScore);
    return `
        <div class="tm-row tm-band-${band.key}">
            <div class="tm-row-id">
                <span class="tm-row-sym">${esc(mkt.symbol)}</span>
                <span class="tm-row-price">${esc(mkt.price || '')}</span>
            </div>
            <div class="tm-row-gauge">
                <div class="tm-track" role="img"
                     aria-label="${esc(mkt.symbol)} trend score ${score} out of \u2212100 to +100 — ${esc(band.label)}">
                    <div class="tm-needle" style="left:${pos.toFixed(1)}%"></div>
                </div>
                <div class="tm-scale"><span>Down</span><span>Neutral</span><span>Up</span></div>
            </div>
            <div class="tm-row-read">
                <span class="tm-verdict">
                    <span class="tm-verdict-label">${esc(band.label)}</span>
                    <span class="tm-verdict-score">${fmtScore(score)}</span>
                </span>
                ${fastBand ? `<span class="tm-fast tm-fast-${fastBand.key}"
                    title="4H fast frame — flips before the daily">4H · ${esc(fastBand.label)} ${fmtScore(fastScore)}</span>` : ''}
            </div>
        </div>`;
}

// VIX/VXN fear mini-gauge: needle at `value`'s position inside `range`
// [calmLo, fearHi], on a calm→fear track.
function volMiniHtml(v) {
    const val = planNums(v.value)[0];
    const [lo, hi] = Array.isArray(v.range) ? v.range : [];
    const pos = (val != null && lo != null && hi != null && hi > lo)
        ? Math.max(0, Math.min(100, ((val - lo) / (hi - lo)) * 100))
        : null;
    return `
        <div class="tm-minivol tm-${v.verdict}" title="${esc(v.read || '')}">
            <div class="tm-minivol-top">
                <span class="tm-minivol-sym">${esc(v.symbol)}</span>
                <span class="tm-minivol-val">${esc(v.value)}</span>
            </div>
            ${pos === null ? '' : `
            <div class="tm-minitrack" role="img"
                 aria-label="${esc(v.symbol)} ${esc(v.value)}, between ${lo} (calm) and ${hi} (fear)">
                <div class="tm-minineedle" style="left:${pos.toFixed(1)}%"></div>
            </div>
            <div class="tm-miniscale"><span>calm</span><span>fear</span></div>`}
            ${v.change ? `<div class="tm-minivol-chg">${esc(v.change)}</div>` : ''}
        </div>`;
}

function renderTrendMeter() {
    const el = document.getElementById('trendMeter');
    if (!el) return;
    const M = (typeof MARKET !== 'undefined') ? MARKET : null;
    const markets = (M && Array.isArray(M.markets) ? M.markets : [])
        .filter(m => trendScore(m.checks) !== null);
    if (!M || !markets.length) { el.hidden = true; el.innerHTML = ''; return; }
    el.hidden = false;

    const vols = (M.vol || []).map(volMiniHtml).join('');
    el.innerHTML = `
        <div class="tm-top">
            <span class="tm-eyebrow">Trend meter</span>
            <span class="tm-asof">as of ${esc(fmtDate(M.updated))}</span>
        </div>
        <div class="tm-cockpit">
            ${vols ? `<div class="tm-volcol" role="group" aria-label="Volatility gauges">${vols}</div>` : ''}
            <div class="tm-rows">${markets.map(trendRowHtml).join('')}</div>
        </div>
        ${M.note ? `<p class="tm-boardnote">${esc(M.note)}</p>` : ''}
    `;
}

// ── Tile rendering ─────────────────────────────────────────────────────────
// The copy-link button in a tile's footer — identical on stock and article
// tiles, so the markup lives here once. `what` names the target for a11y.
function copyBtnHtml(what) {
    return `<button class="tile-link" type="button" aria-label="Copy link to ${esc(what)}" title="Copy link">`
        + '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
        + '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>'
        + '<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></button>';
}

function tileHtml(item) {
    return item && item.type === 'article' ? articleTileHtml(item) : stockTileHtml(item);
}

function articleTileHtml(article) {
    const accent = accentOf(article);
    const tag = article.tag ? `<span class="tile-chip chip-article">${esc(article.tag)}</span>` : '';
    const excerpt = article.excerpt ? `<p class="tile-excerpt">${esc(article.excerpt)}</p>` : '';
    const meta = article.readTime
        ? `<span class="tile-date">Читати · ${esc(article.readTime)}</span>`
        : (article.date ? `<span class="tile-date">Опубліковано ${esc(fmtDate(article.date))}</span>` : '<span></span>');
    return `
        <article class="tile tile-article tile-${accent}" data-symbol="${esc(article.symbol)}"
                 tabindex="0" role="button" aria-label="Open article ${esc(article.title || article.symbol)}">
            <div class="tile-body">
                <div class="tile-top">
                    <span class="tile-kicker">${esc(article.kicker || 'Стаття')}</span>
                    ${tag}
                </div>
                <h3 class="tile-title">${esc(article.title || '')}</h3>
                ${excerpt}
                <div class="tile-foot">
                    ${meta}
                    <span class="tile-actions">
                        ${copyBtnHtml(article.title || article.symbol)}
                        <span class="tile-cta">Читати <span aria-hidden="true">›</span></span>
                    </span>
                </div>
            </div>
        </article>
    `;
}

function stockTileHtml(stock) {
    const accent = accentOf(stock);
    const side = ['long', 'short'].includes(stock.side) ? stock.side : 'long';
    const change = stock.change
        ? `<span class="tile-change">${esc(stock.change)}</span>` : '';
    const signal = stock.signal
        ? `<p class="tile-signal">${esc(stock.signal)}</p>` : '';
    // The board's one-line edge lives on the card (the table only ranks).
    // Ranked names carry it on `lead.edge`; unranked ones (barometer,
    // technical fades) can set a standalone `edge` so every tile has the line.
    const edgeText = (stock.lead && stock.lead.edge) || stock.edge;
    const edge = edgeText
        ? `<p class="tile-edge">⚡ ${esc(edgeText)}</p>` : '';
    const prog = planProgress(stock);
    const booked = !!(stock.lead && stock.lead.status === 'booked');
    // Completed (booked) trades carry no on-card progress line — the win is
    // recorded in the "Booked at targets" strip and on the deck (the ✅ marker),
    // not on the tile.
    const progress = (!prog || booked) ? ''
        : prog.filled
        ? `<p class="tile-progress"><span class="tp-live">✅ Entered as called → ${pct(prog.earned)} so far</span> · full plan ${pct(prog.target)} · ${pct(prog.left)} left to the deepest target</p>`
        : `<p class="tile-progress"><span class="tp-wait">⏳ Not triggered yet → 0%</span> · plan pays ${pct(prog.target)} from the zone · ${pct(prog.left)} left from here</p>`;

    // The whole tile is the button; the deck itself opens in the overlay
    // (openStory → hash → iframe), so nothing here loads the story.
    return `
        <article class="tile tile-${accent}" data-symbol="${esc(stock.symbol)}"
                 tabindex="0" role="button" aria-label="Open ${esc(stock.symbol)} story">
            <div class="tile-body">
                <div class="tile-top">
                    <div class="tile-id">
                        <span class="tile-symbol">${esc(stock.symbol)}</span>
                        <span class="tile-exchange">${esc(stock.exchange || '')}</span>
                    </div>
                    <span class="tile-chip chip-${side}">${SIDE_LABEL[side]}</span>
                </div>
                <div class="tile-price-row">
                    <span class="tile-price">${esc(stock.price || '')}</span>
                    ${change}
                </div>
                ${signal}
                ${edge}
                ${progress}
                <div class="tile-foot">
                    ${stock.date ? `<span class="tile-date">Опубліковано ${esc(fmtDate(stock.date))}</span>` : '<span></span>'}
                    <span class="tile-actions">
                        ${copyBtnHtml(stock.symbol + ' story')}
                        <span class="tile-cta">Дивитись розбір <span aria-hidden="true">›</span></span>
                    </span>
                </div>
            </div>
        </article>
    `;
}

// Builds the "Sharpest trades" ranking from the `lead` field on STOCK entries,
// so the table stays in sync with the cards. Hidden if nothing is ranked.
function renderLeaderboard() {
    const section = document.getElementById('leaderboard');
    const body = document.getElementById('leaderboardBody');
    if (!section || !body) return;

    // Every stock carrying a `lead` renders as a row, ranked by `lead.rank`
    // (setup quality × reward) — long or short, no fixed cap. Two-sided /
    // no-edge names simply omit `lead` and stay off the board. Completed trades
    // (lead.status 'booked') drop out of the ranked table but keep their `lead`
    // so they still surface in the "Booked at targets" strip.
    const ranked = STOCK_LIST
        .filter(s => s.lead && s.lead.status !== 'booked')
        .sort((a, b) => (a.lead.rank || 0) - (b.lead.rank || 0));

    if (!ranked.length) { section.hidden = true; return; }
    section.hidden = false;

    body.innerHTML = ranked.map((s, i) => {
        const L = s.lead;
        const side = ['long', 'short'].includes(s.side) ? s.side : 'short';
        const accent = accentBySymbol[s.symbol] || TILE_ACCENTS[i % TILE_ACCENTS.length];
        const prog = planProgress(s);
        // Move = entry-zone midpoint → deepest target, the same definition the
        // R:R uses, so the two columns describe one plan. COMPUTED from `entry`
        // and `targets` (never typed): a hand-written % drifts the moment a
        // level moves. `lead.downside` is the fallback for unparseable plans.
        // Signed by the PRICE direction, board convention: longs +, shorts −
        // (planProgress reports P&L, which is positive for a working short).
        const move = prog
            ? pct(side === 'short' ? -prog.target : prog.target)
            : esc(L.downside || '—');
        const downside = L.tail
            ? `${move}<span class="lb-tail">tail ${esc(L.tail)}</span>`
            : move;
        // The R:R asterisk means "only if price comes back to the entry zone",
        // so it is COMPUTED from where price actually is rather than hand-set:
        // a flag typed into data.js drifts the moment the price label moves.
        // `lead.rrStar` survives only as an override for unparseable zones.
        const inZone = priceInZone(s);
        const star = inZone === null ? !!L.rrStar : !inZone;
        const rr = `${esc(L.rr)}${star ? '<sup>*</sup>' : ''}`;
        const status = L.status === 'live'
            ? '<span class="lb-status lb-live">🎯 at trigger</span>'
            : L.status === 'wait'
                ? '<span class="lb-status lb-wait">⏳ wait for level</span>'
                : L.status === 'booked'
                    ? '<span class="lb-status lb-booked">✅ target reached</span>'
                    : '';
        const progress = !prog ? '—' : L.status === 'booked'
            ? `<span class="lb-earned">${pct(prog.earned)}</span><span class="lb-left">booked</span>`
            : prog.filled
            ? `<span class="lb-earned">${pct(prog.earned)}</span><span class="lb-left">${pct(prog.left)} left</span>`
            // Unfilled: nothing earned yet (the footnote says so), and the
            // plan's full pay-off is already the Move column — don't print it
            // twice, just how far there is left to go from here.
            : `<span class="lb-planpct">0%</span><span class="lb-left">${pct(prog.left)} left</span>`;
        return `
            <tr class="lb-row${i === 0 ? ' lb-top' : ''}" data-symbol="${esc(s.symbol)}"
                tabindex="0" role="button" aria-label="Open ${esc(s.symbol)} story">
                <td class="lb-rank">${i + 1}</td>
                <td><span class="lb-tkr tile-${accent}"><span class="lb-sym">${esc(s.symbol)}</span><span class="tile-chip chip-${side} lb-chip">${SIDE_LABEL[side]}</span></span></td>
                <td>${status}</td>
                <td>${esc(L.entry)}</td>
                <td>${esc(L.stop)}</td>
                <td>${esc(L.targets)}</td>
                <td class="lb-dn${side === 'long' ? ' lb-up' : ''}">${downside}</td>
                <td class="lb-rr">${rr}</td>
                <td class="lb-prog">${progress}</td>
            </tr>`;
    }).join('');

    // Each row opens its deck (routes through the hash, like the tiles).
    body.querySelectorAll('tr[data-symbol]').forEach(el => {
        const symbol = el.dataset.symbol;
        el.addEventListener('click', () => openStory(symbol));
        el.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openStory(symbol); }
        });
    });
}

// ── Structure board (plain table view) ──────────────────────────────────────
// Renders BOARD from board.js — a SEPARATE element from the STOCKS cards. The
// same ticker can sit in both and read differently: a card carries a traded
// plan, this board carries structure. Neither is derived from the other, so
// nothing here touches data.js.
//
// Rows whose ticker also has a card stay clickable (they open that deck); rows
// with no card — the board is allowed to cover names the gallery doesn't — are
// plain text.
const BOARD_DATA = (typeof BOARD !== 'undefined') ? BOARD : null;

// board.js marks emphasis as **markdown bold**. Escape as text FIRST, then turn
// the markers into <b> — so a row can never inject markup, only bold words.
function md(text) {
    return esc(text == null ? '' : text).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
}

const STRUCT_MARK = { bullish: '▲', bearish: '▼', neutral: '=' };

// Which way a row leans — its own verdict, read from the preferred direction
// where there is one, else the computed score, else the bias prose.
//
// ONE definition, used twice: it tints the identity cell green/pink, and
// tools/structure.py ports it verbatim as the board's primary sort key. The
// board is emitted best-longs-first, so if these two ever disagree a green row
// appears inside the short block. The CI order guard re-derives the emitted
// order from THIS function and fails on a mismatch, so the port cannot drift
// away unnoticed.
function boardLean(row) {
    const t = `${row.preferred || ''} ${row.bias || ''}`.toLowerCase();
    if (row.preferred) {
        if (/short/.test(t) && !/long preferred/.test(t)) return 'short';
        if (/long/.test(t)) return 'long';
    }
    if (typeof row.score === 'number' && row.score) return row.score > 0 ? 'long' : 'short';
    if (/bear/.test(t)) return 'short';
    if (/bull/.test(t)) return 'long';
    return 'flat';
}

// The band that introduces each direction block. The rows arrive already
// grouped (file order is the order), so this only has to notice the boundary —
// it never reorders anything, and a board that somehow arrives ungrouped gets
// repeated headers rather than a silently wrong one.
const LEAN_BAND = {
    long: 'Long setups — strongest first',
    flat: 'No clear edge',
    short: 'Short setups — strongest last',
};

// Monthly first — the overall view — then the working frames and the timing
// frame. M is context only and never enters the score, so it is dimmed to say
// so rather than sitting flush with the terms that do count.
function structCell(s, prose) {
    if (!s) return '—';
    // The enum drives the arrow; the prose, where a row has it, is what was
    // actually read — "bearish range/bounce" says more than "bearish".
    const one = (label, k) => {
        const v = s[k];
        const words = (prose && prose[k]) || v;
        return words
            ? `${label} ${STRUCT_MARK[v] || '·'} ${esc(words)}`
            : `${label} —`;
    };
    return [`<span class="bt-context">${one('M', 'm')}</span>`,
            one('W', 'w'), one('D', 'd'), one('4H', 'h4')].join('<br>');
}

// A zone list → "$107.27–108.70 weak · repeatedly tested". Generated rows carry
// touch counts; seeded ones carry the original note.
function zoneCell(list) {
    if (!list || !list.length) return '—';
    return list.map(z => {
        const range = z.lo === z.hi
            ? `$${fmtNum(z.lo)}`
            : `$${fmtNum(z.lo)}–${fmtNum(z.hi)}`;
        // Volume evidence, where the extractor computed it: how many revisits
        // arrived on high volume, and whether the zone's own displacement leg
        // traded heavily. Seeded rows carry a prose note instead.
        let detail = '';
        if (z.note != null) {
            detail = z.note;
        } else if (z.touches != null) {
            const bits = [`${z.touches} touch${z.touches === 1 ? '' : 'es'}`];
            if (z.heavyTouches) bits.push(`${z.heavyTouches} on heavy vol`);
            if (z.origin) bits.push(`${z.origin} origin`);
            detail = bits.join(', ');
        }
        return `<b>${range}</b> ${esc(z.strength || '')}${detail ? ` · ${esc(detail)}` : ''}`;
    }).join('<br>');
}

// Trailing zeros stripped — right for a ZONE, where "$60–65" beats
// "$60.00–65.00" and the bounds are approximate anyway.
function fmtNum(n) {
    if (typeof n !== 'number') return esc(n);
    return n >= 1000 ? n.toLocaleString('en-US', { maximumFractionDigits: 2 })
        : String(Number(n.toFixed(2)));
}

// ALWAYS two decimals — for the ticker cell's price and ATR pair, which are
// exact figures stacked in a mono column you read straight down. fmtNum's
// stripping made that column ragged ("$356.6" over "$1,147.63", "11%" under
// "3.17%"), and on MU it disagreed with the row's own prose, which writes the
// same number as "11.00% of price".
function fmtFixed(n) {
    if (typeof n !== 'number') return esc(n);
    return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Order-flow metrics from tools/flow.py, each shown against the ticker's own
// baseline — these are only meaningful as a deviation from its normal. Absent
// on every row until the paid feed is configured, so it renders nothing at all
// rather than a dash line in every row.
//
// (There was a scoreCell() here too, from when score had its own column. The
// identity cell has inlined the score since the eight-column compaction and
// nothing called it — deleted rather than left to rot.)
function flowCell(row) {
    const f = row.flow;
    if (!f) return '';
    const base = f.baseline || {};
    const delta = (now, was) => {
        if (was == null || now == null) return '';
        const d = now - was;
        return ` <span class="bt-parts">(${d >= 0 ? '+' : ''}${d.toFixed(1)} vs ${was})</span>`;
    };
    const line = (label, v, unit, was) => v == null
        ? `${label} —`
        : `${label} <b>${v > 0 && label === 'imb' ? '+' : ''}${v}${unit}</b>${delta(v, was)}`;
    const body = [
        line('imb', f.imbalance, '%', base.imbalance),
        line('block', f.blockShare, '%', base.blockShare),
        line('odd', f.oddLotShare, '%', base.oddLotShare),
        line('off-exch', f.offExchShare, '%', base.offExchShare),
    ].join('<br>');
    return `<div class="bt-frames bt-flow">${body}</div>`;
}

function boardRowHtml(row) {
    // ── THE 4H CELL — ONE PARAGRAPH, THEN THE FOUR FRAMES ──────────────────
    // Same discipline as the ticker cell: no optional branches, so every cell
    // down the column has the same shape. `h4Effect` used to render here as a
    // SECOND paragraph, which made the seven rows carrying one visibly taller
    // than the rest — it is exported in the TSV instead, the way score/parts
    // are. Keep `h4` to roughly two lines and each trendProse phrase under ~28
    // characters so the four frames stay one line each; that is what makes the
    // column scannable. See CLAUDE.md, "Structure board".
    const h4 = row.h4
        ? md(row.h4)
        : `<span class="bt-unscored">${esc((row.structure && row.structure.h4Note) || '—')}</span>`;
    const px = row.price != null ? `$${fmtFixed(row.price)}` : '—';
    const atr = row.atr != null
        ? `$${fmtFixed(row.atr)}${row.atrPct != null ? ` / ${fmtFixed(row.atrPct)}%` : ''}`
        : '—';
    // data-ticker only, for the search. Rows deliberately carry NO link to a
    // card: this board is a separate element from the gallery, the two are
    // allowed to disagree, and a row that opens a deck invites reading the
    // deck's plan as this board's conclusion.
    // Which way the row leans, for the identity cell's tint — the same
    // green/pink language the tiles use for a side, and the same call that
    // orders the board.
    const lean = boardLean(row);

    // ── THE TICKER CELL — FOUR LINES, FIXED ────────────────────────────────
    // Ticker + bold price · ATR(14) · preferred direction · bias. That is the
    // whole cell, on every row, with nothing conditional in it: a column you
    // read down should have the same shape in every cell, and anything that
    // appears on some rows only makes it ragged.
    //
    // So this template has NO optional branches, and adding one is the thing
    // not to do here. Two used to be here and are deliberately gone: a
    // `· score ±N` suffix on the ATR line and a W/D/H/R/M/O/Z parts line, both
    // of which render on generated rows only — meaning the cell would silently
    // grow two extra lines the first time the bot ran. If the score needs to
    // be visible again it gets its own column, not a fifth line here.
    //
    // All four fields are required on every row. The board guard fails a row
    // missing one rather than letting the cell render short.
    // Documented in CLAUDE.md ("Structure board") and in board.js.
    const identity = `
        <div class="bt-id">
            <div class="bt-id-top"><b class="bt-id-sym">${esc(row.ticker)}</b>
                <b class="bt-id-px">${px}</b></div>
            <div class="bt-id-atr">ATR(14) ${esc(atr)}</div>
            <div class="bt-pref">${md(row.preferred)}</div>
            <div class="bt-id-bias">${md(row.bias)}</div>
        </div>`;

    return `
        <tr data-ticker="${esc(row.ticker)}">
            <td class="bt-cell-id bt-lean-${lean}">${identity}</td>
            <td>${h4}
                <div class="bt-frames">${structCell(row.structure, row.trendProse)}</div>
                ${flowCell(row)}</td>
            <td>${zoneCell(row.demand)}</td>
            <td>${zoneCell(row.supply)}</td>
            <td>${md(row.bull)}${row.longSetup
                ? `<br><span class="bt-long">Setup — ${md(row.longSetup)}</span>` : ''}${row.longCandidate
                ? `<br><span class="bt-long">Candidate — ${md(row.longCandidate)}</span>` : ''}</td>
            <td>${md(row.bear)}${row.shortSetup
                ? `<br><span class="bt-long">Setup — ${md(row.shortSetup)}</span>` : ''}</td>
            <td>${md(row.position)}${row.retest
                ? `<br><span class="bt-long">Likely retest — ${md(row.retest)}</span>` : ''}</td>
        </tr>`;
}

// Copies the board as TSV so it can be pasted straight into Google Sheets.
// Uses the shared builder in tsv.js — the same one the bot writes board.tsv
// with — so the clipboard and the artifact can never disagree on columns.
function initBoardCopy() {
    const btn = document.getElementById('boardCopyBtn');
    if (!btn || typeof boardTsv !== 'function') return;
    const label = document.getElementById('boardCopyLabel');
    const say = msg => {
        if (!label) return;
        label.textContent = msg;
        setTimeout(() => { label.textContent = 'Copy for Sheets'; }, 1800);
    };
    btn.addEventListener('click', async () => {
        const tsv = boardTsv(BOARD_DATA);
        if (!tsv) { say('nothing to copy'); return; }
        try {
            await navigator.clipboard.writeText(tsv);
            say(`copied ${BOARD_DATA.rows.length} rows`);
        } catch (e) {
            // clipboard API needs a secure context and permission; the
            // textarea route works from file:// and older browsers too.
            const ta = document.createElement('textarea');
            ta.value = tsv;
            ta.setAttribute('readonly', '');
            ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
            document.body.appendChild(ta);
            ta.select();
            const ok = document.execCommand('copy');
            ta.remove();
            say(ok ? `copied ${BOARD_DATA.rows.length} rows` : 'copy failed');
        }
    });
}

function renderBoardTable() {
    const body = document.getElementById('boardTableBody');
    const section = document.getElementById('boardTable');
    if (!body || !section) return;
    if (!BOARD_DATA || !Array.isArray(BOARD_DATA.rows) || !BOARD_DATA.rows.length) {
        body.innerHTML = '';
        const empty = document.getElementById('boardTableEmpty');
        if (empty) empty.hidden = false;
        return;
    }
    // A band ahead of each direction block, so the ordering explains itself: a
    // silently re-sorted table just looks shuffled. Rendered from the rows as
    // they arrive — the order is the file's, not this function's.
    let band = null;
    body.innerHTML = BOARD_DATA.rows.map(row => {
        const lean = boardLean(row);
        // scope="rowgroup", not aria-hidden: the band is the only thing that
        // says which block a row is in, and a screen-reader user cannot see
        // the green/pink tint that says it visually.
        const head = lean === band ? '' : `
            <tr class="bt-band bt-band-${lean}">
                <th colspan="7" scope="rowgroup">${esc(LEAN_BAND[lean] || '')}</th>
            </tr>`;
        band = lean;
        return head + boardRowHtml(row);
    }).join('');

    const method = document.getElementById('boardTableMethod');
    if (method) method.innerHTML = md(BOARD_DATA.method || '');

    const dir = document.getElementById('boardTableDirection');
    if (dir) {
        const D = BOARD_DATA.direction;
        const groups = (D && D.groups) || [];
        dir.innerHTML = groups.length
            ? '<h3 class="bt-rank-title">Direction ranking</h3>'
              + '<div class="bt-dir-groups">' + groups.map(g =>
                  `<div class="bt-dir-group bt-dir-${esc(g.side)}">`
                  + `<div class="bt-dir-label">${esc(g.label)}</div>`
                  + `<div class="bt-dir-tickers">${(g.tickers || []).map(esc).join(' · ')}</div>`
                  + (g.note ? `<div class="bt-dir-note">${md(g.note)}</div>` : '')
                  + '</div>').join('') + '</div>'
              + (D.note ? `<p class="bt-rank-note">${md(D.note)}</p>` : '')
            : '';
    }

    const rank = document.getElementById('boardTableRanking');
    if (rank) {
        const items = (BOARD_DATA.ranking || []).map(r => `<li>${md(r)}</li>`).join('');
        rank.innerHTML = items
            ? `<h3 class="bt-rank-title">Most actionable</h3><ol class="bt-rank-list">${items}</ol>`
              + (BOARD_DATA.rankingNote ? `<p class="bt-rank-note">${md(BOARD_DATA.rankingNote)}</p>` : '')
            : '';
    }

}

function renderGallery() {
    const container = document.getElementById('gallery');
    const empty = document.getElementById('galleryEmpty');
    if (!container) return;

    if (!ITEMS.length) {
        container.innerHTML = '';
        if (empty) empty.hidden = false;
        return;
    }
    if (empty) empty.hidden = true;

    // Newest presentations first.
    const ordered = [...ITEMS].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    // Spread the accent palette across stock tiles so neighbours never share a
    // colour — keeps the grid varied no matter what `accent` each entry sets.
    let ai = 0;
    container.innerHTML = ordered.map(item => {
        if (item.type === 'article') return tileHtml(item);
        const accent = TILE_ACCENTS[ai++ % TILE_ACCENTS.length];
        accentBySymbol[item.symbol] = accent;
        return tileHtml({ ...item, accent });
    }).join('');
    container.querySelectorAll('.tile').forEach(el => {
        const symbol = el.dataset.symbol;
        el.addEventListener('click', () => openStory(symbol));
        el.addEventListener('keydown', e => {
            if (e.target.closest('.tile-link')) return;   // let the copy button handle its own keys
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openStory(symbol); }
        });
        const linkBtn = el.querySelector('.tile-link');
        if (linkBtn) {
            linkBtn.addEventListener('click', e => {
                e.stopPropagation();                       // don't open the story
                copyDeckLink(slugify(symbol));
            });
        }
    });
}

// ── What's new ───────────────────────────────────────────────────────────────
// Deliberately NOT every card touched by a refresh — a full board refresh
// bumps most tiles' `date` in one pass, so that would just be a mirror of the
// whole gallery. This reads `alert: true`, a hand-set flag on the STOCKS/
// ARTICLES entry (same discipline as `lead.status`: judgement, not derived)
// for news that actually changes the read on a name — a status flip, a stop
// threatened, an earnings reaction, a thesis needing re-justification —
// not a routine price/date bump. Set it deliberately per refresh; unset (or
// omit) it once the news is old, the same way a tile's own text moves on.
const WHATSNEW_MAX_DATES = 8;

function whatsNewRowHtml(item) {
    const isArticle = item.type === 'article';
    const label = esc(isArticle ? item.title : item.symbol);
    const summary = esc(isArticle ? (item.excerpt || '') : (item.change || ''));
    const sideChip = (!isArticle && item.side)
        ? `<span class="tile-chip chip-${item.side}">${esc(SIDE_LABEL[item.side] || item.side)}</span>` : '';
    return `
        <button type="button" class="whatsnew-row" data-symbol="${esc(item.symbol)}">
            <span class="whatsnew-row-head">
                <span class="whatsnew-symbol">${label}</span>
                ${sideChip}
            </span>
            <span class="whatsnew-summary">${summary}</span>
        </button>`;
}

function renderWhatsNew() {
    const body = document.getElementById('whatsNewBody');
    if (!body) return;
    const flagged = ITEMS.filter(i => i.alert && i.date);
    if (!flagged.length) {
        body.innerHTML = '<p class="whatsnew-empty">Nothing flagged right now — routine price refreshes don’t show up here.</p>';
        return;
    }
    const dates = [...new Set(flagged.map(i => i.date))]
        .sort((a, b) => b.localeCompare(a))
        .slice(0, WHATSNEW_MAX_DATES);
    body.innerHTML = dates.map(date => {
        const rows = flagged
            .filter(i => i.date === date)
            .sort((a, b) => (a.symbol || '').localeCompare(b.symbol || ''))
            .map(whatsNewRowHtml)
            .join('');
        return `
            <section class="whatsnew-day">
                <h3 class="whatsnew-date">${esc(fmtDate(date))}</h3>
                <div class="whatsnew-rows">${rows}</div>
            </section>`;
    }).join('');
    body.querySelectorAll('.whatsnew-row').forEach(el => {
        el.addEventListener('click', () => {
            closeWhatsNew();
            openStory(el.dataset.symbol);
        });
    });
}

function isWhatsNewOpen() {
    const overlay = document.getElementById('whatsNewOverlay');
    return !!overlay && !overlay.hidden;
}

function openWhatsNew() {
    const overlay = document.getElementById('whatsNewOverlay');
    if (!overlay) return;
    renderWhatsNew();
    overlay.hidden = false;
    document.body.classList.add('whatsnew-open');
    const close = document.getElementById('whatsNewClose');
    if (close) close.focus();
}

function closeWhatsNew() {
    const overlay = document.getElementById('whatsNewOverlay');
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    document.body.classList.remove('whatsnew-open');
}

function initWhatsNew() {
    const btn = document.getElementById('whatsNewBtn');
    const overlay = document.getElementById('whatsNewOverlay');
    const close = document.getElementById('whatsNewClose');
    if (btn) btn.addEventListener('click', openWhatsNew);
    if (close) close.addEventListener('click', closeWhatsNew);
    if (overlay) overlay.addEventListener('click', e => { if (e.target === overlay) closeWhatsNew(); });
}

// ── Story overlay (deep-linkable) ───────────────────────────────────────────
// Each deck has a stable URL: index.html#<symbol> (e.g. #sndk). Opening a tile
// writes that hash; loading a hashed URL opens the matching deck; back/forward
// and the copy-link buttons all flow through the hash so links are shareable.
let lastFocused = null;
let currentSlug = null;

function slugify(sym) { return String(sym == null ? '' : sym).trim().toLowerCase(); }
function hashSlug() { return slugify(decodeURIComponent((location.hash || '').replace(/^#/, ''))); }
function findStock(slug) { return ITEMS.find(s => slugify(s.symbol) === slug); }
function deckUrl(slug) { return location.origin + location.pathname + location.search + '#' + slug; }

// ── Copy-to-clipboard + toast ────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg) {
    let t = document.getElementById('toast');
    if (!t) {
        t = document.createElement('div');
        t.id = 'toast';
        t.className = 'toast';
        t.setAttribute('role', 'status');
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.remove('show');
    void t.offsetWidth;               // restart the transition on repeat copies
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 1600);
}

async function copyDeckLink(slug) {
    if (!slug || !findStock(slug)) return;
    const url = deckUrl(slug);
    let ok = false;
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(url);
            ok = true;
        }
    } catch (e) { ok = false; }
    if (!ok) {                        // fallback for non-secure contexts (e.g. file://)
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.setAttribute('readonly', '');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        ta.remove();
    }
    showToast(ok ? 'Link copied' : url);
}

// ── Open / close (DOM), reconciled against the URL hash ──────────────────────
function openDeckDom(slug) {
    const stock = findStock(slug);
    const overlay = document.getElementById('storyOverlay');
    const frame = document.getElementById('storyFrame');
    const link = document.getElementById('storyLink');
    if (!stock || !overlay || !frame) return;

    if (currentSlug !== slug) lastFocused = document.activeElement;
    frame.src = stock.story;
    overlay.hidden = false;
    document.body.classList.add('story-open');
    currentSlug = slug;
    if (link) link.hidden = false;
    const close = document.getElementById('storyClose');
    if (close) close.focus();
}

function closeDeckDom() {
    const overlay = document.getElementById('storyOverlay');
    const frame = document.getElementById('storyFrame');
    const link = document.getElementById('storyLink');
    currentSlug = null;
    if (link) link.hidden = true;
    if (!overlay || overlay.hidden) return;
    overlay.hidden = true;
    document.body.classList.remove('story-open');
    if (frame) frame.src = 'about:blank';   // stop + reset the story
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
}

// Make the overlay match the URL hash.
function reconcileStory() {
    const slug = hashSlug();
    if (slug && findStock(slug)) {
        if (slug !== currentSlug) openDeckDom(slug);
    } else if (currentSlug) {
        closeDeckDom();
    }
}

// Open by symbol (from a tile) — routes through the hash so the URL is shareable.
function openStory(symbol) {
    const slug = slugify(symbol);
    if (!findStock(slug)) return;
    if (hashSlug() === slug) reconcileStory();   // hash unchanged → open directly
    else location.hash = slug;                    // hashchange → reconcile → open
}

function closeStory() {
    if (location.hash) location.hash = '';        // hashchange → reconcile → close
    else closeDeckDom();
}

// ── PWA install ────────────────────────────────────────────────────────────
function initInstallButton() {
    let deferred = null;
    const btn = document.getElementById('installBtn');
    // Every display mode except 'browser' means the app is running installed.
    // Testing only 'standalone' missed minimal-ui / fullscreen / WCO installs,
    // which would let a stray beforeinstallprompt re-show the button inside an
    // already-installed app. Unsupported features simply report no match.
    const INSTALLED_MODES = ['standalone', 'minimal-ui', 'fullscreen', 'window-controls-overlay'];
    const isInstalled = () =>
        INSTALLED_MODES.some(m => window.matchMedia(`(display-mode: ${m})`).matches) ||
        window.navigator.standalone === true;   // iOS Safari, which has no display-mode

    window.addEventListener('beforeinstallprompt', e => {
        e.preventDefault();
        deferred = e;
        if (btn && !isInstalled()) btn.hidden = false;
    });
    if (btn) {
        btn.addEventListener('click', async () => {
            if (!deferred) return;
            deferred.prompt();
            await deferred.userChoice;
            deferred = null;
            btn.hidden = true;
        });
    }
    window.addEventListener('appinstalled', () => {
        deferred = null;
        if (btn) btn.hidden = true;
    });
}

// ── Theme toggle ───────────────────────────────────────────────────────────
// The theme itself is applied before first paint by the inline script in
// index.html; this only wires the button and persists the choice. An explicit
// pick wins over the OS preference from then on, and the browser chrome colour
// is kept in step so the PWA's status bar matches the page.
const THEME_KEY = 'ib-theme';
const THEME_COLOR = { dark: '#070410', light: '#FAF9F7' };

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', THEME_COLOR[theme] || THEME_COLOR.dark);
    const btn = document.getElementById('themeBtn');
    if (btn) {
        btn.setAttribute('aria-pressed', String(theme === 'light'));
        btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    }
}

function initThemeToggle() {
    const btn = document.getElementById('themeBtn');
    applyTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    if (btn) {
        btn.addEventListener('click', () => {
            const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            applyTheme(next);
            try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* private mode */ }
        });
    }
    // Follow the OS only while the user has not made an explicit choice.
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = e => {
        let stored = null;
        try { stored = localStorage.getItem(THEME_KEY); } catch (err) { /* private mode */ }
        if (!stored) applyTheme(e.matches ? 'light' : 'dark');
    };
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else if (mq.addListener) mq.addListener(onChange);
}

// ── View toggle (cards ⇄ plain table) ───────────────────────────────────────
// Same shape as the theme toggle: the attribute is set pre-paint by the inline
// script in index.html, CSS does the swap, and this only wires the button and
// persists the choice. Nothing is re-rendered — both views are always in the
// DOM, so switching keeps the search filter and the scroll position.
const VIEW_KEY = 'ib-view';

function applyView(view) {
    document.documentElement.setAttribute('data-view', view);
    const btn = document.getElementById('tableBtn');
    if (btn) {
        const table = view === 'table';
        btn.setAttribute('aria-pressed', String(table));
        btn.setAttribute('aria-label', table ? 'Switch to card view' : 'Switch to plain table view');
        btn.setAttribute('title', table ? 'Card view' : 'Table view');
    }
}

function initViewToggle() {
    applyView(document.documentElement.getAttribute('data-view') === 'table' ? 'table' : 'cards');
    const btn = document.getElementById('tableBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-view') === 'table' ? 'cards' : 'table';
        applyView(next);
        try { localStorage.setItem(VIEW_KEY, next); } catch (e) { /* private mode */ }
    });
}

// ── Stock search ─────────────────────────────────────────────────────────────
// Filters the tile grid in-place by ticker (or article title) — no re-render,
// just hides tiles that don't match. Lives beside the leaderboard title.
function initStockSearch() {
    const input = document.getElementById('stockSearchInput');
    const clearBtn = document.getElementById('stockSearchClear');
    const gallery = document.getElementById('gallery');
    const searchEmpty = document.getElementById('gallerySearchEmpty');
    if (!input || !gallery) return;

    function applyFilter() {
        const q = input.value.trim().toLowerCase();
        if (clearBtn) clearBtn.hidden = !q;
        let visible = 0;
        gallery.querySelectorAll('.tile').forEach(tile => {
            const symbol = (tile.dataset.symbol || '').toLowerCase();
            const titleEl = tile.querySelector('.tile-title');
            const title = titleEl ? titleEl.textContent.toLowerCase() : '';
            const match = !q || symbol.includes(q) || title.includes(q);
            tile.hidden = !match;
            if (match) visible++;
        });
        if (searchEmpty) searchEmpty.hidden = !(q && visible === 0);

        // Keep the ranking table and the structure board in step — the search
        // box sits in the ranking header, so an unfiltered table beside a
        // filtered gallery reads as a broken filter. The board is matched on
        // data-ticker, not data-symbol: board-only names (AKAM, TE, …) carry no
        // symbol, and filtering on that left them permanently visible.
        document.querySelectorAll('#leaderboardBody tr[data-symbol], #boardTableBody tr[data-ticker]').forEach(row => {
            const key = (row.dataset.ticker || row.dataset.symbol || '').toLowerCase();
            row.hidden = !(!q || key.includes(q));
        });

        // A direction band labels the rows beneath it, so it has to disappear
        // with them: filtering to one long left "Short setups — strongest last"
        // sitting over an empty block. The band owns every row down to the next
        // band, and hides when none of them survived the filter.
        const boardBody = document.getElementById('boardTableBody');
        if (boardBody) {
            let band = null, kept = 0;
            const settle = () => { if (band) band.hidden = !kept; };
            for (const row of boardBody.children) {
                if (row.classList.contains('bt-band')) {
                    settle();
                    band = row;
                    kept = 0;
                } else if (!row.hidden) {
                    kept++;
                }
            }
            settle();
        }
    }

    input.addEventListener('input', applyFilter);
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            input.value = '';
            applyFilter();
            input.focus();
        });
    }
}

// ── Wiring ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initViewToggle();      // cards ⇄ plain table (attribute already set pre-paint)
    initInstallButton();
    initWhatsNew();         // recent-updates popup, derived from each item's own `date`
    renderTrendMeter();    // index regime read (needle computed from MARKET.checks)
    renderGallery();       // assigns tile accents (fills accentBySymbol)
    renderLeaderboard();   // reuses those accents for matching row colours
    renderBooked();        // "booked at targets" strip (reuses accents too)
    renderBoardTable();
    initBoardCopy();    // the plain-table view of the same board
    initStockSearch();     // filters the tile grid by ticker

    const overlay = document.getElementById('storyOverlay');
    const close = document.getElementById('storyClose');
    const link = document.getElementById('storyLink');
    if (close) close.addEventListener('click', closeStory);
    if (link) link.addEventListener('click', () => copyDeckLink(currentSlug));
    if (overlay) {
        // Click on the backdrop (not the iframe) closes.
        overlay.addEventListener('click', e => { if (e.target === overlay) closeStory(); });
    }
    document.addEventListener('keydown', e => {
        if (e.key !== 'Escape') return;
        if (isWhatsNewOpen()) closeWhatsNew();
        else closeStory();
    });

    // A deck (running in the iframe) can ask to close itself — e.g. swiping past
    // the last slide on mobile.
    window.addEventListener('message', e => {
        const frame = document.getElementById('storyFrame');
        if (frame && e.source === frame.contentWindow &&
            e.data && e.data.type === 'ib-close') {
            closeStory();
        }
    });

    // Deep linking: keep the overlay in sync with the URL hash, and honor a
    // hash present on first load (e.g. someone opened a shared deck link).
    window.addEventListener('hashchange', reconcileStory);
    reconcileStory();
});
