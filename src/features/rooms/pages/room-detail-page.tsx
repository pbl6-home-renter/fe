import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRoomQuery } from '../hooks/use-room-query';
import { useMarkRoomReadyMutation } from '../hooks/use-mark-room-ready-mutation';
import { RoomHeader } from '../components/detail/room-header';
import { RoomSpecsCard } from '../components/detail/room-specs-card';
import { RoomTenantContractCard } from '../components/detail/room-tenant-contract-card';
import { RoomMeterReadingsCard } from '../components/detail/room-meter-readings-card';
import { RoomEditModal } from '../components/room-edit-modal';
import { DeleteRoomDialog } from '../components/delete-room-dialog';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import { ErrorState } from '@/components/feedback/error-state';

export const RoomDetailPage = () => {
  const { id: routeBuildingId, roomId: routeRoomId } = useParams<{
    id?: string;
    roomId?: string;
  }>();
  // Support both /rooms/:roomId and /buildings/:id/rooms/:roomId
  const roomId = routeRoomId || routeBuildingId;

  const { t } = useTranslation('rooms');
  const navigate = useNavigate();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: room, isLoading, isError, refetch } = useRoomQuery(roomId);
  const markReadyMutation = useMarkRoomReadyMutation();

  const handleMarkReady = () => {
    if (!roomId || markReadyMutation.isPending) return;
    markReadyMutation.mutate(roomId, {
      onSuccess: () => void refetch(),
    });
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !room) {
    return (
      <div className="p-6">
        <ErrorState
          title={t('detail.notFoundTitle')}
          message={t('detail.notFoundDesc')}
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6">
      <RoomHeader
        room={room}
        onEdit={() => setIsEditOpen(true)}
        onDelete={() => setIsDeleteOpen(true)}
        onMarkReady={handleMarkReady}
        isMarkingReady={markReadyMutation.isPending}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Specs & Amenities */}
        <div className="lg:col-span-7 space-y-6">
          <RoomSpecsCard room={room} />
        </div>

        {/* Right Column: Contract & Tenant info + Meter readings */}
        <div className="lg:col-span-5 space-y-6">
          <RoomTenantContractCard
            contract={room.currentContract}
            members={room.currentMembers}
          />
          <RoomMeterReadingsCard meterReadings={room.latestMeterReadings} />
        </div>
      </div>

      <RoomEditModal
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        room={room}
        onSuccess={() => void refetch()}
      />

      <DeleteRoomDialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        roomId={room.id}
        roomName={room.name}
        onSuccess={() => {
          navigate(`/buildings/${room.buildingId}`, { replace: true });
        }}
      />
    </div>
  );
};
