import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/feedback/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { EmptyState } from '@/components/feedback/empty-state';
import { RoomPublicCard } from './room-public-card';
import type { RoomPublicListItemDto } from '../../types/room.dto';

export interface RoomSearchGridProps {
  rooms: RoomPublicListItemDto[];
  isLoading: boolean;
  isError: boolean;
  isFetching: boolean;
  pageNo: number;
  totalPages: number;
  hasActiveFilters: boolean;
  isFavorites?: boolean;
  onRetry: () => void;
  onResetFilters: () => void;
  onPageChange: (page: number) => void;
  onRequireAuth: () => void;
}

export const RoomSearchGrid = ({
  rooms,
  isLoading,
  isError,
  isFetching,
  pageNo,
  totalPages,
  hasActiveFilters,
  isFavorites,
  onRetry,
  onResetFilters,
  onPageChange,
  onRequireAuth,
}: RoomSearchGridProps) => {
  const { t } = useTranslation('rooms');

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" role="status">
        {Array.from({ length: 8 }, (_, index) => (
          <Card key={index} className="p-0 overflow-hidden rounded-2xl h-84">
            <Skeleton className="h-44 w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={onRetry} />;
  }

  if (rooms.length === 0) {
    if (isFavorites) {
      return (
        <EmptyState
          title={t('favorite.emptyTitle')}
          description={t('favorite.emptyDesc')}
          actionText={t('favorite.findRooms')}
          onAction={onResetFilters}
        />
      );
    }

    return (
      <EmptyState
        title={t('search.filteredEmptyTitle')}
        description={t('search.filteredEmptyDesc')}
        actionText={hasActiveFilters ? t('search.clearFilter') : undefined}
        onAction={hasActiveFilters ? onResetFilters : undefined}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {rooms.map((room) => (
          <RoomPublicCard key={room.id} room={room} onRequireAuth={onRequireAuth} />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-rentify-divider">
          <span className="text-xs text-rentify-text-secondary">
            {t('search.pageInfo', { page: pageNo, total: totalPages })}
          </span>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pageNo - 1)}
              disabled={pageNo <= 1 || isFetching}
              className="text-xs rounded-xl"
            >
              {t('search.prevPage')}
            </Button>
            <span className="text-xs font-bold tabular-nums text-rentify-primary px-2">{pageNo}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onPageChange(pageNo + 1)}
              disabled={pageNo >= totalPages || isFetching}
              className="text-xs rounded-xl"
            >
              {t('search.nextPage')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
