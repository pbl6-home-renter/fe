import { useState } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Download, ImageOff, X, ZoomIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/feedback/skeleton';
import { cn } from '@/lib/utils/cn';
import { useChatImage } from '../hooks/use-chat-image';

interface ChatImageProps {
  mediaId: string;
  /** Corner classes so the image follows the bubble cluster shape. */
  className?: string;
}

export const ChatImage = ({ mediaId, className }: ChatImageProps) => {
  const { src, isLoading, error, isPreviewOpen, openPreview, closePreview } = useChatImage(mediaId);
  const { t } = useTranslation('chat');
  const [loaded, setLoaded] = useState(false);
  const frame = cn('overflow-hidden rounded-[18px]', className);

  if (isLoading) return <Skeleton className={cn('h-48 w-64 max-w-full', frame)} />;
  if (error || !src) {
    return (
      <div
        className={cn(
          'flex h-32 w-56 max-w-full flex-col items-center justify-center gap-2 bg-rentify-surface text-xs text-rentify-text-secondary ring-1 ring-rentify-divider',
          frame,
        )}
      >
        <ImageOff className="h-5 w-5" aria-hidden="true" />
        {t('imageUnavailable')}
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={openPreview}
        aria-label={t('viewImage')}
        className={cn(
          'group/image relative block cursor-zoom-in bg-rentify-surface ring-1 ring-black/5 outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary',
          frame,
        )}
      >
        {!loaded && <Skeleton className="absolute inset-0 rounded-none" />}
        <img
          src={src}
          alt={t('photoSent')}
          onLoad={() => setLoaded(true)}
          className={cn(
            'block h-auto max-h-80 w-auto max-w-[min(18rem,60vw)] min-w-32 object-cover transition-opacity duration-300',
            loaded ? 'opacity-100' : 'min-h-40 opacity-0',
          )}
        />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover/image:bg-black/20">
          <ZoomIn
            className="h-7 w-7 text-white opacity-0 drop-shadow transition-opacity duration-200 group-hover/image:opacity-100"
            aria-hidden="true"
          />
        </span>
      </button>
      <ChatImageLightbox open={isPreviewOpen} onClose={closePreview} src={src} />
    </>
  );
};

const ChatImageLightbox = ({ open, onClose, src }: { open: boolean; onClose: () => void; src: string }) => {
  const { t } = useTranslation('chat');
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="chat-lightbox-fade fixed inset-0 z-50 bg-[#0b1220]/90 backdrop-blur-sm" />
        <DialogPrimitive.Content
          className="chat-lightbox-zoom fixed inset-0 z-50 flex items-center justify-center p-4 outline-none sm:p-10"
          onClick={onClose}
        >
          <DialogPrimitive.Title className="sr-only">{t('photoSent')}</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">{t('viewImage')}</DialogPrimitive.Description>
          <img
            src={src}
            alt={t('photoSent')}
            onClick={(event) => event.stopPropagation()}
            className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
          />
          <div className="absolute right-4 top-4 flex gap-2" onClick={(event) => event.stopPropagation()}>
            <a
              href={src}
              download
              aria-label={t('downloadImage')}
              title={t('downloadImage')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Download className="h-5 w-5" aria-hidden="true" />
            </a>
            <DialogPrimitive.Close
              aria-label={t('closeImage')}
              title={t('closeImage')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
