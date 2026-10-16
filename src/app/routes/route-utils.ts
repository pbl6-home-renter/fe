import { Role } from '@/types/role';

export const getHomePathByRole = (role?: Role | null): string => {
  if (!role) return '/login';
  switch (role) {
    case Role.ADMIN:
      return '/admin';
    case Role.LANDLORD:
    case Role.TENANT:
      return '/dashboard';
    default:
      return '/dashboard';
  }
};

