import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import landlordLogo from '@/assets/landlord-logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useForgotPasswordForm } from '../forms/use-forgot-password-form';

export const ForgotPasswordPage = () => {
  const { t } = useTranslation('auth');
  const { register, errors, isSubmitting, isSuccess, handleSubmit } = useForgotPasswordForm();

  return (
    <Card className="w-full max-w-[420px] p-8 md:p-10 shadow-spotlight rounded-hero">
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
          {t('forgotPasswordTitle')}
        </h1>
        <p className="text-sm text-rentify-text-secondary mt-1.5 leading-relaxed">
          {t('forgotPasswordSubtitle')}
        </p>
      </div>

      {/* Server Error Alert */}
      {errors.serverError && (
        <div
          role="alert"
          className="flex items-center gap-2 p-3 mb-5 rounded-xl bg-rentify-error/10 border border-rentify-error/20 text-rentify-error text-xs font-medium"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-rentify-error" />
          <span>{errors.serverError}</span>
        </div>
      )}

      {isSuccess ? (
        <div className="space-y-6">
          <div
            role="status"
            className="p-4 rounded-xl bg-rentify-success/10 border border-rentify-success/20 flex items-start gap-3 text-rentify-success"
          >
            <CheckCircle2 className="w-5 h-5 text-rentify-success shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed font-medium">
              {t('resetLinkSent')}
            </p>
          </div>

          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 w-full h-11 bg-surface-container-low hover:bg-surface-container text-rentify-primary font-medium text-sm rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('backToLogin')}</span>
          </Link>
        </div>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <Input
            label={t('email')}
            type="email"
            placeholder={t('placeholders.email')}
            autoComplete="email"
            error={errors.email}
            disabled={isSubmitting}
            required
            {...register('email')}
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full h-11 mt-2 font-medium rounded-xl"
          >
            {t('sendResetLink')}
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
      )}
    </Card>
  );
};
