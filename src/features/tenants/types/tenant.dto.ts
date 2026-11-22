import type { ContractStatus } from '@/features/contracts/enums/contract-status.enum';

export type ContractTenantScope = 'current' | 'history';

export interface ContractTenantListItemDto {
  contractMemberId: string;
  tenantName: string | null;
  avatarUrl?: string | null;
  isLinked: boolean;
  scope: ContractTenantScope;
  contractCount: number;
}

export interface ContractTenantMembershipDto {
  contractMemberId: string;
  contractId: string;
  roomId: string;
  contractStatus: ContractStatus;
  joinedAt: string;
  leftAt: string | null;
  isCurrent: boolean;
  tenantName: string | null;
  tenantPhone: string | null;
}

export interface ContractTenantDetailDto extends ContractTenantListItemDto {
  memberships: ContractTenantMembershipDto[];
}

export interface ContractTenantListFilter {
  scope?: ContractTenantScope;
}
