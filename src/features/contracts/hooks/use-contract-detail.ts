import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useContractQuery } from './use-contract-query';

export const useContractDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const query = useContractQuery(id);

  const isVehicleEditRequested = searchParams.get('edit') === 'vehicle';
  const showEditModal = isEditModalOpen || (isVehicleEditRequested && Boolean(query.data));

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    if (isVehicleEditRequested) {
      searchParams.delete('edit');
      setSearchParams(searchParams, { replace: true });
    }
  };

  return {
    contractId: id,
    contract: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    isEditModalOpen: showEditModal,
    handleOpenEditModal,
    handleCloseEditModal,
  };
};
