import { useQuery } from '@tanstack/react-query';
import { roommateApi } from '../api/roommate.api';
import { ROOMMATE_QUERY_KEYS } from '../constants/roommate.constants';
import type { MyRoommateProfileDto } from '../types/roommate.dto';
import type { QueryHookOptions } from '@/lib/query/types';

export const useMyRoommateProfileQuery = (options?: QueryHookOptions<MyRoommateProfileDto | null>) =>
  useQuery({
    queryKey: ROOMMATE_QUERY_KEYS.myProfile(),
    queryFn: () => roommateApi.getMyProfile(),
    ...options,
  });
