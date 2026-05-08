const CACHE_NAME = 'swingtrader-v14';
const BASE = self.registration.scope;
const ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'styles.css',
  BASE + 'data.js',
  BASE + 'prices.js',
  BASE + 'script.js',
  BASE + 'manifest.json',
  BASE + 'icon-192.png',
  BASE + 'icon-512.png',
  BASE + 'icon-192.svg',
  BASE + 'icon-512.svg',
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
      // a precached asset and no longer matches a same-origin URL we'd
      // serve. Anything we still need will be re-fetched and re-cached on
      // first request.
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
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Network-first: always fetch fresh from network, update cache, fall back to
  // cache only when offline so deployed changes are visible immediately.
  event.respondWith(
    fetch(event.request).then(response => {
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }
      const clone = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
      return response;
    }).catch(() =>
      caches.match(event.request).then(cached =>
        cached ||
        new Response('You are offline. Please reconnect to use SwingTrader 2026.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' },
        })
      )
    )
  );
});
