import { http } from '@/lib/api/http';
import type { AuditLogDetailDto, AuditLogListItemDto, AuditLogListParams } from '../types/audit-logs.dto';

const sanitizeListParams = (params?: AuditLogListParams): AuditLogListParams => {
  if (!params) return {};
  const cleaned: AuditLogListParams = {};

  if (params.action) cleaned.action = params.action;
  if (params.entityType) cleaned.entityType = params.entityType;
  if (params.actorId) cleaned.actorId = params.actorId;
  if (params.entityId) cleaned.entityId = params.entityId;
  if (params.from) cleaned.from = params.from;
  if (params.to) cleaned.to = params.to;
  if (params.pageNo !== undefined) cleaned.pageNo = params.pageNo;
  if (params.pageSize !== undefined) cleaned.pageSize = params.pageSize;

  return cleaned;
};

export const auditLogsApi = {
  getAuditLogs: (params?: AuditLogListParams) =>
    http.getPageWithParams<AuditLogListItemDto, AuditLogListParams>('/audit-logs', sanitizeListParams(params)),

  getAuditLogById: (auditLogId: string) => http.get<AuditLogDetailDto>(`/audit-logs/${auditLogId}`),
};
