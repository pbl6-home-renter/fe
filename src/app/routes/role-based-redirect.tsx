import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { getHomePathByRole } from './route-utils';
import { PublicLayout } from '@/app/layouts/public-layout';
import { TenantDashboardPage } from '@/features/dashboard/pages/tenant-dashboard-page';

export const RoleBasedRedirect = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <PublicLayout>
        <TenantDashboardPage />
      </PublicLayout>
    );
  }

  return <Navigate to={getHomePathByRole(user.role)} replace />;
};
