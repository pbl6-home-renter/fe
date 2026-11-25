import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes.config';
import { useAdminUserStatsQuery } from './use-admin-user-stats-query';
import { useAdminTenancyStatsQuery } from './use-admin-tenancy-stats-query';

export const useAdminDashboard = () => {
  const navigate = useNavigate();

  const userStatsQuery = useAdminUserStatsQuery();
  const tenancyStatsQuery = useAdminTenancyStatsQuery();

  const isRefetching = userStatsQuery.isRefetching || tenancyStatsQuery.isRefetching;

  const refetchAll = useCallback(async () => {
    await Promise.all([userStatsQuery.refetch(), tenancyStatsQuery.refetch()]);
  }, [userStatsQuery, tenancyStatsQuery]);

  const handlePendingBuildingsClick = useCallback(() => {
    navigate(ROUTES.ADMIN.BUILDINGS);
  }, [navigate]);

  const handleLockedUsersClick = useCallback(() => {
    navigate(`${ROUTES.ADMIN.USERS}?status=locked`);
  }, [navigate]);

  const latestGeneratedAt = useMemo(() => {
    const userDate = userStatsQuery.data?.generatedAt;
    const tenancyDate = tenancyStatsQuery.data?.generatedAt;
    if (!userDate && !tenancyDate) return null;
    if (!userDate) return tenancyDate;
    if (!tenancyDate) return userDate;
    return new Date(userDate) > new Date(tenancyDate) ? userDate : tenancyDate;
  }, [userStatsQuery.data?.generatedAt, tenancyStatsQuery.data?.generatedAt]);

  return {
    userStatsQuery,
    tenancyStatsQuery,
    isRefetching,
    refetchAll,
    handlePendingBuildingsClick,
    handleLockedUsersClick,
    latestGeneratedAt,
  };
};
