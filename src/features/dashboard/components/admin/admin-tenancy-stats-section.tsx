import { useTranslation } from 'react-i18next';
import { Building2, Clock, XCircle, Home, TrendingUp, ChevronRight } from 'lucide-react';
import { Card, CardButton } from '@/components/ui/card';
import { Skeleton } from '@/components/feedback/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { formatOccupancyRate } from '../../utils/dashboard-format.utils';
import { AdminRoomDistributionChart } from './admin-room-distribution-chart';
import type { AdminDashboardDto } from '../../types/admin-dashboard.dto';

export interface AdminTenancyStatsSectionProps {
  data?: AdminDashboardDto;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onPendingBuildingsClick: () => void;
}

export const AdminTenancyStatsSection = ({
  data,
  isLoading,
  isError,
  onRetry,
  onPendingBuildingsClick,
}: AdminTenancyStatsSectionProps) => {
  const { t, i18n } = useTranslation('dashboard');

  if (isLoading) {
    return (
      <section className="space-y-4" aria-labelledby="tenancy-stats-heading">
        <div className="space-y-1">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-4 w-80" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="p-5 rounded-2xl flex flex-col justify-between h-32">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>
        <Card className="p-6 rounded-2xl h-44">
          <Skeleton className="h-4 w-40 mb-3" />
          <Skeleton className="h-3.5 w-full rounded-full mb-6" />
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className="space-y-4" aria-labelledby="tenancy-stats-heading">
        <h2 id="tenancy-stats-heading" className="text-lg font-bold text-rentify-text-primary tracking-tight">
          {t('admin.buildingsSectionTitle')}
        </h2>
        <Card className="p-6 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs">
          <ErrorState
            title={t('admin.buildingsErrorTitle')}
            message={t('admin.buildingsErrorDesc')}
            onRetry={onRetry}
          />
        </Card>
      </section>
    );
  }

  const { totalBuildings, pendingApprovalBuildings, rejectedBuildings, totalRooms, roomsByStatus, occupancyRate } =
    data;

  const formattedOccupancy = formatOccupancyRate(occupancyRate, i18n.language);

  return (
    <section className="space-y-4" aria-labelledby="tenancy-stats-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <h2 id="tenancy-stats-heading" className="text-lg font-bold text-rentify-text-primary tracking-tight">
            {t('admin.buildingsSectionTitle')}
          </h2>
          <p className="text-xs text-rentify-text-secondary mt-0.5">{t('admin.buildingsSectionSubtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {/* 1. Tòa đang hoạt động */}
        <Card className="p-5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rentify-text-secondary">
            <span className="text-xs font-semibold">{t('admin.activeBuildings')}</span>
            <Building2 className="w-4 h-4 text-rentify-primary" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-rentify-text-primary tracking-tight tabular-nums">
              {totalBuildings}
            </span>
            <span className="text-[11px] font-semibold text-rentify-success bg-rentify-success/10 px-2 py-0.5 rounded-full">
              {t('full.statusActiveTag')}
            </span>
          </div>
        </Card>

        {/* 2. Tòa chờ duyệt (Bấm vào -> danh sách duyệt tòa) */}
        <CardButton
          onClick={onPendingBuildingsClick}
          className="p-5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex flex-col justify-between group"
          aria-label={t('admin.pendingBuildingsHint')}
        >
          <div className="flex items-center justify-between text-rentify-text-secondary">
            <span className="text-xs font-semibold text-rentify-warning">{t('admin.pendingBuildings')}</span>
            <Clock className="w-4 h-4 text-rentify-warning" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-rentify-warning tracking-tight tabular-nums">
              {pendingApprovalBuildings}
            </span>
            <span className="text-[11px] font-semibold text-rentify-warning bg-rentify-warning/10 px-2 py-0.5 rounded-full flex items-center gap-0.5 group-hover:bg-rentify-warning/15 transition-colors">
              {t('admin.reviewQueueTag')}
              <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </CardButton>

        {/* 3. Tòa bị từ chối */}
        <Card className="p-5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rentify-text-secondary">
            <span className="text-xs font-semibold">{t('admin.rejectedBuildings')}</span>
            <XCircle className="w-4 h-4 text-rentify-error" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-rentify-error tracking-tight tabular-nums">
              {rejectedBuildings}
            </span>
            <span className="text-[11px] font-semibold text-rentify-error bg-rentify-error/10 px-2 py-0.5 rounded-full">
              {t('admin.rejectedTag')}
            </span>
          </div>
        </Card>

        {/* 4. Tổng số phòng */}
        <Card className="p-5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rentify-text-secondary">
            <span className="text-xs font-semibold">{t('admin.totalRooms')}</span>
            <Home className="w-4 h-4 text-rentify-primary" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-rentify-text-primary tracking-tight tabular-nums">
              {totalRooms}
            </span>
            <span className="text-[11px] font-semibold text-rentify-primary bg-primary-container/20 px-2 py-0.5 rounded-full">
              {t('admin.allTag')}
            </span>
          </div>
        </Card>

        {/* 5. Tỉ lệ lấp đầy */}
        <Card className="p-5 rounded-2xl bg-rentify-surface border border-rentify-divider shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rentify-text-secondary">
            <span className="text-xs font-semibold">{t('admin.occupancyRate')}</span>
            <TrendingUp className="w-4 h-4 text-rentify-primary" />
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-rentify-primary tracking-tight tabular-nums">
              {formattedOccupancy}
            </span>
            <span className="text-[11px] font-semibold text-rentify-primary bg-primary-container/20 px-2 py-0.5 rounded-full">
              {occupancyRate >= 70 ? t('admin.occupancyHighTag') : t('admin.occupancyNormalTag')}
            </span>
          </div>
        </Card>
      </div>

      {/* Biểu đồ phân bổ phòng theo trạng thái */}
      <AdminRoomDistributionChart totalRooms={totalRooms} roomsByStatus={roomsByStatus} />
    </section>
  );
};
