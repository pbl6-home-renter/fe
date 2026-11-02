import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { contractApi } from '../api/contract.api';
import { CONTRACT_QUERY_KEYS } from '../constants/contract.constants';
import { ROOM_QUERY_KEYS } from '@/features/rooms/constants/room.constants';
import { BUILDING_QUERY_KEYS } from '@/features/buildings/constants/building.constants';
import type { ContractActivateRequestDto, ContractDetailDto } from '../types/contract.dto';

interface ActivateContractVariables {
  id: string;
  payload: ContractActivateRequestDto;
}

export const useActivateContractMutation = (
  options?: MutationHookOptions<ContractDetailDto, ActivateContractVariables>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: ActivateContractVariables) =>
      contractApi.activateContract(id, payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.DETAIL(variables.id) });
      queryClient.invalidateQueries({ queryKey: ROOM_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({ queryKey: BUILDING_QUERY_KEYS.ALL });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
