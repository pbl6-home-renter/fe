export const AuditLogSourceService = {
  IDENTITY: 'identity',
  TENANCY: 'tenancy',
} as const;

export type AuditLogSourceService = (typeof AuditLogSourceService)[keyof typeof AuditLogSourceService];
