import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/routes.config';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { IssueCreateDialog } from '@/features/issues/components/issue-create-dialog';
import { IssueDetailPage } from '@/features/issues/pages/issue-detail-page';
import { IssueListPage } from '@/features/issues/pages/issue-list-page';
import { Role } from '@/types/role';
import { ProtectedRoute } from './protected-route';

export const IssueListRoute = () => (
  <ProtectedRoute allowedRoles={[Role.LANDLORD, Role.TENANT]}>
    <IssueListPage />
  </ProtectedRoute>
);
export const IssueDetailRoute = () => (
  <ProtectedRoute allowedRoles={[Role.LANDLORD, Role.TENANT]}>
    <IssueDetailPage />
  </ProtectedRoute>
);
export const IssueCreateRoute = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  return (
    <ProtectedRoute allowedRoles={[Role.LANDLORD, Role.TENANT]}>
      <IssueCreateDialog
        tenant={role === Role.TENANT}
        onClose={() => navigate(ROUTES.ISSUES)}
        onCreated={(id) => navigate(ROUTES.ISSUE_DETAIL(id))}
      />
    </ProtectedRoute>
  );
};
