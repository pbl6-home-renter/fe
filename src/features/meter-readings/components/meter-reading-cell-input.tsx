import { useTranslation } from 'react-i18next';
import { Camera, Check, Image as ImageIcon, Sparkles, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { IconButton } from '@/components/ui/icon-button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import { useMeterReadingOcr } from '../hooks/use-meter-reading-ocr';
import { MeterType } from '../enums/meter-type.enum';

interface MeterReadingCellInputProps {
  roomId: string;
  type: MeterType;
  previousReading: string;
  currentReading: string;
  consumption: string;
  evidenceMediaId: string | null;
  evidencePreviewUrl: string | null;
  source: 'manual' | 'ocr';
  ocrValue?: string | null;
  ocrConfidence?: number;
  isSaved: boolean;
  onReadingChange: (val: string) => void;
  onOcrSuccess: (data: {
    currentReading?: string;
    evidenceMediaId: string;
    previewUrl: string;
    source: 'manual' | 'ocr';
    ocrValue?: string | null;
    ocrConfidence?: number;
  }) => void;
  onViewImage: (url: string) => void;
}

export const MeterReadingCellInput = ({
  roomId,
  type,
  previousReading,
  currentReading,
  consumption,
  evidenceMediaId,
  evidencePreviewUrl,
  source,
  ocrValue,
  ocrConfidence,
  isSaved,
  onReadingChange,
  onOcrSuccess,
  onViewImage,
}: MeterReadingCellInputProps) => {
  const { t } = useTranslation('meterReadings');

  const { fileInputRef, isProcessing, ocrWarning, handleProcessFile, openCameraPicker } = useMeterReadingOcr({
    roomId,
    onSuccess: onOcrSuccess,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onReadingChange(e.target.value);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleProcessFile(file);
  };

  const previewSource = evidencePreviewUrl || (evidenceMediaId ? `/api/v1/media/${evidenceMediaId}` : null);
  const isLessThanPrev = currentReading && previousReading && parseFloat(currentReading) < parseFloat(previousReading);
  const unit = type === MeterType.ELECTRICITY ? 'kWh' : 'm³';

  return (
    <div className="flex flex-col gap-1.5 p-1 min-w-[200px]">
      <div className="flex items-center justify-between text-[11px] text-rentify-text-secondary">
        <span>
          {t('columns.previous')}: <strong className="text-rentify-text-primary">{previousReading || '0'}</strong>
        </span>
        {consumption !== '0' && (
          <Badge variant="success" className="px-1.5 py-0.5 text-[10px] font-semibold">
            +{consumption} {unit}
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Input
          type="text"
          inputMode="decimal"
          value={currentReading}
          onChange={handleInputChange}
          placeholder={previousReading || '0'}
          disabled={isSaved}
          containerClassName="w-full flex-1 min-w-0"
          className={cn(
            'h-9 min-h-9 px-2.5 py-1 text-xs rounded-xl',
            isLessThanPrev && 'border-rentify-warning focus:border-rentify-warning focus:ring-rentify-warning/20',
            isSaved && 'opacity-80 bg-rentify-background',
          )}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          onChange={handleFileInputChange}
          className="hidden"
        />

        {previewSource ? (
          <IconButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => onViewImage(previewSource)}
            aria-label={t('actions.viewPhoto')}
            className="h-9 w-9 rounded-xl border border-rentify-primary/20"
          >
            <ImageIcon className="w-4 h-4" />
          </IconButton>
        ) : (
          <IconButton
            type="button"
            variant="outline"
            size="sm"
            onClick={openCameraPicker}
            disabled={isSaved}
            isLoading={isProcessing}
            aria-label={t('actions.capturePhoto')}
            className="h-9 w-9 rounded-xl"
          >
            <Camera className="w-4 h-4" />
          </IconButton>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1 text-[10px]">
        {source === 'ocr' && ocrValue && (
          <Badge variant="primary" leadingIcon={<Sparkles className="w-3 h-3" />} className="px-1.5 py-0.5 text-[10px]">
            AI: {ocrValue} {ocrConfidence ? `(${Math.round(ocrConfidence * 100)}%)` : ''}
          </Badge>
        )}

        {isSaved && (
          <Badge variant="success" leadingIcon={<Check className="w-3 h-3" />} className="px-1.5 py-0.5 text-[10px]">
            {t('status.saved')}
          </Badge>
        )}

        {ocrWarning && (
          <span className="inline-flex items-center gap-1 text-rentify-warning">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span className="truncate max-w-[170px]">{ocrWarning}</span>
          </span>
        )}

        {isLessThanPrev && (
          <span className="text-rentify-warning font-medium">{t('errors.readingLessThanPrevious')}</span>
        )}
      </div>
    </div>
  );
};
