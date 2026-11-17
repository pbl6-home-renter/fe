import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { roommateApi } from '../api/roommate.api';
import { ROOMMATE_QUERY_KEYS } from '../constants/roommate.constants';
import type { PublicRoommateProfileDto, RoommateProfileSearchFilterDto } from '../types/roommate.dto';
import type { ListParams, Paginated } from '@/types/api';
import type { QueryHookOptions } from '@/lib/query/types';

export const useRoommateProfilesQuery = (
  params?: ListParams<RoommateProfileSearchFilterDto>,
  options?: QueryHookOptions<Paginated<PublicRoommateProfileDto>>,
) =>
  useQuery({
    queryKey: ROOMMATE_QUERY_KEYS.profiles(params),
    queryFn: () => roommateApi.getRoommateProfiles(params),
    placeholderData: keepPreviousData,
    ...options,
  });
