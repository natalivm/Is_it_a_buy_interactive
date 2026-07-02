'use strict';
/* ══════════════════════════════════════════════════════════════════════════
   Shared story engine. One state machine drives every deck; each deck keeps
   its own chrome and calls createStory() with the pieces it uses.

   createStory({
     stage:   selector of the framing element (tap zones append here)  [required]
     deck:    selector holding the .slide elements (defaults to stage)
     slideSel:slide selector (default '.slide')
     progress:selector of a container to fill with .seg segments (optional)
     tap:     add left/right tap zones? (default true)
     swipe:   selector to bind touch-swipe on (defaults to stage)
     prev/next: selectors of nav buttons (optional)
     counter: selector showing the current index (optional)
     total:   selector showing the slide count (optional)
     label:   selector updated from each slide's data-label (optional)
     hint:    selector of a first-slide hint to hide after advancing (optional)
     fit:     scale each slide's .slide-inner to fit its height? (default false)
     onShow:  callback(idx, total, slide) after each transition (optional)
   })
   Returns { show, next, prev }.
   ══════════════════════════════════════════════════════════════════════════ */
function createStory(cfg) {
  // Tile thumbnails load the story with ?preview — freeze on the cover.
  const isPreview = /[?&]preview\b/.test(location.search);
  if (isPreview && document.body) document.body.classList.add('preview');

  const $ = s => (s ? document.querySelector(s) : null);
  const stage = $(cfg.stage);
  const deckEl = cfg.deck ? $(cfg.deck) : stage;
  if (!deckEl) return { show() {}, next() {}, prev() {} };

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
