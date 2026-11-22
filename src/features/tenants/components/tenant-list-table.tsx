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
import { ROUTES } from '@/config/routes.config';
import { useTenantListColumns } from './tenant-list-columns';
import { TenantListMobileRow } from './tenant-list-mobile-row';
import type { ContractTenantListItemDto, ContractTenantScope } from '../types/tenant.dto';

export interface TenantListTableProps {
  tenants: ContractTenantListItemDto[];
  rowCount: number;
  state: DataTableControlledState;
  handlers: DataTableStateHandlers;
  density: DataTableDensity;
  onDensityChange: (density: DataTableDensity) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  selectedScope: 'all' | ContractTenantScope;
  onScopeChange: (scope: string) => void;
  isFiltered: boolean;
  onClearFilters: () => void;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
}

export const TenantListTable = (props: TenantListTableProps) => {
  const { t } = useTranslation('tenants');
  const navigate = useNavigate();
  const columns = useTenantListColumns();

  const table = useDataTable({
    data: props.tenants,
    columns,
    getRowId: (tenant) => tenant.contractMemberId,
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

  const scopeFilterOptions = [
    { id: 'all', label: t('filter.all') },
    { id: 'current', label: t('filter.current') },
    { id: 'history', label: t('filter.history') },
  ];

  return (
    <DataTable
      table={table}
      tableId="landlord-tenants"
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
        actionText: t('empty.createContract'),
        onAction: () => navigate(ROUTES.LANDLORD.CONTRACTS),
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
          searchPlaceholder={t('searchPlaceholder')}
          filters={
            <div className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-xl bg-rentify-surface-container-low p-1">
              {scopeFilterOptions.map((option) => (
                <Button
                  key={option.id}
                  variant={props.selectedScope === option.id ? 'secondary' : 'ghost'}
                  size="sm"
                  className="whitespace-nowrap text-xs cursor-pointer"
                  onClick={() => props.onScopeChange(option.id)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          }
        />
      }
      onRowClick={(tenant) => navigate(ROUTES.LANDLORD.TENANT_DETAIL(tenant.contractMemberId))}
      renderMobileRow={(row) => <TenantListMobileRow row={row} />}
    />
  );
};
