import { useMemo, useState } from 'react';
import type { ColumnPinningState } from '@tanstack/react-table';
import { useDataTableState } from '@/hooks/use-data-table-state';
import { useContractsQuery } from './use-contracts-query';
import { useMyBuildingsQuery } from '@/features/buildings/hooks/use-my-buildings-query';
import { ContractStatus } from '../enums/contract-status.enum';
import type { ContractFilter, ContractListItemDto } from '../types/contract.dto';

const COLUMN_IDS = [
  'contractCode',
  'roomName',
  'tenantName',
  'rentPrice',
  'period',
  'status',
  'actions',
];
const ALLOWED_SORTS = ['createdAt', 'startDate', 'rentPrice', 'status'];
const DEFAULT_SORT = { id: 'createdAt', desc: true };
const DEFAULT_FILTERS = { status: 'all', buildingId: 'all' };
const DEFAULT_COLUMN_PINNING: ColumnPinningState = {
  left: ['contractCode'],
  right: ['actions'],
};
const REQUIRED_COLUMN_IDS = ['contractCode', 'actions'];
const STATUS_VALUES: string[] = Object.values(ContractStatus);

export const useContractList = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const tableState = useDataTableState({
    tableId: 'landlord-contracts',
    columnIds: COLUMN_IDS,
    allowedSorts: ALLOWED_SORTS,
    defaultSort: DEFAULT_SORT,
    defaultFilters: DEFAULT_FILTERS,
    defaultColumnPinning: DEFAULT_COLUMN_PINNING,
    requiredColumnIds: REQUIRED_COLUMN_IDS,
  });

  const selectedStatus = STATUS_VALUES.includes(tableState.filters.status)
    ? tableState.filters.status
    : 'all';
  const selectedBuildingId = tableState.filters.buildingId || 'all';

  const filterParam: ContractFilter = useMemo(() => {
    const filter: ContractFilter = {};
    if (selectedStatus !== 'all') {
      filter.status = selectedStatus;
    }
    if (selectedBuildingId !== 'all') {
      filter.buildingId = selectedBuildingId;
    }
    return filter;
  }, [selectedStatus, selectedBuildingId]);

  const search = tableState.search.trim().toLocaleLowerCase();
  const sorting = tableState.state.sorting[0];

  const contractsQuery = useContractsQuery({
    pageNo: tableState.pageNo,
    pageSize: tableState.pageSize,
    sort: sorting?.id,
    order: sorting ? (sorting.desc ? 'desc' : 'asc') : undefined,
    filter: filterParam,
  });

  const buildingsQuery = useMyBuildingsQuery({ pageSize: 100 });

  const rawContracts: ContractListItemDto[] = useMemo(
    () => contractsQuery.data?.items ?? [],
    [contractsQuery.data?.items]
  );

  const matchedContracts = useMemo(() => {
    if (!search) return rawContracts;
    return rawContracts.filter(
      (c) =>
        c.contractCode?.toLocaleLowerCase().includes(search) ||
        c.roomName?.toLocaleLowerCase().includes(search) ||
        c.tenantName?.toLocaleLowerCase().includes(search) ||
        c.tenantPhone?.toLocaleLowerCase().includes(search)
    );
  }, [rawContracts, search]);

  const isFiltered =
    selectedStatus !== 'all' || selectedBuildingId !== 'all' || Boolean(search);

  return {
    isCreateModalOpen,
    setIsCreateModalOpen,
    buildings: buildingsQuery.data?.items ?? [],
    selectedBuildingId,
    onBuildingChange: (bId: string) =>
      tableState.setFilter('buildingId', bId === 'all' ? undefined : bId),
    tableProps: {
      contracts: matchedContracts,
      rowCount: contractsQuery.data?.pagination.totalItems ?? matchedContracts.length,
      state: tableState.state,
      handlers: tableState.handlers,
      density: tableState.state.density,
      onDensityChange: tableState.setDensity,
      searchValue: tableState.search,
      onSearchChange: tableState.setSearch,
      selectedStatus,
      onStatusChange: (status: string) =>
        tableState.setFilter('status', status === 'all' ? undefined : status),
      isFiltered,
      onClearFilters: tableState.clearFilters,
      isLoading: contractsQuery.isLoading,
      isFetching: contractsQuery.isFetching,
      isError: contractsQuery.isError,
      onRetry: () => void contractsQuery.refetch(),
      onCreate: () => setIsCreateModalOpen(true),
    },
    refetch: contractsQuery.refetch,
  };
};
