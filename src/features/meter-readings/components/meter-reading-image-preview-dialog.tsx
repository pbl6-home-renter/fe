import { useTranslation } from 'react-i18next';
import { ImagePreviewDialog } from '@/components/ui/image-preview-dialog';

interface MeterReadingImagePreviewDialogProps {
  open: boolean;
  onClose: () => void;
  imageUrl: string | null;
  title: string;
}

export const MeterReadingImagePreviewDialog = ({
  open,
  onClose,
  imageUrl,
  title,
}: MeterReadingImagePreviewDialogProps) => {
  const { t } = useTranslation('meterReadings');

  return (
    <ImagePreviewDialog
      open={open}
      onClose={onClose}
      imageUrl={imageUrl}
      title={title}
      alt={title}
      closeText={t('actions.close')}
      emptyText={t('warnings.noImageAvailable')}
    />
  );
};
