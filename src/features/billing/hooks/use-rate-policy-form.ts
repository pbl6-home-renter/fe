import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ratePolicyFormSchema, type RatePolicyFormData } from '../forms/rate-policy.schema';
import type { RatePolicyDto, RatePolicyScope } from '../types/billing.dto';
import { useBatchBuildingRatePoliciesMutation } from './use-batch-building-rate-policies-mutation';
import { useCreateRatePolicyMutation } from './use-create-rate-policy-mutation';
import { useUpdateRatePolicyMutation } from './use-update-rate-policy-mutation';

export interface UseRatePolicyFormOptions {
  scope: RatePolicyScope;
  buildingId?: string;
  roomId?: string;
  existingPolicy?: RatePolicyDto | null;
  isOpen?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const useRatePolicyForm = ({
  scope,
  buildingId,
  roomId,
  existingPolicy,
  isOpen = true,
  onSuccess,
  onCancel,
}: UseRatePolicyFormOptions) => {
  const { t } = useTranslation('billing');
  const defaultRates = useMemo(
    () => [
      {
        type: 'electricity' as const,
        name: t('rateTypes.electricity'),
        rateKind: 'flat' as const,
        unitPrice: '3800',
        steps: null,
        billingUnit: 'kwh' as const,
      },
      {
        type: 'water' as const,
        name: t('rateTypes.water'),
        rateKind: 'per_head' as const,
        unitPrice: '100000',
        steps: null,
        billingUnit: 'person' as const,
      },
      {
        type: 'wifi' as const,
        name: t('rateTypes.wifi'),
        rateKind: 'fixed_per_period' as const,
        unitPrice: '100000',
        steps: null,
        billingUnit: 'room' as const,
      },
    ],
    [t],
  );
  const createMutation = useCreateRatePolicyMutation();
  const updateMutation = useUpdateRatePolicyMutation();
  const batchMutation = useBatchBuildingRatePoliciesMutation();
  const prevOpenRef = useRef(false);

  const form = useForm<RatePolicyFormData>({
    resolver: zodResolver(ratePolicyFormSchema),
    defaultValues: {
      rates: existingPolicy?.rates?.length ? existingPolicy.rates : defaultRates,
    },
    mode: 'onTouched',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'rates',
  });

  useEffect(() => {
    const wasJustOpened = isOpen && !prevOpenRef.current;
    prevOpenRef.current = isOpen;

    if (wasJustOpened) {
      form.reset({
        rates: existingPolicy?.rates?.length
          ? existingPolicy.rates.map((r) => ({
              type: r.type,
              name: r.name,
              rateKind: r.rateKind,
              unitPrice: r.unitPrice ?? '',
              steps: r.steps ?? null,
              billingUnit: r.billingUnit,
            }))
          : defaultRates,
      });
    }
  }, [isOpen, existingPolicy, defaultRates, form]);

  const onSubmit = form.handleSubmit((values) => {
    const cleanRates = values.rates.map((item) => ({
      type: item.type,
      name: item.name.trim(),
      rateKind: item.rateKind,
      unitPrice: item.rateKind === 'tiered' ? null : (item.unitPrice ?? '0'),
      steps: item.rateKind === 'tiered' ? item.steps : null,
      billingUnit: item.billingUnit,
    }));

    if (existingPolicy?.id) {
      updateMutation.mutate(
        {
          ratePolicyId: existingPolicy.id,
          payload: { rates: cleanRates, isActive: true },
        },
        { onSuccess },
      );
      return;
    }

    if (scope === 'building' && buildingId) {
      batchMutation.mutate(
        {
          buildingId,
          payload: { rates: cleanRates },
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
        rates: cleanRates,
      },
      { onSuccess },
    );
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending || batchMutation.isPending;

  return {
    form,
    fields,
    append,
    remove,
    onSubmit,
    onCancel,
    isSubmitting,
  };
};
