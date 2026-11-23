import { useDataTableState } from '@/hooks/use-data-table-state';
import {
  DEFAULT_TENANT_CONTRACT_COLUMN_PINNING,
  DEFAULT_TENANT_CONTRACT_FILTERS,
  REQUIRED_TENANT_CONTRACT_COLUMN_IDS,
  TENANT_CONTRACT_COLUMN_IDS,
} from '../constants/contract.constants';
import { ContractStatus } from '../enums/contract-status.enum';
import { useMyContractsQuery } from './use-my-contracts-query';

export const useTenantContractList = () => {
  const tableState = useDataTableState({
    tableId: 'tenant-contracts',
    columnIds: TENANT_CONTRACT_COLUMN_IDS,
    allowedSorts: [],
    defaultFilters: DEFAULT_TENANT_CONTRACT_FILTERS,
    defaultColumnPinning: DEFAULT_TENANT_CONTRACT_COLUMN_PINNING,
    requiredColumnIds: REQUIRED_TENANT_CONTRACT_COLUMN_IDS,
  });
  const status = Object.values(ContractStatus).find((value) => value === tableState.filters.status);
  const query = useMyContractsQuery({
    pageNo: tableState.pageNo,
    pageSize: tableState.pageSize,
    filter: status ? { status } : undefined,
  });
  return {
    query,
    tableState,
    status: status ?? '',
    setStatus: (value: string) => tableState.setFilter('status', value),
  };
};
