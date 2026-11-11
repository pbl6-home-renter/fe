import { useTranslation } from 'react-i18next';
import { FileText, Users } from 'lucide-react';
import { ContractHeader } from '../components/detail/contract-header';
import { ContractInfoCard } from '../components/detail/contract-info-card';
import { ContractDocumentsCard } from '../components/detail/contract-documents-card';
import { ContractMembersCard } from '../components/members/contract-members-card';
import { ContractEditModal } from '../components/contract-edit-modal';
import { ContractCheckoutDialog } from '../components/detail/contract-checkout-dialog';
import { useContractDetail } from '../hooks/use-contract-detail';
import { Skeleton } from '@/components/feedback/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { SegmentedControl } from '@/components/ui/segmented-control';

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
      <div className="space-y-6" role="status" aria-label={t('title')}>
        <Skeleton className="h-10 w-40 rounded-xl" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-80 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl lg:col-span-2" />
        </div>
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
          <SegmentedControl
            label={t('tabs.label')}
            value={activeTab}
            onChange={handleTabChange}
            options={[
              { value: 'documents', label: t('tabs.documents'), icon: <FileText className="h-4 w-4" /> },
              { value: 'members', label: t('tabs.members'), icon: <Users className="h-4 w-4" /> },
            ]}
          />

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
