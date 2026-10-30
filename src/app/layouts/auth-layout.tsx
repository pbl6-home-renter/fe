import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RentifyLogo } from '@/components/ui/rentify-logo';
import { Role } from '@/types/role';

export const AuthLayout = () => {
  const location = useLocation();
  const { t } = useTranslation('auth');

  const isTenantRoute = location.search.includes('role=tenant');
  const role = isTenantRoute ? Role.TENANT : Role.LANDLORD;

  return (
    <div className="min-h-screen bg-rentify-background flex flex-col justify-between antialiased font-sans text-rentify-text-primary">
      {/* Top Header: Simple Brand Logo & Title */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="group transition-transform hover:scale-102">
          <RentifyLogo role={role} size="lg" />
        </Link>
      </header>

      {/* Main Content Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full flex justify-center">
          <Outlet />
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-5 text-center text-xs text-rentify-text-secondary">
        <p>© {new Date().getFullYear()} Rentify. {t('brandTagline')}.</p>
      </footer>
    </div>
  );
};
