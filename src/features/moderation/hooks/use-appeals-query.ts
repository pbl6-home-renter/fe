import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { Paginated } from '@/types/api';
import type { QueryHookOptions } from '@/lib/query/types';
import { moderationApi } from '../api/moderation.api';
import { MODERATION_QUERY_KEYS } from '../constants/moderation.constants';
import type { AppealAdminListItemDto, AppealListParams } from '../types/moderation.dto';

export const useAppealsQuery = (
  params?: AppealListParams,
  options?: QueryHookOptions<Paginated<AppealAdminListItemDto>>,
) =>
  useQuery({
    queryKey: MODERATION_QUERY_KEYS.APPEAL_LIST(params),
    queryFn: () => moderationApi.getAppeals(params),
    placeholderData: keepPreviousData,
    staleTime: 0,
    refetchOnMount: 'always',
    ...options,
  });
