import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/feedback/skeleton';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes.config';
import { TenantRoomCards } from '../../components/tenant/tenant-room-cards';
import { useRoomHubQuery } from '../../hooks/use-room-hub-query';

export const TenantRoomsPage = () => {
  const { t } = useTranslation('rooms');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const pageNo = Math.max(1, Number(searchParams.get('page')) || 1);
  const pageSize = 10;

  const { data, isLoading, isFetching, isError, refetch } = useRoomHubQuery({
    pageNo,
    pageSize,
  });

  const rooms = data?.items ?? [];
  const pagination = data?.pagination;
  const totalPages = pagination?.totalPages ?? 1;

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newPage <= 1) {
        next.delete('page');
      } else {
        next.set('page', String(newPage));
      }
      return next;
    });
  };

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
      ) : rooms.length === 0 ? (
        <EmptyState
          title={t('tenantRoom.emptyTitle')}
          description={t('tenantRoom.emptyDescription')}
          actionText={t('tenantRoom.findRoomAction')}
          onAction={() => navigate(ROUTES.ROOMS_SEARCH)}
        />
      ) : (
        <div className="space-y-6">
          <TenantRoomCards rooms={rooms} />

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-rentify-divider">
              <span className="text-xs text-rentify-text-secondary">
                {t('tenantRoom.pageInfo', { page: pageNo, total: totalPages })}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pageNo - 1)}
                  disabled={pageNo <= 1 || isFetching}
                  className="text-xs rounded-xl"
                >
                  {t('tenantRoom.prevPage')}
                </Button>
                <span className="text-xs font-bold tabular-nums text-rentify-primary px-2">{pageNo}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pageNo + 1)}
                  disabled={pageNo >= totalPages || isFetching}
                  className="text-xs rounded-xl"
                >
                  {t('tenantRoom.nextPage')}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
