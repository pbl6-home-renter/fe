import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table/data-table';
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar';
import type {
  DataTableControlledState,
  DataTableDensity,
  DataTableStateHandlers,
} from '@/components/ui/data-table/data-table.types';
import { useDataTable } from '@/hooks/use-data-table';
import { BuildingStatus } from '../enums/building-status.enum';
import { BuildingListMobileRow } from './building-list-mobile-row';
import { useBuildingListColumns } from './building-list-columns';
import type { BuildingMyListItemDto } from '../types/building.dto';

interface BuildingListTableProps {
  buildings: BuildingMyListItemDto[];
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
  onCreate: () => void;
}

export const BuildingListTable = (props: BuildingListTableProps) => {
  const { t } = useTranslation('buildings');
  const navigate = useNavigate();
  const columns = useBuildingListColumns();
  const table = useDataTable({
    data: props.buildings,
    columns,
    getRowId: (building) => building.id,
    rowCount: props.rowCount,
    mode: 'server',
    state: props.state,
    handlers: props.handlers,
    features: { columnVisibility: true, columnOrder: true, columnResize: true, columnPinning: true },
  });
  const statusOptions = [
    { id: 'all', label: t('filter.all') },
    { id: BuildingStatus.APPROVED, label: t('status.approved') },
    { id: BuildingStatus.PENDING, label: t('status.pending') },
    { id: BuildingStatus.REJECTED, label: t('status.rejected') },
  ];

  return (
    <DataTable
      table={table}
      tableId="landlord-buildings"
      caption={t('title')}
      density={props.density}
      onDensityChange={props.onDensityChange}
      isLoading={props.isLoading}
      isFetching={props.isFetching}
      error={props.isError}
      onRetry={props.onRetry}
      isFiltered={props.isFiltered}
      emptyState={{
        title: t('empty.title'),
        description: t('empty.description'),
        actionText: t('empty.createAction'),
        onAction: props.onCreate,
      }}
      filteredEmptyState={{
        title: t('empty.filteredTitle'),
        description: t('empty.filteredDescription'),
        actionText: t('filter.clearFilter'),
        onAction: props.onClearFilters,
      }}
      toolbar={(
        <DataTableToolbar
          searchValue={props.searchValue}
          onSearchChange={props.onSearchChange}
          searchPlaceholder={t('list.searchPlaceholder')}
          filters={(
            <div className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-xl bg-surface-container-low p-1">
              {statusOptions.map((option) => (
                <Button
                  key={option.id}
                  variant={props.selectedStatus === option.id ? 'secondary' : 'ghost'}
                  size="sm"
                  className="whitespace-nowrap text-xs"
                  onClick={() => props.onStatusChange(option.id)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          )}
        />
      )}
      onRowClick={(building) => navigate(`/buildings/${building.id}`)}
      renderMobileRow={(row) => <BuildingListMobileRow row={row} />}
    />
  );
};
