import { useTranslation } from 'react-i18next';
import { ShieldAlert } from 'lucide-react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ContractDecisionItem } from './contract-decision-item';
import { ContractTerminateConfirmDialog } from './contract-terminate-confirm-dialog';
import { useContractLockDecision } from '../../hooks/use-contract-lock-decision';

interface ContractLockDecisionDialogProps {
  open: boolean;
  onClose: () => void;
  lockCycleId: string | null;
  contractIds: string[];
  onDecisionCompleted?: () => void;
}

export const ContractLockDecisionDialog = ({
  open,
  onClose,
  lockCycleId,
  contractIds,
  onDecisionCompleted,
}: ContractLockDecisionDialogProps) => {
  const { t } = useTranslation('contracts');
  const {
    decidedResults,
    pendingContractId,
    terminateCandidateId,
    setTerminateCandidateId,
    handleRestore,
    handleConfirmTerminate,
    isTerminating,
  } = useContractLockDecision({ lockCycleId, onDecisionCompleted });

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        title={
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rentify-primary/10 text-rentify-primary">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-rentify-text-primary">{t('lockDecision.dialogTitle')}</h3>
              <p className="text-xs text-rentify-text-secondary">{t('lockDecision.dialogDescription')}</p>
            </div>
          </div>
        }
        footer={
          <div className="flex w-full items-center justify-end">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              {t('lockDecision.cancelBtn')}
            </Button>
          </div>
        }
      >
        <div className="max-h-[60vh] space-y-3 overflow-y-auto py-2">
          {contractIds.map((id) => (
            <ContractDecisionItem
              key={id}
              contractId={id}
              decidedResult={decidedResults[id]}
              isProcessing={pendingContractId === id}
              onRestore={handleRestore}
              onRequestTerminate={(targetId) => setTerminateCandidateId(targetId)}
            />
          ))}
        </div>
      </Dialog>

      <ContractTerminateConfirmDialog
        open={terminateCandidateId !== null}
        onClose={() => setTerminateCandidateId(null)}
        onConfirm={handleConfirmTerminate}
        isTerminating={isTerminating}
      />
    </>
  );
};
