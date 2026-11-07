import { useState } from 'react';
import { useMediaObjectUrl } from '@/features/media/hooks/use-media-object-url-query';
import { MEDIA_API_ROUTES } from '@/features/media/constants/media.constants';

export const useChatImage = (mediaId: string) => {
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const media = useMediaObjectUrl(MEDIA_API_ROUTES.BY_ID(mediaId), { signedDownload: true });

  return {
    ...media,
    isPreviewOpen,
    openPreview: () => setPreviewOpen(true),
    closePreview: () => setPreviewOpen(false),
  };
};
