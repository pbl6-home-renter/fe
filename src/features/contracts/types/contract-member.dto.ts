export type ContractMemberStatus = 'active' | 'left';

export interface ContractMemberListItemDto {
  id: string;
  contractId: string;
  tenantId: string | null;
  tenantName: string | null;
  tenantPhone: string | null;
  joinedAt: string;
  leftAt: string | null;
  status: ContractMemberStatus;
}

export interface ContractMemberListFilter {
  contractId: string;
}

export interface AddContractMemberRequestDto {
  contractId: string;
  tenantName: string;
  tenantPhone: string;
  joinedAt: string;
  tenantId?: string | null;
}

export interface LeaveContractMemberRequestDto {
  contractId: string;
  leftOn: string;
}

export interface CompleteContractCheckoutRequestDto {
  completedOn: string;
}

export interface ContractCheckoutCompleteResponseDto {
  contractId: string;
  status: string;
  completedOn: string;
}
