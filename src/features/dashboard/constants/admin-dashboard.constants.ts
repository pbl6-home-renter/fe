export const ADMIN_DASHBOARD_QUERY_KEYS = {
  ALL: ['admin-dashboard'] as const,
  USER_STATS: () => [...ADMIN_DASHBOARD_QUERY_KEYS.ALL, 'user-stats'] as const,
  TENANCY_STATS: () => [...ADMIN_DASHBOARD_QUERY_KEYS.ALL, 'tenancy-stats'] as const,
};
