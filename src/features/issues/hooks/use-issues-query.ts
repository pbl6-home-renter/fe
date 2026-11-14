import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { QueryHookOptions } from '@/lib/query/types';
import type { Paginated } from '@/types/api';
import { issueApi } from '../api/issue.api';
import { ISSUE_QUERY_KEYS } from '../constants/issue.constants';
import type { IssueListItem, IssueListParams } from '../types/issue.dto';

export const useIssuesQuery = (
  tenant: boolean,
  params?: IssueListParams,
  options?: QueryHookOptions<Paginated<IssueListItem>>,
) =>
  useQuery({
    queryKey: ISSUE_QUERY_KEYS.LIST(tenant ? 'tenant' : 'landlord', params),
    queryFn: () => issueApi.list(tenant, params),
    placeholderData: keepPreviousData,
    ...options,
  });
