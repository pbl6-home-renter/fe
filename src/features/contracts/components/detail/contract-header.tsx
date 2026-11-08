import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Edit3, FileText, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes.config';
import { ContractStatusBadge } from '../contract-status-badge';
import { ContractStatus } from '../../enums/contract-status.enum';
import type { ContractDetailDto } from '../../types/contract.dto';

interface ContractHeaderProps {
  contract: ContractDetailDto;
  onEdit: () => void;
  onCheckout?: () => void;
}

export const ContractHeader = ({ contract, onEdit, onCheckout }: ContractHeaderProps) => {
  const { t } = useTranslation('contracts');
  const navigate = useNavigate();

  const isDraft = contract.status === ContractStatus.DRAFT;
  const isActive = contract.status === ContractStatus.ACTIVE;

  const code = `HD-${contract.id.slice(0, 6).toUpperCase()}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-rentify-text-secondary">
        <button
          type="button"
          onClick={() => navigate(ROUTES.LANDLORD.CONTRACTS)}
          className="inline-flex cursor-pointer items-center gap-1.5 font-medium transition-colors hover:text-rentify-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{t('detail.backToList')}</span>
        </button>
      </div>

      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-rentify-divider bg-rentify-surface p-5 shadow-xs md:flex-row md:items-center">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rentify-primary-container text-rentify-primary">
              <FileText className="h-4 w-4" />
            </div>
            <h1 className="truncate text-xl font-bold tracking-tight text-rentify-text-primary">{code}</h1>
            <ContractStatusBadge status={contract.status} />
          </div>
          <p className="text-xs text-rentify-text-secondary">
            {contract.roomName ? `${contract.roomName} • ` : ''}
            {contract.tenantName ? `${contract.tenantName} (${contract.tenantPhone || '—'})` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isDraft && (
            <Button variant="secondary" size="sm" onClick={onEdit} className="gap-1.5">
              <Edit3 className="h-4 w-4" />
              <span>{t('editContract')}</span>
            </Button>
          )}

          {isActive && (
            <>
              <Button variant="secondary" size="sm" onClick={onEdit} className="gap-1.5">
                <Edit3 className="h-4 w-4" />
                <span>{t('editVehicleAndNotes')}</span>
              </Button>

              {onCheckout && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onCheckout}
                  className="gap-1.5 text-rentify-error hover:text-rentify-error hover:border-rentify-error/40"
                >
                  <LogOut className="h-4 w-4" />
                  <span>{t('actions.checkout')}</span>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
