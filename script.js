'use strict';

// ──────────────────────────────────────────────────────────────────────────
// Is It a BUY interactive — stock story gallery
//
// Renders one tile per entry in STOCKS (data.js). Clicking a tile opens that
// stock's interactive story (a self-contained slideshow in /stories) inside a
// full-screen overlay.
// ──────────────────────────────────────────────────────────────────────────

const STOCK_LIST = (typeof STOCKS !== 'undefined') ? STOCKS : [];

const VERDICT_LABEL = { buy: 'Buy', caution: 'Caution', avoid: 'Avoid' };

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

// ── Tile rendering ─────────────────────────────────────────────────────────
function tileHtml(stock) {
    const accent = ['violet', 'blue', 'amber', 'emerald'].includes(stock.accent) ? stock.accent : 'violet';
    const verdict = ['buy', 'caution', 'avoid'].includes(stock.verdict) ? stock.verdict : 'caution';
    const change = stock.change
        ? `<span class="tile-change">${esc(stock.change)}</span>` : '';
    const signal = stock.signal
        ? `<p class="tile-signal">${esc(stock.signal)}</p>` : '';

    // Live preview of the story's first (cover) slide. The iframe is
    // non-interactive (pointer-events off, not focusable) — the whole tile is
    // the button. loading="lazy" keeps off-screen previews cheap.
    return `
        <article class="tile tile-${accent}" data-story="${esc(stock.story)}"
                 tabindex="0" role="button" aria-label="Open ${esc(stock.symbol)} story">
            <div class="tile-body">
                <div class="tile-top">
                    <div class="tile-id">
                        <span class="tile-symbol">${esc(stock.symbol)}</span>
                        <span class="tile-exchange">${esc(stock.exchange || '')}</span>
                    </div>
                    <span class="tile-chip chip-${verdict}">${VERDICT_LABEL[verdict]}</span>
                </div>
                <div class="tile-price-row">
                    <span class="tile-price">${esc(stock.price || '')}</span>
                    ${change}
                </div>
                ${signal}
                <div class="tile-foot">
                    ${stock.date ? `<span class="tile-date">Posted ${esc(fmtDate(stock.date))}</span>` : '<span></span>'}
                    <span class="tile-cta">View story <span aria-hidden="true">›</span></span>
                </div>
            </div>
        </article>
    `;
}

function renderGallery() {
    const container = document.getElementById('gallery');
    const empty = document.getElementById('galleryEmpty');
    if (!container) return;

    if (!STOCK_LIST.length) {
        container.innerHTML = '';
        if (empty) empty.hidden = false;
        return;
    }
    if (empty) empty.hidden = true;

    // Newest presentations first.
    const ordered = [...STOCK_LIST].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    container.innerHTML = ordered.map(tileHtml).join('');
    container.querySelectorAll('.tile').forEach(el => {
        const story = el.dataset.story;
        el.addEventListener('click', () => openStory(story));
        el.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openStory(story); }
        });
    });
}

// ── Story overlay ──────────────────────────────────────────────────────────
let lastFocused = null;

function openStory(src) {
    if (!src) return;
    const overlay = document.getElementById('storyOverlay');
    const frame = document.getElementById('storyFrame');
    if (!overlay || !frame) return;

    lastFocused = document.activeElement;
    frame.src = src;
    overlay.hidden = false;
    document.body.classList.add('story-open');
    // Move focus into the overlay for keyboard/escape handling.
    const close = document.getElementById('storyClose');
    if (close) close.focus();
}

function closeStory() {
    const overlay = document.getElementById('storyOverlay');
    const frame = document.getElementById('storyFrame');
    if (!overlay || overlay.hidden) return;

    overlay.hidden = true;
    document.body.classList.remove('story-open');
    // Clearing src stops the story and resets it for next time.
    if (frame) frame.src = 'about:blank';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
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
    renderGallery();

    const overlay = document.getElementById('storyOverlay');
    const close = document.getElementById('storyClose');
    if (close) close.addEventListener('click', closeStory);
    if (overlay) {
        // Click on the backdrop (not the iframe) closes.
        overlay.addEventListener('click', e => { if (e.target === overlay) closeStory(); });
    }
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeStory();
    });
});
