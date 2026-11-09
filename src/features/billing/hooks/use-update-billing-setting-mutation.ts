import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { billingApi } from '../api/billing.api';
import { BILLING_SETTING_QUERY_KEYS } from '../constants/billing.constants';
import type { BillingSettingDto, BillingSettingUpdateRequestDto } from '../types/billing.dto';

interface UpdateBillingSettingVariables {
  billingSettingId: string;
  payload: BillingSettingUpdateRequestDto;
}

export const useUpdateBillingSettingMutation = (
  options?: MutationHookOptions<BillingSettingDto, UpdateBillingSettingVariables>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ billingSettingId, payload }: UpdateBillingSettingVariables) =>
      billingApi.updateBillingSetting(billingSettingId, payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: BILLING_SETTING_QUERY_KEYS.ALL });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
