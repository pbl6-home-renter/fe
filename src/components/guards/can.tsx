import type { ReactNode } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import type { Role } from '@/types/role';

interface CanProps {
  roles?: Role[];
  fallback?: ReactNode;
  children: ReactNode;
}

export const Can = ({ roles, fallback = null, children }: CanProps) => {
  const user = useAuthStore((state) => state.user);

  if (!user) return <>{fallback}</>;
  if (roles && !roles.includes(user.role)) return <>{fallback}</>;

  return <>{children}</>;
};