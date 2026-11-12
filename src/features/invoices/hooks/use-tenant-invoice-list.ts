import { useCallback, useMemo } from 'react';
import { useDataTableState } from '@/hooks/use-data-table-state';
import {
  ALLOWED_TENANT_INVOICE_SORTS,
  DEFAULT_INVOICE_SORT,
  DEFAULT_TENANT_INVOICE_COLUMN_PINNING,
  DEFAULT_TENANT_INVOICE_FILTERS,
  REQUIRED_TENANT_INVOICE_COLUMN_IDS,
  TENANT_INVOICE_COLUMN_IDS,
} from '../constants/invoices.constants';
import type { TenantInvoiceListFilter } from '../types/invoices.dto';
import { useMyInvoicesQuery } from './use-my-invoices-query';

const PERIOD_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

export const useTenantInvoiceList = () => {
  const tableState = useDataTableState({
    tableId: 'tenant-invoices',
    columnIds: TENANT_INVOICE_COLUMN_IDS,
    allowedSorts: ALLOWED_TENANT_INVOICE_SORTS,
    defaultSort: DEFAULT_INVOICE_SORT,
    defaultFilters: DEFAULT_TENANT_INVOICE_FILTERS,
    defaultColumnPinning: DEFAULT_TENANT_INVOICE_COLUMN_PINNING,
    requiredColumnIds: REQUIRED_TENANT_INVOICE_COLUMN_IDS,
  });

  const rawPeriod = tableState.filters.period || '';
  const selectedPeriod = PERIOD_REGEX.test(rawPeriod) ? rawPeriod : '';

  const filterParam = useMemo<TenantInvoiceListFilter | undefined>(
    () => (selectedPeriod ? { period: selectedPeriod } : undefined),
    [selectedPeriod],
  );

  const sorting = tableState.state.sorting[0];
  const sortOrder: 'asc' | 'desc' = sorting?.desc ? 'desc' : 'asc';

  const invoicesQuery = useMyInvoicesQuery({
    pageNo: tableState.pageNo,
    pageSize: tableState.pageSize,
    sort: 'period',
    order: sortOrder,
    filter: filterParam,
  });

  const handlePeriodChange = useCallback(
    (period: string) => {
      tableState.setFilter('period', period && PERIOD_REGEX.test(period) ? period : '');
    },
    [tableState],
  );

  const handleClearFilters = useCallback(() => {
    tableState.setFilter('period', '');
  }, [tableState]);

  return {
    invoices: invoicesQuery.data?.items ?? [],
    rowCount: invoicesQuery.data?.pagination.totalItems ?? 0,
    isLoading: invoicesQuery.isLoading,
    isFetching: invoicesQuery.isFetching,
    isError: invoicesQuery.isError,
    refetch: invoicesQuery.refetch,
    tableState,
    selectedPeriod,
    isFiltered: Boolean(selectedPeriod),
    handlePeriodChange,
    handleClearFilters,
  };
};
