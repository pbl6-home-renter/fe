import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ArrowLeft, Home, LifeBuoy } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { getHomePathByRole } from '@/app/routes/route-utils';
import { Button } from '@/components/ui/button';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { t } = useTranslation();

  const homePath = getHomePathByRole(role);

  return (
    <main className="w-full min-h-screen bg-rentify-background flex items-center justify-center p-4 sm:p-6 antialiased">
      <div className="relative w-full max-w-120 mx-auto flex flex-col items-center">
        {/* Glow effects */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-rentify-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -right-8 w-52 h-52 bg-rentify-primary-hover/5 rounded-full blur-3xl pointer-events-none" />

        {/* Brand header */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-rentify-primary text-white flex items-center justify-center font-bold text-lg shadow-sm">
            R
          </div>
          <span className="text-xl font-bold text-rentify-text-primary tracking-tight">
            {t('appName')}
          </span>
          <span className="text-rentify-text-secondary text-xs font-medium">
            · {t('searchApartment')}
          </span>
        </div>

        {/* Card */}
        <div className="relative w-full bg-rentify-surface rounded-2xl border border-rentify-divider p-6 sm:p-10 shadow-[0_12px_32px_-4px_rgba(30,111,217,0.08),0_4px_12px_-2px_rgba(30,111,217,0.03)] text-center flex flex-col items-center">
          {/* 404 Large Display Graphic */}
          <div className="relative mb-4 flex items-center justify-center select-none">
            <span className="text-7xl sm:text-8xl font-black text-rentify-primary-container tracking-tight">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-rentify-primary-container/80 flex items-center justify-center text-rentify-primary shadow-xs">
                <Search className="w-7 h-7" aria-hidden="true" strokeWidth={2.2} />
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-rentify-background border border-rentify-divider mb-3">
            <span className="w-2 h-2 rounded-full bg-rentify-primary" />
            <span className="text-xs font-medium text-rentify-text-secondary">
              {t('errors.notFound.badge')}
            </span>
          </div>

          {/* Title & Description */}
          <h1 className="text-2xl font-bold text-rentify-text-primary mb-2 tracking-tight">
            {t('errors.notFound.title')}
          </h1>
          <p className="text-sm text-rentify-text-secondary leading-relaxed max-w-sm mb-6">
            {t('errors.notFound.description')}
          </p>

          {/* Actions */}
          <div className="w-full flex flex-col items-center gap-3">
            <Button
              className="w-full sm:w-auto min-w-55 gap-2"
              onClick={() => navigate(homePath)}
            >
              <Home className="w-4 h-4" />
              <span>{t('errors.notFound.backHome')}</span>
            </Button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-sm font-medium text-rentify-text-secondary hover:text-rentify-text-primary hover:bg-rentify-primary-container/50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('errors.notFound.backPrev')}</span>
            </button>
          </div>

          {/* Support */}
          <div className="w-full pt-5 mt-6 border-t border-rentify-divider flex items-center justify-center gap-1.5 text-rentify-text-secondary text-xs">
            <LifeBuoy className="w-4 h-4 text-rentify-primary" />
            <span>{t('support.techTitle')}</span>
            <a
              href={`tel:${t('support.phone')}`}
              className="text-rentify-primary hover:underline font-semibold"
            >
              {t('support.phone')}
            </a>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-4 text-center">
          <span className="text-xs text-rentify-neutral">
            {t('footer.platformDescription')}
          </span>
        </div>
      </div>
    </main>
  );
};

