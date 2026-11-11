import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNotify } from '@/lib/notifications/use-notify';
import { Role } from '@/types/role';
import { profileSchema, type ProfileFormData } from '../forms/profile.schema';
import type { UserMeResponseDto, UserUpdateMeRequestDto } from '../types/users.dto';
import { useUpdateMeMutation } from './use-update-me-mutation';

const toFormValues = (user?: UserMeResponseDto): ProfileFormData => ({
  name: user?.name ?? '',
  phone: user?.phone ?? '',
  bankCode: user?.payoutAccount?.bankCode ?? '',
  accountNumber: user?.payoutAccount?.accountNumber ?? '',
  accountName: user?.payoutAccount?.accountName ?? '',
});

export const useProfileForm = (user?: UserMeResponseDto) => {
  const { t } = useTranslation('users');
  const notify = useNotify();
  const updateMutation = useUpdateMeMutation();
  const isLandlord = user?.role === Role.LANDLORD;

  const serverValues = toFormValues(user);
  const serverSnapshot = JSON.stringify(serverValues);
  const [baselineSnapshot, setBaselineSnapshot] = useState(serverSnapshot);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: serverValues,
    resetOptions: {
      keepDirtyValues: true,
    },
    mode: 'onTouched',
  });

  const { isDirty } = form.formState;

  if (!isDirty && serverSnapshot !== baselineSnapshot) {
    setBaselineSnapshot(serverSnapshot);
  }

  const hasServerConflict = isDirty && serverSnapshot !== baselineSnapshot;

  useEffect(() => {
    if (!isDirty) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleResetToServer = () => {
    form.reset(serverValues);
    setBaselineSnapshot(serverSnapshot);
  };

  const handleClearPayout = () => {
    form.setValue('bankCode', '', { shouldDirty: true, shouldValidate: true });
    form.setValue('accountNumber', '', { shouldDirty: true, shouldValidate: true });
    form.setValue('accountName', '', { shouldDirty: true, shouldValidate: true });
  };

  const onSubmit = form.handleSubmit((values) => {
    if (!user) return;
    if (!isDirty && !hasServerConflict) {
      notify.info(t('profile.messages.noChanges'));
      return;
    }

    const bankCode = values.bankCode.trim();
    const accountNumber = values.accountNumber.trim();
    const accountName = values.accountName.trim();
    const hasPayout = isLandlord && Boolean(bankCode && accountNumber && accountName);

    const payload: UserUpdateMeRequestDto = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      payoutAccount: hasPayout ? { bankCode, accountNumber, accountName } : null,
    };

    updateMutation.mutate(payload, {
      onSuccess: (updated) => {
        const syncedValues: ProfileFormData = {
          name: updated.name,
          phone: updated.phone,
          bankCode: updated.payoutAccount?.bankCode ?? '',
          accountNumber: updated.payoutAccount?.accountNumber ?? '',
          accountName: updated.payoutAccount?.accountName ?? '',
        };
        setBaselineSnapshot(JSON.stringify(syncedValues));
        form.reset(syncedValues);
      },
    });
  });

  return {
    form,
    isLandlord,
    isDirty,
    hasServerConflict,
    isSubmitting: updateMutation.isPending,
    handleResetToServer,
    handleClearPayout,
    onSubmit,
  };
};
