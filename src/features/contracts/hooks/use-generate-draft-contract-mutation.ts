import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { contractApi } from '../api/contract.api';
import { CONTRACT_QUERY_KEYS } from '../constants/contract.constants';

interface GenerateDraftVariables {
  id: string;
}

export const useGenerateDraftContractMutation = (
  options?: MutationHookOptions<Blob, GenerateDraftVariables>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: GenerateDraftVariables) => contractApi.generateDraftDocument(id),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: CONTRACT_QUERY_KEYS.DETAIL(variables.id) });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
