import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import landlordLogo from '@/assets/landlord-logo.png';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { Card } from '@/components/ui/card';
import { useResetPasswordForm } from '../forms/use-reset-password-form';

export const ResetPasswordPage = () => {
  const { t } = useTranslation('auth');
  const { register, errors, isSubmitting, isTokenMissing, handleSubmit } = useResetPasswordForm();

  return (
    <Card className="w-full max-w-[440px] p-8 md:p-10 shadow-spotlight rounded-hero">
      {/* Brand Logo & Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center p-2 mb-4 shadow-xs">
          <img
            src={landlordLogo}
            alt="Rentify"
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-rentify-text-primary">
          {t('resetPasswordTitle')}
        </h1>
        <p className="text-sm text-rentify-text-secondary mt-1.5 leading-relaxed">
          {t('resetPasswordSubtitle')}
        </p>
      </div>

      {isTokenMissing ? (
        <div
          role="alert"
          className="p-4 rounded-xl bg-rentify-warning/10 border border-rentify-warning/20 text-rentify-text-primary flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-rentify-warning shrink-0 mt-0.5" />
          <div className="space-y-3">
            <p className="text-sm font-medium leading-relaxed">
              {t('errors.tokenRequired')}
            </p>
            <Link
              to="/forgot-password"
              className="inline-flex items-center text-xs font-semibold text-rentify-primary hover:underline"
            >
              ← {t('resendResetLink')}
            </Link>
          </div>
        </div>
      ) : (
        <>
          {errors.serverError && (
            <div
              role="alert"
              className="flex items-center gap-2 p-3 mb-5 rounded-xl bg-rentify-error/10 border border-rentify-error/20 text-rentify-error text-xs font-medium"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rentify-error" />
              <span>{errors.serverError}</span>
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <PasswordInput
              label={t('newPassword')}
              placeholder={t('placeholders.password')}
              autoComplete="new-password"
              error={errors.newPassword}
              disabled={isSubmitting}
              required
              {...register('newPassword')}
            />

            <PasswordInput
              label={t('confirmPassword')}
              placeholder={t('placeholders.confirmPassword')}
              autoComplete="new-password"
              error={errors.confirmPassword}
              disabled={isSubmitting}
              required
              {...register('confirmPassword')}
            />

            <div className="p-3 bg-surface-container-low rounded-xl text-xs text-rentify-text-secondary leading-relaxed">
              {t('passwordHint')}
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="w-full h-11 mt-2 font-medium rounded-xl"
            >
              {t('resetPasswordTitle')}
            </Button>

            <div className="mt-4 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-rentify-text-secondary hover:text-rentify-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('backToLogin')}</span>
              </Link>
            </div>
          </form>
        </>
      )}
    </Card>
  );
};
