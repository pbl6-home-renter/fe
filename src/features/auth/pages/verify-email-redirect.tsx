import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/config/routes.config';
import { getErrorMessage } from '@/lib/api/errors';
import { useNotify } from '@/lib/notifications/use-notify';
import { useVerifyEmailMutation } from '../hooks/use-verify-email-mutation';

const EMAIL_VERIFICATION_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export const VerifyEmailRedirect = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t } = useTranslation('auth');
  const notify = useNotify();
  const verifyMutation = useVerifyEmailMutation();
  const verifyEmail = verifyMutation.mutateAsync;
  const verificationStarted = useRef(false);

  useEffect(() => {
    if (verificationStarted.current) return;
    verificationStarted.current = true;

    const token = searchParams.get('token')?.trim() ?? '';
    if (!EMAIL_VERIFICATION_TOKEN_PATTERN.test(token)) {
      notify.error(token ? t('emailVerificationTokenInvalid') : t('emailVerificationTokenMissing'));
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }

    void verifyEmail({ token })
      .then(() => {
        notify.success(t('emailVerificationSuccess'));
        navigate(ROUTES.LOGIN, { replace: true });
      })
      .catch((error: unknown) => {
        notify.error(getErrorMessage(error));
        navigate(ROUTES.LOGIN, { replace: true });
      });
  }, [navigate, notify, searchParams, t, verifyEmail]);

  return null;
};
