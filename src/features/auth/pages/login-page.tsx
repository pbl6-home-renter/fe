import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
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
    <Card className="w-full max-w-md shadow-card border-rentify-divider">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{t('login')}</CardTitle>
        <CardDescription>{t('loginSubtitle')}</CardDescription>
      </CardHeader>

      <CardContent>
        {errors.serverError && (
          <div
            role="alert"
            className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-rentify-error/10 border border-rentify-error/20 text-rentify-error text-sm font-medium"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errors.serverError}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <Input
            label={t('identifier')}
            type="text"
            placeholder={t('placeholders.identifier')}
            autoComplete="username"
            error={errors.identifier}
            disabled={isSubmitting}
            required
            {...register('identifier')}
          />

          <PasswordInput
            label={t('password')}
            placeholder={t('placeholders.password')}
            autoComplete="current-password"
            error={errors.password}
            disabled={isSubmitting}
            required
            {...register('password')}
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-rentify-text-secondary">
              <input
                type="checkbox"
                className="rounded border-rentify-divider text-rentify-primary focus:ring-rentify-primary"
                disabled={isSubmitting}
                {...register('rememberMe')}
              />
              <span>{t('rememberMe')}</span>
            </label>

            <Link
              to="/forgot-password"
              className="font-medium text-rentify-primary hover:underline"
            >
              {t('forgotPassword')}
            </Link>
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
          >
            {t('login')}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-rentify-text-secondary">
          <span>{t('dontHaveAccount')}</span>
          <Link
            to="/register"
            className="font-semibold text-rentify-primary hover:underline ml-1"
          >
            {t('register')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
