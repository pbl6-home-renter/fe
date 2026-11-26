import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, Lock, Pencil, Trash2, Unlock, XCircle } from 'lucide-react';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { AuditLogAction } from '../../enums/audit-log-action.enum';

export interface AuditLogActionBadgeProps {
  action: AuditLogAction;
}

const ACTION_VARIANT_MAP: Record<AuditLogAction, BadgeVariant> = {
  [AuditLogAction.USER_LOCKED]: 'warning',
  [AuditLogAction.USER_UNLOCKED]: 'success',
  [AuditLogAction.USER_UPDATED]: 'primary',
  [AuditLogAction.USER_DELETED]: 'error',
  [AuditLogAction.BUILDING_APPROVED]: 'success',
  [AuditLogAction.BUILDING_REJECTED]: 'error',
};

const ACTION_ICON_MAP: Record<AuditLogAction, ReactNode> = {
  [AuditLogAction.USER_LOCKED]: <Lock className="h-3.5 w-3.5" aria-hidden="true" />,
  [AuditLogAction.USER_UNLOCKED]: <Unlock className="h-3.5 w-3.5" aria-hidden="true" />,
  [AuditLogAction.USER_UPDATED]: <Pencil className="h-3.5 w-3.5" aria-hidden="true" />,
  [AuditLogAction.USER_DELETED]: <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />,
  [AuditLogAction.BUILDING_APPROVED]: <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />,
  [AuditLogAction.BUILDING_REJECTED]: <XCircle className="h-3.5 w-3.5" aria-hidden="true" />,
};

export const AuditLogActionBadge = ({ action }: AuditLogActionBadgeProps) => {
  const { t } = useTranslation('auditLogs');

  return (
    <Badge variant={ACTION_VARIANT_MAP[action] ?? 'default'} leadingIcon={ACTION_ICON_MAP[action]}>
      {t(`actions.${action}`)}
    </Badge>
  );
};
