import type { ReactNode } from 'react';
import { useSocketSession } from '../hooks/use-socket-session';
import { SocketSessionContext } from '../context/socket-session.context';

export const SocketSessionProvider = ({ children }: { children: ReactNode }) => {
  const session = useSocketSession();
  return <SocketSessionContext.Provider value={session}>{children}</SocketSessionContext.Provider>;
};
