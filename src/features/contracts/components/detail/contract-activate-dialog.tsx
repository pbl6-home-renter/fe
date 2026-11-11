import { useTranslation } from 'react-i18next';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ContractActivateDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isActivating: boolean;
}

export const ContractActivateDialog = ({ open, onClose, onConfirm, isActivating }: ContractActivateDialogProps) => {
  const { t } = useTranslation('contracts');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rentify-warning/10 text-rentify-warning">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-rentify-text-primary">{t('detail.activateDialogTitle')}</h3>
          </div>
        </div>
      }
      footer={
        <div className="flex w-full items-center justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isActivating}>
            {t('detail.activateDialogCancel')}
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={onConfirm}
            isLoading={isActivating}
            disabled={isActivating}
            className="gap-1.5"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{t('detail.activateDialogConfirm')}</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-3 py-2 text-sm text-rentify-text-secondary">
        <p>{t('detail.activateDialogDesc')}</p>
        <div className="rounded-xl border border-rentify-warning/20 bg-rentify-warning/10 p-3 text-xs text-rentify-text-primary">
          {t('detail.activateDialogWarning')}
        </div>
      </div>
    </Dialog>
  );
};
