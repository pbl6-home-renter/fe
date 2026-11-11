import { useTranslation } from 'react-i18next';
import { Ban, Calendar, DoorOpen, Send, User } from 'lucide-react';
import { BackLink } from '@/components/ui/back-link';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes.config';
import { formatDateTime, formatMonth } from '@/lib/utils/format';
import { InvoiceStatus } from '../enums/invoice-status.enum';
import type { InvoiceDetailDto } from '../types/invoices.dto';
import { InvoiceStatusBadge } from './invoice-status-badge';

export interface InvoiceDetailHeaderProps {
  invoice: InvoiceDetailDto;
  onIssue: () => void;
  onCancel: () => void;
}

export const InvoiceDetailHeader = ({ invoice, onIssue, onCancel }: InvoiceDetailHeaderProps) => {
  const { t } = useTranslation('invoices');

  const isPending = invoice.invoiceStatus === InvoiceStatus.PENDING;
  const isIssued = invoice.invoiceStatus === InvoiceStatus.ISSUED;

  return (
    <div className="space-y-2">
      <BackLink to={ROUTES.LANDLORD.INVOICES}>{t('detail.backToList')}</BackLink>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-mono text-xl font-bold tracking-tight text-rentify-text-primary sm:text-2xl">
              {invoice.code}
            </h1>
            <InvoiceStatusBadge status={invoice.invoiceStatus} />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-rentify-text-secondary">
            <span className="inline-flex items-center gap-1">
              <DoorOpen className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{invoice.roomName}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t('detail.periodValue', { period: formatMonth(invoice.period) })}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <User className="h-3.5 w-3.5" aria-hidden="true" />
              <span>
                {invoice.tenantName || '—'}
                {invoice.tenantPhone ? ` (${invoice.tenantPhone})` : ''}
              </span>
            </span>
            {invoice.issuedAt && <span>{t('detail.issuedAtValue', { date: formatDateTime(invoice.issuedAt) })}</span>}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isPending && (
            <Button type="button" variant="primary" onClick={onIssue} className="gap-2">
              <Send className="h-4 w-4" aria-hidden="true" />
              <span>{t('actions.issueOne')}</span>
            </Button>
          )}
          {isIssued && (
            <Button type="button" variant="danger" onClick={onCancel} className="gap-2">
              <Ban className="h-4 w-4" aria-hidden="true" />
              <span>{t('actions.cancelInvoice')}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
