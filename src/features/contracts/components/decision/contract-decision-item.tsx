import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, XCircle, ExternalLink, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/feedback/skeleton';
import { formatDate } from '@/lib/utils/format';
import { ROUTES } from '@/config/routes.config';
import { ContractStatus } from '../../enums/contract-status.enum';
import { ContractStatusBadge } from '../contract-status-badge';
import { useContractQuery } from '../../hooks/use-contract-query';
import type { ContractLockDecisionResponseDto } from '../../types/contract.dto';

interface ContractDecisionItemProps {
  contractId: string;
  decidedResult?: ContractLockDecisionResponseDto;
  isProcessing: boolean;
  onRestore: (contractId: string) => void;
  onRequestTerminate: (contractId: string) => void;
}

export const ContractDecisionItem = ({
  contractId,
  decidedResult,
  isProcessing,
  onRestore,
  onRequestTerminate,
}: ContractDecisionItemProps) => {
  const { t } = useTranslation('contracts');
  const { data: contract, isLoading, isError } = useContractQuery(contractId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-rentify-outline/30 p-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-40 rounded-md" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    );
  }

  if (isError || !contract) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-rentify-outline/30 bg-rentify-surface-container-low p-4 text-sm text-rentify-text-secondary">
        <span>{contractId}</span>
        <span className="text-xs text-rentify-danger">{t('lockDecision.loadError')}</span>
      </div>
    );
  }

  const roomDisplay = contract.roomName || contract.roomId;
  const isDecided = Boolean(decidedResult);
  const currentStatus = decidedResult?.status ?? contract.status;
  const isSuspended = !isDecided && contract.status === ContractStatus.SUSPENDED;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-rentify-outline/30 bg-rentify-surface p-4 transition-all sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-rentify-text-primary">
            {t('lockDecision.room', {
              roomNumber: roomDisplay,
            })}
          </span>
          <ContractStatusBadge status={currentStatus} />
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-rentify-text-secondary">
          {contract.tenantName && <span>{t('lockDecision.representativeTenant', { name: contract.tenantName })}</span>}
          <span>{t('lockDecision.startDate', { date: formatDate(contract.startDate) })}</span>
        </div>
      </div>

      <div className="flex flex-col items-start gap-2 sm:items-end">
        {isDecided ? (
          <div className="flex flex-col items-start gap-1 sm:items-end">
            {decidedResult?.status === ContractStatus.ACTIVE ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rentify-success">
                <CheckCircle2 className="h-4 w-4" />
                <span>{t('lockDecision.restoredStatus')}</span>
              </span>
            ) : (
              <div className="flex flex-col items-start gap-1 sm:items-end">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rentify-danger">
                  <XCircle className="h-4 w-4" />
                  <span>{t('lockDecision.terminatedStatus')}</span>
                </span>
                {decidedResult?.handoverRequired && (
                  <Link
                    to={ROUTES.LANDLORD.CONTRACT_DETAIL(contractId)}
                    className="inline-flex items-center gap-1 text-xs font-medium text-rentify-primary hover:underline"
                  >
                    <span>{t('lockDecision.handoverRequiredNote')}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            )}
          </div>
        ) : isSuspended ? (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isProcessing}
              onClick={() => onRestore(contractId)}
            >
              {t('lockDecision.restore')}
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              disabled={isProcessing}
              onClick={() => onRequestTerminate(contractId)}
            >
              {t('lockDecision.terminate')}
            </Button>
          </div>
        ) : (
          <Link
            to={ROUTES.LANDLORD.CONTRACT_DETAIL(contractId)}
            className="inline-flex items-center gap-1 text-xs font-medium text-rentify-primary hover:underline"
          >
            <span>{t('lockDecision.viewContract')}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  );
};
