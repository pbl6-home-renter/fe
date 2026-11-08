import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { contractApi } from '../api/contract.api';
import { CONTRACT_QUERY_KEYS } from '../constants/contract.constants';
import type { ContractMemberListItemDto, LeaveContractMemberRequestDto } from '../types/contract-member.dto';

interface LeaveContractMemberVariables {
  id: string;
  payload: LeaveContractMemberRequestDto;
}

export const useLeaveContractMemberMutation = (
  options?: MutationHookOptions<ContractMemberListItemDto, LeaveContractMemberVariables>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: LeaveContractMemberVariables) => contractApi.leaveContractMember(id, payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: CONTRACT_QUERY_KEYS.MEMBERS(variables.payload.contractId),
      });
      queryClient.invalidateQueries({
        queryKey: CONTRACT_QUERY_KEYS.DETAIL(variables.payload.contractId),
      });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
