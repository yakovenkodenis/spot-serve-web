/* eslint-disable @typescript-eslint/no-explicit-any */
import Peer, { type DataConnection } from 'peerjs';

export { handlers } from './handlers';
export { rpcMethods } from './methods';

export interface RequestMessage<T = any> {
  id: string;
  method: string;
  params?: T;
}

export interface ResponseMessage {
  id: string;
  result?: any;
  error?: string;
}

export type RPCHandler<T = any, R = any> = (params: T) => Promise<R>;
export type ConnectionHandler = () => void;
export type DisconnectionHandler = () => void;

interface PeerRPCOptions {
  timeoutMs?: number;
  debug?: boolean;
}

interface PendingRequest {
  resolve: (value: any) => void;
  reject: (reason: any) => void;
  timeout: number;
}

export class PeerRPC {
  private peer: Peer;
  private connection: DataConnection | null = null;
  private handlers = new Map<string, RPCHandler>();
  private pendingRequests = new Map<string, PendingRequest>();
  private connectionPromise: Promise<void> | null = null;
  private isInitialized = false;
  private defaultTimeout: number;
  private debug: boolean;
  private onConnectHandlers: Set<ConnectionHandler> = new Set();
  private onDisconnectHandlers: Set<DisconnectionHandler> = new Set();

  constructor(options: PeerRPCOptions = {}) {
    this.defaultTimeout = options.timeoutMs ?? 600_000; // 10 minutes
    this.debug = options.debug ?? false;
    this.peer = new Peer();
    this.setupPeer();
  }

  private log(...args: any[]) {
    if (this.debug) {
      console.log('[PeerRPC]', ...args);
    }
  }

  private setupPeer() {
    this.peer.on('open', (id) => {
      this.log('Peer opened with ID:', id);
      this.isInitialized = true;
    });

    this.peer.on('connection', (conn) => {
      this.log('Incoming connection from:', conn.peer);
      this.handleConnection(conn);
    });

    this.peer.on('error', (error) => {
      this.log('Peer error:', error);
    });
  }

  private handleConnection(conn: DataConnection) {
    this.connection = conn;
    
    conn.on('open', () => {
      this.log('Connection opened');
      this.onConnectHandlers.forEach(handler => handler());
    });

    // @ts-expect-error types are fine.
    conn.on('data', (data: RequestMessage | ResponseMessage) => {
      if (this.isRequest(data)) {
        this.handleRequest(data);
      } else {
        this.handleResponse(data);
      }
    });

    conn.on('close', () => {
      this.log('Connection closed');
      this.connection = null;
      this.onDisconnectHandlers.forEach(handler => handler());
    });

    conn.on('error', (error) => {
      this.log('Connection error:', error);
    });
  }

  private isRequest(message: any): message is RequestMessage {
    return 'method' in message;
  }

  private async handleRequest(request: RequestMessage) {
    const handler = this.handlers.get(request.method);
    
    try {
      const result = handler 
        ? await handler(request.params)
        : Promise.reject(`No handler for method: ${request.method}`);
      
      this.connection?.send({
        id: request.id,
        result
      });
    } catch (error) {
      this.connection?.send({
        id: request.id,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  private handleResponse(response: ResponseMessage) {
    const pending = this.pendingRequests.get(response.id);
    if (pending) {
      clearTimeout(pending.timeout);
      this.pendingRequests.delete(response.id);
      
      if (response.error) {
        pending.reject(new Error(response.error));
      } else {
        pending.resolve(response.result);
      }
    }
  }

  async connect(remotePeerId: string): Promise<void> {
    if (this.connection?.open) {
      return;
    }

    if (!this.connectionPromise) {
      this.connectionPromise = new Promise((resolve, reject) => {
        const connectPeer = () => {
          const conn = this.peer.connect(remotePeerId, { reliable: true });
          this.handleConnection(conn);
          
          conn.on('open', () => {
            resolve();
            this.connectionPromise = null;
          });
          
          conn.on('error', (error) => {
            reject(error);
            this.connectionPromise = null;
          });
        };

        if (this.isInitialized) {
          connectPeer();
        } else {
          this.peer.once('open', connectPeer);
        }
      });
    }

    return this.connectionPromise;
  }

  async request<TResult = any, TParams = any>(method: string, params?: TParams): Promise<TResult> {
    if (!this.connection?.open) {
      throw new Error('No active connection');
    }

    return new Promise<TResult>((resolve, reject) => {
      if (!this.connection) return reject(new Error('No active connection'));

      const id = Math.random().toString(36).substring(2, 15);
      
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error('Request timeout'));
      }, this.defaultTimeout);

      this.pendingRequests.set(id, { resolve, reject, timeout });

      this.connection.send({
        id,
        method,
        params
      });
    });
  }

  onConnect(handler: ConnectionHandler) {
    this.onConnectHandlers.add(handler);
    return () => this.onConnectHandlers.delete(handler);
  }

  onDisconnect(handler: DisconnectionHandler) {
    this.onDisconnectHandlers.add(handler);
    return () => this.onDisconnectHandlers.delete(handler);
  }

  handle<T = any, R = any>(method: string, handler: RPCHandler<T, R>) {
    this.handlers.set(method, handler);
    return () => this.handlers.delete(method);
  }

  get peerId(): string | null {
    return this.peer.id;
  }

  disconnect() {
    this.connection?.close();
  }

  destroy() {
    this.disconnect();
    this.peer.destroy();
  }
}
