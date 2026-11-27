import { useQuery } from '@tanstack/react-query';
import type { QueryHookOptions } from '@/lib/query/types';
import { moderationApi } from '../api/moderation.api';
import { MODERATION_QUERY_KEYS } from '../constants/moderation.constants';
import type { AppealCurrentResponseDto } from '../types/moderation.dto';

export const useMyAppealQuery = (options?: QueryHookOptions<AppealCurrentResponseDto>) =>
  useQuery({
    queryKey: MODERATION_QUERY_KEYS.MY_APPEAL,
    queryFn: () => moderationApi.getMyCurrentAppeal(),
    refetchOnWindowFocus: true,
    ...options,
  });
