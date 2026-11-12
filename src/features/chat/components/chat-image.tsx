import { Dialog } from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/feedback/skeleton';
import { useChatImage } from '../hooks/use-chat-image';

export const ChatImage = ({ mediaId }: { mediaId: string }) => {
  const { src, isLoading, error, isPreviewOpen, openPreview, closePreview } = useChatImage(mediaId);
  const { t } = useTranslation('chat');
  if (isLoading) return <Skeleton className="h-40 w-56" />;
  if (error || !src) return <span className="text-xs text-rentify-text-secondary">{t('photoSent')}</span>;
  return (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={openPreview}
        className="h-40 w-56 min-h-0 overflow-hidden rounded-xl bg-rentify-background p-0"
        aria-label={t('viewImage')}
      >
        <img src={src} alt={t('photoSent')} className="h-40 w-56 cursor-zoom-in object-cover" />
      </Button>
      <Dialog open={isPreviewOpen} onClose={closePreview} title={t('photoSent')} maxWidth="3xl" className="p-3">
        <img src={src} alt={t('photoSent')} className="max-h-[75vh] w-auto max-w-full object-contain" />
      </Dialog>
    </>
  );
};
