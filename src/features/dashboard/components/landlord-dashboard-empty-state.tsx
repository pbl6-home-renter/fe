import { useTranslation } from 'react-i18next';
import { Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export interface LandlordDashboardEmptyStateProps {
  onOpenCreateModal?: () => void;
}

export const LandlordDashboardEmptyState = ({
  onOpenCreateModal,
}: LandlordDashboardEmptyStateProps) => {
  const { t } = useTranslation('dashboard');

  return (
    <div className="w-full max-w-2xl mx-auto py-16 px-4">
      <Card className="border border-rentify-divider bg-rentify-surface p-8 sm:p-12 text-center flex flex-col items-center gap-5 shadow-xs rounded-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rentify-primary-container/20 text-rentify-primary flex items-center justify-center">
          <Building2 className="w-8 h-8" />
        </div>

        <div className="space-y-2 max-w-md">
          <h1 className="text-2xl font-bold text-rentify-text-primary tracking-tight">
            {t('empty.welcomeTitle')}
          </h1>
          <p className="text-sm text-rentify-text-secondary leading-relaxed">
            {t('empty.welcomeDesc')}
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onOpenCreateModal}
          className="gap-2 shadow-xs mt-2"
        >
          <Plus className="w-4 h-4" />
          <span>{t('empty.addFirstBuilding')}</span>
        </Button>
      </Card>
    </div>
  );
};
