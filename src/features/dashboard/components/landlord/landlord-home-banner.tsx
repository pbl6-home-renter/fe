import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface LandlordHomeBannerProps {
  userName?: string;
  onOpenCreateModal?: () => void;
  onViewAllBuildings?: () => void;
}

export const LandlordHomeBanner = ({ userName, onOpenCreateModal, onViewAllBuildings }: LandlordHomeBannerProps) => {
  const { t } = useTranslation('dashboard');

  return (
    <div className="relative overflow-hidden rounded-3xl bg-primary-gradient px-6 py-8 sm:px-12 sm:py-12 text-white shadow-card min-h-[180px] sm:min-h-[210px] flex flex-col justify-center">
      {/* Decorative subtle ambient circles matching Tenant Banner */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-white/5 blur-xl" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          {userName && (
            <p className="text-xs sm:text-sm font-medium tracking-wide text-white/80">
              {t('full.greeting', { name: userName })}
            </p>
          )}
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">{t('full.dashboardTitle')}</h1>
          <p className="text-xs sm:text-sm text-white/80 pt-1 leading-relaxed">{t('full.heroSubtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {onViewAllBuildings && (
            <Button
              variant="outline"
              size="sm"
              onClick={onViewAllBuildings}
              className="bg-white/15 text-white hover:bg-white hover:text-primary border-white/20 rounded-full px-5 h-10 text-xs font-bold backdrop-blur-xs shadow-xs transition-all"
            >
              <span>{t('full.viewAllBuildings')}</span>
            </Button>
          )}

          {onOpenCreateModal && (
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenCreateModal}
              className="bg-white text-primary hover:bg-white/95 rounded-full px-5 h-10 text-xs font-extrabold gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 text-primary" />
              <span>{t('full.addNewBuilding')}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
