import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table/data-table';
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar';
import type {
  DataTableControlledState,
  DataTableDensity,
  DataTableStateHandlers,
} from '@/components/ui/data-table/data-table.types';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { ROUTES } from '@/config/routes.config';
import { useDataTable } from '@/hooks/use-data-table';
import { formatDate, formatVnd } from '@/lib/utils/format';
import { CONTRACT_STATUS_CONFIG } from '../../constants/contract.constants';
import { ContractStatus } from '../../enums/contract-status.enum';
import type { MyContractListItemDto } from '../../types/contract.dto';
import { ContractStatusBadge } from '../contract-status-badge';

export interface TenantContractListTableProps {
  contracts: MyContractListItemDto[];
  rowCount: number;
  state: DataTableControlledState;
  handlers: DataTableStateHandlers;
  density: DataTableDensity;
  onDensityChange: (density: DataTableDensity) => void;
  status: string;
  onStatusChange: (status: string) => void;
  onClearFilters: () => void;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
}

export const TenantContractListTable = (props: TenantContractListTableProps) => {
  const { t } = useTranslation('contracts');
  const navigate = useNavigate();

  const columns = useMemo<ColumnDef<MyContractListItemDto, unknown>[]>(
    () => [
      {
        accessorKey: 'contractCode',
        header: t('columns.code'),
        size: 170,
        minSize: 130,
        enableSorting: false,
        enableHiding: false,
        meta: { label: t('columns.code'), pinnable: true },
        cell: ({ row }) => (
          <span className="font-mono text-sm font-semibold text-rentify-text-primary">{row.original.contractCode}</span>
        ),
      },
      {
        id: 'room',
        header: t('columns.room'),
        size: 220,
        minSize: 150,
        enableSorting: false,
        meta: { label: t('columns.room') },
        cell: ({ row }) => (
          <span className="text-sm text-rentify-text-primary">
            {row.original.buildingName} · {row.original.roomName}
          </span>
        ),
      },
      {
        id: 'period',
        header: t('columns.period'),
        size: 210,
        minSize: 160,
        enableSorting: false,
        meta: { label: t('columns.period') },
        cell: ({ row }) => (
          <span className="text-sm tabular-nums text-rentify-text-secondary">
            {formatDate(row.original.startDate)} – {formatDate(row.original.endDate)}
          </span>
        ),
      },
      {
        accessorKey: 'rentPrice',
        header: t('columns.rentPrice'),
        size: 150,
        minSize: 120,
        enableSorting: false,
        meta: { label: t('columns.rentPrice'), align: 'right' as const },
        cell: ({ row }) => (
          <span className="font-semibold tabular-nums text-rentify-text-primary">
            {formatVnd(row.original.rentPrice)}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: t('columns.status'),
        size: 150,
        minSize: 120,
        enableSorting: false,
        meta: { label: t('columns.status') },
        cell: ({ row }) => <ContractStatusBadge status={row.original.status} />,
      },
    ],
    [t],
  );

  const table = useDataTable({
    data: props.contracts,
    columns,
    getRowId: (contract) => contract.id,
    rowCount: props.rowCount,
    mode: 'server',
    state: props.state,
    handlers: props.handlers,
    features: { columnVisibility: true, columnOrder: true, columnResize: true, columnPinning: true },
  });

  return (
    <DataTable
      table={table}
      tableId="tenant-contracts"
      caption={t('tenant.title')}
      density={props.density}
      onDensityChange={props.onDensityChange}
      isLoading={props.isLoading}
      isFetching={props.isFetching}
      error={props.isError}
      onRetry={props.onRetry}
      isFiltered={Boolean(props.status)}
      emptyState={{ title: t('tenant.emptyTitle'), description: t('tenant.emptyDescription') }}
      filteredEmptyState={{
        title: t('empty.filteredTitle'),
        description: t('tenant.emptyDescription'),
        actionText: t('filter.clearFilter'),
        onAction: props.onClearFilters,
      }}
      toolbar={
        <DataTableToolbar
          filters={
            <SelectDropdown
              value={props.status}
              searchable={false}
              options={[
                { value: '', label: t('tenant.allStatuses') },
                ...Object.values(ContractStatus).map((value) => ({
                  value,
                  label: t(CONTRACT_STATUS_CONFIG[value].labelKey),
                })),
              ]}
              onChange={(event) => props.onStatusChange(event.target.value)}
              containerClassName="w-full sm:w-52"
            />
          }
        />
      }
      onRowClick={(contract) => navigate(ROUTES.TENANT.CONTRACT_DETAIL(contract.id))}
      renderMobileRow={(row) => (
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <p className="font-mono text-sm font-semibold text-rentify-text-primary">{row.original.contractCode}</p>
            <ContractStatusBadge status={row.original.status} />
          </div>
          <p className="text-xs text-rentify-text-secondary">
            {row.original.buildingName} · {row.original.roomName}
          </p>
          <div className="flex items-center justify-between text-xs">
            <span className="tabular-nums text-rentify-text-secondary">
              {formatDate(row.original.startDate)} – {formatDate(row.original.endDate)}
            </span>
            <span className="font-semibold tabular-nums text-rentify-text-primary">
              {formatVnd(row.original.rentPrice)}
            </span>
          </div>
        </div>
      )}
    />
  );
};
