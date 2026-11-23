import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarkAllNotificationsReadMutation } from './use-mark-all-notifications-read-mutation';
import { useMarkNotificationReadMutation } from './use-mark-notification-read-mutation';
import { useUnreadNotificationsQuery } from './use-unread-notifications-query';
import { useNotificationsQuery } from './use-notifications-query';
import type { NotificationItem } from '../types/notification.dto';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { getNotificationDestination } from '../utils/notification-registry';

export const useNotificationsPage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const query = useNotificationsQuery(unreadOnly);
  const unreadIndicator = useUnreadNotificationsQuery();
  const markRead = useMarkNotificationReadMutation();
  const markAllRead = useMarkAllNotificationsReadMutation();
  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  const handleOpenNotification = (item: NotificationItem) => {
    if (!item.readAt) markRead.mutate(item.id);
    const destination = getNotificationDestination(item, role);
    if (destination) navigate(destination);
  };

  return {
    unreadOnly,
    preferencesOpen,
    items,
    query,
    hasUnread: unreadIndicator.data ?? false,
    isMarkingAllRead: markAllRead.isPending,
    onSetUnreadOnly: setUnreadOnly,
    onOpenPreferences: () => setPreferencesOpen(true),
    onClosePreferences: () => setPreferencesOpen(false),
    onMarkAllRead: () => markAllRead.mutate(),
    onOpenNotification: handleOpenNotification,
  };
};
