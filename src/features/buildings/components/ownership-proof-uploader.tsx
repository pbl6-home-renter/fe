import { useTranslation } from 'react-i18next';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { cn } from '@/lib/utils/cn';
import { getMediaAccept } from '@/features/media/constants/media.constants';
import { MediaPurpose } from '@/features/media/types/media.dto';
import type { OwnershipProofUploaderProps } from '../types/ownership-proof.types';
import { useOwnershipProofUploader } from '../hooks/use-ownership-proof-uploader';

export const OwnershipProofUploader = ({
  onChange,
  disabled = false,
}: OwnershipProofUploaderProps) => {
  const { t } = useTranslation('buildings');
  const {
    items,
    fileInputRef,
    handleFiles,
    handleInputChange,
    handleRemove,
    handleRetry,
    triggerBrowse,
  } = useOwnershipProofUploader({ onChange });

  return (
    <div className="space-y-4">
      <div
        onClick={() => !disabled && triggerBrowse()}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          if (!disabled && e.dataTransfer.files) {
            handleFiles(e.dataTransfer.files);
          }
        }}
        className={cn(
          'border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition cursor-pointer select-none',
          disabled
            ? 'opacity-50 cursor-not-allowed border-rentify-border'
            : 'border-rentify-divider hover:border-rentify-primary hover:bg-rentify-primary/5 bg-surface-container-low/50'
        )}
      >
        <div className="w-12 h-12 rounded-full bg-rentify-primary/10 text-rentify-primary flex items-center justify-center mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-medium text-rentify-text-primary mb-1">
          {t('uploader.dragDropOrBrowse')}
        </h4>
        <p className="text-xs text-rentify-text-secondary max-w-sm mb-3">
          {t('uploader.supportedTypes')}
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            triggerBrowse();
          }}
        >
          {t('uploader.selectFiles')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={getMediaAccept(MediaPurpose.OWNERSHIP_PROOF)}
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled}
        />
      </div>

      {items.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-rentify-text-secondary uppercase tracking-wider">
            {t('uploader.uploadedFiles', { count: items.length })}
          </p>
          <div className="space-y-2">
            {items.map((item) => {
              const isPdf = item.file.type === 'application/pdf';
              const sizeInMb = (item.file.size / (1024 * 1024)).toFixed(2);

              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-rentify-border bg-white text-sm"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="w-8 h-8 rounded bg-surface-container-low flex items-center justify-center shrink-0 text-rentify-text-secondary">
                      {isPdf ? (
                        <FileText className="w-4 h-4 text-rentify-error" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-rentify-primary" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-rentify-text-primary truncate">
                        {item.file.name}
                      </p>
                      <p className="text-[11px] text-rentify-text-secondary">
                        {sizeInMb} MB
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.status === 'uploading' && (
                      <span className="text-xs text-rentify-primary animate-pulse flex items-center gap-1">
                        {t('uploader.statusUploading')}
                      </span>
                    )}

                    {item.status === 'completed' && (
                      <span className="text-xs text-rentify-success flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        {t('uploader.statusCompleted')}
                      </span>
                    )}

                    {item.status === 'error' && (
                      <span className="text-xs text-rentify-error flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {t('uploader.statusError')}
                      </span>
                    )}

                    {item.status === 'error' && (
                      <IconButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={t('uploader.retry')}
                        onClick={() => handleRetry(item)}
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-rentify-text-secondary" />
                      </IconButton>
                    )}

                    <IconButton
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={t('uploader.remove')}
                      onClick={() => handleRemove(item.id)}
                      disabled={disabled}
                    >
                      <X className="w-3.5 h-3.5 text-rentify-text-secondary hover:text-rentify-error" />
                    </IconButton>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
