export const Role = {
  ADMIN: 'admin',
  LANDLORD: 'landlord',
  TENANT: 'tenant',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export const ROLES = Object.values(Role) as readonly Role[];

export const isValidRole = (value: string | Role): value is Role => {
  return ROLES.includes(value as Role);
};

