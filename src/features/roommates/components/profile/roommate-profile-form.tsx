import { useTranslation } from 'react-i18next';
import { Save } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { NumberInput } from '@/components/ui/number-input';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import { ProvinceWardSelect } from '@/features/administrative-units/components/province-ward-select';
import { ROOMMATE_GENDER_OPTIONS } from '../../constants/roommate.constants';
import { useRoommateProfileForm } from '../../hooks/use-roommate-profile-form';
import { RoommateLifestyleSelector } from './roommate-lifestyle-selector';

export interface RoommateProfileFormProps {
  onSuccess?: () => void;
}

export const RoommateProfileForm = ({ onSuccess }: RoommateProfileFormProps) => {
  const { t } = useTranslation('roommates');
  const { form, isFetchingProfile, isSaving, onSubmit } = useRoommateProfileForm(onSuccess);
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const isVisible = watch('isVisible');
  const lifestyle = watch('lifestyle');
  const preferredProvince = watch('preferredProvince') ?? '';
  const preferredDistrict = watch('preferredDistrict') ?? '';

  if (isFetchingProfile) {
    return (
      <div className="py-16 flex justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const genderOptions = ROOMMATE_GENDER_OPTIONS.map((opt) => ({
    value: opt.value === 'all' ? '' : opt.value,
    label: t(opt.labelKey),
  }));

  const handleLocationChange = (val: { province: string; ward: string }) => {
    setValue('preferredProvince', val.province || null);
    setValue('preferredDistrict', val.ward || null);
    setValue('preferredArea', [val.ward, val.province].filter(Boolean).join(', '));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Visibility Toggle Card */}
      <Card className="p-6 rounded-2xl bg-rentify-card border border-rentify-divider space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-rentify-text-primary">{t('profile.visibilityTitle')}</h3>
            <p className="text-xs text-rentify-text-secondary mt-0.5">{t('profile.visibilityDesc')}</p>
          </div>
          <Checkbox
            checked={isVisible}
            onChange={(e) => setValue('isVisible', e.target.checked)}
            label={t(isVisible ? 'profile.publicStatus' : 'profile.hiddenStatus')}
          />
        </div>
      </Card>

      {/* Basic Demographics */}
      <Card className="p-6 rounded-2xl bg-rentify-card border border-rentify-divider space-y-4">
        <h3 className="text-base font-bold text-rentify-text-primary">{t('profile.demographicsTitle')}</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SelectDropdown
            label={t('profile.genderLabel')}
            value={watch('gender') || ''}
            options={genderOptions}
            onChange={(e) => setValue('gender', (e.target.value as 'male' | 'female' | 'other') || null)}
          />

          <NumberInput
            label={t('profile.birthYearLabel')}
            value={watch('birthYear') ?? null}
            onChangeValue={(val) => setValue('birthYear', val ?? null)}
            placeholder="2000"
          />

          <Input
            label={t('profile.occupationLabel')}
            placeholder={t('profile.occupationPlaceholder')}
            {...register('occupation')}
            error={errors.occupation?.message}
          />
        </div>
      </Card>

      {/* Target Location & Budget */}
      <Card className="p-6 rounded-2xl bg-rentify-card border border-rentify-divider space-y-4">
        <h3 className="text-base font-bold text-rentify-text-primary">{t('profile.preferencesTitle')}</h3>

        <div className="space-y-3">
          <label className="text-xs font-semibold text-rentify-text-primary block">{t('filter.locationLabel')}</label>
          <ProvinceWardSelect province={preferredProvince} ward={preferredDistrict} onChange={handleLocationChange} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <NumberInput
            label={t('profile.budgetMinLabel')}
            value={watch('budgetMin') ?? null}
            onChangeValue={(val) => setValue('budgetMin', val ?? null)}
            placeholder="2000000"
          />

          <NumberInput
            label={t('profile.budgetMaxLabel')}
            value={watch('budgetMax') ?? null}
            onChangeValue={(val) => setValue('budgetMax', val ?? null)}
            placeholder="4000000"
          />

          <Input type="date" label={t('profile.moveInDateLabel')} {...register('moveInOn')} />
        </div>
      </Card>

      {/* Bio / Introduction */}
      <Card className="p-6 rounded-2xl bg-rentify-card border border-rentify-divider space-y-3">
        <h3 className="text-base font-bold text-rentify-text-primary">{t('profile.bioTitle')}</h3>
        <Textarea rows={3} placeholder={t('profile.bioPlaceholder')} {...register('bio')} error={errors.bio?.message} />
      </Card>

      {/* Lifestyle Habits Checklist */}
      <RoommateLifestyleSelector lifestyle={lifestyle} onToggle={(key, val) => setValue(`lifestyle.${key}`, val)} />

      {/* Save Action */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" variant="primary" size="lg" disabled={isSaving} className="gap-2 font-bold px-8">
          <Save className="h-4 w-4" />
          <span>{isSaving ? t('profile.saving') : t('profile.saveAction')}</span>
        </Button>
      </div>
    </form>
  );
};
