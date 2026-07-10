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
}

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
  // Tile thumbnails load the story with ?preview — freeze on the cover.
  const isPreview = /[?&]preview\b/.test(location.search);
  if (isPreview && document.body) document.body.classList.add('preview');

  const $ = s => (s ? document.querySelector(s) : null);
  const stage = $(cfg.stage);
  const deckEl = cfg.deck ? $(cfg.deck) : stage;
  if (!deckEl) return { show() {}, next() {}, prev() {} };

  // Build the shared footer nav unless the deck ships its own.
  if (stage && !stage.querySelector('.nav')) {
    stage.insertAdjacentHTML('beforeend', NAV_HTML);
  }

  const slides = Array.from(deckEl.querySelectorAll(cfg.slideSel || '.slide'));
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

  // Tap zones
  if (cfg.tap !== false && stage) {
    ['left', 'right'].forEach(side => {
      const z = document.createElement('div');
      z.className = 'story-tap ' + side;
      z.addEventListener('click', () => (side === 'left' ? prev() : next()));
      stage.appendChild(z);
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
    const avail = slide.clientHeight;
    const need = inner.offsetHeight;
    if (need > avail && need > 0) {
      inner.style.transform = 'scale(' + (avail / need).toFixed(4) + ')';
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

  // Swipe
  const swipeEl = cfg.swipe ? $(cfg.swipe) : stage;
  if (swipeEl) {
    let sx = null, sy = null;
    swipeEl.addEventListener('touchstart', e => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
    swipeEl.addEventListener('touchend', e => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      const dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.3) { dx < 0 ? next() : prev(); }
      sx = sy = null;
    }, { passive: true });
  }

  window.addEventListener('resize', fitAll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);

  show(0);
  return { show, next, prev };
}
window.createStory = createStory;
