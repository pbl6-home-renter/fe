import { useTranslation } from 'react-i18next';
import {
  Building2,
  FileCheck2,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BuildingInfoForm } from './building-info-form';
import { OwnershipProofUploader } from './ownership-proof-uploader';
import { CreateWizardIndicator } from './create/create-wizard-indicator';
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
      title={t('create.title')}
      description={t('create.subtitle')}
    >
      <div className="space-y-6 pt-2">
        <CreateWizardIndicator step={step} />

        {/* Step 1: Basic info */}
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
                onClick={handleClose}
                disabled={isSubmitting}
              >
                {t('cancel')}
              </Button>

              <Button
                variant="primary"
                onClick={goToNextStep}
                disabled={isSubmitting}
                className="gap-2"
              >
                <span>{t('wizard.nextStepTo2')}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Ownership documents */}
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
                <span className="text-[11px] text-rentify-text-secondary bg-surface-container-low px-2 py-0.5 rounded font-medium">
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
                onClick={goToPrevStep}
                disabled={isSubmitting}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('wizard.prevStepTo1')}</span>
              </Button>

              <Button
                variant="primary"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={isSubmitting}
                className="gap-2"
              >
                <Check className="w-4 h-4" />
                <span>
                  {mediaIds.length > 0
                    ? t('wizard.submitAction')
                    : t('wizard.createAction')}
                </span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};
