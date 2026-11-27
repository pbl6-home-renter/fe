import { useQuery } from '@tanstack/react-query';
import type { QueryHookOptions } from '@/lib/query/types';
import { moderationApi } from '../api/moderation.api';
import { MODERATION_QUERY_KEYS } from '../constants/moderation.constants';
import type { AppealAdminDetailDto } from '../types/moderation.dto';

export const useAppealDetailQuery = (appealId: string, options?: QueryHookOptions<AppealAdminDetailDto>) =>
  useQuery({
    queryKey: MODERATION_QUERY_KEYS.APPEAL_DETAIL(appealId),
    queryFn: () => moderationApi.getAppealById(appealId),
    ...options,
  });
