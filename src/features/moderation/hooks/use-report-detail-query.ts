import { useQuery } from '@tanstack/react-query';
import type { QueryHookOptions } from '@/lib/query/types';
import { moderationApi } from '../api/moderation.api';
import { MODERATION_QUERY_KEYS } from '../constants/moderation.constants';
import type { ReportAdminDetailDto } from '../types/moderation.dto';

export const useReportDetailQuery = (reportId: string, options?: QueryHookOptions<ReportAdminDetailDto>) =>
  useQuery({
    queryKey: MODERATION_QUERY_KEYS.REPORT_DETAIL(reportId),
    queryFn: () => moderationApi.getReportById(reportId),
    ...options,
  });
