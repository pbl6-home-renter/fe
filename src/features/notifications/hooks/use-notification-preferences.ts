import { useMemo } from 'react';
import { NOTIFICATION_CATEGORIES } from '../constants/notification.constants';
import { useNotificationPreferencesQuery } from './use-notification-preferences-query';
import { useUpdateNotificationPreferencesMutation } from './use-update-notification-preferences-mutation';
import type { NotificationCategory, NotificationPreferences } from '../types/notification.dto';

export const useNotificationPreferences = (enabled: boolean) => {
  const query = useNotificationPreferencesQuery({ enabled });
  const mutation = useUpdateNotificationPreferencesMutation();
  const values = useMemo(() => {
    const current = new Map(query.data?.map((item) => [item.type, item.pushEnabled]));
    return NOTIFICATION_CATEGORIES.map((type) => ({ type, pushEnabled: current.get(type) ?? true }));
  }, [query.data]);

  const handleToggle = (type: NotificationCategory, pushEnabled: boolean) => {
    const preferences: NotificationPreferences[] = values.map((preference) =>
      preference.type === type ? { ...preference, pushEnabled } : preference,
    );
    mutation.mutate(preferences);
  };

  return {
    values,
    isLoading: query.isLoading,
    isError: query.isError,
    isSaving: mutation.isPending,
    retry: () => void query.refetch(),
    onToggle: handleToggle,
  };
};
