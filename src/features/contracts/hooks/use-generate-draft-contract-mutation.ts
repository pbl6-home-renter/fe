import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { contractApi } from '../api/contract.api';
import { CONTRACT_QUERY_KEYS } from '../constants/contract.constants';
import type {
  ContractGenerateDraftRequestDto,
  ContractGenerateDraftResponseDto,
} from '../types/contract.dto';

interface GenerateDraftVariables {
  id: string;
  payload: ContractGenerateDraftRequestDto;
}

export const useGenerateDraftContractMutation = (
  options?: MutationHookOptions<ContractGenerateDraftResponseDto, GenerateDraftVariables>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: GenerateDraftVariables) =>
      contractApi.generateDraftDocument(id, payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.DETAIL(variables.id) });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
