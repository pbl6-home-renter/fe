import { useQuery } from '@tanstack/react-query';
import { Download, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/feedback/skeleton';
import { mediaApi } from '@/features/media/api/media.api';
import { useMediaObjectUrl } from '@/features/media/hooks/use-media-object-url-query';
import { MEDIA_API_ROUTES } from '@/features/media/constants/media.constants';
import { useChatLocalImagePreview } from '../hooks/use-chat-local-image-preview';
import { ChatImage } from './chat-image';

interface ChatAttachmentProps {
  type: 'image' | 'video' | 'file';
  mediaId?: string;
  file?: File;
  className?: string;
}

export const ChatAttachment = ({ type, mediaId, file, className }: ChatAttachmentProps) => {
  const { t } = useTranslation('chat');
  const localUrl = useChatLocalImagePreview(file);
  const query = useQuery({
    queryKey: ['chat', 'attachment', mediaId],
    queryFn: ({ signal }) => mediaApi.getChatDownload(mediaId!, { signal }),
    enabled: !!mediaId && type !== 'image',
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });
  if (type === 'image' && mediaId) return <ChatImage mediaId={mediaId} className={className} />;
  if (type === 'image' && localUrl) return <img src={localUrl} alt={t('photoSent')} className="max-h-72 max-w-[min(18rem,60vw)] rounded-xl object-cover" />;
  if (type === 'image') return null;
  if (query.isLoading && mediaId) return <Skeleton className="h-20 w-48 rounded-xl" />;
  if (query.isError) return <Button variant="outline" onClick={() => void query.refetch()}>{t('fileUnavailable')} · {t('retryFile')}</Button>;
  const src = localUrl ?? query.data?.url;
  const name = file?.name ?? query.data?.fileName;
  if (!src) return null;
  return <FileAttachment type={type} mediaId={mediaId} localUrl={localUrl} name={name} />;
};

const FileAttachment = ({ type, mediaId, localUrl, name }: { type: 'video' | 'file'; mediaId?: string; localUrl?: string; name?: string }) => {
  const { t } = useTranslation('chat');
  const media = useMediaObjectUrl(mediaId ? MEDIA_API_ROUTES.BY_ID(mediaId) : undefined, { signedDownload: true });
  const src = localUrl ?? media.src;
  if (!src) return media.error ? <Button variant="outline" onClick={() => void media.refetch()}>{t('fileUnavailable')} · {t('retryFile')}</Button> : <Skeleton className="h-20 w-48 rounded-xl" />;
  if (type === 'video') return <video controls preload="metadata" src={src} className="max-h-80 max-w-[min(18rem,60vw)] rounded-xl" />;
  return (
    <div className="flex max-w-full items-center gap-3 rounded-xl bg-rentify-surface p-3 text-rentify-text-primary ring-1 ring-rentify-divider">
      <FileText className="h-6 w-6 shrink-0" aria-hidden="true" />
      <div className="min-w-0">
        <p className="truncate text-sm" title={name}>{name}</p>
        <a className="text-sm text-rentify-primary underline" href={src} target="_blank" rel="noopener noreferrer">{t('openFile')}</a>
      </div>
      <a href={src} download={name} aria-label={t('downloadFile')} title={t('downloadFile')} className="shrink-0 text-rentify-primary"><Download className="h-5 w-5" /></a>
    </div>
  );
};
