import { useQuery } from '@tanstack/react-query';
import type { QueryHookOptions } from '@/lib/query/types';
import { auditLogsApi } from '../api/audit-logs.api';
import { AUDIT_LOGS_QUERY_KEYS } from '../constants/audit-logs.constants';
import type { AuditLogDetailDto } from '../types/audit-logs.dto';

export const useAuditLogDetailQuery = (auditLogId: string, options?: QueryHookOptions<AuditLogDetailDto>) => {
  return useQuery({
    queryKey: AUDIT_LOGS_QUERY_KEYS.DETAIL(auditLogId),
    queryFn: () => auditLogsApi.getAuditLogById(auditLogId),
    ...options,
  });
};
