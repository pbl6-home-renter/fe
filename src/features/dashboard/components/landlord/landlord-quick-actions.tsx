import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, FileText, Gauge, Plus, Receipt } from 'lucide-react';
import { ROUTES } from '@/config/routes.config';
import { Card } from '@/components/ui/card';

export interface LandlordQuickActionsProps {
  layout?: 'horizontal' | 'vertical';
  onOpenCreateModal?: () => void;
}

export const LandlordQuickActions = ({ layout = 'vertical', onOpenCreateModal }: LandlordQuickActionsProps) => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  const actions = [
    {
      title: t('full.quickMeters'),
      description: t('full.quickMetersDesc'),
      icon: Gauge,
      iconBg: 'bg-primary-container text-rentify-primary',
      onClick: () => navigate(ROUTES.LANDLORD.METER_READINGS),
    },
    {
      title: t('full.quickInvoices'),
      description: t('full.quickInvoicesDesc'),
      icon: Receipt,
      iconBg: 'bg-teal-surface text-teal-primary border border-teal-border',
      onClick: () => navigate(ROUTES.LANDLORD.INVOICES),
    },
    {
      title: t('full.quickContracts'),
      description: t('full.quickContractsDesc'),
      icon: FileText,
      iconBg: 'bg-primary-container text-rentify-primary',
      onClick: () => navigate(ROUTES.LANDLORD.CONTRACTS),
    },
    ...(onOpenCreateModal
      ? [
          {
            title: t('full.addNewBuilding'),
            description: t('empty.addFirstBuilding'),
            icon: Plus,
            iconBg: 'bg-primary-container text-rentify-primary',
            onClick: onOpenCreateModal,
          },
        ]
      : []),
  ];

  if (layout === 'vertical') {
    return (
      <Card className="p-5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex flex-col justify-between h-full space-y-2">
        <h2 className="text-sm font-bold text-rentify-text-primary px-1 pb-1">{t('full.quickActionsTitle')}</h2>

        <div className="space-y-1">
          {actions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={action.onClick}
                className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-rentify-background transition-colors text-left group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${action.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-rentify-text-primary group-hover:text-rentify-primary transition-colors truncate">
                      {action.title}
                    </p>
                    <p className="text-[11px] text-rentify-text-secondary truncate mt-0.5">{action.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-rentify-text-muted group-hover:text-rentify-primary transition-colors shrink-0 ml-2" />
              </button>
            );
          })}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm sm:text-base font-bold text-rentify-text-primary">{t('full.quickActionsTitle')}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Card
              key={idx}
              variant="interactive"
              onClick={action.onClick}
              className="p-4 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs cursor-pointer group flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${action.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-rentify-text-primary group-hover:text-rentify-primary transition-colors truncate">
                    {action.title}
                  </p>
                  <p className="text-[11px] text-rentify-text-secondary truncate mt-0.5">{action.description}</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-rentify-text-muted group-hover:text-rentify-primary transition-colors shrink-0 ml-2" />
            </Card>
          );
        })}
      </div>
    </div>
  );
};
