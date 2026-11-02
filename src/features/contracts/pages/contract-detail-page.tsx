import { useTranslation } from 'react-i18next';
import { ContractHeader } from '../components/detail/contract-header';
import { ContractInfoCard } from '../components/detail/contract-info-card';
import { ContractDocumentsCard } from '../components/detail/contract-documents-card';
import { ContractEditModal } from '../components/contract-edit-modal';
import { useContractDetail } from '../hooks/use-contract-detail';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import { ErrorState } from '@/components/feedback/error-state';

export const ContractDetailPage = () => {
  const { t } = useTranslation('contracts');
  const {
    contract,
    isLoading,
    isError,
    refetch,
    isEditModalOpen,
    handleOpenEditModal,
    handleCloseEditModal,
  } = useContractDetail();

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !contract) {
    return (
      <div className="p-6">
        <ErrorState
          title={t('empty.filteredTitle')}
          message={t('empty.filteredDescription')}
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ContractHeader
        contract={contract}
        onEdit={handleOpenEditModal}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ContractInfoCard contract={contract} />
        </div>

        <div className="lg:col-span-2">
          <ContractDocumentsCard
            contract={contract}
            onRefresh={() => void refetch()}
          />
        </div>
      </div>

      <ContractEditModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        contract={contract}
        onSuccess={() => void refetch()}
      />
    </div>
  );
};
