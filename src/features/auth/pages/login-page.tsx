import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import landlordLogo from '@/assets/landlord-logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { useLoginForm } from '../forms/use-login-form';

export const LoginPage = () => {
  const { t } = useTranslation('auth');
  const {
    register,
    errors,
    isSubmitting,
    handleSubmit,
  } = useLoginForm();

  return (
    <Card className="w-full max-w-[440px] p-8 md:p-10 shadow-spotlight rounded-hero">
      {/* Brand Logo & Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center p-2 mb-4 shadow-xs">
          <img
            src={landlordLogo}
            alt="Rentify"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-rentify-text-primary">{t('login')}</h1>
        <p className="text-sm text-rentify-text-secondary mt-1.5 leading-relaxed">{t('loginSubtitle')}</p>
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

      {/* Login Form */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <Input
          label={t('identifier')}
          type="email"
          placeholder={t('placeholders.identifier')}
          autoComplete="username"
          error={errors.identifier}
          disabled={isSubmitting}
          required
          {...register('identifier')}
        />

        <div className="flex flex-col gap-1.5">
          <PasswordInput
            label={t('password')}
            placeholder={t('placeholders.password')}
            autoComplete="current-password"
            error={errors.password}
            disabled={isSubmitting}
            required
            {...register('password')}
          />
        </div>

        <div className="flex items-center justify-between text-xs pt-0.5">
          <Checkbox
            label={<span className="text-xs text-rentify-text-secondary">{t('rememberMe')}</span>}
            disabled={isSubmitting}
            {...register('rememberMe')}
          />

          <Link
            to="/forgot-password"
            className="font-medium text-rentify-primary hover:underline transition-colors"
          >
            {t('forgotPassword')}
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          className="w-full h-11 mt-2 font-medium rounded-xl"
        >
          {t('login')}
        </Button>
      </form>

      {/* Bottom Switch to Register */}
      <div className="mt-8 text-center text-sm text-rentify-text-secondary">
        <span>{t('dontHaveAccount')}</span>
        <Link
          to="/register"
          className="font-semibold text-rentify-primary hover:underline ml-1.5 inline-flex items-center"
        >
          {t('register')}
        </Link>
      </div>
    </Card>
  );
};
