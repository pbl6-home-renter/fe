import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/page-header';
import { TenantContractListTable } from '../../components/tenant/tenant-contract-list-table';
import { useTenantContractList } from '../../hooks/use-tenant-contract-list';

export const TenantContractListPage = () => {
  const { t } = useTranslation('contracts');
  const { query, tableState, status, setStatus } = useTenantContractList();
  return (
    <div className="space-y-6">
      <PageHeader title={t('tenant.title')} description={t('tenant.subtitle')} />
      <TenantContractListTable
        contracts={query.data?.items ?? []}
        rowCount={query.data?.pagination.totalItems ?? 0}
        state={tableState.state}
        handlers={tableState.handlers}
        density={tableState.state.density}
        onDensityChange={tableState.setDensity}
        status={status}
        onStatusChange={setStatus}
        onClearFilters={tableState.clearFilters}
        isLoading={query.isLoading}
        isFetching={query.isFetching}
        isError={query.isError}
        onRetry={() => void query.refetch()}
      />
    </div>
  );
};
