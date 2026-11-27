import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { Paginated } from '@/types/api';
import type { QueryHookOptions } from '@/lib/query/types';
import { moderationApi } from '../api/moderation.api';
import { MODERATION_QUERY_KEYS } from '../constants/moderation.constants';
import type { ReportAdminListItemDto, ReportListParams } from '../types/moderation.dto';

export const useReportsQuery = (
  params?: ReportListParams,
  options?: QueryHookOptions<Paginated<ReportAdminListItemDto>>,
) =>
  useQuery({
    queryKey: MODERATION_QUERY_KEYS.REPORT_LIST(params),
    queryFn: () => moderationApi.getReports(params),
    placeholderData: keepPreviousData,
    staleTime: 0,
    refetchOnMount: 'always',
    ...options,
  });
