import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Eye, Paperclip } from 'lucide-react';
import type { ColumnDef, Row } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table/data-table';
import type {
  DataTableControlledState,
  DataTableDensity,
  DataTableStateHandlers,
} from '@/components/ui/data-table/data-table.types';
import { IconButton } from '@/components/ui/icon-button';
import type { SelectOption } from '@/components/ui/select-dropdown';
import { useDataTable } from '@/hooks/use-data-table';
import { formatDateTime } from '@/lib/utils/format';
import { APPEAL_STATUS_VALUES } from '../../enums/moderation.enum';
import type { AppealAdminListItemDto } from '../../types/moderation.dto';
import { AppealStatusBadge } from '../moderation-status-badge';
import { ModerationListToolbar } from './moderation-list-toolbar';
import { ModerationUserCell } from './moderation-user-cell';

export interface AppealListTableProps {
  appeals: AppealAdminListItemDto[];
  rowCount: number;
  state: DataTableControlledState;
  handlers: DataTableStateHandlers;
  density: DataTableDensity;
  onDensityChange: (density: DataTableDensity) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  userId: string | null;
  onClearUser: () => void;
  isFiltered: boolean;
  onClearFilters: () => void;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
  onViewDetail: (appeal: AppealAdminListItemDto) => void;
}

const useAppealColumns = (onViewDetail: (appeal: AppealAdminListItemDto) => void) => {
  const { t } = useTranslation('moderation');

  return useMemo<ColumnDef<AppealAdminListItemDto, unknown>[]>(
    () => [
      {
        id: 'user',
        header: t('appeals.columns.user'),
        enableSorting: false,
        enableHiding: false,
        size: 280,
        minSize: 200,
        meta: { label: t('appeals.columns.user'), hideable: false },
        cell: ({ row }) => <ModerationUserCell user={row.original.user} />,
      },
      {
        accessorKey: 'lockReason',
        header: t('appeals.columns.lockReason'),
        enableSorting: false,
        size: 300,
        minSize: 180,
        meta: { label: t('appeals.columns.lockReason') },
        cell: ({ row }) => (
          <span className="line-clamp-2 text-sm text-rentify-text-primary">
            {row.original.lockReason ?? t('locked.noReason')}
          </span>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: t('appeals.columns.createdAt'),
        enableSorting: false,
        size: 200,
        minSize: 160,
        meta: { label: t('appeals.columns.createdAt') },
        cell: ({ row }) => (
          <span className="flex items-center gap-1.5 text-sm tabular-nums">
            {formatDateTime(row.original.createdAt)}
            {row.original.attachmentCount > 0 && (
              <span className="inline-flex items-center gap-0.5 text-xs text-rentify-text-secondary">
                <Paperclip className="h-3 w-3" aria-hidden="true" />
                {row.original.attachmentCount}
              </span>
            )}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: t('appeals.columns.status'),
        enableSorting: false,
        size: 160,
        meta: { label: t('appeals.columns.status') },
        cell: ({ row }) => <AppealStatusBadge status={row.original.status} />,
      },
      {
        id: 'actions',
        header: t('columns.actions'),
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 96,
        meta: { label: t('columns.actions'), align: 'right', pinnable: true, hideable: false },
        cell: ({ row }) => (
          <div className="flex justify-end" onClick={(event) => event.stopPropagation()}>
            <IconButton
              variant="ghost"
              size="sm"
              aria-label={t('actions.viewDetail')}
              onClick={() => onViewDetail(row.original)}
              className="h-8 w-8 text-rentify-text-secondary hover:text-rentify-primary"
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
            </IconButton>
          </div>
        ),
      },
    ],
    [t, onViewDetail],
  );
};

const AppealMobileRow = ({ row }: { row: Row<AppealAdminListItemDto> }) => {
  const { t } = useTranslation('moderation');
  const appeal = row.original;

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <ModerationUserCell user={appeal.user} />
        <AppealStatusBadge status={appeal.status} />
      </div>
      <p className="line-clamp-2 text-xs text-rentify-text-secondary">{appeal.lockReason ?? t('locked.noReason')}</p>
      <p className="text-xs tabular-nums text-rentify-text-secondary">{formatDateTime(appeal.createdAt)}</p>
    </div>
  );
};

export const AppealListTable = ({
  appeals,
  rowCount,
  state,
  handlers,
  density,
  onDensityChange,
  selectedStatus,
  onStatusChange,
  userId,
  onClearUser,
  isFiltered,
  onClearFilters,
  isLoading,
  isFetching,
  isError,
  onRetry,
  onViewDetail,
}: AppealListTableProps) => {
  const { t } = useTranslation('moderation');
  const columns = useAppealColumns(onViewDetail);

  const statusOptions = useMemo<readonly SelectOption[]>(
    () => [
      { value: 'all', label: t('filters.allStatuses') },
      ...APPEAL_STATUS_VALUES.map((status) => ({ value: status, label: t(`appealStatus.${status}`) })),
    ],
    [t],
  );

  const table = useDataTable({
    data: appeals,
    columns,
    getRowId: (appeal) => appeal.id,
    rowCount,
    mode: 'server',
    state,
    handlers,
    features: { columnVisibility: true, columnOrder: true, columnResize: true, columnPinning: true },
  });

  return (
    <DataTable
      table={table}
      tableId="admin-appeals"
      caption={t('appeals.title')}
      density={density}
      onDensityChange={onDensityChange}
      isLoading={isLoading}
      isFetching={isFetching}
      error={isError}
      onRetry={onRetry}
      isFiltered={isFiltered}
      emptyState={{ title: t('appeals.empty.title'), description: t('appeals.empty.description') }}
      filteredEmptyState={{
        title: t('empty.filteredTitle'),
        description: t('empty.filteredDescription'),
        actionText: t('filters.reset'),
        onAction: onClearFilters,
      }}
      toolbar={
        <ModerationListToolbar
          statusOptions={statusOptions}
          selectedStatus={selectedStatus}
          onStatusChange={onStatusChange}
          userId={userId}
          onClearUser={onClearUser}
          isFiltered={isFiltered}
          onClearFilters={onClearFilters}
        />
      }
      onRowClick={(appeal) => onViewDetail(appeal)}
      renderMobileRow={(row) => <AppealMobileRow row={row} />}
    />
  );
};
