import type { TFunction } from 'i18next';

interface NotificationContent {
  title: string;
  body: string;
  data: Record<string, unknown> | null;
}

/** Translate known event keys; retain legacy server text for other notifications. */
export const getNotificationContent = (notification: NotificationContent, t: TFunction<'notifications'>) => {
  switch (notification.data?.messageKey) {
    case 'issue.created':
      return { title: t('issueEvents.created.title'), body: t('issueEvents.created.body') };
    case 'issue.updated':
      return { title: t('issueEvents.updated.title'), body: t('issueEvents.updated.body') };
    case 'issue.cancelled':
      return { title: t('issueEvents.cancelled.title'), body: t('issueEvents.cancelled.body') };
    default:
      return { title: notification.title, body: notification.body };
  }
};
