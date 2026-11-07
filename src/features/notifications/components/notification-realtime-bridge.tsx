import { createElement, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '@/features/realtime/hooks/use-socket';
import { useNotify } from '@/lib/notifications/use-notify';
import { NOTIFICATION_QUERY_KEY, NOTIFICATION_SOCKET_EVENTS } from '../constants/notification.constants';
import { useNotificationPreferencesQuery } from '../hooks/use-notification-preferences-query';
import { useMarkNotificationReadMutation } from '../hooks/use-mark-notification-read-mutation';
import { BusinessNotificationToast } from './business-notification-toast';
import { isNotificationCreatedEvent } from '../utils/notification-event.guard';
import { ROUTES } from '@/config/routes.config';

export const NotificationRealtimeBridge = () => {
  const { socket } = useSocket();
  const client = useQueryClient();
  const navigate = useNavigate();
  const notify = useNotify();
  const preferences = useNotificationPreferencesQuery();
  const { mutate: markRead } = useMarkNotificationReadMutation();
  const seenIds = useRef(new Set<string>());
  const enabledCategories = useMemo(
    () => new Set(preferences.data?.filter((item) => item.pushEnabled).map((item) => item.type) ?? []),
    [preferences.data],
  );

  useEffect(() => {
    if (!socket) return;
    const sync = () => void client.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEY });
    const onCreated = (payload: unknown) => {
      sync();
      if (!isNotificationCreatedEvent(payload) || seenIds.current.has(payload.notificationId)) return;
      seenIds.current.add(payload.notificationId);
      if (seenIds.current.size > 500) {
        const oldestId = seenIds.current.values().next().value;
        if (oldestId) seenIds.current.delete(oldestId);
      }
      if (!enabledCategories.has(payload.type) || document.visibilityState !== 'visible') return;

      let destination: string = ROUTES.NOTIFICATIONS;
      if (payload.deepLink) {
        try {
          const url = new URL(payload.deepLink, window.location.origin);
          if (url.origin === window.location.origin) {
            destination = `${url.pathname}${url.search}${url.hash}`;
          }
        } catch {
          // Invalid deep links fall back to the notification inbox.
        }
      }
      notify.custom(
        () =>
          createElement(BusinessNotificationToast, {
            category: payload.type,
            title: payload.title,
            body: payload.body,
          }),
        {
          duration: 6000,
          onClick: () => {
            markRead(payload.notificationId);
            navigate(destination);
          },
        },
      );
    };
    socket.on(NOTIFICATION_SOCKET_EVENTS.CREATED, onCreated);
    socket.on(NOTIFICATION_SOCKET_EVENTS.READ_STATE_UPDATED, sync);
    return () => {
      socket.off(NOTIFICATION_SOCKET_EVENTS.CREATED, onCreated);
      socket.off(NOTIFICATION_SOCKET_EVENTS.READ_STATE_UPDATED, sync);
    };
  }, [client, enabledCategories, markRead, navigate, notify, socket]);

  return null;
};
