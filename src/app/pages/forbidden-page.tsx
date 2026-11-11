import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, ArrowLeft, Home, LifeBuoy } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { getHomePathByRole } from '@/app/routes/route-utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RentifyLogo } from '@/components/ui/rentify-logo';

export const ForbiddenPage = () => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const { t } = useTranslation();

  const homePath = getHomePathByRole(role);

  return (
    <main className="w-full min-h-screen bg-rentify-background flex items-center justify-center p-4 sm:p-6 antialiased">
      <div className="relative w-full max-w-120 mx-auto flex flex-col items-center">
        {/* Glow ambient background effects */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-rentify-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -right-8 w-52 h-52 bg-rentify-error/5 rounded-full blur-3xl pointer-events-none" />

        {/* Brand header */}
        <div className="flex items-center gap-2.5 mb-6">
          <RentifyLogo role={role} size="lg" />
          <span className="text-rentify-text-secondary text-xs font-medium">· {t('systemSecurity')}</span>
        </div>

        {/* Card */}
        <Card className="relative flex w-full flex-col items-center p-6 text-center sm:p-10">
          {/* Lock Icon */}
          <div className="w-16 h-16 rounded-full bg-rentify-error/10 flex items-center justify-center mb-5 text-rentify-error shadow-xs">
            <Lock className="w-8 h-8" aria-hidden="true" strokeWidth={2} />
          </div>

          {/* Status Badge */}
          <Badge variant="error" className="mb-3">
            {t('errors.forbidden.badge')}
          </Badge>

          {/* Title & Description */}
          <h1 className="text-2xl font-bold text-rentify-text-primary mb-2 tracking-tight">
            {t('errors.forbidden.title')}
          </h1>
          <p className="text-sm text-rentify-text-secondary leading-relaxed max-w-sm mb-6">
            {t('errors.forbidden.description')}
          </p>

          {/* Actions */}
          <div className="w-full flex flex-col items-center gap-3">
            <Button className="w-full sm:w-auto min-w-55 gap-2" onClick={() => navigate(homePath)}>
              <Home className="w-4 h-4" />
              <span>{t('errors.forbidden.backHome')}</span>
            </Button>

            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
              <span>{t('errors.forbidden.backPrev')}</span>
            </Button>
          </div>

          {/* Support */}
          <div className="w-full pt-5 mt-6 border-t border-rentify-divider flex items-center justify-center gap-1.5 text-rentify-text-secondary text-xs">
            <LifeBuoy className="w-4 h-4 text-rentify-primary" />
            <span>{t('support.title')}</span>
            <a href={`tel:${t('support.phone')}`} className="text-rentify-primary hover:underline font-semibold">
              {t('support.phone')}
            </a>
          </div>
        </Card>

        {/* Footer info */}
        <div className="mt-4 text-center">
          <span className="text-xs text-rentify-neutral">{t('footer.platformDescription')}</span>
        </div>
      </div>
    </main>
  );
};
