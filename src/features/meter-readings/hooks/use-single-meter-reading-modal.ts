import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDisclosure } from '@/hooks/use-disclosure';
import { useCreateMeterReadingMutation } from './use-create-meter-reading-mutation';
import { MeterType } from '../enums/meter-type.enum';
import { calculateConsumption } from '../utils/meter-reading.helper';
import type { RoomReadingRowState } from '../types/meter-reading.dto';

export interface SingleMeterReadingModalTarget {
  roomId: string;
  roomName: string;
  type: MeterType;
  period: string;
  previousReading: string;
  currentReading?: string;
  evidenceMediaId?: string | null;
  previewUrl?: string | null;
  row?: RoomReadingRowState;
}

export const useSingleMeterReadingModal = (onSuccessCallback?: () => void) => {
  const { t } = useTranslation('meterReadings');
  const { isOpen, open: openDialog, close: closeDialog } = useDisclosure(false);

  const [target, setTarget] = useState<SingleMeterReadingModalTarget | null>(null);
  const [currentReading, setCurrentReading] = useState('');
  const [isBaseline, setIsBaseline] = useState(false);
  const [evidenceMediaId, setEvidenceMediaId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const createMutation = useCreateMeterReadingMutation({
    onSuccess: () => {
      closeDialog();
      onSuccessCallback?.();
    },
  });

  const openModal = useCallback(
    (targetData: SingleMeterReadingModalTarget) => {
      setTarget(targetData);
      setCurrentReading(targetData.currentReading || '');
      setIsBaseline(false);
      setEvidenceMediaId(targetData.evidenceMediaId || null);
      setPreviewUrl(targetData.previewUrl || null);
      setFormError(null);
      openDialog();
    },
    [openDialog],
  );

  const closeModal = useCallback(() => {
    closeDialog();
    setTarget(null);
  }, [closeDialog]);

  const handleSwitchType = useCallback(
    (newType: MeterType) => {
      if (!target) return;
      const cell = target.row
        ? newType === MeterType.ELECTRICITY
          ? target.row.electricity
          : target.row.water
        : undefined;
      setTarget((prev) =>
        prev
          ? {
              ...prev,
              type: newType,
              previousReading: cell?.previousReading || '0',
              currentReading: cell?.currentReading || '',
              evidenceMediaId: cell?.evidenceMediaId || null,
              previewUrl: cell?.evidencePreviewUrl || null,
            }
          : null,
      );
      setCurrentReading(cell?.currentReading || '');
      setEvidenceMediaId(cell?.evidenceMediaId || null);
      setPreviewUrl(cell?.evidencePreviewUrl || null);
      setFormError(null);
    },
    [target],
  );

  const handleSubmit = useCallback(() => {
    if (!target) return;
    setFormError(null);

    if (!currentReading.trim()) {
      setFormError(t('errors.readingRequired'));
      return;
    }

    if (!isBaseline && target.previousReading) {
      const prev = parseFloat(target.previousReading);
      const curr = parseFloat(currentReading);
      if (!isNaN(prev) && !isNaN(curr) && curr < prev) {
        setFormError(t('errors.readingLessThanPrevious'));
        return;
      }
    }

    if (!evidenceMediaId) {
      setFormError(t('errors.evidenceRequired'));
      return;
    }

    createMutation.mutate({
      roomId: target.roomId,
      type: target.type,
      period: target.period,
      currentReading: currentReading.trim(),
      previousReading: target.previousReading || undefined,
      isBaseline,
      evidenceMediaId,
    });
  }, [target, currentReading, isBaseline, evidenceMediaId, createMutation, t]);

  const consumption = calculateConsumption(currentReading, target?.previousReading);

  return {
    isOpen,
    target,
    currentReading,
    setCurrentReading,
    isBaseline,
    setIsBaseline,
    evidenceMediaId,
    setEvidenceMediaId,
    previewUrl,
    setPreviewUrl,
    formError,
    setFormError,
    consumption,
    openModal,
    closeModal,
    handleSwitchType,
    handleSubmit,
    isSubmitting: createMutation.isPending,
  };
};
