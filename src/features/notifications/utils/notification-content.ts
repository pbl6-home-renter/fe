import type { TFunction } from 'i18next';

interface NotificationContent {
  title: string;
  body: string;
  data: Record<string, unknown> | null;
}

/** Translate known event keys; retain legacy server text for other notifications. */
export const getNotificationContent = (notification: NotificationContent, t: TFunction<'notifications'>) => {
  const actorName =
    typeof notification.data?.actorDisplayName === 'string' && notification.data.actorDisplayName.trim()
      ? notification.data.actorDisplayName.trim()
      : t('matchRequestEvents.unknownActor');
  switch (notification.data?.messageKey) {
    case 'issue.created':
      return { title: t('issueEvents.created.title'), body: t('issueEvents.created.body') };
    case 'issue.updated':
      return { title: t('issueEvents.updated.title'), body: t('issueEvents.updated.body') };
    case 'issue.cancelled':
      return { title: t('issueEvents.cancelled.title'), body: t('issueEvents.cancelled.body') };
    case 'match_request.created':
      return {
        title: t('matchRequestEvents.created.title'),
        body: t('matchRequestEvents.created.body', { actorName }),
      };
    case 'match_request.accepted':
      return {
        title: t('matchRequestEvents.accepted.title'),
        body: t('matchRequestEvents.accepted.body', { actorName }),
      };
    case 'match_request.rejected':
      return {
        title: t('matchRequestEvents.rejected.title'),
        body: t('matchRequestEvents.rejected.body', { actorName }),
      };
    case 'match_request.withdrawn':
      return {
        title: t('matchRequestEvents.withdrawn.title'),
        body: t('matchRequestEvents.withdrawn.body', { actorName }),
      };
    default:
      return { title: notification.title, body: notification.body };
  }
};
