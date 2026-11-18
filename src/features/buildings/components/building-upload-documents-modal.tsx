import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { OwnershipProofUploader } from './ownership-proof-uploader';

export interface BuildingUploadDocumentsModalProps {
  open: boolean;
  onClose: () => void;
  buildingId: string;
  onSuccess: () => void;
}

export const BuildingUploadDocumentsModal = ({
  open,
  onClose,
  buildingId,
  onSuccess,
}: BuildingUploadDocumentsModalProps) => {
  const { t } = useTranslation('buildings');
  const [mediaIds, setMediaIds] = useState<string[]>([]);

  const handleDone = () => {
    onSuccess();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      className="max-h-[90vh] overflow-y-auto"
      title={t('detail.uploadDocumentsTitle')}
      description={t('detail.uploadDocumentsDesc')}
    >
      <div className="space-y-6 pt-3">
        <OwnershipProofUploader buildingId={buildingId} mediaIds={mediaIds} onChange={setMediaIds} />

        <div className="pt-4 border-t border-rentify-divider flex items-center justify-between">
          <Button variant="outline" onClick={onClose}>
            {t('cancel')}
          </Button>

          <Button variant="primary" onClick={handleDone} className="gap-2">
            <Check className="w-4 h-4" />
            <span>{t('detail.uploadDone')}</span>
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
