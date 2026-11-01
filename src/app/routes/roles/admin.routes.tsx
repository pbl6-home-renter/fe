import { type RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { DashboardOverview } from '@/app/pages/dashboard-overview';
import { Role } from '@/types/role';
import { BuildingApprovalListPage } from '@/features/buildings/pages/admin/building-approval-list-page';
import { BuildingApprovalDetailPage } from '@/features/buildings/pages/admin/building-approval-detail-page';

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
    path: '/admin/buildings',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
        <BuildingApprovalListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/buildings/:id',
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
        <BuildingApprovalDetailPage />
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
