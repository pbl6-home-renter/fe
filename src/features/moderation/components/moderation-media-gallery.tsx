import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, ImageOff } from 'lucide-react';
import { Skeleton } from '@/components/feedback/skeleton';
import { MEDIA_API_ROUTES } from '@/features/media/constants/media.constants';
import { useMediaObjectUrl } from '@/features/media/hooks/use-media-object-url-query';

const MediaTile = ({ mediaId, index }: { mediaId: string; index: number }) => {
  const { t } = useTranslation('moderation');
  // Private files are read through the signed download-url flow (admin bypass).
  const { src, isLoading, error } = useMediaObjectUrl(MEDIA_API_ROUTES.BY_ID(mediaId), { signedDownload: true });
  const [isImage, setIsImage] = useState(true);
  const label = t('attachments.fileLabel', { index: index + 1 });

  if (isLoading) {
    return <Skeleton className="h-24 w-24 rounded-xl" />;
  }

  if (error || !src) {
    return (
      <div className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border border-rentify-divider bg-rentify-surface-container-low p-2 text-center text-xs text-rentify-text-secondary">
        <ImageOff className="h-5 w-5" aria-hidden="true" />
        <span>{t('attachments.loadFailed')}</span>
      </div>
    );
  }

  return (
    <a
      href={src}
      target="_blank"
      rel="noreferrer"
      title={label}
      className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border border-rentify-divider bg-rentify-surface-container-low transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary"
    >
      {isImage ? (
        <img src={src} alt={label} className="h-full w-full object-cover" onError={() => setIsImage(false)} />
      ) : (
        <span className="flex flex-col items-center gap-1 text-xs text-rentify-text-secondary">
          <FileText className="h-6 w-6 text-rentify-primary" aria-hidden="true" />
          <span>{label}</span>
        </span>
      )}
    </a>
  );
};

export const ModerationMediaGallery = ({ mediaIds }: { mediaIds: string[] }) => {
  const { t } = useTranslation('moderation');

  if (mediaIds.length === 0) {
    return <p className="text-sm text-rentify-text-secondary">{t('attachments.none')}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {mediaIds.map((mediaId, index) => (
        <MediaTile key={mediaId} mediaId={mediaId} index={index} />
      ))}
    </div>
  );
};
