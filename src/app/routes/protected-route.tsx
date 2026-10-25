import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/use-auth';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import type { Role } from '@/types/role';
import { UserStatus } from '@/types/user';

export interface ProtectedRouteProps {
  allowedRoles?: Role[];
  roles?: Role[];
  children?: ReactNode;
}

export const ProtectedRoute = ({
  allowedRoles,
  roles,
  children,
}: ProtectedRouteProps) => {
  const { t } = useTranslation('common');
  const { user, isAuthenticated, isHydrated, isRestoringSession } = useAuth();
  const location = useLocation();

  const requiredRoles = allowedRoles || roles;

  if (!isHydrated || isRestoringSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rentify-background">
        <LoadingSpinner size="lg" color="primary" label={t('checkingSession')} />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${returnUrl}`} state={{ from: location }} replace />;
  }

  if (user.status === UserStatus.LOCKED) {
    return <Navigate to="/403" replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
