const CACHE_NAME = 'website-cache';

let originalApiPort;

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
  // Ignore non-GET requests or requests outside the cached scope
  if (event.request.method !== 'GET') return;
  console.group('Intercepted url');

  const url = new URL(event.request.url);
  console.log(url, { apiHostname: url.hostname, apiPort: String(url.port) === String(originalApiPort) });

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          console.log(`Serving from cache: ${url.pathname}`);
          return cachedResponse;
        }

        return fetch(event.request).then((networkResponse) => {
          return networkResponse;
        });
      })
    )
  );

  console.groupEnd();
});
