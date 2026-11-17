export interface RoommateLifestyle {
  cleanAndTidy?: boolean;
  earlyBird?: boolean;
  nightOwl?: boolean;
  petFriendly?: boolean;
  smoking?: boolean;
  cooking?: boolean;
  guestsAllowed?: boolean;
}

export interface MyRoommateProfileDto {
  id: string;
  tenantId: string;
  isVisible: boolean;
  bio: string | null;
  gender: 'male' | 'female' | 'other' | string | null;
  birthYear: number | null;
  occupation: string | null;
  preferredProvince: string | null;
  preferredDistrict: string | null;
  preferredArea: string | null;
  budgetMin: number | null;
  budgetMax: number | null;
  moveInOn: string | null;
  lifestyle: RoommateLifestyle | null;
}

export interface PublicRoommateProfileDto extends MyRoommateProfileDto {
  tenantName: string;
  avatarUrl: string | null;
}

export interface RoommateProfileSaveRequestDto {
  isVisible: boolean;
  bio?: string | null;
  gender?: string | null;
  birthYear?: number | null;
  occupation?: string | null;
  preferredProvince?: string | null;
  preferredDistrict?: string | null;
  preferredArea?: string | null;
  budgetMin?: number | null;
  budgetMax?: number | null;
  moveInOn?: string | null;
  lifestyle?: RoommateLifestyle | null;
}

export interface RoommateProfileSearchFilterDto {
  preferredArea?: string;
  gender?: string;
  minBudget?: number;
  maxBudget?: number;
}

export interface RoommateProfileSearchRequestParams {
  pageNo?: number;
  pageSize?: number;
  filter?: RoommateProfileSearchFilterDto;
}

export type CandidateMatchStatus = 'none' | 'pending_outgoing' | 'pending_incoming' | 'connected';

export type MatchRequestStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export interface MatchRequestDto {
  id: string;
  requesterId: string;
  targetId: string;
  status: MatchRequestStatus;
  createdAt: string;
  respondedAt: string | null;
  targetName?: string;
  targetAvatarUrl?: string | null;
  requesterName?: string;
  requesterAvatarUrl?: string | null;
}

export interface MatchRequestListFilterDto {
  direction?: 'incoming' | 'outgoing';
  status?: MatchRequestStatus;
}

export interface MatchRequestListParams {
  pageNo?: number;
  pageSize?: number;
  filter?: MatchRequestListFilterDto;
}
