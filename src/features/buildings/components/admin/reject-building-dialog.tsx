import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRejectBuildingMutation } from '../../hooks/admin/use-reject-building-mutation';

export interface RejectBuildingDialogProps {
  open: boolean;
  onClose: () => void;
  buildingId: string;
  buildingName: string;
  landlordName?: string;
  onSuccess?: () => void;
}

const PRESET_REASONS = [
  'Giấy tờ mờ, không rõ số phát hành và thông tin số thửa.',
  'Thông tin người đại diện đứng tên trên giấy tờ chưa khớp với thông tin tài khoản.',
  'Thiếu biên bản kiểm định an toàn PCCC có hiệu lực hoặc mộc đỏ cơ quan chức năng.',
  'Địa chỉ thực tế và vị trí ghi trên sổ chứng nhận chưa đồng nhất.',
];

export const RejectBuildingDialog = ({
  open,
  onClose,
  buildingId,
  buildingName,
  landlordName,
  onSuccess,
}: RejectBuildingDialogProps) => {
  const { t } = useTranslation('buildings');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);

  const rejectMutation = useRejectBuildingMutation();

  const handleSelectPreset = (preset: string) => {
    setNote(preset);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = note.trim();
    if (!trimmed) {
      setError(t('admin.rejectNoteRequired', { defaultValue: 'Vui lòng nhập lý do từ chối hồ sơ.' }));
      return;
    }
    if (trimmed.length > 500) {
      setError(t('admin.rejectNoteMax', { defaultValue: 'Lý do từ chối không được vượt quá 500 ký tự.' }));
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
              {t('admin.rejectTitle', { defaultValue: 'Từ chối phê duyệt bất động sản' })}
            </h2>
            <p className="text-xs text-rentify-text-secondary mt-0.5">
              {landlordName
                ? t('admin.rejectTarget', {
                    defaultValue: 'Hồ sơ: {{building}} · Chủ sở hữu: {{landlord}}',
                    building: buildingName,
                    landlord: landlordName,
                  })
                : t('admin.rejectTargetBuildingOnly', {
                    defaultValue: 'Hồ sơ tòa nhà: {{building}}',
                    building: buildingName,
                  })}
            </p>
          </div>
        </div>

        {/* Note info box */}
        <div className="p-3 bg-surface-container-low border border-rentify-divider rounded-xl text-xs text-rentify-text-secondary leading-relaxed">
          {t('admin.rejectNotice', {
            defaultValue: 'Vui lòng nêu rõ lý do từ chối hồ sơ. Thông báo kèm lý do này sẽ được gửi trực tiếp đến chủ nhà để tiến hành cập nhật, bổ sung.',
          })}
        </div>

        {/* Preset Reason Chips */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-rentify-text-secondary uppercase tracking-wider block">
            {t('admin.presetReasonsLabel', { defaultValue: 'Lý do gợi ý thường gặp' })}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_REASONS.map((preset, idx) => (
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
              {t('admin.rejectNoteField', { defaultValue: 'Nội dung lý do từ chối' })}{' '}
              <span className="text-rentify-error">*</span>
            </label>
            <span className="text-rentify-text-secondary">{note.length} / 500</span>
          </div>

          <textarea
            id="rejectionNote"
            rows={4}
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              if (error) setError(null);
            }}
            placeholder={t('admin.rejectNotePlaceholder', {
              defaultValue: 'Nhập chi tiết các thông tin chưa đạt yêu cầu kiểm duyệt...',
            })}
            maxLength={500}
            disabled={rejectMutation.isPending}
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
            disabled={rejectMutation.isPending}
            className="border-rentify-divider"
          >
            {t('cancel')}
          </Button>

          <Button
            type="submit"
            variant="danger"
            isLoading={rejectMutation.isPending}
            disabled={rejectMutation.isPending}
          >
            {t('admin.confirmReject', { defaultValue: 'Xác nhận từ chối' })}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
