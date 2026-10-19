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

export const LoginPage = () => {
  const { t } = useTranslation('auth');

  return (
    <Card className="w-full max-w-md shadow-card border-rentify-divider">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">{t('login')}</CardTitle>
        <CardDescription>{t('loginSubtitle')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <Input
            label={t('email')}
            type="email"
            placeholder="email@example.com"
            autoComplete="email"
          />
          <PasswordInput
            label={t('password')}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <Button type="submit" className="w-full">
            {t('login')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
