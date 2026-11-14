import { useTranslation } from 'react-i18next';
import { CreditCard, Mail, Phone, Shield, User as UserIcon } from 'lucide-react';
import { UserAvatar } from '../user-avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Role } from '@/types/role';
import { UserStatus } from '@/types/user';
import type { UserDetailAdminDto } from '../../types/users.dto';
import { UserRoleBadge } from './user-role-badge';
import { UserStatusBadge } from './user-status-badge';

const roleLabelKeyMap: Record<string, 'roles.admin' | 'roles.landlord' | 'roles.tenant'> = {
  [Role.ADMIN]: 'roles.admin',
  [Role.LANDLORD]: 'roles.landlord',
  [Role.TENANT]: 'roles.tenant',
};

export const UserInfoCard = ({ user }: { user: UserDetailAdminDto }) => {
  const { t } = useTranslation('users');

  const roleKey = roleLabelKeyMap[user.role] ?? 'roles.tenant';
  const statusKey = user.status === UserStatus.LOCKED ? 'status.locked' : 'status.active';

  return (
    <Card className="space-y-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold text-rentify-text-primary">
          <UserIcon className="h-5 w-5 text-rentify-primary" />
          <span>{t('detail.personalInfoTitle')}</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 pt-2">
        <div className="flex items-center gap-4">
          <UserAvatar name={user.name} src={user.avatarUrl} size="lg" />
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold text-rentify-text-primary">{user.name}</h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <UserRoleBadge role={user.role} />
              <UserStatusBadge status={user.status} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1 rounded-xl border border-rentify-divider bg-rentify-surface-container-low p-3.5">
            <div className="flex items-center gap-2 text-xs font-medium text-rentify-text-secondary">
              <Mail className="h-4 w-4" />
              <span>{t('fields.email')}</span>
            </div>
            <p className="truncate text-sm font-semibold text-rentify-text-primary">{user.email}</p>
          </div>

          <div className="space-y-1 rounded-xl border border-rentify-divider bg-rentify-surface-container-low p-3.5">
            <div className="flex items-center gap-2 text-xs font-medium text-rentify-text-secondary">
              <Phone className="h-4 w-4" />
              <span>{t('fields.phone')}</span>
            </div>
            <p className="tabular-nums text-sm font-semibold text-rentify-text-primary">{user.phone || '—'}</p>
          </div>

          <div className="space-y-1 rounded-xl border border-rentify-divider bg-rentify-surface-container-low p-3.5">
            <div className="flex items-center gap-2 text-xs font-medium text-rentify-text-secondary">
              <Shield className="h-4 w-4" />
              <span>{t('fields.role')}</span>
            </div>
            <p className="text-sm font-semibold text-rentify-text-primary">{t(roleKey)}</p>
          </div>

          <div className="space-y-1 rounded-xl border border-rentify-divider bg-rentify-surface-container-low p-3.5">
            <div className="flex items-center gap-2 text-xs font-medium text-rentify-text-secondary">
              <span>{t('fields.status')}</span>
            </div>
            <p className="text-sm font-semibold text-rentify-text-primary">{t(statusKey)}</p>
          </div>
        </div>

        {user.payoutAccount && (
          <div className="space-y-3 rounded-xl border border-rentify-divider bg-rentify-surface-container-low p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-rentify-text-secondary">
              <CreditCard className="h-4 w-4 text-rentify-primary" />
              <span>{t('detail.payoutAccountTitle')}</span>
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-3">
              <div>
                <span className="text-rentify-text-secondary">{t('detail.bankCode')}: </span>
                <span className="font-semibold text-rentify-text-primary">{user.payoutAccount.bankCode}</span>
              </div>
              <div>
                <span className="text-rentify-text-secondary">{t('detail.accountNumber')}: </span>
                <span className="font-semibold text-rentify-text-primary tabular-nums">
                  {user.payoutAccount.accountNumber}
                </span>
              </div>
              <div>
                <span className="text-rentify-text-secondary">{t('detail.accountName')}: </span>
                <span className="font-semibold text-rentify-text-primary">{user.payoutAccount.accountName}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
