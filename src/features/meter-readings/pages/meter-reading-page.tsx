import { useTranslation } from 'react-i18next';
import { Gauge, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import { EmptyState } from '@/components/feedback/empty-state';
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
      <div className="p-6">
        <EmptyState icon={Gauge} title={t('warnings.noBuildingsTitle')} description={t('warnings.noBuildingsDesc')} />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rentify-primary-container text-rentify-primary flex items-center justify-center shrink-0">
              <Gauge className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-rentify-text-primary">
              {t('page.title')}
            </h1>
          </div>
          <p className="text-xs text-rentify-text-secondary pl-11">{t('page.subtitle')}</p>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handlePeriodChange(selectedPeriod)}
          disabled={isLoading}
          className="self-start sm:self-auto gap-1.5 text-xs border-rentify-divider"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{t('actions.refresh')}</span>
        </Button>
      </div>

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
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <MeterReadingTable
          rows={rows}
          selectedPeriod={selectedPeriod}
          onReadingChange={handleReadingChange}
          onCellOcrSuccess={handleCellOcrSuccess}
          onOpenSingleModal={handleOpenSingleModal}
          onViewImage={handleOpenPreview}
        />
      )}

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
