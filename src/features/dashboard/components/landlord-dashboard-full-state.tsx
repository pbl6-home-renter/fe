import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes.config';
import { useAuth } from '@/features/auth/hooks/use-auth';
import type { BuildingMyListItemDto } from '@/features/buildings/types/building.dto';
import type { InvoiceListItemDto } from '@/features/invoices/types/invoices.dto';
import type { IssueListItem } from '@/features/issues/types/issue.dto';
import { LandlordHomeBanner } from './landlord/landlord-home-banner';
import { LandlordKpiGrid } from './landlord/landlord-kpi-grid';
import { LandlordFocusTabs } from './landlord/landlord-focus-tabs';
import { LandlordQuickActions } from './landlord/landlord-quick-actions';

export interface LandlordDashboardFullStateProps {
  buildings: BuildingMyListItemDto[];
  metrics: {
    total: number;
    active: number;
    pending: number;
    others: number | null;
    occupiedRooms?: number;
    totalRooms?: number;
    activeContractsCount?: number;
    openIssuesCount?: number;
    totalInvoicesCount?: number;
  };
  recentInvoices?: InvoiceListItemDto[];
  recentIssues?: IssueListItem[];
  isInvoicesLoading?: boolean;
  isIssuesLoading?: boolean;
  onOpenCreateModal?: () => void;
}

export const LandlordDashboardFullState = ({
  metrics,
  recentInvoices = [],
  recentIssues = [],
  isInvoicesLoading,
  isIssuesLoading,
  onOpenCreateModal,
}: LandlordDashboardFullStateProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const userName = user?.name?.trim().split(' ').slice(-1)[0] || user?.name || '';

  return (
    <div className="space-y-6 pb-8 w-full max-w-[1440px] mx-auto">
      {/* 1. Hero Compact Greeting Banner */}
      <LandlordHomeBanner
        userName={userName}
        onOpenCreateModal={onOpenCreateModal}
        onViewAllBuildings={() => navigate(ROUTES.LANDLORD.BUILDINGS)}
      />

      {/* 2. Operational KPIs: Buildings, Occupancy, Active Contracts, Open Issues */}
      <LandlordKpiGrid metrics={metrics} />

      {/* 3. Core Workspace: Left = Action Focus (Issues/Invoices), Right = Quick Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8">
          <LandlordFocusTabs
            issues={recentIssues}
            invoices={recentInvoices}
            isIssuesLoading={isIssuesLoading}
            isInvoicesLoading={isInvoicesLoading}
          />
        </div>

        <div className="lg:col-span-4">
          <LandlordQuickActions layout="vertical" onOpenCreateModal={onOpenCreateModal} />
        </div>
      </div>
    </div>
  );
};
