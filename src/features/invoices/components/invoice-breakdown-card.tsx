import { useTranslation } from 'react-i18next';
import { ReceiptText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate, formatVnd } from '@/lib/utils/format';
import type { InvoiceDetailDto } from '../types/invoices.dto';

export interface InvoiceBreakdownCardProps {
  invoice: InvoiceDetailDto;
}

export const InvoiceBreakdownCard = ({ invoice }: InvoiceBreakdownCardProps) => {
  const { t } = useTranslation('invoices');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-rentify-text-primary">
          <ReceiptText className="h-5 w-5 text-rentify-primary" aria-hidden="true" />
          <span>{t('detail.breakdownTitle')}</span>
        </CardTitle>
        <CardDescription>{t('detail.breakdownRoundingHint')}</CardDescription>
      </CardHeader>

      <CardContent className="pt-2">
        <Table className="min-w-130">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>{t('detail.breakdownCols.item')}</TableHead>
              <TableHead>{t('detail.breakdownCols.quantity')}</TableHead>
              <TableHead className="text-right">{t('detail.breakdownCols.unitPrice')}</TableHead>
              <TableHead className="text-right">{t('detail.breakdownCols.prorate')}</TableHead>
              <TableHead className="text-right">{t('detail.breakdownCols.amount')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium text-rentify-text-primary">{t('detail.rentLabel')}</TableCell>
              <TableCell className="text-rentify-text-secondary">1</TableCell>
              <TableCell className="text-right tabular-nums text-rentify-text-secondary">
                {formatVnd(invoice.rentAmount)}
              </TableCell>
              <TableCell className="text-right tabular-nums text-rentify-text-secondary">1</TableCell>
              <TableCell className="text-right font-semibold tabular-nums text-rentify-text-primary">
                {formatVnd(invoice.rentAmount)}
              </TableCell>
            </TableRow>

            {invoice.breakdown.map((line, index) => (
              <TableRow key={`${line.type}-${line.name}-${index}`}>
                <TableCell>
                  <p className="font-medium text-rentify-text-primary">{line.name}</p>
                  <p className="text-xs text-rentify-text-secondary">
                    {t(`rateKinds.${line.rateKind}` as 'rateKinds.flat')} · {formatDate(line.serviceStart)} –{' '}
                    {formatDate(line.serviceEnd)}
                  </p>
                  {line.tierDetail && line.tierDetail.length > 0 && (
                    <ul className="mt-1 space-y-0.5 text-xs text-rentify-text-secondary">
                      {line.tierDetail.map((step) => (
                        <li key={step.step} className="tabular-nums">
                          {t('detail.tierStep', {
                            step: step.step,
                            from: step.from,
                            to: step.to ?? '∞',
                            qty: step.quantity,
                            price: formatVnd(step.price),
                            amount: formatVnd(step.amount),
                          })}
                        </li>
                      ))}
                    </ul>
                  )}
                </TableCell>
                <TableCell className="tabular-nums text-rentify-text-primary">
                  {line.quantity} {t(`billingUnits.${line.unit}` as 'billingUnits.kwh')}
                </TableCell>
                <TableCell className="text-right tabular-nums text-rentify-text-secondary">
                  {line.unitPrice !== null ? formatVnd(line.unitPrice) : t('detail.tieredLabel')}
                </TableCell>
                <TableCell className="text-right tabular-nums text-rentify-text-secondary">
                  {line.prorateRatio}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-rentify-text-primary">
                  {formatVnd(line.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
