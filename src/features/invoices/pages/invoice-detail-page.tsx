import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { AlertBanner } from '@/components/feedback/alert-banner';
import { ErrorState } from '@/components/feedback/error-state';
import { Skeleton } from '@/components/feedback/skeleton';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes.config';
import { InvoiceBreakdownCard } from '../components/invoice-breakdown-card';
import { InvoiceCancelDialog } from '../components/invoice-cancel-dialog';
import { InvoiceDetailHeader } from '../components/invoice-detail-header';
import { InvoiceGenerateResultDialog } from '../components/invoice-generate-result-dialog';
import { InvoiceIssueDialog } from '../components/invoice-issue-dialog';
import { InvoiceOtherFeesCard } from '../components/invoice-other-fees-card';
import { InvoiceOtherFeesDialog } from '../components/invoice-other-fees-dialog';
import { InvoiceStatus } from '../enums/invoice-status.enum';
import { useInvoiceDetail } from '../hooks/use-invoice-detail';

export const InvoiceDetailPage = () => {
  const { t } = useTranslation('invoices');
  const navigate = useNavigate();
  const {
    invoice,
    buildingId,
    isLoading,
    isError,
    refetch,
    isLoadingRoom,
    otherFeesDialog,
    cancelDialog,
    issueDialogOpen,
    issueResult,
    isIssuing,
    isRegenerating,
    regenerateResult,
    handleOpenIssueDialog,
    handleConfirmIssue,
    handleCloseIssueDialog,
    handleRegenerate,
    handleCloseRegenerateResult,
  } = useInvoiceDetail();

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

  if (isError || !invoice) {
    return (
      <div className="py-12">
        <ErrorState
          title={t('detail.notFoundTitle')}
          message={t('detail.notFoundDesc')}
          retryText={t('actions.retry')}
          onRetry={() => void refetch()}
        >
          <Button variant="outline" className="mt-4 gap-2" onClick={() => navigate(ROUTES.LANDLORD.INVOICES)}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            <span>{t('detail.backToList')}</span>
          </Button>
        </ErrorState>
      </div>
    );
  }

  const isVoid = invoice.invoiceStatus === InvoiceStatus.VOID;

  return (
    <div className="space-y-6">
      <InvoiceDetailHeader invoice={invoice} onIssue={handleOpenIssueDialog} onCancel={cancelDialog.open} />

      {isVoid && (
        <AlertBanner
          variant="warning"
          title={t('detail.voidBannerTitle')}
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={!buildingId || isLoadingRoom || isRegenerating}
              isLoading={isRegenerating}
              className="gap-1.5"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t('actions.regeneratePeriod')}</span>
            </Button>
          }
        >
          <span className="text-sm">{invoice.voidReason || t('detail.noVoidReason')}</span>
        </AlertBanner>
      )}

      {invoice.voidedInvoiceId && (
        <AlertBanner variant="info" title={t('detail.replacementTitle')}>
          <span className="text-sm">
            {t('detail.replacementDesc')}{' '}
            <Link
              to={ROUTES.LANDLORD.INVOICE_DETAIL(invoice.voidedInvoiceId)}
              className="font-semibold text-rentify-primary underline"
            >
              {t('detail.viewVoidedInvoice')}
            </Link>
          </span>
        </AlertBanner>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <InvoiceBreakdownCard invoice={invoice} />
        </div>
        <div className="lg:col-span-1">
          <InvoiceOtherFeesCard invoice={invoice} onEdit={otherFeesDialog.open} />
        </div>
      </div>

      <InvoiceOtherFeesDialog
        open={otherFeesDialog.isOpen}
        invoiceId={invoice.id}
        initialFees={invoice.otherFees}
        initialNote={invoice.note}
        onClose={otherFeesDialog.close}
      />

      <InvoiceCancelDialog
        open={cancelDialog.isOpen}
        invoiceId={invoice.id}
        invoiceCode={invoice.code}
        onClose={cancelDialog.close}
      />

      <InvoiceIssueDialog
        open={issueDialogOpen}
        selectedCount={1}
        isIssuing={isIssuing}
        result={issueResult}
        codeById={{ [invoice.id]: invoice.code }}
        onConfirm={handleConfirmIssue}
        onClose={handleCloseIssueDialog}
      />

      <InvoiceGenerateResultDialog
        result={regenerateResult}
        roomNameById={{ [invoice.roomId]: invoice.roomName }}
        onClose={handleCloseRegenerateResult}
      />
    </div>
  );
};
