import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Building2,
  Plus,
  Search,
  MapPin,
  TrendingUp,
  DoorClosed,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/feedback/skeleton';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { BuildingStatus } from '../enums/building-status.enum';
import { BuildingStatusBadge } from '../components/building-status-badge';
import { BuildingCreateModal } from '../components/building-create-modal';
import { useMyBuildingsQuery } from '../hooks/use-my-buildings-query';

export const BuildingListPage = () => {
  const { t } = useTranslation('buildings');
  const navigate = useNavigate();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 10;

  const filterParam = selectedStatus !== 'all'
    ? { status: selectedStatus as BuildingStatus }
    : undefined;

  const { data, isLoading, isError, refetch } = useMyBuildingsQuery({
    pageNo,
    pageSize,
    filter: filterParam,
  });

  const rawBuildings = useMemo(() => data?.items ?? [], [data?.items]);
  const pagination = data?.pagination;

  // Client-side filtering by name / address
  const buildings = useMemo(() => {
    if (!searchTerm.trim()) return rawBuildings;
    const lower = searchTerm.toLowerCase();
    return rawBuildings.filter(
      (b) =>
        b.name?.toLowerCase().includes(lower) ||
        b.address?.toLowerCase().includes(lower)
    );
  }, [rawBuildings, searchTerm]);

  // Aggregate metrics
  const metrics = useMemo(() => {
    const totalBuildings = pagination?.totalItems ?? rawBuildings.length;
    let totalRooms = 0;
    let occupiedRooms = 0;
    let approvedCount = 0;

    rawBuildings.forEach((b) => {
      totalRooms += b.totalRooms || 0;
      occupiedRooms += b.occupiedRooms || 0;
      if (b.status === BuildingStatus.APPROVED) approvedCount += 1;
    });

    const occupancyRate = totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(1) : '0';

    return {
      totalBuildings,
      totalRooms,
      occupiedRooms,
      occupancyRate,
      approvedCount,
    };
  }, [rawBuildings, pagination]);

  const handlePrevPage = () => {
    if (pagination?.hasPreviousPage) {
      setPageNo((p) => Math.max(1, p - 1));
    }
  };

  const handleNextPage = () => {
    if (pagination?.hasNextPage) {
      setPageNo((p) => p + 1);
    }
  };

  const isFiltered = selectedStatus !== 'all' || searchTerm.trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-rentify-text-primary">
            {t('title')}
          </h1>
          <p className="text-sm text-rentify-text-secondary mt-1">
            {t('subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCreateModalOpen(true)}
            className="gap-2 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t('createBuilding')}</span>
          </Button>
        </div>
      </div>

      {/* 4 Thẻ Thống kê tổng hợp (Metric Cards Mosaic) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Thẻ 1: Tổng số tòa nhà */}
        <div className="bg-rentify-surface p-5 rounded-2xl border border-rentify-divider shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rentify-text-secondary">
            <span className="text-xs font-semibold">{t('list.totalBuildings')}</span>
            <Building2 className="w-5 h-5 text-rentify-primary" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rentify-text-primary tracking-tight">
              {metrics.totalBuildings}
            </span>
            <span className="text-xs text-rentify-text-secondary">{t('list.buildingsUnit')}</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-rentify-success text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-rentify-success" />
            <span>{t('list.approvedBuildings', { count: metrics.approvedCount })}</span>
          </div>
        </div>

        {/* Thẻ 2: Quy mô phòng */}
        <div className="bg-rentify-surface p-5 rounded-2xl border border-rentify-divider shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rentify-text-secondary">
            <span className="text-xs font-semibold">{t('list.totalRooms')}</span>
            <DoorClosed className="w-5 h-5 text-rentify-primary" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rentify-text-primary tracking-tight">
              {metrics.totalRooms}
            </span>
            <span className="text-xs text-rentify-text-secondary">{t('list.roomsUnit')}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-rentify-text-secondary">
            <span>{t('list.occupiedRoomsCount', { count: metrics.occupiedRooms })}</span>
            <span>{t('list.emptyRoomsCount', { count: Math.max(0, metrics.totalRooms - metrics.occupiedRooms) })}</span>
          </div>
        </div>

        {/* Thẻ 3: Tỷ lệ lấp đầy */}
        <div className="bg-rentify-surface p-5 rounded-2xl border border-rentify-divider shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rentify-text-secondary">
            <span className="text-xs font-semibold">{t('list.occupancyRate')}</span>
            <TrendingUp className="w-5 h-5 text-rentify-success" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rentify-text-primary tracking-tight">
              {metrics.occupancyRate}%
            </span>
            <span className="text-xs text-rentify-text-secondary">{t('list.occupiedRooms')}</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-rentify-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Number(metrics.occupancyRate))}%` }}
            />
          </div>
        </div>

        {/* Thẻ 4: Tình trạng phê duyệt */}
        <div className="bg-rentify-surface p-5 rounded-2xl border border-rentify-divider shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-rentify-text-secondary">
            <span className="text-xs font-semibold">{t('list.approvalStatus')}</span>
            <ShieldCheck className="w-5 h-5 text-rentify-primary" />
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-rentify-text-primary tracking-tight">
              {metrics.approvedCount}/{metrics.totalBuildings}
            </span>
            <span className="text-xs text-rentify-text-secondary">
              {t('list.approvedRatio', { approved: metrics.approvedCount, total: metrics.totalBuildings })}
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-rentify-text-secondary text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rentify-neutral" />
            <span>
              {metrics.totalBuildings - metrics.approvedCount > 0
                ? t('list.pendingNotice', { count: metrics.totalBuildings - metrics.approvedCount })
                : t('list.allApproved')}
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar: Segmented Control Tabs + Search Bar */}
      <div className="bg-rentify-surface rounded-2xl border border-rentify-divider p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
        {/* Filter Segmented Buttons */}
        <div className="inline-flex items-center p-1 bg-surface-container-low rounded-xl overflow-x-auto">
          {[
            { id: 'all', label: t('filter.all') },
            { id: BuildingStatus.APPROVED, label: t('status.approved') },
            { id: BuildingStatus.PENDING, label: t('status.pending') },
            { id: BuildingStatus.REJECTED, label: t('status.rejected') },
          ].map((tab) => {
            const isActive = selectedStatus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedStatus(tab.id);
                  setPageNo(1);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-rentify-surface text-rentify-text-primary shadow-xs'
                    : 'text-rentify-text-secondary hover:text-rentify-text-primary'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Ô Tìm kiếm */}
        <div className="relative sm:w-72">
          <Search className="w-4 h-4 text-rentify-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('list.searchPlaceholder')}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-transparent rounded-xl text-xs sm:text-sm text-rentify-text-primary placeholder:text-rentify-text-secondary focus:outline-none focus:bg-rentify-surface focus:border-rentify-primary transition-all"
          />
        </div>
      </div>

      {/* Trạng thái Loading */}
      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      )}

      {/* Trạng thái Lỗi */}
      {isError && (
        <Card className="p-6">
          <ErrorState onRetry={() => void refetch()} />
        </Card>
      )}

      {/* Trạng thái Trống (Empty State) */}
      {!isLoading && !isError && buildings.length === 0 && (
        <Card className="p-8 rounded-2xl border-rentify-divider">
          <EmptyState
            icon={Building2}
            title={isFiltered ? t('empty.filteredTitle') : t('empty.title')}
            description={
              isFiltered
                ? t('empty.filteredDescription')
                : t('empty.description')
            }
            actionText={isFiltered ? t('filter.clearFilter') : t('empty.createAction')}
            onAction={
              isFiltered
                ? () => {
                    setSelectedStatus('all');
                    setSearchTerm('');
                  }
                : () => setIsCreateModalOpen(true)
            }
          />
        </Card>
      )}

      {/* Bảng dữ liệu tòa nhà */}
      {!isLoading && !isError && buildings.length > 0 && (
        <div className="space-y-4">
          <div className="bg-rentify-surface border border-rentify-divider rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-rentify-divider text-rentify-text-secondary text-xs font-semibold">
                    <th className="py-3.5 px-5" scope="col">{t('columns.name')}</th>
                    <th className="py-3.5 px-4" scope="col">{t('columns.address')}</th>
                    <th className="py-3.5 px-4" scope="col">{t('list.approvalStatus')}</th>
                    <th className="py-3.5 px-4" scope="col">{t('columns.rooms')}</th>
                    <th className="py-3.5 px-4 min-w-[130px]" scope="col">{t('list.occupancyRate')}</th>
                    <th className="py-3.5 px-5 text-right" scope="col">{t('common.actions', { defaultValue: 'Thao tác' })}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rentify-divider">
                  {buildings.map((building) => {
                    const occRate = Number(building.occupancyRate) || 0;
                    return (
                      <tr
                        key={building.id}
                        onClick={() => navigate(`/buildings/${building.id}`)}
                        className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                      >
                        {/* Tên tòa nhà */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-rentify-primary-container/20 text-rentify-primary flex items-center justify-center shrink-0">
                              <Building2 className="w-5 h-5" />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-semibold text-sm text-rentify-text-primary group-hover:text-rentify-primary transition-colors truncate">
                                {building.name}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Địa chỉ */}
                        <td className="py-4 px-4 max-w-xs">
                          <div className="flex items-start gap-1.5 text-xs text-rentify-text-primary">
                            <MapPin className="w-3.5 h-3.5 text-rentify-text-secondary shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{building.address || '—'}</span>
                          </div>
                        </td>

                        {/* Tình trạng phê duyệt */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <BuildingStatusBadge status={building.status} />
                        </td>

                        {/* Số lượng phòng */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-rentify-text-primary">
                              {t('list.rooms', { count: building.totalRooms ?? 0 })}
                            </span>
                            <span className="text-xs text-rentify-text-secondary">
                              {t('list.occupiedRoomsCount', { count: building.occupiedRooms ?? 0 })}
                            </span>
                          </div>
                        </td>

                        {/* Tỷ lệ lấp đầy */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-rentify-text-secondary">{t('list.occupancy')}</span>
                              <span className="font-bold text-rentify-text-primary">{building.occupancyRate}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-rentify-success h-full rounded-full transition-all"
                                style={{ width: `${Math.min(100, occRate)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Thao tác */}
                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-2 justify-end">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/buildings/${building.id}`);
                              }}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-rentify-primary hover:underline cursor-pointer"
                            >
                              <span>{t('list.quickAction')}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Phân trang */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={!pagination.hasPreviousPage}
                className="gap-1 border-rentify-divider"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{t('pagination.prev')}</span>
              </Button>

              <span className="text-xs text-rentify-text-secondary font-medium">
                {t('pagination.pageOf', { current: pagination.pageNo, total: pagination.totalPages })}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={!pagination.hasNextPage}
                className="gap-1 border-rentify-divider"
              >
                <span>{t('pagination.next')}</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      <BuildingCreateModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => void refetch()}
      />
    </div>
  );
};
