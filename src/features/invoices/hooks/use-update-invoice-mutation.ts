import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { invoicesApi } from '../api/invoices.api';
import { INVOICES_QUERY_KEYS } from '../constants/invoices.constants';
import type { InvoiceUpdateRequestDto, InvoiceUpdateResponseDto } from '../types/invoices.dto';

export interface UpdateInvoiceVariables {
  invoiceId: string;
  payload: InvoiceUpdateRequestDto;
}

export const useUpdateInvoiceMutation = (
  options?: MutationHookOptions<InvoiceUpdateResponseDto, UpdateInvoiceVariables>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ invoiceId, payload }: UpdateInvoiceVariables) => invoicesApi.updateInvoice(invoiceId, payload),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEYS.ALL });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
