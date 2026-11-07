import { useQuery } from '@tanstack/react-query';
import type { QueryHookOptions } from '@/lib/query/types';
import { notificationApi } from '../api/notification.api';
import { NOTIFICATION_PREFERENCES_QUERY_KEY } from '../constants/notification.constants';
import type { NotificationPreferences } from '../types/notification.dto';

export const useNotificationPreferencesQuery = (options?: QueryHookOptions<NotificationPreferences[]>) =>
  useQuery({
    queryKey: NOTIFICATION_PREFERENCES_QUERY_KEY,
    queryFn: ({ signal }) => notificationApi.getPreferences({ signal, skipErrorToast: true }),
    staleTime: 30_000,
    ...options,
  });
