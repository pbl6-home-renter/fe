import { Navigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes.config';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { getHomePathByRole } from './route-utils';

export const RoleBasedRedirect = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Navigate to={getHomePathByRole(user.role)} replace />;
};

