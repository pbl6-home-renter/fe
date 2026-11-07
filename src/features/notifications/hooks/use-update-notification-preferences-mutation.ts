import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { notificationApi } from '../api/notification.api';
import { NOTIFICATION_PREFERENCES_QUERY_KEY } from '../constants/notification.constants';
import type { NotificationPreferences } from '../types/notification.dto';

export const useUpdateNotificationPreferencesMutation = (
  options?: MutationHookOptions<{ updatedAt: string }, NotificationPreferences[]>,
) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (preferences) => notificationApi.updatePreferences(preferences),
    ...options,
    onSuccess: async (_result, preferences, ...args) => {
      client.setQueryData(NOTIFICATION_PREFERENCES_QUERY_KEY, preferences);
      await client.invalidateQueries({ queryKey: NOTIFICATION_PREFERENCES_QUERY_KEY });
      return options?.onSuccess?.(_result, preferences, ...args);
    },
  });
};
