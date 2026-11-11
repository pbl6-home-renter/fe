import type { BaseEntity, PaginationParams } from '@/types/api';
import type { Role } from '@/types/role';
import type { PayoutAccount, User, UserStatus } from '@/types/user';

export type UserSortField = 'createdAt' | 'name' | 'email';

export interface UserListAdminParams extends PaginationParams {
  sort?: UserSortField;
  role?: Role;
  status?: UserStatus;
  q?: string;
}

export interface UserListAdminItemDto extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: UserStatus;
}

export interface UserDetailAdminDto extends UserListAdminItemDto {
  lockReason: string | null;
  lockedAt: string | null;
  payoutAccount: PayoutAccount | null;
  buildingCount: number | null;
  activeContractCount: number | null;
}

export interface UserUpdateAdminRequestDto {
  name?: string;
  phone?: string;
}

export interface UserUpdateAdminResponseDto {
  userId: string;
  name: string;
  phone: string;
  email: string;
  status: UserStatus;
}

export interface UserLockRequestDto {
  lockReason: string;
}

export interface UserLockResponseDto {
  userId: string;
  status: UserStatus;
  lockReason: string;
  lockedAt: string;
}

export interface UserUnlockResponseDto {
  userId: string;
  status: UserStatus;
  lockedAt: null;
}

export type UserMeResponseDto = User;

export interface UserUpdateMeRequestDto {
  name: string;
  phone: string;
  payoutAccount: PayoutAccount | null;
}

export interface UserUpdateMeResponseDto extends BaseEntity {
  name: string;
  phone: string;
  payoutAccount: PayoutAccount | null;
}
