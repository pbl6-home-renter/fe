import { useTranslation } from 'react-i18next';
import { Calendar, DoorOpen, User } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { formatMonth, formatVnd } from '@/lib/utils/format';
import { InvoiceStatus } from '../enums/invoice-status.enum';
import type { InvoiceListItemDto } from '../types/invoices.dto';
import { InvoiceStatusBadge } from './invoice-status-badge';

export interface InvoiceListMobileRowProps {
  invoice: InvoiceListItemDto;
  isSelected: boolean;
  onToggleSelected: (checked: boolean) => void;
}

export const InvoiceListMobileRow = ({ invoice, isSelected, onToggleSelected }: InvoiceListMobileRowProps) => {
  const { t } = useTranslation('invoices');
  const isPending = invoice.invoiceStatus === InvoiceStatus.PENDING;

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          {isPending && (
            <div onClick={(event) => event.stopPropagation()}>
              <Checkbox
                aria-label={t('columns.selectRow', { code: invoice.code })}
                checked={isSelected}
                onChange={(event) => onToggleSelected(event.target.checked)}
              />
            </div>
          )}
          <span className="truncate font-mono text-sm font-bold text-rentify-text-primary">{invoice.code}</span>
        </div>
        <InvoiceStatusBadge status={invoice.invoiceStatus} className="shrink-0" />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-rentify-text-secondary">
        <div className="flex items-center gap-1.5 truncate">
          <DoorOpen className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate font-medium text-rentify-text-primary">{invoice.roomName}</span>
        </div>
        <div className="flex items-center justify-end gap-1.5 tabular-nums">
          <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span>{formatMonth(invoice.period)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-rentify-divider pt-2">
        <div className="flex min-w-0 items-center gap-1.5 text-xs text-rentify-text-secondary">
          <User className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{invoice.tenantName || '—'}</span>
        </div>
        <span className="shrink-0 text-sm font-bold tabular-nums text-rentify-primary">
          {formatVnd(invoice.totalAmount)}
        </span>
      </div>
    </div>
  );
};
