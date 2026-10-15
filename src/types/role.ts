/**
 * Role Enum and Types for Rentify Platform
 * Centralized definition for Role-Based Access Control (RBAC)
 */

export const Role = {
  ADMIN: 'admin',
  LANDLORD: 'landlord',
  TENANT: 'tenant',
} as const;

export type Role = (typeof Role)[keyof typeof Role];

/**
 * Array of all valid system roles
 */
export const ROLES = Object.values(Role) as readonly Role[];

/**
 * Type guard to check if an unknown value is a valid Role
 */
export const isValidRole = (value: unknown): value is Role => {
  return typeof value === 'string' && ROLES.includes(value as Role);
};

