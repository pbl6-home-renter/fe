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
import { ContractStatus } from '../enums/contract-status.enum';
import { ContractListMobileRow } from './contract-list-mobile-row';
import { useContractListColumns } from './contract-list-columns';
import { SelectDropdown, type SelectOption } from '@/components/ui/select-dropdown';
import { ROUTES } from '@/config/routes.config';
import type { ContractListItemDto } from '../types/contract.dto';
import type { BuildingMyListItemDto } from '@/features/buildings/types/building.dto';

interface ContractListTableProps {
  contracts: ContractListItemDto[];
  buildings: BuildingMyListItemDto[];
  selectedBuildingId: string;
  onBuildingChange: (buildingId: string) => void;
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

export const ContractListTable = (props: ContractListTableProps) => {
  const { t } = useTranslation('contracts');
  const navigate = useNavigate();
  const columns = useContractListColumns();

  const table = useDataTable({
    data: props.contracts,
    columns,
    getRowId: (contract) => contract.id,
    rowCount: props.rowCount,
    mode: 'server',
    state: props.state,
    handlers: props.handlers,
    features: {
      columnVisibility: true,
      columnOrder: true,
      columnResize: true,
      columnPinning: true,
    },
  });

  const statusOptions = [
    { id: 'all', label: t('filter.all') },
    { id: ContractStatus.DRAFT, label: t('status.draft') },
    { id: ContractStatus.ACTIVE, label: t('status.active') },
    { id: ContractStatus.TERMINATED, label: t('status.terminated') },
    { id: ContractStatus.EXPIRED, label: t('status.expired') },
  ];

  const buildingOptions: SelectOption[] = [
    { value: 'all', label: t('filter.allBuildings') },
    ...props.buildings.map((b) => ({ value: b.id, label: b.name })),
  ];

  return (
    <DataTable
      table={table}
      tableId="landlord-contracts"
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
      toolbar={
        <DataTableToolbar
          searchValue={props.searchValue}
          onSearchChange={props.onSearchChange}
          searchPlaceholder={t('columns.code') + ', ' + t('columns.room') + '...'}
          filters={
            <div className="flex flex-wrap items-center gap-2">
              <div className="w-48">
                <SelectDropdown
                  value={props.selectedBuildingId}
                  options={buildingOptions}
                  searchable={false}
                  onChange={(e) => props.onBuildingChange(e.target.value)}
                />
              </div>

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
            </div>
          }
        />
      }
      onRowClick={(contract) => navigate(ROUTES.LANDLORD.CONTRACT_DETAIL(contract.id))}
      renderMobileRow={(row) => <ContractListMobileRow row={row} />}
    />
  );
};
