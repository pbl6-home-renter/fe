import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { Paginated } from '@/types/api';
import type { QueryHookOptions } from '@/lib/query/types';
import { auditLogsApi } from '../api/audit-logs.api';
import { AUDIT_LOGS_QUERY_KEYS } from '../constants/audit-logs.constants';
import type { AuditLogListItemDto, AuditLogListParams } from '../types/audit-logs.dto';

export const useAuditLogsQuery = (
  params?: AuditLogListParams,
  options?: QueryHookOptions<Paginated<AuditLogListItemDto>>,
) => {
  return useQuery({
    queryKey: AUDIT_LOGS_QUERY_KEYS.LIST(params),
    queryFn: () => auditLogsApi.getAuditLogs(params),
    placeholderData: keepPreviousData,
    // Always fetch latest logs when returning to the screen after admin actions.
    staleTime: 0,
    refetchOnMount: 'always',
    ...options,
  });
};
