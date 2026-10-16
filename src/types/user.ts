import type { Role } from './role';

export type { Role };
export { Role as RoleEnum } from './role';

export type UserStatus = 'active' | 'locked';

export interface User {
  id: string;
  phone: string;
  email: string;
  name: string;
  role: Role;
  status: UserStatus;
  lockReason?: string | null;
  lockedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}

