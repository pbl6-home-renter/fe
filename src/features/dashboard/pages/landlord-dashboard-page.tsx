import { BuildingCreateModal } from '@/features/buildings/components/building-create-modal';
import { LandlordDashboardEmptyState } from '../components/landlord-dashboard-empty-state';
import { LandlordDashboardFullState } from '../components/landlord-dashboard-full-state';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/feedback/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { useLandlordDashboard } from '../hooks/use-landlord-dashboard';

export const LandlordDashboardPage = () => {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    isLoading,
    isError,
    refetch,
    buildings,
    metrics,
    recentInvoices,
    recentIssues,
    isInvoicesLoading,
    isIssuesLoading,
  } = useLandlordDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6 pb-8 w-full max-w-[1440px] mx-auto" role="status">
        {/* Banner Skeleton */}
        <div className="rounded-3xl bg-rentify-surface border border-rentify-divider p-6 sm:p-8">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-2.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-96 max-w-full" />
            </div>
            <div className="flex gap-3 self-start md:self-center">
              <Skeleton className="h-9 w-28 rounded-xl" />
              <Skeleton className="h-9 w-36 rounded-xl" />
            </div>
          </div>
        </div>

        {/* KPI Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-5 rounded-2xl flex flex-col justify-between h-28">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>

        {/* Core Workspace Skeleton (8 cols + 4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <Card className="lg:col-span-8 p-5 rounded-2xl space-y-4 h-80">
            <div className="flex justify-between items-center pb-4 border-b border-rentify-divider">
              <Skeleton className="h-9 w-52 rounded-xl" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="space-y-3 pt-2">
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          </Card>

          <Card className="lg:col-span-4 p-5 rounded-2xl space-y-4 h-80">
            <Skeleton className="h-4 w-36 pb-3 border-b border-rentify-divider" />
            <div className="space-y-3 pt-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-2">
                  <Skeleton className="h-9 w-9 rounded-xl" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-2.5 w-36" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (isError || !buildings || !metrics) {
    return <ErrorState onRetry={() => void refetch()} />;
  }

  return (
    <>
      {metrics.total === 0 ? (
        <LandlordDashboardEmptyState onOpenCreateModal={() => setIsCreateModalOpen(true)} />
      ) : (
        <LandlordDashboardFullState
          buildings={buildings}
          metrics={metrics}
          recentInvoices={recentInvoices}
          recentIssues={recentIssues}
          isInvoicesLoading={isInvoicesLoading}
          isIssuesLoading={isIssuesLoading}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />
      )}

      <BuildingCreateModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => void refetch()}
      />
    </>
  );
};
