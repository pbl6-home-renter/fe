import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/feedback/skeleton';
import { PageHeader } from '@/components/ui/page-header';
import { ROUTES } from '@/config/routes.config';
import { TenantRoomCards } from '@/features/rooms/components/tenant/tenant-room-cards';
import { useTenantActiveContracts } from '@/features/rooms/hooks/use-tenant-active-contracts';

export const TenantDashboardPage = () => {
  const { t } = useTranslation('rooms');
  const { data, isLoading, isError, refetch } = useTenantActiveContracts();
  return (
    <div className="space-y-6">
      <PageHeader title={t('tenantRoom.dashboardTitle')} description={t('tenantRoom.dashboardDescription')} />
      <Link to={ROUTES.TENANT.INVOICES} className="text-sm font-medium text-rentify-primary hover:underline">{t('tenantRoom.viewInvoices')}</Link>
      {isLoading ? <Skeleton className="h-48 w-full rounded-2xl" /> : isError || !data ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : data.length === 0 ? (
        <EmptyState title={t('tenantRoom.emptyTitle')} description={t('tenantRoom.emptyDescription')} />
      ) : <>
        <p className="text-sm text-rentify-text-secondary">{t('tenantRoom.activeCount', { count: data.length })}</p>
        <TenantRoomCards contracts={data} />
      </>}
    </div>
  );
};
