'use strict';

// ──────────────────────────────────────────────────────────────────────────
// SwingTrader 2026 — Trade Setup tracker
// ──────────────────────────────────────────────────────────────────────────

const PRICES_DATA = (typeof PRICES !== 'undefined') ? PRICES : {};
const SETUP_LIST  = (typeof SETUPS !== 'undefined') ? SETUPS : [];
const CONFIG      = (typeof APP_CONFIG !== 'undefined') ? APP_CONFIG : { heatmapYear: new Date().getFullYear() };

let activeFilter   = { setupId: null }; // null = show all setups in heatmap
let statusFilter    = 'all';
let directionFilter = 'all';

// ── Date helpers ─────────────────────────────────────────────────────────
// Use local-date strings (not UTC) so trigger detection and the heatmap line
// up with the user's local "today" regardless of timezone.
const ISO = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const PARSE = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const FMT_SHORT = s => PARSE(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const TODAY_ISO = ISO(new Date());

function pnlBucket(pct) {
    for (const b of CONFIG.pnlBuckets) if (pct >= b.min) return b.cls;
    return 'hm-loss-3';
}

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

    return { ...s, triggerISO, track, effectiveStatus, lastPrice, ifHeldPct, closeReturnPct };
}

const SETUPS_X = SETUP_LIST.map(enrichSetup);

// ── Heatmap rendering ────────────────────────────────────────────────────
function startOfWeek(d) {
    const x = new Date(d);
    x.setDate(x.getDate() - x.getDay());
    return x;
}

function buildHeatmapDays(year) {
    const start = startOfWeek(new Date(year, 0, 1));
    const yearEnd = new Date(year, 11, 31);
    const end = new Date(yearEnd);
    end.setDate(end.getDate() + (6 - end.getDay()));
    const days = [];
    const today = ISO(new Date());
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const iso = ISO(d);
        days.push({
            iso,
            inYear: d.getFullYear() === year,
            future: iso > today,
            month: d.getMonth(),
            day: d.getDate(),
            dow: d.getDay(),
        });
    }
    return days;
}

// Build a per-day map of cell info, given a filter (single setup or all).
function dayDataForFilter(setupId) {
    const out = {}; // iso -> { cls, label, plPct, role }
    const list = setupId ? SETUPS_X.filter(s => s.id === setupId) : SETUPS_X;

    for (const s of list) {
        if (!s.triggerISO) continue;
        for (const t of s.track) {
            const role = t.isTrigger ? 'trigger' : (t.isClose ? 'close' : 'pnl');
            const cls = role === 'trigger' ? 'hm-trigger'
                      : role === 'close'   ? 'hm-close'
                      : pnlBucket(t.plPct);
            const existing = out[t.date];
            // Trigger > close > pnl-magnitude when aggregating
            if (!existing) {
                out[t.date] = { cls, role, plPct: t.plPct, symbol: s.symbol, direction: s.direction };
            } else {
                const order = { trigger: 3, close: 2, pnl: 1 };
                if (order[role] > order[existing.role]) {
                    out[t.date] = { cls, role, plPct: t.plPct, symbol: s.symbol, direction: s.direction };
                } else if (role === 'pnl' && existing.role === 'pnl' && Math.abs(t.plPct) > Math.abs(existing.plPct)) {
                    out[t.date] = { cls, role, plPct: t.plPct, symbol: s.symbol, direction: s.direction };
                }
            }
        }
    }
    return out;
}

function renderHeatmap() {
    const grid = document.getElementById('heatmapGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const year = CONFIG.heatmapYear;
    const days = buildHeatmapDays(year);
    const data = dayDataForFilter(activeFilter.setupId);

    // Place month labels (one per month, on first column where that month begins)
    const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const seenMonth = new Set();

    days.forEach((d, i) => {
        const col = Math.floor(i / 7) + 1;
        const row = (d.dow) + 2; // row 1 reserved for month labels

        // Month label: place in row 1 the first time we encounter this month
        // and the day is in-year and on row 2 (Sunday) or near month start.
        if (d.inYear && !seenMonth.has(d.month) && d.day <= 7) {
            seenMonth.add(d.month);
            const lbl = document.createElement('div');
            lbl.className = 'hm-month-label';
            lbl.textContent = monthLabels[d.month];
            lbl.style.gridColumn = col;
            lbl.style.gridRow = 1;
            grid.appendChild(lbl);
        }

        const cell = document.createElement('div');
        cell.className = 'hm-day';
        cell.style.gridColumn = col;
        cell.style.gridRow = row;

        if (!d.inYear || d.future) {
            cell.classList.add(d.future ? 'future' : 'hm-empty');
        } else {
            const info = data[d.iso];
            if (info) {
                cell.classList.add(info.cls);
                cell.dataset.active = '1';
                let title = `${FMT_SHORT(d.iso)} — ${info.symbol}`;
                if (info.role === 'trigger') title += ' · entry triggered';
                else if (info.role === 'close') title += ' · trade closed';
                else if (info.plPct != null) title += ` · ${info.plPct >= 0 ? '+' : ''}${info.plPct.toFixed(1)}%`;
                cell.title = title;
            } else {
                cell.classList.add('hm-empty');
                cell.title = FMT_SHORT(d.iso);
            }
        }
        grid.appendChild(cell);
    });
}

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

function setupRowHtml(s) {
    const isShort = s.direction === 'Short';
    const dirBadge = `<span class="row-dir-badge ${isShort ? 'short' : 'long'}">${isShort ? '▼' : '▲'} ${s.direction.toUpperCase()}</span>`;
    const levelCount = [s.entryTrigger, s.stop, s.target].filter(v => v != null).length;
    const levelBadge = levelCount ? `<span class="row-levels">${levelCount}L</span>` : '';
    const snippet = s.notes ? s.notes.substring(0, 60) + (s.notes.length > 60 ? '…' : '') : '';
    const pnlVal = (() => {
        if (s.effectiveStatus === 'open' && s.ifHeldPct != null) {
            const cls = pctClass(s.ifHeldPct);
            return `<span class="row-pnl ${cls}">${fmtPct(s.ifHeldPct)}</span>`;
        }
        return '';
    })();

    return `
        <div class="row-symbol-col">
            <span class="row-symbol">${s.symbol}</span>
            ${dirBadge}
        </div>
        <div class="row-note">${snippet}</div>
        <div class="row-meta">
            <span class="row-date">${s.addedDate.slice(5)}</span>
            <div class="row-meta-bottom">${pnlVal}${levelBadge}</div>
        </div>
    `;
}

function renderActive() {
    const container = document.getElementById('activeSetups');
    const empty     = document.getElementById('activeEmpty');
    const countLabel = document.getElementById('activeCountLabel');
    if (!container) return;

    let list = SETUPS_X.filter(s => s.effectiveStatus === 'watching' || s.effectiveStatus === 'open');
    if (statusFilter    !== 'all') list = list.filter(s => s.effectiveStatus === statusFilter);
    if (directionFilter !== 'all') list = list.filter(s => s.direction.toLowerCase() === directionFilter);

    countLabel.textContent = `(${list.length})`;
    container.innerHTML = '';
    if (!list.length) { empty.hidden = false; return; }
    empty.hidden = true;

    // Group by addedDate descending
    const groups = {};
    for (const s of list) {
        if (!groups[s.addedDate]) groups[s.addedDate] = [];
        groups[s.addedDate].push(s);
    }
    const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

    for (const date of sortedDates) {
        const hdr = document.createElement('div');
        hdr.className = 'setup-date-header';
        const isToday = date === TODAY_ISO;
        hdr.textContent = FMT_SHORT(date).toUpperCase() + (isToday ? ' — TODAY' : '');
        container.appendChild(hdr);

        for (const s of groups[date]) {
            const el = document.createElement('article');
            const dirCls = s.direction === 'Short' ? 'dir-short' : 'dir-long';
            el.className = `setup-row ${dirCls}${s.tier ? ' tier-' + s.tier : ''}`;
            if (activeFilter.setupId === s.id) el.classList.add('selected');
            el.dataset.setupId = s.id;
            el.innerHTML = setupRowHtml(s);
            el.addEventListener('click', () => openModal(s.id));
            container.appendChild(el);
        }
    }
}

function renderHistory() {
    const tbody = document.getElementById('historyBody');
    const empty = document.getElementById('historyEmpty');
    const countLabel = document.getElementById('historyCountLabel');
    if (!tbody) return;

    const list = SETUPS_X.filter(s => s.effectiveStatus === 'closed' || s.effectiveStatus === 'cancelled')
        .sort((a, b) => (b.closedDate || b.addedDate).localeCompare(a.closedDate || a.addedDate));

    countLabel.textContent = `(${list.length})`;
    tbody.innerHTML = '';
    if (!list.length) { empty.hidden = false; return; }
    empty.hidden = true;

    for (const s of list) {
        const tr = document.createElement('tr');
        const ret = s.closeReturnPct;
        const retCls = ret == null ? 'even' : (ret >= 0.5 ? 'pos' : (ret <= -0.5 ? 'neg' : 'even'));
        const exitPrice = s.closePrice != null
            ? s.closePrice
            : (s.track.length ? s.track[s.track.length - 1].close : null);
        tr.innerHTML = `
            <td><strong>${s.symbol}</strong></td>
            <td><span class="tag ${s.direction === 'Long' ? 'tag-long' : 'tag-short'}">${s.direction}</span></td>
            <td>${s.setupType || '—'}</td>
            <td class="text-right">${fmtMoney(s.entryTrigger)}</td>
            <td class="text-right">${exitPrice != null ? fmtMoney(exitPrice) : '—'}</td>
            <td>${s.triggerISO ? FMT_SHORT(s.triggerISO) : '—'}</td>
            <td>${s.closedDate ? FMT_SHORT(s.closedDate) : '—'}</td>
            <td class="text-right ${retCls}">${ret == null ? '—' : fmtPct(ret)}</td>
            <td>${s.closeReason || (s.effectiveStatus === 'cancelled' ? 'cancelled' : '—')}</td>
        `;
        tr.style.cursor = 'pointer';
        tr.addEventListener('click', () => openModal(s.id));
        tbody.appendChild(tr);
    }
}

function renderMetrics() {
    const watching = SETUPS_X.filter(s => s.effectiveStatus === 'watching').length;
    const open     = SETUPS_X.filter(s => s.effectiveStatus === 'open').length;
    const closed   = SETUPS_X.filter(s => s.effectiveStatus === 'closed');

    document.getElementById('metricWatching').textContent = watching;
    document.getElementById('metricOpen').textContent = open;
    document.getElementById('metricClosed').textContent = closed.length;

    const wins = closed.filter(s => s.closeReturnPct != null && s.closeReturnPct > 0);
    const winRate = closed.length ? (wins.length / closed.length) * 100 : null;
    document.getElementById('metricWinRate').textContent = winRate == null ? '—' : winRate.toFixed(0) + '%';
    document.getElementById('metricWinSub').textContent = closed.length
        ? `${wins.length} / ${closed.length} closed` : 'closed only';

    const returns = closed.map(s => s.closeReturnPct).filter(v => v != null);
    const avg = returns.length ? returns.reduce((a, b) => a + b, 0) / returns.length : null;
    const avgEl = document.getElementById('metricAvgReturn');
    avgEl.textContent = avg == null ? '—' : fmtPct(avg);
    avgEl.classList.toggle('green', avg != null && avg > 0);
    avgEl.classList.toggle('red',   avg != null && avg < 0);
}

// ── Modal ────────────────────────────────────────────────────────────────
function openModal(setupId) {
    const s = SETUPS_X.find(x => x.id === setupId);
    if (!s) return;

    document.getElementById('modalTitle').textContent = `${s.symbol} · ${s.direction}`;
    document.getElementById('modalSubtitle').textContent =
        `${s.setupType || 'Setup'} · added ${FMT_SHORT(s.addedDate)} · ${s.effectiveStatus}`;

    const body = document.getElementById('modalBody');
    const facts = `
        <div class="modal-section">
            <h4>Plan</h4>
            <div class="setup-grid" style="grid-template-columns:repeat(4,1fr);">
                <div><label>Entry</label><span>${fmtMoney(s.entryTrigger)}</span></div>
                <div><label>Stop</label><span>${s.stop != null ? fmtMoney(s.stop) : '—'}</span></div>
                <div><label>Target</label><span>${s.target != null ? fmtMoney(s.target) : '—'}</span></div>
                <div><label>Tier</label><span>${s.tier || '—'}</span></div>
                <div><label>Triggered</label><span>${s.triggerISO ? FMT_SHORT(s.triggerISO) : 'not yet'}</span></div>
                <div><label>Closed</label><span>${s.closedDate ? FMT_SHORT(s.closedDate) : '—'}</span></div>
                <div><label>If held</label><span class="${pctClass(s.ifHeldPct)}">${fmtPct(s.ifHeldPct)}</span></div>
                <div><label>Close return</label><span class="${pctClass(s.closeReturnPct)}">${fmtPct(s.closeReturnPct)}</span></div>
            </div>
        </div>
    `;

    let track = '';
    if (s.track.length) {
        const rows = s.track.map(t => {
            const cls = t.isTrigger ? 'row-trigger' : (t.isClose ? 'row-close' : '');
            const pcls = pctClass(t.plPct);
            const note = t.isTrigger ? 'TRIGGER' : (t.isClose ? 'CLOSE' : '');
            return `<tr class="${cls}">
                <td>${FMT_SHORT(t.date)}</td>
                <td>${fmtMoney(t.close)}</td>
                <td class="${pcls}">${fmtPct(t.plPct)}</td>
                <td>${note}</td>
            </tr>`;
        }).join('');
        track = `
            <div class="modal-section">
                <h4>Daily P&L (${s.track.length} days)</h4>
                <table class="daily-table">
                    <thead><tr><th>Date</th><th>Close</th><th>P&L %</th><th></th></tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    } else {
        track = `<div class="modal-section"><h4>Daily P&L</h4><div class="empty-state" style="padding:16px;">No price data yet — run <code>python3 fetch_setups.py</code> to populate <code>prices.js</code>.</div></div>`;
    }

    const notes = s.notes ? `
        <div class="modal-section">
            <h4>Notes</h4>
            <div class="setup-notes" style="border:none;padding:0;font-size:13px;">${s.notes}</div>
        </div>
    ` : '';

    body.innerHTML = facts + track + notes;

    const overlay = document.getElementById('setupModal');
    overlay.hidden = false;
}

function closeModal() {
    document.getElementById('setupModal').hidden = true;
}

// Click a card to filter the heatmap to that setup; click again to clear.
function onSetupClick(setupId) {
    if (activeFilter.setupId === setupId) {
        clearFilter();
        return;
    }
    activeFilter.setupId = setupId;
    const s = SETUPS_X.find(x => x.id === setupId);
    document.getElementById('heatmapSubtitle').textContent =
        s ? `${s.symbol} · ${s.direction}` : 'All setups';
    document.getElementById('heatmapClearBtn').classList.remove('active');
    renderHeatmap();
    renderActive();
}

function clearFilter() {
    activeFilter.setupId = null;
    document.getElementById('heatmapSubtitle').textContent = 'All setups';
    document.getElementById('heatmapClearBtn').classList.add('active');
    renderHeatmap();
    renderActive();
}

// ── Ticker ──────────────────────────────────────────────────────────────
function initTicker() {
    const track = document.querySelector('.ticker-track');
    if (!track) return;
    if (typeof TICKER_DATA !== 'undefined' && TICKER_DATA.length) {
        const html = TICKER_DATA.map(t =>
            `<div class="ticker-item ${t.tier || ''}"><span class="ticker-icon">${t.icon || ''}</span><span class="ticker-title">${t.symbol}</span><span class="ticker-body">${t.body}</span></div><span class="ticker-sep">•</span>`
        ).join('');
        track.innerHTML = html + html;
    }
    track.addEventListener('mouseenter', () => track.classList.add('paused'));
    track.addEventListener('mouseleave', () => track.classList.remove('paused'));
    track.addEventListener('touchstart', () => track.classList.toggle('paused'), { passive: true });
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
    document.getElementById('heatmapYear').textContent = CONFIG.heatmapYear;

    initTicker();
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

    // Heatmap clear button
    document.getElementById('heatmapClearBtn').addEventListener('click', clearFilter);

    // Modal close
    document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
    document.getElementById('setupModal').addEventListener('click', e => {
        if (e.target.id === 'setupModal') closeModal();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal();
    });

    renderHeatmap();
    renderMetrics();
    renderActive();
    renderHistory();
});
