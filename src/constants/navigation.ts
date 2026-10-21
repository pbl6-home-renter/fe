import type { NavMenuItem } from '@/config/navigation.config';
import {
  LANDLORD_NAVIGATION,
  TENANT_NAVIGATION,
  ADMIN_NAVIGATION,
  getNavigationByRole,
} from '@/config/navigation.config';

// Re-export modern navigation config
export * from '@/config/navigation.config';

// Backwards compatibility aliases
export type MenuItem = NavMenuItem;
export const LANDLORD_MENU_ITEMS = LANDLORD_NAVIGATION;
export const TENANT_MENU_ITEMS = TENANT_NAVIGATION;
export const ADMIN_MENU_ITEMS = ADMIN_NAVIGATION;
export const getMenuItemsByRole = getNavigationByRole;
