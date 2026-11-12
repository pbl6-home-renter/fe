import { http } from '@/lib/api/http';
import type { Paginated } from '@/types/api';
import type {
  InvoiceCancelRequestDto,
  InvoiceCancelResponseDto,
  InvoiceDetailDto,
  InvoiceGenerateRequestDto,
  InvoiceGenerateResponseDto,
  InvoiceIssueRequestDto,
  InvoiceIssueResponseDto,
  InvoiceListFilter,
  InvoiceListItemDto,
  InvoiceListParams,
  InvoiceUpdateRequestDto,
  InvoiceUpdateResponseDto,
  TenantInvoiceListFilter,
  TenantInvoiceListItemDto,
  TenantInvoiceListParams,
} from '../types/invoices.dto';

export const invoicesApi = {
  getInvoices: (params?: InvoiceListParams): Promise<Paginated<InvoiceListItemDto>> =>
    http.getPage<InvoiceListItemDto, InvoiceListFilter>('/invoices', params),

  getMyInvoices: (params?: TenantInvoiceListParams): Promise<Paginated<TenantInvoiceListItemDto>> =>
    http.getPage<TenantInvoiceListItemDto, TenantInvoiceListFilter>('/me/invoices', params),

  getInvoice: (invoiceId: string): Promise<InvoiceDetailDto> => http.get<InvoiceDetailDto>(`/invoices/${invoiceId}`),

  generateInvoices: (payload: InvoiceGenerateRequestDto): Promise<InvoiceGenerateResponseDto> =>
    http.post<InvoiceGenerateResponseDto>('/invoices/generate', payload),

  updateInvoice: (invoiceId: string, payload: InvoiceUpdateRequestDto): Promise<InvoiceUpdateResponseDto> =>
    http.patch<InvoiceUpdateResponseDto>(`/invoices/${invoiceId}`, payload),

  issueInvoices: (payload: InvoiceIssueRequestDto, idempotencyKey: string): Promise<InvoiceIssueResponseDto> =>
    http.post<InvoiceIssueResponseDto>('/invoices/issue-invoice', payload, {
      headers: { 'Idempotency-Key': idempotencyKey },
    }),

  cancelInvoice: (invoiceId: string, payload: InvoiceCancelRequestDto): Promise<InvoiceCancelResponseDto> =>
    http.post<InvoiceCancelResponseDto>(`/invoices/${invoiceId}/cancel-invoice`, payload),
};
