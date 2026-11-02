import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { contractApi } from '../api/contract.api';
import { CONTRACT_QUERY_KEYS } from '../constants/contract.constants';
import type { ContractApplyTemplateRequestDto, ContractDetailDto } from '../types/contract.dto';

interface ApplyTemplateVariables {
  id: string;
  payload: ContractApplyTemplateRequestDto;
}

export const useApplyContractTemplateMutation = (
  options?: MutationHookOptions<ContractDetailDto, ApplyTemplateVariables>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: ApplyTemplateVariables) =>
      contractApi.applyTemplate(id, payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.DETAIL(variables.id) });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
