import { matchPath } from 'react-router-dom';
import { ROUTES } from '@/config/routes.config';
import { Role } from '@/types/role';

/**
 * Screens a locked account may still open (P12-D100 read-only access, without
 * payments per P13-D102). The backend enforces the same rules with
 * `@AllowLocked()`; write actions on these screens still answer 403.
 */
const COMMON_LOCKED_PATHS = [
  ROUTES.ACCOUNT_LOCKED,
  ROUTES.NOTIFICATIONS,
  ROUTES.PROFILE,
  ROUTES.TENANT.CONTRACTS,
  ROUTES.TENANT.CONTRACT_DETAIL(':id'),
  ROUTES.INVOICES,
  ROUTES.INVOICE_DETAIL(':id'),
  ROUTES.TENANT.ROOMS,
  ROUTES.ROOM_DETAIL(':id'),
];

const ROLE_LOCKED_PATHS: Partial<Record<Role, readonly string[]>> = {
  // The tenant dashboard is the public room explorer.
  [Role.TENANT]: [ROUTES.TENANT.DASHBOARD],
  [Role.LANDLORD]: [
    ROUTES.LANDLORD.BUILDINGS,
    ROUTES.LANDLORD.BUILDING_DETAIL(':id'),
    ROUTES.LANDLORD.BUILDING_ROOMS(':id'),
    ROUTES.LANDLORD.BUILDING_ROOM_DETAIL(':id', ':roomId'),
  ],
};

export const isPathAllowedWhileLocked = (pathname: string, role?: Role | null): boolean => {
  const patterns = [...COMMON_LOCKED_PATHS, ...((role && ROLE_LOCKED_PATHS[role]) ?? [])];
  return patterns.some((pattern) => matchPath({ path: pattern, end: true }, pathname) !== null);
};

/** Where a locked account lands instead of a screen it cannot use. */
export const getLockedHomePath = (role?: Role | null): string => {
  switch (role) {
    case Role.LANDLORD:
      return ROUTES.LANDLORD.BUILDINGS;
    case Role.TENANT:
      return ROUTES.TENANT.ROOMS;
    default:
      return ROUTES.ACCOUNT_LOCKED;
  }
};
