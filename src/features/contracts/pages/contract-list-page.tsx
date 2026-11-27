import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/ui/page-header';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { ContractListTable } from '../components/contract-list-table';
import { ContractCreateModal } from '../components/contract-create-modal';
import { ContractLockDecisionDialog } from '../components/decision/contract-lock-decision-dialog';
import { useContractList } from '../hooks/use-contract-list';

export const ContractListPage = () => {
  const { t } = useTranslation('contracts');
  const { isLocked } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    buildings,
    selectedBuildingId,
    onBuildingChange,
    tableProps,
    refetch,
  } = useContractList();

  const lockCycleId = searchParams.get('lockCycleId');
  const contractIdsParam = searchParams.get('contractIds');
  const contractIds = useMemo(
    () =>
      contractIdsParam
        ? contractIdsParam
            .split(',')
            .map((id) => id.trim())
            .filter(Boolean)
        : [],
    [contractIdsParam],
  );
  const isDecisionDialogOpen = Boolean(lockCycleId && contractIds.length > 0);

  const handleCloseDecisionDialog = () => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete('lockCycleId');
        next.delete('contractIds');
        return next;
      },
      { replace: true },
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('title')}
        description={t('subtitle')}
        actions={
          !isLocked ? (
            <Button variant="primary" size="md" onClick={() => setIsCreateModalOpen(true)} className="gap-2 shadow-xs">
              <Plus className="h-4 w-4" />
              <span>{t('createContract')}</span>
            </Button>
          ) : undefined
        }
      />

      <ContractListTable
        {...tableProps}
        buildings={buildings}
        selectedBuildingId={selectedBuildingId}
        onBuildingChange={onBuildingChange}
      />

      {!isLocked && (
        <ContractCreateModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          defaultBuildingId={selectedBuildingId !== 'all' ? selectedBuildingId : undefined}
          onSuccess={() => void refetch()}
        />
      )}

      <ContractLockDecisionDialog
        open={isDecisionDialogOpen}
        onClose={handleCloseDecisionDialog}
        lockCycleId={lockCycleId}
        contractIds={contractIds}
        onDecisionCompleted={() => void refetch()}
      />
    </div>
  );
};
