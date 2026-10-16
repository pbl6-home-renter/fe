import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { DashboardOverview } from '@/app/pages/dashboard-overview';
import { Role } from '@/types/role';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
        <DashboardOverview
          titleKey="routes.admin.systemStatsTitle"
          descKey="routes.admin.systemStatsDesc"
        />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/approvals',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
        <DashboardOverview
          titleKey="routes.admin.approvalsTitle"
          descKey="routes.admin.approvalsDesc"
        />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/users',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
        <DashboardOverview
          titleKey="routes.admin.usersTitle"
          descKey="routes.admin.usersDesc"
        />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/settings',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
        <DashboardOverview
          titleKey="routes.admin.settingsTitle"
          descKey="routes.admin.settingsDesc"
        />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/audit-logs',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
        <DashboardOverview
          titleKey="routes.admin.auditLogsTitle"
          descKey="routes.admin.auditLogsDesc"
        />
      </ProtectedRoute>
    ),
  },
];
