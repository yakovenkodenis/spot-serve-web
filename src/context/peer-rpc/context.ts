import { createContext } from 'react';
import { PeerRPC, rpcMethods } from '@/services/peer-rpc';

interface PeerRpcContextValue {
  rpc: PeerRPC | null;
  peerId: string | null;
  connected: boolean;
  remotePeerId: string | null;
  rpcMethods: typeof rpcMethods;
}

export const PeerRpcContext = createContext<PeerRpcContextValue>({
  rpc: null,
  peerId: null,
  connected: false,
  remotePeerId: null,
  rpcMethods,
});
