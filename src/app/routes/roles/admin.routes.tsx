import { type RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { DashboardOverview } from '@/app/pages/dashboard-overview';
import { Role } from '@/types/role';
import { ROUTES } from '@/config/routes.config';
import { BuildingApprovalListPage } from '@/features/buildings/pages/admin/building-approval-list-page';
import { BuildingApprovalDetailPage } from '@/features/buildings/pages/admin/building-approval-detail-page';

export const adminRoutes: RouteObject[] = [
  {
    path: ROUTES.ADMIN.DASHBOARD,
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
    path: ROUTES.ADMIN.BUILDINGS,
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
        <BuildingApprovalListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ADMIN.BUILDING_DETAIL(':id'),
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
        <BuildingApprovalDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ADMIN.USERS,
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
    path: ROUTES.ADMIN.SETTINGS,
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
    path: ROUTES.ADMIN.AUDIT_LOGS,
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
