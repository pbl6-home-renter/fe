import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { USERS_QUERY_KEYS } from '@/features/users/constants/users.constants';
import { AUDIT_LOGS_QUERY_KEYS } from '@/features/audit-logs/constants/audit-logs.constants';
import { moderationApi } from '../api/moderation.api';
import { MODERATION_QUERY_KEYS } from '../constants/moderation.constants';
import type { ReportResolveRequestDto, ReportResolveResponseDto } from '../types/moderation.dto';

interface ResolveReportVariables {
  reportId: string;
  payload: ReportResolveRequestDto;
}

export const useResolveReportMutation = (
  options?: MutationHookOptions<ReportResolveResponseDto, ResolveReportVariables>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, payload }: ResolveReportVariables) => moderationApi.resolveReport(reportId, payload),
    ...options,
    onSettled: (...args) => {
      // Locking closes every pending report about the user, so refresh the whole queue.
      void queryClient.invalidateQueries({ queryKey: MODERATION_QUERY_KEYS.REPORTS });
      void queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.ALL });
      void queryClient.invalidateQueries({ queryKey: AUDIT_LOGS_QUERY_KEYS.ALL });
      return options?.onSettled?.(...args);
    },
  });
};
