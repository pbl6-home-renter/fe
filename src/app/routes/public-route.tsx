import type { ReactNode } from 'react';
import { Navigate, Outlet, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { getHomePathByRole } from '@/app/routes/route-utils';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';

export interface PublicRouteProps {
  children?: ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { t } = useTranslation('common');
  const { user, isAuthenticated, isHydrated, isRestoringSession } = useAuth();
  const [searchParams] = useSearchParams();

  if (!isHydrated || isRestoringSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rentify-background">
        <LoadingSpinner size="lg" color="primary" label={t('checkingSession')} />
      </div>
    );
  }

  if (isAuthenticated && user) {
    const rawRedirect = searchParams.get('redirect') || searchParams.get('returnUrl');
    const destination =
      rawRedirect && rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')
        ? decodeURIComponent(rawRedirect)
        : getHomePathByRole(user.role);

    return <Navigate to={destination} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
