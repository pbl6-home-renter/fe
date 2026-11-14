import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/feedback/skeleton';
import { PageHeader } from '@/components/ui/page-header';
import { TenantRoomCards } from '../../components/tenant/tenant-room-cards';
import { useTenantActiveContracts } from '../../hooks/use-tenant-active-contracts';

export const TenantRoomsPage = () => {
  const { t } = useTranslation('rooms');
  const { data, isLoading, isError, refetch } = useTenantActiveContracts();

  return (
    <div className="space-y-6">
      <PageHeader title={t('tenantRoom.title')} description={t('tenantRoom.subtitle')} />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2" role="status">
          <Skeleton className="h-56 w-full rounded-2xl" />
          <Skeleton className="h-56 w-full rounded-2xl" />
        </div>
      ) : isError || !data ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : data.length === 0 ? (
        <EmptyState title={t('tenantRoom.emptyTitle')} description={t('tenantRoom.emptyDescription')} />
      ) : (
        <TenantRoomCards contracts={data} />
      )}
    </div>
  );
};
