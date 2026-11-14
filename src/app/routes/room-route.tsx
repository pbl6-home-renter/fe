import { useAuth } from '@/features/auth/hooks/use-auth';
import { RoomListPage } from '@/features/rooms/pages/room-list-page';
import { TenantRoomsPage } from '@/features/rooms/pages/tenant/tenant-rooms-page';
import { Role } from '@/types/role';
import { ProtectedRoute } from './protected-route';

export const RoomListRoute = () => {
  const { role } = useAuth();
  return <ProtectedRoute allowedRoles={[Role.LANDLORD, Role.TENANT]}>{role === Role.LANDLORD ? <RoomListPage /> : <TenantRoomsPage />}</ProtectedRoute>;
};
