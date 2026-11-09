import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { billingApi } from '../api/billing.api';
import { RATE_POLICY_QUERY_KEYS } from '../constants/billing.constants';
import type { BuildingRatePoliciesBatchCreateRequestDto, RatePolicyDto } from '../types/billing.dto';

interface BatchBuildingRatePoliciesVariables {
  buildingId: string;
  payload: BuildingRatePoliciesBatchCreateRequestDto;
}

export const useBatchBuildingRatePoliciesMutation = (
  options?: MutationHookOptions<RatePolicyDto, BatchBuildingRatePoliciesVariables>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ buildingId, payload }: BatchBuildingRatePoliciesVariables) =>
      billingApi.batchCreateBuildingRatePolicies(buildingId, payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: RATE_POLICY_QUERY_KEYS.ALL });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
