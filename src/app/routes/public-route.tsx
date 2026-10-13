import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth-store';
import { getHomePathByRole } from '@/app/routes/route-utils';

interface PublicRouteProps {
  children?: ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user, isAuthenticated } = useAuthStore();

  if (isAuthenticated && user) {
    return <Navigate to={getHomePathByRole(user.role)} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PublicRoute;

