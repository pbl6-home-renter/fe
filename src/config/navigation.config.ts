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
  Gauge,
} from 'lucide-react';
import type { ParseKeys } from 'i18next';
import { Role } from '@/types/role';
import { ROUTES } from './routes.config';

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
  {
    id: 'landlord-overview',
    titleKey: 'navigation.overview',
    path: ROUTES.LANDLORD.DASHBOARD,
    icon: LayoutDashboard,
    exact: true,
  },
  { id: 'landlord-rooms', titleKey: 'navigation.rooms', path: ROUTES.LANDLORD.BUILDINGS, icon: Building2 },
  { id: 'landlord-tenants', titleKey: 'navigation.tenants', path: ROUTES.LANDLORD.TENANTS, icon: Users },
  { id: 'landlord-contracts', titleKey: 'navigation.contracts', path: ROUTES.LANDLORD.CONTRACTS, icon: FileText },
  {
    id: 'landlord-meter-readings',
    titleKey: 'navigation.meterReadings',
    path: ROUTES.LANDLORD.METER_READINGS,
    icon: Gauge,
  },
  { id: 'landlord-invoices', titleKey: 'navigation.invoices', path: ROUTES.LANDLORD.INVOICES, icon: Receipt },
  { id: 'landlord-issues', titleKey: 'navigation.issues', path: ROUTES.LANDLORD.ISSUES, icon: AlertTriangle },
  { id: 'landlord-chat', titleKey: 'navigation.chat', path: ROUTES.LANDLORD.CHAT, icon: MessageSquare },
  { id: 'landlord-settings', titleKey: 'navigation.settings', path: ROUTES.LANDLORD.SETTINGS, icon: Settings },
] as const;

/**
 * Menu items for Tenant role (Khách thuê)
 */
export const TENANT_NAVIGATION: readonly NavMenuItem[] = [
  {
    id: 'tenant-overview',
    titleKey: 'navigation.tenantOverview',
    path: ROUTES.TENANT.DASHBOARD,
    icon: LayoutDashboard,
    exact: true,
  },
  { id: 'tenant-room', titleKey: 'navigation.myRoom', path: ROUTES.TENANT.ROOMS, icon: Home },
  { id: 'tenant-contracts', titleKey: 'navigation.contracts', path: ROUTES.TENANT.CONTRACTS, icon: FileText },
  { id: 'tenant-invoices', titleKey: 'navigation.invoices', path: ROUTES.TENANT.INVOICES, icon: Receipt },
  { id: 'tenant-issues', titleKey: 'navigation.issues', path: ROUTES.TENANT.ISSUES, icon: AlertTriangle },
  { id: 'tenant-roommates', titleKey: 'navigation.roommates', path: ROUTES.TENANT.ROOMMATES, icon: UserPlus },
  { id: 'tenant-chat', titleKey: 'navigation.chat', path: ROUTES.TENANT.CHAT, icon: MessageSquare },
  { id: 'tenant-settings', titleKey: 'navigation.settings', path: ROUTES.TENANT.SETTINGS, icon: Settings },
] as const;

/**
 * Menu items for Admin role (Cổng Quản Trị)
 */
export const ADMIN_NAVIGATION: readonly NavMenuItem[] = [
  {
    id: 'admin-stats',
    titleKey: 'navigation.admin.systemStats',
    path: ROUTES.ADMIN.DASHBOARD,
    icon: BarChart3,
    exact: true,
  },
  { id: 'admin-buildings', titleKey: 'navigation.admin.approvals', path: ROUTES.ADMIN.BUILDINGS, icon: CheckCircle2 },
  { id: 'admin-users', titleKey: 'navigation.admin.users', path: ROUTES.ADMIN.USERS, icon: UserCheck },
  { id: 'admin-audit', titleKey: 'navigation.admin.auditLogs', path: ROUTES.ADMIN.AUDIT_LOGS, icon: ShieldCheck },
  { id: 'admin-settings', titleKey: 'navigation.admin.settings', path: ROUTES.ADMIN.SETTINGS, icon: Settings },
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
