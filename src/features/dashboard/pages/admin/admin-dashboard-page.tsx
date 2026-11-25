import { useAuth } from '@/features/auth/hooks/use-auth';
import { formatDateTime } from '@/lib/utils/format';
import { useAdminDashboard } from '../../hooks/use-admin-dashboard';
import { AdminHomeBanner } from '../../components/admin/admin-home-banner';
import { AdminUserStatsSection } from '../../components/admin/admin-user-stats-section';
import { AdminTenancyStatsSection } from '../../components/admin/admin-tenancy-stats-section';

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const {
    userStatsQuery,
    tenancyStatsQuery,
    isRefetching,
    refetchAll,
    handlePendingBuildingsClick,
    handleLockedUsersClick,
    latestGeneratedAt,
  } = useAdminDashboard();

  const userName = user?.name?.trim().split(' ').slice(-1)[0] || user?.name || '';

  const formattedUpdatedTime = latestGeneratedAt ? formatDateTime(latestGeneratedAt) : null;

  return (
    <div className="space-y-6 pb-8 w-full max-w-[1440px] mx-auto">
      {/* 1. Hero Compact Greeting Banner matching Tenant & Landlord Dashboards */}
      <AdminHomeBanner
        userName={userName}
        formattedUpdatedTime={formattedUpdatedTime}
        isRefetching={isRefetching}
        onRefresh={refetchAll}
        onNavigateBuildings={handlePendingBuildingsClick}
        onNavigateUsers={handleLockedUsersClick}
      />

      {/* 2. Nhóm 1: Thống kê người dùng */}
      <AdminUserStatsSection
        data={userStatsQuery.data}
        isLoading={userStatsQuery.isLoading}
        isError={userStatsQuery.isError}
        onRetry={userStatsQuery.refetch}
        onLockedUsersClick={handleLockedUsersClick}
      />

      {/* 3. Nhóm 2: Thống kê tòa nhà & phòng */}
      <AdminTenancyStatsSection
        data={tenancyStatsQuery.data}
        isLoading={tenancyStatsQuery.isLoading}
        isError={tenancyStatsQuery.isError}
        onRetry={tenancyStatsQuery.refetch}
        onPendingBuildingsClick={handlePendingBuildingsClick}
      />
    </div>
  );
};
