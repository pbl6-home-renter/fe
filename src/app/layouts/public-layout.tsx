import type { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, LogIn } from 'lucide-react';
import { RentifyLogo } from '@/components/ui/rentify-logo';
import { Button } from '@/components/ui/button';
import { AppFooter } from './components/app-footer';
import { Role } from '@/types/role';
import { ROUTES } from '@/config/routes.config';
import { changeLanguage } from '@/i18n/i18n';

export interface PublicLayoutProps {
  children?: ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  const { t, i18n } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const currentLanguage = i18n.language || 'vi';

  const toggleLanguage = () => {
    const nextLang = currentLanguage === 'vi' ? 'en' : 'vi';
    void changeLanguage(nextLang);
  };

  const isExploreActive = location.pathname === ROUTES.HOME || location.pathname === ROUTES.ROOMS_SEARCH;
  const isRoommatesActive = location.pathname === ROUTES.TENANT.ROOMMATES;

  return (
    <div className="min-h-screen bg-rentify-background flex flex-col font-sans antialiased text-rentify-text-primary selection:bg-rentify-primary-container selection:text-rentify-surface">
      {/* Public Topbar */}
      <header className="sticky top-0 z-40 h-16 w-full border-b border-rentify-divider bg-rentify-surface/95 backdrop-blur-md transition-colors shadow-xs">
        <div className="h-full w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link
              to={ROUTES.HOME}
              className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary rounded-lg"
            >
              <RentifyLogo role={Role.TENANT} />
            </Link>

            {/* Public Navigation Links */}
            <nav className="hidden sm:flex items-center gap-6 text-sm font-semibold">
              <Link
                to={ROUTES.HOME}
                className={`py-4 transition-colors relative ${
                  isExploreActive
                    ? 'text-rentify-primary'
                    : 'text-rentify-text-secondary hover:text-rentify-text-primary'
                }`}
              >
                <span>{t('navigation.searchRooms')}</span>
                {isExploreActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rentify-primary rounded-full" />
                )}
              </Link>

              <Link
                to={ROUTES.TENANT.ROOMMATES}
                className={`py-4 transition-colors relative ${
                  isRoommatesActive
                    ? 'text-rentify-primary'
                    : 'text-rentify-text-secondary hover:text-rentify-text-primary'
                }`}
              >
                <span>{t('navigation.roommates')}</span>
                {isRoommatesActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rentify-primary rounded-full" />
                )}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="h-9 px-2.5 text-xs font-semibold text-rentify-text-secondary hover:text-rentify-text-primary"
              aria-label={t('switchLanguage')}
            >
              <Globe className="h-4 w-4 mr-1.5 text-rentify-outline" />
              <span className="uppercase">{currentLanguage}</span>
            </Button>

            {/* Login Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(ROUTES.LOGIN)}
              className="h-9 px-4 text-xs font-semibold rounded-full shadow-xs"
            >
              <LogIn className="h-3.5 w-3.5 mr-1.5" />
              <span>{t('login')}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</main>

      {/* Shared Footer */}
      <AppFooter role={Role.TENANT} />
    </div>
  );
};
