import type { Role } from '@/types/user';

export const getHomePathByRole = (role?: Role | null): string => {
  if (!role) return '/login';
  switch (role) {
    case 'admin':
      return '/admin';
    case 'landlord':
      return '/landlord';
    case 'tenant':
      return '/tenant';
    default:
      return '/';
  }
};

