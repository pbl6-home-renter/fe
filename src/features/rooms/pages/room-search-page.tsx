import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { Skeleton } from '@/components/feedback/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { EmptyState } from '@/components/feedback/empty-state';
import { RoomPublicCard } from '../components/search/room-public-card';
import { RoomSearchFilterSidebar } from '../components/search/room-search-filter-sidebar';
import { LoginPromptModal } from '../components/search/login-prompt-modal';
import { useRoomSearch } from '../hooks/use-room-search';

export const RoomSearchPage = () => {
  const { t } = useTranslation('rooms');
  const [authPromptOpen, setAuthPromptOpen] = useState(false);

  const {
    rooms,
    pagination,
    draftFilters,
    hasActiveFilters,
    order,
    isLoading,
    isFetching,
    isError,
    pageNo,
    refetch,
    handleDraftChange,
    handleApplyFilter,
    handleResetFilter,
    handleSortChange,
    handlePageChange,
  } = useRoomSearch();

  const totalCount = pagination?.totalItems ?? 0;
  const totalPages = pagination?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <PageHeader title={t('search.pageTitle')} description={t('search.pageSubtitle')} />

      {/* Main Content Layout: Left Sidebar + Right Room Cards */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Filter Sidebar */}
        <RoomSearchFilterSidebar
          draftFilters={draftFilters}
          hasActiveFilters={hasActiveFilters}
          onDraftChange={handleDraftChange}
          onApply={handleApplyFilter}
          onReset={handleResetFilter}
        />

        {/* Right Main Content */}
        <div className="flex-1 w-full space-y-5">
          {/* Header Row: Count & Sort */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-rentify-divider">
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-rentify-text-primary">
              {t('search.matchingCount', { count: totalCount })}
            </h2>

            <div className="w-48 self-end sm:self-auto shrink-0">
              <SelectDropdown
                label={t('search.sortBy')}
                value={order}
                options={[
                  { value: 'asc', label: t('search.priceAsc') },
                  { value: 'desc', label: t('search.priceDesc') },
                ]}
                onChange={(e) => handleSortChange(e.target.value as 'asc' | 'desc')}
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5" role="status">
              {Array.from({ length: 8 }, (_, index) => (
                <Skeleton key={index} className="h-80 w-full rounded-2xl" />
              ))}
            </div>
          ) : isError ? (
            <ErrorState onRetry={() => void refetch()} />
          ) : rooms.length === 0 ? (
            hasActiveFilters ? (
              <EmptyState
                title={t('search.filteredEmptyTitle')}
                description={t('search.filteredEmptyDesc')}
                actionText={t('search.clearFilter')}
                onAction={handleResetFilter}
              />
            ) : (
              <EmptyState title={t('search.emptyTitle')} description={t('search.emptyDesc')} />
            )
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
                {rooms.map((room) => (
                  <RoomPublicCard key={room.id} room={room} onRequireAuth={() => setAuthPromptOpen(true)} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-rentify-divider">
                  <span className="text-xs text-rentify-text-secondary">
                    {t('search.pageInfo', { page: pageNo, total: totalPages })}
                  </span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pageNo - 1)}
                      disabled={pageNo <= 1 || isFetching}
                    >
                      {t('search.prevPage')}
                    </Button>
                    <span className="text-xs font-semibold tabular-nums text-rentify-text-primary px-1">{pageNo}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pageNo + 1)}
                      disabled={pageNo >= totalPages || isFetching}
                    >
                      {t('search.nextPage')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Auth Prompt Modal */}
      <LoginPromptModal open={authPromptOpen} onClose={() => setAuthPromptOpen(false)} />
    </div>
  );
};
