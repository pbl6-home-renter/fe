import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Bell, Globe, Search } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Role } from '@/types/role';
import { ROUTES } from '@/config/routes.config';
import { changeLanguage } from '@/i18n/i18n';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { RentifyLogo } from '@/components/ui/rentify-logo';
import { UserMenuDropdown } from './user-menu-dropdown';
import { TenantHeaderNav } from './tenant-header-nav';
import { LandlordHeaderNav } from './landlord-header-nav';
import { AdminHeaderNav } from './admin-header-nav';
import { useUnreadNotificationsQuery } from '@/features/notifications/hooks/use-unread-notifications-query';
import { useUnreadSummaryQuery } from '@/features/chat/hooks/use-chat-queries';

export interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenLogoutModal: () => void;
}

export const Header = ({ sidebarOpen, onToggleSidebar, onOpenLogoutModal }: HeaderProps) => {
  const { role } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const isTenant = role === Role.TENANT;
  const isLandlord = role === Role.LANDLORD;
  const hasUnreadNotifications = useUnreadNotificationsQuery().data ?? false;
  const unreadChat = useUnreadSummaryQuery(isTenant || isLandlord);

  const currentLanguage = i18n.language || 'vi';

  const toggleLanguage = () => {
    const nextLang = currentLanguage === 'vi' ? 'en' : 'vi';
    changeLanguage(nextLang);
  };

  const unreadChatCount = unreadChat.data?.totalUnreadCount ?? 0;

  return (
    <header className="sticky top-0 h-16 w-full bg-rentify-surface/95 backdrop-blur-xl border-b border-rentify-divider shrink-0 z-40 shadow-xs">
      <div className="h-full w-full flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left side: Role-based Branding or Mobile Toggle */}
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 min-w-0">
          {/* Mobile Hamburger Toggle for all roles */}
          <IconButton
            variant="ghost"
            size="md"
            onClick={onToggleSidebar}
            aria-label={t('menuTitle')}
            aria-expanded={sidebarOpen}
            aria-controls="app-sidebar"
            className="md:hidden"
          >
            <Menu className="w-5 h-5" />
          </IconButton>

          {isTenant ? (
            <>
              <Link
                to={ROUTES.TENANT.DASHBOARD}
                className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary rounded-lg shrink-0"
              >
                <RentifyLogo role={Role.TENANT} size="md" />
              </Link>
              <TenantHeaderNav unreadChatCount={unreadChatCount} />
            </>
          ) : isLandlord ? (
            <>
              <Link
                to={ROUTES.LANDLORD.DASHBOARD}
                className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary rounded-lg shrink-0"
              >
                <RentifyLogo role={Role.LANDLORD} size="md" />
              </Link>
              <LandlordHeaderNav unreadChatCount={unreadChatCount} />
            </>
          ) : (
            <>
              <Link
                to={ROUTES.ADMIN.DASHBOARD}
                className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary rounded-lg shrink-0"
              >
                <RentifyLogo role={Role.ADMIN} size="md" />
              </Link>
              <AdminHeaderNav />
            </>
          )}
        </div>

        {/* Right side: Quick Search, Notifications, Language, User Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Search */}
          <IconButton
            variant="ghost"
            size="md"
            onClick={() => navigate(isLandlord ? ROUTES.LANDLORD.BUILDINGS : ROUTES.ROOMS_SEARCH)}
            aria-label={t('search')}
            className="hidden sm:inline-flex"
          >
            <Search className="w-4 h-4" />
          </IconButton>

          {/* Notifications Bell */}
          <IconButton
            variant="ghost"
            size="md"
            onClick={() => navigate(ROUTES.NOTIFICATIONS)}
            aria-label={t('notifications')}
          >
            <Bell className="w-4 h-4" />
            {hasUnreadNotifications && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rentify-error ring-2 ring-white" />
            )}
          </IconButton>

          {/* Language Switcher */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleLanguage}
            title={t('switchLanguage')}
            aria-label={t('switchLanguage')}
            className="min-h-10 px-3 text-xs font-semibold"
          >
            <Globe className="w-3.5 h-3.5 text-rentify-primary" />
            <span className="uppercase">{currentLanguage}</span>
          </Button>

          <div className="h-5 w-px bg-rentify-divider mx-0.5" />

          {/* User Profile Dropdown */}
          <UserMenuDropdown onOpenLogoutModal={onOpenLogoutModal} />
        </div>
      </div>
    </header>
  );
};
