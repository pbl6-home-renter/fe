import { useTranslation } from 'react-i18next';
import { Clock, ShieldCheck, ShieldAlert } from 'lucide-react';
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
    {
      id: BuildingStatus.PENDING,
      label: t('admin.statusPending', { defaultValue: 'Chờ thẩm định' }),
      icon: Clock,
      iconColor: 'text-rentify-warning',
    },
    {
      id: BuildingStatus.APPROVED,
      label: t('admin.statusApproved', { defaultValue: 'Đã phê duyệt' }),
      icon: ShieldCheck,
      iconColor: 'text-rentify-success',
    },
    {
      id: BuildingStatus.REJECTED,
      label: t('admin.statusRejected', { defaultValue: 'Đã từ chối' }),
      icon: ShieldAlert,
      iconColor: 'text-rentify-error',
    },
  ];

  return (
    <div className="inline-flex items-center p-1 rounded-xl bg-surface-container-low border border-rentify-divider">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = selectedStatus === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectStatus(tab.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isActive
                ? 'bg-rentify-surface text-rentify-text-primary shadow-xs'
                : 'text-rentify-text-secondary hover:text-rentify-text-primary'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Icon className={`w-3.5 h-3.5 ${tab.iconColor}`} />
              <span>{tab.label}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
};
