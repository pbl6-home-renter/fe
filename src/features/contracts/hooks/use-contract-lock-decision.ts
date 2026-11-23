import { useState } from 'react';
import { useContractLockDecisionMutation } from './use-contract-lock-decision-mutation';
import type { ContractLockDecisionResponseDto } from '../types/contract.dto';

export interface UseContractLockDecisionOptions {
  lockCycleId: string | null;
  onDecisionCompleted?: () => void;
}

export const useContractLockDecision = ({ lockCycleId, onDecisionCompleted }: UseContractLockDecisionOptions) => {
  const [decidedResults, setDecidedResults] = useState<Record<string, ContractLockDecisionResponseDto>>({});
  const [pendingContractId, setPendingContractId] = useState<string | null>(null);
  const [terminateCandidateId, setTerminateCandidateId] = useState<string | null>(null);

  const mutation = useContractLockDecisionMutation();

  const handleRestore = (contractId: string) => {
    if (!lockCycleId) return;
    setPendingContractId(contractId);
    mutation.mutate(
      { contractId, lockCycleId, payload: { action: 'restore' } },
      {
        onSuccess: (data) => {
          setDecidedResults((prev) => ({ ...prev, [contractId]: data }));
          onDecisionCompleted?.();
        },
        onSettled: () => setPendingContractId(null),
      },
    );
  };

  const handleConfirmTerminate = () => {
    if (!lockCycleId || !terminateCandidateId) return;
    const contractId = terminateCandidateId;
    setPendingContractId(contractId);
    mutation.mutate(
      { contractId, lockCycleId, payload: { action: 'terminate' } },
      {
        onSuccess: (data) => {
          setDecidedResults((prev) => ({ ...prev, [contractId]: data }));
          setTerminateCandidateId(null);
          onDecisionCompleted?.();
        },
        onSettled: () => setPendingContractId(null),
      },
    );
  };

  return {
    decidedResults,
    pendingContractId,
    terminateCandidateId,
    setTerminateCandidateId,
    handleRestore,
    handleConfirmTerminate,
    isTerminating: pendingContractId === terminateCandidateId && mutation.isPending,
  };
};
