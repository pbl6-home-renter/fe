import { useTranslation } from 'react-i18next';
import { Clock, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BuildingStatus } from '../../enums/building-status.enum';

interface ApprovalStatusTabsProps {
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

export const ApprovalStatusTabs = ({
  selectedStatus,
  onSelectStatus,
}: ApprovalStatusTabsProps) => {
  const { t } = useTranslation('buildings');
  const tabs = [
    { id: BuildingStatus.PENDING, label: t('admin.statusPending'), icon: Clock, color: 'text-rentify-warning' },
    { id: BuildingStatus.APPROVED, label: t('admin.statusApproved'), icon: ShieldCheck, color: 'text-rentify-success' },
    { id: BuildingStatus.REJECTED, label: t('admin.statusRejected'), icon: ShieldAlert, color: 'text-rentify-error' },
  ];

  return (
    <div className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-rentify-divider bg-surface-container-low p-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <Button
            key={tab.id}
            type="button"
            variant={selectedStatus === tab.id ? 'secondary' : 'ghost'}
            size="sm"
            className="whitespace-nowrap px-3.5 text-xs"
            onClick={() => onSelectStatus(tab.id)}
          >
            <Icon className={`h-3.5 w-3.5 ${tab.color}`} />
            <span>{tab.label}</span>
          </Button>
        );
      })}
    </div>
  );
};
