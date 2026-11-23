import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useNotificationsQuery } from '@/features/notifications/hooks/use-notifications-query';
import { useContractLockDecisionMutation } from './use-contract-lock-decision-mutation';
import type { ContractDetailDto, ContractLockDecisionResponseDto } from '../types/contract.dto';

export const useContractSuspendedDecision = (contract: ContractDetailDto, onRefresh?: () => void) => {
  const [searchParams] = useSearchParams();
  const [isTerminateOpen, setIsTerminateOpen] = useState(false);
  const [decidedResult, setDecidedResult] = useState<ContractLockDecisionResponseDto | null>(null);

  const queryLockCycleId = searchParams.get('lockCycleId');
  const { data: notificationsData } = useNotificationsQuery(false);
  const mutation = useContractLockDecisionMutation();

  const detectedLockCycleId = useMemo(() => {
    if (queryLockCycleId) return queryLockCycleId;
    if (!notificationsData?.pages) return null;

    for (const page of notificationsData.pages) {
      for (const item of page.items) {
        const data = item.data;
        if (!data || data.action !== 'decision_required') continue;
        const rawIds = data.contractIds;
        const matches =
          (Array.isArray(rawIds) && rawIds.some((id) => String(id) === contract.id)) || String(rawIds) === contract.id;
        if (matches && typeof data.lockCycleId === 'string') {
          return data.lockCycleId;
        }
      }
    }
    return null;
  }, [queryLockCycleId, notificationsData, contract.id]);

  const handleRestore = () => {
    if (!detectedLockCycleId) return;
    mutation.mutate(
      { contractId: contract.id, lockCycleId: detectedLockCycleId, payload: { action: 'restore' } },
      {
        onSuccess: (data) => {
          setDecidedResult(data);
          onRefresh?.();
        },
      },
    );
  };

  const handleConfirmTerminate = () => {
    if (!detectedLockCycleId) return;
    mutation.mutate(
      { contractId: contract.id, lockCycleId: detectedLockCycleId, payload: { action: 'terminate' } },
      {
        onSuccess: (data) => {
          setDecidedResult(data);
          setIsTerminateOpen(false);
          onRefresh?.();
        },
      },
    );
  };

  return {
    isTerminateOpen,
    setIsTerminateOpen,
    decidedResult,
    detectedLockCycleId,
    handleRestore,
    handleConfirmTerminate,
    isProcessing: mutation.isPending,
  };
};
