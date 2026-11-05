import { useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { SOCKET_PATH } from '@/config/routes.config';
import { API_BASE_URL } from '@/lib/api/client';
import { refreshSession } from '@/lib/api/refresh-token';
import { useAuthStore } from '@/stores/auth-store';
import { UserStatus } from '@/types/user';
import type { SocketConnectionStatus, SocketSession } from '../context/socket-session.context';
import { REALTIME_SOCKET_EVENTS } from '../constants/realtime.constants';
import { logRealtimeDebug } from '../utils/realtime-debug';

const REFRESH_BEFORE_EXPIRY_MS = 60_000;
const REFRESH_RETRY_INITIAL_MS = 5_000;
const REFRESH_RETRY_MAX_MS = 30_000;

const tokenExpiresAt = (token: string): number | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded: unknown = JSON.parse(atob(base64));
    if (!decoded || typeof decoded !== 'object' || !('exp' in decoded)) return null;
    return typeof decoded.exp === 'number' ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
};

export const useSocketSession = (): SocketSession => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const userId = useAuthStore((state) => state.user?.id);
  const userStatus = useAuthStore((state) => state.user?.status);
  const [session, setSession] = useState<{ token: string; socket: Socket } | null>(null);
  const [statusSession, setStatusSession] = useState<{ token: string; status: SocketConnectionStatus } | null>(null);

  useEffect(() => {
    if (!accessToken || !userId || userStatus !== UserStatus.ACTIVE) {
      return;
    }

    const expiresAt = tokenExpiresAt(accessToken);
    const gatewayOrigin = new URL(API_BASE_URL, window.location.origin).origin;
    const connection = io(gatewayOrigin, {
      path: SOCKET_PATH,
      transports: ['websocket'],
      autoConnect: false,
      auth: { token: accessToken },
    });
    logRealtimeDebug('info', 'connecting', { origin: gatewayOrigin, path: SOCKET_PATH, transport: 'websocket' });
    connection.on('connect', () => {
      logRealtimeDebug('info', 'connected', { socketId: connection.id ?? null });
      setStatusSession({ token: accessToken, status: 'connected' });
    });
    connection.on('disconnect', (reason) => {
      logRealtimeDebug('warn', 'disconnected', { reason });
      setStatusSession({ token: accessToken, status: 'reconnecting' });
    });
    connection.io.on('reconnect_attempt', (attempt) => {
      logRealtimeDebug('info', 'reconnect_attempt', { attempt });
      setStatusSession({ token: accessToken, status: 'reconnecting' });
    });
    connection.on('connect_error', (error) => {
      logRealtimeDebug('warn', 'connect_error', { message: error.message });
      setStatusSession({ token: accessToken, status: 'reconnecting' });
    });
    connection.on(REALTIME_SOCKET_EVENTS.SESSION_READY, () => {
      logRealtimeDebug('info', 'session_ready');
      setSession({ token: accessToken, socket: connection });
    });
    connection.connect();

    let refreshTimer: number | null = null;
    let retryDelay = REFRESH_RETRY_INITIAL_MS;
    const refreshAccessToken = () => {
      void refreshSession(API_BASE_URL).catch(() => {
        if (useAuthStore.getState().accessToken !== accessToken) return;
        refreshTimer = window.setTimeout(refreshAccessToken, retryDelay);
        retryDelay = Math.min(retryDelay * 2, REFRESH_RETRY_MAX_MS);
      });
    };
    if (expiresAt !== null) {
      refreshTimer = window.setTimeout(
        refreshAccessToken,
        Math.min(Math.max(expiresAt - Date.now() - REFRESH_BEFORE_EXPIRY_MS, 0), 2_147_483_647),
      );
    }

    return () => {
      logRealtimeDebug('info', 'disconnecting');
      if (refreshTimer !== null) window.clearTimeout(refreshTimer);
      connection.disconnect();
    };
  }, [accessToken, userId, userStatus]);

  const socket =
    accessToken && userStatus === UserStatus.ACTIVE && session?.token === accessToken ? session.socket : null;
  const isSessionActive = Boolean(accessToken && userStatus === UserStatus.ACTIVE);
  const status = !isSessionActive ? 'idle' : statusSession?.token === accessToken ? statusSession.status : 'connecting';
  return { socket, status };
};
