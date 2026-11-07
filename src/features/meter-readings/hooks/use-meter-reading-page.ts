import { useState, useCallback } from 'react';
import { useDisclosure } from '@/hooks/use-disclosure';
import { useMeterReadingMatrix } from './use-meter-reading-matrix';
import { useSingleMeterReadingModal } from './use-single-meter-reading-modal';
import { MeterType } from '../enums/meter-type.enum';
import type { RoomReadingRowState } from '../types/meter-reading.dto';

export const useMeterReadingPage = () => {
  const matrix = useMeterReadingMatrix();
  const singleModal = useSingleMeterReadingModal();

  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const { isOpen: isPreviewOpen, open: openPreviewDialog, close: closePreviewDialog } = useDisclosure(false);

  const handleOpenPreview = useCallback(
    (url: string) => {
      setPreviewImageUrl(url);
      openPreviewDialog();
    },
    [openPreviewDialog],
  );

  const handleClosePreview = useCallback(() => {
    closePreviewDialog();
    setPreviewImageUrl(null);
  }, [closePreviewDialog]);

  const handleOpenSingleModal = useCallback(
    (row: RoomReadingRowState, type: MeterType) => {
      const readingItem = type === MeterType.ELECTRICITY ? row.electricity : row.water;
      singleModal.openModal({
        roomId: row.roomId,
        roomName: row.roomName,
        type,
        period: matrix.selectedPeriod,
        previousReading: readingItem.previousReading,
        currentReading: readingItem.currentReading,
        evidenceMediaId: readingItem.evidenceMediaId,
        previewUrl: readingItem.evidencePreviewUrl,
      });
    },
    [matrix.selectedPeriod, singleModal],
  );

  return {
    ...matrix,
    singleModal,
    previewImageUrl,
    isPreviewOpen,
    handleOpenPreview,
    handleClosePreview,
    handleOpenSingleModal,
  };
};
