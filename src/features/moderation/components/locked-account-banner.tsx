import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertBanner } from '@/components/feedback/alert-banner';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes.config';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { UserStatus } from '@/types/user';

/** Read-only notice shown on every app screen while the account is locked (P12-D100). */
export const LockedAccountBanner = () => {
  const { t } = useTranslation('moderation');
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.status !== UserStatus.LOCKED) return null;

  return (
    <AlertBanner
      variant="warning"
      title={t('lockedBanner.title')}
      className="mb-6"
      action={
        <Button variant="outline" size="sm" onClick={() => navigate(ROUTES.ACCOUNT_LOCKED)}>
          {t('lockedBanner.action')}
        </Button>
      }
    >
      <p>{t('lockedBanner.description')}</p>
    </AlertBanner>
  );
};
