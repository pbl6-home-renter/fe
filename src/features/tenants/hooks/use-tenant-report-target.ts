import { useMemo } from 'react';
import { useContractMembersQuery } from '@/features/contracts/hooks/use-contract-members-query';
import type { ContractTenantDetailDto, ContractTenantMembershipDto } from '../types/tenant.dto';

/**
 * The tenant detail API hides the account id (`tenantId`), so it is read from the
 * contract members of the tenant's latest stay. Only linked tenants have an account
 * that can be reported; the contract becomes the report context.
 */
export const useTenantReportTarget = (
  tenant: ContractTenantDetailDto | undefined,
  memberships: ContractTenantMembershipDto[],
) => {
  const membership = memberships.find((item) => item.isCurrent) ?? memberships[0];
  const contractId = tenant?.isLinked && membership ? membership.contractId : '';
  const membersQuery = useContractMembersQuery(contractId, { pageNo: 1, pageSize: 100 }, Boolean(contractId));

  return useMemo(() => {
    if (!membership || !contractId) return null;
    const member = membersQuery.data?.items.find((item) => item.id === membership.contractMemberId);
    return member?.tenantId ? { userId: member.tenantId, contractId } : null;
  }, [contractId, membersQuery.data, membership]);
};
