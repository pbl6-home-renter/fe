import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  X,
  LogOut,
  Building2,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils';
import {
  getNavigationByRole,
  getPortalMetaByRole,
} from '@/config/navigation.config';

export interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onOpenLogoutModal: () => void;
}

export const Sidebar = ({ open, onClose, onOpenLogoutModal }: SidebarProps) => {
  const { role } = useAuth();
  const { t } = useTranslation();

  const portalMeta = getPortalMetaByRole(role);
  const menuItems = getNavigationByRole(role);

  return (
    <>
      {/* Mobile Drawer Backdrop Scrim */}
      {open && (
        <div
          role="presentation"
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Aside */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-rentify-divider',
          'flex flex-col justify-between transition-transform duration-300 ease-in-out md:static md:translate-x-0',
          open ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Logo Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-rentify-divider shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rentify-primary text-white flex items-center justify-center font-bold text-base shadow-sm">
                R
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-rentify-text-primary tracking-tight leading-tight">
                  {t('appName')}
                </span>
                <span className="text-[11px] font-semibold text-rentify-primary tracking-normal leading-tight">
                  {t(portalMeta.portalNameKey, portalMeta.fallbackPortalName)}
                </span>
              </div>
            </div>

            {/* Close button for mobile */}
            <button
              type="button"
              onClick={onClose}
              aria-label={t('cancel')}
              className="p-1.5 rounded-lg text-rentify-text-secondary hover:bg-rentify-background md:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1">
            <p className="px-3 py-1.5 text-[11px] font-bold text-rentify-neutral uppercase tracking-wider">
              {t('menuTitle', 'MENU QUẢN LÝ')}
            </p>

            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.exact}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-rentify-primary-container text-white shadow-xs font-semibold'
                        : 'text-rentify-text-secondary hover:text-rentify-text-primary hover:bg-rentify-background'
                    )
                  }
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{t(item.titleKey)}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-bold leading-none',
                        item.badgeVariant === 'danger'
                          ? 'bg-red-100 text-rentify-error'
                          : 'bg-white/20 text-white'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Session Info Micro-Card & Logout */}
        <div className="p-3.5 border-t border-rentify-divider space-y-2 shrink-0 bg-white">
          {/* Micro-Card */}
          <div className="p-3 rounded-xl bg-rentify-background border border-rentify-divider/70 flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-rentify-text-primary">
              {role === 'landlord' ? (
                <Building2 className="w-4 h-4 text-rentify-primary shrink-0" />
              ) : role === 'admin' ? (
                <ShieldCheck className="w-4 h-4 text-rentify-primary shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 text-rentify-primary shrink-0" />
              )}
              <span className="text-xs font-semibold">
                {t(portalMeta.verifiedLabelKey, portalMeta.fallbackVerifiedLabel)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rentify-success inline-block shrink-0 animate-pulse" />
              <span className="text-[11px] text-rentify-text-secondary font-medium">
                {t('logoutModal.onlineStatus', 'Trực tuyến')}
              </span>
            </div>
          </div>

          {/* Quick Logout Button */}
          <button
            type="button"
            onClick={onOpenLogoutModal}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rentify-error hover:bg-red-50 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>{t('logout', 'Đăng xuất')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
