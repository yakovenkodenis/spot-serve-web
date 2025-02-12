const CACHE_NAME = 'website-cache';

const localHostnames = ['127.0.0.1', '0.0.0.0', 'localhost'];
let originalApiPort;

/** @type {URL} */
let replacementApiUrl;

self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  // Force the waiting service worker to become the active one
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  const { type } = event.data ?? {};

  if (type === 'BACKEND') {
    console.log('Received api setup from gui:', event.data);
    const { port, tunnel } = event.data;
    originalApiPort = String(port);
    replacementApiUrl = new URL(tunnel);
  }
});

self.addEventListener('fetch', (event) => {
  console.group('Intercepted url');

  const url = new URL(event.request.url);
  console.log(url, { apiHostname: url.hostname, apiPort: String(url.port) === String(originalApiPort) });

  // if this is an api request
  if (localHostnames.includes(url.hostname) && String(url.port) === String(originalApiPort)) {
    console.log('api request', url)
    const newUrl = new URL(event.request.url);
    newUrl.hostname = replacementApiUrl.hostname;
    newUrl.port = replacementApiUrl.port;
    newUrl.protocol = replacementApiUrl.protocol;

    const modifiedHeaders = new Headers(event.request.headers);
    modifiedHeaders.set('bypass-tunnel-reminder', 'true');

    const requestInit = {
      duplex: 'half',
      method: event.request.method,
      headers: modifiedHeaders,
      mode: event.request.mode,
      credentials: event.request.credentials,
      redirect: event.request.redirect,
      referrer: event.request.referrer,
      body: (event.request.method === 'GET' || event.request.method === 'HEAD')
        ? undefined
        : event.request.clone().body,
    };

    const modifiedRequest = new Request(newUrl.toString(), requestInit);

    console.log('Modified request:', modifiedRequest);
    console.log('Modified request headers:', modifiedRequest.headers);

    event.respondWith(fetch(modifiedRequest));
    return;
  }

  console.groupEnd();

  // Ignore non-GET requests or requests outside the cached scope
  if (event.request.method !== 'GET') return;

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
});
