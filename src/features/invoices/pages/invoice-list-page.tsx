import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FilePlus2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InvoiceGenerateDialog } from '../components/invoice-generate-dialog';
import { InvoiceGenerateResultDialog } from '../components/invoice-generate-result-dialog';
import { InvoiceIssueDialog } from '../components/invoice-issue-dialog';
import { InvoiceListTable } from '../components/invoice-list-table';
import { useInvoiceList } from '../hooks/use-invoice-list';

export const InvoiceListPage = () => {
  const { t } = useTranslation('invoices');
  const {
    tableState,
    invoices,
    totalItems,
    isLoading,
    isFetching,
    isError,
    refetch,
    buildings,
    roomNameById,
    selectedBuildingId,
    selectedPeriod,
    selectedStatus,
    isFiltered,
    generateDialogOpen,
    isGenerating,
    generateResult,
    selectedInvoiceIds,
    issueDialogOpen,
    issueResult,
    isIssuing,
    handleBuildingChange,
    handlePeriodChange,
    handleStatusChange,
    handleClearFilters,
    handleGenerate,
    runGenerate,
    handleCloseGenerateDialog,
    handleCloseGenerateResult,
    handleOpenIssueDialog,
    handleConfirmIssue,
    handleCloseIssueDialog,
  } = useInvoiceList();

  const codeById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const invoice of invoices) {
      map[invoice.id] = invoice.code;
    }
    return map;
  }, [invoices]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-rentify-text-primary sm:text-2xl">{t('list.title')}</h1>
          <p className="text-sm text-rentify-text-secondary">{t('list.subtitle')}</p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={handleGenerate}
          disabled={buildings.length === 0 || isGenerating}
          isLoading={isGenerating}
          className="gap-2 self-start sm:self-auto"
        >
          <FilePlus2 className="h-4 w-4" aria-hidden="true" />
          <span>{t('actions.generate')}</span>
        </Button>
      </div>

      <InvoiceListTable
        invoices={invoices}
        rowCount={totalItems}
        buildings={buildings}
        state={tableState.state}
        handlers={tableState.handlers}
        density={tableState.state.density}
        onDensityChange={tableState.setDensity}
        selectedBuildingId={selectedBuildingId}
        onBuildingChange={handleBuildingChange}
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
        selectedStatus={selectedStatus}
        onStatusChange={handleStatusChange}
        selectedInvoiceCount={selectedInvoiceIds.length}
        onOpenIssueDialog={handleOpenIssueDialog}
        isFiltered={isFiltered}
        onClearFilters={handleClearFilters}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        onRetry={() => void refetch()}
      />

      <InvoiceGenerateDialog
        open={generateDialogOpen}
        buildings={buildings}
        defaultBuildingId={selectedBuildingId}
        defaultPeriod={selectedPeriod}
        isGenerating={isGenerating}
        onGenerate={runGenerate}
        onClose={handleCloseGenerateDialog}
      />

      <InvoiceGenerateResultDialog
        result={generateResult}
        roomNameById={roomNameById}
        onClose={handleCloseGenerateResult}
      />

      <InvoiceIssueDialog
        open={issueDialogOpen}
        selectedCount={selectedInvoiceIds.length}
        isIssuing={isIssuing}
        result={issueResult}
        codeById={codeById}
        onConfirm={handleConfirmIssue}
        onClose={handleCloseIssueDialog}
      />
    </div>
  );
};
