import type { ParseKeys, TFunction } from 'i18next';
import { ROUTES } from '@/config/routes.config';
import type { Role } from '@/types/role';
import { Role as UserRole } from '@/types/role';
import { formatDate } from '@/lib/utils/format';

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

const pendingBuildingRoute = (data: NotificationData) => {
  const buildingId = readString(data, 'buildingId');
  return buildingId ? ROUTES.ADMIN.BUILDING_DETAIL(buildingId) : null;
};

const matchRequestRoute = (data: NotificationData) => {
  const matchRequestId = readString(data, 'matchRequestId');
  return matchRequestId ? `${ROUTES.ROOMMATES}?matchRequestId=${encodeURIComponent(matchRequestId)}` : ROUTES.ROOMMATES;
};

const matchRequestParams = (data: NotificationData, t: TFunction<'notifications'>) => ({
  actorName: readString(data, 'actorDisplayName') ?? t('matchRequestEvents.unknownActor'),
});

const contractLockDecisionRoute = (data: NotificationData) => {
  const lockCycleId = readString(data, 'lockCycleId');
  const rawContractIds = data.contractIds;
  const contractIds = Array.isArray(rawContractIds)
    ? rawContractIds.filter((id): id is string => typeof id === 'string').join(',')
    : readString(data, 'contractIds');

  const searchParams = new URLSearchParams();
  if (lockCycleId) searchParams.set('lockCycleId', lockCycleId);
  if (contractIds) searchParams.set('contractIds', contractIds);
  const qs = searchParams.toString();
  return qs ? `${ROUTES.LANDLORD.CONTRACTS}?${qs}` : ROUTES.LANDLORD.CONTRACTS;
};

const contractSingleRoute = (data: NotificationData) => {
  const contractId = readString(data, 'contractId');
  if (contractId) return ROUTES.LANDLORD.CONTRACT_DETAIL(contractId);
  const rawContractIds = data.contractIds;
  if (Array.isArray(rawContractIds) && rawContractIds.length > 0) {
    const firstId = String(rawContractIds[0]);
    if (firstId) return ROUTES.LANDLORD.CONTRACT_DETAIL(firstId);
  }
  return ROUTES.LANDLORD.CONTRACTS;
};

const contractMemberRoute = (data: NotificationData, role: Role | null) => {
  const contractId = readString(data, 'contractId');
  if (!contractId) return null;
  return role === UserRole.TENANT
    ? ROUTES.TENANT.CONTRACT_DETAIL(contractId)
    : ROUTES.LANDLORD.CONTRACT_DETAIL(contractId);
};

const contractMemberParams = (data: NotificationData, t: TFunction<'notifications'>) => ({
  memberName: readString(data, 'memberName') ?? t('contractMemberEvents.unknownMember'),
  roomName: readString(data, 'roomName') ?? t('contractMemberEvents.unknownRoom'),
  buildingName: readString(data, 'buildingName') ?? t('contractMemberEvents.unknownBuilding'),
  leftOn: formatDate(readString(data, 'leftOn')),
});

/**
 * One entry per `data.messageKey` (see community-service `docs/notifications.md`).
 * Adding a notification = add an entry here + its `vi`/`en` keys in `notifications.json`.
 */
export const NOTIFICATION_REGISTRY: Record<string, NotificationDefinition> = {
  'contract.member_added': {
    titleKey: 'contractMemberEvents.added.title',
    bodyKey: 'contractMemberEvents.added.body',
    params: contractMemberParams,
    route: contractMemberRoute,
  },
  'contract.member_linked': {
    titleKey: 'contractMemberEvents.linked.title',
    bodyKey: 'contractMemberEvents.linked.body',
    params: contractMemberParams,
    route: contractMemberRoute,
  },
  'contract.member_left': {
    titleKey: 'contractMemberEvents.left.title',
    bodyKey: 'contractMemberEvents.left.body',
    params: contractMemberParams,
    route: contractMemberRoute,
  },
  'building.pending_review': {
    titleKey: 'buildingEvents.pendingReview.title',
    bodyKey: 'buildingEvents.pendingReview.body',
    route: pendingBuildingRoute,
  },
  'user.locked': {
    titleKey: 'userEvents.locked.title',
    bodyKey: 'userEvents.locked.body',
  },
  'user.unlocked': {
    titleKey: 'userEvents.unlocked.title',
    bodyKey: 'userEvents.unlocked.body',
  },
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
  'contract_lock.decision_required': {
    titleKey: 'contractLockEvents.decisionRequired.title',
    bodyKey: 'contractLockEvents.decisionRequired.body',
    route: contractLockDecisionRoute,
  },
  'contract_lock.restore': {
    titleKey: 'contractLockEvents.restored.title',
    bodyKey: 'contractLockEvents.restored.body',
    route: contractSingleRoute,
  },
  'contract_lock.terminate': {
    titleKey: 'contractLockEvents.terminated.title',
    bodyKey: 'contractLockEvents.terminated.body',
    route: contractSingleRoute,
  },
  'contract_lock.suspended': {
    titleKey: 'contractLockEvents.suspended.title',
    bodyKey: 'contractLockEvents.suspended.body',
    route: contractSingleRoute,
  },
};

const resolveDefinition = (notification: RenderableNotification) => {
  const data = notification.data ?? {};
  const messageKey = readString(data, 'messageKey');
  if (messageKey && NOTIFICATION_REGISTRY[messageKey]) {
    return NOTIFICATION_REGISTRY[messageKey];
  }
  const action = readString(data, 'action');
  if (action === 'decision_required' || notification.title === 'CONTRACT_LOCK_DECISION_REQUIRED_TITLE') {
    return NOTIFICATION_REGISTRY['contract_lock.decision_required'];
  }
  if (action === 'restore' || notification.title === 'CONTRACT_RESTORED_TITLE') {
    return NOTIFICATION_REGISTRY['contract_lock.restore'];
  }
  if (action === 'terminate' || notification.title === 'CONTRACT_TERMINATED_TITLE') {
    return NOTIFICATION_REGISTRY['contract_lock.terminate'];
  }
  if (action === 'suspended' || notification.title === 'CONTRACT_SUSPENDED_TITLE') {
    return NOTIFICATION_REGISTRY['contract_lock.suspended'];
  }
  return undefined;
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
