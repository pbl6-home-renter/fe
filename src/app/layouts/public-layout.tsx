import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, LogIn, UserPlus } from 'lucide-react';
import { RentifyLogo } from '@/components/ui/rentify-logo';
import { Button } from '@/components/ui/button';
import { Role } from '@/types/role';
import { ROUTES } from '@/config/routes.config';
import { changeLanguage } from '@/i18n/i18n';

export interface PublicLayoutProps {
  children?: ReactNode;
}

export const PublicLayout = ({ children }: PublicLayoutProps) => {
  const { t, i18n } = useTranslation('common');
  const navigate = useNavigate();
  const currentLanguage = i18n.language || 'vi';

  const toggleLanguage = () => {
    const nextLang = currentLanguage === 'vi' ? 'en' : 'vi';
    void changeLanguage(nextLang);
  };

  return (
    <div className="min-h-screen bg-rentify-background flex flex-col antialiased text-rentify-text-primary selection:bg-rentify-primary-container selection:text-rentify-surface">
      {/* Public Topbar */}
      <header className="sticky top-0 z-40 h-16 w-full border-b border-rentify-divider bg-rentify-surface/95 backdrop-blur-md transition-colors shadow-xs">
        <div className="h-full w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <Link
            to={ROUTES.ROOMS_SEARCH}
            className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary rounded-lg"
          >
            <RentifyLogo role={Role.TENANT} />
          </Link>

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
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTES.LOGIN)}
              className="h-9 px-3.5 text-xs font-medium"
            >
              <LogIn className="h-3.5 w-3.5 mr-1.5" />
              <span>{t('login')}</span>
            </Button>

            {/* Register Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(ROUTES.REGISTER)}
              className="h-9 px-3.5 text-xs font-medium shadow-xs"
            >
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              <span>{t('register')}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container - Widened to max-w-[1600px] */}
      <main className="flex-1 overflow-y-auto w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">{children}</main>

      {/* Simple Minimal Footer */}
      <footer className="border-t border-rentify-divider bg-rentify-card/40 py-5 mt-10">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-rentify-text-secondary">
          <div className="flex items-center gap-2">
            <RentifyLogo role={Role.TENANT} size="sm" />
            <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span>{t('footer.hotline')}</span>
            <span>•</span>
            <span>{t('footer.termsPrivacy')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
