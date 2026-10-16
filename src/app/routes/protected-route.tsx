import type { ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import type { Role } from '@/types/role';

export interface ProtectedRouteProps {
  allowedRoles?: Role[];
  roles?: Role[]; // backward compatibility
  children?: ReactNode;
}

export const ProtectedRoute = ({
  allowedRoles,
  roles,
  children,
}: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const requiredRoles = allowedRoles || roles;

  // 1. Check authentication
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check role authorization
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

