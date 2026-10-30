import { Navigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { getHomePathByRole } from './route-utils';

export const RoleBasedRedirect = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={getHomePathByRole(user.role)} replace />;
};

