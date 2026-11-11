import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, Bell, Globe, Search, ChevronRight } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { ROUTES } from '@/config/routes.config';
import { changeLanguage } from '@/i18n/i18n';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { UserMenuDropdown } from './user-menu-dropdown';
import { getNavigationByRole, getPortalMetaByRole } from '@/config/navigation.config';
import { useUnreadNotificationsQuery } from '@/features/notifications/hooks/use-unread-notifications-query';

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

  const portalMeta = getPortalMetaByRole(role);
  const menuItems = getNavigationByRole(role);
  const hasUnreadNotifications = useUnreadNotificationsQuery().data ?? false;

  const currentLanguage = i18n.language || 'vi';

  const toggleLanguage = () => {
    const nextLang = currentLanguage === 'vi' ? 'en' : 'vi';
    changeLanguage(nextLang);
  };

  // Determine breadcrumb title
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

  return (
    <header className="sticky top-0 h-16 bg-white/95 backdrop-blur-xl border-b border-rentify-divider px-4 sm:px-6 flex items-center justify-between shrink-0 z-40 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      {/* Left side: Mobile menu toggle & Breadcrumbs / Session Indicator */}
      <div className="flex items-center gap-3">
        {/* Mobile Sidebar Hamburger Toggle */}
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

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm">
          <span className="text-rentify-text-secondary font-medium hidden sm:inline">
            {t(portalMeta.portalNameKey, portalMeta.fallbackPortalName)}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-rentify-neutral hidden sm:inline" />
          <span className="font-bold text-rentify-text-primary tracking-tight">{breadcrumbTitle}</span>
        </nav>
      </div>

      {/* Right side: Quick Search, Notifications, Language, User Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search */}
        <IconButton
          variant="ghost"
          size="md"
          onClick={() => navigate(ROUTES.LANDLORD.ROOMS)}
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
          className="min-h-10 px-3 text-xs"
        >
          <Globe className="w-3.5 h-3.5 text-rentify-primary" />
          <span className="uppercase">{currentLanguage}</span>
        </Button>

        <div className="h-5 w-px bg-rentify-divider mx-0.5" />

        {/* User Profile Dropdown */}
        <UserMenuDropdown onOpenLogoutModal={onOpenLogoutModal} />
      </div>
    </header>
  );
};
