import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home,
  Building2,
  AlertCircle,
} from 'lucide-react';
import landlordLogo from '@/assets/landlord-logo.png';
import tenantLogo from '@/assets/tenant-logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Card } from '@/components/ui/card';
import { Role } from '@/types/role';
import { cn } from '@/lib/utils/cn';
import { useRegisterForm } from '../forms/use-register-form';

export const RegisterPage = () => {
  const { t } = useTranslation('auth');
  const {
    register,
    setRole,
    errors,
    isSubmitting,
    isLandlord,
    isTenant,
    handleSubmit,
  } = useRegisterForm();

  return (
    <Card className="w-full max-w-[480px] p-8 sm:p-10 shadow-spotlight rounded-hero transition-all duration-300">
      {/* Brand Logo & Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-surface-container-low flex items-center justify-center p-2 mb-4 shadow-xs">
          <img
            src={isTenant ? tenantLogo : landlordLogo}
            alt="Rentify"
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-rentify-text-primary">
          {isLandlord ? t('registerLandlordTitle') : t('registerTenantTitle')}
        </h1>
        <p className="text-sm text-rentify-text-secondary mt-1.5 leading-relaxed max-w-[360px]">
          {isLandlord ? t('landlordSubtitle') : t('tenantSubtitle')}
        </p>
      </div>

      {/* Role Selector Tabs */}
      <div className="mb-6">
        <label className="text-xs font-semibold uppercase tracking-wider text-rentify-text-secondary block mb-2">
          {t('selectRole')}
        </label>
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-surface-container-low border border-rentify-divider rounded-2xl">
          <button
            type="button"
            onClick={() => setRole(Role.LANDLORD)}
            disabled={isSubmitting}
            className={cn(
              'flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer',
              isLandlord
                ? 'bg-rentify-surface text-rentify-primary shadow-xs border border-rentify-divider'
                : 'text-rentify-text-secondary hover:text-rentify-text-primary'
            )}
          >
            <Building2 className="w-4 h-4 shrink-0" />
            <span>{t('landlordRole')}</span>
          </button>

          <button
            type="button"
            onClick={() => setRole(Role.TENANT)}
            disabled={isSubmitting}
            className={cn(
              'flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer',
              isTenant
                ? 'bg-rentify-surface text-rentify-primary shadow-xs border border-rentify-divider'
                : 'text-rentify-text-secondary hover:text-rentify-text-primary'
            )}
          >
            <Home className="w-4 h-4 shrink-0" />
            <span>{t('tenantRole')}</span>
          </button>
        </div>
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

      {/* Form */}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
        <Input
          label={t('name')}
          placeholder={isLandlord ? t('placeholders.fullnameLandlord') : t('placeholders.fullnameTenant')}
          error={errors.name}
          disabled={isSubmitting}
          required
          {...register('name')}
        />

        <Input
          label={t('phone')}
          type="tel"
          placeholder={t('placeholders.phone')}
          error={errors.phone}
          disabled={isSubmitting}
          required
          {...register('phone')}
        />

        <Input
          label={t('email')}
          type="email"
          placeholder={t('placeholders.email')}
          error={errors.email}
          disabled={isSubmitting}
          required
          {...register('email')}
        />

        <PasswordInput
          label={t('password')}
          placeholder={t('placeholders.password')}
          error={errors.password}
          disabled={isSubmitting}
          required
          {...register('password')}
        />

        <PasswordInput
          label={t('confirmPassword')}
          placeholder={t('placeholders.confirmPassword')}
          error={errors.confirmPassword}
          disabled={isSubmitting}
          required
          {...register('confirmPassword')}
        />

        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          disabled={isSubmitting}
          className="w-full h-11 mt-2 font-medium rounded-xl"
        >
          {t('register')}
        </Button>
      </form>

      {/* Switch to Login */}
      <div className="mt-8 text-center text-sm text-rentify-text-secondary">
        <span>{t('alreadyHaveAccount')}</span>
        <Link
          to="/login"
          className="font-semibold text-rentify-primary hover:underline ml-1.5 inline-flex items-center"
        >
          {t('login')}
        </Link>
      </div>
    </Card>
  );
};
