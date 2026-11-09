import { http } from '@/lib/api/http';
import type { Paginated } from '@/types/api';
import type {
  BillingSettingCreateRequestDto,
  BillingSettingDto,
  BillingSettingListParams,
  BillingSettingUpdateRequestDto,
  BuildingRatePoliciesBatchCreateRequestDto,
  RatePolicyCreateRequestDto,
  RatePolicyDto,
  RatePolicyListParams,
  RatePolicyUpdateRequestDto,
} from '../types/billing.dto';

export const billingApi = {
  getRatePolicies: (params?: RatePolicyListParams): Promise<Paginated<RatePolicyDto>> =>
    http.getPageWithParams<RatePolicyDto, RatePolicyListParams>('/rate-policies', params ?? {}),

  createRatePolicy: (data: RatePolicyCreateRequestDto): Promise<RatePolicyDto> =>
    http.post<RatePolicyDto>('/rate-policies', data),

  updateRatePolicy: (ratePolicyId: string, data: RatePolicyUpdateRequestDto): Promise<RatePolicyDto> =>
    http.patch<RatePolicyDto>(`/rate-policies/${ratePolicyId}`, data),

  deactivateRatePolicy: (ratePolicyId: string): Promise<RatePolicyDto> =>
    http.post<RatePolicyDto>(`/rate-policies/${ratePolicyId}/deactivate-policy`, {}),

  batchCreateBuildingRatePolicies: (
    buildingId: string,
    data: BuildingRatePoliciesBatchCreateRequestDto,
  ): Promise<RatePolicyDto> => http.post<RatePolicyDto>(`/buildings/${buildingId}/rate-policies/batch`, data),

  getBillingSettings: (params?: BillingSettingListParams): Promise<Paginated<BillingSettingDto>> =>
    http.getPageWithParams<BillingSettingDto, BillingSettingListParams>('/billing-settings', params ?? {}),

  createBillingSetting: (data: BillingSettingCreateRequestDto): Promise<BillingSettingDto> =>
    http.post<BillingSettingDto>('/billing-settings', data),

  updateBillingSetting: (billingSettingId: string, data: BillingSettingUpdateRequestDto): Promise<BillingSettingDto> =>
    http.patch<BillingSettingDto>(`/billing-settings/${billingSettingId}`, data),
};
