/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect } from 'react';
import { PeerRpcContext } from './context';

export function usePeerRpc() {
  const context = useContext(PeerRpcContext);
  
  if (!context) {
    throw new Error('usePeerRpc must be used within a PeerRpcProvider');
  }

  return context;
}

export function usePeerRpcConnection() {
  const { connected, peerId } = usePeerRpc();
  return { connected, peerId };
}

export function usePeerRpcHandler<T = any, R = any>(
  method: string,
  handler: (params: T) => Promise<R>
) {
  const { rpc } = usePeerRpc();

  useEffect(() => {
    if (!rpc) return;
    
    const removeHandler = rpc.handle(method, handler);

    return () => {
      removeHandler();
    };
  }, [rpc, method, handler]);
}

