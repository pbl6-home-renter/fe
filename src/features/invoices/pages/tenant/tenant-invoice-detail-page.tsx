import { useTranslation } from 'react-i18next';
import { Calendar, DoorOpen, StickyNote } from 'lucide-react';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/feedback/skeleton';
import { BackLink } from '@/components/ui/back-link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { ROUTES } from '@/config/routes.config';
import { formatDateTime, formatMonth, formatVnd } from '@/lib/utils/format';
import { InvoiceBreakdownCard } from '../../components/invoice-breakdown-card';
import { InvoiceOtherFeesCard } from '../../components/invoice-other-fees-card';
import { InvoiceStatusBadge } from '../../components/invoice-status-badge';
import { useTenantInvoiceDetail } from '../../hooks/use-tenant-invoice-detail';

export const TenantInvoiceDetailPage = () => {
  const { t } = useTranslation('invoices');
  const { invoice, isLoading, isUnavailable, refetch } = useTenantInvoiceDetail();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Skeleton className="h-96 w-full rounded-2xl lg:col-span-2" />
          <Skeleton className="h-72 w-full rounded-2xl lg:col-span-1" />
        </div>
      </div>
    );
  }

  if (isUnavailable || !invoice) {
    return (
      <div className="space-y-4 py-8">
        <BackLink to={ROUTES.TENANT.INVOICES}>{t('detail.backToList')}</BackLink>
        <ErrorState
          title={t('tenantDetail.unavailableTitle')}
          message={t('tenantDetail.unavailableDesc')}
          retryText={t('actions.retry')}
          onRetry={() => void refetch()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <BackLink to={ROUTES.TENANT.INVOICES}>{t('detail.backToList')}</BackLink>

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
            {invoice.issuedAt && <span>{t('detail.issuedAtValue', { date: formatDateTime(invoice.issuedAt) })}</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <InvoiceBreakdownCard invoice={invoice} />
          <InvoiceOtherFeesCard invoice={invoice} />
        </div>

        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-rentify-text-primary">
                {t('detail.totalLabel')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-rentify-text-secondary">{t('detail.rentLabel')}</span>
                <span className="font-medium tabular-nums text-rentify-text-primary">
                  {formatVnd(invoice.rentAmount)}
                </span>
              </div>

              <Divider />

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-rentify-text-primary">{t('detail.totalLabel')}</span>
                <span className="text-xl font-bold tabular-nums text-rentify-primary">
                  {formatVnd(invoice.totalAmount)}
                </span>
              </div>

              {invoice.note && (
                <div className="rounded-xl border border-rentify-divider bg-surface-container-low p-3 text-sm">
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-rentify-text-secondary">
                    <StickyNote className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{t('detail.noteLabel')}</span>
                  </div>
                  <p className="text-rentify-text-primary">{invoice.note}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
