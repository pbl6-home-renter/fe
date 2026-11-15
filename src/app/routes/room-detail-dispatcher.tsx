import { useParams } from 'react-router-dom';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { DashboardLayout } from '@/app/layouts/dashboard-layout';
import { PublicLayout } from '@/app/layouts/public-layout';
import { RoomDetailPage } from '@/features/rooms/pages/room-detail-page';
import { RoomPublicDetailPage } from '@/features/rooms/pages/public/room-public-detail-page';
import { useRoomQuery } from '@/features/rooms/hooks/use-room-query';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import { Role } from '@/types/role';

export const RoomDetailDispatcher = () => {
  const { id } = useParams<{ id: string }>();
  const { user, role, isAuthenticated, isHydrated, isRestoringSession } = useAuth();
  const { data: room, isLoading } = useRoomQuery(id);

  if (!isHydrated || isRestoringSession || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rentify-background">
        <LoadingSpinner size="lg" color="primary" />
      </div>
    );
  }

  // If authenticated as Landlord and the room belongs to this landlord
  const isOwner = Boolean(isAuthenticated && role === Role.LANDLORD && user?.id && room?.landlord?.id === user.id);

  if (isOwner) {
    return (
      <DashboardLayout>
        <RoomDetailPage />
      </DashboardLayout>
    );
  }

  // If authenticated as Tenant or Landlord viewing another room
  if (isAuthenticated) {
    return (
      <DashboardLayout>
        <RoomPublicDetailPage />
      </DashboardLayout>
    );
  }

  // Guest / Unauthenticated visitor
  return (
    <PublicLayout>
      <RoomPublicDetailPage />
    </PublicLayout>
  );
};
