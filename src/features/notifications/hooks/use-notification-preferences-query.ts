import { useQuery } from '@tanstack/react-query';
import type { QueryHookOptions } from '@/lib/query/types';
import { useAuthStore } from '@/stores/auth-store';
import { notificationApi } from '../api/notification.api';
import { NOTIFICATION_PREFERENCES_QUERY_KEY } from '../constants/notification.constants';
import type { NotificationPreferences } from '../types/notification.dto';

export const useNotificationPreferencesQuery = (options?: QueryHookOptions<NotificationPreferences[]>) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuth = isAuthenticated || !!accessToken;

  return useQuery({
    queryKey: NOTIFICATION_PREFERENCES_QUERY_KEY,
    queryFn: ({ signal }) => notificationApi.getPreferences({ signal }),
    staleTime: 30_000,
    ...options,
    enabled: isAuth && (options?.enabled ?? true),
  });
};
