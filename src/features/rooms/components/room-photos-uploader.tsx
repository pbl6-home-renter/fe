import { useRef, useState, useEffect, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { cn } from '@/lib/utils/cn';
import { getMediaAccept } from '@/features/media/constants/media.constants';
import { MediaPurpose } from '@/features/media/types/media.dto';

export interface RoomPhotosUploaderProps {
  photos: File[];
  onAddPhotos: (files: FileList | File[]) => void;
  onRemovePhoto: (index: number) => void;
  error?: string | null;
  disabled?: boolean;
}

interface PhotoThumbnailProps {
  file: File;
  isCover: boolean;
  onRemove: () => void;
  disabled: boolean;
}

const PhotoThumbnail = ({ file, isCover, onRemove, disabled }: PhotoThumbnailProps) => {
  const { t } = useTranslation('rooms');
  const [previewUrl] = useState(() => URL.createObjectURL(file));

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="relative group aspect-square rounded-xl overflow-hidden border border-rentify-divider bg-surface-container-low">
      <img src={previewUrl} alt={file.name} className="w-full h-full object-cover" />
      {isCover && (
        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-rentify-primary text-white shadow-sm">
          {t('uploader.coverBadge')}
        </span>
      )}
      <div className="absolute top-1 right-1 opacity-90 group-hover:opacity-100 transition-opacity">
        <IconButton
          type="button"
          variant="outline"
          size="sm"
          aria-label={t('uploader.removePhoto')}
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="h-6 w-6 rounded-full bg-rentify-surface text-rentify-text-primary hover:bg-rentify-error hover:text-white border-rentify-divider shadow-sm"
        >
          <X className="w-3.5 h-3.5" />
        </IconButton>
      </div>
      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
        <p className="text-[10px] text-white truncate font-medium">{file.name}</p>
      </div>
    </div>
  );
};

export const RoomPhotosUploader = ({
  photos,
  onAddPhotos,
  onRemovePhoto,
  error,
  disabled = false,
}: RoomPhotosUploaderProps) => {
  const { t } = useTranslation('rooms');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddPhotos(e.target.files);
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAddPhotos(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-3 pt-2 border-t border-rentify-divider">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-rentify-text-primary">
            {t('uploader.title')} <span className="text-rentify-error">*</span>
          </label>
          <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rentify-error/10 text-rentify-error border border-rentify-error/20">
            {t('uploader.requiredBadge')}
          </span>
        </div>
        {photos.length > 0 && (
          <span className="text-xs text-rentify-text-secondary">
            {t('uploader.photoCount', { count: photos.length })}
          </span>
        )}
      </div>

      <div
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center transition cursor-pointer select-none',
          error
            ? 'border-rentify-error/60 bg-rentify-error/5'
            : 'border-rentify-divider hover:border-rentify-primary hover:bg-rentify-primary/5 bg-surface-container-low/50',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <div className="w-10 h-10 rounded-full bg-rentify-primary/10 text-rentify-primary flex items-center justify-center mb-2">
          <UploadCloud className="w-5 h-5" />
        </div>
        <p className="text-xs font-medium text-rentify-text-primary mb-1">{t('uploader.dragDropOrBrowse')}</p>
        <p className="text-[11px] text-rentify-text-secondary mb-2">{t('uploader.photosHint')}</p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="text-xs h-7 px-3"
        >
          <ImageIcon className="w-3.5 h-3.5 mr-1" />
          {t('uploader.selectPhotos')}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={getMediaAccept(MediaPurpose.GALLERY_PHOTO)}
          className="hidden"
          onChange={handleInputChange}
          disabled={disabled}
        />
      </div>

      {error && <p className="text-xs text-rentify-error font-medium">{error}</p>}

      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
          {photos.map((file, idx) => (
            <PhotoThumbnail
              key={`${file.name}-${file.size}-${idx}`}
              file={file}
              isCover={idx === 0}
              onRemove={() => onRemovePhoto(idx)}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
};
