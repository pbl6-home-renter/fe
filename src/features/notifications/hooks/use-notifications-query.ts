import { useInfiniteQuery } from '@tanstack/react-query';
import type { InfiniteQueryHookOptions } from '@/lib/query/types';
import { notificationApi, type NotificationCursorPage } from '../api/notification.api';
import { NOTIFICATION_QUERY_KEYS } from '../constants/notification.constants';

export const useNotificationsQuery = (
  unreadOnly = false,
  options?: InfiniteQueryHookOptions<NotificationCursorPage, string | undefined>,
) =>
  useInfiniteQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.list(unreadOnly),
    initialPageParam: undefined as string | undefined,
    queryFn: ({ pageParam, signal }) => notificationApi.list(pageParam, unreadOnly, { signal, skipErrorToast: true }),
    getNextPageParam: (page) => (page.pagination.hasNextPage ? (page.pagination.nextCursor ?? undefined) : undefined),
    ...options,
  });
