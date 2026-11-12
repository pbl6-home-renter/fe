import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/page-header';
import { TenantInvoiceListTable } from '../../components/tenant/tenant-invoice-list-table';
import { useTenantInvoiceList } from '../../hooks/use-tenant-invoice-list';

export const TenantInvoiceListPage = () => {
  const { t } = useTranslation('invoices');
  const {
    invoices,
    rowCount,
    isLoading,
    isFetching,
    isError,
    refetch,
    tableState,
    selectedPeriod,
    isFiltered,
    handlePeriodChange,
    handleClearFilters,
  } = useTenantInvoiceList();

  return (
    <div className="space-y-6">
      <PageHeader title={t('tenantList.title')} description={t('tenantList.subtitle')} />

      <TenantInvoiceListTable
        invoices={invoices}
        rowCount={rowCount}
        state={tableState.state}
        handlers={tableState.handlers}
        density={tableState.state.density}
        onDensityChange={tableState.setDensity}
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
        isFiltered={isFiltered}
        onClearFilters={handleClearFilters}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRetry={() => void refetch()}
      />
    </div>
  );
};
