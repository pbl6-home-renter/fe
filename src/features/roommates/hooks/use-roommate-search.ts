import { useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { useRoommateProfilesQuery } from './use-roommate-profiles-query';
import { useMyRoommateProfileQuery } from './use-my-roommate-profile-query';
import { useMatchRequestsQuery } from './use-match-requests-query';
import { useCreateMatchRequestMutation } from './use-create-match-request-mutation';
import { useWithdrawMatchRequestMutation } from './use-match-request-actions-mutation';
import { useRoommateSearchUrlParams, type RoommateSearchFilterState } from './use-roommate-search-url-params';
import type { PublicRoommateProfileDto, CandidateMatchStatus } from '../types/roommate.dto';

export type { RoommateSearchFilterState };

export const useRoommateSearch = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedCandidate, setSelectedCandidate] = useState<PublicRoommateProfileDto | null>(null);
  const [matchRequestsOpen, setMatchRequestsOpen] = useState(false);
  const [authPromptOpen, setAuthPromptOpen] = useState(false);

  const {
    pageNo,
    appliedArea,
    appliedGender,
    draftFilters,
    hasActiveFilters,
    handleDraftChange,
    handleApplyFilter,
    handleResetFilter,
    handlePageChange,
  } = useRoommateSearchUrlParams();

  const isClientFiltering = appliedGender !== 'all';
  const queryParams = useMemo(() => {
    const area = appliedArea.trim();
    return {
      pageNo: isClientFiltering ? 1 : pageNo,
      pageSize: isClientFiltering ? 100 : 12,
      filter: area ? { preferredArea: area } : undefined,
    };
  }, [pageNo, appliedArea, isClientFiltering]);

  const { data, isLoading, isFetching, isError, refetch } = useRoommateProfilesQuery(queryParams, { enabled: true });
  const { data: myProfile } = useMyRoommateProfileQuery({ enabled: isAuthenticated });
  const { data: allRequestsData } = useMatchRequestsQuery({ pageNo: 1, pageSize: 100 }, { enabled: isAuthenticated });

  const createMatchMutation = useCreateMatchRequestMutation();
  const withdrawMatchMutation = useWithdrawMatchRequestMutation();
  const currentUserId = (myProfile?.tenantId || user?.id || '').trim().toLowerCase();

  const rawCandidates = useMemo(() => data?.items ?? [], [data?.items]);
  const filteredCandidates = useMemo(() => {
    if (!isClientFiltering) return rawCandidates;
    return rawCandidates.filter((c) => c.gender === appliedGender);
  }, [rawCandidates, isClientFiltering, appliedGender]);

  const totalItems = isClientFiltering ? filteredCandidates.length : (data?.pagination?.totalItems ?? 0);
  const totalPages = isClientFiltering
    ? Math.max(1, Math.ceil(filteredCandidates.length / 12))
    : (data?.pagination?.totalPages ?? 1);

  const candidates = useMemo(() => {
    if (!isClientFiltering) return filteredCandidates;
    const start = (pageNo - 1) * 12;
    return filteredCandidates.slice(start, start + 12);
  }, [filteredCandidates, isClientFiltering, pageNo]);

  const candidateMap = useMemo(() => {
    const map = new Map<string, PublicRoommateProfileDto>();
    candidates.forEach((c) => map.set(c.tenantId, c));
    return map;
  }, [candidates]);

  const { matchStatusMap, pendingOutgoingMap } = useMemo(() => {
    const statusMap = new Map<string, CandidateMatchStatus>();
    const outgoingMap = new Map<string, string>();
    if (!allRequestsData?.items || !currentUserId)
      return { matchStatusMap: statusMap, pendingOutgoingMap: outgoingMap };

    for (const req of allRequestsData.items) {
      const isReq = req.requesterId.trim().toLowerCase() === currentUserId;
      const isTarget = req.targetId.trim().toLowerCase() === currentUserId;
      if (!isReq && !isTarget) continue;

      const partnerId = isReq ? req.targetId : req.requesterId;
      if (req.status === 'accepted') {
        statusMap.set(partnerId, 'connected');
      } else if (req.status === 'pending' && statusMap.get(partnerId) !== 'connected') {
        statusMap.set(partnerId, isReq ? 'pending_outgoing' : 'pending_incoming');
        if (isReq) outgoingMap.set(partnerId, req.id);
      }
    }
    return { matchStatusMap: statusMap, pendingOutgoingMap: outgoingMap };
  }, [allRequestsData, currentUserId]);

  const handleSendMatchRequest = useCallback(
    (targetTenantId: string) => {
      if (!isAuthenticated) return setAuthPromptOpen(true);
      createMatchMutation.mutate(targetTenantId);
    },
    [isAuthenticated, createMatchMutation],
  );

  const handleWithdrawMatchRequest = useCallback(
    (id: string) => withdrawMatchMutation.mutate(id),
    [withdrawMatchMutation],
  );

  return {
    candidates,
    candidateMap,
    matchStatusMap,
    pendingOutgoingMap,
    pagination: { totalItems, totalPages, pageNo, pageSize: 12 },
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
    isSendingMatch: createMatchMutation.isPending,
    isWithdrawingMatch: withdrawMatchMutation.isPending,
    myProfile,
    isAuthenticated,
  };
};
