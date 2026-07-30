'use strict';
/* ══════════════════════════════════════════════════════════════════════════
   Shared story engine. One state machine drives every deck; each deck keeps
   its own chrome and calls createStory() with the pieces it uses.

   createStory(cfg?) — cfg is OPTIONAL; the defaults below match every deck:
     stage:   selector of the framing element (tap zones append here)
              [default '.stage']
     deck:    selector holding the .slide elements   [default '#deck']
     slideSel:slide selector (default '.slide')
     progress:selector of a container to fill with .seg segments (optional)
     tap:     add left/right tap zones? (default true)
     swipe:   selector to bind touch-swipe on        [default '#deck']
     prev/next: selectors of nav buttons             [default '#btn-back/-next']
     counter: selector showing the current index     [default '#cur']
     total:   selector showing the slide count       [default '#tot']
     label:   selector updated from each slide's data-label [default '#foot-tag']
     hint:    selector of a first-slide hint to hide after advancing (optional)
     fit:     scale each slide's .slide-inner to fit its height? (default true)
     onShow:  callback(idx, total, slide) after each transition (optional)
   Returns { show, next, prev }.

   The footer nav (back/next arrows + counter + label) is auto-built inside the
   stage if the deck doesn't provide its own .nav markup, and any
   svg[data-lv] level chart is hydrated — see hydrateLevelCharts() below.
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Level-chart hydrator ────────────────────────────────────────────────────
   Decks describe the horizontal price levels of a chart as compact JSON
   instead of hand-placed SVG:

     <svg viewBox="0 0 470 300" data-lv='[["k",70,"$402","стоп · MA-стек",.05], …]'>
       …only the custom paths / dots / captions stay inline…
     </svg>

   Each entry is [color, y, axisLabel, caption?, delay?]:
     color  k=pink  p=purple/green  y=yellow  w=white  m=muted
     y      the line's y coordinate (viewBox units)
     axis   left-side price label (x=80, right-anchored)
     caption right-side note (x=366) — null/omitted for none
     delay  animation-delay of the line in s (default staggered by index)
   Generated nodes are prepended so inline elements draw on top of them. */
function hydrateLevelCharts() {
  const NS = 'http://www.w3.org/2000/svg';
  document.querySelectorAll('svg[data-lv]').forEach(svg => {
    let spec;
    try { spec = JSON.parse(svg.getAttribute('data-lv')); } catch (e) { return; }
    const frag = document.createDocumentFragment();
    const node = (tag, cls, attrs, delay, text) => {
      const el = document.createElementNS(NS, tag);
      el.setAttribute('class', cls);
      el.setAttribute('style', 'animation-delay:' + delay + 's');
      for (const k in attrs) el.setAttribute(k, attrs[k]);
      if (text != null) el.textContent = text;
      return el;
    };
    spec.forEach(([c, y, ax, cap, d], i) => {
      const delay = (d != null) ? d : +(0.05 + i * 0.07).toFixed(2);
      frag.appendChild(node('line', 'dash s-' + c + ' fade',
        { x1: 90, y1: y, x2: 360, y2: y }, delay));
      if (ax != null) frag.appendChild(node('text', 'ax f-' + c + ' fade',
        { x: 80, y: y + 4, 'text-anchor': 'end' }, +(delay + 0.2).toFixed(2), ax));
      if (cap != null) frag.appendChild(node('text', 'cap f-' + c + ' fade',
        { x: 366, y: y + 4 }, +(delay + 0.3).toFixed(2), cap));
    });
    svg.insertBefore(frag, svg.firstChild);
  });
  clampChartText();
  // Font metrics change once the webfonts land — measure again.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(clampChartText);
}

/* Fit-guard: squeeze any chart text that would run past the viewBox edge
   (right-side captions get ~98 units, left axis labels ~76; keep decks'
   text short — this only rescues modest overflows). */
function clampChartText() {
  document.querySelectorAll('svg[data-lv]').forEach(svg => {
    const vbw = (svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.width) || 470;
    svg.querySelectorAll('text.cap, text.ax').forEach(t => {
      const x = +t.getAttribute('x') || 0;
      const anchor = t.getAttribute('text-anchor');
      const room = anchor === 'middle' ? Math.min(x, vbw - x) * 2 - 8
                 : anchor === 'end' ? x - 8 : vbw - x - 8;
      let len;
      try { len = t.getComputedTextLength(); } catch (e) { return; }
      if (t.hasAttribute('textLength')) return;   // already clamped
      if (len > room && room > 0) {
        t.setAttribute('textLength', room);
        t.setAttribute('lengthAdjust', 'spacingAndGlyphs');
      }
    });
  });
}

/* ── Ladder hydrator ─────────────────────────────────────────────────────────
   Levels ladders are declared as compact JSON instead of hand-written rows:

     <div class="ladder rv" data-rungs='[
       ["res","$390","4h 200-EMA · reclaim = repair"],
       ["now","$320.65","ТУТ · close −4.22%"],
       ["sup","$308","T1"]]'></div>

   Each entry is [kind, price, label] where kind is the rung's class suffix:
   res (resistance, red) · sup (support, green) · now (current, amber) ·
   key (or any deck-specific variant). To change a level, edit the JSON. */
function hydrateLadders() {
  document.querySelectorAll('.ladder[data-rungs]').forEach(el => {
    let spec;
    try { spec = JSON.parse(el.getAttribute('data-rungs')); } catch (e) { return; }
    el.innerHTML = spec.map(r =>
      '<div class="rung ' + r[0] + '"><span class="px">' + r[1] +
      '</span><span class="lbl">' + r[2] + '</span></div>').join('');
  });
}

/* Telegram sign-off appended to the last slide of every deck (opt out with
   cfg.tg = false, or keep a hand-written .tg in the deck to skip injection). */
const TG_HTML =
  '<p class="tg rv">Щоденні розбори — у телеграмі:<br>' +
  '<a href="https://t.me/market_predictions" target="_blank" rel="noopener">t.me/market_predictions</a></p>' +
  '<p class="disclaim rv">Не є інвестиційною рекомендацією. Освітній контент — рішення та ризики ваші.</p>';

/* Footer nav markup shared by every deck (label/counter filled by createStory). */
const NAV_HTML =
  '<div class="nav">' +
    '<div class="nav-l">' +
      '<button id="btn-back" aria-label="Попередній слайд">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>' +
      '</button>' +
      '<span class="foot-tag" id="foot-tag"></span>' +
    '</div>' +
    '<div class="nav-r">' +
      '<span class="count"><b id="cur">1</b> / <span id="tot"></span></span>' +
      '<button id="btn-next" aria-label="Наступний слайд">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>' +
      '</button>' +
    '</div>' +
  '</div>';

function createStory(cfg) {
  cfg = Object.assign({
    stage: '.stage', deck: '#deck', fit: true, tap: true, swipe: '#deck',
    prev: '#btn-back', next: '#btn-next', counter: '#cur', total: '#tot',
    label: '#foot-tag',
  }, cfg || {});
  hydrateLevelCharts();
  hydrateLadders();
  // Tile thumbnails load the story with ?preview — freeze on the cover.
  const isPreview = /[?&]preview\b/.test(location.search);
  if (isPreview && document.body) document.body.classList.add('preview');

  const $ = s => (s ? document.querySelector(s) : null);
  const stage = $(cfg.stage);
  const deckEl = cfg.deck ? $(cfg.deck) : stage;
  if (!deckEl) return { show() {}, next() {}, prev() {} };

  // Build the shared chrome unless the deck ships its own: brand watermark,
  // footer nav, and the telegram sign-off on the last slide.
  if (stage && !stage.querySelector('.story-brand')) {
    stage.insertAdjacentHTML('afterbegin',
      '<div class="story-brand" aria-hidden="true">Is it a BUY?</div>');
  }
  if (stage && !stage.querySelector('.nav')) {
    stage.insertAdjacentHTML('beforeend', NAV_HTML);
  }

  const slides = Array.from(deckEl.querySelectorAll(cfg.slideSel || '.slide'));
  if (cfg.tg !== false && slides.length && !deckEl.querySelector('.tg')) {
    slides[slides.length - 1].insertAdjacentHTML('beforeend', TG_HTML);
  }
  const total = slides.length;
  let idx = 0;

  // When fitting, wrap each slide's content so it can be scaled as a unit.
  if (cfg.fit) {
    slides.forEach(s => {
      if (s.querySelector(':scope > .slide-inner')) return;
      const inner = document.createElement('div');
      inner.className = 'slide-inner';
      while (s.firstChild) inner.appendChild(s.firstChild);
      s.appendChild(inner);
    });
  }

  // Progress segments
  let segs = [];
  const progEl = $(cfg.progress);
  if (progEl) {
    for (let k = 0; k < total; k++) {
      const seg = document.createElement('div');
      seg.className = 'seg';
      seg.innerHTML = '<i></i>';
      progEl.appendChild(seg);
    }
    segs = Array.from(progEl.children);
  }

  // Tap zones — touch devices only. On desktop the zones would just sit over
  // the copy and steal clicks meant for selecting text, while the wheel, the
  // arrow keys and the footer nav already cover navigation; so they are only
  // built when the PRIMARY pointer is coarse (phones/tablets — touch-screen
  // laptops keep swipe via the deck's touch handlers instead). A slide can
  // opt out of tap-to-navigate with data-noclick (text-only pages the reader
  // should be able to tap without advancing); the zones are muted while such
  // a slide is active — arrows/swipe/wheel/keys still move the deck.
  const touchNav = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  const tapZones = [];
  if (cfg.tap !== false && touchNav && stage) {
    ['left', 'right'].forEach(side => {
      const z = document.createElement('div');
      z.className = 'story-tap ' + side;
      z.addEventListener('click', () => (side === 'left' ? prev() : next()));
      stage.appendChild(z);
      tapZones.push(z);
    });
  }

  // Buttons / readouts
  const btnPrev = $(cfg.prev);
  const btnNext = $(cfg.next);
  if (btnPrev) btnPrev.addEventListener('click', prev);
  if (btnNext) btnNext.addEventListener('click', next);
  const counter = $(cfg.counter);
  const totalEl = $(cfg.total);
  if (totalEl) totalEl.textContent = total;
  const labelEl = $(cfg.label);
  const hintEl = $(cfg.hint);

  function fit(slide) {
    if (!cfg.fit) return;
    const inner = slide.querySelector('.slide-inner');
    if (!inner) return;
    inner.style.transform = 'none';
    inner.style.width = '';
    inner.style.marginLeft = '';
    const avail = slide.clientHeight;
    let need = inner.offsetHeight;
    if (need > avail && need > 0) {
      // Scale down to fit the height — but widen the box by the inverse
      // factor so the scaled slide still fills the stage's full width
      // instead of shrinking into a centered column. Rendered width is
      // width% × scale, so scale must equal 100/width; a slide fits when
      // need(width) ≤ avail × width/100.
      const setW = w => {
        inner.style.width = w + '%';
        inner.style.marginLeft = ((100 - w) / 2) + '%';
        return inner.offsetHeight;
      };
      const fits = w => setW(w) <= avail * w / 100 + 1;
      // Start from the width that fits by construction for pure text; if
      // fixed-height boxes (cqw-sized ladders etc.) keep it overflowing,
      // widen further a few times and accept the best effort.
      let hi = 100 * need / avail;
      for (let g = 0; g < 4 && !fits(hi); g++) hi *= 1.2;
      // Binary-search the narrowest width (= largest scale) that still
      // fits — a single refinement pass leaves slides rendering well short
      // of the page height, wasting readable type size.
      let lo = 100;
      for (let i = 0; i < 6; i++) {
        const mid = (lo + hi) / 2;
        if (fits(mid)) hi = mid; else lo = mid;
      }
      setW(hi);
      // Anchor the scale to the slide's own alignment: a top-aligned slide
      // (ladders, text pages) must shrink toward its top edge — scaling a
      // top-anchored box around its center leaves a dead band above and
      // pushes the copy off the bottom. Centered slides keep the old origin.
      const jc = getComputedStyle(slide).justifyContent;
      inner.style.transformOrigin =
        (jc === 'flex-start' || jc === 'start') ? '50% 0' : '50% 50%';
      inner.style.transform = 'scale(' + (100 / hi).toFixed(4) + ')';
    }
  }
  function fitAll() { slides.forEach(fit); }

  function show(n) {
    idx = Math.max(0, Math.min(total - 1, n));
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    segs.forEach((s, k) => {
      s.classList.toggle('done', k < idx);
      s.classList.toggle('active', k === idx);
    });
    if (counter) counter.textContent = idx + 1;
    if (labelEl) labelEl.textContent = slides[idx].dataset.label || '';
    if (btnPrev) btnPrev.disabled = idx === 0;
    if (btnNext) btnNext.disabled = idx === total - 1;
    if (hintEl) hintEl.style.display = idx === 0 ? '' : 'none';
    const noTap = slides[idx].hasAttribute('data-noclick');
    tapZones.forEach(z => { z.style.pointerEvents = noTap ? 'none' : ''; });
    fit(slides[idx]);
    if (typeof cfg.onShow === 'function') cfg.onShow(idx, total, slides[idx]);
  }
  function next() { show(idx + 1); }
  function prev() { show(idx - 1); }

  // Keyboard
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { prev(); }
  });

  // Ask the host overlay to close the deck (used by the last-slide swipe). No-op
  // when the deck is open standalone rather than inside the gallery's iframe.
  function closeDeck() {
    try {
      if (window.parent && window.parent !== window) {
        // '*' is deliberate: the payload is a harmless close signal, the
        // gallery validates e.source, and origin-matching breaks under
        // file:// (opaque origins) where local preview must still work.
        window.parent.postMessage({ type: 'ib-close' }, '*');
      }
    } catch (e) { /* cross-origin / standalone — nothing to close */ }
  }

  // Swipe — classic left/right navigation between slides. On the last slide any
  // swipe past the threshold closes the deck (like swiping past the end of a
  // story), since there is nothing further to advance to.
  const swipeEl = cfg.swipe ? $(cfg.swipe) : stage;
  if (swipeEl) {
    let sx = null, sy = null;
    swipeEl.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    swipeEl.addEventListener('touchend', e => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      const adx = Math.abs(dx), ady = Math.abs(dy);
      if (Math.max(adx, ady) > 50) {
        if (idx === total - 1) closeDeck();
        else if (adx > ady * 1.3) { dx < 0 ? next() : prev(); }
      }
      sx = sy = null;
    }, { passive: true });
  }

  // Wheel (desktop): advance one slide per scroll gesture. A single lock that
  // re-arms only after the wheel goes idle (~220ms) means one flick of a
  // trackpad — which emits a long momentum stream — moves exactly one slide,
  // while discrete mouse-wheel notches each step once. Vertical or horizontal.
  const wheelEl = (cfg.tap !== false && stage) ? stage : (swipeEl || stage);
  if (wheelEl) {
    let wheelLock = false, wheelTimer = null;
    wheelEl.addEventListener('wheel', e => {
      const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      if (Math.abs(d) < 6) return;         // ignore idle / sub-pixel jitter
      e.preventDefault();                  // the deck fits the viewport — never scrolls
      clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => { wheelLock = false; }, 220);
      if (wheelLock) return;
      wheelLock = true;
      // Scrolling forward on the last slide closes the deck — the same
      // contract as the last-slide swipe: there is nothing left to advance
      // to, so the gesture means "I'm done".
      if (d > 0 && idx === total - 1) closeDeck();
      else if (d > 0) next();
      else prev();
    }, { passive: false });
  }

  window.addEventListener('resize', fitAll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);

  show(0);
  return { show, next, prev };
}
window.createStory = createStory;
