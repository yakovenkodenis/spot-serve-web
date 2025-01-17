import type { RequestMessage } from '@/services/peer-rpc';

type HandleConnectionData = {
  website: string;
  description?: string;
};

type Callback<T> = (data?: T) => Promise<void>;

export function createConnectionHandler<T extends HandleConnectionData>(callback: Callback<T>) {
  return async function handleConnection(message: RequestMessage<T>) {
    await callback(message.params);
  }
}
