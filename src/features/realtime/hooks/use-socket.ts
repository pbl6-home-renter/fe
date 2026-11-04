import { useContext } from 'react';
import { SocketSessionContext } from '../context/socket-session.context';

export const useSocket = () => useContext(SocketSessionContext);
