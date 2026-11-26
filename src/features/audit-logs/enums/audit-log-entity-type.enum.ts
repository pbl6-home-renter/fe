export const AuditLogEntityType = {
  USER: 'user',
  BUILDING: 'building',
} as const;

export type AuditLogEntityType = (typeof AuditLogEntityType)[keyof typeof AuditLogEntityType];

export const AUDIT_LOG_ENTITY_TYPE_VALUES: readonly AuditLogEntityType[] = Object.values(AuditLogEntityType);

export const isValidAuditLogEntityType = (value: string | null | undefined): value is AuditLogEntityType =>
  Boolean(value && AUDIT_LOG_ENTITY_TYPE_VALUES.includes(value as AuditLogEntityType));
