'use strict';

// ──────────────────────────────────────────────────────────────────────────
// SwingTrader 2026 — Trade Setup tracker
// ──────────────────────────────────────────────────────────────────────────

const PRICES_DATA = (typeof PRICES !== 'undefined') ? PRICES : {};
const SETUP_LIST  = (typeof SETUPS !== 'undefined') ? SETUPS : [];
const CONFIG      = (typeof APP_CONFIG !== 'undefined') ? APP_CONFIG : {};

let statusFilter    = 'all';
let directionFilter = 'all';
let selectedSymbol  = null;             // ticker currently shown in detail pane

// ── Date helpers ─────────────────────────────────────────────────────────
// Use local-date strings (not UTC) so trigger detection and the heatmap line
// up with the user's local "today" regardless of timezone.
const ISO = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const PARSE = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const FMT_SHORT = s => PARSE(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const TODAY_ISO = ISO(new Date());

// ── Price lookup ─────────────────────────────────────────────────────────
function bars(symbol) { return PRICES_DATA[symbol] || []; }

function barsFromTo(symbol, fromISO, toISO) {
    return bars(symbol).filter(b => b.d >= fromISO && b.d <= toISO);
}

function lastBar(symbol) {
    const arr = bars(symbol);
    return arr.length ? arr[arr.length - 1] : null;
}

// ── Setup computation ────────────────────────────────────────────────────
function computeTriggerDate(setup) {
    if (setup.triggeredDate) return setup.triggeredDate;
    if (setup.entryTrigger == null) return null;
    const window = barsFromTo(setup.symbol, setup.addedDate, TODAY_ISO);
    for (const b of window) {
        if (setup.direction === 'Long'  && b.h >= setup.entryTrigger) return b.d;
        if (setup.direction === 'Short' && b.l <= setup.entryTrigger) return b.d;
    }
    return null;
}

function pnlPct(direction, entry, price) {
    if (entry == null || price == null) return null;
    const raw = ((price - entry) / entry) * 100;
    return direction === 'Short' ? -raw : raw;
}

function computeDailyTrack(setup, triggerISO) {
    if (!triggerISO) return [];
    const endISO = setup.closedDate || TODAY_ISO;
    const window = barsFromTo(setup.symbol, triggerISO, endISO);
    const entry = setup.entryTrigger;
    const closed = setup.status === 'closed';
    const lastIdx = window.length - 1;
    return window.map((b, i) => ({
        date: b.d,
        close: b.c,
        plPct: pnlPct(setup.direction, entry, b.c),
        isTrigger: i === 0,
        // Mark the final bar as the close bar for any closed trade — handles
        // the case where closedDate falls on a weekend/holiday.
        isClose: closed && i === lastIdx,
    }));
}

function enrichSetup(s) {
    const triggerISO = (s.status === 'cancelled') ? null : computeTriggerDate(s);
    const track = computeDailyTrack(s, triggerISO);
    let effectiveStatus;
    if (s.status === 'cancelled') effectiveStatus = 'cancelled';
    else if (s.status === 'closed') effectiveStatus = 'closed';
    else if (triggerISO) effectiveStatus = 'open';
    else effectiveStatus = 'watching';

    const last = lastBar(s.symbol);
    const lastPrice = last ? last.c : null;
    const ifHeldPct = (triggerISO && lastPrice != null)
        ? pnlPct(s.direction, s.entryTrigger, lastPrice)
        : null;

    let closeReturnPct = null;
    if (s.status === 'closed' && triggerISO) {
        const closePrice = (s.closePrice != null)
            ? s.closePrice
            : (track.length ? track[track.length - 1].close : null);
        closeReturnPct = pnlPct(s.direction, s.entryTrigger, closePrice);
    }

    // distanceToTriggerPct: how far the price has to move (in the right direction)
    // to trigger entry. + = still waiting; large + = "far / likely invalidated".
    let distanceToTriggerPct = null;
    if (effectiveStatus === 'watching' && s.entryTrigger != null && lastPrice != null && lastPrice > 0) {
        if (s.direction === 'Long') {
            distanceToTriggerPct = ((s.entryTrigger - lastPrice) / lastPrice) * 100;
        } else {
            distanceToTriggerPct = ((lastPrice - s.entryTrigger) / lastPrice) * 100;
        }
    }

    return { ...s, triggerISO, track, effectiveStatus, lastPrice, ifHeldPct, closeReturnPct, distanceToTriggerPct };
}

const SETUPS_X = SETUP_LIST.map(enrichSetup);

// ── Setup list rendering ─────────────────────────────────────────────────
function fmtMoney(v) {
    if (typeof v !== 'number' || !isFinite(v)) return '—';
    return '$' + v.toFixed(2);
}
function fmtPct(v) {
    if (typeof v !== 'number' || !isFinite(v)) return '—';
    return (v >= 0 ? '+' : '') + v.toFixed(2) + '%';
}
function pctClass(v) { return v == null ? 'neutral' : (v >= 0 ? 'pos' : 'neg'); }

function symbolRowHtml(symbol, setups, primary, bucket) {
    const dirs = [...new Set(setups.map(s => s.direction))];
    const dirBadges = dirs.map(d => {
        const isShort = d === 'Short';
        return `<span class="row-dir-badge ${isShort ? 'short' : 'long'}">${isShort ? '▼' : '▲'} ${d.toUpperCase()}</span>`;
    }).join('');
    const countBadge = setups.length > 1 ? `<span class="row-setup-count">${setups.length}</span>` : '';
    const snippet = primary.notes ? primary.notes.substring(0, 55) + (primary.notes.length > 55 ? '…' : '') : '';

    let metric = '';
    if (bucket === 'open' && primary.ifHeldPct != null) {
        metric = `<span class="row-pnl ${pctClass(primary.ifHeldPct)}">${fmtPct(primary.ifHeldPct)}</span>`;
    } else if (primary.distanceToTriggerPct != null) {
        const d = primary.distanceToTriggerPct;
        metric = `<span class="row-dist ${d > 4 ? 'far' : 'near'}">${d >= 0 ? '+' : ''}${d.toFixed(1)}%</span>`;
    }

    return `
        <div class="row-symbol-col">
            <span class="row-symbol">${symbol}</span>
            <div class="row-badges">${dirBadges}${countBadge}</div>
        </div>
        <div class="row-note">${snippet}</div>
        <div class="row-meta">${metric}</div>
    `;
}

function renderActive() {
    const container  = document.getElementById('activeSetups');
    const empty      = document.getElementById('activeEmpty');
    const countLabel = document.getElementById('activeCountLabel');
    if (!container) return;

    let list = SETUPS_X.filter(s => s.effectiveStatus === 'watching' || s.effectiveStatus === 'open');
    if (statusFilter    !== 'all') list = list.filter(s => s.effectiveStatus === statusFilter);
    if (directionFilter !== 'all') list = list.filter(s => s.direction.toLowerCase() === directionFilter);

    // Deduplicate: one row per ticker, keeping all their setups grouped
    const symbolMap = new Map();
    for (const s of list) {
        if (!symbolMap.has(s.symbol)) symbolMap.set(s.symbol, []);
        symbolMap.get(s.symbol).push(s);
    }

    countLabel.textContent = `(${symbolMap.size})`;
    container.innerHTML = '';
    if (!symbolMap.size) { empty.hidden = false; return; }
    empty.hidden = true;

    // Bucket each symbol by its best setup's status
    const FAR_THRESHOLD = 4;
    const buckets = { open: [], watching: [], far: [] };
    for (const [sym, setups] of symbolMap) {
        const hasOpen = setups.some(s => s.effectiveStatus === 'open');
        if (hasOpen) {
            const primary = setups.filter(s => s.effectiveStatus === 'open')
                .sort((a, b) => (b.ifHeldPct ?? -Infinity) - (a.ifHeldPct ?? -Infinity))[0];
            buckets.open.push({ sym, setups, primary, minDist: null });
        } else {
            const finite = setups.map(s => s.distanceToTriggerPct).filter(v => v != null && isFinite(v));
            const minDist = finite.length ? Math.min(...finite) : Infinity;
            const primary = setups.reduce((b, s) =>
                (s.distanceToTriggerPct ?? Infinity) < (b.distanceToTriggerPct ?? Infinity) ? s : b
            );
            if (minDist <= FAR_THRESHOLD) buckets.watching.push({ sym, setups, primary, minDist });
            else                          buckets.far.push({ sym, setups, primary, minDist });
        }
    }
    buckets.open.sort((a, b) => (b.primary.ifHeldPct ?? -Infinity) - (a.primary.ifHeldPct ?? -Infinity));
    buckets.watching.sort((a, b) => (a.minDist ?? 999) - (b.minDist ?? 999));
    buckets.far.sort((a, b) => (a.minDist ?? 999) - (b.minDist ?? 999));

    const sections = [
        { key: 'open',     title: 'Triggered · in trade',              items: buckets.open },
        { key: 'watching', title: 'Watching · near trigger',            items: buckets.watching },
        { key: 'far',      title: 'Far from trigger · likely stale',   items: buckets.far },
    ];

    for (const sec of sections) {
        if (!sec.items.length) continue;
        const hdr = document.createElement('div');
        hdr.className = `status-group-header status-group-${sec.key}`;
        hdr.innerHTML = `<span>${sec.title}</span><span class="status-group-count">${sec.items.length}</span>`;
        container.appendChild(hdr);

        for (const { sym, setups, primary } of sec.items) {
            const el = document.createElement('article');
            el.className = `setup-row`;
            if (selectedSymbol === sym) el.classList.add('selected');
            el.dataset.symbol = sym;
            el.innerHTML = symbolRowHtml(sym, setups, primary, sec.key);
            el.addEventListener('click', () => selectSymbol(sym));
            container.appendChild(el);
        }
    }
}

// ── Detail pane ──────────────────────────────────────────────────────────
function selectSymbol(sym) {
    selectedSymbol = sym;
    renderActive();
    renderDetail();
}

// Status of a price level given a setup's lifecycle.
function levelStatus(s, levelType) {
    // levelType: 'entry' | 'stop' | 'target'
    if (s.effectiveStatus === 'cancelled') return 'invalidated';
    if (levelType === 'entry') {
        if (s.triggerISO) return 'hit';
        return 'watching';
    }
    if (levelType === 'stop') {
        if (s.closeReason === 'stop') return 'hit';
        if (s.effectiveStatus === 'closed') return 'never-hit';
        return 'watching';
    }
    if (levelType === 'target') {
        if (s.closeReason === 'target') return 'hit';
        if (s.effectiveStatus === 'closed') return 'never-hit';
        return 'watching';
    }
    return 'watching';
}

const STATUS_LIST = ['watching', 'hit', 'overshoot', 'never-hit', 'invalidated'];
const STATUS_LABEL = {
    'watching':    'WATCHING',
    'hit':         'HIT ✓',
    'overshoot':   'OVERSHOOT',
    'never-hit':   'NEVER HIT',
    'invalidated': 'INVALIDATED ×',
};

function levelCardHtml(num, label, price, status) {
    if (price == null) return '';
    const buttons = STATUS_LIST.map(st =>
        `<button class="status-btn ${st === status ? 'active' : ''} status-${st}" disabled>${STATUS_LABEL[st]}</button>`
    ).join('');
    return `
        <div class="level-card">
            <div class="level-row-top">
                <span class="level-num">L${num}</span>
                <span class="level-price">${fmtMoney(price)}</span>
                <span class="level-desc">${label}</span>
            </div>
            <div class="level-status-row">${buttons}</div>
        </div>
    `;
}

function tvChartHtml(symbol) {
    const frameId = `tv_${symbol.replace(/[^a-z0-9]/gi, '_')}`;
    const params = new URLSearchParams({
        frameElementId: frameId,
        symbol,
        interval:       'D',
        theme:          'dark',
        style:          '1',
        locale:         'en',
        hidesidetoolbar:'0',
        saveimage:      '0',
        utm_source:     location.hostname,
        utm_medium:     'widget',
        utm_campaign:   'chart',
    });
    const src = `https://s.tradingview.com/widgetembed/?${params.toString()}`;
    return `<iframe id="${frameId}" class="tv-chart-wrap" src="${src}" frameborder="0" allowtransparency="true" scrolling="no" allowfullscreen></iframe>`;
}

function setupBlockHtml(s) {
    const isShort = s.direction === 'Short';
    const dirBadge = `<span class="row-dir-badge ${isShort ? 'short' : 'long'}">${isShort ? '▼' : '▲'} ${s.direction.toUpperCase()}</span>`;

    let levelNum = 0;
    const levels = [];
    if (s.entryTrigger != null) {
        levelNum++;
        levels.push(levelCardHtml(levelNum, isShort ? 'Entry — short' : 'Entry — long', s.entryTrigger, levelStatus(s, 'entry')));
    }
    if (s.target != null) {
        levelNum++;
        levels.push(levelCardHtml(levelNum, 'Target', s.target, levelStatus(s, 'target')));
    }
    if (s.stop != null) {
        levelNum++;
        levels.push(levelCardHtml(levelNum, 'Stop', s.stop, levelStatus(s, 'stop')));
    }

    const pnl = (() => {
        if (s.effectiveStatus === 'closed' && s.closeReturnPct != null)
            return `<span class="${pctClass(s.closeReturnPct)}">${fmtPct(s.closeReturnPct)}</span> closed`;
        if (s.effectiveStatus === 'open' && s.ifHeldPct != null)
            return `<span class="${pctClass(s.ifHeldPct)}">${fmtPct(s.ifHeldPct)}</span> if held`;
        return '<span class="neutral">—</span>';
    })();

    return `
        <div class="setup-block">
            <div class="setup-block-header">
                ${dirBadge}
                <span class="tag tag-status-${s.effectiveStatus}">${s.effectiveStatus}</span>
                <span class="date-pill">${s.addedDate}</span>
                <span class="setup-block-type">${s.setupType || ''}</span>
            </div>
            ${s.notes ? `<p class="detail-note">${s.notes}</p>` : ''}
            <div class="detail-meta">
                <div><label>Entry</label><span>${fmtMoney(s.entryTrigger)}</span></div>
                <div><label>Triggered</label><span>${s.triggerISO ? FMT_SHORT(s.triggerISO) : 'not yet'}</span></div>
                <div><label>P&L</label><span>${pnl}</span></div>
                <div><label>Last px</label><span>${s.lastPrice != null ? fmtMoney(s.lastPrice) : '—'}</span></div>
                <div><label>Closed</label><span>${s.closedDate ? FMT_SHORT(s.closedDate) : '—'}</span></div>
                <div><label>Days</label><span>${s.track.length || '—'}</span></div>
            </div>
            ${levels.length ? `<div class="levels-list">${levels.join('')}</div>` : ''}
        </div>
    `;
}

function renderDetail() {
    const pane = document.getElementById('setupDetail');
    if (!pane) return;
    if (!selectedSymbol) {
        pane.innerHTML = `<div class="detail-empty">Select a ticker from the list.</div>`;
        return;
    }

    const allSetups = SETUPS_X.filter(s => s.symbol === selectedSymbol);
    if (!allSetups.length) {
        pane.innerHTML = `<div class="detail-empty">No setups for ${selectedSymbol}.</div>`;
        return;
    }

    const statusOrder = { open: 0, watching: 1, closed: 2, cancelled: 3 };
    const sorted = [...allSetups].sort((a, b) =>
        (statusOrder[a.effectiveStatus] ?? 4) - (statusOrder[b.effectiveStatus] ?? 4)
    );
    const active  = sorted.filter(s => s.effectiveStatus === 'open' || s.effectiveStatus === 'watching');
    const history = sorted.filter(s => s.effectiveStatus === 'closed' || s.effectiveStatus === 'cancelled');

    const lastPrice = allSetups[0].lastPrice;
    const lastPriceHtml = lastPrice != null
        ? `<span class="detail-last-price">${fmtMoney(lastPrice)}</span>` : '';

    let html = `
        <div class="detail-card">
            <div class="detail-header">
                <div class="detail-title-row">
                    <h2 class="detail-symbol">${selectedSymbol}</h2>
                    ${lastPriceHtml}
                </div>
            </div>
            <div class="detail-section-chart">${tvChartHtml(selectedSymbol)}</div>
            ${active.map(setupBlockHtml).join('<div class="setup-block-divider"></div>')}
    `;

    if (history.length) {
        html += `
            <div class="detail-section">
                <h4>History</h4>
                <div class="history-list">
                    ${history.map(s => {
                        const isShort = s.direction === 'Short';
                        const ret = s.closeReturnPct;
                        const retHtml = ret != null
                            ? `<span class="row-pnl ${pctClass(ret)}">${fmtPct(ret)}</span>`
                            : `<span class="neutral">${s.effectiveStatus}</span>`;
                        return `
                            <div class="history-row">
                                <span class="row-dir-badge ${isShort ? 'short' : 'long'}">${isShort ? '▼' : '▲'} ${s.direction.toUpperCase()}</span>
                                <span class="history-dates">${s.addedDate.slice(5)}${s.closedDate ? ' → ' + s.closedDate.slice(5) : ''}</span>
                                <span class="history-entry">${fmtMoney(s.entryTrigger)}</span>
                                ${retHtml}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    html += `</div>`;
    pane.innerHTML = html;
}

function clearSelection() {
    selectedSymbol = null;
    renderActive();
    renderDetail();
}

// ── PWA install ─────────────────────────────────────────────────────────
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

// ── Wiring ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    initInstallButton();

    // Status filter
    document.querySelectorAll('[data-status-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-status-filter]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            statusFilter = btn.dataset.statusFilter;
            renderActive();
        });
    });

    // Direction filter
    document.querySelectorAll('[data-dir-filter]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('[data-dir-filter]').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            directionFilter = btn.dataset.dirFilter;
            renderActive();
        });
    });

    renderActive();
    const firstRow = document.querySelector('.setup-row');
    if (firstRow) selectSymbol(firstRow.dataset.symbol);
    else renderDetail();
});
