import { useTranslation } from 'react-i18next';
import { Calendar, DoorOpen } from 'lucide-react';
import { formatMonth, formatVnd } from '@/lib/utils/format';
import { InvoiceStatusBadge } from '../invoice-status-badge';
import type { TenantInvoiceListItemDto } from '../../types/invoices.dto';

export interface TenantInvoiceListMobileRowProps {
  invoice: TenantInvoiceListItemDto;
}

export const TenantInvoiceListMobileRow = ({ invoice }: TenantInvoiceListMobileRowProps) => {
  const { t } = useTranslation('invoices');

  return (
    <div className="space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-mono text-sm font-bold text-rentify-text-primary">{invoice.code}</p>
          <div className="mt-1 flex items-center gap-1 text-xs text-rentify-text-secondary">
            <DoorOpen className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate">{invoice.roomName}</span>
          </div>
        </div>
        <InvoiceStatusBadge status={invoice.invoiceStatus} />
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-rentify-divider pt-2 text-xs">
        <span className="inline-flex items-center gap-1 text-rentify-text-secondary">
          <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{formatMonth(invoice.period)}</span>
        </span>
        <span className="text-sm font-bold tabular-nums text-rentify-text-primary">
          {formatVnd(invoice.totalAmount)}
        </span>
      </div>

      <p className="text-xs font-medium text-rentify-primary">{t('actions.viewDetail')}</p>
    </div>
  );
};
