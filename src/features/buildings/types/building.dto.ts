import type { BuildingStatus } from '../enums/building-status.enum';

/**
 * DTO for items returned by GET /me/buildings
 */
export interface BuildingMyListItemDto {
  id: string;
  name: string;
  address?: string;
  status: BuildingStatus;
  occupiedRooms: number;
  occupancyRate: string;
  rejectionReason?: string | null;
  createdAt?: string;
  /**
   * Optional field; note: rentify.json API spec omits totalRooms from /me/buildings response
   */
  totalRooms?: number;
}

export interface BuildingRatePolicyDto {
  id?: string;
  name?: string;
  category?: string;
  rateKind?: string;
  unit?: string;
  unitPrice?: number | null;
}

/**
 * DTO for GET /me/buildings/{buildingId}
 */
export interface BuildingMyDetailDto {
  id: string;
  name: string;
  province: string;
  ward: string;
  address: string;
  totalFloors?: number | null;
  occupiedRooms: number;
  occupancyRate: string;
  status: BuildingStatus;
  reviewNote?: string | null;
  amenities?: Record<string, boolean | string | number | null> | null;
  ownershipCertificateUrls?: string[];
  vietQrConfigured: boolean;
  ratePolicies?: BuildingRatePolicyDto[];
  createdAt?: string;
  /**
   * Optional field; note: district was removed from /me/buildings/{id} response in PR #23
   */
  district?: string;
  /**
   * Optional field; note: totalRooms was removed from /me/buildings/{id} response in PR #23
   */
  totalRooms?: number;
}

export interface BuildingFilter {
  status?: BuildingStatus;
}

/**
 * DTO for POST /buildings
 */
export interface BuildingCreateRequestDto {
  name: string;
  province: string;
  ward: string;
  address: string;
}

export interface BuildingCreateResponseDto {
  id: string;
  status: BuildingStatus;
  latitude: string;
  longitude: string;
  ownershipCertificateMediaIds?: string[];
  createdAt: string;
}

/**
 * DTO for PATCH /buildings/{buildingId}
 */
export interface BuildingUpdateRequestDto {
  name?: string;
  address?: string;
}

export interface BuildingUpdateResponseDto {
  id: string;
  name: string;
  address: string;
  status: BuildingStatus;
}

/**
 * DTOs for PUT /buildings/{buildingId}/vietqr-config
 */
export interface BuildingVietQrConfigRequestDto {
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branch?: string | null;
  isDefault?: boolean | null;
}

export interface BuildingVietQrConfigResponseDto {
  id: string;
  buildingId: string;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branch?: string | null;
  qrSampleUrl: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * DTOs for POST /buildings/{buildingId}/rate-policies/batch
 */
export interface BuildingRatePolicyStepDto {
  fromStep: number;
  toStep?: number | null;
  stepPrice: number;
}

export interface BuildingRatePolicyItemRequestDto {
  category: string;
  name: string;
  rateKind: string;
  unit: string;
  unitPrice?: number | null;
  calculationBasis?: string | null;
  steps?: BuildingRatePolicyStepDto[] | null;
}

export interface BuildingRatePoliciesBatchCreateRequestDto {
  buildingId: string;
  ratePolicies: BuildingRatePolicyItemRequestDto[];
}

/**
 * Public DTOs for GET /buildings & GET /buildings/{buildingId}
 */
export interface BuildingPublicListItemDto {
  id: string;
  name: string;
  province: string;
  ward: string;
  address: string;
}

export interface BuildingPublicDetailDto {
  id: string;
  name: string;
  province: string;
  ward: string;
  address: string;
  status: BuildingStatus;
}

/**
 * Admin action DTOs
 */
export interface BuildingApproveRequestDto {
  note: string;
}

export interface BuildingApproveResponseDto {
  id: string;
  status: BuildingStatus;
  reviewedAt: string;
}

export interface BuildingRejectRequestDto {
  note: string;
}

export interface BuildingRejectResponseDto {
  id: string;
  status: BuildingStatus;
  reviewNote: string;
  reviewedAt: string;
}

export interface BuildingAdminListItemDto {
  id: string;
  name: string;
  landlordId: string;
  landlordName: string;
  landlordPhone: string;
  status: BuildingStatus;
  totalRooms: number;
  documentsCount: number;
  createdAt: string;
}

export interface BuildingAdminOwnershipDocument {
  id: string;
  url: string;
  name?: string;
  uploadedAt?: string;
}

export interface BuildingAdminDetailDto {
  id: string;
  name: string;
  province: string;
  district?: string;
  ward: string;
  address: string;
  totalFloors?: number;
  totalRooms: number;
  occupancyRate?: string;
  description?: string | null;
  amenities?: Record<string, boolean | string | number | null> | null;
  landlordId: string;
  landlord: {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
    cccdNumber?: string | null;
  };
  ownershipDocuments: BuildingAdminOwnershipDocument[];
  status: BuildingStatus;
  reviewNote?: string | null;
  submittedAt?: string;
  createdAt: string;
}

export interface BuildingAdminFilter {
  status?: string;
  landlordId?: string;
  province?: string;
  ward?: string;
  q?: string;
}
