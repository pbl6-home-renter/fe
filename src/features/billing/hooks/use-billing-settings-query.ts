import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { Paginated } from '@/types/api';
import type { QueryHookOptions } from '@/lib/query/types';
import { billingApi } from '../api/billing.api';
import { BILLING_SETTING_QUERY_KEYS } from '../constants/billing.constants';
import type { BillingSettingDto, BillingSettingListParams } from '../types/billing.dto';

export const useBillingSettingsQuery = (
  params?: BillingSettingListParams,
  options?: QueryHookOptions<Paginated<BillingSettingDto>>,
) => {
  return useQuery({
    queryKey: BILLING_SETTING_QUERY_KEYS.LIST(params),
    queryFn: () => billingApi.getBillingSettings(params),
    placeholderData: keepPreviousData,
    ...options,
  });
};
