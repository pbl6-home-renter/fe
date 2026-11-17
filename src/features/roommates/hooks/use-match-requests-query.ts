import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { roommateApi } from '../api/roommate.api';
import { ROOMMATE_QUERY_KEYS } from '../constants/roommate.constants';
import type { MatchRequestDto, MatchRequestListFilterDto } from '../types/roommate.dto';
import type { ListParams, Paginated } from '@/types/api';
import type { QueryHookOptions } from '@/lib/query/types';

export const useMatchRequestsQuery = (
  params?: ListParams<MatchRequestListFilterDto>,
  options?: QueryHookOptions<Paginated<MatchRequestDto>>,
) =>
  useQuery({
    queryKey: ROOMMATE_QUERY_KEYS.matchRequests(params),
    queryFn: () => roommateApi.getMatchRequests(params),
    placeholderData: keepPreviousData,
    ...options,
  });
