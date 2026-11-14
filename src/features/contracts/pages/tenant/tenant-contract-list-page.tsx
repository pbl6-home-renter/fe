import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/feedback/skeleton';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { ROUTES } from '@/config/routes.config';
import { formatDate, formatVnd } from '@/lib/utils/format';
import { ContractStatusBadge } from '../../components/contract-status-badge';
import { CONTRACT_STATUS_CONFIG } from '../../constants/contract.constants';
import { ContractStatus } from '../../enums/contract-status.enum';
import { useTenantContractList } from '../../hooks/use-tenant-contract-list';

export const TenantContractListPage = () => {
  const { t } = useTranslation('contracts');
  const { data, isLoading, isError, isFetching, refetch, pageNo, status, setPage, setStatus } = useTenantContractList();
  const options = [
    { value: '', label: t('tenant.allStatuses') },
    ...Object.values(ContractStatus).map((value) => ({ value, label: t(CONTRACT_STATUS_CONFIG[value].labelKey) })),
  ];
  return (
    <div className="space-y-6">
      <PageHeader title={t('tenant.title')} description={t('tenant.subtitle')} />
      <SelectDropdown label={t('tenant.status')} value={status} options={options} onChange={(event) => setStatus(event.target.value)} containerClassName="max-w-xs" />
      {isLoading ? <Skeleton className="h-48 w-full rounded-2xl" /> : isError || !data ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : (
        <>
          {data.items.length === 0 ? <EmptyState title={t('tenant.emptyTitle')} description={t('tenant.emptyDescription')} /> : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.items.map((contract) => (
              <Link key={contract.id} to={ROUTES.TENANT.CONTRACT_DETAIL(contract.id)} className="block rounded-2xl focus-visible:ring-2 focus-visible:ring-rentify-primary">
                <Card variant="interactive" className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-semibold text-rentify-text-primary">{contract.contractCode}</h2>
                    <ContractStatusBadge status={contract.status} />
                  </div>
                  <p className="text-sm text-rentify-text-primary">{contract.buildingName} · {contract.roomName}</p>
                  <p className="text-sm text-rentify-text-secondary">{t('tenant.dates', { start: formatDate(contract.startDate), end: formatDate(contract.endDate) })}</p>
                  <p className="text-sm font-semibold tabular-nums text-rentify-text-primary">{t('tenant.rentValue', { value: formatVnd(contract.rentPrice) })}</p>
                </Card>
              </Link>
            ))}
          </div>
          )}
          {(data.pagination.totalPages > 1 || pageNo > 1) && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-rentify-text-secondary">{t('tenant.page', { page: pageNo, total: data.pagination.totalPages })}</span>
            <div className="flex gap-2">
              <Button variant="outline" disabled={!data.pagination.hasPreviousPage || isFetching} onClick={() => setPage(pageNo - 1)}>{t('tenant.previous')}</Button>
              <Button variant="outline" disabled={!data.pagination.hasNextPage || isFetching} onClick={() => setPage(pageNo + 1)}>{t('tenant.next')}</Button>
            </div>
          </div>
          )}
        </>
      )}
    </div>
  );
};
