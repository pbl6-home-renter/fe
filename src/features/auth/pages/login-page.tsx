import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { useLoginForm } from '@/features/auth/hooks/use-login-form';

export const LoginPage = () => {
  const { t } = useTranslation('auth');
  const {
    values,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <Card className="w-full max-w-md shadow-card border-rentify-divider">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{t('login')}</CardTitle>
        <CardDescription>{t('loginSubtitle')}</CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label={t('email')}
            type="email"
            value={values.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder={t('placeholders.email')}
            autoComplete="email"
            error={errors.email}
            required
          />

          <PasswordInput
            label={t('password')}
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder={t('placeholders.password')}
            autoComplete="current-password"
            error={errors.password}
            required
          />

          <Button type="submit" isLoading={isLoading} className="w-full">
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
