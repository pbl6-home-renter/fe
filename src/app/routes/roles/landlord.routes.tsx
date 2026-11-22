import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { Role } from '@/types/role';
import { ROUTES } from '@/config/routes.config';
import { BuildingListPage } from '@/features/buildings/pages/building-list-page';
import { BuildingDetailPage } from '@/features/buildings/pages/building-detail-page';
import { RoomListPage } from '@/features/rooms/pages/room-list-page';
import { RoomDetailPage } from '@/features/rooms/pages/room-detail-page';
import { MeterReadingPage } from '@/features/meter-readings/pages/meter-reading-page';
import { TenantListPage } from '@/features/tenants/pages/tenant-list-page';
import { TenantDetailPage } from '@/features/tenants/pages/tenant-detail-page';

export const landlordRoutes: RouteObject[] = [
  {
    path: ROUTES.LANDLORD.BUILDINGS,
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD]}>
        <BuildingListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.LANDLORD.BUILDING_DETAIL(':id'),
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD]}>
        <BuildingDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.LANDLORD.BUILDING_ROOMS(':id'),
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD]}>
        <RoomListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.LANDLORD.BUILDING_ROOM_DETAIL(':id', ':roomId'),
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD]}>
        <RoomDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.LANDLORD.TENANTS,
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD]}>
        <TenantListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.LANDLORD.TENANT_DETAIL(':id'),
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD]}>
        <TenantDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.LANDLORD.METER_READINGS,
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD]}>
        <MeterReadingPage />
      </ProtectedRoute>
    ),
  },
];
