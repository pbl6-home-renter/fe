import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { DashboardOverview } from '@/app/pages/dashboard-overview';
import { Role } from '@/types/role';
import { BuildingListPage } from '@/features/buildings/pages/building-list-page';
import { BuildingDetailPage } from '@/features/buildings/pages/building-detail-page';
import { RoomListPage } from '@/features/rooms/pages/room-list-page';
import { RoomDetailPage } from '@/features/rooms/pages/room-detail-page';

export const landlordRoutes: RouteObject[] = [
  {
    path: '/buildings',
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD]}>
        <BuildingListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/buildings/:id',
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD]}>
        <BuildingDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/buildings/:id/rooms',
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD]}>
        <RoomListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/buildings/:id/rooms/:roomId',
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD]}>
        <RoomDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/rooms',
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD]}>
        <RoomListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/rooms/:id',
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD]}>
        <RoomDetailPage />
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
