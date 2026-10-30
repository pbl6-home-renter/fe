import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  Bell,
  Globe,
  Search,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { changeLanguage } from '@/i18n/i18n';
import { UserMenuDropdown } from './user-menu-dropdown';
import {
  getNavigationByRole,
  getPortalMetaByRole,
} from '@/config/navigation.config';

export interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenLogoutModal: () => void;
}

export const Header = ({ onToggleSidebar, onOpenLogoutModal }: HeaderProps) => {
  const { role } = useAuth();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const portalMeta = getPortalMetaByRole(role);
  const menuItems = getNavigationByRole(role);

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
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation drawer"
          className="p-2 rounded-xl text-rentify-text-secondary hover:bg-rentify-background md:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs sm:text-sm"
        >
          <span className="text-rentify-text-secondary font-medium hidden sm:inline">
            {t(portalMeta.portalNameKey, portalMeta.fallbackPortalName)}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-rentify-neutral hidden sm:inline" />
          <span className="font-bold text-rentify-text-primary tracking-tight">
            {breadcrumbTitle}
          </span>
        </nav>
      </div>

      {/* Right side: Quick Search, Notifications, Language, User Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search */}
        <button
          type="button"
          onClick={() => navigate('/rooms')}
          aria-label={t('search')}
          className="p-2 rounded-xl text-rentify-text-secondary hover:bg-rentify-background hover:text-rentify-text-primary transition-colors cursor-pointer hidden sm:flex items-center justify-center"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications Bell */}
        <button
          type="button"
          onClick={() => navigate('/notifications')}
          aria-label={t('notifications')}
          className="relative p-2 rounded-xl text-rentify-text-secondary hover:bg-rentify-background hover:text-rentify-text-primary transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rentify-error ring-2 ring-white" />
        </button>

        {/* Language Switcher */}
        <button
          type="button"
          onClick={toggleLanguage}
          title={t('switchLanguage')}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rentify-text-secondary hover:bg-rentify-background border border-rentify-divider transition-colors cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-rentify-primary" />
          <span className="uppercase">{currentLanguage}</span>
        </button>

        <div className="h-5 w-px bg-rentify-divider mx-0.5" />

        {/* User Profile Dropdown */}
        <UserMenuDropdown onOpenLogoutModal={onOpenLogoutModal} />
      </div>
    </header>
  );
};
