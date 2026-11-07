import { useQuery } from '@tanstack/react-query';
import type { QueryHookOptions } from '@/lib/query/types';
import { notificationApi, type NotificationCursorPage } from '../api/notification.api';
import { NOTIFICATION_QUERY_KEYS } from '../constants/notification.constants';

export const useUnreadNotificationsQuery = (options?: QueryHookOptions<NotificationCursorPage, boolean>) =>
  useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.unreadIndicator,
    queryFn: ({ signal }) => notificationApi.list(undefined, true, { signal, skipErrorToast: true }),
    select: (page) => page.items.length > 0,
    staleTime: 15_000,
    ...options,
  });
