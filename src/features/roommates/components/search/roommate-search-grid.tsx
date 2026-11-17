import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/feedback/skeleton';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { Button } from '@/components/ui/button';
import { RoommateCard, type CandidateMatchStatus } from './roommate-card';
import type { PublicRoommateProfileDto } from '../../types/roommate.dto';

export interface RoommateSearchGridProps {
  candidates: PublicRoommateProfileDto[];
  totalItems: number;
  totalPages: number;
  pageNo: number;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  hasActiveFilters: boolean;
  isSendingMatch: boolean;
  matchStatusMap?: Map<string, CandidateMatchStatus>;
  pendingOutgoingMap?: Map<string, string>;
  onWithdrawMatchRequest?: (requestId: string) => void;
  isWithdrawingMatch?: boolean;
  onOpenMatchRequests?: () => void;
  onRetry: () => void;
  onResetFilters: () => void;
  onSelectCandidate: (candidate: PublicRoommateProfileDto) => void;
  onSendMatchRequest: (targetId: string) => void;
  onPageChange: (newPage: number) => void;
}

export const RoommateSearchGrid = ({
  candidates,
  totalItems,
  totalPages,
  pageNo,
  isLoading,
  isFetching,
  isError,
  hasActiveFilters,
  isSendingMatch,
  matchStatusMap,
  pendingOutgoingMap,
  onWithdrawMatchRequest,
  isWithdrawingMatch = false,
  onOpenMatchRequests,
  onRetry,
  onResetFilters,
  onSelectCandidate,
  onSendMatchRequest,
  onPageChange,
}: RoommateSearchGridProps) => {
  const { t } = useTranslation('roommates');

  return (
    <div className="flex-1 w-full space-y-5">
      {/* Result Count Header */}
      <div className="flex items-center justify-between pb-3 border-b border-rentify-divider">
        <h2 className="text-base sm:text-lg font-bold tracking-tight text-rentify-text-primary">
          {t('page.matchingCount', { count: totalItems })}
        </h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" role="status">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-72 w-full rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={onRetry} />
      ) : candidates.length === 0 ? (
        hasActiveFilters ? (
          <EmptyState
            title={t('page.filteredEmptyTitle')}
            description={t('page.filteredEmptyDesc')}
            actionText={t('filter.reset')}
            onAction={onResetFilters}
          />
        ) : (
          <EmptyState title={t('page.emptyTitle')} description={t('page.emptyDesc')} />
        )
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {candidates.map((candidate) => (
              <RoommateCard
                key={candidate.id}
                profile={candidate}
                onOpenDetail={() => onSelectCandidate(candidate)}
                onSendMatch={() => onSendMatchRequest(candidate.tenantId)}
                isSendingMatch={isSendingMatch}
                matchStatus={matchStatusMap?.get(candidate.tenantId) || 'none'}
                pendingMatchRequestId={pendingOutgoingMap?.get(candidate.tenantId)}
                onWithdrawMatch={onWithdrawMatchRequest}
                isWithdrawingMatch={isWithdrawingMatch}
                onOpenMatchRequests={onOpenMatchRequests}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-rentify-divider">
              <span className="text-xs text-rentify-text-secondary">
                {t('page.pageInfo', { page: pageNo, total: totalPages })}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(pageNo - 1)}
                  disabled={pageNo <= 1 || isFetching}
                >
                  {t('page.prevPage')}
                </Button>
                <span className="text-xs font-semibold tabular-nums text-rentify-text-primary px-1">{pageNo}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(pageNo + 1)}
                  disabled={pageNo >= totalPages || isFetching}
                >
                  {t('page.nextPage')}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
