import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Building2, FileCheck2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table/data-table';
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar';
import type {
  DataTableControlledState,
  DataTableDensity,
  DataTableStateHandlers,
} from '@/components/ui/data-table/data-table.types';
import { useDataTable } from '@/hooks/use-data-table';
import { formatDate } from '@/lib/utils/format';
import type { BuildingAdminListItemDto } from '../../types/building.dto';
import { BuildingStatusBadge } from '../building-status-badge';
import { ApprovalStatusTabs } from './approval-status-tabs';

interface ApprovalTableProps {
  buildings: BuildingAdminListItemDto[];
  rowCount: number;
  state: DataTableControlledState;
  handlers: DataTableStateHandlers;
  density: DataTableDensity;
  onDensityChange: (density: DataTableDensity) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  isFiltered: boolean;
  onClearFilters: () => void;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
}

export const ApprovalTable = ({
  buildings,
  rowCount,
  state,
  handlers,
  density,
  onDensityChange,
  searchValue,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  isFiltered,
  onClearFilters,
  isLoading,
  isFetching,
  isError,
  onRetry,
}: ApprovalTableProps) => {
  const { t } = useTranslation('buildings');
  const navigate = useNavigate();
  const columns = useMemo<ColumnDef<BuildingAdminListItemDto, unknown>[]>(() => [
    {
      accessorKey: 'name',
      header: t('admin.colBuilding'),
      size: 280,
      minSize: 210,
      meta: { label: t('admin.colBuilding'), pinnable: true },
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rentify-primary-container text-rentify-primary">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold group-hover:text-rentify-primary">{row.original.name}</p>
            <p className="truncate text-xs text-rentify-text-secondary">
              {t('admin.roomsCount', { count: row.original.totalRooms })}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'documents',
      accessorKey: 'documentsCount',
      header: t('admin.colDocuments'),
      enableSorting: false,
      size: 170,
      meta: { label: t('admin.colDocuments') },
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-container-low px-2.5 py-1 text-xs font-medium">
          <FileCheck2 className="h-3.5 w-3.5 text-rentify-primary" />
          {t('admin.docsCount', { count: row.original.documentsCount })}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: t('admin.colCreatedAt'),
      size: 160,
      meta: { label: t('admin.colCreatedAt') },
      cell: ({ row }) => <span className="text-rentify-text-secondary">{formatDate(row.original.createdAt)}</span>,
    },
    {
      accessorKey: 'status',
      header: t('admin.colStatus'),
      size: 150,
      meta: { label: t('admin.colStatus') },
      cell: ({ row }) => <BuildingStatusBadge status={row.original.status} variant="pill" />,
    },
    {
      id: 'actions',
      header: t('admin.colActions'),
      enableSorting: false,
      enableHiding: false,
      enableResizing: false,
      size: 140,
      meta: { label: t('admin.colActions'), align: 'right', pinnable: true, hideable: false },
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          className="ml-auto gap-1.5 text-rentify-primary"
          onClick={(event) => {
            event.stopPropagation();
            navigate(`/admin/buildings/${row.original.id}`);
          }}
        >
          {t('admin.reviewAction')}
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      ),
    },
  ], [navigate, t]);

  const table = useDataTable({
    data: buildings,
    columns,
    getRowId: (building) => building.id,
    rowCount,
    mode: 'server',
    state,
    handlers,
    features: {
      columnVisibility: true,
      columnOrder: true,
      columnResize: true,
      columnPinning: true,
    },
  });

  return (
    <DataTable
      table={table}
      tableId="admin-building-approvals"
      caption={t('admin.queueTitle')}
      density={density}
      onDensityChange={onDensityChange}
      isLoading={isLoading}
      isFetching={isFetching}
      error={isError}
      onRetry={onRetry}
      isFiltered={isFiltered}
      emptyState={{ title: t('admin.emptyTitle'), description: t('admin.emptyDesc') }}
      filteredEmptyState={{
        title: t('empty.filteredTitle'),
        description: t('empty.filteredDescription'),
        actionText: t('filter.clearFilter'),
        onAction: onClearFilters,
      }}
      toolbar={(
        <DataTableToolbar
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          searchPlaceholder={t('admin.searchPlaceholder')}
          filters={<ApprovalStatusTabs selectedStatus={selectedStatus} onSelectStatus={onStatusChange} />}
        />
      )}
      onRowClick={(building) => navigate(`/admin/buildings/${building.id}`)}
      renderMobileRow={(row) => (
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-rentify-text-primary">{row.original.name}</p>
              <p className="mt-0.5 text-xs text-rentify-text-secondary">
                {t('admin.roomsCount', { count: row.original.totalRooms })}
              </p>
            </div>
            <BuildingStatusBadge status={row.original.status} variant="pill" />
          </div>
          <div className="flex items-center justify-between text-xs text-rentify-text-secondary">
            <span>{t('admin.docsCount', { count: row.original.documentsCount })}</span>
            <span>{formatDate(row.original.createdAt)}</span>
          </div>
        </div>
      )}
    />
  );
};
