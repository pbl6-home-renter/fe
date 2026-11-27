import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/config/routes.config';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import type { Role } from '@/types/role';
import { UserStatus } from '@/types/user';
import { getLockedHomePath, isPathAllowedWhileLocked } from './locked-access';

export interface ProtectedRouteProps {
  allowedRoles?: Role[];
  roles?: Role[];
  allowLocked?: boolean;
  children?: ReactNode;
}

export const ProtectedRoute = ({ allowedRoles, roles, allowLocked = false, children }: ProtectedRouteProps) => {
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
    return <Navigate to={`${ROUTES.LOGIN}?redirect=${returnUrl}`} state={{ from: location }} replace />;
  }

  // Locked accounts keep read-only access to their own data (P12-D100, P13-D102).
  if (user.status === UserStatus.LOCKED && !allowLocked && !isPathAllowedWhileLocked(location.pathname, user.role)) {
    return <Navigate to={getLockedHomePath(user.role)} replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to={ROUTES.FORBIDDEN} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
