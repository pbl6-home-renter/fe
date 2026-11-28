import { useRef, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { validateMediaFile } from '@/features/media/utils/upload-media';
import { MediaPurpose } from '@/features/media/types/media.dto';
import { useNotify } from '@/lib/notifications/use-notify';
import type { CellOcrSuccessData } from '../types/meter-reading.dto';

export interface UseMeterReadingOcrProps {
  roomId: string;
  onSuccess: (result: CellOcrSuccessData) => void;
}

export const useMeterReadingOcr = ({ onSuccess }: UseMeterReadingOcrProps) => {
  const { t } = useTranslation('meterReadings');
  const notify = useNotify();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrWarning, setOcrWarning] = useState<string | null>(null);

  const handleProcessFile = useCallback(
    async (file: File) => {
      // Validate file size and type (JPEG/PNG/WebP) before storing locally;
      // actual upload happens after creating the meter reading so `ownerId` is a valid reading ID.
      const validationError = validateMediaFile(file, MediaPurpose.METER_READING_EVIDENCE);
      if (validationError) {
        notify.error(t('errors.invalidImage'));
        return;
      }

      setIsProcessing(true);
      setOcrWarning(null);
      try {
        const previewUrl = URL.createObjectURL(file);
        onSuccess({
          evidenceFile: file,
          previewUrl,
          source: 'manual',
        });
      } finally {
        setIsProcessing(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [onSuccess, notify, t],
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
