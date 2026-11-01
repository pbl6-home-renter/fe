import { useTranslation } from 'react-i18next';
import { Plus, AlertTriangle, DoorOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertBanner } from '@/components/feedback/alert-banner';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import { EmptyState } from '@/components/feedback/empty-state';
import { RoomCard } from './room-card';
import { RoomCreateModal } from './room-create-modal';
import { RoomFilterBar } from './room-filter-bar';
import { useBuildingRoomList } from '../hooks/use-building-room-list';
import { BuildingStatus } from '@/features/buildings/enums/building-status.enum';

interface BuildingRoomListProps {
  buildingId: string;
  buildingName?: string;
  buildingStatus?: BuildingStatus;
}

export const BuildingRoomList = ({
  buildingId,
  buildingName,
  buildingStatus,
}: BuildingRoomListProps) => {
  const { t } = useTranslation('rooms');
  const {
    rooms,
    totalRooms,
    isLoading,
    isBuildingApproved,
    selectedFloor,
    setSelectedFloor,
    selectedStatus,
    setSelectedStatus,
    availableFloors,
    isCreateOpen,
    setIsCreateOpen,
    refetch,
  } = useBuildingRoomList({ buildingId, buildingStatus });

  return (
    <div className="space-y-4">
      {/* Unapproved notice */}
      {!isBuildingApproved && (
        <AlertBanner
          variant="warning"
          title={t('unapprovedAlertTitle')}
        >
          <div className="flex items-center gap-2 mt-1 text-xs">
            <AlertTriangle className="w-4 h-4 text-rentify-warning shrink-0" />
            <p>{t('unapprovedAlertDesc')}</p>
          </div>
        </AlertBanner>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-rentify-surface p-4 rounded-xl border border-rentify-divider shadow-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-rentify-text-primary">
              {t('list.title')}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-surface-container-low text-rentify-text-secondary">
              {t('list.roomCount', { count: totalRooms })}
            </span>
          </div>
          <p className="text-xs text-rentify-text-secondary">
            {t('list.subtitle')}
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          disabled={!isBuildingApproved}
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('list.addRoom')}</span>
        </Button>
      </div>

      {/* Filters (Floor & Status) */}
      <RoomFilterBar
        selectedFloor={selectedFloor}
        onSelectFloor={setSelectedFloor}
        availableFloors={availableFloors}
        selectedStatus={selectedStatus}
        onSelectStatus={setSelectedStatus}
      />

      {/* Content Area */}
      {isLoading ? (
        <div className="py-12 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : rooms.length === 0 ? (
        <EmptyState
          icon={DoorOpen}
          title={t('empty.title')}
          description={
            isBuildingApproved
              ? t('empty.approvedDesc')
              : t('empty.unapprovedDesc')
          }
        >
          {isBuildingApproved && (
            <div className="mt-4">
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setIsCreateOpen(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                {t('list.addRoom')}
              </Button>
            </div>
          )}
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} buildingId={buildingId} />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <RoomCreateModal
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        buildingId={buildingId}
        buildingName={buildingName}
        onSuccess={() => void refetch()}
      />
    </div>
  );
};
