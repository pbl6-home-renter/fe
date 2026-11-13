import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, ChevronDown, Home, LogOut, Settings, Shield, User } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { CurrentUserAvatar } from '@/features/users/components/current-user-avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getPortalMetaByRole } from '@/config/navigation.config';
import { ROUTES } from '@/config/routes.config';

export interface UserMenuDropdownProps {
  onOpenLogoutModal: () => void;
}

export const UserMenuDropdown = ({ onOpenLogoutModal }: UserMenuDropdownProps) => {
  const { user, role } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const logoutRequested = useRef(false);
  const portalMeta = getPortalMetaByRole(role);

  const getRoleIcon = () => {
    if (role === 'admin') return <Shield className="h-3.5 w-3.5" />;
    if (role === 'landlord') return <Building2 className="h-3.5 w-3.5" />;
    return <Home className="h-3.5 w-3.5" />;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        aria-label={t('userMenu')}
        className="ui-press flex min-h-10 cursor-pointer items-center gap-2.5 rounded-xl border border-transparent p-1.5 hover:border-rentify-divider hover:bg-rentify-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary sm:px-2.5"
      >
        <CurrentUserAvatar size="sm" status="online" className="shrink-0" />
        <span className="hidden min-w-0 max-w-30 flex-col text-left sm:flex md:max-w-40">
          <span className="truncate text-sm font-semibold leading-tight text-rentify-text-primary">
            {user?.name || t('user')}
          </span>
          <span className="truncate text-[11px] leading-tight text-rentify-text-secondary">
            {t(portalMeta.portalNameKey, portalMeta.fallbackPortalName)}
          </span>
        </span>
        <ChevronDown
          className={`h-4 w-4 text-rentify-text-secondary transition-transform duration-150 ${isOpen ? 'rotate-180 text-rentify-primary' : ''}`}
          aria-hidden="true"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-2xl p-2 shadow-modal"
        onCloseAutoFocus={() => {
          if (logoutRequested.current) {
            logoutRequested.current = false;
            queueMicrotask(onOpenLogoutModal);
          }
        }}
      >
        <div className="mb-1.5 rounded-xl bg-rentify-background p-3">
          <div className="flex items-center gap-3">
            <CurrentUserAvatar size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-rentify-text-primary">{user?.name || t('user')}</p>
              <p className="truncate text-xs text-rentify-text-secondary">{user?.email || ''}</p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <Badge variant={portalMeta.badgeVariant}>
                  {getRoleIcon()}
                  <span>{t(portalMeta.portalNameKey, portalMeta.fallbackPortalName)}</span>
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <DropdownMenuItem
          className="min-h-10 gap-2.5 rounded-xl px-3 text-xs font-medium text-rentify-text-secondary focus:text-rentify-text-primary"
          onSelect={() => navigate(ROUTES.PROFILE)}
        >
          <User className="h-4 w-4 shrink-0 text-rentify-primary" aria-hidden="true" />
          {t('profile')}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="min-h-10 gap-2.5 rounded-xl px-3 text-xs font-medium text-rentify-text-secondary focus:text-rentify-text-primary"
          onSelect={() => navigate(ROUTES.SETTINGS)}
        >
          <Settings className="h-4 w-4 shrink-0 text-rentify-primary" aria-hidden="true" />
          {t('settings')}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="min-h-10 gap-2.5 rounded-xl px-3 text-xs font-semibold text-rentify-error focus:bg-rentify-error/10 focus:text-rentify-error"
          onSelect={() => {
            logoutRequested.current = true;
          }}
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
