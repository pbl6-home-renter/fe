import type { Role } from '@/types/role';
import type { PayoutAccount, UserStatus } from '@/types/user';

export type UserSortField = 'createdAt' | 'name' | 'email';

export interface UserListAdminParams {
  pageNo?: number;
  pageSize?: number;
  sort?: UserSortField;
  order?: 'asc' | 'desc';
  role?: Role;
  status?: UserStatus;
  q?: string;
}

export interface UserListAdminItemDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: UserStatus;
}

export interface UserDetailAdminDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: UserStatus;
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
