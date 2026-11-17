import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, UserCheck, UserPlus } from 'lucide-react';
import { PageHeader } from '@/components/ui/page-header';
import { Button } from '@/components/ui/button';
import { LoginPromptModal } from '@/features/rooms/components/search/login-prompt-modal';
import { ROUTES } from '@/config/routes.config';
import { useRoommateSearch } from '../hooks/use-roommate-search';
import { RoommateSearchFilterSidebar } from '../components/search/roommate-search-filter-sidebar';
import { RoommateSearchGrid } from '../components/search/roommate-search-grid';
import { RoommateDetailModal } from '../components/search/roommate-detail-modal';
import { MatchRequestsDialog } from '../components/requests/match-requests-dialog';

export const RoommatesPage = () => {
  const { t } = useTranslation('roommates');
  const navigate = useNavigate();

  const {
    candidates,
    candidateMap,
    matchStatusMap,
    pendingOutgoingMap,
    pagination,
    pageNo,
    isLoading,
    isFetching,
    isError,
    refetch,
    draftFilters,
    hasActiveFilters,
    handleDraftChange,
    handleApplyFilter,
    handleResetFilter,
    handlePageChange,
    selectedCandidate,
    setSelectedCandidate,
    matchRequestsOpen,
    setMatchRequestsOpen,
    authPromptOpen,
    setAuthPromptOpen,
    handleSendMatchRequest,
    handleWithdrawMatchRequest,
    isSendingMatch,
    isWithdrawingMatch,
    isAuthenticated,
  } = useRoommateSearch();

  const totalPages = pagination?.totalPages ?? 1;
  const totalItems = pagination?.totalItems ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('page.title')}
        description={t('page.subtitle')}
        actions={
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  onClick={() => setMatchRequestsOpen(true)}
                >
                  <UserCheck className="h-4 w-4 text-rentify-primary" />
                  <span>{t('page.matchRequestsAction')}</span>
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  className="gap-1.5 text-xs font-semibold"
                  onClick={() => navigate(ROUTES.TENANT.ROOMMATES_PROFILE)}
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{t('page.myProfileAction')}</span>
                </Button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                className="gap-1.5 text-xs font-semibold"
                onClick={() => setAuthPromptOpen(true)}
              >
                <UserPlus className="h-4 w-4" />
                <span>{t('page.joinAction')}</span>
              </Button>
            )}
          </div>
        }
      />

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <RoommateSearchFilterSidebar
          draftFilters={draftFilters}
          hasActiveFilters={hasActiveFilters}
          onDraftChange={handleDraftChange}
          onApply={handleApplyFilter}
          onReset={handleResetFilter}
        />

        <RoommateSearchGrid
          candidates={candidates}
          totalItems={totalItems}
          totalPages={totalPages}
          pageNo={pageNo}
          isLoading={isLoading}
          isFetching={isFetching}
          isError={isError}
          hasActiveFilters={hasActiveFilters}
          isSendingMatch={isSendingMatch}
          matchStatusMap={matchStatusMap}
          pendingOutgoingMap={pendingOutgoingMap}
          onWithdrawMatchRequest={handleWithdrawMatchRequest}
          isWithdrawingMatch={isWithdrawingMatch}
          onOpenMatchRequests={() => setMatchRequestsOpen(true)}
          onRetry={() => void refetch()}
          onResetFilters={handleResetFilter}
          onSelectCandidate={setSelectedCandidate}
          onSendMatchRequest={handleSendMatchRequest}
          onPageChange={handlePageChange}
        />
      </div>

      <RoommateDetailModal
        profile={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        matchStatus={selectedCandidate ? matchStatusMap.get(selectedCandidate.tenantId) || 'none' : 'none'}
        pendingMatchRequestId={selectedCandidate ? pendingOutgoingMap.get(selectedCandidate.tenantId) : undefined}
        onSendMatch={(targetId) => {
          handleSendMatchRequest(targetId);
          setSelectedCandidate(null);
        }}
        onWithdrawMatch={(requestId) => {
          handleWithdrawMatchRequest(requestId);
          setSelectedCandidate(null);
        }}
        onOpenMatchRequests={() => setMatchRequestsOpen(true)}
        isSendingMatch={isSendingMatch}
        isWithdrawingMatch={isWithdrawingMatch}
      />

      <MatchRequestsDialog
        open={matchRequestsOpen}
        onClose={() => setMatchRequestsOpen(false)}
        candidateMap={candidateMap}
        onViewCandidate={(c) => {
          setMatchRequestsOpen(false);
          setSelectedCandidate(c);
        }}
      />

      <LoginPromptModal open={authPromptOpen} onClose={() => setAuthPromptOpen(false)} />
    </div>
  );
};
