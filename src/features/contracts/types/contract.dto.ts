import type { BaseEntity } from '@/types/api';
import type { ContractStatus } from '../enums/contract-status.enum';

export interface ContractFilter {
  buildingId?: string;
  status?: ContractStatus | string;
  roomId?: string;
}

export interface ContractListItemDto extends BaseEntity {
  contractCode: string;
  roomId: string;
  roomName: string;
  tenantName: string | null;
  tenantPhone: string | null;
  status: ContractStatus;
  rentPrice: number;
  depositAmount: number;
  startDate: string;
  endDate: string;
}

export interface ContractDetailDto extends BaseEntity {
  roomId: string;
  buildingId?: string | null;
  roomName?: string | null;
  status: ContractStatus;
  tenantId: string | null;
  tenantName: string | null;
  tenantPhone: string | null;
  rentPrice: number;
  depositAmount: number;
  startDate: string;
  endDate: string;
  vehicleCount: number | null;
  description: string | null;
  templateKey?: string | null;
  signedContractMediaId?: string | null;
}

export interface ContractCreateRequestDto {
  roomId: string;
  tenantId?: string | null;
  tenantName?: string | null;
  tenantPhone?: string | null;
  rentPrice: number;
  depositAmount: number;
  startDate: string;
  endDate: string;
  vehicleCount?: number | null;
}

export interface ContractUpdateRequestDto {
  vehicleCount?: number | null;
  description?: string | null;
}

export interface ContractActivateRequestDto {
  signedContractMediaId: string;
}

export interface ContractTemplateListItemDto {
  templateKey: string;
  title: string;
  version: string;
}

export interface ContractTemplateDetailDto {
  templateKey: string;
  title: string;
  version: string;
  requiredVariables?: string[];
}

export interface ContractApplyTemplateRequestDto {
  templateKey: string;
}
