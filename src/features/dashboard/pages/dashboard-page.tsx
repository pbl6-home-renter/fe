import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Role } from '@/types/role';
import { LandlordDashboardPage } from './landlord-dashboard-page';
import { DashboardOverview } from '@/app/pages/dashboard-overview';

/**
 * DashboardPage đóng vai trò là Gateway / Role Dispatcher cho tuyến đường `/dashboard`.
 * Dựa vào vai trò (role) của người dùng hiện tại để render giao diện hoặc điều hướng phù hợp:
 * - ADMIN: Chuyển hướng ngay sang portal quản trị hệ thống tại `/admin`.
 * - LANDLORD: Render trang dashboard vận hành tòa nhà, phòng và doanh thu (`LandlordDashboardPage`).
 * - TENANT: Render trang tổng quan phòng trọ, hóa đơn và hợp đồng của khách thuê.
 */
export const DashboardPage = () => {
  const { role } = useAuth();

  if (role === Role.ADMIN) {
    return <Navigate to="/admin" replace />;
  }

  if (role === Role.LANDLORD) {
    return <LandlordDashboardPage />;
  }

  return (
    <DashboardOverview
      roleConfig={{
        tenant: {
          titleKey: 'routes.dashboard.tenantTitle',
          descKey: 'routes.dashboard.tenantDesc',
        },
      }}
    />
  );
};
