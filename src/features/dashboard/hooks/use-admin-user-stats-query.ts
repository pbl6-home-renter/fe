import { useQuery } from '@tanstack/react-query';
import type { QueryHookOptions } from '@/lib/query/types';
import { adminDashboardApi } from '../api/admin-dashboard.api';
import { ADMIN_DASHBOARD_QUERY_KEYS } from '../constants/admin-dashboard.constants';
import type { UserStatsDto } from '../types/admin-dashboard.dto';

export const useAdminUserStatsQuery = (options?: QueryHookOptions<UserStatsDto>) => {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEYS.USER_STATS(),
    queryFn: () => adminDashboardApi.getUserStats(),
    ...options,
  });
};
