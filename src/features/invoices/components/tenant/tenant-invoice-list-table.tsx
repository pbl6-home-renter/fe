import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DataTable } from '@/components/ui/data-table/data-table';
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar';
import type {
  DataTableControlledState,
  DataTableDensity,
  DataTableStateHandlers,
} from '@/components/ui/data-table/data-table.types';
import { MonthPicker } from '@/components/ui/month-picker';
import { ROUTES } from '@/config/routes.config';
import { useDataTable } from '@/hooks/use-data-table';
import { useTenantInvoiceListColumns } from '../../hooks/use-tenant-invoice-list-columns';
import type { TenantInvoiceListItemDto } from '../../types/invoices.dto';
import { TenantInvoiceListMobileRow } from './tenant-invoice-list-mobile-row';

export interface TenantInvoiceListTableProps {
  invoices: TenantInvoiceListItemDto[];
  rowCount: number;
  state: DataTableControlledState;
  handlers: DataTableStateHandlers;
  density: DataTableDensity;
  onDensityChange: (density: DataTableDensity) => void;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  isFiltered: boolean;
  onClearFilters: () => void;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
}

export const TenantInvoiceListTable = (props: TenantInvoiceListTableProps) => {
  const { t } = useTranslation('invoices');
  const navigate = useNavigate();
  const columns = useTenantInvoiceListColumns();

  const table = useDataTable({
    data: props.invoices,
    columns,
    getRowId: (invoice) => invoice.id,
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

  return (
    <DataTable
      table={table}
      tableId="tenant-invoices"
      caption={t('tenantList.title')}
      density={props.density}
      onDensityChange={props.onDensityChange}
      isLoading={props.isLoading}
      isFetching={props.isFetching}
      error={props.isError}
      onRetry={props.onRetry}
      isFiltered={props.isFiltered}
      emptyState={{ title: t('tenantEmpty.title'), description: t('tenantEmpty.description') }}
      filteredEmptyState={{
        title: t('empty.filteredTitle'),
        description: t('tenantEmpty.filteredDescription'),
        actionText: t('filters.clearFilter'),
        onAction: props.onClearFilters,
      }}
      toolbar={
        <DataTableToolbar
          filters={
            <MonthPicker
              value={props.selectedPeriod}
              onChange={props.onPeriodChange}
              placeholder={t('filters.allPeriods')}
              clearable
              clearLabel={t('filters.clearPeriod')}
              aria-label={t('filters.periodLabel')}
            />
          }
        />
      }
      onRowClick={(invoice) => navigate(ROUTES.TENANT.INVOICE_DETAIL(invoice.id))}
      renderMobileRow={(row) => <TenantInvoiceListMobileRow invoice={row.original} />}
    />
  );
};
