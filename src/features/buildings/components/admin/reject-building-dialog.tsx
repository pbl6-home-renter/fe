import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRejectBuildingDialog } from '../../hooks/admin/use-reject-building-dialog';

export interface RejectBuildingDialogProps {
  open: boolean;
  onClose: () => void;
  buildingId: string;
  buildingName: string;
  landlordName?: string;
  onSuccess?: () => void;
}

export const RejectBuildingDialog = ({
  open,
  onClose,
  buildingId,
  buildingName,
  landlordName,
  onSuccess,
}: RejectBuildingDialogProps) => {
  const { t } = useTranslation('buildings');
  const {
    note,
    error,
    isPending,
    presetReasons,
    handleNoteChange,
    handleSelectPreset,
    handleSubmit,
    handleClose,
  } = useRejectBuildingDialog({ buildingId, onClose, onSuccess });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-rentify-error/10 text-rentify-error flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-rentify-text-primary">
              {t('admin.rejectTitle')}
            </h2>
            <p className="text-xs text-rentify-text-secondary mt-0.5">
              {landlordName
                ? t('admin.rejectTarget', {
                    building: buildingName,
                    landlord: landlordName,
                  })
                : t('admin.rejectTargetBuildingOnly', {
                    building: buildingName,
                  })}
            </p>
          </div>
        </div>

        {/* Note info box */}
        <div className="p-3 bg-surface-container-low border border-rentify-divider rounded-xl text-xs text-rentify-text-secondary leading-relaxed">
          {t('admin.rejectNotice')}
        </div>

        {/* Preset Reason Chips */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-rentify-text-secondary uppercase tracking-wider block">
            {t('admin.presetReasonsLabel')}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {presetReasons.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="text-left px-2.5 py-1.5 rounded-lg border border-rentify-divider bg-rentify-surface hover:bg-surface-container-low text-rentify-text-primary text-xs transition-colors cursor-pointer"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <label htmlFor="rejectionNote" className="font-semibold text-rentify-text-primary">
              {t('admin.rejectNoteField')}{' '}
              <span className="text-rentify-error">*</span>
            </label>
            <span className="text-rentify-text-secondary">{note.length} / 500</span>
          </div>

          <textarea
            id="rejectionNote"
            rows={4}
            value={note}
            onChange={(e) => handleNoteChange(e.target.value)}
            placeholder={t('admin.rejectNotePlaceholder')}
            maxLength={500}
            disabled={isPending}
            className={`w-full p-3 text-sm rounded-xl border bg-rentify-surface text-rentify-text-primary placeholder:text-rentify-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-rentify-error/20 transition-all resize-none ${
              error ? 'border-rentify-error' : 'border-rentify-divider'
            }`}
          />
          {error && <p className="text-xs text-rentify-error mt-0.5">{error}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-rentify-divider">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isPending}
            className="border-rentify-divider"
          >
            {t('cancel')}
          </Button>

          <Button
            type="submit"
            variant="danger"
            isLoading={isPending}
            disabled={isPending}
          >
            {t('admin.confirmReject')}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
