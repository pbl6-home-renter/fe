import { useEffect, useId, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Paperclip, X } from 'lucide-react';
import { IconButton } from '@/components/ui/icon-button';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';
import { notify } from '@/lib/notifications/notify';
import { cn } from '@/lib/utils/cn';
import { useAuthStore } from '@/stores/auth-store';
import { getMediaAccept } from '@/features/media/constants/media.constants';
import { useMediaUpload } from '@/features/media/hooks/use-media-upload';
import { MediaOwnerType, type MediaPurpose } from '@/features/media/types/media.dto';
import { MODERATION_LIMITS } from '../constants/moderation.constants';

export interface ModerationAttachment {
  id: string;
  name: string;
}

export interface ModerationAttachmentsFieldProps {
  purpose: MediaPurpose;
  label: string;
  helperText?: string;
  value: ModerationAttachment[];
  onChange: (value: ModerationAttachment[]) => void;
  onUploadingChange?: (isUploading: boolean) => void;
  disabled?: boolean;
}

/**
 * Uploads up to 3 private files owned by the current user (appeal attachments,
 * report evidence) and keeps their media ids for the business request.
 */
export const ModerationAttachmentsField = ({
  purpose,
  label,
  helperText,
  value,
  onChange,
  onUploadingChange,
  disabled = false,
}: ModerationAttachmentsFieldProps) => {
  const { t } = useTranslation('moderation');
  const inputId = useId();
  const userId = useAuthStore((state) => state.user?.id ?? '');
  const upload = useMediaUpload();
  const { isUploading, uploadAsync } = upload;
  const remaining = MODERATION_LIMITS.MAX_FILES - value.length;
  const isDisabled = disabled || isUploading || remaining <= 0 || !userId;

  useEffect(() => {
    onUploadingChange?.(isUploading);
  }, [isUploading, onUploadingChange]);

  const handleSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (selected.length > remaining) {
      notify.info(t('attachments.limit', { count: MODERATION_LIMITS.MAX_FILES }));
    }

    let next = value;
    for (const file of selected.slice(0, remaining)) {
      try {
        const media = await uploadAsync({
          file,
          ownerType: MediaOwnerType.USER,
          ownerId: userId,
          purpose,
          skipSuccessToast: true,
        });
        next = [...next, { id: media.id, name: file.name }];
        onChange(next);
      } catch {
        // Client-side and API errors are already toasted by the media upload flow.
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-rentify-text-primary">{label}</span>
        <span className="text-xs tabular-nums text-rentify-text-secondary">
          {t('attachments.counter', { count: value.length, max: MODERATION_LIMITS.MAX_FILES })}
        </span>
      </div>

      {value.length > 0 && (
        <ul className="space-y-1.5">
          {value.map((item) => (
            <li
              key={item.id}
              className="flex items-center gap-2 rounded-lg border border-rentify-divider bg-rentify-surface-container-low px-3 py-2 text-sm"
            >
              <FileText className="h-4 w-4 shrink-0 text-rentify-primary" aria-hidden="true" />
              <span className="min-w-0 flex-1 truncate">{item.name}</span>
              <IconButton
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 w-7"
                aria-label={t('attachments.remove', { name: item.name })}
                disabled={disabled || isUploading}
                onClick={() => onChange(value.filter((entry) => entry.id !== item.id))}
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </IconButton>
            </li>
          ))}
        </ul>
      )}

      <label
        htmlFor={inputId}
        className={cn(
          'flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-rentify-outline/50 px-3 py-2 text-sm font-medium text-rentify-primary transition-colors hover:bg-rentify-primary-container/30',
          isDisabled && 'pointer-events-none opacity-50',
        )}
      >
        {isUploading ? (
          <>
            <LoadingSpinner size="sm" color="primary" />
            <span>{t('attachments.uploading', { progress: upload.progress })}</span>
          </>
        ) : (
          <>
            <Paperclip className="h-4 w-4" aria-hidden="true" />
            <span>{t('attachments.add')}</span>
          </>
        )}
      </label>
      <input
        id={inputId}
        type="file"
        multiple
        className="sr-only"
        accept={getMediaAccept(purpose)}
        disabled={isDisabled}
        onChange={(event) => void handleSelect(event)}
      />
      {helperText && <p className="text-xs text-rentify-text-secondary">{helperText}</p>}
    </div>
  );
};
