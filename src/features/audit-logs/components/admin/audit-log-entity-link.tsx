import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Building2, ExternalLink, User } from 'lucide-react';
import { ROUTES } from '@/config/routes.config';
import { AuditLogEntityType } from '../../enums/audit-log-entity-type.enum';

export interface AuditLogEntityLinkProps {
  entityType: AuditLogEntityType;
  entityId: string | null;
  onNavigate?: () => void;
}

const getEntityRoute = (entityType: AuditLogEntityType, entityId: string): string => {
  if (entityType === AuditLogEntityType.USER) {
    return ROUTES.ADMIN.USER_DETAIL(entityId);
  }
  return ROUTES.ADMIN.BUILDING_DETAIL(entityId);
};

export const AuditLogEntityLink = ({ entityType, entityId, onNavigate }: AuditLogEntityLinkProps) => {
  const { t } = useTranslation('auditLogs');
  const typeLabel = t(`entityTypes.${entityType}`);
  const Icon = entityType === AuditLogEntityType.USER ? User : Building2;

  if (!entityId) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-rentify-text-secondary">
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>{typeLabel}</span>
      </span>
    );
  }

  const targetRoute = getEntityRoute(entityType, entityId);
  const shortId = entityId.slice(0, 8);

  return (
    <Link
      to={targetRoute}
      onClick={(event) => {
        event.stopPropagation();
        onNavigate?.();
      }}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-rentify-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rentify-primary rounded-md"
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{typeLabel}</span>
      <span className="text-xs font-normal text-rentify-text-secondary tabular-nums">({shortId})</span>
      <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
    </Link>
  );
};
