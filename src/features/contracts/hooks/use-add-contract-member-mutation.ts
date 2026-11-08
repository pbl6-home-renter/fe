import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { contractApi } from '../api/contract.api';
import { CONTRACT_QUERY_KEYS } from '../constants/contract.constants';
import type { AddContractMemberRequestDto, ContractMemberListItemDto } from '../types/contract-member.dto';

export const useAddContractMemberMutation = (
  options?: MutationHookOptions<ContractMemberListItemDto, AddContractMemberRequestDto>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddContractMemberRequestDto) => contractApi.addContractMember(payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: CONTRACT_QUERY_KEYS.MEMBERS(variables.contractId),
      });
      queryClient.invalidateQueries({
        queryKey: CONTRACT_QUERY_KEYS.DETAIL(variables.contractId),
      });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
