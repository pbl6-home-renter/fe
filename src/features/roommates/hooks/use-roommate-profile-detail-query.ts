import { useQuery } from '@tanstack/react-query';
import { roommateApi } from '../api/roommate.api';
import { ROOMMATE_QUERY_KEYS } from '../constants/roommate.constants';
import type { PublicRoommateProfileDto } from '../types/roommate.dto';
import type { QueryHookOptions } from '@/lib/query/types';

export const useRoommateProfileDetailQuery = (id: string, options?: QueryHookOptions<PublicRoommateProfileDto>) =>
  useQuery({
    queryKey: ROOMMATE_QUERY_KEYS.profileDetail(id),
    queryFn: () => roommateApi.getRoommateProfileById(id),
    enabled: Boolean(id),
    ...options,
  });
