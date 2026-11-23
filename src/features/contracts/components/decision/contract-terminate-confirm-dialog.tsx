import { useTranslation } from 'react-i18next';
import { AlertTriangle, AlertOctagon } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ContractTerminateConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isTerminating: boolean;
}

export const ContractTerminateConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  isTerminating,
}: ContractTerminateConfirmDialogProps) => {
  const { t } = useTranslation('contracts');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      title={
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rentify-danger/10 text-rentify-danger">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-rentify-text-primary">{t('lockDecision.confirmTerminateTitle')}</h3>
        </div>
      }
      footer={
        <div className="flex w-full items-center justify-end gap-2">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isTerminating}>
            {t('lockDecision.cancelBtn')}
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isTerminating}
            disabled={isTerminating}
            className="gap-1.5"
          >
            <AlertOctagon className="h-4 w-4" />
            <span>{t('lockDecision.confirmTerminateBtn')}</span>
          </Button>
        </div>
      }
    >
      <div className="space-y-3 py-2 text-sm text-rentify-text-secondary">
        <p>{t('lockDecision.confirmTerminateDesc')}</p>
      </div>
    </Dialog>
  );
};
