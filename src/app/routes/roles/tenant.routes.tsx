import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { Role } from '@/types/role';
import { ROUTES } from '@/config/routes.config';
import { RoommatesPage } from '@/features/roommates/pages/roommates-page';
import { RoommateProfilePage } from '@/features/roommates/pages/roommate-profile-page';

export const tenantRoutes: RouteObject[] = [
  {
    path: ROUTES.TENANT.ROOMMATES,
    element: (
      <ProtectedRoute allowedRoles={[Role.TENANT]}>
        <RoommatesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.TENANT.ROOMMATES_PROFILE,
    element: (
      <ProtectedRoute allowedRoles={[Role.TENANT]}>
        <RoommateProfilePage />
      </ProtectedRoute>
    ),
  },
];
