import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { issueApi } from '../api/issue.api';
import { ISSUE_QUERY_KEYS } from '../constants/issue.constants';
import type { IssueCreateRequest, IssueCreateResult } from '../types/issue.dto';

export const useIssueCreateMutation = (options?: MutationHookOptions<IssueCreateResult, IssueCreateRequest>) => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: issueApi.create,
    ...options,
    onSuccess: (data, variables, result, context) => {
      void client.invalidateQueries({ queryKey: ISSUE_QUERY_KEYS.ALL });
      return options?.onSuccess?.(data, variables, result, context);
    },
  });
};
