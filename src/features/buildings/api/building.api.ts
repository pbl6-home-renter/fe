import { http } from '@/lib/api/http';
import type { ListParams, Paginated } from '@/types/api';
import type {
  BuildingCreateRequestDto,
  BuildingCreateResponseDto,
  BuildingFilter,
  BuildingMyDetailDto,
  BuildingMyListItemDto,
  BuildingRatePoliciesBatchCreateRequestDto,
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
};
