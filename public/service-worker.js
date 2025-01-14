// // service-worker.js
// const resourceMap = new Map();

// // Listen for the message from the main app to initialize resource mappings
// self.addEventListener('message', (event) => {
//   if (event.data.type === 'INITIALIZE_RESOURCES') {
//     event.data.resources.forEach((resource, path) => {
//       // const blob = new Blob([resource.content], { type: resource.mimeType });
//       // const blobUrl = URL.createObjectURL(blob);
//       resourceMap.set(path, path);
//     });
//   }
// });

// // Intercept all fetch requests
// self.addEventListener('fetch', (event) => {
//   console.log({ resourceMap, event: event.request.url });
//   const url = new URL(event.request.url);
//   const path = url.pathname;

//   if (resourceMap.has(path)) {
//     event.respondWith(fetch(resourceMap.get(path)));
//   }
// });
