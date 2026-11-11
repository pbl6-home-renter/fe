import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { ContractListTable } from '../components/contract-list-table';
import { ContractCreateModal } from '../components/contract-create-modal';
import { useContractList } from '../hooks/use-contract-list';

export const ContractListPage = () => {
  const { t } = useTranslation('contracts');
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    buildings,
    selectedBuildingId,
    onBuildingChange,
    tableProps,
    refetch,
  } = useContractList();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        description={t('subtitle')}
        actions={
          <Button variant="primary" size="md" onClick={() => setIsCreateModalOpen(true)} className="gap-2 shadow-xs">
            <Plus className="h-4 w-4" />
            <span>{t('createContract')}</span>
          </Button>
        }
      />

      <ContractListTable
        {...tableProps}
        buildings={buildings}
        selectedBuildingId={selectedBuildingId}
        onBuildingChange={onBuildingChange}
      />

      <ContractCreateModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        defaultBuildingId={selectedBuildingId !== 'all' ? selectedBuildingId : undefined}
        onSuccess={() => void refetch()}
      />
    </div>
  );
};
