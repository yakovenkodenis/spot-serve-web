declare const self: ServiceWorkerGlobalScope;

interface ProxyMessage {
  type: 'PROXY_RESPONSE';
  requestId: string;
  response: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: string;
  };
}

// Store pending requests
const pendingRequests = new Map<string, (response: Response) => void>();

// Listen for fetch events
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // Skip requests to service worker
  if (request.url.includes('proxy-worker.js')) {
    return;
  }

  event.respondWith(
    (async () => {
      // Generate unique request ID
      const requestId = Math.random().toString(36).substring(2);

      try {
        // Serialize request data
        const serializedRequest = {
          url: request.url,
          method: request.method,
          headers: Object.fromEntries(request.headers.entries()),
          body: request.method !== 'GET' ? await request.text() : undefined
        };

        // Create promise for response
        const responsePromise = new Promise<Response>((resolve) => {
          pendingRequests.set(requestId, resolve);
        });

        // Send request to client
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'PROXY_REQUEST',
              requestId,
              request: serializedRequest
            });
          });
        });

        // Wait for response with timeout
        const timeoutPromise = new Promise<Response>((_, reject) => {
          setTimeout(() => {
            pendingRequests.delete(requestId);
            reject(new Error('Request timeout'));
          }, 30000);
        });

        return await Promise.race([responsePromise, timeoutPromise]);
      } catch (error) {
        return new Response(`Proxy error: ${(error as Error).message}`, { status: 502 });
      }
    })()
  );
});

// Handle response from client
self.addEventListener('message', (event) => {
  const message = event.data as ProxyMessage;
  
  if (message.type === 'PROXY_RESPONSE') {
    const resolver = pendingRequests.get(message.requestId);
    if (resolver) {
      pendingRequests.delete(message.requestId);
      resolver(
        new Response(message.response.body, {
          status: message.response.status,
          statusText: message.response.statusText,
          headers: new Headers(message.response.headers)
        })
      );
    }
  }
});
