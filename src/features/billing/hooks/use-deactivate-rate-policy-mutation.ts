import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { billingApi } from '../api/billing.api';
import { RATE_POLICY_QUERY_KEYS } from '../constants/billing.constants';
import type { RatePolicyDto } from '../types/billing.dto';

export const useDeactivateRatePolicyMutation = (options?: MutationHookOptions<RatePolicyDto, string>) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ratePolicyId: string) => billingApi.deactivateRatePolicy(ratePolicyId),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: RATE_POLICY_QUERY_KEYS.ALL });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
