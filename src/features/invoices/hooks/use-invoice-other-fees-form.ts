import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getApiErrorCode } from '@/lib/api/errors';
import { invoiceOtherFeesSchema, type InvoiceOtherFeesFormData } from '../forms/invoice-other-fees.schema';
import type { InvoiceOtherFeeDto } from '../types/invoices.dto';
import { useUpdateInvoiceMutation } from './use-update-invoice-mutation';

export interface UseInvoiceOtherFeesFormOptions {
  invoiceId: string;
  initialFees: InvoiceOtherFeeDto[];
  initialNote: string | null;
  isOpen: boolean;
  onSuccess?: () => void;
}

export const useInvoiceOtherFeesForm = ({
  invoiceId,
  initialFees,
  initialNote,
  isOpen,
  onSuccess,
}: UseInvoiceOtherFeesFormOptions) => {
  const updateMutation = useUpdateInvoiceMutation();
  const [hasTotalNegativeError, setHasTotalNegativeError] = useState(false);
  const prevOpenRef = useRef(false);

  const form = useForm<InvoiceOtherFeesFormData>({
    resolver: zodResolver(invoiceOtherFeesSchema),
    defaultValues: {
      otherFees: initialFees,
      note: initialNote ?? '',
    },
    mode: 'onTouched',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'otherFees',
  });

  useEffect(() => {
    const wasJustOpened = isOpen && !prevOpenRef.current;
    prevOpenRef.current = isOpen;

    if (wasJustOpened) {
      form.reset({
        otherFees: initialFees.map((fee) => ({ name: fee.name, amount: fee.amount })),
        note: initialNote ?? '',
      });
    }
  }, [isOpen, initialFees, initialNote, form]);

  const handleAddFee = () => {
    setHasTotalNegativeError(false);
    append({ name: '', amount: '' });
  };

  const handleRemoveFee = (index: number) => {
    setHasTotalNegativeError(false);
    remove(index);
  };

  const onSubmit = form.handleSubmit((values) => {
    setHasTotalNegativeError(false);
    const trimmedNote = values.note.trim();

    updateMutation.mutate(
      {
        invoiceId,
        payload: {
          otherFees: values.otherFees.map((fee) => ({
            name: fee.name.trim(),
            amount: fee.amount.trim(),
          })),
          note: trimmedNote || null,
        },
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
        onError: (error) => {
          if (getApiErrorCode(error) === 'TOTAL_NEGATIVE') {
            setHasTotalNegativeError(true);
          }
        },
      },
    );
  });

  return {
    form,
    fields,
    hasTotalNegativeError,
    isSubmitting: updateMutation.isPending,
    handleAddFee,
    handleRemoveFee,
    onSubmit,
  };
};
