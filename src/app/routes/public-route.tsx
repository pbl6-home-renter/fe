import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { getHomePathByRole } from '@/app/routes/route-utils';

export interface PublicRouteProps {
  children?: ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to={getHomePathByRole(user.role)} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

