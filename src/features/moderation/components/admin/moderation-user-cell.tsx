import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import { ROUTES } from '@/config/routes.config';
import { UserStatusBadge } from '@/features/users/components/admin/user-status-badge';
import type { ModerationUserSummaryDto } from '../../types/moderation.dto';

export interface ModerationUserCellProps {
  user: ModerationUserSummaryDto;
  /** Link to the admin user detail page. */
  withLink?: boolean;
  withStatus?: boolean;
  onNavigate?: () => void;
}

export const ModerationUserCell = ({
  user,
  withLink = false,
  withStatus = false,
  onNavigate,
}: ModerationUserCellProps) => {
  const { t } = useTranslation('moderation');
  const name = user.name ?? t('user.unknown');

  return (
    <div className="min-w-0 space-y-0.5">
      <div className="flex min-w-0 items-center gap-2">
        {withLink ? (
          <Link
            to={ROUTES.ADMIN.USER_DETAIL(user.id)}
            onClick={(event) => {
              event.stopPropagation();
              onNavigate?.();
            }}
            className="inline-flex min-w-0 items-center gap-1 rounded-md text-sm font-medium text-rentify-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary"
          >
            <span className="truncate">{name}</span>
            <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
          </Link>
        ) : (
          <span className="truncate text-sm font-medium text-rentify-text-primary">{name}</span>
        )}
        {withStatus && user.status && <UserStatusBadge status={user.status} />}
      </div>
      {user.email && <p className="truncate text-xs text-rentify-text-secondary">{user.email}</p>}
    </div>
  );
};
