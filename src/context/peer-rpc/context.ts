import { createContext } from 'react';
import { PeerRPC } from '@/services/peer-rpc';

interface PeerRpcContextValue {
  rpc: PeerRPC | null;
  peerId: string | null;
  connected: boolean;
  remotePeerId: string | null;
}

export const PeerRpcContext = createContext<PeerRpcContextValue>({
  rpc: null,
  peerId: null,
  connected: false,
  remotePeerId: null
});
