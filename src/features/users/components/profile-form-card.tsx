import { useTranslation } from 'react-i18next';
import { CreditCard, RotateCcw, Save, Trash2, User as UserIcon } from 'lucide-react';
import { AlertBanner } from '@/components/feedback/alert-banner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { getFieldError } from '@/lib/form';
import { useProfileForm } from '../hooks/use-profile-form';
import type { UserMeResponseDto } from '../types/users.dto';

export interface ProfileFormCardProps {
  user: UserMeResponseDto;
}

export const ProfileFormCard = ({ user }: ProfileFormCardProps) => {
  const { t } = useTranslation('users');
  const {
    form,
    isLandlord,
    isDirty,
    hasServerConflict,
    isSubmitting,
    handleResetToServer,
    handleClearPayout,
    onSubmit,
  } = useProfileForm(user);

  const {
    register,
    watch,
    formState: { errors },
  } = form;

  const hasPayoutInput = Boolean(watch('bankCode') || watch('accountNumber') || watch('accountName'));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-rentify-text-primary">
          <UserIcon className="h-5 w-5 text-rentify-primary" aria-hidden="true" />
          <span>{t('profile.sections.personalInfo')}</span>
        </CardTitle>
        <CardDescription>{t('profile.sections.personalInfoDesc')}</CardDescription>
      </CardHeader>

      <CardContent className="pt-2">
        <form onSubmit={onSubmit} className="space-y-5">
          {hasServerConflict && (
            <AlertBanner
              variant="warning"
              title={t('profile.conflict.title')}
              action={
                <Button type="button" variant="outline" size="sm" onClick={handleResetToServer}>
                  {t('profile.conflict.reloadAction')}
                </Button>
              }
            >
              <span className="text-sm">{t('profile.conflict.description')}</span>
            </AlertBanner>
          )}

          <FormField
            label={t('fields.email')}
            htmlFor="profile-email"
            helperText={t('profile.fields.emailReadOnlyHint')}
          >
            <Input id="profile-email" value={user.email} disabled readOnly />
          </FormField>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField label={t('fields.name')} required htmlFor="profile-name" error={getFieldError(errors.name, t)}>
              <Input
                id="profile-name"
                placeholder={t('profile.placeholders.name')}
                disabled={isSubmitting}
                {...register('name')}
              />
            </FormField>

            <FormField
              label={t('fields.phone')}
              required
              htmlFor="profile-phone"
              error={getFieldError(errors.phone, t)}
            >
              <Input
                id="profile-phone"
                placeholder={t('profile.placeholders.phone')}
                disabled={isSubmitting}
                {...register('phone')}
              />
            </FormField>
          </div>

          {isLandlord && (
            <>
              <Divider className="my-2" />

              <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-rentify-text-primary">
                      <CreditCard className="h-4 w-4 text-rentify-primary" aria-hidden="true" />
                      <span>{t('profile.sections.payoutAccount')}</span>
                    </h3>
                    <p className="text-xs text-rentify-text-secondary">{t('profile.sections.payoutAccountDesc')}</p>
                  </div>

                  {hasPayoutInput && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleClearPayout}
                      disabled={isSubmitting}
                      className="gap-1.5 self-start text-rentify-text-secondary sm:self-auto"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>{t('profile.actions.clearPayout')}</span>
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <FormField
                    label={t('detail.bankCode')}
                    htmlFor="profile-bank-code"
                    error={getFieldError(errors.bankCode, t)}
                  >
                    <Input
                      id="profile-bank-code"
                      placeholder={t('profile.placeholders.bankCode')}
                      disabled={isSubmitting}
                      {...register('bankCode')}
                    />
                  </FormField>

                  <FormField
                    label={t('detail.accountNumber')}
                    htmlFor="profile-account-number"
                    error={getFieldError(errors.accountNumber, t)}
                  >
                    <Input
                      id="profile-account-number"
                      inputMode="numeric"
                      className="tabular-nums"
                      placeholder={t('profile.placeholders.accountNumber')}
                      disabled={isSubmitting}
                      {...register('accountNumber')}
                    />
                  </FormField>

                  <FormField
                    label={t('detail.accountName')}
                    htmlFor="profile-account-name"
                    error={getFieldError(errors.accountName, t)}
                  >
                    <Input
                      id="profile-account-name"
                      placeholder={t('profile.placeholders.accountName')}
                      disabled={isSubmitting}
                      {...register('accountName')}
                    />
                  </FormField>
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-rentify-divider pt-4 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleResetToServer}
              disabled={!isDirty || isSubmitting}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>{t('profile.actions.discardChanges')}</span>
            </Button>

            <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting} className="gap-2">
              <Save className="h-4 w-4" aria-hidden="true" />
              <span>{t('profile.actions.saveChanges')}</span>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
