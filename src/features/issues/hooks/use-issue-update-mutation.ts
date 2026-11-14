import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { issueApi } from '../api/issue.api';
import { ISSUE_QUERY_KEYS } from '../constants/issue.constants';
import type { IssueActionResult, IssueUpdateRequest } from '../types/issue.dto';

export const useIssueUpdateMutation = (
  id: string,
  options?: MutationHookOptions<IssueActionResult, IssueUpdateRequest>,
) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (request: IssueUpdateRequest) => issueApi.update(id, request),
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
