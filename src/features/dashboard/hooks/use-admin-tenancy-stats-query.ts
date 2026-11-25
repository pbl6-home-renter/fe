import { useQuery } from '@tanstack/react-query';
import type { QueryHookOptions } from '@/lib/query/types';
import { adminDashboardApi } from '../api/admin-dashboard.api';
import { ADMIN_DASHBOARD_QUERY_KEYS } from '../constants/admin-dashboard.constants';
import type { AdminDashboardDto } from '../types/admin-dashboard.dto';

export const useAdminTenancyStatsQuery = (options?: QueryHookOptions<AdminDashboardDto>) => {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_QUERY_KEYS.TENANCY_STATS(),
    queryFn: () => adminDashboardApi.getTenancyStats(),
    ...options,
  });
};
