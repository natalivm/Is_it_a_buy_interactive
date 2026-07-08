const CACHE_NAME = 'isitabuy-v16';
const BASE = self.registration.scope;
const ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'styles.css',
  BASE + 'data.js',
  BASE + 'script.js',
  BASE + 'manifest.json',
  BASE + 'icon-192.png',
  BASE + 'icon-512.png',
  BASE + 'icon-192.svg',
  BASE + 'icon-512.svg',
  BASE + 'stories/story.css',
  BASE + 'stories/engine.js',
  BASE + 'stories/aaoi.html',
  BASE + 'stories/intc.html',
  BASE + 'stories/mu.html',
  BASE + 'stories/wdc.html',
  BASE + 'stories/ter.html',
  BASE + 'stories/nbis.html',
  BASE + 'stories/amat.html',
  BASE + 'stories/asts.html',
  BASE + 'stories/be.html',
  BASE + 'stories/stx.html',
  BASE + 'stories/smh.html',
  BASE + 'stories/sndk.html',
  BASE + 'stories/glw.html',
  BASE + 'stories/articles/ai-dumping.html',
  BASE + 'stories/articles/chinese-models.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.allSettled(ASSETS.map(url => cache.add(url)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      // 1. Drop any cache that isn't the current version.
      const names = await caches.keys();
      await Promise.all(
        names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
      );

      // 2. Prune stale entries from the current cache: anything that isn't
      // a precached asset. Anything we still need will be re-fetched and
      // re-cached on first request.
      const cache = await caches.open(CACHE_NAME);
      const assetSet = new Set(ASSETS);
      const requests = await cache.keys();
      await Promise.all(requests.map(req => {
        if (!assetSet.has(req.url)) return cache.delete(req);
      }));

      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (!req.url.startsWith(self.location.origin)) return;

  // Network-first with `cache: 'no-store'` so we bypass the browser's HTTP
  // cache and always pull the freshly deployed bytes — the network-first
  // policy is worthless if fetch() can still hand back an HTTP-cached copy.
  // The Cache Storage copy is only a fallback for when the network is down.
  event.respondWith(
    fetch(req, { cache: 'no-store' }).then(response => {
      if (response && response.status === 200 && response.type === 'basic') {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
      }
      return response;
    }).catch(async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      // For navigations, fall back to the cached shell so the app still opens.
      if (req.mode === 'navigate') {
        const shell = await caches.match(BASE) || await caches.match(BASE + 'index.html');
        if (shell) return shell;
      }
      return new Response('You are offline. Please reconnect to use the app.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' },
      });
    })
  );
});
