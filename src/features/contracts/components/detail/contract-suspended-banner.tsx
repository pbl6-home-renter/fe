import { useTranslation } from 'react-i18next';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ContractStatus } from '../../enums/contract-status.enum';
import { ContractTerminateConfirmDialog } from '../decision/contract-terminate-confirm-dialog';
import { useContractSuspendedDecision } from '../../hooks/use-contract-suspended-decision';
import type { ContractDetailDto } from '../../types/contract.dto';

interface ContractSuspendedBannerProps {
  contract: ContractDetailDto;
  onRefresh?: () => void;
}

export const ContractSuspendedBanner = ({ contract, onRefresh }: ContractSuspendedBannerProps) => {
  const { t } = useTranslation('contracts');
  const {
    isTerminateOpen,
    setIsTerminateOpen,
    decidedResult,
    detectedLockCycleId,
    handleRestore,
    handleConfirmTerminate,
    isProcessing,
  } = useContractSuspendedDecision(contract, onRefresh);

  if (contract.status !== ContractStatus.SUSPENDED && !decidedResult) {
    return null;
  }

  return (
    <>
      <div className="flex flex-col gap-4 rounded-2xl border border-rentify-warning/30 bg-rentify-warning/10 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rentify-warning/20 text-rentify-warning">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-rentify-text-primary">{t('lockDecision.bannerTitle')}</h4>
            <p className="text-xs text-rentify-text-secondary">
              {detectedLockCycleId ? t('lockDecision.bannerDescWaiting') : t('lockDecision.bannerDescSuspended')}
            </p>
            {decidedResult?.handoverRequired && (
              <p className="text-xs font-semibold text-rentify-danger">{t('lockDecision.handoverRequiredNote')}</p>
            )}
          </div>
        </div>

        {decidedResult ? (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rentify-success">
            <CheckCircle2 className="h-4 w-4" />
            <span>
              {decidedResult.status === ContractStatus.ACTIVE
                ? t('lockDecision.restoredStatus')
                : t('lockDecision.terminatedStatus')}
            </span>
          </div>
        ) : detectedLockCycleId ? (
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" disabled={isProcessing} onClick={handleRestore}>
              {t('lockDecision.restore')}
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              disabled={isProcessing}
              onClick={() => setIsTerminateOpen(true)}
            >
              {t('lockDecision.terminate')}
            </Button>
          </div>
        ) : null}
      </div>

      <ContractTerminateConfirmDialog
        open={isTerminateOpen}
        onClose={() => setIsTerminateOpen(false)}
        onConfirm={handleConfirmTerminate}
        isTerminating={isProcessing}
      />
    </>
  );
};
