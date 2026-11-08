import { useTranslation } from 'react-i18next';
import { FileText, Users } from 'lucide-react';
import { ContractHeader } from '../components/detail/contract-header';
import { ContractInfoCard } from '../components/detail/contract-info-card';
import { ContractDocumentsCard } from '../components/detail/contract-documents-card';
import { ContractMembersCard } from '../components/members/contract-members-card';
import { ContractEditModal } from '../components/contract-edit-modal';
import { ContractCheckoutDialog } from '../components/detail/contract-checkout-dialog';
import { useContractDetail } from '../hooks/use-contract-detail';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import { ErrorState } from '@/components/feedback/error-state';
import { cn } from '@/lib/utils/cn';

export const ContractDetailPage = () => {
  const { t } = useTranslation('contracts');
  const {
    contract,
    isLoading,
    isError,
    refetch,
    activeTab,
    handleTabChange,
    isEditModalOpen,
    handleOpenEditModal,
    handleCloseEditModal,
    checkoutModal,
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
      <ContractHeader contract={contract} onEdit={handleOpenEditModal} onCheckout={checkoutModal.handleOpen} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ContractInfoCard contract={contract} />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 border-b border-rentify-divider pb-2">
            <button
              type="button"
              onClick={() => handleTabChange('documents')}
              className={cn(
                'inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer',
                activeTab === 'documents'
                  ? 'bg-rentify-primary text-white shadow-xs'
                  : 'text-rentify-text-secondary hover:text-rentify-text-primary hover:bg-rentify-surface',
              )}
            >
              <FileText className="w-4 h-4" />
              <span>{t('tabs.documents')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('members')}
              className={cn(
                'inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer',
                activeTab === 'members'
                  ? 'bg-rentify-primary text-white shadow-xs'
                  : 'text-rentify-text-secondary hover:text-rentify-text-primary hover:bg-rentify-surface',
              )}
            >
              <Users className="w-4 h-4" />
              <span>{t('tabs.members')}</span>
            </button>
          </div>

          {activeTab === 'documents' && <ContractDocumentsCard contract={contract} onRefresh={() => void refetch()} />}

          {activeTab === 'members' && <ContractMembersCard contract={contract} />}
        </div>
      </div>

      <ContractEditModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        contract={contract}
        onSuccess={() => void refetch()}
      />

      <ContractCheckoutDialog
        open={checkoutModal.isOpen}
        onClose={checkoutModal.handleClose}
        onSubmit={checkoutModal.handleSubmit}
        form={checkoutModal.form}
        isSubmitting={checkoutModal.isSubmitting}
        settlementPeriod={checkoutModal.settlementPeriod}
        startDate={contract.startDate}
        buildingId={contract.buildingId}
      />
    </div>
  );
};
