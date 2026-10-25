import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  resetPasswordSchema,
  toResetPasswordPayload,
  type ResetPasswordFormData,
} from '@/features/auth/validations/password-reset.validation';
import {
  setFormApiErrors,
  getFieldError,
} from '@/features/auth/validations/common.validation';
import { useResetPasswordMutation } from '@/features/auth/hooks/auth/use-reset-password-mutation';

export const ResetPasswordPage = () => {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const resetMutation = useResetPasswordMutation({
    suppressErrorToast: true,
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      newPassword: '',
      confirmPassword: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const payload = toResetPasswordPayload(values);
      await resetMutation.mutateAsync(payload);
      navigate('/login', { replace: true });
    } catch (err: unknown) {
      setFormApiErrors(setError, err);
    }
  });

  const isLoading = resetMutation.isPending || isSubmitting;
  const serverError = errors.root?.serverError?.message;
  const isTokenMissing = !token;

  return (
    <Card className="w-full max-w-105 shadow-card border-rentify-divider rounded-[16px]">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-12 h-12 rounded-xl bg-rentify-primary-container/10 flex items-center justify-center text-rentify-primary mb-3 shadow-xs">
          <svg
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 28 28"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 12.5L14 4.5L24 12.5V23C24 23.5523 23.5523 24 23 24H5C4.44772 24 4 23.5523 4 23V12.5Z"
              stroke="#1E6FD9"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              d="M10 24V14H18V24"
              stroke="#1E6FD9"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
            <path
              d="M14 8.5V11"
              stroke="#1E6FD9"
              strokeLinecap="round"
              strokeWidth="2"
            />
          </svg>
        </div>

        <CardTitle className="text-2xl font-bold text-rentify-text-primary">
          {t('resetPasswordTitle')}
        </CardTitle>
        <CardDescription className="text-sm text-rentify-text-secondary mt-1 leading-relaxed">
          {t('resetPasswordSubtitle')}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {isTokenMissing ? (
          <div
            role="alert"
            className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm font-medium leading-relaxed">
              {t('errors.tokenRequired')}
            </p>
          </div>
        ) : (
          <>
            {serverError && (
              <div
                role="alert"
                className="flex items-center gap-2 p-3 rounded-xl bg-rentify-error/10 border border-rentify-error/20 text-rentify-error text-sm font-medium"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <form className="space-y-4" onSubmit={onSubmit} noValidate>
              <input type="hidden" {...register('token')} value={token} />

              <PasswordInput
                label={t('newPassword')}
                placeholder={t('placeholders.password')}
                autoComplete="new-password"
                error={getFieldError(errors.newPassword, t)}
                disabled={isLoading}
                required
                {...register('newPassword')}
              />

              <PasswordInput
                label={t('confirmPassword')}
                placeholder={t('placeholders.password')}
                autoComplete="new-password"
                error={getFieldError(errors.confirmPassword, t)}
                disabled={isLoading}
                required
                {...register('confirmPassword')}
              />

              <p className="text-xs text-rentify-text-secondary">
                {t('passwordHint')}
              </p>

              <Button
                type="submit"
                size="lg"
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full justify-center mt-2"
              >
                {t('resetPasswordTitle')}
              </Button>
            </form>
          </>
        )}

        <div className="pt-2 text-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-rentify-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('backToLogin')}</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
