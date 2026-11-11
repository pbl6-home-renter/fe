import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { invoicesApi } from '../api/invoices.api';
import { INVOICES_QUERY_KEYS } from '../constants/invoices.constants';
import type { InvoiceGenerateRequestDto, InvoiceGenerateResponseDto } from '../types/invoices.dto';

export const useGenerateInvoicesMutation = (
  options?: MutationHookOptions<InvoiceGenerateResponseDto, InvoiceGenerateRequestDto>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: invoicesApi.generateInvoices,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEYS.ALL });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
