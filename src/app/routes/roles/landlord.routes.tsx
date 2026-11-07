import type { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '../protected-route';
import { DashboardOverview } from '@/app/pages/dashboard-overview';
import { Role } from '@/types/role';
import { ROUTES } from '@/config/routes.config';
import { BuildingListPage } from '@/features/buildings/pages/building-list-page';
import { BuildingDetailPage } from '@/features/buildings/pages/building-detail-page';
import { RoomListPage } from '@/features/rooms/pages/room-list-page';
import { RoomDetailPage } from '@/features/rooms/pages/room-detail-page';
import { ContractListPage } from '@/features/contracts/pages/contract-list-page';
import { ContractDetailPage } from '@/features/contracts/pages/contract-detail-page';
import { MeterReadingPage } from '@/features/meter-readings/pages/meter-reading-page';

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
    path: ROUTES.LANDLORD.ROOMS,
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD]}>
        <RoomListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.LANDLORD.ROOM_DETAIL(':id'),
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD]}>
        <RoomDetailPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.LANDLORD.TENANTS,
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD, Role.ADMIN]}>
        <DashboardOverview titleKey="routes.tenants.title" descKey="routes.tenants.desc" />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.LANDLORD.TENANT_DETAIL(':id'),
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD, Role.ADMIN]}>
        <DashboardOverview titleKey="routes.tenants.detailTitle" descKey="routes.tenants.detailDesc" />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.LANDLORD.CONTRACTS,
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD]}>
        <ContractListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: ROUTES.LANDLORD.CONTRACT_DETAIL(':id'),
    element: (
      <ProtectedRoute allowedRoles={[Role.LANDLORD]}>
        <ContractDetailPage />
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
