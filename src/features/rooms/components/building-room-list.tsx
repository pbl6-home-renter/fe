import { useTranslation } from 'react-i18next';
import { Plus, AlertTriangle, DoorOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertBanner } from '@/components/feedback/alert-banner';
import { Skeleton } from '@/components/feedback/skeleton';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
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

export const BuildingRoomList = ({ buildingId, buildingName, buildingStatus }: BuildingRoomListProps) => {
  const { t } = useTranslation('rooms');
  const {
    rooms,
    totalRooms,
    isLoading,
    isError,
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
  const isFiltered = selectedFloor !== 'all' || selectedStatus !== 'all';

  return (
    <div className="space-y-4">
      {/* Unapproved notice */}
      {!isBuildingApproved && (
        <AlertBanner variant="warning" title={t('unapprovedAlertTitle')}>
          <div className="flex items-center gap-2 mt-1 text-xs">
            <AlertTriangle className="w-4 h-4 text-rentify-warning shrink-0" />
            <p>{t('unapprovedAlertDesc')}</p>
          </div>
        </AlertBanner>
      )}

      {/* Header Bar */}
      <Card className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-rentify-text-primary">{t('list.title')}</h3>
            <Badge variant="secondary">{t('list.roomCount', { count: totalRooms })}</Badge>
          </div>
          <p className="text-xs text-rentify-text-secondary">{t('list.subtitle')}</p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          disabled={!isBuildingApproved}
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('list.addRoom')}</span>
        </Button>
      </Card>

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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label={t('list.title')}>
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-44 rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : rooms.length === 0 ? (
        <EmptyState
          icon={DoorOpen}
          title={t(isFiltered ? 'empty.filteredTitle' : 'empty.title')}
          description={
            isFiltered
              ? t('empty.filteredDesc')
              : isBuildingApproved
                ? t('empty.approvedDesc')
                : t('empty.unapprovedDesc')
          }
        >
          {isFiltered ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedFloor('all');
                setSelectedStatus('all');
              }}
            >
              {t('empty.clearFilters')}
            </Button>
          ) : isBuildingApproved ? (
            <div className="mt-4">
              <Button type="button" variant="primary" size="md" onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-4 h-4 mr-1" />
                {t('list.addRoom')}
              </Button>
            </div>
          ) : null}
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
