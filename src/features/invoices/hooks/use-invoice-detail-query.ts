import { useQuery } from '@tanstack/react-query';
import type { QueryHookOptions } from '@/lib/query/types';
import { invoicesApi } from '../api/invoices.api';
import { INVOICES_QUERY_KEYS } from '../constants/invoices.constants';
import type { InvoiceDetailDto } from '../types/invoices.dto';

export const useInvoiceDetailQuery = (invoiceId: string, options?: QueryHookOptions<InvoiceDetailDto>) =>
  useQuery({
    queryKey: INVOICES_QUERY_KEYS.DETAIL(invoiceId),
    queryFn: () => invoicesApi.getInvoice(invoiceId),
    enabled: Boolean(invoiceId) && (options?.enabled ?? true),
    ...options,
  });
