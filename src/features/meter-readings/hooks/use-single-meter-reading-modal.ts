import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDisclosure } from '@/hooks/use-disclosure';
import { useCreateMeterReadingMutation } from './use-create-meter-reading-mutation';
import { useUpdateMeterReadingMutation } from './use-update-meter-reading-mutation';
import { MeterType } from '../enums/meter-type.enum';
import { calculateConsumption } from '../utils/meter-reading.helper';
import type { CellOcrSuccessData, MeterCellState, RoomReadingRowState } from '../types/meter-reading.dto';

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

interface MeterReadingTabDraft {
  existingId: string | null;
  hasPreviousReading: boolean;
  previousReading: string;
  currentReading: string;
  isBaseline: boolean;
  evidenceMediaId: string | null;
  evidenceFile: File | null;
  previewUrl: string | null;
  isDirty: boolean;
}

type TabDrafts = Record<MeterType, MeterReadingTabDraft>;

const createDraftFromCell = (
  cell?: MeterCellState,
  fallback?: Partial<SingleMeterReadingModalTarget>,
): MeterReadingTabDraft => {
  if (cell) {
    return {
      existingId: cell.existingId,
      hasPreviousReading: cell.hasPreviousReading,
      previousReading: cell.previousReading || '0',
      currentReading: cell.currentReading || '',
      isBaseline: cell.existingId ? cell.isBaseline : !cell.hasPreviousReading,
      evidenceMediaId: cell.evidenceMediaId || null,
      evidenceFile: cell.evidenceFile || null,
      previewUrl: cell.evidencePreviewUrl || null,
      isDirty: false,
    };
  }
  return {
    existingId: null,
    hasPreviousReading: Boolean(fallback?.previousReading && fallback.previousReading !== '0'),
    previousReading: fallback?.previousReading || '0',
    currentReading: fallback?.currentReading || '',
    isBaseline: !fallback?.previousReading || fallback.previousReading === '0',
    evidenceMediaId: fallback?.evidenceMediaId || null,
    evidenceFile: null,
    previewUrl: fallback?.previewUrl || null,
    isDirty: false,
  };
};

export const useSingleMeterReadingModal = (onSuccessCallback?: (roomId: string, type: MeterType) => void) => {
  const { t } = useTranslation('meterReadings');
  const { isOpen, open: openDialog, close: closeDialog } = useDisclosure(false);

  const [baseTarget, setBaseTarget] = useState<SingleMeterReadingModalTarget | null>(null);
  const [activeType, setActiveType] = useState<MeterType>(MeterType.ELECTRICITY);
  const [drafts, setDrafts] = useState<TabDrafts | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSaveSuccess = useCallback(
    (savedId: string, savedType: MeterType) => {
      if (baseTarget) {
        onSuccessCallback?.(baseTarget.roomId, savedType);
      }

      const otherType = savedType === MeterType.ELECTRICITY ? MeterType.WATER : MeterType.ELECTRICITY;
      const otherTabDirty = drafts?.[otherType]?.isDirty ?? false;

      if (otherTabDirty) {
        setDrafts((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            [savedType]: {
              ...prev[savedType],
              existingId: savedId,
              evidenceFile: null,
              isDirty: false,
            },
          };
        });
        setActiveType(otherType);
        setFormError(null);
      } else {
        closeDialog();
        setBaseTarget(null);
        setDrafts(null);
      }
    },
    [baseTarget, drafts, closeDialog, onSuccessCallback],
  );

  const createMutation = useCreateMeterReadingMutation({
    onSuccess: (data, variables) => {
      handleSaveSuccess(data.id, variables.payload.type);
    },
  });

  const updateMutation = useUpdateMeterReadingMutation({
    onSuccess: (data) => {
      handleSaveSuccess(data.id, activeType);
    },
  });

  const openModal = useCallback(
    (targetData: SingleMeterReadingModalTarget) => {
      const electricityDraft = createDraftFromCell(
        targetData.row?.electricity,
        targetData.type === MeterType.ELECTRICITY ? targetData : undefined,
      );
      const waterDraft = createDraftFromCell(
        targetData.row?.water,
        targetData.type === MeterType.WATER ? targetData : undefined,
      );

      setBaseTarget(targetData);
      setActiveType(targetData.type);
      setDrafts({
        [MeterType.ELECTRICITY]: electricityDraft,
        [MeterType.WATER]: waterDraft,
      });
      setFormError(null);
      openDialog();
    },
    [openDialog],
  );

  const closeModal = useCallback(() => {
    closeDialog();
    setBaseTarget(null);
    setDrafts(null);
    setFormError(null);
  }, [closeDialog]);

  const updateActiveDraft = useCallback(
    (patch: Partial<MeterReadingTabDraft>) => {
      setDrafts((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          [activeType]: {
            ...prev[activeType],
            ...patch,
            isDirty: true,
          },
        };
      });
    },
    [activeType],
  );

  const setCurrentReading = useCallback(
    (val: string) => {
      setFormError(null);
      updateActiveDraft({ currentReading: val });
    },
    [updateActiveDraft],
  );

  const setIsBaseline = useCallback(
    (val: boolean) => {
      setFormError(null);
      updateActiveDraft({ isBaseline: val });
    },
    [updateActiveDraft],
  );

  const handleOcrSuccess = useCallback(
    (data: CellOcrSuccessData) => {
      setFormError(null);
      updateActiveDraft({
        ...(data.currentReading ? { currentReading: data.currentReading } : {}),
        ...(data.evidenceMediaId ? { evidenceMediaId: data.evidenceMediaId } : {}),
        ...(data.evidenceFile ? { evidenceFile: data.evidenceFile } : {}),
        ...(data.previewUrl ? { previewUrl: data.previewUrl } : {}),
      });
    },
    [updateActiveDraft],
  );

  const handleSwitchType = useCallback((newType: MeterType) => {
    setActiveType(newType);
    setFormError(null);
  }, []);

  const activeDraft = drafts?.[activeType] ?? null;

  const target: SingleMeterReadingModalTarget | null =
    baseTarget && activeDraft
      ? {
          ...baseTarget,
          type: activeType,
          previousReading: activeDraft.previousReading,
          currentReading: activeDraft.currentReading,
          evidenceMediaId: activeDraft.evidenceMediaId,
          previewUrl: activeDraft.previewUrl,
        }
      : null;

  const handleSubmit = useCallback(() => {
    if (!baseTarget || !activeDraft) return;
    setFormError(null);

    const trimmedReading = activeDraft.currentReading.trim();
    if (!trimmedReading) {
      setFormError(t('errors.readingRequired'));
      return;
    }

    if (!activeDraft.isBaseline && activeDraft.hasPreviousReading && activeDraft.previousReading) {
      const prev = parseFloat(activeDraft.previousReading);
      const curr = parseFloat(trimmedReading);
      if (!isNaN(prev) && !isNaN(curr) && curr < prev) {
        setFormError(t('errors.readingLessThanPrevious'));
        return;
      }
    }

    if (!activeDraft.evidenceFile && !activeDraft.evidenceMediaId) {
      setFormError(t('errors.evidenceRequired'));
      return;
    }

    if (activeDraft.existingId) {
      updateMutation.mutate({
        readingId: activeDraft.existingId,
        currentReading: trimmedReading,
        evidenceFile: activeDraft.evidenceFile,
      });
      return;
    }

    createMutation.mutate({
      payload: {
        roomId: baseTarget.roomId,
        type: activeType,
        period: baseTarget.period,
        currentReading: trimmedReading,
        ...(activeDraft.isBaseline ? { previousReading: activeDraft.previousReading || '0' } : {}),
        isBaseline: activeDraft.isBaseline,
      },
      evidenceFile: activeDraft.evidenceFile,
    });
  }, [baseTarget, activeDraft, activeType, createMutation, updateMutation, t]);

  const consumption = calculateConsumption(activeDraft?.currentReading || '', activeDraft?.previousReading);

  return {
    isOpen,
    target,
    currentReading: activeDraft?.currentReading || '',
    setCurrentReading,
    isBaseline: activeDraft?.isBaseline ?? false,
    setIsBaseline,
    isEditing: Boolean(activeDraft?.existingId),
    evidenceMediaId: activeDraft?.evidenceMediaId ?? null,
    previewUrl: activeDraft?.previewUrl ?? null,
    handleOcrSuccess,
    formError,
    consumption,
    openModal,
    closeModal,
    handleSwitchType,
    handleSubmit,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  };
};
