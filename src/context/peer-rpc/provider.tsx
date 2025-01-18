// Modules
import { useEffect, useState, useMemo, useRef, type PropsWithChildren } from 'react';

// Context
import { PeerRpcContext } from './context';

// Hooks
import { useQueryParam } from '@/hooks/use-query-param';

// Services
import { PeerRPC } from '@/services/peer-rpc';

interface PeerRpcProviderProps extends PropsWithChildren {
  options?: {
    debug?: boolean;
    timeoutMs?: number;
  };
}

export function PeerRpcContextProvider(props: PeerRpcProviderProps) {
  const { children, options } = props;

  const rpcRef = useRef<PeerRPC | null>(null);
  const [connected, setConnected] = useState(false);
  const [peerId, setPeerId] = useState<string | null>(null);

  const remotePeerId = useQueryParam('r');

  useEffect(() => {
    if (!remotePeerId) return;

    rpcRef.current = new PeerRPC(options);
    
    setPeerId(rpcRef.current.peerId);

    const removeConnectHandler = rpcRef.current.onConnect(() => {
      setConnected(true);
    });

    const removeDisconnectHandler = rpcRef.current.onDisconnect(() => {
      setConnected(false);
    });

    rpcRef.current.connect(remotePeerId).catch(console.error);

    return () => {
      removeConnectHandler();
      removeDisconnectHandler();
      rpcRef.current?.destroy();
      rpcRef.current = null;
      setConnected(false);
      setPeerId(null);
    };
  }, [remotePeerId, options]);

  const value = useMemo(() => ({
    rpc: rpcRef.current,
    peerId,
    connected,
    remotePeerId
  }), [peerId, connected, remotePeerId]);

  return (
    <PeerRpcContext.Provider value={value}>
      {children}
    </PeerRpcContext.Provider>
  )
}
