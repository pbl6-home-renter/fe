import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { BuildingCreateModal } from '../components/building-create-modal';
import { BuildingMetricsMosaic } from '../components/building-metrics-mosaic';
import { BuildingListTable } from '../components/building-list-table';
import { useBuildingList } from '../hooks/use-building-list';

export const BuildingListPage = () => {
  const { t } = useTranslation('buildings');
  const { metrics, isCreateModalOpen, setIsCreateModalOpen, tableProps, refetch } = useBuildingList();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        description={t('subtitle')}
        actions={
          <Button variant="primary" size="md" onClick={() => setIsCreateModalOpen(true)} className="gap-2 shadow-xs">
            <Plus className="h-4 w-4" />
            <span>{t('createBuilding')}</span>
          </Button>
        }
      />

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
