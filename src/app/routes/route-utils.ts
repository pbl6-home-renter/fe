import { Role } from '@/types/role';
import { ROUTES } from '@/config/routes.config';

export const getHomePathByRole = (role?: Role | null): string => {
  if (!role) return ROUTES.ROOMS_SEARCH;
  switch (role) {
    case Role.ADMIN:
      return ROUTES.ADMIN.DASHBOARD;
    case Role.LANDLORD:
    case Role.TENANT:
      return ROUTES.DASHBOARD;
    default:
      return ROUTES.DASHBOARD;
  }
};
