import { Outlet, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Building2, Sparkles } from 'lucide-react';

export const AuthLayout = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-rentify-background flex flex-col justify-between antialiased">
      {/* Top Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-rentify-primary text-white flex items-center justify-center font-bold text-xl shadow-md transition-transform group-hover:scale-105">
            R
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-rentify-text-primary">
              {t('appName')}
            </span>
            <span className="text-[11px] font-medium text-rentify-text-secondary -mt-1">
              {t('appTagline')}
            </span>
          </div>
        </Link>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-rentify-text-secondary">
          <ShieldCheck className="w-4 h-4 text-rentify-success" />
          <span>{t('securityBadge')}</span>
        </div>
      </header>

      {/* Main Content (Centered Card or Split Layout) */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center sm:flex sm:justify-between sm:items-center text-xs text-rentify-text-secondary border-t border-rentify-divider/60">
        <div className="flex items-center justify-center gap-4 mb-2 sm:mb-0">
          <span className="flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-rentify-primary" />
            {t('footer.propertyManagement')}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rentify-warning" />
            {t('footer.vietqrContract')}
          </span>
        </div>
        <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
      </footer>
    </div>
  );
};

