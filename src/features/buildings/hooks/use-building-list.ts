import { useState, useMemo } from 'react';
import { useMyBuildingsQuery } from './use-my-buildings-query';
import { BuildingStatus } from '../enums/building-status.enum';
import type { BuildingMyListItemDto } from '../types/building.dto';

export const useBuildingList = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 10;

  const filterParam = selectedStatus !== 'all'
    ? { status: selectedStatus as BuildingStatus }
    : undefined;

  const { data, isLoading, isError, refetch } = useMyBuildingsQuery({
    pageNo,
    pageSize,
    filter: filterParam,
  });

  const rawBuildings: BuildingMyListItemDto[] = useMemo(
    () => data?.items ?? [],
    [data?.items]
  );
  const pagination = data?.pagination;

  // Filter by name / address
  const buildings = useMemo(() => {
    if (!searchTerm.trim()) return rawBuildings;
    const lower = searchTerm.toLowerCase();
    return rawBuildings.filter(
      (b) =>
        b.name?.toLowerCase().includes(lower) ||
        b.address?.toLowerCase().includes(lower)
    );
  }, [rawBuildings, searchTerm]);

  // Aggregate metrics
  const metrics = useMemo(() => {
    const totalBuildings = pagination?.totalItems ?? rawBuildings.length;
    let totalRooms = 0;
    let occupiedRooms = 0;
    let approvedCount = 0;

    rawBuildings.forEach((b) => {
      totalRooms += b.totalRooms || 0;
      occupiedRooms += b.occupiedRooms || 0;
      if (b.status === BuildingStatus.APPROVED) approvedCount += 1;
    });

    const occupancyRate = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : '0';

    return {
      totalBuildings,
      totalRooms,
      occupiedRooms,
      occupancyRate,
      approvedCount,
    };
  }, [rawBuildings, pagination]);

  const handlePrevPage = () => {
    if (pagination?.hasPreviousPage) {
      setPageNo((p) => Math.max(1, p - 1));
    }
  };

  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      setPageNo((p) => p + 1);
    }
  };

  const isFiltered = selectedStatus !== 'all' || searchTerm.trim().length > 0;

  const handleClearFilter = () => {
    setSelectedStatus('all');
    setSearchTerm('');
  };

  return {
    buildings,
    metrics,
    pagination,
    isLoading,
    isError,
    refetch,
    selectedStatus,
    setSelectedStatus,
    searchTerm,
    setSearchTerm,
    setPageNo,
    handlePrevPage,
    handleNextPage,
    isFiltered,
    handleClearFilter,
    isCreateModalOpen,
    setIsCreateModalOpen,
  };
};
