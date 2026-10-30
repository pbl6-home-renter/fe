import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useDeleteBuildingMutation } from '../hooks/use-delete-building-mutation';

interface DeleteBuildingDialogProps {
  open: boolean;
  onClose: () => void;
  buildingId: string;
  buildingName: string;
}

export const DeleteBuildingDialog = ({
  open,
  onClose,
  buildingId,
  buildingName,
}: DeleteBuildingDialogProps) => {
  const { t } = useTranslation('buildings');
  const navigate = useNavigate();

  const deleteMutation = useDeleteBuildingMutation();

  const handleDelete = () => {
    deleteMutation.mutate(buildingId, {
      onSuccess: () => {
        onClose();
        navigate('/buildings', { replace: true });
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t('delete.title')}
      maxWidth="sm"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={deleteMutation.isPending}
          >
            {t('cancel')}
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            isLoading={deleteMutation.isPending}
            disabled={deleteMutation.isPending}
          >
            {t('delete.confirmAction')}
          </Button>
        </div>
      }
    >
      <div className="flex items-start gap-3 py-2">
        <div className="w-10 h-10 rounded-full bg-red-50 text-rentify-error flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-rentify-text-primary">
            {t('delete.confirmation', { name: buildingName })}
          </p>
          <p className="text-xs text-rentify-text-secondary">
            {t('delete.warning')}
          </p>
        </div>
      </div>
    </Dialog>
  );
};
