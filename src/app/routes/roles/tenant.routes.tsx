import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { DashboardOverview } from '@/app/pages/dashboard-overview';
import { Role } from '@/types/role';
import { ROUTES } from '@/config/routes.config';

export const tenantRoutes: RouteObject[] = [
  {
    path: ROUTES.TENANT.ROOMMATES,
    element: (
      <ProtectedRoute allowedRoles={[Role.TENANT]}>
        <DashboardOverview
          titleKey="routes.roommates.title"
          descKey="routes.roommates.desc"
        />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.TENANT.ROOMMATES_PROFILE,
    element: (
      <ProtectedRoute allowedRoles={[Role.TENANT]}>
        <DashboardOverview
          titleKey="routes.roommates.profileTitle"
          descKey="routes.roommates.profileDesc"
        />
      </ProtectedRoute>
    ),
  },
];
