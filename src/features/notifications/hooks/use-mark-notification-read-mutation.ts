import { useMutation, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { notificationApi, type NotificationCursorPage } from '../api/notification.api';
import { NOTIFICATION_QUERY_KEYS } from '../constants/notification.constants';

export const useMarkNotificationReadMutation = (
  options?: MutationHookOptions<{ id: string; readAt: string }, string>,
) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.markRead,
    ...options,
    onSuccess: async (...args) => {
      const [{ id, readAt }] = args;
      client.setQueriesData<InfiniteData<NotificationCursorPage>>(
        { queryKey: NOTIFICATION_QUERY_KEYS.all },
        (current) => {
          if (!current?.pages) return current;
          return {
            ...current,
            pages: current.pages.map((page) => ({
              ...page,
              items: page.items.map((item) => (item.id === id ? { ...item, readAt } : item)),
            })),
          };
        },
      );
      await client.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
      return options?.onSuccess?.(...args);
    },
  });
};
