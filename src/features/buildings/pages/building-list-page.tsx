import { useTranslation } from 'react-i18next';
import {
  Building2,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/feedback/skeleton';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { BuildingStatus } from '../enums/building-status.enum';
import { BuildingCreateModal } from '../components/building-create-modal';
import { BuildingMetricsMosaic } from '../components/building-metrics-mosaic';
import { BuildingListTable } from '../components/building-list-table';
import { useBuildingList } from '../hooks/use-building-list';

export const BuildingListPage = () => {
  const { t } = useTranslation('buildings');
  const {
    buildings,
    metrics,
    pagination,
    isLoading,
    isError,
    refetch,
    selectedStatus,
    setSelectedStatus,
    searchTerm,
    setSearchTerm,
    setPageNo,
    handlePrevPage,
    handleNextPage,
    isFiltered,
    handleClearFilter,
    isCreateModalOpen,
    setIsCreateModalOpen,
  } = useBuildingList();

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

      {/* Metrics Mosaic */}
      <BuildingMetricsMosaic metrics={metrics} />

      {/* Toolbar: Segmented Control Tabs + Search Bar */}
      <div className="bg-rentify-surface rounded-2xl border border-rentify-divider p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-xs">
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
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

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-rentify-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('list.searchPlaceholder')}
            className="w-full pl-9 pr-3 py-2 bg-surface-container-low border border-transparent rounded-xl text-xs sm:text-sm text-rentify-text-primary placeholder:text-rentify-text-secondary focus:outline-none focus:bg-rentify-surface focus:border-rentify-primary transition-all"
          />
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      )}

      {/* Error state */}
      {isError && (
        <Card className="p-6">
          <ErrorState onRetry={() => void refetch()} />
        </Card>
      )}

      {/* Empty State */}
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
            onAction={isFiltered ? handleClearFilter : () => setIsCreateModalOpen(true)}
          />
        </Card>
      )}

      {/* Data Table */}
      {!isLoading && !isError && buildings.length > 0 && (
        <div className="space-y-4">
          <BuildingListTable buildings={buildings} />

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between text-xs text-rentify-text-secondary px-2">
              <p>
                {t('pagination.summary', {
                  current: pagination.pageNo,
                  total: pagination.totalPages,
                  totalItems: pagination.totalItems,
                  defaultValue: 'Trang {{current}} / {{total}} ({{totalItems}} kết quả)',
                })}
              </p>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPreviousPage}
                  onClick={handlePrevPage}
                  className="px-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNextPage}
                  onClick={handleNextPage}
                  className="px-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      <BuildingCreateModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => void refetch()}
      />
    </div>
  );
};
