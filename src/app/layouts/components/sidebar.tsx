import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, LogOut } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Role } from '@/types/role';
import { cn } from '@/lib/utils/cn';
import { RentifyLogo } from '@/components/ui/rentify-logo';
import { Avatar } from '@/components/ui/avatar';
import { getNavigationByRole } from '@/config/navigation.config';

export interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onOpenLogoutModal: () => void;
}

export const Sidebar = ({ open, onClose, onOpenLogoutModal }: SidebarProps) => {
  const { user, role } = useAuth();
  const { t } = useTranslation('common');

  const menuItems = getNavigationByRole(role);

  const getRoleLabel = () => {
    if (role === Role.LANDLORD) return t('userRoles.landlord');
    if (role === Role.ADMIN) return t('userRoles.admin');
    return t('userRoles.tenant');
  };

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
          'fixed inset-y-0 left-0 z-50 w-64 bg-rentify-surface border-r border-rentify-divider',
          'flex flex-col justify-between transition-transform duration-300 ease-in-out md:static md:translate-x-0',
          open ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Logo Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-rentify-divider shrink-0">
            <RentifyLogo role={role} size="md" />

            {/* Close button for mobile */}
            <button
              type="button"
              onClick={onClose}
              aria-label={t('closeDialog')}
              className="p-1.5 rounded-lg text-rentify-text-secondary hover:bg-rentify-background md:hidden cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1">
            <p className="px-3 py-1.5 text-[11px] font-bold text-rentify-neutral uppercase tracking-wider">
              {t('menuTitle')}
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
                          ? 'bg-rentify-error/15 text-rentify-error'
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

        {/* Sidebar Footer: User Profile & Quick Logout */}
        <div className="p-3.5 border-t border-rentify-divider shrink-0 bg-rentify-surface">
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar
                name={user?.name || user?.email || 'User'}
                size="sm"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-xs text-rentify-text-primary truncate">
                  {user?.name || user?.email || t('user')}
                </span>
                <span className="text-[11px] text-rentify-text-secondary truncate">
                  {getRoleLabel()}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenLogoutModal}
              title={t('logout')}
              aria-label={t('logout')}
              className="p-1.5 rounded-lg text-rentify-text-secondary hover:text-rentify-error hover:bg-rentify-error/10 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
