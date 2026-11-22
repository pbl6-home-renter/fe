import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { notify } from '@/lib/notifications/notify';
import { useTenantQuery } from './use-tenant-query';
import type { ContractTenantMembershipDto } from '../types/tenant.dto';

export const useTenantDetail = (contractMemberId: string) => {
  const { t } = useTranslation('tenants');
  const query = useTenantQuery(contractMemberId);
  const tenant = query.data;

  const memberships = useMemo<ContractTenantMembershipDto[]>(() => {
    if (!tenant?.memberships) return [];
    const list = [...tenant.memberships];
    return list.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());
  }, [tenant]);

  // Current phone is taken from current membership first, or fallback to the latest membership phone
  const phone = useMemo(() => {
    if (!memberships.length) return null;
    const currentMembership = memberships.find((m) => m.isCurrent);
    return currentMembership?.tenantPhone || memberships[0]?.tenantPhone || null;
  }, [memberships]);

  const handleCopyPhone = () => {
    if (!phone) return;
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(phone);
      notify.success(t('detail.copiedPhone'));
    }
  };

  return {
    tenant,
    phone,
    memberships,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    handleCopyPhone,
  };
};
