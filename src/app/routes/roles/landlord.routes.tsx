import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { DashboardOverview } from '@/app/pages/dashboard-overview';
import { Role } from '@/types/role';

export const landlordRoutes: RouteObject[] = [
  {
    path: '/buildings',
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD, Role.ADMIN]}>
        <DashboardOverview
          titleKey="routes.buildings.title"
          descKey="routes.buildings.desc"
        />
      </ProtectedRoute>
    ),
  },
  {
    path: '/buildings/:id',
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD, Role.ADMIN]}>
        <DashboardOverview
          titleKey="routes.buildings.detailTitle"
          descKey="routes.buildings.detailDesc"
        />
      </ProtectedRoute>
    ),
  },
  {
    path: '/tenants',
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD, Role.ADMIN]}>
        <DashboardOverview
          titleKey="routes.tenants.title"
          descKey="routes.tenants.desc"
        />
      </ProtectedRoute>
    ),
  },
  {
    path: '/tenants/:id',
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD, Role.ADMIN]}>
        <DashboardOverview
          titleKey="routes.tenants.detailTitle"
          descKey="routes.tenants.detailDesc"
        />
      </ProtectedRoute>
    ),
  },
  {
    path: '/contracts/new',
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD, Role.ADMIN]}>
        <DashboardOverview
          titleKey="routes.contracts.newTitle"
          descKey="routes.contracts.newDesc"
        />
      </ProtectedRoute>
    ),
  },
  {
    path: '/contracts/templates',
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD, Role.ADMIN]}>
        <DashboardOverview
          titleKey="routes.contracts.templatesTitle"
          descKey="routes.contracts.templatesDesc"
        />
      </ProtectedRoute>
    ),
  },
  {
    path: '/meter-readings',
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD, Role.ADMIN]}>
        <DashboardOverview
          titleKey="routes.meterReadings.title"
          descKey="routes.meterReadings.desc"
        />
      </ProtectedRoute>
    ),
  },
];
