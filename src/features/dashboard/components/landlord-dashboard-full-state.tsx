import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  Plus,
  ShieldCheck,
  Clock,
  AlertCircle,
  MapPin,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BuildingStatus } from '@/features/buildings/enums/building-status.enum';
import { BuildingStatusBadge } from '@/features/buildings/components/building-status-badge';
import type { BuildingMyListItemDto } from '@/features/buildings/types/building.dto';

export interface LandlordDashboardFullStateProps {
  buildings: BuildingMyListItemDto[];
  onOpenCreateModal?: () => void;
}

export const LandlordDashboardFullState = ({
  buildings,
  onOpenCreateModal,
}: LandlordDashboardFullStateProps) => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  const metrics = useMemo(() => {
    const total = buildings.length;
    const active = buildings.filter((b) => b.status === BuildingStatus.APPROVED).length;
    const pending = buildings.filter((b) => b.status === BuildingStatus.PENDING).length;
    const others = total - active - pending;
    return { total, active, pending, others };
  }, [buildings]);

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-rentify-text-primary">
            {t('full.dashboardTitle')}
          </h1>
          <p className="text-sm text-rentify-text-secondary mt-1">
            {t('full.dashboardSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/buildings')}
            className="border-rentify-divider"
          >
            {t('full.viewAllBuildings')}
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={onOpenCreateModal}
            className="gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t('full.addNewBuilding')}</span>
          </Button>
        </div>
      </div>

      {/* Metric Cards (100% Real Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-rentify-divider bg-rentify-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rentify-text-secondary">
            <span className="text-xs font-semibold">{t('full.totalBuildings')}</span>
            <Building2 className="w-5 h-5 text-rentify-primary" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-rentify-text-primary tracking-tight">
              {metrics.total}
            </span>
          </div>
        </Card>

        <Card className="p-5 border-rentify-divider bg-rentify-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rentify-text-secondary">
            <span className="text-xs font-semibold">{t('full.activeBuildings')}</span>
            <ShieldCheck className="w-5 h-5 text-rentify-success" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-rentify-success tracking-tight">
              {metrics.active}
            </span>
          </div>
        </Card>

        <Card className="p-5 border-rentify-divider bg-rentify-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rentify-text-secondary">
            <span className="text-xs font-semibold">{t('full.pendingBuildings')}</span>
            <Clock className="w-5 h-5 text-rentify-warning" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-rentify-warning tracking-tight">
              {metrics.pending}
            </span>
          </div>
        </Card>

        <Card className="p-5 border-rentify-divider bg-rentify-surface shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rentify-text-secondary">
            <span className="text-xs font-semibold">{t('full.otherBuildings')}</span>
            <AlertCircle className="w-5 h-5 text-rentify-neutral" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-bold text-rentify-neutral tracking-tight">
              {metrics.others}
            </span>
          </div>
        </Card>
      </div>

      {/* Danh sách Bất động sản của tôi */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-rentify-text-primary">
            {t('full.myBuildingsList')}
          </h2>
          <span className="text-xs text-rentify-text-secondary font-medium">
            {buildings.length} {t('full.totalBuildings').toLowerCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {buildings.map((building) => (
            <Card
              key={building.id}
              onClick={() => navigate(`/buildings/${building.id}`)}
              className="p-5 border-rentify-divider bg-rentify-surface hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-rentify-primary-container/20 text-rentify-primary flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm text-rentify-text-primary group-hover:text-rentify-primary transition-colors truncate">
                        {building.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-rentify-text-secondary mt-0.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{building.address || t('full.unspecifiedAddress')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-rentify-divider flex items-center justify-between">
                  <BuildingStatusBadge status={building.status} variant="pill" />

                  {building.occupancyRate && (
                    <div className="flex items-center gap-1 text-xs text-rentify-text-secondary">
                      <Layers className="w-3.5 h-3.5 text-rentify-text-secondary" />
                      <span>{building.occupancyRate}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-rentify-divider flex items-center justify-between text-xs">
                <span className="text-rentify-text-secondary font-medium">
                  {building.occupiedRooms !== undefined ? `${building.occupiedRooms} phòng thuê` : ''}
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-rentify-primary group-hover:underline">
                  <span>{t('full.viewDetail')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
