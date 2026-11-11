import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, CheckCircle2, ExternalLink, RefreshCw, type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { ROUTES } from '@/config/routes.config';
import { formatMonth, formatVnd } from '@/lib/utils/format';
import { InvoiceBlockReason } from '../enums/invoice-status.enum';
import type { InvoiceGeneratedItemDto, InvoiceGenerateResponseDto } from '../types/invoices.dto';
import { getInvoiceBlockFixTarget } from '../utils/invoice-block-link';

export interface InvoiceGenerateResultDialogProps {
  result: InvoiceGenerateResponseDto | null;
  roomNameById?: Record<string, string>;
  onClose: () => void;
}

interface GeneratedGroupProps {
  title: string;
  items: InvoiceGeneratedItemDto[];
  roomNameById: Record<string, string>;
  icon: LucideIcon;
  toneClass: string;
  onOpenInvoice: (invoiceId: string) => void;
}

const KNOWN_REASON_CODES = new Set<string>(Object.values(InvoiceBlockReason));

const GeneratedGroup = ({ title, items, roomNameById, icon: Icon, toneClass, onOpenInvoice }: GeneratedGroupProps) => {
  const { t } = useTranslation('invoices');

  return (
    <section className="space-y-2">
      <h3 className={`flex items-center gap-2 text-sm font-semibold ${toneClass}`}>
        <Icon className="h-4 w-4" aria-hidden="true" />
        <span>{title}</span>
      </h3>
      {items.length === 0 ? (
        <p className="text-xs text-rentify-text-secondary">{t('generate.emptyGroup')}</p>
      ) : (
        <Card variant="flat" className="overflow-hidden rounded-xl p-0 sm:p-0">
          <Table>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.invoiceId}>
                  <TableCell className="py-2.5 pl-3.5">
                    <p className="font-mono text-sm font-semibold text-rentify-text-primary">{item.code}</p>
                    {roomNameById[item.roomId] && (
                      <p className="text-xs text-rentify-text-secondary">
                        {t('generate.roomLabel', { name: roomNameById[item.roomId] })}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="py-2.5 pr-3.5 text-right">
                    <span className="mr-2 text-sm font-semibold tabular-nums text-rentify-text-primary">
                      {formatVnd(item.totalAmount)}
                    </span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => onOpenInvoice(item.invoiceId)}>
                      {t('actions.viewDetail')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </section>
  );
};

export const InvoiceGenerateResultDialog = ({
  result,
  roomNameById = {},
  onClose,
}: InvoiceGenerateResultDialogProps) => {
  const { t } = useTranslation('invoices');
  const navigate = useNavigate();

  if (!result) return null;

  const navigateAndClose = (to: string) => {
    onClose();
    navigate(to);
  };

  return (
    <Dialog
      open={Boolean(result)}
      onClose={onClose}
      title={t('generate.resultTitle', { period: formatMonth(result.period) })}
      description={t('generate.resultSubtitle')}
      maxWidth="lg"
      className="max-h-[85vh] overflow-y-auto"
      footer={
        <div className="flex w-full justify-end">
          <Button type="button" variant="primary" onClick={onClose}>
            {t('actions.close')}
          </Button>
        </div>
      }
    >
      <div className="space-y-5 py-2">
        <GeneratedGroup
          title={t('generate.groups.generated', { count: result.generated.length })}
          items={result.generated}
          roomNameById={roomNameById}
          icon={CheckCircle2}
          toneClass="text-rentify-success"
          onOpenInvoice={(id) => navigateAndClose(ROUTES.LANDLORD.INVOICE_DETAIL(id))}
        />

        <GeneratedGroup
          title={t('generate.groups.recalculated', { count: result.recalculated.length })}
          items={result.recalculated}
          roomNameById={roomNameById}
          icon={RefreshCw}
          toneClass="text-rentify-primary"
          onOpenInvoice={(id) => navigateAndClose(ROUTES.LANDLORD.INVOICE_DETAIL(id))}
        />

        <section className="space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-rentify-warning">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            <span>{t('generate.groups.blocked', { count: result.blocked.length })}</span>
          </h3>
          {result.blocked.length === 0 ? (
            <p className="text-xs text-rentify-text-secondary">{t('generate.noBlocked')}</p>
          ) : (
            <Card variant="flat" className="overflow-hidden rounded-xl p-0 sm:p-0">
              <Table>
                <TableBody>
                  {result.blocked.map((item, idx) => {
                    const reasonLabel = KNOWN_REASON_CODES.has(item.reasonCode)
                      ? t(`generate.reasons.${item.reasonCode}` as 'generate.reasons.READING_MISSING')
                      : t('generate.reasons.UNKNOWN', { code: item.reasonCode });
                    const fixTarget = getInvoiceBlockFixTarget(item, {
                      buildingId: result.buildingId,
                      period: result.period,
                    });
                    const roomLabel = roomNameById[item.roomId]
                      ? t('generate.roomLabel', { name: roomNameById[item.roomId] })
                      : t('generate.unknownRoom');

                    return (
                      <TableRow key={`${item.contractId}-${item.reasonCode}-${idx}`}>
                        <TableCell className="py-3 pl-3.5">
                          <p className="text-sm font-semibold text-rentify-text-primary">{roomLabel}</p>
                          <p className="text-xs text-rentify-text-secondary">{reasonLabel}</p>
                        </TableCell>
                        <TableCell className="py-3 pr-3.5 text-right">
                          {fixTarget && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="shrink-0 gap-1.5"
                              onClick={() => navigateAndClose(fixTarget.to)}
                            >
                              <span>{t(fixTarget.actionKey as 'generate.blockActions.enterReadings')}</span>
                              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          )}
        </section>
      </div>
    </Dialog>
  );
};
