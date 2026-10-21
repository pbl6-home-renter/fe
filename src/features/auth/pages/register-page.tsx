import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Home,
  Building2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
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
import { Role } from '@/types/role';
import { cn } from '@/lib/utils';
import { useRegisterForm } from '@/features/auth/hooks/use-register-form';

export const RegisterPage = () => {
  const { t } = useTranslation('auth');
  const {
    setRole,
    values,
    errors,
    isLoading,
    isLandlord,
    isTenant,
    handleChange,
    handleSubmit,
  } = useRegisterForm();

  return (
    <Card className="w-full max-w-[480px] shadow-card border-rentify-divider rounded-[24px]">
      <CardHeader className="text-center pb-4">
        {/* Brand Monogram Icon */}
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
          {t('createAccount')}
        </CardTitle>
        <CardDescription className="text-sm text-rentify-text-secondary mt-1">
          {isLandlord ? t('landlordSubtitle') : t('tenantSubtitle')}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Role Selection Tabs / Cards */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-rentify-text-primary">
              {t('selectRole')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Tenant Option */}
              <button
                type="button"
                onClick={() => setRole(Role.TENANT)}
                className={cn(
                  'flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer relative',
                  isTenant
                    ? 'border-rentify-primary bg-rentify-primary-container/10 ring-1 ring-rentify-primary'
                    : 'border-rentify-divider bg-white hover:bg-rentify-background'
                )}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div
                    className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center',
                      isTenant
                        ? 'bg-rentify-primary text-white'
                        : 'bg-rentify-background text-rentify-text-secondary'
                    )}
                  >
                    <Home className="w-4 h-4" />
                  </div>
                  {isTenant && (
                    <CheckCircle2 className="w-4 h-4 text-rentify-primary" />
                  )}
                </div>
                <span className="text-sm font-bold text-rentify-text-primary leading-tight">
                  {t('tenantRole')}
                </span>
                <span className="text-[11px] text-rentify-text-secondary mt-0.5 leading-tight">
                  {t('tenantRoleDesc')}
                </span>
              </button>

              {/* Landlord Option */}
              <button
                type="button"
                onClick={() => setRole(Role.LANDLORD)}
                className={cn(
                  'flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer relative',
                  isLandlord
                    ? 'border-rentify-primary bg-rentify-primary-container/10 ring-1 ring-rentify-primary'
                    : 'border-rentify-divider bg-white hover:bg-rentify-background'
                )}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <div
                    className={cn(
                      'w-7 h-7 rounded-lg flex items-center justify-center',
                      isLandlord
                        ? 'bg-rentify-primary text-white'
                        : 'bg-rentify-background text-rentify-text-secondary'
                    )}
                  >
                    <Building2 className="w-4 h-4" />
                  </div>
                  {isLandlord && (
                    <CheckCircle2 className="w-4 h-4 text-rentify-primary" />
                  )}
                </div>
                <span className="text-sm font-bold text-rentify-text-primary leading-tight">
                  {t('landlordRole')}
                </span>
                <span className="text-[11px] text-rentify-text-secondary mt-0.5 leading-tight">
                  {t('landlordRoleDesc')}
                </span>
              </button>
            </div>
          </div>

          {/* Full Name */}
          <Input
            label={t('fullname')}
            type="text"
            value={values.fullname}
            onChange={(e) => handleChange('fullname', e.target.value)}
            placeholder={isLandlord ? t('placeholders.fullnameLandlord') : t('placeholders.fullnameTenant')}
            error={errors.fullname}
            required
          />

          {/* Phone Number */}
          <Input
            label={t('phone')}
            type="tel"
            value={values.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder={t('placeholders.phone')}
            error={errors.phone}
            required
          />

          {/* Email */}
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

          {/* Password */}
          <PasswordInput
            label={t('password')}
            value={values.password}
            onChange={(e) => handleChange('password', e.target.value)}
            placeholder={t('placeholders.password')}
            autoComplete="new-password"
            error={errors.password}
            required
          />

          {/* Confirm Password */}
          <div>
            <PasswordInput
              label={t('confirmPassword')}
              value={values.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              placeholder={t('placeholders.password')}
              autoComplete="new-password"
              error={errors.confirmPassword}
              required
            />
            {errors.confirmPassword && (
              <div className="flex items-center gap-1.5 mt-1 text-rentify-error text-xs">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.confirmPassword}</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              size="lg"
              isLoading={isLoading}
              className="w-full justify-center"
            >
              {t('register')}
            </Button>
          </div>
        </form>

        {/* Bottom Login Link */}
        <div className="mt-6 text-center text-xs text-rentify-text-secondary">
          <span>{t('alreadyHaveAccount')}</span>
          <Link
            to="/login"
            className="font-semibold text-rentify-primary hover:underline ml-1"
          >
            {t('login')}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
