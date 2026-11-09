import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { billingSettingFormSchema, type BillingSettingFormData } from '../forms/billing-setting.schema';
import type { BillingSettingDto, BillingSettingScope } from '../types/billing.dto';
import { DEFAULT_BILLING_SETTING } from '../constants/billing.constants';
import { useCreateBillingSettingMutation } from './use-create-billing-setting-mutation';
import { useUpdateBillingSettingMutation } from './use-update-billing-setting-mutation';

export interface UseBillingSettingFormOptions {
  scope: BillingSettingScope;
  buildingId: string;
  roomId?: string;
  existingSetting?: BillingSettingDto | null;
  isOpen?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const useBillingSettingForm = ({
  scope,
  buildingId,
  roomId,
  existingSetting,
  isOpen = true,
  onSuccess,
  onCancel,
}: UseBillingSettingFormOptions) => {
  const createMutation = useCreateBillingSettingMutation();
  const updateMutation = useUpdateBillingSettingMutation();
  const prevOpenRef = useRef(false);

  const form = useForm<BillingSettingFormData>({
    resolver: zodResolver(billingSettingFormSchema),
    defaultValues: {
      paymentDueDay: existingSetting?.paymentDueDay ?? DEFAULT_BILLING_SETTING.paymentDueDay,
      remindDay:
        existingSetting?.remindDay !== undefined ? existingSetting.remindDay : DEFAULT_BILLING_SETTING.remindDay,
      botEnabled: existingSetting?.botEnabled ?? DEFAULT_BILLING_SETTING.botEnabled,
    },
    mode: 'onTouched',
  });

  useEffect(() => {
    const wasJustOpened = isOpen && !prevOpenRef.current;
    prevOpenRef.current = isOpen;

    if (wasJustOpened) {
      form.reset({
        paymentDueDay: existingSetting?.paymentDueDay ?? DEFAULT_BILLING_SETTING.paymentDueDay,
        remindDay:
          existingSetting?.remindDay !== undefined ? existingSetting.remindDay : DEFAULT_BILLING_SETTING.remindDay,
        botEnabled: existingSetting?.botEnabled ?? DEFAULT_BILLING_SETTING.botEnabled,
      });
    }
  }, [isOpen, existingSetting, form]);

  const onSubmit = form.handleSubmit((values) => {
    if (existingSetting?.id) {
      updateMutation.mutate(
        {
          billingSettingId: existingSetting.id,
          payload: {
            paymentDueDay: values.paymentDueDay,
            remindDay: values.remindDay ?? null,
            botEnabled: values.botEnabled,
            isActive: true,
          },
        },
        { onSuccess },
      );
      return;
    }

    createMutation.mutate(
      {
        scope,
        buildingId,
        roomId,
        paymentDueDay: values.paymentDueDay,
        remindDay: values.remindDay ?? null,
        botEnabled: values.botEnabled,
      },
      { onSuccess },
    );
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return {
    form,
    onSubmit,
    onCancel,
    isSubmitting,
  };
};
