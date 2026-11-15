import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, ArrowRight, Gauge, Plus, Receipt } from 'lucide-react';
import { ROUTES } from '@/config/routes.config';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { BuildingMyListItemDto } from '@/features/buildings/types/building.dto';
import { LandlordKpiGrid } from './landlord/landlord-kpi-grid';
import { LandlordBuildingCard } from './landlord/landlord-building-card';

export interface LandlordDashboardFullStateProps {
  buildings: BuildingMyListItemDto[];
  metrics: { total: number; active: number; pending: number; others: number | null };
  onOpenCreateModal?: () => void;
}

export const LandlordDashboardFullState = ({
  buildings,
  metrics,
  onOpenCreateModal,
}: LandlordDashboardFullStateProps) => {
  const { t } = useTranslation('dashboard');
  const { user } = useAuth();
  const navigate = useNavigate();

  const userName = user?.name?.trim().split(' ').slice(-1)[0] || user?.name || '';

  return (
    <div className="space-y-8 pb-10 w-full max-w-[1440px] mx-auto">
      {/* 1. Hero Gradient Banner for Landlord */}
      <div className="relative overflow-hidden rounded-3xl bg-primary-gradient px-6 py-8 sm:px-10 sm:py-10 text-white shadow-card">
        <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-white/5 blur-xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            {userName && (
              <span className="text-xs sm:text-sm font-medium tracking-wide text-white/80">
                {t('full.greeting', { name: userName })}
              </span>
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {t('full.dashboardTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed pt-1">{t('full.heroSubtitle')}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(ROUTES.LANDLORD.BUILDINGS)}
              className="bg-white/10 text-white hover:bg-white hover:text-primary border-white/30 rounded-xl px-4 text-xs font-semibold backdrop-blur-xs"
            >
              <span>{t('full.viewAllBuildings')}</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={onOpenCreateModal}
              className="bg-white text-primary hover:bg-white/95 rounded-xl px-4 text-xs font-bold gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4 text-primary" />
              <span>{t('full.addNewBuilding')}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 2. KPI Metrics Grid */}
      <LandlordKpiGrid metrics={metrics} />

      {/* 3. Quick Operations Bar */}
      <div className="space-y-3">
        <h2 className="text-sm sm:text-base font-bold text-rentify-text-primary">{t('full.quickActionsTitle')}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            variant="interactive"
            onClick={onOpenCreateModal}
            className="p-4 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-container text-rentify-primary">
                <Plus className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-rentify-text-primary group-hover:text-rentify-primary transition-colors truncate">
                  {t('full.addNewBuilding')}
                </p>
                <p className="text-[11px] text-rentify-text-secondary truncate mt-0.5">{t('empty.addFirstBuilding')}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-rentify-text-muted group-hover:text-rentify-primary transition-colors shrink-0 ml-2" />
          </Card>

          <Card
            variant="interactive"
            onClick={() => navigate(ROUTES.LANDLORD.METER_READINGS)}
            className="p-4 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-surface text-teal-primary border border-teal-border">
                <Gauge className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-rentify-text-primary group-hover:text-rentify-primary transition-colors truncate">
                  {t('full.quickMeters')}
                </p>
                <p className="text-[11px] text-rentify-text-secondary truncate mt-0.5">{t('full.quickMetersDesc')}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-rentify-text-muted group-hover:text-rentify-primary transition-colors shrink-0 ml-2" />
          </Card>

          <Card
            variant="interactive"
            onClick={() => navigate(ROUTES.LANDLORD.INVOICES)}
            className="p-4 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-surface text-teal-primary border border-teal-border">
                <Receipt className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-rentify-text-primary group-hover:text-rentify-primary transition-colors truncate">
                  {t('full.quickInvoices')}
                </p>
                <p className="text-[11px] text-rentify-text-secondary truncate mt-0.5">{t('full.quickInvoicesDesc')}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-rentify-text-muted group-hover:text-rentify-primary transition-colors shrink-0 ml-2" />
          </Card>

          <Card
            variant="interactive"
            onClick={() => navigate(ROUTES.LANDLORD.ISSUES)}
            className="p-4 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rentify-warning/10 text-rentify-warning">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-rentify-text-primary group-hover:text-rentify-primary transition-colors truncate">
                  {t('full.quickIssues')}
                </p>
                <p className="text-[11px] text-rentify-text-secondary truncate mt-0.5">{t('full.quickIssuesDesc')}</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-rentify-text-muted group-hover:text-rentify-primary transition-colors shrink-0 ml-2" />
          </Card>
        </div>
      </div>

      {/* 4. Building Portfolio List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-rentify-text-primary">{t('full.myBuildingsList')}</h2>
          <span className="text-xs text-rentify-text-secondary font-medium">
            {t('full.previewCount', { count: buildings.length })}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {buildings.map((building) => (
            <LandlordBuildingCard key={building.id} building={building} />
          ))}
        </div>
      </div>
    </div>
  );
};
