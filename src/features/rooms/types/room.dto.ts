import { RoomStatus } from '../enums/room-status.enum';
import { GenderPolicy } from '../enums/gender-policy.enum';

export interface RoomAmenities {
  aircon?: boolean;
  fridge?: boolean;
  wcInside?: boolean;
  waterHeater?: boolean;
  mezzanine?: boolean;
  table?: boolean;
  chair?: boolean;
  [key: string]: boolean | undefined;
}

export interface RoomMyListItemDto {
  id: string;
  buildingId: string;
  name: string;
  area?: string | null;
  rentPrice: number;
  status: RoomStatus;
  floorNumber?: number | null;
  currentTenantName?: string | null;
  currentTenantPhone?: string | null;
  activeIssuesCount: number;
}

export interface RoomCurrentContractDto {
  id: string;
  contractCode: string;
  startDate: string;
  endDate: string;
  status: string;
}

export interface RoomMemberDto {
  id: string;
  name: string;
  phone?: string | null;
  avatarUrl?: string | null;
  isRepresentative: boolean;
}

export interface RoomDetailDto {
  id: string;
  buildingId: string;
  buildingName: string;
  name: string;
  description?: string | null;
  area?: string | null;
  floorNumber?: number | null;
  rentPrice: number;
  depositAmount: number;
  status: RoomStatus;
  maxOccupancy?: number | null;
  genderPolicy: GenderPolicy;
  amenities?: RoomAmenities | null;
  photoUrls?: string[];
  landlord: {
    id: string;
    name: string;
    phone: string;
  };
  currentContract?: RoomCurrentContractDto | null;
  currentMembers?: RoomMemberDto[];
  latestMeterReadings?: {
    electricity?: string | null;
    water?: string | null;
    recordedAt?: string | null;
  } | null;
  effectiveRatePolicySummary?: {
    electricity?: string;
    water?: string;
  };
}

export interface RoomCreateRequestDto {
  buildingId: string;
  name: string;
  floorNumber: number;
  area: string;
  rentPrice: number;
  depositAmount: number;
  genderPolicy: GenderPolicy;
  maxOccupancy?: number | null;
  amenities?: RoomAmenities;
  photoMediaIds?: string[];
}

export interface RoomUpdateRequestDto {
  name?: string;
  rentPrice?: number;
  area?: string | null;
}

export interface RoomFilter {
  buildingId?: string;
  status?: RoomStatus | string;
}

export interface RoomMarkReadyResponseDto {
  id: string;
  status: RoomStatus;
}
