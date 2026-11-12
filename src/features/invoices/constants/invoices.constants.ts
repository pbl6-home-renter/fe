import type { ColumnPinningState } from '@tanstack/react-table';
import type {
  InvoiceListParams,
  InvoiceSortField,
  TenantInvoiceListParams,
  TenantInvoiceSortField,
} from '../types/invoices.dto';

export const INVOICES_QUERY_KEYS = {
  ALL: ['invoices'] as const,
  LIST: (params?: InvoiceListParams) => [...INVOICES_QUERY_KEYS.ALL, 'list', params] as const,
  MY_LIST: (params?: TenantInvoiceListParams) => [...INVOICES_QUERY_KEYS.ALL, 'my-list', params] as const,
  DETAIL: (id: string) => [...INVOICES_QUERY_KEYS.ALL, 'detail', id] as const,
};

export const ALLOWED_INVOICE_SORTS: InvoiceSortField[] = ['period', 'createdAt'];
export const DEFAULT_INVOICE_SORT = { id: 'period', desc: true };

export const INVOICE_COLUMN_IDS = [
  'select',
  'code',
  'roomName',
  'tenantName',
  'period',
  'invoiceStatus',
  'totalAmount',
  'actions',
];

export const REQUIRED_INVOICE_COLUMN_IDS = ['select', 'code', 'actions'];

export const DEFAULT_INVOICE_COLUMN_PINNING: ColumnPinningState = {
  left: ['select', 'code'],
  right: ['actions'],
};

export const DEFAULT_INVOICE_FILTERS = {
  buildingId: 'all',
  period: '',
  status: 'all',
};

export const INVOICE_MAX_ISSUE_BATCH = 100;
export const INVOICE_MAX_OTHER_FEES = 20;

export const ALLOWED_TENANT_INVOICE_SORTS: TenantInvoiceSortField[] = ['period'];

export const TENANT_INVOICE_COLUMN_IDS = ['code', 'roomName', 'period', 'invoiceStatus', 'totalAmount', 'actions'];

export const REQUIRED_TENANT_INVOICE_COLUMN_IDS = ['code', 'actions'];

export const DEFAULT_TENANT_INVOICE_COLUMN_PINNING: ColumnPinningState = {
  left: ['code'],
  right: ['actions'],
};

export const DEFAULT_TENANT_INVOICE_FILTERS = {
  period: '',
};
