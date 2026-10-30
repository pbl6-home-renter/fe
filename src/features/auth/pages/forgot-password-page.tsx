import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useForgotPasswordForm } from '../forms/use-forgot-password-form';

export const ForgotPasswordPage = () => {
  const { t } = useTranslation('auth');
  const { register, errors, isSubmitting, isSuccess, handleSubmit } = useForgotPasswordForm();

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
          {t('forgotPasswordTitle')}
        </CardTitle>
        <CardDescription className="text-sm text-rentify-text-secondary mt-1 leading-relaxed">
          {t('forgotPasswordSubtitle')}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {errors.serverError && (
          <div
            role="alert"
            className="flex items-center gap-2 p-3 rounded-xl bg-rentify-error/10 border border-rentify-error/20 text-rentify-error text-sm font-medium"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errors.serverError}</span>
          </div>
        )}

        {isSuccess ? (
          <div
            role="status"
            className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-800"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-sm font-medium leading-relaxed">
              {t('resetLinkSent')}
            </p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
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
              size="lg"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="w-full justify-center mt-2"
            >
              {t('sendResetLink')}
            </Button>
          </form>
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
