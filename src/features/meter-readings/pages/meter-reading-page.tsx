import { useTranslation } from 'react-i18next';
import { Gauge, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/feedback/empty-state';
import { PageHeader } from '@/components/ui/page-header';
import { useMeterReadingPage } from '../hooks/use-meter-reading-page';
import { MeterReadingFilterBar } from '../components/meter-reading-filter-bar';
import { MeterReadingTable } from '../components/meter-reading-table';
import { SingleMeterReadingModal } from '../components/single-meter-reading-modal';
import { MeterReadingImagePreviewDialog } from '../components/meter-reading-image-preview-dialog';

export const MeterReadingPage = () => {
  const { t } = useTranslation('meterReadings');

  const {
    buildings,
    selectedBuildingId,
    selectedPeriod,
    rows,
    isLoading,
    isSaving,
    handleBuildingChange,
    handlePeriodChange,
    handleReadingChange,
    handleCellOcrSuccess,
    handleSaveBulk,
    singleModal,
    previewImageUrl,
    isPreviewOpen,
    handleOpenPreview,
    handleClosePreview,
    handleOpenSingleModal,
  } = useMeterReadingPage();

  if (!isLoading && buildings.length === 0) {
    return (
      <EmptyState icon={Gauge} title={t('warnings.noBuildingsTitle')} description={t('warnings.noBuildingsDesc')} />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title={
          <span className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rentify-primary-container text-rentify-primary">
              <Gauge className="w-5 h-5" />
            </span>
            {t('page.title')}
          </span>
        }
        description={t('page.subtitle')}
        actions={
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => handlePeriodChange(selectedPeriod)}
            disabled={isLoading}
            className="gap-1.5 border-rentify-divider"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{t('actions.refresh')}</span>
          </Button>
        }
      />

      {/* Filter Bar */}
      <MeterReadingFilterBar
        buildings={buildings}
        selectedBuildingId={selectedBuildingId}
        selectedPeriod={selectedPeriod}
        onBuildingChange={handleBuildingChange}
        onPeriodChange={handlePeriodChange}
        onSaveBulk={handleSaveBulk}
        isSaving={isSaving}
      />

      {/* Body Table */}
      <MeterReadingTable
        rows={rows}
        selectedPeriod={selectedPeriod}
        isLoading={isLoading}
        onReadingChange={handleReadingChange}
        onCellOcrSuccess={handleCellOcrSuccess}
        onOpenSingleModal={handleOpenSingleModal}
        onViewImage={handleOpenPreview}
      />

      {/* Single Room Reading Modal */}
      <SingleMeterReadingModal
        open={singleModal.isOpen}
        onClose={singleModal.closeModal}
        target={singleModal.target}
        currentReading={singleModal.currentReading}
        onCurrentReadingChange={singleModal.setCurrentReading}
        isBaseline={singleModal.isBaseline}
        onIsBaselineChange={singleModal.setIsBaseline}
        evidenceMediaId={singleModal.evidenceMediaId}
        previewUrl={singleModal.previewUrl}
        onOcrSuccess={(data) => {
          if (data.currentReading) singleModal.setCurrentReading(data.currentReading);
          if (data.evidenceMediaId) singleModal.setEvidenceMediaId(data.evidenceMediaId);
          if (data.previewUrl) singleModal.setPreviewUrl(data.previewUrl);
        }}
        onSubmit={singleModal.handleSubmit}
        isSubmitting={singleModal.isSubmitting}
        formError={singleModal.formError}
        consumption={singleModal.consumption}
        onSwitchType={singleModal.handleSwitchType}
      />

      {/* Full Image Preview Dialog */}
      <MeterReadingImagePreviewDialog
        open={isPreviewOpen}
        onClose={handleClosePreview}
        imageUrl={previewImageUrl}
        title={t('modal.previewImageTitle')}
      />
    </div>
  );
};
