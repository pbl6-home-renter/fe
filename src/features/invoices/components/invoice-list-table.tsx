import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table/data-table';
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar';
import type {
  DataTableControlledState,
  DataTableDensity,
  DataTableStateHandlers,
} from '@/components/ui/data-table/data-table.types';
import { MonthPicker } from '@/components/ui/month-picker';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { ROUTES } from '@/config/routes.config';
import type { BuildingMyListItemDto } from '@/features/buildings/types/building.dto';
import { useDataTable } from '@/hooks/use-data-table';
import { InvoiceStatus } from '../enums/invoice-status.enum';
import type { InvoiceListItemDto } from '../types/invoices.dto';
import { useInvoiceListColumns } from '../hooks/use-invoice-list-columns';
import { InvoiceListMobileRow } from './invoice-list-mobile-row';

export interface InvoiceListTableProps {
  invoices: InvoiceListItemDto[];
  rowCount: number;
  buildings: BuildingMyListItemDto[];
  state: DataTableControlledState;
  handlers: DataTableStateHandlers;
  density: DataTableDensity;
  onDensityChange: (density: DataTableDensity) => void;
  selectedBuildingId: string;
  onBuildingChange: (buildingId: string) => void;
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedInvoiceCount: number;
  onOpenIssueDialog: () => void;
  isFiltered: boolean;
  onClearFilters: () => void;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
}

export const InvoiceListTable = (props: InvoiceListTableProps) => {
  const { t } = useTranslation('invoices');
  const navigate = useNavigate();
  const columns = useInvoiceListColumns();

  const table = useDataTable({
    data: props.invoices,
    columns,
    getRowId: (invoice) => invoice.id,
    rowCount: props.rowCount,
    mode: 'server',
    state: props.state,
    handlers: props.handlers,
    features: {
      selection: (row) => row.original.invoiceStatus === InvoiceStatus.PENDING,
      columnVisibility: true,
      columnOrder: true,
      columnResize: true,
      columnPinning: true,
    },
  });

  const buildingOptions = [
    { value: 'all', label: t('filters.allBuildings') },
    ...props.buildings.map((building) => ({ value: building.id, label: building.name })),
  ];

  const statusOptions = [
    { value: 'all', label: t('filters.allStatuses') },
    { value: InvoiceStatus.PENDING, label: t('status.pending') },
    { value: InvoiceStatus.ISSUED, label: t('status.issued') },
    { value: InvoiceStatus.VOID, label: t('status.void') },
  ];

  return (
    <DataTable
      table={table}
      tableId="landlord-invoices"
      caption={t('list.title')}
      density={props.density}
      onDensityChange={props.onDensityChange}
      isLoading={props.isLoading}
      isFetching={props.isFetching}
      error={props.isError}
      onRetry={props.onRetry}
      isFiltered={props.isFiltered}
      emptyState={{ title: t('empty.title'), description: t('empty.description') }}
      filteredEmptyState={{
        title: t('empty.filteredTitle'),
        description: t('empty.filteredDescription'),
        actionText: t('filters.clearFilter'),
        onAction: props.onClearFilters,
      }}
      selectionActions={
        <Button type="button" variant="primary" size="sm" onClick={props.onOpenIssueDialog} className="gap-1.5">
          <Send className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{t('actions.issueSelected', { count: props.selectedInvoiceCount })}</span>
        </Button>
      }
      toolbar={
        <DataTableToolbar
          filters={
            <div className="flex w-full flex-col gap-2.5 lg:flex-row lg:flex-wrap lg:items-center">
              <div className="w-full sm:w-56">
                <SelectDropdown
                  options={buildingOptions}
                  value={props.selectedBuildingId}
                  onChange={(event) => props.onBuildingChange(event.target.value)}
                  leadingIcon={<Building2 className="h-4 w-4 text-rentify-text-secondary" aria-hidden="true" />}
                  aria-label={t('filters.buildingLabel')}
                />
              </div>

              <MonthPicker
                value={props.selectedPeriod}
                onChange={props.onPeriodChange}
                placeholder={t('filters.allPeriods')}
                clearable
                clearLabel={t('filters.clearPeriod')}
                aria-label={t('filters.periodLabel')}
              />

              <SegmentedControl
                label={t('columns.status')}
                value={props.selectedStatus}
                options={statusOptions}
                onChange={props.onStatusChange}
                className="max-w-full overflow-x-auto"
                itemClassName="whitespace-nowrap"
              />
            </div>
          }
        />
      }
      onRowClick={(invoice) => navigate(ROUTES.LANDLORD.INVOICE_DETAIL(invoice.id))}
      renderMobileRow={(row) => (
        <InvoiceListMobileRow
          invoice={row.original}
          isSelected={row.getIsSelected()}
          onToggleSelected={(checked) => row.toggleSelected(checked)}
        />
      )}
    />
  );
};
