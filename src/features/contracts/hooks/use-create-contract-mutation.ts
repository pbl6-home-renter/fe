import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { contractApi } from '../api/contract.api';
import { CONTRACT_QUERY_KEYS } from '../constants/contract.constants';
import { ROOM_QUERY_KEYS } from '@/features/rooms/constants/room.constants';
import type { ContractCreateRequestDto, ContractDetailDto } from '../types/contract.dto';

export const useCreateContractMutation = (
  options?: MutationHookOptions<ContractDetailDto, ContractCreateRequestDto>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ContractCreateRequestDto) => contractApi.createContract(payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({ queryKey: ROOM_QUERY_KEYS.ALL });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
