import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { billingApi } from '../api/billing.api';
import { RATE_POLICY_QUERY_KEYS } from '../constants/billing.constants';
import type { RatePolicyDto, RatePolicyUpdateRequestDto } from '../types/billing.dto';

interface UpdateRatePolicyVariables {
  ratePolicyId: string;
  payload: RatePolicyUpdateRequestDto;
}

export const useUpdateRatePolicyMutation = (
  options?: MutationHookOptions<RatePolicyDto, UpdateRatePolicyVariables>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ratePolicyId, payload }: UpdateRatePolicyVariables) =>
      billingApi.updateRatePolicy(ratePolicyId, payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: RATE_POLICY_QUERY_KEYS.ALL });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
