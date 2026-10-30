import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ChevronDown,
  User,
  Settings,
  LogOut,
  Shield,
  Home,
  Building2,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Divider } from '@/components/ui/divider';
import { getPortalMetaByRole } from '@/config/navigation.config';

export interface UserMenuDropdownProps {
  onOpenLogoutModal: () => void;
}

export const UserMenuDropdown = ({ onOpenLogoutModal }: UserMenuDropdownProps) => {
  const { user, role } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const portalMeta = getPortalMetaByRole(role);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const getRoleIcon = () => {
    if (role === 'admin') return <Shield className="w-3.5 h-3.5" />;
    if (role === 'landlord') return <Building2 className="w-3.5 h-3.5" />;
    return <Home className="w-3.5 h-3.5" />;
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex items-center gap-2.5 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-rentify-background border border-transparent hover:border-rentify-divider transition-all cursor-pointer"
      >
        <Avatar
          name={user?.name}
          size="sm"
          status="online"
          className="shrink-0"
        />

        <div className="hidden sm:flex flex-col text-left min-w-0 max-w-30 md:max-w-40">
          <span className="text-sm font-semibold text-rentify-text-primary truncate leading-tight">
            {user?.name || t('user')}
          </span>
          <span className="text-[11px] text-rentify-text-secondary truncate leading-tight">
            {t(portalMeta.portalNameKey, portalMeta.fallbackPortalName)}
          </span>
        </div>

        <ChevronDown
          className={`w-4 h-4 text-rentify-text-secondary transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-rentify-primary' : ''
          }`}
        />
      </button>

      {/* Floating Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-[0_12px_32px_-4px_rgba(20,42,76,0.15),0_0_0_1px_#D7E3F2] p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {/* User Profile Card */}
          <div className="p-3 bg-rentify-background rounded-xl mb-1.5">
            <div className="flex items-center gap-3">
              <Avatar name={user?.name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-rentify-text-primary truncate">
                  {user?.name || t('user')}
                </p>
                <p className="text-xs text-rentify-text-secondary truncate">
                  {user?.email || 'user@rentify.vn'}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <Badge variant={portalMeta.badgeVariant}>
                    {getRoleIcon()}
                    <span>{t(portalMeta.portalNameKey, portalMeta.fallbackPortalName)}</span>
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Navigation Items */}
          <div className="space-y-0.5">
            <button
              type="button"
              role="menuitem"
              onClick={() => handleNavigate('/profile')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rentify-text-secondary hover:text-rentify-text-primary hover:bg-rentify-background transition-colors cursor-pointer text-left"
            >
              <User className="w-4 h-4 text-rentify-primary shrink-0" />
              <span>{t('profile', 'Hồ sơ cá nhân')}</span>
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => handleNavigate('/settings')}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rentify-text-secondary hover:text-rentify-text-primary hover:bg-rentify-background transition-colors cursor-pointer text-left"
            >
              <Settings className="w-4 h-4 text-rentify-primary shrink-0" />
              <span>{t('settings', 'Cài đặt tài khoản')}</span>
            </button>
          </div>

          <Divider className="my-1.5" />

          {/* Logout Action */}
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onOpenLogoutModal();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rentify-error hover:bg-red-50 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>{t('logout', 'Đăng xuất')}</span>
          </button>
        </div>
      )}
    </div>
  );
};
