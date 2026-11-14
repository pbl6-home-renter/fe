import { type RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { DashboardOverview } from '@/app/pages/dashboard-overview';
import { Role } from '@/types/role';
import { ROUTES } from '@/config/routes.config';
import { BuildingApprovalListPage } from '@/features/buildings/pages/admin/building-approval-list-page';
import { BuildingApprovalDetailPage } from '@/features/buildings/pages/admin/building-approval-detail-page';
import { UserListPage } from '@/features/users/pages/admin/user-list-page';
import { UserDetailPage } from '@/features/users/pages/admin/user-detail-page';
import { SecuritySettingsPage } from '@/features/auth/pages/security-settings-page';

export const adminRoutes: RouteObject[] = [
  {
    path: ROUTES.ADMIN.DASHBOARD,
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
        <DashboardOverview titleKey="routes.admin.systemStatsTitle" descKey="routes.admin.systemStatsDesc" />
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
        <UserListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ADMIN.USER_DETAIL(':id'),
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
        <UserDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ADMIN.SETTINGS,
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
        <SecuritySettingsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.ADMIN.AUDIT_LOGS,
    element: (
      <ProtectedRoute allowedRoles={[Role.ADMIN]}>
        <DashboardOverview titleKey="routes.admin.auditLogsTitle" descKey="routes.admin.auditLogsDesc" />
      </ProtectedRoute>
    ),
  },
];
