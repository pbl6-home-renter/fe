import { http } from '@/lib/api/http';
import type { AdminDashboardDto, UserStatsDto } from '../types/admin-dashboard.dto';

export const adminDashboardApi = {
  getUserStats: () => http.get<UserStatsDto>('/users/stats'),
  getTenancyStats: () => http.get<AdminDashboardDto>('/dashboard'),
};
