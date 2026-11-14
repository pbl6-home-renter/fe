import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/feedback/skeleton';
import { MEDIA_API_ROUTES } from '@/features/media/constants/media.constants';
import { useMediaObjectUrl } from '@/features/media/hooks/use-media-object-url-query';

export const IssuePhoto = ({ id }: { id: string }) => {
  const { t } = useTranslation('issues');
  const photo = useMediaObjectUrl(MEDIA_API_ROUTES.BY_ID(id));
  if (photo.isLoading) return <Skeleton className="h-36 w-full rounded-xl" />;
  if (!photo.src) return <p className="text-sm text-rentify-error">{t('photoError')}</p>;
  return <img src={photo.src} alt={t('photoAlt')} className="h-36 w-full rounded-xl object-cover" />;
};
