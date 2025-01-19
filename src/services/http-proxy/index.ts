import { PeerRPC } from '@/services/peer-rpc';

export class ProxyClient {
  private rpc: PeerRPC;
  private static instance: ProxyClient;

  private constructor(rpc: PeerRPC) {
    this.rpc = rpc;
    this.setupMessageHandler();
  }

  static initialize(rpc: PeerRPC) {
    if (!ProxyClient.instance) {
      ProxyClient.instance = new ProxyClient(rpc);
    }
    return ProxyClient.instance;
  }

  private setupMessageHandler() {
    // Listen for requests from service worker
    navigator.serviceWorker.addEventListener('message', async (event) => {
      if (event.data.type === 'PROXY_REQUEST') {
        const { requestId, request } = event.data;

        try {
          // Forward request through WebRTC
          const response = await this.rpc.request('proxy:http', request);

          // Send response back to service worker
          navigator.serviceWorker.controller?.postMessage({
            type: 'PROXY_RESPONSE',
            requestId,
            response
          });
        } catch (error) {
          // Send error response back to service worker
          navigator.serviceWorker.controller?.postMessage({
            type: 'PROXY_RESPONSE',
            requestId,
            response: {
              status: 502,
              statusText: 'Bad Gateway',
              headers: {},
              body: `Proxy error: ${(error as Error).message}`
            }
          });
        }
      }
    });
  }

  static async register() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/proxy-worker.js');
        await navigator.serviceWorker.ready;
        return registration;
      } catch (error) {
        console.error('Service worker registration failed:', error);
        throw error;
      }
    } else {
      throw new Error('Service workers are not supported');
    }
  }
}

// proxy-server.ts - Server-side request handler
export class ProxyServer {
  private rpc: PeerRPC;

  constructor(rpc: PeerRPC) {
    this.rpc = rpc;
    this.setupHandlers();
  }

  private setupHandlers() {
    // Handle proxied HTTP requests
    this.rpc.handle('proxy:http', async (params) => {
      const { url, method, headers, body } = params;
      
      try {
        const response = await fetch(url, {
          method,
          headers,
          body
        });

        return {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: await response.text()
        };
      } catch (error) {
        throw new Error(`Failed to proxy HTTP request: ${(error as Error).message}`);
      }
    });
  }
}

// Example usage for First App (Client)
// export function setupClientProxy() {
//   const { rpc } = usePeerRpc();
  
//   useEffect(() => {
//     if (!rpc) return;

//     async function initialize() {
//       try {
//         // Register service worker first
//         await ProxyClient.register();
        
//         // Initialize proxy client
//         ProxyClient.initialize(rpc);
//       } catch (error) {
//         console.error('Failed to setup proxy:', error);
//       }
//     }

//     initialize();
//   }, [rpc]);
// }

// Example usage for Second App (Server)
// export function setupServerProxy() {
//   const { rpc } = usePeerRpc();
  
//   useEffect(() => {
//     if (!rpc) return;
    
//     // Initialize proxy server
//     new ProxyServer(rpc);
//   }, [rpc]);
// }
