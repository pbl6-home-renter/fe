import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/feedback/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { TenantDashboardEmptyState } from '../components/tenant-dashboard-empty-state';
import { TenantDashboardFullState } from '../components/tenant-dashboard-full-state';
import { useTenantDashboard } from '../hooks/use-tenant-dashboard';

export const TenantDashboardPage = () => {
  const { contracts, activeCount, isLoading, isError, refetch } = useTenantDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6" role="status">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 rounded-xl" />
          <Skeleton className="h-4 w-80 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="h-28">
            <Skeleton className="h-full w-full rounded-xl" />
          </Card>
          <Card className="h-28">
            <Skeleton className="h-full w-full rounded-xl" />
          </Card>
          <Card className="h-28">
            <Skeleton className="h-full w-full rounded-xl" />
          </Card>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-6 w-40 rounded-xl" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Skeleton className="h-56 w-full rounded-2xl" />
            <Skeleton className="h-56 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !contracts) {
    return <ErrorState onRetry={() => void refetch()} />;
  }

  if (activeCount === 0) {
    return <TenantDashboardEmptyState />;
  }

  return <TenantDashboardFullState contracts={contracts} activeCount={activeCount} />;
};
