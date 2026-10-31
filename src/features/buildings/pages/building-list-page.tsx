import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BuildingCreateModal } from '../components/building-create-modal';
import { BuildingMetricsMosaic } from '../components/building-metrics-mosaic';
import { BuildingListTable } from '../components/building-list-table';
import { useBuildingList } from '../hooks/use-building-list';

export const BuildingListPage = () => {
  const { t } = useTranslation('buildings');
  const {
    metrics,
    isCreateModalOpen,
    setIsCreateModalOpen,
    tableProps,
    refetch,
  } = useBuildingList();

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-rentify-text-primary sm:text-3xl">
            {t('title')}
          </h1>
          <p className="mt-1 text-sm text-rentify-text-secondary">{t('subtitle')}</p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsCreateModalOpen(true)}
          className="gap-2 shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>{t('createBuilding')}</span>
        </Button>
      </div>

      <BuildingMetricsMosaic metrics={metrics} />
      <BuildingListTable {...tableProps} />

      <BuildingCreateModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => void refetch()}
      />
    </div>
  );
};
