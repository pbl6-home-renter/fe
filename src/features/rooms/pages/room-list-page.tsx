import { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2 } from 'lucide-react';
import { BuildingRoomList } from '../components/building-room-list';
import { useMyBuildingsQuery } from '@/features/buildings/hooks/use-my-buildings-query';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import { EmptyState } from '@/components/feedback/empty-state';
import { Button } from '@/components/ui/button';
import { SelectDropdown } from '@/components/ui/select-dropdown';

export const RoomListPage = () => {
  const { id: pathBuildingId } = useParams<{ id?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation('rooms');

  const queryBuildingId = searchParams.get('buildingId');
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>(
    pathBuildingId || queryBuildingId || ''
  );

  const { data: buildingsData, isLoading } = useMyBuildingsQuery({ pageSize: 50 });
  const buildings = buildingsData?.items ?? [];

  const effectiveBuildingId =
    selectedBuildingId || (buildings.length > 0 ? buildings[0].id : '');

  const currentBuilding = buildings.find((b) => b.id === effectiveBuildingId);

  const handleSelectBuilding = (bId: string) => {
    setSelectedBuildingId(bId);
    setSearchParams({ buildingId: bId });
  };

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (buildings.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon={Building2}
          title={t('list.noBuildingsTitle')}
          description={t('list.noBuildingsDesc')}
        >
          <div className="mt-4">
            <Button
              type="button"
              variant="primary"
              onClick={() => navigate('/buildings')}
            >
              <Building2 className="w-4 h-4 mr-1.5" />
              <span>{t('list.goToBuildings')}</span>
            </Button>
          </div>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6">
      {/* Building Switcher dropdown (if not in /buildings/:id/rooms) */}
      {!pathBuildingId && buildings.length > 1 && (
        <div className="flex items-center gap-3 bg-rentify-surface p-3.5 rounded-xl border border-rentify-divider">
          <Building2 className="w-4 h-4 text-rentify-primary shrink-0" />
          <div className="w-72">
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
