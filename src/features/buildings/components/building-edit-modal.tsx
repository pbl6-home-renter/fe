import { useTranslation } from 'react-i18next';
import { Save } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BuildingInfoForm } from './building-info-form';
import { useBuildingEditForm } from '../forms/use-building-edit-form';
import type { BuildingMyDetailDto } from '../types/building.dto';

export interface BuildingEditModalProps {
  open: boolean;
  onClose: () => void;
  building?: BuildingMyDetailDto;
  onSuccess?: () => void;
}

export const BuildingEditModal = ({
  open,
  onClose,
  building,
  onSuccess,
}: BuildingEditModalProps) => {
  const { t } = useTranslation('buildings');

  const { form, isApproved, isSubmitting, handleSubmit } = useBuildingEditForm({
    building,
    onSuccess: () => {
      onClose();
      onSuccess?.();
    },
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      className="max-h-[90vh] overflow-y-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="border-b border-rentify-divider pb-3">
          <h2 className="text-xl font-bold text-rentify-text-primary tracking-tight">
            {t('edit.title')}
          </h2>
          <p className="text-xs text-rentify-text-secondary mt-1">
            {isApproved ? t('edit.lockedNotice') : t('edit.description')}
          </p>
        </div>

        <BuildingInfoForm
          form={form}
          isApproved={isApproved}
          disabled={isSubmitting}
        />

        <div className="flex items-center justify-between border-t border-rentify-divider pt-4">
          <Button
            variant="outline"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="border-rentify-divider"
          >
            {t('cancel')}
          </Button>

          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{t('save')}</span>
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
