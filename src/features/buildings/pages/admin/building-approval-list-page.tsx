import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/feedback/empty-state';
import { ErrorState } from '@/components/feedback/error-state';
import { ApprovalStatusTabs } from '../../components/admin/approval-status-tabs';
import { ApprovalTable } from '../../components/admin/approval-table';
import { BuildingStatus } from '../../enums/building-status.enum';
import { useAdminBuildingsQuery } from '../../hooks/admin/use-admin-buildings-query';

export const BuildingApprovalListPage = () => {
  const { t } = useTranslation('buildings');

  const [selectedStatus, setSelectedStatus] = useState<string>(BuildingStatus.PENDING);
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError, refetch } = useAdminBuildingsQuery({
    pageNo,
    pageSize,
    filter: selectedStatus ? { status: selectedStatus } : undefined,
  });

  const rawBuildings = useMemo(() => data?.items ?? [], [data?.items]);
  const pagination = data?.pagination;

  const buildings = useMemo(() => {
    if (!searchTerm.trim()) return rawBuildings;
    const lower = searchTerm.toLowerCase();
    return rawBuildings.filter((b) => b.name?.toLowerCase().includes(lower));
  }, [rawBuildings, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-rentify-text-primary">
            {t('admin.queueTitle', { defaultValue: 'Hàng đợi phê duyệt bất động sản' })}
          </h1>
          <p className="text-sm text-rentify-text-secondary mt-1">
            {t('admin.queueSubtitle', {
              defaultValue: 'Xem xét và thẩm định hồ sơ đăng ký bất động sản trên hệ thống',
            })}
          </p>
        </div>

        {pagination && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-rentify-divider bg-rentify-surface text-xs font-semibold text-rentify-text-primary self-start md:self-auto shadow-xs">
            <span className="w-2 h-2 rounded-full bg-rentify-warning animate-pulse" />
            <span>
              {t('admin.totalPendingBadge', {
                defaultValue: '{{count}} hồ sơ trong danh sách',
                count: pagination.totalItems,
              })}
            </span>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <ApprovalStatusTabs
          selectedStatus={selectedStatus}
          onSelectStatus={(status) => {
            setSelectedStatus(status);
            setPageNo(1);
          }}
        />

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-rentify-text-secondary" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('admin.searchPlaceholder', { defaultValue: 'Tìm tên tòa nhà...' })}
            className="w-full pl-9 pr-3 py-2 bg-rentify-surface border border-rentify-divider rounded-xl text-xs text-rentify-text-primary placeholder:text-rentify-text-secondary focus:outline-none focus:border-rentify-primary transition-all"
          />
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="p-8 space-y-4">
          <div className="h-6 w-48 bg-surface-container-low animate-pulse rounded" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-surface-container-low animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      ) : isError ? (
        <ErrorState
          title={t('emptyState.title', { defaultValue: 'Đã có lỗi xảy ra' })}
          message={t('emptyState.description', { defaultValue: 'Không thể tải danh sách bất động sản cần duyệt.' })}
          onRetry={() => void refetch()}
        />
      ) : buildings.length === 0 ? (
        <EmptyState
          icon={Building2}
          title={t('admin.emptyTitle', { defaultValue: 'Không có hồ sơ nào' })}
          description={t('admin.emptyDesc', { defaultValue: 'Hiện tại không có bất động sản nào trong danh mục này.' })}
        />
      ) : (
        <>
          <ApprovalTable buildings={buildings} />

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2 text-xs text-rentify-text-secondary">
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
                  onClick={() => setPageNo((prev) => Math.max(prev - 1, 1))}
                  className="px-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNextPage}
                  onClick={() => setPageNo((prev) => prev + 1)}
                  className="px-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
