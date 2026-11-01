import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Building2,
  Home,
  Users,
  FileText,
  Receipt,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  UserCheck,
  ShieldCheck,
  Settings,
  MessageSquare,
  UserPlus,
} from 'lucide-react';
import type { ParseKeys } from 'i18next';
import { Role } from '@/types/role';

export interface NavMenuItem {
  id: string;
  titleKey: ParseKeys<'common'>;
  path: string;
  icon: LucideIcon;
  exact?: boolean;
  badge?: string | number;
  badgeVariant?: 'primary' | 'warning' | 'danger' | 'neutral';
}

/**
 * Menu items for Landlord role (Cổng Chủ Nhà)
 */
export const LANDLORD_NAVIGATION: readonly NavMenuItem[] = [
  { id: 'landlord-overview', titleKey: 'navigation.overview', path: '/dashboard', icon: LayoutDashboard, exact: true },
  { id: 'landlord-rooms', titleKey: 'navigation.rooms', path: '/buildings', icon: Building2 },
  { id: 'landlord-tenants', titleKey: 'navigation.tenants', path: '/tenants', icon: Users },
  { id: 'landlord-contracts', titleKey: 'navigation.contracts', path: '/contracts', icon: FileText },
  { id: 'landlord-invoices', titleKey: 'navigation.invoices', path: '/invoices', icon: Receipt },
  { id: 'landlord-issues', titleKey: 'navigation.issues', path: '/issues', icon: AlertTriangle },
  { id: 'landlord-chat', titleKey: 'navigation.chat', path: '/chat', icon: MessageSquare },
  { id: 'landlord-settings', titleKey: 'navigation.settings', path: '/settings', icon: Settings },
] as const;

/**
 * Menu items for Tenant role (Khách thuê)
 */
export const TENANT_NAVIGATION: readonly NavMenuItem[] = [
  { id: 'tenant-overview', titleKey: 'navigation.tenantOverview', path: '/dashboard', icon: LayoutDashboard, exact: true },
  { id: 'tenant-room', titleKey: 'navigation.myRoom', path: '/rooms', icon: Home },
  { id: 'tenant-contracts', titleKey: 'navigation.contracts', path: '/contracts', icon: FileText },
  { id: 'tenant-invoices', titleKey: 'navigation.invoices', path: '/invoices', icon: Receipt },
  { id: 'tenant-issues', titleKey: 'navigation.issues', path: '/issues', icon: AlertTriangle },
  { id: 'tenant-roommates', titleKey: 'navigation.roommates', path: '/roommates', icon: UserPlus },
  { id: 'tenant-chat', titleKey: 'navigation.chat', path: '/chat', icon: MessageSquare },
  { id: 'tenant-settings', titleKey: 'navigation.settings', path: '/settings', icon: Settings },
] as const;

/**
 * Menu items for Admin role (Cổng Quản Trị)
 */
export const ADMIN_NAVIGATION: readonly NavMenuItem[] = [
  { id: 'admin-stats', titleKey: 'navigation.admin.systemStats', path: '/admin', icon: BarChart3, exact: true },
  { id: 'admin-buildings', titleKey: 'navigation.admin.approvals', path: '/admin/buildings', icon: CheckCircle2 },
  { id: 'admin-users', titleKey: 'navigation.admin.users', path: '/admin/users', icon: UserCheck },
  { id: 'admin-audit', titleKey: 'navigation.admin.auditLogs', path: '/admin/audit-logs', icon: ShieldCheck },
  { id: 'admin-settings', titleKey: 'navigation.admin.settings', path: '/admin/settings', icon: Settings },
] as const;

/**
 * Get navigation menu items based on user role
 */
export const getNavigationByRole = (role?: Role | null): readonly NavMenuItem[] => {
  switch (role) {
    case Role.ADMIN:
      return ADMIN_NAVIGATION;
    case Role.LANDLORD:
      return LANDLORD_NAVIGATION;
    case Role.TENANT:
      return TENANT_NAVIGATION;
    default:
      return TENANT_NAVIGATION;
  }
};

/**
 * Portal metadata and session verification badge per role
 */
export interface PortalMeta {
  portalNameKey: ParseKeys<'common'>;
  fallbackPortalName: string;
  verifiedLabelKey: ParseKeys<'common'>;
  fallbackVerifiedLabel: string;
  badgeVariant: 'primary' | 'success' | 'warning' | 'default';
}

export const getPortalMetaByRole = (role?: Role | null): PortalMeta => {
  switch (role) {
    case Role.ADMIN:
      return {
        portalNameKey: 'portals.admin',
        fallbackPortalName: 'Cổng Quản Trị',
        verifiedLabelKey: 'portals.verifiedAdmin',
        fallbackVerifiedLabel: 'Quản trị viên',
        badgeVariant: 'primary',
      };
    case Role.LANDLORD:
      return {
        portalNameKey: 'portals.landlord',
        fallbackPortalName: 'Cổng Chủ Nhà',
        verifiedLabelKey: 'portals.verifiedLandlord',
        fallbackVerifiedLabel: 'Chủ nhà xác thực',
        badgeVariant: 'success',
      };
    case Role.TENANT:
    default:
      return {
        portalNameKey: 'portals.tenant',
        fallbackPortalName: 'Khách thuê',
        verifiedLabelKey: 'portals.verifiedTenant',
        fallbackVerifiedLabel: 'Khách thuê xác thực',
        badgeVariant: 'success',
      };
  }
};
