export type Role = 'landlord' | 'tenant' | 'admin';

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

