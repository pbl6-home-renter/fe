import type { Role } from './role';

export const UserStatus = {
  ACTIVE: 'active',
  LOCKED: 'locked',
} as const;

export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const USER_STATUSES = Object.values(UserStatus) as readonly UserStatus[];

export const isValidUserStatus = (value: unknown): value is UserStatus => {
  return typeof value === 'string' && (value === UserStatus.ACTIVE || value === UserStatus.LOCKED);
};

export interface PayoutAccount {
  bankCode: string;
  accountNumber: string;
  accountName: string;
}

export interface User {
  id: string;
  phone: string;
  email: string;
  name: string;
  role: Role;
  status: UserStatus;
  payoutAccount?: PayoutAccount | null;
  lockReason?: string | null;
  lockedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}
