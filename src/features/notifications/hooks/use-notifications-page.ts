import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMarkAllNotificationsReadMutation } from './use-mark-all-notifications-read-mutation';
import { useMarkNotificationReadMutation } from './use-mark-notification-read-mutation';
import { useUnreadNotificationsQuery } from './use-unread-notifications-query';
import { useNotificationsQuery } from './use-notifications-query';
import type { NotificationItem } from '../types/notification.dto';

export const useNotificationsPage = () => {
  const navigate = useNavigate();
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const query = useNotificationsQuery(unreadOnly);
  const unreadIndicator = useUnreadNotificationsQuery();
  const markRead = useMarkNotificationReadMutation();
  const markAllRead = useMarkAllNotificationsReadMutation();
  const items = query.data?.pages.flatMap((page) => page.items) ?? [];

  const handleOpenNotification = (item: NotificationItem) => {
    if (!item.readAt) markRead.mutate(item.id);
    if (!item.deepLink) return;
    try {
      const url = new URL(item.deepLink, window.location.origin);
      if (url.origin === window.location.origin) navigate(`${url.pathname}${url.search}${url.hash}`);
    } catch {
      // Deep links are supplied by service events; ignore malformed or external URLs.
    }
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
