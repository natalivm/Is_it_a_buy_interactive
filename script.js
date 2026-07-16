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

// ── Tile rendering ─────────────────────────────────────────────────────────
function tileHtml(item) {
    return item && item.type === 'article' ? articleTileHtml(item) : stockTileHtml(item);
}

function articleTileHtml(article) {
    const accent = ['violet', 'blue', 'amber', 'emerald', 'red', 'cyan', 'indigo'].includes(article.accent) ? article.accent : 'violet';
    const tag = article.tag ? `<span class="tile-chip chip-article">${esc(article.tag)}</span>` : '';
    const excerpt = article.excerpt ? `<p class="tile-excerpt">${esc(article.excerpt)}</p>` : '';
    const meta = article.readTime
        ? `<span class="tile-date">Читати · ${esc(article.readTime)}</span>`
        : (article.date ? `<span class="tile-date">Опубліковано ${esc(fmtDate(article.date))}</span>` : '<span></span>');
    return `
        <article class="tile tile-article tile-${accent}" data-story="${esc(article.story)}" data-symbol="${esc(article.symbol)}"
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
                        <button class="tile-link" type="button" aria-label="Copy link to ${esc(article.title || article.symbol)}" title="Copy link">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                        </button>
                        <span class="tile-cta">Читати <span aria-hidden="true">›</span></span>
                    </span>
                </div>
            </div>
        </article>
    `;
}

function stockTileHtml(stock) {
    const accent = ['violet', 'blue', 'amber', 'emerald', 'red', 'cyan', 'indigo'].includes(stock.accent) ? stock.accent : 'violet';
    const side = ['long', 'short'].includes(stock.side) ? stock.side : 'long';
    const change = stock.change
        ? `<span class="tile-change">${esc(stock.change)}</span>` : '';
    const signal = stock.signal
        ? `<p class="tile-signal">${esc(stock.signal)}</p>` : '';
    const prog = planProgress(stock);
    const progress = !prog ? '' : prog.filled
        ? `<p class="tile-progress"><span class="tp-live">✅ Entered as called → ${pct(prog.earned)} so far</span> · full plan ${pct(prog.target)} · ${pct(prog.left)} left to the deepest target</p>`
        : `<p class="tile-progress"><span class="tp-wait">⏳ Not triggered yet → 0%</span> · plan pays ${pct(prog.target)} from the zone · ${pct(prog.left)} left from here</p>`;

    // Live preview of the story's first (cover) slide. The iframe is
    // non-interactive (pointer-events off, not focusable) — the whole tile is
    // the button. loading="lazy" keeps off-screen previews cheap.
    return `
        <article class="tile tile-${accent}" data-story="${esc(stock.story)}" data-symbol="${esc(stock.symbol)}"
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
                ${progress}
                <div class="tile-foot">
                    ${stock.date ? `<span class="tile-date">Опубліковано ${esc(fmtDate(stock.date))}</span>` : '<span></span>'}
                    <span class="tile-actions">
                        <button class="tile-link" type="button" aria-label="Copy link to ${esc(stock.symbol)} story" title="Copy link">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                        </button>
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
    // no-edge names simply omit `lead` and stay off the board.
    const ranked = STOCK_LIST
        .filter(s => s.lead)
        .sort((a, b) => (a.lead.rank || 0) - (b.lead.rank || 0));

    if (!ranked.length) { section.hidden = true; return; }
    section.hidden = false;

    body.innerHTML = ranked.map((s, i) => {
        const L = s.lead;
        const side = ['long', 'short'].includes(s.side) ? s.side : 'short';
        const accent = accentBySymbol[s.symbol] || TILE_ACCENTS[i % TILE_ACCENTS.length];
        const downside = L.tail
            ? `${esc(L.downside)}<span class="lb-tail">tail ${esc(L.tail)}</span>`
            : esc(L.downside);
        const rr = `${esc(L.rr)}${L.rrStar ? '<sup>*</sup>' : ''}`;
        const status = L.status === 'live'
            ? '<span class="lb-status lb-live">🎯 at trigger</span>'
            : L.status === 'wait'
                ? '<span class="lb-status lb-wait">⏳ wait for level</span>'
                : '';
        const prog = planProgress(s);
        const progress = !prog ? '—' : prog.filled
            ? `<span class="lb-earned">${pct(prog.earned)}</span><span class="lb-left">${pct(prog.left)} left</span>`
            : `<span class="lb-planpct">${pct(prog.target)} plan</span><span class="lb-left">${pct(prog.left)} left</span>`;
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
                <td class="lb-edge">${esc(L.edge)}</td>
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
    const isInstalled = () =>
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;

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

// ── Wiring ─────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initInstallButton();
    renderGallery();       // assigns tile accents (fills accentBySymbol)
    renderLeaderboard();   // reuses those accents for matching row colours

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
        if (e.key === 'Escape') closeStory();
    });

    // Deep linking: keep the overlay in sync with the URL hash, and honor a
    // hash present on first load (e.g. someone opened a shared deck link).
    window.addEventListener('hashchange', reconcileStory);
    reconcileStory();
});
