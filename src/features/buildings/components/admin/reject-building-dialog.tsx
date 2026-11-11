import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
  const { note, error, isPending, presetReasons, handleNoteChange, handleSelectPreset, handleSubmit, handleClose } =
    useRejectBuildingDialog({ buildingId, onClose, onSuccess });

  return (
    <Dialog open={open} onClose={handleClose} accessibleTitle={t('admin.rejectTitle')} maxWidth="xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-rentify-error/10 text-rentify-error flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-rentify-text-primary">{t('admin.rejectTitle')}</h2>
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
            {presetReasons.map((preset) => (
              <Button
                key={preset}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSelectPreset(preset)}
                disabled={isPending}
              >
                {preset}
              </Button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div>
          <Textarea
            id="rejectionNote"
            label={`${t('admin.rejectNoteField')} *`}
            rows={4}
            value={note}
            onChange={(e) => handleNoteChange(e.target.value)}
            placeholder={t('admin.rejectNotePlaceholder')}
            maxLength={500}
            showCount
            disabled={isPending}
            error={error ?? undefined}
            className="resize-none"
          />
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

          <Button type="submit" variant="danger" isLoading={isPending} disabled={isPending}>
            {t('admin.confirmReject')}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
