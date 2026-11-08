import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useContractQuery } from './use-contract-query';
import { useContractCheckoutModal } from './use-contract-checkout-modal';

export type ContractDetailTab = 'documents' | 'members';

export const useContractDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const query = useContractQuery(id);

  const activeTab: ContractDetailTab = searchParams.get('tab') === 'members' ? 'members' : 'documents';

  const handleTabChange = (tab: ContractDetailTab) => {
    const next = new URLSearchParams(searchParams);
    next.set('tab', tab);
    setSearchParams(next, { replace: true });
  };

  const isVehicleEditRequested = searchParams.get('edit') === 'vehicle';
  const showEditModal = isEditModalOpen || (isVehicleEditRequested && Boolean(query.data));

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    if (isVehicleEditRequested) {
      const next = new URLSearchParams(searchParams);
      next.delete('edit');
      setSearchParams(next, { replace: true });
    }
  };

  const checkoutModal = useContractCheckoutModal({
    contract: query.data!,
    onSuccess: () => void query.refetch(),
  });

  return {
    contractId: id,
    contract: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    activeTab,
    handleTabChange,
    isEditModalOpen: showEditModal,
    handleOpenEditModal,
    handleCloseEditModal,
    checkoutModal,
  };
};
