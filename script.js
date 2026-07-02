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

// ── Tile rendering ─────────────────────────────────────────────────────────
function tileHtml(stock) {
    const accent = stock.accent === 'pink' ? 'pink' : 'purple';
    const verdict = ['buy', 'caution', 'avoid'].includes(stock.verdict) ? stock.verdict : 'caution';
    const change = stock.change
        ? `<span class="tile-change">${esc(stock.change)}</span>` : '';
    const signal = stock.signal
        ? `<p class="tile-signal">${esc(stock.signal)}</p>` : '';

    // Decorative candle motif — purely visual, fixed heights.
    const HEIGHTS = [30, 46, 38, 64, 52, 78, 90];
    const candles = HEIGHTS.map((h, i) =>
        `<span class="tile-candle${i === HEIGHTS.length - 1 ? ' hl' : (i % 3 === 1 ? ' dn' : '')}" style="height:${h}%"></span>`
    ).join('');

    return `
        <article class="tile tile-${accent}" data-story="${esc(stock.story)}"
                 tabindex="0" role="button" aria-label="Open ${esc(stock.symbol)} story">
            <div class="tile-top">
                <div class="tile-id">
                    <span class="tile-symbol">${esc(stock.symbol)}</span>
                    <span class="tile-exchange">${esc(stock.exchange || '')}</span>
                </div>
                <span class="tile-chip chip-${verdict}">${VERDICT_LABEL[verdict]}</span>
            </div>
            <div class="tile-candles" aria-hidden="true">${candles}</div>
            <div class="tile-price-row">
                <span class="tile-price">${esc(stock.price || '')}</span>
                ${change}
            </div>
            ${signal}
            <div class="tile-cta">View story <span aria-hidden="true">›</span></div>
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

    container.innerHTML = STOCK_LIST.map(tileHtml).join('');
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
