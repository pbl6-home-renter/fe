import type { ParseKeys, TFunction } from 'i18next';
import { ROUTES } from '@/config/routes.config';
import type { Role } from '@/types/role';

type NotificationData = Record<string, unknown>;
type NotificationI18nKey = ParseKeys<'notifications'>;

export interface RenderableNotification {
  title: string;
  body: string;
  deepLink: string | null;
  data: NotificationData | null;
}

interface NotificationDefinition {
  titleKey: NotificationI18nKey;
  bodyKey: NotificationI18nKey;
  /** Extra interpolation values; string/number fields of `data` are always passed through. */
  params?: (data: NotificationData, t: TFunction<'notifications'>) => Record<string, string>;
  /** Page to open on click, resolved from `data` so the backend does not need to know web routes. */
  route?: (data: NotificationData, role: Role | null) => string | null;
}

const readString = (data: NotificationData, key: string) => {
  const value = data[key];
  return typeof value === 'string' && value.trim() ? value.trim() : null;
};

const issueRoute = (data: NotificationData) => {
  const issueId = readString(data, 'issueId');
  return issueId ? ROUTES.ISSUE_DETAIL(issueId) : null;
};

const matchRequestRoute = (data: NotificationData) => {
  const matchRequestId = readString(data, 'matchRequestId');
  return matchRequestId ? `${ROUTES.ROOMMATES}?matchRequestId=${encodeURIComponent(matchRequestId)}` : ROUTES.ROOMMATES;
};

const matchRequestParams = (data: NotificationData, t: TFunction<'notifications'>) => ({
  actorName: readString(data, 'actorDisplayName') ?? t('matchRequestEvents.unknownActor'),
});

/**
 * One entry per `data.messageKey` (see community-service `docs/notifications.md`).
 * Adding a notification = add an entry here + its `vi`/`en` keys in `notifications.json`.
 */
export const NOTIFICATION_REGISTRY: Record<string, NotificationDefinition> = {
  'issue.created': {
    titleKey: 'issueEvents.created.title',
    bodyKey: 'issueEvents.created.body',
    route: issueRoute,
  },
  'issue.updated': {
    titleKey: 'issueEvents.updated.title',
    bodyKey: 'issueEvents.updated.body',
    route: issueRoute,
  },
  'issue.cancelled': {
    titleKey: 'issueEvents.cancelled.title',
    bodyKey: 'issueEvents.cancelled.body',
    route: issueRoute,
  },
  'match_request.created': {
    titleKey: 'matchRequestEvents.created.title',
    bodyKey: 'matchRequestEvents.created.body',
    params: matchRequestParams,
    route: matchRequestRoute,
  },
  'match_request.accepted': {
    titleKey: 'matchRequestEvents.accepted.title',
    bodyKey: 'matchRequestEvents.accepted.body',
    params: matchRequestParams,
    route: matchRequestRoute,
  },
  'match_request.rejected': {
    titleKey: 'matchRequestEvents.rejected.title',
    bodyKey: 'matchRequestEvents.rejected.body',
    params: matchRequestParams,
    route: matchRequestRoute,
  },
  'match_request.withdrawn': {
    titleKey: 'matchRequestEvents.withdrawn.title',
    bodyKey: 'matchRequestEvents.withdrawn.body',
    params: matchRequestParams,
    route: matchRequestRoute,
  },
};

const resolveDefinition = (notification: RenderableNotification) => {
  const data = notification.data ?? {};
  const messageKey = readString(data, 'messageKey');
  return messageKey ? NOTIFICATION_REGISTRY[messageKey] : undefined;
};

const toInterpolationValues = (data: NotificationData) =>
  Object.fromEntries(
    Object.entries(data).flatMap(([key, value]) =>
      typeof value === 'string' || typeof value === 'number' ? [[key, String(value)]] : [],
    ),
  );

/** Translated title/body; falls back to the server text for unknown notifications. */
export const getNotificationContent = (notification: RenderableNotification, t: TFunction<'notifications'>) => {
  const definition = resolveDefinition(notification);
  if (!definition) return { title: notification.title, body: notification.body };
  const data = notification.data ?? {};
  const values = { ...toInterpolationValues(data), ...definition.params?.(data, t) };
  // Keys are type-checked in the registry; i18next cannot type interpolation over a union of keys.
  const translate = t as unknown as (key: NotificationI18nKey, options: Record<string, string>) => string;
  return { title: translate(definition.titleKey, values), body: translate(definition.bodyKey, values) };
};

const toSameOriginPath = (deepLink: string | null) => {
  if (!deepLink) return null;
  try {
    const url = new URL(deepLink, window.location.origin);
    return url.origin === window.location.origin ? `${url.pathname}${url.search}${url.hash}` : null;
  } catch {
    return null;
  }
};

/** Page to open for a notification: registry route → same-origin `deepLink` → `null` (stay). */
export const getNotificationDestination = (notification: RenderableNotification, role: Role | null) =>
  resolveDefinition(notification)?.route?.(notification.data ?? {}, role) ?? toSameOriginPath(notification.deepLink);
