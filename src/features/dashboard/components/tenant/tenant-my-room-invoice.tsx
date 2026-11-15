import { useTranslation } from 'react-i18next';
import { AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatVnd } from '@/lib/utils/format';
import type { TenantInvoiceListItemDto } from '@/features/invoices/types/invoices.dto';

export interface TenantMyRoomInvoiceProps {
  invoice?: TenantInvoiceListItemDto;
  fallbackRentPrice: number;
  onInvoiceAction: (e: React.MouseEvent) => void;
}

export const TenantMyRoomInvoice = ({ invoice, fallbackRentPrice, onInvoiceAction }: TenantMyRoomInvoiceProps) => {
  const { t } = useTranslation('dashboard');
  const currentMonth = new Date().getMonth() + 1;

  const invoiceAmount = invoice ? Number(invoice.totalAmount) : fallbackRentPrice;
  const isInvoiceIssued = Boolean(invoice);
  const today = new Date();
  const dueDay = 20;
  const daysDiff = dueDay - today.getDate();

  return (
    <div className="p-3.5 rounded-xl bg-rentify-background border border-rentify-divider flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="space-y-1">
        <span className="text-[11px] font-semibold text-rentify-text-secondary uppercase tracking-wider">
          {t('tenantHome.invoiceMonth', { month: currentMonth })}
        </span>
        {isInvoiceIssued ? (
          <>
            <div className="text-lg font-bold text-rentify-text-primary tabular-nums">{formatVnd(invoiceAmount)}</div>
            <div className="flex items-center gap-1.5 text-xs">
              {daysDiff < 0 ? (
                <span className="text-rentify-error font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>{t('tenantHome.scenario3Overdue', { days: Math.abs(daysDiff) })}</span>
                </span>
              ) : daysDiff <= 3 ? (
                <span className="text-rentify-warning font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {t('tenantHome.scenario2SoonDays', { days: daysDiff, date: `${dueDay}/${currentMonth}` })}
                  </span>
                </span>
              ) : (
                <span className="text-rentify-text-secondary">
                  {t('tenantHome.scenario1Due', { date: `${dueDay}/${currentMonth}` })}
                </span>
              )}
            </div>
          </>
        ) : (
          <p className="text-xs text-rentify-text-secondary leading-relaxed">{t('tenantHome.scenario6NotIssued')}</p>
        )}
      </div>

      {isInvoiceIssued && (
        <Button
          variant="primary"
          size="sm"
          onClick={onInvoiceAction}
          className="shrink-0 text-xs font-semibold px-4 rounded-xl shadow-xs"
        >
          {t('tenantHome.payButton')}
        </Button>
      )}
    </div>
  );
};
