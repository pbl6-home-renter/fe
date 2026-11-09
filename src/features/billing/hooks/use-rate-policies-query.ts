import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { Paginated } from '@/types/api';
import type { QueryHookOptions } from '@/lib/query/types';
import { billingApi } from '../api/billing.api';
import { RATE_POLICY_QUERY_KEYS } from '../constants/billing.constants';
import type { RatePolicyDto, RatePolicyListParams } from '../types/billing.dto';

export const useRatePoliciesQuery = (
  params?: RatePolicyListParams,
  options?: QueryHookOptions<Paginated<RatePolicyDto>>,
) => {
  return useQuery({
    queryKey: RATE_POLICY_QUERY_KEYS.LIST(params),
    queryFn: () => billingApi.getRatePolicies(params),
    placeholderData: keepPreviousData,
    ...options,
  });
};
