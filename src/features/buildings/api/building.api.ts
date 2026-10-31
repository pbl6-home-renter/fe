import { http } from '@/lib/api/http';
import type { ListParams, Paginated } from '@/types/api';
import type {
  BuildingAdminDetailDto,
  BuildingAdminFilter,
  BuildingAdminListItemDto,
  BuildingApproveRequestDto,
  BuildingApproveResponseDto,
  BuildingCreateRequestDto,
  BuildingCreateResponseDto,
  BuildingFilter,
  BuildingMyDetailDto,
  BuildingMyListItemDto,
  BuildingRatePoliciesBatchCreateRequestDto,
  BuildingRejectRequestDto,
  BuildingRejectResponseDto,
  BuildingUpdateRequestDto,
  BuildingUpdateResponseDto,
  BuildingVietQrConfigRequestDto,
  BuildingVietQrConfigResponseDto,
} from '../types/building.dto';

export const buildingApi = {
  getMyBuildings: (params?: ListParams<BuildingFilter>): Promise<Paginated<BuildingMyListItemDto>> =>
    http.getPage<BuildingMyListItemDto, BuildingFilter>('/me/buildings', params),

  getMyBuilding: (id: string): Promise<BuildingMyDetailDto> =>
    http.get<BuildingMyDetailDto>(`/me/buildings/${id}`),

  createBuilding: (payload: BuildingCreateRequestDto): Promise<BuildingCreateResponseDto> =>
    http.post<BuildingCreateResponseDto>('/buildings', payload),

  updateBuilding: (id: string, payload: BuildingUpdateRequestDto): Promise<BuildingUpdateResponseDto> =>
    http.patch<BuildingUpdateResponseDto>(`/buildings/${id}`, payload),

  deleteBuilding: (id: string): Promise<void> =>
    http.delete(`/buildings/${id}`),

  configureVietQr: (
    buildingId: string,
    payload: BuildingVietQrConfigRequestDto
  ): Promise<BuildingVietQrConfigResponseDto> =>
    http.put<BuildingVietQrConfigResponseDto>(`/buildings/${buildingId}/vietqr-config`, payload),

  batchCreateRatePolicies: (
    buildingId: string,
    payload: BuildingRatePoliciesBatchCreateRequestDto
  ): Promise<void> =>
    http.post<void>(`/buildings/${buildingId}/rate-policies/batch`, payload),

  // Admin approval APIs
  getAdminBuildings: (params?: ListParams<BuildingAdminFilter>): Promise<Paginated<BuildingAdminListItemDto>> =>
    http.getPage<BuildingAdminListItemDto, BuildingAdminFilter>('/admin/buildings', params),

  getAdminBuilding: (id: string): Promise<BuildingAdminDetailDto> =>
    http.get<BuildingAdminDetailDto>(`/admin/buildings/${id}`),

  approveBuilding: (id: string, payload?: BuildingApproveRequestDto): Promise<BuildingApproveResponseDto> =>
    http.post<BuildingApproveResponseDto>(`/buildings/${id}/approve`, payload ?? { note: 'Ownership proof verified' }),

  rejectBuilding: (id: string, payload: BuildingRejectRequestDto): Promise<BuildingRejectResponseDto> =>
    http.post<BuildingRejectResponseDto>(`/buildings/${id}/reject`, payload),
};
