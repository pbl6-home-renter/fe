import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { invoiceCancelSchema, type InvoiceCancelFormData } from '../forms/invoice-cancel.schema';
import { useCancelInvoiceMutation } from './use-cancel-invoice-mutation';

export interface UseInvoiceCancelFormOptions {
  invoiceId: string;
  isOpen: boolean;
  onSuccess?: () => void;
}

export const useInvoiceCancelForm = ({ invoiceId, isOpen, onSuccess }: UseInvoiceCancelFormOptions) => {
  const cancelMutation = useCancelInvoiceMutation();
  const prevOpenRef = useRef(false);

  const form = useForm<InvoiceCancelFormData>({
    resolver: zodResolver(invoiceCancelSchema),
    defaultValues: { reason: '' },
    mode: 'onTouched',
  });

  useEffect(() => {
    const wasJustOpened = isOpen && !prevOpenRef.current;
    prevOpenRef.current = isOpen;
    if (wasJustOpened) {
      form.reset({ reason: '' });
    }
  }, [isOpen, form]);

  const onSubmit = form.handleSubmit((values) => {
    cancelMutation.mutate(
      {
        invoiceId,
        payload: { reason: values.reason.trim() },
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  });

  return {
    form,
    isSubmitting: cancelMutation.isPending,
    onSubmit,
  };
};
