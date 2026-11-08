import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { contractApi } from '../api/contract.api';
import { CONTRACT_QUERY_KEYS } from '../constants/contract.constants';
import { ROOM_QUERY_KEYS } from '@/features/rooms/constants/room.constants';
import type {
  CompleteContractCheckoutRequestDto,
  ContractCheckoutCompleteResponseDto,
} from '../types/contract-member.dto';

interface ContractCheckoutVariables {
  contractId: string;
  payload: CompleteContractCheckoutRequestDto;
}

export const useContractCheckoutMutation = (
  options?: MutationHookOptions<ContractCheckoutCompleteResponseDto, ContractCheckoutVariables>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contractId, payload }: ContractCheckoutVariables) =>
      contractApi.completeCheckout(contractId, payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.DETAIL(variables.contractId) });
      queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.MEMBERS(variables.contractId) });
      queryClient.invalidateQueries({ queryKey: ROOM_QUERY_KEYS.ALL });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
