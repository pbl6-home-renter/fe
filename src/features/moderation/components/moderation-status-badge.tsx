import { useTranslation } from 'react-i18next';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import type { AppealStatus, ReportStatus } from '../enums/moderation.enum';

const APPEAL_VARIANTS: Record<AppealStatus, BadgeVariant> = {
  pending: 'warning',
  accepted: 'success',
  rejected: 'error',
};

const REPORT_VARIANTS: Record<ReportStatus, BadgeVariant> = {
  pending: 'warning',
  dismissed: 'default',
  actioned: 'success',
};

export const AppealStatusBadge = ({ status }: { status: AppealStatus }) => {
  const { t } = useTranslation('moderation');
  return <Badge variant={APPEAL_VARIANTS[status] ?? 'default'}>{t(`appealStatus.${status}`)}</Badge>;
};

export const ReportStatusBadge = ({ status }: { status: ReportStatus }) => {
  const { t } = useTranslation('moderation');
  return <Badge variant={REPORT_VARIANTS[status] ?? 'default'}>{t(`reportStatus.${status}`)}</Badge>;
};
