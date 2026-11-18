import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BuildingInfoForm } from './building-info-form';
import { useBuildingForm } from '../forms/use-building-form';

export interface BuildingCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (buildingId: string) => void;
}

export const BuildingCreateModal = ({ open, onClose, onSuccess }: BuildingCreateModalProps) => {
  const { t } = useTranslation('buildings');

  const { form, handleSubmit, reset, isSubmitting } = useBuildingForm({
    onSuccess: (id) => {
      reset();
      onClose();
      onSuccess?.(id);
    },
  });

  const handleClose = () => {
    if (isSubmitting) return;
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="2xl"
      className="max-h-[90vh] overflow-y-auto"
      title={t('create.title')}
      description={t('create.subtitle')}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSubmit();
        }}
        className="space-y-6 pt-2"
      >
        <BuildingInfoForm form={form} disabled={isSubmitting} />

        <div className="pt-4 border-t border-rentify-divider flex items-center justify-between">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
            {t('cancel')}
          </Button>

          <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting} className="gap-2">
            <Plus className="w-4 h-4" />
            <span>{t('wizard.createAction')}</span>
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
