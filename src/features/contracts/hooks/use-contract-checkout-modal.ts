import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { useTranslation } from 'react-i18next';
import { checkoutSchema, type CheckoutFormValues } from '../forms/contract-member.schema';
import { useContractCheckoutMutation } from './use-contract-checkout-mutation';
import type { ContractDetailDto } from '../types/contract.dto';

interface UseContractCheckoutModalProps {
  contract: ContractDetailDto;
  onSuccess: () => void;
}

export const useContractCheckoutModal = ({ contract, onSuccess }: UseContractCheckoutModalProps) => {
  const { t } = useTranslation('contracts');
  const [isOpen, setIsOpen] = useState(false);
  const [settlementPeriod, setSettlementPeriod] = useState<string | null>(null);

  const checkoutMutation = useContractCheckoutMutation();

  const getToday = () => new Date().toISOString().slice(0, 10);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      completedOn: getToday(),
    },
    mode: 'onTouched',
  });

  const handleOpen = () => {
    setSettlementPeriod(null);
    form.reset({ completedOn: getToday() });
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSettlementPeriod(null);
    form.reset();
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    setSettlementPeriod(null);
    const today = getToday();

    if (values.completedOn < contract.startDate) {
      form.setError('completedOn', {
        type: 'manual',
        message: t('errors.checkoutBeforeStart'),
      });
      return;
    }

    if (values.completedOn > today) {
      form.setError('completedOn', {
        type: 'manual',
        message: t('errors.checkoutFutureDate'),
      });
      return;
    }

    try {
      await checkoutMutation.mutateAsync({
        contractId: contract.id,
        payload: {
          completedOn: values.completedOn,
        },
      });
      onSuccess();
      handleClose();
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        const targetPeriod = values.completedOn.slice(0, 7);
        setSettlementPeriod(targetPeriod);
      }
    }
  });

  return {
    isOpen,
    handleOpen,
    handleClose,
    form,
    handleSubmit,
    isSubmitting: checkoutMutation.isPending,
    settlementPeriod,
  };
};
