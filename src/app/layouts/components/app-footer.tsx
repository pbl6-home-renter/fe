import { useTranslation } from 'react-i18next';
import { RentifyLogo } from '@/components/ui/rentify-logo';
import { Role } from '@/types/role';

export interface AppFooterProps {
  role?: Role | null;
  className?: string;
}

export const AppFooter = ({ role = Role.TENANT, className = '' }: AppFooterProps) => {
  const { t } = useTranslation('common');

  return (
    <footer className={`border-t border-rentify-divider bg-rentify-surface/60 py-6 mt-12 shrink-0 ${className}`}>
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-rentify-text-secondary">
        <div className="flex items-center gap-2.5">
          <RentifyLogo role={role || Role.TENANT} size="sm" />
          <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span>{t('footer.hotline')}</span>
          <span>•</span>
          <span>{t('footer.termsPrivacy')}</span>
        </div>
      </div>
    </footer>
  );
};
