import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, Flag, Scale } from 'lucide-react';
import { ROUTES } from '@/config/routes.config';
import { AppealStatus, ReportStatus } from '../../enums/moderation.enum';
import { useAppealsQuery } from '../../hooks/use-appeals-query';
import { useReportsQuery } from '../../hooks/use-reports-query';

const linkClassName =
  'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary';

/** Admin user detail: pending appeal / pending reports about this user, linking to the filtered queues. */
export const UserModerationLinks = ({ userId }: { userId: string }) => {
  const { t } = useTranslation('moderation');
  const appeals = useAppealsQuery({ userId, status: AppealStatus.PENDING, pageNo: 1, pageSize: 1 });
  const reports = useReportsQuery({ reportedUserId: userId, status: ReportStatus.PENDING, pageNo: 1, pageSize: 1 });

  const pendingAppealCount = appeals.data?.pagination.totalItems ?? 0;
  const pendingReportCount = reports.data?.pagination.totalItems ?? 0;

  if (pendingAppealCount === 0 && pendingReportCount === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {pendingAppealCount > 0 && (
        <Link
          to={`${ROUTES.ADMIN.APPEALS}?userId=${encodeURIComponent(userId)}`}
          className={`${linkClassName} border-rentify-warning/40 bg-rentify-warning/10 text-rentify-warning hover:bg-rentify-warning/20`}
        >
          <Scale className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{t('userLinks.pendingAppeal')}</span>
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      )}
      {pendingReportCount > 0 && (
        <Link
          to={`${ROUTES.ADMIN.REPORTS}?reportedUserId=${encodeURIComponent(userId)}`}
          className={`${linkClassName} border-rentify-error/40 bg-rentify-error/10 text-rentify-error hover:bg-rentify-error/20`}
        >
          <Flag className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{t('userLinks.pendingReports', { count: pendingReportCount })}</span>
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
};
