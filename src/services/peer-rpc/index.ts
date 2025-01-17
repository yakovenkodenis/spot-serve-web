/* eslint-disable @typescript-eslint/no-explicit-any */
import Peer from 'peerjs';

export { handlers } from './handlers';

type HandlerFunction = (params: any) => Promise<any>;

export interface RequestMessage<T = any> {
  id: string;
  method: string;
  peerId?: string;
  params?: T;
}

export interface ResponseMessage {
  id: string;
  result?: any;
  error?: string;
}

interface PeerRPCOptions {
  timeoutMs: number;
}

export class PeerRPC {
  private peer: Peer;
  private remotePeerId: string;
  private handlers: Map<string, HandlerFunction> = new Map();
  private defaultTimeout: number;

  constructor(remotePeerId: string, options?: PeerRPCOptions) {
    this.peer = new Peer();
    this.remotePeerId = remotePeerId;

    const { timeoutMs = 10_000 } = options ?? {};
    this.defaultTimeout = timeoutMs;

    this.peer.on('connection', (conn) => {
      // @ts-expect-error type is fine
      conn.on('data', async (message: RequestMessage) => {
        if (message.method && message.id) {
          const handler = this.handlers.get(message.method);
          try {
            const result = handler
              ? await handler(message.params)
              : Promise.reject(`No handler registered for method: ${message.method}`);
            const response: ResponseMessage = { id: message.id, result };
            conn.send(response);
          } catch (error) {
            const response: ResponseMessage = { id: message.id, error: (error as Error).message || String(error) };
            conn.send(response);
          }
        }
      });
    });
  }

  async request<T>(method: string, params?: any): Promise<T> {
    const myPeerId = await new Promise<string>((resolve) => {
      this.peer.on('open', resolve);
    });

    const conn = this.peer.connect(this.remotePeerId, { reliable: true });

    return new Promise<T>((resolve, reject) => {
      const requestId = this.generateId();

      const timeout = setTimeout(() => {
        reject(new Error('Request timed out'));
        conn.close();
      }, this.defaultTimeout);

      conn.on('open', () => {
        const message: RequestMessage = { id: requestId, method, peerId: myPeerId, params };
        conn.send(message);
      });

      // @ts-expect-error type is fine
      conn.on('data', (response: ResponseMessage) => {
        if (response.id === requestId) {
          clearTimeout(timeout);
          conn.close();
          if (response.error) reject(new Error(response.error));
          else resolve(response.result);
        }
      });

      conn.on('error', (error) => {
        clearTimeout(timeout);
        reject(new Error(`Connection error: ${error.message || error}`));
        conn.close();
      });
    });
  }

  registerHandler(method: string, handler: HandlerFunction) {
    this.handlers.set(method, handler);
  }

  destroy() {
    this.peer.destroy();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 16);
  }
}
