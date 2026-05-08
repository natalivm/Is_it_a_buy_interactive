'use strict';

// ──────────────────────────────────────────────────────────────────────────
// SwingTrader 2026 — Trade Setup tracker
// ──────────────────────────────────────────────────────────────────────────

const PRICES_DATA = (typeof PRICES !== 'undefined') ? PRICES : {};
const SETUP_LIST  = (typeof SETUPS !== 'undefined') ? SETUPS : [];
const CONFIG      = (typeof APP_CONFIG !== 'undefined') ? APP_CONFIG : { heatmapYear: new Date().getFullYear() };

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

// Build a per-day map from all triggered trades — heatmap always shows full history.
function dayDataForFilter() {
    const out = {}; // iso -> { cls, label, plPct, role }
    const list = SETUPS_X;
    const order = { trigger: 3, close: 2, pnl: 1 };

    function put(date, entry) {
        const existing = out[date];
        if (!existing || order[entry.role] > order[existing.role] ||
            (entry.role === 'pnl' && existing.role === 'pnl' && Math.abs(entry.plPct) > Math.abs(existing.plPct))) {
            out[date] = entry;
        }
    }

    for (const s of list) {
        if (!s.triggerISO) continue;

        // Always stamp the trigger date — even when prices.js has no bar for it
        // (e.g. data not yet refreshed). This ensures open trades always appear.
        put(s.triggerISO, { cls: 'hm-trigger', role: 'trigger', plPct: null, symbol: s.symbol, direction: s.direction });

        for (const t of s.track) {
            const role = t.isTrigger ? 'trigger' : (t.isClose ? 'close' : 'pnl');
            const cls  = role === 'trigger' ? 'hm-trigger'
                       : role === 'close'   ? 'hm-close'
                       : pnlBucket(t.plPct);
            put(t.date, { cls, role, plPct: t.plPct, symbol: s.symbol, direction: s.direction });
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
    const data = dayDataForFilter();

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

function drawPriceChart(s) {
    const allBars = bars(s.symbol);
    const endDate = s.closedDate || TODAY_ISO;
    const chartBars = allBars.filter(b => b.d >= s.addedDate && b.d <= endDate);
    if (chartBars.length < 2) return '';

    const W = 520, H = 190;
    const PL = 6, PR = 74, PT = 14, PB = 26;
    const iW = W - PL - PR;
    const iH = H - PT - PB;

    const levelPrices = [s.entryTrigger, s.stop, s.target].filter(v => v != null);
    const allP = [...chartBars.map(b => b.c), ...levelPrices];
    let lo = Math.min(...allP), hi = Math.max(...allP);
    const margin = (hi - lo) * 0.12 || 1;
    lo -= margin; hi += margin;

    const xS = i => PL + (i / Math.max(chartBars.length - 1, 1)) * iW;
    const yS = p => PT + (1 - (p - lo) / (hi - lo)) * iH;
    const bY = PT + iH;
    const lineX = (PL + iW).toFixed(1);

    const pts = chartBars.map((b, i) => [xS(i), yS(b.c)]);
    const polyPts = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
    const areaD = `M${pts[0][0].toFixed(1)},${bY} ${pts.map(([x, y]) => `L${x.toFixed(1)},${y.toFixed(1)}`).join(' ')} L${pts[pts.length-1][0].toFixed(1)},${bY} Z`;

    const isShort = s.direction === 'Short';
    const lastC = chartBars[chartBars.length - 1].c;
    const isProfit = s.entryTrigger != null
        ? (isShort ? lastC < s.entryTrigger : lastC > s.entryTrigger) : true;
    const lineColor = isProfit ? '#34d399' : '#f87171';

    const clipId = `cc-${s.id.replace(/[^a-z0-9]/gi, '')}`;
    const gradId  = `gf-${s.id.replace(/[^a-z0-9]/gi, '')}`;

    // Nice Y-axis tick step
    function niceStep(range, n) {
        const raw = range / n;
        const mag = Math.pow(10, Math.floor(Math.log10(raw)));
        const f = raw / mag;
        return (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * mag;
    }
    const step = niceStep(hi - lo, 4);
    const yTicks = [];
    for (let p = Math.ceil(lo / step) * step; p <= hi - (hi - lo) * 0.02; p += step)
        yTicks.push(p);

    // X-axis date labels (~4 evenly spaced)
    const xStep = Math.max(1, Math.floor((chartBars.length - 1) / 4));
    const xLabels = [];
    for (let i = 0; i < chartBars.length; i += xStep)
        xLabels.push({ x: xS(i), label: chartBars[i].d.slice(5) });

    // Y-axis grid lines + right-side price labels
    const yGridSvg = yTicks.map(p => {
        const y = yS(p).toFixed(1);
        return `<line x1="${PL}" y1="${y}" x2="${lineX}" y2="${y}" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>` +
               `<text x="${W - PR + 5}" y="${(parseFloat(y) + 3.5).toFixed(1)}" font-size="8.5" fill="rgba(255,255,255,0.28)" font-family="-apple-system,sans-serif">${p.toFixed(2)}</text>`;
    }).join('');

    // X-axis date labels
    const xGridSvg = xLabels.map(({ x, label }) =>
        `<text x="${x.toFixed(1)}" y="${H - 7}" font-size="8.5" fill="rgba(255,255,255,0.28)" text-anchor="middle" font-family="-apple-system,sans-serif">${label}</text>`
    ).join('');

    // Level dashed lines + labelled boxes on the right
    const bxX = W - PR + 4, bxW = PR - 6, bxH = 16;
    const levelDefs = [
        { price: s.entryTrigger, color: '#60a5fa' },
        { price: s.target,       color: '#34d399' },
        { price: s.stop,         color: '#f87171' },
    ];
    const levelSvg = levelDefs.map(lv => {
        if (lv.price == null) return '';
        const y = yS(lv.price), ys = y.toFixed(1);
        return `<line x1="${PL}" y1="${ys}" x2="${lineX}" y2="${ys}" stroke="${lv.color}" stroke-width="0.9" stroke-dasharray="5,4" opacity="0.8"/>` +
               `<rect x="${bxX}" y="${(y - bxH / 2).toFixed(1)}" width="${bxW}" height="${bxH}" fill="#161b22" rx="3"/>` +
               `<text x="${(bxX + bxW / 2).toFixed(1)}" y="${(y + 4.5).toFixed(1)}" font-size="9.5" fill="${lv.color}" font-weight="700" text-anchor="middle" font-family="-apple-system,sans-serif">${fmtMoney(lv.price)}</text>`;
    }).join('');

    // Trigger date vertical marker
    let trigLine = '';
    if (s.triggerISO) {
        const ti = chartBars.findIndex(b => b.d >= s.triggerISO);
        if (ti >= 0) {
            const tx = xS(ti).toFixed(1);
            trigLine = `<line x1="${tx}" y1="${PT}" x2="${tx}" y2="${bY}" stroke="#60a5fa" stroke-width="0.8" stroke-dasharray="3,3" opacity="0.35"/>`;
        }
    }

    return `<div class="detail-chart">
        <svg viewBox="0 0 ${W} ${H}" width="100%" style="display:block;height:auto" class="chart-svg">
            <defs>
                <clipPath id="${clipId}"><rect x="${PL}" y="${PT}" width="${iW}" height="${iH}"/></clipPath>
                <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stop-color="${lineColor}" stop-opacity="0.28"/>
                    <stop offset="100%" stop-color="${lineColor}" stop-opacity="0.02"/>
                </linearGradient>
            </defs>
            ${yGridSvg}
            <path d="${areaD}" fill="url(#${gradId})" clip-path="url(#${clipId})"/>
            ${trigLine}
            <polyline points="${polyPts}" fill="none" stroke="${lineColor}" stroke-width="1.5" stroke-linejoin="round" clip-path="url(#${clipId})"/>
            ${levelSvg}
            ${xGridSvg}
        </svg>
    </div>`;
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

    const chart = drawPriceChart(s);

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
            ${chart ? `<div class="detail-section-chart">${chart}</div>` : ''}
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
    document.getElementById('heatmapYear').textContent = CONFIG.heatmapYear;
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

    renderHeatmap();
    renderMetrics();
    renderActive();
    renderDetail();
});
