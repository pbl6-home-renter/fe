import type { ReactNode } from 'react';
import { Navigate, Outlet, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { getHomePathByRole } from '@/app/routes/route-utils';

export interface PublicRouteProps {
  children?: ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();

  if (isAuthenticated && user) {
    const rawRedirect = searchParams.get('redirect') || searchParams.get('returnUrl');
    // Ensure safe internal relative redirection
    const destination =
      rawRedirect && rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')
        ? decodeURIComponent(rawRedirect)
        : getHomePathByRole(user.role);

    return <Navigate to={destination} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
