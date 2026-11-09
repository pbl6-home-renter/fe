import { useTranslation } from 'react-i18next';
import { Camera, Image as ImageIcon, Zap, Droplets, Loader2 } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useMeterReadingOcr } from '../hooks/use-meter-reading-ocr';
import { MeterType } from '../enums/meter-type.enum';
import type { SingleMeterReadingModalTarget } from '../hooks/use-single-meter-reading-modal';

interface SingleMeterReadingModalProps {
  open: boolean;
  onClose: () => void;
  target: SingleMeterReadingModalTarget | null;
  currentReading: string;
  onCurrentReadingChange: (val: string) => void;
  isBaseline: boolean;
  onIsBaselineChange: (val: boolean) => void;
  evidenceMediaId: string | null;
  previewUrl: string | null;
  onOcrSuccess: (data: {
    currentReading?: string;
    evidenceMediaId: string;
    previewUrl: string;
    source: 'manual' | 'ocr';
    ocrValue?: string | null;
    ocrConfidence?: number;
  }) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  formError?: string | null;
  consumption: string;
  onSwitchType?: (type: MeterType) => void;
}

export const SingleMeterReadingModal = ({
  open,
  onClose,
  target,
  currentReading,
  onCurrentReadingChange,
  isBaseline,
  onIsBaselineChange,
  evidenceMediaId,
  previewUrl,
  onOcrSuccess,
  onSubmit,
  isSubmitting,
  formError,
  consumption,
  onSwitchType,
}: SingleMeterReadingModalProps) => {
  const { t } = useTranslation('meterReadings');
  const { fileInputRef, isProcessing, ocrWarning, handleProcessFile, openCameraPicker } = useMeterReadingOcr({
    roomId: target?.roomId || '',
    onSuccess: onOcrSuccess,
  });

  if (!target) return null;
  const isElectricity = target.type === MeterType.ELECTRICITY;
  const unit = isElectricity ? 'kWh' : 'm³';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('modal.singleTitle', { room: target.roomName })}
      maxWidth="sm"
      footer={
        <div className="flex items-center justify-end gap-2 w-full">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            {t('actions.cancel')}
          </Button>
          <Button type="button" variant="primary" size="sm" onClick={onSubmit} isLoading={isSubmitting}>
            {t('actions.save')}
          </Button>
        </div>
      }
    >
      <div className="space-y-4 py-1">
        <div className="flex items-center justify-between gap-2">
          {onSwitchType ? (
            <div className="flex items-center bg-surface-container-low p-1 rounded-xl gap-1">
              <button
                type="button"
                onClick={() => onSwitchType(MeterType.ELECTRICITY)}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  isElectricity
                    ? 'bg-rentify-surface text-amber-600 shadow-xs'
                    : 'text-rentify-text-secondary hover:text-rentify-text-primary'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{t('types.electricity')}</span>
              </button>
              <button
                type="button"
                onClick={() => onSwitchType(MeterType.WATER)}
                className={`px-2.5 py-1 text-xs rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  !isElectricity
                    ? 'bg-rentify-surface text-blue-600 shadow-xs'
                    : 'text-rentify-text-secondary hover:text-rentify-text-primary'
                }`}
              >
                <Droplets className="w-3.5 h-3.5" />
                <span>{t('types.water')}</span>
              </button>
            </div>
          ) : (
            <Badge
              variant={isElectricity ? 'warning' : 'primary'}
              leadingIcon={isElectricity ? <Zap className="w-3.5 h-3.5" /> : <Droplets className="w-3.5 h-3.5" />}
            >
              {isElectricity ? t('types.electricity') : t('types.water')}
            </Badge>
          )}
          <span className="text-xs text-rentify-text-secondary">
            {t('modal.periodLabel')}: <strong className="text-rentify-text-primary">{target.period}</strong>
          </span>
        </div>

        <div className="bg-rentify-background border border-rentify-divider rounded-xl p-3 flex items-center justify-between text-xs">
          <span className="text-rentify-text-secondary">{t('columns.previous')}:</span>
          <span className="font-semibold text-rentify-text-primary tabular-nums">
            {target.previousReading || t('warnings.noBaseline')} ({unit})
          </span>
        </div>

        <div className="space-y-1.5">
          <Input
            id="current-reading"
            label={`${t('columns.current')} (${unit}) *`}
            type="text"
            inputMode="decimal"
            value={currentReading}
            onChange={(e) => onCurrentReadingChange(e.target.value)}
            placeholder={target.previousReading || '0'}
          />
          {consumption !== '0' && (
            <div className="flex items-center gap-1.5 pt-0.5">
              <span className="text-xs text-rentify-text-secondary">{t('columns.consumption')}:</span>
              <Badge variant="success">
                +{consumption} {unit}
              </Badge>
            </div>
          )}
        </div>

        <div className="pt-1">
          <Checkbox
            id="isBaseline"
            checked={isBaseline}
            onChange={(e) => onIsBaselineChange(e.target.checked)}
            label={t('modal.isBaselineLabel')}
            helperText={t('modal.isBaselineDesc')}
          />
        </div>

        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-semibold text-rentify-text-primary">
            {t('modal.evidencePhotoLabel')} <span className="text-rentify-error">*</span>
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            capture="environment"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleProcessFile(file);
            }}
            className="hidden"
          />

          <div className="flex items-center gap-3">
            {previewUrl ? (
              <div className="relative group">
                <img
                  src={previewUrl}
                  alt={t('modal.evidencePhotoLabel')}
                  className="w-16 h-16 rounded-xl object-cover border border-rentify-divider shadow-xs"
                />
                <button
                  type="button"
                  onClick={openCameraPicker}
                  className="absolute inset-0 bg-black/40 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px]"
                >
                  {t('actions.retake')}
                </button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={openCameraPicker}
                disabled={isProcessing}
                className="gap-1.5 text-xs"
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 animate-spin text-rentify-primary" />
                ) : (
                  <Camera className="w-4 h-4 text-rentify-primary" />
                )}
                <span>{isProcessing ? t('status.processingOcr') : t('actions.capturePhoto')}</span>
              </Button>
            )}

            {evidenceMediaId && (
              <span className="text-[11px] text-rentify-success font-medium inline-flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{t('status.photoAttached')}</span>
              </span>
            )}
          </div>

          {ocrWarning && <p className="text-[11px] text-rentify-warning font-medium">{ocrWarning}</p>}
          {formError && <p className="text-[11px] text-rentify-error font-semibold">{formError}</p>}
        </div>
      </div>
    </Dialog>
  );
};
