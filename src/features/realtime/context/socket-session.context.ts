import { createContext } from 'react';
import type { Socket } from 'socket.io-client';

export type SocketConnectionStatus = 'idle' | 'connecting' | 'connected' | 'reconnecting';

export interface SocketSession {
  socket: Socket | null;
  status: SocketConnectionStatus;
}

export const SocketSessionContext = createContext<SocketSession>({ socket: null, status: 'idle' });
