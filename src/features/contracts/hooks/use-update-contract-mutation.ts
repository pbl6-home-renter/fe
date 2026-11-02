import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { contractApi } from '../api/contract.api';
import { CONTRACT_QUERY_KEYS } from '../constants/contract.constants';
import type { ContractDetailDto, ContractUpdateRequestDto } from '../types/contract.dto';

interface UpdateContractVariables {
  id: string;
  payload: ContractUpdateRequestDto;
}

export const useUpdateContractMutation = (
  options?: MutationHookOptions<ContractDetailDto, UpdateContractVariables>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateContractVariables) =>
      contractApi.updateContract(id, payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.DETAIL(variables.id) });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
