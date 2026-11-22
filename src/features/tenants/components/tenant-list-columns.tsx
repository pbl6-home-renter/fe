import { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config/routes.config';
import { TenantScopeBadge } from './tenant-scope-badge';
import { TenantLinkedBadge } from './tenant-linked-badge';
import type { ContractTenantListItemDto } from '../types/tenant.dto';

export const useTenantListColumns = (): ColumnDef<ContractTenantListItemDto>[] => {
  const { t } = useTranslation('tenants');
  const navigate = useNavigate();

  return useMemo<ColumnDef<ContractTenantListItemDto>[]>(
    () => [
      {
        id: 'tenantName',
        accessorKey: 'tenantName',
        header: t('columns.tenantName'),
        size: 300,
        minSize: 220,
        enableSorting: true,
        meta: { label: t('columns.tenantName'), pinnable: true },
        enableHiding: false,
        cell: ({ row }) => {
          const tenant = row.original;
          const displayName = tenant.tenantName || t('detail.unnamedTenant');
          return (
            <Link
              to={ROUTES.LANDLORD.TENANT_DETAIL(tenant.contractMemberId)}
              className="flex items-center gap-3 min-w-0 py-0.5 group/tenant cursor-pointer"
            >
              <Avatar
                src={tenant.avatarUrl}
                name={displayName}
                size="sm"
                colorSeed={tenant.contractMemberId}
                className="shrink-0 transition-transform group-hover/tenant:scale-105"
              />
              <div className="min-w-0">
                <span className="font-semibold text-rentify-text-primary truncate block group-hover/tenant:text-rentify-primary transition-colors">
                  {displayName}
                </span>
              </div>
            </Link>
          );
        },
      },
      {
        id: 'scope',
        accessorKey: 'scope',
        header: t('columns.scope'),
        size: 180,
        minSize: 140,
        enableSorting: false,
        meta: { label: t('columns.scope') },
        cell: ({ row }) => <TenantScopeBadge scope={row.original.scope} />,
      },
      {
        id: 'isLinked',
        accessorKey: 'isLinked',
        header: t('columns.isLinked'),
        size: 220,
        minSize: 170,
        enableSorting: false,
        meta: { label: t('columns.isLinked') },
        cell: ({ row }) => <TenantLinkedBadge isLinked={row.original.isLinked} />,
      },
      {
        id: 'contractCount',
        accessorKey: 'contractCount',
        header: t('columns.contractCount'),
        size: 180,
        minSize: 140,
        enableSorting: false,
        meta: { label: t('columns.contractCount'), align: 'right' },
        cell: ({ row }) => (
          <div className="text-right">
            <span className="tabular-nums font-semibold text-rentify-text-primary text-sm">
              {t('detail.totalContracts', { count: row.original.contractCount })}
            </span>
          </div>
        ),
      },
      {
        id: 'actions',
        header: t('columns.actions'),
        enableSorting: false,
        enableHiding: false,
        enableResizing: false,
        size: 160,
        minSize: 140,
        meta: { label: t('columns.actions'), align: 'right', pinnable: true, hideable: false },
        cell: ({ row }) => (
          <div className="flex justify-end pr-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 text-rentify-primary hover:text-rentify-primary hover:bg-rentify-primary-container/50 font-medium"
              onClick={(event) => {
                event.stopPropagation();
                navigate(ROUTES.LANDLORD.TENANT_DETAIL(row.original.contractMemberId));
              }}
            >
              <span>{t('viewDetail')}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        ),
      },
    ],
    [navigate, t],
  );
};
