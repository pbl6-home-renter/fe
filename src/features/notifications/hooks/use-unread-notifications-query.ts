import { useQuery } from '@tanstack/react-query';
import type { QueryHookOptions } from '@/lib/query/types';
import { useAuthStore } from '@/stores/auth-store';
import { notificationApi, type NotificationCursorPage } from '../api/notification.api';
import { NOTIFICATION_QUERY_KEYS } from '../constants/notification.constants';

export const useUnreadNotificationsQuery = (options?: QueryHookOptions<NotificationCursorPage, boolean>) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuth = isAuthenticated || !!accessToken;

  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.unreadIndicator,
    // A background badge should not interrupt the current screen when it fails.
    queryFn: ({ signal }) => notificationApi.list(undefined, true, { signal, skipErrorToast: true }),
    select: (page) => page.items.length > 0,
    staleTime: 15_000,
    ...options,
    enabled: isAuth && (options?.enabled ?? true),
  });
};
