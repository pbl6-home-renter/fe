import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MutationHookOptions } from '@/lib/query/types';
import { invoicesApi } from '../api/invoices.api';
import { INVOICES_QUERY_KEYS } from '../constants/invoices.constants';
import type { InvoiceIssueRequestDto, InvoiceIssueResponseDto } from '../types/invoices.dto';

export interface IssueInvoicesVariables {
  payload: InvoiceIssueRequestDto;
  idempotencyKey: string;
}

export const useIssueInvoicesMutation = (
  options?: MutationHookOptions<InvoiceIssueResponseDto, IssueInvoicesVariables>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ payload, idempotencyKey }: IssueInvoicesVariables) =>
      invoicesApi.issueInvoices(payload, idempotencyKey),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: INVOICES_QUERY_KEYS.ALL });
      return options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
};
