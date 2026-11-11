import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { QueryHookOptions } from '@/lib/query/types';
import type { Paginated } from '@/types/api';
import { invoicesApi } from '../api/invoices.api';
import { INVOICES_QUERY_KEYS } from '../constants/invoices.constants';
import type { InvoiceListItemDto, InvoiceListParams } from '../types/invoices.dto';

export const useInvoicesQuery = (
  params?: InvoiceListParams,
  options?: QueryHookOptions<Paginated<InvoiceListItemDto>>,
) =>
  useQuery({
    queryKey: INVOICES_QUERY_KEYS.LIST(params),
    queryFn: () => invoicesApi.getInvoices(params),
    placeholderData: keepPreviousData,
    ...options,
  });
