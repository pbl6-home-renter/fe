import { Link } from 'react-router-dom';
import { DoorOpen } from 'lucide-react';
import { useRoomQuery } from '@/features/rooms/hooks/use-room-query';
import { Skeleton } from '@/components/feedback/skeleton';
import { ROUTES } from '@/config/routes.config';

interface TenantRoomInfoProps {
  roomId: string;
}

export const TenantRoomInfo = ({ roomId }: TenantRoomInfoProps) => {
  const { data: room, isLoading } = useRoomQuery(roomId);

  if (isLoading) {
    return <Skeleton className="h-4 w-28 rounded" />;
  }

  if (!room) {
    return <span className="font-mono text-rentify-text-secondary text-xs">#{roomId.slice(0, 8)}</span>;
  }

  return (
    <Link
      to={ROUTES.LANDLORD.ROOM_DETAIL(roomId)}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-rentify-text-primary hover:text-rentify-primary hover:underline transition-colors"
      onClick={(e) => e.stopPropagation()}
    >
      <DoorOpen className="h-4 w-4 text-rentify-primary shrink-0" />
      <span>{room.name}</span>
      {room.buildingName && (
        <span className="text-rentify-text-secondary font-normal truncate max-w-[150px]">({room.buildingName})</span>
      )}
    </Link>
  );
};
