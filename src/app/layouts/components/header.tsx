import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Bell, Globe, Search, ChevronRight } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Role } from '@/types/role';
import { ROUTES } from '@/config/routes.config';
import { changeLanguage } from '@/i18n/i18n';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { RentifyLogo } from '@/components/ui/rentify-logo';
import { UserMenuDropdown } from './user-menu-dropdown';
import { getNavigationByRole, getPortalMetaByRole } from '@/config/navigation.config';
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
  const location = useLocation();
  const navigate = useNavigate();

  const isTenant = role === Role.TENANT;
  const portalMeta = getPortalMetaByRole(role);
  const menuItems = getNavigationByRole(role);
  const hasUnreadNotifications = useUnreadNotificationsQuery().data ?? false;
  const unreadChat = useUnreadSummaryQuery(isTenant);

  const currentLanguage = i18n.language || 'vi';

  const toggleLanguage = () => {
    const nextLang = currentLanguage === 'vi' ? 'en' : 'vi';
    changeLanguage(nextLang);
  };

  // Determine breadcrumb title for Landlord/Admin
  const matchedMenuItem = menuItems.find((item) => {
    if (item.exact) return item.path === location.pathname;
    return location.pathname.startsWith(item.path);
  });

  const pathSegments = location.pathname.split('/').filter(Boolean);
  const breadcrumbTitle = matchedMenuItem
    ? t(matchedMenuItem.titleKey)
    : pathSegments.length > 0
      ? pathSegments[pathSegments.length - 1].toUpperCase()
      : t('navigation.overview');

  // Tenant Topbar Navigation Tabs
  const isExploreActive =
    location.pathname === ROUTES.TENANT.DASHBOARD ||
    location.pathname === ROUTES.HOME ||
    location.pathname === ROUTES.ROOMS_SEARCH;
  const isChatActive = location.pathname.startsWith('/chat');
  const isRoomsActive = location.pathname.startsWith('/rooms') && location.pathname !== ROUTES.ROOMS_SEARCH;
  const isRoommatesActive = location.pathname.startsWith('/roommates');

  const unreadChatCount = unreadChat.data?.totalUnreadCount ?? 0;

  return (
    <header className="sticky top-0 h-16 w-full bg-rentify-surface/95 backdrop-blur-xl border-b border-rentify-divider shrink-0 z-40 shadow-xs">
      <div className="h-full w-full flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left side: Role-based Branding or Mobile Toggle */}
        <div className="flex items-center gap-4 sm:gap-8">
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
              {/* Logo on Left for Tenant */}
              <Link
                to={ROUTES.TENANT.DASHBOARD}
                className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary rounded-lg"
              >
                <RentifyLogo role={Role.TENANT} size="md" />
              </Link>

              {/* Tenant Horizontal Navigation Tabs (Desktop) */}
              <nav className="hidden md:flex items-center gap-6 text-sm font-semibold h-16">
                <Link
                  to={ROUTES.TENANT.DASHBOARD}
                  className={`h-full flex items-center relative transition-colors ${
                    isExploreActive
                      ? 'text-rentify-primary'
                      : 'text-rentify-text-secondary hover:text-rentify-text-primary'
                  }`}
                >
                  <span>{t('navigation.explore')}</span>
                  {isExploreActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rentify-primary rounded-full" />
                  )}
                </Link>

                <Link
                  to={ROUTES.TENANT.CHAT}
                  className={`h-full flex items-center relative gap-1.5 transition-colors ${
                    isChatActive
                      ? 'text-rentify-primary'
                      : 'text-rentify-text-secondary hover:text-rentify-text-primary'
                  }`}
                >
                  <span>{t('navigation.chat')}</span>
                  {unreadChatCount > 0 && (
                    <span className="rounded-full bg-rentify-primary-container text-rentify-primary px-1.5 py-0.5 text-[10px] font-bold leading-none">
                      {unreadChatCount > 99 ? '99+' : unreadChatCount}
                    </span>
                  )}
                  {isChatActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rentify-primary rounded-full" />
                  )}
                </Link>

                <Link
                  to={ROUTES.TENANT.ROOMS}
                  className={`h-full flex items-center relative transition-colors ${
                    isRoomsActive
                      ? 'text-rentify-primary'
                      : 'text-rentify-text-secondary hover:text-rentify-text-primary'
                  }`}
                >
                  <span>{t('navigation.myRoom')}</span>
                  {isRoomsActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rentify-primary rounded-full" />
                  )}
                </Link>

                <Link
                  to={ROUTES.TENANT.ROOMMATES}
                  className={`h-full flex items-center relative transition-colors ${
                    isRoommatesActive
                      ? 'text-rentify-primary'
                      : 'text-rentify-text-secondary hover:text-rentify-text-primary'
                  }`}
                >
                  <span>{t('navigation.roommatesShort')}</span>
                  {isRoommatesActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rentify-primary rounded-full" />
                  )}
                </Link>
              </nav>
            </>
          ) : (
            /* Breadcrumbs for Landlord & Admin */
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <span className="text-rentify-text-secondary font-medium hidden sm:inline">
                {t(portalMeta.portalNameKey, portalMeta.fallbackPortalName)}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-rentify-neutral hidden sm:inline" />
              <span className="font-bold text-rentify-text-primary tracking-tight">{breadcrumbTitle}</span>
            </nav>
          )}
        </div>

        {/* Right side: Quick Search, Notifications, Language, User Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search */}
          <IconButton
            variant="ghost"
            size="md"
            onClick={() => navigate(ROUTES.ROOMS_SEARCH)}
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
