import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils/cn';
import type { ContractStatus } from '../enums/contract-status.enum';
import { CONTRACT_STATUS_CONFIG } from '../constants/contract.constants';

export interface ContractStatusBadgeProps {
  status: ContractStatus | string;
  variant?: 'dot' | 'pill';
  className?: string;
}

export const ContractStatusBadge = ({
  status,
  variant = 'pill',
  className,
}: ContractStatusBadgeProps) => {
  const { t } = useTranslation('contracts');
  const config =
    CONTRACT_STATUS_CONFIG[status as ContractStatus] || {
      labelKey: 'status.draft',
      dotClass: 'bg-rentify-outline',
      pillClass: 'bg-rentify-surface-container-low text-rentify-text-secondary border-rentify-outline/30',
    };

  const label = t(config.labelKey);

  if (variant === 'pill') {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border',
          config.pillClass,
          className
        )}
      >
        <span className={cn('w-1.5 h-1.5 rounded-full', config.dotClass)} />
        <span>{label}</span>
      </span>
    );
  }

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <span className={cn('w-[7px] h-[7px] rounded-full shrink-0', config.dotClass)} />
      <span className="text-xs font-medium text-rentify-text-primary">{label}</span>
    </div>
  );
};
