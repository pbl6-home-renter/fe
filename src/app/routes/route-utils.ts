import type { Role } from '@/types/user';

export const getHomePathByRole = (role?: Role | null): string => {
  if (!role) return '/login';
  switch (role) {
    case 'admin':
      return '/admin';
    case 'landlord':
    case 'tenant':
      return '/dashboard';
    default:
      return '/dashboard';
  }
};

