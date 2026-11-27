import { useTranslation } from 'react-i18next';
import { Edit3, LogOut, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BackLink } from '@/components/ui/back-link';
import { ROUTES } from '@/config/routes.config';
import { ContractStatusBadge } from '../contract-status-badge';
import { ContractStatus } from '../../enums/contract-status.enum';
import type { ContractDetailDto } from '../../types/contract.dto';

interface ContractHeaderProps {
  contract: ContractDetailDto;
  onEdit?: () => void;
  onCheckout?: () => void;
  onOpenChat?: () => void;
  isChatLoading?: boolean;
}

export const ContractHeader = ({
  contract,
  onEdit,
  onCheckout,
  onOpenChat,
  isChatLoading = false,
}: ContractHeaderProps) => {
  const { t } = useTranslation('contracts');

  const isDraft = contract.status === ContractStatus.DRAFT;
  const isActive = contract.status === ContractStatus.ACTIVE;

  const code = `HD-${contract.id.slice(0, 6).toUpperCase()}`;

  return (
    <div className="space-y-4">
      <BackLink to={ROUTES.LANDLORD.CONTRACTS}>{t('detail.backToList')}</BackLink>

      <Card className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-rentify-text-primary truncate">{code}</h1>
            <ContractStatusBadge status={contract.status} />
          </div>
          <p className="text-xs text-rentify-text-secondary">
            {contract.roomName ? `${contract.roomName} • ` : ''}
            {contract.tenantName ? `${contract.tenantName} (${contract.tenantPhone || '—'})` : ''}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenChat && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onOpenChat}
              isLoading={isChatLoading}
              className="gap-1.5 text-rentify-primary border-rentify-primary/30 hover:bg-rentify-primary/5"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{t('actions.contractChat')}</span>
            </Button>
          )}

          {isDraft && onEdit && (
            <Button variant="secondary" size="sm" onClick={onEdit} className="gap-1.5">
              <Edit3 className="h-4 w-4" />
              <span>{t('editContract')}</span>
            </Button>
          )}

          {isActive && (
            <>
              {onEdit && (
                <Button variant="secondary" size="sm" onClick={onEdit} className="gap-1.5">
                  <Edit3 className="h-4 w-4" />
                  <span>{t('editVehicleAndNotes')}</span>
                </Button>
              )}

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
      </Card>
    </div>
  );
};
