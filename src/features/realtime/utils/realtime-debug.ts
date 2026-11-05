const socketDebugEnabled = import.meta.env.DEV || import.meta.env.VITE_SOCKET_DEBUG === 'true';

export const logRealtimeDebug = (
  level: 'info' | 'warn',
  event: string,
  metadata?: Record<string, string | number | boolean | null>,
) => {
  if (!socketDebugEnabled) return;
  const logger = level === 'warn' ? console.warn : console.info;
  logger(`[community-realtime] ${event}`, metadata ?? {});
};
