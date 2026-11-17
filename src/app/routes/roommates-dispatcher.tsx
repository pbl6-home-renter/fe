import { useAuth } from '@/features/auth/hooks/use-auth';
import { DashboardLayout } from '@/app/layouts/dashboard-layout';
import { PublicLayout } from '@/app/layouts/public-layout';
import { RoommatesPage } from '@/features/roommates/pages/roommates-page';
import { LoadingSpinner } from '@/components/feedback/loading-spinner';

export const RoommatesDispatcher = () => {
  const { isAuthenticated, isHydrated, isRestoringSession } = useAuth();

  if (!isHydrated || isRestoringSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rentify-background">
        <LoadingSpinner size="lg" color="primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <DashboardLayout>
        <RoommatesPage />
      </DashboardLayout>
    );
  }

  return (
    <PublicLayout>
      <RoommatesPage />
    </PublicLayout>
  );
};
