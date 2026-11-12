import { keepPreviousData, useQuery } from '@tanstack/react-query';
import type { QueryHookOptions } from '@/lib/query/types';
import type { Paginated } from '@/types/api';
import { invoicesApi } from '../api/invoices.api';
import { INVOICES_QUERY_KEYS } from '../constants/invoices.constants';
import type { TenantInvoiceListItemDto, TenantInvoiceListParams } from '../types/invoices.dto';

export const useMyInvoicesQuery = (
  params?: TenantInvoiceListParams,
  options?: QueryHookOptions<Paginated<TenantInvoiceListItemDto>>,
) =>
  useQuery({
    queryKey: INVOICES_QUERY_KEYS.MY_LIST(params),
    queryFn: () => invoicesApi.getMyInvoices(params),
    placeholderData: keepPreviousData,
    ...options,
  });
