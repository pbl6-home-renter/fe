import { useState } from 'react';
import { useMatchRequestsQuery } from './use-match-requests-query';
import {
  useAcceptMatchRequestMutation,
  useRejectMatchRequestMutation,
  useWithdrawMatchRequestMutation,
} from './use-match-request-actions-mutation';

export type MatchRequestTab = 'incoming' | 'outgoing' | 'connected';

export const useMatchRequestsManager = (enabled = true) => {
  const [tab, setTab] = useState<MatchRequestTab>('incoming');

  const queryFilter = tab === 'connected' ? { status: 'accepted' as const } : { direction: tab };

  const { data, isLoading, isError, refetch } = useMatchRequestsQuery(
    {
      pageNo: 1,
      pageSize: 50,
      filter: queryFilter,
    },
    { enabled },
  );

  const { data: incomingPendingData } = useMatchRequestsQuery(
    {
      pageNo: 1,
      pageSize: 50,
      filter: { direction: 'incoming', status: 'pending' },
    },
    { enabled },
  );

  const { data: acceptedData } = useMatchRequestsQuery(
    {
      pageNo: 1,
      pageSize: 50,
      filter: { status: 'accepted' },
    },
    { enabled },
  );

  const acceptMutation = useAcceptMatchRequestMutation();
  const rejectMutation = useRejectMatchRequestMutation();
  const withdrawMutation = useWithdrawMatchRequestMutation();

  const handleAccept = (id: string) => {
    acceptMutation.mutate(id);
  };

  const handleReject = (id: string) => {
    rejectMutation.mutate(id);
  };

  const handleWithdraw = (id: string) => {
    withdrawMutation.mutate(id);
  };

  return {
    tab,
    setTab,
    requests: data?.items ?? [],
    pendingIncomingCount: incomingPendingData?.pagination.totalItems ?? 0,
    connectedCount: acceptedData?.pagination.totalItems ?? 0,
    isLoading,
    isError,
    refetch,
    handleAccept,
    handleReject,
    handleWithdraw,
    isActing: acceptMutation.isPending || rejectMutation.isPending || withdrawMutation.isPending,
  };
};
