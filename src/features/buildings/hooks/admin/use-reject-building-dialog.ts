import { useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useRejectBuildingMutation } from './use-reject-building-mutation';
import { REJECT_PRESET_REASONS } from '../../constants/building.constants';

export interface UseRejectBuildingDialogParams {
  buildingId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const useRejectBuildingDialog = ({
  buildingId,
  onClose,
  onSuccess,
}: UseRejectBuildingDialogParams) => {
  const { t } = useTranslation('buildings');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const rejectMutation = useRejectBuildingMutation();

  const handleSelectPreset = (preset: string) => {
    setNote(preset);
    setError(null);
  };

  const handleNoteChange = (value: string) => {
    setNote(value);
    if (error) setError(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = note.trim();
    if (!trimmed) {
      setError(t('admin.rejectNoteRequired'));
      return;
    }
    if (trimmed.length > 500) {
      setError(t('admin.rejectNoteMax'));
      return;
    }

    rejectMutation.mutate(
      { id: buildingId, payload: { note: trimmed } },
      {
        onSuccess: () => {
          setNote('');
          setError(null);
          onClose();
          onSuccess?.();
        },
      }
    );
  };

  const handleClose = () => {
    if (rejectMutation.isPending) return;
    setNote('');
    setError(null);
    onClose();
  };

  return {
    note,
    error,
    isPending: rejectMutation.isPending,
    presetReasons: REJECT_PRESET_REASONS,
    handleNoteChange,
    handleSelectPreset,
    handleSubmit,
    handleClose,
  };
};
