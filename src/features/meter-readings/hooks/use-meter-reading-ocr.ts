import { useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { uploadMedia, validateMediaFile } from '@/features/media/utils/upload-media';
import { MediaOwnerType, MediaPurpose } from '@/features/media/types/media.dto';
import { useNotify } from '@/lib/notifications/use-notify';
import { meterReadingApi } from '../api/meter-reading.api';

export interface UseMeterReadingOcrProps {
  roomId: string;
  onSuccess: (result: {
    currentReading?: string;
    evidenceMediaId: string;
    previewUrl: string;
    ocrValue?: string | null;
    ocrConfidence?: number;
    source: 'manual' | 'ocr';
  }) => void;
}

export const useMeterReadingOcr = ({ roomId, onSuccess }: UseMeterReadingOcrProps) => {
  const { t } = useTranslation('meterReadings');
  const notify = useNotify();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrWarning, setOcrWarning] = useState<string | null>(null);

  const handleProcessFile = useCallback(
    async (file: File) => {
      // Validate file size and type (JPEG/PNG/WebP <= 5MB)
      const validationError = validateMediaFile(file, MediaPurpose.METER_READING_EVIDENCE);
      if (validationError) {
        const msg = t('errors.invalidImage');
        notify.error(msg);
        return;
      }

      setIsProcessing(true);
      setOcrWarning(null);
      const previewUrl = URL.createObjectURL(file);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      try {
        // Run OCR and Media Upload concurrently
        const [ocrRes, mediaRes] = await Promise.all([
          meterReadingApi.ocrMeterReading(file, controller.signal).catch(() => ({ value: null, confidence: 0 })),
          uploadMedia({
            file,
            ownerType: MediaOwnerType.METER_READING,
            ownerId: roomId,
            purpose: MediaPurpose.METER_READING_EVIDENCE,
            skipSuccessToast: true,
          }),
        ]);

        clearTimeout(timeoutId);

        if (ocrRes.value) {
          onSuccess({
            currentReading: ocrRes.value,
            evidenceMediaId: mediaRes.id,
            previewUrl,
            ocrValue: ocrRes.value,
            ocrConfidence: ocrRes.confidence,
            source: 'ocr',
          });
        } else {
          // Fallback to manual entry when OCR cannot recognize numbers
          setOcrWarning(t('warnings.ocrUnrecognized'));
          onSuccess({
            evidenceMediaId: mediaRes.id,
            previewUrl,
            source: 'manual',
          });
        }
      } catch {
        clearTimeout(timeoutId);
        URL.revokeObjectURL(previewUrl);
      } finally {
        setIsProcessing(false);
      }
    },
    [roomId, onSuccess, notify, t],
  );

  const openCameraPicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    fileInputRef,
    isProcessing,
    ocrWarning,
    clearWarning: () => setOcrWarning(null),
    handleProcessFile,
    openCameraPicker,
  };
};
