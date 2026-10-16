import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Building,
  Users,
  FileText,
  Receipt,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  UserCheck,
  Settings,
} from 'lucide-react';
import type { ParseKeys } from 'i18next';
import { Role } from '@/types/role';

export interface MenuItem {
  titleKey: ParseKeys<'common'>;
  path: string;
  icon: LucideIcon;
  exact?: boolean;
}

/**
 * Menu items for Landlord role
 */
export const LANDLORD_MENU_ITEMS: readonly MenuItem[] = [
  { titleKey: 'navigation.overview', path: '/dashboard', icon: LayoutDashboard, exact: true },
  { titleKey: 'navigation.rooms', path: '/rooms', icon: Building },
  { titleKey: 'navigation.tenants', path: '/tenants', icon: Users },
  { titleKey: 'navigation.contracts', path: '/contracts', icon: FileText },
  { titleKey: 'navigation.invoices', path: '/invoices', icon: Receipt },
  { titleKey: 'navigation.issues', path: '/issues', icon: AlertTriangle },
] as const;

/**
 * Menu items for Tenant role
 */
export const TENANT_MENU_ITEMS: readonly MenuItem[] = [
  { titleKey: 'navigation.tenantOverview', path: '/dashboard', icon: LayoutDashboard, exact: true },
  { titleKey: 'navigation.myRoom', path: '/rooms', icon: Building },
  { titleKey: 'navigation.contracts', path: '/contracts', icon: FileText },
  { titleKey: 'navigation.invoices', path: '/invoices', icon: Receipt },
  { titleKey: 'navigation.issues', path: '/issues', icon: AlertTriangle },
] as const;

/**
 * Menu items for Admin role
 */
export const ADMIN_MENU_ITEMS: readonly MenuItem[] = [
  { titleKey: 'navigation.admin.systemStats', path: '/admin', icon: BarChart3, exact: true },
  { titleKey: 'navigation.admin.approvals', path: '/admin/approvals', icon: CheckCircle },
  { titleKey: 'navigation.admin.users', path: '/admin/users', icon: UserCheck },
  { titleKey: 'navigation.admin.settings', path: '/admin/settings', icon: Settings },
] as const;

/**
 * Get navigation menu items based on user role
 */
export const getMenuItemsByRole = (role?: Role | null): readonly MenuItem[] => {
  switch (role) {
    case Role.ADMIN:
      return ADMIN_MENU_ITEMS;
    case Role.LANDLORD:
      return LANDLORD_MENU_ITEMS;
    case Role.TENANT:
      return TENANT_MENU_ITEMS;
    default:
      return TENANT_MENU_ITEMS;
  }
};

