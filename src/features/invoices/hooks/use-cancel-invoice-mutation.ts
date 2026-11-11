import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { invoicesApi } from '../api/invoices.api';
import { INVOICES_QUERY_KEYS } from '../constants/invoices.constants';
import type { InvoiceCancelRequestDto, InvoiceCancelResponseDto } from '../types/invoices.dto';

export interface CancelInvoiceVariables {
  invoiceId: string;
  payload: InvoiceCancelRequestDto;
}

export const useCancelInvoiceMutation = (
  options?: MutationHookOptions<InvoiceCancelResponseDto, CancelInvoiceVariables>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ invoiceId, payload }: CancelInvoiceVariables) => invoicesApi.cancelInvoice(invoiceId, payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEYS.ALL });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
