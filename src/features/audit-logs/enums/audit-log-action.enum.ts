export const AuditLogAction = {
  USER_LOCKED: 'user.locked',
  USER_UNLOCKED: 'user.unlocked',
  USER_UPDATED: 'user.updated',
  USER_DELETED: 'user.deleted',
  BUILDING_APPROVED: 'building.approved',
  BUILDING_REJECTED: 'building.rejected',
} as const;

export type AuditLogAction = (typeof AuditLogAction)[keyof typeof AuditLogAction];

export const AUDIT_LOG_ACTION_VALUES: readonly AuditLogAction[] = Object.values(AuditLogAction);

export const isValidAuditLogAction = (value: string | null | undefined): value is AuditLogAction =>
  Boolean(value && AUDIT_LOG_ACTION_VALUES.includes(value as AuditLogAction));
