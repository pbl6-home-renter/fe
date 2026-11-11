import { useTranslation } from 'react-i18next';
import { AlertBanner } from '@/components/feedback/alert-banner';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { getApiErrorMessage } from '@/lib/api/api-messages';
import type { InvoiceIssueResponseDto } from '../types/invoices.dto';

export interface InvoiceIssueDialogProps {
  open: boolean;
  selectedCount: number;
  isIssuing: boolean;
  result: InvoiceIssueResponseDto | null;
  codeById?: Record<string, string>;
  onConfirm: () => void;
  onClose: () => void;
}

export const InvoiceIssueDialog = ({
  open,
  selectedCount,
  isIssuing,
  result,
  codeById = {},
  onConfirm,
  onClose,
}: InvoiceIssueDialogProps) => {
  const { t } = useTranslation('invoices');
  const hasPartialFailure = Boolean(result && result.failed.length > 0);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={hasPartialFailure ? t('issueDialog.partialTitle') : t('issueDialog.title', { count: selectedCount })}
      description={hasPartialFailure ? undefined : t('issueDialog.description', { count: selectedCount })}
      maxWidth="md"
      footer={
        hasPartialFailure ? (
          <div className="flex w-full justify-end">
            <Button type="button" variant="primary" onClick={onClose}>
              {t('actions.close')}
            </Button>
          </div>
        ) : (
          <div className="flex w-full items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isIssuing}>
              {t('actions.cancel')}
            </Button>
            <Button type="button" variant="primary" onClick={onConfirm} isLoading={isIssuing} disabled={isIssuing}>
              {t('issueDialog.confirmButton', { count: selectedCount })}
            </Button>
          </div>
        )
      }
    >
      <div className="space-y-4 py-2">
        {!hasPartialFailure ? (
          <AlertBanner variant="warning" title={t('issueDialog.warningTitle')}>
            <span className="text-sm">{t('issueDialog.warningDescription')}</span>
          </AlertBanner>
        ) : (
          result && (
            <div className="space-y-3">
              {result.succeeded.length > 0 && (
                <AlertBanner variant="success">
                  <span className="text-sm">
                    {t('issueDialog.succeededSummary', { count: result.succeeded.length })}
                  </span>
                </AlertBanner>
              )}

              <AlertBanner variant="error" title={t('issueDialog.failedSummary', { count: result.failed.length })}>
                <ul className="mt-1 space-y-1 text-xs">
                  {result.failed.map((item) => (
                    <li key={item.invoiceId}>
                      <span className="font-mono font-semibold">{codeById[item.invoiceId] ?? item.invoiceId}</span>:{' '}
                      <span>{getApiErrorMessage(item.code)}</span>
                    </li>
                  ))}
                </ul>
              </AlertBanner>
            </div>
          )
        )}
      </div>
    </Dialog>
  );
};
