import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PasswordInput } from '@/components/ui/password-input';
import { useChangePasswordForm } from '../hooks/use-change-password-form';

export const SecuritySettingsPage = () => {
  const { t } = useTranslation('auth');
  const { register, errors, handleSubmit, isSubmitting } = useChangePasswordForm();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-rentify-text-primary">{t('securitySettings')}</h1>
      <Card className="max-w-xl">
        <h2 className="text-lg font-semibold text-rentify-text-primary">{t('changePassword')}</h2>
        <p className="mt-1 text-sm text-rentify-text-secondary">{t('changePasswordDescription')}</p>
        <form className="mt-5 flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
          <PasswordInput label={t('currentPassword')} autoComplete="current-password" error={errors.currentPassword} disabled={isSubmitting} required {...register('currentPassword')} />
          <PasswordInput label={t('newPassword')} autoComplete="new-password" error={errors.newPassword} disabled={isSubmitting} required {...register('newPassword')} />
          <PasswordInput label={t('confirmPassword')} autoComplete="new-password" error={errors.confirmPassword} disabled={isSubmitting} required {...register('confirmPassword')} />
          <p className="text-sm text-rentify-text-secondary">{t('passwordHint')}</p>
          <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>{t('changePassword')}</Button>
        </form>
      </Card>
    </div>
  );
};
