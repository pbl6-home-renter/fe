import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2 } from 'lucide-react';
import { ROUTES } from '@/config/routes.config';
import { BuildingRoomList } from '../components/building-room-list';
import { useMyBuildingsQuery } from '@/features/buildings/hooks/use-my-buildings-query';
import { EmptyState } from '@/components/feedback/empty-state';
import { Skeleton } from '@/components/feedback/skeleton';
import { Button } from '@/components/ui/button';
import { SelectDropdown } from '@/components/ui/select-dropdown';

export const RoomListPage = () => {
  const { id: pathBuildingId } = useParams<{ id?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation('rooms');

  const queryBuildingId = searchParams.get('buildingId');
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>(pathBuildingId || queryBuildingId || '');

  const { data: buildingsData, isLoading } = useMyBuildingsQuery({ pageSize: 50 });
  const buildings = buildingsData?.items ?? [];

  const effectiveBuildingId = selectedBuildingId || (buildings.length > 0 ? buildings[0].id : '');

  const currentBuilding = buildings.find((b) => b.id === effectiveBuildingId);

  const handleSelectBuilding = (bId: string) => {
    setSelectedBuildingId(bId);
    setSearchParams({ buildingId: bId });
  };

  if (isLoading) {
    return (
      <div className="space-y-6" role="status" aria-label={t('list.title')}>
        <Skeleton className="h-14 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-44 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (buildings.length === 0) {
    return (
      <EmptyState icon={Building2} title={t('list.noBuildingsTitle')} description={t('list.noBuildingsDesc')}>
        <div className="mt-4">
          <Button type="button" variant="primary" onClick={() => navigate(ROUTES.LANDLORD.BUILDINGS)}>
            <Building2 className="w-4 h-4 mr-1.5" />
            <span>{t('list.goToBuildings')}</span>
          </Button>
        </div>
      </EmptyState>
    );
  }

  return (
    <div className="space-y-6">
      {/* Building Switcher dropdown (if not in /buildings/:id/rooms) */}
      {!pathBuildingId && buildings.length > 1 && (
        <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-rentify-divider bg-rentify-surface p-3.5">
          <Building2 className="w-4 h-4 text-rentify-primary shrink-0" />
          <div className="min-w-0 w-full sm:w-72">
            <SelectDropdown
              value={effectiveBuildingId}
              onChange={(e) => handleSelectBuilding(e.target.value)}
              options={buildings.map((b) => ({
                value: b.id,
                label: `${b.name} (${b.address || ''})`,
              }))}
            />
          </div>
        </div>
      )}

      {/* Building Room List */}
      {effectiveBuildingId && (
        <BuildingRoomList
          buildingId={effectiveBuildingId}
          buildingName={currentBuilding?.name}
          buildingStatus={currentBuilding?.status}
        />
      )}
    </div>
  );
};
