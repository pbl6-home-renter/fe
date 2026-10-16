import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { DashboardOverview } from '@/app/pages/dashboard-overview';
import { Role } from '@/types/role';

export const tenantRoutes: RouteObject[] = [
  {
    path: '/roommates',
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
    path: '/roommates/profile',
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
