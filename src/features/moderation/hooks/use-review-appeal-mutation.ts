import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { USERS_QUERY_KEYS } from '@/features/users/constants/users.constants';
import { AUDIT_LOGS_QUERY_KEYS } from '@/features/audit-logs/constants/audit-logs.constants';
import { moderationApi } from '../api/moderation.api';
import { MODERATION_QUERY_KEYS } from '../constants/moderation.constants';
import type { AppealReviewResponseDto } from '../types/moderation.dto';

export type ReviewAppealVariables =
  { appealId: string; decision: 'accept' } | { appealId: string; decision: 'reject'; rejectReason: string };

export const useReviewAppealMutation = (
  options?: MutationHookOptions<AppealReviewResponseDto, ReviewAppealVariables>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: ReviewAppealVariables) =>
      variables.decision === 'accept'
        ? moderationApi.acceptAppeal(variables.appealId)
        : moderationApi.rejectAppeal(variables.appealId, { rejectReason: variables.rejectReason }),
    ...options,
    onSettled: (...args) => {
      void queryClient.invalidateQueries({ queryKey: MODERATION_QUERY_KEYS.APPEALS });
      void queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEYS.ALL });
      void queryClient.invalidateQueries({ queryKey: AUDIT_LOGS_QUERY_KEYS.ALL });
      return options?.onSettled?.(...args);
    },
  });
};
