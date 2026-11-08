import { useTranslation } from 'react-i18next';
import { Badge, type BadgeVariant } from '@/components/ui/badge';
import { Role } from '@/types/role';

export interface UserRoleBadgeProps {
  role: Role | string;
  className?: string;
}

const roleVariantMap: Record<string, BadgeVariant> = {
  [Role.ADMIN]: 'primary',
  [Role.LANDLORD]: 'secondary',
  [Role.TENANT]: 'default',
};

const roleLabelKeyMap: Record<string, 'roles.admin' | 'roles.landlord' | 'roles.tenant'> = {
  [Role.ADMIN]: 'roles.admin',
  [Role.LANDLORD]: 'roles.landlord',
  [Role.TENANT]: 'roles.tenant',
};

export const UserRoleBadge = ({ role, className }: UserRoleBadgeProps) => {
  const { t } = useTranslation('users');

  const variant = roleVariantMap[role] ?? 'default';
  const labelKey = roleLabelKeyMap[role] ?? 'roles.tenant';
  const label = t(labelKey);

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
};
