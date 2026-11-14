import { useQuery } from '@tanstack/react-query';
import type { QueryHookOptions } from '@/lib/query/types';
import { issueApi } from '../api/issue.api';
import { ISSUE_QUERY_KEYS } from '../constants/issue.constants';
import type { IssueDetail } from '../types/issue.dto';

export const useIssueQuery = (id: string, options?: QueryHookOptions<IssueDetail>) =>
  useQuery({
    queryKey: ISSUE_QUERY_KEYS.DETAIL(id),
    queryFn: () => issueApi.detail(id),
    enabled: Boolean(id),
    ...options,
  });
