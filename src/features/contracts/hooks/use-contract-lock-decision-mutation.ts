import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { contractApi } from '../api/contract.api';
import { CONTRACT_QUERY_KEYS } from '../constants/contract.constants';
import { ROOM_QUERY_KEYS } from '@/features/rooms/constants/room.constants';
import { BUILDING_QUERY_KEYS } from '@/features/buildings/constants/building.constants';
import type { ContractLockDecisionRequestDto, ContractLockDecisionResponseDto } from '../types/contract.dto';

export interface ContractLockDecisionVariables {
  contractId: string;
  lockCycleId: string;
  payload: ContractLockDecisionRequestDto;
}

export const useContractLockDecisionMutation = (
  options?: MutationHookOptions<ContractLockDecisionResponseDto, ContractLockDecisionVariables>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contractId, lockCycleId, payload }: ContractLockDecisionVariables) =>
      contractApi.decideLockCycle(contractId, lockCycleId, payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.DETAIL(variables.contractId) });
      queryClient.invalidateQueries({ queryKey: ROOM_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({ queryKey: BUILDING_QUERY_KEYS.ALL });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
