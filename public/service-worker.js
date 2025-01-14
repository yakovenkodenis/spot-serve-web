let fileBlobURLs = {};

self.addEventListener('message', (event) => {
  if (event.data.type === 'UPDATE_FILE_BLOBS') {
    fileBlobURLs = event.data.fileBlobURLs; // Update the fileBlobURLs in the service worker

    console.log({ fileBlobURLs });
  }
});

self.addEventListener('install', (event) => {
  console.log('install event', event);
  self.skipWaiting();
  event.waitUntil(
    caches.open('files-cache').then((cache) => {
      // Cache all files upon install
      console.log('files-cache', { fileBlobURLs });
      return cache.addAll(Object.values(fileBlobURLs));
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('fetch event', event);
  const url = new URL(event.request.url);
  const filePath = url.pathname;

  if (fileBlobURLs[filePath]) {
    // Serve from Blob URL if available
    event.respondWith(fetch(fileBlobURLs[filePath]));
  } else {
    // Fallback to cache if not in Blob URLs
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request); // Return cached or fetch new
      })
    );
  }
});
