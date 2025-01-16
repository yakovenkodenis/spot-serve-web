const CACHE_NAME = 'website-cache';

self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  // Force the waiting service worker to become the active one
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignore non-GET requests or requests outside the cached scope
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log(`Serving from cache: ${url.pathname}`);
          return cachedResponse;
        }
        console.log(`Fetching from network: ${url.pathname}`);
        return fetch(event.request).then((networkResponse) => {
          return networkResponse;
        });
      })
    )
  );
});
