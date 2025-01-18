import { createContext, useEffect, useState, useContext, type PropsWithChildren } from 'react';
import { PeerRPC } from '@/services/peer-rpc';

// Hooks
import { useQueryParam } from '@/hooks/use-query-param';

export const PeerContext = createContext<PeerRPC | null>(null);

export function usePeerRpcContext() {
  const peerRpc = useContext(PeerContext);

  if (peerRpc === undefined) {
    throw new Error('`usePeerRpcContext` must be used within PeerRpcContextProvider');
  }

  return peerRpc;
}

export function PeerRpcContextProvider(props: PropsWithChildren) {
  const { children } = props;
  const [peerRpc, setPeerRpc] = useState<PeerRPC | null>(null);

  const remotePeerId = useQueryParam('r');

  useEffect(() => {
    if (!remotePeerId) return;
    const peerRpcClient = new PeerRPC(remotePeerId);
    setPeerRpc(peerRpcClient);

    return () => peerRpcClient.destroy();
  }, [remotePeerId]);

  return (
    <PeerContext.Provider value={peerRpc}>
      {children}
    </PeerContext.Provider>
  )
}
