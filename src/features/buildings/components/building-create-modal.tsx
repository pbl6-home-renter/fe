import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Building2, Check, FileCheck2, Send } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BuildingInfoForm } from './building-info-form';
import { OwnershipProofUploader } from './ownership-proof-uploader';
import { useBuildingForm } from '../forms/use-building-form';

export interface BuildingCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (buildingId: string) => void;
}

export const BuildingCreateModal = ({
  open,
  onClose,
  onSuccess,
}: BuildingCreateModalProps) => {
  const { t } = useTranslation('buildings');

  const {
    form,
    step,
    mediaIds,
    setMediaIds,
    goToNextStep,
    goToPrevStep,
    handleSubmit,
    reset,
    isSubmitting,
  } = useBuildingForm({
    onSuccess: (id) => {
      reset();
      onClose();
      onSuccess?.(id);
    },
  });

  const handleClose = () => {
    if (isSubmitting) return;
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="2xl"
      className="max-h-[90vh] overflow-y-auto"
    >
      <div className="space-y-5">
        <div>
          <h2 className="text-xl font-bold text-rentify-text-primary tracking-tight">
            {t('create.pageTitle')}
          </h2>
          <p className="text-xs text-rentify-text-secondary mt-0.5">
            {t('create.pageSubtitle')}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="w-full bg-surface-container-low rounded-xl p-3 border border-rentify-divider">
          <div className="grid grid-cols-2 gap-3">
            <div className={`flex items-center gap-2.5 ${step === 1 ? 'opacity-100' : 'opacity-80'}`}>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                  step === 1
                    ? 'bg-rentify-primary text-white shadow-xs'
                    : 'bg-green-50 text-rentify-success border border-green-200'
                }`}
              >
                {step > 1 ? <Check className="w-4 h-4" /> : '1'}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-rentify-primary uppercase tracking-wider">
                  {t('wizard.step1Badge')}
                </span>
                <span className="font-semibold text-xs text-rentify-text-primary truncate">
                  {t('wizard.step1Title')}
                </span>
              </div>
            </div>

            <div className={`flex items-center gap-2.5 ${step === 2 ? 'opacity-100' : 'opacity-60'}`}>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-all ${
                  step === 2
                    ? 'bg-rentify-primary text-white shadow-xs'
                    : 'bg-slate-100 text-rentify-text-secondary'
                }`}
              >
                2
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-rentify-text-secondary uppercase tracking-wider">
                  {t('wizard.step2Badge')}
                </span>
                <span className="font-semibold text-xs text-rentify-text-primary truncate">
                  {t('wizard.step2Title')}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-200 h-1 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-rentify-primary h-full rounded-full transition-all duration-300"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>
        </div>

        {/* Step 1: Thông tin cơ bản */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="border-b border-rentify-divider pb-3">
              <div className="inline-flex items-center gap-1.5 text-rentify-primary mb-1">
                <Building2 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {t('wizard.step1Tag')}
                </span>
              </div>
              <h3 className="text-base font-bold text-rentify-text-primary">
                {t('wizard.step1Header')}
              </h3>
              <p className="text-xs text-rentify-text-secondary mt-0.5">
                {t('wizard.step1Description')}
              </p>
            </div>

            <BuildingInfoForm form={form} disabled={isSubmitting} />

            <div className="pt-4 border-t border-rentify-divider flex items-center justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="border-rentify-divider"
              >
                {t('cancel')}
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={goToNextStep}
                className="gap-2"
              >
                <span>{t('wizard.nextStepTo2')}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Upload giấy tờ */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="border-b border-rentify-divider pb-3">
              <div className="inline-flex items-center gap-1.5 text-rentify-primary mb-1">
                <FileCheck2 className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {t('wizard.step2Tag')}
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-bold text-rentify-text-primary">
                  {t('wizard.step2Header')}
                </h3>
                <span className="text-[11px] text-rentify-text-secondary bg-slate-100 px-2 py-0.5 rounded font-medium">
                  {t('wizard.step2OptionalBadge')}
                </span>
              </div>
              <p className="text-xs text-rentify-text-secondary mt-0.5">
                {t('wizard.step2Description')}
              </p>
            </div>

            <OwnershipProofUploader
              mediaIds={mediaIds}
              onChange={setMediaIds}
              disabled={isSubmitting}
            />

            <div className="pt-4 border-t border-rentify-divider flex items-center justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={goToPrevStep}
                disabled={isSubmitting}
                className="gap-2 border-rentify-divider"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('wizard.prevStepTo1')}</span>
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={isSubmitting}
                className="gap-2"
              >
                <Send className="w-4 h-4" />
                <span>
                  {mediaIds.length > 0 ? t('wizard.submitAction') : t('wizard.createAction')}
                </span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};
