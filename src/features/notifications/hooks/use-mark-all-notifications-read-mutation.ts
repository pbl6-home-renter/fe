import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { notificationApi } from '../api/notification.api';
import { NOTIFICATION_QUERY_KEYS } from '../constants/notification.constants';

export const useMarkAllNotificationsReadMutation = (options?: MutationHookOptions<{ markedCount: number }, void>) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.markAllRead,
    ...options,
    onSuccess: async (...args) => {
      await client.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
      return options?.onSuccess?.(...args);
    },
  });
};
