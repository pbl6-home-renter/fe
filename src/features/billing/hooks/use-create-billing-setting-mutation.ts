import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { billingApi } from '../api/billing.api';
import { BILLING_SETTING_QUERY_KEYS } from '../constants/billing.constants';
import type { BillingSettingCreateRequestDto, BillingSettingDto } from '../types/billing.dto';

export const useCreateBillingSettingMutation = (
  options?: MutationHookOptions<BillingSettingDto, BillingSettingCreateRequestDto>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BillingSettingCreateRequestDto) => billingApi.createBillingSetting(payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: BILLING_SETTING_QUERY_KEYS.ALL });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
