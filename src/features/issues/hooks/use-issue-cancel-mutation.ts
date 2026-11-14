import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { issueApi } from '../api/issue.api';
import { ISSUE_QUERY_KEYS } from '../constants/issue.constants';
import type { IssueActionResult } from '../types/issue.dto';

export const useIssueCancelMutation = (id: string, options?: MutationHookOptions<IssueActionResult, void>) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: () => issueApi.cancel(id),
    ...options,
    onError: (error, variables, result, context) => {
      void client.invalidateQueries({ queryKey: ISSUE_QUERY_KEYS.DETAIL(id) });
      return options?.onError?.(error, variables, result, context);
    },
    onSuccess: (data, variables, result, context) => {
      void client.invalidateQueries({ queryKey: ISSUE_QUERY_KEYS.ALL });
      return options?.onSuccess?.(data, variables, result, context);
    },
  });
};
