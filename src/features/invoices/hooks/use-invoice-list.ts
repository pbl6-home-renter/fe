import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMyBuildingsQuery } from '@/features/buildings/hooks/use-my-buildings-query';
import { useMyRoomsQuery } from '@/features/rooms/hooks/use-my-rooms-query';
import { useDataTableState } from '@/hooks/use-data-table-state';
import {
  ALLOWED_INVOICE_SORTS,
  DEFAULT_INVOICE_COLUMN_PINNING,
  DEFAULT_INVOICE_FILTERS,
  DEFAULT_INVOICE_SORT,
  INVOICE_COLUMN_IDS,
  INVOICE_MAX_ISSUE_BATCH,
  REQUIRED_INVOICE_COLUMN_IDS,
} from '../constants/invoices.constants';
import { INVOICE_STATUS_VALUES, type InvoiceStatus } from '../enums/invoice-status.enum';
import type {
  InvoiceGenerateResponseDto,
  InvoiceIssueResponseDto,
  InvoiceListFilter,
  InvoiceSortField,
} from '../types/invoices.dto';
import { useGenerateInvoicesMutation } from './use-generate-invoices-mutation';
import { useInvoicesQuery } from './use-invoices-query';
import { useIssueInvoicesMutation } from './use-issue-invoices-mutation';

const PERIOD_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

export const useInvoiceList = () => {
  const tableState = useDataTableState({
    tableId: 'landlord-invoices',
    columnIds: INVOICE_COLUMN_IDS,
    allowedSorts: ALLOWED_INVOICE_SORTS,
    defaultSort: DEFAULT_INVOICE_SORT,
    defaultFilters: DEFAULT_INVOICE_FILTERS,
    defaultColumnPinning: DEFAULT_INVOICE_COLUMN_PINNING,
    requiredColumnIds: REQUIRED_INVOICE_COLUMN_IDS,
  });

  const rawBuildingId = tableState.filters.buildingId || 'all';
  const rawPeriod = tableState.filters.period || '';
  const rawStatus = tableState.filters.status || 'all';

  const selectedPeriod = PERIOD_REGEX.test(rawPeriod) ? rawPeriod : '';
  const selectedStatus = INVOICE_STATUS_VALUES.includes(rawStatus) ? (rawStatus as InvoiceStatus) : 'all';

  const buildingsQuery = useMyBuildingsQuery({ pageSize: 50 });
  const buildings = useMemo(() => buildingsQuery.data?.items ?? [], [buildingsQuery.data?.items]);
  const buildingIds = useMemo(() => new Set(buildings.map((b) => b.id)), [buildings]);
  const selectedBuildingId =
    rawBuildingId !== 'all' && (buildings.length === 0 || buildingIds.has(rawBuildingId)) ? rawBuildingId : 'all';

  const roomsQuery = useMyRoomsQuery(
    { filter: { buildingId: selectedBuildingId }, pageSize: 100 },
    selectedBuildingId !== 'all',
  );
  const roomNameById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const room of roomsQuery.data?.items ?? []) {
      map[room.id] = room.name;
    }
    return map;
  }, [roomsQuery.data?.items]);

  const filterParam = useMemo<InvoiceListFilter | undefined>(() => {
    const filter: InvoiceListFilter = {};
    if (selectedBuildingId !== 'all') filter.buildingId = selectedBuildingId;
    if (selectedPeriod) filter.period = selectedPeriod;
    if (selectedStatus !== 'all') filter.status = selectedStatus;
    return Object.keys(filter).length > 0 ? filter : undefined;
  }, [selectedBuildingId, selectedPeriod, selectedStatus]);

  const sorting = tableState.state.sorting[0];
  const sortField: InvoiceSortField =
    sorting && (sorting.id === 'period' || sorting.id === 'createdAt') ? sorting.id : 'period';

  const query = useInvoicesQuery({
    pageNo: tableState.pageNo,
    pageSize: tableState.pageSize,
    sort: sortField,
    order: sorting ? (sorting.desc ? 'desc' : 'asc') : 'desc',
    filter: filterParam,
  });

  const [, setSearchParams] = useSearchParams();
  const generateMutation = useGenerateInvoicesMutation();
  const issueMutation = useIssueInvoicesMutation();

  const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
  const [generateResult, setGenerateResult] = useState<InvoiceGenerateResponseDto | null>(null);
  const [issueDialogOpen, setIssueDialogOpen] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState('');
  const [issueResult, setIssueResult] = useState<InvoiceIssueResponseDto | null>(null);

  const canGenerateDirectly = selectedBuildingId !== 'all' && Boolean(selectedPeriod);
  const isFiltered = selectedBuildingId !== 'all' || Boolean(selectedPeriod) || selectedStatus !== 'all';

  const selectedInvoiceIds = useMemo(
    () =>
      Object.entries(tableState.state.rowSelection)
        .filter(([, selected]) => selected)
        .map(([id]) => id)
        .slice(0, INVOICE_MAX_ISSUE_BATCH),
    [tableState.state.rowSelection],
  );

  const handleBuildingChange = (buildingId: string) => {
    tableState.setFilter('buildingId', buildingId === 'all' ? undefined : buildingId);
  };

  const handlePeriodChange = (period: string) => {
    tableState.setFilter('period', period || undefined);
  };

  const handleStatusChange = (status: string) => {
    tableState.setFilter('status', status === 'all' ? undefined : status);
  };

  const handleClearFilters = () => {
    tableState.clearFilters();
  };

  const runGenerate = (buildingId: string, period: string) => {
    generateMutation.mutate(
      { buildingId, period },
      {
        onSuccess: (result) => {
          setGenerateDialogOpen(false);
          setSearchParams(
            (prev) => {
              const next = new URLSearchParams(prev);
              next.set('buildingId', buildingId);
              next.set('period', period);
              next.set('page', '1');
              return next;
            },
            { replace: true },
          );
          setGenerateResult(result);
        },
      },
    );
  };

  const handleGenerate = () => {
    if (canGenerateDirectly) {
      runGenerate(selectedBuildingId, selectedPeriod);
      return;
    }
    setGenerateDialogOpen(true);
  };

  const handleCloseGenerateDialog = () => {
    if (generateMutation.isPending) return;
    setGenerateDialogOpen(false);
  };

  const handleCloseGenerateResult = useCallback(() => {
    setGenerateResult(null);
  }, []);

  const handleOpenIssueDialog = () => {
    if (selectedInvoiceIds.length === 0) return;
    setIdempotencyKey(crypto.randomUUID());
    setIssueResult(null);
    setIssueDialogOpen(true);
  };

  const handleConfirmIssue = () => {
    if (selectedInvoiceIds.length === 0 || !idempotencyKey) return;
    issueMutation.mutate(
      {
        payload: { invoiceIds: selectedInvoiceIds },
        idempotencyKey,
      },
      {
        onSuccess: (result) => {
          setIssueResult(result);
          tableState.handlers.onRowSelectionChange({});
          if (result.failed.length === 0) {
            setIssueDialogOpen(false);
            setIssueResult(null);
          }
        },
      },
    );
  };

  const handleCloseIssueDialog = () => {
    if (issueMutation.isPending) return;
    setIssueDialogOpen(false);
    setIssueResult(null);
  };

  return {
    tableState,
    invoices: query.data?.items ?? [],
    totalItems: query.data?.pagination.totalItems ?? 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    refetch: query.refetch,
    buildings,
    roomNameById,
    selectedBuildingId,
    selectedPeriod,
    selectedStatus,
    isFiltered,
    generateDialogOpen,
    isGenerating: generateMutation.isPending,
    generateResult,
    selectedInvoiceIds,
    issueDialogOpen,
    issueResult,
    isIssuing: issueMutation.isPending,
    handleBuildingChange,
    handlePeriodChange,
    handleStatusChange,
    handleClearFilters,
    handleGenerate,
    runGenerate,
    handleCloseGenerateDialog,
    handleCloseGenerateResult,
    handleOpenIssueDialog,
    handleConfirmIssue,
    handleCloseIssueDialog,
  };
};
