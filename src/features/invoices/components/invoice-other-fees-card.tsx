import { useTranslation } from 'react-i18next';
import { Pencil, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { formatVnd } from '@/lib/utils/format';
import { InvoiceStatus } from '../enums/invoice-status.enum';
import type { InvoiceDetailDto } from '../types/invoices.dto';

export interface InvoiceOtherFeesCardProps {
  invoice: InvoiceDetailDto;
  onEdit: () => void;
}

export const InvoiceOtherFeesCard = ({ invoice, onEdit }: InvoiceOtherFeesCardProps) => {
  const { t } = useTranslation('invoices');
  const isPending = invoice.invoiceStatus === InvoiceStatus.PENDING;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="text-base font-semibold text-rentify-text-primary">
          {t('detail.otherFeesTitle')}
        </CardTitle>
        {isPending && (
          <Button type="button" variant="outline" size="sm" onClick={onEdit} className="gap-1.5">
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t('actions.editOtherFees')}</span>
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {invoice.otherFees.length === 0 ? (
          <p className="text-sm text-rentify-text-secondary">{t('detail.noOtherFees')}</p>
        ) : (
          <div className="divide-y divide-rentify-divider rounded-xl border border-rentify-divider">
            {invoice.otherFees.map((fee, index) => {
              const isDiscount = Number(fee.amount) < 0;
              return (
                <div key={`${fee.name}-${index}`} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                  <span className="text-sm font-medium text-rentify-text-primary">{fee.name}</span>
                  <span
                    className={`text-sm font-semibold tabular-nums ${
                      isDiscount ? 'text-rentify-success' : 'text-rentify-text-primary'
                    }`}
                  >
                    {formatVnd(fee.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {invoice.note && (
          <div className="rounded-xl border border-rentify-divider bg-surface-container-low p-3.5">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-rentify-text-secondary">
              <StickyNote className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t('detail.noteLabel')}</span>
            </div>
            <p className="whitespace-pre-wrap text-sm text-rentify-text-primary">{invoice.note}</p>
          </div>
        )}

        <Divider className="my-2" />

        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-rentify-text-secondary">{t('detail.totalLabel')}</span>
          <span className="text-xl font-bold tabular-nums text-rentify-primary">{formatVnd(invoice.totalAmount)}</span>
        </div>
      </CardContent>
    </Card>
  );
};
